# Panel of ten thousand

A weighted segment model of the reachable audience, with representative
personas drawn out of it, and five answers the owner asked for.

---

## Method, and what this is not

**This is not ten thousand people.** Nobody can write ten thousand
individuals and this document does not pretend to. It is a **weighted segment
model**: seventeen named segments with explicit sizes that sum to 10,000, each
carrying a distribution rather than a single value, plus twelve fully drawn
personas that make the segments concrete.

**Every number in this file is simulated.** Sizes, shares, conversion rates,
prices, funnel losses and percentages are model output. None of them is a
measurement of human behaviour. Nothing here was said by a real person. No
persona is a living human and none is modelled on one.

Three classes of figure appear, and they are labelled every time.

| Label | What it means |
|---|---|
| **simulated** | Model output. A judgement with arithmetic attached. Not evidence |
| **engine** | Produced by running `engine.js` on fictional persona vectors. Real arithmetic, fictional input. Still not a measurement of a person |
| **measured in source** | Verified by reading `atuned_src/` or by executing it. A fact about the code, not about a person |

**The sampling frame is the reachable audience, not a population.** These
10,000 are people who could plausibly encounter this product through the
channels it will actually have: a shared link, a practitioner's instruction, a
peer mentioning a number, a paid ad against esoteric and performance interest.
It is not a census, so the segment sizes are not prevalences. A segment is
large here when it is easy to reach, not when it is common in the world.

**How the sizes were set.** Reachability times commercial relevance, then
deliberately corrected upward for the people who never buy. The previous two
panels weighted by willingness to pay, which produced a roster where almost
everybody was a prospect. That is the failure mode this model exists to
correct: 3,540 of the 10,000 here, 35.4 percent, produce 0.07 percent of
revenue, and none of those five segments should be chased at all.

**How the CQ distributions were set.** Anchored to engine output. The nine
personas in `atuned_src/engine/data/people.js` were run through `compute()`
and their CQ read off. That fixed the anchors. Segment medians were then placed
relative to those anchors and spread by an interquartile range, with the share
below each tier boundary stated per segment. The engine's tiers are the ones in
`compute.js` line 137: Mastery 90, Embodied 70, Practicing 50, Incoherent 31,
Corrupt 21, Severe 1, Collapsed 0.

**Engine anchors, computed this session, fictional input.**

| Persona | CQ | Tier | DQ | Loaded addresses | Dominant axis |
|---|---|---|---|---|---|
| Rosa, 61 | 100.0 | Mastery | 0.0 | 0 | Sad |
| Sofia, 41 | 56.6 | Practicing | 0.0 | 0 | Sad |
| Angela, 36 | 43.7 | Incoherent | 0.0 | 0 | Sad |
| Marcus, 44 | 37.8 | Incoherent | 0.0 | 0 | Disgust |
| Diane, 46 | 28.1 | Corrupt | 3.5 | 8 | Anticipation |
| Derek, 39 | 15.0 | Severe | 10.1 | 20 | Anticipation |
| James, 57 | 12.0 | Severe | 9.2 | 18 | Anger |
| Ana, 47 | 7.6 | Severe | 22.8 | 41 | Fear |
| Gordon, 58 | 0.8 | Collapsed | 55.2 | 97 | Fear |

**Read that table before reading anything else.** Five of the six ICPs land in
a band the engine names with a moral adjective. Two of the six are handed the
word **Severe**. The product's own ideal customers, priced and courted, are
told by the arithmetic that they are Corrupt and Severe. The previous panel
called the low band vocabulary the most dangerous copy in the product. This is
the same finding with the engine's own numbers behind it, and it is the reason
the tier words appear in four of the five answers below.

**What this model inherits.** The roster and the trust breaks from
`RESEARCH-icp.md` and `DESIGN-mobile-icp.md`. The tier ladder, the pattern
gift, the privacy posture and the practitioner model from `DECISIONS.md`. The
funnel shape from `TASKS.md` section B. The sizes, the prices, the sentences
and the friction ranking are new.

**The adversarial rule this model was built under.** A segment that buys must
be balanced by a named segment that does not, at a real size, with the reason
stated. Panels where everybody buys have told you nothing. Here 148 of 10,000
would pay once the known fixes land, and 44 would pay under the product as it
stands today.

**What would falsify any of this.** One landing page with two headlines and a
count of who reaches the second screen. One quiz with a stated duration and one
without, and the completion counts. One price page with three prices. Each of
those replaces a column of this file with a measurement, and every one of them
is cheaper than the arguing.

---

## The segment model

Seventeen segments. Sizes sum to 10,000. **All figures simulated.**

| # | Segment | Size | Share | Median CQ | Below CQ 50 | Accepted monthly | Chase |
|---|---|---|---|---|---|---|---|
| S1 | Operator founders | 520 | 5.2% | 34 | 88% | 32 | Yes |
| S2 | Performance and endurance | 470 | 4.7% | 22 | 94% | 28 | Yes |
| S3 | Craft skeptics | 430 | 4.3% | 38 | 91% | 24 | Selectively |
| S4 | Somatic practitioners and coaches | 340 | 3.4% | 55 | 34% | 58 | First |
| S5 | Executive readers | 210 | 2.1% | 15 | 97% | 45 | No |
| S6 | Modality stackers | 1,060 | 10.6% | 43 | 78% | 19 | Yes |
| S7 | Esoteric native, phone only | 1,240 | 12.4% | 41 | 80% | 11 | Yes, cheaply |
| S8 | Acute arrivals | 760 | 7.6% | 12 | 98% | 22 | Carefully |
| S9 | Discipline and men's work | 560 | 5.6% | 25 | 95% | 18 | Yes |
| S10 | Protocol buyers | 320 | 3.2% | 33 | 90% | 35 | Yes |
| S11 | Clinician skeptics | 290 | 2.9% | 49 | 52% | 40 | No, but do not insult |
| S12 | Practitioner referred | 260 | 2.6% | 30 | 92% | 16 | Yes, through S4 |
| S13 | Quiz tourists | 2,070 | 20.7% | 36 | 89% | 9 | No |
| S14 | Hard refusers | 690 | 6.9% | 4 | 100% | 0 | Never |
| S15 | Settled, nothing held | 300 | 3.0% | 79 | 6% | 12 | No |
| S16 | Anti metric purists | 300 | 3.0% | 47 | 58% | 14 | No |
| S17 | High load, route out | 180 | 1.8% | 6 | 100% | 0 | Never, by policy |

Panel wide, **simulated**: 8,288 of 10,000 sit below CQ 50, which is where the
moral vocabulary starts. 2,673 sit below CQ 21, which is Severe or Collapsed.
The band names are not an edge case. They are the modal experience of this
audience.

### Revenue shape, simulated

Two scenarios, both run over the same segment sizes. Scenario A is the product
as it stands. Scenario B applies the four fixes the two prior panels already
recommended. Neither is a forecast.

| | Scenario A, as built | Scenario B, fixes applied |
|---|---|---|
| Sees a score | 315 | 1,948 |
| Pays inside sixty days | 44 | 148 |
| Monthly revenue | 1,120 | 3,764 |
| Revenue per person reached | 0.11 | 0.38 |
| Revenue per payer | 25.30 | 25.35 |

**Concentration, scenario B, simulated.** Practitioners and the clients they
refer are 600 people, 6.0 percent of the panel, and 33.5 percent of revenue.
The largest single segment, quiz tourists at 2,070 people, is 0.1 percent of
revenue. The four segments that produce nothing plus the tourists are 3,540
people and 2.80 of 3,764 dollars a month.

---

## The segments in full

### S1. Operator founders. 520.

**Bucket.** 35 to 52. Founder, co-founder or a first operator with equity.
Household income high and volatile. Urban, two screens, a calendar that owns
them.

**Psychographic.** Values throughput and the absence of waste. Identity is
built on being the one who carries it. The fear is not failure, it is the
discovery that the pace was never necessary and the years spent were the
price of a pattern. Buys **time recovered and cost avoided**. Never buys
insight for its own sake.

**CQ, simulated.** Median 34. Interquartile 26 to 43. Incoherent 61 percent,
Corrupt 21 percent, Severe 6 percent, Practicing 11 percent, Embodied 1
percent.

**Seats and axes.** Anticipation as the dominant axis, Shame under it. Seats:
Compulsion at the pelvic floor nerves, Perfectionism at the mesenteric plexus,
Anxiety at the adrenal medulla, Need To Win at the vagus liver plexus.
Saboteurs: Hyper-Achiever, Controller. Hyper complex: Rigidity.

**Willingness to pay.** Median accepted 32 a month, ceiling 60. Prices against
a coach at 200 to 400 a month and against the hour it might return. Refuses
anything that reads as another practice to fail at.

### S2. Performance and endurance. 470.

**Bucket.** 28 to 45. Endurance athletes, tactical and emergency services,
strength coaches, the semi professional and the obsessive amateur. Already pay
for four trackers.

