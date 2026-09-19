# The Account Area, Help And The Feedback Loop. Specification

Information architecture for the account area, the help surface, customer
support and the product feedback loop. Plus the identity roll-up on save,
ruled by the owner in the same block.

Nothing in this document has been built. No file outside this one was touched.
It is IA only: sections, order, contents, state, payload and route. It carries
no product code.

It builds on `DESIGN-ia.md` section 4, which specified a profile menu, and it
supersedes part of it. `DESIGN-ia.md` 4.1 says to keep the five reading rows in
the profile surface. The owner has now ruled the opposite in his own words:

> We don't need coherence and everything else, because coherence is all over
> the app. What we need are security settings, privacy settings, account
> settings, billing, your tier.

So the reading comes out of the account area entirely. Everything else in
`DESIGN-ia.md` 4.2 and 4.3 stands and is carried forward here with its
`DECISIONS.md` citations intact.

---

## 0. Measured Today, Before Anything Is Proposed

Chromium via Playwright, `source.html` at the working tree, 1600 x 1000 and
390 x 844, one reference case loaded and one blank profile. Every count below
is of controls that are actually visible: `button`, `a[href]`, `input`,
`select`, `textarea`, `[role=button]`, `[role=tab]`, `[tabindex]` not minus
one, filtered on computed display, visibility, opacity and a non zero box.

**Simultaneous choices, by surface and by region.**

    surface      total   left rail   right rail   top chrome   centre
    Settings        98          52           19           15        0
    Energetics     121          52           19           15       35
    Summary         86          52           19           15        0

Settings reads zero in the centre because its twelve controls sit inside
`#settings`, which the probe counted separately. The twelve are:

    Move to tier one          planup
    Manage billing            planman
    Tight / Comfortable / Wide        three density steps
    Dark / Snow / Punch / Glass / Glass white / Flat    six lightings
    Open the avatar           setav

**So the account surface offers 98 simultaneous choices and 12 of them are
settings.** Fifty two are the left rail, which on this surface is Awareness,
Fetters, States and Matrix: nineteen blueprint domains, nine fetter sliders,
four root domains, twelve archetypes and a matrix grid, none of which is a
setting and none of which a person came here to touch. Nineteen more are the
right rail. The working memory figure is about four and the project's own
target for a working screen is under twelve.

**Page height and horizontal bleed.**

    1600 x 1000   Settings   1000 tall, no horizontal scroll
    390  x 844    Settings   6888 tall, 8.2 screens, no horizontal scroll

Six point two screens more than the viewport, for a surface whose whole job is
twelve controls.

**The touch floor holds.** Zero controls under 44 by 44 on the Settings
surface at either width. That is the one measured thing about this surface that
is already right.

**Undo and redo are not the same size.**

    undobtn   137 x 44    arrow plus the words "Undo a story"
    redobtn    47 x 44    arrow only
    histpair  186 x 44

**Routes that do not exist.** Measured by walking the shell.

    billing              1 tap    profile button, then Manage billing
    tier and allowance   1 tap    profile button, Your Plan block
    lighting             1 tap    two routes, bar menu and Settings
    screen density       1 tap
    export               1 tap    but only on Energetics, as a clipboard copy
    import               no control anywhere. pImport exists and is unreachable
    customer support     no route
    product feedback     no route
    rate the product     no route
    security             no route
    privacy              no route beyond one sentence of copy
    who has sight        no route
    delete my record     no route
    sign out             no route

**Five of the things the owner asked for have no route at all. Two are real.**

**What the Settings surface actually prints on a blank profile.** Verbatim from
`innerText`, trimmed:

    Settings / Blank
    Everything here is held in this browser. Nothing has left this device.
    This Reading    Coherence 0 to 100: not read yet / Tier: not read yet /
                    Addresses carrying: 0 / Ground opened: 0 /
                    Next marker: Entry, 1 away
    Your Plan       On: Free / New ground: 100 of the gift left /
                    You can see: everything ... Move to tier one / Manage billing
    Screen          three steps
    Lighting        six lightings
    Your Record     Snapshots on file: 0 / Storage: writing
    Who You Are Becoming    Open the avatar

The first block on the account surface is a reading, and on a stranger it is a
reading that says "not read yet" four times. The first number a person meets on
their account page is a coherence scale.

**The help surface.** `helpSheet` at `atuned_src/ui/panels.js:648`. A modal
sheet, four blocks, one Close button. It explains the wheel, the three things
on screen, the quotients, and what the instrument does not claim. It contains
no support route, no feedback route, no rating, no version, no terms, and no
way to ask a question. Three of its five wheel rows describe a mouse:

    Move in and out   scroll
    Move the frame    click and drag
    Put it back       double click, or F

**The identity roll-up is already built and has two Save buttons.**
`atuned_src/ui/intakeui.js`: `iqSealedCard` at `:84`, the open form at `:132`,
`Save and close` at `:162`, and a second control also called `Save` at `:185`.
Measured: sealing the identity takes the Energetics centre from 35 controls to
26, and the surface total from 121 to 112.

---

## 1. What Comparable Products Actually Do

The owner said "very standard" and meant it. This section names what was looked
at and what was taken. Where a search summary was the only thing reachable, it
says so, because a claim about another product's IA is only worth its source.

### Health And Self Tracking

**Oura.** One menu, then Settings, then a flat list where Account holds the
email address, and data leaving the device sits in its own place: an
Integrations section for connected services, an Apple Health section that names
what is shared, and Shareable Reports as a separate route from Settings
entirely. App Lock is a privacy control, not a security one, and it lives in
the app rather than in the operating system. Consent to share is withdrawable
from the same place it was given.

*Taken:* sharing is its own section and never a row inside Account. A report
you hand to somebody else is a different object from a setting, and it gets its
own route. Withdrawal sits where the grant sat.

**Whoop.** The fifth tab is a Menu that carries everything not on the daily
loop: refer a friend, privacy settings, integrations, account profile and
membership. Privacy is reached through More and is its own screen. Membership,
which is the paid relationship, is named separately from Account.

*Taken:* membership and account are two words for two things and a person looks
for them separately. The daily loop does not carry account chrome.

**Apple Health.** A Sharing tab at the top level of the app, not inside
Settings. Each person or organisation you share with is one row. Tapping a row
gives Stop Sharing. Provider sharing gives Stop Sharing or Remove Account. What
is shared is enumerable per category, and stopping deletes the historical data
from the other side.

*Taken:* the shape of the practitioner grant list, exactly. One row per grantee,
what they see on the row, revoke on the row, immediate effect, and the
consequence of revoking stated before it is pressed. This matches
`DECISIONS.md` on the practitioner and `DESIGN-ia.md` 4.2.

**Strava.** A Privacy Controls tab in Settings with named sub blocks: Profile
Page, Activities, Group Activities, Product Improvement. Product Improvement is
a single opt in checkbox for contributing to community features, sitting inside
Privacy rather than inside a feedback surface.

*Taken:* "does my material help improve the product" is a privacy control, not a
feedback control. That is where the story refinement consent belongs, because
`DECISIONS.md` puts story without record into model refinement and that is a
use of a person's material.

### Practitioner Facing

**SimplePractice.** Consent forms live under Client Care settings. Who may see
a client's record is on the client's own Privacy tab, one primary clinician with
full access and explicit grants beyond that. Granting and revoking access to a
client's profile is documented as one operation with two directions.

*Taken:* the grant is an object with a direction and a date, not a boolean.
`DECISIONS.md` already says either side can start it and the person whose data
it is consents, which is the same shape.

### Subscription SaaS

**Google Account.** Five sections, and the order is the convention everybody
else copies: Personal info, Data and privacy, Security, People and sharing,
Payments and subscriptions. Identity first, then what is held about you, then
how it is protected, then who else can see it, then money.

*Taken:* the section order. Account, then Privacy, then Security, then sharing,
then Billing. Section 4 departs from it in one place and says why.

**GitHub.** Settings sidebar grouped under headings, with Account near the top,
a Security group in the middle, and billing under an Access group. Deleting your
personal account is documented as a real control in the account area and not a
support request.

*Taken:* delete is a control, in the account area, with its consequences stated.
That is also the obligation `CLAUDE.md` names once records go off device.

**Stripe.** Checkout in subscription mode for the purchase and the hosted
Customer Portal for everything after: update the card, update or cancel the
subscription, view and download invoices. The merchant builds no billing UI.

