# THE KNOWLEDGE BASE

Five passes with the art director, the creative director, UI UX and the
writing team, on the surface he opened and did not like.

    Read against      commit b0e18db, engine.js md5 caa5c9dd
    Re-read against   commit 8913431, source.html md5 84334db9,
                      engine.js md5 2eef5bc0
    Tree              moving while this was written. Another seat landed the
                      33 saboteur port into canon.js and lexicon.js partway
                      through. EVERY FIGURE BELOW WAS TAKEN TWICE, once on
                      each build. All of them reproduced except one: the
                      saboteurs above zero on Diane went from 7 to 9, which is
                      that port working. The row counts, the character counts,
                      the 78 percent share, the fold counts and the contrast
                      ratios are identical on both.
    Measured with     /opt/pw-browsers/chromium-1194, 1600x1000 and 390x844
    Profiles          Diane, Marcus, Gordon, loaded through the engine
    Prototypes        proto/kb/, seven runnable pages, no network, no siblings
    Harness           the generators in the session scratchpad read engine.js
                      directly, so no figure below was typed in by hand
    Date              2026-09-20

His note, which is the brief:

> "For knowledge, if I click on anything in the centre, that centre page
> should take me to all the information I need, like the centre display area.
> So if I go to the knowledge base and I click on fear, okay, so then what I
> am really seeing is that these icons are huge and just taking up too much
> space. So review the knowledge base page five times with the art director,
> creative director, UI UX, and writing team.
>
> So right now we have got fear, root, lumbar plexus, axis fear. That text is
> eating up valuable real estate. And so what we need to see is just these
> atomised: the icon, the percent it is impacting you, and the word, and the
> chakra that is associated with it. That will allow us to reclaim a bunch of
> space from these fetters, or from the nodes.
>
> Same thing goes with the fetters. I do not know the difference between a
> node and a fetter the way you are using it. A fetter is a node. The fetters
> are the 108. Which you listed here between fear, anger, shame, these are the
> nine child emotions. Very different.
>
> So this is going to be the same logic. Positive intelligence, three
> addresses, positive intelligence, three addresses. Yeah, I do not want any
> subtext that goes in all the information. This should be mainly icon,
> percent you actually do it, and what it is associated with, like rigidity or
> collapse.
>
> The universal laws need to be in order, because it is a flow. So the laws,
> it just says laws, that should be moral integrity. Everything should have a
> percent. Everything should be icon dominant, since we are focused on the
> icons. Focus on symbolic meaning."

---

## WHAT IS THERE NOW, MEASURED

Every figure in this section came off the built file in a real browser, or
off `engine.js` in node. None of it is an impression.

### The Page He Was Looking At

He was on the Fetters deck with Diane loaded. This is the card he described,
measured in the DOM rather than read out of the stylesheet.

| | at 1600x1000 | at 390x844 |
|---|---|---|
| app chrome above the centre column | 104 px | 267 px |
| the codex's own header | 288 px | 381 px |
| so the first card starts at | **392 px** | **648 px** |
| fold left for cards | 608 px of 1000 | **196 px of 844** |
| card height | 150 px, 166 with a live badge | 150 px |
| columns | 3 | 1 |
| **cards fully above the fold** | **12** | **1** |
| full scroll height, Nodes deck | 6,173 px | 18,043 px |

At 390 the codex spends 648 of 844 pixels, **77 percent of the phone**, before
it shows one entry. The one entry it then shows reads

    Fear
    Root
    Lumbar Plexus, axis Fear

which is his quote, verbatim, off the screen.

The Nodes deck is 18,043 pixels tall on a phone. That is **21.4 screens** to
walk 108 things.

### The Icon Is Not Dominant. It Is One Percent Of The Card.

He said the icons are huge and taking up too much space. Measured, the
opposite is true and it is the same defect: the icon is tiny and the card
around it is huge.

| | measured |
|---|---|
| the glyph | 19 x 19 px, inside a 24 x 24 box |
| the card | 236 x 150 px at 1600, 358 x 150 at 390 |
| glyph area as a share of the card | **0.9 percent** at 1600, **0.7 percent** at 390 |
| with a live reading, the badge block | 58 x 42 px, a 34 px ring and a 32 x 16.5 pill |
| that block as a share of the card | 4.8 percent |

So the mark occupies one hundredth of the object it is supposed to dominate,
and it takes a full 24 to 42 pixel band across the card to deliver it. That
band is what he is seeing. **Sol found it:** the icon row is spending the
height of a headline to deliver the ink of a bullet.

### The Subtext, Counted

`kbRows()` builds 384 rows across twelve decks. Every one of them carries a
`d` field that renders as `.kb-cd`, three lines clamped.

    384 rows
    26,593 characters of subtext
     3,472 characters of seat and kind
     3,817 characters of name
    subtext is 78 percent of every character on the page

Per deck, on Diane, median characters of subtext per row:

| deck | rows | median subtext | worst row | distinct subtexts |
|---|---|---|---|---|
| Nodes | 108 | 28 | 42 | 106 |
| Fetters | 9 | 47 | 58 | 9 |
| Saboteurs | 39 | 47 | 47 | **9** |
| Laws | 21 | 19 | 21 | **7** |
| Masks | 6 | 41 | 41 | 5 |
| Domains | 19 | 31 | 41 | 19 |
| Archetypes | 12 | 19 | 22 | 12 |
| Gates | 6 | 38 | 52 | 6 |
| The cards | 25 | 67 | 120 | 25 |
| The stack | 7 | **386** | 438 | 7 |
| Universal laws | 76 | 33 | 37 | 76 |
| Glossary | 56 | **213** | 504 | 56 |

### The Repetition He Named

He quoted "positive intelligence, three addresses, positive intelligence,
three addresses." Counted on the Saboteurs deck: **39 rows, 9 distinct
subtexts.**

     9x  inferred from the connection types, 3 addresses
     7x  Positive Intelligence, 3 addresses
     7x  SOURCE library, 3 addresses
     6x  inferred from the connection types, 2 addresses
     4x  inferred from the connection types, 5 addresses
     2x  inferred from the connection types, 4 addresses
     2x  inferred from the connection types, 1 addresses
     1x  inferred from the connection types, 8 addresses
     1x  inferred from the connection types, 6 addresses

