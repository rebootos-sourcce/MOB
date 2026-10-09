# Sniffer audit review and strategy · 9 October 2026

Read this with `SNIFFER_SPEC.md` (what the sniffer must do), `DESIGN-sniffer.md`
(why it is built this way) and `TDD-sniffer.md` (how it is tested). The agent
rules are in `HANDSHAKE-sniffer.md`.

The owner supplied `ATUNED_SNIFFER_TDD_AND_GAP_AUDIT_2026-10-08.md` and a handoff
zip. This file is three things: what the audit says, checked line by line against
the code on `main`; what we will build for alpha, and what we will not; and the
order of work after alpha.

## 0 · The ground this was checked on

- Branch `main`, commit `f28aa36` (Block 1 merged, deploy run 37877522782 green and
  served in production). Not the audit's HTML artifact: the audit says plainly that
  `ATUNED_MVP_Recursive_Final.html` may differ from any branch.
- One engine: `atuned_src/engine/sniff.js` (aggregate `sniffStory`, scanner
  `scanStory`, parser `parseStory`) and `atuned_src/engine/lexicon.js` (the word
  table). Nothing in the funnel, the Worker or the Source AI copies them.
- Probe, run against the built `engine.js` on `main`, pairs that must differ:

| Pair | Axis read | Verdict |
|---|---|---|
| "I was angry" / "I was not angry" | Anger 6.0 both | **Same. Defect.** |
| "I am sad" / "I am not sad" | Sad 5.2 both | **Same. Defect.** |
| "I am ashamed" / "I am no longer ashamed" | Shame 6.7 both | **Same. Defect.** |
| "I shouted at him" / "he shouted at me" | Anger 8.0 both | **Same. Breaks guard 2.** |
| "she lied to me" / "I lied to her" | Disgust 8.0 both | **Same. Breaks guard 2.** |
| "he is furious" / "I am furious" | Anger 8.0 both | **Same. Breaks guard 2.** |
| "I used to panic" / "I panic every day" | Fear 9.2 both | Same. Gap (tense). |
| "a bit sad" / "unbearably sad" | Sad 5.2 both | Same. Gap (modifier). |

Every directly reported pair in the audit reproduces on `main`.

## 1 · What the audit gets right, wrong, and half right

| Audit claim | Checked on `main` | Result |
|---|---|---|
| Primary path does not read negation (13.1.1) | Reproduced above. `parseStory` still charges "not sad". | **Confirmed** |
| The Story page already draws a negated word struck through | True: `stMarks` in `ui/storyui.js` calls `srcNegated` with `clauseFloor` and strikes the mark. The score still counts it. | **New finding: the picture and the score disagree.** A word shown as set aside is still charged. |
| Subject / actor attribution missing (13.1.2) | Reproduced above. The law path documents the same hole (`sniffLaws`: "she lied to me fires Truth on the writer"). | **Confirmed** |
| Tense missing (13.1.3) | Reproduced. | **Confirmed** |
| Modifiers "missing / incomplete" (13.1.4) | **Half right.** A modifier table exists (`h.mod`, `h.modw`; "I am so scared" 24.3, "slightly scared" 10.8). "a bit" and "unbearably" are not in it, and `sniffAxes` does not read `mod`. | **Corrected: partial, not absent** |
| Frame layer missing (13.1.5) | Specified, deliberately not built (needs a held set). `DESIGN-sniffer.md` says so. | **Confirmed, and already known** |
| Unsupported inferred addresses (13.1.6) | `sniffOffer` returns `address:null` rather than inventing one. Renderer wording not yet audited. | **Open: audit every renderer** |
| `sniffStory` not on the normal path (13.1.7) | `grep` of `ui/`: only `ui/tutorial.js:283` calls it. The Story page reads `parseStory`, `marksOf`, `unmarkedOf`, `srcHear`. | **Confirmed** |
| Nature and Human nature unread (13.1.8) | `gaps.nature = 0`, `gaps.human = 0`, and the four source files are listed in `gaps.missing`. | **Confirmed, and reported honestly in the output** |
| Four depth circles unkeyed (13.1.9) | `gaps.circles = 9`, `circlesKeyed = 4`. | **Confirmed, reported in the output** |
| Saboteur list truncated to six (13.1.10) | `sniffStory` does `sniffSaboteurs(axes).slice(0,SAB_SHOW)`. | **Confirmed. Fix is one line plus a UI slice** |
| CQ / law table conflict (13.1.11) | Open in `DESIGN-sniffer.md` as ruling 1 (E43, divisor 21 or 20). | **Confirmed, owner's canon** |
| Coherent score is field level on every axis (13.1.12) | `sniffAxes` repeats one field level `coherent` per row; `coherentBecause` says so. | **Confirmed, honest as shipped** |
| Four canon files missing (13.1.13) | `gaps.missing` lists them. | **Confirmed. Do not recreate from memory** |
| Address table conflicts (13.1.14) | `DESIGN-sniffer.md` rulings 3 and 5 (Joy, Surprise). | **Confirmed, owner's canon** |
| Lexicon provenance (13.1.15) | Group 32 and 33 gate it. | **Confirmed, gated** |
| Metrics not to overstate (13.3) | 856 of 9,431 sentences reached; accuracy unverified. | **Agreed. Never quote accuracy.** |

