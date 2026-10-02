# Pass 3, creative director (Ines Halldors). Round PK

ICP sample: Marta, Nils, Camille, Whitney, Renata, Trey from `PANEL-10k.md`; Gordon and Sofia from `engine/data/people.js`. Also read: PROPOSAL.md, all pass 2 files, `DESIGN-avatar.md`, `DESIGN.md` law 4, `ui/component.js` (the four doors), `ui/release.js` (Pause).

## 1. The architecture in three sentences

One shared reader and one rule (an inference never becomes a fact) feed the trace, a derived chain of six rows that answers "why do you think that", with a quiet safety screen in front. One Next slot, ordered by a pure `loopRead`, replaces the doors and cards, and privacy and tier rules sit beside it as tables a person can read. The merge kept what I care about: derive, never store, no days, no score, no stored safety result. It bent three things, listed in section 3.

## 2. The ICP room

- **Marta, 02:00, bereaved, CQ 9.1.** Writes "I do not want to be here." The card quotes her clause, three buttons, no red. Then she leaves the entry and the Field prints Severe beside 27 saboteurs. Care ended at the entry and the room did not. She closes the app. "It heard me, then read me my number."
- **Nils, skeptic.** Sees "Maybe" above a claim with the quote under it. Trusts it. Presses Not me, and if Next does not change he leaves. "A guess labelled as a guess."
- **Camille, practitioner.** Reads Stays, Leaves, Delete in ten seconds. Likes that Confirmed is only the person's tap. Finds "lead others" closed, and stays, because nothing is claimed that is not built. "It does not pretend to be my room."
- **Whitney, phone only.** At 390 there is no right rail, and the proposal puts Next in it. Below the fold, she never meets it. She reads the six row names as a glossary and it resolves. "Six words and none is vibes."
- **Renata, wants a number.** Gets distinct days and dates, no strength figure. Annoyed, then checks the dates against her paper list. "I asked for a percent. It gave me dates. Fine."
- **Gordon, refuses anything clinical.** On a blank profile the doors are gone, so he gets one prompt: write what happened. Door two, "for anyone who cannot think of themselves as the problem", was written for him. "Where is the one I can do without confessing?"
- **Sofia, needs the consent list.** The privacy page is generated from a table, so "no one can see this record" is true. She trusts it until a practitioner view exists. "Show me the list or do not show me the feature."
- **Trey, quiz tourist.** Screenshots the first Field. If the word is Corrupt, that travels, and he never reaches the trace. "Got Corrupt. Posting."

## 3. Unified quality: 70 out of 100

Three rulings in PROPOSAL.md are wrong for the soul. Both values are given.

**Gap 1. Care ends at the entry.** Lead: entry scoped and unsaved. Mine: held for the page session in memory only. While it holds, the Field prints no band word, Next stays silent, locks and the ladder stay gone. A reload clears it, and Continue ends it. Evidence: Marta. Cost: S, one flag.

**Gap 2. Next replaces the four doors, even for a person who has entered nothing.** The doors (`STARTD` in `ui/component.js`) are four ways to begin: write, nine sentences, year by year, say who you are becoming. Two exist for people who cannot start with free text. Lead: one Next from day one. Mine: while `r.unread`, keep the four doors; Next takes over once a reading exists. Evidence: Gordon, and our own rule that what renders there renders to somebody who has entered nothing. Cost: less work.

**Gap 3. The ring dims after 14 days of nothing.** The UI seat called it a judgement and the lead made it a ruling. A brightness that falls with the clock is a streak drawn softly. `DESIGN-avatar.md` records that streak guilt makes people quit, and `PANEL-flow-1000.md` measured zero of 1000 reaching seven days on the old streak. Lead: dim at 14 days. Mine: no change with time. A quarter is lit where Next points, the date of the last act is written beside it, nothing fades. Cost: S, and it removes a timer.

