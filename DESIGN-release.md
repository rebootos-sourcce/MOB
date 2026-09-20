# DESIGN-release. The release flow, as something a person hears.

Sound seat. Written against `TASKS.md` 0c2, the prototype at
`proto/release/index.html`, and the book at `index.html`.

The arithmetic under the release is right and is not touched here. The four
channels are his, the plan is priced through the meter the ladder uses, the
cooldown exists, the stop ends into it. What is missing is that a protocol
built to be heard is being read at 2.2 seconds a line.

This document has four jobs. It reports what the book already says, so nobody
writes copy he has written. It prices the audio ruling with real numbers. It
specifies the sound, as numbers rather than adjectives. And it specifies the
panel and the flow, so the port is a task and not a second design pass.

---

## 0. What is here

    proto/release/index.html    the prototype. one page, no siblings, the
                                engine referenced at ../../engine.js
    proto/release/shots.js      shoots it at 1600 and at 390 and measures it
    proto/release/rel-*.png     the images, five surfaces at two widths

Run it:

    NODE_PATH=/opt/node22/lib/node_modules node proto/release/shots.js

Green on this run: no request but the page and `engine.js`, no page error,
nothing under 44 by 44, the countdown is minutes and seconds and falls, and
all five surfaces render at both widths. The voice gate is clean on the copy:
no hard failures, antithesis at 0 per cent against a house rate of 2.8, the
demonstrative opener at 0 against 2.6.

---

## 1. What the book already says, and it says most of it

The reference app he named is not in this repository. The book is, and the
protocol is in it. Line numbers are into the stripped text of `index.html`,
which is reproducible:

    python3 -c "import re,html,sys; s=open('index.html',encoding='utf-8',
      errors='replace').read(); s=re.sub(r'<(script|style)[^>]*>.*?</\1>',' ',
      s,flags=re.S|re.I); s=re.sub(r'<[^>]+>',' ',s);
      open('book.txt','w').write(html.unescape(s))"

**The dose is his and it is exact.** "The dose pattern: 50 release statements
on the left channel, 50 on the right, transition through release, 50 embodied
truth on the left, 50 on the right. Both channels. Both polarities." (2401,
and again at 2703.)

**The protocol is a reading protocol.** "A properly constructed Letting Go
sequence is itself a release protocol. Reading it, aloud or silently, produces
somatic release at the anatomical address the sequence specifies." (2701.)
That is the sentence that settles whether sound is decoration here. It is not.
The sequence is the instrument, and a voice is the delivery it was designed
for.

**The statement, in full.** "I am letting go of believing, perceiving,
thinking, behaving, acting, feeling, speaking, saying, voicing and doing
[pattern]." (2316.) Ten gates.

**And the graduated entry, so the full chain is not the opening position.**
"Month 1: letting go of believing only. Month 2: letting go of believing,
thinking, and feeling. Month 3 and beyond: full ten-gate chain." (2318.)

**The entries rotate, and the resistance is the diagnostic.** "Let go. Give
up. Forgive myself. Forgive others. Same mechanic. Different entry points."
(2315.) "Whichever gate is hardest to say is the gate the pattern is defending
through." (2316.)

**Why the address is sealed before the next one opens.** "The released address
is open territory until the coherent opposite is installed; whatever frequency
the system encounters first will fill the space." (3656.) That decides the
order of a multi address run and it is not a layout choice: the run is address
major, release then reframe at one address, then the next.

**The awareness instruction, close to verbatim to what he said in the brief.**
"Move attention inside the body. Feel the body from the inside." (2451.)

**What release feels like, which is the only honest sensation line available.**
"That flow travels upward through the body and exits through the mouth." (2355
to 2358.)

**The end state, which is what a cooldown is for.** "When this state is active,
stop the active protocol work. Switch to observation. The body knows where to
go." (2705.)

**The decay, with numbers.** "τ (Standard): 9.0 days. Peak rebound: Days 4-6.
Completion: Day 27-33." (3654.)

**And the audio, already specified, already his.** "Theta, relaxed state. Most
somatic release work happens here." "Alpha, the mind is programmable because
it is not yet moving too fast. Most susceptible to installation work." (2414
to 2416.) Also "Thirty minutes of theta tone" at 175, as a thing he did.

That last one is the find that matters most for this seat. The two halves of
the protocol already have a frequency each, named by him, and the mapping is
exact: theta under release, alpha under reframe. Nothing had to be invented
for the one continuous sound in the design.

