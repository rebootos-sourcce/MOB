# IA. The eight films and the knowledge base

Dani Sorensen, UI UX architecture. 19 September.

Built for this review from a tree that was dirty on `BOOK-ERRATA.md`,
`engine/data/kb.js`, `engine.js` and `tests/engine.js` at commit `2015f8a`.
Those changes landed as `1f0c93b` while this review was running, and the build
I measured is byte identical to the one that commit carries: `source.html`,
1,166,090 bytes, md5 `28f1899fccb03c0c8245be57901ae5cf`. So every number below
describes **commit `1f0c93b`**.

Everything measured here was measured in that build in Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, boot 7200ms, at 1600 by
1000 and 390 by 844. Every measurement names the DOM node it came from,
because three probes lied this session and one of mine tried to.

**Nothing in the footage has been watched.** No ffmpeg in this container, the
proxy refuses the Drive fetch and the package install. Every claim about the
films is from their names, their byte counts and the engine table. Where a
recommendation would change if the footage turned out to be something other
than eight short explanations of a law, section 2.7 says so.

---

## 1. What the knowledge base actually is today

### 1.1 The surface, and the nodes behind every number

The Knowledge surface is `#know`, one of eight doors in `#tabbar`. `#know`
holds `#knowbody`, which is the only thing `kbRender()` in
`atuned_src/ui/knowledge.js` writes. `#games` is **not** inside `#know`: its
parent is `#stage`, measured at `document.getElementById('games').parentElement.id`.
`CLAUDE.md` still says Games is folded into Knowledge. It is not, and
`engine/core.js` line 92 records the reversal in a comment. The bar is eight.
Correct `CLAUDE.md` when somebody next touches it.

Inside `#knowbody`, in document order:

    node            what it is                       1600 box      390 box
    .kb-top         header, search and section tabs  884 x 288     374 x 381
    .kb-hd          eyebrow, h2, one paragraph       884 x 107     374 x 151
    .kb-search      one input, #kbq                  884 x 44      374 x 44
    .kb-tabs        12 section tabs, role=tablist    884 x 93      374 x 142
    .kb-grid        the card deck                    884 x 5820    374 x 17484
    .kb-deck        the Letting Go Deck, #kbdeck     884 x 181     374 x 225

The header copy, read from `.kb-hd`: eyebrow "The codex", heading "Every part
of the system, open", body "Nothing here is held back. These are the same
tables the reading runs on, the whole structure it is built from, and it is
open because a mirror you cannot inspect is not a mirror. Take any card."

The heading renders as "Every Part Of The System, Open". The source string is
sentence case and the stylesheet transforms it. That is the Case ruling
working, and it is worth knowing before anybody writes a film header.

### 1.2 The twelve sections and what is in them

`KB_SECS` in `ui/knowledge.js`. Counts from `kbRows(sec).length` with no
search filter, measured live:

    addr    Nodes            108
    fetter  Fetters            9
    sab     Saboteurs         39
    law     Laws              21
    mask    Masks              6
    dom     Domains           19
    arch    Archetypes        12
    gate    Gates              6
    card    The cards         25
    seat    The stack          7
    harm    Universal laws    76
    gloss   Glossary          56

Total 384 cards across twelve decks, one deck visible at a time. `KB_SEC` is
module state, default `'addr'`, so the surface opens on Nodes.

### 1.3 How a card stack works

Each section renders `.kb-grid` full of `.kb-c` buttons. Measured at 1600: a
card is 287 by 150, three across. At 390: 374 by 150, one across. Every card
carries `.kb-cs` a family stripe, `.kb-ch` holding either a glyph or a
`crBadge` ring when the person carries charge at that address, `.kb-cn` the
name, `.kb-cb` the subtitle, `.kb-cd` one line of description. The kind label
`.kb-ck` only appears during a search.

A card is a button. Tapping it calls `kbOpen(row)`, which routes by `row.k` to
a drill. Nothing in `.kb-grid` changes state. There is no selected card, no
pressed state, no mark saying which one you just opened.

### 1.4 Where the universal laws live, and what a person gets there

Section tab `harm`, labelled "Universal laws", eleventh of twelve. It holds
all 76 entries of `HARM` in `engine/data/kb.js`, grouped by `HARM_AX` into
seven axes. The Laws of Nature axis is **thirteen** entries, E01 to E13, not
ten.

Every one of the thirteen renders identically apart from its name. Measured
off `.kb-cn`, `.kb-cb` and `.kb-cd` for the first ten cards in the deck:

    All Is One            Laws of Nature   E01, Chapter 19. read, not scored
    All Is Motion         Laws of Nature   E02, Chapter 19. read, not scored
    Polarity              Laws of Nature   E03, Chapter 19. read, not scored
    All Fields Correspond Laws of Nature   E04, Chapter 19. read, not scored
    Like Fields Attract   Laws of Nature   E05, Chapter 19. read, not scored
    Inspired Action       Laws of Nature   E06, Chapter 19. read, not scored
    Transmutation         Laws of Nature   E07, Chapter 19. read, not scored
    Cause & Effect        Laws of Nature   E08, Chapter 19. read, not scored
    Compensation          Laws of Nature   E09, Chapter 19. read, not scored
    Potential             Laws of Nature   E10, Chapter 19. read, not scored

One glyph between all thirteen, `HARM_FAM.nature.ic`, the returning wave. One
colour, Crown. One body line that differs only in a code. No reading, because
`scored` is false for every axis except `spirit`.

**This is the finding the film question turns on.** Tap any of them and
`kbOpen` calls `runKbDrill('Harmonic element E01', 'All Is One', 'Laws of
Nature', 'Chapter 19')`, which writes into `#rdrill` in the right rail.
Measured `document.getElementById('rdrill').innerText.length` after a real
click: **76 characters**. The whole of it:

    Harmonic Element E01 / All Is One / Laws of Nature / What It Is /
    Chapter 19 / Close

