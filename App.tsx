import React, { useEffect } from 'react';
import { useStore } from './store';
import { ParentDashboard } from './views/ParentDashboard';
import { SessionView } from './views/SessionView';
import { KidHomeView } from './views/KidHomeView';
import { AuthView } from './views/AuthView';
import { OnboardingView } from './views/OnboardingView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WifiOff, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const user = useStore(state => state.user);
  const currentChild = useStore(state => state.currentChild);
  const parentMode = useStore(state => state.parentMode);
  const session = useStore(state => state.session);
  const initializeSync = useStore(state => state.initializeSync);
  const checkSessionExpiry = useStore(state => state.checkSessionExpiry);
  const syncStatus = useStore(state => state.syncStatus);

  useEffect(() => {
      initializeSync();
      checkSessionExpiry();
  }, [initializeSync, checkSessionExpiry]);
  
  // Status Indicator (Overlay)
  const StatusIndicator = () => (
      <div className="fixed top-2 right-2 z-[100] pointer-events-none flex gap-2">
          {syncStatus === 'offline' && <WifiOff className="w-4 h-4 text-slate-300" />}
          {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-green-400 animate-spin" />}
      </div>
  );

  // If no user is logged in, show Auth Screen
  if (!user) {
      return <AuthView />;
  }

  // Check Onboarding Status
  const needsOnboarding = !user.consentAgreedAt || user.children.length === 0;

  if (needsOnboarding) {
      return <OnboardingView />;
  }

  // If we are in Parent Mode, show Dashboard
  if (parentMode) {
     return (
         <>
            <StatusIndicator />
            <ParentDashboard />
         </>
     );
  }

  // Child Mode Logic
  if (currentChild) {
      return (
          <>
            <StatusIndicator />
            {session.isActive ? <SessionView /> : <KidHomeView />}
          </>
      );
  }

  // Fallback
  return (
      <>
        <StatusIndicator />
        <ParentDashboard />
      </>
  );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
}

export default App;