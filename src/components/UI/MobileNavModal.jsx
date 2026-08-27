import React from 'react';
import { X, Compass, Shield, Feather, Activity, Users } from 'lucide-react';

/**
 * MobileNavModal Component — Full navigation menu for Project Jatayu 3.0
 */
export default function MobileNavModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const navItems = [
    { label: 'Meet Jatayu', href: '#meet-the-vulture', icon: Feather },
    { label: 'Why They Matter', href: '#why-matters', icon: Shield },
    { label: 'Threats', href: '#silent-decline', icon: Activity },
    { label: 'Conservation', href: '#way-back', icon: Users },
    { label: 'The Jatayu Trek', href: '#the-trek', icon: Compass, highlight: true },
  ];

  const handleNavClick = (href) => {
    onClose();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="nav-modal-backdrop" onClick={onClose}>
      <div className="nav-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </button>

        <div className="modal-inner">
          <div className="modal-header">
            <span className="modal-tag">PROJECT JATAYU 3.0</span>
            <h2 className="modal-title">Rotaract Swarna Bengaluru</h2>
          </div>

          <nav className="modal-nav-links">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`modal-nav-item ${item.highlight ? 'highlight-item' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  <IconComp size={18} className="modal-item-icon" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="modal-trek-btn"
            onClick={() => handleNavClick('#the-trek')}
          >
            <span>REGISTER FOR THE TREK &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}
