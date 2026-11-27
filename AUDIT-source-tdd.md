# SOURCE-TDD.md audited against the real build

Round MW's own required step, its section 42: read, then audit against
the actual implementation before any code changes, status EXISTS,
PARTIAL, MISSING, CONFLICT or UNVERIFIED with file:line evidence, never
implemented blind. No code was changed producing this; two of its most
consequential claims were independently re-verified directly against
`compute.js` before being trusted (below).

Read in full: `SOURCE-TDD.md`, `CLAUDE.md`, the engine (`compute.js`,
`sourceai.js`, `sniff.js`, `schema.js`, `core.js`, `lexicon.js`,
`birth.js`, `overlap.js`, `outbox.js`, `verp.js`), the canon tables
(`canon.js`, `nodes.js`), the relevant UI (`storyui.js`, `release.js`,
`drills.js`, `knowledge.js`), `reviews/SPEC-source-ai.md`, `DECISIONS.md`
and `tests/engine.js`.

## Build identity

The TDD cites build v979, commit 734fc47. That commit is 13 commits
behind HEAD and the engine is byte-identical across that gap
(`git diff --stat 734fc47 HEAD -- atuned_src/engine` is empty), so
nothing in the TDD's own description of the current build is stale.
`node tests/engine.js` at HEAD: 1841 passed, 0 failed.

## 1. Major architectural claims, against the code

| TDD requirement | Status | Evidence | Gap |
|---|---|---|---|
| Canon / user record / server split | PARTIAL | Canon in `engine/data/*.js`; record shape `blankProfile` (`schema.js:14-105`); `outbox.js:27-35` refuses story, journal, imprints, history by name | No server code exists anywhere in the repo to audit; no "user lexicon" field |
| Charge > address > saboteur > complex > hyper > character | EXISTS | `compute.js:233-309` | Character is recomputed from current charge every time; the TDD wants it accumulated and distinguished from transient state |
| 112-address register canonical | EXISTS | `NODES.length` 112, `nodes.js` | none |
| Status on every structure (canonical/inferred/emergent/provisional) | PARTIAL | saboteurs flagged named/unnamed/diffuse/overshot (`core.js:21-35`, `compute.js:274-284`); imprints flagged inferred/stated (`sniff.js:395,412-415`) | No EMERGENT or PROVISIONAL state anywhere; complexes and hypers carry no status at all |
| Behavioural ontology, 22 primitives | MISSING | nearest is `MODE2NOTE` (`people.js:183`) | the whole layer is absent |
| Celestial engine | PARTIAL | real ephemeris (`astro.js`, `birth.js:49-92`), Eastern via Li Chun (`birth.js:99-112`), Human Design gates/lines only with type honestly left unresolved, numerology (`numerology.js`), a real null model for convergence (`overlap.js:45-57,103-111`) | Kabbalah missing; nothing routes through to behaviour; no mapping is versioned |
| Positive Intelligence attribution | EXISTS, already credited | `canon.js:302-304,316-317`; credited on screen `drills.js:181,616-620`, `ui.js:85` | see section 2 |
| Evidence model and confidence bands | PARTIAL | every saboteur row carries a 0-1 confidence and a citation (`sniff.js:808-859`); gates return null rather than guess (`sniff.js:958-981`) | no formal Evidence object, no repetition/recency/contradiction fields; confidences uncalibrated; see conflict on output thresholds below |
| Verification engine / evidence ledger | MISSING | the only person-originated signal is Source AI's "Move on" (never re-asked) and a heavy/felt mark at release | no hypothesis lifecycle, no ledger |
| Emergent Pattern Engine (the whole discovery layer) | MISSING, and largely not learnable from this data | see section 4 | — |
| No-invention rule | PARTIAL, already the practice | code returns null rather than guesses throughout; lexicon validator refuses unsourced entries (`lexicon.js:274-300`); Source AI never names an address, fetter or saboteur | spread across the code rather than one guard, because today there is no generator that would need guarding |
| Source AI boundary | EXISTS, more honest than the TDD's own description of it elsewhere | deterministic, no model, no network, `storyui.js:438-441`; full mechanism in `sourceai.js` | the TDD's own section 1 language ("prompt architecture") overclaims; that exists only as a spec in `reviews/SPEC-source-ai.md`, not as code |
| Versioning, reproducible history | PARTIAL | `SCHEMA_V=2`, `CQ_MODEL` stamped per history row (`schema.js:243`), lexicon has provenance | entries carry no lexicon/canon version, so re-parsing an old entry under a later lexicon silently changes its meaning; history rows store counts of saboteurs/complexes/hypers, not which ones, so nothing can be followed by identity over time |

