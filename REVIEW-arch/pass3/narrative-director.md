# Pass 3, narrative director (June Okonkwo-Lund). Round PK, 2 October

Read: PASS3 instructions and template, PROPOSAL, all pass 2 reports I needed (mine, technical, creative). Checked at HEAD: `ui/summary.js:252-255, 293-295, 318`, `ui/drills.js:1348`, `ui/account.js:424`. All six cause lines are still in the build. "Tool of" did not grep at HEAD, so the sweep writer greps first.

## 1. The architecture in three sentences

The instrument keeps one reading library (it reads each entry once, keeps the person's own words, and orders one suggestion called Next), and a derived Trace that shows six rows from what the person wrote to what they confirmed. A quiet safety screen changes the pace of one entry in three outcomes and never stores, counts or exports a result. Privacy is a table the boundary page is printed from, and the server owns tier and money while the browser owns pace.

**What the merge lost or bent, for words:**
- **The truth sweep is gone.** Six lines state a cause about the body or the person. Technical's A1 to A13 has no slice for them. They are a lie shipped today. I add A14.
- **The Help sheet is gone.** The merge keeps one sentence about English. The limits, the 988 and 911 lines and "Nobody is watching as you write" need one home. I add it to A16.
- **The Quiet line is gone.** Hiding the streak with no word is lying. Same slice.
- **Care and release conflict.** The merge says care withholds release. My Strong card leaves release open and withholds only labels. Only the Medical, Substance and Danger cards close release, and say so. I take mine as the default.
- **"Under 25 words" is unmeasurable as written.** A 12 word quote plus the card is 28. The cap counts the words around the quote, not the quote or the buttons. Mine is 13.
- **The gates are gone.** The sensation rule and the lead verb rule are what stop the cause lines coming back.

## 2. The ICP room

**Marta, 02:00, acute distress.** Sees: she writes that she cannot do this anymore. One card. Her own words quoted, "Call or text 988 now.", Call, Text, Continue. Does: taps Call, or taps Continue and keeps writing. Trusts: no red, no modal, no "sorry", nothing sent. Leaves if: the cue list misses her phrasing and nothing prints (five of 18 cold phrases hit, so this is real), or she is outside the United States. Voice: "Don't tell me what I feel. Tell me who to call."

**Nils, the skeptic.** Sees: Maybe, his quote, one claim worded "may", Fits, Not me, Why. Does: taps Why first, reads six rows. An empty row says "Nothing recorded." Trusts: the Said row is his own sentence and the Heard row names the word the instrument used. Leaves if: any sentence says "installed" or "means", or Why shows a number he cannot check. Voice: "Show me which of my words it used."

**Camille, somatic practitioner.** Sees: Sight under Leaves: "Nobody sees this record but you. A practitioner sees it only after you say yes." Does: reads the Why chain as a clinician would, checks that Felt says "You reported". Trusts: the definition "A mark is what you felt. It is not what caused it." Leaves if: a client in care meets a Victim or Martyr label (barred now), or the card says "No alert was sent" and she expected one. Voice: "If my client writes that, what does the card say, and does it tell me?"

**Whitney, phone only.** Sees: the Field, then one Next line of 14 words or less and Not now. Does: taps Next. Dictates her first entry. Trusts: the device only boundary is three short lines. Leaves if: the Leaves line hides that dictation goes to her browser's maker (her phone does this by default), or Help runs past one screen at 390 wide. Voice: "One thing to do. I'll do it."

**Renata, operator, wants the chain as a number.** Sees: six rows and "3 entries on 3 days". Does: looks for a rate and finds none. Trusts: counts she can check. Leaves if: she needs a conversion from Said to Confirmed. We refuse that on purpose, because a count against a total is a score. Say so once and accept the loss. Voice: "Give me Said to Confirmed as a percent."

**Gordon, refuses anything clinical.** Sees: Limits in Help: "A doctor can diagnose. A therapist can treat. The instrument does neither." Does: reads it as the opposite of clinical and stays. Trusts: Not me goes to a Set aside list and changes what shows next. Leaves if: a dark joke fires a card and Continue takes two taps, or the conditional line "If you are thinking about ending your life" reads as a screening question. Voice: "I wrote it. I know what I meant. Don't diagnose it."

**Sofia, needs the consent list.** Sees: three unbundled boxes (18 or older, Terms, keep a locked copy), then Withdraw. Does: reads who sees the record, tests the one press take back. Trusts: the list is generated from grants, never typed. Leaves if: the Delete account button does not exist (`PRIVACY-POLICY.md:166`), or "Support tools do not open it" is unproven. Voice: "Show me who can see it. Let me take it back with one press."

**Trey, the quiz tourist.** Sees: his result, then the Field. Does: reads one line, taps nothing. Trusts: no account, no box. Leaves if: any consent box appears before his first reading. Rule: boxes appear at sign in only. Voice: "I just wanted my result. Why is there a form?"

## 3. Unified quality: 64/100

One voice from first screen to habit means every string passes the same three passes: true, one bucket, fewest words. Words move from 41 (today, with six lies and a false toggle) to 64 on paper. The score stays low because the strings are written but not built.

Three biggest gaps:
1. **The six cause lines still print.** Derek, Gordon, Nils read the lie in the first minute.
2. **No gate holds the voice.** A string is checked by me, once, by hand. Nothing fails the build when a cause line returns.
3. **Safety recall is unproven.** Cue lists miss 13 of 18 cold phrases. Words cannot fix a screen that does not fire.

## 4. Final grade

GRADE: 71/100 (pass 1 was 57 for safety and 63 for privacy, pass 2 was 69). Up from pass 2: I found the care and release conflict, the 25 word cap, and the Definition line I had put inside a card (a Definition is on demand, so it moves under the number as a tap). Down: the merge dropped the sweep, the Help sheet and the gates.

## 5. My part of the slices

Ids A14 to A20 are new. A1 to A13 and R0 to R5 keep technical's meaning. Strings go in their own data files, so the build agent for A4, A5, A8 and A13 does not edit prose in `ui/storyui.js`, the hottest file.

| Id | Name and goal | Changes | Must not touch | Proof | Size | Unlocks | When | ICPs feel |
|---|---|---|---|---|---|---|---|---|
| A15 | Voice gates. Fail the build on a cause line, a body word joined to means, shows, proves, because or stuck, a conclusion with no lead verb, and printed Day, of 90, stage, verified, detected, journey. | `.claude/skills/atuned-voice/objections.json`, `check.py`, `COPY.md` bucket list | any `atuned_src` file | Run first against today's build: it must fail on the six lines (known bad case first). Then pass after A14. `check.py --objections` | S | A14 proof, every later string | MVP | Derek, Gordon, Nils trust holds |
| A14 | Truth sweep. Rewrite the six cause lines (block E in my pass 2), swap "Not your stories" for the true line. Toggle removal belongs to A3. | `ui/summary.js`, `ui/drills.js`, `ui/account.js` (the Not your stories line only) | engine, `ui/storyui.js` | A15 green; `tests/functional.js`; `tools/monitor.js`; `node tests/engine.js` unchanged | S | the mirror test passes | MVP | Nils, Gordon, Camille |
| A16 | Care words and Help sheet. Three outcomes, the Quiet line, the Help sheet (block B), conditional and sure wording picked by an `urgent` flag. | new `ui/carecopy.js` (strings only), `MANIFEST`, `COPY.md`. A5 reads it | `ui/storyui.js` (A5 owns wiring), engine | `check.py --line` on every string; test that words around the quote are 25 or fewer; no banned word (sorry, please, we, trauma, victim); strings load with no engine | S words | A5 can ship | MVP | Marta, Gordon, Whitney |
| A17 | Boundary strings. Stays, Leaves, Delete in both states, printed from the `PRIVACY` table. Consent boxes. Export strings. | new `engine/privacycopy.js` (data, no host), `ui/account.js` render only | `engine/privacy.js` (A3 owns), `ui/auth.js` | Gate: every printed line has a table row; no row, no line; device only line holds the speech exception; signed in lines refuse to print before sync exists | M | A10, A11 can name their messages | MVP | Whitney, Sofia, Trey |
| A18 | Claim row and chain words. Maybe label, Fits, Not me, Why, Reword, six rows with lead verbs, "Nothing recorded.", the Why definition. | new `ui/claimcopy.js`, `COPY.md` | `ui/storyui.js` (A13), `engine/trace.js` (A8) | Test: every chain row starts with one of six lead verbs; empty row prints the fixed line; no row prints "installed" or "Verified" | S words | A13 and A8 render | MVP | Nils, Gordon, Camille, Renata |
| A19 | Lock and gift end lines. "Kept: the addresses you opened, your reruns and your history. Saboteurs show again on tier one." Gift end: "The gift has ended. Your record is unchanged. Tier one shows the base reading." [CHECK: sales confirms what tier one shows.] | `ui/lock.js` strings, `ui/plans.js` strings | `engine/plan.js` (A9) | Lock render test per verb: no string mentions the cap; the kept line lists only what A9 latches | S | A9 ships honest | MVP | Derek, Nkem, Whitney |
| A20 | Confirmed ask. One question after a ritual is marked done, at most one a session, Skip free. | `ui/claimcopy.js`, `ui/ritual.js` call site | points, streak, any score | `functional.js`: no answer prints praise or a count | S | the Confirmed row fills | Later | Nils, Renata |

A3 removes the Improve the Models toggle at `ui/account.js:424`. A14 must not also remove it, or the two worktrees collide in that file.

## 6. The order

1. **First, in parallel:** A15 (voice file only), A1, A2, R0 to R3. A15 touches no `atuned_src` file.
2. **Then:** A14 once A15 fails on today's build. A14 touches `summary.js`, `drills.js`, `account.js`; A3 also touches `account.js`, so A3 goes first, A14 after, in series.
3. **Then:** A3, A4, A9, A16 in parallel. A16 is a new file plus `MANIFEST`. A4 touches `MANIFEST` too, so the two edit it in series and keep load order.
4. **Then:** A5 (reads A16), A6, A7, A17 after A3. A5 and A6 both hit `ui/storyui.js`: series.
5. **Then:** A10, A8, A11, A18 with A8, A19 with A9. A11 and A17 share `ui/account.js`: A17 first.
6. **Then:** A12, A13 (reads A18). A13 owns `ui/storyui.js` for its turn.
7. **After:** A20, R4, R5.

Parallel: A15, A14 vs A2, A16 vs A9, A18 vs A8. Series on hot files: `ui/storyui.js` runs A1, A4 (call), A5, A6, A13. `engine/schema.js` runs A2 then A9.

## 7. One question

None. Defaults I took: release stays open at Strong; the 25 word cap counts the words around the quote; the signed in boundary lines do not print before sync exists. The owner can overrule any.
