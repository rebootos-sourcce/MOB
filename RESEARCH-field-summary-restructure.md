# The Field and the Summary, restructured, and walked

Dani Sorensen, UI UX architect. 27 September 2026. Round FY in `TASKS.md`.

**What this is.** The mockup and the simulation ordered in FY, his words:
"I want you to simulate this with the ICPs and the focus group and the team
... You're going to have Source AI on the left hand side, so the journal will
be on the left with the imprints, and the release and the bank of the release
on the right. When you commit your story, they go to your bank. When you
release, they go to your vault ... Then those tools would go on your summary
page ... I'm very curious to know, this seems like it's a more interactive and
sticky way to involve, like, putting almost everything on one screen."

**Explicitly a mockup, as he said twice.** Nothing under `atuned_src/` moved
and `source.html` was not touched. Everything is under `proto/restructure/`.

**Source AI here is the round FY draft, and it has since been ruled.**
The scripted panel below speaks in "where, never why". Later the same day,
round GO, the owner ruled that Source AI asks why, only at seven to ten on its own
scale, and never answers why; the one document for it is
`reviews/SPEC-source-ai.md`. Nothing below was changed, because it records
what this prototype did.

**Every number carries one of three labels.** MEASURED is counted in a real
rendered page or read off the shipped engine. MODEL is `proto/ritual/losssim.js`,
calibrated to an earlier simulation and not an observed person. JUDGEMENT is
mine, and every simulated quotation is simulated: nobody said it.

---

# The answer, in eight lines

1. **On a desktop the proposed Field is one screen, and it halves the load.**
   MEASURED at 1600: 99 controls in view today, 46 proposed; the left rail
   alone goes from 51 to 2. Write, see what it found, commit, see it land,
   release, see it released: all six on one screen, none scrolled. Today two
   of the six are on the Field and one of those is 1,014 px down the rail.
2. **On a phone it is not one screen.** MEASURED at 390: the first screen is
   the same 22 controls in both layouts, because the wheel and the top bar fill
   it. The journal sits 552 px down, the release 1,912 px down.
3. **The Summary becomes navigable instead of a scroll.** MEASURED: Analytics
   was 3,359 px down the Summary at 1600 and 5,933 px at 390. Proposed, it is
   two taps and no scroll at 1600, and 660 px at 390. Masks, the child emotion
   sliders and Analytics all get cheaper to reach. The life path number gets
   dearer: one tap and no scroll today, two taps and 1,388 px proposed.
4. **The Energetics section keeps the problem it inherited.** MEASURED: 81
   controls in view, the heaviest screen in the proposal, because it carries
   the 47 blueprint and archetype buttons that were the left rail's bulk.
5. **"Sticky" has one priced part, and it is the first two days.** MODEL:
   switching on "the first session ends by showing what landed", which is what
   a bank ticking on the Field does, is worth 78.6 people of 1,000 at day 2,
   38 at day 7, 10.4 at day 30 and 1.4 at day 90. Nothing else in the
   restructure has a term in the model.
6. **That tick depends on the sniffer reading the entry, and for a stranger it
   usually does not, yet.** MEASURED: the first line of each ICP's own story
   bank reads nothing for 5 of 6, so Commit stays disabled. The first commit
   comes on entry 3 for four of them and entry 4 for Sofia.
7. **Bank and Vault: clearer as nouns, false as a transfer.** MEASURED: in 69
   releases no address left the bank for the vault. A release takes weight off
   every address on the same axis, so the vault gains three and the bank's
   count usually stays put (29 of 69 runs it moved at all). Only the weight
   falls every time, 68 of 69. The words are an improvement only if the tick
   is honest about that, and only if every surface changes, not one.
8. **Who it works for splits by stance, not by level.** JUDGEMENT: the
   restructure reads as engaging to the people who already write (Angela,
   Sofia, Ana) and as a cockpit that finally has a steering wheel to the ones
   who measure (Derek, Diane). James and Marcus, the two who came to test the
   instrument, are served by the Summary's sections and put off by the Field's
   voice panel. Detail in section 5.

---

# 1. Method

