# UI UX architecture review

Dani Sorensen. Five passes, run separately and not merged. Everything counted
was counted in a real Chromium at 1600 by 1000 and again at 390 by 844, on the
build at `source.html` as of this session. Where I state a number I state how I
got it.

Method note. Every count below comes from one selector run against the live
document, deduped so that a control inside another counted control is not
counted twice:

    a[href], button, input, select, textarea, [role=button], [role=tab],
    [onclick], .ad-r, .pill, .imp, .pm-b, .dom, .arc, canvas#cv, .mx>*,
    .bub, .kb-r, .gm-c

filtered to elements that are visible and intersect the viewport, then any
element with a counted ancestor removed. The wheel canvas counts as one.

Two states were walked: a reference profile (James, 57) and a genuinely blank
one, loaded with storage cleared, which is what a stranger sees.

---

# Pass 1. The first ninety seconds

The job. Somebody arrived because they have a thing they cannot name. Diane at
46 is running a company and sleeping badly. Angela at 36 has read everything
and applied none of it. Marcus at 44 has been told he is difficult and does not
believe it. None of them arrived to look at an instrument. They arrived to find
out whether the thing they suspect about themselves is true.

## Second 0 to 5.3. The overture

Measured. The boot overlay clears at **5346ms**. The summary is painted and
readable underneath it at **303ms**. So the product is ready in a third of a
second and holds the person out for five more.

    boot overlay removed      5346 ms   panels.js:692, head.html:2318
    summary painted           303 ms

The animation is good. It is the twelve principles done properly and it is the
instrument's own geometry. It is also 5.2 seconds long, has no progress
indicator, and has no visible way out. There is a skip, at `panels.js:701`, on
`pointerdown` and `keydown`. Nothing on screen says so.

Against this product's own floor: 3 to 10 seconds requires a progress bar
showing what is left. There is none. The rule exists because a progress
indicator buys roughly three times the patience, and here nothing is buying
anything, because nothing is actually loading.

I am not asking for the overture to go. I am asking for it to cost what it is
worth. Two changes, both small:

1. A hairline progress arc on the boot ring, so the five seconds are legible as
   five seconds rather than as a hang.
2. One line under the wordmark: `press anything to skip`. It is already true.
   A control with no affordance is the same as no control, and that is rule 10
   of the product's own skill.

On a second visit, the five seconds are charged again. The code argues this
deliberately, and I disagree on one narrow point: a person who has seen it
four times is not being given an overture, they are being taxed. Keep it
unskipped by default, and let the skip be visible.

## Second 5.3 to 9. What is this

The app opens on Summary (`ui/ui.js:875`). `BIBLE.md` still says it opens on
Field; that is stale and should be corrected, because the opening surface is
the single most consequential fact in this review.

On the blank first screen, measured by zone:

    zone      words   numbers
    centre      261       9
    left rail    46       7
    right rail  153      29
    top bar      15 controls

    total visible choices, deduped, above the fold:  86

The centre column is excellent and I want that said before anything else. It
holds its first number back for **183 words**. It says, in plain language,
"Nothing has been entered, so there is nothing to read. The arithmetic
underneath works and it is not being shown, because a number off a default is a
number about the default and not about you." That is the best sentence in the
product. It is the whole brand in twenty seven words.

Then the rails print 36 numbers about the default.

Sitting eighteen inches to the right of that sentence, on the same screen, at
the same instant:

    archetypes    First 26%   Second 19%   Third 19%
    domains       First 100%
    field         Heaviest  Root  0.0
                  Most shut Truth at the throat
    chip row      Fetters 9
    left rail     Benign or malignant  72 / 28

And in the centre, below the fold, a full numerology reading derived from the
literal string "You": Expression 7, Soul urge 9, Personality 7.

`COPY.md` forbids exactly this, twice: "A percentage is never printed off a
default" and "Name a person off a default." The centre obeys. The rails do not.
This is not a copy bug, it is a boundary that only half exists: `r.unread`
gates `sumRender` and does not gate the person block at `ui/ui.js:738` to
`:739`, nor the chip row, nor the left rail's polarity bar.

A stranger cannot tell which half is lying. The honest half is therefore
wasted, because the dishonest half is louder, more numerous and in colour.

## Second 9 to 40. The four doors

`component.js:310`, `STARTD`. Four doors, in the centre, with a sentence each:

    Write what happened          the day, in your own words
    Read nine sentences          for anyone who cannot think of themselves
                                 as the problem
    Go year by year              three to eighteen
    Say who you are becoming     the avatar

This is the strongest piece of funnel design in the product and it is the
answer to the `BUYERS.md` problem. The grid says onboarding cannot be written
for level 8, and these four doors are four different levels:

    Write what happened     Diane, Derek. Level 7 to 8. Has material,
                            wants the machine to do the reading.
    Read nine sentences     Angela, Marcus. Level 4 to 5. Cannot self
                            accuse, needs recognition not confession.
    Go year by year         Marcus, James. Level 5 to 6. Cannot name a
                            feeling, can name a year.
    Say who you are becoming Derek, Sofia. Level 8 to 9. Wants a target.

