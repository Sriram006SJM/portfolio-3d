import { Text } from '@react-three/drei'
import { INTER_FONT as FONT } from '../constants/fonts'

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
      {stop.lines.map((line, i) =>
        line.trim() ? (
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
        ) : null
      )}
    </group>
  )
}
