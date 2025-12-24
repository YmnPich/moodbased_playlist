import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const providersWithPreview = ['spotify', 'apple', 'deezer'];

const adjectives = ['Sparkling', 'Velvet', 'Solar', 'Midnight', 'Breezy', 'Magnetic'];
const nouns = ['Echo', 'Pulse', 'Dream', 'Groove', 'Wave', 'Glow'];

function buildTracks(preferences) {
  const trackCount = preferences?.trackCount || 25;
  return Array.from({ length: trackCount }).map((_, idx) => {
    const provider = providersWithPreview[idx % providersWithPreview.length];
    const hasPreview = idx % 2 === 0;
    return {
      id: `${provider}-${idx + 1}`,
      title: `${adjectives[idx % adjectives.length]} ${nouns[idx % nouns.length]}`,
      artist: `Artist ${idx + 1}`,
      provider,
      energy: Math.min(1, Math.max(0, (preferences?.energy ?? 0.5) + (idx % 5) * 0.05)),
      tempo: 90 + (idx % 8) * 5,
      reasonTags: [
        `${preferences?.dominantVibe || 'balanced'} vibe`,
        `${preferences?.tone === 'dark' ? 'darker' : 'lighter'} mood`,
        `energy ${(preferences?.energy ?? 0.5) * 10}/10`,
        `tempo ${(preferences?.tempo ?? 0.5) * 10}/10`
      ],
      previewUrl: hasPreview ? `https://p.scdn.co/mp3-preview/mock-${idx}` : null
    };
  });
}

app.post('/api/generate-playlist', (req, res) => {
  const { mood, tone = 'light', vibes = [], controls = {} } = req.body || {};
  const playlist = buildTracks({
    trackCount: Math.min(Math.max(controls.trackCount || 25, 25), 50),
    energy: controls.energy,
    tempo: controls.tempo,
    dominantVibe: vibes[0],
    tone
  });

  res.json({
    playlist,
    mood,
    tone,
    vibes,
    controls,
    summary: `${mood || 'Custom'} playlist built with ${vibes.join(', ') || 'your picks'} in a ${tone} mood`
  });
});

app.listen(PORT, () => {
  console.log(`Mood playlist server running on port ${PORT}`);
});
