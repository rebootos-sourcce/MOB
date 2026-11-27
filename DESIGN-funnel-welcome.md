# The funnel welcome. Storyboard and draft copy.

**Status: a draft for his reaction, 26 September. Nothing is built and
`funnel/` was not touched.** The brief is `TASKS.md` FH, and his words are
quoted from there rather than remembered. This file owns the screens between
"a person has given a name and an email" and "a person answers question one".
It does not own the app's own onboarding, which FH dispatched separately, or
the founding offer system, which FH dispatched as its own design spec.

Why a new file and not an old one. `COPY.md` is the bucket rules, not
surfaces. `COPY-questions.md` is questions with no drafts in it by its own
first line. `DESIGN-onboard.md` is the stopped record of the app's onboarding,
a different product surface. `BRAND.md` section 4 is where his mission capture
already lives, and part of this dictation is sent back there below. One file
per concern, so the funnel welcome gets its own.

His brief, verbatim: "For the funnel, not the person that put in their first
last name and email, and they're ready to take the test, it slides to the next
page and says actually we need a storyboard all this out. So I'm just going to
put out some information, we can figure out where it needs to go."

And his list of what the page has to carry, verbatim: "Then we need a
description of the tools. We need a description of the full product loop. We
need the purpose, benefits, results. This is a results based product. We have
to note that this is in an alpha state."

---

## 1. Where it sits, and what exists today

    landing          funnel/index.html            built
    capture          first name, last name, email NOT BUILT
    welcome          the three slides below       NOT BUILT, this file
    the test, open   funnel/quiz.html viewOpen()  built, two lines added below
    the questions    funnel/quiz.html viewQ()     built, untouched
    the reading      funnel/quiz.html viewRead()  built, untouched
    the offer        buy page or after reading    NOT BUILT, see section 5 item 13

**There is no name and email capture in the funnel today.** Checked: no
`email` field anywhere in `funnel/`. The landing's "Take the test" goes
straight to `quiz.html`. So this storyboard sits after a screen that does not
exist yet, and that screen changes two lines already shipped. Both are in
section 5, items 14 and 15, because they are truth defects the day the email
field ships and not copy preferences.

---

## 2. His dictation, sorted by job

He said it himself: "we can figure out where it needs to go." Most of it
does not go on this screen. A welcome between an email and a test has one
job, which is to get a person into question one knowing what they are about
to hand over and what they get back. Everything else is somebody else's page.

| His material | Where it goes | Why |
|---|---|---|
| "Welcome to Attuned, name. You are here because you want to see what's running you ... as shiny as we used to." | slide 1 | who this is for, in his opening |
| "Attuned finds your story ... techniques and tools to repair it" | slide 2 | what it does and what moves, which is the results he asked for |
| "all nervous systems are the same, but the stories that power them are not" | slide 2, as the heading | the one sentence in the block that is mechanism and his |
| "The words are mapped to the addresses" | slide 2 | true of the sniffer, see section 4 |
| "This is not done through AI" | slide 2, narrowed | true, and a reader will ask |
| the tools, the loop | slide 3, and the tools on demand | he asked for both by name |
| "note that this is in an alpha state" | slide 4, the test's own open screen | it bears on the reading about to be produced |
| "The founder first created this ... higher power" | `BRAND.md`, as a signed note, if at all | founder origin, which his own FH split names as brand material |
| "These tools are directly from the mechanics of being and the codex of soul mechanics" | the about page, as a source line | a citation, not a welcome |
| "the first 100 people ... 25 percent off" | never on this screen | the offer system, dispatched separately, and see item 13 |
| "my committed guinea pigs, my angels" | internal only | see item 13 |

---

## 3. The storyboard

**Four screens, three of them new.** Three slides and the test's existing open
screen, which gains two lines. Horizontal slide between them, his word
("it slides to the next page"), and a cut instead of a slide under reduced
motion.

**Why three and not five.** He listed five things: welcome, tools, loop,
purpose and results, alpha. The tools fold into the loop, because each tool is
what one station of the loop is done with, and the full list of nine opens on
demand rather than sitting on the path. Purpose, benefits and results are one
slide, because they are one question from the person: what do I get. The alpha
note goes on the test's own screen, because it is about the reading.

**Why not one.** Each screen between an email and a test is a place to leave,
and the landing already carries the long version of slides 2 and 3. That is
the real trade and it is his, item 16.

