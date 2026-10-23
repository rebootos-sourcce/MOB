# ATÜNED Deep-Psychological Registry — Recursive Audit Block 1–2

**Audit date:** 2026-10-22  
**Registry:** [ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json](data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json)  
**Registry blob:** `0e08a2ab98cef7f4ac925d3322793627f6a5be31`  
**Template catalog blob:** `ea76c12766f29f9a51a6ccefface85d3b3437e52`  
**Status:** Static inventory and template-field audit executed. This is not canonical approval or runtime closure.

## Execution strategy

Eight execution blocks, repeated across four recursive rounds. The estimate expands if new records, aliases, or edges are discovered.

1. Inventory and identity integrity.
2. Template/schema and required-content audit.
3. Source recovery and canonical taxonomy reconciliation.
4. Forward graph traversal.
5. Reverse traversal and reciprocal-edge audit.
6. Adapter, generator/validator integration, and runtime tests.
7. Source-backed repairs and synchronized documentation.
8. Independent fresh-fetch regression and closure review.

**Round 1 has completed the static inventory and type-specific template-field audit.** Rounds 2–4 are not represented as complete; source, graph, runtime and regression gates remain open.

## Aggregate measurements

- Records parsed: **125**; unique IDs: **125**.
- Template assignments: **125/125**.
- Non-empty source-reference arrays: **125/125**.
- Exact duplicate `def`/`body` pairs: **88**. Duplication is a review flag, not automatically a failure for every record type.
- Records with missing fields from their assigned template: **103**.
- Dangling references in scanned parent/child/influence/effect/link fields: **0**.
- Runtime status: {"not_yet_wired":125}.

### By record family

| Record type | Count |
|---|---:|
| psychological_root | 4 |
| behavioral_domain | 15 |
| archetype_candidate | 18 |
| conscious_domain | 8 |
| conscious_figure_mapping | 12 |
| mapping_record | 36 |
| blueprint_domain_slot | 14 |
| canonical_domain_candidate | 18 |

### Template content status

| Status | Count |
|---|---:|
| complete | 102 |
| provisional_content_populated | 15 |
| source_extracted_cross_record_review_pending | 8 |

### Research pass state

| Measure | Count |
|---|---:|
| pass1complete | 125 |
| pass2complete | 103 |
| pass3complete | 88 |
| all3complete | 88 |

Interpretation: a pass marked complete is a metadata state, not independent proof. Every pass must be source-distinct and document findings, conflicts and limitations. Do not use the count as a substitute for evidence review.

## Record-by-record matrix

