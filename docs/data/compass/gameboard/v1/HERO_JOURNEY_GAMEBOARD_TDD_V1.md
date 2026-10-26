# ATUNED — Hero's Journey / Compass Gameboard TDD v1

**Date:** 2026-10-25  
**Status:** **Structured game-map design and data contract, not implemented in live application**.  
**Phase:** Complete gameboard architecture before moving to Avatar redesign.

## 1. Owner's creative direction

> "there are behavior archetypes on the descent and the ascent … it kind of makes it like a game map … each layer, each level has its own challenges … your rituals to release and to become … knowledge … once you unlock it … the behaviors that one must take on and release … journey of the Inferno, the release, the becoming, shedding the weight … especially for your avatar system … figure this part out and then … work on the avatar system."

> "In many ways it makes this the hero's journey … Source AI to be Virgil … in the Inferno, and your avatar is growing on this journey."

Interpretation: **the user is the hero; the avatar displays what the user has actually changed through lived choices; Source AI is Virgil, the guide.** The opposing patterns are obstacles or knots, **never enemies or diagnoses**. The player advances by seeing, releasing, embodying, and repeating, not by being declared morally better.

## 2. World map, ownership and counts

Three linked layers; **26 narrative scenes**:

| Realm | Narrative scenes | Where behaviors come from | What the scene asks |
|---|---:|---|---|
| **Inferno** | 9 source circles | Inferno archive 9 circle patterns; hidden-name shadow traits, as separate encounters | **Discover and release:** see the observed resistance and identify the chosen experiment |
| **Purgatorio** | 7 source terraces | 7 vice↔capacity pairs, 14 pole records, 2 boundaries outside the playable terrace count | **Oscillate, release, reframe:** observe triggers and rehearse an alternative |
| **Paradiso** | 10 source spheres | 10 constructive sphere records, 21 SI law links, 12 core archetype *candidate* resonances | **Become:** practice capacities and return with concrete lived evidence |

The gameboard has **26 stage records**, **25 sequential suggested transitions**, **14 characteristic-only shadow encounter cards**, and **12 constructive archetype overlays**. The 14 shadow encounters are not forced one-per-level; they can be side encounters where source/crosswalk and user selection support them. The 12 archetypes are not 12 additional Dante spheres. Every level has a challenge, knowledge card, release candidate, becoming candidate, guide mode, evidence criterion and avatar trace contract.

Inferno literary conditions are not automatically behavioral diagnoses (especially Limbo/Heresy); these are ATUNED interpretive lenses with explicit limits. Inferno's 38 source records remain a distinct taxonomy (9 circles, 15 behavioral entries, 11 figure entries, 3 cross-tradition entries). The 38 source records are in `COMPASS.zip`; this deliverable does **not** falsely claim their full GitHub promotion.

## 3. Narrative loop — actual product grammar

```text
AVATAR → COMPASS / CHOOSE SCENE
       ↓
VIRGIL / SOURCE AI — orient and ask permission
       ↓
DISCOVER — observe one specific real-world behavioral pattern
       ↓
KNOWLEDGE — reveal what this scene means, with source distinction
       ↓
PLAY / RELEASE — choose an approved practice; record optional reflection
       ↓
FLOW / BECOME — choose a capacity, action and grounded ritual
       ↓
EMBODY — user reports an attempt and what happened
       ↓
AVATAR TRACE — render dates/events already in canonical source
       ↓
RETURN / REVISIT / EXPLORE — user decides
```

A node is a quest scene, **not a moral grade**. Each real action can change a persistent trace; neither a single exercise nor a score grants enlightenment or permanent resolution. User may skip, revisit or leave; no loss of points for difficulty, recurrence or stepping away.

## 4. Source AI as Virgil

