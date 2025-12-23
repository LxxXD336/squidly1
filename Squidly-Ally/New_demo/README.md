
# Squidly Hero Demo (Vite + React + TS + Tailwind)

A minimal, locally runnable project that renders the warm Squidly-style hero with an eye‑gaze animated badge and a low‑stimulus toggle.

## Install & Run

```bash
npm i
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Files of interest
- `src/components/SquidlyHero.tsx` – the hero component
- `src/App.tsx` – renders the hero
- `tailwind.config.js`, `postcss.config.js`, `src/index.css` – Tailwind setup

## Notes
- Tailwind is used for styling. No server code required.
- The hero contains a soft cursor spotlight. Toggle **Low‑stimulus** (top‑right) to dampen motion/light.
- Eye‑gaze badge will blink periodically and the pupil follows the cursor inside the hero area.
```
