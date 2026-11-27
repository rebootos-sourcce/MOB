# Spec. The Alpha Feedback Instrument

Marketing seat, 19 September. Commissioned by the owner's ruling that the alpha
carries a customer feedback instrument, in two parts: a rating a person can give
in seconds, and a product questionnaire across marketing, production and
development.

His eleven questions are recorded verbatim in section 7 and every one of them
survives into the instrument. What changed is the wording, the response type,
the order and the lens each one sits under. Nothing was dropped on taste.

Grounded in `BUYERS.md` for the segment, `DECISIONS.md` for the data ruling and
the register, `reviews/technology.md` section 3 for the store shape, and
`.claude/skills/atuned-ux/SKILL.md` for the measured floors. No product code is
written here.

---

## 1. What This Document Decides

1. Two instruments, not one. A two tap gauge and a sixteen item report.
2. The gauge lives in the footer and is invited twice, ever.
3. The report is pull only. Nothing in the product ever pushes it.
4. The payload carries the person's **band**, and that single field is the
   reason the instrument is worth building.
5. The payload carries no name, no address, no key, no id, no token and none of
   the person's stories. Section 11 lists the refusals by name.
6. No percentage gets reported this round. Section 13 shows the arithmetic and
   section 14 shows what to report instead.

---

## 2. What I Looked At, And What I Took

### 2.1 Taken

**UMUX-Lite.** Two items, seven point agree scale, scored by subtracting one
from each raw score, summing, and dividing by twelve. Reliability .82 to .86,
correlating with the ten item SUS at r = .81 to .83, which is close to the
ceiling a two item instrument can reach. This is the whole of what I take for
"how good is it" in the report. Two items instead of ten, for the same signal.

*What I changed, and the cost.* The published items are "this system's
capabilities meet my requirements" and "this system is easy to use". The first
is SaaS procurement language and does not survive the register ruling, so it is
reworded in section 6. **A reworded UMUX-Lite is no longer comparable to the
published SUS benchmark.** It is a local baseline against our own next build.
Anybody who prints it as a percentile against the industry average of 68 is
lying with a borrowed number.

**The Single Ease Question.** Seven point, one item, asked immediately after a
task. Averages 5.3 to 5.6 across more than four hundred tasks and ten thousand
users, so a score under 5.3 is a red flag rather than a fine result. I do not
take the item, because the report is not administered after a task. I take the
principle: **ask the question where the thing happened**, which is why the gauge
is invited after a reading prints and not on a calendar date.

**Microsurvey practice.** One to three questions, delivered in context, inside
the product, while the person is engaged. Reported in-app response rates run up
to sixty percent against a fraction of that for a mailed form. Taken whole for
the gauge: one scale, one optional line, in context, under fifteen seconds.

**Beta programme practice.** Managed programmes running focused surveys see
participation above ninety percent. Unmanaged programmes running broad surveys
sit near thirty percent. Completion falls five to ten percent for every minute
past five. Behaviour triggered surveys outperform date triggered ones. Taken:
the report is capped at four minutes, the gauge is behaviour triggered, and
section 13 prices the difference between a managed ask and a broadcast.

**Survey length data.** Ten questions averages an eighty nine percent completion
rate and forty questions averages seventy nine. The per question drop-off is
steepest for the first fifteen questions and flattens after. Surveys over seven
to eight minutes lose seventeen percent and over twelve minutes lose more than
thirty. Taken: sixteen items is deliberately parked at the knee of that curve,
and section 9 names the three items to cut first if completion comes in low.

**The Sean Ellis question.** "How would you feel if you could no longer use this
product", four options, forty percent very disappointed as the threshold, drawn
from benchmarking about a hundred startups. Taken as one item, with the
threshold explicitly not applied. Section 13 says why.

**GDPR practice on free text.** A free text field is where identifying detail
arrives without anybody intending it, and it is where ordinary feedback turns
into special category data. The advised control is a line directly above the
field, plus review before storage. Taken, and hardened: section 12 refuses a
submission that carries a mail shaped string or a long digit run, by name, and
never strips it silently.

### 2.2 Junk For A Product At This Stage, And Why

**Net Promoter Score. Cut outright.** Attempts to replicate the original growth
finding have largely failed, the best correlation anybody reaches is around
r = .35, it correlates with historical rather than future growth, the eleven
point scale has lower predictive validity than shorter ones, and the promoter
and detractor cut points are arbitrary. Two further reasons specific to us. It
needs hundreds of responses before the difference of two group counts settles,
and at n = 20 the NPS is noise with a minus sign in front of it. And the
referral mechanic is already ruled and already carries a number: the ICP ledger
found that five of seven who would arrive name a person rather than an ad. We do
not need to ask whether somebody would recommend it. We will watch whether they
do.

