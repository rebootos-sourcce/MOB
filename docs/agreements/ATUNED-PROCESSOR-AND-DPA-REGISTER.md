# ATÜNED Processor and DPA Register

**As of:** 11 October 2026  
**Status:** Candidate inventory pending engineering and account-contract verification.

## Control rule

A vendor is not “approved” merely because a public DPA exists. Record the actual company account, service, enabled feature, data categories, region, applicable contract/version, subprocessors, retention/deletion terms, transfer mechanism and verification evidence. If the product does not use a service in the release candidate, do not list it as an active processor; if it does, the privacy notice must not omit it.

## Candidate vendor register

| Vendor / service | Why it is in the verification queue | Possible data / role to confirm | Account DPA / contract status | Required proof |
|---|---|---|---|---|
| Stripe | Terms and Privacy drafts describe checkout/subscription management | Email/receipt address, customer/subscription/plan IDs, billing status and dates; card fields are said to be entered on Stripe-hosted page | UNVERIFIED for exact account and enabled billing mode | Active account and products; DPA/privacy terms; data fields; tax settings; retention; cancellation/refund API behavior; test-mode evidence |
| Cloudflare Pages / Workers / D1 | Hosting, Worker execution, and external Workers Builds issue are in engineering records | Request metadata, application traffic, Worker payloads, D1 data if applicable; exact store and vendor role need verification | UNVERIFIED | Account/service list, location, logs, retention, DPA, subprocessors, deployment settings, log-access roles |
| Supabase | `atuned_funnel_system/README.md` says the schema is applied to a live project and real repository write/read/delete was checked; the same README says the app router is not calling `FunnelService` end to end | Funnel session, starter-gift, usage, event and attachment/challenge records if the integration route is connected; active consumer story-content flow is not established | Live project exists; exact company account, region, consumer-traffic role, DPA/terms and operational access remain unverified | Record project/account ID and region; prove whether any current consumer request reaches it; inspect actual tables/rows and access logs; obtain account-level DPA/terms and confirm backup/retention/deletion settings |
| ElevenLabs | Latest owner ruling in `DECISIONS.md` says that when the voice toggle is on and the user is not signed in, each line is sent to ElevenLabs through the ATÜNED server | Spoken release text and related request metadata; exact fields, project/account and role to verify | Exact service account, terms/DPA and subprocessor terms UNVERIFIED | Trace current voice path with synthetic text, identify project/account, payload, routing, logs, region, retention and opt-out; verify the just-in-time UI disclosure matches reality |
| Google | Privacy draft says Google sign-in is not built; Chrome browser speech may send audio to Google's speech service | Depending on actual flow, sign-in identity fields or browser-mediated speech audio/transcript | Feature-specific: do not assume one service's DPA covers another | Confirm whether Google OAuth exists; separately test browser speech route and disclose browser-provider transfer |
| Microsoft / Edge speech service | Privacy draft describes browser-mediated speech behavior in Edge | Audio sent by browser to browser maker for dictation, depending on browser permission/configuration | Not verified as an ATÜNED direct processor relationship; browser may act as provider independently | Verify actual browser path and what ATÜNED receives; counsel decides disclosure treatment |
| GitHub | Repository hosting and CI; no user-data processing role is established by this register | Source code, issues, workflow logs, test artifacts; do not place real user data/secrets in issues or fixtures | Organization/account terms not reviewed here | Repository visibility/permissions; artifact retention; incident handling; verify no production user content or credentials in repo/logs |
| Other / discovered at build | Any SDK, analytics, error reporting, email, speech, auth or storage service found in final network/runtime inspection | To be added from actual code/account configuration | BLOCKED until identified | Complete request inventory, account owner, DPA/terms, region and privacy-notice change |

## Required evidence fields

For each active vendor, record:

- Legal entity and service name, app/project/account ID, internal owner and support/security contact.
- Purpose and instructions, data categories, data subject types and whether sensitive/health data can be exposed.
- Regions for primary processing, support access, logs, backups and subprocessors.
- DPA/BAA or other contractual terms, effective date, version, auto-renewal and order of precedence.
- Subprocessor roster and change notification process.
- Security commitments, incident notice deadline, audit/report options and access-control model.
- Retention, deletion, return/export, backup expiry and legal-hold exceptions.
- International transfer mechanism and transfer assessment where counsel says required.
- Test evidence that the application sends only the described fields to this service.
- Approved privacy-policy description and last review date.

## Gate

No privacy-policy paragraph is final until the active vendor list and actual account contracts are verified. Engineering must update this register when an SDK, destination host, storage system, speech API, email provider, payment service or analytics destination changes.
