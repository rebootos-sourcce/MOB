# Copy review. Five passes, then the panel.

June Okonkwo-Lund, 19 September. Every string here was pulled from
`atuned_src/`, and every screen quoted was rendered from `source.html` in
Chromium at 1600 by 1000 and read as text, not as code.

**The ruling this review answers.** The copy has to be grounded for people who
have never heard any of this. Standard, warm, direct. Right now the product
speaks its own dialect to a stranger who has none of it.

**What I counted.** `tools/terms.py` pulls 976 user visible strings. I read all
of them. The dialect is 31 terms of art. Eleven of them are earned. Twenty are
not, and six of those are not words, they are variable names that reached a
screen.

**The one number that frames everything.** The app opens on Summary. A stranger
who has entered nothing is currently told, in the same scroll, that there is
nothing to read yet, and then handed a full numerology reading computed off the
placeholder word "You", ending in "Karmic debt 16 on the whole name. Something
built on a false footing, and it comes down." That is a reading invented off a
default, on the first screen, in a product whose own copy rule three lines
above it says a number off a default is a number about the default.

---

## Pass one. The stranger's first screen, and the first five minutes.

I loaded the file cold and read the first screen top to bottom, out loud, as
somebody who has never seen the word fetter.

**What is actually on it.** The tab bar reads Energetics, Story, Field, Body,
Compass, Knowledge, Games, Summary. Then a profile menu naming thirteen
strangers. Then a left rail whose first section is "Awareness", whose first row
is "0 · Benign or malignant", whose second is "1 · Balance / masculine / not
enough held to read / feminine", whose third is "2 · Root domains / Architect /
Engine / Weaver / Witness / washed, your selection sits here".

Before the centre column says one word to me, the rail has said: awareness,
benign, malignant, root domains, blueprint domains, fetters, matrix, and
"washed, your selection sits here", which is not a sentence in any register.

**Then the centre.** A dash, "Coherence, not read yet", and thirty four words
explaining why there is no number. Then "Where to start", which is the best
copy in the product and is buried under all of the above.

**Then the numerology.** Uninvited, unasked, computed off nothing.

### Findings, pass one

**1.1 The rail speaks before the product does.** Nine terms of art are on
screen above the fold for a person who has entered nothing. The rail is a
control surface for somebody who already reads this product. On a first load it
should be collapsed to its headings, or absent. This is an IA call as much as a
copy call and it belongs to whoever owns the rail, but the copy consequence is
exact: the first nine words a stranger reads are all words the product has not
defined.

**1.2 The numbered rail prefixes are a data model read out loud.** "0 · Benign
or malignant", "1 · Balance", "2 · Root domains", "3 · Blueprint domains", "4 ·
Fetters". Those integers are the codex's stack order. To a person they are a
list that starts at zero and skips nothing and means nothing. Cut the integers.

**1.3 The empty hero explains its own epistemology.** `ui/summary.js:330`.
Marcus will admire it. Nobody else finishes it. It is the product talking to
its own reviewer.

    now  Coherence, not read yet
         Nothing has been entered, so there is nothing to read. The
         arithmetic underneath works and it is not being shown, because a
         number off a default is a number about the default and not about
         you.

    new  Nothing read yet
         You have not entered anything, so there is no number yet. Any one
         of the four below gives you one. The first takes about two minutes.

Twenty three words instead of thirty eight, and it ends with a time, which is
the single thing every panel member asked for and none of them was given.

**1.4 The numerology panel must not render on an unread field.**
`ui/summary.js:335` calls `sumNum(r)` inside `sumUnread`. `sumNum` reads the
fallback name "You" and prints Expression 7, Soul urge 9, Personality 7,
"Cornerstone Y, studying it", "Karmic debt 16 on the whole name. Something
built on a false footing, and it comes down." Every one of those is derived from
the letters of the word "You". Severity: highest in this review. It is the one
place the product tells a person something about themselves that it made up.

**1.5 The first five minutes have no stated shape.** No duration anywhere on
the first screen. `RESEARCH-icp.md` measures the cost of that at twenty nine
points of completion. One line fixes it and it is in 1.3 above.

---

## Pass two. The vocabulary, term by term.

I took every term of art and asked three questions. Is it earned. Is it
explained where it is used. Could a standard word do the same work.

### The dialect, counted

Thirty one terms. Address, band, blueprint, charge, coherence, complex,
decoherence, distortion, domain, drag, fetter, field, firing, gate, held,
hyper-complex, identification, imprint, installed, jouissance, lean, mask, node,
plexus, pole, reading, saboteur, seat, soma, spread, tier.

Plus three that are not words at all and are on screen: `CQ`, `DQ`, `SQ`.
Plus one that is a variable name and is on screen: `Root_08_Unnamed`.

### The worst six

**2.1 `jouissance`.** `ui/ui.js:757` and `ui/ui.js:773` and
`ui/analytics.js:230`. A Lacanian term for surplus enjoyment, printed as a row
label in a panel called Instruments, in a product for people who have never
heard any of this. The file itself defines it three words later as "done past
the point where it serves, and not able to stop". The English for that is
already in the same string: **overshot**. The word dies.

    now  jouissance 0.53, 6 overshot
    new  Overshot 6

**2.2 `CQ`, `DQ`, `SQ`.** Eight badges across the top of the Field tab, three
of them two letter acronyms with a ring and a tooltip. `ui/ui.js:615` to
`ui/ui.js:665`. COPY.md's own never list includes putting the only copy of a
definition in a tooltip, and the audience arrives on phones, which cannot reach
one. Replace all three on screen. Keep them in the codex as the engine's names.

    now  CQ    DQ             SQ
    new  Coherence  Load      Depth

