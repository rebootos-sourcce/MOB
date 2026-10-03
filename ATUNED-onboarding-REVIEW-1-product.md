# Onboarding and First Experience TDD, review 1 of 3: product and ideal customer

Reviewer 1 of 3, product lead and ICP lens. Written 1 October 2026 against
branch `claude/laughing-feynman-xhfyj3` at `b4b9e5c`. Documentation only: no
code was changed and nothing was pushed. The TDD under review is
`ATUNED-onboarding-first-experience-TDD.md`, read in full twice before this was
written, and then read against `PLAN.md`, `DECISIONS.md`,
`ATUNED-funnel-to-software-journey-TDD-v1.md`, `ATUNED-funnel-storyboard.md`,
`ATUNED-funnel-storyboards-focus-group-validated.md`,
`ATUNED-experience-icp-model.md`, `DESIGN-onboard.md`,
`DESIGN-onboarding-narrative.md`, `DESIGN-firstrun.md`,
`DESIGN-funnel-welcome.md`, `DESIGN-release.md`, `atuned_src/ui/onboard.js`,
`atuned_src/ui/tutorial.js`, and `funnel/` (`index.html`, `quiz.html`,
`questions.js`).

Every finding below is either read off a named file and function, read off a
named ruling and quoted, or measured, and the measured ones say what was
measured. Where the TDD does not say what should happen, this file lists the
gap as a question and does not fill it in. Every proposed resolution is marked
RECOMMENDATION and is not settled. Only the owner settles.

## Terms used in this file, explained once

- **TDD**: technical design document. "The TDD" means the Onboarding and First
  Experience document the owner uploaded.
- **ICP**: ideal customer profile. In this repository it means the six
  simulated people in `RESEARCH-icp.md`: Diane, Derek, Marcus, Angela, Sofia
  and James, plus three edge cases (Ana, Gordon, Rosa). Every quotation from
  them is simulated. Nobody real said it.
- **Level**: one of the ten rows of the buyer grid in `BUYERS.md`, from level 1
  (Fragmented) to level 10 (Sovereign). It says what state a person is in when
  they arrive.
- **Address**: one of the 112 places in the body the instrument reads charge at.
- **Fetter, saboteur, complex, hyper complex, character**: the chain of
  readings built up from one address. A fetter is the bottom rung and sits at
  one address.
