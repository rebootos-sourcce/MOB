GRADE: 42/100

Yuki Brennan, systems director. Pass 1, current onboarding and tutorial. Read at HEAD `c4a829f`: `ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, `engine/schema.js`, `ui/storyui.js`, `ui/release.js`, `ui/auth.js`, the `.ob-*` and `.login-*` CSS (`shell/head.html` lines 6225 to 6385, 66 rules, 237 declarations, counted by script). Probed `engine.js` in node. Not run: any browser gate. A token is a named value such as `--panel` that every screen reads; a literal is the number typed in place.

| Criterion | /10 | Evidence |
|---|---|---|
| Component reuse | 4 | Reuses 2 shared parts (`.btn`, `.pm-eye`). Invents 10: card, wash, figure, grid, answer chip, dots, input row, suggest button, link button, dev drawer. |
| Colour tokens | 6 | 65 token reads, 10 literals. All 10 are tokens retyped: 7 are the seat colours as `rgba` (wash), 2 are near-blacks (`#06060a`, `rgba(6,6,8,.94)` against `--bg #0C0D12`), 1 is `#c0392b`, the fallback for `--hot`, which is defined nowhere. |
| Type scale | 2 | 19 sizes, 11 distinct (10 to 34 px), 0 through a variable. `.ob-need` ("Pick one to go on.") has no rule at all and prints at browser size, visible in `390-ob-2.png`. |
| Spacing and radius | 3 | 16 of 54 px spacings on the 4 px grid (30 percent). Card radius is `14px`, a value no token holds (`--r` 16, `--r-s` 11). Step 2 puts a pill button (999), rounded chips (11) and 8 px inputs in one row. |
| Motion | 4 | 2 literal durations. JS waits `OB_LEAVE_MS` 520 ms, CSS fades in `--t-element` 220 ms, so for 300 ms an invisible full-screen sheet still takes clicks (`.ob-leaving` sets no `pointer-events:none`). No reduced-motion rule on the fade or the card move. |
| State and persistence | 6 | Both flags are in the blank and the whitelist; measured: they round trip. Failure to save is reported (`obClose`, `tutClose`). But the boundary writes `!!v`: measured, `onboarded:'banana'` loads as true and `quiet:9999` is accepted, not refused by name. The whitelist is a second hand typed copy of the blank's keys, and it already drifted: `ui.chmask` (Character tab) is dropped at every load. |
| Data chain | 4 | See below. The default path captures nothing. |
| Recoverability | 4 | Draft lives in `TUT.text` (memory). Escape closes the tutorial, loses the words, and sets `tutorialSeen=true`. `role="dialog" aria-modal` with no focus trap. |
| Privacy structure | 5 | The sheets hold no personal data. But the door posts email and password before any value, has no age tick, no agreement tick, no recovery email, and shows "Developer options" (including "Unlock all sight") to every stranger. |
| Identity versus order | 4 | `OB.step` and `TUT.step` are bare integers compared by position (`OB.step===2&&!OB.felt`). Dots are a hard coded `[0,1,2,3]`. Reordering slides breaks these. Same bug class as the tab table. |

Dead code: `.ob-word*`, `OB_AUTO` (read nowhere), `.ob-b`. The prefix `.ob-` also names the feedback compose widgets (`.ob-a`, `.ob-qs` in `ui/account.js`): one prefix, two concepts.

## The data chain, hop by hop (what is stored, derived, in memory)

1. Boot creates the profile "You" (`ui.js:1636`). Stored. Fine.
2. Door. Sign in token is in `source.session`, outside the profile. Fine.
3. Slider today: four sheets, signal test. `OB.felt` (yes, no, nothing) is kept in memory and thrown away. Nothing reads it.
4. Starting point: does not exist. No ground field in the schema, no table of twelve.
5. First story: only the day one tutorial writes one, through the real `stCommit`. **The tutorial is not on the default path.** `DEV_PLAY_TUTORIAL=false` in `login.js`, so a stranger meets onboarding, which writes nothing, and lands on an unread Field. The chain from first story to first reading is never walked on a first run.
6. `stCommit` ends `pSave();pSnap();` (`storyui.js:412`) and ignores the answer, then prints "Committed." `relCoolDown` does the same (`release.js:876`). Both are still open from the earlier systems review. These are the two writes the first release stands on.
7. Reading is derived (`compute`, `r.unread`). Correct: never store it. The tutorial's `TUT.commit` is memory only; rebuild it from the stored entry with `sniffStory(text)`, do not store it.
8. Release: the run lives in `RUN` (memory) and commits once. A release closed halfway leaves no trace.
9. Account creation today is email plus password, at the door, before value. `authEnter` carries nothing across. The ruling (account after the first release, story and analytic data pass over, birth data stays) has no code. `DECISIONS.md` records that the account copy includes story text, so the old "record never held joined to the story" ruling is superseded for the account; the name still never leaves.