*Taken:* nothing to design. `DECISIONS.md` already rules Stripe never appears in
the app and `planOpen` at `atuned_src/ui/panels.js:634` already implements the
seam. The account area's Billing section is a plan statement and one button.

**Figma, and the general pattern.** The familiar section order across settings
pages is account and profile, then team and permissions, then billing, then
notifications, then integrations, then security. Which confirms two things: the
order above is a convention rather than an invention, and appearance or display
is conventionally its own section rather than a row inside Account.

### Settings Design Method

**Nielsen Norman.** Navigation categories must be descriptive, specific and
mutually exclusive. Where one item genuinely belongs in two categories, a
polyhierarchy with two parents is better than losing the person. Card sorting
and tree testing are how ambiguous labels get found.

*Taken:* the feedback destination has three doors and one destination, and that
is deliberate polyhierarchy, not duplication. `DECISIONS.md` already states the
same principle in this product's own words: selection is a route, not a funnel.

**Android, Help and Feedback screens.** Frequent help scenarios near the top,
linking directly to the relevant feature. Privacy policy and terms of service
placed less prominently. Help and Feedback lives in secondary navigation:
overflow, the bottom of a drawer, or Settings. Standard labels are "Help" and
"Send feedback". Issue reporting belongs on the help screen. In app review APIs
exist for the rating prompt.

*Taken:* the Help section's internal order, and the ruling that terms sit at the
bottom. Also the label set, because "Send feedback" is what people look for.

**Baymard, on collapsing completed steps.** Collapsing a finished step into a
summary is an established convention and an expected component. A collapsed
step that shows only its heading is the failure case: the person has to reopen
it to read back what they entered. The summary must carry the values, and an
Edit or Change link sits on the collapsed summary.

*Taken:* the identity roll-up, exactly. The existing `iqSealedCard` already
prints the values and the gaps and puts Edit on the card, which is the correct
pattern. Section 7 fixes what is around it.

### Feedback And Support

**The three path widget.** The convention is one destination with separate
forms behind separate labels: report a bug, request a feature, general
feedback. Plus periodically queued survey prompts, NPS, CSAT or CES, and a
separate prompt to rate in a store. Keep any single prompt to one or two
questions, because every question after the first lowers both response rate and
answer quality. Do not interrupt mid task; ask after a task completes or a
milestone is reached.

*Taken:* three labels, one destination, and the timing rule. The milestone in
this product is already identified and measured: `reviews/funnel-offer.md`
places the decision moment at the end of the fourth release run.

**Product market fit, the Sean Ellis question.** "How would you feel if you
could no longer use this product." Four choices. Forty percent very
disappointed is the fit threshold. It measures dependency rather than
satisfaction, which is why it resists politeness. Ask people who have used the
product meaningfully within the last two weeks, and follow with: the main
benefit received, what type of person would most benefit, and how they heard
about it. CSAT is the more useful instrument before fit and NPS after.

*Taken:* the alpha questionnaire's spine. This product is pre fit, so the
disappointment question is the primary gate and a 0 to 10 rating is the tracking
number beside it. The three follow ups map onto the owner's own three words.

**The outbox pattern.** A durable on device queue holding the intent of a
server bound write. The action is recorded to the outbox first, synchronously,
before any network call. A dispatcher drains it on app start, on connectivity
returning, on resume, and once eagerly right after the enqueue. Transient
failure, meaning offline, a timeout or a 5xx, leaves the entry pending and does
not mark it failed. A definitive rejection, meaning a 4xx, marks it failed with
a retry affordance. The UI reports the concrete result, "sent" or "queued, will
retry", and never the one it did not get.

*Taken:* the whole of section 5. It is also the shape `panels.js:634` already
uses for billing, so the product has the precedent in the file.

---

## 2. The Current Settings Surface, Row By Row

Seven blocks. For each: what it is, and where it goes.

**Header.** `renderSettings` at `atuned_src/ui/panels.js:469`. The eyebrow
"Settings", the profile name as an h2 with `.plain` so a surname is not title
cased, and one sentence: everything here is held in this browser, nothing has
left this device.

*Stays.* The sentence is the strongest thing on the surface and it becomes the
Privacy section's first line rather than a subtitle.

**This reading.** Coherence 0 to 100, tier, addresses carrying, ground opened,
next marker.

*Moves out, all five.* Coherence, tier and addresses carrying are printed on
Summary. Ground opened and the next marker are printed by `recRender` in
`atuned_src/ui/record.js:44`, with the scale honesty that the settings copy does
not carry. This block is a third copy of a reading on a surface that is not a
reading. It is also what makes a stranger's account page say "not read yet"
four times.

**Your plan.** `planSection` at `:604`. Tier in force, state when it is pending
or ended, new ground left, what you can see, the tier description, what is on
every tier, the annual line, the upgrade line, the equivalence line, then Move
to tier one and Manage billing, then one sentence that payment is off device.

*Stays, as the Billing and tier section.* It is the most finished thing on the
surface. Two notes. `planState` and `planOf` already answer what is in force
rather than what is written, which is the correct behaviour and the section
must keep saying the in force answer. And the allowance line prints a count
against a total, "400 of 400 left this month". That does not break the standing
ruling. The ruling is that a reading is not a score. An allowance is an
entitlement, and a count against an entitlement is the only honest way to state
one. Say this in the code comment so nobody deletes it later in the name of the
ruling.

**Screen.** Three density steps, `DENS` at `:425`.

*Stays, in a Display section.*

**Lighting.** Six lightings, `LIGHTINGS` at `:250`.

*Stays, in the same Display section, and the duplicate route in the top bar
stays too.* Two doors onto one setter is the polyhierarchy case, not a
duplicate: the bar menu is for changing it while looking at the instrument, the
Display section is for finding it when you do not know where it is. They share
`setLighting`, which is why this is safe.

**Your record.** Snapshots on file, and storage writing or blocked.

*Moves into Privacy.* Both are facts about what is on this device, which is a
privacy question, not a preference. Storage blocked is also the one state in the
product that means a person's work will not survive a reload, so it belongs
beside the export control rather than three sections away from it.

**Who you are becoming.** One button, Open the avatar.

*Moves out.* It is a door onto a drill about the reading. `DESIGN-ia.md` 4.3
already rules that nothing editable with an editor elsewhere belongs in this
surface. The avatar has its own route from Summary.

### What Must Move Out Because It Is A Reading And Not A Setting

Stated once, as a list, because this is the part of the brief that decides the
surface:

    coherence                    a reading. Summary prints it
    tier, meaning the band       a reading. Summary prints it
    addresses carrying           a reading. Summary prints it
    ground opened                a meter reading. record.js prints it
    the next marker              a distance against a ladder. record.js prints it
    the avatar door              a route into a reading

### What Stays Because It Is A Setting Or A Fact About The Account

    lighting            a preference, set once
    screen density      a preference, set once
    snapshots on file   a fact about what is stored here
    storage state       a fact about whether storage works
    tier in force       the account's state, not the person's reading
    allowance left      an entitlement, which may carry a count against a total
    billing controls    the seam

---

## 3. The Loop. Funnel, Product And Feedback As One Object

The owner's instruction is that these are one thing:

> That way we have our funnel, the product, and feedback loop all in one.

They are one object because each one's output is the next one's input. Written
as three entries and three returns.

### The Funnel

**Where a person enters.** A cold click from an advertisement, or a share link
from somebody who was given fifty patterns for sending it.
`reviews/funnel-strategy.md` sets the shape: top of funnel is the instrument
working on somebody who is not you, middle is the sixty three questions, bottom
is the install and the tier. The quiz is the middle and is defended there.

**What they see, in order.** A live reading of a reference case. Then what it
costs them, then what the instrument knows and does not. Then the ask.

**What comes back.** One record, half a kilobyte, keyed by a key and never by a
name. The score is paid on the web before any install, which
`funnel-strategy.md` measures as the single highest value change in the funnel:
the old step 6, download the app to see your score, cost 69 of 121 people who
had already answered sixty three questions.

**And one feedback touch, here.** One question at the end of the quiz, before
the score: what were you trying to fix when you found this. It is the marketing
block's first question, asked at the only moment the answer is uncontaminated by
having used the product. It is the same envelope as everything else in section
6 and it carries no identifier.

