# Pass 1: narrative director, copy and type (round PJ, 2 October)

June Okonkwo-Lund. Read: BRIEF, `ui/onboard.js`, `ui/tutorial.js`, `ui/login.js`, `audio/atuned-opening-timing.json`, `DESIGN-firstrun.md` rulings table, `TASKS.md` 0p and 0c. I ran `check.py` and `--brief` on the three files, then every string through `--line`. I also fed four sentences to the real engine (`engine.js`) to see what a stranger gets back.

The gate is blind here. Most onboarding strings sit in markup, which the house harvest skips, so `check.py onboard.js` printed "no hard failures" and "antithesis 0%". I counted by hand: 8 antithesis sentences in about 50, against a house rate of 2%.

GRADE: 40/100

| Criterion | /10 | Evidence |
|---|---|---|
| Is it true | 5 | "What moved was your body" is printed from a button press. "Making us sick" is a disease claim. |
| One bucket | 4 | "Nothing stood out, and that is a real answer. Sometimes it takes stillness..." is reading, comfort and definition. |
| Voice rulings | 4 | "Welcome", "and it is okay", "No judgment", "Not now", "Try one thing", dots: OB4, OB5, OB6, OB3, OB12, OB1 are open and shipped broken. "Let it go" breaks release language. |
| Plain words | 6 | The welcome is plain. "Components", "protocol", "replacement" are not. |
| Length | 2 | OB13 says under 25 words a frame. Counts: welcome 28, then 60, 90, 66; tutorial 45 to 73. |
| Rhythm | 5 | Antithesis in the tutorial runs near one sentence in three. |
| Distress | 1 | None. Measured below. |
| Handover | 3 | Ends on "Go in" and an empty Field. |
| Refusals, empty states | 5 | The save refusal has no route. The "quiet entry" line is comfort, not a reading. |
| Lands for Angela, Derek, James | 5 | Angela stays. Derek finds no instrument. James hears "No judgment" and feels watched. |

## THE SOUL

A stranger wants one thing from the first minute: to be seen without being handled. The best line in the current build is the welcome's first ten words, and it is not a sentence about us. The signal test is the second best, because it is a body doing something. The rest explains the product to a person who has not yet felt it.

## WHAT BREAKS

1. **Distress.** Measured on `engine.js` today. "I do not want to be here anymore." reads as nothing, so the tutorial says "That happens... Some entries are quiet." "I want to end my life. I feel hopeless and numb." reads Sad 8.8 and offers a release. "I am dying of embarrassment." reads the same Sad 8.8, so a word list on "dying" will misfire. The tutorial's release card also prints "8.8 of 10 of shadow load", a count against a total (V8).
2. **Claims.** "Most of the stress we call normal is making us sick" cannot be measured by this instrument (OB15: no results, no purpose). "Gives you a way to work with it" is a result.
3. **Rulings the build ignores.** OB4, 5, 6 (ruled in 0p, the tenth pass of 20 September) overrule AJ2 (0c, the second pass), which the shipped welcome follows. The voice skill's V12 exception rests on AJ2. OB6 gives the reason: denying a grade plants the idea of one.
4. **Tutorial figure labels.** "Body response" and "What it costs" fail the gate (a figure label is one word). "Not named" and "not enough here yet to say" are two more wordings of "not read yet" (V19).
5. **Login.** "Welcome" sits over "Log in". "Developer options" shows to a stranger. "Guest" has no definition one door away.

## RECOMMENDATIONS

### 1. Reading time. S. Moves all three ICPs.
- Rate: 2.5 words a second (150 a minute). It is the pace of his own voice: "Notice where it is inside your body" is 7 words in 2.9 seconds. Slower than silent reading on purpose, for a 390 wide screen and a tired reader.
- Dwell: `1.0 s + words / 2.5`, rounded up to 0.5 s. Minimum 2.5 s. Where the slide asks for an action, use `1.0 s + the action's seconds` if longer.
- Maximum 12 words a slide, 9 a sentence. A timed frame is stricter than OB13's 25, because nobody can slow it down by reading less.
- Sentence one fades in at 0.4 s. Sentence two follows after sentence one's own reading time.
- No digits, no "2 of 9". The ring is the only progress (OB1).

### 2. The script. M. Angela, Derek.
Bucket in brackets. "Welcome to" fails V1 and the gate will stop on it. The brief fixes that line, so whitelist this one string by name and do not reword it. It also replaces "Hello" (OB4), so a stranger is greeted once.

| # | Line | Words | Dwell |
|---|---|---|---|
| 1 | Welcome to a neurosomatic experience. [value] | 5 | 3.0 |
| 2 | Neuro is your nerves. Somatic is your body. [definition] | 8 | 4.5 |
| 3 | Awareness and intuition is a tool we use to turn your senses inward. [ruled] | 12 | 6.0 |
| 4 | This is a mirror. It shows what is running you. [definition] | 10 | 5.0 |
| 5 | It reads your words. Each points to a place in your body. [definition] | 12 | 6.0 |
| 6 | Discover. Play. Flow. Embody. Then round again. [label, drawn as a circle] | 7 | 4.0 |
| 7 | Sit down. Place your feet on the floor. [instruction] | 8 | 4.5 |
| 8 | Take three slow breaths. [instruction, ring breathes 5.5 s a breath] | 4 | 17.5 |
| 9 | Bring your attention to your throat. [instruction] | 6 | 3.5 |
| 10 | Think yes, ten times. Notice how it feels there. [ring ticks ten times] | 9 | 11.0 |
| 11 | Now think no, ten times. Notice how that feels. | 9 | 11.0 |
| 12 | Compare the two. Did they feel different? [chips: Yes, No, Nothing] | 7 | 4.0, then waits up to 10 s |

