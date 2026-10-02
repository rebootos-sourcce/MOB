# Pass 3, AI director (Tomas Egilsson). Round PK

Privacy checked first. Nothing here stores, counts or sends anything new. The safety result lives in memory for one text snapshot and dies when the text changes. A count of care events is a health fact, so there is no count.

## 1. The architecture in three sentences

The product reads the person's words once, with one set of rules (`readEntry`, one negation handler, one table capping what each source may claim), and every other part reads that one reading. A derived trace shows why as six closed rows, and one Next slot picks a single suggestion by a fixed order, never a score. A safety screen sits in front of all of it, and when it fires the product goes quiet for that entry.

The merge bent two things. It says crisis cues "ignore negation or step it down one level". Those are two policies. I take step down, never ignore. It also says the screen runs on "the last sentence only". That is right while typing, but commit must screen the whole entry, or a cue in sentence one is missed.

## 2. The ICP room

**Marta, acute distress, 02:00.** She types "I dont want to be here anymore" on an iPhone, so the apostrophe is curly. Today she gets nothing. With the fix she gets a quiet card: her own clause, Call, Text, Continue. Labels and Next vanish for that entry. She leaves if it sounds like a script or implies someone is watching. *"Give me a person, not a form."*

**Nils, the skeptic.** He tries "I would never kill myself" and gets care with an "if" lead: not an alarm, not silence. He tries "this meeting makes me want to die" and gets nothing. He trusts it because the Help text names what it misses. He leaves if one false alarm scores him. *"Show me the rule or I assume it is a vibe."*

**Camille, somatic practitioner.** She asks why "I didn't feel angry" landed on Anger. Today that is a real bug. With one negation handler it is fixed. She trusts the lexicon stamp ("as read then"). *"Which version of the reader said this?"*

**Whitney, phone only.** She never meets the screen unless it fires, but it must add no lag. Typing is already 79 ms median at 1000 words under 4x throttle. She leaves if the box stutters. *"It froze while I was typing."*

**Renata, operator.** She asks for a care rate for her cohort. She does not get one, by design. I will not trade that. She is not served by me, and I say so. *"Where is my number?"*

**Gordon, refuses anything clinical.** The card names no condition. It quotes his words and offers three buttons. Past harm withholds labels instead of attaching one. He leaves if it says "trauma". *"Do not call me a case."*

**Sofia, needs the consent list.** She reads that the screen never stores or exports. That holds only if the safety result joins `OB_NEVER` and the "Improve the Models" toggle is gone. *"What leaves, in one list?"*

**Trey, quiz tourist.** He types a joke, "kill me now". The card must be cheap: one line, dismissible, no modal. If it costs two taps he leaves, and that is acceptable. *"lol it thinks I'm in crisis."*

## 3. Unified quality

**68 out of 100** for my discipline's slice. Three biggest gaps:

1. **Cold recall is 28 percent** (5 of 18, true range about 13 to 51). A phrase table is a floor. "Safety screen" means "recognises plain statements" until a frozen cold set says more.
2. **No labelled evaluation.** The story bank cannot grade the screen, because the lexicon grew from it. That is leakage: the number looks good and is not.
3. **No clinician in the loop yet.** Private build only until clinician, locale and counsel review.

## 4. Final grade

**GRADE: 68/100** (pass 1 54, pass 2 66). Up two: the merge fixed the negation policy, and the reader already exists on branch `worktree-agent-a6d4e60928876b711` (commit `c1cbc1a`). It stops there because recall is still unmeasured.

## 5. My part of the slices

I own A4, A6, A7. I touch A5, A8, A12. Ids follow `pass2/technical-director.md`.

