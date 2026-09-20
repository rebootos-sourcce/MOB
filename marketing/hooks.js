/* ============================================================
   hooks.js

   THE HOOKS, AS DATA, KEYED TO ADDRESSES THE ENGINE ACTUALLY DEALS.

   This is the lookup. Not a persona library, not a swipe file. Every entry
   is keyed to a charge and a seat that came out of measuring a thousand
   fields through the real engine, and the `n` on each row is how many of
   that thousand landed on that key at seed 20260920. A key with no people
   behind it has no hook, and a hook with no key is refused by tests.js.

   THE FORM IS RULED. TASKS.md FN6: the hook speaks to the pain, then asks a
   what if question. His own three lines are the standard to beat and they
   are carried in README.md as the benchmark. Every line here is in his form.

   ART AND COPY ARE ONE ENTRY, NOT TWO DOCUMENTS. TASKS.md MS1: the point is
   sharpening against each other, which does not happen in a handoff. So the
   art direction sits on the same row as the words and takes its palette from
   the same key. A hook at the Heart is rendered in --heart. Nothing is
   chosen; the address decides.

   WHAT `src` MEANS ON EACH ROW.
     engine   the row is derived from a table in atuned_src/engine/
     panel    the row is derived from measuring the thousand person panel
     lit      published work, cited by URL in MAP.md
     unsourced  nothing behind it. Said plainly, not dressed.

   HOST FREE. No document, no window, no fetch.
   ============================================================ */

/* ------------------------------------------------------------
   THE TWO GATES EVERY HOOK CARRIES.

   floor is the lowest BUYERS.md grid level this hook may be served to.

   BUYERS.md level 1 is not a market and marketing at it is unkind: "buying
   this means destroying the trauma identity they rely on to survive". So no
   hook has a floor of 1. A person reading at level 1 is served DOOR_OUT
   below, which is TIERDEF's own direction for the Collapsed band and not a
   piece of copy written for this file.

   Levels 2 and 3 are a different refusal and a weaker one. They are not
   repelled, they are unreachable by a hook: level 2 has no bandwidth and
   level 3 wants a peer reviewed argument rather than a personal practice.
   A hook served there is not harmful, it is wasted, and a system that
   reports it as coverage is lying about its own reach. They are counted
   separately in hooksim.js rather than hidden inside a total.

   register is the pressure the line is allowed to apply, and it is decided
   by the charge, not by the funnel stage.
     open    the line may name the pain directly
     oblique the line names the sensation and never the trait, because the
             trait is the thing the person is defending. Used on every Anger
             and Disgust key: Dillard and Shen 2005 measure reactance as
             anger plus counterarguing, so a line that indicts a person
             carrying anger recruits the charge it is trying to reach
     dosed   the line offers the reading and the exit in the same breath.
             Used on grief and on the two collapse adjacent keys. Stroebe
             and Schut's oscillation is confronting in manageable doses, and
             a line that asks for sustained confrontation is asking for the
             half of the cycle the person is not in
   ------------------------------------------------------------ */

