# Hero entrance — approved implementation

Scope: approved entrance and Hero-to-story handoff correction. Existing copy, single CTA, layout, intro appearance, Aurora, navbar, internal story timeline and parallax coefficients remain unchanged.

One GSAP timeline: 1 second desktop, 0.9 seconds mobile, 0.22 seconds opacity-only reduced motion. A local elapsed-time playhead avoids extending the choreography through global GSAP lag smoothing. Background remains independent.

Words stay as one accessible HTML heading with literal spaces. Their actual row positions are measured before animated writes at intro release. Words in the same row share their reveal timing and clip; row starts overlap over 0.26 seconds. Small horizontal spacing offsets converge without animating layout or font spacing. The blue word receives an extra 2px offset. No FoldText, canvas text, duplicates or added dependency.

Preparation occurs under the existing intro. A signal starts the reveal 200ms before the intro finishes; inert release remains unchanged. Row starts are 70ms apart (capped for narrow wrapping), subtitle starts at .45s and CTA at .55s. Dedicated entrance wrappers compose with pointer and scroll transforms. Per-word masks and transforms clear after reveal. Scroll stays native and early scrolling accelerates the remaining entrance over approximately 180ms. Width change finishes the reveal cleanly; visibility pauses the entrance clock. Cleanup cancels its frame and reverts scoped GSAP effects.

The entire copy wrapper compensates native viewport travel and adds only 30px of upward exit while fading. Architecture fades on its own parent without touching depth transforms. The incoming story surface appears early; its copy starts only near the end of outgoing copy visibility and travels at most 12px. All handoff values derive from actual scroll, reverse on return and are disabled for reduced motion. The internal Memphis scene/timeline is unchanged. tests/hero-handoff.browser.mjs verifies these invariants at desktop and mobile sizes.

Checks: tests/hero-entrance.browser.mjs covers prepared/running/complete states, DOM identity, desktop/mobile, early scroll, resize after entry, reduced motion and no-JS HTML. Screenshot review confirms settled copy and layout. Software WebGL frame stalls can delay a physical paint; no 60fps guarantee is inferred from these tests.
