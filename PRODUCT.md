# PRODUCT

The product brief. What the thing is, who it is for, how it works, what it
counts, what it costs, what it promises about a person's data, and what state
it is in.

Written 20 September on the owner's instruction that everything tweaked and
changed this session lands in the design brief and the product brief. Every
count in section 5 was read off `atuned_src/engine/data/` rather than copied
from another document. Every gate number in sections 8 and 10 was read off a
run on commit `656d3bd` with a dirty tree, `source.html` at md5
`5dd1c55117b31f29cc7e5af7a0bffb6a`. Nothing here is remembered.

The rulings live in `DECISIONS.md`. The accepted ones live in `BIBLE.md`. The
backlog is `TASKS.md`. This file does not rule anything. It states what has
been ruled, in one place, so a seat can read the product in one pass.

---

## 1. WHAT IT IS

Atüned is a somatic diagnostic instrument. A person tells it something true,
in their own words, and the engine reads charge out of that story: which of the
nine poled axes is carrying, at which of the 112 addresses, under which of the
21 laws of spiritual integrity. It then renders where that charge sits in the
body and what it costs, as a coherence quotient on a 0 to 100 scale, a load on
the seven seats, a pain map on a figure, and a named list of the patterns that
are running. It is one HTML file with no dependencies, no backend and no
accounts, and it holds the person's record in their own browser. The reading is
a description of what is running, never a verdict on who somebody is.

---

## 2. WHO IT IS FOR

The ICP is a person between 36 and 57 who is already working on themselves and
has run out of instruments. They are not in crisis and they are not new to the
material. They have output at stake, they can already describe their own
problem, and what they are missing is a measurement.

**The panel.** Six of the nine reference people in
`atuned_src/engine/data/people.js` carry `· ICP` in their role and are the
panel. Weights follow willingness to pay and ability to find the product, not
population size, and they total 1,000 of 1,000 simulated members with the three
edge cases.

| Who | Role | Weight of 1,000 |
|---|---|---|
| Diane, 46 | founder, second company | 180 |
| Derek, 39 | high performer, endurance | 170 |
| Marcus, 44 | creative director | 160 |
| Angela, 36 | seeker, six modalities | 150 |
| Sofia, 41 | somatic practitioner | 140 |
| James, 57 | C-suite, third turnaround | 100 |
| Ana, 47 | teacher, one year out. In it now | 50 |
| Gordon, 58 | managing partner. Refuses | 35 |
| Rosa, 61 | retired midwife. Nothing held | 15 |

**What the panel did with it.** 46 reactions were recorded across seven
questions: 10 of 46 would take the next step now, 15 of 46 would with a
condition named, 4 of 46 did not understand what was on offer, 12 of 46
understood it and pushed back, and 5 of 46 stopped and named the step.
Resistance, confusion and refusal together are 21 of 46, which is 46 percent.

**Two of nine never arrive, and they are the two ends.** Gordon carries the
most charge in the roster, four of the nine axes at 10.0 of 10 with nothing
installed, and he refuses the frame. Rosa carries the least and correctly has
no need. Softening the opening to reach Gordon loses Ana and Derek, so neither
is chased.

**The acquisition channel is a person carrying a number.** Five of the seven
who would arrive name a person rather than an advertisement: Sofia from her
clients, James from a peer, Angela from a group chat. The number is what
travels.

**Willingness to pay is not monotonic in the reading, and that is the
finding.** `BUYERS.md` records the owner's grid of ten states with a buying
probability against each. It peaks at the top three, 90, 95 and 100 percent at
Aligned, Coherent and Sovereign. It floors at 0 percent at Fragmented, where
buying the product means dismantling the identity the person survives on. It
collapses in the middle, 40 percent at Frustrated and 30 percent at Searching,
and those two bands are the largest population. The grid says why: at
Frustrated the physical work hurts, and at Searching it is not mystical enough.
So the product sells hardest to people already working, and the onboarding
cannot be written for the top of the grid.

**Modelled take.** Over the 10,000 member weighted segment model in
`PANEL-10k.md`, the 12, 29, 59, 99 ladder returned 6,066 payers of 10,000 and
an average of 10.28 a month across all 10,000. Simulated, an upper bound, and
it assumes everybody who can afford a rung buys one. The shape is the finding.
The decimals are placeholders.

---

## 3. THE CORE MECHANIC

