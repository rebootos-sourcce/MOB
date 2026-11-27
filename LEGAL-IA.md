# Where the privacy policy and the terms live

> **Warning. Read this first.** The privacy policy, the terms, the consumer health data policy and the one page breakdown in this repository are generic drafts written by an AI. They are not legal advice. A lawyer who knows your jurisdiction must review them before anyone relies on them, and the pages must not go live until they have. The clauses that most need that review are: moving data between countries, the European, United Kingdom and California rights, children, refunds and renewal, limits of liability and disclaimers, governing law and disputes, backups and getting back a deleted account, and the medical disclaimer. The exact section numbers are in "What a lawyer must read" below.

Round OX, 1 October 2026. His words: "I don't have a privacy policy or terms page. Where does that go in my information architecture? Figure out what that goes in, in the information architecture. Generate both with generic terms with a breakdown of our privacy policy."

Round PA, 1 October 2026, revised this document. He answered the legal questions: "The company's legal name is Tula Unified LLC. That's T-U-L-A. Our address is 1634 West 39th Place, Los Angeles, California, 90062. The email address, you have it. Hello, at we are in California, United States. We do no refund after seven days. um, yes, people from EU, UK, it's internet, so it'll be everywhere. Yeah, deleted accounts back up after ninety days. And we'll need a recovery process. In case they come back and want their data. Um, birth data doesn't need to travel with them. Just their analytic data. kind of like the summary data. I don't know what you mean by resource sharing. Do a ticked box."

Information architecture means where each page sits and how a person gets to it. This document decides that from the repository's own facts, then lists what must be true before the pages go live, then walks him through pasting the addresses into Google and Stripe.

Files written for this round:

| File | What it is |
|---|---|
| `PRIVACY-POLICY.md` | The policy. Generic terms, drafted for a small subscription app, from what the product really does. Now with the European, United Kingdom and California sections. |
| `PRIVACY-BREAKDOWN.md` | One page for a person: what stays on the device, what leaves, when, who sees it, how to delete it and get it back. |
| `TERMS.md` | The terms of service. |
| `CONSUMER-HEALTH-DATA.md` | The proposed third document, for Washington and Nevada. It carries nothing else, because Washington's law says so. |
| `funnel/legal/privacy.html`, `funnel/legal/terms.html`, `funnel/legal/consumer-health-data.html` | The three static pages, rendered from the markdown in the funnel's own look. Self contained. |
| `funnel/legal/render.py` | Renders the markdown into the three pages. Edit the markdown, never the HTML. |

Three markers sit in the text. `[PLACEHOLDER: ...]` is a fact only the owner can supply. `[CHECK: ...]` is a statement to test against the build, or a point a lawyer must rule on. `[PROPOSED: ...]` is something he has decided or the draft recommends, which a lawyer must confirm. Every marker for a fact still unknown is kept.

## 1. The answer

The three documents live on the public site, as their own pages, at three addresses:

    https://atuned.world/privacy
    https://atuned.world/terms
    https://atuned.world/consumer-health-data

They are linked from the footer of every funnel page and from the app. The consumer health data page must be linked from the home page, with its own link, and nothing else on it. Google's consent screen and Stripe each ask for the first two addresses, and both need a page anybody can open without signing in. The app is one file that people download and open from a folder on their own machine, so it cannot be the only home of a policy. It carries the addresses as links and carries a short offline sheet of its own.

No new tab, no new section in Settings. The header of `ui/account.js` records that surface being measured as too dense once already, and seven sections is what it holds now.

## 2. The facts this rests on

Each one was read from the repository, not assumed.

- **The site deploys as flat files.** `.github/workflows/deploy.yml` stages the funnel pages, the app and an `index.html` into one Cloudflare Pages project named `atuned`. Today that is `/`, `/atuned-quiz`, `/atuned-about`, `/atuned-buy` and `/atuned`. A flat set, `/privacy`, `/terms` and `/consumer-health-data`, matches it. Cloudflare Pages serves `privacy.html` at `/privacy`. [CHECK: open all three addresses after the first deploy, with and without `.html`.]
- **The funnel makes no network request, and the app makes one kind.** `CLAUDE.md`: the app gains network at exactly one seam, account calls. `tests/design.js` gate 7 fails on any other request. A footer link is a navigation the person chooses. It is not a request the page makes. [CHECK: confirm gate 7 and `tests/funnel.js` do not treat an outbound link as a request.]
- **The app has no footer today.** `atuned_src/shell/body.html` ends on the release rail. `reviews/LEGAL-floor.md` section 12 already designed one, and why it must sit outside every tab host: a tab renderer writes its host's whole `innerHTML` and would delete it.
- **Settings is not a tab.** It is reached from the profile button. `ui/account.js` has seven sections: Account, Profiles, Display, Security, Privacy, Billing, Help. The Privacy section already holds the Export and Delete controls. The Help section was designed in `reviews/LEGAL-floor.md` to carry a Legal group.
- **The door has three actions.** `ui/login.js`, `loginCard`: Log in, Create account, Continue without an account. Round PA moves Create account and Guest beside Log in and keeps one Log in button.
- **The account step in onboarding is storyboard 14**, `ATUNED-funnel-storyboards-focus-group-validated.md`: "Keep what you found. Create your account to continue."
- **The paid step is Stripe's page.** `reboot-os/atuned/server/src/stripe.js`, `createCheckout`, sends a person to a page Stripe hosts. Terms can be shown there only through Stripe's own settings and one parameter.
- **Adding a page to `funnel/` breaks the build.** `funnel/BUILD-single.sh` lists every `.html` file in the folder and stops on any it does not know: `no dist name for ['privacy.html']: add it to OUT`. Measured on 1 October against a copy. `tests/funnel.js` also gates every page it finds. So the three pages sit in `funnel/legal/` until they are wired. That is the one place this round differs from what was asked: the files are at `funnel/legal/privacy.html` and so on, not `funnel/privacy.html`.
- **The sign up the owner ruled is not the sign up the server has.** He ruled a username of 3 to 20 characters and a passphrase, with an optional recovery email (rounds OX and PA, and the PLAN entry for round PA). The server keys an account on an email address and a password. The policy and terms are written to the ruled design and carry a `[CHECK]` on every line that differs.

