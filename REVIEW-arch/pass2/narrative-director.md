# Pass 2, narrative director (June Okonkwo-Lund). Round PK, 2 October

Read: BRIEF, PASS2-INSTRUCTIONS, my pass 1, and all seven other pass 1 reports and four pass 2 reports now in `REVIEW-arch/`. Checked in the repo: `ui/account.js:424`, `ui/summary.js:236-318`, `ui/drills.js:1348`, `ui/storyui.js` (it calls `SpeechRecognition`), `PRIVACY-POLICY.md:166`. Every string in the blocks was run through `check.py --line`. One hard failure: the caps rule on the hotline keyword START, which is the hotline's own word and stays in quotes. Counted prose is under 1400 words. The string blocks are the deliverable and are not counted, as in pass 1.

## 1. Agreements

- **No day, no "of 90", no stage word on screen.** Creative, UIUX, game, me. A count against a total is a score.
- **Never store a care result.** AI, systems, creative, technical, me. A stored crisis flag is health data. My strings read the screen result passed in, never the record.
- **Nothing screens text for distress.** All seats. The words for it are below, and they did not exist.
- **The ledger is a view.** All seats. Screen name: there is none. The person taps Why and sees their own words.
- **A confidence number never reaches a screen.** AI, systems, UIUX. A count a person can check replaces it.
- **Four shipped lines state a cause.** Creative confirms and adds the sweep to its slice 2. Systems and technical confirm the false privacy lines (the toggle, "Not your stories").
- **One word: Confirmed.** UIUX proposed it. Creative conceded `held`, because `held` already means an address at 4 or over. Systems, game and technical agree. I agree.

## 2. Disagreements

- **My own "The instrument infers".** The gate flags `infers` as abstract, and a ten year old would ask. The lead verb becomes **guesses**. It is plain, and it carries the humility the voice asks for.
- **UIUX and creative: "Keep writing".** Two words. My ruling is one word per menu item, so the button is **Continue**. It sits beside **Call** and **Text**, three verbs in one grammar. UIUX's "Stop here" becomes **Pause**, and "Talk to a person" becomes **Help**. The owner asked that the card offer to keep writing. It does.
- **UIUX: empty row says "Not yet".** It promises a next and turns the Confirmed row into a nag. Mine: **Nothing recorded.** It states a fact and expects nothing.
- **UIUX: "Partly", "Context", "Correct" as three buttons.** "Correct" reads as "that is correct", which is Fits. One button, **Reword**, opens one box. Systems and the engine map it to `correct`, and `context` rides in the same box.
- **Game vs sales on the gift.** Not my call. The lock line below works either way.
- **Creative's "Keep writing" beside the number.** Same ruling as UIUX.

## 3. What I missed

- **"Leaves: Nothing" is false today.** `storyui.js` calls the browser's speech recogniser, which sends voice to the browser's maker. The device only boundary needs the exception. My pass 1 block C said "Nothing."
- **The account Delete control is not built** (`PRIVACY-POLICY.md:166`, marked CHECK). The signed in Delete line cannot promise a button that does not exist. Until it ships, the line says write to the address.
- **Sync is not built** (technical R4, later). A typed signed in line would be false on a build with no copy of the stories. The line must come from the `PRIVACY` table (systems 4.10), not from a string constant.
- **Past harm needs a rule now.** I put it in the later "possible trauma" state. With three outcomes, a past harm entry lands in Strong, and a Victim or Martyr label printed on it is the worst line this product can produce. New rule: **while a care outcome is on, no saboteur, complex, mask or Dante name prints on that entry.**
- **The Fits and Confirmed collision.** Both are the person's yes. Resolved in 4.2.
- **Two more causal lines.** `summary.js` near 252 ("the cost is elsewhere") and 295 ("is not being blocked by the field"). Rewrites below.
- **"Quiet is on" needs its own line** (UIUX). Hiding the streak with no word is lying. Added.

## 4. The architecture, together: the words

### 4.1 Rules for every string in the merged build

1. **One bucket per string.** Menu, label, value, definition, instruction, reading, refusal. Every new string is registered in `COPY.md` with its bucket.
2. **Lead verbs.** A sentence that states a conclusion starts with one of six: **You wrote. The instrument heard. The instrument guesses. You reported. You marked. You confirmed.** A conclusion that cannot start with one does not ship. Gate: new rule in `objections.json`.
3. **Sensation rule.** A sensation is a report. It is never a cause, a sign or a result. The gate fails any string that joins a body word to means, shows, proves, because, due to, from, blocked, stuck, stored, healed or cleared. Run it first on the current build. `summary.js:293` must fail, which proves the gate on a known bad case.
4. **No label on a person while care is on.** See section 3.
5. **No monitoring claim.** No string says or implies the product watches. The Help sheet says it does not.
6. **Never printed, anywhere:** Day, of 90, stage, step back, score, confidence as a number, verified, detected, journey, milestone. A count is allowed only if it is of dated acts a person can check ("3 entries, 3 days").
7. **One word per concept, fixed.** Record (on this device). Account (the sign in). Copy (what we hold). Delete (the only removing verb). Set aside (a claim the person said no to). Password and Email, never passphrase or username. File password for the export, so there is one account password and one file password, named apart.

