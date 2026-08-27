import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * EcosystemSection Component — Step 5 interactive ecosystem simulation controlled by a 100% -> 0% population slider
 */
export default function EcosystemSection() {
  const [population, setPopulation] = useState(100);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  // Calculate dynamic metrics based on population (0 - 100)
  const metrics = useMemo(() => {
    const popRatio = population / 100;
    
    // Ecosystem health: 100% at pop 100 -> 25% at pop 0
    const health = Math.round(25 + popRatio * 75);
    
    // Carcass removal status
    let removalStatus = 'FAST';
    let removalColor = '#2ecc71';
    if (population < 30) {
      removalStatus = 'SLOW';
      removalColor = '#e74c3c';
    } else if (population < 70) {
      removalStatus = 'MODERATE';
      removalColor = '#f39c12';
    }

    // Disease risk status
    let diseaseStatus = 'LOW';
    let diseaseColor = '#2ecc71';
    if (population < 30) {
      diseaseStatus = 'HIGHER';
      diseaseColor = '#e74c3c';
    } else if (population < 70) {
      diseaseStatus = 'MODERATE';
      diseaseColor = '#f39c12';
    }

    return {
      health,
      removalStatus,
      removalColor,
      diseaseStatus,
      diseaseColor,
      vultureCount: Math.round(popRatio * 8), // 0 to 8 soaring vultures
      pathogenCount: Math.round((1 - popRatio) * 12), // 0 to 12 abstract pathogen nodes
    };
  }, [population]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="ecosystem-section" id="ecosystem-simulation" ref={sectionRef}>
      <div className="ecosystem-container">
        {/* Section Header */}
        <div className="ecosystem-header" ref={headerRef}>
          <div className="section-eyebrow">
            <span className="eyebrow-dot" />
            <span>The Ripple Effect</span>
          </div>

          <h2 className="ecosystem-title">
            What Happens When The <br />
            <span className="highlight-gold">Cleaners Disappear?</span>
          </h2>

          <p className="ecosystem-intro">
            Vultures are more than scavengers. Their disappearance can create a chain reaction throughout the ecosystem.
          </p>
        </div>

        {/* Interactive 2.5D Ecosystem Simulation Stage */}
        <div className="ecosystem-stage-card">
          {/* Visual Environment Canvas / SVG Overlay */}
          <div className="ecosystem-visual-viewport">
            {/* Background Sky & Distant Mountains */}
            <div
              className="sky-backdrop"
              style={{
                background: `linear-gradient(180deg, 
                  rgba(25, 45, 32, ${0.4 + (population / 100) * 0.5}) 0%, 
                  rgba(18, 30, 22, 0.9) 70%, 
                  #0c1710 100%)`,
              }}
            />

            <svg className="ecosystem-svg-stage" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid slice">
              {/* Distant Mountain Silhouettes */}
              <path
                d="M0 300 Q150 240 300 280 T600 250 T900 280 L1000 300 L1000 420 L0 420 Z"
                fill="#162e20"
                opacity="0.8"
              />
              <path
                d="M0 320 Q250 270 500 300 T1000 290 L1000 420 L0 420 Z"
                fill="#1f3e2c"
                opacity="0.9"
              />

              {/* Grassland Floor */}
              <rect x="0" y="320" width="1000" height="100" fill="#244833" />
              <path
                d="M0 320 Q200 310 400 325 T800 315 L1000 325 L1000 420 L0 420 Z"
                fill="#1d3b2a"
              />

              {/* Trees Silhouettes */}
              <g className="tree-group" opacity="0.95">
                <path d="M120 320 L120 250 M120 250 L100 270 M120 250 L140 270 M120 270 L95 295 M120 270 L145 295" stroke="#14281c" strokeWidth="4" strokeLinecap="round" />
                <path d="M850 320 L850 240 M850 240 L830 260 M850 240 L870 260 M850 260 L825 285 M850 260 L875 285" stroke="#14281c" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Livestock Silhouettes */}
              <g className="livestock-group" opacity="0.75" fill="#14281c">
                {/* Cattle Silhouette Left */}
                <path d="M220 315 c-5-10-15-12-25-10 c-8 2-15 8-20 6 c-3-2-2-8-6-8 c-4 0-6 4-8 8 c-2 2-6 2-8 0 c-2-2-4 0-4 4 c0 6 6 12 12 12 h35 v12 h4 v-12 h12 v12 h4 v-14 Z" />
                {/* Cattle Silhouette Right */}
                <path d="M720 318 c-5-8-12-10-20-8 c-7 2-12 6-16 5 c-2-1-2-6-5-6 c-3 0-5 3-6 6 c-2 2-5 2-6 0 c-2-2-3 0-3 3 c0 5 5 10 10 10 h28 v10 h4 v-10 h10 v10 h4 v-12 Z" />
              </g>

              {/* Symbolic Carrion/Nutrient Indicator (Clean & Stylized) */}
              <g className="carrion-symbolic" transform="translate(480, 315)">
                <ellipse cx="20" cy="10" rx="28" ry="8" fill="#3a2e22" opacity="0.8" />
                <circle cx="20" cy="10" r="4" fill="#f7be45" opacity={0.3 + (1 - population / 100) * 0.7} />
              </g>

              {/* Soaring Vultures Silhouettes (Count tied to Population) */}
              <g className="vultures-soaring-group">
                {Array.from({ length: 8 }).map((_, i) => {
                  const isVisible = i < metrics.vultureCount;
                  const xPos = 150 + (i * 105) % 750;
                  const yPos = 60 + (i * 35) % 110;
                  const scale = 0.7 + (i % 3) * 0.25;

                  return (
                    <g
                      key={`vulture-sil-${i}`}
                      transform={`translate(${xPos}, ${yPos}) scale(${scale})`}
                      opacity={isVisible ? 0.95 : 0}
                      style={{ transition: 'opacity 0.5s ease-in-out' }}
                    >
                      {/* Vulture soaring silhouette path */}
                      <path
                        d="M-20 0 C-12 -8 -4 -6 0 0 C4 -6 12 -8 20 0 C10 4 2 2 0 6 C-2 2 -10 4 -20 0 Z"
                        fill="#f7be45"
                      />
                    </g>
                  );
                })}
              </g>

              {/* Abstract Pathogen/Disease Microorganism Nodes (Fade in at low population) */}
              <g className="pathogens-abstract-group">
                {Array.from({ length: 12 }).map((_, i) => {
                  const isVisible = i < metrics.pathogenCount;
                  const px = 420 + (i * 25) % 160;
                  const py = 280 + (i * 12) % 35;

                  return (
                    <circle
                      key={`pathogen-${i}`}
                      cx={px}
                      cy={py}
                      r={3 + (i % 3)}
                      fill="#e74c3c"
                      opacity={isVisible ? 0.75 : 0}
                      style={{ transition: 'opacity 0.6s ease-in-out' }}
                    >
                      <animate
                        attributeName="r"
                        values="3;6;3"
                        dur={`${2 + (i % 2)}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Interactive Population Slider Controls */}
          <div className="ecosystem-controls-bar">
            <div className="slider-header-row">
              <label htmlFor="vulture-pop-slider" className="slider-label">
                <span>VULTURES</span>
              </label>
              <div className="slider-value-badge">
                <span className="value-num">{population}%</span>
              </div>
            </div>

            <div className="slider-track-wrapper">
              <input
                id="vulture-pop-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={population}
                onChange={(e) => setPopulation(Number(e.target.value))}
                aria-label="Vulture population level"
                className="custom-pop-slider"
              />
              <div className="slider-track-fill" style={{ width: `${population}%` }} />
            </div>

            {/* Quick Preset Buttons */}
            <div className="preset-buttons-row">
              <button
                type="button"
                className={`preset-btn ${population === 100 ? 'active' : ''}`}
                onClick={() => setPopulation(100)}
              >
                100% Balanced
              </button>
              <button
                type="button"
                className={`preset-btn ${population === 50 ? 'active' : ''}`}
                onClick={() => setPopulation(50)}
              >
                50% Reduced
              </button>
              <button
                type="button"
                className={`preset-btn ${population === 0 ? 'active' : ''}`}
                onClick={() => setPopulation(0)}
              >
                0% Absent
              </button>
            </div>
          </div>

          {/* Live Ecosystem Metrics Indicators */}
          <div className="ecosystem-metrics-grid">
            {/* Metric 1: Ecosystem Health */}
            <div className="metric-card">
              <div className="metric-header">
                <Activity size={18} className="metric-icon" />
                <span className="metric-title">ECOSYSTEM HEALTH</span>
              </div>
              <div className="metric-value-row">
                <div className="health-bar-bg">
                  <div
                    className="health-bar-fill"
                    style={{
                      width: `${metrics.health}%`,
                      background: metrics.health > 60 ? '#2ecc71' : metrics.health > 35 ? '#f39c12' : '#e74c3c',
                    }}
                  />
                </div>
                <span className="metric-stat">{metrics.health}%</span>
              </div>
            </div>

            {/* Metric 2: Carcass Removal Speed */}
            <div className="metric-card">
              <div className="metric-header">
                <Clock size={18} className="metric-icon" />
                <span className="metric-title">CARCASS REMOVAL</span>
              </div>
              <div className="metric-value-row">
                <span className="metric-pill" style={{ color: metrics.removalColor, borderColor: metrics.removalColor }}>
                  {metrics.removalStatus}
                </span>
              </div>
            </div>

            {/* Metric 3: Disease & Pathogen Risk */}
            <div className="metric-card">
              <div className="metric-header">
                <AlertCircle size={18} className="metric-icon" />
                <span className="metric-title">DISEASE RISK</span>
              </div>
              <div className="metric-value-row">
                <span className="metric-pill" style={{ color: metrics.diseaseColor, borderColor: metrics.diseaseColor }}>
                  {metrics.diseaseStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Scientific Context Card */}
          <div className="ecosystem-science-card">
            <p className="science-explanation">
              {population === 0 ? (
                <span>
                  Without vultures, carcasses can remain in the environment longer, changing scavenger communities and potentially increasing opportunities for pathogens to persist or spread.
                </span>
              ) : population < 50 ? (
                <span>
                  As vulture numbers drop, carcass decomposition slows. Opportunistic scavengers may increase, altering local ecosystem dynamics.
                </span>
              ) : (
                <span>
                  With a healthy vulture population, animal remains are processed rapidly and safely, maintaining ecosystem balance and natural nutrient recycling.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Educational Callout Banner */}
        <div className="ecosystem-callout-banner">
          <div className="callout-line" />
          <div className="callout-content">
            <h3 className="callout-main">ONE SPECIES. A WHOLE ECOSYSTEM.</h3>
            <p className="callout-sub">That&apos;s why protecting vultures matters.</p>
          </div>
          <div className="callout-line" />
        </div>
      </div>
    </section>
  );
}
