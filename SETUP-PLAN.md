# How to set up atuned.app for a person's first three hundred days

Written 27 September 2026 by the technical director seat, in answer to
`TASKS.md` round HI. It is written for the owner, not for an engineer. The
research behind it is in `ARCHITECTURE-RESEARCH.md` (round HF) and is not
repeated here. Where this plan uses a number from that document it says so.

His question, verbatim: "If I wanted to have this app set up for people to go
into the funnel, get into the app, use it persistently for three hundred
days, what's the best solution that I should be doing as a developer, how
should I actually set this up so that the software on atuned.app is
efficient, optimised and set up the right way, ready to accept a paywall, can
save files locally, can send files to the database, we've got a database in,
or a developer in, so we can review the work that needs to be done or review
customer analytic data."

## The straight answer

**One app on the person's device that saves locally and works without
signal, one server with one database behind it that keeps the safe copy and
decides who has paid, and one private team console on that same server.
Nothing more.** That is the right setup for a company of your size, and most
of it already exists as working code. The work left is connecting the pieces
and putting them live, not inventing them.

- The app you have been reviewing (this repository) already saves locally.
- The server (`reboot-os`) already has accounts, a database, encrypted
  storage, a sync that keeps the phone and the database in step, morning push
  notifications, and a support console. It has never been put live.
- What is missing: the app you have been reviewing does not talk to that
  server yet, web payments (Stripe) are not wired, and the console cannot yet
  show how people use the product over time.
- **From your go, a real person can sign up, pay and be seen in the console
  in roughly three to four weeks of engineering. The full plan, including
  taking the paid method out of the file a person holds, is roughly five to
  eight weeks.** The timeline is at the end, and the arithmetic is shown.

One thing said plainly, because you asked about three hundred days. This
setup makes sure a person's record survives three hundred days and lets you
see whether they are still there. It does not make them stay. That is the
loop, discover, play, flow, embody, and the content that feeds it. Today the
team's retention numbers are a model (`RESEARCH-90day.md` says so: "Retention
is model"). The console below is what turns them into measurement.

## 1. "Save files locally" and "send files to the database": yes, both, at once

This is called local-first: the device is the working copy and the server is
the safe copy. It is exactly what the staged plan already builds toward, and
the sync that does it is already written in `reboot-os`.

**What "locally" means today.**
- Everything a person enters is saved in the browser on that one device.
- It works with no signal and no account. Every reading is worked out on the
  device in about 1.9 thousandths of a second (measured in
  `ARCHITECTURE-RESEARCH.md`), so nothing ever waits on the internet.
- Capacity is not a problem. A year of heavy use comes to well under one
  megabyte against the browser's five megabyte allowance. Measured twice,
  in `REVIEW-pass2.md` and again when the saved history gained all 21 laws
  (`TASKS.md`).

**Why locally alone does not survive three hundred days.** This was not on
any list before today, and it is the most important point in this section.
- It lives in one browser on one device. A new phone, a second laptop, or
  clearing the browser's history and data, and it is gone.
