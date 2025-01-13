import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CoreDashboard } from './components/dashboard/CoreDashboard';
import { ChallengePage } from './components/dashboard/challenge/ChallengePage';
import { ChatPage } from './components/chat/ChatPage';

export function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<CoreDashboard />} />
        <Route path="/challenge/:challengeId" element={<ChallengePage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </>
  );
}