### Two errata, named and not fixed here

**One. `ui/release.js:210` says "The rebound is day four and a half."** The
book says days four to six, and the model behind it is an exponential with
τ of 9.0 days. Four and a half is a precision the source does not carry. The
prototype prints "days four to six". `BOOK-ERRATA.md` is the file for this.

**Two. The book says left channel first, the code says right first.** Book:
"50 release statements on the left channel, 50 on the right." Code:
`CHAN=[['R',…],['L',…],…]` with the comment "Right then left, limit before
truth." One of the two is wrong and it is his call which. The prototype
follows the code, because the channels were named as built and correct in the
brief.

---

## 2. The audio ruling, priced

### The arithmetic that decides it before any taste does

The body of the protocol cannot be a recording, at any bit rate, ever.

    112 addresses  ×  4 channels  ×  50 lines   =  22,400 lines
    at about 2 seconds a line                   =  12.4 hours
    at 24 kbps Opus mono                        =  134 MB
    as base64                                   =  179 MB

Even recording only the head of each block, one per address per channel, is
448 clips of about seven seconds, which is 52 minutes, 9.4 MB, 12.5 MB as
base64. The build is 1.53 MB. So the recorded portion can only ever be the
frame: the greeting, the hand over, and the cooldown. Everything between them
is synthesised or it is nothing. That is not a preference, it is a division.

### The three options, with the numbers he asked for

The baseline, measured at commit `c873356`:

    source.html                     1,531,302 bytes
    gzipped                           550,450 bytes
    the embedded font, as base64       64,368 bytes
      which is 4.2 per cent of the raw file
      and 11.7 per cent of the wire, because woff2 does not gzip twice

Opus, mono, speech, per minute of audio:

    bit rate   raw / minute   as base64   quality
    12 kbps         90 KB       120 KB    telephone and a bit better
    16 kbps        120 KB       160 KB    clearly a person in a quiet room
    24 kbps        180 KB       240 KB    good speech, no artefacts to notice
    32 kbps        240 KB       320 KB    near transparent for a voice

Base64 of Opus does not compress: the payload is already entropy coded, so
gzip recovers about 2 per cent of the base64 overhead and no more. The cost
lands on the raw file and on the wire at close to the same number.

The frame, budgeted: 30 seconds of greeting, 5 seconds of hand over, 20
seconds of cooldown. Call it 55 seconds, or one minute with headroom.

**Option A. Embed it.**

    at 12 kbps    +120 KB    +7.8% on the file    +21.8% on the wire
    at 16 kbps    +160 KB   +10.5% on the file    +29.1% on the wire
    at 24 kbps    +240 KB   +15.7% on the file    +43.6% on the wire

Buys: his voice, in a file that runs from wherever it lands, with no request,
no vendor and no failure mode. Costs: the wire numbers above, on a build that
already had to be compressed to arrive.

**Option B. Fetch it at the one network seam the accounts fork opens.**

Bytes in the file: zero. Three costs, and the third is the one that decides
it.

- `tests/design.js` gate 7 watches the network and fails on any request that
  is not one of the two local rasters. Audio fetched at run time is a request.
  The gate moves or the audio does not ship, and the gate is the thing that
  currently proves the claim on the box.
- The ruling on handing the build over is that the owner gets a file he can
  save and open from his downloads folder. An `<audio src="https://…">` does
  load from `file://` without CORS, so this works with a network. With no
  network, on a plane, in a room with no signal, the protocol opens in silence
  and the person is told the voice failed. A build that needs a network to be
  itself has not shipped.
- A request per play is a log line somewhere that says which account played
  which protocol at what hour. That is somatic and psychological use data
  leaving the device, and the standing promise says storage is the person's
  own browser for everything but the quiz record. Caching it once in
  IndexedDB reduces it to one line per person, not to none.

**Option C. Synthesise everything and keep no recording.**

Bytes in the file: the whole sound system in the prototype measures **3,210
bytes** of JavaScript with its comments stripped, about 1.5 KB gzipped. That
is the four earcons, the two tone bed, the envelopes and the filters. One
thirty seventh of the cheapest recorded frame.

Costs: his voice is the one asset in this product that cannot be generated,
and generating it is refusing the thing he asked for first. And it does not
buy the privacy guarantee it looks like it buys, because browser speech
synthesis is itself a network service on two of the four major browsers. See
section 3.

