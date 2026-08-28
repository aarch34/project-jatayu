import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

/**
 * Procedural Low-Poly 3D Tree Component
 * Matches the exact polygonal aesthetic of the Hero 3D environment
 */
function LowPolyTree({ position, scale = 1, rotationY = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Tree Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3, 6]} />
        <meshStandardMaterial color="#423122" roughness={0.9} flatShading={true} />
      </mesh>

      {/* Layered Conical Foliage */}
      <mesh position={[0, 3.8, 0]}>
        <coneGeometry args={[2.2, 3.8, 6]} />
        <meshStandardMaterial color="#21452c" roughness={0.8} flatShading={true} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[1.7, 3.2, 6]} />
        <meshStandardMaterial color="#2d5939" roughness={0.8} flatShading={true} />
      </mesh>
      <mesh position={[0, 7.0, 0]}>
        <coneGeometry args={[1.2, 2.5, 6]} />
        <meshStandardMaterial color="#3a6d47" roughness={0.75} flatShading={true} />
      </mesh>
    </group>
  );
}

/**
 * Procedural Low-Poly 3D Mountain Mesh
 */
function LowPolyMountain({
  position = [0, 0, 0],
  width = 200,
  height = 50,
  segments = 100,
  color = '#1f3d29',
  noiseScale = 0.04,
  heightMultiplier = 18,
  isForeground = false,
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, Math.floor(segments / 2));
    const noise2D = createNoise2D();
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const n1 = noise2D(x * noiseScale, y * noiseScale);
      const n2 = noise2D(x * noiseScale * 2.5, y * noiseScale * 2.5) * 0.5;
      const n3 = noise2D(x * noiseScale * 5, y * noiseScale * 5) * 0.2;

      const distFromCenter = Math.abs(x) / (width * 0.5);
      const valleyFactor = isForeground
        ? Math.pow(distFromCenter, 1.6)
        : 1 - Math.pow(1 - distFromCenter, 2) * 0.25;

      let zElevation = (n1 + n2 + n3) * heightMultiplier * valleyFactor;

      if (y < -height * 0.3) {
        zElevation *= (y + height * 0.5) / (height * 0.2);
      }

      pos.setZ(i, zElevation);
    }

    geo.computeVertexNormals();
    return geo;
  }, [width, height, segments, noiseScale, heightMultiplier, isForeground]);

  return (
    <mesh geometry={geometry} position={position} rotation={[-Math.PI / 2.2, 0, 0]}>
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0.05}
        flatShading={true}
      />
    </mesh>
  );
}

/**
 * 3D Sun, Glowing Halo & Volumetric Light Beam Rays
 */
