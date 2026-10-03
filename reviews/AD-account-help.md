# Art Direction: The Account Area And The Help Area

Mika Ueda-Salas, art direction. Sol Amadi on colour and light, Bjorn
Haraldsson on type and grid, Petra Nikau on composition and symbol.

Visual direction only. No product code was written and no file outside this
one was edited.

---

## 1. What I Actually Looked At

Built at the current tree, then rendered and read. Commands run:

    ./atuned_src/BUILD.sh
    built ../source.html  1115873 bytes  div balance 0  no em dashes
    NODE_PATH=$(npm root -g) node tools/shots.js /tmp/ad   1600 1000
    NODE_PATH=$(npm root -g) node tools/shots.js /tmp/ad-p  390  844

`tools/shots.js` walks seven surfaces and none of them is Settings, because
Settings is integer 9 and is not in `TABDEF`. So the seven shots do not answer
the question I was asked. I wrote a second harness in the scratchpad that
opens `setTab(9)` with a loaded profile, removes the boot overlay, screenshots
Settings at 1600 and at 390, opens the help sheet, and measures geometry and
computed colour in the live document.

The first run of that harness wrote the boot sheet to disk and called it
Settings. The measurements underneath were real, the picture was not. That is
the fourth lying probe this session and it lied in the same direction as the
other three, so the numbers below are all read out of `getBoundingClientRect`
and `getComputedStyle` in the page, and the pictures were re-taken after the
overlay was removed by id.

Images read, not skimmed:

    /tmp/adset/1600-settings-loaded.png
    /tmp/adset/1600-help.png
    /tmp/adset/390-settings-loaded.png
    /tmp/ad/1600-summary.png
    /tmp/ad/1600-snow.png

### What Is On Screen Today

There are two surfaces in the product that the owner's brief is about, and
between them they are about eight percent of what he asked for.

**Settings**, integer 9, host `#settings`, rendered by `renderSettings()` at
`/home/user/MOB/atuned_src/ui/panels.js:468`. It is five cards in a
`repeat(auto-fit,minmax(278px,1fr))` grid inside a 1040px wrapper: This
reading, Your plan, Screen, Lighting, Your record, Who you are becoming. It
holds no account, no security, no privacy, no support, no rating and no
feedback. Billing is one paragraph and two buttons.

**Help**, `#helpbtn`, which opens the sheet at
`/home/user/MOB/atuned_src/ui/panels.js:654`. It is one 390px card in the
upper right over a dimmed page, titled "How To Read This", carrying four
prose sections and a Close button. There is no support, no contact, no
rating, no questionnaire. Help in this product currently means a legend.

---

## 2. The Information Architecture I Am Designing Against

`reviews/IA-account-help-feedback.md` did not exist when I started. I checked
`/home/user/MOB/reviews/` and it was not there, so I built the visual system
against stated assumptions. It landed at 1,624 lines while I was measuring, and
I have rewritten this section and section 5.2 against the real tree rather than
leaving my guesses standing. Everything below designs against the architect's
structure. Where I had assumed something different, the architect wins, because
structure is theirs and form is mine.

**The tree, from that document, section 4.** One surface, six sections, one
open at a time:

    1  Account            who this account is
    2  Display            lighting, screen, quiet
    3  Security           how this account is protected
    4  Privacy            what is held, who can see it, and getting it out
    5  Billing and tier   the plan, the allowance, the seam
    6  Help               support, feedback, rating, the questionnaire, terms

Help is a section of the account surface and not a second destination. That is
better than what I assumed and I am dropping my version. A person who cannot
find the support row is not helped by support living somewhere else.

**Two places we converged independently, which is worth recording because
neither of us saw the other's working.**

The architect's rail ruling is `body.tab-settings .mid .col{display:none}`,
argued from a count: 98 simultaneous choices down to 27, of which 15 are the
top bar. I reached the same rule from geometry: 4,267 of 6,167 scrollable
pixels on the phone account page are rail, which is 69 percent. Same rule, two
measurements, no shared method. That is the strongest evidence in either
document and it should land first.

The architect's stub ruling is that every Security row renders as a stub
because "a person is entitled to see that the answer is nothing protects this
yet rather than to find an empty panel". I reached the same conclusion from the
opposite end, by measuring that the only saturated fill on the settings surface
today is an upgrade button that fails on press. Section 6.5 is the drawing of
their rule.

**Where I defer on wording.** The architect calls section 2 **Display**. I had
written Appearance, which is the convention the precedent uses. One word per
concept, and theirs is in the tree, so it is Display everywhere in this
document and Appearance appears nowhere.

**Where I need a ruling from them, and it is one thing.** The architect
specifies "a section index and an open panel at 1600, a stacked list of
sections at 390, out of the same markup". Section 5.2 draws that. What is not
stated is whether the index stays visible beside the open panel at 1600 or is
replaced by it. I have drawn it as staying visible, because a settings index
that disappears when you open a section costs a person their place, and because
that is what every product in section 4 does. If they meant replaced, the only
change is one grid declaration.

## 3. What The Current Surface Gets Wrong. Six Defects, Measured

### 3.1 The eye lands on the instrument, not on the settings. Petra.

Squint test, six feet, eyes half closed, at
`/tmp/adset/1600-settings-loaded.png`. First landing is the left rail's grid
of twenty-four seat coloured ring icons at roughly x 30 to 290, y 440 to 890.
Second is the right rail's stack of accent pills and the name plate. Third,
and only third, is the centre column, which is five panels at `--panel`
`#1A1D26` on a `--bg` of `#0C0D12`, a 1.27 to 1 value step, with no colour in
them at all.

A person on the settings page looks at their own reading before they look at
their own settings. The centre column is 920px of a 1600px viewport and it is
the quietest thing in the frame.

**Measured, at 390:** `document.body.scrollHeight` is 6427. The settings host
is 1868 of it, from y 253 to y 2121. Below that the left rail column starts at
y 2142 with height 1764, and the right rail column at y 3916 with height 2503.
So on a phone, 4267 of 6167 scrollable pixels below the header are the
instrument, and 69 percent of the account page is not the account page.

