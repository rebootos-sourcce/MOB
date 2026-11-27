# Technical direction review

Five passes, not merged. Every number below came from a command named beside it.
Where a probe of mine was wrong, that is recorded, because a tool that lies is
worse than no tool.

## What was measured, and on what

    build under test     source.html  1,049,141 bytes  md5 457c53e1c550dc60a319bae522214e4c
                         pinned to /tmp/.../scratchpad/perf/PINNED.html at 15:15
    compositor           SoftwareRenderer::DoDrawQuad in every trace. No GPU in
                         this container. Composite and raster numbers are
                         therefore pessimistic against a phone with a GPU, and
                         render pass COUNTS are structural and hardware free.
    harness              /opt/pw-browsers/chromium-1194/chrome-linux/chrome
    frame source         CDP Tracing, categories devtools.timeline and viz.
                         Display::DrawAndSwap is the frame. rAF intervals are
                         reported alongside and agree.

**The tree moved under me.** A sibling agent edited `atuned_src/` at 15:15 and
again at about 15:20. Everything below is the 15:15 build, pinned and md5'd.
The 15:20 build was not measured.

**Control experiment for the whole of pass 1.** A 30ms busy loop injected into
the rAF chain took the probe from 60.2 fps / p50 16.7ms to 32.2 fps / p50
33.3ms / 53 dropped frames. The probe sees jank. Command: `p1b.js`, section A.

---

# Pass 1. Rendering and the frame budget

## The aura is dead and the fix was the right one

The previous pass found an aura blur at 87 percent of frame budget. It is gone,
and not by deletion. Measured over 8 seconds on Field (`p7.js`):

    drawAura calls          480
    actual redraws            9        1.13 per second
    ms per redraw          0.06        worst 0.20ms
    amortised per frame   0.001ms
    #bgaura backing store  200 x 125 = 25,000 px
    CSS box               1792 x 1120           upscale 8.96x
    CSS filter             none                 opacity 0.34

Two things do the work. `wheel.js:18` builds a signature including a time
quantised to 1/12 of a step at 0.09 per second, so the aura redraws about once
a second instead of sixty times. And the buffer is 25,000 pixels stretched 8.96x
by the compositor, which is a free bilinear blur instead of a paid Gaussian one.
That is the correct answer to a soft full-viewport wash and it should be the
pattern for anything like it. Nothing of that class has returned.

The wheel geometry bug from `REVIEW-pass2` is also verifiably fixed: buffer
664 x 725, box 664 x 725, vertical scale 1.0000 (`p7.js`).

## The SVG blur the brief asked about: inside budget, with one condition

`#pmField`, `feGaussianBlur stdDeviation 2.4`, applied to one group with
`mix-blend-mode:screen` and a clip path (`map.js:351`, `:363`, `:516`).

    energy surface, 1600x1000       68 SVG nodes in #emap, 407 across the page
    filtered groups                 1, with 7 children
    steady state, 4s window         3 Display::DrawAndSwap in 4 seconds
                                    0ms Paint, 0ms raster, 0 layouts
    forced repaint of the host,
      filter ON                     58.8 fps, 2 dropped, max 50ms
      filter OFF                    60.0 fps, 0 dropped, max 16.8ms
    marginal cost, measured by
      adding one such group of 30
      marks to Field and repainting  composite 7.72 -> 9.26ms/frame
                                     raster 1415 -> 1965ms/3s (+39%)
                                     paint 177.6 -> 236.9ms/3s

Commands: `p1b.js` section C, `p1c.js`, `p1d.js`, `p6-budget.js`.

**Verdict: yes.** Energy composites three times in four seconds because nothing
on it is dirty, so the filter is rasterised once and cached. The one condition:
this must never land on a surface that repaints every frame. On Field it would
cost 1.54ms of composite and 39 percent more raster, every frame, forever.

## The `.tabin` keyframe is free. The work it animates over is not

The keyframe is `opacity` and `translateY` (`head.html:2403`), which are
compositor only and measured at zero: adding a transform-only animation per
frame to Field moved composite from 7.72 to 7.27ms, i.e. inside noise
(`p6-budget.js`).

What drops frames on a tab change is `setTab` itself. Measured across the
switch (`p1b.js` section B, `p1d.js`):

    -> summary     setTab script 18.7ms   58.4 fps   1 dropped   max  33.4ms
    -> field       setTab script 18.4ms   51.9 fps   4 dropped   max  50.0ms
    -> energy      setTab script  9.7ms   58.3 fps   1 dropped   max  33.4ms
    -> knowledge   setTab script 11.3ms   56.8 fps   2 dropped   max  33.4ms
    -> compass     setTab script 32.0ms   37.3 fps   7 dropped   max  83.3ms

On entering a tab, by trace:

    -> field     Commit  98.4ms/42   FunctionCall 81.0ms   Paint 54.5ms   Layout 40.2ms   longest task 27.7ms
    -> compass   Commit 105.7ms/42   FunctionCall 52.5ms   Paint 11.1ms   Layout 17.9ms   longest task 23.6ms
    -> summary   Commit   1.8ms/43   FunctionCall  6.5ms   Paint  4.4ms   Layout  4.0ms   longest task 11.6ms

The one deliberate forced reflow at `panels.js:120` (`void h.offsetWidth`) is
not the problem and the comment defending it is correct. The problem is that
`setTab` does a full `render()`, a `layout()`, a `paintSections()` and a
surface renderer in one unyielding task, then starts a 320ms keyframe over the
top of it.

## Glass and Glasswhite break the 60fps floor by three times. This is the aura of this pass

Field surface, 3 second windows, two viewports, reproduced across three runs
(`p1d.js`, `p1e.js`):

    theme        live backdrop-filter els   passes/frame   composite/frame   effective fps
    dark                              0            1.00            4.15ms            60.0
    snow                              0            1.00            7.85ms            60.0
    flat                              0            1.00            9.83ms            56.3
    punch                             0            2.01            5.57ms            59.7
    glasswhite                       71            7.14           69.13ms            14.0
    glass                            71           41.31           51.65ms            18.3