The body of a universal law in this product is a chapter number pointing at a
book the person does not have. Seventy six characters is the payload of the
door. Thirteen laws of nature, all the same shape, all the same picture, all
the same seventy six characters.

### 1.5 What a person does here

Search, pick a deck, scan cards, tap one, read the drill, close. That is the
whole loop. Search is `#kbq`, live on `oninput`, and it counts across all
twelve decks and prints the per section counts in the tab labels.

### 1.6 Two counts the film has to land inside

Simultaneous choices, counted as interactive elements whose box intersects the
viewport, across the whole document and not one host:

    state                              1600   390
    app as it opens (Summary)            70    19
    Knowledge, Nodes deck                95    27
    Knowledge, Universal laws deck       95    27
    scrolled so E01 is at the top        95    27
    a law drill open                     93     5

Ninety five at 1600. The standing measurement for this product is 57 to 71 and
the working target is under 12. The Knowledge surface is the worst reading I
have taken here. Sixty two of the ninety five are the left rail before the
codex has offered anything: 41 `.ib` domain buttons, 13 `.vt`, 4 `.rootb`, 4
`.stbtn`. The codex itself contributes 12 `.kb-t` plus 12 visible `.kb-c` plus
`#kbq`.

At 390 the number is 27 and that is not a success, it is a symptom: only two
cards fit a screen. Seventy six universal laws at two per screen is 38 screens
of scroll.

Tap targets: `.kb-t` all 44 high at both widths, `#kbq` 44, `#kbdeck` 44 by
111. Zero elements under 44 by 44 inside `#know` at either width. That floor
is clean and a film control must not be the thing that breaks it.

### 1.7 The stopper nobody has fixed, and the film would land on top of it

**At 390 the knowledge base cannot be reached.** Measured on `#tabbar`:
`clientWidth` 348, `scrollWidth` 657. Four of eight doors sit past the right
edge, and Knowledge starts at x 407 against a 390 viewport. `document
.documentElement.scrollWidth` is 390, so there is no page scroll to reach
them. I got to the surface by calling `setTab(TAB.KNOW)` from script. A person
cannot.

    door        x     right   past the edge at 390
    Energetics   21     118    no
    Story       123     183    no
    Field       188     245    no
    Body        250     309    no
    Compass     314     402    yes
    Knowledge   407     508    yes
    Games       513     584    yes
    Summary     589     678    yes

`PLAN.md` block 18 already records this. I re-measured rather than cite it.

**And the round trip inside the surface is broken at 390.** Measured by
clicking the real card, not by calling `kbOpen`, and waiting 3000ms for any
smooth scroll to settle:

1. Before the tap: `#knowbody` on screen, cards visible.
2. After the tap: `#rdrill` at viewport top 56, 240 tall, in view. The codex
   is at `getBoundingClientRect().top` **minus 16,658**. `kbOnScreen` false.
   The whole knowledge base has left the screen.
3. After tapping Close: `KB_SEC` is still `'harm'`, `S.tab` is still 6, 76
   cards still exist in `.kb-grid`, and the number of them intersecting the
   viewport is **zero**. The screen reads "Nothing selected. Click an address,
   a law, a saboteur or the core."

A person on a phone taps a law, is thrown out of the codex into a panel
holding 76 characters, closes it, and lands on an empty instruction telling
them to click something that is not on the screen. `rdClose()` in
`ui/drills.js` lines 18 to 21 sets `innerHTML`, sets `display:none` and calls
`render()`. It restores no scroll position, and it cannot, because it does not
know where the person was.

I corrected one of my own probes here. An earlier run that called `kbOpen()`
directly reported the drill opening below the fold at y 1006. That was my
measurement artefact, not the product's behaviour. On a real tap the drill is
in view at top 56. The finding above is the one that survived re-measurement.

---

## 2. The hard constraint. This decides everything else

### 2.1 What is true today, measured

    source.html                     1,166,090 bytes
    source.html, gzip -9              419,921 bytes   36.0 percent
    DOM characters at boot           1,284,329
    goto to load, file://, 390         194 to 220 ms
    DOMContentLoaded                   169 to 200 ms
    JS heap after boot                      10 MB

`tests/design.js` gate 7 watches the network on load and across four tabs and
fails on any request that is not `fig-fetter.png` or `fig-pain.png`.

### 2.2 The one file rule is already not literally true, and this matters

`engine/data/figure.js` line 10 declares `FIG_FETTER='fig-fetter.png'` and
`FIG_PAIN='fig-pain.png'`. Neither file is in this repository. `ui/map.js`
line 12 probes both and `ART_OK` records the result, and the file's own comment
says the vector `BODYPATH` renders in their place when either is absent, "so
the Energy Map is never blank".

So the product already names two sibling assets it does not ship, already
probes for them, and already degrades honestly when they are missing. That is
a precedent with a working fallback, and it is the shape a film needs. It is
not a licence to add fifteen megabytes without a ruling.

### 2.3 Gate 7 does not stop a companion file, and that is a hole

I injected `<video preload="metadata" src="film-e01.mp4">` into a copy of the
build, loaded it with the file absent, and replayed gate 7's own filter
verbatim:

    all requests seen                                       4
    request for film-e01.mp4                                1, as a file: URL
    gate 7 'asked' (not file/data/blob/about)               []
    gate 7 'off' (what would fail the gate)                 []
    video element state    error.code 4, networkState 3, readyState 0

The gate passes a sibling mp4 at `file://` because it discards every `file:`
URL before it counts. Over http the same reference becomes an origin request
and the gate **would** fail it unless whitelisted by name, exactly as the two
rasters are. So gate 7 is not the obstacle it is being treated as, and it is
also blind in the case that matters. If companion files are ruled in, gate 7
needs its whitelist widened deliberately and needs to stop ignoring `file:`,
or it is asserting a promise it no longer checks.

The useful half: `video.error.code === 4` with `networkState === 3` is a clean,
readable signal that a film is absent. That is the `ART_OK` pattern, already
proven in this codebase, available for free.

### 2.4 Embedding all eight. Measured, not projected