Ruled by the owner and stated plainly for the first time at `TASKS.md` AE1:
journal into imprints into release is the core loop, the ritual system is
dynamic and works with all three, that loop is what earns points, and points
buy patterns for somebody who will not pay.

The cycle, with every step named and located.

**1. Journal. Built.** `ui/storyui.js`. A person types or records what
happened. Every keystroke runs the sniffer, `engine/sniff.js`. The microphone
is browser speech recognition, which is a network service, so the control says
so in one line before it opens and typing is the equal path.

**2. Imprints. Built.** `ui/imprints.js`. What the sniffer found gathers as
imprints and draws as ghosts before anything is committed, so a person sees
where the text is about to land. Nothing touches the field until they commit.
Committing writes charge onto the nine axes and is undoable.

**3. The reading. Built.** `engine/compute.js`. The chain compounds in order:
loose saboteurs, then complexes, then hyper complexes, then character. A
saboteur needs a weight of 3.7 of 10 to appear, a complex is two saboteurs in
one family, a hyper complex is two complexes in a family or one complex already
running at 6.5 of 10, and character is two hyper complexes at 5.6 of 10.

**4. Release. Built.** `ui/release.js`. A person picks addresses and the run is
planned before it starts, by `meterPlan` in `engine/schema.js`, because a
person is entitled to see what a run costs before they begin it. Four channels,
right limit, left limit, right truth, left truth. A run walks new ground only,
costs the minimum the selection needs, and caps at 25 patterns. The floor is 4,
which is one address across the four channels. Rerunning ground already open
costs nothing, forever.

**5. The meter. Built.** `meterRun` and `meterFirst` in `engine/schema.js`.
`lines` counts everything spoken including reruns. `unique` counts what was
opened for the first time, and it is the only one a tier charges for. `firsts`
records a dated fact about ground opened and never a statement about the
person. The cursor is read off the keys already held and never stored, because
a stored cursor and a stored key list are two answers to one question and they
drift.

**6. Ritual. Built, and it is dynamic.** `ui/ritual.js`. It reads the current
reading on every render. The seat carrying the most decides the track, the load
on DQ decides the tier, and the practice is selected out of
`engine/data/practice.js` rather than chosen by preference. Saving writes the
practice, the track, the seat and the minutes onto the profile.

**7. The record reads it back. Built.** `engine/ladder.js`. The streak runs
from the most recent day practised and is live while that day is today or
yesterday, so it does not break at midnight. The ledger reports minutes,
rituals, lines, ground, addresses currently clear and addresses currently
carrying. 16 marks are earned by test against the ledger, the streak and the
profile. No count is printed against a total anywhere.

**8. Points. NOT BUILT.** There is no points field on the profile, no balance,
no rate, and no conversion. `TASKS.md` AN4, points, badges, achievements and
the store, is open and untouched. Note the collision for whoever builds it:
`DESIGN-progression.md` section 2.2 currently rules that patterns are the only
currency and that no second unit exists. The owner's AE1 ruling introduces one.
His word governs and that document needs bringing current.

**9. Points buy patterns. NOT BUILT.** The route that exists today for a
person who will not pay is the free grant plus the referral, in section 6.

**10. Paying buys discounts, and later new tools, techniques and rendering
scripts for the avatar. NOT BUILT, and not specified.** The avatar is a drill
in `ui/drills.js`, not a surface.

**11. The accountability tracker. NOT BUILT.** Specified at
`reviews/SPEC-ritual-accountability.md`, 1,496 lines, unwired. It is `TASKS.md`
C1.

So the loop is closed from the journal to the record, and open at points. A
person can tell it something, see what is running, release it, build a ritual
out of it, and have the app remember that they did. Nothing yet converts that
work into the ability to do more of it without paying.

---

## 4. THE PROMISE

The owner's words, and they are the closest thing the project has to a
statement of what it is:

> You are a soul, this is the structure of your psyche, this is what it looks
> like, this is how it connects to the physical, these are the patterns that
> run through the physical. We are giving them the full inside out.

And the mechanism of the promise, which is a mirror a person can take apart:

> See yourself in layers, turned on and off. Click any chunk of the reading and
> open it. Heat maps, one per structure: saboteurs, complexes, hyper complexes,
> masks. Each its own map. A pain map you can select.

What that commits the product to, and where each part stands.