### The Product

**Where a person enters.** Install, then claim the record with the key. From
there the app is local again, which is the posture `TASKS.md` B3 already
describes.

**What they see.** Their own reading. The gift of a hundred patterns, everything
visible. Four release runs, because a run caps at twenty five.

**What comes back.** Nothing leaves. The meter writes unique ground and lines to
the record on device, snapshots accumulate in `history`, and `recRender` is the
surface that reads them back.

**The milestone.** `reviews/funnel-offer.md` measures the decision moment as the
end of the fourth run, when the person wants a fifth and the meter says two and
a half weeks. That is the same moment the feedback research says to ask: after a
task completes, at a milestone, never mid task, and only after meaningful use.
One moment serves both, which is the join that makes this one loop and not
three.

### The Feedback Loop

Three jobs, three labels, one destination. They are different jobs and a single
"feedback" box collapses them into the least useful one.

**One. Support. The job is "I am stuck and I need an answer."**
Entry: Help, top row, and from any failure message that offers it. What they
see: a category, a body, an optional reply address, and what will be sent,
listed before they press send. What comes back: a reference number immediately,
which is theirs, and a reply if they gave an address.

**Two. Rating. The job is "tell them what I think of this in five seconds."**
Entry: one prompt after the fourth run, once, dismissible, and permanently in
Help. What they see: two questions. The disappointment question, four choices.
Then 0 to 10. What comes back: an acknowledgement and nothing else. To us, a
number over time and the pre fit gate.

**Three. Product feedback, the questionnaire. The job is "I have things to tell
them and nobody has asked."**
Entry: offered once, immediately after the rating is answered and never before,
and permanently in Help. What they see: three blocks, marketing, production,
development, one at a time, each collapsing to a summary when finished. What
comes back: an acknowledgement, and the answers close the loop.

### How It Closes

Named, because "loop" is otherwise a diagram.

    the questionnaire's marketing block   ->  the landing page's promise
    the production block                  ->  the defect list and the gates
    the development block                 ->  what gets built next
    the rating over time                  ->  whether any of it worked

`funnel-strategy.md` says the page has a proof problem and that nothing may be
manufactured to solve it. The marketing block is the only honest source of the
sentences that page needs, because they are the person's own words about what
they came for. That is the loop: the funnel asks the question, the product earns
the answer, the feedback carries it back to the funnel.

**What must be instrumented for the next round to be able to tell.** Measured
locally, and only the counts leave, never a person:

    quiz completions, quiz starts                on the store, already needed
    runs completed before the rating prompt      local, count only
    rating prompt shown, answered, dismissed     three counts
    questionnaire offered, started, finished     three counts, plus per block
    support envelopes queued, sent, refused      outbox state, already needed
    the disappointment answer, four buckets      the pre fit gate
    time on each questionnaire block             to size the claim of four minutes

---

## 4. The Account Area. Sections In Order

One surface, six sections, in this order. It replaces `renderSettings` and it
keeps the surface in the centre stage rather than a modal, which was already
ruled and is already right.

The order is Google's convention with one departure. Display sits second rather
than last, because it is the most used section in this product today and Android's
own guidance is that frequent scenarios go near the top. Security and Privacy sit
in the Google order, identity then what is held then how it is protected, because
that is the order a person reasons in.

    1  Account            who this account is
    2  Display            lighting, screen, quiet
    3  Security           how this account is protected
    4  Privacy            what is held, who can see it, and getting it out
    5  Billing and tier   the plan, the allowance, the seam
    6  Help               support, feedback, rating, the questionnaire, terms

**Layout, one document order, two widths.** A section index and an open panel at
1600, a stacked list of sections at 390, out of the same markup, which is how
`ui/summary.js` already does three tracks and one sequence. One section open at
a time. Section headers take Title Case, bodies take sentence case.

**The rails do not render here.** `body.tab-settings .mid .col{display:none}`.
Measured effect: 98 simultaneous choices to 27, of which 15 are the top bar. The
account area is the one surface in this product with nothing to read against the
instrument, so the instrument's rails are noise on it. Two rules, one
measurement, largest single reduction available anywhere in this document.

### 4.1 Account

    Profile name            CURP.name, editable here
    Identity                the name and birth moment from Energetics, read only,
                            with a route to Energetics. Never a second editor
    Profiles on this device  a count, and the picker, moved out of the top bar
    Signed in as            not signed in
    Key                     no key yet
    Sign out                not available until sign in exists

Real today: profile name, identity read out, the profile list. Stub: signed in
as, key, sign out.

`DESIGN-ia.md` 4.1 already argues the persona selector out of the top bar and
into here, and that it is the first thing removed when sign in lands. That
stands. It is a demo control shipping in the navigation of a product about to
grow accounts, and the phone spec measured the consequence: a practitioner
holding the phone out to a client shows the client another person's name.

The key row, when it exists, is the one row in this product that can lose a
person everything. `DESIGN-ia.md` 4.2 has its shape and it is unchanged: masked,
a reveal, a copy, and one sentence that it is not held beside the name. Said
once, plainly, and never again.

### 4.2 Display

    Lighting        six lightings, sharing setLighting with the bar menu
    Screen          three density steps, sharing densSet
    Quiet           off

Real today: lighting, screen. New: Quiet, which `reviews/SPEC-phone.md`
specified and which nothing has built. One switch, per profile, that sets
reduced motion regardless of the system setting, drops the background wash and
stops the field breathing. It is not `prefers-reduced-motion`, which is honoured
separately and always.

Note a live defect while this section is being built: density persists through
`STORE.set('dens', k)` at `panels.js:432`, and lighting does not persist at all.
Three appearance controls, two persistence contracts, and a reload throws the
lighting away.

### 4.3 Security

Every row here is a stub until sign in exists, and the section still renders,
because a person is entitled to see that the answer is "nothing protects this
yet" rather than to find an empty panel.

    Sign in method          none. This record lives in this browser
    Password                not set
    Two factor              not set
    Sessions and devices    this browser only
    Recent account activity nothing to show

One line at the top of the section, and it is the true one: nothing about this
record is protected by a password today, because it is in this browser and
anybody with this browser has it. That is a security statement and it is also
the argument for sign in, made honestly rather than as a promotion.

When sign in lands, this section gains exactly what `TASKS.md` B names: a one
time code to the address or a signed claim link, because as described the email
alone was the key and anything that knows an address could retrieve a person's
somatic and psychological profile.

### 4.4 Privacy

The section this product has the strongest opinions about and the least surface
for.

    What is held here       first, and it is a list, not a sentence
    Snapshots on file       a count
    Storage                 writing, or blocked
    Who has sight           nobody
    Improve the models      off
    Export                 a file, and a clipboard copy
    Import                  pImport, which has no control today
    Delete this record      a real control with a real confirmation

**What is held here** enumerates rather than reassures. The current copy says
"everything here is held in this browser, nothing has left this device", which
is true and is a sentence. The section lists the objects: the identity and birth
moment, the sixty three answers, the charge on nine axes, the stories, the
imprints, the meter, the snapshots, the avatar and purpose values, the plan.
Enumerating is what makes export and delete legible, and it is what Oura and
Apple Health both do with shared categories.

**Who has sight** renders with the value `nobody` today, before the grant
mechanism exists, because `reviews/SPEC-phone.md` already ruled it and
`DECISIONS.md` requires a visible list and revocation and forbids a silent
default. When the grant lands it takes the Apple Health shape and the
`DESIGN-ia.md` 4.2 contents: one row per grantee, who they are, what they see,
who started it, the date consent was given, and Revoke on the row. Revoke is one
tap, takes effect immediately, is not buried, and is not a support request. The
grant flow states what the grant covers before consent, and the cohort lead
scope from `DECISIONS.md` is the list: fetters, saboteurs, complexes, hyper
complexes and their analytics, and never the spiritual material and never the
story cloud.

Still open and named as open so nobody builds past it: whether a practitioner
sees everything or only the tier scope.

**Improve the models** is the Strava Product Improvement control and it is off
by default. `DECISIONS.md` puts story without record into model refinement, and
that is a use of a person's own words, so it is a consent and not an
architecture detail. The row says what it means in one sentence: the story
without anything that identifies you is what refines the reading, and the record
and the story are never held together. A person who says no keeps the product
whole.

