# THE LAWS OF INTEGRITY, AND WHETHER THEY NEED A SYSTEM

## THE ANSWER

**Yes, and it is a small one.** Not because the feathers would draw the laws,
and not because integrity feeds CQ. Because the twenty one laws are already a
table with no owner, and the drift has already happened and already shipped:
`engine/intake.js:10` carries its own copy of the twenty one, that copy still
holds the two names the owner renamed away, and the consequence is that **six
of the sixty three intake questions currently read "how often do you justice?"
and "how often do you humility?"** That is not a hazard, it is a live defect in
the one surface whose whole job is to measure the laws, and it is in the build
at head. A second copy of the same table drifted, nothing caught it, and the
product asks a person a question that is not a sentence.

The system is four rules and one gate assertion. It is not an architecture, it
is about thirty lines of test and two small refactors, and it does not touch
`compute()`. The arithmetic is in better shape than the table: `bandIg()` is a
genuine single owner with nine call sites and no re-implementation. What needs
containing is the **table**, the **blank value**, and the **label**, in that
order.

The feathers do not change the answer. They raise the cost of getting it wrong,
because they would put a fourth drawing of the same twenty one on the one
surface that already has two, but the census below says yes without them.

---

## WHERE THE LAWS LIVE

Measured by reading every file, then checked by joining the tables against each
other in `proto/integrity/probe.js` and `probe-migration.js`, both of which run
in plain node against the built `engine.js`.

### The tables. Seven of them.

| # | Where | What it holds | Agrees with `SI`? |
|---|---|---|---|
| 1 | `atuned_src/engine/data/canon.js:215` | `SI`, twenty one entries of name, seat, icon | it **is** the table |
| 2 | `atuned_src/engine/data/canon.js:258` | `SINAMES`, `SI.map(l=>l.nm)` | derived, so always |
| 3 | `atuned_src/engine/data/kb.js:20` | `HARM`, seventy six harmonic elements, of which twenty one carry `a:'spirit'` and are by name the same twenty one | membership yes, 21 of 21. **order no** |
| 4 | `atuned_src/engine/intake.js:10` | `IQ_STEM`, twenty one behaviour phrases keyed by law name | **no. two names wrong** |
| 5 | `atuned_src/engine/schema.js:101` | `LAWWAS`, the rename migration, two entries | correct, and **unreachable** |
| 6 | `atuned_src/engine/data/people.js:91` | `LAWSET`, fifteen personas with per law overrides | yes, 0 dead keys today |
| 7 | `atuned_src/ui/personas.js:269` | `LAWSET.You={_:6.5}`, a sixteenth entry a renderer appends to an engine table | a value, not a name list |

**Table 4 is the defect.** `IQ_STEM` holds `Expression` and `Discernment` and
does not hold `Justice` or `Humility`. Measured:

    in IQ_STEM, not a law     Expression | Discernment
    a law, not in IQ_STEM     Justice | Humility

`iqList()` at `intake.js:22` builds each question as
`t.q.replace('STEM', IQ_STEM[l.nm] || l.nm.toLowerCase())`. The fallback is the
law name lower cased, so the six questions it produces are:

    When it costs you something, how often do you justice?
    When nobody would know, how often do you justice?
    On an ordinary day, how often do you justice without deciding to?
    When it costs you something, how often do you humility?
    When nobody would know, how often do you humility?
    On an ordinary day, how often do you humility without deciding to?

**Six of sixty three questions**, verified twice: once against the built
`engine.js` in node, and once inside a real Chromium driving `source.html`
through the page's own `iqList()`. The fallback is what hid it. Without the
`|| l.nm.toLowerCase()` the intake would have printed `undefined` and this
would have been found the day it landed.

**Table 5 says how it happened and is itself the second half of the failure.**
`schema.js:101` reads `var LAWWAS={Justice:'Expression', Humility:'Discernment'}`
with the comment "Expression and Discernment were the twenty one until the
owner ruled that Justice and Humility are." So the rename was carried into
`SI`, into `HARM`, and into a migration table. It was not carried into
`IQ_STEM`. Nothing else in the repository knows the rename happened:
`BOOK-ERRATA.md`, which exists for exactly this, does not mention Justice,
Humility, Expression or Discernment anywhere. And `people.js:87` still carries
a comment stating "There is no Humility among the 21", which is a fossil of the
pre rename state sitting three lines above a `LAWSET` that gives Marcus, Angela
and Lance a Humility score.

### The blank value. Three of it, and a fourth typing of one of them.

| Where | Value | Who reaches it |
|---|---|---|
| `engine/schema.js:76` | `LAW_DEFAULT=6` | `loadProfile()`, so every stored profile and every import |
| `engine/core.js:164` | `6`, typed again at module load | the state before any profile loads |
| `ui/personas.js:273` | `{_:5.5}`, the `lawsFor` fallback | any persona with no `LAWSET` entry |
| `ui/personas.js:269` | `LAWSET.You._ = 6.5` | **the blank profile the app opens on** |