- **Pattern**: the TDD uses this word three ways (see contradiction 11). In the
  engine one pattern is one sentence of a release (`DECISIONS.md`, "One pattern
  is one sentence").
- **New ground**: lines of the release the person has never opened before. Only
  these spend the allowance. Re-running opened lines costs nothing.
- **Meter**: the counter in `engine/schema.js` (`meterRun`, `meterPlan`) that
  keys every line by address and channel and counts the unique ones opened.
- **Sight by tier**: the owner's ruling that how far up the chain a person can
  look depends on their tier (`engine/plan.js`, `SIGHT`).
- **Gift**: the 100 patterns every new person gets once (`engine/plan.js`,
  `PLANS`, row `gift`).

## At a glance

- Of the 18 states in the TDD's journey (section 7), counted on 1 October at
  `b4b9e5c`: **4 are built** (rerun, tier selected, entitlement granted, new
  ground), **10 are partial**, **4 are missing** (encounter, select ground,
  verify, referral). Recount if the table in section (a) changes.
- **The first release does not happen inside onboarding or the Day One tutorial
  today.** The onboarding (`ui/onboard.js`) runs a breath exercise and stops.
  The tutorial (`ui/tutorial.js`) writes one entry and then describes a release
  without running one. A stranger reaches a release only by finding the Story
  tab on their own.
- **The TDD's own example sentence reads as nothing in the shipped sniffer.**
  Measured: "I keep taking care of everybody else." produces 0 hits and 0
  imprints in `engine.js`. So does the funnel storyboard's example ("My boss
  asked me to present the work and I immediately wanted to avoid it."). The
  Mirror screen the TDD describes cannot be filled for the TDD's own example.
  Detail in section (c).
- **Eleven places where the TDD contradicts a standing ruling or another
  document**, in section (b). The largest are: the account is asked for before
  the first release; the TDD says the reading is visible on every tier, which
  the owner reversed on 1 October; the "100 patterns relevant to the starting
  point" is a different object from the meter's 100; the release sentence in
  the TDD is not the sentence the owner ruled.
- **The "one decision" limit cannot be tested because the TDD never defines a
  decision.** Counted two ways in section (c): by the TDD's own screens the
  person makes at least two explicit choices, creates an account and types
  twice before the first release. The product today needs no system choices if
  defaults are accepted, but a stranger has no guide to the screen where the
  release lives.
- Five questions for the owner are in section (d). Smaller rulings, each with a
  recommendation, are in section (b).

---

# (a) The journey, state by state, mapped to what the product does today

Status words: **BUILT** means a person can do it today in the shipped file.
**PARTIAL** means part of it exists and the missing part is named. **MISSING**
means nothing in `atuned_src/` or `funnel/` does it. "Today" means the tree at
`b4b9e5c`. Where I rely on an older measurement I say so and give the date,
because this repository has been bitten by quoting stale counts.

## (a1) The 18 states of section 7

| # | State in the TDD | What the product does today | Status |
|---|---|---|---|
| 1 | LAND | `funnel/index.html` exists. It is a long explanatory page: a nav (What it reads, About, Tiers, The test), sections on the cause, the loop, the nine tools and the whole-system claim, and a "Take the test" button. It makes no request. This is the "documentation first" shape that TDD section 6 and funnel storyboard 01 rule out ("The first screen is an invitation, not documentation"). Inside the app the first thing a stranger meets is the boot overture, then the login door (`ui/login.js`, `loginOpen`). | PARTIAL |
| 2 | ENCOUNTER | The quiet field with "Something is running underneath the way you live" and one button "See what's running" does not exist in `funnel/`. `DESIGN-funnel-welcome.md` drafts slides for the screens after a name and email capture and marks them "NOT BUILT". The app's boot overture is real and measured at about 5.4 seconds (`RESEARCH-firstrun.md` section 2, 26 September), but it is the app's, not the funnel's. | MISSING |
| 3 | SELECT_GROUND | No starting-point picker exists in the funnel or the app. `PLAN.md` section C item 12: "Funnel: concern selection and the personalised 100 pattern gift (waits on the storyboard and the onboarding slices)." There is also no table that maps twelve starting points to addresses, charge axes or laws (the nine charge axes are Fear, Anger, Shame, Disgust, Apathy, Shock, Surprise, Anticipation and Sad in `engine/data/canon.js`; several of the TDD's twelve, for example Relationships, Money, Purpose, Burnout, Fatigue and Overwhelm, name a topic or a state and not one of those nine axes by their own words). | MISSING |
| 4 | STARTER_GIFT_ISSUED | The gift of 100 is built as a meter allowance: `engine/plan.js` `PLANS` row `gift` (`grant:100`), `GIFT_N`, `planAllowance` (spent first, "on every tier", `ui/plans.js` line 152), `meter.giftAt` in `engine/schema.js`, and "A new person gets 100 patterns, free" on `funnel/buy.html`. Missing: any link between the gift and a starting point; the message "Your first 100 patterns are ready"; the `StarterGift` object (`id`, `user_id`, `pattern_ids[]`, `transferred_at`, `status`); and any issuing before an account exists. The gift today is a counter on the device, not a list of 100. | PARTIAL |
| 5 | ACCOUNT_CREATED | Sign up and sign in are built against the server: `ui/auth.js` `authEnter('signup'\|'signin')`, the card in `ui/login.js` with "Create account", "Log in" and "Continue without an account". Missing: the funnel's state transferring into the account. The only funnel to app route today is a downloaded JSON record: `funnel/quiz.html` `viewDoor` ("Save my record", "Copy it instead"), loaded in the app through the Privacy section (`ui/panels.js` `recordImportHtml`, `recordImportWire`). That is the export and import route TDD sections 6 and 48 forbid. | PARTIAL |
| 6 | TUTORIAL_STARTED | Two separate flows exist. The onboarding (`ui/onboard.js`, 4 screens: welcome, what this is, signal test, what just happened) opens by default once per profile behind the login door (`ui/login.js` line 95, `DEV_PLAY_ONBOARDING=true`; `loginEnter` line 261; the older flag `OB_AUTO=false` in `onboard.js` line 46 is no longer read by that path). The Day One tutorial (`ui/tutorial.js`, 5 screens) is off by default (`DEV_PLAY_TUTORIAL=false`, `login.js` line 96) and is reachable from Settings by replay (`ui/account.js` lines 546 to 553). Neither is started by funnel state. Progress is not saved: `OB.step` and `TUT.step` live in memory, and only a yes or no flag is stored (`CURP.onboarded`, `CURP.tutorialSeen`), so a reload mid-flow restarts at the first screen. | PARTIAL |
| 7 | PATTERN_SELECTED | Automatic selection exists on the Story tab: `ui/storyui.js` `stRelModel` takes the picked bank items, else the found addresses, else the heaviest three, and pre-selects every ring (`ST_OFF` lets a person switch one off). It is not part of the tutorial: `tutorial.js` step 3 names one offer from `sniffStory().offer[0]` and describes it, but selects nothing and runs nothing. | PARTIAL |
| 8 | FIRST_RELEASE | The release itself is built and is large: `ui/release.js` (welcome lines `REL_WELCOME`, the run, the cool-down `relCoolDown`, the two-minute settle `REL_SETTLE_S=120`, voice, seat tone and haptics). What is missing for a first release as the TDD means it: (i) a short, linear release of about 10 patterns: the default dose is 100 a side (`RUN.dose:100`, `REL_DOSES=[25,50,100]`), and `DESIGN-release.md` question 5 records "Three addresses at the full dose is 16 minutes 41 seconds on the prototype's clock"; (ii) automatic configuration: the card before the run shows Run speed, Patterns, Time, the 25/50/100 picks, a New or Rerun pair and the voice, tone and buzz switches; (iii) the visual states HELD, CONTRACTED, RELEASING, OPENING, SETTLING, OBSERVING: the card shows the address ring falling (`relLive`, `relShade`) and a settle clock, nothing named as those six states; (iv) a path to it from the first session: onboarding and tutorial never reach a release (see state 7). `DESIGN-firstrun.md` section 0 proposed running one release as practice inside the opening. Its status line reads "a storyboard, not a build", and `onboard.js` is still the four-screen version. | PARTIAL |
| 9 | VERIFY | No "what changed" control exists. The release ends in the cool-down and a list of which saboteurs, complexes and hyper complexes the run reached (`relHits`, `relHitRows`). The five-way answer in the storyboards ("I feel different", "I see it differently", "Something moved", "Nothing changed", "I'm not sure") is not in `atuned_src/`. The Practice engine has Evidence and Outcome records (`engine/practice.js`, `PR_EVID_TYPE`, `OUTCOME_RECORDED`) but nothing connects a release to them. `PLAN.md` slice X2 ("how did that land") is not built. | MISSING |
| 10 | RERUN | Built, and ruled: `engine/schema.js` `meterRerunPlan`, `meterRerunOrder`; `ui/release.js` `relMode` (a New or Rerun pair), `relRerunSay`. A rerun costs nothing, is "a deliberate act rather than something that happens while somebody thinks they are opening something" (`DECISIONS.md`), and is available "forever". Gap: the TDD does not say when the first session offers the rerun, and the product does not offer it unprompted. | BUILT |
| 11 | FREE_PRACTICE | The arithmetic is built: Free is 10 a week and banks (`engine/plan.js` `PLANS` row `free`, `planWeeks`, `planAllowance`; the surface says "N banked, and 10 more arrive each week"). Missing: the transition message "Your starter gift is finished. Your Free practice continues." (journey TDD v1 section 9). I found no such string in `ui/`. The open owner item whether Free should be 25 a week, "exactly one run", is still open (`DECISIONS.md`, "The free tier could not complete a single release"). | PARTIAL |
| 12 | REFERRAL | No referral mechanism exists in the app: no invite, code or grant function in `ui/` or `engine/`. The only trace is copy, and that copy is stale: `funnel/buy.html` still says "Invite somebody and you get 50 patterns when they join, up to four invitations a month" although the owner ruled 25 on 1 October (`DECISIONS.md`, round OG). `DECISIONS.md` also records that "The referral cascade needs to know who sent whom, against the funnel's shipped promise of 'not an asset, not a list, not a segment'". | MISSING |
| 13 | NEW_GROUND_LIMIT | The engine knows: `planAllowance` returns `left:0`. The release card prints "Nothing left to open", removes the Begin button, and offers a button to the tiers page (`ui/release.js` line 1533, round NZ). Missing: the framing the TDD wants ("You've worked through this ground. There is more to explore.") and the `new_ground_limit_reached` event. | PARTIAL |
| 14 | TIER_SELECTED | Built: `ui/plans.js` (tiers page, `planLadder`, `planUpgrade`), the lock treatment (`ui/lock.js`), and `funnel/buy.html`, which `tests/funnel.js` reads against the `SIGHT` table. | BUILT |
| 15 | PAYMENT | Client side built: `ui/auth.js` `authPlanCheckout` posts to `/v1/billing/checkout`, prices 12, 29, 59, 99 in `PLAN_PRICE`. Not live: the Stripe setup waits on the owner (`STRIPE-SETUP.md`; `PLAN.md` section D), and `funnel/buy.html` says "Checkout is not open yet". | PARTIAL |
| 16 | ENTITLEMENT_GRANTED | Built on the client: `ui/auth.js` `authPlanTake` and `engine/plan.js` `planFromServer` read the plan back from `/v1/me` and open a new allowance. It cannot be exercised end to end until payment is live. | BUILT |
| 17 | NEW_GROUND | Built: `meterPlan` plans new lines only, `RUN_MAX=25` is the ceiling, `RUN_MIN=4` is the smallest run (one address across the four buckets). | BUILT |
| 18 | CONTINUED_PRACTICE | Partly built: the Ritual builder with its When row (`ui/ritual.js`), the Practice engine, the Daily Summary slices D1 to D7. Missing: a day-two return reminder (push waits on accounts, `PLAN.md` section E), the second and third release support the TDD names in section 41, and use-based reveal (section 42). | PARTIAL |

Counted: BUILT 4 (rows 10, 14, 16, 17), PARTIAL 10 (rows 1, 4, 5, 6, 7, 8, 11,
13, 15, 18), MISSING 4 (rows 2, 3, 9, 12). Total 18.

## (a2) The screens the TDD defines between those states

Section 7's list has no state for the feeling page, the story, the sniffer, the
mirror, the accuracy check, the adjustment, the somatic setup, the integrity
assessment, the archetype assessment or the handoff. Section 46 still tracks
events for all of them. So "every state must be recoverable" (section 7)
cannot be built against section 7, because the states in the middle are not in
it. That is a defect in the TDD, not in the product. The screens that exist in
the text, mapped:

| TDD section | What it asks for | What the product does today | Status |
|---|---|---|---|
| 11 Feeling page | "What are you feeling today?" then "How does that feeling run through you?" | Nothing like it. Closest: the Story tab's opener "Hello, Lance. What would you like to write about today?" and a rotating list of eight friend-voice questions (`ui/storyui.js`, `srcOpen`, `SRC_JOG`). The TDD does not say whether this page takes free text, chips or a scale. | MISSING |
| 12 Story intake, text and voice | Two equivalent modes. "Tell us what's off." | Text: yes, with live word highlight (`storyui.js`, the highlight layer). Voice: `stMic` uses the browser's speech recognition and refuses on a page opened from a file ("Recording needs a secure page"). The mic button's tooltip carries the disclosure: "Recording sends the audio to your browser's speech service; typing does not leave this device." Typing is the equal path today. The funnel's story step (`quiz.html` `viewStory`) is typed only and says "it is not saved". | PARTIAL |
| 13 Story sniffer: tag, snippet, quality, intensity, cause, body location, relationships | Seven fields, preserving the person's own words | `engine/sniff.js` `parseStory`, `sniffStory`, `marksOf` give five of the seven in some form: a tag (the fetter name; saboteur names are locked on Free), snippets (the marked words), quality (adjective hits), intensity (the charge amount), body location (the seat). **No field in the sniffer's output carries Cause / Experience or Relationships** (`sniffStory` returns `axes, saboteurs, laws, flow, gates, depth, offer, parsed, gaps`). Source AI (`engine/sourceai.js`) has nine dimensions it asks about (trigger, contact, feeling, body, prediction, behaviour, belief, meaning, goal) but it asks the person and reads the answer back, it does not compose a sentence of cause. | PARTIAL |
| 14 Story signal chain | Story, pattern, relationship, body, colour, icon, animation, release | Story, imprint, address, seat colour and release exist and are wired (Story tab lanes, ring, strip views; `stRelPanel`). Relationship is absent. | PARTIAL |
| 15 Mirror | One screen showing tag, snippet, quality, intensity, cause, body location, relationships, colour, visual pattern, animation | No single screen. Pieces: the Story tab panel after a commit, the funnel's `storyLit` cards, and Day One tutorial step 1 ("What this found": the quote, the seat, the fetter family, `tutorial.js` `tutRender`). The three trust states "YOU SAID, ATUNED NOTICED, LET'S TEST" from the focus-group storyboard are not in the build. | PARTIAL |
| 16 Dynamic body map | A map that responds to the signal | The Body tab opens on the Map layer, with the nervous system figure front and back ruled as the starting figure (`DECISIONS.md`, "The nervous system figure, front and back, is the body's starting figure"). It is a tab, not part of a mirror screen, and its motion vocabulary (density, contraction, pressure) does not exist as named animations. | PARTIAL |
| 17 Accuracy check | "Does this feel accurate?" with "That's it", "Not quite", "Adjust" | No confirm or reject control exists on the Story tab. Source AI asks follow-up questions; a person's rejection is not recorded as information. | MISSING |
| 18 Adjust | Text or voice correction, SOURCE OS reinterprets, back to the check | Not built. Editing the box re-reads live, which is the nearest thing, but nothing records that this was a correction. | MISSING |
| 19 Living story animation | The Field breathes, signals gather, settles into the Mirror state | Partial: the Story tab canvas (`stDraw`, `stDrawRing`, `stDrawStrip`) draws words and seats live. No "settle into the Mirror state". | PARTIAL |
| 20 Somatic setup | A distinct setup, "Welcome to a somatic experience. Turn your senses inward.", explicitly no required sensation | Onboarding's signal test (yes ten times, no ten times, at the throat, answer Yes, No or Nothing; `onboard.js` `obRender` step 2, comment: "Nothing is itself a real answer") is a somatic opener, but it runs before any story. The release's own welcome lines (`REL_WELCOME`: "Sit down. Put both feet on the floor.") run after Begin. Nothing runs between the Mirror and the release. | PARTIAL |
| 21 to 22 Mini release and release state | See state 8 | See state 8 | PARTIAL |
| 24 Post-release transition | Acknowledge any experience, FEEL and REFLECT | Nothing. | MISSING |
| 25 to 27 Integrity self assessment | 10 questions, one at a time, 0 to 10 | The Intake (`ui/intakeui.js`, `engine/intake.js`): 21 laws asked three ways, 63 questions, "Resumable, any order, nothing required", live partial CQ. The funnel test is 100 questions, four or five a law (`funnel/questions.js`, counted 100). Neither is 10 questions, and neither runs inside the tutorial. | PARTIAL |
| 28 to 30 Archetype assessment | Polar questions, a continuum or "Both" | The Avatar page has a 1 to 5 picker per archetype, "Hardly" to "Fully" (`ui/avatarui.js` line 1246), over 18 archetypes (`ARCH18` in `engine/data/canon.js`). No polar behaviour questions. The names differ: the TDD says Mage and Rebel; the product says Magician and Outlaw, and "Rebel or Outlaw" is an open owner item. | PARTIAL |
| 31 Avatar connection | Onboarding feeds the Avatar | The Avatar page exists and holds the "who I want to be" pair, tags and a closure figure. The Becoming document is audited in `BECOMING-AUDIT.md`; its first slices S1 to S4 are not built (`PLAN.md` section C item 8). | PARTIAL |
| 33 Handoff "YOU SAID" | A closing screen showing what just happened | Not built. The tutorial ends on a Flow card with "Go to Ritual" or "Done", and the opening surface is the Field (ruled 19 September). The storyboards hand to Discover. | MISSING |
| 40 Failure and recovery | Six release outcomes, each with a recovery | Not built; the names do not appear in code. `PLAN.md` slice X2. | MISSING |
| 42 Progressive disclosure | Reveal by use | Not built. Reveal today is by tier (locks), not by use. There is no achievements or points engine (`PLAN.md` section C item 11), so "achievement layer hidden" is true only because there is nothing to hide. | PARTIAL |
| 44 to 45 Screen schema | Every screen defines purpose, action, response, visual, data, next state, recovery | The TDD does not provide one filled-in record. Section 44 says "The implementation AI must not infer missing behavior" and then supplies the template but no screens. | Gap in TDD |
| 46 Events | 31 named events | Nothing exists. `PLAN.md` slice X3 keeps counters on the device and "never sent without a ruling". `engine/outbox.js` carries only four kinds (question, bug, rating, feedback) and refuses any other key by name. | MISSING |
| 47 Data integrity | Preserve story, signal versions, corrections, releases, answers, gift state, funnel state, tutorial state | Story entries are kept with undo (`stCommit`, `CURP.story.entries`). Funnel quiz answers persist locally (`atuned.quiz.v2`), but the funnel's story is deliberately not saved. Tutorial and onboarding progress are not saved. There are no signal versions or correction records. | PARTIAL |

---

# (b) Where the TDD contradicts a standing ruling or another document

Eleven findings. Each has the TDD's words, the ruling or document it meets,
and a RECOMMENDATION. A recommendation is the reviewer's, not the owner's.

## 1. "The reading is visible across tiers" against sight by tier

**TDD section 37:** "The reading is visible across tiers. Paid access buys
additional new ground and throughput. Core principle: **Sight is not for
sale.** **New ground is.** ... Do not hide the user's own reading behind a
paywall." Section 48 repeats it as a must-not: "Hide the user's reading behind
payment."

**Ruling, `DECISIONS.md`, "Sight by tier, round OK, 1 October. It reverses
'Sight is not for sale.'":** "Yeah, you see your own reading. However, the
tiers, the differences are: tier one can see saboteurs, tier two can see
saboteurs and complexes, tier three and four can see hyper complexes on. That
means that they can't see what's running them in the field or the body or how
the point cloud is expressed or the child masks. Those buttons would be grayed
out to them, with a little lock over it." The same file marks the old line:
"**Sight is not for sale.** REVERSED 1 October, round OK." It is implemented
in `engine/plan.js` `SIGHT`. The same ruling names this exact document family
as the conflict: "the conflict with `ATUNED-experience-icp-model.md` sections 7
and 8, which argue the reading stays visible across tiers ... his ruling
stands over it ... whether that document is rewritten to the ruling is his."
`ATUNED-funnel-to-software-journey-TDD-v1.md` section 11 carries the same
sentence ("every tier sees the whole reading").

**Where it bites in the first session.** Section 15 asks the Mirror to show a
"Story Tag", and the section 13 example tag is "Over-responsibility". Names at
that level are saboteurs in this product (the saboteur table is
`SAB33` in `engine/data/canon.js`), and Free and the gift see no saboteurs.
The current Day One tutorial avoids this by naming the fetter family (`n.cf`)
and the seat, which every tier sees. Also `DECISIONS.md` leaves open whether
the gift "still shows the chain for the length of the hundred, or whether free
is free from the first minute", and records that "a new person sees no
saboteurs until they pay" because `planSight` reads the plan only and not the
gift.

**RECOMMENDATION.** (1) Treat the TDD's sentence as superseded by the ruling
in every product string and in the TDD itself. A true replacement the owner
could accept is: "Your own reading at the level of the 112 addresses is on
every tier. How far up the chain you can look is part of a tier." (2) Specify
that the first-session Mirror names the pattern at fetter and address level,
which every tier sees. (3) Put the gift question to the owner (question 2 in
section (d)).

## 2. The loop is named twice, and the second is drawn as a list

**TDD section 1:** "The onboarding should establish the core ATUNED loop:
**Mirror → Test → Change**". **TDD section 34:** "The onboarding hands
directly into: DISCOVER, PLAY, FLOW, EMBODY", drawn as four lines with arrows
down and no return.

**Ruling, `CLAUDE.md`, "The loop, and the centre":** "**The process is
discover, play, flow, embody.** His words, corrected by him: the last one is
embody and not body." And: "**And it is a circle, never a list.** Ruled, with
his reason: 'we're showing a core game loop mechanic.' A numbered column of
four says the fourth one is the end, which is the opposite of a loop. Anywhere
the four appear together they close." `DESIGN-firstrun.md` section 0.1 records
the same ruling: "On every screen in the opening a station shows its own word
and nothing else as its name."

So two things: the TDD names a second loop, and section 34 draws the owner's
loop in the exact shape the ruling forbids. The word "mirror" is not itself a
problem. The owner's settled opening line is "This is a mirror."

**RECOMMENDATION.** Name the loop once, in the owner's words, and draw it as a
ring. Either drop "Mirror, Test, Change" or demote it to a description of the
three moves inside the first turn (the system reflects, the person tests, the
person works with it), never as a loop name and never next to the four. The
owner decides which; I am not choosing.

## 3. "Human figures not decorative" against the Aura point cloud, the Body map and the funnel storyboards

**TDD section 4:** "Do not use: Human figures as decorative elements."

**Against it, four places in the repository:**
- `TASKS.md` round OR, the owner: "The point cloud is a really fascinating
  because it doubles as the aura radiance. And so the point cloud is the mask
  ... For aura, I thought the person was animated. Oh, no, using a point
  cloud." The chosen mockup is a person drawn as points (`mockups/character-cloud/a-aura.html`,
  "The person is a lit volume of points").
- `DECISIONS.md`: "the nervous system, uh, front, back, that's fantastic, can
  you lock that in as our kind of starting." The Body tab opens on that figure.
- The app's onboarding and boot draw a standing figure of seven seats
  (`onboard.js` `obFigure`, "THE FIGURE, AT REST").
- Both funnel storyboards open on one: "A living human figure or field"
  (`ATUNED-funnel-storyboard.md` 01) and "Full screen living human figure. A
  subtle field moves through the body" (focus-group version, storyboard 01).

This is not a clean contradiction, because "decorative" is the operative word.
A figure where every mark is a measured address is an instrument. A figure as
an illustration is not. But the TDD does not say so, and a builder reading it
literally would remove the Body map.

**One more fact that limits the first session.** The point cloud (the
Compass's Registers view) is ruled at sight tier three, and the Character
masks are proposed at tier three (`SIGHT` rows `reg` and `mask`). The Aura, as
the owner described it, is the cloud as mask and radiance, so it cannot appear
in a Free first session as things stand.

**RECOMMENDATION.** Reword the TDD rule to "Human figures only where each mark
is a measured value; never as illustration." Use the Body map (fetter level,
every tier) for the first-session Mirror. Treat the Aura as a later reveal, not
a first-session element.

## 4. Ten integrity questions against the 21 laws, the 63, the 100 and the CQ ruling

**TDD section 26:** "There are 10 integrity questions ... The questions should
map to the established CQ100 integrity architecture." (CQ100 is not defined in
the TDD. I read it as CQ out of 100, the 21 laws summed to 100.)

