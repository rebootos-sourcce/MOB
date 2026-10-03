# Protecting the software and the IP

Written 27 September 2026 by the technical director seat, in answer to the
owner's question at `TASKS.md` round GV. Every number below was measured on
the tree at commit `36c8734` and on the build stamped `570d99f`, unless it is
marked as an estimate, in which case it says what the estimate rests on.

This is not legal advice. It is an engineering account of what is exposed and
what each protection actually buys, written so the owner can take it to an
intellectual property lawyer, an investor or a co-founder and have the right
conversation quickly. The legal sections use United States law as the base
case, since the stack (Stripe, Cloudflare, a dollar price list) points there,
and note where European law differs. The questions a lawyer must answer are
listed at the end.

His question, verbatim: "From our software team, security team, how do we
protect the software? How do we protect people from, how do we protect the
HTML code? What protection do we need to ensure our IP is protected, and that
clever people can't use systems in order to steal, obviously, something that's
very effective. And then what are the trade-offs?"

## The short version

- **Two exposures are much larger than the HTML file, and both can be fixed
  this week.** The GitHub repository is public, which publishes the source,
  every ruling, the pricing strategy, the team's working method and the full
  text of the owner's book to anyone. And the delivery file most recently
  committed for the owner was packed from the full build, so it carries 941
  kilobytes of the team's written reasoning, when the tool that strips that
  reasoning already exists and runs on every build.
- **The shipped file cannot be protected technically, only made slower to
  read.** Measured: even with every name scrambled, the word table survives
  word for word and the core formulas read in one line each. And the reader
  does not need to read the code at all. It runs offline with no limit, so
  feeding it a dictionary recovers the whole word table, with seat and
  weight, in about nine seconds.
- **The paywall is enforced by the file the person holds.** The plan and the
  count of what has been spent both live in the person's own browser. Anyone
  who edits one stored field gets the top tier free. For "clever people
  stealing", this is the likeliest real loss: not a competitor copying the
  engine, but a technical user never paying.
- **Copyright is real but narrower than it sounds.** It protects the written
  expression: the book, the product's words, the literal code. It does not
  protect ideas, methods, formulas or systems. So a competitor who learns the
  method and writes their own code breaks no copyright. And 624 of the
  repository's 629 commits were written by an AI, which weakens the claim on
  the code in particular. The book is the strongest copyright asset he has.
- **The lever that actually works is the accounts seam already planned.**
  What is computed or held on a server and never sent to a browser cannot be
  read from a browser, and it is the only thing that can legally be a trade
  secret. First in line: the pool of real phrasing that refines the story
  reader over time, the plan and spend, and the practitioner and cohort
  data. A competitor can copy today's word table. They cannot copy the stream
  of real use that improves it.
- **A correction to the verbal answer given at round GV.** It said "a clean
  room copy is still infringement." That is wrong. A clean room
  reimplementation, where someone writes their own code from a description of
  what the product does without copying its text, is the standard lawful way
  to compete with software. Copyright catches copying, not imitation.

## 1. What is exposed today

### 1a. The repository is public, and it is the largest exposure

Measured through the GitHub API on 27 September: `rebootos-sourcce/MOB`
reports `"private": false` and `"visibility": "public"`, with GitHub Pages
switched on (`has_pages: true`). Whether a Pages site is actually serving
could not be checked from this sandbox, whose network proxy did not reach
`github.io`. It needs checking from his browser under Settings, then Pages.

What the public tree carries, 2,543 tracked files over 629 commits since 30
May 2026:

| What | Where | Why it matters |
|---|---|---|
| The whole source, with every comment | `atuned_src/` | The reasoning behind every number, not only the number |
| Every ruling he has made | `DECISIONS.md`, 2,035 lines | Tier ladder, price reasoning, practitioner model, data policy |
| The full backlog and his verbatim words | `TASKS.md`, 19,237 lines | The roadmap, what is weak, what is next |
| Business strategy | `DESIGN-economics.md`, `DESIGN-billing.md`, `DESIGN-founding-offers.md`, `BUYERS.md`, `RESEARCH-icp.md`, `PANEL-10k.md`, `MARKETING-social.md` | Pricing simulations, target customers, launch offers |
| **The book** | `index.html`, 5.9 MB, titled "The Mechanics of Being, Lance Powell" | The complete text of his book, readable by anyone |
| The team's working method | `.claude/agents/` (17 files), `.claude/skills/` (5) | How the product is made, which is itself a process asset |
| The history | 629 commits | Every dead end, which is what saves a copier the most time |