**2.3 `DQ` has four names in one product.** Decoherence in the glossary, shadow
weight in the summary strip, DQ on the Field strip, drag in its own glossary
entry. One word per concept is the sharpest rule in the skill and this is the
loudest breach of it. **Load.** Everywhere.

**2.4 `Hyper-complex` and `Complex`.** `ui/ui.js:762`, `ui/drills.js:38`,
`ui/mapshelf.js:106`, `ui/analytics.js:226`. Four scope levels are on screen:
Saboteur, Complex, Hyper-complex, Character layer. A stranger cannot rank
those. The code already says what each one is. Rank them in plain English so
the size of the thing is legible from the word.

    now  Saboteur   Complex   Hyper-complex   Character layer
    new  Saboteur   Pair      Stack           Character

Pair is literally two saboteurs compounded, which is what `NOTE.cx` already
says. Stack is a cluster of them acting as one system. Character is the layer a
person cannot see as separate from themselves. Four words, one axis, no gloss
needed.

**2.5 `Node` and `Address` are one concept with two words.** The glossary
defines Node as "An address in the body's energetic architecture" and Address as
"The specific location in the body's energetic architecture where a pattern is
resident". That is the same sentence twice. **Address** survives, because the
release runs at one and the word carries the mechanism. Node dies from the UI.

**2.6 `Root_08_Unnamed`.** `engine/data/nodes.js:6`, rendered in the Knowledge
nodes list with "axis unrouted" beside it. A schema placeholder on a page a
customer reads. Until the owner names it, it renders as **Unnamed** with one
line saying the naming is open, and never as the key.

### The terms that hold

**Fetter** is archaic and it is exactly right, because it means a chain on the
ankle and that is the claim. It needs a gloss at first use and it has never had
one on a surface a phone can reach.

**Charge, held, installed, firing, release, address, seat, plexus** all earn
their keep. They are mechanical, they are physical, and each one names a state
or a place that no ordinary word names as precisely.

**Spread** is the best unearned-looking word in the product and it is fully
earned: it is the distance between three answers to the same law, and the
distance is the measurement. Gloss it once at the top of the intake, not
twenty one times down the column.

---

## Pass three. Tone. Warm and direct, against clinical and mystical.

I read each of these out loud. Four of them I could not say to somebody sitting
across from me, which is the test.

**3.1 The worst sentence in the product.** `ui/intakeui.js:51`, first line of
the Energetics tab.

    now  Your energetics were fixed at the moment you were cut from your
         mother. Date, time and place are what locate that moment, and
         nothing else here can be derived from memory the way the 63
         questions are. Every culture with a psycho spiritual practice read
         this field at a different resolution. Where independent readings
         overlap, the triangulation is pointing at you, and the inversion of
         that overlap is where you are compressed. If you do not know the
         time, say so. It is not guessed.

Seventy seven words. Opens with surgical violence about a person's birth, in
front of a form. Then four terms of art in two sentences: field, resolution,
triangulation, inversion, compressed. The last clause, "the inversion of that
overlap is where you are compressed", is not a claim a person can cash and I do
not believe it is a claim the engine can defend either.

    new  Date, time and place. These three are the only things here you
         cannot work out from memory, so they are asked once and asked
         exactly. Five old systems read the same birth date in different
         ways. Where two of them agree, the agreement is the finding. If you
         do not know the time, say so. It is not guessed.

Forty eight words, no term of art, and it still says the one true thing the
original was reaching for.

**3.2 The mystical slip.** `ui/drills.js:170`. "The field is the geometry of
that radiance. It is harmonic, so patterns sit at registers rather than
anywhere, and what radiates outward tends to carry the colour of the loudest
seat." That paragraph is canonical in BIBLE.md and it is the owner's own
language, so it stays where the owner put it. It does not belong in the core
drill, which is the screen a stranger opens to find out what the number means.
Move it to the Knowledge page. The core drill's job is three facts.

**3.3 The clinical slip, and it is a liability.** `engine/data/nodes.js`,
`HCX_LIB`, rendered at `ui/ui.js:774` and `ui/mapshelf.js:108` and
`ui/analytics.js:226`. The Body page hands a person this, with a number beside
it and nothing else:

    Hyper-complex, collapsed
    Dysregulation
    bipolar · ADHD
    5.7

Six clusters carry six clinical subtitles: narcissism and histrionic,
machiavellian and antisocial, depression and BPD and anxiety, OCPD and
paranoia, bipolar and ADHD, schizoid and withdrawal. Software with no standing
is naming diagnoses at a person. There is no definition, no behaviour and no
direction attached, which fails the owner's own label rule on all three counts
at once, and it is worse than the word Corrupt because it is unfalsifiable and
defamatory in the same breath.

The true copy is already in the file, as a code comment above each entry.
Somebody wrote the right line and shipped the wrong one.

    Grandiosity      now  narcissism · histrionic
                     new  takes up more room than it has

    Predatory        now  machiavellian · antisocial
                     new  calculates before it feels

    Collapse         now  depression · BPD · anxiety
                     new  drops, and stays down

    Rigidity         now  OCPD · paranoia
                     new  holds shape by refusing to move

    Dysregulation    now  bipolar · ADHD
                     new  overshoots at both ends

    Dissociation     now  schizoid · withdrawal
                     new  the outline stays, nobody is in it

