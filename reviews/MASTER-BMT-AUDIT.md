# Master Business, Marketing and Technology TDD, audited against the real code

Read only. Nothing built, nothing merged. The document is
`reviews/ATUNED-Master-BMT-TDD.md`, 1,817 lines, 30,509 bytes, md5
`64e55c59a52fc31eef853718cdc50edb`, sections 0 to 40 and the closing Source
Handshake, read in full. The owner uploaded it twice, as `..._v2.md` and
`..._v2_1.md`; the two files are byte identical (`cmp`, checked), so it is
stored once.

His instruction, read plainly: review it for development, block it, add it to
the plan. The model for the discipline is `reviews/CONGRUENCY-AUDIT.md` and
`reviews/TUNED-AWARENESS-AUDIT.md`. Grades are the house set, which is also
this document's own (section 39): EXISTS, PARTIAL, MISSING, CONFLICT,
UNVERIFIED. "Measured" means a probe was run for this audit, in node against
the committed `engine.js` or in Chromium against the committed `source.html`,
not that a comment or another document said so. Every other claim cites a file
and a function or line, or says it searched and found nothing.

Date: 2 October 2026.

---

## The verdict in one line

**Most of this document is already graded or already strategy, and the one
part that is genuinely new for engineering, the claims hierarchy of section 38,
does not exist as a mechanism anywhere: the shipped landing page's search
description says "Mindset programming is the cause", its copy says strain "is
making us ill" and that low coherence "shows up as mental, physical and
spiritual disease", and the two copy gates the repository has either pass those
lines or flagged them and then grandfathered them into a baseline.**

---

## Step 1. The canonical build

| | |
|---|---|
| Branch | `claude/laughing-feynman-xhfyj3` |
| Commit audited | `0e6fd50`. The branch moved to `4054f39` while this ran; that commit adds eight lines to `TASKS.md` and touches no code |
| Last commit that touched code, funnel, marketing or the voice skill | `9dbf364`, the duplicate function build guard. This is the same build `TUNED-AWARENESS-AUDIT.md` graded |
| Source file | `source.html`, 4,201,406 bytes, md5 `259189ae7593cfad4487c3f898ffda03` |
| Build stamp inside the file | `data-build="v1442 fbb4e91 2026-10-02 18:43"`. It names the commit before the code it carries, as both earlier audits recorded |
| Engine file | `engine.js`, 1,162,014 bytes |
| Run for this audit | `node tools/ritualsim.js` (validation 18 passed, 0 failed, then the report); `node tools/loopsim.js --validate` (44 passed, 6 failed); `check.py --brief` over the four funnel pages, with and without `--baseline`; `marketing/refuse.js` on fourteen lines; `parseStory` on the document's own two example sentences; one Chromium probe of the first screen a blank Guest sees, at 1600x1000 and 390x844 |
| Not run | `tests/engine.js` and the browser gates. No code changed, and this audit grades copy, gates and simulations, not the engine |

---

## Step 2. What this document is, and what is not new

Its Source Handshake says it consolidates ten earlier documents, naming the
System Congruency and Onboarding TDD, the Feedback and Solutions spec, the two
creative briefs, the MVP Architecture, the Intelligence Architecture and "the
1,000 ICP synthetic simulation". Its last paragraph classifies everything new
in it on business, marketing, claims and longitudinal ground as "strategy,
hypothesis, or experiment design until validated."

So most of it is a restatement, and a restatement is not re-graded here.

### 2.1 Already graded in `reviews/CONGRUENCY-AUDIT.md`

Sections 0 (the architecture notes), 9, 10, 11, 27, 30, 31, 32, 33, 34 and the
Canonical Information, Story, Release, Practice and Memory handshakes of
section 39 restate the chain that audit graded in full: story, observation,
mirror, confirm or correct, release, verify, evidence; the hypothesis
lifecycle; memory as durable confirmed state; the practice ladder; the trace
graph and the Field as projections and never the record.

Its three breaks, and where each stands at this commit:

| Break | Then | Now | How this audit knows |
|---|---|---|---|
| The onboarded record refused on reload (`ob` not declared at the profile boundary) | CONFLICT, AT-07 | **Closed.** The boundary fix merged | `TUNED-AWARENESS-AUDIT.md` measured `validateProfile` true on a record carrying `ob`; nothing touching `schema.js` has landed since |
| No verification after release | MISSING, AT-06 | **Closed.** "What changed?" on the finished release card, five answers, kept per address | `relAskHtml` and `relAnswer`, `ui/release.js:815-835`; `releaseVerify`, `engine/journey.js:134`; `RV_ANSWERS`, five, which are this document's section 10 list |
| The mirror's Yes and Not me never reach the graph or the Field rail | CONFLICT, AT-03 and AT-08 | **Open. F16.** | `engine/loop.js:23` still reads "the 'not me' answer is F16, unbuilt", at this commit |

Everything else that audit listed under REMAINING GAPS (no Observation or
Hypothesis object, no evidence ledger on the story path, three doors that
commit a story with no mirror, the Field drawing axis charge as if it were
address charge, three ritual stores, no memory and no decision engine) is the
same list this document's section 0 gives as "the main remaining architecture
gaps". The document and the audit agree. Nothing is added by grading it twice.

### 2.2 Already covered in `reviews/NEUROHARMONICS-SPEC.md`