**Psychographic.** Values output under load. Identity is what the body can be
made to do. The fear is the ceiling being structural rather than trainable.
Buys **a limiter named and a protocol to train it**. Pain is information to
this segment, so a pain hook does nothing.

**CQ, simulated.** Median 22. Interquartile 15 to 33. Severe 44 percent,
Corrupt 26 percent, Incoherent 24 percent, Practicing 6 percent. This is the
second lowest median in the buying half of the panel, and it is driven by the
engine's own arithmetic: Courage at 9 with Temperance at 1.8 produces a wide
law spread and a high resistance floor.

**Seats and axes.** Anticipation and Shame, Shock under both. Seats: Need For
Approval at the iliac branches, Shame at the pudendal nerve, Guilt at the
inferior hypogastric plexus, Competition at the aortic plexus, Avoidance Of
Grief at the great cardiac nerve. Hyper complex: Dysregulation.

**Willingness to pay.** Median 28, ceiling 45. Prices against a coaching plan
at 150 a month and a race entry at 120. Cancels the moment a number stops
moving.

### S3. Craft skeptics. 430.

**Bucket.** 33 to 55. Design directors, architects, editors, senior
engineers, anybody whose job is noticing what is wrong.

**Psychographic.** Values precision and evidence of decision. Identity is
discernment. The fear is being taken in, publicly. Buys **a falsifiable
claim** and the visible fact that somebody made a choice rather than a
compromise. This segment is small, expensive to win and disproportionately
loud, which is the only reason to chase it at all.

**CQ, simulated.** Median 38. Interquartile 30 to 47. Incoherent 71 percent,
Corrupt 14 percent, Practicing 9 percent, Severe 6 percent.

**Seats and axes.** Disgust dominant, Anger under it. Seats: Judgment at the
splanchnic plexus, Perfectionism at the mesenteric plexus, Cynicism at the
oculomotor nerve, Superiority at the hepatic nerve. Saboteurs: Perfectionist,
Stickler, Judge, Skeptic.

**Willingness to pay.** Median 24, ceiling 35. Prices against nothing, because
they price craft. Will pay for an instrument and will not pay for an app.

### S4. Somatic practitioners and coaches. 340.

**Bucket.** 30 to 58. Bodyworkers, breath and trauma informed coaches,
movement teachers, unlicensed but trained. Between eight and forty clients.
Income modest and lumpy.

**Psychographic.** Values holding the room. Identity is being the one who can
be relied on. The fear is being the practitioner who put a client in front of
something that harmed them. Buys **a surface she can show a client**, and a
consent and retrieval story she can repeat out loud. The highest value segment
in the panel, and it is not because of her own subscription. It is because each
one carries clients.

**CQ, simulated.** Median 55. Interquartile 44 to 64. Practicing 52 percent,
Incoherent 29 percent, Embodied 14 percent, Corrupt 5 percent.

**Seats and axes.** Sad dominant, Anticipation second. Seats: Self-Silencing
at the vagus nerve, Martyrdom at the intercostal nerves, Need To Be Needed at
the coronary plexus, People Pleasing at the superior laryngeal nerve, Savior
Complex at the posterior cingulate. Mask: Enabling.

**Willingness to pay.** Median 58 a month for herself plus a panel, ceiling 140
where the panel carries clients. Prices against practice management software at
40 and against a supervision hour at 90. Will not pay at all until the
retrieval question is answered.

### S5. Executive readers. 210.

**Bucket.** 48 to 62. C-suite, board seats, managing partners. Highest income
in the panel and the lowest conversion.

**Psychographic.** Values position and the quality of a call. Identity is
having decided correctly under uncertainty. The fear is a number about them
that somebody else can see. Buys **a comparison**, which the product has
already ruled it will not build. That ruling is correct and it makes this
segment structurally unsellable, which is a reason to stop spending on it
rather than a reason to reverse the ruling.

**CQ, simulated.** Median 15. Interquartile 9 to 24. Severe 63 percent,
Corrupt 20 percent, Incoherent 14 percent, Practicing 3 percent.

**Seats and axes.** Anger dominant, Disgust and Shock under it. Seats: Blame
at the thoracic ganglia, Closed Heart at the costal branches, Superiority at
the hepatic nerve, Entitlement at the renal plexus. Hyper complex: Predatory.

**Willingness to pay.** Median 45 where it converts, ceiling 120, conversion
0.05 percent of segment in scenario B. He will read the number once and never
refer. A panel that tells you he evangelises is lying to you.

### S6. Modality stackers. 1,060.

**Bucket.** 28 to 50, majority women. Six or more modalities already tried.
Middle income, discretionary spending routed to inner work.

**Psychographic.** Values being seen accurately. Identity is the seeker, which
is itself a seat: Endless Seeking at the ascension column. The fear is that the
pattern repeats forever and the last modality was the last chance. Buys
**recognition with a mechanism attached**. Every prior modality gave a story;
this one is bought for naming a location.

**CQ, simulated.** Median 43. Interquartile 34 to 52. Incoherent 55 percent,
Practicing 21 percent, Corrupt 15 percent, Severe 8 percent, Embodied 1 percent.

**Seats and axes.** Sad dominant, Fear and Shame under it. Seats: Endless
Seeking at the ascension column, Spiritual Escapism at the dorsal raphe
nucleus, Idealism at the supraoptic nucleus, Need For Approval at the iliac
branches. Weakest laws: Truth and Discernment, which is the exact pair the
three way intake exists to catch and the exact pair this segment does not
understand being asked about.

**Willingness to pay.** Median 19, ceiling 30. Prices against a meditation
subscription at 6 a month and a single session at 120. Will pay small amounts
for a long time, which makes this segment the retention floor of the business.

### S7. Esoteric native, phone only. 1,240.

**Bucket.** 22 to 36. Already fluent in sun, moon, rising, human design, gene
keys. One device, and it is a phone. Lowest income in the buying half.

**Psychographic.** Values a system that resolves. Identity is assembled from
charts and shared in screenshots. The fear is being basic, and being
condescended to. Buys **a new layer that snaps onto the layers they already
run**, and shares it instantly if the screenshot is good. The largest single
source of free referral in the panel, at 12.4 percent of the people and 2.6
percent of simulated revenue.

**CQ, simulated.** Median 41. Interquartile 32 to 50. Incoherent 54 percent,
Practicing 20 percent, Corrupt 16 percent, Severe 10 percent.

**Seats and axes.** Fear dominant, Sad and Shame under it. Seats: Insecurity at
the pelvic nerve, Comparison at the accessory nerve, Fantasy at the splanchnic
root, Doubt at the cortical visual pathway.

**Willingness to pay.** Median 11, ceiling 18. Prices against an astrology app
at 5 a month and a reading at 80. This segment is an acquisition channel that
occasionally pays, and pricing it as a revenue segment will make you delete the
free tier that makes it work.

**And the product currently breaks its promise to them.** Measured in source:
`risingSign` returns a sign only when the birthplace string matches one of nine
hard coded keys in `PLACE`, exactly, case sensitive. The intake field is free
text with the placeholder "City, region". Executed this session: `Chicago, IL`
resolves, `Chicago`, `chicago, il` and `Chicago, Illinois` all return
unresolved. For the segment that came for the chart, the chart does not finish.

### S8. Acute arrivals. 760.

**Bucket.** Any age, clustered 35 to 55. Twelve to twenty four months after a
death, a divorce, a diagnosis or a dismissal. Opens apps at two in the morning.

**Psychographic.** Values the existence of a far side. Identity is temporarily
suspended. The fear is that this is permanent. Buys **shape and an end**, one
thing at a time. Highest intent in the panel and the most exposed to the tier
vocabulary, because the arithmetic puts almost all of them in the bottom bands.

**CQ, simulated.** Median 12. Interquartile 7 to 19. Severe 76 percent,
Corrupt 15 percent, Incoherent 7 percent, Collapsed 2 percent.

**Seats and axes.** Sad and Fear dominant, Shock under them. Seats:
Self-Judgment at the vagus nerve, Collapse at the spinal cord base, Panic at
the lumbar sympathetic chain, Longing at the cardiac nerve plexus, Betrayal at
the thoracic plexus. Hyper complex: Collapse.

**Willingness to pay.** Median 22, ceiling 40. Prices against a therapy hour at
50 to 150 and against the waiting list they are on. Converts well and churns
when the crisis resolves, which is the correct outcome and should not be
engineered against.

### S9. Discipline and men's work. 560.

**Bucket.** 25 to 45, overwhelmingly men. Trades, logistics, military
adjacent, sales. Comes through a group, a podcast or a friend who changed.

**Psychographic.** Values control of self and the absence of excuses. Identity
is the man who handles it. The fear is being seen as weak, and underneath that
the anger having an address he did not choose. Buys **a protocol with a count**.
Rejects the vocabulary of feeling and accepts the vocabulary of load.

