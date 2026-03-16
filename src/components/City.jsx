import { useMemo } from 'react'

function Building({ position, size, idx }) {
  const windowColor = ['#ffe4a0', '#a0d4ff', '#ffd0a0', '#c0ffc0'][idx % 4]
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#1a1a2e"
        emissive={windowColor}
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

export default function City() {
  const buildings = useMemo(() => {
    const list = []
    for (let z = -5; z > -95; z -= 8) {
      list.push(
        { position: [-8, 0, z], i: list.length },
        { position: [-13, 0, z + 3], i: list.length + 1 },
        { position: [8, 0, z], i: list.length + 2 },
        { position: [13, 0, z + 3], i: list.length + 3 },
      )
    }
    return list.map(({ position: [x, , z], i }) => {
      const h = 5 + ((i * 7) % 20)
      return { position: [x, h / 2, z], size: [4 + (i % 3), h, 4 + (i % 2)] }
    })
  }, [])

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} position={b.position} size={b.size} idx={i} />
      ))}
    </group>
  )
}
