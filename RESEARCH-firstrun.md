# The first run, run and researched

Dani Sorensen, UI UX architect. 26 September 2026.

**What this is.** The evidence behind the revision at the head of
`DESIGN-firstrun.md`. Ordered in FK, his words: "see what the software is,
run it at a high level, simulate it a few times with the ICPs, get their
picture", and "go out to the internet, find out what makes for the most
engaging type of thing that's going to pull people in". Two halves: what a
brand new person meets in the build today, walked six times as six of the
project's own reference profiles, and what outside sources say works for
pulling a person in and giving them something to do.

**Nothing under `atuned_src/` moved for this file, and `source.html` was not
touched.** The build was made from the committed tree into a scratch folder.

---

# 1. Method

**The build.** Commit `acc8181`, exported with `git archive` and built with
`atuned_src/BUILD.sh` into a scratch path, md5
`244e01ee1a15bcea719660b695f6e60f`. Real Chromium through Playwright, one fresh
browser context per walk so nothing is remembered between them, at 1600 by
1000 and 390 by 844.

**The walk is reproducible.** `proto/firstrun/walk.js` takes a built file and
an output folder and prints every number in section 2 and 3 that is marked
measured. The curated screenshots are in `proto/firstrun/observed/`, numbered
in the order a person meets them.

**The counter.** A control is counted when it is a button, link, input,
select, textarea or tab stop, has a box, is not hidden or disabled, and
overlaps the viewport. **This is not the counter that measured 71 on 19
September**, so 71 and the 102 below are not a trend. Compare this counter
with itself.

**The people.** Six of the reference profiles from `RESEARCH-icp.md` and
`atuned_src/engine/data/people.js`, each walking the path their own recorded
words predict. Grid levels are the ones the voice skill assigns: Angela 5,
Derek 7, James 3. **Every line of what a person thinks is simulated.** What
the screen showed them is measured.

**The research.** Web search, 26 September. The page fetcher was refused by
the network proxy for every site tried (nngroup.com, appcues.com,
revenuecat.com, purchasely.com, retention.blog), so each source below was read
through its search result summary, not the full page. Every claim carries its
URL. Figures quoted from a source are the source's own and should be read at
the source before they are repeated to a customer.

---

# 2. What a stranger meets today, measured 26 September

| Moment | 1600 | 390 | Screenshot |
|---|---|---|---|
| Boot lifts, first paint to `booted` | 5.5 to 5.7 s | 5.4 s | `01-boot-390.png` |
| Controls in view on the landing | 102 | 22 | `02`, `03` |
| Words in view on the landing | 172 | 15 | `02`, `03` |
| Any instruction in view on landing | none above the wheel; the four doors in the right rail | none. The doors sit 3,216 px down | `03-landing-390.png` |
| What the profile picker says | "Custom" | "Custom" | `02` |
| Console errors across every walk | 0 | 0 | |

**The boot is the strongest thirty seconds the product owns and it is
followed by a cliff.** The overture resolves into the seven colour ring and
the mark (`01-boot-390.png`), then lifts onto a wheel with every label, both
rails and a tool bar, with nothing on a phone that says what to do. AU12 logged
the doors at 3,066 px down on 25 September; they are at 3,216 now.

**The blank Field still asserts a reading about nobody.** On a profile with
nothing entered, the right rail prints archetypes at 26, 19 and 19 percent and
a first domain at 100 percent, the wheel lights Warrior and Sage, and the left
rail captions "Warrior + Sage" (`02-landing-1600.png`). This is AV24, logged
25 September, still present. On Summary it now sits beside the product's own
sentence contradicting it: "a number off a default is a number about the
default and not about you" (`10-james-summary-1600.png`). **New:** Ritual on a
blank profile says "The root is carrying the most, so the body track is what
your state calls for" (`11-sofia-ritual-390.png`). The unread guard does not
reach Ritual.

---

# 3. Six walks

## Angela, 36, seeker, level 5. At 390, from a group chat.

She knows the word Story, so she taps it (`04-angela-typing-390.png`). A
blank box, "What happened. Write it the way you would say it out loud." She
writes:

> My sister called again and I felt the old tightness in my chest. The same
> guilt, the same shame. I said yes when I meant no and then I was angry at
> myself all night.

**This is the best moment in the product and it is already built.** As she
types, her own words light in place: tightness, shame, "said yes when",
angry. The panel under it fills with what they touch, and at the throat it
reads Self-Silencing and People Pleasing (`05-angela-typing-1600.png`).
Simulated: "That is it. That is the thing." It is the "names the thing I have
been circling" she asked for in `RESEARCH-icp.md` section 3, delivered in
about twenty seconds of typing.

