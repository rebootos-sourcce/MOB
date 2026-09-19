# The web funnel. Strategy and positioning

Theo Lindqvist, marketing. 19 September.

What the page has to do, who it is aimed at, and what it may not say. The page
itself is somebody else's build. This decides what it is built from.

**Every quotation in this file is simulated.** Nothing here was said by a real
person. The ICP reactions are model output over the charge vectors and law sets
in `atuned_src/engine/data/people.js`, run as a script, not written by feel. Any
benchmark taken from outside this repo is labelled as from elsewhere. There are
no invented market statistics.

Numbers measured here against `engine.js` rather than relayed:

    quiz only, 0 of 21 laws      identification 20.8 percent, plus or minus 19.3
    quiz only, 21 of 21 laws     identification 48.8 percent, plus or minus 13.3
    James, full profile          identification 79.0 percent
    the quiz is                  63 questions, iqList().length

---

## 1. The promise

The problem stated plainly. The product reads charge out of a story and shows
where it sits in the body and what it costs. Said one way it is a wellness app.
Said another it is science fiction. Both readings kill it in four seconds, and
four seconds is all the page gets: Marcus, weight 160, says he can see what is
wrong with anything in four seconds, and that is his `says` line, not a flourish.

The escape is the category word. **Instrument, not app.** An instrument is
allowed to be strange, because an instrument is judged on whether it reads, not
on whether it comforts. It is also the word the product already uses about
itself in `BIBLE.md`, so the page is not inventing a position, it is stating one.

### Candidate one. The ledger

    Tell it what happened and it reads the load out of your own words, names
    where in the body you are holding it, and what the holding costs.

Complete and mechanically defensible. Every clause is something the engine
computes. It is 24 words, which is past four seconds, and the first three words
are an instruction rather than a claim, which is weak at the top of a page.

### Candidate two. The cost, sharpened

    You are still paying for everything you never put down.

Eight words. Present tense, second person, cost frame, a physical metaphor, and
not one wellness syllable. This is the strongest single line on the page. It is
the wrong promise because it makes a claim about the reader before the
instrument has measured anything, which is the exact move Marcus catches, and it
does not say what the product is. A stranger who reads only this does not know
whether they are being sold a book, a course or a diagnostic.

### Candidate three. The instrument, named

    An instrument that reads what you are still carrying, where it sits in the
    body, and what it costs you to hold it.

Names the category in word two. States the three outputs in the product's own
order, which is the order `COPY.md` already rules for a reading: say the number,
then what it means, then what it costs. Makes no claim about the reader. Every
clause is checkable inside the product.

### The pick

**Candidate three is the promise.** Candidate two goes directly under it as the
second line, where it is earned by the sentence above it rather than asserted
cold.

    An instrument that reads what you are still carrying, where it sits in the
    body, and what it costs you to hold it.

    You are still paying for everything you never put down.

Why three over one: one is an instruction and the page has not earned the right
to instruct yet. Why three over two: two is a verdict delivered before a
measurement, and this product's whole trust position is that it never does that.
The opening screen inside the app already refuses to print a band word to
somebody who has entered nothing. The page must hold the same line or the page
contradicts the product on the first screen.

Voice check against `BIBLE.md`: no em dashes, sentence case, no soft wellness
language, physical metaphors only, no count against a total, no 108, does not use
the word help.

---

## 2. Who first

### The finding that decides it

The nine ICPs do not sit where the buyer resonance grid says the money is, and
nobody appears to have checked. Computed against `engine.js`, loading each
persona's own domain, archetypes, charge vector and law set:

| ICP | Weight | CQ, full profile | Band | Grid level | Grid buy probability |
|---|---|---|---|---|---|
| Diane | 180 | 28.1 | Corrupt | 3, Defensive | 20 percent |
| Derek | 170 | 15.0 | Severe | 2, Numb | 10 percent |
| Marcus | 160 | 39.2 | Incoherent | 4, Frustrated | 40 percent |
| Angela | 150 | 40.9 | Incoherent | 4, Frustrated | 40 percent |
| Sofia | 140 | 56.6 | Even | 6, Receptive | 65 percent |
| James | 100 | 12.0 | Severe | 2, Numb | 10 percent |
| Ana | 50 | 7.6 | Collapsed | 1, Fragmented | 0 percent |
| Gordon | 35 | 0.8 | Collapsed | 1, Fragmented | 0 percent |
| Rosa | 15 | 100 | Mastery | 10, Sovereign | 100 percent |

