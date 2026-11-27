# Research: calculation sources for the psycho-spiritual layer

Scope. The owner asked for one consistent engine covering Eastern and Western
astrology, the domains, the archetypes, gene keys, human design and natal
information, and asked whether APIs exist for these. He also stated a target:
SOURCE AI at "CQ100, no deviation. If it drops below 99.6 percent it
automatically corrects back up to 100."

This file answers four questions and then assesses the fifth honestly. It
proposes nothing for the build queue. Nothing here has been implemented and no
other file was touched.

Measurement discipline. Every claim about the current engine below was run
against the code, not read off it. Two suspicions did not survive that and are
recorded as not-bugs rather than dropped.

---

## 1. What the engine already derives offline

All of it lives in `atuned_src/engine/birth.js`, 3.5 KB, with its data tables in
`atuned_src/engine/data/people.js` lines 70 to 136. It is host free, pure, and
deterministic. The module header states the design intent correctly: nothing is
stored beyond date, time and place, and every reading is a pure function of
those three, so a sixth system costs nothing.

The input is `BIRTH[name] = {d:'YYYY-MM-DD', t:'HH:MM', p:'place string'}`.

### The seven derivations, and what each actually does

**`sunSign(d)`.** Fixed calendar cutoffs from the `ZSIGN` table, month and day
only. Accurate except on cusp days. The true solar ingress drifts about a day
across the leap year cycle, so a birth within roughly 24 hours of a boundary can
be assigned the wrong sign. Time of day is not read. This is the standard
newspaper method and it is the most defensible of the seven.

**`moonSign(bt)`.** This is the weakest link and it is wrong in a specific,
cheap-to-fix way. It takes the Unix day number of the birth date at 00:00 UTC,
takes it modulo 27.32 (the sidereal month, which is the correct period), scales
to a fraction, and floors that into 12 equal parts.

The period is right. The phase is arbitrary: it is anchored to 1 January 1970,
whatever the Moon happened to be doing that day, and no calibration constant is
applied. I checked it against a truncated Meeus lunar longitude for all nine
sample births in `BIRTH`:

| birth | engine says | true sign | offset |
|---|---|---|---|
| 1985-03-14 | Aries | Sagittarius | 4 signs |
| 1980-11-02 | Sagittarius | Virgo | 3 |
| 1982-07-23 | Sagittarius | Virgo | 3 |
| 1990-06-08 | Aries | Sagittarius | 4 |
| 1987-01-19 | Capricorn | Virgo | 4 |
| 1969-09-27 | Cancer | Aries | 3 |
| 1965-02-11 | Virgo | Gemini | 3 |
| 1979-04-30 | Libra | Gemini | 4 |
| 1968-08-05 | Aries | Sagittarius | 4 |

Nought of nine correct. The error is a near-constant rotation of 3 to 4 signs.
Three causes, in order of size: the missing phase anchor, which is one constant;
the assumption of uniform motion, where the real Moon varies by about plus or
minus 6 degrees from the mean because of orbital eccentricity and evection; and
the discarded birth time, since the string is built as `bt.d+'T00:00:00Z'` and
`bt.t` is never read, costing up to 13.2 degrees of drift inside the day.

**`risingSign(bt)`.** Takes the sun sign index and advances one sign per two
hours from a fixed 06:00 sunrise. This is the classic rough table. It ignores
latitude entirely, ignores the real sunrise for that date and place, and assumes
all twelve signs rise in equal two hour blocks. They do not: ascendant rise times
vary sharply with latitude, and at high latitude some signs rise in under an hour
while others take over four. Accurate to roughly plus or minus one sign at mid
latitudes, worse toward the poles.

**`lifePath(d)`.** Sums every digit of the date string and reduces, preserving
11, 22 and 33. Correct arithmetic. It sums all digits at once rather than
reducing month, day and year separately, which is a convention choice rather
than an error, though the two conventions disagree when a master number appears
at an intermediate step.

**`chineseElement(y)` and `CHINESE[y%12]`.** These are exactly right on the
Gregorian year. Spot checked: 1980 gives Metal Monkey, 1985 gives Wood Ox, both
correct. The one defect is the year boundary. The Chinese year begins at Li Chun
or at Chinese New Year, falling between 21 January and 20 February, but the code
uses the Gregorian year. Every birth from 1 January to the new year, about 37
days or roughly a tenth of all births, is given the following year's animal and
element.