**The prototype.** `proto/restructure/field-summary-restructure.html`, packed
with `tools/pack.js`, 1,016 KB, one file, nothing fetched. It is the committed
`source.html` (build stamp `fe433d8 2026-09-27 02:27`, read at commit
`73702c4`) with an overlay injected before `</body>`, the way
`proto/avatar/seats4` is built. `proto/restructure/build.js` makes it.

**How to use it.** Open the file. The striped strip across the top is the
prototype's, not the product's. Today and Proposed switch the whole layout;
Today is the shipped build untouched. The person picker loads any of the six
ICPs or nobody. Options holds the four choices in section 10, drawn, plus
"Type one of their lines", which puts one of that person's own story bank
lines in the journal so the commit, the tick and the release can be watched.
The address sets the state too, for a screenshot: `#mode=new&who=Derek&tab=1&sec=psyche`.
Packed md5 `ff4f341be4c30408db54adf92a9c7c35`; the unpacked file every number
below was measured on, `restructure.html`, md5
`0f3204ad03acc963596a04ecc7c0713f`, rebuilt the same by
`REV=73702c4 node proto/restructure/build.js`. Opened packed in Chromium at
1600 and 390: no console errors, no outbound request, no sideways scroll.

**Built over the real thing, not redrawn.** The shipped rail sections are
moved, whole, into their new places, so every renderer keeps writing into
the same ids (`#spirit`, `#roots`, `#doms`, `#polbar`, `#chg`, `#mx`, `#fire`,
`#laws`, `#key`, `#rdrill`). The Summary's own blocks are tagged after it
renders and shown by section. The sniffer, the commit's writes, the release
card, the meter's price and the avatar are the product's own calls. Only the
Field's two new rails, the tick, the two secondary navs and Source AI's
sentences are new code (`rs.js`, `rs.css`).

**What is not real, said on the page.** A striped strip across the top reads
"Prototype. Not the shipped app. A mockup of FY ... Nothing here is saved." It
is there at every width. Storage is held in memory by the file's first script,
so the prototype cannot write into the shipped app's record even when both are
opened from the same folder. Source AI is scripted and its panel says so: "No
model is called in this prototype." A release on a worked example replays the
shipped arithmetic without saving, which is what seats4 already does, because
the product refuses a release on an example by design (`ui/release.js`).

**Tab labels, after two scares.** The proposal renames only what works in the
file: Energetics reads Avatar and opens the avatar and the intake. Story is
hidden, because its journal is on the Field now; a press on it lands on the
Field. With the strip on Today every label and node goes back, and Today is
the shipped build.

**Three scripts, all reproducible from the repo root.**

    node proto/restructure/build.js
    NODE_PATH=/opt/node22/lib/node_modules node proto/restructure/walk.js
    node proto/restructure/bankvault.js
    node proto/restructure/arc.js

Their outputs are committed in `proto/restructure/measured/`: `walk.json` and
`walk.log`, `bankvault.txt`, `arc.txt`, and the screenshots the walk took.

**The counter is `proto/firstrun/walk.js`'s**, character for character in its
rule: a control is a button, link, input, select, textarea or tab stop with a
box, not hidden or disabled, overlapping the viewport. The strip is excluded.
"Whole" counts the same controls anywhere on the surface, scrolled or not. So
these numbers compare with `RESEARCH-firstrun.md` and with nothing older. Its
102 on the blank Field at 1600 is this file's 95, and the gap is the strip:
the committed `source.html` at `73702c4`, opened with no overlay, counts 102 at
1600 by 1000 and 95 at 1600 by 956, the height the 44 px strip leaves. Both
layouts carry the same strip, so the comparison inside this file is level.

**The people.** The six ICPs in `atuned_src/engine/data/people.js`, each
loaded through seats4's own build (their reference field, their story bank
from `sim/stories.js` applied, their becoming pairs from
`proto/avatar/seats4/pairs.js`), and a blank record as a stranger.