**Delete this record** is a control here and not a mail to an address, following
GitHub, and following `CLAUDE.md`, which says that once records are off device
access, deletion and breach obligations attach. Confirmation names what goes and
what cannot come back. While there is no store, it deletes the local record and
says exactly that, and does not claim to have deleted anything from anywhere
else.

**The promise.** `DECISIONS.md` calls the data ruling the strongest in the file:
we never sell anybody's data, ever. It belongs on this section, in one sentence,
where a person can read it. Not softened, and not repeated anywhere else in the
account area.

### 4.5 Billing And Tier

Almost entirely real today. `planSection` and `planWire` move here with their
comments intact.

    On                      the tier in force, never the tier written
    State                   only when pending or ended
    New ground              the allowance, and what is banking
    You can see             everything, on every tier
    What every tier carries PLAN_ALWAYS
    What the next rung is   planUpgrade, phrased as what it adds
    What that is worth      planWorth, throughput and never outcome
    Invoices                not available yet. Held by the processor
    Move to tier one        Checkout, through the host
    Manage billing          Customer Portal, through the host

Real: everything down to and including what it is worth. Stub: invoices, and the
two controls are real code with an honest failure, which is the pattern section
5 generalises.

Two things this section must not do. It must not print a price that is still
open, and `DECISIONS.md` has the ladder at 12, 24, 36 and 99 with tier one's
period still open between four hundred a month and a hundred a week. And it must
not read `pl.tier` directly, ever, because a record can say tier three and be
cancelled and the answer is free. `planOf` is the only reader and the comment at
`plan.js:132` says so.

### 4.6 Help

The owner put customer feedback in Help and asked for customer support there
too. The order follows the Android guidance: frequent scenarios first, terms
last.

    Ask a question          support. The top row, because it is why people come
    Report something broken bug. Same envelope, different category
    Rate the product        two questions, five seconds
    Product feedback        the questionnaire, three blocks
    How to read this        the existing help content, corrected
    Outbox                  what is waiting to send, and why
    What is new             the build, the commit, the md5
    Terms and privacy       last, per the guidance

**How to read this** is the existing `helpSheet` content and it needs one
correction independent of everything else here: three of its five wheel rows
describe a mouse, and the phone build cannot scroll to zoom or double click.
`SPEC-phone.md` section 9 S4 already lists this as a defect in four strings.

**Outbox** is a row with a count and a state, and it is the honest half of
section 5. It is in Help and not in Account because everything in it is a thing
the person sent to us.

**What is new** carries the build identity. The project already stamps the
commit and the md5 into `MONITOR.log` on every run, and the owner is already
told the commit and the md5 with every build. A person reporting a defect needs
the same string, and putting it on screen is what makes a bug report reproducible.

---

## 5. Network, Queueing And Honest Failure

`CLAUDE.md` is strict: `source.html` stays one file with no dependencies, and
the app gains network at exactly one seam, fetching a record at sign in. A
support query and a feedback submission both need network. This section
reconciles those without adding a second seam.

### The Resolution. One Host Function, Not A Second Seam

The app does not send anything. It hands an envelope to a host function, exactly
as billing already does.

    the app             builds an envelope, queues it, drains the queue,
                        and reports what actually happened
    the host            SEND_HOST, bound by the shell the same way bindStore
                        and bindPlan bind theirs
    the record store    the one networked party. It posts, and it is the same
                        service that already holds the quiz record

`bindSend(fn)` mirrors `bindPlan(fn)` at `panels.js:644`. No `fetch` in
`atuned_src/`. No `fetch` in the engine, which `hostfree.py` already enforces.
The seam count in the app stays at one, because the app still only ever talks to
a host binding, and the network still only ever happens in the store.

### The Outbox

Stored through `STORE`, key `source.outbox`, separate from `PKEY` so a feedback
queue can never corrupt a profile and a profile export never carries a queue.

One entry:

    id       a local random id. Never derived from anything about the person
    kind     support | bug | rating | questionnaire | quizintent
    made     ISO timestamp, to the minute
    state    queued | sending | sent | refused
    tries    an integer
    last     the last outcome, as a short reason string
    ref      the reference the host returned, when it returned one
    body     the envelope from section 6

Budget, and these are chosen numbers rather than measured ones: at most 20
entries and at most 64 KB. Body text capped at 2,000 characters per envelope,
which is about the length of a careful bug report. Over the cap, a new entry is
refused by name with the count and the cap stated, and nothing is silently
dropped, because a queue that discards the oldest entry to make room has lost a
person's words without telling them.

### The Drain, And The Four States

Recorded to the outbox first, synchronously, before anything is attempted. Then
drained on: submit, app start, `visibilitychange` to visible, and the moment
`bindSend` is called with a function where there was none.

What a person is told, and the wording matters because rule 3 is that a control
must never claim success before it has it:

    queued, no host bound
      "Queued. There is nowhere to send it yet, so it is held on this device
       and will go when there is."
      This is the honest state of the product today and it is not an error.

    queued, host bound, transient failure
      "Queued. It did not send and it will try again."
      Offline, a timeout, a 5xx. The entry stays. Nothing is marked failed.

    refused
      "Not sent. <reason>. It is still on this device."
      A definitive rejection. The row gains a retry control.

    sent
      "Sent. Your reference is <ref>."
      Only on an acknowledgement that carries a reference. Never on a request
      that merely did not throw.

Every one of those goes through `status(msg, kind)` in `ui/component.js`, the
one writer, and a failure holds on screen until something replaces it while a
confirmation clears after 2.4 seconds. `statusSaved` is the existing precedent
for a message that was lying and was fixed, and `planOpen` at `panels.js:634` is
the existing precedent for a control with nothing behind it that says so rather
than opening a dead page.

The submit button itself follows the `iqsave` pattern at `intakeui.js:298`: it
reports what happened in its own label, briefly, and the status region carries
the detail. It never reads "Sent" off a local enqueue.

### Feedback Timing

Under one second needs no indicator. One to three seconds gets a spinner. A send
is a network call with an unknown duration, so the submit control shows a
spinner from the moment it is pressed and the outcome replaces it. It does not
show progress, because there is nothing to show progress against, and it does
not block the surface, because the entry is already durably queued and the person
may leave.

---

## 6. The Feedback Payload, Field By Field

`DECISIONS.md` and `CLAUDE.md` both rule this and it is not negotiable. The
record never carries a customer id, a subscription id, an email, a key, a secret
or a token. `schema.js:51` says so in the profile's own comment. A feedback
envelope is a record leaving the device, so it gets the same discipline written
down before anything is built.

### What The Envelope Carries. The Whole List

    v          schema version, integer
    kind       support | bug | rating | questionnaire | quizintent
    made       ISO timestamp, to the minute
    build      the commit short hash and the md5 of the build
    surface    the TAB integer and its name at the moment the control was pressed
    lighting   the lighting token
    dens       the density token
    viewport   width and height, integers
    tier       the tier word in force, and nothing else from plan
    body       the person's own words, capped at 2,000 characters
    rating     integer 0 to 10, only on kind rating
    fit        one of four buckets, only on kind rating
    answers    fixed choice answers by question id, only on kind questionnaire
    reply      optional, and see below

Thirteen keys and a bounded body. `build`, `surface`, `lighting`, `dens` and
`viewport` are there because a visual defect is unreproducible without them, and
none of them is about a person.

`tier` is the one judgement call in the list. A defect reported by somebody
carrying a client book and a defect reported on a free profile are different
triage, and the tier word is the smallest thing that says which. It is the word
only, never a status, never a date, never an id. **Open, and it is the owner's:**
whether the tier word may travel at all.

### The Reply Address

A support query with no reply channel is a suggestion box, and the owner asked
for customer support and questions. So a reply address is permitted, under four
conditions, and the conditions are the whole design:

1. Only on kinds `support` and `bug`.
2. Typed per envelope, behind an explicit control that says what it is for. Never
   pre filled, because pre filling means it was stored.
3. **Never written to the profile.** Not to `who`, not to a new field, nowhere in
   `CURP`. It lives in the outbox entry and in nothing else.
4. Deleted from the outbox entry the moment the host acknowledges. What the
   person keeps afterwards is the reference, not the address.

**Open, and it is the owner's:** the stronger posture is no reply address at all,
where the reference number is the entire channel and a person checks back on it.
That costs the product the ability to answer somebody, and it is the only version
that carries no identifier at all. Recommend the four conditions above, and name
the alternative so the choice is made rather than defaulted.

