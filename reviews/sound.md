# Sound

Eero Vatnajokull. Sound, earcons, haptics. Newest seat, least settled, and the
brief was right to say so.

Five passes, not merged. The order is deliberate: establish what is there,
then the one moment that has a real defect, then the set, then what the
platform can actually deliver, then the case for leaving it alone. The
recommendation at the end is smaller than the analysis, which is how it should
be in this discipline.

---

## What exists now, measured

**There is no audio in this product. None.** Verified rather than assumed.

Searched `atuned_src/`, `tools/` and `tests/` for `AudioContext`,
`webkitAudioContext`, `OscillatorNode`, `createOscillator`, `createGain`,
`BiquadFilter`, `GainNode`, `<audio`, `new Audio`, `decodeAudioData`,
`AudioBuffer`, `data:audio`, `.wav`, `.mp3`, `.ogg`, `navigator.vibrate`,
`vibrate`, `earcon`, `chime` and `beep`.

Every hit is prose. `drills.js:195` renders a panel labelled "What it sounds
like", which is text about a saboteur's speech. `practice.js:62` is a practice
called ten minutes on sound. `kb.js` uses "sounds like" in saboteur
descriptions. `numerology.js` has the Y rule, where Y is a vowel when it
carries the sound. `map.js:17` is `im.src=src` on an image. Not one byte of
the build makes or moves audio.

**Zero embedded audio.** Two base64 payloads in `source.html`: the Inter
variable font at 64,351 bytes, and a 7 byte fragment. Build is 1,042,162
bytes. The font is 6.2 percent of it and is the only heavy embed.

**Zero haptics.** No `navigator.vibrate` anywhere.

### The `hz` and `src` fields on the seats

`atuned_src/engine/data/practice.js:114-120`, `FLOWSEAT`. Seven entries, each
with `src` and `hz`.

`src` is a page number in the source codex. Crown 26, Brow 90, Throat 188,
Heart 276, Solar 372, Sacral 438, Root 502. It is a citation. It renders as
text at `ui/mapshelf.js:134` in the form `source 502`.

`hz` is a frequency. Root 396, Sacral 417, Solar 528, Heart 639, Throat 741,
Brow 852, Crown 963. **Nothing plays it.** It renders as text in exactly two
places:

    ui/analytics.js:249   s2.p.sk+' · '+s2.p.nv+' · '+s2.p.hz+' Hz'
    ui/mapshelf.js:134    sd.sk+' · '+sd.hz+' Hz · source '+sd.src

That is a label, not a signal. Which means the product already prints
frequency numbers to a person with no sound attached to them, and I have a
problem with how it prints them. See pass three.

### Two defects in my seat that exist today and are not audio features

**One. The record button ships the person's spoken story off the device.**
`ui/storyui.js:224` reads `window.SpeechRecognition||window.webkitSpeechRecognition`.
This is audio input, so it is mine.

In Chrome, Edge and Safari, `SpeechRecognition` is not on device by default.
The captured audio is streamed to the vendor's speech service and the
transcript comes back. The code already knows this. `storyui.js:218` carries
the error string "Speech recognition could not reach the network."

This product removed Google Fonts because "every load sent the person's IP to
Google before they had typed a word, in a product that holds somatic and
psychological self report and promises nothing leaves the device"
(`DECISIONS.md`). The record button is the same class of defect and it is
worse by a wide margin. An IP address is metadata. This is the story itself,
in the person's own voice, at the moment they are describing the thing that
hurt them.

`tests/design.js` gate 7 cannot catch it. It watches `p2.on('request')`, which
sees document subresource requests. A browser speech service is an internal
platform call, not a page request. Gate 7 will stay green while the microphone
uploads.

There is a partial remedy. Chrome has shipped on device recognition behind
`SpeechRecognition.available()` and a `processLocally: true` flag. It requires
a model download, which is itself a network fetch, and it is not available
across the board. So the honest options are: gate the button on
`processLocally` succeeding and refuse to record otherwise; or remove the
button; or keep it and say in the copy, at the button, that recording sends
audio to the browser vendor. Silence about it is the only option that is not
available, because the promise is already made elsewhere in the product.

Not my call which. Mine to report, and I am reporting it as the highest
priority item in this file, above everything else I recommend.

**Two. `hostfree.py` does not ban the audio host objects.** The ban list at
`atuned_src/hostfree.py:11-12` is:

    document window navigator localStorage sessionStorage
    requestAnimationFrame alert fetch XMLHttpRequest   new Image

`AudioContext`, `webkitAudioContext`, `speechSynthesis`, `SpeechRecognition`
and `webkitSpeechRecognition` are bare globals, not properties of `window`, so
`new AudioContext()` inside `engine/` would pass the gate today. `navigator`
is banned, so `navigator.vibrate` is already caught. One line fixes the rest
and it should be fixed before any audio is written, not after.