Four doors, four psychographics, correctly matched. And nothing routes anybody.
They are presented as a flat list in fixed order, so every person reads four
descriptions and self sorts. Self sorting is what level 4 and 5 are worst at,
which is exactly who these doors exist for.

Counted: **4 doors, 62 words of door copy, 0 routing**.

## The four second test, stated flatly

Standing in front of the blank screen as a stranger:

- *What do I think this is.* Something medical or something astrological. The
  numerology block and the word "Coherence" pull in opposite directions and
  both are visible in the first viewport.
- *What do I think I should do.* Read. There are 802 words on screen. The four
  doors are the only thing that looks like an action and they are below the
  centre hero, competing with 36 numbers to their left and right.
- *What am I afraid of.* That the 26 percent next to my name is a verdict I did
  not agree to. The rails print a reading of me before I have said anything,
  which is precisely the fear the centre paragraph was written to defuse.

## Pass 1 verdict

The centre column is A work. The rails undo it. The first ninety seconds do not
fail because anything is missing; they fail because two halves of one screen
give a stranger contradictory accounts of whether the instrument knows
anything about them yet.

---

# Pass 2. Information architecture and navigation

The job. "Where is the thing I want, and how do I get back."

## The tree, measured today

Eight tabs in the bar, left to right: Energetics, Story, Field, Body, Compass,
Knowledge, Games, Summary. Settings is integer 9 with no tab, reached from the
person icon. Analytics is integer 4, folded into Summary.

    tabs in the bar                8
    top bar controls              15
    left rail sections             4    one open at a time
    right rail sections            5    plus a pinned line and one button
    drill renderers               19    all writing into #rdrill
    overlays                       3    #rel, #rit, #deck

## The central fact, still unstated on screen

Both rails are present on all eight tabs. `setTab` swaps the centre and hides
the canvas. **The rails are the app and the tabs are a stage.** Nothing in the
interface says so, and the consequence is that a person builds the wrong mental
model in the first minute and keeps it: they think the tabs are the product and
the rails are decoration, which is backwards.

Evidence that the model is wrong, from the counts:

    tab           choices   of which left rail   right rail   top   stage
    summary            86            47               11       15      13
    story             111            47               11       15      38
    field              77            37               11       15      12  (+2 sub)
    body               70            37               11       15       0  (+7 sub)
    energetics         90            47               11       15      17
    knowledge          98            47               11       15      25
    compass            80            47               11       15       7
    settings           85            47               11       15      12

On Body, the stage contributes **zero** counted choices. Every single control
on that screen is chrome. A person navigating to Body to look at their body is
given 70 controls, none of which are the body.

## What is broken in navigation

**Games renders nothing.** Blocker. `TABDEF` was changed to give Games its own
tab back (`engine/core.js:92` to `:96`), and the render dispatch was not
updated with it. `ui/panels.js:168` reads:

    if(i===TAB.KNOW){kbRender(); if(!GAME)GAME='lg'; gmRender();} else lgStop();

So `gmRender()` is only ever called when the person selects Knowledge, and the
`else` branch calls `lgStop()` on the Games tab, which stops the letting go
clock on the one tab that runs it. Measured: after clicking Games in the bar,
`S.tab` is 7, `#games` is `display:flex` at 903px tall, and its `innerHTML`
length is **0**. A top level tab in the shipping bar shows an empty box.

**The three overlays still have no dismissal contract.** Measured: opened the
release run, pressed Escape, it stayed. Changed tab to Knowledge, it stayed,
full screen, over the next surface. Screenshot at `/tmp/w1100.png` shows the
release dialog floating over the Knowledge tab. The sheet at `#sheet` closes on
Escape correctly. So the product has two dismissal contracts for four modal
surfaces, and the person cannot know which one they are in.

**The tab bar scrolls at laptop width.** Measured `data-end` flips to `0` at
1100px, which means there is content past the right edge. At 1366, the width of
a large share of laptops, Summary is at risk of sitting off the strip. The
strip has a measured fade, which is honest, but a fade is not a control. Eight
top level destinations should not be a horizontal scroller on the most common
desktop width.

## What is right and should be protected

**The drill is the one detail surface.** Nineteen renderers, one host,
`rdOpen` unfolds the section and scrolls it into view. Five entrances to the
address drill. This is the best architecture in the product. Every new surface
should be asked whether it is a drill before it is allowed to be a tab.

**The compass has a front door.** It used to be three clicks inside a marker.
It is a tab. Correct.

**Settings is integer 9 with no tab.** Correct. A setting is not a peer of the
instrument.

