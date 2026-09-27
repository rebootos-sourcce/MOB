# Stability snapshot

Measured on this build, not remembered. Every number below came from running
the thing. Where a measurement could not be trusted, the control experiment is
named alongside it.

## Shipped and measured, 26 September

Graduated from `TASKS.md` DG to FE on his order of 27 September (FO). Every
item below is in the build, and every number was measured twice: once by the
seat that built it and once independently against the same commit, usually
in a clean worktree so no other seat's in-flight edits could leak into the
run. The letter after each item is the round that holds the full record.
Numbers are dated to their commit, because a count typed without its date is
wrong the day the product grows past it.

The last build in this set, read off the run and not carried forward:

    commit        248e5d2, build stamp a7922af 2026-09-26 22:09
    source.html   1,949,881 bytes, md5 fecb2bdd371218a2731531923efd8992
    engine        432 exports, host free
    gates         engine 1687, functional 1088, collide 298, design 158,
                  funnel 172, all passing, none failing; monitor renders
                  every surface; the voice objections check is clean

**The two routes that lost a person's own data, closed.** DG found them, DH
closed them, commit `9a5fe14`. A story's charge was lost on a visit to a
worked example and back, because the story commit never saved and a boot
never refreshed the copy `loadP(0)` reads. Measured before: 7.24 units
committed, 0.00 on disk after one visit and one save, by both the same
session route and the reload route. After: 7.24 holds through every step,
including a reload. And a store that failed to parse used to be wiped at boot
as "no profile yet". Now its bytes are copied to a key of their own, read back
to prove the copy landed, and the boot says so on the status line; if the
copy cannot be made, every write to the real key refuses by name. Measured
before: a truncated 954 byte record became a blank 1562 byte one with nothing
said. After: the original bytes survive boot, an edit and two saves.

**Two drawing defects from the same review, closed in the same commit.**
Summary tested a list for truth, which is true even empty, so a conditional
sentence printed for all fourteen reference personas; it now prints for
exactly the seven it applies to. The feathers on Field, Frames and the Dial
drew the bare answer instead of `lawNow`, the answer with its release lift;
against a law answered 5 and lifted to 9.504, all three drew 5 before and
draw the lift after, and Frames' rebuild key went stale on 8 of 8 release
steps before and 0 of 8 after (DH).

**`tools/equiv.py` reports a deletion.** It read clean when a declaration was
removed outright. It no longer does (DG).

**A birth is read at its real instant.** DL, commit `45f7203`. Before, any
birthplace outside the nine built in cities was read at Greenwich time and
printed as settled: over four years of Auckland births at 08:00, the moon sign
was wrong on 349 of 1460 days, the gene key on 830 and the sun sign on 26. A
named time zone is now read through `Intl`, which carries the whole zone
history in every browser and in node, adds no bytes, and keeps the engine host
free. Checked against published history rather than against its own output:
Auckland +13 in January and +12 in July, Britain a flat +1 through 1969,
Nepal's 1986 move from +5:30 to +5:45, and a New York clock reading that
happened twice read as a window across both offsets. A birth with no readable
place or zone carries a window from fourteen hours east to twelve west and
prints only what agrees at both ends: over 5,840 such births, zero printed
wrong.

**Rising from a zone's own point, and an untimed birth read as its whole
day.** DS, commit `2f60b02`. The zone table is tzdata 2025b's `zone.tab`, 418
rows, checked against the system copy; it grew the packed build by 8,840
bytes. Measured agreement with a real city's rising sign across a year: 85.8
percent over nineteen cities, from Chicago at 99.9 to Mumbai at 48.4. An
untimed birth used to be read at noon; measured over 7,300 days, the moon
changes sign within a calendar day 43.9 percent of the time, so it now refuses
anything that differs across the day. James, Ana and Tomas, three reference
personas who read the wrong moon under the noon guess, now read correctly.
Checked against a second, independent astronomy library over 1,500 untimed
days: six disagreements, each inside the moon formula's own 0.35 degree
margin. Named engine function coverage 96.4 percent on this run.

**A domain, a mask and an archetype on the Field open their drill.** EE,
commit `0d5fb9c`. A mask press only redrew the picture, and a domain or
archetype press went to a selection setter that refuses on a worked example.
The archetype and mask drills moved into the shared drill file, so Knowledge
and the Field read one wording each. The probe that found it was checked
against a saboteur press as a known good control before any number from it
was believed.

**Heavy load at DQ 70, the four roots' marks, archetypes in their seat
colour, and the icon tiles at the tap floor.** EF, commit `3824c63`. Under the
old threshold nine of the fourteen reference profiles were locked to entry
practices at shadow scores from 10.7 to 54.3; under his scale none are, and
Gordon, the heaviest at 54.3, reads median. Tiles went from 48.4 pixels to
the 44 pixel floor, recovering 54 pixels of rail at desk width, so the last
row of the Secondary archetype grid is on the first screen at 1000 tall.

