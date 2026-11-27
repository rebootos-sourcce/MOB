# Backlog audit

Refreshed 27 September by the project manager seat. His words at round JF:
"pull front and center all the HTML files that I did not respond to yet.
Link it to a document so I can do a review off that document and prioritize
which tasks we do." And his standing order at HY: "the backlog if there's
ever stuff in here that needs my eyes, has a link to it with the most recent
so I can review... when you link up the HTML files also link up the
questions."

**What was read.** `TASKS.md` rounds HV to JF, everything after the last
audit (`2ca0bbe`), at 22306 lines. Every folder under `proto/` on disk. Every
commit since `2ca0bbe`. The new prototypes' own pages and commit reports.
`PRIORITY.md` section 17. Read at commit `eba8090`.

**How a reaction is counted.** Only where `TASKS.md` records his own words
about that delivery, or a ruling recorded as his that answers it. A later
round doing other work on the same feature is not a reaction. One new
category: round IH sent him files from the last audit's list, recorded only
as "Eight of eleven sent", with no names. Where his words at IT match a
file's own contents, the reaction is assigned and marked "file
unconfirmed".

**Every number on this page is computed from the rows below or read off the
repository by the script that wrote it.** None is typed.

## Since this audit was read. Checked 27 September at `18238fe`

This page was read at `eba8090` (round JH). Rounds JI to KA have landed since,
and section 0 still lists as unanswered four things he has answered. The rows
below are left as written, because their counts come from the rows; **the
counts in sections 0 and 1 (16 in front of him, 90 deliveries, 67 folders)
are as of `eba8090` and need the audit re-run, not re-typed.** One fact
measured here: `proto/` holds 69 tracked folders and 1 untracked one,
`ritual-redesign`, in flight.

**Answered since, so no longer in front of him.**

- **Item 2, the imprint views.** JJ: "have three icons... So I can cycle
  through A, B, or C... Start off with version A." All three stay, Lanes
  first, as built at `ff76edc`.
- **Item 3, the Energetics art pass.** JP: "Energetic art pass. I like that
  for the questions. That design is really cool. Run with it, wire it in."
  No treatment named; the wire in keeps all three as a toggle and is
  uncommitted in `ui/intakeui.js`.
- **Item 4, the Compass from above.** JQ rejected it: "it doesn't look like a
  compass. I didn't agree to this." Its three IP questions are overtaken. The
  redesign (two pyramids, a gap that carries data, the teachers near the
  centre, full screen per KA) is uncommitted in `ui/cone.js`.
- **Item 12, the signal test.** The test now lives in the onboarding
  storyboard with his own script (JP, then JY, which rewrites it in full).
  Whether the observer page belongs in the first run is still his.
- **Table 1d, "Sign in shell: nothing to decide."** No longer true. JJ: "Make
  sure there's a login page, the login page is tied to the database." JX: the
  login page carries developer switches for the onboarding and tutorial
  storyboards. Both wait on section 2.1 items 1 to 3.

**Delivered since, and not in the tables.**

| Delivery | Commit | His reaction |
|---|---|---|
| `onboarding-storyboard`, `tutorial-storyboard`, first pass | `507558a` (JL) | JP, "too many words. We are visual only" |
| The same two, redone toward far less text | `0365177` (JW) | JX, the tutorial as "narrated story animations"; JY rewrites the signal test script |
| Masks as a mosaic | `7be7c9e` (JU), in `proto/masks/golden/` | None on the mosaic. JZ moves the masks onto the body map |
| Analytics preview on the Story page | `d406906` (JM) | None |
| Release protocol quality shot | `1a7083c` (JO) | JQ, the list becomes a carousel he can step and flag |
| Copy sweep to the ten year old rule | `287dd3e`, `16ad60f` (JO) | JX refines the rule: practitioner and layman both, no bare "6.3 weight" |
| `HOSTING-SETUP.md` | `113fdd7`, `d98815c` (JN, JP) | JX, "I didn't get what you said about API or anything else." A plainer restatement is owed |
| The funnel to day one hundred | `c273280` (JR) | None. Nine questions in `marketing/FUNNEL.md` section 9 |

