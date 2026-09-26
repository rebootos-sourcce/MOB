# Founding offers. The cascade, the seats, and the one number a person sees

**Status: design, 26 September 2026. Nothing here is built and nothing here
can be yet.** The owner asked for "a way to offer them offers" and said "that
needs a system". This is the system, drawn, with every place his dictation
admits two readings named as open rather than picked. It is logged as the
founding offer item in `TASKS.md` section FH.

**What this file is not.** It is not a price list. The prices for tiers one to
three are still open (`DECISIONS.md`, "Billing. Stripe, and where it is not"),
and every dollar figure below uses the recommended 12, 29, 59 and the ruled 99
from `DESIGN-economics.md`, labelled each time. If the prices move, the shape
of every table below holds and the decimals change.

**Three classes of figure, labelled every time.**

| Label | What it means |
|---|---|
| **ruled** | The owner's, recorded in `DECISIONS.md` |
| **recommended** | The team's number, not yet ruled. Here, tiers one to three at 12, 29, 59 |
| **judgement** | Reasoned, with the arithmetic shown |

---

## 1. His words, whole

From `TASKS.md` section FH, 26 September, kept verbatim because every
ambiguity below is a question about a specific phrase in it:

> "And the first 100 people to sign up for their tier get that tier for a
> year, get that tier for life. These are my committed guinea pigs, my angels.
> And then the first 100 people, who they send that to, get the first year at
> half off. And then the first year, that group sends out to, they get 25
> percent off, but not for the full lifetime, just for that year. They don't
> need to know all that, we can do all that in the background. Wherever these
> people land in those numbers, that offer would pop up. So we need a way to
> offer them offers. That needs a system."

The same paragraph opens with "We have to note that this is in an alpha
state," so the founding hundred are, on his framing, the alpha.

---

## 2. What is already ruled, which this has to fit inside

Nothing in this design reopens any of these.

- **Sight is not for sale** (ruled). Every tier sees the whole reading. An
  offer changes what a person pays and nothing else. It never changes what
  they see and never changes their allowance. `DECISIONS.md` also carries a
  later "sight by tier" entry that reads the other way; this design does not
  depend on which of the two stands, because an offer touches price only.
- **The allowance arrives monthly at any price** (ruled). A discounted year
  still grants month by month.
- **Two months free on annual is out** (ruled). Whether there is an annual
  plan with any discount at all is open and his. Nothing here assumes one.
- **Tier four is 99** (ruled). Tiers one to three are open, recommended at 12,
  29 and 59.
- **The referral is fifty patterns, capped at four a month** (ruled). The
  founding cascade is a second thing a shared link can carry, and whether the
  two stack is asked in section 11.
- **Stripe never appears in the app, and the store writes five fields onto
  the record and nothing else:** tier, status, granted, base, until (ruled,
  `DESIGN-billing.md`). An offer is a price. It lives in the store and in
  Stripe and never reaches `source.html`. Section 8 shows that `engine/plan.js`
  needs no change at all.
- **The name never leaves the device, and the funnel record is "not an asset,
  not a list, not a segment"** (ruled, "Privacy and the snippet" and "Data,
  ruled 18 September"). A list of the first hundred is a list by definition,
  so it cannot live on the funnel record. It lives on the billing side, keyed
  by account key, never by name, and is never joined to a reading.
- **A buying probability never sits beside a person's reading** (`BUYERS.md`).
  So an offer is never computed from coherence, band or buyer level. Section
  3.5 is why that needs saying.
- **No scarcity, no countdown, no strikethrough** (team position, not a
  ruling: `reviews/funnel-strategy.md` "no founding member deadline",
  `reviews/funnel-offer.md` item 3, `reviews/AD-account-help.md` 7.1). His
  founding offer is a real cap, which is not fake scarcity. His instruction
  that "they don't need to know all that" is exactly what keeps it from
  becoming a scarcity mechanic: nobody is ever shown a count. Section 9 holds
  the line.

---

## 3. The rule, reconstructed

### 3.1 Best reconstruction, in one paragraph

Three groups, and each one gets one offer. **Group one, the founders:** the
first hundred people to take a paid tier get that tier for life. **Group two:**
the first hundred people who arrive through a founder's link get half off
their first year. **Group three:** people who arrive through a group two
person's link get a quarter off their first year only. After that the chain
ends and a shared link carries only the ruled fifty pattern referral. A person
is never shown the cascade. They are shown one offer, with its terms, at the
moment they choose a tier.

