# The practitioner story, reviewed three times, sorted for build

Round OI, 1 October. His words, verbatim, are the first section. Everything
after it is the team's reading, and where it disagrees with him it says so and
asks.

## 1. His words

"The practitioner menu is turned on in the profile. When you turn that on, it
unhides the practitioner menu after embody. As a user story: as a
practitioner, when I come to this page, on the left-hand menu I can see all I
can see my cohort who are active and who are not. I can swipe left to unlink
them or swipe right to edit the data I have access to. That was given to me by
the user. And I can add notes that go back to the user. In the center column
is the analytics of the person. And on the right side is the summary, the
information panel, which gives me information on whatever analytics object I
select. It summarizes based off of the person's story, in relation to the
behavior of a person's story in relation to that object. It pulls areas
blocked, like nerve health, in those given areas. It gives a person CQ and DQ
score, and shadow weights. That can be sorted by name or weight. As a
practitioner I can save notes on each cohort individually. I can save those
notes in the history. And I can see what the summary is of those notes, based
off the client, the individual cohort. Review this twice, review this three
times, figure out how you're going to sort it and put this into development.
And then from a percent complete to MVP, how are we looking?"

## 2. First review. The story as one sentence per surface

- **The door.** Profile switch on, a fifth section after Embody. Built at
  round LL as a switch and a sketch (`ui/practitioner.js`, 124 lines). Nothing
  reads another person's record yet.
- **Left column, the cohort.** One row per person who has granted access.
  Shows active or not. Swipe left unlinks. Swipe right opens the data this
  practitioner may edit, which the person gave them.
- **Centre column, analytics of the selected person.** The analytics surface
  (`ui/analytics.js`) drawn for that person's record.
- **Right column, the information panel.** Follows whatever analytics object
  the practitioner selects in the centre. Shows a story-based summary of that
  object for this person, the areas that are blocked with the nerve each
  serves, the person's CQ and DQ, and shadow weights. Sortable by name or by
  weight.
- **Notes.** Per person, saved to a history, with a summary of the notes. Some
  notes go back to the person.

## 3. Second review. Gaps, where the sentence does not say enough to build

Each is a question with its ways. Nothing here is answered for him.

1. **What is active?** "Who are active and who are not." Ways: A, the person
   opened the app in the last seven days. B, the person did a ritual or a
   release in the last seven days. C, the link is live and not paused.
   Recommend B, since it is the thing a practitioner can act on, with the
   window shown on the row.
2. **Swipe is a touch gesture and a destructive one.** On a desktop and for
   anybody who cannot swipe it needs a button each. Unlink must be undoable
   for a moment and must say what it does: the practitioner loses sight at
   once and the person's record is untouched.
3. **"Edit the data I have access to."** Edit which data? Ways: A, only the
   practitioner's own additions (notes, a protocol they assign, a ritual they
   suggest), never the person's answers. B, anything the person marks
   editable, with every edit attributed to the practitioner, visible to the
   person and reversible by them. C, anything in scope. Recommend A first, B
   later. A silent edit of a person's readings by a second person is the one
   thing the provenance rules exist to stop.
4. **"Notes that go back to the user."** And, separately, notes saved "in the
   history" with a summary. Are these one kind of note or two? Ways: A, two
   kinds, a private note for the practitioner and a shared note that goes to
   the person, chosen on each note. B, every note is shared. C, every note is
   private and sharing is a separate act. Recommend A, with private as the
   default and sharing an explicit press.
5. **"A summary of those notes."** Rules over the notes' own words and tags
   (counts by seat, recurring words, dates), or something that reads them?
   There is no model in the app, so it is rules, and the summary is a count
   and a list of the person's own phrases, not an interpretation.
6. **"Summarises based off the person's story."** The story is the most
   private thing the product holds. See conflict 1 below.
7. **"Areas blocked, like nerve health."** The product does not measure
   nerves. What it has is which addresses hold charge and which nerve or plexus
   the codex names at each. The honest label is "where charge is held, and the
   nerves that serve it", never a nerve health score and never a diagnosis.
8. **"A person's CQ and DQ score, and shadow weights."** Which are shown and
   in what order is in conflict 2 below.
