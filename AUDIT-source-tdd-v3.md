# V3 intelligence TDD, checked against the build and the first audit

Round NA's own document, `SOURCE-TDD-V3-intelligence.md`, read against
`AUDIT-source-tdd.md` and the real code rather than against the first
audit's summary alone. Build HEAD `866eadf`, clean tree, `node
tests/engine.js` 1841 passed 0 failed, no code changed producing this.

**The short version.** Most of V3 restates the first TDD's evidence and
hypothesis layer as a per-person graph; the engine is not built that
way. Two parts are genuinely new: measuring change over 90 days, and a
contract for how a runtime AI reasons. The longitudinal engine needs the
first audit's own gap D5 closed first, and D5 is wider than logged. V3's
release verification does not fix the circular before/after as written;
it fixes it only if the intensity numbers come from the person, and even
then release is aimed at the heaviest addresses, so an apparent "8 to 3
to 2" can be regression to the mean rather than a real effect.

## 1. V3's vocabulary against the real code

| V3 | Real counterpart | Status |
|---|---|---|
| Trace Graph | No generic graph exists. Relationships are fixed canon tables, the same for every person: address to axis (`compute.js:236`), saboteur to addresses (`:277`), complexes as sorted pairs (`:294-297`), hypers (`:301-304`). Per-person state is about 40 numbers; everything else is recomputed. | Conflicts with the engine's shape |
| Evidence nodes | `atomIndex` (`ui/wheel.js:230-244`): address to amount, entry index, time, text, built by re-parsing stored entries. Lives in the UI, keyed by array position, re-parses under today's lexicon. | PARTIAL, the closest real thing |
| Confidence bands WEAK to VERIFIED | Already measured and rejected once as a cut line on output (`sniff.js:808-831`). Calling an uncalibrated 0.9 "VERIFIED" is a label that lies. | CONFLICT if ever shown to a person |
| Limiters (negation-heavy language) | Three separate negation handlers with different look-back windows (`sniff.js:698-707`, `sourceai.js:80-86`, `verp.js:367-384`), and the core parse path itself (`scanStory`/`parseStory`) reads no negation at all, measured directly. | MISSING, blocked on one shared fix |
| Bank / Vault | Already product words: the Bank is held imprints, the Vault is released ground read off `meter.unique` (`storyui.js:26-27,134-151`). `meter.unique` is the billed set and only ever grows. | Collides with the billing meter |
| SourceOS question choice | `srcRung`/`srcTurn` choose by how often a story returns to a seat, never by which question most reduces uncertainty as V3 specifies. Asks at 7 or over, never twice, "Move on" is final. | A different, working algorithm; picking V3's instead conflicts with the owner's own "the person leads" ruling |
| AI Handshake | No model exists (`storyui.js:438`, "Scripted. No model is called."). Pieces exist informally: a `because` on every row, `gaps`, lenses marked unread, gates that refuse to run on assumed zeros. | MISSING, and has no consumer to guard yet |

## 2. What is genuinely new

**(a) The 90-day engine needs the first audit's own gap D5 closed
first, and D5 is wider than logged.** `snapshot()` writes counts only
(`schema.js:246`); the nine axes are not on a history row either; every
row is rebuilt from a whitelist on load (`:986-1027`) that silently
drops anything not on it. What can already be followed over time: laws
by name, which days a ritual was done, the date an address was first
released. What cannot: any saboteur, complex or hyper by identity, any
axis charge, a stable re-parse (entries carry no lexicon version, so a
later lexicon silently rewrites the past, which `schema.js:720-723`
already refuses to do for exactly that reason).

This is decisive, checked against `TASKS.md`'s own NN3: with ninety days
of perfect use, the mid case moves 25.00 to 25.54, a story only ever
adds charge, and after ninety daily releases four of 112 addresses hold
their opposite. A classifier run on this state would label nearly
everyone UNCHANGED, and that label would describe the release formula's
own constants, not the person. Negative evidence and pattern replacement
specifically cannot be learned from a journal people write voluntarily,
since an absence is never written down unless the product asks, and
"fear down, perfectionism up" is exactly what happens whenever someone
releases at one seat and writes about another, an artifact of where they
released rather than a finding about them.

**(b) Release verification does not solve the circularity as written.**
Today: before is the held charge, after is that same number minus a
fixed formula, "cleared" is a threshold on the result. V3 never says
where its own INTENSITY number comes from; it is compatible with a
real fix (a rating from the person) but does not specify one. Even with
a real rating, release is aimed at the heaviest addresses, so the honest
control is a later rating at an equally heavy address that was not
released, to separate a real effect from regression to the mean. One
real defect found in passing: the product's own finished-release card
already says "N cleared entirely," a threshold on a formula presented as
a fact, which V3's own no-overclaim rule would forbid.

## 3. Global analytics against the privacy rulings

`DECISIONS.md`'s own rulings, read in order rather than from the
oldest one alone: the story is stored joined to the record for
recovery, never shared, used for modelling only, with consent, encrypted
at rest, de-identified before any model sees it; narrowed further to
"aggregated word and phrase combinations... used to refine the
sniffer's lexicon... not training a general model." V3's own "global
data is a prior, never proof" decides how an aggregate is used once it
exists; it does not decide what may be collected, so it does not answer
the privacy question the first audit already raised.

Checked one by one against V3's own analytics list: common language and
limiters are within the ruling, and the product already has a place for
exactly this (a fifth lexicon source with its own provenance). Somatic
associations, pattern combinations, charge trajectories and intervention
sequences are all beyond the ruling: each needs a dated series per
person held off the device, and the code's own outbox already refuses
`imprints`, `axes`, `history` and `meter` by name. A population
"intervention response" learned today would only rediscover the release
formula's own fixed constants, the same for everyone.

## 4. The AI Handshake against CLAUDE.md

Mostly restates what the code already does under different names (no
invented history, no diagnosis, no manufactured insight on an empty
state) and in one place restates CLAUDE.md's own count rule while V3
itself breaks it elsewhere ("weights are configurable," an undefined
`risk_of_overinterpretation: 0.0`). One real conflict: V3's own report
headings (IMPLEMENTED, TESTED, UNVERIFIED...) conflict with CLAUDE.md's
ruled four headings "and nothing else"; resolution is that V3's status
words stay inside working documents and the reply to the owner keeps
the four headings. One architectural problem: V3 has the AI fill in its
own risk assessment, and a guard a model reports on itself is not a
guard; the codebase's own posture is enforced boundaries checked by
code, not a model's own self-report, and that is the recommended shape
here too.

## 5. Buildable now, no ruling needed

The two audit bugs first (`compute.js:268-284`, `:294-297`), since
building identity tracking on top of a duplicate inherits it. Closing
D5 (put saboteur, complex, hyper names and the nine axes on each history
row) is the prerequisite for everything in V3's own sections 35 to 42
and carries no privacy cost, since it stays on the device. Stamping a
lexicon version onto story entries, so a re-parse is reproducible.
Saving the Heavy mark from a release, the one body report the product
already collects and currently throws away. Moving `atomIndex` into the
engine as a real evidence index, rather than building V3's full graph.
One shared negation handler above `parseStory`, the prerequisite for
limiters and contradiction both. Individual analytics from what is
already stored.

## Open, his to rule, eight questions

1. May the product ask a person to rate how strong something feels, 0
   to 10, before a release and again a few days later, unprompted?
   Without this, "released" stays calculated rather than measured.
2. Should the finished release card stop saying "N cleared entirely,"
   a threshold on a formula that V3's own rule would forbid?
3. Beyond word and phrase combinations, may dated sequences of a
   person's own readings and releases leave the device at all, even
   with no name attached?
4. When something released comes back, does it return to the Bank, and
   does releasing it again spend allowance? Today the Vault is the
   billed set.
5. Source AI picks its question by how often a story returns; V3 wants
   it to pick whichever question reduces the system's own uncertainty
   most. Which governs, given the owner's own "the person leads" rule?
6. "Pattern" now has three meanings in this codebase: one release line,
   a recurring mechanism, and a saboteur family. Which does a 90-day
   report track?
7. The owner's own six expression channels, or V3's seven with
   "somatic" added?
8. Negative evidence only exists if the product asks. Is a prompted
   check-in in scope, close to the ritual reminder already ruled in?