**SUS, all ten items. Cut.** It is reliable at eight to twelve participants and
the average is 68, so it is not junk science. It is junk **budget**: ten items
buying what two items buy at r = .83, in a four minute form where every seven
seconds is contested. It is also not a diagnostic, so a bad SUS tells you the
build is bad and nothing about which part.

**A five star rating. Cut.** Stars are trained to mean a transaction went
smoothly. This is not a transaction and a star is not a word. The gauge uses
five labelled points, every point named, because an unlabelled midpoint is read
differently by every person who reads it.

**Any Likert battery of "does X make sense" run six times in a row. Cut as a
format.** The owner asked six content questions and all six stay, but six agree
scales stacked is an acquiescence machine: people slide down the right hand
column. Section 6 varies the response type deliberately, and two of the six
become behavioural single choices instead.

**A PMF percentage at alpha. Not cut, but not reported.** The instrument is a
measurement tool, not a research method. It over-indexes on people who answered,
under-samples the people who quietly left, and produces one number with nothing
actionable under it. We keep the item because the four way split is useful as a
count. We do not print a percentage. Section 13.

**Demographics. Cut.** Age, occupation, gender, location, how they heard about
it. None of it changes a decision at alpha and all of it is identifying in a
group of thirty. The one segmentation field we need we already compute, and it is
the band.

**Session replay, heat maps, a per person funnel. Out of scope and out of
bounds.** Already ruled. A tracker is how somebody else's product gets the data.

---

## 3. The Segment. Who Is Actually In An Alpha

The grid in `BUYERS.md` is not monotonic. It peaks at 85 to 100 percent across
levels 8, 9 and 10, collapses to 30 percent at level 5 and 40 at level 4, and
floors at 0 at level 1. Every design decision below follows from one consequence
of that shape.

**An alpha panel is recruited from the top of a curve whose commercial problem
is in the middle.** The people who volunteer for an alpha, tolerate a rough
build, and finish a four minute questionnaire are levels 7 to 10: the creative
under load, the practitioner, the engineer, the systems hacker. They need almost
no persuasion, which is exactly why their answers cannot tell you whether the
persuasion works.

That produces three rules.

**3.1 A rating without the band it came from is noise.** A 3 out of 5 from a
level 8 and a 3 out of 5 from a level 5 are opposite findings. The first says the
instrument is failing a person who already wanted it. The second says a person
who never wanted it rated it politely. Averaging them produces a number about a
population that does not exist. The payload therefore carries the band, and
section 14 forbids the average.

**3.2 The answers that matter most will be the scarcest.** Level 6 at 65 percent
is the largest genuine opportunity and level 7 at 85 percent is the primary
target. If fewer than three responses arrive from band 6 or below, the round has
told you nothing about the segment that decides the business, and the report
must say so in that sentence rather than averaging over the gap.

**3.3 An alpha panel cannot answer a marketing question about reach.** They did
not arrive through a channel. They were handed the build. Asking them what made
them click measures nothing, so the marketing lens gets two of the owner's
questions and one addition, and nothing about channels, ads or headlines. Reach
is measured on the funnel counters at `/v1/ev`, by step, variant and device
class, and not in a questionnaire. I am declining to pad my own lens.

---

## 4. The Two Instruments

The owner separated them and the separation holds all the way down to the store.

| | The gauge | The report |
|---|---|---|
| Answers | "How good is it", plus one optional line | All eleven of his questions |
| Items | 2 | 16, plus 1 conditional |
| Time | Under 15 seconds | About 4 minutes |
| Placement | Footer strip, every surface | Its own surface, reached from Settings |
| Offered | Invited twice, ever. Always available | Never invited in-product. Pull only |
| Blocks anything | No. It is a strip, never an overlay | No. It is a surface a person walks to |
| Repeat | 14 day cooldown after a send | Once per build |
| Writes to | `POST /v1/fb`, gauge shape | `POST /v1/fb`, report shape |

They share one endpoint and one table because they answer the same questions at
two depths, and a rating that cannot be read beside a report is a rating that
sits in a second place nobody looks.

---

## 5. The Gauge. Exact Copy

A one line strip in the footer host. Not in any tab host: a tab renderer writes
the whole innerHTML of its host, which is the exact mechanism that deleted a
folded surface the first time Analytics went inside Summary. A gauge placed
inside a tab host disappears on the next render of that tab.

**The closed state.** A single control in the footer, always present, 44 by 44
minimum.

    Rate this build

**The open state.** Five labelled points, one optional line, two buttons.

    Rate this build

    1  Broken     2  Rough     3  Works     4  Good     5  Sharp

    One line, if you have one.
    [ What moved, or what stuck                                    ]
    No names. No addresses. Nothing that identifies you or anybody else.

    [ Send ]   [ Not now ]