**How a person moves through it.**

- **Shown once per person.** A person who comes back with answers saved goes
  straight to screen 4, which already reads "Carry on" in that state. No
  checkbox. The "don't show this again" box he described is for the app's
  loading screen, and the funnel is once by construction.
- **Skip.** Slides 1 to 3 each carry "Take the test", the landing's own label
  for this act. It jumps to screen 4, never to question one, because screen 4
  carries the alpha line and the data line and a person reads both before
  answering anything.
- **Back** on slides 2 and 3, and on screen 4 when it was reached through the
  slides. Arrow keys at 1600, a swipe at 390.
- **No progress count.** No "2 of 4". Three slides is short enough to need
  none, and a numbered position beside a drawing of the loop reads as the loop
  having an end.
- **The name.** First name only. If the capture ever lets it be empty, the
  slide opens on the second line and nothing stands in for the name.

### Slide 1. Who this is for

**Its one job:** say what this reads, in the person's own week.
**Bucket:** Reading, general. It names events, never a trait.
**A person can:** Next, or Take the test.

    Lance.

    You came to see what is running you.

    The same pattern, round again, and no clear next move.
    A distance from the people right beside you.
    A fear of heights. Of clowns. A fear that stops you where you stand.

    Each of these is a story. Run long enough, a story stops looking like a
    story and starts looking like you.

    And you do not feel as shiny as you used to.

                                            [ Next ]     Take the test

73 words. Line by line against his:

| His | Draft | What moved |
|---|---|---|
| Welcome to Attuned, comma name | Lance. | the preamble gate, item 1. His version is the open alternative |
| You are here because you want to see what's running you | You came to see what is running you | cut from twelve words to eight. "what's running you" kept as his |
| Where you keep repeating the same patterns and don't know what to do | The same pattern, round again, and no clear next move | a physical move replaces "don't know", which reads to James as a verdict |
| you feel disconnected | A distance from the people right beside you | an abstract state made a distance in a room. Mine, so it is his to strike |
| afraid of heights, terrified of clowns, paralyzed with fear | A fear of heights. Of clowns. A fear that stops you where you stand. | his three, kept. Paralysed made physical. See item 4 |
| All of these stories condition our mindset, and over time run us. They become us, operating in plain sight as something normal | Each of these is a story. Run long enough, a story stops looking like a story and starts looking like you. | "they become us" moved to "looking like you", item 5 |
| while internally we don't feel as shiny as we used to | And you do not feel as shiny as you used to | his word shiny kept. It is plain speech and it is his |

### Slide 2. What it reads, and what moves

**Its one job:** what the instrument does and what a person gets back. This is
the results slide he asked for.
**Bucket:** Definition, with one line of result.
**A person can:** Next, Back, or Take the test.

    What it reads

    Every nervous system has the same 112 addresses. The stories running them
    are different.

    Atüned finds where a story sits in the body, its neighbours, and the
    network they make. Then what that network costs you, and the order to
    take it apart in.

    Release a pattern and the load at its address comes down, and what it was
    spending is yours again. Coherence moves slower, a little with each
    release.

    The words you write are matched to the addresses by a table. No language
    model reads them.

                                  Back     [ Next ]     Take the test

**Each line, and what it rests on.**

- The heading is his sentence with the count put in. "All nervous systems are
  the same" is true of the product as built: every profile carries the same
  addresses, and 112 is the figure stated to a person.
- "its neighbours, and the network they make" is his "its neighbors, its
  network", and it is the engine's ladder from `BRAND.md` section 3: the
  cluster is the saboteur, the network is the complex.
- "what that network costs you" replaces "the damage it causes over time".
  The Summary lists the reading in order of cost, so cost is what the product
  actually prints. It does not print a projection over time.
- "the order to take it apart in" is already on the landing and is the
  Compass's job. Reused rather than reworded.
- **The results line is the one this page exists for, and it is stated at the
  size the product can back.** A release lowers the load at one address
  directly. Coherence moves by a small amount per release, which is his own
  correction on file in `DECISIONS.md`, 25 September: "it may move 0.1 or
  0.05". A welcome that promised a visible jump in coherence would be the
  first thing a person could check and find untrue.
- "what it was spending is yours again" is the benefit, and it is the
  landing's own "the capacity it was spending is available again", cut.
