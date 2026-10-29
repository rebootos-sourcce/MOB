# ATUNED — Avatar + Hero's Journey Board Acceptance Matrix
**Date:** 2026-10-26 · **Status: design gates written; none are claimed executed**

| ID | Acceptance gate | Minimum executable check | Source of truth |
|---|---|---|---|
| AV01 | One CQ | Avatar never calculates a separate CQ; reads compute() and CQ_MODEL | engine/compute.js |
| AV02 | Completeness | Core 10-only profile does not get a false full-CQ realm position | cqSpan() / lawIn |
| AV03 | Realm borders | 0→Inferno L09; 39.999→L01; 40→P01; 59.999→P07; 60→PD01; 100→PD10 | 26-scene map JSON |
| AV04 | Direction | CQ increase ascends through Inferno L09→L01 without reversing source narrative browsing | projection + existing story edges |
| AV05 | Position vs quest | Selected challenge may be an Inferno imprint while avatar stands in Paradiso | avatar projection |
| AV06 | Unique releases | 2 new *limit* and 2 new *truth* keys = two release milestones, not four | CURP.meter.unique + CHAN |
| AV07 | Idempotence | Same rerun = zero new releases and zero new CQ lift | meterRerun/releaseWork |
| AV08 | Persistence | Refused pSaveSnap does not create visible advancement or release marks | release rollback/pSaveSnap |
| AV09 | Ritual separation | Saying an affirmation adds a dated practice but no CQ lift | ritLog/ritMarkOn |
| AV10 | Dated CQ | First complete same-model snapshot is immutable baseline; model switch not counted as personal gain | history snapshots |
| AV11 | Score reversal | 65→59 moves avatar down while historical release milestones remain | projection/history |
| AV12 | Cause discipline | Sniffer output without user confirmation is a *candidate*, never an established moral defect or psychological cause | sniffStory + trace SRC |
| AV13 | Confirmed evidence | A journal change requires consent and an approved law reassessment writer; original report remains auditably retrievable | new revision workflow |
| AV14 | Whole 21 | Core10 funnel + 11 diagnostics = one law reading per canonical SI ID; no double onboarding | question bank + intake |
| AV15 | Complete realm actions | Each of 26 locations can open knowledge, applicable imprints/release protocol and appropriate ritual or declare why none applies | map + crosswalks |
| AV16 | Portal users | Avatar's story/release/ritual route points to real existing tool writers and does not copy their rules | storyui/release/ritual |
| AV17 | Export/import | Avatar history, earned releases, laws, chosen scene, user-accepted protocols and ritual plans survive import and second device | validateProfile + store migration |
| AV18 | Accessibility | Zero animation mode retains CQ/realm/form status and movement, readable by keyboard and assistive tech | UI |
| AV19 | Identity | Current avatar identity, seven-seat ring, archetype ratings, becoming pairs and personal writing are still editable | avatar.js/avatarui.js |
| AV20 | Runtime release | Integrated branches and browser E2E with no CQ/DQ/ritual regression pass; actual package reference recorded | CI + deployed browser |

### Validation completed on ARCHITECTURE CONTENT only

- JSON lists **26 distinct source-linked scenes**, 9 Inferno + 7 Purgatorio + 10 Paradiso.
- Every scene has one CQ interval (exact lookup is formula-based; displayed six decimals are approximate).
- Sample boundary tests can be evaluated by the companion mapping implementation instructions.
- No production tests were executed by this architecture-only change.