Weighted against the grid's own column, the panel converts at 29.3 percent. Not
one ICP sits at level 7, 8 or 9, which is where `BUYERS.md` says the product
sells hardest. The only person in the roster at a high level is Rosa, who is
weight 15 and correctly has no reason to buy anything.

**The resolution, and it is the single most useful thing in this document.** The
grid conflates two axes. Its level names describe a *posture toward the problem*:
the creative under load, the practitioner, the engineer, the systems hacker. Its
level *numbers* are CQ bands, which describe a *state*. The engine's own ICP data
proves they are not the same thing. Marcus is the grid's level 7 word for word,
"actively troubleshooting your own bottlenecks, pragmatic, execution focused"
against "I can see what is wrong with anything in four seconds", and he reads
CQ 39.2, which is level 4.

That matters because **CQ is not targetable.** You cannot know a stranger's
coherence before they take the quiz. On a cold click the only thing that exists
is posture. So the grid is a post-quiz segmentation instrument and it is not a
targeting instrument, and a funnel built by aiming at CQ bands is built on a
number that does not exist yet at the moment of the click.

The page targets posture. Posture is: does this person troubleshoot themselves,
or do they want to be comforted. That is the one split the first screen can act
on, and it is the split between levels 6 and 7 on one side and 4 and 5 on the
other.

### The beachhead

**Marcus, 44, creative director. Grid level 7 by posture, the creative under
load. Weight 160.**

Five reasons, in order of weight.

**One. The grid picks him.** Level 7 is 85 percent, and `BUYERS.md` states in its
own words that it is the best combination of size and conversion. Marcus is the
only ICP in the roster whose role is the grid's level 7 description verbatim.

**Two. He is the highest gate in the set.** The simulation in section 8 shows a
page that clears Marcus has already cleared Diane, Derek and James as a side
effect, because his gates are supersets of theirs. Building to the highest gate
gives one page instead of four. Building to Angela first gives a page Marcus
closes in four seconds, and Angela is 150 against his 160.

**Three. He is not blocked on an owner ruling.** Diane at 180 and Derek at 170
outweigh him, and both hit open items. Derek performs the pattern arithmetic
unprompted, age times two hundred against the tier rate, and gets twenty four
years of subscription. `DECISIONS.md` names that as open and the owner's. Diane
needs the cost line, which is buildable, but she also needs the quiz not to read
as another practice she can fail at, which touches the ladder. Marcus needs three
copy decisions and no rulings.

**Four. He is a channel.** Five of seven arriving ICPs name a person and not an
ad. A creative director who respects the craft of a page shows it to other
creative directors. Referral is the engine here and the ad is the backstop.

**Five. Cheapest to serve.** He wants the raw result, no video, no framing
screen, no warmth. That is the version that ships.

### Second wave, and it is where the money is

**Sofia, 41, somatic practitioner. Grid level 6 by measurement, CQ 56.6. Weight
140.** She is the only ICP whose measured band and whose posture land on the same
grid level, and she carries a client book. The arithmetic in section 5 says paid
acquisition never pays for itself against a twelve dollar consumer rung and pays
for itself easily against the ninety nine dollar practitioner rung. So Marcus is
the beachhead for the *message* and Sofia is the beachhead for *spend*. They are
not the same person and the page needs one line for her, not a section.

She is second and not first because both her gates are blocked: the retrieval
code is M5 work and unbuilt, and whether a practitioner seat is per practitioner
or per client is named open in `DECISIONS.md`. A beachhead you cannot serve is
not a beachhead.

### Who the page is not for, stated so nobody softens it later

Levels 1 to 3 are not the market. Gordon holds Fear, Anger, Shame and Disgust all
at 10 with nothing installed and every law between 1 and 3. Any frame implying he
carries something is refused at the ad, and softening the frame to reach him
loses Derek and Ana, who are the two people it would actually serve. Rosa holds
nothing. Marketing at either is unkind and does not work.

Levels 4 and 5 are the largest population and the page does not write its top for
them. At 4 the work hurts, at 5 it is not mystical enough. They arrive anyway and
the page should not repel them, but no headline is tuned to them.

