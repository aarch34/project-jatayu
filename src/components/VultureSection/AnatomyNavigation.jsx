import React from 'react';

/**
 * AnatomyNavigation Component — Bottom tab bar for selecting vulture anatomy features
 */
export default function AnatomyNavigation({ hotspots, activeId, onSelect, onReset }) {
  return (
    <nav className="anatomy-nav-bar" aria-label="Vulture Anatomy Navigation">
      <div className="anatomy-nav-items">
        {hotspots.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              className={`anatomy-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => (isActive ? onReset() : onSelect(item.id))}
              aria-pressed={isActive}
            >
              <span className="nav-btn-num">{item.num}</span>
              <span className="nav-btn-label">{item.label}</span>
            </button>
          );
        })}
      </div>
      {activeId && (
        <button className="anatomy-reset-btn" onClick={onReset} aria-label="Reset overview camera view">
          Reset View
        </button>
      )}
    </nav>
  );
}