**What it meets:**
- The 21 laws are the full measure: "**CQ is the 21 laws of integrity and
  nothing else.** Each law 0 to 10, and the 21 together sum to 100 percent"
  (`DECISIONS.md`, "One CQ"). Ten questions cover under half. The TDD's list of
  21 names matches `SI` in `engine/data/canon.js` as a set (checked), so there
  is no naming conflict.
- The funnel already has the answer to "what if someone stops early":
  `quiz.html` `serveOrder` "touches every law" in the first sweep, 21 answers,
  "which is what makes a reading available to somebody who stops early".
- `RESEARCH-icp.md` section 2 on the 63: "Cutting to 21 does not shorten the
  quiz, it deletes the instrument. One answer per law gives a mean with no
  spread, and the engine refuses to read a lean it cannot see." In code,
  `engine/intake.js` `iqScore` returns nothing for a law unless all three of
  its answers exist. The funnel scorer (`quiz.html` `scored`) does not need
  three, so ten single answers could ride the funnel's scoring.
- `DECISIONS.md`: "**Thirty is not a lot to ask and the objection is
  withdrawn.** It was costed as onboarding friction ... This is not
  onboarding. It is the instrument." And `CLAUDE.md`: "**Decided this round.**
  Strong default rather than a hard gate on the intake." The Intake's own
  header says "nothing required". The TDD puts the assessment inside the
  tutorial before the handoff, with no word on whether it can be skipped.
