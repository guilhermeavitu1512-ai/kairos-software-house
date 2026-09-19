"use client";

import KairosMark from "./KairosMark";

export default function IntroOverlay() {
  return (
    <div className="site-intro" aria-hidden="true">
      <KairosMark />
      <span>KAIROS</span>
    </div>
  );
}
