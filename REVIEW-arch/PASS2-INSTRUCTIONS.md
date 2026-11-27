# Pass 2: collaboration (round PH)

You have already written pass 1. Now read EVERY report in `REVIEW-skin/pass1/`
(eleven or twelve files; the QA measurement report may land while you work, read it
if it is there). Write `REVIEW-skin/pass2/<your-seat>.md`, under 1400 words, plain
short words, no em dashes, each term of art explained in the same sentence.

Do these, in this order:

1. AGREEMENTS. Findings two or more seats made independently. Name the seats. These are
   the strongest signals. Known already, confirm or correct: the avatar is not the
   centrepiece on screen (Character tab locked and empty, Avatar tab has no figure); the
   loop is drawn as a row of four, not a circle; the seven seat hues carry many meanings
   (colour collisions, CQ painted in two colour languages); about 30 to 43 font sizes and
   no type scale; Start Case labels vs the sentence case ruling; locks read as a shop
   (about nine padlocks on the first Field screen); the unread state prints verdicts and
   has no promise; the 390 wide "not read yet" pill overlaps the zoom buttons.
2. DISAGREEMENTS. Where another seat contradicts you or another seat, say who, what, and
   which side you take and why. Examples to settle: should the avatar sit behind a tier
   lock; is the ring-shaped loop nav a skin or a redesign; is the Source OS wordmark
   contrast a defect or an owner ruling; do seat hues keep their place meaning
   (a ruling: "hue is the language and does not move") while state colours separate.
3. WHAT I MISSED. Things you did not see in pass 1 that another seat saw and that
   change your discipline's grade or recommendations.
4. THE ARCHITECTURE, TOGETHER. Propose your part of ONE merged architecture, written so it fits with the
   other seats' parts: tokens (type scale, radii, colour roles, motion verbs), symbols,
   copy rules. Be specific: values, not adjectives. Say what must be agreed with which
   other seat before it can be built.
5. REVISED GRADE: `GRADE: NN/100` (was NN). Say what moved it and why.
6. TOP 5 RECOMMENDATIONS for your discipline, ranked, each S/M/L, each naming which
   ICPs (ideal customer profiles, the kinds of person we build for) it moves.
7. ONE QUESTION for the owner only if you are truly blocked. Otherwise write "none" and
   state your decision and your reason. (The owner ruled: seats decide, he is tired of
   questions.)

Facts that are rulings, not arguments: sentence case is the rule in CLAUDE.md. A recorded
ruling at DECISIONS.md around line 353 asked for Start Case on some labels and the CSS
follows it; treat the two as in conflict and RECOMMEND which wins, with the reason.
Write only your own file. Read only otherwise.

## Round PK specifics (settle these; each seat gives its side and a reason)
Read every report in `REVIEW-arch/pass1/` (nine; the QA one may land while you work).
Agreed already, confirm or correct: the "an inference never becomes a fact" rule already
exists three times in the code (`TRACE_PROMOTE`, `TRACE_CAUSE_SRC`, `dlyGroundOne`); the
competition between modules is duplicate code, not autonomous agents; nothing screens
text for distress at runtime (the reader on branch `worktree-agent-a6d4e60928876b711`,
commit `c1cbc1a`, is unmerged); typing is already over its frame budget so new reasoning
runs on commit, never per keystroke; a server owned meter cannot work because all
content ships in one file; the proposal's "Sight is not for sale" is stale (reversed 1 Oct).
Settle: (1) the evidence ledger as a DERIVED VIEW over the four existing stores (practice
evidence, trace edges, practice log, daily resolve) vs a new store; (2) a hypothesis object:
a `proposed` trace edge plus a declined list, or cut it (creative says cut the ranked list);
(3) "next best action": a prescription, or one slot called Next in the person's own
words; (4) the 90 day engine: gates on access (game and creative say no) vs a derived read
that only orders one suggestion; days never shown; (5) safety: seven content states vs four
response levels vs three outcomes (ordinary, strong, needs a person now) and the wording of
each; which states have no detection yet; the clinician review dependency (decide an interim:
build now with a conservative recall leaning list, flag clinician review as a pre public
launch gate, say whether that is acceptable); (6) entitlements re-cut onto the SIGHT table:
the five verbs, the downgrade latch (opened ground kept, layer sight latched or not);
(7) server work in reboot-os: what to build and what to defer (deploy first, then clamp
`granted`, lease, base on tier change, one live subscription, free banking cap);
(8) the record: carry unknown top level keys through `validateProfile`, run `addrs`,
declined list, side stores into the record, import id duplicates; whether a schema bump is
needed (systems found none); (9) names: orchestrator vs "reading rules", ledger vs "the trace",
JourneyState vs "where the loop is", verified vs "held" or "confirmed"; (10) privacy: the data
boundary lines, the "Improve the Models" toggle, deletion holes, encrypted export; (11) the
order of the work, and MVP vs later.
Section 4 is ONE merged architecture and ONE build order of slices.
