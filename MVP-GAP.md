# The gap to MVP, 1 October

His three pillars, round NV: onboarding and tutorial, release, and the paywall
and pay journey. Each is counted as steps, and each step is marked done (1),
partly (0.5) or not done (0). The steps are the team's list, and the weights
are equal, so the percentages are a way to see what is left and not a
measurement. Where a step could not be checked from here it says so.

| Pillar | Step | State | Score | Basis |
|---|---|---|---|---|
| Onboarding | Funnel quiz page | built | 1 | `funnel/` gate passes |
| Onboarding | Funnel buy page at 12, 29, 59, 99 | built | 1 | `funnel/buy.html`, gated |
| Onboarding | Concern selection and the personalised 100 pattern gift | not built, waits on his storyboard | 0 | `ATUNED-funnel-to-software-journey-TDD-v1.md` |
| Onboarding | Account creation and sign in | built against a stub, server code exists | 0.5 | not run against the deployed server from here |
| Onboarding | Claim a quiz record at sign in | seam built | 0.5 | `ui/auth.js` |
| Onboarding | Day One tutorial | built | 1 | gated |
| Onboarding | The Intake page | restored, redesign asked | 1 | his grade D on the design is a separate item |
| Onboarding | Copy against the brief | checker built, sweep not run | 0 | `COPY-SWEEP-FINDINGS.md` |
| Onboarding | Phone widths | gated at 390 | 1 | design and functional gates |
| Release | The release run and its card | built | 1 | |
| Release | The free rerun route | built | 1 | |
| Release | Rerun that returns heavy lines to their place | in progress | 0.5 | agent running |
| Release | Allowance and metering | built | 1 | |
| Release | Sound for the release | engine merged, off by default, not on every moment | 0.5 | |
| Release | The second release document audited against the code | not done | 0 | `SOURCE-TDD-release-intelligence-v2.md` |
| Paywall | The ladder and who sees what | built | 1 | `engine/plan.js` |
| Paywall | Prices 12, 29, 59, 99 | built | 1 | |
| Paywall | Checkout route | built, run against a stub | 1 | `reboot-os` 56 tests |
| Paywall | Webhook for renewals, changes, cancellations | built, run against a stub | 1 | |
| Paywall | Manage billing | built, run against a stub | 1 | |
| Paywall | The plan read back into the app | built | 1 | |
| Paywall | The four products made in Stripe | not done, his step | 0 | `STRIPE-SETUP.md` |
| Paywall | Server deployed with the secrets, `BASE_PLAN` set to 0 | not known | 0 | needs him to confirm |
| Paywall | One real payment in test mode, end to end | not done | 0 | |
| Paywall | The 25 pattern referral grant | documented, not built | 0 | `DECISIONS.md` |

Counted: onboarding 6 of 9 (67 percent), release 4 of 6 (67 percent), paywall
6 of 10 (60 percent). Over all 25 steps, 16 of 25, 64 percent.

What moves it fastest: the four Stripe products and the secrets (his steps, 30
minutes, `STRIPE-SETUP.md`), then one real test payment (three steps at once),
the copy sweep, the funnel concern selection once the storyboard is final, and
the second release document's audit.

What this number leaves out: the five TDD builds from today (Practice, Trace
graph, Becoming, Points, Summary) and the practitioner page. They are the
product after MVP, except where he moves one of them in.