The codebase already knows about two of the three. `schema.js:145` says "Two
callers seed an unmeasured law and they do not agree: this module uses 6 and
the persona loader uses 5.5." It does not know about 6.5, which is the one that
actually runs on arrival.

What the three are worth, computed on an otherwise empty field:

    all 21 laws at 5.5  ->  CQ 30.25, Ig 5.50, tier Corrupt
    all 21 laws at 6    ->  CQ 36.00, Ig 6.00, tier Incoherent
    all 21 laws at 6.5  ->  CQ 42.25, Ig 6.50, tier Oscillating

Three tiers for a person who has entered nothing, decided by which of four code
paths seeded the table. The tier word is correctly suppressed on `r.unread`, so
nobody is called Corrupt today. The CQ is not: measured in the browser on
`loadP(0)`, the blank profile reads **CQ 42.25, integrity 6.5, measured 0 of
21**, and the wheel draws twenty one full length law spokes and prints the pill
`21 laws · integrity 6.5` over them.

`DESIGN.md` law 5 says "never print a percentage off a default" and names three
sites where it was fixed. `ui/wheel.js:735` and `ui/wheel.js:744` are the fourth
and the fifth, and neither is gated on `r.unread`.

### The writers. Six of them.

| Where | Writes from | Blank value it uses |
|---|---|---|
| `engine/core.js:164` | module load | 6 |
| `engine/schema.js:108` | `p.laws`, in `loadProfile` | `LAW_DEFAULT`, 6 |
| `engine/intake.js:48` | `iqScore`, in `iqApply` | none, only writes what was answered |
| `engine/undo.js:70` | an undo snapshot | none |
| `ui/personas.js:404` | `LAWSET` or the profile's own `laws` | 5.5 or 6.5 |
| `ui/panels.js:58`, `:65` | the tools panel sliders | none |

Six writers, three blank values, no single entry point.

### The surfaces. Thirteen that draw or print the twenty one.

| Where | What it draws | Targets |
|---|---|---|
| `ui/wheel.js:735` | twenty one spokes on a ring, length is the law over ten | **21**, kind `law` |
| `ui/wheel.js:744` | the pill, `21 laws · integrity ` and `r.Ig` | none |
| `ui/wheel.js:313` | twenty one feathers inside the core, same quantity | **0** |
| `ui/analytics.js:160` | twenty one bars, each 0 to 10 | none, `title` only |
| `ui/knowledge.js:51` | the Laws deck, twenty one cards | deck rows |
| `ui/knowledge.js:80` | the harmonic deck, the same twenty one again by the `HARM` name join | deck rows |
| `ui/panels.js:51` | twenty one sliders | inputs |
| `ui/mapshelf.js:145` | the laws seated at one seat, as chips | none |
| `ui/cone.js:363` | the three highest and three lowest, as arrows | none |
| `ui/drills.js:66` | `runLawDrill`, one law's reading | the drill |
| `ui/intakeui.js:219` | the intake accordion, grouped by seat | buttons |
| `ui/ui.js:50` | the wheel tooltip line for a law | hover |
| `ui/summary.js:258` | the single furthest shut law, `r.weakL` | none |

**The twenty one are drawn twice on the Field already.** Independently
confirmed in a real Chromium: `HIT` on the Field carries `law: 21` at every
zoom and every depth I sampled, and `core: 1`. Thirty one core mark tips probed
with the product's own `hitTest` at zoom 1.6, 2.5, 3.6 and 4.6 returned
**`core` 31 times out of 31**, including at the two zooms where the law feather
layer is actually on screen. `DESIGN-feathers.md` makes both claims and both are
the product's, not that document's.

`ui/intakeui.js:73` also carries `IQ_SEATS`, a second seat order running Crown
down to Root, where `canon.js:66` runs `BANDS` Root up to Crown. Not a law
table, but it is the grouping the laws are shown in, and it is a second copy of
an ordering.

---

## THE ARITHMETIC CHAIN

Traced by reading, then driven. `proto/integrity/probe.js` seeds the field the
way `ui/personas.js` `loadP()` does on the engine side and reads every path. Its
three checks, run before anything else and all passing, are: twenty one laws and
the full address set present; `compute()` deterministic on Diane; and the
engine's own stated case at `compute.js:148`, that a blank field with all laws
at the default 6 comes out CQ 36. It comes out 36.00.

### The chain, as it actually runs

    S.law[nm]                       21 values, 0 to 10
      |
      +-- mean / 21 ------------->  + poleMean*0.30 - JQ*0.42, clamp 0..10  =  Ig
      |                              engine/compute.js:124
      |
      +-- bandIg(b) ------------->  mean of the laws at seat b
      |   engine/core.js:197        the one owner. nine call sites. no copy.
      |     |
      |     +-- mean over 7 ----->  + poleMean*0.22 - JQ*0.30, clamp 0..10  =  It
      |     |                        engine/compute.js:125
      |     +-- compute.js:50 ---->  relief, which scales n.held and n.rep
      |     +-- expression.js:7 -->  exprFill, which feeds accuracy
      |     +-- mapshelf.js:142 -->  printed per seat as "integrity"
      |     +-- drills.js:441,476,668,872 and cone.js:206 -> the avatar gap
      |
      +-- Ig x It / Rz ---------->  CQ           engine/compute.js:140
      |
      +-- min over 21 ----------->  r.weakL      engine/compute.js:203
      |
      +-- count of p.laws ------->  accuracy cov engine/compute.js:300

