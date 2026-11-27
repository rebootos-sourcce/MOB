---
name: skill-observer
description: Reviews a finished round of work for a repeated mistake, a recurring review finding, or a real gap no skill covers, and drafts a proposed edit to the one skill file (or CLAUDE.md) that should carry it, for the owner to approve before anything is written. Load at the end of a work round, when asked to "check if a skill needs updating," or when the same kind of correction has landed twice. Never applies an edit itself.
---

# Skill observer

This is this project's own version of a "task observer": something that
watches a round of real work and asks whether a lesson from it should be
saved as an instruction a future round will actually read. It exists because
this file already does this by hand, in `## Rules learned the expensive way`
below (CLAUDE.md), and by hand it only happens when someone remembers to.
This formalizes the same judgment call, it does not replace it.

**The one honest limit, stated once so it is never oversold.** Nothing here
makes the model learn. There is no memory between sessions except files a
session writes and files a later session reads. "Self improving" means
exactly one thing: a better instruction saved to a file, in `.claude/skills/`
or in CLAUDE.md itself, that the next round is handed again. A round that
never reads the file never benefits from it. Unchecked self reflection can
also reinforce its own mistake rather than correct it, which is why every
step below ends in a human approval and not a silent write.

## What counts as a real signal

Only these three, because each one is evidence something is actually true
about how the work went, not a guess about what might help someday.

1. **A correction.** The owner, or a reviewing agent (code-review, devops-qa,
   the named directors), said a specific thing was wrong, and the shape of the
   correction implies an existing rule was unclear, wrong, or simply not
   followed. One correction is a note. The same shape of correction landing
   twice, in two different rounds, is a signal worth acting on.
2. **A recurring finding.** The same category of defect shows up more than
   once across separate rounds in a devops-qa / code-review / gate report
   (`tests/`, the gates CLAUDE.md lists, a PR's own CI). A single one-off bug
   is a bug fix. The same root cause landing twice is a gap in an instruction,
   not a gap in attention.
3. **A real, confirmed gap.** A task needed a convention or a standing rule
   and none of the loaded skills, and nothing in CLAUDE.md, actually covered
   it, confirmed by checking the skill list and CLAUDE.md itself rather than
   assumed. This is the only one of the three that can justify a brand new
   skill file instead of an edit to an existing one.

A single mistake with an obvious, local, one-line fix is not a signal. Fix
the line and move on. This skill is for the pattern that would otherwise cost
the same round twice, which is the exact failure CLAUDE.md's own
`## Rules learned the expensive way` section exists to stop, nine times over
on the record already.

## Before drafting anything, check it is not already written down

This repo already has three places a lesson can live, and the standing rule
against two competing lists (`TASKS.md`'s own charter) applies here too:

    CLAUDE.md                the project-wide rulings and standing rules
    .claude/skills/*/SKILL.md   the domain-specific checkable rules
    FEEDBACK-log.md          one entry per piece of feedback that moved the product

Grep the signal's own words against all three before drafting anything. A
lesson already captured gets no new entry; if it is captured but clearly
being missed anyway, that is itself worth naming (the instruction exists and
is not being read or not being followed), not worth duplicating.

## Picking where it goes

- Falls inside a domain an existing skill already states it owns (the UX
  floors, the voice, the anatomy sourcing, the animation principles, the JS
  performance notes)? Propose an edit to that file. Read its current text
  first; the edit is additive to its existing structure, not a rewrite.
- Is project-wide, not scoped to one domain (a build rule, a load order rule,
  a reporting convention, anything CLAUDE.md already governs)? Propose it as
  a new entry under `## Rules learned the expensive way`, in that section's
  own voice: named, dated, with the real cost that made it worth writing
  down, not a generic best practice.
- Is a genuinely new domain with no existing owner (confirmed, not assumed,
  by reading the skill list)? Only then propose a new `SKILL.md`, following
  `skill-creator`'s own process and this repo's existing frontmatter shape
  (see any file under `.claude/skills/*/SKILL.md` for the pattern: `name`,
  one dense `description` naming exactly when to load it, then the checkable
  content).

## What it actually produces

A short report, not a file write:

    SIGNAL      which of the three, with the evidence (file:line, commit,
                round, or the count of times this has now recurred)
    TARGET      which file this belongs in, and why that file and not
                another
    DRAFT       the exact text to add or change, written in that file's own
                voice, as a diff against what is there now

Nothing is written to any skill file or to CLAUDE.md until the owner says
yes. On yes, apply it with the normal Edit tool, in the same pass. On no, or
on silence, it goes in `TASKS.md`'s backlog if it is still worth remembering,
exactly as any other finding that does not change what he decides right now.

## Never

Never edit a skill file or CLAUDE.md on this skill's own initiative. Never
treat a single incident as a pattern. Never invent a fourth place lessons
live when the three above already exist. Never claim a round is covered by
an instruction without having actually read that instruction's current text
first.
