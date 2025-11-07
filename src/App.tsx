// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { ModelProvider } from './contexts/ModelContext';
import { UserModeProvider } from './contexts/UserModeContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ModelProvider>
            <UserModeProvider>
              <AppRoutes />
            </UserModeProvider>
          </ModelProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}