### Is it one chain or several? One chain, typed twice.

`bandIg()` is the good case and should be the model for the fix. One
declaration, nine callers, not one of them re-derives it.

`Ig`, `It` and `CQ` are each written out twice. The second copy is inside
`cqCeiling()` at `engine/compute.js:263` to `:276`:

| | live | the copy |
|---|---|---|
| `Ig` | `:124` | `:273` |
| `It` | `:125` | `:274` |
| `Rz` | `:138` | `:275` |
| `CQ` | `:140` | `:276` |

The copy exists for a good reason, stated in the comment at `:255`: the ceiling
is what CQ would be with charge at zero, and it is computed rather than
simulated so nothing is mutated. The reason is sound. The duplication is the
cost, and it was not paid down.

**They agree today.** Measured with charge and replacement both at zero, where
the two have identical inputs by construction: law means of 1, 3, 6, 6.5, 8 and
10 all return the same number from both, **6 of 6 exactly**. So there is no live
disagreement here and I am not going to claim one.

**What the duplication costs is measurable, and I measured it rather than
asserting it.** `proto/integrity/probe-twocopies.js` loads the engine source
twice in memory, edits one coefficient in the live `Ig` only, changing
`poleMean*0.30` to `poleMean*0.34`, which is the size of tuning change this file
records having made before. Nothing on disk is touched. With the nine axes held
at 2 and the coherent opposite installed at 6:

| law mean | headroom before | headroom after | moved |
|---|---|---|---|
| 3 | 2.227 | 1.657 | -0.570 |
| 5 | 3.048 | 2.062 | -0.986 |
| 7 | 3.648 | 2.175 | **-1.473** |

Headroom is `cqCeiling() - CQ`. Two surfaces print it as a sentence a person
acts on. `ui/release.js:177` prints "Release has about 1.2 left to give you" and
switches to a different sentence below a threshold of **1.5**, and the drift
above is of the same order as that threshold. `ui/summary.js:581` prints the
same number in the "what moves the reading now" card.

**And no gate can see it.** `cqCeiling` and `cqHeadroom` are not in
`atuned_src/engine/export.js`, so `module.exports` does not carry them and
`tests/engine.js` cannot call either one. The probe had to run the engine source
in a function scope to reach them at all. The second copy of the product's
central formula is the one piece of engine arithmetic with no headless coverage.

### Three numbers on screen, all called integrity

| | what it is | where |
|---|---|---|
| A | `r.Ig`, the law mean plus the pole and overshoot terms, clamped | `compute.js:124` |
| B | the plain mean of the twenty one | what every renderer draws |
| C | the mean of the seven `bandIg`, unweighted | `compute.js:125`, and printed per seat at `mapshelf.js:142` |

Read off the running page across the eleven profiles the product ships:

| profile | A, `r.Ig` | B, mean of 21 | C, mean of 7 seats | A minus B | CQ |
|---|---|---|---|---|---|
| blank | 6.500 | 6.500 | 6.500 | 0.000 | 42.25 |
| Gordon | 1.933 | 1.933 | 1.933 | 0.000 | 1.00 |
| Tomas | 3.081 | 3.081 | 3.089 | 0.000 | 2.89 |
| James | 4.306 | 4.367 | 4.368 | -0.061 | 12.79 |
| Diane | 5.945 | 5.943 | **5.657** | +0.002 | 28.65 |
| Marcus | 6.232 | 6.210 | 6.267 | +0.022 | 39.17 |
| Sofia | 7.710 | 7.319 | 7.121 | +0.391 | 57.18 |
| Wren | 9.850 | 9.114 | 9.143 | +0.736 | 91.68 |
| Abraham | 10.000 | 8.914 | 8.931 | **+1.086** | 98.26 |
| Lance | 9.303 | 9.724 | 9.685 | **-0.421** | 87.75 |
| Rosa | 10.000 | 9.700 | 9.712 | +0.300 | 100.00 |

The identity `CQ = It * Ig / Rz` holds exactly on **11 of 11** profiles, to
floating point. The arithmetic is doing what it says.

B against C is a smaller, structural gap. The seats hold three, three, three,
four, four, two and two laws, so the mean of the seven seat means is not the
mean of the twenty one. On Diane that is **0.286 of 10**: her seven seats
average 5.657 and her twenty one laws average 5.943. Temperance and Detachment
are the whole of the Sacral, so each of them carries as much weight in `It` as
each of the four Heart laws carries between them. That is a property of the
distribution and it may well be intended, but nothing in the code says it is a
choice, and `DESIGN-feathers.md` question 6 asks the same thing from the other
direction.

---

## EVERYTHING HOOKED UP TO IT

