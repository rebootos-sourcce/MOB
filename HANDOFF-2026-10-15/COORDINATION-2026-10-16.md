# Two threads, one repository: how the build thread and the look development thread stay out of each other's way

Written 16 October 2026 by the build thread, for the owner and for the look development thread (the "Atuned Emmy agent" thread). Neither thread can see the other. This file and the repository are the only shared channel.

## What is true right now

- `main` is what atuned.world serves. It is at the commit named by `git log -1 origin/main`. Every merge to `main` starts a deploy, and a deploy runs every gate.
- Merged today: the crisis button and the Contracted and "your energy" words (PR 86), the record-truth fixes (94), the gate coverage work (91), Emmy's files (89), the archetype percent engine (90).
- In flight, each on its own branch, each needing `main` merged in before it can land: tutorial journal step (PR 95), Discord feedback (PR 100), example profiles show only (PR 97), privacy and terms pages (PR 87).
- Not product code, no merge risk: gift bank candidates (PR 98), branch cleanup manifest (PR 99), the four achievements mockups (branch `claude/achievements-mockups`, under `mockups/achievements/`).
- Files the in-flight work touches, so look development should not edit them in the same hours: `atuned_src/ui/tutorial.js`, `ui/login.js`, `ui/storyui.js`, `ui/release.js`, `ui/account.js`, `ui/crisis.js`, `shell/head.html` near the onboarding stage, `engine/showonly.js`, `funnel/legal/*`, `functions/feedback.js`, `.github/workflows/deploy.yml`.

## The rules for any thread that changes the site

1. Work on a branch cut from the current `main`. Never push to `main`. A change reaches `main` only by a pull request that passes every check.
2. Edit `atuned_src/` and `funnel/` sources. Never edit `source.html`, `engine.js`, `atuned-packed.html` or `funnel/dist/*`: they are build products. After your last source change, run `./atuned_src/BUILD-engine.sh`, `./atuned_src/BUILD.sh` (it also packs) and `./funnel/BUILD-single.sh`, commit the products, and run `node tools/products.js`, which fails if they do not match the source. If another branch merged first, merge `main` into yours, regenerate the products from the merged sources (never resolve them by hand), commit and push again.
3. Read `CLAUDE.md` and `DECISIONS.md` first. No em dashes. Sentence case. Plain words, every term explained where it appears. Never say 108; the count is 112. A control never claims success it does not have.
4. A look change is a design change: run `node tests/design.js`, `tests/collide.js`, `tools/monitor.js` and `node tools/shots.js`, and look at the pictures at 1600 and 390 wide. The measured floors are in `.claude/skills/atuned-ux/SKILL.md`.
5. Look development that is not ready to ship goes in `mockups/<name>/` or `lookdev/`, which no gate reads and no deploy publishes.
6. Leave a note here, dated, in the section below, when you start something that touches shared files, so the other thread can read it.

## Notes from the look development thread

(Add dated notes here: what you are changing, which files, which branch, when you expect a pull request.)

## Notes from the build thread

- 16 October, evening: the next hours are a stabilization push. Merge order: 95, 100, 97, 87. After the last one, a full deploy and a build handed to the owner as a download with its stamp and md5. Please do not merge to `main` between those, and hold look changes to a branch until that build is out.