### What The Envelope Must Refuse, By Name

Refused means the builder does not read the field, and a gate asserts the
envelope's key set is exactly the allow list. Never stripped afterwards, because
a strip that misses one field reads as a promise kept.

    who.first, who.middle, who.last       the name. It never leaves. Ruled
    who.sex                               a reference point, not a defect report
    who.born.date, .time, .place          the birth moment
    who.sealed                            a timestamp about the identity
    key                                   the record key. Emergency access only
    plan.status, .granted, .base,
      .carried, .since, .until            processor state
    any sk_, pk_, cus_, sub_ value        already swept by tests/design.js
    axes                                  the charge on nine axes. A reading
    laws                                  the twenty one measured laws
    intake.answers                        the sixty three answers
    gates                                 the cost multiplier
    story.entries                         the person's own stories. Never
    meter.unique, meter.firsts            which ground was opened, and when
    history                               every snapshot
    avatar, purpose                        the values a person entered
    seed                                   the stated type
    rituals                                the practice log
    any localStorage value not named above

The story is the hardest line and it is the one already named as open in
`DECISIONS.md`: a story is free text, so a name can be inside it. The same is
true of a `body`. This document does not solve it and does not pretend to:

- The body is never auto scrubbed. A scrub that misses a name is worse than no
  scrub, because it was presented as safe.
- One line sits above the field, before it is typed: this goes as you type it,
  so leave names out. That is the same posture as the microphone ruling, where
  the control says in one line that browser speech recognition reaches a browser
  vendor, because a promise about data is only worth what a person can check.
- A body is never joined to a record. The envelope carries no key and no id, so
  a body and a reading cannot be put back together on the other side even by
  accident. That is the same separation the product already promises between the
  record and the story.

### The Gate

`tests/design.js` already sweeps the build for `sk_`, `pk_`, `cus_` and `sub_`.
Add one gate that builds an envelope of every kind from a fully loaded reference
case and asserts, on the serialised JSON:

    the key set is exactly the allow list, no extra keys
    it contains none of who.first, who.middle, who.last as substrings
    it contains no substring of any story entry over 12 characters
    it contains no birth date, in any of the three formats the app writes
    it contains no axis name paired with a number
    the whole envelope is under 4 KB

A gate that checks the allow list catches the failure this class of bug actually
has, which is somebody adding a helpful field.

---

## 7. The Identity Roll-Up

The owner's ruling:

> Once I've input my starting energetics, the first name, middle name, last
> name, date, etc., when I hit save, I want that to roll up and become
> collapsed. The reason why is once a person hits save we don't want them going
> back there all the time willy-nilly. We want them to be able to hit an edit
> button if they want to change it.

**This is already built.** `who.sealed` in `schema.js:27`, `iqSealedCard` at
`intakeui.js:84`, the open form at `:132`, `Save and close` at `:162`, the seal
handler at `:273` and the edit handler at `:280`. Measured: sealing takes the
Energetics centre from 35 controls to 26. The schema comment at `schema.js:23`
already states the ruling.

So this section is not a design from nothing. It is what the collapsed state
shows, and four findings about what is around it.

### What The Collapsed State Shows

As built, and it is right, so it is recorded rather than changed:

    eyebrow     Who This Is
    name        first middle last, joined, or "Unnamed"
    facts       date, time or "time not known", place, sex, joined with a dot
    seed        "seeded from INTJ", when a type was stated
    gaps        what is missing, named
    control     Edit, on the card

It carries the values and not only a heading, which is the Baymard finding
exactly, and it prints the gaps, which is better than the convention: a rolled
up card that hides a blank date reads as complete while the birth chart quietly
runs on nothing. The code comment at `:92` already says this.

### Finding One. Two Controls Called Save

`Save and close` at `:162` seals. `Save` at `:185` does not. The owner's sentence
is "when I hit save, I want that to roll up", and half the Saves on this surface
do not.

Measured: every write on this surface already persists on change. Identity fields
at `:266` and `:269`, the sixty three answers at `:263`, the seed at `:284`, the
unknown time flag at `:288`. The top `Save` at `:298` calls `pSave()` and
`pSnap()`, and `pSave` is therefore redundant. **Its only unique act is writing a
history snapshot.**

So the fix is naming, not behaviour. The identity block's control is the only
thing called Save. The top control is called what it does, which is taking a
snapshot, and `recRender` in `record.js` is where a snapshot is read back, so
that is where it belongs. *Small. `ui/intakeui.js`, `ui/record.js`, and
`python3 tools/terms.py` because a word changes.*

### Finding Two. Edit Destroys The Seal Immediately

`:280` sets `who.sealed=''` and saves. So the stamp is gone the moment Edit is
pressed. Three consequences:

- There is no Cancel. Leaving the surface mid edit leaves the form open forever
  and the roll-up is lost.
- If a person then clears every field, `iqSealable` goes false, the Save control
  disables, and there is no route back to a card at all. That is the dead end.
- The stamp's date becomes the date of the last reopening, not the date the
  identity was stated, which is the less useful of the two.

The fix: `sealed` is a stamp on the record and is not what holds the view open. A
module scope view flag, `IQ_EDIT`, alongside `IQ_OPEN` at `:5`, decides whether
the form or the card renders. Edit sets it, Save and Cancel clear it, leaving the
surface clears it. `sealed` is written once, on the first seal, and a separate
`who.edited` carries the last change if that is wanted. *Small. `ui/intakeui.js`
only, plus one field in `schema.js` if `edited` is taken, which is additive and
loads under v1.*

### Finding Three. A Profile That Has Never Been Saved

Correct as built and must not change. `iqSealable` at `:81` returns false when
there is no name, no date and no place, so the card never renders, the form is
open, and the full explanation of why the birth moment is being asked for is the
first thing on the surface. A collapsed empty card would be a dead end on a
stranger's first pass, which the comment at `:77` already says.

The disabled Save at `:162` is worth resolving rather than filing as a defect.
The project's own posture is that a permanently disabled button is furniture, and
`paintUndo` hides the arrows rather than disabling them. This one is different
and is allowed: it is conditional, not permanent, and it carries an adjacent
sentence saying exactly what to do, at `:163`. Rule 10 is about a control hidden
with no affordance. A disabled control with its condition printed beside it is
the affordance.

### Finding Four. A Field Cleared After Saving

The card handles it: `gaps` at `:95` names no name, no date of birth, no place of
birth, and no time of birth where a date exists without one. The derived surfaces
also handle it, at `summary.js:180` and `:291`.

One real defect underneath. `:269` calls `renderSpirit` when a birth field
changes. `:266` does not, when a name changes. The six numerology readings are
pure functions of the name parts, so clearing a last name re-saves and leaves
the spiritual layer showing numbers computed from a name that is gone, until
something else forces a render. *Small, one line. `ui/intakeui.js:266` calls the
same re-render the born handler does.*

### And The Pattern Is Reused

The collapse-to-summary-with-Edit component that this section describes is the
same component the questionnaire's three blocks need in section 9. One
component, two callers. Build it once, in `ui/component.js`, and the
questionnaire costs less than it looks.

---

## 8. Help, And Customer Support

Specified in 4.6 as a section of the account area. Two notes on shape.

**It is a section, not a sheet.** The existing help is a modal at
`panels.js:648`, and the same argument that moved Settings out of a modal
applies: a modal has to be dismissed before the product is visible again, so
you cannot read the instruction and look at the thing it describes. The help
button in the top bar goes to the Help section of the account area.

**One destination, three doors, deliberately.** Support, rating and
questionnaire are reachable from Help, and the rating and the questionnaire are
also reachable from the prompt after the fourth run, and a failure message may
offer a support route. That is polyhierarchy and it is correct: NN/g says an
item that genuinely belongs in two categories gets two parents rather than
losing the person, and `DECISIONS.md` already states the same principle in this
product's own words.

**Support categories**, because an uncategorised query costs somebody a triage
pass and a person a round trip:

    Something is broken
    I do not understand a reading
    Billing or my tier
    My record, my data or privacy
    Something else

Five, which is inside the choice budget, and each one maps to a place in this
document rather than to a mood.

---

## 9. The Product Feedback Questionnaire

The owner's words:

> the product feedback is we need a marketing and production and development
> questionnaire.