---

## Pass one. Every moment that should be heard or felt, and is silent

Ten classes of moment. The test for each is the first question I ask of
anything: does sight already carry it.

| Moment | Where | Does sight carry it | Verdict |
|---|---|---|---|
| Tab switch, eight tabs | `setTab` | Completely. The whole screen changes | Silent, correct |
| Commit a story | `storyui.js:70`, `stapply` | Yes. Field redraws, imprints clear, status writes | Silent, correct |
| Undo, redo | `engine/undo.js` | Yes, and better than any sound could. The state itself returns | Silent, correct |
| Wheel drag writes a value | `ui/wheel.js` | Yes, continuously | Silent, correct, and a sound here would be the worst decision available |
| Intake question advance | 63 questions | Yes | Silent, correct. A click 63 times is the fatigue case and Dariusz abandons at question nine already |
| Pinch, double tap, reframe | mobile pass | Yes | Silent, correct |
| A mark or a first is earned | `engine/ladder.js`, `meterFirst` | Yes, it prints | Silent, **and it should stay silent**. Pass three says why |
| An address clears entirely | `release.js`, `x.cleared` | Yes, in the log | Silent, correct |
| **A write fails** | `component.js:153`, `status(msg,'fail')` | **Only if the person is looking at the status region** | **Silent, and this is a genuine gap** |
| **A release line advances** | `release.js`, 2.2 seconds a line | **Yes, and that is the problem** | **Silent, and this is the defect.** Pass two |

Eight of ten are correctly silent and I would fight to keep them that way. The
instrument is not short of sound. It is short of undo, which the brief already
names as the largest gap, and it carries 57 to 71 simultaneous choices per
screen against a working memory of about four.

Two are real.

**The failure case.** `status()` has one writer, which is correct design. A
failure stays on screen until something replaces it, which is also correct.
Four call sites pass `'fail'`. The strongest is `statusSaved()`:

    'Not saved. Storage is full or blocked, so this session will not survive
     a reload.'

That is the single most consequential sentence the product ever writes. A
person who has just entered a story, watched the field move, and scrolled down
to read the reading will not have their eyes on the status region when it
appears. Then they reload and the work is gone. This is an accessibility
argument and not a texture argument, and it is the only place outside the
release where I would argue for a sound on merit. It is second in my minimum
set for that reason.

**The release.** Its own pass.

---

## Pass two. The release protocol

This is the one moment where a body is doing something and the interface says
nothing, and the brief is right that it is undesigned. It is also not primarily
a sound problem. It is a defect that sound happens to be the cheapest fix for.

### The mechanism, measured

`ui/release.js`. `RUN.speed = 2.2` seconds. Four phases.

- `opening`: `OPENING` is seven lines, one per tick. 15.4 seconds. Skippable.
- `run`: one tick is one thought line. `RUN_MAX` is 25 (`engine/plan.js:42`).
  Ceiling 55 seconds. Floor 2.2 seconds.
- `done`: `relCoolDown()`. The largest single write the product makes. Weight
  removed at 21 percent plus 2, the coherent opposite installed at 62 percent
  of what was removed, an `undoPush` before it, a meter charge, dated firsts.
- Plus the plan preview before it starts, which prints the cost.

So the audible window is between 2.2 and 70.4 seconds. A full run is about
seventy seconds. That is the whole surface.

### The contradiction, stated plainly

`OPENING`, verbatim:

    Welcome to release and reframe.
    We will be here for a few minutes.
    Find a quiet space. Sit back and relax,
    and turn your senses inward to feel what is released.
    As the words repeat, follow along in thought.
    Feel what the body is doing as the energy goes.
    Let us begin.

Turn your senses inward. Feel what the body is doing.

Then the mechanism advances a line every 2.2 seconds on a screen, and the
screen is the only clock. A person cannot turn their senses inward and also
watch a counter tick. Those two instructions are not both obeyable. The copy
asks for interoception and the interface demands visual attention as the price
of staying in step.

That is the defect. It exists whether or not this product ever makes a sound.
There are exactly three ways to close it:

1. **Change the copy** so it stops asking for something the interface
   forbids. Cheapest. Also the worst, because the copy is describing the
   mechanism the owner ruled: resistance, barrier, release, relief, calm,
   peace, felt at a named location. Deleting the instruction deletes the
   method.
2. **Make it self advancing.** A tap per line. Then the person sets the pace
   and can keep their eyes shut between taps. This works, costs nothing, and
   turns a seventy second run into an act of 25 deliberate taps. It also
   breaks the pacing that the 2.2 second grid guarantees, and a person who
   stalls on a hard line stalls with nothing carrying them.
