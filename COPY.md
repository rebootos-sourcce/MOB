# Copy. The buckets and how each one is written.

Ruled by the owner. Every string in this product belongs to exactly one bucket
and each bucket has its own shape. A string that does not fit a bucket is a
string nobody decided on.

## The voice, in five words

**Grounded. Direct. Humble. Insightful. Specific.**

Nothing abstract. No soft wellness language. Physical metaphors only. Short
sentences. No em dashes, anywhere, including commit messages. Sentence case, no
all caps. Never say 108; the count stated to users is 112.

The test: **read it out loud.** If you would not say it to somebody sitting
across from you, it does not ship. "Set the root, the archetypes, and the nine
poled axes" fails that test and was on the first screen for months.

## The seven buckets

### 1. Menu

A place you can go. Tabs, rail sections, tab strips.

    ONE WORD. And the word names exactly what the surface does, not what
    it is about and not what it belongs to.

    Energetics   not Intake        a person does not perform an intake
    Body         not Energy        Energy named the subject, Body is on screen
    Fetters      not Child fetters "child" is schema, not information
    Laws         not 21 laws of integrity
    Reading      not The reading   an article is not a word
    Running      not What is running
    Flow         not Flow through

No article, no qualifier, no count in the label. A count belongs on the badge.

### 2. Label

Names a control or a slot. Two or three words, and it never changes with the
data. A label that changes identity when the value moves makes a person
re-parse the layout every time.

    Profile      not Whose field
    Myers-Briggs not Type, if you know it
    Carrying     not Held
    Filled in    not Installed

### 3. Value

The reading itself. A number, a word from a fixed table, or a dash.

    Never invented. A percentage is never printed off a default, and a band
    word never appears without its meaning beside it.

    A dash is the honest glyph for "not read yet". It is not zero.

### 4. Definition

What a term means, said where the term is said. One or two sentences, in the
words a person already has.

    Not in a tooltip alone. A touch screen cannot reach a tooltip and the
    audience arrives on phones.

    "Oscillating" alone is a word a person has to already know. "Oscillating.
    The field spends as much as it builds. Nothing is compounding in either
    direction." is a definition.

### 5. Instruction

What to do, and what will happen when you do it. Second person. Active. The
verb is the first word where the sentence allows.

    Write what happened. The day, in your own words.
    Run the protocol here. Four channels, twenty five lines.

Never "click here". Never a control that says only what it is.

### 6. Reading

The prose the instrument speaks: the story summary, a drill, a finding.

    Every clause is conditional on the value it names existing. A person with
    no birth data gets a sentence saying so, never a paragraph of hedges.

    Say the number, then say what it means, then say what it costs. In that
    order.

    Nothing here is generated from anything the instrument has not measured,
    and the copy says so once at the end rather than hedging throughout.

### 7. Refusal

When the product cannot do something or will not claim something.

    Plain, one sentence, no apology, and it names what would change it.

    "Nothing is held here, so there is nothing to release. The protocol opens
    once this address is carrying."

    Never "oops". Never an exclamation mark. Never a control that offers an
    action it will then refuse.

## Things we never do

- **Read the schema out loud.** "nine poled axes, held state then coherent
  opposite" is a data model. "Nine feelings. The left slider is how much you
  carry it, the right is how much of its opposite is in place" is copy.
- **Name a person off a default.** The band word waits until the measured
  identification earns it.
- **Print a count against a total.** A reading is not a score.
- **Use two words for one concept.** Held, installed and firing are three
  states and keep three words. Everything else gets one.
- **Put the only copy of a definition in a tooltip.**
- **Claim success before we have it.** Every write that can fail reports
  through `status()`.
- **Abstract nouns as headings.** "Awareness" survives because it is a named
  rung in the codex. "Insights", "Journey", "Wellness" do not exist here.
- **Address the product to itself.** "Nothing held. Write in the box and it
  gathers here" is the product narrating. "You have not written anything yet"
  is talking to a person.

## Where each bucket lives

    menu          engine/core.js TABDEF, shell/body.html .lsec-hd
    label         shell/body.html, ui/*.js form labels
    value         ui/component.js cr(), the renderers
    definition    engine/data/canon.js TIERDEF, kb.js GLOSS, the drills
    instruction   ui/component.js startHTML, the buttons
    reading       ui/summary.js sumStory, ui/drills.js
    refusal       wherever a control is withheld

A new string is written in its bucket's shape or it does not ship.
