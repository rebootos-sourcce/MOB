# Onboarding review, tally (round PJ, 2 October)

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
