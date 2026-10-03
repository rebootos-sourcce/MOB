GRADE: 56/100

Mika, with Sol (colour, light), Bjorn (type, grid), Petra (composition, symbol). Measured in real Chromium, 1600 and 390, "Marcus, example", 12 surfaces, 7 lightings. Palette read from `canon.js:261`. Baseline (`ATUNED-art-ux-icp-review.md`): Art Direction 88, Symbolism 90, Hierarchy 85, Coherence 94. That graded intent. I grade pixels.

| Criterion | /10 | Evidence |
|---|---|---|
| Squint order (what the eye hits first) | 6 | Field core is 3.2x brighter than anything else (good). Compass, Story, Body, Analytics land wrong (below) |
| Palette as autonomic response | 8 | Muted, 5.3 to 10.8 to 1 on panel except Root 4.14. Contrast checked per ground |
| Colour as language (one hue, one meaning) | 3 | 16 meanings on 7 hues (map below) |
| Light across the seven lightings | 4 | Field stage is near black (luminance 0.005 to 0.023) in 6 of 7, Snow included |
| Type | 6 | One face. 30 distinct sizes; 94% of 2,254 text nodes sit in nine half pixel steps from 11 to 15 |
| Grid, radii, rhythm, targets | 7 | 5 radii cover 92.6% of 1,570 rounded boxes. 0 of 1,178 targets under 44px |
| Icon craft | 8 | 647 of 647 glyph paths round capped. 0 filled icons on 12 surfaces. Stroke 1.0 to 1.5px on 90% |
| Icon meaning (one mark, one thing) | 4 | 44 of 198 glyph shapes sit under more than one label (some legitimate, like an axis and its pole) |
| Token architecture | 6 | 2,484 `var(--` uses, seats via `seatCol()` (124 sites). But `--gold` is blue, 94 uses |
| Soul on screen (loop, avatar) | 4 | Loop is a row, not a circle. Avatar figure exists only as a mockup; Character tab is padlocked |

## THE SOUL
A watch face for the body. Seven hues in a ring, one cool accent, a dark case. The Field wheel and the Body line drawing prove it: quiet, exact, lit from inside. Best when colour means place. Worst when the same colour means something else three clicks away.

## SYMBOL MAP (colours, shapes, marks I could verify)
| Mark | Means | Upstream (data) | Downstream | Clash |
|---|---|---|---|---|
| 7 seat hues | Place on the body | `NODES[].b`, 112 addresses (16/16/16/15/12/12/21 and 4 anchors) | Wheel, badges, rail, imprints, ritual tags, avatar | Also painted on: 9 axes (Solar, Sacral, Heart hold 2 each, Crown 0), 4 chain tiers (`ui.js:1401`), 4 root domains, 8 compass axes, 12 layer toggles, 6 gates (Heart up, Root down, `wheel.js:572`), 10 coherence states |
| Alarm `#FF2E1F` | Wrong | Charge past 5, over cap, shut law | Hot rings, chips | Also recording (`head.html:3979`), user heavy mark (`release.js:1141`), master numerology (`head.html:1553`), disagree border (`:1538`). 5 jobs |
| Accent `#7EB8D4` | Control, selected, CQ crown | Interaction state | 153 `var(--accent)` uses | Colour distance (OKLab; under 0.1 reads as one family) to Throat is 0.029 |
| CQ colour | Coherence value | `r.CQ` | Core disc, bars | Two languages: `cqRamp` (`wheel.js:92`) red, slate, sky; `TIERCOL` (`canon.js:697`) gold, green, teal. CQ 35 is `#8C4646` in the core and `#CFAB64` in the word. Distance 0.294 |
| Vitality, Awareness, Will | Ruled yellow, indigo, blue | `r.X, r.Y, r.Z` | Not built: bars use the value ramp (Vitality 0.42 is muted red) | Ruled hues equal Solar, 3rd Eye, Throat. Must be separated by form |
| Seat glyph | Which seat | `SEATGLYPH` | Rail, rings, Knowledge | Second full set `AV_IC` (house, waves, sun, heart, bubble, eye, star); 5 of 7 differ. Third mark on the bar |
| Axis glyph | Which of 9 emotions | `CHILD[].ic` | Rail, Knowledge | Anger bolt is the Solar bolt; Sad heart is the Heart heart; the other 7 echo nothing |
| Bolt, heart, eye, waves, radiant | See clashes | Various | | Bolt 4 meanings, heart 6, eye 6, waves 5, radiant 4 |
| Section hues (4) | Loop phase | `SECTIONS` | Top bar, Ritual panels | 0.079 to 0.112 from the nearest seat |
| Layer toggle ring | Which layer | `FB_LAYERS` | Field, Body bars | 12 layers, 8 colours. Root red on Decoherence, Character, Archetypes. Throat on Addresses, Assemblage points, Saboteurs |
| Padlock | Plan lock | `lockFor()` | Toggles, tabs | The word "tier" names three ladders: paid, chain, coherence |
| Archetype seat | Where it runs | `ARCH` and `ARCH18` | Summary, Analytics, Avatar | 11 shared names, 8 disagree (Warrior is Root in one, Solar in the other) |

Red neighbourhood alone: Root, Decoherence, Character, Archetypes, lower gates, Character tier, ramp floor, `--bad`, alarm, Embody clay, Warrior, Fear. Twelve. Root against alarm is 0.082 in Dark and 0.039 in Lumen.

