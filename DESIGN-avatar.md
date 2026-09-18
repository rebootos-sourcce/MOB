# The Avatar, the Purpose Map and the boundary

The becoming half of the product. Release empties an address. Replace fills it.
Neither of them says what the person is filling it toward. The Avatar is that
target, and it is the thing that turns a sequence of releases into a direction.

This document is a design. It changes one line of code, named at the end, and
it is a correction to a number rather than a build.

---

## Where this comes from

Not invented here. Scanned out of the original Atüned build and the codex, and
quoted rather than paraphrased so the port is a port.

- **The app.** `_migrate/build/index.html`, 1.33 MB, the original Atüned. The
  Avatar is there and shipped: `AVATAR` at line 8672, `avatarGap` at 8684,
  `avatarProgress` at 8694, `avatarActivate` at 8704, `toolAvatar` at 8718, the
  two journal questions at 8905, the onboarding seed at 12663, the door at
  2918 and 13844.
- **The product bible**, `ATUNED_PRODUCT_BIBLE_v1.md`, decision log entries 237,
  238, 246, 263, 264, 265, 266, 268, 392, 425, 434, 598, 635, 636, 637, 645.
- **The codex**, `index.html` in this repo, for the Purpose Map, the boundary
  and the developmental thresholds.

The boundary tool is **not in the app**. The bible's artifact register names
`ATUNED_AVATAR_AND_BOUNDARY.md` and `Mock_Boundary.png`, so it was designed and
mocked and never built. The codex holds its definition, and that is the ground
this design stands on.

---

## 1. What the Avatar is

The owner's own sentence, from the code comment at line 8669:

> one side is who the person is at their best, the other is who they are not.
> It is not a diagnosis and the app never rules on whether an attribute is a
> real edge or a saboteur wearing a virtue. That depends on where they are in
> their growth, and it is the thing they revise upward as they climb.

Two columns of attributes. Left is who you are becoming. Right is the inversion
of the same attribute, in the person's own words. They are written as a pair,
never separately, because the pair is what makes the attribute addressable: the
left side is a value and a value has no address, while the right side is a
sentence about a bad day and a sentence about a bad day parses.

Verified in the bible at entry 267, on Sofia:

> I leave work at work resolves to Heart, heavily impaired, 3 holding, weight
> 69. The furthest attribute routes straight to a release.

That is the whole mechanism. The right side is fed to the resolver, the
resolver returns a seat, the seat has live imprints, and the imprints have
weight. The gap between who a person is and who they are becoming is not a
mood, it is a number at an address.

### Why it is the missing piece

The product currently measures the field and moves it. It has no statement of
where the person is going, so every release is correct and none of them is
aimed. Three things change the moment the Avatar exists:

- **The release queue gets an order.** Today the heaviest address wins. With an
  Avatar, the heaviest address *standing in the way of a named attribute* wins,
  and the person can see why that one came up.
- **The replacement gets a target.** `relCoolDown` installs the coherent
  opposite at 62 percent of what it removed, and the coherent opposite is
  currently whatever the axis says it is. With an Avatar the axis opposite is
  the floor and the person's own attribute is the ceiling.
- **The reading gets a destination.** The scale says Oscillating. It does not
  say Oscillating on the way to what. `avatarProgress` answers that from work
  done rather than from work declared.

---

## 2. Both sides are tags, which is the owner's ruling

Each attribute pair becomes two tags on the same object:

    {be:'I leave work at work', notbe:'I take every meeting home with me'}

The tag on the right resolves to a seat, a band and a set of live imprints. The
tag on the left is what the replacement statements are steered toward. So one
written pair reaches four systems that already exist:

| Existing system | What the tag does to it |
|---|---|
| Imprints | the right tag matches imprints by seat, so an imprint can say which attribute it is blocking |
| Child fetters | the seat resolves to an axis, so the attribute has a pole and a coherent opposite |
| Saboteurs | a named saboteur firing at that seat is named on the attribute row |
| Release | the queue sorts by attribute distance, not only by weight |
| Replace | the install statement is written toward the left tag |

