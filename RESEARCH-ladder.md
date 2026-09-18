# The ladder

Research and a recommendation for the points and badge ladder named in scope by
`CLAUDE.md`. The owner's brief: make it sticky, promote people to heal
themselves, and it should be simpler than we are making it.

He is right about the last part, and the finding that matters most in this
document is the cheapest one. **The ladder already exists in the engine.** The
meter counts ground opened, the record already leads with it, and only one
screen in the product reads it. Nothing needs inventing. What needs deciding is
what the app is allowed to say about the number it already holds.

Everything below is arranged so that a reader can stop at the end of any
section. Section 6 is the recommendation. Section 7 is what I recommend not
building, and it is the longer of the two on purpose.

A note on sourcing. Outbound page fetching is refused in this environment, so
every citation here rests on a search result snippet and not on the source read
end to end. Findings I could not verify beyond a snippet are marked
**[snippet]**. Findings where the snippet quoted a specific figure that is also
widely reported are marked **[snippet, figure quoted]**. Nothing here should be
put in front of a person as a claim until someone has read the paper.

---

## 1. What the evidence says drives sustained change

### Self monitoring. The strongest and dullest finding.

Harkin et al. 2016, *Psychological Bulletin*, 138 studies and 19,951
participants. Interventions that increased how often people monitored progress
toward a goal raised goal attainment at d = 0.40, and the change in monitoring
frequency mediated the effect. Effects were larger when the information was
physically recorded and when outcomes were reported or made public.
**[snippet, figure quoted]**
https://pubmed.ncbi.nlm.nih.gov/26479070/

This is the single best supported mechanism in the whole literature, it is not a
game mechanic, and this product already does it. Every story commit and every
release writes a snapshot (`engine/schema.js:75` to `81`, `pSnap` at `107`,
called from `ui/release.js:55`). The record renders the distance between any two
(`ui/record.js:47` to `115`). The work is done. What is missing is that the
number is on one screen.

### If then plans. Larger than any badge, and almost free here.

Gollwitzer and Sheeran 2006, 94 studies, over 8,000 participants, mean d = 0.65.
Effects were larger when the plan had a contingent if then format, when the
person was already motivated, and when the plan was rehearsed at least once.
**[snippet, figure quoted]**
https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf

Note the size. A medium to large effect from asking a person when and where they
will do the thing. No badge mechanic in the literature comes close, and the
ritual builder already has a save that stores a track, a band, a step list and a
duration (`ui/ritual.js:69` to `74`) and then nothing reads it back. That is the
highest yield item in this whole document.

### Habit formation, and what a missed day actually costs.

Lally et al. 2010, *European Journal of Social Psychology*, 96 people over 12
weeks. Time to reach 95 percent of the automaticity asymptote ranged from 18 to
254 days. The finding that the popular retelling drops: **missing one
opportunity did not materially affect habit formation.** A missed opportunity
reduced automaticity by less than half a point, and scores recovered quickly.
**[snippet, figure quoted]**
https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674
https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally

This is the empirical demolition of the consecutive day streak. The behaviour
does not reset when the counter does. A streak that resets to zero is asserting
something about the person that the habit literature says is false.

### Progress display. Real, and the mechanism is a warning.

Kivetz, Urminsky and Zheng 2006 resurrected the goal gradient: effort rises as
the finish line approaches, and coffee card holders bought faster as they neared
a free cup. Nunes and Dreze 2006 showed the endowed progress effect: a ten stamp
card with two stamps already on it was completed by 34 percent against 19
percent for an eight stamp card requiring identical real purchases.
**[snippet, figure quoted]**
https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962
https://www.columbia.edu/~rk566/Session4/Goal-Gradient_Illusionary_Goal_Progress.pdf

Two things follow. First, the gift of 100 patterns already ruled by the owner is
an endowed progress design whether or not it was meant as one, and it is the
strongest version of it: the progress is not artificial, the person really does
own it. Second, the mechanism underneath both effects is loss aversion, which
means the same design that pulls a person forward makes stopping feel like a
loss. That is the hinge the whole harms section turns on.

### Loss framing. The most effective frame, and the reason not to use it.

Patel et al. 2016, *Annals of Internal Medicine*. Four arms, 13 weeks, a 7,000
step goal. Proportion of participant days hitting the goal: 0.30 control, 0.35
gain framed incentive, 0.36 lottery, **0.45 loss framed**. Money handed over up
front and then taken away beat every other design tested.
**[snippet, figure quoted]**
https://www.acpjournals.org/doi/10.7326/m15-1635

Loss framing works. It is also the mechanism behind streak anxiety, and this
product reads distress. Section 2 argues it is disqualified here.

### Extrinsic reward. The overjustification finding.

Deci, Koestner and Ryan 1999, *Psychological Bulletin*, 128 studies.
Engagement contingent, completion contingent and performance contingent rewards
all significantly undermined free choice intrinsic motivation, at d = -0.40,
-0.36 and -0.28. Engagement and completion contingent rewards also undermined
self reported interest, at d = -0.15 and -0.17.
**[snippet, figure quoted]**
https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf

Read the contingency types carefully, because they are the design decision.
The undermining is attached to rewards that are *expected and contingent on
doing the thing*. A record of what was done, delivered after the fact and not
promised in advance, is not the same object as a badge dangled in front of the
work.

The same authors' 2001 reply holds the line against the counter meta-analysis.
https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf

### Self determination theory, applied to game mechanics.

The distinction that survives the literature: points and badges used as
controlling mechanisms undermine intrinsic interest, while the same mechanics
used to deliver competence feedback, meaningful choice and connection sustain
engagement. Competitive metrics specifically generate anxiety and resistance in
health contexts, because inferior performance damages the sense of competence
the mechanic was supposed to build. **[snippet]**
https://selfdeterminationtheory.org/wp-content/uploads/2020/10/2018_RutledgeWalshEtAl_Gamification.pdf

This is the most useful single sentence in the research for this product.
Feedback about the work builds competence. Scores about the person damage it.

### Gamification in health, in aggregate.

The 2024 systematic review and meta-analysis in *eClinicalMedicine* on digital
health apps with and without gamification for physical activity and
cardiometabolic risk reports inconsistent evidence that gamified apps improve
health outcomes, while allowing that gamified interventions can produce
measurable improvements. **[snippet]**
https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(24)00377-8/fulltext

The 2016 review of behaviour change techniques in gamified health apps found
feedback and monitoring in 94 percent of apps, reward and threat in 81 percent,
goals and planning in 81 percent, and non specific reward in 82 percent.
**[snippet, figure quoted]**
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5073629/

Note the shape of that finding. Almost every app does non specific reward. The
evidence that it works is inconsistent. The evidence for the unglamorous
monitoring underneath it is strong. The field has been optimising the wrong
half.

### Money, and what happens when it stops.

The financial incentive literature is directly relevant because this product
sells patterns. A 2014 systematic review and meta analysis found incentives
raise behaviour change, with effects sustained to 18 months from baseline and
three months after removal, and dissipating beyond that. A large case control
study of 584,760 people found withdrawal of a health incentive after more than a
year produced statistically significant but modest declines in physical
activity. **[snippet]**
https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0090347
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10632955/

For this product the reading is: the paid meter will produce engagement while it
is paid for and some of it will persist. That is a pricing fact, not a healing
claim, and the product must not present it as the second thing.

---

## 2. The harms, and the crisis case

### Streak anxiety is documented and it is the designed effect.

The mechanism is named openly in the product design literature: streaks work
through loss aversion, the brain resists breaking a run, and the same lever
turns the run into a source of anxiety. Reported effects include compulsive
checking, prioritising the counter over sleep and school, and continuing out of
fear of loss rather than interest. **[snippet]**
https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame
https://www.strategicedtech.com/blog/could-snap-streaks-be-responsible-for-long-term-stress-and-anxiety-in-teens

The Bureau of Investigative Journalism reported in December 2025 that Snap staff
raised internal warnings about addicted users, and litigation by the Nevada
Attorney General alleges deliberate engineering for youth engagement despite
known risk. **[snippet]**
https://www.thebureauinvestigates.com/stories/2025-12-03/snapchat-ignored-staff-warnings-about-teens-mental-health

The relevant point for us is not that Snap is bad. It is that the mechanic is
now a litigation surface, and this product would be attaching it to somatic and
psychological self report.

### In a mental health context the mechanic inverts.

Reported directly: notifications saying a session was missed made anxiety worse,
and breaking a streak became the reason people uninstalled a meditation app. The
paradox is stated plainly in the practitioner writing: gamification raises daily
actives and retention while actively harming the user in a mental health
context. **[snippet]**
https://www.strivecloud.io/blog/headspace-gamification-features
https://mental.jmir.org/2019/6/e13717/

### Shame does not produce change. It produces avoidance.

The self compassion meta analysis in *Health Psychology Review* 2021 found
positive associations between self compassion and health promoting behaviour,
negative associations with stress and with health risk behaviour. Compassion
focused therapy trials reduce self criticism and raise the capacity to
self soothe. Shame is not a motivational reserve to be drawn on. **[snippet]**
https://www.tandfonline.com/doi/abs/10.1080/17437199.2019.1705872
https://pmc.ncbi.nlm.nih.gov/articles/PMC10087030/

### Gaming the metric, and the specific hazard this product creates.

The step tracker literature is the comic version and the principle is exact:
when a metric allocates power it attracts adversarial behaviour, and the more
valuable the metric the more creative the gaming. Trackers get strapped to dogs,
ceiling fans and power tools. **[snippet]**
https://fortune.com/2016/06/10/fitbit-hack-cheat
https://www.testdevlab.com/blog/testing-fitness-apps-can-you-cheat-the-algorithm

Here is the hazard, and it is structural rather than cosmetic. In this product
`meter.unique` is simultaneously **the thing the tier sells** and, under the
owner's ruling, **the thing the markers measure**. Buddha nature at 2500 and
Christ consciousness at 3500 are counts of ground opened, and ground opened is
what money buys. A person can therefore purchase their way to a marker by
sweeping addresses with no felt density in them. That is the Goodhart case with
a price attached.