- The last line narrows "This is not done through AI." The sniffer matches
  words against a lexicon. "Not AI" is a claim a hostile reader argues about
  the definition of; "no language model reads them" is a claim about a
  mechanism, and it is checkable.

### Slide 3. How it works

**Its one job:** the loop, drawn as a closed ring.
**Bucket:** Definition.
**A person can:** tap a station to light it, open Tools, Next, Back, or Take
the test.

The ring sits where a heading would. **One station lit at a time**, discover
first, and the line under the ring is that station's. A person taps a station
to light it. A static four label diagram was tried in `proto/onboard/` and
rejected as four items at once against a working memory of about four, so the
four words appear together only as the ring's own labels.

    How it works

    Discover, play, flow, embody.            <- the ring, four arcs, closed

    discover   You write what happened, in your own words. The engine reads
               the charge out of them.
    play       A short ritual and real games, built from what you wrote.
    flow       The charge is named, seated and released, one address at a
               time, in the order the instrument works out.
    embody     The reading lands on a body map. Your avatar carries the load
               and changes as it comes off.

    Embody hands back to discover. The next thing that happens to you enters
    the same circuit.

                           Tools     Back     [ Next ]     Take the test

39 words visible at any moment. Every station line is cut down from the
landing's own shipped station copy rather than written fresh, so one concept
keeps one wording across the funnel.

**Tools, on demand.** One word, and it opens a sheet with the nine tool lines
from the landing, verbatim: Energetics, Ritual, Story, Field, Body, Compass,
Knowledge, Games, Summary. They are not on the slide because nine items on the
path is the cognitive load problem `CLAUDE.md` already names. **The ring does
not name tabs.** Which surface belongs to which station is open
(`docs/briefs/brief-screens.md` 1.3: two of his own documents disagree), so
the ring carries the station words only and the tool sheet lists tools only.

### Screen 4. The test, open. Built, and two lines added

**Its one job:** start. Everything already on it stays as shipped: "A hundred
questions about how you actually live", the laws line, the uncomfortable line,
what you get at the end, and Start.

Two lines added, above Start:

    The test is the first reading. Your own story goes in after, in the app.

    Atüned is in alpha. The tables are still being corrected, and a reading
    can move when one is.

**The first line is a truth repair, not a nicety.** Slides 1 to 3 talk about
stories and words. The next screen is a hundred scaled questions, and the
landing itself says the engine reads charge "not out of a questionnaire". A
person told the thing reads their story and then handed a questionnaire has
been told something untrue about the next five minutes.

**The second line is his alpha note, made specific.** Alpha means the
arithmetic moves: the coherence formula went through three rulings on 25
September alone. That is what a person needs to know about a figure they are
about to be handed. No route is attached, because there is no feedback
channel in the funnel to point at, and inventing one would be worse than
leaving it off.

The data foot line on this screen has to change when the capture ships. Item
15.

---

## 4. The gates, run on every line

Both gates, run one line at a time on 26 September:

    python3 .claude/skills/atuned-voice/check.py --line "..."
    node marketing/refuse.js "..."

**On his dictation, cut into 24 lines, the gates refused 4.** "Welcome to"
(preamble). "Inner child" (soft lexicon). And "the first 100 people", twice
(scarcity). The other 20 pass both gates, including "measurable rapid
healing", "harmonic register", "lowering your frequency", "the waveform of
memory that collapses the field of awareness" and "It understands who you
are".

That is the finding of this section, and it is not a defect in either gate.
The medical rule refuses heals beside a named condition, and "healing the mind
body connection" names none. The voice gate carries thirty soft terms and
cannot carry every mystical one. **What decides this dictation is pass 1, is it
true, and no pattern reads a claim against the engine.** Section 5 is that
pass, done by hand.

**On the draft, every line passes both gates.** Every string in sections 3
and 5, 28 of them on 26 September, one at a time and then as one block: no hard failures, all nine refusal
rules pass, antithesis and gloss at zero. One demonstrative opener was caught
on the first run, "This is the first reading", and rewritten to open on its
noun.

---

## 5. What does not survive as written, left for him

Numbered so he can answer by number. Each one says which gate or which pass
it fails, what the draft does meanwhile, and the ways it could go. None of
them is silently fixed: the draft above carries a default and the default is
named as mine.