## 3. The sitemap

    atuned.world                                    Cloudflare Pages project "atuned"
    |
    |-- /                    funnel landing         footer: About, Tiers, The test, Privacy, Terms, Consumer health data
    |-- /atuned-quiz         the test               door footer: Privacy, Terms, Consumer health data
    |-- /atuned-about        about                  footer: same six
    |-- /atuned-buy          tiers                  footer: same six
    |        '--> Stripe Checkout (stripe.com)      Terms ride on Stripe's own settings
    |-- /privacy       NEW   Privacy policy         the address Google and Stripe ask for
    |-- /terms         NEW   Terms                  the address Google and Stripe ask for
    |-- /consumer-health-data  NEW, PROPOSED        Washington and Nevada, drafted this round, see section 8
    |
    '-- /atuned              the app, one file
         |
         |-- the door (login card)
         |       Log in, Create account, Continue without an account
         |       under Continue without an account: the consent line and two links
         |       under Create account: the ticked boxes (4.2)
         |-- onboarding, the account step ("Keep what you found")
         |       what goes across, the recovery email, the ticked boxes, links
         |-- Settings (profile button, no tab)
         |       Account    Delete account, when signed in
         |       Privacy    Documents: Privacy policy, Terms, Consumer health data
         |                  Export and delete: this record, account data, account
         |       Billing    renewal disclosure, ticked agreement, Terms link
         |                  Manage billing --> Stripe customer portal
         |       Help       Legal: What this is not, If you are in danger now,
         |                         Terms, Privacy policy
         |                  Contact
         '-- footer on every screen, outside every tab host
                 (c) 2026 Tula Unified LLC, What this is not, Privacy, Terms,
                 Consumer health data, Contact

External places that hold the addresses:

    Google Cloud, OAuth consent screen   home page, privacy, terms, authorized domain
    Stripe, Settings, Public details     website, privacy, terms
    Stripe, Customer portal              privacy, terms

## 4. Placement, surface by surface

Every string below is the actual string. The bucket is one of the seven in `COPY.md`. Nothing here is built yet in the app. Everything under "app" is for the shell and account seats, and `atuned_src/` was not touched this round.

### 4.1 The public site, footer on every funnel page

| | |
|---|---|
| What | Three links added to the row of footer links already on each page: Privacy, Terms, Consumer health data |
| Strings | `Privacy`, `Terms` and `Consumer health data`. Bucket: label. The third is longer than the other two on purpose: Washington asks for a conspicuous link to its own policy, and `Health data` alone does not say what it opens. [PROPOSED: the label.] |
| Where | The `foot-nav` row at the bottom of `funnel/index.html`, `funnel/about.html`, `funnel/buy.html`. On `funnel/quiz.html`, the door view's foot line, since the quiz has no nav row. |
| Why | Google requires the home page to link to the privacy policy. The funnel's home page is `index.html`. Washington requires the consumer health data policy to be linked from the home page. |
| Status | Not wired. The two page version was tested in a copy: 248 checks pass, 0 fail (200 before). The third page is not yet tested in a copy. |

### 4.2 The door, and the ticked boxes

Round PA: "Do a ticked box." A ticked box is a checkbox the person ticks themselves, and it starts unticked. A line under a button is weaker evidence of agreement than a box the person ticks (`reviews/LEGAL-floor.md` section 7). So there are two routes.

**Continue without an account.** One line and two links under the button:

    By continuing you agree to the Terms and the Privacy policy.

Bucket: definition, because it says what pressing means. Terms and Privacy policy are links to `https://atuned.world/terms` and `https://atuned.world/privacy`, opening a new tab. Nothing leaves the device on this route. [CHECK: a lawyer rules whether using the app without an account needs a box too. The draft keeps the line, because the person sends us nothing.]

**Create account.** Two boxes, each starting unticked, and the button stays dull until both are ticked:

    I agree to the Terms and the Privacy policy.
    I am 18 or older.

Bucket: instruction, for each. Terms and Privacy policy are the same two links. [PROPOSED: the age line, which is the floor in `PRIVACY-POLICY.md` section 11. It is not decided.]

A third box, for people who live where the law asks for it:

    Send my stories and readings to your server and keep them there.

[CHECK: whether this box is needed. Under the European and United Kingdom law, health information may be used only with explicit consent, and consent bundled with the terms does not count. The draft recommends this box for everyone, so the app need not guess where a person lives. A lawyer rules.]

Where: `atuned_src/ui/login.js`, `loginCard`, and the account step of onboarding. What is recorded for each box: the box, the version of the document, and the time. The server has no column for it. See section 9.

### 4.3 The onboarding account step