**The move.** The account surface suppresses both rails, per section 5.1 and
per the architect's own rule reached independently. The centre becomes the
whole width and the section index sits inside it. This is the one place in the
product where the instrument is not the subject, and the frame should say so
before a word is read.

### 3.2 A three column grid with 497 pixels of dead space. Bjorn.

Measured at 1600, loaded profile, from `getBoundingClientRect`:

    This reading         x 341  y 215  w 285  h 278   bottom 493
    Your plan            x 640  y 215  w 285  h 522   bottom 737
    Screen               x 940  y 215  w 285  h 297   bottom 512
    Lighting             x 341  y 751
    Your record          x 640  y 751
    Who you are becoming x 940  y 751

`align-items:start` stops the cards stretching but does nothing to the implicit
row height, which the tallest card sets. Column one carries a 258px void, column
three a 239px void. 497 pixels of nothing on one screen, in the middle of the
frame, with content sitting above and below it.

The eye reads that gap as a section break that is not there, so Lighting and
Who you are becoming read as a second, lower group. They are not a group. The
grid is telling the person something false about the structure.

**The move.** Kill the card grid. A settings area is a list, not a dashboard.
One column of rows under one heading at a time, which is what every product
named in section 4 does, and which has no masonry problem because there is no
masonry.

### 3.3 Zero icons on a surface with five names. Petra.

Measured: `#settings` contains 0 `<svg>` elements. The surface carries six
named sections and twelve buttons and not one symbol.

The house rule is that if it has a name it has an icon, the icon has a family,
the family has a colour. Settings is the single largest violation of that rule
in the product, and it is the surface a person navigates rather than reads,
which is exactly where recognition beats recall.

### 3.4 The only saturated fill on the page is an upsell that does not work.

Measured, all twelve buttons in `#settings` at 1600:

    Move to tier one   144 x 44   rgb(126,184,212)   <- --accent
    Dark                56 x 46   rgb(126,184,212)   <- --accent
    Manage billing     132 x 44   rgb(37,40,51)      <- --panel-2
    Open the avatar    142 x 44   rgb(37,40,51)
    Tight/Comfortable/Wide  245 x 49 each  rgb(9,10,14)
    Snow, Punch, Glass, Glass white, Flat   transparent

Two of twelve carry a saturated fill. One of them is the lighting chip the
person already chose, which is correct. The other is the upgrade button, at
6336 square pixels of `--accent`, which is 2.5 times the area of the only
other coloured thing on the page.

So the brightest object on the account page is a sales control. Sol measured
the ink on it at 8.60 to 1, `--on-accent` `#0B1418` on `--accent` `#7EB8D4`,
which is the strongest local contrast anywhere in the centre column.

**And it does not work.** `planOpen()` at
`/home/user/MOB/atuned_src/ui/panels.js:636` checks `PLAN_HOST` and, when
nothing is bound, calls `status(..., 'fail')`. So the loudest control on the
surface is styled exactly like every live primary button in the product and
only admits it is not built after a person presses it.

That is the stub problem the brief asks me to solve, and it is already
shipping. It does not lie about success, which is rule 3, but it lies about
availability, which is the same lie one step earlier. Section 6.5 is the fix.

### 3.5 The plan card is a wall of prose where a person came to check a fact.

"Your plan" is 522px tall. Its rows are four lines. Its prose is five
paragraphs, the longest running ten lines at `--mid` `#B4B0A8`, 13px. A
person opens billing to answer one of three questions: what am I on, what does
it cost, how do I stop. None of those three is answered in the first 200
pixels.

**The move.** Three rows and two controls at the top, in the row grammar of
section 6. The explanation drops to a footnote under the group, at `--dim`,
12.5px, which is the pattern in section 6.7 and is what a grouped list footer
is for.

### 3.6 Thirty eight pixels of the surface are below a hidden fold. Bjorn.

Measured at 1600: `#settings.scrollHeight` 941, `clientHeight` 903, `overflow`
auto, parent `.glass.stage` overflow hidden. The bottom of "Who you are
becoming" is cut. In the capture the lowest card is visibly truncated. Rule 10
says never hide a control with no affordance, and the scrollbar is the thin
9px seat coloured one, which on a 38px overflow renders a thumb almost the
full height of the track and reads as no scrollbar at all.

---

## 4. The Precedent. What I Looked At, By Name

The owner said "very standard" and meant it. My job here is not to invent an
account page. It is to build a conventional one that still looks like this
product. I read the following and took structure from them, not styling.

**Apple Human Interface Guidelines, Lists and tables, and Toggles.** The
grouped and inset grouped list is the settings row grammar almost every person
on earth already knows: rows in labelled groups, a header above and a footer
below, the footer carrying the explanation rather than the row. The toggle
guidance is the one I lean on hardest: use a switch only in a list row, and do
not give it its own label, because the row is the label. That single rule
removes a whole class of duplicated copy.
<https://developer.apple.com/design/human-interface-guidelines/lists-and-tables>
<https://developer.apple.com/design/human-interface-guidelines/toggles>
<https://developer.apple.com/design/human-interface-guidelines/disclosure-controls>

**Linear, Notion and Superhuman**, via the two pane settings write ups. All
three use the same shape: a fixed left sidebar of roughly 240px carrying icon
plus label items, a content pane on the right, the active item marked, the
sidebar collapsing on mobile, and a route per section. That is the layout I am
specifying, at this product's own measurements.
<https://github.com/canatac/misfits-web/issues/689>
<https://github.com/canatac/misfits-web/issues/434>

**The standard section set**, taken from the settings pattern surveys rather
than from one product, because the point is the convention and not any single
example. General, Appearance, Security, Notifications, Privacy, Billing. The
same six keep appearing under slightly different names. The surveys also give
the three behaviours that matter more than the names: group by the task people
came to do, confirm destructive actions, and keep sensitive operations behind
re-authentication.
<https://uxpatterns.dev/patterns/authentication/account-settings>
<https://www.eleken.co/blog-posts/settings-page-ui>
<https://nicelydone.club/pages/account-settings>
<https://bricxlabs.com/blogs/account-settings-design-examples>

