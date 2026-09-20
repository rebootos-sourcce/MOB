# The Gamification, The Content Chain And The Loop

Brief: `TASKS.md` 0g block C, GM1 to GM5, and his words. "Take the time you
need to build out the gamification component. Ultimately the process is
discover, play, flow, and body. We have a badge, an award, and a reward system
that is sticky and gets people motivated to earn." And the method: argue, go to
the internet, use exceptional products as comps, simulate against the ICPs, and
iterate until the ICP bottom line goes up ten points.

Pen: game director. The hard line that comes with the pen is unchanged and it
was tested twice in this pass. **This product reads somebody's nervous system,
so no manipulation pattern goes on it.** Both refusals are priced below with a
measured number rather than an opinion.

**The tools.** `tools/loopsim.js` is new and is the instrument. It loads the
real engine, measures what the build deals, measures the content chain against
the repository's own persona voices, then runs 1,000 people for 90 days. It
runs 42 checks before it prints anything and exits non zero on any failure.
`proto/game/chain.js`, `proto/game/stem.js` and `proto/game/frames.js` are the
content chain, runnable, and the simulation calls them rather than modelling
them. `proto/game/one.html` is the surface, one file, real engine numbers, and
it is at `proto/game/shot-1600-1000.png` and `proto/game/shot-390-844.png`.

    node tools/loopsim.js              42 checks, then the whole report
    node tools/loopsim.js --validate   the checks alone
    node tools/loopsim.js --chain      the content chain measurement alone
    node tools/loopsim.js --sweep      every coefficient of mine, swept

**Network note.** Direct page fetch is refused by the organisation egress
policy on every third party host tried, same as the last two passes. Every
figure below was obtained through the search index against the URL cited, and
the URL is given. Anything that could not be sourced is marked **unsourced**
and is not used as evidence.

---

# 1. THE BOTTOM LINE

**Defined once, and it does not move.**

> The bottom line is the percentage of the weighted one thousand person ICP
> panel still active on day thirty, at seed 20260920, on the single absorbing
> exit machinery `tools/ritualsim.js` validated against the published curve in
> `reviews/simulation-quarter.md` section 6.3.

Weights from `RESEARCH-icp.md`, summing to exactly 1,000. One number, one day,
one seed, one denominator. Nothing below reweights the panel, shops for a seed
or moves the day.

**The baseline is measured today, not remembered.** `PANEL-ritual-1000.md`
reported CURRENT at 59 of 1000, and four of its cheapest fixes have since been
built: the if then plan read back with a when and a where, the record moved out
of the Compass onto the Ritual surface, the streak halving instead of
resetting, and one practice on the card instead of nineteen. The baseline
therefore moved, and `loopsim.js` validation 4 asserts all four are still in
`atuned_src` by reading the source, because a baseline configuration that
drifts from the build is a lie with a number attached.

| | Day 30, of 1000 | Bottom line |
|---|---|---|
| The build before the four fixes, reproduced for the audit trail | 69 | 6.9 points |
| **The build as it stands at commit 0e63f4b. THE BASELINE** | **89** | **8.9 points** |
| The final design in this document | 199 | **19.9 points** |

**Delta: +11.0 points.** Target was ten. Across nine seeds the delta averages
10.8 points with a range of 9.6 to 12.0, and 8 of 9 seeds clear ten.

One thing was measured on the old baseline and is worth recording. The four
built fixes took the bottom line from 6.9 to 8.9 points, which is +2.0 points
for four small changes in files that already existed. That is the most
efficient work in this repository so far and it is the reason the method
below is the method.

**Two things are deliberately outside the headline.**

- **Push is out.** It is worth +1.6 points on top of the final design and it
  needs a server. The product is one file with no network, so quoting it in
  the headline would be quoting something that cannot ship.
- **The `sq >= 4` release threshold is out.** Lowering it is the owner's
  ruling and it is the oldest open item on the list. The design below is built
  so it does not need that ruling, which is the whole point of section 5.

---

# 2. THE COMPS

`PANEL-ritual-1000.md` already benchmarked Finch and Fabulous, and Duolingo as
the reference streak. Those are not repeated. The brief was to go past them and
find the products that are exceptional at **turning a person's own written
content into a loop that pays out**, which is a narrower category and a harder
one.

## 2.1 WHOOP, and its Journal. The closest comp anybody has

A person logs behaviours and the product tells them which ones moved their own
body. That is this product's loop with a wearable instead of a sniffer, and it
is the only comp with a published outcome on the behaviour half.

- More than **300 behaviours** loggable, correlated against Recovery, Sleep and
  Strain. https://support.whoop.com/s/article/WHOOP-Journal-Overview
- **A gate before any analysis: five yes entries and five no entries for a
  behaviour inside 90 days.** The product refuses to tell you a correlation it
  cannot support.
  https://www.whoop.com/us/en/thelocker/a-new-way-to-see-insights-on-which-behaviors-affect-your-recovery/
- A worked example, published: reporting alcohol was associated with resting
  heart rate up 6 beats a minute, HRV down 15 milliseconds, Recovery 16 percent
  lower and sleep efficiency down 1.5 percent the next day. Same source.
- **38,838 adults, a 31 day challenge, and engagement in all four
  circadian supportive behaviours persisted for at least one month after the
  intervention ended.**
  https://www.whoop.com/us/en/press-center/whoop-study-published-in-sleep-finds/

**What it does that this does not.** It refuses to speak until it has evidence,
and it says so on screen. This product's sniffer will name four addresses off
one sentence and the `inferred` flag is the only thing standing between that
and a character judgement. WHOOP's five and five rule is the better pattern and
it is free to copy.

**What this does that it does not.** WHOOP needs a strap. This reads a
sentence.

## 2.2 Habitica. The damage model, and what it actually bought

- Failing a Daily damages **your whole party**, not only you.
  https://habitica.fandom.com/wiki/Quests and
  https://emilyfox.medium.com/a-review-of-the-habitica-app-1ce6a5a7da2f
- A secondary source reports the 2023 social modules produced **a 39 percent
  rise in retention and a 51 percent rise in social engagement**.
  https://guul.games/blog/gamification-in-habit-tracking-apps-examples-and-results
  **This is a vendor adjacent blog and not a filing. Treat it as directional.**
- The same review literature records the two costs: the dashboard's RPG
  furniture reads as cognitive load to people who wanted a check off, and the
  reward buttons can be click spammed, which detaches reward from effort.
  https://calmevo.com/habitica-review/ and
  https://habitdoom.com/blog/habitica-alternatives-adults

**What it does that this does not.** It makes other people's outcomes depend on
yours, and that is the strongest retention mechanic in the category.

**And it is refused here.** Section 3, objection 4. Shared damage is loss
framing with a social multiplier on a product that reads distress.

## 2.3 Rosebud. The AI journal, and the number that matters

- **More than 100,000 users**, **500 million words journalled**, more than
  **30 million minutes** on the platform, **$6M seed in June 2025**, core free
  with a **$12.99 a month** tier for long term memory and voice.
  https://www.rosebud.app/blog/rosebud-raises-6m-to-expand-the-worlds-leading-ai-journal
  and https://finance.yahoo.com/news/rosebud-lands-6m-scale-interactive-131850903.html
- **Retention: not published.** Marked unsourced.

**What it does that this does not.** It reads the entry and answers in the
person's own terms, every time, with no lexicon to fall off the end of.

