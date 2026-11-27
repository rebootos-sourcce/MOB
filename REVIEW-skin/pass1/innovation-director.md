GRADE: 52/100

Rua Whitmore, innovation. Pass 1. Read-only: I built nothing, so each crude version is a spec, not a result. Baseline `ATUNED-art-ux-icp-review.md` scored Novelty 78 and Innovation 81. It rated the design intent. I rate the pixels at 1600 and 390. That gap is the finding.

| Criterion | /10 | Evidence |
|---|---|---|
| Concept originality (what is under the glass) | 9 | 112 addresses, nine axes by seat, two cones, bilateral release script. Nobody ships this. |
| Originality of the rendered surfaces | 5 | `1600-field-loaded`: rings plus a score disc is Apple rings plus Oura. |
| Signature object on the first screen | 3 | `1600-00-first-screen`: a dead dial reading 0.0. The avatar is behind a lock (`1600-character-loaded`: empty page, one banner). |
| Motion as function | 6 | 58 `@keyframes` in `head.html`, reduced motion guarded. None reads data. |
| Material | 4 | 27 `backdrop-filter` uses, zero `feDisplacementMap`. Glass is blur plus a hairline. |
| Craft and hand signal | 4 | All vector. The one live thing is Marcus's own sentence in italics in the right rail. |
| Type ownership | 3 | Inter only. 26 distinct pixel sizes, five of them half pixels. |
| Adjacent fields borrowed | 6 | The 40/50/60 tape is a flight altitude tape. No waterfall, no goniometer, no cross bearing. |
| Truth of the novelty | 8 | `seedShare`, `unread` silence, "nothing here is generated from anything not measured". |
| Unity of the novelty | 4 | Avatar, Field, Compass and Release each invent their own world. |

THE SOUL. This is a measuring instrument that has not yet decided to look like one. The engine already behaves like avionics: it knows what it measured, what you only stated, and what it has not read. The screens behave like a dashboard. The soul is the honesty of the instrument, and the skin should make that honesty visible.

SURFACE BY SURFACE (as rendered; rivals ship the ordinary version)

| Surface | Ordinary version | Grade |
|---|---|---|
| Field | Activity rings plus a score disc (Apple, Oura, Whoop) | 6 |
| Body | Anatomy with chakra overlay (Bearable, bodygraph apps) | 6 |
| Compass | Nothing. Two volumetric cones with the person plotted. Unreadable at first sight, six overlays, no entry point | 7 |
| Story | Journal box plus an AI prompt (Rosebud, Reflectly) | 4 |
| Release | A form: Pace, Patterns, Run. The run itself (50/50/50/50, left and right ear, tone per seat) is the real product | 5 |
| Summary | A prose reading (Co-Star). The provenance line is the new part | 5 |
| Avatar page | Seven petal picker | 5 |
| Character | Shipped: empty page. Mockups (Aura Prism, Seal): the best things in the repo | 2 shipped, 9 mocked |
| Knowledge | A wiki list. One identical wave icon on all eleven laws of nature | 2 |
| Games | Paragraphs and one button. The concept (one line, six channels) is good | 3 |
| Nav | The loop as the top bar is smart. It renders as a row of four, which the ruling "a circle, never a list" forbids | 5 |

Note: the `intake` shot shows the Avatar page, so I did not see Intake. S1 to S17 are in `PANEL-10k.md`, not in the experience model.

WHAT BREAKS COHERENCE
- The centrepiece is paywalled and empty. Costs the "your avatar" promise on first contact.
- The first screen is an instrument with nothing in it. Costs the S13 quiz tourists and S7 phone-only arrivals, the two biggest segments.
- Six lightings on one skeleton. Six coats of paint, one layout. Novelty spent on colour.
- The brief bans glassmorphism and holographic tropes. `head.html` Glass is built to be exactly that. Liquid Glass shipped in September 2025. Finishing it is a rerun.

SKIN RECOMMENDATIONS (8)

