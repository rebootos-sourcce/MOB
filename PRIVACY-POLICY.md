# Privacy

Last changed 16 October 2026.

## 1. Who we are

Atüned is made by Tula Unified LLC, 1634 West 39th Place, Los Angeles, California 90062, United States. On this page, "we" and "us" mean that company.

This page covers the app at atuned.world/atuned.html, the other pages on atuned.world, and your account. It says what stays on your device, what leaves it, which companies get it, what our server keeps, and how to get a copy or delete it. The [Terms](terms.html) are the rules for using Atüned.

Write to hello@atuned.world about anything on this page.

## 2. The short version

- What you type in the app is saved in your browser, on your device. That includes your name, your birth details, your stories and your answers.
- The name you enter never leaves this device.
- A first visit sends our server a random code made for this browser and the topic you pick, and later a mark for each step you finish.
- An account sends our server your email and your password.
- The voice that reads a release sends each line it speaks to ElevenLabs, a company that turns text into speech. The voice is on unless you turn it off.
- A few other companies help run Atüned. Section 5 names every one, with what it gets.
- We never sell your data. We do not use it for ads. No model is trained on what you write.

## 3. What stays on your device

Everything you enter in the app is saved in your browser's storage. Browser storage is a small space the browser keeps for one website, on your own device. We do not use cookies.

It holds:

- the name, sex, date, time and place of birth you enter
- your answers to the questions
- your stories, exactly as you typed them
- the imprints, which are the patterns the app found in your stories
- the snapshots, which are saved pictures of your field over time
- the avatar and the purpose you set
- the name of your plan, and never a card

We do not have a copy of any of it. If you clear your browser's data or lose the device, it is gone, unless you copied it with Export this record (section 8).

Nobody else can see it. The app has no way to show your record to anyone yet. If we add one, it will work only after you say yes, it will list who can see what, and one press will take it back.

The free quiz on atuned.world keeps your answers in your browser too, so you can stop and come back. The quiz sends nothing. A story typed into the quiz is held only while the page is open. When the quiz opens the app, your answers ride in the link after a # sign, and a browser never sends that part of a link anywhere.

The app and the pages load no ads, no tracking tools, no outside fonts and no outside scripts. The Analytics page in the app is drawn on your device from your own snapshots.

## 4. What leaves your device, and when

| When | What is sent | Who gets it | Why |
|---|---|---|---|
| You open the app for the first time, and the opening starts | A random code made for this browser. Then the topic you pick under What brought you here, such as grief or money. Then a mark when you finish the opening, finish your first release, or answer What changed. What you answered is not sent. | Our server, which keeps it in a database run by Supabase | So this first visit, and the starter gift that comes with it, can join your account if you make one. The starter gift is a set of free patterns to release. |
| You make an account or log in | Your email and your password. Then the random code from your first visit, which joins the topic and the marks to your account. | Our server, run by Cloudflare | To open your account and keep you logged in. |
| You open the app while logged in | Your sign in, which is a long random key our server gave you | Our server | So the app shows your plan. |
| You press Forgot your password | Your email | Our server, then Resend, a company that sends email | Resend sends a link to that email. The link works once, for one hour. |
| The voice reads a release | Each line it speaks. A line names one of your patterns, such as "that I am completely alone and nothing is holding me". If you are not logged in, also a random code for this browser. | Our server, which passes the line on to ElevenLabs | To say the line out loud. ElevenLabs gets the line and nothing that names you: no email, no account and no code. Turn Voice off in the release panel and the line shows on the screen instead. |
| You press Record to speak a story | The sound of your voice | Your browser's maker, and not us. Chrome sends it to Google and Edge sends it to Microsoft. Other browsers may do the same. | To turn what you say into text. We never get the sound. Type instead and nothing is sent. |
| You send a comment, a question, a report or a rating from Help | What you typed, or your answers to the rating questions. With it go the day, the app's version, whether you are on a phone or a computer, whether the screen is wide or narrow, and the band your coherence reading sits in, such as low or high. Your email, your name and your account do not go with it. | Our site, run by Cloudflare, which posts it to a channel on our Discord server. Discord is a chat app, and our team reads that channel. | So our team can read it. It does not name you, so we cannot write back to it. Email us (section 15) if you want an answer. |
| You pay for a plan. Paid plans are not open yet. | When they open: your account code, the plan you pick and your email, for the receipt. You type your card on Stripe's own page. | Stripe, a company that takes card payments | To take the payment. We never see your card number. |
| You write to us | What you write, and your email | Us | To answer you. |