At 390 x 844 dpr 3 the glass numbers are identical: 41.75 passes per frame,
54.29ms per composite, 17.7 fps. Identical across a 10x pixel difference,
because the cost is per element, not per pixel. Forty-one render passes is
forty-one intermediate textures per frame.

Marginal cost, measured by adding exactly one to the dark theme
(`p6-budget.js`, with a closing baseline at 7.47ms proving nothing stuck):

    baseline field, dark                              59.7 fps    7.72ms composite   1.00 passes
    + 1 full-viewport backdrop-filter blur(26px)      19.0 fps   50.97ms             2.02 passes
    + 10 small backdrop-filter elements (200x40)      60.0 fps   10.76ms            10.30 passes

Every one of the 71 is a `.top` bar, a `.vt.tabtop` button, a `.panel`, a
`.sheet-card`. The tab buttons are 99 x 44 pixels each and each one takes its
own render pass. My own working number for this property is: budget one. This
ships seventy-one, on a shipped theme a person can select from Settings.

The software compositor overstates the per-pass cost. It does not invent the
count. On a mid-tier phone with a GPU this will not be 18 fps, but 41 render
passes and 71 backdrop readbacks per frame is the most expensive thing in this
product by an order of magnitude and it is there for a texture.

## What Field actually spends

Steady state, 1600 x 1000, dark, 3 to 4 second windows (`p1-fps.js`, `p1c.js`,
`p1d.js`, `p6-budget.js`):

    main thread, per frame     draw()        1.154ms  (max 7.0ms)
                               renderPol2()  0.290ms  (max 4.8ms)
                               compute()     0.255ms  (max 4.3ms)
                               drawAura()    0.011ms
                               FireAnimationFrame total 1.458ms
    layout + style per frame                 0.318ms  (see pass 2, it is renderPol2)
    paint                      340 paints per 168 frames = 2 per frame, 101ms/s
    composite                  4.15 to 10.72ms per frame across runs, 1.00 passes
    raster                     1,335 to 2,087ms per 3s across raster threads

Main thread work on the hero surface is 1.8ms of a 16.7ms frame. That is good
and it is not where the risk is. The risk is composite, and composite is
dominated by things declared in CSS rather than drawn in the loop.

---

# Pass 2. Memory, leaks, and what grows over a long session

Metrics from CDP `Performance.getMetrics`, so Nodes, JSEventListeners and
JSHeapUsedSize come from the browser rather than from a page script that could
be wrong (`p2-mem.js`, `p2b.js`).

## No leak. Said plainly, because it was worth checking

    baseline after boot        heap  3.88MB   nodes 3272   listeners  996   DOM 1942   SVG 445
    40 full tab cycles (360 setTab calls)
      after cycle 10           heap  4.91MB   nodes 7063   listeners 1290
      after cycle 20           heap  5.12MB   nodes 6591   listeners 1316
      after cycle 30           heap  4.61MB   nodes 4683   listeners 1148
      after cycle 40           heap  5.03MB   nodes 4641   listeners 1148
    300 drill opens + 300 renders
      drift                    heap +0.45MB   nodes +265   listeners +2   DOM +17
    40 profile round trips
      drift                    heap +0.08MB   listeners +26

Nodes and listeners rise then fall and settle. There is no monotonic listener
growth, which matters because `render()` binds a click handler per row on every
call (`ui.js:778`, `ui.js:797`). It is safe only because `innerHTML` replaces
the nodes first, and the comment at `ui.js:783` says exactly that and is true.
Three hundred drill opens add two listeners. That is a bound, not a leak.

## The loop allocates on a surface that draws nothing

Heap slope over 18 seconds of idle, no forced GC (`p2b.js` section B):

    summary    3.75 4.95 5.94 6.93 7.37 8.58 9.63 MB   monotonic
               327 KB/s  =  5,709 bytes allocated per frame

**My method has a limit and I will state it.** On Field, Energy and Compass the
GC fired inside the window (field samples ran 5.37, 4.95, 9.78, 5.97) so the
slope came back negative and is meaningless. Summary is the one window where GC
did not fire, so it is the one number I will stand behind. On a surface that
draws nothing, is not animated and produced zero frames in four seconds, the
loop still allocates 5.7 KB per frame.

The cause is `ui.js:806-813`: `compute()` runs unconditionally every frame on
every tab and returns a fresh object carrying four fresh arrays. Seven of the
nine surfaces never look at the result. Measured cost: 0.136ms per call, 240
calls per 4 seconds on Summary, Story, Intake, Knowledge, Games and Settings.
On Compass it is called twice per frame (480 calls in 240 frames) because
`coneTick` calls it again.

My working number here is zero objects created per frame in a hot loop. This is
5.7 KB.

## The one real per-frame defect: a forced layout on the hero surface, at 60 Hz

Idle, nothing touched, 8 second windows (`p2b.js` section A):

    summary    idle 8s     layouts    0 ( 0.0/s)   recalcs    0 ( 0.0/s)
    energy     idle 8s     layouts    0 ( 0.0/s)   recalcs    0 ( 0.0/s)
    compass    idle 8s     layouts    0 ( 0.0/s)   recalcs    0 ( 0.0/s)
    knowledge  idle 8s     layouts    0 ( 0.0/s)   recalcs    0 ( 0.0/s)
    field      idle 8s     layouts  478 (59.8/s)   recalcs  478 (59.8/s)
                           layoutDuration 0.180s   styleDuration 0.074s

Two controls, both run:

    field, renderPol2 stubbed to a no-op      layouts   0 (0.0/s)   recalcs   0 (0.0/s)
    field, renderPol2 restored                layouts 478 (59.8/s)  recalcs 478 (59.8/s)
    field, renderPol2 replaced by a bare
      el.innerHTML = el.innerHTML             layouts 481 (60.1/s)  recalcs 481 (60.1/s)

