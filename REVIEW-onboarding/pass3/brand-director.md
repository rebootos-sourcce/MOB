GRADE: 71/100 (pass 1 was 37, pass 2 was 35)

Seat: brand. This grade is for the proposal as merged. The earlier two were for the shipped build.

## 1. THE PROPOSAL AS I UNDERSTAND IT

One black room, one figure, one clock. The boot's last frame becomes the avatar, a silent film of five slides plays, one decision waits (the twelve starting points), then the person writes one true sentence, it is read back, a 12 line release runs, and they land on the Field. Aftercare and the account ask come after the reading.

The merge kept what brand needs: login first, the ruled somatic line, no "it is okay", voice only on the release, hairline progress, shipped seat colours. It lost or bent four things:
- **The not-list is gone.** My slide 5 ("Not a coach. Not a guide. Not a friend. An instrument.") became the loop slide. Saying what we are not does more work than saying what we are, and nothing else in the film does it.
- **The wordmark and "Source OS" have no placement** once the login is gone.
- **A radial light at 12 percent.** Soft light is the category cliché. It puts us on the wellness shelf, not the instrument shelf.
- **Slide 2 is 13 words**, over the 12 word cap. The ruled line must be exempt, like slide 1.

## 2. THE ICP ROOM

**Marcus (founder, level 7).** Sees the boot figure stay and the room go black, no card. Watches all five slides, taps Skip once to see the gate. Judges the name first: name or product logo. Weight 400 reads as a name. "First onboarding that looks like the thing I described."

**Whitney (phone only, esoteric native, level 5).** Sees the figure and "Welcome to a neurosomatic experience." She knows the words. Lets it run, taps the right side twice, stays to the gate. A slide that explains itself loses her. "It did not tell me to breathe. Good."

**Nils (design skeptic, level 4).** Sees black, one figure, a hairline, no gradient. Waits for the lotus and it never comes. Then slide 3 says "mirror" and he flinches. Only the not-list wins him, so without it the room is quiet but unargued. He leaves if the 12 percent light reads as a glow. "Fine. It is not wellness. Say so."

**Camille (somatic practitioner, level 6).** Sees a figure with seats, then twelve starting points. Checks the words against her own: "charge", "feet on the floor". Stays for the real table row on slide 4. Leaves if a caption puts words in a mouth that did not say them, so unconfirmed draft phrases stay off screen. "Show me it says when it does not know."

**Marta (acute distress, 02:00).** Sees black and a still figure, which is calm because nothing moves. She does not read slides. If she types a line about ending her life, the stop frame must come before any release. That frame is the most important page we own: plain, no colour, no ring, no "I am sorry". "Please do not be clever right now."

**Renata (operator, level 7, main target).** Sees a stage that matches the boot, so she trusts it is one product. Lets the 26 seconds run, then picks a starting point fast.  "Short, no pitch, one decision. Good."

**Trey (quiz tourist).** Sees a film before any question and wants the quiz. Taps right three times, picks any chip. Stays only because Skip lands on the gate and not in a void. Leaves at the release if it has no Skip. "Where is my result."

**Sofia (loves the open tables).** Sees slide 4 and the real row, "112 addresses". Holds to stop the clock and read it. Leaves the moment it proves to be typed text and not read from data. "The number is the real number."

## 3. UNIFIED QUALITY: 68/100

One room and one figure is the right spine. The three biggest gaps left:
1. **No not-list on screen.** The position (instruments, not wellness) is argued nowhere.
2. **Type and weight split.** The proposal says weight 300 at 44. The wordmark is ruled at 400 because lighter makes a name look loud. One weight family.
3. **Soft light survives** as a 12 percent radial, against the category refusal.

## 4. FINAL GRADE: 71/100

Up from 35: the loop is a circle, the figure is the avatar, the stage is one token, the lying words are cut, hairline replaced my ring. Held under 80 because three promises are not yet kept in the product (the empty read, the gift in code, the distress detector). A brand ahead of its product is a debt.

## 5. MY PART OF THE BUILD SPEC

**Mark.** Sky blue drawn wordmark top left, 26 px tall at 1600, 22 px at 390, weight 400, letters given room. "Source OS" under it, accent, 12 px, weight 400. Shown slide 1 to the gate, then it joins the app header. No "Powered by".

**Hero text.** 44 px at 1600, 28 px at 390, line 1.2, centred, max 18em, sentence case, no eyebrows. **Weight: I say 400, the lead says 300.** Evidence: the wordmark ruling, and at 28 px on a phone at ink 85 percent the 300 stroke is thin on `#06060a`. Build 400. If the owner prefers 300, use it at 44 only, never on the wordmark.

**Scale.** The lead's 11, 13, 16, 20, 28, 44 is fine. Size 11 only for labels.

**Light.** **I say 0 percent radial, the lead says 12.** Evidence: soft light is banned in this category, and the seat colours on the figure are the only light. Build 0. If the figure needs lift, a flat `#0a0a10` panel, no gradient.

**Colour roles.** Stage `#06060a` opaque. Ink 85 percent for text, 60 percent for Skip, 40 percent for an unlit seat. Accent sky only on the wordmark and the one live control. Seat hue only on marks of 12 px or less or a glow of 12 percent or less.

**Slides.**
1. Welcome to a neurosomatic experience. (exempt from V1)
2. Awareness and intuition is a tool we use to turn your senses inward. (13 words, exempt from the cap)
3. Atüned is a mirror. It shows what is running you.
4. Every part is open. It says when it does not know. Row: "112 addresses", read from data.
5. Not a coach. Not a guide. Not a friend. An instrument. (fallback: "An instrument, not a coach.")

The loop as a closed circle moves to Reel B (B2), where the lead already puts it.

**Dwell.** The lead's formula, max(3.0, 1.0 + words/2.5), rounded up to 0.5 s, cap 7.0. Slide 2 lands at 6.5 s.

**Motion.** Text in 420 ms, `cubic-bezier(.22,1,.36,1)`, opacity plus 8 px rise. Out 220 ms, `cubic-bezier(.4,0,1,1)`, opacity only. Figure lands once on slide 1, 260 ms, root to crown, 90 ms stagger. Still at the gate. Breathes only from the first reading.

**Gate line.** Under the chips: "About four minutes. Stop any time." The number is read from the plan, not typed.

**Developer options.** Hidden from strangers. On the owner's copy, a 1.2 s press on the Source OS line or `?dev=1`. Never a link on frame one.

**Gates.** Gate 12 keeps durations 120, 220, 320, 420 ms. Add a design gate: no `radial-gradient` or blur in the onboarding stage CSS, wordmark weight at least 400.

## 6. RANKED RECOMMENDATIONS

1. **Put the not-list back as slide 5.** S, reskin of copy. Nils, Camille, Renata, Whitney.
2. **Keep promises before saying them:** hide Developer options, honour the gift in `planSight`, an empty read says so. M, redesign of engine behaviour. Nils, Camille, Renata, Sofia.
3. **Distress detector and stop frame before the first story.** L, redesign. Marta. Instrument voice, a clinician signs the text.
4. **One stage token, one scale, no radial light, weight 400.** S, reskin. Nils, Marcus, Renata.
5. **Place the wordmark and Source OS.** S, reskin. Marcus, Renata, Trey.
6. **Whitelist ruled lines for V1 and the 12 word cap.** S, reskin. Whitney, Camille.
7. **Say "avatar" once, at the first change, and breathe only then.** M, redesign of motion state. Marcus, Renata, Whitney.

## 7. ONE QUESTION FOR THE OWNER

None. Decision: weight 400 and no radial light, with 300 and 12 percent as named alternates.
