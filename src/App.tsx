import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ModelProvider } from './contexts/ModelContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { OnboardingModal } from './components/OnboardingModal';
import { HomePage } from './pages/HomePage';
import { VoterMode } from './pages/VoterMode';
import { ProfessionalMode } from './pages/ProfessionalMode';
import { HistoryPage } from './pages/HistoryPage';
import { SentimentPage } from './pages/SentimentPage';
import { SettingsPage } from './pages/SettingsPage';
import { useUserMode } from './contexts/UserModeContext';

// ----- NEW IMPORTS -----
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
// ------------------------

function AppContent() {
  const { showOnboarding, setShowOnboarding } = useApp();
  const { mode } = useUserMode();

  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/analyzer"
            element={mode === 'professional' ? <ProfessionalMode /> : <VoterMode />}
          />
          <Route path="/sentiment" element={<SentimentPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch‑all */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AppLayout>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
}

// Optional: a tiny navigation helper you can import anywhere
export function useAppNavigate() {
  return useNavigate();
}

function App() {
  return (
    <ThemeProvider>
      <UserModeProvider>
        <AuthProvider>
          <ModelProvider>
            <AppProvider>
              {/* Wrap everything in Router */}
              <Router>
                <AppContent />
              </Router>
            </AppProvider>
          </ModelProvider>
        </AuthProvider>
      </UserModeProvider>
    </ThemeProvider>
  );
}

export default App;