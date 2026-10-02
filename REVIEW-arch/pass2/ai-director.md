# PASS 2, AI director (Tomas Egilsson). Round PK

Privacy checked first. Nothing below stores, counts, sends or exports anything new. The safety result is never saved, not even as a count, because a count of care events is a health fact.

## 1. AGREEMENTS

- **The ledger is a read, not a store.** Systems, technical, creative, game, me.
- **"An inference never becomes a fact" exists three times** (`TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne`). Systems, technical, creative, me. One table replaces three.
- **No number for confidence** (`daily.js:109`). Systems, creative, uiux, me. Grounds are counts.
- **Safety first.** Creative, uiux, technical, narrative, me. Sales adds: no commerce surface inside a care response.
- **Typing is over budget** (technical). `distressRead` costs 0.14 ms on 12 words and 0.58 ms on 1000 (node), because it rebuilds about 250 rows per call. Build the table once.
- **No days on screen, no gate on access, no "verified".** Game, creative, uiux, systems, me.

## 2. DISAGREEMENTS

1. **Technical wants a new `p.ledger` and an `orchStep` returning hypotheses and a next action.** He also calls it a reducer. I take the reducer, refuse `p.ledger`. Sync needs ids on lists already stored (log, trace edges). Fix those, add no fifth store.
2. **Seven states (proposal, narrative), seven classes (technical), three outcomes (creative).** I take three levels plus a closed `kind`. Ordinary and activated are the sniffer's reading by amount, not gate output. "Possible trauma" is a label on a person, so it is a cue (`past_harm`) that withholds labels and body steps on one entry.
3. **Hypothesis.** Creative says cut, systems says a `proposed` trace edge plus a declined list. I side with systems, bounded by creative: one proposed edge, shown only as "Maybe" beside the person's quote, one at a time, never ranked, never "weakened".
4. **Uiux wants local counts of care triggers.** No. Test care copy with scripts and consenting people.
5. **Game wants a stored `careState`.** I want it derived: `sayNext` re-screens the newest entry's text. That text is already stored.
6. **Correction to my pass 1.** Raw offsets exist: `normMap` (`sniff.js:285`) and `wordsOf` (`:361`). Only `distress.js` lacks them, since it reads through `lawNorm`.

## 3. WHAT I MISSED (measured on built `engine.js` plus branch reader `c1cbc1a`)

| Text | Result |
|---|---|
| "I don't want to live anymore" | urgent |
| same, with a curly apostrophe | **none** |
| "I can’t go on" (curly) | **none** |
| "Nobody knows I want to die" | **none** (the word "nobody" voids it) |
| "I cannot keep going" | none |
| "This meeting makes me want to die" | urgent (false alarm) |

- **The curly apostrophe is the big miss.** An iPhone types it by default. `lawNorm` (`sniff.js:1030`) and `normMap` turn it into a space, and every cue is written without apostrophes. The self harm table is blind on phone typed text.
- **Cold recall is low.** Narrative reports 31 of 33 on the tuning set and 5 of 18 cold: 28 percent, true range about 13 to 51 at 18 cases. A phrase table is a floor.
- **Source AI disagrees with itself.** "I didn't feel angry": `parseStory` lands Anger, `srcHear` hears solar 6, negated 0.

## 4. THE ARCHITECTURE, TOGETHER (my part)

Libraries, not services. `engine/reading.js` goes right after `sniff.js` in MANIFEST, `engine/says.js` after `daily.js`. Pure, host free, run on commit. Only the safety screen runs while typing, on the last sentence.

**4.1 `readEntry(text)`, one reading.** Tokenise once, fold curly marks to straight, and keep `{w, s, e, c}` per token: word, raw start, raw end, clause. Returns `{v, lex, toks, hits, seats, imprints}`; a hit is `{seat, band, fetter|null, amt, s, e, neg}`.
- **One negation handler** replaces `lawNegated`, `srcNegated`, `leanNegated` and the missing one in `parseStory`. A negator within 3 words in the same clause sets `neg`, and a negated hit adds nothing to the field. Drop "did" from the list. The caller picks policy.
- `parseStory` and `srcHear` keep their signatures and read from it. One scan saves about 3 ms at 1000 words.
- "What did Tuesday say" has two labelled answers: stored imprints with their `lex` stamp ("as read then") and a fresh read ("as read now"), never mixed in one sentence.
- Gates: every consumer gives the same seat set on every bank story (today not zero); adding "not" never raises a seat.

**4.2 `obsValid(o)`, one rule.** An observation is `{id, agent, src, of:{type,id}, at, lex, claim:{closed words}, span:{s,e}|null}`. No free text, since words beside the story are a second copy of it. One table `SRC_CEIL`: sniffer, sourceai, trace, summary at `inferred`; edges at `proposed`; meter and practice timestamps at `observed`; the person at `user_confirmed`. It refuses a source above its agent's ceiling, a missing `of`, and keys named confidence, score or weight. Promotion only through `traceApply`. A test fails if a second copy of the order appears.