---

## 3. The funnel shape

### The quiz is the middle, not the top. Defended

Four of six ICPs read this as a lead magnet before it has said anything. That is
the default read of any quiz on the internet and the product does not get to opt
out of it. A quiz at the top of the funnel cannot break that read, because the
quiz *is* the pattern being recognised.

The thing that breaks it is the instrument, working, on somebody who is not you.
That already exists and already renders: thirteen worked cases ship in
`people.js`, boot in the live app, and produce a whole reading with nothing
entered. For an instrument, a reading is the best marketing there is, and this
one costs nothing to ship because it is built.

Three arguments for the middle:

1. **A fifteen minute, 63 question ask is by definition a middle of funnel ask.**
   Nothing on the internet opens with fifteen minutes.
2. **The demo answers the objection the quiz raises.** Marcus's break is the join
   between a questionnaire and a body. Showing the instrument first, with its own
   identification number on screen, answers that before the quiz asks for it.
3. **The quiz is the highest intent step in the product.** Putting the highest
   intent step first wastes it on traffic that has not qualified itself.

So: top of funnel is a live reading. Middle is the quiz. Bottom is the install
and the tier.

### The funnel, with the drop at every step

Model output over the weighted panel. Steps 4 and 5 use the completion figure
measured on the panel in `RESEARCH-icp.md`, 68 percent under three stated
conditions. Step 2 uses a cold landing bounce benchmark **from elsewhere**,
commonly 40 to 60 percent. Everything else is this model and is labelled.

| # | Step | Of 1,000 | Drop | Why it drops there |
|---|---|---|---|---|
| 1 | Cold click lands | 1,000 | | |
| 2 | Still there at four seconds | 520 | 48 percent | Bounce. Benchmark from elsewhere. The promise and the live reading are the only defence |
| 3 | Opens the live case reading | 310 | 40 percent | The demo has to look like an instrument, not a template. This is Marcus's step |
| 4 | Starts the quiz | 210 | 32 percent | Fifteen minutes is a real ask. Stated duration is what makes it survivable |
| 5 | Finishes all 63 | 143 | 32 percent | 68 percent completion, panel figure, conditional on duration stated, remainder visible, resumable, three way design named in one line |
| 6 | Sees score, band, cost line, identification interval, on the web | 143 | 0 percent | **The fix.** No email, no install. The number was the promise and it is paid here |
| 7 | Keeps the record. Email plus one time code | 86 | 40 percent | Some people take the number and go. That is fine and they are the referral |
| 8 | Installs and claims the record | 54 | 37 percent | The gift of 100 patterns is the argument, not withholding |
| 9 | Spends the gift, four runs | 38 | 30 percent | Activation. The practice loop has to close or this is where it ends |
| 10 | Pays a tier | 7 | 82 percent | |

**Click to paid, 0.7 percent.** That is the number the whole page is judged on.

The step that used to cost the most was step 6 as written in `TASKS.md` section
B: download the app to see your score. That costs 69 of 121 people who had
already answered 63 questions and handed over an address. It is the largest loss
in the funnel and it is self inflicted. Moving the number to the web is the
single highest value change and it is copy plus one page, not architecture.

The largest remaining loss is step 10, and it is honest. It should not be
disguised.

---

## 4. What they are told, first, second and third

The page's argument order. Everything else is arrangement.

### First. The instrument, working, on somebody who is not you

The promise sentence. Under it the second line. Under that, a live reading of a
named case, rendered by the real engine, with its identification percentage
visible in the corner the way it is visible inside the app.

Not a claim. Not a benefit list. Not a video. A working instrument, on screen,
in four seconds.

This is Marcus's whole step, and it is also the answer to "is this a template".
It is the only opening that cannot be faked by a competitor, because the
competitor does not have thirteen worked readings that render.

### Second. What it costs you

Now the cost frame, in four short lines, the mechanism stated plainly:

    Emotion is charge.
    Charge that does not leave has to be held somewhere.
    There are 112 places in you where it sits.
    Holding it costs, and the cost is measurable.

This is the turn from an insight funnel to a cost funnel. The insight funnel says
find out who you are, which is the sixteen letter product that four of six ICPs
reject in four different sentences. The cost funnel says find out what you are
paying. Same 63 questions, same result page, different promise.

