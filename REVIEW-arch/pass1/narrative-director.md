# Pass 1, narrative director (June Okonkwo-Lund). Areas 4 and 5, as words.

Round PK, 2 October. Read first: BRIEF.md, OWNER-INPUT.md, reviews/LEGAL-floor.md, PRIVACY-BREAKDOWN.md, CONSUMER-HEALTH-DATA.md, FEELINGS-WHEEL.md, SNIFFER_SPEC.md, TDD-sniffer.md, DESIGN-sniffer.md, SOURCE-TDD-release-intelligence-v2.md section 9, and the sniffer recommendation with its distress reader, which lives only on branch `worktree-agent-a6d4e60928876b711` (`atuned_src/engine/distress.js`, 292 lines, commit `c1cbc1a`). It is not in `atuned_src/MANIFEST` on this branch. The core strings in blocks A and B were run through `check.py --line` (24 lines). None has a hard failure. The grammar and the crisis lines were not checked against a clinician. The prose is the audit. The copy blocks (A, B, C) are the deliverable and are not counted against the length.

## GRADE: 57/100 for area 4 (safety gate), 63/100 for area 5 (privacy), as words

The proposal is right about both. Neither area has the words yet. Safety has one reader on an unmerged branch and no strings for six of seven states. Privacy has a good one page draft that contradicts the build in four places.

| Criterion | /10 | Evidence |
|---|---|---|
| Is it true, pass one | 6 | Block C line "Nobody reads what you write here. It stays on your device" goes false at sign in, because the account copy includes story text (DECISIONS.md round PD). `PRIVACY-BREAKDOWN.md` "Us: Not your stories" sits beside `CONSUMER-HEALTH-DATA.md` "we hold the key". |
| One bucket per string | 7 | `distress.js` already splits lead, lines, keep. Block B mixes a definition, a refusal and an instruction in one sheet. |
| Fits the voice | 6 | Block B is built on "It is not", which `COPY.md` rules against. The distress lead "What you wrote sounds like a lot to carry" narrates feeling instead of giving the words back. |
| Seven states covered | 3 | Crisis only, English only, on a branch. Nothing for activated, trauma, medical, substance, abuse. |
| Sensation rule in shipped copy | 4 | Four live lines state a cause (list in area 4 below). |
| Data boundary in ten seconds | 6 | The breakdown is 661 words, about 2.5 minutes. Right content, wrong length. |
| Failure copy | 4 | Nothing says what the reader got wrong or missed, and nothing covers a false alarm. |
| ICP test | 5 | Derek and Angela read a card in the quoted-words form fine. James, defended, reads "sounds like a lot to carry" as being handled. Acute distress needs the shortest card. |

## AREA 4, safety gate

**Exists today.**
- `distress.js` (branch only): graded reader, levels none, concern, urgent, with a phrase table. Measured by its author: 31 of 33 on the set it was tuned against, 5 of 18 cold. The honest figure for a phrase nobody anticipated is about one in four. English only. See its header for what it cannot know.
- `reviews/LEGAL-floor.md` blocks B and C are drafted and not built. Main has no "988" and no "in danger" in `atuned_src`.
- Guards in `SNIFFER_SPEC.md` section 11: no diagnosis, never score the other person. `verp.js` line 243 chooses its asymmetry so a survivor is never read as malignant. That is a copy rule too, and it is the best sentence in the repo about care.
- The somatic rule is already written: `SOURCE-TDD-release-intelligence-v2.md` section 9, "Do not infer causality merely because a somatic sensation changed during a release."

**Adds that is new.** Five states the sniffer does not read at all (activated, trauma, medical, substance, abuse), a precedence rule so one entry gets one card, and the sensation rule applied to every surface and not only the release.

**Conflicts.**
- Block C's permanent line under the composer. Struck by the owner ("Safety line, no", TASKS.md round OX). Keep the Help sheet version, which is not permanent on a screen. I decided this; he can overrule it.
- Block C last line "Put the instrument down and use it" says the opposite of the owner's instruction to offer to keep writing. Cut. `distress.js` already cut it.
- Block B "A reading, not a diagnosis. This is not medical care." defines by what it is not, against `COPY.md` round GG. Replacement below. The legal content survives.
- Four shipped lines assert a cause about the body or the person: `summary.js:254` "means something was installed on top of the blueprint", `summary.js:293` "is blocked by the same charge named above", `summary.js:318` "which means it is expanding", `drills.js:1348` "which means something was installed". And the held-open word "impaired" in `COPY.md`, and the owner's own "open, impaired" on the Flow layer (`map.js:2185`).
- A `Victim` or `Martyr` saboteur, an `Overindulgence` law reading, or a Dante circle name printed on an entry about abuse or drinking is a label with no direction out. It is a judgement.
- `LEGAL-floor.md` prints "Tool of Unified LLC" in blocks A and D. The company is Tula Unified LLC (CONSUMER-HEALTH-DATA.md, BRIEF.md). The first reads as a dictation error. Fix before the footer ships.

