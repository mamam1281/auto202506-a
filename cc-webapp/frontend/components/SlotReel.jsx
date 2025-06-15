'use client';

export default function SlotReel({ symbol, spinning }) {
  const className = 'reel' + (spinning ? ' spin' : '');
  return <div className={className}>{symbol}</div>;
}