### 4.2 Names, in the product's words

| Proposal | Screen word | Note |
|---|---|---|
| Orchestrator, ledger, JourneyState | none | Code names only. The person never meets them. |
| Hypothesis | **Maybe** | A label above one live claim. Never in the button row, so nobody reads it as a middle answer. |
| Agree with a guess | **Fits** | Records the person's say. Shown in the Said row as "You said it fits." It does not print Confirmed. |
| Disagree | **Not me** | Writes to the declined list. Changes what shows next, or it is a fake right. |
| Show the chain | **Why** | Defined on the sheet as what you wrote and what was taken from it, not a cause. |
| Verified | **Confirmed** | Only for a change, only after the person's own tap on an ask. |
| Next best action | **Next**, and **Not now** | Different concept from Not me. Not me says the claim is wrong. Not now says the timing is. |

### 4.3 My rulings on the eleven

5. **Safety.** Engine: none, care, crisis, route. Person: three outcomes. Interim is acceptable for the owner and a private build, on five conditions: no monitoring claim anywhere; the Help line ships with the first private build; the quote is dropped when it names a method; the recall figure (5 of 18 cold) never appears in the product; clinician and counsel review of every number and the two medical lines gates the first public release. Engine needs one addition from technical: the reader returns the raw span, and a `urgent` flag on crisis, so the card can choose the sure or the conditional wording.
9. **Names.** The table above.
10. **Privacy.** Three labels, Stays, Leaves, Delete, in the same order every time. Two states. The toggle goes. The boundary is generated from the table, so it cannot say a thing the build does not do. "People who can see this record" is derived from grants.
2, 3, 6. **Words only.** One live Maybe. Next is an act in the person's words. Lock lines say what is kept (block E).

### 4.4 My slices in the merged order

| Slice | What | Size | Needs agreement from |
|---|---|---|---|
| W1 | Truth sweep: six causal lines, toggle, "Not your stories", "Tool of" to Tula | S | none |
| W2 | Care cards, Help sheet, the Quiet line | S words, M wiring | technical (span, `urgent`), AI (cue lists) |
| W3 | Sensation gate and lead verb gate in `objections.json` | S | none |
| W4 | Boundary page from the `PRIVACY` table, consent box, export strings | M | systems, technical |
| W5 | Claim row and chain strings | S words | UIUX (label above, buttons below), creative |
| W6 | Confirmed ask on ritual done | S | UIUX, game (nothing is paid or scored) |

W1 and W3 run in parallel with creative's slices 1 to 4 and share no file with them.

## 5. Revised grade

GRADE: 69/100 (was 57 for safety and 63 for privacy). Up: every string for three outcomes, the Help sheet, the chain, the claim row and the boundary now exists and passes the gate. Down: the device only line was false, the account Delete does not exist, locale numbers are unverified, and four of seven kinds still have no detection.

## 6. Top 5

1. **W1 truth sweep (S).** Derek, Gordon, Sofia. Six lines and three false privacy claims.
2. **W2 care cards and Help (M).** Ana, Nkem. Sofia and Derek keep trust if the false alarm is one tap.
3. **W3 gates (S).** All. Stops the cause lines coming back.
4. **W4 boundary from the table (M).** Phone only arrival, Sofia. Readable in ten seconds and true.
5. **W5 claim row and chain words (S, then M).** Gordon says no cheaply. Derek checks the chain.

## 7. Question for the owner

None. Decisions taken: Continue and Pause, not Keep writing and Stop here; Nothing recorded, not Not yet; Fits never prints Confirmed; no label on a person during care. He can overrule any.

---

# BLOCK A. Three outcomes

The person never reads a state name. `{q}` is the person's own words, the raw span, at most 12 words. If the span names a method, drop `{q}` and print "You wrote about hurting yourself." Every withdrawal is scoped "on this entry". Banned: sorry, please, we, you are, you have, trauma, disorder, addict, victim, suicidal outside a quote, an exclamation mark.

**1. Ordinary.** Nothing prints. No card, no comfort line.

**2. Strong** (engine: care). One card, release stays open.

    R   You wrote "{q}".
    I   Go one line at a time.
    M   Continue   Pause

