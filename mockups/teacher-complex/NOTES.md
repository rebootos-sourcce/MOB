# Compass, click a teacher: the behaviour complex (J14)

What to look at: `panel.html` (one file, no network). `complex-1600.png` shows
two teachers side by side, Jesus at the heart and Lao Tzu, with the card at the
width it has in the right rail. `complex-390-IL.png` and `complex-390-HO.png` are
the same two at phone width. `panel.html?only=IL` or `?only=HO` shows one.

The markup and rules in the mockup are the build's own: it was rendered out of
the real `ritComplexHtml` and the real rule set, so what is drawn here is what
the click draws. The face is a fallback because the mockup does not carry Inter.

## His words, and how they were read

- "I want to see the behaviors that I need to install ... a summary of who this
  person is, not the person per se, but ... the behavior complex. Of both
  behaviors." Read as: the pole is a pair of behaviours. One list is released,
  one is installed.
- "the behaviors and the rituals within that recipe set, and then we'll refine
  that. So just give me some basics to start with." Read as: every teacher
  ships a starter set, marked first draft, in a table he can edit with no code.

## The panel, top to bottom

1. One line naming the pole as a behaviour pair: "Give with no audience instead
   of for the room". Under it, small: "After Jesus, Light, Heart". The teacher is
   a credit and never the headline.
2. Release and Install. Two columns when the card is wide enough for two
   readable lines (phone), stacked when it is not (the desktop rail). 3 to 5 short
   behaviours each, plain and physical. Release is captioned with the inverted
   end by name ("as Lucifer"), Install with "Practise this instead".
3. Starter rituals, 2 or 3. Each is a card: name, minutes, step names. Press one
   to pick it and its steps open in place, each with its one line. Nothing
   redraws, so the panel keeps its scroll.
4. One button, Add to my ritual, for the picked ritual. It runs for a week from
   today and says so under the button. If the picked ritual is already active the
   card says Active and the button becomes Open the ritual.
5. A footer line: first draft, to be refined, behaviours and not people.

## Taken off the panel, on purpose

The drill used to print the seat's load as a percent and the position on the
axis as a number out of a hundred, and two codex sentences describing the ends.
Both numbers are scores and the ruling is no percent, no score. The sentences
read as biography. The Compass wheel itself still carries position.

## The ritual tie

A ritual is a list of practice keys, which is what the builder and the boundary
already accept (DESIGN-teachers.md section 5a). So a starter ritual is a list of
keys, some from the library (Box Breathing, Given Freely) and some new rows in
the same shape as `engine/data/practice.js`, written for the recipe. Add goes
through `ritStartPlan`, the one writer, so it is one ritual among the others,
with the same ring, record and streak. Pacing is kept: a step above the person's
tier waits and the card says which.

## Where the content lives

`atuned_src/engine/data/teachers_recipes.js`. One row per pole, 14 poles for 13
people. Fields: key, who, q, opp, line, release, install, rituals (id, name,
steps), draft. Ids are stable and are never reused. Edit a row and nothing else.

## Not built here

- Zoroaster, Akhenaten and Confucius have recipes but are not on the Compass
  yet. The roster change (DESIGN-teachers.md section 2, rows 12 to 14) is a
  separate block. Until it lands nothing can open them.
- The imprint lines, the lock states and the share switch from DESIGN-teachers
  sections 3b, 4 and 8. This block is the behaviour complex and the ritual tie.