There is no `LICENSE` file. That means the default: all rights reserved.
Nobody has been granted the right to reuse any of it. GitHub's own terms do
let any GitHub user view and fork a public repository within GitHub. They do
not let anyone ship it. So the repository being public is a secrecy problem,
not a loss of copyright. But secrecy is the one thing that cannot be got back.

A pattern scan of the current files found no credentials. It looked for
Stripe secret and publishable keys, GitHub tokens, AWS keys, private key
blocks and Cloudflare token assignments. That is a scan of today's files and
not of the history, and a pattern scan is not a guarantee. Nothing with a
real key has been built yet, since there is no server code in the repository
at all, so this is the right moment to go private: before the first secret
exists to leak.

Stars and forks both read zero. Clones are invisible to the API. He can see
the clone count for the last fourteen days under Insights, then Traffic, on
the repository page. That is the only evidence there is of whether anyone has
taken a copy.

### 1b. The file sent to him carries its own commentary

The build writes three files. `source.html` is the full build.
`atuned-slim.html` is the same build with every comment removed by
`tools/slim.py`, which `BUILD.sh` runs every time. `atuned-packed.html` is a
build compressed into one self-inflating file by `tools/pack.js`, which is
what gets delivered, because the uncompressed file kept arriving cut short.

| Build | Size | Comment blocks | Bytes of comment | Mentions of `TASKS.md` |
|---|---|---|---|---|
| `source.html`, full | 2,115,575 | 2,264 in script | 815,738, which is 49% of all script | 101 |
| `atuned-slim.html`, stripped | 1,306,785 | 0 | 0 | 0 |
| `atuned-packed.html`, as committed at `30751e9`, inflated | 2,076,780 | 2,700 | 941,213 | 85 |

`pack.js` defaults to packing the stripped build. The committed delivery file
was packed from the full one, and no reason is recorded. So what the owner
has been sent, and what anyone he forwards it to can open, is the product
together with half a megabyte of the team explaining it:

- 186 uses of "owner" and 54 of "his words", with his rulings quoted.
- Measured defects and the fix for each.
- Citations into his book by line number.
- A named reference profile under his own first name and age. The numbers in
  that profile are simulated at his request, not his self report, but the
  name and age are real.

Here is one comment, verbatim from the shipped file, to show the kind of
thing it gives away:

> Measured against six plain sentences a person would actually type, four
> returned nothing at all: a father dying, being exhausted, feeling alone,
> and a panic attack. [...] A person writes what happened in nouns and verbs,
> and this table was written in adjectives.

That is a research finding a competitor would otherwise have to pay for.

### 1c. What a competitor learns from the shipped file

Assume the reader has the stripped build, with no comments. They still get
the whole method, because the method is the program:

- **The story reader, end to end.** `scanStory` finds hits, `parseStory`
  turns them into imprints, and `applyStory` writes them. The word table
  seats each word at one of seven body centres with an intensity: "shouted"
  goes to the solar plexus at 24, "alone" to the heart at 24. It also carries
  the phrase list, the 25 cues for the 21 laws, and a negation window of
  three words, which is how "not angry" is kept from reading as anger.
- **The canon.** The 33 saboteurs as charge bands (`engine/data/canon.js`),
  the 112 addresses, and the nerve, zone and chakra geometry.
- **Every formula, with its constants.** A few examples:
  - The coherence score (CQ) is the sum of the 21 laws over 210, times 100.
  - Practice lifts a law by `10 - (10 - v) * (1 - 0.00077)^n`.
  - The lever is a normal curve centred at 5 with a spread of 1.25.
  - The domain susceptibility multiplier is 1.3.
  - The accuracy weights are 10, 43, 13, 28 and 18.
- **The tier ladder and meter rules** (`engine/plan.js`,
  `engine/schema.js`).
- **Fourteen reference people, the six target customer profiles among them**,
  each with a quoted sentence and a full profile.

What the comments add on top of that is the **why**: which numbers were
measured and which chosen, what was tried and failed, and what he ruled and
in what words. The why is worth more than the what, because it is the
months, and it is the part that can be removed for free (section 2).

