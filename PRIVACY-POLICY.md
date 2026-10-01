# Privacy policy

> **Warning. Read this first.** This is a generic draft written by an AI. It is not legal advice. A lawyer who knows your jurisdiction must review it before anyone relies on it, and it must not go live until they have. The parts that most need that review are section 9 (moving data between countries), section 10 (children), section 7 (how long we keep data and what deletion reaches), sections 4 and 5 (health information and who sees it), and the medical disclaimer in section 2. Every [PLACEHOLDER] is a fact only the owner can supply. Every [CHECK] is a statement to test against the build before this goes live.

Draft of 1 October 2026. Effective from: [PLACEHOLDER: the date this page goes live].

## 1. Who we are, and what this covers

Atüned is a self report instrument. You write a story or answer questions. The engine reads where charge sits in what you gave it. The app shows you the result.

This policy covers the app at atuned.world/atuned.html, the pages on atuned.world, your account and your billing. It does not cover sites we link to. Each of those has its own policy. The [Terms](terms.html) are the other half of the agreement between you and us.

[PLACEHOLDER: company legal name] ("we") makes Atüned. Address: [PLACEHOLDER: registered address]. Privacy questions: [PLACEHOLDER: privacy email address].

We are the controller of your data. That means we decide why it is held and how it is used.

## 2. What Atüned is not

Atüned is not medical care. It does not diagnose. It cannot see a disease, an injury or a deficiency, and it is not looking for one. It reads what you typed and what you answered, and nothing else.

It is not therapy. It does not replace a doctor, a therapist or a prescription. Nothing in it is medical advice. It has not been reviewed by the Food and Drug Administration, and no reading has been tested in a clinical trial.

Decisions about your health belong with a licensed professional. If you are under care, stay under it.

It is not an emergency service. We do not read what you write as you write it, so nobody will know you are in danger. If you are not safe, call or text 988 in the United States, or use your local emergency number.

## 3. What stays on your device

Everything you enter is written to your browser's storage, on your device. Browser storage is a small file store the browser keeps for one website. We do not use cookies.

It holds:

- the name, sex, date, time and place of birth you enter
- your answers
- your stories, exactly as you typed them
- the imprints the engine read out of your stories
- the snapshots of your field
- the avatar and purpose you set
- your plan, as a word. Never a card.

When you are signed in it also holds a sign in token. The token sits under its own key, apart from your record, so an export file never carries it.

If you clear site data or lose the device, that record is gone. The exceptions are a file you exported, and the copy on our server once you have an account (section 4).

The free quiz keeps your answers in your browser so you can stop and come back. A story typed into the quiz is held in memory only. It is never saved. Close the page and it is gone. The quiz makes no network request.

The app and the pages load no ads, no analytics tags, no tracking pixels, no outside fonts and no outside scripts. The Analytics page in the app is drawn on your device from your own snapshots. Nothing about how you use the app is reported to us. [CHECK: confirm this is still true on the day the page goes live. If an analytics tool is ever added, change this section first.]

## 4. What leaves your device, and when

Nothing leaves until you do one of the things in this table. Each one is a choice you make.

| When | What is sent | To whom | Why |
|---|---|---|---|
| You create an account | Your email address and password. Then your record: everything you entered up to that moment. That includes the name you gave the profile and your birth details. | Us | To open the account and keep a copy you can recover. [CHECK: the app does not send the record yet. Keep this row only when it does.] |
| You sign in | Your email address and password. We answer with a sign in token that works for 90 days. | Us | To open your session. |
| You open the app while signed in | The token. We answer with your plan and billing status. | Us | So the app shows the right plan. |
| You press Forgot your password | Your email address. | Us, and our mail provider | To send a link that works once, for one hour. |
| You pay or manage billing | Your email address, your account id and the tier you chose go to Stripe. You type your card into Stripe's page only. | Stripe | To take payment. We never see a card number. |
| You sign in with Google [CHECK: not built yet] | Google tells us your email address and name, and only after you approve them on Google's own screen. | Google, then us | To open your account. We never receive your Google password. |
| You turn on the morning note | Your browser's push address and keys, the hour you chose and your time zone offset. The note carries one fixed line and none of your content. | Us, then your browser's push service | To send one note a day at your hour. |
| You press Record to dictate | Your voice, as audio. In Chrome and Edge the browser sends it to its maker's servers (Google for Chrome, Microsoft for Edge) to turn it into text. Other browsers may do the same. | The browser's maker. Not us. | To turn speech into text. We never receive the audio. Type instead and nothing is sent. |
| You turn on the voice that speaks a release | The words being spoken, only when the voice is a network voice. The app names the voice and says where it runs before it speaks. | The browser's maker | To read the line aloud. Turn the voice off and the line reads on the screen. |
| You ask for the meaning of your name [CHECK: not built yet] | The name you entered, after you say yes in plain words. | Us, then Anthropic, which runs the Claude service | To look up what the name means. The app never holds the key and never calls Anthropic. The reply is kept on your device and marked as looked up. |
| You turn on research sharing | A copy of your imprints, releases and readings. | Us. Kept in a separate store. | To refine the word lists the reading uses. See section 5. |
| The app breaks [CHECK: the app does not send these yet] | The error message, the top of the error trace, the screen that was open, the app version and the platform. No story text. | Us | To find and fix the fault. |
| You write to us | What you write, and your email address. | Us | To answer you. |