| | |
|---|---|
| What | What goes across, the optional recovery email, the ticked boxes and the links. |
| Strings | `Keep what you found.` is storyboard 14's own line and stays. Then: `Creating an account sends your stories, imprints, releases and readings to our server. Your name and birth details stay on this device. It is stored scrambled and we do not read it. Delete the account and our copy is deleted. A backup stays for 90 days, in case you want it back.` Bucket: definition. Then the field `Recovery email (optional)`, bucket: label, with `Used only if you lose your passphrase. With none, we cannot reset it.` under it, bucket: definition. Then the boxes from 4.2. |
| Where | The account step of onboarding, `atuned_src/ui/onboard.js`, when it is built. The TDD puts it after the first release, and the owner has ruled (rounds OX and PA) that the account comes after the first release, that the data from their input is passed over at that moment, and that birth data does not go. |
| Why | The person is about to send their own words to a server. The sentence is the plain words the owner asked for in `DECISIONS.md` ("consent asked rather than a policy assumed"). It says exactly what is and is not sent. |
| Honest note | "We do not read it" is a statement of fact about us. It is true of the support console today (`reboot-os/atuned/server/src/ops.js`, `supportView`, never a body). A lawyer should look at it, because it is a promise. The stories in the first sentence are the open conflict in section 7. |
| Status | Not built. The app does not send the record yet. |

### 4.4 Settings, Privacy

| | |
|---|---|
| What | One new group called `Documents` above the existing `Export and Delete` group, and two new rows in `Export and Delete` when signed in. |
| Strings | Rows `Privacy policy`, `Terms` and `Consumer health data`, button `Open` on each. Then, in `Export and Delete`, beside the two that exist (`Export this record`, `Delete this record`): `Export account data` with button `Download`, and `Delete account` with button `Delete`. |
| Notes under them | Export account data: `Everything we hold under your account, as one file.` Delete account: `Deletes your account and our copy of your record. A backup stays for 90 days. Write to hello@atuned.world in that time to get it back. Stripe keeps billing records the law requires. This device keeps its own record until you delete it.` |
| Where | `atuned_src/ui/account.js`, `accPrivacy`. |
| Why not a Legal section | The menu rule says a section is named for what it does, and Legal names a subject. `Privacy` is already where a person looks for export and delete. The account surface was already measured as too dense once (`ui/account.js`, header comment). The owner asked for a Legal section holding four things. Two of them are documents and sit under Documents. The other two are controls and sit beside the controls that already exist. All four are in one section. |
| One word per concept | `Delete` everywhere. Never remove. `Delete this record` is the device. `Delete account` is the server. The two labels differ so nobody deletes one thinking they deleted the other. |
| Research | The row `Improve the Models` in `accPrivacy` comes out at launch, or is hidden. Research sharing is not offered (section 12, question 6). Whoever edits `ui/account.js` takes it out in the same change. |
| Status | Server routes exist (`GET /v1/export`, `DELETE /v1/me`). The app controls do not. The round MP entry in `TASKS.md` names account deletion as not built. Restoring a deleted account has no route and no control. It is done by hand from backup until one is built. |

### 4.5 Settings, Help, the Legal group

`reviews/LEGAL-floor.md` section 12 already designed this: a `Legal` group in `accHelp` with `What this is not`, `If you are in danger now` and `Terms of use`. Two changes. `Terms of use` becomes `Terms`, to match the footer and the page. And a fourth row, `Privacy policy`, is added. Each opens with `Open`. `What this is not` and `If you are in danger now` are on device sheets that work with no connection. The other two open the public pages.

A `Contact` group follows with the general address, `hello@atuned.world`, as block F of that file has it. There is one address for everything. A separate privacy address does not exist, and the documents say so.

### 4.6 The app footer

The footer from `reviews/LEGAL-floor.md` block A, as static markup in `atuned_src/shell/body.html` after the last tab host:

    © 2026 Tula Unified LLC
    What this is not  Privacy  Terms  Consumer health data  Contact

Privacy, Terms and Consumer health data are the three public addresses. Absolute addresses, not relative ones, because the app is opened from a folder and a relative link would point nowhere. Static, so it is there with scripts off. `reviews/LEGAL-floor.md` blocks A, D and E print the name as "Tool of Unified LLC", which came from a dictation and is wrong. The name is Tula Unified LLC. Use the string above and not the one in that file.

### 4.7 The buy page and the paid step

The buy page (`funnel/buy.html`) gets the footer links from 4.1.

The app's paid step (`ui/plans.js`) carries block G from `reviews/LEGAL-floor.md`, in full:

    How the charge works. This is a subscription. [price] every month. It renews on its own until you cancel.
    Cancel from Billing in Settings. One press, no call and no email.

Then the refund line, which is the owner's seven days:

    A refund within seven days of a charge. After that, no refund.

Bucket: definition. Under it, a ticked box that starts unticked, as its own step and not bundled with the terms:

    I agree to a recurring charge of $12 every month until I cancel.

The price in that line is the tier's own price: $12, $29, $59 or $99. A `Terms` link sits beside the box. Round PA asks for a ticked box at the paid step, and this is it. California's Automatic Renewal Law requires the renewal consent to be separate from acceptance of the terms, which the account box already covered. `TERMS.md` section 8 is written to match.

[CHECK: people in the European Union and the United Kingdom may cancel a distance purchase within 14 days, and seven days is shorter than that. For a digital service that starts at once, the law lets a person give that right up only if they ask for the service to start and accept that they lose the right. A lawyer rules, and the paid step may need a second box for it. See section 9.1.]

