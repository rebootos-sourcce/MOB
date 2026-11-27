GRADE: 58/100

Ines Halldors, creative director. Pass 1, the whole. Evidence: the 22 loaded-profile shots (Marcus, example), `mockups/character/shots/overview-4x4.png`, `atuned_src/shell/head.html`, `core.js` TABDEF, `BRAND.md`, baseline `ATUNED-art-ux-icp-review.md`.

| Criterion | /10 | Evidence |
|---|---|---|
| Soul is stated somewhere a person lands | 7 | Summary prose ("Those do not agree.") and the rail quote carry it. The ceiling the soul rests on is printed nowhere (BRAND.md s1). |
| Four-second intent | 6 | Field first screen and Story pass. Compass, Knowledge and Games fail. |
| Skin uniformity | 5 | head.html, base64 stripped: 35 font sizes in half pixel steps, 16 radii, 119 hex values, 100 rgba values, 58 keyframes, 7 lightings. |
| Symbol system (ring, family, colour means something) | 7 | Rings hold on every shot. Seat colours run through prose and rail. The loop hues reuse seat hues for a second meaning. |
| The loop shown as a circle | 4 | Top bar is a row of four with a divider, in every 1600 shot. Embody holds one tab, Knowledge. |
| Avatar as centrepiece | 3 | Character is locked and blank (1600-character-loaded). Avatar tab is a seven point chooser with no avatar in it. |
| Truth, no decoration as data | 6 | Dash columns on 76 codex rows. Hub numeral 62. Summary says nothing is held while the rail lists charge. |
| Atmosphere and restraint | 7 | Dark, muted, one lit object per screen on Field, Body and Compass. |
| Floor of the weakest surface | 4 | Games is one text box and a button. Character is a lock card. |
| Voice as brand | 8 | Mechanical, physical, exact. Best asset in the product. |

## The soul

One paragraph. Atüned is a flight instrument for a nervous system. It does not add anything to a person. It reads what is running them, shows it back as a wheel and a body, and subtracts it, release by release, until what is left is the one who was there before the load. That is the brand sentence: "You are already the most powerful version of yourself, and this reads what is holding it down." The engine really does this. `cqCeiling()` computes the most powerful version as arithmetic. The product is a gauge with a ceiling and a drag against it. The skin has not caught up. It draws the gauge and never draws the ceiling, so what a person sees is a dense, dark, serious dashboard of nine axes, not a subtraction heading toward someone.

One sentence. Atüned shows you what is holding you down so you can put it down and become who you already are.

## Where the whole is lying about the parts

- **The centrepiece is behind a lock.** Cause: the avatar was built as a tier feature, not as the hub. Cost: Angela and Derek reach the end of the loop and meet a paywall where a face should be. The four character mockups (seal, relief scan, charge cloud, glass) are the strongest images the team has made and none shows a base user a face.
- **The loop is drawn as a list, against the ruling.** Discover, Play, Flow, Embody sit in a row in the bar. Embody holds a reference library, so the fourth beat of the loop is a codex, not a practice. Ritual (Flow) was not in the shot set at all, so the middle of the loop was not reviewed.
- **Colour means two things.** The four loop beats are tinted violet, green, teal and orange. Those are Crown, Heart, Throat and Sacral seat colours. A person learning that orange is the sacral seat meets orange as Embody.
- **Case is two rulings.** CLAUDE.md and the brief say sentence case. head.html line 1288 title-cases headers on a recorded owner ruling. Result on screen: "Where To Start", "By Assemblage Point", "Need To Be Need..." beside sentence case labels. I am choosing sentence case everywhere, per the brief, and this is the one place two records disagree.
- **Two stores disagree on one person.** Marcus on Field is Gaining at 62 with Co-Dependency 2.5 as primary. Story and Summary say "Nothing is held above the line." I could not verify the threshold from the screen, and neither can a person. Cause: the example has charge but no committed imprints. Cost: the reading looks inconsistent in the first minute.
- **The rail never changes.** The same reading list sits beside Knowledge and Games, where it answers nothing. At 390 on Field the status pill collides with the zoom buttons.
- **Games is an orphan.** Hidden from the bar (core.js, round KT), reachable by integer, breadcrumb reads Embody, Knowledge. CLAUDE.md says "unfolded", the bar says hidden.
- **Gaps in the shot set.** The shot named intake is the Avatar tab. The Intake tab, Ritual, Analytics and Clients were not shot.

## Grade by surface

Weights are loop centrality times first-session exposure.

