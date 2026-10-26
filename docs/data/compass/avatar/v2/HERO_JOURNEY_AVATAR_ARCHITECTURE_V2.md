# ATUNED — Living Avatar Architecture v2.0
**Artifact:** Architectural handoff for the Hero's Journey Board and CQ-based living avatar  
**Date:** 2026-10-26  
**Status:** **ARCHITECTURE SPECIFICATION COMPLETE. APPLICATION INTEGRATION NOT COMPLETE.**  
**Canonical code inspected:** repository `rebootos-sourcce/MOB` `main` at `a682ceaae68e1a2575d8fa1289f8b6c0ce3ee441`.  
**Content inspected:** `atunED/teachers-poles-ascent-alpha-2026-10-25` at `5964ac4a417a45196a8daf8fafffdbc957974042`.  
**Deep Psyche integration:** `atuned/deep-psyche-end-to-end-2026-10-26` currently separate; never claim merged.  
**Change authorization:** Documentation, versioned architecture contracts, and analysis only. No `atuned_src` or live funnel code changed.

## 1. Owner decisions — FINAL

1. **The avatar changes in TWO ways:** its visual form evolves **and** it moves on the Hero's Journey Board. Preserve the current avatar identity and becoming architecture.
2. **CQ alone determines the numeric Compass position.** The approved bands are **Inferno 0–40, Purgatorio 40–60, Paradiso 60–100**. Apply boundary convention `[0,40), [40,60), [60,100]` so every value has exactly one home. 40 is Purgatorio; 60 is Paradiso.
3. **Unique successfully completed release patterns are the milestone count.** Rerunning an already-opened pattern does not count again. Differentiate release from reframe keys in the current shared meter.
4. **Ritual practice is logged, not scored into CQ.** Integrity changes come from canonical release accounting and approved evidence/reassessment. A spoken affirmation alone never triggers CQ movement.

**Vocabulary:** *Hero's Journey Board*, never “gameboard” in new UI copy. Existing file paths and IDs containing `gameboard`/`game:` are stable database identities and MUST NOT be renamed for copy preference alone.

## 2. Real existing software — verified execution boundaries

| System | Real owner/path | Current result | Missing join |
|---|---|---|---|
| Journal | `ui/storyui.js:stCommit` | Saves story text; `applyStory` applies imprints to working field; story stamp allows release attribution | Ensure story→law→scene link exists with provenance |
| Sniffer | `engine/sniff.js:parseStory/sniffStory` | Hits, denied/other-person context, candidate imprints, charge axes, saboteurs, laws, depth and suggested release offer; `sniffStory` is read-only | Match extracted candidate to canonical 21 laws + behavioral archetypes; no unconfirmed diagnosis |
| Imprints | `ui/imprints.js:impGhosts/impIndex` | Pending imprint display, held address registry; named vs inferred | Descent scene references and confirmed user selection |
| Release | `ui/release.js:relPick/relCoolDown` | Four blocks left/right release+reframe; emits earned keys, `meterRun`, `releaseWork`, `pSaveSnap`; results show CQ before/after | Hero's Journey scene→real address/protocol join |
| CQ | `engine/compute.js:lawNow/cqSum/cqSpan/releaseWork` | Version 2; laws over 210; release lift only for newly written ground; same-law reassessment resets lift | Valid Core10->21 diagnostic contract, no parallel calculators |
| Ritual | `ui/ritual.js:ritFor/ritStartPlan/ritLog/ritRelDone`; `ui/ritstage.js` | Suggestions from current field, existing avatar pairs and heaviest held addresses; saved plans, dated completions; a finished release marks linked ritual day | Paradiso law/virtue→specific editable affirmation/practice binding by stable ID; exportable plans |
| Avatar | `engine/avatar.js:avatarBlank/avatarGap/avatarProgress`, `ui/avatarui.js:avState/avRing/renderAvatar` | Seven seat rings; be/not-be pair model; archetype ratings; running patterns; rituals, cycles and release buttons | CQ position, continuous evolving form, unique-release milestones, story→quest history |
| Compass | `ui/cone.js:coneMirSync/coneNeedle/coneRead` | Needle already tracks computed CQ; description waits for 21 laws before naming position | Single map-location projection shared by Compass and avatar |
| History | `engine/schema.js:snapshot/pSaveSnap/validateProfile` | Stamps model version, CQ, lawNow and other numeric readings; saves release with history atomically | First COMPLETE CQ baseline, derived current/before/after, milestone history and profile migration |
| Trace | `engine/trace.js:traceFromRecord` | Typed story→impression→pattern→protocol→release/reframe→ritual→practice-event graph | Add canonical law/archetype/scene join through approved extension; no second incompatible graph |

