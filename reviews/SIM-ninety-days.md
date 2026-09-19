# The Ninety Day Onboarding Simulation

Day one, day three, day seven, day thirty, day ninety. Fourteen people in the
roster, each at the reading this build actually gives them. What they do, what
they see, where they stop, and the sentence that stops them.

Run under the UI and UX seat, from the build and not from the documents.

    build      commit 124421d plus an uncommitted working tree
    file       source.html, 1,190,443 bytes
    md5        f304c29532ea8c2dfa9c683fab5b8051
    driven     Chromium 1194, file://, 1600x1000 and 390x844
    boot wait  7,400 ms on every session
    errors     zero page errors across every session below
    requests   three, all local: the file and the two rasters

---

# 1. What The Quarter Simulation Already Covers

`reviews/simulation-quarter.md` is 1,249 lines and it is a good document. It is
not repeated here. What it established, and what stands:

- The method, the three classes of figure, and the honesty framing. Reused.
- The content inventory. About 123 minutes of first pass content, measured, and
  the finding that the bottom of the product is reached inside session one.
- The eight hour finding and the case for a daily ceiling. Unchanged and
  unbuilt.
- The grades, the minutes scale, and the willingness to pay window.
- Twelve numbered defects, D1 to D12.

**Six of those twelve are now closed in this build and the closures are real.**

| Was | Now, measured this session |
|---|---|
| D1, the two Summary actions wired to nothing | Fixed. `data-sout` has a handler at `ui/summary.js:613`. Both fire |
| D2, three ICPs told "Nothing is carrying" with no action | Fixed for the copy and the action. Sofia reads "Nothing is held above the line, so nothing is reaching the body as load. There are 52 addresses carrying under it, which is signal and not yet cost", and is offered "Answer the laws" |
| D3, a 168 token vocabulary that read nothing out of ordinary writing | Widened. `died`, `lied`, `exhausted`, `terrified`, `have not slept`, `chest is tight`, `jaw is tight` all match now |
| D6, the reward curve returning 0.00 from run three | Fixed at the cliff. `#bRel` falls back to `sq>0` and the code comment names the old failure by name |
| D8, the fourth door a dead end | Fixed. All four doors are real buttons |
| D13, no stated duration on the intake | Fixed. "about fifteen minutes for all of it", plus "N answered, M left" and a bar |

Undo also exists, works, and is in the top bar with redo beside it.

**That is the good news and it is substantial. This document is about what the
build does now, which is different, and in two places worse.**

The app no longer opens on Summary. It opens on Field, ruled. Ritual is a
primary tab, second in the bar. The bar is nine. The record, the streak and the
accountability line live on Compass. A release now repoints the profile before
it writes. Every one of those changes moves the onboarding, and none of them is
in the quarter simulation.

`RESEARCH-icp.md` covers everything before the app opens: the ad, the landing
page, the quiz, the email, the result page, and who walks at which step. That
is not repeated either. This document starts at the moment the file is open.

---

# 2. Method

What was actually done. `source.html` was built with `./atuned_src/BUILD.sh` and
driven in Chromium at `/opt/pw-browsers/chromium-1194`, from `file://`, at
1600x1000 and 390x844, across nineteen driving sessions. Every surface was
rendered and the images were looked at. The boot was captured at 150, 600,
1500, 3000, 5000 and 7200 milliseconds and the frames were read. The intake was
completed end to end through the real controls, twice, once with a uniform
answer and once with a random one. Ten pieces of ordinary first person writing
were put through the shipped `parseStory`. Six were typed into the real text box
and committed through the real button. The release was run to exhaustion from
six different loaded profiles and from a person's own field. Undo was exercised
across a release and the ledger was read on both sides of it. A ritual was
saved, backdated by a day and by three days, and the Compass record was read at
each point. The page was reloaded to test the day two return.

The profile select prepends a "You" profile, so a reference case at index `i` in
`engine/data/people.js` is index `i+1` in the browser. Every reading below was
taken with `loadP(i+1)` followed by `compute()` and `accuracy(r)`, read off the
live build. No level was assumed.

Three classes of figure, labelled every time.

| Label | What it means |
|---|---|
| **measured** | Executed this session in this build and read off the DOM, the console or the CSS. A fact about the file |
| **cited** | Published outside this project, with the source named |
| **judgement** | Model output. A reasoned estimate with arithmetic attached. Not evidence about any human being |

**Every quotation is judgement. Nobody named below exists.** The roster and its
charge vectors are the ones in the repository. Their `says` lines govern their
behaviour. Nothing here contradicts their data.

**The weights are carried over from the quarter simulation** so the two
documents can be compared line by line: Diane 180, Derek 170, Marcus 160,
Angela 150, Sofia 140, James 100, Ana 50, Gordon 35, Rosa 15, against a thousand
arrivals. The four reference cases added since, Tomas, Nkem, Wren and Abraham,
are not given market share. Tomas and Nkem sit inside Ana's 50, because they are
the same segment at a different depth, and inventing new share for them would be
inventing a market. Lance is the owner.

**There is no instrumentation in the product**, so every retention figure is
derived from a measured product fact plus a persona vector, and the derivation
is shown so it can be argued with.

---

# 3. Day One, Measured Before Anybody Speaks

## 3.1 The Boot

Read off the keyframes at `shell/head.html:2811` to `:2903` and confirmed
against frames captured at six moments.

| Second | What is on the screen |
|---|---|
| 0.00 | Black |
| 0.62 | A dot begins to grow at the centre |
| 0.92 | A vertical spine draws through it |
| 1.50 | "Press anything to go straight in" fades up to 0.62 opacity |
| 1.92 | A ring draws around the spine, over 1.55 seconds |
| 3.22 | A halo |
| 3.54 | The wordmark begins to fade up, over 0.92 seconds |
| 4.46 | "Atuned / Source OS" is fully legible for the first time |
| 4.62 | The sheet begins to fade out |
| 5.20 | The app is uncovered |

**The first four seconds of a stranger's relationship with this product contain
no word saying what it is.** They contain a dot, a spine, a ring and a halo. The
only text before second 3.5 is an instruction for leaving.

The first four seconds decide whether there is a fifth. This build spends them
on a logo animation and then tells the person its name at 4.46 seconds, by which
point a meaningful share of them have already decided the page is broken or
still loading. The skip works and is honest, which is worth saying, but a skip
control at 0.62 opacity reading "press anything" is not an answer to "what is
this", it is an answer to "how do I leave".

`prefers-reduced-motion` removes the whole sheet, which is correct.

## 3.2 The Landing Surface

**Measured.** The app opens on Field, tab integer 2, on the owner's ruling.

What is in the first viewport at 1600x1000, on a genuinely blank profile:

- Nine tab names across the top.
- A profile select reading "Custom", with thirteen other people's names in it.
- Undo, redo, a theme menu, a help button, an account button.
- A sub bar reading "Charge".
- A left rail carrying Orientation, Balance, four Root Domains, nineteen
  Blueprint Domain icons, eleven Primary icons and the top of Secondary.
