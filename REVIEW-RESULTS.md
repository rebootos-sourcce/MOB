# Review results, 2 October: the three tallies in one place

Three reviews finished: the onboarding (and its automatic slider), the six-area architecture
(agents, 90-day journey, evidence, safety, privacy, billing), and the skin (the new look).
Each was run three times by twelve disciplines. Scores are out of 100. Passes 1 and 2 graded
what is built today. Pass 3 graded the plan on paper, so a jump from pass 2 to pass 3 is a
better plan, not a better product yet.

At a glance:
- Onboarding: shipped 38, proposal on paper 69. Silent five slide film, one decision, your
  sentence read back, the first release IS the onboarding. Mockup coming.
- Architecture: proposal as written 56, after cuts and slices 70. Built as views over what exists, not new
  services. Safety screen first. 23 slices, about 55 agent days.
- Skin: shipped 55, proposal on paper 62. One figure, one ring, one grammar. Coherence index reads 23 today.
- Not designed away by any of them: nothing detects distress, the first reading is often empty
  (11 of 16 plain sentences read as nothing), the gift is not honoured in code, a pasted record
  can grant itself tier four. All four are in the plan as J0, J10, J8, J11.


# 1. ONBOARDING


Standing framework, three passes, twelve seats (QA's measured pass 1 is still being written;
it joins the file when it lands). Passes 1 and 2 graded the SHIPPED onboarding. Pass 3 graded
the lead's merged PROPOSAL on paper, so the jump is a change of subject, not a measured gain.

| Seat | Pass 1 (shipped) | Pass 2 (shipped) | Pass 3 (proposal, on paper) |
|---|---|---|---|
| Art direction | 38 | 38 | 74 |
| UX | 42 | 39 | 76 |
| Copy and type | 40 | 37 | 74 |
| Brand | 37 | 35 | 71 |
| Systems | 42 | 40 | 61 |
| Animation | 46 | 42 | 71 |
| Innovation | 36 | 28 | 58 |
| Mechanics and stickiness | 36 | 34 | 66 |
| Technical | 61 | 58 | 74 |
| Marketing | 38 | 34 | 58 |
| Sales | 39 | 36 | 68 |
| Creative | 42 | 38 | 72 |
| **Average** | **41.4** | **38.3** | **68.6** |

The shipped onboarding averages 38. The proposal, built as written, is projected near 69.
The ceiling is held down by three things nobody can fix with paint: no distress detection,
a first reading that is often empty, and a gift that is not honoured in code.

## Rulings after pass 3 (lead; each revisable, reasons given)
1. LEAVE at the gate exists (UX, creative, mechanics): exits to the app, writes `ui.onboarded`
   true (systems: otherwise a person who refuses is replayed forever). Skip and Esc write
   nothing and land at the gate.
