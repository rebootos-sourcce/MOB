# ATUNED — Hero's Journey Board + CQ-Driven Living Avatar
**Owner direction:** 2026-10-26
**Status:** Canonical creative and integration direction; **not** a claim of completed runtime wiring.
**Branch:** `atunED/teachers-poles-ascent-alpha-2026-10-25`
**Vocabulary:** **Hero's Journey Board**. Avoid calling this a “gameboard” in UI, product copy, and new documents. Historical file paths (`docs/data/compass/gameboard/v1/`, `game:...`) remain stable until an explicit alias/migration avoids broken references.

## 1. Locked owner rules (supersede incompatible earlier assumptions)

1. **The avatar is the living representation of the person and the center of the product.**
2. **Avatar position on the Compass is determined by CQ.** CQ is the numeric coordinate (0–100) in ATUNED's model, not a separate game-score, story-count score, or an avatar level inferred independently.
3. **Avatar evolution is represented by two authoritative measures:** number of unique releases completed and movement of CQ over time. Preserve CQ chronology and original starting point. Release work can move laws and CQ; new integrity responses/journal evidence can also revise the modeled CQ. Avoid portraying completion of a ritual as an automatic CQ increase unless the accepted CQ engine says so.
4. **The Descent connects imprints/archetype signatures to the Release protocol.** Story → imprints → limiting/defensive pattern → candidate relevant archetype/realm → user confirmation → release action.
5. **Purgatorio is the oscillation / release-and-reframe layer.** The seven deadly sins and their constructive polar responses describe patterns that pull a person between inconsistent actions. Connect seven terrace pairs directly to release and reframe. The owner-associated midband is 40–60; display it as model geometry, not as clinical diagnosis or a mandatory level assignment.
6. **The Ascent connects constructive archetypes and moral qualities to the Ritual Builder.** An opposite action, reframe, or chosen affirmation becomes a scheduled daily practice, with a recorded practice history.
7. **The 21 moral-integrity laws are the central behavioral measuring system.** Story evidence identifies which law or behavior may be misaligned. Example: justifying wrongdoing ↔ accountability; deception/withheld truth ↔ truth and transparency. The app asks why the person felt unsafe, rather than assigning bad identity or presumed intent.
8. **Hero's Journey Board scenes are locations for learning, releasing, practicing and reflecting.** CQ positions the avatar. Levels and archetypes describe relevant challenges and learning opportunities, not a separately scored unlock ladder.

### Illustrative end-to-end user example (Truth)
- Situation: someone asks for an honest answer, and the user fears disapproval or consequences.
- Diagnostic: report Behavior / Pressure / Mechanism separately, each 0–10; distinguish danger/coercion from ordinary social discomfort.
- Journal: record a specific instance of withholding truth, with user confirmation of what happened and why.
- Descent: show the relevant defensive mechanism/imprint and likely shadow behavior *as a hypothesis*, not a label about the person.
- Purgatorio: perform the selected release/reframe for the pattern causing fear.
- Ascent: the Ritual Builder offers an owner-chosen daily affirmation, for example **“I tell absolute truth in all matters.”** User edits/accepts the practice and repeats it each morning.
- Integrity: the existing engine's release accounting can affect the law reading and CQ; later law self-reports and accepted evidence can refine it. Repeating an affirmation alone must not be silently interpreted as proof of behavioral change.
- Avatar: updated CQ position + unique-release count + CQ movement history; active law, shadow mechanism and constructive ritual remain visible.

## 2. Present system — source-code verified, as of 2026-10-26