**Mobile navigation is better than desktop navigation.** Measured at 390 by
844: 16 to 35 choices per screen, zero tap targets under 44, no horizontal page
scroll. The phone already solved the problem the desktop has.

## The one route that does not exist and should

Two prose sentences still name a destination with no door: `analytics.js`
"Answer them in Intake" and `drills.js` "Three questions would replace the
guess". Recognition over recall, inverted: the product names a place and makes
the person find it.

---

# Pass 3. Cognitive load, counted

The job. "How many things am I being asked to decide right now."

## The numbers

Desktop, 1600 by 1000, deduped, above the fold, reference profile loaded:

    story         111
    knowledge      98
    energetics     90
    summary        86
    settings       85
    compass        80
    field          77
    body           70

    mean           87
    range      70 to 111

The repository records this as 57 to 71 and calls it architectural. **It has
grown.** The floor is now 70 and the ceiling is 111. Whatever has been added
since that measurement was taken has been added on top of a screen that was
already over budget.

Phone, 390 by 844, same method:

    summary        16
    energetics     18
    story          27
    field          29
    body           35

    mean           25

The phone is **3.5 times lighter than the desktop** for the same product and
the same data.

## Where the load actually is

Constant chrome, present and identical on all eight tabs:

    top bar        15
    left rail      37 to 47
    right rail     11

    constant       63 to 73

Variable, the thing the person navigated to see:

    stage           0 to 38
    sub bar         0 to 7

**Between 72 and 90 percent of every screen is furniture.** On Body it is 100
percent. The person pays the full cognitive bill on every tab and gets between
zero and 38 controls of what they came for.

## Counting controls is the wrong measurement, and that is why this has stalled

Hick's law is about alternatives within one decision, not about elements on a
page. A grid of nineteen blueprint domains is **one** decision with nineteen
options. Counting it as nineteen inflates the number and, worse, points the fix
at the wrong place: it suggests deleting domains, which would destroy the
product, when the actual problem is that the grid is on screen at all when
nobody asked it a question.

Recount the same eight screens as decision groups. A homogeneous set with one
label and one consequence counts as one:

    top bar        6 groups   tabs, profile, history, lighting, help, settings
    left rail      4 groups   Awareness, Fetters, Spiritual, Matrix
    right rail     5 groups   Reading, Selection, Flow, Running, Laws
                              plus one button
    stage          2 to 6 groups

    total         17 to 21 decision groups per screen

Working memory holds about four. The target for a working screen is under
twelve. Seventeen to twenty one is still over, by roughly double, and now the
number points somewhere useful: there are too many **groups**, and the groups
are too **large**.

## The decision

I am ruling this, because it has been open long enough and the number is going
up while it stays open.

**The desktop adopts the phone's discipline: one rail is reachable, not
present. The left rail stops being furniture and becomes a spine.**

Concretely, and this is buildable in one pass:

1. **The left rail collapses to a 56px spine.** Four icons, vertical, each with
   a visible label at the size the design system already uses for the sub bar:
   Awareness, Fetters, Spiritual, Matrix. Ring icons, existing family, existing
   colours. Tapping one slides that section over the stage as a drawer, one at
   a time, closing on Escape and on a backdrop click, which also gives the
   product its missing single dismissal contract.

   The four sections are **inputs and structure**. They are not readings. A
   person does not consult the 171 cell matrix while reading their summary.
   Nothing is removed, nothing is hidden with no affordance, and the spine is a
   permanent, labelled, 44 by 44 compliant control. Rule 10 holds.

   Measured effect: every screen loses 33 to 43 controls.

2. **The imprint cloud on Story collapses to its five group headers with
   counts, one group open at a time.** The cloud is currently 38 pills on the
   stage, which is where Story's 111 comes from. Five headers plus one open
   group of roughly seven is 12.

   Measured effect: Story loses 26.

3. **A homogeneous catalogue list counts as one group and is exempt.**
   Knowledge is a reference surface. A list of 112 addresses is one decision
   with 112 options and is correct as it stands. Write the exemption into the
   rule so nobody "fixes" Knowledge.

Projected after the two changes, by the same method:

    body           37        was 70
    compass        37        was 80
    settings       42        was 85
    summary        43        was 86
    field          44        was 77
    story          42        was 111
    energetics     47        was 90
    knowledge      55        was 98   (list exempt)

    mean           43        was 87

Decision groups fall from 17 to 21 down to **9 to 13**, because the four left
rail groups become one.

4. **Make it a gate so it cannot drift back.** `tests/design.js` grows one
   check: render each tab at 1600 by 1000, run the selector above, dedupe, and
   fail over **45** visible interactive elements, with a named exemption list
   for homogeneous catalogues. This is the part that matters. The number moved
   from 71 to 111 because nothing was watching it. An architectural decision
   with no gate is a preference.