**MVP cut.** Crisis (both levels), medical, substance, abuse as static cards with quoted words. Possible trauma as a withdrawal of body steps and labels, with a one line card. Activated as pace only. All seven string sets are in block A. Later: locale lines beyond the US, a quick exit, entry level delete.

**Size.** Strings: S. Wiring the quoted phrase back: M, because the reader returns the normalised cue (no apostrophes, lower case) and the card needs the person's raw span. Merging `distress.js`: M. States 3, 5, 6 and 7 need detection, which is not mine and not small: L.

## AREA 5, privacy

**Exists today.** `PRIVACY-BREAKDOWN.md` (661 words), `PRIVACY-POLICY.md`, `CONSUMER-HEALTH-DATA.md`, and `accPrivacy()` in `ui/account.js` ("We never sell anybody's data. Ever." plus a held list).

**Adds that is new.** A boundary the person can read in ten seconds, that changes with their state (device only, signed in), and says what a delete does in the same breath. A separate consent line for the locked copy. A line on a shared device, which none of the drafts carry.

**Conflicts, all of them about whether the words are true.**
1. "We do not use it to train any model" (breakdown) against the toggle "Use my stories to refine the reading" in `accPrivacy()`. DECISIONS.md says research sharing is off and not offered at launch. The toggle should not exist at launch. A string that should not exist.
2. "Us: your account, plan and log. Not your stories." The server holds the stories, locked, and we hold the key (CONSUMER-HEALTH-DATA.md section 4, DECISIONS.md). Replacement below.
3. "Your name stays on your device" while name meaning sends the name to Anthropic. True only with the exception beside it.
4. Words: passphrase against Password (the build), username against Email (the build), "record", "account data", "profile" and "copy" used for one thing. One word per concept. Fixed set in block C.
5. Dormant deletion at 24 months, with a warning 30 days before (DECISIONS.md), is in no reader facing draft.
6. A story can hold another person's name. It goes with the story. Nothing says so.
7. Push text appears on a lock screen. No draft rules on what it may say.

**MVP cut.** Block C text, the consent line, the toggle removed, vocabulary fixed. Size S for the strings, M for state aware rendering. Counsel reads every line marked [CHECK].

## THE SENSATION RULE, as copy (applies to every surface that interprets)

Rule, one sentence for COPY.md: **A sensation is a report. It is never a cause, a sign or a result.** Surfaces it binds: Summary, Mirror, Body map and its tooltips, drills, release before and after, Ritual, Source AI questions, practitioner panel, daily note, push text. Grammar: the subject is the person, the verb is a report verb (wrote, marked, reported, noted), the object is what and where. Words that may not join a sensation to anything: means, shows, proves, indicates, caused, because, due to, from, blocked, stuck, trapped, stored, holds, healed, cleared. "Held" stays only as the engine's measured word for an address at 4 or over, never for a feeling in a body part. Before and after are written as order, never as effect.

| Do not print | Print |
|---|---|
| This means your heart seat is blocked. | You marked tight, in the chest, at 7. |
| The release worked. The tension left. | Before the release you marked 7. After it you marked 3. |
| Your throat is storing what you could not say. | You marked pressure in the throat. You wrote "I could not say it." |
| A load of 1.9 means the nerve is mildly impaired. | You reported a load of 1.9 here. The instrument did not test the nerve. |

Standing definition, on demand, on the Body page and every tooltip that places a mark: **A mark is what you felt. It is not what caused it.**

On the Flow layer the owner's words open and impaired stay. One line under the layer, as a Definition: **Open and impaired describe the load you reported at this nerve. They are not a test of it.** This keeps his word and bounds the claim.

The four live lines, rewritten:
- `summary.js:254`: "A blueprint that says X and a field that runs Y means something was installed on top of it." becomes "The blueprint says X. The field runs Y. These differ." Whether anything was installed is a hypothesis. It does not belong in a Reading until the ledger can show the chain.
- `summary.js:293`: "is the part still blocked, and it is blocked by the same charge named above" becomes "The charge named above sits under this one."
- `summary.js:318`: "which means it is expanding" becomes "This leans toward expanding."
- `drills.js:1348`: "They do not, which means something was installed on top of the blueprint." becomes "They differ."