- **Safari deletes it on its own.** Since 2020, Safari on iPhone and Mac
  erases everything a website has stored after seven days of the person using
  Safari without opening that site. A person who takes a ten day break in
  month four comes back to an empty app. The one exception is a site the
  person has added to their home screen, which keeps its own clock
  ([WebKit's announcement](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/);
  [a summary with the details](https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/)).
- So for a three hundred day product, the account and the database are not
  an extra. They are what makes day three hundred possible.

**What changes once the server work lands.**
- Nothing about how the app feels. It still saves on the device first and
  still works on a train with no signal.
- When the person is signed in and has signal, every save is also sent to the
  database, and opening the app on another device pulls it down. The newer
  version wins and nothing is blended, which is how the `reboot-os` sync
  already behaves (`atuned/src/42b_cloud.js`).
- On the server the record is locked with encryption, so a stolen copy of
  the database cannot be read (`ARCHITECTURE-RESEARCH.md` section 3).
- A person with no account keeps working exactly as today, locally only.

**When the paywall can actually be enforced.**
- The paywall screen already exists in this app, built and tested, and has
  never been shown to you (round GX). Today it is decided on the device,
  which means anyone who edits the file in their browser can unlock it.
- It becomes real at **stage 3** of the staged plan: Stripe takes the
  payment, the server records who has paid, and the app asks the server
  rather than deciding for itself. That is about three to four weeks from
  your go.
- It becomes protected at **stage 4**, when the paid part of the reading is
  taken out of the file a person holds altogether.

## 2. "A developer in, to review the work and the customer data": the console

**What already exists.**
- **The support console.** `reboot-os` has one, at `/admin` on the server
  (`atuned/server/src/ops.js`). It looks up one account by email and shows
  its plan, how many entries of each kind it has, its sign in and purchase
  history, and its crash reports. It can set a plan and delete an account on
  request. By design it never shows what a person wrote, only counts.
- **The crash list.** The same console groups the app's crash reports from
  the last seven days, most frequent first.
- **The backlog page.** `BACKLOG.html` in this repository, built from
  `TASKS.md` by `tools/backlog.js`. It is the "review the work that needs to
  be done" half, and it exists today.
- **The feedback box.** This app already has an outbox for questions, bug
  reports, ratings and feedback (`atuned_src/engine/outbox.js`). It queues
  them on the device and says "queued", honestly, because there is nowhere
  to send them yet.

**What is missing.** Anything about how people use the product over time. The
server records sign up, sign in, purchase and export, and nothing about
whether a person opened the app today or did a release. You cannot yet ask
"of the people who joined in October, how many are still here at day thirty,
day ninety, day three hundred". That is the number this whole question turns
on.

**What the console should show. One page, four panels.**

1. **Are people staying.** Of each week's sign ups, the share still active at
   day 7, 30, 90, 180 and 300. This is called a retention table and it is the
   single most important chart for this product.
2. **Where people drop.** Quiz taken, account made, first story, first
   release, first ritual, paywall seen, paid. How many reach each step.
3. **Money.** People on each plan, new and cancelled this week, from Stripe.
4. **Health and work.** The crash list that already exists, the feedback and
   bug reports from the outbox, and the backlog page, behind the same login.

**How to count usage without holding anything private.**
- The app sends counts, never content: "opened on this day", "did a
  release", "saw the paywall". No story text, no body location, no answers.
- The counts ride along with the sync the app already does, so there is no
  second channel and no extra network traffic.
- **No outside analytics service.** No Google Analytics, no Facebook pixel,
  no tracking script from anyone. This keeps the file free of outside code,
  and it matters legally: the US regulator fined the online therapy company
  BetterHelp 7.8 million dollars for passing health questionnaire data to
  Facebook and other advertisers
  ([FTC, BetterHelp](https://www.ftc.gov/news-events/news/press-releases/2023/07/ftc-gives-final-approval-order-banning-betterhelp-sharing-sensitive-health-data-advertising)),
  and penalised GoodRx for the same thing under the health breach rule
  ([FTC, GoodRx](https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising)).
  A tracking pixel on a somatic self report app is that exact risk.
- **Start counting before the first real person signs up.** A person's day
  three hundred is measured from their day one, and a day that was not
  counted cannot be counted later.

**Totals or individuals.** The console shows totals by default: numbers across
everyone, never a named person's usage. Looking up one person's usage is
possible but is a consequential grant, the same kind `CLAUDE.md` already
names for practitioners, and it is your call (question 2 below). This also
settles the question `DECISIONS.md` left open, whether the developer view is
"a separate build from day one or a tab that is stripped at build time": it
lives on the server, so it can never ship inside a person's app.

**Locking the door.** Today the console opens with one shared key. It should
sit behind Cloudflare Access, which gives each team member their own login
and records who did what. It is free for up to fifty people and about an hour
to set up (`ARCHITECTURE-RESEARCH.md` section 3, gap 4).

**How much work.** Roughly one week, by estimate. The basis: the console
page, the account lookup, the crash list and the audit log already exist, so
the work is one small table of daily counts, one route to receive feedback,
the four panels, and the login gate.

## 3. "Efficient, optimised and set up the right way": what that means for you, now

For a product at your stage, one team, real working code, no revenue at
scale yet, "the right way" is concrete:

- **One app, one server, one database.** Not a separate service for sign in,
  another for billing, another for readings. The research in
  `ARCHITECTURE-RESEARCH.md` section 1 is unanimous that splitting at this
  size makes a product slower, more expensive and harder to change.
- **The device does the drawing and the everyday reading.** That is why a tap
  never waits. The server does only what must not be trusted to a device:
  who has paid, the paid depth of the reading, and the safe copy.
- **Send less.** The app arrives as one packed file of about 417 kilobytes,
  compressed from about one megabyte. No outside scripts, fonts or trackers
  are fetched.
- **The server decides the money.** Never the device. This is the industry's
  standard security rule (OWASP, cited in `ARCHITECTURE-RESEARCH.md`
  section 2).
- **Measure, do not guess.** The app already has automated checks that run
  before every build. The console adds the other half: what real people do.

What "the right way" does not mean at this stage: rewriting the app,
switching database providers, splitting into many services, or buying
infrastructure for a million users. Each of those costs weeks and buys you
nothing a person would notice.

## 4. The timeline

From your go. Stage numbers are the ones in `ARCHITECTURE-RESEARCH.md`
section 4, and the estimates are that document's, except where marked.

**Already done.**
- The funnel pages: landing, quiz, reading, buy (`funnel/`).
- The app, saving locally, with onboarding and a paywall screen built.
- The server code, with accounts, sync, encryption, push and a support
  console, never put live.

**Not built yet, and not engineering.** A tutorial. Sign in inside this app.
A lawyer's view on consent to collect health data (`SECURITY-IP.md`).

| When | What happens | How long | What a person can do after it |
|---|---|---|---|
| This week | **Stage 0, yours.** The decisions listed below. No engineering | Your time | Nothing new yet |
| Week 1 | **Stage 1.** The server goes live on atuned.app, locked down: the method's tables behind sign in, the console behind per-person login. Daily usage counting switched on | 2 to 3 days, plus about 1 day for the counting (mine, estimate) | Nothing visible yet, but the database is live and counting |
| Weeks 2 and 3 | **Sign in and sync inside this app**, carrying the funnel's quiz record in at sign in. **Stage 2**, this app's reading engine running on the server | Several days for sync (`REBOOT-OS-STATUS.md`), 3 to 5 days for stage 2 | Sign up from the funnel, use the app, and their record survives a new phone or a Safari wipe |
| Weeks 3 and 4 | **Stage 3.** Stripe, and the server decides who has paid | 3 to 5 days | Hit the paywall and pay, for real |
| Week 5 | **The console's four panels**, backlog and feedback included | About 1 week (mine, estimate) | The team sees who is staying, where people drop, and what is breaking |
| Weeks 6 to 8 | **Stage 4.** The paid depth of the reading removed from the file a person holds | 1 to 2 weeks | Nothing new to see. Your method is no longer in their hands |
| Later, your call | **Stage 5**, stories read on the server. **Stage 6**, the pool of real phrasing | 1 to 2 weeks, plus a lawyer. Stage 6 is ongoing | Nothing new to see. The method gets harder to copy and keeps improving |

**The arithmetic.** `ARCHITECTURE-RESEARCH.md` totals four to seven weeks for
its stages. It does not count the sync port inside this app (several days,
from `REBOOT-OS-STATUS.md`) or the console (about a week, my estimate). Adding
those gives **roughly five to eight weeks in all, with a real, paying,
counted person possible at about three to four weeks.** These are the team's
estimates, not quotes, and they assume stage 0 is cleared first.

**What would move it.** If you choose to reconcile the two engines before
anything goes live (question 1, option c), add a week or more at the front.
If GitHub billing stays locked, nothing deploys at all.

## What I need from you

None of these is answered for you by default.

1. **Which app goes live first?** Asked before in `REBOOT-OS-STATUS.md`: "The
   server already talks to the Atüned app in `reboot-os`. The MOB app you have
   been reviewing has none of that code, and the two apps calculate some
   numbers differently (29 places)." This is the one decision the whole
   timeline waits on.
   - (a) This app, the one you have been reviewing, connected to the server.
     The timeline above assumes this.
   - (b) The `reboot-os` app first, because its sign in and sync already
     work. A few days sooner, but it is not the app you have been reviewing,
     and its numbers differ from this one in 29 places.
   - (c) Reconcile the two engines first. A week or more added before stage 1.
2. **Should the console ever show one named person's usage, or only
   totals?**
   - (a) Totals only. Nothing to consent to beyond sign up. You cannot answer
     "what did this particular person do before they cancelled".
   - (b) Totals, plus one person's usage counts (never their writing) when
     looked up by email. Needs a line in the consent at sign up and a lawyer's
     read. The support console already does a version of this for plan and
     crashes.
   - (c) Per-person drill-down only for people who opt in, for example beta
     testers. Most private, smallest set of data.
3. **Who on the team gets a console login?** Each name gets their own login
   and everything they do is recorded against it. A list of names, or "only
   me for now".
4. **Should the app ask people to add it to their home screen?** On iPhone
   this is the only way to stop Safari erasing someone who has no account
   after a week away.
   - (a) Ask during onboarding, on day one. Most protection, one more thing
     to read on the first day.
   - (b) Ask after their first release, when they have something worth
     keeping. Less friction, a small window of risk.
   - (c) Do not ask. Rely on sign in and sync. Anyone who never signs in can
     lose everything after a week away.
5. **Stage 0, already asked and restated here so you do not have to find
   them.** Each is waiting on you, and none is engineering.
   - Make the repository private. It is public today with the source, every
     ruling and your book in it. Settings, then General, then Change
     visibility.
   - Cloudflare, confirmed? You said "Cloudflare, for now, kept" on 25
     September and "I said Supabase" on 27 September. Cloudflare is live in
     days; Supabase is one to two weeks of rebuilding first.
   - Where your first users live: US west, US east or Europe. Decided once,
     before the database is created.
   - A Cloudflare account, and whether you run one command or give the team a
     key. About fifteen minutes.
   - Who can sign in to GitHub as `rebootos-sourcce` and clear the billing
     lock. Until then nothing deploys.
   - The domain spelled exactly: `atuned.app`, one t, is what the server is set
     to.
   - A Stripe account in the company's name, for stage 3.

## Sources

Outside sources new in this document:
[WebKit, Full third-party cookie blocking and more](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/);
[Michael Tsai, Safari 13.1 and the seven day storage cap](https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/);
[FTC, BetterHelp final order](https://www.ftc.gov/news-events/news/press-releases/2023/07/ftc-gives-final-approval-order-banning-betterhelp-sharing-sensitive-health-data-advertising);
[FTC, GoodRx](https://www.ftc.gov/news-events/news/press-releases/2023/02/ftc-enforcement-action-bar-goodrx-sharing-consumers-sensitive-health-info-advertising).
These were found through web search extracts, not fetched in full, for the
reason `ARCHITECTURE-RESEARCH.md` gives. Every other claim rests on that
document, `REBOOT-OS-STATUS.md`, `SECURITY-IP.md`, or the code named beside it.