**`hdOf(b)`.** Not the Human Design algorithm. Type is
`HDTYPE[(hour + lifePath) % 5]` and authority is a six element array indexed by
`(hour+3)%6`. Real type comes from which of the 36 channels are defined across
the 9 centres, itself derived from 13 conscious plus 13 unconscious planetary
gate activations. Real authority is strictly determined by centre definition, and
lunar authority is possible only for a Reflector. I enumerated the output: the
code emits all 30 type-by-authority combinations, of which 4 are impossible in
the real system, including Generators with lunar authority.

**`geneKey(b)`.** Also not the real algorithm. Gate is `((day*3)%64)+1` and line
is `(day%6)+1`, both functions of the day of month alone. Because `day` only
runs 1 to 31, I enumerated the reachable output: 31 of the 64 gates, and 31 of
the 384 gate.line pairs. Thirty-three gates can never be produced for anyone.
Line is perfectly correlated with gate, so it carries no additional information.
The real Gene Keys Life's Work sphere is the conscious Sun gate and line, read
off the Sun's ecliptic longitude against the 64 gate mandala.

**`spiritual(name)`** composes all of the above and adds two lookups,
`ELEM2ROOT` mapping element to domain root and `MODE2NOTE` mapping modality to a
verb.

### What is collected and never used

`bt.p`, the birth place, is stored and displayed and read by no calculation. I
grepped the whole engine: there is no latitude, longitude, timezone or UTC
handling anywhere in `atuned_src/engine/`. Birth time is treated as though it
were already in the correct frame. Without place and timezone the rising sign
and house cusps are not computable even in principle, and the Moon and the Human
Design design-sun both need true UTC.

### `seed.js`, which is a different kind of thing and is honest about it

`atuned_src/engine/seed.js` is not derivation from birth data and does not claim
to be. Its header is explicit: a four letter type is the ego's own account of
itself, the person states it, the module never claims to have detected one.

It is built from four additive terms rather than sixteen written patterns, which
the header defends as four arguable assertions instead of sixteen unarguable
ones. `SEED16` gives each pole a small charge delta per child fetter. `seedAxes`
starts every charge at 3, the same floor a blank profile carries, applies the
deltas for the four letters, and clamps to 0 through 10. `seedApply` writes those
onto `p.axes[c].held` and records `{type, at, axes}` so the write stays
attributable. Re-seeding restarts from the base rather than compounding.

`seedShare(p)` returns the fraction of the field still attributable to the seed:
the distance the seed moved the axes from a blank 3, over that distance plus the
distance the axes have since travelled. The comment is precise that it is a
measurement and not a countdown, and that charge moved back toward the seed
raises it again.

Notably, the seed touches charge only. It never writes a law, a gate or a domain,
because those are measured, and the header says writing them would be putting
words in the person's mouth. That restraint is the single best model in the
codebase for how a new external system should be allowed to touch the field, and
section 5 leans on it.

---

## 2. Offline libraries

Requirement set: runs with no network, inlines into one HTML file, licence
compatible with a paid closed product, and covers tropical plus sidereal.

### astronomy-engine

MIT. No external dependencies in any language. Minified JavaScript is 116,485
bytes, held under a stated 120 K budget. Accuracy is always within 1 arcminute of
NOVAS C 3.1 on DE405, achieved by truncating the VSOP87 series to the smallest
form that stays inside that threshold, and validated against NOVAS and JPL
Horizons. Source: https://github.com/cosinekitty/astronomy and
https://www.npmjs.com/package/astronomy-engine

I checked its declared API surface rather than trusting the README. Everything
the owner's list needs is present:

- `EclipticLongitude(body, date)` gives the tropical longitude of any planet.
  Subtract an ayanamsa for sidereal. Divide by 5.625 for the Human Design and
  Gene Keys gate, by 13.3333 for the nakshatra.
- `EclipticGeoMoon(date)` gives the apparent geocentric ecliptic Moon, which is
  the correct fix for `moonSign` and the input to nakshatra and Vimshottari.
- `SearchSunLongitude(targetLon, dateStart, limitDays)` solves for the instant the
  Sun reaches a given longitude. This is exactly the Human Design design-sun
  solver, the 88 degree solar arc before birth, and it is also exactly the Chinese
  solar term solver, the Sun crossing each multiple of 15 degrees. One function
  covers both systems.