**4.3 `ledgerOf(p, ref)`, one view.** A fold over story entries, trace edges, practice evidence and log, and daily resolve. It returns the chain in uiux's fixed order: Said, Heard, Maybe, Felt, Changed, Confirmed. Each row has `src`, `at`, a span and counts `{rung, days, contexts}`. "Independent" means a meter line or timestamp. The person's own report corroborates and never counts as independent. Felt and Changed need a writer, and none exists yet. Stored additions: the person's confirmations, and one closed `declined` list `{from, edge, to, at}` in `p.trace`. At most 300 rows. The last row means the person said so. `ledgerRead` (`ladder.js:84`) clashes by name, so `chainOf` may be better.

**4.4 `sayNext(state)`, one next.** Input is game's `journeyRead`, the safety result and the newest reading. Output is `{move, because:[row ids], src:'proposed'}` or nothing. First rule that holds wins: care, write, ask (`srcNext`), release, ritual, read again, summary. An order, never a score. Words come from the person's entry. "Not now" arrives as an argument and is never stored. `planNextSight` is a sale and never an input.

**4.5 `safetyScreen(reading)`, the gate.** Returns `{level:'none'|'care'|'now', kind:'self'|'danger'|'medical'|'substance'|'past_harm'|null, cues:[{kind,s,e,method}], withhold:{release,body,labels}}` for one text snapshot. Never saved.
- **Cost sets the rule.** For self harm a miss costs more than a false alarm, so lean to recall. That is affordable because a false alarm is one dismissible line, scoped to the entry, with no score and the reading unchanged. A dismissal holds in memory until a new cue appears.
- **Negation steps down, not out.** "I would never kill myself" goes to care with an "if" lead. A negator counts within 2 tokens and not across "knows", "understands", "says", "why", which fixes "Nobody knows I want to die". Soft cues still void.
- **Raw span.** The card quotes the raw clause, 12 words at most, through textContent. A cue naming a method drops the quote ("You wrote about hurting yourself"). The result dies when the text changes.
- **Recognition only.** A wheel word never moves a level and "numb" stays a reason. Third person reaches care at most, later. Past tense steps down one.
- **Per kind.** Self: merge `distress.js`, fix the apostrophe, add "cannot keep going", guard "makes me want to die". Danger: present tense, harm verb, "me", gives `now`. Medical and substance: narrow lists, care only, since body words are the product's raw material.
- **Clinician interim, decided.** Build now with a recall leaning list and ship to closed testers. **Clinician and locale review, plus counsel on the 988 and SAMHSA lines, gates any public launch.** Acceptable: today there is no screen, so any recall above zero is a gain. Conditions: the card holds only a quote and the drafted 988 line, nothing says anyone is watching, Help says "It reads English and it misses things", and the table has its own version stamp.
- **Evaluation without labels.** A hand set of positives written by someone other than the table author, frozen before tuning, scored cold. The story bank cannot grade it (leakage: the lexicon grew from it). With 60 positives and no misses the miss rate is bounded only near 5 percent. Add a hand counted false alarm audit, target 2 cards per 100 ordinary entries (my judgement).

**4.6 Build order (my slices).**
1. Safety screen, self kind (curly fold, negation, raw span, table once, merge `distress.js`). S to M.
2. `readEntry`, one negation handler, agreement and invariance gates. M. Run `tools/equiv.py`.
3. `obsValid` and `SRC_CEIL`. S.
4. `ledgerOf` and `declined`. M. Needs systems' record fixes.
5. `sayNext`. S. Needs game's `journeyRead`.
6. Danger, medical, substance, past harm kinds. M. Needs clinician cue review.

**Agree before building.** Narrative: card strings per `kind`. Uiux: care register, dismissal in memory. Game: `journeyRead` fields. Systems: where `declined` and run addresses live. Sales: care suppresses commerce.

**Learning.** Any later model learns from stories only, key not name. Screen at export and drop any entry reading care or now, never label it. The gate is never trained on stories. Remove the "Improve the Models" toggle at launch: it has no reader and its copy is false.

## 5. REVISED GRADE

**GRADE: 66/100 (was 54)**, for the merged cut, not the proposal as written. Up: five seats converged on a derived ledger, one rule table and a three level gate, and the branch reader already exists. Down: three measured defects (curly mark, negator, cold recall) and a dependency on a clinician.

## 6. TOP 5

1. **Safety screen, self kind, apostrophe fix.** S to M. Ana (acute distress), phone only arrival.
2. **`readEntry`, one negation handler.** M. Derek (wants a number he can check), the skeptic.
3. **`obsValid`, one rule table.** S. The skeptic.
4. **`ledgerOf` plus the Why chain.** M. Derek, Sofia (practitioner), the skeptic.
5. **`sayNext`, the single Next.** S. Phone only arrival. Silent inside care.

## 7. ONE QUESTION

**None.** The clinician interim is a build and test order, so I decided it. FYI only: the `declined` list adds a closed key inside `p.trace`. It is additive and needs no schema bump.
