# The Offer And The Conversion Path

Camille Boucher, sales. The funnel, the tiers, the conversion.

Everything here was checked against `atuned_src/engine/plan.js`, `DECISIONS.md`,
`BUYERS.md`, `DESIGN-billing.md`, `DESIGN-economics.md`, `RESEARCH-icp.md` and
`TASKS.md` section B, and against the running app in Chromium at 1600 by 1000
with `loadP(6)`, which is James.

**Three honesty rules, held throughout.** Every quotation attributed to an ICP
is simulated and is labelled as such. Every revenue figure carries its
arithmetic and every input is labelled as the owner's, the repo's, mine, or an
external benchmark from elsewhere. No conversion benchmark from another product
is presented as this product's.

---

## 1. The Decision Moment

### Where It Is

**The decision to pay is made at the end of the fourth release run, when the
person wants a fifth and the meter says two and a half weeks.**

Not at the score. Not at the reading. Not at the quiz.

Here is what they have just seen, in order, and it is the only order that
produces a decision:

1. A score with an interval on it, on the web, before installing anything.
2. The reading. For James at `loadP(6)`: 18 addresses carrying, 28 saboteurs,
   13 complexes, 3 hyper complexes, 1 character, the archetypes, the masks, the
   blueprint, the balance strip, the heaviest seat named as Sacral at 3.7 and
   the most shut law named as Compassion at the heart. All of it free.
3. A release run. Measured in the running app: the done card prints
   `N addresses, M cleared entirely, X weight freed`, and the summary re-reads
   lower at the address they ran.
4. That, three more times, because the gift is a hundred patterns and a run is
   twenty five.
5. The wall, which is not a wall. It is a pace. Ten a week, banking.

**Step 3 is the first moment in the product where something the person is
carrying moves because of something they did.** Everything before it is
description, however good the description is. Steps 1 and 2 buy attention.
Step 3 buys belief. Step 3 repeated four times buys the subscription, because
by the fourth run the person is no longer evaluating an instrument, they are
inside a practice and the practice has a rate limit.

That is the correct place for a paywall and it is where the meter already puts
it. The mechanism is right. What is wrong is everything around it.

### Where It Currently Sits In The Flow

Measured, not estimated. The path from an advertisement to step 3 today:

    ad -> landing -> 63 questions, 15 minutes -> email -> install ->
    sign in -> intake -> write a story -> commit it -> find the Release
    panel on the Story tab -> pick -> 0.9 minutes of run

Eleven steps. `RESEARCH-icp.md` measures 47 of 1,000 reaching a *score*, which
is step 6 of that list. The moment of value sits four steps past the point
where 95 percent of the panel is already gone.

### The Drop Offs, Named, With The Grid Level Each One Happens To

**Drop off one. The picker quotes a number and the meter charges a different
one. Measured in the running app, not inferred.**

The Story tab carries a control headed "Release", reading "Pick how much to
run. Each pattern is one thought line at one address." It offers Patterns: 1,
3, 5, 8. The footer then prints the choice back.

I drove all four settings against James and read both surfaces:

| Picked | The picker says | The confirm card then says |
|---|---|---|
| 1 | `1 patterns, about 9 seconds` | `1 address · 25 of your allowance · 25 thought lines of new ground, which is 25 patterns` |
| 3 | `3 patterns, about 26 seconds` | `3 addresses · 25 of your allowance · 25 patterns` |
| 5 | `5 patterns, about 44 seconds` | `5 addresses · 25 of your allowance · 25 patterns` |
| 8 | `8 patterns, about 70 seconds` | `8 addresses · 25 of your allowance · 25 patterns` |

Every run costs twenty five, whatever is picked. The cause is in
`atuned_src/engine/schema.js:374`, `meterPlan`, which fills to the cap by
walking `LINES_PER_CH` passes across the selected addresses. `DECISIONS.md`
rules "a release run is **at most** 25 patterns". The code reads it as exactly
twenty five. The picker is the only cost control a person can see and it
controls nothing.

*Which grid level.* Everybody, but it is fatal at levels 4 and 5, which
`BUYERS.md` puts at 40 and 30 percent buying probability and names as the
largest population and the hardest conversion. Level 4 avoids the practice
because the work hurts, and a person who has just been overcharged three times
over has been handed a reason to stop that costs them nothing. Level 5 wants
magic and reads a mis-quote as the mechanics they suspected. It also loses
Marcus permanently, and he is the ICP the repo already records as doing the
division unprompted.

This one is not a copy problem and it is not a pricing problem. It is the
single most damaging thing in the commercial flow, because the person's first
contact with the meter is one where the product quoted low and charged high.
On a product whose entire position is that it does not manipulate, that is
disqualifying. **Nothing else in this document can be sold until it is fixed.**

**Drop off two. The plan panel names the wrong tier.** Opened the profile
sheet against a fresh record. It prints:

    On            Free
    New ground    100 of the gift left

and then free's description underneath. The person is on the gift and is being
told they are on free. `planState` returns `none` for `tier:'gift'`, so
`planOf` falls through to free, while `planAllowance` handles the gift on its
own branch. Two functions, two answers, one panel.

*Which grid level.* 6 and 7, at 65 and 85 percent, which are the tipping point
and the primary. They are the levels that read carefully. This is the one
screen in the product that handles money and it does not know what the person
is on.

**Drop off three. There is no price anywhere in the product.** The button says
`Move to tier one`. No number on it, none beside it, none in the panel. James,
in the repo's own record: "The question is what is at the bottom and whether
the price is on the page."

*Which grid level.* 7 and 8, at 85 and 90 percent. The pragmatic, execution
focused buyers. A price you have to ask for is a price you are negotiating.

**Drop off four. The score sits behind the install.** Already measured in
`RESEARCH-icp.md` at 69 of 121 people lost, and already recommended for
reversal there. I concur and add nothing except that it is the largest single
loss in the funnel and it is self inflicted.

**Drop off five. `planUpgrade` cannot describe the one rung with a price on
it.** Probed directly: `planUpgrade({tier:'three',status:'active'})` returns
`say: 'the same ground'`. Tier four carries `lead:true` and the function never
reads it. So the product's own upgrade sentence for its ninety nine dollar rung
is "the same ground". Named in section 2.

---

## 2. The Free Line, And Its Defence

### What The Free Reading Includes

Everything. The list is long on purpose and the page prints it in full,
because the length is the argument.

- The whole reading. Coherence, the band, the shadow weight, the depth, the
  pole, the interval on all of it.