**3.4 The koan.** `ui/cone.js:469`. "You are floating the ship out of the water
so that it can float." The hull metaphor in front of it is the best sustained
image in the product and it lands. This sentence undoes it. It is presented as a
conclusion and it concludes nothing. Cut it. Silence is a copy decision.

**3.5 Two door subtitles insult the reader.** `ui/component.js:314` and
`ui/component.js:316`. "For anyone who cannot think of themselves as the
problem." And "For anyone who cannot think of anything they identify with,
which is most people." Both open by telling the reader what they cannot do.
James reads the first one and closes the tab. The trailing "which is most
people" is the product being clever about its own audience.

**3.6 The tone is right more often than it is wrong.** Recording this because a
review that only lists faults is not a reading. "Nothing is held here, so there
is nothing to release. The protocol opens once this address is carrying." That
is a refusal with no apology, naming what would change it, in twenty words. The
`toward` lines in TIERDEF are the strongest sustained writing in the codebase.
"Off the floor, and nothing more ambitious than that." That is the voice.

---

## Pass four. Empty states, errors, tooltips, microcopy.

**4.1 The empty state has been written fourteen ways.** The skill records an
audit that found five. It has drifted, not converged. `tools/terms.py` counts
"nothing held" five times, "none" four, "no story yet" three, "nothing is held"
twice, and the full list from source is:

    Nothing is carrying.                  ui/analytics.js
    Nothing is compounding.               ui/analytics.js
    Nothing measured.                     ui/analytics.js
    Nothing has been read yet.            ui/component.js
    Nothing held, so no shadow...         ui/drills.js
    Nothing installed yet.                ui/drills.js
    nothing held                          ui/imprints.js, ui/mapshelf.js
    nothing carrying yet                  ui/map.js
    nothing                               ui/panels.js
    nothing opened yet                    ui/record.js
    Nothing entered yet.                  ui/ui.js
    nothing yet                           ui/ui.js
    Nothing is running.                   ui/ui.js:777
    Nothing running                       ui/ui.js:800

The last two are four inches apart on the same screen and they are the same
state. Canonical string, one form, everywhere: **Nothing held.** Where the
surface needs more, the second sentence says what fills it, and the second
sentence is the only thing that varies.

**4.2 The refusals are good and they should be the model.** Twelve `status()`
messages, and eleven of them name what failed and what to do. "Not saved.
Storage is full or blocked, so this session will not survive a reload." No
apology, no exclamation mark, names the consequence. That is the bucket working.

One exception. "Recording needs a secure page. Opened from a file, the browser
will not give the microphone." Correct and unreadable. **"Recording needs the
app open from the web, not from a file. The browser will not open the
microphone otherwise."**

**4.3 The definition is in the tooltip and nowhere else, eight times.** Every
badge on the Field strip carries its only definition in a `title` attribute.
`ui/ui.js:615` onward. A phone cannot reach it. COPY.md lists this on the never
list. The fix is not more tooltip, it is a one line definition under the strip
that names the four that are readings and the four that are ratios.

**4.4 The count against a total, three places.** BIBLE.md: never print a count
against a total.

    ui/panels.js:471   Coherence  13 of 100
    ui/panels.js:531   Coherence  13 of 100
    ui/intakeui.js:81  63 of 63 answered, 21 of 21 laws measured

The first two are a reading printed as a score and they must go: "Coherence 13"
and nothing else. The third is progress, not a reading, and the panel demands a
visible remainder. Both rules are satisfied by counting down instead of up.

    now  63 of 63 answered, 21 of 21 laws measured, severe
    new  All 63 answered. Every law is measured.
    and  12 questions left. 4 laws still open.

**4.5 A button label with a number in it.** `ui/storyui.js:38`. The label is
"Commit 0" while the box is empty, and "Commit 3" once three imprints are
found. COPY.md: no count in the label, a count belongs on the badge. And commit
is a version control verb, not a person's verb. What the control does is write
what you typed into the reading, permanently.

    now  Commit 0
    new  Read it in

**4.6 One microcopy line is doing real work and should be copied.**
`ui/storyui.js:32`, the textarea placeholder: "What happened. Write it the way
you would say it out loud." That is the whole product in fourteen words.

---

## Pass five. The labels and the nouns, as one system.

A label names a slot and never changes with the data. I lined up every label in
the product and looked for the ones that break the system rather than the ones
that read badly on their own.

**5.1 One quantity, two contradictory labels, and one of them is false.**

    ui/ui.js:629     SQ         Segment depth. How deep the held charge sits.
    ui/summary.js:70 installed  What has been filled in, 0 to 10.

Same value, `r.SQm`. One label says it is held charge. The other says it is what
has been filled in, which is the opposite thing. The Summary glance strip is
currently printing held load under the word installed. That is not a tone
problem, it is a false reading on the second screen of the product, and the one
word per concept rule exists precisely to catch it. `installed` is the right
word for `poleMean` and it is already taken by `pole` two rows down.

    SQm      Depth
    poleMean Installed

**5.2 The band word and the state word sit bare together.** `ui/summary.js:381`
to `383`. The plate prints the band, then the state, with nothing attached:

    James
    13%
    Severe
    Numb

Two judgement words stacked. TIERDEF carries `def`, `energy`, `soma` and
`toward` for every band, and the plate prints only `toward`, under a heading.
The owner's rule says a label carries a definition, the behaviour and the
direction. Print the definition on the plate, beside the word, where the word
is. One line.

    new  Heavy load
         Most of the field is carrying. Very little is clear.