It is not the content. It is the write. `personas.js:144` does
`el.innerHTML = s + '</svg>'` and `ui.js:811` calls it from the rAF loop, so
every frame the browser reparses 2,048 characters into 25 SVG nodes inside a
128 x 725 box, then recalculates style and lays out the document. 0.318ms of
layout and style per frame, 22.5ms of layout per second, on the only surface in
the product that runs a real draw loop.

Every other surface is at zero. Field is the outlier and the cause is one line.

## The rest of the session, and the boot

    idle 20s on Field         heap +6.47MB   nodes +62   listeners +0
                              layouts +1225  recalcs +1227
    200 story applies         1,845ms total, 9.2ms each

The 6.47MB over 20 seconds is the allocation above, not retention: the heap
plateaus at 10.8 to 11.2MB and stays there through 300 drill opens and 40
profile round trips. Total session drift from boot across everything I ran:
heap +7.24MB, nodes +2,706, listeners +154, with 41 profiles in the store.

**A probe of mine was wrong.** My first story-growth loop called `stApply()`,
which does not exist. It reported 200 stories applied, zero growth and zero
cost, which was the probe doing nothing 200 times. The real path is the
`#stapply` handler at `storyui.js:69`. Rerun through the real functions: 9.2ms
per commit.

---

# Pass 3. The build, the file, and what a cold load costs

## The file

    source.html                    1,048,971 chars   1,049,141 bytes
    gzip -9                          379,081 bytes   36.1 percent
    engine.js                        351,009 bytes
    BUILD.sh                               1.3s      reproducible, git clean
    BUILD-engine.sh                        0.9s      "engine is host free", 289 exports

`BUILD.sh:30` prints `len(s)`, a character count, and labels it bytes. It is off
by 170 on this build. Trivial, but the build's one reported number is wrong.

## Cold load, fresh context every run, no warm cache

`p3-load.js`, CPU throttled through `Emulation.setCPUThrottlingRate`. A mid-tier
phone is 4x to 6x a desktop core, so 6x is the floor case.

    target                   goto->load   domInteractive   FCP    booted   first setTab
    desktop 1600x1000 x1          300ms            271ms  168ms   5337ms        15.2ms
    phone 390x844   dpr3 x1       295ms            252ms  160ms   5368ms        17.6ms
    phone 390x844   dpr3 x4       847ms            775ms  200ms   5478ms        45.1ms
    phone 390x844   dpr3 x6      1208ms           1104ms  364ms   5669ms        34.9ms
    phone x6, reduced motion      955ms            850ms  324ms   1049ms        37.2ms

Work breakdown at 6x:

    ParseHTML        675.6ms
    EvaluateScript   592.0ms      worst single script tag 534.1ms
    FunctionCall     612.3ms
    Layout           463.5ms
    Style            364.0ms
    Paint            263.4ms
    longest 5 main-thread tasks:  550, 189, 156, 100, 95 ms

**The honest cold load on a mid-tier phone is 1.2 seconds to interactive with a
550ms unyielding task in it.** That is a good number for a megabyte of inline
everything and it is not where the problem is.

**The problem is the boot sheet.** The app is interactive at 1104ms and the
person is looking at a boot animation until 5669ms. That gap is 4.5 seconds and
it is fixed in wall clock, not in work: at 1x it is 5337ms, at 6x it is 5669ms,
a 332ms difference across a six times slower machine. With
`prefers-reduced-motion` it is 1049ms. So 4.6 seconds of a stranger's first
screen is a timer, and the reduced-motion path already proves the instrument is
ready long before it.

## The honest cost of the embedded font

Measured by building a variant with only the `src:url(data:...)` replaced
(`NOFONT.html`), five cold loads each at 6x, median reported (`p3b.js`):

    font, base64 in the file        64,348 bytes   62.8 KB    6.1 percent of the raw file
    decoded woff2                                  47.1 KB
    gzip cost of carrying it        49,264 bytes   48.1 KB   13.0 percent of what a server sends
    @font-face count                     1         Inter variable, 300-700, latin
    FontFaceSet size                     1         it resolves, no silent fallback

    PINNED  x6   domInteractive 963ms   FCP 344ms   ParseHTML 506.5ms   EvaluateScript 435.4ms
    NOFONT  x6   domInteractive 872ms   FCP 288ms   ParseHTML 610.3ms   EvaluateScript 537.0ms

The load-time difference is inside run noise: the variant without the font
parsed 104ms *slower*. The only number that moved in the expected direction is
FCP, by 56ms. **So the font's honest cost is not time, it is bytes: 48.1 KB
gzipped, which is 13 percent of everything a server would send.**

That 13 percent is the price of the one-file rule, not of the typeface. gzip
cannot recompress an already-compressed woff2, so base64's 33 percent expansion
is permanent on the wire. Serving the woff2 as its own file would save 15.7 KB
of transfer and cost one request. The rule says no. Fine, but the number is
48.1 KB and it should be quoted that way, not as 6 percent.

## The honest cost of the two rasters

**They cost two network requests on every load, and they do not exist.**

    data: URIs in source.html                 1   (the font, nothing else)
    requests on load, every viewport,
      every throttle                          3   PINNED.html, fig-fetter.png, fig-pain.png
    requests after visiting all nine tabs      5   the two rasters fire twice

`figure.js:10` names them, neither is in the tree, and the vector fallback works
(the functional gate checks it and it passes). So the bytes are zero, the
rendering is correct, and the cost is two failed round trips per load, which
over `file://` are silent and over HTTPS would be two 404s to the origin.

This is a claim not true of the code and it is in `CLAUDE.md`: "the product
makes no outbound request at all, which gate 7 now watches." It makes two.
Gate 7 (`tests/design.js:205`) filters `^(file|data|blob|about):` before
collecting, so under a `file://` harness the two rasters are invisible to it and
it prints "outbound requests: none". Its own comment at `:212` is honest about
the two rasters existing. The gate is not lying. `CLAUDE.md` is, and the gate is
structurally unable to catch it.

