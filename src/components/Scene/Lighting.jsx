import React from 'react';

/**
 * Lighting Component — Warm golden sunrise & ambient forest lighting for Hero section
 */
export default function Lighting() {
  return (
    <group>
      {/* Soft Natural Forest Ambient Light */}
      <ambientLight color="#2d4a36" intensity={1.4} />

      {/* Warm Directional Golden Sunlight (Sunrise over mountain valley) */}
      <directionalLight
        color="#ffcf75"
        intensity={3.8}
        position={[70, 32, 45]}
        castShadow={true}
      />

      {/* Secondary Warm Golden Horizon Fill Light */}
      <directionalLight
        color="#d49b4b"
        intensity={1.2}
        position={[-50, 15, -30]}
      />

      {/* Warm Atmospheric Sun Rim Light */}
      <pointLight
        color="#fff1c2"
        intensity={4.2}
        distance={90}
        position={[20, 20, 15]}
      />
    </group>
  );
}
