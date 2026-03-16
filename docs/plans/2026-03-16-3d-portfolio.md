# 3D Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a 3D scrollable portfolio where a car drives through a US downtown, stopping at 4 billboard triggers that reveal Skills, Projects, Experience, and Contact content.

**Architecture:** React + React Three Fiber scene with a fixed scroll-driven camera path. The car follows a spline path as the user scrolls; at 4 waypoints, a billboard panel activates. Buildings are procedurally generated boxes. Hosted on GitHub Pages via a new `portfolio-3d` repo.

**Tech Stack:** React 18, Vite, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Three.js, gh-pages (deploy)

---

## Project Setup

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `~/Desktop/portfolio-3d/` (project root)

**Step 1: Create project**
```bash
cd ~/Desktop
npm create vite@latest portfolio-3d -- --template react
cd portfolio-3d
npm install
```

**Step 2: Install 3D dependencies**
```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev gh-pages
```

**Step 3: Verify dev server starts**
```bash
npm run dev
```
Expected: Vite dev server at `http://localhost:5173` with default React page.

**Step 4: Clean default files**
- Delete `src/App.css`
- Replace `src/App.jsx` with empty shell:
```jsx
export default function App() {
  return <div>3D Portfolio</div>
}
```
- Replace `src/index.css` with:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #111; overflow: hidden; }
#root { width: 100vw; height: 100vh; }
```

**Step 5: Configure Vite for GitHub Pages**

Edit `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio-3d/',
})
```

**Step 6: Add deploy script to `package.json`**

Add under `"scripts"`:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

**Step 7: Init git and create GitHub repo**
```bash
cd ~/Desktop/portfolio-3d
git init
git add .
git commit -m "feat: scaffold Vite React project for 3D portfolio"
```
Then create repo `portfolio-3d` on GitHub (via `gh repo create Sriram006SJM/portfolio-3d --public`) and push:
```bash
git remote add origin https://github.com/Sriram006SJM/portfolio-3d.git
git branch -M main
git push -u origin main
```

---

### Task 2: Basic Three.js scene — canvas + lighting

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/Scene.jsx`

**Step 1: Create Scene.jsx**
```jsx
import { Canvas } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </Canvas>
  )
}
```

**Step 2: Mount in App.jsx**
```jsx
import Scene from './components/Scene'

export default function App() {
  return <Scene />
}
```

**Step 3: Verify**
Run `npm run dev` — should see a grey ground plane with a blue sky.

**Step 4: Commit**
```bash
git add src/
git commit -m "feat: add basic Three.js canvas with sky and ground"
```

---

### Task 3: Procedural city blocks (buildings)

**Files:**
- Create: `src/components/City.jsx`

**Step 1: Create City.jsx**
```jsx
import { useMemo } from 'react'
import * as THREE from 'three'

function Building({ position, size }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#3a3a4a" />
    </mesh>
  )
}

export default function City() {
  const buildings = useMemo(() => {
    const list = []
    const seed = [
      // Left side of road (negative X)
      [-8, 0, -10], [-8, 0, -25], [-8, 0, -40], [-8, 0, -55], [-8, 0, -70],
      [-12, 0, -15], [-12, 0, -35], [-12, 0, -50], [-12, 0, -65],
      // Right side of road (positive X)
      [8, 0, -10], [8, 0, -25], [8, 0, -40], [8, 0, -55], [8, 0, -70],
      [12, 0, -15], [12, 0, -35], [12, 0, -50], [12, 0, -65],
    ]
    seed.forEach(([x, , z], i) => {
      const h = 6 + (i % 5) * 4
      list.push({ position: [x, h / 2, z], size: [5, h, 5] })
    })
    return list
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} size={b.size} />
      ))}
    </group>
  )
}
```

**Step 2: Add to Scene.jsx**
```jsx
import City from './City'
// inside Canvas:
<City />
```

**Step 3: Verify**
Buildings should appear on both sides of a centre corridor.

**Step 4: Commit**
```bash
git add src/components/City.jsx src/components/Scene.jsx
git commit -m "feat: add procedural city buildings"
```

---

### Task 4: Road + sidewalks + streetlights

**Files:**
- Create: `src/components/Road.jsx`

