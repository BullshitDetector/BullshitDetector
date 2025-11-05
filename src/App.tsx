// src/App.tsx
import { Suspense, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserModeProvider, useUserMode } from './contexts/UserModeContext';
import { ModelProvider } from './contexts/ModelContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { OnboardingModal } from './components/OnboardingModal';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy } from 'react';

// ──────────────────────────────────────────────────────────────
// Lazy-load pages (code-splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const VoterMode = lazy(() => import('./pages/VoterMode'));
const ProfessionalMode = lazy(() => import('./pages/ProfessionalMode'));
const SentimentPage = lazy(() => import('./pages/SentimentPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
// ──────────────────────────────────────────────────────────────

function AppContent() {
  const { showOnboarding, setShowOnboarding } = useApp();
  const { mode } = useUserMode();
  const location = useLocation();

  // Helper to keep navigation callbacks consistent with old API
  const navigateTo = (page: string) => {
    window.history.pushState({}, '', `/${page}`);
    // Router will re-render automatically
  };

  return (
    <>
      <AppLayout currentPath={location.pathname}>
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading…</div>}>
          <Routes>
            <Route path="/" element={<HomePage onNavigate={navigateTo} />} />
            <Route
              path="/analyzer"
              element={mode === 'professional' ? <ProfessionalMode /> : <VoterMode />}
            />
            <Route path="/sentiment" element={<SentimentPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>

      <OnboardingModal
        key="onboarding"
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserModeProvider>
        <AuthProvider>
          <ModelProvider>
            <AppProvider>
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </AppProvider>
          </ModelProvider>
        </AuthProvider>
      </UserModeProvider>
    </ThemeProvider>
  );
}

export default App;
