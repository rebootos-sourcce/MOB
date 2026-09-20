# TASKS

**The one list.** Ruled 19 September: every request goes on this list the turn
it is made, before any code is written, and it is checked off as it is built.
The project manager reads this file at the top of every round and promotes what
goes in the next block. `CHECKLIST.md` and `OUTSTANDING.md` were two competing
ledgers and are folded in here; the whole point of one list is that there is
nothing to reconcile.

Below the ledger is **the record**: the twelve notes in the order he gave them,
kept because a task without its wording loses what he actually asked for.

## How a line moves

`[ ]` open. `[x]` built and gated. `[~]` specced, not built. `[?]` waiting on
his ruling. Nothing takes an `[x]` without a measurement: built, gated, pushed.
Not written, not specced, not proposed.

A defect found in passing is a line here, not a sentence in a report nobody
reopens. Every seat adds its own.

---

## 0l. DELIVERED 20 SEPTEMBER. THE TWO UNVALIDATED BAGS ARE CLOSED.

VB1, VB2 and VB3 are built. `validateProfile` keeps its signature and its
contract, `pImport` stays atomic, and nothing bumped the schema version.

- [x] **VB1. Rituals are validated per entry** against the engine's own
      tables rather than a list somebody typed. Tracks and step keys are read
      off the practice library at load, seats are the seat table, and the
      minutes ceiling is the whole library summed, which is every practice
      picked once.
- [x] **VB2. The forty character cap is one number now.** It was a literal in
      the markup and nothing at all at the boundary. The refusal declares it
      and the surface reads it, so the two cannot drift.
- [x] **VB3. Story entries are validated per entry** and band keys are checked
      against the sniffer's own table.
- [x] **VB4. A closed key set rather than a deny list.** It refuses what
      nobody thought of, not only what somebody did, which is the posture
      already next door in the outbox. Nineteen refusals by name, including
      the three that started this: a ritual may not carry a secret, an email
      or a note.
- [x] **VB5. And the deny list would have broken the product.** The outbox
      names `imprints` as a thing that may never leave the device, and a story
      entry's own fourth field is called `imprints`. Wiring that table into
      the arrival boundary would have refused every entry the app has ever
      written. Found because a gate row written to assert the opposite failed.
      The one overlap is now asserted, so a future collision on either table
      is reported rather than quietly refusing a legitimate field.
- [x] **VB6. Two fields are deliberately not filled.** A missing `done` stays
      missing, because writing false at the boundary would move every older
      ritual out of the practised column. And a date is required and never
      invented, because the streak is counted in the days it returns and a
      filled one would hand somebody a day they did not practise.
- [x] **VB7. Proved by breaking it nineteen times,** one mutation per refusal,
      each rebuilt and run and restored, with the rows that caught it printed.
      Removing the ritual key set alone failed seven rows and also failed the
      atomicity rows, because the poisoned profile imported and the list
      moved.
- [x] **VB8. No cap was invented on the story text.** The box enforces none on
      purpose, so a cap at the boundary would refuse something somebody
      actually wrote. A gate asserts a forty thousand character story is
      accepted, so nobody adds one by accident.
- [ ] **VB9. `ritual.kind` is deliberately off the key set,** because TA4 is
      unbuilt and the engine holds no table of the three kinds yet. The day it
      lands it must be added and validated against its own table. That is the
      bargain a closed set makes and it is written at the line.
- [ ] **VB10. A test fixture writes a ritual that is no longer legal.** It
      goes straight to the profile and never crosses the boundary, so nothing
      is broken, but it no longer describes a ritual the product would accept.

---

## 0m. DELIVERED 20 SEPTEMBER. THE RITUAL PAGE, IN HIS ORDER.

Built to his layout: stats on top, the week second starting Monday, the three
bands in his order, cards that open, the journal snippet, and where to improve.

### RA. THE AESTHETIC COMPLAINT, MEASURED RATHER THAN GUESSED.

- [x] **RA1. Eight things separated the calendar from the product,** four of
      them breaking a standing ruling. The loudest was the all caps eyebrow,
      which is four words of CSS and also fails the design gate's own row.
- [x] **RA2. The ring and value pill was ported whole** rather than redrawn.
      Summary prints eleven of them and Compass four, and the calendar had
      none, which is most of why it read as a different product.
- [x] **RA3. Three radius rungs, pill buttons, tabular numerals, and the
      product's own token names.** One word per concept applies to CSS
      variables too, and the calendar had invented a second set.
- [x] **RA4. The build now fails on an uppercase transform in the sheet,** so
      that tell cannot come back.

### RS. THE THREE SHAPES, AND THE THIRD ONE IS SOLVED.

- [x] **RS1. Count and window are straightforward.** A count reaches a number
      over a period and is marked on the number you did. A window has an edge
      you hold or cross and is marked on held, or the minute it broke.
- [x] **RS2. A stance is marked on two numbers the day supplies,** times
      tested and times met, with a third state for a day that never tested it.
      That answers RB11: the parameters on a card are its shape's. A binary
      lies both ways, and a nought to ten rating is the intake's job and would
      let a tracker write onto a law.
- [x] **RS3. A stance seats on a real law, and a gate proves it.** Practise
      honesty lands on Truth, at the throat, because there is no law called
      Honesty. The gate caught that on its first run.

### RD. SEVEN DEFECTS THE PICTURES SHOWED AND THE SOURCE DID NOT.

- [x] **RD1. Gordon was offered the same practice as always on and as
      behaviour at once,** because his root seat and his weakest law both land
      on the body track at his tier. A gate now refuses any ritual proposed
      under two kinds.
- [x] **RD2. Days standing returned exactly days kept on all eight records,**
      because under the halving rule nobody misses three in a row. Two figures
      reading 85 side by side. Replaced with the run since the last miss and
      the longest run, which the record can tell apart.
- [x] **RD3. Ninety root red cells read as an alarm,** so the record grid
      takes the accent. A day is not a kind.
- [ ] **RD4. The week still reads mostly empty at 1600.** Three rows tall with
      most cells as faint outlines, and a tall void under the block. It is
      honest, because those cells are proposals nobody has taken, but his
      brief was that space is not wasted and a waveform reads as a waveform.

### RQ. FIVE QUESTIONS, ALL HIS.

- [?] **RQ1. The behaviour default is Monday to Friday.** Taken because his
      own example varies by weekday and nobody ruled a default. Keep, or every
      day?
- [?] **RQ2. Always on is always the top three, and the engine proposes two
      daily holds plus one that happens once.** May the third slot be a one
      off prerequisite, or must all three be daily practices?
- [?] **RQ3. Always on is root red, so at week scale the waveform is mostly
      red.** Confirm, or move always on to the heart and behaviour to the
      root. This is CL12 carried forward and now visible.
- [?] **RQ4. A stance day with no test counts as neither kept nor missed,**
      which means a stance can never lower a rate. Agreed, or does an untested
      day count as kept?
- [?] **RQ5. Release runs when called, so it never takes a waveform pixel.**
      Should a release be schedulable onto a weekday like the other two?

---

## 0n. DELIVERED 20 SEPTEMBER. THE VOICE, THE CASE SCRUB, AND THE MARKETING SYSTEM.

### VD. THE VOICE IS A LOADABLE SKILL NOW.

- [x] **VD1. `.claude/skills/atuned-voice/`,** loaded before any user facing
      string, beside the UX skill. The anchor is stated as eight moves rather
      than a mood, and its limits are stated too: Encarta's subject is not
      reading the entry and ours is, so it cannot instruct, never admits a
      limit, never names a cost and is cold about something that cannot be
      hurt by it. The ruling is keep the register, move the stance.
- [x] **VD2. Sixteen micro rules, each with a failing line and its fix,**
      drawn from copy this product actually ships rather than a strawman.
- [x] **VD3. A gate that can fail a line,** `check.py`, and no house number is
      typed into it: the distribution a candidate is measured against is
      computed off the shipping copy on every run, because a voice gate
      carrying a hardcoded median would have been the tenth time this
      repository was bitten by a typed number.
- [x] **VD4. It prints what it did not check** instead of a score, because a
      score with the unmeasurable part left out is a lie about how much has
      been checked.
- [x] **VD5. The release preamble was 15.4 seconds before the first
      address,** seven lines of which two read the heading aloud. Three lines
      now, 6.6 seconds, one thing each.
- [ ] **VD6. The best copy in the product is the hundred questions,** and it
      runs at double the house median length. Short is not the test. Naming a
      physical event is the test, and a six word sentence that names no event
      is the shorter failure.

### CS. THE CASE SCRUB, AND THE GATE THAT HOLDS IT.

- [x] **CS1. 99 distinct strings measured in thirteen label classes, 42 read
      as sentences,** and all 42 now render in sentence case. The rule is
      stated rather than applied by taste: a label is four words or fewer with
      no comma followed by a word. A comma means a second part and a name has
      one part.
- [x] **CS2. Three strings were wrong before the case transform touched
      them.** One used the struck scale phrasing. One denied a judgement
      nobody had raised. One was a nineteen word paragraph inside a label that
      also described the wrong thing: it explained one axis where the control
      sets all nine.
- [x] **CS3. The gate reads the class list off the stylesheet at run time,**
      walks every surface at both widths on three profiles, and fails by name.
      2258 strings walked, none left. Proved by breaking it twice.
- [ ] **CS4. 24 strings sit past a surface walk's reach,** inside drills. The
      walk has to open every drill to see them.
- [ ] **CS5. The fetters rail reads Child emotions above 4 · Child Emotions,**
      same words, two cases, five pixels apart. Pre existing and more visible
      now the paragraph between them is gone.

### MK. THE MARKETING SYSTEM. ADDRESS BY FIELD, NOT BY PERSON.

- [x] **MK1. His question 3 is answered and it is not close.** A line served
      off a person's own reading names the charge they are heaviest at for 872
      of 894 eligible. By state, 462. By role, 437. Across fifteen runs field
      wins all fifteen, and state beats role in only five, which means neither
      pre reading label is a key and getting a reading is the only thing the
      top of the funnel is for.
- [x] **MK2. Both his claims hold.** A burned out executive and a burned out
      athlete are both modally the same charge. One role with two states needs
      two different lines.
- [x] **MK3. The seat is load bearing, not decorative.** It is where the
      sentence's physical noun comes from, so the same charge at two seats is
      two hooks. The matcher refuses to fall back to a charge only key even
      though that would lift coverage by 119 people.
- [x] **MK4. The refusal is code, not a paragraph,** with a deliberate
      violation written against every rule, because a gate nobody has broken
      on purpose is a gate nobody has tested. Two things it cannot check are
      named in the file rather than omitted.
- [x] **MK5. And it does not argue that manipulation is ineffective,** which
      would be false. It rests on the two measurements already here.
- [ ] **MK6. Sad is the heaviest charge for one person in a thousand,** and
      for none of the two hundred behind the grief door. A hook written at
      sadness reaches almost nobody.
- [ ] **MK7. 508 of 1000 sit below the level the buyer grid calls a market.**
      So coverage of the whole panel is the wrong target: it counts 508 who
      cannot be reached and 106 who must not be aimed at.
- [?] **MK8. Three decisions at the end of the marketing README.** Four hooks
      built properly or seventeen thinly. Whether the Throat seat stays the
      only seat with no hook. Whether the clear entry offering confirmation
      rather than relief is the right offer.
- [ ] **MK9. Source OS appears nowhere in the funnel,** although FN4 asks for
      it by name, and the landing's title uses the plain spelling while the
      page uses the umlaut.

---

## 0p. DELIVERED 20 SEPTEMBER. THE CODEX, THE RENAME, AND THREE LAYOUT DEFECTS.

### KB. THE KNOWLEDGE BASE, REBUILT.

- [x] **KB1. Rows above the fold went from 12 to 39 at 1600 and 1 to 5 on a
      phone.** Row height 150 to 56, codex header 288 to 158. Five decks now
      fit whole on one screen where one did before: the child emotions, the
      saboteurs, moral integrity, the cards and the stack.
- [x] **KB2. The mark is composed, so it stops colliding.** The seat is the
      ring colour and the axis is the glyph inside it, both tables already
      shipped. Seven distinct marks become forty and the worst collision falls
      from 21 rows to 10.
- [x] **KB3. 258 of 332 rows carry a figure and 74 honestly cannot.** None is
      invented. The design document said 260 and the run says 258; the two are
      axis cards the engine carries no axis for, and the run is right.
- [x] **KB4. The glossary left the decks and became what the search answers
      with,** which is both the honest resolution and the largest single
      removal of repeated subtext from the page.
- [x] **KB5. A defect caught three times in three coats.** The universal laws
      deck breaks by axis, and the first cut had every row answer with its
      axis under a heading that already said it. The second said one identical
      sentence on 55 rows. The third gives those rows no fourth line at all,
      because a line with nothing of its own to say should not be drawn.

### RN. THE RENAME. THE NINE ARE CHILD EMOTIONS.

- [x] **RN1. Done as specified and no key moved.** User visible uses of the
      word fetter went from 22 to 17, and all 17 now mean the 112. Nothing
      uses it for the nine. No persisted key was in the blast radius and no
      schema bump was needed.
- [x] **RN2. Gated so neither can regress.** The eleven deck names, the three
      absent old names, the rail, the stack tab, the phrase child fetter
      absent from every surface, the deck carrying 112, and the chip printing
      112.
- [x] **RN3. The deck was showing 108 of the 112.** The four field anchors
      live in a different table from the rest and appeared in no deck at all,
      so the surface whose whole job is listing every address was four short,
      and a chip counting its own rows would have printed the one number this
      product must never say.

### LY. THREE LAYOUT DEFECTS, ALL PRE EXISTING, ALL FIXED HERE.

- [x] **LY1. A new surface starts at its own top.** On a phone the whole app
      scrolls in one container and arriving at a surface did not take the view
      back to the top of it. Measured at 390: after reading down the codex and
      pressing Compass, the container sat at 4636 and the compass sat at minus
      4114, off screen by more than four screens. It reads as the tab doing
      nothing, which is the worst kind of defect because a person presses it
      again and it still does nothing. Now zero and on screen.
- [x] **LY2. The Field's key strip belonged to every surface.** Absolutely
      positioned inside the stage at z-index 3 with no tab guard at all, so it
      sat on top of whatever every other surface had in that corner. This file
      already carried the lesson from the other direction: the render watch
      once took it as the surface host and measured it nine times because it
      is visible on every tab. It was a layout defect then and nobody read it
      as one.
- [x] **LY3. The glossary said 108 to a person,** in two entries, and the
      search now answers with them so they are more prominent than before.
      Reworded rather than find and replaced, because the anatomy really is
      the body's nodes plus four field nodes and changing the number would
      have made the definition wrong.

---

## 0o. RULED 20 SEPTEMBER, EIGHTH PASS. THE AVATAR IS THE DASHBOARD.

### AV. THE PRODUCT OPENS ON THE AVATAR, AND THE AVATAR IS A DASHBOARD.

His words: "Have it start on the avatar. And the avatar is effectively a
dashboard that gives you a ton of base information across all the tools. With
the summary, that if you click onto it, takes you to the summary page. The
summary needs to be the sticky part. So does the ritual. And what's improving
on the avatar."

- [ ] **AV1. The app opens on the avatar.** This reverses the ruling of 19
      September, which reversed Summary for the Field. Everything that ruling
      taught still holds: whatever renders there renders to somebody who has
      entered nothing, so the empty state is the design and not an
      afterthought.
- [ ] **AV2. It reads across every tool, not one.** A dashboard that shows one
      surface's numbers is that surface with a new name.
- [ ] **AV3. Summary and ritual are the sticky parts,** and the summary block
      is a door into the summary page.
- [ ] **AV4. What is improving is on it.** Not what is wrong. That is a
      different page and it already exists.

### KU. THE KUNDALINI IS THE PROGRESS BAR. THIS IS THE PRIMARY GOAL.

His words, and this is the clearest statement of what the avatar is for that
the project has: "What you're improving is the conductivity of the kundalini.
That's our primary goal with the avatar, to reconnect people's kundalini. So we
should have progress bars of the kundalini snaking around the chakras, and we
use that as a progress bar of how a person is doing. Where their starting point
is and how it's rising. Whether it's blocked or open, and where it's blocked."

- [ ] **KU1. The rise is the measure.** A line that snakes the seats root to
      crown, showing how far it has risen, where it is blocked, and whether a
      seat is open or shut. The glossary already defines it: stored vital
      energy at the base of the spine, rising root to crown when enough nodes
      are cleared for the channel to conduct.
- [ ] **KU2. It is computed, not decorative.** The engine already has
      everything this needs: load per seat, what is carrying, what has been
      released. A bar that rises on anything other than the arithmetic is a
      progress bar for a game nobody is playing.
- [ ] **KU3. The starting point has to be kept,** or rising cannot be shown. A
      person's first reading is the baseline and nothing currently stores one.

### CH. THE CHAKRA BAND. COLOUR FROM THE HARMONIC RANGE.

His words: "The chakras and the colour mapping and the fetters and which
chakras they are associated with, and the harmonic range at which they operate
within, and the hex colours that can be converted to. That way we can use real
colours to show precisely where they are in the band."

- [ ] **CH1. Derive the colour rather than pick it.** Each seat has a
      frequency band, a band converts to a wavelength, a wavelength converts
      to a colour. An address sitting high or low inside its seat's band then
      has its own hex rather than its seat's, which is what "precisely where
      they are in the band" means.
- [ ] **CH2. He wants to see it before it lands.** His words: "let me see it
      first." So it is a visible study before it is a schema change.
- [ ] **CH3. It goes into the schema and the algorithm, not just the art.**
      His ruling. That means the band is data the engine carries, and the
      colour is a function of it rather than a table somebody typed.
- [ ] **CH4. The palette is argued from autonomic response,** which is the
      standing ruling, and a wavelength conversion is a different argument. If
      the two disagree, the disagreement is the finding and it goes to him.
- [?] **CH5. The honest part, and it belongs in the record.** The seat to
      plexus correspondence and the seven count are a modern Western reading;
      the glossary already says so. A frequency in hertz for a chakra is not a
      measured quantity. Deriving a colour from it is a consistent internal
      system, which is worth having, and it is not a measurement. The product
      says so about the aura and the biophoton field already and should say it
      here in the same voice.

### AP. ACTIVE AND PASSIVE. A SECOND CUT ACROSS THE THREE KINDS.

His words: "There's active ones and there's passive ones. The active ones are
the ones that you need to do every day. The passive ones are the ones that are
user set."

- [ ] **AP1. Active and passive is not the same axis as the three kinds.** A
      ritual has a kind, always on, behaviour or release, and separately it is
      active or passive. Two fields, not one renamed.
- [ ] **AP2. Sort by band type,** which the person chooses.
- [ ] **AP3. Or the avatar chooses what is most effective.** His words, and
      his reason: it lets the software read across the whole profile and
      decide what actually needs doing. Two icons, two names, two different
      answers. This is the auto detect from the previous pass, given its
      second half.
- [ ] **AP4. The release ritual is automated or user set,** his ruling, which
      answers CL14 from the calendar pass.

### TG2. TAGS COME BACK, AND THIS TIME THEY FIT.

His words: "being able to edit and add tags, so the tags can set up my
protocol, and we need to have the tags set for each major chakra."

- [x] **TG4. This is the shape the tag review recommended.** That review said
      no to free text tags on measured grounds, and yes to a closed field
      validated against a table. Tags set for each major chakra is a closed
      set of seven. The objection was never to the word, it was to a person
      typing anything they like into a field the practitioner model would then
      have to hide.
- [ ] **TG5. A tag sets up a protocol,** which is a job no existing family
      does, and that is what earns it.

---

## 0q. RULED 20 SEPTEMBER, SEVENTH PASS. THE RITUAL PAGE AS A SYSTEM.

He has seen the calendar and ruled against it on aesthetic: "this doesn't
follow any of our current design aesthetic." What he wants instead is described
in enough detail to build, so this supersedes the calendar's layout and keeps
its engine work: the three kinds, the closed field, the queue and its
proposals, and the honest states all survive.

### RU. THE SHAPE OF THE PAGE, IN HIS ORDER.

- [ ] **RU1. Stats on top, as the headline.** His words: "stats on top, like my
      win fail, how many have I succeeded, what's improved. Headline stats."
      The page opens with the record, not with the day.
- [ ] **RU2. The days of the week, second.** Week starts Monday. Ruled
      explicitly: "Monday through Sunday, by the way, changes from Sunday to
      Monday."
- [ ] **RU3. Always on is always the top three.** Three defaults, fixed
      position, every day.
- [ ] **RU4. Behaviour is the next set, and it varies by day.** His example:
      two on Monday, three on Tuesday, two on Wednesday, one on Thursday. A
      person is setting when they practise, so the count per day is theirs.
- [ ] **RU5. Everything else is release.** The third band, and it takes
      whatever is left rather than being scheduled.
- [ ] **RU6. Simple cards, and a card opens.** Click one and it is a pop up
      with the parameters in it, editable. He has not settled what the
      parameters are, so that is a question below and not a guess.
- [ ] **RU7. Monday to Friday reads as a pixelated audio waveform.** His
      image, and it is a good one: a column per day whose height is the day's
      load, square pixels rather than a smooth curve, success and failure
      legible along it.
- [ ] **RU8. The accountability tracker is the little boxes,** success and
      fail, and he wants it robust rather than decorative.
- [ ] **RU9. No wasted space.** His test for the whole page: "it's a system I
      can look at, it makes sense, it's structured and organised, weight space
      isn't wasted, and it gives me some metrics on my successes."

### RB. WHAT A BEHAVIOUR RITUAL ACTUALLY IS.

His own list, and it is the first time the content of a ritual has been stated
rather than inferred. Gratitudes. An affirmation said ten times. No phone for
the first thirty minutes of the day. No news for the first hour. Two glasses of
water first thing. Eight glasses by night. Raw vegetables five days a week.
Practise honesty. Practise compassion.

- [ ] **RB9. Build the behaviour library from that list.** Two shapes are in
      it and they are not the same object: a thing you do a set number of
      times, and a thing you abstain from for a set window. A tracker that
      only understands the first cannot record the second.
- [ ] **RB10. Practise honesty and practise compassion are a third shape.**
      They have no count and no window, they are a stance held through a day,
      and they are the two that map straight onto the laws. They are also the
      hardest to mark succeeded or failed honestly, which is the interesting
      problem.
- [?] **RB11. What are the parameters on a card.** His open question, in his
      words: "I'm not sure what the parameters are yet." The three shapes
      above are the input to answering it.

### RJ. THE PAGE FEEDS THE REST OF THE PRODUCT.

- [ ] **RJ1. Everything on this page feeds analytics.** His words: "all that
      gets fed to my analytics page."
- [ ] **RJ2. A snippet goes to the journal from here.** A button, record or
      text, a sentence like "didn't eat all my cereal today", submit, and it
      lands in the story cloud. This is the content chain he already ruled,
      arriving at the surface where a person actually notices the thing.
- [ ] **RJ3. Voice input is a network service in the browser,** so the control
      says so before it opens. The standing privacy ruling, and it bites the
      record button specifically.
- [ ] **RJ4. Edit, add, delete, history, progress over time.** All four on the
      page, not behind it.
- [ ] **RJ5. Feedback on success and failure, and where to improve,** with the
      protocols and techniques named. A page that only records is a log.

### SA. AUTO DETECT. THE QUEUE, EARNING ITS NAME.

- [ ] **SA1. It recommends the protocols and the rituals first.** His words,
      and his own note on it: "that's a good use of Source AI." The queue is
      already built and already ordered by the load each proposal is aimed at,
      so this is the same machine with the recommendation moved to the front.
- [ ] **SA2. It proposes and the person disposes.** Already asked and still
      unanswered: whether the sniffer adds to tomorrow's ritual by itself or
      proposes and waits.

### PO. THE POSITIONING LINE, AND ONE THING I WILL NOT PASS SILENTLY.

His words: "Atuned is a world's first neurosomatic tool that heals the mind
body connection. Attunes moral integrity to improve vital energy. And heals
disease in the mind and body from the effects of stress, and the damage it
causes across our human complex."

- [ ] **PO1. Take the line into the brand seat** and keep what is his: the
      neurosomatic framing, moral integrity as the thing being tuned, vital
      energy as the result, and stress as the cause.
- [?] **PO2. The word heals is a medical claim and it is a real exposure, not
      a style note.** A product that says it heals disease is making a
      therapeutic claim, and the advertising regulators in every market this
      would sell in treat that as the regulated kind. This product already
      draws the line correctly inside itself: the compass says it is a reading
      of what is running and not of who is running it, and the referral says a
      configuration needs a licensed clinician alongside and not instead. The
      outward copy would be saying something the product itself refuses to
      say. His call, and it needs to be an informed one rather than an edit I
      make quietly: what the line can say without the claim, or the claim with
      the evidence a regulator asks for.
- [ ] **PO3. World's first needs a defensible sentence behind it,** for the
      same reason. What exactly is first.

### HW. THE HOW IT WORKS PAGE.

- [ ] **HW1. An infographic, start to finish.** What the tool is, what it
      does, how it works, what the purpose is, what the results are. His list
      and his order.
- [ ] **HW2. It carries the loop as a circle,** discover, play, flow, embody,
      because that is the page whose whole job is showing the shape of the
      thing.

---

## 0r. RULED 20 SEPTEMBER, SIXTH PASS. THE NERVE STATE, THE VOICE, AND THE LOOP.

### NS. EVERY FETTER CARRIES ITS NERVE AND THE STATE THAT NERVE IS IN.

His words: "I want to have an icon. We have our five icons that describe
whether a nerve is open, closed, lightly impacted, moderately impacted,
heavily impacted. So we've got five stages. We could probably split that out
to ten, since we do everything on zero to ten. Actually that probably makes
more sense. That way the percent makes sense to the entire system."

- [ ] **NS1. Open the fetter and see the nerve.** Clicking a fetter's
      information gives the nerve name, the icon, and the state that nerve is
      in. The nerve names already exist in the engine; the state does not.
- [ ] **NS2. Ten stages, not five.** His ruling, and his reason is the right
      one: everything in this product is scored nought to ten, so a ten step
      ladder makes the percent mean the same thing here as it does everywhere
      else. Five stages against a ten point scale is two numbers wearing one
      name.
- [?] **NS3. Find the five icons before drawing ten.** He says we have them. A
      first search of the source finds no table of nerve states at all, so
      either they live somewhere this search did not reach, or they exist as
      artwork outside the repository, or they were described and never built.
      Ask him which before anything is drawn, because redrawing an existing
      set is the one outcome nobody wants.
- [ ] **NS4. The scale is linear between the stages.** His words: "the percent
      is just linear, right, with our stages. If you do zero to ten you can
      fill it in."
- [ ] **NS5. Icons are ring, not fill.** The standing ruling, and it bites
      here: a ten step ladder drawn as a filling shape is a fill. The ladder
      has to read as ten distinct states in a ring.

### VC. THE VOICE. THE OUTPUT READS AS AI AND HE WANTS A TEN, NOT A SIX.

His words, and they are the brief: "The writing needs to feel like it's
exceptional and right now it feels like it's AI. I need all output content copy
to feel like our team simulated it ten times before they gave us an answer.
They all have persona backgrounds. We know the type of content they consumed
and the writing styles they would have consumed within that content. So the AI
should have a deep brain about how to write content for humans, especially if
it makes micro rule sets about how it relates to its past history and content
and what it's learned and how it's identified with certain styles and
techniques. So that the end output is a ten instead of an AI six."

- [ ] **VC1. Write the voice as a system, not a preference.** An anchor style
      with named moves, a warmth pass over it, and micro rules a writer can
      check a line against. It goes in `.claude/skills/` where it loads before
      any user facing change, beside the UX floors.
- [ ] **VC2. The anchor he named is Encarta.** Reference style answered to him
      separately, with a sample, and it is in the record.
- [ ] **VC3. Every seat carries its own reading history.** The personas are
      ad agency people. What they read is what they write like, and that is
      what makes a rule set specific instead of general.
- [ ] **VC4. Apply it to the funnel first.** His words: "apply it to our
      Atuned funnel, all of their skills, let's see what they got."
- [ ] **VC5. It needs a test, or it is a preference again.** A line either
      passes the rules or it does not, and something has to be able to say
      which. Otherwise this is the fourth voice document.

### MS. THE MARKETING SYSTEM, AND IT PLUGS INTO THE FETTER MATRIX.

His words: "The art director team and the writing team work together, simulate
their creative with the intention of sharpening and improving. Out of our
psychographics, the design aesthetics that pull people in, the language that
pulls people in, the hooks that pull people in. You should know how to search
that information and get the maximum, break it down and understand the
psychological strings that's pulling on, and plug that into our fetter matrix
so you know how to use communication that speaks directly to that. Create a
system out of that. A marketing system. And then simulate it with the ICPs a
thousand times."

- [ ] **MS1. Art and copy work as one seat, not two in sequence.** The point
      is sharpening against each other, which does not happen in a handoff.
- [ ] **MS2. The hooks map onto the fetter matrix.** This is the idea with the
      most in it: the product already knows which address a person is carrying,
      so the language that reaches them is not a guess. It is a lookup.
- [ ] **MS3. Simulate against the ICPs a thousand times,** the way the ritual
      panel already does. That simulator exists and its shape is proven, so
      this is a second use of a built thing rather than a new one.
- [ ] **MS4. A psychological string pulled well and a string pulled badly look
      the same in a conversion number.** This product refuses loss framing on
      an argued basis and that refusal has to survive the marketing system, or
      the system will quietly find its way back to it.

### FL. THE LOOP IS A CIRCLE, AND THE LAST WORD IS EMBODY.

- [ ] **FL1. Discover, play, flow, embody.** Not body. His correction.
- [ ] **FL2. It is drawn as a circle, never a list.** His words: "we're
      showing a core game loop mechanic." A numbered column of four says the
      fourth one is the end, which is the opposite of a loop.
- [x] **FL3. Recorded in CLAUDE.md,** which carried the old word and a linear
      reading of it.

### FN. THE FUNNEL, SECOND PASS. AESTHETIC, PAIN, AND THE PAGES.

- [ ] **FN4. The funnel wears the app's aesthetic.** Fonts, colours, the way
      Atuned is written, and powered by SOURCE OS. He has not chosen which
      page it should echo, so the shared thing is the language of the design
      and not a copy of a screen.
