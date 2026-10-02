# Pass 3: innovation director (Rua Whitmore), round PJ

Terms: the "gate" is the one screen where the clock stops. The "sniffer" is the code that reads a story for distress. `parseStory` is the engine function that reads a sentence and files charge onto addresses (places in the body map).

## 1. THE PROPOSAL AS I UNDERSTAND IT

The first frame is the standing figure on a black stage. Five silent slides play on one clock, then one decision (twelve starting points) waits with no timer, then the person writes one true sentence, it is read back, a 12 line release runs, and they land on the Field. The first release is the onboarding, and the old card tutorial becomes aftercare.

The lead's merge kept what I fought for: no tutorial, the sniffer as a ship blocker, the clock never crossing a decision, voice on the release only, hold to answer withdrawn. It lost one thing I care about and it softened another. Lost: the breath. My one sentence was "one breath is the clock", and the merge replaced it with a word count formula. That is a defensible call, because I never tested it. Softened: my reading floor became a promise ("the read is never empty") with no mechanism behind it. See gap 1.

## 2. THE ICP ROOM

I ran the crude test I promised in pass 2. I fed 16 plain sentences to the real `parseStory` in `engine.js`. 11 of 16 returned zero imprints. Zero: "I keep taking care of everybody else.", "I do not want to be here anymore.", "I feel like a fraud at work.", "I carry everyone and nobody carries me.", "I am tired.", "I am stuck.", "I never say no to anyone." Read something: "I am dying of embarrassment.", "I am afraid I will be found out.", "I am angry that nobody noticed.", "I am exhausted and I cannot stop working.", "Too much on my plate." I did not find the twelve seed phrases in the engine, so "the starting point seeds the sentence" is the lead's claim, not something I could check.

**Marcus (founder, level 7).** Sees the figure and a black stage in 10 seconds. Watches all five slides to see what his product became, then presses the gate. Stays. He will test the stem with a plain sentence to see the engine work. Line: "It looks like a film, fine. Now show me it reads me." If he types "I carry everyone" and gets the empty line, he tells people the engine is thin.

**Whitney (phone only, esoteric native, level 5).** Sees a still figure and a line about senses turning inward. She likes it, since "neurosomatic" is her language. Taps the right side to move on, picks a starting point with her thumb, writes two lines. Stays. Risk: the 44 px Pause ring is a fine target, but the twelve chips in a 3 by 4 grid at 390 must each be 44 px tall or she mistaps. Line: "Oh, it is already doing something."

**Nils (design skeptic, level 4).** Sees no card and no dots and relaxes a little. He taps the skip. It lands on the gate, not the app, which he will count as honest. Leaves at "112 addresses" if the number is not clickable or not real. Line: "Show me the number is computed." The proof row is the best thing here for him, because it is one real engine row.

**Camille (somatic practitioner, level 6).** Sees a figure Still, not breathing, until a reading exists. She reads that as correct: no claim before data. Stays for the release. She leaves if the captions differ from his recorded voice, which is why captions must be the shipped lines. Line: "Good. It does not pretend the body is already speaking."

**Marta (acute distress, 02:00).** Sees black, quiet, a slow film. That is kind. She taps through to the box and types "I do not want to be here anymore." Today that reads zero. With the sniffer it stops everything. Without it, the reading says "Nothing in that matched a pattern. Name how it felt." to a person in danger. Line, if the sniffer is missing: nothing; she leaves. This is the one ICP where the proposal is a ship blocker, and it is the only item I would refuse to ship around.

**Renata (operator, level 7, the main target).** Sees the figure, reads two lines, taps ahead. She wants the work sentence read. She types "I keep taking care of everybody else." That returns zero today. With the starting point chip as seed she gets a Mirror line built from the chip, not from her words. She will see that. Line: "It read the button, not me." Stays only if the first Mirror line quotes her own words and says which part it read.

**Trey (quiz tourist).** Sees a film where he expected a quiz. Skip lands on the gate. He picks a starting point, types four words, wants a result. Leaves at the 12 line release (about 48 s) unless Skip is visible. Line: "Where is my score?" He is the cost of refusing a loud result card, which I accept.

**Sofia (loves the open tables).** Sees "112 addresses" and wants the table. The proof row is a real row, and she will tap it. Today nothing happens. Stays if it opens the address list, even read only. Line: "Wait, those are all of them? Let me see." Cheap to give her: a ring on the row that opens the table after the sequence, never during.

## 3. UNIFIED QUALITY: 58/100

Strong: one stage, one figure, one stem, one grammar of ring and still then breathe. The motion verbs follow what the engine knows.