- A centre stage with eight metric chips, all reading a dash or 0.0, the words
  "not read yet", and "Nothing read yet, so there is no split to show."
- A wheel with nothing in it, labelled "112 addresses, SQ, 0 loaded",
  "saboteurs, 0", "21 laws, integrity 6.0".
- A vertical slider reading "swing 13" against a scale of 40, 50, 60.
- A right rail reading "not read yet", then "Reading", then "Where To Start:
  Nothing has been read yet. Four ways in, and none of them asks you to know
  anything first", then the four doors.
- An identification control at the bottom of the stage.

Four numbers are on screen about nothing: **72 and 28** on the Orientation
slider, and two **0.0** chips. Three separate phrases on the same screen say
nothing has been read. The instrument's own best sentence, "a number off a
default is a number about the default and not about you", is on Summary, which
is not this screen.

## 3.3 The Count

**Measured.** Visible interactive elements, blank profile, counted as buttons,
selects, inputs, links, anything with a role or a tabindex, and every element
carrying a click data attribute.

| Surface | On the surface | In the first viewport at 1600 | In the first viewport at 390 | Words |
|---|---|---|---|---|
| Knowledge | **213** | **100** | 28 | 1,259 |
| Summary | 135 | 81 | 15 | 727 |
| Energetics | 126 | 89 | 17 | 908 |
| Story | 111 | 95 | 23 | 477 |
| Body | 111 | 70 | 22 | 520 |
| Ritual | 110 | 87 | 18 | 695 |
| Compass | 102 | 86 | 16 | 549 |
| **Field, the landing** | 101 | **71** | 20 | 422 |
| Games | 94 | 78 | 16 | 546 |

The working floor for a screen a person is trying to use is twelve simultaneous
choices. Working memory holds about four. **The lightest surface in this product
presents 71 on arrival and the heaviest presents 100.**

**Forty five controls on every single surface are explained only by a `title`
attribute.** That number is identical on all nine, which means it is the chrome:
the top bar and the left rail. A phone has no hover, so on a phone those forty
five controls have no explanation at all.

On Summary, forty four visible interactive elements carry neither text, nor a
title, nor an aria label.

## 3.4 The Phone

**Measured at 390x844.**

The tab bar has a `clientWidth` of 348 and a `scrollWidth` of 724.

| Tab | Left edge | Right edge | Visible |
|---|---|---|---|
| Energetics | 21 | 118 | yes |
| Ritual | 123 | 185 | yes |
| Story | 190 | 251 | yes |
| Field | 256 | 312 | yes, and it is where the app lands |
| Body | 317 | 376 | cut at 348 |
| Compass | 381 | 469 | no |
| Knowledge | 474 | 575 | no |
| Games | 580 | 651 | no |
| Summary | 656 | 745 | no, and its left edge is 308 pixels past the edge |

**Four of the nine doors are entirely off screen and a fifth is cut in half.**
The affordance is a 26 pixel gradient mask on the right edge, removed once
scrolled to the end. There is no scrollbar: `#tabbar::-webkit-scrollbar` is
`display:none`. There is no arrow and no count.

Above the tab bar, and below it, the phone spends 265 pixels of an 844 pixel
screen on chrome before any content: the wordmark at y 17, the tab strip at y
67, and at **y 142, full width, forty four pixels tall, the profile select**.
The second thing a stranger sees on a phone is a control offering to make them
somebody else. James has refused at that control in every panel ever run and the
control has not moved.

**The four doors, which are the only instruction in the product, sit 3,098
pixels down a 5,818 pixel scroller on the Field surface.** That is roughly four
full screen flicks past a wheel with nothing in it. On desktop they are at x
1,287, visible on arrival, which is why this defect is invisible to anybody
reviewing on a laptop.

## 3.5 The Screen The Product Should Open On

**Measured.** Summary at 390x844, blank profile, top of the surface:

> Coherence, Not Read Yet
>
> Nothing has been entered, so there is nothing to read. The arithmetic
> underneath works and it is not being shown, because a number off a default is
> a number about the default and not about you.
>
> Where To Start
> Four ways in. None of them asks you to know a term first, and any one of them
> fills this page.

Then the four doors, in the first two screens, at full width, readable.

That is a first screen. It says what this is, it refuses to lie, it says what to
do, and it fits a phone. **It is the ninth tab, 308 pixels off the right edge of
a strip with no scrollbar, and the app does not open on it.**

## 3.6 The Three Ways In, Each Driven To Its End

### Path one. The intake

**Measured, driven through the real controls.**

The surface opens with an identity block: first, middle and last name, sex at
birth, date of birth, time of birth with an "I do not know it" control, place of
birth as free text, and a Myers-Briggs select with a well written paragraph
explaining that a four letter type is the ego's own account of itself.

Then the frame, and it is now right: "about fifteen minutes for all of it, in
any order. Stop whenever and come back." A progress bar. A line reading
"0 answered, 63 left, 0 laws measured, 21 still at the default."

Twenty one law cards. `IQ_OPEN` is a single integer, so one card is open at a
time, showing three questions side by side with eleven buttons each, which is 33
answer buttons on screen.

- **Three answers, four clicks, about thirty seconds of work.** The unread gate
  releases. The dash is replaced by a band word and a percentage. Identification
  reads **22.1 percent, plus or minus 19.0**.
- **Every question answered: 85 clicks.** Twenty one card opens plus sixty three
  answers plus one. Identification **48.8 percent, plus or minus 13.3**.
- Answered uniformly at 6: CQ 36, Incoherent. Answered at random: CQ 23.6,
  Corrupt. **Both give held 0 and carrying 0.**

That last line is the structural finding of this document and it is repeated in
section 9 because it decides everything downstream.

The reading a completed intake produces ends with:

> Release This First
> Nothing is carrying
> No address is holding anything

And the release control, pressed, answers:

> Nothing is held above the line, so there is nothing to release. Write a story
> or set a charge first.

**Fifteen minutes of honest self report ends in a verdict and an instruction to
go and do a different exercise.** This is the moment in the product where a
person has invested the most.

### Path two. The story, which is door one

**Measured.** Ten pieces of ordinary first person writing through the shipped
`parseStory`:

| Written | What the instrument wrote back |
|---|---|
| My mother died in March and I still have not cried | Separation, Martyrdom, Longing, Closed Heart |
| I am exhausted and there is nothing left for anyone | **Pride** |
| My partner cut me out of the deal and my jaw is tight | **Spiritual Language To Manipulate, Excuse, Deceit, Lying** |
| I lied to my wife about the money for a year | Spiritual Language To Manipulate, Excuse, Deceit, Lying |
| I had a panic attack in the car park | Fear, Control, Insecurity, Scarcity |
| I screamed at my son and I hate that I am like my father | **Pride, Arrogance, Competition, Anger** |
| I cannot make payroll this month and I have not told the team | nothing |
| She left in February and I keep the ring in the drawer | nothing |
| My father has dementia and does not know me and I visit anyway | nothing |
| I drink every night and tell myself it is fine | nothing |

