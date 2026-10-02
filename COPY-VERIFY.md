# COPY-VERIFY. The voice rules, run over what the page shows.

Round PL, task J13, 2 October 2026. Seat: narrative director.

Before: the build at commit `8245e7f`, md5 `5fed0c69`. After: the build with this round's edits, md5 `3875ab73`. Every count in this file was read off those two runs and is dated by them. Re-run for today.

## What he said, and what was true

> "I keep seeing this percent shit, the hardest carrying zero percent. I don't want that. You have rules for this content. Use them."
>
> "I need you to verify that you have gone through the site because I have seen much stuff that doesn't have the rules. Especially in the tooltips. And some of the info."

He was right, and the reason is mechanical. `check.py --objections`, the source sweep, reads **0 findings at a severity that stops a build** on the build before this round and on the build after it. It reads the literals in the files. A figure whose digit arrives at run time, a string held in a table, a tooltip built by a template and a title a stylesheet capitalises are not literals, so the gate reported clean while the screen printed "Heaviest Root 0.0".

So the product was walked the way a person walks it. The rules were run over what the page showed.

## What was walked

- **Surfaces.** 1675, which is every tab in `TABDEF` and `TABEXTRA` (Story, Avatar, Summary, Intake, Analytics, Field, Body, Compass, Character, Ritual, Knowledge, Clients, Games, Settings), the release in three states, the four funnel pages, every table in the product, and every control pressed once. By kind: press2 688, press 416, data 302, tab 252, funnel 8, release 6, hover 3.
- **Profiles.** A blank one, and the 15 personas in `PEOPLE`. Unread, read off `compute().unread` at the moment of each snapshot and not typed: blank, You. After every press the walk reads the state again and resets a blank profile that a press has read, so no "unread" surface is a read one.
- **Widths.** 1600 and 390.
- **Strings.** 14234 distinct, of 12 kinds: data 3978, text 3811, title 3188, aria-label 2153, svgtitle 586, tip 341, tip-t 62, option 55, status 23, hover 23, placeholder 12, dialog 2. A tooltip is read three ways: the attribute (`title`, `data-tip`), the panel the one tooltip actually opens, and the caption slots a hover writes into.
- **Saved to** `COPY-VERIFY-strings.json` (after) and `COPY-VERIFY-strings.before.json` (before). Each string carries the surfaces it appears on.

## Counts per rule, before and after

A string is counted once per rule however many surfaces show it. **Stop** fails. **Flag** is read by a person and fails nothing. Percent, zero, total, bare number, cause and title case are new in `tools/copy-verify.py`. The `check:` and `obj:` rules are `check.py` and `objections.json`, called and not copied.

| rule | what it catches | stop before | stop after | flagged before | flagged after |
|---|---|---:|---:|---:|---:|
| `zero` | zero shown as a number | 364 | 0 | 1028 | 7 |
| `percent-zero` | percent printed off zero | 178 | 0 | 0 | 0 |
| `percent-unread` | percent on an unread profile | 155 | 0 | 12 | 1 |
| `total` | count against a total | 28 | 0 | 4 | 3 |
| `title-case` | authored in title case | 24 | 1 | 0 | 0 |
| `cause` | states a cause for the body | 20 | 0 | 0 | 0 |
| `obj:count-against-total` | count against a total (CO-05, existing gate) | 17 | 0 | 3 | 3 |
| `bare-number` | bare number on an unread profile | 13 | 0 | 39 | 38 |
| `check:caps` | capitals in copy (check.py) | 10 | 0 | 0 | 0 |
| `css-caps` | lower case shown as capitals by the stylesheet | 0 | 0 | 38 | 38 |
| `tooltip-anti` | tooltip with the antithesis shape (flag) | 0 | 0 | 51 | 54 |
| `css-case` | sentence case shown as title case by the stylesheet | 0 | 0 | 146 | 161 |
| `cause-read` | body word joined to a cause word | 0 | 0 | 2 | 2 |
| `title-case-name` | title case, a name from the codex | 0 | 0 | 384 | 379 |
| `obj:bare-weight` | weight with no node state (his objection CO-30, flag) | 0 | 0 | 1713 | 1594 |
| `tooltip-gloss` | tooltip with a which-means gloss (flag) | 0 | 0 | 1 | 1 |
| `percent` | percent on a read profile | 0 | 0 | 1861 | 421 |
| **all** | distinct (string, rule) pairs | **809** | **1** | **5282** | **2702** |

