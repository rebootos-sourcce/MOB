# The Checklist

Every request the owner has made, and whether it is done. One file, one list,
kept current. Ruled 19 September: "Review all my inputs. Do a checklist of
what's been requested and what's been completed. The project manager will use
that to track development from here on out. I want all the development team to
add their tasks to that as they develop. As I drop stuff in, I want them to
sort it and make sure it never gets missed."

## How this file is used

- **The owner drops a request.** It is added here the same turn, before any
  code is written, so nothing is lost between the asking and the building.
- **Every seat adds its own tasks here** as it finds them. A defect found in
  passing is a line in this file, not a sentence in a report nobody reopens.
- **The project manager reads this file every turn**, decides what goes in the
  next block and what the strategy is, and only then does anybody execute.
- **Nothing is marked done without a measurement.** DONE means built, gated and
  pushed. Not written, not specced, not proposed.

Status: `DONE` built and gated. `SPEC` designed and not built. `OPEN` not
started. `HIS` waiting on a ruling. `BLOCKED` waiting on something external.

---

## A. Built and gated

| # | What he asked for | Where it lives |
|---|---|---|
| A1 | Energetics: three framings side by side | `ui/intakeui.js` |
| A2 | Diagnostic: two law cards, chakra frames, as drawn | `ui/intakeui.js` |
| A3 | Laws grouped by seat, crown to root | `ui/intakeui.js` |
| A4 | "How to answer": a ten is a hundred out of a hundred | `ui/intakeui.js` |
| A5 | Identity rolls up on save, edit reopens it | `ui/intakeui.js`, `engine/schema.js` |
| A6 | Undo and redo are just the arrows | `shell/body.html`, `ui/panels.js` |
| A7 | A standard account area, six sections | `ui/account.js` |
| A8 | Security, privacy, account, billing and tier | `ui/account.js` |
| A9 | Customer feedback and support in help | `ui/account.js` |
| A10 | The alpha questionnaire, his eleven questions | `ui/account.js` |
| A11 | Rate the product | `ui/account.js` |
| A12 | The compass opens flat | `ui/cone.js` |
| A13 | Flat, Regulation, Layers to the upper left | `ui/cone.js` |
| A14 | The lower left block comes out | `ui/cone.js` |
| A15 | Spans become a graph, lower right, opens Summary | `ui/cone.js`, `engine/ladder.js` |
| A16 | Archetypes wear their chakra colours | `engine/data/canon.js`, `ui/summary.js` |
| A17 | Benign or malignant becomes one word, Orientation | `shell/body.html` |
| A18 | SOURCE OS all caps, half a point down | `shell/head.html` |
| A19 | Lumen, the seventh lighting | `shell/head.html` |
| A20 | Lumen: paper rails and bar, vibrant, black stage | `shell/head.html` |
| A21 | Lumen: anything selected is a solid fill | `shell/head.html` |
| A22 | Summary bolds carry their family's colour | `ui/summary.js` |
| A23 | The app opens on the Field | `engine/core.js` |
| A24 | The halo is gold | `shell/head.html` |

## B. Defects found and fixed, that he did not have to ask for

| # | What was wrong | Measured |
|---|---|---|
| B1 | A release on a reference case wrote a stranger's field into his record | 50.6 of borrowed charge |
| B2 | The fetters caption said "nothing carrying yet" on every profile | Ana: 41 carrying, 41 drawn |
| B3 | Every number in the product had no font | `--num` named a face not in the build |
| B4 | Two knowledge base titles were abbreviations | `Inspired Act.`, `Disgust · Acc.` |
| B5 | The skip press also pressed the app underneath | surface 2 to 5 |
| B6 | Two scale labels were false | DQ "0 to 10" reads 54.7; pole "0 to 1" reads 8.49 |
| B7 | The canvas never went vibrant in Lumen | `bc()` did not know the lighting |
| B8 | Gate 13 never tested the seventh lighting | hand written list |
| B9 | Gate 9 counted six lightings by hand | failed because the product grew |
| B10 | Settings was in no screenshot harness | five surfaces of ten |
| B11 | `--bad` too thin to see past about fifty five | 4.01 on panel-2 |
| B12 | A profile from an older build killed the centre render | canvas 0x0, throw on `p.soul.doms` |
| B13 | The boundary refused a null avatar and dropped the whole profile | null is missing, not wrong |

## C. Specced, not built

| # | What | Spec |
|---|---|---|
| C1 | Ritual and the accountability tracker | `reviews/SPEC-ritual-accountability.md` |
| C2 | The phone build | `reviews/SPEC-phone.md` |
| C3 | The release, seven passes and nine rulings | `reviews/REVIEW-release.md` |
| C4 | The fetters surface rebuild | `reviews/FIX-fetters.md` |
| C5 | The Field and the compass, ten passes | `reviews/AD-field-compass.md` |
| C6 | The Summary rewrite and context clauses | `reviews/COPY-summary-context.md` |
| C7 | The mark and the boot | `reviews/AD-mark-and-boot.md` |
| C8 | The legal floor | `reviews/LEGAL-floor.md` |
| C9 | The knowledge base films | `reviews/IA-kb-video.md` |
| C10 | The account area's visual system | `reviews/AD-account-help.md` |
| C11 | The feedback instrument | `reviews/SPEC-feedback-instrument.md` |

## D. Waiting on a ruling from him

| # | The question |
|---|---|
| D1 | The twelve onboarding questions, sent as HTML |
| D2 | The compass: centrepiece or feature. He has ruled both ways |
| D3 | Video hosting: 15.4 MB against a one file build with no network |
| D4 | Films 7 and 8 are numbered opposite to the engine |
| D5 | Three laws carry two names, and Balance collides with the wheel strip |
| D6 | What Source AI may read |
| D7 | The mark: direction A or B |
| D8 | The boot: three seconds or five |
| D9 | Nine release rulings, including what a mask is |
| D10 | The therapy equivalence claim, before the funnel ships |
| D11 | The opening surface. He has ruled Summary, then Field, then Avatar |
| D12 | Two factor auth, yes or no |
| D13 | The soul shape. Not in the repository, cannot be drawn from |

## F. Named by him as built, and not built

| # | What | Truth |
|---|---|---|
| F1 | The funnel | `funnel/` holds one generated stylesheet. Zero pages. Two strategy documents are not a funnel |


## E. Open, in his own words, not yet started

Everything in `TASKS.md` under the eight dated notes. The project manager
promotes from there into a block each turn.
