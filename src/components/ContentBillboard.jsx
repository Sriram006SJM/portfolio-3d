import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { INTER_FONT as FONT } from '../constants/fonts'

function inRange(progress, range = [0, 1]) {
  return progress >= range[0] && progress <= range[1]
}

export default function ContentBillboard({ stop, scrollProgress }) {
  const x = stop.side === 'right' ? 9 : -9
  const xFace = stop.side === 'right' ? -1 : 1
  const accent = stop.color ?? '#00d4ff'

  const groupRef = useRef()
  const barMaterialRef = useRef()
  const boardMaterialRef = useRef()
  const [lit, setLit] = useState(false)

  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollProgress?.current ?? 0))
    const nextLit = inRange(t, stop.triggerRange)

    if (nextLit !== lit) {
      setLit(nextLit)
    }

    if (groupRef.current) {
      const targetScale = nextLit ? 1.035 : 1
      const s = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1
      groupRef.current.scale.setScalar(s)
    }

    if (barMaterialRef.current) {
      barMaterialRef.current.emissiveIntensity += ((nextLit ? 1.4 : 0.25) - barMaterialRef.current.emissiveIntensity) * 0.1
    }

    if (boardMaterialRef.current) {
      boardMaterialRef.current.emissiveIntensity += ((nextLit ? 0.22 : 0.04) - boardMaterialRef.current.emissiveIntensity) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[x, 4, stop.z]} rotation={[0, xFace * Math.PI * 0.15, 0]}>
      <mesh>
        <boxGeometry args={[7, 8, 0.3]} />
        <meshStandardMaterial
          ref={boardMaterialRef}
          color="#0a0f1e"
          emissive={accent}
          emissiveIntensity={0.04}
        />
      </mesh>
      <mesh position={[0, 3.7, 0.16]}>
        <boxGeometry args={[7, 0.5, 0.05]} />
        <meshStandardMaterial
          ref={barMaterialRef}
          color={accent}
          emissive={accent}
          emissiveIntensity={0.25}
        />
      </mesh>
      <Text
        position={[0, 2.9, 0.2]}
        fontSize={0.6}
        color={lit ? accent : '#8ea1b8'}
        anchorX="center"
        font={FONT}
        fontWeight={700}
      >
        {stop.title}
      </Text>
      {stop.lines.map((line, i) =>
        line.trim() ? (
          <Text
            key={i}
            position={[0, 2.1 - i * 0.65, 0.2]}
            fontSize={0.28}
            color={line.startsWith('  ') ? '#8892b0' : '#ffffff'}
            fillOpacity={lit ? 1 : 0.76}
            anchorX="center"
            font={FONT}
          >
            {line.trim()}
          </Text>
        ) : null,
      )}
    </group>
  )
}