On Stripe's page, the terms agreement is shown only if two things are set (steps in section 6). Stripe's Public details need the terms address. And the Checkout Session needs one parameter, `consent_collection[terms_of_service]=required`, added in `reboot-os/atuned/server/src/stripe.js`, `createCheckout`. That change is in a different repository and was not made. [CHECK: Stripe's current parameter name, and that it refuses the session until the terms address is saved.]

### 4.8 Google's consent screen and Stripe's account settings

Not pages. Fields that hold the addresses. Steps in section 6.

## 5. Why not somewhere else

- **Only inside the app.** Google and Stripe need public addresses. People open the app as a downloaded file, with no site around it.
- **One combined page.** Google asks for the privacy policy address on its own. Washington's health data law requires a separate privacy policy behind its own link (section 8). Three documents, three pages.
- **A `/legal/` folder.** Longer addresses to paste, and every existing page is flat.
- **A subdomain such as `legal.atuned.world`.** Google wants the privacy policy on the same domain as the home page. A subdomain works but adds a DNS record for nothing.
- **A new section in Settings.** See 4.4.

## 6. What the owner does, step by step

Do these only after the pages are live (section 9). Do not paste an address that gives an error. Test each one first.

### Step 0. Check the addresses open

1. Open a browser in a private window. This is a window that remembers nothing about you, so it shows what a stranger sees.
2. Type `https://atuned.world/privacy` and press Enter. You should see the Privacy policy page. No password. No error.
3. Do the same with `https://atuned.world/terms` and `https://atuned.world/consumer-health-data`.
4. If any shows an error, stop. Nothing below will work.

### Part A. Google, the consent screen

The consent screen is the box Google shows a person before they sign in with Google. It names your app and links your policies. Google refuses to publish it without them.

Google Cloud is a separate account from Cloudflare, GitHub and Stripe. It uses a Google login. Use the Google account that should own this for good. A company address is better than a personal one. [CHECK: which account.]

Google moves these screens. The words below were written from memory of the newest layout. If a button is not where a step says, stop and send a screenshot. That is Google renaming something, not you doing it wrong. [CHECK: every label in Part A.]

1. Go to `console.cloud.google.com` and sign in.
2. At the top left, beside the words "Google Cloud", is a box with a project name in it. Click it. A window opens.
3. At the top right of that window click **New project**. In **Project name** type `Atuned`. Click **Create**. Wait a few seconds.
4. Click the same box at the top left again and click the project named Atuned, so it is the one selected.
5. Click the three line menu icon at the very top left. Click **APIs & Services**, then **OAuth consent screen**. Google may call this **Google Auth Platform** instead. That is the same place.
6. If you see a **Get started** button, click it.
   - **App name**: `Atuned`. [CHECK: Google compares this to the name on your home page. The page's title carries the u with two dots, and the visible mark is drawn. Plain `Atuned` is safest.]
   - **User support email**: `hello@atuned.world`, or choose it from the list. Click **Next**.
   - **Audience**: choose **External**. Click **Next**.
   - **Contact information**: type `hello@atuned.world`. Click **Next**.
   - Tick the box that says you agree to the Google API Services User Data Policy. Click **Continue**, then **Create**.
7. On the left you now see a list: Overview, **Branding**, Audience, Clients, Data Access. Click **Branding**.
8. Find **App domain**. Fill in the three boxes:
   - **Application home page**: `https://atuned.world`
   - **Application privacy policy link**: `https://atuned.world/privacy`
   - **Application terms of service link**: `https://atuned.world/terms`
9. Scroll down to **Authorized domains**. Click **Add domain**. Type `atuned.world` only. No `https://`, no slash.
10. Scroll down to **Developer contact information**. Type `hello@atuned.world`.
11. Click **Save** at the bottom.
12. On the left click **Data Access**, then **Add or remove scopes**. A scope is one piece of information you ask Google for. Tick `openid`, `.../auth/userinfo.email` and `.../auth/userinfo.profile`. These three give a name and an email address and nothing more. Click **Update**, then **Save**.
13. On the left click **Audience**. Find **Publishing status**. It says Testing. Click **Publish app**, then **Confirm**. While it says Testing, only people you list by hand can sign in. [CHECK: Google may ask you to submit for verification. It tells you on this screen.]

If Google says the domain is not verified, do the next part. Google needs proof that you own `atuned.world`.

14. In a new tab go to `search.google.com/search-console`. Sign in with the same Google account.
15. Click **Add property**. Two boxes appear. Choose the one called **Domain**, on the left. Type `atuned.world`. Click **Continue**.
16. Google shows a long line of text starting `google-site-verification=`. Click **Copy**. Leave this tab open.
17. In another tab go to `dash.cloudflare.com` and sign in. Cloudflare keeps your domain's address book. Click **atuned.world** in the list.
18. In the left menu click **DNS**, then **Records**. Click **Add record**.
19. **Type**: choose `TXT`. **Name**: type `@`. **Content**: paste what you copied. Click **Save**.
20. Go back to the Search Console tab and click **Verify**. It can take a few minutes. If it fails, wait ten minutes and click Verify again.

### Part B. Stripe, the public details

Stripe is a separate account from Cloudflare, GitHub and Google. It has its own email and password.

Stripe moves its buttons too. If a step does not match your screen, stop and send a screenshot. [CHECK: every label in Part B.]

1. Go to `dashboard.stripe.com` and sign in.
2. Click the **gear icon** at the top right. It opens **Settings**. [CHECK: it may be at the bottom of the left menu.]
3. In the list on the left, under **Business**, click **Public details**.
4. Fill in:
   - **Business name**: `Tula Unified LLC`. It must match the name on the pages.
   - **Website**: `https://atuned.world`
   - **Terms of service**: `https://atuned.world/terms`
   - **Privacy policy**: `https://atuned.world/privacy`
   - **Support email**: `hello@atuned.world`
5. Click **Save** at the bottom.
6. Now the portal, which is the page where a customer cancels or changes plan. In the Settings list click **Billing**, then **Customer portal**.
7. Find the part called **Business information**. Paste the same two addresses into **Terms of service** and **Privacy policy**. [CHECK: the portal may read these from step 4.]
8. Find **Cancellations**. Switch on **Customers can cancel subscriptions**. Choose **Cancel at end of billing period**. This matches `TERMS.md` section 8.
9. Click **Save changes**. If the portal was never switched on, there is a button to do it here. `STRIPE-SETUP.md` covers that part.

Stripe will not show a terms checkbox on its own payment page until the server asks for it. That is a code change in the server repository, in section 4.7. It is not a dashboard step. Tell the server seat.

Stripe also reviews your website before it lets you take real money. It looks for what you sell, the prices, a way to contact you and a refund policy. The refund policy is in `TERMS.md` section 8: a refund within seven days of a charge, and none after. It is the owner's ruling and is marked for a lawyer. Put the same words wherever Stripe asks for them.

## 7. What is built today, against what the policy says

The policy must be true on the day it goes live. This table is the test. "Server" is `reboot-os/atuned/server`.

| The policy says | Built today? |
|---|---|
| Record on the device, in browser storage, no cookies | Yes |
| No ads, no analytics tags, no outside requests from the pages | Yes. `tests/design.js` gate 7 and `tests/funnel.js` watch for requests. |
| Quiz keeps answers, never the story | Yes. `funnel/quiz.html`, `KEY`, and the story is held in memory. |
| Sign up, sign in, forgot password, sign out, plan read | Yes, with an email and a password. `ui/auth.js`. The reset mail needs the mail provider's key set on the server. |
| A username and passphrase, with an optional recovery email | **No.** The server keys an account on email alone, and `ui/login.js` says the username field is gone. |
| Stripe checkout and Manage billing | Yes, both ends. Needs the four Stripe products and the keys. See `STRIPE-SETUP.md`. |
| Record passed to the server at sign up, without the birth data | **No.** Server sync exists. The app does not call it. |
| Readings built from birth data are left out of the copy | **Not checked.** See the first conflict below. |
| Export account data | **No** control. Server route exists. |
| Delete account | **No** control. Server route exists. |
| A backup of a deleted account for 90 days, and a restore on request | **Not checked.** No restore drill has been run, and the host's backup window has not been read. |
| Ticked boxes at account creation and at the paid step, with a record of which document version and when | **No.** The `accounts` table has no column for it. |
| An age box | **No.** |
| Morning note | **No.** The server routes exist. The app has no push code. |
| Crash reports | **No.** The server route exists. The app does not send. |
| Name meaning lookup | **No.** No route exists. |
| Google sign in | **No.** |
| Practitioner grant screen | **No.** |
| A consumer health data page, linked from the home page | **No.** Drafted this round. |

Research sharing is not on this list. It was a row. The owner did not understand it, the recommendation is to leave it out of launch, and the policy now says only that nothing like it exists and that we will ask first if it ever does (section 12, question 6). The server route for it still exists and the in-app switch is a device flag that sends nothing. Neither is mentioned to people.

Rows marked No are marked in the documents as [CHECK]. The policy cannot go live saying a thing happens that does not. Two ways through. Build the thing first, or cut the row and say in the policy only what the build does. Cutting is a smaller policy and a smaller promise. The owner decides which.

**Statements in the product that disagree, and one must move.**

- **The stories.** Round OX: "all the data from their input gets passed over". Round PA: "Just their analytic data. kind of like the summary data." The first includes the stories. The second reads as the readings and summaries only. The documents list the stories as sent, because a story kept for recovery is what makes a restored account whole and `DECISIONS.md` rules the story is stored for recovery, never shared. If he rules the stories stay on the device, one line goes in each document and a recovered account has readings and no stories.
- **Derived readings.** Birth data does not travel, but readings the app builds from it, such as the birth readings, would. If they are in the copy, someone could work back toward a birth date. Engineering must leave them out, or the policy sentence "birth details never leave your device" is not exact.
- **`DECISIONS.md`.** Lines near 42, 293 and 714 still say the record and the story are never held joined. The ruling near 1384 supersedes that: the story is stored for recovery, never shared, used only for modelling. The same ruling's "used only for modelling" disagrees with the policy, which says nothing is used for modelling. The policy follows the research cut. The file needs a line saying so. "The name never leaves" under "Privacy and the snippet" agrees with round PA and holds.
- **`ui/account.js`, `accPrivacy`.** `Improve the Models` explains a use the policy no longer offers. `ACC_HELD` says "Held in this browser and nowhere else", which stops being true at sign up, and it lists the name and birth details, which stay. After sign up the sheet must say what is also held on the server, and that is the list in `PRIVACY-POLICY.md` section 4.
- **`reviews/LEGAL-floor.md`.** Block D says "no server holds a copy", and block A and the terms block name "Tool of Unified LLC". The name is Tula Unified LLC. Block D says a privacy address, `[privacy@domain]`, which does not exist. Block D's "Your name stays here" is true again, because the name does not travel. The block must not ship as written.
- **The sign up.** The ruled design is a username and passphrase. The server has an email and a password. The documents say passphrase and username and carry a `[CHECK]`. Edit them to what ships.

## 8. Gaps this round does not close

- **A third legal page.** Washington's My Health My Data Act, and Nevada's equivalent, require a separate consumer health data privacy policy behind its own link on the home page. It may carry nothing else. It has no size threshold and has a private right of action. People everywhere can now sign up, so it is needed. It is drafted this round as `CONSUMER-HEALTH-DATA.md`, proposed at `/consumer-health-data`. It is not wired and a lawyer has not read it. See `reviews/LEGAL-floor.md` section 6.
- **Europe and the United Kingdom.** The owner's answer is yes, people there sign up. The policy now carries the sections (13 and 10). What that choice requires is in section 9.1. It is a long list, and some of it is a lawyer's and a representative's work before a first European account opens.
- **The sales claims.** `reviews/LEGAL-floor.md` section 2 names the throughput argument on the buy page as the largest legal exposure in the product, and says no disclaimer fixes it. These documents do not address it.
- **Backups and breach.** `ATUNED-architecture-security-review.md` records no tested restore drill and no retention policy. The owner has now ruled 90 days for a deleted account's backup, and a recovery process. Both are written into the policy. Neither is built or tested. The breach notice period in the policy is still a placeholder.
- **Research sharing.** Cut from the policy as a launch feature. The server route and the in-app switch are still in the code. See 4.4.

## 9. Before the pages go live

Every line must be true. Check them off in order.

1. A lawyer who knows California law, and the General Data Protection Regulation of the European Union and the United Kingdom's version of it, has read all four documents and the three pages, and signed off.
2. Every `[PLACEHOLDER`, `[CHECK` and `[PROPOSED` in `PRIVACY-POLICY.md`, `TERMS.md`, `CONSUMER-HEALTH-DATA.md` and `PRIVACY-BREAKDOWN.md` is resolved. Search each file for those three words. Zero hits. A `[PROPOSED` is resolved when a lawyer confirms it and the marker comes out.
3. The company is Tula Unified LLC on the pages, on Stripe's business name and on the Google consent screen. The address, 1634 West 39th Place, Los Angeles, California 90062, is one he is content to print in public. If it is a home address, use a mailing address or a registered agent's.
4. `hello@atuned.world` receives mail and a person reads it. It is already the sender address in the server's settings, which does not prove it receives. A `privacy@` address does not exist, and the documents say so. [CHECK: Cloudflare's Email Routing can forward addresses at `atuned.world`.]
5. The refund policy is the same in four places: `TERMS.md` section 8, Stripe, the buy page and the paid step. A refund within seven days of a charge, and none after. Someone knows how to issue one from Stripe's dashboard, and a request by email is answered.
6. The age floor is decided, and the account step carries the box.
7. What goes across at sign up is exactly what the policy says: the stories ruling made, the birth data left out, the derived readings checked, and the rule for later entries written.
8. Section 7 is clean: every row either built, or cut from the policy.
9. Account deletion and account export work end to end, on a test account, including the Stripe side.
10. Restoring a deleted account from backup works. The steps in `PRIVACY-POLICY.md` section 9 have been done once on a test account, and the host's backup window has been read and is 90 days or less.
11. The cancel route works as `TERMS.md` section 8 says: Customer portal is on, set to cancel at the end of the period.
12. The renewal disclosure and the ticked box are on the paid step, and the two ticked boxes are at account creation. Every box starts unticked.
13. Someone has recorded which version of each document each account accepted, which boxes, and when. California's Automatic Renewal Law requires the consent record kept for three years. The European law expects us to show we have a person's consent. The server has no column for it.
14. The optional recovery email is on the sign up, the Forgot passphrase route sends to it, and with none the app says it cannot reset.
15. The consent line is on the door, for the person who continues without an account.
16. The footer links are on every funnel page, and the home page links to the privacy policy and to the consumer health data policy. Google checks the home page, and Washington asks for the second.
17. The draft warning is taken out of the three pages, and the `noindex` line with it. Both are marked in `funnel/legal/render.py` and in the generated HTML. Take the warning out of the markdown, take the meta line out of the template, render again.
18. The three pages open in a private window at the three addresses and return a page, not an error. Section 6, step 0.
19. The date at the top of each is set.
20. The page that shows on atuned.world, `atuned-buy`, makes no claim that `reviews/LEGAL-floor.md` section 2 would fail.
21. The `Improve the Models` row is out of the app, and no screen offers research sharing.
22. The list in 9.1 is done, for every item that applies before a first European or United Kingdom account is created.

### 9.1 What the owner's regions choice now requires

He said people from the European Union and the United Kingdom sign up, and it will be everywhere. That is a yes to every country's law at once. Each item below is a thing that must exist, not a thing that might help. Most of it bites at the moment a person creates an account, because until then nothing leaves their device. The free quiz and the app on a device carry no personal data to us.

1. **A lawyer.** One who knows the European and United Kingdom law, and California's, and can read the Washington and Nevada page. Some of the choices below are theirs alone: the transfer safeguard, whether a representative is needed, the 14 day right to cancel, whether consent needs its own box.
2. **A representative in the European Union and one in the United Kingdom.** A company outside those places that offers them a service may have to name a person inside each, who answers to the regulators for it. The exemption for occasional use is unlikely to cover health information. A paid service does this. Print their names in `PRIVACY-POLICY.md` section 13. [CHECK: the lawyer says whether it is required.]
3. **A data processing agreement with each service that touches personal data.** It is a contract that limits what the service may do with the data. Stripe, Cloudflare (the host) and the mail provider each need one. Stripe and Cloudflare publish theirs and fold it into their terms, so the work is to confirm each is in force on our accounts. Anthropic and Google need one only if the name meaning lookup and Google sign in ship.
4. **A transfer safeguard.** Our server is in the United States. The standard contractual clauses, with the United Kingdom's addendum, are the likely route. The other is to join the EU-US Data Privacy Framework. A lawyer chooses and `PRIVACY-POLICY.md` section 10 names it.
5. **A cookie and consent review.** The product sets no cookies. Its record and its sign in token sit in the browser's own storage, and the European rules on storing things on a person's device cover that as well. A sign in token is likely to count as strictly necessary, and the record is stored at the person's own request. A lawyer confirms. Separately, health information needs explicit consent, which is a ticked box of its own, written down with the time (section 4.2).
6. **A deletion and export route in the app.** Delete account, Export account data, and a way to correct an account detail and to take consent back, all answered within one month. Today the server routes exist and the app controls do not. Add the restore from backup route for 90 days (policy section 9), which is done by hand until it is built.
7. **A data protection impact assessment.** A written test of the risk to people, expected before processing health information at scale. A lawyer or a privacy adviser writes it, and it is kept.
8. **A record of how we process data.** A short table of what we hold, why, who gets it and for how long. `PRIVACY-POLICY.md` sections 4 to 7 are most of it.
9. **A breach plan.** The European law asks for the regulator to be told within 72 hours of finding out. One named person, one template, one list of regulators.
10. **Tax on a digital service.** The European Union and the United Kingdom charge value added tax on it, by the buyer's country. An accountant says whether we must register, and Stripe's tax tool calculates it. `TERMS.md` section 7 carries the note.
11. **Consumer rules in those places.** A 14 day right to cancel a distance purchase, against the seven day refund the owner ruled. And the right to sue in the home courts, whatever the terms say about Los Angeles County. Both are marked in `TERMS.md` sections 8 and 20.
12. **A decision on the age floor.** At 18 no country's rule on a parent's consent for a child is reached. Those ages run from 13 to 16 across the European Union, and are 13 in the United Kingdom.
13. **A check on California's medical information law for mental health apps.** `PRIVACY-POLICY.md` section 14 carries the note.

Recommendation, which is his to take or leave: keep the choice that people everywhere can sign up, but do not open account creation to the European Union and the United Kingdom until items 1 to 9 are done. The free quiz and the app on a device can open to everyone on day one, because they send nothing. The gate sits at the Create account button, not at the front door, and it costs one line of text for a person who is told the account opens there soon.

## 10. Wiring, exactly

Do these after item 1 above. The two page version was tested in a copy of the repository: the funnel build passes, the page set builds, and `tests/funnel.js` reads 248 passed and 0 failed against 200 before. The third page has not been run through that copy.

1. **Render the pages one folder up.** From the repository root: `python3 funnel/legal/render.py --wired`. It writes `funnel/privacy.html`, `funnel/terms.html` and `funnel/consumer-health-data.html`, with sibling links written the way the other funnel pages write them, and with the `tokens.css` link line the build asserts. Then delete the three copies in `funnel/legal/`.
2. **`funnel/BUILD-single.sh`.** In the `OUT` table, add `'privacy.html':'privacy.html', 'terms.html':'terms.html', 'consumer-health-data.html':'consumer-health-data.html'`. Without this the script stops.
3. **Footers.** In each of `funnel/index.html`, `funnel/about.html` and `funnel/buy.html`, in the `foot-nav` row, after the link to `quiz.html`, add:

        <a href="privacy.html">Privacy</a> <a href="terms.html">Terms</a> <a href="consumer-health-data.html">Consumer health data</a>

4. **`funnel/quiz.html`.** In the door view's foot paragraph, after `request of any kind.`, add the same three links. Add one rule beside `.foot`: `.foot a{color:var(--mid);display:inline-flex;align-items:center;min-height:44px;min-width:44px;text-decoration:underline;text-underline-offset:4px}`.
5. **`.github/workflows/deploy.yml`.** In "stage the site" add `cp funnel/dist/privacy.html deploy/`, `cp funnel/dist/terms.html deploy/` and `cp funnel/dist/consumer-health-data.html deploy/`. In "the funnel actually built", extend the list to `atuned-funnel atuned-quiz atuned-about atuned-buy privacy terms consumer-health-data`.
6. **The app**, by the shell and account seats, in `atuned_src/`: the footer in `shell/body.html` and its rule in `shell/head.html`; the consent line and the ticked boxes in `ui/login.js`; the recovery email field and the boxes in the onboarding account step; the Documents group, Export account data and Delete account in `ui/account.js` `accPrivacy`, and the `Improve the Models` row out; the Legal and Contact groups in `ui/account.js` `accHelp`; the renewal disclosure, the refund line and the ticked box in `ui/plans.js`. Then the full gate list in `CLAUDE.md`.
7. **Run** `node tests/funnel.js` and the voice check, `python3 .claude/skills/atuned-voice/check.py funnel/privacy.html funnel/terms.html funnel/consumer-health-data.html`. The voice check flags the markers as capitals. Those go away when section 9, item 2, is done.

## 11. What a lawyer must read

The six the owner's brief named, then the rest, with the section numbers as they now stand.

**Privacy policy**

- Section 10, moving data between countries. The server is in the United States. The safeguard is the lawyer's choice.
- Section 11, children. The age floor is proposed at 18 and is not decided.
- Section 7, how long data is kept, and what deletion reaches. Section 9, getting back a deleted account, and the 90 day backup. The event log is a placeholder.
- Section 2, the medical disclaimer, and the crisis line wording.
- Section 4, what leaves the device, and exactly what goes across at sign up, and section 5, who sees it. Health information, the practitioner grant, and the sentence "We do not read your stories". The conflict over the stories.
- Section 6, the reasons the law lets us use data, and section 13, the table of reasons and the rights for the European Economic Area and the United Kingdom, the representative, the data protection officer and the explicit consent. Section 12, rights wherever you live. Section 14, California. Section 17, the breach notice period.

**Terms**

- Section 8, renewal, cancellation and refunds. California's Automatic Renewal Law is prescriptive, and the 14 day right to cancel in Europe and the United Kingdom runs against the seven day rule.
- Section 15, disclaimers, and section 3, the medical disclaimer inside it.
- Section 16, limit of liability, and section 17, the clause on what you owe us.
- Section 5, age.
- Section 20, governing law, disputes, the venue, and whether to include arbitration and a class action waiver.
- Section 9, the licence to hold what a person writes. The research permission is gone.
- Section 12, practitioners and cohorts, and the duty a licensed practitioner may carry.
- Section 4, the statement that nobody reads what a person writes.

**Consumer health data policy**

- The whole page. It is short. The reading of "share" and "third party", the consent step, the six month backup allowance against our 90 days, the appeal route, and the way the page may carry nothing else.

## 12. Questions for the owner

Answered in round PA, and what was done with each:

| Question | His answer | Where it went |
|---|---|---|
| Company legal name | Tula Unified LLC. The older "Tool of Unified LLC" came from a dictation and is wrong. | Every document and page. `reviews/LEGAL-floor.md` still carries the wrong one. |
| Registered address | 1634 West 39th Place, Los Angeles, California 90062, United States | Policy section 1 and 19, terms section 1 and 22, health data page. Marked to confirm he wants it printed in public. |
| Email | The one on the server: `hello@atuned.world`, for privacy and for general. No separate privacy address. | All three documents. The policy says so. |
| Governing law and disputes | California and the United States. Los Angeles County for disputes is the draft's proposal. | Terms section 20. The venue is `[PROPOSED]`. |
| Refunds | None after seven days. | Terms section 8, written as a refund within seven days of a charge. `[PROPOSED]`. |
| People from the European Union and the United Kingdom | Yes, "it's the internet". | Policy sections 10, 12, 13. Requirements in 9.1. |
| Deleted accounts | Backed up 90 days, with a recovery process. | Policy sections 7, 8 and 9. Terms 18. |
| What travels at sign up | Not the birth data. The analytic data, like the summary data. | Policy section 4. The stories are an open conflict, below. |
| Agreement | A ticked box. | At account creation and at the paid step, 4.2 and 4.7. |
| Recovery | An optional recovery email at sign up. | 4.3, policy sections 4 and 9. |
| Research sharing | He did not understand the term. | Explained below. Cut from the policy as a launch feature. |

**Research sharing, in plain words.** It is an option that says: yes, you may use a copy of my readings, with my name left off, to help improve how the engine reads people. The engine's word lists get better the more results it learns from, so each person who says yes gives the product a little. It is a trade, and it carries weight. The European law needs a separate, explicit yes for it. Washington and Nevada need a separate yes before any sharing. And a story is free text that can hold a name, so "with my name left off" is a promise that cannot be kept in full. Recommendation: it is off, and it is not offered at launch. The policy says only that if we ever add it we will ask first. The in-app switch and the server route stay in the code, unused and unmentioned, until he decides.

Still open, each with a recommendation:

1. **The age floor.** Proposed 18. The recommendation is 18, with a box the person ticks at sign up. Under it, the United States children's privacy rule applies below 13, and some states add rules for anyone under 18. In the European Union a young person's own consent is valid from 13 to 16 depending on the country, and 13 in the United Kingdom. At 18 none of that is reached. The cost is turning away teenagers, who the product is not written for.
2. **A dormant account.** An account nobody opens. Recommendation: delete it after 24 months with no sign in, with a warning email 30 days before to the recovery email, if there is one. The backup rule then runs as for any deleted account. The reason: the European law asks that data is kept no longer than it is needed, and keeping health type data for ever on a free account is hard to defend. The cost: a person who returns at month 25 loses the server copy. They still have the record on their device. If he wants it kept until deleted, the policy says so and carries the risk.
3. **Who holds the key to stored records.** Recommendation: one named person, him, with the key in the host's secret store and a sealed second copy kept offline with one other trusted person, so the records are not lost if he is. No routine process reads a record. Any access is written down. The policy names the role, not the person. The cost: if he is the only holder and the key is lost, every stored record is unreadable. The emergency or police case in `DECISIONS.md` ("the key unlocks a record in an emergency") needs a written rule for who may ask, and a lawyer should write it.
4. **The stories.** Does the account copy include the story text? The documents say yes, because round OX said "all the data" and `DECISIONS.md` rules the story is stored for recovery. Round PA said "just their analytic data". Recommendation: yes, send the stories, because without them a recovered account is a set of readings with no source. The cost: the server then holds the most sensitive text in the product, and every promise about not reading it carries weight.
5. **Does the copy keep updating?** The documents say a copy is made when the account is created. Is every later entry sent too, and when? The answer changes what the policy can say about deletion.
6. **Research sharing.** Confirm it is off and not offered at launch (above).
7. **What proves an account is yours when the person has lost the email?** For restoring a deleted account. Recommendation: a Stripe receipt in the account's name, and the date the account was made. For a free account with no recovery email there is no proof, and the answer is that the restore cannot be done.
8. **How long does a restore take?** Recommendation: five working days, said in the policy.
9. **How long should the short event log stay?** Recommendation: 12 months.
10. **How many hours or days for a breach notice to a person?** Recommendation: without delay, and in any case within 30 days. The regulator in Europe is 72 hours, which is not negotiable.
11. **Does the European Union and United Kingdom sign up open at launch, or when 9.1 is done?** Recommendation in 9.1: when it is done.
12. **The seven day refund, in Europe and the United Kingdom.** The law gives 14 days to cancel a distance purchase. Recommendation: let the lawyer word a second box for the paid step, or give 14 days to everyone and say so. 14 days for everyone is simpler and costs a week of refund exposure.
13. **Is the address a place he wants printed?** If it is a home, a mailing address or a registered agent's address keeps it private.
