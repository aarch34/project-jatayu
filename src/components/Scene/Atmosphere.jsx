import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Atmosphere Component — Renders fog, floating dust/pollen motes, and soft cloud haze
 */
export default function Atmosphere({ isMobile = false }) {
  const particlesRef = useRef();
  const cloudsRef = useRef();

  // Floating pollen/dust particle count (reduced on mobile for performance)
  const particleCount = isMobile ? 400 : 1200;

  const [particlePositions, particleSpeeds] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;     // X
      positions[i * 3 + 1] = Math.random() * 40 - 5;       // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;   // Z

      speeds[i * 3] = (Math.random() - 0.5) * 0.015;      // Drift X
      speeds[i * 3 + 1] = Math.random() * 0.01 + 0.003;   // Upward lift Y
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.01;   // Drift Z
    }

    return [positions, speeds];
  }, [particleCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Animate floating pollen/dust particles in thermal updrafts
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i * 3 + 1]; // Move up
        positions[i * 3] += Math.sin(t + i) * 0.005;        // Sway X

        // Wrap around bounds
        if (positions[i * 3 + 1] > 35) {
          positions[i * 3 + 1] = -5;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Drifting clouds in distant valley
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, index) => {
        cloud.position.x += 0.012 * (index % 2 === 0 ? 1 : -0.8);
        if (cloud.position.x > 90) cloud.position.x = -90;
        if (cloud.position.x < -90) cloud.position.x = 90;
      });
    }
  });

  return (
    <group>
      {/* EXPONENTIAL ATMOSPHERIC FOG (WARM FOREST DAWN) */}
      <fogExp2 attach="fog" args={['#182e21', 0.009]} />

      {/* FLOATING POLLEN / SUN DUST PARTICLES */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#ffe58f"
          transparent={true}
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* DISTANT VALLEY CLOUDS / SUNLIT HAZE */}
      <group ref={cloudsRef} position={[0, -2, -80]}>
        {[-40, -10, 25, 55].map((xPos, idx) => (
          <mesh key={`cloud-${idx}`} position={[xPos, (idx % 2) * 3, (idx % 3) * -15]}>
            <sphereGeometry args={[16 + idx * 4, 12, 12]} />
            <meshStandardMaterial
              color="#344e3d"
              transparent={true}
              opacity={0.35}
              roughness={0.9}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