| Feature | Implementation found | What still needs work |
|---|---|---|
| Canonical 21 laws, band affiliations | `atuned_src/engine/data/canon.js` | Unify Core 10 funnel + remaining 11 diagnostic responses and journal provenance |
| Canonical current CQ | `atuned_src/engine/compute.js`, `CQ_MODEL=2`, `cqSum` | Settle the proposed Model-3 discrepancy before *changing* formula; do not introduce a rival calculator |
| Release-driven law movement | `compute.js:lawNow`, `releaseWork`, `p.work` | Make before/after and provenance explicit in avatar; test once-only lift, reset/retest, no double counting |
| Releases and unique patterns | `atuned_src/ui/release.js`; `p.meter.unique` in schema | Join selected Board encounter and confirmed imprints to an actionable protocol |
| Imprints and user stories | `atuned_src/ui/imprints.js`; `atuned_src/engine/trace.js` | Reciprocal story→mechanism→law→Descent→release links, preserving inferred vs confirmed |
| Existing Ritual Builder | `atuned_src/ui/ritual.js` and `engine/data/teachers_recipes.js` | Real Ascent record→stable ritual ID→editable daily affirmation→history joins |
| Current avatar | `atuned_src/engine/avatar.js`, `atuned_src/ui/avatarui.js` | Position read from CQ; releases total; baseline/delta/history; Board scene correspondence |
| Avatar content | Identity name/title/description; becoming/not-becoming pairs; tags; 12-archetype rating; 7-seat ring; story/release/ritual controls | An integrated CQ central read, current Compass location, transformation timeline, law→archetype→practice presentation |
| Existing profile history | `atuned_src/engine/schema.js:snapshot` stores CQ model version and lawNow; account has release keys | Consistent present/first/previous CQ and unique release-event history; migration and end-to-end persistence tests |
| Legacy avatar “rise” prototype | `DESIGN-avatar.md`, `proto/avatar/rise.js` | Separately specified modeled channel visualization, not a replacement for CQ as avatar coordinate |
| Hero's Journey Board | `docs/data/compass/gameboard/v1/GAMEBOARD_MAP_V1.json`: 9 Inferno + 7 Purgatorio + 10 Paradiso = 26; 25 navigation edges | 26/26 releaseProtocolId and becomingRitualId currently **null**; no verified consuming runtime |
| Psyche/Blueprint/Archetype deep graph | Separate `atuned/deep-psyche-end-to-end-2026-10-26` branch claims 149 structured reciprocal records and knowledge-app adapter | Integrate branches, run CI, verify crosswalk into Hero's Journey Board and avatar. Do not confuse data registry links with live paths |

**Important formula limitation:** Current `cqSum()` sums answered 21-law values over denominator 210, with unanswered laws as zero. Therefore a person who answered only the Core 10 does **not** have a fully determined position by the full 21-law assessment. Show a **provisional Core-10 reading** (and optional model range/answer coverage) until the full 21 is completed; do not display undercounted CQ as a precise moral coordinate. For complete/eligible readings, the numeric CQ is the authoritative avatar position.

## 3. Hero's Journey Board — level record completion contract

Every level is one linked, versioned content record, with:
- **Location:** stable ID, realm, depth/sequence, 40–60 oscillation relationship where applicable, region label and graphic/animation coordinates.
- **Meaning:** recognizable lived-life challenge and plain-language story, no abstract accusation.
- **Shadow behavior:** directly observable act; relevant imprint/fetter, trigger, anticipated loss, defensive habit, linked character/archetype.
- **Constructive pole:** a corresponding moral-integrity law, constructive archetype, affirmative truth, and specific behavior to practice.
- **Knowledge:** what the pattern does and why it matters; safely disconfirming counterexample; explanation of coherence drag/repair within the ATUNED model.
- **Descent protocol:** confirmed imprint/fetter IDs and actual `releaseProtocolId`; exact 3C or selected supported release script/action.
- **Purgatorio passage:** terrace/polarity ID, two-direction oscillation examples and reflective question, release/reframe action.
- **Ascent ritual:** actual `becomingRitualId` pointing to the existing builder, user-editable affirmation, cadence and target law.
- **Avatar presentation:** current CQ numeric coordinate, starting coordinate, movement timeline, unique releases, relevant bands, selected active work, and theme feedback — all from data, not hardcoded per scene.
- **User interactions:** inspect, journal, user confirm/reject, release, edit ritual, mark practice, review; reversible navigation, no forced linear rank.
- **Proof & safety:** model vs user-reported vs observed event tags; guardrails when disclosure is unsafe; no invented psychological certainty.
- **Testing:** resolvable IDs in both directions; representative integration fixture and count-based test.

Retain scene narrative and external source provenance. Don't rewrite existing 26 scenes merely to change language. Build a migration from historical JSON keys/file paths with explicit tests.

## 4. End-to-end state and event ownership

```text
Journal story or diagnosis
  -> confirmed / candidate imprint (Trace; inferred status preserved)
  -> relevant law + archetype + Descent encounter
  -> release selected and completed (Release engine; unique keys)
  -> existing releaseWork(...) (updates p.work and the readout of a law)
  -> canonical CQ recompute (model-version stamped; no second formula)
  -> selected constructive opposite + ritual (Ritual Builder)
  -> optional daily affirmation + practice log (do not silently change CQ)
  -> new self-report / consented journal evidence (law updates when accepted)
  -> canonical CQ recompute
  -> Avatar render: position=CQ, evolution=(unique releases, CQ delta/history)
  -> Hero's Journey Board mirrors this position and links into appropriate encounters
```

