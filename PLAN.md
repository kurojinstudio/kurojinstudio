# KUROJIN REDESIGN — PLAN (unlazy orchestrated mode, tree depth 4)

## Mission
User verdict: current 4 pages are "complete slop". Full creative freedom granted.
Redesign /work, /service, /about, /contact with 4 DISTINCT alternate themes,
dynamic throughout, Awwwards-grade. Keep: Navbar, Footer, SmoothScrollProvider,
CustomCursor, RouteTransition, site-config, /api/contact, all images.

## Shared contract (all leaves MUST obey)
- Framework: Next.js 15 app router, "use client" pages, GSAP + ScrollTrigger,
  Lenis via SmoothScrollProvider (already wraps each page)
- Fonts: font-garamond (EB Garamond, display/italic), font-montserrat (Helvetica, labels)
- Layout helpers: .k-container (max 1600, clamp padding), .k-container-narrow,
  .k-display / .k-display-sm (clamped type), .k-safe
- NO overflow-x clip/hidden on html/body/main or any sticky ancestor (breaks sticky)
- Sections that scroll horizontally or use w-max tracks: overflow-hidden on the SECTION itself
- Every interactive element: real handler or real href. No dead buttons.
- data-cursor="LABEL" on interactive zones for CustomCursor
- Images: /images/work/01-09.jpg, /images/hero-bg.jpg, /images/logo-*.png,
  /images/decor-clients.jpg exist. Use plain <img> for SVGs.
- Reduced motion: wrap GSAP in matchMedia("(prefers-reduced-motion: reduce)") guard
- All GSAP in useEffect + gsap.context(rootRef) + ctx.revert() cleanup
- Keep page exports: default function Work/Service/About/Contact
- Keep <Navbar /> first, <Footer /> last inside each page's root div
- TypeScript strict must pass (npm run build)

## Themes (one per page, all different)
1. /work    — "GALLERY NOIR": editorial archive. Oversized index rows with
              hover image trails, sticky featured showcase (FIXED), horizontal
              pinned scroll, tilted archive grid. Accent: signal orange #ff5c1a.
2. /service — "BLUEPRINT": technical spec-sheet aesthetic. Grid lines, numbered
              modules, generous whitespace (user complaint: needs space),
              mono labels, expanding service rows instead of card grid.
              Accent: electric cyan #22d3ee.
3. /about   — "MANIFESTO": typographic poster page. Giant kinetic type,
              count-up stats, sticky stacking value cards, timeline.
              Accent: acid green #00ff91.
4. /contact — "TERMINAL": dark-room transmission. Form as the hero,
              interactive particle trail canvas, "what happens next" steps.
              Accent: warm white + violet #a78bfa.

## Leaves (parallel subagents)
- L1: /work rewrite     → gates/g1-work.md
- L2: /service rewrite  → gates/g2-service.md
- L3: /about rewrite    → gates/g3-about.md
- L4: /contact rewrite  → gates/g4-contact.md
- L5 (parent): integration — build, audit, nav test, overflow check

## Status log
- [x] Gates written before work
- [x] Card-stick bug root-caused (overflow-x clip on html/body/main breaks sticky per CSS spec) + fixed + verified via CDP (ROW1-3 rectTop=128)
- [x] unlazy skill installed to hermes skills dir
- [x] L1-L4 fan-out dispatched (deleg_5d7a518b): work=GALLERY NOIR, service=BLUEPRINT, about=MANIFESTO, contact=TERMINAL
- [ ] L5 integration + gate-check
