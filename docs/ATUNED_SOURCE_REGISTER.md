# ATÜNED / Mechanics of Being, Source Register

**Status:** Initial durable source register  
**Last verified:** 2026-10-20  
**Purpose:** Preserve source locations and retrieval instructions so future work can find the canonical material instead of treating prior references as missing.

## Canonical repositories

1. **Mechanics of Being / ATÜNED application repository**  
   Repository: `rebootos-sourcce/MOB`  
   URL: https://github.com/rebootos-sourcce/MOB  
   Default branch observed: `main`  
   A recursive tree query returned 6,027 paths and was not truncated.

2. **Mechanics of Being manuscript repository**  
   Repository: `rebootos-sourcce/MOB-Manuscript`  
   URL: https://github.com/rebootos-sourcce/MOB-Manuscript  
   Default branch observed: `main`  
   The root listing exposed `index.html` and `.gitattributes`. This repository is private and was visible through the connected GitHub integration.

## Verified source locations in `rebootos-sourcce/MOB`

| Path | Role / observed evidence | Confidence |
|---|---|---|
| `source.html` | Large canonical/source HTML artifact present at repository root; path and size were returned in the repository contents listing. | High: path existence |
| `index.html` | Large root HTML artifact present. | High: path existence |
| `proto/fw/pages/fetters.html` | Fetter placement interface. Retrieved content describes one dot per fetter and front/back body views. It includes a note that 28 placements were proposed from anatomy and were not shipped; this is a warning that proposals must not be mistaken for canon. | High: content retrieved |
| `proto/fw/out/fetters.html` | Generated Fetter output present in repository tree. | High: path existence |
| `proto/fw/out/fetters-packed.html` | Packed Fetter output present in repository tree. | High: path existence |
| `reviews/FIX-fetters.md` | Detailed Fetter UI review/fix record. Retrieved content distinguishes the Body Fetters surface from Knowledge/Fetters and describes reproducible UI defects. | High: content retrieved |
| `reviews/MASTER-BMT-AUDIT.md` | Master audit document present in repository tree. | High: path existence |
| `reviews/NEXT-AI-AUDIT.md` | Audit/handoff-oriented document present in repository tree. | High: path existence |
| `AUDIT-source-tdd.md` | Source/TDD audit document present. | High: path existence |
| `AUDIT-source-tdd-v3.md` | Later source/TDD audit document present. | High: path existence |
| `BACKLOG-AUDIT.md` | Backlog audit document present. | High: path existence |
| `SUMMARY-AUDIT.md` | Summary audit document present. | High: path existence |
| `REVIEW-FRAMEWORK/BRIEF.template.md` | Review framework template present. | High: path existence |
| `REVIEW-FRAMEWORK/PASS2.template.md` | Review framework Pass 2 template present. | High: path existence |
| `REVIEW-FRAMEWORK/PASS3.template.md` | Review framework Pass 3 template present. | High: path existence |

## Prior audit artifact identifiers to search for

The following identifiers were previously referenced in ATÜNED project conversations. Their underlying records have **not yet been individually located and content-verified** in the repository tree. Search exact IDs and alternate spellings before declaring them absent:

- `PASS46_NARRATIVE_COUNTERPART_CLOSURE_AUDIT`
- Pass 49 / Pass 50 audit artifacts
- `TPL-NODE-CHARGE-STASIS-NARRATIVE-V1`
- `TPL-NODE-CHARGE-STASIS-INFERENCE-V1`
- `TPL-OPPOSITE-COUNTERPART-CHARGE-V1`
- inference registers, counterpart audits, template catalogs, row-level gap registers
- `MOB_Complete_v341.html` and any referenced v336 version

A filename not found in a listing is not proof that the artifact never existed. It may be embedded in a larger source file, stored on another branch, recorded under another name, available in another Project surface, or present in conversation history.

## Retrieval protocol

1. Start with this register and the repository tree, not memory of filenames alone.
2. Search the repository tree for `fetter`, `complex`, `charge`, `counterpart`, `inference`, `template`, `pass49`, `pass50`, `v341`, `audit`, and `handshake`.
3. Retrieve the actual file content before citing a file as evidence. A path listing verifies existence, not correctness or completion.
4. Inspect the latest source and audit/version notes. Reconcile `source.html`, `index.html`, manuscript copies, and versioned HTML such as v341/v336 before treating one as canonical.
5. Distinguish **canonical source**, **generated output**, **proposed interpretation**, **audit finding**, and **inference**. Never promote a proposal to canon without evidence.
6. Keep prior numeric gap counts labelled **unverified** until recomputed from the current source and row-level records.
7. Do not wire inferred relationships or proceed to connection implementation until every required descriptive object, inference, counterpart, summary, and template passes the user's text/template closure gate.

## Closure gate carried forward

For each layer, level, concept, descriptive object, inferred item, and inferred relationship:
- provide a meaningful ATÜNED-style summary;
- define meaning, behavior, applicable energy/charge, governing rules, boundaries, breakdown/failure modes, and provenance;
- give each inferred item/relationship its own summary and inference template;
- tag every header with a summary;
- perform three distinct deep passes: source recovery, meaning/discriminants, and adversarial completeness;
- explicitly resolve counterpart/release status, or mark unresolved / not applicable with a reason;
- retain source locations, source version, confidence, and unresolved conflicts;
- do not begin connection wiring until this gate passes.

## Known retrieval state as of 2026-10-20

- The MOB repository and the MOB-Manuscript repository have been located.
- The MOB repository tree was successfully retrieved: 6,027 paths, not truncated.
- The Fetter page and the Fetter fix review were retrieved and inspected.
- The exact prior Pass 49/50 registers and template-ID artifacts have not yet been individually content-verified.
- The initial conversation ZIP `ATUNED_TEXT_CLOSURE_EXECUTION.zip` is a working documentation/spec package, not proof that the framework's content closure is complete.

