# The full MVP review, round RA, 3 October. Ten seats, graded against the real build

He asked for a review across every discipline, graded, with focus-group/ICP feedback. Ten seats
ran in parallel, each against the real built app (not the docs describing it), each told to run
the actual gates and look at actual screenshots rather than assume. Every number below is the
agent's own, independently reported; nothing here was smoothed before this table.

| Seat | Scope | Grade |
|---|---|---|
| AI director | Algorithms, the sniffer, the trace graph | 61 |
| Systems director | Schema, the validation boundary | 64 |
| Technical director | Architecture, performance, the deploy pipeline | 66 |
| Sales director | The paywall, tiers, Stripe | 46 |
| UX architect | User experience, the stranger's path | 58 |
| Art director | Visual design and art direction | 64 |
| Sound director | Sound design | 62 |
| Narrative director | Content, copy, terminology | 64 |
| Creative director | The whole: is it becoming what it says it is | 58 |
| ICP focus group | Six real buyer personas on the real screens | 52 |
| **Average** | | **59.5** |

A 59.5 average means: real engineering underneath, several things that would embarrass the
product in front of a real buyer today, and two that would have cost real money before this
round. Read the two already-fixed items first, they're done. Everything else is open.

## Fixed this round, already pushed, waiting only on his merge of PR #2

1. **Anyone could unlock every paid tier for free.** The login screen showed a "Developer
   options" box to every visitor; checking "Unlock all sight" inside it granted a real, permanent
   tier-four account, no payment, two clicks. Found by the paywall seat, confirmed directly, fixed:
   the box now renders only after a flag is set from a browser console, which no shipped control
   ever does. Verified in a real headless browser that it is gone by default.
2. **A crafted link could run code in the app.** The quiz's shareable record link loads
   automatically with no click; three fields in a saved record were checked only for being text,
   not their content, and three places wrote them straight into the page. A malicious link to a
   victim could have read their stored data and sign-in token. Found by the schema seat, fixed by
   escaping the three render sites; the deeper fix (closing what kind of text those fields accept
   at all) is real and separate, named below, not done yet.
3. Two smaller items from earlier in the night: the Story page's strike-through now agrees with
   Source AI's own reading across a sentence boundary, and the Field's jitter is dampened 30%
   further, as asked.

## The one finding every seat hit from a different angle: the quiz does not agree with the app

Named independently, in different words, by five of the ten seats:
- **UX** (the single biggest finding of the whole review): onboarding promises "your first
  release is 8 lines, read in silence, nothing speaks." One press later, the real release screen
  shows 400 of something, a 56 minute timer, and voice switched on. The thing that was promised
  and the thing that is shown do not match, at the exact moment a stranger decides whether to
  trust the product.
- **The ICP focus group**, reading the real screens as six real buyer types: the quiz gives a
  score "out of ten," twice, and scores an overall number; the app's first screen then says
  "Nothing here grades you." Five of six personas said they would leave at exactly that seam.