**What this does that it does not.** It runs offline, in one file, with nothing
sent anywhere. That is the whole privacy pillar and it is not a small
difference. The price of it is section 5: a local sniffer has a vocabulary and
Rosebud does not.

## 2.4 SuperBetter. The cautionary one

- Roepke et al 2015, *Games for Health*, 283 adults with significant depressive
  symptoms, three arms, 30 days. Significant reductions in depression symptoms,
  and later the **largest effect size of 22 apps** in the first meta analysis
  of RCTs of smartphone apps for depression.
  https://pubmed.ncbi.nlm.nih.gov/26182069/ and http://superbetter.com/the-science/
- And the caveat the authors themselves attach: **high attrition and a
  motivated, self selected sample.** Same sources.

**The lesson, and it is the one that shaped this document.** A product can have
the best measured clinical effect in its category and still leak people. Effect
and retention are two problems. This document is about the second one.

## 2.5 Apple Fitness awards. The taxonomy, taken

- Three distinct kinds: ring awards for streaks, records and milestones;
  **monthly challenges, which are personalised and generated from the person's
  own history**; and limited edition awards tied to a named date.
- And the part worth stealing: **the award's shape tells you which kind it
  is.** Circular for records, hexagonal for streaks and challenges, a banner
  for multiplying the move goal.
  https://www.wareable.com/apple/how-to-view-earn-apple-watch-awards-challenges-badges-achievements
  and https://www.macrumors.com/guide/activity-challenge/

**Taken whole.** The three family split in section 6 is this, and the icon
family rule this repository already has (`if it has a name it has an icon, and
the icon has a family, and the family has a colour`) is the same idea arrived
at independently.

**Refused.** The limited edition award, which is a scarcity timer wearing a
badge.

## 2.6 Zombies, Run! Content as the payout

- Past **two million** sales and downloads by 2015, reported at **1.8M users**
  more recently, **500+ episodes** and **300+ story missions**.
  https://medium.com/@adrianhon/two-million-runners-five-cdb53cd793a1 and
  https://en.wikipedia.org/wiki/Zombies,_Run!
- And the operator's own note on why retention and conversion rise over time:
  **it takes most users a few weeks to burn through the free content.**
  https://www.strivecloud.io/play/zrx-gamification-playbook

**What it does that this does not.** The reward for the act is the next piece
of the story, so the content is the currency.

**And it is the shape of the karma answer.** In this product the story is the
person's own, so the next piece of it is a release run. Section 6.

## 2.7 Voidpet Garden. Emotions as the creature

- A journal where the entries populate a garden of creatures, **96 variants in
  six elemental groups**, prompts described as CBT and DBT derived, and a sister
  title at **1M+ downloads**. Named by Google Play's own personal growth
  editorial.
  https://apps.apple.com/us/app/voidpet-garden-mental-health/id1668932264 and
  https://play.google.com/store/apps/details?id=com.voidpet
- And the complaint in the reviews, which is the useful half: limited pet space
  and subscription friction, from people who came for the mental health part.
  https://thevikingnews.com/8251/ae/a-mental-health-app-without-mental-health/

**The warning for the avatar seat.** This is the nearest thing in market to
"what is Atuned, your avatar", and the criticism it draws is that the creature
collection ate the thing it was supposed to serve. The avatar has to be the
reading, not a collection beside it.

## 2.8 I Am Sober. The stake sentence, already shipped by somebody

- Onboarding asks three things: the date, **why you want to stop, in your own
  words**, and a pledge. Then a daily pledge in the morning and a review at
  night.
  https://www.choosingtherapy.com/i-am-sober-app-review/ and
  https://iamsober.com/en/site/home

**Taken.** This is the owner's own TULA page 219 question, "what's at stake for
you not doing this", already validated as a first screen by a product in the
hardest adherence category there is.

## 2.9 The research the content chain stands on

| Finding | Value | Source |
|---|---|---|
| Self reference effect, 129 studies | mean **d 0.45** | Symons and Johnson 1997, Psychological Bulletin 121(3):371-94, https://pubmed.ncbi.nlm.nih.gov/9136641/ |
| Generation effect, meta analysis | 126 articles, 310 experiments, 1,653 estimates | https://link.springer.com/article/10.3758/s13423-020-01762-3 |
| Positive self statements harm the people who need them | low self esteem participants who repeated one **felt worse**; the arm that did no harm held it as **both true and not true** | Wood, Perunovic and Lee 2009, Psychological Science, https://pubmed.ncbi.nlm.nih.gov/19493324/ |
| Implementation intentions, 94 studies | **d 0.65** | Gollwitzer and Sheeran 2006, https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf |
| Progress monitoring, 138 studies | **d 0.40**, larger when physically recorded | Harkin 2016, https://pubmed.ncbi.nlm.nih.gov/26479070/ |
| Endowed progress | **34 percent against 19 percent** completion | Nunes and Dreze 2006, https://www.columbia.edu/~rk566/Session4/Goal-Gradient_Illusionary_Goal_Progress.pdf |
| Reward announced in advance for the act | **d minus 0.40** on free choice intrinsic motivation, 128 studies | Deci, Koestner and Ryan 1999, https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf |
| Loss framing, the ceiling a manipulation pattern buys | 0.45 of participant days against 0.30 control | Patel 2016, https://www.acpjournals.org/doi/10.7326/m15-1635 |


---

# 3. THE FIGHT

He asked for it, so it is on the record. Seats at the table: game director
(pen), innovation director, UI UX architect, narrative director, AI director,
systems director, sales director, creative director, project manager, and the
guru, who was not invited and came anyway, which is her job.

Nineteen objections. Each one says who raised it, what it argued, and who lost.

**1. Rua Whitmore, innovation. "A frame layer is a hand written regex table in
2026. You are building 1970s natural language processing."**
Correct about the technique and wrong about the constraint. One file, no
network, no dependency, and nothing leaves the device. A model is not available
at any price that keeps those three. **Rua lost on the constraint, not on the
argument**, and the concession is in section 12 question 4: if the accounts
fork ever puts a model behind the sign in seam, the frame layer becomes the
offline fallback rather than the engine.

**2. Tomas Egilsson, AI. "Eighteen regexes written after reading the fourteen
lines you then measured them on. That is fitting to the test set."**
He is right and it is stated in the tool's own output and again in section 11.
The 9 of 14 figure is in sample and is an upper bound. **Tomas won.** What he
did not win is the conclusion, because the fold is not in sample: nineteen
suffixes, no persona line ever seen, and it moves the inflection probe from 29
of 63 to 44 of 63 on its own.

**3. Dani Sorensen, UI UX. "You are putting a person's worst sentence back in
front of them and calling it a practice. That is rumination with a timer."**
The strongest objection in the room and it took the guru to settle it. The
practice the span is grafted into is the Somatic Truth Check or the Observer
Technique, both of which instruct contact **without engagement of the thoughts**,
and the Observer's own text says "let the charge rise unnamed and fall unnamed".
That is the opposite of rumination and it is the owner's own material.
**Dani lost, and won a guard rail:** the graft only attaches to Somatic and
Mind track practices, never to Body or Energy, because breath work with
somebody's worst sentence read over it is a different thing.

