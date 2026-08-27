import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Feather, MapPin, Users, ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * WayBackSection Component — Step 6 hopeful conservation journey section
 */
export default function WayBackSection() {
  const [activeCard, setActiveCard] = useState(0); // Default first card selected
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statementRef = useRef(null);

  const cardsData = [
    {
      id: 0,
      num: '01',
      title: 'SAFER MEDICINE',
      heading: 'SAFER MEDICINE',
      icon: ShieldCheck,
      description: 'Replacing harmful veterinary drugs with vulture-safe alternatives is one of the most important steps in preventing poisoning.',
      detail: 'Alternative drugs like meloxicam provide safe relief for livestock without threatening scavenger bird populations.',
      graphicType: 'safe-medicine',
    },
    {
      id: 1,
      num: '02',
      title: 'BRINGING THEM BACK',
      heading: 'BRINGING THEM BACK',
      icon: Feather,
      description: 'Conservation breeding programmes help maintain populations and can support the release of vultures back into suitable habitats.',
      detail: 'Conservation breeding centers across India safeguard genetic diversity until safe natural habitats are secured.',
      graphicType: 'breeding-release',
    },
    {
      id: 2,
      num: '03',
      title: 'PROTECTING THEIR HOME',
      heading: 'PROTECTING THEIR HOME',
      icon: MapPin,
      description: 'Protecting nesting, roosting and feeding areas gives vultures the space and resources they need to survive.',
      detail: 'Establishing Vulture Safe Zones ensures pesticide-free feeding sanctuaries across critical migration routes.',
      graphicType: 'safe-habitats',
    },
    {
      id: 3,
      num: '04',
      title: 'PEOPLE MAKE THE DIFFERENCE',
      heading: 'PEOPLE MAKE THE DIFFERENCE',
      icon: Users,
      description: 'Farmers, veterinarians, conservationists and local communities all play a role in creating safer landscapes for vultures.',
      detail: 'Local awareness initiatives empower livestock owners and vets to champion vulture-safe practices.',
      graphicType: 'community-action',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 35 },
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

      // Hopeful Statement animation
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="way-back-section" id="way-back" ref={sectionRef}>
      <div className="way-back-container">
        {/* Header */}
        <div className="way-back-header" ref={headerRef}>
          <div className="section-eyebrow eyebrow-cream">
            <span className="eyebrow-dot dot-gold" />
            <span>The Way Back</span>
          </div>

          <h2 className="way-back-title">
            They Can <span className="highlight-cream-gold">Come Back.</span>
          </h2>

          <p className="way-back-intro">
            Vulture conservation is already making a difference. Protecting safe food sources, breeding populations, habitats and responsible veterinary practices can give these remarkable birds a future.
          </p>
        </div>

        {/* 4 Interactive Conservation Action Cards */}
        <div className="way-back-cards-grid">
          {cardsData.map((card, index) => {
            const IconComp = card.icon;
            const isSelected = activeCard === index;

            return (
              <div
                key={card.num}
                className={`conservation-card ${isSelected ? 'selected' : 'subdued'}`}
                onClick={() => setActiveCard(index)}
                onMouseEnter={() => setActiveCard(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveCard(index);
                  }
                }}
                aria-label={`Inspect ${card.title}`}
              >
                <div className="card-top-row">
                  <div className="card-badge">
                    <IconComp size={20} className="card-icon" />
                    <span className="card-num">{card.num}</span>
                  </div>
                  <span className="card-action-type">ACTION {card.num}</span>
                </div>

                <h3 className="card-title">{card.heading}</h3>
                <p className="card-desc">{card.description}</p>

                {/* Expanded Detail Panel */}
                <div className={`card-expanded-detail ${isSelected ? 'show' : ''}`}>
                  <p className="detail-text">{card.detail}</p>
                </div>

                <div className="card-accent-bar" />
              </div>
            );
          })}
        </div>

        {/* Powerful Hopeful Statement Banner */}
        <div className="hopeful-statement-banner" ref={statementRef}>
          <h3 className="statement-line-1">CONSERVATION IS NOT JUST ABOUT SAVING A BIRD.</h3>
          <h4 className="statement-line-2">IT&apos;S ABOUT KEEPING AN ECOSYSTEM ALIVE.</h4>

          <div className="end-transition-wrap">
            <span className="end-transition-text">AND IT STARTS WITH KNOWING THEY MATTER.</span>
            <div className="scroll-next-hint">
              <ArrowDown size={18} className="bounce-arrow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
