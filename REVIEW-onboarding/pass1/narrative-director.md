# Pass 1: narrative director, copy and type (round PJ, 2 October)

June Okonkwo-Lund. I ran `check.py`, `--brief` and `--line` on `ui/onboard.js`, `ui/tutorial.js` and `ui/login.js`, and fed four sentences to the real `engine.js`.

The gate is blind here. Onboarding strings sit in markup, which the house harvest skips, so it printed "no hard failures" and "antithesis 0%". Counted by hand: 8 antithesis sentences in about 50, against a house rate of 2%.

GRADE: 40/100

| Criterion | /10 | Evidence |
|---|---|---|
| Is it true | 5 | "What moved was your body" is printed from a button press. |
| One bucket | 4 | "Nothing stood out, and that is a real answer. Sometimes it takes stillness..." is three. |
| Voice rulings | 4 | OB1, 3, 4, 5, 6, 12 are open and shipped broken. |
| Plain words | 6 | "Components", "protocol", "replacement". |
| Length | 2 | OB13 says under 25 words a frame. Welcome 28, then 60 to 134. Tutorial 45 to 73. |
| Rhythm | 5 | Tutorial antithesis near one sentence in three. |
| Distress | 1 | None. |
| Handover | 3 | Ends on "Go in" and an empty Field. |
| Refusals | 5 | The save refusal has no route. |
| ICPs | 5 | Angela stays. Derek finds no instrument. James hears "No judgment" and feels watched. |

## THE SOUL

A stranger wants to be seen without being handled. The best parts now are the welcome's first ten words and the signal test, where a body does something. The rest explains the product before it is felt.

## WHAT BREAKS

1. **Distress.** Measured on `engine.js` today. "I do not want to be here anymore." reads as nothing, so the tutorial answers "That happens... Some entries are quiet." "I want to end my life. I feel hopeless and numb." reads Sad 8.8 and offers a release. "I am dying of embarrassment." also reads Sad 8.8, so a word list on "dying" will misfire. The release card prints "8.8 of 10 of shadow load", a score (V8).
2. **Claims.** "Making us sick" is a disease claim. "Gives you a way to work with it" is a result. OB15 forbids both.
3. **Rulings ignored.** OB4, 5, 6 (0p, tenth pass of 20 September) overrule AJ2 (0c, second pass), which the welcome follows. V12's welcome exception rests on AJ2. OB6 gives the reason: denying a grade plants the idea of one.
4. **Figure labels.** "Body response" and "What it costs" fail the gate. "Not named" and "not enough here yet to say" are more wordings of "not read yet" (V19).
5. **Login.** "Welcome" over "Log in". "Developer options" visible to a stranger. "Guest" has no definition.

## RECOMMENDATIONS

### 1. Reading time. S. All ICPs.
- Rate 2.5 words a second. It is his own pace: "Notice where it is inside your body" is 7 words in 2.9 s.
- Dwell is `1.0 s + words / 2.5`, rounded up to 0.5 s, minimum 2.5 s. If the slide asks for an action, use `1.0 s + the action's seconds` when longer.
- Maximum 12 words a slide, 9 a sentence. A timed frame is stricter than OB13's 25.
- No digits. The ring is the only progress (OB1).

### 2. The script. M. Angela, Derek.
"Welcome to" fails V1. The brief fixes the line, so whitelist that one string by name. It also replaces "Hello" (OB4): one greeting.

| # | Line | Dwell s |
|---|---|---|
| 1 | Welcome to a neurosomatic experience. | 3.0 |
| 2 | Neuro is your nerves. Somatic is your body. | 4.5 |
| 3 | Awareness and intuition is a tool we use to turn your senses inward. | 6.0 |
| 4 | This is a mirror. It shows what is running you. | 5.0 |
| 5 | It reads your words. Each points to a place in your body. | 6.0 |
| 6 | Discover. Play. Flow. Embody. Then round again. (a drawn circle) | 4.0 |
| 7 | Sit down. Place your feet on the floor. | 4.5 |
| 8 | Take three slow breaths. (ring breathes, 5.5 s a breath) | 17.5 |
| 9 | Bring your attention to your throat. | 3.5 |
| 10 | Think yes, ten times. Notice how it feels there. | 11.0 |
| 11 | Now think no, ten times. Notice how that feels. | 11.0 |
| 12 | Compare the two. Did they feel different? (Yes, No, Nothing) | 4.0, waits up to 10 |

