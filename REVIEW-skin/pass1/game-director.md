GRADE: 48/100

Seat: game director (mechanics and stickiness). Pass 1, independent. Read from source at the tip commit 8df2ce2, the skin-shots set, and the mockups. Retention numbers are from my own model and from shipped games elsewhere. They are benchmarks, not promises.

Hard line, stated once because this review leans on it: this product reads a nervous system, so no variable reward, no loss framed streak, no timer, no near miss, no social pressure, no fear of missing out push. Nothing recommended below crosses it. Two recommendations sit close to it and are marked.

| Criterion | Score | Evidence |
|---|---|---|
| Loop shows as a circle | 5 | The bar is a row of four words (shots, top bar). Flow holds one tab (Ritual), Embody holds one (Knowledge). `engine/core.js` SECTIONS |
| First 90 seconds | 4 | Door, signal test, then a blank Field with four buttons. Commit ends on a status line and a sound. `ui/storyui.js` stCommit |
| Day 2 return trigger | 2 | No push, no in-file "today's page" seen in the shots. `engine/daily.js` header says no page yet |
| Day 7 | 5 | Streak halves and has a grace day. Ritual page is rich. Only works if a ritual was built on day 1 |
| Day 30 reason | 4 | Marks and a coherence graph exist. Nothing announces movement. No awards, no season |
| Progression is depth | 6 | 112 addresses, laws, summary prose are real depth. But sight is gated by money, not by understanding |
| Reward honesty | 9 | Sixteen fixed marks, no variable schedule, streak never resets to zero |
| Avatar drives return | 3 | The visible figure is locked at tier three. The open Avatar tab is a text form |
| Session shape | 5 | The twenty minute ring works. The sixty second visit has nothing to do |

Total 43 of 90, scaled to 48.

## The loop, traced

**First session.** Boot animation, then the login door every boot (`ui/login.js`), with "continue without account". Then four onboarding steps, once (the signal test, a breath exercise). Then the Field, blank. The right rail says "Nothing has been read yet. Four ways in." Four doors: write, read nine sentences, go year by year, say who you are becoming. Four choices at minute one. My rule is one.

The first act that matters is Commit. After it the person gets one line of status and a sound (`sfx('kept')`). The First story mark is earned and drawn nowhere they are looking. `ladderHtml` renders only on Compass and Ritual. My own pass nine measured this exact gap at 2.8 points of a thousand on day 30. It is still open.

**Day 2.** A person comes back only on their own memory. There is no notification (needs a server, ruled in scope, not built), no daily page on open, and the streak is the only hook, quiet and forgiving. Streak, Record and Marks sit at the bottom of the Compass rail ("0 days, last run", `1600-compass-loaded.png`), a page a day-2 person has no reason to visit.

**Day 7.** If they built a ritual, it works: rings per ritual, a month calendar, the Seven days mark. If they did not, nothing pulls them to build one. The Story's release panel on the Marcus example reads "Nothing is held above the line yet, so there is nothing to release" (`1600-story-loaded.png`). By my own measure 465 of 1000 people in the panel read like this. Marcus is 160 of them. The main Play action is shut to the largest group.

**Day 30.** The Thirty days mark needs thirty consecutive days. The coherence graph needs ten snapshots for its mark. Nothing says "your Heart held for a week". The designed Held and Moved awards (`DESIGN-gamification.md` section 6.2) are not in source: a grep of `atuned_src` for award, season, karma, stake and frame layer finds none.

## Hooks, in one line each

- Variable reward: absent, by rule. Correct.
- Investment: strong (entries, bank, vault, avatar pair, rituals), all on the device.
- Streak: halving with a grace day, honest, but hidden at the bottom of the Compass rail.
- Return trigger: missing. The in-file daily page has an engine and no page seen.
- Achievements: sixteen marks, no awards. The points engine does not exist. Ruled: points only rise.

## Does the avatar improving drive the person back?

Not yet. This is the biggest gap against the owner's own line that the avatar is the centrepiece.

- The Avatar tab (`1600-intake-loaded.png`) is a form: type who you release, type who you embody, press "Add to your avatar". Its cycle rings (First, Second, Third) and "Nothing to queue yet" sit empty on first view. It is an authoring page. It is not a character that changes.
- The Character tab is locked for the Marcus example: "Unlocked on tier three and above" (`1600-character-loaded.png`). The centrepiece is behind a paywall. Free people never see the thing the product says it is.
- The mockup that does what the owner means exists: `mockups/character-aura/shots/aura-1-states.png`. Load bends the figure, coherence lights it. That is a body that visibly gets better when something is released. It is the single best retention asset in the repository and it is not in the build.