The cost frame is what carries Diane, who holds Anticipation at 8 with Apathy
installed at 9.2 and cannot stop. An insight is one more thing to do. A cost is a
number she already manages.

### Third. What it knows, and what it does not

Proof before the ask, and the limit stated before it is discovered.

    Answering all 21 laws puts identification at 48.8 percent, plus or minus
    13.3. Telling it what happened is what moves that number, and a full
    profile runs near 79.

    The 112 addresses are a coordinate system, not a measurement of a nerve.
    It reads 21 laws asked three ways and places the result on a body shaped
    map. It has not been near your nervous system and it does not say it has.

    Every table the reading runs on is open inside the product. A mirror you
    cannot inspect is not a mirror.

This block is the highest leverage copy on the page. `RESEARCH-icp.md` records
that Marcus, James and Diane all move from resisting to holding the moment the
identification number is shown, and that the panel does not punish a stated
limit, it punishes a limit it discovers later.

### Then the ask, in this order

Fourth, the quiz: 63 questions, fifteen minutes, stop and come back, and one line
saying every law is asked three ways because what you do when it costs you and
what you do when nobody is watching are different numbers, and the gap is the
reading.

Fifth, the number, on the web, with the cost line under it.

Sixth, what the app adds and what it costs in money, with the price on the page.

---

## 5. Channels, and what they cost

### Where the beachhead actually is

Marcus is not on interest-targeted social for wellness. That inventory reaches
levels 4 and 5, which `BUYERS.md` prices at 40 and 30 percent and describes as
the hardest sell in the product. Buying it buys the worst segment.

He is where craft is argued. Design and creative newsletters, two or three
podcasts about making things under deadline, and private group chats. Sofia is in
practitioner training lists and professional bodies. Derek is in endurance
communities. James is nowhere reachable by advertising and arrives only from a
peer.

The finding that outranks all of them, from `RESEARCH-icp.md`: five of the seven
who would arrive name a person and not an ad. **The acquisition channel is
referral carrying a number. The number is what travels.** The referral is already
ruled at fifty patterns, capped at four a month, and its marginal cash cost is
close to zero because a pattern is compute on a single HTML file with no per unit
cost.

### The arithmetic, and the number is bad

Model output. Assumptions named so they can be argued with.

    payers per 1,000 clicks          7         from the funnel above
    mix, on the recommended list     4 at 12, 2 at 29, 1 at 59
    revenue per 1,000 clicks         165 a month
    monthly churn assumption         8 percent     benchmark from elsewhere,
                                                   consumer subscription churn
                                                   commonly runs 5 to 10 percent
    mean life                        12.5 months
    lifetime value per payer         about 295
    lifetime value per 1,000 clicks  about 2,065
    allowable cost at 3 to 1         688 per 1,000 clicks
    **ceiling on a click**           **about 0.69**

**Almost no paid channel clears 69 cents a click at the consumer rungs.** Say it
plainly rather than building a plan that assumes otherwise.

The same arithmetic against the practitioner rung, where a payer is 99 a month:

    lifetime value per practitioner  about 1,238
    allowable cost at 3 to 1         about 413 per practitioner

That clears newsletter sponsorship, podcast reads and conference spend without
straining. **Paid acquisition works in this product only when it is aimed at
Sofia.** Everything aimed at Marcus has to be free or it does not pay.

### The four spend levels

**Minimal, 0 to 500 a month.** Referral only, plus the founder writing in public
about the mechanism. Cash cost near zero, the fifty pattern grant is the price.
Expect tens of clicks a month at the highest quality in the whole plan, because
each one arrives carrying somebody's number. This is the right first move and it
is not a placeholder for a real plan, it is the plan that matches the arithmetic.

**Small, 500 to 2,500 a month.** Two or three craft newsletter sponsorships,
aimed at practitioners and not at consumers. From elsewhere: niche newsletter
sponsorship commonly prices at 25 to 60 dollars CPM. At 40 CPM and a 1 percent
click rate that is 4.00 a click, which is 5.8 times the consumer ceiling and
about a tenth of the practitioner ceiling. So the creative is written for Sofia
or the spend is wasted.