1. **Set hand.** The sentence: the score is a position with a memory. Replace the 62 disc with a dial: printed band edges from `TIERDEF`, a needle, and a barometer style reference hand at the last saved day. Data: CQ now plus the daily bank. S. Moves Derek, James, S5, and S16 (a trend, not a grade). Prior art: barometer set hands. HeartMath's coherence ring failed because one praised number gets gamed. Crude: 40 lines of SVG tonight. Bad idea if people chase the ghost hand as a target.
2. **Pencil to ink.** Confidence as line quality. Charge you only stated (`seedShare`) draws dashed and pencilled. Charge your words earned draws solid. A blank profile is a pencil sketch. Knowledge does the same: untouched laws pale, touched laws inked. Data: `seedShare`, `unread`. M. Moves James, Sofia, S11, S3. Prior art: sketchiness as an uncertainty variable (Boukhelifa 2012) works, and reads unprofessional to some. Bad idea if 45 plus buyers read wobble as unfinished. Keep the wobble under one pixel.
3. **Sonar waterfall for imprints.** The sentence: what keeps coming back becomes a visible line. Replace the seven bars and the "Came back" sort with time scrolling down, seven named seat columns, brightness as charge. Recurrence is a vertical streak, a release breaks it. Data: `dlySeatItems` rungs (once, repeated, windowed), entry dates. M. Moves Derek, Marcus, S1, S6. Prior art: submarine LOFARgram. Failure: spectrograms are illegible untrained, so fixed columns and one tap annotation.
4. **Transcluded reading.** Every clause of Summary opens its source: your lines, the address, the law, lit in place. Ted Nelson's transclusion, still unbuilt. Data: `trace.js` edges. M to L. Moves James, Sofia, Angela, S11. Prior art: Roam backlinks, Wikipedia footnotes. Failure: footnote clutter, so show one source at a time. Bad idea if a clause cannot trace to one source.
5. **Goniometer for the release run.** A vectorscope plots left against right. It starts as a tight vertical line (held) and opens as the reframe plays. It plots the real audio from `sound.js` (`ChannelMerger` already splits the ears), never the body. Data: two analysers. M. Moves Derek, Marcus, S4. Prior art: mastering vectorscopes. Failure: entrainment apps draw fake brainwaves, which is the lie to avoid.
6. **Cross bearing.** Two of your own sentences that disagree draw as two lines. Where they cross is the question. Data: `contradicts` edges, `dlyContradictions`. M. Moves Angela, Diane, James. Prior art: the navigator's fix. Bad idea if it fires twice a month. A signature that rare is a footnote.
7. **Lamp test.** On first load every dial sweeps full scale, then settles to "nothing read yet", and the four doors become the labelled switches. Once per session, never under reduced motion. Prior art: the annunciator test. S. Moves S13, S7, Marcus.
8. **Instrument numerals.** A tabular, slashed zero digit face (digits only, roughly 6 to 10 KB) for every readout, and engraved caps for plate labels. Inter keeps the prose. Collapse 26 sizes to a scale of seven. S to M. Moves Marcus, S3. Failure: a mismatched second face reads as a mistake.

REDESIGN CANDIDATES (2)

- **R1. The figure is the field.** One persistent point cloud figure (Aura Prism, `mockups/character-aura`) sits under every Play surface. Field wraps rings around it, Body zooms in, Compass turns it into the cones, Character puts a mask over it. Its light is coherence, filled root up by seat. A skin cannot do this: it needs one shared render object across tabs and the avatar out from behind the tier lock (free tier gets one white light, paid adds registers). Prior art: Finch and Replika avatars are rewards for engagement. This one is a measurement, which is the only version nobody has shipped. Crude: drop Aura 1 into the Field centre, behind a flag, on real seat weights. Likely delta +10.
- **R2. The loop as the dial.** Navigation becomes a ring: avatar at the centre, four arcs, the current phase lit. It satisfies the circle ruling and removes the two level bar. I give it one in three. A ring is hard to reach at 390 and unfamiliar at 30 to 55. Build the crude one and put it in front of S5 and S11 before arguing for it.

KILLED: streak flames, points and badges (Finch, Duolingo; `ladder.js` already refuses "3 of 14"), confetti, mood gradients, a chat bubble for Source, a heatmap calendar (GitHub 2013), a seventh theme, and finishing Glass refraction.

RISKS
- Ideas 2, 3 and 4 add marks. Cognitive load is already measured as the open problem. Each must replace something, not sit beside it.
- Never plot the body from audio or from your own inference. Plot the instrument.
- A third of what I love turns out unusable. Test 3, 5 and R2 first.

GRADE DELTA, held to it: skin pack 1 to 8 moves rendered originality 52 to about 70. Adding R1 reaches about 78. The remaining gap is the Knowledge and Games surfaces, which no idea here fixes beyond idea 2.