**The black box point, measured.** A copier does not need to read the code
at all. The engine runs in their own browser, offline, with no limit on how
often they call it. Fed 8,338 distinct words taken from this repository's own
prose, `scanStory` took 93 microseconds a word and returned the seat, the
weight and the fetter for all 97 that fired. At that rate a 100,000 word
English dictionary is about nine seconds of work. **No amount of hiding the
code changes this.** It only changes if the engine is not in their browser.

### 1d. What a competitor cannot get, even with every file

- **His judgment from here on.** The file is a snapshot. The next ruling,
  the next correction and the next reading he adds are not in it. 629
  commits in four months is the speed a copier has to match, starting from
  a copy that is out of date the day it is taken.
- **The pool of real phrasing.** `DECISIONS.md` rules that people's own
  limiting beliefs, aggregated across people, are used to refine the story
  reader. That pool lives on a server, grows with every user and is never
  shipped. A copy of today's word table is a copy of a table that is about
  to be out of date.
- **The people.** Their records, their history, the practitioner links, the
  cohorts at tier four and the founding hundred.
- **The name, the book and the author.** A copy cannot call itself Atuned or
  claim to be his.
- **Trust.** "We never sell anybody's data. Ever." is a promise only the
  people who made it can keep.

This is the honest centre of the whole question. **The code is the least
defensible and the least valuable part of what he owns.** The defensible
parts are the book, the name, the users and their data, and the rate of
improvement.

## 2. What client side measures actually do

"Client side" means anything done to the file that reaches the person's
browser. All of these measures share one limit: the browser must be able to
run the program, so the program must be recoverable from what the browser
receives. Each one raises the cost of reading. None prevents it.

Measured on `engine.js`, the 658,806 byte engine half of the build, with the
Terser minifier (a standard tool that shrinks and renames JavaScript):

| Treatment | Size | Compressed | Still readable afterwards |
|---|---|---|---|
| As built | 658,806 | 241,259 | everything, with reasoning |
| Comments stripped only | 429,444 (down 35%) | 128,266 (down 47%) | every name, every formula, every word in the table |
| Minified, local names scrambled | 310,871 (down 53%) | 115,589 | `compute`, `scanStory`, the word table, every constant |
| Minified, all names scrambled | 298,464 (down 55%) | 112,590 | `scanStory`, `SAB33`, `CQ_MODEL`, `LIFT_R`, the word table, every constant |

Two lessons from the last row:

- **Scrambling cannot rename a property.** The engine publishes its
  functions by name through `engine/export.js`, and those names survive.
- **Data cannot be scrambled at all.** The word table is words, because the
  program has to match them against what people type. With every name
  scrambled, the practice lift reads:

      function Sr(e,t){return t>0?10-(10-e)*Math.pow(.99923,t):e}

  One line. The formula is intact.

Measure by measure:

**Strip comments (already built: `tools/slim.py`).**
- **Cost:** none new. It runs on every build. `slim.py` is written so that
  the gates run against its output unchanged. That was not re-measured for
  this document.
- **What it buys:** the reasoning, his quoted words, the backlog references
  and the research findings all leave the delivered file, and the file loses
  a third of its size.
- **What it leaves:** the method.
- **Worth it?** The only client side measure with a real return. It needs
  one change: pack from the stripped build, and add a gate that fails if the
  delivery file contains a comment block or the string `TASKS.md`.

**Minify and scramble local names.**
- **Cost:** a build step (5.5 seconds measured), plus source maps. A source
  map is a side file that translates scrambled code back to the original, so
  the team's own error reports stay readable.
- **What it buys:** a reader loses the names of local variables and gains an
  hour or two. The top level names they need stay put.
- **Worth it?** Only as a size saving, not as protection.

**Scramble every name.**
- **Cost:** days to wire, and friction for as long as it is on. Three tools
  address the program by name and would each need changing:
  - `tools/monitor.js` reads `TABDEF` at run time.
  - The functional gate calls functions by name.
  - `tools/equiv.py` compares declarations by name, so it would have to run
    before the scrambling.
- **What it buys:** an estimated day of a competent reader's time, as the
  table shows.
- **Worth it?** No.