**Medium, 2,500 to 10,000 a month.** Add host-read podcast placements on two
shows. From elsewhere: host-read CPMs commonly run 18 to 50. Same conclusion,
same reason. Also fund one measured thing at this level: a public write-up of the
mechanism with the formula in it. CQ is intention times integrity over
resistance, and printing the formula is a channel in this category because almost
nobody else can.

**Large, 10,000 a month and up.** Paid social to lookalikes off the converting
list. From elsewhere: consumer paid social CPCs commonly run 0.50 to 3.00, which
sits at or above the 0.69 ceiling before conversion is even considered, and the
targeting available reaches levels 4 and 5. **My recommendation is not to spend
at this level at all until the practitioner rung is instrumented and the take
rate is known.** Large spend here buys the worst segment at the worst price and
the model says it loses money on every click.

---

## 6. The proof problem

This product makes claims about a person's nervous system. On a public page, with
no testimonials, no statistics and no borrowed credibility, here is what is
actually available. Every item below is checkable by a stranger.

**One. The tables are open, and nobody else does this.** The Knowledge tab prints
every table the reading runs on: nodes, fetters, saboteurs, laws, masks, domains,
archetypes, gates, the cards, the stack, the universal laws, the glossary. The
product's own words, which should go on the page verbatim because they cannot be
improved on: *"Nothing here is held back. These are the same tables the reading
runs on, the whole structure it is built from, and it is open because a mirror
you cannot inspect is not a mirror."* This is the single strongest asset in the
whole plan. In this category everybody claims and almost nobody can show.

**Two. The instrument states its own confidence.** Identification runs 20.8
percent plus or minus 19.3 with nothing entered, 48.8 plus or minus 13.3 with all
21 laws answered, and near 79 on a full profile. Measured against `engine.js`
this session. A product that prints its own error bar next to its own headline
number is proving something about itself that no testimonial proves.

**Three. Nothing leaves the device, and it is verifiable in ten seconds.** The
build makes no outbound request at all. Google Fonts is gone and the typeface is
carried in the file. `tests/design.js` gate 7 watches the network across four
tabs and fails on any request that is not one of the two local rasters. A
stranger can open a network tab and see an empty list. Invite them to.

**Four. The reading is reproducible on somebody who is not you.** Thirteen worked
cases render live with nothing entered. A visitor can load Sofia, James or Wren
and read the whole thing. This is content that is the product rather than content
about the product.

**Five. The arithmetic is stated.** CQ is intention times integrity over
resistance, 100 when all 21 laws read 10. Print the formula.

**Six. The instrument refuses to read what it has not measured.** The opening
screen shows a dash and no band word to somebody who has entered nothing, and
says why: a number off a default is a number about the default and not about you.
Screenshot that screen and put it on the page. Refusing to produce a number is
the most credible thing a measuring instrument can do.

### What is not available and must not be manufactured

No clinical validation. No outcome study. No user count, rating or download
figure. No testimonials, because there are no customers. No practitioner
endorsements. No before and after. No comparison against a named competitor.

If the page feels thin without those, that is the correct feeling and it is
temporary. The six items above are more than most products in this category can
show, and the honest version of a thin proof section beats a fat fabricated one,
because the audience at level 7 checks.

---

## 7. What must not be on the page

### Rulings from the repo. Not preferences

- **Never sell anybody's data.** No "we may share with partners", no data clause
  written to leave a door open. The page says we never sell it, because that is
  the ruling.
- **The name never leaves the device.** No copy implying a profile is held
  somewhere under a person's name. A key replaces it.
- **Never a count against a total.** No "12 of 112 cleared", no progress bar
  against a lifetime. A reading is not a score.
- **No soft wellness language.** Not healing, journey, wellness, insights,
  transform, empower, unlock, holistic, alignment as a mood, energy as a vibe.
- **Physical metaphors only.**
- **Sentence case.** No all caps. Headers take a capital on every word, body does
  not.
- **No em dashes. Anywhere.**
- **Never say 108.** The count stated is 112.
- **Never the word help.** Four of eight ICPs reject that syllable and two of
  them are 260 of 1,000 between them. The verbs are read, locate, clear, cost.
- **No two months free.** Ruled out. No copy offers it.
- **No urgency and no scarcity.** No countdown, no limited places, no founding
  member deadline. There is no scarcity here and manufacturing one is counter
  signalling in this category: it tells a level 7 buyer the product needs a
  trick. Restraint is itself a proof.