The vocabulary is wider. The mechanism is unchanged. When a somatic word maps to
a seat and no emotion adjective is recognised, the seat's modal family fires and
the top four addresses by susceptibility are written. "Jaw is tight" maps to the
throat. The throat's modal family is Deceit. **One sentence about a tight jaw
still returns four accusations of lying, and "I am exhausted" still returns
Pride.**

Four of ten produce nothing at all, which is now honest silence rather than a
guess, and that is an improvement.

Then the commit, driven through the real button with a realistic sentence:

> My partner cut me out of the deal in January. My jaw is tight all day and I
> have not slept properly since.

- The panel reads **"Imprints, 0 And 8 Pending"** and shows two words repeated
  four times each: Fear +1.7 four times under Root, Disgust +1.8 four times
  under Throat.
- The button reads **"Commit 8"**.
- After the commit: 27 addresses carrying, **held 0**, and **`unread` is still
  true**.
- The story surface's own release panel reads "Nothing is held above the line
  yet, so there is nothing to release" and "Nothing to run", with the button
  disabled.

**A person writes a true thing about their life, commits it, and the instrument
still says nothing has been entered.** The gate is `sq>=4`. The story lands the
charge below it.

A denser story does clear it. "I am terrified and ashamed and furious. My chest
is tight and my jaw is tight and I have not slept. I lied. I am exhausted and
disgusted and afraid." commits 16 imprints, puts three addresses above the line
and prints CQ 33.76. **So door one works, for writing that is unusually dense in
emotion adjectives, and fails for writing that sounds like a person.**

### Path three. The dropdown

**Measured, and this is the worst thing in the build.**

A curious person loads a reference case to see what a reading looks like. On a
phone that control is the second thing on the screen. They get a complete,
impressive reading. Then they press the one primary action the product offers
them, "Run a release".

`relCoolDown` calls `toYou()` before it reads the number, before it takes the
undo point, and before it writes.

| Loaded | CQ before | Carrying before | After one press |
|---|---|---|---|
| Sofia | 57.18 | 52 | CQ **42.31**, carrying 0, profile "Custom" |
| Diane | 28.65 | 91 | CQ **42.42**, carrying 0, profile "Custom" |
| Marcus | 39.17 | 99 | CQ **42.40**, carrying 0, profile "Custom" |
| Derek | 15.50 | 90 | CQ **42.40**, carrying 0, profile "Custom" |
| James | 12.79 | 90 | CQ **42.44**, carrying 0, profile "Custom" |
| Ana | 7.63 | 107 | CQ **42.38**, carrying 0, profile "Custom" |

Every person, whoever they were looking at, lands on the same number. The
profile select changes under them without a confirmation. The field they were
looking at is gone from the screen. And on the second press:

> Nothing is held above the line, so there is nothing to release.

The comment above the repoint is honest about its own intention: the person who
ran it is the person who is charged. The intention is right. The effect, driven,
is that a person who has entered nothing presses the only button on the screen
and is given somebody else's release, a number that is not theirs, and a bill.

**The bill is 25 patterns.** Measured: one press spends 25 lines and opens 25
unique ground on the person's own record. `DECISIONS.md` rules the gift at a
hundred. **Four presses spend the whole gift.** The counter that would tell them
lives in Settings, under Billing And Tier, on a surface with no door in the
navigation, and after one press it reads "75 of the gift left".

### The two paths together

Driven from a blank profile: write one ordinary story, commit it, then press the
release control five times, which takes about ten minutes.

| Press | Patterns spent | Ground opened | Snapshots | The reading |
|---|---|---|---|---|
| 1 | 25 | 25 | 2 | not read yet |
| 2 | 50 | 50 | 3 | not read yet |
| 3 | 75 | 75 | 4 | not read yet |
| 4 | 100 | 100 | 5 | not read yet |
| 5 | 104 | 104 | 6 | not read yet |
| 6 | refused | | | not read yet |

**A person can spend the entire hundred pattern gift on day one, in ten minutes,
and never see a single reading.** The release gate fires at `sq>0`. The reading
gate needs `sq>=4`. Two thresholds in the same build, pointing opposite ways,
and the person is standing between them.

### Undo, and the ledger

**Measured.** Undo is built, works and is in the top bar with redo.
`undoState()` captures the nine charges, the nine installed opposites, the
twenty one laws and the soul. It does not capture the meter, the history or the
rituals.

After the fifth press, undo restores one carrying address and leaves the ledger
exactly where it was: 104 lines spent, 104 ground opened, six snapshots. And
because `undoPush` is called after `toYou`, the undo point on a reference case
release is taken **after** the field has already been swapped, so the restore
lands on CQ 42.25 and not on the 57.18 the person was looking at.

**The release is reversible on the field and irreversible on the ledger, and the
only thing a person is charged for is the ledger.**

---

# 4. The Roster At Its Measured Readings

**Measured.** Every figure read off this build by loading the profile and
calling `compute()` and `accuracy(r)`.

| Who | CQ | Band | State | Identification | Carrying above the line | What the product offers them first |
|---|---|---|---|---|---|---|
| Rosa, 61, retired midwife | 100.0 | Mastery | Sovereign | 96.1 plus or minus 4.6 | 0 | Nothing is carrying |
| Abraham, 74, retired judge | 98.3 | Mastery | Sovereign | 93.1 plus or minus 5.1 | 0 | Answer the laws |
| Wren, 66, luthier | 91.7 | Mastery | Sovereign | 84.0 plus or minus 6.7 | 2 | Shame, root seat, holding 4.0 |
| Lance, 54, author | 87.7 | Embodied | Coherent | 96.0 plus or minus 4.6 | 0 | Nothing is carrying |
| **Sofia, 41, practitioner** | **57.2** | Even | Receptive | 82.7 plus or minus 6.9 | 0, and 52 under | Answer the laws |
| **Angela, 36, seeker** | **40.9** | Incoherent | Frustrated | 74.8 plus or minus 7.4 | 0 | Answer the laws |
| **Marcus, 44, creative director** | **39.2** | Incoherent | Frustrated | **57.6 plus or minus 10.6** | 0, and 99 under | Answer the laws |
| **Diane, 46, founder** | **28.6** | Corrupt | Defensive | 74.6 plus or minus 7.4 | 8 | Need For Approval, sacral seat, holding 5.0 |
| **Derek, 39, endurance** | **15.5** | Severe | Numb | 82.0 plus or minus 6.0 | 20 | Need For Approval, sacral seat, holding 6.6 |
| **James, 57, C-suite** | **12.8** | Severe | Numb | 79.0 plus or minus 6.4 | 18 | Blame, heart seat, holding 6.2 |
| Nkem, 35, paediatric nurse | 10.6 | Collapsed | Fragmented | 85.5 plus or minus 5.3 | 41 | Nihilism, crown seat, holding 6.7 |
| Ana, 47, teacher | 7.6 | Collapsed | Fragmented | 84.3 plus or minus 5.4 | 41 | Self-Judgment, heart seat, holding 9.6 |
| Tomas, 58, long haul driver | 2.9 | Collapsed | Fragmented | 83.7 plus or minus 5.4 | 77 | Possession, root seat, holding 8.7 |
| Gordon, 58, managing partner | 1.0 | Collapsed | Fragmented | 82.4 plus or minus 5.6 | 97 | Possession, root seat, holding 9.5 |

