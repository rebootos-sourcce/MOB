# The ladder, priced. A business strategy pass

Four accountants' worth of arithmetic and one strategist's job, which is to
find where the tiers are out of balance and say so before the price list is
printed.

**Every figure below is either stated by the owner, quoted from the codex, or
model output over `PANEL-10k.md` and labelled as such.** Nothing here is a
measurement of a real market. The panel is a weighted segment model and its
prices are simulated. Treat the shape as the finding and the decimals as
placeholders.

---

## The ladder as ruled

| | Patterns | A week | Sight | Suite | Price |
|---|---|---|---|---|---|
| Gift | 100 once | four runs | everything | | free |
| Zero | 10 a week, for life | | saboteurs | | free |
| One | 400 | 100 | saboteurs | | open |
| Two | 800 | 200 | complexes | | open |
| Three | 1,200 | 300 | hyper complexes | | open |
| Four | 1,200 | 300 | everything | cohort lead | **99** |

A release run is at most **25 patterns**, which is what makes the gift exactly
four runs. One pattern is valued at **one dollar**.

---

## Seven findings, worst first

### 1. The free tier cannot complete a single release

Ten patterns a week against a run of twenty five. A free person reaches one run
every **2.5 weeks** and never in a week, however they spend it. An allowance
below the smallest unit of the product is not an allowance, it is a countdown
somebody has to work out for themselves.

**Fixed in this pass.** The weekly ten banks, and the surface says "banking
toward a run of twenty five" rather than printing a number that reads like a
permission. The engine reports runs as well as patterns everywhere, because
runs are the unit a person acts in. Gated.

**Still the owner's:** whether free should be **25 a week** instead, which is
exactly one run and turns a countdown into a weekly ritual. It costs nothing
marginal and it is the difference between a free tier that works and one that
explains itself.

### 2. Tier three and tier four carry the same grant, so patterns do not separate them

Both are 1,200. Everything tier four adds is the cohort suite. That is clean
and it is the right call, but it leaves **tier three with nothing of its own**:
it is tier two plus fifty percent more patterns and one more rung of sight,
against tier two's eight hundred. If patterns are the stated mechanism, tier
three is the weakest rung on the ladder and the first one a person will skip.

Two ways out, and they are not exclusive.

- **Re-space the grants** so the rate per pattern stays flat: 400, 1,000,
  2,000. At a 12, 29, 59 price the rates are then 3.0, 2.9 and 3.0 cents
  against 3.0, 3.6 and 4.9 today.
- **Stop selling patterns.** The panel already said it: patterns per month stay
  as the mechanism and stop being the pricing story. Sight is what separates
  the rungs and sight is a better story.

### 3. The price per pattern currently goes UP with the tier

At 12, 29 and 59 for 400, 800 and 1,200, a person pays **3.0, 3.6 and 4.9
cents a pattern**. Buying more costs more per unit, which is backwards from
every subscription anybody has ever bought, and somebody will publish the
division. This is the same exposure the panel flagged when it said the pattern
count is what invites the arithmetic.

Flat rate at 400, 1,000, 2,000 fixes it. So does not printing the rate.

### 4. One dollar a pattern must be an internal unit, never a published price

At tier one, four hundred patterns for twelve dollars is **three cents a
pattern**. Publishing a dollar figure per pattern makes that division trivial
and the gap between the stated value and the realised price is 33 times. That
gap is the value story and it is a good one, but only if it is told as value.
Printed as a price it reads as a discount nobody believes.

**Use it for the gift and never for a tier.** "A hundred patterns" is abstract.
"A hundred dollars of work, free, before you decide anything" is not.

### 5. The therapy claim is understated, and the safe version is stronger

The codex, quoted: **"Therapy tends to release one to six patterns per session,
if you are lucky."**

On that figure:

    25 patterns   = 4 to 25 sessions
    100 patterns  = 17 to 100 sessions
    400 patterns  = 67 to 400 sessions

So "twenty five patterns is like three therapy sessions", said earlier, is
**below the book's own floor**. And "a hundred patterns is about two years of
therapy" is defensible: two years at fortnightly is fifty two sessions, which
is 1.9 patterns a session, inside the book's one to six and at the conservative
end.

**But the claim has to be about throughput, not outcome.** "Two years of
therapy" is a clinical result claim and the evidence tier does not carry it.
The same fact, safely: *as many patterns as a year of fortnightly sessions
would release, on our own most conservative figure*. That is true, it is
checkable against the book, and it survives somebody hostile reading it.

### 6. The referral should be fifty

