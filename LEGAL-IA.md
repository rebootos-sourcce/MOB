# Where the privacy policy and the terms live

> **Warning. Read this first.** The privacy policy, the terms and the one page breakdown in this repository are generic drafts written by an AI. They are not legal advice. A lawyer who knows your jurisdiction must review them before anyone relies on them, and the pages must not go live until they have. The clauses that most need that review are: moving data between countries, children, refunds and renewal, limits of liability and disclaimers, governing law and disputes, and the medical disclaimer. The exact section numbers are in "What a lawyer must read" below.

Round OX, 1 October 2026. His words: "I don't have a privacy policy or terms page. Where does that go in my information architecture? Figure out what that goes in, in the information architecture. Generate both with generic terms with a breakdown of our privacy policy."

Information architecture means where each page sits and how a person gets to it. This document decides that from the repository's own facts, then lists what must be true before the pages go live, then walks him through pasting the two addresses into Google and Stripe.

Files written for this round:

| File | What it is |
|---|---|
| `PRIVACY-POLICY.md` | The policy. Generic terms, drafted for a small subscription app, from what the product really does. |
| `PRIVACY-BREAKDOWN.md` | One page for a person: what stays on the device, what leaves, when, who sees it, how to delete it. |
| `TERMS.md` | The terms of service. |
| `funnel/legal/privacy.html`, `funnel/legal/terms.html` | The two static pages, rendered from the markdown in the funnel's own look. Self contained. |
| `funnel/legal/render.py` | Renders the markdown into the two pages. Edit the markdown, never the HTML. |

## 1. The answer

The two documents live on the public site, as their own pages, at two addresses:

    https://atuned.world/privacy
    https://atuned.world/terms

They are linked from the footer of every funnel page and from the app. Google's consent screen and Stripe each ask for these addresses, and both need a page anybody can open without signing in. The app is one file that people download and open from a folder on their own machine, so it cannot be the only home of a policy. It carries the two addresses as links and carries a short offline sheet of its own.

No new tab, no new section in Settings. The header of `ui/account.js` records that surface being measured as too dense once already, and seven sections is what it holds now.

## 2. The facts this rests on

Each one was read from the repository, not assumed.

- **The site deploys as flat files.** `.github/workflows/deploy.yml` stages the funnel pages, the app and an `index.html` into one Cloudflare Pages project named `atuned`. Today that is `/`, `/atuned-quiz`, `/atuned-about`, `/atuned-buy` and `/atuned`. A flat pair, `/privacy` and `/terms`, matches it. Cloudflare Pages serves `privacy.html` at `/privacy`. [CHECK: open both addresses after the first deploy, with and without `.html`.]
- **The funnel makes no network request, and the app makes one kind.** `CLAUDE.md`: the app gains network at exactly one seam, account calls. `tests/design.js` gate 7 fails on any other request. A footer link is a navigation the person chooses. It is not a request the page makes. [CHECK: confirm gate 7 and `tests/funnel.js` do not treat an outbound link as a request.]
- **The app has no footer today.** `atuned_src/shell/body.html` ends on the release rail. `reviews/LEGAL-floor.md` section 12 already designed one, and why it must sit outside every tab host: a tab renderer writes its host's whole `innerHTML` and would delete it.
- **Settings is not a tab.** It is reached from the profile button. `ui/account.js` has seven sections: Account, Profiles, Display, Security, Privacy, Billing, Help. The Privacy section already holds the Export and Delete controls. The Help section was designed in `reviews/LEGAL-floor.md` to carry a Legal group.
- **The door has three actions.** `ui/login.js`, `loginCard`: Log in, Create account, Continue without an account. Anything said under them reaches every person who enters.
- **The account step in onboarding is storyboard 14**, `ATUNED-funnel-storyboards-focus-group-validated.md`: "Keep what you found. Create your account to continue."
- **The paid step is Stripe's page.** `reboot-os/atuned/server/src/stripe.js`, `createCheckout`, sends a person to a page Stripe hosts. Terms can be shown there only through Stripe's own settings and one parameter.
- **Adding a page to `funnel/` breaks the build.** `funnel/BUILD-single.sh` lists every `.html` file in the folder and stops on any it does not know: `no dist name for ['privacy.html']: add it to OUT`. Measured on 1 October against a copy. `tests/funnel.js` also gates every page it finds. So the two pages sit in `funnel/legal/` until they are wired. That is the one place this round differs from what was asked: the files are at `funnel/legal/privacy.html` and `funnel/legal/terms.html`, not `funnel/privacy.html` and `funnel/terms.html`.