**Health and wellness products with a subscription**, for where account lives
in a somatic product specifically. WHOOP puts it behind More, then My Account,
with a separate App Settings for display. Oura puts data sharing under
Settings, then App Integrations, with per-integration revocation. Headspace
puts device connections under Profile, then Settings, then Connected Devices.
All three separate "what the instrument shows me" from "who can see my data",
which is exactly the separation this product needs and does not have.
<https://support.whoop.com/s/article/Navigating-the-WHOOP-Mobile-App>
<https://support.ouraring.com/hc/en-us/articles/10705471244947-Partner-Integrations>
<https://www.headspace.com/integrations/apple>

**The FTC negative option rule, finalised October 2024.** Cancellation must be
as easy as sign up, in the same medium, in the same number of steps, with no
requirement to speak to anybody a person did not have to speak to on the way
in. This is not a design opinion, it is the floor, and it is why section 7 is
written as a refusal list rather than as a preference.
<https://www.ftc.gov/news-events/news/press-releases/2024/10/federal-trade-commission-announces-final-click-cancel-rule-making-it-easier-consumers-end-recurring>
<https://www.ftc.gov/business-guidance/blog/2024/10/click-cancel-ftcs-amended-negative-option-rule-what-it-means-your-business>

**Self service export and erasure.** The standing pattern is: offer the export
before the deletion, state plainly what is and is not recoverable, require an
explicit confirmation, and report partial completion rather than claiming a
clean finish. That maps one to one onto this product's own rule 3 and onto the
ruling that a record off device means a controller exists.
<https://learn.microsoft.com/en-us/compliance/regulatory/gdpr-data-subject-requests>

What I did not take from any of them: the styling. Every one of those settings
pages is a white card on a grey page with a blue link. This product is a
muted, low saturation instrument in four lightings, and section 6 is the
convention rendered in that language.

---

## 5. The Frame

### 5.1 The Account Surface Suppresses The Instrument

The architect's rule, and mine, reached separately. Their count: 98 choices to
27. My geometry: 69 percent of the phone scroll below the header is rail.

    .mid                          grid-template-columns:302px 1fr 336px
    body.tab-settings .mid .col   display:none
    body.tab-settings .mid        grid-template-columns:1fr

This is the only surface in the product where the rails go. On every other
surface the subject is the field. Here the subject is the person's
arrangements with us, and the instrument standing beside it is noise.

The top bar keeps the wordmark, the lighting menu, help and the person. The
profile picker moves into the Account section, which `DESIGN-ia.md` 4.1 and
the architect both already argue for. The undo and redo pair goes, because
undo on a settings surface is a promise the settings surface does not keep,
and the architect's section 10 is where the arrows are being decided anyway.

### 5.2 The Index And The Open Panel

The architect specifies a section index plus an open panel at 1600, a stacked
list at 390, one section open at a time, out of one markup. Drawn:

    desktop, >= 980px
      section index   228px fixed, left edge of the centre stage, stays
                      visible, active item marked
      gutter          --g3, 16px
      open panel      1fr, max-width 640px
      page gutter     --g3 each side

    phone, < 980px
      the index is the page. Pressing a section expands it in place, one open
      at a time, the header stays in position and the rows push down beneath
      it. No push to a second screen and no back control, because the
      architect asked for one document order and an accordion is that order
      with everything but one section collapsed.
      side gutter     16px, no horizontal page scroll

228 rather than the 240 the precedent uses, because the product's left rail is
302 and a settings index nearly as wide as the instrument rail reads as the
instrument rail. 228 is visibly narrower and still holds "Billing and tier"
plus a 17px icon plus the gap on one line at 14px Inter.

640px on the open panel is Bjorn's number and it is not round. At 14px Inter
with `--ui:1`, 640 minus 19px of padding each side is roughly 78 characters at
body size, which is above his ceiling for prose, so every group footer caps at
`max-width:68ch` the way `.kb-p` and `.s-ptoward` already do. Rows take the
full 640, because a row is label left and value right and a wide row is easier
to scan rather than harder.

**The accordion has one rule and it is the one everybody breaks.** Opening a
section scrolls its header to the top of the stage and holds it there. The
product has already been bitten by this: the comment at head.html on
`.panel.sc` records the browser picking its own anchor and moving scrollTop
from 0 to 355 when a rail accordion opened. The same handler that pins a rail
header pins this one.

### 5.3 The Page Header

One pattern for the surface, reusing what exists:

    eyebrow     .pm-eye        11px, 600, capitalize, --dim
    title       .kb-h          22px, 500, -.01em, --ink
    footnote    .kb-p          13.5px, 1.65, --mid, max-width 68ch

The account title is the person's own name and takes `.kb-h.plain`, because
`.pm-eye, .kb-h` are in the `text-transform:capitalize` rule at head.html:793
and a transform that renders somebody as De Vries is wrong about them. That
exemption is already ruled and `renderSettings()` already gets it right at
line 475. Keep it.

The help title is "Help" and takes Title Case, which is the ruling.

### 5.4 The Grid, And Where It Breaks

Twelve columns is a fiction at 640px. The real grid here is the row: a single
column, rows stacked, the value column right aligned at a common optical edge,
and one vertical rhythm of `--g2` between rows within a group and `--g3`
between groups.

The grid breaks exactly once, in the whole account area, and it is the tier
ladder in section 7.3. That is the one place a person is comparing four things
side by side rather than reading one thing at a time, and a list cannot do a
comparison. A grid broken twice is not a grid, so nothing else breaks it.

---

## 6. The Row Grammar

Six row types. Every row in all six sections is one of these six. A seventh
would mean the IA has a concept the visual system has not been told about, and
that is a conversation, not a new component.