**Step 1: Create Road.jsx**
```jsx
function Streetlight({ z }) {
  return (
    <group position={[5.5, 0, z]}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={12} color="#ffe4a0" />
    </group>
  )
}

export default function Road() {
  const lights = [-5, -20, -35, -50, -65, -80]
  return (
    <group>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -40]}>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Centre line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -40]}>
        <planeGeometry args={[0.15, 100]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.5, 0.01, -40]}>
        <planeGeometry args={[3, 100]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.5, 0.01, -40]}>
        <planeGeometry args={[3, 100]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Streetlights */}
      {lights.map(z => <Streetlight key={z} z={z} />)}
    </group>
  )
}
```

**Step 2: Add to Scene.jsx**
```jsx
import Road from './Road'
// inside Canvas:
<Road />
```

**Step 3: Verify**
Dark road with yellow centre line, grey sidewalks, glowing streetlights.

**Step 4: Commit**
```bash
git add src/components/Road.jsx src/components/Scene.jsx
git commit -m "feat: add road, sidewalks, and streetlights"
```

---

### Task 5: Car model (box-based, no external asset needed)

**Files:**
- Create: `src/components/Car.jsx`

**Step 1: Create Car.jsx**
```jsx
import { useRef } from 'react'

export default function Car({ position }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.1, 0.2]} castShadow>
        <boxGeometry args={[1.5, 0.6, 2.2]} />
        <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.1, 1.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.4, 0.55, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
      </mesh>
      {/* Wheels */}
      {[[-0.95, 0.3, 1.4], [0.95, 0.3, 1.4], [-0.95, 0.3, -1.4], [0.95, 0.3, -1.4]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Headlights */}
      <pointLight position={[0.6, 0.5, 2.1]} intensity={2} distance={15} color="#ffffff" />
      <pointLight position={[-0.6, 0.5, 2.1]} intensity={2} distance={15} color="#ffffff" />
    </group>
  )
}
```

**Step 2: Add to Scene.jsx**
```jsx
import Car from './Car'
// inside Canvas:
<Car position={[0, 0, 2]} />
```

**Step 3: Verify**
Red box car visible on the road with glowing headlights.

**Step 4: Commit**
```bash
git add src/components/Car.jsx src/components/Scene.jsx
git commit -m "feat: add box-based car model with headlights"
```

---

### Task 6: Scroll-driven camera + car movement

**Files:**
- Create: `src/hooks/useScrollProgress.js`
- Modify: `src/components/Scene.jsx`
- Modify: `src/App.jsx`

**Step 1: Create useScrollProgress.js**
```js
import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const progress = useRef(0)

  useEffect(() => {
    const totalHeight = document.body.scrollHeight - window.innerHeight

    function onScroll() {
      progress.current = window.scrollY / totalHeight
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}
```

**Step 2: Make App.jsx scrollable**
```jsx
import Scene from './components/Scene'

export default function App() {
  return (
    <>
      {/* Tall scroll container — drives the animation */}
      <div style={{ height: '600vh' }} />
      {/* Fixed 3D canvas */}
      <div style={{ position: 'fixed', inset: 0 }}>
        <Scene />
      </div>
    </>
  )
}
```

**Step 3: Update Scene.jsx to use scroll**

Add `useFrame` to move car + camera based on scroll:
```jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useScrollProgress } from '../hooks/useScrollProgress'

function CameraRig({ scrollProgress }) {
  useFrame(({ camera }) => {
    const t = scrollProgress.current
    const z = 2 - t * 90        // car travels from z=2 to z=-88
    const camZ = z + 8
    camera.position.set(0, 3, camZ)
    camera.lookAt(0, 1, z - 5)
  })
  return null
}

function MovingCar({ scrollProgress }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const t = scrollProgress.current
    ref.current.position.z = 2 - t * 90
  })
  return <Car ref={ref} position={[0, 0, 2]} />
}
```

Update `Car.jsx` to use `forwardRef`:
```jsx
import { forwardRef } from 'react'

const Car = forwardRef(function Car({ position }, ref) {
  return (
    <group ref={ref} position={position}>
      {/* ...same body code... */}
    </group>
  )
})

export default Car
```

**Step 4: Verify**
Scrolling the page should drive the car forward down the road with the camera following behind.

**Step 5: Commit**
```bash
git add src/hooks/useScrollProgress.js src/components/Scene.jsx src/components/Car.jsx src/App.jsx
git commit -m "feat: scroll-driven car movement and camera follow"
```

---

### Task 7: Photo billboard (your face, early in the scene)

**Files:**
- Create: `src/components/PhotoBillboard.jsx`
- Asset needed: `public/sriram.jpeg` — copy from `~/Desktop/portfolio/sriram.jpeg`

