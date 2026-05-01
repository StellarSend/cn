'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * Real-time stream balance hook.
 * Starts from 0n on server to avoid SSR/client hydration mismatch (#38).
 */
export function useStreamBalance(
  ratePerSecond: bigint,
  lastWithdrawn: bigint,
  startTime:     number,
  stopTime:      number,
  tick = 200,
) {
  const [balance, setBalance]   = useState(0n); // always 0n on SSR
  const [mounted, setMounted]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mark as mounted only on client
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    const compute = () => {
      const now = Math.floor(Date.now() / 1000);
      if (now <= startTime) { setBalance(0n); return; }
      const elapsed = BigInt(Math.min(now, stopTime) - startTime);
      const accrued = ratePerSecond * elapsed;
      setBalance(accrued > lastWithdrawn ? accrued - lastWithdrawn : 0n);
    };

    compute();
    timerRef.current = setInterval(compute, tick);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mounted, ratePerSecond, lastWithdrawn, startTime, stopTime, tick]);

  return balance;
}