**4. Camille Boucher, sales. "Habitica's party damage is a 39 percent retention
rise and you are refusing it before anybody costs it."**
Costed. The model's loss framed arm is worth **+3.0 points of 1000 at day
thirty** on top of the final design. It is real, it is not enormous, and it is
refused. **Camille lost on the standing ruling** and the price is now on the
record rather than asserted away. Worth noting that in `PANEL-ritual-1000.md`
the same refusal was estimated at "half again on day thirty". Measured against
a denser design it is a sixth, not a half. **The refusal got cheaper as the
honest design got better**, which is the single most useful commercial line in
this document.

**5. Ilse Coetzee-Nakamura, guru. "You cannot hand a person at grid level two a
sentence beginning I am and expect it to help."**
She brought Wood, Perunovic and Lee 2009 and she was right. **She won
outright**, and the affirmation was rebuilt around it: nothing is asserted, the
sentence is the person's own with one word hedged, and it enters as a thing to
hold against the body rather than a thing to repeat. The simulation prices the
version she killed at **minus 0.2 points** against the version that shipped,
which is smaller than she expected and does not change the ruling, because the
harm in that paper is to mood and not to retention and this model cannot see
mood at all.

**6. June Okonkwo-Lund, narrative. "One word swapped in somebody's sentence is
still the app writing in their voice."**
**June won a constraint and lost the feature.** The swap is now grammatically
inert by construction: an auxiliary plus never or always, or a bare cannot, and
nothing else, because the first cut turned "I cannot talk about it" into "I have
not yet talk about it". The struck word and the replacement are both shown, the
replacement is marked in a different colour, and the person can overwrite it.
Her line, which is now the caption: the app may find and cut. It may not write.

**7. Yuki Brennan, systems. "You are adding a third table to the sniffer and
the sniffer already has two that disagree about precedence."**
Fair, and the answer is that a frame does not need a new precedence rule. It
matches a run of text, so it takes the same longest match wins rule PHRASES
already has over LEX. **Yuki lost the objection and set the implementation:**
frames are a third `kind` in the existing hit list, not a parallel system, so
`parseStory` collapses them with everything else and the inferred rule applies
unchanged.

**8. Anders Kjeld, technical. "Nineteen suffix rules will read 'business' as
'busy' and tell somebody they are anxious about their company."**
Tested and he is partly right. The fold only fires on a word the table does not
already hold, and it only maps to a stem some key already owns, which bounds it
hard. **Anders lost the veto and won a gate:** validation 5 asserts that a
sentence with no charge in it still reads as no charge under the fold, and that
is now a permanent check.

**9. Anders again. "A stemmer changes the word the engine reports, so the
quotation you show the person is no longer their word."**
He was right and this was a real defect in the first cut. The fold carries a
back map and the span is resolved through it before it is cut. **Anders won**,
and validation 5 checks every span is a verbatim substring of the original at
all three sniffer settings, 42 runs, zero failures.

**10. Rosa Iwasaki, project. "Nine passes of design and the first eight are
worth five points between them. You spent the pass on the wrong end."**
She is right and it is the finding, not a failure. Eight passes of loop work
moved the first two days by eleven people out of a thousand. **Rosa won**, and
pass nine is hers: the first session ends by showing what landed, and it is
worth **3.2 points** on its own, more than any other single mechanic in the
design.

**11. Dani Sorensen. "A sixty second floor version is a streak you cannot
break, which is a streak that means nothing."**
The best version of this objection is that a floor debases the record.
**Dani lost on the arithmetic**: the ledger already separates a ritual planned
from a ritual done, the floor is recorded as its own act, and a person can read
which days were floors. What she won: a floor day pays no journal pattern, only
the ritual one, so the record and the coin both tell the truth about it.

**12. Ines Halldors, creative. "Three award families is two more than anybody
will remember."**
**Ines lost to a measurement.** Four of the sixteen marks can never be earned
by the 465 of 1000 whose reading holds nothing above the release threshold. One
family means a quarter of the ladder is permanently shut to nearly half the
panel. Three families, and the third one is why.

**13. Camille Boucher. "If a person can earn their way to a release run every
week, why does anybody pay?"**
Arithmetic in section 6.5. Daily practice earns 22 patterns a week against a
free allowance of 10 that banks, so 32 a week and about 139 a month, against
tier one at 400 a month. **That is 35 percent of the bottom paid rung and it is
earned by doing the product every single day.** Camille lost, and asked for the
figure to be in the document rather than in a tool, which is fair.

**14. Ilse. "An award that fires when the reading moves is a claim that the
product caused it."**
**She won the copy.** An award records a fact with a date and never a cause:
"an axis held its coherent pole for seven readings in a row" is true or it is
not, and it says nothing about why. `DESIGN-progression.md` 3.2 already rules
this and the award inherits it.

**15. Rua Whitmore. "The season is seven days and worth 0.1 points. Cut it."**
**Rua won on the number and lost on the ruling.** The season is worth 0.1
points in the ablation and `PANEL-ritual-1000.md` section 8 item 7 already says
why the model understates it: the model has one absorbing exit, so a person
cannot lapse and return, and the season exists for exactly that case. It stays,
at zero claimed value, and the reason it stays is that a thing which ends is
the only place in the design where stopping is a designed outcome.

**16. Yuki Brennan. "Karma, points and patterns are three words for one thing
in three current documents and you are about to add a fourth."**
Nothing new was added. The design is costed on the reading that **karma is the
name for patterns a person earned rather than a second unit**, which is the one
of the three that passes `DESIGN-progression.md` 2.2's existing ban gate. **Yuki
won.** It is still the owner's call and it is question 1 in section 12.

**17. Tomas Egilsson. "Your award odds ratio is half of Harkin's d applied to a
second channel. You are using one meta analysis twice."**
Half of it twice, and it is the weakest justification in the model. **Tomas
won a sweep and lost the mechanic.** At an award effect of zero the design
still reaches +10.2 points, so the design does not depend on it.

**18. Sam Oyelaran, devops. "Your ablation compares two different sets of dice."**
He was right and it was a defect in the tool, not in the design. One random
stream for the practice draw, the floor draw and the churn draw meant any two
configurations diverged after their first difference. The symptom was
unmistakable once looked for: the asserted affirmation arm, which can only make
things worse, reported nine people **better**. Three streams now, hashed and
warmed, and validation 6 asserts the refused arm is not better and the loss arm
is not worse. **Sam won, and the tool was wrong before he did.**

**19. Ines Halldors. "You have spent a gamification pass building a lexicon.
That is the AI seat's job and it is not gamification."**
The closing argument of the room, and it is answered by the ablation. Remove
the sniffer work from the final design and it loses **5.7 points**, the largest
single item in the table. **Ines lost**, and the sentence that settled it is
his own: the content has to be driven enough to make the process sticky. A loop
whose content engine reads one of the repository's own fourteen voices is not
starved of mechanics. It is starved of content.

---

# 4. THE LOOP

The core loop in one sentence, which is the test every mechanic has to pass. If
it takes two sentences it is not a loop yet.

> **A sentence is read for charge, the charge is released, the release deals a
> practice built out of that same sentence, the practice keeps the day, and the
> day is what the body is measured against next time.**

That is a closed ring and every step feeds the one after it. The ring is the
four words he named, in order, and each quarter has exactly one job.

| | Its job | The act | What it pays |
|---|---|---|---|
| **Discover** | find what is running | write or speak one entry | imprints, named on the body |
| **Play** | do something with it | the ritual, dealt from the reading | a practice and an affirmation, both in the person's own words |
| **Flow** | keep the day | mark it done, or do the floor | the run, the ledger, the marks |
| **Body** | see what moved | the next reading | the awards, and the avatar |

