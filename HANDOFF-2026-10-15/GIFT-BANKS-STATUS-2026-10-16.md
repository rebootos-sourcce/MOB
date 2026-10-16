# The six gift banks, where they stand

16 October 2026. **Candidate, not approved.** Nothing in any bank is approved. This page is the summary; each bank has its own review document beside it.

## In one line each

- **Anxiety:** 100 lines, all in your own words. Ready for your review.
- **Overwhelm:** 1 line in your own words, 99 from a card, not dictated.
- **Burnout:** 10 lines in your own words, 90 from a card, not dictated.
- **Grief:** 3 lines in your own words, 49 from a card, not dictated, and 48 short of 100.
- **Sadness:** 5 lines in your own words, 62 from a card, not dictated, and 33 short of 100.
- **Depression:** 8 lines in your own words, 85 from a card, not dictated, and 7 short of 100.

Your own corpus is thin for the five new natures. In the 2,470 different "I'm letting go of" sentences, most name a state inside a long list beside anxious, ashamed or depressed, so a line that names one nature alone is rare. Nothing was invented and no line about another nature was used to fill a gap.

## The table

"Your own lines" means your dictation and your two typed lists. "From a card, not dictated" means a line from the "50 Limiting Beliefs" cards, made in a chat session. "Validator" is the checking program on Reboot-OS that a bank must pass before the server may give it out; this column is the run on each bank by itself.

| Nature | Your own lines that qualify | Lines in the bank | From a card, not dictated | Short of 100 | Validator, this bank alone | What you decide |
|---|---|---|---|---|---|---|
| anxiety | 182 (80 dictated, 102 typed) | 100 | 0 | 0 | rejected, 16 refusals; none about content | Approve it, or name rows to swap for reserve lines. |
| overwhelm | 1 (0 dictated, 1 typed) | 100 | 99 | 0 | rejected, 16 refusals; none about content | Whether card lines may stand (99 of 100). |
| burnout | 10 (10 dictated, 0 typed) | 100 | 90 | 0 | rejected, 16 refusals; none about content | Whether card lines may stand (90 of 100). |
| grief | 3 (3 dictated, 0 typed) | 52 | 49 | 48 | rejected, 17 refusals; 1 is about content: 52 rows, not 100 | Whether card lines may stand (49 of 52). How to close the 48. |
| sadness | 5 (4 dictated, 1 typed) | 67 | 62 | 33 | rejected, 17 refusals; 1 is about content: 67 rows, not 100 | Whether card lines may stand (62 of 67). How to close the 33. |
| depression | 8 (6 dictated, 2 typed) | 93 | 85 | 7 | rejected, 17 refusals; 1 is about content: 93 rows, not 100 | Whether card lines may stand (85 of 93). How to close the 7. |
| **All six** | | **512** | **385** | **88** | see below | |

Of the 512 lines in the six banks, 127 are your own words and 385 are from a card.

## The six banks run together

- The validator only accepts all six at once, so it was also run on one folder holding all six (`HANDOFF-2026-10-15/giftbank/all-six/`), unchanged, with `python3 -I`.
- **Result: rejected, 29 refusals.**
  - 18 for the six banks' approval fields, three each, which stay empty until you approve.
  - 3 for the item schema's approval fields (the schema is the list of fields every row must carry).
  - 5 for the map from nature to meter track: three approval fields, and two because the map is empty. It is not defined, and the research handshake says it must not be invented. It blocks all six, whatever happens to the content.
  - **3 because a bank is short of 100:** depression 93, grief 52, sadness 67.
- **No two banks share an id.** The validator refuses that, and it did not refuse.
- **No two banks share a sentence.** Checked apart from the validator, across all six banks and their reserves: 0 shared ids, 0 shared sentences, 0 shared wordings with case and punctuation set aside. A sentence that names two natures is held from both, so this holds by design and was measured anyway.
- The anxiety bank is unchanged. The tools rebuilt it byte for byte before any new bank was made, and its validator run reproduces byte for byte.

## How a line's nature was decided

By the words in the sentence itself, the rule the anxiety bank used. Core words name the state outright; neighbour words name the same state in other plain words. A line that names two natures is held from both.

| Nature | Core words | Neighbour words |
|---|---|---|
| anxiety | anxious, anxiety, anxieties, worry, worries, worried, worrying, nervous, nervousness, panic, panicking, panicked, dread, dreading | afraid, scared, fear, fears, fearing, fearful, terrified, frightened, apprehensive, uneasy |
| overwhelm | overwhelm, overwhelmed, overwhelming, overwhelms | overloaded, overload, swamped, drowning in, buried under, too many things, spread too thin, can't keep up, cannot keep up |
| burnout | burnout, burn out, burned out, burnt out, burning out, exhausted, exhaustion, exhausting, depleted, depletion, drained, draining | tired, tiredness, fatigue, fatigued, fatiguing, worn out, run down, rundown, weary, weariness, overworked, overworking |
| grief | grief, grieve, grieves, grieving, grieved, mourn, mourning, mourned, bereaved, bereavement, heartbroken, heartbreak | loss, losses |
| sadness | sad, sadness, saddened, sorrow, sorrows, sorrowful, unhappy, unhappiness | cry, crying, cried, tears, tearful, weep, weeping, wept, gloomy, melancholy, heartache, lonely, loneliness |
| depression | depressed, depression, depressing, depressive, hopeless, hopelessness | despair, despairing, despondent, numb, numbness, empty, emptiness, meaningless, meaninglessness, pointless, pointlessness, unmotivated, apathy, apathetic, lifeless, joyless, giving up, give up, gave up |

