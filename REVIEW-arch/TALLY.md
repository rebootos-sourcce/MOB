# Architecture review, tally (round PK, 2 October)

Standing framework, three passes. All grades are for the proposal as it stood at that pass
(pass 1: the owner's text as written; pass 2: the merged cut; pass 3: the lead's merge with
slices). QA's pass 3 gate list is in (not signed off to build the safety slices until `tests/safety.js` exists and is red on HEAD).

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
| QA | 57 | (none) | 68 |
| Project manager | (none) | (none) | 72 |
| **Average** | **55.7** | **65.5** | **69.9** |

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