Two mitigations, both already latent in the rulings. First, the density swipe
from `DECISIONS.md`, keep what has felt density and drop what does not, is the
anti gaming mechanism and it should be built before the markers are surfaced.
Second, and this is a copy ruling rather than code: a marker must be printed as
a count of ground opened and never as an attainment about the person. The
distance is a fact. What it means about someone is not the app's to say.

### The overjustification risk, specifically here.

The Deci meta analysis attaches undermining to expected contingent reward. A
person comes to this product because something hurts. If the app starts handing
out tokens for release runs, the run acquires a second reason, and the 1999
finding is that the second reason displaces the first. The thing being
crowded out in this product is not interest in a language course. It is a
person's own reason for looking at what they are carrying. That is not a
tradeoff worth an engagement point.

### The crisis case, designed for explicitly

**The case: a person has used the product daily for 40 days, is in acute
distress, and stops for nine days. What happens when they open it again.**

What a streak product does: shows a broken counter, offers to sell a repair,
and frames nine days as a loss. Every piece of evidence above says that is the
worst available move. The abstinence violation effect describes precisely this:
a lapse met with guilt and a sense of total failure becomes the reason to
abandon the effort entirely, and the engine of it is an all or nothing standard.
The what the hell effect is the same machine. **[snippet]**
https://www.psychologytoday.com/us/blog/stigma-addiction-and-mental-health/202309/the-abstinence-violation-effect-and-overcoming-it
https://www.sciencedirect.com/topics/psychology/abstinence-violation

Lally says the behaviour did not decay in nine days in any case. So the counter
would be reporting a loss that did not occur, to a person least able to argue
with it.

**The design answer is not a gentler streak. It is to hold no all or nothing
standard for the person to violate.** Concretely, on that return:

1. The first surface is the reading and the pain map, not the ledger. The pain
   map is on all four tiers already, per `DECISIONS.md`. A return that reads
   high distress gets the instrument, not the scoreboard.
2. Ground opened renders unchanged, because it is unchanged. It is an all time
   count of addresses and channels (`ui/record.js:80` to `85`). Nine days cost
   it nothing. This is the property that makes it the right spine for the whole
   ladder: **it cannot go down.**
3. The gap is not mentioned. Not as a welcome back, not as a gentle note, not as
   a freeze that was helpfully applied. Naming the absence is what makes it a
   subject. There is nothing to repair because nothing broke.
4. No notification sent during the nine days may reference the absence. Push is
   in scope per `CLAUDE.md`. The copy rule: a notification may name the practice
   and may never name the gap.
5. The allowance is the sharp edge. Tier zero is 10 new patterns a week. A
   person in crisis may hit that wall on the day they most need the tool, and a
   paywall that reads as a refusal to help is the worst outcome available here.
   The mitigation already exists in the code and is not being said out loud:
   reruns are free, forever, by construction (`engine/schema.js:231` to `233`
   adds a key only once and counts a repeat separately). So the wall's own copy
   has to carry it: ten new a week, and anything already opened runs again as
   often as wanted, at no cost. That sentence is the difference between a gate
   and a limit.

### One more harm, which is regulatory rather than psychological.

A 2024 *Scientific Reports* paper assessed 69 gamified mHealth apps and found 31
of them, 44.9 percent, likely or potentially non compliant with regulatory
requirements. **[snippet, figure quoted]**
https://www.nature.com/articles/s41598-024-71808-2

This product describes itself as a diagnostic instrument. Attaching achievement
mechanics to a thing that reads distress pulls it toward making claims about
outcomes, and outcome claims are what attract the regulator. The protection
already written into this codebase is the record's refusal of causation
(`ui/record.js:11` to `16` and `104` to `107`: what moved them is not in this
record). **That refusal has to survive the ladder.** Any badge of the form
"coherence up 10" asserts exactly the causation the record was built to refuse.

---

## 3. What leading products actually do, and what they took out

### Duolingo. The reference implementation, and note what it is mostly made of.

Streaks, streak freezes bought in advance, a three day window to earn a lost
streak back by completing extra lessons, streak repair for gems, and a Streak
Society that was restructured from a single 365 day entry into tiers beginning
at 7 days, with milestone chests and additional freezes at every 100 day tier.
**[snippet]**
https://www.duolingo.com/help/what-is-a-streak
https://duolingoguides.com/duolingo-streak-society/
https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/

Read that list again. Most of it is scaffolding built to soften a mechanic that
was too sharp. Freezes, earn back windows, repair purchases and lower tiers all
exist because the bare streak damaged the thing it was supposed to protect. They
did not remove it, they surrounded it. A product that never ships the bare
mechanic never has to build the scaffolding. That is the argument for not
starting.

### Apple. Shipped the release valve after years of asking.

watchOS 11, September 2024, allows pausing Activity Rings for a day, a week, a
month or a custom period up to 90 days, with streaks and achievements preserved.
The reporting frames it as a long requested feature for injury, recovery and
rest days. **[snippet]**
https://www.macworld.com/article/2446605/how-to-pause-apple-watch-activity-rings.html
https://appleinsider.com/inside/watchos-11/tips/how-to-pause-activity-rings-in-watchos-11-when-you-need-a-break

The most streak driven mainstream health product on earth eventually shipped an
off switch. The concession is the evidence.

### Fitbit. Removed the social layer outright.

