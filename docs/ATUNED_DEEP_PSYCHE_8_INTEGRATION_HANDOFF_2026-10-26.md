# ATÜNED Deep Psyche 8 — Integration Handoff (2026-10-26)

**Continuation:** Deep Psyche 7 → 8. **Repository:** `rebootos-sourcce/MOB`, working branch `atuned/deep-psyche-end-to-end-2026-10-26`, draft PR [#131](https://github.com/rebootos-sourcce/MOB/pull/131). Re-fetch branch HEAD before edits; this file itself advances it.

## Verified source-registry structure

- 149 unique Deep Psychological records; 13 typed templates; all 149 records have populated template-required fields, three original research-pass objects, four depth-review objects (596 total), and nonempty navigation links.
- Direct source-blob recheck: zero unresolved internal links, zero nonreciprocal internal links, zero unregistered parent IDs, 374 typed relationship objects mirrored as 187 typed pairs, all with status/source reference. The `graphBuild` metadata's 169 refers to *integration-added* pairs, not the entire 187 source-registry edge inventory.
- 537 source reference entries; 361 source claim entries. The Blueprint and Consciousness grouping model records have source references and typed connections but no discrete `sourceClaims` arrays.
- Existing `templateValidation.contentStatus`: 116 complete (not blanket canonical endorsement), 19 v336 text / exact v341 qualified, 14 provisional visual-only slots.
- 51 explicit qualifiers: 19 versioned Domain wordings, 14 Blueprint visualization positions, 12 cultural figures, 6 supplemental Archetypes. 36 source mapping rows also remain typed *navigation associations*, not automatically approved causal equivalences.

## Deep Psyche 8 integration changes

- `tools/build-deep-psyche-app.js`: preserves **complete** source references and claims plus typed relationship/provenance evidence, relationship audits and four-pass structural status in generated shipped-app data. Enforces typed relationship endpoint/status/source presence.
- `tests/deep-psyche-app.js`: verifies source-to-app parity for every record's sources, typed edges, research status; requires `source.html` under CI; isolates and renders the linked-record drill as an additional smoke test.
- `atuned_src/ui/knowledge.js`: Deep Psyche drill links directly to connected records and displays their typed relationship status and source references. Source rows are explicitly not presented as causal equivalences.
- `tools/audit-deep-psyche-handoff.js`: generates a read-only, 149-row, machine-readable source evidence and graph report. `--strict-structural` enforces template, ID, reciprocity, and provenance invariants without claiming semantic approval.
- `.github/workflows/deep-psyche-runtime.yml`: checks the new structural audit and persists `deep-psyche-8-audit.json` along with the separate conservative closure audit.

**Execution evidence:** Against the direct 2,538,016-character GitHub source blob, the new app generator and structural handoff audit both executed successfully with simulated filesystem I/O: 149 emitted app records, 374 typed relationship objects, 537 source refs; structural failures zero; qualification groups 19+14+12+6. The Knowledge drill source was separately compiled and rendered in an isolated fixture, showing traversable links, provenance/status and source reference text. **These tests are not a substitute for the full Node build, production browser and deployment smoke.**

## Required next verification in the full repository checkout

```bash
node tools/audit-deep-psyche-handoff.js --strict-structural > deep-psyche-8-audit.json
node proto/knowledge/src/gen-data.js
node tests/deep-psyche-runtime.js
node proto/knowledge/src/validate-templates.js
node tools/build-deep-psyche-app.js
sh atuned_src/BUILD.sh
CI=1 node tests/deep-psyche-app.js
node proto/knowledge/src/audit-deep-psychological-closure.js --strict
```

The final strict semantic gate is **expected to fail until source approvals are resolved**; do not override this guard to achieve a green job. Check the actual GitHub Actions jobs/logs for the latest commit, then browser-test desktop/mobile Knowledge search, record open, record-to-record click, back/close and produced `source.html`. Verify actual merged/deployed output separately.

## Source authority / unresolved boundaries

1. The owner-supplied **v336** source file `MOB_Complete_v336(3).html` has SHA-256 `a7ede7afe94e823f61559b9e7ba4ac5633609153c543a960dfff58b716c74542`, verified directly in Deep Psyche 8. Its Chapter 12 supplies the functional domain wording.
2. The prior **v341** extraction reports SHA-256 `79c8ddd9fc3ea586cec56f523351702ee1ac96336ceff39f80730582332466e4`; the original v341 bytes were not recovered in this run. Keep 19 v341-roster records cross-version-qualified; do not fabricate 19 exact v341 standalone definitions.
3. Preserve the separately counted **19 v341**, **15 current manuscript**, **18 historical v184**, and **14 Blueprint visual positions**. Fourteen unnamed positions are not 14 named Domains. Also preserve Empyrean + seven Conscious Domains, and separate 3 related consciousness concepts; do not invent specific chakra/affirmation assignments.
4. A separate owner Library candidate `ATUNED_BLUEPRINT_BEHAVIORAL_ENERGY_REGISTRY_v2.json` contains 31 movement primitives, 15 domains and 15 archetypes. It is marked `implementation_candidate`, not authority to overwrite the existing canonical versioned registry.
5. Establish a source-grounded *global denominator* for the remaining Nerve→Fetter→Saboteur→Complex→Hypercomplex→Supercomplex/Character, Inferno/Purgatorio/Paradiso, Compass 40–60 oscillation and 21 laws before declaring project-wide completion.

**Release ruling:** Deep Psyche 8 has improved source-verified structural and UI integration and a reproducible handoff audit. **Not semantically/production complete; PR is draft until the remaining gates pass.**