Shared skeleton, and the numbers are the floors:

    height          56px minimum. --tap is 44 and 44 is the floor for a
                    finger, not a target for a full width list row. 56 gives
                    the row 6px of breathing above and below a 44px control.
                    Today's .sh-row measures 35 and 36. It is not tappable
                    and it is about to become tappable.
    padding         13px 16px
    separator       1px solid var(--edge), between rows, none on the last
    group container border 1px solid var(--edge), radius var(--r-s), 11px,
                    background var(--panel)
    left slot       17px icon, then --g1 6px, then the label
    right slot      the value, or the control, or the chevron
    focus           the existing button:focus-visible rule, 2px --gold,
                    offset 2px. It already exists and it already works.

### 6.1 The Value Row

Reads a fact. Not interactive. Label left at `--mid` 13px, value right at
`--ink` 13px weight 500. This is today's `.sh-row` with the height raised from
36 to 56 and an icon added.

    Email                         you@example.com
    Member since                  March 2026

A value row never gets a chevron, because a chevron is a promise of a next
screen.

### 6.2 The Toggle Row

Label left, switch right. Per the Apple guidance, the switch carries no label
of its own, because the row is its label. The explanation, if it needs one,
goes in the group footer and not under the row, which keeps every row in the
group the same height and keeps the left edge of the labels a straight line.

    on      track var(--accent), knob var(--on-accent)
    off     track var(--panel-2), knob var(--mid)
    size    44 x 26 track, 20 knob, inside the 56px row
    motion  transform 120ms var(--ease-out), which is --t-micro

A toggle writes immediately and reports through `status()`. No save button
anywhere in this area. A settings page with a save button makes a person
responsible for a write they have already decided on.

### 6.3 The Navigating Row

Label left, current value right in `--dim`, then a chevron. The chevron is the
existing `.chev` glyph from the lighting menu, 12px, `--dim`, and it is the
only thing in the row that is allowed to be a promise.

    Lighting                 Dark        >
    Who can see my data      nobody      >

### 6.4 The Destructive Row

Label in the destructive colour, left aligned, no value, no chevron. It sits
alone in its own group at the bottom of its section, under its own header, and
the header says what the group is rather than shouting.

    header     "Ending Your Account", Title Case, --dim, 11px
    label      --bad
    footer     what happens, what is kept, what is not recoverable
    confirm    a second row appears in place, not a modal, carrying the
               typed confirmation and a cancel that is the same size

**Colour, and this is a real defect I found while specifying it.** `--bad` in
Dark is `#CB5F59` and measures **4.26 to 1** on `--panel` `#1A1D26`. That
fails AA for 13px text, which needs 4.5. It measures 4.01 on Punch's
`--panel-2`. `--bad` in Snow is `#A8413C` and measures 5.62 on `#F8F7F3`,
which passes, so the defect is the dark value only.

**The move:** `--bad` in the Dark root moves from `#CB5F59` to `#D4736D`,
which measures 5.19 on `--panel` and 4.87 on Punch's `--panel-2`. One value,
one line, at head.html:108. Snow's `--bad` does not move. `--bad` is currently
read in exactly one place, `.sum-dg` at head.html:2111, as a 3px border, so
the change is safe to make.

**And `--alarm` is not the destructive colour.** `--alarm` `#FF2E1F` is
reserved for something being wrong. Deleting your account on purpose is not
something being wrong, it is a decision. Using the alarm colour on a
deliberate control is the same class of defect as painting a good high reading
in the alarm colour, which this product has shipped twice. `--bad` is the
destructive token. Sol found this and it is the finding I would most expect to
be argued with about.

### 6.5 The Stub Row. "Not Built Yet", Never "Broken"

This is the hardest of the six and the one the brief names directly. A row
that cannot work yet has to read as an announcement rather than as a failure,
and it has to do it without a badge, because a badge is a fourth thing.

Three signals together, and no others:

    1. The row renders at full opacity. Dimming the whole row is the single
       most common way products say "not built" and it is the wrong one:
       dim reads as disabled, and disabled reads as "you cannot", not as
       "not yet". Label stays --mid. Icon stays at its family colour.
    2. The right slot carries the words "not built yet" at --dim, 12.5px,
       in place of a value and in place of a chevron. This is the whole
       signal and it is a sentence, not a state.
    3. The row does not take a press. aria-disabled="true", no pointer
       cursor, no hover background, no focus ring. A control that cannot
       act does not accept a hand.

And the group footer, once per group and not once per row, carries the reason
in one sentence: "These arrive when sign in does."

    Password                         not built yet
    Two-step verification            not built yet
    Active sessions                  not built yet
    These arrive when sign in does.

**What this replaces.** Today's stub is a filled accent primary button that
takes a press and then says no. Under this rule, "Move to tier one" and
"Manage billing" render as stub rows with "not built yet" in the right slot
until `PLAN_HOST` is bound, and the accent fill comes back the moment it is.
The `status()` fail path stays as the belt and braces, because a bound host
can still throw, and that message is correct for a real failure. It is wrong
as the primary way a person learns what exists.

Bjorn's argument against the dim, for the record, is that a 12.5px `--dim`
right slot is the same treatment as a `--dim` current value in a navigating
row, so the two rows read as the same kind of thing. That is the point. The
stub row is a navigating row whose destination has not been built. It should
look like one.

### 6.6 The Action Row

A row whose right slot is a button rather than a value. Used sparingly: export
my data, open the billing portal, send the feedback. The button is `.btn` at
44 minimum, and it is `.btn.pri` only when it is the one thing the person came
to this group to do. On the billing group that is not the upgrade.

### 6.7 The Group Footer

Below the group container, not inside it. 12.5px, `--dim`, line-height 1.6,
`max-width:68ch`, `--g1` of space above. This is where every explanation in
the account area lives, and it is the component that fixes defect 3.5: the
five paragraphs currently inside the plan card become one footer under the
plan group.

`--dim` `#94908A` measures 5.30 on `--panel` in Dark and 6.04 on Snow, so the
footer clears AA in both. That was not true before the `--dim` fix recorded at
head.html:64 and it is the reason the footer can carry real text at all.

---

## 7. Billing And Tier. What I Will Not Do

The owner asked me to say this explicitly and I am glad of it, because this is
where products of this kind become dishonest, and this one is built on a
promise about not selling people.

