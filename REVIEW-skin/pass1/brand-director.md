GRADE: 56/100

Seat: brand (Noa Ferreira-Blake). Pass 1, independent. Looked at: ten surfaces at 1600 and 390 in skin-shots, `BRAND.md`, `DESIGN-avatar.md`, `shell/head.html`, `shell/body.html`, `engine/core.js` TABDEF, `ui/auth.js`, `funnel/index.html`.

Baseline note. `ATUNED-art-ux-icp-review.md` gave art direction 88 and brand distinctiveness 87. That was a simulated panel grading the concept. This grade is the shipped skin, read screen by screen. The concept has not got worse. The shipped screens keep less of it than the 88 admits.

| Criterion | Score | Evidence |
|---|---|---|
| The one sentence is kept by the product | 4 | The ceiling is still never stated as a sentence. Compass says "against a clean ten", Summary says "points of expression left in it". Nothing says "most powerful version of you". |
| Name and mark | 7 | Drawn "atüned", 400 weight, umlaut visible in every shot. Loses points for the subtitle (below) and for funnel `<title>Atuned</title>`, still unfixed. |
| Shelf: instrument, not wellness | 7 | No lotus, no soft light. Field, Body and Compass look machined. 42 gradient rules in `head.html` and a game HUD feel pull it sideways. |
| Avatar as centrepiece | 3 | The centre of the product is locked. See break 1. |
| The loop as a circle | 3 | The nav is a row of four with a divider. See break 2. |
| Voice at brand level | 7 | "Nothing has been read yet. Four ways in." is the voice. Title case and a first-person quote break it. |
| What we are not, held | 6 | Games page speaks as a guide. Locks speak as a shop. |
| Identity system consistency | 5 | About 30 real font sizes from 8.5px to 48px, 17 radii, 117 distinct hex values in `head.html`, one wordmark colour that changes per theme. One family (Inter), which is the good part. |
| Transparency as visible law | 8 | Summary footer: "Nothing here is generated from anything the instrument has not measured." That is the brand, in one line, on a surface. Rare. |
| Soul coherence across surfaces | 6 | Field, Body, Compass feel like one object. Summary, Knowledge, Settings, Story feel like a different product. |

## What a stranger says after 10 seconds

Opening the app cold, on the Field, they say: "It is a dark analytics console for some kind of astrology or personality game." They see a radar dial, a row of ring chips with small numbers, a tab bar with four verbs, a right rail of ranked rows with scores, and about ten padlocks.

They do not say "a mirror". They do not say "it reads my body". They do not say "instrument", although the Field dial is the closest thing to one. The first-screen card, "Nothing has been read yet. Four ways in.", is the strongest brand line in the product and it sits at 14px under a section label in a rail the eye skips.

## THE SOUL

Atüned is a mirror that shows what is running you and tells you what it cost. Its soul is subtraction. You are already whole, something is holding you down, and the instrument measures the drag. The nearest reference is Muji by way of Braun: show the thing, remove the decoration, let the reading carry the weight. The product has the engine for this and the Field and Body maps have the look for it. The soul shows on three surfaces (Field, Body, Compass) and in one footer line. Everywhere else the product describes itself in a dashboard's grammar: cards, ranked lists, locked chips, tier names.

## WHAT BREAKS COHERENCE (ranked)

1. **The avatar is not the centrepiece, and the one called Character is behind a lock.**
   - Where: `1600-character-loaded.png`. Play > Character shows a padlock. The surface itself is an empty stage with a banner, "Locked on your plan ... Unlocked on tier three and above." The nav shows a lock beside the tab name on every Play screen.
   - Second problem: the same thing has two names. Discover has "Avatar" (a seven-node wheel, "Becoming" and "Archetypes", `1600-intake-loaded.png`). Play has "Character". `core.js` TABDEF comments admit the integer's name is history.
   - Third: there is no figure. The "avatar" a person sees is a wheel with a house icon and the word Ground. The Field's centre is a plain sphere with "62".
   - Cost: the ruling says the avatar is what Atüned is. The product sells its centre by tier. A stranger cannot find "their avatar" in ten seconds, because it does not look like one.

2. **The loop is a row, and Embody is a library.**
   - Where: `secbar` in `body.html`; Discover, Play, Flow, Embody sit left to right with a divider after them. The funnel `index.html` still draws four numbered `.step` blocks. `auth.js:399` writes "Do the loop: discover, play, flow, embody. Then do it again." as a sentence, the only place the return is stated.
   - Embody opens to Knowledge, a 76-item codex list (`1600-knowledge-loaded.png`). `body.html` says Embody is "where the loop comes back round, and that end is a person, not a place." The shipped end is a place.
   - Cost: the rulings say circle, never a list. A list says embody is the end. The product teaches the opposite of its own mechanic.

3. **Source OS is invisible, and three documents disagree on what it should be.**
   - Where: `head.html` `.brand .bs`: `color:#343434`, 8.5px, `text-transform:uppercase`. On the dark panel that is about 1.5 to 1 contrast. In every screenshot the line is a smudge under the wordmark.
   - The persona brief says accent. `BRAND.md` says gold (`--au`) and "never the caps form". CSS says dark grey and all caps. The owner's own hex, asked for three times, caused it.
   - Cost: the subtitle is the product's category claim (OS, a system, an instrument). Nobody can read it.

