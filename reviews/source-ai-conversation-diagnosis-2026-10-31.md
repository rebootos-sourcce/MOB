# Source AI in the Journal: why it does not act like a conversation

Diagnosis only, 31 October 2026. Tomas Egilsson, the AI and algorithms seat.
Nothing in the engine, the UI or the build products was edited. Nothing was
committed.

## The question, in his words

"I don't understand why it doesn't act like a normal chat, like a normal
conversation chat with our layer on top. What's wrong? What's happening? Is it
the rules that we currently have set for it?" His screenshot showed "can you
hear me" twice in a row, and Source AI answering with "Nothing placed yet, so
nothing is asked. Say what your body did, and where."

## The answer in two sentences

It is both. There is a real bug: a person's turn gets no reply at all whenever
Source AI's reply would carry the same internal key as its last one, and the
voice speaks only the greeting and never a reply, so on a voice-only screen
he spoke, heard nothing back, saw nothing new, and said it again. Under the
bug sits the gap SJ3 named: everything Source AI can say is decided by which
body seat the sniffer heard and how often, so anything that is not a feeling
word ("can you hear me", "hi", "can we talk about something else", "yeah")
has no reply except an instrument status line or silence.

## What was run

A fresh build of this checkout's sources, built in a scratch copy so the
checkout's staged build products were not touched. The chat code here is
byte-identical to `origin/main` (`ui/storyui.js`, `engine/sourceai.js`,
`engine/evidence.js`, `engine/qcheck.js`, `engine/sniff.js`: zero diff lines),
and main's deploy runs are succeeding, so this is the code he used. The live
site itself could not be fetched from this sandbox (the proxy refuses
atuned.world).

The harness drives the real page in Chromium through the same stand-in
microphone `tests/srcchat.js` uses: each sentence is one finalised speech
result handed to `ST_REC.onresult`, which calls `srcTurnCommit`, exactly the
path a spoken sentence takes. `authVoice` is replaced by a recorder, so every
line the page would send to the ElevenLabs voice is captured rather than
fetched. Per turn it records the thread as drawn on screen, the engine's move,
the seat and rung, the question check's attempts and refusals, and the voice
calls. No page errors in any run.

Harness and raw output, scratch only, not in the repo:
`/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/diag/sim.js`,
`.../diag/show.js`, `.../diag/out.json`, `.../diag/transcripts.txt`.

**A harness defect found first, and it is also in `tests/srcchat.js`.** The
stand-in microphone installs only when the browser has no speech recognition
(`if (!window.SpeechRecognition && !window.webkitSpeechRecognition)`). Headless
Chromium has `webkitSpeechRecognition`, so the stand-in never installs, the
real recogniser starts, fails in the sandbox, sets `ST_LISTEN` false, and the
next `say()` starts the microphone again. Every turn becomes a fresh recording
with a fresh greeting. That hid finding 2 below: on the first run the voice
log showed a spoken line on every turn, which was the harness restarting the
microphone and not the product speaking. With the stand-in forced, the
microphone stays live across the whole conversation the way a real one does.
`srcchat.js`'s own comment says "The mic is started once and left listening
across every say() in a run", and on this Chromium it is not.

## The transcripts

Exactly what is drawn in the thread, in order. SRC is Source AI, on the left.
ME is the person, on the right. "(nothing)" means no new Source AI bubble
appeared after that turn. The profile's first name is Lance.

### 1. His complaint, reproduced: "can you hear me"

    SRC  Hello, Lance. What are we talking about today?        <- spoken aloud
    ME   Can you hear me?
    SRC  Nothing placed yet, so nothing is asked. Say what your body did, and where.
    ME   Can you hear me?
         (nothing)
    ME   Hello?
         (nothing)

Voice calls over the whole run: one, the greeting. The reply to the first
"Can you hear me?" was never spoken. The second and third turns got no reply
at all, on screen or aloud. That is the screenshot: from where he sat, Source
AI said hello, then went silent, so he asked whether it could hear him, and
again.