The topic you pick can say something about how you feel, such as anxiety, grief or pain. We treat it as health information (section 9).

Every time your browser reaches our site or our server, it carries your IP address, which is the number that names your internet connection. Cloudflare sees it on every request. Our server uses it for two things only. It counts failed log in tries, and those counts are deleted after 15 minutes. And it caps how much the voice can speak in one day: the address is scrambled together with the day's date first, so it cannot be followed from one day to the next, and that count is deleted after about two days.

## 5. The companies that help run Atüned

- **Cloudflare** hosts atuned.world, runs our server, and holds our main database. It sees every request, with your IP address.
- **Supabase** runs the database that holds your first visit: the random code, the topic, the marks and the starter gift.
- **ElevenLabs** makes the spoken voice. It gets each line being spoken and nothing that names you.
- **Resend** sends the password reset email. It gets your email address and the link.
- **Discord** holds what you send from Help, in a channel our team reads.
- **Stripe** will take payment when paid plans open. It will get your account code, your plan, your email and your card.
- **Your browser's maker**, such as Google or Microsoft, turns speech into text when you press Record.

Each company handles what it gets under its own privacy policy. They are based in the United States and may handle data in other countries too. If you live outside the United States, what you send goes to the United States.

## 6. What our server keeps

- **Your account.** Your email, your password, your plan and the day the account was made. The password is kept as a one way scramble, so nobody can turn it back into the password.
- **Your sign ins.** Each one is kept scrambled too, and ends after 90 days or when you sign out.
- **Your first visit.** The random code, the topic, the marks and the starter gift, at Supabase.
- **An activity list.** The dates the account signed up, logged in, reset its password, opened billing, paid, asked for a copy and was deleted. It sits under a random account code.
- **Voice counts.** How many letters the voice spoke each day, for about two days. Not the lines.
- **An error log.** What broke on our server and where. It holds no story text.

Our server does not keep your name, your birth details, your stories or your answers. Research sharing is off and is not offered. Nobody at Atüned can see what stays on your device. The people who run Atüned can see what our server keeps, so they can fix faults and answer you.

## 7. How long we keep it

| What | How long |
|---|---|
| What is on your device | Until you delete it or clear your browser's data |
| Your account: email, scrambled password and plan | Until you delete the account |
| A sign in | 90 days, or until you sign out |
| A password reset link | One hour, or until it is used |
| Counts of failed log in tries | 15 minutes |
| Voice counts | About two days |
| A first visit that joined an account | Until you delete the account |
| A first visit that never joined an account | No end date is set yet. It holds the random code, the topic and the marks, and nothing that names you. |
| The activity list | 24 months after you delete the account, under the random account code and with no email |
| The server's error log | 90 days |
| What you sent from Help, in Discord | Until our team deletes it. It does not name you. |
| Payment records at Stripe | As long as the law makes Stripe keep them |
| Backups | Our database companies keep short backups so they can recover from a fault. A deleted account can stay in a backup until that backup rolls over, up to 30 days. |

## 8. Get a copy, delete, or correct

**A copy of what is on your device.** Settings, Privacy, Export this record. It copies your whole record as text, so you can paste it into a file and keep it. Load a record, in the same place, puts it back.

**A copy of what our server keeps.** The app has no button for this yet. Write to hello@atuned.world from the email on your account, and we send you one file with everything our server holds under the account, your first visit included.

**Delete what is on your device.** Settings, Privacy, Delete this record. It is gone from this browser at once, and it cannot be undone.

