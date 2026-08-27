import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Share2, Heart, Check, Copy, Compass, ArrowRight } from 'lucide-react';
import VultureFrameAnimation from '../VultureFrameAnimation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * YouCanHelpSection Component — Final section, 2D Jatayu Frame Animation, Final Trek CTA & Full-Width Footer
 * Project Jatayu 3.0 · Rotaract Club of Swarna Bengaluru
 */
export default function YouCanHelpSection() {
  const [expandedLearn, setExpandedLearn] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const finalStatementRef = useRef(null);

  const handleCopyLink = () => {
    const url = window.location.origin;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleRegisterClick = () => {
    const trekEl = document.getElementById('the-trek');
    if (trekEl) {
      trekEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (finalStatementRef.current) {
        gsap.fromTo(
          finalStatementRef.current.children,
          { opacity: 0, scale: 0.96, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: finalStatementRef.current,
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
    <section className="you-can-help-section" id="take-action" ref={sectionRef}>
      <div className="you-can-help-container">
        {/* Header */}
        <div className="you-can-help-header" ref={headerRef}>
          <div className="section-eyebrow eyebrow-cream">
            <span className="eyebrow-dot dot-gold" />
            <span>Your Turn</span>
          </div>

          <h2 className="you-can-help-title">
            The Future Is <span className="highlight-cream-gold">Still In Flight.</span>
          </h2>

          <p className="you-can-help-intro">
            Protecting vultures isn&apos;t the responsibility of one person or one organisation. Every informed choice, conversation and conservation effort helps create a safer future for these essential birds.
          </p>
        </div>

        {/* 3 Interactive Action Cards */}
        <div className="action-cards-grid">
          {/* Card 1: LEARN */}
          <div className={`action-card ${expandedLearn ? 'expanded' : ''}`}>
            <div className="action-card-top">
              <div className="action-badge">
                <BookOpen size={20} className="action-icon" />
                <span className="action-num">01</span>
              </div>
              <span className="action-category">LEARN</span>
            </div>

            <h3 className="action-title">KNOW THE BIRD</h3>
            <p className="action-desc">
              Understanding vultures is the first step toward protecting them. Share what you&apos;ve learned and help replace myths with facts.
            </p>

            <button
              type="button"
              className="action-btn"
              onClick={() => setExpandedLearn(!expandedLearn)}
            >
              <span>{expandedLearn ? 'Hide Quick Facts' : 'Explore Quick Facts'}</span>
            </button>

            {expandedLearn && (
              <div className="facts-panel">
                <ul className="facts-list">
                  <li>
                    <strong>Pathogen Neutralization:</strong> Vultures have specialized digestive systems that safely neutralize pathogens like anthrax and cholera.
                  </li>
                  <li>
                    <strong>Thermal Soaring:</strong> A single vulture can soar for hundreds of miles using thermal updrafts without flapping wings.
                  </li>
                  <li>
                    <strong>Ecosystem Protection:</strong> Vulture conservation directly safeguards clean water supplies and agricultural grazing lands.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Card 2: SHARE */}
          <div className="action-card">
            <div className="action-card-top">
              <div className="action-badge">
                <Share2 size={20} className="action-icon" />
                <span className="action-num">02</span>
              </div>
              <span className="action-category">SHARE</span>
            </div>

            <h3 className="action-title">SPREAD AWARENESS</h3>
            <p className="action-desc">
              Vultures are often misunderstood. Help others discover the important role they play in healthy ecosystems.
            </p>

            <button
              type="button"
              className={`action-btn ${copiedLink ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              {copiedLink ? (
                <>
                  <Check size={16} />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Campaign Link</span>
                </>
              )}
            </button>
          </div>

          {/* Card 3: SUPPORT */}
          <div className="action-card">
            <div className="action-card-top">
              <div className="action-badge">
                <Heart size={20} className="action-icon" />
                <span className="action-num">03</span>
              </div>
              <span className="action-category">SUPPORT</span>
            </div>

            <h3 className="action-title">SUPPORT CONSERVATION</h3>
            <p className="action-desc">
              Support organisations, conservation programmes and local efforts working to protect vultures and their habitats.
            </p>

            <div className="support-info-badge">
              <span>Advocate for Vulture Safe Zones &amp; Veterinary Awareness</span>
            </div>
          </div>
        </div>

        {/* Large 2D Jatayu Frame Animation (Original Uploaded PNG Sequence) */}
        <div className="final-frame-animation-wrapper">
          <VultureFrameAnimation fps={11} className="final-jatayu-anim" />
        </div>

        {/* Powerful Final Statements Banner */}
        <div className="final-statements-banner" ref={finalStatementRef}>
          <h3 className="final-statement-1">ONE BIRD. ONE ECOSYSTEM. ONE FUTURE.</h3>
          <h2 className="final-statement-2">KEEP JATAYU IN THE SKY.</h2>
          <p className="final-subtext">Learn. Explore. Experience. Protect.</p>
        </div>

        {/* Final Trek & Exploration Call To Action */}
        <div className="final-cta-container">
          <button
            type="button"
            className="final-primary-trek-btn"
            onClick={handleRegisterClick}
          >
            <span>REGISTER FOR THE JATAYU TREK &rarr;</span>
          </button>

          <button
            type="button"
            className="final-secondary-explore-btn"
            onClick={handleExploreClick}
          >
            <span>EXPLORE PROJECT JATAYU</span>
          </button>
        </div>
      </div>

      {/* Full-Width Desktop & Mobile Footer */}
      <footer className="site-footer">
        <div className="footer-inner-container">
          {/* Main Content Row */}
          <div className="footer-main-row">
            {/* Left: Branding & Tagline */}
            <div className="footer-left-brand">
              <span className="footer-logo">PROJECT JATAYU</span>
              <span className="footer-tagline">VULTURE AWARENESS &amp; CONSERVATION</span>
              <span className="footer-club-credit">Rotaract Club of Swarna Bengaluru</span>
            </div>

            {/* Center/Right: Navigation Links */}
            <nav className="footer-right-nav">
              <a href="#meet-the-vulture">Explore</a>
              <a href="#why-matters">Why They Matter</a>
              <a href="#silent-decline">Threats</a>
              <a href="#way-back">Conservation</a>
              <a href="#the-trek" className="footer-nav-highlight">The Trek</a>
              <a href="#trek-registration" className="footer-nav-highlight">Register</a>
            </nav>
          </div>

          {/* Bottom Copyright Row */}
          <div className="footer-bottom-row">
            <span className="copyright">&copy; 2026 Project Jatayu &bull; Rotaract Club of Swarna Bengaluru</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