The same with "Hi.", "How are you?", "What is this?", "Are you there?": one
"Nothing placed yet" after "Hi." and silence for the other three. With no
first name on the profile the opener is "What are we talking about today?"
and everything after is the same.

### 2. Real emotional content, turn after turn

    SRC  Hello, Lance. What are we talking about today?
    ME   I had a fight with my wife this morning and I felt sick about it all day.
    SRC  You wrote "felt sick".
    ME   She said I never listen and I just shut down.
         (nothing)
    ME   My chest got tight and I could not breathe properly.
    SRC  You wrote "could not breathe".
    ME   I keep replaying it and I feel ashamed.
    SRC  You wrote "ashamed".
    ME   I am still ashamed tonight and I cannot sleep.
    SRC  You wrote "could not breathe" and "cannot sleep". What would you rather be doing?

Four things, each traced below. "She said I never listen and I just shut
down" got silence, because nothing in it read at a new seat. Each reply that
did come is the person's own word repeated back and nothing else. The first
question arrives on the fifth turn, about breathing and sleep, while the
person has just said "ashamed" twice. And the question is a fixed one,
"What would you rather be doing?", after they said they cannot sleep.

A grief conversation:

    ME   My dad died two years ago and I still think about him every day.
    SRC  You wrote "died".
    ME   I miss him so much.
    SRC  You wrote "died" and "miss him". What did you do?
    ME   I feel so sad when I drive past his house.
    SRC  What happens next?
    ME   The grief just sits in me.
    SRC  Where do you feel it?

"What did you do?" to "I miss him so much" is the first question on a fixed
list, not a reply to what he said.

### 3. Answers a question, then changes subject

    ME   I am afraid of losing my job.
    SRC  You wrote "afraid".
    ME   I am so afraid, my boss keeps cutting my hours.
    SRC  You wrote "afraid" twice. What did you do?
    ME   I went quiet and did not say anything.
    SRC  What would you rather be doing?
    ME   Anyway, I want to talk about my brother instead.
    SRC  What happens next?
    ME   He has not called me in months and I feel abandoned.
    SRC  Where do you feel it?

The subject changed and the questions kept walking the same list about the
same fear. The engine still has the job fear as its seat when "abandoned"
arrives (`top=root, rung 7`, while the newest thread is the heart).

Said with one of the phrases the engine does know:

    ME   I am so afraid, I am afraid of losing my job.
    SRC  You wrote "afraid" twice. What did you do?
    ME   Can we talk about something else?
    SRC  Cool. Nothing more asked in this entry.
    ME   My brother has not called me in months and I feel abandoned.
         (nothing)
    ME   I feel so abandoned and alone.
         (nothing)

"Talk about something else" is filed as "stop asking", so a person who asks
to change subject is then met with silence for the rest of the entry, about
the new subject too.

### 4. Nothing new, twice

    ME   I feel anxious.
    SRC  You wrote "anxious".
    ME   I feel anxious.
    SRC  You wrote "anxious" twice. What did you do?
    ME   I feel anxious.
    SRC  What happens next?

    ME   I am angry at myself.
    SRC  You wrote "angry".
    ME   I am angry, really angry.
    SRC  You wrote "angry" three times. What did you do?
    ME   Yeah.
    SRC  What happens next?
    ME   Yeah.
    SRC  Where do you feel it?

"Yeah" is not heard as an answer, a yes, or a sign of being done. The list
just steps.

### 5. Asking to vent, and saying a reading does not fit

    ME   I am furious and humiliated, I am so angry.
    SRC  You wrote "furious" and "humiliated". What did you do?
    ME   I am still angry.
    SRC  What happens next?
    ME   That does not fit me.
    SRC  I'm listening.
    ME   I just want to vent.
    SRC  I'm listening.
    ME   I am angry again.
         (nothing)

