import React, { useState } from 'react';

function NicknamePasswordForm() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: submit nickname and password to backend
    console.log('Register', nickname, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default NicknamePasswordForm;