I built a real 21 MB variant by injecting 20,533,336 bytes of base64 into
`source.html` before `</body>` and booted it in the same Chromium at 390.

    build             raw bytes    gzip -9      goto     DCL      heap   DOM chars
    source.html       1,166,090    419,921    194ms    169ms     10MB   1,284,329
    one film, 1.1MB   2,632,791  1,530,774    216ms    212ms     10MB   2,751,030
    all eight         21,699,460 15,959,253   705ms    699ms     45MB  21,817,699

From local disk, with no network at all, eight films cost **+510ms of parse
and +35 MB of heap** before a person has touched anything. One film costs
+30ms and no measurable heap. That asymmetry is the whole finding: one film is
free, eight is not.

### 2.5 What base64 does over the wire, measured

On 1,572,864 bytes of incompressible binary:

    binary                     1,572,864
    base64 of it               2,097,152   exactly 4/3
    gzip -9 of the base64      1,586,984   100.90 percent of the binary

So gzip recovers almost the whole base64 expansion, at a cost of 0.9 percent.
15.4 MB of mp4 embedded as base64 is 20.53 MB on disk and 15.54 MB over a
gzipped connection. The transfer cost is the video, not the encoding. The
encoding cost is paid on disk, in memory and in parse.

### 2.6 What that is on a phone

21.7 MB raw, 15.54 MB gzipped, as one indivisible request:

    link speed        gzipped      raw
    50 Mbit wifi         2.5s      3.5s
    10 Mbit LTE         12.4s     17.4s
     4 Mbit weak LTE    31.1s     43.4s
     1.5 Mbit           82.9s    115.7s

The product's own feedback floor: under 1s no indicator, 1 to 3s a spinner, 3
to 10s progress with what is left, over 10s an estimate and a way to leave.

A single HTML file can offer none of the four. There is no spinner, no
progress and no exit, because the application does not exist until the last
byte of the file has landed. A person on a 10 Mbit connection stares at a
white document for twelve seconds with nothing on it. That is not a slow
screen, it is no screen.

And it is paid by everyone for content most people will not open. Section 1.2
measures 384 cards. Eight films are 2 percent of the codex and would be 95
percent of the build.

There is a second cost the ruling should name. `CLAUDE.md` rules that every
build goes to the owner as a download named `atuned.html`. That attachment
goes from 1.17 MB to 21.7 MB. The handover loop is a working part of this
project and embedding changes it.

### 2.7 The five real options, with what each forfeits

**Option A. Embed all eight in `source.html`.**
Build 1.17 MB to 21.7 MB, 18.6x. Parse +510ms, heap +35 MB, both measured.
Nothing else changes: no new seam, no new file, gate 7 untouched because
`data:` is already exempt.
*Forfeits the phone entirely, and the handover attachment. Recommend against.*

**Option B. Serve from the record store when it exists.**
Zero bytes in the build. But `DECISIONS.md` rules the app gains network at
exactly one seam, the record fetch at sign in. Video is a second seam with
different properties: it is large, it is range requested, and it is the kind
of request that carries a referrer and an IP to whoever serves it. That is the
exact objection that removed Google Fonts.
It also puts the codex behind an account, which contradicts the sentence
rendering in `.kb-hd` right now: "Nothing here is held back."
*Forfeits the films until the store ships, and forfeits the open codex.
Recommend against as the primary, keep as the eventual CDN path.*

**Option C. Companion files beside `source.html`.**
Eight mp4s named `film-e01.mp4` through `film-e10.mp4`, referenced relatively,
probed the way `ui/map.js` already probes the two rasters, absent handled by
`error.code === 4`. Build stays 1.166 MB. Nothing loads until a person presses
play, so the cost is paid by the person who wanted it.
Precedent exists in this codebase (2.2). The absence signal is measured and
works (2.3).
*Forfeits "one file" as a literal sentence, in a product where it is already
not literally true, and forfeits the single attachment handover. Gate 7 needs
a deliberate widening and a fix for its `file:` blindness.*

**Option D. A poster frame now, the film later.**
I cannot cost this honestly because **I cannot make a poster**. No ffmpeg, no
Drive fetch. A frame has to be pulled by the owner or by a machine that has
the footage. The arithmetic if it were done: eight WebP posters at 640 by 360,
roughly 25 KB each, 33 KB as base64, 266 KB for eight, a 23 percent build
increase. At 480 by 270 JPEG, roughly 149 KB for eight, 13 percent.
*Forfeits nothing on its own and buys nothing on its own. A poster with no
film behind it is a picture of a control, which is the dead end the house
rules forbid. It is a component of C, not an option.*

**Option E, mine. Separate the two problems and ship the one that has no
bytes in it.**
The film is an asset problem. The universal law is a content problem. Only one
of them is costing something today, and it is not the asset. Measured: the
entire body of a universal law in this product is 76 characters, and all
thirteen Laws of Nature render identically (1.4). The films are being placed
onto a surface that has nothing on it to place them next to.

So: build the law page first, with no film in it and no bytes added. Declare
the film slot on that page, empty, saying what it is waiting for. Then fill it
through option C when the owner rules on the files.

*Forfeits the films shipping in the next build. Buys a page worth landing on
when they do, and it means the five Laws of Nature with no film are not a
hole, because the page is not made of film.*

### 2.8 Recommendation

**E then C, in two moves. Not A, not B.**

Move one, now, zero bytes: the Laws of Nature get a real reading on the centre
stage, replacing the 76 character right rail drill, with a declared and empty
film slot. Ship it and put it in front of people.

Move two, on the owner's ruling: the eight files land beside `source.html`, the
slot fills for the eight that have one and says what it is for the five that do
not.

**If he will not break the one file rule**, the fallback is cheap and I
measured it so it can be decided rather than argued: embed **one** film, the
smallest, `9 Balance (Compensation).mp4` at 1.1 MB. Build goes to 2.63 MB, gzip
1.53 MB, parse +30ms, heap unchanged. That is a real experiment with a real
number at the end of it, and it answers whether anybody watches before fifteen
megabytes is spent on the assumption that they will.