Link to area 3: the six evidence types get six fixed lead verbs, one per concept. You wrote. The instrument read. The instrument infers. You reported. You marked. You confirmed. A conclusion string that cannot start with one of these does not ship.

## RISKS

- Silence is read as clearance. The reader misses about three in four phrases it has not seen. No string may say the product watches for danger. A person who writes something it misses must never read the quiet as "you are fine". The fix is one line in Help, never on the composer: **It reads English and it misses things. Nobody is watching as you write.**
- A false alarm stops a release the person wanted. Scope the withdrawal to the entry, never to the person, and say so on the card ("on this entry").
- Quoting a method back. Never quote a cue that names a method (pills, overdose, cutting). The reason line stays and the quote goes.
- Self diagnosis from the wheel. "Violated", "Victimized", "Numb", "Helpless" are family words on the owner's wheel. A word alone does not move a state. The sniffer seat decides what evidence moves one.
- Abuse on a shared device. The device keeps what was written. Entry level delete does not exist (profile delete does). Without it the abuse card promises a thing the product cannot do.
- Practitioner sight changes the truth of "nobody reads this" for everyone with a grant. The crisis card must read the grant state. If crisis alerts to a practitioner are ever built, the card changes with them.
- Legal drift: Block B on a sales page is an efficacy claim risk per LEGAL-floor section 2. Nothing here addresses it.

## RECOMMENDED ORDER (areas 4 and 5, words)

1. Fix the false lines: toggle removed, "Not your stories" replaced, "Tool of" corrected to Tula, four causal lines rewritten. All S.
2. Vocabulary table, block C, into `COPY.md`. S.
3. Merge `distress.js` and put the quoted phrase on its output. M. Then the crisis card, both levels.
4. Medical and substance cards with fixed trigger lists. S words, M wiring.
5. Abuse card, after entry level delete exists. M.
6. Possible trauma and activated, once the sniffer seat names the evidence that moves a state. L.
7. State aware boundary line and the separate consent line, with the account flow. M.

---

# BLOCK A. The seven care states, as the person reads them

Rules for all of them.

