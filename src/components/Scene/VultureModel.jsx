import React, { useState, useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import ProceduralVulture from './ProceduralVulture';

/**
 * GLTFVultureWrapper — Loads external GLB model if available
 */
function GLTFVultureWrapper({ modelPath, position, scale, rotation }) {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Play first animation clip (e.g. fly/glide)
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y += Math.sin(t * 1.2) * 0.003;
      group.current.rotation.z = Math.sin(t * 0.7) * 0.04;
    }
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * VultureModel Component
 * Checks if /models/vulture.glb exists in public folder.
 * Seamlessly falls back to <ProceduralVulture /> if missing or error occurs.
 */
export default function VultureModel({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) {
  const [hasGLB, setHasGLB] = useState(false);
  const modelPath = '/models/vulture.glb';

  useEffect(() => {
    // Check if vulture.glb is present on server/public directory
    fetch(modelPath, { method: 'HEAD' })
      .then((res) => {
        if (res.ok && res.headers.get('content-type')?.includes('octet-stream')) {
          setHasGLB(true);
        } else {
          setHasGLB(false);
        }
      })
      .catch(() => setHasGLB(false));
  }, []);

  if (hasGLB) {
    return (
      <React.Suspense fallback={<ProceduralVulture position={position} scale={scale} rotation={rotation} />}>
        <GLTFVultureWrapper modelPath={modelPath} position={position} scale={scale} rotation={rotation} />
      </React.Suspense>
    );
  }

  return <ProceduralVulture position={position} scale={scale} rotation={rotation} />;
}