Every clause of that paragraph has at least one reading it silently chose.
They are pulled out below.

### 3.2 Group one. "Get that tier for a year, get that tier for life"

Agreed that it is a self correction and that "for life" is the one he meant.
The contrast he draws later confirms it: group three gets its discount "not
for the full lifetime, just for that year", which only makes sense against a
group that does get something for the full lifetime, and group two's offer is
explicitly "the first year".

**What is less certain is what "get that tier" means.** The FH summary in
`TASKS.md` recorded it as "keep their tier's price for life", which is a price
lock. His words do not say price. Read literally, "get that tier for life" is
the tier itself, given. Three readings, and they differ by a lot of money:

| Reading | What a founder pays | Year one, tier two (recommended 29) |
|---|---|---|
| **a. Free for life** | Nothing, ever | 0 |
| **b. Price locked for life** | List price at signup, never raised | 348 |
| **c. Free first year, then locked for life** | Nothing in year one, then list at signup, never raised | 0, then 348 a year |

**The halving argues against b.** Put the three groups side by side on year
one: group two pays half, group three pays three quarters. If group one is
free in year one, the cascade is 100, 50, 25 percent off, which is a clean
halving and reads like it was designed that way. Under b it is 0, 50, 25:
**the founders pay full price while the people they invite pay half.** The
angels would be the only group paying list in the first year, which is the
reverse of "my angels". So a or c is the more consistent reading, and b is the
one the FH summary wrote down.

**The price lock on its own is also weak as a gift right now.** No price has
been published, and a subscription in Stripe already stays on the price it was
bought at unless somebody migrates it. A lock on a price that has never moved
costs nothing and gives almost nothing until the day prices rise.

Open, section 11, question 1.

### 3.3 "Sign up for their tier". Counted across the product, or per tier

| Reading | Founders | What it does |
|---|---|---|
| **Global** | 100 in total, spread across whichever tiers they pick | One small cohort. Simple to explain to yourself |
| **Per tier** | 100 on each paid tier, so 400 | Four cohorts. Each tier gets its own founders |

"Their tier" reads naturally either way: each founder picks the tier that is
theirs, or each tier has its own hundred. Not decided in the dictation.

**One consequence that follows from question 1, not from this one.** Under
reading a, free for life, a founder who can pick any tier picks tier four,
because the most expensive rung costs the same nothing as the cheapest. That
hands the cohort lead suite, the one rung that reaches other people's data, to
a hundred people who may lead nobody. `DESIGN-economics.md` held 99 partly
because "it stops tier four being bought by people who do not lead a cohort",
and free removes that filter. Per tier counting contains it (only a hundred
can be tier four founders); global counting with reading a does not.

Open, section 11, question 2.

### 3.4 The chain. The least clear part

"The first 100 people, who they send that to" is clearly a referral: group
two are people a founder sent the link to. "The first year, that group sends
out to" is not clear. "The first year" is probably the transcription of "the
first" and a number that did not land, the same shape as the sentence before
it, but it could equally mean "whoever that group sends it to during their
first year", which is a time window and not a count.

Two models, and both are drawn in full because he should see both.