- Format: `CLAUDE.md` records the owner's wish, "You see a beggar on the
  street, do you walk over them or give them money? You see two kids fighting,
  do you choose sides or break it up? We kind of want to mix it up so that we
  can pin down where a person is." "Not built at `18238fe`." The TDD's
  "reflect on a real moment" is a third format.
- **Scale direction.** TDD: "10 = I operate this way consistently" (the virtue).
  `funnel/questions.js` asks how often the violation happens and inverts it
  ("never is ten, always is nought"). The Intake asks "how often do you [the
  virtue]". Answers from the three could be combined into one record, and two
  of them point the opposite way.
- **A population claim.** TDD: "Most people operate somewhere in the middle."
  The product's own onboarding line is "Nothing here is made up", and the
  owner's statement of the scale is "Four to six is oscillating, five is
  average" (`DECISIONS.md`, "One CQ"). The TDD's sentence is a claim about
  people the product holds no data on.

**RECOMMENDATION.** (1) Call the 10 a first reading of 10 laws, shown as a
partial CQ that builds up from nothing, which the owner already ruled ("I don't
want to do it the opposite, where it goes from 100 down, because that's
demoralizing"). (2) Make it skippable and resumable by default, with the rest
reachable from the Intake. (3) Replace the "most people" line with the owner's own band wording. (4) Pick the ten laws by seat so no seat dominates (see
question 5). (5) Ask the owner for the format ruling on dilemmas before
writing ten questions twice.

## 5. Tier 4 allowance, Free 10 a week, referral 25: checked

- **Tier 4.** TDD section 37: "Tier 4 has the same 1,200-pattern allowance as
  Tier 3 plus cohort-lead capability." This matches `DECISIONS.md` round OG
  ("Tier 4 includes the same 1,200 pattern allowance as Tier 3, plus cohort
  lead capability") and `PLAN_BY.four` in `engine/plan.js`. **No
  contradiction.** The prices the TDD lists (Free, 12, 29, 59, 99) also match
  `PLAN_PRICE`.
- **Free 10 a week, banking.** Section 35 matches `PLANS` row `free` and
  `planAllowance`. **No contradiction**, with one open owner item still
  attached: "whether free should be twenty five a week instead, which is
  exactly one run" (`DECISIONS.md`). One useful fact: a mini release of about
  10 patterns (section 21) is exactly one Free week.
- **Referral 25.** The number matches the latest ruling. Three things around it
  do not. (1) **Who receives it.** TDD section 36 says "Invite-a-friend
  behavior: **25 free patterns**" and does not say who gets them. The journey
  TDD v1 says "The invited person receives: **25 free patterns**". The
  economics in `DECISIONS.md` were built on the inviter earning ("At a hundred,
  four invites a month replaces a tier one subscription ... At twenty five it
  takes sixteen and nobody feels a gift"), and `funnel/buy.html` says "you get
  50 patterns when they join". (2) **The cap.** "The cap of four referrals a
  month was not discussed and is left as written until he says" (round OG).
  The TDD does not mention it. (3) **Stale copy on a live page:** `buy.html`
  still prints 50.

**RECOMMENDATION.** Keep 25. Record who receives it before building (see the
one-line rulings after section (d)). Send the 50 on `funnel/buy.html` to the
copy seat as a correction, because a number the owner has withdrawn is still
being shown to the public.

## 6. "One decision before first release" against what the funnel and the TDD ask

**TDD section 23:** "Maximum required decision count before first release:
**One.**"

The TDD never says what counts as a decision. Counted on the TDD's own path:
choose a starting point (section 9), create an account (section 7), answer the
feeling page (section 11), tell the story (section 12), answer "Does this feel
accurate?" with one of three (section 17), possibly adjust (section 18),
acknowledge the somatic setup (section 20). That is two explicit choices, one
account creation and two pieces of writing, before any release. Counted on
what exists today: see section (c). Today's funnel asks 100 questions
(`funnel/questions.js`) before a person is invited to write one story.

**RECOMMENDATION.** Ask the TDD to define a decision as "a choice among system
concepts: patterns, doses, settings, tiers". By that definition the starting
point and the accuracy check are answers about the person, not decisions about
the system, and the budget is zero system decisions before the first release.
State that a "Not quite" and an "Adjust" are inside the budget.

## 7. The release sentence is not the ruled sentence

**TDD section 21:** "The release language begins: **I am releasing believing,
thinking, feeling, behaving, acting.** Use this formulation consistently unless
the product owner changes it."

**Ruling, `DECISIONS.md` (ruled six, 26 September), the owner:** "believe, I'm
letting go of believing, perceiving, thinking, behaving, acting, feeling. Those
are the channels we're using." Built in `engine/data/cards.js` as
`C3_VERB=['believing','perceiving','thinking','behaving','acting','feeling']`
with the stem "I am letting go of". Differences: the verb ("releasing" against
"letting go"), the set (five against six: "perceiving" is missing from the
TDD), and the order (the TDD moves "feeling" to third; the ruling ends on it).
The book carries ten gates and a graduated entry: "Month 1: letting go of
believing only. Month 2: letting go of believing, thinking, and feeling. Month
3 and beyond: full ten-gate chain" (`DESIGN-release.md` section 1). And
`PLAN.md` section D lists as waiting on him: "the release wording ('letting
go' or 'release')", with the copy sweep second pass queued behind it (section C
item 14).

Changing the sentence does not change the meter's arithmetic (all six verbs are
one statement), but it changes the most-spoken line in the product.