**Their levels, stated twice because two sources disagree.** The brief calls
James "a level 3 defended reader" and a seeker "level 7". That is the
assignment the voice skill made and `RESEARCH-firstrun.md` used (Angela 5,
Derek 7, James 3). `losssim.js` now reads the level off the engine's CQ on the
same reference laws, and at this commit it reads Angela 7 (CQ 64.4), Marcus 7,
Sofia 8, Diane 6, Derek 5, James 5 (CQ 42.3), Ana 5, Gordon 2. The judgement
in section 5 is argued from what each person said and does, not from either
number, and the gap is logged in section 7.

---

# 2. The count. MEASURED.

Median of the six ICPs, loaded, and the blank record beside it. `walk.json`.

## At 1600 by 1000

| Surface | Today, in view | Proposed, in view | Today, whole | Proposed, whole | Words in view, today > proposed |
|---|---|---|---|---|---|
| Field | 99 (blank 95) | 46 (blank 40) | 117 | 46 | 103 > 136 |
| Story | 113 | folded into the Field | 146 | | |
| Summary | 88 (blank 81) | Narrative 33, Energetics 81, Psyche 48, Masks 39, Saboteurs 34, Analytics 45 | 129 | 40 to 128 per section | 338 > 280 on Narrative |
| Energetics (the intake) | 90 | Avatar 36, Intake 43 | 123 | 52, 70 | 405 > 143 on Avatar |

**Where the controls sit on the Field, James, 1600.** Today: bar 16, left
rail 51, stage 21, right rail 11. Proposed: bar 15, left rail 2, stage 21,
right rail 8. The rails went from 62 to 10. The 36 left above the working
screen floor of 12 are the chrome both layouts share: the tab bar, the profile
picker, undo and redo, the thirteen layer switches, the three views and the
three zooms. **The restructure fixes the rails and does not touch the chrome.**
The next cut is the glass bar, not the rails.

**Words went up on the Field, 103 to 136, and that is Source AI.** Three to
four sentences at the head of the left rail. The Summary went down (338 to
280 on the narrative section, 1,210 to between 193 and 566 on the whole
surface) because a section replaces a 5,746 px scroll.

## At 390 by 844

| Surface | Today, in view | Proposed, in view | Today, whole | Proposed, whole |
|---|---|---|---|---|
| Field | 22 | 22 | 105 | 34 |
| Summary | 13 | 19 to 43 by section | 129 | 40 to 128 |
| Energetics | 16 | Avatar 16, Intake 17 | 123 | 48, 70 |

**The first screen of the phone does not change on the Field**, because the
bar and the wheel fill it in both. The whole surface does: 105 controls
stacked under the wheel today, 34 proposed.

---

# 3. The tasks. MEASURED with real clicks.

James's field, except the first task, which starts from a blank record because
the shipped commit refuses on a worked example. Taps pressed, and pixels
scrolled to bring each target into view.

| Task | 1600 today | 1600 proposed | 390 today | 390 proposed |
|---|---|---|---|---|
| Write an entry, commit it, see it on the Field | 3 taps | 1 tap | 3 taps | 1 tap, 552 px |
| Release the three heaviest, from the Field | 1 tap, 1,014 px | 1 tap | 1 tap, 4,094 px | 1 tap, 1,912 px |
| Reach Analytics | 1 tap, 3,359 px | 2 taps | 1 tap, 5,933 px | 2 taps, 660 px |
| Reach the masks | 1 tap, 46 px | 2 taps | 1 tap, 2,533 px | 2 taps |
| Move the held slider for the nine child emotions | 1 tap, 524 px | 2 taps | 1 tap, 1,487 px | 2 taps, 178 px |
| Read the life path number | 1 tap | 2 taps, 1,388 px | 1 tap, 170 px | 2 taps, 2,245 px |
| Start the intake | 1 tap | 2 taps (Avatar on the bar), 3 (Avatar in the Summary) | 1 tap | 2, or 3 and 97 px |
| See who you said you are becoming | not in the product | 1 tap, or 2 | not in the product | 1, or 2 |

**What the Field shows after the first commit, measured on the stranger.**
Today, back on the Field, the shipped rail's held count reads 0 while 27
addresses carry charge under the line; nothing on the Field says the entry
landed. Proposed, the bank on the stage reads 27 on the same screen the entry
was written on.

