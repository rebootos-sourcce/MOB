# THE PIPELINE
**Hand this to the automation build. 2026-09-15.**

The spec for the AI-assisted content and outreach system. What goes up, where
it goes, what gets posted, how feedback comes back.

Written to be handed to one engineer and built without further explanation.

---

## READ THIS FIRST

**Fix deliverability before automating anything.** Delivery is at 86%. Every
send loses 14% before a human sees it. Automating on top of that multiplies
a defect. This is task 0 and nothing downstream runs until it clears 92%.

**The system assists. It does not speak unsupervised.** Specifically: no
generated reply is posted to a human without review, in the first 90 days,
without exception. The reasons are in section 5 and they are not
philosophical.

---
---

# 1 · THE SHAPE

```
  SOURCE OF TRUTH                sharinghuman.com
  MOB manuscript          ->     product pages, checkout, PDF delivery
  11 volumes                            |
  20 newsletter issues                  |
  5 original little books               v
         |                        Beehiiv (owns the list)
         |                              |
         v                              v
  CONTENT FACTORY  ------------>  SOCIAL CHANNELS
  atomic units                    IG · LinkedIn · YouTube · TikTok · Threads
         ^                              |
         |                              v
         +-------- FEEDBACK LOOP <-- monitoring
```

**One rule about direction.** Everything originates in the source material
and flows outward. Nothing originates on social. The manuscript is 91,603
words and the volumes are built. There is enough material for eighteen
months without writing a new sentence.

---
---

# 2 · THE ATOMIC UNIT

Every piece of content is one of these. If it is not one of these, it does
not go up.

**THE ADDRESS POST.** One pattern, one node, one nerve, one plain location.
Closes on a ninety-second self-test.
> *Resentment has an address. Suprarenal plexus, just above the kidney, back
> of the body. It is recycled anger running on a loop. Put a hand there and
> think of the person. If it warms or tightens, that is the node. Ninety
> seconds.*

**THE MECHANISM POST.** Why the body does a thing. No advice.
> *Shame is the only emotion that removes volume from the system at once.
> Not gradually. At once. You can watch it in dogs. Head drops, ears droop,
> tail goes between the legs.*

**THE CORRECTION POST.** Category assumption, corrected. This is the
differentiator and it should be a third of the feed.
> *The iceberg model has two zones. The accurate model has four.*

**THE FIELD NOTE.** A plate. A scan of the handwritten notebooks with one
line of caption. These are the strongest evidence artifact in the project
because they show the work being done rather than described. Use all 45.

**THE CASE.** A real session, anonymised. A stranger at a party. Thirty
minutes in an underground bar.

**THE EVIDENCE POST.** Rare, maybe monthly. The Guzik DOI. The biophoton
literature. Never overclaimed.

## The three rules

1. **Every post carries an address or a mechanism.** No inspiration. No
   quote cards. If it could appear on any wellness account, it does not go up.
2. **No em dashes.** Anywhere. This is enforced by a pre-publish check, not
   by memory. It has already failed twice this way.
3. **Nothing is claimed that the evidence editor has not cleared.**

---
---

# 3 · THE FACTORY

## Stage 1 · Extract
Input: manuscript, volumes, newsletter archive, originals.
Output: a queue of candidate atomic units, tagged by type, band, node,
demographic.

This is a batch job, run once, then topped up. **Target from existing
material alone: 300 or more units.** Ninety posts is three months at daily
cadence and it requires no new writing.

## Stage 2 · Draft
The model drafts to the voice rules using retrieved source text. It does not
invent. Every draft carries a citation back to the source passage.

**Hard constraint:** never interpolate a somatic address. If the address is
not in canon or the source, the unit is dropped, not guessed. This is the
one rule that ends the project if broken, because the addresses are the
product.

## Stage 3 · Gate
Automated, before a human sees it.

| Gate | Check | Action |
|---|---|---|
| Dash | any em dash present | reject |
| Address | address present and matches canon | reject on mismatch |
| Claim | claim in the cleared list | flag |
| Voice | sentence length, banned words (*apprehensive, fearful, panic-stricken*) | flag |
| Node | node count says 114, never 108 | reject |

## Stage 4 · Human pass
Lance or the line editor approves in batch. **Ten minutes for a week of
content.** That is the design target. If approval takes longer than that,
stage 2 is not good enough yet.

## Stage 5 · Schedule and publish
Approved units go to a queue, formatted per channel, scheduled.

---
---

# 4 · CHANNELS

## Owned, and the only ones that matter long-term

**sharinghuman.com.** Product pages, checkout, PDF delivery. The single
destination. Every other channel exists to send people here.

