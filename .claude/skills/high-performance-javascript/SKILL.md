---
name: high-performance-javascript
description: A cited digest of Zakas, "High Performance JavaScript" (O'Reilly/Yahoo! Press, 2010), every chapter, with each claim marked current, dated or mixed for a 2026 engine and applied to this single-file vanilla build. Load before writing or reviewing performance-sensitive code in atuned_src/, especially ui/map.js's canvas rendering, ui/wheel.js and the Field's particle and point-cloud work, the sound engine (ui/sound.js), the squarified Analytics treemap, anything touching localStorage, string-heavy content generation or regexes over text a person types or speaks, DOM renderers that write innerHTML, event wiring, boot time, or the build and pack pipeline (BUILD.sh, MANIFEST, tools/pack.js).
---

# High performance JavaScript, cited

This exists so performance advice in this repository is quoted from a real
source with a page number beside it, instead of reinvented or misremembered.
The book is from 2010 and measured 2009 browsers (IE6 to IE8, Firefox 3 and
3.5, Chrome 1 to 3, Safari 3.2 and 4, Opera 9 and 10). Much of its core
language advice has since been absorbed by JIT engines; most of its DOM,
layout, blocking and regex advice has not. Every item below therefore carries
one of three labels, and the label is the point:

    CURRENT   still true on today's Chromium, Gecko and WebKit
    DATED     overtaken by newer engines, the language or the platform.
              Kept as history so nobody reapplies it as current advice.
    MIXED     the principle holds, the book's numbers or mechanism do not

**No benchmark multiplier in this file transfers to a 2026 engine.** The book
says so of its own numbers (p.145: "general indicators of performance, not
hard numbers"). Quote the structural claim, never the speedup. The house rule
applies here as everywhere: read the number off a run on the build in hand.

**What this file is not.** It is not an audit of the code. The "Here" lines
apply the book to the product as CLAUDE.md describes it; none of them is a
finding until someone reproduces it in the source and measures it. Where a
line names a call site, treat it as a place to look.

**Not in the book at all, and needed beside it.** `requestAnimationFrame`,
the compositor (transform and opacity on their own layer, skipping layout and
paint), and per-frame allocation discipline. The book predates all three in
common use. Chapter 3's animation advice is to be read with the compositor
rule, never instead of it.

Citations are the book's PRINTED page numbers. Front matter is roman. See the
source material log at the end for the PDF offsets.

## The rules that matter most here, ranked

1. **Never interleave layout reads and writes** (Ch3 pp.51 to 52, 56).
   Commonest cause of a long frame in a DOM surface. Canvas sizing,
   nameplate placement (`tests/collide.js`'s domain), the treemap.
2. **Regexes on free text must not backtrack catastrophically** (Ch5 pp.91
   to 98). The only item in the book that can hang the tab outright, and
   the engine reads charge out of a story a person types or speaks.
3. **Keep animation state in JS and render it out, never read it back**
   (Ch3 p.56). Already the `n.disp` easing toward `n.sq`. Hold new motion
   to it.
4. **One DOM write per render per host** (Ch3 pp.36 to 37, 54 to 55; Ch7
   p.142). Whole innerHTML or a fragment. Escape user text. A parent write
   destroys nested hosts and their listeners.
5. **Event delegation on surface hosts** (Ch3 pp.57 to 59). Survives
   innerHTML re-renders.
6. **Zero allocation per frame** (Preface p.xii on GC; closures Ch2 pp.24
   to 26; `forEach` Ch4 pp.67 to 68). Hoist frame callbacks to named
   module functions.
7. **One long script is one long main-thread lock** (Ch1 pp.1, 5; Ch10
   pp.193 to 195). Defer initialisation of surfaces not on the landing tab
   until first open (Ch8 pp.154 to 155).
8. **Chunk one-off heavy work by elapsed time** (Ch6 pp.118 to 119), with
   `performance.now()` and a slice sized to the frame budget.
9. **Concatenation needs a terminator between modules** (Ch9 pp.165 to 166).
   The class of bug `tools/equiv.py` has already caught once.
10. **No eval, no string timers, `JSON.parse` only at the boundary** (Ch7
    p.138; Ch8 pp.151 to 153).

---

## Front matter and Preface (pp. i to xviii)

- **Authorship (p.xiv).** Ch3 by Stoyan Stefanov, Ch5 Steven Levithan, Ch7
  Ross Harmes, Ch9 Julien Lecomte, Ch10 Matt Sweeney; the rest Zakas.
  First edition March 2010, ISBN 978-0-596-80279-0.
- **GC pressure (p.xii).** IE6 "hadn't gotten any slower; it was just being
  asked to do more": its collector ran on a fixed object count, so apps that
  allocated more collected far more often. MIXED: collectors are
  generational now, but allocation volume still drives collection frequency
  and pauses still show as frame hitches. Root of rule 6 above.
- **Interpreters run code as written (p.xii).** DATED. Every engine this
  product runs on is a tiered JIT that does many of the book's
  micro-optimisations itself.
- **What engines cannot fix (p.xiii).** "Only a small subset, those related
  to core (ECMAScript) performance, could be rendered irrelevant by advances
  in JavaScript engines." DOM interaction, network latency and blocking are
  ground "where faster JavaScript engines won't help." CURRENT, and the
  right lens for the whole book: Ch2 is mostly absorbed, Ch3 is still live.

## Chapter 1. Loading and execution (pp.1 to 14)

- **Script blocks parse, render and input (p.1).** One thread for UI and JS;
  a `<script>` makes the page wait. CURRENT. Here: the inflated build is one
  parse and execute on the main thread at boot. Nothing paints inside it.
- **Scripts at the bottom (pp.2 to 4).** Head scripts block rendering
  ("don't start rendering anything ... until the opening `<body>` tag").
  MIXED: `defer`, `async` and modules are universal now and there is
  nothing to download here. The ordering half still matters: the boot sheet
  and noscript notice sit in markup ahead of the large script, which the
  packed loader's watchdog-ahead-of-payload design already respects.
- **Inline script after a stylesheet `<link>` blocks (p.4 tip).** CURRENT as
  a render-blocking interaction. Not applicable while all CSS is inline.
- **Group scripts (pp.4 to 5); order matters (p.9).** MIXED (HTTP/2). This
  product takes it to the limit: `BUILD.sh` concatenates in MANIFEST order.
- **Load after `window.load`; one big file is one long lock (p.5).**
  CURRENT, and it names this product's exposure. The single-file answer is
  small top-level boot execution and deferred initialisation, not more
  requests.
- **`defer` (pp.5 to 6).** DATED support list. Today `defer` applies to `src`
  scripts only; the book's inline `<script defer>` would be ignored. Limited
  relevance: the payload is written by the loader, not fetched.
- **Dynamic script elements and `loadScript` (pp.6 to 9).** IE
  `readyState` branches DATED. The inject-and-wait-on-load pattern is how
  loaders still work. Cross-script execution order was guaranteed only in
  Firefox and Opera (p.9), which is why the payload is one ordered blob.
- **XHR injection (pp.9 to 10).** Download without executing, run when ready.
  Here the echo is the packer: inert base64 gzip, inflated, executed only
  when written into the document. `fetch` is banned in `engine/`. A strict
  CSP would block this kind of injection.
- **Recommended pattern (pp.10 to 11).** A tiny inline loader first, then the
  rest, then init, placed before `</body>`. CURRENT as architecture and close
  to the packed file. The book does not cover what CLAUDE.md learned: a cut
  file cuts the loader, so the watchdog sits ahead of the payload.
- **YUI 3 seed, LazyLoad, LABjs (pp.12 to 14).** DATED, and against the
  no-dependency rule.
- **Erratum (p.13 tip).** "CSS file downloads ... don't block other page
  activities" is not accurate. CSS blocks rendering and blocks script after
  it, as the book's own p.4 tip shows.

## Chapter 2. Data access (pp.15 to 33)

- **Four storage locations (pp.15 to 16, Fig 2-1).** Literals and locals
  faster than array items and object members. DATED as a rule; inline caches
  make monomorphic property reads near a local. What survives: keep objects
  in a hot loop the same shape. Every one of the 112 node objects built with
  the same properties in the same order, none added mid-run.
- **Scope chains (pp.16 to 19, Figs 2-2, 2-3).** CURRENT as the model of
  lexical scope. Runtime cost DATED: engines resolve scope statically.
- **Identifier depth (pp.19 to 21).** "Global variables will generally be
  the slowest" (p.19); the book's own charts already show Chrome and Safari 4
  flat (p.20). DATED as a penalty. Still worth caching a chain in a local
  when a step is a host getter the engine cannot assume pure:
  `ctx.canvas.width`, anything that touches layout. A module-level `var` read
  from a renderer is free; a layout property read in a loop is not.
- **`with` and `catch` (pp.21 to 24).** `with`: avoid (strict mode forbids
  it). `catch` cost: DATED. The design rule is CURRENT: keep the catch body
  to one call such as `handleError(ex)` (p.23), and "a `try-catch` should
  never be used as the solution to a JavaScript error" (p.23). Matches the
  house rule that every write that can fail reports through `status()`: keep
  the try around a localStorage write thin and hand off to the one path.
- **`eval` makes a dynamic scope (p.24).** CURRENT: direct eval still
  deoptimises the enclosing function. Any future run-this-string path uses
  indirect eval or `new Function`, never direct eval in a hot module.
- **Closures (pp.24 to 26).** "Closures require more memory overhead" (p.26).
  Memory point CURRENT; IE leak and speed points DATED. The live risk here is
  a closure created per frame: an inline arrow passed to rAF or `forEach`
  inside `render()` allocates every frame.
- **Prototype chains (pp.27 to 30).** Semantics CURRENT, depth cost DATED.
- **Nested members (pp.30 to 31).** DATED for plain objects; still real when
  a step is a DOM or host getter (`el.style.x`, `getBoundingClientRect()`).
- **Cache member values (pp.31 to 33).** "Never look up an object member more
  than once within a single function, unless the value may have changed"
  (p.33). MIXED: negligible for engine objects, significant for DOM, style,
  layout and canvas-context properties. In a canvas loop, cache `ctx` and set
  `fillStyle` or `globalAlpha` only when it changes. The p.33 caution not to
  detach methods into locals (it breaks `this`) is CURRENT; today it throws
  under strict mode rather than misbinding.

## Chapter 3. DOM scripting (Stefanov, pp.35 to 59)

The chapter that matters most for this product. Most structural claims hold.

- **The toll bridge (pp.35 to 36).** DOM and JS engine are separate
  implementations; "cross that bridge as few times as possible and strive to
  stay in ECMAScript land" (p.36). CURRENT. It is the argument for the
  Field's canvas: pixels, no per-frame DOM.
- **Build in JS, write once (pp.36 to 37, Fig 3-1).** `innerHTML +=` in a
  loop against one assignment. CURRENT rule, DATED multipliers. Renderers
  here write the whole innerHTML of their host, which is the book's shape.
  Look for `innerHTML +=` in a loop or per-row writes.
- **innerHTML against DOM methods (pp.37 to 41, Fig 3-3).** "For most
  everyday cases there isn't a big difference" (p.40); choose for
  readability. MIXED. Two caveats the book lacks: escape user text (story and
  journal entries are user text), and a replacement destroys focus,
  listeners and nested hosts, which is CLAUDE.md's `#sum`/`#ana` lesson.
- **cloneNode (pp.41 to 42).** Marginal even then (2% to 10%). DATED. The
  modern descendant is `<template>.content.cloneNode(true)`.
- **Live HTML collections (pp.42 to 45, Fig 3-4).** `getElementsBy*`,
  `document.images` and kin re-query on every read; appending while looping
  `length` is an infinite loop (p.43). Liveness and the
  mutate-while-iterating hazard CURRENT; the speed gap much smaller now. Use
  `querySelectorAll` (static) or `Array.from`.
- **Cache collection elements in locals (pp.45 to 46).** CURRENT: never
  re-query the document inside a loop.
- **`nextSibling` against `childNodes` (p.47).** DATED (IE only).
- **Element-only traversal (pp.47 to 48, Table 3-1).** `children`,
  `firstElementChild`, `nextElementSibling` and kin. CURRENT and universal.
- **Selectors API (pp.48 to 50, Fig 3-6).** `querySelectorAll` returns a
  static NodeList, avoiding "performance (and potentially logic) issues"
  (p.48); both methods scope to any element (p.50). CURRENT. Look up a host
  by id, scope queries to the host, which is how `tools/monitor.js` was fixed.
- **Repaint and reflow (pp.50 to 51).** CURRENT, named layout and paint now.
  The missing third stage is composite.
- **What triggers reflow (p.51).** Adding or removing visible elements,
  position, size, content, initial render, resize, and "when a scroll bar
  appears." CURRENT. A surface whose height crosses the viewport toggles a
  scrollbar and relayouts everything, canvas host width included.
- **Forced synchronous layout (pp.51 to 53, Fig 3-7).** Reading `offset*`,
  `scroll*`, `client*` or `getComputedStyle()` flushes the queue, "even in
  cases where you're retrieving layout information that wasn't recently
  changed" (p.51). Batch writes, then reads (p.52). CURRENT and the single
  most important item in Part 1. The modern list is longer:
  `getBoundingClientRect()`, `innerText`, `scrollIntoView`, `focus()`,
  `window.innerWidth`. Here: in any function that measures and mutates, all
  reads first, then all writes; never read layout inside a rAF loop that
  writes styles. How long one forced layout costs on a real surface has not
  been measured; profile before quoting a figure.
- **One style write (pp.53 to 54).** `cssText` or, better, `className`.
  MIXED: browsers coalesce writes until the next read. Still prefer a class,
  attribute or custom property toggle on a root, which fits the three themes.
  `cssText` replacement silently drops other inline styles.
- **Batch off-document (pp.54 to 56).** Hide and show, a `DocumentFragment`
  ("appending a fragment appends its children, not itself"), or clone and
  `replaceChild`; fragments recommended (p.55). CURRENT. Modern additions:
  `replaceChildren`, `append(...nodes)`, `<template>`. Matters for any list
  built node by node (journal, imprints, the Insight rail stack).
- **Cache layout information (p.56).** An animation reading `offsetLeft`
  every tick flushes per frame; read once, increment a local. CURRENT. Never
  read the DOM back to learn where you are. Same rule for canvas: never
  `getImageData` in a loop.
- **Out of the flow for animations (pp.56 to 57).** Position absolutely,
  animate, restore. Principle CURRENT, technique superseded: animate
  `transform` and `opacity`. Relevant to the boot sheet fade and panel
  open and close (the atuned-animation skill's domain).
- **IE `:hover` on large tables (p.57).** DATED. Residual lesson: hover
  should change colour, opacity or transform, not layout, on many elements.
- **Event delegation (pp.57 to 59).** Many handlers cost weight, setup at a
  "busy time" and memory; most "might never be needed" (p.57). One handler on
  a wrapper, read the target. CURRENT and the recommended pattern here: one
  listener per surface host survives innerHTML re-renders. Use
  `e.target.closest('[data-...]')`. Fits the SVG Body map too. IE fallbacks
  DATED.
- **Summary (p.59)** also names "drag and drop proxies", which has no section
  of its own in these pages.

## Chapter 4. Algorithms and flow control (pp.61 to 80)

- **Loop types and `var` scope (pp.61 to 62).** `let`/`const` make the scope
  note DATED.
- **`for-in` is the slow one (p.63).** MIXED: "seven times slower" is dated,
  it still walks the prototype chain. Never `for-in` an array. Per-frame
  walks over the 112 addresses run over an array.
- **Only work per iteration and iteration count matter (p.63).** CURRENT.
- **Count operations per iteration (p.64).** CURRENT. In the easing and
  point loops the per-element call is usually the real cost.
- **Cache `length` (pp.64 to 65).** DATED on arrays (JITs hoist it). Still
  matters on live DOM collections.
- **Reverse loops (pp.65 to 66).** DATED as a trick. The p.66 tip is
  CURRENT: per-iteration work pays on O(n); worse than O(n), cut iterations.
- **Duff's Device (pp.66 to 67).** DATED; insignificant below 1,000
  iterations even by its own account. Do not use.
- **`forEach` (pp.67 to 68).** MIXED. The 8x is dated; inside a rAF loop an
  inline callback still allocates a closure and a megamorphic callback
  cannot be inlined. Plain `for` in hot loops.
- **if-else against switch (pp.68 to 70).** MIXED; choose for readability.
- **Most likely condition first (p.70).** CURRENT, free.
- **Bisecting range checks (pp.70 to 72).** CURRENT in principle. Usually a
  lookup table is cleaner.
- **Lookup tables (pp.72 to 73, Fig 4-1).** Flat cost as cases grow; use a
  table when a key maps to a value, switch when each key needs an action.
  CURRENT and already this product's grain. A per-frame colour or band
  mapping is a precomputed array indexed by integer, built outside rAF.
- **Recursion and stack limits (pp.73 to 75, Fig 4-2).** Limits DATED as
  figures; no general tail-call optimisation except Safari. "No script should
  ever be deployed that has the potential to exceed the maximum call stack
  size" (p.75): CURRENT. A boot guard must not treat a caught `RangeError` as
  recovery. Any recursive tree walk (treemap rows, domain hierarchy) has a
  bounded depth.
- **Mutual recursion (pp.75 to 76).** CURRENT. A renderer that triggers a
  render that re-renders the first is exactly this.
- **Recursion to iteration, merge sort (pp.76 to 77).** CURRENT technique,
  dated threshold. The book's `merge()` uses `shift()` and `concat`, which
  allocate; do not copy it into a hot path. Plain sorting uses native `sort`,
  stable since ES2019.
- **Memoisation (pp.77 to 79).** "Work avoidance is the best performance
  optimization technique" (p.77). CURRENT; use a `Map`. Caveat for this
  product: `compute()` reads shared state, so a cache keyed on arguments
  alone serves stale results. Memoise only pure functions, or key on a
  profile revision counter.

## Chapter 5. Strings and regular expressions (Levithan, pp.81 to 105)

- **Concatenation methods (p.82, Table 5-1).** CURRENT framing.
- **Avoid the temporary string; keep the base on the left (pp.82 to 83).**
  DATED: engines use ropes. Building innerHTML with `+=` or templates is
  fine; the cost is the DOM parse on assignment.
- **IE quirks (pp.83 to 84).** DATED. Surviving hygiene: rope engines defer
  flattening, so a string-building micro-benchmark must use its result.
- **Compile-time folding (p.84).** CURRENT; constant pieces cost nothing.
- **Array join (pp.84 to 86).** DATED. The book's own summary (p.104): outside
  IE7 and earlier, "array joining is one of the slowest ways". Use `join`
  only where it reads better.
- **`concat` (pp.86 to 87).** Never faster than `+`.
- **How a regex runs (p.88).** Compile, set start (`lastIndex` only for
  `exec`/`test` with `/g`), match with backtracking, retry from each
  position. CURRENT. Modern addition: the `/y` sticky flag.
- **Backtracking (pp.89 to 92, Figs 5-4, 5-5).** Every quantifier and
  alternation is a decision point; character classes do not backtrack
  internally (p.89 footnote). Greedy against lazy. CURRENT: V8, SpiderMonkey
  and JSC all ship backtracking engines by default.
- **Runaway backtracking (pp.91 to 93).** `[\s\S]*?` segments re-expand when a
  closing token is missing. Fix by being specific: `"[^"\r\n]*"` not
  `".*?"`. CURRENT. The p.91 note that JS cannot make dot match everything is
  DATED (`/s`, ES2018).
- **Atomic groups by lookahead (pp.93 to 94).** `(?=(pattern))\1`. CURRENT:
  ECMAScript still has no atomic groups or possessive quantifiers.
- **Nested quantifiers (pp.94 to 95).** `/(A+A+)+B/` on a run of A's is
  O(2^n); 35 A's can hang a browser for over ten minutes (p.95). Fix: two
  parts of a regex must not be able to match the same text. CURRENT, the
  ReDoS class, and no general backtrack cap exists in V8. Here: every regex
  run on story or journal text needs this check. Not yet audited; belongs in
  the backlog as a named check.
- **Benchmark with near misses (p.96).** "Always test your regexes with long
  strings that contain partial matches." CURRENT. A fixture of long near-miss
  story texts with a time ceiling belongs in the headless engine gate.
- **Efficiency list (pp.96 to 98).** All CURRENT unless noted: fail faster;
  start with a simple required token; make adjacent quantified tokens
  mutually exclusive; reduce alternation (`[cb]at`, `rea?d`, `r(?:ed|aw)`);
  non-capturing groups; capture what saves post-processing; expose required
  tokens (`^(ab|cd)` not `(^ab|^cd)`); hoist regexes out of loops, never
  compile inside one (p.98), which matters most for `new RegExp(dynamic)`
  and `/g` state; split complex regexes. The Firefox `\s\s*` preference and
  Opera laziness notes are DATED.
- **When not to use a regex (p.99).** `/;$/` scans the whole string. CURRENT.
  Use `endsWith`, `startsWith`, `includes`, `indexOf`, `at(-1)`, `slice`
  (`substr` is legacy).
- **Trimming (pp.99 to 104, Table 5-2).** Native `trim` universal now, so
  the polyfills are DATED. The lessons inside them survive: top-level
  alternation tries both sides at every position (p.101); a lazy any-char
  inside a capture is slow on long strings (p.101); engine optimisations make
  regex speed non-portable (pp.101 to 102); a regex "cannot jump to the end
  of a string without considering characters along the way" (p.103), so
  end-of-string work is a scan from the end. Table 5-2 figures DATED.

## Chapter 6. Responsive interfaces (pp.107 to 124)

- **One UI thread (p.107).** CURRENT in substance. Compositing and scrolling
  now run off thread; input, layout, paint and rAF still share it with script.
- **The UI queue (pp.107 to 109, Fig 6-1).** CURRENT as the event loop. The
  "stop queuing" detail is DATED.
- **Long-running script limits (pp.109 to 110).** Specifics DATED; "avoid
  them in the first place" (p.110) CURRENT.
- **100 ms (pp.110 to 111).** Sourced to Miller 1968, Nielsen 1994, Card et
  al. 1991. MIXED: still the input-to-feedback budget, far too loose for
  anything animated. The house frame budget is 8 ms of script in 16.7 ms.
  While the Field or Body map animates, a task longer than a frame drops
  frames.
- **Timers (pp.111 to 114, Figs 6-3, 6-4).** `setTimeout` queues at n ms; it
  never runs before its creator finishes; a timer starts a fresh stack (p.113);
  `setInterval` will not double-queue (p.113 note). CURRENT. Precision figures
  and the 25 ms floor DATED (nested timeouts clamp at 4 ms; background tabs
  throttle). A timer is not a frame clock. Here: the `n.disp` ease at a fixed
  0.14 per frame is frame-rate dependent and runs twice as fast at 120 Hz. A
  known trade, worth stating; the book does not cover it.
- **Array processing with timers (pp.114 to 116).** Chunk only when work need
  not be synchronous or in order. MIXED: `arguments.callee` is forbidden in
  strict mode, `shift()` is O(n), and modern yield points are `setTimeout(0)`,
  a `MessageChannel` post, `requestIdleCallback`, or `scheduler.yield()`
  where supported (check before relying on it).
- **Splitting tasks (pp.116 to 118).** Only when the steps can run
  asynchronously without breaking dependent code (p.118). CURRENT. Here: an
  atomic operation such as `pImport` (validate, load, save, all or nothing)
  must not be split across yields.
- **Timed batches (pp.118 to 119).** "Never let any JavaScript code execute
  for longer than 50 milliseconds continuously" (p.118); `timedProcessArray`
  runs until 50 ms have elapsed, then yields. CURRENT and the best idea in the
  chapter; 50 ms matches today's long-task threshold. Use `performance.now()`.
  Alongside animation, slice at about 4 to 8 ms, not 50.
- **Many timers compete (pp.119 to 120).** Repeating timers at 100 to 200 ms
  made mobile Gmail "noticeably slower"; use one timer for several jobs
  (p.120). CURRENT. One central loop for every animated surface, easy to
  pause together; low-frequency or merged polling.
- **Web Workers (pp.120 to 124).** No DOM, message passing only, data copied
  (pp.121 to 122). MIXED: the book's type list (primitives, Object, Array) is
  DATED; structured clone and zero-copy transferables now cover far more. "Any time a process takes longer than 100
  milliseconds ... consider whether a worker solution is more appropriate"
  (p.124). Here: the host-free engine already meets a worker's constraints,
  so `compute()`-class work could move later without a rewrite. In a one-file
  build a worker comes from a Blob URL (a future CSP would need
  `worker-src blob:`). Not tested; not worth it until a measured engine pass
  is over budget. The copy back can cost as much as the work. localStorage
  cannot move to a worker.

## Chapter 7. Ajax (Harmes, pp.125 to 150)

- **Request methods (pp.125 to 127).** XHR, script insertion, MXHR. DATED
  APIs; `fetch` in `ui/` only, never `engine/`. Streaming on `readyState` 3
  (pp.126 to 127) is CURRENT in principle via `response.body.getReader()`;
  relevant if the voice audio from the Worker is ever streamed rather than
  awaited whole.
- **Cross-domain (p.127).** DATED; CORS is the mechanism behind the `null`
  origin refusal and the `LOCAL_ORIGIN` allowance for localhost.
- **GET for idempotent reads (p.127).** CURRENT; the 2,048-character limit
  and the packet-count argument (p.132) DATED. Choose by meaning.
- **Script insertion security (p.128).** "Any code that you incorporate into
  your page using dynamic script tag insertion will have complete control over
  the page." CURRENT and absolute: never load executable script from the
  Worker or anywhere else.
- **MXHR (pp.128 to 131).** DATED technique; its rolled-up idea is what the
  packer does, with the same cost the book names: rolled-up resources are
  not separately cacheable (p.131). The single control-character delimiter is
  a sound framing pattern.
- **Send with retry (pp.131 to 132).** CURRENT: any write to the Worker that
  matters retries or reports through `status()`.
- **Beacons (pp.133 to 134).** Image beacon DATED (`navigator.sendBeacon`);
  204 for fire-and-forget CURRENT. `new Image` is banned in `engine/`.
  No telemetry exists; privacy rules would apply.
- **Formats (pp.134 to 145, Fig 7-1).** XML has "no place in high-performance
  Ajax" (p.137). Always `JSON.parse`, never `eval` of data (p.138 sidebar):
  CURRENT, and the `pImport` boundary is fed by `JSON.parse` only. Short keys
  and positional arrays shrink and speed parsing at the cost of being "much
  more brittle" (pp.138 to 139): CURRENT in principle, relevant where bytes
  are capped (localStorage, the `#r=` link via `linkWrap`/`linkUnwrap`), with
  order pinned by schema version. JSON-P (pp.139 to 140) DATED and never for
  these records. Server HTML via innerHTML (pp.141 to 142): the cost is insert
  and layout, not string building. `split()` on control characters (pp.142 to
  144) is the densest text format; control characters must be URL-encoded in
  `#r=`, which may cancel the saving. Measure first.
- **Don't make the request (pp.145 to 147).** Cache headers (`Expires` p.146
  DATED, `Cache-Control` now) and a local cache with explicit invalidation
  (pp.146 to 147): CURRENT. Cache the sign-in record for the session and
  invalidate on save, import, delete.
- **Libraries (pp.148 to 149).** ActiveX DATED; call `fetch` directly.
- **Summary (pp.149 to 150).** "Ensure your code fails gracefully." CURRENT.

## Chapter 8. Programming practices (pp.151 to 161)

- **Double evaluation (pp.151 to 153, Table 8-1).** `eval`, `new Function`
  and string timers. CURRENT and stronger now (optimiser and CSP). The
  packer's one-time write of trusted self-carried bytes is not in a loop, so
  the per-call penalty does not apply; it would conflict with a strict CSP.
- **Literals (p.153).** CURRENT for size and style. Building an object with
  all its properties in a fixed order gives it a stable shape. Literals still
  allocate: not inside a frame.
- **Don't repeat work (p.154).** CURRENT; IE example DATED. Here: feature
  checks and, more expensively, layout reads in a frame. Compute once, update
  on the event that changes it.
- **Lazy loading of functions (pp.154 to 155).** "Best used when the function
  won't be used immediately." CURRENT. Build Compass tables or sound buffers
  on first open of their tab, not at boot.
- **Conditional advance loading (p.156).** For functions used immediately and
  often. CURRENT. Pick a draw routine by `devicePixelRatio` or reduced motion
  once, outside rAF.
- **Bitwise (pp.156 to 159).** `i & 1` over `i % 2` DATED as a win. Bitmasks
  CURRENT as a compact flag set for a record or link. `x | 0` truncates;
  never on timestamps (32-bit). **Erratum (p.159):** the sidebar calls `>>>`
  "signed right shift". It is the unsigned (zero-fill) shift; `>>` is signed.
- **Native methods (pp.159 to 160).** MIXED; the book's own sidebar (p.160)
  says Chrome implements much of its built-in library in JS. Precompute sin
  and cos tables where angles repeat per frame: don't-repeat-work beats
  use-native.
- **Summary (p.161).** "Greatest performance gains when these optimizations
  are applied to code that is run frequently." CURRENT. Optimise the rAF loop,
  the easing pass and the treemap layout, not one-time boot code.

## Chapter 9. Building and deploying (Lecomte, pp.163 to 176)

- **Empty cache dominates (p.163).** Numbers DATED, lesson CURRENT: first
  visit is the product's whole funnel.
- **Ant, cpp, smasher (pp.163 to 167, 174 to 175).** Tooling DATED. `cpp`
  would choke on `#` in JS strings and the `#r=` literals. The principle of
  stripping instrumentation at build time is CURRENT.
- **Concatenate in dependency order (pp.165 to 166).** "If any of the source
  files (except possibly the last one) does not end with either a semicolon
  or a line terminator, the resulting concatenated file may not contain
  valid JavaScript code"; Ant's `fixlastline`. CURRENT and the most directly
  applicable item in the chapter. MANIFEST is the ordered filelist. Check
  that `BUILD.sh` guarantees a terminator between modules.
- **Minification (pp.168 to 169).** Tools DATED, principle CURRENT. Two
  cautions, both CURRENT (p.169): the smallest minified file may not gzip
  smallest, and indirection has a runtime cost. This build is not minified.
  If it ever is: after `tools/equiv.py`, on the packed artifact only, never on
  `source.html`.
- **Closure Compiler advanced mode (pp.169 to 170).** Would break anything
  looked up by string: `TABDEF` keys, TAB identities, storage keys, record
  field names. Not safe here.
- **Build time over run time (pp.170 to 171).** "Everything that can be done
  at buildtime should not be done at runtime" (p.170). Packer's unpack cost
  "about 200 to 300 milliseconds" (p.171); minify plus transport gzip
  "always gives the best results." CURRENT and on point: `tools/pack.js` is
  structurally a self-extractor. Native `DecompressionStream` is far cheaper
  than Packer, but not free. The book's resolution fits: serve the raw build
  with transport compression where a server exists, keep the packed file for
  the downloaded-attachment route. Two artifacts carry the "increased QA
  costs" the book names, which CLAUDE.md records as the stale
  `atuned-packed.html`. Measure navigation to first frame for both before
  changing anything.
- **HTTP compression (pp.170 to 171).** CURRENT; Brotli now. "Never gzip
  already-compressed" data: the base64 of an already compressed font gzips
  poorly, so the embedded font is a disproportionate share of the packed file.
- **Caching and renaming (pp.171 to 173).** AppCache and the iPhone limits
  DATED. "The JavaScript code must itself handle the expiration" of client
  storage (p.172): CURRENT. Anything from the Worker held in localStorage,
  tier state above all, carries its own stamp and invalidation. Cache busting
  by name (pp.172 to 173) CURRENT; the build stamp and md5 are the source.
- **CDN (p.173).** CURRENT for the hosted build; public library CDNs are
  against house rules.
- **Summary (pp.175 to 176).** Combine, minify, compress, cache, CDN, "all
  these steps should be automated." This product does combine and stamp,
  compresses by self-extraction, does not minify.

## Chapter 10. Tools (Sweeney, pp.177 to 202)

- **Profile, don't assume (pp.177 to 178).** An optimisation for one browser
  may have "the opposite effect" in another. CURRENT; matches "reproduce
  before fixing, re-measure after."
- **Timing (pp.178 to 179).** `Date` DATED: use `performance.now()` or
  `performance.mark`/`measure`. Even that is coarsened; average many frames.
- **YUI Profiler keeps per-call points (pp.179 to 182).** The library is
  DATED; keeping every sample, not just the average, is CURRENT. A frame-time
  distribution (p95, max) shows jank a mean hides, the house's "an aggregate
  hides a hole."
- **Name anonymous functions (pp.182 to 183).** CURRENT. Name the rAF
  callback and each draw function. Profile `source.html`, never the packed
  file (p.183: "always use uncompressed versions ... for profiling").
- **Firebug, IE8 tools, Web Inspector (pp.183 to 192).** Tools DATED;
  `console.time`, `console.profile`, bottom-up and top-down views CURRENT.
  The p.185 example reads and writes `style.left` per iteration, a
  forced-layout pattern used only for timing. Micro-benchmarks below timer
  resolution are "inconclusive" (pp.187 to 188): CURRENT.
- **Chrome Timeline and heap snapshots (pp.192 to 193).** CURRENT and the most
  useful tool reference here. Snapshot, run the Field for N seconds, snapshot,
  compare: a rising closure, Array or Object count with no user action is rAF
  garbage.
- **Script blocking (p.193).** Rendering waits on script; defer slow
  initialisation. CURRENT: do not build the Field, Compass, Body map or
  treemap until their tab is first opened.
- **Page Speed deferrable JS (pp.194 to 195).** "98.4% of the JavaScript ...
  had not been invoked by the time the onload handler completed." Tool DATED,
  successors (DevTools Coverage, Lighthouse) CURRENT. Browser twin of the
  house's `NODE_V8_COVERAGE` run.
- **Fiddler, Charles, YSlow, dynaTrace (pp.196 to 201).** Tools DATED. Split
  network latency into DNS, connect, server, transfer (p.196); trace a click
  through its async request (p.200): CURRENT, and the shape for measuring the
  voice control to first audio.
- **Summary (p.202).** "Deferring scripts whenever possible allows the page to
  render more quickly." In a one-file build that means deferring
  initialisation inside the file.

## Do not reapply

Record as history only: scope-depth and prototype-depth costs (pp.19 to 21,
29 to 30); every IE branch; `defer` support lists; YUI, LazyLoad, LABjs;
array-join concatenation (pp.84 to 86); `cloneNode` gains; reverse loops and
`length` caching on arrays as speed fixes; Duff's Device; hand-written trims;
25 ms timer floors; `arguments.callee`; JSON-P; MXHR; AppCache; `i & 1` as a
win; Ant, cpp, smasher; Firebug, YSlow, dynaTrace, `displayName`; and every
benchmark multiplier.

## Source material log

A running record of what has been read, so the next session does not re-ask.

**High Performance JavaScript, Nicholas C. Zakas** (O'Reilly / Yahoo! Press,
first edition March 2010, ISBN 978-0-596-80279-0). Uploaded by the owner
2026-11-20 as one zip, split into three PDFs for size. Copyrighted: use it to
extract facts and techniques, never copy its text, code listings or figures
into this repo beyond short quoted phrases with a page cited.

    High.Performance.JavaScript_Part1_FrontMatter-Ch3.pdf   80 PDF pages
        front matter, Preface, Ch1 to Ch3 (book p.i to p.59)
        PDF page = book page + 20. Blank: PDF 4, 8, 60 (p.34), 80 (p.60)
    High.Performance.JavaScript_Part2_Ch4-Ch6.pdf           64 PDF pages
        Ch4 to Ch6 (book p.61 to p.124). PDF page = book page - 60.
        Blank: p.106
    High.Performance.JavaScript_Part3_Ch7-Index.pdf         88 PDF pages
        Ch7 to Ch10, Index p.203 to 209, About the Author, Colophon.
        p.162 blank

All 232 pages were read in full on 2026-11-20 by three readers, one per part,
with the Read tool's `pages` parameter, and this file was written from their
combined digest. Nothing in the book is known to be unread. The Index and the
author and colophon pages carry no technique.

**Not yet done, and the natural next pass:**
- No claim here has been checked against the code. Each "Here" line is a
  place to look. The first candidates are the regex audit of story and
  journal parsing (Ch5 pp.94 to 96), a near-miss timing fixture, the module
  terminator in `BUILD.sh` (Ch9 pp.165 to 166), layout read and write
  interleaving in canvas sizing, nameplates and the treemap (Ch3 pp.51 to
  52), and navigation to first frame, raw against packed (Ch9 pp.170 to 171).
- Two errata recorded above: p.13 (CSS does block) and p.159 (`>>>` is the
  unsigned shift).

*(Extend this log, do not replace it, as findings are confirmed in the code.
Cite page numbers as PRINTED in the book, not the PDF's own page index.)*
