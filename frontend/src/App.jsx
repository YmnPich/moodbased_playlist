import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MoodScreen from './pages/MoodScreen.jsx';
import PlaylistScreen from './pages/PlaylistScreen.jsx';

const defaultSession = { playlist: [], mood: '', tone: 'light', vibes: [], controls: {} };

export default function App() {
  const [session, setSession] = useState(defaultSession);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerated = (payload) => {
    setSession(payload);
    navigate('/playlist');
  };

  const value = useMemo(
    () => ({ session, setSession, handleGenerated }),
    [session]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Mood Based</p>
          <h1>Mood Playlist Studio</h1>
        </div>
        <div className="header-actions">
          <button
            className="ghost mode-toggle"
            onClick={toggleTheme}
            role="switch"
            aria-checked={theme === 'light'}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="mode-icon" aria-hidden="true">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            <span className="mode-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <span className="pill">High contrast</span>
          <button className="ghost" onClick={() => navigate('/')}>Start over</button>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<MoodScreen onGenerated={handleGenerated} currentSession={session} />} />
        <Route
          path="/playlist"
          element={
            <PlaylistScreen
              session={value.session}
              onRegenerate={value.handleGenerated}
              setSession={value.setSession}
            />
          }
        />
      </Routes>
    </div>
  );
}
