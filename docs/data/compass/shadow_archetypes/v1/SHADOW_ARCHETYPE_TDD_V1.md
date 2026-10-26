# ATUNED: One/Two-Word Shadow Characteristic Atlas (V1)

**Date:** 2026-10-25 · **Status:** Research records and sanitized app data contract. **Not integrated into the active app.**

**Owner direction:** Find the archetypal feature and characteristic; hide the source name and reveal only the characteristic. When a real behavior is unsupported, cut the unsupported behavioral assertion, not its textual history. The model is about observable movement, not condemning people, faiths or identities.

## Complete inventory

| Internal identity (research only) | Public characteristic | Basis | Pole |
|---|---|---|---|
| Charon | **Gatekeeping** | DRAFT_SOURCE_OR_MODEL | TR |
| Minos | **Judgment** | DRAFT_SOURCE_OR_MODEL | — |
| Cerberus | **Insatiability** | DRAFT_SOURCE_OR_MODEL | — |
| Plutus | **Possessiveness** | DRAFT_SOURCE_OR_MODEL | — |
| Phlegyas | **Reactivity** | DRAFT_SOURCE_OR_MODEL | CH |
| The Furies | **Vengeance** | DRAFT_SOURCE_OR_MODEL | RE |
| Minotaur | **Violence** | DRAFT_SOURCE_OR_MODEL | — |
| The Harpies | **Torment** | DRAFT_SOURCE_OR_MODEL | — |
| Geryon | **Fraud** | DRAFT_SOURCE_OR_MODEL | PE |
| The Giants | **Overreach** | HIDDEN_COMPOSITE | — |
| Lucifer | **Separation** | DRAFT_SOURCE_OR_MODEL | IL |
| Malak | **Extractive Control** | ATUNED_ONLY_NO_SOURCE_IDENTITY | — |
| Baal | **Unchecked Appetite** | ATUNED_ONLY_NO_SOURCE_IDENTITY | — |
| Asmodeus | **Obstruction** | DRAFT_SOURCE_OR_MODEL | DE |
| Set | **Internal Sabotage** | DRAFT_SOURCE_OR_MODEL | OR |
| Moloch | **Sacrificial Extraction** | DRAFT_SOURCE_OR_MODEL | PO |
| Kaliya | **Poisoning** | DRAFT_SOURCE_OR_MODEL | FL |
| Ravana | **Coercive Abduction** | DRAFT_SOURCE_OR_MODEL | AL |
| Shu and Hu | **Forced Alteration** | DRAFT_SOURCE_OR_MODEL | HO |
| Apep | **Sabotage** | DRAFT_SOURCE_OR_MODEL | SA |
| Druj / The Lie | **Deceit** | DRAFT_SOURCE_OR_MODEL | TU |
| The farmer of Song | **Forced Growth** | DRAFT_SOURCE_OR_MODEL | NA |
| Bael (Goetia) | **Concealment** | HIDDEN_CONTEXT | — |
| Nimrod | **Hubris** | DRAFT_SOURCE_OR_MODEL | — |
| Ephialtes | **Defiance** | DRAFT_SOURCE_OR_MODEL | — |
| Antaeus | **Assistance** | HIDDEN_CONTEXT | — |
| Medusa | **Petrification** | HIDDEN_CONTEXT | — |
| Dis Pater (Roman) | **Underworld Sovereignty** | HIDDEN_CONTEXT | — |
| Dis (Dante alias) | **Separation** | HIDDEN_ALIAS | — |
| City of Dis | **Defended Threshold** | HIDDEN_SETTING | — |

## Key differentiations

**Garion/Geryon = Fraud.** Dante specifically codes the honest face hiding the sting as fraud; Greek Geryon's older cattle legend is another narrative. [Princeton Dante](https://dante.princeton.edu/cgi-bin/dante/DispToynbeeByTitOrId.pl?INP_ID=212821).

**Druj = Deceit.** Avestan falsehood/deceptive order opposed to Asha. A concept/personification, not a new human character. [Encyclopaedia Iranica](https://www.iranicaonline.org/articles/druj/).

**Asmodeus = Obstruction** of voluntary union, as repeatedly demonstrated in Tobit; lust and possessive jealousy may be later or translation-specific claims. [Tobit](https://bible.usccb.org/bible/tobit/3).

**Malak = Extractive Control in ATUNED only.** Ancient `mal'akh` denotes a messenger/angel and does not prove the existence or negativity of one demonic identity; source identity remains unverified. [Lexicon](https://biblehub.com/strongs/hebrew/4397.htm).

**Baal = Unchecked Appetite in ATUNED only.** Ugaritic Baal/Hadad was a storm and fertility god; later demonological **Bael** has the office of granting invisibility (Concealment), not interchangeable with this god. The source-derived connection to vice is **cut** and the owner's symbolic label retained explicitly as a model. [Met Museum](https://www.metmuseum.org/ja/essays/the-gods-and-goddesses-of-canaan); [Lesser Key](https://www.gutenberg.org/files/72679/72679-h/72679-h.htm).

**Set = Internal Sabotage as owner interpretation.** Set kills Osiris but also protects Ra against Apep. Do not equate Egyptian deity wholesale with a villain. [Egyptian Museum](https://egyptianmuseum.org/deities-seth).

**Moloch = Sacrificial Extraction** in owner model, informed by contested child-sacrifice texts; whether Molek is deity or rite remains disputed. [Oxford](https://academic.oup.com/edited-volume/60552/chapter-abstract/523947655).

**Dis** in Dante is sometimes an alias for Lucifer, also naming a city of lower Hell; **Dis Pater** as the Roman underworld deity is historically distinct. All are documented separately but none yields an invented additional shadow character. [Princeton Dante](https://dante.princeton.edu/cgi-bin/dante/DispToynbeeByTitOrId.pl?INP_ID=201813).

**Remaining archive:** all 11 Inferno figure records and all three cross-tradition entries are represented. Giants is not a valid negative classification for every individual: Antaeus helps the travelers, so he is context-only. All 14 named opposite poles from `teachers_recipes.js` have unique short traits. Nine circles, 15 motifs, 12 core archetypes and four provisional inverse mechanisms remain in their own registries and are **not** incorrectly counted as new figures.

## Display contract

`PUBLIC_CHARACTERISTICS_ONLY_V1.json` has opaque IDs, a stable two-letter pole key where present, a one/two-word characteristic, and a behavioral sentence. There are **no identity fields, source names, teacher names or literary references** in the public artifact. Use the private registry and Markdown records for developer provenance only. Source category `MODEL_ONLY` is ATUNED interpretation, **not historical evidence**. `CONTEXT`, `ALIAS`, `SETTING` and `COMPOSITE` records are suppressed from user shadow displays.

Current app source still holds and displays figure names directly. This work **does not falsely claim runtime hiding**: the manifest has not been wired to the public projection, and full UI tests have not run. No existing Canon/CQ/DQ code or established archetype IDs changed.

## Next gate

Run the Node validator, integrate the projection with all Compass and tooltips/ritual panels, inspect for visible identity leakage, keep private provenance severed from client payload, and conduct regression tests. Charon ↔ Trust and Furies ↔ Revelation remain interpretive pole-fit questions, not source-name mistakes.