### Critical partial-input issue
Current `cqSum()` divides the sum of all 21 laws by 210 and treats unanswered laws as zero. The app's own `coneRead()` already refuses to name the position while `r.complete` is false. **Keep that guard in the avatar.** Show a provisional Core 10 self-report, answer coverage and possibly a numerical uncertainty interval, **not** a false full-CQ coordinate. After 21 measured laws, CQ becomes the authoritative coordinate.

### Existing source-policy discrepancy, not a reason to invent formula v3
`CQ_MODEL=2` in the live engine; the earlier proposed `(Integrity × Intention)/Resistance` model is not the shipped authority and schema explicitly refuses history stamped model 3. This architecture **reuses model 2** rather than changing the formula while building the avatar. A later owner-authorized CQ change needs its own model migration.

## 3. One vertical rule: the avatar represents two linked facts

**POSITION = CQ, 0–100.** A location is a read-only projection of the canonical computed CQ. Position can move up OR down immediately after a saved and lawful CQ update. Lower readings do not erase already completed work.

**EVOLUTION = visual form responding to CQ + earned unique release patterns.** The continuous CQ value is the primary movement/morph state; immutable release milestones supply material visual traces/earned marks. Do NOT turn ritual streak, DQ, story-count, avatarGap percentage, archetype rating, badge tier, or scene visits into competing numerical positions. They can appear as contextual overlays.

**The avatar's visual form and its location are synchronized projections of the same CQ**. Its body/ring still displays seven seats and the user's own values/pairs. Form must meaningfully change as CQ changes in either direction. The **unique release milestone layer persists** through ordinary CQ decreases, since already completed work is not erased by a new measurement.

**Existing avatar's seven-seat rings, user-declared identity, becoming pairs, archetype circle, written tags, running saboteurs, daily rules, rituals and cycles are PRESERVED.** They move into a cohesive hub, not a new disconnected avatar subsystem. Keep accessibility output that tells the same truth without particle effects.

## 4. CQ realm location and 26 narrative waypoints

See `CQ_POSITION_26_SCENE_MAP_V1.json` for the exact deterministic function and 26 source-linked stages.

- Inferno: `0 ≤ CQ < 40`; positions ascend **L09 → L01** (deepest to nearest exit).
- Purgatorio: `40 ≤ CQ < 60`; positions ascend **P01 → P07** across the seven terraces.
- Paradiso: `60 ≤ CQ ≤ 100`; positions ascend **PD01 → PD10**.

**Exact waypoints are a proposed even subdivision inside owner-approved realm bounds**, not independently owner-approved metaphysical thresholds or population-validated norms. Use source-order as the stable tie-breaker and store no second `avatarLevelScore`. A user at CQ 76 appears at PD05 under this technical default; CQ 40 appears at P01; CQ 60 at PD01.

**Two graphs are not interchangeable:** existing scene `edges` describe narrative descent L01→L09 followed by P01→P07 and PD01→PD10. An increasing CQ must travel *opposite* that direction within Inferno. Keep narrative navigation freely explorable; derive ascending numerical location with the reversed Inferno lookup. Existing `circleAt()` historically uses a 41-point boundary and must be reconciled later with the owner's 40/60 model; do not silently let it own the new display.

**Active challenge is a separate pointer:** a person standing at PD05 can choose to release a Fraud-pattern imprint recorded in Inferno without teleporting to Inferno or being assigned the identity of that shadow archetype. The CQ projection is their position; the chosen scene is their current work.

## 5. Behavior → release → ritual → CQ → avatar, using original writers

```text
Core 10 assessment (30 responses) -> complete the remaining 11 laws (33)
       |                              \
  3-channel evidence                 validated 21-law law readings
       |                              -> CQ read of existing canonical engine
Journal story -> parseStory/sniffStory (read-only candidate evidence)
       |              |        + -> confidence/source/subject guards (nobody else scored)
       V
User confirms real trigger / imprint / defensive behavior and affected law
       |
Hero's Journey Board: Descent encounter -> confirmed imprint/address -> relPick
       |
release run -> meterRun -> new persisted release keys -> releaseWork
       |                                   |
       + -> release/reframe result          + -> current CQ recomputed
       |                                           |
       V                                           V
Purgatorio vice→virtue reflection         Avatar position + visual form
       |
Ascent virtue, integrity law, constructive action -> Ritual Builder (existing writer)
       |
User-selected/editable affirmation + daily schedule -> ritual completion log
       |
Future observed behavior or user-approved journal evidence -> canonical LAW reassessment
       |
same canonical CQ, history and avatar location updated
```