## The honest cost of the 112 node tables

Measured live in the page with `JSON.stringify` and an identity check
(`p3b.js`, `ident.js`):

    NODES                  112 entries   25,718 bytes serialised
    W                      108 entries   25,125 bytes
    BY                     112 entries   26,282 bytes
    NERVEBR                 72 entries   21,561 bytes
    PRACTICE                17           6,028
    PEOPLE                  14           5,290
    CARDSET / DOMAINS / PAINREG / LEX / AGES / HCX_LIB / SAB_LIB / PMBANDS   11,641 combined
    TOTAL serialised                    122,645 bytes = 119.8 KB

    distinct objects across NODES, W and BY:  112
    W[0] === the NODES entry with the same i: true
    BY[1] === NODES[0]:                       true

**So NODES, W and BY are three indexes over one set of 112 objects, not three
copies.** 77 KB of that 120 KB total is the same 26 KB counted three times.
The real live cost of the 112 addresses is about 26 KB of objects plus two
arrays of pointers.

    re-parsing NODES from JSON                          0.07ms
    core.js slot and angle derivation over all 108      0.01ms  (core.js:8)

The tables are not a cost. 12.0 KB of source for NODES, 1.17 percent of the
file, 0.08ms of work at boot, one copy in memory. Leave them alone.

---

# Pass 4. Correctness risk

## The four gates, and one of them is red in the tree

    node tests/engine.js          763 passed, 0 failed     0.47s
    node tests/collide.js          96 passed, 0 failed    13.0s
    node tests/design.js           72 passed, 0 failed    55.1s
    node tests/functional.js      589 passed, 3 FAILED    74.0s

The same gate returned 592 passed, 0 failed on the 14:58 build twenty minutes
earlier. I re-ran it against the pinned 15:15 build in an isolated directory to
rule out the harness: 589 passed, 3 failed, same three. The change is in the
code, not in the probe.

All three failures are one cluster, `tests/functional.js:1446-1451`:

    FAIL  and it quotes the sentence that did it
    FAIL  and says what it weighed
    FAIL  clicking holds it

Hovering an atomised address on the Field wheel no longer shows the probe
tooltip quoting the sentence, and clicking no longer holds the atom. That is a
user-facing regression on the hero surface, in the tree, with the build product
regenerated over it. `CLAUDE.md` says "Before you commit. Every time." and
lists the four commands. This is what skipping them looks like.

## The boundary is the strongest thing in the system

`validateProfile` (`schema.js:187`) against 30 malformed profiles, probed
against its real contract (`p4b.js`). Controls first: a clean profile returns
`ok`, a profile with `v:99` returns `REFUSED: schema version 99 is not 1 to 2`.

    held 9999              REFUSED: axes.Fear.held is 9999, outside 0 to 10
    held -50               REFUSED: axes.Fear.held is -50, outside 0 to 10
    held "7"               REFUSED: axes.Fear.held is not a number
    held NaN               REFUSED: axes.Fear.held is not a number
    held Infinity          REFUSED: axes.Fear.held is not a number
    opp 11                 REFUSED: axes.Fear.opp is 11, outside 0 to 10
    law 9999               REFUSED: laws.Truth is 9999, outside 0 to 10
    doms [999]             REFUSED: soul.doms is 999, outside 0 to 18
    arcs [99]              REFUSED: soul.arcs is 99, outside 0 to 11
    arcs [-4]              REFUSED: soul.arcs is -4, outside 0 to 11
    arcs ["two"]           REFUSED: soul.arcs is not a number
    intake answer key 99   REFUSED: intake answer key 99 is not 0 to 62
    intake answer 11       REFUSED: intake.answers.0 is 11, outside 0 to 10
    history[0].cq = "x"    REFUSED: history[0].cq is not a number
    no version             REFUSED: schema version undefined is not 1 to 2
    not an object          REFUSED: not an object
    null                   REFUSED: not an object
    held null              ok      (unmeasured, correct)
    law null               ok      (unmeasured, correct)
    __proto__ pollution    ok      and Object.prototype was NOT polluted
    nested 2000 deep       ok      and not copied

Every out-of-range leaf is refused by name, nothing is silently clamped, and the
whitelist design means an attacker's extra keys never reach the profile. The
9999 charge that `REVIEW-pass2` and `STABILITY.md` both put at the top of the
list is closed. This is the part of the system I would put weight on.

**My first boundary probe was wrong and reported the opposite.** It read
`v.errors` where the contract is `v.errs`, and set `o.axes[0].held` where axes
are keyed by axis name, so it mutated nothing and printed "ACCEPTED" for every
case. I have kept it in the record because a review that fabricates a green or a
red is the failure mode this project has already been burned by twice.

## The three gaps left in it

    axes = 'nope'          ok     -> silently replaced with nine zeroed axes
    soul = null            ok     -> silently replaced with the blank soul
    history = {}           ok     -> silently replaced with []
    name = 4MB string      ok     -> accepted whole, no length cap

The comment at `schema.js:174` says "A field of the wrong type or out of range is
refused by name." A string where `axes` should be an object is a field of the
wrong type and is not refused: a person importing a profile whose axes field got
corrupted gets a silent reset to zero charge and the word ok. That is the exact
class of bug the comment was written to kill, one level up the tree. And the
4MB name matters at the accounts fork, where the first caller of this boundary
is a record fetched off a server.

## Two write paths claim success they do not have

`pPersist` is honest now (`schema.js:156`): it sets `SAVE_OK` and `SAVE_ERR` and
returns false. `statusSaved()` (`component.js:161`) reports it correctly. The
problem is who does not call it.

Store rebound to throw `QuotaExceededError`, which is what a full quota does
(`p4b.js` section 4.2):

    pPersist() returns              false   saveState={"ok":false,"err":"QuotaExceededError"}
    statusSaved() -> #status        "Not saved. Storage is full or blocked, ..."
    persistNow()  -> #status        "Not saved. QuotaExceededError."
    story commit  -> #status        (empty)
    ritual save   -> #status        (empty)