He asked what else is on this. Every consumer found by grepping `S.law`,
`bandIg`, `.Ig`, `p.laws` and `SI` across `atuned_src/`, then read.

| Consumer | Where | Reads | Writes | Displays |
|---|---|---|---|---|
| CQ, the whole reading | `compute.js:124`, `:140` | yes | no | no |
| Intention, `It` | `compute.js:125` via `bandIg` | yes | no | no |
| `relief`, which scales what every address holds | `compute.js:50` | yes, per seat | no | no |
| `r.weakL`, the furthest shut law | `compute.js:203` | yes | no | via `summary.js:258` |
| The ceiling and the release headroom | `compute.js:263`, the second copy | yes | no | `release.js:177`, `summary.js:581` |
| The accuracy reading | `compute.js:300` | **the count only**, `p.laws` non null over 21 | no | yes, as `cov` |
| The expression read | `expression.js:7` via `bandIg` | yes | no | feeds accuracy's `exq` |
| The avatar gap | `avatar.js:38`, called with `bandIg` from `drills.js:441` and `cone.js:206` | yes, handed in | no | yes |
| The tier ladder, `tierOf` | `canon.js:474` | **CQ only**, never a law | no | yes |
| The marks, `MARKS` | `ladder.js:166` | **`p.intake.completedAt` only**, never a law value | no | yes |
| The ritual | `ritual.js:11` | **`r.DQ` and `r.darkB` only**, never a law | no | no |
| The release run | `release.js:83`, `:177` | the ceiling | no | yes |
| The intake | `intake.js:44` `iqApply` | `p.intake.answers` | **yes, to `S.law` and `p.laws`** | `intakeui.js:219` |
| The tools panel | `panels.js:58`, `:65` | yes | **yes, to `S.law`** | yes |
| Undo | `undo.js:44`, `:70` | yes | **yes, on restore** | no |
| Personas | `personas.js:404` | `LAWSET` | **yes, to `S.law`** | no |
| `loadProfile` and `saveProfile` | `schema.js:108`, `:148` | `p.laws` | **yes, both ways** | no |
| `validateProfile`, the boundary | `schema.js:279` | `o.laws`, by `SI` name only | filters | no |
| The outbox | `outbox.js:33` | refuses `laws` and `answers63` **by name** | no | no |
| The wheel spoke ring | `wheel.js:735` | yes | no | yes, with 21 targets |
| The wheel core feathers | `wheel.js:313` | yes | no | yes, with 0 targets |
| Analytics, Knowledge, mapshelf, cone, the tooltip | as the surface table above | yes | no | yes |

Three things he might have expected to be hooked up and are not, which is worth
saying because a no is information:

- **The tier ladder does not read integrity.** It reads CQ and nothing else.
  Integrity reaches it only through CQ.
- **The marks do not read a law value.** The `laws` mark at `ladder.js:166`
  fires on `p.intake.completedAt`, a completion flag. A person with twenty one
  answered laws all reading 1 earns the same mark as a person at 10.
- **The ritual does not read integrity at all.** It picks a track from
  `r.darkB` and a tier from `r.DQ`. The content chain the owner described, where
  a law becomes a practice, is not wired. `ritual.js` and `SI` never meet.

And one that is in better shape than the rest, which is where the system below
comes from: **`engine/outbox.js:28` and `:33`.** An explicit allow list, an
explicit refuse list, and the comment says "This list is the spec, not a summary
of one. Anything not on it is refused by name, including by whoever adds a
helpful field six months from now, because the gate asserts the key set exactly."
That is the pattern. It already exists in this codebase and it works. The laws
need the same thing.

---

## THE DISAGREEMENTS

### One. The intake asks six questions that are not sentences.

Cause: `IQ_STEM` at `intake.js:10` is a second copy of the twenty one that did
not follow the owner's rename. `SI` says Justice and Humility, `IQ_STEM` says
Expression and Discernment, and the `||` fallback in `iqList()` turns a missing
phrase into the law name used as a verb.

Worked example, driven through the page's own `iqList()` in a real Chromium:

    q.law = 'Justice', q.side = 'left'
    q.q   = 'When it costs you something, how often do you justice?'

Six of sixty three. The two laws affected are the ones whose scores the
migration at `schema.js:101` was written to protect, which means the same rename
broke two things and only one of them was repaired.

### Two. The migration that protects the rename cannot be reached through the boundary.

`schema.js:101` carries `LAWWAS` inside `loadProfile()`. `pImport()` at
`schema.js:664` calls `validateProfile()` first, at `:667`, and
`validateProfile` at `:279` iterates `SI` and copies only `o.laws[l.nm]` for the
twenty one current names. `Expression` and `Discernment` are not among them, so
they are dropped before `loadProfile` ever sees them, and `LAWWAS` has nothing
left to migrate.

