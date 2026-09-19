# Opening polish — intro / Hero / Memphis

Scope: these three experiences only. The user explicitly confirmed keeping the WhatsApp/planilhas headline and a single briefing CTA, superseding the attached prompt's alternate copy. Lab content, services, pricing and footer are unchanged.

## Motion thesis

The intro opens as a line-based cover; the architectural Hero resolves beneath it; the first sculptural pieces share its departure. The same two foreground meshes subsequently move out of the rain and through the camera to reveal each chapter. Native scroll remains the only story clock.

## Implementation

- Intro retains mandatory click/Enter/Space and the existing release/watchdog/focus contract. Galaxy is no longer mounted here: SVG curves, a restrained field and the existing idle timeline provide the finished lightweight view. The frame dissolves during the final .45s; the Hero still starts with .2s overlap. Intro copy fades out earlier and the portal unmounts after entry.
- Existing short Hero line reveal and grouped exit are preserved. CTA exit is on a separate inner wrapper, so it cannot overwrite its entrance transform/opacity. Aurora is optional, error-contained, and skipped for constrained connections; the architectural CSS surface is always present.
- Removed the story spring: both 3D and text consume the actual normalized scroll value, without settling motion at rest. One persistent live heading; HTML commits after the corresponding WebGL frame. Continuous text finishing fade is used in both renderers, not forced to one in 3D.
- Wipes have constant mesh scale. Camera distance moves through 16 / 7 / 2.1 / final coverage depth. The same meshes are visible in the rain before .25 local progress. Coverage is stable at .88–.94; chapter changes at .91; incoming opacity starts after .94. Exit continues through camera depth and downward, deterministically reversible.
- Foreground ordinary pieces can graze the text boundary but cannot invade the main reading region. Measured copy bounds and responsive margins drive the exclusion region.
- The vector edition projects the same rain and wipe poses, includes real text and has no technical status copy. It is present from initial render. 3D promotion waits for readiness and stable progress. Failure restores the vector surface immediately; hidden vector animation work stops when WebGL takes over.
- R3F uses demand rendering (never when inactive), capped DPR, cached geometry/materials and disposal, no postprocessing or time-driven rain.

## Verification

`tests/story-depth.test.mjs` checks constant scale, deterministic seeking, depth approach and raycast coverage of text plus margin over wide/mobile aspect ratios. `tests/story-timeline.test.mjs` checks continuous envelopes, hidden swaps and reduced motion. Existing physical tests were aligned with the new .91 swap rather than the superseded .85 schedule.

`tests/opening-production.browser.mjs` targets `next start` on localhost:3100 after build, records direct browser video and captures intro, Hero, handoff, all chapters and both wipes. Includes opaque-HTML pixel comparison to prove physical coverage, reversal, slow/fast scroll, rest, resize, Lab boundary, WebGL disabled, actual lazy chunk abort/delay, saveData, 2G and reduced motion.

The software-rendered browser is suitable for correctness and visual-state checks, not a claim of 60fps on a midrange physical phone. Device performance validation remains necessary.

## Outside-scope finding

The literal “Prévia visual em breve” is emitted by LabMedia because both LabProject.image fields are null. It is not a 3D placeholder. No unverified screenshot or invented case image was substituted; permission to change that separate empty-image presentation was requested.
