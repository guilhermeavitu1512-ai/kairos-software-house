# KAIROS typography — DM Sans

The user requested a more elegant, sophisticated family across the site. DM Sans Variable replaces Manrope for public KAIROS typography: headings, navigation, prose, form controls and metadata. Product screenshots and independent admin branding are not redrawn.

Use the existing responsive sizes and weight hierarchy. Body tracking is -.005em; public page headings use -.03em for less compressed lettering. Retain Portuguese copy, layout and animation contracts. Existing 450/550/650 weights now have real variable interpolation rather than static-weight substitution.

Fontsource's normal variable WOFF2 assets are bundled locally with font-display:swap and Segoe UI/sans-serif fallback. No third-party font request is needed at runtime. The four Manrope stylesheet imports were removed.

Verification: build including TypeScript and scoped layout lint passed. Production browser checks confirmed loaded DM Sans and no horizontal overflow at 1440px/390px for home, contact, project directory, VYNE and about. Hero and pricing screenshots inspected at both widths. Existing size-ramp detector advisories refer to historical DESIGN.md sizes; size/layout redesign is outside this font replacement.