**Then she presses Commit and the product takes it back.** The box empties,
the panel empties, and it says: "You have committed 1 story and nothing
reaches the line yet. An address shows here once it does."
(`06-angela-after-commit-390.png`). On the Field nothing on the wheel moved;
the rail now reads "0%" beside "21 laws to answer", CQ prints "0%" in the
largest numeral on the left rail, and "Carrying: nothing yet, 38 sitting
under the line" (`07-field-after-one-story-1600.png`). The four doors are
gone, because the unread guard has lifted. Simulated: "I told it something
real and it gave me a zero."

**Measured: the first story never crosses the line, the second does.** The
comment at `ui/imprints.js:143` states why: `applyStory` lands 0.35 of what it
reads, so a first story of about sixty words usually leaves every address
under 4. Committed a second time with a second story, the rail reads
"Carrying 3 addresses", Shame at the root, and the wheel draws the story's
path through the rings (`08-field-after-two-stories-1600.png`). **The first
visible change on the Field costs two stories, and nothing tells a person that
a second one is what it costs.** She stops at the first commit.

One more thing she met, for the engine seat and not this file: "angry at
myself" put Pride, Arrogance and Competition in her pending imprints beside
Envy and Jealousy. For a level 5 reader who came to be seen, the first words
the instrument hands back about her include Arrogance.

## Derek, 39, high performer, level 7. At 1600.

He wants the limiter, so he starts at the first tab, Energetics
(`09-derek-energetics-1600.png`). 89 controls and 478 words in view. The
first thing on the surface is a five line paragraph: "Your energetics were
fixed at the moment you were cut from your mother." Then a birth form, a Save
button disabled with "Enter a name or a date of birth first", and a bar: "0
answered, 63 left". The questions are below the fold. Nothing on the screen
says fifteen minutes, which is the one line `RESEARCH-icp.md` measured as
worth 29 points of completion on the panel. Simulated: "Where is the first
question." He scrolls. He is the one ICP who would do all 63; the surface
makes him read before it lets him.

## James, 57, C suite, level 3. At 1600.

He opens Summary because it says it is the summary
(`10-james-summary-1600.png`). The centre says nothing has been entered. The
right rail, on the same screen, prints three archetype percentages, a domain
at 100, "Heaviest Root 0.0" and "Most shut Truth at the throat". Simulated:
"It says it knows nothing and then it tells me what is shut in me." He has
the evidence he came for that this is a toy. He leaves. BUYERS.md says he is
not the market, and the storyboard serves him with the box on the check in;
what loses him here is a contradiction, not a length.

## Marcus, 44, creative director. At 1600.

He tests the instrument: Frames, then Dial (`13-marcus-frames-1600.png`).
The drawing holds up, which is what he needed from `RESEARCH-icp.md` section
1: "one screenshot of the instrument that is clearly not a template". He opens
the profile picker and finds "Custom" above fourteen people by name, age and
trade: "Sofia, 41, somatic practitioner", "Lance, 54, author". Nothing says
these are worked examples. Simulated: "Who are these people and why are they
in my app." For him they are the fastest route to a loaded Field, and today
they read as somebody else's data.

The Help button, a glyph, holds the best orientation sentence in the product:
"The wheel is your field. The rail on the left is what you are made of, the
panel on the right is what the instrument reads." (`14-help-sheet-1600.png`).
That sentence is his ruling that top, bottom, left and right each carry a
logic, said in one breath. A stranger who never presses the glyph never reads
it.

## Sofia, 41, somatic practitioner. At 390, eleven at night.

She asked in `RESEARCH-icp.md` section 4: "Tell me what to run and how long it
takes." Ritual answers exactly that: Box Breathing, called for, 5 minutes,
with a "When" row whose example reads "after I put the kettle on"
(`11-sofia-ritual-390.png`). **That When row is the most valuable control a
first run could reach and nothing leads to it.** It is also justified on this
screen by a reading that does not exist ("the root is carrying the most" on a
blank record), and Sofia is the ICP who notices when a map claims more than it
measured.

## Diane, 46, founder. At 390, between meetings.

She scrolls 3,216 px to the doors and takes "Read nine sentences". **Nothing
in view changes.** The tapped button gains a border; the sentences open 2,056
px from the top of the viewport, about 1,200 px below the bottom of her screen
(`walk.js`, measured). Scrolled to by hand, every sentence is cut off after
about thirty characters, and the name beside each is Greed, Gluttony, Lust,
Treachery (`12-diane-nine-sentences-390.png`). The truncation was named 19
September in `reviews/QUESTIONS-onboarding.md`; the off screen open is new.
Simulated: "I pressed it and nothing happened." She is gone before the
sentences load.