- `SiderealTime(date)` plus the ecliptic rotation matrices give the ascendant and
  house cusps, which the library does not ship as a named feature but fully
  supports as a short calculation on top.

It ships no ayanamsa and no house system. Both are short, well documented
additions rather than research problems.

### Swiss Ephemeris, and the licence trap

The licence is dual and the text is unambiguous. Verbatim from
https://raw.githubusercontent.com/aloistr/swisseph/master/LICENSE :

> Swiss Ephemeris is made available by its authors under a dual licensing
> system. The software developer ... must choose between one of the two license
> models, which are a) GNU Affero General Public License (AGPL) b) Swiss
> Ephemeris Professional License
>
> The choice must be made before the software developer distributes software
> containing parts of Swiss Ephemeris to others, and before any public service
> using the developed software is activated.
>
> If the developer choses the AGPL software license, he or she must fulfill the
> conditions of that license, which includes the obligation to place his or her
> whole software project under the AGPL or a compatible license.

Read that against the fork. "Before any public service using the developed
software is activated" is the accounts product. AGPL would require publishing
the whole of SOURCE under AGPL, which forecloses paid tiers as currently
conceived. The alternative is the Professional Edition, a one time fee per
commercial project. Quoted figures differ across secondary sources: CHF 750 for
a first licence with CHF 400 for each additional and CHF 1550 unlimited, against
another source quoting CHF 700 unlimited. `astro.com` is unreachable from this
sandbox, so these are secondary and must be confirmed with Astrodienst before
anyone relies on a number. Price list page:
https://www.astro.com/swisseph/swephprice_e.htm

Accuracy, if it were bought: the Moshier mode needs no data files at all because
the series are linked into the code, deviates from JPL by under 1 arcsecond for
planets and a few arcseconds for the Moon, and spans 3000 BC to 3000 AD, at a
cost of roughly ten times the run time of JPL mode. Source:
https://www.astro.com/swisseph/swisseph.htm

### The Swiss Ephemeris WASM ports

- `swisseph-wasm`, npm, declares GPL-3.0-or-later, 3.13 MB unpacked.
  https://www.jsdelivr.com/package/npm/swisseph-wasm
- `astro-sweph`, roughly 1.9 MB as an LZ4 compressed embedded build with all
  ephemeris data inside a single JS file and no external fetches, declaring GPL
  v2+ or commercial. Tropical and multiple Western house systems; its docs make no
  mention of ayanamsa or Vedic. https://github.com/astroahava/astro-sweph
- `@fusionstrings/swisseph-wasi`, 95 plus functions, runs in browsers and Deno.
  https://www.npmjs.com/package/@fusionstrings/swisseph-wasi

All of these inherit the upstream licence question. A wrapper cannot grant rights
the upstream withheld, so the declared GPL on the npm packages is the binding
fact, not a packaging detail.

### Pure JavaScript Moshier ports

- `circular-natal-horoscope-js`. Unlicense, which is public domain dedication and
  the cleanest licence in this whole survey. 828 KB unpacked. Ten planets plus
  Chiron and Sirius, lunar nodes, Lilith, retrograde flags, house and zodiac
  cusps, configurable aspects. Seven house systems: Placidus, Koch, Campanus,
  Whole Sign, Equal, Regiomontanus, Topocentric. Both tropical and sidereal.
  Depends on `moment`, `moment-timezone` and `tz-lookup`.
  https://github.com/0xStarcat/CircularNatalHoroscopeJS
- `ephemeris` on npm, the same Moshier lineage via mivion and xErik, declares
  **GPL-3.0**, 495 KB, no dependencies.
  https://www.npmjs.com/package/ephemeris

Flag for the owner, because it matters and is easy to miss: two packages
descending from the same Moshier code declare different licences, one Unlicense
and one GPL-3.0. That provenance chain needs a lawyer's eye before either ships
inside a paid closed product. Do not assume the permissive one is clean merely
because it is the permissive one.

### Supporting pieces, both clean

- `tz-lookup`. CC0-1.0, no dependencies, 152 KB. Timezone from latitude and
  longitude, offline. This is the piece that closes the gap named in section 1,
  and it does so without a network call.
  https://www.npmjs.com/package/tz-lookup