What I am explicitly not proposing: deleting a domain, an archetype, a law or
an axis. The product's density is its argument. The problem is not that the
product knows 112 things. The problem is that it shows a person forty of them
while they are reading a paragraph about something else.

---

# Pass 4. Interaction mechanics

The job. "When I touch it, does it answer, and can I take it back."

## Tap targets. Passing

Measured at 1600 by 1000: **one** element under 44 by 44 per screen, and it is
a decorative 24px svg inside a compliant parent. At 390 by 844: **zero**
violations on all five screens tested. The 44 floor is genuinely held. This is
better than most shipping products and it should be said.

## Feedback. Mixed

**Undo is now excellent and is the best single control in the product.** After
committing a story the button reads "Undo committing the story". It names what
it takes back. That string is the pattern every destructive control in this
product should copy, and right now exactly one does.

**Undo is visible when there is nothing to undo.** Defect, one line. The code
at `panels.js:670` argues correctly that "a permanently disabled button is
furniture" and sets `b.hidden=(n===0)`. It does not work, because
`head.html:499` is `.histpair{display:flex}` with no `[hidden]` guard, and
`display:flex` beats the user agent's `[hidden]{display:none}`. Measured at
blank boot: `undoDepth()` is 0, `hidden` is true, and the button is 89 by 44
and on screen. The same file guards `.gmenu[hidden]`, `.start[hidden]` and
`.sheet[hidden]` correctly, so the pattern exists and this one was missed.

A stranger's first screen therefore offers to undo something they have not
done.

**A commit reports nothing through `status()`.** Measured: wrote 200 characters,
pressed Commit, the reading changed from "not read yet" to "36 percent,
Incoherent", and `#status` was empty. The largest state change the product can
make outside a release passes without a word. Rule 3 says every action gets a
response; the Undo label is the response here and it is in the far corner of
the top bar, which is not where the person is looking.

## The contradiction. Blocker

After a commit, on one screen at one instant:

    centre, sumbody:    You. 36%. Incoherent. Frustrated.
                        "Nothing is held above the line, so nothing is
                        reaching the body as load. There are 11 addresses
                        carrying under it."

    right rail, person: "Nothing has been entered yet. Write what happened,
                        or answer the questions, and this fills in."

The rail is printing `p.says` from `ui/personas.js:205` unconditionally at
`ui/ui.js:738`. `says` is the persona's fixed quote field, being used as an
empty state. For the blank "You" profile it holds the empty state sentence
forever, so it survives every amount of entered data.

Directly beside it, the same block prints Archetypes First 26 percent, Second
19, Third 19, and Domains First 100 percent, which are live. So one card says
nothing has been entered and prints four percentages about the person who
entered nothing.

This is the defect I would fix first after the blank Games tab. It is not a
polish item. It is the instrument contradicting itself about whether it knows
anything, which is the one thing this product cannot be wrong about.

## Empty and refusal states

Good: `bRel` no longer runs a 2.8 second destructive animation on an empty
field. It is disabled, and `Commit 0` is disabled at zero words. Both honest.

Bad: **Body's caption and the right rail disagree on the same screen.** The
Body stage caption reads "nothing carrying, 6 addresses hold the opposite
instead" while the right rail two hundred pixels away reads "Carrying 18
addresses". The caption is scoped to the selected layer and says nothing about
being scoped. A slot keeps its label and the value carries the state; here two
slots with near identical labels carry contradictory values.

## Overflow. Rule 10 broken in three places

1. **The imprint group strip.** Measured `clientWidth` 390 against
   `scrollWidth` 414, `overflow-x:auto`, scrollbar not drawn. The sixth group
   is clipped at the right edge with no fade, no chevron and no wrap. The tab
   bar has a measured fade for exactly this case (`paintTabEdge`); the imprint
   strip has nothing.
2. **The release queue list** clips its last row mid height with no scroll
   affordance. Visible in `/tmp/w1100.png`: "Escapism" is cut in half.
3. **The lighting segment in Settings** clips "Glass" at the card edge.

## Typography. A systemic defect

`head.html:685` applies `text-transform:capitalize` to `.pm-eye, .tier1, .sub,
.sp-hd, .rit-tr, .ip-bh, .sum-lt, .ad-nm, .gm-on, .eyebrow, .lbl`.

The source strings are correct sentence case. The CSS breaks them at render:

    "Where to start"          renders  "Where To Start"
    "Numerology, in full"     renders  "Numerology, In Full"
    "Primary and secondary"   renders  "Primary And Secondary"
    "Run a release"           renders  "Run A Release"
    "Shame of desire"         renders  "Shame Of Desire"
    "Need to be needed"       renders  "Need To Be Needed"
    "The protocol this calls for"  renders  "The Protocol This Calls For"

`BIBLE.md` says sentence case. This is not title case either, since title case
leaves "of", "to", "and" and "a" lowercase, so the product is rendering a third
thing that is neither of its two options. It applies to `.ad-nm`, which is an
address name, so it is mangling the product's own 112 nouns.