`storyui.js:73` does `pSave();pSnap();` and reports nothing. That is the single
most consequential write in the product: it bakes charge into nine axes
irreversibly and pushes a history snapshot, and on a failed write it says
nothing and the person believes it is saved. `release.js:96` is the same shape.
`panels.js:755` is the same shape.

`ritual.js:73` is worse: `b.textContent='Saved'` sits outside the `if(CURP)`
block and runs unconditionally. The button says Saved whether or not anything
was saved. `CLAUDE.md` rules: "a control must never claim success before it has
it." This is one line.

## A corrupt store at boot is survived, and nobody is told

Five corruptions injected before load (`p4-corr.js` section 4.3). All five boot
to 8 tabs, CQ 36.0, zero page errors:

    truncated JSON, not an array, array of nulls, charge 9999, empty string
      -> all: {"tabs":8,"cq":36,"status":""}   errors none

Robust, and silent. `pStore()` (`schema.js:151`) catches and returns `[]`, so a
person whose saved profile became unreadable gets a fresh demo and no notice
that their record was discarded. Same class as above, on the read side.

## Gates asserting a number instead of a rule

I went looking and mostly did not find it. 295 exact-equality assertions across
the four gates, and the overwhelming majority are `length === 0` (a rule) or a
structural count that is identity (`NODES.length===112`, `8 tabs`, `19 domains`,
`21 laws`). The tolerance assertions are written as invariants:
`Math.abs(e.fill+e.leak-10)<1e-9`, `CQ>=0&&CQ<=100`, `drop>=0&&rise<=0`.

**A suspicion of mine that did not survive checking.** `tests/engine.js:287`
asserts `h.age>40&&h.age<41`, which looked like a time bomb. It is not:
`:286` pins the clock with `meterRead(p,'2026-09-18T00:00:00Z')`. Recorded
because I nearly filed it.

Three that are genuinely soft:

    design.js:528   ok(m.tot>100, 'there are live animated elements to check')
                    reports 384. Passes at 384 and at 3,840 alike. It guards
                    that the NEXT two assertions are not vacuous, which is the
                    right instinct, but the number is a floor with no ceiling.
    design.js:18+   six pages, five at 1600x1000 and one at 1200x800. No phone
                    viewport. Gate 9 walks all six lightings and asserts only
                    that their grounds differ, so every glass and glasswhite
                    finding in pass 1 is invisible to all four gates.
    design.js:205   the network filter, covered above. Unfalsifiable under the
                    harness it runs in.

## Fragility worth naming

    engine/core.js:7-8     W is built by reference from NODES and then MUTATED
                           (n.slot, n.ang written onto the shared object). The
                           112 objects are shared by NODES, W and BY, verified.
                           Anything that ever clones W breaks the identity three
                           other files rely on.
    engine/undo.js:26      UNDO_MAX = 0, no ceiling. The arithmetic in the
                           comment defending it is correct: see pass 5.
    ui/ui.js:811           renderPol2 in the rAF loop. Pass 2.
    ui/ui.js:808           compute() every frame on every surface. Pass 2.
    engine/core.js         coreAt is still defined and referenced once, i.e.
                           only its own declaration. Still dead. crNode now has
                           4 references and is wired.

---

# Pass 5. What breaks at scale

All from `p2b.js` section C and `p5.js`.

## A year of history is nothing. Ten years is a stall

One profile, history / stories / rituals / undo scaled together:

    scale                       stringify   pPersist   pExport   validate   setTab(SUM)   anaRender   store
    0    /    0 /    0 /    0      0.3ms       0.3ms     0.1ms      1.1ms        22.6ms       4.7ms    1.4 KB
    52   /   50 /   50 /   20      0.2ms       0.3ms     0.1ms      0.7ms        16.4ms       5.1ms   25.6 KB
    365  /  400 /  400 /  200      1.0ms       1.3ms     0.6ms      1.1ms        16.5ms       8.3ms  186.4 KB
    1095 / 1000 / 1000 / 1000      1.7ms       3.4ms     2.1ms      2.7ms        28.7ms      12.7ms  495.0 KB
    3650 / 5000 / 3000 / 5000      9.1ms      16.7ms    16.9ms     14.6ms        61.0ms      35.4ms  1981.9 KB

`compute()`, `loadProfile()` and `meterRead()` stay flat at every scale.
`meterRead` returns 818 bytes whether there are 0 or 3,650 snapshots, which is
correct and deliberate.

**A year is comfortable. A thousand stories is one dropped frame. Ten years is
four.** `setTab(SUMMARY)` at 61ms and `anaRender()` at 35.4ms are the two things
that grow, and `pPersist` at 16.7ms means every single save of a ten-year
profile costs a whole frame.

## Nothing renders a thousand rows

With 1,095 snapshots, 1,000 stories and 1,000 rituals loaded (`p5.js` 5.4):

    surface      setTab     DOM nodes
    story          6.9ms        1,582
    energy         8.1ms        1,784
    settings       8.9ms        2,884
    knowledge     10.3ms        2,805
    summary       18.3ms        6,419
    field         23.6ms        1,582
    compass       36.4ms        2,885

    Field afterwards: 60.3 fps, p50 16.7ms, max 16.8ms
    page errors across the whole scale run: none

DOM node counts are the same order as the empty profile, so every list is
capped somewhere. Summary at 6,419 is the only surface past my 3,000-node
comfort line, and it is past it at zero history too. **A caveat: my row-count
selector matched zero elements at every scale, so I guessed the class names
wrong and cannot name which cap is doing the work.** The DOM totals are the
evidence, not the row count.

## The undo stack: the comment's arithmetic is correct

    one undo entry                       636 bytes
    10,000 entries                 6,368,891 bytes = 6.07 MB
    time to push 10,000                    37ms
    undoDepth() at 10,000                   0ms
    UNDO_MAX                                0   (no ceiling)
    written to the store                 false