- [ ] **FN5. It speaks to every level of ICP, by name.** The executive, the
      athlete, the creative, the performer, and the anxious, the burned out,
      the overwhelmed, the grief stricken. One page, many doors.
- [ ] **FN6. The hook is a what if question.** His own lines, and they are
      good enough to use: "What if you could wave it away? What if you could
      see yourself clearly? What if you could look into a mirror and see the
      programming running at every atom in your body? This is Atuned. Holistic
      wellness for the body mind complex."
- [ ] **FN7. A buy page.** First surface in the product that asks for money,
      so the tier ladder in DECISIONS.md is the input.
- [ ] **FN8. An about page carrying mission, vision, why, why now, purpose and
      results.** His list, in his order. For the marketing and branding seats
      to sharpen ten times before it is written once.

---

## 0s. MEASURED 20 SEPTEMBER. SETTINGS TOOK THE RIGHT RAIL WITH IT.

- [x] **RW1. The render watch walks the rails now.** It has walked the centre
      column since the first day, one host per surface, looked up by id. The
      rails were never walked: they hold many hosts, they are shared across
      surfaces, and each is written by a different renderer, so a rail host
      that renders nothing looks exactly like one that is meant to be empty. A
      hidden host is not a failure. A host that is on the screen, has been
      given room, and has nothing in it, is.
- [x] **RW2. It found a defect on its first run.** Once the app visited
      Settings, the right rail never came back. Every surface after it, at both
      widths, on a blank profile and a loaded one, until a reload. The centre
      column kept rendering, so from the outside nothing looked broken: the
      rail was simply gone.
- [x] **RW3. The cause is the same mistake in a new place.** `setTab` cleared
      the body's tab class from `TABDEF` and added it from `TABDEF` plus
      `TABEXTRA`. Settings is deliberately not in `TABDEF`, having no door in
      the bar, so its class went on and never came off, and the rule that
      collapses the rail on Settings stayed applied everywhere. One table read,
      two tables written.
- [x] **RW4. Gated three ways.** The rail is the same width after a visit to
      Settings as before it, the class is gone, and no folded surface in
      `TABEXTRA` leaves a class behind, which covers Analytics and anything
      folded later rather than Settings alone.
- [x] **RW5. And a backlog line was wrong.** CMP5 said `#eshelf` renders
      nothing on the Field. It is `display:none` off the Energy tab by design,
      which is correct, and the walk found 135 visible rail hosts across every
      surface on two profiles with none of them empty. Closed as not a defect.

---

## 0t. DELIVERED 20 SEPTEMBER. THE RITUAL CALENDAR.

`proto/ritual/calendar.html`, standalone, no network, every number real. Design
B became the calendar he ruled: one seven column grid at three resolutions,
month to week to day, and the grid is its own navigation.

- [x] **CL1. Three spans, one object.** Month is thirty five cells, week is
      seven cells each tall enough to name the day's rituals, day is one cell
      full width and that is where the board lives. The span control carries no
      counts.
- [x] **CL2. Standing and due are answered in one sweep.** What is standing
      sits on the right and never moves. What is due sits above the calendar as
      three chips, one per kind.
- [x] **CL3. The word running had to go.** This product reserves it for a
      saboteur, and one word per concept is a ruling. The label is standing.
- [x] **CL4. The colour is not a new palette.** The three kinds already exist
      in the engine as the three mark families, each family already sits at a
      seat, and each seat already has a colour. Always on takes Root, behaviour
      takes Heart, release takes Throat. One colour axis only: the glyph
      carries the track by its shape.
- [x] **CL5. Colour never marks a failure.** A missed day is a hairline, a day
      that has not happened is nothing at all, and a day before the person
      started has no cell under it.
- [x] **CL6. The kind is a closed field with three values, argued from the
      engine.** Each kind names a different function as the source of its
      proposals: the seat loads, the weakest law, the sniffer's offer. A fourth
      kind would need a fourth source and there is none. This lands TA4 in the
      prototype before it lands in the build.
- [x] **CL7. RC5 turns out not to be a fourth kind.** What a person optimises
      for is which of the three the queue puts first, which is the ordered for
      control.
- [x] **CL8. The queue is ordered by the load each proposal is aimed at,** and
      every row says who proposed it and why, in a sentence built from real
      addresses. Refusing is Not now, it costs nothing, and it does not come
      back.
- [ ] **CL9. The month grid is mostly empty.** A cell is a tall black box with
      one short dash at the bottom, and the two rows past today are void. It is
      the wall of absence again at a third span. The dash has to earn the cell
      or the cell has to shrink to the dash.
- [ ] **CL10. At month span it reads as one colour.** Nearly every day is the
      always on kind, so the three kind palette shows almost nowhere and he
      asked for colour by name. Either the month cell shows the kinds it
      actually carried, or the month is the wrong span to carry colour at all.
- [ ] **CL11. The panel's practice and minutes columns are stale on seven of
      nine rows,** proved rather than asserted: the gate re runs the old rule
      and reproduces the panel's column exactly. And `build-data.js` cites a
      section A1 that does not exist in that file. Its numbers are right and
      its citation is not.
- [?] **CL12. The colour mapping, and it is the most arguable of the three.**
      Always on takes Root red because the practice marks seat there and Root
      is this product's ground rather than an alarm. Confirm, or move always on
      to Heart and behaviour to Root.
- [?] **CL13. The always on ritual has two candidate sources and they
      disagree.** The reading picks by the darkest band, the avatar picks by
      the seat carrying the most live imprints. For Marcus those are two
      different seats. Which one owns it.
- [?] **CL14. Does a release ritual recur on a schedule,** or only on days an
      address sits above the line, which is the default taken.
- [?] **CL15. May the queue be empty.** It empties when a person refuses
      everything and stays empty until the field moves or they write something
      new. A queue that refills itself is a nag, and the standing engagement
      rule is that a person must be able to stop and be glad they used it.

---

## 0u. DELIVERED 20 SEPTEMBER. THE FUNNEL, THE TAGS, AND THE SNIFFER.

### FD. THE FUNNEL AND THE HUNDRED, BUILT.

- [x] **FD1. The landing is rewritten on his seven beats** and the close is
      verbatim. "Human potential, unlocked" sits on the purpose beat with the
      lock named in the same breath, which is what keeps it inside the voice
      rulings rather than a slogan.
- [x] **FD2. A hundred questions on the twenty one laws,** read out of `SI` in
      the engine rather than retyped, and the quiz refuses by name at load if a
      question names a law or a charge the engine does not carry. Sixteen laws
      get five points and five get four. Interleaved one law at a time, so a
      person who stops after twenty one screens still gets a reading.
- [x] **FD3. One question per screen, measured on all hundred.** One question
      and at most seven interactive elements per screen, against an open
      architectural item of 57 to 71. No screen states a count of any kind.
      Tapping an answer is the step forward; there is no second button.
- [x] **FD4. Zero off machine requests, zero page errors, no horizontal
      scroll, nothing under 44 pixels,** at both widths.
- [x] **FD5. The handover was broken and is fixed.** The page linked a
      generated stylesheet and loaded the engine as a sibling, which is right
      for the source and unsendable: a file that needs two neighbours is a file
      he cannot open from wherever it lands. `funnel/BUILD-single.sh` inlines
      them into `funnel/dist/`, refuses to finish if either page still reaches
      for a sibling, and points the landing's door at the quiz's download name.
      Both proved to open alone.
- [x] **FD6. Two scales said nothing about what they were out of.** The laws
      and the seat loads printed bare figures under a heading. They say out of
      ten now, in words.
- [ ] **FD7. Both pages are one narrow column on a wide screen.** The landing
      runs 4588 pixels tall at 1600 and the reading 3899, with the sides empty.
      A measure that reads well is not the same as a page that uses its width,
      and this is the full screen complaint in a new place.
- [ ] **FD8. The landing has no figure.** The avatar is the centrepiece of the
      product and the first page a stranger sees carries type and rules only.
- [ ] **FD9. Two of the four saboteur cards on the reading are thin.** Root
      Flincher and Diffuse Bracer are generated names with no entry, so they
      print a family line and a generic way out where the other two print the
      sentence the saboteur says. Three cards also repeat the same family line
      word for word.
- [?] **FD10. The honest midpoint of the scale reads Corrupt.** Answering every
      question in the middle lands at 24. Coherence goes as the square of the
      law mean, so a pain led instrument answered honestly puts most people
      between 24 and 56. The arithmetic is his. The one dial that is not is the
      map from an answer to a charge, which is linear today.
- [?] **FD11. Running comments need a server, and the seam is half built.**
      The engine already carries the outbox: a queue, a validator, an allow
      list of eight keys and a deny list of forty odd covering name, email,
      story, coherence and location, capped at twenty queued and six hundred
      characters. That is a comment with everything identifying already
      refused. What does not exist is the thing it sends to. It should share
      the record store's controller: one account, one identity, one deletion
      path. And moderation is not optional under copy about disease, because
      an unmoderated thread fills with medical claims and with people
      disclosing in public exactly what this product keeps private.

### TA. THE TAG SYSTEM. THE ANSWER IS NO, AND THE ARGUMENT IS SHORT.

He asked whether it was worth doing. The recommendation is that it is not, and
that a closed field of three values is what he actually described.

- [x] **TA1. The product already carries 28 naming systems and 396 named
      members,** plus 336 lexicon entries whose whole job is mapping a person's
      own words onto them. Every candidate use of a tag resolves to a family
      that exists. The retrieval case is built five ways already.
- [x] **TA2. The word is taken, by the opposite concept.** The glossary defines
      a tag as the moment a charged experience is named and coded at an
      address, and says the name locks the experience in. In this product a tag
      is the injury the instrument exists to release. Inviting a person to add
      their own is the named cause offered as a tool.
- [x] **TA3. The three kinds are a field, not a tag.** The avatar kind is
      mandatory, mandatory needs a denominator, and free text destroys the
      count the moment somebody types daily instead of Daily. A tag also
      carries no magnitude, so it cannot order the queue, which is QU4.
- [ ] **TA4. Build `ritual.kind` validated the way `plan.tier` is,** three
      values, refused by name. Additive, so a ritual with no kind reads as an
      older record and fills from the blank. No version bump.
- [ ] **TA5. Colour goes against the kind.** That answers RC6.
- [ ] **TA6. Build the person supplied weight instead,** which DECISIONS
      already ruled and which is unbuilt. A number range checks, sorts, orders
      the queue, and never carries a name off the device.

### VB. THE TWO BAGS NOBODY VALIDATES. FOUND WHILE PRICING THE TAGS.

- [ ] **VB1. `rituals` is accepted on one condition: that each entry is an
      object.** A ritual passed with no errors carrying a track that is not a
      track, a seat that is not a seat, a step that is not a practice, a
      negative length, a five thousand character field where the surface caps
      at forty, and a hundred thousand character note.
- [ ] **VB2. And it carried `secret` and an `email`.** Those two names are
      refused by name at the top level of the profile. Inside a ritual the same
      names pass silently. The boundary's first real caller is the record fetch
      at sign in, so this is a hole on the path the accounts fork opens.
- [ ] **VB3. `story.entries` is a bare slice** and is the second bag.

### SN. THE SNIFFER SPEC. PORTED, GATED, AND THE CQ QUESTION IS HIS.

- [x] **SN1. The bands are ported, 33 of 33,** checked against a second
      independent transcription so a typo fails rather than disagreeing
      silently. Seventeen rows differed. The headline was understated: Apathy
      keyed nothing at all in the shipped table while the spec keys twelve rows
      on it, and two rows keyed a word that is not one of the nine. Nine of
      fourteen reference profiles now read a different named saboteur set.
      Coherence and DQ unmoved.
- [x] **SN2. The ramp is built and the measurement did not go the expected
      way, which is reported straight.** A ramp inside the membership bought
      nothing while the output was still a hard yes or no: the edge simply
      moved from the band to the confidence floor. So the boolean firing set is
      gone and the output is ranked confidence. What the ramp does buy is
      resolution thirteen times finer and steadier confidence. On top three
      agreement it is a dead tie. His 94 and 73 could not be reproduced here
      because they need his cohort.
- [x] **SN3. A defect nobody asked about.** "I am angry and exhausted" returned
      Anger 10 and Apathy 0, because a stated charge sharing a seat with
      another was discarded. Now 10 and 8.7.
- [x] **SN4. The cascade has no free parameter.** His own three numbers are
      exactly linear, so the step is his and not a fit.
- [?] **SN5. The laws are not the same twenty one.** Nineteen are shared. The
      spec has Ownership and Wisdom; the engine has Responsibility and
      Accountability. This is the divisor in the coherence definition, so it
      has to be answered before anything downstream can be.
- [?] **SN6. The spec defines coherence as the mean of the laws times ten.**
      Under that definition, measured: releasing every charge moves coherence
      by nothing at all, and all fourteen reference profiles read exactly the
      same number because none of them carries law data. Adopting it changes
      the tier of fourteen profiles out of fourteen. It may still be right. It
      retires the release meter on that path, which is the decision.
- [?] **SN7. And it reaches the lean work through the back.** Malignancy is
      computed off coherence, so either spec definition takes a blank profile
      from 28 malignant to nought and flips benign. That is the same question
      being asked in two places and it should be ruled once.
- [?] **SN8. Which address owns Joy.** The spec says the apathy axis, the
      engine says the sad axis. One word, two places in a body.
- [?] **SN9. Avoider or Innocent.** His weight ruling is implemented and
      Avoider now fires on 1.4 percent rather than the 81 the spec implies,
      while Innocent fires on 38.4 because the spec reduced it to one fetter.
      Move the weight, or give Innocent a second fetter.
- [?] **SN10. Surprise's address.** Lower solar plexus at the lung edges, or
      upper chest and back at the heart seat. A place, not a wording.
- [ ] **SN11. The honest limit, and it is the highest value thing left.** There
      is no subject handling, so "she lied to me" fires the truth law on the
      writer. The guard against reading a person through somebody else's story
      is satisfied by there being no mechanism, not by a rule.
- [ ] **SN12. Nothing in the law layer may be called accuracy.** It is a
      coverage floor. A real figure needs a labelled set with two raters who
      are not the table's author, and his ruling that such a corpus may exist.

---

## 0v. RULED 20 SEPTEMBER, FIFTH PASS. B, AND IT IS A CALENDAR.

### RC. THE RITUAL BUILDER IS DESIGN B, AS A CALENDAR.

Ruled: "for the ritual design, let's start with B. But this needs to look like
a calendar."

- [x] **RC1. Design B is the one.** The board. The other two are parked, not
      deleted, because the compass ring and the run height are still the best
      objects in their own shapes and B may take them.
- [ ] **RC2. It sorts by day, week and month.** His words. Three spans on one
      surface, not three surfaces.
- [ ] **RC3. It shows what is running and what is due today.** Two different
      questions and the calendar has to answer both without being read twice.
- [ ] **RC4. Rituals are organised by what they are for, and there are three
      kinds.** The ones a person always has to do for the avatar to be
      fulfilled or manifest. The ones designed to transform behaviour. The
      ones that belong to the release protocol. That is the sort order, and
      it is the first thing about the ritual builder that is his model rather
      than a comp's.
- [ ] **RC5. The person chooses what they are optimising for.** Avatar,
      personal development, growth, their call. The builder serves the choice
      rather than assuming one.
- [ ] **RC6. Colour.** His words: "I need colours." Against the kind, or
      against the seat, or against the track. One of the three, and the seat
      is already spoken for everywhere else in the product.
- [?] **RC7. Where do you add from.** Ruled open by him: "you need to be able
      to add but we need to figure out the system for adding. Like where are
      you adding from?" This is the question the queue below answers.

### TG. THE TAG SYSTEM, AND WHETHER IT EARNS ITS PLACE.

His words, and he raised the doubt himself: "they add tags and the tags use
the data, and that actually gets a really good question, which is, a tag
system, do we need one? We're using a lot of language but it seems like it
would have a limited use case. Anyway, float this by the team. Have them
review the software, see if the tag system is worth doing."

- [ ] **TG1. The team reviews the built software and answers it with
      evidence,** not with an opinion. The product already carries eleven
      families of named things, so the question is whether a tag adds a
      dimension none of them has or duplicates one that exists.
- [ ] **TG2. If it is worth doing, name every place it is used** before any
      of it is built. He can see it in the ritual builder and "in a few
      places". A tag system built for one surface is a schema change that
      earns nothing.
- [ ] **TG3. Tags touch the schema, so they touch the record,** and the record
      goes off device at sign in. Anything a person can type is a field a
      practitioner may later see. That has to be settled with the tag, not
      after it.

### QU. THE QUEUE. WHAT TO DO NEXT, AND WHO PROPOSES IT.

His words: "I want to generate a queue and I want the queue organized. The
sniffer will help generate a queue. The avatar, which also I guess uses the tag
system, can also help generate a queue."

- [ ] **QU1. The queue is the answer to RC7.** A person adds from the queue
      rather than from a list of everything, which is the same cognitive load
      item as everywhere else: the open architectural number is 57 to 71
      simultaneous choices against a working memory of about four.
- [ ] **QU2. The sniffer proposes into it,** off what the story actually said.
      Open, already asked and still unanswered: whether the sniffer adds to
      tomorrow's ritual by itself or proposes and waits for the person.
- [ ] **QU3. The avatar proposes into it,** off what is missing for the avatar
      to progress. This is the first thing that makes the avatar the
      centrepiece rather than a picture of one.
- [ ] **QU4. Ordered, not listed.** A queue that is a list is a backlog, and
      the product already has one of those.

### AT. THE ACCOUNTABILITY TRACKER.

- [ ] **AT1. He passed it: "number two is okay."** The weekday read stands.
      Everything else in this section is the calendar above.

---

## 0w. MEASURED 20 SEPTEMBER. THE SAFETY REFERRAL HAS NEVER FIRED.

Found by three failing rows in the functional gate, which were failing because
the gate itself was reading the wrong person. Both halves are the same defect
wearing two hats: a thing looked up by where it sits instead of by what it is.

- [x] **SF1. `darkRead` was handed the shape axis and asked for malignancy.**
      Its one caller passed `r.outward`, which measures where what is running
      points, outward at other people or inward at the person. The engine
      computes malignancy separately as `malig`. Everything inside the
      function reads as malignancy: the variable is `mal`, the sentence says
      the shape is malignant, and `refer` is the rule that puts a licensed
      clinician on the surface. It returned a confident false.
- [x] **SF2. Measured before: nought of fifteen people read dark.** Gordon
      sits at CQ 1 with malignancy 98 and read false, because his harm points
      inward more than outward and outward was all it was given. So the
      referral has never been shown to anybody, on any profile, since it was
      written.
- [x] **SF3. Measured after: six of fifteen,** all under CQ 16 with
      malignancy 69 or higher. Every coherent field still reads false,
      including Angela, whose shape is the most outward in the roster at 0.87
      and whose malignancy is 18. Nobody is swept in by coherence.
- [x] **SF4. `compass.js` already carried the argument against the old
      behaviour.** The material "named outward harm and gave it a face, inward
      harm never got one", and this product refuses that. Reading malignancy
      off the outward share is that same mistake with an argument attached.
- [x] **SF5. The gate said `loadP(8)` and meant the heaviest case.** The
      roster grew to fifteen and 8 became Ana, so the gate has been measuring
      somebody else. It looks Gordon up by name now, and asserts which person
      it got before it asserts anything about them. This is the tab integer
      rule applied to a second table.
- [?] **SF6. His call, and it should be made before this ships.** Six people
      in the roster now reach a surface that names Psychopathy and
      Machiavellianism and puts a clinician on the screen. The copy is careful
      and says it is a reading of what is running and not of who is running
      it. The thresholds are malignancy 0.55 with CQ under 31, and the
      referral at CQ under 11. Those two numbers decide who sees it, and they
      have never been tested against a real person because the branch was
      dead.

---

## 0x. RULED 20 SEPTEMBER, FOURTH PASS. THE DOOR, THE BOOT, AND THE FUNNEL

### BT. THE BOOT AND THE BUILD.

- [x] **BT1. The squash and stretch is out of the intro.** His words: "get rid
      of the squash and stretch from the intro animation. Doesn't look good."
      `bootSettle` is deleted and `bootCore` is uniform scale. The anticipation
      stays, the overshoot stays, the held end stays. Nothing was added back.
- [x] **BT2. The build asked for two files it has never carried.**
      `fig-fetter.png` and `fig-pain.png` were made external and then never
      added, so every load fetched two names that do not exist, took two
      ERR_FILE_NOT_FOUND, and fell through to the vector body. The names are
      empty and the probe skips an empty name. Measured after: zero requests.
- [x] **BT3. The gate whitelisted them, which is why nobody saw it.** Gate 7
      allowed any request matching the two rasters. A whitelist for a file
      that does not exist is a gate that passes a failure. The floor is now
      zero outbound requests of any kind.
- [ ] **BT4. "This build stopped while it was starting up."** Reported by him
      on the file opened in the view pane. NOT REPRODUCED here: ten seconds
      from `file://`, and ten seconds inside a sandboxed iframe, both boot
      clean with nine tabs and no alert. The guard has two triggers and only
      one of them is a throw; the other fires when the script never reaches
      the end of its own start up, which is the exact signature of a file
      that arrived truncated. A 1.4 MB file streamed into a preview pane is
      the likeliest way for that to happen, which makes this the same defect
      as 0z and not a separate one. What is owed regardless: the message
      should say what to do, not only what happened.

### FN. THE FUNNEL IS A ONE PAGER THAT SPEAKS TO PAIN.

His words, close to verbatim: "when I land on the Atuned funnel, this is a one
pager talking directly to my pain. Letting me know that mindset programming is
the cause of mental, physical and spiritual disease and stagnation. It's a
stress response from our story that separates the mind and body. This is a
purpose based product. This is how it works. These are the tools. Take the
test."

- [ ] **FN1. Rebuild the landing on that spine.** Pain, cause, the separation,
      the purpose, how it works, the tools, the test. Seven beats, in that
      order, one page.
- [ ] **FN1b. "Human potential unlocked."** His words, added while the page was
      being built. It is a promise line, so it belongs to the purpose beat and
      not to the pain beat at the top: a promise placed early blunts the pain
      that earns it. Unlocked is a metaphor about a mechanism, which is inside
      the voice rulings. The risk is the copy around it, which is one sentence
      away from a slogan about becoming your best self, and that is the soft
      wellness language the product refuses.
- [ ] **FN2. The close is his and it is not softened.** "No one is coming to
      save you. Do it yourself. The software is the key and the roadmap. You
      are the door."
- [?] **FN3. Running comments on the landing page,** so people can add
      feedback and ask questions directly, automated. NEEDS A SERVER. It is
      the second thing on this list that does, after the record store, and it
      should share that seam rather than open a new one. His call on whether
      it ships with the funnel or waits for accounts.

### QZ. THE QUIZ IS THE DIAGNOSIS THAT SELLS.

- [ ] **QZ1. Rebuild the quiz on the twenty one spiritual laws of integrity.**
      Not the current sixty three.
- [ ] **QZ2. One hundred questions, written by the marketing seat with the
      copy seat,** around pain points and what actually brings somebody to a
      product like this. His words: "the questions need to be heartfelt and
      speak to people's pain. We need to understand where they're coming
      from." They are here for a reason and the product has to name it.
- [ ] **QZ3. The through line is coherence.** A low CQ promotes mental,
      physical and spiritual disease. The questions exist to give a person a
      snapshot of the impact and of the problem.
- [ ] **QZ4. The result is a summary of what the issues are and which
      saboteurs are running,** and then the door to the software.
- [ ] **QZ5. A hundred questions is a load problem before it is a copy
      problem.** The open architectural item is 57 to 71 simultaneous
      choices against a working memory of about four. One question per screen
      or it does not ship.

---

## 0y. THE RITUAL BUILDER, MEASURED AND COMPED. 20 SEPTEMBER.

Three runnable designs at `proto/ritual/`: compass, board, tape. Standalone,
no network, real numbers read from `engine.js` through the build's own `ritFor`
and checked against the thousand person panel before they are written.

**The loss framing measurement reverses what two earlier documents assumed.**
Both priced the refusal as a sacrifice worth three points. They priced the
wrong arm: the simulator only modelled the uplift half of his ruling and never
the deduction that lands on a miss. With the deduction in, his mechanic breaks
even at a sting of 0.07 and costs retention above it. At a sting a person would
feel it is minus 1.9 points, robust across five seeds.

- [?] **RB1. The sting.** How much comes off on a missed day. This is the one
      number the whole mechanic turns on, and it is his.
- [x] **RB2. The seven day guard.** Nothing is taken until seven days are
      banked. Worth 2.6 points, more than the mechanic itself, because the
      whole first week is where the leaving happens. Modelled, not built.
- [ ] **RB3. Who pays.** The deduction lands hardest on the people who cannot
      run a release yet, who are 465 of the panel of 1000 and have four of the
      marks permanently shut to them. A ladder that takes from somebody who
      cannot earn is a fine, not a game.
- [x] **RB4. The record grid fills its card.** Two weeks of history drew as a
      sliver in a card sized for thirteen, which is the wall of absence in the
      opposite direction. The cell now grows with the span.
- [x] **RB5. No scale phrasing on the weekday read.** It said 92 in 100. It
      says 12 of 13 Mondays.
- [ ] **RB6. `.pm-eye` carries `text-transform:capitalize`,** so the shipped
      build reads Build A Ritual. A voice violation visible on screen and
      invisible in source.
- [ ] **RB7. The record becomes the other half of this surface,** not its own
      tab and not the Compass.
- [?] **RB8. Five questions, and no more than five.** The sting; one ritual a
      day or a stack; whether the dial is the seven seats or the twenty one
      laws; the record as half this surface or its own tab; whether the sniffer
      adds to tomorrow's ritual or proposes and waits.

---

## 0z. RULED 20 SEPTEMBER. THE BUILD WILL NOT COME OFF THE SCREEN.

His words: "in the view pane window, I can't download anything. So if I click on
the tuned HTML, it opens it up in the pane window, which is great. But in the
dropdown, I no longer have download. And I can't right click on it and download.
So I'm stuck and I cannot get my HTML files. This is critical."

The delivery is part of the build. A build he cannot save has not shipped.

- [x] **DL1. Send every build with the file card set to attach, not render.**
      The default for an HTML file is render, which is the preview he is stuck
      in. Attach gives a save card instead. Four files resent this way at
      08104bf.
- [x] **DL2. Name the second route, so one broken card never strands him
      again.** The branch is pushed, so every file has a raw address he can
      save from the browser. Stated with the build.
- [ ] **DL3. State commit and md5 beside every file, always.** Already the
      ruling for `source.html`; extend it to the funnel, the quiz and any
      other page sent, because he now receives more than one file at a time
      and cannot tell two builds apart by looking.
- [ ] **DL4. One archive instead of four cards** if the save card fails too.
      A zip is not an HTML file and cannot be previewed, so it has no
      render path to fall into. Not built; the attach fix is the cheaper one
      and is measured first.

---

## 0d. RULED 20 SEPTEMBER, THIRD PASS. THE SKUNK WORKS AND THE RITUAL

### SW. FOUR FIELDS. THE SKUNK WORKS BRIEF.

His words: "This is a skunk works team. Grab anybody else who you need. My work
is in Hollywood and visual effects is what I do. Iron Man, Marvel, those visual
effects are pretty gnarly in a good way. Animation wise Pixar is by far the
best. There is a soul between the two."

- [x] **SW1. Built, measured, and in `proto/field/`.** All four run from a file
  with zero outbound requests, no dependency and no server. Every number in them
  is real: `engine.js` driven headless, Diane loaded off the roster, `compute()`
  run, and the whole geometry dumped. She computes CQ 28.09, Corrupt, 8 of 112
  above the line, 91 carrying, 13 saboteurs, 4 complexes, 1 hyper, which matches
  the panel row in `REVIEW-fields.md`. Nothing was authored by hand.
  - **one.html, Plumb.** 26.8 KB, no animation loop at all, 0ms.
  - **two.html, Atmosphere.** 36.9 KB, 0.8ms median. The recommendation.
  - **three.html, Tissue.** Raw WebGL 2, no library, 37.2 KB. The magnificent one.
  - **four.html, Console.** 60.5 KB, 0.9ms, 1.2ms on Derek at 53 objects.
- [x] **SW1b. The finding, and it is arithmetic rather than taste.** The chord
  web, which is the Field's signature mechanic, is inside a legible range of 3 to
  40 objects for **47 percent of the weighted panel**. 36 percent are over 40
  (Derek 53, James 45, Ana 45, Gordon 66) and 16 percent are under 3 (Marcus 1).
  It works for slightly under half the people it is for.
- [x] **SW3 answered. Tissue does not ship, and the reason is measured.** Its
  volumetric medium is 67 to 81 percent of its frame and renders nothing for 47
  percent of the weighted panel, because Marcus, Angela, Sofia and Rosa all read
  shadow weight 0.00. The expensive half of the picture is empty for half the
  audience. Frame cost 228 to 397ms on a software rasteriser, which is a floor
  and not a ceiling, and 73 to 106ms with the medium off. Its first render also
  failed exactly into the cheese the brief forbade, a beaded bracelet in candy
  pastels, and both causes and fixes are recorded rather than hidden.
- [x] **SW1c. And building it found a defect in the existing reading.** Plumb's
  first cut drew the seat mean and said the opposite of what it meant: Diane's
  means run 1.29 to 3.64 of 10 against integrity 2.80 to 7.55, so the wall beat
  the pressure at every seat and a surface built to find charge drew a picture
  saying she has integrity. Cause is two rooms away: 83 of her 112 addresses sit
  under the display line, so a mean over sixteen addresses is mostly averaging
  zeroes. The seat peak reverses the ranking and is the actionable statistic.
- [ ] **SW1d. The recommendation, pending his ruling on SW6:** Atmosphere, as how
  the Field draws inside Dark rather than as an eighth lighting. It closes three
  things at once: law 8 on the Field, because the nine canvas captions come off
  the hero into a rail; layer isolation, which `REVIEW-fields.md` lists as
  missing, done as distance rather than absence so the one circuit claim
  survives; and it gives the zoom ladder a partner, so zoom resolves detail and
  focus says which detail. Plumb ships as the mobile Field and the pre record
  state. Console is a practitioner view, not the person's.
- [?] **SW6. Lighting or renderer.** An eighth lighting with its own ground and
  its own gate row, or a change to how the Field draws inside Dark? The
  recommendation assumes the second, and the standing ruling says a new
  interface is an added lighting, so these collide.