Measured, `proto/integrity/probe-migration.js`. Its check runs first on a known
good case, a current name in the same slot, which survives both routes:

    ROUTE ONE  loadProfile() direct
      input: {Expression:7.7, Discernment:3.3}
      after: S.law.Justice = 7.7   S.law.Humility = 3.3        migration FIRES

    ROUTE TWO  validateProfile() first, which is what pImport does
      v.profile.laws.Expression  = undefined
      v.profile.laws.Discernment = undefined
      validateProfile ok: true   errors: []
      after: S.law.Justice = 6    S.law.Humility = 6           DOES NOT FIRE

Two readings lost, the boundary reports `ok: true` with an empty error list, and
the person gets the default 6 in both slots with nothing said. This is not
reachable from the UI today because there is no import control. `CLAUDE.md`
states the boundary's first real caller will be the record fetch at sign in, so
this is a defect scheduled to become live on the accounts fork.

To be fair to the boundary: it is behaving exactly as ruled. "A missing field is
an older profile and is filled from the blank." A renamed law is
indistinguishable from an unanswered one **because the boundary does not know
about the rename**. The rename table lives one call downstream of the thing that
needed it.

### Three. The pill does not summarise the ring it sits on.

`ui/wheel.js:735` draws twenty one spokes whose lengths are `S.law[nm]/10`.
`ui/wheel.js:744` prints `pill('21 laws · integrity '+r.Ig.toFixed(1), ...)` on
that same ring. The pill's text claims the twenty one and then prints a number
that is not their mean.

The arithmetic is not wrong. `Ig` is defined as the law mean plus `poleMean*0.30`
minus `JQ*0.42`, clamped, and that definition is deliberate and documented. The
**label** is wrong, and it breaks `DESIGN.md` law 5, because the number does not
say what it is of.

Worked example, Abraham, read off the running page:

    the pill prints            21 laws · integrity 10.0
    the mean of the 21 spokes  8.914
    the gap                    +1.086 of 10, and the pill is clamped at 10

Worked example in the other direction, Lance:

    the pill prints            21 laws · integrity 9.3
    the mean of the 21 spokes  9.724
    the gap                    -0.421 of 10

The direction of the gap flips between profiles, so a person cannot learn a
constant offset and correct for it. **Four of forty five profile pairs are
ranked in opposite order by the two paths**: Wren against Abraham, Wren against
Lance, Abraham against Lance, and Lance against Rosa. On the last of those, the
pill says Rosa 10.0 and Lance 9.3, while the twenty one marks say Lance 9.724
and Rosa 9.700. The caption and the drawing disagree about who is further along.

`proto/integrity/three-integrities.html` draws this, because it is the one
finding here that is a distance rather than a number. Each profile's twenty one
spokes are drawn on the same five ring scale the wheel uses, with three circles
over them: the pill, the true mean of the twenty one, and the mean of the seven
seats. On Abraham the gold ring sits on the rim and the green one is visibly
inside it.

### Four. Three blank values for one law, and the one that runs is undocumented.

Covered above. The tier is suppressed on `r.unread` so nobody is called
Corrupt, but CQ, integrity and twenty one full length spokes are all printed off
the default on the profile the app opens on.

### Five. A persona's stated law is not the law the product reads.

Not a bug, but it is a fifth path and it moves numbers, so it belongs here.
`ui/personas.js:340` `seedIntake()` turns each `LAWSET` value into three intake
answers spread around it, and `iqApply()` averages them back. The round trip is
exact in the middle of the range and clamps at the ends. Checked first on the
mid range, where no clamp can bite: **31 of 31 exact**. Then measured:

| persona | laws moved | stated mean | reads | widest single move |
|---|---|---|---|---|
| Gordon | 20 of 21 | 1.752 | 1.933 | Transparency stated 1.0, reads 1.5 |
| Tomas | 19 of 21 | 2.586 | 3.081 | **Courage stated 1.1, reads 2.3** |
| Diane | 2 of 21 | 5.895 | 5.943 | Temperance stated 2.2, reads 2.8 |
| Marcus | 0 of 21 | 6.210 | 6.210 | none |
| Abraham | 16 of 21 | 8.916 | 8.914 | Truth stated 8.702, reads 8.7 |
| Lance | 0 of 21 | 9.724 | 9.724 | none |

It bites hardest at the bottom. Tomas is the lowest coherence reference case in
the roster and his integrity reads **0.495 of 10 higher** than his table states,
because the spread that `seedIntake` manufactures clamps at zero and pulls the
mean up. Anything tuned against Tomas is tuned against a number he does not
have. `tests/engine.js:240` and `:251` seed the personas a sixth way, directly
from `LAWSET` with no intake round trip, so the gate and the product read the
same persona differently.

### What I could not reproduce, and am reporting rather than resolving