**5.3 The band words at the low end are verdicts.** Ruled already in
`RESEARCH-icp.md` and still in the code. `engine/data/canon.js:350` to `368`.
Incoherent sits at 31 to 40, which the file's own comment notes is inside the
median range, so the product hands a person one point below average the word
Incoherent. Corrupt is a moral adjective. Severe is a clinical one. Collapsed
is a verdict on a person who by the band's own definition should not be
managing this alone.

The arithmetic does not move. The words do, into one physical family, so the
bottom of the scale reads as a scale.

    91  Mastery       keep
    81  Embodied      keep
    71  Compounding   keep
    61  Gaining       keep
    51  Even          keep
    41  Oscillating   keep
    31  Incoherent  → Losing ground
    21  Corrupt     → Under load
    11  Severe      → Heavy load
     0  Collapsed   → Stalled

Five bands change nothing. The four that change are the four handed to the
people least able to absorb a verdict, and every one of the four now describes
load, which is what the engine measures.

**5.4 A label that changes with the data.** `ui/panels.js:390`. "washed, your
selection sits here" appears under the root domains row only when nothing is
lit. It is a caption pretending to be a label, and it is not readable.

    now  washed, your selection sits here
    new  Pick one. Your choice shows here.

**5.5 Menus. One word, and the word says what the surface does.** The bar is
Energetics, Story, Field, Body, Compass, Knowledge, Games, Summary. Seven of
eight hold. **Energetics** does not. It is the intake: a name, a birth date and
sixty three questions. Energetics names the subject the answers feed, which is
the exact error COPY.md records having already fixed once when Energy became
Body. The surface asks you things.

    now  Energetics
    new  Questions

**5.6 The instrument panel is five labels and three are wrong.**
`ui/ui.js:755`.

    now  Instruments
         integrity 4.3   intention 4.3   pole in 0.55
         jouissance 0.53, 6 overshot     distortion 10.0

    new  Instruments
         Integrity 4.3   Intention 4.3   Installed 0.55
         Overshot 6      Distortion 10.0

"pole in" is not English. "jouissance" is pass two. Sentence case on all five,
which they currently do not have.

**5.7 The glossary contradicts the screens, and it says the forbidden number.**
`engine/data/kb.js:19`.

- `Fetter`: "108 fetters in the body, one per physical node." Says 108. Hard
  ruling breach, in a customer facing glossary.
- `Node`: "108 physical nodes in the body." Same breach.
- `CQ`: "Baseline: 100." The screens read 0 to 100 with 13 on it. A stranger
  reading both concludes the instrument is broken.
- `DQ`: "Decoherence. DQ = 100 − CQ." The screen prints Load 9.1 on a scale to
  about 14. The glossary is describing a formula the engine does not run.
- Twelve entries use a double hyphen where an em dash was intended, which is an
  em dash typed by hand and is ruled out.
- Six entries use American spelling against a British house.

Both 108 strings become the same sentence, which is true and which never states
the forbidden number:

    new  112 addresses. Most sit at a named nerve or plexus inside the body.
         Four sit just outside it, two above the crown and two below the feet.

---

## Part two. The panel.

Nine ICPs from `RESEARCH-icp.md`, weighted, run against three rewritten
surfaces. Every quotation below is simulated. Nothing here was said by a real
person.

    Diane  46  founder            180    Anticipation 8, Apathy replaced 9.2
    Derek  39  endurance          170    wants a limiter and a cost
    Marcus 44  creative director   160    Discernment 8.8, breaks on costume
    Angela 36  seeker             150    Truth 2.6, wants recognition
    Sofia  41  practitioner       140    brings clients, wants retrieval rules
    James  57  C-suite            100    rejects the verb help
    Ana    47  in crisis           50    lands in the bottom bands
    Gordon 58  refuses             35    highest charge, nothing installed
    Rosa   61  nothing held        15    correctly not the customer

**The bar for satisfied, stated before the run.** Zero CONFUSE. Zero REFUSE
caused by copy. Seven of nine at HOLD or BUY. Gordon and Rosa refuse for
structural reasons the study already settled, and chasing them loses Ana and
Derek, so their refusals do not block. That is the honest bar and I am naming
it before the rounds rather than after.

### The three surfaces on trial

**A.** The stranger's first screen. Empty hero, four doors.
**B.** The reading plate. Number, band word, state, direction.
**C.** The Body running panel and the intake header, together, because they are
the two places the product speaks clinically.

---

### Round one

**A, round one.** Empty hero rewritten to twenty three words with a stated
duration. Doors kept as they are.

- Diane. HOLD. "Two minutes. Good. First number on this page I can use."
- Derek. HOLD. "Fine. What does it give me back."
- Marcus. RESIST. "Better. The doors still read like a triage form. 'For anyone
  who cannot think of themselves as the problem.' You have decided what is
  wrong with me before I clicked."
- Angela. CONFUSE. "What is a field. The line says a number appears. A number
  about what."
- Sofia. HOLD. "Clean. I would still want to know where it goes before I type."
- James. REFUSE. "'Cannot think of themselves as the problem.' I am out. You
  opened with a deficit."
- Ana. BUY. "Two minutes I can do."
- Gordon. REFUSE, structural.
- Rosa. REFUSE, structural.

**B, round one.** Band words changed. Plate prints band, state, definition.

- Diane. HOLD. "Heavy load is a fact. Severe was a diagnosis. Where is the
  cost."
- Derek. BUY. "Load I can train."
- Marcus. HOLD. "Load is honest. Two words stacked is still two words.
  'Heavy load. Numb.' Pick one."
