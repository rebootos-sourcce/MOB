# Your briefs, front and centre

His ask, 27 September, `TASKS.md` IN: *"bring all of my briefs front and
center."* This page is the index: every brief, what it is for, and whether it
is current. It is the marketing and design counterpart to `BACKLOG-AUDIT.md`,
which did the same for the technical backlog.

Checked 27 September, more than 330 commits after the briefs in this folder were
written. **One thing decides most of the staleness below:** every brief in
this folder was read at a commit from the morning of 25 September, before the
fitted CQ landed that evening (`dd0bf23`, CQ as the 21 laws over 210). Since
then the release became a spoken script (`2c6e38b`), the Story page was
redesigned (`TASKS.md` IJ), and the CQ audit changed how a band word reads its
number (`bb2cbe0`).

**The one document kept current on purpose is `BIBLE.md`** (version five, 27
September). It is assembled from the briefs below and corrected as rulings
land. Where a brief and the Bible disagree, read the Bible.

    current     true of the product today, as far as it was checked
    dated       true in shape; its figures are from its own date, re-measure before quoting
    partly      one or more sections overtaken, named
    snapshot    a measurement of a moment, kept as the record, not a description of today

---

## 1. This folder: the desktop port briefs, 25 September

Written for the team porting the product to desktop. Together they are the
source behind `BIBLE.md` sections 2 to 11.

| File | What it is for | Status |
|---|---|---|
| `brief-foundations.md` | The visual language: colour, the seven lightings including Punch, type, icons, space, components | **dated.** The live palette is `funnel/tokens.css`, generated from the app |
| `brief-screens.md` | Every surface: layout, hierarchy, flow, and why | **partly.** The Story page sections predate the redesign approved 27 September (`TASKS.md` IJ) |
| `brief-motion.md` | Everything that moves: transitions, the boot, the Field, the release, timing | **partly.** Section 7, the release ritual, describes the 2.2 second line cadence. The release is now a spoken script, 50 left and 50 right, release then reframe (`2c6e38b`) |
| `brief-technical.md` | Rendering, frame budget, breakpoints, font delivery, the gates | **current** in substance |
| `design-architecture.md` | Build order, engine and host, state, validation, undo, the network seam | **dated.** The structure holds; line numbers are at `eb788a2` |
| `design-mechanisms.md` | The sniffer, the compute core, the seed, birth material, test vectors | **partly, and it matters.** Section 4 still gives CQ as intention times integrity over resistance. CQ is the 21 laws over 210. Read `BIBLE.md` section 2 for the formula |
| `design-gamification.md` | The loop, the content chain, the ladder, the economy, the games, the avatar | **partly.** Updated for the fitted CQ in one place (section 9) on 27 September; the rest is at `eb788a2` |
| `design-uxdeep.md` | Interaction design: the first run, the story, the drill, principles for new surfaces | **partly.** Section 3, the story, predates the Story redesign |
| `cq-unified.md` | How the one CQ was fitted by simulation, against his rulings | **snapshot, and settled.** Its model was ruled and built the same evening. The record of why CQ is what it is |
| `gap-desktop-wiring.md` | Is the desktop build current and wired | **snapshot**, reboot-os at `8ba42de` |
| `gap-parity-matrix.md` | The two engines compared, system by system | **snapshot**, both repositories on 25 September |
| `gap-ux-opportunities.md` | Missed opportunities against the UX rulebook and the 2027 trend set | **dated.** The ranked list is still the best single list of UX openings |
| `harmonic-research.md` | Can the nervous system be measured in hertz | **current.** Research, with no dependency on the build. Its answer is no, and the build printed solfeggio numbers unlabelled |
| `earcons-note.md` | What sound the product can make, and the one limit (nobody here can hear it) | **current.** The only brief in this folder `BIBLE.md` section 12.5 does not list |

---

## 2. The marketing system, `marketing/`

Built, gated and measured. `node marketing/tests.js` is the gate.

| File | What it is for | Status |
|---|---|---|
| `README.md` | Start here. The system in one page and how to run it | **current** |
| `LINES.md` | **Your own lines, verbatim, in one place**, each with its source, both gate verdicts and where it may go. New 27 September | **current** |
| `TESTIMONY.md` | The testimonial exercise: what landed, what did not, what to do next. New 27 September | **current** |
| `MAP.md` | What a person carrying each of the nine charges responds to and what closes the page, sourced row by row | **dated**, 26 September panel counts |
| `GUARD.md` | The line this system will not cross, the argument for it and its measured price | **current**. Its figures still hold after `bb2cbe0` |
| `AESTHETIC.md` | The design language for marketing surfaces, as rules with no hex values | **current** |
| `hooks.js`, `match.js`, `refuse.js`, `field.js`, `hooksim.js`, `testimony.js`, `tests.js` | The hook table, the lookup, the guard, the thousand person panel, the measurement, the testimonial simulation and the gate | code; run it |

---

## 3. Brand, positioning and research, at the repository root

| File | What it is for | Status |
|---|---|---|
| `BRAND.md` | The brand strategy: the one sentence, the position, your narrative and mission as set, the word heals, world's first, what we are not | **current**, 27 September |
| `BUYERS.md` | Your ten level buyer grid | **partly.** The level bands were written on the CQ scale before 25 September, and CQ now reads higher for the same person. Open with you as `DECISIONS.md` open question 1 |
| `MARKETING-social.md` | The slogans ranked, the share card, and the web out to Instagram, Facebook, X and Beehiiv | **current**, 26 September. Everything in it waits on your domain |
| `COPY.md` | The copy buckets and how each one is written | **current**, 27 September |
| `COPY-OBJECTIONS.md` | Every time you said you do not like a kind of copy, as rules | **current.** A build product; never edited by hand |
| `COPY-questions.md` | Thirty copy questions for you, with defaults | **partly**, 18 September. Several are answered since; still the list the landing was written against |
| `RESEARCH-icp.md` | The simulated focus group on the funnel: who walks and at which step | **partly**, 18 September. It says 63 questions (the quiz is 100) and gives the old CQ formula. The findings on the tier words, the nerve claim and the email key still hold |
| `PANEL-10k.md` | The ten thousand person segment model behind the channel plan | **dated**, 18 September, before the fitted CQ |
| `PRODUCT.md` | The product brief | **partly**, 20 September. `BIBLE.md` section 13 lists where it disagrees |
| `DESIGN-funnel-welcome.md` | The funnel welcome, storyboard and draft copy | **current as a draft** waiting for your reaction, 26 September |
| `DESIGN-founding-offers.md` | The founding offer system | **current as a design**, 26 September. Prices for tiers one to three are open |
| `DESIGN-economics.md` | The ladder, priced | **dated**, 19 September. Prices still open |
| `proto/funnel-copy/` | Four options each for the hook, description and guarantee from your funnel note | **current as options**, 26 September. Five questions to you in `TASKS.md` CO |

---

## What to open first

1. `marketing/LINES.md`, to see your own words gathered, and four questions
   about them.
2. `marketing/TESTIMONY.md`, for what the simulated testimonials showed.
3. `BIBLE.md`, when you want the whole product in one place.
