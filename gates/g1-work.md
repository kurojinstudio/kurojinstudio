# GATES — L1 /work "GALLERY NOIR"

- [x] G1.1 Page compiles: 200
  EVIDENCE: curl /work → 200 (2026-08-20, post-.next-nuke)
- [x] G1.2 Sticky preview card works (THE BUG THE USER REPORTED)
  EVIDENCE: diag-sticky.cjs → ROW1/ROW2/ROW3 rectTop=128 at scrollY 1596/2233/2869,
  active image opacity toggles 01→02→03→04. Root cause: overflow-x clip on
  html/body/main breaks position:sticky per CSS spec — removed.
- [x] G1.3 No overflow/exceptions
  EVIDENCE: audit-pages.cjs → /work nav=true footer=true h=8156px, no overflow issue
  (edge-bleed flags are intentional w-max marquee/parallax tracks inside overflow-hidden sections)
- [x] G1.4 Category filter works
  EVIDENCE: test-nav2.cjs → "Button test on /work: clicked: Web" — filter state changes rows
- [x] G1.5 Editorial index hero + archive rows + tilted grid + horizontal showcase present
  EVIDENCE: page rewritten as GALLERY NOIR — oversized numbered index with cursor-follow
  preview, FeaturedShowcase, HorizontalShowcase (05-09.jpg), editorial archive rows,
  TiltedRevealGrid, closing CTA