**CQ, simulated.** Median 25. Interquartile 17 to 34. Corrupt 33 percent,
Severe 33 percent, Incoherent 29 percent, Practicing 5 percent.

**Seats and axes.** Anger dominant, Shame under it. Seats: Rigidity at the
pancreatic plexus, Force at the splenic plexus, Shame at the pudendal nerve,
Rebellion at the renal ganglia, Self-Silencing at the vagus nerve.

**Willingness to pay.** Median 18, ceiling 30. Prices against a gym at 40 and a
men's group at 60 a month. Will pay for a ladder and a marker and will not pay
for a feed.

**One warning specific to this segment.** The card polarity is masculine and
feminine, and the spec is explicit that feminine is not women. This segment
will read the word and not the footnote. The autonomic naming, left
parasympathetic and right sympathetic, carries the same axis with no exposure.

### S10. Protocol buyers. 320.

**Bucket.** 30 to 50. Quantified self, nootropics, cold exposure, continuous
glucose monitors. Reads specifications for pleasure.

**Psychographic.** Values mechanism and export. Identity is the person who
runs their own experiments. The fear is being sold a placebo with good design.
Buys **the arithmetic, visible**, and the ability to take their data out.

**CQ, simulated.** Median 33. Interquartile 24 to 42. Incoherent 63 percent,
Corrupt 19 percent, Practicing 10 percent, Severe 8 percent.

**Seats and axes.** Anticipation dominant, Fear under it. Seats: Compulsion at
the pelvic floor nerves, Obsession at the pelvic ganglia, Hypervigilance at the
optic chiasm, Overanalysis at the trigeminal nerve, Addiction at the sacral
plexus.

**Willingness to pay.** Median 35, ceiling 70. Prices against a supplement
stack at 90 a month. Highest tolerance for price and the fastest to run the
pattern arithmetic and post the division somewhere public.

### S11. Clinician skeptics. 290.

**Bucket.** 30 to 60. Licensed psychologists, psychiatrists, physiotherapists,
clinical social workers. They do not buy. They decide whether a whole referral
network hears about you.

**Psychographic.** Values scope of practice and the avoidance of harm.
Identity is professional responsibility. The fear is a client arriving with an
app generated verdict and a worsened state. Buys almost nothing and is worth
addressing anyway, because 290 clinicians can shut the door on 340
practitioners.

**CQ, simulated.** Median 49. Interquartile 40 to 58. Incoherent 48 percent,
Practicing 36 percent, Embodied 12 percent, Corrupt 4 percent.

**Seats and axes.** Disgust dominant. Seats: Distrust at the abducens nerve,
Cynicism at the oculomotor nerve, Overanalysis at the trigeminal nerve. Low
load, high law compliance, which is exactly why the arithmetic still puts half
of them below 50 and they will notice that.

**Willingness to pay.** Median 40 for a professional licence if one ever
exists, conversion 0.04 percent as things stand.

**The fastest refusal in the panel is measured in source.** `HCX_LIB` carries
clinical subtitles: `narcissism · histrionic`, `machiavellian · antisocial`,
`depression · BPD · anxiety`, `OCPD · paranoia`, `bipolar · ADHD`,
`schizoid · withdrawal`. `ui/map.js` line 200 draws `x.sub` onto the wheel
beside a bead, and `mapshelf.js` prints it in the shelf. So the product can
render the string `bipolar · ADHD` next to a person's own reading. For this
segment that is the end of the conversation. For S8 at two in the morning it is
worse than that.

### S12. Practitioner referred. 260.

**Bucket.** Follows S4's client base. 30 to 60, mostly women, mid income.

**Psychographic.** Values the practitioner's judgement, not the product's.
Identity is being in good hands. The fear is doing it wrong between sessions.
Buys **what they were told to buy**, which makes this the highest converting
segment in the panel at 10.6 percent of segment in scenario B. Sometimes the
practitioner pays.

**CQ, simulated.** Median 30. Interquartile 20 to 41. Corrupt 34 percent,
Incoherent 31 percent, Severe 27 percent, Practicing 8 percent.

**Seats and axes.** Whatever the referring practitioner works. Sad, Fear and
Shame lead.

**Willingness to pay.** Median 16, ceiling 25, and the decision is not theirs.
Price this as a seat on a practitioner panel, not as a consumer subscription.

### S13. Quiz tourists. 2,070. Do not chase.

**Bucket.** 18 to 40. Takes every quiz. Knows their sixteen letters, their
enneagram number and their attachment style. Entertainment intent.

**Psychographic.** Values a result to post. Identity is fluent in result
formats. No fear engaged, because nothing is at stake. Buys **nothing, ever**,
and will happily consume the entire free tier and the gift of a hundred
patterns.

**CQ, simulated.** Median 36. Interquartile 27 to 46, and the distribution is
close to the panel mean because this segment is a cross section rather than a
type.

**Seats and axes.** Apathy and Anticipation lead. Seats: Comparison at the
accessory nerve, Fantasy at the splanchnic root, Nihilism at the parietal
cortex, mostly low.

**Willingness to pay.** 9 accepted in theory, 0.01 percent convert. 20.7
percent of the panel and 0.1 percent of revenue.

**Why they still matter and must still not be chased.** They are the volume
that makes the free tier look alive and they are the sharing mechanism for S7.
Build nothing for them. Take nothing away from them either.

### S14. Hard refusers. 690. Never chase.

**Bucket.** 45 to 65, senior, mostly men. Gordon's segment.

**Psychographic.** Values being unimpeachable. Identity is the absence of a
problem. The fear cannot be named because naming it is the thing being
defended. Engine anchor: Gordon at CQ 0.8, DQ 55.2, 97 of the addresses
loaded, nothing installed. The highest charge in the roster and the hardest
refusal.

**CQ, simulated.** Median 4. Collapsed 34 percent, Severe 62 percent, Corrupt 4
percent.

**Seats and axes.** Fear and Anger at the ceiling. Seats: Possession at the
gluteal nerve, Blame at the thoracic ganglia, Escapism at the sciatic nerve,
Denial Of Truth at the medial forebrain bundle. Hyper complexes: Rigidity and
Dysregulation.

**Willingness to pay.** Zero, at any price, with any copy. Softening the
opening line to reach them costs S2 and S8, who are 1,230 people and 30
percent of scenario B revenue. **The correct action is to give up on this
segment in writing so nobody proposes it again in six months.**

### S15. Settled, nothing held. 300. Do not chase.

**Bucket.** 55 plus. Rosa's segment. Retired or semi retired, long practice
behind them or simply a life that resolved.

**Psychographic.** Values what is in front of them. No identity invested in
improvement. No fear engaged. Buys nothing because nothing is held. Engine
anchor: Rosa at CQ 100, zero charge, all laws at ten.

**CQ, simulated.** Median 79. Embodied 58 percent, Practicing 30 percent,
Incoherent 6 percent, Mastery 6 percent. The only segment with a meaningful
share above 70.

**Willingness to pay.** 12 in theory, 1 percent convert, and the honest copy
for them is that this is not for them.

### S16. Anti metric purists. 300. Do not chase.

**Bucket.** 30 to 60. Long practice in a lineage. Zen, vipassana, a tradition
with a teacher.

**Psychographic.** Values the tradition and distrusts quantification of inner
life. Identity is the practice. The fear is spiritual materialism, and a score
is the thing they have been warned about. Buys nothing and objects in public,
articulately.

**CQ, simulated.** Median 47. Interquartile 38 to 56.

**Seats and axes.** Disgust dominant. Seats: Dogma at the pineal gland,
Spiritual Pride at the pineal hypothalamic axis, Judgment at the splanchnic
plexus.

**Willingness to pay.** 14 in theory, 1.5 percent convert. Their objection to
the markers at 2,500 and 3,500 is the sharpest external criticism the product
will receive and it is worth reading rather than answering.

### S17. High load, route out. 180. Never sell to.

**Bucket.** Any. Active crisis, acute risk, or a condition under care.

**Psychographic.** Not a commercial segment. They arrive because the ad worked
and the ad cannot tell them apart from S8.

**CQ, simulated.** Median 6. Severe 72 percent, Collapsed 22 percent, Corrupt 6
percent.

**Seats and axes.** Collapse at the spinal cord base, Panic at the lumbar
sympathetic chain, Self-Judgment at the vagus nerve, all near ceiling.

**Willingness to pay.** Zeroed by ruling, not by model. 180 people of 10,000
will reach a result page while in a state where a score, a moral band name and
a clinical subtitle can do harm. **The product needs one route out of the result
page before it has a paid tier, not after.**

---

## The personas

