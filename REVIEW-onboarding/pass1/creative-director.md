GRADE: 42/100

Ines Halldors, creative director. Pass 1, the whole. Evidence: `onb-shots/`, `mockups/onboarding/` (baseline and png), `mockups/release-redesign/frames/`, `ui/onboard.js`, `ui/tutorial.js`, rounds OT to PJ in TASKS.md, the opening timing json, PANEL-10k.md.

Two gaps. The shipped login is still the old email card (baseline 02-login); login A, the ring, is a mockup only. And `1600-tut-0.png` shows the bare Field with no tutorial sheet, so I judged the tutorial from source and mockups.

## Grade, current onboarding

| Criterion | /10 | Evidence |
|---|---:|---|
| Four second intent | 5 | A stranger learns it is a welcome, not what it is for. The dimmed Field behind it still reads "Four ways in." and fights the card. |
| Soul stated where a person lands | 4 | "There is more running you than you can see" lives on the login and is gone one screen later. The card swaps the mirror for reassurance. |
| One visual world, boot to Field | 3 | Boot ring, then a glass card with a wash over a dimmed dashboard. The card does not continue login A, the ring on black he picked. |
| Experience before explanation | 3 | Screen 1 reassures, screen 2 explains (about 90 words and a four row list), the test is third. The person's own sentence appears nowhere until the tutorial. The TDD says experience first. The build runs it backwards. |
| Momentum, no button wall | 2 | Five presses reach the Field and none writes anything the engine reads. `OB.felt` is read only inside `onboard.js`. |
| Truth, nothing decorative as data | 5 | The seven dot figure holds no data. The signal answer changes one paragraph and nothing else. The four step list draws the loop as a list, against the ruling. |
| Restraint | 4 | Two figures on the welcome: the real one and `.ob-fig-wm` behind it, misregistered so its lower dots read as dead seats (both welcome shots). |
| Craft of the test screen | 3 | 75 words in six paragraphs, read and performed at once. The "Pick one to go on." hint floats between a disabled Next and Back. |
| Voice | 7 | Plain and mostly physical. "No judgment" and "it is okay" lean soft. |
| 390 wide | 6 | The card fits and scrolls inside itself. The what this is screen is a full screen of text. |

## Why he rejects the look

"I don't like the aesthetic" is the symptom. Four causes, ranked.

1. **It is the wrong kind of object.** A centred card over a dimmed app is a dialog. A dialog asks permission to interrupt. "Come in" and "Not now" ask a stranger for a decision before giving him anything. He wants to be received (his words, round MU: "I need to be welcomed, these people see me") and the card processes him. A title sequence receives you. A form processes you.
2. **Button pressing is the cost of word count.** Every screen needs a press because every screen is a page to read. His own ruling says "show, not tell, not super text heavy" and the file does the opposite. A timer over these pages turns a press into a race. Cut the words first.
3. **It is dead in a living product.** The product's claim is a moving field. The card holds still on purpose. He said "visually exciting, this whole drab, no" (round OT).
4. **The first two minutes speak four visual languages.** Boot ring, login, glass card, dashboard. The login he approved sets a bar of rings and ticks on black. The next screen drops under it.

## The soul

The first two minutes are not a tour. They are one trade. The person gives one true sentence of their own, and the instrument gives it back read: a quality, a place in the body, a cause in their own words, something to release. Everything before it is delay and everything after is proof. The welcome has one job, to make a stranger ready to type it, in about 25 seconds.

**One sentence: it should feel like a quiet film that moves on its own, stops only to ask you for one true sentence, and then shows you that sentence read back with a place in your body attached.**

## Where the disciplines contradict

- **Auto advance against read and do.** The signal test asks a person to read and perform at once. A timer cannot serve that. The fix is to make the instruction the sequence, one line per beat, paced by breath, never a page.
- **Warm against mechanical.** Ruling AN6 says warm. The house voice bans soft wellness language. My call: warmth comes from pace, silence and not asking, never from adjectives.
- **The "two minutes" promise is over budget.** The signal test is about 81 seconds, the recorded release opening 49.7. Both start with feet on the floor and breathing: two body exercises back to back. I recommend the voice led release is the first body entry and the signal test opens the day one tutorial. This moves ruling AN7, so pass 2 must test it.
- **One decision against everything asked.** Mockups ask starting point, story, accurate, body answer, ten laws, username, recovery email, agreement. The first run keeps three answers before the release. Laws come after (the tutorial mockups already do). Account fields come at the gift, as ruled.
- **His voice against sound off and file size.** The recording is the release's opener (round PA). Do not spend it at the welcome. The `.webm` is 143 KB, fine in a 3.7 MB build. The `.wav` at 2.4 MB is not. Older iPhones may not play webm opus, a technical director question.
- **Zen against busy.** Dense is fine where the person acts. It is not fine on slides where they only look.
- **A timer against distress.** The sniffer is the only safety, so a timer must never advance through the story box or past an answer.