- Saboteurs, complexes, hyper complexes and character. For James: 28, 13, 3, 1.
- The archetypes, primary, secondary and the two also ran. The masks, all six.
  The blueprint and its domains.
- The pain map. The field wheel and its zoom, down through the triad, the seven
  seats and the twenty one laws.
- The compass, the knowledge base, the numerology in full, the energetics
  overlay, the analytics strip.
- Every tool. The journal. The story parse.
- **Rerunning anything already open, unlimited, forever, at no cost.**
- The gift: a hundred patterns, four full release runs, with no card entered
  at any point.
- Then ten patterns a week, for life, banking until a run is affordable.

### What It Withholds

One thing. **How fast you may open ground you have never opened.**

That is the whole of it. There is no second withheld thing and there must never
be one.

### The Defence, And It Has To Survive Being Attacked

A person's own reading is theirs and was never ours to sell. The owner ruled
it and he is also commercially right, which is rarer than it sounds. The
mechanic that withheld a person's reading in order to sell it back was the one
thing in this product that would have poisoned the brand, and it is gone.

So what is left to sell has to be defensible on its own. It is, and here is the
test I would put it to in front of a hostile reader.

**Is the withheld thing punitive?** A free person can run a full release every
two and a half weeks, forever, on their complete reading, and can rerun every
address they have ever opened as often as they like at no cost. A free person
who opens four addresses during the gift owns those four addresses for life.
The free tier is not a crippled instrument. It is a complete instrument at a
slow pace. That is not punitive and it does not read as punitive.

**Is a pace a real thing to charge for?** Yes, and it is the only honest thing
on the table. The owner's own line: the allowance is a pace, which is why a
year of patterns is not handed over in one lump even on an annual plan. A pace
given away is not a practice. That sentence is doing real work and it is the
one I would put on the page.

**Where does it currently read punitive, and it does.** Because every run costs
twenty five regardless of what was picked, a free person's two and a half weeks
of banking buys **one address**, not the eight the picker showed them. That is
the thing that makes free feel mean, and it is a defect rather than a policy.
Fix the picker and free stops feeling mean without the grant moving at all.

The arithmetic, and it is the strongest free tier improvement available at zero
marginal cost:

    one address, four channels, one line each   = 4 patterns
    free grant, 10 a week                       = 2.5 single address releases a week
    free grant, banked 2.5 weeks                = one full 25 pattern run

Today the free tier is 1.7 runs a month and nothing smaller is possible. With
the picker honoured it is two or three small releases a week, or a full run
every two and a half weeks, and the person chooses. **The ruled grant of ten a
week does not move.** This is a defect fix that happens to double the felt value
of the free tier, and it needs no decision from anybody.

---

## 3. The Tier Table As A Person Reads It

The engine stores patterns per month. Nobody buys patterns per month. A person
buys a cadence, because the run is the unit they act in, and the run is
twenty five.

    free      43.3 a month    1.7 runs    one release every 17 days
    one          400          16.0 runs   one release every other day
    two          800          32.0 runs   one release a day
    three      1,200          48.0 runs   three releases every two days
    four       1,200          48.0 runs   the same, and the people you lead

### The Table, As It Goes On The Page

| | What you can do | Monthly |
|---|---|---|
| **The gift** | Four full releases. The whole reading. No card. | free |
| **Free, for life** | A release every two and a half weeks. The whole reading. Rerun anything you have opened, forever. | free |
| **One** | A release every other day | 12 |
| **Two** | A release a day | 24 |
| **Three** | Three releases every two days | 36 |
| **Four** | Three releases every two days, and the people you lead | 99 |

No badge on any rung. No highlight on the middle one. Under each rung, one
line that routes on behaviour rather than on a nudge: *pick this if you run a
release every other day.*

### Checked Against `plan.js` And `DECISIONS.md`. Six Disagreements.

**One. The picker labels addresses "patterns" and charges 25 every time.**
Measured, section 1. Blocks the entire table, because the table is denominated
in runs and a run does not cost what the product says it costs.

**Two. The plan panel says Free while the gift is in force.** Section 1.

**Three. `planUpgrade` from tier three returns "the same ground".** Probed.
Tier four's only difference is `lead:true` and the function never reads it. So
the engine's own upgrade sentence for the one rung with a ruled price is a
sentence that says there is nothing to buy. This is the clearest
stored-model-against-sellable-story break in the file: `DECISIONS.md` says
"Tier four is not more of the same" and `planUpgrade` says it is exactly more of
the same, which is to say, none.

**Four. "A hundred a week" is eight percent generous.** `plan.js` gives tier
one `grant:400, per:'month'` and describes it as "a hundred a week". A month
averages 4.35 weeks, so four hundred a month is 92 a week. The two statements
differ by 8.7 percent. `DECISIONS.md` still carries "Tier one, 400 a month or
100 a week. Both were said" as open. It does not need a ruling, it needs one
word: *about* a hundred a week, or the monthly figure alone. Derek checks this
kind of thing.

**Five. `DESIGN-economics.md`'s ladder table contradicts the sight ruling.**
Its table prints Sight as `saboteurs / complexes / hyper complexes /
everything` down the four rungs. `plan.js` has `see:'sup'` on every tier
including free, and `planSees` returns true for every kind on every plan, which
is correct and is the ruling. **Anybody pricing off `DESIGN-economics.md`'s
table is pricing a ladder that no longer exists.** That document needs the
correction before it is used again.

**Six. `DESIGN-economics.md` and `PANEL-10k.md` disagree on revenue per payer
by 52 percent**, 16.67 against 25.35. Neither is wrong; they model different
things. But they are the two numbers anybody will pick up, and picking either
one silently is how a price gets set on an accident. Section 7 uses a third
figure derived from a stated mix so it can be checked rather than trusted.

### The Tier Change, With The Arithmetic

**Keep the four rungs. `DECISIONS.md` rules the ladder is 400, 800, 1200 and
1200 plus the suite, and that tier three does not need something of its own. I
am not reopening it. Change the prices so the rate stops rising.**

The exposure, from `DESIGN-economics.md` and confirmed:

    12 / 29 / 59 for 400 / 800 / 1200   =  3.00c / 3.62c / 4.92c a pattern
    12 / 24 / 36 for 400 / 800 / 1200   =  3.00c / 3.00c / 3.00c a pattern

At 12/29/59 a person pays 64 percent more per unit for buying more. Two of the
six ICPs perform that division unprompted in the repo's existing record.

**Does the cheaper ladder cost revenue?** I modelled both under one mix and the
answer is that it cannot be settled by arithmetic, which is itself the finding:

    12/24/36/99   mix 55/28/12/5   ARPU 22.59   x 1.075 payers = 24.28
    12/29/59/99   mix 62/22/11/5   ARPU 25.26   x 1.000 payers = 25.26
    difference 4.0 percent in favour of the dearer ladder

