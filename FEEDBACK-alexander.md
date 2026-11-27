# Feedback session, Alexander, part two

Transcript supplied by Lance. Part one was a separate recording; its audio was
keyword spotted rather than transcribed, and those terms are noted at the end
because they change what part two means.

## The item with numbers behind it

Alexander: make people answer the whole questionnaire the first time. Fifteen
minutes, stated up front. His reasoning was trust, not completeness. A partial
answer gives an inaccurate reading, the person comes back later, the reading
shifts, and they stop believing it.

The engine already computes exactly that cost:

    laws measured    identification    interval     possible swing
     0 of 21             20.8%         +/- 19.3     38.5 points
     5 of 21             27.5%         +/- 16.6     33.2 points
    11 of 21             35.5%         +/- 14.9     29.8 points
    16 of 21             42.1%         +/- 13.5     27.0 points
    21 of 21             48.8%         +/- 12.1     24.1 points

Skipping the intake costs 28 points of identification and widens the interval
by 7.2. An unanswered profile can legitimately move 39 points once it is
answered. That is not drift and it is not a bug. It is the instrument being
honest about how little it knew. Alexander's instinct and the arithmetic agree,
which makes this the first thing to build.

Second, and this is the design consequence: the accuracy figure and its
interval are already on screen. If a person sees "20.8 percent, plus or minus
19.3" they will understand why answering matters. The number is the argument.

## Buildable now, in one file, no architecture change

**Percentages per category.** Analytics shows weighted amounts. He wants the
share: what percentage of this person each archetype is, each of the four root
domains, each mask. Archetypes matter most. The data exists, `r.aff` is already
a normalised 12 vector, and the right rail already prints a first, second and
third with percentages. This is a presentation change.

**Click into the next layer.** He expected the analytics bubbles to be
clickable into a deeper cut. The drill mechanism exists and the wheel already
routes clicks into it. The analytics surface does not.

**Turn layers on and off, one at a time.** His words: it is a lot of stuff. The
Energy tab already has per layer buttons. The Field wheel does not: its four
depths are cumulative, so there is no way to see the saboteurs alone. This is
the same cognitive load finding already logged at 57 to 71 simultaneous
choices, arriving from a person rather than a measurement.

**A tutorial that completes one whole loop.** Not a tour of the interface.
Find a pattern, release it, see it change. The practices are in the app
already.

**A somatic opener.** Turn the senses inward, feel yes and no, before anything
else. Establishes what the instrument is actually reading.

**The somatic practices are incomplete.** A content gap, not a code gap.

## Requires an architecture this project does not have

CLAUDE.md states plainly: no backend, no accounts, no network, no telemetry.
Every item below needs at least one of those.

- Notification pings, a set number of patterns a day at a chosen time
- Streaks
- A community feed, or a curated community
- Seeing other people's progress
- Cloud stored results, manager reporting, an admin portal
- A mobile app sharing a login with a web portal
- Paid desktop tier against a free pattern only tier

Part one of this recording is the backend conversation. The terms confirmed in
its audio were: web portal, mobile app, email address, log in, download, free
version, database, cloud, users, managers, results, take the test, paying,
desktop version. Taken together the two parts describe a product with accounts,
a portal, a mobile client, a shared database and payment.

That is a real fork and it is his to call. The current codebase is deliberately
a single file with no network, and the privacy posture is part of the product
given what this data is. Building any of the engagement mechanics means
choosing to become a different kind of system. Nothing in this document should
be read as a recommendation either way, only as a statement that the choice
cannot be avoided by building carefully.

## The engagement question, stated honestly

He described wanting the hook that keeps people coming back, citing an app
built to use the same mechanics against phone use. Worth naming: the loaded
UX skill in this repo commits to intrinsic motivation over extrinsic
manipulation, and habituation through genuine value rather than dark patterns.
A streak on a somatic diagnostic can serve either. The distinction is whether
the ping arrives because the person set an intention or because the system
wants the session.

## Order

1. The full intake up front, with the interval shown as the reason.
2. Percentages per category, archetypes first.
3. Layer isolation on the Field wheel.
4. Analytics drill through.
5. The tutorial that completes a loop, and the somatic opener.
6. Everything in the architecture section, after the fork is decided.