**The content of this questionnaire is not mine and is already written.** The
marketing seat's `reviews/SPEC-feedback-instrument.md` carries the owner's own
eleven questions verbatim, mapped item by item onto a two tap gauge and a
sixteen item report, with what each answer decides. That document is the content
authority and this section defers to it on wording, response type and item
order. Section 17 reconciles the three places the two documents disagree.

What stays mine, because it is IA rather than content:

**The three block structure is right and is the owner's own frame.** Marketing,
production, development. The marketing seat's report uses the same three
lenses with M, P and D item prefixes, so the two documents already agree on the
spine.

**One block at a time, each collapsing to a summary when it is finished**, using
the same component as the identity roll-up in section 7. That is the IA
contribution: one accordion with summaries, two callers, built once.

**The rating comes first and is separate.** Two questions answered by many
people is worth more than sixteen answered by few, and the research is explicit
that every question after the first lowers both the response rate and the answer
quality. The marketing seat reached the same split independently, which is the
strongest evidence either document offers that the split is right.

**A block finished and not submitted is held locally and is not an envelope**,
so a person may stop after block one and the two blocks they did not answer do
not leave as blanks.

The three subsections below are the first draft this document made before
`SPEC-feedback-instrument.md` was found. They are kept because three of their
items are not in the owner's eleven and are worth adding, and they are marked as
candidates rather than as specification.

### The Rating. Two Questions, Before Anything Else

    1  How would you feel if you could no longer use this.
       Very disappointed / Somewhat disappointed / Not disappointed /
       I no longer use it
    2  Rate the product, 0 to 10.

Question one is the Sean Ellis question and it is the primary gate, because it
measures dependency rather than satisfaction and this product is pre fit. Forty
percent very disappointed is the threshold. Question two is the tracking number.

**A rating is allowed to be a score, and the standing ruling is not broken.**
The ruling is that a reading is not a score, and it is about readings of a
person. This is a person scoring the product. Write that in the comment, because
this is exactly the kind of line that gets deleted later in the name of a rule it
does not break.

**When it is asked.** Once, after the fourth release run, which
`funnel-offer.md` measures as the decision moment and which the feedback
research independently describes as the right moment: after a task completes, at
a milestone, after meaningful use, never mid task. Dismissible, and a dismissal
is not asked again. Permanently available in Help for anybody who wants to say
something unprompted.

### Block One. Marketing. Candidates

What they came for and what they expected. This block is the only honest source
for the landing page's promise.

    M1  How did you hear about this.
        Fixed list, plus other
    M2  What were you trying to fix when you found it.
        Free text, 200. Also asked at the end of the quiz, per section 3
    M3  What did you expect it to do that it did not.
        Free text, 200
    M4  Who else should be using this.
        Fixed list drawn from the six reference descriptions, plus other

M4 is Sean Ellis's "what type of person would most benefit", and the fixed list
is the six reference profiles in `atuned_src/ui/personas.js` described rather
than named, so the answers land on the segmentation the product already has.

### Block Two. Production. Candidates

Whether it works and whether it is built right.

    P1  Did anything break.
        Nothing / Something small / Something that stopped me
    P2  Where.
        Fixed list of the nine surfaces
    P3  Was anything unreadable, too small, or off the screen.
        Yes or no, plus which surface
    P4  How long did the sixty three questions take you.
        Under ten / ten to twenty / twenty to forty / over forty /
        I have not finished them

P4 measures the product's own stated claim of about fifteen minutes, which is
printed to people at `intakeui.js:200` and has never been checked against
anybody. P3 measures the phone findings that `SPEC-phone.md` lists and that no
gate covers at 390 today.

### Block Three. Development. Candidates

What to build next, and every option is a real named gap so the answers are
actionable rather than a wish list.

    D1  Which of these would you use next week. Pick up to three.
        Undo / the ritual builder / the accountability tracker /
        knowledge search / a practitioner seat / reminders
    D2  What is missing that is not on that list.
        Free text, 300
    D3  Would you pay for this today.
        Yes at this price / Yes at a lower price / Not yet / No

Every D1 option is named in `CLAUDE.md` or `DECISIONS.md` as not built: undo is
called the largest remaining gap, and the ritual builder, the accountability
tracker, boundary and purpose and knowledge base search are the owner's own list
of tools not yet in the app.

D3 is the one question whose answer the pricing needs and the one
`DESIGN-economics.md` says the model cannot advise on. It is asked as a
behaviour, four choices, and never as a number a person invents.

### The Three Candidates Worth Adding To The Owner's Eleven

Named, because the rest of both drafts overlap and these do not.

**P4, how long did the sixty three questions take you.** Fixed bands. The
product prints "about fifteen minutes" to people at `intakeui.js:200` and that
claim has never been checked against anybody. It is one tap and it audits a
sentence the product already says out loud.

**P3, was anything unreadable, too small, or off the screen.** Yes or no plus a
surface. `reviews/SPEC-phone.md` measured horizontal bleed, hidden scrollers and
canvas text collisions at 390, and no gate covers any of it at that width today.
One item turns a set of findings into a count.

**D3, would you pay for this today.** Four choices, never a number a person
invents. `DESIGN-economics.md` says ninety nine is the one figure the model
cannot advise on and that it must be instrumented from the first paying
practitioner. This is the cheapest instrument available for it.

### What Each Block Returns

One envelope per submission, kind `questionnaire`, `answers` keyed by question
id, free text bodies under the 2,000 cap with their ids.

---

## 10. Undo And Redo. Just The Arrows

> For undo redo, I just want the arrows.

Measured today: `undobtn` is 137 by 44 and carries the words "Undo a story",
`redobtn` is 47 by 44 and carries an arrow. The pair is 186 wide.

**The change.** Both become arrow only at 44 by 44. The pair goes from 186 to
about 94 plus the gap, recovering roughly 90 pixels of a top bar that already
wraps to a fourth row at 390.

**What has to move with the words, or a rule breaks.** The label existed for a
reason and the comment at `body.html` says it: a control that says only "undo"
makes a person guess what they are about to get. Two compensations, and they are
not optional:

1. `aria-label` carries the what, not the word, and it is updated by
   `paintUndo` every time the stack top changes. `paintUndo` at
   `panels.js:745` already computes `undoPeek()` and `redoPeek()` and already
   writes both into `title`. A tooltip is not reachable by a thumb and is not
   the same thing as an accessible name, so the string moves into `aria-label`
   as well as `title`.
2. The status line after the act already says it: `settle('Took back '+u.nm)`
   at `panels.js:773`. That is the recognition the label was providing, arriving
   one moment later, and it is already built.

**What does not change.** Both arrows stay hidden when their stack is empty, and
the pair stays hidden when both are, because a permanently disabled arrow is
furniture. The keyboard chords stay.

*Small. `shell/body.html`, `ui/panels.js:745`, and `tests/design.js` for the 44
floor on both.*

---

## 11. The ICP Rounds

Three walks, from three levels of the buyer grid in `BUYERS.md`, because a flow
that works at level 8 and fails at level 4 works for nobody who pays twice. The
grid peaks at 8, 9 and 10, collapses through 5 and 4, and floors at 1, and 4 and
5 are the largest population.

### Round 1. Sofia, 41, Somatic Practitioner. Grid High

**The job she is hiring the account area for:** "before I put a client in front
of this, show me what leaves this device."

Walk. Profile button. Privacy is the fourth section and she opens it first. What
is held here enumerates the objects. Who has sight reads `nobody`. Improve the
models reads `off` and she reads the sentence beside it. Export gives her a file.

**Where she stops:** at Security, second row, `Password: not set`. She reads the
line above it, that nothing about this record is protected by a password because
it is in this browser, and she stops to think about whether she can put a client
on a shared machine. That is the correct place for her to stop, and it stops her
because it is true, not because it is badly built.

**What she needs that this document gives her:** the grant list before the grant
exists, with the value `nobody`. The alternative, leaving the row out until the
mechanism is built, tells her nothing and reads as a silent default.

### Round 2. Derek, 39, High Performer. Grid Middle

**The job:** "tell me my tier and get out of the way."

Walk. Profile button. Billing and tier is the fifth of six sections and he has to
pass four to reach it. Today it is the second block on the surface.

**Where he stops:** he does not reach Help and never sees the rating prompt from
this route, which is fine, because the rating reaches him after the fourth run
where he is already standing.

