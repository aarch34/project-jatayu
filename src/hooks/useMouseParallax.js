import { useEffect, useRef } from 'react';

/**
 * Custom hook to track mouse position for subtle camera parallax
 */
export function useMouseParallax() {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      // Normalize from -1 to +1
      mouse.current.targetX = (event.clientX / innerWidth) * 2 - 1;
      mouse.current.targetY = -(event.clientY / innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}
