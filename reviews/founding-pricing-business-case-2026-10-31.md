# Founding pricing. The business case and the simulation

Sales director seat, 31 October 2026. Application: MOB (atuned.world). Nothing
here is built and no code was touched. It answers `TASKS.md` SO1a.

Every figure is labelled one of three ways:

| Label | What it means |
|---|---|
| **ruled** | The owner's, in `DECISIONS.md` or quoted in `engine/plan.js` |
| **model** | Output of the simulation below. It depends on stated assumptions and is not a forecast |
| **assumption** | An input chosen by this seat, with the reason given, so it can be swapped |

---

## 1. The offer, in his words

> "If they pay $99 up front for tier four, they get that locked then for the
> full year. It's a way of saying thank you... what about another thought is,
> the 200 after that, get 20% off. For the first year. Their regular price.
> Monthly price."

| Group | Who | What they pay in year one | After year one |
|---|---|---|---|
| **Founding 100** | Signups 1 to 100 | $99 once, for twelve months of Practitioner | Not said. Open question 3 |
| **Next 200** | Signups 101 to 300 | 20 percent off the monthly price, for twelve months | Regular price |
| **Everyone after** | Signup 301 on | Regular price | Regular price |

Practitioner is the top rung, the one that used to be called tier four. It
carries everything in tier three plus cohorts, a cohort being a group of
people the practitioner leads.

---

## 2. The real Tier 4 price: found, and it is settled

| Fact | Value | Source | Label |
|---|---|---|---|
| Practitioner regular price, called **P** below | **$99 a month** | `engine/plan.js`, `PLAN_PRICE.four`, quoting his 1 October words "Tier 4: $99/month"; restated 17 October, "that's at 99 a month" (`DECISIONS.md`, "The top tier is named Practitioner") | ruled |
| The rest of the ladder | Free $0, tier one $12, tier two $29, tier three $59 | same place | ruled |
| Practitioner patterns | 1,200 a month, the same as tier three | `engine/plan.js`, `PLANS` | ruled |
| Annual plans | None. Monthly only. Two months free on annual is out | `engine/plan.js`, `PLAN_YEAR_FREE=0`; `DECISIONS.md` | ruled |
| **Can Practitioner be bought today** | **No.** `built:false`: "closed until built", it opens when the lead suite (the cohort tools) exists | `engine/plan.js`; `DECISIONS.md` round PK | ruled |
| Can anything be bought today | No. Checkout is switched off on both the app and the server | `PLAN_CHECKOUT_OPEN=false`; Reboot-OS PR 31 | ruled |

Because P is known, the model below uses $99. Every per person line also
carries its formula in terms of P, so it still holds if P moves.

---

## 3. What each person is worth, one at a time

Year one only, before anybody leaves.

| Group | Pays in year one | Formula | List value of that year (12P) | Discount given | Discount share |
|---|---|---|---|---|---|
| Founding 100 | **$99.00** | 99, fixed | $1,188 | **$1,089** | **91.7 percent** |
| Next 200 | **$950.40** | 0.8P x 12 = 9.6P | $1,188 | **$237.60** | 20 percent |
| Full price | $1,188.00 | 12P | $1,188 | $0 | 0 |

In plain words: a founder pays for one month and gets twelve. That is about
**$8.25 a month**, which is cheaper than a year of tier one ($144).

**The whole discount, if all 300 would otherwise have paid full price and
nobody left:**

| Line | Amount |
|---|---|
| List value of 300 first years | $356,400 |
| What the offer collects | $199,980 |
| Discount given up | **$156,420** (founders $108,900, next 200 $47,520) |

That is the ceiling on what this costs. The real cost is lower, because not
all 300 would have paid $99 a month without it. Section 5 is about how much
lower.

---

## 4. Assumptions, stated plainly