**What I am forfeiting by recommending E then C**, stated plainly: the owner
asked where the films go and my first move puts none of them anywhere. I am
recommending he spend the next build on the page rather than the film, because
a film that opens into the surface measured in 1.4 and 1.7 will be watched
once by nobody who comes back.

---

## 3. Where they go, precisely

### 3.1 The surface and the section

Surface `#know`, section `harm`, the deck labelled "Universal laws". Not a new
top level tab. Not a thirteenth section called Films. The reason is a ruling
this product already made: a film about the law of polarity is not a kind of
thing, it is a property of polarity. A Films deck is the category occupying
the line the thing itself should be on, which is the same defect that put the
word "Fetter" on nine fetter cards and the word "Card" on twenty five card
cards. `ui/knowledge.js` already carries that lesson in a comment. A Films
deck would repeat it.

Corollary: search must find a film through its law, not as a separate result.
`kbMatch` searches `t + ' ' + s + ' ' + d`. A film adds no row and therefore
adds no search noise.

### 3.2 The three name conflicts, and one that is already fixed

`BOOK-ERRATA.md` item 16 lists four laws carrying two names. **It is three
now.** Measured in the built file: `kbRows('harm')` returns `Inspired Action`
for E06, which matches film 6 exactly. The working tree fixed the `Inspired
Act.` truncation; `source.html` on disk before my build still carried it. That
one is closed and the errata should record it.

The three live ones:

    film                      engine            whose call
    1 Unified Field           All Is One        owner
    2 Vibration               All Is Motion     owner
    9 Balance (Compensation)  Compensation      owner

One word per concept is a standing ruling and it is broken three times. The
film's title bar and the card title must say the same words or the person
looking for the law of vibration under All Is Motion has been told the product
does not know what it calls things.

`Balance (Compensation)` has a second problem: `Balance` is already the label
on the strip under the wheel, and `DECISIONS.md` records that "Lean is not
Balance" was a correction made because two controls four inches apart both
said Balance. A film called Balance is a third one. If the owner picks Balance
for E09, that collision needs resolving in the same breath.

### 3.3 Five laws with no film, not two

`BOOK-ERRATA.md` item 15 says two laws have no film, E04 and E05. That is true
inside the E01 to E10 window the films cover. **The axis is thirteen.**
Measured: `kbRows('harm').filter(x => x.s === 'Laws of Nature').length` is 13.

    E01  All Is One             1 Unified Field.mp4            3.4 MB
    E02  All Is Motion          2 Vibration.mp4                2.3 MB
    E03  Polarity               3 Polarity.mp4                 1.5 MB
    E04  All Fields Correspond  none
    E05  Like Fields Attract    none
    E06  Inspired Action        6 Inspired Action.mp4          2.3 MB
    E07  Transmutation          8 Transmutation.mp4            1.6 MB
    E08  Cause & Effect         7 Cause and Effect.mp4         1.8 MB
    E09  Compensation           9 Balance (Compensation).mp4   1.1 MB
    E10  Potential              10 Potential.mp4               1.6 MB
    E11  Relativity             none
    E12  Rhythm                 none
    E13  Gender                 none

Eight of thirteen. Five gaps, not two, and they are not adjacent: E04 and E05
are a pair in the middle, E11 to E13 are a run at the end. Three of the five
are the last three cards in the axis, which is the worst possible position: a
person who watches their way down the deck hits three silent cards in a row at
the end and concludes the feature broke.

The numbering swap stands as the errata records it. Film 7 is Cause and Effect
and the engine's E07 is Transmutation. One of the two moves and the other
follows. Not mine to choose, and it must be chosen before a file is named,
because the file name is what carries it.

### 3.4 What a row looks like with a film

The card in `.kb-grid` **does not change**. That is deliberate and it is the
part I expect to be argued with.

A card in this deck is 287 by 150 at 1600 and 374 by 150 at 390. There is room
for a play button and there is not room for a film. Putting a poster on the
card turns a scannable deck of thirteen into a wall of thumbnails, and at 390
where two cards fill a screen it turns 38 screens of scroll into 38 screens of
thumbnails nobody asked to download. And a play control on a card whose whole
job is to open a door creates two destinations on one target, which is the
thing Fitts is actually about.

What the card gains is **one word in the subtitle line `.kb-cb`**, which today
reads "Laws of Nature" on all thirteen. It becomes:

    with a film       Laws of Nature · Film
    without a film    Laws of Nature

Not an icon on its own, because an icon with no text on a card carrying no
other icon is a decoration. The word `Film` is the affordance and it is a word
the product does not use anywhere else, which satisfies one word per concept.

The card also gains what it has always needed and does not have: a body line
that says something. `.kb-cd` reads "E01, Chapter 19. read, not scored" on all
thirteen. That line is a file reference wearing a sentence. It should carry
the law in the person's words, one line, and that is a copy task not a film
task, sized in section 6.

### 3.5 What a row opens, and this is the move

**The drill for a universal law comes out of `#rdrill` and onto the centre
stage.** This is the structural change and the films are the reason to make it
now rather than the thing being made.

Measured justification, all of it from section 1:

- The drill payload is 76 characters (1.4).
- At 390 the drill pushes the codex 16,658 px off screen and Close lands the
  person on a screen with zero cards on it (1.7).
- `#rdrill` is 298 wide at 1600 and 346 at 390. A film at a legible size does
  not go in a 298 pixel column, and 16:9 in 298 is 168 tall.
- The right rail is the information rail. A film is not information about the
  current reading, it is the reference itself.

So: tapping a Laws of Nature card replaces `.kb-grid` with a law page inside
`#knowbody`, with a back control that returns to the deck at the card you
came from. That is what fixes the dead end in 1.7, and it fixes it for all 76
universal laws, not only the eight with film.

