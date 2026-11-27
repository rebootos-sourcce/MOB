# Should everything be broken out? Outside research, and the answer

Written 27 September 2026 by the technical director seat, in answer to
`TASKS.md` round HB. It covers modular architecture for a product at this
stage, what makes a product efficient, the `reboot-os` server read line by
line, a staged plan for moving MOB's engine onto a server, and how to protect
the method.

His words, verbatim: "So the schema should be broken out, the framework
should be broken out, like everything should be broken out, shouldn't it?
Isn't that what makes an enterprise product, that nothing is stacked on, so
it's efficient and optimised and each module system, is that not efficient
for a website? And then how do I protect my IP? [...] Go out to the internet,
search the best ways, run a deep research on this, and come back and give me
the right answers, the correct answers."

**How this was checked.** Every outside claim has a link. Some sources were
read in full: the OWASP cheat sheets, Cloudflare's own documentation source
and the Cloudflare pull request, all through GitHub. The others were found
and read through web search extracts, because this sandbox's network blocks
direct fetches from most sites. That includes martinfowler.com, arxiv.org,
usenix.org and the company engineering blogs. Where a quotation comes from a
search extract, it matches what several independent write-ups of the same
source say. Before anyone quotes one of those sources to an investor, it is
worth opening the link once.

Every number about our own code was measured today:
- `reboot-os` at commit `d23fff7`;
- MOB's engine as the built `engine.js` in the shared working tree, md5
  `a7c4b1b5...`, built at 07:27 UTC. That tree carried other seats'
  uncommitted engine edits on top of `93dc99c`, so the engine timings describe
  that build, not a clean commit. They are timings, not contracts, and a
  clean rebuild should land within the same factor of two.

Where a number is an estimate, it says so and says what it rests on.

## The short answer

- **Half of what you said is exactly right, and it is the half that
  matters.** "Broken out" in the sense of each part having one job, clear
  edges and no reaching into another part's insides: yes. The research is
  unanimous on that. And there is one line that must be a hard wall: what
  runs on the person's device against what runs only on your server. That
  wall is what protects the method and the money.
- **The other half is the most common early-stage mistake in the industry.**
  "Each module its own separate system", meaning separately deployed
  services, does not make a product efficient. At your stage it makes it
  slower, more expensive and harder to change. The people who invented and
  popularised that style say so, and so do Google, Amazon, Shopify, Segment
  and Istio. Details in section 1.
- **The industry name for what you are describing, done right, is a
  "modular monolith".** A monolith is one program that is deployed as one
  unit. A modular monolith is one deployed program made of strictly
  separated modules. Shopify runs one of the largest commerce businesses on
  earth this way.
- **You already have both halves of it, in two places, and neither is
  finished.** MOB's `atuned_src/` is already modules: 35 engine files, 26
  interface files and a load order that is enforced. `source.html` is the
  build output, the way an app store download is the build output of an
  app. `reboot-os` already has the server half: one server program, one
  database schema kept in its own versioned files, and a client kept
  separate from it. That is the correct modern shape.
- **But the `reboot-os` server as built does not protect your IP at all,
  and once live it would expose more.** It does no reading; the method still
  runs on the phone. And it serves the whole canon, the 232 entry word table
  included, to anyone on the internet without signing in, marked so any
  cache may keep a copy. That is a few hours to fix, and it must be fixed
  before it goes live (section 3).
- **The measured good news: MOB's engine can move onto that server nearly
  as it is.** It was written "host free", so it never touches a browser. It
  loaded and ran in a plain server process today with no changes. A reading
  took 1.9 milliseconds on average over 500 readings. One person's reading
  did not leak into the next person's. Section 4 has the numbers.

**My single clearest recommendation.** Do not split into many services. Put
`reboot-os`'s existing single Cloudflare server live, with the canon locked
behind sign in. Then move MOB's scoring engine into that same server as a
module, in stages: the paywall first, then the paid depth of the reading.
That is the version of "broken out" that actually protects you. Splitting
into many separately deployed services would cost weeks and a higher monthly
bill, and it would protect nothing extra.

## 1. What the research says about breaking things out, at your stage

### The words, in plain terms

| Term | What it means |
|---|---|
| Monolith | One program, deployed as one unit. Can be well organised inside or a mess |
| Modular monolith | One deployed program, divided inside into modules with strict boundaries that tooling enforces |
| Microservices | Each module is its own separately deployed program, and the modules talk to each other over the network |
| Client and server | The client is what runs on the person's device. The server is what runs on your machines. This split is not the same thing as microservices, and every product with accounts needs it |
| Schema | The shape of the data: which fields a record has and what type each one is |

A great deal of the confusion in this conversation comes from treating
"separate server and database" and "everything a separate service" as one
idea. They are different decisions. The first one is required for what you
are building. The second one is premature for a company your size, and
possibly for good.

### What the people who built this style actually say