**What got worse, and why.** Intake is one tap more on the bar layout and two
more inside the Summary, because the avatar now stands in front of it, which
is his ask ("it makes the avatar the entire setup loop"). The life path number
got dearer because the Energetics section opens on the blueprint grids and the
numerology sits under the four lenses and the spiritual layer. That order is
mine and is one move to change.

---

# 4. Bank and Vault, against the mechanic that exists. MEASURED.

His words map onto real states, so the first job was to find which.

**Before committing.** The sniffer's pending imprints, drawn as ghosts
(`impGhosts`, `ui/imprints.js`). In the proposal these are the Imprints panel
on the left, and nothing else is.

**The bank, three candidates the engine already holds.**

| Candidate | What it is today | First week, a stranger, 38 entries across 7 ICPs |
|---|---|---|
| Held above the line | `compute().loaded`, SQ 4 or over. The Story panel calls it Held; the Field rail calls the same count Carrying | moved on 0 of 38 commits |
| Anything carrying | `compute().carrying`, SQ over 0 | moved on 21 of 38 |
| Its weight | DQ, shadow weight, already printed | moved on 22 of 38 |

The 16 of 38 that move nothing are entries the sniffer reads nothing from.
`bankvault.js` part one.

**The vault, three candidates.**

| Candidate | What it is today | Ten releases from each ICP's own field |
|---|---|---|
| Released at least once | `meterFirst(p,'addr:'+i)`, a dated first written by `relCoolDown` | fills on the first release, every time |
| Cleared entirely | the release card's "cleared entirely", a run that leaves 6 of 100 or under | James, Derek, Diane: 0 after ten runs |
| Opposite installed | Imprints' "Filled in", pole 4 or over | no new one in 69 runs |

**The transfer does not happen.** "When you release, they go to your vault"
reads as a thing leaving one place for another. `relCoolDown` takes 21 percent
of an address's weight plus 2 and writes the change onto its axis, so every
address on that axis gets lighter and none leaves. MEASURED across 69 runs
from the reference fields (`bankvault.js` part two): the held count fell by
exactly the three released in 5 runs and did not move in 54; the carrying
count moved in 29; the weight fell in 68. On the prototype, Derek's first
release took 15 addresses under the line and Diane's 14, and Sofia's and
Angela's none, because all three of theirs were under it already.

**So the prototype does not animate a transfer.** The bank's number is its
addresses and its ring is its weight; the vault's number is addresses released
at least once and its ring is how much of their weight has come off. A commit
ticks the bank's number when it adds an address and its ring when it adds
weight. A release ticks the vault up and the bank's ring down. Source AI says
out loud when the count did not do what the metaphor implies: "It lightened
the whole axis each address sits on, so 15 addresses dropped under the line,
not 3."

**The words, counted on the rendered page.** MEASURED, James, 1600.

| Surface | Words for "what I committed" | Words for "what I released" |
|---|---|---|
| Today, Field | Held, Carrying | Filled in |
| Today, Story | Held (twice), held (8), Carrying | Filled in, installed (4) |
| Today, Summary | Held, carrying (5), Carrying | Filled in, installed (3), Installed |
| Today, release card | | Released, "0 cleared entirely" |
| Proposed, Field | Bank (5) | Vault (3), released |
| Proposed, Summary | Held, Carrying, carrying, unchanged | Filled in, installed, unchanged |

**Renaming one surface adds a word, it does not replace one.** Today one
count wears two names, Held on the Story and Carrying on the Field rail, both
37 for James. The proposed Field says Bank, and the Summary's information
panel, which is shipped code, still says Carrying 37 and Filled in 6. A person
who reads both meets three names for one number. It only reads as clearer if
the rename reaches every surface in the same build.

**The word is already taken, twice.** `engine/plan.js` writes "banked" and
"banking" for patterns carried past a week's grant, printed as New ground in
the profile sheet (`ui/panels.js`), so "bank" would mean both the charge a
person carries and the allowance they have not spent. And `DECISIONS.md` line
58 already rules "The bank is the imprints. A person fills it. It wants a piggy
bank icon." So Bank is his own earlier ruling, and the prototype draws the
piggy bank, stroked, ring not fill.

