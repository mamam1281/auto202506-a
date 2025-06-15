'use client';

export default function TokenDisplay({ tokens }) {
  return (
    <div className="text-yellow-400 font-semibold">
      Tokens: {tokens != null ? tokens : 'N/A'}
    </div>
  );
}