**On a successful write**, through `status()`, clearing at 2.4 seconds:

    Rating recorded.

**On a failed write**, through `status()`, holding on screen, and the rating
stays on the control so it can be sent again:

    Not sent. Nothing left the device. Try again.

**After a send**, one line replaces the control for the rest of the session:

    Recorded. The full questionnaire is in settings. Four minutes.

**The invitation.** The same strip, opened by the product rather than by the
person, with one line of frame above it:

    You have taken three readings. How good is it?

---

## 6. The Report. Exact Copy, Sixteen Items

**Three steps, one lens each, a progress label on every step.** One page of
sixteen items is roughly seventy radio targets, and this product is already
measured at 57 to 71 simultaneous choices per screen against a working memory of
about four. That is the largest open UX problem in the build and a feedback form
is not the place to make it worse. Three steps of five or six items costs two
page transitions. The floors say a progress indicator makes people willing to
wait about three times longer, and it is buying the patience here.

**The tester never sees the word marketing, production or development.** Naming
the lens primes the answer. The internal names stay internal.

### 6.0 The Opening

    Alpha Feedback

    Sixteen questions, three steps, about four minutes. Every answer is
    optional.

    This is a small test group. Your answers are not anonymous in practice.
    They carry no name, no address, no account and none of your stories.

    Because nothing here points back to you, nothing here can be deleted on
    request. Send it only if that is fine.

    Answer for the build you have used, not the one you hope for.

    [ Start ]

The third paragraph is the honest residual. A story with no person attached
cannot be found to be deleted, and the same is true of a feedback row with no
rid. The ruling on the corpus is that the person is told this at the moment of
contribution rather than after, and this is the same duty.

### 6.1 Step One. What This Is

*Internal lens: marketing. Three items, about 40 seconds.*

**M1. Free text, 120 character ceiling. This is first, before any of the
product's own language can prime it.**

    In one line, what does this instrument do?
    [ Your words, not ours                                          ]
    No names. No addresses.

**M2. Single choice, one option.**

    This product exists to do one thing. Which one?

    (  ) Read where charge sits in the body and what it costs
    (  ) Track mood over time
    (  ) Diagnose a condition
    (  ) Sort people into a type
    (  ) Not sure

**M3. Single choice, one option.**

    Who would you hand this to?

    (  ) Somebody troubleshooting their own bottlenecks
    (  ) Somebody worn out by teachers and therapists
    (  ) Somebody still looking, trying one thing after another
    (  ) A practitioner, for their clients
    (  ) Nobody I know

    [ Next. 1 of 3 ]

M3 is the first of two additions to the owner's eleven. The five options are the
grid's own levels 7, 6, 5 and 8 in plain language, with no level numbers and no
percentages, because a person reading their own reading must never find a buying
probability next to their band. It is declared as an addition in section 9.

### 6.2 Step Two. What It Says

*Internal lens: production. Six items, about 55 seconds.*

**P1. Five point coverage scale, every point labelled.**

    Does the information make sense?

    1  None of it   2  Some of it   3  Half of it   4  Most of it   5  All of it

**P2. Single choice. A behavioural ladder, not an agree scale.**

    Do you know what you are reading?

    (  ) I could explain it to somebody else
    (  ) I got the shape of it
    (  ) I read it and it did not land
    (  ) I did not read it

**P3. Five point bipolar scale, anchored on what changed rather than on how it
felt.**

    Is the information helpful?

    1  Cost me time
    2  No effect
    3  Interesting, changed nothing
    4  Changed how I see it
    5  Changed what I did

**P3b. Single choice. This is the owner's seventh question, made decidable.**

    Which surface was the least helpful?

    (  ) Energetics   (  ) Story    (  ) Field      (  ) Body
    (  ) Compass      (  ) Knowledge (  ) Games     (  ) Summary
    (  ) None of them
    (  ) I did not open them all

**P4. Five point scale.**

    Does the protocol make sense? After a reading, do you know what to do next?

    1  No idea
    2  Roughly
    3  One step
    4  The next few steps
    5  The whole sequence

**P5. Single choice. The fourth option is load bearing.**

    Does the explanation around the problem make sense?

    (  ) I understand the mechanism it describes
    (  ) I understand what it found, not how
    (  ) I understand neither
    (  ) I understand it and I do not believe it

**P6. Five point scale, with the out as a separate control.**

    Does the content and knowledge base make sense?

    1  None of it   2  Some of it   3  Half of it   4  Most of it   5  All of it

    [ ] I did not open the knowledge base

    [ Next. 2 of 3 ]

The checkbox is deliberately not a sixth point on the scale. A sixth point
called "did not open it" is scored as a 6 by anybody who forgets, and one
forgotten row moves a mean of twenty.