- **Content**: the same contradiction, read off the actual files (`quiz.html` scores out of ten;
  the app's welcome denies grading), plus CQ itself being described three different ways across
  three files (out of 210 in one table, out of 100 on screen, and whether a release even moves it
  disagrees between the glossary and the code).
- **Art direction**: the quiz and the app use a different typeface (the quiz has no embedded font
  at all, so it falls back to whatever the visitor's system has), two different wordmarks, and
  two different label styles (ALL CAPS in the quiz, Title Case in the app).
- **Creative direction**: fed the product's own six example people through the real sniffer.
  Five of six read nothing. The sixth produced four confidently-stated patterns from one word,
  with the "this is a guess" flag present in the data and dropped before it reaches the screen.

Five different seats, five different methods, one seam. That is the finding to act on first,
because it is not a matter of taste between seats, it is the same stranger hitting the same wall
from five directions.

## The second cross-cutting finding: guesses are shown as facts

- **Algorithms**: negation is read by Source AI's own advisory check, but never by the function
  that actually puts charge on the body (`parseStory`/`applyStory`). Ten negated test lines
  ("I'm not worried," "it didn't hurt") all scored real charge on a real body seat. One half of the
  engine says "nothing here," the other half draws it on the person anyway.
- **Creative direction**: a real story about being criticised at work, run through the real
  engine, came back ranked as Addiction, Lust and Shame Of Desire, primary through tertiary, with
  the "inferred" flag the engine itself sets, lost before the screen draws it.
- **UX**: the same defect on the Story page itself: an entry's side panel lists named patterns
  with no "this is a guess" marking, the exact thing onboarding's own mirror screen already does
  correctly a few screens earlier.

Three seats, one mechanism: somewhere between the engine deciding something is a guess and the
screen drawing it, the flag is dropped. The brief's own rule, "inference is not fact," is being
violated by a screen, not a philosophy.

## By seat, the next most important thing after those two

- **Paywall (46, the lowest grade).** Even after this round's free-unlock fix: a second,
  already-known hole lets an imported record self-grant tier four (tracked on purpose, needs a
  server to close, not fixed here); tier four charges $99 for a "lead suite" the code itself says
  does not exist yet; the buy page promises a referral program with no code behind it anywhere;
  the legal terms page still says "generic draft written by an AI" with unfilled blanks.
- **Algorithms/graph (61).** Beyond the negation gap above: the "how many times has this come
  back" ladder fills up for anyone who journals regularly, regardless of whether anything is
  actually recurring, so Heart and Solar Plexus will read as the root cause for any daily user.
  The sniffer's own held-out quiet-line test, re-run by this seat, let 7 of 30 deliberately-safe
  lines through ("bitter coffee," "the printer died"), not the 0 PLAN.md currently claims.
- **Schema (64).** The XSS is fixed at the render side; the boundary itself still only checks
  that several fields are strings, not what's in them, and two profiles can share one ID if a file
  is imported twice. Also: the plan to add superego/limiters as a new field (PLAN.md section M)
  is not additive as assumed. A trace node's own schema only allows four fixed keys, and a pattern
  ID must already be a body address, which the canon says superego explicitly is not. That's a
  breaking schema change, not an additive one, and it's his call either way.
- **Architecture (66, the highest grade).** The build is clean and the host-free boundary holds.
  Two real risks: the handed-over packed build is stale again (an old jitter value, the exact
  defect CLAUDE.md already named once), and the live deploy only runs the engine gate before
  going to production, skipping every browser gate that would catch a blank screen or a stuck
  boot, the two failures this project has actually shipped before.
- **UX (58).** Beyond the quiz/app seam: the door a stranger lands on first is a bare login box
  with no logo and no product name for about six seconds, and several screens (the Field, the
  Ritual calendar, Knowledge) show 40 to 64 clickable things at once against a working-memory
  floor of about a dozen.
- **Visual/art direction (64).** The funnel has no embedded font (falls back per visitor), the
  Analytics page fills shapes solid with white text that fails a basic contrast check, and the
  phone-width Field has two controls printing on top of each other on the very first screen.
- **Sound (62).** Real and better built than it's been tested: nobody has listened to it on an
  actual phone or laptop speaker yet, and the one sound that fires on a hover rather than a press
  sits on the first screen a person sees.
- **Content (64).** Two separate glossaries (`kb.js` and `gloss.js`) already disagree on what a
  saboteur is and what CQ means, and nothing checks them against each other. Before superego and
  limiter add two more terms to track, as asked about separately, one table should become the
  only source and a gate should fail anything that redefines a term outside it.
- **Creative direction (58).** The avatar is named the centrepiece but sits as a second tab; after
  a real story is committed, nothing about it reaches the avatar, the ritual, or an affirmation,
  which breaks the "content chain" the product is built around.
- **ICP focus group (52, "would not yet convert or retain").** All six personas liked the arrival
  and the quiz itself; the drop is specifically the handoff into the app. The repo's own 90-day
  simulation (`tools/ritualsim.js`) independently lands on the same number this group's reaction
  implies: about 3 in 100 still practising by day 90.

Full detail, every citation, every screenshot path: each seat's own report is in this session's
record. Say if you want the raw reports themselves rather than this summary.