| Input | Base value | Range tested | Why |
|---|---|---|---|
| Monthly churn at full price (the share of paying people who leave each month) | 5 percent | 3 to 12 percent | A professional tool someone runs clients through. Consumer apps run higher |
| Monthly churn on the 20 percent offer | 4.5 percent | 0.8 to 1 times the above | A slightly better price keeps a few more |
| Extra leavers when the next 200 step up to full price at month 13 | 10 percent | 5 to 20 percent | A 25 percent price rise, announced, is a real reason to leave |
| Founders who ask for a refund on the $99 | 2 percent | 0 to 8 percent | Prepaid, small sum |
| **Founders who stay at month 13, when $99 a year becomes $99 a month** | **30 percent** | 15 to 55 percent | Their bill goes up twelve times. Real practitioners with clients stay; personal users mostly do not |
| **Founders who would have paid $99 a month anyway** | **25 percent** (25 of 100) | 10 to 45 percent | See the note below |
| **Next 200 who would have paid $99 a month anyway** | **68 percent** (136 of 200) | 45 to 90 percent | See the note below |
| How fast 300 signups happen | 9 months | 3, 6, 9, 12, 18 months | See section 6. Today there are 5 accounts and no marketing |
| Card fees | 2.9 percent plus 30 cents a charge | fixed | Stripe's standard US card price. Check against his own Stripe account |
| Cost to serve a person (voice, hosting) | left out | | The same per person under both arms, so it cancels in the comparison. It does not cancel for the extra people the offer brings in, so the offer's lead is slightly overstated |

**Where the "would have paid anyway" numbers come from.** The team's own
practitioner panel (`DESIGN-economics.md`, simulated, labelled there):

| Monthly price | Practitioners who take it, of 340 | Share |
|---|---|---|
| $49 | 258 | 76 percent |
| $69 | 147 | 43 percent |
| $99 | 85 | 25 percent |

- At $79.20 (the 20 percent offer) the curve reads about 37 percent. 25 over 37
  is **0.68**: about two thirds of the next 200 would have paid $99 anyway.
- At $8.25 effective (the founding offer) the curve is past its own bottom
  end, so at least 76 percent would take it. 25 over 76 is 0.33, and the
  founding price also pulls in people who lead nobody (section 7), which
  pushes it lower. Base: **0.25**.

So the realistic comparison is **300 people on the offer against 161 people at
full price**, not 300 against 300.

---

## 5. The simulation. Three arms

- **Offer**: 300 signups, first 100 founders, next 200 at 20 percent off.
- **Realistic baseline**: no offer. Only the 161 who would have paid $99 a
  month anyway sign up, at the same times.
- **Everyone full price**: no offer, and all 300 still sign up at $99 a month.
  This is the upper bound, the "what the discount costs on paper" line.

All money below is **net of card fees**, in dollars, **model**.

### 5.1 Headline, base case (300 signups over 9 months)

| Months after checkout opens | Offer | Realistic baseline | Everyone full price | Offer minus realistic | Offer minus everyone full |
|---|---|---|---|---|---|
| 12 | 96,800 | 94,200 | 190,400 | **+2,600** | -93,600 |
| 24 | 236,600 | 192,700 | 367,100 | **+43,900** | -130,500 |
| 36 | 320,100 | 246,000 | 462,700 | **+74,100** | -142,600 |

- **Year one is a wash.** The offer and an honest no-offer baseline land
  within about $3,000 of each other.
- **Year two is where it pays.** The next 200 step up to $99 and some founders
  renew, and the extra people the offer brought in begin paying full price.
- **It never beats "everyone pays full price".** That line only exists if all
  300 would have come at $99 a month, which the panel says they would not.

### 5.2 Where it crosses over

| Comparison | Month the offer is ahead and stays ahead |
|---|---|
| Against the realistic baseline, base pace | **Month 1**, but by a few hundred dollars through month 8. Clearly ahead from month 13 |
| Against the realistic baseline, slow pace (18 months) | **Month 17** |
| Against everyone full price | **Never** inside 36 months |

**The break-even in people.** The offer's revenue equals a full-price
baseline of:

| By month | Full-price signups the baseline would need, out of the same 300 |
|---|---|
| 12 | 153 |
| 24 | 193 |
| 36 | 208 |

In plain words: **if fewer than about 150 of these 300 would have paid $99 a
month without the offer, the offer wins even in year one.** If more than about
200 would have, it loses even over two years.

### 5.3 How fast 300 arrive changes year one, not the verdict