Why each neighbour set is what it is:

- **Overwhelm.** They name more coming in than a person can take: overloaded, swamped, drowning in, buried under, spread too thin, cannot keep up. "Too much" alone is left out: in the corpus it is in 6 different sentences and means overwhelm in one ("I've taken on too much"), and something else in the others ("too much in my head", "take up too much space", "drink too much"). "Pressure" is left out, because it names a push from outside, not the state of being flooded by it.
- **Burnout.** Core words name being used up: exhausted, depleted, drained, burned out. Neighbour words name the long tired kind: tired, fatigued, worn out, run down, weary, overworked. "Energy" alone is left out, because "giving my energy away" names a habit, not the state.
- **Grief.** Core words name mourning: grief, grieving, mourning, bereaved, heartbroken. The one neighbour word is "loss", because a loss is what grief is about; a loss of power, control, strength, energy or vitality is held as not a loss anyone mourns. "Lost", "miss", "death" and "die" are left out. In all 8 different sentences that say "lost", it means a quality gone ("lost my spark", "lost my mojo", "lost confidence") or being unsure ("feeling lost on how to finish projects"), never a person. None of the 4 that say "miss" or "missed" is about missing someone. Of the 15 that say "death" or "die", 10 are fear of dying, which is anxiety.
- **Sadness.** Core words name the state: sad, sorrow, unhappy. Neighbour words name what sadness does or how it sits: crying, tears, weeping, gloomy, melancholy, heartache, lonely. "Down", "hurt" and "heavy" are left out: in the corpus "down" is mostly "let people down" or "slow down" (31 different sentences), "hurt" is mostly hurt feelings or a body in pain (40), and "heavy" is used for eyes, weight and life (9). "Blue" appears twice.
- **Depression.** Core words name the state: depressed, depression, hopeless. Neighbour words name what it is like from inside: despair, numb, empty, meaningless, pointless, unmotivated, apathy, joyless, giving up. "Defeated" and "deflated" are left out: of the 32 different sentences that say either, 27 also name one of the six natures, usually inside a long list beside anxious and ashamed, and on their own they name losing a contest, which can come with any of the six. "Worthless" is left out, because it names shame.

## What you decide

These are the decisions that move the five new banks. None is made for you; each bank is built so any of them can be applied by rerunning the tools.

1. **Whether card lines may be in a gift bank at all.** 385 of the 412 lines across the five new banks are from a card. If not, the five banks hold overwhelm 1, burnout 10, grief 3, sadness 5, depression 8 of your lines, and they wait for dictation.
2. **If they may, whether the card form stands.** A card line reads "I am letting go of believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, and doing that I am ...", the stem its set prints, with the card's full stop. Your own lines read "I'm letting go of ...". Making them match is a rewrite, so it waits for your ruling.
3. **How to close the three short banks.** Each way, with how many of your own lines it would bring back (each line would still be read before it went in):

| Nature | Short of 100 | Your lines held only for length (over 30 words) | Your lines held for naming a second nature | Your lines held only by their heading | Lines from new dictation needed |
|---|---|---|---|---|---|
| grief | 48 | 1 | 4 | 0 | 48 |
| sadness | 33 | 6 | 31 | 6 | 33 |
| depression | 7 | 4 | 18 | 1 | 7 |

   The fastest way that keeps the gift in your own words is a short dictation session per short nature. The other three ways bring back your lines but loosen a rule the anxiety bank kept.
4. **Whether the word sets are right.** The neighbour words are a judgment, written down with the reason for each. The ones most worth your eye: "numb" and "empty" for depression, "lonely" and "crying" for sadness, and "loss" for grief.
5. **The map from nature to track** (which four meter tracks the six natures land on). Not part of this job, not invented here, and it blocks all six banks in the validator.

## Where more material is, and what it gave

- **The LET GO corpus** (your dictation and typed lists, Reboot-OS commit `fbad94c`, the same files byte for byte as Reboot-OS main `3d66f5e`). Used first, for every bank.
- **The "50 Limiting Beliefs" cards** (`Tula__SUPPLIMENT_LET_GO_LIST.txt`, 233 sets, 11,700 lines, generated in a chat session, not dictated). Used to fill, each line marked "from a card, not dictated" in its own source column and listed in its own section of each review document.
- **The Little Books volumes** (MOB branch `claude/little-books-review-k7az9s`, commit `e98a057`): 11 volumes (anger, anxiety, burnout, control, drive, duty, grief, money, shame, voice, worth), 99 charge and install pairs, but only 59 different charge lines, because most pairs repeat their volume's shared list. Read for every nature. None qualifies: every charge line runs 46 to 69 words, and none is 30 words or fewer. For each of the five new natures, every line that names it also names another nature. There is no overwhelm, sadness, depression volume.

## Files

- Review documents, one per bank: `HANDOFF-2026-10-15/GIFT-BANK-<NATURE>-CANDIDATE-2026-10-16.md` for anxiety, overwhelm, burnout, grief, sadness and depression.
- Each bank's folder: `HANDOFF-2026-10-15/giftbank/<nature>/` with `banks/<nature>.json`, `schema.json`, `mapping.json`, `<nature>-reserve.json`, `<nature>-held.json` and the three validator run files.
- The six together: `HANDOFF-2026-10-15/giftbank/all-six/`, with the validator run, the overlap check and each new bank's counts.
- The tools: `HANDOFF-2026-10-15/giftbank/tools/`. `natures.py` holds the word sets; `reading_holds.json` holds every line held on reading, with its reason.
