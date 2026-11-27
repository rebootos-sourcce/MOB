# Flow split, notes

Branch `po-flow`. His words, round PO, 2 October: "On the flow pages, get rid of
the left and right menu. Actually, sorry. Move the new ritual to the right menu.
And you're supposed to move accountability to its own tool set. You should have
rules on a TDD for all this."

## BEFORE (read live: source.html at f556c81, James loaded, Flow tab, 1600 and 390)

Pictures: `before-1600.png`, `before-390.png`.

- **The Flow bar had one entry**: Ritual. Nothing else in the second row.
- **Left menu** (the app's left column, 302 wide) held the Field's Root
  Energetics: Awareness (Domain, Archetype), Psyche (Child emotions), Matrix.
  Nothing in it had to do with building a ritual.
- **Right menu** (the app's right column, 336 wide) held the Energetic Summary,
  Reading, Selection, Flow (the Body's energy shelf, same word as the section
  but a different thing), Running and Moral integrity, plus Run a release.
  Again nothing to do with a ritual.
- **New ritual** was not in either menu. It was a card inside the page, under the
  chain at 1600 (x 341, y 293, 394 wide) and at the top of the page at 390.
- **Accountability** was folded into the Ritual page: the rings with the streak
  and figures, the Marks, and the Record (month and list). No door, no name on
  the page. Its sections on that page were headed Active today, Marks, Record,
  New ritual.
- At 390 both menus stacked under the page, so the page was taller than four
  screens, and the ritual was above two long menus about something else.

## HOW THE ASK WAS READ, AND WHERE THE REPO SAID SOMETHING ELSE

Read: Flow has no left menu. Flow's right menu stops being the Energetic Summary
and becomes the menu of the tool set the person is in, and New ritual is the
first thing in it. Accountability is its own tool set beside Ritual with its own
door, stage and menu. "Actually, sorry" is read as the correction from "get rid
of both" to "keep the right one and give it a job". If he meant the right column
should go as well, that is rule FT3 and one line of CSS.

The repo said different things in two places, and both were superseded by his
newer word and the old text was kept beside the new:

- `engine/core.js` at `TAB.RITUAL`: "the accountability tracker built inside it
  rather than beside it". Superseded.
- `engine/core.js` at the Ritual TABDEF entry: "the whole tab moves and nothing
  is split". Superseded.

The repo agreed with him in two places: the practice TDD section 31 puts
ACCOUNTABILITY in its own group beside PRACTICE (Today, Evidence, History,
Change), and `DESIGN-nav.md` says a door opens surfaces that each keep their own
integer and host. So Accountability is `TAB.ACCOUNT` = 14 (appended, nothing
renumbered), host `#acct` a sibling of `#rit` (the fold lesson in CLAUDE.md), and
it is placed by key everywhere.

## AFTER

Pictures: `after-ritual-1600.png`, `after-account-1600.png`,
`after-ritual-390.png`, `after-account-390.png`.

- Flow bar: Ritual, Accountability.
- No left column on either. The right column (400 wide on a desktop, so the
  builder's seven day row fits) holds one panel, `#flowrail`.
- **Ritual**: stage is the chain and the Active list. Menu is New ritual (one
  press and seven tags; open it is the builder).
- **Accountability**: stage is Done (rings, streak, figures, marks) and Record.
  Menu is Due today (with the ring that marks a day) and Missed (days counted
  over the last 14, Edit from three misses, the engine's own `PR_MISS_AT`).
- On a phone the menu comes first on both, so the builder and what is due today
  are at the top.
- Callers that used to open a ritual modal over any tab (the release, the avatar
  queue, the Summary, the Compass) now go to the Ritual tab, because the builder
  is in a menu that exists on Flow only.
- Rules: `DESIGN-flow-tools.md`, FT1 to FT15, linked from section 45 of the
  practice TDD. Gate: `tests/flowtools.js`, called from `tests/functional.js`.

## NOT BUILT, AND WHY

- The reason a day was missed (TDD 24 classes). The profile has nowhere to keep
  one, and a control that took an answer and dropped it would be a false success.
- Evidence and outcome (TDD 11 to 14) and the 30, 60, 90 day record (35).
- Points for a miss. His original ritual brief said "if I fail an accountability
  I lose points"; the TDD says a miss is investigated and not punished. His call.
- The Body's rail section is named Flow too. Not touched: out of scope, and a
  rename is his.