Tonight's build heard "does not fit" and "vent" as intended. After that,
every vented turn gets silence, by the same mechanism as the "can you hear
me" silence.

### 6. Pressing Talk a second time

Two turns, Talk pressed to stop, then again to start. The greeting the voice
is sent is the whole thread run together, with the button labels:

    "Hello, Lance. What are we talking about today?I am afraid of losing my
    job.You wrote "afraid".I am so afraid, my boss keeps cutting my hours.You
    wrote "afraid" twice. What did you do?Move onAnswer below, or leave it."

### 7. A spoken sentence delivered twice by the browser

One event with "Can you hear me?" final, then a second event that reports
that same final again at `resultIndex` 0 together with a new one. The page
commits the old sentence a second time:

    ME   Can you hear me?
    SRC  Nothing placed yet, so nothing is asked. Say what your body did, and where.
    ME   Can you hear me? I said can you hear me?

Whether Chrome on his device re-delivers finals this way was not measured
here. Chrome's continuous recognition is known to on some Android builds.
The handler has no guard against it either way.

## Root cause, by file, function and line

### The bug: a person's turn can get no reply

`ui/storyui.js`, `srcChatNote`, line 1644:

    if(L&&L.key===cur.key){L.q=cur.q; L.mv=cur.mv; L.rg=cur.rg; L.bd=cur.bd; return;}

When the reply Source AI would give has the same key as its last bubble, the
last bubble is updated in place and no new bubble is added, even when the
person has spoken since. The keys built in `srcChatCur` (line 1594) are:

- `say|` for any turn in which no seat was heard (line 1622),
- `say|<seat>` for a listening mirror on the same seat (line 1621),
- `vent` (line 1602) and `pass` (line 1601), which never change once set.

So a second turn with no feeling word, a second turn on the same seat while
listening, every vented turn after the first, and every turn after "move on"
are all answered with nothing.

This line is from 3 October (`3bdf4d32`), when the chat was a ring where only
the newest Source AI row showed words, and updating that one row in place was
correct: it was the panel's one live line. On 29 October the thread became a
text window that prints every turn (`58a4d42e`) and voice became the only way
a turn comes in (`c6a671bb`), and this rule was not revisited. Tonight's
build made ask keys distinct (it added the question to the `ask|` key, line
1600), which is why asks never go silent, but it did not touch the `say|`,
`vent` or `pass` keys. Tonight's build did not cause this, and it did not fix
it.

### The bug: the voice speaks only the greeting

`ui/storyui.js`, `stSrcSpeak` (line 3030) has one caller, `stMic` at line
3009, which runs when Talk is pressed. `srcTurnCommit` (line 1672) and
`srcChatNote` never call it. In a conversation where voice is the only way in,
every reply is silent, and he had no reason to be watching the screen.

And `stSrcSpeak` reads `#stsrc`'s whole `textContent` (line 3032), which is
the entire thread plus the button labels once there is a thread, so the
second press of Talk reads the conversation aloud as one run-on string
(transcript 6).

### The bug: a re-delivered final is committed again

`ui/storyui.js`, `stMic`'s `onresult`, lines 2979 to 2983, commits every
final from `e.resultIndex` onward and does not remember which results it
already committed. Measured as a risk, not as what happened to him.

### The rules: what decides the line

The line Source AI says is decided by four things in a fixed order, none of
which reads what the person said as a conversation:

1. **The move.** `engine/sourceai.js`, `srcTurn`, lines 213 to 221. Four
   moves: open, listen, ask, pass. A turn with text and no seat heard is
   `listen`. There is no move for a greeting, a check that it can hear, a
   question to Source AI, a yes, a "yeah", or a change of subject.