Two things to read off that table.

**One. Angela's headline prints "41%" beside the word "Incoherent".** Her CQ is
40.9. `tierOf` bands on the unrounded value and Incoherent runs 31 to 40. The
headline rounds. So the product shows her a number that its own band table says
belongs to the band above. `RESEARCH-icp.md` already records that Angela walks
at the word Incoherent. This build hands her the word and a number that
contradicts it, on the same line.

**Two. These readings are reference cases and no real person can reach one.** A
person's own path through this product, whatever they answer, produces held 0.
The intake writes laws, never charge. Only a story, a wheel drag or a stated
four letter type puts anything on the wheel, and the wheel is where the release
lives. **The six ICP readings in that table are a demonstration, not a
destination.**

---

# 5. Day One, By Person

All quotations are judgement.

## Diane, 46, founder. Weight 180. Level 3 on the grid, Defensive

Desktop, between two meetings. She sees the doors because desktop shows them.
She takes the intake because the duration is stated and the remainder is visible,
which is exactly the two things she asked for and both are now there. She
finishes in eleven minutes because she reads fast and does not deliberate on a
scale.

She gets Incoherent, and under it:

> Release This First. Nothing is carrying. No address is holding anything.

She presses the release control anyway.

> Nothing is held above the line, so there is nothing to release. Write a story
> or set a charge first.

> *Judgement.* "It told me what it would cost before I started, which is the
> first time any of these has done that, and I gave it the fifteen minutes. Then
> it gave me an adjective and told me there was nothing to do about it and sent
> me to a different exercise. I have asked four times for the line that says
> what this is costing me. It has a verdict and no invoice."

**Where she stops: the Summary, at "No address is holding anything", after
fifteen minutes.** She opens it once more at the end of the day and the number
is the same.

## Derek, 39, endurance. Weight 170. Level 2, Numb

Does the sixty three in nine minutes. Gets his number. Then he does what a
pragmatist does with a dropdown full of other people: he opens it, because he
wants to see the range.

He loads a case, presses Run a release, and the profile becomes Custom and the
number becomes 42.

> *Judgement.* "I pressed the one button on the screen and it changed who I was
> and gave me a different number. Then I pressed it again and it told me there
> was nothing to release. I train for a living. I know what a plateau is, and a
> plateau is not a machine handing you a stranger's result and then refusing."

**Where he stops: the release, at the moment the profile select changes under
him.** He does not find the ledger line that says he has spent a quarter of his
gift, because it is in Settings, and he never opens Settings.

## Marcus, 44, creative director. Weight 160. Level 4, Frustrated

Finds the repoint in the fourth minute, because he can see what is wrong with
anything in four seconds.

He reads the best copy in the product:

> Nothing is held above the line, so nothing is reaching the body as load. There
> are 99 addresses carrying under it, which is signal and not yet cost.

Then he writes three sentences about a project going wrong, with the word tight
in them, and is told he runs Spiritual Language To Manipulate, Excuse, Deceit
and Lying.

> *Judgement.* "The paragraph about ninety nine addresses carrying under the
> line is the most honest sentence I have read in this category and somebody
> good wrote it. Then I wrote about being cut out of a deal and it called me a
> liar four different ways. It also prints my identification at 57.6 with an
> interval of plus or minus 10.6, the lowest of anybody in that dropdown, and
> still puts Frustrated on the screen at display size."

**Where he stops: he does not.** He files it and keeps the tab. He is the only
person in the roster whose retention is a function of the team rather than the
product.

## Angela, 36, seeker. Weight 150. Level 5, Searching

Phone only. Lands on Field. The tab strip shows her four names and Summary is
not one of them. The wheel has nothing in it. There is no instruction anywhere
on the screen, because the instruction is 3,098 pixels down.

She scrolls, finds the dials, finds a slider reading "swing 13", and gives up
before the doors. She comes back later, taps along the tab strip, finds
Energetics, starts the questions, answers enough of them, and the headline
reads:

> 41% Incoherent Frustrated

> *Judgement.* "It says forty one and then it says incoherent. I looked up what
> incoherent meant here and it said thirty one to forty. So which am I. I have
> done six of these and this is the first one that told me I was the wrong
> answer and got its own arithmetic wrong doing it."

**Where she stops: the headline, at the word Incoherent beside the number 41.**
She is 150 of a thousand and she is the volume case.

## Sofia, 41, somatic practitioner. Weight 140. Level 6, Receptive, the tipping point

Desktop, late, last client gone. The best reading among the working ICPs. The
reading now tells her what moves it, which it did not before:

> Release has about 1.5 left in it for you. The rest of the reading is
> integrity, and that moves when you answer the laws or when what you do
> changes.

That is the fix she asked for and she notices it. She opens Ritual because it is
a primary tab now and she is the one person in the roster whose job is
prescribing practice. She gets seventeen practices across four tracks, totalling
about 230 minutes, one of them marked "called for", and a line reading "Tier 3
and below."

> *Judgement.* "The drill opens from five places and lands in the same panel,
> and the reading tells me what would move it instead of just naming me. Both of
> those are new and both are right. Then I opened the tab called Ritual, which I
> would be using with a client, and it handed me seventeen practices with no
> order, three of which are twenty minutes, and a line about tier three. I do
> not know what tier three is and neither does anybody I would put this in front
> of."

**Where she stops: she does not.** She stays, and she refers nobody, because
sign in does not exist and the account surface says so plainly: "This record is
in this browser and nowhere else."

## James, 57, C-suite. Weight 100. Level 2, Numb

Refuses at the profile select, which on his phone is at y 142, full width, the
second control on the screen.

> *Judgement.* "There is a menu at the top with thirteen other people's names in
> it and I can be any of them in one tap. If I can be Sofia then the number on
> this screen is not mine. That is the whole review and I have not scrolled."

**Where he stops: the second control on the screen.** Unchanged across every
panel this product has ever run.

## Ana, 47, teacher, one year out. Weight 50. The acute arrival

She finishes everything. She reads Collapsed, and then the best sentence in the
file:

> Weight off, and not alone. A reading this low is not a thing to manage by
> yourself, and the instrument will not pretend otherwise.

Then she reads "Release This First: Self-Judgment, heart seat, holding 9.6" and
presses the button under it, and the profile becomes Custom and the number
becomes 42.