| ID | Type | Name | Template content status | Missing template fields | Pass 1/2/3 | Parent | Children | Links | Source refs | Runtime |
|---|---|---|---|---|---|---|---:|---:|---:|---|
| `root:architect` | psychological_root | Architect (Order) | complete | None detected | 1:complete, 2:complete, 3:complete | — | 5 | 5 | 2 | not_yet_wired |
| `root:engine` | psychological_root | Engine (Dynamics) | complete | None detected | 1:complete, 2:complete, 3:complete | — | 5 | 5 | 2 | not_yet_wired |
| `root:weaver` | psychological_root | Weaver (Connection) | complete | None detected | 1:complete, 2:complete, 3:complete | — | 4 | 4 | 2 | not_yet_wired |
| `root:witness` | psychological_root | Witness (Awareness) | complete | None detected | 1:complete, 2:complete, 3:complete | — | 4 | 4 | 2 | not_yet_wired |
| `domain:01` | behavioral_domain | Knowledge | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:02` | behavioral_domain | Communication and Exchange | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:03` | behavioral_domain | Directed Force | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:04` | behavioral_domain | Rulership and Order | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:05` | behavioral_domain | Creation and Manifestation | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:06` | behavioral_domain | Destruction and Transformation | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:07` | behavioral_domain | Love and Connection | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:08` | behavioral_domain | Healing and Restoration | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:09` | behavioral_domain | Sacrifice and Wisdom Through Descent | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:10` | behavioral_domain | Justice and Truth | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:11` | behavioral_domain | Trickster and Disruption | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:12` | behavioral_domain | Nature and Organic Intelligence | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:13` | behavioral_domain | Mystery and the Unseen | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:14` | behavioral_domain | Devotion and Right Action | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `domain:15` | behavioral_domain | Play and Creative Delight | provisional_content_populated | `links` | 1:complete, 2:complete, 3:in_progress | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:warrior` | archetype_candidate | Warrior | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:orphan` | archetype_candidate | Orphan | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:innocent` | archetype_candidate | Innocent | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:caregiver` | archetype_candidate | Caregiver | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:explorer` | archetype_candidate | Explorer | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:outlaw` | archetype_candidate | Outlaw | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:lover` | archetype_candidate | Lover | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:creator` | archetype_candidate | Creator | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:jester` | archetype_candidate | Jester | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:sage` | archetype_candidate | Sage | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:magician` | archetype_candidate | Magician | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:ruler` | archetype_candidate | Ruler | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:hero` | archetype_candidate | Hero | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:everyman` | archetype_candidate | Everyman | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:mentor` | archetype_candidate | Mentor | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:shadowarch` | archetype_candidate | Shadow | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:shapeshifter` | archetype_candidate | Shapeshifter | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `archetype:candidate:healer` | archetype_candidate | Healer | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `conscious-domain:01` | conscious_domain | Empyrean Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:02` | conscious_domain | Crown Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:03` | conscious_domain | Perception Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:04` | conscious_domain | Truth Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:05` | conscious_domain | Heart Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:06` | conscious_domain | Value Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:07` | conscious_domain | Royal Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-domain:08` | conscious_domain | Creative Consciousness | source_extracted_cross_record_review_pending | `affirmation`, `links` | 1:complete, 2:blocked, 3:in_progress | — | 0 | 0 | 2 | not_yet_wired |
| `conscious-figure:rama` | conscious_figure_mapping | Rama | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:krishna` | conscious_figure_mapping | Krishna | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:zoroaster` | conscious_figure_mapping | Zoroaster | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:akhenaten` | conscious_figure_mapping | Akhenaten | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:buddha` | conscious_figure_mapping | Buddha | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:confucius` | conscious_figure_mapping | Confucius | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:jesus` | conscious_figure_mapping | Jesus | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:rumi` | conscious_figure_mapping | Rumi | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:lao-tzu` | conscious_figure_mapping | Lao Tzu | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:moses` | conscious_figure_mapping | Moses | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:guru-nanak` | conscious_figure_mapping | Guru Nanak | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `conscious-figure:solomon` | conscious_figure_mapping | Solomon | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:warrior` | mapping_record | Warrior → Power | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:caregiver` | mapping_record | Caregiver → Healing | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:creator` | mapping_record | Creator → Creation | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:sage` | mapping_record | Sage → Knowledge | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:jester` | mapping_record | Jester → Play | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:lover` | mapping_record | Lover → Love | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:magician` | mapping_record | Magician → Mystery | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:innocent` | mapping_record | Innocent → Nature | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:outlaw` | mapping_record | Outlaw → Destruction | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:ruler` | mapping_record | Ruler → Architect | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:explorer` | mapping_record | Explorer → Nature | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:orphan` | mapping_record | Orphan → Guardian | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:hero` | mapping_record | Hero → Power | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:everyman` | mapping_record | Everyman → Communication | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:mentor` | mapping_record | Mentor → Knowledge | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:shadow` | mapping_record | Shadow → Death | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:shapeshifter` | mapping_record | Shapeshifter → Trickster | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:archdom:healer` | mapping_record | Healer → Healing | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 3 | not_yet_wired |
| `mapping:arch18:01` | mapping_record | Warrior → Controller @ solar | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:02` | mapping_record | Caregiver → Pleaser @ heart | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:03` | mapping_record | Creator → Stickler @ throat | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:04` | mapping_record | Sage → Hyper-Rational @ eye | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:05` | mapping_record | Jester → Restless @ sacral | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:06` | mapping_record | Lover → Hyper-Vigilant @ heart | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:07` | mapping_record | Magician → Victim @ eye | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:08` | mapping_record | Innocent → Restless @ root | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:09` | mapping_record | Outlaw → Judge @ solar | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:10` | mapping_record | Ruler → Hyper-Achiever @ crown | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:11` | mapping_record | Explorer → Restless @ sacral | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:12` | mapping_record | Orphan → Worrywart @ heart | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:13` | mapping_record | Hero → Hyper-Achiever @ solar | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:14` | mapping_record | Everyman → Pleaser @ heart | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:15` | mapping_record | Mentor → Stickler @ eye | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:16` | mapping_record | Shadow → Judge @ solar | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:17` | mapping_record | Shapeshifter → Restless @ sacral | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `mapping:arch18:18` | mapping_record | Healer → Hyper-Vigilant @ heart | complete | `links` | 1:complete, 2:complete, 3:complete | — | 0 | 0 | 4 | not_yet_wired |
| `blueprint-domain-slot:01` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_01 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:02` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_02 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:03` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_03 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:04` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_04 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:05` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_05 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:06` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_06 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:07` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_07 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:08` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_08 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:09` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_09 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:10` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_10 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:11` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_11 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:12` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_12 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:13` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_13 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `blueprint-domain-slot:14` | blueprint_domain_slot | UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_14 | complete | `links` | 1:complete, 2:blocked, 3:blocked | — | 0 | 0 | 1 | not_yet_wired |
| `canon-domain:architect:knowledge` | canonical_domain_candidate | Knowledge | complete | None detected | 1:complete, 2:complete, 3:complete | `root:architect` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:architect:justice` | canonical_domain_candidate | Justice | complete | None detected | 1:complete, 2:complete, 3:complete | `root:architect` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:architect:imperium` | canonical_domain_candidate | Imperium | complete | None detected | 1:complete, 2:complete, 3:complete | `root:architect` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:architect:duty` | canonical_domain_candidate | Duty | complete | None detected | 1:complete, 2:complete, 3:complete | `root:architect` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:architect:fate` | canonical_domain_candidate | Fate | complete | None detected | 1:complete, 2:complete, 3:complete | `root:architect` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:engine:power` | canonical_domain_candidate | Power | complete | None detected | 1:complete, 2:complete, 3:complete | `root:engine` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:engine:creation` | canonical_domain_candidate | Creation | complete | None detected | 1:complete, 2:complete, 3:complete | `root:engine` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:engine:dissolution` | canonical_domain_candidate | Dissolution | complete | None detected | 1:complete, 2:complete, 3:complete | `root:engine` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:engine:descent` | canonical_domain_candidate | Descent | complete | None detected | 1:complete, 2:complete, 3:complete | `root:engine` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:engine:death` | canonical_domain_candidate | Death | complete | None detected | 1:complete, 2:complete, 3:complete | `root:engine` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:weaver:connection` | canonical_domain_candidate | Connection | complete | None detected | 1:complete, 2:complete, 3:complete | `root:weaver` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:weaver:exchange` | canonical_domain_candidate | Exchange | complete | None detected | 1:complete, 2:complete, 3:complete | `root:weaver` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:weaver:restoration` | canonical_domain_candidate | Restoration | complete | None detected | 1:complete, 2:complete, 3:complete | `root:weaver` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:weaver:play` | canonical_domain_candidate | Play | complete | None detected | 1:complete, 2:complete, 3:complete | `root:weaver` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:witness:nature` | canonical_domain_candidate | Nature | complete | None detected | 1:complete, 2:complete, 3:complete | `root:witness` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:witness:trickster` | canonical_domain_candidate | Trickster | complete | None detected | 1:complete, 2:complete, 3:complete | `root:witness` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:witness:mystery` | canonical_domain_candidate | Mystery | complete | None detected | 1:complete, 2:complete, 3:complete | `root:witness` | 0 | 1 | 2 | not_yet_wired |
| `canon-domain:witness:guardian` | canonical_domain_candidate | Guardian | complete | None detected | 1:complete, 2:complete, 3:complete | `root:witness` | 0 | 1 | 2 | not_yet_wired |

## Required-content defects

- `domain:01` (Knowledge): links
- `domain:02` (Communication and Exchange): links
- `domain:03` (Directed Force): links
- `domain:04` (Rulership and Order): links
- `domain:05` (Creation and Manifestation): links
- `domain:06` (Destruction and Transformation): links
- `domain:07` (Love and Connection): links
- `domain:08` (Healing and Restoration): links
- `domain:09` (Sacrifice and Wisdom Through Descent): links
- `domain:10` (Justice and Truth): links
- `domain:11` (Trickster and Disruption): links
- `domain:12` (Nature and Organic Intelligence): links
- `domain:13` (Mystery and the Unseen): links
- `domain:14` (Devotion and Right Action): links
- `domain:15` (Play and Creative Delight): links
- `archetype:candidate:warrior` (Warrior): links
- `archetype:candidate:orphan` (Orphan): links
- `archetype:candidate:innocent` (Innocent): links
- `archetype:candidate:caregiver` (Caregiver): links
- `archetype:candidate:explorer` (Explorer): links
- `archetype:candidate:outlaw` (Outlaw): links
- `archetype:candidate:lover` (Lover): links
- `archetype:candidate:creator` (Creator): links
- `archetype:candidate:jester` (Jester): links
- `archetype:candidate:sage` (Sage): links
- `archetype:candidate:magician` (Magician): links
- `archetype:candidate:ruler` (Ruler): links
- `archetype:candidate:hero` (Hero): links
- `archetype:candidate:everyman` (Everyman): links
- `archetype:candidate:mentor` (Mentor): links
- `archetype:candidate:shadowarch` (Shadow): links
- `archetype:candidate:shapeshifter` (Shapeshifter): links
- `archetype:candidate:healer` (Healer): links
- `conscious-domain:01` (Empyrean Consciousness): affirmation, links
- `conscious-domain:02` (Crown Consciousness): affirmation, links
- `conscious-domain:03` (Perception Consciousness): affirmation, links
- `conscious-domain:04` (Truth Consciousness): affirmation, links
- `conscious-domain:05` (Heart Consciousness): affirmation, links
- `conscious-domain:06` (Value Consciousness): affirmation, links
- `conscious-domain:07` (Royal Consciousness): affirmation, links
- `conscious-domain:08` (Creative Consciousness): affirmation, links
- `conscious-figure:rama` (Rama): links
- `conscious-figure:krishna` (Krishna): links
- `conscious-figure:zoroaster` (Zoroaster): links
- `conscious-figure:akhenaten` (Akhenaten): links
- `conscious-figure:buddha` (Buddha): links
- `conscious-figure:confucius` (Confucius): links
- `conscious-figure:jesus` (Jesus): links
- `conscious-figure:rumi` (Rumi): links
- `conscious-figure:lao-tzu` (Lao Tzu): links
- `conscious-figure:moses` (Moses): links
- `conscious-figure:guru-nanak` (Guru Nanak): links
- `conscious-figure:solomon` (Solomon): links
- `mapping:archdom:warrior` (Warrior → Power): links
- `mapping:archdom:caregiver` (Caregiver → Healing): links
- `mapping:archdom:creator` (Creator → Creation): links
- `mapping:archdom:sage` (Sage → Knowledge): links
- `mapping:archdom:jester` (Jester → Play): links
- `mapping:archdom:lover` (Lover → Love): links
- `mapping:archdom:magician` (Magician → Mystery): links
- `mapping:archdom:innocent` (Innocent → Nature): links
- `mapping:archdom:outlaw` (Outlaw → Destruction): links
- `mapping:archdom:ruler` (Ruler → Architect): links
- `mapping:archdom:explorer` (Explorer → Nature): links
- `mapping:archdom:orphan` (Orphan → Guardian): links
- `mapping:archdom:hero` (Hero → Power): links
- `mapping:archdom:everyman` (Everyman → Communication): links
- `mapping:archdom:mentor` (Mentor → Knowledge): links
- `mapping:archdom:shadow` (Shadow → Death): links
- `mapping:archdom:shapeshifter` (Shapeshifter → Trickster): links
- `mapping:archdom:healer` (Healer → Healing): links
- `mapping:arch18:01` (Warrior → Controller @ solar): links
- `mapping:arch18:02` (Caregiver → Pleaser @ heart): links
- `mapping:arch18:03` (Creator → Stickler @ throat): links
- `mapping:arch18:04` (Sage → Hyper-Rational @ eye): links
- `mapping:arch18:05` (Jester → Restless @ sacral): links
- `mapping:arch18:06` (Lover → Hyper-Vigilant @ heart): links
- `mapping:arch18:07` (Magician → Victim @ eye): links
- `mapping:arch18:08` (Innocent → Restless @ root): links
- `mapping:arch18:09` (Outlaw → Judge @ solar): links
- `mapping:arch18:10` (Ruler → Hyper-Achiever @ crown): links
- `mapping:arch18:11` (Explorer → Restless @ sacral): links
- `mapping:arch18:12` (Orphan → Worrywart @ heart): links
- `mapping:arch18:13` (Hero → Hyper-Achiever @ solar): links
- `mapping:arch18:14` (Everyman → Pleaser @ heart): links
- `mapping:arch18:15` (Mentor → Stickler @ eye): links
- `mapping:arch18:16` (Shadow → Judge @ solar): links
- `mapping:arch18:17` (Shapeshifter → Restless @ sacral): links
- `mapping:arch18:18` (Healer → Hyper-Vigilant @ heart): links
- `blueprint-domain-slot:01` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_01): links
- `blueprint-domain-slot:02` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_02): links
- `blueprint-domain-slot:03` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_03): links
- `blueprint-domain-slot:04` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_04): links
- `blueprint-domain-slot:05` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_05): links
- `blueprint-domain-slot:06` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_06): links
- `blueprint-domain-slot:07` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_07): links
- `blueprint-domain-slot:08` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_08): links
- `blueprint-domain-slot:09` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_09): links
- `blueprint-domain-slot:10` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_10): links
- `blueprint-domain-slot:11` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_11): links
- `blueprint-domain-slot:12` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_12): links
- `blueprint-domain-slot:13` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_13): links
- `blueprint-domain-slot:14` (UNRESOLVED_BLUEPRINT_DOMAIN_SLOT_14): links

## Open semantic and source gates

- 15 behavioral-domain records remain provisional and require primary-source reconciliation; populated prose alone does not establish source-backed definitions.
- Eight Conscious Domain records remain in cross-record review; affirmations and canonical wording must be source-confirmed, not inferred from sequence.
- Fourteen Blueprint visualization slots are placeholders only. They must not be treated as canonical domain entities.
- The 18/15/14 historical counts and the v341 19-item roster remain a source discrepancy requiring explicit reconciliation. Do not force a mapping or silently change a denominator.
- Archetype candidates and mapping rows retain unresolved taxonomy identity/semantics; source-table membership does not prove canonical hierarchy or causal edge.
- Registry templates are proposed and are not yet integrated with the engine. The adapter currently emits a separate typed registry rather than wiring records into the experiential Nerve-to-Super-Complex graph.
- Opposites are intentionally excluded from this work per the user's instruction.

## Next recursive actions

1. Complete Block 3 by auditing source locations and contradiction handling for the 23 priority records and the 14 unresolved visualization slots.
2. Complete Blocks 4–5 with an ID-level forward/reverse walk over every declared and proposed relationship; test reciprocal requirements only where the relationship contract requires them.
3. Complete Block 6 by executing the adapter and repository validator in a real Node environment; preserve command, output, exit status and commit SHA. A static GitHub fetch is not execution.
4. Complete Block 7 by repairing only source-backed defects, maintaining provisional/unresolved states where evidence is missing, and synchronizing TDD, registry, source crosswalk, ledger and execution log.
5. Complete Block 8 with a fresh fetch and regression pass. Repeat affected blocks until no new gaps or regressions appear. Do not claim closure while any acceptance gate remains open.

## Audit boundaries

This report verifies the current registry's inventory and mechanically inspects assigned template fields, source-ref presence, research status, basic references and runtime metadata. It does not claim that all content is true, all three research passes are genuinely independent, every edge is semantically approved, the adapter runs, or runtime traversal succeeds.