| The promise | State |
|---|---|
| Click a layer of yourself and open it | Built as drills. Every structure opens from the wheel, the fetters, the imprints and the analytics bubbles, and all four routes reach the same list |
| Turn layers on and off | Not built. `TASKS.md` AD1 |
| See which saboteurs are running you | Built. 33 in the library, scanned against the field, each with its parts named |
| The heat map, one per structure | Not built. `TASKS.md` AD2 |
| The pain map, selectable | Built on the body figure. Opens blank and is painted on. Anatomical precision to the chakras is open, `TASKS.md` R5 |
| The complexes and the hyper complexes | Built. Computed per person off the chain, six hyper complex families and their six coherent poles |
| The masks | Built. Six, one per developmental era, each lit by what sits under it |
| The structure of the psyche, connected to the physical | Built. Every one of the 112 addresses carries a named plexus or nerve and a location on the body |

Three rulings sit under the promise and no surface may soften them.
**Turning decades into months** is the claim, and it is a claim about
throughput and never about an outcome. **Without judgment**, which is why no
label in this product is ever about a whole person; a label may be blunt about
a pattern, because a pattern is a mechanism. **Regardless of our score**, which
settles that coherence is not a rank and that nobody at a low reading is
further from becoming a better person than anybody else.

The order of a reading is fixed. This is what is running. This is how these
patterns work. Given your story, this is how it is operating in you. This is
the behaviour you actually want. Your mind is holding these patterns, let us
release them. You can go to your imprints and select them from here.

---

## 5. WHAT IS COUNTED

Every count below was read off the data tables on this build. All nine are
correct as stated and none needed correcting.

| What | Count | Where | Verified |
|---|---|---|---|
| Nodes | 112 | `NODES`, `engine/data/nodes.js` | 112 entries |
| Poled child fetters | 9 | `CHILD`, `engine/data/canon.js` | 9 entries, each with a held state and a coherent opposite |
| Laws of spiritual integrity | 21 | `SI`, `engine/data/canon.js` | 21 entries, each seated at a band |
| Saboteurs | 33 | `SAB33`, `engine/data/canon.js` | 33 entries. 10 of the 33 are Shirzad Chamine's Positive Intelligence saboteurs and are marked so the source is credited |
| Domains | 19 | `DOMAINS`, `engine/data/canon.js` | 19 entries |
| Archetypes | 12 | `ARCH`, `engine/data/canon.js` | 12 entries, each with a behaviour and a seat |
| Masks | 6 | `MASKS`, `engine/data/canon.js` | 6 entries: Child, Preteen, Teen, Adult, Professional, Ideological |
| Seats | 7 | `BANDS`, `engine/data/canon.js` | 7 entries, Root to Crown. `SEATGLYPH` holds 8 keys, 7 seats and one fallback |
| Tiers of the scale | 10 | `TIERDEF`, `engine/data/canon.js` | 10 entries, ten points each, Mastery at 91 to 100 down to Collapsed at 0 to 10 |

**The count stated to users is 112.** Never 108, on any surface, in any copy,
ever. The breakdown below is internal arithmetic and no part of it is a figure
a person is shown. The 112 resolve as 108 named addresses across the seven
seats plus 4 field anchors, two above and two below:
Sol Star, Stellar Gateway, Earth Star, Gaia Gateway. Of the 108 named
addresses, 107 carry a charge and are therefore releasable. The one that does
not is `Root_08_Unnamed`, at the cauda equina, and it is the owner's open item.

**Two counts that look like contradictions and are not.** `ARCH18` in the same
file holds 18 rows, and it is a roll up of archetype name to primary saboteur
to seat used by the archetype drill, not a second archetype list. The archetype
count is 12. And the tiers in section 6 are plan rungs, which are a different
thing from the 10 tiers of the coherence scale; the word is overloaded in the
product's own vocabulary and the surfaces say band for the scale.

**The meter's key space.** A pattern is one thought line, at one address, by
way of one channel. 107 releasable addresses times 4 channels times 50 lines a
channel is 21,400 units of new ground in the whole product.

---

## 6. THE TIERS AND THE MONEY

**The ladder, as ruled 19 September.** 12, 24, 36, 99 a month.

| Rung | New ground a month | A week | Price a month | Sight |
|---|---|---|---|---|
| The gift | 100, once | | free | everything |
| Free | 10 a week, for life | 10 | free | everything |
| Tier one | 400 | 100 | 12 | everything |
| Tier two | 800 | 200 | 24 | everything |
| Tier three | 1,200 | 300 | 36 | everything |
| Tier four | 1,200 | 300 | 99 | everything, and the cohort lead suite |

