function Streetlight({ z }) {
  return (
    <group position={[5.5, 0, z]}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 5.2, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={12} color="#ffe4a0" />
    </group>
  )
}

export default function Road() {
  const lights = [-5, -20, -35, -50, -65, -80]
  return (
    <group>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -40]}>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Centre line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -40]}>
        <planeGeometry args={[0.15, 100]} />
        <meshStandardMaterial color="#ffff00" />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6.5, 0.01, -40]}>
        <planeGeometry args={[3, 100]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.5, 0.01, -40]}>
        <planeGeometry args={[3, 100]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Streetlights */}
      {lights.map(z => <Streetlight key={z} z={z} />)}
    </group>
  )
}