| Surface | Weight | Grade | One line |
|---|---:|---:|---|
| Field | 18 | 72 | Best instrument. Hub is small in a large empty ring. No ceiling. 390 collision. |
| Story | 14 | 60 | Intent obvious. Third column is dead air, Pace and Patterns expose engine knobs, "Commit 0". |
| Summary | 12 | 64 | Truest writing in the product. A wall of prose with no picture and a contradiction. |
| Avatar (shot "intake") | 12 | 52 | Ring glyphs and seat colours are right. The avatar is not on it. |
| Body | 10 | 68 | The most beautiful single image. Does not say what is lit or what to do. |
| Compass | 8 | 62 | Striking object. Fails four seconds. Jesus, Lucifer, Moloch will lose James. |
| Character | 8 | 25 | Lock card only, with the Compass rail beside it. |
| Knowledge | 6 | 50 | Clear index. A dash in the value column of every row. Tab strip clips "Fe". |
| Settings | 6 | 62 | Clean. Email and password wells are borderless black. Reads as SaaS. |
| Games | 6 | 35 | Text and one button, no game visible. |

**Weighted total: 58/100.**

## Against the baseline

- The baseline scored 87 overall, with Art direction 88, Systemic coherence 94, Mirror-first 93, Novelty 78 and Innovation 81. It scored the TDD, the concept and a simulated focus group. I score pixels. Like for like on "overall product experience" I give 64, so the baseline ran about 23 points high on the built thing. A scorecard where every row sits between 78 and 94 is measuring intent.
- **Moved up:** the first screen is now a mirror before it explains anything. A stranger sees "Nothing has been read yet. Four ways in." and four doors. The rail speaks in the person's own words. Voice is far stronger than the baseline had it.
- **Did not move:** novelty. The baseline wanted a living mirror, before and after, a constellation, a contradiction moment, and no progress bar. The constellation exists only as a mockup (layer-observatory). The product answers "kill the progress bar" with a hub numeral, 62%, and "Tuned".
- **Moved down:** Systemic coherence 94 to about 62, because the skin is forty rounds of local fixes. Art direction 88 to 64. The baseline's "one visual world" is still two: mythic masks in mockups, a dashboard in the build.

## ICP sample

Drawn from `atuned_src/engine/data/people.js` (Marcus, Diane, James, Derek, Sofia, Angela) and the screens above.

- **Marcus** stays on his own line ("It has cost me two studios"), then counts the font sizes. Fails "designed, not assembled".
- **Diane** wants consequence. Story to release is her path. Compass and Knowledge cost minutes she will not spend.
- **James** needs evidence. The Summary footer ("Nothing here is generated from anything the instrument has not measured") is his hook. Compass names are his exit.
- **Derek** wants a ladder. Sees dials, a 62, Character locked and Games empty. No progression visible.
- **Sofia** is won by Body. Wants a lit location named on it.
- **Angela** is safe on the first screen. A percentage that says "Tuned" and a lock on the avatar both read as being graded.

## Moves

1. **Finding:** the ceiling is not drawn. **Cause:** `cqCeiling()` is read at release and rendered nowhere. **Move:** a thin outer arc on the Field hub from the reading to the ceiling, labelled "to your ceiling", fed by `cqHeadroom()`. **Cost:** M, a new arc and one label. **Delta:** Field 72 to 80, Summary 64 to 68, soul criterion 7 to 9.
2. **Finding:** the avatar has no face. **Move:** ship the Seal from `mockups/character` on the Field hub, the Avatar tab and the Summary header, as ring-line SVG. The full Character page stays on its tier. Seal, not Glass: Glass is faceted 3D and off family. **Cost:** M to L, the risk is clutter on the hub. **Delta:** Avatar 52 to 70, Character 25 to 45.
3. **Finding:** 35 type sizes, 16 radii. **Move:** one scale, 11, 12, 13, 14, 16, 20, 28, 40, and radii 4, 10, 16, 999, mapped in head.html. **Cost:** M, layout shifts the gates will catch. **Delta:** skin uniformity 5 to 8, coherence about +10.
4. **Finding:** the loop is a list and borrows seat colours. **Move:** one ring glyph of four arcs that closes, the active beat filled, in four neutral tints that are not seat colours. **Cost:** S to M. **Delta:** loop 4 to 7.
5. **Finding:** two stores disagree. **Move:** name the threshold in Summary's line, or ship the example with imprints. **Cost:** S. **Delta:** truth 6 to 7.
6. **Finding:** Games and Knowledge are the floor. **Move:** show a dealt card above the fold on Games, or take the door away and say so. Make the rail follow the surface. **Cost:** S to M. **Delta:** Games 35 to 55, Knowledge 50 to 58.
7. **Finding:** the Story column is dead air. **Move:** hide Pace and Patterns behind a tune control, drop the count from "Commit 0". **Cost:** S. **Delta:** Story 60 to 68.

## Redesign candidate

One only. The top bar plus section tabs, as the loop ring. A skin cannot do it because it changes what the bar is, from a menu to a diagram of the product's own mechanic. Everything else is a reskin.

## Risks

- Seven lightings multiply every token change by seven. Do Dark first, then verify Snow and Lumen.
- An avatar on the hub moves the object people learned. Keep the 62 inside it.
- I judged stills. Motion, sound and Ritual are unreviewed.