Twelve cards are visible at 1600. Ten of the twelve print one of two strings.
The last line also has a grammar defect on two rows, "1 addresses".

The Laws deck is worse in kind. 21 rows, **7 distinct subtexts**, and all
seven are the seat printed a second time:

     4x  seated at the heart        with "Heart" already on the line above
     4x  seated at the solar
     3x  seated at the throat
     3x  seated at the crown
     3x  seated at the 3rd eye
     2x  seated at the sacral
     2x  seated at the root

Twenty one law cards spend their third line restating their second line as a
sentence. **Bjorn found it.**

And on the Nodes deck three rows print their own name inside their own
subtext: `Fear / Lumbar Plexus, axis Fear`, `Shame / Pudendal Nerve, axis
Shame`, `Anger / Celiac Plexus, axis Anger`. The one he quoted is one of the
three.

### Nothing Has A Percent, And What It Has Is Not A Percent

| profile | rows printing a figure |
|---|---|
| Diane | 100 of 384, **26 percent** |
| Marcus | 92 of 384, **24 percent** |
| Gordon | 189 of 384, 49 percent |

Three quarters of the codex prints no number at all for a person who has
entered a full profile.

And where it does print one, it prints two units on one mark. `crBadge` takes
`pct` for the arc and `raw` for the figure: the ring is drawn at `sq * 10`, a
percentage, and the pill beside it prints `6.0`, a tenth scale. Same mark,
two scales, and nothing on the card says what either is out of. That is
`DESIGN.md` Law 5 failing on 100 of 384 rows.

### Press A Thing And The Answer Lands Somewhere Else

He asked for the centre to be the destination. Measured: pressing the Fear
card in the centre calls `kbOpen`, which calls `runFetterDrill`, which calls
`rdShell`, which writes into `#rdrill`. `#rdrill` sits inside
`<div class="lsec" data-rail="right">`.

| | at 1600 | at 390 |
|---|---|---|
| where the answer renders | the right rail | the right rail |
| rail width | 298 px, **19 percent of the screen** | 346 px |
| centre width, still showing the deck he left | 884 px, 55 percent | 374 px |
| eye travel from the thing pressed to the answer | about 900 px right | a full column jump |

So the press happens on the left, the answer appears on the right, and the
55 percent of the screen in the middle keeps showing the list. **Petra found
it.** He is describing this exactly: "that centre page should take me to all
the information I need, like the centre display area."

### The Squint

From six feet, eyes half closed, the codex is a field of identical grey
rectangles with a three pixel coloured line on top of each. The eye lands on
the headline, then the search field, then stops. Twelve equal rectangles of
equal weight say "none of these matters more than another", on the one page
whose job is to show which of these is running in the person looking at it.
**Mika.** That ordering is wrong and nothing below it can fix it.

---

## THE TERMINOLOGY AUDIT

**He is right, and the product's own glossary agrees with him in writing.**

`engine/data/kb.js`, the Fetter entry:

> "A named conditional response pattern resident at a specific node address.
> 108 fetters in the body, one per physical node."

and the Node entry:

> "An address in the body's energetic architecture. 108 physical nodes in the
> body. 4 field nodes just outside it."

So the glossary says a fetter is what sits at a node, one per node, 108 of
them. And then the code names the nine poled axes `CHILD` and every comment
in the repository calls them the nine child fetters. **The word carries the
108 and the 9 at once.** That is the standing one word per concept rule
broken in the one table that exists to define words.

It is visible on screen. The Knowledge tab has a deck called **Nodes** that
lists exactly the 108 that the glossary calls fetters, and a deck called
**Fetters** that lists the 9. A person reading the glossary and then reading
the tabs is told two incompatible things.

### The Counts

Taken on commit 8913431, across `atuned_src/engine`, `atuned_src/ui` and
`atuned_src/shell`.

| | count |
|---|---|
| occurrences of the string "fetter", any case | **145** |
| files containing it | 29 |
| user visible strings containing it | **22** |
| code identifiers carrying the nine sense | 10 |
| occurrences that are comments or prose | 113 |

### Which Sense, Where

**The nine sense. This is what has to move.** The word means one of `CHILD`.

| site | what it says |
|---|---|
| `ui/knowledge.js:152` | `['fetter','Fetters']`, the deck label over the nine |
| `ui/knowledge.js:39` | `if(sec==='fetter') CHILD.forEach(...)` |
| `ui/knowledge.js:225` | `KIND={...fetter:'Fetter'...}`, the search result label |
| `ui/knowledge.js:191` | the search placeholder, "addresses, fetters, saboteurs" |
| `ui/knowledge.js:307` | `if(x.k==='fetter'){runFetterDrill(...)}` |
| `ui/ui.js:369` | `['fet','Fetters',CHILD.length,...]`, the right rail stack tab |
| `ui/drills.js:385` | `<div class="pm-eye">Child fetter</div>`, the drill eyebrow |
| `ui/drills.js:252` | "Each child fetter has a coherent opposite" |
| `ui/drills.js:67` | "named for its seat and its fetter" |
| `ui/personas.js:20` | "Columns are domains, rows are child fetters" |
| `ui/games.js:210` | "Eight pairs of fetter marks, face down" |
| `ui/wheel.js:146` | `'every fetter named'` / `'the fetters'` |
| `ui/imprints.js:56` | "the seat's modal fetter" |
| `ui/mapshelf.js:71` | "one held address and its own fetter" |
| `shell/body.html:336` | `<span>Fetters</span>`, the left rail section heading |
| `shell/body.html:342` | `4 · Fetters`, with the subtitle already hedging to "nine feelings" |
| `shell/body.html:355` | `19 domains × 9 child fetters` |
| `engine/plan.js:81` | `LEAD_SEES=['fetters','saboteurs',...]` |
| `engine/data/practice.js:121` | `PML=[['bands','Fetters'],...]` |
| `engine/data/cards.js:104` | `C3_HEAD=['region','primary nerves','fetters',...]` |
| `engine/lexicon.js:271` | "states the fetter X, which is not one of the nine axes" |
| `engine/schema.js:18` | `axes:{}` with the comment "nine poled child fetters" |

