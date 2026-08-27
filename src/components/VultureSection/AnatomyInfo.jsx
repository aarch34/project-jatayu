import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * AnatomyInfo Component — Minimal floating glassmorphic information card for active hotspot
 */
export default function AnatomyInfo({ hotspot, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hotspot) return null;

  return (
    <div className="anatomy-info-panel" role="dialog" aria-labelledby="hotspot-title">
      <div className="info-panel-header">
        <span className="info-panel-num">{hotspot.num}</span>
        <button className="info-close-btn" onClick={onClose} aria-label="Close information panel">
          <X size={18} />
        </button>
      </div>

      <h3 id="hotspot-title" className="info-panel-title">{hotspot.title}</h3>
      <p className="info-panel-desc">{hotspot.description}</p>
    </div>
  );
}
