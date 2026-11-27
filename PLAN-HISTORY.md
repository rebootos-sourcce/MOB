# What has been done

Moved out of PLAN.md on 1 October (round OT) so the plan carries only what is
open. Read off `git log` on `claude/laughing-feynman-xhfyj3` and the gate runs.
Newest work is added at the top of the section it belongs to.

## Completed, gated and pushed

Read off `git log` on `claude/laughing-feynman-xhfyj3` and the gate runs. The last
full gate run, on the merged tree at build v1106 (`65af38d`): engine 3635
passed, functional 1793 passed, locks 289 passed, and design, collide, boot,
funnel, sound, monitor and the voice check all exit 0.

**Navigation and shell**
- Header: wordmark centred on the hamburger; zoom icons in a row (`80c11de`, `5651a17`).
- Body in Play between Field and Compass; the Intake door in Discover restored
  as its own page, integer 13 (`06f5c52`, `9ca2de5`).
- Profile button as a menu of account sections, Settings and Sign out; sound
  effects switch, on by default (`a14000d`, `237997c`).
- A profile with no ritual track or seat no longer vanishes at boot.

**Field, Body, Compass, Character**
- Field pulses run on the Shadow wave; jitter cut twice; four-pool glow behind
  the wheel, the Body and the Compass (`85a370c`, `0089635`).
- Compass overlays as the glass bar's circles, characters as two panels
  (`8868cf7`). Compounding band pill beside Accuracy.
- Character page: masks rail, hero and weave; oval face; Field-sourced effects
  (`6f7ba7e`, `47b101d`, `e3039df`).
- Body places: belly, navel, diaphragm, halves, heart and plexus names
  (`5245c55`, `935224c`).

**Left menu and Summary and Intake**
- Left menu combined from three concepts (`65af38d`): six readings with the
  name and number inside the fill, Decoherence as seven seat hashes, Flow as a
  sine wave, Orientation and Balance in the block, the Awareness fold, option 2
  behind `?rail=2`, nothing drawn across to the centre pane.
- Summary rebuilt by meaning, first drivers on the right, three reviews on
  record (`d1ddd32`). Name meanings laid out with a researched table.
- Intake page redesigned: a map first, the questions on open (`e6dea3e`); phone
  digits legible; the CQ at 100 simulation as pictures (`45d4b8b`).

**Release, practice, trace, sniffer**
- Rerun v2: lines marked heavy go back where they sit; reframe half runs 50
  back to 1 (`ce91fe6`, `fd81201`).
- Practice domain (775 checks) and Trace graph (266), with their bridge gated
  (`f38e0d8`, `8ff0d49`, `2289e9c`, `2dd3823`).
- Impression Excavation Engine wired into the Story tab (`c6280fa`, `6af99b3`);
  clause floor for the sniffer's negation (`c2999cf`).
- Sound engine and the seat tone, default on (`c19337c`, `237997c`); the seat
  tone gate now reads the tone's own pair (`9daeb33`).
- Daily Summary engine, slices D1 to D7: the frozen day, the aim, the grounding
  pass, the drawer, the vault of past days (`a93f388`).

**Money and tiers**
- Stripe: prices 12, 29, 59, 99; checkout, webhook for renewals, changes and
  cancellations, Manage billing, the plan read back into the app;
  `STRIPE-SETUP.md` (`0e43e2a`, `9b4707d`, `19337c2`, `9bb10cf`).
- Sight by tier: one table in `engine/plan.js`, the lock treatment (greyed,
  padlocked, described, not drawn), the buy page reading the table
  (`088953c`, `28743dc`, `6178ea5`). Free rerun route and tiers page (`1da7e1e`).

**Voice and copy**
- Copy brief as a checker (`check.py --brief`); sweep first pass with 0 stops
  left (`acacc3a`, `21bb264`, `31d3acb`); Day One tutorial and onboarding copy.

**Audits and documents**
- Practice, Becoming, Points, Daily Summary and Release Intelligence audits;
  the practitioner story and the gap to MVP; the experience and ICP model
  (`ATUNED-experience-icp-model.md`) and the Onboarding and First Experience
  TDD copied in (`ATUNED-onboarding-first-experience-TDD.md`).

**Mockups delivered, awaiting a pick**
- Character masks: Seal and its variations, then three systems (Aura, Contour,
  Mosaic); the owner chose Aura, the point cloud (round OR).

**Round OT, 1 October (built, gated with the next push)**
- The login stands first, under the boot sheet, so no frame of the Field or the
  dashboard shows before it; Developer options moved to the lower right; the
  guest entry reads Guest.
- The first run flags (`onboarded`, `tutorialSeen`) now live with the other ui
  facts, because the profile boundary dropped them on the next load and the
  onboarding replayed on every launch (found by review 2).
- The story opener reads "What are we writing about today?", casual, and names
  are always printed capitalised (`capName`).