**1. "Welcome to Attuned, comma name." Fails the voice gate: preamble.**
The rule exists because a line announcing that a thing is starting spends the
screen on the heading. There is a case for his line here that the rule did not
foresee: this is the first time the product uses the name the person just
gave it, so the name is doing work. The case does not reach "Welcome to",
which is the part the rule is about.
- *"Lance."* alone. The default in the draft. Keeps the name, drops the
  announcement.
- *"Welcome to Atüned, Lance."* His, with a named exemption in the gate, the
  way V12 carries one for the app's welcome. Costs one exemption, and every
  later writer cites it.
- Either way the spelling on the page is Atüned. "Attuned" is the dictation.

**2. "Where you keep repeating the same patterns and don't know what to do."
Passes both gates. Fails the read as James.** Level 3 and defended reads
"don't know what to do" as being told he is stuck. The draft moves it to "no
clear next move", which is the same fact about the situation rather than
about him. His call if the plainer original is wanted.

**3. "You feel disconnected." Passes. Fails the physical metaphor rule**:
disconnected from what, where. The draft line, "A distance from the people
right beside you", is mine and not his, and is the first thing to strike if
it is not what he meant.

**4. "afraid of heights, terrified of clowns." Passes both gates. Held for a
judgement no gate makes.** Both are concrete and his, and they are the most
vivid nouns in the dictation, so the draft keeps them. The risk is `GUARD.md`'s
first unmeasurable rule, a true statement arranged to imply a false one: a
named fear on slide 1 and "release" on slide 2 reads, to somebody with a
diagnosed phobia, as a claim to treat it. The instrument reads self report and
does not treat.
- Keep both. The default. Nothing on the page says treat, cure or heal.
- Keep one and add a fear with no clinical name: "a fear of being seen".
- Cut both and keep "a fear that stops you where you stand".

**5. "They become us." Passes. Fails pass 1, against his own words.** His
mission, in `BRAND.md` section 4: "It's the character that's not real. It's
the real you underneath the conditioning." And the one sentence: "You are
already the most powerful version of yourself." A story that has become you
contradicts both. The draft reads "a story stops looking like a story and
starts looking like you", which keeps his "operating in plain sight as
something normal" and puts the change in how it looks, not in what you are.

**6. "until you step into that peak version of yourself your inner child
demands, your inner child wants believed in or wants new to be true." Fails
the voice gate (inner child is soft lexicon), and fails pass 1 against his own
position.** Peak version is the addition frame: climb up to somebody you are
not yet. `BRAND.md` section 2 rules the position as subtraction, and the
category's own gate refuses its nearest phrase, highest self. The sentence
also has three endings in the dictation and no single one is his.
- His own brand sentence in its place: "You are already the most powerful
  version of yourself, and this reads what is holding it down." It passes
  both gates. It is not in the draft, because it is the landing's to use
  first.
- Cut it. The draft does this.

**7. "a new kind of neurosomatic software, to bring measurable rapid healing
to the mind body connection." Passes both gates. Fails pass 1 three times.**
- *healing.* Settled once already, by him, in `BRAND.md` section 5: he
  replaced the claim with the mechanism. This brings the claim back.
- *measurable.* The instrument reads self report. `TEAM.md` gives the word to
  one seat, and it is not a word a welcome may spend.
- *rapid.* No measured time in the product backs it. He has a ruled time
  claim already, "turning decades into months", in `DECISIONS.md`. If a
  speed claim goes anywhere it is that one, and it is his call whether a
  pre test welcome is the place.
- *software.* The outward noun is "a somatic reading instrument". One word
  per concept.

The draft carries none of this sentence. The results line on slide 2 does its
work at the size the engine can back.

**8. "the nervous system is geometric and operates at a harmonic register ...
lowering your frequency, lowering your brightness, disconnecting you from
whatever you call your higher power." Passes both gates. Fails pass 1 and the
voice.** No field in the engine is a geometry, a register, a frequency or a
brightness, so each is a claim with no instrument behind it, which is what
Derek looks for first. And it is the mystical register the voice rules out by
name. "Whatever you call your higher power" is the best phrase in the passage,
because it gives the reader the word rather than imposing one.
- It is founder origin, and his own FH split sends that to `BRAND.md`. The
  place for all of it is a signed note in his voice, where "how I see" can sit
  on it the way it does in his mission. Never on this screen and never in the
  instrument's voice.