---

# 4. What the six walks agree on

1. **The product has a real "about me" moment, and it is the live highlight
   while a story is typed.** It lands in about twenty seconds of typing, in the
   person's own sentence, and nobody is led to it.
2. **The first act is punished.** The first commit erases what was found and
   answers with "nothing reaches the line" and a large 0 percent. The first
   visible change on the Field costs a second story nobody asked for.
3. **The first screen after the boot is the most loaded screen in the
   product**, and on a phone it carries no instruction at all.
4. **Three surfaces a stranger reaches in the first minute state a reading
   that is not there** (Field rail, Summary rail, Ritual). The first run cannot
   ship on top of them; a person asked for their name and then told what is
   shut in them by a blank record will not trust the second thing it says.
5. **The parts a tour would describe already exist and work**: the highlight,
   the address that opens on a click, the release, the When row, the Help
   sentence. What is missing is the order and the one object that leads from
   one to the next. That is the argument for performing the loop rather than
   describing it.

---

# 5. External research, with sources

## 5.1 Tours in front of a product do not help

Nielsen Norman Group ran a quantitative test with 70 people on four mobile
apps using deck of cards tutorials. People who read the tutorials completed
tasks no more successfully than people who skipped them, and NN/g recommends
against the pattern; where one is used, keep it short, one concept per card,
with a visible skip.
<https://www.nngroup.com/articles/mobile-tutorials/>
<https://www.nngroup.com/articles/onboarding-tutorials/> (contextual help over
up front instruction).
`reviews/QUESTIONS-onboarding.md` section 6 already carries the same study's
ease ratings, 4.92 for readers against 5.49 for skippers.

**Here:** the storyboard's loop screen, four presses of Next through four
stations with a line each, is a four card deck. It is the part of the current
draft the evidence is against.

## 5.2 The first lesson is the onboarding

Duolingo puts a full lesson before the account ask ("gradual engagement"), so
the product's core value is the first thing a person does, and registration
lands after it as a small step.
<https://www.appcues.com/blog/gradual-engagement-mobile-app-first-screen>
<https://goodux.appcues.com/blog/duolingo-user-onboarding>
Duolingo's 2022 move to a single path was made, in von Ahn's words, for
"decreasing confusion and increasing learning outcomes", so a learner never
has to wonder what to do next.
<https://blog.duolingo.com/new-duolingo-home-screen-design>

**Here:** AN3 already says the core loop is the tutorial and day one done is
running it once. The research says the same thing from outside: the opening
should be one turn of discover, play, flow, embody, done, not described. When
accounts arrive, the sign in ask belongs after that turn and not before it.

## 5.3 Asking makes people start, and only the loop makes them stay

Irrational Labs and Headspace tested onboarding variants. Asking a few
questions and then recommending the same Basics course to everyone roughly
doubled course starts, beating both a truly personalised match and no
questions at all; the questions created the feeling of fit. A concrete plan
for when and where raised app opens 7.5 percent and unique open days 4
percent. **But active meditation days did not rise**, because nothing after
the first step reinforced it.
<https://kristenberman.substack.com/p/lessons-on-habit-formation-from-an>
<https://www.purchasely.com/blog/headspace-behavioral-science-onboarding-experiment>

**Here, two things.** The When row on Ritual is the plan that measured 7.5
percent, it is already built, and it should be where the first turn ends.
And his floated idea of a few more questions after the signal test is exactly
the lever this study measured: it raises starts. It did not raise practice,
and in this product a question that changes nothing it computes is a claim the
house voice does not allow. That is recorded as open in the design, with his
own hedge, not as a recommendation.

## 5.4 Say what is not ready, and show it greyed rather than empty

WHOOP gives a Sleep score after the first night and holds Recovery greyed for
four days while it learns a baseline, saying so; full calibration takes 30
days. <https://support.whoop.com/hc/en-us/articles/360019622573-What-is-the-Recovery-calibration-period->
Oura says its long term metrics are "still calibrating" and reveals some only
after a baseline of about two weeks.
<https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score>

**Here:** "nothing reaches the line yet" is a calibration state told as an
absence. The nearest neighbours draw the calibrating thing faintly and name
when it fills. The 38 addresses sitting under the line after Angela's first
story are real and computed; the Field can draw them faint where they sit.

## 5.5 A head start that is real makes people finish

Nunes and Dreze, 2006: car wash cards needing eight stamps, one printed as
eight empty and one as ten with two already stamped. 34 percent of the head
start group finished against 19 percent, and they came back sooner.
<https://www.coglode.com/nuggets/endowed-progress-effect>
<https://en.wikipedia.org/wiki/Goal_pursuit>