P5's fourth option is the difference between CONFUSE and RESIST in the ICP
ledger, and the two need opposite fixes. Confusion is a copy defect. Disbelief
is a proof defect, and proof is mine.

### 6.3 Step Three. Whether It Works

*Internal lens: development. Six items plus one conditional, about 100 seconds.*

**D1. Single choice. The operational half of the owner's first question.**

    Did you finish what you came to do?

    (  ) Yes
    (  ) Yes, with difficulty
    (  ) No, I got stuck
    (  ) I did not come to do anything in particular

**D2a and D2b. Seven point agree scale. UMUX-Lite, reworded to the register.**

    This instrument does what I need it to do.

    1  Strongly disagree ..... 4  Neutral ..... 7  Strongly agree

    This instrument is easy to use.

    1  Strongly disagree ..... 4  Neutral ..... 7  Strongly agree

**D3. Single choice, with one conditional free text.**

    Did anything break?

    (  ) Nothing broke
    (  ) Something broke

    If something broke:
    What broke, and on which surface?
    [                                                               ]
    No names. No addresses.

**D4. Free text, 600 character ceiling. The one open question that earns its
sixty seconds.**

    What would improve the experience?
    [ One change, and what it would fix                             ]
    No names. No addresses. Nothing that identifies you or anybody else.

**D5. Single choice. The second and last addition to the eleven.**

    If this instrument went away tomorrow, how would that land?

    (  ) I would be very disappointed
    (  ) I would be somewhat disappointed
    (  ) I would not be disappointed
    (  ) I have stopped using it

    [ Send answers ]

There is no clear button and no reset. Undo does not exist in this product and a
control that destroys four minutes of work is the wrong place to introduce the
gap. Leaving the surface is the cancel.

If every field is empty:

    Nothing to send.

### 6.4 The Thank-You State

A rendered state, not a status line, so it stays until the person leaves.

    Recorded

    Your answers are in. They carry no name, no address and none of your
    stories.

    You can send this again after the next build.

    [ Back to summary ]

**If the write fails.** The answers stay on the surface, every field still
filled, and nothing claims success:

    Not sent

    Nothing left the device. Your answers are still on this screen.

    [ Send answers ]

---

## 7. The Eleven Questions, Mapped

The owner's words in the left column, verbatim. Every one of them is in the
instrument.

| # | His question | Where it lands | Type |
|---|---|---|---|
| 1 | Do you know what you're doing? | Split. M1 and D1 | free text, single choice |
| 2 | How good is it? | The gauge, and D2a plus D2b in the report | scale |
| 3 | Does the information make sense? | P1 | scale |
| 4 | Do you know what you're reading? | P2 | single choice |
| 5 | What would improve the experience? | D4 | free text |
| 6 | Is the information helpful? | P3 | scale |
| 7 | Is the information not helpful? | P3, low end, plus P3b | scale, single choice |
| 8 | Does the protocol make sense? | P4 | scale |
| 9 | Does the explanation around the problem make sense? | P5 | single choice |
| 10 | Do you know why we're doing this? | M2 | single choice |
| 11 | Does the content and knowledge base make sense? | P6 | scale |

**Question 1 is split, and here is why.** "Do you know what you're doing" reads
two ways. One is *do you understand what this thing is*, which is a positioning
question and belongs to marketing as M1. The other is *can you operate it*,
which is a task completion question and belongs to development as D1. Asking one
item and hoping the tester picks the intended reading produces an answer that
cannot be acted on either way. Two items, nine seconds each.

**Questions 6 and 7 are one axis asked from both ends, and they are merged.**
Asking "is it helpful" and then "is it not helpful" invites a yes to both, which
is acquiescence bias with the mechanism visible. The merge keeps his full intent:
P3 is bipolar with the unhelpful end explicitly labelled "cost me time", which
is stronger than a neutral, and P3b names the specific surface that failed. That
is the actionable form of question 7. The alternative, two separate items, costs
seven more seconds and returns a contradiction.

---

## 8. What Each Answer Decides

A question whose answer changes nothing is cut. Every item below names the open
decision it moves, and every one of those decisions is already named as open in
`DECISIONS.md`, `TASKS.md` or `CLAUDE.md`.