### 7.1 The Refusals

**No fake scarcity.** No countdown on an offer. No "3 spots left". No "price
goes up in". No badge that says a tier is popular when nothing measured it.
Every one of those is a claim, and the evidence tier does not carry it.

**No dark pattern on downgrade or cancel.** Cancel is a row in the billing
group, in the same list, at the same height, in the same type as every other
row. It is not behind an accordion, not at the bottom of a footer, not a
different size from the button that started the subscription. No confirm-shame
copy: the cancel confirmation says what happens and offers "Cancel the
subscription" and "Keep it", both `.btn`, both 44 tall, both the same width to
the pixel. Neither is `.btn.pri`. The FTC rule says the exit must be as easy
as the entrance in the same medium and the same number of steps, and this is
what that looks like drawn.

**No interstitial between a person and their own reading.** Not on launch, not
on tab change, not when an allowance runs low, not when a period rolls. If
there is something to say about the plan it is said on the plan surface. The
reading is the person's own and the product does not stand in front of it to
sell them something. This is the one I will escalate over.

**No upsell as the loudest object.** Measured today at 6336 square pixels of
`--accent`, 2.5 times the next coloured thing on the surface. Under this
system the upgrade control is a `.btn` in an action row, and `.btn.pri` is
spent on the thing the person came for. On the billing group in the normal
case, that is nothing, and no button is primary.

**No count against a total, anywhere in the meter.** Not "400 of 1200 used".
Not a progress bar filling toward a cap. That is the standing ruling and
billing is where it gets broken, because every subscription product in the
world prints it. The allowance says what is left and what it is worth, the way
`planAllowance` already does with "100 of the gift left".

**No red on the allowance.** A low allowance is not something being wrong. It
is a number. `--alarm` stays reserved and the allowance is rendered in `--ink`
at every value including zero.

**No pre-ticked anything, and no silent default on a grant of sight.** A
practitioner being given sight of somatic and psychological self report is a
consequential grant. It is a toggle that starts off, a visible list of who has
sight, and a revocation row per person. That is already ruled in CLAUDE.md and
it is a visual commitment as much as a policy one: the list has to be
visible on the privacy section without a press, because a consent you have to
go looking for is not one you are aware of.

### 7.2 What Billing Actually Renders

Stripe never appears in the app, ruled, so the billing section is four value
rows, one action row, one destructive row and a footer. That is the entire
surface.

    Plan                        Tier one
    New ground                  340 left this period
    Renews                      12 October
    Payment                     handled off this device
    [ Open the billing portal ]
    Cancel the subscription                              <- --bad
    Your card is never held here and your record carries no customer
    number. The portal is where the card, the plan and the cancellation
    live.

### 7.3 The Tier Ladder, And The One Grid Break

Four rungs at 12, 24, 36 and 99, ruled. A comparison, so it is a grid: four
columns at 1600, two at 980, one at 390. Each rung is a panel at `--panel`,
`--r-s`, `--edge`.

**The current rung is the only one with an accent border**, 1px `--accent`,
and it carries the word "current" at `--accent` 11px. No other rung is marked
in any way. No "most popular", no "best value", no recommended badge. The only
distinction the ladder draws is the true one: which one you are on.

Every rung prints the same three lines, because sight is not for sale and the
rungs differ in exactly one dimension:

    Tier one          12 a month
    400 of new ground a month
    The whole reading, every tool, rerunning anything already open

The third line is identical on all four. That repetition is the argument. A
person reading four identical sight lines learns in two seconds that nothing
about their own reading is being withheld, which is worth more than any
differentiator copy would be.

---

## 8. Colour, Light And Type. The Specifics

### 8.1 Sol On Colour

The account area is the lowest saturation surface in the product and that is a
position, not an absence. The instrument is where colour carries meaning:
seven seats, each one a measurement. Settings measures nothing. So the only
saturated things on the whole account surface are the section icons at their
family colour, the one accent used for state, and `--bad` on the one
destructive row. Everything else is `--ink`, `--mid`, `--dim` on `--panel`
and `--bg`.

That is Kenya Hara's argument about white, applied to a settings page: the
emptiness is what lets the one coloured thing mean something. If the account
page carries as much colour as the field, the field has stopped meaning
anything.

**Measured contrast, read out of the live document, against each element's own
ground and not against the page.** Dark, on `--panel` `#1A1D26`:

    --ink     #EFEDE8   14.39   row values, titles
    --mid     #B4B0A8    7.79   row labels, body
    --dim     #94908A    5.30   group footers, stub right slot, eyebrows
    --accent  #7EB8D4    7.77   state, current rung, active section
    --good    #68CBA4    8.17   nothing in this area yet
    --bad     #CB5F59    4.26   FAILS. moves to #D4736D at 5.19
    --alarm   #FF2E1F    4.54   reserved, not used here

Snow, on `--panel` `#F8F7F3`:

    --ink     #16171C   16.69
    --mid     #4E4C48    7.99
    --dim     #605E59    6.04
    --accent  #2F6E92    5.20
    --bad     #A8413C    5.62   passes, does not move
    --alarm   #D41200    5.04   reserved

`--on-accent` `#0B1418` on `--accent` `#7EB8D4` measures 8.60, so a filled
accent control is safe in Dark. In Snow the accent deepens to `#2F6E92` and
`--on-accent` becomes `#F4F8FA`, which is already handled at head.html:249.

**The seat colours cannot carry text in Snow, and this bites the icon rule
directly.** Measured on Snow's `--panel` `#F8F7F3`:

    root   #C4635E   3.70
    sacral #D19255   2.46
    solar  #D4BC70   1.74
    heart  #6FC5A3   1.92
    throat #65B8D4   2.09
    eye    #8296DB   2.67
    crown  #A98BCE   2.69