Example: *avoidance of truth due to fear of rejection* → journal names context → sniffer nominates a corresponding imprint and law with a reason → the person confirms/rejects → targeted safe release for that address → candidate affirmation **“I tell absolute truth in all matters.”** is offered and user-edited if needed → one daily practice entry on Ritual calendar → a later concrete example/reassessment can revise truth. The release already supplies a modeled law lift when new eligible lines are opened. The affirmation does NOT silently supply an additional lift.

**Not every discouraging story proves deception**. Unsafe disclosure and appropriate privacy are valid contexts. If the user disagrees with a root cause, the system never writes it as a fact.

## 6. Release-count contract — important discrepancy with current app

`meter.unique` currently stores **all four channel types** per addressed statement: `Llimit`, `Rlimit`, `Ltruth`, `Rtruth`. It is the correct authoritative writer for paid/earned ground. But `meter.unique.length` is the number of all NEW KEYS, including installation/reframe keys.

To honor **“unique completed release patterns”**, the avatar must **derive** its release milestone count from successfully persisted `Llimit` and `Rlimit` keys *only*. Separately show unique truth/reframe installation keys when useful; never double-count them as released patterns. `Llimit`/ `Rlimit` are each individual release-pattern/channel keys according to the existing engine definition. A unique key is a line at an address, **not automatically an entire distinct psycho-social complex or whole-imprint resolution**.

An in-progress or unsaved release counts as nothing. On a run ended early, the existing release engine only writes the keys actually reached; each reached and persisted unique release-side key counts once. Re-runs of already-opened keys add zero milestones and zero modeled lift. Do not alter billing or `meter.unique` storage semantics.

**If the creator later wants to count unique whole-imprint identities instead of line keys, that is a different, versioned metric and must not silently replace this one.**

## 7. Profile, migration and records

- The current `blankProfile` provides `avatar`, `laws`, `work`, `meter`, `story`, `rituals`, `history`, and `trace`. Avatar context is **derived** from those existing facts where possible.
- `p.history` has CQ and model stamps; `pSaveSnap` stages release + history atomically. Only compare `m=CQ_MODEL` rows whose readings are complete; the existing history rows may not store `answeredCount`. Introduce a validated, additive `coverage`/completeness field or derive it reliably from `lawNow` in new rows. Never backfill unknown completeness as complete.
- Establish an unchanging first *complete* CQ reading (date, CQ model) as avatar baseline; zero **can be** a valid CQ if all laws are truly measured at zero. An empty profile has no baseline.
- For older valid profiles with complete laws but no baseline stamp, derive the earliest auditable complete same-model history row. If none, stamp first complete modern render as *new baseline*, explicitly noting historical baseline unavailable. No invented lost progress.
- New persisted `avatar` fields require `avatarFill` and `validateProfile` changes in the **same future runtime PR**; an unchecked added key would be silently removed on import. Do not store derived `stageId` as a second truth.
- The current Ritual Builder's active plans (and some suggestion states) live **beside** the profile in per-browser storage and do not roundtrip with `pExport`. Before cross-device progression is called complete, migrate plans into a versioned profile-owned store while retaining the existing ritual day writer and compatibility with older side keys. Preserve earned days.
- Existing profile release keys are authoritative once persisted. Events/logs are additive references to source IDs and timestamps, not a second release counter.
- Keep CQ model version on all trend rows; apparent jumps from formula upgrades are **not person movement**.

## 8. Living avatar layout (experience contract, not a final art mockup)

The avatar is the main visual and information hub:
1. **Center:** evolving visual form (standing character/seven-seat armature), with current CQ printed on its actual 0–100 scale when complete.
2. **Location marker:** positional location on the Hero's Journey Board; current realm/waypoint and continuous CQ mark visible without needing to guess from color.
3. **Travel line:** baseline CQ → now, changes over time, truthful up/down movement. Never make a decrease wipe out the completed releases.
4. **Release evidence:** unique release patterns count and earned marks around the avatar; optionally unique reframe/installed work separately labelled.
5. **Living psyche:** user's becoming/not-becoming pairs, seven-seat load, archetypes, sniffer-detected story patterns, with inferred/confirmed states.
6. **Action doors:** "Explore imprint", "Release pattern", "Build today's ritual", "Journal a real event", and "Review your integrity reading" point into **existing components**.
7. **Guidance:** Source AI/Virgil introduces possible context and asks permission; it never brands the avatar a demon/angel from one story.

