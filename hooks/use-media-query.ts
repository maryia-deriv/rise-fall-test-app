'use client';

import { useSyncExternalStore } from 'react';

/**
 * Returns whether the current viewport matches the given CSS media query.
 * Defaults to false on the server and in environments where matchMedia is
 * unavailable (e.g. JSDOM in tests).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    callback => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () =>
      typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
    () => false
  );
}
