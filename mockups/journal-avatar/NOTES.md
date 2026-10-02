# Journal and Avatar pages: rulings, mockups, slices

Branch po-journal. Mockups only. `atuned_src/` untouched.

Open `index.html` (one file, 97 KB, Onest embedded, no network). Top bar: Journal or Avatar, Loaded or Stranger, Desktop 1600 or Phone 390. Layout answers the frame width, not the window, so the phone view works on a desktop screen.

    index.html                       the playable page
    src/page.html, src/build.js      source and the one step that inlines the font
    journal-1600.png  journal-390.png                   loaded
    journal-empty-1600.png  journal-empty-390.png       stranger
    journal-committed-1600.png  journal-committed-390.png   after Commit
    avatar-1600.png  avatar-390.png                     loaded
    avatar-empty-1600.png  avatar-empty-390.png         stranger
    before/                          the shipped pages, real source.html, same two widths

Before shots: `1600-story-loaded`, `1600-avatar-loaded`, `1600-character-loaded` and the 390 twins (Marcus loaded, nothing held, so the Story page is empty), plus `story-typed-diane` at both widths (a story typed into the box). The typed shot reads "Sofia, example" in the profile box because `loadP(1)` is an index into a list sorted by tier, not by name. The sentences are mine; the reading of them is the real engine. Character (`TAB.MASKS`, 11) is shot too, so the owner can see it is a locked empty page. The Avatar is `TAB.INTAKE` (5), host `#iq`.

## What each document ruled for these two pages

Journal (Story, `TAB.STORY` 0)

- `CLAUDE.md`, "The content chain, also his words": journal entry "is added to the imprints. Part of that becomes a story they have to release. Part becomes a practice inside the ritual. Sometimes it becomes an affirmation, also in the ritual." Used as the right column, four hops, the fourth drawn dashed and labelled "Sometimes".
- `DESIGN-story.md` s1: the box rises onto `--panel`, holds a measure, "the instrument marks up the sentence while it is still being written", a 2px top rule in the seat colour of the heaviest word, "Nothing sits above the box", circular 56px record ring lower right, privacy sentence under the box. s5: "Filled in" is not an imprint. s2: no count on Commit ("Commit 3" was a figure with no unit). Kept.
- `DESIGN-story4.md` s9: ships "The mirror, whole": writing left, the instrument's reading beside it, colour on a rule not on the word because Root is 4.14 to 1 on `--panel`. Route, Dwell, Kink "carried for about twenty lines". Partly kept (see conflicts).
- `DECISIONS.md` (JX, "Ruled 27 September, late"): "The imprint section, the journal section, right now they read as one ... three elements ... five". Story, imprints and release above the fold (HY). Trace layout H is wired.
- `DECISIONS.md` (Source AI, JS and the 27 Sep block): welcome by name, a round red record button, "get rid of the source AI word scripted". `REVIEW-skin/PROPOSAL.md` COPY: "retire Source AI and the pronoun we". Kept: no "Source AI" label anywhere.
- `REVIEW-onboarding/OWNER-FLOW-FEEDBACK.md` (round PP, 2 Oct, the newest word): feel, then where ("Chest"), then story ("Tell me what happened"); the Mirror "shows you what it thinks it heard, and lets you recognize yourself"; "YOU CORRECT > ATUNED ADJUSTS"; "Don't expose the intelligence too early ... Those are system objects."
- `DECISIONS.md` round PO: unpack every symbol; Onest. `DECISIONS.md` "Body place words are the head, the upper torso and the lower torso" ("which seats each torso covers is not yet ruled").
- `DESIGN-gamification.md` s5.4 and s5.5: the practice carries a verbatim span; the affirmation is a statement to test; "The product may find, cut and mark. It may not write." One named exception, the hedge. Kept: struck word and the changed words shown apart.
- `ATUNED-becoming-system-TDD.md` s11: journal is an intelligence input; an AI reading "does not automatically become a fact", needs user confirmation. This is the "That is me / Not quite" pair.
- `DESIGN-ia.md` s2: "Two columns. Left, the journal ... Right, the imprint cloud". Overtaken (written before the Trace layout).

Avatar (`TAB.INTAKE` 5)

