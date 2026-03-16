import { forwardRef } from 'react'

const WHEEL_POSITIONS = [
  [-0.95, 0.3, 1.4],  // front-left
  [0.95, 0.3, 1.4],   // front-right
  [-0.95, 0.3, -1.4], // rear-left
  [0.95, 0.3, -1.4],  // rear-right
]

function CarBodyMaterial() {
  return <meshStandardMaterial color="#c0392b" metalness={0.6} roughness={0.3} />
}

const Car = forwardRef(function Car({ position }, ref) {
  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 4]} />
        <CarBodyMaterial />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.1, 0.2]} castShadow>
        <boxGeometry args={[1.5, 0.6, 2.2]} />
        <CarBodyMaterial />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.1, 1.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1.4, 0.55, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.5} />
      </mesh>
      {/* Wheels */}
      {WHEEL_POSITIONS.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Headlights */}
      <pointLight position={[0.6, 0.5, 2.1]} intensity={2} distance={15} color="#ffffff" decay={2} />
      <pointLight position={[-0.6, 0.5, 2.1]} intensity={2} distance={15} color="#ffffff" decay={2} />
    </group>
  )
})

export default Car