Full line-by-line table (P0 through P4, the Emergent Pattern Engine's own
18 tasks) is in this round's own audit transcript; the condensed picture
above is what changes what gets built next.

## 2. The Positive Intelligence question, answered with data

The TDD's premise, that this engine should credit and align with Shirzad
Chamine's ten Positive Intelligence saboteurs, is already true and
already built: `SAB_PI` in `canon.js:316-317` names exactly those ten in
the same order, with the credit already on screen. The engine actually
carries three saboteur sources, not one list of 14 as skimmed: `SAB33`
(33 names by charge range), `SAB_LIB` (14 names by address membership,
only 7 of the 10 Positive Intelligence saboteurs reachable this way,
Hyper-Rational/Restless/Stickler cannot fire from an address at all), and
25 unnamed inferred clusters. 39 in all. The product is a superset with
its own extension mechanics, not a divergence from Positive Intelligence;
its attribution already meets what the TDD asks for.

## 3. Source AI, what is actually built

Fully deterministic, no model, no network, `engine/sourceai.js`: a rung
0 to 10 counting how often a story returns to the same seat, asking one
question at rung 7 or over, calling rung 10 the root, never asking twice,
never naming an address or saboteur. `storyui.js:438` states this on
screen: "Scripted. No model is called." The TDD's own section 39
describes this correctly; its section 1 overclaims a "prompt
architecture" that exists only as an unbuilt spec.

## 4. Can this product's own data actually support the Emergent Pattern
Engine as specified? Measured, not assumed

Two structural facts, each checked directly against `compute.js` rather
than taken on the audit's word:

- **An address's charge is not an independent signal.** Every in-body
  address's charge is its parent axis's charge times a fixed
  susceptibility times a band relief term (`compute.js:236`). Addresses
  that share a parent axis move together by construction. A discovery
  process run on this output would find the engine's own wiring and pass
  a naive shuffle test, not a real pattern in a person.
- **Text reaches very few distinct targets.** Across the lexicon, a
  story's words resolve to about 16 seat-and-fetter cells, each always
  producing the same address set. Of 112 addresses, 37 are reachable
  from text at all. The combinatorial search space the TDD's own section
  24 describes (6,216 address pairs, 227,920 triples) is real
  arithmetic; the data that would fill it is not there.

So most of the Emergent Pattern Engine, as specified, cannot be built
honestly from what this product collects today, independent of whether
it should be built at all.

## 5. Real conflicts found

- **A second network seam.** A population corpus and cross-person
  validation need a second outbound seam carrying story-derived data;
  `CLAUDE.md`'s own rule is the engine stays host free with exactly one
  seam, the record fetch at sign in.
- **Privacy rulings, narrower than the TDD assumes.** `DECISIONS.md`
  licenses aggregating word combinations to refine the lexicon, not
  cross-person pattern validation or storing raw text with timestamps
  and context, which the TDD's own corpus spec asks for and which
  re-identifies. This is the one finding that decides whether most of
  the rest matters, checked first for that reason.