`undo.js:18` says "one entry is ... under a kilobyte" and "ten thousand of them
is under ten megabytes". Measured: 636 bytes and 6.07 MB. The ruling holds, and
the stack is heap only, so it does not eat the persistence quota. This is the
best-defended unbounded structure in the codebase.

## The real ceiling, and where the walls meet

    measured localStorage ceiling for this origin      4.75 MB  (19 x 256 KB chunks)
    one profile with one year of everything            0.134 MB

    profiles x (365 history + 400 stories + 400 rituals)
      1    0.13 MB    pPersist  0.8ms   (stringify 0.3 + write 0.5)
      3    0.40 MB    pPersist  2.5ms   (stringify 1.1 + write 1.4)
      5    0.67 MB    pPersist  4.3ms   (stringify 3.4 + write 0.9)
     10    1.34 MB    pPersist 11.8ms   (stringify 4.3 + write 7.6)
     20    2.67 MB    pPersist 19.9ms   (stringify 9.7 + write 10.3)

`REVIEW-pass2` predicted 0.59 MB at five profiles and 2.37 MB at twenty. Measured
0.67 and 2.67. The claim was right, and it called the shape right: every save
re-serialises every profile, so the cost is O(all data) on a write that touches
one field.

**But the severity was overstated, and I will say so.** At five profiles that is
a 4.3ms stall. At twenty, 19.9ms, one dropped frame. It is not the emergency the
ranking implied. The real wall is capacity, not time:

    4.75 MB / 0.134 MB  =  about 35 profile-years before the store refuses

Twenty profiles reach it in under two years each. One profile reaches it at
roughly 7,000 story entries. And when it is reached, the story commit path says
nothing (pass 4), so the failure mode is: a person keeps recording, every commit
appears to work, and none of it survives a reload.

That is the scale finding that matters. Not the millisecond. The combination of
an unbounded push, a store with a measured 4.75 MB ceiling, and a commit path
that does not read the failure it is handed.

---

# Measured performance table

1600 x 1000, dark theme, steady state, 3 to 4 second windows. Composite times
are from a software compositor and are pessimistic; render pass counts and
layout counts are not. fps is `Display::DrawAndSwap` per second, cross-checked
against rAF intervals.

| surface | fps | longest frame | composite/frame | passes | layouts/s | what dominates |
|---|---|---|---|---|---|---|
| Summary | 60.0 (0 frames produced) | 11.4ms | n/a | n/a | 0 | nothing. `DidNotProduceFrame` x240. compute() 0.136ms/frame is all it spends |
| Story | 60.0 (0 frames produced) | 1.6ms | n/a | n/a | 0 | nothing |
| Field | 59.5 - 60.0 | 33.4ms steady, 50ms on entry | 4.15 - 10.72ms | 1.00 | **59.8** | composite, then `renderPol2`'s forced layout, then `draw()` 1.154ms |
| Energy | 60.0 (3 - 4 frames in 4s) | 16.8ms | 11.40ms when it draws | 1.00 | 0 | nothing at rest. `#pmField` + `.pm-aura` rasterise once and cache |
| Intake | 59.8 | 33.4ms | n/a | n/a | 0 | nothing |
| Knowledge | 60.0 | 16.8ms | n/a | n/a | 0 | nothing |
| Games | 59.8 | 33.3ms | n/a | n/a | 0 | nothing |
| Compass | 60.0 - 60.3 | 16.8ms steady, **83.3ms on entry** | 4.53 - 9.65ms | **3.00** (4.00 at dpr3) | 0 | `coneTick` 0.699ms + 3 render passes from the transform on `#cone` |
| Settings | 60.0 | 16.8ms | n/a | n/a | 0 | nothing |
| **Field / glass** | **18.3** | 116.8ms | **51.65ms** | **41.31** | 0 | 71 live `backdrop-filter` elements |
| **Field / glasswhite** | **14.0** | 96.2ms | **69.13ms** | **7.14** | 0 | the same, fewer passes, more area |
| Field / punch | 59.7 | 17.2ms | 5.57 - 10.29ms | **2.01** | 59.8 | `filter:saturate(1.2)` on `#cv` buys a second pass |
| Field, 1000 stories loaded | 60.3 | 16.8ms | - | - | 59.8 | unchanged. data volume does not reach the loop |
| Field, 390x844 dpr3 | 59.0 | 16.8ms | 6.21ms | 2.00 | - | unchanged |
| Field / glass, 390x844 dpr3 | **17.7** | - | **54.29ms** | **41.75** | - | identical to desktop. the cost is per element |

---

# Findings

