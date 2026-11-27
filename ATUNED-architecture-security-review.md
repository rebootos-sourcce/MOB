# ATUNED Rigorous Architecture, Security, Schema, and Content Review

Date: 2026-09-29

## Review purpose

This review stress tests the current ATUNED foundation across:

1. Schemas
2. Canon content
3. Databases and persistence
4. Source intelligence architecture
5. Discernment engines
6. Verification and longitudinal systems
7. Security boundaries
8. Authentication and session architecture
9. Data integrity
10. Content-to-database integrity
11. Failure recovery
12. Production readiness

The review distinguishes between what is directly evidenced in the supplied artifacts, what is documented as implemented, and what remains unverified.

## Executive finding

The foundation is substantially stronger than a simple prototype.

The canonical content is present in the v950 instrument itself. The inflated build contains a 112-node register, 33 saboteurs, a 21-law moral-integrity library, masks, lexicon material, pattern definitions, release material, and supporting knowledge structures.

The repository architecture also documents a real three-layer data model:

Canon → User Record → Server.

The server layer has real SQL migrations for canon, identity, sessions, consent, records, research records, audit, entitlements, push subscriptions, reset/rate-limit controls, and operational errors. The architecture document reports 21 passing server tests against the migration files.

However, the most important security conclusion is:

**The data architecture exists. The production security system is not yet fully proven.**

The supplied architecture review explicitly identifies four important gaps:

* no system-level security review
* no tested backup/restore drill
* incomplete retention/archival policy
* unresolved GDPR lawful-basis, controller, retention, and subject-access decisions

Those are not cosmetic gaps. They are the remaining boundary between having security mechanisms and having a demonstrated security posture.

A second important finding is that the current v950 browser artifact is intentionally self-contained and does not make network calls from the supplied instrument. Its persistence layer in the inspected v950 artifact uses `localStorage`; it does not contain `document.cookie`, `sessionStorage`, `IndexedDB`, or network `fetch()` calls. This differs from the broader architecture document, which describes IndexedDB and a server sync layer. That discrepancy needs to be reconciled before calling the persistence architecture final.

## Test results

| Area | Result | Assessment |
|---|---|---|
| 112-node content | PASS | Directly verified in inflated v950 artifact |
| 33 saboteurs | PASS | Directly verified in inflated v950 artifact |
| 21 moral-integrity laws | PASS | Directly verified in inflated v950 artifact |
| Canon architecture | PASS | Three-layer architecture is explicitly documented |
| User schema contract | PASS / PARTIAL | Schema and validator are documented; runtime construction remains looser |
| Server database schema | PASS | SQL migration architecture is documented |
| Server test execution | PASS | 21 server tests reported against actual migrations |
| Canon compiled database | DOCUMENTED / UNVERIFIED | `data/canon.sqlite` is documented but the actual database bytes were not available for direct inspection |
| Server canon mirror | DOCUMENTED / UNVERIFIED | SQL mirror is documented but actual production database contents were not directly inspected |
| Source intelligence design | PARTIAL | Architecture is strong, but current live LLM integration is not present in v950 |
| Security architecture | PARTIAL | Mechanisms exist, system-level threat review is missing |
| Authentication/session security | PARTIAL | Components exist in the documented server architecture; end-to-end security posture is not proven |
| Cookie/session boundary | MISSING / NOT IN CURRENT ARTIFACT | Current v950 artifact has no cookie implementation |
| Backup/restore | FAIL | No tested backup/restore drill is documented |
| Retention/archival | FAIL | Server records can grow without documented archival policy |
| Privacy/legal governance | PARTIAL | Consent/export/deletion mechanisms exist, policy decisions remain open |
| Canon reconciliation | OPEN | Four node mappings remain unresolved against an external v330 source |
| Longitudinal intelligence | DESIGNED / PARTIAL IMPLEMENTATION | Architecture is defined; production implementation requires verification |
| Evidence/verification model | DESIGNED / PARTIAL IMPLEMENTATION | Correct model is defined; needs executable implementation and tests |
| Novel signal handling | DESIGNED | Registry and rules are defined |
| Attachment sniffer | DESIGNED | Correctly kept contextual and low-weight |
| Jouissance detector | DESIGNED | Correctly treated as behavioral direction rather than diagnosis |

## 1. Foundation architecture

The three-schema separation is correct and valuable:

**Canon**

Static shared content.

**User Record**

Everything owned by an individual.

**Server**

Accounts, synchronization, entitlements, consent, and other off-device infrastructure.