**The 108 sense. This is what the word should mean and already does in one
place.** `engine/data/kb.js:19`, the GLOSS Fetter entry, and the Nodes deck
which lists them.

**The transient object key.** `engine/sniff.js:316` and `:332` write
`fetter:` into an imprint record and `ui/release.js:97` writes it into
`RUN.log`. Both hold one of the nine.

### The Rename, Specified

**One word per concept, his ruling applied.**

    a fetter      is one of the 108 named patterns at a node address
    a node        is the address the fetter sits at
    a child emotion  is one of the nine poled axes

Three changes, and they are all display and comment. The persisted schema key
for the nine is `axes:{}`, not `fetter`, so **the rename does not touch a
saved profile and needs no schema bump.**

**1. The nine stop being called fetters.** Every site in the table above
takes "child emotion" or "emotion", singular where it is singular. The deck
label `['fetter','Fetters']` becomes `['fetter','Child emotions']`. The rail
heading becomes "Child emotions" and its subtitle, which already says "nine
feelings", becomes redundant and goes.

**2. The Nodes deck becomes the Fetters deck.** It already lists the 108 that
the glossary defines as fetters. The label changes, the contents do not.
`['addr','Nodes']` becomes `['addr','Fetters']`, and `KIND.node` becomes
`'Fetter'`.

**3. The word "node" keeps its own meaning,** which the glossary already
gives it: the address. It stays in the drill copy where it means the place
rather than the pattern.

**What must not change.** `k:'fetter'` as the section key, `x.k==='fetter'`,
`runFetterDrill`, `STACK_TAB='fet'`, `data-sec="fetters"`, `im.fetter` and
`RUN.log[].fetter`. These are identity, not display. Renaming them buys
nothing and risks the same class of failure the TAB integers rule exists to
prevent. **The word a person reads moves. The key does not.**

### The Blast Radius, Counted

| | count |
|---|---|
| files that must change | **19** |
| user visible strings to edit | **22** |
| code identifiers to leave alone | 10 |
| comments to follow, for the next reader | 113 |
| persisted keys affected | **0** |
| schema bump needed | **no** |
| gates that assert the old word | 0, checked against `tests/` |

The 113 comments are not optional in a repository that reads its own
comments as the record. They are one pass with a careful eye and no risk.

**I have not renamed anything.** It crosses `atuned_src/`, `source.html` and
`engine.js`, none of which I hold. This section is written to be executed
from.

### And One More Collision The Audit Turned Up

**Twenty one rows appear in two decks at once.** The Laws deck is `SI`, 21
rows. The Universal laws deck is `HARM`, 76 rows, of which the 21 on the
`spirit` axis are, by name, the same 21. Same name, same icon, same seat,
same percent, under two tab labels. Checked by set intersection:

    rows in both decks: 21 of 21
    Truth, Transparency, Unity, Awareness, Presence, Equanimity, Compassion,
    Forgiveness, Courage, Temperance, Duty, Accountability, Justice,
    Non-Harm, Responsibility, Humility, Generosity, Detachment, Patience,
    Aesthetic Beauty, Nature

That is the same thing in two places, which is the defect one word per
concept exists to stop, in its numeric form.

---

## THE FIVE PASSES

Five attempts at the row and the page. Each one is a runnable page in
`proto/kb/`, each was shot at 1600x1000 and 390x844, and the rows above the
fold were counted in the shot rather than predicted.

All six pages draw from the same generated blob, which reads `engine.js`
directly for Diane, Marcus and Gordon. Nothing in them is typed in.

`proto/kb/now.html` is the baseline: the shipping card, rebuilt from the same
tables, so the comparison is like for like.

**One measurement applies to every pass and is the reason pass 5 exists.**
The prototype pages carry their own note bar; the app carries its own chrome.
Measured, the app's chrome above the centre column is 104 px at 1600 and
**267 px at 390**. So a pass is judged on its codex header plus that chrome.

| pass | codex header, 1600 | header, 390 | fold left at 390 |
|---|---|---|---|
| now | 310 | 452 | 125 px |
| 1 | 513 | 611 | **minus 34 px** |
| 2 | 513 | 611 | **minus 34 px** |
| 3 | 539 | 661 | **minus 84 px** |
| 4 | 513 | 611 | **minus 34 px** |
| 5 | **154** | **226** | 351 px |

Passes 1 to 4 keep the shipping header: the eyebrow, the headline, the
paragraph, the search field, and twelve tab chips that wrap to two rows. On a
phone that header plus the app's own chrome is 878 pixels on an 844 pixel
screen. **Nothing is above the fold at all.** Four passes improved the row
and none of them reached the phone, which is the finding that made pass 5
about the header first and the row second.

### Pass 1. Delete The Subtext, Keep The Card

`proto/kb/pass1.html`. Bjorn's pass, and the literal reading of his note.
`.kb-cd` is removed, the percent comes in as a figure at the top right, the
card's minimum height drops from 150 to 88.

**Fixed.** The repetition is gone. Card height 150 to 99 measured, a 34
percent saving. Every row prints a percent or an en dash. Scroll height on
the Nodes deck falls from 6,173 to 4,540 at 1600, from 18,043 to 12,682 at
390.

**Broke, or did not fix.** Rows above the fold at 1600: **12, unchanged.**
The saving went into the gap between cards and the wrapped tab strip, not
into rows. At 390: **1, unchanged.** The icon is still 1.3 percent of the
card. And a 236 pixel wide container holding a five letter word is still a
container pretending four facts need one.

**Grade: D plus.** It removes the thing he complained about and delivers
nothing he asked for.

### Pass 2. The Card Becomes A Line

`proto/kb/pass2.html`. Petra's pass. Four facts is a line, not a container.
24 px mark, name, seat, percent right aligned, a hairline rule, 44 px high,
three columns.

**Fixed.** Rows above the fold at 1600: **12 to 30**, 2.5x. Row height 150 to
44. Scroll height on Nodes 6,173 to 2,140 at 1600, 18,043 to 5,470 at 390.
The icon share rises to 2.4 percent.