## Counts per surface, before and after

Stop only. A string on five tabs or more is the shell and is counted once there.

| surface | failing strings before | failing strings after | worst rules before |
|---|---:|---:|---|
| Knowledge | 455 | 0 | zero 284, percent-zero 158, percent-unread 141 |
| Body | 123 | 0 | zero 115, percent-unread 11, percent-zero 4 |
| Summary | 105 | 0 | zero 65, cause 20, percent-unread 8 |
| (shell, on every tab) | 49 | 0 | zero 26, total 19, obj:count-against-total 13 |
| Field | 29 | 0 | percent-unread 11, percent-zero 9, zero 7 |
| Story | 22 | 0 | zero 16, title-case 3, bare-number 3 |
| Settings | 21 | 1 | title-case 20, zero 1 |
| Analytics | 20 | 0 | zero 9, percent-unread 7, bare-number 3 |
| Ritual | 9 | 0 | zero 9 |
| Release | 6 | 0 | title-case 5, zero 1 |
| data | 5 | 0 | title-case 4, percent-zero 1 |
| Compass | 4 | 0 | percent-zero 3, zero 1 |
| Avatar | 4 | 0 | zero 4 |
| Clients | 2 | 0 | title-case 2 |
| funnel about | 1 | 0 | total 1 |
| Intake | 1 | 0 | zero 1 |

## Counts per carrier, which is where the tooltips are

He said "especially in the tooltips". A tooltip is not one kind of string, so the walk counts each carrier it is carried by. The failing counts are the stop rules only, and a string failing two rules is one string.

| carrier | strings read (before) | failing before | failing after | strings read (after) | flagged after |
|---|---:|---:|---:|---:|---:|
| native hover text (title) | 3227 | 373 | 0 | 3188 | 453 |
| panels the one tooltip opened | 348 | 7 | 0 | 341 | 80 |
| tooltip titles | 62 | 1 | 0 | 62 | 0 |
| screen reader labels | 2153 | 101 | 0 | 2153 | 1567 |
| hover text on drawn marks | 542 | 12 | 0 | 586 | 37 |
| captions written on hover | 42 | 0 | 0 | 23 | 1 |
| the status line | 24 | 1 | 0 | 23 | 0 |
| dialogs | 2 | 0 | 0 | 2 | 0 |
| placeholders | 12 | 0 | 0 | 12 | 0 |
| text on the page | 3932 | 140 | 1 | 3811 | 606 |
| tables in the product | 3978 | 5 | 0 | 3978 | 122 |

## The strings themselves

Shortest first, one per template, from the before run. Where a rule still fires after, those are listed under it.

**zero** (364 before, 0 after)

    0
    0%
    0 min
    DQ 0%
    0 axes
    0 days

**percent-zero** (178 before, 0 after)

    0%
    DQ 0%
    Sad · 0%
    Fear · 0%
    Root · 0%
    Teen · 0%

**percent-unread** (155 before, 0 after)

    0%
    DQ 0%
    Sad · 0%
    Fear · 0%
    Play · 8%
    Root · 0%

