# MOON SHIFT

A 7-day lunar survival game for ages 7-12, made for the NASA Space Apps Challenge 2026.
React + Vite + TypeScript + Tailwind + Framer Motion + Lucide.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # static output in dist/

## NASA key (optional)
Uses DEMO_KEY by default. To use your own free key from https://api.nasa.gov:
    cp .env.example .env.local   # then edit VITE_NASA_API_KEY
On Vercel add `VITE_NASA_API_KEY` under Project Settings > Environment Variables.
Note: Vite exposes VITE_ variables to the browser, so use only a free public-tier key.
The NASA panel (real DONKI data, dashed amber style) never blocks play: it has a retry button and an offline fallback.

## Deploy on Vercel
Import the repo. Framework: Vite. Build `npm run build`, output `dist` (already set in vercel.json).

## Audio
Sound only starts after "Start Mission". See public/audio/README.md. With no files supplied the game synthesises its own ambient music and effects.

## Where things live
- src/game/events.ts   all 16 events (edit text and numbers here)
- src/game/engine.ts   pure game logic (resources, delayed effects, event picking, balance)
- src/audio/           audio manager, synth music, SFX
- src/nasa/            DONKI fetch + hook
- src/components, src/screens   UI