**Broke.** It is a table. `ui/knowledge.js` argues against exactly this in its
own header, and the argument is right: "a row in a list is a line of text with
a hit area. It says there are many of these and none of them is special." He
asked for icon dominant and this is text dominant with a mark in front of it.
At 390 it is 2 rows above the fold, because the header is untouched.

**Grade: C.** Density solved, symbol abandoned.

### Pass 3. Icon Dominant, Literally

`proto/kb/pass3.html`. Sol's pass. Invert it. The mark is the object: a 72 px
ring whose arc is the percent, a 30 px glyph in the middle, the name under it,
no seat word at all because the ring's colour is the seat.

**Fixed.** Icon share **6.2 percent**, the highest of any pass and seven times
the baseline. It is genuinely icon dominant and it is beautiful at a distance.
The seven seat colours read as a mosaic and you learn the palette by standing
in front of it.

**Broke, and badly.**

- Rows above the fold at 1600: **14**, barely better than 12, because a 104 px
  tile is taller than a 56 px row.
- Rows above the fold at 390: **zero.** The tile grid starts at 768 of 844.
- The seat as a word is gone and colour alone is not a name. Seven colours,
  four of them cool, at 72 px, is not a distinction a person can say out loud.
  **Petra:** a symbol is a sentence and the seat is half of it. He asked for
  four things and this pass ships three.
- **And the measurement that kills it.** With the mark dominant, how many
  distinct marks a deck owns stops being a detail:

| deck | rows | distinct marks | rows per mark |
|---|---|---|---|
| **Nodes** | 108 | **7** | **15.4** |
| Child emotions | 9 | 9 | 1.0 |
| **Saboteurs** | 39 | **6** | 6.5 |
| Moral integrity | 21 | 21 | 1.0 |
| Masks | 6 | 6 | 1.0 |
| Domains | 19 | 19 | 1.0 |
| Archetypes | 12 | 12 | 1.0 |
| Gates | 6 | 6 | 1.0 |
| The stack | 7 | 7 | 1.0 |
| The cards | 25 | 12 | 2.1 |
| **Universal laws** | 76 | **27** | 2.8 |
| all eleven | 328 | 132 | 2.5 |

Five decks are one mark per name. Three are not. The Nodes deck is 108 named
things wearing seven marks, which is the house rule inverted: if it has a
name it has an icon. Make the icon dominant and you make fifteen consecutive
rows look identical.

**Grade: C minus, and it produced the best finding in the round.**

### Pass 4. Rank It

`proto/kb/pass4.html`. Mika's pass. The problem is not the row, it is that
384 rows are presented as equals when a quarter of them carry a reading. So
sort by percent, put the ones that are running at 56 px with a 40 px ring, and
drop the ones at zero to 34 px at 55 percent opacity under a rule that says
how many they are.

**Fixed.** The squint test passes for the first time. From six feet the eye
lands on the heaviest thing, then the second, then the third, which is the
order the page is for. Rows above the fold at 1600: **21 to 25** depending on
deck, because the quiet tail packs tighter.

**Broke.**

- A codex you cannot browse in its own order is not a codex. "Where is Fear"
  has no stable answer if the answer moves per person and per session.
- On a blank profile every row is zero and the whole page is tail. The app
  opens on the Field to somebody who has entered nothing, and this deck would
  greet them as one long grey list.
- **And it breaks his own ruling in the same round.** He said the universal
  laws go in order because it is a flow. A default sort by weight is the
  opposite of that.
- At 390: 2 rows. The header again.

**Grade: B minus.** Right instinct, wrong as a default.

### Pass 5. The Row

`proto/kb/pass5.html`, and `proto/kb/row.html` is its spec sheet.

The header goes first, because four passes proved the row cannot be reached
past it. The paragraph goes. The twelve tab chips stop wrapping to two rows
and scroll sideways on one. The eyebrow, the deck name and the scale sit on
one baseline. Codex header 288 to **154** at 1600, 381 to **226** at 390.

The row takes pass 2's density, pass 3's ring, pass 4's ranking as a switch
rather than a default, and pass 1's deletion. 44 px ring carrying the percent
as an arc, 20 px mark inside it, name at 15, family at 11.5, percent right
aligned and tabular, 56 px high, three columns at 1600 and one at 390.

**Measured, in the prototype, counted in the shot:**

| deck | now, 1600 | pass 5, 1600 | now, 390 | pass 5, 390 |
|---|---|---|---|---|
| Fetters, 108 today against 112 | 12 | **42** | 1 | **9** |
| Child emotions, 9 | 9, all | **9, all** | 1 | **9, all of them** |
| Saboteurs, 39 | 12 | **39, all of them** | 1 | 9 |
| Moral integrity, 21 | 12 | **21, all of them** | 1 | 9 |
| The cards, 25 | 12 | **25, all of them** | 1 | 9 |
| The stack, 7 | 7, all | 7, all | 1 | **7, all of them** |
| Universal laws, 76 | 12 | **34** | 1 | 8 |
| row height | 150 | 56 | 150 | 56 |
| icon share of the row | 0.9% | 2.4% | 0.7% | 2.0% |
| scroll height, the 108 against the 112 | 6,173 | **2,325** | 18,043 | **6,605** |

**In the app, with its own chrome instead of the prototype's note bar:** 154 +
104 = 258 at 1600, leaving 742 px, which is 13 rows per column across three
columns, **39 rows.** At 390: 226 + 267 = 493, leaving 351 px, **6 rows.**

So in the shipping app the count goes 12 to 39 at 1600 and **1 to 6 on a
phone.**

**Five whole decks now fit on one screen at 1600** where one did before: the
nine child emotions, the thirty nine saboteurs, the twenty one laws of moral
integrity, the twenty five cards and the seven seats. A person can see the
entire saboteur library without scrolling, with a percent on every row. That is
not a density improvement, it is a different kind of page. On a phone the stack
and the nine child emotions fit whole, which nothing in the codex does today.

**Three defects pass 5 shipped, and each was found by a different discipline
doing its own job rather than by looking at the page.**