The 1.075 payer index is `DESIGN-economics.md`'s own modelled result, 6,521
payers on 12/24/39 against 6,066 on 12/29/59. The mixes are mine and they are
labelled as assumptions. Four percent is inside the width of my own mix
assumption, so **revenue does not decide this.**

What decides it is that only one of the two ladders can be printed. At a flat
three cents I can put the rate on the page myself, before anybody divides. At
3.00, 3.62 and 4.92 I cannot, and `DESIGN-economics.md` explicitly reaches for
"or do not print the rate" as the alternative. A number the customer finds
himself reads as a number you hid. A number you printed reads as a number you
checked. **Re-spacing the ladder is what earns the right to print the rate, and
printing the rate is the answer to the objection two ICPs raise on their own.**

**12 / 24 / 36 / 99.** Ninety nine is the owner's and it holds, for the reason
`DESIGN-economics.md` already gives and for one more in section 6.

---

## 4. Price Presentation

### The Anchor, And It Is Not A Competitor

The anchor is the gift the person has already spent. By the time a price is
shown they have done four runs. The anchor sentence is the equivalence, at the
conservative end, as throughput and never as outcome. `planWorth(100)` already
returns it:

> As many patterns as 17 therapy sessions would release.

That is the book's own rate quoted at its low end, which is the rule. Not "two
years of therapy", which is an outcome claim the evidence tier does not carry.
Not a competitor's price. Not a dollar per pattern, which is ruled internal and
stays internal.

### The Order On The Page

1. **What you already have, free, forever.** The full list from section 2. It
   is long and the length is the argument.
2. **What the gift was worth**, in throughput, at the conservative end.
3. **The one thing a tier changes.** One sentence: *the only thing a tier buys
   is how fast you may open ground you have not opened. Everything else is on
   every tier, including free.*
4. **The four prices**, one row, monthly, cadence under each, no badge, no
   highlight, no default.
5. **The rate, printed by us.** *Three cents a pattern at every rung. It does
   not go up when you buy more.*
6. **Annual**, with its reason.
7. **No trial**, with its reason.

### Monthly And Annual

**Monthly is the headline and the default.** 12, 24, 36, 99.

**Annual is twelve times the monthly, with no discount, and the page says why.**

    tier one    144 a year
    tier two    288
    tier three  432
    tier four   1,188

Two months free is withdrawn and does not come back. Whether there is any
discount at all is the owner's, so here is my recommendation with the
arithmetic, and it is a real position rather than a shrug.

**Recommend no discount.** A prepay discount on a practice product pays a
person to commit before they know, and a person who has not completed a run
does not know. It also buys a year of somebody's non use, which is a retention
number that is not retention. The allowance still arrives monthly whatever the
price, which is ruled, so the annual plan is genuinely the same product paid
once. The page says exactly that: *one payment instead of twelve, at the same
price. The allowance still arrives monthly, because it is a pace.* That is what
`planYear` already returns at `PLAN_YEAR_FREE=0`, checked in the running build.

**If a discount is wanted, ten percent is the ceiling I would defend.** Two
months free is 16.7 percent and gives one sixth of the revenue away to the
people most likely to have stayed anyway. Ten percent is below the convention,
does not read as a lever, and `PLAN_YEAR_FREE` is the one place the number
lives, so it is a one line change when he rules.

### Trial: None, And The Reason Goes On The Page

**No free trial. No card up front. No fourteen days.**

The gift is the trial and it is bigger than any trial would be. A hundred
patterns, four complete release runs, the whole reading, no payment instrument
requested at any point.

A card up front trial converts by being forgotten. On a product that holds
somatic and psychological self report, collecting a payment instrument before
the person has seen the mechanism work is a dark pattern by construction, and
the category makes it worse rather than better. The page says it in one line:
*No trial. You get a hundred patterns and you never enter a card to get them.*

That line is also the most persuasive thing on the page, which is the useful
part: refusing the manipulation outperforms the manipulation here.

### The Question To Ask, In The Form That Produces Behaviour

The owner named three. These are the only versions that produce data.

**Not "would you pay for this."** Ask: **"What did you do in the ten minutes
after your first run ended?"** Behaviour, and it is checkable against the meter,
which already holds `first`, `last` and `lines`. The answer that predicts
payment is "I ran another one". The answer that predicts churn is "I closed it".

**Not "would you pay this price."** Ask, before any price is shown: **"What
would you have expected this to cost?"** Asked at the end of the fourth run and
before the panel is ever opened. It is one field and it is the only price
research worth running, because a number volunteered before an anchor is a real
number and a number confirmed after one is an echo.

**Not "how long would you use it."** Ask: **"What would make you stop?"** It is
the only reliable retention question and the answers are specific enough to
fix. Diane's answer is "another practice I fail at". Marcus's is "when I have
seen the mechanism". Those are two different products' worth of work and neither
would have come out of a satisfaction score.

**Where they get asked.** Question one, in the app, once, after the first run
completes. Question two, once, at the fourth run, before the plan panel. Question
three, at cancellation, in the portal, one free text field, skippable, and no
retention offer attached to it, because an offer attached to the question
corrupts the answer and is also the exact dark pattern this product refuses.

---

## 5. The Objections, From The Nine ICPs

**Every quotation below is simulated.** The charge vectors and the `says` lines
are from `atuned_src/engine/data/people.js` and drive each reaction.

### Diane, 46, Founder, Second Company

Anticipation 8, Apathy installed 9.2. "Rest feels like a moral failure."

> "Twelve dollars is not the question. The question is whether this is another
> practice I will fail at. I have a shelf of those. What is it at nine on a
> Tuesday?"

**Fair.** Completely. This is the churn objection and it is the strongest one
on the table, because she is right that most of this category is a shelf.

**The answer.** Fifty four seconds. That is what a run takes at a steady pace,
measured in the app. Sixteen of them a month at tier one and each one is under
a minute of reading in thought. It is not a practice she keeps, it is a thing
she does when she notices she is holding something, and the free tier never
ends, so a month of not touching it costs her nothing and loses her nothing she
opened.

**And what we do not do to her.** No streak. No "you have not run in six days".
She carries Anticipation at 8 and Apathy replaced at 9.2, which is the profile
a streak damages. A product that reads a nervous system does not run loss
aversion on it.

### Derek, 39, High Performer, Endurance

"Pain is information. I have raced on a stress fracture."