## Stickiness grade

48 of 100. High on honesty (9), low on pull (2 to 4). Retention numbers, from my 27 September model on 1000 simulated people: day 30 baseline 9.8 percent, with the full designed set 20.7 percent. Today `node tools/loopsim.js --validate` passes 44 checks and fails 6, three because the ritual surface was rebuilt since the baseline and three because level pins drifted. Treat those figures as order of magnitude. Benchmarks from elsewhere: Finch day 1 is 54 percent, the category 25 to 26. Refusing loss framing cost 2.9 points of 1000 in that model. That is the price of the hard line, and it shrank as the honest design got better.

## The soul

A slow instrument, not a game. A person says a true sentence and a body responds. The reward is relief you can see, a figure that exhales when something is let go. Today that relief shows as a number and a ring.

## What breaks coherence, ranked

1. **The centrepiece is locked and drawn twice differently.** Avatar tab (form), Character tab (pixel grids), Field orb (number), and the unbuilt light figure. Four avatars, none persistent. 
2. **Dead ends in the loop.** A person with nothing above the release line hits an empty Release panel. Record says 0. Character says locked. Three dead ends in one visit on the example profile.
3. **The circle is a row.** Four words left to right with a divider, Flow and Embody one tab each. It reads as navigation, not as a turning loop.
4. **Commit pays a status line.** The strongest first act has the weakest feedback.
5. **Return trigger is absent.**
6. **A visible defect at 390.** The zoom buttons sit on top of the "not read yet" chip on the Field (`390-00-first-screen.png`).

## Skin recommendations (a skin can carry these)

| # | Recommendation | Effort | Moves |
|---|---|---|---|
| 1 | **One lit figure, on every tab.** A small version of the aura figure in the header or rail, reading cq and load. Bend for load, light for coherence. Free tier sees a fixed small version, the detailed version stays tier three | M | Marcus, Sofia, Diane |
| 2 | **A landing beat on Commit.** Imprints settle onto their seat lanes, the figure takes a breath, any earned mark draws as a ring. Under two seconds, no confetti, the same every time | S | Derek, Angela, all first sessions |
| 3 | **Marks as a tray.** Earned marks only, each a ring in its family colour. The next one is named, never counted against a total | S | Diane, Derek |
| 4 | **Empty states that name the one door.** "Nothing is held above the line yet" becomes the reading ("Your field is open. Write one more sentence, or hold a statement.") plus one button. Zero dead ends | S | Marcus, Angela |
| 5 | **Close the loop visually.** Four stations on one ring, an arc lit for where you last were, the next station named. Replaces the row of words | M | everyone |
| 6 | **A kind ending.** After a ritual is marked: "The day is on the record." The figure settles, the screen stops. Animal Crossing. No "come back tomorrow" | S | Diane, Ana |
| 7 | **One lock grammar.** A locked surface shows the person's own sealed silhouette and says what it would show. No countdown, no discount pressure | S | free tier |
| 8 | **Fix the 390 overlap.** | S | mobile |

Near the line, and why they pass: (a) the figure must never go dark. The mockup's coherence 10 state is nearly invisible. That reads as punishment. Floor it at a warm, dim, present figure and never dim it on a missed day, or it becomes a loss frame. (b) The return page must be in the file, shown on open. A push is allowed only at the time the person set for their own ritual, one a day, never a streak warning.

Mechanics that are not skin and need building: the sixty second floor version of the ritual (worth 1.8 points in my model), the Held and Moved awards (1.0), the stake sentence, and a daily page on open.

## Redesign candidates

- **The loop bar as a ring, with the figure at its centre.** A skin cannot do it because Flow and Embody are one tab each and the figure sits behind a tier gate. It is a placement change and a gating change. Gain: the owner's "core game loop mechanic" shown, not stated. This is the one redesign I would argue for.

## Risks

- The figure becomes a score. A person watches their light and judges themselves. Mitigation: no number on it, no comparison, light is relief and not rank.
- Showing the real figure to free people may weaken the tier-three sell. Test one sealed silhouette against none.
- The loop sim is stale. Re-baseline before quoting any retention figure to the owner.
