'use client';

import { useState, useEffect } from 'react';
import SlotMachine from '@/components/SlotMachine';

export default function SlotPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) setToken(stored);
  }, []);

  if (!token) {
    return <p className="text-center p-4">Please login first.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <SlotMachine token={token} />
    </div>
  );
}