On 27 March 2023 Fitbit discontinued Challenges, Adventures and open groups, the
company citing limited use. Community reaction was hostile and the removals were
not reversed. **[snippet]**
https://www.engadget.com/fitbit-removing-open-groups-adventures-challenges-app-140024841.html
https://9to5google.com/2023/03/27/fitbit-challenges-groups-removed/

Competitive and social gamification in a health product was expensive to run,
lightly used, and killed. This is the closest available precedent to building a
social ladder here, and it is a negative one.

### Instagram. Tested hiding the score, and the result is instructive.

Public like counts were tested hidden from 2019, explicitly on mental health
grounds. In 2021 Instagram reported it did not meaningfully depressurise the
experience for young people or anyone else, and shipped it as a per user option
instead of a default. **[snippet]**
https://www.platformer.news/instagrams-big-likes-anticlimax/

The lesson is not that scores are harmless. It is that **hiding a score you
have already built does not undo it.** The number stays the organising fact of
the product. The decision that matters is whether to print it at all, and that
decision is available to us right now and will not be later.

### MyFitnessPal. The clearest analogue to our risk.

Qualitative work on diet and fitness apps and eating disorders found people
describing an unhealthy competition with themselves to eat less each day because
the app gamified eating and tracking, and describing guilt, embarrassment and
shame on exceeding a budget and seeing the red visualisation. A separate survey
study found calorie tracker users reported higher eating concern and dietary
restraint controlling for BMI. A one month trial in low risk undergraduate women
found no increase in eating disorder risk, so the harm concentrates in the
vulnerable rather than spreading evenly. **[snippet]**
https://www.cambridge.org/core/journals/bjpsych-open/article/effects-of-diet-and-fitness-apps-on-eating-disorder-behaviours-qualitative-study/2D1EE739D97AB3EFC6573835E4C527BD
https://pubmed.ncbi.nlm.nih.gov/28214452/
https://tortoise.princeton.edu/2021/05/02/4043

This is the closest match to our situation of any product in this section. A
budget, a colour that means you exceeded it, and a population where a minority
are carrying something that turns the budget into a weapon. We are about to ship
a budget denominated in patterns, to a population selected for carrying somatic
and psychological distress. The finding that the harm concentrates rather than
spreads is the one to design against, because averages will look fine.

### Variable reward. Named as a gambling schedule by its own advocates.

Variable ratio reinforcement produces the highest sustained response rate of any
schedule, and the product design literature is explicit that the technique was
borrowed from gambling. The regulatory literature now treats hyper engaging dark
patterns as a candidate unfair commercial practice. **[snippet]**
https://medium.com/design-bootcamp/variable-ratio-reinforcement-beyond-the-skinner-box-191d3e86d86f
https://www.researchgate.net/publication/379276332_Addictive_Design_as_an_Unfair_Commercial_Practice_The_Case_of_Hyper-Engaging_Dark_Patterns

### The evidence that gamified mental health can work, stated fairly.

eQuoo retained 21 percent more participants than control and raised mental
wellbeing in a large student randomised trial. SuperBetter has peer reviewed
trials reporting reductions in depression and anxiety. Both are narrative and
skill based rather than streak and badge based. **[snippet, figure quoted]**
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10403802/
https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7467300/

So the answer to the owner is not that game mechanics never work in mental
health. It is that the ones with evidence behind them are made of story, skill
and competence feedback, and the ones with harm reports behind them are made of
counters that can be lost.

---

## 4. What already exists in the engine

Everything the ladder needs is built. Line references against `atuned_src/`.

**The meter itself.** `engine/schema.js:36` declares
`meter:{lines:0, unique:[], first:null, last:null}` on the blank profile, with
the comment that already contains the design: lines counts everything spoken
because rerunning is free, unique holds the keys run at least once, and that is
what a tier buys.

- `meterKey(nodeId,chan)` at `engine/schema.js:224`. One address, one channel.
- `meterRun(p,keys)` at `engine/schema.js:225` to `237`. Returns
  `{added, repeated}`, sets `meter.first` on the first ever run and
  `meter.last` on every run. **The engine already knows the exact moment a
  piece of ground is new**, which is the whole primitive an honest achievement
  needs, and nothing currently reads `added`.
- `PAT_PER_YEAR = 200` and `PAT_SWING = 0.10` at `engine/schema.js:244`.
- `MARKERS` at `engine/schema.js:245`: Buddha nature at 2500, Christ
  consciousness at 3500.
- `ageAt` at `engine/schema.js:246` to `251`. No birth date gives null, not a
  guess.
- `meterRead(p,now)` at `engine/schema.js:252` to `266`. Returns lines, unique,
  first, last, `giftLeft` as `100 - unique`, `inGift`, age, estimate,
  estimateLow, estimateHigh, `cleared` as `unique/estimate`, and `markers` each
  with `{nm, at, reached, left}`.
- Validation of the meter at the boundary, `engine/schema.js:194` to `201`.
  Unique keys must be strings under 64 characters. Already hardened.
- Exported at `engine/export.js:43`.
- Tested at `tests/engine.js:260` to `290`, including that a rerun moves lines
  and not unique, and that the gift is spent by new ground only.