- **No moral band word shown to a cold reader.** Incoherent, Corrupt, Severe,
  Collapsed. Measured this session, the quiz alone hands Diane "Incoherent",
  Derek "Corrupt" and James "Severe". Those are three of the four highest
  weighted ICPs receiving a moral adjective from software at the moment of the
  reveal. Mechanical words for the same arithmetic: high resistance, high load,
  high drag.
- **No video in front of the number.** A person who answered 63 questions has
  earned the number, not a preamble. Video belongs above the funnel as the ad.
- **No rank against other people.** A leaderboard turns a diagnostic into a game
  and corrupts the reading of the one ICP asking for it.

### Marketing claims that would be dishonest here, and are therefore forbidden

- **"Reads your nervous system."** It does not. It reads 21 laws asked three ways
  and places the result on a body shaped coordinate system. This is the sharpest
  break in the whole study and it comes from the beachhead.
- **"Measures your vagus nerve"** or any named nerve stated as a finding about a
  person. The anatomy is the coordinate system the instrument uses. Precision
  presented as measurement, when the measurement is a questionnaire, is precision
  as costume and Marcus names it as such.
- **"Clinically validated", "evidence based", "backed by neuroscience",
  "peer reviewed".** Nothing in this repo supports any of the four.
- **"Equal to two years of therapy", or any outcome claim.** `DECISIONS.md` rule
  one: throughput, never outcome. The safe form is "as many patterns as a year of
  fortnightly sessions would release, on our own most conservative figure".
- **Quoting the therapy equivalence at its top end only.** Rule two: the low end
  gets said. The range is one to six a session and both ends appear or neither
  does.
- **Any plant medicine equivalence.** The book gives no rate for it and a number
  invented to make a comparison look good is the first thing somebody who has
  done it will check.
- **"Cures", "heals", "treats", "fixes" anything.** Also "diagnoses", in the
  clinical sense. It is a diagnostic instrument in the engineering sense and the
  page must not let the two meanings blur.
- **Any user count, rating, download figure, testimonial or case study** until
  there is a real one with a real person's consent.
- **Any percentage improvement claim.** No "people report 40 percent less".
- **"Personalised by AI".** It is deterministic arithmetic over tables that are
  printed inside the product. Saying AI would be false and would also throw away
  the best proof asset the product has.
- **"Your data is encrypted and secure"** as a blanket reassurance. Say exactly
  what happens instead: the reading is computed in your browser, nothing is sent,
  and the one record that exists is half a kilobyte you can delete.
- **"Free trial."** There is a gift of 100 patterns and it is not a trial. A
  trial expires. The gift is spent.

---

## 8. The ICP simulation

Run as a script. Each ICP carries a set of gates derived from their charge vector
and their law set in `people.js`, plus their `says` line. A gate is a thing the
page must do, and the reason it exists is the number behind it. An ICP clicks
only when every one of their gates is met, which is strict on purpose: these are
people who close tabs.

**All reactions below are simulated.** They are the model speaking in the
persona's register, not anybody's words.

### The gates, and the data behind each

**Marcus**, Aesthetic Beauty 9.2, Humility 8.8, Truth 7.9 open. Forgiveness 2.4
and Compassion 2.8 shut at the heart. Surprise installed at 8.9. Needs the
mechanism visible in four seconds, the anatomy as a coordinate system, the three
way design named, a claim specific enough to be wrong, no video before the
number, no word help, and a page that is not a template. Forgiveness at 2.4 is
why he gets one chance.

**Diane**, Temperance 2.2 and Patience 2.6 shut, both at the sacral. Anticipation
held at 8, Apathy installed at 9.2, which is past the point where it serves.
Needs a cost promise, a stated duration, a visible remainder, resume, the number
without installing, and no implication that this is another practice.

**Derek**, Courage 9.0 and Duty 8.3 open, Temperance 1.8 and Non-Harm 2.9 shut.
Apathy installed at 9.0. Needs performance framing, stated duration, the three
way design named, a limiter named, and the pattern arithmetic stated honestly.

**Angela**, Unity 8.4 and Nature 8.1 open, Humility 2.1 and Truth 2.6 shut. Sad
installed at 9.4. Needs a framing screen before the wheel, mechanical band words,
recognition language, and the number without installing.

