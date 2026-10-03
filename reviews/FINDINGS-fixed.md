# What the review round found, and what was fixed on the spot

Fourteen directors reviewed the software, five passes each. Their reports are
the other files in this directory. This one records only the defects that were
verified against running code and fixed in the same sitting, and it exists
because a finding is a claim until somebody reproduces it.

Every claim below was checked before it was acted on. Two were checked and
turned out to be my own probe lying, and those are recorded too.

## Fixed

**The story recorder sent spoken stories to a browser vendor.** `stMic` in
`ui/storyui.js` uses `webkitSpeechRecognition`, which in Chrome is a network
service. The code's own error table carries "Speech recognition could not reach
the network", which proves it. A person speaks the most private thing in the
product and it leaves the device, against the ruling that the product makes no
outbound request at all. `tests/design.js` gate 7 watches page requests and
structurally cannot see a speech service. The feature is the owner's and is not
removed here; `hostfree.py` now bans `SpeechRecognition`,
`webkitSpeechRecognition`, `AudioContext`, `webkitAudioContext` and
`speechSynthesis`, which were bare globals and so passed the engine check.

**Clinical diagnoses were handed to the person they were about.** `HCX_LIB`
carries the diagnostic families each architecture corresponds to, and the card
renderer printed them: "bipolar and ADHD", "depression, BPD and anxiety",
"OCPD and paranoia". No clinician, no assessment, nothing attached. This
product reads self report out of a story somebody typed and is not qualified to
hand anybody a diagnosis. Each family now carries `d`, a behavioural line in
the product's voice, and `sub` is internal. Swept across nine personas and nine
tabs: zero diagnosis strings reach the screen.

**Jouissance was on eighty one screens.** A French psychoanalytic term as an
instrument label, with no gloss anywhere. It is overshoot.

**The summary printed the opposite of what it measures.** A glance row was
labelled "installed, what has been filled in". `SQm` is built from `sum+=n.sq`
over the loaded addresses and `n.sq` is HELD charge: an address joins `loaded`
precisely because it is carrying. Installed is the other pole and is not in the
figure at all. The second screen told people their carried load was the part of
them that had been filled in.

**A blank profile came back claiming twenty one measurements nobody made.**
`loadProfile` fills working state with a placeholder for an unmeasured law
because the arithmetic downstream needs a number, and `saveProfile` wrote the
whole of that state back. `S.law` is never null, so the first save turned
twenty one nulls into twenty one scores. Measured: a fresh profile with nothing
entered reported 21 of 21 laws measured, so `unread` was false for somebody who
had typed nothing, and every guard built to stop the product reading a stranger
off its own defaults was reading false. Two callers seed an unmeasured law and
they did not agree, 6 in the schema and 5.5 in the persona loader, so the fix
compares against the seed rather than a literal.

**The Games tab rendered an empty host.** Games was ruled back onto its own
door and `#games` moved out to be a sibling of `#know`, but the render dispatch
still called `gmRender` only on the Knowledge branch and `lgStop` on everything
else. A 903px host with nothing in it.

**The empty state outlived the emptiness.** The blank persona's `says` is the
words "Nothing has been entered yet", printed whenever it existed, so a person
who entered charge got a live reading beside a sentence swearing they had
entered nothing.

**Numerology was computed off a placeholder name.** `sumUnread` prints "a
number off a default is a number about the default and not about you" and then
called `sumNum`, which fell back to the name "You" and produced a full reading
ending in a karmic debt line. Twenty lines under the sentence forbidding it.

**An address could steal an atom's pixel.** Atoms register at `wheel.js:220`,
inside the shell loop, and addresses at `:657`. The hit scan runs backward so
the last registered wins, and an address wedge covering an atom took every
pointer. Geometry dependent, not stale: it sat correct for months and surfaced
only when the law fix moved the field a few points. Atoms now resolve first,
and only while their layer is up.

## Found, not fixed, and it is a design call

**The identification readout floats over the instrument and eats pointers.**
`.acc` is pinned over the lower right of the Field stage at the 44px tap floor.
A nine pixel atom underneath it is drawn, is resolved correctly by `hitTest`,
and cannot be hovered: `elementFromPoint` returns the button. A 44px control
above 9px targets will always take some of them. Where that readout lives is an
art direction decision and is not mine to make.

## Two probes lied, and both were mine

A sweep for clinical language flagged "anxiety" and "paranoia" on twenty two
screens. Both were ordinary English inside saboteur copy, not diagnoses. The
regex was too blunt and the retest used the exact strings from the table.

A check that the empty state still showed on a blank profile reported that it
did not. It did. `render` is deferred to an animation frame and the probe polled
at 250ms. The code was right and the instrument was early.