The arithmetic that decides it is how many invites it takes to stay free
forever at tier one volume:

    100 a referral   4 invites a month replaces a 400 subscription
     50 a referral   8 invites a month
     25 a referral  16 invites a month

Four a month is achievable for a motivated person, so a hundred cannibalises
the bottom rung. Sixteen is out of reach for almost everybody, so twenty five
is not felt as a gift and will not drive the behaviour it exists to drive.

**Fifty.** Two full runs, eight invites a month to break the ladder, and it
reads as half of what you were given yourself, for bringing somebody. Cap it
at four a month against fraud, which is the same ceiling that protects the
rung.

### 7. The keying ruling still decides whether any of this is sellable

Unresolved since the progression pass, and it now blocks a price list.

    keyed by address and channel     428 lifetime keys
      tier one at 400 a month exhausts the entire product in 1.1 months
    keyed by statement            21,400 lifetime keys
      tier one at 400 a month runs for 53 months

Under the first, every tier above the gift is unsellable by construction and
the ladder is a month long. Under the second it is a four and a half year
product. **Nothing else in this document matters until it is ruled.**

---

## The price list, modelled

Method: each segment in `PANEL-10k.md` carries a median accepted price and,
for four of them, a stated ceiling. The ceilings average 1.84 times the median
and that ratio fills the rest. Take is full below seventy percent of the
median, falls to half at the median, and to nothing at the ceiling. Each
segment buys the rung that returns the most. **Simulated, and an upper bound:
it assumes everybody who can afford a rung buys one.**

| Ladder | Monthly | Payers | ARPU |
|---|---|---|---|
| 12 / 24 / 39 / 99 | 108,700 | 6,521 | 10.87 |
| 9 / 19 / 39 / 99 | 108,500 | 6,832 | 10.85 |
| **12 / 29 / 59 / 99** | **102,800** | **6,066** | **10.28** |
| 15 / 29 / 59 / 99 | 100,650 | 5,209 | 10.07 |
| 19 / 29 / 49 / 99 | 91,350 | 3,832 | 9.14 |

**The recommendation is 12, 29, 59, 99.** The panel reached 12, 29 and 59
independently, from the three anchors people actually price against, and the
owner reached 99 independently for the professional rung. They compose without
either moving, and the ladders that beat it do so by reaching down to nine and
twelve dollar buyers the panel says explicitly not to monetise.

**A single price is worth 30 to 40 percent less.** Best single number is
nineteen at 62,000 a month against 102,800. Two thirds of the revenue sits with
people anchored on therapy and coaching and two thirds of the people sit with
people anchored on app subscriptions. Those are two prices, not one.

---

## The ninety nine, which is the one number the model cannot advise on

Against the panel's practitioner segment, ninety nine is the wrong price:

    $49   258 of 340 take    $12,639 a month
    $69   147 take           $10,156
    $99    85 take            $8,415
    $119   44 take            $5,181

On those numbers forty nine earns half as much again as ninety nine.

**And the model is measuring the wrong curve.** The panel's fifty eight is a
*personal* willingness to pay, taken as a consumer. Tier four is not a consumer
product: it carries somebody's client book. A coach billing a hundred and fifty
an hour across twelve clients turns over seven thousand two hundred a month,
and ninety nine is **1.4 percent of that**. Professional tools are bought out of
a different budget with a different test, which is whether it pays for itself,
and one retained client pays for a year of it.

**Hold ninety nine.** It is the one price here where the arithmetic cannot
settle it and only the market can, so it should be the first thing instrumented
and the first thing changed if the take rate says so. Ninety nine is also the
price that stops tier four being bought by people who do not lead a cohort,
which is worth more than the difference.

---

## What the accountants want next, in order

1. **The keying ruling.** Everything downstream is blocked on it.
2. **Free at 10 or 25 a week.** It decides whether the free tier works.
3. **The referral number.** Fifty is the recommendation with the arithmetic
   attached.
4. **Whether tier three gets something of its own** or the grants re-space.
5. **Annual. Two months free is out, on the owner's ruling.** It was listed
   here as the convention and as worth roughly fifteen percent on retained
   revenue, and it is ruled against, so the arithmetic that assumed it is
   wrong wherever it still appears. An annual plan still grants monthly, so
   the grant arithmetic stands on its own and did not depend on the discount.
   What the annual discount should be, if any, is open and is the owner's.
6. **Tax registration thresholds.** Stripe Tax is a switch; the obligations are
   not.
7. **Instrument the ninety nine** from the first paying practitioner.
