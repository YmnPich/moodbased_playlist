import { useEffect, useMemo, useState } from 'react';
import TrackCard from '../components/TrackCard.jsx';
import ShareCard from '../components/ShareCard.jsx';

const apiBase = import.meta.env.VITE_API_BASE || '/api';

export default function PlaylistScreen({ session, onRegenerate, setSession }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session.playlist?.length) {
      setError('Generate a playlist first.');
    }
  }, [session]);

  const quickTweaks = useMemo(
    () => ([
      { label: 'More energy', key: 'energy', delta: 0.1 },
      { label: 'Cool it down', key: 'energy', delta: -0.1 },
      { label: 'Faster tempo', key: 'tempo', delta: 0.1 },
      { label: 'Slow it down', key: 'tempo', delta: -0.1 },
      { label: 'More acoustic', key: 'acoustics', delta: 0.1 },
    ]),
    []
  );

  const regenerateWith = async (controlChanges = {}) => {
    setLoading(true);
    setError('');
    const nextControls = { ...session.controls, ...controlChanges };
    nextControls.trackCount = Math.min(Math.max(nextControls.trackCount || 25, 25), 50);
    try {
      const response = await fetch(`${apiBase}/generate-playlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: session.mood, vibes: session.vibes, controls: nextControls })
      });
      if (!response.ok) throw new Error('Unable to regenerate playlist');
      const data = await response.json();
      setSession({ ...data });
      onRegenerate({ ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="flex-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 className="section-title">Your playlist</h2>
            <p className="notice">{session.playlist?.length || 0} tracks with reason tags and previews.</p>
          </div>
          <div className="flex-row">
            {quickTweaks.map((tweak) => (
              <button
                key={tweak.label}
                className="secondary"
                onClick={() =>
                  regenerateWith({
                    [tweak.key]: Math.min(Math.max((session.controls?.[tweak.key] ?? 0.5) + tweak.delta, 0), 1)
                  })
                }
                disabled={loading}
              >
                {tweak.label}
              </button>
            ))}
            <button onClick={() => regenerateWith()} disabled={loading}>
              {loading ? 'Regenerating…' : 'Regenerate'}
            </button>
          </div>
        </div>
        {error && <p className="notice" role="alert">{error}</p>}
        <div className="playlist-grid">
          {session.playlist?.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
      <ShareCard session={session} />
    </div>
  );
}