- [?] **SW7. The gate pill against law 8.** `wheel.js` rules the gate ring always
  carries a pill holding a dash, "because the absence is said rather than
  hidden". Law 8 says no text on the hero, ever. Both are his rulings and they
  cannot both hold. Same question as the nine captions, still unanswered.
- [?] **SW8. The 5.5 second breath.** That rate is near the paced breathing
  resonance frequency, so a large slow object breathing at it will entrain the
  nervous system of somebody whose nervous system this product is reading.
  Feature, side effect, or something that has to be disclosed?
- [?] **SW9. Which statistic the seat band carries.** Peak is more actionable and
  reverses the ranking, but `compute()` uses the mean for `darkB`, the seat the
  background wash is tinted by, so the drawing and the wash would disagree about
  which seat carries most.
- [?] **SW10. The name Console.** `console` appears eleven times in the source,
  all the JS object. One word per concept has no clause about registers.
- [ ] **SW2. A hundred passes.** Debate it amongst the seats, challenge it, look
  at it from different perspectives, and go into the data and into what the
  product is trying to translate before drawing anything.
- [ ] **SW3. Number three is the one that breaks the frame.** Entirely
  different, more magnificent than the rest. WebGL is on the table for it. He
  knows the cost may rule it out and wants it drawn anyway.
- [ ] **SW4. The reference is named:** Marvel for effect, Pixar for animation,
  and the product sits between them. Not cheesy. It has to still look right in
  ten years.
- [ ] **SW5. The team.** Art director, the JavaScript seat, creative director,
  UI UX, and anybody they pull in. They are all directors and they all have
  their personas.
- [ ] **SW6. A new lighting carries it, never a replacement.** Standing ruling
  reaffirmed: a new interface is a ninth or tenth lighting added beside the
  seven, and the seven do not change. Energetics gets the same treatment once
  the Field lands.
- [ ] **SW7. The bar.** "We are taking everything to a B now, so how can we
  build on top of what we have and make the wow factor pull out."

### AO. THE WORDMARK.

- [ ] **AO1.** Three more pixels between Atuned and Source OS. He reconsidered
  the Source OS treatment itself and left it alone, so only the gap moves.

### AP. GAMIFICATION, AND THE RITUAL BUILDER.

- [ ] **AP1. "Where is our gamification."** A fair question with a short answer:
  specced, not built. It has to be baked into the ritual rather than bolted
  beside it.
- [ ] **AP2. Simulate the ritual builder a thousand times** with the ICPs, real
  world. Design, UI UX, creative director and the project manager.
- [ ] **AP3. Benchmark against the top two ritual builders and accountability
  trackers on the planet,** named, measured, and beaten. Research on the
  internet, not from memory.

---

## 0e. MEASURED 20 SEPTEMBER. FOUR BREAKS IN THE FUNNEL.

Found by running a thousand simulated arrivals from the real ICP distribution
through the real build, not by reading the code. `tools/flowsim.js` and
`PANEL-flow-1000.md` carry the method and the validation. As built, 14 of 1000
are still there at day 30. These four are why, and they are defects rather
than design.

- [ ] **FB1. Three of the four doors on Summary write nothing.** The surface
  says "four ways in, any one of them fills this page." Driven three levels
  deep, each of three doors leaves the charge sum at 0.00 and `unread` still
  true. `runAgeYear` says so in its own copy: "Nothing is stored here, and
  nothing is scored." `ui/component.js` STARTD, `ui/drills.js:589`, `:685`,
  `:806`. Either they write or they stop claiming to.
- [ ] **FB1b. And the specific blocker is now named, so this is buildable rather
  than open ended.** The nine sentences door runs `runRecogniseDrill` into
  `runCircleDrill`, which shows the depth, its prose and the addresses at its
  seat, and offers no way to say "yes, this one runs". To write, a recognition
  has to land on one of the nine child fetters, and **no mapping from a circle
  to a fetter exists.** `CIRCLES` carries `c`, `nm`, `by`, `sin`, `see`, `p`,
  `at` and `ic`, and `at` is a prose sentence with a seat name pulled out of it
  by a regular expression. Deciding which of the nine "Greed" installs is a
  canon decision rather than an implementation one, so it goes to him or to the
  guru seat. Once the mapping exists the control is small: push an undo snapshot,
  write the charge, report through `status()`, and say what it wrote.
- [ ] **FB1c. And whatever a recognition writes has to cross the load line of
  4,** or the door still does nothing useful: a recognition that leaves the
  address under the line cannot be released, which is the point of recognising
  it. Same threshold question as FB2 and FB3, so all three want one ruling
  rather than three.
- [ ] **FB2. Charge spreads instead of concentrating, so a richer story reads
  as less.** Reproduced directly against the built engine, and this corrects
  the sharper claim that no entry path reaches the release. A 48 word story
  with 2 imprints loads 5 addresses. A 51 word story with 11 imprints loads
  **zero**, topping out at 2.78 against a load line of 4. More signal in, less
  out. `engine/sniff.js:239` writes `touched[f]*0.35` across every fetter the
  story names, so the same total charge divided more ways clears nothing. The
  person who writes the fullest account is the one told nothing is held.
- [ ] **FB3. The release is reachable in principle and not in practice.**
  `stRelPanel` already has a "found" source that runs on what the story just
  found rather than on what crossed the load line, and the control still comes
  up disabled. Verify against FB2 before changing the threshold: lowering the
  load line globally would load noise and flip `unread`, which is the defect
  that was fixed this session.
- [ ] **FB4. All sixteen four letter seeds print the same headline, and the
  reason is now known.** Re-measured directly against the built engine, all
  sixteen types, and the numbers are sharper than the first report:

      distinct across the 16 seeds, out of 16
        charge vector   16 of 16
        charge sum      16 of 16      range 25.5 to 30.4
        CQ               1 of 16      36.00 every time
        tier             1 of 16      Incoherent every time
        heaviest seat    2 of 16
        held             1 of 16      zero every time
        under the line   1 of 16      107 every time

  **The seed writes the nine axes and CQ does not read them.** CQ is It times
  Ig over Rz. Ig comes from the twenty one laws, which a seed does not touch,
  and Rz is drag from loaded addresses, and a seed never pushes an address to
  the load line of 4, so resistance stays at its default. Sixteen genuinely
  different fields, one headline. Whether a stated type should move CQ is his
  call and is already open as the seed decay policy, so this is recorded rather
  than changed: it is an arithmetic question, and the core keeps its bodies.
- [ ] **FB4b. And the heaviest seat moves only two ways out of sixteen, which
  is a second finding two seats reached independently.** `darkB` is the seat
  with the highest MEAN, and a mean over sixteen addresses is mostly averaging
  zeroes when 107 of 112 sit under the line. The four Fields build hit the same
  wall from the other side: drawing the seat mean made the wall beat the
  pressure at every seat, so a surface built to find charge drew a picture
  saying the person has integrity, and the seat PEAK reverses the ranking and is
  the actionable statistic. `darkB` tints the background wash and picks the
  ritual track, so changing it is not cosmetic. Same question as SW9.
- [x] **FB4c. My own probe was wrong first, and this is the record of it.**
  `seedApply(p,type)` takes the profile first. The first probe called it with
  one argument, got null back, and reported that every seed writes nothing at
  all. It does not. The corrected probe checks a known good case before it
  reports anything, which is the rule this repository already carries and which
  has now caught three probes.
- [ ] **FB5. Minutes practised is minutes planned.** The streak counts distinct
  days in `p.rituals`, written only by the Save ritual button. Nothing records
  that a ritual was performed. Select a twenty minute scan, press save, close
  the tab: twenty minutes practised and a day on the streak. It is the one
  label in the product claiming what the data does not carry.
- [ ] **FB6. Nobody reaches Seven days.** 0 of 1000 earn it. The day seven
  mechanism lives in `ladderHtml` on Compass, and Compass sits at left 382
  against a tab strip 348 wide, so for most arrivals it is off screen.
- [ ] **FB7. Undo restores the reading and leaves the bill.** `undoState`
  captures the nine charges, the nine opposites, the twenty one laws and the
  soul. It does not capture `p.meter`, `p.history` or `p.story.entries`, and
  `meterRun` has no remove. The spend is the one irreversible act and it is
  the one undo does not cover.
- [ ] **FB8. The load gate in the simulation is a judgement, not a
  measurement,** and between a third and two thirds of everything the model
  reports as lost hangs on it. Five people on the Field at 390 and at 1600,
  one task, settles it for the price of the floor already ruled. Nothing in
  the fix list should be spent against until that runs.

Measured choice counts, which update the figure in CLAUDE.md upward: 72 to 102
simultaneous choices per screen at 1600 across nine surfaces, against a
working memory of about four.

---

## 0f. MEASURED 20 SEPTEMBER. THE RITUAL LOOP, AND WHAT IT IS WORTH.

A thousand people from the real ICP distribution, run for ninety days against
the real engine. `tools/ritualsim.js` and `PANEL-ritual-1000.md` carry the
method, eighteen validation checks and the sensitivity sweep. As built, 59 of
1000 are there at day 30. The four cheapest fixes take it to 167.

Benchmarked against Finch (about 10 million monthly actives, published day 1 at
54 percent and day 7 at 37) and Fabulous (Duke behavioural economics lab,
2013). This product already beats both on diagnosis, on the miss rule and on
the ethics, and loses to both on a loop that closes.

### THE FOUR CHEAP ONES. All small, all in files that exist.

- [ ] **RL1. The ritual plan is saved and never read back.** Worth **72 of
  1000** at day 30, the largest single item and nearly free. `CURP.rituals`
  carries track, seat, steps and minutes, and no surface asks when and where.
  Gollwitzer and Sheeran 2006, 94 studies, d 0.65, the largest effect in the
  research file. `ui/ritual.js:76`.
- [ ] **RL2. The record is locked inside the Compass.** Worth **40 of 1000**.
  `ladderHtml()` renders the streak, the ledger and the sixteen marks, takes no
  arguments, is correct, is ruled, and is called from exactly one place:
  `coneOpen` at `ui/cone.js:765`. The Compass measures 22 percent touched.
  Harkin 2016, 138 studies, 19,951 participants, d 0.40.
- [ ] **RL3. A broken run resets instead of halving.** Worth **36 of 1000**.
  Bible 1133 rules `Math.max(1, Math.ceil(s/2))` with one grace day, which
  never resets and never runs out. Lally 2010 supports it: missing one
  opportunity did not materially affect habit formation. `engine/ladder.js`.
- [ ] **RL4. Nineteen choices on the ritual card** against a working memory of
  about four. Worth **19 of 1000**. One practice on the card, the rest behind
  one control, and Box Breathing at 5 minutes as the entry rather than the 20
  minute scan. 835 of 1000 are currently asked for 15 minutes or more as a
  first practice, 585 of 1000 for 20. `ui/ritual.js:47` to `:60`.

### AND THE INVERSION NOBODY MEANT

- [ ] **RL5.** `r.DQ>=8` gives tier 1, so the people carrying the most load get
  6 choices and the calmest person in the panel gets 19. Backwards.

### THE EXPENSIVE HALF, WORTH LESS THAN THE CHEAP HALF

- [ ] **RL6.** The card titled with the address cleared. "Fear, Root. Released
  14 March." The one thing the panel says moves Diane.
- [ ] **RL7.** The stake sentence, written by the person and never edited.
- [ ] **RL8.** The season. Seven days with an end, because a thing that ends
  cannot become a guilt engine, and the end of a season is where a person is
  told they can stop and be glad they used it.
- [ ] **RL9.** Karma earned and spent. Blocked on the currency ruling.
- [ ] **RL10.** Push. Behind the server.

### WHAT WAS REFUSED, WITH THE PRICE NAMED

Loss framing, which is the best performing design in the literature and is
worth roughly half again on day 30. Streak reset to zero. Variable ratio
reward. Scarcity timers. Finch's own repair consumable, which is scarcity
wearing kindness. A leaderboard, which would rank people who handed a machine
their distress. Fear of missing out pushes. Each one is declined on the record
with what it would have earned, so declining it stays a decision rather than an
oversight.

### THE ONE MEASUREMENT THAT SHOULD CHANGE THE PLAN

Announcing the coin in advance and paying it for the act costs **40 of 1000 at
day 30 and 25 at day 90** against paying the same coin for the record after the
fact. Deci, Koestner and Ryan 1999, 128 studies, engagement contingent reward
undermines intrinsic motivation at d -0.40. The standard free to play framing
is worse here than no framing at all by day 60. So karma is paid for the
record, never promised in advance for the act.

### WAITING ON HIM

- [?] **The currency, and it now blocks work.** Three words are live for one
  thing in three current documents. `DESIGN-progression.md` rules exactly one
  currency, patterns, and asks for a build gate against a second. `PRODUCT.md`
  and AE1 say points. AK2 says karma. Which survives, and does the banned word
  list move with it? And the half arithmetic cannot answer: is karma a **second
  currency that buys patterns**, or the **name for patterns you earned rather
  than were granted**? Those are different products. One has an exchange rate
  somebody will publish. The other has none.
- [?] **What a mark is worth.** Sixteen marks at 25 karma is 80 patterns, a
  fifth of a tier one month, handed to somebody who never pays, on top of the
  gift of 100. Either the rate comes down to 10 or those 80 patterns are called
  what they are: the second half of the gift.
- [?] **The `sq>=4` release threshold.** 465 of 1000 reach a complete reading
  with nothing to release. Lowering it changes what the product claims about a
  calm person, which is a product question and not an engineering one.
- [?] Whether the record lives on Ritual, on the Compass, or both.
- [?] Whether a karma balance is a number a person sees. Every other quantity
  here is drawn or is a count of events, and the rulings are against printing a
  total.

---

## 0g. RULED 20 SEPTEMBER, FOURTH PASS. THE AVATAR IS THE CENTREPIECE.

**The loop has a name now, and it is canon.** Discover, play, flow, body. Every
block below serves it.

**And the centre moved.** His words: "It is also tied into the avatar. You are
looking at your avatar improve, shown by the releases, by going through the
discover play flow mechanic. So the avatar itself becomes the centrepiece. What
is Atuned? Your avatar. So we are sewing all of its layers. The avatar is tied
into the ritual, which is tied into the psyche and the body locations and the
story. It is one complete system."

### BLOCK A. THE INFORMATION SYSTEM. TOOLTIPS AS CANON.

- [ ] **IS1.** "It sounds like we need a system for tooltips or providing system
  based information. That is just canon." A system, not a component.
- [ ] **IS2.** The seats on it: designer, systems architect, full stack
  developer, copy editor, and anybody else the team needs.
- [ ] **IS3.** Simulate what is needed in the tooltip, a hundred passes.
- [ ] **IS4.** Go to the internet. Find the award winning, exceptional, commer
  cially successful tooltip and in product information systems, and use them as
  comps by name.
- [ ] **IS5.** Design a really simple system around our tools and how
  information is provided. Simple is the requirement, not an aspiration.

### BLOCK B. THE FEATHERS, AND WHAT THEY ARE WIRED TO.

- [ ] **FS1.** "Feathers and the mechanics of the system that they are tied
  into, the laws of integrity, and any other system that is hooked up to that.
  Do we need a system for these?" Answer it with evidence, either way.

### BLOCK C. GAMIFICATION. THE BIG ONE. "TAKE THE TIME YOU NEED."

- [ ] **GM1. The process is discover, play, flow, and body.** Named by him, and
  it is now the spine the gamification serves. Nothing ships that does not move
  a person through those four.
- [ ] **GM2.** A badge, award and reward system that is sticky and motivates a
  person to earn.
- [ ] **GM3. The content chain, in his words.** What a person enters in the
  journal is added to the imprints. Part of that becomes a story they have to
  release. Part of it becomes a ritual, a practice inside the ritual. Sometimes
  it becomes an affirmation, also in the ritual. The gamification exists to keep
  that loop turning, "so the content has to be driven enough to make that
  process sticky."
- [ ] **GM4. The method he asked for, not a shortcut to the answer.** The team
  argues, fights, goes to the internet, finds the products that are exceptional
  at this, uses them as named comps, debates, simulates against the ICPs, and
  **iterates the game design and the core loop until the ICP bottom line goes up
  ten points.** Then pitches him the changes.
- [ ] **GM5.** And the pitch is a pitch: what changed, what it is worth, and the
  number before and after.

### BLOCK D. THE AVATAR SYSTEM. THE CENTREPIECE.

- [ ] **AV1. What is Atuned? Your avatar.** The avatar is the centre of the
  product, not a page in it.
- [ ] **AV2.** A person watches their avatar improve, and the improvement is
  driven by releases and by going through discover, play, flow, body.
- [ ] **AV3. Sew the layers.** The avatar is tied into the ritual, the ritual
  into the psyche, the psyche into the body locations, the body into the story.
  One complete system, and it has to be designed as one.
- [ ] **AV4. The team asks him questions about what the avatar system could be.**
  His explicit instruction. Questions, not a finished proposal presented as a
  ruling.
- [ ] **AV5. Atmosphere and lighting.** Anything that pulls people in and keeps
  them there.

### BLOCK E. THE DOCUMENTATION SCRUB.

- [ ] **DS1.** Scrub the whole thread and the creative brief. Everything ruled,
  changed or tweaked has to be in the documents.
- [ ] **DS2.** Technical design documents. Who needs one, and then they write it.
- [ ] **DS3.** The design docs, the systems docs, the logic systems, the
  architecture and the algorithms, all documented.
- [ ] **DS4.** As many simulation passes as it takes until it feels steady,
  consistent and satisfactory.
- [ ] **DS5.** Comps against exceptional products throughout, "because we are
  going to beat them at retention, and at information."

### STANDING, ADDED THIS PASS

- [ ] **AL5. Run the blocks, and keep running until there are no blocks left.**
  Then show him the HTML documents to review.
- [ ] **AL6.** He reviews the four HTML prototypes separately and will send
  feedback on them on their own.

### WAITING ON HIM, FROM THIS PASS

- [?] **"Personal tested. I am not sure what you mean by that."** I do not know
  which phrase this is answering. Nothing in the last report or in the
  documents uses it. Named here rather than guessed at.
- [?] The four from the previous pass are still open and still block work: the
  coin, what vibrancy is, law 8 against the gate pill, and whether Atmosphere is
  an eighth lighting or a change to how the Field draws in Dark.

---

## 0h. RULED 20 SEPTEMBER, FIFTH PASS. THE BAR, STATED.

**His sentence, and it is the whole product brief.** "This has got to be rock
solid. You have got to feel like this is the very first tool that makes you feel
like you are not only seeing yourself, but you are able to fine tune who you
are."

Read the second half. **Fine tune.** Not read, not receive, not be told. Every
surface from here has to be an instrument a person adjusts, not a chart they
look at. A readout that cannot be turned is a report, and he has never asked for
a report.

### PL. THE PILLS. TEN OF THEM.

- [ ] **PL1.** "The pill designs are okay, but I do not have enough to work off
  of. Give me ten pill designs." Ten distinct treatments of the ring and pill,
  not ten colourways of one.
- [ ] **PL2.** They have to hold every case the component actually meets: four
  sizes, letters in the centre, a drawing in the centre, a charge where high is
  bad, a share where high is good, an unread dash, a selected state, a clickable
  state, and a phone.

### FLD. THE FIELD. ATMOSPHERE AND TISSUE ARE BOTH REJECTED.

- [x] **FLD1.** His verdict: "I do not like the atmosphere design. And I do not
  like the tissue design. They are too bulky, too simple. There are some
  interesting things about it, but it does not make as intuitive sense."
- [ ] **FLD2.** So the recommendation is dead. Atmosphere was the ship
  candidate and Tissue was the magnificent one, and the two rejections are the
  same rejection: **bulky, and not intuitive.** Bulk is the mark carrying more
  ink than reading. Intuitive is a person knowing what it says without being
  taught.
- [ ] **FLD3.** Next round is aimed at that, and at the bar above: the Field has
  to be a thing you turn, not a picture you receive. Plumb and Console were not
  rejected and are not confirmed either, so they stay live.

### VIB. VIBRANCY. HE SHOULD NOT HAVE HAD TO ANSWER THIS.

- [x] **VIB1.** "I am not sure what you want me to do with this vibrancy thing."
  Fair, and my fault: he used the word first and then was asked what it meant,
  which is a question handed back rather than work done. Decided below and his
  to overrule rather than his to originate.
- [ ] **VIB2. Vibrancy is movement.** Length is where a law stands. Vibrancy is
  whether it is rising, holding or falling, drawn as the vane: a full vane is
  one being actively exercised, a ragged one is one being let go. It is the only
  reading of his word that is both symbolically true of a feather and visible
  changing as a person works, which is what "fine tune who you are" requires.
- [ ] **VIB3. What it costs, measured.** Nothing derives it today: `snapshot()`
  at `engine/schema.js:153` stores CQ, DQ, SQ, pole, JQ, radiance, five counts,
  the dark seat, the tier and the archetype, and **not the twenty one laws**. So
  it needs one additive field, an array of 21 on the snapshot. The schema is
  already additive and v1 still loads, so nothing recomputes and no older
  profile breaks.
- [ ] **VIB4. And a person with no history is not a person at zero.** With one
  snapshot or none the vane is full and neutral rather than empty, because an
  unknown is not a nothing. The unanswered law is already a bare quill, which is
  a different statement and stays different.
- [ ] **VIB5.** The two alternatives, recorded so the choice is visible: seat
  charge inverted, which is free and available today but is a seat level number
  shared by up to four laws; and conviction or frequency, which do not exist and
  each cost a new intake field.

### AVS. THE AVATAR SYSTEM. HE WANTS TO SEE IT.

- [ ] **AVS1.** "I also want you to design the avatar system. I want to see what
  that looks like." Running. The bar above is now part of that brief: the avatar
  is the thing a person fine tunes, which is the difference between an avatar
  and a portrait.

---

## 0i. RULED 20 SEPTEMBER, SIXTH PASS. BENIGN AND MALIGNANT, AS A SYSTEM.

**His words.** "I want the team to intake this, review this ten times, and then
build a system for benign and malignant. Include the sniffer that listens for
these words. We are looking for a lack of empathy or empathy, lack of
accountability or accountability. Work this into our algorithm for our sniffer
so that we can now start to track people's benign and malignant behaviour as
well. This is a very cool feature."

### WHAT ALREADY EXISTS, MEASURED BEFORE ANYTHING IS BUILT

Half of this is built and he may not know it. `engine/verp.js` carries
`LEANCUE`, twenty one benign phrases against twenty malignant ones, scanned by
`leanScan`, accumulated by `leanApply`, persisted at `p.gates.lean` and read by
`leanRead`, which blends the story cues against the field's own malignancy on a
trust weight that caps at 0.62. `compute()` already returns `benign` and
`malig`, and `engine/birth.js` already reads them.

So this is not a new feature. It is an unnamed one with no channels, no surface
and no record over time.

- [ ] **BM1. Channels, which is the actual ask.** Today there is one axis and
  everything lands on it. He named two dimensions: **empathy against its lack**,
  and **accountability against its lack**. Those are different behaviours and
  they have to be counted separately before they are summed, or the reading
  cannot say which one is moving.
- [ ] **BM2. The lexicon is the work, not the plumbing.** Forty one phrases is
  a sketch. The existing list already mixes the two channels without saying so:
  "i understood" and "listened" are empathy, "my fault" and "owned it" are
  accountability, "not my problem" and "their fault" are the lack of the second.
  Sort what exists, then extend each channel properly.
- [ ] **BM3. Track it over time.** "So that we can now start to track people's
  benign and malignant behaviour." Nothing does. `snapshot()` at
  `engine/schema.js:153` stores fourteen fields and none of them is the lean, so
  a person's direction on this cannot be drawn. Same additive fix as the laws.
- [ ] **BM4. Ten passes before building.** His instruction, and it matters more
  here than anywhere else this session.

### THE CONSTRAINT THAT IS NOT NEGOTIABLE

A word matcher that reports a person as malignant is a verdict on a person from
a keyword count, and this product's standing rulings forbid exactly that: never
a diagnosis, never a verdict, throughput and not outcome. The defensible version
tracks **what the account does**, not what the person is. A story that blames
outward is a story that blames outward; it is not a malignant human being. The
engine may keep his word, because it is his and it is internal. What a surface
says to a person is a separate decision and it has to be made deliberately.

The failure mode is specific and worth naming: somebody writing honestly about
being harmed will use the language of blame, because they were blamed against.
A system that scores that as malignant punishes the person for telling the
truth about what happened to them, which is the one thing this product exists to
make safe.

### WAITING ON HIM

- [?] **What a surface calls it.** Benign and malignant are his words and are
  right inside the engine. Whether a person reads those two words about their
  own writing is his call and nobody else's.
- [?] Whether a lack of empathy and a lack of accountability are one reading or
  two on the surface. They are two in the arithmetic either way.

---

## 0j. MEASURED 20 SEPTEMBER. THE SNIFFER CANNOT READ ORDINARY WRITING.

**Three seats reached this independently, from three directions, and they agree.
It is the largest single defect in the product.**

- The flow simulation: thirteen of fourteen of this repository's own persona
  `says` lines return zero imprints, so Commit stays disabled on the product's
  own copy about its own customers.
- My own reproduction: a fifty one word story with eleven imprints loads **zero**
  addresses while a forty eight word story with two imprints loads five. More
  signal in, less out.
- The gamification pass, measuring span coverage against the same fourteen
  voices: the sniffer can cut a verbatim quotation out of **1 of 14**. Weighted
  across the panel that is **0 of 1000**.

And the cause is now named rather than guessed. It is not vocabulary. **Twenty
nine of sixty three ordinary inflections of words `LEX` already holds are not
read, and the misses include fear, shame and anger, which are the names of three
of the nine axes.** People write a situation and a consequence with no emotion
word in the sentence at all.

- [ ] **SN1. A stemmer fold.** Measured: takes span coverage from 1 of 14 to 2
  of 14, and 0 of 1000 to 150 of 1000. Cheap and not sufficient on its own.
- [ ] **SN2. A frame layer**, which is the one that matters. Measured with the
  fold: **9 of 14 and 935 of 1000.** Removing the sniffer work from the
  gamification design costs 5.7 points of the 11.0, the largest item in its
  ablation.
- [ ] **SN3. And the honest caveat is recorded with it.** The eighteen frames
  were written after reading the fourteen voices they were measured on, so 9 of
  14 is in sample and an upper bound. If the true rate is half, the delta is
  nearer eight than eleven.
- [ ] **SN4.** This is the same root as FB2 and FB3 and the release wall. One
  ruling on the load line of 4 serves all of them.

## 0k. DELIVERED 20 SEPTEMBER. GAMIFICATION, AND IT CLEARED THE TARGET.

**Baseline 8.9 points, final 19.9 points, delta +11.0 against a target of ten.**
Percentage of the weighted thousand still active on day thirty, defined once and
not moved. Across nine seeds the delta averages 10.8, range 9.6 to 12.0, and
eight of nine clear ten. `tools/loopsim.js`, forty two checks, and it corrected
itself twice on the way with both failures recorded in its own comments.

- [x] **GM1 to GM5 delivered.** `DESIGN-gamification.md` and `proto/game/`.
- [x] **The content chain, which nobody had designed.** Journal to practice is a
  frame match, so the thing that reads the charge and the thing that cuts the
  quotation are one match, and the practice carries the person's own clause.
  Journal to affirmation is not an assertion: it is their own claim with one
  word hedged, both halves shown, editable. If the entry asserts no absolute
  about itself then nothing is asserted and the coherent opposite is handed over
  as a question instead. Wood, Perunovic and Lee 2009 is the reason, and it
  matters because 800 of 1000 arrive at grid level four or below.
- [x] **Every span is a verbatim substring of what the person wrote.** Forty two
  chain runs, zero failures. That property is what makes the feature safe.
- [x] **Three parts.** A mark counts what you did, an award records what moved,
  karma is what either pays. The third family exists because **four of the
  sixteen marks can never be earned by the 465 of 1000 with nothing above the
  release line**, which nobody had noticed because the ladder correctly never
  prints how many marks there are.
- [x] **The ethics got cheaper.** Refusing loss framing, streak reset, variable
  reward, scarcity, leaderboards and fear of missing out was priced at **3.0
  points**, a sixth of the design, against the half that `PANEL-ritual-1000.md`
  estimated. First time this repository can make that argument with a number.
- [ ] **AV6, on the avatar seat.** An avatar driven only by releases never moves
  for the 465 of 1000 who cannot release, and Marcus and Sofia, both inside that
  465, carry 6.1 of the 11.0 points. It needs a still frame for them.

### WAITING ON HIM, FROM THIS

- [?] **Which word survives**, still. The whole design is costed on karma being
  the name for patterns you earned rather than a second unit, because that is
  the only reading that passes the gate `DESIGN-progression.md` already asks for.
- [?] **Does a person see their karma balance as a number?** The prototype
  prints it, and it is the one place this design may be breaking the standing
  rule against printing a total.
- [?] If the accounts fork puts a model behind the sign in seam, is the frame
  layer the fallback or the engine? It decides whether to spend another week
  there.

---

## 0l. RULED 20 SEPTEMBER, SEVENTH PASS. THE SNIFFER, AND WHAT IT KNOWS.

**His questions.** "Does a sniffer know what it is supposed to be sniffing? Has
it got the information? Does it have the logic that I supply from The Mechanics
of Being? What is the system looking for? What is the system doing? I need
whoever is part of the team to ask me questions so that we can refine the
sniffer so that it is exceptional. And then we need that schema, system and
architecture design developed and added to not only the software, but our TDD
and documentation."

### THE ANSWER, MEASURED. IT DOES NOT KNOW WHAT IT IS SNIFFING.

Every figure below was taken against the built engine and the book, and the
probe was checked against a known good case first, because the first run of it
reported zero of thirty three saboteurs in the book and was wrong.

    the lexicon                192 words, 22 phrase rows, 124 phrases,
                               66 adjectives
    the nine axes              8 of 9 axis names are NOT in the lexicon.
                               only "sad" is there. fear, anger, shame,
                               disgust, apathy, shock, surprise and
                               anticipation are not words it can find.
    the thirty three saboteurs all 33 ARE named in the book, so the canon is
                               sourced. they carry 7 distinct cue words
                               between them: fear, anxiety, anger, sadness,
                               disgust, shame, shock.
    those 7 cue words          0 of 7 are in the lexicon.
    provenance                 77 of 192 lexicon words appear anywhere in the
                               book. the other 115 were written by hand with
                               no stated source, and the file says so: its
                               own header is about a merge, not an origin.

