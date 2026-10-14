# ATÜNED Creative Decision Log

**Date:** 2026-10-14. **Status:** working record, not final visual approval. **Branch:** `lookdev/p0-execution-20261014`.

## Cross-functional review inputs

- Creative direction: resolve truth/quality conflicts across disciplines.
- Brand direction: promise, identity, positioning.
- Art direction: form, colour, light, composition, typography, iconography.
- UI/UX: information architecture, cognitive load, responsive interaction.
- Animation/VFX: motion, transitions, choreography, reduced-motion behavior.
- Narrative/copy: all labels, onboarding, errors, terminology and voice.
- Sound: opt-in audio, purpose, synthesis cost and silent-path parity.
- Technical direction: rendering feasibility and measured frame budgets.

These role definitions were read from `.claude/agents/creative-director.md`, `brand-director.md`, `art-director.md`, `uiux-architect.md`, `animation-vfx-director.md`, `narrative-director.md`, `sound-director.md`, and `technical-director.md` on `main`.

## Working decisions

1. **Keep provisionally:** The Field as meaningful interface, not decorative background. Signals and connections should communicate state or relationships. Source: `ATUNED_Funnel_Creative_Direction_TDD_v1.md` in Library, retrieved this round.
2. **Keep provisionally:** recognition before explanation, using the documented north star “SEE WHAT'S RUNNING YOU.” Validate this against the exact current funnel source and owner direction.
3. **Keep as copy rules:** grounded, direct, precise language; sentence case; name the behavior; avoid ambiguous abstractions and generic wellness clichés. Source: brand and narrative agent definitions.
4. **Keep as engineering rules:** measure motion on the real page; test reduced motion; sound stays opt-in and cannot be required to complete a task. Source: technical, animation and sound agent definitions.
5. **Reject:** choosing Core/A/B without matched visual evidence; calling a historical timing record a repeat measurement; closing a P0 from a patch commit or a queued workflow.

## Active execution blocks

- **P0-A Appendix:** patch commit `ebd6e177f5d35262cbd2c3793da805baac4ba111`; workflow `38625732509` queued. Issue #75 remains open until exact-head browser acceptance and artifacts pass.
- **P0-B Performance:** workflow `38625541558` is running three Field B measurements with source and output hashes, costs and request logs.
- **P0-C Visual comparison:** workflow `38625672498` captures Field A/B at 1600×1000 and 390×844. Core is excluded until its canonical source is identified.
- **P0-D Source recovery:** large root source and `engine.js` blobs return empty through the text connector. Recover via byte-capable checkout/CI and record hashes.
- **P0-E Brand guide:** exact Brand Dev 3/4/5 sources and the reviewed local HTML/QA package are not yet available in the current working environment. Related creative direction is not a substitute.
- **P0-F QA and mapping:** finish 12-tab source map, KPI thresholds, keyboard/screen-reader/contrast checks, and evidence-backed keep/change/reject decisions.

## Closure rule

No P0 closes from intent, commit, or queued CI. Require exact-head test result, inspected evidence artifact, source hash, and recorded limitations. Keep the PR draft/open. Do not merge or deploy until release gates pass.