3. **Give it a clock that is not visual.** One short sound at the line
   boundary. The eyes can close. The pacing is preserved. The screen keeps
   carrying everything it carries now for anyone who has sound off.

Only the third preserves what the copy is for. That is the entire argument for
audio in this product, and I do not have a second one of the same strength.

### Three routes for the release, and two are refused

**Voiceover, reading the lines aloud. Refused, and refused by a standing
ruling rather than by my taste.** `DECISIONS.md`, the key ruling:

> It is not spoken line, it is one thought line. And as one thought line, it
> targets the address by way of the channel.

> A thought line, not a spoken one. Reading it in thought spends it. Nothing
> in this product requires a person to say anything out loud and no count may
> imply that it does.

A voice that reads the line converts a thought line into a spoken one at the
level where a person experiences it, and it takes the work off them. The
barrier is the point. A line a person reads meets resistance. A line read to
them by a device is something they receive.

The arithmetic also refuses it. 107 releasable addresses by 4 channels by 50
lines is 21,400 distinct sentences of new ground. Nothing recorded can cover
that at any byte budget. `speechSynthesis` could, and `speechSynthesis` is
host TTS: the voice, the rate, the prosody and the availability differ per
platform and per installed voice set. A 2.2 second grid stops being a grid the
moment its content is spoken by a stranger's voice at a rate you do not
control. So voiceover is refused three times over: by ruling, by byte cost,
and by pacing.

**A drone under the run. Refused, by me.** This is the one I expect the owner
pictures when he says the audio portion. Seventy seconds of a sustained tone
at the seat frequency, the Eno register, music that rewards attention without
demanding it. I know that register well and I am refusing it here.

A person listening to a tone is listening to a tone. The product's stated
mechanism is a barrier felt at a location in the body, then tension leaving
that location. A continuous external stimulus is a competing signal in the
same attention channel as the thing the person is being asked to notice. It
does not support interoception, it masks it. Ma is the argument in the
positive direction: the gap is the content. A pace mark at 90 milliseconds
followed by 2,110 milliseconds of nothing is 96 percent silence, and the
silence is where the work happens. A drone has no gap, so it has no content.

**A pace mark. Accepted.** One sound at the line boundary. It does not say
what the line is, it says the line advanced. It is the only sound in this
product that carries information the screen cannot carry to a person who has
been told to stop looking at the screen.

### Two things the release already gets right

WCAG 1.4.2 Audio Control: any audio that runs longer than three seconds needs
a mechanism to pause or stop it. A release run is up to seventy seconds, so it
applies. `relRender` already draws Pause and Stop in the `run` phase. The one
surface that needs sound most is the only one already compliant with the rule
that sound would invoke.

Autoplay policy: an `AudioContext` created before a user gesture starts
`suspended`. `relgo` is a click. So the context is created and resumed on the
Begin button and nowhere else, which is exactly where the architecture wants
it. The browser's restriction and this product's rule that audio never
autoplays are the same seam, so one piece of code satisfies both.

---

## Pass three. Earcons, the smallest useful set

The number of sounds in a good interface is between two and six. Most products
ship thirty and are unbearable by the second week. I am arguing down from six.

### The grammar first, because a set without a rule is a pile

One rule, three variables. A sine oscillator at a seat frequency, an
exponential decay tail, a low pass filter set at a multiple of the
fundamental. What differs between members is register, envelope and whether it
is one voice or two. Same rule, different sense, which is exactly how the icon
set works: ring not fill, one family, a colour per family, the colour argued
from something meaningful.

The family means **the instrument is working**. Every member is a sine inside
the seat set.

One sound sits deliberately outside the family. The fault is a square wave at
311 Hz, which is below the lowest seat and is not a seat frequency at all. It
reads as wrong because it does not belong, and that is the whole design. A
person does not have to learn what it means. It is the only thing in the set
that is not one of the others.

### On the seat frequencies, and this matters

The `hz` values are the solfeggio set. 396, 417, 528, 639, 741, 852, 963.

**The claim attached to these numbers in the source material is not one this
product should make to a person.** There is no evidence that a 396 Hz tone
acts on the lumbar plexus, or on the pelvic floor, or on anything in a seat
specific way. The frequencies are a numerological construction, not a
physiological one. The product's standing rule is that it never claims more
than it can show, and this is a place where the claim is inherited rather than
made, which is the easiest kind to ship by accident.

Two consequences.

**For the audio, if it is ever built.** I will use them, as a tuning system
and nothing more. Seven numbers that already exist in the data, already map to
the seven seats, and already match the colour system, so the audio and the
palette are keyed to one thing instead of two. That is a real benefit and it
is a consistency benefit, not a physiological one. Any copy that names a
frequency says which it is.

