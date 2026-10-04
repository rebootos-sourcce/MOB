# Verification gates

Four gates. One is headless and runs in under a tenth of a second. Three drive a
real Chromium, not a DOM stub. A stub resolves elements by id regardless of tree
position, so it reports green on a broken document, and it cannot see CSS at all.
Both of those have shipped regressions before.

## The engine gate

No browser, no DOM, no renderers. It requires `engine.js` and asserts the
contract rather than today's numbers, so a legitimate tuning change passes and a
broken invariant does not.

    ./atuned_src/BUILD-engine.sh
    node tests/engine.js       279 checks in 22 groups

The 17 groups: data integrity, determinism, the poled binary (jouissance begins
at 6), monotonicity, CQ bounds and ceiling, saboteur charge ranges are bands and
not floors, the six gates multiply resistance, the lean, schema round trip,
partial intake scoring, the sniffer, the expression deficit model, accuracy,
the chain compounding in order, every persona computing, the front door, the host
seam, and the path.

`BUILD-engine.sh` then runs `atuned_src/hostfree.py`, which strips comments and
string literals and fails on `document`, `window`, `navigator`, `localStorage`,
`sessionStorage`, `requestAnimationFrame`, `alert`, `fetch`, `XMLHttpRequest` or
`new Image`. The engine is not allowed to reach for its host. Stripping first
matters: a comment naming `localStorage` is not a call to it, and the lexicon
data legitimately contains the word window.

## The claims gate

Headless, no dependencies, and `BUILD.sh` runs it on every build, so a build
with a medical claim on the funnel does not finish.

    node tests/claims.js

It reads every string a stranger can read on the funnel pages, their
sendable copies in `funnel/dist`, the legal pages, the engine's printed
tables and the hooks in `marketing/hooks.js`, and puts each sentence through
the claims rules of `marketing/refuse.js`: medical, cause, ai, testimonial,
scarcity. The forbidden lists in `reviews/ATUNED-Master-BMT-TDD.md` section
20 and section 5 are written in as patterns, one per item.

Before it reads a page it proves itself: every line in a known bad set is
refused by the rule named beside it, every line in a known good set (the
product refusing the thing) passes, the reader finds a line planted in a
meta tag, a paragraph, an alt and a string split across a `+`, and skips one
planted in a comment, and each rule removed alone lets its own lines
through. If any of that fails, no page is read. On 2 October, run against
the rule set from before it, the self test refused 7 of its 28 known bad
lines and stopped; that sentence is dated on purpose.

The owner's own lines that break it are held by exact sentence in `HELD`,
each with whose words they are and where he said them, and every run prints
every hold. A held line changed by one word is caught again, and a hold whose
line no longer ships fails the run until it is deleted. Nothing goes in
`HELD` without his ruling. Read the counts off the run.

## Value felt after session one

Two gates for the measure in `reviews/ATUNED-Creative-Storyboard-TDD.md`
section 49: after a person's first release, how valuable it was, why, and
whether they would spend ten minutes on it again.

    node tests/valuefelt.js
    NODE_PATH=/opt/node22/lib/node_modules node tests/valuefeltui.js

The first is headless and holds `engine/valuefelt.js`: when it is asked,
the one writer, refusals by name with nothing clamped, and that a value
report is never a graph edge. It runs the same suite on copies of the engine
with one rule broken each, and every copy must fail.

The second drives a real Chromium against `source.html` and holds
`ui/valuefelt.js`: asked on the next open and never from the release code,
never over a standing door, Skip writes nothing, Keep reaches the stored
record, and an answered record is not asked again. It first runs the door
check on a copy whose `vfBlocked` cannot see a dialog, and that copy must
fail. Read the counts off the run.

## The record in a link

The quiz can open the app with the reading packed into the address after
`#r=`, the part of an address a browser never sends to any server. Two gates.

    node tests/engine.js                                         group 15f
    NODE_PATH=/opt/node22/lib/node_modules node tests/recordlink.js
    SHOTS=dir ... node tests/recordlink.js                       and the pictures

Group 15f is the wire format, headless: `linkWrap` and `linkUnwrap` in
`engine/schema.js` round trip every length and every byte value, write only
characters an address carries unescaped, open with a format version, and
refuse an empty, unversioned, later format, damaged, cut or oversized link by
name through `importError()`, with the profile list and the open profile
untouched.