| id | finding | file:line | sev | fix | size |
|---|---|---|---|---|---|
| T1 | Glass 18.3 fps, Glasswhite 14.0 fps on Field. 71 live `backdrop-filter` elements, 41.3 render passes/frame, 51.65ms composite. Identical at 390x844 dpr3, so it is per element not per pixel. Two shipped themes below a third of the floor | head.html:303, :320, :324, :332, :608, :2131 | critical | one `backdrop-filter`, on the raised layer only. Everything else takes the translucent background it already has and drops the filter. Measured target: 10 small filtered elements cost +3.04ms, one full-viewport costs +43.25ms | M |
| T2 | 59.8 forced layouts and 59.8 style recalcs per second on Field while idle, 0.318ms/frame, from one `innerHTML` write in the rAF loop. Every other surface is at 0. Control run three ways | personas.js:144, called from ui.js:811 | high | build the SVG once; per frame write only the drifting band's `y`/`transform`. Or signature-cache it the way `drawAura` already does at wheel.js:18 | S |
| T3 | The functional gate is red in the tree: 589/592, three failures, all the Field atom probe. Hover no longer quotes the sentence, click no longer holds the atom. Was 592/0 twenty minutes earlier; re-run against the pinned build in isolation to rule out the harness | tests/functional.js:1446-1451 | critical | bisect the 14:58-to-15:15 change and run the four gates before the next commit | S |
| T4 | Two outbound requests on every load for two files that do not exist, five after visiting all nine tabs. `CLAUDE.md` claims none. Gate 7 filters `file:` before collecting, so it cannot see them | figure.js:10; CLAUDE.md; tests/design.js:205 | high | either ship the rasters or remove the reference. Then make gate 7 count `requestfailed` too, so the assertion is falsifiable | S |
| T5 | The story commit and the release both call `pSave();pSnap();` and report nothing on failure. The ritual button sets `textContent='Saved'` unconditionally, outside its own `if(CURP)`. Reproduced with the store stubbed to throw: `pPersist()` returns false, `saveState()` names the error, `#status` stays empty | storyui.js:73, release.js:96, ritual.js:73, panels.js:755 | high | route all four through `statusSaved()`, which already exists at component.js:161 and already says the right thing | S |
| T6 | The boot sheet holds a stranger out for 4.6 seconds after the app is interactive. `booted` at 5337ms (1x) / 5669ms (6x) against `domInteractive` 271ms / 1104ms. With reduced motion, 1049ms | head.html:2323-2394 | high | cut it to about 1.2s, or hold it only until the first surface has painted. The reduced-motion path already proves the instrument is ready | S |
| T7 | `compute()` runs 60x/s on all nine surfaces; seven never read it. 5,709 bytes allocated per frame on Summary, a surface that produces zero frames. rAF still runs at 61/s under `prefers-reduced-motion` with `S.t` pinned at 0 | ui.js:806-813; coneTick calls it a second time | medium | return early when the surface has no live draw and nothing is dirty. Under reduced motion with no dirty flag, stop scheduling | S |
| T8 | `setTab` costs 18.4 to 32.0ms of script plus a 98-106ms Commit, so every tab change drops 1 to 7 frames before the 320ms keyframe even starts | panels.js:66-200 | medium | split the surface renderer out of the switch and let it run on the frame after the class change, so the keyframe animates an already-composited layer | M |
| T9 | `validateProfile` refuses a wrong-typed leaf by name but silently replaces a wrong-typed container with the blank: `axes:'nope'`, `soul:null`, `history:{}` all return ok. A corrupted axes field imports as nine zeroed axes and the word ok. No length cap on `name`: 4MB accepted | schema.js:197, :209, :191 | medium | type-check each container and push a named error, same as the leaves. Cap `name` at a sane length | S |
| T10 | `pStore()` swallows an unreadable store and returns `[]`. Five corruptions boot clean with zero errors and no notice; the person silently gets a fresh demo | schema.js:151 | medium | report through `status()` that a saved record could not be read, and keep the raw string so it is recoverable | S |
| T11 | `body.punch canvas#cv{filter:saturate(1.2)}` buys a second render pass on the hero surface for a nudge: 1.00 -> 2.01 passes, composite 5.57 -> 10.29ms | head.html:958 | low | bake the saturation into `cqRamp` and `seatCol` for the punch palette. `PLAN-quality.md` already calls this a nudge rather than a palette | S |
| T12 | `.pm-aura filter:blur(40px)` over 1,414,037 px. Free at rest (3 swaps in 3s, 0ms paint) but +65% raster and 85 vs 149 swaps under forced repaint | head.html:1761, map.js:189 | low | leave it, and never put anything animated in `.pm-well`. Note it on the surface so the next person does not | S |
| T13 | localStorage ceiling measured at 4.75 MB; one profile-year is 0.134 MB; so about 35 profile-years. Every save re-serialises all profiles: 4.3ms at five, 19.9ms at twenty. When the ceiling is hit, T5 means nothing says so | schema.js:156, :164; undo.js:26 | medium | cap `history` by age not count, keep story text out of the profile or truncate it, and land T5 first so the wall is announced | M |
| T14 | `BUILD.sh` prints `len(s)`, a character count, and labels it bytes. Off by 170 on this build | BUILD.sh:30 | trivial | `len(s.encode())` | S |
| T15 | `STABILITY.md` and `tests/README.md` are three generations stale and are what a reviewer is told to read first: 331.6 KB against 1,024 KB; gates 221/241/40/16 against 763/592/96/72; README says "279 checks in 22 groups" then "The 17 groups" in the same paragraph; gate 7 and validateProfile are both described as not existing | STABILITY.md; tests/README.md | low | regenerate the counts from a run, and delete what is closed | S |
| T16 | The design gate opens six pages, five at 1600x1000 and one at 1200x800, and no phone viewport at all. Gate 9 does iterate the six lightings but checks only their ground colours, never their frame cost, so every phone layout and the whole of T1 is outside all four gates' reach | tests/design.js:18, :204, :241, :306, :375, :446, :292 | medium | add 390x844 dpr3, and in gate 9 count `Display::DrawAndSwap` per lighting on one surface. That one assertion would have caught T1 | M |
| T17 | `coreAt` is still defined and never called, one year and two reviews after it was first named | engine/core.js | trivial | wire it or cut it. `crNode` is now wired, 4 references | S |

---

# Budget

What each thing costs, measured by adding exactly one of it to the Field surface
at 1600 x 1000 in the dark theme and re-tracing for 3 seconds. Baseline 59.7 fps
at 7.72ms composite per frame, 1.00 render passes. A closing baseline of 7.47ms
proves nothing stuck. Command: `p6-budget.js`.

**My budget is 8ms of a 16.7ms frame, everything included, because the rest of
the page exists. Field already spends 7.72ms of it on composite alone.**