The code comment at `head.html:680` already flags this as unresolved and hands
it to the owner. I am answering it: **take the rule out.** The strings are
already written correctly, in the correct case, by a copy discipline that is
documented in `COPY.md` and enforced by `tools/terms.py`. A CSS rule that
overwrites correct copy at paint time is a second, invisible copy authority,
and the product has one copy authority. `tests/design.js` currently checks for
all caps and does not check for this, which is why it shipped.

## Counts against totals. Three, on the reading itself

`BIBLE.md`: "A reading is not a score. Never print a count against a total."

    ui/panels.js:471    Math.round(r.CQ)+' of 100'
    ui/panels.js:531    Math.round(r.CQ)+' of 100'
    ui/intakeui.js:81   answered+' of 63 answered, '+scored+' of 21 laws
                        measured'

The Settings surface prints "Coherence 13 of 100". That is the single most
sensitive number in the product, printed as a test score, on a surface a person
opens to check their plan. The two Intake counts are a different case and worth
naming as a collision rather than a violation: progress through a form is not a
reading, and hiding the remainder there would hurt more than it helps. My
proposal is "63 answered" and "21 laws measured" as the words, with the
existing progress bar carrying the remainder, which keeps the affordance and
respects the ruling. The two `of 100` on coherence have no such defence and
come out.

---

# Pass 5. The session, and the week

The job. "What do I do today, and what brings me back on Thursday."

## Day one

Measured, fastest honest path from cold load to a personal reading:

    boot overture                          5.3 s
    read the centre, find the doors        ~12 s
    click "Write what happened"            1 tap, lands on Story, focuses
                                           the textarea. Correct.
    write 200 characters                   ~60 s
    press Commit                           1 tap
    reading appears                        under 100 ms

    total, floor                           ~80 s, 3 taps

That is a good funnel. Three taps and eighty seconds to a reading, with the
door pre-focusing the textarea, is genuinely well built and I want that on
record before the criticism.

What breaks it: the reading appears on Story, silently, with no status line,
and the person has to work out that Summary now holds something. Nothing walks
them back. Counted: **zero** prompts after a commit.

## The end of the first session

There is no close. The product has no concept of a session ending. A person
writes a story, gets a reading, and then the screen sits there in exactly the
state it was in. Nothing says what changed, nothing says what is new, nothing
says what tomorrow would add.

Four objects exist that would close it, and three of them are wired to nothing
a person can see:

    Next marker      surfaced, Settings. "Entry, 1 away". Good.
    The gift of 100  surfaced, Settings. "100 of the gift left". Good.
    Dated firsts     collected at release.js:86 to :93, never rendered.
    The record       Compass, "0 days, last run". A streak with no streak.

## Day three and day seven

The week loop is Compass: a 30 day oscillation chart, the record, and "Build
today's ritual". The ritual builder writes to `CURP.rituals` and, unlike the
last review, that array is now read back by `ladder.js` and surfaced in
`cone.js:605` as "Rituals saved". The loop is closed. That is real progress.

What is missing is the reason to open the app on a day when nothing happened.
The product's whole account of return is a 30 day chart that says "no readings
in this window", and a day counter at zero. Both are honest and both are
uninviting. Nothing in the product ever tells a person that something moved.

Counted: **zero** change notifications anywhere in the product. No "that is new",
no "that moved", no "this is the first time". Every reading is a steady state
photograph. For an instrument whose entire claim is that it measures change
over time, that is the largest structural gap in the session design.

## The psychographic problem, walked

Three ICPs from three levels, same path, marked where each stops.

**Derek, 39, high performer. Level 8, Aligned.** Boots. Skips the overture by
accident. Reads the centre, likes that it refuses to guess. Picks "Say who you
are becoming". Gets the avatar drill. Goes to Energetics, answers 63 questions
in one sitting because he does that. Reaches a CQ. **Does not stop.** He is
the 90 percent buyer and the product is built for him.

**Diane, 46, founder. Level 6 to 7, Receptive.** Boots. Waits out five seconds
and is mildly annoyed. Reads the centre paragraph and trusts it. Sees 29
numbers in the right rail that contradict the paragraph and trusts it less.
Picks "Write what happened", writes four sentences about her board, commits.
Gets 36 percent, Incoherent, Frustrated. **Stops here**, briefly, at the word
Frustrated with no definition adjacent to it, and then reads the paragraph and
recovers. Goes looking for what to do about it. Finds "Run a release" in the
right rail with no explanation of what a release is. **Stops here properly.**
The release is the product's central act and its only introduction is a button
label.

