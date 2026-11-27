# The testimonial exercise

His question, 27 September, `TASKS.md` IN: *"Through their lenses, how do they
see this product? How would they articulate this as a testimonial using real
human kind of behavioral experience, from a results perspective or a novelty
perspective. Simulate that till you have a good result. I want to hear what
worked and what didn't work as well. Make suggestions for the future."*

**Every testimonial in this file is simulated. None was said by a person.**
The speakers are the nine reference fields in `marketing/field.js`, which are
the people in `engine/data/people.js`. `GUARD.md` rule `testimonial` holds:
there are no users, so nothing here may be published as a testimonial. What
the exercise buys is knowing which angle holds, for which reader, before a real
person says a word.

    node marketing/testimony.js          the whole exercise, printed
    node marketing/tests.js              assertions 21 to 23 hold it to its rules

Measured 27 September at seed 20260920, `engine.js` md5
`0ffab0adbd49c22ceda12aec29e9aa9d`, on top of commit `bb2cbe0`. Read the counts
off the run. These are dated because they will move.

---

## How it was run

**The numbers are the engine's and the sentences are mine.** For each
reference field the tool reads the intake, reads the person's own story bank
(`sim/stories.js`, written before the lexicon was consulted), and runs one
release over the three heaviest loaded addresses with the arithmetic lifted
from `ui/release.js` and guarded against it. Every figure a draft may carry
comes out of that read. The sentences are slot templates in each person's
register, taken from their `says` line and their simulated reactions in
`RESEARCH-icp.md`, and the slots are filled from the read and never typed.

**Four rounds per angle, to find what holds rather than assert it.**

    category   the shelf's own testimonial, written on purpose
    readout    the numbers alone
    first      a first draft that was wrong, kept on the record
    voice      the person, in their register, with one measured fact

**Eight checks on every draft.** The first two are the gates this directory
already runs. The other six exist because both gates passed the category
round word for word on the first run.

    guard       refuse.js returns no violation
    voice       the voice gate returns no hard failure
    grounded    every number is one the engine produced for this person, or is
                quoted from their own words with the source named
    true        no feeling the reading did not measure, and no claim that the
                score moved, or held, that the printed CQ contradicts
    specific    the swap test: names a place the engine seats, and carries no
                phrase any wellness product could print
    coordinate  names a nerve and a seat, never an address name
    person      somebody is speaking
    labelled    SIMULATED, against a reference field

---

## The result, in five lines

- **Round three landed 13 of 13. The category round landed 0 of 16, the
  readout 0 of 12, and the one first draft on record failed.**
- **The results angle cannot be written for the primary target.** Marcus,
  Angela and Sofia are grid levels 7 to 8, which `BUYERS.md` calls the best
  combination of size and conversion. On the intake alone none of the three
  has anything to release. Marcus gets there only after writing. Angela and
  Sofia do not get there at all.
- **CQ is the wrong headline for a result.** One release moved raw CQ by 0.05
  to 0.09 for the five reference fields that could release, and the printed number moved for 33 of the 498 panel people who
  could release, every one of them at a rounding boundary. What moves is the
  load: the count above the line and the weight on the heaviest address.
- **The novelty angle rests on the story being read, and that works on 22 of
  39 of their own sentences.** The sentence each person is defined by, their
  `says` line, is seated for 1 of 9.
- **None of it may be published as a testimonial.** Where the lines that held
  can go instead is below, and one route is worth building now.

---

## The testimonials that landed, and what grounds each one

Weights are the release card's, 0 to 100. Loaded means an address at or above
4 of 10, which the quiz result calls *above the line where it starts to cost*.
Expression is CQ with the load's pull taken off, printed to one decimal on the
release card. CQ is the 21 laws over 210, printed as a whole number everywhere.

**Derek, 39, endurance. Level 5. Results.**