**So: the instrument cannot find the names of the nine things it measures, and
cannot find any of the seven words that identify its thirty three saboteurs.**
That single fact explains every other measurement this session. One of fourteen
span coverage. Thirteen of fourteen persona lines returning zero imprints.
Charge spreading thin instead of concentrating. A story with eleven imprints
loading nothing.

- [ ] **SNF1.** The lexicon has no owner and no provenance. `engine/lexicon.js`
  is a hand written table whose header documents a merge rather than a source.
  The canon tables are sourced from the book. This one is not.
- [ ] **SNF2. What the system is looking for has never been written down.** That
  is his question and it does not have an answer in the repository. It has to
  become a document before it becomes better code.
- [ ] **SNF3. The team asks him questions.** His explicit instruction, and this
  is the place in the product where it matters most, because the logic is his
  and the book is his.
- [ ] **SNF4.** Then the schema, the system and the architecture, into the
  software AND into a technical design document AND into the documentation.
  Three places, ruled.

### WAITING ON HIM, AND THESE ARE THE ONES THAT BLOCK

- [?] Is the lexicon supposed to be derived from The Mechanics of Being, or is
  it allowed to be a separate instrument vocabulary with its own justification?
- [?] When a person writes the name of an axis plainly, "I was afraid", should
  that land on the axis directly, or is a named feeling deliberately weaker
  evidence than a described behaviour?

---

## 0m. RULED 20 SEPTEMBER, EIGHTH PASS. MEANING, AND THE WAY BACK.

### HIS TWO FINDINGS ON THE FIELD

**"I am hovering over things like Rebel, refuses the frame, affinity 16 percent.
Pre-teen, speaks from the solar throat. Innocent, takes it at face value,
affinity 71 percent. I am currently hovering and I am getting zero information
that is helpful to me."**

**"If I click, how do I get back?"**

### TT. THE RULE SET AROUND DATA AND INFORMATION.

- [ ] **TT1.** "What are our rules for our tooltips?" There are none, and that is
  the finding. A rule set has to exist before the copy is rewritten, or the next
  person writes the same unhelpful line in a different voice.
- [ ] **TT2. Everything must be meaningful.** His standard, and the test he just
  applied is the right one: read the line and ask what a person can do with it.
  "Refuses the frame, affinity 16 percent" passes no version of that test. It
  says what the archetype is called and how much of the blueprint it is, and
  neither is a thing about **him**.
- [ ] **TT3. What a tooltip owes, as a first proposal to be argued.** Three
  things and in this order: what this is, what it says about you, and what you
  can do with it. The current copy carries only the first. "Affinity 16 percent"
  is a share of a blueprint, and the useful sentence beside it is what a low
  share of that archetype means for the person reading it.
- [ ] **TT4.** The story team, the writers, editorial and copy own the sentences.
  The rule set is theirs too, and it has to be short enough to hold in a head.
- [ ] **TT5.** This lands on top of the information system already delivered,
  which ruled that a name is glossed once in one table and the tip shows it.
  That rule says WHERE a definition lives. His question is WHAT it has to say.
  They are two halves and neither works alone.

### NAV. THE WAY BACK, AND THERE IS NOT ONE.

- [ ] **NAV1.** "If I click, how do I get back?" Pressing a mark on the Field
  opens a drill and the drill replaces the surface. There is no back control, no
  breadcrumb and no gesture that returns a person to where they were.
- [ ] **NAV2.** This is worse than an inconvenience on this product: the Field
  is a thing a person explores by pressing into it, so a one way door punishes
  exactly the behaviour the surface is built to invite.
- [ ] **NAV3.** Escape already closes some sheets and not others. One rule, one
  control, every surface, and it has to work on a phone where there is no
  escape key.

---

## 0n. DELIVERED 20 SEPTEMBER. THE AVATAR, AND THE LEVER NOBODY NAMED.

`DESIGN-avatar.md` rewritten and `proto/avatar/` with three runnable approaches
plus an index. The prototypes load the product's own `engine.js` and compute
live, so nothing in them is a stored frame: run a release, turn any of the
twenty one law pegs, state a pair, take a hard month, go back to arrival.

### THE FINDING, AND IT IS ARITHMETIC BEFORE IT IS ETHICS

An avatar driven by the reading is useless before it is cruel. Measured by
replicating `ui/release.js:88` exactly, twelve runs at eight addresses:

    who      now    twelve releases    two points on the weakest three laws
    Marcus   39.2   40.5               42.5
    Sofia    56.6   57.3               61.6
    Gordon    0.8    3.9                1.1
    Diane    28.1   34.8               31.5

A quarter of all release work moves Marcus 1.3 points and never changes his
band. Two points on three laws moves him 3.3. **It reverses for Gordon.** Which
lever is yours is a property of the person, and this product has never said so
on any surface.

- [x] **AV1 to AV5 delivered.** Recommendation is the armature: 0.20ms median,
  5.8 KB of drawing code, and the only one of the three that needs no teaching,
  which matters because he rejected two Field concepts for exactly that.
- [x] **Three channels that never trade.** Record is append only. Reach is the
  only thing a person moves directly. Weather is grey and sits off the figure.
  A hard month leaves every record number byte identical while the reading
  falls, so **no demotion is expressible**. That is the answer to the risk that
  an avatar tells somebody they are worth more when they are less distressed.
- [ ] **AV7. The avatar has no writer.** `avatar.pairs` has three readers and
  zero writers. `avatar.built` is set only by `validateProfile` from an import
  that until this round had no control, so the monthly review clock could never
  fire. The two journal questions `drills.js:709` promises do not exist. It is
  one of the four doors on a blank profile and the only one that cannot be
  walked through.

### THREE DEFECTS IT FOUND IN FILES IT DID NOT OWN

- [ ] **AV8. `summary.js:273` prints a guaranteed false all clear.** It reads
  `pair.becoming` and `pair.seat`; the schema is `{be, notbe}`. `blocked` is
  always empty, so it always says "Every seat your avatar depends on is
  passing." It has never fired wrongly only because nothing can write a pair,
  and it becomes dangerous the moment a writer lands.
- [ ] **AV9. `drills.js:706` prints done of total**, a count against a total,
  which law 5 and CLAUDE.md both forbid.
- [ ] **AV10. `cqCeiling` and `cqHeadroom` are not exported**, so the headless
  gate cannot reach the most consequential number in the avatar design. Same
  finding the integrity census reached independently.
- [ ] **AV11. The weight sorted release queue never reaches the Crown or the
  third eye** for Diane, Marcus or Gordon across twelve runs. Stating a Heart
  pair takes Heart contact from 0 to 15 on Gordon, which is the argument for
  wiring the stated pair into the queue order.

### WAITING ON HIM

- [?] **Does the avatar replace the Field as the surface the app opens on, or
  sit beside it?** This blocks everything else in the design.
- [?] **A quarter of releases moves Marcus 1.3 and three laws move him 3.3. Do
  we tell him?** It is the truest thing the instrument can say and it also says
  the release is not his lever.

---

## 0o. RULED 20 SEPTEMBER, NINTH PASS. THE PILLS CHOSEN, AND VIBRANCY ANSWERED.

### PC. THE PILLS. TWO OF THE TEN SURVIVE.

- [x] **PC1. Ring and pill, and chip.** His picks out of the ten. Everything
  else on that page is reference now, not a candidate. Split, which was built
  because the product needs a held value and its opposite on one circle, is not
  among them, so that need is still open and has to be met inside the two that
  won rather than by a third shape.
- [x] **PC2. Numbers one point smaller.** Applied: large 19 to 18, medium 15 to
  14, small 12.5 to 11.5.
- [?] **PC3. And half a point smaller inside the circle, which the type floor
  refuses.** The extra small pill prints at 11.5 and the letters inside a ring
  print at 11, and eleven is the floor `tests/design.js` gate 4 enforces. A
  half point below it is 10.5 and the gate fails by name. So extra small stayed
  at 11.5 and the ring letters stayed at 11, and this is his to rule: either
  the floor moves, which it should not, or those two hold where they are.
- [ ] **PC4.** Low priority, his words, so it rides the next pass that already
  touches these files rather than starting one.

### VB. VIBRANCY, ANSWERED BY HIM, AND IT ALREADY EXISTS.

**His clarification.** "Vibrancy and vital energy are tied together. The more you
release, the brighter you are, the more biophotons you release, the brighter the
auric field."

- [x] **VB1. That reading is already in the engine and it already behaves that
  way.** `radiance`, at `engine/compute.js:192`, is the magnitude of the three
  axes: the square root of X squared plus Y squared plus Z squared, over the
  square root of three. Vitality, awareness and will, as one length.
- [x] **VB2. Measured, and it does what he said.** Nine axes held at 7 read
  radiance 0.296. The same profile cleared to 1 reads 0.791. **Clearing raises
  it by 0.495 of 1.** The more you release, the brighter it is, which is his
  sentence and the engine's arithmetic agreeing without anything being built.
- [x] **VB3. So my earlier answer was wrong and is withdrawn.** I ruled vibrancy
  was movement over time and costed a snapshot field for it. His reading is
  better and free: it is a live quantity, it is already computed, and it needs
  no schema change at all.
- [ ] **VB4. One line stays out of the copy, and it was already ruled once this
  session.** The drawing may get brighter as a person releases, because that is
  a true statement about `radiance`. The claim that this is measurable photon
  emission may not, because ultraweak photon emission from tissue is real, comes
  from reactive oxygen species, and has never been shown to carry nervous system
  state. The four glossary entries asserting otherwise were corrected earlier
  today. The mechanic is his and it is kept. The measurement claim is the thing
  that stays off the surface.

### ART. THE STYLE, LOGGED.

- [x] **ART1.** "Atmosphere and tissue. We do not like that style of art, so
  just notice, put that as a log." Logged as a standing preference and not only
  as two rejected concepts: the volumetric, soft focus, atmospheric treatment is
  not this product's look. Recorded here so the next art pass does not rediscover
  it by building it.
- [x] **ART2.** With the earlier verdict, that gives the art direction two
  negatives and one positive to work from. Not bulky. Not atmospheric. And the
  thing he responded to was the armature, which is line, structure and no haze.

---

## 0p. RULED 20 SEPTEMBER, TENTH PASS. THE ONBOARDING, AND THE TWO TESTS.

### OB. THE ONBOARDING, HIS NOTES, VERBATIM WHERE THEY ARE HIS

- [ ] **OB1.** "I do not want to see how many screens I have to go through."
  The dots go.
- [ ] **OB2.** One button to move forward. Not two.
- [ ] **OB3.** "Get rid of that, not now." The second control goes with it.
- [ ] **OB4.** "Welcome" goes. It reads **"Hello,"**.
- [ ] **OB5.** "This is you" stays. **"and it is okay" goes.**
- [ ] **OB6.** "No judgment, nothing here grades you" goes. His reason is the
  right one and it is a copy rule worth keeping: **we have not set anything up
  that would make a person think they were being graded, so denying it plants
  the idea.** A reassurance against a fear nobody has is an accusation.
- [ ] **OB7.** Speak directly to who they are, what they are, and their pain
  points.
- [ ] **OB8.** "We walk you through" goes. **Everything should be symbolic.**
- [ ] **OB9. No pop ups.** One screen, not a sheet over the product.
- [ ] **OB10. Icons for everything.**
- [ ] **OB11.** "You write what happened. It finds where it lands." That is
  **discover, play, flow.** It wants iconography, shown **as a loop**, with the
  words.
- [ ] **OB12.** The control says **Next**. Not "then try one thing".
- [ ] **OB13. Too much text. Super, super simple.** His words twice.
- [ ] **OB14. What the onboarding is actually for, and this reverses what is
  built.** "Each page should navigate you through: here is what the Field does,
  here is what Energy does, here is how they work for you, here is what the core
  loop does." It is a tour of the instrument, not a first reading.
- [ ] **OB15. And the hard constraint on all of it.** "At no point are we
  talking about results or purpose."

### SIG. THE SIGNAL TEST. WHAT IS BUILT IS NOT IT.

"This is not the signal test. The signal test is very personal. It has nothing
to do with any of this text here. Go do research on the signal test, come back
with your findings."

**His description, which is the specification:**

- [ ] **SIG1.** Ask a person to take a second and turn their senses inward.
- [ ] **SIG2.** Think **yes** ten times. Think **no** ten times.
- [ ] **SIG3.** Feel the difference in quality between the two.
- [ ] **SIG4.** One is positive, uplifting, expansive. The other is contractive
  or heavy.
- [ ] **SIG5.** **We all feel it differently and the words we would use will be
  different.** So the test may not ask a person to pick from a list of words,
  which is close to what the current build does and is why it is wrong.
- [ ] **SIG6. The point.** A thought has a sensation in the body. That is the
  mind body connection, and feeling it is what highlights the problem.

### OBS. THE OBSERVER TEST. A DIFFERENT THING, AND IT DOES NOT EXIST.

- [ ] **OBS1.** It walks a person back down their senses as a stack: feeling,
  smelling, listening, tasting, hearing, thought.
- [ ] **OBS2.** Until they realise there is a process of them perceiving the
  frequency and the sensation of thought, sitting in the stack **before** all
  the other senses.
- [ ] **OBS3. Awareness is a stack perceiving all the other senses.**
- [ ] **OBS4. Why it matters, and this is the product's own thesis stated
  plainly.** That is what you actually are. You, before emotional programming
  and sensory input. This tool exists to repair the mind body connection and
  then to help you understand who and what you are, by integrating any story
  that precedes awareness.

### FTH. THE FEATHERS, NOTED AND NOT ACTED ON

- [ ] **FTH1.** "Sofia's is actually interesting. It is the tightest looking
  feather, it looks the most detailed. I do not have a name for it though, and I
  do not know what you have done with the new one, so I do not want to give you
  any instructions on it yet." Recorded, no action taken, awaiting his look at
  the redesign.

### ATM. ATMOSPHERE IS NOT DEAD AFTER ALL

- [ ] **ATM1.** "There is something interesting about the atmosphere design now
  that I am looking at it again. It is not great. I want the team to review this
  and figure out how they would improve it." So it reopens: rejected as shipped,
  worth improving. That sits beside the standing log that the volumetric and
  atmospheric style is not this product's look, and the two together are the
  brief: keep whatever was interesting, lose the haze.

### VID. THE UNIVERSAL LAW VIDEOS

- [?] **VID1.** He has pointed at `G:\My Drive\Production\### TULA\Claude
  Code\Atuned Videos`. **That is a path on his own machine and nothing in this
  session can reach it.** This runs in an isolated container with no access to
  his drive. They have to be attached to a message, or pushed to the repository,
  or put somewhere fetchable. Named here so it is not mistaken for delivered.

---

## 0q. RULED 20 SEPTEMBER. THE COMPASS, AND WHY NOTHING EXISTS. PRIORITY.

### CMP. THE COMPASS. THREE FINDINGS, ALL HIS, ALL CONFIRMED BY LOOKING.

- [ ] **CMP1. The centre column is for hero art and it is full of prose.**
  Measured on the card at 1600: the figure gets 528 pixels and an information
  column beside it gets 340, carrying 1,107 characters. "You read 29 out of 100,
  below the oscillating band. Integrity 5.9 of 10. Integrity is the hull. A hole
  in it means the ship takes on water." All of that belongs in the information
  pane. **This was a deliberate decision in an earlier round, committed as "the
  compass opens flat, the information moves right", and he is reversing it.**
- [ ] **CMP2. The art changed and he never asked for it.** Four commits touched
  the compass look: `849636d` look development, `42917ed` symbols and a reading
  instead of a caption, `2015f8a` the information moving right, `caeb033` the
  eleventh note. None of them was asked for. Recorded so the next art change
  has to be requested rather than proposed.
- [ ] **CMP3. An equal number of bands, one per law of integrity.** His ruling.
  The figure currently names eight axes down its sides as master and inversion
  pairs. Twenty one laws means twenty one equal bands, and that is a redesign of
  the figure rather than a change to its labels.

### WHY NOTHING EXISTS, AND IT IS THE DEFECT ALREADY MEASURED THREE TIMES

He is right that the saboteurs are not there, and it is not a crash. Measured on
a blank profile, which is what a real arrival has:

    Fetters      9     the nine axes always exist
    Saboteurs    none
    Complexes    none
    Hyper        none
    Character    none

Nothing resolves because nothing is above the load line of 4, and nothing gets
above the load line because the sniffer cannot read ordinary writing. That is
FB2, FB3, SN1 to SN4 and the 465 of 1000 who cannot release, all surfacing on
one screen. **The rails are not inside any tab host, so `monitor.js` has never
looked at them and every "all surfaces render" this session was blind to it.**

- [ ] **CMP4. `monitor.js` must walk the rails.** It takes the tab host by id
  and the stack, the key strips and the shelf sit outside all of them. A watch
  that cannot see the thing a person says is broken is not a watch.
- [ ] **CMP5. `#eshelf` renders nothing on the Field.** Zero markup. `renderShelf`
  in `ui/mapshelf.js` writes there and the element is empty at 1600 on a loaded
  profile. Separate from the above and not yet explained.

---

## 0r. DELIVERED 20 SEPTEMBER. BENIGN AND MALIGNANT, WITH THE HARM TEST PASSING.

**The shipped lean scored survivors as malignant and deflectors as benign, and
that is now measured in both directions rather than argued.**

    account                        shipped   now     lack cues   admitted
    bullied at work                67        28.0    6           0.00
    a parent                       60        28.0    3           0.00
    an assault                     51        28.0    3           0.00
    coercive control, hardest case 41        29.4    5           0.38
    doing harm, owned              20        22.2    0           0.00
    doing harm, refused            36        45.9    8           8.00
    a field with nothing entered   28        28.0    0           0.00

Ordering correct in both directions. **The blame language in the harm accounts
is still counted.** A frame gate holds it rather than a shorter word list, and
that distinction is the whole design and is asserted in the gate.

- [x] **BM1 to BM4 delivered.** Four channels, not one axis: empathy shown,
  empathy withheld, accountability taken, accountability refused. The two lack
  channels are gated, the two positive ones are not.
- [x] **The lexicon went from 41 phrases to 269 scored**, plus 63 harm frame
  markers, 40 self action markers, 11 negators and 16 entries removed with
  written reasons. 372 table entries. Built on LIWC-22, Pennebaker, EPITOME,
  Gottman and the Leeds Attributional Coding System, all cited by URL.
- [x] **The frame gate, and why this shape beat the alternatives.** With no self
  agency evidence the admitted fraction is zero whatever the harm list holds, so
  **the safety does not depend on the harm list being complete.** An incomplete
  list costs a missed deflection, never a survivor called malignant.
- [x] **`tests/engine.js` group 31, 75 assertions, eight deliberate breakages
  all fired.** Removing the frame gate fails 11 and all three harm accounts read
  malignant again. The harm accounts are asserted as ordering rather than
  numbers, so tuning cannot fail it and inverting does, and each is asserted to
  have counted its blame cues, so nobody passes by deleting phrases.

### FOUR SHIPPED DEFECTS IT REPRODUCED ON THE WAY

- [x] `it was not my fault` scored 1 benign. A denial of fault read as taking it.
- [x] `let them think i did not know` scored 1 benign and 1 malignant at once.
- [x] `she made me realise i was wrong` scored 1 malignant, off `made me`.
- [x] `let it go` moved two instruments, a lean cue and a six gate detachment
  cue, so one phrase changed the cost multiplier on every held pattern.

### AND THE RESEARCH FINDING THAT CONTRADICTED THE OBVIOUS MOVE

Following LIWC literally would have broken it. Pennebaker's causal and insight
words look like accountability entries and are not: "because I was eleven" is
insight about being harmed, and the accountability list feeds the frame gate, so
a wrong entry there opens the lack side on a harm account. All bare causal forms
were cut. `i should have` is deliberately on neither channel, because the trauma
literature ties characterological self blame to worse outcomes and a matcher
cannot separate it from the behavioural kind.

### THREE THINGS FOR HIM

- [?] **What does a surface say?** "Your accountability is 34 of 100" is a
  verdict on a person from a keyword count and the seat refused to ship it.
  Three alternatives are laid out in `DESIGN-lean.md` for him to rule between.
- [?] **May the history whitelist gain one line?** `validateProfile` rebuilds
  every snapshot from a whitelist, measured at 16 keys written and 15 returned
  with `lean` silently dropped and `ok: true`. The seat declined to ship a field
  that looks stored and is not, which is the right call and this repository's own
  recurring defect. Without that line there is no per snapshot lean, ever.
- [?] **How is this ever evaluated honestly?** There is no labelled set, and the
  privacy ruling forbids holding the record joined to the story. The only route
  is a small hand labelled set of stories without records, labelled by somebody
  other than the author of the lists.

### AND ONE DEFECT OUTSIDE ITS OWNERSHIP

- [ ] **BM5. A field with nothing entered reads 28 of 100 malignant**, because
  `compute()` derives `malig` from CQ and CQ comes out 36 from the defaults on
  the twenty one laws. A person who has typed nothing is not 28 percent
  malignant. `compute.js` was out of that seat's scope and this is the same
  class as every other reading that prints off a default.

---

## 0s. DELIVERED 20 SEPTEMBER. THE SIGNAL TEST, AND IT IS IN HIS BOOK.

**Both exercises are already in The Mechanics of Being, in his own words, and
they outrank everything else found.** Not under those names. The signal test is
"Part One, System Check" at line 3323, and the observer test is "Part Three,
Observer Sequence" at 3332, nine numbered steps. Quoted with locations in
`RESEARCH-signal.md`.

### WHY THE BUILT EXERCISE IS NOT HIS. SIX DEFECTS, `ui/onboard.js:158-183`.

- [x] **SIG7. It is untimed**, and that makes the rest possible. Both words are
  written into the document at once. A person reads the screen in four seconds
  and clicks. His description opens with "take a second, turn their senses
  inward" and there is no second in it.
- [x] **SIG8. The contrast is between two stimuli the product chose**, not two
  acts the person generates. Yes and no carry no subject matter, which is why he
  chose them. "Fear" does, so what moves may be the person's history with the
  word rather than the act of negating.
- [x] **SIG9. One exposure, not ten each.** No repetition anywhere in the step.
- [x] **SIG10. It asks for a location from a list of seven.** His specification
  is a quality difference, and a list of seven seats is exactly the vocabulary
  his sentence rules out.
- [x] **SIG11. It grades the felt sense against a lookup table**, comparing the
  picked seat to the expected one, and then says "yours is the one that counts"
  after the comparison has already printed.
- [x] **SIG12.** And line 172 reads "There is no right answer." Nothing had
  suggested there was one. **Same shape as the line he struck at 123**, and the
  rule from that ruling catches it.

### HIS OWN RULING ON PLACEMENT, FROM THE BOOK

- [ ] **OBS5.** Line 3321: **"The Observer does not unlock at the beginning of
  the work. It unlocks through the sequence. Explain it and it becomes an
  idea."** So the observer test is not onboarding material, by his own text. It
  goes in the ritual, offered before the first release, which is the moment his
  own backlog note about not taking a release personally already names.
  Onboarding may say the layer exists. It may not run it.
- [ ] **SIG13.** The signal test stays in onboarding at 81 seconds of paced
  attention, inside the two minute budget the current screen promises.

### THE CAPTURE PROBLEM, SOLVED WITHOUT NAMING A SENSATION

**Capture the structure of the difference, not its content.** Six mechanisms,
three built. What comes out is separation, stability, latency and consistency:
four within person differences, none of which names a feeling. The one that
matters most needs no shared vocabulary at all: a person's own word for what
they felt, and whether the same word returns next session.

### THE RESEARCH, INCLUDING THE PART THAT GOES AGAINST US

- [x] The muscle testing evidence is bad and it is reported straight. Hall 2008,
  22 studies, insufficient evidence. A 2014 double blind at 80 correct of 151
  trials, which is 53 percent and not significant, with two of three practitioners
  at chance.
- [x] **And the distinction that saves the exercise.** Every one of those studies
  tests muscle testing as an external diagnostic reading a fact about the world.
  His signal test is a first person noticing task. **The literature condemns the
  claim, not the exercise.**
- [ ] **SIG14. But this product makes the condemned claim.** `engine/data/practice.js`
  carries a row keyed `truth`, The Somatic Truth Check: "Expansion means true.
  Contraction means distortion. Use it live, in the moment, as an instrument."
  That is the applied kinesiology truth detection claim in this product's own
  voice and the evidence is against it. His call.
- [x] **SIG15. The central claim is unsourced and is marked so.** No study was
  found testing whether thinking yes reliably produces an expansive sensation and
  no a contractive one. The nearest support is a three link indirect chain.
- [x] **SIG16. Ten repetitions at speed is the one pace that breaks it.**
  Semantic satiation onsets at 10 to 50 repetitions at two to three a second, so
  the word hollows out before the beat ends. The prototype uses a 3000ms beat
  for that reason.

### SIX PLACES THE BOOK AND HIS SPOKEN DESCRIPTION DISAGREE

- [?] Aloud, as the book says, or thought, as he said.
- [?] Location, as the book says, or quality, as he said.
- [?] No repetition count in the book against ten each in his description.
- [?] The order of the senses. His spoken list names the auditory channel twice.
- [?] **The sharpest one.** Book line 3339: **"The Observer is not the awareness.
  It is what is aware of the awareness."** That separates two layers his spoken
  description collapses into one, and `kb.js` currently follows the book.

### AND A COLLISION WITH THE GAMIFICATION NOW IN SCOPE

- [?] **SIG17.** The systematic review of self caught methodologies, 39 of 790
  studies, finds that **incentivising self catching produces over reporting.**
  The observer test's "that landed" tap is the only signal it collects, and
  feeding it points, badges or a streak would destroy it. The two features
  cannot both have it.
- [?] **SIG18.** And the question under all of it: does either exercise need to
  produce a number at all? Both could capture nothing but a timestamp and still
  do what he described.

---

## 0t. A GATE DEFECT. THE FRAME RATE ASSERTION IS LOAD SENSITIVE.

`tests/design.js:617` asserts the Field animates at 30 frames a second or
better, measured over 1400 milliseconds of `requestAnimationFrame` in a live
Chromium. That measurement is taken on whatever machine the gate happens to be
sharing.

Measured today on one unchanged build:

    design.js run on its own, three times      105 of 105, 105 of 105, 105 of 105
    design.js run after the other three gates  103 of 105, twice, both fps

- [ ] **GT1.** So the gate reports a product defect when the only thing that
  changed is what else was running. That is the shape this repository already
  refuses in a probe, and it is worse in a gate, because a gate that cries wolf
  gets ignored on the day it is right.
- [ ] **GT2.** The floor is not the thing to move. Thirty frames a second is the
  right bar and lowering it to make a red run go green would be the exact defect
  named above. The measurement is what has to change: a warm up discarded, the
  median of several samples rather than one window, or the frame budget measured
  as work done rather than as wall clock.
- [ ] **GT3.** Until then, a red fps line in a stacked run is re-run on its own
  before it is believed or reported, and the re-run is quoted rather than the
  first result.

---

## 0u. DELIVERED. THE SNIFFER, AND THE THIRTEEN QUESTIONS HE ASKED FOR.

**The floor is built and gated, and the headline is that the floor was never the
problem.** After both derivation passes, 856 of 9,431 sentences of his own book
produce any hit at all. **Nine percent.** That is no longer a vocabulary problem
and was never going to be solved by one.

    axis names that resolve            1 -> 9 of 9
    saboteur cue words that resolve    0 -> 7 of 7
    lexicon entries                    192 -> 229
    charge name entries                66 -> 84
    persona voices with an imprint     1 -> 2 of 14
    persona voices with a route        0 -> 0 of 14
    book sentences with a hit          609 -> 856 of 9,431

Leakage checked, which matters more than the gains: over the same 9,431
sentences, 296 readings changed, **0 sentences lost a seat and 0 band totals went
down.** The lexicon feeds the whole product, so a change that lowered an existing
reading would be a regression nothing could see.

### TWO FIGURES OF MINE THAT DID NOT REPRODUCE

- [x] **I said 77 of 192 lexicon words appear in the book. It is 87**, with 71
  appearing twice or more.
- [x] **I said the book is 433 KB. It is 5.9 MB**, 1,370,841 characters of text
  and 135,635 words. I read 433 KB off a truncation notice about my own tool
  output and reported it as the file size. Checked directly now.

### THE THIRTEEN QUESTIONS, AND THE TWO THAT DECIDE THE REST

- [?] **Q1. When a person writes in the journal, are they reporting an event or
  stating a stance?** The fourteen persona voices this product ships are all
  stance: "Rest feels like a moral failure." "There is nothing wrong with me."
  **A vocabulary cannot reach a stance.** Today the instrument is built for
  events and every held example is a stance. If the journal receives stance, the
  frame layer is the product and the lexicon is a side show.
- [?] **Q2. Is the lexicon derived from the book, or a separate instrument
  vocabulary with its own justification?** 87 of 192 authored words appear in the
  book, 105 do not, and 8 of 124 idiom phrases do. Both answers are defensible
  and they are different products.

### THE THREE THAT CHANGE EVERY READING EVER PRODUCED

- [?] **Q3. Does it read negation?** "I was angry" and "I was not angry" both
  give solar 18. "I am not afraid but I could be afraid" gives root 32, **double**
  what "I am afraid" gives. A denial currently raises the reading.
- [?] **Q4. Is the charge the same when a person did it as when it was done to
  them?** "I shouted at him" and "he shouted at me" both give solar 24. The 112
  addresses already distinguish the two.
- [?] **Q5. Is a charge a person has released still a charge?** "I panic every
  day" and "I used to panic and I do not any more" both give root 28. The loop is
  release, so a person writing about a release is charged by their own account of
  it.

### FOUR CONTRADICTIONS INSIDE THE CANON

- [?] **Q6. Where a charge sits has two answers and they disagree.** `CHG2SEAT`
  says Shame is sacral; the addresses make Shame modal at the throat 3 to 1. It
  says Apathy is throat; the addresses make it sacral 8 to 0 and the throat
  carries no Apathy address at all.
- [?] **Q7. Surprise appears 0 times in 117,716 words of the book**, has no
  authored vocabulary, and is scored on every reading and drives two saboteurs.
  Is it an axis the canon argues for?
- [?] **Q8. What does the number 24 mean?** 181 charged amounts, range 12 to 28,
  median 24, and no stated scale anywhere. One sentence naming the top of the
  range makes the other 180 auditable.