Solar at 1.74 is invisible on paper. So a section icon rendered as a 1.6px
ring in its family colour is legible in Dark and is not legible in Snow. The
resolution, and it is Petra's: **the section icon is a ring in `--mid`, and
the family colour appears only on the active section**, where it sits against
the active row's `--panel-2` ground and is reinforced by the label going to
`--ink` and by a 2px left marker. Colour is never the only carrier of the
family. That satisfies POUR, and it satisfies the house rule, because the
family still has a colour and the colour still means something. It just is not
load bearing at 1.74 to 1.

### 8.2 Petra On Iconography

Six sections, six icons, one family, drawn to the product's existing
convention and nothing new:

    viewBox 0 0 24 24, fill:none, stroke:currentColor, stroke-width 1.6,
    stroke-linecap round, stroke-linejoin round, 17px in an index item

That is the exact spec already in force at head.html:630 for `.vt svg`. Ring
not fill, which is the ruling, and every glyph below is an outline with no
closed filled counter.

    Account            the existing #profbtn person, circle plus shoulder arc
    Display            the existing #lightbtn sun, already drawn
    Security           a shackle and a body, ring only, no keyhole dot
    Privacy            an eye with a slash, the same eye as the 3rd Eye seat
    Billing and tier   a card rectangle with one rule across it
    Help               the existing #helpbtn ring and hook, already drawn

Three of the six already exist in `shell/body.html` as top bar glyphs and are
reused at 17px rather than redrawn. Two new glyphs, Security and Privacy, plus
one for Billing. That is three drawings, not six, and it is the cheapest way to
satisfy the rule.

Family colours, on the active index item only, chosen so the symbol and the
seat agree rather than being assigned:

    Account            --throat  #65B8D4   the seat of speaking as yourself
    Display            --solar   #D4BC70   light
    Security           --root    #C4635E   safety, the base
    Privacy            --eye     #8296DB   what is seen
    Billing and tier   --sacral  #D19255   exchange
    Help               --heart   #6FC5A3   being helped

Six sections, six of the seven seats, and Crown is deliberately unspent.
The account area is not the crown of anything and a key that uses every value
it has is a key with no room in it.

**Inside Help, the sub rows do not get their own family.** The architect puts
eight rows in Help: ask a question, report something broken, rate the product,
product feedback, how to read this, outbox, what is new, terms and privacy.
Giving each of those a colour would make eight more keys under one key, and a
symbol set with keys inside keys has stopped being a language. They take the
row icon in `--mid` like every other row in the product, and Heart belongs to
the section that holds them.

**The one colour I would need, and I do not need it.** I looked for a token
for a neutral "not built yet" state and there is none. I am not adding one.
`--dim` does that job at 5.30 in Dark and 6.04 in Snow, it is already the
second tier information colour throughout the product, and a new token for a
temporary state would outlive the state. The only value that moves is `--bad`
in Dark, and that is a correction to an existing token rather than a new one.

### 8.3 Bjorn On Type

One face, Inter, already carried in the file as base64 at 300 to 700. Lexend
carries digits through `--num`. No new face, no new weight.

    page eyebrow      .pm-eye     11px  600  capitalize  --dim
    page title        .kb-h       22px  500  -.01em      --ink
    page footnote     .kb-p       13.5px 400 1.65        --mid   68ch
    section list item             14px  400              --mid
    section list item, active     14px  500              --ink
    group header      .pm-eye     11px  600  Title Case  --dim
    row label                     13px  400              --mid
    row value                     13px  500              --ink
    row value, numeric            13px  400  --num, tabular
    group footer                  12.5px 400 1.6         --dim   68ch
    stub right slot               12.5px 400             --dim

Three levels, achieved with weight and value before anything is allowed to get
bigger. The largest type in the account area is 22px and there is exactly one
of it per page. Today's settings header is the same 22px and that is correct;
nothing here needs to be louder than it already is.

The floor is 11px and `tests/design.js` gate 4 enforces it. Nothing above is
below 11. The group footer at 12.5px is deliberately one step above the floor,
because it is the layer James at 57, Gordon at 58 and Rosa at 61 lose first,
and three of the nine in the reference sample are in that band.

Numerals in a value column take `--num` with tabular figures so a column of
amounts and dates holds a common right edge. That is the whole reason `--num`
exists and the current `.sh-row b` does not use it: measured, the row values
render in Inter at weight 500. That is a one word fix in the row component and
it is the difference between a billing column that lines up and one that does
not.

### 8.4 Light And The Four Lightings

Every lighting has to be genuinely its own, ruled, so here is what each one
does to this area specifically and what has to be checked:

**Dark.** The default. Group container `--panel` on `--bg`, a 1.27 to 1 step,
which is deliberately quiet: this is a list, and a list wants its rows to be
the figure. Separators at `--edge`, `rgba(255,255,255,.09)`.

**Snow.** Same instrument on paper. The seat colours drop to 1.74 to 3.70, so
section 8.1's ring rule is not an option here, it is the requirement. Check
the active section marker specifically: `--accent` deepens to `#2F6E92` at
5.20 and the 2px left marker holds.

**Punch.** Nothing outlined, everything solid. `--edge` is transparent, so the
group container has no border and the row separators vanish. The rows must
therefore separate by ground: `.set-sec` already flips to `--panel-2` in
Punch at head.html:1563, and the row grouping needs the same treatment, with
alternating ground rather than a rule. This is the lighting most likely to
break the list and it needs a shot of its own before anything lands.

**Glass.** Panes in front of a moving ground. The group container gets the
existing glass treatment. One risk: a list of rows behind a blur with a
refracting ground is where a 13px `--mid` label gets eaten. The measured
contrast above is against a flat `--panel` and Glass's panel is
`rgba(30,34,46,.55)`, so the effective ground moves with whatever is behind
it. Glass needs its own measurement pass on this surface and I am not
claiming a number for it here.

### 8.5 The Privacy Section, Which Is The Only One Worth Designing Twice

Five of the six sections should be conventional and forgettable. Privacy
should not, and it is the one place I would spend a day rather than an hour.

The architect gives it eight rows and the first is "What is held here", which
enumerates rather than reassures: the identity and birth moment, the sixty
three answers, the charge on nine axes, the stories, the imprints, the meter,
the snapshots, the avatar and purpose values, the plan. That list is the
product's argument about itself and it is currently one sentence of prose.