const HOOKS = [
  {
    id: 'H01', charge: 'Shame', seat: 'Sacral', address: 'Need For Approval',
    nerve: 'Iliac Branches', distortion: 'Conformity', n: 307,
    floor: 4, register: 'open',
    pain: 'You are the one who holds the room. You have not asked for anything in years and you would not know how.',
    hook: 'Shame does not feel like shame. It feels like being reliable. What if you could see where your body is paying for it?',
    proof: 'Address 31 of 112, seated at the Iliac branches. The reading names the nerve, the aspect it governs and what the charge costs a week. Every table it runs on is readable inside the product.',
    objection: 'This is going to tell me I am broken.',
    answered: 'The reading names an address and a load. It does not name a character. The clinical correspondences exist in the data and are deliberately not shown to the person they are about.',
    art: {
      ink: '--sacral',
      figure: 'The pelvic floor from below, one nerve branch lit, the rest of the body drawn as a thin ring and left unlit.',
      rule: 'The lit branch is three pixels. Everything else is edge weight. The eye must land on one place, because the copy promises one place.',
      motion: 'The branch comes up over --t-surface on --ease-out. Nothing pulses. A pulse reads as an alarm and this is not one.'
    },
    src: 'engine, NODES row 31. panel, 307 of 1000.'
  },
  {
    id: 'H02', charge: 'Anger', seat: 'Heart', address: 'Blame',
    nerve: 'Thoracic Ganglia', distortion: 'Externalization', n: 90,
    floor: 4, register: 'oblique',
    pain: 'You made the call. You were right. It cost you people and you still think you were right.',
    hook: 'You were right, and your chest has held it ever since. What if being right had an address you could point to?',
    proof: 'Address 59 of 112, seated at the thoracic ganglia. The engine separates what you did from where you are carrying it, and shows the second without arguing about the first.',
    objection: 'This is a machine telling me I am at fault.',
    answered: 'The lean instrument runs four channels and gates two of them. With no evidence of self agency in what you wrote, the withheld channels stay at zero whatever the word lists hold. A survivor therefore does not read as the person who did harm. tests/engine.js group 31 asserts it in both directions.',
    art: {
      ink: '--heart',
      figure: 'A rib cage from the front, the thoracic chain drawn as a vertical ladder, one rung lit. No heart shape anywhere.',
      rule: 'Never draw a heart. The seat is called Heart and the organ is not the subject. A drawn heart moves the page from instrument to greetings card in one mark.',
      motion: 'Still. This key is served to people carrying anger and motion reads as prodding.'
    },
    src: 'engine, NODES row 59. lit, Dillard and Shen 2005. panel, 90 of 1000.'
  },
  {
    id: 'H03', charge: 'Anger', seat: 'Sacral', address: 'Envy',
    nerve: 'Internal Pudendal Nerve', distortion: "Hatred of others' joy", n: 82,
    floor: 4, register: 'oblique',
    pain: 'Somebody else got the thing and it landed in your gut as a cost to you.',
    hook: "Somebody else's good news lands in your gut as a cost. What if that reaction had a location instead of a verdict?",
    proof: 'Address 19 of 112. The reading gives the seat, the nerve and the load. It has no field for whether you are a good person, and that is a design decision you can check in the data.',
    objection: 'You are calling me envious.',
    answered: 'The word envy is the address name in the engine and is never the line. A person is shown where the charge sits and what it costs. The name of the address is available to them and is not put in front of them as a label.',
    art: {
      ink: '--sacral',
      figure: 'Two shapes at the same size, one lit, one not. The unlit one is nearer.',
      rule: 'No comparison drawn as a ladder or a bar. A bar chart of two people is the picture of the problem, rendered approvingly.',
      motion: 'The unlit shape does not move toward the lit one. Nothing here resolves on screen.'
    },
    src: 'engine, NODES row 19. lit, Dillard and Shen 2005. panel, 82 of 1000, split with Manipulation Through Emotion at 39.'
  },
  {
    id: 'H04', charge: 'Disgust', seat: 'Sacral', address: 'Co-Dependency',
    nerve: 'Pelvic Splanchnic Nerves', distortion: 'Self-abandonment', n: 77,
    floor: 4, register: 'oblique',
    pain: 'You left yourself somewhere to keep the room steady, and you cannot remember when.',
    hook: 'You left yourself somewhere to keep the peace, and you cannot remember when. What if your body still had the address?',
    proof: 'Address 21 of 112, seated at the pelvic splanchnic nerves. The aspect the engine holds against it is neediness. The distortion is self abandonment. Both are readable in the product.',
    objection: 'I have heard this language before and it came with a workshop.',
    answered: 'The output is a coordinate and a cost, not a programme. The whole address book is open inside the product. Nobody else in this category does that.',
    art: {
      ink: '--sacral',
      figure: 'A figure outline with a gap in it at the pelvis, and the gap is drawn as absence rather than as a wound.',
      rule: 'No wound, no crack, no shattered glass. Damage imagery makes the reading a verdict.',
      motion: 'The gap does not close. Motion that heals the figure on screen is a promise the product has not made.'
    },
    src: 'engine, NODES row 21. panel, 77 of 1000.'
  },
  {
    id: 'H05', charge: 'Fear', seat: 'Root', address: 'Fear',
    nerve: 'Lumbar Plexus', distortion: 'Avoidance', n: 63,
    floor: 4, register: 'open',
    pain: 'Your lower back and your gut go first, before you have worked out what it is about.',
    hook: 'Your lower back knows before you do. What if you could read what it is answering?',
    proof: 'Address 1 of 112, the lumbar plexus, aspect instinct and threat. The engine puts the charge where the anatomy puts it and shows you the table it used.',
    objection: 'Back pain has a physical cause and this is going to tell me it is emotional.',
    answered: 'The instrument reads self report. It makes no claim about tissue, no diagnosis and no treatment. A coordinate in a model of held charge is not a statement about your spine.',
    art: {
      ink: '--root',
      figure: 'The lumbar plexus alone, drawn as a nerve fan, seen from behind. No spine, no person.',
      rule: 'Anatomical and unpretty. The more this looks like a plate out of a reference text the harder it works, because the position is instruments.',
      motion: 'One pass of light along the fan, once, on arrival. It does not loop.'
    },
    src: 'engine, NODES row 1. panel, 63 of 1000.'
  },
  {
    id: 'H06', charge: 'Shame', seat: 'Crown', address: 'Self-Exclusion',
    nerve: 'Superior Sagittal Sinus', distortion: 'Disconnection', n: 53,
    floor: 4, register: 'open',
    pain: 'You are in the room and not in the room, and you stopped mentioning it a long time ago.',
    hook: 'You are in the room and not in the room, and you have stopped mentioning it. What if the gap sat at a nerve you could name?',
    proof: 'Address 107 of 112, aspect belonging. The coherence quotient is intention times integrity over resistance. All three inputs are visible, so the gap is arithmetic you can check.',
    objection: 'Another number about me that somebody else defines.',
    answered: 'The definition is in the product. Every table the reading runs on is readable inside it. You can disagree with the arithmetic and not only with the result.',
    art: {
      ink: '--crown',
      figure: 'A ring of shapes with one place empty. The empty place is drawn, not implied.',
      rule: 'The empty place is a full stroke outline, not a dotted one. A dotted outline says provisional and the reading is not provisional.',
      motion: 'None. This key is served to people who feel watched.'
    },
    src: 'engine, NODES row 107. panel, 53 of 1000.'
  },
  {
    id: 'H07', charge: 'Shame', seat: 'Heart', address: 'Self-Judgment (Heart)',
    nerve: 'Vagus Nerve', distortion: 'Harshness', n: 49,
    floor: 4, register: 'dosed',
    pain: 'The voice that goes back over your day is harsher than anything anybody has said to you out loud.',
    hook: 'The voice that goes over your day is harsher than anything anybody said to you. What if you could see which nerve it runs on?',
    proof: 'Address 51 of 112, seated at the vagus nerve, aspect grace. The nerve is named in the table, not chosen for the sentence.',
    objection: 'I do not want to spend an hour with the worst of it.',
    answered: 'A release is one sentence over one address. The instrument is built to be put down, and a person who stops is not marked for stopping anywhere in it.',
    art: {
      ink: '--heart',
      figure: 'The vagus drawn as a single line from the brainstem down past the chest. One line, full length, no branching detail.',
      rule: 'One line and a lot of ground. The whitespace is the dose.',
      motion: 'The line draws in over --t-surface and stops. It does not travel repeatedly.'
    },
    src: 'engine, NODES row 51. lit, Stroebe and Schut 1999 on dosing. panel, 49 of 1000.'
  },
  {
    id: 'H08', charge: 'Anger', seat: 'Solar', address: 'Anger',
    nerve: 'Celiac Plexus', distortion: 'Attack', n: 42,
    floor: 4, register: 'oblique',
    pain: 'It arrives in your upper abdomen and reaches your mouth about a second later.',
    hook: 'It lands in the upper abdomen first and reaches your mouth second. What if you could catch it between the two?',
    proof: 'Address 36 of 112, the celiac plexus, aspect power misused. The engine already gives the Corrupt band this exact instruction: name the address while it is running, ahead of the behaviour.',
    objection: 'I have tried counting to ten.',
    answered: 'Counting is a delay with nothing to look at. This names the place. Waiting out a charge and reading one are two different things.',
    art: {
      ink: '--solar',
      figure: 'The celiac plexus as a radial burst of nerve, drawn at the size it actually is, which is small.',
      rule: 'Draw it small. An enormous burst of solar plexus is the poster on a clinic wall and it undoes the position in one mark.',
      motion: 'A single frame of expansion, cut short deliberately, so the arrest is the animation.'
    },
    src: 'engine, NODES row 36 and TIERDEF Corrupt. lit, Dillard and Shen 2005. panel, 42 of 1000.'
  },
  {
    id: 'H09', charge: 'Anticipation', seat: '3rd Eye', address: 'Hypervigilance',
    nerve: 'Optic Chiasm', distortion: 'Overthinking', n: 33,
    floor: 4, register: 'open',
    pain: 'You have run the next four moves and none of them have happened yet.',
    hook: 'You have run the next four moves and none of them have happened. What if you could read what the scanning costs, at the nerve where it sits?',
    proof: 'Address 79 of 112, seated at the optic chiasm, aspect control. The reading gives the load at that address and what the field spends holding it.',
    objection: 'Thinking ahead is my job and you are calling it a fault.',
    answered: 'The engine measures load, not whether the behaviour is useful. A high reading at this address on somebody whose work requires it is information about cost, not a recommendation to stop.',
    art: {
      ink: '--eye',
      figure: 'The optic chiasm from below, the crossing drawn exactly, four faint paths leading away from it and none of them arriving anywhere.',
      rule: 'The four paths end in nothing. They do not end in question marks. A question mark is a joke about anxiety.',
      motion: 'The four paths trace in sequence and then all hold, lit, at once. The holding is the point.'
    },
    src: 'engine, NODES row 79. lit, Dugas intolerance of uncertainty model. panel, 33 of 1000.'
  },
  {
    id: 'H10', charge: 'Shock', seat: 'Root', address: 'Possession',
    nerve: 'Gluteal Nerve', distortion: 'Control of objects', n: 32,
    floor: 4, register: 'oblique',
    pain: 'You are holding something and your hips have been doing it for so long you no longer feel the grip.',
    hook: 'You are gripping something and your hips have been at it for years. What if you could see what the grip is for?',
    proof: 'Address 9 of 112, the gluteal nerve, aspect attachment. The engine seats it there in the table you can open.',
    objection: 'This is going to ask me to let go of something.',
    answered: 'It shows you the address and the load. What moves is your decision, and the product has no mechanic that penalises leaving a charge where it is.',
    art: {
      ink: '--root',
      figure: 'A hand closed, drawn from the gluteal nerve upward, so the grip and the seat are one continuous line.',
      rule: 'Closed, not clenched white knuckle. Strain imagery invites a person to perform relief.',
      motion: 'None.'
    },
    src: 'engine, NODES row 9. panel, 32 of 1000.'
  },
  {
    id: 'H11', charge: 'Apathy', seat: 'Sacral', address: 'Guilt Of Pleasure',
    nerve: 'Sacral Outflow', distortion: 'Self-denial', n: 30,
    floor: 4, register: 'dosed',
    pain: 'Nothing tastes like much and you have stopped saying so out loud.',
    hook: 'Nothing tastes like much and you have stopped saying so. What if flat had a place in your body you could point to?',
    proof: 'Address 30 of 112, the sacral outflow, aspect joy, distortion self denial. The engine holds the clinical correspondences for the architectures internally and does not print them at the person. The reason is written beside the code.',
    objection: 'I think this is depression and an app should not be reading it.',
    answered: 'It should not and it does not. There is no diagnosis anywhere in the output. A reading at the bottom of the scale is routed to the standing direction for that band: weight off, and not alone.',
    art: {
      ink: '--sacral',
      figure: 'A full palette of the seven seat colours, all present, all at ten percent opacity except one.',
      rule: 'Desaturate rather than grey out. Flat is not the absence of colour, it is colour that has stopped arriving.',
      motion: 'None.'
    },
    src: 'engine, NODES row 30 and the internal only note on HCX_LIB sub. panel, 30 of 1000.'
  },
  {
    id: 'H12', charge: 'Disgust', seat: 'Heart', address: 'False Love',
    nerve: 'Anterior Thoracic Roots', distortion: 'Projection', n: 27,
    floor: 4, register: 'oblique',
    pain: 'You perform the warmth and you can hear yourself doing it while it happens.',
    hook: 'You perform the warmth and you can hear yourself doing it. What if the seam had a place in your chest you could point to?',
    proof: 'Address 60 of 112, aspect image. The reading names the address and the seat; it does not rate your sincerity.',
    objection: 'This is going to make me responsible for how I feel about people.',
    answered: 'The four channel lean instrument was built specifically so that empathy withheld and accountability refused are gated, and cannot fire off word matching alone. Eight deliberate breakages of that gate are asserted in the engine tests.',
    art: {
      ink: '--heart',
      figure: 'One shape drawn twice, offset by two pixels, both outlines visible.',
      rule: 'Two pixels, not twenty. A large offset is a mask and a mask is a moral image. Two pixels is a registration error, which is what the address actually describes.',
      motion: 'The offset does not resolve.'
    },
    src: 'engine, NODES row 60 and tests/engine.js group 31. panel, 27 of 1000.'
  },
  {
    id: 'H13', charge: 'Fear', seat: 'Solar', address: 'Perfectionism',
    nerve: 'Mesenteric Plexus', distortion: 'Rigidity', n: 17,
    floor: 4, register: 'oblique',
    pain: 'You call it standards. It arrives in your gut as a clamp.',
    hook: 'You call it standards. It arrives in your gut as a clamp. What if you could read the clamp and leave the standards alone?',
    proof: 'Address 40 of 112, the mesenteric plexus, aspect idealism. Fear is the child fetter on it in the engine table. That is a row you can open, and it is why this line says gut.',
    objection: 'My standards are why I am good at this.',
    answered: 'Nothing in the reading asks you to lower them. It prices what holding them costs, at one address, with the arithmetic shown.',
    art: {
      ink: '--solar',
      figure: 'A grid with every cell exactly equal, and one cell holding a shape slightly too large for it.',
      rule: 'The grid is not broken anywhere. The pressure is the fit, not a fracture.',
      motion: 'None.'
    },
    src: 'engine, NODES row 40. panel, 17 of 1000.'
  },
  {
    id: 'H14', charge: 'Anticipation', seat: 'Heart', address: 'Expectation',
    nerve: 'Pulmonary Nerve Plexus', distortion: 'Contractual love', n: 17,
    floor: 4, register: 'oblique',
    pain: 'You keep a ledger that nobody else agreed to and you are the only one enforcing it.',
    hook: 'You keep a ledger nobody else agreed to. What if you could read the terms you have been enforcing?',
    proof: 'Address 58 of 112, aspect outcome, distortion contractual love. The engine gives the load at the address and the seat it sits in.',
    objection: 'I am being told my expectations are the problem.',
    answered: 'You are shown a coordinate. Whether the terms are fair is not a thing this instrument has an opinion about, and it has no field for it.',
    art: {
      ink: '--heart',
      figure: 'A double entry column, one side filled, the other side ruled and empty.',
      rule: 'Ruled and empty, not crossed out. An empty column is a ledger. A crossed out column is an accusation.',
      motion: 'None.'
    },
    src: 'engine, NODES row 58. panel, 17 of 1000.'
  },
  {
    id: 'H15', charge: 'Shock', seat: 'Sacral', address: 'Excess Emotion',
    nerve: 'Urogenital Nerve', distortion: 'Flooding', n: 16,
    floor: 4, register: 'dosed',
    pain: 'It arrives all at once and leaves you tidying up after it for two days.',
    hook: 'It arrives all at once and you spend two days tidying up. What if your body showed you three seconds earlier?',
    proof: 'Address 32 of 112, aspect drama, distortion flooding. The Corrupt band direction in the engine is exactly this: name the address while it is running, ahead of the behaviour.',
    objection: 'I have been told I am too much before.',
    answered: 'The reading has no scale for too much. It has a load at an address, and the direction it gives is timing, not volume.',
    art: {
      ink: '--sacral',
      figure: 'A single waveform, one spike, and a marker placed three units before the spike.',
      rule: 'The marker is the subject, not the spike. Draw the spike at edge weight and the marker at three pixels.',
      motion: 'The marker lands first and the spike follows. Order is the whole message.'
    },
    src: 'engine, NODES row 32 and TIERDEF Corrupt. panel, 16 of 1000.'
  },
  {
    id: 'H16', charge: 'Apathy', seat: 'Crown', address: 'Spiritual Escapism',
    nerve: 'Dorsal Raphe Nucleus', distortion: 'Bypass', n: 16,
    floor: 4, register: 'open',
    pain: 'You have the whole vocabulary and your body has not moved in a year.',
    hook: 'You have the language for all of it and your body has not moved in a year. What if the thing you have been reading about had coordinates?',
    proof: '112 addresses, each one seated at a named plexus or nerve, plus four field anchors. The whole address book is readable inside the product.',
    objection: 'This is going to be reductive about something that is not mechanical.',
    answered: 'The instrument measures what it can measure and states its own accuracy and interval beside the reading. What it does not know it says it does not know.',
    art: {
      ink: '--crown',
      figure: 'A coordinate grid over an anatomical figure, the grid drawn with more authority than the figure.',
      rule: 'No light, no halo, no mandala. This key is served to people who have already bought the mandala. The coordinate is the exotic object here.',
      motion: 'The grid arrives over the figure, snapping once on --ease-land.'
    },
    src: 'engine, NODES row 92 and the 112 count. panel, 16 of 1000.'
  },
  {
    id: 'H17', charge: 'Apathy', seat: 'Root', address: 'Escapism',
    nerve: 'Sciatic Nerve', distortion: 'Running', n: 12,
    floor: 4, register: 'dosed',
    pain: 'You are very good at being somewhere else.',
    hook: 'You are very good at being somewhere else. What if you could see the thing your body leaves the room to avoid?',
    proof: 'Address 14 of 112, the sciatic nerve, aspect facing pain. Named in the table, and the table is open.',
    objection: 'I do not want to look at that today.',
    answered: 'Then do not. The product has no streak that resets, no countdown and nothing that expires, and a person who closes it is not behind on anything.',
    art: {
      ink: '--root',
      figure: 'A door, open, drawn from inside the room. The room is not drawn.',
      rule: 'The door is open. A closed door is a threat and this key is the one where a threat does the most damage.',
      motion: 'None.'
    },
    src: 'engine, NODES row 14. lit, Stroebe and Schut 1999. panel, 12 of 1000.'
  }
];