2. The gate prints an honest time line computed from the dwell table ("About four minutes.
   Stop any time.") (UX, creative, mechanics, copy). "Two minutes" is gone.
3. Reel A, five silent slides, about 24.5 s: A1 "Welcome to a neurosomatic experience."
   (ruled, whitelisted), A2 the ruled "Awareness and intuition is a tool we use to turn your
   senses inward." (13 words, whitelisted), A3 "This is a mirror. It shows what is running
   you.", A4 "It reads 112 addresses. Each is a place in your body." with ONE real engine row
   and a ring that opens the read-only table after the film (marketing, creative), A5 the loop
   drawn as an UNLIT circle with one travelling dot (creative, copy, animation): a station
   lights only for an act done, in Reel B. The brand not-list is not in the film (two seats
   call "not X" a defect); brand's gap is recorded.
4. Dwell max(3.0, 1.0 + words/2.5) rounded up to 0.5 s, cap 7.0; reduced motion times 1.5
   (a gate allows 30 s normal, 45 s reduced). Slide 1 holds 3.0 s.
5. The pick lights a 12 px ink SEED MARK, not a seat; hue arrives at the first Mirror line
   (creative: the tiles are topics and no table maps them to seats; seeded seats are labelled
   "Starting point: {name}" and stay unlit until the person's own words read).
6. Story: the ruled stem is the hero; the button uses the Story tab's own commit word; the
   first Mirror line names its source: "You wrote {word}" or "From your pick, not your words:
   {Start} sits at your {Seat}" (marketing, copy). Empty read: "Nothing in that matched a
   pattern. Name how it felt." with the three feeling chips beneath (marketing: acceptable
   only with chips).
7. Release: 12 lines at 4 s then the 120 s settle, his voice opens THIS screen only, shipped
   REL_WELCOME lines as captions until he confirms the ten phrases; gift counter in the stats
   corner labelled "Patterns open", changes at most twice a second; Skip lands on Reel B.
8. Reel B, the aftercare, three screens: the reading as an act with no clock; the loop and
   the word "avatar" once, 4 to 5 s; ONE gate holding "Keep this" and "Not now" at equal
   weight, the account line "Your story moves to your account. Your name and birth data stay
   on this device." (only after systems confirms it is true), the ticked box and fields only
   here and never for Guest, plus a quiet ring "Try the signal test" (chips, unanswered stored
   empty). Day 2: "Read the same place again" and one default off reminder, as a later slice.
9. Look: stage `#06060a` in every lighting; NO radial light (brand: soft light is a banned
   cliche; seat colours are the only light, and only on a lit seat); shipped `PAL` stands (his
   ruling); unlit = ink at 40 percent (3.33 to 1; 35 percent measured 2.81 and fails); hairline
   progress 2 px, track 40 percent, fill 85 percent; type 11, 13, 16, 20, 28, 44, hero 300 at
   44 and 400 at 28; transitions only 120, 220, 320, 420 ms; longer moves run on the stage
   canvas; no visual modulates between 3 and 30 Hz; Pause visible from frame one in every mode.
10. Distress: a stop frame that sells nothing (sell elements removed from the document, not
   hidden), no colour, no sound, no clock; text needs clinician sign off before any public
   launch; the screen cannot go to strangers before the reader exists (plan block J0).

## What nobody can fix by design alone (already in the plan)
J0 distress reader, J8 gift honoured in code, J10 reading coverage (11 of 16 plain sentences
read as nothing), J11 self-grant, and the engine facts in `pass3/systems-director.md` section 5.

## Build order (technical: L, about 8 to 10 agent days, nine slices; see pass3/technical)
Mockup of the auto slider first, sent to him for review while the rest is built. Then the
engine slices (`obAct`, `slStep`, `journey`), the stage and clock, the gate and story, the
release opening and voice embed, Reel B, then the gates (functional without `?dev=1`, design
gate 18, boot).


# 2. ARCHITECTURE


Standing framework, three passes. All grades are for the proposal as it stood at that pass
(pass 1: the owner's text as written; pass 2: the merged cut; pass 3: the lead's merge with
slices). QA's pass 3 gate list is still being written.

| Seat | Pass 1 | Pass 2 | Pass 3 |
|---|---|---|---|
| AI | 54 | 66 | 68 |
| Systems | 54 | 60 | 64 |
| Mechanics | 50 | 70 | 72 |
| Technical | 62 | 66 | 70 |
| Copy (safety 57, privacy 63) | 60 | 69 | 71 |
| Sales | 58 | 63 | 68 |
| UX | 58 | 64 | 70 |
| Creative | 48 | 66 | 72 |
| QA | 57 | (none) | pending |
| Project manager | (none) | (none) | 72 |
| **Average** | **55.7** | **65.5** | **69.7** |

As written the proposal averaged 56: right direction, wrong shape. The cuts took it to 66, and
the slice plan to about 70. What cut it down: no second store (a derived view instead), no
stages or days, no ranked theories about the person, no server owned meter.

## Rulings after pass 3 (lead; revisable)
1. Care holds for the page session, in memory only, never stored (creative: a person whose
   profile reads Severe would otherwise land on that word right after the card). It clears on
   reload or Continue. The Field prints no band word, Next is silent, locks and ladder stay
   gone while it holds.
2. The four doors STAY while a profile is unread (the app's standing rule: what renders there
   renders to somebody who has entered nothing); Next takes over once a reading exists.
3. The loop ring never changes with time. A quarter is lit where Next points and the date of
   the last act is written beside it. No 14 day dimming (streak guilt).
4. Care card buttons: urgent Call, Text, Continue; strong Continue, Help. No Pause on the
   card (Pause already means hold in Release).
5. Strong care keeps release open and withholds engine labels (saboteur, complex, mask);
   Medical, Substance and Danger cards close release for that entry (copy seat).
6. `p.declined` is TOP LEVEL with its own version, not inside the trace bag (systems:
   `validateTrace` refuses unknown keys, so an older build would reject the whole record);
   `TRACE_V` stays 1.
7. Interim safety: build now with a recall leaning, editable cue list for the PRIVATE build;
   clinician and counsel review gate the first public release. Copy never claims monitoring.
8. Gift: his ruling stands (whole reading visible while it lasts); the gift end copy says
   plainly what is kept and what rests, with no countdown.
9. Tier four stays closed to purchase ("Opens with the lead suite") until built.
10. Entitlements follow the SIGHT table, not "sight is not for sale" (reversed 1 Oct); a
    downgrade keeps opened ground, layer sight follows the current tier; the Worker does not
    hold the list of opened ground.

## The slice plan
`pass3/project-manager.md` holds the single merged table (P01 to P23 for MVP, L1 to L5 later),
the hot-file order, the cut line and the estimate. It is copied into `PLAN.md` section K.
About 55 agent days of build, 67 with rework, 82 with the other plan blocks; 18 to 32 working
days wall clock with four builders. Two owner actions: Stripe price ids and secrets (P06) and
booking a clinician and counsel review before the first public launch.


# 3. SKIN


Standing framework, three passes, twelve seats (QA's measured pass 1 is still being written;
it joins when it lands). Passes 1 and 2 graded the SHIPPED product, measured against the
screens as built. Pass 3 graded the lead's merged PROPOSAL on paper.

| Seat | Pass 1 (shipped) | Pass 2 (shipped) | Pass 3 (proposal) |
|---|---|---|---|
| Art direction | 56 | 60 | 70 |
| UX | 51 | 47 | 62 |
| Copy and type | 68 | 58 | 64 |
| Brand | 56 | 58 | 66 |
| Systems | 39 | 38 | 44 |
| Animation | 70 | 66 | 68 |
| Innovation | 52 | 51 | 58 |
| Mechanics and stickiness | 48 | 44 | 55 |
| Technical | 56 | 60 | 68 |
| Marketing | 52 | 49 | 63 |
| Sales | 58 | 55 | 63 |
| Creative | 58 | 55 | 66 |
| **Average** | **55.3** | **53.4** | **62.3** |

The shipped product averages 53 to 55. The skin as proposed projects near 62 on paper;
systems grades its own discipline lowest (44) because the counts are ugly: no type scale token
exists, the accent fails its own contrast floor on all seven lightings, eight of ten tier colours
sit within 0.08 of a seat colour, seat colour has two owners (about 298 `rgba` and `mixc` sites),
and the coherence index measures 23 today (projected 74 when every move lands; floors 40 for
the skin round and 65 to ship). The grade cannot reach the proposal's own 74 until the figure
has a data path and a hub big enough to read.

## The one finding under all of them
The soul is "every part of this reading can be opened and checked" (brand) and "load and the
person under it, release is the load coming off" (creative). The build keeps that half the
time: the open tables do; the Field opens on a number, the avatar is behind a lock and empty,
the loop is a row, and one colour means sixteen things.

## Rulings after pass 3 (lead; each revisable, reasons given)
1. EMBODY STAYS KNOWLEDGE (creative, evidence: `core.js` lines 142 and 228 quote his "Embody is
   knowledge"). The figure appears on every surface and tapping it opens the Avatar tab.
   "Avatar as Embody" is a redesign and his call, not this skin.
2. The ring lights the SECTION YOU ARE IN (creative); it never changes with time; a 6 px dot
   marks the newest dated act and ships when that data exists (technical: no data behind it yet).
3. TYPE: measure first. The first build step reruns the codemod on the six steps (11, 13, 16, 20,
   28, 44) through `design.js` and `collide.js`; the measured fallback is the seven steps (11,
   12, 13, 14, 16, 20, 28) which both gates passed. 12 and 14 stay as chrome-only steps if more
   than five strings wrap. Token names `--fs-1` to `--fs-9` (systems). Weights 400, 500 (numerals
   and controls only), 600.
4. COLOUR per lighting (art, systems; every figure measured on its own ground): accent dark
   `#AEBFCB` (0.089 from Throat), Snow and Glass white `#33516E`, Lumen paper `#0A5C8C`;
   unlit seat is ink at 40 percent on dark and 50 percent on Snow and Glass white; Glass white
   alarm `#D41200` and it takes `PAL_LIGHT` seats; Lumen Sacral `#EB7000` and Solar `#BD8B00`
   (hue held); alarm is never colour alone (double ring and glyph); Dark Root `#DB5B55` is
   PROPOSED (a lightness nudge on a seat hue, he ruled the palette punched up ten percent and
   "hue does not move"; held until he sees it); ONE CQ ramp per lighting with an unlit floor that
   is never invisible (dark ramp starts `#6B7384`, 3.54 to 1); Snow's stage moves to paper.
5. THE TEN EMBODIMENT BANDS KEEP TEN COLOURS (technical: `TIERCOL`, gate 15, his ruling); the
   chain tiers, practice tracks, layers, loop and paid tiers go to the one slate ramp. Because
   eight bands sit within 0.08 of a seat colour, a band mark is always a FORM different from a
   seat mark (a bar for rank, a ring for place); recorded as a known limit.
6. RADII `--r-1` 4, `--r-2` 10, `--r-3` 16, `--r-pill` 999px; `--r-xs` and `--r-s` alias `--r-2`
   for one release (systems: 4 would otherwise shrink the old 8 px visibly).
7. MOTION: `Land` is 320 ms (`--t-surface`, `--ease-land` already exist, no gate 12 edit); dial
   timing is a JS tween on elapsed time; the Compass fix is six sites in `ui/cone.js`, not one
   (spin, clock, `coneMirStep`, spin chase, zoom chase, pluck decay; at 120 Hz everything runs
   at twice the speed today); two period snaps in `ui/wheel.js` (4.49 s to 4.2 s, 9.09 s to 8.4 s).
8. LOCKS: one chip per surface, never grey, naming the RUNG ("Opens on tier one"). Sales wants
   the price on the chip; copy ruled no price in a lock tooltip. Lead: the chip names the rung and
   the one-card tier sheet one tap away shows the price; revisit after tap to Stripe is measured.
9. SOURCE OS: his `#343434` stands as his ruling; he sees the number once (1.36 to 1 on the bar
   panel, 1.56 on the page) and my proposed fix `#7F8494` (4.51 to 1); one token, `--mark-sub`.
10. THE FREE FIGURE is the unmasked "load low" posture from the Aura states (no Child, Teen or
   Ideological mask: masks classify a person and stay the paid layer), pre-drawn once per reading
   change, breath in CSS opacity, light floor 35 percent, no number on it; the dial numeral (44 px)
   sits on a plate under it. The Field hub is about 100 px today and a readable figure is 240 px
   tall, so the wheel geometry needs its own spec before the figure ships (gap).
11. FUNNEL TRUE-UP comes FIRST in the build (marketing, sales, copy): `funnel/buy.html` still says
   50 patterns (ruled 25) and "a tier is a rate of new ground and nothing else" (false since 1 Oct).
12. Engine facts the skin cannot fix: the Marcus example reads Gaining 62 on the Field while Story
   says nothing is held (one reading, two answers); the figure has no data path ("avatar" appears
   in none of the files that draw charge); day two has no pull (games seat: a Commit landing beat
   "The day is on the record.", a dashed streak ring with no count, a day-two line).

## Build order (technical's ten steps and the other seats' parts, merged)
Not skin, first: J13 copy, J9 truth, J5 masks by tier, J3, J4 (they own the same files). Then:
S1 token layer and type codemod (S), S2 canvases read tokens and `rgba` stops allocating (M),
S3 stillness while unread, the 390 pill, Compass on elapsed time (S), S4 one MOTION clock (M),
S5 pre-drawn figure (M, after J4), S6 lock mark inside P11 (M), S7 names and Embody (S, after
J5), S8 ring unlit (M), S9 unread stage (M, after P18b), S10 engine data changes with a named
`tools/equiv.py` diff (L, last). The coherence gate `tools/coherence.js` lands with S1.