> "Free is ten a week, 520 a year, and I accrue two hundred a year just by
> living. Net 320 against the 7,800 I walked in with. Twenty four years. Tier
> one is four hundred a month, so twenty months of paying every month to clear
> what I arrived with. I am not saying it is wrong. I am saying you have not
> looked at it."

**Fair, and it is already in the record.** `RESEARCH-icp.md` has him doing this
division unprompted and every number in it comes from `DECISIONS.md`.

**The answer, and it is a page rule rather than a sentence.** We do not sell
clearing a horizon. We sell a pace. The horizon is a reading of what a person
carries and it is not a bill. Until the owner rules on whether clearing a parent
fetter collapses its children, **the page does not print an age times two
hundred figure on the same screen as a monthly price.** Showing both invites the
division and the division reads as a subscription with no end. The app is
already correct on this: the profile sheet prints "Next marker: Entry, 1 away",
which is a distance, and the summary prints "Carrying 18 addresses" with no
denominator. A count against a total is ruled out and it stays out.

**What is sellable to him instead.** Not years. Watts. Name the limiter and its
seat, say what the holding costs in the last ten percent, and give him the
cadence. He is the one ICP who will take tier two on day one because a daily
rep is a unit he already owns.

### Marcus, 44, Creative Director

Discernment 8.8. "I can see what is wrong with anything in four seconds."

> "Three cents a pattern at four hundred, four point nine at twelve hundred.
> Your bulk discount runs backwards. And your picker said eight patterns and
> then charged me twenty five for one address. I found both in a minute. What
> else is in here."

**Fair on both, and the second one is measured, not an opinion.**

**The answer.** The rate is flat at three cents at every rung and we print it
ourselves before he divides. The picker charges what it quotes and the confirm
card builds the real plan before the run begins, which is already the ruling in
`DECISIONS.md`: a person is entitled to see what a run costs before they start
it. He is the reason the ladder was re-spaced and he should be told so, because
the thing that converts Marcus is evidence that somebody looked.

**And he is a short customer, correctly.** He buys to see the mechanism and he
leaves when he has seen it. Do not build a hook for him. A hook is the one thing
that would lose him permanently and it would cost the brand more than he is
worth.

### Angela, 36, Seeker, Six Modalities

Truth 2.6 against a 6.9 baseline. "Everything happens for a reason."

> "Twelve dollars is fine. I do not want to think about patterns per month. I
> want to know if it will finally tell me why the same thing keeps happening.
> Six modalities told me a story about it. None of them told me where it lives."

**Fair.** She is the person the pattern count pricing story fails hardest, and
she is not being difficult. Counts are not her unit.

**The answer.** The price page does not lead with counts for anybody, which is
why the table is cadence first. And the thing that names what she has been
circling is the reading, and the reading is free and stays free. She converts on
step 2, not on the ladder.

**The thing that loses her is upstream of every number here.** The word
Incoherent, handed to her at CQ 31 to 49 by software. `RESEARCH-icp.md` has her
closing it and telling the group chat. That is not a pricing fix and it is not
mine, but it is a commercial blocker and it belongs in this document: **she is
the referral channel, and she refuses at the band word before a price is ever
shown.**

### Sofia, 41, Somatic Practitioner. The Highest Value Entry In The Roster

"I hold the room for everyone. I have not been held in four years."

> "I will not put a client near this until I know who can ask for their record
> and get it. You say you will never sell it and I believe you. That is not the
> question. And ninety nine for twelve clients is nothing. Ninety nine per
> client and I am not having the conversation."

**Fair on both, entirely.**

**The answer on price.** Per practitioner, flat, up to twelve people led. A
second seat at ninety nine beyond that. Never per client. Section 6 has the
reason and it is not generosity.

**The answer on retrieval.** Section 6 has the consent design. But the first
half of her sentence is `TASKS.md` section B's open item, the email being the
only key, and it is not closed by anything I can do. **She is the highest value
ICP in the roster because she brings clients, and a one time code is the only
thing standing between her and a recommendation.** That is a commercial
statement about a security item and it should be read as one.

### James, 57, C-Suite, Third Turnaround

"I make the call and I sleep fine. People find that cold. It is what they hired."

> "Obviously a funnel. I have built them. Is the price on the page. And I am
> not handing an address to a stranger to get a number I was already promised.
> Where is the comparison? Without one the number is decoration."

**Fair on the first two. Not fair on the third, and he gets told so.**

**The answer.** The price is on the page, four numbers, above the fold, no
badge. The score is shown on the web before any install. A one time code, so
the address is not the key.

**On the rank, the answer is no and the reason is said out loud.** A rank
against other people turns a reading into a leaderboard. `DECISIONS.md` rules
that a practitioner panel sorted by coherence is a leaderboard with a licence
and that group views sort by what needs attention, never by who is ahead. And
he is the panel member most likely to game his own answers to move a rank,
which corrupts the reading he is paying for. He is 100 of 1,000. Losing him is
cheaper than corrupting the instrument, and saying it plainly is more likely to
keep him than dodging it.

**What he gets instead.** A comparison against himself over time. His first
reading against his current one, which is a measurement rather than a
leaderboard and is already in the product as the meter and the momentum
paragraph. That is the thing that extends him from five months to eight.

### Ana, 47, Teacher, One Year Out. In It Now

Fear 9, Shame 9, Sad 9. "I am in the middle of something and I cannot see the
far side of it."

> "Will it tell me this has an end. That is the only thing I am asking. And I
> do not have twelve dollars a month spare right now."

**Fair.**

**The answer, and it is a rule rather than a sentence.** The free tier is
complete and permanent and she never meets a wall on her own reading. The gift's
four runs are hers with no card. **And she is not sold to at the moment of the
reading.** A person landing in the bottom two bands gets the referral to a
licensed clinician that the book already instructs and that `DECISIONS.md`
carries onto the surface, and does not get a price page. That is on the
forbidden list in section 8 and it is not a courtesy, it is a rule.

She converts later or she does not convert, and either is acceptable.

### Gordon, 58, Managing Partner. Not Convertible, And I Am Saying So

Fear 10, Anger 10, Shame 10, Disgust 10. Nothing installed. Law baseline 1.9.

> "There is nothing wrong with me. Four people left in a year and each had
> their reasons. Any advertisement that opens with your pain is an
> advertisement for people who have pain."

**The objection is not fair as a statement about himself and it is entirely
fair as a refusal of the frame.** Those are two different things and both are
true at once.

