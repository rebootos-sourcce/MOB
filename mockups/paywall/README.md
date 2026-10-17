# Paywall mockups

## p5, flat cards, second cut. The owner's pick, fixed (17 October 2026)

His words on p1: "It's a C minus. It's not maximizing the space. There's too
much text at the bottom ... 'a pattern is one line, said once.' I don't know
why that's there ... I think the icons under the price are great ... More
visual, more show, less tell. Icons, I can hover over the icons and get
information on what features I may be missing."

**Open `p5-flat-cards-v2.html`.** p1 to p4 are untouched and stay as the record.

What changed from p1, and which of us called it:

- **Petra, the space.** The sheet fills the screen. Three cards take its full
  height at 1600 by 1000 and at 390 by 844, with no scroll. On a desktop the six
  rings sit 3 by 2 at about 120 px each, in the same places on every card. That
  way the card's spare height goes to the hero, not to air.
- **Bjorn, the order.** The patterns number is each card's headline: "400",
  "800", "1,200" at 136 px. The price is the second level at 60 px, and the
  tier name is the third. Gone: the legend row, the "a pattern is one line"
  line, tier four's sentence and the two-line foot essay. The foot is one line,
  "Stop anytime, in two presses.", with Restore, Terms and Privacy beside it.
- **Sol, the colour.** A ring a tier opens is a solid disc of the accent. Its
  mark stays drawn in line on top, so the house rule "ring, not fill" still
  holds for the symbol. A ring a tier does not open is a grey outline. Solid
  against outline is a change of shape, so colour is never the only sign. One
  colour serves all three cards: tiers rank by how much is lit, never by hue.
  No glow, no gradient, Punch tokens.
- **Mika, the telling.** Every ring is a button. Hover (desktop), a tap
  (phone) or keyboard focus opens one short card:
  - the layer's name
  - one plain sentence
  - "Opens at tier two" (or "You see this now")

  The number does the same with the meaning of a pattern. The locked ring the
  person pressed to get here is marked with a bar under its column on every
  card, so the eye runs across to where it is lit. The card that opens it
  carries the one solid button.
- **Practitioner** is a slim strip under the three, on the darkest ground:
  "Practitioner, $99 a month, For people who lead others, Opens soon". Its own
  tooltip says it is everything tier three has plus tools to guide the people
  you lead. **Free** is a quiet "You are here" marker in the header, never a
  card. On tier one the marker moves onto tier one's card.

Every state from before is kept, with fewer words: the gift, paying closed,
paying open, signed out with the account step inside the panel, already on tier
one, payment failed, and the two-press stop screen.

### Words and presses against p1, read off the run (`shots/measure.json`)

| State | p1 words 1600 / 390 | p5 words 1600 / 390 |
|---|---|---|
| Paying open | 140 / 134 | 68 / 45 |
| Today, paying closed | 137 / 137 | 65 / 45 |
| Already on tier one | 143 / 139 | 66 / 41 |
| Payment failed | 150 / 144 | 77 / 46 |
| Signed out, account step | 96 / 96 | 45 / 42 |
| The gift | 54 / 54 | 12 / 12 |
| Stop screen | 37 / 37 | 22 / 22 |

How to read the press counts:

- **Things to press in view.** Paying open: p1 has 8; p5 has 29, of which 22
  only open a tooltip (18 rings, 3 numbers, Practitioner) and 7 act (3 Start,
  the X, Restore, Terms, Privacy). Paying closed: p1 has 5, p5 has 4 that act.