- `DESIGN-avatar.md` s3 and the owner's 20 Sep words: "What is Atuned? Your avatar." The avatar is the centrepiece, built from dated facts only, so it can only be added to. s5: never driven by the reading (Wii Fit, orthosomnia).
- `DESIGN-avatar.md` s4: the layers sewn, avatar to ritual to psyche to body to story. s8: the armature (a body) is the recommendation. Part Two s16: the kundalini rise as the progress bar, "where it's blocked", app opens on the avatar.
- `DECISIONS.md` (HG, JP, JQ): the avatar page is "me telling the story of who I want to become"; left "To release", right "To embody"; a ritual queue on the same page; "the centre panel is our hero element"; HV: not "a bunch of text boxes".
- `DECISIONS.md` (GS, round OK): Character is the sum of the masks; masks never get a person's own name; masks stay tier three, "He listed the child masks ... and named no tier".
- `REVIEW-skin/PROPOSAL.md` and `TALLY.md` item 10: one free pre-drawn figure, outline, "Light is coherence ... NO number on it", warm dim floor; one ring, "a quarter is lit by the newest dated act", "The ring never changes with time"; one grammar: "solid stroke = measured, dashed = stated or not read", one sealed mark per surface named by the next rung, unread state "There is more running you than you can see.", four doors stay.
- `DECISIONS.md` round PK: "no days, stages or confidence numbers on screen"; the loop ring never changes with time.
- `DESIGN-gamification.md` s9: the avatar shows one frame that changes when a release lands; seven regions; "A state that can only be read, never scored. No bar, no percentage, no level, and never a count against a total"; a still frame for the 46.5 percent who never release (here: the "Held" line).
- `DESIGN-progression.md` s3.1: never print a count against a total. Kept: no "3 of 7".
- `CLAUDE.md`: the loop is a circle, never a list; "the last one is embody".

## Where they conflict, and which I followed

1. **Mirror in the margin (story4) against separate zones (JX) against two columns (DESIGN-ia).** Followed the newest word: PP (2 Oct) over JX (27 Sep) over story4 (20 Sep). Left column is the journal: feel, where, story, the mirror line. Right column is where it went and the entries. I kept story4's reasoning (colour on a rule, not on the word) and dropped its margin leaders, because PP asks for one plain sentence, not a reading laid beside each word.
2. **"Nothing sits above the box" (DESIGN-story) against a feel and where step before the story (PP, HT).** Followed PP. The box is still the biggest thing on the page and still has no eyebrow, but two short steps now come first. This is the owner's direction; DESIGN-story s1 is the one that moves.
3. **Mirror lines that name addresses (story4: "It lands on Speaking To Be Right") against "don't expose system objects" (PP 8).** Followed PP. The mirror is one sentence plus the person's own verbatim words with a seat rule. Pattern names sit behind "Show where it landed", closed.
4. **Kundalini rise as a bar that falls on a bad month (DESIGN-avatar Part Two) against "no bar, no percentage" (DESIGN-gamification s9) and "no number on it" (PROPOSAL).** Followed the two against one, and drew the thread as a line with a stop, not a bar. Deviation from Part Two: the thread is driven by dated releases, so it never falls. The owner's wish ("where it is blocked") is kept as "It stops before the heart. That is the next place." Needs his yes.
5. **Ring in the top bar (PROPOSAL move 2) against the avatar at the centre of the ring (PROPOSAL "what a skin cannot do"; `DESIGN-avatar.md` s8 "I would not put it in the centre of the ring").** Both are drawn: a small ring in the bar on every page, a large ring round the figure on the Avatar page. The same function draws both, so they cannot disagree. The owner's "centrepiece" and "circle" words win over the earlier caution. He should confirm.
6. **Figure style.** PROPOSAL names "the picked Aura prism, outline". The Aura prism is a point cloud on a canvas (29 to 35 ms a frame at 1600 in `REVIEW-skin/pass2/technical-director.md`). I drew a line outline in SVG on the real seat y values (`PMBANDS`). Not the prism; it is the free tier figure and costs nothing to draw. Needs his eye.
7. **Avatar is a body (s8 armature), a light, or a diagram (open question 2).** Drawn as a body outline with light at the seats. Not ruled by him.
8. **`ATUNED-becoming-system-TDD.md` s29** sets labels in capitals (WHO I AM BECOMING) and a six-layer page; the house rule is sentence case and one loop. Followed the house rule; the TDD's layers A to E are not drawn (Purpose, Boundary, Integrity are later slices).
9. **Seat hex.** The brief lists Root `#C4635E` and others. The shipped Dark tokens in `atuned_src/shell/head.html` are Root `#D6524C`, Sacral `#D8924E`, Solar `#DABF6A`, Heart `#5FD5A6`, Throat `#5EBBDB`, 3rd Eye `#7D93E0`, Crown `#A77EDB`. Used the shipped ones.

