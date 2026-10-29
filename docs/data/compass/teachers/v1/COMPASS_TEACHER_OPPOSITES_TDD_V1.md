# Compass teacher/opposite research, protocol and avatar TDD (2026-10-25)

**Status:** Four-lens authored records and mappings available on feature branch; runtime NOT wired, Canon/CQ/DQ unchanged.

## Owner voice notes (quoted; transcript-normalized punctuation only)

> “So then let’s build records for them. Let’s get them organized. Uh, for the teachers and their polar opposites. And their polar opposites, I suspect, are going to be on the Inferno. And the teachers will be on Paradiso”

> “At a different levels”

> “Right, so that means we need to create templates and records for them. We need to do it for dep- research pass. You need to organize a strategy around thatAnd then execute your blocks”

> “Um, and then we want to map just like the Inferno ones, we want to map their behaviors to the ascent and see where they line up in their coherence”

> “Yeah, but when you go to search on the research on them and their paths and their teachings and get their behaviors, uh, you’ll see where they where they land”

> “So each teacher showed up Uh, at a period of their time against a polar opposite behavior. So you should be able to find the polar opposite behavior of the teacher’s pathand then find the kind of like entity name that is a manifestation of that time”

> “Four passes, sorry, four passes”

> “Okay, so here’s what we still want to do even with Rama, Jesus. Um, we want to do the same thing we did with the Inferno characters, which is find the best descriptive word that embodies either their path or like the main kind of descriptive word.”

> “Um, and then we’ll eventually going to hide Jesus and Buddha and Lucifer, ’cause tha- those all those words are super triggering. But if we said love, compassion, beauty, yeah, that’s more palatable, I think.”

> “And then we get to show all of the, uh, various archetypes that that level that show the behavior. So it kind of makes it almost like a board game in a way”

> “So one note for the TDD for the Compass, The descended characters are uh for the release protocols for the individual user and then the ascended um are the rituals”

> “And then the Purgatory is all the release protocol”

> “And that means that your icon is actually your avatar. And your avatar is that’s the journey your your avatar’s path”

> “Right, so a person’s DQ is directly tied to the descent in the CQ is tied to the ascent in their shadow is tied to the limbo oscillation”

> “So people get achievements by releasing the fetters um and the saboteur structures negative. And they get award uh achievements by becoming, um but not everyone’s going to become all of them. And so there’s a tree on both sides, like a like an achievement tree that I can say, anyway, not this is important right now. Let’s continue what we’re doing. Just put a note for that”

> “TDD included”

> “execute number one and make sure you run it recursively so you get all of your depth information and you build out all of the teachers and their opposites and just complete it to the very end. So this is a task that is completed”

## Requirements and layer ownership

1. **Inferno** records are the **descended patterns** and release targets; DQ reads descent. Characters and their behavioral source are descriptive symbols, not a literal classification of people.
2. **Limbo / Purgatorio** holds the **release protocols** and shadow oscillation between limiting beliefs and their constructive inverses. The waist is the existing 40–60 zone; never create another CQ calculation. A Purgatorio release record must reference affected Inferno patterns and evidence events, not a person's moral identity.
3. **Paradiso** holds the **ascended rituals** and constructive capacities. CQ maps ascent. Eleven named teachers are coordinate anchors; they do not represent numeric ranks, ten fixed levels of worth, or ten equivalent spheres.
4. **Avatar/icon**: the player-facing icon expresses the current journey and selected behavioral quality. Source figures (Jesus, Buddha, Lucifer, etc.) remain separate in provenance fields and need not appear in default UI. Preserve stable ID/icon reuse, and never silently rename Canon.
5. **Achievements (deferred)**: two possible branches of achievement tree: release fetters/saboteur structures through supported practice; grow through chosen constructive capacities. Not everyone will traverse every branch. No points for claims of moral superiority; milestones need explicit action/evidence. **This is a TDD note only, not an authorization to build the gamification engine now.**

## Master/opposite mapping and research requirement

- Create 11 teacher profiles and 12 inverse behavior profiles: eight exact named mirror poles and four explicitly **candidate behaviors** where no named inverse exists. A single teacher, Jesus, anchors both IL and RE; do not fabricate a twelfth teacher.
- Every record preserves the 21 standard descriptive template keys and four distinct depth-analysis passes: **(1)** historical/traditional source and context; **(2)** teaching-to-observable behavioral mechanism; **(3)** many-to-many Paradiso/integrity laws/mirror and inverse links; **(4)** counterexamples, false positives, ethics, identity ambiguity.
- Four analytical lenses do **not** prove four independent source verifications, clinical validity, or original historical fact. Historical antagonists (Pharaoh, Ravana, Baal) are contextual narrative counterparts, not necessarily canonical inverted poles.
- Inferences about who is "coherent" must come from demonstrated actions contextualized over time; never automatically classify people or assign a Paradiso sphere from CQ.
- Archetype levels are **behavioral lenses**, not human-worth tiers. Unnamed candidate entity remains null until historical sources justify and owner canon approves naming.
- The engine's canonical eight pole connections are IL Jesus↔Lucifer, DE Ramakrishna↔Asmodeus, OR Moses↔Set, PO Musashi↔Moloch, PE Buddha↔Geryon, TR Rumi↔Charon, CH Elijah↔Phlegyas, RE Jesus↔Furies. Teacher source histories supply additional narrative counterpart notes but no new engine mirrors.

## Descriptive graph contract

`teacher -> candidateParadisoIds` many-to-many; `teacher -> compass:axis` only if exact engine mirror; `inverse -> teacher` for every row; `inverse -> inferno:id` only when archive-backed identity matching exists. Link objects include `type` and `status` marking ENGINE_SOURCE, ARCHIVE_VERIFIED, or CANDIDATE. Proposed links are **not live graph edges**. `ritualId` and `releaseProtocolId` are null until design and consent-safe evidence routing are built.

## Validation and remaining dependencies

Test that all 23 new records have unique IDs, 21 compatible keys, four nonempty passes, provenance, an opposite-reference, named source statuses, no duplicates, valid figure-to-axis mappings, and no unapproved runtime/canon changes. Integrate with existing 38 Inferno, 23 Purgatorio, 10 Paradiso and 12 archetype records after reverse-edge and content review; merge only with project review. This build does **not** certify the outstanding Inferno semantic gaps, source publication, independent historical proof, or deployed avatar/protocol interactions.