/* ------------------------------------------------------------
   THE TWO NON HOOKS.

   Both of these exist because the system has to have somewhere to put a
   person it must not sell to. A marketing system with no such slot pushes
   everybody into the nearest hook, which is how a hook set reaches a
   hundred percent coverage and is lying.
   ------------------------------------------------------------ */

/* Nothing held. Rosa's reading, 15 of the 1000.

   This is the one entry that sells confirmation rather than relief, and it
   is the one place where BUYERS.md and the field disagree in an interesting
   direction: level 10 is the grid's highest buying probability at 100
   percent, and the person there has no pain to speak to. His ruled form is
   pain then what if, so the pain slot here is the honest absence of one. */
const CLEAR = {
  id: 'H18', charge: null, seat: null, address: null, n: 15,
  floor: 9, register: 'open',
  pain: 'Nothing is sitting on you. You are not here for relief.',
  hook: 'Your field reads clear and nothing here will relieve you of anything. What if you want the schematic anyway?',
  proof: '112 addresses, nine poled axes, twenty one laws asked three ways, and the arithmetic of the coherence quotient, all readable.',
  objection: 'So what is this for, if I am fine.',
  answered: 'A map of a system you have already worked out by feel, and the ability to read somebody else with it. That is the whole offer and there is not a second one behind it.',
  art: {
    ink: '--accent',
    figure: 'The complete address book at once, all 112, none lit.',
    rule: 'Nothing lit. This is the only place in the system where an empty reading is the picture, and it must not be dressed as an achievement.',
    motion: 'None.'
  },
  src: 'engine, the 112 count and TIERDEF Mastery. panel, 15 of 1000. BUYERS.md level 10.'
};