| Item | What it decides |
|---|---|
| Gauge 1 to 5, split by band | Whether the build ships to a wider group. A 4 from band 6 is worth more than a 5 from band 9 |
| Gauge free line | The one sentence nobody thought to ask about. It is the item most likely to produce an unknown unknown |
| M1 | The top of the funnel. If testers cannot name what the instrument does in their words, the headline is wrong, not the reader. This is the single copy decision the round can settle |
| M2 | The category read. If more than a quarter pick "track mood over time" the positioning is wellness and the instruments frame has failed. Decides the first four seconds of every surface |
| M3 | Which band the acquisition spend targets. Validates or breaks the `BUYERS.md` curve from the outside, from people who have used it |
| P1 | Whether the register ruling is working. Its six step shape is built. This says whether it lands |
| P2 | Whether the reading needs a legend. "I got the shape of it" in volume means the reading is impressive and not legible, and a legend is a small build |
| P3 | Whether the product is a diagnostic or an interesting object. A cluster at 3, "interesting, changed nothing", is the worst result available and decides whether the ritual builder moves up the plan |
| P3b | Which surface loses its place on the bar. Games came back onto it on a ruling and is unmeasured. Compass is new. This is the field that names the next cut |
| P4 | Whether the protocol needs a written sequence rather than a route. The selection ruling says the tools are four doors onto one list. If people do not know what to do next, the doors are clear and the corridor is not |
| P5 | Confusion versus disbelief, which need opposite fixes. Disbelief moves proof up the plan, and the strongest proof we hold is that every table the reading runs on is readable inside the product. Nobody else in this category does that and almost nobody knows we do |
| P6 | Whether knowledge base search gets built. It is named in `DECISIONS.md` as not built. A low P6 with most people having opened it says search. A high "did not open it" count says the door is hidden, which is a smaller fix |
| D1 | Whether the intake stays a strong default or becomes a hard gate. Ruled as a default this round, and "no, I got stuck" is the evidence that would reopen it |
| D2a and D2b | The local usability baseline for the next build to beat. Two numbers, both with their interval printed |
| D3 | The bug list, band tagged, with the surface named |
| D4 | The ranking of the four open engineering items: undo, the seed decay policy, cognitive load, the impure core. Undo is already named as the largest remaining gap. If testers name it unprompted, it stops being a judgement call |
| D5 | Whether to keep building at all this quarter, and the counts under it say for whom |
| Band field | Every row above. Without it every row above is an average over a curve that is not monotonic |
| Accuracy bucket | Whether a low rating is the instrument's fault or the person's thinness of input. A rating from a reading the engine says it is 30 percent confident about is a different fact from one at 80 |

---

## 9. What Was Cut, And What Was Added

### 9.1 Cut

| Cut | Why |
|---|---|
| Net Promoter Score | Section 2.2. Fails to replicate, r near .35, arbitrary cut points, needs hundreds of responses, and the referral mechanic already carries the number |
| SUS, ten items | UMUX-Lite gets the same signal at r = .83 for two items. Eight items of budget back |
| A star rating | Stars mean a smooth transaction. This is not a transaction |
| "Would you recommend this" | Duplicate of a referral we can observe. An intention to recommend is not a recommendation |
| A generic "anything else" box | It duplicates D4, and it is the highest free text privacy risk in the form with no decision attached. Three targeted free texts beat four, one of which is a catch-all |
| Demographics, all of it | Changes no decision and identifies people in a group of thirty |
| "How did you hear about us" | The panel was handed the build. The answer is "the owner" |
| Per surface ratings, eight items | P3b gets the one actionable version of the same thing in one item |
| Any question about price | Ruled. The ladder and the free allowance are settled and a tester's opinion on a price they are not paying is worth nothing |
| Any question about a feature not built | Alpha rates what exists. The opening line says so |
| Question 7 as its own item | Merged into P3 and P3b. Section 7 |

### 9.2 Added. Exactly Two, Both Declared

**M3, who would you hand this to.** The only marketing question a hand-picked
panel can answer from experience, and the only item in the form that tests the
`BUYERS.md` curve against reality. Nine seconds. Cut it if the owner wants
fifteen items.

**D5, the disappointment item.** The owner's "how good is it" measures the build.
This measures whether it is needed. They are different questions and only one of
them decides whether to keep building. Eight seconds.

### 9.3 The Cut Order If Completion Comes In Under Half

In this order, and no further: **P6** first, because a large "did not open it"
count makes the scale unreadable anyway. **P3b** second, ten options for one
finding. **M2** third, and only third, because the category read is the most
valuable thing in the form and I will argue for it.

That takes the form to thirteen items and about three minutes.

---

## 10. Placement, Timing And Frequency

### 10.1 The Gauge

**Where.** The footer host, present on all nine surfaces. Not in a tab host, for
the render reason in section 5.

**When it may invite.** Once, after the third reading prints on Summary. A
behaviour trigger, not a date, and not the first reading: a person who has taken
one reading is rating a first impression, and a first impression of an
instrument is a rating of the art direction.

**When it may never invite.**

- Never in the first session. The app opens on Summary and Summary is a
  stranger's first screen. A stranger has nothing to rate.
- Never while a text field has focus on Story or Energetics. A person mid story
  is doing the one thing the product is for.
- Never while a `status()` failure is on screen. A product that has just failed
  to save something does not get to ask how good it is.
- Never on the surface a person just arrived at. One full interaction first.

