# The ritual builder. A D minus, and what it takes to move it.

Brief: `TASKS.md` 0v. Graded D minus by the owner on 20 September with a comp
attached. Everything below is measured off the build at this commit or sourced
to a URL, and where a figure could not be sourced it says so.

**His words, quoted rather than paraphrased, because the paraphrase has already
been the problem once:**

> "Research this. Habit builder. https://apps.apple.com/us/app/streaks/id963034692
>
> When I come to the ritual builder, nothing that I have asked for is here. I
> asked for the ritual builder to be clean, simple, to comp against apps in a
> similar category, and then that did not happen. So review the app that I just
> dropped in. It has got to be elegant, simple.
>
> My expectations are that the ritual builder looks like a compass to track my
> daily progress. The accountability tracker shows me how I have done over time.
> The gamification is tied into the ritual builder and the accountability
> tracker. If I fail an accountability I lose points, if I succeed I gain. My
> core game loop: when I input stories I get points by the type of impression
> that I add, and that allows me to go through my core product loop of imprints
> and release. With the sniffer sniffing for things that could go into the
> ritual builder to improve behaviour.
>
> So the ritual builder needs to be very clean and simple. Iconography for the
> type of rituals that I am going to work on. A daily tracker so I can see what
> is running, what rituals I need to do. An edit button where I could add or
> remove history. A heat map so I can see my work over time, and any type of
> analytics data.
>
> When I come to this page right now it has a bunch of text, I do not know what
> is going on, it is meaningless. The design, the UI, the UX, the layout, it has
> not even been touched yet. This is a D minus. Box breathing has nothing to do
> with this, it says body, I do not know what the hell is going on, that does not
> belong there. The where and when does not belong there. The record does not
> belong there."

**Network note.** Direct page fetch is blocked by the organisation egress proxy.
`apps.apple.com`, `macstories.net`, `streaks.app` and `apppicked.com` all returned
`EGRESS_BLOCKED`. Every figure in section 2 came through the **search index**
against the URL cited, not through a fetch of that page, and anything that could
not be sourced is marked **unsourced** and not described.

---

## 1. WHY IT READS AS MEANINGLESS

He is not describing a taste difference. Five things are measurably true of that
screen and each one is a separate defect.

### 1.1 The largest object on the page is a word with no referent

`atuned_src/ui/ritual.js:62`

    +'<div class="rel-node">'+(c.substituted?c.actualTrack:c.track)+'</div>'

`.rel-node` computes to **30px**, which makes it the biggest thing on the
surface. It renders the track name and nothing else. Loaded as Marcus the page
says **Mind**. Loaded as Angela it says **Body**. That is the "it says body" in
his message, located.

A track name is an internal taxonomy. It is not a promise, not an instruction
and not a diagnosis a stranger can act on. The first four seconds of that screen
ask a person to know what Mind means before anything else is offered.

### 1.2 The arithmetic is behaving. The naming is what fails.

I verified this rather than assuming it. `ritFor` at `ui/ritual.js:9` to `:26`
takes the heaviest seat, maps it to a track, picks a tier off `DQ`, and returns
the lightest practice in that track. Measured against the real engine for seven
profiles, and checked against `PANEL-ritual-1000.md` section A1, which it agrees
with on all seven:

| who | seat carrying most | track | tier | practice called for | minutes |
|---|---|---|---|---|---|
| Marcus | Throat | Mind | 3 | Active Listening | 10 |
| Sofia | Throat | Mind | 3 | Active Listening | 10 |
| Diane | Solar | Somatic | 3 | The Somatic Truth Check | 2 |
| Derek | Solar | Somatic | 1 | The Signal Test | 3 |
| **Angela** | **Root** | **Body** | 3 | **Box Breathing** | 5 |
| **Rosa** | **Root** | **Body** | 3 | **Box Breathing** | 5 |
| Gordon | Throat | Somatic, substituted | 1 | The Signal Test | 3 |
| **a blank profile** | **Root** | **Body** | 3 | **Box Breathing** | 5 |

So Box Breathing is correct, and it is correct for the two profiles whose root
is carrying most **and for every person who has entered nothing at all**. The
last row is the one that matters: a blank profile is what every first arrival
has, the app opens on the Field, and a person who wanders to Ritual before
entering anything is handed Box Breathing on the Body track with no cause
attached. That is almost certainly the screen he was looking at.

The card never contains the word **because**. It says what was chosen. It never
says what the choice was made from. The reason exists, it is `darkB`, the
heaviest seat, and it is rendered in the **right rail** in a different column
under a different heading. The cause and the effect are on the same screen and
are never joined by a sentence.

**Gordon gets it worse.** His tier 1 Mind track holds nothing, so `ritFor`
substitutes, and `ui/ritual.js:65` renders an apology:

    Nothing in that track sits at tier 1, so the somatic track carries it.

A person who has never been told what a track or a tier is now reads a sentence
about an empty one.

### 1.3 The word count on the card

