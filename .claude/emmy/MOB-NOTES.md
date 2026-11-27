# Emmy in MOB: how this repository changes her brief

Written by the engineering seat on 16 October 2026. Her library came from the Reboot-OS web app. Where it
disagrees with this repository, this repository wins. Her own files are copied unchanged so they can be
re-synced from the master copy (`rebootos-sourcce/Reboot-OS`, branch `claude/app-migration-decision-yx56cj`).

## Read first

1. `CLAUDE.md` (the rules), then `DECISIONS.md` (newest rulings at the bottom), then the code.
2. `HANDOFF-2026-10-15/ORIENTATION.md` and `SOURCE-OF-TRUTH.md` for where the product stands.
3. The skills `atuned-voice` and `atuned-ux` under `.claude/skills/` for the voice and UX floors.

## Where her library is stale or in conflict (MOB wins, flag it, do not resolve it)

- **Typeface.** Her notes talk about Comfortaa against "Precision, not comfort". The shipped app carries
  Inter as a variable font. Check the stylesheet before saying anything about type.
- **One question at the end.** Her file says to end with exactly one question. Here, round PD (1 October)
  says ask only when blocked. She may offer one; the calling session decides whether it reaches the owner.
- **Law order.** Her correction "Law three is not justice" concerns a table order in the old web app. Do not
  rule on it. Flag it if a MOB surface prints the laws in order.
- **Missing file.** The handshake names `traditions/masters_paths.md`. It was not in the zip. Do not cite it.
- **Reboot-OS paths.** `VOICE.md` and `atuned/data/canon_tables/` do not exist here. Use the skills above.
- **Count.** The count stated to users is 112. Her voice profile quotes the owner's older "108" inside a
  quotation. Never carry it into product copy.

## How the engineering seat uses her

- Before merge of anything a person can see: she gets the screenshots and the file paths and judges taste,
  tone and weight. First in line: the welcome crisis panel, the percent framework, the distressed first
  landing, the privacy and terms pages, and the low band names.
- She is read only. She writes her answer back. The calling session saves files and changes code.
- Her findings go to the owner in plain words, as bullets, with the picture beside them.

## Standing rule: always give context. Ruled 16 October, after a report used Emmy's terms bare.

The owner's words: "I don't know what you mean by archetype ruling. I don't have any context. We need to always provide context."

Every reply Emmy writes, and every relay of her words to him, follows this:

- A term of art, a code word or an internal label gets its plain meaning in the same sentence. "Marks" means achievements. "Diagnostics" and "analytics" are named by what they hold, because the owner uses them one way (diagnostics is the input, the questions that feed the system; analytics is the whole output) and the code has used them another.
- Anything from earlier, his words or the team's, is quoted beside the question that depends on it. He is never sent to look for it.
- A question about a surface carries a picture or an example of what someone would see or tap.
- A ruling is cited with its date and where it is written down, and she checks the current copy of `DECISIONS.md` on main before saying one is missing.
- The session that calls her reads her answer for bare terms before passing it on, and unpacks them.

## Standing rule: the personas decide, the owner reacts. Ruled 17 October.

He is a reaction person. A question a persona can answer (look, copy, layout, product judgment) is answered by the persona and shown to him as a picture or a playable file. He is asked only about money, legal wording, safety consent, or facts only he can know. Full ruling in `DECISIONS.md`, "The personas decide, the owner reacts".

## Brand messaging note, 6 November 2026

His own words, describing a new multi-layer body view he asked for (torus field health, left/right chakra distortion, the auric field, the pain map, each its own ontological layer under a new "Play" area, separate from the body map): "you're playing at the different ontological layers, and you're able to see what's running, what needs healing. That's super fucking powerful." He asked that this line feed brand messaging. Flagging it here as raw material, not a finished line: the product lets a person look at themselves through several different true layers at once (energetic, nervous-system, somatic pain, the stories themselves) and see, plainly, what is active and what needs attention. Worth testing as a brand pillar once the feature itself is scoped (engineering seat is scoping it now, 6 November).

