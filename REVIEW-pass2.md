# Code review, second record

One reviewer, five lenses, all findings verified by running the code rather
than reading it. This is not the six discipline team review that was asked
for. That team was killed by an account rate limit before it produced
anything, and this stands in for the engineering half of it only. Art
direction, narrative and product are still owed.

Every number below is measured. Where a check of mine was wrong, that is
recorded too, because a review tool that lies is worse than no tool.

## Pass 1. The centre, and what was actually wrong with it

Reported as "the centre area is not rendering". It renders. It renders
wrongly, and the cause is not in any drawing code.

The wheel canvas held a backing store that did not match its own box for the
entire session:

    on load        buffer 922 x 913   box 920 x 847.6   dpr 1
    after relayout buffer 922 x 849   box 920 x 847.6

913 rows squeezed into 847.6 is a vertical scale of 0.9284. Every circle drew
as an ellipse squashed 7.2 percent, and `U`, the radius unit everything else
is derived from, came out 456.9 where the box wanted 424.8. The wheel was
laid out for a canvas 7.6 percent taller than it had.

`layout()` measures `cv.parentElement` and runs once at init. The only thing
that re-runs it is a window resize event, and the stage changes height without
the window changing: the depth sub bar appears, a tab swaps, a webfont
arrives. Calling `layout()` a second time corrected the geometry exactly,
which is what confirmed the cause rather than merely suggesting it.

Fixed with a `ResizeObserver` on the stage, guarded against its own writes.
Verified: scale 0.9984, circles round.

**A wrong finding of mine, recorded.** An earlier probe reported all four
depths rendering identical pixels. It was reading `document.querySelector
('canvas')`, which returns the background wash canvas, not the wheel. On the
right canvas the four depths are four distinct frames with 130, 130, 142 and
167 hit zones. The depth ladder was never broken.

## Pass 2. Information architecture

Summary now renders last, after the instruments that produce it. `TABDEF` is
display order; `TAB` is identity and did not move, because those integers are
persisted and compared, and renumbering them is the bug `core.js` already
carries a warning about.

Reordering exposed three places that indexed `TABDEF` by the tab integer.
They worked only because the two orderings happened to coincide:

    panels.js  body.classList.add(TABDEF[i].cls)   wrong entry when reordered
    panels.js  aria-pressed by button position j   wrong button when reordered
    panels.js  aria-pressed at build time by i     same

All three key off `.k` now through a `TABOF(k)` lookup. This class of latent
bug is worth naming: an array whose order is coincidentally its own index is
a trap that springs the first time anyone reorders it.

**Weak area.** Five tabs and four depths give twenty surfaces, and the depth
ladder applies only to the Field tab. The other four tabs ignore `S.view`
entirely, so three quarters of that grid does not exist. The control is
global but its effect is local, which is why the sub bar has to be shown and
hidden per tab.

## Pass 3. Schema and persistence

This is the weakest area in the system, and it is the one described as the
cross-compatibility contract with SOURCE.

**There is no validation layer.** `loadProfile` trusts every field. Measured:

    missing soul         THROWS TypeError
    missing axes         THROWS TypeError
    missing laws         THROWS TypeError
    null soul            THROWS TypeError
    doms index 999       THROWS TypeError
    arcs index 99 and -4 accepted silently, reads as valid
    held charge 9999     accepted, produces DQ 11.00
    held charge -50      accepted, silently reads as empty
    v1 profile, no gates accepted correctly, CQ 36.0

`pImport` validates only `if(!o||!o.v)`. Anything past that check reaches
`loadProfile` unguarded, so a truncated, hand edited or foreign profile
crashes the app on import. The app has an import control, so this is
reachable by a user, not only by a test.

The inconsistency is as bad as the crashes: an out of range `doms` throws
while an out of range `arcs` is accepted. The same kind of field, two
different behaviours, neither of them stated.

Charge is declared 0 to 10 everywhere in the engine and clamped everywhere
except at the boundary where untrusted data enters. `loadProfile` does
`S.charge[c.nm]=a.held!=null?a.held:3` with no clamp.

**Silent data loss.** `pPersist` is `try{ STORE.set(...) }catch(e){}`. An
empty catch. When the quota is exceeded or storage is blocked, the save fails
and nothing tells anyone. The person believes their profile is saved.

**Storage growth is fine and I will not inflate it.** Measured: a blank
profile is 1,014 bytes, a history snapshot 173, a story entry 168. At ten
saves a day a 5 MB budget lasts 4.2 years. The growth is not the problem.
The rewrite is: every save re-serialises all profiles synchronously, which is
0.59 MB per save at five profiles after a year, 2.37 MB at twenty. That is a
main thread stall, not a capacity limit.

**Schema drift.** `blankProfile` declares thirteen fields. `loadProfile`
reads four. `saveProfile` writes six. `intake`, `story`, `rituals` and
`history` survive only because the same object stays in memory and is mutated
in place. Nothing restores them through the documented path, so the contract
does not actually describe a round trip.

## Pass 4. The math

The best result in this review. 525 combinations across the declared
parameter space, every held charge, coherent opposite, law score and domain:

    non finite or out of range   none

    CQ         0.00 to 100.00      DQ        0.00 to 77.09
    Ig         0.00 to  10.00      It        0.00 to 10.00
    JQ         0.00 to   9.91      Rz        1.00 to  5.15
    SQm        0.00 to   7.20      radiance  0.00 to  1.00
    accuracy  10.00 to  68.59      interval 10.50 to 21.05

No division by zero, no NaN, no clamp escape, and CQ spans its full declared
range rather than bunching. The arithmetic is sound.

The one out of range value seen anywhere, `DQ` at 11.00, came from a charge
of 9999 injected through the unvalidated loader. The math did not fail. The
boundary did.

**Weak area.** Accuracy tops out at 68.59 percent with the laws unmeasured,
which is correct, but the interval never narrows below 10.5 points. Worth a
ruling on whether an interval that wide is useful to show at the top of a
diagnostic.

## Pass 5. Dead code and hygiene

    duplicate top level keys in object literals   none
    magic integers for tab or depth               none
    top level functions never referenced          coreAt, crNode

`coreAt` in `engine/core.js` and `crNode` in `ui/component.js` are defined and
never called. Both are small. Either wire them or cut them.

**A wrong finding of mine, recorded.** The first duplicate key detector
reported `LAWSET`, `BIRTH` and `CRGEO` as carrying duplicates. It was
collecting keys at every nesting depth, so `{lg:{box,r,w}, md:{box,r,w}}` read
as three duplicates. Every hit it produced was its own artifact. Rewritten to
walk the literal and record keys only at depth zero: no duplicates anywhere,
which means the original `LEX` duplicate key bug has not regressed.

## Ranked, by what it costs to leave alone

1. **Schema validation.** Reachable crash on import, silent acceptance of out
   of range values, and inconsistent handling between two fields of the same
   kind. This is the contract another product is meant to read.
2. **The empty catch in `pPersist`.** Silent data loss is the worst failure
   mode a diagnostic can have, because the person keeps using it.
3. **Synchronous full rewrite on every save.** A main thread stall that grows
   with use.
4. **Schema round trip does not close.** Four declared fields are never read
   back through the documented path.
5. **The depth control is global with a local effect.** Twenty surfaces
   implied, five real.
6. **Two dead functions.**

Fixed in this pass: the canvas geometry, the tab order, and the three
positional assumptions the reorder exposed.