**Angela, 36, seeker. Level 5, Searching. 30 percent buyer, largest
population.** Boots. Five seconds of a beautiful animation, which she likes and
which sets an expectation of something mystical. Lands on a screen with 802
words, 99 numbers and the word "Coherence". Reads "Read nine sentences", which
is written directly for her and is the second door down. **Might stop before
reaching it**, because the left rail's blueprint grid of nineteen glyphs is the
most visually interesting thing on the screen and it leads nowhere she can use.
If she reaches the nine sentences she is in, because that drill is the best
level 4 and 5 asset in the product. If she clicks Games first, which is the
word on the bar most likely to attract her, she gets **a blank screen** and
leaves.

That is the tissue test result, and it is the argument for fixing the Games tab
today rather than next round. The one tab most likely to be clicked by the
hardest segment to sell is the one tab that renders nothing.

---

# Findings

| id | finding | file:line | severity | fix | size |
|---|---|---|---|---|---|
| F01 | Games tab renders an empty stage. `gmRender` is gated on `i===TAB.KNOW` and the `else` branch calls `lgStop()` on Games. Measured: `#games` innerHTML length 0, 903px tall, after clicking the tab | `atuned_src/ui/panels.js:168` | blocker | `if(i===TAB.KNOW)kbRender(); if(i===TAB.GAMES){if(!GAME)GAME='lg'; gmRender();} else lgStop();` | S |
| F02 | Right rail says "Nothing has been entered yet" beside a live 36 percent reading, because `p.says` is printed unconditionally and the blank profile's `says` holds the empty state string forever | `atuned_src/ui/ui.js:738`, `atuned_src/ui/personas.js:205` | blocker | Gate the person block on `r.unread`. Move the empty state out of `says` and into the renderer, where the one canonical string lives | S |
| F03 | Right rail prints archetype and domain percentages, heaviest seat and most shut law off a default on the blank first screen. 29 numbers in 153 words about a person who has entered nothing | `atuned_src/ui/ui.js:739`, chip row, `#polbar` | blocker | Same `r.unread` gate applied to the archetype block, the chip row and the left rail polarity bar. The centre already does this correctly; copy it | M |
| F04 | The three overlays close on neither Escape nor a backdrop click, and survive a tab change. Measured: release run still full screen over Knowledge after `setTab` | `atuned_src/ui/release.js`, `ritual.js`, `knowledge.js`, `panels.js` setTab | major | One `closeOverlays()` called from `setTab`, plus Escape and backdrop on all three, matching `#sheet` | S |
| F05 | `text-transform:capitalize` overwrites correct sentence case copy at paint time, including address names. Renders "Where To Start", "Shame Of Desire", "Need To Be Needed" | `atuned_src/shell/head.html:685` | major | Delete the rule. The strings are already correct. Add a design gate check for rendered case | S |
| F06 | Coherence printed as "13 of 100" on Settings, twice. A count against a total on the product's most sensitive number | `atuned_src/ui/panels.js:471`, `:531` | major | Print the number and the band word. The ring already carries the proportion | S |
| F07 | Boot holds the person out for 5346ms with no progress indicator and no visible skip, on a page painted at 303ms | `atuned_src/shell/head.html:2318`, `atuned_src/ui/panels.js:692` to `:701` | major | Progress arc on the boot ring, and one line: `press anything to skip` | S |
| F08 | Undo is visible at boot with `undoDepth()` 0. `.histpair{display:flex}` has no `[hidden]` guard and beats the UA rule, so `b.hidden=true` does nothing | `atuned_src/shell/head.html:499` | major | `.histpair[hidden],.vt[hidden]{display:none}`, matching `.gmenu[hidden]` in the same file | S |
| F09 | 70 to 111 simultaneous choices per screen, of which 63 to 73 are constant chrome. On Body the stage contributes zero. Recorded in the repository as 57 to 71; it has grown | measured, all eight tabs | major | Pass 3 decision: left rail becomes a spine with drawers, imprint cloud collapses to groups, and a design gate fails over 45 | L |
| F10 | Body stage caption "nothing carrying, 6 addresses hold the opposite instead" contradicts the right rail "Carrying 18 addresses" on the same screen | `atuned_src/ui/map.js` caption, `atuned_src/ui/ui.js` rows | major | Scope the caption's label to the layer: the slot keeps its label and the value carries the state | S |
| F11 | Imprint group strip overflows, 390 visible of 414, `overflow-x:auto` with no scrollbar, no fade, no wrap. The sixth group is invisible | `atuned_src/ui/imprints.js:60`, `atuned_src/shell/head.html:1914` | major | Wrap instead of scroll, or give it the measured fade `paintTabEdge` already implements | S |
| F12 | A commit changes the whole reading and reports nothing through `status()` | `atuned_src/ui/storyui.js` commit handler | major | One `status()` line naming what was read and where it landed | S |
| F13 | Intake prints "63 of 63 answered, 21 of 21 laws measured", two counts against totals | `atuned_src/ui/intakeui.js:81` | major | "63 answered, 21 laws measured", remainder carried by the existing bar. Name the collision to the owner rather than resolving it silently | S |
| F14 | The word "tier" appears twice on the Settings screen 300px apart meaning two different things: "Tier / Severe" and "Move to tier one" | `atuned_src/ui/panels.js` plan card and reading card | major | The accounts fork needs this word. Rename the coherence band's slot to "Band" or rename the plan. Settle before the paywall, not after | M |
| F15 | The demo persona picker ships in the top bar. A real person's Profile menu lists nine strangers, truncated to "James, 57, C-suite, thi" | `atuned_src/ui/personas.js:217`, `atuned_src/shell/body.html:107` | major | Move reference profiles behind Settings, or behind a build flag. A person's own profile control should list their own profiles | M |
| F16 | Help sheet describes the wheel and the rails as "the three things on screen", and the app opens on Summary where there is no wheel. It also says "hover any of them for the rest" to a touch first audience | `atuned_src/ui/panels.js:631` to `:640` | major | Rewrite the first block for the opening surface. Replace the hover instruction with the drill route, which exists | S |
| F17 | Blank first screen carries 802 words and 99 numbers before the person has entered anything | measured, blank profile, 1600x1000 | major | Follows from F03 and F09 | L |
| F18 | Tab bar becomes a horizontal scroller at 1100px. `data-end` flips to 0 | `atuned_src/ui/panels.js:707` | minor | Wrap the strip at narrow desktop widths, as the markup already allows | S |
| F19 | Release queue list clips its last row mid height with no scroll affordance | `atuned_src/ui/release.js` | minor | Fade or reduce the visible row count to a whole number of rows | S |
| F20 | Lighting segment in Settings clips "Glass" at the card edge | `atuned_src/ui/panels.js` lighting card | minor | Wrap the segment | S |
| F21 | Dated firsts are collected into `RUN.firsts` and never rendered. The only achievement shape the product allows is written and never shown | `atuned_src/ui/release.js:86` to `:93` | minor | Print them in the release done phase. The data is already in hand | S |
| F22 | "The record 0 days , last run" has a stray space before the comma | `atuned_src/ui/cone.js` record block | minor | One character | S |
| F23 | Blank profile is labelled "Custom" in the Profile select | `atuned_src/ui/personas.js:217` | minor | "You", which is the name the profile actually carries | S |
| F24 | Two prose pointers still name a destination with no link: "Answer them in Intake", "Three questions would replace the guess" | `atuned_src/ui/analytics.js`, `atuned_src/ui/drills.js` | minor | Make both a `data-start` style door. The one listener already exists at `component.js:329` | S |
| F25 | The maximise toggle on the imprint cloud is the glyph `⤢` with no label and no other route to what it does | `atuned_src/ui/imprints.js` | minor | Give it a word. One word per concept applies to controls too | S |