**Why 12, 24, 36.** It holds the rate flat at 3.0 cents a pattern on all three
rungs: 12 over 400, 24 over 800 and 36 over 1,200 are each 3.0 cents. The
earlier 12, 29, 59 ladder ran 3.0, 3.6 and 4.9 cents, which charges more per
unit for buying more, and somebody will publish that division. The printable
rate was ruled worth more than the four percent revenue difference the model
gave the other ladder.

**Sight is not for sale.** Ruled. Every tier sees the whole reading, free
included: saboteurs, complexes, hyper complexes, character, the archetypes, the
pain map, every tool, the journal. What a tier buys is one thing, how much new
ground may be opened. This removed the one mechanic in the product that
withheld a person's own reading in order to sell it back, and it settles the
open item about tier three needing something of its own. Tier three does not
need one. Only volume moves.

**Tier four is the one rung with a price the owner set himself.** It carries
the same 1,200 a month as tier three, so patterns do not separate them at all.
What it buys is the cohort lead suite: manage profiles, build rituals, build
accountability for the people you lead. Against the panel's practitioner
segment 49 would earn half as much again as 99, and 99 is held anyway, because
that segment's figure is a personal willingness to pay and tier four carries
somebody's client book. A coach billing 150 an hour across twelve clients turns
over 7,200 a month and 99 is 1.4 percent of it. Instrument it from the first
paying practitioner and change it if the take rate says so.

**A release run is at most 25 patterns and at least 4.** So the gift of 100 is
exactly four runs at the cap. A rerun of ground already opened is free forever,
which is why what a tier buys is unique ground and never speaking.

**The route for somebody who will not pay.**

1. **The gift.** 100 patterns once, with everything visible. At one dollar a
   pattern, which is an internal unit and never a published price, that is a
   hundred dollars of work before deciding anything.
2. **The free tier.** 10 unique patterns a week, for life. It banks, because 10
   a week against a run of 25 is one run every 2.5 weeks, and an allowance
   below the smallest unit of the product is a countdown rather than an
   allowance. The surface says it is banking toward a run of 25 rather than
   printing a number that reads like a permission. Ruled at ten: "it is the
   free layer, so I do not want people just cashing in."
3. **Anything already opened may be rerun without limit and without cost.**
   New unique ground swaps against the set already held, and the swap is
   decided by weight. What a person marks heavy stays. What sits light drops
   off first.
4. **The referral is 50 patterns**, two full runs, capped at 4 a month against
   fraud. That is 200 a month at the cap. At 100 a referral, 4 invites a month
   would replace a tier one subscription and cannibalise the bottom rung. At 25
   it takes 16 invites and nobody feels a gift.
5. **Points earned by the loop. NOT BUILT.** This is the owner's route and it
   is the gap named in section 3.

**Where the money is, and where it is not.** Stripe never appears in the app.
No key, no script, no customer id, no subscription id, no card field. A gate
sweeps the whole build for `sk_`, `pk_`, `cus_`, `sub_` and card fields and
fails if one appears. The app reads a plan off the record and calls one host
function.

    the app           reads plan, answers what may be opened
    the record store  reads Stripe, writes the plan onto the record
    Stripe            holds the customer, the card, the subscription

Checkout in subscription mode for the purchase, the Customer Portal for
everything after, both hosted. The store writes five fields onto a record and
nothing else: `tier`, `status`, `granted`, `base`, `until`.

**Four rules in `engine/plan.js` that are not preferences.** What is in force,
not what is written, so a record saying tier three with a cancelled
subscription is free. An unknown status grants nothing, because a processor
will add one and an old build must read it as no. `past_due` keeps access,
because cutting somebody off over a bank's timing is a punishment. And spend is
never stored: it is the unique count against a baseline written when the period
rolls, because without the baseline the allowance subtracts a lifetime of
opened ground from one month's grant. A cancellation destroys nothing. The
record is the person's and the plan is one field on it.

**Open, and his.** Whether tier one is 400 a month or 100 a week, which is the
oldest open item on the ladder. Whether there is an annual plan and what
discount it carries, if any; two months free is ruled out, and the allowance
arrives monthly whatever the price, because a year of patterns handed over at
once is not a practice. Whether tier four's practitioner seat is per
practitioner or per client. Who owns the tax registration thresholds.

---

## 7. THE PRIVACY BOUNDARY