**There is no path and I am not going to invent one.** `BUYERS.md` puts his
state at level 1 to 2, buying probability 0 to 10 percent, and gives the reason
in the grid rather than in a personality note: buying this means destroying the
identity he relies on to survive. `RESEARCH-icp.md` has him refusing at step 1,
the advertisement, before anything has been said.

**And chasing him is actively expensive.** The only way to get past his category
of objection is to soften the pain line, and softening the pain line is what
loses Ana and Derek, who are reachable. One refusal at zero probability is not
worth two conversions at 40 and 85.

**The one route that exists is not a sale to him.** Somebody he leads buys tier
four, and he appears in that person's cohort. That is a sale to the leader and
he is a passenger. Do not model it as conversion.

### Rosa, 61, Retired Midwife. Nothing Held

All nine axes at zero except Sad at 0.5. Law baseline 9.6.

> "I do not know what I would want from it. That is probably the answer."

**Fair, and she is correct.**

**The answer is none.** Do not sell to her. The free tier is the right product
for her forever and the page does not try. A product that sells to somebody with
nothing to release is selling a fear it manufactured, and on this product that is
the fastest possible way to lose the thing that makes it worth anything. She is
3.0 percent of the panel as segment S15 and she is worth nothing and should be
worth nothing.

---

## 6. The Practitioner Path

### The Ruling It Has To Satisfy

A practitioner seeing somebody's somatic and psychological self report is a
consequential grant. It needs explicit consent, a visible list of who has
sight, and revocation. Never a silent default. Ruled.

What a lead sees is already narrower than what they own, and `plan.js` carries
it as data:

    LEAD_SEES     fetters, saboteurs, complexes, hyper complexes, analytics
    LEAD_HIDDEN   the story cloud, the spiritual material, the tools themselves

The story never crosses, because the story is the person's own words.

### How It Is Sold Without The Consent Becoming A Checkbox

**The design answer is structural and it is one sentence: the person who
consents is not the person who is buying.**

A practitioner buying tier four is not buying sight of anybody. They are buying
an empty panel. The panel fills only when a different person, in their own app,
on their own screen, performs a separate act. There is no purchase flow to click
past, because the consent is not in the purchase flow at all. That is what makes
it not a checkbox, and it is the only design that does.

The mechanics that hold it up:

1. **Tier four is flat, not per head.** The practitioner has no financial
   reason to harvest consent and no financial reason to avoid inviting somebody.
   Per client pricing makes a practitioner count heads before inviting, which
   gives them a stake in the answer. That is the commercial argument and it is
   also the consent argument, which is why the pricing decision sits inside this
   section rather than section 3.
2. **The invitation is a request, in the person's own app**, naming the
   practitioner, listing the five things they would see and the three they would
   not, in those words, and for how long.
3. **A grant has a duration.** Ninety days, renewed by the person, never
   automatically. A grant that renews itself is a checkbox with a timer on it.
4. **A standing list in the profile.** Who has sight, since when, until when,
   one control to end it. Ending it is immediate and needs no reason and asks
   for none.
5. **The practitioner's panel shows each grant's end date too.** So renewal is a
   conversation rather than a silence, and the practitioner carries the expiry
   rather than discovering it.
6. **Sorted by what needs attention, never by who is ahead.** Ruled, and it is
   the difference between a panel and a leaderboard.

### The Sales Line, And It Is Literally True Of The Architecture

> You are not buying their data. You are buying a place for it to arrive if
> they send it.

That sentence is the offer, and a practitioner can repeat it to a client
without softening it, which is the test `RESEARCH-icp.md` says Sofia applies.

### The Price, In Her Budget's Own Unit

    tier four, a year                                  1,188
    one client at 150 an hour, eight sessions          1,200
    twelve clients at 150, four sessions a month       7,200 a month turnover
    99 against that                                    1.4 percent

Said once, not three times: *one retained client pays for a year of it.*

**Per practitioner, flat, up to twelve led. A second seat at ninety nine beyond
twelve.** Twelve is the number in the repo's own worked example and it is a real
caseload rather than a made up bracket.

**Hold ninety nine and instrument it from the first paying practitioner.**
`DESIGN-economics.md` shows forty nine earning half as much again against the
panel's practitioner segment, and it also shows why that curve is the wrong one:
the panel's fifty eight is a personal willingness to pay taken as a consumer,
and tier four carries a client book. Ninety nine is also what stops tier four
being bought by people who do not lead a cohort. That is worth more than the
difference. It is the one price the model cannot settle and only take rate can.

---

## 7. The Revenue Model, Four Spend Levels, One Quarter

**Nothing in this section is a forecast.** Every input is labelled. The two
external benchmarks are named as from elsewhere and are not this product's
numbers.

### The Assumptions, All Seven, Labelled

| | Assumption | Value | Where it comes from |
|---|---|---|---|
| A1 | Paid social CPM, US 35 to 55, self development interest | 20 | **External benchmark, from elsewhere.** General industry reporting. Not measured on this product. Real range roughly 15 to 25 |
| A2 | Outbound click rate on cold paid social | 1.2% | **External benchmark, from elsewhere.** Real range roughly 1.0 to 1.5 |
| A3 | Share of people reached who pay inside sixty days | 1.48% | **This repo, simulated.** `PANEL-10k.md` scenario B, 148 payers per 10,000 reached |
| A4 | Cold paid traffic converts at this multiple of the panel rate | 0.6 | **Mine.** The panel is explicitly weighted by willingness to pay *and* ability to find the product. Cold paid traffic has neither |
| A5 | Tier mix among payers, on 12/24/36/99 | 55 / 28 / 12 / 5 | **Mine**, placed against the segment medians in `PANEL-10k.md` |
| A6 | Referral: arrivals per new payer in month one, then per payer per month; conversion of a referred arrival | 3, then 1; 4% | **Mine.** The softest assumption here and the one the model is least sensitive to. Sensitivity shown below |
| A7 | Monthly logo churn | 12% | **Mine**, against an external band of 8 to 15 percent for consumer subscription apps, named as from elsewhere. Taken at the high end because a complete free tier makes downgrading easy, which raises churn rather than lowering it |

### The Unit Economics, Before Any Spend Level

    cost per landing page arrival = (CPM / 1000) / CTR
                                  = (20 / 1000) / 0.012
                                  = $1.67

    paying share of arrivals      = 1.48% x 0.6
                                  = 0.888%

    cost per paid payer           = 1.67 / 0.00888
                                  = $187.69

    ARPU = 0.55(12) + 0.28(24) + 0.12(36) + 0.05(99)
         = 6.60 + 6.72 + 4.32 + 4.95
         = $22.59

