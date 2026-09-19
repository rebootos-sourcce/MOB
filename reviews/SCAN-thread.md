# Scan two, the thread itself

The owner asked for two scans. One is an independent audit of the record
files, run separately. This is the other: every ask made in this thread,
checked against the code rather than against memory.

Method: each item was grepped in `atuned_src/` before being given a status. An
ask listed as outstanding when it has already shipped is worse than one
missed, so anything not verified is marked as such rather than guessed.

## Not built, and the owner asked directly

| # | The ask | Evidence it is not there | Size |
|---|---|---|---|
| 1 | A Source AI window on the summary | no match for `Source AI`, `askSource`, `sai-` anywhere in `atuned_src/` | L |
| 2 | Tooltips on every number and every button | `title=` count is 0 in `map.js`, `mapshelf.js`, `knowledge.js`, `intakeui.js`, `games.js`. Present only in `drills.js` (9), `panels.js` (8), `component.js` (4) | M |
| 3 | The chakra image he supplied | no raster in the repo, no `chakra` reference in any `ui/` module | M |
| 4 | Lean, never explained. "I don't know what lean is" | no gloss, no tooltip, no drill for the term anywhere | S |
| 5 | A standalone release tab | `TABDEF` in `engine/core.js` has no release entry. The release lives inside Story | M |
| 6 | Three dramatically different intro variants | no `BOOT_VAR` or equivalent. One boot sequence only | M |
| 7 | A game development director on the team | was missing from `.claude/agents/`. **Created this round** | done |
| 8 | Onboarding and the tutorial | Block 11, nothing started | L |
| 9 | The intake redesign, Ultima style moral questions | Block 9, nothing started | L |
| 10 | The games themselves | Block 10. The tab exists, the games do not | L |
| 11 | The tools scrub | Block 7, nothing started | M |
| 12 | Field remainder: scale the wheel into the column, the travelling charge | Block 2, partial | M |

## Verified as built, so not outstanding

Several items still read as open in older notes and are not. Coherence is
defined in prose in `ui/ui.js:17` and `drills.js:150`. The eight qualities
paragraph the owner wanted off his screen is gone, and `cone.js:434` quotes it
only to record why it was removed. The record button exists in `storyui.js`
with the green and red states asked for. The masculine and feminine strip
renders with its symbols, its single line and its pill. Settings is a centre
panel at tab integer 9. The six lightings, the boot with its black bookends,
the summary plate, the story column split, the codex icons, the blank pain map
and the ladder have all landed and are in the git log with gate counts.

## The standing contradiction, still the owner's call

`CLAUDE.md` rules sentence case. `shell/head.html` carries a comment saying
headers take a capital on every word, also stated as ruled. Both cannot hold.
Only the two headline classes were taken off the capitalize list, because they
were printing "Every Part Of The System, Open" and title casing whatever
surname a person typed. Labels still take title case pending the ruling.