**total** (28 before, 0 after)

    Most shut law. 2.7 of 10
    Your integrity is 1.9 against a clean ten.
    Will. 0.25 of 1. How much of your integrity gets through the charge you are carrying.
    Instruments integrity 6.0 of 10 intention 6.0 of 10 pole 0.00 of 10 overshoot 0.00 of 10 distortion 0.0 of 10
    Awareness of the instrument. 0.28 of 1. How strong what you mean is, and how little of it gets bent on the way out.
    Instruments integrity 4.9 of 10 intention 4.7 of 10 pole 0.82 of 10 overshoot 0.55 of 10, 1 address overshot distortion 10.0 of 10

**title-case** (24 before, 1 after)

    Sign In
    Get Help
    This Mode
    This Build
    The Content
    The Opening

  still failing after:

    Improve the Models

**cause** (20 before, 0 after)

    This element maps to the Architect root. You currently run Engine. They do not, which means something was installed on top of the blueprint.
    The field leans 100 per cent benign against 0 per cent malignant, which means it is expanding. No avatar has been stated, so there is nothing to measu...
    The field leans 93 per cent benign against 7 per cent malignant, which means it is contracting. No avatar has been stated, so there is nothing to meas...
    The field leans 61 per cent malignant against 39 per cent benign, which means it is contracting. No avatar has been stated, so there is nothing to mea...
    The field leans 100 per cent benign against 0 per cent malignant, which means it is expanding. Installed pole is past the point where it pays, so some...
    The field leans 98 per cent benign against 2 per cent malignant, which means it is contracting. Installed pole is past the point where it pays, so som...

**obj:count-against-total** (17 before, 0 after)

    of 10
    Your integrity is 1.9 against a clean ten.
    Nothing is carrying, so there is nothing to release. The intake measured 6 of the 21 laws, which is how you act, not what you hold. A story is what pu...
    The 21 laws, each out of 10, summed out of 210. All 21 are in. The shadow does not touch this number. It pulls on expression, which is coherence times...
    The 21 laws, each out of 10, summed out of 210. 21 are still to answer, and each counts 0 until it is. The shadow does not touch this number. It pulls...

**bare-number** (13 before, 0 after)

    0

**check:caps** (10 before, 0 after)

    SOURCE library
    Manipura, fire, RAM
    Blueprint domain III
    Blueprint domain XIV
    Blueprint domain XIII
    Blueprint domain XVII

## Flagged and not failed

Read by a person. These are the classes that need his ruling or a skin build, with the strings.

**css-case** (161 flagged after)

    3rd Eye
    Made of
    Sign in
    Built on
    Get help
    The core

**percent** (421 flagged after)

    1%
    Root, 5%
    Brow, 44%
    Rebel, 9%
    Sad · 40%
    Sage, 11%

**title-case-name** (379 flagged after)

    Lao Tzu
    The NPC
    Open You
    Sol Star
    Open Envy
    Open Fear

**obj:bare-weight** (1594 flagged after)

    Collapse, weight 4.5
    Dysregulation, weight 5.0
    Mania, weight 6.5, overshot
    Enabling, weight 5.1, overshot
    Saboteur. Imposter, weight 5.5
    Saboteur. Deflector, weight 5.0

**cause-read** (2 flagged after)

    At the trigeminal nerve, in the 3rd eye seat. It shows up as paralysis.
    You say yes while your chest tightens, because no is going to cost more than you have.

**tooltip-anti** (54 flagged after)

    Sage, not set
    Lover, not set
    Rebel, not set
    Ruler, not set
    Jester, not set
    Creator, not set

## What the Field rail block was trying to tell you

You asked: "This is field carrying filled in heaviest most shut. What are you
trying to tell me here? If it doesn't make sense, cut it."

On a person who has been read, it is four facts about their field.

    Carrying    how many addresses hold charge at 4 or over
    Filled in   how many addresses have the coherent opposite in place
    Heaviest    the seat with the most charge, and how much
    Most shut   the law furthest from kept, and the seat it sits at