/* Grid level 1. Not a hook and not marketing.

   BUYERS.md: nought percent, actively repelled, because buying this means
   destroying the identity they are using to survive. The words below are
   TIERDEF's own direction for the Collapsed band, carried verbatim, because
   the right thing to say here already exists in the product and writing a
   second version of it in a marketing file is how two voices start. */
const DOOR_OUT = {
  id: 'H00', charge: null, seat: null, n: null,
  floor: null, register: 'dosed',
  hook: 'Weight off, and not alone. A reading this low is not a thing to manage by yourself, and the instrument will not pretend otherwise.',
  isHook: false,
  src: 'engine, TIERDEF Collapsed toward, verbatim. BUYERS.md level 1.'
};

/* ------------------------------------------------------------
   THE STATE DOORS. Top of funnel, where no field exists yet.

   These are not field hooks and they are not interchangeable with them. A
   person who has not taken the intake has no address, so there is nothing to
   look up.

   AND THE SWEEP TOOK A CLAIM OFF THIS FILE. The first version of this comment
   said state is the better of the two pre reading keys, on the headline seed
   where it names the right charge for 462 of the 894 eligible against 437 for
   role. Across five seeds and three jitter widths state leads role in 5 of 15
   runs, by minus 25 to plus 25 people of 1000. That is noise, and a 25 person
   lead quoted off one seed is the kind of number this repository has been
   bitten by seven times.

   So the honest finding is that state and role are indistinguishable here,
   and the field beats both in 15 of 15 runs by 272 to 460 people of 1000.
   Neither label is a reliable key. That makes the case for the doors sorting
   rather than asserting stronger than it was, and it makes getting a reading
   the only thing the top of the funnel is actually for.

   modal and cover are measurements, not targets. A door whose modal share is
   low is not a weak door, it is a door that must not make a claim about what
   the person is carrying. Overwhelmed is the case: nine distinct charges
   behind one word, modal 33 percent. So that door sorts and does not assert,
   and the copy shows it.
   ------------------------------------------------------------ */