Old: none shipped. Old in pass 1: "What you wrote sounds like a lot to carry." Reason: a feeling named by the product is a guess. A quote is a fact. Pause saves the entry and returns to the Field.

State line, as a Reading, with one Menu word:

    R   Quiet is on for this entry.
    M   Off
    D   Quiet hides the streak, the locks and Next for this entry only.

**3. Needs a person now** (engine: crisis or route). Four wordings, one outcome.

Sure (self harm, active or passive or burden cue):

    R   You wrote "{q}".
    I   Call or text 988 now.
    D   Someone answers day and night.
    R   Nothing was sent. Nobody was told.
    M   Call   Text   Continue

Conditional (one soft cue):

    R   You wrote "{q}".
    I   If you are thinking about ending your life, call or text 988.
    M   Call   Text   Continue

With a practitioner grant, line 4 of the sure card reads "{Name} can see your entries. No alert was sent." Never "Nobody reads this" in that state. Outside the United States, the number line is "Call your local emergency number." and nothing else, until counsel confirms each locale. Call and Text open `tel:` and `sms:` and print the number beside them.

Medical (sudden, severe, new, cannot breathe, faint, face or arm numb, bleeding):

    R   You wrote "{q}".
    F   The instrument cannot tell what is causing this.
    I   Call your local emergency number now. In the United States, call 911.
    M   Continue

Medicine (stopped or changed): replace the I line with "Ask the person who prescribed it before you change a dose." One I line per card, picked by cue. "My chest gets tight when I think of my boss" triggers nothing.

Substance (the person names alcohol or drugs as a problem). [CHECK: a clinician reads the number and the third line.]

    R   You wrote "{q}".
    I   Call 1-800-662-4357. It is free and answers at any hour.
    I   If you use every day, ask a doctor before you stop. Stopping fast can be dangerous.
    F   No release is offered on this entry.
    M   Continue   Help

Danger now (present tense harm to the writer). [CHECK: both numbers, with counsel and an advocate.]

    R   You wrote "{q}".
    I   If you are in danger now, call 911.
    I   Call 1-800-799-7233, or text "START" to 88788.
    F   No release is offered on this entry.
    M   Call   Continue

Add the line "This device keeps what you wrote. Delete this entry if someone else can open it." and the menu word Delete only when entry level delete exists. Do not print a line the product cannot back. The writer causing harm: "If you are afraid you will hurt someone, move away from them now and call 988."

Later, wording ready (possible trauma, needs a detector): R "You wrote "{q}"." F "The body map and the release stay closed on this entry." I "Stop here if you want. The entry is saved." M Continue, Pause, Help.

Strong and above also apply rule 4.1.4: no saboteur, complex, mask or Dante name prints on that entry.

# BLOCK B. Help sheet (the only place the limits live)

Reached from the Help menu word. Nothing permanent on the composer. Old: pass 1 block B, built on "It is not".

    What this is
    You write. The instrument reads charge out of your words and shows where
    it sits. It reads what you wrote. It did not scan you or test you.

    Limits
    A doctor can diagnose. A therapist can treat. The instrument does neither.
    The Food and Drug Administration has not reviewed it. If you are under
    care, stay in it. Do not stop a treatment or change a dose because of a
    reading.

    What it misses
    It reads English. It misses things. Nobody is watching as you write.
    If you might hurt yourself, call or text 988. If you are in danger,
    call 911. Elsewhere, call your local emergency number.

[CHECK: counsel reads "has not reviewed it" and the last paragraph.] The 988 and 911 lines are United States only.

# BLOCK C. Claim row and the chain

Layout: label above, claim, buttons below. One live Maybe. A claim never shows before the person has written something it quotes.

    Maybe                                             (Label)
    You wrote "I always freeze when someone           (Said, quoted)
    challenges me."
    You may pull back when you are challenged.        (Reading, worded may)
    Fits   Not me   Why                               (Menu)

After Fits: "You said it fits." After Not me, in place, ten seconds: "Set aside." with Undo, Partly, Reword. The Reword box asks "Write it as it is for you." Set aside is a listed place, never counted. Three Not me in a row on one wording means the wording is wrong, not the person.

The sheet opens with a Definition: **This shows what you wrote and what the instrument took from it.** Six rows, always in this order, labels never change:

    Said        You wrote "I always freeze when someone challenges me." Tuesday.
    Heard       The instrument heard "freeze". It placed it at the solar seat, high.
    Maybe       The instrument guesses you pull back when challenged.
                It is built from 3 entries on 3 days.
    Felt        You reported tight, in the chest. You marked 7.
    Changed     Before the release you marked 7. After it you marked 3.
    Confirmed   You confirmed it: "I answered without pulling back." Thursday.