Nothing in the audit asks for a second engine and we will not build one.

## 2 · Rulings made by the seats (owner may overturn any)

The owner's standing order is that the seats decide and ask only when blocked.
Each ruling below is the smallest safe choice, is reversible, and invents no
psychology. Where the canon is the owner's own (the four address and divisor
disputes), the sniffer keeps reporting `CONFLICT` or `UNREAD` and nothing is
decided.

1. **Denial (DESIGN question 3).** A negated charge word is not a positive admission
   and is not erased. It stays in the entry as a *named and denied* mark, drawn
   struck as the Story page already draws it, and it adds nothing to any axis,
   band, charge or imprint. It is listed so the Mirror can say "you said you were
   not angry; I did not count it". The reading never goes up on a denial.
2. **Whose charge (DESIGN question 4, guard 2).** A charge word whose clear subject
   in its own clause is a third person (he, she, they, a name, "my mother") with no
   first person between that subject and the word is *held*, not scored on the
   writer. It is listed as *about someone else* and the Source question asks how
   it landed. No subject, or a first person subject, is the writer, which is what a
   journal is. An unclear subject is held, never scored. The writer's own words
   about another person's feelings are not the writer's field.
3. **Tense (question 5).** Not scored differently in alpha. Recorded for P2.
4. **Intensity words.** Extend the existing modifier table and make `sniffAxes`
   read it. P2.
5. **Inferred address (question 13).** An explicit axis is not an explicit address.
   No renderer may print "you said you carry [address]". Audit and fix in alpha.
6. **Frame layer.** Stays unbuilt until a held set exists.
7. **Unread stays visible.** Every dimension reports `READ`, `PARTIAL`, `UNREAD` or
   `CONFLICT`. Nature, Human nature and the four unkeyed circles stay `UNREAD`.

## 3 · What is in alpha (P1) and what is not

Owner's rule: P0 is a blocker, P1 is highest, P2 and P3 come later. For the
sniffer that sorts like this.

**P1, in the alpha, built now** (defects in what already exists, no new capability):

| # | Item | Why it is a defect | Done means |
|---|---|---|---|
| S0 | Word pass `94d328e` ported onto `main`, with the `LEXPROF` trap fixed | Profanity and "rough day" read as nothing. `'not okay'` and `'not ok'` sit in `LEXSYN_NO`, and `'fucking'` breaks the starred-word gap test (about `tests/engine.js` line 7180). | The words read; the starred-word gate stays green |
| S1 | Negation in the primary path (ruling 1) | The page draws "not sad" struck and the score still counts it. A false reading on the body map. | Every negated pair differs; the struck mark and the score agree; no consumer reads a denial as a charge |
| S2 | Whose charge (ruling 2) | Guard 2 of the spec is "never score another person" and it is broken today. | The attribution pairs differ; third person is held and listed; first person and no subject are unchanged |
| S3 | Full saboteur candidate list (13.1.10) | A domain layer must not decide what the UI shows. | `sniffStory` returns every positive candidate; UI shows six |
| S4 | Address wording audit (ruling 5) | Printing an inferred address as the person's own claim breaks the mirror principle. | A gate fails on any renderer that says "you said" beside an address |
| S5 | Held and denied marks are visible on the Story page | An unseen exclusion is a silent failure. | The same list that shows unread stretches shows denied and about-someone-else marks, in plain words |

**P2, after alpha, specified here, not built now:**