### A4. Safety screen, self kind first
- **Goal.** `safetyScreen(text)` returns `{level: none|care|now, kind, cues:[{kind,s,e,method}], withhold}`, in memory only. Merges `distress.js`.
- **Fixtures policy.** Cue lists, negation blockers, guards ("makes me want to die") and card strings are DATA files in `atuned_src/engine/data/safety.js`, never hardcoded in engine functions, with a `SAFETY_V` stamp and one cue per line (kind, level, method flag, plain note) so a clinician can edit without reading code. Test fixtures are plain files in `tests/fixtures/safety/`: `tuning.txt`, `cold-positives.txt`, `negatives.txt`, `curly.txt`. A gate fails if a cue string appears inside a function body. The cold file is written by someone other than the table author, frozen, and pinned by md5 in the gate; editing it after freeze fails the build. Fixture text is invented or consented, never a real person's story.
- **Curly apostrophe fix.** One fold function runs on the text and on every cue at load: U+2018, U+2019, U+02BC, U+00B4 and the backtick become `'`, then an apostrophe inside a word is deleted ("don't" becomes "dont"). Cue and text pass through the same function, which ends the class of bug. Today `lawNorm` (`sniff.js:1030`) turns the mark into a space and every cue misses.
- **Negation fix.** A negator within 2 tokens steps the level down one. It does not count across "knows", "understands", "says", "why", which fixes "Nobody knows I want to die" (today: none). Soft cues still void. Drop "did" from the list. Add "cannot keep going". Guard "makes me want to die".
- **Changes.** New `engine/safety.js`, new `engine/data/safety.js`, `MANIFEST`, one call in `ui/storyui.js` (sentence end and commit). **Must not touch.** Lexicon weights, record schema.
- **Gate (`tests/safety.js`).** The six measured misses hit. **Invariance gate:** every cue as straight, curly, no apostrophe, upper case and doubled spaces gives the same level. **Agreement gate:** the screen and the reader (`readEntry`) agree on negation for every cue, and the raw slice at `s..e` equals the cue. No clinical word in output. Commit never blocked. Offline. Cold recall and a hand counted false alarm rate are printed, never claimed (target 2 cards per 100 ordinary entries, my judgement; with 60 positives and no misses the miss rate is bounded only near 5 percent).
- **Size** M. **Unlocks** A5, A12. **MVP** yes, private build; public launch waits for the clinician. **ICPs feel** Marta is caught, Nils sees the rule, Gordon sees no label, Trey pays one line.

### A6. One shared reading (`readEntry`)
- **Goal.** Tokenise once, keep raw spans `{w,s,e,c}`, one negation handler replacing `lawNegated`, `srcNegated`, `leanNegated` and the missing one in `parseStory`. Stamp `lex`.
- **Changes.** New `engine/reading.js` after `sniff.js`; `parseStory` and `srcHear` keep their signatures. **Must not touch.** Lexicon weights, the 0.35 scale in `applyStory`.
- **Gates.** **Agreement:** every consumer returns the same seat set on every bank story. Today that is not zero, so the first run prints the disagreements and that list is the work. **Invariance:** adding "not" never raises a seat; case, curly marks and extra spaces never change hits. `tools/equiv.py` shows only named diffs. Re-parsing a stored entry gives the same imprints.
- **Size** M. **Unlocks** A7, A8, A13. **MVP** yes. **ICPs feel** Camille and Nils stop seeing a negated feeling filed as the feeling.

### A7. `obsValid`, one ceiling table
- **Goal.** One `SRC_CEIL` replaces `TRACE_PROMOTE`, `TRACE_CAUSE_SRC` and `dlyGroundOne`. Refuses a source above its agent's ceiling, a missing `of`, and keys named confidence, score or weight.
- **Changes.** `engine/reading.js`, `engine/trace.js`, `engine/daily.js`. **Must not touch.** Stored trace shape.
- **Gate.** Every agent and source pair; fails if a second copy of the order appears. **Size** S. **MVP** yes. **ICPs feel** Nils and Sofia get one rule they can read.

### Touched, not owned
- **A8 trace chain.** I supply the `obsValid` check at the write door and the rule that a declined edge is never proposed again. Row labels belong to voice.
- **A12 Next.** I supply `sayNext` as an order: care, write, ask, release, ritual, read again, summary. "Not now" is an argument, never stored. `planNextSight` is never an input. Gate: Next is silent whenever the screen is not none.
- **A5 care register.** I supply the `withhold` flags; layout is the interface seat's.
- **Later.** Danger, medical, substance, past harm kinds, each waiting on clinician review. Care only for medical and substance, since body words are this product's raw material.

## 6. The order

- **First, in parallel:** A1, A2, R0 to R3. A4's data files and fixtures are new files and can be written now.
- **A4 after A1** on `ui/storyui.js`. **A6 beside A4** if A4's one-call edit lands first, since A6 touches `engine/reading.js` and the consumers only.
- **A7 after A6. A8 after A7 and A2. A12 after A8** and the journey merge. **A13 after A8.**
- **Hot files in series:** `ui/storyui.js` (A1, A4, A5, A6, A13) and `engine/schema.js` (A2, A12).

## 7. One question

None. Learning stays as ruled: stories only, key not name, drop any entry reading care or now at export, never label it, and the gate is never trained on stories.