- [?] **Q9. When a longer specific entry contains a shorter idiom, which wins?**
  "I cannot stop thinking about it" reads as compulsion at the sacral, because
  the idiom "cannot stop" outranks the entry "cannot stop thinking" at the third
  eye. A person ruminating is told they are compulsive. Wrong seat, less charge.

### AND THE ONE THE SEAT WOULD ASK FIRST

- [?] **Q13. `inferred:false` is reporting green while the product prints an
  address nobody named.** "I was furious" returns four imprints named **Pride,
  Arrogance, Competition and Anger, all flagged `inferred:false`**, which says
  the person named it. The flag is truthful about what it guards, the axis, but
  **no word ever names an address**: the four are a susceptibility sort. So the
  flag built to stop exactly this is green while the product tells somebody they
  have Pride because they wrote furious. Either the flag splits in two, axis and
  address, or a reading stops printing address names.

### WHERE IT DISPUTED THE BRIEF, AND WAS RIGHT TO

- [x] **The stemmer fold is not the cheap win it was measured as.** Fourteen
  rules over 145 keys generate 438 forms, of which 31 are confirmed by a corpus
  this repository holds. Seven percent. The other 407 are strings like "ashams".
  Worse, **two of them fold off coherent keys, which subtract**, so an
  unrestricted stemmer would have had the word "contents" quietly lowering
  somebody's reading. Four are refused by name with reasons and 27 admitted.

### WHAT WAS BUILT

- [x] Entries have a schema, a source and a validator. `lexAdd` and `chgAdd` are
  the only way in, with eleven refusal classes each by name. `LEXMETA` and
  `CHGMETA` cover their tables exactly in both directions, gated.
- [x] The canon pass derives ten words from tables that already have an owner,
  and **where `CHG2SEAT` has no answer it refuses to guess and reports the word**,
  because the addresses carry a second disagreeing answer and picking one would
  launder a ruling nobody has made.
- [x] `tests/engine.js` group 32, 46 assertions, broken four ways on purpose and
  each failure named the right thing. It asserts closure rather than accuracy,
  because accuracy needs a labelled set of real stories and there is not one.
- [x] `scanStory`, `parseStory` and `applyStory` keep their bodies and
  signatures. Nothing in the reading path changed.

### TWO DEFECTS REPRODUCED AND DELIBERATELY NOT REPAIRED

- [ ] **SNF5.** `parseStory`'s stated branch takes the first stated fetter
  **globally** rather than the one for that band, so a story stating two fetters
  gives every band that cannot house either the first one.
- [ ] **SNF6.** The precedence bug behind Q9 is one clause in `scanStory`, and
  which way that clause goes is a ruling rather than a repair.

---

## 0v. RULED 20 SEPTEMBER. THE RITUAL BUILDER IS A D MINUS. PRIORITY.

**His verdict.** "When I come to the ritual builder, nothing that I have asked
for is here. I asked for the ritual builder to be clean, simple, to comp against
apps in a similar category, and that did not happen. When I come to this page
right now it has a bunch of text, I do not know what is going on, it is
meaningless. The design, the UI, the UX, the layout, it has not even been
touched yet. **This is a D minus.**"

**The comp he gave:** Streaks, `apps.apple.com/us/app/streaks/id963034692`.

### RB. WHAT THE RITUAL BUILDER HAS TO BE

- [ ] **RB1. It looks like a compass**, to track daily progress. His word, and it
  is the same shape language as the Field and the Compass, so the product has one
  visual grammar rather than three.
- [ ] **RB2. Iconography for the type of ritual.** Not a list of names.
- [ ] **RB3. A daily tracker.** What is running, and what I need to do today.
- [ ] **RB4. An edit control** to add or remove history.
- [ ] **RB5. A heat map**, so the work is visible over time.
- [ ] **RB6. Analytics.** Whatever the data honestly supports.
- [ ] **RB7. The accountability tracker shows how I have done over time**, and it
  is a surface of its own rather than a line on a card.
- [ ] **RB8. Clean and simple.** Said three times in one message.

### RB. THE GAMIFICATION, WIRED THE WAY HE DESCRIBES IT

- [ ] **RB9. Points are tied to the ritual builder and the accountability
  tracker.** "If I fail an accountability I lose points. If I succeed I gain."
  **This reverses a refusal made earlier today.** The gamification pass declined
  loss framing on the evidence and priced it at 3.0 points of the 11.0. He is
  ruling the other way on this one mechanic, and the argument and its price are
  on the record so the decision is his with the number in front of him.
- [ ] **RB10. The core loop, in his words.** "When I input stories I get points
  by the type of impression that I add, and that allows me to go through my core
  product loop of imprints and release."
- [ ] **RB11. And the sniffer feeds it.** "The sniffer sniffs for things that
  could go into the ritual builder to improve behaviour." That is a new consumer
  of the sniffer and it is the first one that turns a reading into an action.

### WHAT IS ON THE PAGE NOW AND SHOULD NOT BE

- [ ] **RB12. "Box breathing has nothing to do with this. It says body. I do not
  know what the hell is going on, that does not belong there."** The track is
  picked by the heaviest seat and a root heavy reading calls the Body track, so
  the arithmetic is behaving. **The naming is what fails**: nothing on the card
  says why a breathing exercise arrived, so it reads as arbitrary.
- [ ] **RB13. "The where and when does not belong there."** His call, and it
  reverses something built today. Recorded with its price so he is ruling with
  the number: the if then plan measured **72 of 1000 at day thirty**, the largest
  single item in the loop, on Gollwitzer and Sheeran, ninety four studies at
  d 0.65. It may still be the wrong surface for it.
- [ ] **RB14. "The record does not belong there."** Also built today, also
  measured, at **40 of 1000 at day thirty**. It was moved onto Ritual because it
  was locked inside the Compass, which measures 22 percent touched. If it leaves
  Ritual it needs somewhere that is not the Compass.

### AND THE QUESTION HE ASKED ABOUT QUESTIONS

- [x] **RB15.** "I need my team to probe me with questions. In fact, I think all
  the director team, did they not ask questions? Did I answer them?" **They did,
  and almost none are answered. There are 66 open questions in this file**, most
  of them raised today, each one a place where a seat refused to guess. The
  largest groups: fifteen from the aesthetics and systems pass, thirteen from the
  sniffer, eight from the arrival and karma pass, seven from the signal test,
  five from the ritual loop and five from the skunk works.
- [ ] **RB16.** So the next thing owed to him is not more questions. It is the
  existing sixty six, sorted so he can answer them quickly, with the ones that
  block work marked as blocking.

---

## 0w. RULED 20 SEPTEMBER. PLAIN WORDS, THE KNOWLEDGE BASE, AND AT A GLANCE.

### TX. THE SCALE PHRASINGS. SCRUB THE WHOLE APP.

**His ruling.** "There is some weird text that says the waist is 40 to 60 out of
100. First of all, I told you never to write text like that any more. Scrub the
entire app, look for stuff like that. **If you cannot use regular words to
describe it, do not describe it.** And 40 to 60 out of 100 does not give a lot of
specific detail."

- [ ] **TX1.** This collides head on with the standing number law, which says
  every number says what it is out of, and **his ruling wins**: the point of that
  law was that a bare 13 means nothing, not that every figure should be dressed
  in a denominator. Where a plain sentence can say it, the plain sentence goes.
  Where it cannot, the number goes, not the scale.
- [ ] **TX2. The one he found**, `ui/cone.js:752`: "The waist is 40 to 60 out of
  100, where most people oscillate." It is the tool explaining its own middle,
  and it should say that in words or not at all.
- [x] **TX2b. And the distinction that makes this scrubbable rather than
  endless.** A small scale label under a figure is the number law working: "83"
  above "of 100, plus or minus 6" tells a person what they are looking at in two
  words. **Prose that hides behind a scale instead of saying something is the
  defect**, and that is what he found. So the scrub reads every one out loud as a
  sentence and keeps the ones that survive it. Done so far: the compass hint,
  which said "the waist is 40 to 60 out of 100 where most people oscillate" and
  now says "the narrow middle is where most people sit"; the compass reading,
  which printed coherence twice in two sentences; and the coherence tooltip,
  which repeated a figure the pill beside it was already printing.
- [x] **TX3. The rest of them, read out loud, and the scrub is finished.** Ten
  sites were named. **Three were prose and are fixed**, the compass hint, the
  compass reading and the coherence tooltip. **Seven are scale labels and they
  survive**, because read aloud they are a person being told what they are
  looking at rather than a sentence dodging its job: "accuracy, of a hundred,
  plus or minus nineteen" and "coherence, fifty one percent, of a hundred".
  Those are `personas.js:220`, `summary.js:76`, `:99`, `:103` and `:108`,
  `wheel.js:452` and the one in `panels.js`. Everything else the grep found is a
  code comment.
- [x] **TX4. And the functional gate had to be re-ruled**, because it encoded the
  superseded version. It demanded the literal string "N of 100" on the compass,
  which was right under the old ruling and wrong under the new one, and it failed
  the moment the prose was fixed. **The thing worth protecting was never the
  denominator**, it was that a reading is never a bare number with nothing to
  make sense of it by. So it now asserts that: the compass reading carries either
  a scale or the band it sits in, said in words. Both satisfy a person and only
  one satisfies a regular expression, which is why the regular expression was the
  wrong thing to assert.

### KB. THE KNOWLEDGE BASE. FIVE PASSES, FOUR SEATS.

"Review the knowledge base page five times with the art director, the creative
director, UI UX, and the writing team."

- [ ] **KB1.** Click anything in the centre and the centre display area shows all
  the information for it. The centre is the destination, not a list that links
  elsewhere.
- [ ] **KB2. The icons are huge and taking up too much space.**
- [ ] **KB3. The subtext is eating the page.** "Right now we have got fear, root,
  lumbar plexus, axis fear. That text is eating up valuable real estate." And
  "positive intelligence, three addresses, positive intelligence, three
  addresses" repeating down the page.
- [ ] **KB4. What a row should be, and it is four things:** the icon, the percent
  it is impacting you, the word, and the seat it sits at. Nothing else.
- [ ] **KB5. Everything should have a percent.**
- [ ] **KB6. Everything should be icon dominant.** Symbolic meaning first.
- [ ] **KB7. The universal laws go in order, because it is a flow.** They are
  currently not ordered as one.
- [ ] **KB8. "Laws" is the wrong label. It is moral integrity.**

### NM. AND A ONE WORD PER CONCEPT VIOLATION HE CAUGHT

- [ ] **NM1.** "I do not know the difference between a node and a fetter the way
  you are using it. **A fetter is a node. The fetters are the 108.** Which you
  listed here between fear, anger, shame, these are the nine child emotions. Very
  different."

  **He is right and the product's own glossary agrees with him.** `kb.js` defines
  a fetter as "a named conditional response pattern resident at a specific node
  address, 108 fetters in the body, one per physical node." And the code then
  calls the nine axes `CHILD`, described everywhere as the nine poled child
  fetters. So the word carries the 108 and the 9 at once, which is exactly what
  one word per concept forbids. The nine need their own word and he has given
  one: **the nine child emotions.**

### GL. THE SUMMARY, AT A GLANCE. THE RIGHT HAND SIDE.

"My summary page on the right hand side should basically be at a glance. I
should be able to see everything."

- [ ] **GL1. The icons in the flow section do not live anywhere else.** Giant
  icons reading predatory, dysregulation, predatory. That breaks the standing
  rule that if it has a name it has an icon, the icon has a family, and the
  family has a colour, because these belong to no family.
- [ ] **GL2.** How I relate to my **integrity**, the spiritual laws of integrity.
- [ ] **GL3.** How I relate to my **nine child emotions**.
- [ ] **GL4.** How I relate to the **six motion axis**. His words, and the
  product has no six of anything by that name: it has six masks, six gates in the
  VERP set, and six koshas. Named as ambiguous rather than guessed at.
- [ ] **GL5.** How I relate to **benign or malignant**, which is the thing the
  lean work just built and which currently reaches no surface at all.

### CMP. THE COMPASS, AGAIN

- [ ] **CMP6.** It does not take the full screen.
- [ ] **CMP7.** "I do not like this compass. The layout just needs to be
  redesigned. It is terrible." Held deliberately: **"let us see what we are going
  to do with the updated version first."** So no compass work starts until he has
  seen the ritual builder redesign, because that round sets the shape language.

---

## 0x. THE SNIFFER SPEC ARRIVED. IT IS CANON AND IT CONTRADICTS THE ENGINE.

`SNIFFER_SPEC.md`, his, built from `reviews/canon.json`, `ENGINE.json`,
`reviews/elements.json` and `MOB_Complete_v330.html`. It says everything in it is
already ruled unless marked OPEN and that nothing in it is invented. **So where
it and the engine disagree, it wins until he says otherwise.**

Three passes by the team, then the schema, then the algorithm, then integrate.
His instruction.

### THE CONTRADICTIONS, MEASURED BEFORE THE TEAM STARTED

- [ ] **SP1. CQ is defined two different ways and the gap is 24 points on a
  blank profile.** The spec, section 6: "**CQ is defined as the mean of these 21,
  each scored 0 to 10, times 10.**" The engine: `CQ = It * Ig / Rz`. On a blank
  field the engine reads **36** and the spec reads **60**. This is the single
  largest thing in the document and it changes every reading the product has ever
  produced. It also touches `cqCeiling`, the tier ladder, the release meter and
  the accuracy figure.
- [ ] **SP2. The saboteur bands are keyed on a different vocabulary.** The spec
  gives each of the 33 a band on the nine axes, for instance Avoider at Apathy
  6 to 8 and Fear 5 to 7. The engine's `SAB33` keys Avoider on `fear` 3 to 5 and
  `anxiety` 5 to 8, and `anxiety` is not one of the nine. Same 33 names, same
  shape, different numbers and different terms.
- [ ] **SP3. Band edges are ramps, not cliffs**, and the engine uses a hard
  floor. His measurement: a hard edge scores 94 percent on exact readings and
  **collapses to 73 percent when the reader is off by one point**, which he calls
  the normal condition.
- [ ] **SP4. Intensity peaks inside the band and tapers above it.** The engine
  has no taper.

### WHAT THE ENGINE ALREADY SATISFIES, CHECKED RATHER THAN ASSUMED

- [x] **Two readings per axis, never one signed number.** Guard 3. The profile
  already carries `{held, opp}` per axis and the engine already carries
  `S.charge` and `S.replace` as separate tables. The structure is right.
- [x] **Surprise fires no saboteur.** Guard 6. Zero of the 33 are keyed on it.
- [x] **Radiance is the magnitude of the vector, not a fourth axis.** Section 8,
  and `compute.js:192` already computes exactly that.
- [x] **All 33 saboteur names match**, including Negotiator and Catastrophizer.

### THE PARTS THAT ARE NEW WORK

- [ ] **SP5. The mirror principle.** Locate, charge, gates, replacement. The
  sniffer mirrors the release protocol and **ends at an address with a named
  replacement state, because that is what release consumes.** The `offer` field
  is the payload and everything else is evidence for it.
- [ ] **SP6. `because` is always emitted.** "A confidence number with no citation
  is not inspectable, and this system's whole defence is that it shows its work."
- [ ] **SP7. The 21 laws each get what a violation reads as**, and four are
  **bidirectional**: Compassion, Humility, Generosity and Ownership. "A sniffer
  that only looks for the obvious pole will miss half of them. Self abandonment
  reads as virtue in a journal."
- [ ] **SP8. The three axes are not three peers.** Aware/ignorant and
  detached/attached both feed intentional/avoidant, which is the sump. Measured
  cascade: 14.5 percent avoidance with both upstream clean, 43.2 with one
  distorted, **71.9 with both.** And the product consequence is ruled: an
  avoidance number shown alone reads as a character flaw, so the upstream state
  goes with it.
- [ ] **SP9. Dante's nine circles as a depth scale with somatic addresses.**
  `CIRCLES` already holds them. The C8 test is called the single most sniffable
  line in the system: **does this person's warmth cost them anything, or does it
  require an audience.**
- [ ] **SP10. Avoider fires in 81 percent of runs and costs 0.1 points.** Weight
  it low or the sniffer reports Avoider on everything.
- [ ] **SP11. Resentment is a composite**, Anger plus Apathy, not Anger. Mapping
  it onto Anger collapsed Aggressor and Manipulator in simulation.

### THE FOUR FILES THE SPEC SAYS TO LOAD ARE NOT IN THIS REPOSITORY

Section 13 is titled "files to load, not retype" and names four. **None of them
is here.** Checked directly:

    reviews/elements.json        missing
    ENGINE.json                  missing
    reviews/canon.json           missing
    handoff/ATUNED_SPEC.json     missing

- [?] **SP14.** This matters most for `reviews/elements.json`, which the spec
  calls **"your lexicon"** and says to load directly rather than retyping. It
  holds 76 elements with `sh` and `co` strings, the shadow and coherent pair for
  every one, and section 7 says that file is what the flow layers are read from.
  Without it the expression shadows, the nature and human nature layers and the
  coherent pole for every element have to be retyped from the specification's
  prose, which is exactly what it tells us not to do.
- [?] **SP15.** `ENGINE.json` is named as the source of the saboteur bands, the
  axis addresses, the archetypes, the domains and the formulas. The band table is
  printed in full in the specification so that part survives. The formulas are
  not, and the CQ contradiction is a formula question.
- [?] **SP16.** `reviews/canon.json` is named as "every ruling, with dates and
  provenance", which is the thing that would settle the E43 inconsistency and the
  benign and malignant conflict without asking him.

**So: send the four files, or the work retypes from prose and the specification's
own instruction is broken on the first line of section 13.**

### AND ONE INTERNAL INCONSISTENCY IN THE SPEC ITSELF, RAISED NOT GUESSED

- [?] **SP12.** Section 7 says 76 numbered slots with 75 live because **E43 is
  retired**. Section 6 lists **E43 as Wisdom**, live, with a violation string. One
  of the two is wrong and it is his document.
- [?] **SP13. The benign and malignant polarity conflict is named as OPEN in the
  spec**, section 12: "malignancy counts up in one place and down in another,
  resolve before scoring anything on it." **The lean work delivered today scores
  on it.** It has to be reconciled against this before it reaches a surface.

---

## 0c. RULED 20 SEPTEMBER, SECOND PASS. THE ARRIVAL, THE FEATHERS AND KARMA

**"I didn't give you feedback on the feathers. I don't give you feedback
because there's so much volume of information that I can't read everything."**
Taken as a finding about the reports, not about him. Shorter replies, and a
question asked rather than a report filed.

### AH. THE FEATHERS. THE CORE GRAPHIC.

His words: "When I zoomed in on it, I thought it was interesting, I thought it
was really pretty, and I went to go click on it and I couldn't do anything with
it. So we have an element that is taking up real estate that provides no actual
information. That's a problem."

- [ ] **AH1. The defect.** The core feathers carry no reading and no door. An
  element on the most looked at surface in the product that says nothing about
  the person is real estate spent on decoration. Either it carries a reading or
  it goes.
- [x] **AH2. His proposal, tested by rendering it. Length is right. Width is
  wrong.** Four prototypes at `proto/feather/`, measured by isolating each mark
  and differencing against a marks off render, counting pairs where the larger
  reading carries less ink. Length plus width: **32 of 105 backwards on Diane,
  37 of 88 on Tomas**. Length alone: **0 of 105 and 0 of 88**. The widest single
  lie, on Diane: Duty reads 8.4 and carries 4,388 pixels, Unity reads 6.1 and
  carries 4,847. The profiles that score zero are the ones whose seat loads are
  flat, so the channel is silent there and wrong everywhere else.

  **What replaces width: the vane.** Barb count and barb alpha, not width.
  Texture rather than footprint, orthogonal to length, zero backwards pairs on
  every profile. And it is the better symbol, because a feather carries when its
  vane is intact.
- [x] **AH2b. And the current feathers are worse than decoration.** Measured:
  thirty one marks, `coreFeather` at `ui/wheel.js:266`. All thirty one tips
  probed with the product's own `hitTest` at four zoom levels returned `core`,
  so there is one target under all of them and it opens a drill printing the CQ
  number the feathers are made of, which is already in the strip above and the
  rail beside. Ink is 20,079 pixels, 23.2 percent of the core disc. Two of three
  series are drawn on gridlines that are wrong for them, so a seat at a true 10
  reads 9.25 and a triad at a true 1.00 reads 8.60. Eleven of the thirty one
  pairs share an angle, and reduced motion zeroes the spin, so under reduced
  motion eleven pairs sit permanently on top of each other. And **the blank
  profile draws more feather than Marcus does with a full story and twenty one
  answered laws**, 22,275 pixels against 20,358, because 28 of 31 sit at the 6.5
  default. The screen says more about a person the less it knows.
- [~] **AH2c. The design, specced and ready, not landed.** `DESIGN-feathers.md`
  and `proto/feather/wheel-core.patch.js`, parse checked by splicing into a copy
  of the real file. The twenty one laws of moral integrity grouped into the seven
  seats they sit at, on the shell's own seat arcs so the core becomes an exploded
  view and the seat names outside label it at no cost, which satisfies no text
  over the hero graphic by not needing any. One scale for every mark: hub is
  zero, rim is ten. An unanswered law is a bare quill with an open tip, so the
  blank profile is twenty one stripped shafts rather than a full display of
  defaults. Breath rate is the reading, two seconds at CQ 0 to five at CQ 100.
  Twenty one wedge targets of kind `law` in `HIT`, which `describe()` and
  `pointerdown` already serve: hover answered 21 of 21, click opened 21 of 21.
  Frame 0.40ms median against 0.4 today. **Held pending AH5, because one open
  question changes the design.**
- [?] **AH5. What number is vibrancy?** His word, and it decides the second
  channel. Seat charge inverted is the only per law quantity the engine already
  holds. If he means conviction, frequency or recency, none of the three exist
  and each is a new intake field.
- [?] **AH6.** Does the triad leave the core. It is three states scored 0 to 1
  drawn on a ring calibrated 0 to 10, and it already has its own door on the key
  strip, so the spec takes it out. His call.
- [?] **AH7.** Should the core stop sizing by CQ once it is open. Tomas gets a
  94.7 pixel chart and Rosa 277.4 on the same twenty one marks, so a chart that
  shrinks with its own reading hides the worst readings, which are the ones
  worth looking at.
- [ ] **AH3. A hundred passes.** UI UX, design and the art director hash it
  amongst themselves a hundred times, for the best **visual** and, his
  emphasis, the best **symbolic** representation. Symbol first.
- [ ] **AH4. Answer what the feathers are.** He asked what the shape symbolises
  and the answer was given from the code. Whatever it becomes has to be sayable
  in one line in a tooltip.

### AI. THE INTRO ANIMATION.

- [ ] **AI1.** Two more seconds on the end.
- [ ] **AI2.** And it settles one second sooner. Longer tail, earlier rest.
- [ ] **AI3.** **Kill the pulse at the end.** "It does this weird pulse at the
  end. I'm not a fan." Replace with squash and stretch. His words: "squash and
  stretch to me is one of my favourite things in animation anyway, so let's
  find a way to give this thing more character."
- [ ] **AI4.** The halo sits too close to the top.
- [ ] **AI5.** **Powered by Source OS.** Source OS aligned underneath Atuned.
  "powered by" very small, to its left.
- [ ] **AI6.** A trademark mark on Atuned. Not registered yet, and it goes in
  anyway, on his ruling.

### AJ. THE ARRIVAL. WHAT A PERSON MEETS COMING OFF THE FUNNEL.

His words, and they are the brief: "I want to be greeted. I want to be
welcomed. This is a highly intentional, highly impactful, highly purposeful
results as a service product. We're coming from the highest of high. This is a
mirror of the person. We're going to be showing them their inside. We don't
want to be cold."

- [ ] **AJ1.** Greeted and welcomed. Warm. The current first screen is neither.
- [ ] **AJ2. The substance of the welcome,** in his order: this is you, and it
  is okay. No judgment. We walk you through you and show you how you run. We
  show how these patterns operate inside you and how they influence your
  behaviour. The stress we have conditioned as normal is making us sick, and
  this tool shows you how and where, and gives you the what and the how.
- [ ] **AJ3. The term.** "Body mind complex." He likes it because it says what
  it is. Ontological wellness for the body mind complex. Copy and brand to rule
  on whether it is the product's own word.
- [ ] **AJ4. It should read as a secret site.** "I'm coming here off the funnel
  to effectively what looks like a secret site that is welcoming me into a
  brand new universe that is going to show me me from the inside."
- [ ] **AJ5. Show, not tell.** Japanese Zen. Not text heavy. The welcome is
  carried by what a person sees, not by paragraphs. Art direction, storyboards
  and UX own this, not copy alone.
- [ ] **AJ6.** Simulate the arrival ten times and float it to the creative
  director before it is built.

### AK. KARMA. THE REFERRAL AND THE COIN.

- [ ] **AK1. Referral.** Invite a friend, get 25 unique patterns, or the equal
  amount of the coin.
- [ ] **AK2. The coin is karma,** for now. The karma bank.
- [ ] **AK3. An icon for karma.** Ring, not fill, like everything else with a
  name.
- [ ] **AK4.** Achievements and badges pay karma. "Whenever you get an
  achievement or badge, that's your good karma."
- [ ] **AK5. Say what karma is,** in the product, "because all the stories
  basically are karmic patterns. That's really funny." He is right that it is
  the same mechanic under two names, and that is the reason to name it.
- [ ] **AK6.** Where the referral integration sits is open. It needs a server,
  so it is behind the funnel work.

### AM. TOOLTIPS.

- [x] **AM1. He is right, and it is worse than inconsistent. There is no
  tooltip. There are eight mechanisms doing the job of one,** plus a ninth
  pattern that is not a tooltip and does a tooltip's job. Native `title` in
  renderer strings (32 sites), in `shell/body.html` (4), emitted unconditionally
  by `cr()` (36 call sites), emitted conditionally by `crBadge()`, emitted by
  `addrRow()`, assigned as a property (10 sites), the `#railtip` panel, the
  `#probe` panel, and three caption slots a hover writes into. `aria-describedby`
  is used zero times across all ten surfaces.
- [x] **AM1b. And the count of hover only definitions was wrong by a factor of
  twenty four.** This list said eight. Measured live at 1600 with a loaded
  profile, walking every surface: 259 distinct visible title strings, **195 of
  them definitions that exist nowhere else on the screen**, 27 of those on
  elements that are not focusable, so no tap design reaches them without an
  attribute change. Eight carriers have a reachable route today.
- [x] **AM1c. Four defects in the tooltips that do exist.** The two panels
  disagree by 12 pixels of measure and one is absolute while the other is fixed.
  `#railtip` renders an empty bold and a horizontal rule on half its carriers,
  because `ui.js:509` looks for `.tn` and the depth buttons use `.n`. **`#probe`
  sits on the hero graphic**, measured 227 by 229 inside the canvas, which is
  DESIGN.md law 8 broken by the tooltip itself. And `.probe .tt-q` measures 3.66
  to 1, which gate 4 cannot see because gate 4 measures type size.
- [x] **AM2b LANDED, and AM3 with it.** `ui/tip.js` is in the build at MANIFEST
  line 35, the block is in the sheet, and every one of the 195 hover only
  definitions is now reachable by tap, because the module falls back to the
  native title. No renderer was touched to get that.
- [x] **AM1d. And `#railtip` is retired,** because once TIP landed it was the
  second tooltip on the same element: both read `data-tip` off the same
  carriers, and two panels on one control is worse than the inconsistency it
  was part of. Its two defects go with it, the empty bold and rule on half its
  carriers and the 288 against 300 measure. Its name and action line are
  attributes now, so nothing has to find them in the markup. The half that was
  never a tooltip stays: pressing one of those rows still opens the knowledge
  page on its entry.
- [x] **AM1e. `tests/design.js` gate 16 watches the one tooltip law.** Not a
  count, because the count changes as the migration runs. It asserts the
  retired panel is gone from the document and from the sheet, that every
  carrier opens the tooltip, that never more than one panel is open at once,
  and that none of them opens empty, which is the defect a presence check would
  have passed.
- [ ] **AM2c. Steps three to six of the migration remain:** retire `#probe`,
  which is the one that sits on the hero graphic, retire the three caption
  slots, enrich file by file from `title` to `data-tip`, and give the 27 static
  carriers a tabindex.
- [~] **AM2. Designed, measured, ready.** `DESIGN-tooltip.md` and
  `proto/tip/`, runnable, with eighteen screenshots. Ten mechanisms considered
  and nine named losers. The panel grows out of its carrier along a two pixel
  tether in the carrier's own colour, and the tether plus a thirty pixel entry
  mark make a T where the line arrives, which replaces the caret every other
  tooltip draws without being one. Sheet on a coarse pointer, taking the half of
  the window the carrier is not in. Measured on the live Field: **16.5ms, 60.6
  frames a second with the panel open**, no backdrop filter in any of the seven
  lightings, lowest contrast inside the panel 5.30 to 1, close control exactly
  44 by 44, zero panel over carrier overlaps at both widths.
- [ ] **AM2b. Step one of the migration closes AM3 on its own** and touches three
  files: add `ui/tip.js`, insert it at MANIFEST line 35 after `ui/component.js`,
  paste the block into `head.html`. Every existing title becomes a tap reachable
  product tooltip, because the module falls back to `title`. No renderer is
  touched. Five more steps retire the probe, the railtip and the caption slots,
  then enrich file by file, then give the 27 static carriers a tabindex.
- [?] **AM4.** Should hover open at all on a fine pointer, or is everything a
  tap? Removing an affordance is a bigger ruling than adding one, so hover was
  kept pending his word.
- [?] **AM5.** What is the action line for: the eight rows that already
  navigate, or all 195?
- [ ] **AM2.** And it has to be good. "Design it so that it's sexy. Wow me.
  Think transition, think animation, think how can I make this interesting."
  Creative director, art director, UI UX, ten passes.
- [ ] **AM3.** A phone has no hover, and eight definitions in this product live
  only in a title attribute. The one tooltip has to be reachable by tap.

### AL. STANDING, FROM THIS ROUND ON.

- [ ] **AL1. Ten passes, and ask questions.** Every team kicks a brief around
  ten times before building, and **asks when it is uncertain what something
  means** rather than guessing. His explicit instruction.
- [ ] **AL2. The teams go and look.** Research modern technique on the internet,
  continuously, from now on. Not once.
