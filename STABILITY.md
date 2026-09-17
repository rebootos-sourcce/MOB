# Stability snapshot

Measured on this build, not remembered. Every number below came from running
the thing. Where a measurement could not be trusted, the control experiment is
named alongside it.

    source.html   331.6 KB     35 modules
    engine.js     132.6 KB     1,480 lines engine, 2,539 lines ui
    gates         221 engine, 241 functional, 40 collision, 16 of 17 design

## What is solid, and will not be the thing that breaks

**The arithmetic.** 525 combinations across the whole declared parameter space
produce no non finite value, no division by zero and no clamp escape, and CQ
spans its full 0 to 100 rather than bunching.

**Engine coverage.** 96.1 percent of engine functions execute under the
headless gate. Read the unexecuted list, not the number: the birth module sat
at zero while the average read 92 percent.

**Speed of the script.** compute 0.35ms, draw 1.99ms, the whole loop body
2.56ms against a 16.7ms budget. Time to interactive 539ms.

**Memory.** Zero drift over twelve seconds of continuous animation.

**Data entry.** Every keyboard path clamps. 9999 reads 10, -50 reads 0, letters
hold the last good value. The sliders carry role, min, max and a live value,
with arrow key handling.

**Reproducibility.** The build is a concatenation and equiv.py proves it: 294
declarations, nothing added, removed or silently changed.

## What must be finished before this is stable

Ordered by what it costs to leave alone.

**1. Schema validation. The only unguarded door in the product.**
`loadProfile` throws on all four malformed profiles tested, and `pImport`
validates only that a version field exists. Everything past that check reaches
the loader raw. A truncated, hand edited or foreign profile crashes the app
through a control a person can reach. It also accepts a charge of 9999, which
is the single out of range number seen anywhere in any review. The UI clamps.
The boundary does not. That asymmetry is the whole bug.
*Shape of the work: a validate(profile) that returns errors rather than
throwing, called by pImport before loadProfile ever sees the object.*

**2. Undo. The largest gap in the product.**
Applying a story bakes charge into the axes with no way back. A person who
pastes the wrong text, or applies twice, has permanently altered their own
reading and the app offers no route out. Every UX source we have argues the
same point from a different angle.
*Shape of the work: snapshot the axes before apply, offer a revert window.*

**3. No continuous integration.**
Four gates and 522 assertions exist and nothing runs them automatically. Any
commit can break the build with none of them firing. This is the cheapest item
on the list and the one that protects all the others.
*Shape of the work: one workflow running BUILD plus the four gates on push.
Installing playwright in the runner is the only real cost.*

**4. The UI layer has no headless coverage.**
15 ui modules, 5 referenced by the headless gate. The rest are exercised only
through the browser gates, which check behaviour and layout rather than logic.
Renderers holding untested branches is how the wrong canvas got probed twice.

**5. Compositing, and it needs real hardware.**
Field measures about 100ms per frame. Not our drawing: hiding the wheel canvas
changes nothing, hiding the wash canvas drops it to 16.5ms. It is the
compositor blending a translucent full viewport layer, and this container has
no GPU. One measurement on a real machine settles whether it is a defect or an
artifact. Do not optimise it before that measurement.

**6. Google Fonts contradicts the privacy posture.**
Two outbound requests on every load, sending the person's IP to Google before
they have typed anything, in an app holding somatic self report. Self hosting
three families or falling back to a system stack removes the only network call
in the product.

**7. Cognitive load.**
57 to 71 simultaneous choices per screen against a working memory of about
four. Architectural, and it needs a decision before any code.

**8. The impure core.**
`compute()` and friends read shared state. The front door contains it from
callers but does not remove it. Deliberately deferred: purifying is a
signature rewrite and the path work showed the interface has not settled.

## What is not wrong and should be left alone

The depth ladder works, four distinct frames. All 43 pickers are reachable at
every breakpoint. Touch targets are at 44px throughout. No duplicate keys in
any data table. No horizontal page scroll at 1600, 1100, 390 or 320. The
design gate's one failure is the sandbox having no font egress.

## The honest caveat

Two probes in this session reported defects that were the probe's own bug, and
one tool shipped with a false positive rate of 14 in 15. Every number here
survived a control experiment. The compositing item is listed as unproven
precisely because its control did not settle it.