**The metaphor's direction.** JUDGEMENT. A bank is where value accumulates and
is kept; this bank holds what costs a person, and the product's own strongest
line is "You are still paying for every charge you never released." A vault
is where things are locked away and kept; a release is letting go. Both nouns
point the opposite way to the mechanic unless the copy turns them. Section 5
has who that bothers.

---

# 5. The panel and the focus group. JUDGEMENT on MEASURED screens.

Every quotation is simulated. Tags as `RESEARCH-icp.md`: BUY, HOLD, CONFUSE,
RESIST, REFUSE. What each person met is measured and cited.

## Angela, 36, seeker. Engine grid 7, voice skill 5. At 390.

Her first line, "Everything happens for a reason. I have said that at three
funerals and I believed it each time", is the only first line in the roster
the sniffer reads: 4 imprints pending, Commit enabled, Source AI names the
seat as she types. On a stranger's record it adds 17 addresses to the bank and
moves shadow weight 0 to 2.2. Nothing crosses the line.

- **Field. BUY.** "It said where it landed while I was still writing, and the
  number went up when I pressed it. That is the first time this thing answered
  me." This is `RESEARCH-firstrun.md`'s best moment, the live highlight, now on
  the same screen as the thing it changes.
- **Bank and Vault. CONFUSE.** "Why is my grief in a bank. Am I saving it?"
  The vault she reads as right: "that is where the old stuff goes when I am
  done with it", which is not what it is. She would be surprised on the second
  day to find a vaulted address still in her bank.
- **Summary. HOLD.** She uses Narrative and Masks and never opens Psyche.
- **On a phone,** where she arrives from a group chat, the journal is 552 px
  under the wheel. She scrolls, because she came to write.

## Derek, 39, high performer. Engine grid 5, voice skill 7. At 1600.