**The root family's colour, routed through every lighting.** EM, commit
`2f563ab`. Worst case, Gordon loaded, one domain per root, before and after:
on Snow, reading root names 2.41 to 4.97, Blueprint chip icons 1.43 to 4.09,
codex badges 1.70 to 4.85; on Glass white, reading root names 2.46 to 5.09,
wheel domain arcs 1.72 to 4.58, Frames and Dial domain marks 1.77 to 5.05.
`LIGHT()` now reads Glass white as paper: ink 1.14 to 17.39, seat names 1.62
to 6.34. The probe was checked against the known values from `3824c63` before
any new number was trusted, and Dark and Lumen are pixel identical.

**The Body page draws in the palette of its own ground.** EW, commit
`a21e7c2`, on the spec given in EO, which measured Glass white's seat rings at
1.60 against a 3 floor and the domain ring at 2.22. Dark matched its shipped
screenshot; only the light ground lightings moved.

**The Compass header clears the names at phone width.** ES, commit
`255cef4`. The switch was pinned where the axis names sit only above 900
pixels wide; it joins normal flow below that. A second collision, the help
line printed over "Decoherent", closed in the same pass, and the line keeps
the drawing's own ground at 5.09 rather than 2.94 on Snow. `tests/collide.js`
now checks this header at both widths on every lighting listed at run time;
it failed fourteen times against the build before the fix.

**The glass bar is in the build.** EY, commit `8b2c3c0`, `source.html` md5
`8a5746a17479e11ea87decd01fef6e27`. `ui/fieldbar.js` is new. Wheel, Frames and
Dial sit upper right, Frames is flush, and scroll zoom, drag pan and the F key
reframe all work, checked by 22 new functional checks driving a real mouse
wheel, a real drag and a real key against the shipped file: functional 1074,
up from 1052.

**The boot plays as designed.** FC, commits `4c0e533` and `0736da2`,
`source.html` md5 `11cac6ccfaa3a7184ca45736fffa816e`. ET found why nobody had
seen it: the sheet was removed on a typed 5,450 millisecond timer while the
CSS fade began at 7.02 seconds, so the fade never played, and the Wheel's
entrance ran from 263 milliseconds to about 1.2 seconds behind a still solid
sheet. The removal now reads the fade's own animation, the fade runs 5.00 to
5.24 seconds and plays, and the Wheel's entrance starts as the sheet lifts.
`tests/design.js` 158, the earlier 150 plus eight new boot checks.

**The Field rail, rebuilt on his list.** FE, commit `248e5d2`, the build at
the head of this section. Layers on by default, SQ off the dock, DQ, CQ and
Accuracy in two rows, the left column collapsible, Energy for Spirit, motion
on the reading circles, Wheel, Frames and Dial as a floating pair upper right,
Root energetics closed above the dock, and the archetype grid from 4 by 3 to 6
by 2. Nothing was lost from the old overlay: the four depth presets live in
the Depth circle's menu. Functional 1088, with new checks on real mouse and
keyboard input.

**The marketing gate is green, and its panel reads the live engine.** FG,
commit `e5a9596`; FL, commit `3004f4d`. Bisecting every committed `engine.js`
showed the nine reference readings hold through `fbe941c` and move only at
`dd0bf23`, the CQ refit; the recorded levels in `losssim.js` were the stale
side, typed by hand. The panel is re-pinned and `losssim.js` now reads its
levels off the engine every run. `marketing/tests.js` 242 passing,
`hooksim.js --validate` five groups passing, `losssim.js` its own 49 checks
passing. Sixteen of ninety nine hook lines that genuinely failed his own
objection rules had been hidden by joining them into one call; they are
rewritten and now checked one by one.

**Delivery arrives whole.** EB and EJ. The raw build had reached 1.8
megabytes and arrived cut; packed, the same build is 887 kilobytes, and
`atuned-packed.html`, a day stale at `da6cca6`, is rebuilt with each port so
the second route serves the compressed file.

**The one gate that is not steady.** `tests/design.js`'s "Field still
animates" 30 frame floor failed under machine load five times this night (EE,
EF, ES, EW, FE), each time on a different lighting and by a different amount,
and passed every time when re-run alone. EE reproduced it on the clean commit
with nothing from any other seat nearby, and ES showed the unshipped parent
build failing it identically under the same load. Every design figure above
is the clean rerun. The product is not what failed; the measurement needs
steadying, and until it is, a single red on this check is re-run alone before
it is believed.

## The earlier snapshot

Kept as it was measured, on a build far behind the one above. Several items
under "What must be finished" have since closed, validation and undo among
them; the numbers are the build they were read from, not today's.

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