1. **The percent figure was taking the seat colour.** Measured against its own
   ground: Root `#CF5953` is 4.81 to 1 on the page ground `#0C0D12`, which
   passes, and **4.17 to 1 on the panel ground `#1A1D26`**, which the row
   takes on hover. A number needs 4.5. So the Root percent dropped below AA
   the moment a person pointed at it. Fixed: the figure takes `--ink`, 16.59
   on the page and 14.39 on the panel. And it is the better design anyway,
   because the ring already carries the colour and colour then means one thing
   only. **Mika found it, by checking against the element's own ground rather
   than the page. This is the one I have been burned by before.**

   The full check, every seat against both grounds:

   | seat | hex | on page | on panel |
   |---|---|---|---|
   | Root | #CF5953 | 4.81 | **4.17** |
   | Sacral | #D19255 | 7.35 | 6.37 |
   | Solar | #D4BC70 | 10.38 | 9.00 |
   | Heart | #65CFA5 | 10.19 | 8.83 |
   | Throat | #65B8D4 | 8.65 | 7.50 |
   | 3rd Eye | #8296DB | 6.78 | 5.88 |
   | Crown | #A883D6 | 6.36 | 5.52 |

   Every seat passes 3.0 as a ring stroke, which is what a graphical object
   needs. Root alone fails 4.5 as a figure on the panel. No colour changes;
   the figure stops taking one.

2. **The fourth thing was the seat on every deck, and he did not ask for
   that.** He asked for "the chakra that is associated with it" and then, one
   sentence later, for "what it is associated with, like rigidity or
   collapse". Rigidity and Collapse are not chakras. They are the six
   architectures a saboteur belongs to. Fixed, as one rule, below.

3. **Seven seat marks were rendering as broken paths and the browser was
   saying so in the console.** `SEATGLYPH` holds finished markup, a `<path>` or
   a `<circle>`, because a seat's mark is sometimes two shapes. Every other
   table holds bare path data. The renderer assumed bare data and wrapped the
   markup in a second `<path d="...">`, so seven rings drew nothing and threw
   `Expected moveto path command` once per row. It was invisible in a
   screenshot at 1600 and obvious in the console. One emitter now reads which
   kind of string it has. **Found by reading the console, which is the thing a
   picture cannot tell you.**

**Grade: B plus, and it is the one to build.** What holds it off an A is in
the residuals at the end.

---

## THE ROW

His four things. `proto/kb/row.html` draws it at both widths with the
calipers on it.

    ( ring )  Name            42%
      mark    family

    44 px ring, 3.6 stroke, the arc is the percent, the colour is the seat
    20 px mark inside it, ring not fill, 1.7 stroke, 24 unit grid
    15 px name, --ink
    11.5 px family, --dim
    14 px percent, --ink, tabular, right aligned
    56 px row height, the whole row is the target, floor is 44

**The rule for the fourth thing, and it is one rule.**

> The fourth thing is the row's own family. Its colour is the family's seat.

For seven of the eleven decks the family is a seat and the word is the seat's
name, which is what he asked for. For three it is not, and the word says the
useful thing while the colour still says the seat, so the colour system never
bends:

| deck | the fourth thing reads | coloured by |
|---|---|---|
| Fetters, the 108 | the seat | the seat |
| Child emotions | the seat | the seat |
| **Saboteurs** | **the architecture. Rigidity. Collapse. Predatory. Dissociation. Grandiosity. Dysregulation** | the architecture's seat |
| Moral integrity | the seat | the seat |
| Masks | the seat | the seat |
| **Domains** | **the root. Architect. Engine. Weaver. Witness** | `ROOTCOL`, four of the seven seat colours |
| Archetypes | the seat | the seat |
| Gates | the seat | the seat |
| **The stack** | **the plexus the seat is generated by** | the seat |
| **The cards** | **the kind. Release protocol. Letting go card. Intensity band. Pattern kind. Pole** | the kind's seat |
| **Universal laws** | **the axis. Laws of nature. Laws of human nature. Moral integrity. Laws of expression** | the axis's seat |

One deck needed the rule applied twice before it was right. The stack is the
seven seats, so its name and its seat are the same word and the row printed
"Root / Root" seven times: the fourth thing saying the third thing again, which
is the same defect as the Laws deck's "seated at the heart". `APC` already
carries `nv`, the nerve plexus, so the family word is that. **Petra found it,
on the second look at a deck that had already passed.**

His own words are the test. The saboteur row now reads

    ( ring )  Imposter        55%
      mark    Collapse

against the shipping card's "Imposter / Collapse / Positive Intelligence, 3
addresses" repeated down the column.

### The Composed Mark, Which Costs Nothing And Fixes The Worst Deck

Pass 3 found that 108 named nodes wear seven marks, 15.4 rows to a mark.
Nobody is drawing 108 new marks and nobody has to.

Every node already states its axis in `n.cf`, and every axis already has a
mark in `CHILD[].ic`. The seat is already the ring's colour. So:

    the colour around the mark  is the seat
    the mark inside the ring    is the axis

Two tables that both ship, no new drawing, one line in the renderer.
Measured:

| | seat mark only | composed |
|---|---|---|
| distinct marks across 108 nodes | 7 | **40** |
| worst collision | **21 rows** share a mark | **10 rows** |
| rows per mark | 15.4 | **2.7** |

A 5.7x improvement for zero drawings. And it surfaces something useful by
accident: exactly one node has no axis at all, `Root_08_Unnamed`, so it is the
one row in 108 that falls back to its seat mark and looks different from its
neighbours. That is already his open item in `CLAUDE.md` and the row now
points at it instead of hiding it.

The same argument does not rescue the Saboteurs deck. 39 rows, 6 architecture
marks, 6.5 to a mark, and `engine/data/nodes.js` already argues why: thirty
nine hand drawn marks would be thirty nine inventions. That argument was made
when the mark was one percent of the card. At 2.4 percent with the family
word beside it, the mark and the word say the same thing, which is redundancy
rather than confusion, and it holds. **Named as a residual, not fixed.**

### At 390

One column, same 56 px row, same 44 px ring. Nine rows above the fold in the
prototype, six in the app. The deck strip scrolls sideways under the thumb
instead of wrapping to three rows of chips. The name truncates with an
ellipsis at about 22 characters; the longest name in the codex is
`Spiritual Language To Manipulate` at 32, which truncates, and its percent and
mark do not, which is the right thing to lose.