- Angela. BUY. "I would not have closed the tab on Heavy load."
- Sofia. HOLD. "I could say Heavy load to a client. I could not say Corrupt."
- James. HOLD. "It reads like a gauge now. I want the comparison and I know you
  will not give it to me."
- Ana. HOLD. "Heavy load. Yes. And under it, off the floor and nothing more
  ambitious. That is the only thing anybody has said to me that fits."
- Gordon and Rosa. REFUSE, structural.

**C, round one.** Clinical subtitles replaced. Intake header rewritten.

- Marcus. HOLD. "'Overshoots at both ends' is a description. 'Bipolar' was a
  claim. You just stopped pretending to a licence you do not have."
- Sofia. HOLD, hard. "I can put this in front of a client. I could not have put
  bipolar and ADHD in front of one. That was the single thing stopping me."
- Angela. HOLD. "The birth line is not frightening any more."
- Ana. HOLD. "It does not tell me what is wrong with me by name. That matters."
- James. RESIST. "'Stack' and 'Pair' and 'Saboteur' are three words I now have
  to hold. Rank them for me on the screen or do not use three."
- Diane. HOLD. "Five old systems, two agree. That I can check."
- Derek. HOLD.
- Gordon and Rosa. REFUSE, structural.

**Round one ledger.** BUY 3, HOLD 14, CONFUSE 1, RESIST 3, REFUSE 3, of which
one is copy caused. Not satisfied. James refuses A on the door subtitle, Angela
is confused by A, Marcus objects to stacked words in B, James objects to an
unranked scale in C.

---

### Round two

Changes made: the two insulting door subtitles rewritten. The hero line names
what the number is about. The plate prints one word, not two. The four scope
words are ranked on screen by size.

**A, round two.**

- James. HOLD. "'Most people find this easier than naming a feeling.' That is
  about the method, not about me. I will take it."
- Angela. HOLD. "'A reading of how much you are carrying and where it sits.'
  Now I know what I am getting. I still do not know if the number is good."
- Marcus. HOLD. "The doors are clean. The rail behind them is still nine words
  I do not have."
- Diane, Derek, Sofia, Ana. HOLD or BUY, unchanged.

**B, round two.**

- Marcus. HOLD. "One word. Good."
- Angela. RESIST. "It says Heavy load and 13 percent. Thirteen percent of what.
  Is 13 low. It must be low. Tell me."
- Diane. RESIST. "Still no cost line. You told me what I am. You have not told
  me what it is taking."

**C, round two.**

- James. HOLD. "Saboteur, then Pair, then Stack, then Character, in that order,
  with the size shown. That is a ladder. I can read a ladder."
- Everyone else. HOLD or BUY, unchanged.

**Round two ledger.** BUY 3, HOLD 17, CONFUSE 0, RESIST 3, REFUSE 2, both
structural. Closer. Angela's confusion has become resistance, which is
progress, because she can now name what is missing. Two gaps remain and both
are on B: the scale is not stated, and there is no cost line.

---

### Round three

Changes made: the plate states the scale in the same breath as the number. A
cost line goes directly under the band, before the direction, which is the
recommendation `RESEARCH-icp.md` already made and which had not been built.

    new  13
         on a scale of 0 to 100. Most people read between 40 and 60.
         Heavy load
         Most of the field is carrying. Very little is clear.
         What it is taking: ordinary demands read as threats, and capacity
         is spent before the day starts.
         Where it goes: off the floor, and nothing more ambitious than
         that. One place in the body, one pattern, one sentence.

- Angela. BUY. "Now I know 13 is low and I know most people are at 50 and I am
  not being called a name for it."
- Diane. BUY. "'Capacity is spent before the day starts.' That is the cost. That
  is what nine on a Tuesday actually costs me. I would pay to move that."
- Derek. BUY. "A limiter and its cost. Train it."
- Marcus. HOLD. "It is falsifiable now. I can check whether capacity is spent
  before the day starts, and if it is not, you are wrong, and I can say so.
  That is all I ever asked for."
- Sofia. HOLD. "I would show this to a client. I still need to know who can pull
  the record back out, and that is not a copy question."
- James. HOLD. "No comparison, and you were right not to give me one. I would
  have gamed it."
- Ana. BUY. "It tells me what it is taking and it tells me the next step is one
  sentence. Not a programme. That is the first thing that has not asked me for
  more than I have."
- Gordon. REFUSE, structural. "Still an ad for people with a problem."
- Rosa. REFUSE, structural. "Nothing pulls."

**Round three ledger.** BUY 5, HOLD 4, CONFUSE 0, RESIST 0, REFUSE 2, both
structural and both out of scope by the study's own ruling.

**Round three passes the bar.** Nine of nine either buy, hold, or refuse for a
reason copy cannot reach. Five of nine buy, and the five include Diane, Derek
and Angela, which is 500 of 1,000 by weight.

---

### Round four, which I ran anyway

I do not trust a panel that passes on the round I designed for it to pass, so I
ran the three surfaces once more against the two hardest readers with nothing
changed, looking for what a fourth reading surfaces that a third does not.

- Marcus, fourth reading. RESIST, new object. "You fixed the subtitles. The
  address list still says Anxiety at the Adrenal Medulla. That is the claim I
  broke on in the first study and nobody has touched it. You did not measure my
  adrenal medulla. You asked me sixty three questions about honesty."
- Sofia, fourth reading. HOLD, new object. "The word Reading is doing two jobs.
  It is a heading on the rail and it is what you call the whole output. I read
  it twice before I understood which one I was looking at."