**Repeat.** Fourteen days after a send, not the ninety days that throttling
convention recommends, because ninety days is a quarterly cadence for a shipped
product and this build moves weekly. The deviation is deliberate and is named
here so nobody reads it as an oversight. After the alpha closes, ninety.

**Cap. Two invitations, ever.** After the second, the footer control remains and
the person comes to it. That is the whole of "never nag", and it is enforced by a
counter, not by a policy.

**A dismissal is not a decline.** Closing the strip stops it for the session and
costs one of the two invitations only if it was an invitation. The person opening
it themselves never spends one.

### 10.2 The Report

**Where.** Its own surface, with its own host and its own renderer, reached from
Settings and from the gauge's post-send line. **Not a tab.** `TABDEF` is eight
and Games has just come back onto it. A feedback form is not a peer of the
instrument and does not get a door, for the same reason Settings does not.

If it needs an integer, it is **10, appended**, for the same reason Compass is 8
and Settings is 9. The integers are identity, they are persisted and compared,
and renumbering them is the bug the codebase has warned about since the rebuild.

**When.** Never invited in-product. Pull only, plus one personal ask per tester,
by name, outside the product. Section 13 prices that ask, and it is the single
largest lever on the response rate in this document.

**Repeat.** Once per build. A second send from the same device inside one build
replaces the first rather than adding a row, because two contradictory forms from
one person double-count a mind that changed.

### 10.3 Never Block, Stated Mechanically

- The gauge is a strip in the footer's own host. No overlay, no scrim, no dim, no
  focus trap.
- Escape closes it. Closing it leaves no trace on the surface underneath.
- No surface is obscured, resized or scrolled by its appearance.
- The report is a surface a person walks to. It never appears over anything.
- Nothing in either instrument is required before any other part of the product
  will work. There is no gate anywhere in this spec.

---

## 11. Privacy. The Payload, Field By Field

The data ruling is the strongest in `DECISIONS.md`: we never sell anybody's
data, the record identifies and the story does not, and the two are not held
together. The feedback payload is a third thing and gets a third store.

### 11.1 Where It Goes

`POST /v1/fb`, into **DB three**, one table, bound to a Worker with **no
binding to DB one and no binding to DB two.**

    fb   fid TEXT PK, at TEXT, band INT, acc INT, held INT, runs INT,
         w INT, theme INT, plat INT, a TEXT, t1 TEXT, t2 TEXT, t3 TEXT

No binding to DB one is the same architecture that already keeps the corpus
Worker away from `record` and `mail`: the join cannot be written because there is
no handle to write it with, which is the difference between a promise and an
architecture.

**No binding to DB two either, and that is a new argument.** The corpus holds
stories at day resolution. A feedback row carries a day, a band and a platform. A
story and a feedback row from the same day and the same band narrow to one person
faster than either narrows alone. Keep them apart.

Rate limit: three writes per IP per hour. No Turnstile on the gauge, because a
challenge in front of a two tap rating costs more than the spam it stops in a
thirty person alpha. Turnstile on the report only if the endpoint is ever
reachable from outside the build.

### 11.2 What It Carries

| Field | What it is | Why it is not identifying |
|---|---|---|
| `fid` | Random id generated at submit, never persisted on device | Cannot be joined to a second submission or to anything else |
| `at` | Date at **day** resolution | A finer timestamp plus a band is close to a fingerprint |
| `band` | CQ band integer, 1 to 10 | A band, never the raw CQ. A CQ to one decimal is far more unique than a band |
| `acc` | Accuracy bucket of the reading, four buckets | Tells a low rating apart from a thin input |
| `held` | Held address count, bucketed: 0, 1 to 5, 6 to 20, 21 plus | How much of the product they actually used |
| `runs` | Readings printed, bucketed: 1 to 2, 3 to 5, 6 plus | Depth of use |
| `w` | Viewport width bucket, four values. Same convention as `/v1/ev` | |
| `theme` | Which of the three themes. Punch is new and unmeasured | |
| `plat` | Two values, phone or desktop | Never a user agent string |
| `a` | The closed answers, integers only, one per item | |
| `t1` `t2` `t3` | The free text: M1, D3 conditional, D4 | Section 12 is the whole control on these |

### 11.3 What It Refuses, By Name

None of the following may appear in the payload, in any field, under any name.
This list is the specification, not a summary of one.

- A first name, a last name, initials, a display name.
- An email address.
- The key, the `rk`, the `rid`, or any part of any of them.
- A customer id, a subscription id, a Stripe id, an invoice id.
- Any token, code, session value, nonce or cookie. The store sets no cookie,
  ever, so there is no session to steal.
- The person's stories. Journal entries, imprints, the intake free text, any
  string the person typed into the product. The gauge and the report send only
  what the person typed into the gauge and the report.