2. **The listening line.** `ui/storyui.js`, `srcChatCur`, lines 1616 to 1622.
   With a seat: "You wrote X. It lands Y.", and since tonight point 7 of the
   question check strips the place sentence, so what is left is "You wrote
   X." alone (line 1620). With no seat: `srcNone()`, line 1308, "Nothing
   placed yet, so nothing is asked. Say what your body did, and where." That
   sentence was written on 1 October as a status note under the listening
   gauge on the panel. The chat reuses it as Source AI's spoken turn, which
   is why it reads as an instrument talking about itself.
3. **Which seat is asked about.** `engine/sourceai.js`, `srcHear` sorts the
   seats by rung (line 191) and `srcTurn` asks about the top one (line 218).
   Rung counts repeats, so the seat that has been mentioned most keeps the
   question after the person has moved on. Tonight's ledger has a "thread",
   the seat with the newest evidence (`evThread`, `engine/evidence.js:270`),
   but only the listening line reads it. The ask does not.
4. **Which question.** `engine/qcheck.js`, `SRC_FAMILY` (line 65) and
   `srcChoose` (line 322). The candidates are the 4 October document's family
   questions in a fixed order. Families already asked go to the back. The
   first that passes the ten checks is said. In practice, on every
   conversation run here, that came out as "What did you do?", then "What
   would you rather be doing?", then "What happens next?", then "Where do
   you feel it?", whatever the person had just said.

The engine reads three things about the conversation itself
(`engine/evidence.js`, `SRC_INTENT`, line 370): vent, move on and "that
doesn't fit". "Change the subject" and "talk about something else" are in the
move on list, which is why a change of subject ends all asking.

### Is this the gap SJ3 named?

Yes, with the names corrected. SJ3 named `SRC_JOG` (the eight question daily
walk) and `SRC_DIMQ` (seven templates) as the script. Neither is reached in
the live chat any more. `SRC_JOG` is only reached by pressing "another
question" (`srcNextQ`) and `SRC_DIMQ` only through `srcDyn`, and both buttons
were removed on 29 October. The script that runs now is `SRC_FAMILY` walked by
`srcChoose`. SJ3's verdict holds: "a script with good lines, not an
investigator that follows evidence." What tonight added made each line safer
(no why, no place said before the person confirmed it, no diagnosis) without
making the choice of line respond to the person.

What is new, and not in SJ3: the silence (the `srcChatNote` key rule), the
voice that never answers, and the voice reading the whole thread. Those are
bugs, and they are what made his session feel broken rather than merely
scripted.

## What would make the diagnosis wrong, and whether that was checked

- That the live site runs different code. Checked as far as this sandbox
  allows: the five chat files are identical to `origin/main`, and main's
  deploys are passing. The live page itself could not be fetched.
- That his "twice in a row" was a double delivery from the browser and not
  silence. Both are possible from the code, and both fit the screenshot. The
  silence reproduces on any device. The double delivery depends on his
  browser and was not measured.
- That the harness and not the product produced a finding. One harness
  defect was found and fixed before any transcript above was taken (the
  stand-in microphone), and it is named in the section on what was run.

## The build plan

Two parts. The first is bug fixes and a gate, small enough to do now. The
second is the actual answer to "a normal chat with our layer on top", and it
needs his ruling first.

### Part 1. Fix the silence and the voice. Small, inside this repository.

1. **Every person turn gets exactly one new Source AI turn.** In
   `srcChatNote`, a reply after the person has spoken is always a new row,
   never an update in place. Updating in place stays only for repaints with
   no new person turn. On its own this would make Source AI repeat its
   previous line word for word, which is the other failure he described, so
   it comes with item 2.
2. **A reply for a turn that is not a feeling.** A short stated list of
   conversation acts, read the way `srcIntent` reads vent: a check that it
   can hear ("can you hear me", "are you there", "hello"), a greeting, a
   question to Source AI ("what is this", "how does this work"), a short yes
   or "yeah", and a change of subject. Each gets one written reply, and none
   says "Nothing placed yet". A change of subject resets the thread to the
   new subject, not "move on". The wording is his or the voice seat's, run
   through `check.py --objections`, not written here.