**Commercial obfuscation.** This means tools that also scramble the control
flow and encode the strings, with the decoder shipped in the same file.
- **Cost:** a licence for the commercial versions, a larger file, and slower
  running code. An estimate, not measured here: control flow scrambling is
  commonly reported to slow hot code by a multiple, and this engine runs on
  every story and every tap.
- **What it buys:** little. Free tools exist that undo the output of the
  common obfuscators automatically. An estimate of hours to days for a
  motivated reader.
- **Worth it?** No. It pays in speed, which people feel, for protection a
  tool can remove.

**Compress into one self-inflating file (already built: `tools/pack.js`).**
- **Cost:** none. It exists for delivery reasons.
- **What it buys:** "View source" shows a wall of encoded text. The
  browser's developer tools show the inflated program a second later. It
  deters the least curious reader, and that is all it does.

**Splitting the code and loading parts later.**
- **What it buys:** nothing on its own. It needs network, which breaks the
  one-file rule, and a part loaded later still arrives in the browser in
  readable form.
- **When it does become useful:** only when the server decides who receives
  a part. That is the server lever in section 5, not obfuscation.

**Compile the core to WebAssembly (WASM).** WebAssembly is a compact binary
format the browser runs. It is not human readable text, but it is fully
recoverable.
- **Cost:** a rewrite of the arithmetic core in another language. That
  breaks the standing rule "Port, do not rebuild. The arithmetic core keeps
  its bodies and signatures." It also needs a second test harness beside
  `tests/engine.js`. An estimate of weeks to months, based on 35 KB of
  `compute.js` and 61 KB of `sniff.js` written against shared state.
- **What it buys:**
  - For the formulas, days to weeks of a skilled reader's time, using the
    freely available decompilers.
  - For the word table, nothing. Its strings sit in the binary and can be
    listed in seconds.
  - For the black box sweep in 1c, nothing.
- **Worth it?** No.

**Encrypt the tables inside the file.**
- **What it buys:** nothing. The key has to be in the file for the program to
  read the tables.
- **Worth it?** No. Theatre.

**Block the developer tools.** This means `debugger` traps, detecting when
the tools are open, and disabling right click.
- **Cost:** it hurts real users and accessibility software.
- **What it buys:** minutes. It is switched off in one browser setting.
- **Worth it?** No. Theatre.

## 3. The paywall, which is the likelier theft

"Clever people stealing" also means using the product without paying. Today
that takes one edit:

- The plan is a field on the person's profile, stored in their own browser.
  A blank one is filled at `engine/schema.js:120` as
  `{tier:'free',...}`.
- Loading a profile accepts any known tier name (`engine/schema.js:859`).
- The budget is computed in the browser from that plan and from
  `p.meter.unique`, the list of ground already opened
  (`meterBudget`, `engine/schema.js:1082`).

So setting the tier to `three` in the developer tools grants tier three, and
emptying `p.meter.unique` gives the spend back. Sight by tier has the same
shape: if the deeper rungs are computed in the browser, gating them only
hides a result the browser already holds.

`DECISIONS.md` has already placed the authority in the right place: "the
record store reads Stripe, writes the plan onto the record." What that needs
in order to hold:

- **The plan arrives signed.** At sign in, the record store sends the plan
  as a signed statement: tier, status, until, the person's key. The app
  checks the signature with a public key carried in the file. A public key
  can check a signature but cannot make one, so it is safe to ship. The
  check belongs to the host side and not to `engine/`: the browser's crypto
  functions are part of the host, and the engine stays host free.
- **The spend is counted on the record, not only on the device.**
- **Honestly, what this changes:** a person can still edit the program to
  skip the check. Signing moves the bar from "edit one field" to "edit the
  program and keep it edited across updates". That stops almost everyone,
  and not the most determined.
- **What cannot be patched out** is anything the server only hands to a
  payer: sync, recovery, the practitioner view, cohorts, and content
  delivered per account.

The recommendation is to accept that a determined technical person can run
the local instrument without paying, and to price for the things only the
server provides. The other road is to require sign in on every open, which
breaks offline use and the one-file promise, and still does not stop someone
who edits the program.

## 4. Legal protections that exist today

### Copyright