Twelve people. None exists. Each one carries birth data, and eight of the
twelve use a birthplace the engine can actually locate, which is itself the
finding in S7. Every CQ, tier, seat, sign, gate and life path below is
**engine output** computed this session by running `compute()` and
`spiritualOf()` on the persona's vectors. The gene key is the personality gate,
which is the sun at birth, and the design gate is the sun eighty eight degrees
of arc earlier, which is what `geneKey` returns. Human Design type reads
unresolved for all twelve, which is correct: the type needs the full bodygraph
and the module has the sun and the moon.

### Renata Sologub, 43. Co-founder, logistics software. S1.

Chicago born, Chicago based, third round of funding and the first one she did
not enjoy. Started the company with her brother, who left in year four and
still comes to Christmas. She was the operations half and never stopped being
it. Her calendar is booked in nine minute increments because somebody once told
her that ten was a round number people abuse.

**Behaviours.** Eats standing up and would not describe it as a habit. Keeps a
paper list in her back pocket because she does not trust the phone with a list.
Answers messages at 05:40 and again at 23:10 and nothing in between.

**Likes.** Cold rooms, freight timetables, a spreadsheet that reconciles,
being the person who already knew. Has a physical stopwatch on her desk.

**Actually afraid of.** Not failure. That the pace was never required, that she
chose it at twenty six out of something she cannot name, and that the years are
not refundable.

**Birth.** 12 September 1982, 07:15, Chicago, IL.
**Engine.** Sun Virgo, earth, mutable. Moon Cancer. Rising Virgo. Water Dog,
1982. Life path 5. Personality gate 47 line 1, design gate 45 line 3, profile
1/3. Human Design type reads unresolved, correctly.
**Engine reading.** CQ 34.2, Incoherent. Integrity 6.0, Intention 5.7.
Dominant axis Anticipation. Sixteen saboteurs, two hyper complexes, mask
Dysregulation, darkest band Throat, weakest law Patience. Top seats: Envy at
the internal pudendal nerve 4.0, Jealousy at the obturator nerve 4.0,
Self-Silencing at the vagus nerve 3.4, People Pleasing at the superior
laryngeal nerve 3.4.

### Tobias "Toby" Cruz, 34. Wildland firefighter and hundred mile runner. S2.

Boulder born, based in a town he will not name because the trailheads are
already too busy. Two seasons on a hotshot crew, then engine company work
because his knees voted. Runs a hundred miles twice a year and coaches four
people for free. Was told at nineteen that he had a high pain tolerance and has
been paying interest on that compliment since.

**Behaviours.** Weighs his food and will tell you he does not have a problem
with it. Writes his split times on his forearm in pen. Has never once cancelled
a session and describes this as his best quality.

**Likes.** Gradients, cheap diner coffee, gear that lasts, the last four
kilometres when everyone else has gone quiet.

**Actually afraid of.** That the ceiling is structural. That the thing capping
him is not trainable, which would make every hour of the last fifteen years an
argument with the wrong variable.

**Birth.** 3 May 1991, 21:10, Boulder, CO.
**Engine.** Sun Taurus, earth, fixed. Moon Capricorn. Rising Scorpio. Metal
Goat, 1991. Life path 1. Personality gate 24 line 5, design gate 13 line 1,
profile 5/1.
**Engine reading.** CQ 17.2, Severe. Nineteen addresses loaded, thirty
saboteurs, three hyper complexes, mask Dysregulation, darkest band Solar,
weakest law Temperance at 2.0 against Courage at 9.2. Top seats: Need For
Approval at the iliac branches 6.7, Shame at the pudendal nerve 5.3, Guilt at
the inferior hypogastric plexus 5.3, Compulsion at the pelvic floor nerves 4.9.

**Note the collision.** The product would tell this man, who would otherwise
be one of its best customers, that he is **Severe**. He will not argue with
it. He will screenshot it and put it in a group chat as a joke, and then he will
not open it again.

### Nils Hartvig, 47. Design director, hardware. S3.

Portland born, Copenhagen for nine years, back in Portland with a workshop in
the garage. Has shipped two products people still own. Left a studio over a
plastic colour and would tell you it was not about the plastic.

**Behaviours.** Photographs bad signage. Owns one pen and refills it. Will
open a competitor's product and narrate the cost decisions out loud.

**Likes.** Machined edges, a well set paragraph, honest materials, a product
that says what it does not do.

**Actually afraid of.** Being fooled in public. That his eye is the whole of
his value and that it is not as good as it was at thirty five.

**Birth.** 29 November 1978, 02:40, Portland, OR.
**Engine.** Sun Sagittarius, fire, mutable. Moon Scorpio. Rising Libra. Earth
Horse, 1978. Life path 11, master number. Personality gate 34 line 6, design
gate 40 line 2, profile 6/2.
**Engine reading.** CQ 37.3, Incoherent. Zero addresses over the line, five
saboteurs, mask Perfectionist plus Stickler, darkest band Solar, weakest law
Forgiveness. Top seats: Co-Dependency at the pelvic splanchnic nerves 3.5,
Judgment at the splanchnic plexus 3.3, Entitlement at the renal plexus 3.3.

### Camille Ofori, 39. Somatic practitioner. S4.

Asheville, a studio above a bike shop, twenty two clients and a waiting list
she feels guilty about. Trained in two lineages and quietly thinks one of them
overclaims. Her own practice has been thin since her mother moved in.

**Behaviours.** Arrives eleven minutes early to everything. Takes notes on
index cards and shreds them. Will not look at her phone in a session and turns
it face down in a drawer, in another room.

**Likes.** Warm hands, a room that has been aired, clients who cry and are not
embarrassed, the eleven o'clock quiet after the last one leaves.

**Actually afraid of.** That she will hand a client something that harms them
and find out a year later. Second: that nobody is holding her and she has
forgotten how to ask, so the question has stopped occurring to her.

**Birth.** 17 August 1986, 15:55, Asheville, NC.
**Engine.** Sun Leo, fire, fixed. Moon Capricorn. Rising Sagittarius. Fire
Tiger, 1986. Life path 4. Personality gate 4 line 5, design gate 8 line 1,
profile 5/1.
**Engine reading.** CQ 55.8, Practicing. Integrity 7.6. Zero loaded addresses,
six saboteurs, mask Enabling, darkest band Throat, weakest law Detachment at
2.6. Top seats: Need For Approval at the iliac branches 1.9, Self-Silencing at
the vagus nerve 1.5, People Pleasing at the superior laryngeal nerve 1.5. Five
of her six saboteurs read **overshot**, which is the installed pole past the
point where it pays.

### Whitney Bram, 29. Tattooer, and an astrology account with 31,000 followers. S7.

Santa Fe born, Tucson now, works Thursday to Sunday and posts the rest of the
week. Knows her chart to the degree and three of her friends' charts by heart.
Phone only. Has never owned a laptop that worked.

**Behaviours.** Screenshots everything and keeps the screenshots in an album
called evidence. Will not book a client during a retrograde and is ironic about
it in a way that is not entirely ironic. Reads a new system's glossary before
its home page.

**Likes.** A system that resolves, fine line work, second hand jewellery, being
early to something.

**Actually afraid of.** Being basic. And being condescended to by something
that knows less about her charts than she does.

**Birth.** 21 December 1996, 11:05, Santa Fe, NM.
**Engine.** Sun Capricorn, earth, cardinal. Moon Taurus. Rising Pisces. Fire
Rat, 1996. Life path 4. Personality gate 10 line 1, design gate 46 line 3,
profile 1/3.
**Engine reading.** CQ 42.3, Incoherent. Dominant axis Fear. Eight saboteurs,
mask Mania, darkest band Root, weakest law Truth. Top seats: Fear at the lumbar
plexus 2.4, Control at the sacral nerves 2.4, Insecurity at the pelvic nerve
2.4.

**She is the friction case.** She would type `Tucson` or `Santa Fe` into a free
text birthplace field. Measured in source: neither resolves. The rising row
reads unresolved and tells her it needs a birthplace the instrument can locate.
She knows her rising sign. The product has just told her it cannot find New
Mexico.

### Desmond Okoye, 52. Managing director, private credit. S5.

Boston born, London and then Boston again. Two divorces, three children, one of
whom does not call. Has made four decisions that moved a thousand jobs and
sleeps through the night.

**Behaviours.** Reads on paper, annotates in the margin, never on a screen.
Will not use a product his assistant has not already opened. Ends meetings four
minutes early as a signal.

**Likes.** A well structured memo, a first page that carries the finding,
opera, being right on a long horizon.

**Actually afraid of.** A number about him that somebody else can see and
interpret. He does not fear the finding. He fears the audience for it.

**Birth.** 4 June 1973, 18:20, Boston, MA.
**Engine.** Sun Gemini, air, mutable. Moon Leo. Rising Scorpio. Water Ox, 1973.
Life path 3. Personality gate 35 line 2, design gate 63 line 4, profile 2/4.
**Engine reading.** CQ 15.2, Severe. Fifteen addresses loaded, twenty six
saboteurs, two hyper complexes, mask Dysregulation over Rigidity, darkest band
Sacral, weakest law Compassion at 2.0. Top seats: Blame at the thoracic ganglia
5.4, Envy at the internal pudendal nerve 5.0, Escapism at the sciatic nerve 4.7.

