# ATUNED Deep Psyche: Four-Pass Build Audit
Date: 2026-10-26
Branch: `atuned/deep-psyche-end-to-end-2026-10-26`
PR: https://github.com/rebootos-sourcce/MOB/pull/131
Scope: shared Deep Psychological registry plus the existing knowledge generator and shipped ATUNED Knowledge UI.

## Authoritative sources and version discipline
- Owner-provided Mechanics of Being v336, Chapter 12 (`#ch12`): 19 explicit Domain descriptions, each with clear and distorted expressions and cultural examples. SHA-256 `a7ede7afe94e823f61559b9e7ba4ac5633609153c543a960dfff58b716c74542`.
- The documented `MOB_Complete_v341.html` extraction establishes the 19-domain 5/5/5/4 roster, but does **not** establish v341 wording for every standalone definition. Its recorded source SHA-256 is `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`.
- `MOB-Manuscript/index.html` contains a separate fifteen-heading domain version. `Reboot-OS/atuned/data/canon.json` is built from historical v184. Different 14/15/18/19 denominators are separately preserved.
- Mechanics v336 distinguishes Universal Domain -> Personal Blueprint (one configuration per person) -> Archetype (expression through psychology). Fourteen Blueprint visualization positions are NOT fourteen separately defined psychological domains.
- Mechanics v336 provides separate descriptions and positive poles for Surprise (Readiness) and Anticipation (Presence). The old AXCARD's Receiving blocked/Grief naming conflict remains documented; these cards have not been silently substituted.

## Four recursive review rounds, run on each of 149 records
1. Primary provenance/source and required-template-field verification (149/149 executed).
2. Cross-source concept and taxonomy challenge, with version conflicts retained (149/149).
3. Typed relationship references, parent/child and reciprocal link consistency (149/149).
4. Required fields, research-pass accounting, adversarial acceptance summary (149/149).

**Four review passes executed per record (596 recorded audits).** These are four distinct source/architecture verification stages, *not* a claim of four independent external research studies. The pre-existing three research-pass objects remain preserved on each record.

## Static results for latest registered data
- 149 unique source-registry records, including newly added `blueprint:personal-model` and `consciousness:conceptual-group`.
- 149/149 assigned registered templates, missing actual required fields: 0.
- 149/149 records have four depth-review objects.
- 149/149 have at least one navigable link; 14 Blueprint display-only slots connect only to their display-model structure.
- Dangling IDs: 0; non-reciprocal declared links: 0; parent/child mismatches: 0 in the fourth-pass review.
- 19 v341 roster records have source-qualified v336 functional descriptions (clear/distorted, cultural examples); exact v341 wording remains open.
- 51 records explicitly retain semantic qualifications (cross-version descriptions, display-only visuals, non-owner-dictated archetypes, or cultural mapping semantics). Structure PASS does NOT promote these to canon.
- 19 domain-roster records, 15 versioned behavioral-domain records, 18 archetype candidates, and 14 visual-only blueprint positions join through a source-defined conceptual Personal Blueprint, without asserting one-to-one identity.
- Eight conscious-domain records and three separate related consciousness records have a category container while preserving separate roster identity.
- 12 legacy generator/validator gaps addressed in source: four authored aliases, five documented null emotional axes, one composite record's unassigned seat/sub, and two manuscript-defined child-emotion states. Fresh runtime regression after those fixes is required.

## Integration and execution
- `proto/knowledge/src/gen-data.js`: merges the shared registry with engine knowledge records.
- `tests/deep-psyche-runtime.js`: verifies all source records, four-pass records, reciprocal cross-graph edges, template fields, 18/18 ARCH18 source-seat nerve traversal, named Blueprint and consciousness models, 10 engine legacy families, and shared UI rendering.
- `tools/build-deep-psyche-app.js`: generates the shipped app's `atuned_src/engine/data/deep_psyche.js` from the same registry, with hard checks for duplicate IDs, missing fields, missing links and missing four-pass record evidence.
- `atuned_src/MANIFEST`: loads generated psychological data before the shipped `atuned_src/ui/knowledge.js`.
- `atuned_src/BUILD.sh` and `BUILD-engine.sh`: regenerate the module before validating module load order.
- `atuned_src/ui/knowledge.js`: exposes source-defined records through a separate 'Deep Psyche' deck; visual placeholders are available in the data inventory but deliberately excluded from the named deck.
- `tests/deep-psyche-app.js`: checks source-to-app parity, kind coverage, 14 display-only placeholders, 19 domains, 18 archetypes, four-pass metadata, manifest order, UI route, and actual built `source.html`.
- `.github/workflows/deep-psyche-runtime.yml`: CI generates knowledge, tests end-to-end links, enforces legacy template validation, runs the actual shipped app build, and checks shipped app data/UI parity.

## Current release gate
The latest checkout has **not** yet been given a passed GitHub Actions run as of this audit. GitHub queued the new workflows behind older branch runs. Earlier successful runs are evidence for the earlier 147-record build only, not the latest 149-record full-app build.
The PR remains a draft and unmerged. The full Inferno/Purgatorio/Paradiso realm register, separately from these Domain/Blueprint/Archetype records, has NOT been audited to a verified project-wide denominator. **Do not declare all ATUNED layers 100% complete from this component-scoped 149-record result.**

## Last required operations
```bash
node proto/knowledge/src/gen-data.js
node tests/deep-psyche-runtime.js
node proto/knowledge/src/validate-templates.js
sh atuned_src/BUILD.sh
node tests/deep-psyche-app.js
node proto/knowledge/src/audit-deep-psychological-closure.js --strict
```
`--strict` remains an explicitly conservative canonical-approval gate; any future change to it must follow source adjudication, not merely change a status literal to PASS.