const DOORS = [
  {
    id: 'D1', state: 'burned out', n: 365, modal: 'Shame', modalShare: 247,
    hook: 'You are not tired. You have been reliable for so long that tired is the only word left. What if there were a reading under the word?',
    why: 'Exhaustion predicts cynicism in the burnout literature and the word burnout covers the whole sequence. The door names the reliability rather than the exhaustion, because the field behind this state is modally Shame at the sacral and reliability is what that address feels like from inside.',
    src: 'panel, 365 of 1000, modal Shame 247. lit, Maslach 2016.'
  },
  {
    id: 'D2', state: 'anxious', n: 135, modal: 'Anger', modalShare: 81,
    hook: 'Anxious is the word you use in public. What if the thing actually running had a different name and a place in your body?',
    why: 'The measured surprise. The fields behind the anxious door are modally Anger, 81 of 135, not Fear. The door does not assert anger, which would be a verdict and would recruit it. It asserts only that the public word and the reading may differ, which is what the panel shows.',
    src: 'panel, 135 of 1000, modal Anger 81, Fear absent from the top three.'
  },
  {
    id: 'D3', state: 'overwhelmed', n: 300, modal: 'Disgust', modalShare: 100,
    hook: 'Overwhelmed is nine different things wearing one word. What if you could find out which one is yours in a single sitting?',
    why: 'This door sorts and makes no claim. Nine distinct charges sit behind it in the panel and the modal one covers a third, so any line that names a charge here is wrong for two people in three. Nine is not a rhetorical number: the engine has nine poled axes.',
    src: 'panel, 300 of 1000, 9 distinct charges, modal Disgust 100. engine, CHILD has 9 rows.'
  },
  {
    id: 'D4', state: 'grief stricken', n: 200, modal: 'Shame', modalShare: 103,
    hook: 'Grief does not read as sadness on this instrument. It reads wherever you have been carrying it. What if you could see where, and put it down when you want to?',
    why: 'The strongest line in the set and the only one whose surprising claim is measured here rather than borrowed. Sad is the heaviest charge for 1 person in the panel of 1000, and for 0 of the 200 behind this door. The exit clause is not softness, it is the dosing the bereavement literature describes.',
    src: 'panel, Sad heaviest for 1 of 1000 and 0 of 200 behind this door. lit, Stroebe and Schut 1999.'
  }
];