## 3. The sitemap

    atuned.world                                    Cloudflare Pages project "atuned"
    |
    |-- /                    funnel landing         footer: About, Tiers, The test, Privacy, Terms
    |-- /atuned-quiz         the test               door footer: Privacy, Terms
    |-- /atuned-about        about                  footer: same five
    |-- /atuned-buy          tiers                  footer: same five
    |        '--> Stripe Checkout (stripe.com)      Terms ride on Stripe's own settings
    |-- /privacy       NEW   Privacy policy         the address Google and Stripe ask for
    |-- /terms         NEW   Terms                  the address Google and Stripe ask for
    |-- /consumer-health-data   NOT WRITTEN         see section 8
    |
    '-- /atuned              the app, one file
         |
         |-- the door (login card)
         |       Log in, Create account, Continue without an account
         |       under them: the consent line and two links
         |-- onboarding, the account step ("Keep what you found")
         |       what goes across, the consent line, two links
         |-- Settings (profile button, no tab)
         |       Account    Delete account, when signed in
         |       Privacy    Documents: Privacy policy, Terms
         |                  Export and delete: this record, account data, account
         |       Billing    renewal disclosure, unchecked agreement, Terms link
         |                  Manage billing --> Stripe customer portal
         |       Help       Legal: What this is not, If you are in danger now,
         |                         Terms, Privacy policy
         |                  Contact
         '-- footer on every screen, outside every tab host
                 (c) company, What this is not, Privacy, Terms, Contact

External places that hold the two addresses:

    Google Cloud, OAuth consent screen   home page, privacy, terms, authorized domain
    Stripe, Settings, Public details     website, privacy, terms
    Stripe, Customer portal              privacy, terms

## 4. Placement, surface by surface

Every string below is the actual string. The bucket is one of the seven in `COPY.md`. Nothing here is built yet in the app. Everything under "app" is for the shell and account seats, and `atuned_src/` was not touched this round.

### 4.1 The public site, footer on every funnel page

| | |
|---|---|
| What | Two links added to the row of footer links already on each page: Privacy, Terms |
| Strings | `Privacy` and `Terms`. Bucket: label. One word each, as `reviews/LEGAL-floor.md` block A has them. |
| Where | The `foot-nav` row at the bottom of `funnel/index.html`, `funnel/about.html`, `funnel/buy.html`. On `funnel/quiz.html`, the door view's foot line, since the quiz has no nav row. |
| Why | Google requires the home page to link to the privacy policy. The funnel's home page is `index.html`. |
| Status | Not wired. Tested in a copy: 248 checks pass, 0 fail (200 before). |

### 4.2 The login door

| | |
|---|---|
| What | One line and two links under the three actions. |
| String | `By continuing you agree to the Terms and the Privacy policy.` Bucket: definition, because it says what pressing means. Terms and Privacy policy are links to `https://atuned.world/terms` and `https://atuned.world/privacy`, opening a new tab. |
| Where | `atuned_src/ui/login.js`, `loginCard`, directly after the `ob-acts` row of three buttons. |
| Why | "Continue" covers all three buttons, including Continue without an account, which is the one most people press. The terms apply to using the app at all. |
| Honest note | A line under a button is weaker evidence of agreement than a box the person ticks. `reviews/LEGAL-floor.md` section 7 says so. It is the owner's chosen line, and counsel should rule on whether the account step needs a ticked box instead. |
| Status | Not built. |

### 4.3 The onboarding account step

| | |
|---|---|
| What | The same consent line, plus one line that says what goes across. |
| Strings | `Keep what you found.` is storyboard 14's own line and stays. Then: `Creating an account sends your record to our server. It is stored scrambled. We do not read it. Delete the account and the copy is deleted.` Bucket: definition. Then the consent line from 4.2. |
| Where | The account step of onboarding, `atuned_src/ui/onboard.js`, when it is built. The TDD puts it after the first release, and the owner has ruled (round OX) that the account comes after the first release and that on sign up everything from their input is passed over. |
| Why | The person is about to send their own words to a server. The sentence is the plain words the owner asked for in `DECISIONS.md` ("consent asked rather than a policy assumed"). |
| Honest note | "We do not read it" is a statement of fact about us. It is true of the support console today (`reboot-os/atuned/server/src/ops.js`, `supportView`, never a body). A lawyer should look at it, because it is a promise. |
| Status | Not built. The app does not send the record yet. |

