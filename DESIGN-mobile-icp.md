# Mobile ICP validation

Simulated panel, 18 September. Five passes over the mobile user flow at
390 x 844. Pass one is the layout as it stands. Passes two to five are
proposals built here, each one answering what broke in the pass before.

**Every quotation in this file is simulated.** Nothing was said by a real
person. **Every percentage in this file is simulated.** It is model output
against a weighted panel, not a measurement of human behaviour. The
measurements are separate and are marked as measured.

The roster is the six ICPs in `atuned_src/engine/data/people.js` that carry
`ICP` in their role, plus the three reference cases. Weights follow
`RESEARCH-icp.md`: Diane 180, Derek 170, Marcus 160, Angela 150, Sofia 140,
James 100, Ana 50, Gordon 35, Rosa 15. Panel of 1,000.

Tags follow the previous study. BUY, HOLD, CONFUSE, RESIST, REFUSE.

---

## What was measured, and how

Chromium at 390 x 844 against `source.html` as built. Nothing was edited and
nothing was rebuilt. These are measured, not simulated.

**Chrome before content.**

| Band | Height | Bottom edge |
|---|---|---|
| Top glass bar: brand, 8 tabs on 3 rows, persona select, theme segment, Aa | 326 | 333 |
| Subbar, the view row | 62 | 401 |
| Key strip, CQ and DQ and SQ, horizontally clipped | 54 | 462 |
| Wheel canvas, 374 wide by 335 tall | 335 | 797 |

The wheel starts 462 down an 844 screen and ends 47 pixels before the fold.

**Tab bar.** Eight buttons on three rows, tops at 51, 100 and 149. The row
consumes 142 pixels of a 844 screen before the app has said anything.

**Persona select.** `#psel` at y 223, 44 tall, 262 wide, above the content on
every tab. It is a demo control and it is the third thing a person sees.

**Control counts, visible with a non zero box.**

| Tab | Controls | Under the 44px floor |
|---|---|---|
| Knowledge | 196 | 16 |
| Intake | 109 | 28 |
| Field | 86 | 6 |
| Story | 85 | 12 |
| Energy | 82 | 12 |
| Games | 78 | 7 |
| Analytics | 75 | 5 |
| Summary | 75 | 5 |

Every filter chip and imprint row measures 27 tall against a 44 floor, so the
sub floor count is not fixed. It grows with every imprint a person makes.

**Page height at 390.** Field 4,401. Intake 5,918. Story 3,898. Knowledge
9,051.

**Six findings the brief did not name, and each one is larger than the ones
that were.**

1. **The document does not scroll. The body does.** `html,body{height:100%}`
   is set at line 120 of `shell/head.html` and no breakpoint releases it. The
   mobile query at 1180 flips `overflow` to `auto` and leaves the height. So
   `document.documentElement.scrollHeight` reads 844 while
   `document.body.scrollHeight` reads 9,051, and `window.scrollY` is always 0.
   Measured: setting `window.scrollTo(0,5000)` moves nothing.

2. **Nothing is sticky.** After a 700 pixel scroll the top bar sits at
   y minus 693. Measured. On Knowledge the tab bar is 9,051 pixels from the
   bottom of the page. There is no way back to navigation except a full
   scroll to the top.

3. **The wheel is a scroll dead zone.** `canvas#cv` carries
   `touch-action:none`. The wheel occupies 462 to 797, which is exactly where
   a thumb rests on an 844 screen. A person swiping up with a thumb on the
   wheel gets nothing.

4. **Zoom does not exist on a phone.** Zoom is bound to the `wheel` event and
   to the `f`, `+` and `-` keys in `ui/ui.js`. There is no pinch handler and
   no double tap. `DECISIONS.md` says zooming is how a person atomises. On a
   phone a person cannot atomise at all.

5. **Tapping the wheel throws you 1,978 pixels away from it.** Measured. The
   tap is correct: it opens Selection with the seat, the plexus, the held
   value and the coherent opposite. The return is not. The wheel is off
   screen, the top bar is off screen, and there is no back control.

6. **The one action that belongs on a phone is the last thing on the page.**
   `Run a release` sits at y 4,336 of a 4,401 page. That is 5.1 screens down,
   in the final 65 pixels of the document.

**Desktop verbs still in the copy, shown to a phone.**

    ui/ui.js:7        "Hover a bead to name it."
    ui/ui.js:32       "Click to select, shift-click to add."
    ui/ui.js:101      "Scroll on the wheel to move in, F to come back."
    ui/knowledge.js:95 "the same detail the wheel opens, on the right."

Shift click is the only way to multi select blueprint domains and archetypes.
There is no shift key on a phone, so multi select is unreachable. The tooltip
that explains it requires hover, so the instruction is unreachable by the same
device that cannot follow it.

**And the explanation itself is hover only.** Every control that explains what
it is does so through a `title` attribute: the four depth buttons at
`ui/panels.js:102`, the nineteen blueprint domains at `:137`, the four root
clusters at `:156`, the twelve archetypes at `:177`. Verified in the source. A
touch device has no hover, so on a phone this product explains none of its own
controls. Two of those titles end in `Shift-click to add`. This was found
independently in `DESIGN-mobile.md` and the panel reaches it from the other
side: it is why Angela says she does not know what any of the words mean.

**One more.** The tier word `Incoherent` is visible on the first scroll of
Field. `RESEARCH-icp.md` already recorded Angela closing the product on that
word and telling the group chat. On a phone it arrives 400 pixels sooner.

---

# Pass one. The layout as it stands

No proposal. The build at 390 x 844, exactly as measured above.

### Sofia, 41, somatic practitioner. RESIST.

