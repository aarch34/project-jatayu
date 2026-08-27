import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ProceduralVulture — A detailed, anatomically accurate 3D Vulture mesh fallback
 * Displays characteristic vulture features:
 * - Broad high-aspect ratio wings with finger-like primary wingtips
 * - Distinct light neck ruff / collar
 * - Bare pale head with a sharp hooked beak
 * - Dark plumage with subtle thermal soaring movement
 */
export default function ProceduralVulture({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const headGroupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle soaring sway & banking (vultures glide gracefully on air thermals)
      groupRef.current.position.y += Math.sin(t * 1.2) * 0.003;
      groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.04; // subtle wing bank
      groupRef.current.rotation.x = Math.sin(t * 0.9) * 0.02; // subtle pitch tilt
    }

    // Slow, majestic wing dihedral flex (soaring, NOT rapid flapping)
    const wingFlex = Math.sin(t * 1.5) * 0.06;
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = wingFlex + 0.05; // slight positive dihedral
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = -wingFlex - 0.05;
    }

    // Subtle head movement inspecting valley below
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * 1.1) * 0.08;
      headGroupRef.current.rotation.x = Math.sin(t * 0.8) * 0.05;
    }
  });

  // Materials
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#1a1d1a',
    roughness: 0.8,
    metalness: 0.1,
  });

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: '#141614',
    roughness: 0.75,
  });

  const ruffMaterial = new THREE.MeshStandardMaterial({
    color: '#ded7c6', // Light beige/white neck collar
    roughness: 0.9,
  });

  const headMaterial = new THREE.MeshStandardMaterial({
    color: '#b8a698', // Pale bare skin
    roughness: 0.6,
  });

  const beakMaterial = new THREE.MeshStandardMaterial({
    color: '#cca047', // Golden amber hooked beak
    roughness: 0.4,
    metalness: 0.2,
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* TORSO & BODY */}
      <mesh material={bodyMaterial} position={[0, 0, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
        <coneGeometry args={[0.55, 2.2, 12]} />
      </mesh>

      {/* TAIL FEATHERS */}
      <group position={[0, 0.1, 1.2]}>
        <mesh material={wingMaterial} rotation={[-0.1, 0, 0]}>
          <coneGeometry args={[0.45, 1.1, 5]} />
        </mesh>
      </group>

      {/* NECK RUFF COLLAR (Key Vulture Feature) */}
      <mesh material={ruffMaterial} position={[0, 0.25, -0.95]}>
        <torusGeometry args={[0.3, 0.14, 10, 16]} />
      </mesh>

      {/* HEAD & BEAK */}
      <group ref={headGroupRef} position={[0, 0.35, -1.2]}>
        {/* Slender neck */}
        <mesh material={headMaterial} position={[0, 0.05, 0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.16, 0.45, 10]} />
        </mesh>
        
        {/* Head skull */}
        <mesh material={headMaterial} position={[0, 0.22, -0.1]}>
          <sphereGeometry args={[0.18, 12, 12]} />
        </mesh>

        {/* Hooked Beak */}
        <mesh material={beakMaterial} position={[0, 0.18, -0.32]} rotation={[0.6, 0, 0]}>
          <coneGeometry args={[0.08, 0.3, 8]} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.13, 0.24, -0.14]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        <mesh position={[-0.13, 0.24, -0.14]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
      </group>

      {/* LEFT WING */}
      <group ref={leftWingRef} position={[-0.3, 0.1, 0]}>
        {/* Main wing bone/covert */}
        <mesh material={wingMaterial} position={[-1.8, 0.05, -0.1]} rotation={[0, 0.15, -0.05]}>
          <boxGeometry args={[3.2, 0.08, 0.9]} />
        </mesh>
        {/* Outer wing tip */}
        <mesh material={wingMaterial} position={[-3.6, 0.1, -0.3]} rotation={[0, -0.2, -0.1]}>
          <boxGeometry args={[1.8, 0.05, 0.6]} />
        </mesh>
        {/* Primary feather fingers (5 tips) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={`l-feather-${i}`}
            material={wingMaterial}
            position={[-4.4 - i * 0.12, 0.1, -0.35 + i * 0.12]}
            rotation={[0, -0.3 - i * 0.08, -0.15]}
          >
            <boxGeometry args={[0.7, 0.02, 0.08]} />
          </mesh>
        ))}
      </group>

      {/* RIGHT WING */}
      <group ref={rightWingRef} position={[0.3, 0.1, 0]}>
        {/* Main wing bone/covert */}
        <mesh material={wingMaterial} position={[1.8, 0.05, -0.1]} rotation={[0, -0.15, 0.05]}>
          <boxGeometry args={[3.2, 0.08, 0.9]} />
        </mesh>
        {/* Outer wing tip */}
        <mesh material={wingMaterial} position={[3.6, 0.1, -0.3]} rotation={[0, 0.2, 0.1]}>
          <boxGeometry args={[1.8, 0.05, 0.6]} />
        </mesh>
        {/* Primary feather fingers (5 tips) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={`r-feather-${i}`}
            material={wingMaterial}
            position={[4.4 + i * 0.12, 0.1, -0.35 + i * 0.12]}
            rotation={[0, 0.3 + i * 0.08, 0.15]}
          >
            <boxGeometry args={[0.7, 0.02, 0.08]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