### 4.4 Settings, Privacy

| | |
|---|---|
| What | One new group called `Documents` above the existing `Export and Delete` group, and two new rows in `Export and Delete` when signed in. |
| Strings | Rows `Privacy policy` and `Terms`, button `Open` on each. Then, in `Export and Delete`, beside the two that exist (`Export this record`, `Delete this record`): `Export account data` with button `Download`, and `Delete account` with button `Delete`. |
| Notes under them | Export account data: `Everything we hold under your account, as one file.` Delete account: `Deletes your account and our copy of your record. Stripe keeps billing records the law requires. This device keeps its own record until you delete it.` |
| Where | `atuned_src/ui/account.js`, `accPrivacy`. |
| Why not a Legal section | The menu rule says a section is named for what it does, and Legal names a subject. `Privacy` is already where a person looks for export and delete. The account surface was already measured as too dense once (`ui/account.js`, header comment). The owner asked for a Legal section holding four things. Two of them are documents and sit under Documents. The other two are controls and sit beside the controls that already exist. All four are in one section. |
| One word per concept | `Delete` everywhere. Never remove. `Delete this record` is the device. `Delete account` is the server. The two labels differ so nobody deletes one thinking they deleted the other. |
| Status | Server routes exist (`GET /v1/export`, `DELETE /v1/me`). The app controls do not. The round MP entry in `TASKS.md` names account deletion as not built. |

### 4.5 Settings, Help, the Legal group

`reviews/LEGAL-floor.md` section 12 already designed this: a `Legal` group in `accHelp` with `What this is not`, `If you are in danger now` and `Terms of use`. Two changes. `Terms of use` becomes `Terms`, to match the footer and the page. And a fourth row, `Privacy policy`, is added. Each opens with `Open`. `What this is not` and `If you are in danger now` are on device sheets that work with no connection. The other two open the public pages.

A `Contact` group follows with the general address, as block F of that file has it.

### 4.6 The app footer

The footer from `reviews/LEGAL-floor.md` block A, as static markup in `atuned_src/shell/body.html` after the last tab host:

    (c) [year] [company legal name]
    What this is not  Privacy  Terms  Contact

Privacy and Terms are the two public addresses. Absolute addresses, not relative ones, because the app is opened from a folder and a relative link would point nowhere. Static, so it is there with scripts off.

### 4.7 The buy page and the paid step

The buy page (`funnel/buy.html`) gets the footer links from 4.1.

The app's paid step (`ui/plans.js`) carries block G from `reviews/LEGAL-floor.md`, in full:

    How the charge works. This is a subscription. [price] every month. It renews on its own until you cancel.
    Cancel from Billing in Settings. One press, no call and no email.

Under it, a box that starts unticked, as its own step and not bundled with the terms:

    I agree to a recurring charge of $12 every month until I cancel.

The price in that line is the tier's own price: $12, $29, $59 or $99. A `Terms` link sits beside the box. California's Automatic Renewal Law requires the renewal consent to be separate from acceptance of the terms. `TERMS.md` section 8 is written to match.