The law page, in document order, which is also the phone order:

    1  back to Universal laws          one control, 44 high, always first
    2  the law's name                  Title Case, the name the owner rules
    3  Laws of Nature                  the axis, Crown colour, family glyph
    4  the film, or what stands in it  section 3.6
    5  what the law is                 the paragraph the restructure asks for
    6  where it sits in you            only when the person has a reading
    7  next law, previous law          so thirteen can be walked, not hunted

Item 7 is the one I would fight for if something has to go. A person who
watches All Is One and wants All Is Motion currently has to go back, find
their scroll position and tap again. Thirteen films with no sequence is a
playlist with the playlist removed.

### 3.6 What sits at item 4 in the three cases

**Case one, the law has a film and the file is present.** A 16:9 frame at the
column width, `preload="none"`, poster frame, one play control at 44 by 44
minimum, native controls after first play, captions on by default. Details in
section 4.

**Case two, the law has a film and the file is absent.** Detected by
`error.code === 4` and `networkState === 3`, measured in 2.3. The frame is
replaced by one line in the body register: "The film for this law is not in
this build." No play button, no broken frame, no spinner. This case is not
hypothetical: it is what every build does today and what a build handed over
without its folder will do forever.

**Case three, the law has no film. E04, E05, E11, E12, E13.** The slot is not
rendered at all, and the page does not mention film. The errata's instinct was
that these "should say they have none rather than showing a dead control", and
I disagree with half of it after measuring. Saying "no film for this law" on
five of thirteen pages advertises an incompleteness the person had no reason
to feel. The deck already tells the truth: the subtitle on a card with a film
says Film and the other five do not. That is the honest signal, it is in the
place a person is choosing, and it costs nothing on the page they chose.

The distinction is worth stating as a rule, because it will come up again:
**an absent thing that was promised gets a line. A thing that was never
promised gets silence.** Case two was promised by the card. Case three never
was.

### 3.7 Does this wait for the restructure

**It does not wait, and it is the first piece of it.**

The queued restructure is: the knowledge base reorganised by nature, human
nature and integrity, a paragraph per section, section headers on one line
with icons. The universal laws deck is already grouped by those exact axes.
`HARM_AX` in `engine/data/kb.js` names them `Laws of Nature`, `Laws of Human
Nature`, `Laws of Moral Integrity`, and `HARM_FAM` already gives each one a
glyph and a seat colour. The data for the restructure exists. What does not
exist is the paragraph, which is items 5 in section 3.5, and the one line
header with an icon, which is item 3.

So building the law page is building the restructure's unit. Build one axis of
it, Nature, thirteen laws, and the other six axes take the same page with no
new structure. That is the opposite of waiting.

What **would** be wrong is shipping the film into the current drill on the
promise that the restructure will move it later. That puts a film into a 298
pixel right rail panel with a measured dead end at 390, and it means the
restructure inherits a film placement decided by a constraint that no longer
applies.

---

## 4. Accessibility and the house rules

### 4.1 The ones stated in the brief, and how each is met

**Autoplay is off.** `preload="none"`, no `autoplay`, no `muted` autostart.
`preload="none"` is not a nicety: it is what stops thirteen law pages from
each pulling a megabyte of metadata on a phone. A person who does not press
play transfers zero bytes of film.

**Captions are not optional.** A `<track kind="captions" srclang="en"
default>` per film, WebVTT, default on. This is the item most likely to be
treated as a later. It cannot be: eight films whose content nobody in this
project has seen are eight files whose content nobody can search, quote,
correct against the codex or check against `BOOK-ERRATA.md`. The caption file
is the only readable form of the footage and it is the only thing that makes
the film auditable against the engine. Writing them requires watching the
films, which nobody has done, so this is a real cost and it belongs in the
sizing rather than in a promise.

A second reason the captions are load bearing here: `BOOK-ERRATA.md` exists
because the codex and the engine disagree in places. Eight films are eight
more sources that can disagree with the engine, and without a transcript there
is no way to find out.

**A control is never a dead end.** Three separate places, all measured:
- The absent file case, 3.6 case two. Not a dead play button.
- The Close round trip at 390, 1.7. The law page with a back control at
  document position one is the fix.
- The end of a film. When it finishes it does not sit on a black frame. The
  next control is the one in 3.5 item 7.

**44 by 44.** Measured: zero elements under the floor inside `#know` today at
either width. Native video controls on a 374 wide phone column do not clear
44 on every button. So the first play control is ours, 44 minimum, and native
controls appear after play starts. The first press is the one that must be
reachable with a thumb.

**No all caps. Title Case headers, sentence case bodies.** The law name is a
header and takes Title Case. The stylesheet already transforms `.kb-h`, so
whatever renders in the header position inherits it, and a film title written
in caps in a file name is not the title that renders.

**No em dashes.** `BUILD.sh` checks the whole build. A caption file is not in
the build and would not be checked, so if captions ship as companion files the
em dash check has to reach them or the rule quietly stops applying to the one
place a lot of new prose lands.

**No soft wellness language.** Applies to the film's own copy, its caption
text and the one line description. It is the highest risk in this whole piece
of work, because eight films made outside this repository were not written
against this register and I cannot check whether they hold it.

### 4.2 A film is a thing with a name, so it has an icon, a family and a colour

The family is the axis, which is the rule `HARM_FAM` already follows and the
comment in `engine/data/kb.js` argues line by line. Laws of Nature is Crown.
So every film on this axis is Crown coloured and that is correct: the film
belongs to the law, and the law's family is the axis.

The icon is the one genuinely new mark. `HARM_FAM.nature.ic` is the returning
wave and all thirteen cards wear it, which means it identifies the axis and
not the film. A film needs its own mark for the subtitle affordance and the
play control. Ring, not fill, per the house rule. A triangle in a ring is the
obvious play mark and it is a fill in every product that ships it, so the
ring version is a triangle outline inside a ring outline. That is one new path
in the icon set and it should be argued the way the others in `kb.js` are,
with a comment saying what it is a picture of.

### 4.3 Four more the brief did not name and I will not leave out