### Marta Quental, 45. Secondary school teacher. S8.

Lisbon, the same flat for eleven years, now with one fewer person in it. Her
husband died fourteen months ago in the spring. She went back to work after six
weeks because the alternative was the flat. Her students have been careful with
her and she has noticed and it makes it worse.

**Behaviours.** Marks papers until one in the morning because sleep is the
problem, not the papers. Has three unread messages from her sister that she
will answer. Opens apps at 02:00 and closes them again.

**Likes.** Her own handwriting, the walk to school along the river, a student
who argues, the first coffee.

**Actually afraid of.** That there is no far side. That this is the shape of the
rest of it, and that everyone else has quietly agreed it is time she was better.

**Birth.** 8 October 1980, 04:35, Lisbon, PT.
**Engine.** Sun Libra, air, cardinal. Moon Libra. Rising Virgo. Metal Monkey,
1980. Life path 9. Personality gate 48 line 5, design gate 53 line 1,
profile 5/1.
**Engine reading.** CQ 9.1, Severe. DQ 18.9. Thirty four addresses loaded,
twenty seven saboteurs, four hyper complexes, mask Dysregulation over Predatory,
weakest law Detachment. Top seats: Self-Judgment at the vagus nerve 9.0, Need
For Approval at the iliac branches 8.6, Self-Judgment at the epigastric
branches 7.7, Hatred at the cardiac plexus 6.9. Top saboteur Catastrophizer at
9.0.

**Read what the product would say to her.** CQ 9, the word **Severe**, a mask
labelled **Predatory**, and, if the bead is drawn, the string
`machiavellian · antisocial` beside it. Fourteen months after her husband died.
The arithmetic is the arithmetic. The vocabulary is a choice, and this is the
person the choice is made about.

### Ezra Vanterpool, 31. Warehouse shift supervisor. S9.

Born in Greenwich, raised forty minutes and one income bracket away.
Supervises nineteen people on nights. Joined a men's group eighteen months ago
after his partner said one specific sentence to him, and he has not missed a
Tuesday since.

**Behaviours.** Cold shower every morning and mentions it. Counts things:
reps, days, dollars, how many times he did not raise his voice. Keeps a note
on his phone titled rules.

**Likes.** A clean warehouse floor, being early, his dog, the twelve minutes
in the car before shift.

**Actually afraid of.** The anger having an address he did not choose. If it
was installed rather than chosen, then discipline is maintenance and not a cure,
and he has built an identity on it being a cure.

**Birth.** 27 March 1994, 05:45, Greenwich, CT.
**Engine.** Sun Aries, fire, cardinal. Moon Libra. Rising Aries. Wood Dog,
1994. Life path 8. Personality gate 17 line 1, design gate 58 line 4,
profile 1/4.
**Engine reading.** CQ 25.0, Corrupt. Three addresses loaded, fifteen
saboteurs, mask Dysregulation, darkest band Sacral, weakest law Detachment.
Top seats: Possession at the gluteal nerve 4.6, Scarcity at the iliac nerve
branch 4.3, Resistance at the perineal branch 4.3, Shame Of Desire at the
hypogastric plexus 4.0.

**The word he is handed is Corrupt.** For a man whose whole project is being
above reproach, that is not a diagnostic reading. It is an accusation, and he
will read it as one.

### Hal Brinsmead, 61. Retired quantity surveyor. S15.

Born in Oaxaca to an English father and a Mexican mother, worked forty years in
construction cost, retired at fifty nine with a pension that works. Two
children, four grandchildren, a shed.

**Behaviours.** Walks the same route daily and notices what changed. Repairs
things rather than replacing them. Does not have notifications turned on for
anything.

**Likes.** Woodworking, cricket scores, the radio, his wife's opinion on
whatever he is reading.

**Actually afraid of.** Nothing he would name, and that is not a defence. He
has already done the thing the product sells, slowly, over forty years, without
a word for it.

**Birth.** 30 July 1964, 13:25, Oaxaca, MX.
**Engine.** Sun Leo, fire, fixed. Moon Aries. Rising Scorpio. Wood Dragon,
1964. Life path 3. Personality gate 31 line 5, design gate 24 line 1.
**Engine reading.** CQ 82.2, Embodied. Integrity 9.2, zero loaded, zero
saboteurs, no mask. Highest seat in the whole body reads 0.7. Correctly not the
customer, and the honest copy for him is one line saying so.

### Dr Gwen Achterberg, 36. Clinical psychologist. S11.

Saskatoon. Private practice three days, a hospital contract two. Treats
complex trauma and has eleven years of watching people arrive with an internet
verdict already applied to themselves.

**Behaviours.** Reads the methods section first and the abstract last. Keeps a
folder of screenshots of apps that overclaim. Will not refer a client anywhere
she has not used herself.

**Likes.** A clean formulation, supervision, a client who gets bored of their
own story, evidence that states its own limits.

**Actually afraid of.** A client of hers reading the word Severe at two in the
morning and acting on it. Professionally: being the clinician who recommended
the thing that did it.

**Birth.** 14 February 1989, 09:50, Saskatoon, SK.
**Engine.** Sun Aquarius, air, fixed. Moon Gemini. **Rising unresolved.** Earth
Snake, 1989. Life path 7. Personality gate 49 line 6, design gate 14 line 2,
profile 6/2.
**Engine reading.** CQ 48.8, Incoherent. Zero loaded, zero saboteurs, no mask,
integrity 7.0. Top seat 2.3.

**She is in the file twice.** Once because her birthplace does not resolve, so
the ephemeris is incomplete for her, and once because at CQ 48.8 with nothing
loaded and high law compliance the product still hands her the word
**Incoherent**. She will write about that.

### Trey Saldana, 26. Sales development rep. S13.

Portland. Second year in the job, quota driven, lives with two people he met
online. Has taken every personality test that exists and can recite his four
letters, his number and his attachment style in one breath.

**Behaviours.** Screenshots results and posts them within four minutes. Has
never finished a free trial. Turns notifications off and then wonders why
nothing reminds him.

**Likes.** Formats. A result with a name. Group chats. Being the one who found
the thing first.

**Actually afraid of.** Not much, yet, and that is the point. Nothing is
currently at stake for him, which is why he will never pay.

**Birth.** 11 October 1999, 22:30, Portland, OR.
**Engine.** Sun Libra, air, cardinal. Moon Scorpio. Rising Cancer. Earth
Rabbit, 1999. Life path 4. Personality gate 57 line 2, design gate 53 line 4.
**Engine reading.** CQ 30.4, Corrupt. Zero loaded, zero saboteurs, dominant
axis Apathy, darkest band 3rd Eye, weakest law Temperance. Top seats: Nihilism
at the parietal cortex 2.7, Hypervigilance at the optic chiasm 2.7.

**Note what happens here.** A twenty six year old with nothing loaded and no
crisis gets the word **Corrupt**, because the arithmetic divides a mid range
intention by a mid range integrity. He will find this funny and he will post it,
and the screenshot that travels furthest will be the one that says Corrupt.

### Roland Petrossian, 55. Regional sales vice president. S14.

Boston. Twenty eight years in the same industry, four companies. Four people
left his team last year and each had their reasons. His number is good. His
wife has stopped raising it.

**Behaviours.** Talks first in every meeting. Never reads a link somebody
sends. Describes himself as direct and other people as sensitive.

**Likes.** Winning the quarter, steak, a good watch, being introduced by title.

**Actually afraid of.** Cannot be asked. The defence is the structure.

**Birth.** 2 December 1970, 08:00, Boston, MA.
**Engine.** Sun Sagittarius, fire, mutable. Moon Capricorn. Rising Sagittarius.
Metal Dog, 1970. Life path 22, master number. Personality gate 9 line 3, design
gate 40 line 5.
**Engine reading.** CQ 1.7, Severe. DQ 38.5. Sixty seven addresses loaded,
thirty four saboteurs, four hyper complexes, mask Rigidity over Dysregulation,
weakest law Forgiveness at 1.2. Top seats: Possession at the gluteal nerve 8.8,
Blame at the thoracic ganglia 8.0, Escapism at the sciatic nerve 7.6,
Addiction at the sacral plexus 7.6. Top saboteur Catastrophizer 8.5, then
Nihilist 8.0.

**He holds the most and he will never arrive.** 690 people in this panel look
like this. No ad reaches them, no copy softens into them, and every attempt
costs somebody who was coming.

---

# The five answers

## 1. What words get them to buy

Sentences, not themes. Each block gives what works, what fails, and why it
fails. **All reactions simulated.**

**The single strongest sentence across the panel, unchanged from the prior
study and confirmed here:**

    You are still paying for every charge you never released.

