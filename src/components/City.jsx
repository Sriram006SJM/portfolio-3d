import { useMemo } from 'react'

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