An empty row prints **Nothing recorded.** A row read under an older word list prints "Read under an older word list." Before and after are order, never effect.

Confirmed ask, after a ritual is marked done, one question at a time, at most one a session:

    I   Since you ran this, did it come up?
    M   It came up and I stayed   It came up, same as before   It did not come up   Skip

No answer prints praise, a score or a streak. Skip costs nothing.

# BLOCK D. The data boundary

Same three labels, same order. The state shown is the state the person is in.

Device only:

    Stays    Everything you write and every reading. On this device, in this browser.
    Leaves   Nothing, unless you dictate or ask for a name meaning. Each asks first.
    Delete   Delete this record. It is gone at once. There is no copy.

Instruction, once at the top and before the first export: **Clear this browser's data and the record is gone. Export a file to keep a copy.**

Signed in (written for a build with sync, drawn from the `PRIVACY` table, never typed). [CHECK: the support tools claim, a technical seat proves it.]

    Stays    Your name and birth details. On this device only.
    Leaves   Your answers, your stories as you typed them and your readings. A locked copy sits on our server. We hold the key. Support tools do not open it.
    Delete   Delete the record here at once. Delete the account and the copy leaves our live system at once.

Until the account Delete control exists: "Delete the account by writing to hello@atuned.world." Before sync ships, the Leaves line is whatever the table lists, and says so.

On demand, one Definition per tap under Leaves:

- **Stories.** A story goes as you typed it. If you wrote someone's name, the name goes with it.
- **Voice.** If you dictate, your browser sends your voice to its maker. We never receive it. Type and nothing is sent.
- **Name meaning.** Your name goes to us and then to Anthropic, only after you say yes.
- **Payment.** Stripe takes the card on its own page. We never see the number.
- **Morning note.** Your browser's push address and the hour you chose. The note carries no reading.
- **Sight.** Nobody sees this record but you. A practitioner sees it only after you say yes. Each yes is listed by name, and one press takes it back.
- **Backup.** A locked backup is overwritten 90 days after you delete the account.
- **Time.** If you do not sign in for 24 months, we delete the copy. We email you 30 days before.
- **Sold.** We never sell anybody's data. We do not share it for advertising.

Removed: the "Improve the Models" group and its toggle. Reason: nothing reads it, research sharing is ruled off, and it says the opposite of "we do not train".
Replaced: "Not your stories". Reason: the server holds them, locked, and we hold the key.

Consent, three boxes, never bundled:

    [ ] I am 18 or older.
    [ ] I accept the Terms.
    [ ] Keep a locked copy of my answers, stories and readings on your server, so I can get them back.

    Withdraw   Your copy leaves our live system. This record stays on this device.

Export strings: M "Export". L "File password". I "Choose a password for this file. We cannot recover it." F "That password does not open this file." F "This file ends early. Export it again." F "This browser cannot lock the file. The file you saved is plain. Anyone who has it can read it." The unreadable copies row: label "Unreadable copies", menu word Delete, never "clear".

Lock screen push, the whole of it: **Ritual at 8.**

# BLOCK E. The six cause lines, rewritten, and the lock line

Old to new, with the reason: each stated a cause about the body or the person that the instrument did not measure.

| Where | Old | New |
|---|---|---|
| `summary.js:254` | "A blueprint that says X and a field that runs Y means something was installed on top of the blueprint, and it has been carried long enough to feel like a personality." | "The blueprint says X. The field runs Y. These differ." |
| `summary.js:293` | "is the part still blocked, and it is blocked by the same charge named above." | "are not passing. The charge named above sits under them." The writer checks the pair data. If it is the same seat, say "the same seat". |
| `summary.js:318` | "which means it is expanding" | "This leans toward expanding." |
| `drills.js:1348` | "They do not, which means something was installed on top of the blueprint." | "They differ." |
| `summary.js` near 252 | "Those agree, so what you are doing is what you were built for and the cost is elsewhere." | "Those agree." |
| `summary.js:295` | "What you stated you are becoming is not being blocked by the field." | Cut. The sentence before it carries the fact. |

`installed` stays as the engine's measured state word for an address. It is never the explanation of a mismatch between two readings. `malignant` printed with a percent has no definition or direction out. That is for the compass owner, not decided here.

Lapse, at a lock: **Kept: the addresses you opened, your reruns and your history. Saboteurs show again on tier one.** No string ever mentions the banking cap or approaching it.

Standing Definition on the Body page and every tooltip that places a mark: **A mark is what you felt. It is not what caused it.** Under the Flow layer: **Open and impaired describe the load you reported at this nerve. They are not a test of it.**
