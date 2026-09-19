---
name: KAIROS Hero
description: Implemented home Hero only; no global design-system authority.
colors:
  ground: "#030914"
  text: "#f5f7fa"
  emphasis: "#9fbbf4"
  support: "#aeb9c8"
  primary: "#126bff"
  primary-hover: "#2478ff"
  secondary-text: "#e2e8f0"
  secondary-ground: "rgb(3 9 20 / 40%)"
  focus: "#aacaff"
typography:
  display:
    fontFamily: '"Manrope","Segoe UI",sans-serif'
    fontSize: "clamp(44px,4.65vw,72px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.035em"
  body:
    fontFamily: '"Manrope","Segoe UI",sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: '"Manrope","Segoe UI",sans-serif'
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  action: "999px"
  plate: "18px"
spacing:
  action-gap: "16px"
  action-gap-mobile: "12px"
  support-gap: "28px"
  actions-gap: "36px"
components:
  hero-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "14px 28px"
  hero-secondary:
    backgroundColor: "{colors.secondary-ground}"
    textColor: "{colors.secondary-text}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "14px 28px"
---

# Design System: KAIROS Hero

## Overview

This is a surface-scoped record of the implemented home Hero. It does not establish rules for the navbar, intro, Galaxy, Memphis, pricing, cases, or other sections. Sources: `components/kairos/Hero.tsx`, `HeroContent.tsx`, `HeroActions.tsx`, `HeroArchitecture.tsx`, `HeroStage.tsx`, and `Hero.module.css`; the font is inherited from `app/globals.css`.

Centered editorial copy sits between cropped navy metal plates, above a textured foreground. The approved surface direction lives in `.impeccable/hero-direction.md`; product copy and destinations live in `PRODUCT.md`. No new global metaphor or brand rules are inferred.

## Colors

Primary blue identifies the briefing action. Pale blue emphasizes the headline; cool light text and muted support sit on the near-black navy ground. The plate gradients and blue rim lighting are local decorative materials, not an additional global palette.

## Typography

Manrope is inherited with Segoe UI and sans-serif fallbacks. The centered display uses balanced wrapping; support uses pretty wrapping and a maximum width of 660px. At 1100px and below the title uses `clamp(42px,5.2vw,58px)`; at 760px and below it uses `clamp(34px,8.6vw,52px)` with 1.12 line height, while support becomes 15px with a 430px maximum width. At 1700px and above the title is 78px. Desktop-only manual title breaks disappear on mobile.

## Layout

The stage has a minimum height of 100svh. The built content container is `min(900px,calc(100% - 64px))`, with 168px top and 208px bottom padding; it becomes 1000px at 1700px. This records the implementation rather than the brief's planned 850px maximum. At 1100px it becomes `min(740px,calc(100% - 96px))`; at 760px it has 24px side gutters and 144px/176px vertical padding.

Actions are centered side by side, then stack at 760px with a maximum width of 248px each. Minimum action height changes from 52px to 50px. The plates move further beyond the edges on mobile; below 360px the right edge is further cropped. Short desktop viewports (650px tall or less) reduce vertical padding to 116px/148px.

## Elevation & Depth

CSS perspective (1000px), gradient faces, inset light, and layered shadows describe plate thickness. Those shadows belong to the decorative metal objects, not general UI elevation. The primary action has a subtle inset highlight. Exact shadow and motion values are recorded in the sidecar.

## Shapes

Pill actions contrast with softly rounded architectural plates. The plates are clipped by the stage and do not accept pointer events. The alpha foreground is an independent decorative asset; its exact generation prompt and shipping provenance are in `.impeccable/hero-asset-prompt.md`.

## Components

The primary action opens the existing briefing; the secondary links to `#projetos`. Both have a visible 2px focus outline with a 5px offset. Hover changes primary fill and moves its inline SVG arrow 3px; secondary hover changes its border and fill. Color and border transitions last 200ms.

The decorative architecture is hidden from assistive technology. A short staged reveal begins after the existing intro clears. Plate idle motions oppose each other; desktop fine-pointer response is limited to small translations. Animation pauses offscreen or while the document is hidden. Reduced motion disables decorative animation and action transitions, preserving readable static content.

## Do's and Don'ts

- Do preserve the approved Hero copy, destinations, readable static state, and reduced-motion behavior.
- Do keep the foreground provenance with its shipping raster.
- Don't infer global rules or authorize changes to other surfaces from this document.
- Don't reuse the service micro-label as a general eyebrow component; it is explicitly pinned content for this Hero.