`DESIGN-feathers.md` states the core radius `cr0` at Marcus, view 3, zoom 3.6,
1600 by 1000 as **165.8 pixels**, and feather ink as **20,079 pixels**, giving
23.2 percent of the core disc. I measured the same configuration in the same
viewport and got a canvas of 664 by 727, which matches that document exactly,
and `cr0` of **49.5 pixels**, taken from the `k:'core'` HIT entry, whose radius
`solCore` pushes at `wheel.js:399` as `cr0*1.5`. Those cannot both be right, and
the ink figure is the one that settles it: a disc of radius 49.5 has an area of
7,698 pixels and the feathers are clipped to `cr0*0.985`, so 20,079 pixels of
ink will not fit inside it at any coverage. Either `cr0` or the ink is measured
in different units. **I have not resolved which, and I am not calling that
document wrong.** Everything in it I could test independently held: 21 law
targets in `HIT`, 1 core target, 31 of 31 tips returning `core`, and `HIT` at
181 on Marcus at view 3, which is the exact figure it states. That seat should
re-read its own `cr0`.

I also had two probe bugs of my own and both were caught by checks rather than
by luck. The first set `S.depth`, which nothing reads, so it printed sixteen
identical rows under four headings. The second set `S.view` and called
`render()`, which does not fill `HIT`. Only `draw()` does, off the animation
loop. The corrected probe yields a frame before reading. The check that caught
both was requiring view 0 and view 3 to differ.

---

## THE SYSTEM

Four rules and one gate. None of it touches `compute()`.

### Rule one. One owner for the table, and one way to ask it anything.

`SI` at `canon.js:215` is the owner. It already is, in practice. The rule is
that **every per law property lives on the `SI` entry**, not in a second object
keyed by law name.

That means `IQ_STEM` stops being a table and becomes a field. Each entry in `SI`
gains one key:

    {nm:'Justice', b:'Throat', ic:'...', do:'weigh it the same both ways'}

and `iqList()` reads `l.do` instead of `IQ_STEM[l.nm]`, with **no `||`
fallback**. A law with no phrase then throws at build rather than printing "how
often do you justice?" The phrase for Justice and the phrase for Humility are
the owner's to write and are in the questions below.

Cost: twenty one lines moved into `canon.js`, one deletion in `intake.js`, one
line changed. `canon.js` loads before `intake.js` in `MANIFEST` already, so the
order holds.

The same rule makes the `HARM` join at `knowledge.js:86` explicit rather than by
name. Today it matches `e.t === SI[q].nm` in a loop and falls silently back to a
family mark if it ever misses. It joins 21 of 21 today. Give the twenty one
`spirit` entries an `si` key holding the law's index and assert the join.

### Rule two. One blank value, named once, in the engine.

`LAW_DEFAULT` at `schema.js:76` is the name. The other three go:

- `engine/core.js:164` becomes `SINAMES.forEach(l=>S.law[l]=LAW_DEFAULT)`. This
  needs `LAW_DEFAULT` declared before `core.js` in `MANIFEST`, or moved into
  `canon.js` beside `SI`, which is where it belongs since it is a property of
  the table.
- `ui/personas.js:273` `lawsFor` drops its `{_:5.5}` and returns
  `{_:LAW_DEFAULT}`.
- `ui/personas.js:269` `LAWSET.You={_:6.5}` goes entirely. The custom persona
  has no law table, which is the point of it, and `loadP` already handles that
  case at `:404`.

**This changes the blank profile's CQ from 42.25 to 36.00 and its tier from
Oscillating to Incoherent, neither of which is printed on an unread profile.**
It also changes the wheel's pill on arrival from 6.5 to 6.0, which is the next
rule's problem anyway. It is a behaviour change and it should be named as one in
the commit rather than slipped in as a cleanup.

### Rule three. One rule for where the number may be drawn, and what it may be called.

Three parts, in order of how much they cost.

**Nothing prints a law or an integrity off a default.** `wheel.js:735` and
`:744` gain the `r.unread` guard the three sites in `DESIGN.md` law 5 already
have. On an unread profile the ring draws its gridlines and no spokes, and the
pill reads `21 laws · not answered yet`. This is the same fix
`DESIGN-feathers.md` reaches by a different route with its bare quill, and the
two are compatible: the quill is the richer version of the same guard.

**A caption names the number it is actually printing.** `wheel.js:744` becomes
either the mean it sits over, or a label that does not claim the twenty one:

    21 laws · mean 8.9 of 10          if it stays on that ring
    integrity 10.0 of 10              if it keeps r.Ig, and moves off the ring

I would take the first. The ring is a picture of the twenty one and the caption
should be a picture of the same thing. `r.Ig` is already printed three other
places: `ui.js:25`, `ui.js:849` and `drills.js:162`, all of which sit beside
`It` and `Rz` where the formula makes it legible.

**The twenty one are drawn once per surface.** The Field currently draws them
twice, at `:735` as a pressable ring and at `:313` as an unpressable feather
layer. Whichever way the feathers land, one of the two has to go or hand off.
`DESIGN-feathers.md` already proposes the handoff and measures it. This rule is
just the statement that the handoff is required rather than optional.

### Rule four. The second copy of the formula gets a seam and an export.

Not a rewrite of `compute()`. `cqCeiling()` keeps its body and its signature.
Two things change:

- The three shared expressions become three small named functions that both
  callers use: `igOf(lawMean, poleMean, JQ)`, `itOf(bandMean, poleMean, JQ)`,
  `cqOf(It, Ig, Rz)`. Pure, three arguments each, no shared state read. This is
  the one place the impure core can be given a seam for free, because these
  three expressions take nothing from `S` that is not already a local.