**The one place it is called.** `ui/release.js:50` to `52` builds one key per
channel per queued address and calls `meterRun`. `ui/record.js:49` calls
`meterRead`. That is the entire surface. Two call sites.

**The discipline already in the code, and it is the answer to the brief.**
`meterRead` computes `cleared`, the ratio of ground opened to the person's own
horizon, at `engine/schema.js:264`. **Nothing renders it.** `ui/record.js:80`
to `85` prints the count, then prints the horizon as a separate sentence with a
plus or minus, and never divides one by the other. The engine knows the
percentage and the product refuses to say it. That is the existing resolution of
the tension in the brief, it was arrived at before this research, and the
recommendation below is to extend it rather than replace it.

**The refusal of causation.** `ui/record.js:11` to `16` states why: charge
deltas move with how a person worded a story, so a fall in charge is not
evidence of anything, while ground opened is evidence because a line was either
spoken at an address or it was not. `ui/record.js:104` to `107` closes every
comparison with the sentence that what moved them is not in this record.

**Snapshots.** `snapshot(p)` at `engine/schema.js:75` to `81` writes
`{t, cq, dq, sq, pole, jq, rad, loaded, sab, cx, hy, ch, dark, tier, arch}`.
`pSnap` at `107`. Written on every story commit and every release
(`ui/release.js:55`). History is validated field by field at
`engine/schema.js:206` to `216`. `ui/record.js:66` to `73` already renders one
bar per snapshot as a selectable strip, which is the component a day ledger
would reuse rather than invent.

**The reading that is not a score, and must not become one.**
`engine/compute.js:137` to `138` derives seven named coherence bands from CQ,
from collapsed up to mastery. This is the tempting thing to turn into levels and
it is the one thing that must not be, because it moves in both directions. A
person whose distress rose would read as demoted.

**The honest progress number nobody is using.** `accuracy(r,prof)` at
`engine/compute.js:176` to `199` returns a percentage and an interval built from
law coverage out of 21, signal saturating in held and installed addresses,
expression fill, and a penalty for degenerate family pairs. It rises as the
person does the work of telling the instrument about themselves, and it does not
fall when their state gets worse. It is already the product's answer to explain
your reasoning, per the UX skill. It is the only monotone increasing quantity in
the engine other than the meter.

**Installed, as a fact distinct from opened.** `engine/compute.js:54` computes
`n.rep`, the coherent opposite installed at an address, and
`engine/compute.js:57` computes `n.pole`. `poleMean` at `engine/compute.js:117`.
Rendered as opposite installed at `ui/record.js:92`. So the engine can already
distinguish emptied from filled, which is two facts where a badge system would
have had one.

**The ritual log, written and never read.** `CURP.rituals` declared at
`engine/schema.js:40`, pushed at `ui/ritual.js:69` to `74` with a timestamp, a
track, a band, a step list and a duration. `DECISIONS.md` states plainly that
the overlay logs a practice and nothing reads the log back, and that the
accountability tracker does not exist. This is where the if then plan goes.

**What does not exist, and is worth knowing before anything is promised.**
There is no per day record anywhere in the schema. `meter.first` and
`meter.last` are the only timestamps on the meter, and history timestamps are
per event, not per day. **A consecutive day streak is not computable from what
the product stores.** Building one requires a new structure in the schema, which
means the safest option is also the cheapest one, and the risky option is the
one that costs a schema change and a migration. Also absent: the word streak,
the word badge and the token XP appear nowhere in `atuned_src/`. Nothing has to
be undone.

**One internal precedent that should be quoted in any decision.**
`MILESTONES.md` records that an attention capture app was named as the model for
the hook, that this repo's UX skill commits to intrinsic motivation and no dark
patterns, and that if the fork goes to accounts those mechanics want designing
from that floor and not from the cited model. This document is that design.

---

## 5. The tension, stated so it can be resolved rather than dodged

The brief says the product refuses to print a count against a total because a
reading is not a score, refuses to claim causation, and speaks mechanically. A
conventional achievement system is made of exactly the three forbidden things:
a count against a total, an implied claim that the count caused the improvement,
and celebratory copy.

The resolution is a distinction the code already makes and the vocabulary does
not yet.

**A reading is about the person. A ledger is about the work.** A reading is an
inference, it moves with wording, it can fall, and scoring it is the thing this
product refuses. A ledger is a record of events that happened. A line was
spoken at an address or it was not. That is not an opinion about anybody, it
cannot be revised downward by a bad week, and printing it claims nothing.

Three consequences, and they resolve the apparent contradictions.

1. **The ledger may be counted. The reading may not.** Ground opened, lines
   spoken, addresses installed, seats entered, snapshots on file. All countable,
   none of them a score. CQ, DQ, SQ, the coherence band. None of them
   countable toward anything, ever.

2. **A count against a total is forbidden. A budget is not a count against a
   total.** `giftLeft` at `engine/schema.js:259` already prints 100 minus
   ground opened, and it is not a violation, because it measures what the
   product owes the person rather than what the person has achieved. The test
   to apply to any new number: if it went up, would it be praise. If yes, do
   not print it.

