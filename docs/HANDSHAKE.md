# HANDSHAKE
## TULA UNIFIED · SOMATIC BOOKS OF REPROGRAMMING
**2026-09-15 · handoff to Claude Code**

Read this first. Everything else is referenced from here.

---
---

# 1 · WHAT THIS IS

Lance Powell has one source manuscript, **The Mechanics of Being**, 91,603 words. Everything else in this repository is extracted from it.

The extraction currently produces **eleven print-ready volumes** in a series called *The Somatic Books of Reprogramming*, plus a build system that generates them from data.

**Nothing in the series reads PENDING.** Every page of every volume is written. What remains is a voice pass, not construction.

---
---

# 2 · THE PRINCIPAL AND THE VOICE RULES

Lance Powell. Somatic engineer. Thirty years creative director in film and games, on Oscar, Emmy and Game of the Year winning teams. Co-authored peer-reviewed work in *Endoscopy*, Thieme, DOI 10.1055/a-2013-1820.

**Voice rules, absolute.**
- No em dashes, ever. Use a single dash or commas.
- Mechanical and precise. No soft wellness language.
- Short sentences. Maximum white space.
- No ego or credentials in the prose. Stories carry the authority.
- Physical metaphors only. Nothing abstract doing work a fact could do.
- Profanity permitted, never forced.

**Working rules.**
- Search the threads and project files before asking him anything. He has usually already ruled it.
- Never interpolate a somatic address. Ever. If it is not in canon or dictated, it does not go in.
- The node count is **114**. Never say 108.
- Every build turn ends with the file presented and its MD5 stated.
- Render and look at the output before claiming it works.

---
---

# 3 · WHAT IS BUILT

## The eleven volumes

| Volume | Band | Pages | Cascade source |
|---|---|---|---|
| ANXIETY | Root | 32 | **All 9 pairs Lance-dictated** |
| SHAME | **Complex** | 32 | Claude, Lance grammar |
| MONEY | Sacral | 32 | **All 9 pairs Lance corpus** |
| ANGER | Solar | 32 | Claude |
| BURNOUT | Solar | 32 | Claude |
| DRIVE | Solar | 33 | Claude |
| WORTH | Solar | 33 | Claude |
| GRIEF | **Complex** | 34 | Claude. Has a Forgiveness section. |
| VOICE | Throat | 32 | Claude |
| CONTROL | Solar | 33 | Claude |
| DUTY | Crown | 32 | **All 9 pairs Lance corpus** |

CREATE is built and shelved. It returns later.

**Every preface is Lance's. Ten of eleven circuit pages are Lance's.** Energy pages, back covers and 144 cascades are Claude's and need his pass.

## Per-volume structure, 32 pages

Colour cover · title · copyright · dedication · preface · circuit page · how to use, 9 steps · section title · energy page · affirmation · 9 charge-and-install spreads · forgiveness where present · evidence page · about the author · also in this series · back cover

## The spread, which is the whole product

**Verso, the charge.** Mark, running head, charge name, cascade, impact line, saboteur line, foot rule carrying `node · nerve · plain location` and beneath it the body reading.

**Recto, the install.** Mark, charge name's replacement, cascade, impact line. No foot.

---
---

# 4 · THE BUILD SYSTEM

```
generator/
  build_volume.py       the generator. cover + interior + five gates
  bodymap.py            103 nerves, 13 regions, 3 axes
  sim.py                purchase model, single product
  sim_all.py            purchase model, full catalog
  compose/
    ladders.py          the seven bell curves as data
    pairs.py            per-node charge content
    caps.py             the "because" capacities
    adj.py              adjective forms for replacements
    compose2.py         cascade composition in Lance's grammar
    money_duty.py       the two corpus-built volumes
  volumes/*.json        twelve volume specs
  assets/crown.png      full-resolution crown
  assets/crown_light.png  base lifted for dark fields
```

