# Technical reproduction notes

Owner of this section: rendering implementation, performance budget, responsive mechanics.
Source of truth: `rebootos-sourcce/MOB`, read at commit `1c021f4` (build stamp `da6cca6`), 25 September 2026.
Every number below comes from one of two places. It is either quoted from the source with the file named, or I measured it on 25 September in headless Chromium 1194 (`/opt/pw-browsers/chromium-1194`) against the built `source.html`. Measured numbers are marked **measured** and dated. A measured number is true for that day, not for all time. Re-measure before you rely on one.

Where this document says "the port", it means the desktop reproduction in the sibling Atüned engine repo. It does not assume a stack. If the port runs a web view (Electron, Tauri, WebView2, WKWebView), every note applies as written. If it is native, map Canvas 2D to your immediate-mode 2D API (Skia, Direct2D, Core Graphics) and read SVG as "retained vector scene". The primitives map one to one.

---

## 1. Which rendering technology each surface uses, and why

The product mixes three technologies on purpose. Canvas 2D is used where the picture repaints continuously and holds a few hundred primitives. SVG is used where the picture is static between interactions and needs vector clipping, filters or scalable glyphs. DOM plus CSS is used for everything a person reads, focuses or taps. Reproduce the split, not only the look. Each choice below is load bearing for performance or for verification.

### 1.1 Surface map

| Surface | Host element | Technology | Redraw cadence | Why this technology |
|---|---|---|---|---|
| Boot sheet | `#boot` > `svg.boot-svg` (viewBox `0 0 200 200`) | Inline SVG animated by CSS `@keyframes`, no script | Once per load, then removed from the DOM | It has to run before any script has parsed, and it has to degrade with no script at all |
| Background wash ("aura", DQ) | `canvas#bgaura` | Canvas 2D at one eighth resolution, stretched by CSS | Only when its input signature changes. Its clock is quantised to 12 steps a second | A full-resolution blur cost 87 percent of the frame. See 2.4 |
| The Field wheel | `canvas#cv` | Canvas 2D, one context, full clear and redraw | Every rAF frame while motion is on. Skipped by signature under reduced motion | Several hundred primitives, all changing every frame (breathing, easing, spin) |
| Field overlays (key strip, legend, tier readout, balance bar, benign/malignant bars) | `#key`, `#keylo`, `#cvlegend`, `#tl`, `#acc`, `#bal`, `#polbar` | DOM plus CSS, with inline-SVG ring chips | On `render()`, which runs per interaction, not per frame | Text has to be selectable, readable by a screen reader and measurable by the gates |
| Field compass dial | `button#pol2` > `svg` (viewBox `0 0 104 360`) | SVG built once, then its marker moved with `transform: translateY()` | Rebuilt only when its signature changes. The marker moves every frame on the compositor | A per-frame rebuild of 25 SVG nodes was measured and removed (`personas.js:130`) |
| Ring chips (`cr()`) | `.cr` everywhere | Inline SVG, two `<circle>` strokes, the value arc drawn with `stroke-dasharray` / `stroke-dashoffset` | With their host | Scalable, crisp and themable through `var(--c)` |
| Body map ("Energy", TAB 3) | `#emap` > `.pm-well` > `svg.pm-svg` (viewBox `0 0 100 100`) plus a CSS-gradient `div.pm-aura` behind it | One SVG document, rebuilt as a string into `innerHTML` | On `render()`, not per frame. The frame loop only repaints `#bgaura` on this tab | It needs clip-to-silhouette, a Gaussian blur and screen blending over a static figure. SVG gives all three for free on a picture that does not animate |
| Compass (TAB 8) | `canvas#conecv` inside `#cone` | Canvas 2D, its own context, its own rAF loop (`coneTick`) | Every frame, only while the compass is open | A continuously spinning axonometric wireframe |
| Compass axis names | `.cn-nms-l`, `.cn-nms-r` | DOM buttons with inline SVG glyphs | On open, plus a class toggle per frame for the front axis | Moved off the canvas on a ruling. Painted names had 89 colliding pairs at 1600 wide that no gate could see (`cone.js:225`) |
| Coherence-over-time graph, integrity-over-time graph | `svg.cn-gsvg`, `svg.s-ig-g` | SVG, viewBox `0 0 100 100`, `preserveAspectRatio="none"`, strokes with `vector-effect="non-scaling-stroke"` | With their host | They stretch to any box while the line weight stays fixed |
| Icons | inline `<svg viewBox="0 0 24 24">` | SVG on a 24-unit grid, stroked, never filled | With their host | Ruled: "Icons are ring, not fill" |
| Everything else (rails, tabs, drills, Summary, Knowledge, Story, Ritual, Games, Settings, sheets) | DOM | HTML plus CSS | On `render()` or on their own open | Text, focus, tap targets |

The canvas never reads a CSS custom property. Every colour a canvas needs is duplicated into JS and must move with the stylesheet. `component.js:217` says so: "the accent, for the canvas, which cannot read a custom property. the two values are the same two the sheet declares and they move together." `GOLDC()` returns `#2F6E92` under Snow and `#7EB8D4` otherwise. `bc(b)` picks `PAL_VIVID` under Lumen, `PAL_LIGHT` under Snow and `PAL` everywhere else. The port needs one colour source feeding both the vector/DOM layer and the immediate-mode layer. Otherwise the two drift, which has already happened here twice (the Lumen palette and the orange CQ ramp, both documented in `wheel.js`).

### 1.2 The Field wheel, in drawing order

`canvas#cv`, 2D context `g`. It sits in grid column 2, row 3 of `.stage`, at `width:100%; height:100%`.

**Backing store.** `layout()` in `component.js:325`:

```js
DPR=Math.min(devicePixelRatio||1,2);cv.width=b.width*DPR;cv.height=b.height*DPR;
CW=b.width;CH=b.height;reframe();
g.setTransform(DPR,0,0,DPR,0,0);
```

DPR is capped at 2. All drawing is in CSS pixels through the transform. A `ResizeObserver` watches **the canvas, not the stage**, and re-lays out only when the box moves by 0.5 px or more. The reason is in the source: the stage changes height without the window resizing (a sub bar appears, a tab swaps, a webfont arrives). Before the observer existed the buffer stayed 913 tall inside an 847.6 box, and every circle drew as an ellipse squashed by 7.2 percent (`component.js:352`). The port must re-size its backing store whenever the element's box changes, not only on window resize.

**Measured backing stores, 25 September:** 1600x1000 at DPR 1 gives `664x726`. At DPR 2 it gives `1328x1453`. At 390x844, DPR 2, it gives `748x670` (374x335 CSS px).

