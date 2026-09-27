# The funnel, to day one hundred

Theo Lindqvist, marketing. 27 September, round JP.

His brief, verbatim, from `TASKS.md` JP:

> I want the marketing team to go out to the internet, take all of our
> content, take our key demographics and speak to their pain points. We want
> an allure to pull them into our funnel that speaks directly to their pain,
> get some curious about what their coherence is, understanding why it's
> important, and in this day and age. This tool is a counter, this gives you
> your attention back. Then we get them to our final, the data gets to the
> database, they get into the app, then they log into the app with their
> email from the quiz, and then they're off to the races. They use the app for
> 100 days. We set them up on the install, or the setup, that they have a week
> to use the app. [...] It's got to be graphic, it's got to be simple, it's
> got to speak directly to their pain point. And it has to be something that
> they want to want. It has to be very simple and it has to provide the
> result.

**What this file is.** The funnel he described, from a cold stranger to day
one hundred, written as a sequence of named screens, with every step marked
as built, drafted, ruled, blocked, open or new. It sits on top of what this
project already has and does not replace any of it. It is strategy and a
flow. Nothing in `funnel/`, `atuned_src/` or `proto/` was touched.

**What it is not.** A funnel build. He parked the funnel at round IB: *"Don't
touch the funnel. That's a waste of credits."* This dictation asks marketing
for the strategy and the flow. Whether it also un-parks the build is question
1 at the end, and it is not answered here by default.

**Egress note, because it decides how to read every citation.** Direct page
fetch is blocked in this environment, measured again today:
`www.revenuecat.com` returned `EGRESS_BLOCKED` from the proxy. Every outside
source below was reached through the search index against the URL given, so
each claim is quoted at the level the index summary carries it. Vendor and
secondary sources are labelled as such. Nothing is written from memory and
presented as research. `MAP.md` carries the same note for the same reason.

**How to read the status marks.**

    BUILT     in the repository today, file named
    DRAFT     designed in a named file, not built
    RULED     the owner decided it, DECISIONS.md or TASKS.md named
    BLOCKED   cannot be built until a named thing is decided or done
    OPEN      his call, listed in section 9 with the ways it could go
    PARKED    stood down by him at IB
    NEW       this file's synthesis, from this brief and the research

---

## 1. What already exists, so nobody rebuilds it

Read before anything below. Each of these was re-read for this file.

| What | Where | What it already settles |
|---|---|---|
| The funnel strategy | `reviews/funnel-strategy.md`, 19 September | Top of funnel is the instrument working on somebody else; the quiz is the middle; **pay the number on the web before any email**; referral is the channel; click to paid modelled at 0.7 percent |
| The offer and conversion path | `reviews/funnel-offer.md` | Drop offs by grid level; no trial, and the reason goes on the page; the one time code as the condition for Sofia, the practitioner |
| The ICP reactions | `RESEARCH-icp.md` | Stated duration, visible remainder and resumable are the conditions for 68 percent completion; the email as the only key loses James and Sofia |
| The funnel welcome | `DESIGN-funnel-welcome.md`, 26 September | Name and email capture is **not built**; three slides drafted; two shipped lines become false the day a request is made |
| The funnel pages | `funnel/index.html`, `quiz.html`, `about.html`, `buy.html` | BUILT. 100 questions, one per screen, the seven band ring fills as a person answers (`CQR1` to `CQR3`), the reading on the web, the record saved as a download, and a gate, `tests/funnel.js` |
| The ninety day walk | `reviews/SIM-ninety-days.md`, `PANEL-flow-1000.md` | Where people leave on day one to day ninety, measured on the build of 19 September. Many of its defects are fixed since; its shape still holds |
| Ritual and push | `reviews/SPEC-ritual-accountability.md` | A notification may name the practice and **never the gap**; no push during an absence; the week, called a season there, 1 to 7, is the only number on the page |
| The game design | `reviews/game-design.md` | Why somebody opens it on day thirty; the streak as a loss frame; the same story read twice |
| The marks | `atuned_src/engine/ladder.js`, drawn in `proto/gamification-timeline/` | Sixteen marks in three families. The streak halves on a miss rather than resetting, on Lally 2010 |
| Sign in | `atuned_src/ui/account.js` | BUILT as an honest shell: email and password fields, and Continue says accounts are not live. Round JN validated it |
| The record store | `PRIORITY.md` `AW1`, `BACKLOG-AUDIT.md` 2.1 | BLOCKED. The database, the region, the provider (Cloudflare ruled 25 September, *"I said Supabase"* 27 September), the repository still public, `RECORDS_KEY` |
| His lines | `marketing/LINES.md` | Every positioning line of his, gated. Section 8 adds this round |
| The release | `ui/release.js`, round JO | BUILT and verified: doses of 25, 50 and 100, two counters, the completion line, a Felt toggle per pattern, two minutes of settling |

**Rulings that bind this funnel**, quoted so nobody has to go and look:

- *"The funnel record exists **only to hand back to the person**. It is not an
  asset, not a list, not a segment."* `DECISIONS.md`.