For context, and it is the reason I derived ARPU from a stated mix rather than
taking one: `DESIGN-economics.md` gives 16.67 per payer and `PANEL-10k.md`
gives 25.35. They disagree by 52 percent. 22.59 sits between them and the mix
is printed so it can be argued with.

**The number that matters more than any of the four spend levels:**

    LTV at 12 percent churn = 22.59 / 0.12 = $188.25
    CAC                     = $187.69
    LTV / CAC               = 1.00

**Paid acquisition, on these assumptions, breaks exactly even and earns
nothing.** That is the finding and it governs everything below.

| Churn | Mean life | LTV | LTV / CAC |
|---|---|---|---|
| 15% | 6.7 months | 151 | 0.80 |
| 12% | 8.3 months | 188 | 1.00 |
| 9% | 11.1 months | 251 | 1.34 |
| 6% | 16.7 months | 377 | 2.01 |
| 4% | 25.0 months | 565 | 3.01 |

The conventional floor for paid acquisition is LTV over CAC of 3, which is an
**external rule of thumb from elsewhere** and not this product's. To clear it
either churn falls to 4.0 percent, or cost per payer falls to 62.75, which at
this conversion rate implies a CPM of 6.69. That CPM is not reachable on paid
social. **So paid advertising alone does not work on this product, at any spend
level, and the spend levels below are presented in that light rather than as
four options of which one is right.**

### The Four Levels

Spend is divided evenly across three months. Referral is layered per A6 and
churn per A7. Full working is reproducible; the arithmetic per month is
`payers = payers x (1 - churn) + paid new + referred new`.

#### Minimal. $3,000 For The Quarter, $1,000 A Month

    arrivals a month  = 1,000 / 1.67 = 599
    paid new a month  = 599 x 0.00888 = 5.3 payers

| Month | Paid new | Referred arrivals | Referred new | Churned | Payers at end | MRR |
|---|---|---|---|---|---|---|
| 1 | 5.3 | 0 | 0.0 | 0.0 | 5 | 120 |
| 2 | 5.3 | 21 | 0.9 | 0.6 | 11 | 246 |
| 3 | 5.3 | 29 | 1.2 | 1.3 | 16 | 363 |

    quarter revenue collected   $729
    spend                     $3,000
    net                      -$2,271
    exit MRR                    $363

#### Small. $15,000 For The Quarter, $5,000 A Month

    arrivals a month = 2,994      paid new a month = 26.6 payers

| Month | Paid new | Referred arrivals | Referred new | Churned | Payers at end | MRR |
|---|---|---|---|---|---|---|
| 1 | 26.6 | 0 | 0.0 | 0.0 | 27 | 602 |
| 2 | 26.6 | 107 | 4.3 | 3.2 | 54 | 1,228 |
| 3 | 26.6 | 147 | 5.9 | 6.5 | 80 | 1,815 |

    quarter revenue collected  $3,644
    spend                     $15,000
    net                      -$11,356
    exit MRR                   $1,815

#### Medium. $60,000 For The Quarter, $20,000 A Month

    arrivals a month = 11,976     paid new a month = 106.6 payers

| Month | Paid new | Referred arrivals | Referred new | Churned | Payers at end | MRR |
|---|---|---|---|---|---|---|
| 1 | 106.6 | 0 | 0.0 | 0.0 | 107 | 2,407 |
| 2 | 106.6 | 426 | 17.0 | 12.8 | 217 | 4,911 |
| 3 | 106.6 | 588 | 23.5 | 26.1 | 321 | 7,260 |

    quarter revenue collected  $14,578
    spend                      $60,000
    net                       -$45,422
    exit MRR                    $7,260

#### Large. $200,000 For The Quarter, $66,667 A Month

    arrivals a month = 39,920     paid new a month = 354.5 payers

| Month | Paid new | Referred arrivals | Referred new | Churned | Payers at end | MRR |
|---|---|---|---|---|---|---|
| 1 | 355.2 | 0 | 0.0 | 0.0 | 355 | 8,024 |
| 2 | 355.2 | 1,421 | 56.8 | 42.6 | 725 | 16,369 |
| 3 | 355.2 | 1,961 | 78.4 | 87.0 | 1,071 | 24,200 |

    quarter revenue collected  $48,593
    spend                     $200,000
    net                      -$151,407
    exit MRR                   $24,200

### Summary

| Spend | Quarter revenue | Net in quarter | Exit MRR | Payers at end |
|---|---|---|---|---|
| Minimal, 3,000 | 729 | -2,271 | 363 | 16 |
| Small, 15,000 | 3,644 | -11,356 | 1,815 | 80 |
| Medium, 60,000 | 14,578 | -45,422 | 7,260 | 321 |
| Large, 200,000 | 48,593 | -151,407 | 24,200 | 1,071 |

**Every level is cash negative in the quarter and that is arithmetic, not
pessimism.** An 8.3 month payback cannot be recovered in a three month window.
At constant medium spend cumulative break even arrives at month 24.

### The Two Sensitivities That Matter

**Referral, A6, the softest assumption.** Medium spend, first quarter, exit MRR:

| Arrivals per new payer | 2% convert | 4% convert | 8% convert |
|---|---|---|---|
| 1 | 6,617 | 6,852 | 7,345 |
| 3 | 6,809 | 7,260 | 8,254 |
| 6 | 7,113 | 7,930 | 9,848 |

The spread across the whole grid is 49 percent. Real, but it does not change
any decision, which is the useful thing to know about the weakest assumption in
the model.

**Churn, A7, the assumption that decides the business.** Medium spend, twelve
months:

| Churn | Payers | MRR | Net at month 12 |
|---|---|---|---|
| 6% | 1,321 | 29,848 | -42,671 |
| 9% | 1,130 | 25,522 | -62,190 |
| 12% | 972 | 21,966 | -79,074 |
| 15% | 843 | 19,037 | -93,711 |

Halving churn from 12 to 6 is worth 36 percent more MRR and 46 percent less
cash burned. **Nothing on the acquisition side comes close to that. Churn is the
whole business and it is a design problem, not a marketing one.**

### The One Paid Channel That Clears The Bar

Practitioners, and it is not close.

    tier four LTV at 6 percent churn          99 / 0.06   = $1,650
    plus 3 referred clients at 12, 12 percent 36 / 0.12   =   $300
    combined LTV of one practitioner                      = $1,950

| Practitioner CAC | LTV / CAC |
|---|---|
| 200 | 9.75 |
| 400 | 4.88 |
| 800 | 2.44 |
| 1,200 | 1.63 |