On Stripe's page, the terms agreement is shown only if two things are set (steps in section 6). Stripe's Public details need the terms address. And the Checkout Session needs one parameter, `consent_collection[terms_of_service]=required`, added in `reboot-os/atuned/server/src/stripe.js`, `createCheckout`. That change is in a different repository and was not made. [CHECK: Stripe's current parameter name, and that it refuses the session until the terms address is saved.]

### 4.8 Google's consent screen and Stripe's account settings

Not pages. Fields that hold the two addresses. Steps in section 6.

## 5. Why not somewhere else

- **Only inside the app.** Google and Stripe need public addresses. People open the app as a downloaded file, with no site around it.
- **One combined page.** Google asks for the privacy policy address on its own. Washington's health data law requires a separate privacy policy behind its own link (section 8). Two documents, two pages.
- **A `/legal/` folder.** Longer addresses to paste, and every existing page is flat.
- **A subdomain such as `legal.atuned.world`.** Google wants the privacy policy on the same domain as the home page. A subdomain works but adds a DNS record for nothing.
- **A new section in Settings.** See 4.4.

## 6. What the owner does, step by step

Do these only after the two pages are live (section 9). Do not paste an address that gives an error. Test each one first.

### Step 0. Check both addresses open

1. Open a browser in a private window. This is a window that remembers nothing about you, so it shows what a stranger sees.
2. Type `https://atuned.world/privacy` and press Enter. You should see the Privacy policy page. No password. No error.
3. Do the same with `https://atuned.world/terms`.
4. If either shows an error, stop. Nothing below will work.

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
   - **User support email**: choose your email from the list. Click **Next**.
   - **Audience**: choose **External**. Click **Next**.
   - **Contact information**: type an email you read. Click **Next**.
   - Tick the box that says you agree to the Google API Services User Data Policy. Click **Continue**, then **Create**.
7. On the left you now see a list: Overview, **Branding**, Audience, Clients, Data Access. Click **Branding**.
8. Find **App domain**. Fill in the three boxes:
   - **Application home page**: `https://atuned.world`
   - **Application privacy policy link**: `https://atuned.world/privacy`
   - **Application terms of service link**: `https://atuned.world/terms`
9. Scroll down to **Authorized domains**. Click **Add domain**. Type `atuned.world` only. No `https://`, no slash.
10. Scroll down to **Developer contact information**. Type an email you read.
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
   - **Website**: `https://atuned.world`
   - **Terms of service**: `https://atuned.world/terms`
   - **Privacy policy**: `https://atuned.world/privacy`
   - **Support email**: an email you read.
5. Click **Save** at the bottom.
6. Now the portal, which is the page where a customer cancels or changes plan. In the Settings list click **Billing**, then **Customer portal**.
7. Find the part called **Business information**. Paste the same two addresses into **Terms of service** and **Privacy policy**. [CHECK: the portal may read these from step 4.]
8. Find **Cancellations**. Switch on **Customers can cancel subscriptions**. Choose **Cancel at end of billing period**. This matches `TERMS.md` section 8.
9. Click **Save changes**. If the portal was never switched on, there is a button to do it here. `STRIPE-SETUP.md` covers that part.

Stripe will not show a terms checkbox on its own payment page until the server asks for it. That is a code change in the server repository, in section 4.7. It is not a dashboard step. Tell the server seat.

Stripe also reviews your website before it lets you take real money. It looks for what you sell, the prices, a way to contact you and a refund policy. The refund policy is in `TERMS.md` section 8, and it is still a placeholder. Fill it first or Stripe may hold the account.

## 7. What is built today, against what the policy says

The policy must be true on the day it goes live. This table is the test. "Server" is `reboot-os/atuned/server`.

| The policy says | Built today? |
|---|---|
| Record on the device, in browser storage, no cookies | Yes |
| No ads, no analytics tags, no outside requests from the pages | Yes. `tests/design.js` gate 7 and `tests/funnel.js` watch for requests. |
| Quiz keeps answers, never the story | Yes. `funnel/quiz.html`, `KEY`, and the story is held in memory. |
| Sign up, sign in, forgot password, sign out, plan read | Yes. `ui/auth.js`. The reset mail needs the mail provider's key set on the server. |
| Stripe checkout and Manage billing | Yes, both ends. Needs the four Stripe products and the keys. See `STRIPE-SETUP.md`. |
| Record passed to the server at sign up | **No.** Server sync exists. The app does not call it. |
| Research sharing | **No.** The server route exists. The in-app switch is a device flag and sends nothing. |
| Export account data | **No** control. Server route exists. |
| Delete account | **No** control. Server route exists. |
| Morning note | **No.** The server routes exist. The app has no push code. |
| Crash reports | **No.** The server route exists. The app does not send. |
| Name meaning lookup | **No.** No route exists. |
| Google sign in | **No.** |
| Practitioner grant screen | **No.** |
| A username of 3 to 20 characters | **No.** The server keys an account on email alone, and `ui/login.js` says the username field is gone. |
| Terms version and time recorded at sign up | **No.** The `accounts` table has no column for it. |

Rows marked No are marked in the documents as [CHECK]. The policy cannot go live saying a thing happens that does not. Two ways through. Build the thing first, or cut the row and say in the policy only what the build does. Cutting is a smaller policy and a smaller promise. The owner decides which.

Two statements in the product disagree with the policy and one must move:

- `ui/account.js`, `accPrivacy`, `Improve the Models`: "What would be used is the story with nothing that identifies you attached, and the record and the story are never held together." The server's research store copies imprints, releases and readings, and the account copy of the record holds the stories. The in-app sentence and the policy section 5 should say the same thing.
- `reviews/LEGAL-floor.md` block D: "Your name stays here." The owner's latest ruling is that on sign up all the data from their input is passed over, and `ACC_HELD` lists the name and birth details. The policy is written to the latest ruling and says the name goes across. Block D must not ship as written.

## 8. Gaps this round does not close

- **A third legal page.** Washington's My Health My Data Act, and Nevada's equivalent, require a separate consumer health data privacy policy behind its own link on the home page. It may carry nothing else. It has no size threshold and has a private right of action. If anyone in Washington or Nevada can sign up once the record leaves the device, a third page is needed, proposed at `/consumer-health-data`. It is not drafted. See `reviews/LEGAL-floor.md` section 6.
- **Europe and the United Kingdom.** The policy has generic wording for rights and for moving data out of those regions. Whether to accept sign ups from there at launch is the owner's call, and it comes before the wording. `reviews/LEGAL-floor.md` section 6 suggests refusing them until the consent flow and an impact assessment exist.
- **The sales claims.** `reviews/LEGAL-floor.md` section 2 names the throughput argument on the buy page as the largest legal exposure in the product, and says no disclaimer fixes it. These documents do not address it.
- **Backups and breach.** `ATUNED-architecture-security-review.md` records no tested restore drill and no retention policy. The policy's backup row and breach row are placeholders because nobody has answered them.

## 9. Before the pages go live

Every line must be true. Check them off in order.

1. A lawyer who knows his jurisdiction has read all three documents and the two pages, and signed off.
2. Every `[PLACEHOLDER` in `PRIVACY-POLICY.md`, `TERMS.md` and `PRIVACY-BREAKDOWN.md` is filled. Search each file for the word PLACEHOLDER. Zero hits.
3. Every `[CHECK` is resolved, either by confirming the build or by cutting the sentence. Zero hits.
4. The company legal name and address are settled, and match the Stripe account's business name and the Google consent screen. The repository holds two spellings (see questions).
5. The contact mailboxes exist and a person reads them. `hello@atuned.world` is already the sender address in the server's settings. A `privacy@` address does not exist yet. [CHECK: Cloudflare's Email Routing can forward addresses at `atuned.world`.]
6. The refund policy is decided, and the same words are in `TERMS.md` section 8 and in Stripe.
7. The age floor is decided. The sign up either asks or the terms carry it.
8. Section 7 is clean: every row either built, or cut from the policy.
9. Account deletion and account export work end to end, on a test account, including the Stripe side.
10. The cancel route works as `TERMS.md` section 8 says: Customer portal is on, set to cancel at the end of the period.
11. The renewal disclosure and the unticked agreement box are on the paid step.
12. The consent line is on the door and on the account step.
13. Someone has recorded which version of the terms each account accepted, and when. California's Automatic Renewal Law requires the consent record kept for three years. The server has no column for it.
14. The footer links are on every funnel page, and the home page links to the privacy policy. Google checks the home page.
15. The draft warning is taken out of the two pages, and the `noindex` line with it. Both are marked in `funnel/legal/render.py` and in the generated HTML. Take the warning out of the markdown, take the meta line out of the template, render again.
16. The two pages open in a private window at the two addresses and return a page, not an error. Section 6, step 0.
17. The date at the top of each is set.
18. The page that shows on atuned.world, `atuned-buy`, makes no claim that `reviews/LEGAL-floor.md` section 2 would fail.

