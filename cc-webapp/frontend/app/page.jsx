'use client';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import TokenDisplay from '@/components/TokenDisplay';
import GameMenu from '@/components/GameMenu';
import { fetchTokenBalance } from '@/services/auth';

export default function HomePage() {
  const [accessToken, setAccessToken] = useState(null);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    if (stored) {
      setAccessToken(stored);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchTokenBalance(accessToken).then(setTokens).catch(() => setTokens(null));
    }
  }, [accessToken]);

  const handleLoggedIn = (token) => {
    setAccessToken(token);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center bg-gray-800 shadow">
        <h1 className="text-2xl font-bold">Cyber Casino</h1>
        {accessToken && <TokenDisplay tokens={tokens} />}
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {!accessToken ? (
          <LoginForm onLoggedIn={handleLoggedIn} />
        ) : (
          <GameMenu />
        )}
      </main>
      <footer className="text-center p-4 text-xs text-gray-400 bg-gray-800">
        &copy; {new Date().getFullYear()} Cyber Casino
      </footer>
    </div>
  );
}
