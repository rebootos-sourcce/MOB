# Three scrubs, seven lenses, four fields, nine people

A full pass over the app against its own information architecture, graded, and
put in front of the panel. Every figure was measured in a running build.
Published as an artifact with four live treatments of the Field.

## Scrub one. What is on screen

    tab          chars   buttons  under the 44px tap floor
    Intake       2,554        24                        21
    Story          664        35                        27
    Field       canvas         9                         1
    Energy         839         7                         7
    Compass        267         0                         0
    Knowledge    6,319       123                        13
    Summary      5,148        34                         0

**109 simultaneous choices on one screen.** This product's own UX floor measured
57 to 71 and called it architectural. Every pass since has added.

The left rail carries 232 buttons and 20 inputs in a 906px box holding 1,143px.
The right rail holds 1,629px in the same box. Both are permanently scrolled.

## Scrub two. What happens when you press it

Every visible control pressed, result read while still on screen.

**No dead controls.** The only no-ops were already-selected tabs, which is
correct. **The Compass has no controls at all**: its whole interaction is an
undiscoverable drag, which is rule 10 broken.

Three versions of this probe lied before it told the truth. The first closed the
drill before measuring, so everything that opened a drill read as dead. The
second measured detached nodes after a re-render, so from the second click on it
was clicking orphans. Both are recorded where their findings sit.

## Scrub three. What the records promise and the code does not have

Missing, checked against an implementation marker rather than a mention:
onboarding, the tutorial, the intake gate, layer isolation on the Field, the
somatic opener, continuous integration, the web quiz, the record store, claim on
first run, auth, Stripe, the practitioner view, the consent list and revocation,
push, points and badges, the import control, the seed decay policy.

Four greps returned a comment rather than a feature and were corrected by hand:
Stripe, practitioner, onboarding and the practice table.

**And one gap nobody had written down.** Rosa reads CQ 100, Abraham 98, Wren 92.
Nothing held, nothing running, nothing to release. Every surface in this product
is built to find charge. There is no maintenance layer, so a person who arrives
coherent opens it and there is nothing to do. A product that cannot hold its own
best outcome loses everyone who succeeds at it.

## The seven lenses

    1  composition, value, focal hierarchy      6
    2  balance and framing                      5
    3  colour                                   4
    4  motion                                   4
    5  story and cross-screen unity             6
    6  canvas against DOM                       6
    7  iconography and readability              8

    overall   C+      hero   the core      weakest   Story

**Lens 3 was the priority fix and it is done.** The core's ramp returned
`rgb(204,107,48)` at CQ 39 against an accent of `#7EB8D4`. It was a heat ramp,
correct when the accent was gold, and nothing re-pointed it when the accent went
blue. That was the orange, and it survived the Punch fix because the theme was
never the thing doing it. The scale now runs alarm at the floor, neutral slate at
the median, the product's own sky at the crown, white above it.

**Lens 4, measured:** 13 transition declarations, 11 distinct durations, 2 uses
of a named easing curve. Everything else runs the browser default. One canvas
loop drives a 1.4Hz breathe and a 0.14 lerp. That is the entire motion language.

## Four treatments of the Field

    A  Instrument   the ramp corrected, one accent, depth by value      shipped
    B  Atmosphere   rings at distance, the focused layer sharp          next
    C  Tissue       the seats as bands of body, on a 5.5s breath        direction
    D  Current      charge as throughput, visibly stopped at a closed seat

A is a colour correction. B is the honest answer to layer isolation and it pays
off the zoom work already built: you do not hide the other layers, you put them
behind you. C and D are about a week each and they are what would make this look
like nothing else.

## The panel

    who          CQ  band         held  running  identified  verdict
    Diane, 46    29  Corrupt         8       18         75%  uses it today
    Derek, 39    15  Severe         20       52         82%  uses it today
    James, 57    13  Severe         18       45         79%  uses it today
    Ana, 47       8  Collapsed      41       45         84%  uses it today
    Angela, 36   41  Incoherent      0       17         75%  wants more
    Sofia, 41    57  Even            0       10         83%  wants more
    Marcus, 44   39  Incoherent      0        1         58%  over-claimed
    Gordon, 58    1  Collapsed      97       66         82%  refuses
    Rosa, 61    100  Mastery         0        0         96%  nothing to do

Weighted by the research panel weights: **50 percent use it today, 29 percent
want more, 16 percent are over-claimed, 5 percent have nothing.**

**Marcus is the finding, not the outlier.** The product identifies 58 percent of
him, holds nothing above the line, finds one saboteur, and prints the word
Incoherent in the largest type on the screen. Half the ICP roster is in that
state. The band word has to hold its tongue until the interval earns it, the way
the unread page already does.

## Gate 8, added this pass

The design gate checked the type floor and nothing checked the tap floor, which
is the other measured number in this product's own rules and the one it was
breaking in 69 places. A floor with no check is a preference.

All seven surfaces are clean now. Two rules were responsible for five of them:
`.stk-t` at 32 and `.kb-t` at 36 render on every surface in the product.

The gate measures the label where one wraps a checkbox, because a native
checkbox ignores padding and clicking its label still toggles it. That is a fact
about the platform, not an exemption.