**First five seconds.** "A settings screen. Brand, then a grid of eight
buttons, then a dropdown that says build your own, then three little icons.
I have not seen a body yet and I am looking at a body instrument. I scroll,
because I always scroll, but I am scrolling to find the product."

**Where the thumb goes.** "Bottom third. That is the wheel, and the wheel does
not move under my thumb. I pushed up three times and the page stayed still. I
thought it had frozen. Then I moved my thumb an inch left onto the margin and
it scrolled, so the dead patch is the picture."

**What she is doing on a phone specifically.** "Eleven at night, last client
gone, in bed. And, separately, in a session with a client's phone in my hand
showing them where their charge sits. Those are two different jobs and this
screen serves neither. In session I need one image and one sentence. At night
I need to run something."

**What she never finds.** "Run a release. I did not know it existed until I
scrolled to the bottom of a page five screens long and found it under a
collapsed section called 21 laws of integrity. I had already decided the
product did not do that."

**Where she gives up.** "Step two. The persona dropdown. I am a practitioner
and the third control on the screen invites me to pretend to be someone else.
I will not put a client in front of a screen that asks whose field this is
before it asks anything about them."

### Diane, 46, founder. REFUSE, step one.

**First five seconds.** "Eight tabs. I run a company and I do not have eight
tabs of attention for a thing I have not been sold on. I counted three rows of
buttons before a single piece of information. That is a menu, not a product."

**Where the thumb goes.** "Bottom right, and there is a coloured ring there
that does nothing when I press it except throw the page somewhere else."

**What she is doing on a phone specifically.** "Forty seconds between
meetings. I want a number and whether it moved. That is the whole errand. I am
not diagnosing and I am not practising. I am checking."

**What she never finds.** "Whether anything changed since yesterday. There is
no state, there is only a control panel."

**Where she gives up.** "The first screen. I never scrolled. I have taken four
quizzes in airport lounges and this opens like the settings page of one."

### Marcus, 44, creative director. REFUSE, step three.

**First five seconds.** "Three rows of pills. A dropdown. Three icon toggles.
An Aa button. Then a second bar of pills under it. Then a third strip of
chips that runs off the right edge and is cut mid word. I can see what is
wrong with anything in four seconds and I did not need four."

**Where the thumb goes.** "On the wheel, because it is the only thing on the
screen that looks like it was designed. And it is the one element that
refuses the gesture. You put the object of desire in the dead zone."

**What he is doing on a phone specifically.** "Deciding whether you are
serious. First contact is a phone. If the phone is a shrunk desktop I never
open the desktop and you have lost me at a screen you thought was secondary."

**What he never finds.** "The centre. There is no centre. There are five
strips of chrome and then a picture starting halfway down, with the seat
labels crossing the ring and a chip that reads 112 addresses sitting on top of
the crown label. Two things are fighting for the same pixels and nobody
looked."

**Where he gives up.** "The moment the key strip clipped. A row of numbers cut
off at the right edge with a hidden scrollbar tells me a desktop layout was
squeezed and nobody opened it on a phone. After that I am reading it as a
port, and I am not generous to ports."

### Angela, 36, seeker. CONFUSE.

**First five seconds.** "Pretty. Dark. I like the circle. I do not know what
any of the words mean. Charge, Cluster, Chain. Whose field. Aa. I scrolled
because I trusted it, and then I hit a word that said Incoherent and I did not
know if it was about me."

**Where the thumb goes.** "On the circle, and it opened something, and then the
screen leapt and I was somewhere else entirely and the circle was gone. I did
not know if I had broken it. I scrolled back up looking for the circle and it
took four swipes."

**What she is doing on a phone specifically.** "Everything. I do not have a
desktop in this. My phone is the product. Whatever you decided the phone is
for, it is the only thing I will ever see."

**What she never finds.** "How to go back. Every time I tapped something I
lost my place and there was no arrow."

**Where she gives up.** "The word Incoherent, same as last time, and it comes
sooner on a phone. It is on the first scroll."

### Derek, 39, endurance. RESIST.

**First five seconds.** "Dense. I am not put off by dense. I want to know
which of the eight buttons is the workout, and the answer appears to be none
of them."

**Where the thumb goes.** "Bottom of the screen where the nav should be. There
is a picture there instead, and it does not take input."

**What he is doing on a phone specifically.** "Mid session. Between sets, in a
car park, after a race. I want to run the release and I want it hands off,
because my hands are doing something else. The release runs a line every 2.2
seconds and that is the correct format for a phone. It is the only thing in
this product that was designed for a phone, and it is 5.1 screens down."

**What he never finds.** "Anything that tells me what the holding costs my
output. I found a wheel, a percentage and a word. No watts."

**Where he gives up.** "Not yet, I keep scrolling. But I scrolled 4,336 pixels
to find the release button and I only found it because I am the kind of
person who scrolls to the bottom. Nobody else will."

### James, 57, C-suite. REFUSE, step two.

**First five seconds.** "A demo. The dropdown says build your own and offers
me other people's names. That is a sales tool, not an instrument, and you put
it above my own data."

**Where the thumb goes.** "Nowhere. I read, I do not poke."

**What he is doing on a phone specifically.** "Reading the number. Once. In a
lift or in the back of a car. I will not practise on a phone in an office and
I will not answer 63 questions on one."

**What he never finds.** "The comparison, which I already know you refuse to
build, and the change since last time, which you have not refused, you have
just not built."

**Where he gives up.** "Step two. The persona select. If I can be Sofia with
one tap then the number on the screen is not mine, and I stop trusting the
screen before I have read it."

### Edge cases