**Step 1: Copy photo**
```bash
cp ~/Desktop/portfolio/sriram.jpeg ~/Desktop/portfolio-3d/public/sriram.jpeg
```

**Step 2: Create PhotoBillboard.jsx**
```jsx
import { useTexture, Text } from '@react-three/drei'

export default function PhotoBillboard() {
  const texture = useTexture('/portfolio-3d/sriram.jpeg')

  return (
    <group position={[-10, 6, -12]}>
      {/* Billboard frame */}
      <mesh>
        <boxGeometry args={[6, 7, 0.3]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Photo */}
      <mesh position={[0, 0.5, 0.2]}>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Name text */}
      <Text
        position={[0, -2.8, 0.2]}
        fontSize={0.45}
        color="#00d4ff"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        Sriram Ganeshalingam
      </Text>
      <Text
        position={[0, -3.35, 0.2]}
        fontSize={0.3}
        color="#8892b0"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        Data Analyst · MS @ UTD · GPA 3.92
      </Text>
    </group>
  )
}
```

**Step 3: Add to Scene.jsx**
```jsx
import PhotoBillboard from './PhotoBillboard'
// inside Canvas:
<PhotoBillboard />
```

**Step 4: Verify**
Large photo billboard visible on the left side as you start scrolling.

**Step 5: Commit**
```bash
git add src/components/PhotoBillboard.jsx public/sriram.jpeg src/components/Scene.jsx
git commit -m "feat: add photo billboard with name and title"
```

---

### Task 8: Content billboards (Skills, Projects, Experience, Contact)

**Files:**
- Create: `src/components/ContentBillboard.jsx`
- Create: `src/data/content.js`

**Step 1: Create content.js**
```js
export const stops = [
  {
    id: 'skills',
    z: -22,
    side: 'right',   // positive X
    title: 'Skills',
    lines: [
      'SQL · PostgreSQL · Snowflake',
      'Python · Pandas · NumPy · Scikit-learn',
      'Tableau · Power BI · Excel',
      'Machine Learning · XGBoost · TensorFlow',
      'ETL · Data Pipelines · Validation',
      'Agile · Stakeholder Communication',
    ],
  },
  {
    id: 'projects',
    z: -42,
    side: 'left',
    title: 'Projects',
    lines: [
      '★ Real Estate AI Platform',
      '  FastAPI · PostgreSQL · Angular · Monte Carlo',
      'Credit Risk Modeling',
      '  XGBoost · TensorFlow · 100M+ records',
      'SmartSell — Mr. Cooper',
      '  35% accuracy improvement',
    ],
  },
  {
    id: 'experience',
    z: -62,
    side: 'right',
    title: 'Experience',
    lines: [
      'Capgemini — Software Developer',
      '  Jun 2022 – Jul 2024 · Chennai',
      '  500K+ records · 20% latency reduction',
      'Cango Networks — Developer',
      '  Sep 2021 – Mar 2022 · Chennai',
      '  30% faster reporting',
    ],
  },
  {
    id: 'contact',
    z: -78,
    side: 'left',
    title: 'Contact',
    lines: [
      'sriram.ganeshalingam@utdallas.edu',
      'linkedin.com/in/sriram-ganeshalingam',
      '+1 (469) 679-6681',
      '',
      'MS Business Analytics & AI',
      'University of Texas at Dallas',
    ],
  },
]
```

**Step 2: Create ContentBillboard.jsx**
```jsx
import { Text } from '@react-three/drei'

const FONT = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"

export default function ContentBillboard({ stop }) {
  const x = stop.side === 'right' ? 12 : -12
  const xFace = stop.side === 'right' ? -1 : 1

  return (
    <group position={[x, 5, stop.z]} rotation={[0, xFace * Math.PI * 0.08, 0]}>
      {/* Board */}
      <mesh>
        <boxGeometry args={[7, 8, 0.3]} />
        <meshStandardMaterial color="#0a0f1e" />
      </mesh>
      {/* Top colour bar */}
      <mesh position={[0, 3.7, 0.16]}>
        <boxGeometry args={[7, 0.5, 0.05]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
      </mesh>
      {/* Title */}
      <Text position={[0, 2.9, 0.2]} fontSize={0.6} color="#00d4ff" anchorX="center" font={FONT} fontWeight={700}>
        {stop.title}
      </Text>
      {/* Lines */}
      {stop.lines.map((line, i) => (
        <Text
          key={i}
          position={[0, 2.1 - i * 0.65, 0.2]}
          fontSize={0.28}
          color={line.startsWith('  ') ? '#8892b0' : '#ffffff'}
          anchorX="center"
          font={FONT}
        >
          {line.trim()}
        </Text>
      ))}
    </group>
  )
}
```

