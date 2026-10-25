# ATÜNED Counsel Review Packet

**Prepared:** 11 October 2026  
**Status:** Questions for qualified counsel, not legal advice or approval. Facts labelled unverified must be confirmed by the product/build owners before counsel relies on them.

## 1. Product summary for counsel

ATÜNED is described in the draft consumer terms as a self-report instrument that accepts user stories/answers and presents an interpretation. The intended journey includes user-correctable Mirror, release, reframe, verification and practice/history. Product materials disclaim medical care and diagnosis. No independent clinical validation or durable outcome evidence is documented in this packet.

The current account/data flow is unsettled: the Privacy Policy describes a local-first quiz and a copy of some data at account creation, while unresolved checks address whether story/release data is included and whether later entries sync. The draft says birth name/sex/date/time/place stay on-device; that claim needs exact-build verification. Stripe-based billing is described in Terms; account and processor behavior is not fully verified. Current draft terms also describe age 18+, monthly auto-renewal, online cancellation, a 7-day refund promise and a 90-day backup/restore window. The latest `DECISIONS.md` cleanup ruling separately records retention after delete as 24 months and says the period is not to be re-asked. The 90-day and 24-month statements need storage-scope mapping and implementation reconciliation before counsel approves consumer wording.

## 2. Draft set to review

- TERMS.md — consumer Terms / User Agreement.
- PRIVACY-POLICY.md — general privacy policy.
- CONSUMER-HEALTH-DATA.md — standalone consumer health-data notice, applicability first to be decided.
- PRIVACY-BREAKDOWN.md — one-page plain-language summary.
- LEGAL-IA.md — information architecture and planned wiring.
- This register and the associated data-flow, retention, consent, processor, user-request, deletion, incident, refund and claims documents.

All public legal texts remain draft/unapproved until placeholders and fact checks are truly resolved, the product owner records decisions, and counsel expressly approves the final version.

## 3. Questions requiring counsel answers

### A. Product classification, health data and claims
1. Based on product inputs/derived readings, which jurisdictions' health-data, consumer-protection, medical-device, health-claim or other rules may apply? What is the relevant factual trigger?
2. Is a standalone consumer health data privacy policy required for each target jurisdiction? Which exact notice link, timing, consent or authorization is mandatory?
3. Which processing requires explicit consent/authorization, and which can rely on another lawful basis? How must a user withdraw permission?
4. How should a user-correctable self-report interpretation, body/somatic descriptions and reported post-release sensations be described without implying clinical measurement or diagnosis?
5. Does any planned “results-as-a-service,” pattern-count, transformation or permanence claim need substantiation before use? What wording should be prohibited?

### B. Consumer Terms, eligibility and clickwrap
6. Is 18+ the appropriate age floor for the proposed product and all launch jurisdictions? What age-screening/control and record are required?
7. What assent is required for accountless use versus account creation? Which terms must be accepted affirmatively, and what copy/placement is needed?
8. Can the proposed liability disclaimer, warranty disclaimer, indemnity, liability cap, dispute forum and governing-law clause be used for this product/market?
9. What cancellation/refund or digital-service withdrawal rights must be preserved? How should statutory rights interact with the optional 7-day refund rule?

### C. Subscription and auto-renewal
10. For each launch region, what pre-purchase price/currency/period/renewal, tax, affirmative consent, reminder, cancellation and price-change disclosure/control is required?
11. Does the proposed online cancellation path meet applicable “easy cancellation” requirements? What exact evidence should be retained?
12. Is the proposed 7-day full refund promise intended to apply to every renewal charge? Must particular statutory refunds be described separately? What are the tax/processor implications?
13. What must the product show or store to prove the user authorized the exact recurring charge?

### D. Privacy, rights and retention
14. Which data categories are personal data, consumer health data or special-category data given the story content, inference, body-related labels, derived values, account identifiers and events?
15. What lawful basis and purpose wording apply to account sync, analytics, voice features, support diagnostics, practitioner/cohort access and optional model improvement/research?
16. What rights, deadline clocks, identity verification, appeals and response statements apply in each target region?
17. The owner ruling records 24-month retention after deletion, while Terms/Privacy drafts describe a 90-day restorable backup. Given the exact store and record-class scope is not defined in the decision sentence, what legal exceptions and consumer wording apply once engineering maps live stores, backups, replicas, vendors and linked records?
18. Can a deleted account be restored from a 90-day backup under the contemplated product, and how should consent withdrawal, third-party grants, subscriptions and deleted records behave on restore?
19. Which vendor contracts and transfer mechanisms are required for actual hosting, database, payment, email, browser speech and other providers? Are EU SCCs/UK Addendum, data transfer assessment, representative or DPO considerations applicable?

### E. Incident and operational controls
20. Which breach-notification regimes could apply, what are the clocks/content/recipient rules, and what must vendors contractually notify?
21. Which security claims can be made from the actual architecture and evidence? What must be stated about backups, encryption, processor access and incident handling?
22. Which accessibility, online terms, privacy notice, cancellation and consent presentation requirements apply to the launch surface?

## 4. Primary official research starting points

These official sources are a starting point for counsel's current-law check, not a complete analysis and not proof of applicability:

- Washington My Health My Data Act, Chapter 19.373 RCW: https://app.leg.wa.gov/RCW/default.aspx?cite=19.373
- Washington RCW 19.373.020, consumer health data privacy policy: https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.020
- Washington RCW 19.373.030, collection/sharing: https://app.leg.wa.gov/RCW/default.aspx?cite=19.373.030
- Nevada SB 370 / 2023 Session Laws, Chapter 525: https://www.leg.state.nv.us/Statutes/82nd2023/Stats202329.html
- California DOJ, “Attorney General Bonta Issues Consumer Alert on California’s Automatic Renewal Law,” 4 September 2025: https://www.oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-california%E2%80%99s-automatic-renewal-law
- FTC Health Breach Notification Rule, 16 CFR Part 318: https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule
- FTC compliance guidance: https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0
- European Commission Standard Contractual Clauses: https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_en

The California DOJ page states that the California Automatic Renewal Law was amended effective 1 July 2025 and describes express affirmative consent, cancellation, reminder and price-change obligations. Counsel must review the law's current text and scope for each actual offer before translating this summary into clauses. The FTC page summarizes breach-notice duties for vendors of personal health records and related entities; counsel must determine whether ATÜNED is within scope.

## 5. Required counsel response record

For every question, record: question ID, applicable jurisdiction/product fact, counsel's answer in the words/meaning supplied, exact clause or control to change, source authorities, owner decision if business policy is involved, and approval scope/date. Do not broaden one clause approval into approval of all documents or of unverified build behavior.
