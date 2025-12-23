import { useEffect, useRef, useState } from 'react';

export default function ShareCard({ session }) {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 900;
    const height = 470;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#0b1021';
    ctx.fillRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1b2b5b');
    gradient.addColorStop(1, '#0f101f');
    ctx.fillStyle = gradient;
    ctx.fillRect(12, 12, width - 24, height - 24);

    ctx.fillStyle = '#d1ff52';
    ctx.font = '22px Inter';
    ctx.fillText('Mood Playlist', 32, 48);

    ctx.fillStyle = '#f7f8ff';
    ctx.font = '34px Inter';
    ctx.fillText(session.mood || 'Custom vibe', 32, 90);

    ctx.font = '16px Inter';
    ctx.fillStyle = '#bcd2ff';
    ctx.fillText(`Vibes: ${session.vibes?.join(', ') || 'selected for you'}`, 32, 120);

    const tracks = session.playlist?.slice(0, 6) || [];
    ctx.font = '18px Inter';
    ctx.fillStyle = '#d1ff52';
    ctx.fillText('Top picks', 32, 160);
    ctx.font = '16px Inter';
    ctx.fillStyle = '#f7f8ff';
    tracks.forEach((track, idx) => {
      ctx.fillText(`${idx + 1}. ${track.title} — ${track.artist}`, 32, 190 + idx * 32);
    });

    ctx.fillStyle = '#9ec5ff';
    ctx.fillText('Shareable card generated locally', 32, height - 40);
    setDataUrl(canvas.toDataURL('image/png'));
  }, [session]);

  const download = () => {
    const link = document.createElement('a');
    link.download = `${session.mood || 'mood-playlist'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const copyImage = async () => {
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (err) {
      console.error('Clipboard failed', err);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="flex-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h3 className="section-title">Share card</h3>
          <p className="notice">Rendered on canvas; save or export for socials.</p>
        </div>
        <div className="flex-row">
          <button className="secondary" onClick={download} disabled={!dataUrl}>Save PNG</button>
          <button onClick={copyImage} disabled={!dataUrl}>Copy to clipboard</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="canvas-preview" role="img" aria-label="Share card preview" />
      {dataUrl && <img src={dataUrl} alt="Share card preview" className="canvas-preview" />}
    </div>
  );
}
