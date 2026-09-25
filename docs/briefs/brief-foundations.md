# Section 1. The foundational visual language

Atüned / SOURCE, art direction for the desktop port.

This section is the material the screens are built from. It covers colour, light, type, symbol, space, edge, depth, texture, and the components every screen is assembled out of. It does not cover individual screens or motion choreography; other sections own those. Where a motion value is a token, it is named here so the vocabulary is complete.

Written by Mika Ueda-Salas with Sol Amadi (colour and light), Bjorn Haraldsson (type and grid) and Petra Nikau (composition and symbol). Findings carry the name of whoever found them, so there is someone to argue with.

---

## 1.0 How to read this section

**Provenance.** Every value here was read out of the shipped stylesheet and the palette tables at commit `1c021f4`, not taken from documentation. The stylesheet is `atuned_src/shell/head.html` (about 3,900 lines, 307 KB, one embedded font). The palettes are in `atuned_src/engine/data/canon.js`. The component geometry is in `atuned_src/ui/component.js`. You do not have these files. You do not need them: every value you need is written out below.

**The code wins over the documents.** Some of the project's own documents are stale, and so is one briefing this team received. When a document and the code disagree, this section gives the code's value and says what the document claimed. Three to know about now:

- The seat colours are **not** `#C4635E / #D19255 / #D4BC70 / #6FC5A3 / #65B8D4 / #8296DB / #A98BCE`. Those were the values before two saturation rulings. The shipped values are in 1.3.
- There are **seven** lightings, not four.
- The comment at the top of the stylesheet says the product uses "Lexend for prose, IBM Plex Mono for digits". Neither font is in the build. The product uses one face, Inter. See 2.1.

**How measurements were taken.** Contrast is WCAG 2.1 relative luminance, computed from the literal hex values, always against **the element's own ground** and never against the page. For translucent surfaces (Glass, Glass white), the surface was composited over its own `--bg` first. Live checks were made in Chromium at 1600 x 1000 and 390 x 844 with the most loaded reference profile open (Gordon, 58, every charge maxed, coherence 1 percent). He is the worst case for colour: every reading that can turn red is red, and every reading where high is good sits at the floor.

**Named terms.** A *seat* is one of the seven body centres, root to crown, and each one owns a colour. A *lighting* is a theme. The *stage* is the centre display area where the instruments draw. *Rails* are the left and right side columns. A *reading* is a measured value the product shows the person.

---

## 1.1 The argument under all of it

This is an instrument, not a wellness app. It measures where psychological charge sits in the body and what it costs. The person looking at it is often at their most loaded. So every visual decision starts from one question: what does this do to the nervous system of the person reading it?

That question produces three rules, and everything else in this section serves them.

1. **Colour means place.** A colour on screen names a seat, a family or a state. It is never decoration. If something has a colour, you can say why.
2. **Severity is carried by saturation and size, never by hue.** Warm hues raise heart rate, blood pressure and adrenaline. Root, Sacral and Solar are red, orange and yellow, and they carry the heaviest load in most fields. Rendered at full chroma, the product would show its most loaded people its most activating picture. So hue stays fixed, because hue is the language, and chroma comes down.
3. **Full chroma belongs to one thing: something actually being wrong.** The rest of the palette gives up its chroma so that the alarm red can mean something. If anything else goes to full chroma, the alarm stops being a signal and becomes just another colour.

Restraint here is how the thing works. The palette gives up chroma so the alarm reads. The type gives up size so that weight, space and value can carry three levels of hierarchy. The hero graphic gives up captions so the drawing does the work. Each is the same move: one thing holds back so the next thing can be read.

Two further standing rulings from the owner apply to the visual language as much as to the copy:

- **Mechanical and precise, no soft wellness language, physical metaphors only.** Visually this rules out gradients as mood, glows as reward, pastel washes, rounded "friendly" illustration and decorative iconography. Everything drawn is either a measurement or a control.
- **Sentence case, no all caps UI copy, no em dashes anywhere.** Case and punctuation are part of the look. See 2.6.

---

## 1.2 Token architecture

Every colour, radius, gap and duration is a named token. The port should keep the same names, because the names encode the job and the job is what has to survive.

**Naming rule: a token is named by what it does, never by what it looks like.** `--dim` is the second tier of information, not "grey". `--sunk` is a surface below the ground, not "darker". The one place this rule was broken is the reason it exists: `--gold` currently holds a blue (see 1.4).

The layers:

| Layer | Examples | Rule |
|---|---|---|
| Primitive | seat palettes `PAL`, `PAL_LIGHT`, `PAL_VIVID`; the tier ramp `TIERCOL`; `ALARM` | Declared once in data. The canvas cannot read CSS custom properties, so the JS palettes and the CSS tokens are kept in step by hand and a test compares them. |
| Semantic | `--bg --panel --panel-2 --sunk --edge --edge-2 --ink --mid --dim --accent --on-accent --alarm --good --bad` | Redefined per lighting. Components read only these. |
| Component | `--tap --icon-nav --tip-bg --tip-edge --tip-shadow --c --rc --tc --ax --axd` | Scoped. `--c` is "the colour of the family this thing belongs to", set inline on each element by the renderer. |

**`--c` is the most important component token in the product.** Every chip, ring, pill, icon cell and law card receives its family colour through `--c` as an inline style, and its CSS mixes all of its tints from that one value with `color-mix`. So one set of CSS rules draws seven differently coloured seats, and it works in every lighting because the renderer passes the right palette's value (see 1.3.4). The port needs an equivalent: a per-instance family colour that every tint derives from.

---

## 1.3 Colour

### 1.3.1 The seven seats

Seven seat colours, one per body centre, root to crown. This is the product's colour language. Every other colour on screen either is a seat colour or has a stated reason not to be.

There are three palettes: the same seven hues tuned for three kinds of ground.

**`PAL`, the default palette.** Used by Dark, Punch, Glass, Glass white and Flat.

| Seat | Hex | HSL (H, S, L) | on `--bg` #0C0D12 | on `--panel` #1A1D26 | on `--panel-2` #252833 | on stage #101010 |
|---|---|---|---|---|---|---|
| Root | `#D6524C` | 2.6, 62.7, 56.9 | 4.78 | 4.14 | 3.62 | 4.68 |
| Sacral | `#D8924E` | 29.6, 63.9, 57.6 | 7.52 | 6.53 | 5.69 | 7.38 |
| Solar | `#DABF6A` | 45.5, 60.2, 63.5 | 10.76 | 9.33 | 8.14 | 10.55 |
| Heart | `#5FD5A6` | 156.1, 58.4, 60.4 | 10.68 | 9.26 | 8.08 | 10.47 |
| Throat | `#5EBBDB` | 195.4, 63.5, 61.4 | 8.88 | 7.70 | 6.72 | 8.70 |
| 3rd Eye | `#7D93E0` | 226.7, 61.5, 68.4 | 6.58 | 5.71 | 4.98 | 6.45 |
| Crown | `#A77EDB` | 266.5, 56.4, 67.6 | 6.15 | 5.33 | 4.65 | 6.03 |

**Why these values** (Sol). Three things set them.

- *Chroma down, hue fixed.* The warm three sit 30 to 40 percent under full chroma, the cool four slightly under. A washed out version of the right hue reads calmer than a vivid version of a "calming" hue. Saturation drives the autonomic response more than hue does.
- *The family reads as one.* The owner ruled that some seats looked dull beside others. Root, Heart and Crown sat 10 points of saturation below the other four. Each took saturation with hue and lightness held, and the spread closed from 17 points to 7. Saturation now runs 56.4 to 63.9 and lightness 56.9 to 68.4. That narrow band is what makes seven different hues read as one set.
- *Lightness is roughly even.* No seat jumps forward because it is brighter. Lightness sits between 57 and 68 percent, and the hue does the naming.

**Contrast law for seats.** Root is the lowest, at 4.78 on the ground. On `--panel-2`, Root (3.62) and Crown (4.65) fall under the 4.5 text threshold. They are allowed there only as strokes, rings, fills and markers, which are held to the 3 to 1 graphic threshold. **A seat colour is never used as small text on `--panel-2`.** Where a seat name has to be read as text, it is mixed toward the ink (see 1.3.9).

**`PAL_LIGHT`, the paper palette.** Used by Snow only. The same hues, deepened into ink so they hold on off-white.

| Seat | Hex | HSL | on Snow `--bg` #EDEBE6 | on Snow `--panel` #F8F7F3 |
|---|---|---|---|---|
| Root | `#9B4B47` | 2.9, 37.2, 44.3 | 5.05 | 5.61 |
| Sacral | `#8E6231` | 31.6, 48.7, 37.5 | 4.47 | 4.97 |
| Solar | `#7E6C29` | 47.3, 50.9, 32.7 | 4.34 | 4.82 |
| Heart | `#2A7A5C` | 157.5, 48.8, 32.2 | 4.37 | 4.85 |
| Throat | `#2C6F88` | 196.3, 51.1, 35.3 | 4.72 | 5.24 |
| 3rd Eye | `#4C5F9E` | 226.1, 35.0, 45.9 | 5.13 | 5.70 |
| Crown | `#6E5490` | 266.0, 26.3, 44.7 | 5.29 | 5.88 |

Why: on paper, the light seats would disappear. Paper reverses the lightness relationship, so the palette moves down in lightness, not up in saturation. All seven clear 4.5 on the Snow panel. Sacral, Solar and Heart fall just under 4.5 on the bare Snow ground, so on Snow a seat carries text only on a panel.

**`PAL_VIVID`, the vibrant palette.** Used by Lumen only. It is the named exception to the muted ruling, on the owner's word: "Lumen is about vibrancy."

| Seat | Hex | HSL | on white | on stage #101010 |
|---|---|---|---|---|
| Root | `#F02E3C` | 355.7, 86.6, 56.1 | 4.07 | 4.68 |
| Sacral | `#FF7A00` | 28.7, 100, 50.0 | 2.61 | 7.28 |
| Solar | `#C79200` | 44.0, 100, 39.0 | 2.79 | 6.83 |
| Heart | `#00A85C` | 152.9, 100, 32.9 | 3.11 | 6.12 |
| Throat | `#0091C4` | 195.6, 100, 38.4 | 3.59 | 5.30 |
| 3rd Eye | `#3D5AFE` | 231.0, 99.0, 61.8 | 5.13 | 3.71 |
| Crown | `#9B27E8` | 276.1, 80.8, 53.1 | 5.46 | 3.49 |

These have to hold on two grounds at once, white paper and the black stage, and they do not fully manage it. Four seats fail as text on paper, and two fail as text on the stage. That is the cost of the vibrancy ruling. **In Lumen, a seat colour is a graphic, never text.** Sol.

### 1.3.2 Which lighting takes which palette

One lookup, written twice in the source (once for HTML, once for the canvas) so the two cannot drift:

    Lumen            PAL_VIVID
    Snow             PAL_LIGHT
    everything else  PAL

The port needs this as one function that every renderer calls, canvas and DOM alike. Glass white, the other paper lighting, deliberately takes `PAL` rather than `PAL_LIGHT`: glass puts the colour in the light rather than in the surface.

### 1.3.3 The surfaces and the inks, default lighting (Dark)

Dark is the default. Its tokens are the unscoped root declarations, and every other lighting is written as a difference from it.

| Token | Value | Job |
|---|---|---|
| `--bg` | `#0C0D12` | The ground. The frame everything sits in. Deep neutral with a trace of blue, never pure black. |
| `--panel` | `#1A1D26` | A raised surface: rails, cards, the tooltip. |
| `--panel-2` | `#252833` | The second rise: a surface on a surface, hover grounds, control grounds. |
| `--sunk` | `#090A0E` | Below the ground: wells, tracks, input fields, icon cells. |
| `--edge` | `rgba(255,255,255,.09)` | The hairline. Every divider and resting border. |
| `--edge-2` | `rgba(255,255,255,.14)` | The stronger hairline: hover borders, scrollbar thumbs, floating panels. |
| `--ink` | `#EFEDE8` | First tier of text: names, values, anything a person reads to act. |
| `--mid` | `#B4B0A8` | Second tier: body prose, resting controls. |
| `--dim` | `#94908A` | Third tier: labels, eyebrows, explanatory sublines, units. |

**Why the ground is a deep neutral and not black.** "No pure white. Off-white in light, deep neutral in dark." Pure black next to near-white type produces halation for readers with astigmatism, and it reads as a hole rather than a surface. `#0C0D12` has a slight blue cast (blue channel 18 against 12 and 13), which cools the ground by a fraction and lets the warm seats sit on it without clashing.

**Why the inks are warm.** `#EFEDE8`, `#B4B0A8` and `#94908A` all lean slightly toward yellow and red. Against a cool ground, a warm off-white reads as paper under lamplight rather than as a screen, and it avoids the clinical blue-white of a monitor default. It is the same argument as Farrow and Ball's off-whites: a white named for what it sits beside.

**Why the surface ramp was opened** (Sol, measured). The project recorded a defect here: `--bg` to `--panel` measured 1.08 to 1 and `--bg` to `--panel-2` measured 1.14. Four declared surface levels spanned a sixth of a stop, so from six feet the page squinted down to three grey slabs and the eye landed nowhere first. The fix opened the range from both ends (the ground went down, the raised surfaces went up) without lightening the product. Muted is a saturation ruling, not a contrast ruling. Measured now:

    --bg to --panel      1.15 to 1
    --bg to --panel-2    1.32 to 1
    --sunk to --bg       1.02 to 1