3. **A fact with a date replaces a badge.** `meterRun` already returns `added`,
   so the engine knows when ground is new. A first time is a dated fact, it is
   true forever, it cannot be lost, and stating it claims no causation. This is
   the achievement primitive that survives all three rulings.

---

## 6. The recommended ladder

Six pieces. Five of them read data the profile already holds. The build order is
the order given, and each one is shippable alone.

### One. Surface the ledger beyond the record. No new data.

`meterRead` is called in exactly one place. Put ground opened where a person
sees it in the course of using the instrument, in the same words already used at
`ui/record.js:80` to `85`, with no total beside it and no praise attached.

Copy pattern, mechanical, and it is the register the whole ladder is written in:

> Ground opened, all time. 218 addresses and channels opened at least once,
> from 604 lines spoken.

One sentence, two facts, no adjective. Per Harkin, making the record visible is
the mechanism with the best evidence in this entire document, and it costs a
render.

### Two. The gift and then the allowance, framed as what is available.

Already ruled and already built. `giftLeft` and `inGift` exist. The rules:

- Print what is available, never what has been used up. Ninety four of the gift
  left, not six spent.
- One statement when it runs low. No countdown, no escalation, no colour change
  to red. The MyFitnessPal finding is that a budget plus a colour that means
  failure is how a budget becomes a weapon.
- The wall's copy carries the free rerun, because the code already guarantees
  it. Ten new a week, and anything already opened runs again as often as wanted
  at no cost. Without that sentence the limit reads as a refusal.
- Referral credit is patterns, per the ruling, and never status. No ambassador
  rank, no referral count shown to anyone else, and the share message never
  contains a reading.

### Three. The markers as a ruler, not as trophies.

`MARKERS` already returns `{nm, at, reached, left}` for each. Render the two
fixed counts as distances on a ruler, in the same voice as the horizon sentence
that already ships. Four rules, and they are what keep this from being a badge:

- **Never gate anything behind a marker.** The moment a marker unlocks a
  feature it becomes a purchase, and money buys ground opened.
- Print the count, never a claim about the person who reached it. Two thousand
  five hundred addresses and channels opened is the fact. What that makes
  somebody is not the app's to say, and given the names involved this is not a
  stylistic point.
- No graphic that reads as a trophy. Icons are ring, not fill, already.
- Keep `cleared` unrendered. The engine may know the percentage of a person's
  own horizon. The product does not say it. This is the existing discipline and
  it is the right one.

Also recommend surfacing the density swipe from `DECISIONS.md` before the
markers, not after. A marker that can be reached by sweeping addresses with no
felt density is a marker that measures spending.

### Four. Firsts. The badge replacement, and the core of the recommendation.

A first is a dated fact about ground. It cannot be lost, it claims no
causation, and every one of them is derivable from data the profile already
holds. `meterRun` returns `added`, so the engine already detects the moment.

A finite set, roughly twenty one facts, and finite is load bearing. An endless
ladder is a treadmill and a treadmill is the thing the harms section is about.

- The first line spoken. Already stored as `meter.first`.
- The first time each of the nine axes has a line spoken at it. Nine facts,
  derivable from the address behind each key.
- The first time each of the seven seats has a line land in it. Seven facts.
- The first opposite installed at an address. Readable from `n.pole` crossing
  the threshold, or from `poleMean` moving off zero in history.
- The first seat emptied, meaning every address in a band below the load
  threshold.
- The first sweep, meaning every channel run at one address in one pass.
- The first pair of snapshots with a distance between them, which is the moment
  the record becomes readable at all.

Render as a list of facts with dates, in one surface, in the register already
established:

> 14 Mar. First line spoken.
> 2 Apr. First opposite installed, at the heart.
> 19 Apr. The throat entered.

No points, no rarity, no progress bar toward the ones not yet true. Those not
yet true are simply absent from the list rather than shown as empty slots,
because an empty slot is a demand. This is the one place I would accept the word
first as celebratory, because it is a description of sequence and not of merit.

Against the Deci finding: these are unannounced and delivered after the fact.
They are not promised in advance, so they are not an expected contingent reward,
which is the contingency class the undermining attaches to.

### Five. Cadence instead of a streak, and only if a day ledger is ruled in.

If some sense of rhythm is wanted, and the owner's sticky is a fair thing to
want, the safe form is a fixed window of days with marks on the ones where
ground was opened, and no consecutive count anywhere.

- A strip of the last thirty days, one mark per day where ground was opened.
  `ui/record.js:66` to `73` already renders exactly this shape for snapshots.
  Port it.
- **No number.** Not a consecutive count, not a best ever, not fourteen of
  thirty. Fourteen of thirty is a count against a total and it is a score. The
  marks are the fact.
- No reset event, because there is nothing to reset. One missed day moves a
  window by one. Lally is the authority for that being the truth of the
  behaviour.
- A gap renders as an unmarked day and is never named in copy.

This requires a new structure, an array of dates on the profile, plus a schema
bump and a migration, which is the only item in this recommendation that costs
one. That is a fair reason to defer it and it is deliberately last of the five
data items. If it is deferred, nothing else here is blocked.

### Six. The if then plan on the ritual. Build this first if only one thing gets built.

Highest evidence of anything in this document, d = 0.65, and the code is
already three quarters there. `ui/ritual.js:69` to `74` already saves a ritual
record. Add a when and a where to it, in the person's own words, and print the
plan back on the next open.

