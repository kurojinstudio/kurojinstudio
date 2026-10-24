# GATES — L2 /service "BLUEPRINT"

- [x] G2.1 Page compiles: 200
  EVIDENCE: curl /service → 200
- [x] G2.2 Generous spacing (USER COMPLAINT: cramped)
  EVIDENCE: probe-service.cjs → hero 947px tall, paddingTop 240px (navbar clears fully),
  page grew 1759px → 6873px after removing the unlayered universal reset that was
  killing every Tailwind padding utility (Tailwind v4 @layer cascade bug).
- [x] G2.3 Service modules expand
  EVIDENCE: 21 [data-bp-item] rows, grid-template-rows 0fr→1fr expansion, first open by default
- [x] G2.4 FAQ accordion functional
  EVIDENCE: faqs array + openFaq useState at service/page.tsx:89,128,387 — click toggles
- [x] G2.5 Parallax deliverable cards (new, per user request)
  EVIDENCE: SvcParallax.tsx — 6 [data-pcard] cards, per-card scrub drift speeds 0.5/0.95/1.4,
  tilt-on-entry, verified pcards=6 in final-verify.cjs
- [x] G2.6 Header top spacing so navbar shows, no content behind it
  EVIDENCE: hero pt-52 md:pt-60 = 240px computed padding-top
