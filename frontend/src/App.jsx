import { useMemo, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MoodScreen from './pages/MoodScreen.jsx';
import PlaylistScreen from './pages/PlaylistScreen.jsx';

const defaultSession = { playlist: [], mood: '', vibes: [], controls: {} };

export default function App() {
  const [session, setSession] = useState(defaultSession);
  const navigate = useNavigate();

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
          <span className="pill">High contrast</span>
          <button className="ghost" onClick={() => navigate('/')}>Start over</button>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<MoodScreen onGenerated={handleGenerated} currentSession={session} />} />
        <Route path="/playlist" element={<PlaylistScreen session={value.session} onRegenerate={value.handleGenerated} setSession={value.setSession} />} />
      </Routes>
    </div>
  );
}
