# Pass 3, narrative director (June Okonkwo-Lund). Round PK, 2 October

Checked at HEAD: `ui/summary.js:252-255, 293-295, 318`, `ui/drills.js:1348`, `ui/account.js:424`. All six cause lines still print. "Tool of" did not grep at HEAD, so the sweep writer greps first.

## 1. The architecture in three sentences

One reading library reads each entry once, keeps the person's own words, and orders one suggestion called Next, while a derived Trace shows six rows from what they wrote to what they confirmed. A quiet safety screen changes the pace of one entry in three outcomes and never stores, counts or exports a result. Privacy is a table the boundary page is printed from; the server owns tier and money, the browser owns pace.

**What the merge lost or bent, for words:**
- **The truth sweep is gone.** Six lines state a cause about the body. No slice of A1 to A13 holds them. I add A14.
- **The Help sheet and the Quiet line are gone.** Limits, 988, 911 and "Nobody is watching as you write" need one home. Hiding the streak with no word is lying. Both go in A16.
- **Care versus release.** The merge says care withholds release. My Strong card keeps release open and withholds only labels. Only the Medical, Substance and Danger cards close release, and say so. I take mine.
- **"Under 25 words" cannot be measured.** A 12 word quote plus the card is 28. The cap counts the words around the quote, not the quote or the buttons. Mine is 13.
- **The gates are gone.** Nothing stops the cause lines coming back.

## 2. The ICP room

**Marta, 02:00.** Sees: she writes that she cannot do this anymore. One card: her words quoted, "Call or text 988 now.", Call, Text, Continue. Trusts: no red, no modal, no "sorry". Leaves if: the cue list misses her phrasing and nothing prints (5 of 18 unseen phrases hit), or she is outside the United States. Voice: "Don't tell me what I feel. Tell me who to call."

**Nils, skeptic.** Sees: Maybe, his quote, one claim worded "may", Fits, Not me, Why. Does: taps Why. Trusts: the Said row is his sentence and Heard names the word used. An empty row says "Nothing recorded." Leaves if: "installed" or "means" appears. Voice: "Show me which of my words it used."

**Camille, practitioner.** Sees: "A practitioner sees it only after you say yes." Trusts: "A mark is what you felt. It is not what caused it." Leaves if: a client in care meets a Victim label (now barred), or the card says "No alert was sent" and she expected one. Voice: "If my client writes that, does it tell me?"

**Whitney, phone only.** Sees: the Field, one Next line of 14 words or fewer, Not now. Does: taps Next, dictates. Trusts: three short boundary lines. Leaves if: Leaves hides that dictation goes to the browser's maker, or Help runs past one screen at 390 wide. Voice: "One thing to do. I'll do it."

**Renata, operator.** Sees: six rows and "3 entries on 3 days". Trusts: counts she can check. Leaves if: she needs Said to Confirmed as a percent. We refuse on purpose, because a count against a total is a score. Accept the loss. Voice: "Give me the conversion."

**Gordon, refuses anything clinical.** Sees: "A doctor can diagnose. A therapist can treat. The instrument does neither." Reads a limit, not a label. Trusts: Not me goes to Set aside and changes what shows next. Leaves if: a dark joke fires a card and Continue takes two taps, or "If you are thinking about ending your life" reads as a screening question. Voice: "I know what I meant. Don't diagnose it."

**Sofia, needs the consent list.** Sees: three unbundled boxes (18 or older, Terms, keep a locked copy), then Withdraw. Trusts: the list comes from grants, never typed. Leaves if: the account Delete button does not exist (`PRIVACY-POLICY.md:166`), or "Support tools do not open it" is unproven. Voice: "Show me who can see it. Let me take it back."

**Trey, quiz tourist.** Sees: his result, then the Field. Leaves if: any consent box shows before his first reading. Rule: boxes appear at sign in only. Voice: "I just wanted my result. Why is there a form?"

## 3. Unified quality: 64/100

On paper the strings are written. In the build they are not.

Three gaps:
1. **Six cause lines still print.** Derek, Gordon and Nils meet them early.
2. **No gate holds the voice.** Nothing fails the build when a cause line returns.
3. **Safety recall is unproven.** The cue lists miss 13 of 18 cold phrases.

## 4. Final grade

