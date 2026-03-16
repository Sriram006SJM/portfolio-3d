import { useTexture, Text } from '@react-three/drei'
import { INTER_FONT as FONT } from '../constants/fonts'

export default function PhotoBillboard() {
  const texture = useTexture(`${import.meta.env.BASE_URL}sriram.jpeg`)

  return (
    <group position={[-8, 4, -12]} rotation={[0, Math.PI * 0.15, 0]}>
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
        font={FONT}
      >
        Sriram Ganeshalingam
      </Text>
      <Text
        position={[0, -3.35, 0.2]}
        fontSize={0.3}
        color="#8892b0"
        anchorX="center"
        font={FONT}
      >
        Data Analyst · MS @ UTD · GPA 3.92
      </Text>
    </group>
  )
}