`tests/recordlink.js` is the whole route in a real Chromium, nothing stubbed:
the quiz builds the link from real answers off the same anchor as its door to
the app; the app opened on it loads the record through `pImport`, says so on
screen once the boot sheet has lifted (on the login door's own line when the
door stands), and takes the record off the address so a reload cannot load it
twice; eight bad links (cut, cut mid group, damaged, a later format, a stray
character, not JSON, a record the boundary refuses, a charge of 9999) are
each refused by name with the list, the open profile and the stored bytes
unmoved; and the built quiz in `funnel/dist` reaches `atuned.html` beside it,
and the packed build, which rewrites its own document, still sees the address.
It first runs on two known bad copies of the app, one that never reads the
link and one whose importer skips the boundary, and each must fail its check.
Read the counts off the run.

## The front door

The engine has one entrance and the three surfaces are separable, so each can be
tested on its own.

    read(profile, opts)     all three at once. what callers want.
      input(profile, opts)  one profile in. it is the only input.
      throughput(profile)   the chain, in the one order it runs in.
      output(profile)       the field written back as schema.

    opts.story              text to apply once before computing
    opts.write              also write the field back into the profile

`read()` is repeatable: twice on one profile gives identical numbers. The chain
underneath was not, because the gate mixes accumulate, and this module is the
only thing permitted to zero them.

The engine ships with a no-op profile store, so a headless run persists nothing
and never throws. A host binds its own with `bindStore(get, set)`. `ui/ui.js`
binds `localStorage`.

## The browser gates

    npm install playwright
    node tests/design.js       17 checks · shell, one surface per tab, CSS coverage,
                               11px type floor, no all-caps
    node tests/functional.js   262 checks · 10 personas x 5 tabs x 4 depths x 7 layers,
                               drills, figure fallback, zero JS errors
    node tests/collide.js      40 checks · zero overlapping wheel nameplates,
                               every persona x every depth
    node tests/unpack.js       round PO, unpack every symbol: on the Summary reading,
                               the blueprint card, the sign chips, the left rail and
                               every pole on the Compass, a seeded term with no
                               meaning beside it fails. The table it holds the page
                               to is engine/data/gloss.js. Shown against a known bad
                               block first, and against the build from before the
                               round, which it fails. Read the count off the run.
    node tests/dailyui.js      the daily summary on the page, ui/daily.js: Today in
                               the Summary's side column, one day frozen on the
                               first open, the column printing that day sentence
                               for sentence with every term carried, the aim set
                               and marked through the boundary and kept across a
                               reload, silent on nothing read, never frozen on a
                               worked example, a refused save reported. Holds the
                               Summary's percent and words-twice defects too. Fails
                               on the build from before it. Read the count off the run.
    node tests/sound.js        the fittings, ui/sound.js: every sound rendered
                               offline under its ceiling and its cap, silent
                               off, under Quiet, before a press and inside a
                               release, each proven against a broken engine.
                               Also called at the end of functional.js.
                               Read the count off the run.
    node tests/msglog.js       the bottom message dock: three seconds, Keep, the
                               last fifty in a log, a failure never swallowed.
    node tests/protocol.js     a release's cross, End on every phase, and End
                               charging only the lines that were said.
    node tests/release-screen.js round QM, the release as the whole screen: no
                               frame, the prompt pinned, the reframe in "I know
                               that I am", left and right counts, swipe to bank
                               or shadow, the scrub, the results. Fails on the
                               build before it, ab6666a, 44 of 50. Round QQ
                               added his feedback on it: Left and Right channel,
                               Release and Reframe on the scrub, numbers only
                               down the list, End session, Pause and Play,
                               Bookmark, the bank pick's count with Submit and
                               Recycle, and CQ with Up landing on the record's
                               own CQ. Those fail on f164f17, the build before.
    node tests/device.js       device settings (Practitioner mode) on a worked
                               example. The last three are also called from
                               functional.js, and each fails on the build from
                               before its change.
    node tests/personas-tier.js every worked example opens on a live tier four
                               plan with nothing locked, read off the record with
                               the SIGHT_PLAN seam off, and the person's own
                               record keeps its own tier and is never written to
                               tier four. Fails on the build from before Round
                               PS (e0c46d6^) and on one example left unexempted.
    node tests/feedback.js     the feedback tracker: comment, question and
                               something broken in Help, the outbox losing
                               nothing on a late or refused send, no token on
                               the request, and the Discord door a stub until
                               its invite is a real Discord invite. The engine
                               half runs on a private copy and against broken
                               copies; the surface half against a stubbed
                               feedback address, so nothing leaves the machine.
                               Also called from functional.js. Fails on the
                               build from before it. FB_NO_BROWSER=1 runs the
                               engine half alone.
    node tests/discordfeedback.js  the relay, functions/feedback.js, the Pages
                               Function that reads DISCORD_FEEDBACK_WEBHOOK and
                               posts to Discord. Its key and kind lists held
                               equal to the engine's, every malformed request
                               refused by name, an unset variable a 503 and
                               never a loss, no mention able to ping, and five
                               broken copies that must each fail. Then the app
                               served over http with the real handler at
                               /feedback and Discord stubbed: the profile
                               menu's Discord feedback row, held when the
                               variable is unset, sent only on a Discord yes,
                               the join row only with a real invite, and a
                               file copy that says it cannot send. Fails on
                               the build from before it. DF_NO_BROWSER=1 runs
                               the Function half alone; SHOTS=dir keeps the
                               pictures.