On a person who has entered nothing it was not four facts. It was this:

    Carrying   nothing yet              an empty state
    Filled in  nothing yet              the same empty state, said again
    Heaviest   Root 0.0                 a zero, and a seat
    Most shut  Truth at the throat      a law, and a seat

Nothing was read, so every value sits at its starting point. A tie for
heaviest goes to the first seat in the list, which is Root. A tie for most shut
goes to the first law in the list, which is Truth, and Truth sits at the throat.
So the block named a heaviest seat and a most shut law from a body nobody had
measured. That is a verdict drawn off the default, and it sat under four doors
that already say "Nothing has been read yet."

**Cut, not dashed.** Four dashes under a heading is four rows that say nothing,
and the sentence that would replace them is the one the doors already carry. A
dash is right where a slot stays and the value is missing. Here the slot has no
reason to stay. The block comes back on the first reading.
`atuned_src/ui/ui.js`, the `#person` block. One conditional, `r.unread`, the
same flag the rail's tier window already uses on the lines above it.

## What changed, strings and one-token guards

Each line is the string as a person read it, then the string now, then why.
Where a guard was needed it is the smallest one, on a flag the engine already
sets (`r.unread`, `lawIn`), and it is named.

### Percent

| where | before | after | why |
|---|---|---|---|
| `ui/summary.js` sumStory | The field leans 100 per cent benign against 0 per cent malignant, which means it is expanding. | The field leans benign, toward expanding. | A share of a hundred is a score. "Which means" states a cause. |
| `ui/summary.js` sumStory | at a 100 percent match. Shadow weight is 26 per cent and the law furthest shut is | Cut the match clause. Shadow weight is 26. The law furthest shut is | A percent printed as a verdict. |
| `ui/map.js` seat tooltips | Crown, open. 0 carrying, 100 percent through | Crown, open. Nothing carrying | A share off an empty field. |
| `ui/mapshelf.js` Flow ring | 100% (nothing held) | a dash | Every seat passes everything when nothing is held. That is the default. |
| `ui/fieldbar.js` | ...they are built on, 0%. | Ring sentence only when something is carrying. Rings print a dash for nought. | A percent printed off zero. |
| `ui/knowledge.js` laws | Truth, 60% (21 rows, on a person who had entered nothing) | a dash until the law is entered, `lawIn` | A percent off a default is a figure about the default. |
| `ui/drills.js` | DQ 0% | DQ with a dash | Zero. |
| `ui/ui.js` balance tooltip | Balance. 4 percent masculine, masculine 52 against feminine 48. | Balance. Leans masculine. | One fact, said twice, as a score twice. |
| `ui/ui.js` Vitality tooltip | Seventy percent of it is what decoherence leaves, and decoherence is at 0. | Seven tenths of it is what decoherence leaves. (the second clause only when read) | A percent and a zero on an unread tooltip. |
| `ui/component.js` cr() and crBadge() | default pill: the percent of p, so a ring at nought printed 0% | dash for a nought | Every ring in the product goes through these two lines. |

### Count against a total

| where | before | after |
|---|---|---|
| `ui/ui.js` Instruments | integrity 6.0 of 10, intention 6.0 of 10, pole 0.00 of 10, overshoot 0.00 of 10, distortion 0.0 of 10 | integrity 6.4, and a dash on every one until something is read |
| `ui/ui.js` rail tooltips | Vitality. 0.24 of 1. | Vitality. 0.24. (same for Awareness, Will, Flow) |
| `ui/cone.js` | Your integrity is 7.7 against a clean ten. | Your integrity is 7.7. |
| `ui/cone.js` | Pulling you down: law 2.7 of 10 | law 2.7 |
| `ui/summary.js` glance tiles | carried depth, pole: a third line "of 10"; energy "of 1" | the third line is empty |
| `ui/summary.js` integrity line | at 6.2 of 10; 5.9 of 10 ... 6.4 of 10 | the figures, no total |
| `ui/wheel.js` | "of 100" under the coherence figure at the centre of the wheel | removed |
| `ui/rings.js` | Most shut law. 2.7 of 10 | Most shut law. 2.7 |
| `ui/drills.js` | each out of 10, summed out of 210 | each read from nothing to ten, added together |
| `ui/drills.js` | This entry put 2.1 at this address, out of 4.3 from 3 entries | The 3 entries that landed here put 4.3 in all. |

