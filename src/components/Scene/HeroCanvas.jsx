import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import VultureModel from './VultureModel';
import Mountains from './Mountains';
import Atmosphere from './Atmosphere';
import Lighting from './Lighting';

/**
 * Controller Component inside Canvas that smoothly updates Camera and Vulture
 * based on scroll progress and mouse parallax inputs.
 */
function SceneController({ scrollProgress, mouse }) {
  const vultureGroupRef = useRef();

  useFrame((state) => {
    const p = scrollProgress.current ? scrollProgress.current.value : 0;
    const mX = mouse.current ? mouse.current.x : 0;
    const mY = mouse.current ? mouse.current.y : 0;

    // Smooth lerp mouse tracking
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    // CAMERA MOVEMENT (GSAP Driven Scroll Timeline + Mouse Parallax)
    // 0% -> Camera [0, 2, 22]
    // 50% -> Camera [0, 0.5, 12]
    // 100% -> Camera [0, -1, 4]
    const camX = Math.sin(p * Math.PI * 0.4) * 2 + mX * 1.5;
    const camY = THREE.MathUtils.lerp(2.5, -1.2, p) + mY * 1.2;
    const camZ = THREE.MathUtils.lerp(22, 5, p);

    state.camera.position.set(camX, camY, camZ);
    state.camera.lookAt(mX * 0.8, THREE.MathUtils.lerp(1, -0.5, p) + mY * 0.5, -10);

    // HERO VULTUR TRAJECTORY
    if (vultureGroupRef.current) {
      // Interpolate positions across 4 key scroll phases:
      // 0% - 25%: Far distant soaring [10, 7, -40] -> [4, 4, -20]
      // 25% - 50%: Approaching midground [4, 4, -20] -> [1.5, 1.5, -8]
      // 50% - 75%: Cinematic close-pass [-1, 0.3, 1]
      // 75% - 100%: Soaring up & away into sky [8, 9, 3]

      let vx, vy, vz, vrx, vry, vrz;

      if (p <= 0.25) {
        const subP = p / 0.25;
        vx = THREE.MathUtils.lerp(9, 4, subP);
        vy = THREE.MathUtils.lerp(7, 4, subP);
        vz = THREE.MathUtils.lerp(-40, -20, subP);
        vrx = 0.05;
        vry = -0.4;
        vrz = 0.1;
      } else if (p <= 0.5) {
        const subP = (p - 0.25) / 0.25;
        vx = THREE.MathUtils.lerp(4, 1.5, subP);
        vy = THREE.MathUtils.lerp(4, 1.5, subP);
        vz = THREE.MathUtils.lerp(-20, -8, subP);
        vrx = 0.08;
        vry = -0.5;
        vrz = 0.18;
      } else if (p <= 0.75) {
        const subP = (p - 0.5) / 0.25;
        vx = THREE.MathUtils.lerp(1.5, -1.2, subP);
        vy = THREE.MathUtils.lerp(1.5, 0.4, subP);
        vz = THREE.MathUtils.lerp(-8, 1, subP);
        vrx = 0.12;
        vry = -0.7;
        vrz = -0.15;
      } else {
        const subP = (p - 0.75) / 0.25;
        vx = THREE.MathUtils.lerp(-1.2, 7.5, subP);
        vy = THREE.MathUtils.lerp(0.4, 8.5, subP);
        vz = THREE.MathUtils.lerp(1, 4, subP);
        vrx = -0.1;
        vry = -0.2;
        vrz = 0.25;
      }

      // Add subtle mouse offset to vulture
      vultureGroupRef.current.position.set(vx + mX * 0.6, vy + mY * 0.4, vz);
      vultureGroupRef.current.rotation.set(vrx, vry, vrz);
    }
  });

  return (
    <>
      <Lighting />
      <Atmosphere isMobile={window.innerWidth < 768} />
      <Mountains />
      <group ref={vultureGroupRef}>
        <VultureModel scale={0.7} />
      </group>
    </>
  );
}

/**
 * Main R3F Canvas Wrapper Component
 */
export default function HeroCanvas({ scrollProgress, mouse }) {
  return (
    <div className="canvas-wrapper">
      <Canvas
        camera={{ position: [0, 2, 22], fov: 48, near: 0.1, far: 300 }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#112318']} />
        <SceneController scrollProgress={scrollProgress} mouse={mouse} />
      </Canvas>
    </div>
  );
}
