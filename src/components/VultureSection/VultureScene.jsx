import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import VultureModel from '../Scene/VultureModel';
import AnatomyHotspots from './AnatomyHotspots';
import CameraFocusController from './CameraFocusController';

/**
 * VultureScene Component — 3D Canvas stage for inspecting the Vulture model up close
 */
export default function VultureScene({ hotspots, activeHotspot, onSelectHotspot }) {
  const controlsRef = useRef();

  return (
    <div className="vulture-stage-wrapper">
      <Canvas
        camera={{ position: [3.2, 1.4, 4.2], fov: 42, near: 0.1, far: 100 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050c08']} />

        {/* WILDLIFE SPECIMEN EXHIBITION LIGHTING */}
        <ambientLight color="#1a3022" intensity={1.1} />
        {/* Warm Sunset/Sunlight Key Light */}
        <directionalLight color="#fcdb8b" intensity={3.4} position={[12, 15, 12]} castShadow />
        {/* Cool Forest Fill Light */}
        <directionalLight color="#6fa887" intensity={0.8} position={[-12, 8, -8]} />
        {/* Rim Light for Vulture Silhouette Separation */}
        <pointLight color="#fff0d1" intensity={4.5} distance={50} position={[0, 6, -10]} />

        {/* SINGLE HERO VULTURE MODEL (SCALED FOR HERO PROMINENCE) */}
        <group position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
          <VultureModel scale={1.35} rotation={[0.15, -0.6, 0]} />
        </group>

        {/* ANATOMY 3D HOTSPOTS */}
        <AnatomyHotspots
          hotspots={hotspots}
          activeId={activeHotspot}
          onSelect={onSelectHotspot}
        />

        {/* CAMERA LERP FOCUS CONTROLLER */}
        <CameraFocusController activeHotspot={activeHotspot} controlsRef={controlsRef} />

        {/* ORBIT CONTROLS FOR USER DRAG & ROTATION */}
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.6}
          enableZoom={false} // Disable wheel zoom so mouse wheel always scrolls web page naturally
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.75}
          enabled={!activeHotspot} // Disable free rotation while focused on a specific hotspot
        />
      </Canvas>
    </div>
  );
}