They also happen to be acoustically usable, for reasons unrelated to why the
source gives them. Interface sound lives between 400 Hz and 4 kHz, off the
speech band where it competes, and never below 150 where it turns to mud on a
laptop speaker. The set runs 396 to 963. The bottom is 4 Hz under my floor,
which is nothing, and its harmonics carry it on a small driver anyway. Nothing
is near 150. The set is fine. That is luck.

**For what is on screen now, and this is a live honesty item.** The build
already prints these numbers to a person:

    ui/analytics.js:249   Sahasrara · Cranial plexus · 963 Hz
    ui/mapshelf.js:134    Muladhara · 396 Hz · source 502

A frequency printed immediately beside "Cranial plexus" and "L1 to L4, into
the pelvic floor" borrows the anatomy's credibility by adjacency. No sentence
makes a claim. The layout makes it. Either the number gains a qualifier naming
it as a tuning reference from the codex, or it loses the anatomical
adjacency, or it goes. This belongs in `BOOK-ERRATA.md` as a place the codex
and the product should diverge, and it is mine to raise because the numbers
are mine.

### The six candidates, and three are refused

**1. Mark. The line advanced. KEEP, unconditionally.** Pass two is the whole
argument. It is the only sound in this product that carries information no
visible thing can carry to a person who has been correctly instructed to look
away. Fires in one place, `relTick` in the `run` phase.

**2. Fault. A write failed. KEEP.** Pass one. Four call sites. The save
failure is the one message a person must not miss and is the one they are most
likely to miss, because it appears in a region they have scrolled past. This
is an accessibility argument. It also does not need the person to have opted
in for information to reach them, because the text is there either way, which
satisfies the rule that sound is never the only carrier.

**3. Seal. The run closed. WEAK KEEP.** The cooldown is the only place in the
product where something irreversible has just finished and the person was
explicitly told to have their attention off the screen. They need to know it
is over without opening their eyes. That is a real job and nothing else does
it. It is weak because the cooldown also prints a full report, so a person who
opens their eyes at any point in the next minute finds out anyway. Ship it
third or not at all.

**4. Cleared. An address cleared entirely. REFUSED.** `relCoolDown` marks
`cleared` when weight falls to 6 or below. A distinct chime per cleared
address, inside a seventy second run, is a slot machine. Variable reward on a
variable schedule, in a product that reads a nervous system. The game
director already refuses that class of pattern and quotes the retention cost
of refusing it. I am refusing it from the audio side for the same reason and
adding the acoustic one: the moment you have two sounds inside one run, a
person starts listening for the better one instead of feeling what is
happening in their body. The run has one sound or it has none.

**5. Commit. The story baked in. REFUSED.** Sight carries it completely. The
person just typed into a box, so their eyes are on the screen by definition.
The field redraws, the imprints clear, the status writes. Nothing is missing.

**6. Mark earned, badge, first. REFUSED, and put it in the Bible as refused.**
The ladder's own rule is throughput, never outcome. A chime on an achievement
is an outcome flourish and it is the single most common way a product like
this becomes something a person resents. Derek screenshotted the word Severe
into a group chat and never opened the app again. If the app had made a
pleased noise at him while it said Severe, that is a different screenshot and
a worse one.

**The minimum set is three. Two of the three fire inside one overlay.** The
entire audio surface of this product is one modal and one error path. That is
the honest answer and I am satisfied with it.

---

## Pass four. Haptics on mobile

### What the web can actually deliver

**`navigator.vibrate(pattern)`. The Vibration API. That is the whole
inventory.** There is nothing else. No amplitude, no sharpness, no Core
Haptics equivalent, no Taptic engine access, no `impactOccurred`.

Support, honestly:

| Platform | Vibration API | Reality |
|---|---|---|
| Android, Chrome / Edge / Firefox / Samsung | Yes | Works. This is the only place it works |
| iOS Safari | **No** | Never implemented. Not on the roadmap. Apple has declined it |
| iPadOS | No | Same |
| Desktop Chrome | Method may exist | Does nothing |
| Desktop Safari, Firefox | No | Nothing |

**Haptics on the open web are Android only.** For this product that is the
wrong half of the audience. Sofia is the practitioner, Diane is the founder,
James is the C-suite case. Practitioners and executives skew iOS. The
persona most likely to get haptics is Priya at 28, and 28 is not this
product's centre.

Two further constraints.

**The API is binary.** A pattern is an array of on and off durations in
milliseconds. `[8]` is a tick. `[0,18,60,18]` is a double tick. That is the
entire expressive range: length and count. You cannot build a haptic family
the way you build an earcon family, because a family needs at least three
distinguishable variables and this has two. Two variables support two haptics
and no more. Anyone who proposes a haptic vocabulary on the web is describing
something the platform cannot render.

**It needs user activation.** Chrome ignores `vibrate()` on a page the person
has not interacted with. The release's Begin button supplies it. Same seam as
the `AudioContext` resume, so one gate serves both and neither needs its own.