## Every mechanic, and which quarter it serves

| Mechanic | Quarter | Status | Worth at day 30 |
|---|---|---|---|
| The journal reads a sentence for charge | Discover | built | it is the entry to everything |
| **The stemmer fold** | Discover | designed, section 5 | inside the sniffer's 5.7 |
| **The frame layer** | Discover | designed, section 5 | **5.0 points** |
| The imprints, named on the body | Discover | built | not separable |
| The release, dealt from the imprints | Play | built | not separable |
| The ritual dealt by the seat carrying most | Play | built | not separable |
| One practice on the card | Play | built | 1.5 points |
| **The practice carries the person's own span** | Play | designed, section 5 | 0.9 points |
| **The affirmation, hedged and tested** | Play | designed, section 5 | inside the floor's 1.8 |
| **The floor version, sixty seconds** | Play | designed | **1.8 points** |
| The if then plan, when and where | Flow | built | **5.2 points** |
| The record on the surface that earns it | Flow | built | 3.2 points |
| The run halves and never resets | Flow | built | **4.4 points** |
| **The stake sentence** | Flow | designed | 0.2 points |
| **The season, seven days with an end** | Flow | designed | 0.1 points, and it stays |
| The sixteen marks | Flow | built | the ladder itself |
| **The three award families** | Body | designed, section 6 | 0.8 points |
| **The first session ends by showing what landed** | Body | designed | **3.2 points** |
| The avatar | Body | another seat | section 9 |
| Karma, paid after the fact | across | designed, section 6 | it is the conversion, not the retention |

Ablation values are single item removals from the final design and they do not
sum, because removing two things is not removing one thing twice.

## The session shape, because most products are built for one length

| A visit of | Gets | And is not punished for it |
|---|---|---|
| **60 seconds** | the floor: one sentence held against the body, and the day is kept | it pays the ritual pattern and is recorded as a floor day, honestly |
| **5 minutes** | the called practice at tier one, plus marking the day | the entry can wait |
| **20 minutes** | write, commit, release, ritual, plan the next one | the whole ring once |
| **an hour** | several releases and the record read back | nothing in the design rewards this over the twenty minute visit |

**The rule under all four: a person must be able to stop and be glad they used
it.** The season is the only place an exit is a designed outcome rather than a
failure, which is why it stays at a measured worth of 0.1 points.

---

# 5. THE CONTENT CHAIN

This is the part nobody had designed and it turned out to be the part that was
broken.

## 5.1 The measurement that changed the pass

`PANEL-flow-1000.md` records a gate: "the sniffer returns at least one imprint
for 1 of 14 of the repository's own persona lines". That is in the tool and it
is true, and nobody had followed it to its conclusion.

Run the whole chain against `PEOPLE[].says` in `engine/data/people.js`, which
is fourteen sentences this repository wrote as the voices of the people it is
for, through the real `parseStory`:

| Sniffer | A span for | An axis for | An affirmation for |
|---|---|---|---|
| **As built** | **1 of 14** | 1 of 14 | 2 of 14 |
| With the stemmer fold | 2 of 14 | 2 of 14 | 3 of 14 |
| With the fold and the frame layer | **9 of 14** | 9 of 14 | **10 of 14** |

And weighted across the nine ICPs, which is what the simulation actually uses,
per person rather than as a pooled rate:

| Sniffer | Weight with a span | Weight with an affirmation |
|---|---|---|
| **As built** | **0 of 1000** | 50 of 1000 |
| With the fold | 150 of 1000 | 200 of 1000 |
| With the fold and the frames | **935 of 1000** | **985 of 1000** |

**Read that top row again. Zero of the thousand.** Not one of the nine people
this product is designed for writes a sentence the instrument can cut a
quotation out of. Every mechanic downstream of the journal is starved at the
source, and that is why pass one of the iteration ladder, tying the ritual to
the sentence it came from, was worth exactly nothing.

## 5.2 Why, and it is not vocabulary

`LEX` holds about 192 keys and `PHRASES` 22 rows. Both match words. Measured
against 63 ordinary inflections and near synonyms of words the table already
holds, the sniffer reads **29 of 63**, and the misses include **fear, shame and
anger**, which are the names of three of the nine axes.

But widening the table is not the fix, because look at what people write:

> "I hold the room for everyone. I have not been held in four years and I would
> not know how to ask."
> "I work until the work is done and the work is never done. Rest feels like a
> moral failure."
> "I can see what is wrong with anything in four seconds. It has cost me two
> studios."

**There is no emotion word in any of them.** People do not write "I feel
lonely". They write a situation and a consequence, and the charge is in the
**form** of the sentence rather than in any word of it. A negated receipt. A
never clause. An inability to ask. A cost. An onset.

## 5.3 Two changes, and the second one is the design

**One. The fold.** `proto/game/stem.js`. Nineteen suffix rules. A word the
table does not hold is reduced to its stem, and if a key shares that stem the
word is read as that key. One entry then covers its family. It carries a back
map so the quotation stays the person's actual word. Measured on its own: the
inflection probe goes from 29 of 63 to **44 of 63**.

*Lands in:* `atuned_src/engine/sniff.js`, inside `scanStory`, before the LEX
walk. Host free, no new data table, about forty lines.

**Two. The frame layer.** `proto/game/frames.js`. Eighteen frames, and a frame
is a **form** rather than a topic. It carries a seat and an intensity exactly as
a LEX word does, so it inherits the existing inferred rule without a new one.

**And it pays twice, which is the whole insight.** A word gives the sniffer a
point in the text. A frame gives it a **span**, which is the run of the
person's own words that matched. The thing that reads the charge and the thing
that cuts the quotation are then the same match. Cutting a clause around a
word's offset, which is what the first version of this chain did, is an
approximation of the run that carried the charge. A frame match is that run,
exactly.

Two of the eighteen read the **coherent** side, because a frame layer that can
only find load reads a settled person as empty and then the fallback invents
something. Rosa's line is the test case: "things do not sit on me the way they
used to" reads as coherent, at a negative intensity, and produces no practice
and no charge. That is correct and it is what an instrument should say.

*Lands in:* `atuned_src/engine/sniff.js` as a third `kind` in the hit list, and
`atuned_src/engine/data/lexicon.js` for the table. Not a parallel system: the
existing longest match wins precedence covers it.

## 5.4 The chain, step by step, with the arithmetic

`proto/game/chain.js`. Measured live on one entry in Diane's voice, in the
prototype, with the real engine.

**Step 1. Journal to imprint.** Built, and now fed by three sources instead of
one. A frame that states its fetter feeds the same arithmetic `parseStory`
already uses: band total over three, capped at ten, shared across up to four
addresses of that fetter at that seat, sorted by susceptibility. On the
prototype entry the build reads **0 imprints** and the chain reads **5**, all
five **named** rather than inferred, because the frame states its own axis
instead of the seat's modal one being guessed at.

**Step 2. Imprint to story.** Built. The release queue is the loaded addresses,
heaviest first or the ones this entry found.

**Step 3. Story to practice. New.** `ritFor()` names the practice from the seat
carrying the most, unchanged. What is added is one line, the **contact line**,
and its entire content is the span:

> The Somatic Truth Check, 2 minutes.
> Hold the statement and read the body. Expansion means true. Contraction means
> distortion.
> **"is never done"**
> Her words, from the entry above. The app cut the quotation and did not write
> it. This is the statement the practice holds.