It survives contact with fourteen of the seventeen segments because it is
present tense, second person, mechanical, and contains no adjective about the
person. It fails only with S14, S15 and S16, and two of those three are correct
to reject it.

### S1. Operator founders

**Works.**
- "You are still paying for every charge you never released."
- "Rest reads as a moral failure in your body. This names the seat and what
  holding it costs you this quarter."
- "Fifteen minutes, sixty three questions, one number, and the cost attached
  to it."

**Fails.**
- "Find out who you really are." She already knows and did not ask. The buy
  is cost recovery, not identity.
- "Start your journey." A journey has no stated end and her objection is
  duration.
- "Just five minutes a day." She does not believe it and it insults the size
  of the thing.

### S2. Performance and endurance

**Works.**
- "Held charge costs output. Find out what it is taking off your last ten
  percent."
- "Your nervous system is a training variable you have never measured."
- "Sixty three questions, then a protocol you run in six minutes between
  sets."

**Fails.**
- "Heal your trauma." Frame refusal. Pain is information to this segment.
- "Slow down. Rest." He will not, and now he distrusts the rest of the page.
- "Feel better." Not a metric, so not a claim.

### S3. Craft skeptics

**Works.**
- "Every law is asked three ways, because what you do when it costs you and
  what you do when nobody is watching are different numbers. The gap is the
  reading."
- "The instrument states what it does not know, and prints the interval."
- "A claim specific enough to be wrong."

**Fails.**
- "Anxiety sits at your adrenal medulla." Stated as a finding this is
  precision as costume and he can see it doing rhetorical work. Stated as a
  coordinate the instrument uses, it survives.
- "Transform your life." One word, whole tab closed.
- Any testimonial. A quotation from a stranger is the format he distrusts most.

### S4. Somatic practitioners and coaches

**Works.**
- "A map you can put in front of a client, with the seat named and the
  sentence to run."
- "The story leaves the device. The name never does. You can see who has
  sight of a record and remove it."
- "Your clients down one panel. What has been released, what has not."

**Fails.**
- "Grow your practice." Reads as a funnel and she is the one being funnelled.
- "Hold better boundaries." She has heard it for nine years and it is not an
  instruction.
- Any outcome claim she would have to repeat to a client. She will not carry
  your liability in her own voice.

### S5. Executive readers

**Works, weakly.**
- "One number, what it costs, what to do first."
- "It reads twenty one laws three ways and states its own identification
  rate."
- "Four minutes to the first finding."

**Fails.**
- Anything containing the word **help**. Four of the original nine rejected
  that syllable and he is the sharpest.
- "Wellness", "journey", "mindfulness", in any position.
- "See how you compare." He wants exactly this, and building it turns a
  diagnostic into a leaderboard and corrupts his own answers. Do not sell it
  to him.

### S6. Modality stackers

**Works.**
- "Six modalities told you a story about it. This names where it is held and
  gives you the sentence that releases it."
- "One address at a time, and a count of the ground you have opened."
- "Nothing to believe. The body already kept the ledger."

**Fails.**
- "You are incoherent." The measured end of the relationship. She closes it
  and tells the group chat, and the group chat is the acquisition channel.
- "Manifest", "abundance", "alignment" as a promise. Too loose for the house
  voice and it recruits the wrong expectation.
- "Finally fix yourself." Fix implies broken and the product does not say
  broken.

### S7. Esoteric native, phone only

**Works.**
- "Your chart says what runs. This says where it is held."
- "Sun, moon, rising, year animal, life path, gate. Then the seat loaded
  underneath them."
- "A hundred patterns free, everything visible, no card."

**Fails.**
- "Enter your place of birth", followed by unresolved. Not a copy failure, a
  broken promise, and it fires on almost every real person.
- "Take the test on a computer." One device, and it is in her hand.
- "Unlock" anything behind a price before the first pattern.

### S8. Acute arrivals

**Works.**
- "This has a shape, and you can see it."
- "One thing at a time."
- "It will tell you what it does not know."

**Fails.**
- "Incoherent", "Corrupt", "Severe", "Collapsed". A moral adjective delivered
  by software to a person at two in the morning is a verdict, and a verdict
  ends the relationship at the moment the product was supposed to begin.
- "You are not broken." She did not ask, and now the idea is in the room.
- "Keep your streak." Loss aversion pointed at somebody already losing.

### S9. Discipline and men's work

**Works.**
- "Anger is a held charge with an address. Run the line, clear the address."
- "A count, a ladder, and a marker at two thousand five hundred."
- "No feed, no group, nobody sees it."

**Fails.**
- "Vulnerability", "inner child", "soften". Instant category exit.
- "Feminine pole." The spec says feminine is not women. He will read the word
  and not the footnote. Say parasympathetic, or say left channel.
- "Let us hold space for that." Three words in and he is gone.

### S10. Protocol buyers

**Works.**
- "Coherence is intention times integrity, divided by resistance. Every term
  is on the screen."
- "One release is one sentence, over one address, through one channel."
- "Export the record. It is half a kilobyte and it is yours."

**Fails.**
- "Trust the process." He is here because he does not.
- "Energy healing" with no arithmetic beside it.
- The horizon and the tier rate on the same screen. He will do the division,
  publish it, and be right. Two thousand patterns a decade against a monthly
  allowance reads as a subscription with no end.

### S11. Clinician skeptics

**Works, and this is damage limitation rather than selling.**
- "This is not a diagnostic and does not screen for any condition."
- "It states its identification rate and its interval, and it refuses to read
  a lean inside self report noise."
- "Records are keyed, never named, and never sold."

**Fails.**
- `bipolar · ADHD` next to a bead on a person's own wheel. Measured in
  source. It is the fastest refusal in the panel and it takes 340
  practitioners with it.
- "Each of the 112 addresses is seated at a named plexus or nerve", stated as
  a measurement of a person.
- "Clears trauma." A verb she will report.

### S12. Practitioner referred

**Works.**
- "Camille asked you to run this between sessions. Here is the sentence and
  how long it takes."
- "She can see what you have released. She cannot see anything you have not
  shared."
- "Nine minutes."

**Fails.**
- Anything that positions the app against the practitioner. Loyalty is to the
  person, not the product.
- A score with no practitioner interpretation attached. They came for a
  relationship, not a reading.

### S13, S14, S15, S16, S17. The ones who do not buy

There are no words that make S14 buy. There are no words that should make S17
buy. For S13 the honest sentence is the free tier itself, and for S15 and S16
the honest sentence is an exit.

- **S13, tourists.** Nothing converts them and nothing needs to. "A hundred
  patterns free. Everything visible until they are spent." Say it and then
  leave them alone.
- **S14, refusers.** Any sentence that opens on pain confirms the frame they
  refuse. Any sentence that softens to reach them costs S2 and S8. **Write
  nothing for them.**
- **S15, settled.** "If nothing is sitting on you, there is nothing here to
  run." One line, and it buys more respect than a pitch.
- **S16, purists.** "It is a count of ground opened. It is not an attainment
  about you." That is the only sentence that does not make it worse, and it
  is already the correct copy for the markers.
- **S17, high load.** Not a sentence. A route out of the result page, with a
  number on it, before anything is sold.

### The words that fail everywhere

Ranked by how many of the 10,000 they cost, **simulated**.

| Word or phrase | People it costs | Why |
|---|---|---|
| Incoherent, Corrupt, Severe, Collapsed | 1,645 of the 1,948 who reach a score in scenario B | A moral adjective handed down by software with no standing to judge |
| help | 1,470, concentrated in S1, S3, S5, S9 | Implies a deficit and names the reader as deficient |
| journey | 1,160 | No stated end, and duration is the objection |
| heal, healing | 990, concentrated in S2, S5, S9, S11 | Frame refusal in three segments, scope of practice in the fourth |
| a clinical subtitle next to a bead | 470 directly, and the 340 practitioners behind them | It is a diagnosis the product is not making and cannot make |
| feminine, as a pole name | 530 in S9 | The footnote does not travel with the word |
| Just five minutes a day | 950 | Nobody with a real load believes it |

---

## 2. What they think it is worth, and what they price it against

**All prices simulated.** The tier ladder in `DECISIONS.md` sets patterns per
month and not money, so these are the amounts each segment accepts, not the
prices the product has ruled.