**Reduced motion.** `REDUCED` already exists at `ui/component.js` line 299 and
`ui/drills.js` line 16 already reads it. A film is the largest piece of motion
this product would ever contain. `REDUCED` does not mean no video, it means no
autoplay under any future circumstance, no animated poster, and no motion in
the transition onto the law page.

**Keyboard.** `.kb-c` is a `<button>` so the deck is already keyboard
reachable. The law page must keep that: back control focusable and first,
focus moving to the page heading on open and back to the originating card on
close. The current drill does not manage focus at all, and today that is a
small sin because the payload is 76 characters. On a page with a film it is
not small.

**Audio in a room with other people.** Sofia takes this at eleven at night.
Derek at a gym. Nkem on a night shift. A film that starts with sound is a film
watched once. Captions default on is half the answer and the other half is
that the play control does not start audio without the person having seen the
volume state.

**The bandwidth warning.** If companion files ship, the first play on a page
should say the size once. Not a modal, one line beside the control: "Film,
3.4 MB." That is the "estimate and a way to leave" floor met at the only
moment it can be met, which is before the transfer starts rather than during
it.

---

## 5. The ICP passes

### 5.1 How many I ran, and it is not a hundred

**I ran 48 passes. The owner asked for 100.** A hundred structured walks
through a surface that does not exist yet would be 52 passes of padding, and a
count I could not show working for is worth less than no count.

The 48:

    round 1   placement comparison      6 ICPs x 4 placements     24
    round 2   the recommendation walked 9 roster x 2 widths       18
    round 3   the five laws with no film 6 ICPs                    6
                                                                  48

Round 2 uses all nine of the roster including the three edge cases, because
Gordon and Rosa refusing is a result and Ana arriving in crisis is a result.

Every pass is a walk through the real build at the real measurements in
section 1, with the judgement half written by me and labelled as simulated.
**Nothing below was said by a real person.** The roster is
`atuned_src/engine/data/people.js` and the reactions follow each person's
`says` line and charge vector, the same method as `RESEARCH-icp.md`.

### 5.2 Where the roster actually sits, computed

I computed each member's reading rather than assuming a level, by calling
`loadP(i)` then `compute()` in the live build and reading `CQ` and `tier`.
The buyer grid is `BUYERS.md`.

    who      age  CQ   tier         held   grid level and buying probability
    Sofia     41  57   Even            0   6  Receptive     65 percent
    Angela    36  41   Incoherent      0   5  Searching     30 percent
    Marcus    44  39   Incoherent      0   4  Frustrated    40 percent
    Diane     46  29   Corrupt         8   3  Defensive     20 percent
    Derek     39  15   Severe         20   2  Numb          10 percent
    James     57  13   Severe         18   2  Numb          10 percent
    Ana       47   8   Collapsed      41   1  Fragmented     0 percent
    Rosa      61 100   Mastery         0  10  Sovereign    100 percent
    Gordon    58   1   Collapsed      97   1  Fragmented     0 percent

**This is the most important thing in section 5 and it is not about film
placement.** Five of the six ICPs compute to grid levels 2 through 5. Not one
ICP reaches 8, 9 or 10, where `BUYERS.md` says the product sells hardest. The
roster is sitting in the collapsed middle of the curve.

That changes the case for film from a nice to have into an argument. The grid
says level 5 "wants magic, not mechanics. Abandons the codex on realising it
asks for objective physical work", and level 4 "buys it, reads half, avoids
the physical practice". A four minute film is the one format a level 4
finishes and the one register in which a level 5 will accept mechanics. The
76 character drill is the opposite of both.

### 5.3 Round 1. Four placements, six ICPs, 24 passes

The four:

    P1   a Films deck, a thirteenth section tab
    P2   a poster and a play control on the card in the existing deck
    P3   the film inside the existing right rail drill
    P4   hold the films until the restructure is built

Each cell is where that person stops, or what they do.

| | P1 Films deck | P2 on the card | P3 in the drill | P4 wait |
|---|---|---|---|---|
| **Sofia** 57, level 6 | opens it, watches two, never returns to the codex | scrolls past, reads them as stock footage | at 390 loses the codex, closes, gives up | fine with waiting, she is patient |
| **Angela** 41, level 5 | goes straight there and stays. Films become the product | plays the first, does not read one card | watches, closes, lands on empty screen | leaves. She needs the magic register now |
| **Marcus** 39, level 4 | four seconds, closes tab. A video tab reads as marketing | thirteen thumbnails read as a template | 298px player, he is gone | fine. He was not going to watch anyway |
| **Diane** 29, level 3 | ignores. She does not have eight minutes | ignores, scanning for a number | ignores | no change |
| **Derek** 15, level 2 | looks for the shortest one, watches it, wants output | scans for a duration and finds none | audio starts, he is at a gym, stops | no change |
| **James** 13, level 2 | watches nothing. Reads. | nothing | nothing | no change |

Stops named, by placement:

- **P1, a Films deck.** Two distinct failures at opposite ends. Angela and
  Sofia go there and never come back to the 384 cards, so the films cannibalise
  the codex. Marcus reads a video tab as marketing in four seconds, which is
  his own stated speed and his own stated verdict. P1 also breaks the
  structural rule in 3.1. **Rejected.**
- **P2, on the card.** Nobody is helped and three are harmed. Marcus's
  "template" read is the fatal one: a deck of thumbnails is the single most
  generic thing this product could render, and he told us in `RESEARCH-icp.md`
  that a dashboard look closes the tab. **Rejected.**
- **P3, in the drill.** Every phone pass ends in the dead end measured at 1.7.
  Derek's is the one that is not about geometry: audio in a public place with
  no warning. **Rejected.**
- **P4, wait.** Costs nothing and loses Angela, who is the ICP with the least
  patience and the one the grid says is hardest to hold. **Rejected as a
  standalone**, and it is not what section 2.8 recommends: E ships the page
  now, which is not waiting.

**What round 1 changed.** Three things.