**9. "The addresses and the descriptions are powered by intention, meaning
that all language is universal with intention." Passes both gates. Fails
V20:** there is no plain sentence that says what it claims, so it cannot be
checked and cannot be drafted. Cut, and the question is his: what is the
thing this sentence is pointing at.

**10. "The nerves were mapped as the roads." Passes. Fails pass 1 against the
engine's own vocabulary.** The first half, "the words are mapped to the
addresses", is true and is on slide 2. The second half is a good physical
metaphor with a problem: in the product a nerve is an address, a place where
load sits ("a named plexus or a named nerve"), and the channels are believing,
perceiving, thinking, behaving, acting and feeling. Nerves as roads makes a
nerve the thing between addresses. Held out until he says which he means.

**11. "The waveform of memory that collapses the field of awareness is what is
being healed." Passes both gates. Fails pass 1 and the voice.** No field
backs it, it borrows a physics word for a claim physics does not make, and it
carries healed. Cut. A reader who knows the word waveform stops trusting the
page at that sentence.

**12. "It identifies the pain of your story and the pleasure of your story ...
It understands who you are." Passes both gates. Fails pass 1 twice.**
- The engine reads charge, which is the pull down. The lift is not read out
  of a story. What the product does carry is the direction out of each
  charge, so the draft says that instead.
- "It understands who you are" contradicts a line already shipped on the about
  page: "it reads what is running, not who is running it". Cut.

**13. The founding offer. Fails the refusal gate: scarcity, twice.** "The
first 100 people" is refused by `refuse.js`, and here the gate and his own
instruction agree: "They don't need to know all that, we can do all that in
the background. Wherever these people land in those numbers, that offer would
pop up." So a person sees only the offer that applies to them, with no count
and no ladder. The three lines, drafted and passing both gates:

    Your price is held for as long as you keep this tier.
    Half off your first year.
    A quarter off your first year.

Three things for him, none of them copy:
- **Where it appears.** Not on the welcome. An offer before a reading is a
  price before a reason. The default is the tier choice after the reading.
- **The refer mechanic uses the funnel record.** Knowing who sent whom means
  the email is used for something other than handing the record back.
  `DECISIONS.md`, 18 September: "The funnel record exists only to hand back
  to the person. It is not an asset, not a list, not a segment." The offer
  system and that ruling cannot both stand as written.
- **"My committed guinea pigs, my angels" stays internal.** Angel is a reading
  in this product, the coherent pole reached by clearing, ruled in
  `DECISIONS.md`. A person told they are an angel for signing up early has
  been handed a reading nobody took.

**14. The capture screen breaks a shipped line on the landing.** The
landing's foot reads "This page makes no request of any kind." True today. The
day the capture sits behind it, the funnel makes a request. The capture itself
is not in this file's scope, but it is the screen this storyboard stands on.

**15. The test's own foot line becomes false the same day.** Shipped on
screen 4: "Nothing you answer leaves this browser. This page makes no request
of any kind." Whether answers leave depends on a decision nobody has made
yet: whether the quiz record goes to the record store at the capture, or only
at sign in. Two ways it goes, both drafted and both passing the gates:
- Answers stay local until sign in: "Your name and email are kept so your
  record can come back to you. Your answers stay in this browser."
- Answers go with the email: "Your name and email are kept so your record can
  come back to you. Your answers are kept with them."
Either is true only once the build matches it.

**16. How many screens.** Three slides, the default, carries everything he
listed and costs three places to leave between an email and the test. One
slide, the welcome alone, with the rest left on the landing where it already
is, costs his loop and results on this path and keeps the person closest to
question one. His call, and the number that would settle it is the drop off
per slide, which nothing measures yet.

**17. Last name.** Nothing on these screens uses it. The data ruling says the
record exists to hand back. Whether the capture asks for a last name at all is
his.

**18. "These tools are directly from the mechanics of being and the codex of
soul mechanics."** Passes both gates. A source citation, so it belongs on the
about page. The question is whether those are the titles of his books. If
they are, they are cited by title and in his casing. "Soul mechanics" as a
phrase in the instrument's own voice is the register item 8 names.

---

## 6. One finding outside this screen, for the backlog

The landing says "Every table the reading runs on is open inside the
product." Checked on 26 September: the sniffer's lexicon, the table that
matches written words to addresses, is not surfaced in Knowledge or anywhere
in `atuned_src/ui/`. The draft on slide 2 was written so it does not repeat
the claim. The landing's line is either a build item or a copy edit.