## 10. Wiring, exactly

Do these after item 1 above. Tested in a copy of the repository: the funnel build passes, the six page set builds, and `tests/funnel.js` reads 248 passed and 0 failed against 200 before.

1. **Render the pages one folder up.** From the repository root: `python3 funnel/legal/render.py --wired`. It writes `funnel/privacy.html` and `funnel/terms.html`, with sibling links written the way the other funnel pages write them, and with the `tokens.css` link line the build asserts. Then delete the two copies in `funnel/legal/`.
2. **`funnel/BUILD-single.sh`.** In the `OUT` table, add `'privacy.html':'privacy.html', 'terms.html':'terms.html'`. Without this the script stops.
3. **Footers.** In each of `funnel/index.html`, `funnel/about.html` and `funnel/buy.html`, in the `foot-nav` row, after the link to `quiz.html`, add:

        <a href="privacy.html">Privacy</a> <a href="terms.html">Terms</a>

4. **`funnel/quiz.html`.** In the door view's foot paragraph, after `request of any kind.`, add the same two links. Add one rule beside `.foot`: `.foot a{color:var(--mid);display:inline-flex;align-items:center;min-height:44px;min-width:44px;text-decoration:underline;text-underline-offset:4px}`.
5. **`.github/workflows/deploy.yml`.** In "stage the site" add `cp funnel/dist/privacy.html deploy/` and `cp funnel/dist/terms.html deploy/`. In "the funnel actually built", extend the list to `atuned-funnel atuned-quiz atuned-about atuned-buy privacy terms`.
6. **The app**, by the shell and account seats, in `atuned_src/`: the footer in `shell/body.html` and its rule in `shell/head.html`; the consent line in `ui/login.js`; the Documents group, Export account data and Delete account in `ui/account.js` `accPrivacy`; the Legal and Contact groups in `ui/account.js` `accHelp`; the renewal disclosure and the unticked box in `ui/plans.js`. Then the full gate list in `CLAUDE.md`.
7. **Run** `node tests/funnel.js` and the voice check, `python3 .claude/skills/atuned-voice/check.py funnel/privacy.html funnel/terms.html`. The voice check flags the [PLACEHOLDER] and [CHECK] markers as capitals. Those go away when section 9, items 2 and 3, are done.

