# ATÜNED Subscription, Refund and Cancellation Runbook

**Status:** Operating draft; plan configuration, mailbox receipt, cancellation behavior and refund execution need proof.  
**No production billing activation is authorized by this document.**

## 1. Before a plan may be sold

- Record product/plan name, exact price, currency, billing period, renewal terms, taxes/fees, initial term or trial, included usage, limits, cancellation route and refund policy.
- Make the same facts visible before purchase and match the checkout provider's actual configuration.
- Use separate unticked affirmative controls if required for auto-renewal, paid purchase or another distinct consent. Do not treat general Terms acceptance as authorization for an unclear recurring charge.
- Record the exact checkout copy/version, consent record, plan/price ID and provider transaction/subscription reference.
- Show how to cancel in the same online journey area as purchase; test with keyboard, mobile and private window.
- Do not advertise annual-plan reminders or any billing period that is not currently offered and implemented.

## 2. Cancellation request

1. Verify the request or signed-in entitlement without demanding unnecessary personal data.
2. Show the exact consequence and effective date before confirmation.
3. Send cancellation through the provider's supported action/API, idempotently.
4. Read back the authoritative subscription status and next renewal time.
5. Confirm the result only after provider state confirms that renewal has been stopped.
6. Preserve entitlement through the paid period only if that is the approved policy and provider state agrees.
7. Record request ID, user-visible copy version, provider result and timestamp; avoid storing card data.

## 3. Refund request

1. Record receipt time, relevant charge ID, account/customer reference, amount/currency, plan and reason if voluntarily provided.
2. Apply the final owner-approved refund rule and any mandatory consumer rights confirmed by counsel. Do not rely solely on the draft seven-day wording.
3. Confirm payment-provider status, not just API submission.
4. If rejected, pending or partially refunded, state exactly that and escalate according to the approved support process.
5. Issue a receipt that records the charge/refund identifiers, amount, status and date, without exposing sensitive payment data.
6. Reconcile refund, entitlement, tax handling and cancellation state.

## 4. Required negative and end-to-end tests

- Price and renewal period exactly match UI, plan metadata and provider checkout.
- Auto-renewal disclosure and required consent appear before charge.
- Consent starts in the required default state and is independent of general Terms.
- Unchecked/declined authorization prevents charge.
- Double-click/retry does not produce duplicate charge or refund.
- Cancellation works online without forced call/email if policy/law requires self-service online cancellation.
- A successful cancellation stops the next charge; failure/timeout is not shown as success.
- Refund policy boundary tests cover initial charge, renewal charge, after-deadline request, partial refund and provider error.
- Webhooks/retries do not reactivate canceled subscriptions or charge after revocation.
- Delete account does not silently leave a paid subscription active; a defined policy is followed and confirmed.
- Tax and international checkout behavior match approved copy and actual provider config.

## 5. Current terms requiring owner/counsel resolution

The current Terms draft describes monthly auto-renewal, online cancellation via Stripe-hosted billing management, and a full refund of any charge when requested within seven days. It also has unresolved tax and price-change notice placeholders. Treat all of these as drafts until the product owner approves the policy, counsel reviews legal requirements, and the build owner proves the exact checkout and billing portal.

Current primary-law starting point: California DOJ, “Attorney General Bonta Issues Consumer Alert on California’s Automatic Renewal Law,” 4 September 2025: https://www.oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-on-california%E2%80%99s-automatic-renewal-law. Counsel must confirm the law as currently in force, jurisdictional scope and exact requirements for ATÜNED.