**Radius.** `reframe()` computes the unit radius `U` from the free space, not from the box. `half = min(CW,CH)/2`. The distance to the nearest corner of any visible overlay in `['tl','acc','bal','howto']` cuts that back to `free`. Then `BASE_U = max(40, min(half, (free - LBL_M) / LBL_R))`, with `LBL_R = 1.20` (the outermost label sits at 1.2 U) and `LBL_M = 30` (px of room for label text). `U = BASE_U * S.zoom`. Non-finite values are guarded back to 40 and zoom 1. Pan limit per axis: `C*0.5 + max(0, U*LBL_R - C/2)`. Zoom runs from 1 to 7 (`ui.js:200`) and is applied to `U` and the centre, never to the canvas transform, so hit testing needs no inverse matrix.

**Depth ladder.** `S.view` is 0 to 3 (Charge, Patterns, Chains, Blueprint). Zoom adds depth at `ZOOM_STEP=[1,2.2,3.2,4.2]` and never removes what the button set. Radii per depth `L` (`wheel.js:691`):

| Element | L0 | L1 | L2 | L3 |
|---|---|---|---|---|
| shell outer radius | .62U | .68U | .74U | .78U |
| core base radius | .30U | .26U | .20U | .155U |
| law spokes start r0 | .44U | .40U | .33U | .255U |
| law spoke max length | .13U | .12U | .10U | .085U |
| law spoke lineWidth (px) | 4.6 | 4.2 | 3.6 | 3.2 |
| saboteur ring | none | .56U | .545U | .50U |

Fixed radii: archetypes `.60U`, complexes `.425U`, hyper `.335U`, character `.255U`, domains `.93U`, masks `.685U`.

**Draw order, back to front** (`drawWheel`, `wheel.js:689`):

1. `g.clearRect(0,0,CW,CH)`. The canvas is transparent. The stage paints `#101010` behind it on the Field, Energy and Compass tabs (`head.html`, `body.tab-field .stage ... {background:#101010}`).
2. Chain chords, L2 and L3 only. Quadratic Béziers (`quadraticCurveTo`) from each part to its parent. The control point sits on the mean angle at `(r0+r1)/2 * pull`. Pull is the sag `base*(1.28-0.62*t)`, where `t` is susceptibility normalised as `(susc-0.45)/0.85` for saboteur chords and weight normalised as `(w-3.5)/3.0` for the others. Width and alpha both scale with weight. Unnamed saboteurs are dashed `[3,3]`. At L1 the chords are straight 1 px lines at alpha .24.
3. The core (`solCore`). A halo radial gradient appears only above CQ 50. Then an opaque disc filled from `cqRamp` (stops at 0/.28/.50/.76/1.00: `[58,23,20] [163,58,50] [90,96,112] [126,184,212] [234,244,249]`) and a darker rim. The zoom-revealed interior ("feathers") is clipped to the core. Then a shading radial gradient, a specular dot and a rim stroke. Last comes the CQ number in `500` weight, sized `max(15, min(cr0*0.52, 64))` px, over three stacked flat discs at alpha .34, .42 and .52 **instead of a gradient**. The reason is measured and in the source: "a gradient is allocated fresh on every frame... the Field fell to 21.7 frames a second under dark and 9.4 under snow" (`wheel.js:425`). An "of 100" caption follows only if its size would be at least 11 px. The core breathes at `sin(S.t*1.4)*.05` unless reduced motion is on.
4. Six gates (`verpArrows`): stem, a filled disc of radius 13, a track ring, a progress arc from 12 o'clock, a Path2D glyph scaled 15/24, and a 22 or 26 by 12 pill with `600 8.5px` text.
5. 21 law spokes (round caps), plus one 1 px ring at alpha .12.
6. Archetype ring, L2 and L3: 12 annular sectors via `arcP` (two arcs and closePath) with radial text.
7. Mask ring, L3 only: 6 sectors.
8. **The shell.** One annular sector per ring address in `W`. The angular half-width is `TAU/108*(.43 + fg*.24)`. Each sector gets its **own new `createRadialGradient`** from inner to outer radius. Addresses with `disp >= 6.5` get a second fill with `shadowBlur = 16`. Addresses with `disp >= 9` get a 1.4 px stroke in `#FF2E1F`. Hover or pin gets a 2 px accent stroke. (The code's literal step is `TAU/108`: `W` holds the somatic ring, and the four field anchors in `BY` are not drawn on it. The count stated to users is 112 by ruling. Never print the ring's count in UI copy.)
9. Fetter growth, zoom at or above 1.55 then 2.05 (`FET_STEP`): Path2D axis glyphs, edge strokes, held and installed bars, radial names.
10. Atoms, zoom at or above 2.60 (`ATOM_STEP`): up to 6 lines per address, each tipped with a dot.
11. Seat names, L1 and up: 7 radial labels at `1.058 * shell`, `600 12px`.
12. Domains, L3: 19 sectors plus labels.
13. Beads: each is a radial-gradient sphere plus a specular dot. A hovered bead gets an extra glow gradient. Nameplates use a collision solver (`plateHit`) and leader lines. Inner rings use horizontal "flat plates" with box collision.

All canvas text: `"<weight> <size>px Inter, system-ui, sans-serif"`. Radial text flips 180 degrees on the left half so it never reads upside down.

**Hit testing.** Nothing on the canvas is a DOM element. During the draw, every interactive mark pushes a record into `HIT`: either a circle `{x,y,rad}` or an annular sector `{cx,cy,a0,a1,r0,r1}`. `hitTest()` scans `HIT` **in reverse** (last drawn wins) and checks atoms first when the atom layer is up (`ui.js:86`). Hit regions are registered at the **settled** position, not the mid-animation one. The port needs an equivalent display list of hit shapes built in the same pass as the pixels.

**Label boxes.** `radialTxt` also pushes an axis-aligned box for every rotated run into `LBL` (`component.js:372`). This exists because "a canvas label is pixels and a probe that reads pixels lies". The collide gate reads `LBL` and `window.__PLATES` to prove no two labels overlap and no label leaves the canvas. The port must publish its canvas label boxes the same way, or it cannot verify label collisions.

### 1.3 The background wash