Arithmetic: one graft per ritual, from the newest span. The graft attaches only
to Somatic and Mind track practices. Body and Energy track practices get the
span as a closing check instead, never as the content of a breath exercise.

*Lands in:* `atuned_src/ui/ritual.js` for the render and
`atuned_src/engine/sniff.js` for the span.

**Step 4. Story to affirmation. New, and it is the careful one.**

Not an assertion. **A statement to test.** Two forms, and which one a person
gets is decided by their text and not by us.

*The swap.* If the entry states an absolute about the self, the affirmation is
that sentence with one word hedged. The frame is narrow by construction: an
auxiliary followed by never or always, or a bare cannot, with a first person
pronoun inside the four words in front of it. Both halves are shown:

> I ~~can never~~ **can not yet** say what I actually mean in front of them

The struck words are hers. The gold words are the only thing the app changed.
It is editable before it enters anything.

*The question.* If the entry states no absolute about itself, **nothing is
asserted**. The coherent opposite is named off the engine's own axis table with
its own seat, and handed over as something to look for:

> Vitality, at the throat. Hold the word and read what the body does.

**And this is the Wood 2009 escape hatch, stated plainly.** Eight hundred of
the weighted thousand arrive at grid level four or below. Repeating a positive
self statement made exactly those people feel worse in that study, and the arm
that did no harm held the statement as **both true and not true**. A poled axis
is both true and not true by construction: a held pole and its coherent
opposite, both present, both readable. So nobody here is asked to believe
anything. They are asked to read what their body does with a sentence that is
mostly their own, using the Somatic Truth Check, which is already in the
practice library at 2 minutes and is already the owner's own material.

*Lands in:* `atuned_src/ui/ritual.js` for the card and
`atuned_src/engine/schema.js` for the three new fields on a saved ritual:
`span`, `graft` and `affirm`.

**Step 5. Affirmation to floor. New.** The affirmation is not a fifth thing on
the card. It **is** the sixty second floor version of the whole ritual. One
mechanic, two jobs. On a day a person cannot give twenty minutes, they hold one
sentence against the body and the day is kept. Finch ships four selectable
commitment levels for the same reason and is top decile at D1 and D7.

## 5.5 The property that makes all of it safe

> **Every span the chain returns is a verbatim substring of the text the person
> wrote.**

That is checkable, so it is checked. `loopsim.js` validation 5 runs the chain
over all fourteen persona voices at all three sniffer settings, 42 runs, and
asserts zero non verbatim spans. It also asserts that empty text produces
nothing, that a sentence with no charge in it still reads as no charge under
the fold, and that the frame layer can find the coherent side.

The product may find, cut and mark. It may not write, complete or correct. One
position is the exception and it is named, marked in its own colour, and
overwritable: the hedge.

---

# 6. THE BADGE, THE AWARD AND THE REWARD

He named three things. They are three things, and the distinction is the design.

> **A mark counts what you did. An award records what moved. Karma is what
> either one pays.**

## 6.1 The mark. What you did

Built, at `engine/ladder.js`. Sixteen marks in three families: Practice at the
root, Ground at the throat, Structure at the heart. Each is a test against the
ledger, so it is a fact with a date rather than a prize. Nothing changes except
that they pay.

**And never a count against a total.** The earned marks are shown, the next one
is named with what it takes, and the ones past it are not enumerated, because a
list of a person's unfinished self is a completion bar on a nervous system.
`ladderRead` already returns exactly that and nothing more, which is the
correct shape and was already built.

## 6.2 The award. What moved

New, and it is the **body** quarter of the loop, which had no mechanic at all
before this pass.

Three families, and the third one exists because of a measurement.

| Family | Seat | What it records | What it needs |
|---|---|---|---|
| **Cleared** | Throat | an address that was carrying is held at the opposite pole | a release |
| **Held** | Heart | an axis that stayed at its coherent pole for seven readings in a row | a reading, and nothing else |
| **Moved** | Root | coherence crossed a band boundary, in either direction, on a date | two readings |

**Why Held exists.** Measured off `engine/ladder.js` and the `sq >= 4` release
threshold: **four of the sixteen marks can never be earned by the 465 of 1000
who reach a complete reading with nothing above the release line.** Marcus,
Angela, Sofia and Rosa. A quarter of the ladder is permanently shut to nearly
half the panel, and nobody had noticed because the ladder never prints how many
there are. One award family that needs a release would repeat the same mistake.
Held needs a reading and nothing else, so every person who ever completes an
intake can earn.

**Three rules the awards inherit and do not get to argue with.**

1. **A fact, never a cause.** "An axis held its coherent pole for seven
   readings in a row" is true or it is not, and it says nothing about why.
   `DESIGN-progression.md` 3.2.
2. **Fixed thresholds, announced.** No variable schedule, no surprise, no
   near miss. A person can see the next one coming and can decide not to chase
   it.
3. **The shape says the family.** Apple's own taxonomy, taken: an award's icon
   family is readable before its label is. Ring, not fill, as everything here
   is.

**In the model the awards are worth 0.8 points**, and at an award effect of
zero the design still reaches +10.2 points. They are not carrying the number.
They are carrying the 465, and that is a measured hole rather than a modelled
one.

## 6.3 The reward. Karma

**Karma is paid for the record, after the fact, and is never promised in
advance for the act.** Measured this pass: announcing it in advance and making
it contingent on doing the practice costs **3.2 points of 1000 at day thirty**.
Deci, Koestner and Ryan 1999, 128 studies, d minus 0.40. That is not a copy
preference, it is the second largest single number in this document.

**On the word.** This design is costed on the reading that **karma is the name
for patterns a person earned rather than a second unit that buys them.** One
supply, two sources: granted, which is the gift and the plan and a purchase,
and earned, which is karma. No exchange rate, so nothing for anybody to publish
a division of, and it passes `DESIGN-progression.md` 2.2's existing ban gate
without moving it. It is also his own joke made literal: all the stories are
karmic patterns, so the coin and the thing released are the same unit. **It is
still his call and it is question 1 in section 12.**

## 6.4 What earns, and what it buys

| Act | Pays, in patterns |
|---|---|
| a ritual marked done | 1 |
| a journal entry that produced at least one imprint | 1 |
| a mark earned | 5 |
| an award conferred | 5 |
| a season finished, seven of seven with grace | 8 |
| **a floor day** | 1, the ritual only, and it is recorded as a floor day |

| Spend | Costs |
|---|---|
| one address across the four channels, the floor sized run | 4 |
| a release run at the cap | 25 |

Rates are stated in patterns, not in a second unit, for the reason above. If
the owner rules that karma is a separate coin, every number here multiplies by
the exchange rate he sets and nothing else in the design changes.

## 6.5 The proof it closes for somebody who will not pay

Closed form, somebody who runs the whole ring every day:

    7 x (1 + 1)  +  8            =  22 patterns a week earned
    22  +  10 free allowance     =  32 a week, about 139 a month
    139 / 400 tier one           =  35 percent of the bottom paid rung

Somebody who runs it twice a week:

    2 x (1 + 1)                  =   4 patterns a week earned
    4  +  10                     =  14 a week
    25 / 14                      =  a run at the cap every 1.8 weeks

**That is the number `DESIGN-economics.md` finding 1 asked for.** Its complaint
was that ten a week against a run of twenty five means a free person reaches a
run every 2.5 weeks and never in a week, which is a countdown rather than an
allowance. With karma, the twice a week person reaches one every **1.8 weeks**
and the daily person reaches one **every week and a bit**. The floor at
allowance alone is unchanged, so nothing is taken away from anybody.

