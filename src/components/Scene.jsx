import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, Suspense } from 'react'
import City from './City'
import Road from './Road'
import Car from './Car'
import PhotoBillboard from './PhotoBillboard'
import ContentBillboard from './ContentBillboard'
import NeonSign from './NeonSign'
import { stops } from '../data/content'

export const TRAVEL_DEPTH = 90

function toCarZ(progressRef) {
  const t = Math.min(1, Math.max(0, progressRef?.current ?? 0))
  return 2 - t * TRAVEL_DEPTH
}

function CameraRig({ scrollProgress }) {
  useFrame(({ camera }) => {
    const z = toCarZ(scrollProgress)
    const camZ = z + 8
    camera.position.set(0, 4, camZ)
    camera.lookAt(0, 2, z - 5)
  })
  return null
}

function MovingCar({ scrollProgress }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    ref.current.position.z = toCarZ(scrollProgress)
  })
  return <Car ref={ref} position={[0, 0, 2]} />
}

export default function Scene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 80 }}
      style={{ width: '100vw', height: '100vh', background: '#0a0a1e' }}
    >
      <ambientLight intensity={2} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#1a1a2a" />
      </mesh>
      <City />
      <Road />
      <Suspense fallback={null}>
        <PhotoBillboard scrollProgress={scrollProgress} />
        {stops.map((stop) => (
          <ContentBillboard key={stop.id} stop={stop} scrollProgress={scrollProgress} />
        ))}
        <NeonSign scrollProgress={scrollProgress} />
      </Suspense>
      {scrollProgress != null && <MovingCar scrollProgress={scrollProgress} />}
      {scrollProgress != null && <CameraRig scrollProgress={scrollProgress} />}
    </Canvas>
  )
}