`canvas#bgaura`, `position:fixed; inset:-6%; width:112%; height:112%; pointer-events:none; z-index:0` (`head.html:633`). The backing store is `ceil(innerWidth/8) x ceil(innerHeight/8)` (`AURA_DIV = 8`). **Measured:** `200x125` at 1600x1000 and `49x106` at 390x844. The painted content is five radial gradients. One is centred, in the accent colour, with reach `lerp(.20,.58,CQ/100)` of the long side. Four sit near the corners and drift on `sin`/`cos` of a quantised clock `round(S.t*.09*12)/12`, with radius `.28 + dens*.36` and `dens = clamp(DQ/7,0,1)`. Element opacity is `(.16 light | .15 dark) + radiance*.24`, written to `style.opacity`. There is no CSS `filter`. The browser's bilinear upscale is the blur. `pointer-events:none` is mandatory: without it the wash ate every tap below 1180 px (`head.html:627`).

### 1.4 The Body map

One SVG in a `0 0 100 100` box, `preserveAspectRatio="xMidYMid meet"`, absolutely filling `.pm-well`. Structure in paint order (`map.js:206` onward):

1. `div.pm-aura` behind the SVG: a CSS `radial-gradient(ellipse 62% 48% at 50% 40%, <dominant seat colour> 0%, transparent 70%)` at opacity `0.08 + radiance*0.30`, `inset:-18%`, and **`filter: blur(40px)`**.
2. `<clipPath id="pmClip">` holding **one `<path>`** (the body outline, with its transform on the path). Design gate 10 asserts that the clip holds only geometry elements. A `<g>` inside a clipPath is invalid and silently clips everything away, which shipped once with 49 marks invisible.
3. Silhouette: the same path, fill `rgba(150,152,160,.085)`, stroke `currentColor` at 1.6 px with `vector-effect="non-scaling-stroke"` and stroke-opacity .34. A raster figure path exists (`FIG_FETTER`, `FIG_PAIN`), but both names are empty strings, so nothing is requested and the vector body is what ships.
4. The channel: one closed cubic path down the spine, filled and stroked with a vertical `linearGradient` (one stop per seat, opacity `0.05 + v*0.15`).
5. The heat field: seven `radialGradient` ellipses (4 stops each) plus one small circle per loaded address. All of them sit in one `<g style="mix-blend-mode:screen" filter="url(#pmField)" clip-path="url(#pmClip)">`, with `feGaussianBlur stdDeviation="2.4"` and filter region `x=-25% y=-25% w=150% h=150%`. The filter runs before the clip on the same element, which is the required order: blur first, then cut at the skin. A second blurred group holds the outer discs of heat marks.
6. Seat cores (sharp circles with `<title>`), domain rings, links, pattern arcs (quadratic, bowed off the perpendicular), then the address marks in a clipped group.

**Measured:** 552 SVG descendants under `#emap` and 21,039 characters of markup (monitor, 25 September). `renderMap` takes 2.5 to 3.8 ms of script per call, excluding style, layout and paint.

### 1.5 The Compass

`canvas#conecv`, height `min(54vh,470px)` on desktop. It has its own DPR (capped at 2) and its own loop, which runs only while `CONE.open`. The projection is about forty lines with no library (`cone.js:101`):

```
t = (clamp(q,0,100)-50)/50                 -1 floor, +1 crown
y = t * U * coneH()                        U = min(W,H)/2
radius by |t|: shaft to 0.64 (neck 0.14 tapering 34%), barb to 0.76 (flare to 0.52), straight point to 0 at 1
th = a + spin
x3 = cos(th)*rad,  z3 = sin(th)*rad
screen x = W/2 + x3
screen y = H/2 - y*cos(tilt) + z3*sin(tilt)
depth    = z3*cos(tilt) + y*sin(tilt)
```

There are 11 rings at q = 0..100, each sampled at 49 points. The q = 50 ring is 1.6 px at alpha .5 and the rest are 1 px at .13. A waist band (the 40 to 60 fill) is drawn at ink alpha .05. There are 8 meridians, and the far half dims to .16. A ribbon joins each axis position, with nodes sorted back to front. Default state is `flat:true` (tilt `0.0001`). Drag tilt is clamped to `0.08..0.92`. Idle spin is `+0.0022` rad per frame. Aimed spin eases 12 percent of the remaining gap per frame and stops below 0.004 rad. **Measured:** `coneDraw` takes 0.48 to 0.62 ms of script.

### 1.6 Three measurement traps, one per technology

These come from `tools/monitor.js` and `CLAUDE.md`. Each one has already produced a false report in this repo. Build your verification around them.

1. **`innerText` does not see SVG.** The Body page reports 0 characters of text while rendering correctly (monitor, 25 September: `body ... 21039 markup 0 text`). Verify an SVG surface by markup size or element count, never by text length.
2. **A canvas has no `innerHTML`.** The Field reported 0 markup while drawing correctly. Verify a canvas by its pixels (see 5.1).
3. **CSS keyframes run without script.** The boot sheet fades on a keyframe with a forwards fill. With script disabled or failed, it lifts on schedule and uncovers a complete-looking shell with an empty tab bar and nothing in the middle. The owner saw exactly this in a preview pane. The fix is a `<noscript>` notice at `z-index:9999` above the boot sheet, plus a separate-script-tag boot guard for the case where scripts are on but the main block fails to parse. Your equivalent: whatever animates your splash must not be able to finish while the app behind it is empty.
4. **Find a host by its identity, never by its position.** The monitor once took "the first visible child of `.stage`" and measured the same key strip nine times under the heading "all surfaces render". Look hosts up by id.

---

## 2. The frame loop and the performance budget

### 2.1 What runs per frame

`ui.js:973`:

```js
function loop(ts){
 if(!REDUCED)S.t+=(last?Math.min(.05,(ts-last)/1e3):0);
 last=ts;
 var r=compute();
 if(S.tab===TAB.FIELD){draw(r);drawAura(r);renderPol2(r);}
 else if(S.tab===TAB.ENERGY){drawAura(r);}
 requestAnimationFrame(loop);}
```

`compute()` runs every frame on every tab. The wheel, the wash and the dial run on the Field. Only the wash runs on Energy. Every other tab paints nothing per frame. `render()`, which rebuilds the DOM rails and the Body SVG, runs **per interaction, not per frame**. The compass runs its own separate rAF loop while it is open. The loop is started last in boot, outside the guarded start-up steps, so a partial boot still paints.

Easing is time based, not frame based (`wheel.js:1021`). Each address eases `disp` toward `sq` with `k = 1 - exp(-DISP_RATE*dt)`, `DISP_RATE = -ln(.86)*60 ≈ 9.05 /s`, and dt clamped to 100 ms. At exactly 60 Hz this equals the old 0.14 per frame. At 120 Hz it gives the same settle time. The port must use the dt form, not a per-frame constant.