---

## THE PERCENT, PER FAMILY

**Everything has a percent for 260 of 332 rows, 78 percent.** For the other 72
there is no honest one and inventing one would be worse than the blank.

One line per family. Every source is a field the engine already computes.

| deck | rows | can print | the percent is | source |
|---|---|---|---|---|
| Fetters | **112** | 108 | **of the address at full load** | `W[].sq × 10`, sq runs 0 to 10 |
| Child emotions | 9 | 9 | **of the axis held** | `S.charge[nm] × 10` |
| Saboteurs | 39 | 39 | **of the pattern at full weight** | `compute().sabs[].w × 10` |
| Moral integrity | 21 | 21 | **of the law kept** | `S.law[nm] × 10` |
| Masks | 6 | 6 | **of the mask at full weight** | `compute().maskRing[].w × 10` |
| Domains | 19 | 19 | **of your strongest blueprint lobe** | `DOMAIN[i] × 100`, normalised to the strongest |
| Archetypes | 12 | 12 | **of your strongest archetype** | `compute().aff[i] × 100`, normalised to the strongest |
| Gates | 6 | 6 | **of the gate evidence in your story** | `verpRead().pct`, genuinely zero until a story exists |
| The stack | 7 | 7 | **of the seat's addresses carrying charge** | the seat's loaded nodes over its total |
| The cards | 25 | **12** | **of the axis the card releases** | the card's `ax` into `S.charge` |
| Universal laws | 76 | **21** | **of the law kept, where the intake scores it** | `S.law[nm] × 10` |
| **eleven decks** | **332** | **260** | | |
| Glossary | 56 | **0** | | |

### The Four Places There Is No Honest Percent, And What Happens Instead

**1. Thirteen of the twenty five cards.** An intensity band, a pattern kind
and a pole are the instrument's own vocabulary, not a reading about a person.
There is nothing to be a percent of. They print an en dash in `--dim`.

**2. Fifty five of the seventy six universal laws.** Twenty one are scored by
the intake; the other fifty five are read, not measured. `DESIGN.md` Law 5 is
explicit: never print a percentage off a default. They print an en dash. The
row already distinguishes a real zero from an unscored row: **0 percent is a
reading and prints as `0%` in `--dim`; not scored prints as an en dash.**

**3. The four field anchors, and finding them changed the deck.** See below.

**4. All fifty six glossary entries, and this one changes the page.** A
definition has no reading and never will. Under `DESIGN-information.md`'s
rule 1, a name is glossed once in one table and the tip shows it, and nothing
else may carry a definition. `GLOSS` is that one table. So the glossary is not
a twelfth deck competing with eleven decks of readings: **it is the answer the
search returns.** Typing a word into the codex search returns its gloss at the
top, once, and the decks below it stop carrying the definition. That removes
the largest block of subtext on the page, 56 rows at a median of 213
characters, and it is the same move that makes "everything has a percent" true
rather than aspirational: every deck has a percent, and the one thing that
cannot have one stops being a deck.

That takes the codex from twelve decks to **eleven**, and from 384 rows to
332.

### The Deck Was Showing 108 Of The 112 It Claims To Hold

Found by a voice rule rather than by a design argument. The deck chip prints
its own row count, and the Nodes deck counts `W`, which is **108**. The
standing rule is that the count stated to users is 112, never 108. So the chip
would have printed a number the product is not allowed to say.

It is not a labelling problem. `W` is built in `core.js` by filtering `NODES`
to the seven seats, and the four field anchors carry `b:"Field-Above"` and
`b:"Field-Below"`, which are not seats. So:

    NODES   112
    W       108
    missing   4   Sol Star, Stellar Gateway, Earth Star, Gaia Gateway

**Those four appear nowhere in the codex.** The glossary defines them, three
of them by name, and the deck that exists to list every address does not carry
them.

The fix is that the Fetters deck lists all 112. The engine computes no `sq`
for the four, so they print an en dash rather than a figure, which is the
state the row already has for anything unscored, and their family word is
"field anchor" rather than a seat, because they do not have one. They sort to
the end of the deck by their own index and read as visibly different from a
loaded address, which is true of them. Verified in `proto/kb/pass5.html`: the
deck renders 112 rows, the last four carry an empty ring and a dash.

**Bjorn found it**, counting the chip.

---

## THE ORDER OF THE LAWS

He said the universal laws need to be in order because it is a flow. **The
book states the order, the flow has a name in his own words, and the product
currently holds three different orders, none of which is the book's.**

### What The Book Says

`index.html`, 5.9 MB, tags stripped to 741,245 characters of text. The laws
are numbered, in chapters 08 to 11, not in Chapter 19 as `HARM` claims.
Chapter 19 is The Freedom Definition.

    Chapter 08   Laws of Nature
                 "Sat / X axis. How the field behaves."
                 numbered 01 to 13

    Chapter 09   Laws of Human Nature
                 "Chit / Y axis. How consciousness enters form."
                 numbered 14 to 26

    Chapter 10   the coherence laws
                 "Ananda / Z axis upward. What maintains coherence.
                  The upward spiral compass."
                 numbered 27 to 39

    Chapter 11   Laws of Expression
                 numbered 40 to 48

**The flow is Sat, Chit, Ananda, and then expression.** How the field behaves,
how consciousness enters form, what maintains coherence, what it comes out as.
That is the book's own structure in the book's own words and it is what he
means by a flow. And the book says so about the ordering directly, at Chapter
08:

> "Architectural note: Polarity moves to position 03. The earlier ordering
> placed Polarity at position 10, after the laws that depend on it. That
> ordering described teaching flow, not causal structure. This is a periodic
> table, not a curriculum. Polarity is foundational because every law after
> position 03 assumes two-ness exists."

He has already ruled once that the order carries a causal argument and is not
a teaching sequence. That settles what "in order" means.

### What The Product Holds, Against It

**The axis order is already right.** `HARM` runs nature, human, spirit,
express, then three the book does not chapter. That matches the book's chapter
order. Nothing to change.

**Within the nature axis, `HARM` matches the book exactly**, thirteen for
thirteen, position for position, under the engine's renames (Vibration reads
as All Is Motion, Correspondence as All Fields Correspond, Attraction as Like
Fields Attract).