**Draw it as an inventory, not as a paragraph.** One row per object, the name
left, and in the right slot the plain fact of what it is. No count of items
against a total, because that ruling holds here too and an inventory is
exactly where somebody would print one.

**One thing on this surface is allowed to be seat coloured, and it is this
list.** Every object in the inventory belongs to a part of the instrument that
already has a colour, and this is the one place where saying so is not
decoration: it is the only screen where a person sees everything the product
holds about them at once, and the colours are the map back. 17px ring glyph in
the family colour at the left of each row, Dark only, reverting to `--mid` in
Snow per section 8.1, because Solar at 1.74 to 1 is not a colour on paper.

That is the grid broken a second time, and I said in section 5.4 that a grid
broken twice is not a grid. So it is not a break: the inventory is still rows,
still 56px, still the same left edge. Only the icon colour changes, and colour
is not geometry. Bjorn checked me on this and it holds.

**The promise sentence sits alone.** "We never sell anybody's data. Ever." is
the strongest ruling in `DECISIONS.md`. It goes at the foot of this section as
a group footer at 12.5px `--dim`, and nowhere else in the account area. A
promise repeated on four screens reads as marketing. Said once, in the place a
person goes to check it, it reads as a fact.

**"Improve the models" is a toggle row and it starts off.** No pre-tick, no
persuasive subtitle, no accent on the switch when it is off. The group footer
carries the one sentence the architect wrote and not a word more.

**"Delete this record" is the destructive row from 6.4**, and while there is no
store it says what it actually does: it deletes the local record, and it does
not claim to have deleted anything from anywhere else. A destructive control
that overstates its reach is the same defect as a stub that overstates its
availability.

---

## 9. Empty, Pending And Error States

Four states, and they are different things. One word per concept.

**Nothing held.** The canonical empty phrase in this product, and it does not
belong in the account area at all, because an account section is never empty
of structure. What is empty is a list inside it: no sessions, nobody with
sight, no feedback sent. Those render as one row at `--dim` 13px reading the
fact, inside the group, at full row height, so the group does not collapse:
"Nobody has sight of your data."

**Not built yet.** Section 6.5. Structural, permanent until it is not,
announced in the right slot and explained once in the footer.

**Pending.** A write that is in flight. The measured floors say under one
second needs no indicator, one to three seconds gets a spinner, three to ten
gets a progress bar, over ten gets an estimate and a way out. Everything local
computes in under 100ms, so the only pending states in this area are the ones
that will cross the network: the record fetch at sign in, and the portal
handoff. Those get a spinner in the right slot of their own row, 17px, the
existing rotation, and the row stays the same height so the list does not
jump.

**Failed.** Through `status()` and only through `status()`, which is the one
writer, at `role="status"` and `aria-live="polite"`. A failure holds on
screen. A confirmation clears after 2.4s. Both already ruled and both already
built. The row that failed also reverts its own control, because a toggle that
stays on after the write failed is the exact lie rule 3 exists to stop.

---

## 10. The House Rules, And Where Each One Bites Here

Stated so a technical director can check the build against them without
re-reading the whole document.

1. **Icons are ring, not fill.** Six section glyphs, three of them already
   drawn in the top bar, all outline, stroke-width 1.6, no closed filled
   counters. The toggle knob is the one filled shape in the area and it is a
   control, not an icon.
2. **If it has a name it has an icon.** Six sections, six icons, one family,
   six colours from section 8.2. Currently zero.
3. **Never print a count against a total.** No "400 of 1200". No progress bar
   on the allowance. The allowance says what is left.
4. **No all caps.** `text-transform:capitalize` on `.pm-eye` is Title Case,
   not caps, and gate 5 at design.js:141 watches for caps strings. The
   person's own name takes `.plain`.
5. **Sentence case body, Title Case headers.** Row labels and footers are
   sentence case. Group headers and page titles are Title Case.
6. **No em dashes.** This document has none. Check with grep before commit.
7. **44 by 44 minimum, gate 8 at design.js:286.** Rows are 56. Toggles are
   44 by 26 inside a 56 row, which means the pressable region is the row and
   not the switch, and the row is 56 by full width. The chevron is decorative
   and is not itself a target.
8. **Muted palette from autonomic response.** Section 8.1. The account area
   is the lowest saturation surface in the product on purpose.
9. **Every class has a CSS rule**, gate at design.js:100. Eight new classes
   at most: the surface wrapper, the section index, the index item, the group,
   the group header, the row, the row value, the group footer. Nothing else.
10. **No new geometry class name that duplicates an existing one**, gate at
    design.js:188. `.card` and `.panel` are both already taken and both
    already caused this exact bug. The group container is `.arow-group` or
    whatever the technical director prefers, but it is not `.card`.

---

## 11. Tissue Test Against The ICPs

Sample: the nine in `RESEARCH-icp.md`, six carrying `· ICP` and three edge
cases. Weighted panel of 1,000.

**Diane, 46, founder, second company, weight 180.** Goes to billing first and
wants the renewal date and the exit in the same screen. Under this system both
are rows in the same group. Passes.

**Derek, 39, high performer, weight 170.** Goes to privacy and wants to know
what leaves the device. The privacy section leads with the standing sentence
and a visible sight list. Passes.

**Marcus, 44, creative director, weight 160.** The one whose loaded profile I
rendered. He is the reader who notices the 497 pixel void and the zero icons,
because that is his job. Currently fails. Passes under section 5 and 6.

**Angela, 36, seeker, six modalities, weight 150.** Goes to help and wants a
person. The Help section leads with "Ask a question", which is the architect's
top row, and the rows beneath it that cannot work yet say "not built yet" in
plain words rather than failing on press. Passes
on honesty, not on capability, and that is the correct result for an alpha.

**Sofia, 41, somatic practitioner, weight 140.** The practitioner grant is her
section, and she needs to see it from the client's side to trust it. Visible
list, no silent default. Passes.