Both are real and neither was visible in three rounds.

Marcus's is the anatomy claim and the study already ruled on it: frame it as a
coordinate system, not as a measurement. That is one line at the head of the
address list and it has never been written. It is written now, in the findings
table as F19.

Sofia's is a one word per concept breach I missed in pass five. Reading is a
rail section heading at `shell/body.html:319` and it is also the name of the
bucket that produces the whole output. The heading becomes **Summary of you**,
or the rail section loses the heading. The bucket keeps the word.

**Round four ledger.** BUY 5, HOLD 4, CONFUSE 0, RESIST 1, REFUSE 2. One new
resistance, one new hold, both actionable, neither reopening anything settled
in rounds one to three.

**Rounds to satisfy the panel: three. Rounds run: four.** The fourth found two
defects the third could not see, which is the argument for never stopping on
the round that passes.

---

### Before and after. Fourteen key strings.

**1. The empty hero.** `ui/summary.js:330`

    now  Coherence, not read yet. Nothing has been entered, so there is
         nothing to read. The arithmetic underneath works and it is not
         being shown, because a number off a default is a number about the
         default and not about you.

    new  Nothing read yet. You have not entered anything, so there is no
         number yet. Any one of the four below gives you a reading of how
         much you are carrying and where it sits. The first takes about two
         minutes.

**2. The door that insulted James.** `ui/component.js:314`

    now  For anyone who cannot think of themselves as the problem. None of
         them is a diagnosis.
    new  Nine plain statements. Say how true each one is. None of them is a
         diagnosis.

**3. The door that insulted everyone.** `ui/component.js:316`

    now  Three to eighteen. For anyone who cannot think of anything they
         identify with, which is most people.
    new  Three to eighteen, a year at a time. Most people find this easier
         than naming a feeling.

**4. The door written entirely in dialect.** `ui/component.js:318`

    now  The avatar. Release empties an address and replace fills it. This
         is what you are filling it toward.
    new  One sentence about who you want to be. Every reading after this
         gets measured against it.

**5. The band word.** `engine/data/canon.js:362`

    now  Severe
    new  Heavy load

**6. The clinical subtitle.** `engine/data/nodes.js`, HCX_LIB

    now  bipolar · ADHD
    new  overshoots at both ends

**7. The intake opener.** `ui/intakeui.js:51`

    now  Your energetics were fixed at the moment you were cut from your
         mother.
    new  Date, time and place. These three are the only things here you
         cannot work out from memory, so they are asked once and asked
         exactly.

**8. The acronyms.** `ui/ui.js:625`, `627`, `629`

    now  CQ    DQ    SQ
    new  Coherence    Load    Depth

**9. The Lacan.** `ui/ui.js:757`

    now  pole in 0.55, jouissance 0.53, 6 overshot
    new  Installed 0.55, overshot 6

**10. The count against a total.** `ui/intakeui.js:81`

    now  63 of 63 answered, 21 of 21 laws measured
    new  All 63 answered. Every law is measured.

**11. The forbidden number.** `engine/data/kb.js:19`, Fetter

    now  108 fetters in the body, one per physical node. 112 total
         addresses include 4 field nodes just outside the body.
    new  One fetter to each of the 112 addresses. Most sit at a named nerve
         or plexus inside the body. Four sit just outside it, two above the
         crown and two below the feet.

**12. The koan.** `ui/cone.js:469`

    now  You are floating the ship out of the water so that it can float.
    new  (nothing. the hull paragraph ends on "yours is turning down.")

**13. The version control verb.** `ui/storyui.js:38`

    now  Commit 0
    new  Read it in

**14. The false label.** `ui/summary.js:70`

    now  installed   What has been filled in, 0 to 10.
    new  depth       How deep the held charge sits, 0 to 10.

---

## Findings table

