# ATUNED Complex Record Inventory — Source Map and Closure Register

**Audit date:** 2026-10-20  
**Repository:** rebootos-sourcce/MOB, default branch main  
**Status:** OPEN — source map created; canonical denominator and record coverage are not yet established.  
**Priority:** P0. Complete source-backed layer inventories and required records/templates before wiring relationships or doing unrelated work.

## Purpose

This document preserves the exact sources inspected for the complex layer so future threads do not repeat discovery from scratch or mistake a partial source hit for a complete inventory. It distinguishes what the inspected source proves, what it does not prove, and the next required action. The count must not be promoted to a canonical total until all authoritative sources and source-backed record families have been reconciled.

## Sources inspected

### 1. atuned_src/engine/data/compass.js
- Repository path: atuned_src/engine/data/compass.js
- Blob SHA observed: b165e957b4c0db8dea75de8caf1f9f4b3ebc0282
- Relevant section: DESCENT, headed “THE NARCISSISM DESCENT”.
- Confirmed definitions in this section:
  - **Narcissism** — kind: 'complex'
  - **Machiavellianism** — kind: 'hyper complex'
  - **Psychopathy** — kind: 'super complex'
- The section explicitly keeps these as different kinds. Do not count the latter two as ordinary complex records.
- The file also carries a safety boundary: work at the fetter level for the described configuration, do not attempt to address the structural layer, and refer to licensed clinical professionals for parallel support.
- **What this proves:** at least one explicit complex definition is present in this source.
- **What this does not prove:** that Narcissism is the only canonical complex, that a full record/template exists for it in the target record system, or that the complex layer's expected denominator is one.

### 2. SNIFFER_SPEC.md
- Repository path: SNIFFER_SPEC.md
- Blob SHA observed: ea172cd3ac68ebfd6212eb010f1f5724d1026cec
- Relevant section: “Detection layers, in firing order”.
- The spec defines the causal sequence as **bias → fetter → saboteur → complex → hyper-complex** and states that mask is output, not a rung.
- **What this proves:** complex and hyper-complex are distinct layers in the source taxonomy.
- **What this does not prove:** the complete list/count of complex definitions or record/template coverage.

### 3. atuned_src/engine/data/canon.js
- Repository path: atuned_src/engine/data/canon.js
- Blob SHA observed: e7aa11668008aa145e47f023c622ef026e1c662f
- This file is a canonical/configuration registry with explicit provenance boundaries, including content marked proposed. A text search did not reveal a complete ordinary-complex registry here.
- **What this proves:** this is a required provenance/configuration source to reconcile.
- **What this does not prove:** absence of complexes from all sources. Do not use absence of a matching text string in this file as a global zero count.

### 4. proto/knowledge/src/gen-data.js
- Repository path: proto/knowledge/src/gen-data.js
- Blob SHA observed: 65e6a7f8377d0f3bc437094f0f0c1eb175cc4c8c
- The generator emits knowledge-base kinds from engine tables. The previously inspected generation path does not emit a complex record kind.
- **What this proves:** the inspected generated knowledge-base pipeline currently does not produce explicit complex-kind records.
- **What this does not prove:** that no complex source definitions exist elsewhere or that no other application subsystem stores complex data.

### 5. proto/knowledge/src/validate-templates.js
- Repository path: proto/knowledge/src/validate-templates.js
- Blob SHA observed: 78b2c8039b61605256cf3e6b25ff18a82b8246b
- Required kinds include complex, supercomplex, and inferred; the validator fails closed if required kinds/assignments are missing.
- **What this proves:** the intended knowledge-base closure gate expects explicit complex-family records.
- **What this does not prove:** current compliance or the canonical denominator.

### 6. docs/ATUNED_TEMPLATE_CONNECTIVITY_CLOSURE_EXECUTION_2026-10-20.md
- Existing audit checkpoint; currently open.
- It requires extracting canonical concept and relationship inventories, distinguishing canonical/inferred/proposed/unresolved edges, checking template assignments and required content, and running graph/reference tests.
- This inventory document is subordinate to that closure gate and must be updated alongside it.

## Count and coverage status

| Measure | Verified result | Interpretation |
|---|---:|---|
| Explicit ordinary-complex definitions found in the inspected compass.js section | 1 | Narcissism |
| Higher-order entries in that same descent section | 1 hyper-complex; 1 super-complex | Machiavellianism and Psychopathy; not ordinary complexes |
| Explicit generated complex records in the inspected generator path | 0 | Generator gap, not proof of zero canonical definitions |
| Canonical total of ordinary complexes across all sources | **UNVERIFIED** | Do not report a denominator or completion percentage yet |
| Complete ordinary-complex records with verified templates | **UNVERIFIED** | Presence and template coverage need per-ID inspection |
| Required complex relationships verified | **UNVERIFIED** | Wiring remains blocked until records and edges are inventoried |