`--sunk` is barely below `--bg` on purpose. It reads as recessed through context, because it sits inside a raised panel, not through its own contrast against the ground.

**Why `--dim` sits where it does** (Sol, measured). `--dim` is the only token marking the third tier, so every eyebrow and label depends on it. It used to measure 3.70 on `--panel-2` and 3.92 on `--panel`, and that one value caused 104 of the 105 contrast failures on the Summary screen. It also matters more than the ratio suggests: six of the thirteen reference users are 57 or older, and contrast sensitivity drops noticeably after 55. It now measures:

    --ink on --bg 16.59   --panel 14.39   --panel-2 12.55
    --mid on --bg  8.98   --panel  7.79   --panel-2  6.79
    --dim on --bg  6.11   --panel  5.30   --panel-2  4.63

**Rule for the port:** every lighting's `--dim` must clear 4.5 on that lighting's own `--panel-2`. The table in 1.3.12 shows where that holds.

### 1.3.4 The accent, and three tokens with misleading names

| Token | Dark value | Job |
|---|---|---|
| `--accent` | `#7EB8D4` | The product's one accent. Selection, the current tab, focus, primary action, the live thing. HSL 199.5, 50.0, 66.3. |
| `--gold` | `var(--accent)` | **An alias of the accent. It is blue.** Kept because about sixty call sites read the name. |
| `--on-accent` | `#0B1418` | The ink on a solid accent fill. A cool near-black (8.60 to 1 on the accent). |
| `--au` | `#C2A063` | **Actual gold.** Used only when gold is asked for by name: the halo in the boot mark. 7.86 on `--bg`. |
| `--sky` | `#7EB8D4` | The wordmark colour. Equal to the accent in the dark lightings. |
| `--um` | `#FFFFFF` | The two umlaut dots on the wordmark. |
| `--on-flat` | `#0E1015` | The ink on a solid seat fill. One dark ink works on all seven seats (worst case Root at 4.69). |

**Why the accent is blue** (ruled). The accent was gold from the rebuild onward, and the owner never chose it. He chose this blue, which is the original app's own `--law-accent:#7eb8d4`. It sits between Throat and 3rd Eye, at lower saturation than either, so it reads as part of the seat family but belongs to no seat. That matters: the accent marks "where you are and what you can do", and it must never be mistaken for a reading.

**Why `--on-accent` is cool.** The old value was a warm near-black chosen against gold. A warm ink on a cool fill is the one detail that would still read as the old palette.

**Port instruction.** Do not reproduce the `--gold` alias. Name the token `--accent` everywhere. Keep `--au` as a separate true gold with exactly one caller. (Petra: the name `--gold` has already caused one visible defect. The boot halo was asked for in gold and rendered blue twice, because the token lied about its own name.)

### 1.3.5 Alarm, good, bad

| Token | Dark | Snow | Lumen | Job |
|---|---|---|---|---|
| `--alarm` | `#FF2E1F` | `#D41200` | `#FF1500` | Something is actually wrong. The only full-chroma value in the product (HSL 4.0, 100, 56.1). 5.23 on `--bg`. |
| `--alarm-soft` | `rgba(255,46,31,.16)` | `rgba(212,18,0,.12)` | `rgba(255,21,0,.12)` | The alarm as a ground: the wash behind a hot pill. |
| `--good` | `#68CBA4` | `#1F8560` | `#00A85C` | A kept or cleared thing: agreement lines, released rows. |
| `--bad` | `#D4736D` | `#A8413C` | `#E01B24` | A disagreement, a destructive action. **Not the alarm.** |

**The alarm law** (Petra; this was a real defect twice). A reading reddens only when a *high value is the cost*: shadow weight, carried depth, seat load, saboteur weight, mask weight. Past 90 percent of its scale, the arc stroke, the glyph and the border go to `--alarm` and the value pill's ground goes to `--alarm-soft`. A reading where *high is the person getting better* (coherence, accuracy, flow, integrity, energy, installed poles, shares, fill) **never reddens, whatever the number.** The owner's words, recorded in the code: "96 per cent flow accuracy and yet it is red. Red is a colour of danger. That is bad colouring."

The port's ring component must take an explicit "this reading can be hot" flag and default it to false for anything not on the charge list. The threshold is `HOT_AT = 90` (percent of scale). For saboteur weight on its 0 to 10 scale, it is 9 or above, or an overshoot.

**Destructive is a decision, not an alarm.** A delete button uses `--bad` text and a `--bad` border mixed 52 percent into `--edge`, with a 14 percent `--bad` wash on hover. Deleting on purpose is not something going wrong.

**Where the alarm never appears:** tier words (see 1.3.6), tooltips ("a tooltip is an explanation, and an explanation is not a warning"), and high good-end readings.

### 1.3.6 The tier ramp

Coherence is shown as one of ten bands, and each band has its own colour. Every place the band word is printed, it is printed in that colour.

| Band | Range | Hex | HSL | on `--panel` | on `--panel-2` | Argument |
|---|---|---|---|---|---|---|
| Mastery | 91 to 100 | `#E8DBA4` | 48.5, 59.6, 77.6 | 12.10 | 10.56 | Clear light. Nothing held, nothing shouting. |
| Embodied | 81 to 90 | `#8BD4A7` | 143.0, 45.9, 68.8 | 9.68 | 8.44 | Heart green opening toward the light above it. |
| Compounding | 71 to 80 | `#5FD5A6` | 156.1, 58.4, 60.4 | 9.26 | 8.08 | The Heart seat exactly, because this is where it builds. |
| Gaining | 61 to 70 | `#6FC5C9` | 182.7, 45.5, 61.2 | 8.42 | 7.35 | Between heart and throat. Moving, not arrived. |
| Even | 51 to 60 | `#5EBBDB` | 195.4, 63.5, 61.4 | 7.70 | 6.72 | The Throat seat exactly. Receptive, level. |
| Oscillating | 41 to 50 | `#7D93E0` | 226.7, 61.5, 68.4 | 5.71 | 4.98 | The 3rd Eye seat exactly. Swinging. |
| Incoherent | 31 to 40 | `#CFAB64` | 39.8, 52.7, 60.2 | 7.74 | 6.76 | Warm. A caution, not an alarm. |
| Corrupt | 21 to 30 | `#CF8958` | 24.7, 55.3, 57.8 | 5.91 | 5.16 | Warmer and lower. The warning deepening. |
| Severe | 11 to 20 | `#B58379` | 10.0, 28.8, 59.2 | 5.20 | 4.54 | Chroma coming out. Numb is less present, not louder. |
| Collapsed | 0 to 10 | `#A48986` | 6.0, 14.2, 58.4 | 5.21 | 4.55 | The colour nearly gone. The floor is quiet. |

**The argument** (Sol). The ramp runs cool and clear at the top, warms through the middle where the work is, and **desaturates at the floor instead of reddening**. Numb is not more alarming than frustrated; it is less present. A palette that shouts loudest at the bottom tells someone at the floor that they are an emergency. So chroma falls as coherence falls (59.6 down to 14.2), and collapse reads as colour going out of the picture, which is what collapse is. None of the ten is the alarm red. All ten now clear 4.5 on both panels. The two floor bands were lifted from an earlier 3.66 and 4.45 with hue and chroma held.

A band prints as a range ("21 to 30"), never as a threshold, because a threshold does not tell a person how wide the word is.

### 1.3.7 Family colours are borrowed, never invented

When a named thing belongs to a group, the group's colour is a seat colour, reused exactly.

- **The four roots**: Architect wears 3rd Eye `#7D93E0`, Engine wears Sacral `#D8924E`, Weaver wears Heart `#5FD5A6`, Witness wears Crown `#A77EDB`.
- **Nineteen domains** take their root's colour.
- **Nine charges** (Fear, Anger, Shame, Disgust, Apathy, Shock, Sad, Surprise, Anticipation) take their seat's colour.
- **Archetypes, gates, quotients** take the seat the reading is argued from.

The rule: if it has a name, it has an icon; the icon has a family; the family has a colour; the colour means something. **No new hue enters the product for a family.**

### 1.3.8 Colours that are not seat colours, and the reason for each

| Colour | Where | Reason |
|---|---|---|
| `#101010` | The render ground of the Field, Energetics (body) and Compass stages | Ruled by the owner. The three instrument surfaces draw on near-black in every lighting except Glass and Glass white, which use their own denser pane (see 1.3.10). The ruling was scoped to these three surfaces after it was first applied to the whole centre container and put a black box under Snow's dark text, where the reading paragraph measured 2.22 to 1. |
| `#000000` | The boot sheet | A title sequence opens and closes on black. A bookend that fades to the app's own ground is not a bookend. |
| `rgba(128,128,128,.22)` | The unfilled track of every progress ring | A neutral grey at 22 percent reads as an empty track on both dark and paper grounds, so one value serves all seven lightings. |
| `#3FBF7F` | The recording dot on the microphone control | "Green while it is recording, red while you are typing, ruled." A dot read before its label. See defect D8. |
| `#14151C` | Ink on a pressed root chip | Fixed dark, because all four root colours are light and `--bg` turns light in Snow. |
| `#0C0D12`, `#E8E6E1`, `#94908A` | The "script is off" notice | It must not depend on any token a script might set. |

### 1.3.9 Tint recipes

This is how the product gets a whole family of tints from one colour without adding a hue. Every percentage below is literal. The port must reproduce these mixes exactly, because the hierarchy between states lives in them. `mix(X p%, Y)` means `color-mix(in srgb, X p%, Y)`, and "clear" means transparent.

**The value chip (ring plus pill), `.cr`**

    ground           mix(--c 9%, clear)
    border           1px, mix(--c 30%, clear)
    value pill       mix(--c 17%, clear), figure in --ink
    hover (act)      ground mix(--c 22%, clear), border mix(--c 62%, clear)
    selected         box-shadow 0 0 0 2px --accent
    hot              ground --alarm-soft, border rgba(255,46,31,.45), pill --alarm-soft,
                     glyph and arc --alarm, figure stays --ink

**Why the figure is ink and not the seat colour** (Sol, measured). The pill's ground is the seat at 17 percent, and the number used to be the seat colour too, which put figure and ground in the same hue two steps apart. Root measured 2.77 to 1 at 11.5 px, and Root is the most severe end, so the worst contrast in the set fell on the reading that matters most. With ink, the worst case is now 7.22 (Solar). The hot figure went from 3.28 to 10.41. The hue still appears four times on the chip (ring, arc, glyph, border), so nothing about the seat is lost. **Measure through every translucent layer down to the first opaque ancestor.** An earlier probe composited one layer and reported 3.93 where the screen showed 3.28.