**RECOMMENDATION.** Treat the TDD's line as a placeholder and do not copy it
into code. Put it in the one-line rulings after section (d). If the owner wants
a shorter first release, the book's own graduated entry is the existing
precedent.

## 8. The account comes before the first release, against the funnel storyboards and the buyer research

**TDD section 7** puts `ACCOUNT_CREATED` after `STARTER_GIFT_ISSUED` and before
`TUTORIAL_STARTED`, `PATTERN_SELECTED` and `FIRST_RELEASE`. Section 10: "When
the user creates an account, the funnel state transfers directly into the
account." The journey TDD v1 does the same (its acceptance criterion 4,
"Create an account without losing the gift", comes before criterion 5, "Enter
the tutorial with that gift").

**Against it:**
- `ATUNED-funnel-storyboards-focus-group-validated.md`, storyboard 14, comes
  after the change, the verification and the mirror: "**Keep what you found.**
  Create your account to continue." And the rule: "Never make the person repeat
  what they already gave ATUNED."
- `ATUNED-funnel-storyboard.md` section 15: "Do not interrupt the experience
  unnecessarily ... Not: **Create an account before you can do anything.**"
- The TDD's own principle, section 6, and section 23: "Do not optimize payment
  before optimizing first successful release."
- `RESEARCH-icp.md` (simulated panel): at the email step Diane ("Asked for an
  address mid workday with the payoff still one install away"), James ("Will
  not hand an address to a stranger to get a number he was already promised")
  and Sofia ("Will not route a client near a store whose retrieval rule she
  cannot see") walk. Its fix: "Show the score first."
- `CLAUDE.md` names the one allowed network seam: "fetching a record at sign
  in". That seam fits an account that arrives after the first value, with the
  person's story and signals held in the browser and carried across.

Today the order is different again: the app shows the login door first, with
"Continue without an account" beside it.

**RECOMMENDATION.** First release before the account. Show the gift as a
preview at the starting point and issue it when the account is created. Hold
the story, signals and release in the browser until then and carry them across
at sign in, which also removes the manual export and import. This is question 1
in section (d).

## 9. The funnel's privacy promise against section 47's persistence and section 46's events

**Funnel text, `quiz.html`:** "Nothing you answer leaves this browser. This
page makes no request of any kind." and, on the story step, "Nothing you write
leaves this browser, and it is not saved. Close the page and it is gone." **TDD
section 47:** "No user input should be silently discarded. Preserve: Original
story. Story Signal versions ..." and section 46 lists 31 events including
`funnel_started` and `payment_completed`, with a pre-account `FunnelActivation`
holding `session_id` and `source_event_ids[]`.

**Rulings it meets (`DECISIONS.md`):** "**We never sell anybody's data. Ever.**"
"The funnel record exists **only to hand back to the person**. It is not an
asset, not a list, not a segment." The story is "stored, for recovery, never
shared", and consent for any modelling use must be asked in plain words. And
`PLAN.md` section G: whether the experience metrics may ever leave the device
is still open.

**RECOMMENDATION.** Keep the first-session events on the device (the plan's
slice X3). Carry funnel state to the app in the browser, not through a server
session, so the "no request" promise stays true. If the owner wants the funnel
to keep a story across a closed tab, change that one line of copy to say it is
kept on this device. That is a ruling for the owner, not a default.

## 10. The Mirror's "cause" sentence against "no language model reads them"

**TDD section 13**, the example: "Cause / Experience: Fear that things will
fall apart if I don't handle them." And section 18: "SOURCE OS must
reinterpret the correction." Section 13 also says "preserve the user's actual
language wherever possible" and "Do not claim certainty when the system is
interpreting."

**What the product says about itself.** `DESIGN-funnel-welcome.md` (a draft,
not built) quotes the owner's dictation "This is not done through AI" and
narrows it to "The words you write are matched to the addresses by a table. No
language model reads them." The sniffer is a lexicon: `engine/sniff.js`, with
the stated rule "Precision over recall". A sentence of cause in the person's
situation is composed, not matched. Writing one needs either a table of
authored causes per pattern (content that does not exist) or a language model
(a second network seam, which `CLAUDE.md` allows only by the owner's ruling).

**RECOMMENDATION.** The mechanism that already exists keeps the person's
words: Source AI asks about prediction, belief and meaning, then quotes the
person's own answer back. The Mirror's cause line can be the person's quoted
answer, labelled as theirs under "YOU SAID", with the system's reading under
"ATUNED NOTICED". No language model needed. This is question 4 in section (d).

## 11. One word, three meanings: pattern, ground and bank

`CLAUDE.md`: "**One word per concept.**" The TDD breaks it three times.

- **Pattern.** TDD section 13 uses it for a named behaviour ("Over-
  responsibility"). Section 10 uses it as the unit of the allowance ("100
  patterns"). `DECISIONS.md`: "**One pattern is one sentence.** One release
  line delivered, over one address, through one channel."
- **Ground.** TDD section 9 uses `selected_ground` for the concern the person
  picks. `DECISIONS.md`: "**Unique ground is what a tier buys.** ... Only
  ground opened for the first time spends the gift or the tier." So the paywall
  line "You've worked through this ground" could mean a topic (anxiety) or lines
  opened anywhere, and the meter only measures the second.
- **Bank.** TDD section 10: "The starter gift becomes the user's actual
  pattern bank." `DECISIONS.md`: "**The bank is the imprints.** A person fills
  it." And section 35: unused Free patterns "bank" (accumulate).

**RECOMMENDATION.** Use the TDD's own heading, "starting point", for the
concern, so "ground" stays the meter's word. Keep "pattern" for the unit and
use the fetter or address name for the named behaviour. Keep "bank" for the
imprints and say "banks" only for the Free carry-over.

## Smaller items worth a line each

- The TDD writes the product name in capitals (ATUNED). The product's UI name
  is "Atüned" and `CLAUDE.md` rules no all caps UI copy. Probably a document
  habit. The copy seat should carry the TDD's strings across in sentence case.
- Two somatic openers exist. The owner ruled "The somatic opener, the signal
  test, should be on the onboarding" (`onboard.js`), and the TDD adds a
  "somatic setup" before the release (section 20). `DESIGN-onboard.md` section
  7 also rules the five to six minute observer test out of onboarding. The TDD
  does not say whether the signal test stays. RECOMMENDATION: keep the signal
  test as the person's first act and use section 20's "no required sensation"
  wording before the release, but do not run both as full exercises in one
  sitting. The owner decides.
- TDD section 25 supporting copy ("This isn't a test, and there isn't a good or
  bad number") sits next to a standing finding in `DESIGN-onboard.md` section
  3: the line "There is no right answer, and nothing at all is an answer" was
  struck because "Nothing on the screen had suggested there was a right
  answer." I ran the house checker (`check.py --line`) on the TDD lines and it
  raised no hard failure, so this is a ruling to apply and not a rate to
  measure. The copy seat should read it against that finding.
- "Tell us what's off." uses "us". The onboarding file records the owner's
  decision that the product is "a mirror, not a guide" and that "We walk you
  through you" was the one place it spoke as we. The owner's own narrative
  uses "Let's", so this is soft. Flagged for the copy seat only.

---

# (c) The first-success checklist

## (c1) Does the first session reach a first release with at most one decision?

**Short answer: not today, and not on the TDD's own screen list.**

**Counted on what exists today** (a new browser, no developer flags, tutorial
at its default off), from first paint to a release running:

1. Boot (about 5.4 seconds, measured 26 September).
2. The login door: one choice among "Log in", "Create account", "Continue
   without an account".
3. Onboarding screen 1: "Come in" (or "Not now").
4. Onboarding screen 2: "Try one thing".
5. Onboarding screen 3: do the exercise, then pick Yes, No or Nothing. The Next
   button is disabled until one is picked (`onboard.js`, "Pick one to go on.").
   That is a forced choice, though not a system concept.
6. Onboarding screen 4: "Go in".
7. The Field, with no instruction pointing at the journal. Measured 26
   September at 1600: 102 controls in view; at 390 no instruction in view and
   the doors 3,216 pixels down (`RESEARCH-firstrun.md` section 2). Those are
   dated numbers and need re-measuring on this build.
8. The person finds Discover, whose first page is the Story tab, and writes.
9. Commit.
10. "Run release" with the rings pre-selected and Run speed and Patterns left at
    their defaults. It presses Begin itself.

So a person who is guided has zero system decisions and about eight presses.
A stranger is not guided: the tutorial that would lead them to the journal is
off by default, and onboarding ends at the Field. The Day One tutorial, even
when switched on, ends before a release.

**Counted on the TDD's path:** starting point (a choice), account (email and
password, a decision with consequences), feeling (input), story (input),
accuracy (a choice of three), possibly an adjust (an input), setup
(acknowledge), release (read), then, before the handoff, ten integrity
questions and the archetype questions. By any definition of "decision" the
person makes at least two choices and creates an account before the first
release. The limit holds only if "decision" is defined as in contradiction 6.

## (c2) Checklist against the TDD's own first-success definition

The definition is in TDD section 23 and in `ATUNED-experience-icp-model.md`
section 2 (`FIRST_SUCCESS`). Met means a stranger meets it today without help.

| # | Criterion | Today | Met |
|---|---|---|---|
| 1 | At most one decision before the first release | Defaults need none, but the path to the release is unguided (see c1) | No |
| 2 | Pattern selection automatic | Yes on the Story tab (`stRelModel`, heaviest three, all rings on); not part of onboarding or tutorial | Partly |
| 3 | Release configuration automatic | The pre-run card shows speed, patterns, time, 25/50/100, New or Rerun, voice, tone, buzz | No |
| 4 | Advanced settings hidden | The release card and the Field show them from the first view | No |
| 5 | System vocabulary minimal | Onboarding says "body mind complex"; the tutorial says "fetter family", "Discover", "Release", "Flow" | No |
| 6 | Achievement layer hidden | There is no achievements engine, so nothing is shown | Yes, by absence |
| 7 | No paywall before value | The gift is spent first and no price appears until it is gone. But the sight locks (greyed, padlocked saboteur and hyper complex layers) show from the first minute because `planSight` ignores the gift | Partly |
| 8 | A first release actually happens | Not inside onboarding or the tutorial | No |
| 9 | "User understands what changed or what to do next" | No VERIFY. Ritual's When row exists but is not offered. `DESIGN-firstrun.md` section 0.4 drew an "embody: pick when" step, not built | No |
| 10 | No export or import between funnel and software | The funnel's door is a downloaded file loaded in the Privacy section | No |
| 11 | No silent loss of input | The funnel's story is deliberately dropped; onboarding and tutorial progress are not saved | No |
| 12 | The Mirror can be filled from a typical first story | Measured, below | No |

## (c3) A measured check: can the shipped sniffer fill the Mirror?

Method: I called `parseStory` and `scanStory` from the shipped `engine.js`
(`b4b9e5c`, built 1 October) on sentences in node. Read-only, nothing written.
Tool check: the engine returned a signal for sentences with an explicit feeling
or body word and nothing for sentences without one, which is consistent with the
repository's own note that "Four of his own example sentences measured nothing
here" (`ui/storyui.js` `stCommit`, comment 21.I1).

**The examples in the documents under review:**

| Sentence | Source | Hits | Imprints |
|---|---|---|---|
| "I keep taking care of everybody else." | TDD section 13 | 0 | 0 |
| "My boss asked me to present the work and I immediately wanted to avoid it." | funnel storyboard 03 | 0 | 0 |
| "I wanted to have the conversation, but I kept finding reasons not to." | focus-group storyboard 04 | 0 | 0 |
| "I keep putting off the conversation." | narrative section 3 | 0 | 0 |
| "I keep taking care of everybody else and I feel overwhelmed, afraid that things will fall apart if I do not handle them." | the TDD example with feeling words added | 4 | 8 |
| "My sister called again and I felt the old tightness in my chest. The same guilt, the same shame. I said yes when I meant no and then I was angry at myself all night." | `RESEARCH-firstrun.md`, Angela | 6 | 16 |

**One sentence per starting point**, written by me in a plain voice (a
reviewer's sample of 12, not a sample of people, so it shows direction and
nothing more):

| Starting point | Hits | Imprints |
|---|---|---|
| Anxiety ("I wake up anxious every morning and my chest is tight...") | 3 | 8 |
| Overwhelm ("I keep taking care of everybody else and there is no time left for me.") | 0 | 0 |
| Anger | 3 | 8 |
| Burnout | 2 | 5 |
| Fatigue ("I am tired in a way that sleep does not fix.") | 0 | 0 |
| Grief | 1 | 4 |
| Fear | 2 | 4 |
| Relationships ("My partner and I keep having the same argument and I shut down.") | 0 | 0 |
| Self-worth | 2 | 1 |
| Money ("Money stresses me out and I avoid opening the bills.") | 0 | 0 |
| Purpose | 1 | 4 |
| Something else ("Something is off and I cannot say what.") | 0 | 0 |

Seven of twelve produced a signal; five did not. TDD section 50 describes the
arriving person as someone "with something they cannot quite articulate", and
that is the person most likely to write a sentence with no feeling word in it.
The TDD wants a Mirror and then "Does this feel accurate?". With nothing found,
the Mirror has nothing to show. The TDD
states "Do not claim certainty when the system is interpreting" and the engine
rule is "unknown is a valid result", but no TDD screen is drawn for an empty
Mirror.

## (c4) Who arrives, in what state, with which concern

Sources: `RESEARCH-icp.md`, `RESEARCH-firstrun.md`, `BUYERS.md`,
`DESIGN-firstrun.md` section 0.7. All quotations are simulated. The panel
weights are the file's own, set by willingness to pay and ability to find the
product, not by population.

| Person | State on arrival | How they arrive | What they carry | What they need before they will continue |
|---|---|---|---|---|
| **Angela**, 36, seeker, level 5 (Searching: "Wants magic, not mechanics"), panel weight 150 | Has tried six modalities, hungry for a name for the thing | A group chat, on a phone at 390 wide | Guilt, shame, saying yes when she means no | Her own words lit back to her. Walks at the word "Incoherent" on a result page; would stop at the release if its lines "read as mechanical". Needs "Not quite" to work, because the TDD's mirror could be wrong about her. |
| **Derek**, 39, high performer, level 7 (Tuned), weight 170 | Pragmatic, reads everything as calibration | Desktop (walked at 1600) | A limiter he wants found | A diagnostic: numbers and why. "63 is nothing ... a pointless rep is the problem." His stop is the practice step if it reads as wellness. None of the TDD's twelve starting points names performance, so he picks "Something else", which the TDD does not define. |
| **Marcus**, 44, creative director, weight 160 | Skeptical, wants proof it is not a template | Desktop (walked at 1600) | Not recorded in the files read | A reading that is plainly about his sentence. "Around question 40 I will notice you are cycling the same twenty one things and I will feel handled." The Mirror's cause line is where he tests it: a generic sentence loses him. |
| **Diane**, 46, founder, weight 180 | Cannot stop (Anticipation 8, Apathy replaced 9.2) | Phone, between meetings | Overload, no end in sight | "Tell me fifteen minutes before I start, show me what is left ... and let me stop and come back." The TDD gives no durations anywhere. She walked at the email step. |
| **Sofia**, 41, somatic practitioner, level 8 (Aligned), weight 140 | Skilled, will test the method | Phone, eleven at night, interrupted | Her clients | Answers that stay hers, and being able to stop and resume. Her station is the embody step ("what to run and how long, and when"). She is also the referral source: the first run beside a client is her first session. |
| **James**, 57, C suite, level 3 (Defensive), weight 100 | Closed: "Advertising does not get me anywhere. A peer does." | A peer on a board, desktop | A number he was promised | "Fifteen minutes is a long time to spend proving something to software. I would give it four. ... Front load the finding." He walks at the email. |
| **Ana**, 47, teacher, edge case, weight 50 | In the middle of something, bottom bands | Anywhere | "I cannot see the far side of it" | A route that does not turn a hard moment harder. The product already has a clinician-referral line for low CQ (`ui/drills.js`). The TDD's section 20 asks a person to hold a pattern in awareness and notice the body, with no stop or safety path. That belongs to review 3 (narrative and safety). Flagged here because Grief, Fear and Anxiety are among the twelve starting points. |
| **Gordon** and **Rosa** | Refuses; no need | | | Not recoverable and correctly not the customer: "Do not chase him." |

**Who the ICP is, in one line.** People actively seeking change who will do an
ongoing practice, not consume information (`ATUNED-experience-icp-model.md`
section 11). By the buyer grid, the largest group sits at levels 4 and 5 and is
the hardest sell: "at 4 the work hurts, and at 5 it is not mystical enough"
(`BUYERS.md`). "The onboarding cannot be written for level 8."

**Pain-first labels.** TDD section 9 lists the starting points as pains
(Anxiety, Grief, Fear, Anger, Burnout). Gordon's simulated line is "Any ad that
opens with your pain is an ad for people who have pain." The finding recorded
is that softening the pain line loses Ana and Derek. The TDD's twelve are
entry conditions, not an ad, but the same trade applies to the picker: it
rewards people who name a pain and has no door for a person who arrives with a
goal.

## (c5) What each ICP needs at each TDD step, and where the person is likely to leave

Ranked by how much evidence sits behind the guess. The first is the strongest.

| Rank | Step | Why people leave here | Evidence | What would reduce it |
|---|---|---|---|---|
| 1 | Account before value (TDD section 7) | A request for an email while the payoff is still ahead | In the simulated panel, 3 of the 6 ICPs (Diane, James, Sofia, 420 of the six's 900 panel weight) walked at the email step in the funnel. The funnel step is the closest analogue, not the same screen. | Account after the first release (contradiction 8) |
| 2 | Starting point, then feeling page, then story: three prompts in a row | Each asks for effort with no stated duration and no visible remainder; the second and third ask nearly the same thing | `RESEARCH-icp.md` section 2: the breaking point "is 63 without a stated duration and a visible remainder". `RESEARCH-firstrun.md` 5.11: journaling neighbours answer a blank page with a question. The TDD never says whether the feeling page is free text. | State the effort once; fold the feeling prompt into the story prompt, or say what it adds |
| 3 | The Mirror, if empty or wrong | The person's own sentence produced nothing, or a name they would not use | Measured above: 5 of 12 one-line stories, and the TDD's own example, read as nothing. Angela walks at one word. Marcus leaves at a generic line. | A drawn empty-Mirror screen (a question, not a verdict), and "Not quite" with a defined next state |
| 4 | Somatic setup then the release | "Welcome to a somatic experience" can read as wellness; the release can read as a demo | Derek's stop is the practice step "if the chips read as wellness rather than scheduling"; Marcus's stop is the practice label (`DESIGN-firstrun.md` section 0.7) | Say what the act is physically; keep the line short; match the voice the owner ruled (mechanical, physical) |
| 5 | Ten integrity questions between the release and the handoff | The value moment has passed and a questionnaire arrives. TDD section 48 itself says "Turn the onboarding into a generic survey" must not happen. | In the simulated panel James would "give it four" minutes and wants the finding first, Marcus resists repetition ("I will feel handled"), Diane needs the remainder shown (`RESEARCH-icp.md` section 2); in the TDD the summary of what just happened ("YOU SAID...") is held back until after the assessments | Show the "YOU SAID" summary first; make the assessments skippable and resumable |
| 6 | Day two | No reason or means to return | `DESIGN-firstrun.md` section 0.2 and `RESEARCH-firstrun.md` 5.3 and 5.6: a concrete when and where raised Headspace app opens 7.5 percent (cited, not measured here). Push waits on accounts (`PLAN.md` section E). The TDD names "A reason to return" (section 38) and no mechanism | The Ritual When row at the end of the first session |
| 7 | Gift to Free | A mini release of about 10 patterns uses a tenth of the gift, so the gift outlasts the habit; Free is exactly one mini release a week | Arithmetic: 100 patterns, a run of about 10, Free at 10 a week (`engine/plan.js`) | State what the person is told when the gift ends ("Your starter gift is finished. Your Free practice continues.", journey TDD v1 section 9, not built) |

**Time.** The TDD has no durations. The nearest measurements are dated and
need re-measuring: 47 seconds of reading before the first act and about 69
seconds to the first capture in the four-screen onboarding at `ed4170e`
(`DESIGN-onboard.md` section 2.1, 20 September, copy has changed since), and a
proposed 3 to 4 minute opening against "under five minutes to first value"
cited from Amplitude (`DESIGN-firstrun.md` section 0.3, `RESEARCH-firstrun.md`
5.7, judgement and cited, not measured here).

## (c6) Gaps the TDD leaves to inference

Section 44 says "The implementation AI must not infer missing behavior."
These are the places where it would have to. None is filled in here.

1. What the feeling page takes (free text, chips, a scale) and whether it feeds
   the sniffer or only frames the story.
2. What "Something else" does: which gift, which first mirror.
3. What "Not quite" does next. Section 17 says rejection "is meaningful
   information" and gives it no state. Section 18 defines Adjust only.
4. What the person taps at VERIFY. Section 24 forbids an immediate score and
   section 46 names `post_release_observation`; no control is defined.
5. What the Mirror shows when the sniffer finds nothing.
6. How long the first session is, and what the person is told about it.
7. What PRACTICE is in WRITE, IDENTIFY, RELEASE, PRACTICE (section 23). No
   screen defines the practice.
8. Whether the integrity and archetype assessments are skippable, and what the
   handoff does if the person leaves in the middle.
9. What "approximately 10 relevant patterns" counts: lines of the release (the
   product's unit) or named patterns. The smallest run in the product is 4
   lines (`RUN_MIN`), so 10 is not a multiple; 8 or 12 would be.
10. What happens to the gift if the person never creates an account, and whether
    the gift is per person or per browser.
11. Where section 46's events go: the device or a server.
12. Which voice, tone and pace the first release uses, and whether it is spoken
    or read ("The user should read the release continuously").

---

# (d) What I need from you: the five questions that most change the plan

Framed for the person holding the vision. Each carries the thing it is about,
quoted. Where you may not have an answer yet, the ways it could go and what each
costs are written out. The recommendation under each is mine and is not
settled.

## Question 1. When should the person be asked to create an account: before the first release, or after it?

**The TDD says** (section 7, the order of the journey): "STARTER_GIFT_ISSUED,
ACCOUNT_CREATED, TUTORIAL_STARTED, PATTERN_SELECTED, FIRST_RELEASE".
**The earlier storyboard said** (focus-group storyboard 14, after the release
and the mirror): "**Keep what you found.** Create your account to continue."
And in the first storyboard: "Not: **Create an account before you can do
anything.**" **The simulated buyer research found** that Diane, James and
Sofia, three of the six ideal customers, walk at the request for an email
before they have seen anything.

Why it changes the plan: it reorders the whole build. Account first means the
funnel needs a server session to hold the gift. Account after means the story,
the signals and the release live in the browser first and are carried across at
sign in, which is the one network seam `CLAUDE.md` already allows.

Ways it could go:
- **A. Account first, as the TDD draws it.** Costs: a server-held anonymous
  session and gift (new work, and a promise change on the funnel's "Nothing
  you answer leaves this browser"), and the three walkers above.
- **B. Account after the first release, gift previewed first.** Costs: the
  gift is only promised until the account exists, so someone can take the
  first experience and leave. That is the point of a gift, but it needs your
  yes.
- **C. A person can never create one and carry on locally.** This is how the
  app works today ("Continue without an account"). Costs: nothing new, but the
  accounts product you called ("The fork is called") does not start.

RECOMMENDATION: B.

## Question 2. Does a brand new person see their whole reading during the gift, or only what their tier allows from the first minute?

**The gift line** (`DECISIONS.md`): "**The gift.** A new person gets 100
patterns, free, with everything visible. They explore the whole app until the
gift is spent. Then it reverts." **Your sight ruling of 1 October:** "tier one
can see saboteurs, tier two can see saboteurs and complexes, tier three and four
can see hyper complexes on ... Those buttons would be grayed out to them, with a
little lock over it." **The TDD says** (section 37) "The reading is visible
across tiers ... Do not hide the user's own reading behind a paywall." **The
current build** follows the sight rule alone: "a new person sees no saboteurs
until they pay", and the gift has no effect on what is locked.

Why it changes the plan: it decides what the very first Mirror may name, and
whether the first thing a new person sees on the Field is a row of padlocks.

Ways it could go:
- **A. Everything unlocked for the length of the gift.** Costs: one rule in
  `engine/plan.js` (the gift counts as a higher tier until it is spent), and a
  harder lock moment when the hundred runs out.
- **B. Free from the first minute.** Costs: padlocks on day one, and a Mirror
  that can name only fetters and addresses.
- **C. Locks stay, but the first session shows none.** Costs: a person sees
  something and then loses it.

RECOMMENDATION: A, so the tier ruling stands and the first session shows
everything the product can do.

## Question 3. Is the starter gift a counter of 100 or a hand-picked list of 100 for the person's starting point?

**The TDD says** (section 10): "The 100 patterns must be relevant to the
selected starting ground. Do not give the user a generic set. The starter gift
becomes the user's actual pattern bank." **The ruling and the build say**
(`DECISIONS.md`): "**One pattern is one sentence.**" "**The bank is the
imprints.** A person fills it." And your content chain (`CLAUDE.md`): "What a
person enters in the journal is added to the imprints. Part of that becomes a
story they have to release." In the build the gift is a counter: 100 new lines
opened anywhere, spent only on lines never opened before.

Why it changes the plan: a hand-picked list needs an authored map from the
twelve starting points to addresses and lines (several of the twelve, for example Relationships, Money, Purpose, Burnout,
Fatigue and Overwhelm, name a topic or a state and not one of the nine charge
axes) and a stored
list per person. A counter needs nothing new but the TDD's promise of
relevance is then met only by which lines the first story selects.

Ways it could go:
- **A. A counter, relevance comes from the story.** The starting point only
  frames the first prompt. Costs: the picker does not change what is in the gift.
- **B. A pre-selected list per starting point.** Costs: twelve authored lists,
  a gift object, and a rule for what "relevant" means for the four topic ones.
- **C. A counter, plus the starting point steers which addresses the first
  mini release draws from.** Costs: an authored map from twelve to addresses,
  but no stored list.

RECOMMENDATION: C, and rename the picker "starting point" so "ground" stays the
word for unopened lines.

## Question 4. Where does the Mirror's "cause" sentence come from?

**The TDD example** (section 13): "Cause / Experience: Fear that things will
fall apart if I don't handle them." and "SOURCE OS must reinterpret the
correction" (section 18). **What you dictated for the public page**
(`DESIGN-funnel-welcome.md`): "This is not done through AI". **How the sniffer
works** (`engine/sniff.js`): a table of words matched to addresses, with the
rule "Precision over recall". Measured: the sentence the TDD uses as its own
example, "I keep taking care of everybody else.", produces no reading at all.

Why it changes the plan: the Mirror is the moment the person decides whether to
trust the product, and the cause line is the part that could be a guess.

Ways it could go:
- **A. The person's own quoted answer.** Source AI already asks about
  prediction, belief and meaning, and the Mirror prints their answer under "YOU
  SAID", with the table's reading under "ATUNED NOTICED". Costs: one more
  question in the flow, and an empty line when they skip it.
- **B. Authored sentences per pattern.** A cause line written once for each
  pattern. Costs: authoring hundreds of lines, and a risk that a written line
  is wrong for this person.
- **C. A language model writes it.** Costs: a second network seam, a model
  provider, and the line "This is not done through AI" no longer being true.

RECOMMENDATION: A.

## Question 5. Are the integrity and archetype questions part of the first session, and if so, are they required and which ten laws?

**The TDD says** (sections 25 to 28): ten integrity questions, then archetype
questions, then the handoff, with the tutorial ending only after both ("By the
end of this sequence ... This should be enough to hand the user into the core
product"). **You ruled** (`CLAUDE.md`): "Strong default rather than a hard gate
on the intake." And: "**Thirty is not a lot to ask ... This is not onboarding.
It is the instrument.**" **The Intake's own rule:** "Resumable, any order,
nothing required." **Your example of the format** (`CLAUDE.md`): "You see a
beggar on the street, do you walk over them or give them money? ... We kind of
want to mix it up so that we can pin down where a person is." The 21 laws are
Truth, Transparency, Justice, Unity, Awareness, Nature, Presence, Humility,
Equanimity, Compassion, Forgiveness, Generosity, Aesthetic Beauty, Courage, Duty,
Responsibility, Accountability, Temperance, Detachment, Non-Harm and Patience.

Why it changes the plan: it decides whether the handoff waits on ten more
questions after the release, which is when the buyer research says patience
runs out, and which half of the laws the first CQ is built from.

Ways it could go:
- **A. Inside the tutorial, required.** Costs: a survey between the person's
  first win and the summary of it (TDD section 48 names this as a must-not).
- **B. Inside the tutorial, skippable, summary first.** Costs: some people skip
  and the avatar starts with less.
- **C. After the handoff, offered from the Intake.** Costs: the avatar starts
  nearly empty and the TDD's section 32 "initial model" is thinner.

And a second part: which ten of the 21. A seat-spread keeps one seat from
dominating, but seven seats leave three laws to place, and that is a pick for
you. And a third: your dilemma format, or the TDD's "real moment" wording, or
the funnel's "a thing that happened in a body" wording.

RECOMMENDATION: B, with the laws chosen one per seat plus three of your pick.

## One-line rulings I am not spending a question on

Each has a RECOMMENDATION in section (b). Answer in a sentence when you can.

- **The release sentence.** TDD: "I am releasing believing, thinking, feeling,
  behaving, acting." Yours: "I'm letting go of believing, perceiving,
  thinking, behaving, acting, feeling." Which one is the first release? (b7)
- **Who gets the 25 for a referral.** The inviter, the friend, or both? And does
  the cap of four a month stand? (b5)
- **The loop name.** One loop, discover, play, flow, embody, drawn as a ring,
  and "Mirror, Test, Change" dropped or demoted? (b2)
- **Figures.** "Human figures only where each mark is a measured value" as the
  rule? (b3)
- **What counts as a decision.** "A choice among system concepts", so that the
  starting point and the accuracy check do not count? (b6)
- **Two somatic openers.** Does the signal test stay as the first act, with the
  TDD's "no required sensation" wording before the release? (b, smaller items)

---

*Counts and measurements in this file were taken on 1 October 2026 at
`b4b9e5c`. The sniffer measurements used the committed `engine.js` and were
read-only. Older figures are labelled with their date and need re-measuring
before anyone quotes them.*