Measured in the real build, in Chromium, reading `#rit` after `setTab(10)`:

| profile | words on the card | characters | interactive controls |
|---|---|---|---|
| Sofia | 185 | 1,026 | 7 |
| Marcus | **185** | 1,026 | 7 |
| Diane | 187 | 1,050 | 7 |
| Angela | 192 | 1,052 | 7 |
| Derek | 208 | 1,137 | 7 |
| Gordon | **208** | 1,129 | 7 |
| Rosa | 221 | 1,219 | 7 |

**185 words for Marcus, 208 for Gordon, 221 for Rosa.** That is his "bunch of
text" with a number on it. And for those 185 words the surface delivers no
compass, no iconography, no daily tracker, no edit control, no heat map and no
analytics. All three designs below put **all six** on the page in **fewer
words**: 172, 157 and 155.

### 1.4 The screen asks for 94 simultaneous choices

**The centre stage figure is stale and the screen figure stands. Marked 21
September.** This table was counted before `RL4f` landed. The card no longer
offers every candidate practice: `ritFor()` calls one, the list renders with
the `one` class, and everything else sits behind a single control reading
"Choose something else". So the 11 for the centre stage is a count of an object
that is gone, and no number replaces it here, because a number typed into a
document is what this repository has been bitten by eleven times. The way to
get it is the way this one was got: `node tools/shots.js OUT 1600 1000`, then
count the visible interactive elements on the Ritual tab. The 94 and the 52
control left rail were re-checked on 21 September and both stand, and the rail
is `PRIORITY.md` item 9 rather than this page's to fix.

Counted in the live build at 1600 by 1000 on the Ritual tab, before `RL4f`,
every visible interactive element:

| zone | choices |
|---|---|
| left rail | **52** |
| top bar | 16 |
| right rail | 15 |
| centre stage | 11 |
| **the screen** | **94** |

Against a working memory of about four and this project's own working floor of
under twelve on a working screen. The centre stage at 11 is inside the floor and
is not the problem. The problem is that the ritual card is an 11 choice object
sitting inside a 94 choice room, and a person deciding whether to breathe for
five minutes is doing it beside 52 blueprint glyphs.

### 1.5 Two smaller things that are still wrong

**The eyebrows are title cased in CSS.** `.pm-eye` carries
`text-transform: capitalize`, so the source string "Build a ritual" renders as
**Build A Ritual**, and "The ritual, 10 minutes" renders as **The Ritual, 10
Minutes**. The ruling is sentence case. This is a voice violation that is
visible on the screen and invisible in the source.

**The record prints a bare zero.** On a new profile `ladderHtml` renders **0**
at display size above the words "days , last run", with a space before the
comma. The first number this product ever shows a person is a zero the size of a
headline.

**Half fixed, checked 21 September.** The space before the comma is gone and
`ui/cone.js:909` carries the comment saying why it was there. The headline zero
stands, and it now has "Nothing on the record yet. Build one ritual and save
it, and the first day is on." under it, so the zero is explained rather than
removed.

---

## 2. THE COMPS

### 2.1 Streaks, the app he gave, mechanically

