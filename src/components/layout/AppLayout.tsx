import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export function AppLayout({ children }: Props) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-layout">
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className={isActive('/') ? 'active' : ''}>
          Home
        </Link>
        <Link to="/analyzer" className={isActive('/analyzer') ? 'active' : ''}>
          Analyzer
        </Link>
        <Link to="/sentiment" className={isActive('/sentiment') ? 'active' : ''}>
          Sentiment
        </Link>
        <Link to="/history" className={isActive('/history') ? 'active' : ''}>
          History
        </Link>
        <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>
          Settings
        </Link>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );

  import { useAppNavigate } from './App';

function SomeButton() {
  const navigate = useAppNavigate();

  const goToAnalyzer = () => navigate('/analyzer');

  return <button onClick={goToAnalyzer}>Go to Analyzer</button>;
}
}