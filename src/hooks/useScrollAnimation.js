import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollAnimation Hook
 * Controls scroll progress state using GSAP ScrollTrigger
 */
export function useScrollAnimation(triggerRef) {
  const scrollProgress = useRef({ value: 0 });

  useEffect(() => {
    if (!triggerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(scrollProgress.current, {
        value: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Smooth cinematic lerp
        },
      });
    }, triggerRef.current);

    return () => ctx.revert();
  }, [triggerRef]);

  return scrollProgress;
}
