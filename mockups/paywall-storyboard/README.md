# Paywall and cancellation storyboard

Asked by the owner on 17 October: "There are full screens that I haven't
approved yet. Can you show me the paywall image? And I also want to see what
the cancel process is like. You can put that in the storyboard."

**Open `index.html`.** It is one file with every picture inside it. The arrow
keys step through the frames, D and P switch between desktop (1600 wide) and
phone (390 wide), and each frame has its caption beside it. The pictures are
also in `shots/` as PNG files.

**What was photographed.** The current build, main at `387c94d0`, which is the
commit atuned.world published on 16 October (deploy run on push, green). It was
driven in a real Chromium the way the gates `tests/quit.js` and
`tests/locks.js` drive it. The server was a stub that answers in the live
server's own words, copied from Reboot-OS main (`atuned/server/src`), so a
frame shows what atuned.world says today. The real server was never asked.
`capture.js` takes the pictures and `build.js` makes `index.html`; both can be
run again on a later build.

**What the state words mean.**

| Word | Meaning |
|---|---|
| LIVE | Works like this today on atuned.world. |
| CLOSED | The screen is real and live. What it leads to, paying, is switched off on the server today (the setting `STRIPE_BILLING_ENABLED` is `0`), so nobody can pay and nobody is on a paid tier. |
| NOT BUILT | Nothing in the product does this yet. |
| DRAFT | Written, but not on atuned.world and not linked from the app. |
| NOT OURS | Stripe's own page. Stripe is the payment company. Our code does not draw that page, so it cannot be photographed from here. |

## Every frame

A pattern is one line the app says during a release. A tier is a paid plan:
free, then tiers one to four. Stripe is the company that takes the card.

| # | Frame | State | Presses |
|---|---|---|---|
| **A** | **The paywall, before paying** | | |
| A1 | A free person meets a locked layer on the Field: grey button, padlock, a box saying what is locked and which tier opens it, See tiers | LIVE | |
| A1b | The Character page, locked as a whole page | LIVE | |
| A2 | The release panel when the allowance is spent: "Nothing left to open", Close or See the tiers | LIVE | |
| A2b | See the tiers lands on Billing at the ladder | LIVE | 1 |
| A3 | Billing for a new free person: plan, gift left, what they can see, Manage billing | LIVE | 2 from anywhere (profile button, Billing) |
| A3b | The tier ladder as a free person: your tier, what is locked, what every tier gets, one row per tier with price and Move to | LIVE | |
| A3c | The whole Billing page top to bottom, the ladder side by side | LIVE | |
| A3d to A3f | The ladder as a person on tier one, two and three | CLOSED | |
| A4 | Pressing Move to tier one today: the server says "Paid checkout is not open in this release yet." Nothing is charged | CLOSED | 1 |
| A4b | The same press signed out: "Sign in first." | LIVE | 1 |
| A4c | What the ladder's foot says before the press | LIVE | |
| A4d | Manage billing for someone who never paid: "There is no paid plan on this account yet" | LIVE | 1 |
| A5 | The buy page on the website, as a stranger sees it. No buy button anywhere | LIVE | |
| A5b | The buy page's closed line: "Checkout is not open yet" | CLOSED | |
| A6 | The gift, on the release panel | LIVE | |
| A6b | A worked example (a sample person in the app) shows every paid layer to a free person | LIVE | |
| A6c | A founding offer | NOT BUILT | |
| A6d | A seven day pass or trial | NOT BUILT | |
| A6e | The starter gift, a hundred patterns | LIVE | |
| **B** | **The cancellation** | | |
| B1 | Billing for a person paying for tier one | CLOSED | 2 to reach it |
| B2 | Manage billing opens Stripe's page, where the plan is stopped | NOT OURS | 3 from Billing (Manage billing, Cancel, confirm), and 1 more to come back |
| B3 | Back from Stripe: "Tier one stops on 1 Nov 2026. It stays on until then", and Billing shows the end date | CLOSED | |
| B3b | Quitting altogether: Delete this account, under Account, not under Billing | LIVE | |
| B3c | The confirm before deleting, in the browser's own box | LIVE | |
| B4 | The receipt after deleting: what was stopped, removed and kept | LIVE | 3 from Billing (Account, Delete, OK) |
| B4b | Billing after deleting: signed out, Free | LIVE | |
| B4c | The other ending: the paid month runs out, "Tier one has ended, so this record reads Free now." | CLOSED | 0, it happens on its own |
| B5 | Afterwards: the Field on free again, locked, with everything still there | LIVE | |
| B6 | The seven day refund, written only in the draft terms | DRAFT | |
| B7 | Cancelling without the app: Help has no email address and no billing line | LIVE | |
| B7b | Cannot sign in: the forgotten password answers "The server cannot send mail yet." | LIVE | |