**Martin Fowler**, the author who popularised the word "microservices".
[MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html) (2015):
"almost all the successful microservice stories have started with a monolith
that got too big and was broken up", and "almost all the cases where I've
heard of a system that was built as a microservice system from scratch, it
has ended up in serious trouble." His
[Microservice Premium](https://martinfowler.com/bliki/MicroservicePremium.html)
says the style carries a real cost, the premium, and advises: "don't even
consider microservices unless you have a system that's too complex to manage
as a monolith." His site publishes the counter case too
([Don't start with a monolith](https://martinfowler.com/articles/dont-start-monolith.html),
Stefan Tilkov). It argues that a monolith is hard to take apart later, so a
system whose boundaries are already well understood can start split. That
assumes the boundaries are known up front. A product still finding its shape,
as this one visibly is, does not know them yet.

**Sam Newman**, who wrote the standard textbooks on the subject (*Building
Microservices*, and [*Monolith to Microservices*](https://samnewman.io/books/monolith-to-microservices/)),
[speaking at QCon London](https://www.theregister.com/software/2020/03/04/microservices-guru-warns-devs-that-trendy-architecture-shouldnt-be-the-default-for-every-app-but-a-last-resort/1051458):
"microservices should not be the default choice", and they are "a last
resort". He also says microservices are not a good choice for most startups.
His recommended middle ground is a modular monolith
([InfoQ report](https://www.infoq.com/news/2020/05/monolith-decomposition-newman/)).

**Google.** In 2023 Sanjay Ghemawat, one of Google's most senior engineers,
and his co-authors published
[Towards Modern Development of Cloud Applications](https://sigops.org/s/conferences/hotos/2023/papers/ghemawat.pdf)
(HotOS 2023). Their diagnosis is that microservices "conflate logical
boundaries (how code is written) with physical boundaries (how code is
deployed)." Their proposal: write the program as one logical monolith with
clean modules, and let the runtime decide what runs where. Their prototype
cut latency by up to 15 times and cost by up to 9 times, compared with the
same application split into services. **This is the most direct answer to
"each module its own system".** Google's own finding is that modules belong
in the code, and they do not need to be separate deployments.

**Amazon Prime Video**, 2023. The team behind Prime Video's audio and video
monitoring service had built it as distributed services. It hit a hard
scaling limit at about 5 percent of the load they expected. They moved it
into a single process and cut its infrastructure cost by over 90 percent
([InfoQ](https://infoq.com/news/2023/05/prime-ec2-ecs-saves-costs);
[Michael Tsai's summary with quotations](https://mjtsai.com/blog/2023/05/05/scaling-up-the-prime-video-audio-video-monitoring/)).
Most of the money went on shipping data between the pieces. In fairness:
this was one service inside a larger system, not all of Prime Video, and
Amazon still runs services elsewhere.

**Segment**, 2018. Segment went from a monolith to more than 140 services
and then back to one, after "exploding defect rates", "plummeting velocity"
and a sense of being "mired in complexity"
([Goodbye Microservices](https://www.twilio.com/en-us/blog/developers/best-practices/goodbye-microservices);
[InfoQ](https://www.infoq.com/news/2018/07/segment-microservices)).

**Istio**, 2020. Istio is software whose whole job is managing microservices.
It merged its own four control components into a single program,
`istiod`, because "the value of independent rollout and independent scale
were not greater than the cost of orchestration"
([Istio's announcement](https://istio.io/latest/blog/2020/istiod/)). If the
team that builds microservice tooling folds its own pieces together, the cost
is real.

**Shopify.** It rejected microservices and instead divided one codebase into
components with strict, tool-enforced boundaries
([Deconstructing the Monolith](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity),
2019; [Under Deconstruction](https://shopify.engineering/shopify-monolith),
2020). It built a tool,
[Packwerk](https://shopify.engineering/enforcing-modularity-rails-apps-packwerk),
that rejects a change if one component reaches into another's private parts.
**This is precisely "nothing stacked on, each module its own system",
achieved inside one deployment.** MOB's `MANIFEST` and `hostfree.py` are a
small version of the same idea.

**Basecamp.** David Heinemeier Hansson,
[The Majestic Monolith](https://signalvnoise.com/svn3/the-majestic-monolith/)
(2016): a team of about twelve programmers serving web, iOS, Android, Mac,
Windows and email from one well-organised program. His argument is that a
small team can only keep that many platforms moving by choosing one program.

**Kelsey Hightower**, formerly Google's best known infrastructure advocate,
[described the failure mode](https://changelog.com/posts/monoliths-are-the-future)
in one line: "We're gonna break it up and somehow find the engineering
discipline we never had in the first place." Splitting a program does not
create discipline. It spreads the lack of it across a network.

**The case for splitting, stated fairly.** Khan Academy moved a one million
line Python program to about 40 Go services over more than three years
([Khan Academy engineering](https://blog.khanacademy.org/go-services-one-goliath-project/);
[the retrospective](https://blog.khanacademy.org/beating-the-odds-khan-academys-successful-monolith%E2%86%92services-rewrite/)).
It worked. It also took a full engineering organisation more than three
years, it ran incrementally with the old and new systems compared side by
side, and it started from a monolith. That is the pattern every source above describes: split late,
split for a named reason, split along lines you have already learned.

**What the largest study of software delivery found.** Google's DORA
programme has surveyed tens of thousands of teams. It found that what
predicts good delivery is a "loosely coupled architecture": teams can
change, test and deploy their part without coordinating with everyone else
([DORA, loosely coupled architecture](https://dora.dev/devops-capabilities/technical/loosely-coupled-architecture/)).
That comes from boundaries, not from deployment count. A loosely coupled
monolith meets it. A set of services that must all be released together
does not.

### The honest verdict for this company

The rule that falls out of all of the above: **the number of separately
deployed pieces should match the number of teams that need to ship
independently.** You have one founder and one team of AI seats working off
one backlog. That is one deployable server and one client, with strict
modules inside each.

## 2. Is "nothing stacked on, each its own system" what makes it efficient?

**No. For a website it is usually the opposite.** It is a very common
misconception, and here is the arithmetic.

**Where the time goes.** When one module calls another inside the same
program, the call takes nanoseconds, billionths of a second. When one
service calls another over the network, even inside one data centre, a round
trip takes about 500 microseconds. That is roughly ten thousand times
longer, before any work is done. Across the internet a round trip runs tens
to about 150 milliseconds
([Jeff Dean's latency numbers](https://gist.github.com/hellerbarde/2843375);
[Colin Scott's updated figures](https://colin-scott.github.io/blog/2012/12/24/latency-trends/)).
Measured today: **MOB's whole reading takes 1.9 milliseconds** in one
process. Split into four services, it would spend more time on network
hops than on the reading itself. That is exactly the Prime Video story.

**Where the money goes.** Each service is its own deploy, its own secrets,
its own logs, its own tests and its own failure mode, which Fowler calls the
premium. On a serverless platform like Cloudflare, each hop between
services is also a billed request.

**What "efficient for a website" really means.** A person feels two things.
How many bytes their device downloads, and how many times it waits on the
network. Splitting the server into services helps neither. The things that
do help:

- Send less. The packed build is 417 KB against 1.03 MB; the comment
  stripped build takes off another third (`SECURITY-IP.md` section 2).
- Wait less. Compute locally what does not need protecting, so a tap never
  waits on a network round trip.
- Cache what does not change.

**Where your instinct is right.** There are real benefits to separation, and
they come from the client and server line, not from counting services:

| Benefit | Where it really comes from | Needs microservices? |
|---|---|---|
| Protecting the method | Code that runs only on your server and is never sent to a device | No. One server does it |
| An honest paywall | The server decides the plan and the spend, not the device (OWASP, below) | No |
| Protecting people's data | Encryption, access control and audit on the server | No |
| A smaller attack surface per part | Strict module boundaries, least privilege, secrets held by only the part that needs them | Helps a little, at your scale not worth the cost |
| Independent scaling | Scaling one part without the others | Only matters when one part is thousands of times hotter than the rest. Not true here |
| Independent deployment | Teams shipping without waiting on each other | Only with more than one team |

OWASP, the industry's standard security reference, states the principle that
makes the first two rows true: "Developers must never rely on client-side
access control checks. While such checks may be permissible for improving the
user experience, they should never be the decisive factor in granting or
denying access to a resource; client-side logic is often easy to bypass"
([OWASP Authorization Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Authorization_Cheat_Sheet.md),
read in full). This is the correct part of "it should be broken out": the
decision about what someone may see belongs on the server.

**On "the schema should be broken out".** Yes, and in `reboot-os` it
already is:

- the database schema lives in eight numbered migration files, each one a
  script that changes the database one step and is kept in order
  (`atuned/server/migrations/`);
- the person's record shape is defined once, in `data/user_schema.json`.

MOB has its own schema module (`engine/schema.js`) with `validateProfile` as
the entry check. The remaining work is to make the two sides share one
definition, so that the phone and the server check a record against the same
rules. Today the `reboot-os` server checks only a record's kind, id and
version, plus a 200 KB size limit, and stores the body without looking at it.
That is fine for a backup. It stops being fine the moment the server
computes a reading from that body (section 4, stage 2).

**On "one flat file is harder to read".** For the team, it is not the
working copy. The working copy is `atuned_src/`, in modules. For an outsider,
a single shipped file is exactly as readable as twenty shipped files: the
browser receives all of it either way. Splitting the shipped file protects
nothing (`SECURITY-IP.md` section 2). What protects the method is keeping it
off the device, which is section 4.

## 3. `reboot-os`, read line by line: is it doing it right?

Read directly: `atuned/server/src/` (797 lines in six files), all eight
migrations, the deploy workflow, and the client's sync file
`atuned/src/42b_cloud.js`. Its test suite was run today and passed 30 of 30.

### What it gets right

- **One server program, not many.** One Cloudflare Worker (a small program
  Cloudflare runs on its machines on demand) with separate files for
  accounts, store purchases, encryption, push notifications and operations.
  That is a modular monolith on the server, the shape section 1 recommends.
- **The schema is its own layer.** Versioned migrations, and a canon
  migration generated from one source file by a tool, with a gate that fails
  if they drift apart.
- **The server is the authority on the plan.** The plan is derived from what
  Apple or Google confirm, never set by the phone
  (`migrations/0003_entitlements.sql`: "the client never sets its plan").
- **Records are encrypted at rest, properly.** AES-GCM, a standard strong
  cipher, with a fresh random value per write. Each sealed record is tied to
  the row it belongs to, so a body copied onto another person's row fails to
  open (`src/seal.js`). It refuses to store anything if the key is missing,
  rather than store it readable.
- **Sign in is careful about details most first versions miss:**
  - passwords are compared in constant time, and a sign in with an unknown
    email takes the same time as a wrong password, so timing gives nothing
    away;
  - failed attempts are limited per email and per address;
  - session tokens are stored only as hashes;
  - a password reset signs out every device.
- **Database queries cannot be hijacked.** Every query passes its values
  separately from the query text. Two queries build text: one inserts only
  question mark placeholders, and the other takes a table name that must
  match a strict pattern and exist in a lookup table. Both are safe.
- **Deletion and export exist.** `DELETE /v1/me` removes every row that
  names the person, and `GET /v1/export` hands them everything held about
  them. Privacy law expects both.
- **Research copies are filed under a separate id**, and only while consent
  is on.

This is competent, modern work. On shape, the answer to "is this doing it
right" is yes.

### The gaps, most serious first

**1. It serves the method to anyone, without sign in. Severity: high for IP,
a few hours to fix.**
- In `src/index.js`, the list of routes that need no sign in (`PUBLIC`)
  includes `GET /v1/canon` and `GET /v1/canon/:table`.
- The price list for tables is empty: `CANON_TIER = {}`.
- Both answers carry `cache-control: public, max-age=3600`, which tells any
  cache in between that it may keep and serve a copy.
- The canon holds 127 tables, and its index lists `LEX` ("the lexicon",
  232 entries), `LEX_TIER` and `LETGO`.
- Once deployed, anyone can download the word table as clean data in one
  request per table, with no need to read any code. That is a better export
  of the method than today's shipped file offers.
- The server README says "The build will read this instead of carrying it",
  which is the right intent: stop shipping the tables and fetch them. But
  fetching only protects anything if the fetch needs an account.
- **Fix before deploy:** take both canon routes out of `PUBLIC`, give the
  sensitive tables a tier, mark the answers private, and rate limit them.

**2. The server does no reading, so the split protects people's data but
not the method or the depth of the paywall. Severity: high against your
goal.**
- The first comment in `src/index.js` says it plainly: "nothing here reads
  canon to shape a reading."
- The reading runs on the phone in the `reboot-os` app too. So the split, as
  built, answers "protect people's data" and "sync between devices". It does
  not answer "protect my IP".
- Section 4 is the plan that makes it answer both.

**3. Passwords are hashed below today's recommended strength, because of a
Cloudflare limit. Severity: medium.**
- Password hashing is deliberately slow, so that a stolen database is slow
  to crack. The server runs PBKDF2 at 100,000 rounds (`src/index.js`,
  `pbkdf2`).
- OWASP recommends 600,000 rounds for this exact method, or better, Argon2id
  ([OWASP Password Storage Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md),
  read in full: "PBKDF2-HMAC-SHA256: 600,000 iterations").
- The 100,000 is not a mistake by the team. Cloudflare Workers refuse any
  count above 100,000
  ([workerd issue 1346](https://github.com/cloudflare/workerd/issues/1346)).
- A proposal to raise the cap to one million
  ([workerd pull request 7550](https://github.com/cloudflare/workerd/pull/7550))
  was checked today: open, not merged.
- **Options:**
  - Argon2id compiled to run inside the Worker. An estimate of a day of
    work plus measuring its time per sign in.
  - A sign in service run by a specialist company.
  - Accept 100,000 for launch and write the reason down.

  This is the one place where Supabase's built-in sign in service would have
  been an advantage. It is not a reason to switch providers.

**4. The support console sits on the public internet behind one shared key.
Severity: medium.**
- `/admin` and `/v1/admin/*` accept a single `ADMIN_KEY` from anyone who
  has it.
- The audit log records "plan set by support", but not which person did it.
  The console can delete accounts.
- Cloudflare Access, Cloudflare's own sign in gate for internal tools, can
  put a per-person login in front of those paths. It is free for up to 50
  people
  ([Cloudflare Zero Trust plans](https://www.cloudflare.com/plans/zero-trust-services/);
  [how to publish a protected app](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/)).
  An hour of configuration, estimated.

**5. The research copy is pseudonymous, not anonymous, and the law treats
that difference seriously. Severity: medium, legal.**
- Filing shared records under a separate research id is good design. Under
  European law it is "pseudonymisation": the data can still be linked back
  to a person by whoever holds the key, and so it stays personal data.
  Health data is a special category with stricter rules
  ([EDPB Guidelines 01/2025 on pseudonymisation](https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf);
  [GDPR Article 9](https://gdpr-info.eu/art-9-gdpr/)).
- In the United States, two rules apply to a wellness app outside the
  medical privacy law (HIPAA):
  - the FTC's updated Health Breach Notification Rule, in force since 29
    July 2024, covers health and wellness apps and requires breach notices
    ([FTC announcement](https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule));
  - Washington State's My Health My Data Act, in force since March 2024,
    requires a separate consent to collect consumer health data and another
    to share it, and lets individuals sue
    ([Washington Attorney General](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy);
    [IAPP overview](https://iapp.org/resources/article/washington-my-health-my-data-act-overview)).
- `reboot-os` has one consent switch, for sharing. Whether sign up counts as
  consent to collect is a question for a lawyer, and it belongs on the list
  `SECURITY-IP.md` already hands to one.

**6. Smaller items, each hours of work.**
- The session token lasts 90 days and is stored where any script in the app
  can read it. If an attacker ever gets their own script into the app, they
  hold the account for 90 days. A shorter life, or rotation, limits the
  damage.
- `ALLOWED_ORIGIN = "*"`. This setting says which websites may call the
  server; the star means any. It is already marked to narrow at deploy, and
  should be.
- D1, Cloudflare's database, allows 1,000 queries per request on the paid
  plan and 50 on the free one
  ([D1 limits](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/d1/platform/limits.mdx),
  read in full). A 500 record sync with sharing on can issue close to 1,000
  statements. Whether a batched group counts as one query or many was not
  verified; it needs one test against a real database.
- Each D1 database handles one query at a time, so its throughput is set by
  query speed. At one millisecond a query that is about a thousand a second
  ([D1 documentation](https://developers.cloudflare.com/d1/)), far beyond
  launch needs, and the known remedy exists if it is ever reached.

**7. The process gaps already on record.** It has never been deployed. The
`main` branch does not contain it. GitHub has stopped running its checks.
And it talks to the `reboot-os` Atüned app, not to MOB. See
`REBOOT-OS-STATUS.md`.

### On Supabase against Cloudflare, since it keeps coming up

The research does not settle this in either direction, and it does not need
to.

- Supabase's strongest feature is row level security: the database itself
  refuses to return one person's rows to another, even if the application
  code has a bug
  ([Supabase docs](https://supabase.com/docs/guides/database/postgres/row-level-security)).
- That protection is only as good as its configuration. In 2025, 170 of
  1,645 apps generated by one AI builder on Supabase were found with their
  row security missing, exposing user data to anyone
  ([CVE-2025-48757 write-up](https://www.superblocks.com/blog/lovable-vulnerabilities)).
- `reboot-os` enforces the same rule in its server code, with every query
  filtered by the signed in account.

Neither choice changes section 4. **The sequencing recommendation stands as
`REBOOT-OS-STATUS.md` put it: Cloudflare as built, which you ruled on 25
September ("Cloudflare, for now, kept", `DECISIONS.md`).** Switching costs
one to two weeks to arrive where the team already is.

## 4. A staged plan to move MOB's engine behind the server

### First, what was measured today

MOB's engine is built as `engine.js`, with no browser code, and
`hostfree.py` enforces that. It was loaded into a plain server process (Node
22) with no changes, and timed. The machine is shared with other seats, so
treat these as estimates within a factor of two.

| Measure | Result | What it means |
|---|---|---|
| Loads outside a browser, unchanged | Yes | It can run inside a Cloudflare Worker as a module |
| Size | 659 KB, or 241 KB compressed | Cloudflare allows 64 MB per Worker, and a startup under 1 second ([Workers limits](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/platform/limits.mdx), read in full) |
| Time to load | 73 ms | Within the 1 second startup limit |
| First reading after load | 179 ms | Too much for the free plan's 10 ms per request. The paid plan allows 30 seconds by default. **The paid plan is required** |
| Average reading, warmed up, 500 readings | 1.9 ms | Cheap. The average Worker uses about 2.2 ms per request, by Cloudflare's own figure |
| Memory in use | 7.6 MB | Cloudflare allows 128 MB |
| A reading of story A, then 13 other stories, then story A again | Identical, all 3,635 bytes | No leakage between people in these cases |

The last row matters. Cloudflare warns that one Worker can serve many
requests and that anything left in shared memory can leak into the next
request ([Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)).
The engine does keep shared state (`S`, `DOMAIN`, `VERPMIX`, `LEANMIX`). But
its front door, `read()` in `engine/read.js`, resets that state in a fixed
order, and it runs start to finish without pausing, so no other request can
cut in halfway. The test above shows it holding. It needs to become a
permanent gate, and `read()` must never gain a pause point (an `await`)
inside it.

### Checking `SECURITY-IP.md` against the research

`SECURITY-IP.md` is sound, and most of it is confirmed here. Four places
change.

1. **It ranks "compute the deeper rungs on the server" fifth, at medium
   cost. It should be second, and the cost is lower.**
   - It says itself that gating by tier "only hides a result the browser
     already holds", and OWASP says the same thing in general terms
     (section 2).
   - It priced the move as medium without knowing that the engine runs on a
     server unchanged. Measured today, it does.
   - So the signed plan (its item 2) and the server-side paid reading
     belong together. A signed plan that unlocks computation the device
     already has stops a casual editor and nobody else.
2. **Its privacy argument against reading stories on the server is weaker
   than it looked.**
   - It said reading a story on the server means "every story leaves the
     device".
   - But you ruled on 25 September that "the story is stored, for recovery,
     never shared, and used only for modelling" (`DECISIONS.md`). Once
     accounts exist, stories reach the server anyway, sealed.
   - What remains of the argument is real but smaller:
     - offline use, since a reading on the server needs a connection;
     - speed, since each reading waits on a network round trip;
     - the story being open in the server's memory while it is read.
   - That turns it into a product question more than a privacy one. It is
     still your call (question 3 below).
3. **Hiding the code is even weaker than it said, because machines now undo
   it.**
   - Google runs a tool called CASCADE in production that uses its Gemini AI
     to undo common JavaScript scrambling. It restores hundreds of hidden
     strings per file in about two seconds, and scans millions of files a
     day
     ([CASCADE, Google, ICSE 2026](https://doi.org/10.1145/3786583.3786873)).
   - Open tools such as [humanify](https://github.com/jehna/humanify) use AI
     to restore readable names to minified code.
   - Its "No" verdicts on scrambling and commercial obfuscation are
     confirmed, and more firmly.
4. **Moving the engine to the server is not protection by itself. It adds a
   requirement `SECURITY-IP.md` only touched on.**
   - Tramèr and co-authors showed that a model behind an open online
     interface can be copied almost perfectly by querying it many times and
     studying the answers
     ([Stealing Machine Learning Models via Prediction APIs, USENIX Security 2016](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/tramer)).
     Hiding the confidence numbers slows this down but does not stop it.
   - The same applies to the word table. `SECURITY-IP.md` measured that the
     table falls out of the shipped file in nine seconds of querying. It
     would fall out of an open server almost as fast.
   - So the server's reading route needs four things:
     - sign in on every call;
     - a rate limit per account;
     - an answer holding only what the screen shows, never the weight each
       word carried;
     - terms that forbid automated querying, with abuse logged.
   - A December 2025 article from the law firm Greenberg Traurig recommends
     exactly these as the "reasonable measures" trade secret law requires
     for a service offered online
     ([Reverse Engineering in the Age of AI](https://www.gtlaw.com/en/insights/2025/12/published-articles/reverse-engineering-in-the-age-of-ai-are-your-trade-secrets-still-safe)).

### What moves, what stays, and why

**Moves to the server, in order of value against cost:**

1. **The plan and the spend.** Who has paid and what they have used
   (`engine/plan.js`, and the allowance count in `engine/schema.js`).
   Without this, one edit on the device unlocks the top tier.
2. **The paid depth of the reading.** The deeper rungs of sight by tier
   (`engine/ladder.js` and its callers). Computed only for accounts that
   have paid, and never shipped to a device.
3. **The pool of real phrasing, and the pipeline that refines the reader
   with it.** It lives on the server by nature. This is the moat
   (`SECURITY-IP.md` section 5, confirmed).
4. **The developer analytics view.** It is already ruled never to ship to a
   person's build (`DECISIONS.md`).
5. **Your choice:** the story reader itself (`engine/sniff.js`, 61 KB, and
   `engine/lexicon.js`, 47 KB).

**Stays on the device, on purpose:**

- **Every renderer** in `ui/`, the Field, the Compass and the avatar.
  Drawing is not the secret, and moving it would make every tap wait on the
  network: tens of milliseconds at best, against 1.9 ms locally.
- **The free, offline base reading.** Keeping it is what lets the product
  still open with no connection, which is one of the core ideals of
  "local-first" software. That idea comes from Kleppmann and the Ink &
  Switch lab: data lives on the person's device first, works offline, and
  syncs when it can
  ([Local-first software, Onward! 2019](https://www.inkandswitch.com/essay/local-first/)).
- **Undo, local storage and the person's own copy of their data.**
  `CLAUDE.md` already rules that storage stays in the person's own browser
  except the record.

### The order, with estimates

Every estimate below is the team's estimate. It rests on the file sizes
named, on the fact that the server already exists, and on the engine
measurements above. None of it is a quote.

**Stage 0. Yours, this week, and no engineering.**
- Make the repository private (`SECURITY-IP.md` question 1).
- Settle the Cloudflare ruling and the data region.
- Clear the GitHub billing lock.
- Say which engine is the canonical one. The MOB and `reboot-os` engines
  disagree in 29 places (`TASKS.md` `AW7`), and a server can host only one
  truth.

**Stage 1. Put the existing server live, hardened. About 2 to 3 days.**
- Everything `REBOOT-OS-STATUS.md` section 5 lists, which is about a day.
- The canon routes behind sign in and tier, gap 1 above. Hours.
- The support console behind Cloudflare Access. An hour.
- A decision on password hashing, and narrowing the allowed origins.
- The two known sign in defects `REBOOT-OS-STATUS.md` names.

**Stage 2. MOB's engine as a module inside that same server. About 3 to 5
days.**
- Bundle `engine.js` into the Worker.
- Add one route, `POST /v1/read`: a profile and an optional story go in,
  the reading comes out. It is signed in, rate limited, and the answer
  holds only what the screen shows.
- Run `validateProfile` on the server as the entry check, the rule
  `CLAUDE.md` already states: "Validate at the boundary."
- Add a gate that proves no leakage between people, and one that holds the
  time per reading under a budget.
- Give MOB its one network seam, bound from the host side the way
  `engine/outbox.js` binds sending today. The engine stays host free.
- The basis for the estimate: the engine needs no changes. The work is one
  route, one check, two gates and one host binding.

**Stage 3. The plan and the spend decided by the server. About 3 to 5
days.**
- Stripe for web payments. `reboot-os` handles Apple and Google only, so
  this part is new.
- The allowance counted on the record, not on the device.
- A signed plan statement, so the offline app knows what was paid for
  without being able to forge it (`SECURITY-IP.md` section 3).

**Stage 4. Take the paid depth out of the shipped file. About 1 to 2
weeks.**
- `MANIFEST` gains a second build target, so that the client engine is built
  without the paid modules and the server engine with them.
- Both builds get gated.
- **This is the stage where "broken out" first protects anything.** Until
  it lands, the paid logic is still inside the file a person holds.
- The basis for the estimate: it means tracing which functions compute the
  deeper rungs across `ladder.js`, `plan.js` and their callers, and it means
  two builds held equal where they overlap. `tools/equiv.py` already does
  that kind of comparison.

**Stage 5, your call. The story reader on the server. About 1 to 2 weeks,
plus a lawyer's view.**
- Stories read on the server and never held in the clear there. The word
  table then leaves the shipped file and can become a trade secret.
- The cost:
  - offline reading of new stories ends, unless a smaller base table stays
    on the device for the free tier;
  - every reading waits on a round trip.

**Stage 6. The phrasing pool and pipeline.**
- Starts only after the consent screens and the legal review, because it
  handles consented personal writing.
- Ongoing work, not a one-off build.

**Total, to a properly split product that protects the method: roughly four
to seven weeks of engineering**, of which the first working, protected paid
reading is about two weeks in (stages 1 to 3). Splitting the same work into
separate services for sign in, sync, billing and reading would add, by
estimate, one to two weeks of setup. After that it would add four
deployments, four sets of secrets and network hops to every reading, and buy
nothing listed in this document.

## 5. How do you protect your IP? The direct answer

Ranked by what each measure actually buys. This builds on
`SECURITY-IP.md` and does not repeat it.

1. **Stop publishing it.**
   - Make the repository private, and pack deliveries from the stripped
     build. Minutes and an hour.
   - Nothing else on this list works while the source, the rulings and the
     book sit in a public repository. Trade secret law requires "reasonable
     measures" to keep a secret, and a public repository is the opposite
     ([summary of the Defend Trade Secrets Act test](https://www.gtlaw.com/en/insights/2025/12/published-articles/reverse-engineering-in-the-age-of-ai-are-your-trade-secrets-still-safe)).
2. **Move what earns money behind the server, and lock the door.**
   - Stages 1 to 4 above.
   - The server is the only place code cannot be read by the person using
     it. But a server that answers anyone, without limit, gets copied by
     querying instead of reading (Tramèr, above).
   - So the door is four things: sign in, a rate limit, answers holding
     only what the screen shows, and terms that forbid automated querying.
3. **Own the things a copier cannot take.**
   - The pool of real phrasing grows with every consenting user, and it
     keeps any copy out of date.
   - Then the book, the name, the users and your rate of improvement. This
     is `SECURITY-IP.md` section 1d, confirmed.
4. **Use the law for what the law covers** (`SECURITY-IP.md` section 4):
   - register the book's copyright;
   - run a trademark clearance on the one name you would least want to
     lose;
   - clickwrap terms at sign up, meaning the person must press "I agree";
   - a signed IP assignment before any second human contributes.
5. **Do not spend on hiding code.** Scrambling, commercial obfuscators,
   compiling to WebAssembly and encrypting the tables inside the file all
   fail. Google now undoes common JavaScript scrambling automatically at the
   scale of millions of files a day (CASCADE, above). That money belongs in
   items 1 and 2.
6. **Protect the people, because a breach costs more than a copy.**
   - Once journals sit on a server, a leak of psychological self report
     triggers FTC breach duties, Washington's consent and lawsuit rules, and
     European special category rules (section 3, gap 5).
   - The sealing `reboot-os` already does is the right start.
   - The gaps above are the rest: the support console, password strength
     and token lifetime.

The honest centre stays what `SECURITY-IP.md` said. **The code is the least
defensible part of what you own.** The research adds one thing. The
defensible version of the method is not a hidden copy of it. It is a live
service that only paying, identified, rate limited accounts can query, and
that keeps improving from data nobody else has.

## What I need from you

Each question gives the ways it could go and what each costs. None is
answered for you by default.

1. **Is "broken out" the modular monolith described here, or do you want
   separate services anyway?**
   - (a) One server, one client, strict modules inside each. Section 4 as
     written, roughly four to seven weeks.
   - (b) Separate services for sign in, sync, billing and reading. By
     estimate one to two weeks more to set up, plus the ongoing cost of four
     deployments. Every source in section 1 advises against it at this
     stage.

   The team recommends (a).
2. **Which engine is the truth?** Today there are two, and they disagree in
   29 places (`TASKS.md` `AW7`). The server can host only one.
   - (a) MOB's `atuned_src/` engine, the one reviewed with you all session.
   - (b) The `reboot-os` Atüned engine, the one its server was built beside.
   - (c) Reconcile the two first. An estimate of a week or more, based on
     29 known differences.
3. **Should a new story be read on the server?** Example: someone types "my
   father shouted and I was alone" on a train with no signal.
   - (a) Read on the device, as today. It works on the train, and the word
     table stays readable in the file.
   - (b) Read on the server. On the train it waits until there is signal,
     and the word table becomes a secret.
   - (c) Both. A smaller free table on the device reads it on the train, and
     the full paid reading runs on the server when there is signal.

   The team leans (c). It changes `SECURITY-IP.md`'s earlier lean, because
   stories already go to the server for recovery by your 25 September
   ruling.
4. **Cloudflare, confirmed?** You ruled "Cloudflare, for now, kept" on 25
   September and said "I said Supabase" on 27 September. This document finds
   nothing that makes Supabase necessary. The one real advantage found is
   its ready-made sign in with stronger password hashing (section 3, gap 3).
   - (a) Cloudflare, as built. Live in days.
   - (b) Supabase. One to two weeks of rebuilding first.
5. **Password strength at launch.**
   - (a) Accept Cloudflare's 100,000 round cap, with the reason written
     down.
   - (b) About a day to run the stronger Argon2id method inside the server.
   - (c) Hand sign in to a specialist provider, which means an outside
     company holds your users' logins.
6. **The repository, still urgent.** It is public today, with the source,
   every ruling and your book in it. It needs you, or another admin, under
   Settings, then General, then Change visibility. No seat has a tool that
   can change it.

## Sources

Read in full through GitHub: the
[OWASP Authorization Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Authorization_Cheat_Sheet.md),
the [OWASP Password Storage Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md),
[Cloudflare Workers limits](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/platform/limits.mdx),
[Cloudflare D1 limits](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/d1/platform/limits.mdx),
and [workerd pull request 7550](https://github.com/cloudflare/workerd/pull/7550).

Read through search extracts, because direct fetches were blocked by the
sandbox:
[Fowler, MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html);
[Fowler, Microservice Premium](https://martinfowler.com/bliki/MicroservicePremium.html);
[Tilkov, Don't start with a monolith](https://martinfowler.com/articles/dont-start-monolith.html);
[Newman at QCon, The Register](https://www.theregister.com/software/2020/03/04/microservices-guru-warns-devs-that-trendy-architecture-shouldnt-be-the-default-for-every-app-but-a-last-resort/1051458);
[Newman, InfoQ](https://www.infoq.com/news/2020/05/monolith-decomposition-newman/);
[Ghemawat et al., HotOS 2023](https://sigops.org/s/conferences/hotos/2023/papers/ghemawat.pdf);
[Prime Video, InfoQ](https://infoq.com/news/2023/05/prime-ec2-ecs-saves-costs);
[Prime Video, Michael Tsai](https://mjtsai.com/blog/2023/05/05/scaling-up-the-prime-video-audio-video-monitoring/);
[Segment, Goodbye Microservices](https://www.twilio.com/en-us/blog/developers/best-practices/goodbye-microservices);
[Istio, istiod](https://istio.io/latest/blog/2020/istiod/);
[Shopify, Deconstructing the Monolith](https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity);
[Shopify, Under Deconstruction](https://shopify.engineering/shopify-monolith);
[Shopify, Packwerk](https://shopify.engineering/enforcing-modularity-rails-apps-packwerk);
[DHH, The Majestic Monolith](https://signalvnoise.com/svn3/the-majestic-monolith/);
[Hightower, Changelog](https://changelog.com/posts/monoliths-are-the-future);
[Khan Academy, Goliath](https://blog.khanacademy.org/go-services-one-goliath-project/);
[DORA, loosely coupled architecture](https://dora.dev/devops-capabilities/technical/loosely-coupled-architecture/);
[latency numbers](https://gist.github.com/hellerbarde/2843375);
[Cloudflare Workers best practices](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/);
[workerd issue 1346](https://github.com/cloudflare/workerd/issues/1346);
[Cloudflare Zero Trust plans](https://www.cloudflare.com/plans/zero-trust-services/);
[Supabase row level security](https://supabase.com/docs/guides/database/postgres/row-level-security);
[CVE-2025-48757](https://www.superblocks.com/blog/lovable-vulnerabilities);
[CASCADE, Google](https://doi.org/10.1145/3786583.3786873);
[humanify](https://github.com/jehna/humanify);
[Tramèr et al., USENIX Security 2016](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/tramer);
[Greenberg Traurig, December 2025](https://www.gtlaw.com/en/insights/2025/12/published-articles/reverse-engineering-in-the-age-of-ai-are-your-trade-secrets-still-safe);
[FTC Health Breach Notification Rule](https://www.ftc.gov/news-events/news/press-releases/2024/04/ftc-finalizes-changes-health-breach-notification-rule);
[Washington My Health My Data Act](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy);
[IAPP on the Washington Act](https://iapp.org/resources/article/washington-my-health-my-data-act-overview);
[EDPB Guidelines 01/2025](https://www.edpb.europa.eu/system/files/2025-01/edpb_guidelines_202501_pseudonymisation_en.pdf);
[GDPR Article 9](https://gdpr-info.eu/art-9-gdpr/);
[Kleppmann et al., Local-first software](https://www.inkandswitch.com/essay/local-first/).

This is not legal advice. The legal points are here so that a lawyer
conversation starts in the right place. The questions for that lawyer are
the ones `SECURITY-IP.md` lists, plus the consent-to-collect point in
section 3, gap 5.