### 2.2 Measured cost, 25 September

Headless Chromium 1194, script-side time per call, averaged over 40 calls. **This is the CPU time to issue the commands, not raster time.** Chromium may rasterise the canvas later on the GPU or in software, and that cost shows up only in the frame rate. Treat these numbers as a floor. Gordon is the heaviest persona in the roster.

| Config | Profile | compute | wheel L0 | L1 | L2 | L3 | L3 at zoom 3.2 | wash | dial | render() DOM | rAF fps |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1600x1000, DPR 1 | blank | 0.13 to 0.22 | 0.62 | 0.76 | 0.79 | 1.19 | 1.42 | ≤0.05 | ≤0.01 | 3.43 | 61.4 |
| 1600x1000, DPR 1 | Gordon | 0.23 to 0.30 | 0.75 | 1.44 | 2.00 | 1.78 | 3.20 | ≤0.05 | ≤0.02 | 2.70 | 61.1 |
| 1600x1000, DPR 2 | Gordon | 0.23 to 0.30 | 1.43 | 1.49 | 3.10 | 4.09 | **6.04** | ≤0.08 | ≤0.02 | 3.02 | 59.0 |
| 390x844, DPR 2 | Gordon | 0.25 to 0.29 | 0.69 | 1.26 | 1.80 | 2.00 | 3.06 | ≤0.06 | ≤0.02 | 3.11 | 61.1 |

All times are in ms. Against an 8 ms budget (half of 16.7 ms, because the rest of the page exists), the worst case measured is **6.04 ms** of script for the wheel: Gordon at depth 3, zoom 3.2, DPR 2. That is 75 percent of the budget before raster. This is the configuration the port must profile first, on its weakest target machine.

### 2.3 Per-frame canvas call counts (measured, 1600x1000, disp settled)

| Profile | Depth | createRadialGradient | fill | stroke | arc | fillText | setLineDash | fills with shadowBlur |
|---|---|---|---|---|---|---|---|---|
| blank ("You") | L0 | 110 | 124 | 42 | 234 | 6 | 0 | 0 |
| Ana | L0 | 110 | 136 | 43 | 237 | 7 | 0 | 9 |
| Tomas | L0 | 110 | 152 | 42 | 237 | 7 | 0 | 25 |
| Gordon | L0 | 110 | 160 | 43 | 237 | 7 | 0 | **33** |
| Gordon | L3 | **177** | 331 | 241 | 445 | 56 | 275 | 33 |

Two facts the port should know:

- **The shell allocates a new gradient object per address, every frame.** That is 110 at minimum (108 shell addresses plus the halo and the core shading) and up to 177 with beads. The source already caught this pattern once, at the core's number disc, and replaced it with flat discs. The shell was not changed. In a garbage-collected runtime this is steady allocation in the hot loop. It holds 60 fps today on this hardware. It is also the first thing to fail on a four-year-old laptop.
- **`shadowBlur = 16` fires once per address at `disp >= 6.5`.** That is 33 blurred fills per frame on Gordon. My working ceiling for shadowBlur is 20 per frame.

### 2.4 Regressions this codebase measured, and what fixed each one

Each of these is a trap the port can walk into. The numbers are quoted from source comments, which name the file.

| What was done | Measured cost | Fix now in the code | Source |
|---|---|---|---|
| Wash canvas at full viewport, inset 25%, CSS `filter: blur(120px)` | 7.7 fps, against 59.5 with the element hidden. 40 px blur still gave 15.2 | Paint at 1/8 scale and let the upscale blur it. The backing store went from about 3.6M to 56K pixels | `component.js:329`, `head.html:627` |
| Five full-canvas radial gradients painted every frame on 1600x1000 | 82 ms of a 103 ms frame. Reduced motion repainted byte-identical output | Wash clock quantised to 12 steps a second, and the paint is skipped when the signature is unchanged | `wheel.js:2` |
| Radial gradient behind the CQ number, allocated every frame | 21.7 fps on dark, 9.4 on snow | Three flat stacked discs | `wheel.js:425` |
| `backdrop-filter` on panes over the Field, Glass lighting | 12.0 fps glass and 16.4 glass white, against 60.5 on dark. Not the radius (26 to 10 px gave 12.0). Not the count (71 to 5 gave 12.7). Not layer promotion (11.6 to 12.1) | `body.glass.tab-field * { backdrop-filter:none !important }` plus denser pane grounds. Stopping the wheel repaint alone gave 56.7 | `head.html:490`, design gate 13 |
| Onboarding sheet with a backdrop blur over the Field | 10.9 to 18 fps across lightings | Opaque ground `rgba(6,6,8,.94)` and no backdrop | `head.html:3536` |
| Reduced motion still redrawing the wheel every frame | Slower than with motion on | `DRAW_SIG`: skip the draw when depth, tab, profile, hover, pin, theme, zoom, pan, summed sq and CQ are unchanged | `wheel.js:1004` |
| Rebuilding the dial SVG every frame | 25 nodes serialised per frame | Signature check first, then move the marker with `translateY` only | `personas.js:127` |

The rule under the fourth row is the most important one for the port. **Any backdrop blur above a surface that repaints every frame has to re-read and re-filter that backdrop every frame, and the cost scales with area.** In a web view this is exact. Natively, it applies to any translucent material effect composited over a live layer (NSVisualEffectView, Mica, Acrylic). Glass is allowed on every tab except the Field, and on the Field it keeps its tint, specular, fringe, edge and shadow but not its blur.

### 2.5 Other live budgets (measured, 25 September)

- DOM nodes on the Field: **2,543**. On Body: **2,478**. My ceiling is 3,000, so there is about 450 of headroom. The port must not add a DOM element per address or per label.
- SVG nodes on the Field (chips, icons, dial): **807**. Under `#emap`: **552**. Ceiling is 1,500.
- `backdrop-filter` declarations in the sheet: 18. All are under Glass or Glass white, the release sheet, and one intake element. Budget: one at a time, never over the Field.
- `filter: blur()` on a large area: `.pm-aura`, 40 px over `inset:-18%` of the Body well. It is static between interactions, but `renderMap` rewrites `innerHTML`, so the blurred layer is recreated and re-rasterised on every `render()` on that tab. See 2.6.
- `will-change` is used once, deliberately, on `.pol2-mv` (the dial marker).
- `prefers-reduced-motion: reduce` has a global kill switch: `*{transition:none!important;animation:none!important}` (`head.html:3803`). The boot is hidden outright. The wheel's clock freezes and `disp` snaps to `sq`. The wash paints once.

