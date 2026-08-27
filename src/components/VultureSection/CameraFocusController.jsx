import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CameraFocusController Component — Smoothly lerps Three.js Camera & OrbitControls target
 * to inspect selected anatomy feature
 */
export default function CameraFocusController({ activeHotspot, controlsRef }) {
  const targetCamPos = useRef(new THREE.Vector3(4.5, 2.8, 7.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.2, 0));

  const cameraPresetMap = useMemo(
    () => ({
      default: {
        pos: new THREE.Vector3(3.2, 1.4, 4.2),
        target: new THREE.Vector3(0, 0.1, -0.2),
      },
      eyes: {
        pos: new THREE.Vector3(0.6, 0.65, -0.5),
        target: new THREE.Vector3(0, 0.58, -1.34),
      },
      beak: {
        pos: new THREE.Vector3(0.5, 0.45, -0.7),
        target: new THREE.Vector3(0, 0.42, -1.55),
      },
      wings: {
        pos: new THREE.Vector3(-3.2, 1.1, 1.4),
        target: new THREE.Vector3(-2.0, 0.25, -0.2),
      },
      feet: {
        pos: new THREE.Vector3(1.1, -0.3, 1.5),
        target: new THREE.Vector3(0, -0.65, 0.3),
      },
    }),
    []
  );

  useFrame((state) => {
    const preset = cameraPresetMap[activeHotspot] || cameraPresetMap.default;

    targetCamPos.current.copy(preset.pos);
    targetLookAt.current.copy(preset.target);

    // Smooth lerp camera position
    state.camera.position.lerp(targetCamPos.current, 0.05);

    // Smooth lerp orbit controls target
    if (controlsRef && controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
      controlsRef.current.update();
    } else {
      state.camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}
