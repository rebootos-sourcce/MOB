# Records against the four depth template, 31 October 2026

Working document for the coordinating session. Research only: nothing in
`atuned_src/`, `TASKS.md` or `DECISIONS.md` was touched.

The owner, tonight: "do a review of all records across Atuned to ensure that
they follow the rules of our templates. You can find the templates on GitHub.
It's effectively a four-depth pass to get to the behavior and the mechanism,
and I think some of the content does not have that. Identify what does not
have that, so we can build a plan around it. Strategize that three times and
build a plan."

Measured on MOB branch `journal-pure-voice` at `6c3c0f48`, with the working
tree mid merge (staged changes in `engine/`), so the engine was built from the
working tree into a scratch file (`BUILD-engine.sh <scratch>`, md5 prefix
`51bba90a`), not read from the committed `engine.js`. Every count below came
off that build and the scripts named in section 6. Re-run them rather than
trusting a figure here.

## 1. The template, as found

Five documents on GitHub define a record shape. They are not the same thing,
and only one of them is literally a four depth pass. Said plainly rather than
picking one.

| # | Document | Where | What it is | Depth |
|---|---|---|---|---|
| T1 | `atuned/data/celestial/DEPTH_RESEARCH_STANDARD_V2.md` and its exemplar `eastern_astrology/WATER_RAT_FOUR_DEPTH_PASSES.md` | reboot-os `main` (`d1d64b46`), file last changed `72c261fa`, 28 Oct | Owner direction 28 Oct. Four named research passes per record | **Four. This is the one his words describe** |
| T2 | `atuned/docs/ATUNED_FETTER_DEPTH_STANDARD_AND_COVERAGE_STRATEGY_2026-10-18.md` | reboot-os branch `audit/atuned-canon-reconciliation-2026-10-18` only (`b02bddfb`), never merged | Fifteen required fields per fetter, "four expressions" of polarity, acceptance gates | Field contract, not passes |
| T3 | `DESCENT[].content` | MOB `atuned_src/engine/data/compass.js` | The only live engine record with behavior, triggerMechanism, livedExample, impact, practice, opposite and dated research passes | Three passes (A, B, C), not four |
| T4 | `TEMPLATE_SCHEMAS` | MOB `proto/knowledge/src/gen-data.js` | Field lists per kind (TPL-SABOTEUR, TPL-COMPLEX-UNIFIED, ...) for the knowledge prototype | Field presence only |
| T5 | `docs/data/ATUNED_DEEP_PSYCHOLOGICAL_TEMPLATE_CATALOG_v1.json` and `..._RECORD_SCHEMA_v1.json` | MOB `docs/data/` | Root, domain, archetype and Conscious Domain records, "exactly three distinct research-pass slots" | Three passes; its own README says nothing in the build reads it |

Also seen and not used as the standard: `SHADOW_ARCHETYPE_TEMPLATE_V1.json`
(MOB branches from 25 Oct, three lenses) and
`ATUNED_SABOTEUR_FAMILY_TEMPLATE_RESEARCH_REGISTRY_9_v1.json` plus
`ATUNED_FETTER_108_THREE_PASS_RESEARCH_DEPTH_PASS_2026-10-24.md` (MOB branch
`work/deep-psyche-recursive-closure-2026-10-24`, unmerged, three passes,
"v336-based research overlay").

### T1, quoted

> **Owner direction 2026-10-28:** Water Rat is the blueprint for future Eastern
> records and Western redo. Previous entries often contained only four shallow
> short descriptions. Four nonempty fields are *not* four research depth passes.

> ## Pass 1: Historical/calendar identity and provenance
> ## Pass 2: Symbolic/technical construction from original traditions
> ## Pass 3: Deep gift/shadow and lived experience
> Produce distinct strengths, contingent shadows, precise contexts, stress
> trigger -> strategy -> consequence loop, observable scenes,
> inversions/release opportunities, counterexamples and alternate
> explanations. All are interpretive hypotheses, not predictions or diagnoses.
> ## Pass 4: Exact ATUNED crosswalk + falsification and trust boundary

> - Four distinct substantial analytic passes, not four paraphrases or placeholders.
> - A working stress loop, a **healthy inversion**, direct recognition
>   questions and concrete disconfirmation examples.
> - Mark source-originated facts, practitioner interpretations, new editorial
>   psychological hypotheses, unverified empirical claims.

> "Old four-field entries fail this threshold even when all four fields are nonempty." (Water Rat, pass 4)

T1 was written for celestial records and has only been executed on them (its
execution index: 148 of 181 structurally complete, owner approval 0 of 181).
Applying it to the psychological records is the owner's new instruction
tonight. The reboot-os celestial records that pass it carry `essence`,
`gifts`, `shadows`, `research_passes` (four), `recognition_questions`,
`counterevidence`, `reflection_practice`, `opposite_sign_ref`.

### The rubric this audit used

T1's four passes, translated to a behaviour record, with T2 and T3 supplying
the field names a psychological record already uses. Fourteen components:

| Depth | T1 pass | Components checked |
|---|---|---|
| D1 | Identity and provenance | `def` a definition distinct from the name and from a symptom list; `prov` where it comes from, at record level (codex, owner ruling, Positive Intelligence, research) |
| D2 | Construction in the system | `joins` its addresses, seat, axis or family as data; `poles` its own opposite or counterpart |
| D3 | Behaviour and mechanism | `trig` trigger; `beh` the move a person makes; `cons` payoff and cost; `scene` a lived example; `inv` the healthy inversion as behaviour; `ctr` a counterexample, where the same behaviour is healthy or has another cause |
| D4 | Crosswalk, falsification, trust boundary | `rq` recognition question; `dis` disconfirmation; `evc` evidence class labelled; `rp4` four cited research passes |