Needs: per-volume pages, a cluster page, a library page, the free
diagnostic, a checkout that delivers instantly, and an email capture on
every page.

**Beehiiv.** Owns the list. Already live, 20 issues, 1,470 subscribers.
Underused. It should carry the welcome sequence, the launch sequences and
the practitioner track, none of which exist.

## Distribution, ranked by fit

| Channel | Why | Unit | Cadence |
|---|---|---|---|
| **LinkedIn** | practitioners and high performers are here, and licensing is the business | Correction, Mechanism | 4/week |
| **Instagram** | the somatic reader lives here | Address, Field Note | 5/week |
| **YouTube** | long-form proves the mechanism, and it is the only channel that compounds in search | walkthrough | 1/week |
| **TikTok** | the ninety-second test is native to the format | Address | 4/week |
| **Threads** | low cost, text-native | Correction | 3/week |
| **Substack Notes** | reaches an audience already reading this category | Mechanism | 2/week |
| **Podcast guesting** | highest-conversion channel for practitioner-led work, and it needs no follower count | n/a | 2 bookings/month |

**Podcast guesting is underrated here and should not wait.** It converts
better than anything else for a founder with a peer-reviewed citation and a
thirty-year story, and it does not require an audience to already exist.

## Marketplaces, for PDF distribution

| Channel | Note |
|---|---|
| **Gumroad / Lemon Squeezy** | fastest path to a working checkout. Lemon Squeezy handles VAT as merchant of record. |
| **Payhip** | cheap, PDF-native |
| **Amazon KDP** | print needs ISBN, and singles under 79 pages carry no spine text. Clusters clear it. |
| **Etsy** | real demand for printable somatic and journal products |
| **Practitioner directories** | for the licensing tier, not the books |

**Recommendation:** Lemon Squeezy or Gumroad for checkout inside week one.
Do not build custom. The goal is a working transaction, not a platform.

---
---

# 5 · FEEDBACK AND REPLIES

## What gets monitored
Comments, DMs, replies, mentions, unsubscribe reasons, and the specific
question asked most often.

## Classification
Every inbound gets one label.

| Label | Response | Who |
|---|---|---|
| **Question about the work** | answer with the address | assisted, human approves |
| **Personal disclosure** | acknowledge, no diagnosis, no pitch | **human only** |
| **Distress** | one warm reply, signpost to real help, do not sell | **human only, escalate** |
| **Skeptic, good faith** | give the falsifiable claim and the DOI | assisted, human approves |
| **Troll** | no reply | automated ignore |
| **Buying signal** | reply with the link | assisted |
| **Practitioner inquiry** | book a call, no automation | **human only** |

## The reply doctrine
- Reply in the voice. Short. Mechanical. Body-first.
- Never open with gratitude theatre. Answer the thing.
- Never diagnose a stranger.
- Never sell into a disclosure of pain. The trust cost is permanent and it
  is the fastest way to destroy this specific brand.
- Signposting distress to professional help is mandatory and is never
  followed by a product link in the same message.

## The loop back into the books
Weekly, the analyst produces: most-asked question, most-saved post, most
common self-reported pattern, every objection raised.

That feed answers real open items. Which three volumes bind as the first
cluster, section B5 of the answer sheet, is a question the audience can
answer if anyone asks them. Right now it is being treated as an internal
ruling.

---
---

# 6 · BUILD ORDER

| Wk | Ship |
|---|---|
| 0 | **Deliverability.** Clean the list, authenticate the domain, suppress hard bounces. Gate: 92%. |
| 1 | Checkout live on Lemon Squeezy. One product. Guzik DOI on the page. |
| 2 | Extraction run. 300+ units queued. Gate stage built. |
| 3 | Welcome sequence live. LinkedIn and Instagram posting daily. |
| 4 | Free diagnostic live, capturing email. |
| 5 | First launch to the list. Measure everything. |
| 6 | Monitoring and classification live. Human-in-loop replies. |
| 7 | Practitioner outreach begins. Ten conversations booked. |
| 8 | YouTube weekly. First podcast bookings. |
| 9 | Review against the kill conditions in `03_REVENUE.md` section 6. |

---

## THE SPEC IN ONE PARAGRAPH

Extract 300 atomic units from material that already exists. Gate them
automatically for dashes, addresses, claims and voice. Approve a week in ten
minutes. Publish to LinkedIn, Instagram, TikTok, YouTube, Threads and
Substack Notes on a fixed cadence, every post carrying an address or a
mechanism and every post pointing at sharinghuman.com. Capture email
everywhere. Sell through Lemon Squeezy from week one. Monitor everything
coming back, classify it, let the machine draft and a human send. Feed what
people actually ask back into the books weekly. Fix the list before any of
it starts.