> *Judgement.* "It told me the truth about how bad it was and told me not to do
> it alone, and nothing else has said that to me, including people. Then I
> pressed the one thing it told me to press and it turned me into somebody
> called Custom with a completely different number. I could not get back. I
> found the name in the menu again but that is choosing myself off a list."

**Where she stops: she does not, but she never runs a release again.**

## Tomas, Nkem and Gordon. The floor

Tomas at 2.9 and Nkem at 10.6 both read Collapsed and both get the direction out,
which is correct and is the product at its best. Gordon at 1.0 reads Collapsed
with ninety seven addresses carrying and closes in ninety seconds.

> *Judgement, Gordon.* "One percent. There is nothing wrong with me."

Correct, not recoverable, and do not redesign for him.

## Rosa, Wren, Abraham and Lance. The ceiling

Rosa reads 100 and is told the work here is maintenance. Wren at 91.7 is offered
one address holding 4.0, which is the right answer for a person at that reading.
Abraham at 98.3 is told to answer the laws. None of them is the customer and the
product does not pretend otherwise, which is right.

---

# 6. Day Two, And The Claim That The Ritual Takes Over

The claim under test: Ritual is now a primary tab and day two is meant to be the
ritual taking over.

**Measured. It does not take over, because there is no day two in the product.**

## 6.1 What the Ritual surface actually does

`ui/ritual.js` is eighty lines. On open it computes the seat carrying the most,
maps it to a track, picks a tier from DQ, filters the practice table and
preselects one. It renders every practice at or below that tier, in four track
groups, with a duration on each. Below that, the selected ones as numbered
steps. Then two controls: Close, and Save ritual.

On a blank profile, measured, the surface reads:

> Build A Ritual
> **Body**
> The root is carrying the most, so the body track is what your state calls for.
> Tier 3 and below.

`ritFor` reads `r.darkB||'Root'`. On a blank profile there is no darkest band,
so the default fires and the surface asserts as fact that the root is carrying
the most, about eight hundred pixels from a rail that says nothing has been
entered. That is the self contradiction the quarter simulation named on the old
Summary, now living on a primary tab.

It also says "Tier 3 and below" to a person on their first day, which is
internal vocabulary reaching a screen.

Seventeen practices are offered, totalling about 230 minutes. Three of them run
twenty minutes each. One is marked "called for" and is already selected.
**Sixteen of the seventeen can only make the choice worse**, and the surface
whose job is to hand over one thing to do presents seventeen.

## 6.2 What it records

Saving writes `{t, track, band, steps, min}` to `CURP.rituals` and closes the
surface. Closing navigates to Summary, which is a different tab from the one the
person was on.

**Nothing on the surface asks whether the practice was done.** There is no start
control, no timer, no completion, no mark. `Save ritual` records an intention and
the streak counts it as a day practised.

## 6.3 What day two looks like

**Measured.** A ritual was saved, its timestamp was moved back one day, and the
surface was reopened.

**The Ritual tab on day two is identical to the Ritual tab on day one.** Same
heading, same seventeen practices, same preselection, same two buttons. It does
not mention yesterday. It does not mention the streak. It does not mention what
was saved. `RIT.sel` is emptied on every open.

The accountability lives somewhere else entirely. On **Compass**, the sixth tab,
the one that is off screen on a phone:

> The Record
> **1** day running
> Today is not on the record yet.
> [ Build today's ritual ]
> Minutes practised 5
> Rituals saved 1
> Ground opened 0 addresses
> Held at the far pole 0 addresses

That is a good accountability block. The copy is right, the button is the right
button, and the ledger counts only things that happened. **It is on the wrong
tab, and on a phone it is on a tab with no visible door.**

## 6.4 Three defects in the record

**One. The streak shipped, and the recommendation was not to ship one.**
`engine/ladder.js` computes `run`, `live`, `best` and `days`, and there are marks
at seven days, thirty days and ninety days. Section 8 of the quarter simulation
recommends, in the owner's own frame, "Never a streak", citing
`RESEARCH-ladder.md` on streak anxiety inverting in a mental health context.
This is not an argument that the record is wrong. The ledger is good and the
"today is not on the record yet" line is good. It is an argument that the
**consecutive day count** is the one mechanic that was ruled out and it is the
largest number on the surface.

**Two. The streak counts a save, not a practice.** Seven presses of Save ritual
on seven days earns "Seven days in a row. This is where it stops being a
decision each morning" from a person who has not breathed once. A record that
can be earned without doing the thing is not a record, it is a scoreboard.

**Three. The next mark is printed in the past tense.** On a blank profile, with
nothing saved, the Compass prints:

> **First run** You ran one. The instrument is no longer a thing you are reading
> about.

`ladderHtml` uses the mark's own `d` string for both the earned list and the
next line. The `d` strings are written in the past tense because they are
descriptions of things done. **So the product tells a person who has done
nothing that they have done it**, which is the one thing `CLAUDE.md` says a
control must never do.

## 6.5 What day two actually is, driven

**Measured.** A full day one was performed: a story written and committed
through the real controls, a release run, a ritual saved. The page was reloaded.

Persistence works. One `localStorage` key, 3,456 bytes, everything survives.

And then:

- The app opens on Field.
- `unread` is still true.
- The right rail reads **"Nothing entered yet. Write what happened and this
  fills in."**
- No copy anywhere on the landing surface says welcome back, or yesterday, or
  last time, or since you were here.

**A person who did every single thing the product asked of them on day one is
greeted on day two by a screen telling them they have entered nothing.**

That is the answer to the question. The ritual has a primary tab. Day two has
nothing at all.

---

# 7. Day Three, Day Seven, Day Thirty, Day Ninety

## Day three

Nothing in the product has changed. What has changed is that the people who
stayed have stopped exploring and have started asking it to be useful a second
time, which is the first real test and the one it fails.

| Who | State at day three |
|---|---|
| Diane | Gone at day three. The number was the same on all three openings and there is still no cost line |
| Derek | Gone at day two |
| Marcus | Opening it about every other day, four minutes, watching whether the repoint gets fixed |
| Angela | Gone at day one |
| Sofia | Daily. Using the codex and the drill. Has not opened Ritual again |
| James | Gone at day one |
| Ana | Daily, six minutes, reading the Collapsed paragraph. Has not run a release since the first one |
| Gordon, Rosa | Gone in week one |

**Day three is where it goes.** By the end of it, roughly four in five of the
arrivals have stopped, and the cause is not the reading, which is good, or the
writing, which is the best thing in the product. It is four measured facts: the
release repoints and bills, the intake cannot reach the release, the story
leaves the instrument unread, and day two does not exist.

## Day seven

The survivors are using the product as a reference document and a well written
paragraph. Both are real uses and neither is what the tier ladder prices, which
meters unique ground opened by releasing.

The one new thing that happens in week one is that somebody finds the gift
counter. **Measured:** it is in Settings, under Billing And Tier, and it reads
"New ground: 75 of the gift left" after a single press of a button on a
different surface. A person who pressed it four times on day one finds a counter
at zero and no record of what it bought, because the ledger keeps the spend and
the undo does not.

## Day thirty

Three people are still opening it: Sofia, Marcus and Ana, and the composition is
the same as the quarter simulation found, for different reasons.

Sofia has not referred anybody, and the blocker is now precisely nameable: the
account surface says "Sign in does not exist yet. This record is in this browser
and nowhere else", and the cohort lead suite that would let her see a client is
tier four and unbuilt.

Marcus is still checking the repoint.

Ana reads the paragraph. Her CQ is 7.6 on day one and 7.6 on day thirty, because
the only mechanism that would move it turned her into Custom the first time she
used it.

## Day ninety

Stable at roughly three in a hundred. The ledger of ninety days, across a
thousand arrivals, judgement built on measured per-run costs:

- Roughly 1,100 release runs, of which about 700 were run on a loaded reference
  case and moved the person's own field to the same number.
- Roughly 27,000 patterns spent, against a gift of 100 each, which means the
  majority of arrivals who pressed the button at all exhausted the gift without
  reaching a reading.
- Zero practitioner referrals, because the mechanism does not exist.
- Zero completed rituals recorded, because the product records saves.

---

# 8. The Retention Curve

**Judgement**, derived per person from the measured defects that land on them,
weighted as in section 2.

| Who | Weight | Day 1 | Day 3 | Day 7 | Day 30 | Day 90 | What decides it |
|---|---|---|---|---|---|---|---|
| Diane | 180 | 100% | 22% | 6% | 1% | 0% | Fifteen minutes ends at "No address is holding anything" |
| Derek | 170 | 74% | 9% | 3% | 0% | 0% | The repoint, then the refusal |
| Marcus | 160 | 58% | 26% | 16% | 9% | **5%** | Stays to watch whether it gets fixed |
| Angela | 150 | 31% | 5% | 2% | 0% | 0% | Phone. Four doors of nine, and "41% Incoherent" |
| Sofia | 140 | 81% | 55% | 43% | 24% | **15%** | Reference use. Cannot refer |
| James | 100 | 19% | 4% | 1% | 0% | 0% | The profile select at y 142 |
| Ana | 50 | 72% | 40% | 27% | 12% | **6%** | Returns for the direction out |
| Gordon | 35 | 6% | 0% | 0% | 0% | 0% | Refuses the frame, correctly |
| Rosa | 15 | 12% | 2% | 0% | 0% | 0% | Correctly not the customer |
| **Weighted** | 1,000 | **62%** | **21%** | **12%** | **5.6%** | **3.2%** | |

## The walk, day one

Where the 383 who do not return on day two are lost. Judgement, against
measured product facts.

| Moment | Reaches it | Leaves | Surviving |
|---|---|---|---|
| The boot, 5.2 seconds, no word until 4.46 | 1,000 | 21 | 979 |
| Lands on Field. 71 choices, no instruction, four numbers about defaults | 979 | 84 | 895 |
| Phone: four doors visible of nine, Summary 308 px off the edge | 895 | 61 | 834 |
| Phone: the only instruction is 3,098 px down | 834 | 47 | 787 |
| The profile select, second control on a phone | 787 | 33 | 754 |
| Press Run a release on a loaded case. Profile becomes Custom, number becomes 42 | 754 | 96 | 658 |
| Press it again. "Nothing is held above the line" | 658 | 41 | **617** |

## The walk, day two to day ninety

| Moment | Leaves | Surviving |
|---|---|---|
| Day two opens on Field and says nothing has been entered | 149 | 468 |
| The completed intake ends at "No address is holding anything" | 163 | 305 |
| The story returns nothing, or returns Lying | 71 | 234 |
| The Ritual tab on day two is the Ritual tab on day one | 29 | 205 |
| Days four to seven. The content is exhausted | 52 | 153 |
| The gift is gone and the counter was in Settings | 21 | 132 |
| The record and today's line are on a tab a phone cannot reach | 13 | 119 |
| Days eight to thirty | 63 | 56 |
| Days thirty one to ninety | 24 | **32** |

## Against the outside

**Cited.** Baumel, Muench, Edan and Kane, *Objective User Engagement With Mental
Health Apps*, JMIR 21(9):e14567, 2019. Ninety three apps, median 100,000
installs. Median daily active users **4.0 percent**. Median fifteen day
retention **3.9 percent**. Median thirty day retention **3.3 percent**.

**Cited.** Health and fitness app day one retention runs about 20 to 27 percent
and day thirty about 3 percent, per the AppsFlyer figures compiled by Business
of Apps and UXCam for 2026.

**These are not the same measurement as the table above and must not be read as
one.** The cohort figures count installs. The table above counts people who
opened the file once, which is a later and much more favourable starting point.
The honest comparison is at day thirty, where the two converge on the same
population: **5.6 percent modelled here against a category median of 3.3
percent.**

That is not a compliment. It says this product, with the defects in section 9
unfixed, would land slightly above the median of a category whose median is a
catastrophe. The thirty day figure is also the one most sensitive to the fixes
in section 10, because every defect in the day one walk is bounded.

**Cited, on the intake.** Survey abandonment rises sharply past the seven to
eight minute mark, with completion falling by 5 to 20 points, and completion
falls roughly from 89 percent at ten questions to 79 percent at forty. The
intake states fifteen minutes, which is past that cliff by design.
`RESEARCH-icp.md` already argues the right answer, which is not to shorten it:
with the duration stated, the remainder visible and the three way design named,
the panel's finishing rate runs 68 percent against 31 percent without. **Two of
those three are now built.** The third, the one line naming the three way
design, is still absent from the surface.

---

# 9. Why They Leave, Ranked

Ranked by people lost across ninety days. The product facts are measured. The
counts are judgement.

### 1. The release repoints the profile, wipes the field and bills the person. 187 people

**Measured.** `relCoolDown` calls `toYou()` before it reads the number, before
it takes the undo point and before it writes. A release run while any reference
case is loaded changes the profile select to Custom, empties the carrying
addresses, lands every person on CQ 42.3 to 42.4 whoever they were looking at,
spends 25 patterns on their own record, writes a snapshot, and refuses the
second run.

The intention is stated in the code and the intention is correct. The effect,
driven six times from six different profiles, is that the product's one primary
action takes a curious person's identity, their number and a quarter of their
gift, in a single click, with no confirmation and no way back.

*Fix: one condition. Either refuse the run while a reference case is loaded and
say why, or copy the loaded field onto the person's own profile with a named
confirmation first.*

### 2. The intake cannot reach the release. 163 people

**Measured.** Answered uniformly: held 0. Answered at random: held 0. The intake
writes `CURP.laws`. The wheel reads `S.charge`. There is no path between them.
So the most invested fifteen minutes in the product ends at "Release This First:
Nothing is carrying. No address is holding anything", and the release control
answers "Nothing is held above the line, so there is nothing to release."

This is the structural defect. It is not a copy problem and it is not a
threshold problem. The product's front door and its core loop are not connected.

*Fix: a ruling first. Either the intake seeds charge the way the four letter
type does, or the intake surface says up front that it measures integrity and
that the wheel is filled somewhere else.*

### 3. The app opens on Field and not on Summary. 148 people

**Measured.** Field presents 71 simultaneous choices in the first viewport, four
numbers about defaults, three separate statements that nothing has been read, an
empty wheel, and no instruction. Summary presents an honest dash, the best
paragraph in the product, and the four doors, and on a phone all of it is in the
first two screens.

The product has the right first screen and ruled it out of first position.

*Fix: one integer, and it is already an integer.*

### 4. The phone tab strip hides four of the nine doors. 121 people

**Measured.** `clientWidth` 348 against `scrollWidth` 724. Compass, Knowledge,
Games and Summary are entirely off screen; Body is cut. The affordance is a 26
pixel gradient. Compass carries the record, the streak and the only line in the
product that asks a person to come back today. Summary carries the reading and
the doors.

*Fix: wrap to two rows, or one menu control, or move the two that matter.*

### 5. The story leaves the instrument unread. 88 people

**Measured.** An ordinary sentence commits 8 imprints, lands 27 addresses
carrying, and leaves `unread` true, because the reading gate is `sq>=4` and the
story lands below it. The story surface's own release panel then reads "Nothing
to run" with the button disabled, while the rail control on the same screen
fires at `sq>0` and spends 25 patterns.

Two gates, opposite directions, same build.

*Fix: one constant, plus a ruling on which way it moves.*

### 6. The story still accuses. 71 people, and each one tells somebody

**Measured, unchanged since the quarter simulation named it.** "My partner cut
me out of the deal and my jaw is tight" returns Spiritual Language To
Manipulate, Excuse, Deceit and Lying. "I am exhausted" returns Pride. "I screamed
at my son and I hate that I am like my father" returns Pride, Arrogance,
Competition and Anger. The band's modal family fires when no adjective matches.

*Fix: one condition. Say nothing rather than guess. It was already recommended
and it is the smallest item on this list.*

### 7. The unread gate releases after three answers. 62 people

**Measured.** Four clicks, about thirty seconds. The dash is replaced by a band
word at display size, backed by an identification of 22.1 percent plus or minus
19.0. The product's own promise, that a number off a default is a number about
the default, holds for thirty seconds.

*Fix: hold the gate until the interval is worth printing. The engine already
computes the interval.*

### 8. Day two does not exist. 58 people

**Measured.** After a complete day one, the app opens on Field and says nothing
has been entered. The Ritual tab is byte identical to day one. Nothing says
welcome back. The one line that asks a person to come back, "Today is not on the
record yet", is on Compass, which is off screen on a phone.

*Fix: put the record and today's line on the Ritual tab, and let the landing
surface know what day it is.*

### 9. The gift is spent invisibly. 41 people

**Measured.** One press spends 25 patterns. Four presses spend the gift. The
counter reading "75 of the gift left" lives in Settings, under Billing And Tier,
on a surface with no door in the navigation.

*Fix: print the cost on the run panel before the run, which is what the plan
already builds it for.*

### 10. Undo does not restore the ledger. 29 people

**Measured.** `undoState` captures charge, opposites, laws and soul. It does not
capture the meter, the history or the rituals. After five runs and one undo: one
carrying address restored, 104 patterns still spent, 104 ground still opened, six
snapshots still written. And because `undoPush` fires after `toYou`, the undo
point on a reference case release is taken after the field was already swapped.

*Fix: move `undoPush` above `toYou`, and add the meter and the last snapshot to
the captured state.*

### 11. "41%" beside the word "Incoherent". 29 people, one of them the volume case

**Measured.** Angela's CQ is 40.9. The headline rounds to 41. `tierOf` bands the
unrounded value and Incoherent runs 31 to 40. `RESEARCH-icp.md` already records
that she walks at that word.

*Fix: band on the displayed value, or floor the displayed value.*

### 12. The first four seconds contain no word. 21 people

**Measured.** The wordmark begins at 3.54 seconds and is legible at 4.46. The
sheet clears at 5.20.

*Fix: bring the wordmark to the front of the sequence and let the ring draw
behind it.*

### 13. The Compass tells a person who has done nothing that they did it. 12 people

**Measured.** With zero rituals saved, the record prints "First run. You ran one.
The instrument is no longer a thing you are reading about."

*Fix: a second string per mark, future tense, for the next line.*

### 14. Seventeen practices on a surface whose job is to hand over one. Cost unquantified

**Measured.** Four tracks, seventeen practices, about 230 minutes, one
preselected, three of them twenty minutes each. On a blank profile the surface
asserts "The root is carrying the most" from a default, and says "Tier 3 and
below" to somebody on their first day.

### 15. Cognitive load. Architectural

**Measured.** 71 simultaneous choices in the first viewport of the landing
surface, 100 on Knowledge, 213 on the Knowledge surface entire. Forty five
controls on every surface explained only by a `title` attribute, which a phone
cannot show. Forty four elements on Summary with no text, no title and no label.

`CLAUDE.md` already names this as architectural and needing a decision before it
needs code. It is not in this list to be fixed this week. It is here because it
is the reason every other fix has to fight for attention.

---

# 10. What Would Change Each Outcome, Ranked By Cost

The ranking is by cost, cheapest first, because that is the order it can be
acted on. The gain is judgement; the defect behind each one is measured.

## An afternoon each

| # | Move | What it changes | Who it recovers |
|---|---|---|---|
| 1 | **Open on Summary.** One integer, and Field keeps its own | The first screen becomes the one that says what this is, refuses to lie, and shows four doors. On a phone it is the difference between four flicks and none | Angela first, then everybody. 148 |
| 2 | **Refuse the release while a reference case is loaded, and say why.** One condition in `relCoolDown` | The product stops taking a stranger's identity, number and gift for a click | Derek, Ana, James. 187 |
| 3 | **Move `undoPush` above `toYou` and put the meter in `undoState`** | Undo becomes true. The person who presses the wrong thing gets back to where they were, including what it cost | 29, and it banks a safety argument the product has already paid for |
| 4 | **Say nothing rather than guess in `parseStory`** | A tight jaw stops returning four accusations of lying | 71, and every one of them was going to tell somebody |
| 5 | **Print the cost on the run panel before the run** | The gift stops being spent invisibly. The plan already computes it | 41 |
| 6 | **Band on the displayed number** | Angela stops being shown a number her own band table contradicts | 29 |
| 7 | **A future tense string for the next mark** | The Compass stops telling people they did things they have not done | 12 |
| 8 | **Bring the wordmark to the front of the boot** | The first four seconds say what this is | 21 |
| 9 | **One sentence at the top of the intake naming the three way design** | The last of the three fixes `RESEARCH-icp.md` costed at 29 points of completion. Two are built | judgement: a meaningful share of the 163 who reach the end |

**Items one to nine together are worth roughly 540 of a thousand and none of
them is a week of work.** Item one is an integer.

## A week each

| # | Move | What it changes |
|---|---|---|
| 10 | **Put the record, the streak line and "Build today's ritual" on the Ritual tab** | Day two acquires a surface. The primary tab starts doing the job it was promoted for |
| 11 | **Wrap the phone tab strip, or give the nine doors one menu** | Compass and Summary stop being invisible on the device most arrivals use |
| 12 | **Make the reading gate and the release gate the same number** | A person stops being able to spend everything on charge the instrument will not read |
| 13 | **Cut the Ritual surface to the practice called for, with the other sixteen behind one control** | Seventeen simultaneous choices becomes one, on the surface whose entire job is to hand over one thing |
| 14 | **The streak counts a practice, not a save** | Requires one control saying the practice was done. Without it the record is a scoreboard |

## A ruling before any code

| # | The question | Why it cannot be built around |
|---|---|---|
| 15 | **Does the intake write charge?** | Today it does not, so the most invested path in the product cannot reach the core loop. Either it seeds the wheel, or the surface says plainly that it measures integrity and points at the door that fills the wheel |
| 16 | **Does the streak ship at all?** | It is built and live. The standing recommendation, on this project's own research, was never to ship one. The ledger and "today is not on the record yet" survive either ruling; the consecutive day count is the thing being decided |
| 17 | **Where does the unread gate sit?** | Three answers currently buys a band word at plus or minus 19.0 |
| 18 | **The daily ceiling** | The quarter simulation asked for it and argued it. It is unbuilt, and every item above makes the loop more capable of holding somebody for longer |
| 19 | **Cognitive load** | 71 on the landing surface against a floor of twelve. Architectural, and named as such already |

---

# 11. What To Instrument

There is no instrumentation in the product and there cannot be while it makes no
network request. The fork to accounts opens exactly one seam, and the record
fetch at sign in is where this goes. **Decide what is measured before building
the thing that would be measured.**

Nine events, and the question each one answers. None of them carries a story,
an answer or a reading, in line with the standing promise that the record and
the story are never held joined.

| Event | Fields | The question it answers |
|---|---|---|
| `first_paint` | ms to the wordmark, whether the boot was skipped | Are the first four seconds costing arrivals |
| `first_surface` | which tab, viewport width | Confirms the landing ruling against behaviour rather than argument |
| `first_instruction_seen` | which door, seconds since open, scroll depth at the time | The single most important number in this document. On a phone the doors are 3,098 px down and nobody knows whether anybody reaches them |
| `intake_progress` | answers count at each minute, abandoned or completed, seconds elapsed | Replaces the whole cited abandonment literature with one measurement of this intake |
| `gate_cleared` | which path cleared `unread`, identification at that moment | Tells you whether anybody ever clears it by writing, or only by answering |
| `release_attempt` | refused or ran, whether a reference case was loaded, patterns spent, CQ before and after | Measures item one and item two directly, including how often the repoint fires |
| `undo_used` | what it was undoing, seconds after the act | Undo has been built twice and found by almost nobody |
| `ritual_saved` | track, minutes, whether a practice control was pressed | The only honest way to separate a save from a practice |
| `return` | days since last open, which surface, whether anything was entered | Day two, measured instead of modelled |

Two measurements that need no backend at all and would replace three sections of
this file:

1. **One landing page, two first screens, count who reaches the second.** Field
   against Summary. It settles item one in a week for the price of a domain.
2. **Five people, phones, thirty minutes each, no prompting.** Five surfaces
   about eighty five percent of what is here. The specific question to watch, and
   not to ask: how long before they touch a door, and what they press first.

---

# 12. The Grade Delta

Against the quarter simulation's rubric, same criteria, measured against this
build.

    criterion            was    now    why
    ICP alignment        7/10   7/10   unchanged. maps to all fourteen, serves the loop for none
    First touch          7/10   4/10   WORSE. the good first screen exists and is no longer first
    Core loop            2/10   3/10   the cliff at run three is gone. the repoint replaced it
    Emotional            6/10   7/10   the under-the-line copy is genuinely better
    Behavioral flow      4/10   4/10   71 to 100 per screen, 45 title-only per surface
    Visual and kinetic   8/10   8/10   unchanged, and it is reference grade
    Technical            8/10   8/10   zero errors, three local requests, undo and redo built
    Monetization         3/10   2/10   WORSE. the gift is now spendable to zero without a reading
    Retention            2/10   3/10   day 30 modelled at 5.6 against 3.3 category median
    Referral             5/10   5/10   unchanged. the mechanism does not exist
    total               52/100 51/100

**The product as it is: D+, unchanged, and the composition has moved.** Six of
the twelve defects the quarter simulation named are genuinely closed and the
closures are good work. Three new defects, all in the onboarding, cost more than
the six closures returned: the landing ruling, the repoint, and the disconnect
between the intake and the wheel.

**Its potential: A-, unchanged.** Every defect in section 9 is bounded and nine
of the fifteen are an afternoon. The architecture, which is the part nobody can
retrofit, is still right.

**The delta that matters is not the grade. It is this.** The quarter simulation
found a product whose core loop was dead and whose front door worked. This one
found a product whose core loop is alive and whose front door now points away
from it. That is a better position to be in and a worse screen to open on.

---

# 13. What This File Is Not

Every person, reaction, quotation, retention figure, drop off count and grade
above is **judgement**: model output with arithmetic attached. Nobody named
exists and no sentence in quotation marks was said by a human.

The readings, identifications, release deltas and pattern costs are the shipped
engine's real output on the repository's own fictional vectors.

Everything labelled **measured** is a fact about `source.html` at md5
`f304c29532ea8c2dfa9c683fab5b8051`, verified by executing it in Chromium at
1600x1000 and 390x844 this session, and by looking at the images.

Everything labelled **cited** carries its source.

**No figure here is evidence about any human being and none of it should be
quoted as research.** Two landing pages and five people with phones would
replace half of it with measurements, and both are cheaper than the arguing.

## Sources

- Baumel A, Muench F, Edan S, Kane JM. Objective User Engagement With Mental
  Health Apps: Systematic Search and Panel-Based Usage Analysis. J Med Internet
  Res 2019;21(9):e14567. <https://www.jmir.org/2019/9/e14567/>
- Health and Fitness App Benchmarks, Business of Apps, 2026.
  <https://www.businessofapps.com/data/health-fitness-app-benchmarks/>
- Mobile App Retention Benchmarks by Industry, UXCam, 2026.
  <https://uxcam.com/blog/mobile-app-retention-benchmarks/>
- Torous J et al. Digital therapeutics for mental health: is attrition the
  Achilles heel? Front Psychiatry 2022.
  <https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.900615/full>
- Survey length and completion, Survicate, 21,000 surveys.
  <https://survicate.com/blog/how-many-questions-should-surveys-have/>
- Survey completion rates and drop off, Lensym.
  <https://lensym.com/blog/survey-completion-rates-drop-off/>
