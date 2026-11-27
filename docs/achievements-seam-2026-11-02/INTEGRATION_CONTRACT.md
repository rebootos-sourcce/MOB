# ATUNED achievements and scoring: implementation seam contract (TDD addendum)

Date: 2026-11-02. Owner goal: build the engineering to the seam, let the next AI integrate. Candidate branch: feat/achievements-seam-2026-11-02. Canonical decisions: root ATUNED-points-achievements-unlocks-TDD-v3.md. Do not overwrite its v2 historical owner record.

## 0. Implementation boundary
OWNED ON SEAM BRANCH: host-free candidate at atuned_src/engine/progress.js, tests/progress-seam.js, the four-pass audit, this contract, index/handshake/log.
NOT OWNED YET: mainline MANIFEST, schema.js, live save/update writers, UI screens, browser CSS and sound. Do not merge the candidate by itself; a profile field without a validator will be silently removed by old code.
PRIORITY: preserve record correctness and write atomicity over displaying points.

## 1. Proposed profile schema
progress: {
  v:1,
  credits:[{id:"rd:20759",n:5,r:1,at:"2026-11-02T12:00:00.000Z"}],
  marks:[{k:"first",at:"2026-11-02T12:00:00.000Z",v:1,ev:["rd:20759"]}],
  seen:[{k:"i.graph",at:"2026-11-02T12:00:00.000Z"}]
}
Only immutable receipts are stored. Totals, streak, run, best, next mark, event list, turns, stage, balance and user ID are derived or absent. Credits are unique by id, marks by k, seen by k. History of published rates is append-only. Missing/null progress on older profile becomes progressBlank. Unsupported forged rates and ids are refused by name. Unknown future rate versions, future timestamps, and deleted evidence are kept and surfaced as odd/removed evidence.

## 2. One-shot merge surgery, in dependency order
S1. atuned_src/engine/schema.js blankProfile: add progress:progressBlank() beside other additive bags. No change to SCHEMA_V for an optional key.
S2. engine/schema.js validateProfile near the existing summaries, trace, journey validation clauses:
    if(o.progress!==undefined&&o.progress!==null)
      p.progress=progressValidate(errs,o.progress,'progress');
A missing value retains the blank. If progress invalid, validateProfile returns {ok:false,errs} and pStore preserves the raw record under STORE_KEPT. Confirm no roundtrip loss through pExport, pImport and pStore.
S3. atuned_src/MANIFEST: insert the line engine/progress.js exactly after engine/ladder.js and before engine/daily.js. The schema function declaration may refer to progressValidate at runtime because modules are fully parsed before profiles load. Keep no browser dependency inside engine/progress.js.
S4. engine/schema.js pSave: after saveProfile(CURP) and the existing membership guard, compute one progressSettle(CURP,Date.now()) against CURRENT canonical record. Apply by progressApply (pure). If refusal, return false with SAVE_ERR. Save profile and progress together with the existing pPersist. If persistence fails, restore the previous in-memory progress bag and do not sound or display new credits; keep existing pPersist rollback.
S5. Boot/import: after a legacy profile has been validated into a blank progress field, settle once on a successful durable write. Avoid a render-side migration; do not backfill from sample PEOPLE or from S. pImport is atomic and must not overwrite unrelated CURP.
S6. Audit direct pPersist and pSnap/other persistence writers before merge. pSave centralizes ordinary writes but direct persistence paths may need explicit settle or a documented exemption.
S7. Do NOT add a second event ledger or call a network service. For server-spend in the future, signed minting is a distinct seam and must not retroactively devalue existing receipts.

## 3. Public engine API contract
progressBlank() -> {v,credits,marks,seen}
progressEvents(p,now) -> sorted array of derived events; pure, stable paying ids
turnRead(p,now) -> {n,turns,last,lit,open}; pure, no clock reads
markTest(p,now) -> true-now mark keys with evidence and possible dates; pure
progressSettle(p,now) -> {credits,marks,seen}; pure, only newly eligible receipts
progressApply(p,add) -> {ok,progress} OR {ok:false,errs}; no mutation, no silent clipping
progressValidate(errs,o,path) -> validated bag; no silent dropping of recognized receipts
pointsRead(p) -> {n,credits,byType}; n is sum of stored credit n
progressRead(p,now) -> {points,marks,next,streak,turn,odd}; no side effects
progressWhy(p,id,now) -> {kind,rows,receipt}; source status present/removed
progressIntroReady(p,flags) -> eligible introduction keys; caller provides actual plan sight, content presence, care state
progressShowIntro(p,key,now,flags) -> a proposed validated append AFTER UI succeeds in showing
progressExample(i,now) -> read-only sample by cadence modulo 5, independent of example's CQ and CURP