## Is any step a dark pattern

A dark pattern is a screen built to make leaving hard: hiding the way out,
guilt, delay, or an offer to stay pushed in front of the exit. The rulings
forbid them ("A cancellation destroys nothing"; the ladder's own code rules out
badges, struck prices, countdowns and preselected tiers). Judged honestly:

| Step | Hidden | Guilt | Delay | Offer to stay | Verdict |
|---|---|---|---|---|---|
| Stop the plan (B1 to B3) | No. Manage billing is the first button on Billing and the line under it says "or stop". But the word cancel appears nowhere in the app, and the button does not say stop. | No | No. It stops at the end of the paid month, and access stays until then. | None. Stripe's page is set up with no reason survey and no offer (Reboot-OS `stripe-setup.yml` line 95). | **Passes**, with the label caveat. Stripe's page itself is not verified live. |
| Delete the account (B3b to B4) | Partly. It is under Account, not Billing, and Billing never mentions it. | No | No | None | **Passes**, with two gaps: the confirm does not say the rest of the paid month is lost (a delete stops the plan today with no refund of the days left), and the draft privacy page sends people to "Settings, Privacy, Delete account", which does not exist. Privacy holds a different Delete that wipes only this browser and says nothing about the plan still charging. |
| A person locked out (B7, B7b) | **Yes.** The reset email cannot be sent, the app shows no email address, and a Help message carries nothing about who sent it. | No | **Yes**, until somebody reads a Discord message | None | **Fails.** Not built to trap anyone, but the effect is the same: a person who forgets their password has no way shown to stop paying. |
| The refund (B6) | **Yes.** The seven days are only in a draft page that is not served or linked. | No | No | None | **Fails** as a disclosure. The terms draft itself marks "the same words must go into Stripe's settings and the buy page". |

These do not bite today only because checkout is closed and nobody pays.

## What the owner has never approved

Compared with `DECISIONS.md`. Ruled by him, and built as ruled:

- The ladder: free at ten patterns a week, tiers one to three at 400, 800 and
  1,200 a month, tier four the same as three plus the lead suite.
- The prices: 12, 29, 59 and 99 dollars a month (1 October).
- Sight by tier: tier one adds saboteurs, two adds complexes, three and four add
  hyper complexes and character; the point cloud at tier three (1 October).
- The lock: "grayed out ... a little lock over it ... a little description of
  what's locked, and where to go to unlock it, with a button that takes them to
  an upgrade." The upgrades page "shows them which tier they currently have, and
  then shows you the benefits of going to the other tiers."
- The gift of a hundred patterns, and worked examples on tier four sight.
- "A cancellation destroys nothing." Refund within seven days. Retention 24
  months after a delete (accepted). "If they want to quit the software, that the
  cancellation."

Never shown to him, all a seat's draft:

- Every sentence on Billing, the ladder rows, the lock boxes, the spent release
  panel, the delete confirm and the receipt.
- The layout of Billing, and the ladder's place under it.
- The closed checkout sentence. It was written by a seat on the server.
- Tier four closed with "Opens with the lead suite" (the lead's ruling, round PK,
  not his).
- How Stripe's page is set up: stop at the end of the month, change tier with a
  part month charge or credit (Stripe calls it proration), card, invoices.
