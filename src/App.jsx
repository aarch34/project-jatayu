import React, { useRef, useState, useEffect } from 'react';
import HeroCanvas from './components/Scene/HeroCanvas';
import Header from './components/UI/Header';
import HeroText from './components/UI/HeroText';
import ScrollIndicator from './components/UI/ScrollIndicator';
import MobileNavModal from './components/UI/MobileNavModal';
import VultureSection from './components/VultureSection/VultureSection';
import WhyMattersSection from './components/WhyMattersSection/WhyMattersSection';
import SilentDeclineSection from './components/SilentDeclineSection/SilentDeclineSection';
import WayBackSection from './components/WayBackSection/WayBackSection';
import TrekSection from './components/TrekSection/TrekSection';
import YouCanHelpSection from './components/YouCanHelpSection/YouCanHelpSection';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { useMouseParallax } from './hooks/useMouseParallax';
import './styles/index.css';

export default function App() {
  const containerRef = useRef(null);
  const scrollProgress = useScrollAnimation(containerRef);
  const mouse = useMouseParallax();
  
  const [isFaded, setIsFaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsFaded(true);
      } else {
        setIsFaded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBeginExpedition = () => {
    const meetSection = document.getElementById('meet-the-vulture');
    if (meetSection) {
      meetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      const windowHeight = window.innerHeight;
      window.scrollTo({
        top: windowHeight * 0.9,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="app-container" ref={containerRef}>
      {/* 3D Canvas Background for Hero */}
      <HeroCanvas scrollProgress={scrollProgress} mouse={mouse} />

      {/* Hero UI Overlay Layer */}
      <div className="hero-overlay">
        <Header onMenuClick={() => setIsNavOpen(true)} />
        <HeroText onBeginClick={handleBeginExpedition} />
        <ScrollIndicator faded={isFaded} onClick={handleBeginExpedition} />
      </div>

      {/* Step 2: Meet the Vulture Section (2D Wingbeat Flight Sequence) */}
      <VultureSection />

      {/* Step 3: Why Jatayu Matters Section */}
      <WhyMattersSection />

      {/* Step 4: The Silent Decline Section (Threat Timeline) */}
      <SilentDeclineSection />

      {/* Step 5: The Way Back Section (Interactive Conservation Journey) */}
      <WayBackSection />

      {/* Step 6: The Jatayu Trek ("SEE THE STORY BEYOND THE SCREEN") */}
      <TrekSection />

      {/* Step 7: You Can Help & Final Conclusion Section ("KEEP JATAYU IN THE SKY") */}
      <YouCanHelpSection />

      {/* Navigation Modal */}
      <MobileNavModal isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  );
}