**What the walk changes:** the section index means Billing is one tap from the
surface opening, not a scroll past four sections. On a phone the stacked list
puts it five rows down, which is one thumb flick. Acceptable. If a measurement
later shows Billing is the most opened section, it moves up, and the instrument
for that is in section 3.

### Round 3. Angela, 36, Seeker, Six Modalities. Grid Low, Largest Population

**The job:** "something is not working and I do not know if it is me or it."

Walk. She has a defect and today there is no route: support is unreachable, so
she leaves and does not come back. That is the whole finding for this round and
it is the strongest argument in this document for building Help before anything
else in it.

With Help built. Help button, top bar. Ask a question is the first row, because
it is why people come. Five categories and she picks "I do not understand a
reading". She types. Above the field, one line says it goes as she types it, so
leave names out. She presses Send and the product says: "Queued. There is
nowhere to send it yet, so it is held on this device and will go when there is."

**Where she stops:** right there, and this is the round that matters. That
sentence is either the most honest thing in the product or the most
discouraging, depending entirely on whether the Outbox row exists. With the row,
she can see her question is still there and has not evaporated. Without it, she
has typed into a void that thanked her.

**So the Outbox row is not optional and is not a nicety.** It is what makes the
honest failure survivable at the level of the grid where most of the population
is. It ships in the same commit as the send control or neither ships.

### Tally

    Sofia    stops at Security, correctly, on a true statement
    Derek    four sections between him and the one he wants. Acceptable, measured
    Angela   loses the product entirely today. Recovered by Help plus the Outbox

---

## 12. Build Order

Each step independently shippable and independently gated. Sizes honest against
this codebase.

### S. Small

**S1. The rails do not render on the account surface.** One CSS rule.
`shell/head.html`, `body.tab-settings .mid .col{display:none}`. Measured effect:
98 simultaneous choices to 27. Largest single reduction in this document and the
cheapest thing in it.

**S2. The reading comes out of the account surface.** Delete the five row "This
reading" block and the "Who you are becoming" block from `renderSettings`, at
`ui/panels.js:481` to `:496` and `:516` to `:521`. Nothing is lost: all five rows
render on Summary or in `record.js`. `tools/terms.py` runs because copy goes.

**S3. The identity roll-up, four findings.** `ui/intakeui.js`. The top Save is
renamed to what it does, Edit stops destroying the seal, a Cancel exists, and
the name handler re-renders the spiritual layer. Section 7.

**S4. The arrows.** `shell/body.html`, `ui/panels.js:745`. Arrow only, and
`aria-label` carries what `title` carries. Section 10.

**S5. Lighting persists.** It does not today and density does.
`ui/panels.js:252`, one `STORE.set`. It is in scope because the Display section
is being built around it and shipping a section whose main control forgets itself
on reload is worse than not having the section.

### M. Medium

**M1. The account area, sectioned.** `renderSettings` becomes six sections with a
section index at 1600 and a stacked list at 390, out of one document order. The
existing plan, density and lighting blocks move in unchanged. Stub rows render
with honest values. Section 4.

**M2. The outbox and the send seam.** `bindSend`, the queue in `STORE` under
`source.outbox`, the drain on four events, the four states and their four
sentences, and the Outbox row in Help. No `fetch` anywhere in `atuned_src/`.
Section 5. The envelope builder and its allow list gate land in the same commit,
because a payload discipline added afterwards is a payload discipline that has
already leaked once.

**M3. Help as a section, with support.** The existing help content moves out of
the modal and its four desktop verbs are corrected. Ask a question and Report
something broken, five categories, the pre send statement of what is sent, and
the reference on return. Section 4.6 and section 8.

**M4. The rating.** Two questions, the prompt after the fourth run, once,
dismissible, and permanently in Help. Needs the run count, which the meter
already has. Section 9.

### L. Large

**L1. The questionnaire.** Three blocks, eleven questions, the collapse to
summary component shared with the identity roll-up. Section 9. Large because it
is content as much as code and the fixed lists have to be right: every
development option is a real gap and every marketing option is a real channel.

**L2. Privacy, the real half.** Enumerate what is held, export as a file rather
than a clipboard copy, import with a control for the `pImport` that already
exists, delete with a real confirmation, and the improve the models consent.
Large because delete and import both cross the validation boundary and
`validateProfile` is the only thing standing behind it.

**L3. Security, when sign in exists.** Everything in 4.3 stops being a stub. It
is Large and it is not this document's: it is the fork, and it needs the one time
code or signed claim link that `TASKS.md` B names, because the email alone as a
key means anything that knows an address can retrieve a person's somatic and
psychological profile.

**L4. Who has sight, the real grant.** The Apple Health row shape, the consent
flow that states the scope before consent, and revoke on the row. Blocked on the
open item in `DECISIONS.md` about whether a practitioner sees everything or the
tier scope.

### Gates After Every Step

The five in `CLAUDE.md`, plus `tools/shots.js` at 1600 x 1000 and 390 x 844, and
then look at the images. Every step here changes what a person sees, so
`python3 tools/terms.py` runs on all of them. S2, M1 and L2 move code between
functions, so `python3 tools/equiv.py` runs and the diff is acknowledged by name.
M2 adds the envelope gate to `tests/design.js`. S4 needs the 44 floor asserted on
both arrows at both widths.

---

## 13. What This Deliberately Does Not Carry

Named so nobody adds it back as an oversight.

**No notifications section.** Push is in scope per `CLAUDE.md` and it is open
whether push may add a second file, against the one file rule. A notifications
section with nothing behind it is a set of switches that do nothing, which is
worse than an honest stub because a switch implies it was honoured.

**No community, no referral surface.** The referral is ruled at fifty patterns,
capped at four a month, and whether the community is Discord or beehiiv is open
in `DECISIONS.md`. The invite mechanic attaches to whichever holds the accounts,
so it cannot be placed yet.

**No badge or points ladder.** In scope after the fork and undesigned. It is also
the surface most likely to become a leaderboard, which the research already
rejected and which `DECISIONS.md` forbids twice.

**No developer analytics view.** `DECISIONS.md` puts it in scope and says it must
never ship to a person's build. It does not belong anywhere in an account area
and it is excluded from `source.html` by MANIFEST or it leaks the first time
somebody forgets.

**No invoices we render.** Stripe holds them and the Customer Portal shows them.
A billing UI we build is a billing UI we build wrong.

**No second editor for anything.** The identity is read out in Account and edited
in Energetics. `DESIGN-ia.md` 4.3 already rules this and it is the fastest way
this surface becomes a duplicate of another one.

**No email on the profile.** Not in `who`, not in a new field, not once. The
reply address lives in one outbox entry and dies on acknowledgement.

---

## 14. Open, And Whose Call

**His.**

- Whether the tier word may travel in a feedback envelope at all. Section 6.
- Whether a reply address is permitted, or whether the reference number is the
  entire support channel. Section 6.
- Tier one at four hundred a month or a hundred a week, which is the oldest open
  item in `DECISIONS.md` and still blocks printing a price in Billing.
- Whether a practitioner sees everything or the tier scope, which blocks L4.
- Whether the rating prompt may appear a second time, later, or whether one
  dismissal is final. Recommended final. It is his because it is the line between
  a prompt and a nag.

**Mine, once he has ruled.**

- The exact wording of the four send states. They are the sentences that decide
  whether an honest failure reads as integrity or as breakage, and round 3 turns
  on them.
- The fixed list behind "how did you hear about this", which has to match what
  the funnel actually spends on.
- Whether Display sits second or last. It is second here on a use frequency
  argument and the instrument in section 3 will answer it within one round.

---

## 15. Sources

Products and guidance looked at for section 1, with what was taken recorded
there.