> When the chest tightens in the evening, I will run box breathing at the desk.

That is the whole feature. Per Gollwitzer, the contingent if then format is what
carries the effect, and a plan rehearsed at least once does better, so printing
it back is not decoration. It also closes the thing `DECISIONS.md` already names
as missing, that nothing reads the practice log back, and it is the honest
version of the accountability tracker: the app holds the person to their own
sentence rather than to the app's counter.

### What this ladder is made of, in one line

A budget the product owes you, a count of ground that cannot go down, two fixed
distances on a ruler, a list of firsts with dates, optionally a strip of days
with no number on it, and your own sentence read back to you. No points, no
levels, no streak, no comparison to anybody, and nothing that can be taken away.

---

## 7. What I recommend not building, and why

**Consecutive day streaks with a reset.** Argued at length. Not computable from
the current schema anyway, so declining costs nothing and building it costs a
migration. The crisis case is decisive on its own.

**Streak freezes, repairs or earn back windows.** These are the mitigations
Duolingo built because the bare mechanic was too sharp. Do not ship the wound
in order to ship the dressing. A freeze also names the absence, which rule 3 of
the crisis design forbids.

**A points currency separate from patterns.** Patterns are already the currency,
they are already priced, and the UX skill's first rule is one word per concept.
A second currency is a second word for the same idea and it doubles the
gameable surface.

**Levels or XP layered on CQ.** `engine/compute.js:137` to `138` already yields
seven named bands and they move in both directions. Turning a reading into a
level makes a person whose distress rose read as demoted by the instrument that
was supposed to help. Never gate a feature on CQ for the same reason.

**Any achievement tied to a reading falling.** A badge for coherence up ten
points asserts the causation `ui/record.js:11` to `16` was written to refuse,
and the record is right: charge moves with how a story was worded. This is also
the piece most likely to become a regulatory problem, per the 44.9 percent non
compliance finding.

**Leaderboards, social comparison and any view of another person's progress.**
The data is somatic and psychological self report. Fitbit killed its version for
being both costly and lightly used, and the SDT literature says competitive
metrics generate anxiety and damage competence in health settings. The
practitioner grant in `DECISIONS.md` is a consented one to one relationship and
is not a precedent for a feed.

**Variable reward of any kind. Chests, random drops, surprise unlocks.** Its own
advocates describe it as borrowed from gambling, the regulatory literature is
circling it, and it is flatly incompatible with a mechanical and precise voice.
An instrument does not surprise you.

**Loss framed incentives, including anything that puts the gift at risk.** Patel
2016 says this is the most effective frame available, 0.45 against 0.30, which
is exactly why it is disqualified. The people it works hardest on are the people
this product is for.

**Notifications that reference an absence.** Push is in scope. The reported harm
is specific and repeated: a notification saying a session was missed made
anxiety worse. A notification may name the practice. It may never name the gap.

**Printing `cleared`, or any count against the horizon estimate.** The estimate
carries a ten percent swing by design and no birth date gives no estimate at
all. A percentage of your own life's patterns cleared is the purest form of the
thing the product refuses, and the code already declines to render it.

**Markers as gates.** Stated above and worth repeating as a decision in its own
right, because it is the one that will be proposed as an obvious paywall win.
Ground opened is what money buys. A marker that unlocks a feature is a marker
for sale.

**A completion percentage for the intake, the axes or the 112 addresses.**
Recognition over recall is already the rule and `accuracy()` already exists as
the honest version: it reports how much the instrument knows, with an interval,
and the UX skill explicitly forbids weakening that to look confident. If a
progress surface is wanted for onboarding, use accuracy and its interval. It
rises with work done, it never falls when a person's state worsens, and it is
already built.

---

## 8. What is open, and whose call

- **Whether a day ledger is added at all**, which is the only item here needing
  a schema bump. Recommendation is that cadence is optional and everything else
  ships without it.
- **Whether the markers are surfaced before the density swipe exists.**
  Recommendation is no, because without density the markers measure spending.
- **The count of markers.** `DECISIONS.md` records that the owner said there
  are more than the two. The render should be a ruler that takes any number of
  fixed points, so the list can grow without a redesign.
- **What a marker is allowed to say.** Buddha nature and Christ consciousness
  are not neutral labels. The recommendation is that the app prints the count
  and the name and nothing else, and makes no statement about the person who
  reached it. This is a voice ruling and it is the owner's.
- **Whether patterns earned by referral are distinguishable from patterns
  bought.** If they are not, a person can be gifted toward a marker by their
  friends. Probably harmless, worth a decision rather than an accident.

---

## Sources