**Two smaller points.**
- Pause on the care card collides with Pause in Release, which holds the run still and resumes. Narrative's Pause "saves and returns to the Field", which is leaving. Lead: Continue and Pause. Mine: urgent card Call, Text, Continue; strong card Continue and Help. Stopped motion is the pause.
- Quote the clause only for the `self` kind. For `danger` and `past_harm` print no quote and no kind, and let Escape clear the card, since the wrong person may see the screen.

**Missing: the grammar of the new names.** Next, Maybe, Fits, Not me, Set aside, Confirmed and the six rows have no icon family, and our law says a name has an icon, a family and a colour that means something. Move: one family of ring glyphs on the 24 unit grid, one neutral ink. Rows the person did (Said, Felt, Changed, Confirmed) get a solid stroke. Rows the instrument did (Heard, Maybe) get a dashed stroke. An inference then never looks like a fact. Care has no colour, by design.

## 4. Final grade

GRADE: 72/100 (pass 1 48, pass 2 66). The merge took my cuts: orchestrator, ranked list, days, "verified". It stops at 72 because care does not follow the person, the blank profile loses its doors, the avatar gets a clock, and the grammar is unnamed. With the three rulings changed and the glyph family built, 80.

## 5. My part of the slices

A1 to A13 are the technical director's ids. A14 to A17 are slices his list lacks. The project manager merges duplicates.

| Id | Slice and goal | Changes | Must not touch | Gate | Size | Unlocks | MVP | ICPs feel |
|---|---|---|---|---|---|---|---|---|
| A4 | Safety screen: three outcomes, editable cue data, quote only for `self` | `engine/distress.js` (from `c1cbc1a`), `ui/storyui.js` | commit, record | `tests/safety.js`: six measured misses hit, nothing stored | M | A5 | yes | Marta heard, Nils sees no label |
| A5 | Care for the session, in memory | `ui/storyui.js`, `ui/fieldbar.js`, CSS | Ritual, Compass | `functional.js`: no band word during care, reload clears | M | A12 | yes | Marta stays held |
| A14 | Truth sweep: four causal lines, toggle, "Not your stories", "Tool of" | `ui/summary.js`, `ui/drills.js`, `ui/account.js` | arithmetic | `check.py --objections` plus a mirror test | S | A13 | yes | Nils, Gordon, Sofia |
| A15 | Glyph family: six chain rows solid or dashed, Next, Fits, Not me | `engine/data/canon.js`, `ui/component.js`, `DESIGN.md` | seat colours | `design.js`: ring only, 24 grid, no seat colour reused | S | A12, A13 | yes | Whitney |
| A13 | Claim row: Maybe, Fits, Not me, Why | `ui/storyui.js`, `ui/imprints.js` | DOM budget | `functional.js`: Not me changes what shows next | M | A17 | yes | Nils, Gordon |
| A12 | Next and `loopRead`; doors kept while unread; Next above the fold at 390 | new `engine/loop.js`, `ui/component.js` | days in UI | no "Day" or "of 90" renders; blank profile shows four doors | M | A16 | yes | Gordon, Whitney |
| A16 | Ring and avatar from dated facts, no timer | `ui/avatarui.js`, `ui/rings.js` | the reading | ring identical at day 1 and after 40 silent days | M | centrepiece | after A12 | Marta |
| A9 | Gift end lock copy says what is kept | `ui/lock.js`, `ui/plans.js` | tier logic | `locks.js` | S | none | yes | Nils, Marta |
| A3 | Privacy page, generated from the table | `ui/panels.js` | table keys | build fails on an unlisted key | S | A11 | yes | Sofia, Camille |
| A17 | Confirmed ask after a ritual | `ui/ritual.js` | points | `practice.js`: Confirmed only after a tap | S | closes loop | later | Camille |

## 6. The order

Series on `ui/storyui.js`: A1, A4, A5, A13, A17. Series on `engine/schema.js`: A2, A9. A14, A15, A3 touch other files and run beside anything. First wave in parallel: A1, A2, A14, A15, R0 to R3. Second: A3, A4, A9. Third: A5, A6, A7, A8, A10, A11. Last: A12 (after A8 and the journey worktree merge), then A13, A16, A17.

## 7. One question for the owner

None.