### Zero as a dash

| where | before | after |
|---|---|---|
| `ui/cone.js` record | 0 days, last run / 0 minutes / 0 rituals / 0 addresses / 0 axes | a dash in each slot |
| `ui/ritual.js` | Streak 0, Best 0 days, Kept 0 days, Practised 0 min; Imprints 0 stories | a dash; No story yet |
| `ui/storyui.js` | Commit 0, Vault 0 | Commit, Vault with a dash |
| `ui/avatarui.js` | Practised 0 days; First cycle, 0 turns done | a dash; not started |
| `ui/intakeui.js` | 0 laws measured | No laws measured yet |
| `ui/ui.js` nine axes | Fear held 0.0, Trust installed 0.0 (eighteen titles, nine rows) | Fear, nothing held; Trust, nothing installed |
| `ui/analytics.js` | Child, 0.0 and a bubble figure of 10.0 and 7.2 off a blueprint nobody read | nothing held; a dash while unread |
| `ui/summary.js` | Release has about 0.0 points of expression left in it | Release has no expression left in it |

### A cause is not a reading

| where | before | after |
|---|---|---|
| `ui/summary.js` | A blueprint that says Architect and a field that runs Engine means something was installed on top of the blueprint, and it has been carried long enough to feel like a personality. | The blueprint says Architect. The field runs Engine. These differ. |
| `ui/summary.js` | Those agree, so what you are doing is what you were built for and the cost is elsewhere. | Those agree. |
| `ui/summary.js` | X is the part still blocked, and it is blocked by the same charge named above. | X is not passing. The charge named above sits under it. |
| `ui/summary.js` | What you stated you are becoming is not being blocked by the field. | cut |
| `ui/drills.js` | They do not, which means something was installed on top of the blueprint. | They differ. |


### The same rules, in the places the crawl found

| where | before | after |
|---|---|---|
| `ui/mapshelf.js` Body, seat rows and seat drill | passes 100% on every seat of an empty body; held 0, mean SQ 0.0, integrity 6.0; address rows read `001 Fear` | a dash until something is held; the integrity is a dash while unread; the row reads `Fear`, with no serial |
| `ui/knowledge.js` | Warrior 100%, Sage 26%, down a whole deck on an unread profile; "The percent is of your strongest archetype" over rows with no percent | no percent on any row while unread, and the sentence goes with it. A pole row says "Leans toward Anger", not "22 per cent toward Anger, 78 toward Joy" |
| `ui/drills.js` law drill | Truth 6.0. Working but not strong. (a law nobody had answered) | Truth. Not read yet. |
| `ui/drills.js` | Blueprint domain XIV (a roman serial) | Blueprint domain |
| `ui/drills.js` Energy, Flow, Balance and core drills | 79% across three axes; seat by seat 100%; Outward mean 0.0 against inward mean 0.0; expression 0, with the shadow taking 0 per cent | a dash while unread; the clause is left out when there is nothing to say |
| `ui/personas.js` identification | 20.8%; signal 0%, 0 held; expression 60%; 0% of the laws are spread three or more | a dash; no signal yet; no expression yet; None of the laws are spread three or more |
| `ui/fieldbar.js` glass bar | a ring that reads 0.0, 0% and "the share ... they are built on, 0%" | a dash; the sentence only when something is carrying |
| `ui/release.js`, `ui/rings.js`, `ui/imprints.js` | 0 truths, 0 patterns, 0 DQ at the wheel's centre, part of 0 saboteurs | a dash; the clause left out |
| `funnel/about.html` | 4 of 10 counts as loaded ... at an average of 3.7 of 10 | 4 or over counts as loaded ... at an average of 3.7 |
| `ui/personas.js` | The intake measured 2 of the 21 laws | The intake measured 2 laws |

