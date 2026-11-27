GRADE: 37/100

Seat: brand, Noa Ferreira-Blake. Pass 1, the onboarding and tutorial, round PJ.
Note first: `1600-tut-0.png` and `390-tut-0.png` show the bare Field with no tutorial card on it. Either the capture missed or the tutorial did not open. I judged the tutorial from source.

## The one sentence, and does the first minute keep it

For the whole experience: **Atüned is a mirror that shows what is running you, top to bottom, and shows its own working.** A coach cannot say it, and neither can a wellness app that hides its working. The opener that leads into it is his: "There is more running you than you can see."

Does the first minute keep it? No. The first sentence a stranger meets in the real build is "Log in" (`ui/login.js`: eyebrow "Welcome", heading "Log in"). His opener exists only in `mockups/onboarding/login-a.html`. The first sentence that is actually shipped is "This is you, and it is okay." The transparency half, the part only we can say, is a dim grey line at the bottom of card two: "Nothing here is made up. If it does not know something, it says so."

## Criteria (out of 10)

| Criterion | Score | Evidence |
|---|---|---|
| First sentence | 4 | Real login has none. Welcome opens on "okay", a verdict a mirror cannot give. |
| Mark and wordmark | 6 | The boot is the best identity work in the product: drawn mark, umlaut dots, "Powered by Source OS", ruled to the pixel. Then it vanishes. No card carries the mark. Header Source OS is near invisible. Mockups use plain white type, not the ruled sky blue drawing. |
| The soul (mirror, open, instrument) | 5 | Card two says "everything that is running you, top to bottom", which is right. Open-by-law is 13px dim text. |
| A stranger leaves knowing what this is | 4 | Cards use "body mind complex" and "signal test". Source OS is never explained. The loop never appears. |
| Avatar as centrepiece | 2 | `onboard.js`, `tutorial.js`, `login.js` contain the word "avatar" zero times. The welcome figure is seven dots and a halo, near invisible on later cards. It is not the person's figure and nothing changes it. |
| Product keeps what the first minute promises | 3 | "Nothing to fill in" then Next is disabled until a pick (`onb-3`). "Nothing here grades you" while the Field behind prints a score and "Heaviest Root 0.0". "Two minutes" ends on an empty Field. |
| Refuses the category clichés | 3 | The card is a frosted glass modal with a purple, red and teal diagonal glow (`.ob-wash`). That is soft light and a gradient, both banned. |
| Says what we are not | 2 | Nowhere. Meanwhile "Come in", "it is okay", ten slow breaths with no frame drift toward friend and meditation timer. |
| Consistency across surfaces | 5 | Boot and login mockups share a ring world. Shipped cards are another: dimmed app, centred modal, four dots. |
| Handover to the first release | 3 | `loginEnter()` opens onboarding or the tutorial, never both. `DEV_PLAY_TUTORIAL` is false. A real stranger gets four cards, then "Go in", then the Field. No first story. No first release. |

## THE SOUL

Three true things, in order of how much they matter. It is a mirror: "this is you". It is open: every part can be inspected, by ruling. It is an instrument: no opinion about your life. The boot sequence says all three without a word: a figure stands, a ring opens, the name lands. That is the brand. Everything after it is a softer product.

## WHAT BREAKS

1. **"This is you, and it is okay." (welcome card).** It is his sentence and the warmth is real. But "okay" is a verdict, and `BRAND.md` section 9 says the product never praises and never reassures against a fear nobody raised. Warmth belongs in a human voice. It does not belong in the instrument's text.
2. **"Nothing here grades you."** The product prints a coherence number out of 100. A brand ahead of its product is a debt. Say what is true: it reads load, it does not rate worth.
3. **Card two: "Most of the stress we call normal is making us sick... and what to do about it."** A disease claim and a treatment promise on screen two. `BRAND.md` section 5 settled this class: replace the claim with the mechanism.
4. **The glow.** The gradient wash is the category's own look. Instruments are flat and black.
5. **The signal test** has no frame, so it reads as a meditation timer. It is a calibration: you are the sensor.
6. **The way out.** After "Go in" the stranger lands on a Field full of zeros, verdicts and about nine padlocks. The promise is broken inside five seconds.
7. **Tutorial voice.** "Let's look at something" speaks as "we". "Not labelling you, revealing what is actually there" is the not-X-but-Y shape. The mockup line "You did that." is praise.
8. **Source OS** is never defined. A stranger leaves knowing a name, not a kind of thing.