### My rulings for this seat

**Reduced motion suppresses haptics.** Not in any spec. My call. Vestibular
sensitivity and tactile sensitivity overlap enough in the same people that a
person who has asked the operating system for less movement should not get
buzzed by a web page. `REDUCED` already exists at `component.js:299`, so this
costs one condition.

**Haptics can never be the primary carrier here, because they reach one
platform.** They are paired reinforcement where present. Sound and haptics are
one design or they fight, so every haptic in this product rides inside the
call that makes its sound, on the same line, never as its own scheduled event.
That way there is no drift and there is nothing to choreograph.

**The iOS checkbox trick is refused.** There is a widely reported behaviour
where a `<label for>` pointing at a hidden `<input type="checkbox" switch>`
fires a system haptic on iOS 17.4 and later. It is an undocumented side effect
of a control, not an API. It can be removed in any release. It fires on the
toggle rather than at the moment you want. And a seventy second paced run
would require toggling a checkbox 25 times, which is not a thing. Naming it
so nobody spends a round discovering it.

### Where haptics genuinely beat sound

One place, and it comes from the mobile pass, item seven: long press on the
wheel to add to a selection. A long press has no visible threshold. That is
what a long press is. Sound at the threshold is the wrong modality because it
is a private interaction with a fingertip, and a 10 millisecond tick is the
standard and correct answer on Android.

On iOS there is no answer on the open web. Which means the visible
confirmation, the nameplate lighting at threshold, has to exist regardless. So
the haptic is pure reinforcement and the product is not measurably worse
without it. That is the shape of every honest haptics decision in this
product: build the visible answer, then add the tick on the one platform that
has one, and never let the tick carry anything.

### Byte cost

The `hap()` wrapper is one line, 118 bytes, including the reduced motion
check and the try/catch. It is inside the 1,035 byte figure in the next
section.

---

## The minimum set

Three sounds. Synthesis only. Written and measured, not estimated.

Shared recipe for all three: one `OscillatorNode` into one `BiquadFilterNode`
(lowpass, Q 0.7) into one `GainNode` into destination. Gain envelope is
`setValueAtTime(0)`, `linearRampToValueAtTime` to peak over the attack, then
`exponentialRampToValueAtTime(0.0001)` at the end. Peak gain is the stated
figure times a master of 0.18, which is quiet on purpose. A sound a person has
to lean toward is a sound they can live with at the four hundredth hearing.

### 1. Mark. A thought line advanced

    waveform    sine
    frequency   639 Hz            Heart. The mid of the seat set
    duration    90 ms
    attack      4 ms              under 10 ms, so it reads as a click, not a swell
    filter      lowpass 3,834 Hz  6x the fundamental, Q 0.7
    peak gain   0.5 x master      = 0.09
    haptic      [8]               Android only
    fires       relTick, run phase, once per line. Max 25 per run
    carried by  the visible line counter, "12 of 25 patterns", which stays

    snd(639, 90, 4, 6, 0.5)

90 milliseconds inside a 2,200 millisecond tick is 4 percent sound and 96
percent silence. That ratio is the design. A tick at 639 with a 4 millisecond
attack is a wooden sound rather than a bell, which is deliberate: a bell rings
into the gap and a tick does not, and the gap is where the person works.

### 2. Fault. A write failed

    waveform    square            the only non-sine in the set, deliberately
    frequency   311 Hz            below the lowest seat. Outside the family
    duration    180 ms
    attack      3 ms
    filter      lowpass 622 Hz    2x. The square's upper harmonics are cut, so
                                  it reads blunt rather than harsh
    peak gain   0.6 x master      = 0.108
    haptic      [40]
    fires       status(msg,'fail'). Four call sites today
    carried by  the status text, which already stays until replaced

    snd(311, 180, 3, 2, 0.6, 'square')

It is the only member that is not a sine and not a seat frequency. It sounds
wrong because it does not belong to the set. Nothing has to be learned.

### 3. Seal. The run closed

    waveform    two sines, together
    frequency   528 Hz at 0.6 gain, 639 Hz at 0.35 gain
                Solar and Heart. A perfect fourth, 4:5 approximately
    duration    700 ms both
    attack      60 ms on the 528, 180 ms on the 639
                staggered, so the interval arrives rather than starting
    filter      lowpass 4x, Q 0.7
    peak gain   0.6 and 0.35 x master
    haptic      [0,18,60,18]      a double, which is the only other thing the
                                  Vibration API can say
    fires       relCoolDown, once
    carried by  the full cooldown report, which prints regardless

    snd(528,700,60,4,0.6); snd(639,700,180,4,0.35)