The critical invariant is:

`CANON ≠ USER DATA`

This prevents shared content from becoming mixed with personal records and makes deletion boundaries substantially clearer.

The architecture document describes approximately 128 `canon_*` tables generated from `data/canon.sqlite`, with the client canon stored as JSON tables and the server receiving a SQL mirror.

This is a good foundation.

### Improvement

Add an explicit **Canon Release Manifest**.

The manifest should bind every canonical source artifact to one immutable version.

Suggested structure:

```text
CANON_RELEASE
{
  canon_version,
  build_id,
  source_commit,
  generated_at,
  source_manifest_hash,
  sqlite_sha256,
  table_count,
  row_count,
  node_count,
  saboteur_count,
  law_count,
  lexicon_count,
  validation_status
}
```

This gives the system one answer to:

> Which exact canon did this user experience?

Without this, a user record can reference a canon key but the historical meaning of that key can become ambiguous after a canon update.

## 2. Canon content integrity

The direct inspection of the inflated v950 artifact produced several strong results.

### 112 nodes

The `NODES` structure contains exactly 112 entries with IDs 1 through 112.

Result:

**PASS**

### 33 saboteurs

The `SAB33` structure contains exactly 33 named saboteurs.

Result:

**PASS**

### 21 Laws of Moral Integrity

The `SI` structure contains the 21-law library.

Result:

**PASS**

The inspected build also contains supporting structures for masks, lexicon, charge/pattern definitions, release material, and other knowledge structures.

### Important distinction

This proves that the content is present in the inspected v950 instrument.

It does **not** independently prove that:

```text
source JSON
→ canon.sqlite
→ server SQL canon mirror
→ runtime build
```

are byte-for-byte or row-for-row identical.

That is the next test I recommend.

## 3. Content-to-database integrity test

This is the most important missing content test.

Build a deterministic canonical comparison:

```text
SOURCE JSON TABLES
        ↓
NORMALIZE
        ↓
HASH EACH TABLE
        ↓
HASH ALL TABLES
        ↓
COMPARE
        ↓
canon.sqlite
        ↓
COMPARE
        ↓
server canon SQL
        ↓
COMPARE
        ↓
runtime v950 payload
```

Every layer should produce:

```text
TABLE
ROW COUNT
SCHEMA HASH
CONTENT HASH
SOURCE VERSION
STATUS
```

The acceptance rule should be:

**No unexplained difference is allowed.**

If a difference is intentional, it must exist in a documented transform manifest.

This should become a release gate.

## 4. Canon reconciliation

The architecture review documents an unresolved conflict between four field/crown/root node mappings and an external v330 manuscript.

This is not necessarily a software defect.

It is a source-of-truth governance issue.

The system currently has a reasonable rule:

> Do not silently modify the approved canon based on an unreconciled second source.

Keep that rule.

### Improvement

Create:

```text
CANON_RECONCILIATION
{
  conflict_id,
  source_a,
  source_b,
  affected_keys[],
  difference,
  proposed_resolution,
  owner,
  decision,
  decision_date,
  resulting_canon_version
}
```

No canon change should ship without a resolved record.

## 5. User record architecture

The user record is strongly bounded.

The architecture documents:

* versioned schema
* closed top-level shape
* runtime validation
* refusal to overwrite unreadable records
* refusal to downgrade a newer record
* local persistence
* cloud synchronization
* explicit persistence failure behavior

The refuse-don't-overwrite rule is particularly important.

### Improvement

Add cryptographic integrity to the user record.

Suggested:

```text
USER_RECORD_INTEGRITY
{
  record_id,
  schema_version,
  content_hash,
  previous_content_hash,
  sequence,
  written_at,
  writer,
  integrity_version
}
```

This creates a tamper-evident history.

It does not need to be a blockchain. A chained content hash is enough for the basic integrity requirement.

## 6. Server database architecture

The documented server migrations are substantial.

They include:

```text
canon
accounts
sessions
consent
records
research_records
audit
entitlements
store_events
push_subs
resets
attempts
crashes
server_errors
indexes
```

The architecture also documents separate account and research identifiers.

That separation is important because research records should not directly expose account identity.

The server tests reportedly execute the actual migration files through the D1 shim.

Result:

**Database foundation: PASS**

### Improvement

The next database test should be production-shaped, not only migration-shaped.

Test:

```text
create account
→ create session
→ write user record
→ write evidence
→ create entitlement
→ sync
→ revoke session
→ delete account
→ verify every personal record is gone
→ verify canon remains
→ verify research record remains appropriately de-identified
→ verify audit boundary
```