- [ ] **AL3. Three pillars, fulfilled out of the gate: privacy, security,
  mirror.** These are the launch conditions, not features.
- [ ] **AL4. Shorter replies.** He cannot read the volume, so a reply is the
  finding and the question, not the working.

### WAITING ON HIM, FROM THIS ROUND

- [?] **The Universal Law videos.** He asked whether he ever gave them. He has
  not. Nothing has arrived in this session and there is no video anywhere in
  the repository. Needed before anything is built on them.
- [?] Whether "body mind complex" is the product's own term or a description.
- [?] What the feathers are meant to mean, if his length and vibrancy proposal
  is not the answer.

---

## 0b. RULED 20 SEPTEMBER, THE AESTHETICS AND SYSTEMS PASS

**"This is taking it from a C plus to a B. This is very important, because now
it means we have a product."** His framing, and it governs everything in this
section: the wins from here are the bigger ones, not more features.

### AA. What the product is, which goes in the brief

- [ ] AA1. **The design brief carries the ethic, not just the rules.** His
      words, and they are the closest thing this project has to a statement of
      what it is: "you are a soul, this is the structure of your psyche, this
      is what it looks like, this is how it connects to the physical, these are
      the patterns that run through the physical. We are giving them the full
      inside out." Teams take those ethics and keep them in the background.
- [ ] AA2. **The eye must have ease.** Symbolic tools you can click, understood
      at a glance, professional, collapsible, smooth animation between
      everything. Whoever designed it looked like they went hunting for ways to
      improve it.
- [ ] AA3. **Hierarchy is top down and inside out.** Energetically there is
      always a top and always an inside. The content flows that way or it is
      not saying anything.
- [ ] AA4. **Nothing on screen that does not tell you something about the
      person.** Frivolous information is removed, not shrunk.
- [ ] AA5. **Scrub the whole document set.** Everything tweaked and changed
      this session goes into the design brief and the product brief, and every
      seat's own material is brought current.
- [ ] AA6. **Wow, on top of the Zen.** "Holy fucking shit, that's me. That's
      all of me." Aesthetic beauty is the focus of this pass.

### AB. Colour and symbol, which is where he started

- [ ] AB1. **THE TEN TIERS GET SYMBOLIC COLOURS.** "I do not like that it says
      I am 88 per cent embodied on the right hand side and yet my button is not
      symbolic. The colour is not symbolic." Mastery through Collapsed, ten
      colours that mean their tier, locked into the design.
- [ ] AB2. **A GOOD READING MUST NEVER PRINT RED.** "96 per cent flow accuracy
      and yet it is red. Red is a colour of danger. That is bad colouring."
      Every reading where high is the good end says so. Partly fixed on the key
      strip already and clearly not everywhere.
- [ ] AB3. **The whole colour tree against its iconography.** One pass, every
      family, does the colour agree with what the icon means.
- [ ] AB4. **Dull colours up about ten per cent in saturation, dark version
      only.** Some are vibrant and some are dull and they read as two systems.

### AC. Frequency, a new product surface

- [ ] AC1. **Find your frequency.** Pairs a person with others on a like
      frequency. A networking and social tool. New, and it is the first thing
      in this product that involves another person.
- [ ] AC2. **Cohorts inside it**, to keep people practising. His case: somebody
      parked at 92 who feels great and has no reason to move.
      *Both are large, both need the record store, and both touch the privacy
      floor hard. A cohort lead never sees the story cloud, ruled.*

### AD. Layers, which is the mirror he is describing

- [ ] AD1. **See yourself in layers, turned on and off.** Click any chunk of
      the reading and open it.
- [ ] AD2. **Heat maps, one per structure.** Saboteurs, complexes, hyper
      complexes, masks. Each its own map.
- [ ] AD3. **A pain map you can select.**

### AE. The core mechanic, stated plainly for the first time

- [ ] AE1. **Journal into imprints into release is the core loop, and it is
      what earns points.** The ritual system is dynamic and works with all
      three. Points buy patterns for somebody who will not pay. Paying gets
      discounts, and later new tools, techniques and rendering scripts for the
      avatar.

### AF. The work the teams do to reach a B

- [ ] AF1. **Every seat researches its own field for modern technique** and
      brings it back into its data set.
- [ ] AF2. **A guru seat joins the team, called CQ**, carrying chakras, energy,
      somatics and mindset transformation.
- [ ] AF3. **An information architect who understands human behaviour**, to
      debate structure and flow against the ICPs.
- [ ] AF4. **Simulate the flow with the ICPs a thousand times.** Onboarding
      through ninety days. Find the friction points. Does it feel sticky. Do
      they understand what they are doing. Who stays five minutes and who stays
      a year.
- [ ] AF5. **Check the architecture against the user flow.**
- [ ] AF6. **Do we need a graphics specialist**, HTML5 or WebGL, to take the
      rendering to another layer. And a traditional designer for a crisper
      sense of taste. His question, and it is a hiring question rather than a
      task.
- [ ] AF7. **A QA smoke test, and does the maths add up.** Where is it
      breaking.
- [ ] AF8. **Tooltips must work, and the language must mean something.** No
      "sixty eight of fifty three". Attuned language, written the way the copy
      seat already knows how to write to people.

### AG. Ruled and narrow

- [ ] AG1. **A new interface design may be ADDED, never substituted.** If a
      seat wants one it becomes a seventh or eighth lighting as a beta. The
      existing ones do not change.
- [ ] AG2. Change his persona line from "54, author". *He named
      "ornithological systems engineer" in the same breath as a rimshot, so the
      line itself is a question rather than a ruling.*

---

## 0. THE NEXT BLOCK

The four the project manager has promoted. Ordered by what unblocks the most.

- [x] **N1. Ritual gets a door.** DONE, and it was already done. TAB.RITUAL is
      integer 10, it sits second in `TABDEF` in his order (intake, ritual,
      story), `#rit` is its host and `panels.js` opens it on the tab.
      Measured: 4,790 characters of markup, opening on "Build A Ritual".
      I had it in the open column and it was built. Checked before building.
- [ ] **N2. The avatar becomes a page.** new surface. Set up the avatar, build
      the game plan, set the goals, information on the right, Summary a button
      underneath. It is also the release designer: what the avatar is set to
      becomes the ritual's priority order. *Large.*
- [ ] **N3. The Summary is boring.** `ui/summary.js` Ten passes, innovation and
      animation and art. Every named thing described as a behaviour, not a
      label. The centre column becomes text about you and everything energetic
      moves right. *Large.*
- [x] **N0. The awareness mark, drawn.** Built, `tools/soulloop.js` generates
      it and `reviews/soul-loop.html` presents it. Sent 20 September.
- [x] **N0b. Awareness, redrawn against the golden ratio and Zen.** The art
      director's research is at `reviews/AD-golden-zen.md`, 1,299 lines with
      sources. Five defects verified against the running generator and fixed.
      Its prescribed CONSTANTS were rejected after rendering them: exact on
      every ratio, and what they drew was a fat letter P. The defect list was
      right and the prescription was not, which is the reason the rule is look
      at the render every time.
- [x] **N0c. Rename soul to awareness everywhere.** `tools/awareness.js`,
      `tools/awarenesspage.js`, `reviews/awareness.html`.
- [ ] **N5. The five beats and the fade are in. The funnel is next.** `AO0`
      Zero pages exist and he thought it was built.
- [ ] **N4. The copy editor pass on every number.** standing, `AR1`
      A number that does not say what it is out of does not print. This is his
      instruction to me, not a task he has to keep catching.

---

## 1. BUILT AND GATED

The diagnostic and the energetics

- [x] A1. Energetics: three framings side by side `ui/intakeui.js`
- [x] A2. Two law cards, chakra frames, as drawn `ui/intakeui.js`
- [x] A3. Laws grouped by seat, crown to root `ui/intakeui.js`
- [x] A4. How to answer: a ten is a hundred out of a hundred `ui/intakeui.js`
- [x] A5. Identity rolls up on save, edit reopens it `ui/intakeui.js`, `engine/schema.js`

The account area

- [x] A7. A standard account area, six sections `ui/account.js`
- [x] A8. Security, privacy, account, billing and tier `ui/account.js`
- [x] A9. Customer feedback and support in help `ui/account.js`
- [x] A10. The alpha questionnaire, his eleven questions `ui/account.js`
- [x] A11. Rate the product `ui/account.js`

The compass and the Field

- [x] A12. The compass opens flat `ui/cone.js`
- [x] A13. Flat, Regulation, Layers to the upper left `ui/cone.js`
- [x] A14. The lower left block comes out `ui/cone.js`
- [x] A15. Spans become a graph, lower right, opens Summary `ui/cone.js`, `engine/ladder.js`
- [x] A23. The app opens on the Field `engine/core.js`
- [x] AE1. The Field top row is two strips, one line each `ui/ui.js`, `shell/head.html`

Look and language

- [x] A6. Undo and redo are just the arrows `shell/body.html`, `ui/panels.js`
- [x] A16. Archetypes wear their chakra colours `engine/data/canon.js`, `ui/summary.js`
- [x] A17. Benign or malignant becomes one word, Orientation `shell/body.html`
- [x] A18. SOURCE OS all caps, half a point down `shell/head.html`
- [x] A19. Lumen, the seventh lighting `shell/head.html`
- [x] A20. Lumen: paper rails and bar, vibrant, black stage `shell/head.html`
- [x] A21. Lumen: anything selected is a solid fill `shell/head.html`
- [x] A22. Summary bolds carry their family colour `ui/summary.js`
- [x] A24. The halo is gold `shell/head.html`
- [x] AT2a. The mark drawn from the stack `reviews/AD-mark-stack.md`

## 1b. DEFECTS FIXED, THAT HE DID NOT HAVE TO ASK FOR

- [x] B1. A release on a reference case wrote a stranger's field into his
      record. 50.6 of borrowed charge. Two fixes were worse than the bug: the
      second wiped every field to 42.3 and billed for it. It refuses now.
- [x] B2. The fetters caption said "nothing carrying yet" on every profile.
      Ana: 41 carrying, 41 drawn.
- [x] B3. Every number in the product had no font. `--num` named a face that is
      not in the build.
- [x] B4. Two knowledge base titles were abbreviations.
- [x] B5. The skip press also pressed the app underneath.
- [x] B6. Two scale labels were false. DQ "0 to 10" read 54.7.
- [x] B7. The canvas never went vibrant in Lumen. `bc()` did not know it.
- [x] B8. Gate 13 never tested the seventh lighting.
- [x] B9. Gate 9 counted six lightings by hand and the product grew.
- [x] B10. Settings was in no screenshot harness.
- [x] B11. `--bad` was too thin to see past about fifty five.
- [x] B12. A profile from an older build killed the centre render.
- [x] B13. The boundary refused a null avatar and dropped the whole profile.
- [x] B14. `unread` claimed nothing had been entered while 107 addresses were
      carrying under the display line, and the release billed eight patterns a
      press against them. `engine/compute.js`
- [x] B15. The old destructive release animation was still loaded in the frame
      loop, unreachable but one assignment from zeroing every charge again.
      `ui/personas.js`, `ui/ui.js`
- [x] B16. The release's empty state told a person who had answered the intake
      to write a story, with no word about what the intake did measure.

---

## 2. OPEN, IN THE ORDER IT WAS GIVEN

### 2a. Asked more than once, and still not built

- [ ] R1. **Knowledge base restructure.** Nature, human nature, integrity. A
      paragraph each, headers on one line with icons, narrative framing.
      *Asked 3 times.*
- [ ] R2. **Editorial sweep to plain language.** Nothing that reads as jargon.
      *Asked 3 times.*
- [ ] R3. **Energetics aesthetic.** It is boring, and he wants a subtle glass
      touch. *Asked twice.*
- [x] R4. **Summary right rail.** Eastern and Western are on it. He asked
      twice, and both lenses were already written: `lensWestern`,
      `lensEastern`, `lensDesign` and `lensGene` sat at the top of
      `ui/summary.js` as pure functions and NOTHING IN THE BUILD HAD EVER
      CALLED ONE. Third time this round the thing he asked for was written and
      not rendered, after the archetype behaviours and the mask behaviours.
      Master numbers and the full stack were already on the rail.
- [ ] R5. **Heat map anatomically precise to the chakras.** *Asked twice.*
- [ ] R6. **Every piece of art gathered for his ruling.** Standing obligation.
      Sent twice, never complete.

### 2b. The Field

- [x] F1. The six gates are legible and each carries its pill. They were drawn
      at half alpha with no pill at all on any profile with no story run,
      which is most profiles most of the time. The pill holds a dash when
      nothing has been read, which is the pattern this product already uses:
      the figure is never invented and the absence is said rather than hidden.
- [x] F2. The seven seat bands say what they are and open. Every individual
      node in the ring was already pressable and the seat the whole coloured
      arc belongs to was not. A legend under the wheel says what the ring is.
- [ ] F3. Subtle motion outside the ring
- [x] F4. The atomization is named rather than moved. It is reachable and has
      been since the threshold came down from 5.20 to 2.60, and nothing
      anywhere said it existed. The legend names whatever is still under the
      current depth and how to reach it, and it offers the atom layer only to
      somebody whose record can fill it, because offering to show what put a
      pattern somewhere to a person who has written no story is an empty room
      with a sign on it.
- [x] F5. Coherence is printed twice, in the strip and in the rail. The core's
      number and the tier word came off the wheel, which also closes the
      standing rule: the wheel is this surface's hero graphic and the reading
      was set in the middle of it at half the core's diameter. The core stays
      and is still sized and lit by coherence, which is the drawing doing the
      work rather than a caption doing it.

### 2c. The compass. Nothing from the eleventh note is built.

- [x] AQ1. The shape is an arrow up and an arrow down. Shaft, barb, point,
      three sections each way, straight sided. The spindle is gone.
- [x] AQ2. Coherent at the top, decoherent at the bottom. Source and The
      blueprint are out.
- [x] AQ3. Halo at the top, pitchfork at the bottom. The third glyph, ego
      compression, came off a two ended axis.
- [x] AQ4. The marker oscillates in the person's own range, read from their
      own history through `seriesRead`. No history holds still, one reading
      holds still, two or more swings the width of the range. Where most
      people oscillate is drawn as ticks at 40 and 60.
- [x] AQ5. Every teacher takes their seat colour.
- [x] AQ6. Eckhart comes out. Lao Tzu carries Revelation, SUBJECT TO HIS
      CONFIRMATION, and the master list is eleven until he names the twelfth.
      `BOOK-ERRATA.md` carries it.
- [x] AQ7. Every figure gets an icon. The sixteen mirror poles carry theirs
      into the new rail. The eleven masters, the four blueprint archetypes and
      the nine circle governors have them now, reusing the mirror icon wherever
      a name is on both lists rather than drawing one person twice. Ten new
      drawings: the Aten, flow, alignment, the level, the inverted crown, the
      flame with a mouth, the scales, three heads, the purse, the horns and the
      snowflake. CASCADE is deliberately left: nothing renders it, and an icon
      nobody draws is the dead weight the release animation already taught us
      about.
- [x] AQ8. The opposites take the desaturated twin of the same hue, not a
      separate red. Saturation out, lightness left alone, so they stay
      legible at the floor.
- [x] AQ9. The names sit left and right in their own rail, four axes a side,
      in seat colours with icons. The row facing the viewer lights. Hovering
      aims the figure at it and it eases, never snaps.
- [x] AQ10. The band becomes a room. The ring at 40 is its floor, the ring at
      60 its ceiling, twenty four uprights between them, the far wall dimmer
      than the near one. It was a radial wash, which solved the panel it used
      to be and left a smudge.
- [~] AQ11. Every number on the compass and on the Summary carries its scale
      on the screen now, not in a title attribute a phone cannot reach. The
      rest of pass 10 is the wider surface.
- [x] AQ12. **NO TEXT OVER THE HERO GRAPHIC.** Off the drawing: the coherence
      number, the sixteen names, the eight quality labels and the band
      caption. What is left is the figure.
- [x] AQ14. The bottom information goes right unless it is about the tool.
      One line under the figure, and it is about the tool.
- [x] AQ15. Flat becomes all solid. Every control takes a panel ground and
      loses its border. Focus stays an outline, because it is not decoration.
- [x] AQ16. "Powered by SOURCE OS" on the intro card. Two spans, so the name
      uppercases and the sentence does not.
- [x] AQ13. The plane is out. He tried it and ruled against it.

### 2d. The Summary

- [~] AH1. It is boring and not alive. Partly answered by AH2, AH3, AH5 and
      AH6 together, and by a new passage in the centre: the nine written as
      sentences in the body rather than tabled, carrying the plexus and the
      part of the body each one sits in, which the engine has always known and
      no surface has ever printed. Gordon reads "the heaviest of the nine is
      Fear, at 10.0 of 10. It sits at the Lumbar plexus, which you feel in the
      lower back, gut." STILL OPEN: the ten passes with innovation, animation
      and art direction. That is a design exploration and it is his to grade,
      not mine to improvise.
- [x] AH2. Every named thing described as a behaviour, not a label. The
      archetypes already carried one and it had never been rendered: the
      Warrior moves on the threat, and the page printed "primary". The six
      masks were given one, and a seat says what a shut one does.
- [x] AH3. The centre is the story and the actions it calls for. The glance
      row of six rings moved right with everything else measured.
- [ ] AH4. Source AI retunes it daily, the old reading kept in history
- [x] AH5. The "off the floor" line is out. Every other tier names the next
      band and what to do to reach it; that one named where the person was
      lying and told them not to be ambitious. The instruction under it was
      already right and is kept word for word.
- [x] AH6. Integrity over time, full width, day to five years, on its own
      span control. Drawn nought to ten always, never to the range that
      happens to be there, because a chart fitted to the data makes a quiet
      month look like a cliff. Snapshots with no integrity recorded are
      left out rather than drawn as zero.

### 2e. The diagnostic

- [x] AI1. Zero to ten on one line.
- [x] AI2. The numbers are even. Both were one fault: eleven buttons in six
      columns is two rows, and eleven into six leaves one over, so the ten was
      given a double width cell to fill the gap. A scale whose last step is
      twice the width of every other step is a scale with an argument about ten
      in it. Eleven columns, one row, every cell 36.7 wide.
- [ ] AI3. He does not like the design. Run it again.

### 2f. Not built at all

- [ ] AO0. **The funnel.** Zero pages exist. He thought it was built.
- [ ] AS2. **The developer end.** No server, no auth, no record store. The
      single biggest unwritten thing in the project.
- [ ] AS1. Login and password, and what they unlock
- [ ] AO3. **The avatar as a page**, and as the release designer (`AN13`).
      `runAvatarDrill` in `ui/drills.js` exists and is reached from a component
      click and one sheet control. It is a drill, not a surface.
- [ ] AN7. The somatic opener and the signal test. PARTLY: The Signal Test is
      a row in `engine/data/practice.js` with a name and three minutes against
      it, and nothing runs. The opener does not exist at all.
- [ ] AN4. Points, badges, achievements, the store
- [ ] AN3. The tutorial and onboarding, which is the core loop
- [x] U1. **Undo on applying a story.** Built, and this line was stale for
  longer than it was true. `engine/undo.js` is unlimited, `UNDO_MAX=0`, with a
  redo stack, and `ui/storyui.js:82` pushes a snapshot labelled "committing
  the story" before the charge lands. A6 in section 1 already had it as done,
  so the same item sat in two columns.
- [ ] C1. The ritual spec, 1,496 lines, unwired
- [ ] C2. The phone spec, 1,132 lines, unwired
- [ ] C3. **The release rebuild.** His flagship. Nine rulings attached.
- [ ] I1. Imprints as its own tab, with the thermometer counters
- [ ] C4. The fetters surface rebuild. Nine marks, not ninety seven.
- [ ] AN12. Migration of what is left in the old Atuned app
- [ ] AS4. The enterprise and app store checklist
- [ ] AN14. Beat the top two ritual and accountability trackers
- [ ] AO6. Value based questions for the ICPs

### 2g. The closing review, before anything is called complete

- [ ] AP1. The architecture, schemas, frameworks and the CQ score, run six times
- [ ] AP2. Simulated against the personas
- [x] AP3. A thirty and ninety day simulation of onboarding
      `reviews/SIM-ninety-days.md`
- [ ] AP4. The focus group at scale
- [ ] AP5. Then the release

---

## 3. WAITING ON A RULING FROM HIM

- [?] D1. The twelve onboarding questions, sent as HTML
- [?] D3. Video hosting: 15.4 MB against a one file build with no network
- [?] D4. Films 7 and 8 are numbered opposite to the engine
- [?] D5. Three laws carry two names, and Balance collides with the wheel strip
- [x] D6. **RULED. What Source AI reads, and what it is for.**
      His words, 20 September, and they answer a systems question rather than
      a permissions one. It reads:
      the spiritual overlap behaviour, because agreement across five systems
      read independently off one birth date is what shows consistency;
      the psychology structure;
      the knowledge base;
      and it measures all of that against CQ, spiritual integrity, intention,
      expression, and the way a person communicates in their story.
      Out of that it takes a snapshot of behavioural energies and motion, at
      whatever structure the question lands on: saboteur, complex, hyper
      complex, archetype, it does not matter, because it is one connected
      system. Not driving each other. A FLOW, FROM INTENTION TO OUTPUT.
      `reviews/SPEC-source-ai.md`
      *Still his, separately: whether any of it may leave the device. This
      ruling says what the model reads, not where the model runs.*
- [?] D7. The mark: direction A or B
- [?] D8. The boot: three seconds or five
- [?] D9. Nine release rulings, including what a mask is
- [?] D10. The therapy equivalence claim, before the funnel ships
- [?] D11. The opening surface. Summary, then Field, then Avatar.
- [?] D12. Two factor auth, yes or no
- [x] D19. **Jesus carries the Crown. Ruled.** "That would be Jesus at the
      very top. That's love. Love transmutes all. That's the highest charge."
      He stands at two poles now, the Heart and the Crown, which is his canon
      and is pinned by a gate so a later edit cannot tidy it away. Christ and
      Jesus were one figure under two names across two lists and are one name.
      The master list stays eleven, because unifying two names for one person
      does not add a person.
- [?] D20. Whether the Crown axis is still called Revelation now that love
      rather than direct knowing stands at the top of it.
- [x] D18. **THE MARK IS CALLED AWARENESS, LOWERCASE.** Ruled 20 September.
      He said "just call it sol, lowercase" and corrected himself in the same
      breath: "actually, it's called awareness." Awareness stands, sol is
      superseded and is recorded only so nobody reinstates it. Everything that
      says soul renames: `tools/soulloop.js`, `reviews/soul-loop.html`, the
      layer in the stack, and the copy on every surface that names it.
      *Small, and it is a find and replace with a gate behind it.*
- [x] D13. **The soul shape is RULED. It is a loop.** Sent 20 September with a
      drawing: one stroke that crosses itself into a small closed eye and runs
      on. No bars either side; those belong to the character around it. Golden
      ratio in the proportion, very tiny, pure gold, and cute. Not a squiggly
      Q. `reviews/AD-soul-loop.md`, and it is the crown of the mark stack.
      Tasks it unblocks: `AT2` the mark, `AT3`, and the stack's top layer.
- [?] D14. Does the intake reach the release? It measures how you act; charge
      comes from a story. There is no path between them and that may be right.
      His call, and the copy now says which is which.
- [?] D15. Paywall enforcement
- [?] D17. **The two API keys, and where they may live.** Offered 20 September:
      the ElevenLabs voice and the Claude key. Neither can go in `source.html`,
      because the file is one file with no backend and a key in it is a key
      every person who opens it can read and spend. They belong in the server's
      environment, and the server is `AS2`, which does not exist. Nothing to
      hold them safely yet, so they are not to be pasted anywhere until it does.
      The Claude key is also gated on `D6`, what Source AI may read.

## 3b. ANSWERED, SO IT IS NOT A RULING ANY MORE

**Spiritual APIs: we need none, and that is a property worth keeping.**
Asked 20 September. Everything of that kind is computed in the engine, host
free, with no network: `julianDay`, `sunLon`, `moonLon` and `designJD` in
`engine/astro.js`, `chineseYear` in `engine/birth.js`, the gate wheel, the
numerology. A free ephemeris service would replace arithmetic the product
already does with a network call that carries a person's birth date, time and
place off the device. That is the most identifying record in the profile and
the privacy floor refuses it. No key is needed and none should be added.
- [?] D16. Whether the top rung is one bit (CQ restated) or two (Shape and
      Control)

---

## 4. DEFECTS OPEN

- [~] E1. `.ib` in Lumen. FOUND, BY READING RATHER THAN PROBING, and it is not
      a bug in the rule that draws it. `body.lumen .stage` redefines `--sunk`
      to `#0A0A0A` for its whole subtree, which is correct: he ruled the centre
      display area stays black. `.ib{background:var(--sunk)}` therefore comes
      out near black for every icon button INSIDE the stage and paper for every
      one outside it. Three probes could not find why because they were
      measuring a control in the stage, where dark is the ruling.
      WHAT IS ACTUALLY OPEN: whether a control belongs on the black stage at
      all in Lumen, which is his call and not a defect.
      `atuned_src/shell/head.html:352`
- [ ] E2. A second field leak upstream of the release, in the full page sequence
- [x] E3. The compass nameplates collided, 89 pairs at 1600, with no gate
      watching. Fixed by the cause rather than by a gate: the names are markup
      in a rail now, so they have line breaking, the collide gate can see
      them, a screen reader can read them and a button can carry a control.
      All four were impossible while they lived in a canvas.
- [ ] E4. `DQ` draws an identical full ring for every profile past ten
- [~] E5. Eight definitions lived only in `title` attributes, unreachable on
      a phone. The Summary's six are on the screen. The rest are still to do.
- [ ] E6. The word Awareness carries two concepts 545px apart on one screen
- [ ] E7. Visiting a reference case writes that persona into the person's store

---

## 5. SPECCED, NOT BUILT

- [~] C1. Ritual and the accountability tracker `reviews/SPEC-ritual-accountability.md`
- [~] C2. The phone build `reviews/SPEC-phone.md`
- [~] C3. The release, seven passes and nine rulings `reviews/REVIEW-release.md`
- [~] C4. The fetters surface rebuild `reviews/FIX-fetters.md`
- [~] C5. The Field and the compass, ten passes `reviews/AD-field-compass.md`
- [~] C6. The Summary rewrite and context clauses `reviews/COPY-summary-context.md`
- [~] C7. The mark and the boot `reviews/AD-mark-and-boot.md`, `reviews/AD-mark-stack.md`
- [~] C8. The legal floor `reviews/LEGAL-floor.md`
- [~] C9. The knowledge base films `reviews/IA-kb-video.md`
- [~] C10. The account area's visual system `reviews/AD-account-help.md`
- [~] C11. The feedback instrument `reviews/SPEC-feedback-instrument.md`
- [~] C12. Enterprise and the stores `reviews/SPEC-enterprise-and-stores.md`

---

## 6. STANDING RULES, NOT TASKS

- **AR1. Context is key.** Every number says what it is out of, or it does not
  print. His instruction to me: "this is your job to make sure it is no longer
  happening."
- **AQ12. No text over the hero graphic, ever.**
- **AN6. Onboarding is humble and warm. We do not do mechanical.**
- **AO5. Every piece of art he has not ruled on is gathered and sent.**
- **Every build goes as a download named `atuned.html`, with the commit and the
  md5 stated.** Never a preview. He cannot open markdown.
- **The engine stays host free. `source.html` stays one file.**
- No em dashes. Never 108, the count is 112. Sentence case body, title case
  headers. One word per concept. Port, do not rebuild.

---
---

# THE RECORD

What he said, note by note, in the order he said it. The ledger above is what
gets worked; this is where the wording is kept.

# Backlog

One list. It merges the measured technical items from `STABILITY.md` with the
review session in `FEEDBACK-alexander.md`, so there is nothing to reconcile
between two competing documents. Nothing here is started. Sizes are honest
estimates against this codebase, not encouragement.

Every task names where it lives, because "improve the analytics" is not a task.

---

## A. Buildable now. One file, no architecture change.

**A1. Full intake before the first reading.** `ui/intakeui.js`, `engine/intake.js`
The intake is 63 questions and the app renders a full reading with zero of them
answered. Gate the first reading behind completing it, state the time cost up
front, and show the interval as the reason. Measured: 0 answered reads 20.8
percent plus or minus 19.3, all 21 laws reads 48.8 plus or minus 12.1, so an
unanswered profile can legitimately move 39 points later. This is the item with
evidence and the one Alexander argued hardest for.
*Medium. Needs a ruling on whether it is a hard gate or a strong default.*

**A2. Layer isolation on the Field wheel.** `ui/wheel.js`
The four depths are strictly cumulative: `L>=1`, `L>=2`, `L===3`. There is no
way to see the saboteurs alone. The Energy tab already solves this with
`PMLAYER` and a row of buttons, so the pattern exists and can be ported rather
than invented. This is Alexander's "it is a lot of stuff" and the 57 to 71
simultaneous choices finding, arriving from two directions.
*Medium. The clearest win for cognitive load.*

**A3. Percentage per category.** `ui/analytics.js`, `ui/ui.js`
Analytics shows weighted amounts. Show the share instead, or alongside: what
percentage of this person each archetype is, each of the four root domains,
each mask. `r.aff` is already a normalised 12 vector and the right rail already
prints first, second and third with percentages, so the data is there.
Archetypes first, per Alexander.
*Small.*

**A4. Schema validation at the boundary.** `engine/schema.js`
`loadProfile` throws on all four malformed profiles tested and accepts a charge
of 9999. `pImport` checks only that a version field exists. Reachable by a
person through the import control. The UI clamps, the boundary does not.
*Small. The only reachable crash in the product.*

**A5. Undo on applying a story.** `ui/storyui.js`, `engine/read.js`
Applying a story bakes charge into the axes with no way back. Snapshot before
apply, offer a revert window.
*Medium. Largest product gap, unrelated to this review.*

**A6. Continuous integration.** new `.github/workflows/`
522 assertions across four gates and nothing runs them automatically.
*Small. Cheapest item here and it protects everything else.*

**A7. A tutorial that completes one loop.** new `ui/tutorial.js`
Not a tour of the interface. Find a pattern, release it, watch it change.
Alexander was specific that the walkthrough has to reach the release.
*Large. Needs the copy written before the code.*