Non negotiable. The strongest ruling in `DECISIONS.md`, and every line below is
a mechanism rather than a policy sentence.

**The data is never sold. Ever.** The owner has worked in the field and knows
what a person's data is worth to somebody else. This is the promise the product
is built on, not a line to be softened later.

**The name never leaves the device, and a key replaces it.** Records are never
looked up by name. The key is what unlocks a record in an emergency or a police
matter, and the key is not held beside the name. A story is free text, so a
name can be inside a story; stripping named entities on device is the only
thing that holds and it will miss some, and that is named as open rather than
claimed as solved.

**The record is never held joined to the story.** The record identifies. The
story does not. A story with no person attached is training material. A story
with a person attached is somatic and psychological self report about a named
human and the product does not hold that.

**The record never carries a customer id, a subscription id, an email, a key, a
secret or a token.** The boundary refuses such a record outright, by name and
never by clamping, because holding an identifier the product does not need is
how a promise about a name gets broken. A billing system is exactly where the
joining happens by accident, so the store writes five fields and nothing else.

**A cohort lead never sees the story cloud.** What a lead sees is narrower than
what they own: the outputs, not the tools. Fetters, saboteurs, complexes, hyper
complexes and their analytics. Not the spiritual material and not the stories.
A snapshot. This supersedes an earlier line that had a practitioner seeing the
stories, and it tightens rather than loosens.

**A practitioner needs explicit consent, a visible list of who has sight, and
revocation.** Never a silent default. Either side may start it, the client
submitting to add or the practitioner submitting to add, and the person whose
data it is gives the consent. Access is by the person's key. A practitioner
panel sorted by coherence is a leaderboard with a licence, so group views sort
by what needs attention and never by who is ahead.

**Browser speech recognition is a network service, so the control says so
before it opens.** The audio reaches the browser vendor. The product does not
sell it and also does not control it, and a promise about data is only worth
what a person can check. One line, always visible, not a dialog. Typing is the
equal path.

**An email alone is never the key.** A record is unlocked by the key, and an
email address is not one.

**The product makes no outbound request at all today.** Google Fonts is gone,
because two requests on every load sent the person's IP to Google before they
had typed a word. Inter is embedded as base64, latin subset, 300 to 700 in one
file, 48 KB raw and 64 KB encoded. Gate 7 of the design gate watches the
network across four tabs and fails on any request that is not one of the two
local rasters, and it also asserts the typeface resolved, because a silent
fallback would have looked like a success.

**No spiritual APIs, and that is a property worth keeping.** The astrology, the
Chinese year, the gate wheel and the numerology are all computed host free in
`engine/astro.js`, `engine/birth.js` and `engine/numerology.js`. A free
ephemeris service would replace arithmetic the product already does with a
network call carrying a birth date, time and place, which is the most
identifying record in the profile.

**Records off device mean a controller exists.** Access, deletion and breach
obligations attach the moment the record store is built.

---

## 8. THE ENGINEERING POSTURE

**One file.** `source.html` is a build product and is never edited. It is built
from 55 entries in `atuned_src/MANIFEST`: 11 data modules, 19 engine modules,
21 renderers and 5 shell fragments, concatenated in an order that is load
bearing. Measured on this build: 1,297,487 bytes, div balance 0, no em dashes.

**No dependencies, and no network except one seam.** The app gains network at
exactly one place, fetching a record at sign in. Nothing else. That is the
property that lets the file run from wherever it lands, and it is why billing,
speech and every spiritual calculation are arranged the way they are.

**The engine is host free.** No `document`, `window`, `navigator`,
`localStorage`, `sessionStorage`, `requestAnimationFrame`, `alert`, `fetch`,
`XMLHttpRequest` or `new Image` anywhere in `atuned_src/engine/`. A host binds
storage with `bindStore(get,set)`. `atuned_src/hostfree.py` enforces it after
stripping comments and string literals, because a comment naming
`localStorage` is not a call to it. Measured on this build: host free, 310
exports.

**Validate at the boundary, and never lie about a failure.**
`validateProfile` is the boundary. A missing field is an older profile and is
filled from the blank. A field of the wrong type or out of range is refused by
name and never silently clamped, because a clamped 9999 reads as a 10 the
person never entered. `pImport` is atomic: nothing is pushed and the current
profile does not move until the incoming one has validated, loaded and saved.
Every write that can fail reports through `status()`, and a control never
claims success before it has it.

