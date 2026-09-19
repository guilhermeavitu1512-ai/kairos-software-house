# Stable copy, translating Memphis — supersedes hero-story-overlap

User explicitly rejected the crossfade/compensated text movement and perspective zoom.

- Hero copy now stays at its normal document position, with no scroll transform or opacity writer. The initial intro-triggered entrance is preserved. Only decorative depth layers and cursor followers receive parallax.
- No sticky-container translation from the second section into the Hero. Sections remain in normal document order; the story keeps its existing sticky stage internally.
- Live story copy is always opaque. Chapter selection still occurs at local .91, under the existing verified .88–.94 solid mesh coverage plateau. No duplicate live heading.
- Wipe meshes have constant depth, scale and rotation from beginning to end. They enter already large from outside the viewport, translate across the text and exit on the opposite side. Existing smaller rain shapes remain at multiple depths.
- Reduced motion selects a single static chapter without a fade. No intro, copy, font, navbar, pricing or other section changes.

Raycast tests cover desktop and narrow aspect ratios; they now assert constant Z as well as scale. Browser checks exercise opaque Hero text in document flow, reverse scroll and single opaque story headings.
