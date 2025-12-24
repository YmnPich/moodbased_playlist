import { useMemo, useState } from 'react';

const vibeOptions = [
  { id: 'sunny', label: 'Sunny optimism' },
  { id: 'moody', label: 'Moody blue hour' },
  { id: 'focus', label: 'Deep focus' },
  { id: 'hype', label: 'Hype mode' },
  { id: 'calm', label: 'Calm & cozy' },
  { id: 'nostalgia', label: 'Nostalgia' }
];

const defaultControls = { energy: 0.6, tempo: 0.5, acoustics: 0.4, trackCount: 25 };

const apiBase = import.meta.env.VITE_API_BASE || '/api';

export default function MoodScreen({ onGenerated, currentSession }) {
  const [mood, setMood] = useState(currentSession?.mood || '');
  const [vibes, setVibes] = useState(currentSession?.vibes || ['sunny']);
  const [controls, setControls] = useState({ ...defaultControls, ...currentSession?.controls });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleVibe = (id) => {
    setVibes((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const sliders = useMemo(
    () => ([
      { key: 'energy', label: 'Energy', description: 'Keeps the flow lively', min: 0, max: 1, step: 0.05 },
      { key: 'tempo', label: 'Tempo', description: 'Controls BPM tilt', min: 0, max: 1, step: 0.05 },
      { key: 'acoustics', label: 'Acoustic vs electronic', description: 'Higher values lean organic', min: 0, max: 1, step: 0.05 },
    ]),
    []
  );

  const handleChange = (key, value) => {
    setControls((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBase}/generate-playlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, vibes, controls })
      });

      if (!response.ok) throw new Error('Unable to reach the playlist engine');
      const data = await response.json();
      onGenerated({ ...data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="grid">
        <div>
          <h2 className="section-title">How do you want it to feel?</h2>
          <p className="notice">Tap up to three vibes to seed the mix.</p>
          <div className="grid" style={{ marginTop: '10px' }}>
            {vibeOptions.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                className={`vibe-chip ${vibes.includes(vibe.id) ? 'active' : ''}`}
                onClick={() => toggleVibe(vibe.id)}
                aria-pressed={vibes.includes(vibe.id)}
              >
                {vibe.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="section-title">Fine tune it</h2>
          <div>
            <label className="slider-row" htmlFor="moodInput">
              <div>
                <span className="label-strong">Mood label</span>
                <small className="notice">Keeps the set organized.</small>
              </div>
              <input
                id="moodInput"
                style={{ padding: '10px', borderRadius: '10px', border: '1px solid #2e478b', background: '#0f1a3a', color: '#f7f8ff' }}
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="eg. Sunrise sprint"
                aria-label="Mood label"
              />
            </label>
            {sliders.map((slider) => (
              <div className="slider-row" key={slider.key}>
                <label htmlFor={slider.key}>
                  <span className="label-strong">{slider.label}</span>
                  <small className="notice">{slider.description}</small>
                  <input
                    id={slider.key}
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={controls[slider.key] ?? 0}
                    onChange={(e) => handleChange(slider.key, e.target.value)}
                    aria-label={`${slider.label} slider`}
                  />
                </label>
                <span className="slider-value">{Math.round((controls[slider.key] ?? 0) * 100)}%</span>
              </div>
            ))}
            <div className="slider-row">
              <label htmlFor="trackCount">
                <span className="label-strong">Playlist size</span>
                <small className="notice">Between 25 and 50 tracks.</small>
                <input
                  id="trackCount"
                  type="range"
                  min={25}
                  max={50}
                  step={1}
                  value={controls.trackCount ?? 25}
                  onChange={(e) => handleChange('trackCount', e.target.value)}
                  aria-label="Playlist size"
                />
              </label>
              <span className="slider-value">{controls.trackCount}</span>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="notice" role="alert">{error}</p>}
      <div className="flex-row" style={{ marginTop: '18px', justifyContent: 'space-between' }}>
        <div className="notice">Sliders and chips are labeled and high-contrast for accessibility.</div>
        <button onClick={handleGenerate} disabled={loading} aria-busy={loading}>
          {loading ? 'Generating…' : 'Generate playlist'}
        </button>
      </div>
    </div>
  );
}