## The soul

The product's best data habit: a reading is derived, the person's own words are stored. The onboarding keeps nothing, so the first real data point arrives only if the person finds the Story tab.

## What breaks

- The first run has no write path. Fix is in the new flow, not in a patch.
- A new device with a signed-in account replays onboarding: the flag sits on the local profile.
- "Not now" and "done" both set `onboarded`. Skipped is derivable: `onboarded` with no ground.

## Recommendations for the NEW onboarding

**1. Derive the position, store no step. (M. Moves every ICP, most the returning phone arrival and the person in distress.)** Add one pure engine function `obAct(profile)` returning `open`, `ground`, `story`, `release`, `reading` or `done`, from stored facts: ground unset, `story.entries.length`, `meter.relLines`, `ui.onboarded`. A reload then resumes at the right act with no stored position. Storing a step beside facts that already imply it is two truths. The passive opening replays from slide one; the quiet skip covers it. Testable in `tests/engine.js`.

**2. Slider state shape. (M.)** In memory only: `{i, activeMs, reasons:Set}`. Paused when `reasons` is non-empty. Reasons: `hold`, `hidden` (tab in background), `focus`, `typing`, `user`, `sound`, `distress` (a free hook so the sniffer can stop the clock, since no permanent safety line is ruled). A single boolean loses which cause ended; hold then release would wrongly resume a hidden tab. Remaining time is derived: dwell minus `activeMs`. Run progress as a CSS animation and advance on `animationend`, pausing with `animation-play-state`, so there is no JS timer to drift. Dwell per passive slide: 1.2 s plus 0.28 s per word, floor 3 s, cap 7 s. At most five passive slides before the first action, about 20 s. Action slides (starting point, story, release) show no countdown; the clock stops there.

**3. One cue table, two clocks, never both. (M.)** Make `engine/data/opening.js` from `audio/atuned-opening-timing.json`: the same phrase starts drive slide changes. Voice on: the audio element's `currentTime` is the clock. Voice off: the timer reads the same table. Drawn text must be `confirmed:true` (all ten are `false` today: the file says its words are an offline guess), and a gate refuses an unconfirmed line on screen. One clip, two ranges: grounding 1.85 to 28.84 s for the slider, stem 29.89 to 49.67 s for the release screen that opens on his voice. Embed the 143 KB webm (about 191 KB as base64), not the 2.4 MB wav (about 3.2 MB, nearly doubling the 3.7 MB build). `play()` can reject; if the person pressed the speaker and it is blocked, say so through `status()`. Sound is per session, off by default; the door press is the gesture that lets it start. Reuse the word `voice`; add no second switch.

**4. Starting point and gift as additive profile fields. (S. Needs the owner's nod only if he wants a version bump; additive v2 needs none.)** `journey:{ground:'',handedAt:''}`. `ground` is a key in a 12 row `GROUNDS` table, refused by name: `journey.ground is not a ground this build knows: X`. `handedAt` is a date set only on the server's acknowledgement. Do not store the gift's remaining count, offered patterns, `OB.felt` or progress: derivable or unread. Add `chmask` to the whitelist and generate the whitelist from the blank's keys so the two lists cannot drift.

**5. Handover is a projection by allowlist. (M.)** The account push is built by naming what leaves (story entries, axes, meter, history, laws, intake), never by deleting what stays. Excluded: `who` whole (name parts and birth), `name`, `plan`, and `soul.roots` until technical confirms they are not derived from birth. Signup intent is carried from the door in memory only; the typed password and email are never stored before submit. Two phases, honestly reported: account created, then data pushed; if the push fails, say so and keep `handedAt` empty so it can retry. Agree the endpoint with technical.

**6. Boundary and writes. (S. Moves all.)** Refuse non-boolean `ui` flags by name (`ui.onboarded is not true or false`), do not coerce. Check `pSave()` in `stCommit` and `relCoolDown`; on failure say it, and keep the draft. Keep the draft in `STORE` per viewer until the commit lands. Escape on a slide with typed words asks first.

**7. Tokens, so the new look is one family. (S then M.)** Ship `--fs-1..8`, `--sp-1..8` (4 px grid), `--r-card` 16, and seat wash from the seat tokens, not retyped `rgba`. New prefix `.sl-`; reuse `.btn`, `.pm-eye`. Fix `OB_LEAVE_MS` to read `--t-element` and add `pointer-events:none` while leaving. Define `--hot`. Remove dead rules. Hide the developer drawer and `Skip` behind `?dev=1`. Reduced motion: crossfade only, and keep a visible pause control, which auto-advancing content needs for accessibility. Put `#login`, `#ob`, `#tutorial` behind one first-run shell and state machine.

Needs: art director (type and radius values), animation director (curves), narrative director (confirmed cue lines), QA (iOS seek test, and a gate that a first run writes one entry).
