import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

/**
 * Creates a procedural 3D Mountain Mesh using Simplex Noise
 */
function MountainRange({
  position = [0, 0, 0],
  width = 200,
  height = 50,
  segments = 120,
  color = '#122217',
  roughness = 0.95,
  noiseScale = 0.05,
  heightMultiplier = 12,
  isForeground = false,
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, Math.floor(segments / 2));
    const noise2D = createNoise2D();
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      
      // Calculate noise height offset
      const n1 = noise2D(x * noiseScale, y * noiseScale);
      const n2 = noise2D(x * noiseScale * 2.5, y * noiseScale * 2.5) * 0.5;
      const n3 = noise2D(x * noiseScale * 5, y * noiseScale * 5) * 0.2;
      
      // Fade out edges for valley center opening
      const distFromCenter = Math.abs(x) / (width * 0.5);
      const valleyFactor = isForeground ? Math.pow(distFromCenter, 1.8) : 1 - Math.pow(1 - distFromCenter, 2) * 0.3;

      let zElevation = (n1 + n2 + n3) * heightMultiplier * valleyFactor;
      
      // Ensure bottom vertices stay flat for smooth horizon joining
      if (y < -height * 0.3) {
        zElevation *= (y + height * 0.5) / (height * 0.2);
      }

      pos.setZ(i, zElevation);
    }

    geo.computeVertexNormals();
    return geo;
  }, [width, height, segments, noiseScale, heightMultiplier, isForeground]);

  return (
    <mesh geometry={geometry} position={position} rotation={[-Math.PI / 2.3, 0, 0]}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={0.05}
        flatShading={true} // Low-poly / faceted documentary look
      />
    </mesh>
  );
}

/**
 * Multi-layered 3D Mountain Environment with Parallax Depth
 */
export default function Mountains() {
  return (
    <group>
      {/* Layer 1: Foreground Rocky Outcrops (Left & Right Framing) */}
      <MountainRange
        position={[-30, -12, -15]}
        width={100}
        height={40}
        segments={80}
        color="#162c1d"
        heightMultiplier={18}
        noiseScale={0.06}
        isForeground={true}
      />
      <MountainRange
        position={[30, -12, -18]}
        width={100}
        height={40}
        segments={80}
        color="#193322"
        heightMultiplier={16}
        noiseScale={0.05}
        isForeground={true}
      />

      {/* Layer 2: Midground Mountain Range */}
      <MountainRange
        position={[0, -16, -55]}
        width={220}
        height={70}
        segments={100}
        color="#1d3b28"
        heightMultiplier={26}
        noiseScale={0.035}
      />

      {/* Layer 3: Background Distant Silhouettes */}
      <MountainRange
        position={[-10, -18, -110]}
        width={320}
        height={90}
        segments={110}
        color="#274f37"
        heightMultiplier={38}
        noiseScale={0.02}
      />

      {/* Layer 4: Far Horizon Ridges */}
      <MountainRange
        position={[15, -20, -170]}
        width={450}
        height={120}
        segments={120}
        color="#356144"
        heightMultiplier={50}
        noiseScale={0.012}
      />
    </group>
  );
}