**Sofia**, Non-Harm 9.1 and Compassion 8.6 open, Detachment 2.4 and Temperance
3.1 shut. Anger installed at 8.6. Needs retrieval by code, the number without
installing, resume, a named practitioner path, and no wellness vocabulary.

**James**, Accountability 7.8 and Truth 6.9 open, Compassion 1.6 and Forgiveness
1.9 shut. Shock installed at 9.3. Needs the finding front loaded, the price
visible, the identification interval, retrieval by code, no word help, no deficit
framing.

**Ana**, Fear 9, Shame 9, Sad 9 held. Needs mechanical band words and a page that
says this has an end.

**Gordon**, all four of Fear, Anger, Shame and Disgust at 10, nothing installed,
every law between 1 and 3. Structurally unreachable.

**Rosa**, charge 0 across the board except Sad 0.5. Nothing held, nothing to
read. Correctly not the customer.

Gordon at 35 and Rosa at 15 mean the ceiling on this panel is 950 of 1,000, or
95 percent. Anything above that would mean the model is wrong.

### Round 1. The obvious page

An insight promise, the quiz at the top, the score behind the install, the
anatomy stated as a finding, no duration, no interval.

    weighted click-through: 0 percent, 0 of 1,000
    everybody walks

Simulated, Marcus: "A quiz above the fold and a body diagram. I have seen the
sixteen letter one. Closed."

Simulated, Diane: "You want fifteen minutes and you will not tell me it is
fifteen minutes. No."

**What it proves.** Nine for nine walking is not a bad page, it is the *default*
page. Every one of these failures is the shape a landing page takes when nobody
argues against it.

### Round 2. Position, not decoration

Promise rewritten from insight to cost. The instrument shown first, live, on a
case that is not you. Quiz moved to the middle. Duration, remainder and resume
stated. Score paid on the web. No video before the number. The word help removed
and the wellness vocabulary stripped.

    weighted click-through: 0 percent, 0 of 1,000
    still everybody walks, but the failure lists collapse

Diane is down to one missing gate. Sofia is down to two. Marcus still has three.

**What changed and what it taught me.** This is the round that would have been
declared a success in a normal review, because the page got much better and the
number did not move at all. It did not move because these people fail closed. One
unmet gate is a closed tab. That is the argument for a strict model: a scoring
average would have shown a large improvement here and it would have been a lie.

### Round 3. The trust block

Identification with its interval on the page. The anatomy reframed as a
coordinate system. The three way design named in one line. A claim specific
enough to be wrong. Price visible. The finding front loaded into the first four
minutes.

    weighted click-through: 16 percent, 160 of 1,000
    Marcus clicks

Simulated, Marcus: "It told me what it does not know before I asked. And it
called the anatomy a coordinate system, which is the first honest thing anybody
in this category has said to me. I will give it fifteen minutes."

**The beachhead is through at round 3**, and it is worth naming exactly what did
it. Not the design and not the promise. The limit, stated before he found it.

James is down to a single gate, the retrieval code, which is not a copy problem.

### Round 4. Everyone the mechanics were losing

Mechanical band words at the low end. The framing screen before the wheel,
skippable, never in front of the number. Recognition language. The limiter named.
The performance frame. The pattern arithmetic stated honestly instead of left for
Derek to compute.

    weighted click-through: 71 percent, 710 of 1,000
    Diane, Marcus, Angela, Derek and Ana click

Simulated, Derek: "It told me the number I was going to divide before I divided
it. That is the first time anybody has done that."

Simulated, Angela: "It did not call me a word. It told me what was loud and where
it sits."

Simulated, Ana: "It said this has a shape and the shape has a far side."

**This is the page that can be built today.** Everything in rounds 2 to 4 is copy,
argument order and one page move. None of it needs an engine change and none of it
needs a ruling.

### Round 5. The two hard gates

Retrieval by a one time code rather than an email address, and a named seat for a
practitioner's client book.

    weighted click-through: 95 percent, 950 of 1,000
    everyone clicks except Gordon and Rosa. That is the ceiling.

Simulated, Sofia: "I can see who can pull it back out. I will put a client near
it."

Simulated, James: "You did not make my email the key. Fine."

**Neither gate is mine.** The one time code is M5 and unbuilt. Whether the
practitioner seat is per practitioner or per client is named open in
`DECISIONS.md`. Two items, 240 of 1,000 panel weight between them, and both
belong to somebody else.