- **Presses, unchanged from p1.** Locked ring to paid is 3 signed in (the
  ring, Start, the payment page's confirm) and 4 signed out. Billing to paid is
  3. Stopping a plan is 2.
- **Tooltip words** are on demand and not in the counts above. A ring says 9
  words, the number 35, and Practitioner 27.

### Checks, all green on the final build

- **`src/shots.js p5`.** 30 pictures: every state at both widths, plus a
  locked ring hovered (1600) and tapped (390), the number opened by the
  keyboard alone, and the Practitioner tooltip. It fails on:
  - anything below the fold or clipped
  - text under 4.5 to 1, or a mark under 3 to 1, each against its own ground
  - a target under 44 by 44
  - an open tooltip off screen or under 4.5 to 1
  - **new:** anything hanging out of its own card. It was added because the
    failed state on a phone pushed the Start buttons over the card edges and
    the old gate did not see it. It was checked against that known bad case:
    6 elements caught; the fixed build, 0.
- **The lowest contrasts.**
  - Text: 6.54, the "You are here" chip.
  - Mark: 4.45, a grey locked ring on its card.
  - Tooltip text: 9.22.
- **`src/play.js`.** 20 p5 press checks, all pass:
  - the pre-marked ring is on all three cards
  - the door card has the one solid button
  - the tiers light 1, 2 and 6 rings
  - hover opens a tooltip and pointer-out closes it
  - focus opens it, Tab moves it, Esc closes it
  - a phone tap opens it, a second tap or a tap elsewhere closes it, and it
    stays on screen
  - a screen reader gets the meaning and the tier
  - paying closed has no paying press
  - Practitioner cannot be bought
  - stop in two presses
  - the account step stays inside the panel
  - the gift has no padlock and no price
- **`src/voice.py`.** 94 of 94 page lines pass. All 60 tooltip and label lines
  pass through `check.py --line` too.

### What is not true in the product yet

- **"Stop anytime, in two presses."** True on this mockup's stop screen. In
  the product today, stopping happens on Stripe's page. The two presses need
  the server route to stop a plan at the month's end, which is not built.
- **The refund line** is still a switch, off, for the same reasons as before
  (below).
- **The gift state.** The gift still locks the layers in code (`lockPlan` in
  `ui/lock.js`).
- **"Unique", checked against the code.** What is true:
  - The allowance counts `meter.unique`, the lines a person has never opened
    before. So 400 is 400 patterns new to that person each month.
  - Repeating ones already opened is free and unlimited (`relRerunPlan`), and
    it is the person's own choice, so the tooltip says "Repeat old ones free",
    never "they come back".
  - **Not true:** "new ones will be added". The pool is fixed: 112 addresses
    by 4 channels by 50 lines, 22,400 in all. Nothing in the code adds more.
    Spent in full, tier three opens the whole pool in about 19 months.
- **The name.** `atuned_src/engine/plan.js` still names the rung "Tier four"
  (PLANS, k four). p5 types "Practitioner" in one place (`src/p5.js`, PRAC).
  Its price, allowance and closed state still come from plan.js. Renaming it
  in plan.js is one word.
- **"Patterns a month" against the glossary.** The tooltip uses the
  glossary's meaning, "a reaction you keep having", not Emmy's "one line, said
  once". The release panel counts lines, so the product still needs one
  meaning.

## The four mockups, as first sent (the record)


Mika's seat (art), with Sol (colour and light), Bjorn (type and grid) and Petra
(composition and symbols). Made 17 October 2026 on the owner's words: "Our
paywall is too complicated and not visual. Let's reduce the text, bring
everything above the fold, make it more visual ... We want to make the flow as
frictionless as possible." And: "I like flat color. Instead of lit. But I'm open
to the design. I want my team to give me mock-up examples."

Built from main at `054ca583`. These are mockups. Nothing in `atuned_src/`
changed.

**Open any `.html` file in this folder in a browser.** Each is one file with no
dependencies and no network. The **Demo controls** button at the top right
switches:

- **State.** On the gift; today, with paying closed; paying open, signed in on
  free; signed out; already on tier one; payment failed; and the stop screen.
- **Came from.** Which locked ring the person pressed to get here, or Billing
  with nothing touched.
- **Refund line.** Off by default (see "What is not true yet").
- **View.** This window, or a phone frame at 390 by 844.

Every picture is in `shots/`: each version, every state, at 1600 by 1000 and at
390 by 844. That's 100 pictures.

| File | Direction | For |
|---|---|---|
| `p2-icon-grid.html` | **Icon grid then plans. The lead.** | Closest to his phone example. The six layers as ring marks, each with its word, its meaning and the tier that opens it. Then three plan cards, then one button whose words name the card. |
| `p1-three-flat-cards.html` | Three flat cards | Closest to his web example. Three cards with the price as the biggest thing, the marks for what each opens, and a button on each card. |
| `p3-figure-leads.html` | The figure leads | The person's own figure as the hero. The chain closes round it as four rings, and three segments sit under it. |
| `p4-one-plan.html` | One plan, one sentence | The shortest path. The layer you touched, what it is, and the one tier that opens it as one card with one button. |

## What all four share

- **Nothing about the ladder is typed by hand.** `src/build.js` reads
  `atuned_src/engine/plan.js` through the engine's own functions: `planPrice`,
  `planAdds`, `planBuyable` and `sightRows`. So the prices are the ruled $12,
  $29 and $59, the allowances are 400, 800 and 1,200 new patterns a month, and
  what each tier opens is SIGHT's own answer. The Kundalini row is not built,
  and the build refuses to put it on a page.
- **The marks are the product's own.** CHAINGLYPH from `ui/component.js` for
  saboteurs, complexes, hyper complexes and character; the registers mark from
  `ui/cone.js`; the masks mark from `ui/map.js`; the ring padlock from
  `ui/lock.js`. The figure in p3 is `engine/data/figure.js`, the outline the
  Body page draws. The typeface is the Inter embedded in `shell/head.html`.
- **Flat, not lit (Sol).** p1, p2 and p4 use the Punch lighting copied
  verbatim from `head.html`: no edges, no shadows, filled shapes. p3 uses Dark,
  drawn flat, so he sees the direction on both grounds. One new semantic
  colour, `--pick`, is Punch's own recipe for a filled control (it mixes 26
  percent of a seat into `--panel-2`), applied with the accent at 36 percent.
  36 is the strongest share that still holds `--ink` at better than 4.5 to 1;
  45 percent fell to 4.4. A card that is picked, or that opens what you
  touched, takes that one flat tone. It carries a ring check as well, so the
  colour is never the only sign. No glow, no gradient, no orange, no alarm
  colour anywhere.