### Sentence case where the string is authored

`Energetic Summary` to `Energetic summary`, `Assemblage Points` to `Assemblage
points`, `Sign In` to `Sign in`, and the Settings headings `This Profile`, `Saved
on This Device`, `Start a New Profile`, `How This Is Protected`, `What Is Held
Here`, `This Device`, `Who Can See This`, `Load a Record`, `Export and Delete`,
`Get Help`, `Tell Us How It Is Going`, `Reading This`, `What Is Waiting`, `This
Build`, `This Account`, `Open Profiles`, `The Opening`, `Your Clients`, `A Client's
Profile`, `This Mode`, `Open Account`, `Go to Account`, and the three survey lenses
`What This Is`, `The Content`, `The Product`, all to sentence case. Capitals only
on proper names: the bija syllables `LAM VAM RAM YAM HAM` are `Lam Vam Ram Yam
Ham`, and `SOURCE library` is `Source library`. The numbers in front of four rail
labels, `0 · Root domains`, `1 · Blueprint domains`, `2 · Primary`, `5 · Child
emotions`, are gone: a stack integer in front of a person is the data model read
out loud (CO-15), and the source sweep could not see them because the markup
spells the dot `&middot;`. `Root Energetics` keeps its capital on his word, "I
want energetics capitalized". The stylesheet rule that capitalises the label
classes is not touched. It is a named gate edit for the skin build, and it is why
`css-case` is larger after than before: every string moved to sentence case here
is still shown in title case by the sheet.

Tests moved with the strings: three assertions in `tests/functional.js` that
read `Energetic Summary` and `Assemblage Points`.

## Kept on purpose, and why

- **Answer scale anchors.** `0 never`, `5 about half the time`, `10 every time` on
  the intake are the labels of a control, not a reading. The rule does not apply
  to an input's own scale.
- **Progress through a finite list.** `Pass 1 of 100, address 1 of 3` on the
  release and `0 of 24 cleared` in Games say where a person is in a list they are
  working through. CO-05 rules these allowed. They are flagged, never failed.
- **Calendar numbers** on the Ritual month, and scale ticks on the Field's
  accuracy dial. Furniture, flagged as bare numbers on an unread profile and not
  failed.
- **Names the codex gave things.** `Need To Be Needed`, `Lumbar Plexus`,
  `Box Breathing`, `The Zombie`, the 112 address names, the saboteurs, the
  practice names, the persona full names. They are title case because the codex
  wrote them that way, and a saved profile and a saved ritual find a pattern or a
  practice by that name. Renaming one is a migration. The walk counts them
  separately, as `title-case-name`, and fails none.
- **`Root Energetics`**, because he said "I want energetics capitalized".
- **`The Letting Go Deck` and `Source AI`**, which are the product's own named
  things.

## His call

1. **The percent sign on coherence and decoherence.** Coherence reads 0 to 100
   and prints with a percent sign on the ring, the glass bar, the Summary tile and
   every other template flagged `percent` in the table above. They are flagged and
   none changed,
   because that is the instrument's headline unit. If "percent" is what he is
   objecting to everywhere, the answer is one decision: print the number alone,
   and let the band word say what it means.
2. **"Stored in the body".** The glossary defines samskara as "named as yours and
   stored in the body" and the archetype entry says "it is not stored in the body".
   The sensation rule bars `stored` joined to a body part, and the product's own
   claim is that stories are held in the body. Both cannot be the rule.
3. **The codex names in title case** (the count is in the table above). Move them
   to sentence case as a migration, or keep them as names.
