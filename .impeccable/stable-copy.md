# Stable copy, translating Memphis — supersedes hero-story-overlap

User explicitly rejected the crossfade/compensated text movement and perspective zoom.

- Hero copy now stays at its normal document position, with no scroll transform or opacity writer. The initial intro-triggered entrance is preserved. Only decorative depth layers and cursor followers receive parallax.
- No sticky-container translation from the second section into the Hero. Sections remain in normal document order; the story keeps its existing sticky stage internally.
- Live story copy is always opaque. Chapter selection occurs at local .50, inside the .44–.56 full-viewport coverage plateau. No duplicate live heading.
- Wipe meshes have constant depth, scale and rotation from beginning to end. They enter already large from outside the viewport, translate across the text and exit on the opposite side. Existing smaller rain shapes remain at multiple depths.
- September 19 refinement: equal entrance and departure windows with quintic easing, a 460vh scroll runway and viewport-dependent horizontal sizing shared by WebGL and SVG. Each wipe completely clears the viewport before the next reading interval; coverage includes the full screen in portrait and ultrawide layouts.
- Reduced motion selects a single static chapter without a fade. No intro, copy, font, navbar, pricing or other section changes.

Raycast tests cover desktop and narrow aspect ratios; they now assert constant Z as well as scale. Browser checks exercise opaque Hero text in document flow, reverse scroll and single opaque story headings.