- A date of birth, an age, or any output of the birth module.
- The raw CQ, DQ or SQ numbers. Bands only.
- The four letter type, and the seed. **This one is a real finding and not a
  formality.** In a panel of thirty, a stated type plus a band plus a platform
  plus a theme is a cell of one for most testers. The type is the field that
  turns a pseudonymous row into a named one, and it is the field a curious
  engineer would most want. It stays out.
- A device id, a fingerprint, any cross visit identifier.
- A user agent string.
- An IP address at rest. The edge sees one and the row does not carry it.
- Geolocation, timezone, locale, language.
- A practitioner's roster, a client list, or anybody's data but the sender's.

### 11.4 Two Honest Residuals, Both Told To The Tester Before They Send

**Re-identification at alpha.** Thirty people the owner recruited, each carrying
a band, a platform and a theme. The payload is pseudonymous by construction and
re-identifiable in practice by the person who assembled the panel. The control
for that is not more stripping, it is saying so. The opening copy in 6.0 says it
in two sentences.

**A row with no rid cannot be deleted.** `POST /v1/forget` reaches `record`,
`plan`, `code` and `mail` by rid. A feedback row has no rid, which is the point,
and it is therefore out of scope of a deletion request in exactly the way the
corpus is. Told at the moment of contribution, in 6.0, and not after.

**Retention on free text.** The integers keep. The free text is reviewed and
deleted within ninety days of the alpha closing. It is the part with the value
and the part with the risk, and it does not get to sit there for a year because
nobody set a date.

---

## 12. Free Text. The One Line And The Refusal

Free text is where the identifying detail arrives, and it arrives without
anybody intending it. Three controls, in order of when they act.

**12.1 The line, before they type.** Directly above every free text field, one
line, always the same words, because one word per concept:

    No names. No addresses. Nothing that identifies you or anybody else.

On the gauge, where there is one short field and no room, the short form:

    No names. No addresses.

**12.2 The ceiling.** M1 is 120 characters, the D3 conditional is 300, D4 is
600. A ceiling is the cheapest data minimisation there is: a person cannot
paste a client note into a 120 character field.

**12.3 The refusal at the boundary, and it never strips silently.** Before a
send, the free text is checked for a mail shaped string and for a run of seven
or more digits. If either is found the send is **refused by name**, the field is
marked, and nothing is altered:

    That line looks like an address or a phone number. Take it out and send
    again.

This is the same posture as `validateProfile`: a field of the wrong shape is
refused by name and never silently clamped, because a clamped value reads back as
something the person never entered. A silently stripped sentence reads back as
something the person never said.

The check will miss some. A first name in a sentence passes and there is no
reliable way to catch it in a hundred and twenty characters. That limit is
already recorded as open in `DECISIONS.md` for stories and the same limit applies
here. Do not claim the check is a guarantee, in copy or in a commit message.

---

## 13. The Arithmetic

### 13.1 What A Thirty Person Alpha Yields

Assume thirty testers. Weighted toward bands 7 and 8, per section 3.

**The gauge.** In-context microsurveys report up to sixty percent. An alpha panel
that knows the owner over-responds, so 60 to 75 percent: **18 to 22 ratings.**

**The report, broadcast.** An unmanaged programme running a broad survey sits
near thirty percent. A four minute form with no personal ask is that: **9
completes.**

**The report, managed.** Managed programmes running focused surveys clear ninety
percent. One personal ask per tester, by name, with a stated deadline, is what
managed means: **20 to 26 completes.**

**What would have to be true for the managed number.** One ask per tester,
written by a person, naming what the round decides. A stated close date. A second
ask to non-responders, once, and once only. If nobody is going to write thirty
messages, budget for nine completes and design the reporting for nine, which
section 14 does.

The difference between those two paths is eleven to seventeen completes, and it
costs about ninety minutes of somebody's time. There is no cheaper lever in this
document.

### 13.2 The Disappointment Item, And Why No Percentage Gets Printed

The threshold is forty percent very disappointed. The 95 percent interval on a
proportion of .4:

| n | Interval on 40 percent |
|---|---|
| 9 | plus or minus 32 points |
| 20 | plus or minus 21 points |
| 30 | plus or minus 18 points |
| 100 | plus or minus 10 points |

At nine completes, an observed forty percent is consistent with anything from
eight percent to seventy two. **The forty percent line does not separate from
thirty percent at 95 percent confidence until about n = 100.** We will not have a
hundred completes this round or next.

So: record the four counts, report them as counts, and say n. Anybody who writes
"we hit forty two percent PMF" off twenty completes has invented a number, and
that is worth saying before the slide exists rather than after.

### 13.3 The Usability Baseline

UMUX-Lite at n = 20 gives a 0 to 100 score with an interval of roughly plus or
minus 8 to 12 points depending on spread. Print the interval beside the number,
every time, and never print it against the SUS average of 68, because the items
were reworded and the comparability went with the rewording. It is a baseline for
our own next build and nothing else.