**Step 3: Add all billboards to Scene.jsx**
```jsx
import ContentBillboard from './ContentBillboard'
import { stops } from '../data/content'
// inside Canvas:
{stops.map(stop => <ContentBillboard key={stop.id} stop={stop} />)}
```

**Step 4: Verify**
Scroll down — 4 billboards should appear on alternating sides of the road at each zone.

**Step 5: Commit**
```bash
git add src/components/ContentBillboard.jsx src/data/content.js src/components/Scene.jsx
git commit -m "feat: add 4 content billboards (skills, projects, experience, contact)"
```

---

### Task 9: "Get In Touch" neon sign at Contact stop

**Files:**
- Create: `src/components/NeonSign.jsx`

**Step 1: Create NeonSign.jsx**
```jsx
import { Text } from '@react-three/drei'

const FONT = "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"

export default function NeonSign() {
  return (
    <group position={[0, 4.5, -83]}>
      {/* Sign backing */}
      <mesh>
        <boxGeometry args={[9, 2, 0.15]} />
        <meshStandardMaterial color="#0a0814" />
      </mesh>
      {/* Neon text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.9}
        color="#f0c040"
        anchorX="center"
        font={FONT}
        fontWeight={700}
      >
        ✦ Get In Touch ✦
      </Text>
      {/* Glow light */}
      <pointLight position={[0, 0, 1]} intensity={3} distance={10} color="#f0c040" />
    </group>
  )
}
```

**Step 2: Add to Scene.jsx**
```jsx
import NeonSign from './NeonSign'
// inside Canvas:
<NeonSign />
```

**Step 3: Verify**
At end of scroll, golden glowing neon sign visible spanning the road.

**Step 4: Commit**
```bash
git add src/components/NeonSign.jsx src/components/Scene.jsx
git commit -m "feat: add Get In Touch neon sign at end of route"
```

---

### Task 10: Extend city — more buildings, depth, variation

**Files:**
- Modify: `src/components/City.jsx`

**Step 1: Add deeper building rows and height variation to cover the full -90z route**

Replace the `seed` array in City.jsx with:
```js
const positions = []
for (let z = -5; z > -95; z -= 8) {
  positions.push([-8, z], [-13, z + 3], [8, z], [13, z + 3])
}
```

Replace `Building` map:
```jsx
{positions.map(([x, z], i) => {
  const h = 5 + ((i * 7) % 20)
  return <Building key={i} position={[x, h / 2, z]} size={[4 + (i % 3), h, 4 + (i % 2)]} />
})}
```

**Step 2: Verify**
Continuous building walls on both sides for the full scroll journey.

**Step 3: Commit**
```bash
git add src/components/City.jsx
git commit -m "feat: extend city buildings to full route depth"
```

---

### Task 11: Deploy to GitHub Pages

**Files:**
- None — just deployment

**Step 1: Build**
```bash
cd ~/Desktop/portfolio-3d
npm run build
```
Expected: `dist/` folder created with no errors.

**Step 2: Deploy**
```bash
npm run deploy
```
Expected: `gh-pages` branch pushed to GitHub.

**Step 3: Enable GitHub Pages**

Go to: `https://github.com/Sriram006SJM/portfolio-3d/settings/pages`
- Source: `gh-pages` branch, `/ (root)`
- Save

**Step 4: Verify live**

Visit: `https://sriram006sjm.github.io/portfolio-3d/`
Expected: 3D scene loads, scrolling drives the car.

**Step 5: Final commit**
```bash
git add .
git commit -m "chore: finalize deployment config"
git push
```

---

## Summary

| Task | What it builds |
|---|---|
| 1 | Vite + React scaffold, GitHub repo, deploy config |
| 2 | Three.js canvas, sky, ground, lighting |
| 3 | Procedural city buildings |
| 4 | Road, sidewalks, streetlights |
| 5 | Box-based car with headlights |
| 6 | Scroll drives car + camera |
| 7 | Photo billboard with name |
| 8 | 4 content billboards (Skills/Projects/Experience/Contact) |
| 9 | "Get In Touch" neon sign |
| 10 | Full-depth city buildings |
| 11 | Deploy to GitHub Pages |