### What I would choose, and it is a split

**Synthesise everything now. Embed his frame later, at 16 kbps, budgeted at
160 KB.** Three reasons, in order of weight.

1. **The frame is the only place a recording is the mechanism rather than the
   delivery.** A person is greeted by a person. Synthesis cannot do that and
   nothing else in the flow needs it. Everything between the greeting and the
   cooldown is the same sentence with one noun changed 22,400 ways, which is
   exactly what a synthesiser is for and exactly what a recording cannot be.
2. **The recording must be a layer and never a dependency,** which is what
   makes the one file ruling survive. The prototype runs the whole protocol
   complete and correct with no recording present, and says so in one line
   where a person reads it before they begin. Build it that way and the
   embed becomes a budget decision he can take or reverse later without
   touching the flow.
3. **160 KB is the honest price of the thing he asked for first,** and it is
   two and a half times the font, which is the precedent this build already
   set for a last dependency worth carrying.

**The one file ruling survives.** Nothing here adds a dependency, a request or
a build step. The sound is 3 KB of oscillator code. The recording, if he rules
it in, is one more base64 literal beside the font. If he rules it out, one
line of copy changes and nothing else does.

**What I would not do is Option B,** and the reason is not the bytes. It is
that it takes a file that runs anywhere and makes it a file that runs where
there is signal, to save 160 KB on a 550 KB wire payload.

---

## 3. Speech synthesis, and whether the privacy ruling extends to it

It does, and the answer differs by platform, which means the line has to be
computed rather than written.

The standing ruling covers the microphone: "browser speech recognition is a
network service, so the audio reaches the browser vendor. We do not sell it
and we also do not control it. The control therefore says so in one line
before the microphone opens." (`DECISIONS.md`, 19 September.)

Synthesis is the same shape with a different distribution:

    browser and platform            where the voice runs
    Safari, macOS and iOS           on the device. AVSpeechSynthesizer.
    Firefox, every desktop          on the device. the OS speech service.
    Chrome, desktop                 both. the OS voices are local, the
                                    "Google …" voices are synthesised on
                                    Google's servers and are usually what
                                    getVoices() returns first.
    Edge, desktop                   both. SAPI voices are local, the
                                    "Microsoft … Online (Natural)" voices
                                    are Azure.
    Chrome, Android                 the Android TTS engine. voice data can
                                    be downloaded for offline use and often
                                    is not.

`SpeechSynthesisVoice.localService` is the platform's own answer and it is the
field to read. The rule:

1. **Prefer a local voice.** Filter `getVoices()` to the page language, then
   to `localService === true`, and take the first. The prototype does this in
   `voicePick()`.
2. **Say which one it got, before it speaks.** Local: "The voice is Samantha,
   and it runs on this machine. The words go nowhere." Not local: "The voice
   is Google UK English Female, and it is a network service. The words are
   sent to the browser vendor to be spoken. Turn the voice off and the run
   reads on the screen."
3. **Name the one case the flag cannot answer.** On Android the flag is the
   TTS engine's answer about itself, not about the network behind it. The line
   is written so it does not claim more than the flag knows.
4. **No request log can prove this.** A synthesis request leaves through the
   browser's own process, not through `fetch`, `XMLHttpRequest` or anything
   else a page can wrap. `tests/design.js` gate 7 will stay green whether the
   voice is local or not. That is the whole reason the notice exists: the page
   cannot prove the claim, so it has to state it.

And the text being sent is not neutral text. It is the name of a pattern this
person is carrying, at a named nerve. "I let go of self-silencing" is a
sentence about somebody, and it is the sort of sentence the practitioner
consent model exists for. That is the argument for preferring a local voice
rather than merely disclosing.

**What this means for the recorded frame.** A recording is the only voice in
this product that is guaranteed not to leave the machine. That is a fourth
argument for Option A that has nothing to do with warmth.

---

## 4. The sound, as numbers

### The family, and its one rule

Every sound in this product is a sine, plus at most one partial, through one
lowpass, at or under 0.09 of full scale. Meaning is carried by two things and
nothing else: **which way the pitch moves, and which side it comes from.**

    a sound that moves down      something leaving
    a sound that moves up        something arriving
    a sound that does not move   a stop
    from the right               the right channel
    from the left                the left channel

That is the whole vocabulary. Four members, because the fortieth hearing of a
fifth one is the hearing that gets the sound switched off for good.