| id | current string | file:line | what is wrong | replacement | sev |
|---|---|---|---|---|---|
| F1 | full numerology reading on an unread field | ui/summary.js:335 | a reading invented off the placeholder name "You", on the stranger's first screen, including "karmic debt 16" and "something built on a false footing" | `sumUnread` must not call `sumNum`. Numerology renders once a name is entered, and not before | critical |
| F2 | `bipolar · ADHD` and five siblings | engine/data/nodes.js HCX_LIB, rendered ui/ui.js:774, ui/mapshelf.js:108, ui/analytics.js:226 | software with no standing naming clinical diagnoses at a person, with no definition, behaviour or direction attached | the six behaviour lines in pass 3.3, which are already written as code comments in the same file | critical |
| F3 | `108 fetters in the body` | engine/data/kb.js:19, Fetter | states the forbidden number to a customer | see key string 11 | critical |
| F4 | `108 physical nodes in the body` | engine/data/kb.js:19, Node | same | "112 addresses. Most sit at a named nerve or plexus inside the body. Four sit just outside it, two above the crown and two below the feet." | critical |
| F5 | `installed / What has been filled in, 0 to 10` for `r.SQm` | ui/summary.js:70 | labels held charge as the opposite of held charge. a false reading on the second screen | `depth / How deep the held charge sits, 0 to 10.` | critical |
| F6 | `Severe`, `Corrupt`, `Incoherent`, `Collapsed` | engine/data/canon.js:350,356,362,368 | four verdicts handed by software to the four groups least able to absorb one. Incoherent sits one point below average | `Losing ground`, `Under load`, `Heavy load`, `Stalled` | high |
| F7 | `Your energetics were fixed at the moment you were cut from your mother` and the 77 word paragraph after it | ui/intakeui.js:51 | surgical violence in front of a form, then four terms of art in two sentences, ending on a claim the engine cannot defend | see key string 7 | high |
| F8 | `CQ`, `DQ`, `SQ` as on screen labels | ui/ui.js:625,627,629 | acronyms are not words, and their only definitions live in tooltips a phone cannot reach | `Coherence`, `Load`, `Depth` | high |
| F9 | `jouissance` | ui/ui.js:757, ui/ui.js:773, ui/analytics.js:230 | a Lacanian term in a product for people who have never heard any of this. the file defines it in English four words later | `overshot` | high |
| F10 | `13 of 100` | ui/panels.js:471, ui/panels.js:531 | a count against a total, which a reading may never be | `13` | high |
| F11 | `63 of 63 answered, 21 of 21 laws measured` | ui/intakeui.js:81 | two counts against totals in one line | `All 63 answered. Every law is measured.` and, while in progress, `12 questions left.` | high |
| F12 | fourteen forms of the empty state | across ui/ | the sharpest rule in the skill, broken fourteen ways, twice on one screen | one string, `Nothing held.`, and only the following sentence varies | high |
| F13 | band and state printed bare together, `Severe` `Numb` | ui/summary.js:381 | two judgement words stacked with no definition, when TIERDEF carries one | print `def` on the plate beside the band word | high |
| F14 | `For anyone who cannot think of themselves as the problem` | ui/component.js:314 | opens by naming a deficit in the reader. James walks on this line | see key string 2 | high |
| F15 | `which is most people` | ui/component.js:316 | the product being clever about its own audience | see key string 3 | med |
| F16 | `The avatar. Release empties an address and replace fills it.` | ui/component.js:318 | four terms of art in a door label for somebody who has read nothing | see key string 4 | high |
| F17 | `Root_08_Unnamed`, `axis unrouted` | engine/data/nodes.js:6 | a variable name and a null state on a page a customer reads | `Unnamed`, with one line saying the naming is open | med |
| F18 | `You are floating the ship out of the water so that it can float.` | ui/cone.js:469 | a koan presented as a conclusion, undoing the best image in the product | delete | med |
| F19 | address list prints `Anxiety / Adrenal Medulla` with no frame | ui/drills.js:98, ui/knowledge.js node list | precision as costume. Marcus's original break, still unaddressed after two studies | one line at the head of the list: "These are the seats the instrument uses to place a reading. Nothing here is a measurement of a nerve." | high |
| F20 | `Hyper-complex`, `Complex`, `Character layer` | ui/ui.js:762 and three more | four scope words a stranger cannot rank | `Stack`, `Pair`, `Character`, with size shown | med |
| F21 | `Commit 0` | ui/storyui.js:38, ui/storyui.js:143 | a version control verb, and a count inside a label | `Read it in` | med |
| F22 | `washed, your selection sits here` | ui/panels.js:390 | not a sentence, and a label that appears and disappears with the data | `Pick one. Your choice shows here.` | med |
| F23 | `Energetics` as a tab | engine/core.js:86 | names the subject the answers feed, not what the surface does. The same error Energy to Body already fixed | `Questions` | med |
| F24 | `pole in 0.55` | ui/ui.js:757 | not English | `Installed 0.55` | med |
| F25 | `0 ·`, `1 ·`, `2 ·`, `3 ·`, `4 ·` rail prefixes | shell/body.html:197,208,212,216,233 | the codex stack order printed as a list that starts at zero | cut the integers | med |
| F26 | `CQ / Baseline: 100` and `DQ = 100 − CQ` | engine/data/kb.js:19 | the glossary describes arithmetic the engine does not run, contradicting the screens | rewrite both entries against `engine/compute.js` | high |
| F27 | twelve `word--word` constructions | engine/data/kb.js:19 | an em dash typed as two hyphens, in customer facing copy | full stop, or a comma | med |
| F28 | `behavior`, `behavioral`, `center`, `organiz-` | engine/data/kb.js:19 | American spelling against a British house that says paediatric and practised elsewhere | British throughout | low |
| F29 | `Recording needs a secure page.` | ui/storyui.js status | correct and unreadable | "Recording needs the app open from the web, not from a file. The browser will not open the microphone otherwise." | low |
| F30 | `Reading` as a rail heading | shell/body.html:319 | the same word names a rail section and the whole output. Sofia read it twice | rail heading becomes `Summary of you`. the bucket keeps the word | low |
| F31 | `spread 5.6, holds when it costs, slips when unseen`, twenty one times | ui/intakeui.js:105 | a ten word gloss repeated down a column becomes furniture | the gloss once at the head of the column. the rows carry the value and the lean | low |
| F32 | the field paragraph in the core drill | ui/drills.js:170 | canonical language in the wrong place. the core drill is where a stranger goes to find out what the number means | move to Knowledge. the core drill carries three facts | med |

---

## Glossary decision

Every term of art in the product, with a verdict.