This should be an automated destructive integration test.

## 7. Security architecture

The current architecture has real security components.

The documented system includes:

* sessions
* authentication
* consent
* password/reset controls
* failed-attempt rate limiting
* entitlements
* audit
* separate research identity
* server-authoritative entitlement
* operational error separation
* cascading deletion
* export
* consent state

That is a real security foundation.

But it is not yet a complete security verification.

The architecture review explicitly says there has been no system-level security review.

### Critical improvement

Create a single threat model covering:

```text
Browser
↓
Session
↓
Authentication
↓
API
↓
Authorization
↓
User record
↓
Canon
↓
Research record
↓
Admin
↓
Logs
↓
Backups
```

Then test attack paths rather than testing individual features in isolation.

## 8. Cookie and browser security

The current v950 artifact does not contain:

```text
document.cookie
sessionStorage
IndexedDB
fetch()
```

It does contain `localStorage`.

This is important because the supplied architecture document describes a broader server-backed system while the inspected v950 artifact is effectively a self-contained client build.

For production:

**Do not use localStorage for authentication secrets.**

The session layer should use a secure, opaque, server-recognized session cookie.

Recommended boundary:

```text
Browser cookie
    ↓
Session ID
    ↓
Server session
    ↓
Account
    ↓
Authorization
    ↓
Source user record
```

The cookie should contain no:

* pattern data
* stories
* imprints
* evidence
* somatic information
* inference
* CQ/SQ data
* entitlement details beyond what is strictly required

The cookie is session continuity, not Source memory.

## 9. Database security

The database layer needs an explicit security checklist.

Required controls:

```text
Authentication
Authorization
Least privilege
Encryption in transit
Encryption at rest
Secret management
Session revocation
Rate limiting
Audit logging
Input validation
Query parameterization
Backup encryption
Backup access control
Restore testing
Deletion testing
Retention enforcement
Admin access logging
Research/account separation
```

The architecture currently provides evidence for several of these, but not all.

The most important missing evidence is operational.

A security control that exists in code but has never been tested in the actual deployment path should remain marked **UNVERIFIED**.

## 10. Backup and disaster recovery

This is a clear gap.

The architecture review states that there is no tested backup/restore drill.

This should be promoted to P0 for production.

Required test:

```text
TAKE BACKUP
↓
DESTROY TEST DATABASE
↓
RESTORE
↓
RUN MIGRATIONS
↓
VERIFY RECORD COUNTS
↓
VERIFY CANON HASHES
↓
VERIFY USER RECORD HASHES
↓
VERIFY ENTITLEMENTS
↓
VERIFY AUDIT HISTORY
↓
RUN APPLICATION TEST SUITE
```

Record:

```text
RPO
RTO
backup timestamp
restore timestamp
rows restored
hashes restored
failed checks
operator
environment
```

A backup that has never been restored is an assumption, not a recovery system.

## 11. Retention and deletion

The architecture explicitly identifies server-side retention/archival as unfinished.

This matters because ATUNED holds highly personal narratives.

Define:

```text
DATA CLASS
RETENTION PERIOD
PURPOSE
OWNER
LEGAL BASIS
ARCHIVAL RULE
DELETION RULE
BACKUP DELETION RULE
USER REQUEST PATH
AUDIT REQUIREMENT
```

Classes should at minimum distinguish:

```text
Account
Authentication/session
User narrative
Evidence
Inference
Research record
Consent
Billing
Audit
Operational logs
Backups
```

The deletion model must answer:

> If a person deletes their account today, where does their data still exist tomorrow?

That includes primary database, replicas, backups, caches, logs, research systems, and exports.

## 12. Source intelligence foundation

The conceptual architecture is strong.

The intended pipeline is:

```text
Listen
→ Parse
→ Represent
→ Identify unknown
→ Select inquiry
→ Ask
→ Observe
→ Update
→ Test
→ Resolve
```

The supporting engines are correctly separated:

```text
Evidence
Convergence
Contradiction
Alternative Hypothesis
Causal Reasoning
Temporal State
Novel Signal
Verification
Longitudinal Memory
Response
```

This is much stronger than a simple prompt wrapper.

### Major implementation finding

The current v950 Source AI interface is not yet a live LLM system.

The architecture review found that `srcContext()` and `srcSend()` build the Source prompt and context, but the prompt is not sent to an LLM. The current behavior uses a real-data fallback.

This is not a security defect.