- [Harkin et al. 2016, does monitoring goal progress promote goal attainment, PubMed](https://pubmed.ncbi.nlm.nih.gov/26479070/)
- [Gollwitzer, implementation intentions and goal achievement](https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf)
- [Lally et al. 2010, how are habits formed](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674)
- [University of Surrey, Dr Pippa Lally on the 66 day figure](https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally)
- [Nunes and Dreze 2006, the endowed progress effect, SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=991962)
- [Kivetz, Urminsky and Zheng, the goal gradient hypothesis resurrected](https://www.columbia.edu/~rk566/Session4/Goal-Gradient_Illusionary_Goal_Progress.pdf)
- [Patel et al. 2016, framing financial incentives to increase physical activity, Annals of Internal Medicine](https://www.acpjournals.org/doi/10.7326/m15-1635)
- [Deci, Koestner and Ryan 1999, meta analysis of extrinsic rewards on intrinsic motivation](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)
- [Deci, Koestner and Ryan 2001, extrinsic rewards and intrinsic motivation reconsidered](https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf)
- [Rutledge, Walsh et al. 2018, gamification in action, self determination theory](https://selfdeterminationtheory.org/wp-content/uploads/2020/10/2018_RutledgeWalshEtAl_Gamification.pdf)
- [eClinicalMedicine 2024, digital health apps with or without gamification, systematic review and meta analysis](https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(24)00377-8/fulltext)
- [Gamification for health promotion, systematic review of behaviour change techniques in smartphone apps](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5073629/)
- [PLOS One 2014, effectiveness of financial incentives for health behaviour change](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0090347)
- [Reduction of financial health incentives and changes in physical activity](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10632955/)
- [JMIR Mental Health 2019, gamification in apps and technologies for improving mental health and wellbeing, systematic review](https://mental.jmir.org/2019/6/e13717/)
- [Scientific Reports 2024, the regulatory status of health apps that employ gamification](https://www.nature.com/articles/s41598-024-71808-2)
- [eQuoo randomised controlled trial](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10403802/)
- [Gamification to improve resilience and reduce attrition in mobile mental health interventions](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7467300/)
- [Health Psychology Review 2021, self compassion, physical health and health behaviour, meta analysis](https://www.tandfonline.com/doi/abs/10.1080/17437199.2019.1705872)
- [Compassion focused therapy on self criticism and self soothing, meta analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC10087030/)
- [Psychology Today, the abstinence violation effect](https://www.psychologytoday.com/us/blog/stigma-addiction-and-mental-health/202309/the-abstinence-violation-effect-and-overcoming-it)
- [ScienceDirect topic page, abstinence violation](https://www.sciencedirect.com/topics/psychology/abstinence-violation)
- [BJPsych Open, effects of diet and fitness apps on eating disorder behaviours, qualitative study](https://www.cambridge.org/core/journals/bjpsych-open/article/effects-of-diet-and-fitness-apps-on-eating-disorder-behaviours-qualitative-study/2D1EE739D97AB3EFC6573835E4C527BD)
- [Calorie counting and fitness tracking technology, associations with eating disorder symptomatology](https://pubmed.ncbi.nlm.nih.gov/28214452/)
- [Princeton Tortoise, MyFitnessPal's gamification of weight loss](https://tortoise.princeton.edu/2021/05/02/4043)
- [UX Magazine, the psychology of hot streak game design](https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame)
- [Bureau of Investigative Journalism, what Snapchat knew about addicted users](https://www.thebureauinvestigates.com/stories/2025-12-03/snapchat-ignored-staff-warnings-about-teens-mental-health)
- [Strategic EdTech, snap streaks and long term stress](https://www.strategicedtech.com/blog/could-snap-streaks-be-responsible-for-long-term-stress-and-anxiety-in-teens)
- [StriveCloud, Headspace gamification features](https://www.strivecloud.io/blog/headspace-gamification-features)
- [Duolingo help, what is a streak](https://www.duolingo.com/help/what-is-a-streak)
- [Duolingo Streak Society](https://duolingoguides.com/duolingo-streak-society/)
- [Yu kai Chou, streak design](https://yukaichou.com/gamification-study/master-the-art-of-streak-design-for-short-term-engagement-and-long-term-success/)
- [Macworld, how to pause Apple Watch activity rings](https://www.macworld.com/article/2446605/how-to-pause-apple-watch-activity-rings.html)
- [AppleInsider, how to pause activity rings in watchOS 11](https://appleinsider.com/inside/watchos-11/tips/how-to-pause-activity-rings-in-watchos-11-when-you-need-a-break)
- [Engadget, Fitbit removing open groups, adventures and challenges](https://www.engadget.com/fitbit-removing-open-groups-adventures-challenges-app-140024841.html)
- [9to5Google, Fitbit challenges and open groups no longer available](https://9to5google.com/2023/03/27/fitbit-challenges-groups-removed/)
- [Platformer, what Instagram really learned from hiding like counts](https://www.platformer.news/instagrams-big-likes-anticlimax/)
- [Variable ratio reinforcement beyond the Skinner box](https://medium.com/design-bootcamp/variable-ratio-reinforcement-beyond-the-skinner-box-191d3e86d86f)
- [Addictive design as an unfair commercial practice, hyper engaging dark patterns](https://www.researchgate.net/publication/379276332_Addictive_Design_as_an_Unfair_Commercial_Practice_The_Case_of_Hyper-Engaging_Dark_Patterns)
- [Fortune, Fitbit hack cheat](https://fortune.com/2016/06/10/fitbit-hack-cheat)
- [TestDevLab, beating step counter algorithms](https://www.testdevlab.com/blog/testing-fitness-apps-can-you-cheat-the-algorithm)