## WHAT BREAKS COHERENCE (ranked)
1. **Sixteen meanings on seven hues** (Sol). Nine kinds of thing borrow seat hues, four state tokens sit on them (`--good` to Heart 0.028, `--bad` to Root 0.068), three ruled hues land on them. A person cannot learn "colour means place" when it holds half the time. Decoherence at 11%, a good reading, wears Root red.
2. **One CQ, two colours, and the verdict word fails on paper** (Sol). "Gaining" is `#6FC5C9` on `#F8F7F3`: 1.86 to 1 in Snow, 2.00 in Glass white and Lumen (`ui.js:1031`, not lighting aware). The ramp floor is red (`wheel.js:81`) while `canon.js:686` says a person who is low is not an emergency. `PANEL-10k.md` (simulated) puts 8,288 of 10,000 below CQ 50, so the hero is red-brown for most. The picked Aura mockup says "low coherence is dark, not wrong".
3. **Alarm has five jobs** (Petra). A master number in alarm red reads a positive trait as danger.
4. **Snow keeps a black stage** (Sol). Field stage `#151918` against chrome `#F8F7F3` is 16.6 to 1 apart: two suns. Paper tokens sit on black inside it, so the padlock disc and glyph are 1.0 to 1.1 to 1 (`lock.js:252`). Flag only: "Source OS" is `#343434` on `#1A1D26` in Dark, 1.36 to 1 (`head.html:834`), his own hex three times.
5. **Squint order wrong on four surfaces** (Mika). Brightest blob after a 6px blur: Compass is the rail button "Build today's ritual" (0.245) over the cone (0.108); Story is the Release panel; Body is the rail (0.066) over the figure (0.043); Analytics has four equal peaks (0.25 to 0.31).
6. **Glyph grammar splits** (Petra). Three seat sets, two partial echoes, and radiant sun means Light, Revelation, Drive and the lighting picker.
7. **Type** (Bjorn). 30 sizes where 5 would do. Ten Summary elements render in Arial: `.s-nrow` is a button and does not inherit the face. Labels print Start Case ("Need To Be Need..."), against the sentence case ruling; `DECISIONS.md:353` ruled it, so it is the owner's call.
8. **390 collision** (Petra). "Gaining" pill (x 173 to 336) and zoom buttons (216 to 310) share one 44px band; the word is 39 of 51px covered. The loop collapses to a "Play, Field" dropdown.

## SKIN RECOMMENDATIONS
| Move | Effort | ICPs |
|---|---|---|
| Reserve seat hues for place. Layer toggles take ink arcs; group (carry, run, before) shown by dash and weight. `ui/fieldbar.js`, `.fb-b` | M | S4, S12, S3 |
| Chain tiers: one hue, four lightness steps (`ui.js:1401`, `map.js:702`). Gates: held side ink, lower side dim | S | S6, S13 |
| One CQ colour: delete `TIERCOL` hues, word takes `cqRamp` lifted to AA via new `--cq-ink` per lighting. Floor becomes unlit slate, red kept for hot addresses | M | S8, S17, S16 |
| Throat `#5EBBDB` to `#3FC0D8`: 0.050 from accent (from 0.029), 0.109 from Heart, 6.81 on panel-2. Accent never inside a data mark | S | S3 |
| Alarm only for measured wrong plus the record dot. Master number to accent; heavy mark to `--bad` | S | S11, S8 |
| Stage tokens per lighting (`--stage`, `--stage-ink`) so Snow and Glass white stop mixing paper and black | M | S7, S13 |
| Scale 11, 12.5, 14, 16, 22, display 32 and 48; weights 400, 500, 600. `button{font:inherit}` | S | S3, S16 |
| Rename `--gold` to `--accent` (94 uses); `--au` stays true gold | S | all |
| Rail CTA to ring unless the rail is the page's job | S | S13, S7 |
| Draw the loop as a closed ring of four arcs in the section hues, return arrow Embody to Discover | S | S4, S6 |

Grade moves: colour language 3 to 7, light 4 to 7, squint 6 to 8, icon meaning 4 to 6, type 6 to 8. Skin alone: 56 to about 71.

## REDESIGN CANDIDATES
1. **One seat sheet** `{hue, glyph, plain name, body name}` in `canon.js`. A skin cannot do it: the seats live in three glyph tables and three name sets (Root, Ground, Muladhara). Icon meaning 4 to 8; about 71 to 78.
2. **The avatar as a figure**, unlocked, the Aura mockup (`mockups/character-aura/shots/aura-1-adult-1600.png`). The avatar is the centrepiece, yet today it is a ring of seven buttons around a house, and the figure sits behind a padlock. Soul 4 to 8.

## RISKS
- `canon.js:250` rules "hue is the language and does not move". The Throat move is a small shift. I argued separation by role, not hue.
- Neutral layer arcs weaken the colour-means-place habit S4 already has. Test with S4 first.
- Vitality yellow, Awareness indigo, Will blue are ruled and collide with seats. Bars versus rings is the only separator.
- Lumen is a named vivid exception. Sacral, Solar, Heart measure 2.61, 2.79, 3.11 on its white paper, under 3 to 1 for graphics.
- Glyph swap invalidates tooltips, Compass icons and the export contract.