### 13.4 The Band Split, Which Is The Real Test Of The Round

Expected under the ICP weights: most responses from bands 7 and 8. **If fewer
than three responses arrive from band 6 or below, the round has measured the
people who were always going to buy.** That is a useful thing to know about the
build and not a useful thing to know about the business, and the report must open
with that sentence rather than closing with it.

What would have to be true to fix it: recruit for band, not for willingness.
Three testers whose reading lands at band 5 or 6, found deliberately, are worth
more to my lens than fifteen more at 8.

### 13.5 Engineering Cost

| Piece | Size |
|---|---|
| The gauge, footer strip, five points, one line, one write | S |
| The `POST /v1/fb` endpoint, DB three, one table, rate limit | S |
| The report surface, three steps, sixteen items, progress label | M |
| The free text boundary check and its named refusal | S |
| Band, accuracy, held, runs bucketing into the payload | S |
| The invitation counter, cooldown and the never-invite conditions | S |
| A read view for the answers, band split, counts not means | M |

Six S and two M. Nothing here is large, and the read view is the one people
forget, which is how a feedback instrument ends up writing rows nobody reads.

---

## 14. Reporting. How To Read Twenty Answers Without Lying

Three rules, and they are not style preferences.

**14.1 Never average across bands.** The curve is not monotonic. A mean over
bands 5 to 9 is a number about a population that does not exist. Every figure is
split by band or it is not reported.

**14.2 Report counts and quotations until n clears 100 on the item.** "Four of
twenty one, three of them band 8" is a fact. "Nineteen percent" is an estimate
dressed as one. Print n beside every figure, always, including in a summary
slide, because the summary slide is the only thing most people will read.

**14.3 The comprehension items are counts too.** M2 feels like it yields a rate,
because the choice set is fixed and the intended answer is known. It does not.
"Fourteen of twenty one picked the intended read" is the honest form. The
temptation to write "67 percent understood the positioning" should be resisted by
the person writing it and caught by the person reading it.

**What the round is allowed to conclude.** Whether the positioning reads, from
M1 and M2. Which surface to cut, from P3b. Whether the reading is legible, from
P1 and P2. Whether it is a diagnostic or an interesting object, from P3. What to
build next, from D4 ranked against the four open engineering items. It is not
allowed to conclude anything about product market fit, about reach, about
channels, or about price.

---

## 15. Sizing, In Build Order

| # | Item | Size | Blocks |
|---|---|---|---|
| 1 | `POST /v1/fb`, DB three, `fb` table, rate limit, no binding to DB one or two | S | everything |
| 2 | The gauge: footer strip, five labelled points, one line, `status()` on both paths | S | 1 |
| 3 | Payload bucketing: band, accuracy, held, runs, viewport, theme, platform | S | 1 |
| 4 | The free text boundary check and its named refusal | S | 1 |
| 5 | The invitation counter, the fourteen day cooldown, the four never-invite conditions | S | 2 |
| 6 | The report surface, integer 10, not in `TABDEF`, reached from Settings | M | 1, 4 |
| 7 | The read view: band split, counts, n printed, no means | M | 1 |

One to five is the gauge, complete, and it is four S items. Six and seven are the
report. If only half of this gets built this round, build one to five: a two tap
rating with a band attached is worth more than a sixteen item form with no band.

---

## 16. Open, And Whose Call

**Mine, and recommended here.**

1. *In-product or a hosted form.* In-product. A hosted form is cheaper and loses
   the band field, and the band field is the reason the instrument is worth
   building. Section 3.1.
2. *Whether the band goes in the payload at all.* In, bucketed, with the
   re-identification line in the opening copy. It is simultaneously the most
   useful and the most identifying field in the payload and the honest
   resolution is disclosure, not omission.
3. *Whether the gauge shows a person their own rating history.* No. A person
   rating a build and then being shown a chart of their own ratings turns
   feedback into a score, and a score invites gaming.
4. *Never a scarcity or urgency line anywhere in either instrument.* No countdown
   on the report, no "last chance to shape the product". In this category
   urgency is counter signalling and it would undo the instruments position in
   one sentence.

**His.**

5. Whether M3 and D5, the two declared additions, stay. Seventeen seconds
   together. I argue for both and section 9.2 says what each decides.
6. The retention window on free text. Ninety days after the alpha closes is my
   proposal and the number is his.
7. Whether the report gets integer 10 and a host now, or waits for the accounts
   fork. The gauge does not need the fork. The report does not either, but the
   read view is easier once there is a store.
8. Whether the alpha recruits three testers deliberately at band 5 or 6.
   Section 13.4 is the argument and the recruiting is not mine to do.