- `cqCeiling` and `cqHeadroom` go into `engine/export.js`. They are two lines in
  a list. Without them the gate cannot see the arithmetic behind a sentence two
  surfaces print.

**If instead the owner wants `compute()` left completely alone**, which is the
defensible reading of "port, do not rebuild", then the cheaper version of rule
four is the export alone plus the gate assertion below, which catches a
divergence without preventing one. That is the version I would ship first. The
named functions are a follow up, and they are a signature change to nothing: no
existing function's signature moves, three new ones appear.

### What this is not

It is not a registry, a schema layer, or a law service. There is no new module.
The total is: twenty one `do` strings moved into `canon.js`, one constant
consolidated across four sites, two guards added in `wheel.js`, one caption
changed, two names added to `export.js`, and the gate below.

---

## THE GATE

One new group in `tests/engine.js`, which is the right file because every
assertion here is headless and none needs a browser. It goes beside group 1,
"data integrity", which already asserts `SI.length===21` and that every law
seats at a known band.

    g('1b · the twenty one laws have one owner');

    /* THE ASSERTION THAT WOULD HAVE CAUGHT IT. Six of the sixty three intake
       questions read "how often do you justice?" for eleven days, because
       IQ_STEM was a second copy of the twenty one that did not follow the
       owner's rename of Expression to Justice and Discernment to Humility.
       The || fallback in iqList turned a missing phrase into the law name
       used as a verb, which is why it printed something rather than throwing.
       Every table keyed by law name is asserted against SI here, both ways,
       because a table with the right COUNT and the wrong NAMES is the exact
       shape of the failure and a length check cannot see it. */
    const lawKeys = o => Object.keys(o).filter(k => k !== '_');
    const bothWays = (nm, keys) => {
      const extra   = keys.filter(k => SINAMES.indexOf(k) < 0);
      const missing = SINAMES.filter(k => keys.indexOf(k) < 0);
      ok(!extra.length,   nm+' holds names that are not laws: '+extra.join(', '));
      ok(!missing.length, nm+' is missing laws: '+missing.join(', '));
    };

    bothWays('SI.do',   SI.filter(l => l.do).map(l => l.nm));
    bothWays('HARM spirit', HARM.filter(e => e.a === 'spirit').map(e => e.t));
    SINAMES.forEach(nm => ok(!!LAWSET_KEYS_VALID[nm], ...));   /* every LAWSET override */

    /* AND NO QUESTION MAY BE BUILT FROM A FALLBACK. This is the one that
       actually catches it, because it tests the output and not the table. */
    ok(iqList().length === SI.length * 3,
       'three questions per law, got '+iqList().length);
    ok(iqList().every(q => q.q.indexOf(' '+q.law.toLowerCase()+'?') < 0
                        && q.q.indexOf(' '+q.law.toLowerCase()+' ') < 0),
       'no question uses a law name as its verb');

    /* ONE BLANK VALUE. Three shipped and the one that ran on arrival was
       undocumented: 5.5 in lawsFor, 6 in LAW_DEFAULT, 6.5 in LAWSET.You. They
       give three different tiers to a person who has entered nothing. */
    ok(LAWSET.You === undefined || LAWSET.You._ === LAW_DEFAULT,
       'the custom persona does not carry a law value of its own');

    /* THE TWO COPIES OF THE FORMULA AGREE. With charge and the installed
       opposite both at zero, cqCeiling()'s inputs equal compute()'s by
       construction, so the two must return the same number. This is the whole
       reason cqCeiling and cqHeadroom have to be exported: today they are not,
       so the arithmetic behind a sentence release.js and summary.js both
       print has no headless coverage at all. */
    [1, 3, 6, 8, 10].forEach(v => {
      reset(0, 0, v);
      near(compute().CQ, cqCeiling(), 1e-9,
           'the ceiling equals CQ on a clear field, law mean '+v);
    });

And one assertion that belongs in `tests/functional.js`, because it needs a
document:

    /* NOTHING PRINTS A READING OFF A DEFAULT. DESIGN.md law 5, three sites
       named there and two more found here: the wheel's law spoke ring and its
       pill both render on a profile where measured is 0 of 21. */
    loadP(0);
    ok(compute().unread, 'the custom persona starts unread');
    ok(HIT.filter(h => h.k === 'law').length === 0,
       'an unread profile pushes no law targets');
    ok(!/integrity \d/.test(pillTextOnTheField()),
       'the law ring prints no integrity figure on an unread profile');

**One note on a count typed into a gate.** `tests/engine.js:159` already asserts
`E.iqList().length===63`. Sixty three is `SI.length*3`, typed as a literal. This
file records five times the repository has been bitten by a number typed into a
document or a gate that the product then grew past. That is the sixth, sitting
in the gate for the exact system that just drifted. The replacement above reads
`SI.length * 3`.

---

## WHAT IT COSTS

