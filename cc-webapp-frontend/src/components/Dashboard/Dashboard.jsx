import React from 'react';
import TokenDisplay from './TokenDisplay';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <TokenDisplay tokens={0} />
    </div>
  );
}

export default Dashboard;
