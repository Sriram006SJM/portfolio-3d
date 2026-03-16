import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { INTER_FONT as FONT } from '../constants/fonts'

export default function NeonSign({ scrollProgress }) {
  const lightRef = useRef()
  const materialRef = useRef()
  const [lit, setLit] = useState(false)

  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollProgress?.current ?? 0))
    const nextLit = t >= 0.85
    if (nextLit !== lit) {
      setLit(nextLit)
    }

    if (lightRef.current) {
      lightRef.current.intensity += ((nextLit ? 3 : 0.8) - lightRef.current.intensity) * 0.12
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity += ((nextLit ? 0.28 : 0.08) - materialRef.current.emissiveIntensity) * 0.12
    }
  })

  return (
    <group position={[0, 4.5, -83]}>
      <mesh>
        <boxGeometry args={[9, 2, 0.15]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#0a0814"
          emissive="#f0c040"
          emissiveIntensity={0.08}
        />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.9}
        color={lit ? '#f0c040' : '#a78b58'}
        anchorX="center"
        font={FONT}
        fontWeight={700}
      >
        Get In Touch
      </Text>
      <pointLight ref={lightRef} position={[0, 0, 1]} intensity={0.8} distance={10} color="#f0c040" />
    </group>
  )
}