A 60 millisecond attack is over the 10 millisecond click threshold and under
the 60 millisecond swell threshold, sitting exactly on the line, which is the
character wanted: something that lands rather than arrives, but does not snap.
The staggered second voice means the interval opens during the sound instead
of being present at its start. That is the difference between a chord and a
settle.

### Byte cost

**Measured, from a written module, not estimated.**

| Route | Bytes | Share of the 1,042,162 byte build | Against Inter's 64,351 |
|---|---|---|---|
| **Three voices synthesised, code only** | **1,035** | **0.099 percent** | 1.6 percent of the font |
| Plus the switch and its persistence | 1,455 | 0.140 percent | 2.3 percent of the font |
| Six voices synthesised, with comments | 2,207 | 0.212 percent | 3.4 percent of the font |
| Same three as 44.1 kHz 16 bit mono WAV, base64 | **114,072** | **10.9 percent** | **1.8 times the font** |
| Six as WAV, base64 | 299,880 | 28.8 percent | 4.7 times the font |
| Six at 22.05 kHz, base64 | 149,900 | 14.4 percent | 2.3 times the font |
| Six as 96 kbps MP3, base64 | 40,800 | 3.9 percent | 0.6 times the font |

**Synthesis is 110 times cheaper than the same three sounds as WAV.** Not a
judgement. 1,035 bytes against 114,072.

44.1 kHz 16 bit mono is 88,200 bytes a second raw and 117,600 as base64.
Every 100 milliseconds of embedded audio costs 11,760 bytes, which is 18
percent of the entire typeface. The brief is right that a single short WAV
would dwarf the font. Three of them would be 1.8 times it.

MP3 at 96 kbps is the only embed that is not absurd on size, and it fails on
three other counts. It needs `decodeAudioData`, which is asynchronous, so the
first mark in a run either arrives late or the whole blob decodes at load in a
product that must never touch audio until a gesture. Codec support for a
base64 blob varies by browser build. And a sample is inert: 40,800 bytes that
cannot be retuned, where 1,035 bytes of synthesis can have its envelope
changed in one number after the owner hears it at 9pm and says it is too
bright.

**Synthesis is the only honest route. It is not close.**

### The switch

- `SNDON` defaults to `false`. Not a preference default, a hard default.
- Persisted through `bindStore`, so it survives a reload. A person who turns
  it off once never sees the question again.
- **One control. In Settings. Off, and off means off.** No per sound
  granularity, no volume slider, no "quiet mode". Three sounds do not need a
  mixer, and every extra control is another thing that can be left in the
  wrong position.
- The `AudioContext` is created inside `sndCtx()` on the first call that asks
  for a sound, which can only happen after a click, and never at load. If
  construction throws, `SNDON` is set back to false and nothing tries again.
- Every sound has a visible carrier, named in the table above, and the
  carrier is not conditional on the sound. Sound is never the only carrier of
  information. Ever.
- `REDUCED` suppresses haptics. It does not suppress sound, because reduced
  motion is a movement preference and not a hearing one, and conflating them
  takes a choice away from someone who made a different one.

---

## Haptics

Consolidated, because the brief asks for it in one place.

**Available on the web today: `navigator.vibrate(pattern)`. That is all.**

**Works on:** Android, in Chrome, Edge, Firefox and Samsung Internet.

**Does not work on:** iOS Safari, iPadOS, any desktop browser in any
meaningful sense. iOS has never implemented it and Apple has declined to.

**Cannot express:** amplitude, sharpness, curve, texture, continuous
envelopes. Anything Core Haptics does. A pattern is on and off durations in
milliseconds and nothing else.

**Can express:** exactly two things. A tick, `[8]`. A double, `[0,18,60,18]`.
That is the vocabulary and it is not extensible.

**Needs:** prior user interaction with the page. The Begin button supplies it.

**In this product:** two haptics, both riding inside the sound call that
already exists, never scheduled independently. `[8]` on Mark, `[40]` on Fault,
`[0,18,60,18]` on Seal. Suppressed under `prefers-reduced-motion`, which is my
call and not a standard.

**What haptics can never be here:** the carrier. They reach one platform, so
anything that depends on them fails silently for the half of the audience that
matters most to this product's revenue.

**Byte cost:** 118 bytes, inside the 1,035.

**Refused:** the iOS `<input type="checkbox" switch>` haptic side effect.
Undocumented, removable, fires at the wrong moment, and cannot be used 25
times in a paced run.

---

## The case against

Made properly. It is stronger than the case for, and it very nearly wins.

**One. Sound is the only modality that leaks to other people in the room, and
this product's entire promise is that nothing leaves the device.**

This is the strongest argument in the file and it is not a metaphor. Every
other decision here is built on a privacy promise: the name never leaves the
device, a key replaces it, the record is never held joined to the story,
Google Fonts was removed over an IP address. Sound leaves the device by
definition. It travels through the air to whoever is within earshot.

