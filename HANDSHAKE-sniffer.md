# Sniffer handshake · for any AI or person who touches the sniffer

Written 9 October 2026 from the owner's audit and a probe of `main` at `f28aa36`.
Read `REVIEW-sniffer-audit-2026-10-09.md` first. It says what is broken, what is in
alpha and what is not. This file says how to work.

## 1 · Read, in this order, before any change

1. `REVIEW-sniffer-audit-2026-10-09.md` (scope, rulings, order of work).
2. `SNIFFER_SPEC.md` section 11 (the guards) and section 10 (the output contract).
3. `DESIGN-sniffer.md`, the failure table in `TDD-sniffer.md`, and the groups in
   `tests/engine.js` named `11`, `32`, `33`, `34`, `36d` and `QZ`.
4. `CLAUDE.md` in the repository root. Its rules bind you.

## 2 · The twelve rules (from the audit, section 15, and this repository)

1. **One engine.** `atuned_src/engine/sniff.js` and `lexicon.js`. Never copy the
   algorithm into the funnel, the Worker or a second file.
2. **One parser.** `sniffStory` consumes `parseStory`. A change to `parseStory` is a
   change to every reader of it. List the readers and state what each does with the
   change (REVIEW section 6).
3. **One source per table.** Do not retype the 112 addresses, the 33 saboteurs, the
   21 laws, the axes or the poles. Read them from where they live.
4. **No mutation on sniff.** `sniffStory` and `scanStory` read. The commit owns
   `applyStory`.
5. **Unknown stays unknown.** Report `READ`, `PARTIAL`, `UNREAD` or `CONFLICT`. Never
   a zero standing in for "not looked at".
6. **Every reading carries its evidence.** The `because` list and the source span are
   never dropped in shaping.
7. **An explicit axis is not an explicit address.** Never print that a person said they
   carry an address when only the axis was named.
8. **The person is the authority.** Every consequential reading can be accepted,
   corrected, rejected or left open.
9. **Only a confirmed, eligible offer reaches the one Release Engine.**
10. **Only a verified release outcome is outcome evidence.**
11. **Never quote accuracy.** Closure and stability are not accuracy. The word
    "accurate" does not appear in anything you write.
12. **Do not touch the owner's canon.** The law divisor (E43), Joy, Surprise,
    Avoider versus Innocent, and the four missing canon files stay `CONFLICT` or
    `UNREAD`. Record what you found; do not decide it, and do not recreate a file
    from memory.

Repository rules that apply here as everywhere: never edit `source.html`,
`engine.js`, `atuned-packed.html`, `funnel/dist/` or `funnel/tokens.css` (edit
`atuned_src/`, then build); the engine is host free (no `document`, `window`,
`fetch`); MANIFEST decides load order; no em dashes anywhere; the count stated to
people is 112; sentence case; mechanical, precise, physical metaphors.

## 3 · The shape of every package

1. **Commit 1 is a failing test.** It fails for the right reason, on `main`'s code, and
   you show its output. A defect without a test that fails first is not closed.
2. **Commit 2 is the smallest change that makes it pass.** One concern per commit.
3. **The consumer sweep** (REVIEW section 6) is in the commit message or a
   `FOUND` list: each reader, what it does now, how you know.
4. **The measurement** (REVIEW section 5) for any change to what the parser returns.
   Print the numbers; do not summarise them.
5. **Wording.** Any sentence a person sees: load `atuned-voice` and `atuned-ux` first.
   List every new or changed string. Every term of art is explained beside it.
6. **Build, then gate.** Build with `./atuned_src/BUILD-engine.sh && ./atuned_src/BUILD.sh
   && ./funnel/BUILD-single.sh`. Run `node tests/engine.js` (read the counts off the
   run), the voice check, and the browser gates for the surfaces you touched, with the
   lock below. Do not run `functional.js` or `design.js`; CI runs the full suite on the
   pull request.
7. **Restore the built files before you commit:**
   `git checkout origin/main -- source.html engine.js atuned-packed.html funnel/dist funnel/tokens.css`.
8. **Never** skip, disable or quarantine a test. A test that must be red is `xf(...)`,
   which fails the day it goes green.

## 4 · Environment rules for parallel workers

- Work only inside your own worktree. Never `cd` into the main checkout.
- Browser gates share one lock and one temp directory per package:
  `export TMPDIR=/tmp/atuned-<package>; mkdir -p $TMPDIR;`
  `flock -o -w 900 /tmp/atuned-browser.lock node tests/<gate>.js`.
  `export NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
- No `git stash`, no `git config`, no `git gc`, no new worktrees. Scratch copies come
  from `git archive`.
- The sparse worktrees do not carry `proto/` or `mockups/`. Read what you need from the
  object store: `git show origin/main:proto/sniffer/before-after.js`.
- Disk is a fixed allowance. Delete your scratch when done.

## 5 · Traps that have already cost time

- **`LEXPROF` and `LEXSYN_NO`.** `'not okay'` and `'not ok'` are in `LEXSYN_NO`, and
  `'fucking'` breaks the starred-word gap test (`tests/engine.js`, about line 7180).
  Port `94d328e` by hand and adapt, do not cherry-pick blind.
- **Offsets.** A hit's `at` is an offset into the *normalised* copy (`normMap`), not the
  typed text. Use `marksOf` and `nm.map` to get back to the letters. Never slice the raw
  text with `at`.
- **Sentence and clause boundaries.** `clauseFloor` and `wordsOf` already know them. A
  comma is not a sentence end for negation. "I am not afraid. Afraid now." must not
  carry the first "not" across the full stop. Reuse; do not write a third reader.
- **Negation windows.** `SRC_NEG` and `SRC_NEG_W` (three words) live in `sourceai.js`.
  "can't stop crying" has a negator and is not a denial. Name such frames and test them.
- **Counts.** Do not type a count into a test, a comment or a document. Read it off the
  run. A hard-coded `loadP(8)` and "the twelve" above eleven items have both shipped.
- **Probe the probe.** Check any measuring script on a known good case before trusting a
  number it prints.

## 6 · What counts as done

- The failing test from commit 1 passes, and fails again if the fix is removed.
- `node tests/engine.js`: 0 failed, and the expected-red count is unchanged unless the
  package is meant to change it.
- The measurement shows no reading went up, and every reading that went down is a
  negated or third person hit.
- Every reader of what you changed is accounted for.
- Nothing half built, no TODO left in what you ship.
- If a part genuinely cannot be completed, say exactly what, why, and the smallest
  next step. Do not leave it silently partial.

## 7 · Report format

Plain short words, under 350 words, no em dashes, then:

- `FILES`: every file touched.
- `WORDS`: every user facing string added or changed, with its meaning.
- A table: `item | done y/n | note`.
- `EVIDENCE`: branch, head sha, the exact commands run, the exit codes, and the pass,
  fail and expected-red counts read off the run.
- `FOUND`: anything outside your scope, with the branch and sha, so the lead can queue
  it. Do not fix it.
- `GAPS`: what the sniffer still does not read after your change, in the status words of
  section 2, rule 5.