## Recommendations for the new onboarding

Each carries finding, cause, move, cost, grade delta.

**1. Replace the card with a stage. M.** Move: opaque ground, no dimmed app, the ring and tick field of login A behind, no wash gradient, no `.ob-fig-wm`. Replaces `obCard` and the `.ob-card`, `.ob-wash`, `.ob-dots` rules in `shell/head.html`. Cost: new CSS. Delta: one world 3 to 8, restraint 4 to 8.

**2. A timed sequence for the welcome. M.** Five beats, one line each, about 24 seconds in all:
- "Welcome to a neurosomatic experience." 4.0 s
- "Awareness and intuition is a tool we use to turn your senses inward." 5.5 s
- "A thought moves the body. The body moves the thought back." 4.9 s
- "Say one true thing. This shows where it sits in your body." 5.0 s
- "Nothing here grades you." 3.0 s

Dwell is 1.2 s plus words divided by 3, clamped 3.0 to 7.0. Type 40 px at 1600, 28 px at 390, weight 300. Cross fade 600 ms, text rises 8 px on `cubic-bezier(.22,1,.36,1)`, already in the build. Progress is one 48 px ring of five arcs, upper right, never dots. Delta: momentum 2 to 8, soul 4 to 7.

**3. Controls that never trap. S.** Press and hold pauses, release resumes after 400 ms. Right third of the screen is next, left third back, arrow keys the same. "Skip" is quiet 12 px text, lower left, landing at the starting point question, never in the app. Reduced motion: cross fade only, dwell times 1.5, a visible pause ring. Sound off, one ring icon lower right.

**4. Three answer beats, and the film waits. M.** The sequence stops and breathes (ring opacity 0.6 to 1.0 on a 4 s cycle) and never times out into a default, because an answer is evidence and a defaulted answer is a lie. Starting point: tap one of twelve, advance 400 ms later, no Next. Story: type or speak, then one button, "Read it", shown after five words. It is the only button in the first run and it is the real action. "That's it" and "Not quite" advance themselves. The release and gift follow the mockups. Delta: truth 5 to 7.

**5. Hand the stage to the Field. M to L.** The onboarding ring becomes the Field ring in a 700 ms shared element move, so the person arrives in the instrument and not on a different page. Delta: one world to 9, soul to 8.

**6. Tokens for the stage. S.** Sizes 12, 16, 28, 40. Colour roles: ground, ink, one accent blue for the one action, seat hues only where a seat is named. Icons ring, never fill. All sentence case.

Expected grade on this proposal in my discipline: 42 to about 72, to be tested in pass 3.

## ICP sample

From PANEL-10k.md personas and the roster in `engine/data/people.js` (loaded by `ui/personas.js`).

- **Whitney** (phone only, reads the glossary first). Hold to pause is her whole experience at 390. "Neurosomatic" is a word she keeps. A text card she skims and calls basic.
- **Marta** (acute, 02:00, fourteen months after loss). A timer moving over her is a risk. Hold and quiet skip are essential. "Nothing here grades you" lands. A reading that opens with a score would not.
- **Nils** (design skeptic). Would photograph the dimmed dashboard behind a card as bad signage. Stays for one type scale.
- **Camille** (practitioner, fears harming a client). Short slides feel thin. She needs one line on what happens to her sentence: "Stays on this device."
- **Trey** (quiz tourist, do not chase). Screenshots the read back. Harmless.

The first run is written for BUYERS.md levels 4 and 5, who hurt and want a mechanism, not magic.

## Risks

- Auto advance fails accessibility (WCAG 2.2.2, pause, stop, hide) unless hold, back and skip ship on day one.
- I judged stills. Motion and sound are unreviewed.
