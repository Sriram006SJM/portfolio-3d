import { Canvas, useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import City from './City'
import Road from './Road'
import Car from './Car'
import PhotoBillboard from './PhotoBillboard'
import ContentBillboard from './ContentBillboard'
import NeonSign from './NeonSign'
import { stops } from '../data/content'

const TRAVEL_DEPTH = 90

function CameraRig({ scrollProgress }) {
  useFrame(({ camera }) => {
    const t = scrollProgress.current
    const z = 2 - t * TRAVEL_DEPTH
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
    const t = scrollProgress.current
    ref.current.position.z = 2 - t * TRAVEL_DEPTH
  })
  return <Car ref={ref} position={[0, 0, 2]} />
}

export default function Scene({ scrollProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 4, 10], fov: 80 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      <City />
      <Road />
      <Suspense fallback={null}>
        <PhotoBillboard />
        {stops.map(stop => <ContentBillboard key={stop.id} stop={stop} />)}
        <NeonSign />
      </Suspense>
      {scrollProgress != null && <MovingCar scrollProgress={scrollProgress} />}
      {scrollProgress != null && <CameraRig scrollProgress={scrollProgress} />}
    </Canvas>
  )
}