**Ana, 47, in crisis. REFUSE, step three.** "I opened it at two in the
morning, which is when I open things. It gave me eight buttons and a word that
said Incoherent. I am already the thing it is calling me."

**Gordon, 58. REFUSE, step one.** Unchanged. He does not arrive.

**Rosa, 61. Not applicable.** She has no reason to open it on any device.

### Pass one tally

Six ICP reactions: 0 BUY, 0 HOLD, 1 CONFUSE, 2 RESIST, 3 REFUSE. With the edge
cases, 9 of 9 are negative.

**Simulated:** 11 percent of the panel reaches the wheel with intent. 4 percent
finds `Run a release`. 0 percent zooms, because zoom does not exist here.

**Abandonment.** Diane at the first screen. James at the persona select.
Marcus at the clipped key strip. Ana and Angela at the word Incoherent.

---

# Pass two. Collapse the chrome

The minimum intervention. Nothing is removed, everything is compressed.

**The proposal.**

- Release `html,body{height:100%}` at the mobile breakpoint so the document is
  the scroll container again and `window.scrollY` means something.
- Top bar becomes 56 tall and sticky. Brand, one overflow control, status.
- Tabs become one horizontal row that scrolls, with a fade at the right edge
  so the overflow is visible. Never a hidden scrollbar. Rule 10.
- Persona select, theme segment and Aa move into the overflow control. They
  are settings and a demo control and they are not content.
- Key strip wraps to two rows instead of clipping.
- Desktop verbs replaced. Hover becomes tap. Shift click gets a long press.
  `on the right` becomes `below`.

**What this buys, measured against pass one.** Chrome falls from 462 to about
128. The wheel moves from 462 to about 128, so it opens above the fold with
its full height visible. Everything else is identical. Control counts are
unchanged: Knowledge is still 196. Touch targets are unchanged. Zoom still
does not exist. `Run a release` is still at the bottom of the page.

### Sofia. HOLD.

**First five seconds.** "Now I see a body in the first second. That is the
whole difference and it is large." **Thumb.** "Still the wheel, still dead
under the thumb." **On a phone.** "Same two jobs and it now serves the first
one, showing a client the image. It still does not serve the second." **Never
finds.** "Run a release. Nothing changed there." **Gives up.** "I do not, but
I do not recommend it either. The condition is unchanged: I need the action,
not the picture."

### Diane. HOLD.

**First five seconds.** "I stayed. One row of tabs and a number I can read.
That bought you a scroll." **Thumb.** "Wheel. Dead." **On a phone.** "Still a
40 second check. It is now possible in 40 seconds to see the number. It is
still not possible to see whether it moved." **Never finds.** "Change over
time." **Gives up.** "Second visit. There is no reason for a second visit
because nothing on the screen is different from the first."

### Marcus. RESIST.

**First five seconds.** "You moved furniture. The room is the same room."
**Thumb.** "On a wheel that still eats the gesture. You compressed the chrome
and left the one bug that makes the object feel broken." **On a phone.** "Same
judgement, and you have now made it a closer call, which is worse than losing
it outright because I will give you a second look and find the same thing."
**Never finds.** "A reason this is a phone product. It is a desktop with the
margins cut." **Gives up.** "At the horizontal tab scroller. Eight things in a
row that slides is a filing cabinet. I have to read all eight to know which
one I want, and I have to slide to read them. You made it shorter, not
simpler."

### Angela. CONFUSE.

**First five seconds.** "The circle is there straight away and I like it more."
**Thumb.** "On the circle. It still jumps me somewhere with no way back."
**On a phone.** "Everything, still." **Never finds.** "Back." **Gives up.**
"Same place. I tap the circle, the screen leaps, and I am lost. Making the top
shorter did not fix being lost."

### Derek. RESIST.

**First five seconds.** "Faster to the thing. Fine." **Thumb.** "Bottom of the
screen, and there is still nothing operational there." **On a phone.** "Same
answer and you have not moved on it. The release is still at 4,336." **Never
finds.** "The workout." **Gives up.** "I do not leave. I just never use it in
the place I would have used it, which is the same as leaving with extra
steps."

### James. RESIST.

**First five seconds.** "Better. The demo control is behind a menu where it
belongs." **Thumb.** "Nowhere." **On a phone.** "Read the number." **Never
finds.** "The delta." **Gives up.** "I do not abandon, I disengage. There is
one number and it is the same number as last week, so there is no second
visit. You have fixed the entrance and not the reason to come back."

### Pass two tally

0 BUY, 3 HOLD, 1 CONFUSE, 3 RESIST, 0 REFUSE.

**Simulated:** first screen abandonment falls from 31 percent to 14 percent.
Return within seven days stays at 9 percent. **The finding is the gap.** Chrome
was an entry problem. Fixing it moves entry and moves nothing else, because
the reason to return was never the chrome.

**Abandonment.** Diane on the second visit. Derek in the place he would have
used it. Angela at the tap that loses her place. Marcus at the tab scroller.

---

# Pass three. A bottom bar and a thumb rail

Pass two proved the entry is not the problem. This pass moves the hand.

**The proposal.**

- A fixed bottom bar, 64 tall, five slots. Field, Story, Run, Knowledge, More.
  Intake, Energy, Analytics, Summary and Games live under More.
- `Run` is a primary slot, not a tab. It starts the release queue on the
  highest held seats, which is what `bRel` already does. The button moves from
  y 4,336 to the thumb.
- The wheel opens as the full first screen under a 56 top bar.
- Pinch to zoom and double tap to reframe on the canvas, replacing the scroll
  wheel and the `f` key.
