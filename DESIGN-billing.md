# Billing. Stripe, the tiers, and the seam

Frictionless, clean, in and out with no fuss, and controlled from the desktop.
That is the brief and it decides the integration before anything else does.

---

## The one architectural fact everything follows from

`source.html` is one file with no dependencies and no network. It does not
gain a network for billing. It gains one at exactly one seam, fetching a record
at sign in, and that seam already exists in the plan.

So **Stripe never appears in the app**. Not a key, not a script tag, not a
customer id, not a card field. The app reads a plan off the record and calls
one host function. A gate now sweeps the whole build for `sk_`, `pk_`, `cus_`,
`sub_` and any card field, and fails if one appears.

    the app          reads plan, answers what may be opened and seen
    the record store reads Stripe, writes the plan onto the record
    Stripe           holds the customer, the card, the subscription

The app never asks Stripe anything. It asks its own record. That is what makes
it possible for the app to keep working with no network at all, which is the
property the whole product is built on.

---

## Built in this pass

**`engine/plan.js`**, host free, no processor anywhere in it.

- `PLANS`, the owner's ladder as data: the gift at a hundred with everything
  visible, free at ten a week, and four paid tiers at 400, 800, 1200 and 1200
  with sight running saboteurs, complexes, hyper complexes, character.
- `planOf(plan)` answers **what is in force**, not what is written. A record
  saying tier three with a cancelled subscription is free. Nothing anywhere
  else reads `plan.tier` directly.
- `planState` treats an **unknown status as pending, and pending grants
  nothing**. Stripe adds a status, an old build does not know it, and the safe
  reading is no. This is the single most important line in the file.
- `past_due` keeps access. Cutting somebody off mid period because a card
  expired is a punishment for a bank's timing.
- `planSees(plan,kind)` and `planNextSight` so a locked rung can name itself.
- `planAllowance(plan,unique)` spends the gift first and once, then the period
  grant. **Spend is never stored**: it is the unique count against a baseline,
  so the two cannot drift apart. A cancelled record carrying `granted:400`
  falls to free's ten rather than spending four hundred.
- `planUpgrade` says what a tier buys and never what a person lacks. A gate
  fails it on the words miss, lose, locked out and only.

**The boundary.** `plan` is on the profile and validated like everything else:
refused by name, never clamped. A tier this build does not know is refused
rather than rounded down, because silently downgrading somebody who paid is the
same class of error as silently upgrading somebody who did not, and only one of
them gets reported. A record carrying a customer id, a subscription id, an
email or a key is refused outright, because holding an identifier the product
does not need is how a promise about a name gets broken.

**The panel**, in the profile sheet: what you are on, what is left, what you can
see, what the next tier adds, and two controls. With nothing bound the controls
report through `status()` that billing is not connected yet, because a control
must never claim success before it has it.

**Two defects found on the way.** `planUpgrade` first read "390 more of new
ground a month" stepping off free, which is a week subtracted from a month.
Across a period boundary a tier states its own figure. And the profile sheet
printed "addresses carrying, 0 of 112", which is a count against a total and
the one thing a reading may never be.

---

## The integration, and why each choice

Current practice, checked this session rather than remembered.

**Stripe Checkout in subscription mode for the purchase.** Stripe hosts the
page, the app never touches card data, and 3D Secure is somebody else's UI to
build. This is the default recommendation and the brief argues for it harder
than the general case does: frictionless, no fuss, and nothing about a card
anywhere near a file that holds somatic self report.

The one honest argument for Payment Element is that checkout feels like part of
the product. It does not apply here, because the app has no network and cannot
host an element at all without breaking the property the product is built on.

**The Customer Portal for everything after.** Card changes, plan switches,
invoices, cancellation. This is exactly "the user can control it from the
desktop": one button in the profile, a hosted page, done. Building a billing
UI would mean building cancellation, proration and dunning, and then getting
them wrong.

**Entitlements for sight.** A subscription creates an active entitlement per
feature on the product, which maps onto the sight ladder without a second
system: one feature per rung, and the store writes the highest granted rung
onto `plan.tier`. Sight is derived from the tier in the app, so the app stays
able to answer offline.

**Webhooks the store must handle, and what each one is for.**

    checkout.session.completed     provision. write tier, status, period, base
    invoice.paid                   the period rolled. write the new grant and
                                   reset base to the current unique count
    customer.subscription.updated  plan change, trial ending, status change
    customer.subscription.deleted  drop to free. never delete the record
    invoice.payment_failed         status past_due. access continues

Every one writes the same five fields and nothing else: `tier`, `status`,
`granted`, `base`, `until`. Handlers are idempotent on the event id, because
Stripe retries and a retried `invoice.paid` must not grant a second period.

**The period roll is the subtle one.** `base` is the unique count at the moment
the period opened. It is written when `invoice.paid` arrives, not computed, and
never by the app. Without it the allowance subtracts a lifetime of opened
ground from one month's grant, which is the bug the first build of
`planAllowance` had.

---

## The flow, end to end

    lands           free, inside the gift, everything visible
    gift spent      the panel names the next tier and what it buys
    presses         store mints a Checkout session, hosted page, card entered
    webhook         store writes the plan onto the record
    next open       app fetches the record, reads the plan, grants
    manages         one button, hosted portal, card or plan or cancel
    cancels         subscription runs to period end, then drops to free

**No account is destroyed by a cancellation.** Ever. The record is the person's
and the plan is a field on it. Cancelling changes one string.

**The desktop is the place it is controlled from**, which is the brief, and it
falls out of the portal choice for free: the same button works anywhere the app
runs, because the page is hosted.

---

## What is still owed, and what is the owner's

**Owner's, and the first one blocks the price list.**

- **Tier one is 400 a month or 100 a week.** Both were said and it is still
  open. Everything below it in the ladder is settled.
- **The actual prices.** The ladder is patterns and sight. No number has been
  attached to any of it. The panel research anchored against therapy, coaching
  and app pricing rather than against pattern counts, which is the right frame
  for setting them.
- **Annual, and whether there is one.** Two months free was written here as
  the convention and is ruled out. Whether there is any annual discount is
  open and is the owner's. The grant arithmetic does not depend on it: an
  annual plan grants monthly either way.
- **Whether tier four's practitioner seat is per practitioner or per client.**
  A practitioner with twelve clients is a different product from a person with
  a bigger allowance, and it is the clearest thing here to charge for.
- **Tax.** Stripe Tax handles it and it is a switch, but somebody has to own
  the registration thresholds.

**Mine, once the above is answered.**

- The record store, which is the only thing that can mint a session, because a
  session needs a key.
- The five webhook handlers and the idempotency table.
- A gate that runs the period roll against a record with three months of
  history and asserts the allowance opens full on every one of them.

**A standing rule for whoever builds the store.** The store reads Stripe and
writes five fields. It does not write anything else onto the record, and it
does not hold the story. The promise is that the record and the story are never
joined, and a billing system is exactly where that gets broken by accident.