Measured over the simulated ninety days, all 1000 including everybody who left:

- patterns earned: median 13, 75th 64, 90th 261, max 299
- among the 74 still active at day 90: median 276, max 296
- **afforded the floor sized run of 4: 95.2 percent, 952 of 1000, median on day 1**
- **afforded a run at the cap, 25: 42.3 percent, 423 of 1000, median on day 7**

**And the number to look at before signing the rate.** All sixteen marks at 5
patterns is 80 patterns, which is **20 percent of one tier one month handed to
somebody who never pays**, on top of the gift of 100. That is defensible as the
second half of the gift and it is not defensible by accident. Either it is
called that, or the mark rate comes down. Question 2 in section 12.

## 6.6 What was refused, and what each refusal costs

A refusal without a price is a preference, so each one has a number.

| Refused | What it would buy | Measured cost of refusing | Why not here |
|---|---|---|---|
| **Loss framing** | Patel 2016, 0.45 of days against 0.30 control | **3.0 points of 1000 at day 30** | it works by making stopping feel like a loss, on a product that reads distress |
| **Habitica's party damage** | a reported 39 percent retention rise, vendor adjacent source | not separately modelled; it is loss framing with a social multiplier | it makes a person's distress somebody else's failure |
| **The asserted affirmation** | the standard wellness pattern | **minus 0.2 points**, so it costs nothing to refuse | Wood 2009. It harms the 800 of 1000 who most need it, and the model cannot see mood at all |
| **Streak reset to zero** | the sharpest version of the loss lever | **4.4 points**, which is what the halving is worth | Lally 2010: the behaviour does not reset when the counter does |
| **Variable ratio reward** | the schedule the gambling literature is about | not modelled, deliberately | Schull, *Addiction by Design*. Not on a nervous system |
| **A scarcity timer, including Apple's limited edition award** | real and measurable | not modelled | nothing in this product expires |
| **A leaderboard** | real, and James said so in his own persona line | not modelled | it ranks people who handed a machine their distress |
| **A fear of missing out push** | real | not modelled | the push model is one per ritual at the time it runs, and nothing else |

**One line worth reading twice.** In `PANEL-ritual-1000.md` the loss framing
refusal was estimated at roughly half again on day thirty and deliberately not
run. Run against this design it is worth **3.0 points on a base of 19.9**,
which is a sixth rather than a half. **The refusal got cheaper as the honest
design got better.** That is the commercial argument for the hard line and it
is the first time this repository has been able to make it with a number.

---

# 7. THE ITERATIONS

Nine passes. Each one is the pass before it with exactly one thing added, and
each was measured before the next was designed. Every cell is people of 1000.

| Pass | What it added | d1 | d7 | d30 | Bottom line | Delta |
|---|---|---|---|---|---|---|
| | the build before the four fixes, for the audit trail | 582 | 139 | 69 | 6.9 | |
| **base** | **the build at commit 0e63f4b** | 742 | 308 | **89** | **8.9** | **0.0** |
| 1 | the ritual is titled with the sentence it came from | 742 | 308 | 89 | 8.9 | +0.0 |
| 2 | and the stemmer folds a word to its family | 744 | 310 | 91 | 9.1 | +0.2 |
| 3 | and the frame layer reads the form of a sentence | 745 | 315 | 110 | 11.0 | +2.1 |
| 4 | and the practice carries the person's own span | 746 | 323 | 130 | 13.0 | +4.1 |
| 5 | and the affirmation is the sixty second floor | 748 | 327 | 147 | 14.7 | +5.8 |
| 6 | and the award family that reads the coherent side | 749 | 329 | 163 | 16.3 | +7.4 |
| 7 | and the season, seven days with an end | 749 | 330 | 165 | 16.5 | +7.6 |
| 8 | and the stake sentence | 749 | 330 | 167 | 16.7 | +7.8 |
| **9** | **and the first session ends by showing what landed** | **818** | **402** | **199** | **19.9** | **+11.0** |

## What each pass taught, which is the part worth keeping

**Pass 1 was worth exactly nothing, and it was the most useful pass.** Tying
the ritual to the sentence it came from is the item `PANEL-ritual-1000.md` said
moves Diane. It moved nobody, because under the build **0 of 1000 of the panel
write a sentence the instrument can cut a quotation out of**. A mechanic that
depends on content is worth zero until the content arrives. That is the finding
that redirected the whole pass into section 5.

**Passes 2 and 3 are the same mechanic at two strengths** and the difference
between them is the difference between widening a vocabulary and changing what
kind of thing is read. The fold is worth +0.2. The frame layer is worth +1.9
more on top of it, and it unlocks passes 4 and 5, which is why its ablation
value is 5.0 rather than 1.9.

**Passes 4 and 5 are the content chain paying out**, +2.0 and +1.7. They could
not have been run in any order before pass 3.

**Passes 6, 7 and 8 are worth 1.6, 0.2 and 0.2.** Three mechanics, half a
point between the last two. This is where the pass would have stopped if the
target had been five points, and the design would have been worse for it.

**Pass 9 is worth 3.2 points on its own and it came out of the exit table.**
After eight passes the model said 264 of 1000 were still leaving in the first
two days, against 255 before any of it. Eight passes of loop design had moved
the first two days by nine people in a thousand. Everything built so far was
downstream of a day most people never reached twice.

The mechanic is not a new reward. **The first session ends by showing what
landed.** A journal entry committed already earns the First story mark today,
in `engine/ladder.js`, and `ladderHtml()` renders on Ritual and on the Compass,
so a person who writes one sentence on the Story surface and stops has earned a
mark they will never see. The first thing this product ever gives somebody is
invisible.

## And the two corrections the tool made to itself

**One.** The first cut drew the practice, the floor and the churn from one
random stream. The floor draw only happens on a day the practice was not done,
so two configurations that differ anywhere consume a different number of random
numbers and every draw after the first divergence is a different draw. The
symptom: the asserted affirmation arm, which applies an odds ratio below one to
eight hundred of the thousand and can only make things worse, reported nine
people **better**. Three streams now, one per purpose. Validation 6 asserts the
refused arm is not better and the loss arm is not worse, so the defect cannot
come back silently.

**Two.** The replacement streams were seeded as `seed + index * constant`, and
mulberry32's first output off a structured seed is not independent of that
seed, so day one drew from a sequence of correlated first values. Validation 3
caught it immediately: Derek's day one came out at 70 percent of 170 against a
published 62, thirteen people outside a six point tolerance, while every other
row passed. The seed is scrambled through a splitmix style finaliser and each
stream discards four draws before anybody reads it.

Both are recorded in the tool's own comments rather than quietly fixed, which
is this repository's standing rule and it earned its keep twice in one pass.

---

# 8. THE RESULT

## 8.1 Whole sample

| | Day 1 | Day 7 | Day 14 | Day 30 | Day 60 | Day 90 |
|---|---|---|---|---|---|---|
| Baseline, of 1000 | 742 | 308 | 188 | **89** | 37 | 10 |
| Final, of 1000 | 818 | 402 | 295 | **199** | 136 | 74 |

**Baseline 8.9 points. Final 19.9 points. Delta +11.0 points.**