- *"The ritual, I think, is the only thing I want so far talking directly to
  the customer outside of the push notification."* `DECISIONS.md`.
- Two months free is out. `DECISIONS.md`, `BUYERS.md`.
- The app is one file with no dependencies and gains network at exactly one
  seam, fetching a record at sign in. `CLAUDE.md`.
- Speak to a ten year old, never abstract language. `TASKS.md` JK.
- Less text, more visual. `TASKS.md` JP.

---

## 2. The research, cited

Each item: what was found, where, and what this product takes from it or
refuses. The refusals are as much the finding as the takes.

### 2.1 How a cold visitor becomes a quiz taker

**R1. Long quizzes convert when every answer visibly changes something.**
Noom's web to app onboarding runs up to 113 screens and 10 to 15 minutes, and
the teardowns name the mechanism as personalization shown back to the person:
each answer makes the result feel more tailored. The same teardowns name the
second mechanism as sunk cost: every question answered is another reason not
to quit. [RevenueCat, Noom teardown](https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel)
(vendor); [Web2App World, Noom breakdown](https://web2appworld.com/breakdowns/noom/)
(vendor). Rushfinn's review of the same funnel adds two practices: tell the
person why a question is asked, and show a progress bar.
[Retention.Blog, The longest onboarding ever, 2024](https://www.retention.blog/p/the-longest-onboarding-ever).

- **Take.** Our quiz is 100 questions and it already has the one mechanism
  that is honest: the ring fills as a person answers (BUILT, `funnel/ring.js`).
  That is the answer visibly changing something.
- **Refuse.** Sunk cost as the lever. The standing line is that a person must
  be able to stop and be glad they used it (`GUARD.md`). And refuse the "plan
  built just for you" theatre: our proof is that the instrument prints its own
  error bar (`reviews/funnel-strategy.md` section 9).
- **The gap it exposes.** The landing does not state how long the test takes.
  `RESEARCH-icp.md` found stated duration is one of three conditions for
  completion. It has to be measured on the 100 question build before it is
  printed, since the 15 minute figure was for 63 questions.

**R2. The pain is quantified on the person's own numbers, then the offer.**
Opal, a screen time app, runs a personalised quiz that produces a "Focus
Report" quantifying the lifetime a person may spend on their phone, and shows
the offer after it; on day one it asks the person to schedule blocks for their
distracting apps every day, so the next day it happens without remembering.
[ScreensDesign, Opal breakdown](https://screensdesign.com/showcase/opal-screen-time-control)
(secondary); [Speedinvest, how Opal built a 10M business](https://www.speedinvest.com/knowledge/scaling-smart-how-opal-built-a-10m-arr-business-in-just-2-years).

- **Take.** The day one schedule. It is an implementation intention, and the
  repository already carries the evidence for it at d 0.65 (R12). Our version
  is the ritual's when and where, which is BUILT (`ui/ritual.js`, `ritToday`).
- **Refuse.** The shocking lifetime figure. It is a fear frame built from a
  statistic, and `refuse.js` and `reviews/funnel-strategy.md` section 9 both
  keep statistics and fear off the page. Our number is the person's own
  coherence, which is theirs and not a projection.

**R3. Curiosity is a gap with a size.** Already in this repository:
Loewenstein 1994, curiosity peaks when a person holds a little knowledge and
falls at none or all. `MAP.md` mechanism 3. It is why *"what is my
coherence?"* works as an allure only after the person has seen one coherence
reading that is not theirs. The gap has to be shown before it can be felt.

**R4. The first three seconds carry most of a video's value.** Meta's own
guidance: up to 47 percent of the value in a video campaign was delivered in
the first three seconds and up to 74 percent in the first ten.
[Meta for Business, Capture attention with updated features for video ads](https://www.facebook.com/business/news/updated-features-for-video-ads).
Secondary sources put most feed video as watched without sound.
[Benly, Meta video ads guide](https://benly.ai/learn/meta-ads/video-ads-guide) (secondary).

- **Take.** Every cold piece opens on the instrument moving, in frame one,
  with the words on screen. No logo first, no slow build. This matches his
  *"graphic"* and *"less text, more visual."*

### 2.2 The attention claim, and what the research lets us say

**R5. The pain is real and measured.** Gloria Mark's work at UC Irvine: by
2021 people switched attention on a screen every 47 seconds on average, down
from about two and a half minutes earlier, and people interrupt themselves
more than others interrupt them.
[University of California, Can't pay attention? You're not alone](https://www.universityofcalifornia.edu/news/cant-pay-attention-youre-not-alone);
[APA, Speaking of Psychology, with Gloria Mark](https://www.apa.org/news/podcasts/speaking-of-psychology/attention-spans).
DataReportal's 2025 overview puts the average person online at about six and
three quarter hours a day.
[DataReportal, Digital 2025](https://datareportal.com/reports/digital-2025-global-overview-report).

- **Use.** Under his byline, in the newsletter and the book, cited. **Not on a
  page or an ad**: a statistic on the page is refused by the funnel brief, and
  a stranger's screen time is not a reading of them.

**R6. An attention product can be measured, and that is the bar.** The *one
sec* app puts a pause and a question in front of an app a person chose to
limit. In a six week field study of 280 people, 36 percent of attempts to open
a target app were abandoned after the pause, and attempts fell 37 percent
against week one. [Grüning et al. 2023, PNAS](https://www.pnas.org/doi/10.1073/pnas.2213114120).

- **What it means for us.** That is what *"gives you your attention back"*
  looks like when it is proven. **This instrument does not measure attention.**
  It reads charge from self report and from what a person writes. So the line
  is a promise we cannot show on our own screen, and section 4 says where it
  may go because of that.

**R7. A tempting finding we do not use.** Ward and colleagues 2017 reported
that the mere presence of a person's own phone reduced working memory
capacity. [Ward et al. 2017, JACR](https://www.journals.uchicago.edu/doi/full/10.1086/691462).
A later meta analysis and a replication question the effect.
[Does the brain drain effect really exist? A meta analysis](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10525686/);
[Reexamining the brain drain effect, a replication](https://www.sciencedirect.com/science/article/pii/S0001691822002323).
A contested finding in the copy of a product whose asset is that everything
is open is the wrong trade. Left out.

**R8. The body premise has a real anchor, with a limit.** Nummenmaa and
colleagues had 701 people colour where they felt activity for different
emotions; the maps were statistically separable and held across West European
and East Asian samples. [Nummenmaa et al. 2014, PNAS](https://www.pnas.org/doi/abs/10.1073/pnas.1321664111).

- **Take.** It supports the premise of his signal test: people locate
  feeling in the body, and consistently. It is the citation for *"feel where
  it lands."*
- **Limit.** It does not validate the 112 addresses, and it says nothing
  about yes and no as words. It goes under his byline and on the about page as
  a source, never as *"science proves."*

### 2.3 From the quiz into the app, with no second sign up

**R9. The web to app pattern ties the web identity to the app.** The email is
captured on the web, and the app is opened already signed in, by a password
free link to the email or by a short lived token carried on a deep link, so
the person never creates an account twice.
[FunnelFox, deep linking for web to app](https://blog.funnelfox.com/deep-link-guide-web-to-app/) (vendor);
[Adapty, what is web to app](https://adapty.io/blog/what-is-web-to-app-and-how-does-it-work/) (vendor);
[DEV, the web2app funnel where users open the app already logged in](https://dev.to/utkarsh4517/the-web2app-funnel-where-users-pay-on-the-web-and-open-the-ios-app-already-logged-in-even-before-456f).

- **Take.** This is exactly his *"log into the app with their email from the
  quiz."* The mechanism is a one time code or link sent to that email. It is
  also what `RESEARCH-icp.md` asked for on other grounds: a code means the
  email is not the only key, which is what James and Sofia hold on.
- **The collision.** The sign in shell is BUILT with a password field. A
  password is a second sign up step in disguise. Question 4.

**R10. On an iPhone, a web app gets push only from the Home Screen.** Since
iOS 16.4, web push works only for a web app the person has added to the Home
Screen, and the permission may only be asked in response to a tap.
[WebKit, Web push for web apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/).

**R11. On an iPhone, Safari erases a site's stored data after seven days of
use without a visit, and a Home Screen web app is exempt.** Script written
storage, including localStorage and IndexedDB, is deleted after seven days of
Safari use with no interaction with the site; web apps added to the Home
Screen keep their own count, and WebKit does not expect their data to be
deleted. [WebKit, Full third party cookie blocking and more](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/);
[WebKit, Tracking prevention](https://webkit.org/tracking-prevention/).

- **This is the most important technical fact in the brief, and it is about
  his "week".** The app keeps everything in the person's browser. A person on
  an iPhone who takes the test, opens the app once in Safari, and does not
  come back within a week of using Safari can lose their record. The Home
  Screen step fixes it and is also the only way the ritual reminder can reach
  them. `BACKLOG-AUDIT.md` 2.1 item 9 already names *"the home screen prompt,
  the only way Safari keeps a record past seven idle days."* The record store
  fixes it for good, and is BLOCKED.

### 2.4 The first week and the hundred days

**R12. The day one plan is the strongest evidenced lever.** Implementation
intentions, an if then plan for when and where, improved goal attainment at a
mean d of 0.65 across 94 tests.
[Gollwitzer and Sheeran 2006](https://kops.uni-konstanz.de/handle/123456789/10973).
Already the basis of the ritual spec.

**R13. Seeing your own progress works.** Monitoring goal progress improved
attainment at d of about 0.40 across 138 randomised studies.
[Harkin et al. 2016, Psychological Bulletin](https://www.apa.org/pubs/journals/releases/bul-bul0000025.pdf).
Already the reason `ui/record.js` is the strongest thing for day thirty.

**R14. A head start people did not have to fake.** Car wash customers given a
ten stamp card with two stamps already filled completed it at 34 percent,
against 19 percent for an eight stamp card with none, though both needed eight
washes. [Nunes and Drèze 2006, summarised](https://learningloop.io/plays/psychology/endowed-progress-effect) (secondary).

- **Take, honestly.** The 100 questions are real progress. Carry them into
  the app so day one opens with the reading already there. No stamp is given
  that was not earned. Section 5 found a gap here in the build.

**R15. A hundred days is long enough for most of a habit.** People forming a
daily habit took from 18 to 254 days to reach 95 percent of their automaticity,
median 66; and missing one opportunity did not materially affect it.
[Lally et al. 2010, EJSP](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674);
[University of Surrey, with Dr Lally](https://www.surrey.ac.uk/news/does-it-really-take-66-days-form-habit-we-asked-expert-dr-pippa-lally).
The engine already halves a streak on a miss rather than resetting it, on
this paper (`engine/ladder.js`).

**R16. A new week is a fresh start.** Gym visits, searches for "diet" and goal
commitments all rise after temporal landmarks such as the start of a week or a
month. [Dai, Milkman and Riis 2014, Management Science](https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1901).

- **Take.** The week is the unit, and a new week is how a person comes back
  after a gap, with the gap never named (the standing push ruling).

**R17. The first week predicts the quarter, and the category base is low.**
Amplitude reports seven day activation as the strongest predictor of three
month retention.
[Amplitude, the 7 percent retention rule](https://amplitude.com/blog/7-percent-retention-rule) (vendor).
Across 93 mental health apps, median 15 day retention was 3.9 percent and 30
day was 3.3 percent. [Baumel et al. 2019, JMIR](https://www.jmir.org/2019/9/e14567/),
already cited in `reviews/SIM-ninety-days.md`.

**R18. The category's own retention machine, and which half we refuse.**
Duolingo grew daily users about four and a half times over four years on
leaderboards, notifications rebuilt around relevance and timing, and the
streak. [Lenny's Newsletter, How Duolingo reignited user growth, Jorge Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth).

- **Take.** Notifications chosen for relevance and timing, not volume. For us
  that is one channel: the ritual, at the time the person set.
- **Refuse.** Leaderboards, because a rank against other people is refused on
  the funnel brief, and the loss framed streak, which `reviews/game-design.md`
  finding 2 and the ritual spec already ruled against.

**R19. Get to a felt thing fast.** Reviews of Headspace name getting a new
person breathing within about thirty seconds, and a short structured course
that removes decisions. [Pauso, meditation app retention](https://www.pauso.com/blog/meditation-app-retention-rates) (secondary);
[Behind Login, Headspace onboarding](https://behindlogin.com/news/headspace-onboarding-a-ux-journey-that-welcomes-and-delights/) (secondary).

- **Take.** His signal test, round JP, is ours, and it is better, because the
  felt thing is also the proof: *"If you felt that, that's the mind-body
  connection."* Two minutes, in the body, before any reading.

---

## 3. Who, the pain, and the allure

### The segment, by grid level

From `BUYERS.md`, and the curve decides it.

| Level | Who | Role in this funnel |
|---|---|---|
| 7, Tuned | The creative under load, 85 percent | **Primary.** Best size times conversion. Attention is their working material, so *"your attention back"* is their pain in their words |
| 6, Receptive | Exhausted by gurus and talk therapy, 65 percent | **Largest real opportunity.** Buying a mechanical roadmap to stop the loop. The pain is the loop, and attention going back to it |
| 8 to 10 | Practitioner, engineer, systems hacker | **Beachhead.** Need no persuasion; need the open tables and the error bar |
| 4 and 5 | Frustrated, Searching | **Not the top of the funnel.** Largest population and hardest sell. Warning below |
| 1 to 3 | Fragmented, Numb, Defensive | **Not the market.** Level 1 gets no hook ever (`refuse.js`) |

**The warning about the attention line.** *"Your attention back"* is the
digital wellbeing shelf: screen time apps, focus apps, meditation. That shelf
draws level 4 and 5 hard, because it sells relief with no work, and those are
the two levels the grid says abandon at the physical practice. So the line
pulls the widest top of funnel this product has ever had, and a large share of
it is the wrong buyer. Use it as the pain the page opens on, and put the
instrument, the work and the error bar directly under it, so level 5 leaves on
the landing rather than on day four.

### The pain, in their week, not in our words

His instruction is *"speak directly to their pain."* The pain for level 6 and
7 is not "distraction." It is the moment before it:

    You reach for your phone before you notice why.

That moment is the bridge from his line to the product's mechanism. The
product's claim is that a held charge pulls; the phone is where the pull
discharges. The line names the moment, and the test shows where the charge
sits. It does not claim to measure attention.

### The allure, which has to be felt and not described

**Coherence is an abstract word to a ten year old**, and the voice gate agrees:
it matches the abstract lexicon. So *"curious about their coherence"* cannot
be done by naming it. It is done by showing it, in this order:

1. **The body answers a thought.** His signal test as the cold opener: *"Think
   yes ten times. Feel where it lands. Now think no."* Ten seconds, captioned,
   no sound needed. The viewer does it while watching. That is content that is
   the product.
2. **Somebody else's ring.** The seven band ring filling on a reference
   reading, with its number. `funnel/ring.js` draws it (BUILT). This opens the
   gap in R3: now the stranger knows what a coherence reading looks like and
   does not know theirs.
3. **The question.** *"A hundred questions. One number. Where it sits in your
   body."* Then the test.

*"Something they want to want"*: his phrase, and it is the right bar. Nobody
wants a diagnostic. People want to be the person who knows where their pull
comes from. The ring and the body map are the object of that want, which is
why they lead and the words follow.

---

## 4. "This tool is a counter, this gives you your attention back"

**Is it already in `LINES.md`?** No. Searched the repository for *attention
back*, *your attention* and *a counter*: the only hit is `TASKS.md` JP itself.
This is new positioning language from him this round. Logged in `LINES.md`
section 8 with the other lines of the round.

**The gates, run 27 September, one line at a time.**

    node marketing/refuse.js "<line>"
    python3 .claude/skills/atuned-voice/check.py --line "<line>"

| Line | refuse.js | Voice gate | Abstract rate |
|---|---|---|---|
| His: *This tool is a counter, this gives you your attention back.* | passes all 9 rules | no hard failures | 100 percent, one sentence: *attention* matches the suffix list |
| Ours: *It gives you your attention back.* | pass | pass | 100 percent, same word |
| Ours: *Your phone is built to take your attention. This is built to give it back.* | pass | pass | 50 percent |
| Ours: *A session ends when the list ends.* | pass | pass | 100 percent, *session* |
| Ours: *You reach for your phone before you notice why. Where does the why sit?* | pass | pass | 0 |
| Ours, failed on truth: *It ends. Nothing in it is built to keep you here.* | pass | pass | 0 |

The abstract rate is a rate and never a failure by the gate's own design.
*Attention* is a word a ten year old uses ("pay attention"), so that flag is
read and set aside, not obeyed.

**The gates are not the verdict, and the last row shows why.** It passes both
and it is false: `CLAUDE.md` says the gamification *"exists to keep that
turning"*, so the product is, in part, built to bring a person back. It is
refused here by reading it, which no regex can do.

**Where his line may go.**

- **Byline: yes.** His, under his name, as the reason the product exists now.
- **Page: yes, with the proof beside it, and only in the form that describes
  the design rather than an outcome.** *"Built to give it back"* is a claim
  about how the product is made, and it can be checked on screen: no feed; a
  release run has a stated dose, two counters and a two minute close; the only
  thing that reaches a person outside the app is their own ritual, at the time
  they set (his ruling). *"Gives you your attention back"* as a result is an
  outcome claim the instrument cannot show, because it does not measure
  attention (R6).
- **Cold: only as the pain, never as the promise.** Cold, the line is the
  question *"You reach for your phone before you notice why. Where does the
  why sit?"*, which makes no claim.

**The objection, answered in the material.** The word *counter*. He means a
counter measure, an answer to the feed. A stranger on the attention shelf reads
*a counter* as a tally, which is what screen time apps are: Opal counts your
minutes. And inside this product *counter* already means something else: the
release shows two counters ticking, and the vault prints a count. So *counter*
alone, cold, sells us as another screen time tracker. Keep it verbatim under
his byline, where he is heard saying it. On a page, use the sentence without
it, or give the word its object: *a counter to the feed.* Question 6.

---

## 5. The flow, screen by screen

Two halves, the web and the app, joined at one seam. Status on every step.

```
  WEB                                                   APP
  ---                                                   ---
  F1 the feed moment                                    A1 open, Home Screen
  F2 the landing, four seconds                          A2 sign in, same email
  F3 the signal test, optional                          A3 the reading is already here
  F4 name and email                                     A4 the signal test, two minutes
  F5 the welcome slides                                 A5 day one: one story, one release
  F6 the test, 100 questions, ring filling              A6 set the ritual: when, where
  F7 the reading, on the web                            A7 the first week: seven days
  F8 the record goes to the store  ===== the seam ====> A8 day eight to day one hundred
  F9 "Open the app"                                     A9 day one hundred: the test again
```

### The web

**F1. The feed moment.** NEW. Three seconds, captioned, no logo first (R4).
Two openers, both content that is the product:

- The signal test: *"Think yes ten times. Feel where it lands. Now think no."*
  The viewer does it.
- The ring filling on a reference reading, landing on its number, then the
  body map lighting where the load sits.

Line under either, cold safe: *"You reach for your phone before you notice
why. Where does the why sit?"* Channel is `MARKETING-social.md`, which waits
on the domain.

**F2. The landing, first four seconds.** BUILT as `funnel/index.html`, PARKED
at IB. The page leads today with *"Mindset programming."* and his narrative
beats. NEW recommendation: the first screen carries the pain line and the
instrument moving, and nothing else: his line or its page form, and the ring
on a reference reading. The argument order in `reviews/funnel-strategy.md`
section 9 stands behind it unchanged.

**F3. The signal test on the web.** NEW for the funnel; HIS for the app, round
JP; drawn in `proto/onboarding-storyboard/`. Offered on the landing as *"Try it
first, two minutes"*, never as a gate before the test. It makes coherence felt
before it is named, which is the allure he asked for.

**F4. Name and email.** DRAFT, not built (`DESIGN-funnel-welcome.md` section
1). **Where it sits is OPEN**, question 2: his FH brief put it before the test;
the strategy put the number first and the email after. His words this round,
*"log into the app with their email from the quiz"*, need the email somewhere
in the web half and settle nothing about which side of the number it goes.

**F5. The welcome slides.** DRAFT, `DESIGN-funnel-welcome.md` section 3.
Three slides; how many is his, item 16 there.

**F6. The test.** BUILT. 100 questions, one per screen, five answers, the ring
fills as a person answers, stop and come back. **Missing:** the duration is
not stated anywhere a person sees before starting (checked on
`funnel/index.html` and `quiz.html`). Measure it on the 100 question build,
then print it. NEW.

**F7. The reading, on the web.** BUILT (`quiz.html` `viewRead`), content RULED
(`DECISIONS.md`, "The quiz result page": the coherence score, what CQ, DQ and
SQ mean, how it lands, what the app carries). Paying the number here, before
the install, is the strategy's single highest value change and it is already
the build.

**F8. The record goes to the store.** BLOCKED. Today the record is a download,
`atuned-record.json` (BUILT). His *"the data gets to the database"* needs
`AW1`: the database, the provider, the region, the repository made private,
and `RECORDS_KEY`. Two shipped lines become false the day this ships: *"This
page makes no request of any kind"* and *"Nothing you answer leaves this
browser."* Both replacement lines are drafted and gated in
`DESIGN-funnel-welcome.md` item 15.

What goes is the record, never the story: `DECISIONS.md` holds that the
record and the story are never held joined. The quiz carries laws and charge,
no story, so it fits.

**F9. "Open the app."** NEW. One button, on the reading. On a phone it carries
one more line and one more tap: add to the Home Screen. The reason is given
plainly, because it is true and it is the person's interest: *so your reading
stays on this phone, and so your ritual can remind you* (R10, R11).

### The app

**A1. Open, from the Home Screen.** NEW as a step. Needs a web app manifest,
and push needs a service worker. **Both are a second file** against the one
file rule, which is already open in `DECISIONS.md`: *"Whether push may add a
second file, against the one file rule."*

**A2. Sign in with the same email.** Shell BUILT (`ui/account.js`); live sign
in BLOCKED on `AW1`. His words make it the first thing a funnel arrival does:
*"then they log into the app with their email from the quiz, and then they're
off to the races."* That answers, for this path only, the onboarding
storyboard's open question *"Where does sign in go: before Hello, or after the
first turn?"* A person who arrives without the quiz still has that question
open. Password or one time code is question 4.

**A3. The reading is already here.** The record is fetched at sign in, the one
network seam `CLAUDE.md` allows, and goes through `validateProfile`, the
boundary (BUILT). Day one opens on the person's own ring and body map, not on
an empty Field. That is the endowed head start in R14, earned.

**Found while writing this, and checked against a known good case.** A
quiz record does **not** earn the *Laws measured* mark, whose words are *"The
intake is complete, so integrity is measured rather than assumed."* The web
test answers all 21 laws, and `quiz.html` `scored()` fills `p.laws` and the
nine axes, but never stamps `p.intake.completedAt`, which is what the mark
tests (`engine/ladder.js`, mark `laws`). Probed on the committed `engine.js`:
a quiz shaped record with all nine axes weighted earns `nine` and not `laws`;
the same record with `completedAt` set earns both. So a person who answered a
hundred questions arrives with no credit for them. Whether the web test counts
as the intake is not marketing's call and may not be a simple yes, because
the app's own intake asks the laws differently. Question 5.

**A4. The signal test, two minutes.** HIS, round JP, in
`proto/onboarding-storyboard/`. The first felt thing, inside two minutes
(R19). If they did it on the web at F3, it is offered, not repeated.

**A5. Day one: one story, one release.** BUILT pieces: the Story page with the
bank and the vault, and the release. The loop turns once: discover (write one
thing from this week that is still on you), play (see where it landed), flow
(a release at the smallest dose, 25), embody (the completion line and the Felt
marks, then two minutes of settling). **The first aha is the vault leaving
zero.** One count, going up, on a control the person can open and check.

**A6. Set the ritual: when and where.** BUILT (`ui/ritual.js`). This is the
Opal move, honestly done (R2, R12): the next day it happens at a time the
person chose. The reminder is the one channel he allows.

**A7 and A8** are sections 6 and 7. **A9** is the close of section 7.

---

## 6. The first week

His words: *"We set them up on the install, or the setup, that they have a
week to use the app."* What *"a week"* means is question 3, and there are four
readings. The design below works under all four, because the week is the
unit a person can see the end of, and a thing that ends cannot be a guilt
engine (`reviews/SPEC-ritual-accountability.md`).

**The week is seven days, printed as a day number from 1 to 7, and nothing
else.** No consecutive count, no best ever, no sentence about a missed day.
That is the ritual spec's ruling and it is the right one.

| Day | What opens | What it asks | What the person gets back |
|---|---|---|---|
| 1 | Their own reading, from the test | Signal test, one story, one release at 25, set the ritual | The vault leaves zero. *"You may not have felt them all. Mark the ones you did."* |
| 2 | Yesterday's release, with what they marked Felt | The ritual, at their time | The week strip shows two days. Day two must not open on the same screen as day one: that was the largest single leak in `reviews/SIM-ninety-days.md`, 149 of 617 |
| 3 | A prompt drawn from their own story cloud | A second story | Where it landed, beside where the first one landed. The first *play* that compares |
| 4 to 6 | The ritual | One release a day, the dose their choice | The vault count; the release summary broken out by saboteur and complex, BUILT |
| 7 | **The week's reading** | Nothing new | Day one against day seven, two snapshots side by side (`ui/record.js`, BUILT), and one sentence of what moved. It is the share moment, and it is content that is the product |

**What makes it land, concretely.**

- **Day one ends on something counted.** The vault count, not a badge. A mark
  is allowed to follow, *First run* and *First story*, both BUILT.
- **Day seven is a reading, not a reward.** Self monitoring at d 0.40 (R13)
  is the evidence, and the picture is the proof.
- **A person who misses days finishes the week anyway.** The week ends on day
  seven whether they came every day or twice. The *Seven days* mark does need
  seven in a row (`best>=7` in `engine/ladder.js`), while the streak itself
  forgives a miss on Lally's finding (R15). That is a real tension, named as
  question 7, and not a defect: the mark's copy, *"Seven days in a row"*, is
  accurate to its rule.
- **The reminder names the practice and never the gap**, and fires only
  while a week is running. Ruled in the ritual spec. After a gap, the next
  Monday is a new week, a fresh start (R16), and nothing mentions the gap.

---

## 7. Day eight to day one hundred

A hundred days is fourteen weeks and two days. It covers the median habit in
Lally's data and most of its range (R15). The arc is weeks, each one closing
on its own reading, and three landmarks.

| Span | What carries it | Built |
|---|---|---|
| Weeks 2 to 4 | The loop turning weekly. His round JP words for the avatar: *"a tick per cycle as well. And I want three cycles, three revolutions per cycle."* The avatar work is in flight with another seat; the funnel only needs the tick to be visible | avatar in flight |
| Day 30 | **The same story, read again.** A person tells the instrument the story from day one and sees two routes through the body. `reviews/game-design.md` calls it the one thing no competitor has the parts to make. `pathOf` computes the route; nothing renders it yet | not built |
| Day 30 | The *Thirty days* mark, if consecutive | BUILT |
| Weeks 5 to 13 | Ground opened: *Ten addresses*, *Fifty addresses*, *Ten stories*, *Five clear*, *Ten snapshots*. These are counts of real work, allowed where a score is not (`docs/briefs/design-gamification.md` 5.1) | BUILT |
| Day 90 | The *Ninety days* mark | BUILT |
| **Day 100** | **The test again.** The same hundred questions, the two rings side by side, day zero and day one hundred | NEW |

**Day one hundred is the result he asked for.** *"It has to provide the
result."* The honest result this instrument can show is the person's own
number, taken the same way twice, a hundred days apart, with the ring they
saw on day zero drawn beside the one they see now. It is self report
measured twice, and says so. It is also the strongest piece of marketing the
product can make, because it is the person's own reading and they chose to
take it.

**The mismatch to rule.** The marks end at ninety days; his arc is a hundred.
Question 8.

---

## 8. The arithmetic

Mine, labelled, and every input named. No cost per click is sourced here, so
the output is a ceiling, not a forecast.

    revenue per click  =  click to paid  x  price per month  x  months paid

- **Click to paid, 0.7 percent.** `reviews/funnel-strategy.md` section 3,
  modelled on 19 September on a 63 question test. Not re-measured.
- **Price.** The ladder ruled at 12, 24, 36 and 99 a month (`DECISIONS.md`).
- **Months paid.** The input nobody wants in the model. A person who reaches
  day one hundred on tier one has paid about three and a third months.

| Tier | Months paid | Revenue per click at 0.7 percent | Click to paid needed at 1 dollar a click |
|---|---|---|---|
| One, 12 | 3.3, one hundred days | about 28 cents | about 2.5 percent |
| One, 12 | 6 | about 50 cents | about 1.4 percent |
| Four, 99 | 6 | about 4.16 dollars | about 0.17 percent |

Payment fees are left out, which flatters every row.

**What would have to be true.** Paid spend on the consumer rungs works only if
click to paid rises about three and a half times, or people stay well past a
hundred days. So the hundred day arc is not a retention nicety. **Months paid
is the multiplier in the only equation that decides whether this funnel can
be paid for.** Until then the conclusion in `reviews/funnel-strategy.md`
stands: referral is the channel, and paid spend pays for itself only aimed at
practitioners. The referral mechanic and the ruling that the funnel record is
*"not a list"* cannot both stand as written; that collision is already open
in `DESIGN-funnel-welcome.md` item 13.

---

## 9. Questions for him

Each is open. None is answered for him by default.

1. **Is the funnel back on, as a build, or only as a strategy?** At round IB:
   *"Don't touch the funnel. That's a waste of credits."* This round: *"Then
   we get them to our final, the data gets to the database, they get into the
   app."*
   - **Strategy only.** This file is the answer; nothing is built. Costs
     nothing now; the funnel keeps its gaps, including no email capture.
   - **Build the web half.** Capture, welcome, the stated duration, the Home
     Screen step. Buildable now; still ends on a download, because the store
     is blocked.
   - **Build all of it.** Waits on `AW1` and the repository going private.

2. **Where does the email go: before the test or after the number?** His FH
   brief: name and email, then the test. The strategy: the number first, no
   email, then *"keep your record"* with the email.
   - **Before.** Every finisher is reachable for sign in. Costs the people who
     will not give an address to a stranger before seeing anything:
     `RESEARCH-icp.md` has Diane and James walking at that step.
   - **After the number.** Pays the promise first; the email is asked for as
     the key to keep the record, which is its only permitted use. Costs the
     people who take the number and leave, whom the strategy counts as the
     referral.

3. **What does "a week to use the app" mean?** *"We set them up on the
   install, or the setup, that they have a week to use the app."*
   - **A first week programme.** Seven days, as section 6. No money attached.
   - **A trial.** There is none by the offer spec, and two months free is out.
     A seven day trial would be new and his.
   - **The one week money back guarantee.** Already open as `CO` and `DJ`,
     including when the week starts. The install is a natural start.
   - **A deadline to open it.** Safari erases the record after seven days of
     use without a visit (R11). If this is the meaning, the Home Screen step is
     the answer.

4. **Sign in by password or by a code sent to the email?** The shell has a
   password field. His words, *"log into the app with their email from the
   quiz,"* mention no password.
   - **A code or link to the email.** No second sign up, which is what he
     described; it also closes the *email is the only key* objection. Costs a
     mail sending service on the server side and depends on deliverability.
   - **A password.** No mail service. Costs a sign up step at the exact moment
     the person has just finished a hundred questions.

5. **Does the web test count as the intake?** A person who answers all 100
   arrives without the *Laws measured* mark, because the web record never
   says the intake is complete.
   - **Yes.** The mark lands on arrival, an earned head start. Costs a ruling
     that the web test and the app's intake measure the same thing.
   - **No.** The mark waits for the app's intake. Costs a person who already
     answered a hundred questions being asked the laws again.
   - **A separate mark for the web test.** Honest to both. Costs a seventeenth
     mark.

6. **The word "counter".** *"This tool is a counter, this gives you your
   attention back."*
   - **Keep it, byline only.** His voice, where he is heard.
   - **"A counter to the feed"** on pages, so the word carries its object.
   - **Drop the word outside the byline.** The page says *"It gives you your
     attention back"* with the design proof beside it. Costs his exact phrase.

7. **The first week mark needs seven in a row; the streak forgives a miss.**
   *Seven days* reads *"Seven days in a row."*
   - **Keep it.** Accurate, and a real achievement. Costs the person who
     misses day four: the week's only mark is gone by Thursday.
   - **Make it seven days in the week**, any seven of seven, matching the
     week. Costs the mark meaning something harder.

8. **Ninety days or a hundred?** His brief: *"They use the app for 100 days."*
   The marks end at *Ninety days*.
   - **A hundred.** The last mark and the re-test land together on day one
     hundred. Costs a change to a shipped mark.
   - **Ninety.** Keep the mark; the re-test is at ninety. Costs his number.
   - **Both.** The mark at ninety, the re-test at a hundred. Costs a ten day
     gap between two endings.

9. **May the email do anything but sign in?** `DECISIONS.md`: *"The funnel
   record exists only to hand back to the person. It is not an asset, not a
   list, not a segment."* And: *"The ritual ... is the only thing I want so far
   talking directly to the customer outside of the push notification."*
   - **Sign in only.** As ruled. Retention runs on the app, the Home Screen
     and the ritual reminder. Costs the person who never adds it to their Home
     Screen: nothing reaches them.
   - **Sign in, plus the day seven reading by email.** One message, content
     that is the product. Costs an exception to the ruling.
   - **A welcome sequence.** What most funnels do. Costs the ruling outright.

---

## What was run

    27 September. Every line in section 4 and in LINES.md section 8, his and
    ours, through node marketing/refuse.js and check.py --line, one at a
    time. No refusals and no hard failures. One line of ours passes both and
    is false, and is refused by reading it: section 4.

    27 September. The mark probe: committed engine.js, a profile shaped as
    quiz.html scored() builds it, ladderRead. Checked against a known good
    case first: the same profile with intake.completedAt set earns the laws
    mark, so the probe can see it. Section 5, A3.

    27 September. node marketing/tests.js and check.py --objections, after
    writing, recorded in the commit.