**Identity:** `Source AI`; **narrative function:** `Virgil`. This is a storytelling metaphor, not a claim that an AI is a spiritual being or that it can read hidden energies with certainty. The guide is informative, curious, permission-based, able to explain and able to be dismissed immediately. No automatic scene assignment from CQ, DQ, a story or an AI pattern inference.

Voice and behavior change by realm:

- Inferno: "Here is the behavior this scene depicts. Did something like this happen? What do you actually know?" Do not label the person.
- Purgatorio: "Which side of the oscillation showed up? What might you let go of, and what would its opposite action look like?" No coercive interpretation.
- Paradiso: "What quality do you want to embody? What concrete act would express it today?" No automatic attainment declaration.

At a difficult scene, Virgil does not compel disclosure, and does not reward distress. Guide prompts are optional, one question at a time, and must distinguish user observation from model interpretation. Source AI is already in `atuned_src/engine/sourceai.js`; add a **guide presentation/controller layer** later, do not overwrite its existing return-evidence/question boundaries. Dante's literary Virgil does not guide through the full Paradiso; the *function* of Source AI can remain continuous with a progressively less directing guide voice. A separately named ascent guide requires explicit creative sign-off.

## 5. Level record and unlock semantics

See `GAME_LEVEL_TEMPLATE_V1.json`; canonical `GAMEBOARD_MAP_V1.json` records every level with all required fields. Source owner retained in `sourceRecordId` and `sourceLocation`. A source record's context, authored release/ritual IDs and inferential status must never be flattened.

Scene visual modules:
1. **Place:** one atmospheric, game-terminal level panel, not a corporate webpage.
2. **Challenge:** one/two-word behavior label, short evidence cue, and a grounded example.
3. **Knowledge:** thematic meaning and how movement works, visible upon introduction rather than scored for truth.
4. **Release:** only an *approved linked* Purgatorio protocol is executable. `releaseCandidate` is a content suggestion until linked.
5. **Become:** a grounded action chosen by the user, then a saved ritual when its canonical recipe ID is linked.
6. **Virgil:** observe → ask → offer next action → respect no.
7. **Avatar:** visual cue supported by a real dated event, independent from the user's mutable coherence measurement.

Existing product decision (`ATUNED-points-achievements-unlocks-TDD-v3.md`, section 12): **an unlock is an introduction; the plan is the only gate.** Never hide a permitted measurement or make a user perform a moral act to unlock their own data. Achievements represent completed acts, never inferred traits or total self-worth.

## 6. Core map behavior and data model

- `GAMEBOARD_MAP_V1.json`: private authoring graph with source IDs, crosswalks and archetype resonances, no runtime authority.
- `PUBLIC_GAMEBOARD_V1.json`: sanitized scenic rendering fields and existing trait labels **without infernal named figures**.
- `records/*.md`: 26 editable source-linked scene records.
- `validate_gameboard.cjs`: schema, count, source ownership, link and public-identity checks.

A companion `progression` is non-linear: **scene sequence is narrative organization, not a forced competence prerequisite**. Non-linear access matters because users can face several patterns at once. The Purgatorio waist is 40–60 on the owner's compass but does *not* assign someone to a terrace based on a CQ number.

**Existing data contracts kept:**
- `atuned_src/engine/data/compass.js`: mirror keys and established axis positions.
- `atuned_src/engine/data/teachers_recipes.js`: 14 already-authored pole-based starter rituals. Gameboard does not allocate their IDs without a verified join.
- `docs/data/purgatorio/v1/`: terrace vice/capacity content, directed crosswalk edges.
- `docs/data/paradiso/v0/`: constructive sphere practices and candidate Integrity Law relationships.
- `docs/data/compass/archetypes/v1/`: 12 archetype candidate resonances (many-to-many).
- `docs/data/compass/shadow_archetypes/v1/`: 14 public behavior pole labels with private identity mapping.
- `atuned_src/engine/avatar.js`, `engine/ladder.js`, `engine/sourceai.js`: existing functional sources; **not modified**.