| Pace | Offer, 12 months | Realistic, 12 months | Offer minus realistic: 12 / 24 / 36 months | Crossover month |
|---|---|---|---|---|
| Fast, 300 in 3 months | 139,900 | 130,500 | +9,300 / +54,000 / +79,500 | 1 |
| Base, 300 in 9 months | 96,800 | 94,200 | +2,600 / +43,900 / +74,100 | 1 (thin until 13) |
| Slow, 300 in 18 months | 34,400 | 39,800 | **-5,400** / +26,500 / +63,400 | 17 |

### 5.4 The two inputs that decide it (offer minus realistic, base pace)

Rows: founders who stay at month 13. Columns: how many of the 300 would have
paid full price anyway.

**At 24 months**

| Founders who renew | 110 would have paid anyway | 161 (base) | 210 |
|---|---|---|---|
| 15 percent | +94,000 | +31,800 | -27,900 |
| 30 percent (base) | +106,100 | **+43,900** | -15,700 |
| 50 percent | +122,300 | +60,100 | +500 |

**At 12 months** renewal does not matter yet: +34,500, +2,600 and -27,900
across the same three columns.

**Churn barely moves it.** At 3, 5, 8 and 12 percent a month the 24 month lead
reads +43,800, +43,900, +42,300 and +38,500. Higher churn even helps year one
slightly, because the founders already paid.

### 5.5 Ten thousand runs with every input drawn at random from its range

| Window | Worst tenth | Middle | Best tenth | Share of runs where the offer wins |
|---|---|---|---|---|
| 12 months | -18,600 | 0 | +25,200 | **50 percent** |
| 24 months | -2,600 | +38,900 | +82,300 | **88 percent** |
| 36 months | +11,100 | +63,100 | +119,600 | **94 percent** |

Crossover month across the runs: middle 11, best tenth 1, worst tenth 22. In
5.5 percent of runs it never crosses within 36 months.

### 5.6 Month by month, base case (for a chart)

Monthly net revenue and running total, dollars, **model**.

| Month | Offer | Realistic | Everyone full | Offer, running | Realistic, running | Everyone full, running |
|---|---|---|---|---|---|---|
| 1 | 3,190 | 860 | 3,260 | 3,200 | 900 | 3,300 |
| 2 | 3,100 | 1,590 | 6,260 | 6,300 | 2,400 | 9,500 |
| 3 | 3,100 | 2,270 | 9,110 | 9,400 | 4,700 | 18,600 |
| 4 | 2,600 | 4,460 | 11,910 | 12,000 | 9,200 | 30,500 |
| 5 | 5,020 | 6,340 | 14,480 | 17,000 | 15,500 | 45,000 |
| 6 | 7,320 | 8,140 | 16,920 | 24,300 | 23,700 | 61,900 |
| 7 | 9,590 | 10,030 | 19,330 | 33,900 | 33,700 | 81,300 |
| 8 | 11,690 | 11,640 | 21,520 | 45,600 | 45,300 | 102,800 |
| 9 | 13,690 | 13,160 | 23,610 | 59,300 | 58,500 | 126,400 |
| 10 | 13,070 | 12,500 | 22,430 | 72,400 | 71,000 | 148,800 |
| 11 | 12,490 | 11,880 | 21,310 | 84,900 | 82,900 | 170,100 |
| 12 | 11,920 | 11,280 | 20,240 | 96,800 | 94,200 | 190,400 |
| 13 | 12,350 | 10,720 | 19,230 | 109,100 | 104,900 | 209,600 |
| 14 | 12,720 | 10,180 | 18,270 | 121,800 | 115,100 | 227,900 |
| 15 | 13,060 | 9,680 | 17,360 | 134,900 | 124,700 | 245,200 |
| 16 | 12,730 | 9,190 | 16,490 | 147,600 | 133,900 | 261,700 |
| 17 | 12,400 | 8,730 | 15,660 | 160,000 | 142,700 | 277,400 |
| 18 | 12,070 | 8,300 | 14,880 | 172,100 | 151,000 | 292,300 |
| 19 | 11,760 | 7,880 | 14,140 | 183,900 | 158,800 | 306,400 |
| 20 | 11,450 | 7,490 | 13,430 | 195,300 | 166,300 | 319,800 |
| 21 | 11,140 | 7,110 | 12,760 | 206,500 | 173,400 | 332,600 |
| 22 | 10,590 | 6,760 | 12,120 | 217,000 | 180,200 | 344,700 |
| 23 | 10,060 | 6,420 | 11,510 | 227,100 | 186,600 | 356,200 |
| 24 | 9,550 | 6,100 | 10,940 | 236,600 | 192,700 | 367,100 |