Form art tokens can be driven by CQ and release milestone values, but exact costume, silhouette, materials, skin, particle, illumination and motion require separate owner visual approval. A text/nonanimated equivalent is mandatory. No simulation-derived percentage should be marketed as measured physiological Kundalini energy.

### Three independent readouts
- **CQ** = avatar location / model-relative coherence.
- **Unique releases** = earned work and its permanent visual record.
- **Practice / rituals** = daily repetition and chosen constructive action (unscored until appropriate integrity evidence is accepted).

## 9. State scenarios with precise expected output

| Trigger | CQ position | Avatar form | Release mark | Ritual status |
|---|---|---|---|---|
| Empty profile | Unknown (no realm label) | Editable neutral starting state | 0 | none |
| Only Core 10 answered | **Provisional; no full-CQ coordinate** | Neutral/provisional preview | count stored past releases if any | allowed |
| Full 21-lawn reading at CQ 39.9 | Inferno, stage L01 | CQ 39.9 morphology | current unique count | independent |
| Later CQ rises to 40 | Purgatorio P01 | smooth upward form transition | unchanged unless new release | independent |
| Later CQ rises to 60 | Paradiso PD01 | further visual evolution | immutable earned work | independent |
| CQ falls from 65 to 59 | Purgatorio P07 | reverses mutable CQ-dependent form | release milestones unchanged | independent |
| 2 new `Llimit`/ `Rlimit` keys persisted, 2 new `Ltruth`/ `Rtruth` keys | CQ moves only as `releaseWork` returns | recompute | **+2**, not +4 | linked ritual day only if eligible and saved |
| Identical rerun | same CQ absent unrelated reassessment | unchanged CQ portion | **+0** | ritual log can record completion under its rules |
| User checks off daily affirmation | same CQ | no synthetic CQ evolution | +0 | saved practice |
| User approves law reassessment | fresh canonical CQ, up or down | adjust form | +0 | existing history retained |

## 10. Work packages (integration order and acceptance)

1. **Merge and reconcile schemas**: Compass/Deep Psyche/Avatar feature branches; source law IDs and 26 scene IDs; restore CI green. No rename-driven breaking migrations. 
2. **Pure CQ projection**: read canonical CQ + completeness; derived realm/waypoint; no second calculator. Render 0, 39.999, 40, 59.999, 60, 100; correct Inferno reverse order.
3. **Avatar core projection**: render CQ, current realm, scene, permanent unique-release marks, baseline and same-model movement using existing `avatar.js` read state. Persist no duplicate score.
4. **Context routing**: journal/sniffer candidate→law/imprint/archetype→confirmed release→Purgatorio crosswalk→ascent practice; reuse `relPick`, `ritStartPlan` and typed trace. No unsupported user diagnosis.
5. **Ritual continuation**: choose daily affirmation based on accepted constructive opposite; user edits; log days without score inflation; export/import stable ritual plans.
6. **Visual evolution**: design art passes for avatar morphology, seven-seat ring integration and movement; reduced motion and screen reader alternative.
7. **Hero's Journey Board runtime**: connect all 26 scene contracts, knowledge, appropriate imprints, release IDs and ritual IDs; current CQ position versus independent selected quest.
8. **QA gate**: browser E2E, profile roundtrip/legacy migration, idempotent release, reversed-steps journey, answered coverage, accessibility, privacy, consent, story-causation honesty.

**Current known blockers:** 26 scene `releaseProtocolId` and `becomingRitualId` fields still null; separate Deep Psyche vs Compass branches; no complete 10→21 three-register migration; avatar has no authoritative CQ-centered evolution visual; ritual plans not portable; canonical stage function differs from older `circleAt`; no verified 26-scene production E2E.

## 11. Done means DONE

A user with **all 21 measured laws** sees the correct CQ position and evolving avatar. They write a story, accept the correct imprint link, run the real release, see *persisted unique release count and canonical CQ movement*, choose an editable affirmative ritual, log it, and later confirm an actual behavioral change. CQ can move either direction and the avatar follows exactly, while milestone marks remain. The user can refresh, export/import, and pick up the same path; the engine has no duplicate numbers. All 26 Hero's Journey Board locations and all associated archetypes route to resolvable research and action records with explicitly noted unavailable pathways. The end-to-end suite passes on browser/mobile.

**This is complete architecture, not a completed software build.** The attached JSONs capture deterministic mapping and canonical projection semantics; development and art passes remain.