1. The film must not be reachable without passing through the law. P1 proved
   it with Angela and Sofia: given a door to the films, they stop using the
   codex. That is what put 3.1 in its final form.
2. Duration has to be on the control before the press. Derek looked for it in
   two of four placements and did not find it, because the product does not
   know it. Nobody has watched the films, so nobody knows how long they are.
   This is now a blocker on shipping a play control and it is in section 6.
3. Marcus killed the thumbnail grid on his own. The affordance is a word, not
   a picture. That is 3.4.

### 5.4 Round 2. The recommendation, nine people, two widths, 18 passes

The recommendation from 2.8 and 3.5: the law page on the centre stage, film at
item 4, back control at item 1, next and previous at item 7.

At 1600, all nine:

- **Sofia** reaches the page in three taps, watches, uses next to walk to All
  Is Motion. *No change.* This is the pass the design was drawn for.
- **Angela** watches four in a row using next. Stops at E04 All Fields
  Correspond, which has no film, and the page does not mention it. She reads
  the paragraph instead. *This is the pass that validates 3.6 case three.*
  Silence worked. If the page had said "no film for this law" she would have
  read it as the run ending.
- **Marcus** reads the paragraph, does not press play, uses next twice, leaves.
  *Change: the paragraph is not a caption under the film, it is the page.*
  Marcus never presses play in any pass at any width. A design where the
  paragraph is subordinate to the film loses him entirely, and he is 160 of the
  panel weight in `RESEARCH-icp.md`.
- **Diane** arrives from search, not from the deck. Types "polarity" in `#kbq`.
  *Change: search must land on the law page, not on the deck with the card
  highlighted.* `kbOpen` already routes from a search result, so this is
  behaviour to preserve rather than build, but it has to be preserved
  deliberately because the deck to page move is where it would break.
- **Derek** looks for the duration, finds it now, picks the 1.1 MB one.
  *Change: he picked by file size because size was the only number offered.*
  That is the wrong axis. A person choosing the shortest film about
  compensation because it is 1.1 MB is choosing a download, not a law. Show
  duration, not bytes, on the control. Show bytes only in the one line warning
  in 4.3.
- **James** reads, does not watch, uses no control. *No change.* He is the
  case for the page being complete without the film, which is 2.8 move one.
- **Ana** CQ 8, 41 addresses held. Opens Polarity because the word matched
  something in her reading. *Change, and it is the one I did not expect.* Item
  6 of the page, "where it sits in you", is rendered for her and not for
  Sofia, who holds nothing. A person in crisis reading a universal law and
  being shown their own charge against it is a different experience from a
  person reading a reference. That item needs the same silence rule as case
  three: absent when there is no reading, and never a zero.
- **Rosa** CQ 100, holds nothing. Reads one, finds it true and unremarkable.
  *No change.*
- **Gordon** CQ 1, 97 addresses held, refuses the frame. Never arrives.
  *No change.* Correctly.

At 390, all nine, and this is where the work is:

- **Every one of the nine is blocked before the surface.** `#tabbar` truncates
  and Knowledge is at x 407 (1.7). Not one of the nine reaches the knowledge
  base on a phone. *Change: the tab bar fix is a hard dependency of this
  work, not a neighbour of it.* Placing a film on a surface that half the
  product's sessions cannot reach is placing it nowhere.
- Walking them past that block by script, the page itself holds at 374 wide:
  one column, document order is phone order, film at 374 by 210, back control
  first.
- **Sofia** at eleven at night, in bed. *Change: audio.* She is the pass that
  turns 4.3's audio note from a nicety into a requirement. Captions default on
  and no sound until she has seen the volume state.
- **Angela** on cellular. *Change: the one line size warning in 4.3 is not
  optional on a phone.* 3.4 MB for All Is One is a real amount of somebody's
  data plan and she is the ICP most likely to press play on all eight.
- **Derek** at a gym on a weak signal. 3.4 MB at 4 Mbit is 6.8 seconds for one
  film, which is inside the floor with a spinner. The film is fine. The
  21.7 MB monolith of option A would have been 43 seconds before the app
  existed, and this is the pass that makes 2.6 concrete rather than
  arithmetical.
- **Marcus, Diane, James, Ana, Rosa, Gordon** at 390: no change beyond the tab
  bar block. Marcus and James do not press play at either width, which is
  consistent and is the argument for the page over the film.

**What round 2 changed.** Five things: the paragraph is the page and the film
is in it, search must land on the page, duration replaces bytes on the
control, item 6 takes the silence rule, and the tab bar truncation is promoted
from a neighbouring defect to a dependency.

### 5.5 Round 3. The five laws with no film, six ICPs, 6 passes

Tested against 3.6 case three, silence, versus the errata's instinct, a line
saying there is none.

- **Sofia.** Silence. Does not notice. Reads the paragraph.
- **Angela.** Silence, and it matters. Covered in 5.4. A line saying "no film"
  reads to her as the sequence breaking.
- **Marcus.** Indifferent. He never pressed play.
- **Diane.** Indifferent.
- **Derek.** *The one who catches it.* He walks E10, E11, E12, E13 with next
  and hits three silent pages in a row at the end of the axis. Silence stops
  being silence and becomes an absence. *Change: the run of three at the end
  of the axis needs handling that the pair in the middle does not.* Either the
  deck's subtitle carries enough signal that he never expected film there, or
  the axis is not walked in code order at the end.
- **James.** Indifferent.

**What round 3 changed.** One thing, and it is the one the errata could not
see from the file names: the two gaps are not equivalent. E04 and E05 are a
pair surrounded by film and nobody notices. E11 to E13 are a terminal run and
one person in six notices hard. Silence is right for both, and the terminal
run needs the deck to have told the truth first, which 3.4's subtitle does.

### 5.6 What the 48 did not test

The footage. Every pass above assumes eight films that explain a law in a few
minutes in this product's register. If they are something else, rounds 1 to 3
are about a placement for a thing that is not there. The first person to watch
one should re-run round 2 before a frame is edited.

---

## 6. Sizing