**Run:** `python3 build_volume.py volumes/anxiety.json`
**Bypass gates:** `SKIP_GATE=1 python3 build_volume.py ...`

## The five gates

**Cascade floor, 88 words.** Charges only, not installs. Anything sourced from Lance is exempt and reported rather than halted.

**Tense.** A future volume carries no completed action. The shame gate is exempt, because *ashamed that I was anxious* is correct in every volume.

**Stem.** The stem is *that I am ___*. No descent rung may stand as a bare present fact in a future volume. *Already embarrassed* fails. *Worried I will be embarrassed* passes.

**Overflow, 132 words.** The page cannot hold more. Above it the impact line collides with the foot rule.

**Numeral.** No free figure in prose. Numbers compete with canon numbers.

## Toolchain warning

Built with **Chromium via Playwright**, which honours `pt` directly. An earlier version used wkhtmltopdf, which needs every size inflated by 1.3333. **Do not mix them.** All sizes in the generator are true points.

---
---

# 5 · THE CASCADE GRAMMAR

Measured from Lance's own nine dictations. See `CASCADE_GRAMMAR_v1.md`.

**Stem, nine channels.** *I'm letting go of believing, perceiving, thinking, behaving, acting, feeling, speaking, saying, voicing...*

**Six movements.** Naming · base rungs carrying the charge as object · the climb · the shame gate · collapse · close.

**The shame gate is the most consistent thing he does.** Embarrassed, humiliated, ashamed, guilty. Four, always, that order.

**A rung never floats.** It attaches by one of five forms: `with [charge]`, `that I'm [charge]`, `that I was [charge]`, `from [charge]ing`, `that I can't [X]`.

**The shame object is different in all nine and never the feared event.** It is having had the charge, or what it cost, or the behaviour it produced. **This is the part that cannot be generated.**

**The install runs ~60% of the charge length**, opens three possible ways, and closes on `because` plus two to four concrete capacities.

**Lance never says** apprehensive, fearful or panic-stricken. He says scared, afraid, terrified, petrified, frozen, paralyzed.

---
---

# 6 · CANON RULED IN THIS THREAD

**Every charge escalates while awareness holds the story, and every charge deflates.** The seven bell curves are one curve with seven vocabularies. Awareness plus story is the fuel. This is the most load-bearing ruling in the thread.

**Grief is a complex.** Solar, upper back, Heart, Throat.
**Shame is a complex.** Lower back, then solar, then upper back, then depowering into the throat.
**Self confidence is a complex.** Self value, esteem, worth, respect, discipline.

**Anticipation releases to Presence. Shock releases to Awareness.**
**Shock sits at the prefrontal cortex, around the cavernous plexus.** Horizontal nerves across the forehead. The vertical ones shut down first and take the chain with them.

**Collapse order:** embarrassed, humiliated, ashamed, guilty, defeated, deflated, depressed, sad.

**Series line:** *The Somatic Book of REPROGRAMMING*
**Strap:** *Every pattern has an address in the body. This is the map.*
**Trim:** 306 × 492 pt. Ratio 1.6078, within 0.006 of φ.
**Author title:** Somatic Engineer on covers. Soul Architect for warm audiences.
**Digital first, no ISBN purchased.**
**Courage is $11.** Lead magnet is a sampler, not Courage.
**Practice Volume folds into The Road Map.**
**The three physicians may be named.**
**Johanne runs anonymised.**

**Eighteen live nerve addresses** narrated during release are captured in `CANON_ADDENDUM_LIVE_ADDRESSES.md`. Three of them conflict with the Product Bible and the file says which.

---
---

# 7 · THE PLATES

**45 scans of Lance's handwritten notebooks**, extracted from MOB v183 with captions, in `plates/`.

They are not photographs. They are the field notes. Nervous system diagrams, leg energy studies, chakra questions, decoherence octahedrons, how the senses work.

**They are the strongest evidence artifact in the manuscript**, because they show the work being done rather than described. Keep all 45.