Across nine seeds: baseline mean 9.0 points, range 7.5 to 10.3. Final mean 19.8
points, range 18.6 to 21.5. **Delta mean 10.8 points, range 9.6 to 12.0, and 8
of 9 seeds clear the ten point target.** The headline stays on the declared
seed so the number cannot be shopped for, and the spread is printed beside it
so nobody has to take it on trust.

## 8.2 Per ICP, averaged over nine seeds

A row of fifteen cannot carry a one seed claim. The first cut of this table
read three people of sampling noise on James as a regression, so it is averaged.

| Who | of | d30 baseline | d30 final | People | Points of that row | Points of 1000 |
|---|---|---|---|---|---|---|
| Diane | 180 | 18.0 | 30.0 | +12.0 | +6.7 | +1.2 |
| Derek | 170 | 7.7 | 17.4 | +9.8 | +5.8 | +1.0 |
| **Marcus** | 160 | 19.3 | **49.4** | **+30.1** | **+18.8** | **+3.0** |
| Angela | 150 | 8.0 | 21.3 | +13.3 | +8.9 | +1.3 |
| **Sofia** | 140 | 22.8 | **53.4** | **+30.7** | **+21.9** | **+3.1** |
| James | 100 | 4.1 | 11.6 | +7.4 | +7.4 | +0.7 |
| Ana | 50 | 9.7 | 14.7 | +5.0 | +10.0 | +0.5 |
| Gordon | 35 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |
| Rosa | 15 | 0.0 | 0.0 | 0.0 | 0.0 | 0.0 |

**Where the gain is, and it is not where the last pass put it.** Marcus and
Sofia carry 6.1 of the 11.0 points between them, and both of them are inside
the 465 of 1000 who cannot run a release. They are the people this design was
built for: a complete reading, nothing above the release line, four of sixteen
marks permanently shut, and until now no way for the loop to say where their
ritual came from. The content chain gives them a quotation instead of a
release, the Held award gives them a ladder, and their day thirty roughly
doubles and then some.

**Where it is not.** Gordon and Rosa, zero. Correct and the product should not
chase either. Gordon's published day 7 is 0.00 percent and the calibration will
not let him live whatever is built. Rosa reads 100 coherence, has nothing to
release, and her own persona line reads as **coherent** through the frame
layer, which is the instrument working. A settled person is not a retention
problem.

## 8.3 What the model can say about an exit

| | Baseline, of 1000 | Final, of 1000 |
|---|---|---|
| exits where the ritual was tied to nothing of the person's own | **401** | **15** |
| exits in the first two days | 274 | 281 |
| exits where a broken run contributed | 172 | 147 |

**The middle row is the honest one.** The design moves the first two days by
almost nothing even after pass 9, because pass 9 raises survival from that day
rather than reducing the exits on it. The thing the design genuinely closes is
the first row: a loop that had nothing of the person's own in it for 401 of
1000 now has it for all but 15.

## 8.4 Against the outside, stated properly

| | Baseline | Final | Finch | Category |
|---|---|---|---|---|
| D1 | 74.2 percent of 1000 | 81.8 percent of 1000 | 54 percent | 25 to 26 percent |
| D7 | 30.8 percent of 1000 | 40.2 percent of 1000 | 37 percent | 11 to 13 percent |
| D30 | 8.9 percent of 1000 | 19.9 percent of 1000 | not published | 2.78 to 7 percent |

**And the two warnings from the last pass still apply and are not decoration.**
The two product columns are a weighted ICP panel and not an install cohort.
`RESEARCH-icp.md` weights by willingness to pay and ability to find the
product, so it is a warmer sample by construction and its day 1 is not
comparable to Finch's on equal terms. Finch's 54 and 37 are measured on real
installs by a third party. **The honest claim is that this design reaches past
Finch's published shape on a warmer sample, not that it beats Finch.** Anyone
who states it the other way is quoting a simulation as a measurement.

---

# 9. WHAT THE AVATAR HAS TO DO

Stated as a requirement on the other seat, not as a proposal about what it
looks like. `DESIGN-avatar.md` owns it. These are the four things the loop
needs from it, and if it does not do them the loop does not close.

**1. One frame that changes when a release lands, on the surface the release
happened on.** The loop pays out here or it does not pay out. Everything in
section 6 is a record, and a record is read. The avatar is the only thing in
the design that a person **watches**, which is his own word for it. If a person
has to navigate to see it, it is a page in the product and not the centre of it.

**2. Seven regions that map to the seven seats, so an award at the solar
changes the solar and nothing else.** The seat colours are already fixed in
`PAL` and every other surface already obeys them. An avatar whose change is
global tells a person nothing they did not already know from a number.

**3. A state that can only be read, never scored.** No bar, no percentage, no
level, and never a count against a total. It may look better and it may not say
how much better. This is the same ruling every other surface in the product
carries and the avatar is the surface most likely to break it, because a
character that improves is the most natural place in any product to print a
level.

**4. A still frame for the 465 of 1000 who cannot release.** This is the
requirement most likely to be missed, so it is stated hardest. Marcus, Angela,
Sofia and Rosa reach a complete reading with nothing above the release
threshold, and **an avatar driven only by releases never moves for 46.5 percent
of the weighted panel.** They are also, per section 8.2, where 6.1 of the 11.0
points in this design come from. What their avatar shows is **holding**, not
clearing: the Held award family, an axis that stayed at its coherent pole. If
the avatar has one state for cleared and one state for nothing, nearly half the
people this design retains watch a figure that never changes.

**And one thing the avatar must not do.** Section 2.7. Voidpet Garden is the
nearest thing in market to "what is Atuned, your avatar", and the criticism it
draws is that the creature collection ate the mental health product it was
attached to. There is no collection here. There is one figure and it is the
reading.

---

# 10. THE PITCH

**What changed.** Five things, in the order they are worth.

1. **The sniffer reads sentences instead of words.** A stemmer so one lexicon
   entry covers its family, and eighteen frames that match the **form** of a
   sentence rather than its vocabulary. Measured on the repository's own
   fourteen persona voices, the product goes from reading **1 of 14** to **9 of
   14**, and weighted across the nine ICPs from **0 of 1000 to 935 of 1000**.
2. **The practice is built out of the person's own sentence.** A frame match is
   a verbatim quotation, so the thing that reads the charge and the thing that
   cuts the quotation are one match. The practice holds their words, not ours.
3. **The affirmation is a sentence to test, not a sentence to believe.** Their
   own claim with one word hedged, both halves shown, editable, and it enters
   as the sixty second floor version of the ritual so a bad day is still a day
   kept.
4. **Three award families, and the third one is why.** A mark counts what you
   did, an award records what moved. Four of the sixteen marks can never be
   earned by 465 of 1000, so one family needs a reading and nothing else.
5. **The first session ends by showing what landed.** The First story mark is
   already earned by committing one entry and is already invisible where it is
   earned. Worth more than any other single mechanic in the design.

**What it is worth.** Karma pays for the record after the fact, never in
advance for the act, and it closes the free tier's arithmetic: a daily
practitioner reaches a release run at the cap **every week and a bit** on 35
percent of tier one's monthly volume, so it more than doubles a free person's
rate and comes nowhere near cannibalising a subscription. Announcing the coin
in advance instead costs **3.2 points**. Loss framing, which every free to play
product in this category would ship, is worth **3.0 points** and is refused.

**The two numbers.**

> **8.9 points of 1000 still active at day thirty today.**
> **19.9 points with this design. Plus 11.0, against a target of ten.**