The product renders words like Severe and Collapsed in the largest type on the
screen. A person reading that at a desk in an open office does not want the
device to make a noise at the moment it lands, because a noise recruits a
second person's attention to a first person's private reading. Somebody
reading their own somatic diagnostic at their desk does not want it chirping.

**Two. The fortieth hearing, and it is worse than the fortieth.**

Tier one is 400 patterns a month. At `RUN_MAX` 25 that is 16 full runs a
month, which is 400 marks a month and 4,800 a year. Any sound heard 4,800
times is either invisible or unbearable, and the difference between those two
outcomes is a few decibels and a few milliseconds. I can specify the numbers.
I cannot validate them from here. Tuning a sound that fires 4,800 times a
year per person requires the owner's ear, in a quiet room, at 9pm, on a phone
speaker and then on headphones, and it requires him to come back on day four
and say whether he still likes it. Shipping an unvalidated sound 4,800 times
a year is a larger risk than shipping silence.

**Three. A sound on a fixed grid is entrainment, and entrainment is a claim.
I cannot fully dispose of this objection.**

A mark every 2.2 seconds is a pulse at 0.45 Hz. A regular auditory pulse in
that range pulls breathing toward it in some people. That is a real and well
described effect. If the product puts a metronome under a release, it has
built a breath pacer and not labelled it one, which is the exact class of
unstated mechanism this product has a standing rule against.

The partial answer is that the 2.2 second grid already exists visually, so the
sound adds no rhythm the interface did not have. The partial answer is not
complete, because a visible grid does not entrain respiration and an audible
one plausibly does. I am stating the objection as unresolved rather than
pretending I have beaten it. If the mark ships, somebody should decide
deliberately whether a 0.45 Hz pulse is a thing the product intends, and if it
is, say so in the copy.

**Four. Silence is already the product's aesthetic, and it is working.**

Shibui: nothing competes for attention, so the work becomes the most
interesting thing in the room. The work here is a person's own nervous system.
Anything the interface emits competes with that. Ma: the gap is the content.
A seventy second run with 25 marks in it has 25 interruptions of the gap. I
can argue the ratio is 96 percent silence and I believe that argument. The
counter argument is that 100 percent is also available and costs nothing.

**Five. The opportunity cost, and this is the honest killer.**

Undo is named the largest remaining gap. Cognitive load is 57 to 71
simultaneous choices per screen against a working memory of about four, and it
is architectural. The compass is a D trending D plus. Glass is a C. Angela is
the volume case and she never reached the wheel. Dariusz abandons at question
nine of sixty three.

Every one of those is a defect a person hits in their first session. Audio is
a dimension no person has ever missed, because no person has ever heard it.
There is no entry in `FEEDBACK-log.md` asking for sound. Nobody in
`PANEL-usability.md` mentions it across nine personas and five questions each.
The correct answer for a product with a D grade surface and an unsolved
cognitive load problem is not a new modality.

**Six. The one that survives all five.**

The interoception contradiction in pass two is not a sound problem. It is a
defect in a shipped surface. The copy instructs a person to take their
attention off the screen and the mechanism makes the screen the only clock.
That defect exists today, in the build, and it will still be there after undo
ships and the compass gets to a C.

Sound is the cheapest of the three available fixes and the only one that keeps
the copy's method intact. So the case against sound wins everywhere except
one place, and in that one place it does not lose on taste, it loses on a
seventy second window where the product tells a person to close their eyes and
then punishes them for it.

### Tissue test

Sampled against the nine personas in `PANEL-usability.md`, three passes.

First pass found the obvious: most would never notice.

Second pass found the split. **Sofia, 41, puts the screen in front of a
client.** Her standing refusal is "I cannot put a screen in front of a client
that says BPD next to a bead." A chime during a client session is the same
class of objection and it is worse, because it intrudes on a container she is
professionally responsible for. **James, 57, C-suite, at a desk with an
assistant nearby,** is already a RESIST. A sound at the moment his screen says
Severe closes the tab. **Vesna, 68, thirty years in air traffic control, puts
her phone in a drawer at 20:00, likes tools with one moving part and being
told a number and its error bar in the same sentence.** She is the one persona
with a trained response to auditory cues in a console environment, she reads
the whole manual so she would find the switch, and she would use a pace mark
during a release exactly as intended. She is also the persona most offended by
a decorative chime. **Dariusz, 54,** abandons at question nine of sixty three
on a phone, which is precisely the case a per question click would break.
**Derek, 39,** screenshotted Severe into a group chat.

Third pass found the real thing, and it changed what I am recommending.

**The requirement is not "what sound should we make". It is "prove it is
off."** Two of the three highest value personas need a guarantee of silence in
front of another human being, and one of them is the referral channel. One
persona in nine has a genuine use for exactly one sound. That is a one in nine
adoption case against a two in nine hard refusal case, and the two refusals
carry the revenue.

