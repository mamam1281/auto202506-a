'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import TokenDisplay from '@/components/TokenDisplay';
import GameMenu from '@/components/GameMenu';

export default function HomePage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (t) => {
    setToken(t);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center bg-gray-800">
        <h1 className="text-xl font-bold">Casino MVP</h1>
        <TokenDisplay token={token} />
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {token ? <GameMenu /> : <LoginForm onLogin={handleLogin} />}
      </main>
      <footer className="p-4 text-center text-xs text-gray-400">© 2024 Casino MVP</footer>
    </div>
  );
}