4. **`Improve the Models`** in `ui/account.js` is a Settings group with a toggle,
   `Use my stories to refine the reading`. It is title case, it contradicts the
   privacy line "We do not use it to train any model", and research sharing is off
   at launch in `DECISIONS.md`. Not mine and not touched. Listed.

## Needs a code change, not a string

Each is a plan block. File and line are at this branch's HEAD after the edits
above.

1. **The percent default in `cr()` and `crBadge()`** (`ui/component.js`, the
   `var val=` line in each). The component prints the percent of its own ring when
   a caller passes no `raw`, which is how a nought became "0%" across the product. The
   guard added here catches the nought. The fix is for the callers that rely on the
   default to pass what they mean.
2. **The ladder's next mark speaks in the past tense** (`ui/cone.js`
   `ladderHtml`, the `ld-next` line, reading `engine/ladder.js` `MARKS[].d`). A mark
   you have not earned prints "First run. You ran one. The instrument is no longer
   a thing you are reading about." The `d` field is written for the earned state.
   Each mark needs a second field, what it takes, and the renderer
   needs to read it for `L.next`.
3. **Analytics bubbles on a profile nobody has read** (`ui/analytics.js`,
   `anaField`). Bubble size still comes from the default blueprint and is drawn as
   if it were a finding. The figure is a dash now. The shape is the question.
4. **The stylesheet capitalises the label classes** (`shell/head.html`,
   `text-transform:capitalize`). The walk counts every authored sentence case string
   it turns into title case (`css-case` in the table). Removing the rule is a named
   gate edit for the skin build, and the `.plain` escape hatch goes with it.
5. **A cause the engine still prints in its own evidence strings**
   (`engine/sniff.js` near 1306, 1308 and 1392: `of 100 distorted`, `of 10 of shadow
   load`). They are `because:` strings. If a surface shows them they are a count
   against a total and a cause. The walk did not reach one on screen.
6. **One idea of unread.** The fixes above add one conditional each at the
   string. Surfaces still decide unread for themselves (`r.unread`, `lawIn`,
   `loadedTot`, `s.hot`, `p.you`). `unreadNow()` in `ui/component.js` is the
   start of one answer. A rule in `tests/functional.js` that no surface prints a
   figure while it is true would close the class and not the instance, and the
   walk is that rule run from outside.
7. **The funnel pages are separate files** (`funnel/*.html`, `funnel/questions.js`).
   The walk reads them. Anything it finds there is listed in the table under
   `funnel`, and none of those files was edited here.
8. **Add the walk to the pre-commit list in `CLAUDE.md`.** Two commands, both read
   the build and write a file. Not done here because `CLAUDE.md` is his.

## Found on the way, and not mine

- `check.py --baseline` fails three strings, and failed them before this round:
  `ui/map.js` (the data tip " of the body. Press one to light that area", read as
  a number in front of a unit when the thing in front of it is a variable) and the
  two figure labels `Body response` and `What it costs` in `ui/tutorial.js`. It is
  REVIEW-skin pass 1, finding 9. `--objections`, which is the gate in the commit
  list, reads clean.
- `tests/functional.js` fails four checks on a loaded machine, and the set moves
  from run to run (the fold, the dial, the CQ sweep, a button measured at 43.9).
  `dial: about the pointer, the point under it stays under it` fails the same way
  on the build from before this round. Run on one machine with nothing else
  running before trusting any of them.
- `funnel/dist/atuned-quiz.html` embeds an `engine.js` older than the one in the
  tree. Rebuilding it for this round would have changed it, so it was left as it
  was and `atuned-about.html` alone was rebuilt.

## Re-run

    ./atuned_src/BUILD.sh
    NODE_PATH=/opt/node22/lib/node_modules node tools/copy-walk.js
    python3 tools/copy-verify.py COPY-VERIFY-strings.json
    python3 tools/copy-verify.py COPY-VERIFY-strings.json --show zero     # the strings
    python3 .claude/skills/atuned-voice/check.py --objections             # the source sweep

