import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext'; 
import { AuthGuard } from './components/auth/AuthGuard';
import { PlayerGuide } from './components/guide/PlayerGuide';
import { AppRoutes } from './routes';
import { CoreDashboard } from './components/dashboard/CoreDashboard'; 
import { SpaceBackground } from './components/ui/space-background'; 

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <AuthGuard>
      <SpaceBackground className="min-h-screen">
        <AppRoutes />
        {!isChatPage && (
          <PlayerGuide />
        )}
      </SpaceBackground>
    </AuthGuard>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SupabaseProvider>
        <AppContent />
      </SupabaseProvider>
    </BrowserRouter>
  );
}

export default App;