- Tapping a segment raises a sheet from the bottom over the wheel, covering
  about 60 percent of the screen, instead of scrolling the page 1,978 pixels.
  The wheel stays visible above the sheet with the tapped segment lit.
- `touch-action` becomes `pan-y` outside the ring and `none` inside it, so a
  vertical swipe over the margin scrolls and a drag on a bead still sets
  charge.

### Sofia. HOLD.

**First five seconds.** "A body, and a bar at the bottom with a word that says
Run. That is a product." **Thumb.** "The bottom bar, and it has the action in
it. First time the thumb has landed on something that does work." **On a
phone.** "Both jobs now. In session I show the wheel and lift a sheet. At
night I press Run." **Never finds.** "Which of the five I am supposed to press
first. There is no order in a bar." **Gives up.** "Nowhere, and I still will
not recommend it. Knowledge is behind More and Knowledge is how I work. If the
thing I use most is in the overflow, the bar was designed for somebody else."

### Diane. BUY.

**First five seconds.** "Number, body, action. Three things. I can hold
three." **Thumb.** "Bottom bar. Correct." **On a phone.** "The 40 second
check, and now the 40 seconds can end in doing something rather than reading
something." **Never finds.** "Still the delta. Nobody has built it."
**Gives up.** "I do not. I would take this. The condition is still one line
telling me what moved."

### Marcus. RESIST.

**First five seconds.** "Better. It is a phone app now instead of a squeezed
desktop." **Thumb.** "Bottom bar. Fine." **On a phone.** "Judging you, and the
judgement has moved from no to not yet." **Never finds.** "The argument for
five. Why five slots. Five is what the pattern book says, it is not what this
product says. You have eight surfaces and you cut them to five by picking the
five that fit, and the join shows." **Gives up.** "At More. More is an
admission. It is the word a team uses when they could not decide, and I can
see the meeting. And I will say the harder thing: nesting the other three
inside a button does not reduce anything. Knowledge still has 196 controls. You
moved the pile, you did not shrink it."

### Angela. HOLD.

**First five seconds.** "I know where I am. The bar stays and the circle stays
and when I tap, a card comes up over it and the circle is still there behind."
**Thumb.** "The card and the bar. Both reachable." **On a phone.**
"Everything." **Never finds.** "Intake, which is under More, and Intake is the
quiz, and the quiz is the thing my friend told me to take." **Gives up.**
"Nowhere now. But I arrived to take a quiz and the quiz is in a drawer."

### Derek. BUY.

**First five seconds.** "Run is on the screen. Done." **Thumb.** "On Run."
**On a phone.** "Mid session. This is now the thing I said I wanted and it is
one tap." **Never finds.** "Still nothing about output." **Gives up.**
"Nowhere. And I will do the arithmetic you have not asked me for: Run on the
first screen means the release is the product and the wheel is the packaging.
You may not want that, but that is what the bar says."

### James. HOLD.

**First five seconds.** "Clean." **Thumb.** "Nowhere. I still read." **On a
phone.** "Read the number." **Never finds.** "Analytics, which is the only tab
I wanted, and it is under More next to a game." **Gives up.** "I do not leave
but I note that you have ranked a release ritual above the analysis, and for
me that is the wrong order. I accept that I am 100 of 1,000."

### Pass three tally

2 BUY, 3 HOLD, 0 CONFUSE, 1 RESIST, 0 REFUSE.

**Simulated:** 58 percent reach an action within three taps, against 4 percent
in pass one. Seven day return moves from 9 percent to 27 percent.

**The unresolved problem.** Three of six name the same defect from three
directions. Sofia loses Knowledge, Angela loses Intake, James loses Analytics,
and all three are behind More. The five slot bar does not fail because five is
wrong. It fails because there is no ranking that serves a practitioner, a
first time quiz taker and an executive at once. **Nesting relocated the
problem. It did not solve it.**

**Abandonment.** Nobody abandons. Sofia withholds the recommendation, which
costs more than an abandonment, because she is the entry point for clients.

---

# Pass four. Two modes. Read and Run

Pass three proved that ranking eight surfaces into five slots has no solution.
This pass stops ranking and starts cutting.

**The proposal.**

- No tabs on a phone. Two modes, a single toggle at the bottom. **Read** and
  **Run**.
- **Read** is the wheel, one state line, and a sheet. Nothing else.
- **Run** is the release queue and the ritual. A line every 2.2 seconds, large
  type, no other control but pause and stop.
- Intake, Knowledge, Analytics, Energy, Summary and Games are not on the
  phone. Each one, when reached by a link, shows one line naming why and what
  device it is on.

### Sofia. REFUSE, at the Knowledge line.

**First five seconds.** "Two words. I understand it instantly and I like it
for exactly four seconds." **Thumb.** "Either word. Both work." **On a
phone.** "It serves my night job perfectly and it has deleted my day job. In a
session I open Knowledge and read a client the seat and the axis. You have
told me that is on a device I do not bring to a session." **Never finds.**
"The 112 addresses." **Gives up.** "At the line that says Knowledge is not on
the phone. That is the sentence that ends it. I bring clients and you have
removed the surface I bring them to."

### Diane. BUY.

**First five seconds.** "Two words. Thank you." **Thumb.** "Read. Then Run."
**On a phone.** "The check, and the check now has exactly two possible
outcomes and I can hold both." **Never finds.** "The delta, still." **Gives
up.** "Nowhere. This is the first pass I would keep on a home screen."

### Marcus. BUY.

**First five seconds.** "Somebody made a decision. I can see the decision in
the layout, which is the only evidence I trust." **Thumb.** "Either mode."
**On a phone.** "Judging, and the judgement is yes. Two modes is a position.
Five slots was a compromise and I could see the compromise." **Never finds.**
"Nothing I want." **Gives up.** "Nowhere, and I will name the cost so you do
not enjoy this too much: you bought my approval with six deletions and five of
them belong to someone else."