| Segment | Median accepted monthly | Ceiling | Priced against | The sentence that breaks the price |
|---|---|---|---|---|
| S1 | 32 | 60 | A coach at 200 to 400. An hour of her week | "Another practice to fail at" |
| S2 | 28 | 45 | A coaching plan at 150, a race entry at 120 | "The number stopped moving" |
| S3 | 24 | 35 | Nothing. He prices craft | "It is a template with better type" |
| S4 | 58 | 140 with a client panel | Practice software at 40, supervision at 90 | "I cannot see who can pull a client's record out" |
| S5 | 45 | 120 | His own hourly rate | "There is no comparison, so the number is decoration" |
| S6 | 19 | 30 | A meditation subscription at 6, a session at 120 | "It called me incoherent" |
| S7 | 11 | 18 | An astrology app at 5, a reading at 80 | Any paywall before the first pattern |
| S8 | 22 | 40 | A therapy hour at 50 to 150, and a waiting list | A verdict in the first screen |
| S9 | 18 | 30 | A gym at 40, a men's group at 60 | "It is soft" |
| S10 | 35 | 70 | A supplement stack at 90 | The horizon arithmetic, done in public |
| S11 | 40 | 90, licence only | Continuing education at 300 a year | A clinical label printed on a wheel |
| S12 | 16 | 25, often paid by S4 | What her practitioner charges | The practitioner stops recommending it |
| S13 | 9 | 12 | Free | Any price at all |
| S14 | 0 | 0 | Nothing | Everything |
| S15 | 12 | 20 | Nothing | "Nothing is sitting on me" |
| S16 | 14 | 25 | A retreat at 400 | The markers, as an attainment |
| S17 | 0 by ruling | 0 | Care they cannot get | The product should not be the one selling here |

**The four anchors, and which one the product lands on.**

1. **Therapy, 50 to 150 an hour.** `DECISIONS.md` puts a session at one to six
   patterns. S8 and S12 price here and it is the most favourable anchor the
   product has. A month at 22 against an hour at 90 is an easy sentence.
2. **A coach, 150 to 400 a month.** S1, S2 and S4 price here. Also favourable,
   and it is the anchor the practitioner ladder should be sold against.
3. **An app subscription, 5 to 15 a month.** S6, S7 and S13 price here, and
   they are 4,370 people, 43.7 percent of the panel. This is the anchor that
   caps the consumer price, and it is why a consumer tier above about 20 loses
   the volume half of the audience.
4. **Nothing.** S13, S14, S15 and S17 are 3,240 people who price against free
   and mostly should not be moved off it.

**The finding the owner should act on.** Two thirds of simulated revenue sits
with segments anchored on therapy and coaching, and two thirds of simulated
people sit with segments anchored on app subscriptions. **Those are two prices,
not one.** A single consumer number satisfies neither: at 29 it loses S6, S7
and S13, and at 12 it leaves 40 percent of S1, S4 and S10 money on the table.
The tier ladder already has four rungs. The panel's reading is that the rungs
should be priced from the anchors, not from the pattern counts: a volume rung
near 12, a working rung near 29, and a practitioner rung near 59 with the
client panel attached. Patterns per month stay as the mechanism and stop being
the pricing story, because the pattern count is what invites Derek's division.

**And the division is still unresolved.** Age times two hundred against a
monthly allowance reads as a subscription with no end. S10 and S2 are 790
people and they are the two most likely to publish the arithmetic. Either the
release is not uniform and clearing a parent fetter collapses its children, in
which case the ladder shows the collapse, or the horizon and the rate never
appear on the same screen. This is the owner's call and it is now the second
largest pricing risk in the file.

---

## 3. How to communicate with each segment

Channel, register, length, what to lead with, what never to say.

| Segment | Channel | Register | Length | Lead with | Never |
|---|---|---|---|---|---|
| S1 Founders | Peer mention, a private message, one newsletter she already reads | Board paper. Mechanical, no adjectives | Under 60 words. One number | The cost line | "help", "journey", a video before the number |
| S2 Performance | Coach, training group, a race forum | Training log. Imperative | Under 40 words | Output and the limiter | "heal", "rest", anything about feelings |
| S3 Craft skeptics | One screenshot of the instrument, seen unprompted | Specification. Understated | Under 25 words, then let the object talk | The three way design in one sentence | Testimonials, "transform", a stock photograph |
| S4 Practitioners | Direct, and practitioner to practitioner | Colleague. Precise, never selling | 120 words, and answer the consent question inside them | Consent, sight, revocation | "grow your practice", outcome claims she must repeat |
| S5 Executives | A peer on a board, never an ad | Memo. First line carries the finding | Under 30 words | One number and its cost | "help", "wellness", a comparison you will not build |
| S6 Modality stackers | Group chat, a shared link, a friend | Warm mechanical. Plain words, no jargon | 90 words | Recognition, then the mechanism | "incoherent", "fix", spiritual promises |
| S7 Esoteric native | The feed and the share. Phone first, phone only | Fluent. Assume she knows her chart | Under 20 words plus one image | The layer under the chart | "on a computer", a paywall before the first pattern |
| S8 Acute arrivals | Search, a friend, a clinician | Quiet. Short sentences. No comfort | Under 30 words, one action | Shape, and that it has an end | Band names, streaks, "you are not broken" |
| S9 Discipline | Podcast, a group, a friend who changed | Drill. Numbers and verbs | Under 30 words | The protocol and the count | "vulnerability", "feminine", "hold space" |
| S10 Protocol buyers | Forum, a long post, the documentation | Datasheet. Show the formula | As long as it is accurate. 400 words is fine | The arithmetic and the export | Hand waving, "energy" with no term beside it |
| S11 Clinicians | A page written for them, or nothing | Professional. State the limits first | 200 words, limits in the first 40 | "Not a diagnostic", and the interval | Clinical labels, nerve claims as findings |
| S12 Referred | Her practitioner's mouth. Nothing else | Instructional. One task | Under 20 words | What to run and how long it takes | Anything that positions the app above the practitioner |
| S13 Tourists | The share itself | Light. A result with a name | Under 15 words | The free hundred | A price |
| S14 Refusers | None. Stop | n/a | n/a | n/a | Everything. Do not write to them |
| S15 Settled | One honest line on the page | Plain | One sentence | That it may not be for them | A pitch |
| S16 Purists | Do not initiate | Restrained | One sentence if asked | Ground opened, not attainment | The markers as achievement |
| S17 High load | A route out, on the result page | Direct, neutral | Two lines and a number | Where to go instead | A score, a band, a subtitle, a tier |

**Two cross cutting rules the panel produces.**

**Referral carries the number, not the ad.** Five of the seven original
arrivals named a person rather than an advertisement, and in this model S4,
S12, S6, S7 and S13 together are 4,970 people whose entry is somebody else's
screenshot. The ad is the backstop. The number is what travels, so the number
has to be safe to travel, which is the tier word finding again from the
distribution side.

**No video before the score.** Confirmed. A hosted player is an outbound
request on a page about to display somatic and psychological self report, and
the product already has one outbound request too many in the font links.

---

## 4. Where the friction is, ranked by how many people it costs

Scenario A, the product as it stands. **All figures simulated**, except the
items marked measured in source, which are facts about the code.

| Rank | Step | People it costs | Of how many reaching it |
|---|---|---|---|
| 1 | Does not click the offer at all | 6,387 | 10,000 |
| 2 | Abandons the 63 questions partway | 1,382 | 2,665 |
| 3 | Sees the offer, does not start the quiz | 948 | 3,613 |
| 4 | Will not hand over an email to get a number | 563 | 1,284 |
| 5 | **Will not install an app to see the score they were promised** | 406 | 720 |
| 6 | Sees the score, does not pay | 175 | 219 |
| 7 | Installs, never reaches a first release | 95 | 315 |

Rank 1 is the cost of being unknown and it is not a product defect. **Ranks 2,
4 and 5 are self inflicted and together they cost 2,351 people who had already
started.**

**Rank 5 is the worst step in the product.** 406 of 720 people who answered
sixty three questions and handed over an address are then told to install
something before they can see the number they were promised. Pay the score on
the web. The gift of a hundred patterns is a better reason to install than
withholding a number, and it is already ruled.

**Rank 2 has a known fix and a measured argument.** 63 is 21 laws asked three
ways and the spread between the three is the measurement. Cutting to 21 deletes
the reading. State fifteen minutes, show the remainder, name the three way
design in one line, allow a resume. Simulated: finishers rise from 1,284 to
1,988.

### Inside the app, the steps that cost the people who got in

These are ranked against the 315 people who reach the app in scenario A and
the 686 who reach it in scenario B.

| Rank | Friction | Who it touches | Status |
|---|---|---|---|
| 1 | The result page hands a moral band name to 84.4 percent of everyone who sees a score | 1,645 of 1,948 in scenario B | Copy. Unbuilt |
| 2 | A clinical subtitle can be drawn next to a bead on a person's own wheel | Everyone with a hyper complex above the line | **Measured in source**, `ui/map.js` line 200, `HCX_LIB` |
| 3 | The one action that belongs on a phone sits 4,336 pixels down the page | Every phone arrival, which is most of S7, S13 and S8 | **Measured in source** by the prior panel |
| 4 | Tapping the wheel throws the person 1,978 pixels away from it with no back control | Every phone arrival who taps | **Measured in source** |
| 5 | Birthplace is free text matched against nine exact strings | Effectively every real person in S7 who enters one | **Measured in source**, executed this session |
| 6 | Every control explains itself through a hover title, and a phone has no hover | Every phone arrival | **Measured in source** |
| 7 | The persona select is the third control on the screen and offers to be somebody else | S4 and S5 refuse at it | **Measured in source** |
| 8 | No undo. Applying a story bakes charge into the axes irreversibly | Everyone who applies a second story | Named in `CLAUDE.md` as the largest remaining gap |
| 9 | The wheel eats the scroll gesture where the thumb rests | Every phone arrival | **Measured in source** |
| 10 | Mastery at 90 is arithmetically out of reach for anybody with any load | The top of the ladder is decoration | Engine. Rosa reaches 100 with zero charge and every law at ten |

