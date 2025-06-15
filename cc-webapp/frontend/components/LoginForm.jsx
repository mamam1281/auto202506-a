'use client';
import { useState } from 'react';
import { login } from '@/services/auth';

export default function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await login(username, password);
      if (token && onLoggedIn) {
        onLoggedIn(token);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-sm mx-auto">
      <h2 className="text-xl mb-4 text-white text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
