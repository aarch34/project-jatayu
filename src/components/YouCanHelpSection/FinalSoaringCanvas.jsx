import React from 'react';
import VultureFrameAnimation from '../VultureFrameAnimation';

/**
 * FinalSoaringCanvas Component — 2D Frame Sequence showing Jatayu gliding upward into warm sunlight
 */
export default function FinalSoaringCanvas() {
  return (
    <div className="final-soaring-stage 2d-soaring-stage">
      <div className="soaring-sunlight-glow" />
      <VultureFrameAnimation width={780} height={438} fps={11} className="final-2d-vulture-anim" />
    </div>
  );
}