Nothing sits below 150 Hz, where a laptop speaker turns it to mud. Everything
sits between 330 and 900 Hz, which is under the band a voice needs and above
the band a room fills with.

### The rate is the design

A run at the canonical dose speaks six hundred lines. **None of them chimes.**
The earcon marks a boundary, never a beat. A run of any length makes at most
eleven sounds: one at each channel change, one at each cross, one at the
cooldown. That number does not grow with the dose, which is what makes it
survive a twenty minute sitting and a fortieth session.

### The four

**TURN.** The channel changes, right to left or left to right.

    waveform      sine, plus a partial at 2× at 0.10 gain
    frequency     587 Hz in the release half, 784 Hz in the reframe half
    envelope      attack 8 ms, decay to silence at 190 ms
    filter        lowpass 2.2 kHz, Q 0.7
    peak gain     0.06, about 24 dB under full scale
    pan           +0.7 for right, -0.7 for left, and never 1.0
    haptic        12 ms

The 8 ms attack is under the 10 ms threshold where an envelope stops reading
as a swell and starts reading as a click, which is what a change of side
should read as. The pan is 0.7 and not 1.0 because hard panning is
uncomfortable on headphones and collapses to nothing on a laptop pair.

**CROSS.** Release to reframe, at every address.

    waveform      two sines in sequence, 587 Hz then 880 Hz, a rising fifth
    envelope      attack 25 ms each, 220 ms then 420 ms, overlapping by 130
    filter        lowpass 2.8 kHz, Q 0.7
    peak gain     0.09
    pan           centre, and it is the only centred moving sound
    haptic        30 ms, 60 off, 30 ms

The 25 ms attack is the character difference. TURN clicks, CROSS swells. Both
channels have just been addressed, so the cross belongs to neither and is
centred.

**CLOSE.** The cooldown opens.

    waveform      sine 392 Hz, plus a partial at 588 Hz at 0.14 gain
    envelope      attack 40 ms, hold 200 ms, decay 2,400 ms
    filter        lowpass 1.6 kHz, Q 0.7, darker than anything before it
    peak gain     0.07
    pan           centre
    haptic        90 ms

One sustained note as the whole statement. The long decay is what silence
sounds like arriving, and the darker filter is the protocol getting darker as
it closes.

**HALT.** End pressed, or a refusal.

    waveform      sine 330 Hz, no partial
    envelope      attack 6 ms, decay 260 ms
    filter        lowpass 1.2 kHz
    peak gain     0.05
    pan           centre
    haptic        20 ms, 40 off, 20 ms

The only sound whose pitch does not move. Everything else goes somewhere,
which is what makes this one read as a stop.

### The bed, and it is the book's

Two sine oscillators a few hertz apart, panned hard left and right, which is a
binaural beat and needs headphones to be one at all.

    carrier       200 Hz, above the mud floor and inside the 200 to 500 band
                  where a beat is actually perceptible
    release half  200.0 left, 206.0 right, a 6.0 Hz beat. theta.
    reframe half  200.0 left, 210.0 right, a 10.0 Hz beat. alpha.
    crossover     a 12 second linear ramp on the right oscillator, landing on
                  the cross. nothing else in the bed moves, ever.
    gain          0.025, about 32 dB under full scale. a room tone.
    fade          4 seconds in, 3 seconds out

The two frequencies are his, from the binaural section at 2414. **What the bed
claims is nothing.** The entrainment claim belongs to the book and this design
does not restate it as a finding. It is a floor under a voice, set at a level
where a person notices it stop and not that it started. It is a separate
toggle from the voice and is off even when the voice is on.

### Haptics

`navigator.vibrate` exists on Android Chrome and does not exist on iOS Safari,
so this is a layer on one platform and silence on the other. It is not a
parallel design: it is the same boundary, at the same instant, at the same
length as the sound, so a person feeling it and a person hearing it are being
told the same thing. Off by default, its own toggle, and it needs a user
gesture first like everything else.

### The default is silence, and silence loses nothing

- **Off by default.** Voice off, bed off, haptics off. Remembered per person
  and remembered off, through `localStorage`, every read and write wrapped,
  and the page renders correctly when it comes back empty.
- **Turned on and off mid run, without stopping the run.** The controls are on
  the flow surface as well as the panel, because a person discovers at 9pm in
  a quiet room that they left it on, and the answer to that must not be to
  abandon the protocol.