Measured by `tools/loopsim.js` at seed 20260920, 42 checks passing, on the same
machinery that reproduces the published curve. Across nine seeds the delta
averages 10.8 and 8 of 9 clear ten.

---

# 11. HOW THIS COULD BE WRONG

Eight ways, worst first. The first two would change the answer.

**1. The frame layer was written after reading the lines it was then measured
on.** Eighteen frames, fourteen voices, and I had read all fourteen. The 9 of
14 and the 935 of 1000 are **in sample and are an upper bound**. The held out
test is the first hundred real entries and it has not been run, because there
are no real entries. If the true out of sample rate is half the measured one,
the frame layer's 5.0 points is closer to 2.5 and the delta is nearer eight
than eleven. **This is the single thing most likely to be wrong and it is the
largest item in the ablation.** The fold is not in sample and is not affected:
nineteen suffix rules that never saw a persona line, measured on an independent
63 word probe.

**2. Four coefficients are mine and together they carry most of the number.**
With every credit coefficient of mine at zero and the break shock left alone,
the baseline reads 7.8 points and the final 9.3, so **the delta at that end is
+1.5 points, not +11.0.** What survives there is only what is measured: the
content chain's throughput per ICP and the four fixes already built. Taking the
break shock to its harshest as well takes both arms down and the delta to +1.1.
Every one of the four is swept in `--sweep` and the single worst case for each
is: chain effect at zero, +10.1; floor probability at zero, +9.2; first session
at no effect, +7.7; award effect at zero, +10.2. **No single one of them takes
the design below eight points. All four at once takes it to one and a half.**

**3. The baseline is calibrated, not predicted.** The per persona hazard is
inverted out of four published points in `reviews/simulation-quarter.md` 6.3,
and those points were hand derived in that document rather than measured on
people. If they are wrong everything here is wrong by the same factor. The only
defence is that the whole output is a delta, so a common scaling error mostly
cancels in the comparison and not in the levels.

**4. Six of the nine ICPs are forced toward zero by the calibration.** Gordon
and Rosa cannot survive to day thirty whatever is built, and Diane, Derek,
Angela and James are at exactly 0.00 percent on the published day 90. Day 90 in
every table here is a floor.

**5. Effect sizes are being moved to a different outcome than they were
measured on.** Symons and Johnson is recall. Harkin is goal attainment.
Gollwitzer is plan enactment. Nunes and Dreze is completion. All are applied
here to a daily probability of practising or to a churn hazard. The d to odds
ratio conversion is the standard logistic approximation and is itself an
approximation. **Nothing in the cited literature measured app retention.** The
transfer discount, halving Symons and halving Harkin for the second channel, is
mine and is the reason those two are swept from zero.

**6. One person cannot quit twice and cannot come back.** A single absorbing
exit. Real people lapse for three weeks and return, and the season is built for
exactly that case, so the model **understates** the season. Its 0.1 points
should be read as a lower bound and it is the item I would most expect to be
undervalued here.

**7. The model assumes a person who practises also writes.** The loop is one
act in the design, journal to imprint to release to ritual, so the simulation
treats them as one draw. A person who opens the app, marks yesterday's ritual
done and leaves has kept a day without adding content, and this model cannot
see that person at all. It probably overstates how much content the average
retained person generates and therefore how often the chain refreshes.

**8. The awards are the weakest justified mechanic in the design.** Half of
Harkin's d, applied to a second channel of the same mechanism, for effectively
everybody. It is the one place a meta analysis is used twice. At zero the
design still reaches +10.2, which is the defence, and the awards' real case is
the measured one: four of sixteen marks shut to 465 of 1000.

---

# 12. THE QUESTIONS I CANNOT ANSWER

Nine, and each says whose they are. He asked every team to ask rather than
guess, so these are asked rather than resolved.

**1. Which word survives, and what kind of thing it is. His.** Patterns, points
or karma. `DESIGN-progression.md` 2.2 rules there is exactly one currency and
it is patterns, with a build gate to stop a second one appearing.
`TASKS.md` AK2 names karma and AK4 says badges pay it. This design is costed on
the cheap reading, that **karma is the name for patterns you earned rather than
a second unit that buys them**, because that is the only one of the three that
passes the existing gate and it is his own line about karmic patterns made
literal. If he rules the other way, every rate in section 6.4 multiplies by an
exchange rate he sets and nothing else changes.

**2. What a mark and an award are worth. His.** Sixteen marks at 5 patterns is
80 patterns, which is 20 percent of one tier one month handed to somebody who
never pays, on top of the gift of 100. Either that is called the second half of
the gift, out loud, or the rate comes down. Awards compound it and there is no
ceiling on how many Held awards a person can accumulate over years, which needs
a rule before it needs a rate.

**3. Does the affirmation get shown to a person at all before they approve it,
or is it proposed silently? His, and it is a safety question rather than a
design one.** The design shows the struck word and the hedge together and asks
the person to keep it or write their own. The alternative is that the product
never shows an unapproved sentence at all and only offers to help write one.
The first is warmer and is what shipped in the prototype. The second is safer
for somebody in acute distress and `DESIGN-progression.md` section 4 already
has a crisis gate that could carry it. I do not know which he wants.

**4. If the accounts fork puts a model behind the sign in seam, does the frame
layer become the fallback or the engine? His, and it decides how much more to
invest here.** Eighteen frames took an afternoon. A hundred and eighty would
take a week and would still lose to a model on out of sample text. If a model
is coming, the frame layer should be capped at whatever makes the offline path
honest and no larger. If it is not coming, it is the product's reading engine
and deserves a seat of its own.

**5. The `sq >= 4` release threshold. His, and it is the oldest open item.**
465 of 1000 reach a complete reading with nothing to release and four of
sixteen marks permanently shut. This design deliberately routes around it
rather than waiting on it, and routing around it is worth 6.1 of the 11.0
points. But the hole is still there, and lowering the threshold changes what
the product claims about a calm person, which is a product question and not a
tuning one.

**6. Does a person see their karma balance as a number? His.** Every other
quantity in this product is drawn or is a count of events. A balance is
neither. The prototype prints it, at `proto/game/one.html`, because a bank a
person cannot read is not a bank. It is the one place this design may be
breaking a standing rule and I would rather be told than assume.

**7. Is the floor day recorded as equal to a full day on the record? Mine to
propose, his to rule.** The design pays it one pattern instead of two and marks
it as a floor day, so the record tells the truth and the streak still counts
it. The alternative, that a floor day is simply a day, is simpler and is what
Finch does with Baby steps. I chose the honest one and it may be the colder one.

**8. What happens to an award a person no longer holds. Mine, unresolved.** The
Held family records that an axis stayed at its coherent pole for seven
readings. If it falls back six months later, the award is still a true fact
about a date, so it stays. But a wall of awards about a state a person is no
longer in is its own kind of cruelty, and I do not have a rule for it yet that
is not either dishonest or unkind.

**9. Whether the ten point target is the right target. Mine to raise.** The
bottom line moved from 8.9 to 19.9 points, which is a doubling, and the
category median at day thirty is under 3 percent of installs. Reaching the
target does not mean the product retains. It means the model says this design
retains twice what the current build does on a panel that is warm by
construction. **The first hundred real people will answer in a week what this
document argued about for a day**, and the thing to instrument first is the
content chain's out of sample span rate, because objection 2 in section 3 says
that is where the whole number lives.