- The person never reads a state name. "Crisis", "trauma", "substance", "abuse" are internal and never printed. A state name on a person is a label with no direction out.
- Banned in every care string: disorder, addiction or addict (outside the person's own quoted words), alcoholic, abuser, victim, trauma, PTSD, depression as a condition, symptom, episode, suicidal outside a quote, "you are", "you have", "we", sorry, please, an exclamation mark, an emoji.
- Each string is one bucket. R reading, F refusal, I instruction, M menu, D definition. A card is composed of strings. Highest state wins and one card shows. Order: crisis, abuse, medical, substance, possible trauma, activated, ordinary.
- `{q}` is the person's own words, the raw span, at most 12 words. Dropped when the span names a method. When dropped, the R line becomes "You wrote about hurting yourself."
- Buttons are one word where one word is enough. Call and Text open `tel:` and `sms:` with the number printed beside them, since a desktop has no dialler.
- Withdrawals are scoped to the entry: "on this entry".
- Reading level: grade 6 or lower. Every card is under 45 words.

## 1. Ordinary

Nothing. No card, no label, no line of comfort. "That sounds hard" and "It is okay to feel this" are soft wellness language and are not printed. A person who wrote that they are mad about their boss gets the instrument.

## 2. Activated (high charge, no cue for any other state)

The release stays open. Only the pace changes.

    R   You wrote "{q1}" and "{q2}".
    I   Go one line at a time.
    M   Pause

Old (shipped release start, no pace line): none. Reason: a hot entry is the product's raw material. A refusal here would punish the person for using it. The Pause menu word saves the entry and returns to the Field.

## 3. Possible trauma (cue words or a past harm frame, no danger now)

Body steps and labels withdraw. Writing stays.

    R   You wrote "{q}".
    F   The body map and the release stay closed on this entry.
    D   Going into the body on an entry like this is better done with someone trained for it.
    I   Stop here if you want. The entry is saved.
    M   Continue   Stop   Help

Reasons. Quoting the person's words is the only reading that cannot be wrong. The body steps close because attention turned inward can overwhelm; the D line says it as a limit of the instrument, not a fact about the person. No saboteur, complex or mask label prints on this entry. "Victim" printed under an account of something done to the writer is the worst line this product could produce, and `verp.js` already refuses the equivalent in the empathy channel. Help opens block B and the line "A doctor can refer you to a therapist who works with this."

## 4. Crisis (self harm or wish to die in the writer's own words)

Urgent (any active, passive or burden cue, or two soft cues):

    R   You wrote "{q}".
    I   Call or text 988 now.
    I   Outside the United States, call your local emergency number.
    F   Nobody is watching as you write. This is not an emergency service.
    F   No release is offered on this entry.
    M   Call   Text   Continue

Concern (one soft cue: leave, cant, hopeless, point, weak burden):

    R   You wrote "{q}".
    I   If you are thinking about ending your life, call or text 988.
    F   No release is offered on this entry.
    M   Continue

Old: "What you wrote sounds like a lot to carry." (`distress.js` DISTRESS_LEAD) and the stack of block C lines. New: the person's own words first. Reason: a feeling named by the product is a guess. A quote is a fact. The conditional on the concern card lets a person who meant a bad day say no to it themselves, which is how the card stays honest when the reader is wrong. The 988 line follows safe messaging: no method, help exists, no "committed". Add one fact line, as a Value: **Someone answers day and night.** If signed in with a practitioner grant, line F becomes "{Name} can see your entries. They are not watching as you write." Never print "Nobody reads this" in that state.

Other locales, to verify before use: Canada 988. United Kingdom and Ireland, Samaritans 116 123. Australia, Lifeline 13 11 14. Counsel confirms each.

## 5. Medical (acute symptom language, or a stopped or changed medicine)

The body mark is recorded as written. No seat or address is assigned and no cause is offered.

    R   You wrote "{q}".
    F   The instrument cannot tell what causes a pain. It reads what you wrote.
    I   If it is sudden or severe, call your local emergency number.
    I   If it keeps coming back, tell your doctor.
    M   Continue

Medicine variant, replacing the last two I lines:

    I   Ask the person who prescribed it before you change a dose.

Reasons. "My chest gets tight" with a context ("when I think of my boss") is a normal somatic observation and triggers nothing. Sudden, severe, new, "can't breathe", faint, numb face or arm, bleeding, or a stopped medicine are the triggers. Two I lines are an exception to one step per instruction, because the instrument cannot know which applies. One is shown for each row. This is block B's "reason to stop a treatment" line made specific.

## 6. Substance (the person names alcohol or drugs as a problem)

    R   You wrote "{q}".
    F   The instrument does not name what this is. It reads what you wrote.
    I   A doctor or a counsellor can assess it. In the United States, the SAMHSA helpline is 1-800-662-4357, free, any hour.
    I   If you drink or use every day, ask a doctor before you stop. Stopping fast can be dangerous.
    F   No release is offered on this line.
    M   Continue   Help

Reasons. "I am addicted to alcohol" opens a pathway and never becomes the product's sentence. The instrument does not say disorder, dependence or addicted. It quotes. No release on that line, because "I am releasing believing that I am addicted" invites denial. The `Overindulgence` law reading and the `Escapist` and `Avoider` saboteurs do not print on this entry, and the Dante circle names do not print anywhere in a care state. [CHECK: SAMHSA number and the stopping line, a clinician reads both.]

## 7. Abuse or immediate danger (present tense harm to the writer, or to someone near them)

    R   You wrote "{q}".
    I   If you are in danger now, call your local emergency number. In the United States, call 911.
    I   In the United States, the National Domestic Violence Hotline answers at 1-800-799-7233, or text START to 88788.
    D   This device keeps what you wrote. If someone else can open it, delete this entry.
    F   No release is offered on this entry.
    M   Call   Delete   Continue

Past tense ("he used to hit me") steps down to state 3, with the same rule as `distress.js`: urgent kinds drop one step when said of the past.

Writer is the one causing harm ("I hit my kid"):

    R   You wrote "{q}".
    I   If you are afraid you will hurt someone, move away from them now and call 988.
    F   No release is offered on this entry.
    M   Call   Continue

Reasons. The Delete menu word needs entry level delete, which does not exist yet (area 5 risk). Until it does, drop line D and the Delete menu word. Do not print a line the product cannot back. Never print "abuser", "victim" or "survivor" as a label on the person. [CHECK: both numbers, and the harming line, with counsel and a domestic violence advocate.]

## The Help sheet, which is the one place the limits live

Replaces block B. Nothing permanent on the composer. Reachable from Help and from the Help menu word on cards 3 and 6.

    What this is
    A self report instrument. You write. It reads charge out of what you wrote
    and shows where it sits. It did not scan you or test you.

    What it does not do
    It does not diagnose. It does not treat. It is not a doctor, a therapist or
    a prescription, and it is not reviewed by the Food and Drug Administration.
    If you are under care, stay under it. Do not stop a treatment or change a
    dose because of a reading.

    What it misses
    It reads English and it misses things. Nobody is watching as you write.
    If you are in danger now, call or text 988 in the United States, or your
    local emergency number.

Old: block B's six paragraphs built on "It is not". Reason: the same legal content in the voice, with one bucket per paragraph. [CHECK: counsel reads the third sentence of "What it does not do".]

---

# BLOCK B. The sensation rule, ready for COPY.md

Put under "Things we never do":

    Print a cause for a sensation. A sensation is a report: you marked it, you
    wrote it, you said it changed. It is never a cause, a sign or a result.
    Say who reported it, where, and at what size. Say before and after as
    order. Never say because, means, from, blocked, stored or healed.

Check line for `objections.json`: any string that joins a body word (chest, throat, gut, tight, tension, pressure, ache, numb) to means, shows, proves, indicates, because, due to, from, blocked, stuck, trapped, stored, healed or cleared fails. Write the gate and run it on the existing build first, so it is proven on a known bad case: `summary.js:293` should fail.

---

# BLOCK C. The data boundary, in words a person reads in ten seconds

Ten seconds is about 40 words. The three lines are always the same three labels, so the eye learns the order. Two states, because the truth changes. The state shown is the state the person is in.

Fixed vocabulary, one word per concept. **Record**: what is on this device. **Account**: the sign in. **Copy**: what we hold. **Delete**: the only verb for removing. **Password**, never passphrase. **Email**, never username.

## Device only (never signed in)

    Stays      Everything you write and every reading. On this device, in this browser.
    Leaves     Nothing.
    Delete     Delete this record. It is gone at once. There is no copy.

Fifteen words under the labels. One more line, as an Instruction, shown once at the top of the Privacy page and again before the first export: **Clear this browser's data and the record is gone. Export a file to keep a copy.**

## Signed in

    Stays      Your name and birth details. On this device only.
    Leaves     Your answers, your stories as you typed them and your readings. A locked copy sits on our server. We hold the key. Support tools do not open it.
    Delete     Delete the record here at once. Delete the account and the copy leaves our live system at once. A locked backup is overwritten after 90 days.

About 55 words. Over by 15. The cut is the second sentence of Delete, which moves to the on demand layer below. The boundary is the first two labels.

On demand, as Definitions, one per tap, under "Leaves":
- **Stories.** A story goes as you typed it. If you wrote someone's name, the name goes with it.
- **Voice.** If you dictate, your browser sends your voice to its maker. We never receive it. Type and nothing is sent.
- **Name meaning.** Your name goes to us and then to Anthropic, only after you say yes.
- **Payment.** Stripe takes the card on its own page. We never see the number.
- **Morning note.** Your browser's push address and the hour you chose. The note never carries your reading. It says a time and nothing else.
- **Sight.** Nobody sees this record but you. A practitioner sees it only after you say yes. Each yes is listed by name, and one press takes it back.
- **Time.** If you do not sign in for 24 months, we delete the copy. We email you 30 days before.
- **Sold.** We never sell anybody's data. Ever. We do not share it for advertising.

Old: "Us. Your account, plan and a log of account events. Not your stories. Stored records are scrambled, and our support tools do not open them." New: "A locked copy sits on our server. We hold the key. Support tools do not open it." Reason: "Scrambled" is a second word for locked, and "not your stories" is false by omission while the key sits with us. The new line states what is true and stops. [CHECK: that support tools cannot open it, a technical seat proves it.]

Old: "We do not use it to train any model." Keep it, and remove the toggle "Use my stories to refine the reading" from `accPrivacy()` at launch. Reason: the toggle says the opposite and research sharing is ruled off.

## The separate consent line (Washington and Nevada, and the cheapest honest line for everybody)

Its own box, unchecked, apart from the terms box and the age box.

    [ ] Keep a locked copy of my answers, stories and readings on your server, so I can get them back.

Three boxes, three sentences, never bundled:

    [ ] I am 18 or older.
    [ ] I accept the Terms.
    [ ] Keep a locked copy of my answers, stories and readings on your server, so I can get them back.

Withdraw, a Menu word on the Privacy page with its consequence in the row beneath it:

    Withdraw      Your copy leaves our live system. This record stays on this device.

Old: CONSUMER-HEALTH-DATA.md section 5 "ticking the box when you create an account" (one box, unspecified). Reason: the draft itself flags the question. A separate box costs one line and removes the argument. [CHECK: counsel confirms.]

## What the lock screen may say (push text)

    Ritual at 8.

A time, a verb, nothing about the person. Never a reading, a name, an address, a feeling word or a state. Anybody who picks up the phone reads it.
