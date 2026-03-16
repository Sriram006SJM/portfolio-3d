# Sriram 3D Portfolio

Interactive 3D portfolio built with React + React Three Fiber.

## Concept
A car drives through a stylized downtown scene while scroll progress controls camera and vehicle motion. Four billboard stops light up and reveal content:
- Skills
- Projects
- Experience
- Contact

A photo billboard appears early in the route and a contact neon sign activates near the end.

## Stack
- React + Vite
- Three.js
- @react-three/fiber
- @react-three/drei
- GitHub Pages deployment (`gh-pages`)

## Local Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)
```bash
npm run deploy
```

`vite.config.js` is configured with:
- `base: '/portfolio-3d/'`

## Notes
- Scroll range is intentionally long (`600vh`) to create cinematic pacing.
- Billboard activation windows are defined in `src/data/content.js`.
- Replace `public/sriram.jpeg` if you want a new profile image.