- **Every fact the sound states is on the screen at the same moment.** The
  half and the channel are a heading in words. The side is a lit strip with
  the word on it. The address is a plate with its name, its seat and its
  nerve. The cross is a full change of the card. The cooldown is a surface.
  The line being spoken is the line being displayed. Sound carries nothing on
  its own, ever, and the flow is complete in silence.
- **The first gesture is the hand over.** The browser requires a user gesture
  before an AudioContext will start. That gesture is "When you are ready",
  which is his own hand over from his voice to the synthetic one. The
  technical requirement and the ritual are the same press.

---

## 5. The panel before it begins

His words: "It gives me a popup saying three addresses. It should show me the
ones I had selected, show me the percent, show me where they are, show me what
they cost me, and from my points perspective what I get out of it for this
batch."

All four are figures the engine already has. Nothing on this panel is written
by hand.

### One row per address, naming it

    the ring        the fetter's own icon, stroked and never filled, in the
                    seat colour, with the charge as the arc
                    CHILD[].ic, PAL[n.b], n.sq
    the percent     n.sq × 10, as the value beside the ring
    the name        n.k
    where it sits   n.b and n.n, so "Throat · Vagus Nerve"
    what installs   "toward " + CHILD[].opp
    what it costs   the count of keys in this address from meterPlan

**"Three addresses" does not appear anywhere on the panel.** The rows are the
naming, which is RL1 satisfied by construction rather than by a rewrite.

### The four figures, and none of them is printed twice

    Opens        12 patterns      meterPlan(...).length
    Frees         1.5 weight      the cooldown's own arithmetic, projected
    Planned      16:41            the script, at the pace set below
    Allowance    88 patterns      planAllowance().left minus the cost

**Labels are one word, no comma, and the unit rides on the figure.** Read them
out loud: "opens, twelve patterns", "planned, sixteen forty one".

**On "what I get out of it, from my points perspective."** There is no points
field in the engine and there will not be one. `DESIGN-gamification.md` item
16 settles it: karma, points and patterns were three words for one thing and
patterns won. So the return on a batch is stated in patterns, and it is the
same number as the cost, because in this economy a pattern spent is ground
opened. **Printing it twice under two labels is the defect V17 was written
against**, so it is printed once, as Opens, and one sentence says what it
means: patterns are the unit the allowance is counted in, and a rerun of
ground already open costs nothing.

### Three fields, and the clock answers to all of them

    Passes    1 to 50, default 50      the book's dose, per channel
    Pace      0.5 to 2, default 1      1 is speaking pace
    Gates     1, 3 or 10, default 10   the book's monthly progression

Change any of the three and Planned moves. That is the whole answer to "an
actual time, not a slider": the time is computed from the script the run will
actually speak, and the person changes the script.

### Selecting by density

"Heaviest three" and "Heaviest six" set the selection from `n.sq` descending.
"Change selection" opens a list of everything carrying, each row 52 px, each a
ring with its own icon, pressed state on `aria-pressed`. Default on open is
the heaviest three, which is the popup he described.

### The limit, stated once

The reframe half speaks the coherent opposite as a state, because the engine
carries nine states and not a sentence for each address. See section 7,
question 3.

---

## 6. The flow

The top bar goes. A profile selector in front of somebody mid protocol is a
control that can only do harm.

    the heading       "Release, right channel" or "Reframe, left channel",
                      in words, aria-live polite
    the strips        left and right, full height, the live one lit, each
                      carrying its word: "left, inward" and "right, outward",
                      which is the book at 1042
    the plate         the address, its ring, its seat and its nerve
    the line          the line being spoken, 26ch, no hyphenation
    the dial          angular progress, because a circle has no last place
                      and there is nothing to count
    the clock         Left and Planned, minutes and seconds
    the controls      Pause, End, Voice, Bed

### The script

    opening    his recording, and the page says when it is not there
               "Move your awareness inside your body."
               "Feel what your body is doing mechanically."
               "Keep your awareness inside your body."
               "Each line names one pattern. Follow it in thought as it lands."
    per address, per channel
               the head, once: the full statement at the gate depth chosen
               the passes: the short entries, rotating through let go, give
               up, forgive myself
    the cross  at each address, between its release half and its reframe half
    cooldown   "Stop the work. Stay where you are."
               "The charge moves up the channel and out through the mouth."
               "Notice which place answers."