## RECOMMENDATIONS for the NEW onboarding

**1. One stage, one figure, six beats. L.** Black stage `#0B0D12`. The boot's own figure (spine, seven seats, halo) centred, 280px tall at 1600, 200px at 390. It stays on every beat and it is the same object that will later be the avatar. Still, not breathing: stillness means unread. Seat colours live only in the figure. No gradient, no glass, no blur. Moves: phone only arrival, skeptic.

**2. The mark is present, and it is the real one. S.** The drawn sky blue wordmark, top left, 26px tall at 1600, 22px at 390, umlaut dots white. "Source OS" under it at 11px, `#7A7A7A`, never "Powered by" after the boot. In running text the name is "Atüned" with the character. Moves: skeptic most.

**3. The copy, with a time per beat. S.** Time rule: 1.2s plus 0.35s per word, floor 2.8s.
- Beat 1, 2.8s: "This is you."
- Beat 2, 4.4s: "There is more running you than you can see."
- Beat 3, 5.4s: "Atüned is a mirror. It reads what is running you, top to bottom."
- Beat 4, 5.4s: "Every part is open. If it does not know, it says so."
- Beat 5, 4.7s: "Not a coach. Not a guide. Not a friend. An instrument." Each phrase lands 500ms after the last.
- Beat 6, no timer: the twelve starting points. The slider stops here and waits. This is the one decision.

That is 22.7s before the decision. Beat 5 is the one place the not-list is said, as three nouns. If the copy seat objects, drop it and keep the rest. Moves: skeptic, practitioner.

**4. Type and colour roles. S.** Beat text 44px at 1600, 28px at 390, weight 400, sentence case, line height 1.15, max width 18em, centred under the figure. Ink 92 percent white. Accent sky only on the mark and the one live control. State never uses a seat hue.

**5. Motion curves. S.** Text in: opacity 0 to 1 and 8px rise, 600ms, `cubic-bezier(.2,.7,.2,1)`. Text out: opacity only, 300ms, ease in.  Progress is a ring of six arcs around the figure, the current arc filling clockwise over the beat. Rings, never dots. Reduced motion: cut with no rise, same timings.

**6. Voice belongs to the human. M.** His recording (49.7s) is a release induction: breath cues from 1.85s, the stem "I am releasing believing..." at 29.9s. On beat 1 it makes the first minute a breathing exercise before the stranger knows what this is. Keep it for the release screen. For the slider, record five short lines in his voice, sound off by default. Beat 1 spoken as he said it: "This is you, and it is okay." That keeps his ruling and keeps the screen mechanical. The screen text is the caption.

**7. The avatar earns its name at the first reading. M.** After the first release, the same figure from beat 1 returns with one seat changed. Say it once: "This is your avatar. Throat charge was 6.1 out of 10. It is 5.2." Numbers say what they are out of. From here the figure may breathe: breathing means read. The word "avatar" does not appear before this moment, because a stranger has none yet.

**8. The handover cannot fail the promise. M.** Do not drop the stranger on the full Field. Send them to the unread Field with one sentence, four doors, no verdicts, no zeros, no padlocks. Replace "Nothing to fill in" with what is true: "One decision. One story." Moves: acute distress, phone only arrival.

**9. Pull the claims. S.** Delete "making us sick" and "what to do about it". Say the mechanism already on the signal test card: "A thought changes what the body does. The body changes the thought."

**10. Pause and exit. S.** Hold anywhere freezes the ring and the timer. A quiet "Skip", bottom right, 13px, `#7A7A7A`, no box. No "Not now" pill, which sounds like a sales ask. Left third of the screen goes back, right third forward.