> I watched the coherence number go from 48 to 49, and the raw move under it
> was 0.06, so that is rounding. The load is what moved: twenty loaded
> addresses became three.

Grounded in: loaded 20 to 3 after one release of twelve lines; raw CQ 48.48 to
48.53, printed 48 to 49; heaviest address at the iliac branches, sacral seat,
68 to 52; expression 42.6 to 46.5. **The best line in the set**, and it came
from a mistake. His first draft said *"The coherence number did not move, and I
checked."* It read as the most honest line in the exercise and it was false:
48.48 prints as 48 and 48.53 prints as 49. The truth check at the time only
refused a score claimed to rise, so it passed. It now refuses a score claimed
to hold as well, and `tests.js` 21 asserts the first draft stays caught. The
replacement is stronger because it names the rounding. Derek is the reader
who, in `RESEARCH-icp.md` section 5, runs the arithmetic nobody else runs, and
a testimonial that shows its own rounding is written for exactly him.

**Diane, 46, founder. Level 6. Results.**

> I wanted a number I did not already have. Eight addresses sat above the line
> where it starts to cost. After one release, one did.

Grounded in: loaded 8 to 1; heaviest at the iliac branches, 51 to 38;
expression 56.0 to 58.2; CQ printed 59 before and after. The first sentence is
hers from `RESEARCH-icp.md` section 1. This is `BUYERS.md` level 6 exactly:
*"buys out of pragmatic desperation to stop the loop"*, sold a count and a cost.

**Marcus, 44, creative director. Level 7. Novelty.**

> I wanted a claim specific enough to be wrong. A sentence about a timeline I
> lied about went to the throat seat, the cervical plexus. The table is open,
> so I checked it.

Grounded in: his own sentence, *"I lied about the timeline. Again."*, seated by
the sniffer at the throat seat, first at the cervical plexus. The open table is
the product's strongest proof (`MARKETING-social.md` 3a line 8). His results
line also lands, but only by the story route: nothing sat above the line at
intake, three addresses did after his five sentences, and one release took the
heaviest, at the pelvic splanchnic nerves, from 43 to 32.

**James, 57, third turnaround. Level 5 on CQ, 4 on expression. Both angles.**

> No ranking, which I asked for, and no opinion about my life. Eighteen
> addresses above the line, fifteen after one release. The heaviest, the
> thoracic ganglia, 63 to 48.

> I wrote that my chest is tight in every meeting. It put that at the heart
> seat, the vagal branches, and said nothing about what kind of man that makes
> me.

Grounded in: loaded 18 to 15, heaviest at the thoracic ganglia 63 to 48,
expression 37.2 to 38.8, CQ printed 42 before and after; his sentence seated at
the heart. *No ranking, which I asked for* is the refusal of the leaderboard in
`GUARD.md`, turned into proof by the one person who wanted one.

**Rosa, 61, retired midwife. Level 10. Novelty.**

> It read clear and said nothing here would relieve me of anything. Then it
> showed me all 112 addresses anyway, none lit.

Grounded in: nothing held anywhere, which is her reading and the clear entry
H18's. The only testimonial in the set that sells confirmation, and it is true.

**Angela, 36, six modalities, and Sofia, 41, somatic practitioner. Level 7 and
8. Novelty only, because there is nothing to release.**

> Six modalities told me a story about it. This put my sentence about 3
> funerals at the heart seat, the pericardial nerve, and showed me where it
> lives.

> I read my clients in a minute and cannot read myself. I wrote that I was
> angry with a client. It put it at the solar seat, the celiac plexus.

Both land on the checks. Both are weaker than they look, below.

**Ana, 47, one year out. Both angles land, and both stay inside.**

> I needed to know it has an end. Forty one addresses above the line, thirty
> three after one release. The vagus nerve went from 96 to 74.