- `lunar-javascript`. MIT, no dependencies, 512 KB. Solar and lunar calendars,
  ganzhi, bazi (the four pillars), five elements, ten gods, the 24 solar terms,
  the 28 mansions. This covers the Chinese requirement outright.
  https://www.npmjs.com/package/lunar-javascript
- Offline geocoding, place name to coordinates. GeoNames derived datasets under
  CC BY 3.0. `cities15000` is about 7.8 MB; `offline-geocoder` builds a roughly
  12 MB SQLite from `cities1000`. https://www.npmjs.com/package/offline-geocoder
  and https://github.com/lutangar/cities.json

### The accuracy argument, which decides the recommendation

The question is not which library is most accurate. It is which error dominates.
Boundary widths in this product, in arcminutes:

| boundary | width |
|---|---|
| zodiac sign | 1800 |
| nakshatra | 800 |
| HD or Gene Keys gate | 337.5 |
| nakshatra pada | 200 |
| HD or Gene Keys line | 56.25 |

Against that, the error each source contributes:

| source of error | Moon | ascendant |
|---|---|---|
| astronomy-engine ephemeris | under 1 | under 1 |
| birth time rounded to 15 minutes | 8.2 | about 225 |
| timezone or DST wrong by 1 hour | 33 | about 900 |

The ascendant moves roughly 15 arcminutes per minute of clock time, and the Moon
roughly 0.55. A birth time rounded to the nearest quarter hour, which is normal
on a birth certificate, moves the ascendant by about four Human Design lines.
A single hour of DST error moves it half a sign.

So the recorded birth time dominates the ephemeris by two to three orders of
magnitude. astronomy-engine's 1 arcminute is already 56 times finer than the
narrowest decision the product makes. Buying arcsecond precision from Swiss
Ephemeris would refine a quantity whose input carries arcminutes to degrees of
uncertainty. That is precision the product cannot spend. Hold onto this: it
returns in section 5, because it is the same category error as forcing a
confidence number to 100.

### Recommendation

**astronomy-engine, MIT, inlined, plus thin layers written here.**

Reasons, in order. It is the only licence in the survey that is unambiguously
safe for a paid closed product with no fee and no copyleft reach. At 116 KB
minified it inlines into `source.html` without changing what that file is, which
is the constraint the project will not trade. It has no dependencies, so it does
not drag a tree in behind it. Its 1 arcminute is far inside the error the birth
record already carries. And its `SearchSunLongitude` happens to be the exact
solver both Human Design and the Chinese solar terms require, so one primitive
serves two systems.

What must be written on top, all of it short and all of it arithmetic over
longitudes the library returns: Lahiri ayanamsa for sidereal; the 64 gate mandala
mapping for Human Design and Gene Keys, which is the same mandala for both; the
88 degree design-sun solve; nakshatra and pada division; Vimshottari dasha; the
ascendant and a house system; and the four pillars, or take `lunar-javascript`
for that last one since it is MIT and already correct.

Two pieces should be taken rather than written: `tz-lookup` at CC0 for offline
timezone, and a GeoNames city table for offline place lookup. Both keep the
birth record on the device, which is the whole point of section 3.

Against this, one honest caution. This is a port of an existing rough layer into
a real one, and CLAUDE.md rules "port, do not rebuild" for the arithmetic core.
The birth module is not the arithmetic core and its current bodies are
approximations rather than a contract, but replacing `hdOf` and `geneKey` will
change every existing profile's displayed type and gate. That is a schema and
migration question and it belongs to the owner, not to the build.

---

## 3. Third party APIs, and what they cost in privacy

### What exists