It is an implementation-state fact.

The system is currently:

**Source AI design + UI + context construction**

rather than:

**live adaptive Source AI**

That distinction should remain explicit in the TDD.

## 13. Evidence model

The evidence architecture is one of the strongest parts of the design.

Keep the separation:

```text
USER STATEMENT
OBSERVATION
CANON MAP
INFERENCE
HYPOTHESIS
VERIFICATION
```

Do not collapse them into one `pattern` field.

### Improvement

Make provenance mandatory.

Every inference should point backward:

```text
inference
→ evidence IDs
→ original user language
→ observation
→ canon mapping
→ question asked
→ user response
→ verification state
```

This makes the system explainable without exposing hidden chain-of-thought.

## 14. Convergence engine

The convergence design is sound.

The critical improvement is to prevent correlated signals from being counted as independent evidence.

For example:

```text
same sentence
→ same semantic cluster
→ same lexicon match
→ same canon match
```

is not four independent pieces of evidence.

Add:

```text
independence_group
```

to evidence records.

Then convergence can distinguish:

```text
4 signals from one source
```

from:

```text
4 genuinely different observations
```

This will make confidence more honest.

## 15. Contradiction engine

The contradiction architecture is appropriate.

Important rule:

**Contradiction is an inquiry trigger, not an error state.**

Keep that.

Add contradiction severity based on:

```text
magnitude
persistence
consequence
confidence
context
```

A one-time wording difference should not receive the same treatment as a persistent goal/behavior conflict.

## 16. Causal reasoning

The relationship model is strong because it distinguishes:

```text
registered with
associated with
correlated with
precedes
follows
influences
possibly causes
supported cause
unknown
```

Keep these distinctions.

### Improvement

Require intervention evidence before allowing a relationship to advance toward causal support.

Minimum rule:

```text
temporal order
+
repetition
+
alternative causes considered
+
intervention result
=
candidate causal support
```

A body location or chakra match must never automatically become a causal claim.

## 17. State engine

The distinction between:

```text
RELEASED
INTEGRATING
INTEGRATED
RECURRED
```

is important and should remain.

Add explicit state transition tests.

For example:

```text
ACTIVE → RELEASED
```

should require release protocol evidence.

```text
RELEASED → INTEGRATED
```

should require longitudinal evidence.

```text
INTEGRATED → RECURRED
```

should require a new observation.

This prevents the system from declaring success too early.

## 18. Novel signal engine

The architecture correctly allows:

```text
EXACT CANON
SEMANTIC CANON
FUZZY CANON
RELATED CANON
NOVEL
```

The most important safeguard is preservation of the person's original language.

Keep that.

Add a **novel-signal aging test**:

A novel signal should not remain permanently novel if later evidence establishes a canonical relationship.

The registry needs:

```text
first_seen
last_seen
occurrences
contexts
candidate mappings
user confirmation
resolution
resolution version
```

## 19. Attachment sniffer

The attachment system is correctly treated as contextual rather than diagnostic.

Keep:

```text
ATTACHMENT ≠ TRAUMA
ATTACHMENT ≠ JOUISSANCE
ATTACHMENT ≠ PATHOLOGY
```

The key test is false-positive resistance.

A childhood attachment should not become a pattern merely because it is emotionally memorable.

Require convergence with present-day behavior before increasing its weight.

## 20. Jouissance

The distinction between:

```text
CONSTRICTION
EQUILIBRIUM
JOUISSANCE
```

is useful.

The important implementation rule is that jouissance should be detected as a behavioral direction:

```text
excess
compulsion
stimulation seeking
inability to stop
```

not as:

```text
pleasure = problem
```

Temperance should remain a cross-check rather than the detector itself.

## 21. CQ100 enforcement

The CQ100 rule is structurally important.

Source should operate at the maximum standard regardless of the user's state.

The engine should therefore validate:

```text
interpretation
question
response
recommendation
action
```

against the applicable laws.

### Improvement

Make this an executable gate rather than a prompt instruction.

For every Source response:

```text
DRAFT
↓
LAW CHECK
↓
INVENTION CHECK
↓
EVIDENCE CHECK
↓
UNCERTAINTY CHECK
↓
SAFETY CHECK
↓
RESPONSE
```

A prompt saying "operate at CQ100" is weaker than a validator that can reject an output.

## 22. Biggest structural improvement

The architecture currently has many good individual systems.

The next improvement is to connect them through a single **Source State Graph**.

Conceptually:

```text
USER
 ↓
EXPERIENCE
 ↓
SIGNALS
 ↓
EVIDENCE
 ↓
CANDIDATE HYPOTHESES
 ↓
CONVERGENCE / CONTRADICTION
 ↓
RELATIONSHIPS
 ↓
VERIFICATION
 ↓
PATTERN
 ↓
RELEASE
 ↓
MEASURED CHANGE
 ↓
INTEGRATION
 ↓
LONGITUDINAL MEMORY
```

Every stage should have explicit IDs and provenance.

This becomes the spine connecting the engines.

## 23. Security test suite to add

Create a dedicated security suite:

```text
SEC-001 Authentication bypass
SEC-002 Session fixation
SEC-003 Session rotation
SEC-004 Session revocation
SEC-005 Expired session rejection
SEC-006 Cross-account record access
SEC-007 Cross-account evidence access
SEC-008 Cross-account canon contamination
SEC-009 Entitlement spoofing
SEC-010 Research/account re-identification
SEC-011 Reset token replay
SEC-012 Reset token leakage
SEC-013 Rate-limit bypass
SEC-014 CSRF
SEC-015 CORS abuse
SEC-016 XSS through narrative content
SEC-017 Injection through user language
SEC-018 Sensitive data in logs
SEC-019 Sensitive data in error messages
SEC-020 Backup access
SEC-021 Restore integrity
SEC-022 Deletion completeness
SEC-023 Export authorization
SEC-024 Admin authorization
SEC-025 Audit-log tampering
SEC-026 Canon tampering
SEC-027 Canon version mismatch
SEC-028 Local storage exposure
SEC-029 Client-side entitlement spoofing
SEC-030 Data retention enforcement
```

## 24. Content integrity test suite to add

```text
CAN-001 112 node count
CAN-002 node IDs 1–112
CAN-003 duplicate node detection
CAN-004 seven-band coverage
CAN-005 33 saboteur count
CAN-006 saboteur reference integrity
CAN-007 hyper-complex reference integrity
CAN-008 21-law count
CAN-009 21-law name integrity
CAN-010 release corpus completeness
CAN-011 lexicon integrity
CAN-012 canon.sqlite parity
CAN-013 server SQL canon parity
CAN-014 runtime payload parity
CAN-015 canon release hash
CAN-016 source manuscript reconciliation
CAN-017 forbidden orphan reference detection
CAN-018 user record cannot contain canon payload
CAN-019 canon cannot contain user data
CAN-020 migration regeneration reproducibility
```

## 25. Highest-priority improvements

### P0

1. Perform the end-to-end security threat model.
2. Perform a real backup/restore drill.
3. Build source JSON → SQLite → SQL → runtime content parity testing.
4. Establish the canon release manifest and immutable content hash.
5. Reconcile the four open canon node conflicts.
6. Define retention and deletion behavior across primary data, backups, logs, and research data.
7. Reconcile the current v950 local persistence implementation with the intended server/session architecture.
8. Make authentication/session security an end-to-end tested path rather than a collection of component tests.

### P1

9. Build the Source State Graph.
10. Add evidence provenance IDs everywhere.
11. Add independence groups to evidence.
12. Add executable CQ100 output validation.
13. Add causal intervention testing.
14. Add longitudinal state transition tests.
15. Add novel-signal lifecycle tests.
16. Add cross-account isolation tests.
17. Add destructive account deletion integration tests.

### P2

18. Improve attachment false-positive testing.
19. Expand jouissance behavioral tests.
20. Add canonical reconciliation tooling.
21. Add automated schema/code drift detection.
22. Add production coverage measurement.
23. Add security regression testing to CI.

## Final assessment

The foundation is real.

The canonical content is present in the inspected v950 runtime artifact, and the architecture documents a real database layer rather than a conceptual database only.

The schema separation is sound.

The user record boundary is strong.

The server migration architecture is substantial.

The intelligence architecture is unusually well separated for this stage.

The remaining weakness is not that the system lacks architecture.

The weakness is that several important boundaries are **designed but not yet proven end to end**.

The most important next step is therefore not adding another engine.

It is proving these four chains:

```text
CONTENT
source → canon.sqlite → server canon → runtime

SECURITY
browser → session → auth → authorization → database → admin → backup

PERSONAL DATA
user → evidence → inference → storage → sync → export → deletion

CHANGE
signal → hypothesis → verification → release → before/after → integration
```

If those four chains are executable, tested, hashed, recoverable, and auditable, the foundation becomes materially stronger without adding unnecessary architecture.