**James, 57, C-suite, weight 100. Gordon, 58, weight 35. Rosa, 61, weight
15.** Three of nine, and contrast sensitivity falls materially past 55. Every
value in section 8.1 clears AA against its own ground in Dark and Snow, and
the one that does not, `--bad` at 4.26, is corrected in this document. The
group footer at 12.5px is the layer they lose first and it is one step above
the floor rather than at it. Passes, and it is the reason `--bad` is in here
at all.

**Where it is thin.** I cannot tissue test Glass on this surface because I
have not measured it. Nobody should land the account area in Glass without a
shot and a contrast pass.

---

## 12. Build Order

Sized S, M, L. Nothing here requires inventing a concept that is not in this
document or in `head.html` today.

**S. The tokens and the primitives. Half a day.**

- `--bad` Dark moves `#CB5F59` to `#D4736D` at head.html:108. One line. Snow
  does not move. The only reader is `.sum-dg` at head.html:2111.
- Row component: one class, 56px, icon slot, label slot, value slot,
  separator. Six modifiers for the six row types.
- Group container, group header, group footer. Three classes.
- Row values take `--num` with tabular figures.
- Re-run `node tests/design.js` for gates 4, 5, 8 and the class rule.

**S. Kill the dead space. One hour, and it is the highest ratio of found
value to effort in this list.**

- `.set-grid` goes from three columns to one. 497 pixels of void gone, no new
  component, and Settings stops lying about its own structure while the rest
  of this is built.

**M. The stub state. One day.**

- The stub row per section 6.5, wired to whether the host function is bound.
- `planSection()` renders "Move to tier one" and "Manage billing" as stub rows
  when `PLAN_HOST` is null, and as an action row and a `.btn` when it is not.
- The `status()` fail path stays for real failures.
- This is the single change that makes the whole area honest before any of it
  is built, and it can land before the IA does.

**M. The frame. Two days.**

- `body.tab-settings .mid .col{display:none}` suppresses both rails, and the
  profile picker moves into the Account section.
- Index and open panel, 228 and 1fr with a 640 max panel.
- Phone: one accordion, one section open, the opened header pinned to the top
  of the stage.
- Re-run `node tools/monitor.js`. A new suppressed-rail surface is exactly the
  kind of change that empties a surface, and the log is how that is caught.

**M. The icons. Half a day, because three of six already exist.**

- Six section glyphs. Account, Display and Help are reused from the top bar at
  17px. Security, Privacy and Billing are the three new drawings.
- Active section only carries the family colour, per section 8.1.
- Measure them in Snow before landing. Solar at 1.74 is the case that proves
  the rule.

**L. The sections themselves. A week, and it is blocked on the IA.**

- Account, Display, Security, Privacy, Billing and tier, Help, in the
  architect's order.
- Most rows in Account, Security and Privacy are stubs until sign in exists,
  which is the point: the shape is visible and honest before the plumbing is
  there.

**L. The privacy inventory. One day, and it is the section worth it.**

- Section 8.5. One row per held object, the family ring glyph in Dark, `--mid`
  in Snow, the promise as a single group footer.
- This is the only part of the account area that is not a convention, and it
  is the part a person will remember.

**L. The tier ladder. Two days, and it is blocked on the price list.**

- Four rungs, the one grid break, the current rung marked and nothing else
  marked.
- Identical sight line on all four.

**Check every time, and the last one is not optional:**

    ./atuned_src/BUILD.sh
    node tests/design.js
    node tests/collide.js
    node tools/monitor.js
    node tools/shots.js OUT 1600 1000 && node tools/shots.js OUT 390 844
    python3 tools/terms.py

`tools/shots.js` does not walk Settings, because Settings is integer 9 and is
not in `TABDEF`. If the account area ships without being added to that TABS
list, it is the one surface in the product with no render watch on it, and the
first person to find out it is broken will be the owner. Add it.

---

## 13. The Grade

**Where the account area sits today: 3 out of 10.** Not because it is ugly. It
is quiet and well behaved and the type is correct. It is a 3 because it does
about eight percent of the job, it carries zero icons on a surface built from
names, it wastes 497 pixels of a 903 pixel viewport on desktop, it spends 69
percent of the phone scroll on the instrument the person navigated away from,
and the brightest object on it is a sales control that does not work.

**Section 12's two S items alone take it to 5.** One column instead of three
and one corrected token, in under a day.

**S plus the stub state takes it to 6**, and the whole of the difference is
honesty. An unfinished product that says what is unfinished is a better
product than a finished-looking one that fails on press.

**The full build order takes it to 8.** It does not take it to 9, and it
should not. A standard account area is not where this product earns anything.
The owner said it himself: coherence is all over the app. This surface's job
is to be conventional, legible and honest, and to get out of the way of the
instrument. An account page nobody remembers is an account page that worked.

**What would make it a 9,** and it is one thing rather than a list: section
8.5. Privacy is the only part of this area that is not generic. Every other
section is the same section every product has, and should be. The inventory,
the sight list, the key, the promise that the record and the story are never
held joined, and the revocation row, are the product's own argument rendered
as a control rather than as copy. It is the only section I would spend a
second day on and it is the only one where the product has something to say
that nobody else can say.

---

## 14. Found It, By Name

    3.1  69 percent of the phone account page is rail            Petra
    3.2  497 pixels of void in a three column grid               Bjorn
    3.3  zero icons on a surface built from names                Petra
    3.4  the loudest object is an upsell that does not work      Mika
    3.5  522 pixels of prose where three rows belong             Bjorn
    3.6  38 pixels below a fold with no visible scrollbar        Bjorn
    6.4  --bad at 4.26 fails AA in Dark. Move to #D4736D         Sol
    6.4  --alarm is not the destructive colour                   Sol
    8.1  seat colours at 1.74 to 3.70 in Snow cannot carry the
         icon family alone                                       Sol and Petra
    8.3  row values render in Inter where --num is the point     Bjorn
    12   Settings is not in the shots harness and has no
         render watch                                            Mika
    8.5  the privacy inventory is the one screen where seat colour
         earns its place outside the instrument                   Petra