| a director asks for | fps after | composite/frame | delta | passes | verdict |
|---|---|---|---|---|---|
| a transform or opacity animation | 60.0 | 7.27ms | **0** | 1.00 | **yes.** Free, as advertised. This is the whole list of free things |
| a full-viewport canvas drawing 200 arcs a frame | 60.0 | 8.71ms | +0.99ms | 1.00 | **yes.** A canvas is the cheapest way to draw a lot. 200 arcs a frame costs one millisecond |
| 20 canvas `shadowBlur:18` marks a frame | 59.7 | 8.71ms | +0.99ms | 1.00 | **yes, at 20.** My standing ceiling is 20 per frame and it is measured here, not remembered. At 200 it will not hold |
| one `innerHTML` rewrite a frame (40-node SVG) | 60.0 | 7.32ms | +0 composite, **+31.6ms style over 3s** | 1.00 | **no, with an alternative.** It is free in composite and it costs a forced layout and a style recalc every frame. This is exactly T2. Write attributes on existing nodes instead |
| one SVG `feGaussianBlur` group, 30 marks, repainted every frame | 59.7 | 9.26ms | +1.54ms, **+550ms raster (+39%)**, +59ms paint | 1.00 | **yes on a static surface, no on an animated one.** This is `#pmField`. On Energy it rasterises once. On Field it would cost 1.54ms forever |
| a full-viewport CSS `filter:blur(40px)` | 60.0 | 8.51ms | +0.79ms | 1.00 | **yes, if it never repaints.** This is `.pm-aura`. Static it is cached and nearly free; forced to repaint each frame it took the same surface from 149 swaps to 85 |
| a full-viewport `mix-blend-mode:screen` | **54.0** | 17.99ms | **+10.27ms** | **3.01** | **no, with an alternative.** Three render passes and 10ms for a blend. Small blended layers are cheap; full-screen ones are not. Pre-multiply the colour, or blend inside the canvas with `globalCompositeOperation`, which is free |
| ten small `backdrop-filter` elements (200x40) | 60.0 | 10.76ms | +3.04ms | **10.30** | **change it.** Ten elements, ten passes, 3ms. It holds at ten and this product ships 71 |
| one full-viewport `backdrop-filter blur(26px)` | **19.0** | 50.97ms | **+43.25ms** | 2.02 | **no.** Forty-three milliseconds. Two and a half frames for one property. This is the most expensive thing in CSS and the budget for it is one, small, and not on a surface that animates |
| a soft full-screen wash, done the way this product already does it | 60.0 | +0 | **+0.001ms/frame** | 1.00 | **yes, and this is the pattern.** A 200x125 canvas at opacity 0.34, upscaled 8.96x by the compositor, signature-cached to redraw 1.13 times a second. 25,000 pixels instead of 2,007,040. Copy this |

Three numbers to hand the other directors:

- **A new animated surface has about 6ms of main thread and about 8ms of
  composite to live in, on Field.** Field currently uses 1.8ms and 7.7ms.
- **Every `backdrop-filter` element is one render pass.** Ten cost 3ms. One
  full-screen costs 43ms. There is no version of this that scales with element
  count, so the answer to "can we glass this panel too" is no, and the number is
  0.3ms per small element on a software compositor and one render pass on any
  compositor.
- **`innerHTML` in a loop is a forced layout, at any size.** A 2,048-character
  write and a self-assign of the same node cost the same 60 layouts per second.
  If it changes every frame, write the attribute.

---

# Grade

**Engineering health now: B.**

What earns it. The arithmetic is sound and 763 headless assertions run in 0.47
seconds. The boundary refuses every out-of-range and wrong-typed leaf by name and
does not pollute `Object.prototype`, which closes the item both previous reviews
put first. The aura regression is dead and the fix it was replaced with is the
right one and is now the best pattern in the file. The wheel geometry bug is
fixed and verifiable at scale 1.0000. There is no memory leak and no listener
leak: 300 drill opens add two listeners, 360 tab switches settle back down. Eight
of nine surfaces produce zero frames and zero layouts at rest, which is a
genuinely good architecture that most products of this kind do not have. A
thousand stories, 1,095 snapshots and 1,000 rituals leave Field at 60.3 fps with
zero page errors. The comments are unusually honest and the one comment whose
arithmetic I checked hardest, the undo ceiling argument, is correct to within
half a percent.

What holds it down. Two shipped themes run at 18.3 and 14.0 fps on the hero
surface, which is a hard breach of a stated constraint and the design gate cannot
see it because it opens one viewport. One line puts a forced layout on the hero
surface sixty times a second. The functional gate is red in the tree right now
with a user-facing regression on the wheel, which means the commit discipline in
`CLAUDE.md` was not followed on the change that did it. `CLAUDE.md` asserts no
outbound requests and the app makes two. And the two write paths that matter most
to a person, committing a story and saving a ritual, do not read the failure the
engine hands them, while the machinery to report it exists and works fifteen
lines away.

None of those are architectural. T2, T3, T5, T7, T11 and T14 are all one-line to
one-function changes. T1 is a CSS decision, not a rewrite.

**Ceiling: A minus.**

The reasons to believe it. One file with no dependencies is a constraint that has
made this codebase faster, not slower: there is nothing to blame and nothing to
wait for, the whole cost is visible in one trace, and the cold load on a
six-times-throttled phone is 1.2 seconds. The engine is host free and mechanically
enforced. The store is a two-function seam, which means the accounts fork has one
place to change. `read()` is idempotent and separable. The tables are three
indexes over one set of objects and cost 0.08ms at boot. The signature-cache
pattern and the 25,000-pixel wash show this team can find the cheap version of an
expensive look, which is the skill that decides whether a product like this holds
60fps as it grows.

What caps it below an A. Everything is one main thread: no worker, no
`OffscreenCanvas`, no virtualised list, so every scale problem eventually lands on
the same 16.7ms. Persistence is one synchronous `JSON.stringify` of every profile
into a store with a measured 4.75 MB ceiling, and the accounts fork is going to
put a server's data through that same door. `compute()` still reads shared state,
which is why it is cheaper to call it sixty times a second than to reason about
when it is stale, and that trade is what put T7 and T2 in this report. And the
gates, which are this project's real asset at 1,523 assertions, watch one viewport
and one theme, so the largest defect in this review was invisible to all four of
them.

Those are reachable. A dirty-flag in the loop, one worker for serialisation, and a
second viewport plus a theme loop in the design gate would move both grades.