/* ------------------------------------------------------------
   THE ROLE DOORS, AND WHY THEY ARE DELIBERATELY WEAKER.

   He named four roles and they are in the system. What the panel says is that
   role is no worse than state and both are far behind the field, and that the
   executive door splits almost evenly between Anger at 123 and Shame at 120.
   A door that cannot tell those two apart must not name either.

   So a role door is a way in and never a claim. It names the situation,
   which the person already knows is theirs, and hands off to the intake. Not
   one of these lines names a charge, and tests.js asserts that.
   ------------------------------------------------------------ */
const ROLES = [
  {
    id: 'R1', role: 'executive', n: 315, distinct: 6, modalShare: 123,
    hook: 'You make the call and you carry it afterwards, and the carrying is not in the job description. What if it were on an instrument?',
    src: 'panel, 315 of 1000, 6 distinct charges, Anger 123 and Shame 120 nearly level.'
  },
  {
    id: 'R2', role: 'athlete', n: 170, distinct: 3, modalShare: 127,
    hook: 'You have been treating pain as information for twenty years. What if there were a reading for the part of it that is not in the tissue?',
    src: 'panel, 170 of 1000, 3 distinct charges, modal Shame 127. The tightest role in the panel and still only 75 percent.'
  },
  {
    id: 'R3', role: 'creative', n: 210, distinct: 7, modalShare: 93,
    hook: 'You can see what is wrong with anything in four seconds, including yourself, and it has cost you. What if the seeing had a coordinate?',
    src: 'panel, 210 of 1000, 7 distinct charges, modal Disgust 93. The line is Marcus verbatim from engine/data/people.js.'
  },
  {
    id: 'R4', role: 'performer', n: 305, distinct: 9, modalShare: 114,
    hook: 'You hold the room and the room does not know what it costs. What if you could put a number on the holding?',
    src: 'panel, 305 of 1000, all 9 charges present, modal Shame 114. The most diffuse role in the panel, which is why this line names the situation and not the charge.'
  }
];

module.exports = { HOOKS, CLEAR, DOOR_OUT, DOORS, ROLES };
