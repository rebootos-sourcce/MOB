# Handshake · Emmy, for any thread or repo that wants her

Emmy is Lance Powell's personal agent: product manager, development supervisor and creative
taste-maker for Atüned and his other work. Lance named her on 2026-10-15. She is a Claude Code
subagent: one definition file plus a library she reads on demand.

## What is in this pack

    .claude/agents/emmy.md          her definition: who she is, how she works, Lance's rules and corrections
    .claude/emmy/LIBRARY.md         index of everything below, and how to use it (read first)
    .claude/emmy/voice_profile.md   how Lance writes and what he likes, from his own work
    .claude/emmy/one_perspective.md her synthesis of all the lenses as one voice (draft, not yet approved)
    .claude/emmy/lenses/            13 files: the people she thinks through (engineering, type, color,
                                    UI, copy, marketing, games, motion, behavior and spirit)
    .claude/emmy/traditions/        the spiritual and esoteric reference, plus masters_paths.md:
                                    the paths of the Compass masters, her standard for "100 percent coherent"

## Install her in a repo (for example MOB, the Atüned desktop app)

1. Unzip at the repo root, so the folders land at `.claude/agents/` and `.claude/emmy/`.
2. Commit them. Any Claude Code session on that repo then has her as the subagent type `emmy`.
   A session that is already running may need a restart to see a new agent.
3. Call her by asking for Emmy, or by spawning the subagent `emmy` with a task.

## What she can and cannot do

- **Tools:** Read, Grep, Glob, WebSearch, WebFetch, and three read-only Google Drive tools
  (search, read, metadata). The Drive tools only work where the Drive connector is attached.
- **She is read-only.** She cannot edit files, run commands or push. She reviews, researches and
  writes her answer back; the calling session saves files and builds.
- **Drive is read only, always.** She never creates, edits, moves, shares or deletes in Drive.

## How to use her well

- **Give her the thing, not a summary.** For a review, point her at the file paths or screenshots.
  Example: "Emmy, review the Compass panel and the percent readout in shots/compass_*.png against
  Lance's taste and rulings, before merge."
- **Ask one job per call:** review, research, voice check, or plan.
- **Her standards travel with her:** no em dashes, every number shown is real, Lance's words are
  never changed, lenses are angles and not authorities, and a fact she could not verify is marked.
- **Her knowledge of Atüned:** her definition predates the move to MOB. In MOB, point her at
  `HANDOFF-2026-10-15/ORIENTATION.md`, `DECISIONS.md` and the code. MOB's rulings win over anything
  in her library that came from the Reboot-OS web app.

## Where she lives

Her master copy is in `rebootos-sourcce/Reboot-OS`, branch `claude/app-migration-decision-yx56cj`,
under `.claude/`. When she is updated there, re-copy the files to keep other repos in step.