| Block | Content | Gate to start |
|---|---|---|
| SB5 | `sniffStory` on the normal Story path: Mirror confirm / correct / reject as first class events | Alpha shipped |
| SB6 | Release offer from a confirmed candidate into the one existing Release Engine | SB5 |
| SB7 | Verification, evidence ledger, Trace graph, CQ projection | SB6 and the owner's divisor ruling |
| SB2b | Tense, intensity words, modifier table in `sniffAxes` | S1 and S2 locked |
| SB3 | Canon files restored or replaced; table conflicts ruled; law set reconciled | Owner supplies the four files |
| SB4 | Per-layer status coverage and source evidence for every claim | SB3 |
| SB8 | Persistence and privacy for sniffer evidence on the active branch | SB7 |
| SB10 | Accuracy evaluation | A consented, labelled, de-identified sample the owner supplies |

SB9 (full browser regression) is not a separate block: every package runs the
browser gates for the surface it touches, and CI runs the whole suite on every pull
request.

## 4 · Order of work, with the reasons

1. **S0 first.** It is already written (`94d328e`), small, and it changes only the
   word table. It proves the port route on `main` before any semantic change.
2. **S1, then S2.** Both change what `parseStory` returns, and `parseStory` has many
   readers: `ui/storyui.js`, `ui/avatarui.js`, `ui/onboard.js`, `ui/tutorial.js`,
   `ui/drills.js`, `ui/summary.js`, `ui/wheel.js`, `engine/daily.js`, `engine/exdepth.js`,
   `engine/journey.js`, `funnel/quiz.html` and, through `scanStory`, Source AI (`srcHear`).
   One change per commit, and the consumer sweep (below) after each.
3. **S3, S4, S5** are independent of the parser and ride behind S2.
4. **No new vocabulary during S1 and S2.** If the word table moves while the
   semantics move, a changed reading cannot be blamed on either.

## 5 · The measurement that makes a semantic change safe

`TDD-sniffer.md` already holds the stability claim: over 9,431 book sentences, 0
readings lowered by a vocabulary change. S1 and S2 are *meant* to lower some
readings (a denial, a third party). So the claim changes from "none lowered" to
"every lowered reading is a negated or third party hit, and no other".

Proof, using `proto/sniffer/before-after.js` (in the main repository; the sparse
worktrees do not carry `proto/`, read it by `git show origin/main:proto/sniffer/...`):

1. Before the change, record each sentence's reading.
2. After the change, record again.
3. Every sentence whose reading went down must contain a negator before a hit in its
   own clause, or a third person subject, by an independent scan that does not call
   the new code. Print the count and ten examples of each kind.
4. Every sentence that went *up* is a defect. Zero allowed.

Also measure the false negative that negation brings. "I can't stop crying" has a
negator before a charge word and is not a denial. If the corpus shows this kind of
loss, add the verb frames ("can't stop", "couldn't help", "can't stop") as named
exceptions, each with a test, before the change is accepted.

## 6 · The consumer sweep

After each of S1 and S2, for every reader of `parseStory` listed in section 4, state
in the commit what it does with a hit that now carries `neg` or `other`, and show a
test or a read of the code for it. A reader that sums `hits` or `imprints` without
looking at the new flags is the most likely hidden bug in this work.

Three places already describe the old disagreement in words, and each becomes a
false sentence the day S1 lands. They are part of S1, not a follow up:

- `funnel/quiz.html`, `storyLit`: the quote "carries the no, and one sentence says the
  reader counted it anyway". After S1 it was not counted, so the sentence must say so.
- `ui/storyui.js`, the charge lanes: the `only from "..."` warning is written for a seat
  charged by negated words alone. After S1 no such seat exists, so the warning has no
  case and the lane note must not claim one.
- `ui/storyui.js`, the counter "N words read, M kept, K set aside as negated": keep it,
  and make K the denied count the engine now reports, from one reader.

`stMarks` in `ui/storyui.js` and `storyLit` in `funnel/quiz.html` each re-derive negation
with `srcNegated`. After S1 both read the engine's flag instead, so the sentence, the
chart, the list and the score cannot disagree again.

## 7 · What stays the owner's

Not asked, because none of it blocks alpha. Each remains `CONFLICT` or `UNREAD` in
the output until ruled: the law divisor (E43), where Joy sits, where Surprise sits,
Avoider versus Innocent weighting, how a stance entry is read when it names no
feeling, and which source file replaces the four missing canon files.