4. **A person's quote reads as the product speaking.**
   - Where: the right rail on every Play and Embody screen: "I can see what is wrong with anything in four seconds. It has cost me two studios." in italics under "Marcus".
   - It is the example profile's own words, with no attribution. The brand rule is that the product never says I and never praises.
   - Cost: a stranger reads a first-person machine. A real person's own words will sit there once they use it, which may be right, but it needs a label ("You wrote").

5. **The ceiling and the drag are still framed as a quota.** `summary.js:940`: "Release has about N points of expression left in it for you." The unit is now named, which fixes the naked number. The frame is still a limit on a tool, not the distance to your own ceiling. This is the brand's one sentence, and it is still not on a surface.

6. **Case and voice drift.**
   - Title case on data labels: "Who This Is", "Where It Goes", "By Assemblage Point", "Need To Be Need...", "Co-Dependency", "Energetic Summary", "Sign In", "This Account". Sentence case elsewhere: "Locked on your plan", "Nothing has been read yet".
   - The rulings say sentence case. `BRAND.md` sec 9 says title case in headers, which contradicts `CLAUDE.md`. One rule must go.
   - The Games card says "Turn your senses inward before you read. Move slowly through each line. Notice where reading feels contracted." That is a guide's voice, and a meditation instruction. We are not a guide.

7. **Locks are a shop, not an instrument.** About ten padlocks on the first Field screen (the chip row, the rail footer, the Character tab). "Locked on your plan" is the first sentence on a surface a paying person bought a reading to see. A Leica does not have a padlock on its lens.

8. **The wordmark changes colour with the theme.** `--sky` is `#7EB8D4` on Dark, `#2F6E92` on light, `#0091EA` on Punch, and `#5FD4C4` (a teal) at `head.html` line 434. A name that is blue and sometimes green is a product logo, not a name. Mark colour should be one hue at different values.

## SKIN RECOMMENDATIONS

| # | Change | Effort | ICPs it moves |
|---|---|---|---|
| 1 | One word for the avatar. Pick one noun and apply it to both tabs and every string. Show a figure, not a wheel: the Embody standing figure (arms up) is already drawn at 23px and can be the avatar's silhouette on the Field centre. | M | Marcus, Diane, Angela |
| 2 | Draw the loop as a ring in the shell. The four section icons (eye, play, waves, figure) joined in a four-arc circle in the header, with the Embody arc closing to Discover. Same icons, same data, a different arrangement. | M | all |
| 3 | Give Source OS a legible value. Muted gold (`--au`) at 10px, sentence case, or the wordmark's own sky at 60 percent. Contrast 4.5 or better. Get his ruling by showing the contrast number next to his hex. | S | all |
| 4 | Put the ceiling on the Field. Print one line in the rail, "Your ceiling is N. You read M. The drag is the gap." The numbers exist (`cqCeiling`, `cqHeadroom`). | S | Derek, James, Diane |
| 5 | Sentence case the labels. Mechanical rename in strings only. Run `check.py` after. | S | Marcus, Sofia |
| 6 | Label the quote: "In your words" above it, in the mid tone, so it cannot read as the product. | S | all |
| 7 | Lock as a dim state, not a padlock. Greyed ring, no icon. Tier text moves out of the first line. | S | Angela, Sofia |
| 8 | One mark hue across themes, values only. | S | all |
| 9 | Game copy to the instrument register: "Twenty four cards. The clock runs." and stop. | S | Derek |
| 10 | Cut gradients from the 42 down to the ones that carry data (bars, charge fills). | S | Marcus, James |

## REDESIGN CANDIDATES

- **The Field centre becomes the avatar.** A skin can colour and re-label it. It cannot make a sphere into a figure that visibly changes as load comes off. That is a drawing, a state model and an animation. It is the one change that gives the product its centre, and it is the only redesign I would argue for. `proto/avatar/` and `mockups/character*` already carry candidates. I did not review them in this pass.
- **Embody as a person, not a library.** Knowledge moves under Discover or Reference, and Embody opens to the avatar. A skin cannot do it because it moves a door. It is cheap, because it is TABDEF's `sec:` field, not an integer.

## RISKS

- The owner has ruled the Source OS hex three times. A fix that ignores his ruling will be reverted. Show him the contrast figure first.
- Naming the avatar is a vocabulary ruling. Avatar is his word, so Character is the one to retire. His call.
- Printing the ceiling is a promise. If a profile's ceiling is misread, the brand's central sentence is wrong in public. Gate it on a confident reading.
- A loop drawn as a circle will show an empty arc to a new person. That is correct (the circle is open until the first release) but it needs copy that says so, not a gap.

## One sentence, and does the product keep it

"You are already the most powerful version of yourself, and this reads what is holding it down."

The engine keeps it. The Compass half-keeps it ("against a clean ten"). The product as a whole does not yet say it on any screen a person lands on, and the avatar that would show it is locked.
