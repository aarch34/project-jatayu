import React from 'react';
import { ArrowDown, Compass } from 'lucide-react';

/**
 * HeroText Component — Center/Left editorial text layout & dual CTAs (Awareness & Trek)
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
        <div className="hero-category">Vulture Awareness & Conservation</div>
        <p className="hero-description">
          &ldquo;Discover the species that quietly keeps our ecosystems alive.&rdquo;
        </p>
      </div>

      <div className="hero-actions-group">
        <button className="cta-button primary-expedition-btn" onClick={onBeginClick}>
          <span>BEGIN THE EXPEDITION</span>
          <ArrowDown size={18} className="arrow-icon" />
        </button>

        <a href="#the-trek" className="hero-trek-link" onClick={handleTrekClick}>
          <Compass size={16} />
          <span>JOIN THE TREK &rarr;</span>
        </a>
      </div>
    </div>
  );
}
