'use client';

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { DerivWS } from '../ws';

interface UseDerivWSReturn {
  ws: DerivWS | null;
  isConnected: boolean;
  isExhausted: boolean;
  error: string | null;
}

/**
 * Hook to manage a DerivWS connection.
 * @param url - Optional WebSocket URL. When omitted, connects to the public WS.
 *              Pass an authenticated OTP URL to upgrade to an authenticated session.
 *              Reconnects automatically when the URL changes.
 */
export function useDerivWS(url?: string): UseDerivWSReturn {
  const wsRef = useRef<DerivWS | null>(null);
  const listenersRef = useRef(new Set<() => void>());
  const [isConnected, setIsConnected] = useState(false);
  const [isExhausted, setIsExhausted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => { listenersRef.current.delete(listener); };
  }, []);

  const getSnapshot = useCallback(() => wsRef.current, []);

  useEffect(() => {
    let disposed = false;

    const instance = new DerivWS(url);
    wsRef.current = instance;
    listenersRef.current.forEach((l) => l());

    // Listen for connection state changes (including reconnections)
    const unsubscribeState = instance.onConnectionStateChange((connected) => {
      if (!disposed) {
        setIsConnected(connected);
        if (connected) {
          setError(null);
        }
      }
    });

    const unsubscribeExhausted = instance.onReconnectExhausted(() => {
      if (!disposed) setIsExhausted(true);
    });

    instance.connect()
      .catch((err) => {
        if (!disposed) {
          setError(err instanceof Error ? err.message : 'Connection failed');
        }
      });

    const listeners = listenersRef.current;
    return () => {
      disposed = true;
      setIsConnected(false);
      setIsExhausted(false);
      unsubscribeState();
      unsubscribeExhausted();
      instance.disconnect();
      wsRef.current = null;
      listeners.forEach((l) => l());
    };
  }, [url]);

  const ws = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return { ws, isConnected, isExhausted, error };
}
