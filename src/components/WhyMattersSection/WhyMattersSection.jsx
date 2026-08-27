import React, { useEffect, useRef } from 'react';
import { RefreshCw, ShieldCheck, Leaf } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WhyMattersSection Component — Step 3 educational section explaining vulture ecosystem benefits
 */
export default function WhyMattersSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const transitionRef = useRef(null);

  const cardsData = [
    {
      num: '01',
      icon: RefreshCw,
      title: "NATURE'S RECYCLERS",
      description: 'Vultures efficiently remove animal remains that would otherwise decay in the environment.',
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'DISEASE CONTROL',
      description: 'By consuming carcasses quickly, vultures can help reduce the spread of harmful pathogens.',
    },
    {
      num: '03',
      icon: Leaf,
      title: 'A HEALTHIER ECOSYSTEM',
      description: 'Their work keeps ecosystems cleaner and helps nutrients return to the natural cycle.',
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

      // Cards staggered entrance animation
      if (cardsRef.current.length > 0) {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current[0],
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Bottom transition line animation
      if (transitionRef.current) {
        gsap.fromTo(
          transitionRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: transitionRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why-matters-section" id="why-matters" ref={sectionRef}>
      <div className="why-matters-container">
        {/* Section Header */}
        <div className="why-matters-header" ref={headerRef}>
          <div className="section-eyebrow">
            <span className="eyebrow-dot" />
            <span>Why They Matter</span>
          </div>

          <h2 className="why-matters-title">
            The Sky&apos;s <span className="highlight-gold">Cleanup Crew.</span>
          </h2>

          <p className="why-matters-intro">
            Vultures play a vital role in keeping ecosystems healthy. By rapidly consuming animal remains, they help prevent the spread of disease and return nutrients to nature.
          </p>
        </div>

        {/* 3 Distinct Information Cards */}
        <div className="why-matters-grid">
          {cardsData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.num}
                className="matters-card"
                ref={(el) => (cardsRef.current[index] = el)}
              >
                <div className="matters-card-top">
                  <div className="matters-icon-badge">
                    <IconComponent size={22} className="matters-icon" />
                  </div>
                  <span className="matters-num">{item.num}</span>
                </div>

                <h3 className="matters-card-title">{item.title}</h3>
                <p className="matters-card-desc">{item.description}</p>
                <div className="matters-card-accent-line" />
              </div>
            );
          })}
        </div>

        {/* Bottom Transition Line */}
        <div className="why-matters-bottom-transition" ref={transitionRef}>
          <div className="transition-divider" />
          <span className="transition-text">BUT THEIR STORY IS CHANGING.</span>
          <div className="transition-divider" />
        </div>
      </div>
    </section>
  );
}