### 2.6 Porting verdicts, surface by surface

The format is cost, the cheaper path, and the floor.

**The Field wheel. Yes, with a change.**
- Cost: 0.6 to 6.0 ms of command issue per frame (measured, above), plus raster. There are 110 to 177 gradient allocations and up to 33 shadow-blurred fills per frame. It is not compositor-only: it is a full clear and repaint every frame.
- Cheaper path, about 85 percent of the look: (a) cache one gradient per address and rebuild it only when that address's colour or its `ld` quantised to 1/64 changes. That removes nearly all allocation, and `disp` settles within a second, so the cache is warm almost always. (b) Replace per-address `shadowBlur` with one pre-blurred glow sprite per seat colour, rendered once to an offscreen surface and drawn with `drawImage` under additive or `lighter` compositing. (c) Split the canvas into two layers: static geometry (chords, archetypes, domains, masks, labels), redrawn only on depth, zoom, pan, profile or theme change, and a live layer (shell, core, beads). Chords are the most expensive static element at L2 and L3.
- Floor: at DPR 1 on integrated graphics, drop shadowBlur entirely and keep the gradient fill. The seat glow degrades to a brighter fill and the reading survives. Do not drop the breathing or the easing: under the owner's rulings they carry meaning.

**The wash. Yes as is.** It costs about 0.05 ms at 1/8 scale and is compositor-scaled. It is already the cheap version. Floor: paint once and freeze the clock.

**The Body map. Yes, with a change.**
- Cost: 2.5 to 3.8 ms of string building per `render()`, then an SVG parse, a style pass and one `feGaussianBlur` over the clipped heat group. There is also a 40 px CSS blur on a div that is recreated on every render. This happens per interaction, not per frame.
- Cheaper path: keep one persistent SVG and update attributes on the existing nodes rather than rewriting `innerHTML`. Hoist `.pm-aura` out of the rewritten subtree so its blur is not re-rasterised. If the port is native, render the heat field once to an offscreen bitmap (7 gradients plus blooms), blur it once, mask it by the silhouette, and cache the result per layer and profile.
- Floor: without a Gaussian blur, the ellipses read as discs. That is the exact defect the owner rejected ("blooms on a diagram"). The blur is not optional. If the platform cannot blur a vector group, pre-render the field.

**The Compass. Yes as is.** It takes 0.5 ms of script and runs only while open. It is not compositor-only, but it is small.

**Glass lighting. Yes, with the existing exception.** No backdrop blur on the Field, ever.

---

## 3. Breakpoints and responsive mechanics

### 3.1 Every width breakpoint in `atuned_src/shell/head.html`

| Query | Line | What changes |
|---|---|---|
| `max-width:1240px` | 2805 | `.iq-laws` goes to one column |
| `max-width:1180px` | 3200 (main block), 2116, 2164, 2739, 2839, 3529 | **The layout break.** See 3.3 |
| `max-width:1100px` | 1932, 1977 | `.s-cols` goes to one column. `.kb-rg` goes to two columns |
| `max-width:1000px` | 3886 | Account area: `.ac-body` goes to one column and its index becomes a wrapping row |
| `max-width:900px` | 1131 | `.s-two` goes to one column, gap 26 px |
| `min-width:900px` / `max-width:899px` | 3631 / 3632 | Compass axis names: absolute side rails (`top:74px`) at or above 900. At or below 899 they become centred wrapping rows under the figure |
| `max-width:820px` | 3215 | The top bar wraps. The profile select loses its max width |
| `max-width:720px` | 3216 (main block), 1978, 2178 | **The phone break.** See 3.4 |
| `max-width:640px` | 3592 | Onboarding card padding and headline sizes shrink |

Non-width queries:

- `(pointer:coarse)`, line 1283: `canvas#cv{touch-action:pan-y;cursor:default}`. JS also reads `matchMedia('(pointer:coarse)')`, and on a coarse pointer a drag on the wheel never writes a charge, while a tap opens the address. This is a data-safety rule, not styling. A thumb scrolling over the wheel once rewrote a charge from 8.0 to 10.0 (`ui.js:101`).
- `(prefers-reduced-motion:reduce)`: lines 3107, 3569, 3707, 3776, 3803.
- `(prefers-reduced-transparency:reduce)`, line 556: Glass drops its backdrop and takes a solid seat-tinted ground.

The viewport meta is `width=device-width,initial-scale=1,viewport-fit=cover`.

### 3.2 Desktop, above 1180 px

- `html,body { overflow:hidden; height:100% }`. The app is a fixed full-viewport frame: `.app{position:fixed;inset:0;display:flex;flex-direction:column;gap:10px;padding:10px}`.
- `.mid{display:grid;grid-template-columns:302px 1fr 336px;gap:10px}`. That is a left rail of 302, the stage, and a right rail of 336. Each rail scrolls inside itself.
- `.stage{--lane:128px;display:grid;grid-template-columns:var(--lane) minmax(0,1fr) var(--lane);grid-template-rows:auto auto minmax(0,1fr)}`. Row 1 holds the key strip across all columns. Row 2 holds the legend line across all columns (its own row, so it collides with nothing by construction). Row 3 holds the canvas in column 2 and the compass dial in column 3. Tab surfaces (`.iq`, `.emap`, `#cone.tabmode`) are `position:absolute; inset:0` over the stage.
- The corner readouts `.tl` (`top:14px; right:152px`) and `.acc` (`right:20px; bottom:14px`) sit over the canvas. The wheel's radius is solved against their corners (1.2).

### 3.3 From 721 to 1180 px

`head.html:3200`:

- `html,body{overflow:auto}` and `.app{position:static;min-height:100%}`. The page scrolls instead of the panels.
- `.mid{grid-template-columns:1fr}` and `.mid>*{min-width:0}`. Without the min-width, one wide child stretched the column, and the wheel drew 822 px across a 390 screen.
- `.stage{order:-1; min-height:62vh}`. The stage comes **first**, ahead of the left rail. Before this fix, DOM order put the wheel 1,902 px down the page on a phone.
- `.panel.sc{max-height:none;overflow:visible}`. The rails stop scrolling internally.
- `.keylo` goes static into flow (order 9). `.cv-legend` moves to order 2. The compass canvas takes `min(46vh,380px)`. Body-map controls (`.pm-top`, `.pm-reg`) become static.

### 3.4 At 720 px and below

`head.html:3216`:

- `body{font-size:14.5px}`, `.app{padding:7px;gap:6px}` and `.panel{padding:13px 14px}`.
- `.stage` stops being a grid and becomes a flex column: `display:flex;flex-direction:column;overflow:visible`.
- `canvas#cv{flex:0 0 auto;height:min(86vw,390px);order:1;width:100%}`. It gets an explicit near-square box, because flex against an unconstrained stage collapsed it to zero.
- The overlays that were absolute (`.tl`, `.acc`, `.howto`, `.pol2`) go into flow at orders 2, 4, 5 and 6. `.pol2 svg{height:190px}`.
- The key strip becomes a single row that scrolls horizontally with a hidden scrollbar. So does the depth bar `#vbar`. It had run 996 px past the screen, unreachable, because `html` clipped `body.scrollWidth` 1386 to 390.
- `.iq`, `.emap`, `#cone.tabmode` and `#rit` are released from `position:absolute` to static flow. Each had measured 10 or 36 px tall on a phone with thousands of pixels of content clipped.
- Body map: `.pm-well{flex:0 0 auto;min-height:min(122vw,470px)}`. Without it the SVG measured 374 by 0.
- Compass: `#cone.tabmode .cone-cv{height:min(88vw,400px)}` and one page scroll, with no inner scroll.
- Sheets anchor to the bottom: `.sheet-card{width:100%;max-height:82vh;border-radius:var(--r) var(--r) 0 0}`.
- `.sum-cq b,.ab-cq b{font-size:38px}`. The matrix grid becomes `repeat(19,1fr)` with a 1 px gap.

### 3.5 The two test widths, and the gap between them

The gates validate at exactly two viewports:

- **1600x1000**, DPR 1: monitor, design gates 1 to 17, shots.
- **390x844**, DPR 2, `isMobile:true`, `hasTouch:true`: monitor, design gate 17 sweep, shots.

Other sizes in use: `collide.js` runs at 1680x1020. Design gate 11 (the boot) runs at 1200x800. The monitor's no-script check runs at 1200x800.

1600 sits above every width breakpoint. 390 sits below every one. **No gate exercises the band from 721 to 1180, nor 900 vs 899 (compass names), nor 1100 or 1240.** The band from 721 to 1180 is a real layout (single column, page scroll, grid stage), and nothing automated looks at it. The port should add at least 1024x768 and 800x1000 to its own verification. A tablet or a narrow desktop window lands exactly there.

---

## 4. Font delivery

`head.html:28`, in a `<style>` block of its own ahead of the main sheet:

```css
@font-face{font-family:'Inter';font-style:normal;font-weight:300 700;
font-display:swap;src:url(data:font/woff2;base64,d09GMgAB...) format('woff2')}
```

- **One file.** It is a variable font whose weight axis is declared 300 to 700, carried as a base64 `data:` URI.
- **Size, measured by decoding it:** 64,344 base64 characters and **48,256 bytes** of WOFF2 (magic `wOF2`). This matches the source comment: "Forty eight kilobytes raw, sixty four as base64, which is about a tenth of the build."
- **Subset:** the comment says "latin subset". I could not verify the glyph coverage here (no font tooling in the container), so treat it as stated, not confirmed. The product uses `ü` (Atüned), `·` (middle dot), `×` and `–` (en dash), all inside Latin-1 and General Punctuation. Confirm that the port's copy covers them.
- **Why it is embedded:** the file used to link `fonts.googleapis.com` and `fonts.gstatic.com`, so "every load sent the person's IP address to Google before they had typed a word" in a product that holds somatic and psychological self report and promises nothing leaves the device. The ruling is zero outbound requests. Design gate 7 watches the network, not the source, and fails on any request that is not `file:`, `data:`, `blob:` or `about:`. It then asserts that `document.fonts` has an Inter face with status `loaded`, so a silent fallback to system-ui counts as a failure.
- **Stacks:** `--sans:'Inter','Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif` and `--num:'Inter','Inter Tight',system-ui,-apple-system,sans-serif`. `var(--num)` is used 79 times and `var(--sans)` 62 times. `font-variant-numeric:tabular-nums` appears 37 times, on every figure that can change. `-webkit-font-smoothing:antialiased` is set on `html,body`. Body text is `16px/1.65`, weight 400.
- **Canvas text uses its own literal stack.** It is `Inter, system-ui, sans-serif`, with explicit numeric weights 400, 500 or 600 and px sizes, because a canvas cannot read `var(--sans)`.
- **The two fallback pages use system-ui on purpose.** The packed wrapper (`tools/pack.js`) and the `.nojs` notice both run before or without the embedded face.

**What the port must do:**
1. Ship the **same WOFF2 bytes**. Decode them from `head.html` line 29, or take Inter's variable font and subset it to match. Weight axis 300 to 700. Bundle it as an app resource or embed it. Never link a font CDN.
2. Register the face **before the first canvas paint**. Canvas text that draws before the face is ready renders in the fallback, and a canvas does not re-render on font load the way DOM text does. In the browser build the data-URI face decodes almost immediately. The code still guards the related layout shift with the canvas `ResizeObserver` (1.2). In a native port, load the font synchronously at startup.
3. Keep `tabular-nums` (OpenType `tnum`) on every number.
4. Assert, in the port's own tests, that the resolved family is Inter and not a fallback.

---

## 5. The measured floors the design gate enforces

`tests/design.js`, read in full. These are literal assertions. The port's reproduction should pass an equivalent of each one. Where a gate counts something, the count is read from the product at run time and never typed in. Keep that property.

