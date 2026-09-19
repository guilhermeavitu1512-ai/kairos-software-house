# Hero → Memphis handoff

Latest request supersedes the previous near-sequential departure: visible overlap is intentional, including the outgoing and incoming headings. Copy, intro, navbar, internal chapter timeline and wipe paths are unchanged.

- One context-owned MotionValue carries normalized native scroll progress. It is not a global singleton and causes no React renders per scroll frame.
- Hero heading remains a single block, moves at most 28px (20px mobile), and fades across .40–.92. Support/CTA leave earlier on independent opacity wrappers. Existing birth masks are not reused.
- Architectural departure begins at .30. Scene envelope spans .18–.82; Organize spans .58–.92 with at most 18px / 12px translation. Measured viewport/heading clearance determines the responsive handoff span.
- Two edge pieces arrive first, then other rain pieces, then the existing foreground pair. Additive depth offsets and independent material opacity return exactly to the original poses at progress 1. No wipe trajectory, geometry, camera or chapter boundary changes.
- Existing fixed layer order remains. No progress-dependent mounting or z-index switching. Canvas stays aria-hidden and non-interactive. The vector renderer shares the arrival function; reduced motion uses the static arrangement with crossfade only.
- Resources and subscriptions are disposed; WebGL remains demand-driven. No new dependency.

Verification: production desktop 1440px and mobile 390px, normalized intermediate captures, exact reverse comparisons, slow native scroll, wheel, native scrollbar drag where available, resize and reduced motion. Browser tests wait for actual scroll delivery, not a fixed frame delay on software-rendered WebGL. No hardware 60fps claim.
