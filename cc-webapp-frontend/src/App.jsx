import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InviteCodeInput from './components/Auth/InviteCodeInput';
import NicknamePasswordForm from './components/Auth/NicknamePasswordForm';
import Dashboard from './components/Dashboard/Dashboard';
import SlotMachine from './components/Games/SlotMachine';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InviteCodeInput />} />
        <Route path="/register" element={<NicknamePasswordForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slot" element={<SlotMachine />} />
      </Routes>
    </Router>
  );
}

export default App;