Three biggest gaps:
1. **The reading floor is a promise.** 11 of 16 ordinary sentences read zero. A floor made by seeding from the starting point can make the Mirror say something that is true of the chip and false of the sentence. That is a defect with good press.
2. **Nothing in it is new.** It is a good film, a gate and a release. The new part is that the first release is the onboarding, and the proof row. Nobody will repeat the proposal in one sentence. Mine was "the figure moves only when the person does something."
3. **The clock has no reason.** Dwell by word count is the 2019 slider with better type. It is untested against his own voice, where a body paced period already exists (5.65 s).

## 4. FINAL GRADE

GRADE: 58/100 (pass 1 was 36, pass 2 was 28)

Moved up: the proposal now has the sniffer as a blocker, a clock that never crosses a decision, voice only on the release, the first release as the onboarding, and an opaque stage with the Field stopped. Held down: novelty is still 3 of 10, and the floor is unproven. My pass 2 target was 70. I miss it by 12 because of gaps 1 and 2.

## 5. MY PART OF THE BUILD SPEC

**A. Reading floor, as a gate (differs from lead only in mechanism).**
- Show the first Mirror line as: `You said "{their words, max 8}". That sits at {address name}.` Quote their words first. Never show a seat lit from the seed alone as if it were read.
- Label a seeded seat as seeded: ring at 40 percent ink, caption "Starting point: {name}". It lights fully only when `parseStory` on the person's own words returns at least one imprint.
- If their words read zero, say: "Nothing in that matched a pattern. Name how it felt." plus the three feeling chips already in the lead's plan. Do not light a seat.
- Add a `tests/engine.js` check: all twelve seed phrases return at least one imprint on their own, and the 16 sentences above are kept as a fixture with the 11 zeros listed as known misses, so a later fix is visible as a diff.

**B. Distress overrides everything.** Run the sniffer on every commit of text and on the seed. A hit sets reason `distress` in the clock's `reasons` set, which pauses the whole sequence. Plain stop frame: stage `#06060a`, no colour, no motion, audio fades in 300 ms, no auto advance. It must read "I do not want to be here anymore." (zero patterns today). A test sentence list goes in `tests/`, signed off by a clinician (narrative's pass 2 ask).

**C. The clock, both values.** Lead: dwell = max(3.0, 1.0 + words/2.5), rounded up to 0.5 s, cap 7.0 s, about 26 s. Mine: five slides each rounded up to a multiple of 5.65 s from his measured breath (2.3 s in, 3.35 s out). That is 28.25 s with no ring: the slide changes on the fall, the figure itself swells to scale 1.02 for 2.3 s and eases back over 3.35 s, curve `cubic-bezier(.37,0,.63,1)`. Evidence for mine: the recording measures 5.65 s. Evidence against: untested on a stranger. Build the lead's value. Put mine behind a flag `?clock=breath` and A/B it on 8 people. If fewer stop before the gate, switch.

**D. Proof row.** One real engine row, "112 addresses". After the sequence, a ring on it opens a read only list. Never opens during the film.

**E. Gift counter.** Engine number, 100 falling toward 88, changing at most twice a second (his audio has a 6 Hz beat; no visual changes between 3 and 30 Hz). Hold 100 for the first 4 s of the release.

**F. Deposits.** Each release line that lands moves one deposit onto its seat in 320 ms, 62 ms apart, `cubic-bezier(.22,1,.36,1)`. One move, never a pulse.

**G. Idle at the gate.** After 20 s with no input, the ring takes one slow swell (2.3 s), once, then nothing. No text, no voice.

**H. Gates to add:** no slide over 12 words; no element animating faster than 3 Hz in the sequence; the stop frame renders with no colour; no first run string on the V1 voice whitelist except the two ruled lines.

## 6. RANKED RECOMMENDATIONS

1. **Reading floor with quoted words and labelled seeds (M, redesign of the reading, not the look).** Moves Renata, Marcus, Nils, Camille.
2. **Distress hook and plain stop frame, tested on the sentences that read zero (L, ship blocker).** Moves Marta, Camille.
3. **Fix `parseStory` coverage for ordinary work sentences, starting with the 7 misses above (L, engine).** Moves Renata, Marcus, Trey. A reading that says nothing to the main buyer is the real onboarding risk.
4. **Breath clock behind a flag, tested on 8 people (S, reskin).** Moves Marta, Whitney.
5. **Proof row opens the table after the sequence (S, reskin).** Moves Sofia, Nils.
6. **Twelve chips at least 44 px tall at 390 (S, reskin).** Moves Whitney.
7. **Tutorial replay lives in the profile (S).** Moves Marcus.

## 7. QUESTION FOR THE OWNER

none
