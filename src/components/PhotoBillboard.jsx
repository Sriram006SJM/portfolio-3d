import { useTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { INTER_FONT as FONT } from '../constants/fonts'

export default function PhotoBillboard({ scrollProgress }) {
  const texture = useTexture(`${import.meta.env.BASE_URL}sriram.jpeg`)
  const groupRef = useRef()
  const frameMaterialRef = useRef()
  const [lit, setLit] = useState(true)

  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollProgress?.current ?? 0))
    const nextLit = t <= 0.18
    if (nextLit !== lit) {
      setLit(nextLit)
    }

    if (groupRef.current) {
      const targetScale = nextLit ? 1.03 : 1
      const s = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.1
      groupRef.current.scale.setScalar(s)
    }

    if (frameMaterialRef.current) {
      frameMaterialRef.current.emissiveIntensity += ((nextLit ? 0.3 : 0.08) - frameMaterialRef.current.emissiveIntensity) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[-8, 4, -12]} rotation={[0, Math.PI * 0.15, 0]}>
      <mesh>
        <boxGeometry args={[6, 7, 0.3]} />
        <meshStandardMaterial
          ref={frameMaterialRef}
          color="#222"
          emissive="#00d4ff"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0, 0.5, 0.2]}>
        <planeGeometry args={[5, 5.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Text
        position={[0, -2.8, 0.2]}
        fontSize={0.45}
        color={lit ? '#00d4ff' : '#8ea1b8'}
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
        fillOpacity={lit ? 1 : 0.75}
      >
        Data Analyst · MS @ UTD · GPA 3.92
      </Text>
    </group>
  )
}
