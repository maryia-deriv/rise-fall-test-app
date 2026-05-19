'use client';

import { useState, useEffect } from 'react';
import type { DerivWS } from '@deriv/core';

export interface OpenPosition {
  contract_id: number;
  contract_type: string;
  buy_price: string;
  bid_price: string;
  payout: string;
  profit: string;
  profit_percentage: number;
  longcode: string;
  underlying_symbol: string;
  barrier: string | undefined;
  currency: string;
  date_start: number;
  date_expiry: number;
  status: string;
  is_expired: number;
  is_sold: number;
  is_valid_to_sell: number;
  tick_count: number;
}

export function useOpenPositions(
  ws: DerivWS | null,
  isConnected: boolean,
  isAuthenticated: boolean
) {
  const [positions, setPositions] = useState<OpenPosition[]>([]);

  useEffect(() => {
    if (!ws || !isConnected || !isAuthenticated) {
      return () => { setPositions([]); };
    }

    // Use global message listener — each open contract has its own subscription.id
    // so we can't use ws.subscribe() for all of them; onMessage catches everything.
    const unsubscribe = ws.onMessage((data) => {
      if (data.msg_type !== 'proposal_open_contract') return;
      const contract = data.proposal_open_contract as OpenPosition | undefined;
      if (!contract) return;

      setPositions((prev) => {
        const map = new Map(prev.map((p) => [p.contract_id, p]));
        if (contract.is_sold || contract.is_expired || contract.status !== 'open') {
          map.delete(contract.contract_id);
        } else {
          map.set(contract.contract_id, contract);
        }
        return Array.from(map.values());
      });
    });

    // Kick off subscription — server sends one message per open contract,
    // each with its own subscription.id for live updates.
    ws.send({ proposal_open_contract: 1, subscribe: 1 }).catch(() => {});

    return () => {
      unsubscribe();
      setPositions([]);
    };
  }, [ws, isConnected, isAuthenticated]);

  return { positions };
}