**A8. A somatic opener.** new, small
Turn the senses inward, feel yes and no, before anything else. Establishes what
the instrument is reading.
*Small. Copy first again.*

**A9. Analytics drill depth.** `ui/analytics.js`
Correction to my own note: the bubbles ARE already clickable. `[data-ab]` sets
`ANA_PICK` and calls `anaDrill()`. So the task is not "make it clickable", it
is either that the affordance is invisible or that the drill stops one level
too shallow. Needs him to look once and say which.
*Unknown until that question is answered.*

**A10. Google Fonts.** `shell/head.html`
Two outbound requests per load, sending an IP to Google before anything is
typed, in an app holding somatic self report. Self host or fall back to a
system stack.
*Small. His call, it costs bytes.*

**A11. Saboteur presentation.** `ui/wheel.js`, `ui/drills.js`
"Covering up too much, feels blocked in, not designed." Still needs one answer
from him: is it the panel, or the labels crowding the centre of the wheel.
*Blocked on that answer.*

**A12. The missing somatic practices.** `engine/data/practice.js`
Content, not code.
*Unsized. Depends how many are missing.*

---

## B. The funnel, and the small service behind it.

Part B described this properly, and one instinct in it changes the size of the
work: keep the quiz store separate from the app rather than making the app
talk to a backend. That is the right call and it is worth saying why.

**The funnel as described**

1. The ad does not say download the app. It says take the test, learn your CQ.
2. The quiz runs on the web. All the questions.
3. At the end the person enters an email. The answers are keyed to it.
4. To see the score they download at least the free app.
5. They sign up with the same email, and the answers come down with them.

**What actually has to exist**

Measured against the real schema, not estimated:

    questions in the quiz        63
    answers payload             432 bytes
    laws payload                304 bytes
    one quiz record, keyed      1.1 KB      512 bytes gzipped
    100,000 people              about 49 MB total

That is the entire service. A key value store holding half a kilobyte per
person, a write when the quiz completes, and a read when the app asks. It is
not a backend for the app. The app stays a single file and gains exactly one
capability: fetch a record by email, once, at sign in. Every other item in the
old version of this section assumed far more than that.

**B1. The web quiz.** A separate build from the same `atuned_src/`. It runs the
63 questions and nothing else, so it shares the intake and the schema and
carries none of the renderers.
*Medium. Mostly reuse.*

**B2. The record store.** Email keyed, versioned with the same `SCHEMA_V`, one
write and one read. Separate from anything else by design, per part B, so it
can be moved or replaced without touching the app.
*Small, and smaller than it sounds at 0.5 KB a record.*

**B3. Claim on first run.** The app asks for an email at sign in and pulls the
record down once. After that the profile is local again, which keeps the
privacy posture everywhere except the handoff.
*Small.*

**B4. Desktop and app talking.** Same mechanism as B3. No new surface.

**Two things the design as described does not yet handle**

*The email is the only key.* As stated, anything that knows an address can
retrieve that person's somatic and psychological profile. That is not a
hypothetical, it is what "ping the email address and get the answers" means. A
one time code sent to the address, or a signed claim link, closes it and costs
very little. Given what this data is, it is not optional.

*Data leaving the device changes the legal position.* While everything stayed
in the browser there was no controller and no processor. A stored quiz record
keyed to an email is personal data held by someone, so access, deletion and
breach obligations attach. Worth one hour with someone who knows the ground
before the first record is written, not after.

**Still a fork, but a much narrower one**

The old version of this section listed pings, streaks, a community feed and
manager reporting as one decision with the funnel. They are not. The funnel
needs 0.5 KB a person and one read. Engagement mechanics need identity,
sessions, social graph and a notification channel. Taking the funnel does not
commit to any of the rest.

**Deferred, and genuinely separate**

- Notification pings and a chosen practice time
- Streaks
- Community feed, curated or open
- Seeing other people's progress
- Manager reporting and an admin portal
- Paid desktop tier against a free pattern only tier

## C. Already open, his call, unchanged by this review.

- Schema v2, the gates bump, cross compatibility contract with SOURCE
- `Root_08_Unnamed`, compressed CQ mid range, domain weighting, depth button
  names, the Matrix wiring
- Whether the kink sits at the highest charge or the lowest
- Compositing: Field measures about 100ms per frame from layer blending, not
  from our drawing. Needs one measurement on real hardware before anyone
  optimises it.

---

## D. Deferred on purpose.

- **D1. Purify the impure core.** A signature rewrite. The path work showed the
  interface has not settled, so doing it now would be invalidated.
- **D2. Headless coverage for the ui layer.** 15 modules, 5 reachable from the
  headless gate.

---

## If it were mine to order

A4 and A6 first: both small, both protect everything else, neither touches
design. Then A2, because layer isolation is the complaint that arrived from a
person and from a measurement at the same time. A3 is small enough to ride
along with A2.

Then A1, and it is worth seeing that A1 and B1 are the same work. The funnel's
quiz IS the full intake. Building the gate inside the app and building the web
quiz are one job done twice if they are scheduled apart, and one job done once
if they are scheduled together. That is the strongest argument for doing the
intake next rather than later.

A11 and A9 are blocked on one question each. Answering both costs a minute of
looking and would unblock real work.

## B0. The quiz has to have stakes. Noted 18 September.

Ahead of the mechanics, the ruling on what the quiz is:

**It has to talk directly to the pain.** Not a personality test, not a
curiosity. A person arrives carrying something. The quiz has to name it back
to them in a way that lands before it asks for anything.

**A magical solution without the magic.** That phrase is the brief. The result
should feel like it should not be possible to know that from a few questions,
and every line of it has to be mechanically defensible. The instrument already
is: it reads charge, it names the address, it costs it out. The copy has to
carry that without reaching for wonder, because the mechanism is the wonder.

**Open, the delivery format.** A video that sets it all up, or give it to them
raw and let them work it out. These are different products. The video
de-risks comprehension and adds production and a place to host it. Raw is
faster to ship, respects the person, and loses everyone who needs the frame.
Untested either way, so the focus group decides it rather than either of us.

**Open, the funnel shape.** Which funnel actually gets these people in is a
question for the ICPs, not an assumption. Ask them: what would get them to the
test, what they need to hear to take it, what they expect to get out of it,
and what makes them think this is too good to be true. Then shape the
narrative from the mechanics of being, sharp and short.

---

# The owner's queue, this session

Recorded verbatim in substance as it was given, so nothing is lost between
passes. Items are struck as they land. What is DONE below was done this
session and is in the history with its own commit; what is OPEN is not
started and is not being claimed.

## Done this session

- Body page: heat map, chain arcs, the clip defect that hid every address
- CQ copy rewritten to the owner's own language for coherence
- Lean removed; benign or malignant named; balance returned to the rail
- Balance strip rebuilt to the ruling: symbols, one line with a centre break,
  fill from the centre out, percent as a pill
- Console split: vitality, awareness, will and flow as their own readings
- Compass: halo on Source, ego compression and pitchfork on the blueprint,
  the 40 to 60 band with souls in it, your own marker oscillating, and the
  paragraph replaced with the reading and the integrity loop
- The atom: zoom past the fetters to the story weights, selectable and named
- Rail rows are doors with tooltips and a jump into the codex
- Source OS under the wordmark; the app opens on Field
- Back and forward, not just undo
- Top nav reads as tabs; the bar holds one line
- The boot: three seconds, twelve principles, and it removes itself
- Codex as a deck of cards rather than a wiki list
- Record replaces Speak, reports its failures, green and red dot
- Fetters highlighted in the person's own sentence in their seat colour
- Settings in the centre panel, integer 9, no tab
- Rail sections: pressing a header puts that section at the top

## Open, in the order it was given

**Story imprints, a fifth menu.** Ultra modern, flat, ten out of ten on
innovation, drawing on current UI direction. The dropdown has to sing.

**The compass, D to C plus.** Oscillation range over time in the lower left,
30 day, quarter, annual, to show whether a person is improving. The six axis
arrows: three that up regulate and three that down regulate, which is the
nervous system and the spine composited onto the figure as toggleable
overlays. A symbol for every character, Jesus through Lucifer. Selecting a
character shows their story and their polar opposite, because the whole point
of the compass is two paths of the same behaviour, and Socrates' framework of
virtue against the compression below. A layers button, with Dante's Inferno
and Paradiso as a suggestion for what compression over time looks like. And a
flat 2D version on a button, alongside the spinning one.

**The numbers, everywhere.** Lethargy, disconnection and the rest print as
bare figures. They become an icon with the percent complete on it, and the
pill to the lower right carrying the actual number. This is the item repeated
most and it is UX work across every surface.

**Tooltips on every number and every button.** Nothing on screen without one.

**The intake needs to say what it is asking.** Fetters as emotional
attachments: is the number how often they appear in the story cloud, or
something a person types in? What does "fear towards trust" mean? Is this the
laws of expression, in which case the sniffer will eventually supply the
value. Intention, integrity and expression probably belong on this screen.
Same question for the matrix: what is a person meant to do with it.

**Screen zones.** Top, bottom, left and right each need a logic, so the
areas around the centre carry at a glance information that is worth having.

**Badges, achievements and score.** Not integrated at all yet.

**Onboarding and the tutorial.** The welcome, the why, the story loop, how
mindset programming works, the geometric nature of behaviour, a walk through
the release protocol and the tools. Warm and inviting: this is for you, to
return yourself to your own state, and everything is exposed so you can see
how it works. The tutorial turns off once seen. Maximum flow and retention
with no burden, while still capturing enough for CQ and the energetics.

**Glass is a C.** Clunky. Crisper, and the fonts are too much in the face.

**Two months free is out.** The offer is not two months free. Any copy
saying so is wrong and comes out.

**Simulations to run.** Onboarding and tutorial against the ICPs and the
focus group. The story journal, Source AI, imprints and release, with release
treated as the special one because it is the true gamification and the audio.
Day one to day thirty, at a sample large enough to stop moving. Sign ups,
tier changes, drop off, acquisition cost. And the closing questions: would
you pay for this, would you pay this price, and how long would you use it.

**Technical questions to answer.** Does the engine need optimising. Does
anything need exposing that is not exposed yet.


---

# Queue, round two

Added as given. Struck as they land.

## Landed since the last queue entry

- Source OS is gold. `--gold` is an alias for the accent and has been since
  the accent was ruled blue, so everything asking for gold got blue. `--au` is
  a real gold token and nothing else uses it unless it asks by name.
- The centre stage ground is #101010, stated, on Field, Body and Compass. They
  were each sitting on the panel colour, which mixes from the heaviest seat
  and therefore drifts with the reading.
- Benign and malignant carry symbols, like balance. One form in two states:
  a closed ring with a rising stroke, and the same ring broken at its lower
  right with the stroke falling out of the gap.
- The Body footer list is back. It was never missing: `#eshelf` had seven
  children and real text and measured zero by zero, because it sits in a rail
  section that is closed by default. A surface now opens the sections it is
  about, once, the first time it is reached.
- The saboteurs were not broken, they were three of thirty four. Eight now
  draw as rings, and the wash underneath carries all of them.
- The heat map now matches what is selected. It was reading the field's own
  address load on every layer, so Saboteurs and Complexes drew an identical
  wash. Measured after the fix: four layers, four genuinely different
  distributions.

## Open, round two

**The summary page.** Terrible layout, terrible use of space, terrible
visuals. Bolded without the chakra colours. Simulate against the ICPs for a
frictionless flow that is symbolic, clean and well designed. It has to feel
special: this is you. First name, big, almost a welcome. Then buckets: top
line energetics, full name, the astrological systems and how those patterns
work through you, stated as a matter of fact and never wishy washy. Then
complexes, hyper complexes, saboteurs and how they work through you. Then the
output: how these raise or lower moral integrity, what is going well, what is
not, the protocol suggestions and the ritual recommendations.

**Source AI window on the summary.** A conversation about any of this data.

**Scrub the software ten times** for missed opportunities and ways to beef up
the innovation, the look and the feel. C to C plus.

**The tools rail is missing tools.** Examine every tool that could be exposed
on the left so a person can hold the mirror up and see themselves as deeply as
possible. The owner does not know what is missing, which is the brief.

**The Field is a missed opportunity for animation.** Which lines are showing
tension. What the weight of a connection is. As you zoom in, the symbols
should be all over it.

**The Body page needs the chakra image.** It was supplied and is not being
used. Selecting head, throat or shoulders should zoom to that location.

**The pain map starts blank and is touch select.** Tap anywhere on the figure
to mark tension, then go granular: find what is going on there, find the story
associated with it, release it. The system around this needs building.

**Body page: the stringy lines pointing at nothing** do not help. UI UX to
innovate on the design rather than patch it.

**The knowledge base.** Where is the stack, the universal laws, coherence. The
design looks nothing like the rest of the product. Review five times and
dramatically improve.

**Systems deep dive.** Go through every system, not willy nilly. Check five
times that everything works, then ten more for efficiency, tested against the
ICPs.

**The ritual builder and the accountability tracker** from the original
Atüned app. Research it, produce an integration and build plan, fit it to the
badge and achievement system, review the plan ten times, run it against the
ICPs, get analytics on the sticking points, fix, simulate until smooth, then
build.

## Still open from round one

Everything in the previous queue block that is not struck above, in
particular: the compass overhaul, the story imprints fifth menu, onboarding
and the tutorial, badges and achievements, screen zone logic, intake clarity,
glass crispness, tooltips on every number, and the ICP simulations with the
pricing questions.

---

# The team's four reviews, and what came out of them

Art direction, motion and VFX, UX structure and innovation, run in parallel
against the same captured evidence. Every finding below carries a measurement
taken off the live page. Full reports are in the session record.

## Built this round

- **The aura blur was eating 87 percent of the frame budget.** Measured 7.7
  fps on the Field with a loaded profile, 59.5 with that one element hidden.
  A 120px CSS blur over a 2400 by 1500 canvas, blurring four radial gradients
  that are already soft. Dropping the radius did not save it either: 40px at a
  smaller inset still only reached 15.2. Painted at an eighth scale and
  stretched instead, so the browser's bilinear upscale is the blur and it is
  free. **60.2 fps.**
- **The chords carry weight.** 163 of them were stroked at four constant
  widths by tier while the engine had already computed a real spread, 3.73 to
  6.00 across 34 saboteurs, and discarded it at the draw call. Heaviest chord
  is now about four times the lightest.
- **The chords carry tension, and the first definition was wrong.** I took
  tension as held minus installed and shipped it before measuring. Three
  distinct values across 120 chords: a reading with no variance. Susceptibility
  discriminates, 16 distinct values on the same set, and it is the Domain
  Matrix, which this instrument has computed since the first commit and never
  drawn. A taut chord is one the person is susceptible at.
- **`--dim` carried 104 of 105 contrast failures.** One token, measured at
  3.70 to 1, now 5.11. It marks the entire second tier of the information
  architecture, and six of the thirteen reference people are 57 or older.
- **Snow was broken and I broke it.** The `#101010` ruling named field, body
  and compass; I applied it to `.stage`, which also hosts every text surface,
  so Snow rendered a black box in a white app. 174 of 360 text runs failed,
  the reading paragraph at 2.22 to 1. Scoped to the three ruled surfaces:
  now 7.99.
- **The surface ramp was narrower than a printing tolerance.** `--bg` to
  `--panel` measured 1.08 to 1. Four declared levels of surface inside a sixth
  of a stop, which is why the page squints to three grey slabs. Now 1.15 and
  1.32.

## Open, with the spec attached

**The travelling charge on each chord.** One charge per chord moving inward,
address to saboteur to complex to hyper, period set by weight because heavy
things are slow. Turns the diagram into a circuit and teaches the compounding
direction without a word. 1.60s to 4.20s by weight, sine alpha envelope,
deterministic phase off the node id. Measured cost: about +1.2ms, taking the
frame to 14 percent of budget.

**Zoom is a hard cut, and every reveal layer opens after the ring has left
the frame.** Measured: the shell is fully on screen only to zoom 2.08, and the
glyph layer starts at 2.60, names at 3.90, atoms at 4.40. Every symbol the
owner asked to see is being drawn where he cannot see them. Two moves: ease
`S.zoom` over 260ms, which makes all five reveal ramps dissolve instead of
snap for free, and pull the thresholds down to 1.55, 2.05 and 2.60. The
threshold move changes what a depth means and is the owner's call.

**The Body has no pulse.** 144 SVG nodes, zero animated. Bloom radius and
alpha pulsing at a rate set by charge, asymmetric so it is a pulse and not a
throb, phase offset per marker so the body shimmers rather than flashing.
Compositor only, under 0.3ms.

**The house curve is on zero live elements.** 382 of 384 animated elements use
the browser default `ease`; the product's own `cubic-bezier(.22,1,.36,1)` is
in the stylesheet and on nothing. 323 elements transition `all`. Three easing
tokens and four duration tokens, then replace the `all`.

**`n.disp` is frame rate bound.** 0.14 per frame settles in 331ms at 60Hz and
165ms at 120Hz: the same instrument reads charge as moving at two different
speeds on two machines. Critically damped spring against real dt, plus a 90ms
stagger by tier so the chain reads as caused rather than simultaneous.

**The readings change in zero frames.** CQ goes 15 to 22 with no mark of any
kind. Count the number over 420ms when the delta is 2 or more, and let the
tile acknowledge with the seat colour of the direction of travel. Never the
alarm colour.

**The Summary structure**, as an ordered outline: the plate with the first
name at display size and the band and `TIERDEF.toward` beside it; four top
line readings on one scale each; the blueprint in one sentence; the spiritual
layer; what is running as one block rather than four; moral integrity, which
the owner asked for by name and which needs no new arithmetic; the output row
of protocol, release and next marker, which is the block the page has none of;
and what the instrument does not know. Analytics comes off Summary entirely
and becomes its own tool. Measured today: 115 interactive elements, 3990px
tall, the person's name first appearing 1.9 screens down inside a numerology
sentence, and 46 percent of the page a second rendering of its own top.

**Eighteen tools the engine computes and no surface draws**, ranked. The top
eight: the direction out of the band, moral integrity, the protocol this state
calls for, governance, the marker ladder, what is under the line, purpose and
the boundary, and the six gates. `pathOf`, `markersFor`, `boundaryCross`,
`equivOf`, `verpShare`, `r.steer` and `CASCADE` have zero callers anywhere in
the UI. That is the honest answer to "we are missing tools and I do not know
what."

**The pain map, paint to select.** `NERVEBR` is 72 traced polylines, about
1500 points, in the figure's own coordinate space, each tagged with its seat,
currently used only to draw strokes. It is the hit geometry, already in the
file, and it resolves what the region buttons cannot: `PAINREG` has no x, so
arms and torso at the same height are indistinguishable. Capture, locate,
answer, release, and `relPick` already exists. The discipline: the stroke
selects addresses and never writes charge.

**27 named things have no icon.** All 21 laws and all 6 masks. The laws are
the numerator of CQ and render as bare radial spokes. This is why zooming in
resolves into geometry rather than into language, and it is a standing Bible
violation.

**Eight defects filed regardless of any redesign**, including two direct self
contradictions on the Summary: "leans benign at 82 percent, which means it is
contracting" takes the word from one reading and the verb from another, and
"installed pole is past the point where it pays" prints beside installed 0.0.
The pole ring is labelled 0 to 1 and reads 2.26. `sq>=4` gates "held" while
the saboteur gate is 3, so "nothing is held" prints beside ten named
saboteurs.

**The Field is too small.** The drawn disc is 26 percent of its own canvas and
16 percent of its column. An art direction call, and it caps what motion can
deliver.


---

# Queue, round three

## The audit he asked for. What was asked and never built.

Checked against the code, not against memory. A grep count of zero is the
evidence.

**Never started, asked for in earlier rounds:**

- **Onboarding.** One mention in the source and it is a comment. The welcome,
  the why, the story loop, how mindset programming works, the geometric nature
  of behaviour, the walk through the release protocol and the tools.
- **The tutorial.** Zero. Turns off once seen. Walks the tools and says what
  to expect from each.
- **Badges, achievements, score.** Two files mention a badge and neither is a
  system. Asked for twice.
- **Source AI.** Zero. A conversation with the reading, on the summary.
- **The ritual builder and the accountability tracker** from the original
  Atüned app. Zero.
- **The chakra image the owner supplied.** Zero. Still unused.
- **Selecting head, throat or shoulders should zoom to that location.** Not
  built.
- **The pain map starting blank, touch select.** Not built.
- **The intake redesign**, the Ultima style moral dilemma questions, the nine
  child emotion questions, and exposing every question in the centre rather
  than the rail. Not built.
- **The story redesign.** Called static and dull. Not done.
- **The summary redesign.** Specified in detail twice. Not done.
- **Tooltips on every number and every button.** Partial: the rail rows have
  them, most numbers do not.
- **Glass crispness.** Graded C twice, unchanged.
- **The compass overhaul.** Oscillation over time in the lower left, the six
  axis arrows, the nervous system and spine overlay, character symbols,
  selecting a character showing their story and polar opposite, the Dante
  layers, the flat 2D toggle. None built.
- **Screen zone logic.** Specified by the UX architect this round, not built.
- **The story imprints fifth menu.** Not built.
- **The ICP simulations** with the pricing questions. Not run.
- **The systems deep dive**, five passes then ten more for efficiency. Not
  run.
- **Knowledge base: where is the stack, the universal laws, coherence.** Not
  addressed.
- **The tools rail is missing tools.** Eighteen identified this round, none
  added.

## New this round

**The heat map and the pain map need the Nummenmaa treatment.** He supplied
the bodily maps of emotion figures as reference. The current zones are not
noticeable. What those images do and this does not: a continuous field across
the whole body rather than blooms at seven points, a diverging scale with
activation and deactivation as two directions from a black midpoint, and a
silhouette that is filled rather than outlined. Ours reads as dots on a
diagram; theirs reads as a body.

**Source OS.** White, not gold. Four more pixels of space between the
wordmark and it. One or two points smaller.

**Two more lightings.** A fifth, Glass on white. A sixth, flat colour, super
futuristic, high end, really sexy, with less beveled edges than the current
work.

**The tabs.** They read as flat buttons. They should feel integrated into the
navigation, and the design should be sexier.

**Summary, the reading block.** It looks boring with text sitting on the
background. It needs to look like a display area, with a home.

**Summary, the blueprint block.** Primary, secondary, masks. Stacked is
wasting space. The numerology belongs at the top. The icons at the centre top
take too much room because everything is on one horizontal line; they should
be stacked, and hovering one should give information.

**Analytics.** Its own header, just the word Analytics. Can the charts be
clicked and zoomed.

**Moral integrity.** Bigger header. And three copy lines that do not
communicate: "Shut. Temperance, detachment, patience", "Every law is measured,
so nothing here is a default", and "The record. No snapshot yet."

**The knowledge base.** Address becomes Node. What is the difference between
an address and a fetter, and the page has to answer it. Add the weight, the
icon and the percent of the weight for anything identified in this person, and
nothing for what is not. The fetter cards already carry the icon; the number
goes in a pill at the lower right of it. And the word Fetter on the card is
replaced by the thing itself: Fear, Anger. Icon, then the action.

**The games come out of the knowledge base.** They are independent games, a
place a person comes for brain release games. This needs a game development
director with thirty years of mobile experience, Jam City, EA, Supercell, who
owns it: the structure, the game design document, the art direction, two
really rad games, and how they work into the point and badge system. Simulated
against the ICPs until the friction is out and they feel satisfying.

**The Field depth names are broken language.** Charge, Cluster, Chain,
Blueprint. Blueprint is understood. Chain is not. Is a cluster nodes, or
fetters, or a saboteur. Is charge the individual fetter. The architecture may
be right and the words are not, and this is the highest visibility naming
failure in the product.

**The wordmark restarts the app from the intro.** That is the behaviour; it is
worth deciding whether it should be.

**The intro animation is the face of the whole thing.** Two beats of black,
fade in and fade out, as bookends. Two more seconds of animation. Then the
animation director, the UI UX and the art director simulate it twenty times
and produce three dramatically different versions. What he likes, in his
words: line weight, effects, things that feel special, colour, feeling invited
to something brand new, really awesome animation timing, smart and clever ease
in and ease out, anticipation, timing, staging. The material is already
there: the halo, the soul, the pitchfork, the geometric nature of the soul.

**Profile save.** Is it automatic, is there a save button, is one needed. The
question needs an answer on the screen.

**A release tab, standalone.** The imprints panel on the left, split into two
halves that scroll independently: imprints on top, and the release with all
its settings on the bottom. How many patterns, how long, how quick, and
selecting which ones.

---

## Ruled 19 September, second note. Account, help and the feedback loop.

His words, and the whole block is his: the profile page is non-standard, the
identity form should put itself away once it is saved, undo and redo are just
the arrows, and feedback lives in help alongside customer support. The point he
made at the end is the one that orders the rest: the funnel, the product and
the feedback loop are one loop, not three features.

**Q1. The identity block rolls up on save.** `ui/intakeui.js`, `engine/schema.js`
Once a person has entered name, sex, date, time and place and pressed save, the
form collapses to one line stating what was entered, and an edit control is what
reopens it. His reasoning: a birth moment does not change, and a form left open
invites somebody to fiddle with the one input that cannot be wrong.
*Small. Done, this commit. `who.sealed` is an ISO stamp and passes the boundary.*

**Q2. A standard account area.** `ui/ui.js` settings surface, new module
The profile page is non-standard and he does not want it invented here.
Sections, in his order: account, security, privacy, billing and tier. Coherence
does not belong in it, because coherence is everywhere else in the app already.
*Large. Blocked on the IA report. Most of it is a stub until sign in exists,
and a stub has to say so rather than look broken.*

**Q3. Help, and what is in it.** new module
Customer support, which is a question that goes to a record store this product
does not have yet. A rating a person can give in seconds. The full alpha
questionnaire. All three need network, and the app has exactly one seam.
*Large. The queue and the honest failure report are the real work, not the form.*

**Q4. The alpha questionnaire.** new module
Eleven questions he named, across marketing, production and development. Do you
know what you are doing. How good is it. Does the information make sense. Do you
know what you are reading. What would improve the experience. Is the information
helpful, or not. Does the protocol make sense. Does the explanation around the
problem make sense. Do you know why we are doing this. Does the content and the
knowledge base make sense.
*Medium. Every answer has to name a decision it would change, or it is cut.*

**Q5. Undo and redo are the arrows.** `ui/ui.js`
No labels. The arrows carry it.
*Small.*

**Q6. One loop.** funnel, product, feedback
His close: "That way we have our funnel, the product, and feedback loop all in
one." Whatever gets built for Q2 to Q4 is designed as one path, not three
surfaces that happen to sit near each other.
*The framing, not a task. It decides the shape of Q2 to Q4.*

**What is ruled and not negotiable inside this block.** A feedback payload
leaves the device, so it is a record. It never carries a name, an email, a
customer id, a subscription id, a key or a token, and it never carries a story.
Free text is the risk and the control says so in one line before anybody types.
Every control that can fail reports through `status()` and never claims a send
it did not get.

---

## Ruled 19 September, third note. The Field, the fetters and imprints.

**R1. Imprints gets its own tab and its own robustness.** `ui/imprints.js`
He likes seeing an imprint appear inside the story and likes running one from
there, because it is instantaneous. That stays. What it does not have is a
surface of its own. His instruction: go and look at the original design and
review it twice, because a layout and a flow for this already exist there.
*Medium. Read the original before drawing anything.*

**R2. The rainbow bands at the centre of the Field.** `ui/wheel.js`
Zoomed in, the centre carries colour bands that read as feathers. His questions,
which are the spec: what is the intention, is it the expression of the energy,
what values is it deriving, and what is associated with it. Today it is a symbol
with no information, no click target and no behaviour.
*Medium. It either carries a reading and can be interrogated, or it comes out.*

**R3. The six axis icons are barely visible.** `ui/wheel.js`
Redesign so they stand out. They are also missing the pill carrying the percent
at which a person tends to do that thing most often.
*Medium.*

**R4. The Field top row takes too much horizontal space.** `ui/wheel.js`, `ui/panels.js`
Pills and percents across a full line for something that should be a circle and
a pill with text. Same information, far less real estate.
*Medium.*

**R5. The accuracy readout in the lower right.** `ui/wheel.js`
The percent is right and is what he wants: behavioural accuracy, stated. The
word identification is not needed. What is needed is the number, that it is
simulated, and the plus or minus gap around it.
*Small.*

**R6. Benign and malignant, masculine and feminine, are one feature.** `ui/panels.js`
They are the same kind of reading and they look dramatically different. One
design, one icon family, streamlined rather than a heavy bar. Click gives the
information, hover gives a tooltip. His instruction: draw it three or four
times and look at what information it is actually providing first.
*Medium.*

**R7. The fetters surface is broken.** `ui/panels.js`, `ui/map.js`
His report: a cluster of circles with no information, nothing clickable, no text
saying what is going on, and no way to tell how accurate it is. His instruction
is explicit about who and how: the art director, the design director and the UI
UX architect together, ten simulated passes, pitched to the ICPs, aiming at the
least friction and the most reason to come back. Then simulated against the ICPs
again and fixed on what that finds.
*Large. The one on this list a person has called broken, so it goes first.*

---

## Ruled 19 September, fourth note. The Compass, and the Summary.

He sent a screenshot of the Compass and called the page completely broken.

**T1. Field, Compass and Body become sub buttons under one parent.** `ui/ui.js`, `shell/body.html`
His word for the parent is tools. Three surfaces you cycle between rather than
three separate top level tabs. The TAB integers are identity and do not move.
*Medium.*

**T2. The Compass is a feature and must not hold the dominant space.** `ui/cone.js`
*Medium.*

**T3. It opens flat, in 2D.** `ui/cone.js`
Then click and drag to move around it. Today it opens in the turned figure,
which is the state he has to work out how to get out of.
*Small once T2 is decided.*

**T4. Flat, Regulation and Layers go to the upper left.** `ui/cone.js`
He does not know what they do, which is a naming problem as much as a placement
one. Move them, and make each one say what it is.
*Small.*

**T5. The lower left block comes out.** `ui/cone.js`
The right hand side is the information layer. A second information layer in the
lower left is the same reading in two places.
*Small.*

**T6. 30 day, quarter and year become a 2D graph in the lower right.** `ui/cone.js`
Cycling the three shows progress in graph form rather than switching a label.
Clicking the graph opens Summary.
*Medium.*