---

# Friction ledger

Every point of friction in the first session, ordered by cost, with the seconds
it adds. Measured where marked, estimated from the walk where not.

| # | friction | seconds | measured or estimated |
|---|---|---|---|
| 1 | Boot overture, no progress, no visible skip | **5.3** | measured, 5346ms |
| 2 | Games tab renders nothing. Click, wait, click again, click elsewhere, doubt the product | **12.0** | estimated, 3 interactions plus recovery |
| 3 | First screen carries 802 words and 99 numbers. Scanning for what is mine | **11.0** | estimated, 802 words at reading speed on a partial scan |
| 4 | Rail contradicts centre after a commit. Read both, re-read both, decide which to believe | **8.0** | estimated, two re-reads plus a decision |
| 5 | Release overlay will not close. Escape, escape, hunt for Cancel, change tab, it follows | **9.0** | measured behaviour, estimated recovery |
| 6 | Body caption contradicts the rail. Re-read, scroll, give up | **7.0** | estimated |
| 7 | No status after a commit. Where did my reading go | **6.0** | estimated, one tab hunt |
| 8 | Help sheet describes a screen the person is not on | **6.0** | estimated, read then discard |
| 9 | Four doors with no routing. Read all four descriptions, 62 words, self sort | **5.0** | measured word count |
| 10 | Undo offered at boot with nothing to undo. Press, nothing happens | **3.0** | estimated |
| 11 | Imprint sixth group invisible. Look for it, do not find it | **4.0** | measured overflow, estimated hunt |
| 12 | Tab bar scrolls at laptop width. Summary hunt | **3.0** | measured at 1100px |
| 13 | Title case mangling across every heading. Sub second each, compounding | **2.0** | estimated across one session |
| 14 | Profile reads "Custom". Whose profile is this | **2.0** | estimated |
| 15 | Release queue clipped mid row. Scroll attempt | **2.0** | estimated |
| 16 | "Coherence 13 of 100". Re-read to check it is not a test score | **1.5** | estimated |
| | **total added friction, first session** | **86.8 s** | |