**The imprint pill, `.ip`** (a detected pattern in the person's story)

    resting          ground mix(--c 17%, clear), border 1.5px mix(--c 40%, clear), text --ink
    hover            ground mix(--c 26%, clear), border mix(--c 70%, clear)
    selected         box-shadow 0 0 0 2px --accent
    hot              ground --alarm-soft, border rgba(255,46,31,.5), figure --alarm
    child pattern    ground mix(--c 58%, clear), border mix(--c 88%, clear)
    pending (ghost)  transparent, border dashed mix(--c 45%, clear), text --mid
    inferred         border style dashed
    installed        transparent, border solid mix(--c 52%, clear), text --mid

**The child pattern rule** (Petra, ruled): "a more intense colour of the chakra colour, not a new colour." Only the seat's share of fill and border moves. No second hue, no weight change, no glow. **Why one rule works in all seven lightings:** every seat colour in every palette is darker than the two paper grounds and lighter than the five dark ones. So raising its share always moves the pill away from its ground: darker on paper, brighter on dark. The owner's ruling about paper lightings is held by arithmetic, with no second rule that could drift.

**Seat name as readable text**

    color: mix(--c 46%, --ink)

Straight `--c` put Heart at 1.5 to 1 on Glass white's paper. Mixing toward the ink darkens the name on paper and lifts it on dark, with one rule for all seven lightings.

**Grouped containers**

    law group ground     mix(--c 4%, --panel), border mix(--c 22%, --edge)
    group header band    mix(--c 9%, clear), bottom border mix(--c 26%, --edge)
    law card border      mix(--c 34%, --edge); answered 52%; open: --c
    question card        mix(--c 19%, --panel-2), border mix(--c 40%, --edge)
    finding callout      mix(--c 10%, clear), left rule 3px --c
    face-up game card    mix(--c 24%, --panel-2)
    text highlight       mix(--c 17%, clear), ring 0 0 0 1px mix(--c 26%, clear),
                         text --c at weight 600, radius 3px
    pattern rule         left border 2px mix(--c 88%, clear)
    root chip, lit       border mix(--rc 46%, clear), ground mix(--rc 13%, clear), text --rc
    root chip, pressed   ground --rc, border --rc, text #14151C, weight 600
    badge pill border    mix(--c 44%, clear)
    selection in text    mix(--accent 34%, clear)
    switch, on           track mix(--accent 34%, --sunk), border --accent, knob --accent

**Lit versus pressed** (Petra). A root chip has three states: off, *lit* because the person's selection lives inside it, and *pressed* because they clicked it. Lit is a wash, because they did not choose it, and a control that looks chosen invites them to unchoose it. Pressed is a flat fill.

### 1.3.10 The seven lightings

A lighting is not a skin. Each one is a separate position on what the interface is made of. The product enforces that no two lightings share a ground and that each one resolves all its own tokens. The switcher lists them in this order: **Dark, Snow, Punch, Glass, Glass white, Flat, Lumen.** Dark is the default.

Only the tokens that change are listed for each lighting. Anything not listed inherits Dark.

---

#### Dark. The instrument at rest.

**Register.** A clinician's room at night with one lamp on. Default for everyone. Deep neutral ground, four clear surface levels, the muted palette, one blue accent. Built for long sessions, low arousal, and a person who has just told the product something hard.

**Tokens.** As in 1.3.3 to 1.3.5. Shadow `--shadow: 0 12px 34px rgba(0,0,0,.34)`. Radii 16 / 11 / 8.

**Material.** Panels are opaque `--panel` with a 1px `--edge` hairline and `--shadow`. There is no blur. The background aura (1.7) shows faintly through the gaps between panels.

---

#### Snow. The same instrument on paper.

**Register.** A lit room, a practitioner sitting beside a client, a printout on a desk. Daytime use and shared screens. The one lighting a practitioner would choose for a session with someone else, so it must be the most legible.

**Tokens.**

    --bg #EDEBE6   --panel #F8F7F3   --panel-2 #F2F0EB   --sunk #E6E4DE
    --edge rgba(20,23,28,.11)   --edge-2 rgba(20,23,28,.18)
    --ink #16171C   --mid #4E4C48   --dim #605E59
    seats: PAL_LIGHT (see 1.3.1)
    --alarm #D41200   --alarm-soft rgba(212,18,0,.12)
    --accent #2F6E92   --on-accent #F4F8FA   --au #8A6B24
    --on-flat #0E1015   --sky #2F6E92   --um #13303F
    --good #1F8560   --bad #A8413C
    --shadow 0 12px 30px rgba(40,54,74,.12)
    root element background #EDEBE6 (see below)

**Why.** Paper, never pure white: `#EDEBE6` is a warm off-white. In Snow, `--panel` is *lighter* than `--bg`, so raised surfaces read as sheets laid on a desk. The accent deepens to `#2F6E92` to hold on paper (4.68 on the ground, 5.20 on the panel). On a deep blue fill the ink goes light (`#F4F8FA`) rather than dark. The umlaut dots cannot stay white, because they sit on the bar's paper rather than on the letter, so they take a deep blue ink, `#13303F`. The shadow is tinted blue-grey `rgba(40,54,74,.12)` rather than black, because a black shadow on warm paper reads as dirt. Snow's `--dim` was lifted from 3.47 to 6.04 on its own panel for the same reason as Dark's.

**Root element.** Snow is declared on the body while `--bg` is declared on the root. Without an explicit `#EDEBE6` on the root element, overscroll shows a dark band above a white app. The port must paint the window background with the lighting's ground.

**Illustrated art.** Raster art is inverted and darkened to sit on paper: `filter: invert(1) brightness(.32); opacity: .82`.

**See defect D1.** On the Field, Energetics and Compass, Snow's dark inks currently render on the black stage.

---

#### Punch. Nothing is outlined, everything is solid.

**Register.** Bold and graphic, poster-like. For people who find hairlines and translucency fussy and want the interface to read as blocks of colour. It is also the one lighting where the frame reacts to the reading.

**Rules.**

- Every edge is transparent: `--edge: transparent; --edge-2: transparent`.
- No outlines, no shadows. Separation is a solid step between `--panel` and `--panel-2`.
- **A selected thing is a colour fill, not a ring.** A pressed icon cell fills with its own seat colour `--c` (or the accent if it has no seat), and its glyph reverses to `--bg`. A pressed tab or view button fills with `--accent` and takes `--on-accent` text.
- The value pill is solid: ground `--c`, figure `--on-flat` at weight 600 with tracking `.01em`. A hot pill is solid `--alarm` (see D7 on its ink).
- Imprint pills: ground `mix(--c 22%, --panel-2)`. A child pattern is `mix(--c 68%, --panel-2)`, mixed against the panel because nothing in Punch is see-through.
- Keyboard focus on a text field is a solid 4px bar down the left edge, `box-shadow: inset 4px 0 0 --accent`, because there are no outlines. Buttons keep the 2px focus ring, because a bar on a pill reads as a glyph.
- The Field wheel gets `filter: saturate(1.2)`, a fifth more colour, because it is the main graphic.

**The relational ground.** Punch tints the shell toward the seat the reading names as heaviest. The renderer sets two variables on the body: `--seat`, the heaviest seat's palette colour, and `--seat-w`, that seat's charge divided by 10, clamped to 0 to 1. Then:

    --bg      mix(--seat  calc(2% + --seat-w * 6%),  #12131A)
    --panel   mix(--seat  calc(3% + --seat-w * 4%),  #171922)
    --panel-2 mix(--seat  calc(4% + --seat-w * 4%),  #20222D)
    --sunk    mix(--seat  calc(2% + --seat-w * 5%),  #12131B)

A light Throat reading gives a cool grey. A severe Root reading gives something warm and deeper. The frame is a consequence of the field, not a skin. The panel tint is capped (3 to 7 percent) because an earlier 10 percent mix put `--dim` under 4.5 at a full Root reading. The ground and sunk surfaces carry the seat, and the panels stay legible.

**The accent does not follow the seat.** It used to, and on a Sacral-heavy field every pressed control, primary button and ring turned orange. The owner never chose orange; he chose blue. The seat tints the ground and the accent stays `#7EB8D4`.

---

#### Glass. The one aimed forward.

**Register.** Holographic skeuomorphism: the direction interfaces are heading for 2027 to 2028. It is distinct from 2020's frosted glassmorphism in three ways, and the port must implement all three or the lighting reads as out of date.

1. **Refraction, not blur.** Glass bends short wavelengths further than long ones, so the edge of a real pane carries a thin spectral fringe. Every pane has a hairline that runs cool on one edge and warm on the other. Two pixels of colour, and it is the single thing that stops this reading as 2020.
2. **Light that comes from somewhere.** One source, upper left, for every surface in the product: a specular sweep along the top and a soft occlusion at the bottom. Glass with highlights in different directions on different panels is not glass, it is a filter.
3. **Depth as elevation.** Three heights. Height sets blur radius, edge luminance and shadow spread together, the way distance actually works. Nothing gets a border to say it is separate; it is separate because it is closer.

**Tokens.**

    --bg #0B0D14
    --panel   rgba(30,34,46,.55)     composites to #151922 over the ground
    --panel-2 rgba(42,47,62,.62)     composites to #1E222E
    --sunk    rgba(14,17,26,.50)
    --edge rgba(255,255,255,.10)   --edge-2 rgba(255,255,255,.17)
    --ink #F3F2EE   --mid #C2BEB6   --dim #928D85
    --shadow 0 24px 64px rgba(0,0,0,.50)
    --spec     linear-gradient(160deg, rgba(255,255,255,.22), rgba(255,255,255,0) 42%)
    --fringe-a rgba(126,184,212,.55)    cool, leading edge (the accent blue)
    --fringe-b rgba(232,168,140,.42)    warm, trailing edge (a peach)

Alpha, not opacity, so whatever is behind the pane survives.

**The three heights.**

| Height | Applies to | Backdrop | Border | Shadow |
|---|---|---|---|---|
| Deepest | the stage | blur 14px, saturate 1.3 | none | none |
| At rest | panels, cards, rails | blur 26px, saturate 1.65 | 1px `--edge` | `--shadow` plus `inset 0 1px 0 rgba(255,255,255,.13)` |
| Raised (anything a person summoned: sheets, drills, menus, the compass card) | | blur 38px, saturate 1.8 | 1px `--edge-2` | `0 34px 90px rgba(0,0,0,.58)` plus `inset 0 1px 0 rgba(255,255,255,.19)` |
| Controls (small panes) | buttons, view toggles, icon cells, chips | blur 12px | 1px `--edge` | none. Ground `rgba(255,255,255,.055)`, hover `.10` with `--edge-2` |

**Specular and fringe, per pane.** Two overlay layers on each panel, clipped to its radius, taking no pointer events:

- Specular: fill `--spec` with blend mode `screen` at opacity .85.
- Fringe: a 1px ring drawn by a `linear-gradient(150deg, --fringe-a, transparent 38%, transparent 62%, --fringe-b)` masked to the border only, at opacity .75.

**Other Glass rules.**

- The primary button is 82 percent accent with a 90 percent accent border, and the ink is `--on-accent`.
- The value chip is a lens over the ground: ground `rgba(255,255,255,.05)`, border `mix(--c 34%, rgba(255,255,255,.14))`, pill `mix(--c 26%, rgba(255,255,255,.08))`.
- The top bar and sub bar are `rgba(255,255,255,.035)`.
- A selected view button has no fill and no border (colour and weight only).

**Why the ground stays neutral.** Punch tints the shell toward the heaviest seat. On a Sacral-heavy field that turns the app brown, which is the orange the owner has ruled out twice. Glass puts the colour in the *light* instead. The aura canvas behind the panes is already seat-derived and moving, so a heavy Sacral reading shows as a warm glow through the glass rather than as a warm surface. The light carries the reading; the material does not.

**The frame-rate exception, and it is a hard rule.** Over the live Field wheel, which repaints every frame, any element with a backdrop filter must re-read and re-filter its backdrop on each frame. Measured at 1600 x 1000 on the worst-case profile, before the fix: Dark 60.5 fps, Snow 60.5, Punch 60.6, Flat 60.6, **Glass 12.0, Glass white 16.4**. Every obvious fix was tried and failed. Blur 26 down to 10 gave 12.0. Removing specular and fringe gave 12.9. Cutting 71 blurred elements to 5 gave 12.7, because the cost scales with area, not count. Layer promotion on the canvas gave 11.6 to 12.1. Stopping the wheel gave 56.7, which is the proof.

So **on the Field, and only the Field, every backdrop filter is removed**. Tint, specular, fringe, edge and shadow all stay, so the lighting is still itself. The panes get a denser ground to stand in for the blur: panels, the top bar and the sub bar become `rgba(18,20,27,.72)`, and controls become `rgba(255,255,255,.085)`. **Nothing over a continuously repainting canvas may carry a backdrop filter, in any lighting.** The port must hold 60 fps on the Field in every lighting.

**Reduced transparency.** When the OS asks for reduced transparency, panes drop the blur, take the opaque `mix(--seat 6%, #181B24)`, and lose the specular. Every surface must be legible on its wash alone. The refraction improves the lighting; it is never required.

---

#### Glass white. The same material under a different sun.

**Register.** Glass for daylight. Dark glass is lit from behind; pale glass is lit from in front. The panes stay translucent, the fringe stays, the specular strengthens, and the ink goes to paper ink.

**Tokens.**

    --bg #E8E7E2
    --panel   rgba(255,255,255,.62)   composites to #F6F6F4
    --panel-2 rgba(255,255,255,.76)   composites to #F9F9F8
    --sunk    rgba(228,226,220,.60)
    --edge rgba(20,22,28,.10)   --edge-2 rgba(20,22,28,.18)
    --ink #14161C   --mid #4A4843   --dim #6E6B65
    --accent #2F6E92   --on-accent #F4F8FA   --au #8A6B24   --sky #2F6E92   --um #14161C
    --shadow 0 20px 52px rgba(20,22,28,.14)
    --spec     linear-gradient(160deg, rgba(255,255,255,.85), rgba(255,255,255,0) 46%)
    --fringe-a rgba(47,110,146,.42)   --fringe-b rgba(198,132,96,.34)
    stage background #F2F1EC
    panel backdrop: blur 10px, saturate 1.2

**Why the blur is lower than dark Glass** (26 there, 10 here). On a light ground a heavy blur reads as fog; on a dark ground it reads as depth. The stage is `#F2F1EC`, not the black render ground, so the instruments draw on light glass in this lighting. On the Field, panels go to `rgba(255,255,255,.86)` and controls to `rgba(255,255,255,.72)`, with no backdrop filter.

---

#### Flat. Made of nothing, and only the reading is real.

**Register.** The opposite of Glass, deliberately. Where Glass says the interface is made of something, Flat says it is made of nothing. High-end flat is not an absence of effort; it refuses to spend any effort on the surface. For people who want a pure instrument: data on a plane.

**Tokens.**

    --bg #0A0B0E   --panel #121419   --panel-2 #181B22   --sunk #0A0B0E
    --edge #232730   --edge-2 #2E333E        (solid hairlines, not alpha)
    --ink #F7F6F3   --mid #A9A69F   --dim #878378
    --accent #5FD4C4   --on-accent #05100E   --sky #5FD4C4   --um #F7F6F3
    --shadow none
    radii 4 / 4 / 3
    stage background #0A0B0E

**Rules.**

- No bevel, blur, translucency, shadow or gradient, enforced on every element.
- Every radius drops to 4px (3px for the smallest), and every edge is one solid pixel.
- **No outlines on buttons, anywhere** (ruled). A control reads as pressable because it has a ground of its own, not because it has a line around it. Every control takes `--panel-2` as its ground with a transparent border, and hover takes `--edge-2` as the ground.
- A pressed control takes a solid `--accent` fill with `--on-accent` ink. That is the only state that needs to be louder than its neighbours.
- Panels and cards: `--panel` with `1px solid --edge`.
- Focus is untouched and stays a `2px solid --accent` outline with a 2px offset. A focus ring is not decoration, and removing it would lock out keyboard users.

**Why Flat has its own accent**, a teal `#5FD4C4` (HSL 171.8, 57.6, 60.2) where every other dark lighting keeps `#7EB8D4`. With no material doing any work, the accent carries the entire hierarchy, so it has to be strong enough to (10.97 on the ground). Flat's `--dim` was lifted from 3.88 to `#878378` (4.87 on `--panel`, 4.55 on `--panel-2`) with hue and saturation held.

---

#### Lumen. White and flat, with black panels where the tools draw.

**Register.** The owner's own lighting, and the only two-tone one: "white and flat, except the centre display areas for all the tools are still 101010." Then, on a second ruling: "Lumen is about vibrancy." Bright, gallery-like, high chroma. The named exception to the muted palette.

**Tokens, on paper (the chrome, rails, bar).**

    --bg #FFFFFF   --panel #FFFFFF   --panel-2 #F4F4F6   --sunk #ECECF0
    --edge rgba(16,16,16,.13)   --edge-2 rgba(16,16,16,.22)
    --ink #101010   --mid #43434A   --dim #63636B
    seats: PAL_VIVID
    --accent #0091EA   --on-accent #FFFFFF   --au #B8860B   --sky #0091EA   --um #101010
    --good #00A85C   --bad #E01B24
    --alarm #FF1500   --alarm-soft rgba(255,21,0,.12)
    --on-flat #FFFFFF   --shadow none
    radii 4 / 4 / 3

**Tokens, re-declared inside the stage** (the render surfaces stay `#101010`):

    --ink #F7F7F7   --mid #B6B6BC   --dim #8C8C94
    --panel #171717   --panel-2 #1F1F22   --sunk #0A0A0A
    --edge rgba(255,255,255,.14)   --edge-2 rgba(255,255,255,.24)

**Why two sets of inks.** Every other lighting has one ground and so one ink. Lumen has two grounds, white paper and the black stage, so text on each needs the opposite colour. The port implements this as a scoped re-declaration of the ink and surface tokens on the stage container, not as a second token name. (A comment in the source mentions an `--on-bg` token. It was never declared; the scoped re-declaration is the working mechanism.)

**Rules. Solid everywhere, including the icons in the chrome** (ruled: "when selected, anything selected should be flat solid colour... flat solid colour everywhere when it comes to the menu and UI and nav and the icons").

- Every control border goes transparent. Controls take `--panel-2` as ground, and icon cells take `--sunk`.
- Chrome glyph strokes thicken to 1.9 at full opacity, because a 1.5 ring on a black panel beside a white ground reads thinner than it measures.
- A selected icon cell fills with `--c` (or the accent) and its glyph reverses to `--panel` at stroke 2.
- A selected view button, segmented option or chip fills with `--accent` and takes `--on-accent` ink.
- **A reading is still drawn as a reading.** The solid-fill ruling covers the chrome (menus, navigation, controls), not measurements. "A fetter at 6.2 is a measurement and not a button."

**See defects D6 and D9** on Lumen's accent and palette contrast.

---

### 1.3.11 What the lightings share, and where they must differ

| Property | Dark | Snow | Punch | Glass | Glass white | Flat | Lumen |
|---|---|---|---|---|---|---|---|
| Ground | `#0C0D12` | `#EDEBE6` | seat-tinted, near `#12131A` | `#0B0D14` | `#E8E7E2` | `#0A0B0E` | `#FFFFFF` |
| Palette | PAL | PAL_LIGHT | PAL | PAL | PAL | PAL | PAL_VIVID |
| Accent | `#7EB8D4` | `#2F6E92` | `#7EB8D4` | `#7EB8D4` | `#2F6E92` | `#5FD4C4` | `#0091EA` |
| Edges | alpha hairline | alpha hairline | none | alpha plus fringe | alpha plus fringe | solid 1px | alpha, none on controls |
| Shadow | soft | tinted soft | none | deep, three heights | tinted | none | none |
| Blur | none | none | none | 12 / 14 / 26 / 38 | 10 | none, enforced | none |
| Radii | 16 / 11 / 8 | 16 / 11 / 8 | 16 / 11 / 8 | 16 / 11 / 8 | 16 / 11 / 8 | 4 / 4 / 3 | 4 / 4 / 3 |
| Selection | ring | ring | solid fill | colour and weight | colour and weight | solid fill | solid fill |
| Stage ground, the three instrument surfaces | `#101010` | `#101010` (see D1) | `#101010` | Field: pane `rgba(18,20,27,.72)`; Energetics and Compass: `#101010` | Field: pane `rgba(255,255,255,.86)`; the body and compass wells paint `#F2F1EC` over the stage | stage `#101010`, instrument wells `#0A0B0E` | `#101010` |

Measured live, per lighting and per tab. On every other tab, the centre container is a normal `--panel` surface.

**The enforcement the port should copy:** seven lightings must produce seven distinct grounds (that check is what caught Glass inheriting Dark's ground), each must resolve its own panel, edge, ink and accent, its ink must differ from its ground, and the list of lightings is read at run time, never typed into a test.

### 1.3.12 Measured contrast, every lighting, against the element's own ground

Composited values for translucent lightings. The minimum text contrast is 4.5.

| Lighting | ground to panel | ground to panel-2 | ink on panel | mid on panel | dim on panel | dim on panel-2 | accent on panel | on-accent on accent |
|---|---|---|---|---|---|---|---|---|
| Dark | 1.15 | 1.32 | 14.39 | 7.79 | 5.30 | 4.63 | 7.77 | 8.60 |
| Snow | 1.11 | 1.05 | 16.69 | 7.99 | 6.04 | 5.69 | 5.20 | 5.22 |
| Glass | 1.10 | 1.22 | 15.70 | 9.49 | 5.34 | 4.81 | 8.12 | 8.60 |
| Glass white | 1.14 | 1.18 | 16.71 | 8.44 | 4.91 | 5.04 | 5.15 | 5.22 |
| Flat | 1.07 | 1.14 | 17.05 | 7.58 | 4.87 | 4.55 | 10.27 | 10.77 |
| Lumen paper | 1.00 | 1.10 | 19.03 | 9.81 | 5.95 | 5.42 | **3.37** | **3.37** |
| Lumen stage | 1.06 | 1.16 | 16.73 | 8.88 | 5.37 | 4.93 | 5.33 | **3.37** |

Values in bold fail. Also failing: Glass white `--dim` on its bare ground (4.29) and on `--sunk` (4.18). Both are listed as defects in 1.10.

---

## 1.4 Light

Sol's position, and it is the section's position: **a screen is lit, not painted.** Each lighting answers the question of where the light comes from, and the answer has to be consistent across every surface.

- **Dark.** An ambient room light. There is no directional light and no highlights. Depth comes only from the surface ramp and one soft drop shadow, `0 12px 34px rgba(0,0,0,.34)`, whose large blur and low opacity read as distance rather than as a hard edge.
- **Snow.** Daylight on paper. Shadows are tinted blue-grey, because daylight shadows are cool.
- **Glass and Glass white.** One key light, upper left, at 160 degrees for the specular and 150 degrees for the fringe. Every pane in the product agrees. Glass is lit from behind (the aura glows through), Glass white from in front (the specular is at .85 rather than .22).
- **Punch, Flat, Lumen.** No light at all. The surface does not exist, and colour does all the work.
- **The aura.** The only light that moves, and it is driven by the reading (1.7).

**Hierarchy is value before size** (Bjorn and Sol together). On any screen the eye should land on three things in order, and the order is set by value (lightness contrast against the ground) before anything is allowed to be bigger or louder:

1. `--ink` against `--panel`, about 14 to 1.
2. `--mid`, about 8 to 1.
3. `--dim`, about 5 to 1.

The tooltip is the cleanest example. Its title and body are both 13px, and the hierarchy comes entirely from `--ink` (14.39) against `--mid` (7.79). That is a large step and it costs no extra height.

**Squint check, from six feet, live.** On the Summary at 1600, the eye lands on the person's name first, the tier word second and the red shadow-weight figure third. That is the right order, achieved with size, then tier colour, then the alarm. On the Field at 1600, the eye lands on the wheel first, the red DQ pill second and the rail third. Also correct. The port must reproduce this order. If it does not, nothing else about the fidelity matters.

---

## 1.5 Typography

### 1.5.1 One face: Inter, carried in the file

    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 300 700;        one variable file covers the whole range
      font-display: swap;
      src: url(data:font/woff2;base64,...) format('woff2');
    }

- **Inter, variable, latin subset, weights 300 to 700, one file**, embedded as base64 inside the document. 48 KB raw, 64 KB as base64.
- **Why it is embedded and not fetched.** The product used to link Google Fonts, so every load sent the person's IP address to Google before they had typed a word. This product holds somatic and psychological self-report, and the standing promise is that nothing leaves the device. One outbound request is still an outbound request, and the font was the only one. The owner ruled Google Fonts gone. **The port must ship Inter inside the application bundle and make zero network requests for type.** A test watches the network and fails on any request to `googleapis` or `gstatic`, and on Inter silently falling back.
- **Why Inter and not Lexend.** Lexend is a wide face by design, and in the 302px left rail a root name clipped ("Witness" rendered as "Wit"). Inter is narrower at the same size and fits more characters per line without dropping the point size. The per-person font tuner was removed on the owner's ruling, so there is exactly one face and no override path.

**Stacks:**

    --sans: 'Inter', 'Inter Tight', system-ui, -apple-system, 'Segoe UI', sans-serif
    --num:  'Inter', 'Inter Tight', system-ui, -apple-system, sans-serif

**`--num` is Inter too. There is no monospace.** Digits align through Inter's tabular figures, requested with `font-variant-numeric: tabular-nums` on every figure, column and readout. The history is a warning for the port (Bjorn). `--num` used to name Lexend for digits. Lexend was never in the build, so every number in the product fell through to whatever `system-ui` was on that machine, and the one thing the token existed to guarantee (aligned columns) was the one thing it could not do. A font-availability check reported success because it answers "can this text render at all", and a fallback counts. **Verify by listing the fonts actually loaded, not by asking whether a family is available.** Live check at this commit: loaded faces = `Inter 300 700`, nothing else.

**Rendering.** `-webkit-font-smoothing: antialiased`. On a dark ground, subpixel antialiasing makes light type look heavier and fringed. Grayscale smoothing keeps weights true.

### 1.5.2 Weights, and what each one is for

The whole product uses five weights out of the variable range. Counted in the stylesheet: 300 (21 uses), 350 (1), 400 (37), 500 (90), 600 (58).

| Weight | Job | Why |
|---|---|---|
| 300 | Long reading prose at 14px and above: the reading, the release script, quoted speech, story entry | "Light weights only at larger sizes." Light weight lowers visual pressure on long passages. Under 14px it thins out on a dark ground. |
| 350 | Top navigation tabs at rest, with tracking `.012em` | Nine items at 500 read as a heavy band across the top of the instrument (the owner's finding). 350 with a little tracking reads as navigation. |
| 400 | Default: controls, data rows, body | The workhorse. |
| 500 | Emphasis, figures, the pressed tab, names in rows, primary button labels | The weight of a value. Every tabular figure is 500. |
| 600 | Labels and eyebrows at 11px, headings, tier words, bold in prose | Small labels need weight to hold at 11px. Used for the third tier of hierarchy, never for shouting. |

The pressed tab moves from 350 to 500 and drops its tracking to 0. **The only weight change in the navigation is which surface you are on**, and it arrives together with the colour change and the underline, so the weight confirms rather than acting as the only signal.

### 1.5.3 Sizes by role

**Floors** (ruled, and tested):

- **16px is the floor for reading text**, not a target. Line height 1.6 to 1.7, measure 50 to 75 characters.
- **13px for data rows**: the caption range.
- **11px for labels**, in sentence case at weight 600. **Nothing a person must read to use the product goes below 11px.** A test measures the computed size of every text element and fails by name.
- **One named exception:** the "Source OS" line under the wordmark at 8.5px. It is identity, read once, and not text a person needs to operate anything.

**Base.** Root 16px, line-height 1.65. The body is `calc(14.5px * var(--ui))`, where `--ui` is the density setting: 1 by default, .86 tight, 1.1 wide. Only inherited text scales with density. Components that declare their own pixel size do not.

**The roles, with literal values:**

| Role | Size / line-height | Weight | Colour | Notes |
|---|---|---|---|---|
| Hero name (Summary) | `clamp(34px, 5vw, 58px)` / 1.02 | 600 | ink | tracking -.02em |
| Big readout (energy) | 42px / 1 | 400 | accent | num, tabular |
| Coherence figure, hero | 48px (38px under 720px) / 1 | 400 | accent | num, tabular |
| Accuracy figure | 34px / 1 | 400 | accent | a unit in `small` at 16px, opacity .6 |
| Streak count | 42px / 1 | 300 | ink when live, dim otherwise | the only display-size figure outside a reading |
| Numerology number | 27px / 1 | 300 | accent (a master number takes alarm) | |
| Release node name | 30px | 600 | ink | |
| Release script | 22px / 1.6 | 300 | ink | the words a person reads slowly |
| Onboarding word | 34px / 1.1 (27px on phone) | 500 | ink / dim | tracking -.01em |
| Onboarding heading | 24px / 1.2 (20px on phone) | 600 | ink | tracking -.012em |
| Knowledge deck heading | 22px | 500 | ink | tracking -.01em |
| Drill name | 21px | 600 | ink | |
| Account pane heading | 20px | 400 | ink | tracking .005em |
| Card name (rail) | 19px / 1.25 | 600 | ink | |
| Wordmark | 18px / 1 | 400 | sky | see 1.5.6 |
| Sheet heading | 17px | 500 | ink | |
| Reading prose | 16px / 1.7, max 68ch | 400 | mid, bold in ink at 600 | the one thing a person reads rather than scans |
| Summary story | 16px / 1.72, max 66ch | 400 | mid, bold in ink at 500 | |
| Story editor | 16px / 1.75 | 300 | ink | |
| Knowledge row name | 15px / 1.2 | 500 | ink | ellipsis |
| Law name, section head | 15px | 500 | ink or seat | |
| Onboarding prose | 15px / 1.62, max 58ch | 400 | mid | |
| Verdict prose | 14.5px / 1.75, max 78ch | 300 | mid | |
| Control label (tabs, buttons, select) | 14px | 400 (tab 350) | mid, ink on hover | |
| Row text | 13.5px | 400 | mid | |
| Data row | 13px | 400 to 500 | mid / ink | |
| Tooltip body and title | 13px / 1.65 and 1.3 | 400 / 600 | mid / ink | |
| Secondary and explanatory | 12.5px / 1.55 to 1.6 | 400 | dim | the most-used size in the sheet (66 uses) |
| Field value in a small chip | 11.5px | 500 | ink | tabular |
| Tooltip kicker and figures | 11.5px | 400 / 500 | dim / ink | tracking .02em |
| Label, eyebrow | 11px / 1.45 | 600 | dim (accent for a live tier) | the third tier |
| Letters inside a ring (CQ, DQ, SQ) | 11px | 600 | the seat colour | tracking -.03em, tabular |

**The type scale is not yet a scale** (Bjorn, measured). The stylesheet uses 31 distinct pixel sizes at or above 8.5px: 8.5, 9, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 34, 38, 42, 46 and 48. Most of it is half-point steps between 11 and 15. That is a record of separate decisions, not a scale. The spacing system got three steps and an argument (1.7); the type did not.

**For the port, two options, and it is the owner's call:**

- *Reproduce.* Use the role table above literally. This is the most faithful choice.
- *Consolidate.* Collapse to a named ladder as tokens: **11 / 12.5 / 13.5 / 16 / 19 / 22 / 34 / 48**, mapping every role to the nearest step. That removes 23 sizes, costs at most a half point on any role, and keeps every floor.

Either way, the floors (11, 13, 16) and the reading measure (50 to 75 characters) are fixed.

### 1.5.4 Tracking

Tracking is almost always zero. Where it appears, it has a job:

| Tracking | Where | Why |
|---|---|---|
| -.03em | two letters inside a ring | two characters in a small circle have to read as one unit |
| -.02em to -.01em | display sizes, 22px and up | large type sets loose; pulling it in holds the word together |
| .01em to .02em | small figures, tooltip kickers, accordion heads | opens small text very slightly for legibility |
| .06em | a few group headers and table heads at 10.5 to 12px | quiet separation for a heading that is not a title |
| .075em | the wordmark base | "letters given room" (ruled) |
| .11em | ATUNED, uppercase | capitals set tighter than lowercase at the same tracking |
| .467em | SOURCE OS, uppercase | measured so the subtitle spans the wordmark's width (1.5.6) |

### 1.5.5 Case

- **Body copy, readings, explanations and anything written as a sentence: sentence case.** Ruled.
- **Labels and headers take a capital on every word**, applied by style rather than typed, so a label written in sentence case still renders correctly. Because it is a transform, an all-caps acronym such as CQ survives.
- **The rule for which is which**, stated as a rule rather than a judgement per string: *a label is a short name for a region, four words or fewer, with no comma followed by another word.* A label keeps the capital on every word. Everything else is a sentence and stays in sentence case. A comma followed by a word marks a second part, and a name has one part. "Imprints, 21" is a label with a count; "Coherence, corrupt, 0 to 100" is a statement. Measured before this rule existed: 42 of 99 strings in label slots were whole statements and rendered as "Nothing Held, 2 Installed". A test now walks every label on every surface and fails on any sentence that is not opted out.
- **An escape hatch per element**, because a person's own name is not a header: a surname such as "de Vries" must never render as "De Vries".
- **No all caps UI copy.** Caps have no variation in letter height and read more slowly. A test fails any UI string over six characters that is set in, or transformed to, uppercase. **One exemption: the logotype**, because a logotype is not copy. The logotype strings are stored in sentence case and uppercased by style, so the source text never breaks the rule. To make a line recede, use colour and weight, never capitals.
- **Known imprecision** (Bjorn). A capitalise-every-word transform is Start Case, not true title case. It prints "Primary And Secondary" and "Where It Goes". CSS cannot know which words to leave lowercase. The owner ruled title case on headers, and this is the closest the stylesheet gets. A port with real text handling can do true title case for headers (lowercase articles, conjunctions and short prepositions except in first position). Raise it with the owner before choosing.

### 1.5.6 The wordmark

Two lines, one lockup, centred on a shared axis.

**Line 1, ATUNED.** Inter 18px, weight 400, line-height 1, colour `--sky`. Stored as "Atuned" and uppercased by style, tracking `.11em`, and the trailing letter-space removed with a right margin of `-.11em` so that centring is on the glyphs and not on the glyphs plus one gap. Hover colour: `mix(--sky 76%, --ink)`.

**The umlaut is drawn, not typed.** The dots must be white while the letter is sky blue, and a single glyph cannot carry two colours. Two circles, each `.14em` in diameter, colour `--um`, positioned `-.54em` above the U (clearing the cap line of an uppercase U), at `left .116em` and `left .488em` relative to the U's box. The positions were measured against the rendered glyph. At 18px the U's box is 15.38px, of which 1.98px is tracking, so the glyph is about 13.4px wide and its centre sits at .436 of the box. The dots go at a quarter and three quarters of the glyph, which is where an umlaut sits on a capital. The header reserves 7px of top padding so the dots are not clipped. The dots answer to the ground, not to the letter: white on dark lightings, `#13303F` on Snow, `#14161C` on Glass white, `#101010` on Lumen, `#F7F6F3` on Flat.

**Line 2, SOURCE OS.** 8.5px, weight 500, colour `--ink`, uppercased by style, tracking `.467em` with a right margin of `-.467em`, 4px below line 1. The tracking was measured, not chosen: "ATUNED" sets 85.2px wide, and nine characters of subtitle carry the difference at .467em, so the two lines are the same width and the lockup is not lopsided.

**The wordmark carries no button styling**, even though it is a button (it goes home to the Field). Button styling on a wordmark makes it look like a control rather than the thing you are in.

The boot-screen version is the same mark at 23px with tracking .075em, a "Powered by" line at 9px weight 400 in `--dim` with tracking .04em, then "SOURCE OS" at 9px weight 500 with tracking .19em, stacked 38px under the name. A trademark symbol at .34em, weight 500, sky at .72 opacity, raised .85em.

### 1.5.7 Numbers

- **Every figure is tabular** (`tabular-nums`), weight 500, in `--ink`, unless it is a display readout (weight 300 to 400, often in the accent).
- **Every number says what it is out of, on the screen and not in a tooltip.** "of 100", "of 10", "summed, no ceiling", printed as a third line under the label. The owner's words: "You read 13, what does that mean." A phone has no hover, so a scale that lives only in a tooltip does not exist for a phone user.
- **A zero is a reading and prints**, in `--dim` at weight 400. It is not a finding and does not shout.
- **"Not scored" is not zero** and never shows a figure derived from a default. An unread ring holds an en dash in `--dim`.
- **The address count stated to users is 112.** Never 108.
- **No em dashes anywhere**, including in numerals, ranges and this port's own copy. Ranges are written "21 to 30".

---

## 1.6 Iconography

### 1.6.1 Ring, not fill

**Every glyph is drawn as a stroke with no fill.** Ruled, standing, and it holds on the mark in all seven lightings.

Why (Petra): a stroked glyph keeps its inner space, and narrow inner space is what actually interferes with icon recognition. A filled glyph at 16px becomes a blot. A ring also sits in the same visual weight class as the type beside it, so a row of icon plus word reads as one line rather than as a dark shape and some text.

**What Punch, Flat and Lumen change is the carrier, not the mark.** In those lightings a *selected* control fills solid, and the glyph inside reverses to the ground (Punch, `--bg`) or the panel (Lumen, `--panel`), still as a stroke. No glyph is ever filled in any lighting.

**The single intentional fill** is the theme icon for Punch in the lighting menu: a circle with one half solid. There the fill is the message, because the theme is the absence of outlines.

### 1.6.2 The grid

- **24 by 24 unit viewBox**, every glyph, every family. One helper draws them all.
- **`stroke-linecap: round; stroke-linejoin: round`** everywhere. Round terminals match Inter's rounded curve terminals and read as instrument drawing, not as a blueprint.
- **Optical stroke ladder.** The smaller the mark, the heavier the stroke, so it does not vanish:

| Rendered size | Stroke | Where |
|---|---|---|
| 8 to 11px (inside the smallest rings and badges) | 2.0 | extra-small badge glyph |
| 13 to 15px | 1.7 to 1.8 | ring glyphs, small badges, chips, row icons |
| 16px (navigation) | 1.6 | view buttons, tab icons, theme switch |
| 16 to 19px (group glyphs, account index) | 1.5 | law group glyph, account index glyph |
| 19 to 24px (standalone) | 1.5 to 1.7 | spiritual-layer chips at 24px use 1.5, milestone marks at 19px use 1.7 |
| selected or pressed | +0.3, to 2.0 | a pressed icon cell goes from 1.7 to 2.0 |
| Lumen chrome | 1.9 | a paper ground eats a thin stroke |

- **Navigation icon size is a token**, `--icon-nav: 16.15px`. It was 17 and came down five percent on the owner's ruling ("it is just kind of large"). It is written once so it cannot drift across four places. The button's 44px tap target does not change; only the drawing does.

### 1.6.3 Icon sizing inside a cell

In a square icon cell, the glyph is **46 percent of the cell**, at stroke 1.7, in the family colour `--c` (falling back to `--mid`), at **opacity .78 at rest and 1 on hover or when selected**. Keep the generous inner margin: narrow inner spacing is the specific thing that hurts recognition.

### 1.6.4 Families and colours

| Family | Count | Colour |
|---|---|---|
| Seats | 7, plus one fallback | the seat's own palette colour |
| Charges (child emotions) | 9 | their seat |
| Gates | 6 | their seat |
| Quotients | 4 drawn, plus three that use letters | the seat the reading is argued from |
| Domains | 19 | their root |
| Archetypes | 12 | their seat |
| Roots | 4 | the borrowed seat colour (1.3.7) |

**Three readings use letters instead of a drawing:** CQ, DQ and SQ. Those letters are what everything in the product calls them, and a drawing would be a second name for something that already has one. They sit in the ring's centre at 11px, weight 600, tracking -.03em, in the seat colour.

**Glyph vocabulary: each mark is argued from what the thing is, not from what the word sounds like.** Example: *vitality* is a shoot (what grows back when the weight comes off); *awareness* is an aperture (the width of what gets through; the eye is already taken by perception); *will* is force through a gap; *flow* is what rises and keeps rising. Path data for the seats, quotients, gates and lightings is in Appendix A, so the port can reproduce the marks exactly.

### 1.6.5 Selection is a ring

"Recognition speed matters most before selection, so a fill on the chosen item spends legibility where it is not needed. Selection is a ring. The icon carries the colour and keeps its inner spacing."

A selected icon cell: border 1.5px `--accent`, ground `--panel-2`, glyph opacity 1 and stroke 2. The soft outer halo on it is currently a stale literal (defect D3); port it as `0 0 0 2px mix(--accent 28%, clear)`. A second-rank selection takes a border of `mix(--accent 52%, clear)`. A depth reached by zooming, rather than chosen, is ringed in the accent with a 4px accent dot at the upper right: reached, not chosen.

Punch, Flat and Lumen override this with solid fills on their rulings (1.3.10).

### 1.6.6 The ring-and-pill: the product's signature object

This is the product's grammar for every quantity, ruled by the owner: **an icon, a ring around it showing the value as an arc, and a pill with the number.** One object at two resolutions. The ring gives the impression and the pill gives the figure. A column of twenty reads as fuller and emptier rings, not as a spreadsheet of feelings.

It also settles an old argument about symbol versus number. New users want the number; long-term users want the glyph. Showing both in one object means nobody has to choose, and nothing has to be learned.

**The chip form** (ring and pill side by side inside a rounded chip). Geometry as viewBox size / radius / stroke:

| Size | Box | Radius | Arc stroke | Glyph | Value text |
|---|---|---|---|---|---|
| lg | 46 | 18 | 3.5 | 17px | 18px |
| md | 34 | 13 | 3.0 | 13px | 14px |
| sm | 24 | 9 | 2.4 | 10px | 11.5px, 6px left margin |
| xs | 18 | 6.5 | 2.0 | 8px | 11.5px, 5px left margin |

- The track circle is `rgba(128,128,128,.22)` at the same stroke width. The value arc is the seat colour with a round cap, starts at 12 o'clock (rotated -90 degrees), and runs clockwise. Its dash length is the circumference times (1 minus the percentage).
- The chip is a 999px radius, padding `3px 4px 3px 3px` (sm: `2px 10px 2px 2px`; xs: `2px 8px 2px 2px`).
- The value pill: 999px radius, padding `4px 9px`, 8px left of the ring, line-height 1, tabular, weight 500, ink on `mix(--c 17%, clear)`.
- An empty value draws no pill at all. A ring with nothing to say is just a ring.

**The badge form** (pill overlapping the ring's lower right). Used in dense rails and rows.

| Size | Box | Radius | Stroke | Glyph (stroke) | Reserved padding (right, bottom) | Pill text | Pill padding |
|---|---|---|---|---|---|---|---|
| xs | 26 | 10 | 2.4 | 11px (2.0) | 20, 7 | 11px | 1px 5px |
| sm | 34 | 13.5 | 3.0 | 15px (1.8) | 24, 8 | 11.5px | 1.5px 6px |
| md | 44 | 17.5 | 3.6 | 20px (1.6) | 28, 9 | 12.5px | 2px 7px |

- The badge's pill: ground `--panel-2`, 1px border `mix(--c 44%, clear)`, ink figure, 999px radius. In Punch it becomes solid `--c` with `--on-accent` ink.
- **The pill sits inside the badge's own box**, in padding reserved for it, and clear of the ring. It used to hang off the corner with a negative offset, outside the element. The row clipped it, so "5.4" rendered as "5". Later it was laid over the glyph and covered what it qualified. Both are recorded failures; the reserved padding is the fix.
- A *bare* badge (ring and glyph with no pill) is used where the figure is already printed at the end of the row, aligned with the column. The same number printed twice two centimetres apart is noise.

---

## 1.7 Space, radius, edge, depth, texture

### 1.7.1 Spacing: three steps, argued

    --g1   6px    between things inside one control
    --g2  10px    between controls
    --g3  16px    between blocks

Gaps of 5, 7, 8, 9 and 11px were all doing one of these three jobs with no stated reason, so they read as drift rather than rhythm. The port should build its spacing on these three values. (The stylesheet still has many literal paddings from before the tokens existed. The three tokens are the intent.)

**Fixed structural measures:**

| Measure | Value | Why |
|---|---|---|
| App frame padding and gap | 10px (7px and 6px under 720px) | the shell is panels floating on the ground with 10px of ground showing between them |
| Top bar padding | `9px 13px` | |
| Panel padding | `16px 18px` (13px 14px on phone) | |
| Desktop columns | `302px / 1fr / 336px`, gap 10px | left rail, stage, right rail |
| Stage lanes | 128px each side | the compass needs a lane of its own, and an empty matching lane on the left keeps the wheel centred |
| Reading measure | max 68ch (prose), 62 to 78ch by context | 50 to 75 characters |
| Content max widths | Summary 1180px, Settings 1040px, Account 980px, Ritual 820px, Release card 560px | |
| Tap target | `--tap: 44px`, both dimensions | a finger's floor. A short word does not make a small target: "Day" was 42px wide and failed. |
| Full-width list row | 56px minimum | 44 is the floor for a finger, not a target for a full-width row |
| Tooltip | max 300px wide, padding `12px 14px 13px`, 10px gap to the carrier, 8px inset from the viewport | |

**How a small control reaches 44px without looking big.** Grow the hit area and keep the drawing small. The drag track is a 6px bar with `padding: calc((44px - 6px) / 2) 0` and its background clipped to the content box, so the finger gets 44px and the eye still sees a thin line. A checkbox stays 18px (a 44px checkbox looks like a bug) and carries 13px of padding with a -13px margin, so its own hit area reaches the floor.

### 1.7.2 Breakpoints

| Width | What changes |
|---|---|
| 1240px and below | Intake law cards stack to one column |
| 1180px and below | **The shell stops being a fixed frame.** The page scrolls, the rails stack under the stage, and **the stage comes first**. The document order was rail, stage, rail, which put the wheel 1,902px down a phone screen. |
| 1100px and below | Summary two-column blocks stack; the knowledge grid goes from 3 columns to 2 |
| 1000px and below | The account index becomes a wrapping row |
| 900px and below | Compass name rails move under the figure |
| 820px and below | The top bar may wrap to a second row |
| 720px and below | Phone. Body 14.5px, tighter frame, sheets rise from the bottom, the key strip becomes one row that scrolls |
| 640px and below | Onboarding card and type reduce |
| coarse pointer or narrow (set by script) | The tooltip becomes a bottom sheet |

The two target widths the tests hold are **1600 by 1000** and **390 by 844**. The owner's ruling on mobile: **one build, two compositions**, never a forked mobile design. The same components recompose, and "responsive" in the sense of the same controls poured into one long column is what the owner called hideous. Capability detection is `(max-width: 720px) and (pointer: coarse)` together, never the user agent.

### 1.7.3 Radius

    --r     16px   panels, cards, sheets, the stage, hero blocks
    --r-s   11px   secondary cards, menus, tooltips, grouped rows
    --r-xs   8px   controls, icon cells, inputs, small chips
    999px          anything that is a pill: buttons, value chips, value pills
    50%            dots, markers, knobs
    3px            bars, gauges, text highlights
    2px            matrix cells

Flat and Lumen: **4 / 4 / 3**. Pills stay pills in every lighting.

**Why three radii at a 16 / 11 / 8 ratio.** Nested corners look concentric only when the inner radius is roughly the outer radius minus the padding between them. A 16px panel holding 11px cards with about 5px visual inset, holding 8px controls, keeps the corners parallel. Tight radii in Flat and Lumen are part of those lightings' argument that nothing is a material.

**Why primary buttons are full pills but tabs and controls are 8 to 11px.** A button is a thing you do; a control and a tab are places and settings. The shape tells them apart before the label does.

### 1.7.4 Edges

- **The hairline is the product's only border**: 1px `--edge` (white at 9 percent on dark, ink at 11 percent on paper), `--edge-2` on hover and on floating panels.
- **Why alpha, not a solid grey.** An alpha hairline takes its colour from whatever it sits on, so the same token works on `--bg`, `--panel` and `--panel-2` and never reads as a grey line drawn on top. Flat is the exception: it uses solid hairlines on purpose, because there is no material for an alpha edge to pick up.
- **Floating panels use `--edge-2`, not `--edge`.** A tooltip or menu floats over arbitrary content, including a near-black wheel. At 9 percent its bottom edge disappears.
- **Left rules as a semantic mark.** A 2 to 3px left border in a colour marks a live or attributed thing: the accent on a saved ritual plan and on a verdict, `--c` on a finding or a quoted source, `--good` on an agreement, `--bad` on a disagreement. This is how the product marks "this belongs to that" without a box.
- **Dotted underline:** 1px dotted `--edge-2` under a static word means "this word has a definition". It turns accent on hover and focus. Nothing is drawn under a control that already looks like a control.
- **Dashed border** means pending or inferred: a detected but uncommitted pattern, or a "show more" row.

### 1.7.5 Depth and shadow

| Surface | Shadow |
|---|---|
| Panel (Dark) | `0 12px 34px rgba(0,0,0,.34)` |
| Panel (Snow) | `0 12px 30px rgba(40,54,74,.12)` |
| Panel (Glass) | `0 24px 64px rgba(0,0,0,.50)` plus `inset 0 1px 0 rgba(255,255,255,.13)` |
| Panel (Glass white) | `0 20px 52px rgba(20,22,28,.14)` |
| Punch, Flat, Lumen | none |
| Sheet card | `0 18px 60px rgba(0,0,0,.5)` |
| Modal card (release, compass) | `0 26px 64px rgba(0,0,0,.5)` |
| Lighting menu | `0 22px 54px rgba(0,0,0,.42), 0 2px 8px rgba(0,0,0,.2)` |
| Tooltip | its own `0 10px 24px rgba(0,0,0,.38)` (Snow `rgba(20,22,28,.13)`, Glass `rgba(0,0,0,.46)`, Lumen `rgba(0,0,0,.14)`, Flat none) |

**Why the tooltip states its own shadow** (Sol, measured). With the shared panel shadow, Glass lost 6.1 fps over the live Field while a tooltip was open. A large soft shadow over a canvas that repaints every frame is recomposited every frame. At a 24px blur, the loss is within the noise.

**Scrims.** Sheet `rgba(6,8,11,.62)`. Release and ritual `rgba(8,9,13,.76)` with a 10px blur (Snow `rgba(238,237,233,.82)`). Onboarding `rgba(6,6,8,.94)` with **no blur**, because a blur over the Field drops the wheel to 11 to 18 fps and an opaque scrim reads as a sheet on its own.

### 1.7.6 Texture, gradient, and the only moving light

**There is no grain, noise or paper texture anywhere in the product.** Texture would be decoration, and a measurement instrument does not decorate its ground. Gradients appear in exactly these places, each with a job:

1. **The aura.** The one piece of atmosphere, and it is data. A canvas fixed behind the whole app (inset -6 percent, 112 percent of the viewport, never taking pointer events) paints:
   - one central radial gradient in the accent, with stops at alpha `.42 x radiance` at 0, `.12 x radiance` at .34 and 0 at 1. Its reach is 20 to 58 percent of the long side, scaled by coherence (CQ). More coherent means wider light.
   - four corner radial gradients at roughly (13%, 19%), (87%, 25%), (9%, 83%) and (91%, 79%). They alternate between a *warm* colour (Heart when the field is benign, Root when it is not) and a *lead* colour (the heaviest seat), each at alpha `.40 x density` fading to 0, with radius 28 to 64 percent of the long side scaled by DQ. They drift slowly: each centre moves by about plus or minus 5 percent on sines of the clock, and the clock is quantised to 12 steps a second.
   - canvas opacity `.15` (`.16` on Snow) `+ .24 x radiance`.

   **It is painted at one eighth of the window size and stretched up** (200 by 125 at 1600 by 1000). The bilinear upscale *is* the blur, it is free, and at 8x a gradient cannot show a step. The earlier version used a 120px CSS blur on a full-size canvas and ran the Field at 7.7 fps against 59.5 without it. **The port must not blur the aura in real time.** Under reduced motion, the clock is pinned and the aura paints once.
2. **Glass specular and fringe** (1.3.10).
3. **The lighting menu's top highlight.** A 1px line across the top edge, `linear-gradient(90deg, transparent, mix(--ink 26%, clear), transparent)`, where a pane would catch a highlight. The menu itself is `mix(--panel 78%, clear)` with a 22px blur and saturate 1.5.
4. **Scroll affordance fades.** A tab strip that scrolls fades its last 26px with a mask, and only while there is more content past the edge. At full width there is no fade and nothing to explain. A long tooltip fades its last 22px, one line, so a cut never reads as the end of a sentence.
5. **Sticky header fade.** The drill's back control sits on `linear-gradient(--panel 72%, transparent)` so content scrolls under it cleanly.
6. **Body-map glow.** A soft seat-coloured aura behind the figure, with a 40px blur, on a surface that does not repaint continuously.

---

## 1.8 Components

Each component is specified as it renders in Dark, with the lighting overrides after. States are always: rest, hover, pressed or selected, focus, disabled.

### 1.8.1 Focus, one rule for everything

    outline: 2px solid --accent; outline-offset: 2px

On every button, input, select and textarea, through `:focus-visible` (keyboard only, never on mouse click). Rows in a list use an offset of -2px, so the ring sits inside the row. **The focus ring is never removed in any lighting.** Punch replaces it on text fields with the inset 4px left bar; everywhere else it stays.

### 1.8.2 Buttons

**Standard button, `.btn`.** A pill.

    ground --panel-2   border 1px --edge   ink --ink   radius 999px
    min-height 44px   padding 9px 17px   14px / 400
    hover: ground --sunk, border --edge-2
    disabled: opacity .4, default cursor
    transition: all 120ms --ease-out

Hover goes *down* to `--sunk`, not up. The button presses into the surface under the pointer, which reads as physical rather than as a glow.

**Primary, `.btn.pri`.** The one filled button on a surface.

    ground --accent   border --accent   ink --on-accent   weight 500
    hover: brightness 1.08

**One primary per surface.** "It is the one action on that panel, so it is the one filled button, and the line under it says what the run will actually be." Filled means "this is the thing you do here".

**Destructive, `.btn.dgr`.** Text `--bad`, border `mix(--bad 52%, --edge)`, hover ground `mix(--bad 14%, clear)`. Never the alarm.

**View toggle, `.vt`** (depth ladders, icon plus word). Radius `--r-s`, 1px `--edge`, transparent ground, `--mid` text, 14px / 400, padding `8px 14px`, gap 10px, min-height 44px. Icon at `--icon-nav`, stroke 1.6. Hover: `--panel-2` ground, `--edge-2` border, `--ink` text. Pressed: **no ground and no border**, text and icon in the accent at weight 500, plus a 1.5px accent underline 14px in from each side and 5px from the bottom.

**Icon-only buttons** (back, forward, help, profile): square, at least 44 by 44, 9px side padding, glyph 14 to 15px at stroke 1.7. When a stack exists, the back arrow is in the accent with an accent border, because it is the live one.

### 1.8.3 Top navigation tabs

**A tab is not a button, and it does not wear a box.** Ruled. With a border on every top-level item, nine boxes sat in a row across the top of the instrument and the navigation read as a toolbar. The pressed state was right (underline and accent, no fill), but an underline inside a box says "this button is selected", not "you are on this surface".

    rest:    transparent ground and border, radius 0, padding 11px sides,
             14px, weight 350, tracking .012em, --mid
    hover:   --ink, no ground
    current: --accent, weight 500, tracking 0,
             a 2px accent line 8px in from each side sitting on the strip's hairline
    strip:   one 1px --edge hairline under the whole row

**A selected menu item changes its text, not its ground.** Ruled. A filled pill behind the current tab put a solid block of accent in the busiest row on the screen, and it read as a button not yet pressed rather than as where you already are. This is the navigation rule for every tab strip in the product.

**Strips that overflow** scroll inside themselves, with the 26px edge fade (1.7.6), so the bar never wraps on a normal laptop width. The strip gives up width before anything to its right does. Wrapping returns only under 820px.

Lighting overrides as they currently render: Punch and Lumen give every tab a `--panel-2` block and fill the current one with solid accent. Flat does the same. Glass gives tabs a faint pane at rest. See D4 and D5; two of these contradict the tab ruling and need the owner's decision before porting.

### 1.8.4 Segmented control, `.seg`

A well containing options. Well: `--sunk`, radius `--r-s`, padding 3px, gap 3px. Option: transparent, radius `--r-xs`, min-height 44px, padding `7px 13px`, 13.5px / 400, `--dim`. Hover: `--ink`. Selected: **solid accent fill**, `--on-accent` ink, weight 500. A segmented control is a setting you choose, not a place you are, so its selection fills. Icon-only segments (the lighting switch) use a 19px glyph at stroke 1.6 that reverses to `--on-accent` when selected.

### 1.8.5 Chips and small toggles

| Chip | Rest | Hover | On |
|---|---|---|---|
| Knowledge deck tab | `--sunk`, no border, `--mid`, 12.5px, radius `--r-xs`, padding `0 13px`, 44px | | transparent ground, accent text weight 500, count in accent |
| Stack tab | `--sunk`, `--mid`, 12px, padding `8px 11px`, icon 15px at .75 opacity | | transparent, accent text and icon |
| Filter and time-span button | `--sunk` or transparent, 1px `--edge`, `--dim` or `--mid`, 12 to 12.5px, 44 by 44 minimum | `--panel-2`, `--ink` | border `--accent`, text `--accent` or `--ink`, weight 500 |
| Game and imprint group chip | `--sunk`, `--mid` | `--ink` | solid accent, `--on-accent` |
| Glance item (Summary) | transparent, 999px, `--dim`, 12.5px, 44px | `--panel-2`, `--ink` | |
| Read-only tag | `--sunk`, `--mid`, 12.5px, radius `--r-xs`, padding `4px 9px` | | over-limit: `--alarm-soft`, text `--alarm` |

**The pattern behind them** (Petra). A chip that is a *place* (a deck, a stack, a tab) marks selection with colour and weight and drops its ground. A chip that is a *setting or a filter* marks selection with the accent as a border or a fill. The distinction is the same as tab versus button.

### 1.8.6 Panels and cards

| Object | Ground | Border | Radius | Padding | Shadow |
|---|---|---|---|---|---|
| Panel (rails, top bar, stage) | `--panel` | 1px `--edge` | `--r` 16 | 16 18 | `--shadow` |
| Section card (settings, output, reading box) | `--panel` | 1px `--edge` | `--r-s` 11 | 15 to 24 | none |
| Raised card on a panel (summary cards, lenses, grouped figure) | `--panel-2` | 1px `--edge` | `--r` or `--r-s` | 14 to 18 | none |
| Rail card | `--panel-2` with a seat bar at 17% on the left | none | `--r-s` | 14 16 | hover: moves 3px right, 1px `--edge-2` outline |
| Well | `--sunk` | 1px `--edge` or none | `--r-s` | 11 15 | none |
| Sheet card | `--panel` | 1px `--edge` | `--r` (top corners only on phone) | 18 18 20 | `0 18px 60px rgba(0,0,0,.5)` |
| Onboarding card | `--panel` | 1px `--edge` | 14px | 26 28 20 | none |
| Tiled grid (onboarding, lens list) | `--edge` shows through 1px gaps between `--panel` or `--panel-2` tiles | 1px `--edge` outer | `--r` | 9 to 13 | none |

**Why a rail is a panel and not a card** (Petra). One word per concept. The side columns were once called cards, while the letting-go deck also had a card sized `min(380px, 100% - 32px)`. The two collided and both rails rendered 32px narrower than their columns. The port should keep panel, card and well as three distinct names.

In Punch every card drops its border and moves up to `--panel-2`. In Flat, every panel and card becomes `--panel` with a solid 1px `--edge`.

### 1.8.7 Rows and lists

- **Row:** full width, transparent, bottom 1px `--edge`, min-height 44 (list rows 56), `padding 9px 2px`, gap 11 to 12px. Hover: ground `--panel-2` (or `--panel` in the knowledge deck). The last row has no bottom rule.
- **Structure of a scanned row:** the ring or badge, then name (14 to 15px / 500 / ink) over a subline (11.5 to 12px / dim), then the figure right-aligned (tabular / 500 / ink). "Scanned, not read, so the rhythm is one row per thing and every row is the same object."
- **Section break inside a grid:** 11px / 500 / tracking .06em / `--dim`, a 20px top pad, and a bottom `--edge-2` rule spanning every column.
- **Accordion header:** 12px / 600 / tracking .02em, `--mid`, padding `14px 2px`, min-height 44. Chevron drawn from two 1.6px borders on an 8px square, rotated 45 degrees, turning to -135 when open over 220ms. Open header text: accent. In Punch, the header gets a `--panel-2` block with `--r-xs` radius.

### 1.8.8 Inputs

- **Text, select, date and time:** `--sunk` ground, 1px `--edge`, radius `--r-xs`, min-height 44, padding `0 10px` to `9px 11px`, 13.5 to 14px, `--ink`. Focus: border `--accent`.
- **Number field:** 54px wide, centred tabular figure at 13px / 500.
- **Large text (story editor):** 16px / 1.75 / 300, padding `18px 20px`, radius `--r-s`, `--sunk` ground with an `--edge` border that turns accent on focus. The highlight layer and the input share every metric that affects glyph position (font, size, weight, line height, padding, border width, tracking, wrapping), so the colouring stays in register with the typing.
- **Checkbox:** 18px, `accent-color: --accent`, with its hit area expanded to 44 (1.7.1).
- **Range slider:** a 6px `--sunk` track with 3px radius, a 22px thumb in the accent with no border, and a 44px tall hit area.
- **Switch:** a 42 by 24 track with 12px radius, `--sunk` with a 1px `--edge-2` border, and an 18px knob at 2px inset in `--dim`. On: track `mix(--accent 34%, --sunk)`, border `--accent`, knob `--accent`, sliding 18px on `--ease-land` over 220ms (the one overshoot in the component set, because a switch lands).
- **Scale of 0 to 10:** eleven equal cells in a single row, never wrapping, with an inset 1px `--edge` outline (drawn as an inset shadow so it takes no layout width) and `--edge` dividers. Each cell is `--sunk`, 13px / 500 tabular, `--mid`. Hover: `--panel`. Selected: solid `--c` with `--on-accent` ink at weight 600. "A scale whose last step is twice the width of every other step is not a scale."

### 1.8.9 Bars and meters

- **Progress bar:** 8px, `--sunk`, 4px radius, fill in the accent or the seat colour.
- **Polarity bar** (malignant to benign): 32px tall, `--sunk`, radius `--r-xs`, with a 1px `--edge-2` midline. **The fill grows outward from the midline**, never from the left edge, so an even field is a bar with nothing sticking out. The figures at each end sit on a `--panel` pill (999px, padding `2px 7px`), because the fill runs under them exactly when the reading is strongest. Measured at a full lean: 3.12 to 1 over the benign fill before this change, 14.39 after.
- **Balance strip:** a 6px `--sunk` track with a 2px gap at the centre in `--bg` drawn above the fill. The fill runs out from the break toward the side the field leans. "A track with a dot on it says you are at this point on a scale, which is not the reading. The reading is how far off centre and which way."
- **Gauge:** 6px, `--sunk`, 3px radius.

### 1.8.10 The tooltip

The product has exactly one tooltip. The design idea in one line: **the panel grows out of its carrier along a line of the carrier's own colour.**

- **Geometry:** max-width 300px, padding `12px 14px 13px`, radius `--r-s`, border 1px `--tip-edge`, 10px gap to the carrier, 8px viewport inset, never covering the tab bar and never landing on the thing it describes. Placement order: below, above, right, left. For a mark on a canvas, the tooltip places against the canvas edge, never over the graphic, and on the side the mark is on.
- **The tether and entry mark:** a 2px by 10px line in the carrier's colour crossing the gap, and a 2px by 30px bar lying along the panel's near edge, 1px radius, together forming a T. This replaces a caret: an arrow points, and this says the colour came through here. Full-width, the mark read as a header rule and cut the corner radius; at 30px it reads as an arrival.
- **The carrier's colour is only ever a graphic.** No text inside the tooltip takes it. The alarm never appears in a tooltip.
- **Ground is always opaque**, declared per lighting (1.3.10). Never `--panel-2`, where `--dim` drops to 4.63.
- **Type:** kicker 11.5px `--num` `--dim` with tracking .02em; title 13px / 1.3 / 600 / ink; body 13px / 1.65 / 400 / mid; figures as label and value pairs in 11.5px, where each value must carry its "of N"; action line 12px / 500 / accent.
- **On a phone:** it becomes a sheet, 8px from the edges and the safe area, radius `--r`, with a 44 by 44 close button. The open carrier gets a 2px ring in its own colour, because on a phone there is no tether to connect the two.
- **A word with a definition** is marked with a 1px dotted `--edge-2` underline.
- Hover intent 380ms before opening, a 120ms grace period after leaving. Motion values are in 1.9.

### 1.8.11 Status

One status line for the whole app, silent and zero-height until something needs saying. 13px / 1.4 / `--mid`. A failure stays on screen until replaced, and uses weight 500 in `#C0392B`. A confirmation clears itself after 2.4s, because a confirmation nobody dismisses becomes furniture. **A control must never claim success before it has it.**

### 1.8.12 Scrollbars

Thin in every lighting. Track transparent; thumb `--edge-2` with 99px radius and a 2px transparent border (so it floats); 9px wide (6px in rails, 4px in the tooltip); thumb hover `--dim`. Always visible. Never hidden without an edge fade, because a scroller with nothing saying it scrolls is indistinguishable from missing content.

---

## 1.9 Motion tokens (values only)

Choreography belongs to the motion section. These are the named values, so the vocabulary is complete.

    --ease-out   cubic-bezier(.22, 1, .36, 1)      a thing arriving: fast off the mark, long settle
    --ease-in    cubic-bezier(.4, 0, 1, 1)         a thing leaving: it does not need to be watched out
    --ease-land  cubic-bezier(.34, 1.56, .64, 1)   a thing that lands: one overshoot, no ring

    --t-micro    120ms   hover, press, focus
    --t-element  220ms   one thing entering or leaving
    --t-surface  320ms   a panel or a rail, which carries more area
    --t-context  420ms   a whole tab: the longest the product may take

Why 120ms: below about 100ms a change reads as a jump with no cause; above about 150ms the pointer has already left. Why named at all: before these existed, 381 of 384 animated elements ran on the browser's default ease, a symmetric curve that reads as mechanical. The rule for the port: **every transition uses one of the three curves and one of the four durations.** Under reduced motion, show the end state, not a faster animation. The boot sheet uses `cubic-bezier(.4,0,.2,1)` for its closing fade, which is its own ruled exception.

---

## 1.10 Defects found while reading, and what to port instead

These are live in the shipped build today. For each: what is wrong, the measurement, the move, who found it, and whether the port should copy the shipped behaviour or the intent. **Do not reproduce a defect because it is on screen.**

**D1. Snow's inks on the black instrument stages.** The three instrument stages (Field, Energetics, Compass) paint `#101010` in Snow, but Snow's inks are dark. Measured on the stage: `--ink` #16171C at **1.06 to 1**, `--mid` 2.22, `--dim` 2.94, accent 3.41. On the Field, the CQ, DQ and SQ figures, the four quotient figures and the accuracy figure are unreadable (seen in the 1600 Snow Field capture). On the Compass, the light compass card sits in the upper half of a black stage with the black showing below it, and its "The Compass" label is `--dim` on black at 2.94. Glass white has the same `#101010` under its Energetics and Compass stages, but its instrument wells paint `#F2F1EC` over it, so the problem does not show there. Lumen solved the same problem with a scoped re-declaration. **Move:** give Snow's three stages the same scoped inks and surfaces as Dark (`--ink #EFEDE8`, `--mid #B4B0A8`, `--dim #94908A`, `--panel #1A1D26`, `--panel-2 #252833`, `--sunk #090A0E`, edges at white 9 and 14 percent, accent `#7EB8D4`). **Port the intent.** Sol. Moves Snow from failing to passing on the Field.

**D2. Per-lighting aura strength does nothing.** The stylesheet sets the aura to opacity 1 in Glass, .55 in Glass white and .22 in Flat. The painter writes an inline opacity on every repaint, and inline wins. Measured live: **.34 in all seven lightings.** So Glass's central idea ("the ground is the thing being refracted") is delivered at a third of its intended strength, and Flat carries more atmosphere than it asked for. **Move:** multiply the painter's opacity by a per-lighting factor (Glass 2.9, Glass white 1.6, Flat .65, others 1), clamped to 1. **Port the intent.** Sol.

**D3. Old gold survives as eleven literal values.** `rgba(223,204,126,a)` is the pre-ruling gold, and it still tints: the pressed icon cell's halo (.28), the verdict ground (.06), a pinned row (.2), selected energy rows and layer rows (.16 ground, .42 border), selected ritual rows (.16 and .4), the story field's focus border (.48), the drill card's border (.34) and ground (.06), and the right side of the release strip (.5). Each one puts a warm yellow wash under a blue accent, which is the palette the owner ruled out. The Punch seat default `#DFCC7E` is the same gold. **Move:** each becomes `mix(--accent same%, clear)`. **Port the intent.** Sol.

**D4. The tab ruling is contradicted in four lightings.** In Punch, Flat and Lumen, every top tab gets a `--panel-2` block and the current tab is a solid accent fill (seen in the Flat Summary and Lumen Field captures). Glass gives resting tabs a faint pane with a border. The standing ruling says "a tab is not a button and does not wear a box" and "a selected item changes its text, not its ground". The Punch and Lumen solid-fill rulings ("anything selected should be flat solid colour") collide with it, and nobody has written down which ruling governs the top tabs. Separately, the Flat and Lumen rules written for tabs target a class that is never emitted, so they have no effect. **Move:** ask the owner. **For the port, reproduce what ships** and flag it. Petra.

**D5. Glass tabs at rest.** A subset of D4, listed separately because it is clearly unintended: the Glass control style reaches the top tabs because they share the view-toggle class. **Move:** exclude top tabs from the Glass control rule. **Port the intent** (no box at rest). Petra.

**D6. Lumen's accent fails as text and as a fill label.** `#0091EA` measures **3.37** on white, and white on it is also 3.37. That applies to every accent-coloured word on paper (current tab, open accordion, links) and every accent-filled control label (primary button, pressed chip). **Move:** accent on paper `#0078C2` (4.70 on white, same hue, lightness .38), keeping `#0091EA` scoped to the stage, where it measures 5.65. A single value cannot pass on both grounds: `#0078C2` drops to 4.05 on `#101010`. Sol.

**D7. White on the alarm.** Punch's hot value pill and the recording state of the microphone button print `#FFFFFF` on `#FF2E1F` at **3.71 to 1**, at 11.5 to 18px. **Move:** use `--on-flat` `#0E1015` on the alarm (5.13). Sol.

**D8. The recording control uses the alarm for a state that is not wrong.** The microphone control is declared twice. The first declaration gives it a green border and a pulsing green dot while recording; the second fills the whole button with `--alarm`. So the product's one full-chroma "something is wrong" colour lights up whenever the person is simply talking. That breaks the alarm law. **Move:** keep the ruled green dot as the mode signal and give the recording button the accent treatment. Petra and Sol.

**D9. PAL_VIVID contrast.** On white: Sacral 2.61, Solar 2.79, Heart 3.11, Throat 3.59, Root 4.07. On the stage: 3rd Eye 3.71, Crown 3.49. This is the known cost of the vibrancy ruling. **Port rule:** in Lumen, a seat colour is never text on the ground where it fails. Where a seat name must be read, use the ink mix from 1.3.9. Sol.

**D10. Glass white `--dim` on its bare ground and on `--sunk`:** 4.29 and 4.18. **Move:** `--dim` to `#67645E` (4.76 on the ground, 4.67 on the composited `--sunk`), with hue held. Sol.

**D11. A spliced rule.** The drill card rule and its sticky back-bar rule were pasted into each other, so the stylesheet parses them as nested rules. The intended values: drill card `border 1px solid mix(--accent 34%, clear); radius --r; padding 16px 18px; background mix(--accent 6%, clear); margin 12px 0` (accent substituted for the old gold, per D3), and back bar `position sticky; top 0; margin -2px -2px 10px; padding 2px 2px 8px; background linear-gradient(--panel 72%, transparent)`. **Port the intent.** Bjorn.

**D12. Type scale:** 31 sizes. See 1.5.3. Bjorn. The owner's call.

**D13. Stale copy and comments.** The lighting menu's explanation mentions four of the seven lightings. The stylesheet's art direction header names Lexend and IBM Plex Mono, and neither exists. The project README and one internal brief list pre-ruling seat colours and "four lightings". The port should treat this section as current. Mika.

**D14. The Field's depth bar is clipped at 1600.** The sub bar under the navigation shows "Charge", and then a glyph and a letter cut off at the right edge, in every lighting captured. This is a screen-level issue for the screens section, noted here because it was visible in every capture. Petra.

---

## 1.11 Tissue test and sample

**Run.** The build at commit `1c021f4`, in Chromium, at 1600 by 1000 and 390 by 844, with Gordon (58, managing partner) loaded. He is the reference sample's refuser and the worst case for colour and contrast: Fear, Anger, Shame and Disgust at 10, nothing installed, coherence 1 percent, Collapsed. Field and Summary were captured in all seven lightings at 1600, the Field in Dark, Snow and Lumen at 390, and Snow Compass plus Glass white Body at 1600 (with Marcus, 44, loaded) to check the stage grounds. Live probes confirmed: exactly one loaded face (`Inter 300 700`), the aura canvas at 200 by 125 with opacity .34 in every lighting, Punch's seat tint resolving to Throat at weight .13 for this profile, and the stage ground and ink per lighting.

**Not run.** The profile at the opposite extreme (Rosa, almost nothing held) was not examined. She is the check that high good-end readings never look like an alarm by being full, and that read is still owed. The other ICPs were not examined individually. The Body, Compass, Ritual, Knowledge and Account surfaces were read in the stylesheet but not captured in every lighting. Contrast for Punch was measured at its default seat weight, not at a full Root reading.

**Grade.** The foundation is strong: a palette argued from physiology, one face carried in the file, a single signature object, a spacing system with a stated reason, and a design law enforced by tests. It loses points on D1 (a lighting that is unreadable on its primary surface), D2 and D3 (the lighting system not delivering its own stated intent), and D12 (a type system that never got a scale). With D1 to D3 fixed in the port, it is a foundation other teams could copy.

---

## Appendix A. Path data for the marks

All marks use a 24 by 24 viewBox, `fill: none`, `stroke: currentColor` (or `--c`), round caps and joins.

**Seats**

    Root     <path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/>                      shield
    Sacral   <path d="M12 4c4 4 4 12 0 16-4-4-4-12 0-16z"/>                          seed, vesica
    Solar    <path d="M13 3L5 14h6l-1 7 8-11h-6z"/>                                  bolt
    Heart    <path d="M12 20s-7-4.5-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.5-7 9-7 9z"/>
    Throat   <circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 3"/>                 dial
    3rd Eye  <circle cx="12" cy="12" r="3"/><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/>
    Crown    <path d="M12 3v18M3 12h18"/>                                            axis cross
    fallback <circle cx="12" cy="12" r="7"/>

**Quotients**

    vitality   M12 21v-8M12 13c0-3.4 2.4-6 5.6-6.4C17.2 10 15 12.6 12 13M12 13c0-2.8-2-5-4.7-5.4C7.7 10.4 9.6 12.4 12 13M9 21h6
    awareness  M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17M12 3.5L17.8 9.3M20.5 12h-8.2M17.8 14.7L12 20.5M6.2 14.7L12 8.9M3.5 12h8.2M6.2 9.3L12 15.1
    will       M12 21V4M12 4l-4 4M12 4l4 4M5 13.5h3.2M15.8 13.5H19
    flow       M6 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M12 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8M18 19c3-2.4 3-5.6 0-8 3-2.4 3-5.6 0-8

**Gates**

    aware    M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0     eye open
    ignore   M2 12s4 5 10 5 10-5 10-5M6 15l-2 3M12 17v3M18 15l2 3                                    eye shut
    detach   M10 14m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0         dot outside the ring
    intent   M12 20V5M6 11l6-6 6 6                                                                    raised arrow
    attach   M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5   link
    averse   M3 19C3 9 21 9 21 19M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0                              path bending round a dot

**Charges**

    Fear          M12 3l8 14H4z
    Anger         M13 2L4 14h6l-1 8 9-12h-6z
    Shame         M5 20V9a7 7 0 0114 0v11M9 20v-6h6v6
    Disgust       M4 8c4 4 12 4 16 0M6 16c3-3 9-3 12 0
    Apathy        M4 12h16M4 7h16M4 17h16
    Shock         M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0
    Sad           M12 20s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z
    Surprise      M12 3v18M7 7c-3 2-3 9 0 11M17 7c3 2 3 9 0 11
    Anticipation  M12 4v11M8 11l4 4 4-4M6 20h12

**Lightings** (in the lighting menu, 19px, stroke 1.6)

    Dark         M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z                  crescent
    Snow         M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 7l-2.6-2.6M12 7l2.6-2.6M12 17l-2.6 2.6M12 17l2.6 2.6   six-point flake
    Punch        M12 4a8 8 0 0 1 0 16zM12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0        circle, one half solid (the only fill)
    Glass        M5.5 7.2l9-3.2v12.8l-9 3.2zM14.5 4l4 2.4v11.2l-4 2.4M5.5 7.2L9.6 9.4   a pane at an angle, light off its edge
    Glass white  M5.5 7.2l9-3.2v12.8l-9 3.2zM14.5 4l4 2.4v11.2l-4 2.4M19 3l2.4 2.4M21 7.6l1.6-1.6   the same pane, lit from the front
    Flat         M3.5 5.5h7v7h-7zM13.5 5.5h7v4h-7zM13.5 12.5h7v6h-7zM3.5 15.5h7v3h-7z  four flat planes
    Lumen        M3 3h18v18H3zM8 8h8v8H8z                                               a white field with a block set in it

**Chrome** (15px)

    Lighting   <circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>
    Help       <circle cx="12" cy="12" r="9.2"/><path d="M9.4 9.2a2.7 2.7 0 1 1 3.4 2.6c-.6.2-.9.7-.9 1.3v.7"/><circle cx="12" cy="17.4" r="1"/>
    Profile    <circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"/>
    Back       <path d="M4 10h10a5 5 0 0 1 0 10h-3"/><path d="M4 10l4-4M4 10l4 4"/>      (14px)
    Forward    <path d="M20 10H10a5 5 0 0 0 0 10h3"/><path d="M20 10l-4-4M20 10l-4 4"/>  (14px)
    Chevron    <path d="M6 9.5l6 5.5 6-5.5"/>                                            (12px, opacity .7, rotates 180 when open)

## Appendix B. Token sheet, all seven lightings, for copying

    token        dark       snow       punch*     glass                  glasswhite             flat       lumen (paper / stage)
    --bg         #0C0D12    #EDEBE6    mix        #0B0D14                #E8E7E2                #0A0B0E    #FFFFFF / #101010
    --panel      #1A1D26    #F8F7F3    mix        rgba(30,34,46,.55)     rgba(255,255,255,.62)  #121419    #FFFFFF / #171717
    --panel-2    #252833    #F2F0EB    mix        rgba(42,47,62,.62)     rgba(255,255,255,.76)  #181B22    #F4F4F6 / #1F1F22
    --sunk       #090A0E    #E6E4DE    mix        rgba(14,17,26,.50)     rgba(228,226,220,.60)  #0A0B0E    #ECECF0 / #0A0A0A
    --edge       w .09      k .11      none       w .10                  k .10                  #232730    k .13 / w .14
    --edge-2     w .14      k .18      none       w .17                  k .18                  #2E333E    k .22 / w .24
    --ink        #EFEDE8    #16171C    dark       #F3F2EE                #14161C                #F7F6F3    #101010 / #F7F7F7
    --mid        #B4B0A8    #4E4C48    dark       #C2BEB6                #4A4843                #A9A69F    #43434A / #B6B6BC
    --dim        #94908A    #605E59    dark       #928D85                #6E6B65                #878378    #63636B / #8C8C94
    --accent     #7EB8D4    #2F6E92    dark       dark                   #2F6E92                #5FD4C4    #0091EA
    --on-accent  #0B1418    #F4F8FA    dark       dark                   #F4F8FA                #05100E    #FFFFFF
    --alarm      #FF2E1F    #D41200    dark       dark                   dark                   dark       #FF1500
    palette      PAL        PAL_LIGHT  PAL        PAL                    PAL                    PAL        PAL_VIVID
    --shadow     0 12px 34px rgba(0,0,0,.34) | snow 0 12px 30px rgba(40,54,74,.12) | glass 0 24px 64px rgba(0,0,0,.50) | glasswhite 0 20px 52px rgba(20,22,28,.14) | punch, flat, lumen none
    radii        16/11/8 everywhere except flat and lumen 4/4/3
    tooltip bg   #1A1D26 | snow #F8F7F3 | punch --panel-2 | glass #151922 | glasswhite #F6F6F4 | flat #121419 | lumen #FFFFFF

    w = rgba(255,255,255,a)   k = rgba(20,23,28,a) on snow, rgba(20,22,28,a) on glasswhite, rgba(16,16,16,a) on lumen
    * punch: the mixes in 1.3.10, driven by --seat and --seat-w; all other tokens as dark, edges transparent
