import { useState } from 'react';

export default function TrackCard({ track }) {
  const [previewing, setPreviewing] = useState(false);

  const togglePreview = () => {
    if (!track.previewUrl) return;
    const audio = new Audio(track.previewUrl);
    setPreviewing(true);
    audio.play();
    audio.onended = () => setPreviewing(false);
    audio.onerror = () => setPreviewing(false);
  };

  return (
    <div className="card track-card">
      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 6px' }}>{track.title}</h3>
          <p style={{ margin: 0, color: '#cdd9ff' }}>{track.artist} • {track.provider}</p>
        </div>
        <div className="pill">{Math.round(track.energy * 10)}/10 energy</div>
      </div>
      <div className="tag-row">
        {track.reasonTags?.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
        <span className="tag">tempo {track.tempo} BPM</span>
      </div>
      {track.previewUrl && (
        <button className="preview" onClick={togglePreview} aria-pressed={previewing}>
          {previewing ? 'Previewing…' : 'Play preview'}
        </button>
      )}
    </div>
  );
}