**What it protects.** Original expression, fixed in a medium: the text of the
book, the product's copy, the drills, the illustrations and the literal
source code (17 U.S.C. §102(a)). It arises automatically the moment the work
is written. No registration is needed for it to exist.

**What it does not protect.** Any "idea, procedure, process, system, method
of operation, concept, principle, or discovery" (§102(b)). That excludes all
of the following:

- the CQ formula;
- the idea of seating words at body centres;
- the 33 saboteurs as a system;
- the loop of discover, play, flow and embody.

Tables of facts are protected at most thinly, and only in their original
selection and arrangement (*Feist v. Rural*, 1991). A word table with chosen
weights may get that thin protection. The formulas get none.

**The correction.** It follows that a clean room reimplementation does not
infringe. In a clean room one person describes what the software does, and
another writes new code and new words from that description alone. That is
the textbook lawful route, and it has been used on software since the 1980s.
What copyright catches is copying:

- rehosting the file;
- lifting the word table wholesale;
- reusing the book's text or the product's copy.

**The AI authorship problem, which needs a lawyer.** United States copyright
requires a human author. The appeals court in Washington affirmed this in
*Thaler v. Perlmutter* (2025), and the Copyright Office's guidance says
material generated by AI must be disclaimed when a work is registered. Of
this repository's 629 commits, 624 are authored by Claude and 5 by the
owner. What that means in practice:

- **The book** is his, human authored, and the strongest copyright asset
  here. Much of the engine encodes it, so copying the canon means copying
  the book.
- **His verbatim words**, and his rulings where he wrote the actual wording,
  are his.
- **His selection and arrangement**, where the choices were creatively his,
  may be protectable, and the lawyer should say how far.
- **The literal code** is uncertain. The AI provider's terms give him
  whatever rights the provider has in the output, which settles ownership
  between the two of them. It cannot create a copyright the law does not
  grant.

**Registration.** A United States work must be registered before its owner
can sue for infringement (§411(a)), and the Copyright Office must have acted
on the application first (*Fourth Estate v. Wall-Street.com*, 2019). There
are also two remedies that only registration unlocks, set out in §412:

- statutory damages, up to 150,000 dollars per work for wilful infringement,
  with no need to prove the loss;
- the other side paying his legal fees.