The largest measured move in the set, and the one that must not be used. Her
heaviest key is served H07, one of the four dosed hooks, and `MARKETING-social.md`
3c holds all four inside: the dose only works when the reading chose the
reader. A result from somebody in grief, used to reach other people, is aimed
at people in grief. The tool marks both of her lines `INSIDE ONLY`.

**Gordon, 58. No testimonial is written.** The band gate refuses him at level 1
on expression, and he is served the engine's own direction for that band. A
testimonial in his voice would be the harm the gate exists to prevent.

---

## What worked

- **Naming the rounding.** Derek's line is the only testimonial format in the
  set that a hostile reader cannot improve on, because it has already done
  the checking out loud. It works for the X audience, `BUYERS.md` levels 7 to
  9, who buy on instruments and need almost no persuasion.
- **A count above a line, before and after.** Diane's and James's lines. It is
  the one result that moves after a single release for everybody who can
  release: the median drop across the panel is 7 for Diane's archetype, 13 for
  Derek's, 6 for James's and 8 for Ana's. It is also a number the quiz result
  page already prints, so the line and the page agree.
- **The objection, turned.** James asked for a rank and did not get one. Diane
  wanted a number she did not already have. Marcus wanted a claim that could
  be wrong. Each landed line starts from the thing that person said they
  wanted in `RESEARCH-icp.md` and shows the product answering it, or refusing
  it for a reason. That is answering the objection in the material rather than
  in a rebuttal.
- **The nerve, never the address name.** Every landed line names a nerve and a
  seat. The readout round quoted the address names and read as labels on the
  speaker: *Self-Judgment*, *Blame*, *Deceit*. `hooks.js` H03's rule already
  says the name of an address is available to a person and never put in front
  of them as a label. A testimonial is a label in front of everybody.

## What did not work

- **The category round, 0 of 16, and both gates passed it.** *"I feel calmer
  and more like myself than I have in years. My score went up after the first
  week. Life changing, highly recommend."* It fails four ways. No feeling was
  measured. No week passed. The printed CQ moved for one reference field of
  nine, Derek, and only by rounding.
  And it survives the swap test with any product on the shelf. `refuse.js`
  now refuses the register as well as the count (its `testimonial` rule), and
  `tests.js` 23 holds it.
- **The readout, 0 of 12.** True, specific, and nobody is speaking. A column
  of figures in quotation marks is a spec sheet, and the address names in it
  read as a verdict.
- **Results for the primary target.** Marcus, Angela and Sofia are 450 of the
  1000, and 0 of them can release on the intake alone. With Rosa's 15 that is
  465, the same figure `GUARD.md` reaches by a different tool. A results
  testimonial is only possible for the 498 at Diane, Derek, James and Ana, who
  are grid levels 4 to 6: exactly the levels `BUYERS.md` calls the hardest
  sell. **The angle that proves the product is only available in the segment
  that buys least.**
- **Angela's line overclaims precision, and the checks cannot see it.** *"Showed
  me where it lives."* The sniffer seated her sentence on the word *funerals*
  and spread it across four addresses in the heart band, not one. It is the
  first thing `GUARD.md` says a gate cannot check: a true statement arranged to
  imply a false one. The line is true about the seat and implies a single
  address.
- **Sofia's line has no consequence.** It ends on a coordinate and a reader
  asks *so what*. Her real reason to buy is her clients (`RESEARCH-icp.md`),
  and the practitioner sight list, consent and revocation are unbuilt, so the
  line that would land for her cannot be written honestly yet.
