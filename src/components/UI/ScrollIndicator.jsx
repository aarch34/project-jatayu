import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ScrollIndicator Component — Bouncing scroll arrow indicator fading on scroll
 */
export default function ScrollIndicator({ faded = false, onClick }) {
  return (
    <div
      className={`scroll-indicator-container ${faded ? 'faded' : ''}`}
      onClick={onClick}
      aria-label="Scroll to explore"
    >
      <span className="scroll-label">Scroll to Explore</span>
      <ChevronDown size={20} className="scroll-arrow" />
    </div>
  );
}