### Angela. REFUSE, at the Intake line.

**First five seconds.** "Two buttons. Simple. Good." **Thumb.** "Read."
**On a phone.** "Everything, and there is no other device, so this is not a
mode choice for me, it is the whole product." **Never finds.** "The quiz."
**Gives up.** "At the line that tells me the quiz is on a computer. I came
from a group chat with a link and the link ends at a sentence telling me to
go and find a laptop. I will not. I am the person this was supposed to
catch."

### Derek. BUY.

**First five seconds.** "Run. That is the word." **Thumb.** "Run." **On a
phone.** "Mid session, hands free, one tap. This is correct." **Never finds.**
"Output, still. Four passes and nobody has put a cost on the holding."
**Gives up.** "Nowhere."

### James. RESIST.

**First five seconds.** "Two modes and neither of them is analysis." **Thumb.**
"Read, which is not reading, it is looking at a picture." **On a phone.**
"Read the number, and the number is now a picture with a percentage on it."
**Never finds.** "Analytics. You have removed it by name and given a reason,
which I respect and do not accept." **Gives up.** "I do not leave. I stop
being the customer. That is a quieter failure and you will not see it in a
funnel."

### Edge case

**Ana. HOLD.** "Two words and one of them is Run. At two in the morning that
is the right number of choices. I would press Run and I would not have to
decide anything else." This is the first pass Ana does not refuse, and she is
the panel member actually in crisis.

### Pass four tally

3 BUY, 1 HOLD, 0 CONFUSE, 1 RESIST, 2 REFUSE.

**Simulated:** 71 percent reach an action within two taps. Seven day return 34
percent. **And the funnel breaks.** Intake is the entry to the accounts
product and a large share of arrivals from a shared link are on a phone.
Removing Intake from the phone removes the funnel. Simulated activation falls
to 8 percent of arrivals, against 38 percent in pass three.

**Abandonment.** Sofia at the Knowledge line, which is the highest value loss
in the roster. Angela at the Intake line, which is the funnel. James silently.

---

# Pass five. One object, one action, one way back

Pass four proved that deleting surfaces buys approval from the people who were
never going to use them and loses the two who were. This pass keeps every
surface and changes what is on the surface.

**The proposal.**

**1. One object per screen.** The phone shows one thing at a time. The wheel,
or the story box, or the release line, or a search result. Never two.

**2. One action per screen.** A single primary control, fixed at the bottom
in the thumb arc, 56 tall, full width less a 16 gutter. Its label is a verb
and it changes with the state, and the state line above it says why.

| State | The line | The action |
|---|---|---|
| Nothing held | Nothing held. Write what happened. | Write |
| A story written, not applied | 3 seats loaded from what you wrote. | Read it |
| Seats held, nothing released | Heaviest seat: Fear, lumbar plexus, 6.2. | Run a release |
| Release finished | 4 patterns cleared. Field down 1.8. | Set a ritual |

This is the core loop and it is already in the engine. `parseStory`,
`compute`, `relPick`, `ritFor`. Nothing new is computed. What is new is that
one of them is always on the screen and the rest are not.

**3. One way back, always in the same place.** A fixed top bar, 52 tall, with
the object's name on the left and one back control on the right. It never
scrolls away. The 1,978 pixel jump is replaced by a sheet that covers the
lower 60 percent, with the wheel lit behind it. Swipe down or press back.

**4. Navigation is one control, not eight.** A single control in the top bar
opens a full screen list of the eight surfaces, each one a row 56 tall with
its name and one line of what it is for. Not a bar, not a drawer of pills, not
More. A list, read top to bottom, dismissed by the same control.

This is the one place the owner's nesting is accepted, and it is accepted as
one level. A list of eight rows with a sentence each is recognition. A bar of
five with three in an overflow is recall, and it failed in pass three.

**5. Intake is not an app screen.** It is its own full screen linear flow with
no chrome at all. One question, five options, a progress line, a back control.
Fifteen minutes stated at the top, the three way design named in one line,
resumable. This is what `RESEARCH-icp.md` already ruled and it is worth 29
points of completion on that panel. It is the funnel and it does not share a
layout with the instrument.

**6. Knowledge is a search field, not a list.** The field is the first and
only thing on the screen. 196 controls become 1 control and a result list that
does not exist until a person types. The eleven filter chips move under the
field and become 44 tall. `on the right` becomes `below`.

**7. The wheel becomes touchable.** Pinch to zoom, double tap to reframe, long
press to add to a selection, tap to open the sheet. `touch-action:pan-y`
outside the ring so a swipe over the margin scrolls. Every desktop verb in the
copy is replaced by the touch verb.

**8. The tier words at the low end go mechanical.** High resistance, high
load, high drag. This is already a director note in `RESEARCH-icp.md` and on a
phone it arrives 400 pixels sooner, so the phone is where it costs most.

### Sofia. HOLD.

**First five seconds.** "One image, one line under it, one button. I know what
it is and I know what to do. Five seconds is generous, it took two."
**Thumb.** "The button, and the button is a verb, and the verb changes when my
state changes. That is the first time this product has spoken to me rather
than presented to me." **On a phone.** "Both jobs, and this is the pass that
proves the previous framing was wrong. In session I open the wheel and lift a
sheet on one address and read the client the seat and the plexus. At night I
press Run a release. Same screen, different verb, because the state is
different. I did not have to learn two products." **Never finds.** "Who else
can see a client's record. That is not a layout problem and it is still the
only thing between you and my recommendation." **Gives up.** "Nowhere in the
layout. Still at the consent question, which is pass six and is not a design
problem."