- **Every symbol carries its meaning beside it** (the unpack ruling): the
  word, then one short line. Saboteurs: "Habits that run on your charge."
  Complexes: "Two saboteurs joined into one." Hyper complexes: "Complexes
  running together." Character: "What your whole chain builds into."
  Registers: "Each pattern's place on the compass." Masks: "The six ways you
  show up." "Pattern" is explained once, in Emmy's words: "A pattern is one
  line, said once, in a release."
- **The way out sits where the price is.** Every version's foot reads:
  "Charged monthly until you stop. Stopping runs to the month's end and deletes
  nothing." / "Your reading stays on every tier, free included." / Stop or
  change plan, Restore, Terms, Privacy. There's an exit (X) top left, and Esc
  does the same.
- **Today is drawn honestly.** With checkout closed, nothing can be pressed
  and then refuse. p1 and p3 read "Opens soon" on each card, and p2 and p4 read
  "Paying opens soon" where the button would be. That slot has no pill shape,
  because a pill says press.
- **Signed out, the account is made inside the panel**, after a tier is
  chosen: email, password, "Make account and pay", and "I have an account"
  for the other way round. It is never a trip to Settings.
- **No** best value or most popular badge, struck price, countdown, scarcity,
  guilt, trial, pass, Lifetime, annual price or price per pattern.

## The lead, and the two choices the alternates exist to show

Emmy decided the calls (the owner told the team the personas decide). **p2 is
all of them:**

1. One button, and its words name the card: "Start tier one, $12 a month".
2. The door picks the card: the cheapest tier that opens the thing touched,
   never higher. With nothing touched (from Billing), nothing is picked, and
   a plain line "Pick a tier" sits where a dead button would be.
3. Any picked card is the same flat colour, so colour never ranks a tier,
   with a ring check beside it.
4. Title "Open more of your reading."
5. The foot above.
6. Off the sheet: tier four, the Free row, "Your tier", "On every tier" and
   "A tier changes two things". The refund line is a switch, off.
7. The first foot line becomes true only once the server can stop a plan at
   the month's end. That stop is a server call that is not built yet, so this
   is the copy that will be true.
8. The gift: no padlocks, no price, no counting. One quiet line: "Your gift:
   100 patterns, no card. Everything is open."

The two tensions the UX architect asked to see, side by side:

| | One button that follows the picked card | A button on every card |
|---|---|---|
| **The door picks a card** | **p2 (lead)**, p4 | |
| **Nothing picked** | | p1, p3. In p1 the card that opens what you touched still takes the flat tone and says "Opens saboteurs", which is a fact about the door, not a choice made for you. |