Nothing new is measured. The tag is a join, not an instrument.

**The routing is one way and it matters.** The right tag steers the **release**,
because that is what is in the way. The left tag steers the **reframe**, because
that is what is being installed. Wiring them the other way round would have the
product releasing a person's values, which is the one thing it must never do.

### The app never rules on the attribute

Entry 264 is a standing ruling and it survives the port:

> The app never rules on whether an attribute is a real edge or a saboteur
> wearing a virtue. That depends on where they are in their growth. It is a
> target they revise upward as they climb.

So `I am always the strong one` is accepted as written. It may be a value at
CQ 30 and a saboteur at CQ 70. The product does not adjudicate, it measures the
distance to what the person wrote and shows them what is in the way. The monthly
review is where the person revises it, and the review exists precisely because
the product will not do it for them.

---

## 3. How it is written, and how it fills itself

Three sources, in order of how little the person has to do.

**Seeded at onboarding, from answers already given.** Line 12663 of the original
does this without a word being typed:

    if(ONB.sleep==='deep'||ONB.sleep==='wake')
     AVATAR.be.push({nm:'I rest properly', inv:'I have not slept properly in weeks'});
    if(ONB.breath==='low')
     AVATAR.be.push({nm:'I breathe low and slow', inv:'my chest is tight and my breath is high'});

Two attributes from seven onboarding items. The Avatar is never empty, which is
the difference between a feature and a blank form.

**Written in the journal, through two questions.** From line 8905:

> Describe yourself on your best day. Not what you achieved. How you were.

> Now the opposite. On your worst day, who runs the show?

These are already in the question rail and already routed. They fire when the
Avatar is due, which the original checks first, ahead of every other question.

**Harvested from what cleared.** A release that empties an address the resolver
already tied to an attribute is evidence for that attribute. The person is
offered the sentence back and can promote it. This is the loop closing: the work
writes the target, and the target orders the work.

---

## 4. The Purpose Map and the boundary

This is the third of the four client entry experiences in the codex, quoted in
full because the geometry is the tool:

> **Three · The Purpose Map.** Two overlapping triangles, Star of David geometry
> / diamond-lotus structure. Upward triangle: three values defining the higher
> sense of self, where they converge is purpose. Downward triangle: what you are
> here to do in the world, survival mechanics, how you navigate. Six sides of
> the boundary: five things you do with partner, family, friends, community,
> coworkers, and alone. Thirty things. Inside the boundary is yours to protect.
> Outside is choice.

That is one object with three rings and it maps exactly onto what the product
already draws.

**The upward triangle, three values.** Three points. Where they converge is
purpose, which is a derived position and not a fourth entry. So purpose is
computed, the way CQ is computed, and a person cannot type it.

**The downward triangle, three survival mechanics.** How you navigate. These are
the things a person does under load, which is what the saboteur layer already
detects. The downward triangle is the only part of this the product can fill in
without asking, because it has been watching.

**The six sides, thirty commitments.** Partner, family, friends, community,
coworkers, alone. Five each. This is a hexagon and the product already renders
hexagonal geometry on the wheel. Inside is protected, outside is choice, and
that line is the boundary.

### How it connects to the Avatar

The Avatar says who you are becoming. The Purpose Map says what that person is
**for** and the boundary says what they **defend**. Three layers of the same
statement at three time horizons:

    Avatar         who you are becoming          revised monthly
    Purpose Map    what that is for              revised rarely
    Boundary       what is yours to protect      tested daily

The boundary is the one that touches the release work every day, because a
crossed boundary is a stress response and a stress response is an imprint. A
person who has written thirty commitments has given the journal thirty things to
notice, and the resolver can say which side of the line an entry sits on. That
is the first time this product could tell a person *why* the charge landed
rather than only where.

The codex already has the release statement for it, at two places:

> State one boundary once, plainly, and do not repeat it.

> Solar release on resentment, then one boundary stated once.

So the ritual step exists in the corpus. It needs the tool, not the copy.