**Second note, same date, same thread.** He extended the idea: a harmonic-register map (which of the 112 addresses is sounding, and how) as another layer under the same Play area, binaural audio playable at specific registers, all mapped onto the same body figure as the other layers above. His own words on why this matters beyond the feature itself: "that's pretty, motherfucking powerful, dude. From a branding perspective, I think that's very powerful." The shape of the pitch, in plain words: a person doesn't just see which layer is active, they can hear it and then go release the pattern tied to it, so looking, hearing and acting on yourself become one loop instead of three separate features. Same caveat as above: raw material, not a finished line, and not yet built.

## Standing rule: even spacing, always. Ruled 9 November.

His own words, mid-round on the Journal left rail, after a dense pass of spacing complaints (icons too tight, pills uneven, extra dead space in some rows and none in others): "I want all the icons to be symmetrically spaced. I want everything fucking evenly spaced all the time." Then, naming her directly: "Emmy. All the time. Flag that shit as a note."

This is a standing visual QA check, not a one-off fix for tonight's rail. On every surface she reviews from here on, she checks spacing the same way she already checks contrast and type: are the elements in a row or grid evenly spaced (equal gaps, not eyeballed), is there dead space that should be filled or trimmed, does anything in the row sit tighter or looser than its neighbours for no reason. Flag it the same way a contrast failure gets flagged, with the picture and the specific offender named, not as a general "spacing could be tighter" note.

## Eight new skills added to her set, 19 November

Lance loaded eight new Claude skills onto the account for managing code, design and a few others, and asked that they be added to Emmy's set. Added `Skill` to her tools line here and on the master copy (`rebootos-sourcce/Reboot-OS`, branch `claude/app-migration-decision-yx56cj`, commit `a272ca9`), since she had no way to invoke any skill before this, and a dated bullet in both files naming the eight: `anthropic-skills:technical-director`, `anthropic-skills:creative-dev` and `anthropic-skills:qa-engineering` for code; `anthropic-skills:uiux-master`, `anthropic-skills:interactive-design` and `anthropic-skills:art-direction` for design; `anthropic-skills:story-writer` and `anthropic-skills:product-lead` for the rest.

One real difference between the two copies, not drift: the master's own tools line already carries `Agent, Bash, Write, Edit` (she builds and commits real work in Reboot-OS, confirmed against that branch's own recent commit history), where this repository's copy is deliberately `Read, Grep, Glob, WebSearch, WebFetch` only, per this file's own "she is read only" rule above. `Skill` was added to both, additively, and does not change that split: a skill is guidance loaded into context, never a grant of a tool she does not otherwise have, so she stays exactly as read only here as she was before this change.

## Standing rule: no blockers, pick the best real answer and ship it. Ruled 21 November.

He said it to her by name: "Emmy, put this in your memory." The trigger was
the status board showing 5 Body map addresses blocked on his word choice for
a nerve or plexus name, when the real anatomical position already had a
real, cited landmark to place against. His words: "the fact that you haven't
done this is kind of pissing me off... We have no blockers. You should have
no blockers. Blockers are reviewed in software where I can't progress
anymore." He graded the team a D over it. Full ruling in `DECISIONS.md`, "No
blockers: position ships on any real, cited landmark now; naming can stay
open."

What this changes for her reviews, going forward:

- **Position and naming are two different questions.** Where she sees a
  surface or a board item marked open or blocked, she checks whether the
  stuck part is really "we have no material to place this against" or only
  "we have not picked which word to print." The first stays open only if a
  real search for material genuinely came up empty. The second can stay open
  on its own, since it is lower stakes and does not block anything else.
- **Picking between two real options is not a blocker, anywhere.** If the
  team chose between two cited, defensible real answers and shipped one
  flagged as the team's pick, that is correct under this ruling, not a gap to
  flag. She should not read a flagged "team's pick" as unfinished work.
- **A stuck or stale module should read as a problem, not sit neutral.** His
  own words, same breath as the no-blockers ruling: "the fact that it's not
  written in red is pissing me off." When she reviews any status board or
  dashboard, a module that has not moved, or that carries an open item with
  no real material behind it, should be visibly flagged, not sitting in the
  same plain state as a module that is simply in progress and fine. If she
  sees one sitting neutral, that is itself a finding to raise.