Against a measured floor of roughly 80 seconds from cold load to a personal
reading, the product currently adds **87 seconds of friction to an 80 second
job**. Items 1, 2 and 3 are 33 seconds of that, and all three are fixable this
round.

---

# Missed opportunities

Named, not restated. Each is something the product already has and is not
spending.

**1. The overture is 5.3 seconds of the best animation in the product and it
says nothing about the person.** It draws a generic field. On a return visit it
could draw *their* field, filling to their current charge, and the five seconds
would become the most valuable five seconds in the session instead of a tax.
The renderer already exists. It is the wheel.

**2. The four doors are four psychographic segments and nothing routes anybody
to one.** One question above them, in the product's own voice, sorts the
largest and hardest segment: "Can you name what happened, or only that
something is off?" Name it, take door one. Only that something is off, take
door two. That is the `BUYERS.md` level 4 and 5 problem answered with one
sentence and zero new surfaces.

**3. The wheel is the signature object and a stranger never sees it.** It is on
tab three, behind two tabs they have no reason to open. A 200px live wheel in
the Summary hero, empty at first and filling as they enter, would be the single
strongest retention object in the product and it is currently invisible for the
first several sessions.

**4. "Undo committing the story" is the best copy in the product and it is used
once.** Every destructive control should name what it will take back, in that
shape, at the moment of the action rather than after. The release confirm
currently says "Begin".

**5. The record is a streak mechanic with the streak removed.** "0 days, last
run" is a dead number. Dated firsts are computed at `release.js:86`, persisted,
and never printed. The product has the data for "first time you cleared at the
throat" and shows a zero instead.

**6. The 112 addresses are a collection and there is no collection surface.**
Knowledge lists them as a reference catalogue. The person's own relationship to
them, which are held, which are filled in, which have never been touched, is
the product's natural progression object and it exists only as two numbers in a
rail row.

**7. The right rail is identical on all eight tabs.** It is 11 controls of the
most valuable real estate in the layout, spending them on the same content
regardless of what the person is doing. It is the one zone that should change
per tab and it is the one zone that never does.

**8. The identification percentage is the product's entire differentiator and
it sits in the corner of one tab.** 79.0 percent, with an interval. That number
is the honest answer to "this seems too good to be true", which `RESEARCH-icp.md`
identifies as the central objection, and it is not on the first screen, not in
the help sheet, and not next to any reading it qualifies.

**9. Nothing in the product ever says that something changed.** No first, no
delta, no "that moved". For an instrument built to measure change over time,
every screen is a still photograph. One line, on return, naming the largest
move since last time, would carry the whole week loop.

**10. There is no sound and there is a sound director.** The release run is 25
lines of rhythmic work with no auditory rhythm, in a product about the
autonomic nervous system, where a slow earcon on the exhale is not decoration
but mechanism.

**11. The phone layout is better than the desktop layout and nobody has said
so.** 25 choices against 87, zero tap target violations, no horizontal scroll.
The desktop is not benefiting from work already done and paid for.

**12. Games is the word on the bar most likely to attract the hardest segment
to sell, and it is blank.** Beyond the bug: the two games are the only places
the product is playable, and neither is on any path from any door.

---

# Grade

**Now: C minus.**

One blocker that renders a top level tab empty. Two more that have the
instrument contradicting itself about whether it knows anything about the
person, which is the one claim this product cannot get wrong. A systemic CSS
rule overwriting the copy discipline at paint time. 87 seconds of friction on
an 80 second job. Against that: real 44px compliance, a genuinely excellent
centre column, the best drill architecture I have seen in a single file app,
undo that names itself, a mobile layout at a quarter the load of the desktop,
and a four door onboarding that is correctly segmented even though it does not
route.

It is a C minus and not a D because none of the blockers are architectural.
F01 is one line. F02 and F03 are one condition applied in three places. The
product is not badly built; it is badly finished in specific, named places.

**Ceiling: A minus.**

Fixing every finding in this document lands the product at B plus. The last
half grade is the cognitive load decision in pass 3, which is the difference
between a dense instrument and an instrument a stranger can hold.

It is not an A, and I want the reason on record. `BUYERS.md` says levels 4 and
5 are the largest population and the hardest sell, and that the product is
close to unsellable at level 1. Nothing in this review fixes that, because it is
not a UI problem. Until there is a route through the funnel that works for
Angela at level 5 and Marcus at level 4 without asking either of them to accept
a number about themselves in the first ninety seconds, the instrument caps at A
minus no matter how well it is built.

**What would move the grade, stated so the next round can check it:**

    F01 alone                      C minus  ->  C
    F02, F03, F12                  C        ->  C plus
    F04, F05, F06, F07, F08        C plus   ->  B minus
    F09, the load decision         B minus  ->  B plus
    missed opportunities 2, 3, 9   B plus   ->  A minus