## Findings, with who found them and the measure

- Sol: seat colours are used for rules, rings and glow, never for body text. Root on `--panel` is 4.14 to 1 (passes 3 for a rule, fails 4.5 for text); every seat name is set in ink 14.39 to 1. Other grounds measured against their own ground: dim on `--panel` 5.30, dim on `--panel-2` 4.63, mid on `--panel` 7.79, accent on `--panel` 7.77, on-accent on accent 8.60, section colours 4.83 (Embody on panel) to 8.56. Unlit dashed rings, ink at 42 percent, 3.65 on `--bg` and 3.60 on `--panel`.
- Bjorn: one face (Onest 300 to 700 variable, 41 KB), scale 13, 16, 20, 28 only; journal text is 20 on 1.6 at 62ch, so the box reads as a page. No text under 13. Every button measured: nothing under 44 by 44 at either width (the phone section buttons were 34 wide; fixed to 44). No horizontal scroll at 390.
- Petra: one symbol grammar for every ring icon (stroke 1.6, round caps, no fill): feel (wave), where (pin), story (page), imprint (ring in a ring), release (open ring with an arrow out), ritual (two arrows in a loop), statement (speech ring), plus the four loop marks. Dashed means not yet or sometimes, everywhere, on the ring, the figure, the thread and the statement hop. Every symbol is unpacked in words in the same place, including the chain, the ring, the thread and the lock.
- Mika, squint: the Journal first reads as the box with its coloured underlines, then the right column's thread. The Avatar first reads as the ring and figure, then the dated list on the left. Order is right on both. First cut lost the plot on the Avatar: a class name `.lg` for the legend collided with the icon size `.lg` and emptied every icon in the sewn row; renamed. Second cut had the ring cutting through the head; figure scaled to 4.5 units a pixel so it sits inside the ring.

Tissue test: one worked example (a founder, 46, the voice of the Diane reference person) and the Stranger state. I did not run the six reference people through it.

## Real in the product, against mock

Real: the engine reading in the Journal mock is `parseStory` run on the sample text. It returns the route throat, then heart, then solar plexus, the dwell at solar, the kink at "furious", the idiom "stayed quiet" read as one phrase, "let it go" as a coherent word, and 12 imprints across those three seats (Self-Silencing, People Pleasing, Speaking To Be Right, Interrupting; Blame, Manipulative Kindness, Hatred, Resentment; Anger, Judgment, Entitlement, Rebellion). The six mask names, their one-line definitions and their places come from `MASKS` in `engine/data/canon.js`. Seat order and heights are `PMBANDS`. Seat and section tokens are shipped Dark. The Story page's top rule, live word marks, record ring, privacy sentence and imprint-by-seat grouping exist in `ui/storyui.js` and `ui/imprints.js`. The shipped Avatar has the Becoming and Archetypes subtabs, To release and To embody boxes, the seven-point ring, "Add to your avatar", Cycles and Rituals.

Mock (does not exist yet, or exists only as data):

