import React, { useState, useMemo } from 'react';
import VultureFrameAnimation from '../VultureFrameAnimation';
import AnatomyInfo from './AnatomyInfo';
import AnatomyNavigation from './AnatomyNavigation';

/**
 * VultureSection Component — Meet the Vulture section featuring 2D Jatayu wingbeat animation sequence
 */
export default function VultureSection() {
  const [activeHotspot, setActiveHotspot] = useState(null);

  const hotspots = useMemo(
    () => [
      {
        id: 'eyes',
        num: '01',
        label: 'EYES',
        title: 'VISION',
        description: 'Exceptional eyesight helps vultures locate food across vast landscapes.',
        style: { top: '35%', left: '33%' },
      },
      {
        id: 'wings',
        num: '02',
        label: 'WINGS',
        title: 'WINGS',
        description: 'Broad wings allow vultures to soar for long periods while using remarkably little energy.',
        style: { top: '24%', left: '68%' },
      },
      {
        id: 'beak',
        num: '03',
        label: 'BEAK',
        title: 'THE BEAK',
        description: "Designed for tearing through carrion, the vulture's powerful beak is perfectly adapted to its role as nature's cleanup crew.",
        style: { top: '44%', left: '23%' },
      },
      {
        id: 'feet',
        num: '04',
        label: 'FEET',
        title: 'FEET',
        description: 'Strong feet help vultures grip their surroundings and handle food efficiently.',
        style: { top: '74%', left: '65%' },
      },
    ],
    []
  );

  const activeHotspotData = useMemo(
    () => hotspots.find((h) => h.id === activeHotspot) || null,
    [hotspots, activeHotspot]
  );

  return (
    <section className="vulture-section" id="meet-the-vulture">
      <div className="vulture-section-grid">
        {/* Left Column: Editorial Introduction */}
        <div className="vulture-editorial-col">
          <div className="section-eyebrow">
            <span className="eyebrow-dot" />
            <span>Meet the Vulture</span>
          </div>

          <h2 className="vulture-heading">
            <span>The</span><br />
            <span>Cleaner</span><br />
            <span>Of The</span><br />
            <span className="highlight">Skies.</span>
          </h2>

          <p className="vulture-intro-text">
            Often misunderstood, vultures are among nature&apos;s most important recyclers &mdash; quietly keeping ecosystems clean and healthy.
          </p>

          <div className="interaction-hint">
            <span>Watch Jatayu in flight &bull; Explore its anatomy</span>
          </div>
        </div>

        {/* Right Column: 2D Frame-by-Frame Exhibition Stage */}
        <div className="vulture-stage-col">
          {/* Continuous 16-Frame Looping Animation */}
          <VultureFrameAnimation width={720} height={405} fps={14} />

          {/* HTML Overlay Hotspots */}
          <div className="vulture-2d-hotspots-overlay">
            {hotspots.map((item) => {
              const isActive = activeHotspot === item.id;
              return (
                <div
                  key={item.id}
                  className={`hotspot-marker hotspot-2d ${isActive ? 'active' : ''}`}
                  style={item.style}
                  onClick={() => setActiveHotspot(isActive ? null : item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveHotspot(isActive ? null : item.id);
                    }
                  }}
                  aria-label={`Inspect ${item.label}`}
                >
                  <div className="hotspot-dot">
                    <span className="dot-inner" />
                    <span className="dot-pulse" />
                  </div>
                  <div className="hotspot-stem" />
                  <div className="hotspot-tag">
                    <span className="tag-num">{item.num}</span>
                    <span className="tag-name">{item.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Anatomy Information Panel */}
          <AnatomyInfo
            hotspot={activeHotspotData}
            onClose={() => setActiveHotspot(null)}
          />
        </div>
      </div>

      {/* Bottom Anatomy Navigation Pill Bar */}
      <AnatomyNavigation
        hotspots={hotspots}
        activeId={activeHotspot}
        onSelect={(id) => setActiveHotspot(id)}
        onReset={() => setActiveHotspot(null)}
      />
    </section>
  );
}
