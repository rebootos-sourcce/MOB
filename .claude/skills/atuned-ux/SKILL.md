---
name: atuned-ux
description: UI and UX rules for Atüned / SOURCE, derived from Yale Usability, Nielsen Norman heuristics and current practice, reconciled with this product's own rulings. Load before changing any user facing surface, copy, control or interaction in source.html or atuned_src/.
---

# Atüned UX rules

Sourced from Yale Usability's best practice set, Nielsen Norman's heuristics,
and current field practice, then reconciled with this product's standing
rulings. Where a general principle and a ruling collide, the ruling wins and
the collision is named here rather than quietly resolved.

## Measured floors. These are checks, not opinions.

    touch target        44 x 44 minimum, every interactive element
    feedback            under 1s   no indicator needed
                        1 to 3s    spinner
                        3 to 10s   progress bar, show what is left
                        over 10s   estimate, and let the person leave
    usability testing   5 people surface about 85 percent of problems

A progress indicator makes people willing to wait about three times longer.
The indicator is not decoration, it is the thing buying the patience.

## The rules, in the order they bite here

**1. One word per concept.** Yale's sharpest rule and the one this codebase
keeps breaking. Do not switch between "delete" and "remove". Audited findings:
the empty state had been written five ways, a held address five ways, clearing
three ways. Canonical terms for this product:

    the empty state     "nothing held"        never "none", "field clear"
    a held address      "held"                "running" only for a saboteur
    the person's data   "profile"             never "persona" in UI copy

Consistency is not sameness. A real distinction keeps its own word. Held,
installed and firing are three different states and stay three words.

**2. A slot keeps its label. The value carries the state.** A label that
changes identity with the data ("Heaviest seat" becoming "Field clear") makes
the person re-parse the layout every time the data moves.

**3. Provide a status, and never lie about it.** Every write that can fail
reports through `status(msg, kind)` in `ui/component.js`, the one writer. A
control must never claim success before it has it. The intake button read
"Saved" whether or not anything was written. Failures hold on screen;
confirmations clear after 2.4s, because a confirmation nobody dismissed
becomes furniture.

**4. Prevent the error, do not apologise for it.** Constrain invalid input at
the boundary rather than validating after. `loadProfile` still accepts a
charge of 9999 and throws on a missing field. Open.

**5. Undo beats confirm.** Applying a story bakes charge into the axes
irreversibly. There is no undo. Open, and the largest remaining gap.

**6. Recognition over recall.** Show the options. The person should never have
to remember a term to find a control.

**7. Less is more: remove, hide, shrink, organize, in that order.** Measured
at 57 to 71 simultaneous choices per screen on desktop. Working memory holds
about four. Open, and architectural.

**8. Accessibility is built in, not added.** POUR: perceivable, operable,
understandable, robust. Motion sensitivity is a toggle, not only a media
query. Status regions carry `role="status"` and `aria-live="polite"`.

**9. Micro-interactions are the language, not the icing.** Every action gets a
response. No dead states. This is how the interface speaks without asking
anyone to read.

**10. Never hide a control with no affordance.** An overflowing scroller with
a hidden scrollbar is indistinguishable from a missing feature. Wrap instead.

## Where a principle loses to a ruling

- **Personalisation and cross-device continuity** are out of scope. This is a
  single file with no network and no account. Storage is local and can vanish,
  which is exactly why rule 3 exists.
- **"Explain the AI's reasoning"** has no AI to explain. The equivalent duty
  here is the accuracy percentage and its interval, which already state how
  much the instrument actually knows. Do not weaken that to look confident.
- **Skeleton screens** are unnecessary. Everything computes in under 100ms
  from local data. An indicator for a 20ms operation is a lie about effort.

## Standing product rulings these sit inside

No em dashes, anywhere. Never say 108, the count is 112. Sentence case.
Mechanical and precise, no soft wellness language, physical metaphors only.
Muted palette argued from autonomic response. Icons are ring, not fill.
Single file, no dependencies, ordered concatenation. Port, do not rebuild.

## How to check

    node tools/shots.js OUT 1600 1000     render and look
    node tests/design.js                  type floor, all caps, one surface per tab
    node tests/collide.js                 no overlapping nameplates
    python3 tools/terms.py                terminology drift
