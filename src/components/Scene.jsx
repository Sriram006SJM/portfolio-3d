import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import City from './City'
import Road from './Road'
import Car from './Car'

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
      <City />
      <Road />
      <Car position={[0, 0, 2]} />
    </Canvas>
  )
}