### Diane. BUY.

**First five seconds.** "A number, a sentence and a verb. I read all three
before the lift doors opened." **Thumb.** "The verb." **On a phone.** "The
check, and the state line is the check. Heaviest seat, the value, and what to
do about it. That is the 40 seconds." **Never finds.** "What moved since
Tuesday. I have asked in five passes. The state line is one word away from
carrying it and it does not." **Gives up.** "Nowhere. I would pay. The
condition is a delta in the state line and it is the last thing I will ask
for."

### Marcus. HOLD.

**First five seconds.** "One object. Fixed top, fixed bottom, the object in
between. That is a phone app. I am no longer looking at a port." **Thumb.**
"The action. It is where a thumb is, it is 56 tall, and it is the only thing
of its colour on the screen. Correct." **On a phone.** "Judging, and the
judgement is yes with one note." **Never finds.** "Nothing missing. Here is
the note, and it is the one you will not like. You have called this clean and
it is not clean, it is ordered. Clean would be fewer things. This is the same
number of things with a hierarchy imposed on them, and hierarchy is the right
answer and clean was the wrong brief. Do not let anyone tell you the count
went down. The count did not go down. The count stopped being on the screen at
the same time." **Gives up.** "Nowhere. And I will hold at hold rather than
buy until I see the Intake flow, because that is the screen that decides
whether the ordering was a principle or a one screen trick."

### Angela. BUY.

**First five seconds.** "A circle and a sentence and a button. I understood
it. That has not happened before." **Thumb.** "The button." **On a phone.**
"Everything, and for the first time everything is here. The quiz is here. The
knowledge is here. Nothing told me to go and find a laptop." **Never finds.**
"Nothing, and that is new." **Gives up.** "Nowhere, if you have changed the
word. If the screen still says Incoherent I close it and tell the group chat,
and that has nothing to do with the layout and everything to do with what the
layout now puts in front of me faster."

### Derek. BUY.

**First five seconds.** "State, then verb. That is a training app structure
and I have used forty of them." **Thumb.** "The verb." **On a phone.** "Mid
session. One tap from cold to running." **Never finds.** "Output. Five passes.
The state line says Fear, lumbar plexus, 6.2 and it does not say what 6.2
costs me. You have built the exact slot for it and left it empty." **Gives
up.** "Nowhere. And the arithmetic from last time still stands and you still
have not ruled on it. If the ladder is a subscription with no end, a better
layout gets me there faster and then I do the division anyway."

### James. HOLD.

**First five seconds.** "One number, one sentence, one action. That is how a
board paper opens and I read it the same way." **Thumb.** "I still do not
poke. But the action being in one fixed place means I know where it is without
hunting, and that is worth something even to somebody who does not press it."
**On a phone.** "Read the number, and now the number comes with a cost
sentence and a next step, which is three quarters of a decision. I will do the
last quarter." **Never finds.** "Analytics is one tap behind a list instead of
one tap on a bar. That is fine. What I never find is the comparison, and I
have been told no, and I accept the no." **Gives up.** "Nowhere. I would use
this. I would not talk about it, and a panel that told you I would is lying to
you."

### Edge cases

**Ana. HOLD.** "One thing at a time. At two in the morning I can do one thing
at a time and I cannot do eight. And nothing on the screen called me a word."

**Gordon. REFUSE, step one.** Unchanged in all five passes. He does not
arrive and no layout reaches him.

**Rosa. Not applicable.** Correctly not the customer.

### Pass five tally

3 BUY, 3 HOLD, 0 CONFUSE, 0 RESIST, 0 REFUSE among the six ICPs. Every one of
them attaches a named condition and four of the six conditions are unbuilt.

**Simulated:** 79 percent reach an action within two taps. 41 percent return
within seven days. Activation from a shared link holds at 36 percent, because
Intake stayed on the phone.

**Abandonment.** No ICP abandons on layout. Every remaining abandonment in
this pass is content, not structure: the tier word, the consent question, the
missing cost line, the ladder arithmetic. That is the point of the exercise.
When the layout stops being the failure the real failures become visible.

---

## The claim under test. Desktop is diagnosis, phone is practice

`RESEARCH-icp.md` argued it. The panel was asked to test it rather than
inherit it. **It fails, and it fails in a specific way: it assumes two
devices.**

| Who | Verdict | What the phone actually is for them |
|---|---|---|
| Derek | Confirms | Practice. Mid session, hands free, the release queue |
| Sofia | Half | Practice at night. Diagnosis in session, on a client's phone, because she does not carry a desktop into a room |
| Diane | Rejects | Neither. A 40 second status check between meetings |
| James | Rejects | Neither. One read of one number, once |
| Marcus | Rejects the frame | First contact and the quality judgement. If the phone is degraded he never opens the desktop |
| Angela | Rejects the premise | She has one device. The phone is the entire product |
| Ana | Rejects the premise | One device, and she opens it at 2am, which is not a desktop hour |

**Two of six ICPs and one of three edge cases are phone only.** For them the
phone is not a mode of the product, it is the product. A design that treats
the phone as the practice half of a two device product deletes Angela, who
arrives from a group chat, and Ana, who is the person in crisis.

**The replacement claim, and it survives the panel.** The phone is where a
person is in a state, and the desktop is where a person has a session. State
wants one object and one action. A session wants many objects at once. That
distinction produces the same layout as pass five without assuming anybody
owns two devices.

---

## The flow the panel converges on

