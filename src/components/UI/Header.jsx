import React from 'react';
import { Menu } from 'lucide-react';

/**
 * Header Component — Top bar with brand eyebrow and menu toggle
 */
export default function Header({ onMenuClick }) {
  return (
    <header className="hero-header">
      <div className="brand-eyebrow">
        <div className="brand-tag">Project Jatayu 3.0</div>
        <div className="brand-subtitle">Rotaract Club of Swarna Bengaluru</div>
      </div>

      <button
        className="nav-menu-btn"
        onClick={onMenuClick}
        aria-label="Open Navigation Menu"
      >
        <Menu size={22} />
      </button>
    </header>
  );
}