**What it is.** iOS, iPadOS, macOS, watchOS and visionOS. **Apple Design Award
winner, 2016**, cited for what Apple's own write up called obsessive attention to
ease of use.
[developer.apple.com/news/?id=67dti69d](https://developer.apple.com/news/?id=67dti69d),
[crunchybagel.com/apple-design-awards-2016](https://crunchybagel.com/apple-design-awards-2016/),
[fastcompany.com/4010412](https://www.fastcompany.com/4010412/apple-app-design-awards-winner-streaks).

**The board, and how many fit.** Tasks are circular tiles in a grid. **Six per
page, four pages, so 24 tasks is the hard cap**, and the pages are switched by a
control in the middle of the bottom bar. The cap has moved over the app's life:
it launched limiting a person to **six goals**, and its designer defended that
number directly, saying that at four or five tasks a sixth unrelated one always
demanded to be added too. The Today widget's expanded mode shows **12** at once.
[macstories.net/reviews/streaks-3-review](https://www.macstories.net/reviews/streaks-3-review/),
[apppicked.com/en/blog/streaks-habit-tracker-ios-review](https://www.apppicked.com/en/blog/streaks-habit-tracker-ios-review),
[thesweetsetup.com/apps/best-habit-tracking-app-ios](https://thesweetsetup.com/apps/best-habit-tracking-app-ios/).

**What a task looks like.** A ring with an icon inside it, from a library of
**over 600 task icons**, in one of **78 colour themes**. The icon carries the
kind of habit and the ring carries the day.
[macaron.im/blog/streaks-habit-tracker-app-review-2026](https://macaron.im/blog/streaks-habit-tracker-app-review-2026).

**What the ring encodes.** On a task tile, whether today is done: completing it
fills the ring. It is binary, not a percentage of an aspiration. On the app icon
the ring is the aggregate: it fills as tasks are marked complete and shows how
much of the day is left to close.
[macstories.net/reviews/streaks-3-review](https://www.macstories.net/reviews/streaks-3-review/).

**How completion is recorded.** **Long press on the task tile.** Not a tap, not a
checkbox. Reviewers list this among the things that has to be learned.
[apppicked.com/en/blog/streaks-habit-tracker-ios-review](https://www.apppicked.com/en/blog/streaks-habit-tracker-ios-review).
Health linked tasks complete themselves: step count, mindfulness minutes and
exercise data auto complete without the app being opened.
[thesweetsetup.com/apps/best-habit-tracking-app-ios](https://thesweetsetup.com/apps/best-habit-tracking-app-ios/).

**Four task types.** Positive, a habit to build. Negative, a habit to break,
which takes an allowed number of misses a day and extends the streak for staying
under it. Timed, which runs a timer and logs on completion. Quantity, such as
eight glasses of water.
[thesweetsetup.com/how-to-track-your-habits-using-streaks](https://thesweetsetup.com/how-to-track-your-habits-using-streaks/).

**What happens on a miss.** The counter goes back to zero, subject to how the
task is configured. Streaks' own exact grace and days off rules could not be
sourced through the index and are **unsourced**; what is sourced is the general
category rule, that a miss resets to zero absent a protection.
[apppicked.com/en/blog/streaks-habit-tracker-ios-review](https://www.apppicked.com/en/blog/streaks-habit-tracker-ios-review).

**How history is edited.** **Tap the day on the calendar to backdate or edit any
past entry.** That is the whole mechanism and it is one gesture on the object
that already shows the history.
[apps.apple.com/us/app/streaks/id963034692](https://apps.apple.com/us/app/streaks/id963034692)
via the index.

**The heat map and the calendar.** A monthly calendar with a bar chart of daily
progress, and a **contribution grid** showing weeks and months at a glance in
**five layouts**: compact, weekly, monthly, expanded and editorial. Per task
stats carry total count, completion rate, current streak and best day. Same
source.

**The paywall.** There is not one in the usual sense. **$5.99, one time**, no
subscription, no habit slots sold as an upgrade, and one purchase covers iPhone,
iPad, Mac, Watch and Vision Pro under one Apple ID. 27,000 plus ratings at 4.82.
[66streaks.com/blog/is-streaks-app-free](https://66streaks.com/blog/is-streaks-app-free/),
[calmevo.com/streaks-app-review](https://calmevo.com/streaks-app-review/).

**What reviewers say it gets wrong.** Three complaints recur.

1. **The 24 task cap** is the most common complaint across hundreds of reviews.
2. **Watch complications shown in App Store screenshots do not exist in the
   shipped app**, which reviewers call out as false advertising on a paid app
   whose pitch includes the Watch.
3. **A steep learning curve underneath the minimal surface.** Editing,
   reordering and configuring need non obvious gestures, described by reviewers
   as "completely unintuitive" and "confusing as hell".

[apppicked.com/en/blog/streaks-habit-tracker-ios-review](https://www.apppicked.com/en/blog/streaks-habit-tracker-ios-review).

**What Streaks does that this product does not.** It records a day in one
gesture on the object that shows the day. It shows the kind of a habit before its
name, through an icon. It shows a year of history without a page change. It caps
the board on purpose and defends the cap. And it charges once, up front, for a
thing that then asks nothing of you.

**The one to steal and the one to refuse.** Steal the ring that means today and
the calendar you edit by tapping. **Refuse the reset to zero.** This repository
already measured that: `engine/ladder.js:49` halves instead of resetting on Bible
1133, and `DESIGN-gamification.md` prices the reset at **4.4 points of 1000 at
day thirty**, which is to say the halving is worth 4.4 points against the thing
Streaks does.

### 2.2 Habitica, because it is the loss framing comp

This is the one that matters for his points ruling, so it is here rather than in
a footnote.

**The mechanic.** A Daily not checked off by the day's rollover costs the player
**health points**, and that Daily's streak resets to zero. Damage **scales with
the task's colour**: a task drifting red deals more than one sitting blue, so
the longer a person has been failing a thing the harder failing it hits. At zero
health the character dies and loses a level, gold and equipment.
[habitica.fandom.com/wiki/Damage_to_Player](https://habitica.fandom.com/wiki/Damage_to_Player),
[habitica.fandom.com/wiki/Death_Mechanics](https://habitica.fandom.com/wiki/Death_Mechanics),
[habitica.fandom.com/wiki/Dailies](https://habitica.fandom.com/wiki/Dailies).

**And its own community argues about it.** There are open issues on the project
titled "Missed dailies do massive amounts of damage" and "Losing HP", and
Habitica's own FAQ documents how to **turn the damage down or off**, on the
stated ground that if the threat of death is not motivating it should be removed.
[github.com/HabitRPG/habitica/issues/3161](https://github.com/HabitRPG/habitica/issues/3161),
[habitica.com/static/faq](https://habitica.com/static/faq).

**What it does that this product does not.** It makes the cost of a miss
visible and immediate, which is exactly what he is asking for. **What this
product should not copy** is the part Habitica itself ships an off switch for.
Section 5 measures where the line sits.

### 2.3 Duolingo, for what happens when the penalty is softened

Not in the category, and used only for the one number. Loss aversion is the
documented engine of the Duolingo streak and it engages around day seven.
The **Streak Freeze reduced churn by 21 percent** among users at risk of
breaking a streak, and allowing two equipped at once raised daily actives by a
further **0.38 percent**. The underlying research, from Pennsylvania and UCLA,
found that giving people **slack** against a goal was more motivating than a
rigid rule.
[medium.com/design-bootcamp/duolingo-and-the-psychology-of-streaks](https://medium.com/design-bootcamp/duolingo-and-the-psychology-of-streaks-why-you-cant-stop-learning-e926b190acaa),
[blog.duolingo.com/how-duolingo-streak-builds-habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit).

**What it does that this product does not.** It sells the protection against a
miss as a thing you hold, so the grace is an object rather than a silence. This
product's grace day is real and invisible: `streakRead` gives one, and no
surface has ever told anybody it exists.

### 2.4 Way of Life, for the record as the product

Yes, no and skip per day per habit, which is three states where most trackers
have two, and skip is the part worth noting: it separates a day that did not
apply from a day that was missed. Charts with bar graphs and trend lines, a
weekly and monthly scoreboard, and CSV and Excel export.
[apps.apple.com/us/app/way-of-life-habit-tracker/id393159800](https://apps.apple.com/us/app/way-of-life-habit-tracker/id393159800)
via the index.

**What it does that this product does not.** It has a third state. This product
already has the material for one: `DESIGN-gamification.md` designed a sixty
second floor version of the ritual, and a day kept at the floor is neither a full
day nor a miss. All three prototypes below draw it as a third state.

### 2.5 Apple Activity rings and Oura, for the shape

Apple's own guidance and the commentary on it make the argument for the ring
over the bar: **a ring is either closed or it is not**, where a bar always has
more to add. Three rings rather than one because health is multidimensional.
[developer.apple.com/design/human-interface-guidelines/activity-rings](https://developer.apple.com/design/human-interface-guidelines/activity-rings),
[macworld.com/article/3183369](https://www.macworld.com/article/3183369/ring-toss-why-the-apple-watch-activity-goals-need-an-update.html).
Oura goes the other way and integrates everything into one 0 to 100 Readiness
score. [ouraring.com/blog/what-is-readiness](https://ouraring.com/blog/what-is-readiness/).

**What they do that this product does not.** They put the day's state into one
glanceable object with no reading required. This is the direct precedent for his
compass.

---

## 3. WHAT HE ASKED FOR, AND WHICH DESIGN DOES IT

A is the compass, B is the board, C is the tape. All three are runnable at
`proto/ritual/`.

| # | What he asked for | A compass | B board | C tape |
|---|---|---|---|---|
| RB1 | It looks like a compass, to track daily progress | **yes, it is the hero** | no, a board instead | yes, small, top right |
| RB2 | Iconography for the type of ritual | yes, four track glyphs | **yes, glyph inside every ring** | yes, one glyph |
| RB3 | A daily tracker, what is running and what to do today | yes | **yes, the whole board** | yes, one line |
| RB4 | An edit control to add or remove history | yes, tap any day | yes, tap any day | yes, tap any day |
| RB5 | A heat map over time | yes | yes | **yes, plus a 90 day tape** |
| RB6 | Analytics | yes, four figures | **yes, plus which weekday you keep** | yes, four figures |
| RB7 | The accountability tracker is a surface, not a line on a card | partly, one card down | partly, side by side | **yes, it is the page** |
| RB8 | Clean and simple | 3 choices, 172 words | 5 choices, 157 words | **2 choices, 155 words** |
| RB12 | Say why this practice arrived | **yes, one sentence, top** | yes, under the board | yes, under today |

All three carry all six of his objects. They differ in what they make the hero.

---

## 4. THE THREE DESIGNS

Each page is standalone: one file, no sibling, no dependency and no network
request of any kind, verified by watching the request log during the screenshot
run. Every number on every page is real. The seat, the track, the tier and the
practice come out of `engine.js` through the same `ritFor` rule the build uses,
reimplemented in `proto/ritual/build-data.js` and **checked against
`PANEL-ritual-1000.md` section A1 on seven profiles, refusing to write its data
file on any mismatch**. That check caught a bug in my own extractor on the first
run, which is what it is for.

The history is real too, and this matters. **A profile in `PEOPLE` carries no
ritual history at all**, so a heat map drawn from the profiles alone is empty for
every one of them. The day by day walks come out of `proto/ritual/losssim.js`,
which is `tools/loopsim.js` with the owner's loss framing arm added and **all
forty two of its checks still passing**, including the two that reproduce the
published 199 and 229.

Measured at 1600 by 1000, redraw timed over 40 switches:

| | A compass | B board | C tape |
|---|---|---|---|
| page, without the inlined profile data | **18 kB** | 17 kB | **17 kB** |
| the inlined profile data, shared | 32 kB | 32 kB | 32 kB |
| simultaneous choices | 3 | 5 | **2** |
| words on the page, excluding my footnote | 172 | 157 | **155** |
| redraw, median, Marcus at 90 days | 0.4 ms | **0.2 ms** | 0.6 ms |
| redraw, worst of 40 | 1.2 ms | **0.8 ms** | 1.3 ms |
| touch targets below 44 by 44 | 0 | 0 | 0 |

**Every one redraws inside a sixteenth of a frame.** The worst case measured
anywhere is 1.3 ms against a 16.7 ms budget, so frame cost is not a discriminator
between these three and should not be used as one.

### 4.1 Design A, the compass. `proto/ritual/compass.html`

**What it shows.** A 260 pixel dial. The outer ring is the seven seats, each an
arc in its own colour, **the seat carrying the most drawn at three times the
weight of the others**. That is the needle: the eye finds the heavy seat without
a pointer being drawn, and it is the first thing on the page, which answers the
"I do not know what the hell is going on" directly. The inner ring is the last
thirty days, one tick each, in the track's colour. The centre is the run, one
number, in a ring and never a disc.

Beside it, the daily tracker: one sentence saying **why**, then one row with the
track glyph, the practice, its minutes and one control. Under that, what is
standing and what is next. Below, the record and four figures.

**What it refuses to show.** The practice's `how` prose, which is 60 of the
current card's words and belongs in the practice itself rather than on the
builder. The track name as a headline. The if then fields. The list of other
practices, which sits behind one control.

**Honest risk.** The dial is the most novel object of the three and it is the one
a person has to be taught. Seven arcs with one heavier is a convention this
product already uses on the figure, but nobody has ever tested whether a person
reads "that is where my charge is" or reads decoration. **It is also the design
that most needs a legend and has none.**

### 4.2 Design B, the board. `proto/ritual/board.html`

**What it shows.** Streaks ported, not copied. A tile per ritual, each a ring
with its track glyph inside, **the ring full when today is recorded and empty
when it is not**, which is Streaks' encoding exactly and is honest because it is
binary. Six is the cap, which is the number Streaks itself started on. The
practice the reading calls for is first and marked "called for"; the others come
from the same track and the same tier, so nothing is offered that the person
cannot do today.

The analytics half carries the one cut of a habit record that changes behaviour:
**which weekday you keep it and which one you lose**, as a rate per weekday.

**What it refuses to show.** Empty slots. A fixed six with five holes in it is a
count against a total wearing a costume: it says five to go. The board holds what
exists plus one add control.

**It also refuses to speak without evidence.** On Gordon's seven days every
weekday read "100 in 100" and the chart said nothing while looking as though it
had. **Four weeks is now the floor**, and below it the panel says what it is
waiting for. That defect was only visible because I looked at the picture.

**Honest risk.** It is the least like this product and the most like everything
else. A board of tiles is the generic habit tracker shape, and this product's
claim is that it is not one. It also drifts furthest from RB1: there is no
compass on it.

### 4.3 Design C, the tape. `proto/ritual/tape.html`

**What it shows.** The accountability record **is** the page, which is his second
sentence taken literally, and today is one line on the end of it. The tape is one
column a day, and **the height is the run standing on that day rather than a flat
tick**. A flat tick says only whether you showed up. The height says what you had
built when you did, so the halving rule in `engine/ladder.js` reads as a visible
step down and needs no legend. Misses are short warm coloured notches on the
baseline. The compass survives as a 120 pixel dial at the top right.

**What it refuses to show.** Today, as a hero. This design bets that a person who
has been here three weeks comes back to see the shape of the three weeks, not to
be told what to do.

**Honest risk.** It is the wrong shape on day one. Somebody with no history gets
a mostly empty hero, and the whole page is built around a thing they do not have
yet. **It is also the design with the least room for the gamification** in
section 5, because the tape wants the full width and the points ledger has
nowhere obvious to sit.

### 4.4 What looking at the pictures caught, which reading the code would not

Three defects were invisible in the source and obvious in the screenshot, which
is the standing reason for the rule.

**The wall of absence.** A thirteen week heat map drawn for Gordon, who has seven
days on the record, is **84 empty squares beside 7 full ones**. That is a tally
of failures nobody asked for, arriving through a layout constant rather than a
decision, and it is loss framing drawn in pixels on a product whose standing
ruling refuses loss framing. Design C had the same defect in a second shape: a
fixed ninety column tape put Gordon's seven days in the corner of an empty field.
**Both are fixed. The span is now earned**: the grid holds the history it has,
rounded up to a whole week with one week of room ahead, and grows to the cap.
Nothing is drawn that the person has not lived through.

**The analytic that spoke without evidence**, in 4.2 above.

**A fortnight read as a trend.** Design C compared the last fortnight to the one
before and printed "down" for Marcus, whose run was standing at its longest, on
the strength of 13 days against 14. Replaced with days missed, which is a number
a person can act on and cannot be read as a direction it does not have.

---

## 5. THE GAMIFICATION, WIRED HIS WAY, AND MEASURED

### 5.1 The loop as he stated it

> "When I input stories I get points by the type of impression that I add, and
> that allows me to go through my core product loop of imprints and release."

That is already the shape `DESIGN-gamification.md` built, and the vocabulary
matches: a mark counts what you did, an award records what moved, karma is what
either pays. What is new in his message is that **the ritual builder and the
accountability tracker are where the points are seen**, rather than the Compass.
All three designs put them there.

### 5.2 The loss framing, measured rather than argued

This is the part I was asked not to duck, so here is the whole of it.

**What the record said before today.** `PANEL-ritual-1000.md` refused loss
framing. `DESIGN-gamification.md` section 6.6 priced the refusal at **3.0 points
of 1000 at day thirty** and recorded the argument at section 3, objection 4,
where sales lost.

**The first thing to say is that the price was quoted off the wrong arm.** The
simulator's `REFUSED loss framing` config does one thing: it swaps the daily
probability of practising from Patel's control arm at 0.30 to Patel's loss framed
arm at 0.45. That is the **uplift with no downside at all**. It is a ceiling, not
a mechanic. His ruling contains a second half the arm does not model: **a
deduction lands when you miss.**

So I modelled his mechanic. `proto/ritual/losssim.js` adds the deduction as extra
one day churn on **every miss**, which is the difference between it and the run
break shock already in the model: the run break needs a live run and a spent
grace day, a points deduction needs only a day you did not show up. It carries
the same fragility discount, so somebody with sixty days banked barely feels it
and somebody on day two feels all of it. The fork reproduces the published 199
and 229 exactly and passes all forty two checks, which is how I know the tool is
not lying.

**The design as costed, with no loss framing anywhere: 199 of 1000 at day thirty,
19.9 points.** Against that:

| the mechanic | day 30 of 1000 | points | against the design as costed |
|---|---|---|---|
| uplift only, the arm the two documents priced | 229 | 22.9 | **plus 3.0** |
| his mechanic, deduction stings 0.05 | 206 | 20.6 | plus 0.7 |
| **his mechanic, break even** | **199** | **19.9** | **0.0, at a sting of 0.07** |
| his mechanic, deduction stings 0.10 | 192 | 19.2 | minus 0.7 |
| his mechanic, deduction stings 0.15 | 180 | 18.0 | **minus 1.9** |
| his mechanic, deduction stings 0.25 | 160 | 16.0 | minus 3.9 |
| his mechanic, deduction stings 0.40 | 131 | 13.1 | minus 6.8 |

And the case where the sting lands but Patel's behaviour change does not
transfer, which is the downside scenario and has to be on the record:

| deduction with no uplift | day 30 | points | delta |
|---|---|---|---|
| stings 0.10 | 150 | 15.0 | minus 4.9 |
| stings 0.15 | 134 | 13.4 | minus 6.5 |
| stings 0.40 | 84 | 8.4 | minus 11.5 |

**So here is the honest answer, and it is not the one either earlier document
predicted.**

1. **The refusal was priced against a ceiling.** Read as uplift only, loss
   framing is worth plus 3.0 points, so the earlier claim that refusing it costs
   3.0 points is correct as far as it goes.
2. **His mechanic, as he stated it, is not that arm.** With the deduction he
   described actually in the model, it breaks even at a sting of 0.07 and goes
   negative above it. At a sting of 0.15 it is **minus 1.9 points**, robust
   across five seeds at minus 1.3 to minus 2.3.
3. **So the earlier refusal was directionally right and its number was wrong.**
   It refused the thing on ethics and priced it as a sacrifice. Measured, at any
   deduction a person would actually feel, it is **not a sacrifice at all**. It
   costs retention as well as costing ethics.

**Who pays for it, which is the finding that decides the design.** Day 30
survivors per ICP at a sting of 0.15:

| who | weight | no loss framing | his, unguarded | delta | his, guarded | delta |
|---|---|---|---|---|---|---|
| Diane | 180 | 26 | 28 | plus 2 | 29 | plus 3 |
| Derek | 170 | 19 | 19 | 0 | 20 | plus 1 |
| **Marcus** | **160** | **52** | **36** | **minus 16** | 44 | minus 8 |
| Angela | 150 | 20 | 19 | minus 1 | 20 | 0 |
| Sofia | 140 | 56 | 51 | minus 5 | 54 | minus 2 |
| James | 100 | 13 | 15 | plus 2 | 16 | plus 3 |
| Gordon | 35 | 0 | 0 | 0 | 0 | 0 |

**Marcus loses 16 of 160 and he is the largest single loss in the panel.** The
reason is structural and it is already in the record: **Marcus is inside the 465
of 1000 who cannot run a release at all**, his `releasable` count measures zero,
and four of the sixteen marks can never be earned by that group. So the deduction
lands on the person with the fewest ways to earn it back. **A points system that
can take from somebody who cannot earn is not a game, it is a fine.**

### 5.3 So ship it, with one guard, and it pays

The guard is one rule: **nothing can be taken until something has been banked.**
Modelled as seven recorded days before any deduction can fire:

| | day 1 | day 7 | day 30 | points | delta |
|---|---|---|---|---|---|
| unguarded, sting 0.15 | 819 | 394 | 180 | 18.0 | minus 1.9 |
| **guarded, sting 0.10** | **829** | **415** | **206** | **20.6** | **plus 0.7** |
| guarded, sting 0.15 | 829 | 415 | 195 | 19.5 | minus 0.4 |
| guarded, sting 0.25 | 829 | 415 | 177 | 17.7 | minus 2.2 |

Day 1 and day 7 are **untouched** by the guard, at 829 and 415, because the
entire first week is protected and that is where the churn is. Marcus's loss
halves, from 16 of 160 to 8.

**The recommendation, and it serves his ruling rather than dodging it.** Ship
the loss framing. Make the deduction small and make it wait. Specifically:

- **Points are lost on a missed accountability**, as he ruled, and it is visible.
- **Nothing is deducted until seven days are on the record.** A person who has
  banked nothing cannot be fined.
- **You can only lose what you have earned**, so the ledger floors at zero and
  never goes negative. A negative number in front of somebody whose nervous
  system this product is reading is not a mechanic, it is an insult.
- **The deduction is smaller than the day's earning.** If a kept day pays one and
  a missed day takes less than one, then a person who keeps four days in seven is
  still moving up, which is true and is the thing that keeps Marcus.

That is his mechanic, built the way he asked, at **plus 0.7 points** instead of
minus 1.9. The swing from the guard alone is **2.6 points**, which is larger than
the mechanic itself.

**One more thing he should have, from the Duolingo number.** The grace day
already exists in `streakRead` and no surface has ever mentioned it. Making it an
object a person holds, the way Duolingo sells the freeze, costs nothing to build
and turns an invisible mercy into a visible one.

---

## 6. THE TWO REVERSALS

### 6.1 "The where and when does not belong there"

**What it costs.** The if then plan measured **72 of 1000 at day thirty**, the
largest single item in the whole loop, on Gollwitzer and Sheeran 2006, 94 studies,
d 0.65, the largest effect in this repository's research file.

**He is right about the surface and wrong about the mechanic, and those are
separable.** Two text fields in the middle of a builder, asked before a person
has ever done the thing once, is the wrong moment for them. A plan is not made
when you are choosing, it is made when you have chosen.

**Where it should go.** Onto the **confirmation**, after the ritual is saved and
before it is first run, as one line rather than two fields: "when I have put the
kettle on, in the chair by the window". One control, one sentence, skippable,
and it appears **once** rather than sitting on the surface forever. And it is
read back on the daily tracker as part of the row, which is where it does its
work: the effect in Gollwitzer and Sheeran is in the **retrieval**, not the
writing.

**My recommendation: keep the mechanic, move it off this page.** It is worth 72
of 1000 and he has not said it is worthless, he has said it does not belong
there. He is right that it does not.

### 6.2 "The record does not belong there"

**What it costs.** Moving the record onto Ritual measured **40 of 1000 at day
thirty**, on Harkin 2016, 138 studies, d 0.40, larger when physically recorded.
It was moved there because it was locked inside the Compass, which measures **22
percent touched**, so the accountability half of this product was reachable by
about one person in five.

**This one I think he is right about for a different reason than he gave, and it
does not cost the 40.** He is objecting to `ladderHtml` as it renders: a bare
headline zero, a stray comma, a ledger of four figures and a list of marks,
stacked under a builder card. That is not the record being on the wrong surface.
That is the record being **ugly and undesigned** on the right surface.

**Where it should go. RB7 is the answer and it is his own.** He asked for the
accountability tracker to show how he has done over time, as a thing rather than
a line. So: **the record does not sit under the builder, it becomes the other
half of this surface**, which is what all three designs do and what design C does
hardest. The 40 of 1000 is banked, because the record is still off the Compass
and still on a surface a person reaches. `ladderHtml` in its current form is
retired from this page and its arithmetic, which is correct, feeds the heat map,
the tape and the four figures instead.

**My recommendation: agree with him, keep the number.** The thing he is pointing
at should go. The measurement it carries does not have to go with it.

---

## 7. THE RECOMMENDATION

**Superseded twice, by him, and this section is kept for its reasoning and not
for its verdict. Marked 21 September.** He ruled Design B at the fifth pass,
"Design B is the one, the board, and it has to look like a calendar", which is
`RC1` in `TASKS.md`. He then ruled the seventh pass layout over that: stats on
top, the week second from Monday, three bands in his order, cards that open, a
journal snippet, where to improve, and Monday to Friday reading as a pixelated
audio waveform, which is `RU1` to `RU9`. The newest thing he has said about
this page is that the ring is a dotted line whose dashes are the count, and
`0h2` delivered it. **The shape is not open and nothing should be sent to him
asking which one it is.** What survives from this section is the object list,
because he asked for iconography, a daily tracker, an edit control, a heat map
and analytics, and those are requirements under any shape. They are `RB2v` to
`RB7v`, still open.

**Design A, the compass.** Build that one.

The reason is that he asked for a compass and gave a reason for it, and the
reason is right. A compass is not decoration here: it is the only one of the
three shapes that puts **the diagnosis and the day in one object**. The outer
ring says where your charge is, the inner ring says what you have done about it
this month, and the centre says how long you have kept it up. That is the whole
product in one glance, and it is the shape language the Field and the Compass
already use, so this surface joins a grammar instead of inventing a fourth one.

**It also fixes the actual defect.** The thing that made the page meaningless is
that the cause of the practice is never joined to the practice. The dial joins
them structurally: the heavy arc is the cause and it is six inches from the
effect, with one sentence between them.

**Take two things from the others.** From B, the glyph inside the ring, because
an icon carrying the kind of a practice before its name is the single cheapest
legibility win on the page and it is exactly what Streaks does. From C, the run
height on the record, because a halving that reads as a step down teaches the
miss rule without a sentence explaining it.

**Do not build C first**, for the reason in 4.3: it is the wrong shape on day
one, and day one is where 465 of 1000 of this panel live and where the first two
days already account for 410 of 1000 exits. It is the right shape for day thirty
and it should be the accountability surface later.

### The grade delta

D minus to **B plus**, and I will say what stops it being an A.

| | now | design A |
|---|---|---|
| his six objects present | 0 of them | all six |
| words on the page | 185 for Marcus, 221 for Rosa | 172 |
| simultaneous choices, centre | 11 | **3** |
| simultaneous choices, screen | **94** | unchanged until the rails are cut |
| does the page say why the practice arrived | no | yes, one sentence |
| can a person edit history | no | yes, tap a day |

**What holds it below an A is the 94.** The card is fixable in a day and the room
it sits in is not. A three choice object inside a 52 choice left rail is still a
94 choice screen, and that is the architectural item already standing open in
`CLAUDE.md`. Nothing in this document touches it and no ritual builder can.

---

## 8. THE QUESTIONS

There are already 66 unanswered questions in `TASKS.md` and he asked today
whether the team had asked him anything. So this is five, and each is answerable
in a sentence.

1. **The deduction size.** Section 5.3 says a missed day should take less than a
   kept day pays. Is a kept day **1 point and a missed day minus 0.5**, or do you
   want it harsher and to spend the retention?

2. **Streaks caps the board at six per page and this product deals one practice
   at a time.** Does a person get **one ritual a day**, which is what the engine
   currently calls for, or do they build a stack of up to six and the reading
   only chooses the first?

3. **The compass shape.** Design A draws the seven seats as arcs with the heavy
   one weighted. `TASKS.md` CMP3 rules that the Compass figure gets **twenty one
   equal bands, one per law of integrity**. Should the ritual dial be the seven
   seats, or the twenty one laws, or are they allowed to be different objects?

4. **The record on this page.** Section 6.2 recommends the accountability tracker
   becomes the other half of the Ritual surface rather than a card under the
   builder. Do you want that, or do you want it as **its own eighth tab**?

5. **The sniffer feeding the builder** is RB11 and it is new. When the sniffer
   finds something in a journal entry that should become a practice, does it
   **add it to tomorrow's ritual automatically**, or propose it and wait?

---

## APPENDIX. WHAT IS IN `proto/ritual/`

| file | what it is |
|---|---|
| `compass.html` | design A. Standalone, 46.8 kB, no network |
| `board.html` | design B. Standalone, 46.3 kB, no network |
| `tape.html` | design C. Standalone, 45.7 kB, no network |
| `losssim.js` | `tools/loopsim.js` plus the owner's loss framing arm. 42 checks, all passing. `node proto/ritual/losssim.js --loss` prints section 5 |
| `build-data.js` | pulls the real reading out of `engine.js` and the real walks out of `losssim.js`. Refuses to write on any mismatch against `PANEL-ritual-1000.md` A1 |
| `data.json` | the extracted numbers, inlined into all three pages |
| `build.js`, `shots.js`, `perf.js` | assemble, screenshot and measure |
| `shot-*.png` | every design at 1600 by 1000 and 390 by 844, for Marcus and for Gordon |

`tools/loopsim.js`, `tools/ritualsim.js`, `PANEL-ritual-1000.md` and
`DESIGN-gamification.md` are unmodified. Nothing in `atuned_src/` was touched.
