import { Text } from '@react-three/drei'
import { INTER_FONT as FONT } from '../constants/fonts'

export default function NeonSign() {
  return (
    <group position={[0, 4.5, -83]}>
      {/* Sign backing */}
      <mesh>
        <boxGeometry args={[9, 2, 0.15]} />
        <meshStandardMaterial color="#0a0814" />
      </mesh>
      {/* Neon text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.9}
        color="#f0c040"
        anchorX="center"
        font={FONT}
        fontWeight={700}
      >
        ✦ Get In Touch ✦
      </Text>
      {/* Glow light */}
      <pointLight position={[0, 0, 1]} intensity={3} distance={10} color="#f0c040" />
    </group>
  )
}