S is under a day, M is a few days, L is a week or more, in this project's
usual scale.

### 6.1 The work, in dependency order

**0. The tab bar truncation at 390.** `ui/ui.js`, `shell/body.html`,
`shell/head.html`
Four of eight doors past the right edge, no page scroll to reach them,
measured at 1.7. Knowledge is one of the four. **This blocks everything else
in this document on a phone.**
Gates: `tests/design.js` gate 8, `tests/functional.js`, `tools/monitor.js` at
390, `tools/shots.js` at 390 and look at the images.
*Medium. Not mine to scope here; `PLAN.md` block 18 owns it.*

**1. The law page replaces the right rail drill for `harm` rows.**
`ui/knowledge.js`, `ui/drills.js`
The 76 character payload onto the centre stage, back control first, next and
previous, focus management. Fixes the 390 dead end for all 76 universal laws.
No bytes added, no film.
Gates: `BUILD.sh`, `tests/functional.js` (a new assertion that `#knowbody`
holds the law page and `.kb-grid` is gone while it is open), `tests/design.js`
gate 8, `tools/monitor.js`, `tools/shots.js` at both widths.
*Medium. This is move one of 2.8 and it is the piece I would ship next.*

**2. The paragraph per law.** `engine/data/kb.js`
Item 5 of the page and the body line on the card, 3.4. Thirteen paragraphs for
Nature, 76 for the whole table if the restructure follows. Every sentence has
to come from the codex and hold the register.
Gates: `tools/equiv.py old.html source.html` because `kb.js` is a data table,
`python3 tools/terms.py`, `BUILD.sh` em dash check.
*Large for all 76. Medium for the thirteen Laws of Nature alone, which is the
useful unit and is what unblocks the films.*

**3. The three name conflicts and the E07 or E08 swap.** `engine/data/kb.js`,
`BOOK-ERRATA.md`
Owner's ruling first, then one edit. The file names carry the swap, so this is
upstream of naming a single file.
Gates: `tools/equiv.py`, `tests/engine.js`.
*Small once ruled. Blocked on him.*

**4. The film slot, declared and empty.** `ui/knowledge.js`,
`engine/data/kb.js`
A `film` field per HARM row, present on eight, absent on five. The slot
renders case two, the honest absent line, for all eight until files exist. Zero
bytes.
Gates: `BUILD.sh`, `tests/functional.js`, `tests/design.js` gate 7 unchanged
because nothing is requested yet.
*Small.*

**5. Companion files, the play control and the absent detection.**
`ui/knowledge.js`, `tests/design.js`, `atuned_src/BUILD.sh`
Relative `src`, `preload="none"`, our own 44 by 44 first play control, native
controls after, `error.code === 4` fallback, the one line size warning, the new
play mark.
Gate 7 must be widened deliberately and must stop discarding `file:` URLs, per
2.3. `BUILD.sh` must reach the caption files for the em dash check, per 4.1.
Handover changes from one attachment to a folder, against the `CLAUDE.md`
ruling, and that needs saying out loud when it is proposed.
Gates: `tests/design.js` 7 and 8, `tests/functional.js`, `tools/monitor.js`,
`tools/shots.js` at both widths.
*Medium, and blocked on the owner's ruling from 2.8.*

**6. Captions.** eight `.vtt` files, new
Requires watching eight films nobody has watched. It is the only readable form
of the footage and the only way the films can be checked against the engine and
`BOOK-ERRATA.md`.
Gates: whatever gate is added in item 5 to reach them for the em dash and
register checks.
*Large, and it is large because of the watching, not the writing.*

**7. Duration on the control.** `engine/data/kb.js`
One number per film. Cannot be read without the footage. Round 1 made it a
blocker on shipping a play control at all.
*Small once somebody with the files reads eight durations off them.*

**8. A poster per film.** eight images, new
Cannot be produced in this container. Needs ffmpeg and the footage. Costed in
2.7 option D at 13 to 23 percent of the build if embedded, or zero if the
posters ship as companion files with the mp4s.
*Small for whoever has the files. Not doable here.*

### 6.2 The one that is not a task

Ninety five simultaneous choices on the Knowledge surface at 1600, measured in
1.6, against a working target of under 12. Sixty two of them are the left rail
before the codex has said anything. Moving the drill to the centre stage
changes none of it. That is the architectural item already named in
`CLAUDE.md` as needing a decision first, and every screen in this document
inherits it.

---

## 7. What the owner has to rule before anybody edits a frame

1. **Embed, companion files, or the record store.** Section 2.7 and 2.8. Real
   numbers on all five options. My recommendation is E then C and it breaks
   the one attachment handover, which is his ruling to break.
2. **The three names.** Unified Field or All Is One. Vibration or All Is
   Motion. Balance or Compensation, and if Balance, what happens to the
   Balance strip under the wheel.
3. **The swap.** Film 7 is Cause and Effect, engine E07 is Transmutation. One
   moves.
4. **Whether anybody watches one before the placement is built.** Nobody in
   this project has seen a frame. Section 5.6 says what that invalidates.

---

## 8. Corrections to the record, for whoever updates it

- `CLAUDE.md` says Games is folded into Knowledge. It is not. `#games` is
  parented to `#stage` and has its own tab. `engine/core.js` line 92 records
  the reversal. The bar is eight.
- `BOOK-ERRATA.md` item 16 lists four laws with two names. It is three.
  Commit `1f0c93b` fixed the `Inspired Act.` truncation and the built file now
  reads `Inspired Action`, which matches film 6 exactly. The same commit fixed
  a second truncation the errata did not name, E63 `Disgust · Acc.` to
  `Disgust · Acceptance`, which is not a film question but is the same defect.
- `BOOK-ERRATA.md` item 15 says two laws have no film. Five do: E04, E05, E11,
  E12, E13. The Laws of Nature axis is thirteen entries, not ten.
- `tests/design.js` gate 7 does not catch a sibling media file at `file://`.
  Measured in 2.3. The gate is passing something it is meant to be watching.
