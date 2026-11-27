# Summary page: what he asked for, and how it was read

Owner's words, speech to text, 1 October 2026, about Discover > Summary:

> "For a summary, we want to add their name, root meaning, energetics as well.
> As if it's the person written as if the person's nine. In grounded language.
> Whatever our documentation says. And then this layout is still really bad.
> So I want the UIUX team to review the layout three times. It's not organized.
> In a meaningful way."

Later the same day, round OJ, he answered the first half himself:

> "For the summary header, not the header itself, but for the summary, on the
> right side, because this is information that won't change, we want the root
> energetic meanings of their name. For example, my name's Lance O'Neill
> Powell... The root energetic meanings means to pierce, champion, and
> exalted. My root behaviors, had you not told me that I act like that anyway.
> And so people tend to behave in accordance to the energies of their name.
> After you get your first root energetics, after you are severed from your
> mother's umbilical cord, the very next thing is your name. So we're showing
> the person what their name means so that you can understand how these things
> are all driving everything. This is really kind of like a cascade of drivers."

## Step 1. The first reading, before the clarification

Read from `ui/summary.js`, `ui/rootsum.js`, `engine/overlap.js`, `engine/birth.js`,
`engine/numerology.js`, the GLOSS table in `engine/data/kb.js`, `COPY.md`,
`DESIGN-quotients.md`, `DECISIONS.md` and `SUMMARY-AUDIT.md`.

| Phrase | Candidate | Evidence for it | Against it |
|---|---|---|---|
| name | The first name, big, at the head | `sumPlate` already printed it. Round LV: "this page has one job before any other and that job is to say this is you" | A first name only. The full name sat 1.9 screens down inside a numerology sentence (`summary.js` header comment) |
| name | The whole name, every part | `numerology.js` already reads first, middle and last separately ("Each name") | Not visible near the top |
| root meaning | The meaning of the root energetics (the four systems read across) | "Root Energetics" is the product's own name for the left rail section and for `ui/rootsum.js`, round FV: "take a look at all the behavioral energetics where they overlap, because that's the truth, and then use that as the summary" | The word "meaning" |
| root meaning | The meaning of the name (its etymology) | The plain sense of the words | `DECISIONS.md` rules "No etymology table": a meaning for an arbitrary name cannot be looked up on a device that makes no request. `numerology.js` says the same in its header |
| root meaning | The meaning of the root domain (Architect, Engine, Weaver, Witness) | `ROOT_ELSAYS` (the Western lens) says what each one is | It is a choice a person makes, not a thing that was given |
| energetics | Root energetics as one paragraph written about the person | `ROOT_SAYS` already holds second person sentences for exactly this, written to a bar he set: "plain, direct and warm without talking down" | |
| the person's nine | The nine axes (the child emotions, the fetters) as the person's own set | `sumAxes` carries the comment "This is the nine, written rather than tabled" from an earlier ruling, and the Inferno ruling gives "the nine circles each carry a first person sentence" | |
| the person's nine | Numerology's nine (life path or expression 9) | Nine is "the one who completes" in `NUM_CORE` | It is one number out of nine, so it cannot be a layout |
| the person's nine | Written for a nine year old | His standing rule "always give me steps like I'm 10"; the voice skill's test "a word a ten year old would ask about" | Nine and ten differ |
| the person's nine | Speech to text for "mind" or "mine" | Nothing in the repo | The recognition errors in this message are otherwise few |

## Step 2. What was chosen, and what the round OJ message settled

Before the clarification I built the name as the first name at display size, the
full name under it, the name's number (Expression) as a row, and the root
energetics as the person's own sentences from `ROOT_SAYS`.

After it, three things are settled and one is not.

Settled:

1. **Name** is every part of the name as entered in the profile (first, middle,
   last).
2. **Root meaning** is the meaning of each part of the name, "to pierce",
   "champion", "exalted". It is the meaning of the name and not of the root
   domain.
3. **Energetics** is the root energetics at birth, the first driver. The name is
   the second. Then everything else the page shows. The cascade is built as a
   numbered line, one then two, on the right.
4. Where: on the right, because it is the part of the person that does not
   change. Built as the right hand card of the first row, beside the story.

Not settled, and asked in the report:

- **"As if the person's nine."** Nothing in the clarification touches it. The
  page carries the nine as a three by three set with the place in the body each is
  felt, and the three sentence written reading under it. If he meant first
  person voice, a nine year old reading level, or something else, the picture is
  the one to point at.
- **Where the name meanings come from.** The table is a stub holding his three
  worked examples, marked as his. Options with costs are in the report.
- **A conflict between his examples and the references.** `TASKS.md` round DM and
  `RESEARCH-firstrun.md` checked the three against real references and the
  references differ: Lance roots to "land", with "to pierce" from a later link to
  a word for spear; O'Neill's Niall has no settled meaning and "champion" is one
  proposal of several; Powell's Hywel means "eminent". That note is in each
  table entry and is not printed on the page.

## The ruled constraints, kept

The centre is the story and evidence goes first (`summary.js` 707 to 710). The page
is silent on an unread record and shows the four doors (`CLAUDE.md`). Organised
symmetrically on a grid (`TASKS.md` rounds LV and NT). Nothing is printed off a
default: a blank profile's roster name You is never printed as a name, which pass 2
did and review 3 caught.