### What the fixes are worth

Simulated, applied in this order. **The attribution is order dependent and the
order is stated.**

| Fix | Payers | Marginal |
|---|---|---|
| Baseline, as built | 44 | |
| State fifteen minutes, show the remainder, name the three way design | 62 | +18 |
| Pay the score on the web, claim and install after | 92 | +30 |
| One object, one action, the verb in the thumb arc | 113 | +21 |
| Mechanical tier words and a cost line under the score | 148 | +35 |

The largest single lever is the last one, and it is the cheapest to build. It
is copy. Four words at the low end of the band table and one line under the
score.

---

## 5. What they think the value is, against what the product thinks

| Segment | The value, in their words | What the product thinks it is | The gap, and who should move |
|---|---|---|---|
| S1 | "It tells me what the pace is costing and gives me an hour back" | A somatic diagnostic that locates charge | The product has no cost line and no delta. Asked for in three panels. **The product should move** |
| S2 | "It names the limiter and I train it" | A release protocol over 112 addresses | Output is never quantified anywhere. The slot is built and empty. **The product should move, or say plainly that it will not** |
| S3 | "It is a real instrument and I can argue with it" | A precise coordinate system | The anatomy is stated as a finding rather than as a coordinate system. **The copy should move** |
| S4 | "A map I can put in front of a client, and a consent story I can repeat" | A single person's private instrument | The practitioner panel is the highest value surface in the panel and it is unbuilt. **The roadmap should move** |
| S5 | "A number I can place against other people like me" | A diagnostic that refuses comparison | Irreconcilable, and the product is right. **He should be allowed to leave** |
| S6 | "It finally tells me where the thing lives instead of telling me a story about it" | The same thing, mechanically | Closest alignment in the panel. Only the band vocabulary separates them. **The copy should move** |
| S7 | "A layer under my chart that resolves" | An engine where the ephemeris is a convergence check, not the product | Half aligned. The rising sign does not resolve for her, so the layer she came for is broken. **The place lookup should move** |
| S8 | "It shows me the shape and tells me there is a far side" | A measurement with a stated interval | The product currently answers with a band name and a percentage. **The result page should move** |
| S9 | "A protocol, a count, and nobody watching" | A release ritual with a meter | Aligned, and the pole vocabulary is the only exposure. **One word should move** |
| S10 | "The arithmetic is on the screen and the record is mine" | Exactly that | The best aligned segment in the panel. Nothing needs to move except the horizon arithmetic |
| S11 | "Something that states its own limits and does not diagnose" | An instrument that does state its limits, and prints clinical labels anyway | The subtitles contradict the posture. **The data should move** |
| S12 | "What Camille told me to run" | A product with its own relationship to the user | The product should not try to own this relationship. **Nothing should move, and nothing should be built to bypass her** |
| S13 | "A result to post" | A diagnostic instrument | No gap worth closing. Leave it |
| S14 | "Nothing, there is nothing wrong with me" | Ninety seven loaded addresses | The gap is the segment. Nobody moves |
| S15 | "I do not know what I would want from it" | An instrument for what is held | Correct. Say so on the page |
| S16 | "A score is the thing my tradition warned me about" | A count of ground opened | Mostly a labelling gap, and the markers are the exposure. **The marker copy should move**, and it already has the right sentence |
| S17 | "Please tell me what to do" | A coaching and growth instrument | The product must not answer this one. **A route out should be built** |

**The three sentence summary of the gap.**

The product thinks its value is **locating charge precisely**. Ten of the
seventeen segments think the value is **being told what it costs and what to do
next**. The location is the mechanism and the cost is the product, and the
result page currently ships the mechanism and withholds the cost, which is the
one line every high paying segment has now asked for in three consecutive
panels.

---

## Who not to chase, stated plainly

**S14, hard refusers, 690 people.** No copy reaches them. Every attempt to
soften the opening line costs S2 and S8, who are 1,230 people and 30 percent of
simulated revenue. Write nothing for them and record that the decision was
made.

**S13, quiz tourists, 2,070 people.** The largest segment in the panel and 0.1
percent of revenue. Build nothing for them and take nothing from them. They are
the sharing mechanism for S7 and the free tier is already the right offer.

**S5, executive readers, 210 people.** The only thing that converts him is a
comparison, and a comparison turns a diagnostic into a leaderboard and corrupts
his own answers. He is 2.1 percent of the panel and 0.1 percent of simulated
revenue in scenario B. Stop designing for him. The prior panel already recorded
that he will use it and never refer it.

**S15, settled, 300 people.** Nothing is held. One honest line is the entire
correct treatment.

**S16, anti metric purists, 300 people.** They will not buy and their criticism
is worth more than their subscription. Do not argue with the markers objection.

**S17, high load, 180 people.** Not a commercial decision. A route out of the
result page, built before any paid tier, and no band name in front of them.

Together: **3,540 people, 35.4 percent of the panel, 2.80 dollars a month.**

**And the inverse, stated with the same force.** S4 and S12, practitioners and
the clients they refer, are 600 people and 33.5 percent of simulated revenue.
The practitioner panel is unbuilt, the consent list is unbuilt, and the
retrieval question that gates her recommendation is unclosed. **The highest
value segment in the panel is waiting on three unbuilt things, and two of them
are `DECISIONS.md` items rather than engineering problems.**

---

## Director notes

**[PL] The tier words are now the single largest commercial item in the file.**
Five of the six ICPs land in a band named with a moral adjective. 84.4 percent
of everyone who reaches a score in scenario B is handed one. It is the cheapest
fix on the list and the largest marginal payer gain in the model, at plus 35 of
148. Mechanical words for the same arithmetic: high resistance, high load, high
drag.

**[TD] `HCX_LIB` prints clinical diagnoses onto a person's own wheel.**
Measured in source. `ui/map.js` line 200 draws the subtitle, and the subtitles
are `narcissism · histrionic`, `machiavellian · antisocial`,
`depression · BPD · anxiety`, `OCPD · paranoia`, `bipolar · ADHD`,
`schizoid · withdrawal`. It is the fastest refusal in the clinician segment and
it takes the practitioner segment with it. The strings belong in a
practitioner or developer surface, not on a person's result.

**[TD] The birthplace lookup resolves nine exact strings.** Measured in source
and executed this session. `Chicago, IL` resolves; `Chicago`, `chicago, il` and
`Chicago, Illinois` do not. The field is free text with the placeholder "City,
region". For the 1,240 people in S7 the layer they arrived for does not
complete. A normalising lookup with a few hundred cities, or a coordinate entry,
closes it without a network call.

**[PL] Price from the anchors, not from the pattern counts.** Two thirds of
simulated revenue anchors on therapy and coaching. Two thirds of simulated
people anchor on app subscriptions at 5 to 15. One consumer number cannot serve
both. Patterns per month stay as the mechanism and stop being the pricing
story, which also removes the invitation to divide a lifetime horizon by a
monthly rate.

**[PL] Build the practitioner panel before any consumer engagement mechanic.**
600 people, 33.5 percent of simulated revenue, and she will not recommend until
she can see who has sight of a client record and revoke it.

**[Owner] The cost line under the score is now asked for by four segments and
three panels.** S1, S2, S5 and S10 are 1,520 people and the largest willingness
to pay in the file. The slot exists in the pass five state line design and it is
empty.

**[Owner] Rule on the horizon arithmetic before the ladder is shown to
anybody.** 790 people in S2 and S10 will run the division and publish it.

**[Owner] Mastery is arithmetically unreachable and sits at the top of the
band table.** Engine: CQ 90 requires near perfect law compliance with
essentially no load. Rosa reaches 100 with zero charge and every law at ten. If
the top band is decoration, either say what it is for or stop showing it as a
destination.

**[PL] A route out of the result page, before the paid tiers.** 180 people of
10,000 reach a score in a state where a band name, a clinical subtitle and a
subscription offer can do harm. The ad cannot tell them from S8 and neither can
the quiz.

---

## What this file is not, one more time

Every size, share, price, percentage, conversion rate and funnel loss above is
**simulated model output**. The CQ readings, seats, saboteurs, signs, gates and
life paths are **engine output on fictional inputs**. The items marked
**measured in source** are facts about the code in this repository, verified by
reading it or by executing it this session. No figure in this document is
evidence about any human being, and none of it should be quoted as research.