function SunriseSunAndRays() {
  const raysRef = useRef();

  useFrame((state) => {
    if (raysRef.current) {
      const t = state.clock.getElapsedTime();
      raysRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
    }
  });

  return (
    <group position={[18, 14, -110]}>
      {/* Sun Core */}
      <mesh>
        <sphereGeometry args={[11, 32, 32]} />
        <meshBasicMaterial color="#ffe896" />
      </mesh>

      {/* Sun Inner Glow Ring */}
      <mesh position={[0, 0, 1]}>
        <ringGeometry args={[11, 48, 32]} />
        <meshBasicMaterial
          color="#ffc845"
          transparent={true}
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sun Outer Soft Atmosphere Ring */}
      <mesh position={[0, 0, 0.5]}>
        <ringGeometry args={[45, 95, 32]} />
        <meshBasicMaterial
          color="#ffa726"
          transparent={true}
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric Rays Beams */}
      <group ref={raysRef} position={[0, -10, 2]}>
        {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((angle, idx) => (
          <mesh
            key={`ray-${idx}`}
            rotation={[0, 0, angle]}
            position={[angle * 40, -40, 0]}
          >
            <planeGeometry args={[14 + idx * 4, 180]} />
            <meshBasicMaterial
              color="#ffeab3"
              transparent={true}
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * Golden Sunlight Dust / Pollen Motes
 */
function SunlightParticles() {
  const particlesRef = useRef();
  const count = 750;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = Math.random() * 45 - 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      spd[i * 3] = (Math.random() - 0.5) * 0.012;
      spd[i * 3 + 1] = Math.random() * 0.015 + 0.004;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return [pos, spd];
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      const posArr = particlesRef.current.geometry.attributes.position.array;
      const t = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += speeds[i * 3 + 1];
        posArr[i * 3] += Math.sin(t + i) * 0.006;

        if (posArr[i * 3 + 1] > 38) {
          posArr[i * 3 + 1] = -10;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color="#ffe28a"
        transparent={true}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * 3D Scene Controller with subtle Parallax
 */
function RayOfHopeScene() {
  const sceneGroupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sceneGroupRef.current) {
      sceneGroupRef.current.rotation.y = Math.sin(t * 0.08) * 0.015;
    }
  });

  // Pre-generate 3D tree cluster positions along left & right foothills
  const treeClusters = useMemo(() => {
    const trees = [];
    // Left foothill forest cluster
    for (let i = 0; i < 18; i++) {
      trees.push({
        id: `left-tree-${i}`,
        position: [-38 - (i * 2.2) % 35, -12 + (i % 3) * 1.5, -25 - (i * 4.5) % 65],
        scale: 0.85 + (i % 4) * 0.25,
        rotationY: i * 0.7,
      });
    }
    // Right foothill forest cluster
    for (let i = 0; i < 18; i++) {
      trees.push({
        id: `right-tree-${i}`,
        position: [38 + (i * 2.2) % 35, -12 + (i % 3) * 1.5, -25 - (i * 4.5) % 65],
        scale: 0.85 + (i % 4) * 0.25,
        rotationY: i * 0.9,
      });
    }
    return trees;
  }, []);

  return (
    <group ref={sceneGroupRef}>
      {/* Warm Golden Sunrise Lighting */}
      <ambientLight color="#fff0d4" intensity={1.35} />
      <directionalLight color="#ffda78" intensity={4.5} position={[25, 22, -40]} castShadow />
      <directionalLight color="#7ab893" intensity={0.9} position={[-20, 12, -20]} />
      <pointLight color="#ffe896" intensity={3.5} distance={120} position={[18, 14, -70]} />

      <fogExp2 attach="fog" args={['#e4efe6', 0.006]} />

      {/* Sunrise Sun & Light Beams */}
      <SunriseSunAndRays />

      {/* Sun Dust / Pollen Motes */}
      <SunlightParticles />

      {/* Layered Low-Poly 3D Mountain Environment */}
      {/* Foreground Left Mountain */}
      <LowPolyMountain
        position={[-35, -13, -18]}
        width={110}
        height={45}
        segments={75}
        color="#1b3823"
        heightMultiplier={20}
        noiseScale={0.055}
        isForeground={true}
      />
      {/* Foreground Right Mountain */}
      <LowPolyMountain
        position={[35, -13, -20]}
        width={110}
        height={45}
        segments={75}
        color="#1f4029"
        heightMultiplier={18}
        noiseScale={0.05}
        isForeground={true}
      />

      {/* Midground Mountain Range */}
      <LowPolyMountain
        position={[0, -17, -55]}
        width={230}
        height={75}
        segments={95}
        color="#2c573a"
        heightMultiplier={28}
        noiseScale={0.035}
      />

      {/* Background Distant Mountain Range */}
      <LowPolyMountain
        position={[-12, -19, -105]}
        width={340}
        height={95}
        segments={105}
        color="#457853"
        heightMultiplier={40}
        noiseScale={0.02}
      />

      {/* Far Horizon Ridges (Sunlight Backlit) */}
      <LowPolyMountain
        position={[18, -22, -165]}
        width={480}
        height={130}
        segments={115}
        color="#699975"
        heightMultiplier={52}
        noiseScale={0.012}
      />

      {/* Low-Poly 3D Trees along Foothills */}
      <group>
        {treeClusters.map((tree) => (
          <LowPolyTree
            key={tree.id}
            position={tree.position}
            scale={tree.scale}
            rotationY={tree.rotationY}
          />
        ))}
      </group>
    </group>
  );
}

/**
 * RayOfHopeCanvas — Full 3D Sunrise Environment Background Component
 */
export default function RayOfHopeCanvas() {
  return (
    <div className="ray-of-hope-canvas-wrapper" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 2, 22], fov: 46, near: 0.1, far: 320 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#dcebe0']} />
        <RayOfHopeScene />
      </Canvas>
    </div>
  );
}