## Confidence and ratings

- Repository identification: **High**
- Existence of listed paths: **High** where explicitly returned by repository tree/content APIs
- Completeness of the source inventory: **Partial / not yet complete**
- Current truth of previously reported gap counts: **Unverified**
- Framework closure status: **Not verified; do not declare complete**


## Recursive audit log added, 2026-10-20

- [`docs/ATUNED_FRAMEWORK_CLOSURE_AUDIT_LOG_2026-10-20.md`](ATUNED_FRAMEWORK_CLOSURE_AUDIT_LOG_2026-10-20.md), records the source-backed findings from `atuned_src/engine/data/canon.js`, the three-pass method applied to that source, explicit risks, acceptance status, and next recursive actions.
- Commit: `8151beb9e2cf85c0ce3bb377d3ca91e509945f62`.
- The source index now links to this audit log.
- New finding: the code contains explicit proposal/canon boundaries that must be preserved, including unapproved node-state thresholds and proposed anatomical Fetter placements.
- The audit does not claim all concepts have received three full passes; that remains an open gate.


## Active phase update, Super-Complexes first (2026-10-20)

**Owner-directed order:** begin Super-Complex source reconciliation and design now. Do not gate this phase on completion of nerve/node/fetter/Saboteur/Complex/Hyper-Complex audits. Those closure tasks remain queued for after the Super-Complex discussion.

**Read first:** [ATUNED_SUPER_COMPLEX_PHASE_HANDSHAKE_2026-10-20.md](ATUNED_SUPER_COMPLEX_PHASE_HANDSHAKE_2026-10-20.md). It lists the required first-read sources, source authority hierarchy, current candidate families, exact retrieval blockers, and required deliverables.

### Priority retrieval blockers that must remain visible
- `MOB_Complete_v341.html`: required exact source/version; not yet recovered via the last retrieval path. Do not silently substitute the v336/v2 staging artifact.
- Large root `source.html`: GitHub connector did not return usable body text.
- Referenced `MOB-Manuscript` README: inaccessible via the connector used in the previous pass.
- Original nerve-to-character semantic mapping and owner-defined list of eight ordinary Complexes: not yet located with an authoritative source locator.
- Super-Complex general membership rule: unresolved in the inspected Library inference-gates CSV; source/owner decision required.
- Psychopathy as a canonical Super-Complex: explicitly rejected by owner; source code label is not Canon.

These are retrieval/decision blockers, not evidence of absence. The next pass must search the Project Library, conversation files, and source registers with exact names and document the precise locations searched before reporting any item globally unavailable.

## Deep-psychological record-first source audit, 2026-10-22

| Path | Role / evidence | SHA or status |
|---|---|---|
| `docs/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_FORMAT_TDD_v1.md` | Record-first execution order, shared envelope, three-pass method, acceptance gates | Committed on MOB main; linked from source index |
| `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_SCHEMA_v1.json` | JSON Schema for the common record envelope | Committed on MOB main; structural audit performed against registry |
| `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json` | 107 entries: 93 source-backed/owner-stated records and mapping rows plus 14 visualization-only placeholders | Current registry; every item has three research-pass slots |
| `docs/ATUNED_DEEP_PSYCHOLOGICAL_THREE_PASS_RESEARCH_AUDIT_2026-10-22.md` | Three-pass source audit, provenance findings, visual-vs-canonical count conflicts, and next checkpoint | Committed on MOB main; linked from source index |
| `Reboot-OS: atuned/src/40_the-archetypes.js` | Provenance note: first twelve archetypes owner-dictated; six added from web research, not dictated | SHA `e6a7dd0b5891fed6e9903b28e0f7ac00f2a21049` |
| `Reboot-OS: atuned/src/45_the-psyche-map.js` | Visualization layer counts; counts are not accepted as canonical record denominators | SHA `9cd5d9b93ce3522b9f7c523efdfe6ee6fe1bc9d6` |
| `Reboot-OS: atuned/data/canon_tables/ARCH12.json` | 18 archetype content entries | SHA `2294d2a0bdde603e331a45e2f1f4785571719fff` |
| `Reboot-OS: atuned/data/canon_tables/ARCH18.json` | 18 archetype/fetter/seat tuples | SHA `dc4a5713c70c63d93569226b7e2cdb3dc29299a6` |
| `Reboot-OS: atuned/data/canon_tables/ARCHDOM.json` | 18 archetype/domain mappings | SHA `cc2cec9775282a658625b1f4435ee2e04ecb300b` |
| `Reboot-OS: atuned/data/canon_tables/CDOMAIN.json` | 12 cultural-figure/domain mappings | SHA `e825043f9601fe8ff4a7dc08ccacdeaab668bd91` |
| `Reboot-OS: atuned/data/canon_tables/manifest.json` | Canon table descriptions and row counts, including HYPER=8, MASKS6=6, SAB33=33, NODEREG=112 | SHA `9cc010fac9b46e27e90594167de3ed5cdf89c680` |

The new registry is an inventory and research ledger, not a runtime integration. Do not remove prior closure blockers until source denominators, templates, generated output, and graph tests have been verified.
| `docs/ATUNED_DEEP_PSYCHOLOGICAL_CODE_TO_REGISTRY_CONTRACT_2026-10-22.md` | Exact generator template fields and closure-validator contract compared with the 125-record psychological registry; adapter and runtime gaps | Commit `0fef21a2150df55095a1e08c35212b116ec6d76b` |