**Five gates, and they are the definition of done.** Measured on this build:

    node tests/engine.js        835 of 835 assertions, headless, no browser
    node tests/functional.js    720 of 740 on one run, 707 of 740 on another
    node tests/collide.js       100 of 100, no overlapping nameplates
    node tests/design.js         92 of 94
    node tools/monitor.js       every surface renders, and it logs

The functional gate's two runs disagree because it is being fixed as this is
written. Section 10 says what the cause is. The other four are stable.

The two build scripts run ahead of them. `./atuned_src/BUILD.sh` does the parse
checks, the div balance and the em dash sweep.
`./atuned_src/BUILD-engine.sh` builds the DOM free half and asserts the engine
is host free. Both pass on this build.

Read the count off the run, always. Four gates and one heading in this
repository have carried a number the product then grew past, and a number typed
into a document is the same defect as a number typed into a gate. The counts
above are dated to this commit for that reason.

**Reproduce a failure before fixing it, and re measure after.** Three probes in
this project have reported a defect that was the probe's own bug. A tool that
lies is worse than no tool, so a tool is checked against a known good case
first.

**Port, do not rebuild.** The arithmetic core keeps its bodies and signatures.

---

## 9. WHAT IS BUILT, WHAT IS NEXT, WHAT IS UNDECIDED

### What Is Built

- The instrument. The wheel with a resolving core, the body figure with the
  pain map, the imprints cloud, the analytics bubbles, the compass as two
  arrows with eleven masters seated on it, the knowledge base with twelve
  decks, the games.
- The reading. Coherence on a 0 to 100 scale across ten bands of ten points,
  the chain of saboteurs into complexes into hyper complexes into character,
  the six masks, the twelve archetypes, the nine poled axes, the seven seats,
  the 21 laws, the two axes of shape and control with all four corners
  reachable.
- The journal, the imprints, the release across four channels, the meter, the
  dynamic ritual builder, and the record that reads them back as a streak, a
  ledger and 16 marks.
- Undo and redo, unlimited, on the arrows. `engine/undo.js` with callers in
  `ui/panels.js`, `ui/release.js`, `ui/storyui.js` and `ui/ui.js`. Note that
  the `U1` line in `TASKS.md` section 2f still reads as open and is stale.
- The plan engine, host free, with no processor in it. What is in force rather
  than what is written, an unknown status granting nothing, and spend computed
  against a baseline rather than stored.
- The account area in six sections, help, the feedback instrument and the alpha
  questionnaire.
- Seven lightings, a tokened motion system of three curves and four durations,
  the awareness mark, and the typeface embedded so the product makes no
  outbound request.

### What Is Next

Pulled from `TASKS.md` section 0, the next block, in its current order.
Unchanged.

1. **N2. The avatar becomes a page.** A new surface. Set up the avatar, build
   the game plan, set the goals, information on the right, Summary a button
   underneath. It is also the release designer: what the avatar is set to
   becomes the ritual's priority order. Large.
2. **N3. The Summary is boring.** `ui/summary.js`. Ten passes, innovation and
   animation and art. Every named thing described as a behaviour, not a label.
   The centre column becomes text about you and everything energetic moves
   right. Large.
3. **N5. The five beats and the fade are in. The funnel is next.** Zero pages
   exist.
4. **N4. The copy editor pass on every number.** Standing. A number that does
   not say what it is out of does not print.

Behind that block sits the 20 September aesthetics and systems pass, `TASKS.md`
section 0b: the ethic in the design brief, ease for the eye, hierarchy top down
and inside out, nothing on screen that does not tell you something about the
person, symbolic colours for the ten bands, no good reading printing red,
layers on and off, the heat maps, and the ICP flow simulation.

### What Is Undecided, And Whose Call It Is

All of these are the owner's. A question reaches him only when the answer
changes what gets built, and each of these does.