## 11. What a lawyer must read

The six the owner's brief named, then the rest.

**Privacy policy**

- Section 9, moving data between countries. The server is in the United States.
- Section 10, children. The age floor is proposed at 18 and is not decided.
- Section 7, how long data is kept, and what deletion reaches. Backups and the event log are placeholders.
- Section 2, the medical disclaimer, and the crisis line wording.
- Section 4, what leaves the device, and section 5, who sees it. Health information, the research store, the practitioner grant, and the sentence "We do not read your stories".
- Section 6, the reasons the law lets us use data. Section 11, rights by region. Section 13, the breach notice period.

**Terms**

- Section 8, renewal, cancellation and refunds. California's Automatic Renewal Law is prescriptive.
- Section 15, disclaimers, and section 3, the medical disclaimer inside it.
- Section 16, limit of liability, and section 17, the clause on what you owe us.
- Section 5, age.
- Section 20, governing law, disputes, and whether to include arbitration and a class action waiver.
- Section 9, the licence to hold what a person writes, and the research permission.
- Section 12, practitioners and cohorts, and the duty a licensed practitioner may carry.
- Section 4, the statement that nobody reads what a person writes.

## 12. Questions for the owner

These are the facts only he can supply. They are also the report's last heading.

1. What is the company's exact legal name? `reviews/LEGAL-floor.md` has "Tool of Unified LLC", from his dictation. The server's settings carry `com.tulaunified.atuned` and `hello@tulaunified.com`, which reads like "Tula Unified". The name on the pages, on Stripe and on Google must be the registered one.
2. What is the company's registered address, to print in the policy and the terms?
3. What email addresses should people write to, one for privacy and one for general questions? Is `hello@atuned.world` the general one?
4. Which state or country's law governs the terms, and where do disputes go?
5. What is the refund policy? Example answers: no refund once a month has started; a refund within a stated number of days; a case by case refund on request.
6. What is the age floor? The draft proposes 18.
7. Do people in the European Union, the United Kingdom, Washington and Nevada get to sign up at launch? Each yes needs more legal work. Each no needs a gate at sign up.
8. What is the rule for an account nobody opens? Delete after a stated time, or keep until deleted.
9. How long should a deleted account's backups last, and how long should the short event log stay?
10. Does the profile name and birth data travel with the record at sign up? The latest ruling says everything does. An older ruling in `DECISIONS.md`, "The name never leaves", says it does not. The policy follows the latest. Is that right?
11. Should the research switch copy the story text, or only the imprints, releases and readings? The in-app sentence and the server disagree today.
12. Who has access to the key that unlocks stored records, and is it only him? The policy says so by role.