**The run is address major.** Release then reframe at one address, then the
next. Not the whole selection through release and then the whole selection
through reframe. The reason is at 3656 and it is mechanical: an address left
open is open territory.

### The clock does not lie

Speech synthesis will not say in advance how long it needs, so the first
estimate is words × 0.40 seconds, about 150 a minute, which is an unhurried
instructional rate. From the moment the voice has spoken four lines the
estimate is replaced by the measured average of what it actually took. Within
about a minute of starting, the number a person is reading is a measurement.

### End, and where it ends

End is visible for the whole run and it does not stop the run. It jumps to the
cooldown, plays HALT, and runs the cooldown out. A protocol that opened an
address and then closed the window has left it open, which is the one thing
3656 says not to do.

---

## 7. The port

Nothing in `atuned_src/` was touched. Four seats are live in there. This is the
task list.

**`engine/schema.js`.** No change. `meterPlan`, `meterRun` and `meterRead` are
correct and are called as they stand. `LINES_PER_CH` is 50 and stays 50.

**`engine/plan.js`.** No change. `RUN_MAX` stays a ceiling.

**`engine/data/canon.js`.** One addition, if question 3 is ruled: an embodied
truth sentence per child fetter, or per address, beside `CHILD[].opp`.

**`ui/release.js`.** The whole of it. `relRender` grows a pre-flight branch
that names rather than counts, `RUN` grows `dose`, `pace`, `gates` and the
sound flags, `relTick` is replaced by a step walker driven by the utterance
rather than by a fixed interval, and `OPENING` is replaced by the script in
section 6. The `_pre`, `undoPush`, `meterRun` and `meterFirst` calls in
`relCoolDown` are untouched, and so is the refusal at `S.who!==0`.

**A new `ui/sound.js`,** after `component.js` and before `release.js` in
`MANIFEST`. It holds `audioOn`, `tone`, the four earcons, the bed, `buzz`,
`voicePick`, `voiceSay` and `speak`. It is the only file in the product that
touches `AudioContext` or `speechSynthesis`, and neither may ever appear in
`engine/`: `hostfree.py` already names both and would fail the build, which is
correct and must stay.

**`ui/component.js`.** The sound setting joins the profile rather than
`localStorage`, through the existing `bindStore`, so it survives with
everything else. Reported through `status()` like every other write that can
fail.

**`tests/design.js`.** Gate 7 stays as it is. Add a gate that asserts the flow
renders and completes with sound off, because silence is the default and the
default is the case that must never break.

**`tools/monitor.js`.** The release surfaces are not in `TABDEF`, so the watch
does not see them. Worth a line.

---

## 8. Five questions, and they are his

**1. The audio ruling.** Synthesise everything now and embed his frame at 16
kbps for 160 KB, which is +10.5 per cent on the file and +29 per cent on the
wire? Or hold the frame at 12 kbps for 120 KB, or refuse the recording
entirely and let the synthetic voice open it? Section 2 has all three priced.
The recommendation is the first and the design works under any of the three.

**2. A pattern and a pass are two things, and the ladder prices one of them.**
The book's dose is 200 statements at one address. `meterPlan` opens one line
per channel per run, so the built product's "fifty left and fifty right" is
fifty separate runs and not one sitting. The reading this prototype is built
on is that **a pattern is a unique line of new ground and is what is priced,
and a pass is one spoken repetition and is free**, so a canonical sitting at
one address speaks 200 times and costs 4 patterns. That reconciles the ladder
with the book exactly and it is the only reading where both survive. It needs
his word, because it decides what a tier buys.

**3. The reframe half has nothing to say.** The engine carries nine coherent
opposites as state nouns. The book's declaration form is "I am [coherent
state]", and "I am worth" is not a sentence. The book also says there are 364
embodied truths against 3,800 patterns in Appendix A, which is a table this
product does not have. Until it does, the prototype speaks the state on its
own and states the limit. Does the table come across, or does a sentence get
written per child fetter, or does the state stand as the line?

**4. Left first or right first.** The book says the left channel first. The
code says right. The prototype follows the code.

**5. Twenty minutes is the honest length and he should see it before it is
built.** Three addresses at the full dose is 16 minutes 41 seconds on the
prototype's clock. The controls to shorten it are there and they are real. Is
a sixteen minute default the product, or does the default drop to one address
and the full batch become the thing a person works up to, the way the gates
do?