A depth passes only when every component in it is there. A record passes only
when all four depths pass. Partial counts as a gap, per T1 and T2 ("A record
does not pass merely because every field contains text").

## 2. Three passes, and how they differ

Run one after another with the earlier verdicts closed, each by a different
method, so each could disagree with the others. They are one seat's three
passes, not three seats.

- **Pass A, schema.** Is there a field meant to hold the component, holding
  prose (at least 25 characters, more than three words)? Blind to what the
  prose says.
- **Pass B, prose.** Read the text. Does it actually say the component,
  wherever it sits? A payoff inside a scene counts. A one sentence definition
  counts as partial.
- **Pass C, surface.** What the live renderer prints, read off
  `ui/drills.js`, `ui/knowledge.js`, `ui/ritcal.js`, `ui/ui.js` and
  `ui/character.js`. Data nobody renders scores nothing here.

Exposure was measured, not assumed, for the pattern rungs: the reference
roster (`PEOPLE`, 15 profiles read) through `compute()` and `darkRead()`,
counting which records land on a reading.

## 3. Inventory and results

**379 records** in 21 categories, plus two generated classes with no record
at all (complexes, generic super complexes). Excluded on purpose, with
reason: the 21 laws (`SI`, a quality measured, not a pattern), `HARM` (76
harmonic elements, principles), `GLOSS` (terms), `MASTERS` (their behaviour
lines are the compass poles, graded below), `ARCH18` (mapping rows).

**Result, the same in all three passes: 0 of 379 records pass all four
depths, and 0 pass depth 3, the behaviour and mechanism depth.** Three
components are missing from every record in every pass: a full
counterexample, disconfirmation, and four research passes. The most any
record carries is three passes (three `DESCENT` entries).

### Per category, components present

`Y` every record, `-` none, `~` partial in every record, `yN` N records full,
`~N` N records partial, `n` not applicable. A, B, C are the three passes.
Seen is the measured roster exposure (records seen / records, appearances).
Where one row covers two passes that differ on a cell, `x/y` is the first
pass, then the second.

| Category | n | Seen | Pass | def prov joins poles | trig beh cons scene inv ctr | rq dis evc rp4 |
|---|---|---|---|---|---|---|
| Saboteur, named | 33 | 31/33, 106 | A | Y y10 y32 - | y32 Y - Y Y - | - - ~10 - |
| | | | B | y7 y10 y32 ~ | Y Y Y Y Y ~ | Y - ~10 - |
| | | | C | - y10 y32 ~ | ~ Y Y Y Y ~ | Y - ~ - |
| Saboteur, generated | 13 | 13/13, 50 | A | - - Y - | - - - - - - | - - Y - |
| | | | B | - ~ Y ~ | - - - - ~ - | - - Y - |
| | | | C | - ~ Y ~ | ~ - - - ~ - | - - Y - |
| Saboteur, overshot | 45 | 20/45, 20 | A, B | - - Y ~ | - - - - - - | - - y13 - |
| | | | C | ~ - Y ~ | - - - - ~ - | - - y13 - |
| Hyper complex, family | 6 | 6/6, 25 | A | Y - Y ~ | - - - - - - | - - - - |
| | | | B | ~ - Y ~ | - ~ - - - - | - - - - |
| | | | C | ~ - Y ~ | - - - - ~ - | - - - - |
| Hyper complex, overshoot | 6 | 2/6, 2 | all | ~ - Y ~ | - - - - - - | - - - - |
| Descent, Narcissism | 1 | 0 dark reads | A, B | Y Y ~ Y | Y Y Y Y Y -/~ | - -/~ Y ~ |
| | | | C | ~ - ~ - | - - - - - - | - - - - |
| Descent, Machiavellianism and Sociopathy | 2 | 1 dark read | A, B | Y Y y1 y1 | y1 y1 y1 y1 y1 -/~1 | - -/~1 Y ~1 |
| | | | C | ~ - ~ - | - - - - - - | - - - - |
| Descent, Psychopathy | 1 | 2 dark reads, 4 r.psychopathy | A, B | Y Y Y Y | Y Y Y Y Y -/~ | - -/~ Y ~ |
| | | | C | ~ - ~ - | - - - - - - | - - - - |
| Axis (child emotion) | 9 | every reading | A | - - Y Y | Y - - - Y - | - - - - |
| | | | B, C | - - Y Y | ~ ~7 - - Y (C: y7) - | - - - - |
| Fetter address | 108 | every reading | A | - - y107 ~107 | - - - - - - | - - - - |
| | | | B, C | ~ - y107 ~107 | - ~ - - - - | - - - - |
| Field anchor | 4 | every reading | all | ~ - ~ n | n n n n n n | n n - - |
| Mask | 6 | 5 on every reading | A | Y - Y - | - Y - - - - | - - - - |
| | | | B | ~ - Y - | - ~ - - - - | - - - - |
| | | | C | ~ - Y - | - ~ ~ - - ~ | - - - - |
| Archetype | 12 | intake, character | A | Y ~ Y ~11 | - Y - - - - | - - - - |
| | | | B | ~ ~ Y ~11 | - ~ - - - - | - - - - |
| | | | C | ~ - Y - | - ~ - - - - | - - - - |
| Domain | 19 | Blueprint drill | all | y15/~15 ~ Y y15 | - ~15 - - - - | - - - - |
| Law of action (gate) | 6 | Field dial, Knowledge | A | Y - ~ Y | - Y - - - - | - - - - |
| | | | B, C | ~ - ~ Y | ~ Y - - ~ - | ~ - - - |
| Compass pole and recipe | 14 | Compass tab | all | y11 Y y8 y11 | - Y - - Y - | y8 - Y - |
| Circle of the descent | 9 | compass drill | A | Y ~ Y - | - Y - - - - | Y - - - |
| | | | B, C | ~ ~ Y - | - ~ - - - - | ~ - ~ - |
| Governor corner | 5 | compass drill, hover | A | Y - Y ~ | - Y - - - - | - - - - |
| | | | B | Y - Y ~ | - ~ ~2 - - ~1 | - - - - |
| | | | C | ~ - Y ~ | - ~ ~2 - - ~1 | - - - - |
| Blueprint inversion | 4 | hover only | A, B | Y ~ - ~ | - Y/~ - - - - | - - - - |
| | | | C | ~ - - - | - - - - - - | - - - - |
| Cascade state | 6 | not rendered | A, B | Y - - - | - Y/~ - - - - | - - - - |
| | | | C | - - - - | - - - - - - | - - - - |
| Blueprint line | 70 | born-on card | A | y67 - ~ - | - y67 ~2 - - - | - - - - |
| | | | B, C | ~ - ~ - | - ~ ~2 - - - | - - - - |

Generated classes with no record: **complexes**, named `A + B` from two
saboteurs of one family (74 instances across the 15 roster readings), whose
drill prints the kind, the name, one structural sentence and the axis
opposite, and nothing about the complex; **generic super complexes**, `A / B`
of two hyper complexes (9 distinct generic pairs on the roster, plus the named Psychopathy pairing on 4 readings), the same.

### What each category is missing, by name

- **Saboteur, named (33).** Closest to the template. Has trigger, behaviour,
  payoff and cost, scene, inversion and a reflection question, but the
  payoff, cost and question sit inside one prose field (`SABCARD.h`), so a
  schema check sees none of them. Missing everywhere: a counterexample (each
  `SABCARD.a` opens with one context line, "Some things can wait", which is
  partial), neighbour distinctions (only Control Freak has "Distinct from"),
  disconfirmation, a record level evidence class (10 carry the Positive
  Intelligence attribution, 23 only the table's "ported from the codex"), and
  research passes (0 of 4). D1: 26 of 33 definitions are one sentence under
  100 characters (People Pleaser 48, Martyr 64, Innocent 69) against
  Negotiator 529 and Control Freak 947. D2: no saboteur has its own opposite,
  it borrows the axis's. Catastrophizer's trigger is three words, "Any
  unresolved uncertainty." Innocent has no `SAB_LIB` row, so it never lands
  on a reading and is not in Knowledge either (`ALL_SAB` omits it), left out
  by name on 22 October. Hyper-Rational is the other one the roster never
  showed.
- **Saboteur, generated (13).** Nothing authored. The drill says "Inferred.
  The library has no name for this cluster", one structural sentence, and the
  axis opposite. `kbSabBlock` returns empty, so no card. The ritual calendar
  falls back to the axis's `CHALLENGE` line. All 13 land on roster readings,
  50 appearances, which is more than any category but named saboteurs. FD9's
  named example is stale: Root Flincher no longer exists (the 22 October
  `SAB_LIB` fill took its addresses); Diffuse Bracer still does, 5
  appearances. These names are generated, and the set moves when `SAB_LIB`
  moves. The stable identity is the cluster code in `engine/codes.js`
  (`S.<seat>.<emotion>`, `S.diffuse.<emotion>`), 72 possible, 13 live.
- **Saboteur, overshot (45).** Every `ALL_SAB` row has an overshot reading,
  "<name> overshot", the opposite installed past the point where it helps. 20
  of 45 seen on the roster. The drill prints one fixed sentence ("Jouissance.
  The coherent opposite installed past the point where it serves.") and the
  axis opposite. `kbSabBlock(o.nm)` looks up `SABDEF['aggressor overshot']`,
  finds nothing, and prints nothing; `ritcal.js` strips the suffix and so
  does find the base card. Nothing describes the overshoot behaviour itself.
- **Hyper complex, family (6).** One clause each, "the shape is held bigger
  than it is, and the gap is defended", printed on hover and map panels, not
  in the drill. `sub` is clinical and correctly never shown. The deep content
  exists, but not here: `proto/knowledge/src/gen-data.js` `HYPERCOMPLEX_MODES`
  carries definition, behaviour, trigger, lived example, impact, practice,
  inverse and two sources for all six. It is a port, not a write.
- **Hyper complex, overshoot (6).** Numbness, Mania, Indiscriminate,
  Enabling, Self-erasure, Enmeshment. A generated line, "the fix for
  collapse, done past the point where it helps". Mania and Indiscriminate
  seen once each.
- **Descent (4).** The deepest records in the engine and the least seen.
  Narcissism, Machiavellianism and Psychopathy carry D1 to D3 in full except
  a counterexample, an evidence class, and three research passes. Sociopathy
  is all null, on purpose: owner placed 26 October, "nothing is invented to
  fill the shape". None of the content renders: the dark read prints name,
  kind, `d` as a hover title, and the referral. Narcissism and
  Machiavellianism have no `fam` or `pair`, so they are chosen by depth
  alone. The three written entries' `reviewStatus` reads
  "semantic-pass-B-and-adversarial-pass-C-pending" while the same entry's
  `researchPasses` holds B and C with findings: two fields disagree about one
  fact.
- **Axis (9).** No definition field at all. Has seat, address, opposite, the
  inner sentence (`AXCARD.track`), a situation (`CHALLENGE.when`) and a
  practice (`CHALLENGE.act`, `AXCARD.inst`). **Surprise and Anticipation have
  no letting go card**: `AXCARD` carries two cards, 05 and 06, with `ax`
  null. The fetter drill prints place, two numbers and the opposite.
- **Fetter address (108).** A theme of one to three words and a one word
  distortion ("Approval", "Inauthenticity"). That is the "four shallow short
  descriptions" T1 was written against, and T2's fifteen fields were written
  for exactly these. Node 8 `Root_08_Unnamed` has no axis (open, owner's).
- **Field anchor (4).** Roles, not patterns. T2: "Give the four field/anchor
  entries a separate ontology/role standard." Graded n/a for D3.
- **Mask (6), Archetype (12), Gate (6).** One clause or one sentence each.
  The mask drill prints a fixed paragraph that is the same for all six; the
  archetype drill prints `v` and never `d`. Professional is hidden from the
  reading.
- **Domain (19).** Clear and distorted readings as noun lists. Four
  (Descent, Connection, Exchange, Restoration) have no `DOMDEF` row: renamed
  in the codex, `KB_RENAME`, owner's ruling.
- **Compass pole and recipe (14).** Codex line, phrase meanings, a
  recognition question on the eight mirror axes, and the teacher recipe's
  release and install behaviours. Missing trigger, cost, scene,
  counterexample, disconfirmation, passes. Every recipe is `draft: true`.
  The three home poles have no codex line at either end.
- **Circle (9), Governor (5), Blueprint inversion (4), Cascade (6).** Prose
  descriptions. Governor and Blueprint print only as hover titles; Cascade is
  rendered nowhere, deliberately.
- **Blueprint line (70).** One clause per sign, animal, element, life path,
  Human Design type and line, root, and debt. The reboot-os celestial library
  already has four pass records for the 12 signs, the 5 elements and 7 of
  the 12 animals (its execution index lists Goat, Monkey, Rooster, Dog and
  Pig as remaining), with owner approval 0 of 181.

## 4. Where the three passes agreed, and where they did not

Agreement, all three: 0 records pass; D3 fails or is partial everywhere;
counterexample, disconfirmation and four passes are absent everywhere; the
generated, overshot and fetter records are the thinnest; the 13 generated
saboteurs have nothing authored. On whole verdicts the passes agreed on 145
of 379 records; by depth, D2 agreed on 374, D4 on 346, D3 on 191, D1 on 184.
Each disagreement is a finding:

1. **Named saboteurs, consequence and recognition question.** A: absent (no
   field). B and C: present, inside `SABCARD.h`. The content is there but
   cannot be checked by a machine. The migration splits it into fields.
2. **Named saboteurs, definition.** A: 33 of 33 present. B: 7 of 33 more
   than one sentence. C: 0 of 33 shown, because the card's scene replaces
   `SABDEF.d` whenever a card exists. The definition is the thinnest field and
   the one nobody reads.
3. **Descent.** A and B: the deepest records in the engine. C: nothing
   renders. Depth in data, none on the surface.
4. **Descent review status.** Within one record, `reviewStatus` says passes
   B and C are pending while `researchPasses` carries them. A stored value
   that a second field contradicts, which is two truths.
5. **Hyper complex families.** A and B read the engine and found one clause.
   Looking outside the engine, the content exists in a prototype generator.
   The gap is wiring, not writing, for these six.
6. **Masks.** A and B: one clause. C: the drill adds cost language, but the
   same paragraph for all six, so the surface looks deeper than the record is.
7. **Archetypes.** A counts `d` as behaviour; C finds the archetype drill
   never prints `d`.
8. **Circles.** A counts `see` as a recognition question; B reads it as a
   first person assertion, not a question.
9. **Axes.** A finds a practice on all nine; C finds two axes print no card.
10. **Template choice itself.** Under T4 (`TPL-SABOTEUR`) every saboteur
    passes, because the knowledge generator writes filler for the generated
    ones ("This inferred Saboteur pattern organizes around ..."). Under T1
    none does. T4 counts fields, which T1 says in its first paragraph is not
    depth.

## 5. The plan

Ordered by exposure first, then by how thin the record is. Exposure for the
pattern rungs is the roster measure; for the rest it is where the record
prints. Sizes: one entry, a handful (up to about fifteen), a sweep (a whole
category).

### Schema first, once, before any writing (one entry)

- **One depth record shape**, additive, beside the display tables the way
  `DESCENT[].content` already sits beside `d`: `d1 {definition, provenance}`,
  `d2 {opposite}`, `d3 {trigger, move, payoff, cost, scene, inversion,
  counterexamples[], neighbours[]}`, `d4 {recognition[], disconfirmers[],
  evidenceClass, researchPasses[4]}`, `reviewState`, `ownerApproved`.
- **Keyed by identity, never by display name.** `SABDEF` codes (`S01`...),
  cluster codes for generated saboteurs (`S.sacral.Anger`), family codes
  (`K1`, and `K1o` for its pole), node `i`, `CODE_STRUCT` ids for the descent.
  A generated name is display order in another coat; Root Flincher already
  vanished under it once.
- **Joins are derived, never stored.** Addresses, seat, family already live in
  `SAB_LIB`, `NODES`, `HCX_LIB`. Copying them into the depth record makes two
  truths.
- **One status, derived.** Depth reached is computed from which passes exist,
  not typed into a status string. That retires the Descent contradiction by
  construction.
- **A gate that reads the count off the run**, in `tests/engine.js`: every
  record that claims a depth has every component for it, four passes with at
  least one source each, and a record with none says so rather than filling.
- **No version bump.** This is engine data, not the person's record. Nothing
  persisted in a profile moves, so `validateProfile` and v1 records are
  untouched and schema v2 is not in play.

### P1. On readings now, thinnest first

1. **Generated saboteurs, 13 live (a handful).** Write d1 to d4 per cluster
   code, from each cluster's own addresses and axis, in the named saboteurs'
   voice. Decide whether to pre-write the other 59 codes or write on the day
   one goes live; the gate should fail when a code goes live with no record.
   Closes FD9.
2. **Overshot saboteurs (a sweep, 45, or 6 if written per family pole).** The
   overshoot is a behaviour of its own, not the base card. Smallest honest
   first step: write per family pole (6), then per saboteur where the pole
   line does not fit. The one line suffix lookup in `kbSabBlock` should not
   ship alone: it would print the base saboteur's card on its opposite.
3. **Hyper complex families (a handful, 6).** Port `HYPERCOMPLEX_MODES` from
   `proto/knowledge/src/gen-data.js` into the engine as their depth records,
   then add counterexample, recognition, disconfirmation and passes 2 to 4.
   The overshoot poles (6) follow the same shape.
4. **Complexes and generic super complexes (one entry, then a handful).**
   There is no record to fill. Decide what a complex record is: per family
   (12 with poles) is writable; per pair is combinatorial. A shape decision,
   mine and the technical director's, not the owner's.
5. **Named saboteurs (a sweep, 33, mostly additive).** Split `SABCARD.h` into
   trigger, move, payoff, cost, scene and question fields, so the gate can see
   them; then add counterexamples, neighbours, disconfirmers, evidence class
   and passes. Expand the 26 one sentence definitions. Catastrophizer's
   trigger. Innocent's address stays open by name.

### P2. On every reading, not a pattern rung

6. **Axes (a handful, 9).** A definition for each; the two missing letting go
   cards (Surprise, Anticipation) and which of the unassigned cards 05 and 06
   they are, which is a reading of the codex, then the rest of d3 and d4.
7. **Fetter addresses (a sweep, 108).** The largest job. T2 already sets the
   order: freeze ids, a calibration set across seats, owner review of the
   calibration, then batches by seat with a coverage ledger. The unmerged
   overlay on `work/deep-psyche-recursive-closure-2026-10-24` (108 three pass
   records, 972 prompts, built on v336) is a source to reconcile, not to
   trust. Node 8 waits on the owner.
8. **Masks 6, archetypes 12, gates 6 (handfuls).** Write d3 and d4; make the
   mask drill print the record and not one paragraph for all six; print the
   archetype's `d`.

### P3. A tab a person opens

9. **Blueprint lines (a sweep, 70; 24 of them a port today).** Port the
   reboot-os four pass records for signs, elements and the finished animals,
   carrying
   `ownerApproved: false`; author life path, Human Design, root and debt.
   Cross repository canon, so the port waits on which repository owns
   celestial content.
10. **Compass poles and recipes (a handful, 14).** Trigger, cost, scene,
    counterexample, disconfirmation, passes. The `draft` flags are the
    owner's to clear.
11. **Domains (a handful, 19).** Behaviour beyond the noun lists. The four
    renamed ones wait on `KB_RENAME`.

### P4. Gated or hover only

12. **Descent (a handful, 4).** A fourth pass on three, counterexamples, and
    the status contradiction fixed by deriving status. Whether any of this
    content renders behind the dark read, and Sociopathy's content, are the
    owner's calls: clinical names behind a safety referral.
13. **Circles 9, governors 5, blueprint inversions 4 (handfuls).**

### P5. Not rendered

14. **Cascade (6).** Leave until something renders it, as its own comment
    rules.

### Whose call

- Mine and the technical director's: the record shape, keying, the gate, the
  complex record question.
- The owner's: that T1 governs psychological records (his words tonight say
  so; T1 itself names only celestial records); approval of each calibration
  set; Sociopathy; whether the dark read renders descent content; node 8; the
  four renamed domains; the recipe drafts; which repository owns celestial
  canon.

## 6. How to re-run

From the MOB checkout, with a scratch directory `$S`:

    sh atuned_src/BUILD-engine.sh $S/engine.js
    node $S/dump1.js && node $S/roster.js && node $S/audit.js

The three scripts, and `audit.json` with every record's components per pass,
were left in the session scratchpad at
`/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/rta/`.
They are not in the repository.

## Appendix. Every record, every pass

Verdict per depth, D1 D2 D3 D4: `P` pass, `H` partial, `F` fail, `N` not
applicable. Seen is roster appearances, pattern rungs only (`-` where not
measured).


### Saboteur, named (33)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Negotiator | 4 | HHHF | HHHH | HHHH | def 529 chars |
| Micromanager | 5 | PHHH | PHHH | HHHH | def 784 chars |
| Victim | 3 | PHHH | HHHH | HHHH | def 75 chars |
| Perfectionist | 3 | HHHF | HHHH | HHHH | def 81 chars |
| Pleaser | 5 | PHHH | HHHH | HHHH | def 82 chars |
| Hyper-Achiever | 6 | PHHH | HHHH | HHHH | def 63 chars |
| Hyper-Rational | 0 | PHHH | HHHH | HHHH | def 70 chars |
| Hyper-Vigilant | 3 | PHHH | HHHH | HHHH | def 69 chars |
| Restless | 1 | PHHH | HHHH | HHHH | def 76 chars |
| Stickler | 6 | PHHH | HHHH | HHHH | def 69 chars |
| Judge | 3 | PHHH | HHHH | HHHH | def 89 chars |
| Deflector | 3 | HHHF | HHHH | HHHH | def 52 chars |
| Dramatizer | 2 | HHHF | HHHH | HHHH | def 82 chars |
| Worrywart | 4 | HHHF | HHHH | HHHH | def 68 chars |
| Loner | 3 | HHHF | HHHH | HHHH | def 340 chars |
| People-Pleaser | 3 | HHHF | HHHH | HHHH | def 48 chars |
| Skeptic | 1 | HHHF | HHHH | HHHH | def 80 chars |
| Dreamer | 1 | HHHF | HHHH | HHHH | def 93 chars |
| Procrastinator | 4 | HHHF | HHHH | HHHH | def 63 chars |
| Imposter | 3 | HHHF | HHHH | HHHH | def 64 chars |
| Aggressor | 5 | HHHF | HHHH | HHHH | def 79 chars |
| Martyr | 3 | HHHF | HHHH | HHHH | def 64 chars |
| Cynic | 2 | HHHF | HHHH | HHHH | def 53 chars |
| Manipulator | 5 | HHHF | HHHH | HHHH | def 76 chars |
| Overthinker | 3 | HHHF | HHHH | HHHH | def 53 chars |
| Escapist | 5 | HHHF | HHHH | HHHH | def 78 chars |
| Avoider | 2 | PHHH | PHHH | HHHH | def 167 chars |
| Nihilist | 3 | HHHF | HHHH | HHHH | def 81 chars |
| Innocent | 0 | HHHF | HHHH | HHHH | no SAB_LIB row: never lands on a reading, not in Knowledge (ALL_SAB omits it); def 69 chars |
| Pessimist | 3 | HHHF | HHHH | HHHH | def 84 chars |
| Catastrophizer | 3 | HHHF | HHHH | HHHH | def 163 chars |
| Enabler | 5 | HHHF | HHHH | HHHH | def 164 chars |
| Control Freak | 4 | HHHF | HHHH | HHHH | def 947 chars |

### Saboteur, generated (13)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Sacral Drifter | 4 | FHFH | HHHH | HHHH | family Dissociation; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Sacral Striker | 6 | FHFH | HHHH | HHHH | family Predatory; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Solar Striker | 5 | FHFH | HHHH | HHHH | family Grandiosity; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Heart Mourner | 3 | FHFH | HHHH | HHHH | family Collapse; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Heart Recoiler | 4 | FHFH | HHHH | HHHH | family Rigidity; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Throat Recoiler | 2 | FHFH | HHHH | HHHH | family Rigidity; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Crown Striker | 3 | FHFH | HHHH | HHHH | family Grandiosity; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Crown Mourner | 4 | FHFH | HHHH | HHHH | family Collapse; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Diffuse Freezer | 4 | FHFH | HHHH | HHHH | family Dysregulation, cross seat; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Diffuse Bracer | 5 | FHFH | HHHH | HHHH | family Dysregulation, cross seat; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Diffuse Startler | 3 | FHFH | HHHH | HHHH | family Dysregulation, cross seat; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Diffuse Recoiler | 3 | FHFH | HHHH | HHHH | family Rigidity, cross seat; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |
| Diffuse Hider | 4 | FHFH | HHHH | HHHH | family Collapse, cross seat; drill prints a structural line and the axis opposite; ritual calendar falls back to CHALLENGE by fetter |

### Saboteur, overshot (45)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Micromanager overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Victim overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Perfectionist overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Pleaser overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Hyper-Achiever overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Hyper-Vigilant overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Judge overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Avoider overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Worrywart overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Loner overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Nihilist overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Aggressor overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Imposter overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Negotiator overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Restless overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Stickler overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Hyper-Rational overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Deflector overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Dramatizer overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| People-Pleaser overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Skeptic overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Dreamer overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Procrastinator overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Martyr overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Cynic overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Manipulator overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Overthinker overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Escapist overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Pessimist overshot | 1 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Catastrophizer overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Enabler overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Control Freak overshot | 0 | FHFF | FHFF | HHHF | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Sacral Drifter overshot | 0 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Sacral Striker overshot | 0 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Solar Striker overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Heart Mourner overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Heart Recoiler overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Throat Recoiler overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Crown Striker overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Crown Mourner overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Diffuse Freezer overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Diffuse Bracer overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Diffuse Startler overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Diffuse Recoiler overshot | 1 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |
| Diffuse Hider overshot | 0 | FHFH | FHFH | HHHH | drill prints the fixed "Jouissance" line and the axis opposite; kbSabBlock finds no SABDEF row under this name, so no card prints |

### Hyper complex, family (6)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Grandiosity | 5 | HHFF | HHHF | HHHF | d is one clause (60 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |
| Predatory | 4 | HHFF | HHHF | HHHF | d is one clause (72 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |
| Collapse | 7 | HHFF | HHHF | HHHF | d is one clause (47 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |
| Rigidity | 5 | HHFF | HHHF | HHHF | d is one clause (49 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |
| Dysregulation | 3 | HHFF | HHHF | HHHF | d is one clause (65 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |
| Dissociation | 1 | HHFF | HHHF | HHHF | d is one clause (47 chars); full behaviour/trigger/scene/practice/inverse exists only in proto/knowledge/src/gen-data.js HYPERCOMPLEX_MODES, not in the engine |

### Hyper complex, overshoot (6)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Numbness | 0 | FHFF | HHFF | HHFF | prints the generated line "the fix for dysregulation, done past the point where it helps" |
| Mania | 1 | FHFF | HHFF | HHFF | prints the generated line "the fix for collapse, done past the point where it helps" |
| Indiscriminate | 1 | FHFF | HHFF | HHFF | prints the generated line "the fix for rigidity, done past the point where it helps" |
| Enabling | 0 | FHFF | HHFF | HHFF | prints the generated line "the fix for predatory, done past the point where it helps" |
| Self-erasure | 0 | FHFF | HHFF | HHFF | prints the generated line "the fix for grandiosity, done past the point where it helps" |
| Enmeshment | 0 | FHFF | HHFF | HHFF | prints the generated line "the fix for dissociation, done past the point where it helps" |

### Descent (complex) (1)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Narcissism | 0 | PHHH | PHHH | HHFF | research passes 3 of 4; reviewStatus "external-research-pass-A-done; semantic-pass-B-and-adversarial-pass-C-pending" |

### Descent (hyper complex) (2)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Machiavellianism | 1 | PHHH | PHHH | HHFF | research passes 3 of 4; reviewStatus "external-research-pass-A-done; semantic-pass-B-and-adversarial-pass-C-pending" |
| Sociopathy | 0 | PHFH | PHFH | HHFF | research passes 0 of 4; reviewStatus "owner-placed 26 October; template and research passes not written" |

### Descent (super complex) (1)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Psychopathy | 2 | PPHH | PPHH | HHFF | research passes 3 of 4; reviewStatus "external-research-pass-A-partial; source model wording requires expert review; semantic-pass-B-and-adversarial-pass-C-pending" |

### Axis (child emotion) (9)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Fear | - | FPHF | FPHF | FPHF | letting go card "I am stuck. I am trapped."; no definition field; CHALLENGE.when "Before something you would rather not do." |
| Anger | - | FPHF | FPHF | FPHF | letting go card "This is wrong. Move."; no definition field; CHALLENGE.when "When you feel heat in your face or your hands." |
| Shame | - | FPHF | FPHF | FPHF | letting go card "I am not worthy."; no definition field; CHALLENGE.when "When you want to hide what you did or who you are." |
| Disgust | - | FPHF | FPHF | FPHF | letting go card "Things are not as they should be."; no definition field; CHALLENGE.when "When you want to push something or someone away." |
| Apathy | - | FPHF | FPHF | FPHF | letting go card "What is the point."; no definition field; CHALLENGE.when "When nothing feels worth starting." |
| Shock | - | FPHF | FPHF | FPHF | letting go card "This should not be happening."; no definition field; CHALLENGE.when "When your body goes still and your mind goes blank." |
| Sad | - | FPHF | FPHF | FPHF | letting go card "I cannot have what I want."; no definition field; CHALLENGE.when "When the old loss comes back up." |
| Surprise | - | FPHF | FPHF | FPHF | NO letting go card in AXCARD (two cards, 05 and 06, carry no axis); no definition field; CHALLENGE.when "When something lands that you did not see coming." |
| Anticipation | - | FPHF | FPHF | FPHF | NO letting go card in AXCARD (two cards, 05 and 06, carry no axis); no definition field; CHALLENGE.when "When you are already braced for the worst." |

### Fetter address (108)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| 1 Fear | - | FHFF | HHHF | HHHF | theme "Instinct, threat", distortion "Avoidance" |
| 2 Shame | - | FHFF | HHHF | HHHF | theme "Worth, embodiment", distortion "Self-rejection" |
| 3 Guilt | - | FHFF | HHHF | HHHF | theme "Responsibility", distortion "Overcompensation" |
| 4 Control | - | FHFF | HHHF | HHHF | theme "Safety through force", distortion "Domination" |
| 5 Insecurity | - | FHFF | HHHF | HHHF | theme "Belonging", distortion "Dependency" |
| 6 Victimhood | - | FHFF | HHHF | HHHF | theme "Agency", distortion "Blame" |
| 7 Scarcity | - | FHFF | HHHF | HHHF | theme "Resources", distortion "Hoarding" |
| 8 Root_08_Unnamed | - | FHFF | HHHF | HHHF | theme "Privilege", distortion "Deservingness"; no axis |
| 9 Possession | - | FHFF | HHHF | HHHF | theme "Attachment", distortion "Control of objects" |
| 10 Lethargy | - | FHFF | HHHF | HHHF | theme "Momentum", distortion "Stagnation" |
| 11 Resistance | - | FHFF | HHHF | HHHF | theme "Change", distortion "Holding on" |
| 12 Compulsion | - | FHFF | HHHF | HHHF | theme "Safety rituals", distortion "Fixation" |
| 13 Disconnection | - | FHFF | HHHF | HHHF | theme "Presence", distortion "Numbness" |
| 14 Escapism | - | FHFF | HHHF | HHHF | theme "Facing pain", distortion "Running" |
| 15 Panic | - | FHFF | HHHF | HHHF | theme "Reaction", distortion "Unconsciousness" |
| 16 Collapse | - | FHFF | HHHF | HHHF | theme "Structure", distortion "Abandoning Self" |
| 17 Addiction | - | FHFF | HHHF | HHHF | theme "Craving", distortion "Obsession" |
| 18 Lust | - | FHFF | HHHF | HHHF | theme "Desire", distortion "Objectification" |
| 19 Envy | - | FHFF | HHHF | HHHF | theme "Lack", distortion "Hatred of others' joy" |
| 20 Jealousy | - | FHFF | HHHF | HHHF | theme "Possessiveness", distortion "Paranoia" |
| 21 Co-Dependency | - | FHFF | HHHF | HHHF | theme "Neediness", distortion "Self-abandonment" |
| 22 Shame Of Desire | - | FHFF | HHHF | HHHF | theme "Repression", distortion "Suppression" |
| 23 Hypersexuality | - | FHFF | HHHF | HHHF | theme "Validation", distortion "Dissociation" |
| 24 Avoidance Of Pleasure | - | FHFF | HHHF | HHHF | theme "Sensuality", distortion "Denial of life" |
| 25 Manipulation Through Emotion | - | FHFF | HHHF | HHHF | theme "Control", distortion "Emotional blackmail" |
| 26 Oversensitivity | - | FHFF | HHHF | HHHF | theme "Pain threshold", distortion "Victim reactivity" |
| 27 Fantasy | - | FHFF | HHHF | HHHF | theme "Escapism", distortion "Delusion" |
| 28 Infatuation | - | FHFF | HHHF | HHHF | theme "Projection", distortion "Idealization" |
| 29 Obsession | - | FHFF | HHHF | HHHF | theme "Focus", distortion "Fixation" |
| 30 Guilt Of Pleasure | - | FHFF | HHHF | HHHF | theme "Joy", distortion "Self-denial" |
| 31 Need For Approval | - | FHFF | HHHF | HHHF | theme "Identity in others", distortion "Conformity" |
| 32 Excess Emotion | - | FHFF | HHHF | HHHF | theme "Drama", distortion "Flooding" |
| 33 Pride | - | FHFF | HHHF | HHHF | theme "Self-importance", distortion "Superiority" |
| 34 Arrogance | - | FHFF | HHHF | HHHF | theme "Ego", distortion "Inflated Self" |
| 35 Competition | - | FHFF | HHHF | HHHF | theme "Comparison", distortion "Division" |
| 36 Anger | - | FHFF | HHHF | HHHF | theme "Power misused", distortion "Attack" |
| 37 Judgment | - | FHFF | HHHF | HHHF | theme "Othering", distortion "Projection" |
| 38 Entitlement | - | FHFF | HHHF | HHHF | theme "Control of outcomes", distortion "Deserving" |
| 39 Rebellion | - | FHFF | HHHF | HHHF | theme "Defiance", distortion "Misalignment" |
| 40 Perfectionism | - | FHFF | HHHF | HHHF | theme "Idealism", distortion "Rigidity" |
| 41 Force | - | FHFF | HHHF | HHHF | theme "Control over flow", distortion "Overpowering" |
| 42 Rigidity | - | FHFF | HHHF | HHHF | theme "Will", distortion "Inflexibility" |
| 43 Resentment (Solar) | - | FHFF | HHHF | HHHF | theme "Grudge", distortion "Recycled anger" |
| 44 Unworthiness | - | FHFF | HHHF | HHHF | theme "Confidence", distortion "Minimization" |
| 45 Anxiety | - | FHFF | HHHF | HHHF | theme "Control of outcomes", distortion "Future fear" |
| 46 Self-Judgment (Solar) | - | FHFF | HHHF | HHHF | theme "Inner war", distortion "Invalidation" |
| 47 Need To Win | - | FHFF | HHHF | HHHF | theme "Ego", distortion "Domination" |
| 48 Superiority | - | FHFF | HHHF | HHHF | theme "Hierarchy", distortion "Distinction" |
| 49 Hatred | - | FHFF | HHHF | HHHF | theme "Forgiveness", distortion "Vengeance" |
| 50 Resentment (Heart) | - | FHFF | HHHF | HHHF | theme "Holding pain", distortion "Withholding love" |
| 51 Self-Judgment (Heart) | - | FHFF | HHHF | HHHF | theme "Grace", distortion "Harshness" |
| 52 Betrayal | - | FHFF | HHHF | HHHF | theme "Trust", distortion "Abandonment" |
| 53 Separation | - | FHFF | HHHF | HHHF | theme "Unity", distortion "Isolation" |
| 54 Martyrdom | - | FHFF | HHHF | HHHF | theme "Self-sacrifice", distortion "Guilt-driven love" |
| 55 Longing | - | FHFF | HHHF | HHHF | theme "Presence", distortion "Fantasy" |
| 56 Closed Heart | - | FHFF | HHHF | HHHF | theme "Vulnerability", distortion "Armor" |
| 57 Manipulative Kindness | - | FHFF | HHHF | HHHF | theme "Motive", distortion "Transactional giving" |
| 58 Expectation | - | FHFF | HHHF | HHHF | theme "Outcome", distortion "Contractual love" |
| 59 Blame | - | FHFF | HHHF | HHHF | theme "Responsibility", distortion "Externalization" |
| 60 False Love | - | FHFF | HHHF | HHHF | theme "Image", distortion "Projection" |
| 61 Rejection | - | FHFF | HHHF | HHHF | theme "Inclusion", distortion "Othering" |
| 62 Avoidance Of Grief | - | FHFF | HHHF | HHHF | theme "Loss", distortion "Suppression" |
| 63 Need To Be Needed | - | FHFF | HHHF | HHHF | theme "Identity", distortion "Validation" |
| 64 Deceit | - | FHFF | HHHF | HHHF | theme "Honesty", distortion "Manipulation" |
| 65 Self-Silencing | - | FHFF | HHHF | HHHF | theme "Voice", distortion "Withholding" |
| 66 People Pleasing | - | FHFF | HHHF | HHHF | theme "Approval", distortion "Inauthenticity" |
| 67 Lying | - | FHFF | HHHF | HHHF | theme "Integrity", distortion "Protection" |
| 68 Interrupting | - | FHFF | HHHF | HHHF | theme "Listening", distortion "Imposition" |
| 69 Comparison | - | FHFF | HHHF | HHHF | theme "Voice Identity", distortion "Envy" |
| 70 Excuse | - | FHFF | HHHF | HHHF | theme "Ownership", distortion "Victimization" |
| 71 Stage Performing | - | FHFF | HHHF | HHHF | theme "Image", distortion "Persona" |
| 72 Speaking To Be Right | - | FHFF | HHHF | HHHF | theme "Ego", distortion "Righteousness" |
| 73 Manic Expression | - | FHFF | HHHF | HHHF | theme "Over-talking", distortion "Energy discharge" |
| 74 Talking To Avoid Feeling | - | FHFF | HHHF | HHHF | theme "Presence", distortion "Avoidance" |
| 75 Spiritual Language To Manipulate | - | FHFF | HHHF | HHHF | theme "Belonging", distortion "Performance" |
| 76 Delusion | - | FHFF | HHHF | HHHF | theme "Truth", distortion "Illusion" |
| 77 Cynicism | - | FHFF | HHHF | HHHF | theme "Clarity", distortion "Dismissal" |
| 78 Distrust | - | FHFF | HHHF | HHHF | theme "Faith", distortion "Suspicion" |
| 79 Hypervigilance | - | FHFF | HHHF | HHHF | theme "Control", distortion "Overthinking" |
| 80 Dogma | - | FHFF | HHHF | HHHF | theme "Belief", distortion "Rigidity" |
| 81 Overanalysis | - | FHFF | HHHF | HHHF | theme "Clarity", distortion "Paralysis" |
| 82 Projection | - | FHFF | HHHF | HHHF | theme "Othering", distortion "Blame" |
| 83 Paranoia | - | FHFF | HHHF | HHHF | theme "Fear", distortion "Narrative spinning" |
| 84 Distortion | - | FHFF | HHHF | HHHF | theme "Reality", distortion "Mis-seeing" |
| 85 Doubt | - | FHFF | HHHF | HHHF | theme "Intuition", distortion "Dismissal" |
| 86 Idealism | - | FHFF | HHHF | HHHF | theme "Fantasy", distortion "Denial of reality" |
| 87 Lack Of Discernment | - | FHFF | HHHF | HHHF | theme "Perception", distortion "Blind trust" |
| 88 Doubt Of God | - | FHFF | HHHF | HHHF | theme "Faith", distortion "Separation" |
| 89 Hubris | - | FHFF | HHHF | HHHF | theme "Alignment", distortion "Ego-God complex" |
| 90 Spiritual Pride | - | FHFF | HHHF | HHHF | theme "Insight", distortion "Superiority" |
| 91 Nihilism | - | FHFF | HHHF | HHHF | theme "Meaning", distortion "Apathy" |
| 92 Spiritual Escapism | - | FHFF | HHHF | HHHF | theme "Presence", distortion "Bypass" |
| 93 False Humility | - | FHFF | HHHF | HHHF | theme "Disguise", distortion "Manipulation" |
| 94 Seeking Validation | - | FHFF | HHHF | HHHF | theme "Ego", distortion "Worship addiction" |
| 95 Savior Complex | - | FHFF | HHHF | HHHF | theme "Responsibility", distortion "Overreach" |
| 96 Condemnation | - | FHFF | HHHF | HHHF | theme "Mercy", distortion "Judgment" |
| 97 Need To Be Special | - | FHFF | HHHF | HHHF | theme "Identity", distortion "Distinction" |
| 98 Unworthy Of God | - | FHFF | HHHF | HHHF | theme "Divinity", distortion "Disbelief" |
| 99 Knowing Better Than God | - | FHFF | HHHF | HHHF | theme "Will", distortion "Arrogance" |
| 100 Denial Of Truth | - | FHFF | HHHF | HHHF | theme "Insight", distortion "Resistance" |
| 101 Rejection Of Spirit | - | FHFF | HHHF | HHHF | theme "Divinity", distortion "Abandonment" |
| 102 Fear Of God | - | FHFF | HHHF | HHHF | theme "Love", distortion "Dread" |
| 103 Anger At God | - | FHFF | HHHF | HHHF | theme "Trust", distortion "Rebellion" |
| 104 Forgetfulness | - | FHFF | HHHF | HHHF | theme "Identity", distortion "Amnesia" |
| 105 Denial Of Light | - | FHFF | HHHF | HHHF | theme "Revelation", distortion "Avoidance" |
| 106 Rejection Of Unity | - | FHFF | HHHF | HHHF | theme "Connection", distortion "Separation" |
| 107 Self-Exclusion | - | FHFF | HHHF | HHHF | theme "Belonging", distortion "Disconnection" |
| 108 Endless Seeking | - | FHFF | HHHF | HHHF | theme "Arrival", distortion "Never enough" |

### Field anchor (4)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Sol Star | - | HHNF | HHNF | HHNF | role record, not a behaviour pattern; the fetter standard gives anchors their own role standard |
| Stellar Gateway | - | HHNF | HHNF | HHNF | role record, not a behaviour pattern; the fetter standard gives anchors their own role standard |
| Earth Star | - | HHNF | HHNF | HHNF | role record, not a behaviour pattern; the fetter standard gives anchors their own role standard |
| Gaia Gateway | - | HHNF | HHNF | HHNF | role record, not a behaviour pattern; the fetter standard gives anchors their own role standard |

### Mask (6)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Child | - | HHHF | HHHF | HHHF | v "gets small so somebody else decides" |
| Preteen | - | HHHF | HHHF | HHHF | v "checks the room before it says the thing" |
| Teen | - | HHHF | HHHF | HHHF | v "pushes back on the person, not the problem" |
| Adult | - | HHHF | HHHF | HHHF | v "handles it, and files what it cost" |
| Professional | - | HHHF | HHHF | HHHF | v "performs competence until the feeling passes"; hidden from the reading (MASKS_READ) |
| Ideological | - | HHHF | HHHF | HHHF | v "answers from the position instead of the moment" |

### Archetype (12)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Warrior | - | HHHF | HHHF | HHHF | v "moves on the threat", d "Acts first and reads the damage after."; ARCH18 shadow Micromanager |
| Sage | - | HHHF | HHHF | HHHF | v "reads the situation", d "Stops to work out what is true before it moves."; ARCH18 shadow Hyper-Rational |
| Rebel | - | HHHF | HHHF | HHHF | v "refuses the frame", d "Pushes back on a rule it never agreed to." |
| Caregiver | - | HHHF | HHHF | HHHF | v "attends to the other", d "Puts its own plans down to help somebody else carry theirs."; ARCH18 shadow Pleaser |
| Creator | - | HHHF | HHHF | HHHF | v "makes the thing", d "Builds what is missing out of what is lying around."; ARCH18 shadow Stickler |
| Magician | - | HHHF | HHHF | HHHF | v "changes the conditions", d "Moves the setup so the problem stops on its own."; ARCH18 shadow Victim |
| Ruler | - | HHHF | HHHF | HHHF | v "orders the field", d "Sets the order so everyone moves together."; ARCH18 shadow Hyper-Achiever |
| Explorer | - | HHHF | HHHF | HHHF | v "goes to the edge", d "Keeps going past where the path ran out."; ARCH18 shadow Avoider |
| Lover | - | HHHF | HHHF | HHHF | v "closes the distance", d "Moves toward the person and says what it feels."; ARCH18 shadow Hyper-Vigilant |
| Jester | - | HHHF | HHHF | HHHF | v "breaks the tension", d "Lets the pressure out of a heavy room."; ARCH18 shadow Avoider |
| Everyman | - | HHHF | HHHF | HHHF | v "stays with the room", d "Fits in with the group and keeps it in one piece."; ARCH18 shadow Pleaser |
| Innocent | - | HHHF | HHHF | HHHF | v "takes it at face value", d "Hears what was said exactly as it was said."; ARCH18 shadow Restless |

### Domain (19)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Knowledge | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Justice | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Imperium | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Duty | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Fate | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Power | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Creation | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Dissolution | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Descent | - | HHFF | HHFF | HHFF | no DOMDEF row (renamed in the codex, KB_RENAME) |
| Death | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Connection | - | HHFF | HHFF | HHFF | no DOMDEF row (renamed in the codex, KB_RENAME) |
| Exchange | - | HHFF | HHFF | HHFF | no DOMDEF row (renamed in the codex, KB_RENAME) |
| Restoration | - | HHFF | HHFF | HHFF | no DOMDEF row (renamed in the codex, KB_RENAME) |
| Provision | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Play | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Nature | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Trickster | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Mystery | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |
| Guardian | - | HPHF | HPHF | HPHF | clear and distorted read as noun lists |

### Law of action (gate) (6)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Awareness | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |
| Detachment | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |
| Intention | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |
| Ignorance | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |
| Attachment | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |
| Aversion | - | HHHF | HHHH | HHHH | first person sentence, read against its opposite |

### Compass pole and recipe (14)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Jesus / Lucifer | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Ramakrishna / Asmodeus | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Moses / Set | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Musashi / Moloch | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Buddha / Geryon | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Rumi / Charon | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Elijah / Phlegyas | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Jesus / The Furies | - | PPHH | PPHH | PPHH | source codex; recipe marked first draft |
| Krishna / Kaliya | - | PHHH | PHHH | PHHH | source research; recipe marked first draft |
| Rama / Ravana | - | PHHH | PHHH | PHHH | source research; recipe marked first draft |
| Lao Tzu / Shu and Hu | - | PHHH | PHHH | PHHH | source research; recipe marked first draft |
| Akhenaten / Apep | - | HHHH | HHHH | HHHH | source proposed; recipe marked first draft; no codex line for either end |
| Zoroaster / The Lie | - | HHHH | HHHH | HHHH | source proposed; recipe marked first draft; no codex line for either end |
| Confucius / The farmer of Song | - | HHHH | HHHH | HHHH | source proposed; recipe marked first draft; no codex line for either end |

### Circle of the descent (9)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| 1 Limbo | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 2 Lust | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 3 Gluttony | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 4 Greed | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 5 Wrath and sloth | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 6 Heresy | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 7 Violence | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 8 Fraud | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |
| 9 Treachery | - | HHHH | HHHH | HHHH | drill: what you might recognise, what it is, where it sits |

### Governor corner (5)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| The Devil | - | HHHF | HHHF | HHHF | d prints as a hover title; a summary paragraph prints for all five |
| The Demon | - | HHHF | HHHF | HHHF | d prints as a hover title; a summary paragraph prints for all five |
| Turned inward | - | HHHF | HHHF | HHHF | d prints as a hover title; a summary paragraph prints for all five |
| The Storm | - | HHHF | HHHF | HHHF | d prints as a hover title; a summary paragraph prints for all five |
| Angel | - | HHHF | HHHF | HHHF | d prints as a hover title; a summary paragraph prints for all five |

### Blueprint inversion (4)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| Malak | - | HHHF | HHHF | HFFF | d prints only as a hover title in the dark half of the compass drill |
| Baal | - | HHHF | HHHF | HFFF | d prints only as a hover title in the dark half of the compass drill |
| Set | - | HHHF | HHHF | HFFF | d prints only as a hover title in the dark half of the compass drill |
| Lucifer | - | HHHF | HHHF | HFFF | d prints only as a hover title in the dark half of the compass drill |

### Cascade state (6)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| The Zombie | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |
| The Drone | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |
| The NPC | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |
| The Energy Vampire | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |
| The Demon | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |
| The Devil | - | HFHF | HFHF | FFFF | no renderer reads CASCADE |

### Blueprint line (70)

| Record | Seen | A | B | C | Note |
|---|---|---|---|---|---|
| SIGN_RUNS Aries | - | HHHF | HHHF | HHHF | "starts before it is ready and finds out by moving"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Taurus | - | HHHF | HHHF | HHHF | "holds position until the thing is actually built"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Gemini | - | HHHF | HHHF | HHHF | "takes in more channels than it closes"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Cancer | - | HHHF | HHHF | HHHF | "protects first, then decides whether to"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Leo | - | HHHF | HHHF | HHHF | "needs the work to be seen or it stops feeling real"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Virgo | - | HHHF | HHHF | HHHF | "corrects the detail that nobody asked about"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Libra | - | HHHF | HHHF | HHHF | "waits for the balance point and pays for the wait"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Scorpio | - | HHHF | HHHF | HHHF | "goes all the way down or does not go"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Sagittarius | - | HHHF | HHHF | HHHF | "widens the frame until the problem looks smaller"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Capricorn | - | HHHF | HHHF | HHHF | "builds the structure and then lives inside it"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Aquarius | - | HHHF | HHHF | HHHF | "stands outside the group to see it"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| SIGN_RUNS Pisces | - | HHHF | HHHF | HHHF | "dissolves the boundary and absorbs what is there"; a four pass record exists in reboot-os western_astrology/records.json, four passes, owner approval false |
| CH_RUNS Rat | - | HHHF | HHHF | HHHF | "reads the room and moves first"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Ox | - | HHHF | HHHF | HHHF | "carries the weight without renegotiating"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Tiger | - | HHHF | HHHF | HHHF | "takes the risk and deals with it after"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Rabbit | - | HHHF | HHHF | HHHF | "avoids the collision and keeps the relationship"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Dragon | - | HHHF | HHHF | HHHF | "occupies more space than was offered"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Snake | - | FHFF | HHHF | HHHF | "waits, then acts once"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Horse | - | HHHF | HHHF | HHHF | "moves to relieve pressure"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Goat | - | HHHF | HHHF | HHHF | "yields on the surface, holds underneath"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Monkey | - | HHHF | HHHF | HHHF | "finds the shortcut and takes it"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Rooster | - | FHFF | HHHF | HHHF | "names the thing out loud"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Dog | - | HHHF | HHHF | HHHF | "stays loyal past the point of evidence"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CH_RUNS Pig | - | HHHF | HHHF | HHHF | "gives more than the exchange required"; a four pass record exists in reboot-os eastern_astrology/animals.json |
| CE_RUNS Wood | - | HHHF | HHHF | HHHF | "grows outward and needs room"; a four pass record exists in reboot-os eastern_astrology/phases.json |
| CE_RUNS Fire | - | HHHF | HHHF | HHHF | "burns bright and needs fuel"; a four pass record exists in reboot-os eastern_astrology/phases.json |
| CE_RUNS Earth | - | HHHF | HHHF | HHHF | "stabilises and resists moving"; a four pass record exists in reboot-os eastern_astrology/phases.json |
| CE_RUNS Metal | - | HHHF | HHHF | HHHF | "cuts clean and holds an edge"; a four pass record exists in reboot-os eastern_astrology/phases.json |
| CE_RUNS Water | - | HHHF | HHHF | HHHF | "finds the low route and gets there"; a four pass record exists in reboot-os eastern_astrology/phases.json |
| LP_RUNS 1 | - | HHHF | HHHF | HHHF | "goes first, alone if needed" |
| LP_RUNS 2 | - | HHHF | HHHF | HHHF | "joins and holds the pair together" |
| LP_RUNS 3 | - | HHHF | HHHF | HHHF | "expresses it before it is finished" |
| LP_RUNS 4 | - | HHHF | HHHF | HHHF | "builds a thing that outlasts the builder" |
| LP_RUNS 5 | - | HHHF | HHHF | HHHF | "moves before the walls close" |
| LP_RUNS 6 | - | HHHF | HHHF | HHHF | "tends the people and forgets the self" |
| LP_RUNS 7 | - | HHHF | HHHF | HHHF | "looks at it until it makes sense" |
| LP_RUNS 8 | - | HHHF | HHHF | HHHF | "commands the structure and pays for it" |
| LP_RUNS 9 | - | HHHF | HHHF | HHHF | "completes what others abandoned" |
| LP_RUNS 11 | - | HHHF | HHHF | HHHF | "channels more than it can hold" |
| LP_RUNS 22 | - | HHHF | HHHF | HHHF | "makes the imagined thing physical" |
| LP_RUNS 33 | - | HHHF | HHHF | HHHF | "teaches by carrying it first" |
| HD_RUNS Manifestor | - | HHHF | HHHF | HHHF | "initiates without waiting. the cost is the resistance it creates" |
| HD_RUNS Generator | - | HHHF | HHHF | HHHF | "responds to what is in front of it and sustains" |
| HD_RUNS Manifesting Generator | - | HHHF | HHHF | HHHF | "responds, then moves faster than the response expected" |
| HD_RUNS Projector | - | HHHF | HHHF | HHHF | "sees the system before it is invited into it" |
| HD_RUNS Reflector | - | HHHF | HHHF | HHHF | "takes the temperature of the room and returns it" |
| HD_LINE_RUNS 1 | - | HHHF | HHHF | HHHF | "studies the ground before standing on it" |
| HD_LINE_RUNS 2 | - | HHHF | HHHF | HHHF | "does its best work alone, until somebody calls it out" |
| HD_LINE_RUNS 3 | - | FHFF | HHHF | HHHF | "learns by what breaks" |
| HD_LINE_RUNS 4 | - | HHHF | HHHF | HHHF | "moves through the people it already knows" |
| HD_LINE_RUNS 5 | - | HHHF | HHHF | HHHF | "gets handed other people’s hopes, and a practical fix" |
| HD_LINE_RUNS 6 | - | HHHF | HHHF | HHHF | "tries everything first, then steps back and shows the way" |
| ROOT_SAYS Fire | - | HHHF | HHHF | HHHF | "You run hot. You start things, burn bright and need something to burn." |
| ROOT_SAYS Earth | - | HHHF | HHHF | HHHF | "You steady things. You hold your ground and take time to be moved." |
| ROOT_SAYS Water | - | HHHF | HHHF | HHHF | "You find the low route. You go around what blocks you and still arrive." |
| ROOT_SAYS Wood | - | HHHF | HHHF | HHHF | "You grow toward room. You push outward and need space to do it." |
| ROOT_SAYS Metal | - | HHHF | HHHF | HHHF | "You cut clean. You hold an edge and know where the line is." |
| ROOT_SAYS Sun | - | HHHF | HHHF | HHHF | "You need to be the one doing it, and to be seen doing it." |
| ROOT_SAYS Moon | - | HHHF | HHHF | HHHF | "You run on feeling first and check the facts after." |
| ROOT_SAYS Mercury | - | HHHF | HHHF | HHHF | "You think out loud and move on fast." |
| ROOT_SAYS Venus | - | HHHF | HHHF | HHHF | "You weigh things by how they sit between people." |
| ROOT_SAYS Mars | - | HHHF | HHHF | HHHF | "You go at the problem head on, and early." |
| ROOT_SAYS Jupiter | - | HHHF | HHHF | HHHF | "You widen the frame until the problem looks smaller." |
| ROOT_SAYS Saturn | - | HHHF | HHHF | HHHF | "You build the structure first and carry its weight." |
| ROOT_SAYS Uranus | - | HHHF | HHHF | HHHF | "You break the pattern to see what it was holding." |
| ROOT_SAYS Neptune | - | HHHF | HHHF | HHHF | "You soften the edge between you and what you take in." |
| NUM_DEBT_SAYS 13 | - | HHHF | HHHF | HHHF | "Work refused earlier. The way out is the work, done plainly and without a shortcut." |
| NUM_DEBT_SAYS 14 | - | HHHF | HHHF | HHHF | "Freedom taken at somebody else’s cost. The way out is a limit you set yourself." |
| NUM_DEBT_SAYS 16 | - | HHHF | HHHF | HHHF | "Something built on a false footing, and it comes down. The way out is being seen as you are." |
| NUM_DEBT_SAYS 19 | - | HHHF | HHHF | HHHF | "Power used alone. The way out is needing somebody." |