Once your record is on our server it is stored scrambled. Each record body is locked with a standard, widely used lock before it is written to our database. The key is held outside the database. We do not read your stories. The support tools we use show account state, counts, plan and events. They do not show the body of a record.

Every request carries your IP address, which is the number that names your connection. We use it only to limit sign in attempts, and we keep those counters for 15 minutes. The company that carries our traffic, Cloudflare, keeps its own network logs. [CHECK: Cloudflare's current retention for those logs.]

We do not receive your card number, your microphone audio, your contacts or your location. The place of birth is text you typed. It is not a location reading.

## 5. Who sees your data

**You.** All of it, always.

**Us.** Our support tools show your account id, email, plan, billing status, counts of what is held and a log of account events. They never show a story. The server holds the key that unlocks stored records, so a person with access to our server secrets could open them. [PLACEHOLDER: who has that access, by role.] We do not do it, and [CHECK: confirm with engineering that no routine process reads record bodies].

**Our service providers.** They handle data for us and for no one else:

- Cloudflare hosts the site and the app, and runs our server and database in the United States.
- Stripe takes payment and holds your card.
- [PLACEHOLDER: mail provider, currently Resend] sends the password reset email.
- Google, only if you choose Google sign in.
- Anthropic, only if you ask for a name meaning and say yes.
- Your browser's maker, only when you dictate or use a network voice.

**A practitioner or cohort lead, only if you say yes.** Nobody has sight of your record unless you grant it, one person at a time. The grant screen names the person, lists what they will see and lists what they will not. Every grant is listed in Settings, Privacy, with its date. One press on the row takes it back, and it takes effect at once. We keep the date you granted it and the date you took it back, and we show you both. A practitioner is responsible for staying inside their own licence. A licensed practitioner may have duties of their own, including when they believe someone is in danger. Ask them what those are before you grant. [CHECK: this paragraph describes a screen that is not built yet.]

**Research, only if you turn it on.** It is off until you turn it on. When it is on, we copy your imprints, releases and readings into a separate store, filed under a research id that is not your account id. We can link the two, because we must, to delete the copy when you ask. We use what is in that store in aggregate, to refine the word lists the reading uses. We do not sell it and we do not train a general model on your story. We cannot promise that no name appears in it, because a story is free text and a person can type a name into one. Saying no keeps the product whole. [CHECK: the owner's ruling and the server agree on exactly what the research store is used for.]

**Anyone the law makes us tell.** If a court or a regulator requires it, we may have to disclose what we hold. We will tell you first unless the law forbids it.

**A buyer.** If the company is sold or merged, your data goes to the new owner under this policy. We will tell you before that happens so you can delete your account first.

## 6. What we use it for

We use your data to:

- run the reading you asked for
- open your account and keep your record recoverable
- take payment and keep your plan right
- send the messages you asked for, such as a reset link or the morning note
- keep the service secure and limit abuse
- fix faults
- refine the reading's word lists, only if you turned research on
- meet legal duties, such as tax records

The reason the law lets us do each of these is one of four. You asked for it and we need it to deliver (contract). You said yes (consent). It keeps the service safe and working (legitimate interest). The law requires it (legal duty).

What you write about your body and your mind is health information in many places. We treat all of it that way. We collect it only to run the reading you asked for. We ask before we share it. We never sell it. [CHECK: Washington and Nevada have separate consumer health data rules. If people in those states can sign up, a separate consumer health data policy with its own link on the home page is required.]

We do not sell your personal data. We do not share it for advertising. We run no advertising or tracking tools.

## 7. How long we keep it

| What | How long |
|---|---|
| Your record on your device | Until you delete it or clear your browser's data |
| Your account and the copy of your record on our server | Until you delete the account |
| Sign in tokens | 90 days, then they expire. Signing out ends one at once. |
| Password reset links | One hour. Used links stop working at once. |
| Failed sign in counters | 15 minutes |
| Error reports from the app and server | 90 days |
| Push addresses | Until you turn the note off, or the browser says the address is dead |
| The research copy | Until you delete the account, or turn research off and ask us to delete it [CHECK: the server deletes the research copy with the account. Confirm whether turning research off also deletes it.] |
| Billing records at Stripe | As long as tax and payment law require, which is outside our control |
| A short event log (an account id, an event name such as signed up or deleted, and a time. No email, no content.) | [PLACEHOLDER: months] |
| Backups of our database | Deleted data can remain in a backup for up to [PLACEHOLDER: days, check the provider's backup window], then it is gone. [CHECK: no restore drill has been run yet.] |
| An account nobody has opened | [PLACEHOLDER: inactive account rule, or write "until you delete it"] |

## 8. Delete, export and correct

**Delete the record on this device.** Settings, Privacy, Delete this record. It is gone from this browser at once. There is no copy unless you made one. It cannot be undone.

**Delete your account.** Settings, Privacy, Delete account. This deletes your account, the copy of your record on our server, your consent settings, your sign in tokens, your push addresses, your error reports and your research copy. It happens at once. Stripe keeps the billing records the law requires. Backups clear on the schedule in section 7. Deleting the account does not delete the record on your device until you do that too. [CHECK: the in-app Delete account control is not built. The server route exists. Until the control ships, deletion is by email to the address in section 15.]

**Export.** Settings, Privacy. Export this record gives you your device record as a file. Export account data gives you everything we hold under your account as one file. [CHECK: the in-app Export account data control is not built. The server route exists.]

**Correct.** Change anything you entered, in the app. If an account detail is wrong, such as your email, write to us.

We answer a written request within [PLACEHOLDER: days, 30 is common].

Cancelling a paid plan does not delete anything. Your record stays and your plan drops to free.

## 9. Moving data between countries

Our server and database are in the United States. If you use Atüned from another country, your data is sent to the United States when you create an account or sign in. Laws there differ from the laws where you live.

[PLACEHOLDER: the legal mechanism for moving data out of the European Economic Area and the United Kingdom, if people there are allowed to sign up. This is for a lawyer. The decision to accept or refuse sign ups from those regions is the owner's, and it comes first.]

## 10. Children

Atüned is for people aged [PLACEHOLDER: age floor. Proposed: 18] and over. It is not directed at children. We do not knowingly keep an account for anyone under that age. If we learn that we do, we delete it. If you think a child has an account, write to the address in section 15.

## 11. Your rights

Wherever you live, you may ask us to tell you what we hold about you, correct it, delete it, or give it to you as a file. You may take back a consent you gave, at any time, and taking it back does not undo what was done before. We do not sell your data, so there is nothing to opt out of.

If you live in a place with a privacy law, such as California, the European Economic Area or the United Kingdom, that law gives you the same rights and some more. You may complain to the regulator where you live. [PLACEHOLDER: the regulator or regulators to name, after a lawyer sets which laws apply.] We will not treat you worse for using a right.

To use a right, use the controls in section 8 or write to the address in section 15.

## 12. Security

- Everything between your device and our server travels over an encrypted connection.
- We never store your password. We store a slow one way scramble of it, with a different random value mixed into each account's scramble. Nobody can turn it back into the password.
- Sign in tokens are stored scrambled too. The token itself is never kept.
- Ten failed sign ins lock an email address or a connection for fifteen minutes.
- Reset links work once and expire in one hour. Using one signs out every device.
- Stored record bodies are locked as described in section 4.

No system is perfect. If you think your account is at risk, change your password and write to us.

## 13. If something goes wrong

If we learn that your data was exposed to someone who should not have it, we will tell you by email. We will say what happened, what was exposed and what to do. We will tell you without delay and within [PLACEHOLDER: hours or days, 72 hours is the European standard and 60 days is the outer limit for the United States health breach rule]. If the law requires us to tell a regulator, we will.

## 14. Changes

We may change this policy. The date at the top changes with it. If a change is material, meaning it changes what we collect, who sees it or how long we keep it, we will email you and show a notice in the app at least [PLACEHOLDER: days] before it takes effect. The version in force is the one on this page.

## 15. Contact

Privacy: [PLACEHOLDER: privacy email address]
Everything else: [PLACEHOLDER: general contact email address]
Post: [PLACEHOLDER: registered address]

A person reads it and answers.