About 80 s to slide 12. Slides 1 to 6 are 28.5 s. If that is long, cut slide 6, never slide 2: a name that needs a gloss gets the gloss.

After the tap:
- Yes or No: "You noticed a difference between yes and no." Then "A thought can change how your body feels. Your words can too."
- Nothing: "Nothing came up. That is recorded as nothing." Then "Your words can still move it."
- No tap in 10 s: store "unanswered", never "nothing". Say nothing. "Pick one to go on." goes.

Cut: "Two minutes. One thing to try...", "Nothing here is made up..." (reassurance against a fear nobody raised), and "Words like anxious... do the same thing somewhere in you" (a claim about a person it has not read).

### 3. The spoken opening. M. Angela.
- **Use 1.85 to about 25.5 s only.** Cut before "And release" at 27.13. That word before the signal test is a false start. The clip covers slides 7 and 8.
- **Sound off by default.** With sound on, change slide at each phrase start minus 0.2 s.
- **The 3.3 s gap, 11.61 to 14.90, carries no new words.** Silence is a copy decision.
- **Screen text is confirmed text only.** All ten phrases are `confirmed:false`. "Take a moment to set the" is cut off. "Notice where it is inside your body" has no noun for "it". Listen first. Until he confirms, the shipped lines show.
- His "Place your feet on the floor" replaces "Put both feet" everywhere (V14).
- **The stems belong to the first release.** Take 1 (29.89 to 39.95) matches ruling 8. Take 2 uses "letting go" and a different order. Hold it. Both end on "that I am", which is right: the person finishes it.

### 4. Distress. L. Ship blocker. James most.
No permanent line, so the detector is the line. The first story step does not ship until that first sentence is not read as nothing.

The frame that replaces the reading never auto-advances, has no sound, no points, no release offer, no upsell.
- Direct statement (refusal):
  - "Stop here. A release is not for this."
  - "If you are not safe, call or text 988 in the United States, or your local emergency number."
  - "Nobody reads this but you." (drafted in `reviews/LEGAL-floor.md`; true only before an account exists)
  - Menu: Call 988, Text 988, Go on
- Indirect, or possibly a figure of speech:
  - "That sounded heavy. Tell one person today what you wrote."
  - The same 988 line. Menu: Go on.
- Never "I am sorry" or "you are not alone". The product is not a friend.
- A clinician signs the final text.

Body slides need an exit. "Skip" stays one word. Pressed on slides 8 to 11 it stops the exercise and shows for 5 s: "Stopped. Look at the room." Then the handover. Nothing is lost.

### 5. The handover. S. Angela, Derek.
Slide 13, no timer: **"Pick your starting point."** One step, imperative, the named thing (V14). The twelve appear under it. The bridge is already "Your words can too." No "Ready?" (V1).

### 6. Controls and type. S.
- Corner "Skip", fs-2 13 px, 60% ink. Held: "Paused", then "Tap to go on". Never "Held", which names an address.
- Hero fs-5 32 px at 1600, fs-4 22 px at 390, line height 1.2, weight 400. At most 34 characters a line, 24 at 390. Gloss fs-3 16 px, line height 1.45.
- Reduced motion drops movement and keeps timing. Space and arrows pause and step.

### 7. The day one tutorial. M.
The first release already is day one. Do not ship both. Keep it as a profile replay, 4 slides built from the person's words:
- "Write what happened." Button "Commit", the Story tab's word, not "Continue".
- "You wrote: {first 12 words}."
- "{word} sits at your {seat}."
- "Situation, story, body, behaviour. Round again."
- Empty: "Nothing in that matched a pattern. Name how it felt."
- No "of 10". "Let it go" becomes "release".

### 8. Login. S.
Cut both eyebrows ("Welcome", "Password reset"). Hide "Developer options" unless `dev=1`. Guest tooltip: "Use this device without an account."

## ONE QUESTION FOR THE OWNER

None. Decided: OB5 and OB6 win over AJ2. The ruled line opens. The voice is cut at 25.5 s. Breaths are three, matching his recording. Not covered: the site wide tooltip walk.