His first two lines read nothing ("My last three sessions were slower and
nothing in the data explains it"). Source AI says so and gives the rule: say
what the body did, and where. His third line reads.

- **Field. BUY.** "Bank, vault, a number that moves when I do the rep. That is
  a training log." The tick is the thing he asked for in `RESEARCH-icp.md`:
  "Does it move a number I already track."
- **Bank and Vault. BUY, with the arithmetic.** He will notice on his first
  release that three went into the vault and fifteen dropped under the line,
  and he will like that the product said so. If it had animated three moving
  across, he would have caught it lying.
- **Summary. HOLD.** Analytics in two taps instead of 3,359 px is the whole
  improvement for him.

## James, 57, C suite. Engine grid 5, voice skill 3, defended. At 1600.

His first two lines read nothing ("I make the call and I sleep fine"). Source
AI's answer, "Nothing in this entry names a feeling the instrument reads yet",
is true and it is also the instrument telling him it cannot read him, which is
his thesis.

- **Field. RESIST.** "A panel that narrates me back to myself. I did not ask
  it anything." The Source AI
  panel is the part of the Field he would close. The bank he tolerates as a
  ledger.
- **Bank and Vault. RESIST.** "A bank I pay into and never empty." His frame is
  cost, and the bank's count does not fall when he releases.
- **Summary. HOLD, leaning BUY.** Sections with a name each, and the numbers
  on the right, is the report format he reads for a living. The Summary is the
  surface this restructure improves most for him. He would not use the avatar.

## Marcus, 44, creative director. Engine grid 7. At 1600.

- **Field. HOLD.** "Finally the wheel is the picture and not the middle of a
  dashboard." He sees the halved rails in four seconds.
- **Bank and Vault. RESIST.** "Fintech words on a somatic instrument. A piggy
  bank." He is the one who will say it is a costume, and he is 160 of 1,000.
- **Summary. BUY on the structure, RESIST on Energetics.** The six sections
  read as designed. The Energetics section's 81 controls read as the old rail
  moved, which it is.

## Sofia, 41, somatic practitioner. Engine grid 8. At 390, late.

Her first three lines read nothing; the fourth reads 4. Her own field has
nothing above the line at all, so every release she can run is under it.

- **Field. HOLD.** "Tell me what to run and how long it takes" is answered: the
  release block names the three addresses, the patterns the meter will charge
  and the seconds it takes (on James: twelve patterns, about 26 seconds), in
  one line above one button.
- **Bank and Vault. CONFUSE on Vault, and it is a practitioner's objection.**
  "You do not lock a release away. You let it go. If I say vault to a client
  they will think we are storing it."
- **Summary. BUY.** Psyche with the nine sliders open and the laws beside them
  is a session tool; today it is a closed accordion 1,487 px down the phone.

## Diane, 46, founder. Engine grid 6. At 390, between meetings.

- **Field. BUY.** One screen, one box, one button. When a line reads, the bank
  moves on the screen she wrote it on, before her next meeting. Her first two
  lines do not read.
- **Bank and Vault. HOLD.** "Show me what the bank costs me." The bank's ring
  is shadow weight; nothing says what it costs. That is the cost line
  `RESEARCH-icp.md` has asked for since 18 September.
- **Summary. HOLD.**

## Ana, 47, in it now. Engine grid 5.

- **Field. BUY, and it should worry us.** She writes daily. From a blank record
  her bank reaches 77 addresses by day five and her vault fills from day two.
  A bank that keeps growing is the picture of what she is afraid of: "Will it
  tell me this has an end."
- **Bank and Vault. CONFUSE.** She needs the vault to mean finished, and it
  means started.

## The tally

| | Field | Bank and Vault | Summary |
|---|---|---|---|
| BUY | Angela, Derek, Diane, Ana | Derek | Sofia, Marcus (structure) |
| HOLD | Marcus, Sofia | Diane | Angela, Derek, James, Diane |
| CONFUSE | | Angela, Sofia, Ana | |
| RESIST | James | James, Marcus | Marcus (Energetics) |

**Engaging or overwhelming, by kind of person.** JUDGEMENT. For the people who
write, the Field is more engaging, because the thing they do and the thing it
changes are finally on one screen. For the people who test, the Field is
calmer than today (46 against 99) but the voice panel is new noise, and the
Summary is where the restructure pays them. Nobody on the panel reads the new
Field as more overwhelming than today's; two read the Energetics section as
exactly as overwhelming as the rail it came from, because it is.

**Bank and Vault, the verdict.** JUDGEMENT on MEASURED facts. Clearer than
Held and Carrying as nouns, for four of seven, because they are one word each
and physical, which the house voice asks for. More confusing than today as a
story, for three of seven, because the mechanic does not move anything from
one to the other and "vault" reads as keeping what a release lets go. Neither
outcome is renaming for its own sake; both depend on copy he has not ruled.

---

# 6. Sticky, priced. MODEL.

`proto/restructure/arc.js` runs `losssim.js` unedited on disk (md5
`7aa57f73ac69c5660998ab262a81fdda`, 49 checks passed) with one config added in
memory: the shipped build with `firstshow` switched on, which is the model's
term for "the first session ends by showing what landed". That is the one
thing the proposed Field does that the model can see. The join is JUDGEMENT.

| People of 1,000 still active | d1 | d2 | d7 | d14 | d30 | d60 | d90 |
|---|---|---|---|---|---|---|---|
| Built today | 767.8 | 602.2 | 322.8 | 191.8 | 99.4 | 45.4 | 16.6 |
| Proposed Field | 805.0 | 680.8 | 360.8 | 213.6 | 109.8 | 49.0 | 18.0 |
| Difference | 37.2 | 78.6 | 38.0 | 21.8 | 10.4 | 3.6 | 1.4 |

**Read it for what it is.** The model says showing what landed brings people
back on day two and does very little for day ninety. It is priced off one
published paper (Nunes and Dreze 2006) applied to the churn hazard on days one
and two, and it fires only when the first session puts something on the
record, which the walk says the sniffer does for a stranger's first line 1
time in 6. The rest of the restructure (fewer controls, the sections, the
avatar as the setup door, the words) has no term in the model and is not
priced here. `RESEARCH-90day.md` already found the loop breaking around day 20
at the allowance; nothing in this restructure touches that.

---

# 7. Found in passing, for the backlog, not dispatched

- **The first line problem.** 16 of 38 lines in `sim/stories.js` read nothing,
  including five of six ICPs' first lines. On the proposed Field, Commit stays
  disabled and Source AI says why. The prototype does not fix the sniffer; it
  makes the gap visible on the surface that depends on it.
- **The four doors are gone from the proposed Field.** They lived in the right
  rail's Reading section, which the bank and vault replace. Source AI offers
  the avatar on a blank record; the other three doors (nine sentences, year by
  year, the questions) are only on the Summary now.
- **The left rail on the other five tabs.** Today the same rail shows on every
  tab. The mockup restores it on Ritual, Body, Compass, Knowledge and Games,
  so the Field is now the one tab whose left rail means something different.
- **A title on a nav button on a phone takes the first tap.** The product's
  tooltip system turns any native title into a tap-to-read sheet at 390. The
  prototype's Intake button carried one and the walk's first tap opened the
  sheet instead of the intake. Removed; worth a rule.
- **Duplication moved, not removed.** Root energetics (birth data), Root
  Energetics read across (the new right rail section, `fe433d8`) and the
  Summary's Numerology in full now sit in one section, and the life path and
  the expression number print twice in it.
- **The two level sources disagree** by two levels for James and Angela, and
  the voice skill's assignment is the one the brief and `RESEARCH-firstrun.md`
  use. The engine's is read off CQ on each person's reference laws.
- **The shipped release card says "Release empties the address"** under a run
  that took 93 to 71. That is the same false transfer the word vault would
  make, already in the product.

---

# 8. What to instrument, so the next round can tell

- Share of first entries that commit at all, and entries to first commit.
- Seconds from the first keystroke to the first bank tick.
- Day two return, split by whether the first session ticked the bank.
- A five person comprehension check, one question each: "What is in your
  vault?" and "What happens to your bank when you release?" Five surface about
  85 percent of the problems, and this is a vocabulary problem with a right
  answer.
- Taps to the intake from a blank record, top bar against Summary.

---

# 9. The grade delta. JUDGEMENT.

| Surface | Today | Proposed at 1600 | Proposed at 390 |
|---|---|---|---|
| Field | C. The loop is split across two tabs and the rail is 51 controls | B minus. The loop on one screen; the chrome is still 36 controls | C. Stacked, journal under the wheel |
| Summary | D plus. One 5,746 px scroll | B. Six named sections, an information panel | B minus |
| Energetics and intake | C minus. 90 controls, a paragraph before the first question | B minus. The avatar leads, the intake is one tap under it | B minus |

---

# 10. His to decide. Each one is drawn in the prototype.

Every option below is one press in the prototype's Options panel.

1. **Where the avatar lives.** His words allow both: "change the Energetics tab
   to Avatar" and "add a secondary nav of avatar for your intake". On the top
   bar: the avatar is one tap, the intake two, the bar stays at eight. Inside
   the Summary: the avatar is two taps, the intake three, and the bar drops to
   seven because Energetics goes. The first reads as the setup loop's front
   door; the second makes it a section of the reading.
2. **What the bank counts.** Addresses carrying anything (ticks on 21 of 38
   first week entries, the prototype's default), held above the line as Held
   does today (ticks on none of them), or weight alone (moves on every entry
   that reads and every release, but it is a percentage, not things).
3. **What the vault counts, and whether an address can be in both.** Released
   at least once (fills on the first release, and every vaulted address is
   still in the bank), or cleared entirely (never fills for James, Derek or
   Diane in ten releases).
4. **Whether the words change everywhere or nowhere.** Renaming the Field alone
   gives one number three names. And whether the allowance keeps "banked".
5. **The Story tab.** The mockup hides it because its journal moved. Retire
   it, or keep it as the full width writing room for long entries.
6. **The phone.** Wheel first, as today, or journal first, since writing is
   what a person opens it to do.
