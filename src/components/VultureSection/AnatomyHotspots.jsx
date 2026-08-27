import React from 'react';
import { Html } from '@react-three/drei';

/**
 * AnatomyHotspots Component — Floating 3D HTML markers attached to Vulture body coordinates
 */
export default function AnatomyHotspots({ hotspots, activeId, onSelect }) {
  return (
    <group>
      {hotspots.map((item) => {
        const isActive = activeId === item.id;
        return (
          <Html
            key={item.id}
            position={item.worldPos}
            center={true}
            zIndexRange={[100, 0]}
          >
            <div
              className={`hotspot-marker ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(item.id);
                }
              }}
              aria-label={`Inspect ${item.label}`}
            >
              <div className="hotspot-dot">
                <span className="dot-inner" />
                <span className="dot-pulse" />
              </div>
              <div className="hotspot-stem" />
              <div className="hotspot-tag">
                <span className="tag-num">{item.num}</span>
                <span className="tag-name">{item.label}</span>
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