- Feel step and where-in-the-body step before the story. Not in `ui/storyui.js`.
- The mirror line, "That is me", "Not quite", and the correction path. Nothing writes or reads an accept or reject.
- The entries list with where each entry went. The engine keeps entries (`CURP.story.entries`); nothing joins an entry to its imprints, release, practice and statement.
- The practice and statement per entry. `ui/ritual.js` does not take a span; `span`, `graft` and `affirm` are designed in `DESIGN-gamification.md` s5.4, not built. The hedge is the one place a word is written, and it is shown struck.
- The figure, the ring around it, the thread, "since your last visit", and the early and now pair. No code draws any of them. The figure has "no data path" (`REVIEW-skin/TALLY.md` item 12).
- Dated facts (13 Sep release of Anger, and so on) are invented. `meterFirst` in `ui/release.js` stamps the first touch of a place with a date, which is the real source for the lit seats. No dated record exists for ritual days kept or "held".
- "Read again" (Embody lit) needs a stored time of the last reading after a release. Not stored.
- The sewn row's live facts come from the Avatar, ritual, imprints and story, joined by hand in the mock.
- The kundalini thread has no surface (`built:false` in the tier table).
- Lock on the masks. The tier for the masks is open (round OK).
- The unlit-line "Held" fact: the Held award family is designed (`DESIGN-gamification.md` s6), not built.

## Slices to build each page for real (S under a day, M two to three, L a week)

Journal

1. S. Retire the "Source AI" label and move the prompt line to "What is here?". Copy only.
2. M. Feel step: chips (an existing list of feeling words), stored on the entry as `feel`. Needs a word list ruled (the nine emotion words already in the engine are not the same as the seven shown).
3. M. Where step: three tap zones on the one figure (needs the figure, Avatar slice 1). Stored as `where`. Open: which seats each torso covers.
4. S. Story card as in `DESIGN-story.md` s9 (rise, 62 to 72ch, top rule, record ring under the text). Mostly built; this is moving the privacy line and the key.
5. M. Mirror line: one sentence assembled from `parseStory().path` and the hits (no new arithmetic), the verbatim quote row, accept and reject stored on the entry. Voice gate on the sentence. Reject needs a "read again" path, which is L and not in this slice.
6. M. Entry record: join each entry to its imprints, queued releases, ritual practice and statement. A derived view over existing data plus three fields on the entry.
7. M. Right column "Where this goes" and the entries list from that record. Closed state for a stranger is S.
8. L. Practice and statement from the entry: `span`, `graft`, `affirm` in `engine/schema.js` and `ui/ritual.js`, with the hedge frame and its tests (`DESIGN-gamification.md` s5.4).
9. S. Drop the "Commit N" count and the five group tabs from the Story page (rulings already given).

Avatar

1. M. The figure: one SVG function reading `PMBANDS` plus a list of lit places, pre-drawn once per change. Used by Avatar, Where step, Summary. Pencilled when unread.
2. M. A dated record of facts: first release per place (`meterFirst` already stamps), ritual days kept, a "held since" date. Append only.
3. M. The ring: one function, drawn small in the bar and large on the Avatar page; a quarter lit by its newest dated act. Needs the dated record.
4. S. "Since your last visit": stored last visit time, then a diff over the dated record, written as plain sentences. Voice gate.
5. M. Sewn row and "In your words" tidy: join avatar sentence, next ritual, patterns in the way, places, last story. All data exists; the join is new.
6. M. Early and now pair: needs a stored first state or a way to draw the figure as at a past date from the dated record. Cheap once slice 2 is done.
7. S. Masks strip with the one sealed mark; names and lines are already data. The drawn masks stay on Character at tier three.
8. L. Kundalini thread as the owner described it (blocked or open, from the reading), after he decides conflict 4.
9. S. Unread screen (hero sentence, pencilled figure, four doors).

Order that moves the owner furthest soonest: Avatar 1, 2, 3 (a figure and a ring he can see), then Journal 4, 5, 6, 7.

## What I could not verify

- `proto/` is not in this sparse checkout, so I read `proto/story4` and `proto/avatar` only through their design documents and did not open the old prototypes.
- No gate was run (`tests/design.js`, `tools/terms.py`, the voice checker): they need `atuned_src/` build products and these are mockups. Voice was checked by hand: no em dashes, no capitals words, sentence case, no "Source AI", no "we".
- Dark only. Snow, Punch and Glass are not drawn. Snow needs its seat colours re-measured on paper.
- Animation is breathe (4.2 s) and one pulse on the newest act; the screenshots are still frames. Reduced motion turns both off.
- The "Show where it landed" panel is closed in every picture; open it in the page.
- The 390 view is the page at 390 wide in a desktop browser, not a phone.
- Facts such as dates and releases are invented for the example; the owner should not read them as a record.