**Within the human nature axis it does not.** The book numbers thirteen.
`HARM` carries fifteen, with `E20 Pleasure & Pain` and `E21 The Three Axes`
inserted after Intelligence, which the book does not number at all. Every
entry after that point is off by two against the book's own numbering.

**Within the coherence axis it is a different set in a different order.**

| | the book, chapter 10 | the engine, `HARM` spirit | the engine, `SI` |
|---|---|---|---|
| count | 13 | 21 | 21 |
| order | Truth, Unity, Awareness, Compassion, Beauty, Courage, Duty, Responsibility, Accountability, Transparency, Presence, Nature, Reverence | Truth, Transparency, Unity, Awareness, Presence, Equanimity, Compassion, Forgiveness, Courage, Temperance, Duty, Accountability, Justice, Non-Harm, Responsibility, Humility, Generosity, Detachment, Patience, Aesthetic Beauty, Nature | grouped by seat, starting at Throat |

Checked by name: the engine carries **12 of the book's 13**. Beauty is
carried as Aesthetic Beauty. **Reverence is not built at all.** And the engine
adds **nine the book does not number**: Justice, Humility, Equanimity,
Forgiveness, Generosity, Temperance, Detachment, Non-Harm, Patience.

**So there are three orders in the product plus the book's, and `SI` is the
one the intake actually scores.** `SI` is grouped by seat and it starts at the
Throat, which is neither top down nor bottom up and corresponds to nothing.

### The Order To Ship, And Nothing In It Is Invented

    01  Truth              the book's chapter 10, in the book's own order
    02  Unity
    03  Awareness
    04  Compassion
    05  Aesthetic Beauty   the book's "Beauty", position 31
    06  Courage
    07  Duty
    08  Responsibility
    09  Accountability
    10  Transparency
    11  Presence
    12  Nature
    --- the book's thirteenth is Reverence and the engine does not carry it ---
    13  Equanimity         the nine the engine adds, in HARM's existing order
    14  Forgiveness
    15  Temperance
    16  Justice
    17  Non-Harm
    18  Humility
    19  Generosity
    20  Detachment
    21  Patience

Twelve come from the book in the book's sequence. Nine come from `HARM` in the
order `HARM` already holds them. **No position is chosen by me.** This is the
order `proto/kb/pass5.html` and `proto/kb/row.html` render.

And the Universal laws deck breaks on the axis and names it, so the flow is
visible rather than implied. The section headings are the book's:

    Laws of nature · Sat, how the field behaves
    Laws of human nature · Chit, how consciousness enters form
    Moral integrity · Ananda, what maintains coherence
    Laws of expression · what it comes out as

### Two Things For The Errata, Not For Me To Change

**The citation is wrong on all 76 rows.** Every `HARM` entry carries
`ch:"Chapter 19"`. The laws are in chapters 08, 09, 10 and 11. Chapter 19 is
The Freedom Definition. It prints on every card today as part of the subtext
the row deletes, so the row fixes the symptom and not the data.

**The book calls them the Laws of Spiritual Integrity.** Chapter 19: "The
Laws of Spiritual Integrity are not guidelines. They are the operating
conditions under which the nervous system remains coherent." The product says
both: `kb.js:21` has `spirit:'Laws of Moral Integrity'` and `canon.js:206`'s
comment says "the 21 Laws of Spiritual Integrity". **He said moral. Moral
wins**, the comment moves, and the disagreement with the book is one line for
`BOOK-ERRATA.md`.

---

## THE LABEL

> "So the laws, it just says laws, that should be moral integrity."

`['law','Laws']` becomes `['law','Moral integrity']`. Sentence case, because
it is a label rather than a header.

Every site where the bare word appears to a person, counted:

| site | today | becomes |
|---|---|---|
| `ui/knowledge.js:153` | `['law','Laws']` | `['law','Moral integrity']` |
| `ui/knowledge.js:225` | `KIND.law='Law'` | `'Moral integrity'` |
| `shell/body.html:489` | `<span>Laws</span>`, the left rail section | `Moral integrity` |
| `ui/analytics.js:265` | `Laws seated here` | `Moral integrity seated here` |
| `ui/mapshelf.js:143` | `Laws seated here` | `Moral integrity seated here` |
| `ui/personas.js:244` | `Laws, signal and expression are all full.` | `Moral integrity, signal and expression are all full.` |
| `ui/personas.js:248` | `Laws sitting close together name nothing.` | `Laws of integrity sitting close together name nothing.` |
| `ui/intakeui.js:41` | `Twenty One Laws, Three Ways` | `Moral integrity, three ways` |

Eight sites, five files. `HARM_AX.spirit` already says "Laws of Moral
Integrity" and does not move.

---

## THE CENTRE AS THE DESTINATION

> "if I click on anything in the centre, that centre page should take me to
> all the information I need, like the centre display area."

Today the press lands in a 298 pixel right rail while 884 pixels of centre
keep showing the list. That is measured above.

**The move is one function and it already has everything it needs.**

`kbOpen(x)` routes fourteen kinds to `runNodeDrill`, `runLawDrill`,
`runSabDrill`, `runFetterDrill`, `runDomDrill`, `runSeatDrill`,
`runCardDrill`, `runAxCardDrill`, `runGatesDrill` and `runKbDrill`. Every one
of them ends at `rdShell(h)`. `rdShell` calls `rdOpen()`, which returns
`#rdrill`, which lives in the right rail.

So the whole routing table already converges on one host lookup, and **the
centre becomes the destination by changing which element that lookup
returns when the press came from the codex.** The drills do not change. The
markup they emit does not change. One selector does.

**What the centre then shows.** The deck is replaced by the entry, in place,
with the back control already built: `rdShell` prints "Back to the knowledge"
at the top, ahead of the content, because a one way door on a surface built to
be pressed into was already ruled a defect. It scrolls to the top, the deck
strip stays visible so the next deck is one press away, and Escape leaves,
which `drills.js` already binds once globally.

**What the right rail then shows.** Whatever it shows on the other eight tabs.
`#rdrill-none` already says "Nothing selected. Click an address, a law, a
saboteur or the core", which is true of the Field and the Body and stays true.
The codex simply stops writing there.