One screen. One object. One action. One way back.

    Top bar, 52, fixed          the object's name, one back, one nav control
    The object                  the wheel, or the box, or the release line
    State line                  what is true right now, in one sentence
    Primary action, 56, fixed   a verb that changes with the state

    Depth              a sheet over the lower 60 percent, wheel lit behind
    Navigation         one control, one full screen list of eight rows
    Intake             its own linear flow, no chrome, resumable
    Knowledge          one search field, results only after typing
    The wheel          pinch, double tap, long press, tap. No desktop verbs

The loop is `parseStory` to `compute` to `relPick` to `ritFor`, which is what
the engine already runs. The only change is that exactly one of those four is
on the screen at a time and the state line says which.

### What it costs

**Engine: nothing.** No new arithmetic. `compute` already returns everything
the state line needs. `bRel` already picks the seats. The TAB integers do not
move and `TABDEF` reorders freely, which the code already permits.

**Touch handling in `ui/ui.js`.** Pinch, double tap and long press are new
handlers. `touch-action` becomes conditional on the hit region. The `wheel`
listener and the `f`, `+` and `-` keys stay for desktop. This is the largest
single piece of work and it is contained in one file.

**A state machine that does not exist.** Which verb is on the button is a new
function. It is small and it is pure, so it belongs in the engine and it can
be tested headless.

**The scroll container.** One line. Release `height:100%` at the mobile
breakpoint. It changes scroll behaviour across the whole app, so it needs a
functional gate, not an eye.

**Intake as its own flow.** The largest layout cost. It is a second shell, and
`CLAUDE.md` says `source.html` stays one file, so it is a mode inside the same
file and not a second document.

**Knowledge rewritten as search.** The list logic exists. What changes is that
nothing renders until a person types.

**Copy.** Four desktop verb strings, the two tier words at the low end, and
one instance of `on the right`. Cheapest items on the list and two of them are
already director notes from the previous study.

**What is deferred and named.** Undo is still absent and a long press that
sets charge on a touch screen makes an irreversible write easier to trigger
than it was with a mouse. `CLAUDE.md` already calls undo the largest remaining
gap. **This pass makes that gap wider, and it should not ship without it.**

---

## What the panel rejects, including what the owner asked for

Agreement where there is none is worthless, so these are named plainly.

**1. Buttons and menus nested into buttons. Rejected as the primary move.**

The owner asked for nesting so it is clean. The panel accepts exactly one
level of nesting, the sheet and the navigation list, and rejects the rest.
Marcus is blunt: "Nesting the other three inside a button does not reduce
anything. Knowledge still has 196 controls. You moved the pile, you did not
shrink it." The UX skill agrees and ranks the moves: remove, hide, shrink,
organize, in that order. Nesting is hide. It is the second move and it was
being asked for before the first had been tried. Pass three is the measured
demonstration: nesting relocated the complaint from three ICPs and solved it
for none. Pass five removes first, which is why Knowledge goes from 196
controls to one search field, and only then nests.

**2. The centre image is centre to the main app. Rejected for the phone.**

The owner's target holds on desktop and the panel does not argue with it
there. On a phone four of six reject it. Diane wants a number, James wants a
number, Derek wants the verb, Sofia wants the verb at night. Only Marcus and
Angela come for the image, and Marcus comes for it as evidence of seriousness
rather than as a thing to use. The wheel keeps the largest area on the phone
because it is the object, and it loses the hierarchy to the state line and the
action. **The centre of the phone product is the verb, not the picture.** The
picture is what makes the verb believable.

**3. Clean, simple and sexy. Rejected as a brief, converted to a measure.**

Marcus: "You have called this clean and it is not clean, it is ordered. Clean
would be fewer things." The panel will not grade against an adjective. The
measures it accepts are: one object per screen, one primary action per screen,
one way back in a fixed place, every target at 44, and the first action within
two taps of cold open. Those are checkable. Sexy is not, and a panel scoring
against it would be telling the owner what he wants to hear.

**4. Eight tabs on a phone. Rejected in every pass, including as a scroller.**

Pass two kept eight and Marcus called it a filing cabinet. The tab bar is not
navigation on a phone at any width. It becomes a list.

**5. The persona select above the content. Rejected outright.**

It is a demo control and it is the third thing a person sees. James refuses at
it in pass one and the reason is not aesthetic: if he can be Sofia with one
tap then the number on the screen is not his. It goes behind the navigation
control and it is labelled as a demonstration.

**6. Deleting surfaces from the phone. Rejected, and it is the trap.**

Pass four scored best on every layout measure and broke the business. Marcus
and Diane approved it, and they approved it because the six deleted surfaces
were not theirs. Sofia and Angela refused it, and between them they are the
practitioner who brings clients and the person who arrives from a shared link.
**A phone layout that pleases the panel's loudest members by removing the
quiet members' surfaces is the worst outcome in this study, and it is the one
that is easiest to mistake for a win.**

---

## Abandonment map

Where each ICP stops, in each pass, at the exact step.

