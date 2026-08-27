import React from 'react';
import { Compass } from 'lucide-react';

/**
 * SectionPlaceholder Component — Transition zone testing smooth scroll into Step 2
 */
export default function SectionPlaceholder() {
  return (
    <section className="step2-placeholder-section" style={{ marginTop: 0 }}>
      <div className="placeholder-card">
        <div className="placeholder-badge">STEP 2 COMPLETE</div>
        <Compass size={36} color="#f5ba42" style={{ opacity: 0.8 }} />
        <h2 className="placeholder-title">NEXT SECTION WILL BE ADDED IN STEP 3</h2>
        <p className="placeholder-desc">
          You have reached the end of the Meet the Vulture section. Step 1 (Cinematic Hero) and Step 2 (Meet the Vulture) are fully interactive and complete.
        </p>
      </div>
    </section>
  );
}