## The numbers

Words and presses are counted by `src/shots.js` inside the sheet, with the
demo bar left out. "Presses" is everything a person could press on the
screen, the X and the foot links included. Every number below was read off the
run of the final build.

| | Today (Billing, the tier ladder) | p1 | p2 (lead) | p3 | p4 |
|---|---|---|---|---|---|
| Words, paying open, 1600 | 488 on Billing (UX architect's count) | 140 | 131 | 136 | 69 |
| Words, paying open, 390 | 145 in view at 390 (my count off the storyboard picture, below) | 134 | 131 | 118 | 69 |
| Things to press in view, 1600 / 390 | 35 / 9 (UX architect) | 8 / 8 | 9 / 9 | 8 / 8 | 7 / 7 |
| A paid price in view at 390 | No. The first one is at 982 px, below the 844 fold | Yes | Yes | Yes | Yes |
| Lowest point of the screen at 390 (fold 844) | Scrolls | 738 | 780 | 778 | 666 |
| Presses from a locked ring to paid, signed in | 4 plus a scroll (touch the lock, See tiers, Move to, Stripe's confirm) | 3 | 3 | 3 | 3 |
| The same, signed out | about 8 (sales director's estimate) | 4 | 4 | 4 | 4 |
| Presses from Billing to paid | 2 plus a scroll (Move to, Stripe), because the ladder is on Billing | 3 (See tiers, Start, Stripe) | 4 (See tiers, pick, Start, Stripe) | 3 | 4 |
| Presses to stop a plan, from Billing | 3 on Stripe's page, after 2 to reach Billing | 2 | 2 | 2 | 2 |

How today's 145 was counted: `a3-tiers-free-390.png` in the paywall
storyboard, which is what See tiers lands on, read word by word down to the
fold. That covers "The Tiers" through "Your tier", the 29-word locked list,
"On every tier", "A tier changes two things", the Free row, and the top of
tier one. It shows no paid price and no button to pay.

Locked to paid here is: touch the locked ring (1), which opens the sheet with
the right card already picked (p2, p4) or marked (p1, p3); then Start (2); then
confirm on Stripe's page (3). Signed out adds one: "Make account and pay",
after typing an email and a password. From Billing these designs cost one
press more than today, because Billing opens the sheet rather than holding the
ladder. p2 and p4 cost one more again, because nothing is picked when nothing
was touched (Emmy's call 2). That press is the price of never choosing for
somebody. Stopping is: Stop or change plan (1),
then Stop tier one (2). The stop screen says what stays (everything you
made), what ends and when, and what you're on after, all in plain words, with
one flat button.

## Contrast and the fold, measured

`src/shots.js` measures each element against its own ground: it walks up to
the first surface that paints, and mixes in any see-through layer first, not
the page. Text has to reach 4.5 to 1, and a mark that carries meaning 3 to 1.
The script fails on any element below the fold or clipped by the sheet, and
on any target under 44 by 44. All 100 pictures pass.

- Lowest text anywhere: **5.98**, which is `--ink` on the `--pick` card.
- Lowest mark: **5.98**, a ring mark on `--pick`.
- Three defects the gate caught, fixed on the way:
  - "Opens soon" in `--mid` on the toned card measured **3.24**. It now sets
    in `--ink`.
  - An empty status line kept its default margins and pushed the sheet past
    its own floor, by 7 px.
  - Every redraw added another click listener, so a toggle fired twice and
    undid itself. `src/play.js` caught that one; it presses the mockups the
    way a person would, 16 checks.

## The words

`src/voice.py` collects every line shown on any page during the run (76
unique lines) and runs each through `check.py --line` from `/home/user/MOB`.
**76 pass, 0 fail.** That includes "Open more of your reading.", "Start tier
one, $12 a month", "Pick a tier", "Paying opens soon", "Opens soon", "Opens
saboteurs", the six meanings, the foot lines, "Stop your plan.", "Tier one
runs until 14 November, then stops.", "The payment did not go through, so
nothing was charged.", the gift line, and the refund line. The gate cannot
judge meaning, and says so.

## Each direction: what it is for, what it costs, what it bends

The costs are my estimates in lines of UI code for the product build. Every
version shares a core of about 350 lines:

- the sheet over the app, reached from every lock and from the spent release
  panel
- the door's pick through `planNeed`
- the closed state read from the server's switch
- the account inside the panel
- the stop screen
- the gift state

The core also needs one server route that does not exist yet: stopping a plan
at the month's end without leaving for Stripe's page.

**p2, icon grid then plans. The lead.** For the person who decides by eye:
the six things a tier opens, and the picked card fills the ones it opens.
- *Cost:* small to medium, about 130 lines over the core.
- *Bends:* nothing ruled. Emmy's calls retire the line in `ui/plans.js` that
  says no tier is pre-selected. That line is a seat's code comment, not an
  owner ruling.

**p1, three flat cards.** For the person comparing three prices.
- *Cost:* small, about 120 lines over the core.
- *Bends:* it keeps tier four's line ("Tier four, $99 a month, adds tools for
  leading a group. Opens with the lead suite."), which Emmy cut from the lead.
  It is kept so he can see his own brief beside her call. It also has four
  buttons where his direction asked for one primary action.

**p3, the figure leads.** For his ruling that the avatar is the centre. The
chain is drawn the way the glossary builds it: saboteurs outermost, character
innermost, round the person.
- *Cost:* medium to large, about 260 lines over the core: the figure at sheet
  size, the rings, the preview, a separate phone legend.
- *Bends:* on a phone there is no pointer to preview with. The rings there
  only show what you see now and what you touched, so the segments carry the
  marks of what they open instead. Pointing at a segment fills its rings, and
  that is a preview, not a pick.

**p4, one plan, one sentence.** For the person who touched one thing and
wants exactly that.
- *Cost:* the smallest, about 110 lines over the core.
- *Bends Emmy's call 4:* the headline is the touched layer's name, not "Open
  more of your reading.", because here the thing touched is the whole message.
  Coming from Billing it falls back to her title, with the list open and
  nothing picked.

## What is not true yet

- **The first foot line.** "Stopping runs to the month's end" is true on
  Stripe's page today, but not by a press in the app. The in-app stop needs
  the server route above.
- **The refund line.** "Charged in the last seven days? Write to
  hello@atuned.world and we refund it in full." matches the draft `TERMS.md`,
  section on refunds. That draft is not served, `TERMS.md` itself marks the
  address "[CHECK: confirm hello@atuned.world receives mail]", and a lawyer
  has not ruled on the 14 day EU and UK right. So the line is a switch that
  is off.
- **The gift state.** In code, the gift still locks the layers today
  (`lockPlan` in `ui/lock.js`, as the sales director found). Building this
  state means changing that.
- **"A pattern is one line, said once, in a release."** These are Emmy's
  words. They match how the release panel counts. The storyboard's finding 8
  says Billing counts new ground, a different number, and the glossary's
  `pattern` reads "a reaction you keep having". The product needs one meaning
  before this line ships.
- **Restore** opens sign in. Emmy's foot leaves it out. His own direction
  names it, so it stays, with its meaning on hover and focus: "Already paying?
  Sign in to bring your plan here."

## Recommendation

**Build p2.** It is the only one of the four where the picture answers the
question before any word does: pick a card, and the things it opens fill.
- It holds all of Emmy's calls.
- It keeps the price the biggest number on each card.
- It fits on one phone screen in every state, with 131 words where the
  Billing page has 488.
- It takes 3 presses from a locked ring to paid.

p4 is the one to keep in the drawer: half the words again. It would make a
good first version if p2's grid proves heavy in testing.

**The one thing to change first:** send every locked ring to this sheet, with
the card already picked by `planNeed`, instead of to Billing. Do it even
before the visual design lands. That one route change takes the locked-to-paid
path from 4 presses and a scroll to 3, and puts a price in view on a phone
for the first time. It is the change the rest of this design sits on.

## Run it again

    node mockups/paywall/src/build.js
    flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
      PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/paywall/src/shots.js
    flock -o -w 3000 /tmp/atuned-browser.lock env NODE_PATH=/opt/node22/lib/node_modules \
      PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node mockups/paywall/src/play.js
    python3 mockups/paywall/src/voice.py

`shots.js` exits non-zero on anything below the fold, contrast under the
floor, a target under 44, a page error, or any request that leaves the file.
`shots/measure.json` holds every number above, per picture.