- **Confidence bands on the output.** Already measured and rejected
  once: a cut line on the output recreates a cliff the product already
  found and moved away from (`sniff.js:808-817`, `canon.js:125-130|).
- **Voice.** The TDD's suggested language ("I wonder if...") cuts
  against the house rule, no soft wellness language, mechanical and
  precise.
- **Character as accumulated.** The TDD wants character to persist as an
  accumulated layer; the engine recomputes it fresh from current state
  every time (`compute.js:306-309`).

## 6. Terminology already in tension, before this document arrived

"Fetter" is used two ways already: the engine's own code means the nine
child axes; the owner and the UI mean the 112 addresses ("SQ is an
individual fetter, there are 112 that we track," `DECISIONS.md:1236`).
The TDD's own "ADDRESS / FETTER" wording would set the owner's meaning in
stone rather than the code's. "Band," "inferred," "candidate," "state,"
"jouissance" and "attachment" all already carry an established meaning in
this codebase that the TDD's own vocabulary either matches, narrows or
quietly redefines; the full list is in the audit transcript.

## 7. Two real, reproducible bugs found in passing, unrelated to whether
any of the above gets built, re-verified directly against `compute.js`
before being logged here

- **A saboteur can be named twice in one reading.** `compute.js:268-276`
  pushes saboteurs detected from `SAB33` (by charge range); `compute.js:
  277-284` separately pushes saboteurs from `ALL_SAB` (the address-based
  `SAB_LIB` plus the 25 unnamed clusters). Both push into the same list
  with no check against each other. Confirmed directly: nothing between
  the two loops filters by name.
- **A complex can pair a saboteur with itself.** `compute.js:294-297`
  groups saboteurs by family and pairs them two at a time in sorted
  order; when the bug above has already duplicated a name into two
  adjacent entries, the pairing produces a complex like "Aggressor +
  Aggressor." Confirmed directly as a mechanical consequence of the
  first bug: sorted-adjacent duplicates land in the same pair.

Neither was fixed here since this pass was audit only; both are cheap,
real fixes independent of the larger TDD question and are queued.

## 8. Open, his to rule

1. **Should new patterns be found across many people's data, or does
   this stay to word-combination aggregation only?** His own ruling
   licenses the narrower one; the TDD's Emergent Pattern Engine assumes
   the wider one. This decides whether most of section 4 above matters
   at all.
2. **Does "fetter" mean the 112 addresses or the nine child axes?** Both
   meanings are already live in different parts of the codebase and the
   product's own language to him.
3. **Is "jouissance" one word or two?** The product already uses it for
   the cure overshooting past the point where it helps; the TDD uses it
   for compulsive behaviour generally.
4. **Should a person ever see a weak/possible/probable/strong/verified
   label?** Already measured once that a cut line on the output creates
   a false cliff.
5. **Keep both saboteur lists (the 33 by charge range and the 14 by
   address) or merge them?** They can already name the same saboteur
   twice in one reading, bug 7 above.
6. **Should the 12 archetypes carry a source credit**, the way the
   Positive Intelligence saboteurs already do?
7. **Does "Move on" in Source AI count as anything at all?** His own
   words elsewhere: "if they want to move on, Source's job isn't to dig
   deeper, it's just to go cool." Recommendation: it counts as nothing,
   consistent with that ruling.

## Suggested order, if the P0 list above is worked

Rulings above first, since question 1 decides whether the Emergent
Pattern Engine is in scope at all. Then the two bugs in section 7,
since anything built on top of a double count inherits it. Then a single
shared negation fix (three separate negation handlers exist today and a
missed negation is the single largest false-positive source in a
somatic reading). Then a real evidence layer built above `sniffStory`
rather than inside `compute()`, per the port-do-not-rebuild rule. The
rest waits on the rulings above.

## Not covered this pass, named rather than silently skipped

The TDD's section 23 corpus fields checked one by one; the Masks and
Compass tables; whether heavy/felt marks actually persist to the
record; the browser gates; `SAB_PI` rendering checked on every surface
rather than two; the TDD's own section 41 test matrix row by row.