## Required next actions — do not skip

1. Inspect the full source/manuscript inventory, including the large manuscript HTML and relevant codex/engine registries; search by section headings and taxonomy, not just the literal word “complex”.
2. Extract every candidate definition and assign a stable source locator. Classify each as canonical ordinary complex, hyper-complex, super-complex, inferred candidate, duplicate/alias, or unresolved.
3. Reconcile duplicates and naming variants without deleting provenance. Record inclusion/exclusion rationale for every candidate.
4. Establish the source-backed denominator and list every expected ordinary-complex ID/name.
5. For each expected complex, verify whether a substantive record exists, whether its template definition and assignment exist, whether required fields are complete, and whether references resolve. Mark missing/incomplete/unverified items as outstanding.
6. Create or complete the missing records/templates. Only after the records are accounted for, wire applicable relationships and run validation.
7. Update this document, the master closure TDD, the gap register, audit log, source index, and executive handshake at the same checkpoint. Remove an item from outstanding work only after evidence-based verification; preserve the audit trail.
8. At thread startup, reopen this document and fetch the current repository files again. Do not rely on remembered counts.

## Non-negotiable reporting rule

Never report “one complex total” from the single definition found here. The only defensible statement at this checkpoint is: **one explicit ordinary-complex definition was located in the inspected section; the canonical total and existing record coverage remain unverified.**


## Owner correction and taxonomy reconciliation — 2026-10-20

**Priority correction from the project owner:** do not classify Psychopathy as a canonical super-complex merely because the current implementation labels it `kind: 'super complex'`. The owner explicitly rejected that classification. The source-code label is an implementation assertion that conflicts with the owner's stated taxonomy and is **not approved canon**. Keep the record as a source candidate with classification disputed until the authoritative Mechanics of Being / ATÜNED source definitions establish its proper layer. Do not count it toward the super-complex denominator.

This correction supersedes the earlier wording in this document that presented the source-code classification as an accepted taxonomy. The code is evidence of what the implementation currently says, not proof of the owner's intended taxonomy.

## Additional source families identified during the full-file review

The complete `atuned_src/engine/data/compass.js` contains more higher-order structures than the three-entry `DESCENT` array. They must be inventoried as separate candidate families, without prematurely treating them as super-complexes:

- **Eight mirror pairs** — the `MIRROR` registry describes eight paired axes / sixteen poles. This is not evidence that the eight pairs are super-complexes.
- **Nine circles / descent** — the `CIRCLES` registry contains Limbo, Lust, Gluttony, Greed, Wrath and sloth, Heresy, Violence, Fraud, and Treachery. This is a distinct named taxonomy; classification in the ATÜNED layer model is unresolved here.
- **Six behavioral-cascade states** — The Zombie, The Drone, The NPC, The Energy Vampire, The Demon, and The Devil. The source labels these as states between early decoherence and full fragmentation; do not silently reclassify them as super-complexes.
- **Four blueprint patterns** — Malak, Baal, Set, and Lucifer. These are named in the compass source and must be reconciled against the owner's definitions before assigning them to a record layer.
- **The three-entry DESCENT array** — Narcissism, Machiavellianism, and Psychopathy. The array's current `kind` values conflict with the owner's correction for Psychopathy and cannot serve as the authoritative super-complex list.

## Required reconciliation action

Search the full Mechanics of Being source and ATÜNED source HTML / codex, not only `DESCENT`, for the owner-defined super-complex list and the eight complexes recalled by the owner. Extract the actual names and definitions, preserve exact source locators, and compare them against all four candidate families above. Record each candidate as confirmed layer member, confirmed other layer, duplicate/alias, or unresolved, with an explicit reason. Until this is done:

- canonical super-complex count = **UNVERIFIED**;
- Psychopathy as a super-complex = **REJECTED BY OWNER / NOT CANON**;
- the nine-circle taxonomy, six-state cascade, four blueprint patterns, and eight mirror pairs remain distinct source families, not interchangeable counts;
- do not start super-complex content generation from the current `DESCENT` tag.

## Source review note

The current repository has a large root `source.html` and a separate `MOB-Manuscript` repository referenced by the source register. The GitHub connector did not return usable body text for the large root HTML, and the manuscript README path was inaccessible. This is a retrieval gap, not evidence that those sources lack the taxonomy. The next pass must recover those source files through the project file/source mechanism or an accessible repository path before closing the inventory.