**T7. Summary carries integrity over time, full width.** `ui/summary.js`
One horizontal graph across the whole line, sortable by day, week, month,
quarter, year and five years.
*Medium. The five year bucket has no data behind it yet and must say so
rather than draw an empty axis as though it were flat.*

**T8. The Summary is bracketed and written.** `ui/summary.js`
His frame, and it is the spec: how the spiritual psychology runs through me,
how the ego runs through me, and how the spiritual influences the ego. Then a
summary. In depth, direct, accurate, computed from everything already entered
rather than assembled on the page.
*Large. It is the piece with the most engine behind it already.*

**T9. A widget to talk to Source AI from the Summary.** new module
A conversation about the summary, asking for specifics. Needs the seam, needs a
ruling on what the conversation may see, and the story boundary applies.
*Large. Blocked on his ruling about what Source AI is allowed to read.*

**T10. The archetypes wear their chakra colours.** `engine/data`, `ui/summary.js`
Primary and secondary archetypes are seated. Warrior is root, sage is crown,
mage is third eye. They are rendered without their colour today, which breaks
the standing rule that a named thing has an icon, the icon has a family and the
family has a colour.
*Small, and it is the one on this list that can land immediately.*

---

## Ruled 19 September, fifth note. The diagnostic cards, and the knowledge base media.

**U1. Two law cards side by side, each framed in its chakra's colour.** `ui/intakeui.js`
Drawn on a screenshot, and it corrects the layout that went in an hour before
it. Not three question cards across inside one full width law. Two law cards
across, each holding its own three questions stacked, and the frame of the card
is the colour of the seat, so a person knows which band they are answering
while they answer it.
*Small. Done, this commit.*

**U2. The intro above the questions is too long.** `ui/intakeui.js`
Struck out on the same screenshot. It was one sixteen pixel paragraph of nine
lines and is now three short panels, which is the same correction arrived at
from the other side. Re-check the length against what he marked.
*Small. Done, and to be looked at again on the next build he sees.*

**U3. Videos and images for the knowledge base.** BLOCKED, and the block is
mechanical rather than a decision.
He gave the path `C:\Users\lance\Documents\GitHub\Reboot OS\Videos`, which is a
folder on his own machine. This session runs in a container with no sight of
it, so nothing about the files can be reviewed, placed or simulated until they
are somewhere reachable: committed to this repository, or attached to the
conversation. What he asked for once they are here is the team review and a
hundred ICP passes on where in the knowledge base they belong.
*The review is Medium. The block is one step by him.*

Note on one file: source.html carries no network at all and tests/design.js
gate 7 fails the build on any outbound request. Video in the knowledge base
therefore has to be either embedded, which a single file cannot absorb at any
real length, or served from the record store once it exists. That is a ruling
he will need to make and it should be made before anybody edits a frame.

**T11. tests/collide.js does not look at the Compass.** `tests/collide.js`
Found while fixing the Compass layout. The gate walks the Field wheel and no
other figure, which is why the cone's nameplates have been piling on top of
each other, in every screenshot, without a gate ever saying so. Moloch over
Set, Asmodeus over Lucifer, and three labels over The blueprint.
*Medium. The gate first, because a fix with no gate behind it regresses.*

**U4. The films arrived and are mapped.** `engine/data/kb.js`, `ui/knowledge.js`
Eight mp4s in his Drive folder `Atuned Videos`, 15.4 MB, and they are the
nature axis of HARM, E01 to E10. The mapping, the one numbering swap, the two
laws with no film and the four laws carrying two names are written up in
`BOOK-ERRATA.md`.

Nothing in the footage has been watched. No ffmpeg in the container, the proxy
refuses a direct Drive fetch and the package install, and fifteen megabytes
through the connector would fill the context without answering anything.

*The placement review is out with the architect. The hard constraint is the
whole problem: one file, no network, currently 1.17 MB, and 15.4 MB of video
base64s to about 21. That needs a ruling from him before a frame is edited.*

---

# Ruled 19 September, sixth note. The release is the flagship.

His framing, and it reorders everything under it: "once you're done with all
these tasks, our focus is going to be on the release. The release is our
flagship, ultimately. Everything else is in service of it."

## V. The release. Deep review seven times, then build.

**What it is, in his words.** "It is the release of our stories. It's the
integration so that the bias is released from the site of the nerve. I am
releasing."

**V1. See and select stories.** `ui/release.js`
Come to the page, see my stories, select the ones I want, and get a readout of
what that is going to change within my system before anything runs.
*Large. The readout before the run is the part that does not exist.*

**V2. The page is super clean, and the settings fold away.** `ui/release.js`
Select settings, save them, and they stop being in your face. Drop downs, or a
menu that drops and slides back up. Time and number of patterns are the two he
named.
*Medium.*

**V3. Multiple patterns divide automatically.** `engine/plan.js`, `ui/release.js`
A hundred patterns in five minutes across four selected things is twenty five
each. The person states the total and the selection, and the split is arithmetic
rather than another thing to set.
*Medium.*

**V4. Select by mask, and run the biggest blockers.** `ui/release.js`
His reasoning, and it is the strongest argument in the note: the masks are how
a person looks at their character and finds their performance blockers. Stage
fright, creative block, writing block. Pruning the mask so it is the shape you
want.
*Large. It turns the release from repair into performance work.*

**V5. Sort by field.** future
Arts, business, sports, performance, with the protocol customised to each.
*Large, and named by him as future rather than now.*

## W. The writing guide. Two engines, one rule.

**W1. A prompt engine on the journal.** `ui/storyui.js`, new
Speaks directly to pain and directly to character. His examples are the spec:
when was the last time you, tell me how you did. The question has to draw the
story out, cannot be ambiguous, and has to speak to an emotion, because the
emotion is what is being reached for.
*Medium.*

**W2. The intake questions speak to the charge, not the concept.** `engine/intake.js`
Same rule applied to the twenty one laws. A person should feel it in the body
and answer instantly: oh, that is a six. Today the stems are abstractions and a
person reasons their way to a number instead of feeling one.
*Medium, and it is a rewrite of sixty three strings rather than a mechanism.*

**W3. Both of the above go in the writing guide.** `.claude/skills/`
Editorial and narrative own it. No ambiguous question, anywhere, ever.
*Small once W1 and W2 are settled.*

## X. The sniffer.

**X1. Get closer to the root pattern.** `engine/sniff.js`
His note in full: the closer we can get to a root pattern the better, and the
more child patterns we can get down to, the more we are triangulating on the
root.
*Medium. It is a scoring change, not a lexicon change.*

## Y. Counters and history.

**Y1. The release keeps a history of every pattern released.** `engine/schema.js`, `ui/release.js`
*Medium. Schema.*

**Y2. Imprints carries stories added and stories released.** `ui/imprints.js`
A vertical counter, almost a thermometer, showing how many were filled up and
how many were released.
*Medium.*

## Z. The system around the product.

**Z1. The funnel onboarding, end to end.** `funnel/`
Story, information architecture, schema, design, flow, architecture, and how it
plugs into the Atuned software.
*Large.*

**Z2. A developer API.** new
See everything. Analytics across the entire system. See the Source AI brain
pooling data globally, how it is refining the model, and what the model needs
done to it.
*Large, and it needs the record store first.*

**Z3. Practitioner tools.** new
Named as needing development. `DECISIONS.md` already rules the consent, the
visible list and the revocation.
*Large.*

## AA. Small, and ruled outright.

**AA1. Benign or malignant becomes one word: orientation.** `ui/panels.js`
He worked it out in the note: it is a root behaviour, it is an orientation, and
it points either benign or malignant. Malignant is also lowercase where benign
is not.
*Small.*

**AA2. A fourth lighting called Lumen.** `shell/head.html`
White and flat, except every centre display area for every tool stays 101010,
and any background carrying text is 101010 with the text on top of it.
*Medium. It is a whole lighting, and gate 9 checks each one is its own.*

**AA3. The wordmark.** `shell/head.html`
SOURCE goes all caps to match ATUNED, and drops half a point to a point.
*Small.*

**AA4. Intake cards start open.** `ui/intakeui.js`
Open, answer, and the card closes itself. On closing it gives the weight of the
circle and shows which fetters attached, so the pill carries either a zero or a
number.
*Medium. The fetters per law is a read that does not exist yet.*

**AA5. Energetics is still boring.** `shell/head.html`, `ui/intakeui.js`
He has said it twice. A subtle glass touch, around twenty percent, was his own
suggestion.
*Medium.*

**AA6. Energetics opens with who you are, upper right.** `ui/intakeui.js`
First, middle, last, where you were born, and the Myers-Briggs, as a panel in
the upper right. Fill it, save, it folds away, and it unfolds to edit. The
twenty one laws then rise to the top of the surface.
*Medium. The roll up exists; the placement and the panel do not.*

**AA7. One film, embedded, as the template.** `ui/knowledge.js`
His ruling: just do All As One and see how it looks, and get the template set
up. Measured cost for one film: build 1.17 MB to 2.63 MB, boot plus thirty
milliseconds, heap unchanged.
*Medium.*

## What has had no touch at all

Ritual and the accountability tracker, which have a 1,496 line spec and not one
line wired. The phone spec, 1,132 lines, the same. The release, which is the
flagship and is next. Onboarding and the tutorial, which he has asked to be
built separately and wants to be asked about before anybody designs them.

---

## Ruled 19 September, seventh note. The mark, the boot, and the legal floor.

**AB1. Reanimate the logo, from first principles.** `shell/head.html`, boot
"The fundamentals of animation. Think Pixar. When it comes to timing."
The boot is a stub he called a nice stubbing. The animation director, the art
director and the design director go back to the fundamentals rather than
tuning what is there.
*Medium. It is the first four seconds a stranger has, and today they are a dot.*

**AB2. Redesign the mark.** `shell/head.html`, `shell/body.html`
Varying line weight. The golden ratio respected and reflected in the art and in
the symmetry. A halo with a golden hue against the white. His words for the
target: "when people come here they're like, oh my God, the halo." And the
design itself may need re-examining rather than refining.
*Medium.*

**AB3. The wordmark reads "Atuned powered by SOURCE OS".** `shell/body.html`
It reads Atuned over SOURCE OS today. The connecting words are new.
*Small, and it changes the tracking arithmetic under the name, which is
measured rather than eyeballed.*

**AB4. The legal floor.** `ui/account.js`, footer
Disclaimers appropriate to a product of this kind, researched rather than
guessed. Copyright, Tool of Unified LLC. A contact route, which he expects to
sit in help or the profile, and help already exists to carry it.
*Medium. This is the one item on the list where being wrong has a cost outside
the product, so the research is named and cited rather than summarised.*

**AC1. A second field leak, upstream of the release.** `ui/personas.js`, open
Found while gating the first one. In a full functional run the person's own
record already carries a reference case's charge before the release test ever
starts, so something earlier in the page writes a loaded persona's field into
`PEOPLE[0]`. The release path is fixed and gated; this one is not found yet.
`saveYou()` is the only writer and it is guarded on `S.who===0`, so the fault
is a path that claims the person's identity while a reference field is still
in `S`. A clean page shows no leak, which is why it needs the full sequence to
reproduce.
*Medium, and it is corruption, so it goes before any new surface.*

---

# Ruled 19 September, eighth note.

## AD. Lumen is about vibrancy.

**AD1. The panels and the top navigation are paper.** `shell/head.html`
White paper for the left rail, the right rail and the bar. The centre display
area stays 101010 and that has not changed.
*Small. It reverses half of what went in an hour ago, which had every panel
black.*

**AD2. Vibrant everywhere it is not paper.** `shell/head.html`
Flat colours super vibrant. Icons super vibrant. The centre field vibrant. His
sentence is the spec: Lumen is about vibrancy.
*Medium. The muted palette argued from autonomic response is a standing ruling
and this lighting is now its named exception, so say so in the sheet.*

## AE. The Field navigation is a cluster.

Ten passes by the UI UX team, and the grouping is his:

**AE1. Group the readings by kind.** `ui/wheel.js`, `ui/panels.js`
CQ, DQ and SQ are one kind. Vitality, awareness and will are another and go
lower left. Flow with them.
*Medium.*

**AE2. Severe is printed twice, so it comes out of the centre.** `ui/wheel.js`
It is on the right already.
*Small.*

**AE3. Benign and malignant are printed twice, so they come out of the
centre.** `ui/wheel.js`
They are on the left console already. The text underneath them goes too.
*Small.*

**AE4. Accuracy moves to the lower right, and its label moves left of it.**
`ui/wheel.js`
*Small.*

## AF. The compass. AND A REVERSAL HE NEEDS TO SEE.

**AF1. THIS CONTRADICTS THE EARLIER RULING AND IS NOT MINE TO RESOLVE
QUIETLY.** Earlier tonight: "the compass is a feature and should not take up
most of the dominant space." I built to that and made it smaller. Tonight:
"you're wrecking my compass. The compass is a centerpiece. It should be the
entire center area."

Taken as the later ruling winning, because it is unambiguous and he saw the
result of the first. Recorded here so it is on the record rather than silently
swapped. If the first still stands, this reverses in one line.
*Small to reverse, once he confirms.*

**AF2. The compass gets its vibrancy, and ten simulated passes.** `ui/cone.js`
Art director, UI UX, creative director and design team. Ten iterations, each
pitched to the ICPs, sharpened until the ICPs call it sexy.
*Large.*

**AF3. It slides in and out.** `ui/cone.js`
He expected that and it does not do it.
*Small.*

**AF4. The compass text is information, so it goes right.** `ui/cone.js`
*Small, and it is the same rule as AE2 and AE3.*

## AG. The Field, and what it could be.

**AG1. Ideas for the Field, visual and animated.** `ui/wheel.js`
Animation, innovation, art direction and the creative director. He called the
atomization super cool and wants that thread pulled.
*Medium to propose, unsized to build.*

## AH. The Summary becomes a page about you.

**AH1. Bold names carry their icon's colour.** `ui/summary.js`
Witness, Architect, Sage in the body text, in the colour their own mark wears.
*Small.*

**AH2. Every named thing is described as a behaviour.** `ui/summary.js`
Witness, life path seven, air. His words: so people can see, oh, I do act like
the sage, this is how the sage runs through me. A name with no behaviour
attached is a label.
*Medium, and it is the editorial rule below applied.*

**AH3. "Off the floor. And nothing more" comes out.** `ui/summary.js`
*Small.*

**AH4. The centre column is purely text about you.** `ui/summary.js`
Everything energetic, the symbols, the numbers, life path, and the whole
mental stack, move to the right. The centre reads like an astrology page about
you, written from the story journal and what has been released.
*Large.*

**AH5. Source AI retunes it, and the old reading goes to history.**
`ui/summary.js`, `engine/schema.js`
Every day the summary is tuned again from what has arrived since. The previous
reading is kept rather than overwritten.
*Large. It needs the seam and a ruling on what Source AI may read.*

## AI. The diagnostic.

**AI1. Zero to ten on one line, and tighten the design.** `ui/intakeui.js`
His words: the numbers aren't even, and I'm just not liking that design. Run
it a few times.
*Medium. Six across two rows was my arithmetic for the tap floor at half a
column; one line of eleven needs the card wider or the cells narrower, and the
floor is not negotiable, so the card is what moves.*

## AJ. THE EDITORIAL RULING. Context is key.

**AJ1. Every number says what it means, from now on.** everywhere
His example is the compass: "you read 13 below the oscillating band. You read
13, what does that mean. Integrity 4.3, what does that mean. Coherence 13."

A number with no context is not a reading, it is a score, and this product
does not score anybody. This is a standing rule for the editorial and narrative
team and applies to every surface, not the compass alone.
*Large, and it is the highest leverage editorial item in the backlog.*

## AK. Small and noted.

**AK1. The profile and undo arrangement he likes goes right.** `shell/body.html`
"How do you change the navigation with the profile undo, I like that for the
right hand side, that's cool."
*Small, and it needs one clarifying word from him about which part he means.*

**AD3. The icon buttons keep a dark ground in Lumen, and I could not find why.**
`shell/head.html`, open
Measured on the left rail under Lumen: `.ib` computes `rgb(37,40,51)` and
`rgb(9,10,14)`, which are the Dark palette's `--panel-2` and `--sunk`. But
`--sunk` traced up the whole tree from that element reads `#ECECF0`, the Lumen
value, at every level including on the button itself, and the only literal
`#252833` in the sheet is the `:root` declaration. Three probes, no answer.

Not guessed at and not papered over. The art director is reviewing this exact
surface and has the measurement.
*Small once the cause is known. It is a contrast fault on one control class,
not a broken surface.*

## AL. The mark and boot review landed. What is fixed and what is his.

**Fixed, this commit.**
The halo was not gold. `.b-halo` read `--gold`, which is an alias for
`--accent`, which is the sky blue, so it computed rgb(126,184,212) and the one
real gold in the sheet, `--au`, was never read by the boot at all. He asked for
a golden hue and the boot had never had one. Measured after: rgb(194,160,99).

The skip press also pressed the app. `.boot` is pointer-events:none, so the
sheet never took the press: it went through to whatever was under the cursor.
A press over the Energetics tab dismissed the boot and navigated there.
Measured before: surface 2 to 5. After: 2 to 2.

My first fix for it was wrong and is recorded as wrong. Stopping pointerdown
does nothing to the click that follows, because click is a separate event and
is dispatched regardless. The click is swallowed once, in capture, with a
timer so the listener never sits waiting to eat an unrelated one later.

**Measured and open, not fixed.**

**AL1. The heart is never visible in the boot.** `.b-s4` at 16.2px sits
entirely inside `.b-core` at 27px and is painted after it. Contained on all
four edges. *Small.*

**AL2. The seats overshoot their position rather than their size.**
`.b-seat{transform-origin:100px 100px}` is the viewBox centre and not each
circle's own, so the root seat travels 51px radially. The comment beside it
claims otherwise. *Small.*

**AL3. The boot wordmark is a different mark from the header's.** Header is
uppercase and the two lines match to 85.17px. The boot is sentence case with
its lines 27.03px apart, and its umlaut is still placed for a lowercase u.
*Small.*

**AL4. Reduced motion clears the sheet before a second.** Those visitors see
no mark, no name and no card at all. Changing it is a behaviour ruling, not a
defect fix. *His.*

**AL5. The boot duration contradicts itself.** CLAUDE.md says three seconds,
the stylesheet says five was ruled later, and the sequence measures 5,287ms to
clear rather than the 4,776ms an earlier audit reported. *His.*

**Five rulings before the mark is built.** Direction A or B. The duration.
Reduced motion. Whether the card being gold and white while the bar wordmark
stays sky blue is right. And whether "powered by SOURCE OS" has to appear in
the bar at all, given it sets 107.8px against ATUNED's 83.2px and the only
untracked fit is 6.56px, below the type floor.

---

# Ruled 19 September, ninth note. The checklist is the process now.

**CHECKLIST.md is the running ledger.** Every request goes in the same turn it
is made, before any code. Every seat adds its own tasks as it finds them. The
project manager reads it every turn, decides the next block and the strategy,
and only then does anybody execute. Nothing is marked done without a
measurement.

## AM. What he asked me to audit. Answers.

**The ritual EXISTS and has no door of its own.** `ui/ritual.js` is built and
`ritOpen` is reachable from three places: the compass ladder, the end of a
release, and a Summary control. It is not a tab and he has never seen it.
He has ruled where it goes: intake, ritual, story.
*Small to give it a door. The spec behind it is 1,496 lines and unwired.*

**The avatar EXISTS and is nearly unreachable.** `runAvatarDrill` in
`ui/drills.js`, reachable from exactly one place, a component click handler.
It is not a page.
*Medium. And he has now given it a job: the avatar sets the priorities the
ritual releases against.*

**The boundary EXISTS inside the purpose drill.** `boundaryCount` and a
boundary block in `ui/drills.js`. Not a surface.
*Small to surface.*

**Badges EXIST as nineteen marks.** `engine/ladder.js`, rendered in exactly one
place, the compass ladder. No points, no achievements, no store.
*Medium.*

**The somatic opener does NOT exist.** Nothing in the build.
**Points, achievements and the store do NOT exist.**
**A mobile widget and push do NOT exist.**

## AN. New, from the ninth note.

**AN1. The Summary is boring and not alive.** Innovation, animation and art
direction, ten passes, ICPs asked what would hold them, research first. His
diagnosis is the brief: it is not holding the mirror up, and it is the way the
content is delivered.
*Large. He calls Summary the most informative surface and the Field the most
impressive, so this is the gap between them.*

**AN2. Ritual becomes the third tab.** intake, ritual, story.
*Medium.*

**AN3. The core loop is the tutorial.** Discover, play, flow, body, which is
the journal, the imprints, the release and the ritual. Day one done is
touching every screen and running that loop once. A badge and points at the
end.
*Large.*

**AN4. Points, badges, achievements and a store.** Badges are completion, flow
and consistency. Achievements are success: you cleared a fetter, a saboteur, a
hyper complex, and they scale by the fetters upward. Points are a lightning
bolt with lines coming off it, and they buy patterns at the store. Tied into
the ritual and accountability tracker, which is where most of them are earned.
*Large. Design team, UI UX and creative director to plan it together.*

**AN5. The tutorial lives in the profile, toggleable and replayable.**
It does not spend real charge. Ruled.
*Medium. And it answers Q4 and Q5 of the twelve.*

**AN6. Onboarding is humble and warm, and we do not do mechanical.**
Ruled, and it settles the collision the architect flagged: "This is for you.
No one's coming to save you. Save yourself. That's what this tool does. It
helps you recognise the patterns that impair your success and make you
mentally, physically and spiritually weak." Speak to their pain. Inviting,
welcoming, they are not alone, this is here to help.
*This is Q6 answered. The writing guide takes it.*

**AN7. The somatic opener is the one thing onboarding has them do.**
The signal test, to feel the mind body connection. Possibly the observer too,
so they know how to drop back into witness and not take a release personally.
*Medium. This is Q9 answered.*

**AN8. The bar grows as they earn it.** Ruled. This is Q10 answered.
*Medium, and it needs the locked state designed.*

**AN9. Same onboarding for both arrivals.** Ruled. Q11 answered.

**AN10. Day two is the ritual.** The ritual pushes notifications and takes
over. Q12 answered.
*Large, and it needs the mobile widget.*

**AN11. Onboarding must capture something and be interactive.** Nothing is
captured today. The funnel is interactive and gives information; onboarding
should set parameters without bombarding. Pitch to the ICPs, especially the
seekers and the liberated. The rest of it covers the purpose, the why, the how
and the what we do, checked against how that is actually done.
*Large.*

**AN12. Migrate everything left in the Atuned app.** Plan the migration, put a
button under Games, decide later.
*Medium to plan.*

**AN13. The avatar is a release designer.** What you set for your avatar
becomes the priority for the ritual, which uses Source AI and your imprints to
order your releases unless you override it.
*Large, and it is the strongest single idea in this note.*

**AN14. Beat the top two ritual and accountability trackers.** Architecture,
schema, algorithms and systems, ten passes with the creative director, market
research first.
*Large.*

**AN15. The avatar can use the figure already drawn on the body surface.**
*Small.*

---

# Ruled 19 September, tenth note.

**AO0. THE FUNNEL IS NOT BUILT AND HE THOUGHT IT WAS.** `funnel/`
He asked where it is. The answer is that `funnel/` holds one file, `tokens.css`,
which `BUILD.sh` generates. `reviews/funnel-strategy.md` and
`reviews/funnel-offer.md` are strategy, not a page. Nothing has been built.
This was not flagged when he said "I think we built the funnel onboarding", and
it should have been.
*Large, and it is now the thing he is most likely to ask for next.*

**AO1. Ritual builder goes in the primary navigation.** `ui/ritual.js`, `engine/core.js`
It is a primary product, in his words. The accountability tracker is built
inside it rather than beside it. TAB.RITUAL takes integer 10, appended, because
the integers are identity and never renumber.
*Medium.*

**AO2. The app opens on the Avatar.** new surface, `engine/core.js`
This reverses the Field, which reversed Summary. He has now ruled three ways on
the opening surface and this is the latest.
*Recorded as a reversal, as the others were.*

**AO3. The avatar becomes a real page, and it is the first screen.** new
On it: set up your avatar, build the game plan, design it, set every goal. The
frame is his and it is the strongest thing in this note. The avatar is the
person you want to become. The I am story is the person you currently are and
do not want to be. Two ends of one instrument.
All the information sits on the right. Summary is a button underneath the
avatar, and pressing it gives the full breakdown.
*Large. Simulate the flow with the ICPs and the focus group first.*

**AO4. The mobile widget is deprioritised.** His word: do not worry about it yet.

**AO5. Every piece of art he has not ruled on, gathered.** ongoing
*Small each time, and it is now a standing obligation rather than a task.*

**AO6. Value based questions for the ICPs.** marketing
Is the product helpful. Did they benefit from it. Did they hit a challenge.
*Medium.*

## AP. The closing review, before anything is called complete.

Not now, in his words, but before the end. All of it runs six times.

**AP1.** The architecture, the schemas, the frameworks and the CQ score,
reviewed and run.
**AP2.** Simulated against the personas.
**AP3.** A thirty and ninety day simulation of people onboarding: why they
leave, where they get stuck, every point of friction, capturing as much as can
be captured.
**AP4.** The focus group at scale.
**AP5.** Then the release. It is the next focus once everything above is done
and every piece of art has been ruled on.

---

# Ruled 19 September, eleventh note. The compass, properly.

**I MISREAD HIM ON THE COMPASS AND RECORDED THE WRONG THING TWICE.** He was
never reversing himself. His actual position: every tool in the centre column
is a feature. The Field is a feature, the energy figure is a feature, the
compass is a feature. That was always one consistent statement. What he
dislikes is the SHAPE, not the size. The AF1 entry claiming a reversal is
wrong and this supersedes it.

**AQ1. The shape is wrong. It is meant to be an arrow up and an arrow down.**
`ui/cone.js`
It is a compass. What is drawn is something else.
*Medium.*

**AQ2. Coherent at the top, decoherent at the bottom.** `ui/cone.js`
Replacing Source and The blueprint, which are the words there now.
*Small.*

**AQ3. Halo at the top, pitchfork at the bottom.** `ui/cone.js`
*Small.*

**AQ4. The marker oscillates in your own range.** `ui/cone.js`
A dot, a circle, oscillating across the range the data says is yours, and
showing where most people oscillate.
*Medium. The oscillation exists on the marker today; the range being the
person's own does not.*

**AQ5. Every teacher takes their seat's colour.** `ui/cone.js`, data
Musashi is power. Buddha is perception. Rumi is love.
*Small once the mapping is written, and the mapping is his.*

**AQ6. Eckhart comes out. Classic figures only.** data
*Small.*

**AQ7. Every figure gets an icon.** data
Rumi, Buddha, Geryon, Moloch, all of them. Today they are names with marks on
some and nothing on others.
*Medium.*

**AQ8. The opposites take the dark version of the light colours.** `ui/cone.js`
Light on top, the same hues desaturated below. They stay legible and visible.
*Small.*

**AQ9. The names sit left and right and light up as you wheel round.**
`ui/cone.js`
Hovering one spins the figure to that person, quickly, and never snaps.
*Medium. Taken from pass 4, which he liked for this.*

**AQ10. The band becomes a room.** `ui/cone.js`
From pass 7. He said so directly.
*Medium.*

**AQ11. Pass 10 is the one.** `ui/cone.js`
Every number carries its scale. He named it and then named the reason: a
number that does not say what it is out of is meaningless.
*Large, and it is the same thing as AJ1.*

**AQ12. NO TEXT OVER THE HERO GRAPHIC, EVER.** standing rule
The 39 in the middle of the compass goes. So does anything else printed on
top of a hero figure.
*Small here, standing everywhere.*

**AQ13. The plane is out.** He tried it and ruled against it.

**AQ14. The bottom information goes right, unless it is about the tool.**
`ui/cone.js`
Tool information may sit at the bottom. A reading may not.
*Small.*

**AQ15. Flat becomes all solid. No outlines on buttons, anywhere.**
`shell/head.html`
Flat and Punch are too similar and this is what separates them.
*Small.*

**AQ16. "Powered by SOURCE OS" on the intro.** `shell/body.html`
The card, which the type arithmetic already says is the only place it fits.
*Small.*

## AR. And the copy editor rule he handed me directly

**AR1. A number without its scale is my job to stop, not his to catch.**
"39 of what. We're not doing that anymore. Make sure that's copy editor. This
is your job to make sure it's no longer happening."
This is AJ1 restated as an instruction to me rather than a task in a list.
Every number, every surface, says what it is out of or does not print.
*Standing.*

---

# Ruled 19 September, twelfth note. The developer end, and the stores.

**AS1. Login and password, and what they unlock.** new
His question and it is the right one: the password goes to the database and
unlocks the software. What that means on the developer end has never been
specced and he is right that it was not in the queue.
*Large. Out with the enterprise pass.*

**AS2. THE DEVELOPER END OF THE SOFTWARE, SPECCED.** new
The whole server side. Auth, the record store, sessions, the API surface, what
the one seam calls and what comes back, migrations, environments, deploys,
observability, and the admin and developer view he asked for earlier.
*Large, and it is the single biggest unwritten thing in the project. Everything
in the accounts fork sits on top of it.*

**AS3. Two factor.** ruling needed, research out
`DECISIONS.md` already rules that an email alone must never be the key, given
what the record holds. Whether that means two factor is the question.

**AS4. The enterprise and app store checklist.** new
Everything an enterprise app carries, and everything Apple and Google demand of
a health or wellness submission specifically, cited rather than remembered.
*Large.*

**AS5. The ninety day simulation, presented.** `reviews/simulation-quarter.md`
It exists at 1,249 lines and he has not seen it. A second pass runs against the
build as it is now and both come to him as something he can open.
*Medium.*

## AT. The mark. He has rejected the first design outright.

**AT1. The previous mark is dead.** His words: I do not like it at all.

**AT2. The mark is the stack, and the stack is the product.** new
His direction, and it is better than the brief that produced the rejected one.
All of it is divine geometry. The fetters are the most detailed layer. The top
is the binary, benign against malignant, which the product now calls
Orientation. They stack and form one shape. Seven chakra colours. Those two
things, the stack and the seven colours, are what he names as unique to this
product.
*Medium to draw, and it has to be read out of the engine rather than imagined.*

**AT3. The soul shape.** BLOCKED on him.
He calls it a squiggly cue and says he may never have shown it. If it is not in
the repository it cannot be drawn from, and inventing one and calling it his
would be worse than asking.