---

## 5. Ascension, and a number that is wrong

The owner's framing in this session:

> ultimately it is a path of ascension. And ascension in this state simply means
> you're no longer being stimulated by the external environment.

The codex agrees exactly, and the glossary in this repo already carries it:

> Ascension: the threshold at which the external environment loses automatic
> control over internal state; stimuli arrive but no longer run the response.

> Ascension is not going up. It is going home.

The codex names five developmental thresholds with distances attached:

    The Still Mind        2,500    thoughts arise but no longer command
    The Open Heart        3,500    heart and crown begin to link
    Clear Perception      4,500    distortion layers thin, the clairs steady
    The Ground           10,000    presence replaces protection
    Ascension            11,664    stimuli meet presence, not pattern

`MARKERS` in `engine/schema.js:278` carries these distances and gets one of them
wrong. Ascension is set to `12000`. The codex says **11,664**, which is not an
arbitrary figure: it is the square of the node count, and the product is not
free to round it.

The four names in the code are also not the codex's names. Buddha nature,
Integration, Field awareness and Liberation stand where the codex has The Still
Mind, The Open Heart, Clear Perception and The Ground. That may be deliberate,
because the owner asked separately for Buddha, Christ and Musashi as markers,
and those are a different object: a compass of people, not a ladder of
thresholds. **His call**, and the two should not share one table whichever way
he rules.

The number is not a matter of taste and is corrected in this pass.

---

## 6. What this needs from the schema

Additive, and small, because the resolver and the meter already do the work.

    avatar: {
      built:      false,
      at:         null,        /* when it was first written */
      reviewedAt: null,        /* monthly review, a ritual step */
      pairs:      [ {be:'', notbe:''} ]
    }
    purpose: {
      values:   ['','',''],    /* the upward triangle */
      mechanics:['','',''],    /* the downward triangle, seeded from saboteurs */
      sides:    { partner:[], family:[], friends:[],
                  community:[], coworkers:[], alone:[] }   /* five each */
    }

Validated at the boundary in the existing refuse by name style: a pair missing
either half is refused, a side holding more than five is refused, and an older
profile without either object is filled from the blank. Nothing is clamped.

New pure functions, all host free and all reading existing state:

    avatarGap(pair)        seat, weight and nerve state standing in the way
    avatarProgress()       done against total, read from cleared ground
    avatarDue(now)         thirty days since the last review
    purposeConverge()      where the three values meet, derived and not typed
    boundaryCross(imprint) which side of the line an imprint landed on

`avatarGap` is a port. The original is fifteen lines and its body and signature
come across unchanged, per the standing rule.

---

## 7. Where it lives on screen

The owner ruled this in the original and the ruling holds, bible entry 425:

> AVATAR sits in the CENTRE OF THE RING. It is the summary of everything, so it
> is the middle of the thing that summarises. Tap the ring, not a row.

This product already has that ring and already has a number in the middle of it.
The core of the wheel is the door. Entry 598 records that it was nearly broken
once by `pointer-events:none` on the label, which is worth knowing before it is
wired.

The Purpose Map is its own surface and not a pane of the Avatar, because it is
revised on a different clock and because the geometry needs the whole stage. The
boundary sits inside it as the outer hexagon, not as a separate tool, since the
codex draws them as one figure.

---

## 8. Open, and whose call

- **The marker names.** Codex thresholds, or the Buddha and Christ and Musashi
  compass, or both as two separate objects. His.
- **Whether purpose is typed or derived.** The codex says the three values
  converge, which reads as derived. Deriving a person's purpose from three words
  is a strong claim for this product to make.
- **Thirty commitments is a lot to ask for.** The Avatar seeds itself from
  onboarding; the boundary has no equivalent. Five sides could seed from the
  journal, since a person writes about a partner or a manager long before they
  would fill a form. Needs a decision before it is built.
- **Whether the Avatar is free.** It is the piece that makes the release work
  feel aimed, which argues for free. It is also the piece that makes a plan
  worth renewing, which argues for paid. Not mine.

