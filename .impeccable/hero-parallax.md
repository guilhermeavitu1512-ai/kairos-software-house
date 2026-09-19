# Hero refinement — September 13

This approved refinement supersedes the earlier Hero headline and dual-action plan only. Keep global DESIGN.md unchanged; its second-action description is historical for this surface.

Headline: Ainda depende de WhatsApp, caderno e planilhas?
Only action: Contar meu problema. Existing subtitle preserved.

Motion thesis: pass through an architectural composition. Two dim rear plates drift slowly, the existing side plates at intermediate rates, and the forged foreground moves upward more strongly. Text follows normal document scroll without extra parallax.

Implementation: passive native scroll listener coalesced by requestAnimationFrame; cached section geometry on ResizeObserver/window resize; reusable GSAP quickSetter transforms; separate wrappers prevent cursor/idle/scroll transform conflicts. Depth coefficients 0.055 / 0.085 / 0.17 / 0.23 / -0.3. Mobile intensity 24%, one rear plate hidden. No new renderers or dependencies. Reduced motion resets offsets; offscreen and hidden work is paused. Existing intro release logic retained.

Verification: tests/hero.browser.mjs checks responsive viewports, briefing, depth differences, reversal, resize and reduced-motion reset. Raster unchanged; provenance remains in hero-asset-prompt.md.