## 4. Definitive rules and boundary tests
R1. Points paid only after the qualifying act, never deducted; 5 per completed ritual day; 2 per imprinted story day; 5 per first address. One id paid once per profile.
R2. Legacy ritual done absent counts as completed, done:false does not; future acts past local tomorrow do not earn. No date stamp may be manufactured at migration.
R3. Mark set is monotonic across delete, undo, tier changes, clock changes and changed current readings. The mark receipts are not in undoState.
R4. Marks for Seven/Thirty/Ninety days read distinct completed ritual dates, not strict consecutive streak or best. First run reads done entries, not planned entries. Ten addresses reads node IDs, not line keys.
R5. Every earned mark has icon, family, seat colour, meaning and evidence status. One next mark only, no inaccessible-tier hints.
R6. Care suppresses all UI, notifications and sounds for points and marks, not the internal recording of facts.
R7. Unlocks are introductions and do not change plan sight; never hide paid functionality pending an achievement.
R8. No point, mark or unlock reads a person's CQ band to assign monetary value, health/worth, or intensity. Laws-of-integrity measurement remains independent.
R9. No event or receipt leaves the device by analytics/outbox without a new owner ruling.
R10. Every save failure is reported truthfully; an unpersisted reward must not be announced.

## 5. Integration adapters: UI
Compass: replace ephemeral ladderRead.earned by progressRead(CURP,Date.now()).marks (each row has def and receipt). Use receipt.at, not "currently true," in copy. Keep streak sourced by the same progressRead.streak, zero as dash; last day date not absence commentary. Show only one progressRead.next.
Ritual: use same projection and definitions; no duplicated mark tests. Keep existing ritual completion UI and do not price points on the completion button.
Evidence drawer: credit rows from progressWhy; when source later removed, say that evidence was removed but earned points remain. No full user story text needed.
Sound: only on successful saved new mark; exactly once; no replay on reload. Silence during care and sample persona.
Sample: do not mix the example reading S with personal CURP record. The sample is derived from progressExample(index,now), labelled "Sample record", never saved.
Introductions: read planSight/planSees and entity visibility from existing tier system. Only call progressShowIntro after the relevant card was actually displayed; do not invoke while care or during onboarding.
Accessibility: the mark icon has a text description; drawer is keyboard operable; low-motion/quiet preferences respected.

## 6. Acceptance matrix / required terminal evidence
A. BUILD.sh, BUILD-engine.sh, hostfree.py, dupefunc.py, tests/engine.js and tests/progress-seam.js pass; do not copy a green result from an older commit.
B. Functional/boot/monitor/funnel/collide/design checks pass at desktop 1600 and mobile 390. Screen snapshots inspected, not just generated.
C. Fresh record -> ritual start only => zero points and no First run; completed => 5 points and First run; repeat same date => zero additional.
D. Two imprinted stories in one day => 2 points; zero imprint => no story points. Ten story days => Ten stories.
E. One address across hundreds of line keys => 5 points once and one address; distinct ten addresses => Ten addresses.
F. Deleted ritual entry => persisted points/mark remain; exported-imported bag byte-equivalent; undo does not carry progress.
G. Import older profile without progress => eventual correct backfill and original dates. A schema-invalid progress bag refuses the record by name but does not erase the file.
H. Browser store write failure => no "saved"/mark sound; recovery does not double pay.
I. Load every example with existing personal profile => profile bytes unchanged; sample does not follow CQ.
J. Tier downgrade => earned receipt kept but gated layer references concealed; care => nothing rendered while accumulation continues.
K. Device clock +90 days => no new future credits; backward clock and same date => no duplicate grants; newer rule and future receipt survive validation.
L. Evidence drawer and four intros demonstrate actual events, do not expose raw private story text, accessibility tested.
M. Compare with existing MARKS/roster and v3 MARK2 corrections. Document every intentional difference rather than accepting a count match alone.

## 7. Deferrals, not blockers
Floor mark requires optional RIT_KEYS floor boolean and writer. Becoming object lifecycles (saboteur/complex/hypercomplex/mask) require durable ids/states before awarding them; do not create invented entity events. CQ-based awards are struck by v3; this candidate contains none. A future spend or account server is a different system. Exact UI word for "mark"/"achievement" is one constant, not engine schema identity.

## 8. Known candidate limitations that integrator must validate and amend
1. Candidate passed isolated mocking only, not all repo engines or browser gates. tests/progress-seam.js is staged but has not been run here in a full checkout.
2. Old state marks lack a recoverable historical timestamp; null is permissible for backfill but newly earned undatable marks should take the successful saved-act moment without pretending it is the earlier crossing.
3. Evidence ids for history/turn are stable only for a given unchanged source list. They do not pay, so changing them cannot produce points, but the drawer should be checked after deletion/reorder.
4. The official palette/copy and care detection are UI-owned; the candidate has no CSS or sound integration.
5. Rebase before merge. This pass did not freeze other developers' branches.

## Ratings
Core data contract 0.95; merge steps 0.93; candidate headless coverage 0.77; mainline integration verification 0.00. This is a technical handoff, not a completed merge.
