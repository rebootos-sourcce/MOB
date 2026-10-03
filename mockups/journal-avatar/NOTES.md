# Journal and Avatar pages: documented looks, mockups, slices

Branch po-journal. Mockups only. `atuned_src/` and `source.html` are untouched.

## Open it

`index.html` (one file, about 1.3 MB, no network). It is the real app's own stylesheet and markup with the page content swapped, so the bar, tabs, left rail, right rail, panels, buttons and rings are the product's. The only change is the typeface, Onest, his pick, in place of Inter. A one-line label sits at the top. Tabs Story and Avatar switch pages. Loaded and Stranger switch who is looking. Phone 390 shows the same pages at phone width.

    index.html                                the playable file
    compare-journal-1600.png                  shipped (left) and new (right), same shell, loaded
    compare-avatar-1600.png                   same for the Avatar
    compare-journal-390.png, compare-avatar-390.png
    journal-1600.png  journal-390.png                       new, loaded
    journal-empty-1600.png  journal-empty-390.png           new, stranger
    journal-committed-1600.png  journal-committed-390.png   new, after Commit
    avatar-1600.png  avatar-390.png                         new, loaded
    avatar-empty-1600.png  avatar-empty-390.png             new, stranger
    before/*-shipped.png                      the shipped pages, real source.html
    before/ (older files)                     first round shots, kept
    src/content.js  src/mock.css              the new content and the few new styles
    src/shoot.js    src/build.js              build the pictures and the playable file inside the real app

Worked example: a founder, 46, the Diane reference person, Fri 2 Oct 2026. The right rail on the Avatar page is the real Energetic Summary for that person. The reading of the sample story (route, imprints, marks, trace) is the real engine. Dates, releases and ritual steps are invented.

## What changed from the first version

The first version was a hand drawn page in a different look. This one is built inside the real app and follows the documented looks.

- Shell: real top bar, sub tabs, left rail, stage panel and right rail. Product buttons (`.btn`), eyebrows (`.pm-eye`), panels (`.st-pan`, `.av-card`), ring badges (`crBadge`), the real Trace chart, the real journal box with its live marks, and the real Avatar sub tab pills.
- Journal: two columns kept. Left: feel, where, the real journal box, the mirror with the documented fields. Right: the real imprints Trace, where this entry goes, earlier entries. The privacy line under the box is gone (round LO removed it; it lives in the mic button's tooltip).
- Avatar: the armature figure from `DESIGN-avatar.md` replaces my plain outline, with the three channels, the under-figure sentence and the hard-month state. Added: who I am becoming and who I am not becoming with the schema fields; a ritual tick row per seat coloured by intervention type with the drill path; the five-layer thread; masks under one lock.
- Dropped: the privacy line, the per seat "Nothing yet" rows for a stranger, the kundalini thread on the figure.

## Every static element each document specifies

Status: yes, changed (and why), or not (and why).

### DESIGN-avatar.md

| Element | Section | Status |
|---|---|---|
| Avatar is built only from dated facts; it can only be added to | s3, s5 | yes. Solid line work and rings are dated releases; nothing dims |
| RECORD channel: line work, one ring per seat with two arcs (touched, emptied) | s5, s6 | yes |
| REACH channel: dotted end of each seat's gauge | s5 | yes |
| WEATHER channel: grey bar under each gauge, `#94908A`, the only mark that moves both ways | s5, s7 | yes |
| Ring at the end of each solid gauge line (where you stand today) | s6 | yes |
| What a person sees when it gets worse: drawing unchanged, grey bars longer, rings slide in, nothing taken away | s5 | yes. Third state card "After a hard month" |
| The sentence under the figure: which lever matters, computed on expression | s5 | changed. Plain words, no numbers ("releasing moves how far you can get faster than raising a law does"). Numbers removed by the later no-count ruling |
| Armature: a body reduced to the parts that carry a reading; spine; seven seats at the `PMBANDS` heights | s6 | yes (same y values, x on the midline, see SY11 in `DESIGN-story4.md`) |
| Eleven segment families hanging off the seats | s6 | changed. Seven bands, one per seat, in the seat colour. The document gives the count, not the shapes |
| Line work continuous where a release has reached, broken where not | s6 | yes (solid or dashed per band) |
| Refuses a face, mass, body type, sex, age, clothing, a number on the figure | s6 | yes |
| Gauge numbers in the prototype ("reaches 85 of 100", "26 of 112") | proto `shot-one-armature-*.png` | not. A count against a total is forbidden (`DESIGN-progression.md` s3.1) and round PK bans numbers on screen |
| Pegs: the twenty one laws turned by hand, moving only the dotted line | s5, proto | not. They live on the Intake page; the avatar shows the dotted reach only |
| Lantern, Seam as alternatives | s6 | not. s8 recommends the armature. The Seam's five rails are used for the sewn row |
| Layers sewn: avatar, ritual, psyche, body, story | s4, `CLAUDE.md` | changed to a thread of five cards with the return line "your story tells the avatar who to become" |
| Atmosphere: breath, grey is pressure never a seat colour, no particles or drift | s7 | changed. One fixed breath of 4.2 s on lit seats and a pulse on the newest act, from `REVIEW-skin/PROPOSAL.md` (the newer ruling), not breath tied to the reading. Grey is never a seat colour: yes. No particles: yes |
| Part Two: kundalini rise as a bar with a number (56 of 100), seven coloured bars with numbers, "where it stops" card, "what is improving" with "4 of 7" | s16 to s22, proto `dash-*.png` | not. A bar with a number and "4 of 7" are a score and a count against a total, ruled out by `DESIGN-gamification.md` s9 and round PK. Kept in spirit: "the next place is the heart" and the "What needs attention" card |
| Part Two: the channel and seven seats stood alone (stacked discs) | s18, proto | not. The armature carries the seven seats |
| Part Two: Summary and Ritual as the only two doors under the reading | s21 | changed. "Next in your ritual" and "First in your release queue" sit in the right column |
| Part Two: empty state draws the channel and seats but not the rise; four doors | s22 | yes. Stranger: dashed outline, seven dashed seats, no gauge, no rise, four loop cards that act as the four doors |
| Part Three: avatar is the seven seats, not the body | s27, `DECISIONS.md` EI | conflict, see below. Changed: seven seat rings on the armature, no second ring of seven arcs |
| Part Three: Told layout (becoming sentence on top, your own line, "Next, the ritual for it", ring of seven arcs, "Also in the way") | s29, proto `seats4/shots/told-*.jpg` | changed. Becoming sentence, next ritual card, release queue line. The seven arc ring and its satellites are not drawn |
| Part Three: pair of stated sentences, left to release, right to embody | s28, JQ | yes. "Who I am not becoming" left, "Who I am becoming" right |
| Shipped Cycles rings (three revolutions) and Rituals list | `ui/avatarui.js` | not. Left to the shipped page; flagged as a gap |

### ATUNED-becoming-system-TDD.md

| Element | Section | Status |
|---|---|---|
| "Who I am becoming" and "Who I am not becoming" | s6.1 | yes |
| becoming: qualities, values, beliefs, behaviors, communication, relationships, embodiment, contribution | s6.2 | yes, all eight as labelled rows (empty rows show "add") |
| not_becoming: qualities, beliefs, behaviors, patterns, conditions | s6.2 | yes, all five |
| name, title, description, version, status (draft, active, archived) | s6.2 | description yes (the big sentence). The rest not: bookkeeping with no look |
| AI structures language but never silently invents identity | s6.1 | yes. A dashed suggested word with Keep and Not me |
| Weighting principle (avatar over confirmed pattern over evidence over inference) | s6.3 | not. It is an ordering inside the sniffer, not a surface |
| Journal produces observations, behaviors, emotions, beliefs, decisions, context, boundary signals, integrity signals, pattern candidates, evidence | s11 | yes. All the rows in the mirror card under "What I found in this entry, for you to confirm" |
| AI interpretations never become facts without confirmation | s11 | yes. Pattern candidates are dashed until you say yes |
| Per seat, a row of small clickable ticks, one per real Ritual Element | s17 | yes. "Work on each seat" |
| Colour by intervention type: release, reframe, behavior, integrity, embodiment, observation | s17 | changed. Six muted colours plus a legend that says each in words. The TDD says the colours belong to the design system; these are my proposal. `PROPOSAL.md` says hue means place only; the TDD is the owner's document, so the TDD wins |
| Ticks are clickable; path Avatar, seat, Ritual Element, Ritual, Protocol, Practice | s17 | yes. One tick pressed, with the six step path under it |
| Ritual is when, Protocol is what, why, how, Practice is what happened | s16 | yes. One line under the path |
| The visual answers "what work is associated with becoming this person" | s17 | yes. It is the heading line |
| Avatar page layers A identity, B purpose, C boundary, D alignment, E practice | s29 | A yes, E yes, D partly (patterns in the way, what needs attention). B (material, spiritual, unified purpose) and C (six boundary facets) not: no data model or screen exists yet, TDD s7 to s9 |
| The six questions the page answers (who, why, what protects, practising, obstructing, evidence) | s29 | four yes. "Why" and "what protects" not, for the same reason |
| Canonical transformation loop (avatar, purpose, values, boundary, ritual, practice, journal, sniffer, adaptation, back to avatar) | s4 | not drawn as such. The owner's loop (discover, play, flow, embody) is the ring, per `CLAUDE.md`. The sewn row carries the avatar-to-story chain |
| Information architecture: Discover, Become, Practice, Reflect, Intelligence | s30 | not. Navigation is `DESIGN-nav.md`, not these pages |

### ATUNED-daily-summary-personal-mirror-TDD.md (Summary page IA, `TAB.SUMMARY`; rebuilt 1 Oct, `mockups/summary-layout/`)

| Element | Section | Status |
|---|---|---|
| A Today: date, one sentence mirror, state, most noticeable | s5 | changed. The sentence under the figure plays this role on the Avatar |
| B What is expressing | s5 | changed. "Who I am becoming" and its qualities |
| C What is interfering | s5 | changed. Psyche card and "patterns in the way" |
| D What is changing | s5 | yes. "Since your last visit" |
| E What needs attention: highest leverage gap, why, suggested practice | s5 | yes. "What needs attention" card |
| F Today's intention | s5 | changed. "Next in your ritual, today 07:30" |
| G History: daily snapshots, 7, 30, 90 day trend | s5 | not. Summary's job; the avatar's history is Early, Now, After a hard month |
| H Explore: click any statement into pattern, ritual, journal, avatar, knowledge | s5 | changed. The sewn row and the path crumbs are the doors |
| Grounded language: behaviour, tendency, pattern, evidence, practice; no cosmic or spiritual claims | s12 | yes. Checked by hand over every line. "Dashed means I am guessing" follows the confidence rule |

### DESIGN-story.md, DESIGN-story4.md, DESIGN-ia.md, DECISIONS.md

| Element | Section | Status |
|---|---|---|
| The box rises onto a panel, holds a measure, live marks on the person's own words | story s1 | yes. The real journal box and the real marks (the product draws a filled mark, not the story4 rule) |
| A 2px top rule in the seat colour of the heaviest word | story s1 | yes, drawn in `mock.css`; it was never built in the product |
| Nothing sits above the box | story s1 | changed. Feel and where come first, per round PP (2 Oct, newer) |
| Circular 56px record ring lower right, red light upper left | story s2 | not. The shipped Record pill and red dot are kept; round JS asked for a round red button and it is still unbuilt |
| Privacy line under the box | story s2 | not. Round LO removed the text; the fact lives in the mic tooltip |
| Release panel of two controls, "Run release" above the fold | story s3 | changed. A Run release button in the Release hop. The full panel is not redrawn here |
| "How two imprints work through you" (pair path) | story s4 | not. It needs a selection in the imprints list, which is hidden here |
| Imprint pills as the product badge; "Filled in" heading | story s5 | not. The pending imprints list is replaced by "Where this entry goes"; the real Trace chart stays |
| Story4 mirror: your words beside the instrument's reading, colour on a rule not the word | story4 s3 | changed. One plain sentence, the quoted words with a seat ring, no margin leaders |
| Story4 Route, Dwell, Kink | story4 s2 and s9 | yes. One line under the mirror: route, stays longest, heaviest word, with "The order is a record. No number moves with it." |
| Story4 empty state: a page, a placeholder, a record button, one quiet line | story4 s9 | yes. Stranger |
| Two columns, left the journal, right the imprints | `DESIGN-ia.md` s2 | yes. Right is the Trace, not the old cloud |
| Trace picked; story, imprints, release above the fold; zones for journal, imprints, release, information | `DECISIONS.md` IG, HY, JX | changed. Journal, Trace, where it goes, entries. Release sits behind a button |
| Content chain: imprints always; part to release; part to ritual; sometimes a statement | `CLAUDE.md` | yes |
| Feel, then where, then story; mirror and correct | round PP | yes |
| "Source AI" label retired | `PROPOSAL.md` | yes. The prompt strip is hidden; "What is here?" replaces it |
| Placeholder wording | story s2 | not. The shipped line is kept |

## Where documents conflict, and which I followed

1. Avatar is the seven seats, not the body (`DECISIONS.md` EI, 27 Sep, the owner) against the armature body (`DESIGN-avatar.md` s8, `PROPOSAL.md` one figure, and the brief I was given). Followed both as far as they fit: the seven seats are the structure (seven rings, seven gauges, seven rows) and they are drawn on the armature. I did not draw the second ring of seven arcs. Needs his word: body, ring, or both.
2. Kundalini bar with a number (Part Two) against "no bar, no number" (gamification s9, round PK, `PROPOSAL.md`). Followed no number.
3. Ticks coloured by intervention type (TDD s17) against hue means place only (`PROPOSAL.md`). Followed the TDD, because it is the owner's document and `PROPOSAL.md` is a lead's merge. Colours are mine and marked open.
4. Mirror in the margin (story4) against feel, where, then a plain mirror (round PP, newer). Followed PP.
5. Show the intelligence early (TDD s11 lists the fields) against "don't expose system objects" (PP 8). Both: the plain sentence is first and the fields sit under it as "for you to confirm", dashed. In the product this should start closed. It is open in the picture so he can see the documented fields.
6. Privacy line under the box (story s2) against removed text (round LO). Followed LO.
7. Breath tied to the reading (`DESIGN-avatar.md` s7) against one 4.2 s breath (`PROPOSAL.md`). Followed `PROPOSAL.md`.
8. Round record button lower right (story s2, round JS) against the shipped Record pill. Kept the shipped one; unbuilt.

## Real in the product, against mock

Real: the whole shell; the stylesheet; the story page's journal box, marks, record pill and Trace chart, driven by `parseStory` on the sample text; the reading, imprint names and route; the Energetic Summary rail for Diane; the six mask names, lines and places (`MASKS`); seat order and heights (`PMBANDS`); the ring badge component; the Avatar sub tab pills.

Mock: feel and where steps and their storage; the mirror line and Keep, That is me, Not quite; the findings (the engine finds some; nothing groups them into the TDD fields); entries linked to their imprints, releases, practices and statements; the figure, the ring around it, the gauges, the grey bars and every date; becoming and not-becoming fields beyond the two sentences; ritual elements, their types and the path; the sewn row's live facts; the three states; the lock tier. None of the dated facts exist as a record today (`meterFirst` stamps the first touch of a place, which is the real source for lit seats).

## Slices to build each page for real (S under a day, M two to three, L a week)

Journal

1. S. Retire the Source AI strip, set "What is here?" as the prompt, add the top rule. Mostly CSS and one string.
2. M. Feel step, chips from a ruled word list, stored on the entry.
3. M. Where step: three tap zones on the one figure. Open: which seats each torso covers.
4. M. Mirror line from the path and hits, quote row with seat rings, Keep and Not quite stored on the entry.
5. M. Findings by the TDD fields as a derived view; pattern candidates dashed until confirmed. A reject path is L.
6. M. Entry record joining an entry to imprints, queued releases, ritual practice, statement. Then the two right cards from it.
7. L. Practice with the person's span, and the statement with the hedge (`DESIGN-gamification.md` s5.4).
8. S. Drop "Commit N" and the five group tabs (already ruled).

Avatar

1. M. The armature: one SVG function on `PMBANDS`, bands, spine, rings with two arcs. Also draws the Where step.
2. M. Dated record: first touch per place, ritual days kept, held since, last visit. Append only.
3. M. Gauges: reach, standing, grey bar from the engine; no numbers printed.
4. S. Loop ring from the dated record; the same function draws a small ring in the bar if he wants it there.
5. S. Since your last visit and What needs attention as sentences off the record. Voice gate.
6. M. Becoming and not-becoming: eight and five schema fields, suggestions with Keep and Not me. L for the sniffer weighting.
7. M. Ritual tick rows: needs ritual elements typed by intervention (schema), then the drill path. L if Protocol and Practice records are separate.
8. M. Three states (early, now, hard month) from the dated record.
9. S. Masks strip and one lock. The tier is open.
10. L. Purpose and boundary layers (TDD s7 to s9).

Order that moves him furthest soonest: Avatar 1, 2, 3, 4, then Journal 4, 5, 6.

## What could not be verified

- No gate was run (`tests/design.js`, `tools/terms.py`, voice checker). The output is a mockup built by script; hand check only: no em dashes, no all caps words, sentence case, no "Source AI", no "we".
- Dark only. Snow, Punch and Glass are not drawn.
- Phone view is the page at 390 wide inside a frame, not a phone. The product at 390 was re-snapshotted, not emulated.
- The product's own capitalised headers are left as shipped.
- The Where figure uses the armature drawing at small size; it is not the Aura prism or any shipped figure.
- The six intervention colours are untested against the seven seat hues. Each also has a legend row naming it in words.
- Dates and releases are invented for the example.