---
---

# 8 · THE CORPUS

Roughly **634 catalogued release entries** in Lance's own dictation. Seven for every pair the series needs. About half carry both the charge and the install.

`LETGO_CLEAN_v1.md` holds 204 cleaned entries. The transcription was corrupted in roughly thirty distinct ways and the repairs are documented.

**Two entries are broken.** `Immature` at 8,726 words and `project success` at 1,371 both swallowed the entries following them. They need manual boundaries.

**Roughly 620 entries carry no address** and cannot become pairs until they do.

---
---

# 9 · WHAT IS OUTSTANDING

**Needs Lance, in his stated order.**
1. Ten energy pages, dictated
2. Money's circuit page
3. Ten back covers
4. 144 cascades read and marked keep or replace
5. 198 impact lines verified against a body
6. Communications Guide practice sequence
7. MOB epilogue, Johanna scene, front matter reorder
8. Split the Immature entry
9. Law counts, once assembled
10. Fill the CQ tracker
11. Outcome data from Janette and Ernesto

**Claude Code can do without him.**
Cluster groupings from address overlap. Assemble the full law set. Propagate the two complexes and two poles into Atüned. Full print wraps. Reselect each volume's nine pairs using his marked direct hits. Body diagram once art exists. Audit the card deck.

**The one that precedes everything.**
Publishing business, or licensing business. Practitioners convert on twelve of seventeen modelled products. The largest consumer segment converts on almost nothing except a free diagnostic. Every launch decision depends on this and it is unanswered.

---
---

# 10 · CARMEN

Dr. Carmen M. Smith, DDS, received the protocol directly and documented her outcome under medical observation. **She died roughly three months ago.**

Her words exist in messages she sent while it was happening. Publishing them needs her family's blessing, not hers. **Do not chase it.**

---
---

# 11 · THE FILE MANIFEST

**Books.** 22 PDFs. Eleven interiors, eleven covers.

**Strategy.**
`PUBLISHING_BRIEF.md` for external handoff
`PUBLISHING_ASSESSMENT.md` honest commercial read on every product
`TULA_PRODUCT_CATALOG.md` all seventeen products
`THE_COMPLETE_STACK.md` state of everything
`EVIDENCE_AUDIT.md` what exists, what is blocked, what each is worth
`MOB_AGENT_PACKAGE_CORRECTED.md` query, proposal, chapter one

**Working.**
`RUNNING_LOG.md` fifty items, marked L or C
`ANSWER_SHEET.md` everything waiting on Lance
`RULINGS_LOG_2026-09-03.md` this session's rulings
`CIRCUIT_PAGES_VOICE_PASS.md` the review sheet

**Reference.**
`CASCADE_GRAMMAR_v1.md` the grammar, measured
`CANON_ADDENDUM_LIVE_ADDRESSES.md` eighteen addresses
`SOMATIC_BOOKS_MASTER_SPEC_v2.md` physical and structural spec
`LETGO_CLEAN_v1.md` + `LETGO_CORPUS_SORT.md` + `LETGO_ENTRY_INDEX.tsv`

**Design.**
`COVER_SYSTEM_v7_BANDS_FINAL.html` the ruled cover system
`LITTLE_BOOKS_VOLUME_MARKS_v2.html` the marks

**Archive.** Superseded iterations in `_archive/`.

---
---

# 12 · FIRST THING TO DO IN CLAUDE CODE

```
git init
git add .
git commit -m "Handoff from chat. Eleven volumes built, generator running, five gates green."
python3 generator/build_volume.py generator/volumes/anxiety.json
```

If that produces a 32-page PDF with all five gates reporting clean except the floor exemption, the handoff worked.

---

## THE ONE-LINE STATE

*Eleven print-ready volumes exist with a working generator and five automated gates. Every preface and ten of eleven circuit pages are the author's. The energy pages, back covers and 144 of 198 cascades are not, and that is the remaining work.*
