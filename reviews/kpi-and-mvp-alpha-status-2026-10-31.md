# KPI and MVP Alpha status, 31 October 2026

MOB. Rosa, project manager. An audit: no engine or UI file was edited,
nothing was committed or pushed. The owner asked: "Update the build status
with a visual for KPI complete. And a percent complete. And an MVP alpha
complete. And a percent complete."

Every number below was read off a run on 31 October unless it says
otherwise, and each says which run.

## The headline numbers

| Measure | Value | What it is measuring |
|---|---|---|
| KPI ladder, rungs a real person has reached | **5 of 8 (63%)** | Live production database, read 31 October 17:34 UTC. Ground chosen, tutorial done, first release, release checked and joined to an account each have a count above zero. |
| KPI ladder, rungs that can be measured at all | **6 of 8 (75%)** | Two rungs, funnel completed and safety stops, read zero because the server never writes the field they count. That zero is a missing sensor, not a result. |
| KPI ladder, funnel completion | **0 recorded** | No person has been recorded at the end state, and none can be until the server writes it. |
| MVP Alpha, product wide (the owner's eight systems) | **0 of 8 at 100%. No honest percent exists.** | The owner's 22 October list names eight systems that must "reach 100%", but gives none of them pass or fail criteria. A percent for that list would be invented. |
| MVP Alpha, the one ledger with real criteria (the Vritti and release-feedback contract) | **6 of 12 criteria met (50%)** | One workstream's own acceptance ledger, `docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_CONTRACT_v1.md`. Each criterion checked against source and a passing run on `392a68ec`. |

For a dashboard, the same in one block:

```json
{
  "as_of": "2026-10-31T17:48Z",
  "mob_commit": "392a68ec",
  "kpi": {
    "source": "Reboot-OS Actions run 41225169016, workflow kpi totals, read 2026-10-31T17:34Z",
    "rungs_total": 8,
    "rungs_reached_by_a_person": 5,
    "rungs_measurable": 6,
    "funnel_completed": 0,
    "ladder": [
      {"rung": "Sessions opened", "count": 83, "since_clean_date": 75, "person_signal": "not a people count"},
      {"rung": "Ground chosen", "count": 6, "person_signal": true},
      {"rung": "Tutorial done", "count": 5, "person_signal": true},
      {"rung": "First release", "count": 6, "person_signal": true},
      {"rung": "Release checked", "count": 4, "person_signal": true},
      {"rung": "Joined to an account", "count": 5, "person_signal": true},
      {"rung": "Funnel completed", "count": 0, "person_signal": "not measured: server never writes it"},
      {"rung": "Safety stops", "count": 0, "person_signal": "not measured: server never writes it"}
    ],
    "paid_and_cancel": "not on this ladder; read off Stripe; zero by switch (checkout closed)"
  },
  "mvp_alpha_product_wide": {
    "source": "MVP_ALPHA_CHECKLIST.md on branch lookdev/mvp-alpha-checklist-2026-10-22 (f10ad279), not on main",
    "systems_total": 8,
    "systems_verified_complete": 0,
    "percent": null,
    "why_null": "no system on the list has acceptance criteria"
  },
  "mvp_alpha_vritti_ledger": {
    "source": "docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_CONTRACT_v1.md, KPI acceptance ledger",
    "criteria_total": 12,
    "criteria_met": 6,
    "percent": 50,
    "at_contract_creation_2026_10_21": 0
  }
}
```

## Part 1. The KPI ladder

### Could it be refreshed from here? Yes.

The 15 October document says how it was read: the read only workflow
`kpi totals` in `rebootos-sourcce/Reboot-OS`. The GitHub tools in this
session reach that repository. Before starting it I read the workflow on
Reboot-OS main (`.github/workflows/kpi-totals.yml`): it only asks Supabase
for counts with HEAD requests and writes nothing, and it is hand start only.
I started it once on main. Run **41225169016** finished green at 17:35 UTC
on 31 October, on Reboot-OS commit `d1d64b46`. The 15 October snapshot is
replaced, not repeated.

### The ladder, three reads side by side

| Rung | 15 Oct (run 38816712806) | 17 Oct (run 39047603151) | **31 Oct (run 41225169016)** | Someone has reached it? |
|---|---:|---:|---:|---|
| Sessions opened | 6,867 | 8 | **83** (75 since the clean date) | Cannot tell. Not a people count, see below |
| Ground chosen | 14 | 6 | **6** | Yes |
| Tutorial done | 6 | 5 | **5** | Yes |
| First release | 6 | 6 | **6** | Yes |
| Release checked | 4 | 4 | **4** | Yes |
| Joined to an account | 5 | 5 | **5** | Yes |
| Funnel completed | 0 | 0 | **0** | Not measured |
| Safety stops | 0 | 0 | **0** | Not measured |

What each kind of zero or number means, plainly:

- **The 15 October figures were mostly our own test runs.** 6,867 opens
  and 14 grounds included sessions the browser test gates made. On 16
  October the server started turning away pages opened from a file (the
  "clean date", 16 October 00:30 UTC), and the "clean test records"
  workflow removed the old ones. By 17 October the totals read 8 and 6. I
  read the workflow names, the merge message and the counts. I did not
  read that cleanup run's own deletion log.
- **Sessions opened is still not a people count.** Since the clean date,
  a session comes from a real browser on the real site, which can be a
  person or a crawler that runs the page. 75 sessions came in on 29, 30
  and 31 October (13, 42 and 20). Not one of them reached the next rung.
  That is either nobody getting past the door, or the live site not
  sending the next field. The app source at `392a68ec` does still send
  all four (ground and tutorial from `atuned_src/ui/onboard.js` lines
  1686 and 1764, first release and the check from
  `atuned_src/ui/release.js` lines 1511 and 1280). I could not reach
  atuned.world from this sandbox to see which build it serves, so the
  cause is open.
- **The five human rungs have not moved since at least 17 October.**
  The 15 October note says some of these are the team's own walks
  through the product. So 5 of 8 is the most it can be. The real number
  of strangers may be lower.
- **Funnel completed and safety stops read zero because nothing writes
  them.** The workflow's own comment: state and status "are written when
  a session is made and never again". The counts are labelled "state
  never written yet". Those two rungs need a server change before they
  can read anything.
- **Paid and cancel are not on this ladder.** They come from Stripe.
  They read zero because checkout is shut by a switch: `PLAN_CHECKOUT_OPEN=false`
  at `atuned_src/engine/plan.js:203`, and the top tier, Practitioner, is
  `built:false` at line 171. That is zero by choice, not zero by failure.

### The framing I would put on the dashboard

The ladder does not boil down to one honest percent. The counts are too
small and two of the sensors are missing. Three numbers tell it straight:

1. **5 of 8 rungs reached by a person (63%).** "Has anybody, ever, got
   this far."
2. **6 of 8 rungs measurable (75%).** "How much of the ladder can we
   actually see."
3. **0 people recorded finishing.** Shown as zero with the label "not
   measured yet", never as a plain 0%.

The rates between rungs, on the 31 October read, are 6 of 6 from ground
to first release and 4 of 6 from release to release checked. They are
true numbers from six people, which is too few to mean much.

## Part 2. What "MVP Alpha" means here, since four documents use the name

I searched every `.md` file for "MVP alpha" in any case, plus "alpha
acceptance" and "prime directive", and checked the remote branches.

| Document | Scope | Has pass/fail criteria? | Where it lives |
|---|---|---|---|
| `MVP_ALPHA_CHECKLIST.md`, owner ruling 22 October, expanded 23 October | **Product wide.** Eight systems, in his order. His words: "Emmy's prime directive is MVP alpha. No new features unless approved. We build out everything that we have." | **No.** Each system is described, but none has pass or fail criteria | Branch `lookdev/mvp-alpha-checklist-2026-10-22` at `f10ad279`. **Not merged to main.** |
| `docs/ATUNED_MVP_ALPHA_RECURSIVE_EXECUTION_CONTRACT_v1.md`, 21 October | One workstream: Vritti (the signal), fetter markers, release hit feedback | **Yes**, 12 criteria | main |
| `P0-A-INTEGRATED-GATE-CHECK-2026-10-10.md` and the `alpha-journey` gate | The quiz to first release journey | Yes, as a test gate: 61 passes, 0 failures allowed | main, `tests/floors.json` |
| `docs/ATUNED_DEEP_PSYCHOLOGICAL_EXECUTIVE_HANDSHAKE_2026-10-22.md`, "Prime Directive and Two Completion KPIs" | The psychological layer's records | Yes, but for content records, not the app | main |

`MILESTONES.md` does not mention alpha. It says itself that it is the plan
as of 21 September, and that `BACKLOG-AUDIT.md` is the current list.

So the product wide definition is the eight-system checklist. It is the
main scope here, and the Vritti ledger sits inside its system 1 (the
engine KPI) and system 6 (the nerve and coherence engine).

## Part 3. MVP Alpha, product wide: the eight systems

None of the eight has a test that says "this system is done". So each row
below reports what the evidence shows, not a percent. "Not at 100" means a
named piece of evidence shows something missing. "Not measured" means
nothing here measures it.

| # | System, in his order | Status | The evidence |
|---|---|---|---|
| 1 | KPI: the engine runs CQ to DQ both ways, SQ balanced, formula consistent, the engine drives the Field, Body, Compass, Aura, Torus and Kundalini; Source AI at 100% | **Not at 100** | Forward: CQ (coherence) is the 21 laws over 210, and DQ (total shadow) is the 112 addresses' weight over 1120, both held by `tests/engine.js` (6406 passed, 0 failed on `392a68ec`). Backward: `tests/trace.js` group TG11c, "the chain, nerve to super-complex, read off the reading", passes. Missing: the Kundalini row is `built:false` (`engine/plan.js:102`). I did not audit whether each visual reads the engine. "Source AI at 100%" has no test that defines it. |
| 2 | Content Alpha: every piece of content and every tooltip traces to a real record | **Not measured** | Nothing in this pass measures it. The 22 to 24 October psychological records work is the effort in progress. |
| 3 | Dev/Code and UI/UX Alpha: zero bugs, feature complete, day 1 to day 120 without interruption, simulated satisfaction above 92% | **Not at 100** | "Zero bugs" fails today. Tonight's golden path walk (`reviews/funnel-golden-path-2026-10-31.md`, another seat, on `30d179e3`) found three defects that are already sent to be fixed: six dead buttons on the landing page, the quiz breaking the house percent rule, and a funnel arrival greeted as "Web". `tests/golden.js` is allowed 1 expected failure. I found no satisfaction simulation run. |
| 4 | User journey and flow, end to end | **Not at 100** | The required `alpha-journey` gate read 61 passed, 0 failed, 0 expected failures in that same review. That is another seat's run, which I did not repeat. Its hand walk failed step 1 on the dead landing buttons. |
| 5 | Paywall, checkout through to cancel | **Not at 100** | Checkout is closed (`PLAN_CHECKOUT_OPEN=false`, `engine/plan.js:203`). Practitioner is `built:false` (line 171). Pay and cancel are only walked against a fake server in `tests/golden.js`, never against Stripe. |
| 6 | Nerve and coherence engine, nerve overlay through to super complex | **Partly evidenced** | `tests/trace.js` TG11c and TG11d pass (422 passed, 0 failed). The Reboot-OS commit `d1d64b46` reports a 0% super-complex hit rate in its 1,000-person simulation. I did not verify that. No pass condition is written down. |
| 7 | Archetype to Root | **Not at 100, as recorded** | The checklist itself says the PR 71 archetype work is "wired into nothing live". I did not re-check it in this pass. |
| 8 | The energetic layer | **Not measured** | No pass condition, and no code was found or checked in this pass. |

**Result: 0 of 8 systems shown at 100%.** I am not giving a percent,
because one would mean inventing pass conditions the owner did not set.

## Part 4. MVP Alpha, the Vritti ledger: 12 criteria, checked one by one

Method, as the contract requires: a criterion is met only with source
inspection plus a passing run on the commit being judged. A document or a
commit alone counts for nothing. Everything was run on a clean export of
MOB main, first `578aa1a7` and then `392a68ec` after main moved during
the audit. Between the two the only code change was six lines in
`atuned_src/ui/account.js`. My export matched `392a68ec` byte for byte
across `atuned_src/`, `tests/` and `tools/`, and every result below was
the same on both.

| # | Criterion (the contract's words) | At creation, 21 Oct | **Now** | Evidence |
|---|---|---|---|---|
| 1 | CQ/Coherence naming: one canonical name and metric, partial CQ behaviour kept | audit pending | **Met** | One calculator: `cqSum`, `engine/compute.js:172`. The only other formula over 210 is `iqSimCQ`, `ui/intakeui.js:949`, a simulation behind a switch a person never meets (`?sim=cq100`, labelled "Simulation" on screen). It reads `r.CQ` and changes nothing. Partial CQ: `tests/engine.js` holds "nothing entered: CQ 0", "CQ never fell across 63 answers" and "CQ is exactly the record's laws over 210". The screen label is "Coherence" (`ui/analytics.js:738`). **Note:** the contract's own definition, model 3 with `Rz` as the divisor, is out of date. Model 3 was measured, failed the all-tens rule (48.7, not 100) and was reverted (`compute.js:550` to `559`; the test asserts `CQ_MODEL===2`). |
| 2 | DQ/Resistance: canonical meaning kept, never assumed to be CQ's complement | audit pending | **Met** | `const DQ=SQ.reduce(...)/1120*100` (`compute.js:532`), with the comment "Not 100 minus CQ". Test group 36f proves the two differ: every law at 10 on a heavily loaded field reads CQ 100 while DQ stays high. CQ's complement exists, but under a separate name, `lawSQ`, which is null until the 21st law and stands beside DQ, never in its place. |
| 3 | SQ/fetter weights: SQ is the sum of individual node weights, and markers have no side effects | regression proof pending | **Not met as written** | The side-effect half passes: TG11b, "render-data derivation for markers has no metric side effects". The definition half does not match the code. In code, SQ is each address's own weight (`compute.js:531`) and DQ is their sum. That fits the owner's words on the 22 October checklist, "the SQ is the weight, DQ is the total", so the contract's sentence is the out-of-date side. Fixing it is one line in the document, no code. |
| 4 | Vritti signal ownership: the existing source record owns raw sensory and emotional inputs and a waveform reference; no parallel collection | owner map pending | **Not met** | The no-parallel-collection half passes: TG11b, "no parallel p.vritti collection is introduced". Nothing separate holds sensory or emotional inputs, and there is no waveform reference. The app says so itself on screen (`ui/loopread.js:121`): "Raw sensory and emotional components are not yet separately represented in this record." |
| 5 | Vritti to fetter to node links: typed relationships keep provenance and connect the existing records | implemented, tests not run | **Met** | `tests/trace.js` TG11b, 422 passed and 0 failed on `392a68ec`. Covered: story to signal (`produces`, inferred); signal to fetter (`supports`, inferred, derived); address to fetter (`associated_with`, known, and the edge says "does not imply causation"); a person's Yes stays `user_confirmed` and does not promote the separate signal link; `tracePath` follows story to signal to fetter with provenance intact; it survives a round trip through export and import; older profiles still load. |
| 6 | Fetter marker: the derived marker opens the right Vritti record(s) | not implemented | **Not met** | It renders. My browser probe on the built `392a68ec` page (script at `/tmp/claude-0/-home-user-MOB/e909b21c-7092-5fcd-af76-1092a869307f/scratchpad/probe-marker.js`) found `#sumloop` on Summary with 4 markers, each quoting its source and labelled "Inferred candidate", at both 1600 and 390, with no page errors. The engine read behind it gave 9 of 9 patterns with sources. But there are **0 links or buttons inside any marker**: it quotes the record and cannot open it. The only test of this UI is a scan of source text in `tests/trace.js`. No browser gate draws it. |
| 7 | Release hit feedback: only an explicit hit counts; hold, reject and execute are separate | not implemented | **Not met** | Not built. `relHits` (`ui/release.js:1142`) counts the addresses a run reached, which is not a hit the person confirmed. The "What changed?" card (`releaseVerify`, `engine/journey.js:518`) records the outcome of a release. It does not hold hits, holds or rejects. |
| 8 | Voice safety: a low-confidence command changes nothing | not implemented | **Not met** | There is no voice command path in the release. Speech recognition exists only for journal dictation (`ui/storyui.js:3092`). With no commands, there is nothing to test. |
| 9 | Event idempotency: replaying events cannot double-count hits or associations | not implemented | **Not met** | Half has nothing to test. Associations are derived, not stored as events, and deriving them twice gives the same result (TG11b, "repeated derivation is deterministic and idempotent"). Hit events do not exist (see 7). |
| 10 | Recursive loop: evidence and outcomes reconnect without double counting | audit pending | **Met** | `tests/loop.js` 46 passed, 0 failed: LR4 counts "the completed one, not the scheduled or the missed", and the LR8 test that inflates practice ("every scheduled practice is counted as done") must fail, and does. `tests/journey.js` 347 passed, 0 failed: release outcome answers go through `practiceDo` as evidence, and the boundary refuses a sixth value, a stored skip, or a non-person source. `tests/loopui.js` 56 passed, 0 failed. `tests/engine.js`: "a story applied twice reads once". |
| 11 | Build and engine tests: the real commit passes the documented commands | not run | **Met** | `./atuned_src/BUILD-engine.sh` exit 0 ("engine is host free", "engine ok, 946 exports"). `node tests/engine.js`: 6406 passed, 0 failed, 10 expected failures, against a floor of 6406 and a ceiling of 10 expected failures in `tests/floors.json`. CI: MOB deploy run 1259 on `578aa1a7` finished green. Run 1260 on `392a68ec` was still running when this was written. |
| 12 | Release-chain browser tests: the real commit passes | not run | **Met** | `NODE_PATH="$(npm root -g)" PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node tests/releasechain.js`: 48 passed, 0 failed, at both 1600 and 390, against a floor of 48. |

**6 of 12 met = 50%.** At contract creation on 21 October it was 0 of 12,
since nothing had been run. The six still open are 3 (a one-line
document fix), 4, 6, 7, 8 and 9. Items 7, 8 and 9 all depend on the same
unbuilt feature, release hit feedback.

## Part 5. The commands, as run

All runs used a clean `git archive` export of MOB main in the scratchpad
directory, not the shared checkout, which had another seat's work in it.

| Command | `578aa1a7` | `392a68ec` |
|---|---|---|
| `./atuned_src/BUILD-engine.sh` | exit 0 | exit 0 |
| `node tests/engine.js` | 6406 passed, 0 failed, 10 expected red | 6406 passed, 0 failed, 10 expected red |
| `./atuned_src/BUILD.sh` | exit 0 | exit 0 |
| `node tests/releasechain.js` | 48 passed, 0 failed | 48 passed, 0 failed |
| `node tests/trace.js` | 422 passed, 0 failed | 422 passed, 0 failed |
| `node tests/loop.js` | 46 passed, 0 failed | 46 passed, 0 failed |
| `node tests/loopui.js` | 56 passed, 0 failed | 56 passed, 0 failed |
| `node tests/journey.js` | 347 passed, 0 failed | 347 passed, 0 failed |
| marker probe (scratchpad script) | 4 markers, 0 controls, both widths | 4 markers, 0 controls, both widths |
| Reboot-OS `kpi totals`, dispatched on main | | run 41225169016, green, read 17:34 UTC |

One run was thrown away. A second full export hit a full disk (the
machine was at 98%, shared with other seats), so the tree was partial and
the page did not boot. I deleted it and did not count it. The `392a68ec`
column comes from the first export updated by its one changed file and
checked byte for byte.

## Part 6. What would move each number, in order

| # | What | Who | Size | Depends on | Moves |
|---|---|---|---|---|---|
| 1 | Correct the contract's SQ sentence to "SQ is each address's weight, DQ is their total", matching the owner and the code | Docs | Small | Nothing | Vritti ledger 6 to 7 of 12 |
| 2 | Find out why 75 opens since 29 October reached no further rung: which build atuned.world serves, and whether it posts the ground checkpoint | DevOps | Small | Access to atuned.world, which this sandbox lacks | KPI trust |
| 3 | Server writes session state and status, so "funnel completed" and "safety stops" can be counted | Server (Reboot-OS) | Medium | Nothing | KPI measurable 6 to 8 of 8 |
| 4 | Give the fetter marker a control that opens the journal entry it quotes, plus a browser gate for it | UI | Small | Nothing | Vritti ledger +1 |
| 5 | Release hit feedback: presented, held, explicit hit, rejected and executed as separate states, with append-only events | Engine and UI | Large | A design for the states | Vritti ledger +2 (7 and 9), and +1 more (8) once voice commands exist |
| 6 | Write pass conditions for each of the eight systems | Owner, with Emmy | Medium | His time | Makes a product-wide percent possible at all |

**Not doing this round:** structured sensory and emotional capture
(criterion 4). The contract itself defers it, and a qualium word list
has to be approved first. Voice release commands (criterion 8) wait
until item 5 above exists.

**Needs a ruling (only one, because it changes what gets built):**
should the eight-system checklist, now on an unmerged branch, be merged
to main as the official MVP Alpha scope, and does he want pass conditions
written for each system? If yes, a product-wide percent becomes possible.
If no, the dashboard shows the Vritti ledger's 50% labelled as one
workstream, and the eight systems as status rows with no percent.