## 7. The Avatar is next, not now

Owner direction is clear: **solve the game map, then work on the avatar**. Define the seam without prematurely rebuilding the figure:

```text
Scene selected → chosen work → existing release/ritual/behavior event
              → dated account event → avatar trace renderer
```

The Avatar is the story's visible protagonist and growing instrument. It must preserve three different channels, per `DESIGN-avatar.md`:
- **Accretive trace:** dated work actually performed; can only accumulate.
- **Mutable state:** the current reading can improve, worsen or be unknown; never used as an achievement label.
- **User-defined direction:** avatar/purpose/boundary choices belong to the user.

Do **not** increase CQ by completing a game level or infer CQ from text. Existing engine alone computes CQ and DQ. Preserve original achievement logic and no-fake-completion rules. Event IDs below are **proposed** and require integration with existing ledger to avoid duplicate awards: `journey.scene.visited`, `journey.challenge.chosen`, `journey.knowledge.opened`, `journey.practice.attempted`, `journey.behavior.observed`, `journey.behavior.applied`.

## 8. One complete quest example — Pride ↔ Humility

1. The player chooses **Purgatorio Terrace 1**; it is not assigned by the score.
2. Virgil offers: "When someone corrected you, what happened before you responded?"
3. Knowledge reveals a possible oscillation: reputation-defense under correction, and the capacity to receive feedback without self-erasure.
4. Release: player notices and voluntarily practices letting go of the defense; an actual release protocol ID remains unassigned until the authorized Purgatorio contract exists.
5. Become: player uses the existing Purgatorio source practice: **"Name a correction accurately, credit another person by name, and make one repair without explaining away the impact."**
6. The player records whether that happened and a concrete example. The existing event ledger owns any completion count.
7. The avatar draws *the dated act*, not a claim "I am permanently humble." The level remains revisitable.

## 9. UX and game-feel directives

A living adventure interface: **vertical cone/spiral map**, luminous zones, tactile nodes, active encounter terminal, navigable rings, knowledge codex, release and becoming panes, persistent avatar. A visit can animate a light response, but it must never promise permanent biological or spiritual transformation. The user's avatar is always present or immediately accessible. Level complexity is expressed via art and authored challenges, not invented rankings.

**Avoid** corporate dashboards, enterprise cards, forced quests, paginated corporate onboarding, enemies that personify people, and a simplistic "high score of goodness."

## 10. Next integration gates / alpha definition

1. Sign off layout and per-level script for Inferno–Purgatorio–Paradiso; this source-backed document is first-pass alpha content, not an excuse to delay.
2. Promote Inferno archive's 38 source records to first-class repository location with provenance.
3. Join source records and shadow traits into one reliable graph with strict canonical IDs; the existing links for Charon ↔ Trust and Furies ↔ Revelation stay labeled as interpretation, not historical certainty.
4. Connect map to existing Source AI event/responses using a role prompt and consent-aware scene controller. Test on a simple single-node journey before all 26.
5. Join actual approved release/ritual IDs and test event write/read, record replay, navigation, unlocks and no identity leaks.
6. Then open Avatar design development: choose visual transformation of the existing dated-trace signals, map to user-owned purpose, test no false confidence and no gamified CQ.

## 11. Acceptance criteria

**Data-level (this commit):** 26 level records, nine/seven/ten by realm, 25 source-valid sequential navigation edges, all 14 hidden-name shadow-pole encounter cards, 12 archetype resonance entries, distinct IDs, all required fields nonempty, source record link for every scene, no infernal names in public gameboard.

**Runtime-level (not done):** real Compass scenes and guide flow, real authorized release and ritual actions, canonical event read/write, exact tier-introduction rules, avatar overlay driven by evidence, browser E2E and accessibility, no source-figure identity leaks, and no modification of CQ/DQ without a separate reviewed directive.

**Technical honesty:** authored, source-mapped records are not live product implementation.