| term | verdict | reason, or the gloss, or what replaces it |
|---|---|---|
| Address | KEEP | the release runs at one, so the word carries the mechanism. Gloss at first use: "one place in the body where a pattern sits." |
| Band | EXPLAIN AT USE | ten words, one every ten points. Gloss: "the word for a ten point stretch of the scale. Yours moves when the number crosses a ten." |
| Blueprint | KEEP | earned. It is what you were born with, against what is running now, and the product's whole argument is the gap between them. |
| Charge | KEEP | the load bearing noun of the product. Gloss at first use: "feeling that never finished, still stored." |
| Coherence | KEEP | the owner's language and canonical. Never as `CQ`. |
| Complex | REPLACE | `Pair`. It is two saboteurs compounded, which is what the code already says. |
| Decoherence | REPLACE | `Load`. Dies from the UI and from the glossary. |
| Distortion | KEEP | mechanical, physical, and it names what happens to a signal. |
| Domain | KEEP | earned as a selection, not a measurement, and the rail already draws it as one. |
| Drag | REPLACE | `Load`. Third word for the same quantity. |
| Fetter | KEEP | a chain on the ankle, which is exactly the claim. Gloss at first use: "a pattern that fires on its own when something matches it." |
| Field | EXPLAIN AT USE | canonical and unavoidable, and a stranger has no handle. Gloss: "everything you are carrying, all at once, and where it sits." |
| Firing | KEEP | a real third state, distinct from held and installed. |
| Gate | EXPLAIN AT USE | gloss: "six places charge either binds or does not." |
| Held | KEEP | the canonical word for a loaded address. `Carrying`, `loaded` and `running` are the same concept in three more words and die. |
| Hyper-complex | REPLACE | `Stack`. |
| Identification | KEEP | it is the trust number, and the fix for the deepest break in the funnel. Print it with its interval. |
| Imprint | KEEP | a mark pressed in, which is what the sniffer finds. |
| Installed | KEEP | one of three real states, and it takes over from `pole` and from the false use at ui/summary.js:70. |
| Jouissance | REPLACE | `Overshot`. Dead. |
| Lean | KEEP as the reading, never as a heading | the heading is already "Benign or malignant", which is correct. The word survives inside sentences. |
| Mask | KEEP | standard English, and the product's use matches the ordinary one. |
| Node | REPLACE | `Address`. The glossary defines the two with the same sentence. |
| Plexus | KEEP | a real anatomical noun, and it must be framed as a coordinate and not a measurement. See F19. |
| Pole | REPLACE | `Installed`. |
| Reading | KEEP as the bucket, REPLACE as the rail heading | see F30. |
| Saboteur | KEEP | standard English, in wide use, and it names a behaviour rather than a person. |
| Seat | KEEP | seven of them, coloured, and the word is the colour system. Gloss at first use: "one of seven places in the body the instrument reads." |
| Soma | EXPLAIN AT USE | in the glossary only. It does not appear in the interface and should not start. |
| Spread | KEEP | the distance between three answers to one law, and the distance is the measurement. Gloss once at the head of the intake, not twenty one times down it. |
| Tier | REPLACE | `Band`. Two words for one concept, and `Band` is already the one the scale comment uses. |
| CQ | REPLACE | `Coherence` on every surface. Survives in the codex as the engine's name. |
| DQ | REPLACE | `Load`. Same. |
| SQ | REPLACE | `Depth`. Same. |
| Root_08_Unnamed | REPLACE | `Unnamed`, with the open ruling stated in one line. |

**Survived the panel:** address, blueprint, charge, coherence, fetter, held,
installed, imprint, plexus, saboteur, seat, spread, firing, distortion,
identification, domain, mask. Seventeen, and eleven of those need a gloss at
first use that they do not currently have anywhere a phone can reach.

**Died on the panel:** jouissance, CQ, DQ, SQ, decoherence, drag, pole, node,
hyper-complex, complex, tier, `Root_08_Unnamed`, and the six clinical subtitles.
Plus four band words: Incoherent, Corrupt, Severe, Collapsed.

---

## Grade

**The copy now: C minus.**

It is held up by four things and they are real. The refusals are the best in the
class. The `toward` lines are the strongest sustained prose in the codebase. The
four doors are the right idea, correctly placed. And the product does not lie
about what it has not measured, which is rarer than it sounds and is most of
what a diagnostic owes anybody.

It is pulled down to a C minus by four things, each of which is a rule this
product already wrote down and then broke. A reading invented off a default on
the first screen. The forbidden number in the glossary, twice. A clinical
diagnosis handed to a stranger with nothing attached. And a label that says
installed over a number that means held.

Any one of those four would be a C. Together, with the dialect on top, it is a
C minus, and the dialect is the least of it. A stranger can survive a word they
do not know. They cannot survive being told, by software, that they are corrupt,
or bipolar, or that they carry karmic debt the product worked out from the word
"You".

**The ceiling: A minus.**

Not an A, and the reason is structural rather than editorial. The product is a
mirror that reads an eleven rung stack and it will always carry more named
things than a person can hold on one screen. Twelve glosses at first use is the
minimum honest cost of that, and twelve glosses is friction no amount of good
writing removes. An A would need the architecture to expose fewer named things
at once, which is the cognitive load item in `CLAUDE.md` and is not mine.

An A minus is reachable this quarter and nothing in the way of it is hard.
Thirty two findings. Four are critical and three of the four are a deletion or a
number. The band words are a table edit. The panel went from three refusals to
none in three rounds on copy alone, with no engine change, and the fourth round
found two more defects for the price of running it again.

What moves the grade, in order of how much:

1. F1, F2, F3, F4, F5. Four deletions and one word. C minus to C plus.
2. F6, the band words. C plus to B minus, and it is the largest commercial item
   in the product by the panel's own count.
3. The cost line under the band, which round three proved converts three of the
   nine from HOLD to BUY. B minus to B.
4. Twelve glosses at first use, on a surface a phone can reach. B to B plus.
5. The acronyms, the empty state, and the counts against totals. B plus to A
   minus.
