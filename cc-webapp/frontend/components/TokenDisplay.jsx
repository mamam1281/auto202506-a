'use client';

import { useState, useEffect } from 'react';
import { fetchTokenBalance } from '@/services/auth';

export default function TokenDisplay({ token }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    fetchTokenBalance(token)
      .then((data) => {
        if (mounted) setBalance(data.cyber_tokens);
      })
      .catch(() => {
        if (mounted) setBalance(null);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  if (!token) return null;

  return (
    <div className="text-yellow-400 font-semibold">Tokens: {balance ?? '...'}</div>
  );
}