9. **"Cohort."** Tier four is written as "cohort lead capability" in his
   price list and the mode is called practitioner in the switch. One word per
   concept: which one is the customer-facing word?

## 4. Third review. Conflicts with what he has already ruled

1. **The story is not seen by a practitioner.** `DECISIONS.md` rules that a
   cohort lead sees fetters, saboteurs, complexes, hyper-complexes and their
   analytics, "not the spiritual material and not the story cloud", and
   `engine/plan.js` 87 to 98 says the story is the one thing that never
   crosses. A summary written from the person's story, shown to a second
   person, is the story's content in a derived shape. It needs its own
   explicit grant from the person, named on the grant screen, off by default,
   or it is built from the structure alone (which addresses, which patterns,
   how heavy). Recommend building the structure-only version first.
2. **A panel sorted by coherence is a leaderboard with a licence.**
   `DECISIONS.md` 513: "Group views sort by what needs attention, never by who
   is ahead." His sort by name or by weight is inside that ruling, if "weight"
   means shadow weight, heaviest first. CQ is shown beside the person and is
   never a sort key and never ranks the list.
3. **The app has one network seam.** `CLAUDE.md`: "The app gains network at
   exactly one seam, fetching a record at sign in." Reading a client's record
   is a second seam. It needs his ruling to widen, and a controller exists the
   moment another person's record is on another person's screen: access,
   deletion and breach duties attach.
4. **Consent, a visible list of who has sight, and revocation** are all
   required by `CLAUDE.md` before a practitioner sees self report. None exists.
   The person-side half (the list of who can see me, with a revoke) is part of
   this build and is built first.
5. **Tier.** Practitioner mode is a free switch today. Tier four carries the
   capability in his price list. Gating by tier is a server decision (the
   entitlement) and a client one (the switch is shown, the door opens, only
   when the plan says so).
6. **Writes by a second person.** Any edit carries provenance and is visible to
   the person (`validateProfile` is the boundary; a practitioner write is a new
   writer to it).

## 5. Sorted for build

Everything in the story can be built and gated now in a form that reads no
real person, because the product already carries fifteen worked example
people that never reach a record. The practitioner page is built first against
those, honestly labelled as examples, which is the posture the page already
takes ("not built yet" where a value would sit).

| Slice | What it is | Needs | State |
|---|---|---|---|
| PR1 | The three column page: cohort left with active or not and a button for each swipe (unlink, edit), analytics in the centre for the selected person, the information panel on the right following the selected object, built on the example people | none | buildable today |
| PR2 | The right panel's content from structure alone: CQ, DQ, shadow weights sortable by name or weight (heaviest first), where charge is held and the nerve each serves, in grounded words | none | buildable today |
| PR3 | The practitioner's own notes: per person, private by default, a history list, a rules-based summary of the notes, stored on the practitioner's device | none | buildable today |
| PR4 | The person's side: a list of who has sight with a revoke, in Settings, empty until accounts | none | buildable today (empty state) |
| PR5 | The grant model on the server: link request either way, scopes (read, notes), accept, pause, revoke, unlink, who-has-sight list; migrations and routes in reboot-os | accounts decision, the second seam ruling | waits |
| PR6 | A client's record fetched under a grant, scoped by tier and grant; the page leaves examples and reads real people | PR5 | waits |
| PR7 | Notes shared to the person (they see them), push for a new note | PR5, PR6 | waits |
| PR8 | A practitioner's edits with provenance, visible and reversible by the person | PR6, ruling on 3 above | waits |
| PR9 | The story-derived summary on the right panel | explicit story grant, the owner's ruling | waits |

PR1 to PR4 are one agent's work and are the practitioner page's share of
today's build. PR5 to PR9 are the accounts build, in that order.

## 6. Questions for him, with the ways and the cost, in the order they block

1. Active means what? (3.1)
2. What may a practitioner edit? (3.3)
3. Two kinds of note, or one? (3.4)
4. May a second seam be added, so the app can read a client's record? (4.3)
5. May the information panel read the person's story, with the person's
   separate yes, or is it structure only? (4.1)
6. Cohort or practitioner, which is the word? (3.9)