| | |
|---|---|
| Rule one, `IQ_STEM` into `SI` | 21 strings moved, one deletion, one line changed. Two new phrases needed from the owner. |
| Rule one, the `HARM` join | 21 `si` keys added in `kb.js`, one loop replaced at `knowledge.js:86` |
| Rule two, one blank value | 4 sites to 1. **Behaviour change**: blank profile CQ 42.25 to 36.00 |
| Rule three, the guards | 2 conditions in `wheel.js`, 1 caption |
| Rule four, the seam | 3 new pure functions, 2 names into `export.js`. **Nothing's signature moves.** |
| Rule four, cheaper version | 2 names into `export.js`, nothing else |
| The gate | about 30 lines in `tests/engine.js`, about 8 in `tests/functional.js` |
| `compute()` | **not touched.** No body, no signature. |
| The engine stays host free | yes. Everything added is arithmetic and table. |
| Frame cost | zero. None of this is in a draw path except two `if` statements. |

Gate counts, read off a run at commit 0e63f4b with the tree as it stands, so
the numbers the next person compares against are real:

    ./atuned_src/BUILD.sh          built source.html, 1,343,660 bytes,
                                   div balance 0, no em dashes
    ./atuned_src/BUILD-engine.sh   engine is host free, engine ok, 310 exports
    node tests/engine.js           838 passed, 0 failed
    node tests/functional.js       740 passed, 0 failed
    node tests/collide.js          100 passed, 0 failed
    node tests/design.js           105 passed, 0 failed

I changed no product file. `proto/integrity/` and this document are the whole
of it. One thing to flag: the working tree was already dirty from other seats
when I arrived, carrying edits to `MANIFEST`, `ui/panels.js`, `ui/ui.js`,
`shell/head.html`, `tests/design.js` and a new untracked `ui/tip.js`. Running
`BUILD.sh` to read the gate counts regenerated `source.html` from that state, so
`source.html` may now carry another seat's in flight work that it did not carry
before I ran it. Every measurement in this document was taken before that build
and **re-verified after it**: 31 of 31 core tips still return `core`, the four
ranking inversions are the same four, and the six intake questions are the same
six.

---

## THE QUESTIONS I CANNOT ANSWER

Asked rather than guessed.

**1. What are the two missing phrases?** Every law in `IQ_STEM` has a plain
behaviour line: Truth is "say the true thing", Temperance is "stop at enough".
Justice and Humility have none, because their slots still hold Expression's
"say what is actually there" and Discernment's "tell the real from the
plausible". Those two lines are his. Justice wants something in the shape of
"weigh it the same both ways" and Humility something like "be wrong out loud",
but I am not writing a line a person is scored against.

**2. Does the rename go in `BOOK-ERRATA.md`?** Expression and Discernment were
two of the twenty one and are not any more. `BOOK-ERRATA.md` is the place a
disagreement between the codex and the engine is recorded with the line number
and the quotation, and this one is not in it. `kb.js:20` still lists Expression
as `E50` in the `express` family, so the name survives in the codex as a
different thing, which is probably why nobody wrote it down. It should be
written down.

**3. Should the seven seats be weighted by how many laws they hold?** `It` is
built from the unweighted mean of seven seat means over groups of three, three,
three, four, four, two and two, so Temperance carries twice the weight in
intention that Compassion does. That is 0.286 of 10 on Diane. It may be
deliberate. Nothing says.

**4. Does the pill keep `r.Ig` or take the mean?** I have argued for the mean
because the ring is a picture of the twenty one. But `r.Ig` is the number the
formula uses and there is a case for keeping it and moving it off that ring
entirely. His call, and it is the one decision in here that a person sees.

**5. Is the blank value 6, or is it nothing?** Rule two consolidates on 6
because that is the smallest change. The honest alternative is that an
unmeasured law has no value and `bandIg` and `Ig` are computed over the measured
ones only, with the reading suppressed below some coverage. That is a much
larger change, it interacts with `r.unread`, and it is the same question
`DESIGN-feathers.md` asks with its bare quill. The two should be answered
together.

**6. Does the round trip through `seedIntake` stay?** It moves Tomas's integrity
by 0.495 of 10 and nineteen of his twenty one laws, and the gate seeds him a
different way again. It exists so the demo personas have answered intakes, which
is a real need. But a reference case whose stated table and read value differ is
a reference case that cannot be used to check anything. Either the seed should
be exact, or `LAWSET` should be written as the intake answers rather than as the
scores.

**7. Is the ritual meant to read the laws?** The content chain the owner
described has a journal entry becoming a practice and sometimes an affirmation.
`ritual.js` reads `r.darkB` and `r.DQ` and never touches `SI`. If a law is meant
to select a practice, that wiring does not exist yet and it is the largest
unbuilt thing this census found.

**8. Moral or spiritual?** `canon.js:206` calls them "the 21 Laws of Spiritual
Integrity". `kb.js:21` and `analytics.js:164` call them "Laws of Moral
Integrity". `knowledge.js:77` says Moral. The owner's own question says "the
laws of integrity". One word per concept is a standing rule and there are two
words here.