Total to slide 12: about 80 s, 90 s with a slow tap. Slides 1 to 6 are 28.5 s. If the owner finds that long, cut slide 6, not slide 2: a name that needs a gloss gets the gloss.

After the tap, one reading, then the handover:
- Yes or No: "You noticed a difference between yes and no." (4.5 s) then "A thought can change how your body feels. Your words can too." (6.0 s).
- Nothing: "Nothing came up. That is recorded as nothing." (4.5 s) then "Your words can still move it." (3.5 s).
- No tap in 10 s: store "unanswered", never "nothing". Say nothing.
- The disabled Next and "Pick one to go on." are gone. A refusal for a button that no longer exists.

Cut from the current build: "Two minutes. One thing to try. Nothing to fill in." (a promise the ring now keeps), "Nothing here is made up..." (reassurance against a fear nobody raised), the whole "What just happened" card, "Words like anxious... do the same thing somewhere in you" (claim about a person it has not read).

### 3. The spoken opening. M. Angela.
His recording is a settle plus two stems, not an onboarding script. Phrase gaps are real silences. The longest is 11.61 to 14.90, 3.3 s. In that gap show no new words. Silence is a copy decision.
- **Onboarding uses 1.85 to about 25.5 s only.** Cut before "And release" at 27.13, because "release" before the signal test is a false start. That clip covers slides 7 and 8 (21.5 s of text, 23.6 s of voice).
- **Sound off by default.** Text carries it by the formula above. With sound on, change slide at each phrase start minus 0.2 s.
- **Screen text is confirmed text only.** All ten phrases are marked `confirmed:false`. Two are broken: "Take a moment to set the" is cut off, and "Notice where it is inside your body" has no noun for "it". Listen before you set a word. Until he confirms, the screen carries the shipped lines.
- **One wording.** His "Place your feet on the floor" and the shipped "Put both feet on the floor" are one concept. Use his everywhere (V14).
- **The stems belong to the first release.** Take 1 (29.89 to 39.95) matches ruling 8 in order and in five channels. Take 2 reads "letting go of... behaving, thinking, acting, feeling", a different order and verb. Hold it until he re-takes it or rules otherwise. Both takes end open, on "that I am". That is correct: the person finishes the sentence.

### 4. Distress. L. All three ICPs, James most. Ship blocker.
No permanent line (ruled). So the detector is the line, and the first free text a stranger types is the highest risk input in the product. The first story step does not ship until a detector exists that does not pass "I do not want to be here anymore." through as nothing.

Copy for the frame that replaces the reading. It never auto-advances, has no sound, no points, no avatar, no offer of a release, no upsell. The "Nobody reads this but you" line is drafted in `reviews/LEGAL-floor.md` Block C and is true only before an account exists.
- Direct statement (refusal):
  - "Stop here. A release is not for this."
  - "If you are not safe, call or text 988 in the United States, or your local emergency number."
  - "Nobody reads this but you."
  - Menu: "Call 988", "Text 988", "Go on"
- Indirect, or a word that may be a figure of speech:
  - "That sounded heavy. Tell one person today what you wrote."
  - "If you are not safe now, call or text 988 or your local emergency number."
  - Menu: "Go on"
- Never "I am sorry". Never "you are not alone": the product is not a friend.
- A clinician signs the final wording before it ships.

The body slides need an exit. The corner word "Skip" stays one word, always. Pressed during slides 8 to 11 it stops the exercise and shows, for 5 s: "Stopped. Look at the room." Then it goes to the handover. Nothing is lost.

### 5. The handover. S. Angela, Derek.
Slide 13, no timer, never advances by itself: **"Pick your starting point."** Instruction, one step, imperative, the named thing (V14). The twelve points appear under it. The bridge is already the line before it, "Your words can too." Do not add "Ready?" or "Let's begin" (V1).

### 6. Controls and type. S.
- Words on screen: "Skip" in the corner, fs-2 13 px, 60% ink. When held: "Paused", then "Tap to go on". Hold means a hold or a tap anywhere. Never "Held", which already names an address.
- Hero: fs-5 32 px at 1600, fs-4 22 px at 390, line height 1.2, weight 400, at most 34 characters a line at 1600, 24 at 390. The gloss line is fs-3 16 px, line height 1.45.
- Reduced motion removes movement and keeps timing. Space and arrow keys pause and step. Screen readers get each slide in a polite live region.

### 7. The day one tutorial. M.
The first release already is day one. Do not ship both. Keep the tutorial as a replay in the profile, built from the person's own words, 4 slides, same formula.
- Action: "Write what happened." (the door's own name). Button "Commit", the Story tab's word, not "Continue".
- "You wrote: {first 12 of their words}."
- "{word} sits at your {seat}."
- "Situation, story, body, behaviour. Round again."
- Empty state: "Nothing in that matched a pattern. Name how it felt." Cuts "That happens, and it is not a problem with what you wrote."
- Print no "of 10". Print a node state only after he rules the lines between rungs.
- "Let it go" becomes "release" (the brief's release language).

### 8. Login. S.
Cut the eyebrow "Welcome" and the reset card's duplicate eyebrow. Hide "Developer options" unless `dev=1`. Tooltip for Guest, one idea: "Use this device without an account." The first slide appears within 0.4 s of pressing Guest, with no loading line.

## ONE QUESTION FOR THE OWNER

None. Decisions made: OB5 and OB6 win over AJ2. The ruled somatic line is slide 1. The voice track is cut at 25.5 s. Breaths are three, not ten, to match his own recording ("deep breath... and repeat"). One word to listen for, from him: confirm the draft phrases in the JSON.

Not covered: the site wide tooltip walk he asked for is a separate pass. This file covers only onboarding, tutorial and login.
