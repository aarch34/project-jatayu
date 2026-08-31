import React from 'react';
import { ArrowDown, Compass } from 'lucide-react';

/**
 * HeroText Component — Center/Left editorial text layout & dual CTAs
 */
export default function HeroText({ onBeginClick }) {
  const handleTrekClick = (e) => {
    e.preventDefault();
    const trekEl = document.getElementById('the-trek');
    if (trekEl) {
      trekEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      const windowHeight = window.innerHeight;
      window.scrollTo({ top: windowHeight * 3.5, behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-content">
      <h1 className="hero-headline">
        <span>The Sky</span><br />
        <span>Has A</span><br />
        <span className="highlight">Cleaner.</span>
      </h1>

      <div className="hero-subgroup">
        <div className="hero-category">Celebrate International Vulture Awareness Day 2026</div>
        <p className="hero-description">
          International Vulture Awareness Day reminds us of the vital role vultures play in keeping our ecosystems healthy. Project Jatayu 3.0 takes that awareness beyond the screen &mdash; inviting you to observe, learn and experience these remarkable birds at Ramadevara Betta &mdash; India&apos;s First Vulture Sanctuary on September 6.
        </p>
      </div>

      <div className="hero-actions-group">
        <button className="cta-button primary-expedition-btn" onClick={onBeginClick}>
          <span>BEGIN THE EXPEDITION</span>
          <ArrowDown size={18} className="arrow-icon" />
        </button>

        <a href="#the-trek" className="hero-trek-link" onClick={handleTrekClick}>
          <Compass size={16} />
          <span>REGISTER FOR THE JATAYU OBSERVATION TREK &rarr;</span>
        </a>
      </div>
    </div>
  );
}
