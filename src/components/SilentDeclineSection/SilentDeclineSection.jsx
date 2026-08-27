import React, { useEffect, useRef } from 'react';
import { Pill, Trees, AlertTriangle, TrendingDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SilentDeclineSection Component — Step 4 interactive vertical timeline of vulture threats
 */
export default function SilentDeclineSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const stemProgressRef = useRef(null);
  const nodesRef = useRef([]);
  const transitionRef = useRef(null);

  const threatsData = [
    {
      num: '01',
      title: 'VETERINARY DICLOFENAC',
      subtitle: 'CHALLENGE',
      icon: Pill,
      description: 'A veterinary painkiller called diclofenac was a major cause of vulture deaths when birds consumed the remains of treated livestock.',
      visualLabel: 'Chemical Toxicity',
      graphicType: 'medicine-to-vulture',
    },
    {
      num: '02',
      title: 'LOSS OF FOOD & HABITAT',
      subtitle: 'ENVIRONMENT',
      icon: Trees,
      description: 'Changes in livestock practices, food availability and habitat can make it harder for vultures to find safe places to feed and nest.',
      visualLabel: 'Fragmented Landscape',
      graphicType: 'habitat-loss',
    },
    {
      num: '03',
      title: 'POISONING & HUMAN CONFLICT',
      subtitle: 'THREAT',
      icon: AlertTriangle,
      description: 'Poisoned carcasses and other human-related threats can kill vultures and disrupt their populations.',
      visualLabel: 'Indirect Poisoning',
      graphicType: 'conflict-symbol',
    },
    {
      num: '04',
      title: 'DECLINING POPULATIONS',
      subtitle: 'IMPACT',
      icon: TrendingDown,
      description: 'When vulture populations fall, the ecological services they provide are lost too.',
      visualLabel: 'Species Reduction',
      graphicType: 'population-decay',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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

      // Vertical timeline stem fill animation
      if (stemProgressRef.current) {
        gsap.fromTo(
          stemProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.decline-timeline',
              start: 'top 70%',
              end: 'bottom 75%',
              scrub: 0.5,
            },
          }
        );
      }

      // Threat nodes reveal sequence
      nodesRef.current.forEach((nodeEl, index) => {
        if (!nodeEl) return;
        const isEven = index % 2 === 0;

        gsap.fromTo(
          nodeEl,
          {
            opacity: 0,
            x: isEven ? -45 : 45,
            y: 20,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: nodeEl,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Bottom transition statement animation
      if (transitionRef.current) {
        gsap.fromTo(
          transitionRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: transitionRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="silent-decline-section" id="silent-decline" ref={sectionRef}>
      <div className="silent-decline-container">
        {/* Header */}
        <div className="silent-decline-header" ref={headerRef}>
          <div className="section-eyebrow eyebrow-amber">
            <span className="eyebrow-dot dot-amber" />
            <span>The Silent Decline</span>
          </div>

          <h2 className="silent-decline-title">
            When The <span className="highlight-amber">Cleaners Disappear.</span>
          </h2>

          <p className="silent-decline-intro">
            Across India, vulture populations have faced a dramatic decline. The loss of these natural scavengers affects far more than the birds themselves.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="decline-timeline">
          {/* Central Stem Track Line */}
          <div className="timeline-track-bg" />
          <div className="timeline-track-progress" ref={stemProgressRef} />

          {threatsData.map((item, index) => {
            const IconComponent = item.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.num}
                className={`threat-node ${isEven ? 'node-left' : 'node-right'}`}
                ref={(el) => (nodesRef.current[index] = el)}
              >
                {/* Node Center Marker */}
                <div className="node-center-marker">
                  <span className="marker-ring" />
                  <span className="marker-dot" />
                </div>

                {/* Node Card Container */}
                <div className="threat-card">
                  <div className="threat-card-header">
                    <div className="threat-badge">
                      <IconComponent size={20} className="threat-icon" />
                      <span className="threat-num">{item.num}</span>
                    </div>
                    <span className="threat-category">{item.subtitle}</span>
                  </div>

                  <h3 className="threat-title">{item.title}</h3>
                  <p className="threat-desc">{item.description}</p>

                  {/* Symbolic Visual Graphic */}
                  <div className="threat-visual-box">
                    <div className={`symbolic-graphic ${item.graphicType}`}>
                      {item.graphicType === 'medicine-to-vulture' && (
                        <div className="graphic-symbol-wrap">
                          <Pill className="sym-icon sym-pill" size={28} />
                          <span className="sym-arrow">&rarr;</span>
                          <svg className="sym-vulture-sil" viewBox="0 0 32 32" width="28" height="28">
                            <path
                              fill="currentColor"
                              d="M16 4C11 4 6 8 4 14c2-1 5-1 8 1 2 1 4 4 4 7 0 3-2 5-5 5 4 0 8-3 10-7 2-4 2-8 0-11-2-3-3-5-5-5z"
                            />
                          </svg>
                        </div>
                      )}

                      {item.graphicType === 'habitat-loss' && (
                        <div className="graphic-symbol-wrap">
                          <Trees className="sym-icon sym-trees" size={28} />
                          <div className="fragmented-bars">
                            <span className="frag-bar bar-1" />
                            <span className="frag-bar bar-2" />
                            <span className="frag-bar bar-3" />
                          </div>
                        </div>
                      )}

                      {item.graphicType === 'conflict-symbol' && (
                        <div className="graphic-symbol-wrap">
                          <AlertTriangle className="sym-icon sym-alert" size={28} />
                          <span className="sym-sublabel">Symbolic Warning</span>
                        </div>
                      )}

                      {item.graphicType === 'population-decay' && (
                        <div className="graphic-symbol-wrap flock-decay">
                          <span className="flock-bird b-1">&bull;</span>
                          <span className="flock-bird b-2">&bull;</span>
                          <span className="flock-bird b-3 b-fade">&bull;</span>
                          <span className="flock-bird b-4 b-fade-more">&bull;</span>
                        </div>
                      )}
                    </div>
                    <span className="visual-caption">{item.visualLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Transition Statement */}
        <div className="silent-decline-bottom-transition" ref={transitionRef}>
          <div className="transition-amber-line" />
          <p className="transition-question">
            SO WHAT HAPPENS WHEN NATURE&apos;S CLEANUP CREW DISAPPEARS?
          </p>
          <div className="transition-amber-line" />
        </div>
      </div>
    </section>
  );
}