**Model A, the chain.** What you get depends on who sent you.

    founder (no link, first 100)
       |  sends a link
       v
    group two: half off year one     (first 100 who arrive by a founder's link)
       |  sends a link
       v
    group three: quarter off year one (cap not stated)
       |  sends a link
       v
    the chain ends. the link carries the ruled fifty patterns only

**Model B, the waves.** What you get depends only on when you paid, counted
across everybody. The referral is how the word travels, not a condition.

    paid signup 1 to 100      founder
    paid signup 101 to 200    half off year one
    paid signup 201 to N      quarter off year one, N not stated
    after N                   list price

**Which fits his words.** "Wherever these people land in those numbers, that
offer would pop up" is about position in a count, which is B's whole
mechanism. But "who they send that to" and "that group sends out to" are both
about sending, which is A's whole mechanism, and B throws those two phrases
away. "They don't need to know all that, we can do all that in the
background" also fits A better: under B there is almost nothing to hide, while
A has a chain, three pools and a depth for every person, which is "all that".

**The judgement: A, with a hundred seat cap on each pool, is the reading that
uses every phrase he said.** The chain decides which pool a person is in, and
the count decides whether that pool still has a seat. "Land in those numbers"
then covers both. This is the reading the tables below use, and it is still
his to confirm, not ours to have picked.

Open, section 11, question 3.

### 3.5 Who "those numbers" are

Read here as the signup counts: the first hundred, the next hundred. It is
worth one line of confirmation because the product has another set of numbers
a person "lands in", the reading, and `BUYERS.md` grades buying probability by
coherence band. An offer priced off where somebody's reading lands would put a
market reading beside a person's own body, which `BUYERS.md` rules out. This
design never reads the reading. If that is not what he meant, nothing changes.

### 3.6 Five smaller gaps, each with the default this design assumes

Each of these is a real decision. The default is what the tables below assume,
and each is asked in section 11 rather than settled here.

1. **What counts as "sign up".** Default: the first successful payment, not
   account creation. Otherwise a hundred free accounts made in an afternoon
   fill the founding cohort with people paying nothing, and free for life on
   the free tier is not a gift. So a founder seat needs a paid tier.
2. **Is the group two hundred shared by all founders, or does each founder get
   some.** Default: shared, because he said "the first 100 people, who they
   send that to", plural. Section 6 argues the other way.
3. **Group three's cap.** He gave one for groups one and two and none for
   three. Default: a hundred, by the shape of the sentence.
4. **When a person qualifies for two things.** A founder's friend who arrives
   while founding seats are still open. Default: the better offer wins, so
   they take a founding seat.
5. **What ends the founding programme.** Default: only the hundredth seat. He
   tied the founders to the alpha, so the alpha ending could also close it.

---

## 4. The arithmetic

Per person, at the recommended 12, 29, 59 and the ruled 99. All judgement.

| Tier | List a month | Half off a month | Year one saved | Quarter off a month | Year one saved | Free for life, forgone a year |
|---|---|---|---|---|---|---|
| One | 12 | 6.00 | 72 | 9.00 | 36 | 144 |
| Two | 29 | 14.50 | 174 | 21.75 | 87 | 348 |
| Three | 59 | 29.50 | 354 | 44.25 | 177 | 708 |
| Four | 99 | 49.50 | 594 | 74.25 | 297 | 1,188 |

What each reading of group one costs, a year, every year:

    reading a, free for life, global 100, all pick tier four   118,800
    reading a, free for life, global 100, 25 on each tier       59,700
    reading a, free for life, per tier, 400 founders           238,800
    reading b, price lock                                            0 today
    reading c, free year one then locked                  a's figure, once

For scale, the full ladder was modelled at an upper bound of **102,800 a
month** (`DESIGN-economics.md`, simulated, labelled there as an upper bound).
Reading a, per tier, is about 19,900 a month of that, forgone for the life of
the product. Reading a, global, is 5,000 to 9,900 a month.

Groups two and three are one year each and then end, so they are bounded:

    group two, 100 seats, all tier one       7,200 once
    group two, 100 seats, all tier four     59,400 once
    group three, 100 seats, all tier four   29,700 once

**The number that matters most is in question 4.** If "the first 100 people,
who they send that to" means **each** founder's first hundred rather than a
hundred in total, group two is up to 10,000 people, and at tier one alone that
is 720,000 of first year discount. The two readings of that one comma differ
by a factor of a hundred.

---

## 5. What a person actually sees

The cascade is invisible, as he asked. What is visible is one offer, with its
terms, and the reason for it in plain words. The terms of a person's own offer
are not part of "all that": the price after the discount has to be shown
before the card is taken (`reviews/LEGAL-floor.md` section 8, California's
Automatic Renewal Law), and hiding it would be the one dishonest thing here.

**The decision, for one new paid signup, under model A.** Read top to bottom;
the first row that matches wins.

| Arrived with | Pool with a seat | Offer | What they see, once, on the tier page |
|---|---|---|---|
| Any link or none | Founding seats open | Founder | "Founding member. [Tier] for life." (wording follows question 1) |
| A founder's link | Group two open | Half off year one | "Half off your first year, through a founding member's link. [6] a month for twelve months, then [12]." |
| A group two link | Group three open | Quarter off year one | "A quarter off your first year, through a member's link. [9] a month for twelve months, then [12]." |
| A group three link, a spent pool, or no link | None | None | The list price. No line about an offer that is not there |
| A link that is unknown, revoked, or their own | Treated as no link | As the row above | As the row above |

**Under model B the table is one column.** The paid signup's position in the
count decides the row, and the link is only attribution for the fifty pattern
referral.

**What nobody is ever shown.** The seat count. Their own position in it. That
a pool exists. That a better offer existed and filled. A struck through list
price. Any date or clock on the offer. "You were number 87" is as much a
scarcity line as "13 left", just in the past tense.

**The sender is not named to the person who used the link.** The recipient
knows who sent it; the store does not need a name to say so, and holding one
beside a key is what the privacy ruling says not to do. "A founding member's
link" carries the same meaning with no name in it.

**What the sender sees.** One line where they share: "Your link gives the next
person who pays half off their first year." True only while it is true, and
section 6 is about making sure it stays true.

---

## 6. The one design choice this document argues for: allotments, not a hidden pool

Under a single hidden pool of a hundred, a founder tells a friend "use my
link, you get half off", and if the pool filled overnight the friend arrives
to the list price and the founder's word was wrong. The product would have
made its angels say something untrue to their own friends. And one founder
posting the link publicly can take all hundred seats in a day, leaving the
other ninety nine founders with links that silently carry nothing.

**An allotment fixes both.** Each founder's link carries a set number of
group two offers. The founder sees their own number, which is theirs and is
not a scarcity line aimed at a buyer, the same way an invitation count is not.
When it is spent, their share line says the link now carries fifty patterns,
and it is never wrong.

    one each    100 founders x 1  = 100 group two seats, his number exactly
    four each   100 founders x 4  = 400, matching the ruled four a month

This is a recommendation, not a reading of his words: his words say a shared
hundred. It is asked as question 4 with both costs beside it.

---

## 7. The life of one offer

    arrives            a link code in the address, or none.
                       nothing is logged. the code is carried, not recorded
         |
    takes the quiz     the code rides the funnel with the quiz record.
    and signs in       it is never written onto the funnel record itself
         |
    computed           the store resolves the code to a sender and a depth,
                       reads the pools, and picks the one offer (section 5)
         |
    held               the offer is reserved to this account for a hold
                       window. the pool counts it as taken while held
         |
         +--> hold lapses unpaid   seat returns to the pool. next visit
         |                         recomputes, which may now be list price
         v
    paid               checkout.session.completed. the hold becomes a seat.
                       the store writes the five plan fields, as today,
                       and the offer row, which the app never sees
         |
         +--> founder              lives on the account for life
         |                         (what survives a cancel: question 7)
         |
         +--> half or quarter      twelve discounted months
                  |
               month eleven        renewal notice with the new price,
                  |                by whichever channel exists
               month thirteen      list price. the offer row closes
                  |
               a new link          the person's own link carries the
                                   next depth, or the fifty patterns

**Why a hold, and why it has no clock on screen.** A person shown "half off
your first year" who comes back two days later to pay must not find it gone:
that is a bait and switch whatever the intention. So showing an offer reserves
it. The hold length is an engineering number, not a copy line, and it is never
printed, because a printed expiry on an offer is a countdown. A pool can
therefore run a few seats over its hundred for as long as holds are
outstanding, and that is the honest cost of never taking back an offer that
was shown.

**The seat is claimed atomically.** Two people paying at seat ninety nine and
a hundred at the same moment must not both become the hundredth founder, or
neither. One conditional write in the store, a count only moved if it is
still under the cap, decides it. This is the reason a browser cannot do it.

---

## 8. Where it lives, and why the single file cannot hold it

**What has to be tracked.**

- **A signup order shared by everybody.** "The first hundred" is one counter
  across every person who ever pays. A single file running in each person's
  own browser has no shared anything; each copy would believe it was first.
- **A referral chain that cannot be forged.** Depth is who sent the sender.
  Anything computed on the device is editable on the device: a person could
  write themselves in as a founder. The chain has to be held somewhere the
  person cannot write.
- **Seats claimed atomically,** as above.
- **A price applied at the payment processor.** The discount has to be on the
  subscription in Stripe, and only the store holds a Stripe key.
- **Counting scope,** global or per tier, which is a column on the pool.

**What the store holds, on the billing side, keyed by account key, never by
name, never joined to the story or the reading.**

    pool          kind (founder, half, quarter), scope (global or a tier),
                  cap, taken, closed
    link          code, owner account key, owner depth, allotment left
                  (if question 4 goes to allotments), revoked
    offer         account key, kind, pool, sender key, depth, tier and
                  price at claim, held until, claimed at, ends at
                  (none for founders)

**What Stripe holds.** One coupon per offer kind, attached by the store when
it mints the Checkout session, so the person never types a code and never sees
one, which is "in the background" done literally.

    founder, reading a    100 percent off, forever
    founder, reading b    no coupon; the store never migrates the price
    founder, reading c    100 percent off, twelve months; then never migrated
    half                  50 percent off, twelve months
    quarter               25 percent off, twelve months

Reading a is kept on Stripe as a zero charge subscription on purpose, rather
than comped by the store writing a plan directly. The billing ruling is one
writer of the plan, driven by Stripe's webhooks, and a second path that grants
a tier is the kind of thing that later grants one by accident.

**What the app sees: nothing new.** The record still carries tier, status,
granted, base and until. A founder on tier two looks exactly like anybody else
on tier two, because an offer changes a price and the app does not price
anything. `engine/plan.js`, the build, and the one network seam are all
unchanged. The only exception would be a founding mark shown in the app,
which is question 8.

---

## 9. Honesty floor

In this category these are disqualifying, not merely distasteful, and a
founding offer is exactly where they creep in. Each is out.

- **No count shown to a buyer.** Not "13 founding places left", not "you were
  number 87", not a progress bar filling up.
- **No clock.** No expiry on an offer, no "price goes up in", no date on the
  founding programme printed as pressure.
- **No strikethrough.** The discounted figure and the figure after it are
  stated as two prices in one sentence, "[6] a month for twelve months, then
  [12]", which is disclosure, not a slash through a number.
- **No pop up over the reading.** He said the offer "would pop up". It pops
  up on the tier page, where a price belongs, and once as a single line on
  arrival for somebody who came by a link and is expecting it. Never as a
  modal in front of a person's own reading: `reviews/AD-account-help.md`
  calls that the one refusal it will escalate over.
- **No offer that is shown and then taken back.** That is what the hold is
  for.
- **No renewal cliff by surprise.** The month thirteen price is on the offer
  line, in the consent step, and in a notice before it changes.

---

## 10. What has to exist first

Cross referenced against `CLAUDE.md`, "What this project is becoming", which
puts in scope "auth, paywall and tiers, push notifications, a points and
badge ladder, and a practitioner view", each "still needs designing before
building".

| Needed | In the fork's scope | Exists today |
|---|---|---|
| **Accounts and sign in.** A seat has to belong to somebody | Yes, "auth" | No |
| **The record store.** Cloudflare D1, ruled as the platform in `DECISIONS.md` "The stack" | Yes, "a record store" | Not live. The token is last in the sequence by his ruling |
| **The paywall.** Checkout, the five webhooks, idempotency, per `DESIGN-billing.md` | Yes, "paywall and tiers" | Designed, not built |
| **Prices.** A lock or a discount is a fraction of a number that does not exist yet | Yes, "paid tiers" | Tiers one to three open; the keying ruling blocks the list (`DESIGN-economics.md` finding 7) |
| **Referral links.** A code per account, carried through the funnel, resolved at sign in | Not named in the list; `TASKS.md` AK6 says it "needs a server, so it is behind the funnel work" | No. The ruled fifty pattern referral is waiting on the same thing, so one link carries both |
| **The quiz to app claim path,** so a code survives the quiz | Yes, "a web quiz as its own product flow" (`MILESTONES.md` M5, M6) | No |
| **The renewal disclosure and consent step,** with an offer variant | Lands with the paywall (`reviews/LEGAL-floor.md` section 8, block G) | Drafted for counsel, no offer variant |
| **A renewal notice channel** for the month eleven notice | Push is in scope; email is the funnel's one time code path | No |

**Not needed for this:** the points and badge ladder, and push as such. The
practitioner view only matters if tier four founders exist, which is
question 2.

**Where it sits in the build order.** After the paywall, not with it. The
paywall has to take a list price correctly before a store can take a fraction
of one, and founding offers are a set of rows and coupons on top of a working
checkout. Designed now so that the store's tables have room for it.

---

## 11. Open, and his

Each question carries the phrase it is about. Questions 1 to 4 decide the
shape; 5 to 8 are details that follow.

**1. What do the founders get?** You said: *"the first 100 people to sign up
for their tier get that tier for a year, get that tier for life."*

- **a. The tier free, for life.** Strongest gift and matches "my angels".
  Costs 59,700 to 238,800 a year forever depending on question 2, and invites
  everybody to pick tier four.
- **b. They pay, and their price never goes up.** Costs nothing today. But in
  year one the founders pay full while the people they invite pay half.
- **c. Free for the first year, then their price never goes up.** Makes the
  three groups 100, 50 and 25 percent off year one, which is the halving the
  rest of your sentence describes. Costs reading a's figure once.
- The team's backlog wrote this down as b. The words read closer to a or c.

**2. Is it the first hundred overall, or a hundred on each tier?** You said:
*"sign up for their tier."*

- **Overall.** 100 founders. Cheaper and a tighter group.
- **Each tier.** 400 founders, and each tier has its own. Under 1a it is the
  only way to stop all hundred picking tier four.

**3. The people your founders invite, and the people they invite. Which of
these did you mean?** You said: *"the first 100 people, who they send that
to, get the first year at half off. And then the first year, that group sends
out to, they get 25 percent off."*

- **A chain.** What you get depends on whose link you used. Founders' links
  give half off; those people's links give a quarter off; the chain stops
  there. The team reads it this way, because it uses "send" both times.
- **Waves.** What you get depends only on when you paid: first hundred are
  founders, next hundred half off, next group a quarter off, link or no link.
  Simpler, and a stranger with no link could get half off.
- And whether the quarter off group is capped at a hundred as well. You gave a
  cap for the first two groups and not the third.

**4. Is the half off hundred shared, or does each founder get some?** Same
phrase: *"the first 100 people, who they send that to."*

- **Shared, a hundred in total.** Costs at most 59,400, once. But one founder
  posting the link publicly can use up all hundred in a day, and the other
  founders' links then quietly give their friends nothing after they have
  said they would.
- **Each founder gets a set number.** One each is a hundred in total, which is
  your number. Four each is four hundred, which matches the four a month
  referral cap you already ruled. Every founder's link then always does what
  they told their friend. The team recommends this.
- **Each founder gets a hundred.** Up to 10,000 people at half off, 720,000 of
  discount at tier one alone. Named so it is not picked by accident.

**5. Does a founding place need a paid tier?** The team assumes yes. If free
accounts count, a hundred people can fill the founding group without paying
anything, and free for life on the free tier is what everybody already has.

**6. Does this stack with the fifty patterns a sender already gets?** Ruled:
*"The referral is fifty. Two full runs."* Either a link gives the sender fifty
patterns and the friend a discount, both at once, or the discount replaces the
fifty for as long as the link carries one.

**7. What does a founder keep if they cancel, or change tier?** "For life"
could be the person's life, or the life of an unbroken subscription.

- **The person keeps it.** They come back a year later and are still a founder.
  Matches "my angels".
- **It lasts while they stay.** A lapse ends it. Cheaper, and common.
- And on a tier change: whether the founding terms move to the new tier or
  stay pinned to "that tier", the one they signed up for. The team suggests
  moving with them, since charging a founder list price for upgrading punishes
  the thing you want.

**8. Should a founder know they are one, inside the app?** You said *"they
don't need to know all that"*, which the team reads as the chain and the
counts, not the fact of being a founder. A quiet mark in the profile, or
nothing at all. Anything shown in the app is the one part of this that would
touch `source.html`.

**And one to confirm rather than decide.** *"Wherever these people land in
those numbers"* is read as their place in the signup count, not their
reading. If it was ever meant as the reading, say so; the team would argue
against pricing off it, for the reason in `BUYERS.md`.

---

## 12. What the hundred are for, commercially

A founding cohort is paid for once and its value is what it teaches. His word
was "guinea pigs", so ask them the three questions that produce behaviour
rather than opinion, and ask them in this order:

- **Before they see their price:** "What would you have expected to pay?"
  Founders are the only group whose answer is not anchored by a list price,
  because under 1a or 1c they never pay one in year one.
- **After their first reading:** "What did you do immediately after?" Not
  whether they would pay.
- **At any point:** "What would make you stop?" The only reliable retention
  question, and for a founder on a free tier the only signal of retention that
  is not a payment.

These go to the hundred first because the hundred are the people the rest of
the ladder gets priced off.