- **The novelty moment depends on the story being read, and it often is not.**
  22 of their 39 story sentences were seated, and the sentence each person is
  defined by was seated for 1 of 9 (Angela's). *"I hold the room for everyone"*,
  Sofia's, reads nothing. So does Diane's *"Rest feels like a moral failure"*.
  A novelty testimonial promises a moment the product currently delivers a
  little over half the time.
- **Recognition is concentrated.** 521 of 1000 carry most at the sacral, 183
  at the heart, 6 at the throat. A results line at the sacral is recognition
  for half the panel. Diane's and Marcus's novelty lines name the throat and
  are recognition for 6 in 1000. Novelty lines work on mechanism rather than
  recognition, so this matters less for them, and it decides which results
  lines are worth producing.

---

## The three lenses, briefly

**The reference people.** Split cleanly by level. Levels 4 to 6 (Diane, Derek,
James, Ana) have a result to report and report it as a count. Levels 7 to 8
(Marcus, Angela, Sofia) report the instrument itself: a sentence seated, a
table they could check. Level 10 (Rosa) reports confirmation. Level 1 (Gordon)
is not asked.

**The focus group, the thousand.** 498 can produce a results line on the
intake alone, 465 cannot, 35 are refused. After one release the median
expression gain is 1.8 for Diane's archetype, 3.3 for Derek's, 2.0 for James's
and 1.5 for Ana's. The printed CQ moved for 33 of the 498. On fresh ground, it
takes Diane eleven releases of twelve lines to move her printed CQ by one
point, James three and Ana five. Derek needs one, because he starts at a
rounding boundary. The ladder's allowance was not modelled in these counts.

**The team, on the record.** Brand (`BRAND.md` section 2): the position is
subtraction, a gauge held down rather than a score earned, and the result
lines above are subtraction in the first person. Research (`RESEARCH-icp.md`
section 7): a cost funnel beats an insight funnel, and the load count is the
cost. The guard (`GUARD.md`): no users, so no testimonials. Marketing: the
results angle and the primary target do not overlap, and that is the finding
to plan around rather than write around.

---

## Where the lines that held may go, since not as testimonials

1. **As worked examples, in the third person, labelled as such.** The product
   already ships these people as reference cases a person can load. A post that
   says *"Derek is a worked example in the instrument. One release: twenty
   loaded addresses became three. The coherence number moved 0.06."* is content
   that is the product, and it passes both gates. It carries no user voice and
   invents no user. **This is the one to build now**, for X and the newsletter.
2. **As the share card caption, spoken by the real person.** `MARKETING-social.md`
   section 5 already pre-fills a first person caption. The landed novelty lines
   give its shape: *"I wrote one sentence. It put it at the heart."* passes both
   gates and carries no number, no band and no address name, which the card
   rules require.
3. **As the prompt for real testimonials later.** When accounts exist, ask a
   person what the card printed, before and after, and what they wrote, and
   never how they feel. The checks in `testimony.js` are the review a real
   testimonial goes through before use, with *simulated* replaced by consent.

---

## Suggestions, for the future

1. **Put the count above the line, before and after, on the release card.** It
   is the number that moves, it is the one a real person would quote, and today
   the card leads on weights. A product change for the release seat, not ours.
2. **Sell levels 7 to 8 on the instrument, and levels 5 to 6 on the result.**
   The segment plan in `MARKETING-social.md` section 6 already puts the X
   beachhead on instruments. This exercise adds why: the primary target has no
   result to show on the intake alone, and no amount of copy fixes that.
3. **Close the story gap before leading on novelty.** The sniffer seated 1 of 9
   defining lines. The lexicon work belongs to the engine seat. Until it moves,
   novelty material shows a sentence that was seated, and never promises that
   yours will be.
4. **Never lead a result on CQ.** One release moves it by a tenth of a point,
   by the engine's own design (*"you may not see CQ move"*, `ui/release.js`).
   On the panel a result claim on the score is false for all but 33 of the 498
   who can release, and true for those 33 only by rounding.
5. **Keep the dosed keys inside, including from worked examples.** Ana's is the
   most striking line in the set. It stays in.
6. **Run the eight checks on every piece of copy that sounds like a person**,
   not only on testimonials: newsletter pull quotes, the caption, the founder's
   own proof lines. `refuse.js` reads the words. `testimony.js` reads the words
   against a reading, and that is the half a copy review cannot do by eye.