- [Oura, create and manage an account](https://ouraringhelp.zendesk.com/hc/en-us/articles/42985223529747-Create-and-Manage-an-Oura-Account)
  and [export and share your data](https://support.ouraring.com/hc/en-us/articles/360025441594-Export-Share-Your-Oura-Data)
- [Whoop, navigating the mobile app](https://support.whoop.com/hc/en-us/articles/360042971753-Navigating-the-Mobile-App)
  and [the app navigation bar](https://support.whoop.com/hc/en-us/articles/360056034814-WHOOP-App-Navigation-Bar)
- [Apple Health, share and view health data](https://support.apple.com/en-euro/108323)
  and [share your data in Health on iPhone](https://support.apple.com/guide/iphone/share-your-health-data-iph5ede58c3d/ios)
- [Strava, privacy controls](https://support.strava.com/en-us/articles/15401951-privacy-controls)
- [SimplePractice, granting and revoking access to a client's profile](https://support.simplepractice.com/hc/en-us/articles/43120004142605-Granting-and-revoking-access-to-a-client-s-profile)
  and [client care settings](https://support.simplepractice.com/hc/en-us/articles/24683475477261-Understanding-the-Client-Care-settings-experience)
- [Google, manage your Google settings](https://support.google.com/accounts/answer/3118621?hl=en)
- [GitHub, managing user account settings](https://docs.github.com/en/account-and-profile/how-tos/account-settings)
  and [deleting your personal account](https://docs.github.com/en/account-and-profile/how-tos/account-management/deleting-your-personal-account)
- [Stripe, billing customer portal](https://support.stripe.com/questions/billing-customer-portal)
  and [customer management](https://stripe.com/en-hu/docs/customer-management)
- [Figma, view and manage account settings](https://help.figma.com/hc/en-us/articles/1500006061462-View-and-manage-account-settings)
- [Android, help and feedback screens](https://developer.android.com/design/ui/mobile/guides/patterns/help-content)
- [Baymard, always collapse completed accordion checkout steps into summaries](https://baymard.com/blog/accordion-checkout-usability)
- [NN/g, polyhierarchies improve findability for ambiguous IA categories](https://www.nngroup.com/articles/polyhierarchy/)
  and [intranet information architecture trends](https://www.nngroup.com/articles/intranet-information-architecture-ia/)
- [Product market fit survey questions, the Sean Ellis test](https://formbricks.com/blog/product-market-fit-survey-questions)
  and [the 40 percent rule explained](https://www.zonkafeedback.com/blog/product-market-fit-survey)
- [NPS vs CSAT vs CES for SaaS](https://posthog.com/product-engineers/nps-vs-csat-vs-ces)
- [In app feedback widgets, structure and timing](https://www.gleap.io/blog/in-app-feedback-widgets-guide)
  and [collecting in app feedback](https://userpilot.com/blog/in-app-feedback/)
- [SaaS settings page patterns](https://www.saasframe.io/categories/settings)

---

## 16. The Grade Delta

Measured where it can be measured, and stated as an estimate where it cannot.

    simultaneous choices, account surface       98  ->  27      measured, S1
    of those, in the centre                     12  ->   6 to 9  one section open
    page height at 390                        6888  ->  under 1400, estimated,
                                                        one section open of six
    routes that do not exist                     5  ->   0
    readings printed on a settings surface       5  ->   0       S2
    controls named Save on one surface           2  ->   1       S3
    top bar pixels recovered by the arrows            about 90   S4
    controls under the 44 floor                  0  ->   0       held

The two numbers that matter most are not in that table. Support goes from
unreachable to one tap, which is the difference between Angela leaving and
Angela staying. And the feedback loop goes from nothing to a payload with a
written allow list and a gate, which is the difference between collecting
feedback and quietly starting to hold personal data about people who thought
nothing left their device.

---

## 17. Reconciliation With The Marketing Seat's Instrument Spec

`reviews/SPEC-feedback-instrument.md` was written the same day by the marketing
seat and covers the feedback instrument in depth: the owner's eleven questions
verbatim, a two tap gauge, a sixteen item report, exact copy, the payload, the
placement and the arithmetic. It is the content authority and this document is
the IA authority. They agree on more than they disagree on, and the agreements
are worth recording because two documents reaching the same shape independently
is the only evidence either of them has.

### Where They Agree, Independently

- **The split.** A short gauge separate from a long report. Both documents reach
  it from different arguments, one from the response rate research and one from
  the segment.
- **Three lenses.** Marketing, production, development, which is the owner's own
  frame and which both documents keep as the spine.
- **Not a tab.** The report is its own host reached from the account area, and it
  is not a peer of the instrument. Their section 10.2 and this document's 4.6 are
  the same placement in different words: Help is a section of the account area and
  the report opens from it.
- **Free text is never auto scrubbed** and the person is told in one line what
  leaves before they type. Their section 12 and this document's section 6.
- **A rating is allowed to be a score** and the standing ruling about readings is
  not broken by it.

### Disagreement One. When The Invitation Fires

They invite the gauge once after the third reading prints on Summary, never in
the first session, capped at two invitations ever. This document places the ask
at the end of the fourth release run, which `reviews/funnel-offer.md` measures as
the decision moment.

**Resolution, and it is not a compromise.** The two triggers are for the two
different instruments.

- A reading printing is something the product did. A release run finishing is
  something the person did to themselves. Their own argument against inviting on
  the first reading, that a first impression of an instrument is a rating of the
  art direction, points the same way: a third reading is a third look, and a
  fourth run is four acts.
- So the **gauge** takes their trigger, because a two tap gauge is exactly the
  right price for a rating of a first impression and their cap of two protects it.
- The **report** takes the run four trigger, or stays pull only, because sixteen
  items is a real ask and the only moment a person is willing to spend four
  minutes on this product is the moment they have just decided they want more of
  it and been told to wait two and a half weeks.

### Disagreement Two. Whether The Payload Carries A Band. Load Bearing

Their payload carries `band`, a CQ band integer 1 to 10, and their section 8 is
explicit that without it every row is an average over a curve that `BUYERS.md`
says is not monotonic. That is a strong argument and it is right about the
analysis.

This document's section 6 refuses every reading of the person and permits only
the tier word. So the two documents disagree about one integer.

**The finding, and it is theirs turned around.** Their own refusal list excludes
the four letter type with this reasoning: in a panel of thirty, a stated type
plus a band plus a platform plus a theme is a cell of one for most testers, and
the type is the field that turns a pseudonymous row into a named one. That
argument does not depend on the type. Band plus platform plus theme is already
the cell. Their section 11.4 concedes it in the honest residual: the payload is
pseudonymous by construction and re-identifiable in practice by the person who
assembled the panel.

**The move that keeps both.** Coarsen the band rather than dropping it. Three
buckets, not ten:

    low       bands 1 to 4     the collapsed and incoherent end
    median    bands 5 to 6     the median range, 40 to 60
    high      bands 7 to 10    compounding and above

`BUYERS.md` peaks at 8, 9 and 10, collapses through 5 and 4, and floors at 1, so
the non monotonicity their analysis needs lives entirely at the ends and three
buckets preserve it. Ten buckets over thirty people is three people a bucket,
which is not an average anybody should read anyway, and it is the field that
makes the row a cell of one.

**Open, and it is the owner's**, because it is a privacy call and not a
measurement call. If he wants the ten, the ten is defensible on their argument
and the residual has to be said louder. Recommended: three.

### Disagreement Three. How Much Backend Is Assumed

Their section 11.1 specifies `POST /v1/fb` into a third database bound to a
Worker with no binding to the other two, rate limits, and a retention date on
the free text. That is more infrastructure than `CLAUDE.md` describes, and it is
grounded in `reviews/technology.md` section 3, which this document did not read.

**No conflict, and the two halves compose.** Their document specifies what is on
the other side of the wire. This document's section 5 specifies the app side:
the app never calls `fetch`, it builds an envelope, queues it durably in
`STORE`, drains it on four events, and reports one of four states without ever
claiming a success it did not get. That holds whether there is one database
behind the seam or three, and it is what keeps `source.html` at one file with no
dependencies and the engine host free.

Two things their side needs from this side and should be told: the envelope is
recorded to the outbox before any call is attempted, so their endpoint will see
retries of the same `fid`, and it must be idempotent on it. And a person may
delete their local outbox, so an envelope that never arrives is a normal
outcome and not a defect.

### What Each Document Owns From Here

    content, copy, items, response types     SPEC-feedback-instrument.md
    the gauge's trigger and its cap          SPEC-feedback-instrument.md
    the store, the endpoints, retention      SPEC-feedback-instrument.md
    where any of it sits in the account area this document, section 4
    the outbox, the four states, the seam    this document, section 5
    the allow list, the refusal list, gate   this document, section 6, with
                                             the band open per above
    the report's trigger                     this document, section 3
    the collapse component both need         this document, section 7