Six percent practitioner churn is mine, argued from the fact that a
practitioner's panel holds other people's grants and leaving costs her a tool
her clients are inside, not only a subscription. Three referred clients per
practitioner is also mine and is conservative against `PANEL-10k.md`, which
puts practitioners plus the clients they refer at 6.0 percent of the panel and
33.5 percent of revenue.

**A practitioner can be acquired for eight hundred dollars and still clear the
conventional floor.** A consumer cannot be acquired for sixty three. That is the
entire allocation recommendation and it agrees with `RESEARCH-icp.md`, which
already found that five of the seven who would arrive name a person rather than
an advertisement.

**The recommendation.** Take the minimal spend level as the paid line, hold it
there, and put the rest of the budget into the two things the arithmetic
actually rewards: the referral mechanic at fifty patterns capped at four a
month, and direct practitioner acquisition through channels where a
practitioner is reachable as a professional rather than as a consumer. The
advertisement is the backstop. It is not the engine, and at LTV over CAC of
1.00 it cannot be made into one by spending more on it.

---

## 8. What Would Be Dishonest To Sell, And Is Therefore Off The Table

Fourteen. None of these is a preference.

1. **Sight.** A person's own reading, at any tier, ever. Ruled, and commercially
   correct. It is the one mechanic that would have withheld somebody's own body
   from them in order to sell it back.
2. **An outcome.** "Two years of therapy." "Clear your anxiety." "Heal your
   trauma." Throughput only, at the conservative end of the book's own rate, and
   the word is "as many patterns as", never "the same as" and never "instead
   of".
3. **A countdown, a limited time price, a strikethrough, a price that moves if
   you leave the page, a "most popular" badge on the middle rung.** In this
   category these are disqualifying rather than distasteful. There is no version
   of this product that survives being caught doing one.
4. **A card up front trial that converts by being forgotten.** The gift is the
   trial and it is larger.
5. **A streak, a loss frame, or any "you are losing patterns" line.** Diane
   carries Anticipation at 8. Derek raced on a stress fracture. A product that
   reads a nervous system does not run loss aversion on it. The allowance banks;
   it does not expire; and no surface may imply otherwise.
6. **A rank of people by coherence, sold as a feature.** Ruled. It is also the
   one thing that would make James corrupt his own answers.
7. **Anybody's data.** Ruled, and it is the strongest line in `DECISIONS.md`.
   Extended, because this is where a funnel breaks it by accident: **no
   advertising pixel on the result page, no lookalike audience built from any
   record, no retargeting segment keyed to a band or a score.** A retargeting
   pixel on a result page is selling the data sideways whether or not money
   changes hands for it, and it is exactly the mistake Google Fonts already was.
8. **The record carrying anything it does not need.** No customer id,
   subscription id, email, key, secret or token. `validateProfile` refuses them
   outright and the build is swept for `sk_`, `pk_`, `cus_`, `sub_`. That is a
   commercial rule as much as a technical one, because it is the sentence Sofia
   repeats to a client.
9. **Selling to somebody in the bottom two bands at the moment of their
   reading.** They get the referral to a licensed clinician the book instructs.
   They do not get a price page. Ana is the reason this is a rule.
10. **Selling to Rosa.** A person with nothing held is being sold a fear the
    product created for the purpose.
11. **Per client practitioner pricing.** It taxes the referral channel that is
    the best one the product has, and it gives a practitioner a financial stake
    in a consent that is not hers to give.
12. **One dollar a pattern as a published price.** Ruled internal. It is a value
    story and printing it as a price makes a division trivial that reads as a
    discount nobody believes.
13. **A count against a total.** "18 of 112 addresses carrying." Ruled out, and
    it is also the number that turns a reading into a progress bar on a person.
14. **Two months free.** Withdrawn by the owner. Any copy still carrying it
    comes out, including in `BUYERS.md`, which still names it as open.

---

## 9. The ICP Simulation Rounds

The offer was run against the nine, revised, and run again until the panel's
answer stopped improving. Four rounds. **Every quotation is simulated.**

Rounds 1 through 4 all assume the upstream fixes already recommended in
`RESEARCH-icp.md` have landed: the score shown on the web before any install,
mechanical words at the low bands, the identification interval on the result
page, and the anatomy framed as a coordinate system. Without those, eight of
nine walk before a price is ever shown and this exercise would be scoring
somebody else's work rather than the offer.

"How long" is months of continued payment, simulated.

### Round 1. The Offer As It Stands In The Repo

12 / 29 / 59 / 99. The plan panel as built. The picker as built.

| Who | Pays | Tier | Months | Why |
|---|---|---|---|---|
| Diane | No | | | Given a pattern count. She asked what it is at nine on a Tuesday |
| Derek | No | | | Rate rises with the tier. Picks one address, charged twenty five |
| Marcus | No | | | Same, found in under a minute. "Your bulk discount runs backwards" |
| Angela | Yes | one | 3 | Converts on the reading. Nothing in the ladder speaks to her, so she lapses |
| Sofia | No | | | Per client unanswered. Retrieval rule unanswered |
| James | No | | | No price in the product. Button says "Move to tier one" with no number |
| Ana | Not sold to | | | By rule |
| Gordon | No | | | Not convertible |
| Rosa | No | | | By design |

**1 of 9. Mean 3.0 months across payers.**

### Round 2. The Revision

12 / 24 / 36 / 99 at a flat three cents, printed. The cadence table. The picker
charging what it quotes. The price on the page and on the button. Annual at
twelve times with no discount and the reason stated. No trial, the gift named as
the trial. Tier four flat to twelve led. Consent as a separate act by a separate
person, ninety day grants.

| Who | Pays | Tier | Months | Why |
|---|---|---|---|---|
| Diane | Yes | one, 12 | 8 | "A release every other day, fifty four seconds each." No streak |
| Derek | Yes | two, 24 | 6 | Flat rate printed by us. At risk at month 6 on the horizon division |
| Marcus | Yes | one, 12 | 4 | Converts on evidence that somebody looked. Correctly short |
| Angela | Yes | one, 12 | 3 | Unchanged. Cadence first helps; the ladder still is not her unit |
| Sofia | Yes | four, 99 | 12 | Flat to twelve answers the price. Conditional on the one time code |
| James | Yes | three, 36 | 5 | Price on the page, code not address. Wants a rank, does not get one |
| Ana | Not sold to | | | |
| Gordon | No | | | |
| Rosa | No | | | |

**6 of 9. Mean 6.3 months.** The offer moved from 1 to 6. The whole of that
movement is in three things: the picker charging what it quotes, the rate being
flat enough to print, and the price being on the page.

### Round 3. Fixes From Round 2's Objections