The dip at months 2 to 4 is the founders: they paid once in month 1 and owe
nothing until month 13.

---

## 6. The business case, both sides

### What it costs

| Cost | Size | Note |
|---|---|---|
| Discount on paper, if all 300 would have paid full | $156,420 in year one | The ceiling. Not the real cost |
| Discount against the realistic baseline | About zero in year one, positive after | Section 5 |
| **Founders who would have paid full anyway** | 25 people x $1,089 = **$27,200** in year one | The real money given away. It is a thank-you to people who did not need one to buy |
| **The renewal cliff** | Founders go from $99 a year to $99 a month at month 13, twelve times the bill | About 70 of 100 leave at base. That is planned, not a surprise, but it is a drop |
| **The step from signup 100 to signup 101** | $99 for the year against $950.40 | Person 101 will hear what person 100 paid. That is a word of mouth risk, not a gain |
| Ladder cannibalising | A founding seat is cheaper than a year of tier one ($144), tier two ($348) or tier three ($708) | Anyone who would have bought a lower tier takes the founding seat instead. A tier three buyer who takes it costs $609 |

### What it buys

| Gain | Size | Note |
|---|---|---|
| **Extra paying people** | 139 more paying Practitioners than the realistic baseline | The panel says most of them would not have paid $99 a month |
| Cash at the door | $9,900 from the founders, all in the first weeks | Cash, not revenue: it is earned a month at a time and is owed back if the product is not delivered |
| Year two and three revenue | +$43,900 at 24 months, +$74,100 at 36, base | Section 5.1 |
| Testers who have paid something | 100 people with money down | A paying tester answers differently from a free one. Small sum, real commitment |
| Word of mouth and testimonials | Not put into the model | To close the paper gap with "everyone full price" at 24 months, the 300 would need to bring in **about 107 extra full-price Practitioners** (each worth about $1,224 over 24 months). Treat that as the bar, not a promise |

### Verdict

- **Worth doing, on the model, if the founding seats go to people who
  actually lead others.** Year one roughly breaks even; years two and three
  are ahead in 88 to 94 percent of runs.
- **Not worth doing as a pure revenue move in year one.** It is a coin flip.
- **The founding $99 is the expensive half.** The 20 percent offer on the next
  200 is close to free money: most would have paid anyway and the rest are
  new. The $99 year is the gift, and it is a big one (92 percent off).

### Who it sells to, on the buyer grid (`BUYERS.md`)

- **Practitioner is a level 8 product** ("the practitioner and the engineer",
  90 percent buying probability). The next 200 at $79.20 are almost all level
  8 and up, because nobody else needs cohorts at that price.
- **The founding $99 also pulls in levels 6 and 7** (65 and 85 percent), who
  want tier three's sight and see a year of it for less than tier one. They
  are the ones who leave at month 13. **That is the named drop off.**

---

## 7. Three problems to fix before it is built, not after

**1. Practitioner cannot be sold yet.** It is closed until the cohort tools
exist (`built:false`). A practitioner's moment of value, the moment they
decide, is the first time they see a person they lead on their own panel. That
panel is not built. Selling a year of it now sells the year before the reason
to buy it exists.

| Option | What it means | Cost |
|---|---|---|
| **a. Take the money when cohorts open** (recommended) | The founding list fills in order now, free and with no card. Founders pay $99 the day Practitioner opens, and their year starts then | Loses early cash ($9,900). Keeps every promise true |
| b. Take $99 now, the year starts when cohorts open | They are on tier three until then, free | Free months of tier three ($59 a month each) before the year starts. Cash now, owed back if cohorts slip |
| c. Take $99 now, the year starts now | Founders pay for cohort tools they cannot use | Not recommended. It is selling something that is not there, which the paywall's own rule forbids |