GRADE: 71/100 (pass 1 was 57 for safety and 63 for privacy, pass 2 was 69). Up: I found the release conflict, the cap, and a Definition I had put inside a card (it is on demand, so it moves to a tap). Down: the merge dropped the sweep, Help and gates.

## 5. My part of the slices

A14 to A20 are new. Strings go in their own data files so agents on A4, A5, A8 and A13 do not edit prose in `ui/storyui.js`.

| Id | Goal | Changes | Must not touch | Proof | Size | Unlocks | When | ICPs feel |
|---|---|---|---|---|---|---|---|---|
| A15 Voice gates | Fail the build on a body word joined to means, shows, proves, because or stuck; a conclusion with no lead verb; printed Day, of 90, stage, verified, detected, journey | `.claude/skills/atuned-voice/objections.json`, `check.py`, `COPY.md` | any `atuned_src` file | Run on today's build first: it must fail on the six lines. After A14 it passes. `check.py --objections` | S | A14 proof | MVP | Derek, Gordon, Nils |
| A14 Truth sweep | Rewrite the six cause lines; replace "Not your stories" with the true line | `ui/summary.js`, `ui/drills.js`, `ui/account.js` (that line only) | engine, `ui/storyui.js`, the toggle (A3) | A15 green; `tests/functional.js`; `tools/monitor.js` | S | mirror test passes | MVP | Nils, Gordon, Camille |
| A16 Care words and Help sheet | Three outcomes, Quiet line, Help sheet, sure or conditional wording picked by an `urgent` flag | new `ui/carecopy.js` (strings), `MANIFEST`, `COPY.md` | `ui/storyui.js` (A5 wires it), engine | `check.py --line` on every string; words around the quote 25 or fewer; no sorry, please, we, trauma, victim | S words | A5 ships | MVP | Marta, Gordon, Whitney |
| A17 Boundary strings | Stays, Leaves, Delete in both states printed from the `PRIVACY` table; consent boxes; export strings | new `engine/privacycopy.js` (data), `ui/account.js` render only | `engine/privacy.js` (A3), `ui/auth.js` | Every printed line has a table row; device only line holds the speech exception; signed in lines refuse to print before sync | M | A10, A11 messages | MVP | Whitney, Sofia, Trey |
| A18 Claim row and chain words | Maybe, Fits, Not me, Why, Reword, six rows, "Nothing recorded.", the Why definition | new `ui/claimcopy.js`, `COPY.md` | `ui/storyui.js` (A13), `engine/trace.js` (A8) | Each row starts with a lead verb; empty row prints the fixed line; no "installed" or "Verified" | S words | A13, A8 render | MVP | Nils, Gordon, Camille, Renata |
| A19 Lock and gift end lines | "Kept: the addresses you opened, your reruns and your history. Saboteurs show again on tier one." Gift end: "The gift has ended. Your record is unchanged. Tier one shows the base reading." [CHECK: sales confirms] | `ui/lock.js`, `ui/plans.js` strings | `engine/plan.js` (A9) | Lock render per verb: no string mentions the cap; kept line lists only what A9 latches | S | A9 ships honest | MVP | Derek, Whitney |
| A20 Confirmed ask | One question after a ritual is marked done, at most one a session, Skip free | `ui/claimcopy.js`, `ui/ritual.js` call site | points, streak, any score | `functional.js`: no answer prints praise or a count | S | Confirmed row fills | Later | Nils, Renata |

## 6. The order

1. **First, in parallel:** A15 (a voice file, no `atuned_src` file), A1, A2, R0 to R3.
2. **Then:** A3, then A14 in series, because both edit `ui/account.js`.
3. **Then, parallel:** A4, A9, A16. A4 and A16 both edit `MANIFEST`: series, load order kept.
4. **Then:** A5 (reads A16), A6, A7, A17 after A3. A5 and A6 share `ui/storyui.js`: series.
5. **Then:** A10, A8 with A18, A19 with A9, A11 after A17 (shared `ui/account.js`).
6. **Then:** A12, A13 (reads A18). A13 owns `ui/storyui.js` for its turn.
7. **After:** A20, R4, R5.

Hot files: `ui/storyui.js` runs A1, A4, A5, A6, A13. `engine/schema.js` runs A2 then A9.

## 7. One question

None. Defaults taken: release stays open at Strong; the cap counts words around the quote; signed in boundary lines do not print before sync exists. He can overrule any.