**Here:** a person who performs the first turn in the opening arrives on the
Field with one closed circle that they actually made. That is the endowed
head start with none of the fakery, and LD1 already rules that a closed
circle is the thing the ladder counts.

## 5.6 Put something in that makes the next visit better

Nir Eyal's Hook: the investment phase stores value (content, data, effort) and
loads the next trigger.
<https://amplitude.com/blog/the-hook-model>
BJ Fogg: behaviour happens when motivation, ability and a prompt meet, and
raising ability beats raising motivation; a tiny habit is anchored to
something the person already does. <https://www.behaviormodel.org/>

**Here:** the first story is the stored value, and the When row is the anchor
("after I put the kettle on" is already a Fogg anchor in the product's own
example text). Push notifications are in scope for the accounts product and
not built; when they are, the permission is asked at that row, after the
value, the way Duolingo re-times its permission asks.

## 5.7 Time to the first real value

Amplitude's time to value writing puts high performing products at under
five minutes to the first experience of core value.
<https://amplitude.com/blog/time-to-value-drives-user-retention>
Treated here as an industry benchmark, not a law.

**Here:** today the "about me" moment is reached only by a stranger who finds
Story unprompted. The revision puts it at about two minutes and the first
address on the Field at under three.

## 5.8 Teach through the thing itself, in four beats

Nintendo's four step structure, from Koichi Hayashida on Super Mario 3D World:
introduce a mechanic safely, develop it, twist it, conclude, in about five
minutes. <https://www.gamedeveloper.com/design/the-secret-to-i-mario-i-level-design>
Valve on Portal: playtesters called the first build "a great tutorial, I
can't wait to play the actual game" when it was the game; teaching through
test chambers worked, and what it lacked was a reason, which became GLaDOS.
<https://www.gamedeveloper.com/design/thinking-with-portals-creating-valve-s-new-ip>

**Here:** the loop already has four beats and they close. Portal's lesson is
the sharper one: teaching the mechanics is not enough without the reason to
care, and in this product the reason is the person's own sentence lighting up.
The opening should put that first and the mechanics after it.

## 5.9 One guide, in person, for the one who brings others

Superhuman onboards every new user in a one to one session of about thirty
minutes and credits it with activation; Rahul Vohra's line is that
gamification does not work and game design does.
<https://review.firstround.com/superhuman-onboarding-playbook/>
<https://www.thetwentyminutevc.com/rahulvohra-2>

**Here:** Sofia is the practitioner who brings clients (`RESEARCH-icp.md`
section 5). The practitioner view is in scope for the accounts product. The
same opening, run with a practitioner beside the person, is this product's
concierge route. Noted for the practitioner design, not built here.

## 5.10 Show a worked example when the screen is empty

NN/g on empty states: a blank screen is a teachable moment, and starter
content lets a new person tinker without consequence.
<https://www.nngroup.com/videos/empty-states-in-application-design-guidelines/>

**Here:** fourteen worked examples already ship, behind a picker that reads
"Custom". Marcus is the person they would serve.

## 5.11 Adjacent products that got the first minute right

Finch opens on hatching a companion the person names, then one easy goal, so
self care reads as care for something that grows.
<https://ixd.prattsi.org/2026/02/design-critique-finch-self-care-pet-ios-app/>
Noom's quiz runs to about 113 screens and holds because every answer is given
something back and progress is always visible.
<https://www.retention.blog/p/the-longest-onboarding-ever>
<https://www.revenuecat.com/blog/growth/web-to-app-onboarding-funnel>

**Here:** Finch is the nearest neighbour to "the avatar is the centrepiece".
Noom is the evidence behind the funnel's 63 questions working, if and only if
each answer returns something; it is not an argument for questions in the app
opening.

---

# 6. Found in passing, for the backlog, not dispatched

Each is measured above with its screenshot. None is built by this file.

1. AV24 still present: blank rail prints archetype and domain percentages and
   the wheel lights Warrior and Sage. Summary now contradicts it on one screen.
2. Ritual states "the root is carrying the most" on a blank record.
3. CQ prints "0%" in its largest numeral after a first story, which reads as a
   score of zero. A reading is not a score.
4. The first commit's empty panel line is true and lands as a refusal. The
   revision proposes the calibrating render instead.
5. On a phone, "Read nine sentences" opens about 1,200 px below the viewport,
   and the sentences are truncated at both widths.
6. "angry at myself" produced Pride, Arrogance and Competition as pending
   imprints. For the engine and voice seats.
7. The profile picker reads "Custom" and lists fourteen worked examples by name
   with nothing saying they are examples.
8. Energetics opens on a five line paragraph and a birth form before the first
   question, and does not state the time the 63 take.