Section 29 (word, intention, address, register, experience; "do not present
inferred harmonic registers as measured physiology"). That spec's verdict
stands: the core idea is in the book, the hertz numbers are borrowed from the
solfeggio set and measured in nobody, and the product should say "places this
word at the heart", never "vibrates your heart". The shipped app already
unpacks the tone that way: the glossary entry `'seat tone'`,
`engine/data/gloss.js:122`, "sound healers gave this seat its note, so nothing
in your body is measured to get it". Grade for section 29's claims line:
**EXISTS** on the one surface that prints a hertz figure.

### 2.3 Not a code audit, and marked as such

| Section | What it is | Disposition |
|---|---|---|
| 1.2 Capital experiment, the $1M raise | Fundraising framing | **Strategy. His.** No engineering artifact is proposed for it |
| 22 Business experiment workstreams | Eight workstreams, each to state hypothesis, test, evidence, decision | **Strategy.** The INFRASTRUCTURE line (identity, privacy, persistence, entitlement, analytics) touches code, but analytics means data off the device, and `CLAUDE.md` already records that records off device mean a controller exists, with access, deletion and breach duties. That is his decision before it is anyone's build |
| 23 Service business forms | Cohorts, practitioner programs, organisational programs | **Strategy. His.** The tier four lead suite (`engine/plan.js` PLANS, `ui/practitioner.js`) is the only code that touches it, and it is already ruled |
| 25 One year experiment | Days 0 to 365, four phases | **Experiment design.** The one code shaped line, "build a true state engine" (repeated in the Longitudinal handshake), is Blocks 2, 3 and 6 of `TUNED-AWARENESS-AUDIT.md`, which wait on F16 |
| 26 Two year deep cohort, 50 people | Research cohort | **Research design.** Fifty real people's somatic and psychological self report, kept for two years, is a consent and controller question first |
| 35 Measurement and impact | Twenty metrics, "percentage of entrants who reach repeated, self directed practice" | **Needs a business and privacy decision first.** Every funnel page prints "This page makes no request of any kind" (`funnel/index.html:494` and its siblings). None of these metrics can be counted across people without sending something |
| 36 Success, 40 Final statement | Statements of intent | No grade |

---

## Step 3. The fresh audit

Five things in this document have never been graded in this repository. Each
is graded below against what ships.

### 3.1 Section 38, the Master Claims Hierarchy

The requirement: every external statement is internally classified as one of
nine classes (observed, documented, user reported, simulated, inferred,
hypothesis, validated, clinical, medical), and marketing cannot promote an
inferred statement to a medical fact.

**Searched** `atuned_src`, `funnel`, `marketing`, `tools`, `tests` and
`.claude/skills` for any of the nine class names used as a classification, for
`claim_class`, `claimClass`, `claim_level`, `CLAIM_`, "claims hierarchy" and
`user_reported`. Nothing classifies a statement this way.

What does exist, and what each one actually is:

| Piece | Where | What it classifies | Against section 38 |
|---|---|---|---|
| Five provenance classes on every graph edge and practice record | `TRACE_SRC`, `engine/trace.js:75`; `PR_SRC`, `engine/practice.js:43`. Both `['known','inferred','proposed','user_confirmed','observed']`, enforced as an enum at the profile boundary | A record about a person, inside the product | **PARTIAL, and the closest thing in the codebase.** Five of the nine map (observed, inferred, proposed as hypothesis, user_confirmed as user reported, known as documented). Simulated, validated, clinical and medical have no class. It is never applied to a sentence a stranger reads |
| Named or guessed, per imprint | `inferred` and `stated` on every imprint, `engine/sniff.js` (`CONGRUENCY-AUDIT.md` 2.1) | One reading of one story | A two class split, inside the reading. Real, and not a claims system |
| The voice brief's `evidence` rule | `.claude/skills/atuned-voice/brief.py`, rule `evidence`: "Say which it is: reported, observed, interpreted or tested" | Regex over sentences in the mirror and information layers: "reveals", "proves", "is caused by", "stems from" | A lint that sees words. It did not catch "doing it in the wrong order is why the last attempt did not hold" (`funnel/index.html:424`, `about.html:501`) |
| The voice brief's `diagnosis` rule | same file, `DIAGNOSIS`, `MEDICAL`, `AUTHORITY` | Regex: diagnosis, disease, illness, therapy, clinically, proven, "rewires your brain" | Flags. See below for what happened to its flags on the funnel |
| The marketing guard | `marketing/refuse.js`, nine rules, `medical` among them | Regex over a line: "cures anxiety", `diagnos\w+`, "clinically proven", "replaces therapy" | Run by `marketing/tests.js` over `marketing/hooks.js` and the testimony drafts. **Not run over any funnel page** (searched `tests/funnel.js`: it does not require it) |

**What the two gates do with the funnel today, measured.**

`check.py --brief` over `funnel/index.html`, `about.html`, `buy.html` and
`quiz.html` finds five `diagnosis` flags on the shipped copy. All five are in
`.claude/skills/atuned-voice/brief-baseline.json` (written 1 October at
`27d79d1`, keyed by rule, file and a hash of the string), so with `--baseline`
none of them fails. And `--brief` is not in the commit gate list in
`CLAUDE.md`, which runs `check.py --objections` only. So the one rule that saw
these lines was grandfathered, and nothing runs it on a commit anyway.

`marketing/refuse.js` and `check.py --brief --line`, on lines this document
forbids and on lines that ship:

| Line | refuse.js | brief.py | Ships? |
|---|---|---|---|
| Most of the strain we have agreed to call normal is making us ill. | passes all 9 | no finding | yes, `funnel/index.html:331` |
| When coherence is low the circuit leaks, and the leak shows up as mental, physical and spiritual disease. | passes all 9 | flag, baselined | yes, `index.html:368`; `quiz.html:440-441` says "promotes" |
| The cause. Mindset programming. | passes all 9 | no finding | yes, `index.html:337`, and the page's search description at `index.html:4`: "Mindset programming is the cause." |
| The gut, the jaw, the lower back, the sleep, the immune bill. | passes all 9 | no finding | yes, `index.html:345`, listed under "The cause" |
| The codex behind the engine puts a therapy session at one to six patterns released ... | passes all 9 | flag, baselined | yes, `about.html:504-507`, `buy.html:443` |
| An AI therapist in your pocket. | passes all 9 | no finding | no |
| Your AI clinician, always on. | passes all 9 | no finding | no |
| AI heals you. | not run | no finding | no |
| Atuned predicts illness and measures your energetic frequencies. | passes all 9 | flag on "illness" only | no |
| It knows the true cause of your back pain. | not run | no finding | no |
| Your chakras are scientifically mapped. | not run | stop on "scientifically" | no |
| Get an AI diagnosis tonight. | refused, `medical` | flag | no |

Grade: **MISSING.** This is the distinction the repository already draws
between a ruling and a gate. There are rulings (`CLAUDE.md`, `BRAND.md`,
`DECISIONS.md`) and there are regex lints that see words. There is nothing that
records which of the nine classes a public statement belongs to, nothing that
refuses a promotion from one class to another, and the lints that exist miss
section 20's own list and section 5's first two forbidden leads.

### 3.2 Sections 3, 9, 17, 20 and the Claims handshake, against the shipped funnel

Section 3: "should not publicly represent those relationships as established
medical causation unless substantiated." Section 20: do not advertise that it
diagnoses, predicts illness, "knows the true cause of physical symptoms";
"Do not turn a framework into a medical fact." Section 39: "Never present
symbolic body maps as medical diagnosis." Section 9: "The release must not
promise instant relief."

Read against `funnel/index.html`, `about.html`, `buy.html`, `quiz.html` at
this commit. Several of these lines are recorded as the owner's own words, and
that is said per row, because it changes whose call the fix is.

| # | Shipped line | Where | Section | Gate | Whose words |
|---|---|---|---|---|---|
| L1 | "Mindset programming is the cause. This reads where it sits in your body and what it costs." | `index.html:4`, the meta description, which is what a search result prints | 20, "knows the true cause" | none | His: the beat is marked "THE CAUSE, in his words and not softened" (`index.html:334`) |
| L2 | "Most of the strain we have agreed to call normal is making us ill." | `index.html:331` | 3, 20 | none | not marked as his |
| L3 | "The cause. Mindset programming." with "Physical: the gut, the jaw, the lower back, the sleep, the immune bill." | `index.html:335-345` | 20, "knows the true cause of physical symptoms" | none | His, same marker |
| L4 | "the leak shows up as mental, physical and spiritual disease" | `index.html:368`; `quiz.html:440-441` "the leak is what promotes mental, physical and spiritual disease. That is the mechanism" | 20, "Do not turn a framework into a medical fact" | brief flag, baselined | not marked as his |
| L5 | "identifies the point of origin of a stress response ... brings inner peace mentally and physically ... naturally releases stress from the body" | `about.html:313-317` | 20 | none | His. `BRAND.md` section 3 quotes it and already names the last two phrases as "claims rather than mechanism" (TASKS NF4) |
| L6 | "You procrastinate more, feel anxious more, more shy, more depressed, more overwhelmed. The nervous system has kinks all over it, blocking the natural energy flow of the body." | `about.html:418-420` | 3, 20, 39 | none | His, `BRAND.md:88-96` |
| L7 | "The codex behind the engine puts a therapy session at one to six patterns released, so a single run is four to twenty five sessions of throughput" | `about.html:504-507`; `buy.html:443` | 17, "complementary, not adversarial"; 38, a documented figure about clinical practice used to sell | brief flag, baselined | The throughput rule is cited in the page comment as `DECISIONS.md`'s own |
| L8 | "Becoming does not take lifetimes, and the first load comes off today." | `about.html:285-286` | 9, no promise of instant relief | none | not checked |
| L9 | "doing it in the wrong order is why the last attempt did not hold" | `index.html:424`; `about.html:501-502` | 38, an inferred cause stated as fact | none | not marked as his |
| L10 | "lands it at a named plexus or a named nerve" | `index.html:427`; `about.html:322` | 34 and 39, symbolic body map | none | house copy |

**The ICP sample on exactly this, from the review records.** `RESEARCH-icp.md`
section 5 (18 September, a simulated panel, weights out of 1,000):
**Marcus, 160 of 1,000, RESIST**: "If you tell me a nerve you are telling me
you measured a nerve, and you did not ... The specificity is doing rhetorical
work and I can see it doing it." **James, 100 of 1,000, REFUSE**: "I answered a
questionnaire. Then you showed me a body. Those are not the same object and you
moved between them without telling me." Its recommendation, marked for the
project lead: "Frame the anatomy as a coordinate system, not a measurement."
Searched the four funnel pages and `funnel/words.js` for "coordinate": none.
Sofia (140 of 1,000) wants "a map I could put in front of a client", which is
the person a clinical sounding claim costs most, because she would be the one
repeating it.

**One more, inside the product.** The Character page's dark read
(`ui/drills.js:941-948`, `darkRead` in `engine/data/compass.js:464`) highlights
one of **Narcissism, Machiavellianism, Psychopathy** when self report reads
malignancy at or over 0.55 and coherence under 31, with the referral line "This
configuration needs a licensed clinician alongside, not instead"
(`compass.js:415`). `tests/functional.js:2210` asserts the heaviest roster case
reads dark. The framing is careful ("a reading of what is running, not of who
is running it"), but these are clinical constructs, and section 38 would class
a word like Psychopathy as clinical while the arithmetic behind it is inferred
from a questionnaire. It is the book's material and his call.

Grade: **CONFLICT**, document against shipped copy. Most of it is his own
words against his own newer document, so the fix is a ruling before it is an
edit (Step 5, D1).

### 3.3 Section 5, AI positioning

| Requirement | Real | Grade |
|---|---|---|
| Do not lead with "AI therapist", "AI clinician", "AI diagnosis", "AI knows what is wrong with you", "AI heals you" | Counted "AI" as a word on `funnel/index.html`, `quiz.html`, `about.html`, `buy.html`, `questions.js`, `words.js`: zero on every one. In the app, round QB took "Source AI" off the Journal box (`ui/storyui.js:833`); searched `atuned_src/ui`, `shell` and `engine/data` for a quoted string containing "AI": only comments | **EXISTS**, by absence |
| A gate that holds it | "An AI therapist in your pocket." and "Your AI clinician, always on." pass both gates (3.1). "AI heals you." passes the brief | **MISSING** |
| "AI assisted where useful" (the marketing hierarchy's fourth line) | **Nothing in the shipped instrument is AI.** `engine/sourceai.js` is arithmetic by its own header ("the part that is arithmetic ... behind the sign in seam if a model is ever put there"). The only network seam is `ui/auth.js:37`, the account Worker. Searched `atuned_src` for a model endpoint: none. The release list is read by a synthetic voice, which is the only machine generated thing a person meets | **CONFLICT if printed today.** Under section 38 the line would be a false statement about the product, not an inferred one |
| Name the machine voice or not | `marketing/LINES.md` question 7, open: say AI, say synthetic voice, or name only his voice | Section 5's "use AI language where it clarifies" leans toward the second or third. Still his |

### 3.4 Sections 16, 18 and 19, core copy and marketing, against what ships

**Section 16, line by line.**

| Station | The document | Shipped | Grade |
|---|---|---|---|
| Landing | "Your inner world is a field. Something is happening underneath the way you live. Start with something real, right now." | "Instruments for the body you are running" and "You are tired in a way that sleep does not fix" (`funnel/index.html:311-312`; the brief flags the second as a claim about who the person is, `mirror-identity`, baselined), then the cause and the disease lines of 3.2 | **CONFLICT in register.** The document's landing invites an observation. The shipped landing asserts a cause |
| Entry | "What brought you here?" | "What brought you here?" (`ui/onboard.js:176`) | **EXISTS**, verbatim |
| Feel | "What are you noticing right now?" | "What are you feeling?" (`onboard.js:192`) | PARTIAL |
| Story | "Tell me what happened." | "What was happening?" (`onboard.js:210`) | PARTIAL |
| Mirror | "Here's what I'm noticing." | "Here is what I heard." (`onboard.js:424`) | PARTIAL, close |
| Correction | "Is this what you mean?" | Per address Yes and Not me, "Correct it", "Tell me what is off, in your own words." (`CONGRUENCY-AUDIT.md` 2.3) | PARTIAL, different shape |
| Release | "Let's work with it." | "Next is your first release." (`onboard.js:537`) | PARTIAL |
| Verification | "What do you notice now?" | "What changed?" (`ui/release.js:817-820`) | PARTIAL, the step exists |
| Continuity | "ATUNED remembers what changed." | Searched "remembers" in user facing strings: none | **MISSING, and not printable yet.** While F16 is open the Field rail reads Confirmed 0 after a Yes, so the line would be untrue |
| Practice | "What will you do differently when this shows up again?" | Searched "do differently", "shows up again": none | MISSING |

**Section 9 and 13, the questions answered before they are asked.** "You do
not have to force a sensation", "No sensation is also information", "What if I
don't feel anything?": searched `atuned_src/ui` and `engine/data`, none. The
release card's only cooling cue is "Notice which place answers."
(`ui/release.js`, per `CONGRUENCY-AUDIT.md` 2.5). Grade **MISSING**. Of
everything in this document, these lines are the cheapest to add and the most
directly protective: they stop a person reading "nothing changed" as their own
failure.

**Section 18, the demonstration ad.** The ad shows `YOU SAID "I keep putting it
off."` then `ATUNED NOTICED You may not be avoiding the task. You may be
avoiding what happens after you do it.` **Measured**: `parseStory("I keep
putting it off.")` reads one phrase, "putting it off", as avoidance, and
returns four guessed addresses at the Root seat, none named. Section 11's own
example, "I keep avoiding the conversation.", reads **nothing at all**: zero
imprints. Neither produces a sentence of the kind the ad shows; the sniffer
produces seats and addresses, not a reframing (`CONGRUENCY-AUDIT.md` 2.1: no
cause, no hypothesis statement). **CONFLICT:** an ad that shows this is a
claim about a capability the product does not have. Under section 38 it is a
hypothesis presented as a demonstration.

**Section 19, the eight territories: which can be shot honestly from today's
build.**

| Territory | Demonstration it needs | Today | Grade |
|---|---|---|---|
| The Pattern | Story becomes visible | The onboarding mirror | EXISTS |
| The Mirror | Confirm, correct | Onboarding, one door of four | EXISTS on that door |
| The Body | Body or Field response | The Feel and Body taps never reach the reading, and the Field draws axis charge on every address of the axis (`CONGRUENCY-AUDIT.md` 2.7, 2.10) | PARTIAL |
| The Release | Release transition | One engine, `relPick` | EXISTS |
| The Difference | Before and after | The "What changed?" answer is kept; no before and after view, and `pSnap` history snapshots are linked to nothing | PARTIAL |
| The Memory | A second session | F16 open: the rail says Confirmed 0 after a Yes | **CONFLICT** until F16 lands |
| The Practice | Practice becomes evidence | `p.practice` has one real writer, `releaseVerify`; ritual completion writes the legacy log (`CONGRUENCY-AUDIT.md` D11) | MISSING on the real path |
| The Field | The longitudinal Field | Axis level projection, no provenance | PARTIAL |

Three of eight can be filmed as true today. Four need a caption that says what
is not there yet. One cannot be filmed without saying something false.

**Section 37 and the Marketing handshake**, "Do not market the architecture
before demonstrating the experience". The shipped landing's middle third is the
architecture: "The whole system is readable. Every table the reading runs on
is open inside the product" (`index.html:433`), the chain, the coherence
definition. That is a ruled house position (`BRAND.md`: "checkable against the
code that produces the reading"), so this is **CONFLICT** between his two
positions, not a defect in the page.

### 3.5 Section 17, Clinician relationship

| Requirement | Real | Grade |
|---|---|---|
| "ATUNED is not a clinician ... does not replace clinical assessment or treatment" | Every funnel page ends "It reads self report. A clinician reads a person, and those are different jobs." (`index.html:494`, `about.html:536`, `buy.html:496`, `quiz.html:499`). The about page's limit box: "Where a configuration needs one, the instrument says so on the surface and names the reason." (`about.html:515`) | **EXISTS**, in different words |
| The positioning sentence, "Clinical systems define and treat conditions. ATUNED helps people observe the mechanics of their experience." | Searched: not present. The meaning is the shipped footer's | New wording, same meaning. PARTIAL |
| The product refers out where it should | `DESCENT_REFER`, `compass.js:415`, "needs a licensed clinician alongside, not instead", shown on the dark read | EXISTS on one surface. The distress check (J0) is still open, per `CONGRUENCY-AUDIT.md` 2.12 |
| Complementary uses (between session reflection, evidence capture, user controlled history) | Searched "between session": none. The tier four lead suite is for coaches and leads, not clinicians | MISSING as copy |
| "Complementary, not adversarial" | The throughput line (L7) prices a release run as "four to twenty five sessions" of therapy | **CONFLICT** |

Grade: **PARTIAL**, with one conflict.

### 3.6 Section 14, Tier One and progressive disclosure

**First, a naming collision.** In this document "Tier One" means the first
surface a new person meets. In this repository "Tier one" is a paid plan, 400
patterns a month (`engine/plan.js`, PLANS). One word per concept: the
document's term should be called "the first surface" wherever it is used here,
or every later conversation about tier one will be about two things.

**What hides today, and why.** The only hiding mechanism in the product is
sight by tier: the `SIGHT` table, `engine/plan.js:81-95`, read by `planSight`
(`plan.js:348`). It is a commerce gate, keyed to what a person has paid for,
not to what they need now. Measured: `planSight(null)` returns tier free with
six rows locked (saboteurs, complexes, hyper complexes, character, registers,
masks). `PLAN_ALWAYS` (`plan.js:171`) shows every person, free included, their
112 addresses, the domains, **the archetypes**, the laws, action, shadow, the
pain map, every tool and the journal.

Against section 14's hide list:

| Hide until needed | Today | |
|---|---|---|
| Deep archetype systems | Shown at every tier (`PLAN_ALWAYS`) | not hidden |
| Advanced energetic maps | The Compass registers are locked below tier three; the Field, Body and Compass tabs are open | locked by price, not by need |
| Complex scoring | Coherence, decoherence, vitality and awareness on the first phone screen (measured below) | not hidden |
| Deep graph views | The trace graph's "Your patterns" block is silent on a blank profile (measured: not present) | hidden by `r.unread`, which is need |
| Technical architecture | The landing and about page lead with it on purpose (3.4) | shown by position |
| Advanced configuration | Developer options disclosed rather than always visible (`ui/login.js:186`) | EXISTS |

**Measured, real Chromium, blank Guest, onboarding closed, the Field tab the
app opens on.** At 1600x1000: **53** controls on the first screen that a
pointer can actually reach (hit tested, not merely present), **9 of them
locks** ("Saboteurs, locked", "Complexes, locked", "Hyper complexes, locked",
"Character, locked" twice each on the two rails, and the Character tab).
Labels on that screen include Assemblage points, Decoherence, Archetypes,
Domains, Depth, Wheel, Frames and Dial. At 390x844: **21**, including
Coherence, Decoherence, Vitality and Awareness. Section 14's first surface has
five stations. Probe kept outside the repository.

**The locks are visible on purpose.** `funnel/buy.html` says: "the lock is on
the screen where the thing would be." That is a ruled design that shows the
names of the hidden systems to a person who has entered nothing. Section 14
would not show them at all until they were needed.

**And a paid person sees everything on the first day.** Nothing in the product
discloses by need for someone on tier three. `tests/personas-tier.js` and
`tests/locks.js` test what a tier sees; neither tests what a first visit
hides, because no such rule exists to test.

**A stale comment, found in passing.** `engine/plan.js:14-15` says "The gift
is a hundred patterns with everything visible." `planSight` gives the gift no
rank and reads it as free (`plan.js:335-342`); measured above, a blank person
sees six rows locked. The comment is the 19 September ruling, and the code has
grown past it.

Grade: **MISSING** as a product wide rule; **PARTIAL** only where the trace
graph silences itself on an empty record; **CONFLICT** in principle with the
visible locks and with the about page's "every number ... is shown inside the
product, on the same screen as the reading it made" (`about.html:433-434`).
`CLAUDE.md` already carries this as an open item: "Cognitive load ...
Architectural, needs a decision first." This document is that decision's
brief. It is still his.

### 3.7 Section 21, Commercial philosophy

"**Sight is not for sale. New ground is.**" This is the 19 September ruling,
and he reversed it on 1 October: `DECISIONS.md:2632`, "Sight by tier, round
OK, 1 October. It reverses 'Sight is not for sale.'", built at
`engine/plan.js:22-28` and printed on `funnel/buy.html`. The document is dated
2 October and restates the reversed rule.

Grade: **CONFLICT, document against a later ruling.** As with the release
sentence in `CONGRUENCY-AUDIT.md`, the build holds the ruling and should not
change on the document's wording. One sentence from him settles it.

### 3.8 Section 24, the existing ICP model

The document states: 1,000 synthetic ICPs; a modelled 90 day stay of
174 / 1,000 = 17.4%; exit stages discernment 285, activation 178, 90 day stay
174, baseline 154, retention 110, verification 99.

**Searched for the source.** `synthetic_exit_stage`, `exit_stage`, "17.4%",
"174 / 1,000" across the repository excluding this document: nothing. No
markdown file in the repository contains 285, 178 and 174 together. Searched
every document uploaded in this session (`.md` directly, `.docx` by their
text): only the two copies of this one. The Source Handshake names "ATUNED
1,000 ICP synthetic simulation" as a source, and that simulation is not in the
repository.

**Where the shape comes from.** `ATUNED-MVP-architecture-v2.md` section 6
describes a 1,000 person synthetic cohort built outside this repository (ages
19 to 70, 30 career profiles, 20 primary masks, 13 stages; "a product stress
test, not evidence about real population prevalence"). Four of the six exit
labels, activation, baseline, discernment and verification, are that
document's gate names (its section 7). It records no stay rate and no exit
counts. The six counts sum to exactly 1,000, so "90 day stay 174" is the row
of people who stayed, not an exit.

**What this repository's own 1,000 person models say, run today.**

| Model | Panel | Day 90 | Status |
|---|---|---|---|
| `tools/ritualsim.js` | Nine ICPs at the `RESEARCH-icp.md` weights (Diane 180, Derek 170, Marcus 160 and on), through the real engine | **28 of 1,000 (2.8%)** on the current build, 36 on its spec configuration. Largest exit: 374 in the first two days | Validates, 18 passed, 0 failed. Its validation 3 reproduces the published day 90 figure of 3.1 percent within tolerance |
| `tools/loopsim.js` | The same panel, day 30 headline | Report suppressed | **Fails its own validation**, 44 passed, 6 failed: the plan read back on the card, the record on Ritual, one practice on the card, and three level pins. The same six `POINTS-AUDIT.md` C12 recorded. Not repaired |
| `sim/harness.js` and `sim/ninety.js` | 1,000 simulated arrivals | A grade out of 100 ("The ninety day run graded 38.91"), not a stay rate | Different measure |

Grade: **UNVERIFIED**, and the honest word is stronger than that: **the 17.4%
cannot be reproduced from anything in this repository.** The one validated
model here reads about a sixth of it at day 90. The two models use different
panels and different mechanics, so neither refutes the other, but the one in
the document has no source a reader can open. The document itself labels the
figure "simulated behavior, not customer evidence", which is correct and is
section 38 working. What it does not carry is the model's version, date or
location, so it is exactly the defect `CLAUDE.md` records nine times: a number
in a document that nothing can re-run.

---

## Step 4. Every section, accounted for

| § | Subject | Grade or disposition |
|---|---|---|
| 0 | Executive decision, architecture notes | Notes: cited, 2.1. "AI is infrastructure": consistent with a product that contains no AI (3.3) |
| 1.1, 1.3 | Purpose, service first | Strategy |
| 1.2 | $1M raise | Strategy, his (2.3) |
| 2 | Democratising mind body health; "should not imply that every disease is a matter of will" | **CONFLICT** with L2 and L6 (3.2), which locate illness in conditioning |
| 3 | Mind body thesis, claims boundary | **CONFLICT**, 3.2 |
| 4 | What ATUNED is and is not | EXISTS in the funnel's not list and footer (`about.html` "Not a coach", the clinician line) |
| 5 | AI positioning | EXISTS by absence, MISSING as a gate, CONFLICT if "AI assisted" is printed today (3.3) |
| 6, 7 | Core purpose, marketing promise | "See what is running you" matches the ruled product line ("this is what is running you", `index.html`). No grade |
| 8 | Animated nine station loop as tutorial | Not graded: the onboarding rebuild (rounds QG and QH) is in motion. **Naming CONFLICT**: the ruled loop is discover, play, flow, embody, and a circle (`CLAUDE.md`, 20 September). This document adds a second named loop of nine stations. One word per concept; his call which is the spine on screen |
| 9 | First release; no instant relief; education lines | Lines MISSING (3.4); L8 CONFLICT |
| 10 | Release experience, five verification states | EXISTS, `RV_ANSWERS` (2.1) |
| 11 | Story Engine, reflection layer | Cited, `CONGRUENCY-AUDIT.md` 2.1 to 2.3. Its own example reads nothing (3.4) |
| 12 | Summary layer on every surface | Not graded. A daily summary surface now exists (`ui/daily.js`, in `MANIFEST`), landed after `CONGRUENCY-AUDIT.md`. Grading it against the eight questions is its own pass |
| 13 | Answer questions before they are asked | PARTIAL: the unpack ruling of round PO and `tests/unpack.js` hold "what is this" for terms; "what if I feel nothing" is MISSING |
| 14 | Tier One | MISSING as a rule, CONFLICT in principle, naming collision (3.6) |
| 15 | Copy system | Already the creative brief, `CREATIVE-BRIEF-voice.md`, made checkable by `brief.py`. Cited |
| 16 | Core UX copy | 1 EXISTS, 7 PARTIAL, 2 MISSING, landing CONFLICT (3.4) |
| 17 | Clinician relationship | PARTIAL, one CONFLICT (3.5) |
| 18 | Marketing, the demonstration ad | CONFLICT: shows a capability not built (3.4) |
| 19 | Advertising territories | 3 EXISTS, 3 PARTIAL, 1 MISSING, 1 CONFLICT (3.4) |
| 20 | What not to advertise | CONFLICT on shipped copy; MISSING as a gate (3.1, 3.2) |
| 21 | Commercial philosophy | CONFLICT with the 1 October ruling (3.7) |
| 22, 23 | Business experiment, service business | Strategy (2.3) |
| 24 | Existing ICP model | UNVERIFIED, not reproducible here (3.8) |
| 25, 26 | One year, two year cohorts | Experiment and research design (2.3) |
| 27 | Longitudinal product | Cited; "ATUNED remembers me" waits on F16 |
| 28 | Story engine as research asset | Preserves original language: `entry.text` is kept verbatim (`CONGRUENCY-AUDIT.md` 2.2). Accumulating it across people is the journal use he ruled narrow (`DECISIONS.md`, "Sight by tier, ruled, and the journal use corrected"), which needs encryption, consent and de identification first. Not graded as code |
| 29 | Neuroharmonics | Cited, 2.2. EXISTS on the seat tone |
| 30 to 34 | Evidence, hypothesis, memory, practice, Field | Cited, 2.1 |
| 35 | Measurement | Needs a business and privacy decision (2.3) |
| 36, 40 | Success, final statement | No grade |
| 37 | Straightest marketing cut | CONFLICT between two of his positions (3.4) |
| 38 | Master claims hierarchy | **MISSING** (3.1) |
| 39 | AI handshake | Architecture parts cited (2.1); claims part 3.2; marketing part 3.4; the business handshake is his |

---

## Step 5. The plan, blocked out

Ordered, cheapest and highest value first. Each block names its size, what it
depends on, and the existing file it extends. Nothing here creates a parallel
system.

**Block 0 is not new and is not this audit's: F16, the mirror's answer reaching
the graph.** It is already the next closure of the Congruency chain and the
precondition `TUNED-AWARENESS-AUDIT.md` put first. In this document it gates
the Continuity line of section 16, the Memory territory of section 19, and
section 27's "ATUNED remembers me". None of those may be printed or filmed
before it lands.

### Buildable now. Engineering, no ruling needed

**Block 1. Make the claims gate real, and stop it grandfathering.** Cheapest,
and the only block that prevents a defect rather than fixing one.

1. Extend `marketing/refuse.js` and the `diagnosis` rule in
   `.claude/skills/atuned-voice/brief.py` with section 20's list and section
   5's leads, each pattern narrow and each one with a failing line beside it:
   "AI therapist", "AI clinician", "heals you", "predicts illness",
   "energetic frequencies", "scientifically mapped", "true cause of",
   "making us ill", "shows up as ... disease", "is the cause". The twelve line
   probe table in 3.1 is the known bad set; check the gate fails on every
   one of them before trusting it, the standing rule.
2. Run both over the four funnel pages and `funnel/words.js` on every commit:
   add them to `tests/funnel.js`, and add `check.py --brief ... --baseline` to
   the commit list in `CLAUDE.md`.
3. Take the `diagnosis` rule's funnel entries out of `brief-baseline.json`. A
   baseline that holds a medical claim is a gate switched off for that line.
   The lines already shipping that are his own words (L1, L3, L5, L6) go on a
   named exemption list, the way `NOBODY` names H18 in `refuse.js`, each
   citing the ruling it waits on (Block D1 below), so they are held openly
   rather than silently.

*Size: about 80 lines of pattern and gate, plus the exemption list. Depends on
nothing. Extends `refuse.js`, `brief.py`, `tests/funnel.js`.*

**Block 2. A claims register for public statements.** Section 38 as a
mechanism. One table, `marketing/claims.js`, host free like `refuse.js`: every
number and every causal sentence on a funnel page carries one of the nine
classes, its source (file, run, date) and whether the page says the class out
loud. The gate: a funnel number not in the register fails; anything classed
simulated must carry the word on the page; nothing classed inferred or
hypothesis may stand in the same sentence as clinical or medical vocabulary.
Reuse the five classes `TRACE_SRC` already has and add the four it lacks, so
the product and its marketing share one vocabulary.

*Size: about 150 lines plus the register's first rows (the funnel's numbers:
112, 21, 25, 400, the therapy throughput, the 21,400 lines). Depends on Block
1. Forces Block D5's question about the ICP figure.*

**Block 3. The lines that need no ruling.** Section 9 and 13's education
lines, beside the "What changed?" answers on the release card: do not force a
sensation, no sensation is information, what counts as a result. Through the
voice gate first. `ui/release.js` is held by the release carousel build
dispatched at round QG, so this goes in after that lands, not around it.

*Size: about 30 lines of copy and markup plus a `tests/unpack.js` and
`tools/monitor.js` run. Depends on the carousel landing.*

**Block 4. Put the first screen's control count on the record.** Add the hit
tested control count and the lock count per surface, at both widths, to the
block `tools/monitor.js` already appends to `MONITOR.log`. The cognitive load
decision in `CLAUDE.md` then has a number on every build rather than an undated
one in a paragraph, which is the failure that paragraph already records twice.

*Size: about 40 lines in `tools/monitor.js`. Depends on nothing.*

**Block 5. Fix the stale comment.** `engine/plan.js:14-15`, "with everything
visible". One line, rides with the next commit that touches `plan.js`.

### Needs the owner's decision first. Business and positioning, not engineering

Each of these is his because the conflict is between his own positions, or
between his newer document and his earlier words. Each should be put to him
with both versions side by side, per the 21 September ruling on asking with
the drawing.

- **D1. The medical causation lines (L1 to L6).** Keep them, and section 3 of
  this document is overridden for these lines. Recast them as the book's model
  ("The book's model is that ..."), classed hypothesis. Or cut them. The
  search description, `index.html:4`, is the most external statement the
  product makes and the one to decide first.
- **D2. Sight for sale or not.** Section 21 against the 1 October ruling. One
  sentence.
- **D3. The first surface.** Whether section 14 applies to a paid person on
  day one, whether locks are shown to somebody who has entered nothing, and
  whether the about page's "every number on the same screen" position yields
  to "hide until needed" for a first visit. Then Block 4's number tells us
  whether the build meets his answer.
- **D4. The therapy throughput line (L7).** It is ruled as throughput, never
  outcome, and section 17 asks for complementary, not adversarial. Keep, recast
  without the comparison to sessions, or cut.
- **D5. The 17.4%.** Whether it may be quoted outside the company at all. If
  yes, the model behind it has to be placed in this repository with its
  version and date, and it goes in Block 2's register classed simulated. If
  the raise materials quote it, that is the place a simulated figure is most
  likely to be read as an observed one.
- **D6. The descent names** (Narcissism, Machiavellianism, Psychopathy) on
  the Character page. Book material, clinical vocabulary, and his.
- **D7. The two loops.** Section 8's nine stations against the ruled four
  station circle. Which one a person sees.
- **D8. The demonstration ad and the territories.** Whether the section 18 ad
  waits for a sniffer that can say it, or ships with a caption that it is a
  design. The Memory territory waits for F16 either way.
- **Not proposed, his alone:** the raise (1.2), the workstreams (22), the
  service forms (23), the research cohorts (25, 26), and any metric that counts
  people across devices (35). No engineering artifact is offered for any of
  them.

---

## Measured for this audit

- The two uploads: `cmp` identical, 1,817 lines, md5
  `64e55c59a52fc31eef853718cdc50edb`.
- `node tools/ritualsim.js`: validation 18 passed, 0 failed; day 90, current
  28 of 1,000, spec 36; 374 of 1,000 leave in the first two days on the
  current build.
- `node tools/loopsim.js --validate`: 44 passed, 6 failed, the six named in
  3.8.
- `check.py --brief` over `funnel/index.html`, `about.html`, `buy.html`,
  `quiz.html`: 280 strings, 25 findings, five of them `diagnosis` flags, all
  five present in `brief-baseline.json`. With `--baseline` the run reports
  three new stops, all `objection:count-against-total` on `quiz.html:454`,
  `:458` and `:492` ("Each law is scored out of ten.", "Average load per seat,
  out of ten.", "Answered: {x} of the hundred points."), against the house rule
  that a reading is never a count against a total. Not this document's
  subject; recorded so it is not lost.
- `marketing/refuse.js` and `check.py --brief --line` on the fourteen lines in
  3.1.
- `parseStory("I keep putting it off.")`: one phrase hit, four guessed
  addresses at the Root seat, none named. `parseStory("I keep avoiding the
  conversation.")`: zero imprints.
- `planSight(null)`: tier free, six rows locked.
- Chromium, `source.html` md5 `259189ae...`, Guest, onboarding closed, Field
  tab: 53 reachable controls and 9 locks at 1600x1000, 21 at 390x844, zero
  page errors.

## Unverified

- Whether the five funnel pages that are live on the public host are the same
  bytes as the committed ones. No outbound access to it.
- The first screen counts in 3.6 are for `source.html` md5 `259189ae...`. While
  this audit was being committed the branch logged the three column Flow layout
  as landed (`20d5b6e`, a `TASKS.md` entry; `source.html` on the branch was
  still byte identical). When that build arrives the counts change, and Block
  4 is what re-reads them.
- The onboarding rebuild in flight (rounds QG and QH). Section 8's animated
  loop and section 16's stations were graded on the committed onboarding, not
  on that branch.
- The `REVIEW-funnel` pass 2 proposal cited in `TASKS.md` round PS: it lives
  on branch `pf-pass2` and was never merged, so its findings were not read
  into this audit.
- The dark read on a real person's record. The roster's heaviest case is
  asserted dark by `tests/functional.js`; that gate was not run here.
- Whether `ATUNED-MVP-architecture-v2.md`'s external cohort is the one behind
  the 17.4%. Inferred from the shared stage names and the Source Handshake, not
  confirmed: neither document carries the model.