### What it took

**Five rounds.** The beachhead was through at round 3, the buildable ceiling is
round 4 at 71 percent, and the structural ceiling is round 5 at 95 percent behind
two items that are not marketing's to close.

| Round | What changed | Weighted | Who clicked |
|---|---|---|---|
| 1 | The default page | 0 percent | nobody |
| 2 | Cost promise, instrument first, quiz to the middle, number on the web | 0 percent | nobody |
| 3 | Identification interval, coordinate system, three way design, price | 16 percent | Marcus |
| 4 | Mechanical band words, framing screen, limiter, honest arithmetic | 71 percent | + Diane, Angela, Derek, Ana |
| 5 | Retrieval code, practitioner seat | 95 percent | + Sofia, James |

**What the model is not.** These are gates on taking the next step, not on
paying. A click is "would take the next step now". Nothing here predicts
conversion to a tier, and the 0.7 percent in section 3 is a different model with
different assumptions. Do not quote the 95 anywhere near a revenue forecast.

---

## 9. The brief. One page

For whoever builds the page.

**The promise, verbatim, at the top:**

    An instrument that reads what you are still carrying, where it sits in the
    body, and what it costs you to hold it.

**Second line, directly under it:**

    You are still paying for everything you never put down.

**Aimed at:** Marcus, creative director, 44. Grid level 7 by posture, the
creative under load. He can see what is wrong with anything in four seconds and
Forgiveness reads 2.4, so he gives the page one chance. Write every line as if he
is reading it. One line for Sofia, the practitioner, near the bottom.

**Not aimed at:** levels 1 to 3, and no headline is tuned to levels 4 and 5.

**The three things the page must do:**

1. **Show the instrument working on somebody who is not you, in four seconds.**
   A live reading from a real persona, rendered by the real engine, with its
   identification percentage on screen. Not a claim, not a benefit list, not a
   video. This is the only opening a competitor cannot copy.
2. **State the limit before anybody discovers it.** Identification 48.8 percent
   plus or minus 13.3 on the quiz alone, near 79 on a full profile, and the 112
   addresses named as a coordinate system rather than a measurement of a nerve.
   This one block moves three of the four heaviest ICPs from resisting to
   holding, and it is what got the beachhead through in the simulation.
3. **Pay the number on the web.** Score, band, cost line and identification
   interval in the browser, immediately, with no email and no install. Gate the
   release protocol, the wheel and the 112 addresses behind the install, where
   the gift of 100 patterns is the argument. Withholding the number is the
   largest self inflicted loss in the funnel.

**Argument order:** the instrument working, then what it costs you, then what it
knows and does not, then the ask, then the number, then the price.

**The quiz sits in the middle.** 63 questions, fifteen minutes stated, remainder
visible, resumable, and one line saying every law is asked three ways because
what you do when it costs you and what you do when nobody is watching are
different numbers, and the gap is the reading.

**Proof, and only this:** the tables are open inside the product, the instrument
prints its own error bar, the page makes no outbound request and you can check,
thirteen worked readings render live, the formula is printed, and the opening
screen refuses to read what it has not measured.

**Never on the page:** a moral band word, the word help, an em dash, 108, a count
against a total, urgency, scarcity, a rank against other people, a video before
the number, two months free, a testimonial, a user count, a statistic, a clinical
claim, an outcome claim, a named nerve stated as a finding, or the word AI.

**The commercial truth to design around:** at the consumer rungs the page cannot
pay more than about 69 cents a click. Referral is the channel. Paid spend only
pays for itself aimed at practitioners.

---

## What I need from the owner

Two items block 240 of 1,000 panel weight and neither is marketing's.

1. **The retrieval code.** Sofia and James both hold on it and Sofia is the
   entire paid acquisition case. Named in `TASKS.md` section B as not optional.
2. **Whether the practitioner seat is per practitioner or per client.** Named
   open in `DECISIONS.md`. Until it is ruled there is no practitioner line to
   write and therefore no channel that pays for itself.

And one I would like ruled before launch rather than after: **the pattern
arithmetic.** Derek performs the division unprompted and gets twenty four years.
Round 4 assumes the page states it honestly. If the ladder cannot state it
honestly, Derek at weight 170 comes back off the board.
