import Scene from './components/Scene'
import { useScrollProgress } from './hooks/useScrollProgress'

export default function App() {
  const scrollProgress = useScrollProgress()
  return (
    <>
      {/* Tall scroll container — drives the animation */}
      <div style={{ height: '600vh' }} />
      {/* Fixed 3D canvas */}
      <div style={{ position: 'fixed', inset: 0 }}>
        <Scene scrollProgress={scrollProgress} />
      </div>
    </>
  )
}