| Open | What it changes |
|---|---|
| Tier one at 400 a month or 100 a week | The price list |
| Whether there is an annual plan and what discount it carries | The price list |
| Whether tier four's seat is per practitioner or per client | Tier four is a different product under each answer |
| Schema v2 | The cross compatibility contract with SOURCE |
| Which of the two nine gate rosters is canonical | The engine speaks whichever roster a sentence was written for, and a gate fails if they are merged |
| `Root_08_Unnamed` | Whether the releasable count is 107 or 108 of 112 |
| Whether the kink sits at the highest charge or the lowest | `parseStory().path` reports both ends and the code assumed highest |
| Whether the developer analytics view is a separate build or a tab stripped at build time | Whether it can leak into a person's build |
| Whether any of Source AI may leave the device | The whole network posture. The ruling on what it reads is settled; where it runs is not |
| Whether the band word Collapsed changes | Four meanings sit on one word and the band renders in the largest type on screen. Seized is the candidate |
| The compressed CQ mid range, domain weighting, the depth button names, the Matrix wiring | The reading |
| Whether the community is Discord, beehiiv, or both | Where the referral patterns attach |
| The opening surface, Summary or Field or Avatar | What a person meets first |
| The therapy equivalence claim, before the funnel ships | What the funnel may say |
| Whether push may add a second file | The one file rule |
| A seed decay policy | Whether a stated four letter type fades on its own or only moves when the person moves it |
| Cognitive load | Architectural, and it needs a decision before any code |

---

## 10. THE GRADE

The owner's framing: "this is taking it from a C plus to a B. This is very
important, because now it means we have a product." The wins from here are the
bigger ones, not more features.

What is holding it at C plus, worst first, measured rather than remembered.

**1. The funnel does not exist.** Zero pages. `TASKS.md` AO0. A product that
cannot be reached by a stranger has no acquisition path, and section 2 says the
channel is a referral carrying a number. There is nowhere for that number to
land.

**2. The developer end does not exist.** No server, no auth, no record store.
`TASKS.md` AS2, and it is the single biggest unwritten thing in the project.
Sign in, the plan, the cohort suite, Frequency, the two API keys and the
billing webhooks all sit behind it.

**3. The core loop does not pay out.** Points, badges and the store are
untouched. A person can do the work and the product will not convert it into
the ability to do more. That is the mechanic the owner has now stated as the
centre of the product.

**4. Two gates are not green on this build.** The design gate fails 2 of 94:
three instances of `.gl gl-t` set at 9.5px, under the 11px floor, and `.kb`
declared twice with both declarations setting padding. Both are small and both
are real. The functional gate returned 707 of 740 on one run and 720 of 740 on
the next, with every failure of the form "only N hit targets" at a given depth
plus one on the depth button at zoom 1. The two runs disagree, so that half is a
measurement and not a defect, and the cause is already identified: the Field
assembles on arrival, so for its first second the parts are on their way to
where they belong and a measurement taken then measures the animation.
`tests/functional.js` is dirty against `656d3bd` with exactly that wait being
added to it, so this count will move as soon as that lands and has to be read
off the run again then. A flaky gate is worse than a failing one, because it
teaches a team to ignore red.

**5. Nothing runs the gates automatically.** Five gates and two builds exist
and any commit can break all of them with none firing. `STABILITY.md` item 3,
and it is the cheapest item on the list and the one that protects every other.

**6. The renderers have thin headless coverage.** 21 renderers in
`atuned_src/ui/`, and `STABILITY.md` measured 5 of them referenced by the
headless gate. The rest are exercised only through the browser gates, which
check behaviour and layout rather than logic. Untested renderer branches are
how the wrong canvas got probed twice.

**7. Cognitive load is unresolved and architectural.** 57 to 71 simultaneous
choices per screen against a working memory of about four. It needs a decision
before any code.

**8. The two surfaces he has graded lowest are still open.** The Summary is
boring and its ten passes of innovation and art direction have not been run.
The diagnostic design has been rejected once and not rerun. The compass was a
D trending D plus and most of the eleventh note has now landed, which is where
the movement this round came from.

**9. Colour is not yet symbolic.** The ten bands do not carry colours that mean
their band, and a good reading can still print red. Those are the owner's own
two examples of what makes the product read as unfinished, and neither is hard.

**10. One measurement is still unproven.** The Field composites at about 100ms
a frame in this container and at 16.5ms with the translucent full viewport wash
hidden. This container has no GPU. One run on real hardware settles whether
that is a defect or an artifact, and it must not be optimised before that
measurement.

What is solid and will not be what breaks: the arithmetic, where 525
combinations across the declared parameter space produce no non finite value,
no division by zero and no clamp escape; engine coverage at 96.1 percent of
engine functions under the headless gate alone; the loop body at 2.56ms against
a 16.7ms budget; zero memory drift over twelve seconds of continuous animation;
every keyboard path clamping; and a build that `equiv.py` proves is a pure
concatenation.