Added: the page never prints a lifetime horizon beside a monthly price, which
answers Derek. James is offered a comparison against his own first reading
rather than against other people. The upgrade conversation for Angela is
rewritten from volume to depth, because identification rises with held
addresses and that is measured in the engine rather than claimed. A lapsing
person is told once, and only once, that rerunning what they opened is free
forever.

| Who | Pays | Tier | Round 2 | Round 3 | What moved it |
|---|---|---|---|---|---|
| Diane | Yes | one | 8 | 8 | Unchanged |
| Derek | Yes | two | 6 | 9 | Horizon and rate never share a screen |
| Marcus | Yes | one | 4 | 4 | Unchanged, and deliberately. A hook would lose him |
| Angela | Yes | one | 3 | 5 | The reading sharpens as ground opens, and that is checkable |
| Sofia | Yes | four | 12 | 12 | Unchanged. Blocked on the one time code, not on the offer |
| James | Yes | three | 5 | 8 | A comparison against himself, which is a measurement |
| Ana | Not sold to | | | | |
| Gordon | No | | | | |
| Rosa | No | | | | |

**6 of 9. Mean 7.7 months.** Up 1.4 months on round 2.

### Round 4. Confirming It Has Stopped

Tried: a lapse recovery beyond the single rerun line, a reason for Marcus to
stay, a second annual framing, a middle rung highlight.

| Who | Round 3 | Round 4 | Note |
|---|---|---|---|
| Diane | 8 | 9 | The rerun line, said once, is worth a month |
| Derek | 9 | 9 | Blocked on the owner's ruling about child fetters collapsing |
| Marcus | 4 | 4 | Everything that would extend him is a hook. Refused |
| Angela | 5 | 5 | Unchanged |
| Sofia | 12 | 12 | Blocked on the one time code |
| James | 8 | 8 | Unchanged |

**6 of 9. Mean 7.8 months.** An improvement of 0.16 months, which is inside the
width of a simulated panel and is not a result.

The middle rung highlight was tested and rejected rather than dropped. It moved
two of six toward tier two and it is a nudge, which puts it on the forbidden
list in section 8. A number that improves on a panel and breaks a rule is not an
improvement, it is a proposal to change a rule, and I am not proposing it.

### Where It Stopped, And What Is Still Holding It

**Three rounds of revision. The panel's answer stops improving at round 3 and
round 4 confirms it.**

Six of nine pay. Of the three who do not: Ana is refused on purpose, Rosa
correctly has no need, and Gordon is not convertible and no path was invented
for him.

Two of the six carry a condition that is not mine to close:

- **Sofia is conditional on the one time code**, `TASKS.md` section B. She is
  the highest value entry in the roster and the practitioner channel is the only
  paid channel in section 7 that clears the floor. This is the most expensive
  open item in the product.
- **Derek is conditional on the owner ruling whether clearing a parent fetter
  collapses its children.** Until then the page rule holds and the horizon does
  not appear beside a price, which is a workaround rather than an answer.

---

## 10. The Brief For The Page Builder

One page. Exactly what the page must say commercially, and nothing about how it
looks, which is not mine.

### The Order Of The Page

1. **The claim.** *You are still paying for every charge you never released.*
   Second person, present tense, mechanical, no wellness word, nothing the
   engine cannot defend. It is already the strongest line in `RESEARCH-icp.md`
   and it does not need replacing.
2. **What it does**, in one sentence and without the word help, which four of
   eight ICPs reject: *it names where the charge is held, what holding it costs,
   and gives you the sentences that release it, one address at a time.*
3. **The test.** Sixty three questions, fifteen minutes stated up front, a
   visible remainder, resumable. One line explaining that every law is asked
   three ways because what you do when it costs you and what you do when nobody
   is watching are different numbers, and the gap is the reading.
4. **The score, on the web.** With its band, its cost line, and its
   identification interval. Before any install. This is the promise and it is
   paid here.
5. **The gift.** A hundred patterns. Four complete releases. The whole reading.
   No card. This is what the install is for.
6. **What is free forever**, in full, as the list in section 2. The length is
   the argument.
7. **The one thing a tier buys.** *The only thing a tier buys is how fast you
   may open ground you have not opened. Everything else is on every tier,
   including free.*
8. **The prices.** 12, 24, 36, 99. One row, monthly, cadence under each.
9. **The rate, printed by us.** *Three cents a pattern at every rung. It does
   not go up when you buy more.*
10. **Annual.** One payment instead of twelve, at the same price. The allowance
    still arrives monthly, because it is a pace.
11. **No trial.** *You get a hundred patterns and you never enter a card to get
    them.*
12. **The data line.** We never sell anybody's data. The name never leaves the
    device. A key replaces it, and the key is not held beside the name. The
    record and the story are never held joined.
13. **The practitioner block**, its own section, not a rung on the consumer row.
    *You are not buying their data. You are buying a place for it to arrive if
    they send it.* Flat to twelve led. One retained client pays for a year.

### The Exact Price Copy

    Free, for life          The whole reading. A release every two and a half
                            weeks. Rerun anything you have opened, forever.

    One          12 a month  A release every other day
    Two          24 a month  A release a day
    Three        36 a month  Three releases every two days
    Four         99 a month  Three releases every two days, and the people you
                             lead. Up to twelve.

    Three cents a pattern at every rung. It does not go up when you buy more.
    Annual is twelve times the monthly. There is no discount and the allowance
    still arrives monthly, because it is a pace.

### What The Page Must Not Do

The full list is section 8. The five that a page builder will reach for without
meaning to:

- No countdown, no limited time, no strikethrough, no "most popular" badge.
- No advertising or analytics pixel on the result page, and no retargeting
  segment keyed to a band or a score.
- No lifetime horizon figure, and no age times two hundred, on the same screen
  as a price.
- No count against a total. Never "18 of 112".
- No outcome claim. Throughput only, at the conservative end.

### The Three Things That Must Ship Before The Page Goes Live

**One. The picker must charge what it quotes.** Measured: every setting costs
twenty five. `meterPlan` at `atuned_src/engine/schema.js:374` treats the cap as
a fill target and `DECISIONS.md` rules it "at most". Until this is fixed the
cadence table on the page is not true and the product's first contact with the
meter is a mis-quote.

**Two. The plan panel must know what tier the person is on.** It prints "On:
Free" while the gift is in force.

**Three. `planUpgrade` must be able to describe tier four.** It currently
returns "the same ground" for the one rung with a ruled price.

None of the three is large and all three are in the seam between what the engine
stores and what a person is told, which is exactly where a commercial promise
gets broken by accident.