**Questions asked since, not in table 2.0.** JL: does the ten year old rule
reach his own dictated words. JM: four, the largest whether old entries are
re-read by today's sniffer (JX, "keep the record for the sniffer... it's their
vault. So their words," bears on it and has not been read back to him). JO:
does "You released X patterns" count statements or named patterns. JR: nine,
in `marketing/FUNNEL.md` section 9. JU: Preteen and Professional still read
alike, and colour means seat in one view and family in another. JW: who says
"think yes ten times" (answered by JY's script) and whether the mirror
paragraph shows in full or is spoken. JZ: whether the Kundalini rise reads the
seat weights the Compass reads or needs a new measure, and whether the masks
on the body map retire their own page.

---

## 0. Not yet responded to. Front and centre

**16 deliveries, grouped by what each one blocks, in the order to look at
them.** The order follows his own at IT: "release and core loop are
obviously the highest, Compass and Energetics" next. Each carries its link
and its questions, so nothing has to be found elsewhere.

**Delivery.** The field panel at HV and the Story mockups at HY both failed
to open for him as downloads, the second once packed and once raw. What
worked, at HZ, was publishing the page live instead of sending a file. Sizes
are given for that reason. 3 of these deliveries live inside the shipped
app, not in a folder; the link goes to the source and the thing to look at is
the build he already has.

### Blocks the end of the release, and the reward. His priority one

**1. Badges, achievements and scoring over ninety days.** [`proto/gamification-timeline/gamification-timeline-packed.html`](proto/gamification-timeline/gamification-timeline-packed.html) (148 KB)

IZ, commit `b1d6721`. Built on his IW words: "I also don't understand our badges, achievements, and scoring mechanics. We haven't seen that system yet." The ICPs walked from day 0 to day 90 on a simulated clock, the shipped ladder redrawn for any day, and the defects the timeline shows, each with a jump to its day. The page itself marks "Achievements for clearing a fetter, a saboteur, a hyper complex" as not designed yet, which is exactly what he asked for at JF: "We should have badges for all the saboteurs, complexes, and hypercomplexes."

- Is this the system you meant, and does the release end on one of these at JF's two minute countdown?
- The reward word: marks (what ships), badges, patterns, points or karma. Open since 20 September; the page's labels wait on it.
- The page proposes corrections to the marks that ship and new ones, including "Came back", earned by returning after a gap. Take them, or not?

### Blocks the Story page settling

**2. Three imprint views to toggle, Lanes, Ring and Strip.** [`atuned_src/ui/storyui.js`](atuned_src/ui/storyui.js) (76 KB)

In the shipped app, not a folder. IW asked, JB landed it (`ff76edc`), JC sent it in the build. Three icons on the Story chart's caption line. Lanes is Trace with Route's line, the default. Ring is the seven seats as a circle. Strip is Trace as first drawn. His words: "add little three icons for the three versions of the imprint, so I can see toggle through, see which ones I like."

- Which one stays, or do all three stay as a toggle a person can use?

### Blocks Energetics and the Compass. His second priority, IT

**3. Energetics art pass, three treatments.** [`proto/energetics-art/energetics-art-packed.html`](proto/energetics-art/energetics-art-packed.html) (83 KB)

IU, commit `d4a2c35`. Asked at IT: "If you can sneak in doing an art and design pass of the Energetics page, similar to the Field and even the Summary page, maybe some mockups." All three run on the real laws, questions and Marcus's answers. At JA the answer to "Are the energetics pages... updated?" was no: this pick is what wiring it waits on.

- A, a reading list in Summary's treatment; B, a wheel in the Field's; or C, one law at a time?
- Or the team's suggestion: A's rows on a desktop, C's strip and one law at a time on a phone.

**4. The Compass from above, as wired.** [`atuned_src/ui/cone.js`](atuned_src/ui/cone.js) (76 KB)

In the shipped app. His IB pick, "a combination of C and B", wired at IP (`abcdc12`): the seven seats as a ring at his coherence score, bending out where a seat's laws score above it, and the mirror axes drawn where a release actually moves. He has the build and has not looked at the result.

- Keep the old arrow figure behind its own switch, or retire it now the circle is the Compass?
- IP measured "a release's own nine pixel move at desktop size". Alive enough, or a thicker ribbon or a larger figure?
- A small key under the view, or let it speak for itself?

**5. The Flow element, Pinch recommended.** [`proto/flowredesign/flow.html`](proto/flowredesign/flow.html) (1807 KB)

DZ. Built the same round as the first Energetics layouts and trapped by the same board he could not close ("There's no close, there's no back", EA).

- Pinch, or another option on the page?

### Blocks the Avatar setup. IT: "How do I set it up?"

**6. Four drawings for his Avatar questions.** [`proto/avatar-intake-feed/index-packed.html`](proto/avatar-intake-feed/index-packed.html) (1094 KB)

HS asked, HU drew, `4cfc227`. It answers two of his own HS questions: "Should the 63 questions intake feed the avatar's field? It's a great question. Um, mock that up", and "Two archetypes exist in the same page. I don't understand that. I need context." His IT line, "I'm not seeing those connections here", is about the same gap.

- Should the intake feed the avatar? A, kept separate; B, shown on the ring (the team recommends B); or C, suggested into a pair.
- Two archetype systems on one page: one input; two inputs kept apart; or the field reads its own.
- The archetype wheel, cut from seven meanings to three when a pattern is selected. Yes or no?
- The column law applied to the Avatar hero: the graphic alone in the centre column. Is that the screen?

**7. The journal as a container.** [`proto/container/index.html`](proto/container/index.html) (20 KB)

Built 21 September and never shown since. His IT ask, "you need to be able to record stories about your ideal person, and then record stories about the ideal behaviours that you're not", is close to this mechanic. **It loads a sibling `engine.js` and will not open as a single file.** It needs rebuilding before it is sent.

- Is the container the setup flow you described at IT, or a separate thing?

**8. The five quotients as a model.** [`proto/quotients/index.html`](proto/quotients/index.html) (26 KB)

Built 21 September and never shown since. His own five quotients, drawn. **Loads a sibling `engine.js`; needs rebuilding before it is sent.**

- Is this still the model, now that CQ, DQ and SQ are the three a person sees move?

### Blocks the Field panels

**9. The Reading card's summary window and ranks.** [`atuned_src/ui/ui.js`](atuned_src/ui/ui.js) (97 KB)

In the shipped app, `11a36c0`, his IX ask: "We need a summary window underneath Marcus's name and get rid of that 44 creative director... create new labels that reflect the content, like primary, secondary." Built as a one line summary from the coherence level, and rows ranked Primary, Secondary, Tertiary under "By weight" and "By assemblage point".

- Is that the summary you meant?
- The floor at five from IW, "everything above from 5 to 10", drawn with its costs in `PRIORITY.md` section 17, ruling 2.

**10. The Field and Summary restructure.** [`proto/restructure/field-summary-restructure.html`](proto/restructure/field-summary-restructure.html) (1017 KB)

GD, asked for at FY. The Reading card half of it has since moved at IT, IV and IX, so part of it is already answered by the build. Its questions are on the page.

- Which of its questions still stand, now that the Reading card has moved?

**11. Pin, trace and release, clickable.** [`proto/live/index.html`](proto/live/index.html) (7 KB)

DG. Also the phone Frames options a and b. DJ resurfaced the link and nothing came back.

- What a pinned chain releases, whether a pin is saved, and whether tracing and pinning come into the real Field.

### Blocks onboarding, the sniffer and the celestial rail

**12. The signal test and observer.** [`proto/signal/observer.html`](proto/signal/observer.html) (17 KB)

0s. Relevant to onboarding again since FK. The guru questions from 20 September sit under it.

- Does the observer belong in the first run?

**13. The panel on the shelf and the Dial.** [`proto/icp-review/index.html`](proto/icp-review/index.html) (36 KB)

DD. The simulated panel's finding on how often a phone tap reaches a person's heaviest address.

- Which of its fixes, if any?

**14. Signal per pattern, "we heard a little sage".** [`proto/pattern-signal/signal.html`](proto/pattern-signal/signal.html) (14 KB)

HO, his own GO idea drawn. **Loads a sibling `engine.js`; needs rebuilding before it is sent.**

- Does a pattern get its own signal line, given none of the story bank lines name one yet?

**15. The celestial rail with a real birth record.** [`proto/states/states.html`](proto/states/states.html) (1816 KB)

DO. At DU he asked what it looks like with a real birth date; a screenshot went back and no verdict followed.

- Is this the rail, with a birth record in it?

### Research

**16. Where the ninety day walk loses people.** [`RESEARCH-90day.md`](RESEARCH-90day.md) (38 KB) and [`proto/ninety/arc90.js`](proto/ninety/arc90.js) (45 KB)

FQ. JE ordered it re-run on a simulated clock, because a free week never passed on the wall clock. That run and the corrected `RESEARCH-90day.md` landed at `d1dbf32`, `1364e0e` and `02c1a9e`, and JH reproduced them independently: the free week finding was true of the build first measured and became a harness artifact once the engine grew a free week. Ready to send.

- Its questions, re-read against the corrected run.

### Answered, but which file he was looking at is not recorded

No need to resend. Confirm only if the reading below is wrong.

- `logo` drawn logotype: Probably IT, "Cool, I like what you did with the Atuned logo, very surprising." Sent at IH, which did not record its file list
- `avatar/seats4`: Probably IT, "I'm not sure what I'm looking at just yet... I can't pick a style... I do like the ring". Sent at IH, which did not record its file list

### Not worth his time, and why

- **Overtaken by a later build or ruling.** `story4` (the Story page is
  rebuilt and wired, IJ). `nav` (the glass bar replaced it). `dials`
  (orientation and balance became one renderer, FS). `lean` (the Orientation
  reading shipped). `feathers` (solved in the product, BW and CB). `tip` (the
  one tooltip shipped). `kb` (rethought, GW). `onboard` (the first run
  storyboard replaced it, FI). `flow-bc` (shipped piece by piece). `sheet`
  and the avatar three approaches (the Avatar tab is real, HQ).
  `release-protocol` (the name settled at GS, the release shipped at IM).
  The second ritual rebuild (the overhaul ordered at DU). The cleaned marma
  chart (settled at CX). `energetics`, the first four layouts (IT asked for a
  fresh pass, which is `energetics-art`). `ladder` and `game` (IW said he had
  not seen the system; `gamification-timeline` redraws the shipped ladder and
  is the thing to show).
- **Measurement tools, not pages.** `info`, `integrity`, `sniffer`.
- **Parked by him.** `funnel-copy`: "Don't touch the funnel. That's a waste
  of credits." (IB)
- **Nothing to decide.** The sign in shell: he ordered it "wired in, without
  questions" (IA), and it is.

---

## 1. Every prototype folder, and whether he has reacted

**67 folders under `proto/` today.** The last audit counted 61. New since
then: `avatar-intake-feed`, `compass-redesign`, `energetics-art`, `gamification-timeline`, `story-redesign`, `story-redesign2`. New work also landed inside an existing folder, `masks/golden`,
and inside the shipped app with no folder at all, table 1d.

**90 deliveries in all**, counting a folder with several separate deliveries
once per delivery and the shipped pieces in 1d:

- **50 reacted** in his words.
- **2 reacted, file unconfirmed.**
- **3 partial.**
- **35 with no reaction at all.**

Of the 38 without a full reaction: **16 are in section 0**, 17 are overtaken,
3 are measurement tools, 1 is parked by him and 1 needs no decision.

**What moved since the last audit.** From its "worth his eyes" list:
`fieldpanel` and the pixel `masks` were answered at IT; `avatar/seats4`
and the drawn logotype probably were; `funnel-copy` was parked at IB;
`energetics`, `ladder` and `game` were overtaken by newer drawings. The rest
are still in section 0.

### 1a. Built 20 and 21 September

| Delivery | What it is | Built | His reaction | Status | Where it goes |
|---|---|---|---|---|---|
| `avatar` dash | Avatar dashboard and the kundalini rise | 0k3 | 08b, "For the avatar page, nothing here is what I've asked for... The seven seats here aren't really telling" | Reacted |  |
| `avatar` three approaches | Armature, lantern, seam | 0n | None in his words. 0o ART2 says he "responded to the armature", with no quote | None | Overtaken |
| `band` | Chakra band colour study | 0k2 | 0j2 CF4 records his ruling, not verbatim: derived too vibrant, shipped too dull, land between the two | Reacted |  |
| `container` | The journal as a container: prompts, acknowledgement | after 08i | None | None | In front of him, section 0 |
| `dials` | One dial for balance and orientation | 0f2 | None | None | Overtaken |
| `feather` | Four feather cuts | 0c | 0p FTH1, "Sofia's is actually interesting. It is the tightest looking feather" | Reacted |  |
| `feathers` | Feather pass: target, width, dashes | 0f2 | 0p FTH1, "I do not know what you have done with the new one". Nothing after | None | Overtaken |
| `field` one to four | Plumb, Atmosphere, Tissue, Console | 0d | 0h FLD1, "I do not like the atmosphere design. And I do not like the tissue design" | Reacted |  |
| `field-a` | Four nameplate answers | 08h | 08h SB1, "I like A inside the band." | Reacted |  |
| `field-b` | Four shell directions, Kerf among them | 08h | 08k KF1, "I am liking Kerf a lot." | Reacted |  |
| `game` | Gamification loop, marks and karma | 0k | None | None | Overtaken |
| `info` | Information system coverage probes | 20 Sep | None | None | Measurement tool |
| `integrity` | Integrity probes | 20 Sep | None | None | Measurement tool |
| `kb` | Knowledge base, five passes | 20 Sep | None | None | Overtaken |
| `ladder` | Scoring, marks and awards on the loop | 08f | None | None | Overtaken |
| `lean` | Benign and malignant, four channels | 0r | None | None | Overtaken |
| `logo` first study | Letterform study | before 08e | 08e TY0, "A1 A2, T2, U1, U2, U3, N2, E3, and E2." | Reacted |  |
| `logo` round2 and round3 | Nine cuts carried two rounds | 08e | 08f QC1, "Give me context so I can answer them." A request for context | Reacted |  |
| `logo` drawn logotype | Two spaced candidates | 088 | Probably IT, "Cool, I like what you did with the Atuned logo, very surprising." Sent at IH, which did not record its file list | Reacted, file unconfirmed |  |
| `nav` | Two level navigation | 08a | None | None | Overtaken |
| `onboard` | Onboarding measurements, the loop ring | 0e2 | None | None | Overtaken |
| `pill` | Ten pill designs | 0h | 0o PC1, "Ring and pill, and chip" | Reacted |  |
| `quotients` | The five quotients as a model | after 08i | None | None | In front of him, section 0 |
| `release` | The release flow, heard | 08c | 089 RF12, "use a temporary AI voice font" | Reacted |  |
| `ritual` compass, board, tape | Three ritual builder designs | 0y | 0v, "let's start with B. But this needs to look like a calendar." | Reacted |  |
| `ritual` calendar | Design B as a calendar | 0t | 0q, "this doesn't follow any of our current design aesthetic" | Reacted |  |
| `ritual` ritual2, first rebuild | The ritual page rebuilt | 0m | 0j2, "The ritual page is a C minus" | Reacted |  |
| `ritual` ritual2, second rebuild | The ritual page rebuilt again | 0h2 | Only DU's later "the ritual builder needs a complete overhaul" | None | Overtaken |
| `sheet` | Character sheet renders | 20 Sep | None naming it | None | Overtaken |
| `signal` | Signal test and observer | 0s | None | None | In front of him, section 0 |
| `sniffer` | Sniffer measurement scripts | 0u | None | None | Measurement tool |
| `story` | Story page design | 09b | 089, "The story page is a D." | Reacted |  |
| `story4` | Four story page beliefs | 089 | None | None | Overtaken |
| `tip` | The one tooltip, designed | 0c | None | None | Overtaken |

### 1b. Built 25 September to round HU

| Delivery | What it is | Built | His reaction | Status | Where it goes |
|---|---|---|---|---|---|
| `anatomy-check` | Anatomy findings drawn on the body | BZ | CB, "always move the third eye to its correct position, not the nose" | Reacted |  |
| `anatomy-ref` scoring | Body page scored against his two charts | CS | CS, "why can't you turn that image into a grid"; CU, "use this for now, clean it up, remove the text" | Reacted |  |
| `anatomy-ref` cleaned chart | The marma chart, cleaned | CV | Only CX, "I don't know what you're asking me to do, dude, especially with the icons" | None | Overtaken |
| `arrival` | Boot and Frames/Dial arrival | ET | EV, "I think the animation's very cool. I want to see four more versions" | Reacted |  |
| `arrival2` | Breath, Orrery, Bloom, Ember | EX | FA, "breadth, the outside rings I like. Ori, not so much." | Reacted |  |
| `avatar/iam` | First Avatar comp | BS | BV, his answers in his words; CB, "let's pick drawn above for the icons" | Reacted |  |
| `avatar/iam-questions` | Avatar questions on the page | CC | CH, "this is something we need to build with the user" | Reacted |  |
| `avatar/four` | The avatar four ways | EG | EI, "Let's do the seven seats, I like that" | Reacted |  |
| `avatar/seats` | Seven Seats | EL | EQ, "the layout design is awful, D minus" | Reacted |  |
| `avatar/seats4` | Six Seven Seats layouts, Told wins | FB | Probably IT, "I'm not sure what I'm looking at just yet... I can't pick a style... I do like the ring". Sent at IH, which did not record its file list | Reacted, file unconfirmed |  |
| `avatar/redesign-GG` | Avatar redesign and Boundary overlay | GJ | HG, "So the avatar page, let's wire this in too" | Reacted |  |
| `avatar/archetype` | Archetype picker on the Avatar page | HC | HG, "instead of ringing true... scale from one to five" | Reacted |  |
| `avatar-wired` | The wired Avatar tab, screenshots | HQ | HS, the whole dictation | Reacted |  |
| `body-map-build` | Body map regions, Isotherm heat map | HE | HG, "I really dig the body map system... let's wire it in" | Reacted |  |
| `body-map-spec` | Spec images: merge, glow, questions | GT | GV, "A for the structures... C, definitely, with the icon of the fetter" | Reacted |  |
| `energetics` | Energetics, four layouts | DZ | None on the layouts. IT then asked for a fresh art pass instead | None | Overtaken |
| `field` tension | Four tension mockups | GK | GQ, "Fringes is fucking incredible... add that as part of the normal field" | Reacted |  |
| `field-cb` | CB mockups: centre, names, phone, gates | CE | CH, "for coherence, for CQ and DQ, A looks great" | Reacted |  |
| `field-overlay` | Hum, Pulse, Relay; trace and hum; pin and release | CL, CZ, DE | CU, "I like Pulse and Relay as a combination"; DB, "Trace and hum is my favourite" | Reacted |  |
| `field-rings` | Four ring renditions | BJ, BO | BP8, "I really like nested frames" | Reacted |  |
| `fieldpanel` | Field left panel, live question panel | HM | IT, "change you to the person's name... the top highest three running... I like starting the left panel closed... get rid of that text that said the field builds more than it spends". Built at IV | Reacted |  |
| `firstrun` | Onboarding and first run storyboard | FI | FK, "I like the ring with the tune... Hello Sofia's good" | Reacted |  |
| `flow-bc` | Flow round: left pick, centre picture, right answer | BC, BH | None | None | Overtaken |
| `flowredesign` | The Flow element, four options, Pinch recommended | DZ | None | None | In front of him, section 0 |
| `funnel-copy` | Hook, description, guarantee options | CO | None on the page. IB stood the funnel down, "Don't touch the funnel. That's a waste of credits." | None | Parked by him |
| `fw` | Whole team review and six mockups | FW | GE, "these are good with the saboteurs, yeah, these are excellent" | Reacted |  |
| `glassbar` | The floating glass control bar | DO | DR, "I'm not a fan of the pills as much as I used to be" | Reacted |  |
| `icp-review` | Simulated panel on the shelf and the Dial | DD | None | None | In front of him, section 0 |
| `intake` | Four archetype picker mockups | GU | GV, "this is really interesting, add this to the avatar page" | Reacted |  |
| `knowledge` | Knowledge base, four mockups | GW | GX, "screen when entry, known, zero entries, what is that, get rid of it" | Reacted |  |
| `live` | Pin, trace and release, and phone Frames, published | DG | None | None | In front of him, section 0 |
| `masks` pixel masks | 8-bit mask fragmentation | GI | IT, "I'm not impressed by the designs, but I like the idea... use more golden ratio" | Reacted |  |
| `mobile` | Phone walk and gap analysis | GL | GN, his own bug report runs `proto/mobile/coretap.js` | Reacted |  |
| `ninety` | Ninety day simulation | FQ | JE, a measurement instruction in his words quoting its friction ledger item 7. Nothing on its findings or its questions | Partial | In front of him, section 0 |
| `pattern-signal` | Sniffer signal per pattern | HO | None | None | In front of him, section 0 |
| `release-protocol` | Release against protocol, ICP simulation | EC | Not the page. Its naming question closed at GS, "stick with release" | Partial | Overtaken |
| `restructure` | Field and Summary restructure | GD | None | None | In front of him, section 0 |
| `rooticons` | Root icons and a saturation board | DX | DY, "Those icons for Architect, Engine, Weaver, I like... let's go with B" | Reacted |  |
| `shelf` | The shelf, on the real app | DA | DB, share widened to any practitioner; expand button confirmed | Reacted |  |
| `states` | Celestial rail redesign | DO | DU, he asked what it looks like with a real birth date. No verdict since | Partial | In front of him, section 0 |
| `story-source` | Story page before and after, Source AI rail | HO | HT, "I want source AI to have its own output panel" | Reacted |  |
| `tipcopy` | Tooltip copy research and pitch | FW | GB, "I don't like the term like how it runs through you" | Reacted |  |

### 1c. Built since the last audit

| Delivery | What it is | Built | His reaction | Status | Where it goes |
|---|---|---|---|---|---|
| `compass-redesign` | Compass as a circle, four proposals | HS | IB, "C is good... Let's do a combination of C and B." Wired at IP | Reacted |  |
| `avatar-intake-feed` | Four drawings for his HS questions: the column law, intake into avatar, two archetypes, the wheel | HS, HU | None | None | In front of him, section 0 |
| `story-redesign` | Story page and release, four mockups | HT, HX | HY, "I like that the visuals have changed. I don't like that the layout is too rigid"; IG, "For the story page I like Trace." | Reacted |  |
| `story-redesign2` | Trace with Route's line, four above the fold layouts, a panel simulation | II | IJ, "This looks good for the story. Wired in." | Reacted |  |
| `masks/golden` | Six masks on a golden ratio grid, a reversal time slider | IU | IW, "for the mask page, I want to see all six on the screen"; JA, "we want the outline suggestive. It's really about the color." | Reacted |  |
| `energetics-art` | Energetics art pass, three treatments | IU | None. JA asked only "Are the energetics pages and the compass updated? Yes or no?" | None | In front of him, section 0 |
| `gamification-timeline` | Badges, achievements and scoring, day 0 to day 90 | IZ | None | None | In front of him, section 0 |

### 1d. Shipped into the app, no folder, inside builds he was sent

| Delivery | What it is | Built | His reaction | Status | Where it goes |
|---|---|---|---|---|---|
| Compass from above | C and B wired into the real Compass tab | IP | None on the result. JA asked only whether it was updated | None | In front of him, section 0 |
| Sign in shell | A Sign In group in Settings that says accounts are not live | IP | None. Ordered at IA, "I need it wired in, without questions" | None | Nothing to decide |
| Story tab, layout H | Round II's layout wired in | IJ | IW, "the journal with the, uh, the imprints and the release. That works." | Reacted |  |
| Reading card, first pass | Name for "you", the three running hottest, Gaining moved | IV | IX, "I like the right side energetic summary... That's super clean." | Reacted |  |
| Reading card, summary | A summary window under the name, Primary, Secondary, Tertiary | IX, JB | None | None | In front of him, section 0 |
| Imprint views | Three icons on the Story chart: Lanes, Ring, Strip | IW, JB | None | None | In front of him, section 0 |
| Release, spoken | The spoken script and the live DQ count during a run | IM, JC | JF, "No, please review the original schematics for the release protocol." | Reacted |  |

---

## 2. The open backlog, grouped by what it blocks

**How this section was refreshed.** Every item was checked against rounds HV
to JF, and anything those rounds closed, moved or added is marked. An item
those rounds did not touch is carried from the last audit's reading at
`a0d90b3`, with its stale measured figures cut rather than repeated. The
live order of work is `PRIORITY.md` section 17. This page is the ledger
behind it.

**Closed since the last audit, in his words or in the build.**

- The Story page redesign: picked at IG ("I like Trace"), approved at IJ
  ("This looks good for the story. Wired in."), wired as layout H
  (`ecbc0a8`).
- The release as a spoken script, his priority one at ID (`2c6e38b`), and
  the live DQ count during a run (`82e7bb7`). JF then reopened the release
  as a whole, item in 2.7.
- The Compass, his C plus B at IB, wired (`abcdc12`).
- The site wide copy sweep and HS's three named bugs (`8da2afb`). The column
  law and the icon rule are in the Bible (`4cfc227`).
- The CQ audit he asked for at IK: the formula is right, two defects around
  it fixed (`bb2cbe0`).
- The Reading card: his name for "you", the heaviest three, Gaining moved to
  the centre column (`6aa063a`), the role line cut and a summary added
  (`11a36c0`).
- The masks outline, the release pace and whether CQ, DQ and SQ move in real
  time, all three answered at JA.
- "Sit back and relax": settled at JF. It is his own recorded voice, and AI
  speaks only after it, so the voice rule against synthetic copy of that line
  stands.
- The funnel: stood down at IB, moved to 2.13.

### 2.0 Every "What I need from him", round by round

Earlier rounds are in the last audit's table, carried here unchanged except
where a later round answered them.

| Round | What was asked | Answered in his words? |
|---|---|---|
| GH | Which tension look; cursor naming against charge naming | Look: yes, GQ. Naming rule: open |
| GI | Adult and Professional archetypes swapped; archetype in its mask's colour; Preteen and Professional on the same seats; saboteurs as pixel faces | Open, all four. IT reacted to the masks' look, not these |
| GJ | Arrows or triangle corners; filed or landed seat; the seven area names; pairs per area; open on heaviest or on becoming | Open, all five |
| GK | Which look; naming rule; direction changes the look; cursor size; "tension" names two things | Look: yes, GQ. Four open |
| GM | Tile shape; desktop dock too; the phone reading that opens far down the page | Open |
| GS | The crossed out refusal line: refusing at all, its wording, or neither | Built around at IF, the refusal is now silent. His ruling not recorded |
| GT | The spec questions | Partly. GV: "C, definitely". Most open |
| GU | Twelve or eighteen; Rebel or Outlaw; which mockup; saboteur on pick or on save; draft lines; opposite pairs | Which mockup: yes, GV and HG. The rest open |
| GV | Which reading of "A for the structures... with the icon of the fetter" | Open |
| GW | Does the Knowledge base quiz; how hard the daily hand pushes; body map replaces the shelf; the reward word | Open |
| GX | Backend region and provider; GitHub Actions billing; "pain and disease free" | Open, all three |
| GY | The build stamp on his boot screen; the phone reading as a sheet or a jump | Open |
| GZ | Make the repository private now, and seven more | Open |
| HA | Cloudflare or Supabase; which product goes online first; the domain spelling | Spelling: yes, HD. Two open |
| HC | Button word; one or up to three archetypes; which direction; Impact line length; the drafts; twelve or eighteen and Rebel or Outlaw | Button word and direction: yes, HG. Four open |
| HD | Move the nameservers to Cloudflare | Open |
| HE | Question A; limb regions; confirm Isotherm | Open |
| HF | Monolith or services; which engine is canonical; where a story is read; password hashing | Open, all |
| HH | Direction survives a reload; fades on its own; Frames and Dial; the running hot threshold; "tension" | Re-asked with pictures at HN. Open |
| HJ | Which app first; console visibility; console logins; home screen prompt; stage zero accounts; a Stripe account | Open |
| HK | "Pain and disease free"; load scale words; Click or Press | Open |
| HM | The field panel's questions | Character: yes, GS. "Starts closed" and what the panel tracks: yes, IT. The Laws rename and the rest open |
| HN | Questions, each one word or number | Open |
| HO | May Source AI read earlier entries; is "a pattern is what comes back" his scale; and more | Open |
| HX | Which Story mockup; "sniffing" as its own column or the top of imprints; should a negated line charge imprints; fold a long imprints panel; show the after weight before a run | Mockup: yes, IG, Trace. Above the fold: yes, HY, "I want story, imprints and release to all be above the fold". Three open |
| II | Which layout on a desktop; the first screen control count past the team's floor; should Source AI follow up on a line that reads nothing; should "Martyrdom" print for a grief line | IJ approved wiring without naming a layout; H was used. All four open |
| IL | Colour, tint and underline replace bold on the Story highlight, against the standing "Bold and coloured, ruled" | Open |
| IM | "Sit back, relax" in synthetic voice; stop a run short of the allowance at an address boundary | First: yes, JF. Second: open |
| IP | Keep or retire the old Compass arrow figure; is a release's move alive enough; a key under the view | Open, all three |
| IU | Mask outline at half intensity; release pace; drop at once or settle over nine days; which Energetics treatment | First three: yes, JA. Energetics: open |
| IW | His numbered four and five from the last question set, "I don't know what you mean", resent with pictures | Open. `TASKS.md` does not record which two questions they were |
| IW, `PRIORITY.md` 17 | What "band" means; a floor at five on the Top three; two masks that can never differ; where the masks page lives | Open, all four |
| JC | A release pick can write more addresses than the run speaks | Open |

### 2.1 Going online: accounts, the database and protection

Blocks sign in, the record store, real billing, sync and every server
protection. **New since the last audit:** at IE he asked when OAuth and APIs
join. The answer given: after the three items below it waits on, because a
key committed today would sit in a public repository. The sign in shell is
built and honest (IP, `3dd1fe0`).

1. **Make the MOB repository private.** Still public. No tool in this
   session can change it; he or an admin can, under Settings, General,
   Danger Zone. (GZ, HB, HJ, HL, HP, IE)
2. **Cloudflare or Supabase** for the database and compute. Ruled
   Cloudflare on 25 September (`DECISIONS.md`, "The stack"). On 27
   September: "I said Supabase" (GX). (AW1, GX, HA, HB, HD, HF, HJ, HL, HP)
3. **Which product goes online first**: this repository's engine or the
   Atüned app in `reboot-os`. (HA, HB, HD, HF, HJ, HL)
4. **GitHub Actions billing on the `reboot-os` owner account.** (AW2, GX,
   HJ)
5. **Move the `atuned.app` nameservers to Cloudflare.** (HD)
6. **Stage zero accounts**: the data region, a Cloudflare account, a Stripe
   account in the company's name. (HJ)
7. **`RECORDS_KEY`**, the server's encryption secret, set before the first
   real sync. Lose it and every encrypted record is lost. (AW6)
8. **Architecture**: a modular monolith or separate services; where a story
   is read; password hashing. (HF)
9. **The team console**: totals only, one named person, or per person detail
   for people who opt in; who gets a login; the home screen prompt, the only
   way Safari keeps a record past seven idle days. (HJ)
10. **IP**: whether the book is meant to be public; which name to protect
   first; the patent deadline estimated at 31 May 2027; who holds the IP;
   and a question for a lawyer, since almost every commit is authored by
   Claude. (GZ)
11. **The desktop server gaps**: work them now or hold them for the admin
   interface. (BF3)

### 2.2 The paywall and billing

The paywall is built and gated; sign in, the record store and Stripe are
not, sequenced last on his 25 September ruling. **What he has not
reviewed**, in his words at HT: "it looks like billing. I didn't review."
Re-read at `eba8090` against his rulings:

- The plan panel prints "You can see" beside "everything"
  (`ui/panels.js:893`), and the free tier line reads "The whole reading is
  visible" (`engine/plan.js:53`). His 25 September ruling gates sight by
  tier.
- It prints "As many patterns as ... therapy sessions would release"
  (`engine/plan.js:335`). Whether a therapy comparison may stand at all is
  D10.
- Pressing a tier raises "Billing is not connected yet" through the status
  line (`ui/panels.js:924`).
- The title case "Your Plan" the last audit flagged now reads "Your plan"
  (`ui/panels.js:887`). Closed.

12. **Which tier stops at which rung.** He has ruled three ways on sight: a
   staircase on 18 September, "sight is not for sale" on 19 September, sight
   by tier on 25 September. The build still says the 19th. (AZ3)
13. **The prices**, an annual plan, and tier four per practitioner or per
   client. (`DECISIONS.md`, "Billing")
14. **The reward word, and whether marks pay out.** Marks (shipped), badges,
   patterns, points or karma. JF asks for "a badge or reward or whatever it
   is", which is the direction and not yet the word. **The drawing he has
   not seen is section 0, item 1.** (0f, 0k, `PRIORITY.md` Q4, GP, GW, HL,
   `PRIORITY.md` 17)
15. **Founding offers**, and the referral cascade against the funnel's
   privacy promise. Parked with the funnel at IB. (FH, FI, HL)
16. **The one week money back guarantee**: what "results" means, how a claim
   works, when the week starts. (CO, DJ)
17. **Free tier defaults taken, not ruled**: when free weeks count from; a
   ceiling on the bank; what a downgrade does. JE's re-run on a simulated
   clock corrected what the ninety day research says about the free week
   (`02c1a9e`, verified at JH). (FU, JE, JH)
18. **A paid tier raises CQ faster**, since the lift counts new ground.
   Flagged, not decided. (BE5)

### 2.3 The Avatar page and the masks

**New since the last audit.** His IT reaction: "I'm not sure what I'm
looking at just yet. How do I set it up? How do I set up the things I want
to become and the things I don't, that I want to release? I'm not seeing
those connections here... you need to be able to record stories about your
ideal person, and then record stories about the ideal behaviours that
you're not, and the sniffer sets all that up and prioritizes the release of
those, and then the ritual builder helps build the rituals." And at IW, the
masks page in full. The HU drawings that answer part of it are section 0,
item 6.

19. **The Avatar setup flow he described at IT**: stories about the ideal
   person and the behaviours he is not, the sniffer prioritising the
   release, the ritual builder after. Not designed. It is the content chain
   in `CLAUDE.md` made into a screen.
20. **The masks page**, specified, then history rows carrying mask weight,
   then built. `PRIORITY.md` section 17, rows 4 to 6, with its rulings 3
   (Preteen and Professional share a seat pair and can never differ) and 4
   (where the page lives and whether a person lands on it). (IW)
21. **Twelve archetypes or eighteen.** (GU, HC, HQ, HL)
22. **Rebel or Outlaw.** (GU, HC, HQ)
23. **What counts as a pair cleared.** (EL, HL)
24. **Lead with the ideal he stated, or the heaviest thing in the way.** (FB,
   GJ)
25. **The Boundary**: his side names ("myself", "relationship") against the
   coded ones ("alone", "partner"); arrows or triangle corners; filed or
   landed seat; the area names; one pair or several per area. (BV, CC, GJ)
26. **Masks and their archetypes**: GI's four, unanswered by IT, which
   reacted to the look. (GG4, GI, CH)
27. **The picker's remaining four.** (HC, GU)
28. **The becoming measure.** "We need a system for measuring this. I don't
   have an idea just yet, maybe the team does." (CH)
29. **The badge system.** "These are not badges. We need to design a whole
   badge system." Now JF: "badges for all the saboteurs, complexes, and
   hypercomplexes." Waits on the reward word. (BV, GS, JF)
30. **The torus field around the figure.** (BV, CB)
31. **Which number the avatar leads with.** (EG, EQ)

### 2.4 The Field

**New since the last audit.** The field panel was answered at IT and built
at IV and IX. Two of `PRIORITY.md` section 17's rulings sit here.

32. **What "band" means.** He said at IW, "root is the band"; the shipped
   word "band" is the coherence level. Both cannot hold. `PRIORITY.md` 17,
   ruling 1, with the three ways and their costs.
33. **A floor at five on the heaviest rows.** His IW words, "everything above
   from 5 to 10", measured against the roster. `PRIORITY.md` 17, ruling 2.
34. **The Laws rename.** "Attunement... alignment behaviors... harmonic laws"
   (GO), to be simulated with the focus group first. (GO, HM)
35. **The rest of the field panel's questions** (HM), including the product
   wide cost of renaming seat and gate.
36. **Fringe behaviour**: direction survives a reload; fades on its own;
   reaches Frames and Dial; where "running hot" starts. (HH, HN)
37. **One word, two meanings**: "tension" for the Fringe signal and the
   susceptibility pulses; "collapsing" against his "collapsed". (GK, HH, HN)
38. **Name labels**: cursor radius against charge; direction changes the
   look; cursor size. (GH, GK)
39. **The glass bar**: DO's, DV's and ED's open questions; the glass carries
   no blur because law 7 forbids it, against his "not blurred, that's a
   fail". (DO, DV, ED, EY, DU)
40. **The dial and the zoom text**: Bar or Arc; names on zoom; pulses always
   or on a chosen chain. (FS)
41. **The CM six.** (CM)
42. **Three notes that did not land** at CR. (CR)
43. **Snow's black stage**, where names read close to invisible. (EM, FE)
44. **Three from FZ**: light overlaps; the Dial's core; how early feathers
   appear on zoom. (FZ)

### 2.5 The body map and pain

**New since the last audit:** JD, his observation that "The neck is for
navigation", filed into `BODY-MAP-SPEC.md` as a labelled personal
observation. No ask.

45. **Question A**: a bare point, a sized patch, a point inside a patch, or
   each address with its own fetter icon. (GV, HE, HR)
46. **The limbs**: pain only, drawn centres, or new addresses. (HE, HR)
47. **Confirm Isotherm** as the heat map. (HE)
48. **HR's four**: save painted pain per profile (a schema change, his); Pain
   twice on the tab; the phone Pain mode pushing the figure down. (HR)
49. **The spec's open questions**, including what "the hundred and eight
   chakras" refers to. IW's plexus count answered part of it. (GT, IW)
50. **How a seat's boundary is defined.** (BR, CG, CK, DJ)
51. **Addresses that share a real structure.** (BR, DD, CG, CS)
52. **The muscle reference image he said he would generate.** Owed by him.
   (CS)

### 2.6 The Story page, Source AI and the sniffer

53. **Which imprint view stays**, Lanes, Ring or Strip. Section 0, item 2.
   (IW)
54. **Bold or colour on the Story highlight.** The caret fix removed bold,
   reversing "Bold and coloured, ruled". Confirm, keep bold and accept the
   drift, or ask for a different editor. (HW, IL)
55. **II's four**: which layout on a desktop (H is in); the first screen
   control count past the team's floor, or one more tap; should Source AI
   follow up on a line that reads nothing; should "Martyrdom" print for a
   grief line. (II)
56. **Should a negated line charge imprints.** "I was not scared" is set
   aside by Source AI and still charged by `parseStory`. (HX)
57. **HO's questions**, the sharpest: may Source AI read earlier entries,
   and is "a pattern is what comes back" his scale. (HO)
58. **Three sniffer disagreements and two rulings** left at GR. (GR)
59. **Signal per pattern needs an authored trigger phrase list.** (HO)
60. **Truth Sniffer as a product name, a registered mark, or both.** (TS3)
61. **The sniffer canon, dormant since 20 September**: negation (still a live
   defect, AV1), who acted, a released charge, and the rest. (0u, SN8 to
   SN10)

### 2.7 The release and the ritual

**New since the last audit.** The spoken release shipped (IM) and the live
DQ count (JC). Then JF: "No, please review the original schematics for the
release protocol... This is a quality shot." What JF specifies, in his
words, is owed build work and needs no further ruling:

- The setup: "do you want to release 25 left and right, 50 left and right,
  or 100 left and right. And then the reframe is the opposite."
- His own voice opens ("hello, you're releasing this pattern, sit back and
  relax..."), then "After that, it's AI. And AI is reading the list."
- "The default should be four seconds between."
- "a running log of how long it's running", "a countdown... Every time you
  release one, it should tick down", and "The install should tick up".
- On completion: "you've released X number of patterns. You may not have
  felt them all, but the ones you did, mark to optimize for better
  performance", then "a two minute countdown".
- "At the end of that, the person should get a badge or reward." That part
  waits on the reward word, 2.2.

62. **The JF release, built to his schematic.** Above. Large.
63. **A run that would exhaust the allowance mid address**: stop at the
   address boundary, spending fewer patterns than remain, rather than
   between a release and its reframe. (IM)
64. **A release pick that writes more addresses than the run speaks**, so
   the number drops at the end for a release nobody heard. (JC)
65. **The release threshold**, `sq>=4`, measured on 20 September as leaving
   a large share of simulated people with a full reading and nothing to
   release. (0f, GP, HL)
66. **The ritual overhaul** he ordered at DU. Its question list was never
   dispatched. The 20 September ritual questions fold in here: RQ1, RQ2,
   RQ4, RB11q, RT9, RT21, CL12 to CL15, RC7, RB1y, RB8y.
67. **The channel line**: its length against the pace; whether the card shows
   it; which meaning keeps the word "channel". JF names the channels
   "parasympathetic and asympathetic nerves, left and right channels,
   masculine and feminine". (CI, CJ, JF)
68. **The binaural tone**: a pulse or a steady tone; a headphones and seizure
   line; a volume control. (BX)
69. **Four facts about his own history** the locked CQ formula rests on. IO
   confirmed the engine reproduces his stated range. (BE2, BE3, BE4, BE8,
   DJ, IO)
70. **Pin, trace and release**, held for a re-ask with pictures. Section 0,
   item 11. (DE, EE)
71. **"Released" or "Run complete"** on a finished run's card. JF's completion
   line may answer it. (EC, JF)
72. **Swipe triage for "I am" lines**, floated at DF, not ruled.

### 2.8 Knowledge base, Compass, Energetics and the rail

73. **Energetics: A, B or C.** Section 0, item 3. The older Staged against
   Tiles question is overtaken by it. (DZ, IT, IU)
74. **The Compass as wired: IP's three.** Section 0, item 4.
75. **The Flow element**, Pinch recommended. Section 0, item 5. (DZ)
76. **The Knowledge base's four.** (GW)
77. **The build stamp on his boot screen**; a phone reading as a sheet or a
   jump. (GY)
78. **Energetics name roots** against the standing "No etymology table"
   ruling. (DZ, DM, GE)
79. **The Reading card.** Its job is answered at IT: "tracking all the things
   that are the most intense to a person." Which door is primary and where
   the child stack goes are open. (DT, IT)
80. **The birth readings**: "Signs" or "Birth"; an approximate Rising; the
   zone table; untimed births; the `who.born.zone` field. (DG, DS, DL)
81. **The celestial rail's questions.** Section 0, item 15. (DO)
82. **Ruled, not built, from DU**: Knowledge base pages as character sheets;
   tooltips in two tiers; rails that fold; the Story page without its left
   rail (the IJ layout may have settled the last).
83. **The practitioner page.** First named at IB, "Oh, this is for the
   practitioner page", reading C's shell as suited to it. Not designed.

### 2.9 Onboarding and the tutorial

84. **"Pain and disease free"**, the last four words of his dictated opening
   screen. It promises a medical outcome on the first screen. (GS, GX, HK,
   HL)
85. **OB15 against FH for the onboarding tour.** (FI, `DECISIONS.md`)
86. **The tutorial is not built.** FN's and FI's questions stand, and D1, the
   onboarding questions sent 19 September, was never answered.
87. **The intake's explanatory panels**, removed at IF under his rule, had a
   measured completion lift behind them. Kept open. (IF)
88. **"The mobile version, the React version"** (GF), asked back and never
   answered. IZ confirmed the phone view already loads every profile.

### 2.10 Copy and the voice rules

89. **Load words**: "impaired" or the curve words; the drafts or his
   "paralyzed"; beside a bare number or not. (GG4, HK)
90. **Click or Press.** (HK)
91. **`DESIGN-tooltip-copy.md`**: its open questions, and whether to install
   the objection rule it proposed. IF installed a different one,
   `section-explains-itself`. (FW, GG, GB, IF)
92. **The refusal line**: now silent in the build (IF). Whether that is what
   he meant is not recorded. (GS)
93. **The mirror**, adopted at IT: "a mirror that shows you what's running
   your show." Closed for marketing; logged so it is not asked again.

### 2.11 Canon and the model

94. **CQ or expression** for the tier word, the marketing harm guard and the
   clinician referral. (BB3, BB5, FG, FI, FL)
95. **`Root_08_Unnamed` gets a fetter**, or the top of the scale stays
   unreachable. (`CLAUDE.md`, KU13)
96. **Schema v2, the seed decay policy, and whether the kink sits at the
   highest charge or the lowest.** His, per `CLAUDE.md`.
97. **The legal copy claims**: "heals" (PO2), the therapy comparison (D10,
   printed on the Billing screen), chakra colour as a system (CH5).
98. **The child pattern**: which reading defines one. (CP4, CP5)
99. **The films.** (VID1, D3, D4, D5)
100. **The spec files** pushed; E43; which way malignancy counts. (SP12 to
   SP16)
101. **The safety referral thresholds.** Tied to CQ or expression above. (SF6,
   BB5)
102. **D11, the opening surface.** The last audit closed it on GH's words; IC
   found that weaker than it looked, and the Bible holds it open. Reopened
   here. (IC)

### 2.12 Pure design preference

These change how something looks or feels and block nothing.

103. **The boot**: its length as built against the 7.2 seconds once ruled;
   squash and stretch; what replaces the gold halo. (ET, EX, FC)
104. **Frames and Dial at rest.** (EQ, ET)
105. **Lumen**, his own palette, under its contrast floor. More versions of B
   and C asked (DY). **Owed by the team, never delivered.**
106. **The logo**: favicon, the top bar cut, tracking, a ligature, the hex
   values. His IT line, "I like what you did with the Atuned logo, very
   surprising", is the only word since 21 September. (FV3, TR6 to TR14, IT)
107. **Phone Dial names**, names over the drawing on a plate, and major marma
   points drawn larger. (CW, CV)

### 2.13 Parked by him on purpose. Do not ask.

- **The funnel**, and with it `funnel-copy`, the name and email capture, the
  mission line, the funnel to social plan and the founding offers. "Don't
  touch the funnel. That's a waste of credits." (IB) IQ asked marketing for
  funnel content from his release mechanism notes; that is marketing's
  file, not a funnel build.
  **No longer parked, checked 30 September.** He restarted it: round LJ
  built the quiz's story step and door (`ac7e067`), round LW ruled "the
  landing page is the funnel", and round MU gave its storyboard with "Add
  this to the plan." The founding offers are not restarted by any of those.
  The funnel's open lines are `PRIORITY.md` section 19, cluster E.
- **Clinicians.** "So don't ask me until fucking then." (BU)
- **The admin interface**, future development. (BF1)
- **The Link game.** (BV)
- **Two factor sign in**, handed to his own systems engineer. (EZ)
- **Accounts, paywall, founding offers and push**, sequenced last on his 25
  September ruling.

### 2.14 Owed by the team, no ruling needed

- **`atuned_src/ui/intakeui.js:334` marks a scale point only on an exact
  match** (`v===n`). Reference answers are decimals, so every scored law
  opens looking unset. Found at IU, not fixed.
- **Long address names truncate on the Reading card at 1600** now that
  "Secondary" and "Tertiary" are wider. A one line fix. (JB)
- **"Martyrdom" printed for a grief line**, the reading `CLAUDE.md` names
  as an insult. (II)
- `reboot-os` serves the lexicon and every canon table to anyone. Fix
  before any deploy. (HF)
- `boundaryCross` (`engine/avatar.js:105`) matches "team" to community,
  returns only the first side, and has no pattern for "coach". (GJ, GP)
- A phone tap on the Field picture or a Knowledge base row opens its reading
  far down the page. (GM, GY)
- The Knowledge base's third column clips its percentages at desk width.
  (GY)
- BO6: another profile shows your own gate readings, and undo keeps them.
  (DG)
- GP's sweep list, checked against IF's sweep before redoing.
- The paywall screenshots from HL, committed.
- Four versions of Kerf (KF2) and more Lumen versions (DY).
- **Rebuild `container`, `quotients` and `pattern-signal`** against a
  single file so they open on their own. They load a sibling `engine.js`
  today. (IH held back files for this reason.)
- **Record what is sent.** IH sent files without naming them, and IW
  resent two questions without naming them. Both left this page guessing.
- No continuous integration. `.github/workflows` does not exist.

### 2.15 The 20 and 21 September question ledger

`TASKS.md` carries **155 lines marked `[?]`**, read off the file today,
all written 19 to 21 September. `QUESTIONS.md` lists them, still stamped 21
September. Every round since asks in prose.

**29 of them were overtaken by a later ruling** and should be closed
with the ruling named. D11 and its twin are no longer in this list: IC found
the close weaker than it looked.

| Lines | Overtaken by |
|---|---|
| MS24 | GG and CH: 8-bit pixel masks |
| RV7, RV13 | 089 RF12, "use a temporary AI voice font"; BX, the live binaural tone |
| SN5, SN6 | `DECISIONS.md`, "One CQ. Ruled 25 September" |
| CB4 | 0j2 CF4 and 0f2 SA5, the saturation ruling |
| FW10 to FW14 | BW and CB: feathers by seat |
| AH5, AH6, AH7, the feathers line at 0c | BW and CB; 0o VB1, "vibrancy and vital energy are tied together" |
| LD9 | AY1 and BE1: a release no longer lowers CQ |
| SQ1 to SQ5 | IJ: the Story page rebuilt and wired |
| TP10 to TP13 | FS: one renderer for orientation and balance |
| SW6b, SW10 | 0h: Atmosphere rejected; Console never built |
| IJ1 | FY and HG: the avatar hero story |
| MN8 | DK and EY: the glass bar replaced the secondary nav |

The rest are dormant. The live ones are carried above. Closing the others
with a reason needs no ruling from him.

### 2.16 Records that say something false or leave a gap

- `QUESTIONS.md` is stamped 21 September and does not mark the overtaken
  lines above.
- `TASKS.md` round IH does not name the files it sent, and round IW does
  not name the two questions it resent. 2.14.
- Checked and now true, since the last audit flagged them: `STABILITY.md`
  closes undo and Google Fonts and keeps continuous integration open;
  `BOOK-ERRATA.md` marks items 25 and 26 overtaken and 27 ruled six;
  `MILESTONES.md` no longer heads a section "The fork, still yours".

---

## 3. Asked more than once, and still without a ruling

The count is the number of rounds listed beside it, computed.

| Ask | Rounds | Times |
|---|---|---|
| Cloudflare or Supabase | AW1, GX, HA, HB, HD, HF, HJ, HL, HP | 9 |
| Make the repository private | GZ, HB, HJ, HL, HP, IE | 6 |
| The reward word, and whether marks pay out | 0f, 0k, PRIORITY Q4, GP, GW, HL, PRIORITY 17 | 7 |
| Which product goes online first | HA, HB, HD, HF, HJ, HL | 6 |
| CQ or expression, for the tier word, harm guard and referral | BB, FG, FI, FL, DECISIONS | 5 |
| Twelve archetypes or eighteen | GU, HC, HQ, HL | 4 |
| How a seat's boundary is defined | BR, CG, CK, DJ | 4 |
| Rebel or Outlaw | GU, HC, HQ | 3 |
| The release threshold, `sq>=4` | 0f, GP, HL | 3 |
| "Pain and disease free" | GX, HK, HL | 3 |
| "Tension" naming two things | GK, HH, HL | 3 |
| Question A, "with the icon of the fetter" | GV, HE, HR | 3 |
| GitHub Actions billing on `reboot-os` | AW2, GX, HJ | 3 |
| The boot's length | ET, EX, FC | 3 |
| Four facts about his own history | BE, DJ, DECISIONS | 3 |
| Which Energetics layout | DZ, IU | 2 |
| What counts as a pair cleared | EL, HL | 2 |
| Lead with the stated ideal or the heaviest | FB, GJ | 2 |
| The Boundary's side names | BV, CC | 2 |
| Address 25, a structure only in female anatomy | BR, DD | 2 |
| The Laws rename | GO, HM | 2 |
| `Root_08_Unnamed` | Backlog section C, KU13 | 2 |

Cloudflare or Supabase, which product goes online first, and the
repository's visibility are what section 2.1 and his OAuth question at IE
wait behind. The visibility is the only item on this page that is live
exposure every hour it stays open.