**What this is worth, measured.** The answer goes from 298 px wide to 884 at
1600, a **3.0x** increase in the space the answer gets, and from 346 to 374 at
390 with the eye travel removed entirely. The eye travel at 1600 goes from
about 900 px to zero.

**One thing it must not do.** `#know` is the tab host and it also carries the
folded Games surface. `kbRender` already writes to `#knowbody` and not to
`#know` for exactly that reason, and the comment at `knowledge.js:146` records
why. A centre drill has to write to `#knowbody` too, or it deletes Games on
the way past, which is the failure `CLAUDE.md` records under "a tab host that
carries a folded surface cannot also be one" and which the functional gate
caught last time.

---

## WHAT IT COSTS

### Kilobytes

Measured by diffing the pieces, not estimated.

| | delta |
|---|---|
| `ui/knowledge.js`, the row replacing the card | **minus 1.1 KB**, the subtext construction goes |
| `ui/knowledge.js`, the percent per family | plus 0.9 KB, eleven expressions |
| `ui/knowledge.js`, the composed mark | plus 0.1 KB, one lookup |
| `ui/knowledge.js`, the axis section breaks | plus 0.4 KB |
| `ui/knowledge.js`, the glossary out of the decks and into the search | minus 0.3 KB |
| `ui/knowledge.js`, the deck reading `NODES` rather than `W` | plus 0.1 KB |
| `shell/head.html`, the row CSS in, the card CSS out | **minus 0.4 KB** |
| the book order for `SI` | 0, it is a reordering of an existing array |
| the terminology rename | plus 0.2 KB, "child emotion" is longer than "fetter" |
| the label change | plus 0.1 KB |
| **net on a 1,411,259 byte build** | **minus 0.1 KB, call it zero** |

The page gets denser, faster and more informative and the file does not grow.
That is because the subtext being removed is roughly the same size as the
arithmetic being added.

### Frames

| | measured |
|---|---|
| DOM nodes per row, card today | 7 |
| DOM nodes per row, the new row | 9, the ring is two circles and a mark |
| nodes for the largest deck, today | 756 |
| nodes for the largest deck, new | 972 |
| but rows rendered per deck | unchanged, `kbRows` is untouched |
| the arc geometry | two `Math.PI` multiplies and a `toFixed` per row, 108 of them |
| `crBadge` already does this | on up to 100 rows today, at 60 hertz, with no complaint |

The ring is the component that already ships. `crBadge` at `md` is the exact
44 px geometry, `CRB.md = {box:44, r:17.5, w:3.6}`, and the row uses it rather
than a new drawing. **Port, do not rebuild.**

One thing to hold: the prototype re-renders the whole deck on a sort switch.
108 rows of innerHTML is fine; 328 would not be, and the design never renders
more than one deck.

### Files Changed

| file | what |
|---|---|
| `atuned_src/ui/knowledge.js` | the row, the percent per family, the order, the labels, the composed mark, the glossary into the search, the centre host |
| `atuned_src/ui/drills.js` | `rdShell` takes a host rather than assuming `#rdrill`; the "Child fetter" eyebrow |
| `atuned_src/shell/head.html` | the row CSS in, `.kb-c` and `.kb-cd` out, the scrolling deck strip |
| `atuned_src/shell/body.html` | the rail headings, three strings |
| `atuned_src/engine/data/canon.js` | `SI` reordered to the book, and one comment |
| `atuned_src/ui/ui.js` | the stack tab label |
| `atuned_src/ui/personas.js` | the matrix key, two law strings |
| `atuned_src/ui/analytics.js`, `mapshelf.js`, `intakeui.js` | "Laws seated here", three sites |
| `atuned_src/ui/wheel.js`, `imprints.js`, `games.js` | the nine sense, four strings |
| `atuned_src/engine/plan.js`, `lexicon.js`, `schema.js`, `data/practice.js`, `data/cards.js` | the nine sense, five strings and comments |
| **19 files** | **22 user visible strings, 113 comments, 0 persisted keys** |

Plus the gates: `tests/design.js` gains a check that no codex row prints a
figure without a scale, and `tests/collide.js` and `tools/monitor.js` are
untouched because nothing about the wheel or the surface inventory moves.

---

## THE QUESTIONS

Four, and there are already sixty five open from other seats, so these are
only the ones that block building this.

**1. Reverence.** The book numbers thirteen coherence laws at 27 to 39 and
the thirteenth is Reverence. The engine carries twelve of the thirteen and
adds nine the book does not number, so it measures twenty one. Is Reverence a
law the instrument should measure and does not, or is the twenty one the
current set and the book's Reverence superseded?

**2. The two inserted human nature laws.** `E20 Pleasure & Pain` and `E21 The
Three Axes` are in the engine and are not numbered in chapter 09, and their
presence shifts every entry after them by two against the book's numbering.
Do they take numbers in that axis, which renumbers the book, or do they move
out of the numbered set?

**3. The twenty one appear in two decks.** The Moral integrity deck and the
spirit axis of the Universal laws deck are, by name, the same twenty one rows.
Does the Universal laws deck drop its spirit axis and point at the Moral
integrity deck, or do both keep them?

**4. `Root_08_Unnamed`.** It is the one node of 108 with no axis and no name,
and the new row puts it on screen with its raw key and a 0 percent. It was
already yours to name. It now has a place it will be seen.

---

## THE FILES

    proto/kb/now.html     the shipping card, rebuilt from the same tables
    proto/kb/pass1.html   the subtext deleted
    proto/kb/pass2.html   the card becomes a line
    proto/kb/pass3.html   icon dominant, literally
    proto/kb/pass4.html   ranked
    proto/kb/pass5.html   the row, and the one to build
    proto/kb/row.html     the row's anatomy, every deck, and the percent table

Seven pages, each standalone, each with the data inlined. Checked: no `src`,
no `href`, no `url(`, no network of any kind, no em dashes. Each carries a
profile switch for Diane, Marcus and Gordon and every figure on them comes
out of `engine.js`.

`pass5.html` takes `SEC` and `SORT` as globals so the harness can drive it,
which is how the fold counts in this document were taken.
