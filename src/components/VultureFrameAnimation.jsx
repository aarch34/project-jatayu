import React, { useEffect, useState } from 'react';

/**
 * VultureFrameAnimation — Renders the original uploaded 2D PNG frame sequence
 * (frame_01.png -> frame_16.png) directly in an <img> element with zero filters,
 * zero color manipulation, and exact object-fit: contain proportions.
 */
export default function VultureFrameAnimation({
  fps = 11,
  className = '',
  style = {},
}) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = 16;
  const framePaths = Array.from({ length: totalFrames }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `/vulture-frames/frame_${num}.png`;
  });

  // Preload all 16 original PNG images
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    framePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount += 1;
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };
      images.push(img);
    });
  }, []);

  // Frame animation loop at ~11 FPS (approx. 90ms per frame)
  useEffect(() => {
    const frameInterval = 1000 / fps;
    const intervalId = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % totalFrames);
    }, frameInterval);

    return () => clearInterval(intervalId);
  }, [fps]);

  return (
    <div className={`vulture-frame-anim-container ${className}`} style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <img
        src={framePaths[currentFrameIndex]}
        alt={`Jatayu Wingbeat Frame ${currentFrameIndex + 1}`}
        className="vulture-frame-img"
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '480px',
          objectFit: 'contain',
          filter: 'none', // ZERO image filtering as required
          mixBlendMode: 'normal',
          opacity: 1,
          display: 'block',
          margin: '0 auto',
        }}
      />
      {!isLoaded && (
        <div className="vulture-anim-loading" style={{ position: 'absolute', color: '#f7be45', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
          <span>Loading Jatayu Wingbeat Sequence...</span>
        </div>
      )}
    </div>
  );
}
