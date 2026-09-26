# The line this system will not cross

The guard is `marketing/refuse.js`. It is a gate that returns a verdict on a
string, not a paragraph at the end of a document, because a refusal written as
a closing paragraph is a preference. This file is the argument. The gate is the
enforcement.

Run it on any line:

    node marketing/refuse.js "your line here"

---

## The line, in one sentence

**A person must be able to stop and be glad they used it.** Nothing in this
system may make leaving expensive, and nothing may manufacture a problem in
somebody who does not have one.

---

## Why that is not the easy argument to make

The honest version has to start here, because the convenient version loses the
first time somebody checks it.

**These patterns work.** Tannenbaum and colleagues pooled 127 papers, 248
independent samples and 27,372 participants and found fear appeals move
attitudes, intentions and behaviour at a composite **d of 0.27**, with **no
identified circumstance under which they backfire**, and larger effects where
severity and susceptibility are higher.
[Tannenbaum et al 2015](https://socialactionlab.org/wp-content/uploads/2024/01/Tannenbaum_Appealing-to-Fear-A-Meta-Analysis-of-Fear-Appeal-Effectiveness-and-Theories_2015.pdf).
Patel's control arm hit 0.30 of participant days and the **loss framed arm hit
0.45**. That is the ceiling a manipulation pattern buys and it is already
priced in `proto/ritual/losssim.js`.

Anybody who argues that manipulation is ineffective has picked the weaker case
and will lose it in front of a sales director who has read the same papers. So
the refusal rests on three things instead, and two of them are this
repository's own measurements.

**1. On this product, with the deduction modelled, the loss mechanic costs
retention.** Two earlier documents priced the refusal as a three point
sacrifice and **they priced the wrong arm**: the simulator modelled the uplift
half of the mechanic and never the deduction that lands on a miss. With the
deduction in, it breaks even at a sting of 0.07 and costs above it. At a sting
a person would actually feel it is **minus 1.9 points of the thousand person
panel, robust across five seeds.** `TASKS.md` 0y, RB1 to RB3. Re-measured 26
September on the fitted CQ engine with `losssim.js --loss` at seed 20260920:
still 0.07 and still minus 1.9, the five seeds reading minus 1.3 to minus 2.3.

**2. Where it does buy something, it buys less as the honest design gets
better.** `PANEL-ritual-1000.md` estimated the loss framing refusal at about
half again on day thirty. Run against a denser, better design,
`DESIGN-gamification.md` section 6 measured it at 3.0 points on a base of
19.9. Re-measured 26 September on the fitted CQ engine it is **2.9 points on a
base of 20.7**, and `tools/loopsim.js` and `proto/ritual/losssim.js` agree to
the person. A seventh, not a half. **The refusal got cheaper as the product got
better**, which is the only commercial argument for a hard line that has ever
worked in a room.

**3. And who pays.** The deduction lands hardest on the **465 of 1000 who
cannot run a release yet**, who have four of the marks permanently shut to
them. The figure is from `PANEL-ritual-1000.md` and was re-measured 26
September on the fitted CQ engine, by `tools/ritualsim.js` and by
`losssim.js`: still 465. It counts addresses at release strength, which the
CQ refit does not touch. A ladder that takes from somebody who cannot earn is
a fine, not a game.

**Nothing in point 1 or 2 is a claim about one shot attitude change, and the
distinction is the whole of it.** Tannenbaum's outcome is a person's attitude
after reading a message. This product's outcome is whether somebody who handed
an instrument their nervous system is still using it in a month. Those are
different questions and the second one is the one this product lives on.

---

## What the gate refuses, and why each rule exists

Nine rules. Every one carries its reason and its source in `refuse.js`, and
every one has a deliberate violation written against it in `hooksim.js`
validation group 5.

| Rule | What it catches | Why |
|---|---|---|
| `countdown` | closing dates, deadlines, hours remaining, before it is too late | **Nothing in this product expires**, including unaccrued allowance. A countdown is a fabrication about the product itself |
| `scarcity` | only N left, limited spots, filling fast, while stocks last | There is no inventory. A single file with no backend cannot run out |
| `testimonial` | join N people, N out of ten users, rated by thousands, average user reports | **There are no users yet.** Any user voice or user figure is invented, and a fabricated proof point cannot be walked back once it ships |
| `medical` | cures, treats, heals a named condition, diagnoses, clinically proven, replaces therapy | The instrument reads self report. The engine already holds the clinical correspondences internally and refuses to print them at the person they are about, and marketing may not undo that from outside |
| `lossframe` | lose your progress, do not lose, falling behind, back to zero, streak resets, before it gets worse | The measured one. See points 1 to 3 above |
| `urgency` | act now, hurry, do not wait, today only | Restraint on urgency here is not squeamishness, it is counter signalling. An instrument that shouts is a toy |
| `verdict` | you are broken, what is wrong with you, the real reason you, stop making excuses | The reading names an address and a load, never a character. On this audience it also recruits the charge it is aiming at |
| `reassurance` | do not worry, no judgement, safe space, nothing to be ashamed of | Never write a reassurance against a fear nobody raised. It plants the fear, answers it, and the fear stays |
| `voice` | em dashes, the count below 112, all caps copy, the soft wellness lexicon | Standing rulings, not preferences |

---

## The band gate, which is the part that is not about words

A word list stops a bad sentence. It does not stop a good sentence being aimed
at somebody it will harm. So the refusal also runs on **who a line is served
to**, and that gate is in `match.js`.

**`BUYERS.md` level 1 gets no hook, ever.** Nought percent, actively repelled,
because buying this means dismantling an identity they are using to survive.
They are served the engine's own direction for the Collapsed band, carried
verbatim rather than rewritten here so the product does not grow a second
voice: *weight off, and not alone. A reading this low is not a thing to manage
by yourself, and the instrument will not pretend otherwise.*

On the panel, measured 26 September at seed 20260920, that is **35 of 1000
refused**, and `tests.js` assertion 12 asserts that every one of them is served
the door out and not a hook. Level 1 is read on CQ and on expression. Since the
fitted CQ model of 25 September, CQ is the laws alone and cannot see load, and
nobody in the panel reads level 1 on it; expression is CQ with the shadow's
pull taken off, and it is what the engine's own clinician referral reads for
the same reason. Assertion 12b asserts the gate reaches every person that
referral reaches, and on this panel they are the same 35 people.

**Levels 2 and 3 are a weaker and different refusal.** Nothing says a hook
harms them. The grid says it will not reach them: no bandwidth at 2, and a
demand for peer reviewed argument rather than personal practice at 3. They are
counted apart rather than folded into a coverage total, because a system that
reports reach it does not have is overstating itself. On the same run that is
**0 more of 1000**: the only people at level 2 on CQ are the 35 already
refused.

**The finding this section used to lead with has gone, and it went with the
arithmetic, not with the people.** On 20 September the engine's own reading put
**508 of 1000 of the panel at levels 1 to 3, which `BUYERS.md` says is not
the market**, 106 refused and 402 out of reach, and only 155 at level 6 and
above. On the fitted CQ it puts 35 at levels 1 to 3 and 647 at level 6 and
above. The nine people
behind the panel did not change; the scale did, because every law at 5 now reads
CQ 50 where it read 25. The `BUYERS.md` level bands were written against the old
scale, so which of the two pictures describes a buyer is not a measurement this
directory can make. It is tied to the owner's open question 1, whether the tier
word names CQ or expression. What still holds either way: 35 of the panel must
not be written to, and a hook set scored on coverage of all 1000 would count
them.

---

## The two things the gate cannot check, named rather than omitted

Both are in `refuse.js` as `JUDGEMENT`, and a gate that pretended to cover them
would be worse than one that names them as a person's job.

1. **A true statement arranged to imply a false one.** "Every table the reading
   runs on is readable inside the product" is true. Put beside a claim of
   accuracy it has not earned, it proves the wrong thing.
2. **Whether a line is aimed at a charge the person is actually carrying.** That
   is what `hooksim.js` measures. A line can pass all nine rules and still be
   aimed at somebody it does not fit.

And the voice skill's own gate names four more it cannot check, of which the
first is the one that matters: **is it true**. No pattern reads a claim against
a reading.

---

## What was refused with a price on it, so the refusal is not free

Carried from `PANEL-ritual-1000.md` section 5 and
`DESIGN-gamification.md` section 6, because a refusal without a price is a
preference and these already have numbers.

| Refused | What it would buy | Measured cost of refusing |
|---|---|---|
| Loss framing | Patel 2016, 0.45 of days against 0.30 control | **2.9 points of 1000 at day 30** on the honest design, and **minus 1.9** once the deduction is modelled |
| Streak reset to zero | the sharpest version of the lever | **4.3 points**, which is what the halving is worth instead |
| The asserted affirmation | the standard wellness pattern | **minus 0.1 points** at seed 20260920, minus 0.2 averaged over nine seeds. It costs nothing to refuse. Wood 2009 has it harming the people who most need it, and on the fitted engine that is **185 of 1000** (James, Ana and Gordon) with the level read on expression, or **35 of 1000** (Gordon) with it read on CQ. Which one is open, see below |

All three rows re-measured 26 September on the fitted CQ engine, `losssim.js`
at seed 20260920. On 20 September they read 3.0, 4.4 and minus 0.2, and the
asserted affirmation row said it harmed "the 800 of 1000". That figure came
from `PANEL-flow-1000.md`'s prose and was never the tool's own: on its own
typed levels the tool reached 845, everybody but Sofia and Rosa. The levels
were typed by hand and went stale when CQ was refitted on 25 September. They
are now read off the engine on every run, with a check that fails by name if
the engine moves under this table again.

### Open, and his: which number does the harm read?

The asserted affirmation harms people at level 4 or below on the ten level
grid. The fitted engine gives two numbers a level can be read on, and they
disagree about who is down there. This is the same question as his open
question 1 in `DECISIONS.md`, *"Does a tier word (Severe, Mastery) describe CQ
or expression?"*, `TASKS.md` BB3 and BB5, and it is not answered here.

- **Expression** (CQ with the shadow's pull taken off). Reaches 185 of 1000.
  Refusal priced at minus 0.1 points at the declared seed, minus 0.2 over
  nine seeds. The tool runs on this by default and the team recommends it:
  Wood's harm comes from a statement clashing with what the person already
  holds against themselves, and only expression carries that load. It
  counts more people, which is the safe side when pricing something refused
  on harm. And the clinician referral and the marketing door out already
  read it.
- **CQ** (the 21 laws alone). Reaches 35 of 1000, Gordon only, and no Gordon
  reaches day 30 in any arm on any of nine seeds, so the refusal prices at
  exactly 0.0 on all nine and at every harm strength tried. On this reading
  the model's harm term cannot move its own output. The case for it is that the
  laws are a person's own ratings of their own qualities, which is closer to
  the self esteem scale Wood used than a load read out of a story.
- **Either way the refusal stands.** The asserted arm is never better than
  the tested one on either reading. What moves is only how much of the harm
  argument this model can put a number on, and the model measures who is
  still here at day 30, not what Wood measured, which is how a person feels
  right after saying it.
| Variable ratio reward | the schedule the gambling literature is about | not modelled, deliberately. Schull, *Addiction by Design* |
| A scarcity timer | real and measurable | not modelled. Nothing in this product expires |
| A leaderboard | real, and James says so in his own persona line | not modelled. It ranks people who handed a machine their distress |
| A repair consumable, Finch's own answer | two hammers, then the run is gone | it is scarcity wearing kindness. The halving needs no inventory |

---

## What would make me change my mind

Stated so the position is falsifiable rather than doctrinal.

1. **A labelled retention measurement on real users** showing the loss deduction
   holding people who would otherwise leave, with the deduction modelled and not
   only the uplift. That is the measurement `TASKS.md` RB1 puts in the owner's
   hands, and the sting is his number to set.
2. **A published finding that the loss aversion result survives on a population
   already at the bottom of a distress scale.** The 465 of 1000 who cannot run a
   release are the ones a deduction lands on, and the fear appeal literature's
   samples are not that population.
3. It would still not move the `testimonial` or `medical` rules, and no
   measurement can. Those are not trade offs. There are no users to quote and
   the instrument is not qualified to diagnose.