- That deleting the account stops a paid plan at once and refunds nothing of the
  month left.
- Delete this account living under Account, and the browser's own grey confirm
  box ("This page says") rather than one in the product's look.
- The masks at tier three (proposed, still open).
- The buy page, apart from the prices and his closing lines.
- The refund wording (draft terms, no lawyer yet).
- Not pictured, because nobody can reach it while checkout is closed: the
  welcome after paying (his ruling, round OX, built in `ui/auth.js`
  `paidWelcomeOpen`, line 1007).

## Words that are not in his voice, or break the house rules

The voice check (`python3 .claude/skills/atuned-voice/check.py --line`) was run
on twenty key lines. All twenty passed its hard rules. It cannot judge meaning,
and it says so. These are the ones that fail a rule a person can see:

1. **"Paid checkout is not open in this release yet."** (A4) In this product a
   release is the practice itself. Here it means a software version. One word,
   two meanings, on the one screen where a person is trying to pay.
2. **"See tiers" and "See the tiers"** (A1, A2) are two labels for the same
   button.
3. **"Invoices live with whoever takes the payment, which is never this file."**
   and the row value **"held by the processor"** (A3c). "This file" is an
   engineer's word for the app, and "processor" is jargon. The voice check
   flags this line's gloss rate at 50 percent against a house rate of 0.3.
4. **"the record carries no customer number"** (A3, B1) and **"New ground"**
   (the Billing row label) are team words with no meaning beside them, which
   the unpack every symbol ruling (round PO) fails. `ui/plans.js` itself says
   new ground is "the team's word" and swaps it for patterns on the ladder, but
   the row above still says it.
5. **The receipt says "linked by that random account ID"** (B4) with nothing
   before it for "that" to point to. The live server now deletes the first
   visit record and says so in a list the app does not read (`removed`), so
   the line that used to introduce the ID is gone, and the person is never
   told the first visit was deleted. `tests/quit.js` still stubs the old
   server answer, which is why no gate saw it.
6. **The receipt and the confirm name no length of time.** The ruling is 24
   months; the draft privacy page still says "[PLACEHOLDER: months]" for the
   same list.
7. **The buy page says "Ten a week against a run of 25 means one release every
   two and a half weeks"** (A5). The app says the opposite on Billing: "Ten
   patterns a week ... Two releases at one address". The app is right: a run
   costs what it opens, from four patterns.
8. **Headings print in title case** ("Your Plan", "The Tiers", "Account
   Deleted", "Password Reset") because one style rule capitalises every word
   (`atuned_src/shell/head.html` line 1298). The voice rules say sentence case.

## The three changes to make first

1. **Put the way out and the refund where the money is.** On Billing, name the
   button for what it does ("Change or stop your plan"), and add one line:
   "Charged in the last seven days? Write to hello@atuned.world and we refund
   it in full." The same line goes on the buy page and in the delete confirm,
   and the confirm says the rest of the paid month is lost. Serve the terms
   page (branch `claude/legal-pages`) and link it from Billing.
2. **Give a locked out person a door.** In Help, a row "Billing and cancelling"
   with the email address and what to put in the message. And set the mail key
   on the server so the password reset sends, which is a setting only the owner
   can paste.
3. **Fix the four sentences that are wrong today:** the closed checkout line
   ("Paying is not switched on yet. Nothing was charged."), the receipt's
   dangling "that random account ID" plus a line saying the first visit was
   deleted and how long the dated list is kept, the buy page's "every two and a
   half weeks", and one label, See the tiers, on both buttons.

## Run it again

    ./atuned_src/BUILD.sh
    NODE_PATH=/opt/node22/lib/node_modules \
      flock -o -w 3000 /tmp/atuned-browser.lock \
      node mockups/paywall-storyboard/capture.js
    NODE_PATH=/opt/node22/lib/node_modules \
      flock -o -w 3000 /tmp/atuned-browser.lock \
      node mockups/paywall-storyboard/build.js

`capture.js` takes an optional path to another build. `shots/frames.json` holds
the exact words each frame showed, read off the page during the capture.