| Gate | What it asserts | Literal threshold |
|---|---|---|
| 1 Load | No console or page errors. `.tabtop` count equals `TABDEF.length`. Depth buttons, domain buttons, archetype buttons, law fields, axis fields and matrix cells are counted. `#eshelf` exists | Zero errors. Tabs equal TABDEF. Depths **4**, domains **19**, archetypes **12**, law fields **21**, axis fields **18** (9 held plus 9 opposite), matrix cells **171** |
| 2 One surface | For each TAB integer 0,1,2,3,4,6,7,8, exactly one tab surface out of `story, sum, cv, emap, ana, know, games, cone` is visible. The only other allowed visible surface is a declared fold (`ana` inside `sum`) | Exactly 1, no orphans |
| 3 CSS coverage | Every class present in the DOM has a matching selector in the sheet | Zero unstyled classes |
| 4 Type floor | No leaf text element outside SVG has a computed font size under 11 px. The only exemption is class `bs` (the wordmark subtitle) | **11 px** |
| 5 No all caps | No text-transform uppercase, and no leaf string of 7 or more characters whose letters (more than 6) are all capitals. Only `.brand` is exempt | Zero |
| 6 Column fill | Every direct child of `.mid > .col` is within 1 px of its column's width. No single-class selector sets geometry (`width, padding, padding-left/right, max-width, display, flex-direction`) twice outside media queries | 1 px, zero duplicates |
| 7 Network | No request other than `file:`, `data:`, `blob:` or `about:` after exercising Field, Energy, Knowledge and Games. None to googleapis or gstatic. Inter reports `loaded` | **Zero** outbound requests |
| 8 Tap floor | On every TAB, after removing the `.tabin` entrance class, every visible `button, select, input:not([type=range]), textarea, [role=tab]` measures at least 44 by 44 (a wrapping `<label>` counts for checkboxes and radios) | **44 x 44 px** (`--tap:44px`) |
| 9 Lightings | Every lighting in `LIGHTINGS` (7: Dark, Snow, Punch, Glass, Glass white, Flat, Lumen) resolves `--panel --edge --ink --accent`. Ink differs from ground. Distinct `--bg` count equals the lighting count. At least 2 distinct inks. The accent is equal across Dark, Punch and Glass. Flat and Snow each differ from Dark | Counts read from `LIGHTINGS` |
| 10 Body paints | On layers Fetters, Saboteurs and Complexes: marks (`.pm-n` plus `.pm-it`) > 0. The layer button count agrees with the drawing. A screenshot of `.pm-well` with marks shown differs byte-for-byte from one with marks hidden. `#pmClip` children are only path, circle, ellipse, rect, polygon, polyline, line, text or use | Screenshot inequality |
| 11 Boot | At 250 ms the boot is up with **7** `.b-seat` circles, every computed fill equals a `PAL` colour, all 7 are distinct, and more than 0 `.b-addr line` elements exist. At 5,800 ms `#boot` is **removed from the DOM** (not merely faded) and `body.booted` is set | 7 seats. Removed by 5.8 s |
| 12 Motion named | Seven tokens resolve: `--ease-out --ease-in --ease-land --t-micro --t-element --t-surface --t-context`. More than 100 live transitioning elements. **None** on the browser default `ease`. Every transition duration is one of `0.12s, 0.22s, 0.32s, 0.42s` | 4 allowed durations |
| 13 Field frame rate | On Gordon at 1600x1000, for every lighting: no visible element carries a `backdrop-filter` on the Field. rAF rate is at least 30 over 1.4 s (a loose backstop, because pages share the process; the product's own floor is 60). Glass on the Field keeps a translucent `rgba(... .x)` background and a box shadow | **0** backdrops. **≥ 30 fps** backstop |
| 14 Boot exit | No `.boot-skip` instruction line. A click clears the boot within 4 s | 0 lines. Under 4 s |
| 15 Alarm law | No `.cr` chip whose title names a good-end reading (accuracy, coherence, flow, integrity, identification, share, replace, opposite, pass, open) is `.hot` or stroked `rgb(255,46,31)`. `cr('Root',96)` still produces `.hot` with an arc stroke of `rgb(255,46,31)`. The tier band on the Summary plate wears `TIERCOL[tier]` | `HOT_AT = 90`. Alarm `#FF2E1F` |
| 16 One tooltip | `#railtip` and `.railtip` are gone. The first 12 visible `[data-tip]` or `[data-tip-t]` carriers each open `#tip`, never more than one `.tip.on` or `.probe.on` at once, and none opens empty | 1 panel |
| 17 Label case | A string in the `text-transform:capitalize` label classes that reads as a sentence (more than 4 words, or a comma followed by a word) must carry `.plain`. The sweep runs at 1600x1000 and 390x844 and opens every drill opener. The simulated capitaliser is checked against a known answer before anything is believed | Zero violations. Every drill opened, none threw |
| Child treatment | Per lighting, on Gordon's Story tab: the child pill (`.ip.kid`) is further in luminance from its ground than a same-seat plain pill. It goes darker on paper grounds (luminance above 0.5) and lighter on dark ones. The located name text holds its contrast on all 7 seats | **4.5 : 1** |
| Figure legibility | On the Field with Gordon: the worst plain `.cr .v` figure and the worst hot one, composited through every translucent ancestor, hold the threshold. The balance-bar end figures at a full lean each way are covered by the fill and hold it too | **4.5 : 1** |

Contrast math used by the last two rows: WCAG relative luminance (sRGB piecewise, 0.03928, 12.92, 2.4 exponent, coefficients 0.2126, 0.7152, 0.0722), ratio `(L1+0.05)/(L2+0.05)`, alpha composited through every see-through ancestor up to the first opaque one. The gate notes that computed `color-mix()` values come back as `color(srgb r g b / a)` in 0 to 1, not 0 to 255. A probe that read them as bytes once reported every seat as identical.

What the gate says it does **not** score, in its own words: whole-surface contrast per lighting (gate 9). The two probes that tried it failed on `color-mix` grounds and oklab readback, and "a number this gate cannot stand behind is worse than no number."

---

## 6. How to verify the reproduction

### 6.1 What `tools/monitor.js` measures

It walks every surface in `TABDEF` plus `TABEXTRA`, which it reads at run time and never from a hand-written list:

- **Widths:** 1600x1000 at DPR 1, and 390x844 at DPR 2 with `isMobile` and `hasTouch`.
- **Profiles:** blank, then loaded (the persona named `Lance`).
- **Timing:** it waits 7,000 ms after load (past the boot), then 420 ms after each `setTab`.
- **Host lookup:** by id, from TABDEF's `id` field.
- **DOM or SVG host:** passes if `innerHTML.length >= 400` (`FLOOR`). The comment says the thinnest healthy surface is the compass at about 1,900 characters, and a failed host sits under 200. `innerText.length` is recorded beside it but decides nothing.
- **Canvas host:** `getImageData` over the whole backing store. It reads the alpha of every 97th pixel (`for(i=3;i<d.length;i+=4*97)`) and counts samples with alpha above 8. It passes at **60** lit samples or more (`FLOOR_CANVAS`). The canvas is transparent where nothing is drawn, so alpha is the right channel.
- **Rails:** every `[data-rail] [id]` that is actually displayed (display not none, visibility not hidden, non-zero box, `offsetParent` present) must have non-empty `innerHTML`. A hidden host is by design. A shown, empty host is a failure.
- **No-script:** a context with `javaScriptEnabled:false` at 1200x800 waits 6,200 ms, then requires `body.innerText` to match `/needs javascript/i`.
- **Page errors:** any `pageerror` fails the run.
- **Output:** one stamped block appended to `MONITOR.log` with commit, dirty flag, md5 and every row. It exits non-zero on any failure.

**Latest block, 25 September 2026 03:07, commit da6cca6 (dirty), md5 26ff48bd.** All surfaces render. Selected rows:

| Width | Profile | Surface | Measure | Host |
|---|---|---|---|---|
| desktop | blank | field | 206 lit samples | `cv 664x726` |
| desktop | loaded | field | 712 lit samples | `cv 664x726` |
| phone | blank | field | 373 lit samples | `cv 748x670` |
| phone | loaded | field | 819 lit samples | `cv 748x670` |
| both | both | body | 21,039 chars, **0 text** | `emap` |
| both | both | compass | 7,032 chars, 333 text | `cone` |
| desktop | loaded | summary | 45,994 chars, 4,588 text | `sum` |
| desktop | loaded | knowledge | 86,651 chars, 3,002 text | `know` |

(The source comment beside `FLOOR_CANVAS` quotes 254 and 1,038 for the Field. The log reads 206 and 712 today. Read the count off the run, not off a comment. That is the repo's own rule, and here is one more instance of it.)

### 6.2 What the port should build

One probe per rendering technology, each checked against a known-good case before its output is trusted:

1. **Immediate-mode surfaces (wheel, wash, compass):** read back the backing store and count lit samples with a stride. Floor it well above the blank-profile reading and well above zero. Separately, publish the per-frame display list of hit shapes and label boxes (the port's `HIT`, `LBL` and `__PLATES`), and assert: no two labels overlap (`plateHit`), no label box leaves the canvas, and the hit count is non-zero at every depth. Measured hit-target counts at 1600 wide: 136 at L0 on any profile, and 247 at L3 on Gordon. A draw that throws midway leaves those counts short. That has happened here: 136 at zoom 1 and zero at 2.3 and above, caught by the functional gate.
2. **Vector surfaces (Body, dial, chips):** count elements and markup, never text. Then do what design gate 10 does: screenshot the region, hide the marks, screenshot again, and require the bytes to differ. A mark can exist, be correctly placed and paint nothing (an invalid clip).
3. **DOM surfaces:** markup floor per host, a hollow-host check on every visible rail container, the 11 px type floor and the 44 by 44 tap floor.
4. **Splash and no-script:** prove that the splash is removed from the tree, not just faded, and that a failed or disabled script cannot leave a complete-looking empty shell on screen.
5. **Network:** zero outbound requests while exercising every surface, and the font resolved to Inter.
6. **Frame rate:** measure the Field on the heaviest profile at the deepest depth, highest zoom and DPR 2, alone in its process, on the weakest target machine. The product's floor is 60. The gate's 30 is a backstop only because its pages share one process.
7. Run all of it at **1600x1000, 390x844, and something in the 721 to 1180 band.**

Then look at the images. Reading CSS is not reviewing a screen.

---

## 7. If parity extends past the pixels: the single-file and host-free posture

**Single file.** `atuned_src/BUILD.sh` concatenates the modules in `MANIFEST` order into `source.html`. The order is load bearing: data, then engine, then renderers, then UI. The whole script is one `<script>` block, preceded by a separate guard script. The build fails on a parse error in any module, on unbalanced `<div>` tags, and on an em dash. It writes a build stamp onto `<html data-build>` and a byte-length end-of-file marker, so a truncated file can say so. It also injects `window.__at('<module>')` after each module, so the boot guard can name the module where the script stopped. `tools/slim.py` strips comments only (JS through the TypeScript compiler, never a regex): 1,593,427 bytes becomes 1,047,885. `tools/pack.js` then gzips at level 9, base64-encodes, and wraps the result in a few hundred bytes. That wrapper starts a 6 s watchdog **before** the payload (a cut file cuts the loader), checks the payload length against a stamped `LEN`, inflates with `DecompressionStream('gzip')`, and writes the page with `document.open/write/close` (`innerHTML` would not run the scripts). Output: 422,844 bytes, one file, zero requests. A desktop port does not need the packing. It does need the property the packing protects: a partial or corrupt install must fail loudly, never as a plausible empty shell.

**Host-free engine.** Everything under `engine/` is DOM-free and is also built alone as `engine.js` (552,453 bytes). `atuned_src/hostfree.py` strips comments and string literals, then refuses `document`, `window`, `navigator`, `localStorage`, `sessionStorage`, `requestAnimationFrame`, `alert`, `fetch`, `XMLHttpRequest`, `AudioContext`, `webkitAudioContext`, `speechSynthesis`, `SpeechRecognition`, `webkitSpeechRecognition` and `new Image`. The host injects storage through `bindStore(get,set)` (`engine/schema.js:193`), and the engine refuses to persist until that has been called. All input crosses `validateProfile`, which fills missing fields from the blank profile, refuses wrong types by name, and never clamps. The renderers (`ui/`) are the only code allowed a document. They read engine state (`compute()`, `W`, `S`) and draw it. The owner's rule "Port, do not rebuild. The arithmetic core keeps its bodies and signatures" applies to that engine. It is not an art concern, but it is what makes pixel parity possible at all: every length on the wheel is a number `compute()` produced ("every length on screen is a number the engine computed", `wheel.js:92`). A port that recomputes those numbers differently will draw a different picture from correct drawing code. Run the same engine, or prove equivalence declaration by declaration, as `tools/equiv.py` does here.

---

### Files read for this section

`/home/user/MOB/atuned_src/ui/wheel.js`, `/home/user/MOB/atuned_src/ui/component.js`, `/home/user/MOB/atuned_src/ui/ui.js`, `/home/user/MOB/atuned_src/ui/map.js`, `/home/user/MOB/atuned_src/ui/cone.js`, `/home/user/MOB/atuned_src/ui/personas.js`, `/home/user/MOB/atuned_src/engine/data/figure.js`, `/home/user/MOB/atuned_src/engine/schema.js`, `/home/user/MOB/atuned_src/shell/head.html`, `/home/user/MOB/atuned_src/shell/body.html`, `/home/user/MOB/atuned_src/shell/guard.html`, `/home/user/MOB/atuned_src/BUILD.sh`, `/home/user/MOB/atuned_src/hostfree.py`, `/home/user/MOB/tools/pack.js`, `/home/user/MOB/tools/slim.py`, `/home/user/MOB/tools/monitor.js`, `/home/user/MOB/tests/design.js`, `/home/user/MOB/tests/collide.js`, `/home/user/MOB/MONITOR.log`, `/home/user/MOB/CLAUDE.md`.
