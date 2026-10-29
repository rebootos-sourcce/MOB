# Hero's Journey runtime delivery — integration notes

**Branch** \`atunED/teachers-poles-ascent-alpha-2026-10-25\`.

This release introduces *actual application modules*, not just documents. It does not alter canonical CQ arithmetic, the existing release writer, or the Ritual Builder writer.

## Implemented
- \`engine/data/hero_journey.js\`: 26 source-derived scenes, stable IDs, provisional law crosswalks.
- \`engine/hero_journey.js\`: CQ-position projection (0–40 Inferno, 40–60 Purgatorio, 60–100 Paradiso), full-intake guard, unique release-side key derivation, immutable complete CQ baseline, optional selected encounter distinct from position, real held-address selection and ritual suggestion adapter.
- \`ui/hero_journey.js\`: CQ-centered avatar visualization, 26 accessible scene choices, release and daily practice doors reusing \`relPick\` and \`ritStartPlan\`.
- \`engine/avatar.js\`, \`engine/schema.js\`: additive persisted \`cqOrigin\` and \`activeJourneyScene\` with import/export boundary validation.
- \`ui/avatarui.js\`: avatar panel and repaint signature track CQ, release meter and selected scene.
- \`MANIFEST\`: modules ordered into the existing concatenation build.
- \`tests/herojourney.js\`: headless boundary and contract checks.

## Verification
- JavaScript parse checked for the new modules and two patched application files.
- Logic evaluated in an isolated real JS function environment against stage boundaries, release-side filtering, CQ baseline and candidate actions.
- Full \`BUILD.sh\`, \`BUILD-engine.sh\`, live Chromium tests, profile roundtrip tests, and actual deployed browser **have not run yet**. GitHub connector file edits do not execute repo scripts.
- Because 26 source records have null fixed \`releaseProtocolId\` and \`becomingRitualId\`, the new UI reaches the existing writers **dynamically** from concrete imprints/practice IDs. This should be marked runtime dynamic wiring, **not complete semantic approval of 26 fixed protocol joins**.

## Known next gates
1. Run \`./atuned_src/BUILD.sh\` and \`./atuned_src/BUILD-engine.sh\`; assert host-free engine, module ordering and no duplicate function declarations.
2. Run \`node tests/herojourney.js\`, \`node tests/engine.js\`, existing avatar, ritual, release, record and journey Chromium suites.
3. Browser check \`avatar.cqOrigin\` and \`avatar.activeJourneyScene\` persist through \`validateProfile\`, \`pExport\`, \`pImport\`, refresh; check not overwritten on release, or when CQ declines.
4. Build the merged Core-10 + remaining-11 63-question diagnostic and account handoff (older \`intake.js\` still contains left/right/neutral).
5. Complete per-scene approved imprint/protocol/ritual joins, source research and four-depth verification, then merge the separate Deep Psyche branch.
6. Approve visual asset and scene art direction and performance/accessibility E2E before production.

## Owner decisions honored
- Both visual avatar form and Board position evolve.
- CQ is the only position coordinate.
- Only unique release-side keys create release milestones; existing meter and billing unchanged.
- Ritual completions are recorded, but neither affirmations nor mere visits create synthetic CQ.
- Original 21-law measured coverage required before showing an exact Board position.