**Human Design.** Several vendors sell this as a service. Human Design Hub runs a
free tier at 100 credits a month, then 9.99 dollars for 10,000 credits, 29.99 for
50,000, 49.99 for 120,000, with a custom enterprise tier
(https://humandesignhub.app/en/human-design-api). humandesignapi.nl starts at
22.50 euros a month for 5,000 credits (https://humandesignapi.nl/). Bodygraph
sells a chart and bodygraph API including SVG rendering
(https://bodygraph.com/human-design-api/). They return type, authority, profile,
defined centres, channels, gates and a rendered bodygraph.

**Gene Keys.** There is no established developer API. Searching turns up
calculators and consumer apps, and the official Gene Keys profiler
(https://genekeys.com/free-profile-2/), but no vendor selling programmatic
access. The reason matters more than the absence: Gene Keys shares its
astronomical engine with Human Design. The hologenetic profile maps the same
planetary positions onto the same 64 hexagrams and then assigns them to 11
spheres. So a Gene Keys profile is a naming and sphere-assignment layer over a
calculation the product would already have. There is nothing to buy here because
there is nothing extra to compute.

**Western and Vedic astrology.** A crowded market. Prokerala, AstrologyAPI,
RoxyAPI, Vedika, astrology-api.io and others sell kundli, panchang, Vimshottari
dasha down to pratyantar, all 27 nakshatras, the D1 to D60 divisional charts,
Ashtakoota matching, dosha and KP. Pricing starts around 12 dollars a month, and
per call figures near 0.0012 dollars are quoted at the cheap end
(https://vedika.io/blog/astrology-api-pricing-real-costs-2026,
https://roxyapi.com/blogs/best-astrology-apis-2026-developer-comparison,
https://astrology-api.io/blog/astrology-api-comparison-guide).

One buying note independent of privacy: credit wallet pricing is not predictable.
A basic birth chart may cost 50 credits while a comprehensive transit prediction
costs 350,000, so cost per user cannot be forecast from a price per credit. Flat
request pricing is the only model that can be budgeted.

### The privacy cost, stated plainly

**Birth date, plus time to the minute, plus town, is an identifier.** It is
personal data under GDPR Article 4(1), and the combination is close to unique. A
date, a time to the minute and a town narrows a population to a handful of people
and often to exactly one
(https://vedika.io/blog/astrology-data-privacy-gdpr).

So calling any of these APIs means transmitting, to a third party, a value that
identifies a specific named human being. Not a pseudonym. Not a hash. The tuple
itself is the identifier. `DECISIONS.md` already rules that the name is replaced
by a key and that records are never looked up by name. That ruling does not
survive contact with a birth data API, because the birth tuple re-identifies the
person without the name ever being sent. The key protects nothing if the thing
next to it is unique.

Worse in context: the request does not travel alone. It travels with an IP
address, a timestamp, and an account identifier on the vendor's side, and it
arrives correlated with whatever else that vendor holds. And it is being sent
from an application whose other contents are somatic and psychological self
report.

Whether a birth chart is Article 9 special category data, as material revealing
philosophical or religious belief, is an open regulatory question and not a
settled one (same source). The prudent read is that a product built to hold
somatic and psychological self report should not be the one testing that
boundary in public.

Vendors do make retention claims. AstroBeans states birth data is used solely for
calculation and deleted or anonymised after the response unless caching is
requested (https://astrobeans.com/privacy-policy). astrology-api.io states zero
retention and on the fly processing (https://astrology-api.io/faq). These are
promises, not architecture. They are unverifiable from outside, they can change
with a terms update, and they do not survive an acquisition. Sensitive data from
health and wellness apps routinely transfers in mergers without meaningful user
consent (https://www.readdestiny.com/blog/astrology-app-acquisition-data-privacy/).

There is also a smaller and more immediate version of this already live in the
product. CLAUDE.md records that `source.html` links `fonts.googleapis.com` and
`fonts.gstatic.com`, so every load sends the person's IP to Google before they
have typed anything. An astrology API would be a far larger instance of the same
contradiction, and it would be one the product chose deliberately after having
already identified the smaller one.

### The conclusion this points to

Every system the owner named can be computed offline. Sun, Moon, rising, houses,
gates, lines, nakshatra, dasha, four pillars, all of it. The libraries in section
2 are sufficient and the missing pieces are arithmetic.

Therefore buying an API would mean paying a subscription, adding a network
dependency, adding a vendor, adding a controller relationship with access,
deletion and breach obligations attached, and transmitting an identifying tuple
about a named person, in order to obtain a result the product could have computed
on the device for free.

There is no engineering case for it and the privacy case runs hard against it.
The single seam CLAUDE.md permits, fetching a record at sign in, is a seam to the
product's own store. It is not a licence to open a second one outward.

If an API is ever used, the only defensible shape is at build time and never at
run time: generate fixture tables offline from a vendor, check them into the
repo, and ship the tables. No user's birth data ever leaves the device, and the
vendor never sees a real person. That is a test oracle, not a dependency, and it
is a genuinely good use for one.

---

## 4. What convergence already exists in the code

`converge(name, r)` in `atuned_src/engine/birth.js` lines 46 to 66. It is called
from exactly one place, `atuned_src/ui/summary.js` line 100, and it is covered in
`tests/engine.js` lines 604 to 612 including a determinism check.

Its header states the intent, and the intent is right:

> CONVERGENCE. where independent systems agree, that is the signal. where they
> disagree the instrument says so rather than picking a winner.

### What it does

It runs `spiritual(name)`, returns null if there is no birth record, then makes
exactly four comparisons and files each into `agree` or `differ`:

1. Birth sun element mapped to a root, against the root of the person's first
   domain.
2. `LP2ARCH[lifePath]`, against the name of the person's first archetype.
3. Whether the sun modality is cardinal, against whether the field is benign,
   meaning CQ at or above 50.
4. Whether the Human Design type is Generator or Manifesting Generator, against
   CQ at or above 50.

It returns `{e, agree, differ, score}` where
`score = round(agree.length / (agree.length + differ.length) * 100)`.

Every comparison is an if/else, so both lists always total 4. The denominator is
therefore always 4 and `score` can take exactly five values: 0, 25, 50, 75, 100.
I enumerated this rather than assuming it.

The UI renders the score as a ring labelled "convergence", lists the agreements,
lists the disagreements under "Where they do not", and closes with a verdict that
is the best sentence in the feature: the instrument does not pick a winner, a
birth chart describes the blueprint, the field describes what is running now, and
they diverge when something has been installed on top of the blueprint. When
nothing agrees it says "Nothing converges. That is a reading, not a gap."

### The finding that matters

**`converge` is not comparing astrological systems to each other.** Three of its
four comparisons, and arguably all four, put a birth-derived value against a
field-derived value. Birth element against current domain. Life path archetype
against current archetype. Birth modality against current CQ. Design type against
current CQ.

It measures blueprint against present state. That is a comparison between two
genuinely independent sources: a birth record the person did not choose, and a
field measured from what they answered and wrote. The UI copy describes exactly
this and describes it accurately.

This is the correct structure, and it is more defensible than what the owner's
question was reaching for. It should be preserved and extended along its existing
axis. Section 5 explains why extending it the other way, by adding more
astrological systems, would make the number worse rather than better.

### The five lenses are a different thing and must not be counted

`summary.js` lines 6 to 39 define `lensWestern`, `lensEastern`, `lensDesign`,
`lensGene` and `lensName`, rendered under "The composite" as "Five lenses on one
profile". Read what they actually compute. `lensWestern` returns the root domain
restated as an element. `lensEastern` returns the chakra of the band carrying the
most charge. `lensDesign` returns the first archetype and the polarity.
`lensGene` returns the highest shadow. `lensName` reduces the letters of the
name.

None of these read the birth record. The file header is candid about it: each is
a pure function of soul, axes and laws, so they cannot drift from what the
instrument already knows.

That candour is also the warning. Because they are functions of one source, their
agreement is guaranteed by construction and carries zero information about the
person. They are a vocabulary layer, translating one reading into five idioms.
That is a legitimate presentation device and it is well built. It is not
evidence, and counting these five as five agreeing systems would be counting one
thing five times.

### Two suspicions I checked and did not confirm

CLAUDE.md requires reproducing a failure before reporting it. Two did not
reproduce, and they are recorded here so nobody spends the same hour.

**`converge` has no unresolved bucket**, so an absent input would be filed as
disagreement rather than as a gap. `rootNow` is built as
`(DOMAINS[S.doms[0]]||{}).r||''`, which for an empty `S.doms` would yield `''`,
never match `e.root`, push a disagreement sentence ending in nothing, and lower
the score. I traced whether `S.doms` can actually be empty. It cannot:
`core.js:85` reads `if(!S.doms.length)S.doms=[S.dom];` and `schema.js:158` reads
`if(!p.soul.doms.length)p.soul.doms=[0];`. **This is not a live bug.** It is a
design gap that becomes a live bug the moment a fifth comparison is added whose
input is genuinely optional, and section 5 specifies the fix.

**`BIRTH.You` is null**, so for a real person `spiritual` returns null and the
overlay is dead until birth data is captured. I confirmed this is handled rather
than broken: `converge` returns null, and `summary.js` renders the correct copy,
that no birth data is on file and that date, time and place would let the overlay
run. **Working as designed.**

---

## 5. The CQ100 idea, assessed

The stated target: "CQ100, no deviation. If it drops below 99.6 percent it
automatically corrects back up to 100. Because it's looking to give you the most
correct behavioral energetic read that it can, based off of how many data points
are pointing at the same thing."

There are two ideas inside that sentence. One is good and buildable. The other
cannot work as stated. They need separating before either can be built, and the
good one is the larger of the two.

### The distinction

A confidence figure is a **measurement of the evidence**. Its only job is to
vary: to read high when the sources agree and low when they do not, so that a
person can tell a strong read from a weak one.

A rule that returns the figure to 100 whenever it falls is not a correction. It
is an **override**. After the override the number no longer varies with the
evidence, and a number that does not vary with the evidence carries no
information about it. A confidence that is always 100 cannot distinguish a strong
read from a weak one, which was the entire point of having it.

That is the difference, put plainly: **measuring confidence and asserting
confidence are opposite operations.** The first tells you something you did not
know. The second tells you what you already decided.

### Why the threshold specifically cannot hold

"Drops below 99.6 and corrects back to 100" is self cancelling as a
specification. A threshold presupposes the number can move. A snap-back
presupposes it cannot. Both cannot be true of one number.

Trace the observable behaviour. If the correction fires whenever the value falls
below 99.6, then every value a user can ever see is 100. The 99.6 threshold is
never visible in any output. It cannot be tested, because no test can distinguish
"the system computed 100" from "the system computed 40 and was overridden to
100". A number with only one reachable value is a constant, and a constant does
not need a threshold.

And mechanically, there are only two ways to raise a convergence score. Change
the evidence, or change the rule that reads it. Changing the evidence to reach a
target number is fitting the data to the answer. Changing the rule until the
number comes out right is moving the goalposts. Neither is a correction, and a
product that does either has stopped being a diagnostic instrument.

This is the same category error as buying arcsecond ephemeris precision in
section 2: adding digits downstream of an input that does not carry them. There,
extra precision was merely wasted. Here, it is worse, because the number is being
shown to a person as a statement about how much to trust the read.

### What the owner is actually right about

The last clause of his own sentence is the specification, and it is a good one:
**"based off of how many data points are pointing at the same thing."**

That is a count of concurring independent signals. It is measurable, it is
buildable, and the engine already does a four-item version of it in `converge`.

And "CQ100, no deviation" is best read as a statement about the **standard the
instrument is held to**, not about the value it prints. Always take the most
correct read the data supports. Never round down out of laziness, never fake a
number, never ship an approximation where an exact calculation was available.
That is a fixed bar on the engineering and it should not move. It has nothing to
do with the output being 100, and the product gets better the moment those two
are kept apart.

There is precedent inside the codebase for exactly this restraint. `seed.js`
moves charge and refuses to write laws, gates or domains, because those are
measured and writing them would put words in the person's mouth. A confidence
figure forced to 100 puts a word in the instrument's mouth. It is the same error
one level up.

### The hard constraint on any convergence score

Convergence is evidence **only between independent sources**. This is the part
that determines what can honestly be built, and it rules out the most obvious
version of the owner's request.

Sun sign, moon sign, rising, Chinese animal, Chinese element, life path, Human
Design type and Gene Key are all pure functions of one birth record. The
`birth.js` header says so as a virtue, and as engineering it is a virtue: nothing
is stored beyond date, time and place. But it means those seven outputs are not
seven witnesses. **They are one witness speaking in seven dialects.**

Where two of them agree, that agreement is a property of the two mappings, not a
fact about the person. Sun element and Chinese element will co-occur at a rate
fixed by arithmetic, a 10 year cycle against a 365 day cycle. That rate is
computable exactly and has nothing to do with anyone's behaviour. Adding more
astrological systems to the count raises the apparent convergence while adding
no information at all. It would make the number go up and the read get worse.

Two of the current systems are worse than dependent, they are arbitrary.
Section 1 established that `hdOf` is `(hour + lifePath) % 5` and `geneKey` is
`(day*3) % 64`, reaching 31 of 64 gates. Their agreement with anything is chance
at a rate that can be enumerated. Counting them as concurring evidence would be
counting noise as signal.

So the honest list of genuinely independent sources in this product is short, and
it is not a list of astrologies:

1. **The birth record.** Date, time, place. The person did not choose it.
2. **The 63 intake questions.** Self report on the laws.
3. **What the person actually wrote.** Gates measured from their own language.
4. **The stated four letter type.** The ego's own account, already isolated in
   `seed.js`.
5. **Behaviour over time.** History, ritual adherence, what they did rather than
   said.

Agreement *between* these is evidence. Agreement *within* the astrology overlay
is arithmetic. `converge` already sits on the right side of that line, which is
why section 4 recommends extending it along its existing axis and not the other.

### A concrete alternative specification

This is what to build instead. It is buildable today, entirely offline, and it is
a small extension of a function that already exists and already has tests.

**1. Report the fraction, not a bare percentage.** The denominator is currently
always 4 and the score has five reachable values, so a percentage implies a
precision it does not have. Lead with "3 of 4 agree". The percentage, if shown at
all, is secondary. Never emit the number without its denominator.

**2. Give every comparison a chance baseline.** Each comparison has a small finite
domain: 12 signs, 5 Human Design types, 12 archetypes, a binary CQ split. Enumerate
the domain, compute the agreement rate chance alone produces, and report agreement
**above baseline**. A comparison between a 40 percent likely flag and a roughly
even CQ split agrees about half the time by construction, and a score that does
not subtract that is reporting arithmetic as insight. This is the single change
that turns the number from decorative into diagnostic.

**3. Add a third bucket: unresolved.** Today there are two, agree and differ, and
an absent input would silently become a disagreement. Section 4 confirmed this
does not currently fire, and also confirmed it would the moment an optional input
is added. Three buckets. A comparison that could not be made is reported as not
made, and it is excluded from the denominator rather than counted against the
person.

**4. Cap the claim by the weakest input.** Birth time drives the ascendant at
roughly 15 arcminutes per minute of clock, per section 2. If the birth time is
unknown, or rounded to the hour, then the rising sign and everything downstream
of it is unresolved. Not guessed, not defaulted, excluded and labelled. The
instrument should be able to say "birth time is to the hour, so the ascendant is
not resolved" and mean it.

**5. Score across sources, never within one.** A comparison is admissible only if
its two sides come from different entries in the five-source list above. This is
the rule that keeps the number honest, and it is the rule that must be written
down before anyone adds a sixth astrological system, because the temptation will
be to add systems and watch the number rise.

**6. Report disagreement as output.** The UI already does this well and the copy
is already right. Keep it. Disagreement between the blueprint and the field is
the most informative thing the overlay produces, because it is where something
was installed on top of the blueprint. It is a finding, not an error state, and
it must never be corrected away.

**7. Let it read low.** A read where the sources diverge should say so. "2 of 6
agree, and here are the four that do not" is more useful to a practitioner than
100 ever is, because it tells them where to look.

### What is buildable, what is not, and what would make the product less honest

**Buildable now, offline, no network.** Every calculation the owner listed:
tropical and sidereal Western, nakshatra and Vimshottari dasha, the Chinese four
pillars with solar terms, real Human Design gates and lines from the 88 degree
design-sun, and the Gene Keys spheres, which are the same mandala. Plus a real
convergence score across the five independent sources, with baselines, an
unresolved bucket, and disagreement reported. Plus fixing `moonSign`, which is
currently a near-constant rotation and is the cheapest correctness win available.

**Not buildable, because it is not a thing.** A confidence figure that is forced
to a constant. Not because it is hard, but because the specification cancels
itself. The number would be real or it would be 100, and it cannot be both.

**Would make the product less honest, in rising order of harm.**

- Adding astrological systems to raise the convergence count. More dialects of one
  witness. The number rises, the information does not.
- Counting the five lenses as five agreeing systems. They are one field in five
  idioms, and `summary.js` says so in its own header.
- Buying arcsecond ephemeris precision to support a claim the birth time cannot
  carry. Two to three orders of magnitude of false precision.
- Sending a birth date, time and place to a vendor to obtain a result computable
  on the device. That is paying a subscription to transmit an identifying tuple
  about a named person, in a product built to hold somatic and psychological self
  report.
- Displaying 100 as confidence. This is the worst of the five, because the other
  four mislead the builder while this one misleads the person being read. The
  product's own posture, that every write which can fail must report through
  `status()` and that a control must never claim success before it has it, is the
  same principle. A confidence figure that claims certainty it has not measured is
  a control claiming success before it has it.

The instrument's authority rests on being willing to return a low number. A
number that cannot go down is not a reading. It is a logo.