Which is why the switch matters more than the sounds, why the default is off
and not merely off at first run, and why the set is three and not thirty.

---

## Recommendation

**Build no audio now.** Three things instead, none of which is an audio
feature, all of which are in my seat:

1. **Resolve the `SpeechRecognition` leak** at `ui/storyui.js:224`. Gate it on
   `processLocally`, remove it, or say at the button that recording sends audio
   to the browser vendor. It is a privacy defect of the same class as Google
   Fonts and a larger one by content, gate 7 cannot see it, and the code
   already carries a network error string that admits it. Highest priority
   item in this file.
2. **Add `AudioContext`, `webkitAudioContext`, `speechSynthesis`,
   `SpeechRecognition` and `webkitSpeechRecognition` to `hostfree.py:11`.**
   One line. Before audio is written, not after.
3. **Fix the frequency adjacency** at `ui/analytics.js:249` and
   `ui/mapshelf.js:134`. A number printed next to "Cranial plexus" makes a
   claim by layout that no sentence makes. Qualify it, move it, or drop it,
   and log it in `BOOK-ERRATA.md`.

**Then, and only when the release protocol is next opened for other reasons:
build the Mark. One sound.** 1,035 bytes including the switch scaffold and the
haptics wrapper, 0.099 percent of the build, off by default, one control in
Settings, and the visible line counter keeps carrying the information for
everybody who never turns it on. It exists to close a defect that is in the
build today, not to add character.

**Fault second,** when somebody argues the save failure accessibility case on
its own merits, which is an argument I would support but which is not mine to
open.

**Seal third, or never.**

**Refused, and these belong in `BIBLE.md` so no round is spent re-arguing
them:** voiceover on release lines, refused by the thought line ruling. A
drone or ambient bed under a run, refused because it masks the interoception
the mechanism depends on. A chime on a cleared address, a badge, a mark or a
first, refused as a variable reward pattern on a product that reads a nervous
system. A sound on tab switch, story commit, undo, wheel drag or intake
advance, refused because sight already carries all five completely.

**Not settled and not mine:** whether the release's 2.2 second grid should
become self advancing on a tap instead, which would close the same defect
without any audio at all and is a better answer if the owner wants one. It
costs the guaranteed pacing. That is an owner call and I would not fight the
outcome either way.

**On character and stylization.** The owner wants both and sound is the
largest unbuilt surface, so this reads as a refusal of the brief. It is not.
The character of a quiet instrument is its quietness, and the way sound
delivers character here is three sounds a person barely notices and would miss
if they went, not a palette they admire. A product that reads a nervous system
earns its character by not startling anyone. Thirty sounds would be
stylization. Three is style.

---

## Grade

**The audio dimension now: C minus.**

Not F. F means built badly, and nothing is built. Silence is the correct
default for this product, the absence is coherent with both its aesthetic and
its privacy promise, and eight of the ten moments that could be heard are
correctly silent. The product is not worse for having no audio at any moment
except one.

The minus is earned, and earned twice. The microphone button sends a person's
spoken story to a browser vendor in a product that promises nothing leaves the
device, and that is an audio surface defect that exists in the build today.
And the frequency labels assert numbers beside anatomy without saying what the
numbers are, which is a claim made by layout.

If the question were only "is there an audio design", the answer would be F
and the grading would be wrong, because the useful question is whether the
product is worse for the silence. It is worse in one seventy second window and
nowhere else.

**Ceiling: B.**

Not A, and the reason is structural rather than a matter of effort. An A in
this discipline needs one of two things: a signature the product is known by,
or sound carrying information nothing else carries. This product can have
neither.

It cannot have a signature, because it must be usable in an open office at the
moment it prints a private reading, which caps both loudness and frequency of
use below the level at which a sound becomes recognisable.

It cannot have sound carry unique information, because of the standing rule
that sound is never the only carrier, plus haptics reaching only Android, plus
off by default meaning most sessions never hear it. A modality that is off by
default and duplicative by rule tops out at excellent when present and
invisible when absent. That is a B.

**What moves the grade, stated so the next review can check whether it did.**

- Resolving the microphone leak and the frequency adjacency: **C minus to C
  plus.** Both are honesty items, both cost near zero, neither requires a
  sound to exist.
- The Mark, shipped, off by default, well tuned, closing the interoception
  defect: **C plus to B minus.**
- Fault added, with the save failure case argued and accepted: **B minus to
  B.**
- The 0.45 Hz entrainment question answered deliberately rather than
  inherited, and the answer written down: **B to B plus.** This is the only
  route past B and it is an honesty move, not an audio one, which is the
  correct shape for this seat in this product.

A is not available and I would rather say so than promise it.