### Suggested event envelope (future implementation; not a new runtime API yet)
`{id, at, profileId, type, lawIds[], imprintIds[], archetypeIds[], sceneId, protocolId?, ritualId?, releaseKeys[], cqModel, cqBefore?, cqAfter?, userConfirmed, source, contextStatus}`

- Event IDs stable and idempotent; count unique completed release keys, not page visits or replayed audio lines.
- Compute current CQ once from canonical engine and store model-versioned history snapshots; use reported differences to draw movement, not an independently maintained avatar score.
- Negative CQ delta is visible honestly; release milestones are never revoked by an unrelated rating change.
- A confirmed story can nominate a law or pattern but does not secretly change a law score absent a defined user-consented correction path.
- Evidence tags describe provenance; **they do not create an independent behavioral-evidence slider that moves the avatar contrary to CQ**.

## 5. Interpretive realm structure (owner thinking, not yet a new scored canon)

- **Inferno / downward Compass:** darker, heavier, contracted patterns and defensive actions; owner-associated *tamasic* metaphor.
- **Limbo / oscillating middle:** activation, striving, ebb-and-flow; owner-associated *rajasic* metaphor.
- **Paradiso / upward Compass:** constructive qualities and aligned expression; owner-associated *sattvic* metaphor.
- **Purgatorio:** the actual **seven-polarity practice/release structure** in the middle, rather than another value of CQ independent of the model.

**Taxonomy collision to resolve:** the existing `atuned_src/engine/data/compass.js` calls *Limbo* Inferno circle 1. Purgatorio records also have entry/exit boundaries. The middle-range Limbo metaphor and Inferno-C1 source name must be displayed without accidentally treating them as identical coordinates. The three-guna comparison is an exploratory interpretive analogy, not a numerical rule or a claim of physiological testing. It can remain out of the first release.

## 6. Completion gates, ordered

| Block | Required closure | State at review |
|---|---|---|
| A. Canonical joining | Merge the latest Psyche & Compass work; reconcile all stable law/archetype/scene IDs | OPEN, separate branches |
| B. Descent → Imprints → Release | Whole path from story evidence to safe optional release; each required scene resolves a protocol | OPEN, independent parts exist |
| C. Purgatorio | All seven pairs have concrete dual behaviors, triggers, reframe and supported releases, with readable oscillation | RESEARCH COMPLETE, runtime seam OPEN |
| D. Ascent → Ritual Builder | Paradiso/constructive actions to supported editable daily practices and affirmations, stored with IDs | OPEN, starter recipes exist |
| E. CQ ownership | Adopt one full-measurement CQ formula, provisional Core-10 behavior, versions and law updates | PARTIAL; CQ model 2 currently active |
| F. Living Avatar | Read CQ as coordinate; show baseline, movement, release milestones and relevant arc with history | PARTIAL, major progression integration missing |
| G. 26 Board encounters | Complete required record fields, reciprocal joins, view and test 26 scenes | 26 RECORDS, no runtime linkage |
| H. Full validation | test story → imprint → release → CQ → ritual → journal → CQ → avatar; save/reload and regression | NOT VERIFIED |

### Recommended first vertical slice

**Truth / Transparency**: a user-supplied case of bending truth to feel safe → confirm relevant imprint → release defensive belief → compute updated law and CQ (if measured) → choose a daily truth affirmation and practice → record later lived evidence → reassess law when authorized → show avatar's current CQ coordinate and accumulated unique releases. Confirm the same state is restored after a browser refresh and export/import. Use this slice as a reusable join template for the other laws and 26 encounters.

### Owner decisions already answered
- The object is a **Hero's Journey Board**, not a generic gameboard.
- CQ, **not** an independent evidence score, moves the avatar.
- Releases and CQ movement are how avatar evolution is represented.
- Descent is the release-side path via imprints.
- Ascent is the ritual-side path via constructive behavior.
- Purgatorio is seven-sin oscillation and release/reframe work.
- Avatar remains the center and reflects both phases.

**Open engineering acceptance questions:** exact provisional Core-10 presentation without false CQ precision; authoritative CQ model version; mapping laws and imprints to the 26 existing scene identities; what constitutes a unique release versus repeated affirmation; and compatibility/migration from old map identifiers. These are implementation contracts, not invitations to reopen settled creative decisions.