All three resolve `source.html` from the working directory, so run them from the
repo root.

`design.js` reports one expected failure in a sandbox with no outbound network:
Google Fonts cannot be fetched and the two optional figure rasters are absent.
Both are environmental. The vector figure is inline and always renders.

## The path simulation

The engine gate asserts the path's contract. The simulation attacks it, by
generating stories out of the app's own vocabulary and checking invariants that
would catch the path being an artifact of scan order, of punctuation, or of
nothing at all.

    node tools/simulate-path.js [stories] [seed]     default 4000, seeded

Roughly 18 assertions per story: determinism, case and punctuation invariance,
unknown words at the ends not moving the route, reversal reversing the route and
flipping the direction while preserving the distance, a different order being a
different route, joined stories concatenating, the geometry not contradicting
itself, every step sitting on a measured seat, and the path moving no number in
the app. The seed is printed, so a failure is reproducible from its seed alone.

It found two defects in the sniffer underneath and three in its own invariants.
Both kinds are worth the run.

## Equivalence

`tools/equiv.py` extracts every top-level declaration from two bundles and
compares the multiset of name against hashed body. Use it after any move or
resplit of `atuned_src/` to prove nothing changed that was not meant to.

    python3 tools/equiv.py old.html new.html

It exits non-zero if any body differs, so an intended change shows up as a named
diff you have to acknowledge rather than a silent one.

## Structure check

Run whenever markup is touched. Must print 0. `BUILD.sh` runs the same check and
refuses to finish if either number is non-zero.

    python3 -c "
    import re;s=open('source.html',encoding='utf-8').read()
    d=0
    for m in re.finditer(r'<div\b|</div>',s): d+= 1 if m.group(0)=='<div' else -1
    print('div balance',d,'| em dashes',s.count(chr(8212)))"

## The copy walk

The voice gate in `.claude/skills/atuned-voice/check.py` reads the source, and
the owner reads the screen. A string built at run time, a figure held in a
table, or a title a stylesheet capitalises is not a literal in any file, so a
source sweep reported clean while the Field rail printed "Heaviest Root 0.0".

    NODE_PATH=/opt/node22/lib/node_modules node tools/copy-walk.js
    python3 tools/copy-verify.py COPY-VERIFY-strings.json

The walk loads the built page on a blank profile and on loaded ones, at 1600 and
at 390, opens every tab and presses every control once, hovers the carriers, and
collects every string a person can read: text, `title`, `aria-label`,
placeholders, `data-tip`, the one tooltip's panels, the status line, dialogs and
every table in the product. The verify step runs the gates in `check.py` and
`objections.json`, called and not copied, and four rules a source sweep cannot
carry because they depend on whether the profile is unread: a percent on an
unread profile or off zero, a bare number on an unread profile, a count against
a total at any scale, and a zero where a dash belongs. Nothing here is a typed
count. Run it after a change a person can see, and read `COPY-VERIFY.md`.