3. **Speak every new Source AI row.** Send the row's own words (`r.q`) to the
   voice when the row is added, never `#stsrc`'s `textContent`. Pause the
   recogniser while the voice plays, or the microphone will hear Source AI's
   own voice and file it as the person's turn. That has to be measured with
   real speakers before it ships.
4. **Commit each speech result once.** Remember the indices already
   committed in this recording and skip them.
5. **"Answer below, or leave it."** There is no box below since 29 October.
   The voice seat's call.
6. **The gate.** `tests/srcchat.js`: install the stand-in microphone whatever
   the browser has, so one recording runs through the whole conversation as
   its own comment says. Add: every person turn is followed by exactly one
   new Source AI row; no Source AI row is word for word the one before it;
   every new row is sent to the voice with its own words and nothing else.
   Checked against a known bad copy first, the current `srcChatNote`, which
   must fail.

After Part 1 the chat stops going silent and answers out loud. It will still
feel like a script, because it still is one.

### Part 2. A normal conversation with our layer on top. His ruling first.

There are two honest ways to go, and they are a product decision, not a
build detail.

**A. Keep it scripted and make the script wider.** More conversation acts,
more written lines, a thread that follows the newest subject, questions
chosen by what the last turn answered rather than by list order (SK3's
behaviour reader is part of this). Inspectable, free to run, no new privacy
question. It will never be a normal conversation: anything off the list gets
a near miss, and he will keep hitting the edges, because talking is mostly
off the list. That is the "rules" he is asking about, and more rules do not
remove it.

**B. A language model writes the turn, and the engine is the layer on top.**
This is the literal shape of what he described. The engine keeps deciding
what may be said: the evidence ledger, the claims that may be named, the
seat, the one-question cap, vent, move on and "doesn't fit", and the ten
checks. The model handles the conversation and words each reply inside
those limits. Every model reply goes through `srcVet` and `srcVetSay` before
it is shown or spoken, and a reply that fails is regenerated or replaced by
the scripted line. The engine stays host free; the call goes through the
Worker the way the voice already does.

The privacy question comes first, and it decides whether B is allowed at all.
The ruling on record: the name never leaves the device, a key replaces it,
and the record is never held joined to the story. A chat reply needs the
turn's text, which is the story, to leave the device. That can fit the
ruling only if:

- the name is never in what is sent (the greeting is built on the device,
  `srcOpen`),
- no part of the record is sent, only the entry's turns and the engine's own
  constraints for this turn,
- the provider keeps nothing and trains on nothing, under terms we can
  point to,
- the person is told in plain words and says yes before the first turn goes
  out, the same condition DECISIONS.md set on 1 October for looking up a
  name through the Claude API ("it needs the person's yes in plain words and
  it is a second network seam, which `CLAUDE.md` allows only by his ruling"),
- and a person who says no gets Part 1's scripted chat, which keeps working.

What B costs: a per-turn model call and its latency on top of the voice
(both on the Worker); a crisis path that sits in front of the model and does
not depend on it; and an evaluation, because there is no labelled set. The
evaluation that is possible now: the story bank and the thirty test vectors
from the 30 October package as fixed conversations; every model reply held
to the ten checks (a hard pass rate, not a score); the vectors' expected
states for no, someone else's word, vent, move on and reject; and the
transcripts above as regression cases, each with a stated pass condition (a
reply to every turn, a check that it can hear answered as one, a change of
subject followed). Measured on a fixed sample, not tuned on the same one it
is reported on.

What stays out of B in either case: the model never decides a seat, a charge,
a rung or anything written to the record (`source_delta=0` holds); it never
names a body place the person has not confirmed (point 7); and it never
reads earlier entries' text (SK4, his question 12).

### What he decides

One question, the fork: should Source AI stay a written script that we keep
widening (A), or should a language model write the replies inside the
engine's rules, with the person's yes before any of their words leave the
phone (B)? Part 1 is needed either way and does not wait on the answer.