Both require registration before the infringement began, or within three
months of first publication. Cost: a filing fee in the tens of dollars per
work (check the Office's current schedule) and an afternoon. For software,
the Office accepts a partial deposit with trade secret passages blocked out,
so registering does not publish the code.

**Takedown.** In practice, most small companies enforce copyright through a
takedown notice under 17 U.S.C. §512. If a copy of the file, the text or the
book turns up on GitHub, an app store or a web host, a notice to that host
normally has it removed within days. It needs no registration and no
lawsuit. This is the enforcement tool he will actually use.

**Notice.** A line reading "© 2026 [owner or company]. All rights reserved."
in the file, plus a proprietary `LICENSE` in the repository, is not required.
It does defeat a copier's claim that they did not know (§401(d)). It takes
minutes.

### Trademark

**What it protects.** A name or mark, used for particular goods or services,
against confusingly similar use. It does not protect the code. A clone under
a different name does not infringe the trademark. A clone calling itself
Atuned does.

**The candidates:** Atüned, SOURCE, SOURCE OS and The Mechanics of Being.
Honestly:

- "Attuned" is an ordinary English word, in heavy use in wellness and at
  work, so it may be hard to register and hard to defend.
- "Source" on its own is close to generic.
- A **clearance search** comes before any logo or domain spend. An estimate
  of a few hundred to a few thousand dollars through an attorney, depending
  on depth.

**Filing.** Under the fee schedule in force since January 2025, the USPTO's
base fee is about 350 dollars per class of goods or services, before any
attorney. The likely classes are:

- 9, downloadable software;
- 42, software used online;
- possibly 41, education, or 44, wellness services.

Expect roughly a year to registration. He can use ™ now without registering.
® only follows registration.

### Trade secret

**What it protects.** Information that is valuable because it is not
generally known, where the owner takes reasonable steps to keep it secret
(Defend Trade Secrets Act, 18 U.S.C. §1839(3)). The remedy is against
**improper** means: theft, or a breach of confidence. Reverse engineering and
independent invention are expressly not improper means (§1839(6)(B)).

**Three consequences:**

- Nothing in the shipped file can be a trade secret against someone who
  reads it.
- Nothing in the public repository can be a trade secret at all, and what
  has already been public cannot become one again.
- What can still qualify:
  - the pool of real phrasing and the pipeline that refines the reader with
    it;
  - the developer analytics view that `DECISIONS.md` already rules must
    never ship;
  - pricing experiments;
  - practitioner and cohort data;
  - the roadmap from here on.

It qualifies only with the reasonable steps: a private repository, access
control, and a confidentiality agreement with every human who sees it.

**Where the choice lies.** While the story reader runs on the device, its
word table ships and cannot be a secret. It could only become one if stories
were read on a server, which would mean every story leaving the device for
every reading. That is a privacy trade, and it is his call (question 3 at the
end).

### Terms of service and licence

**Which kind binds.** A "clickwrap", where a person must actively press "I
agree" before using the product, is generally enforced by United States
courts. A "browsewrap", where the terms are only a link at the bottom of the
page, often is not (*Nguyen v. Barnes & Noble*, 2014; *Specht v. Netscape*,
2002). So the agreement belongs at first open and again at sign in.

**What the terms should say:**
- the product is licensed, not sold;
- no copying or redistribution;
- no extracting the tables, whether by hand or by automated querying;
- no use to build a competing product;
- the account can be terminated for breach.

A clause forbidding reverse engineering is enforced by many United States
courts (*Bowers v. Baystate*, 2003). European law is different. The Software
Directive, 2009/24/EC, Articles 5(3), 6 and 8, lets a lawful user study how a
program works and decompile it for interoperability, and a contract term that
says otherwise is void.

**The limit.** Terms bind only someone who agreed. A person who was forwarded
the file, or who read the public repository, agreed to nothing.

**Why it is worth doing anyway.** The accounts product needs terms
regardless. That is where the consent `DECISIONS.md` already requires will
live, the consent to use a person's words to refine the reader. The IP
clauses cost almost nothing to add at the same time. They give a contract
claim against any account holder who copies, and a clean reason to close the
account.

### Agreements with people

Today one human author appears in the history. From the moment a second
human contributes (a co-founder, a contractor, a practitioner in a beta),
each needs an IP assignment and confidentiality agreement signed **before**
they start. An investor's diligence asks for exactly this chain of title.
It is also the moment to confirm which entity owns the IP, him or a company,
and to assign it there.

### Patent, briefly, because it has a deadline

- **Why it is weak here:** method patents on software have been hard to hold
  since *Alice v. CLS Bank* (2014). A way of scoring words into body
  locations would likely read as an abstract idea.
- **What it would cost:** typically tens of thousands of dollars and two to
  three years, and a patent has to disclose the method in full.
- **The clock:** the United States allows one year from the inventor's own
  public disclosure (35 U.S.C. §102(b)(1)(A)). Most other countries allow
  none, so any foreign rights are likely gone already. If the repository has
  been public since it was created on 31 May 2026, the United States window
  closes around 31 May 2027. It closes earlier if the book or the method was
  published earlier, which is likely. When the repository became public was
  not verified.

The team's lean is that a patent is not worth pursuing. But it is a decision
with a deadline, so it should be made on purpose, with one call to a patent
attorney, rather than by the calendar.

## 5. The lever that works: the accounts seam

`CLAUDE.md` rules that the app "gains network at exactly one seam, fetching
a record at sign in." That seam is where protection becomes structural,
because it changes who the threat is:

| | Today | Behind the seam |
|---|---|---|
| Who can read it | Anyone who opens the file | Only someone who breaches the server |
| How often they can query it | Unlimited, offline, 93 microseconds a word | Rate limited, logged, tied to an account that agreed to terms |
| Legal status | Copyright only | Copyright, contract and trade secret |

The constraints already ruled still hold:

- one file;
- one seam;
- the engine stays host free;
- storage stays local except the record;
- a story is never kept joined to a person's name;
- consent is required before a person's words refine the model.

So "move it to the server" cannot mean moving the whole engine there.
Reading every story on a server would reverse the local-first promise. The
honest tension is that the part most worth protecting, the story reader, is
also the part that reads the most private text.

What should sit on the server first, ranked by IP value against cost:

1. **The pool of real phrasing, and the pipeline that refines the reader
   with it.** Server side by nature. This is the moat: a copier gets today's
   table, and he gets the stream. It is trade secret eligible if it is kept
   private. The developer analytics view belongs here as well, and
   `DECISIONS.md` already rules it must never ship in the person's build.
   - **Cost:** part of building the record store anyway.
   - **Precondition:** this code must never be in a public repository. That
     means the repository goes private, or the server lives in its own
     private one.
2. **Plan and spend authority.** A signed plan at sign in, and spend counted
   on the record (section 3).
   - **Cost:** a small addition to the billing design `DECISIONS.md`
     already carries.
   - **What it buys:** the one-field unlock ends, and everything the server
     provides is reserved for payers.
3. **Practitioner and cohort (tier four).** Server side by construction,
   since data belonging to many people cannot live in one person's browser.
   Protected automatically. It carries the consent, the visible list of who
   has sight, and revocation that `CLAUDE.md` requires.
4. **Content delivered per account.** New drills, practices, rituals,
   knowledge entries and word table updates, sent with the record at sign in
   rather than built into the file.
   - **What it buys:** each item is still readable once delivered, but only
     to an account holder bound by the terms. A copier needs an account,
     which leaves a trail and gives a contract claim.
   - **Needs his ruling:** whether the one seam carries content or only the
     record.
5. **The deeper rungs of sight by tier**, the hypercomplexes and above.
   Computing these on the server for paying tiers would make the gate real.
   - **Cost:** the reading's numbers go to the server, though not the story's
     words. That is smaller than sending the story, but still psychological
     self report tied to a key.
   - **Status:** medium priority, and a privacy call.
6. **What stays in the file on purpose:** reading a story on the device, the
   base word table, and the core formulas. Accept the exposure. Protect them
   with copyright on the expression, with speed of improvement, and with the
   pool of phrasing that keeps making the shipped table out of date.

**The part of his question about protecting people.** The moment records sit
on a server, the larger security duty is no longer the code. It is the
people. A breached record store leaks psychological self report. That is a
far worse event than a copied word table, and it carries legal duties:
access, deletion and breach notification. The security budget belongs there
first:

- authentication;
- encryption at rest, which the desktop does not do today (`TASKS.md` `AW6`);
- access logs;
- the store writing only its five permitted fields;
- the story kept apart from the name.

## 6. The trade off table

"Time it adds" means extra time for a determined, competent copier. Figures
marked "est." are estimates.

| Measure | What it costs to build | What it costs to keep | What it actually stops | Time it adds | Verdict |
|---|---|---|---|---|---|
| Make the repository private | Minutes | Pages on a private repository needs a paid GitHub plan, or moves to Cloudflare Pages as already planned. The public raw address route needs him signed in | Casual discovery of the source, strategy, book and method. Further loss of secrecy | Removes the easiest route entirely. Does not recall copies already taken | **Do now** |
| Pack from the stripped build, with a gate | About an hour | None | The reasoning, his words and the research leave the delivered file | Weeks of re-deriving why (est.) | **Do now** |
| Copyright notice and `LICENSE` | Minutes | None | The "did not know" defence | Legal only | **Do now** |
| Register the book's copyright | Tens of dollars and an afternoon | None | Makes a lawsuit possible, with statutory damages and fees | Legal only | **Do first** |
| Register the software's copyright | Tens of dollars, after the lawyer's view on the AI authored parts | None | Literal copying of the code, thinly | Legal only | After the lawyer |
| Trademark clearance and filing | Clearance a few hundred to a few thousand dollars (est.), then about 350 dollars a class | Renewals, and watching for misuse | Anyone using the name | Legal only | After clearance |
| Terms (clickwrap) with IP clauses | A lawyer's drafting fee, needed for accounts anyway | Updates | Account holders who copy | Legal only, agreeing users only | **With accounts** |
| IP assignment and confidentiality agreements | A template | One per human | Ownership disputes, investor diligence problems | Legal only | **Before any second human** |
| Signed plan and spend on the record | Small, inside the billing build | Key management | Unlocking with one edit | Moves the bar from a field to the program | **With accounts** |
| Phrasing pool and pipeline on the server, private | Part of the record store | Server security | Copying the thing that improves | Not reachable without a breach | **Design in from day one** |
| Content per account at sign in | Medium, and needs a seam ruling | An endpoint | Anonymous bulk copying | An account and a trail per copier | His call |
| Deeper rungs computed on the server | Medium | Privacy obligations | Reading the top rungs unpaid | Not reachable without paying | His call |
| Story reader on the server | Large | Every story leaves the device | Extraction of the word table | Makes it a trade secret | **Team leans no**, his call |
| Minify, local names only | A day | Source maps | Almost nothing | Hours | Only for size |
| Scramble every name | Days | Friction with three tools, for good | Almost nothing, since exported names survive | About a day (est.) | No |
| Commercial obfuscator | Days, possibly a licence | Slower running code (est.) | Almost nothing, since tools undo it | Hours to days (est.) | No |
| WebAssembly core | Weeks to months (est.), a rewrite | Two test harnesses, and it breaks "port, do not rebuild" | The formulas, for a while | Days to weeks for the formulas, none for the table | No |
| Encrypt tables in the file | Days | None | Nothing, since the key ships alongside | None | Theatre |
| Block developer tools | Hours | Hurts real users | Nothing | Minutes | Theatre |
| Patent | Tens of thousands, two to three years | Maintenance fees | The method, if granted, which is unlikely after *Alice* | Legal only | Probably no. Ask once, before the deadline |

## 7. What needs his call

Each question carries its options and what each costs. None is answered for
him.

1. **Make the repository private?** Today it is public, with the full
   source, `DECISIONS.md`, the pricing work and his book in it.
   - (a) Private now. The cost is that the "raw address" delivery route in
     `CLAUDE.md` works only when he is signed in to GitHub, and Pages needs a
     paid plan or moves to Cloudflare Pages.
   - (b) Stay public. Everything written from here on keeps publishing.
   - (c) Two repositories: the source private, and a public one holding only
     the built file, if a public download matters.

   The team recommends (a) or (c), this week.
2. **Is the book meant to be public?** `index.html`, "The Mechanics of
   Being, Lance Powell", 5.9 MB, is in the public repository in full. If it
   is for sale, or with a publisher, or meant to be, a free full copy on
   GitHub matters to that deal. If it is meant to be free, the only open
   point is registering its copyright.
3. **Should reading a story stay on the device?**
   - (a) Yes, as today. Stories stay private and the word table stays
     readable.
   - (b) Read on the server. The table becomes a secret, and every story
     leaves the device.

   The team leans (a) and puts the protection into the pool of phrasing
   instead.
4. **The paywall: which kind of lock?**
   - (a) Accept that a technical person can run the local instrument unpaid,
     and price for what only the server provides: sync, recovery, the
     practitioner view, cohorts and new content.
   - (b) Require sign in on every open. That breaks offline use, and a person
     who edits the program still gets through.

   The team leans (a).
5. **Which name gets protected first?** Atüned, SOURCE, SOURCE OS or The
   Mechanics of Being. The team suggests a clearance search on the one he
   would least want to lose, before any money goes into a logo.
6. **Patent: rule it out, or make one call to a patent attorney before
   roughly May 2027?** The window may already have closed if the book was
   published earlier.
7. **Who owns the IP: him personally, or a company?** Investors will ask. If
   a company exists or is coming, the IP gets assigned to it, and every
   future contributor signs over to it.

For the lawyer, the four questions that decide the most:

- How much of the AI written code he can register and claim.
- Terms of service that also carry the modelling consent `DECISIONS.md`
  requires.
- A trademark clearance search.
- The patent clock.

## Engineering follow ups that do not need him

- Pack the delivery file from `atuned-slim.html`. Add a gate that fails if
  `atuned-packed.html`, once inflated, contains any comment block, the
  string `TASKS.md`, or "his words".
- Add the copyright notice to `atuned_src/shell/head.html` and a proprietary
  `LICENSE` at the root.
- Scan the full git history for credentials, not only the current files,
  before the first real key exists.
- Keep all record store and pipeline code out of this repository until it is
  private.
- When the billing work starts, verify the plan on the host side and never
  in `engine/`, so the engine stays free of browser code as `hostfree.py`
  requires.
- The reference profile named after him, with his age, ships in every build.
  It is simulated at his request, so it is harmless, but it is his name. Ask
  whether he wants it labelled "Author" in the shipped file.
