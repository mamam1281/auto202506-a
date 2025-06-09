import React, { useState } from 'react';

function InviteCodeInput() {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle invite code validation
    console.log('Invite code submitted:', code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Invite Code</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Invite Code"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default InviteCodeInput;