**Delete your account.** Settings, Account, Delete this account. It first stops any paid plan. Then it deletes from our server your email, your password, your sign ins, your voice counts and your first visit at Supabase. Two things are kept: the activity list (section 7), and Stripe's record of your past payments if you ever paid. If the first visit cannot be deleted at that moment, the app says so and our server tries again every hour until it is gone. Deleting the account does not touch the record on your device. Delete this record does that.

**Correct.** Change anything you entered, in the app. To change your email, write to us.

We answer a written request within 30 days. Cancelling a paid plan deletes nothing.

## 9. Health information

What you write about your body and your mind is health information in many places. So is the topic you pick on a first visit. We treat all of it that way. We use it only to run Atüned for you. We never sell it and never use it for ads. If you live in Washington or Nevada, [Consumer health data](consumer-health-data.html) says what those states give you.

## 10. Children

Atüned is for people aged 18 and over. It is not made for children. If we learn that someone under 18 has an account, we delete it. If you think a child has one, write to us.

## 11. Your rights

Wherever you live, you may ask us what we hold about you, ask for a copy, ask us to correct it, and ask us to delete it. You may take back a yes you gave, at any time. We will not treat you worse for asking. Use the controls in section 8, or write to hello@atuned.world.

**If you live in the European Economic Area or the United Kingdom,** the General Data Protection Regulation (GDPR) gives you these rights, and also the right to object to how we use your data and to have it as a file you can take elsewhere. You may complain to the data protection authority where you live. In the United Kingdom that is the Information Commissioner's Office, at ico.org.uk. The European Data Protection Board lists the rest at edpb.europa.eu.

**If you live in California,** the California Consumer Privacy Act gives you the right to know what we collect, to delete it, to correct it, and to limit how we use sensitive information. We already use it only to run Atüned. We do not sell personal information and do not share it for ads. Your browser may send a Do Not Track signal. We run no tracking, so there is nothing for it to stop.

## 12. Keeping it safe

- Everything between your device and our server travels over an encrypted connection.
- Your password is kept as a slow one way scramble, with a different random value mixed into each account's scramble.
- Sign ins are kept scrambled. The key itself is never stored.
- Ten failed log in tries lock that email, or that connection, for 15 minutes.
- A reset link works once and ends after one hour. Using it signs you out on every other device.

No system is perfect. If you think someone else is in your account, change your password and write to us.

## 13. If something goes wrong

If your data reaches someone who should not have it, we tell you by email without delay, and within 30 days. We say what happened, what was exposed and what to do. We tell a regulator too where the law says we must.

## 14. Changes

When this page changes, the date at the top changes. Before we collect anything new, or give anything to a company not named here, we change this page first.

## 15. Contact

Email: hello@atuned.world
Post: Tula Unified LLC, 1634 West 39th Place, Los Angeles, California 90062, United States

<!--
FOR THE OWNER AND FOR COUNSEL, NOT RENDERED. funnel/legal/render.py drops this
block. The page above went live on the owner's word of 16 October ("Yes, we
need a privacy policy. It's very important to us. Transparency is important to
us."), and every sentence above was read off the code that day: MOB ui/auth.js,
ui/account.js, ui/release.js, ui/storyui.js, functions/feedback.js, and the
Reboot-OS Worker at atuned/server/src (index.js, funnel.js, voice.js, stripe.js,
ops.js). No lawyer has read it. Open for counsel:
- Whether the European and United Kingdom transfer needs named safeguards
  (standard contractual clauses), and whether a representative there is needed.
- Whether explicit consent is needed for the topic picked on a first visit,
  which is sent before any account and can be health information.
- The 30 day backup ceiling is the providers' published windows (Cloudflare D1
  Time Travel, Supabase backups), not a setting read off this account.
- The 24 month activity list is the cleanup round ruling in DECISIONS.md. No
  code deletes audit rows yet; the Worker needs a prune before the first
  account is 24 months gone.
- A first visit that never joins an account has no end date in code (Reboot-OS
  PR 34, migration 0016, would set one and is unmerged).
- The 90 day restore of a deleted account the owner asked for in round PA is
  not built, so this page does not offer it.
-->