| Who | Pass 1 | Pass 2 | Pass 3 | Pass 4 | Pass 5 |
|---|---|---|---|---|---|
| Sofia | Step 2, the persona select | Holds, withholds the recommendation | Holds, withholds it: Knowledge is under More | **Refuses at the line saying Knowledge is desktop only** | Holds. Stops at consent, not layout |
| Diane | **Step 1, never scrolls** | **Second visit, nothing changed** | Buys, wants a delta | Buys | Buys, wants a delta |
| Marcus | **Step 3, the clipped key strip** | **The tab scroller** | **The word More** | Buys, and names the cost | Holds pending the Intake flow |
| Angela | **The word Incoherent, first scroll** | **The tap that loses her place** | Holds, the quiz is in a drawer | **Refuses at the line saying Intake is desktop only** | Buys, if the tier word changed |
| Derek | Scrolls 4,336 to find the release | **Never uses it where he would have** | Buys | Buys | Buys, still no cost line |
| James | **Step 2, the persona select** | Disengages, no delta | Holds, Analytics is under More | **Stops being the customer, silently** | Holds. Will not refer |
| Ana | **Step 3, Incoherent at 2am** | Same | Holds | Holds, first pass she does not refuse | Holds |
| Gordon | Step 1 | Step 1 | Step 1 | Step 1 | Step 1. Not reachable |
| Rosa | Not applicable in any pass, correctly | | | | |

**The two quiet abandonments.** James in pass four does not leave, he stops
being the customer. Sofia in passes two and three does not leave, she
withholds the recommendation. Neither shows in a funnel. Sofia is the highest
value entry in the roster because she brings clients, so her silence costs
more than any measured exit in this table.

**Reaction ledger across all five passes.** 30 ICP reactions plus 9 edge case
reactions. BUY 8, HOLD 13, CONFUSE 2, RESIST 7, REFUSE 9. Resistance,
confusion and refusal together are 18 of 39, 46 percent.

---

## Where this disagrees with `DESIGN-mobile.md`

The art direction pass on the same screen reached the same structural findings
independently: `touch-action:none` on the canvas, the drag that writes charge
irreversibly, the canvas labels drawn in absolute pixels, and the explanations
locked in hover only `title` attributes. It also reached the correct build
ruling, one build with two compositions and a single `body.phone` boolean, and
nothing here reopens that. The composition in section 5 of that document is
close to pass five and the two agree on almost everything.

They disagree in one place and it is worth naming rather than averaging.

**The four slot bottom bar.** `DESIGN-mobile.md` section 4 rules Field, Story,
Summary and More, with Energy, Analytics, Intake, Knowledge and Games in the
More sheet. That is pass three of this study with one fewer slot, and the panel
tested it. The result is not an aesthetic objection.

- Sofia works from Knowledge in session. In More, she holds and withholds the
  recommendation. She is the highest value entry in the roster.
- Angela arrives from a shared link to take the quiz. Intake in More is the
  quiz in a drawer.
- James came for Analytics. In More it sits next to a game.

Three of six ICPs lose their primary surface to the same sheet, and the sheet
is the owner's nesting request made structural, which is exactly why it is
attractive. **The panel's finding is that the number of slots is not the
variable.** There is no ranking of eight surfaces into four or five that serves
a practitioner, a first time quiz taker and an executive at once, because they
do not want the same first screen. Pass five stops ranking: navigation is one
control opening one full screen list of eight rows, all peers, each with a line
of what it is for, and the screen's hierarchy comes from the state line and the
primary action rather than from a bar.

**The second disagreement follows from it.** `DESIGN-mobile.md` keeps the wheel
as the hero on the first screen, which is the owner's stated target and is
correct on desktop. This panel puts the verb above the picture on a phone, four
to two. The wheel keeps the largest area. It loses the top of the hierarchy to
one sentence of state and one primary action.

**Where this study defers to that one.** The `body.phone` capability sniffer,
the one boolean cap, the deletion of the matrix and the three bulk sliders on a
phone, and the demotion of the 39 number fields to read only rows. Those are
engineering and art direction rulings, the panel has no standing to overturn
them, and the bulk slider deletion in particular is the same undo argument this
study reaches from the user's side.

---

## Director notes

**[PL] Build pass five. Do not build pass four.** Pass four scores higher on
every layout measure and removes the funnel and the highest value ICP. It is
the trap in this study.

**[TD] Release `html,body{height:100%}` at the mobile breakpoint.** The
document currently does not scroll, the body does, and `window.scrollY` is
always 0. Measured. Everything else in the layout sits on top of this.

**[TD] The wheel needs touch.** Pinch, double tap, long press, and
`touch-action` conditional on the hit region. Zoom is how a person atomises
per `DECISIONS.md` and on a phone it does not exist. The canvas currently sits
in the thumb zone with `touch-action:none` and eats the scroll gesture.

**[TD] Replace the 1,978 pixel jump with a sheet.** The tap is correct, the
return is not. The wheel and the top bar both leave the screen and there is no
back control.

**[AD] One object, one action, one way back.** Top bar 52 fixed, primary
action 56 fixed in the thumb arc, the object between them. Every target at 44.
The chips are at 27 today.

**[AD] Four copy strings ship desktop verbs to a phone.** Hover, shift click,
scroll and `F`, and `on the right`. Two of them describe interactions a phone
cannot perform at all.

**[PL] Move the persona select behind navigation and label it a
demonstration.** It costs James at step two and Sofia at step two, and they
are 240 of 1,000.

**[PL] The state line needs a cost and a delta.** Derek has asked for a cost
in five passes and Diane has asked for a delta in five passes. The slot is
built by this design and left empty. They are 350 of 1,000 between them and
they are the two most willing to pay.

**[Owner] The centre image target does not survive the phone.** It holds on
desktop. On a phone the panel puts the verb above the picture, four to two.
The picture keeps the area and loses the hierarchy.

**[Owner] Nesting is the second move, not the first.** One level of nesting is
accepted. Two is rejected by the panel and by the measured result in pass
three, where nesting relocated three complaints and resolved none.

**[Owner] Undo blocks this.** A long press that writes charge on a touch
screen makes an irreversible write easier to trigger than a mouse ever did.
`CLAUDE.md` already names undo as the largest remaining gap. This design
widens it and should not ship in front of it.