**2. "First 100" needs a gate, or it goes to people who lead nobody.** At $99 a
year it is the cheapest paid thing in the product. `DESIGN-economics.md` held
$99 a month partly because "it stops tier four being bought by people who do
not lead a cohort". The founding price removes that filter. A plain question
at the door, "Do you lead other people, as a coach, therapist, teacher or
facilitator?", is not a trick and not a wall: it says who the seat is for.

**3. The honesty floor holds.** The cap of 100 is real, which is not fake
scarcity, as long as it is stated once and plainly. Out, as before
(`DESIGN-founding-offers.md` section 9):

- no live count ("13 places left"), no "you were number 87"
- no clock or expiry date on the offer
- no strike through price; say it as two prices in one sentence: "$99 for
  your first year, then $99 a month"
- no automatic jump from $99 a year to $99 a month without a notice before
  month 12 and a fresh yes (California's automatic renewal law requires the
  later price stated before the card is taken; `reviews/LEGAL-floor.md` section 8)

---

## 8. What needs his ruling before anything is built

Each carries the phrase it is about.

1. **Does this replace the 26 September founding plan?** That plan
   (`DECISIONS.md`, "Founding offers, the shape") gave the first hundred
   "that tier for life", their invitees half off, and the next ring 25 percent
   off. Tonight's plan reads as its replacement. Default taken: **it replaces
   it**, and the eight open questions in `DESIGN-founding-offers.md` close.
2. **"$99 up front"**: is it a fixed $99, or "one month of the regular
   price"? Same today. Different if P ever moves before launch.
3. **"Locked for the full year"**: what happens at month 13?
   - a. They move to $99 a month, with a notice and a fresh yes (base model, 30 percent stay)
   - b. They get a founder's renewal price (a cost; not modelled)
   - c. Nothing is charged; they choose a tier again
4. **"First 100 signups"**: of what? Default: the first 100 **paid
   Practitioner purchases**, not accounts. There are 5 accounts today and some
   are the team's own test walks; they do not count. Counted once, across the
   whole product, with no closing date.
5. **"The 200 after that, get 20% off. Their regular price"**: 20 percent off
   Practitioner only, or off whatever tier each person picks? If any tier,
   person 150 could take 20 percent off tier one, $9.60 a month, and the
   discount on that group shrinks to 2.4 times that tier's price each.
6. **When can it be paid for?** Practitioner is closed until cohorts are
   built. Section 7, item 1, options a, b, c.
7. **Is the founding seat only for people who lead others?** Section 7,
   item 2.
8. **A one-off annual price.** Monthly only is ruled and annual is open. A
   $99 prepaid year is an annual plan for 100 people. Confirm it does not open
   annual for everybody.
9. **Refunds and changes inside the prepaid year.** If a founder cancels in
   month 4, do they get anything back? If they drop to tier one, do they lose
   the seat?
10. **Does it stack with the referral?** A shared link already gives 25
    patterns (round PW). Default: yes, it stacks, since patterns are not money.

---

## 9. What to ask the founders, and when

The hundred are the first people anyone has paid for. Ask the questions that
get behaviour, not opinion:

| When | Ask | Not this |
|---|---|---|
| Before they see the price | "What would you have expected to pay for this?" | "Would you pay $99?" |
| After their first reading | "What did you do right after?" | "Would you pay for this?" |
| Any time, and at month 11 | "What would make you stop?" | "How long will you use it?" |

The month 11 answer is the renewal forecast. It replaces the 30 percent
assumption in section 4 with a real number.

---

## 10. How the model works, so it can be rerun

- One row per person per month, 36 months from the day checkout opens.
- Signups arrive evenly over the pace in section 4; founders are the first 100.
- Founder: pays $99 in month 1 (less refunds), nothing in months 2 to 12, then
  renews at the renewal rate and pays P a month, leaving at full churn.
- Next 200: pay 0.8P a month for 12 months, leaving at the offer churn; at
  month 13 a one-off step loss, then P a month at full churn.
- Full price: P a month from month 1, leaving at full churn.
- Realistic baseline: the share of each group that would have paid anyway,
  on full-price terms, at the same signup months.
- Card fee taken off every charge. Cost to serve left out (section 4).
- Monte Carlo: 10,000 runs, every range in section 4 drawn evenly, pace drawn
  from 3, 6, 9, 12 and 18 months.
