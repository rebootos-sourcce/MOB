# Body map specification. What the team needs for the body map to work.

27 September. Technical director's seat, written in answer to round GO. It
is a proposal: nothing in `atuned_src/` or `source.html` changed. The art
director was on the same dispatch, and the questions about how the figure
should look (line weight, style, how much anatomy shows) belong to that seat
and are not decided here.

Revised the same day, after his ruling on the nervous system figure ("lock
that in as our kind of starting point"). That ruling is folded in at section
1A and wherever it changes something below. The rest of the document stands:
his ruling decides what the man looks like. It does not change where the
addresses go or how the resolution is set.

Every number below comes from something that can be run again:

- **Measured**: read off the committed build (`1c89ff4`, md5
  `b3d512abe4c3db85691eb662f9c32a63`) or off the engine data, by
  `proto/body-map-spec/gen.js` into `metrics.json`, or by the probes named
  where they are used.
- **Sourced**: a named outside source states it. As in
  `docs/research/marma-validation.md`, this session reads search results and
  not full texts.
- **Estimate**: arithmetic, with what it rests on shown.
- **Proposed**: the team's recommendation. Not built, not ruled.
- **Open**: his call. Listed in section 9 with the options and what each
  costs.

## 0. His question, in his words

"Okay, so for the body map, I'm pretty confident that we want the front and
back. And that you do need to detail version. And so my question to you is,
if I supply you with a detailed version, what resolution of detail do you
actually need? Can you render a version and show me? Actually, can you render
yourself a version that you need? Front and back. Left and right. That would
get you better triangulation. In fact, why don't you model the system in a
fashion to which you can be successful? ... If the team needs, maybe they can
ask me questions about what the intention is."

And later the same day, on the nervous system front and back image: "Okay,
the nervous system, uh, front, back, that's fantastic, can you lock that in as
our kind of starting [point]. It looks like you've got all the chakras too.
Merge this with the hundred and eight chakras, part of the overlay. Use this
as our new man. And then add the nervous system and the chakras as part of
the overlay, we'll clean that up in a minute afterwards. But make sure it's
the man front and back. And so we should be able to zoom in on the different
areas of the body as well, if we press a button, and have retained the
resolution. And that should make our heat map more accurate. So maybe we need
a grid in the background that you can use as a map. And then we'll use our
heat map as part of that, like the pain map and the tension lines. Then that
would make our heat map more accurate too. Okay cool. So the paint where it
hurts, like the pain map, this is a perfect example, that nerve chakra and
this system with a heat map merge as one, and the body being divided by head,
neck, shoulders, torso, palms, hips, legs, knees, shins, ankle, feet. All
right, whatever, but it's all this needs to be like visually, look, those
areas need to be selectable, I guess is what I'm saying. So a person can go,
oh my back, and press the back, right, my trap, they're pressing their trap.
And then some symptoms come up. You know, is your shoulders risen? You have
stories of carrying too much responsibility, you know, this is what's causing
the tension in this area, you know, here's what your pain map says, the
tension here is at 40%, these are the solutions. And then there's like a
transparency issue with the glow behind the man, and we want to show the
tension lines. We want the area of effect of the pain to be more visible as
well, but good, good starting spot. It's definitely a C plus."

## 1. The answer, short

- **The man is decided: the front and back nervous system figure from round
  FW, option A.** It is drawn on the product's own outline in the product's
  own units, so everything in this spec lays onto it with no conversion. The
  merge he asked for (nerves, seats, addresses, a grid behind, selectable
  regions, one region pressed) is drawn on that figure in
  `proto/body-map-spec/merge.png`. Section 1A takes his asks one at a time.

- **Front and back: yes, both are required.** 14 addresses that are already
  measured are posterior structures: the tailbone, the sacral dimples, the
  kidneys, the space between the shoulder blades, the lumbar plexus and the
  middle of the buttock. They are drawn on the front today, because there is
  only one figure. The pain map is front only as well.
- **Left and right, as whole body side views: no.** He ruled that the body is
  "symmetrical on both sides", so a left view and a right view are mirror
  images of each other, and one of them is redundant. In the torso, front and
  back already separate near from far. The few addresses on the flank read at
  the edge of the front and back outlines. Neither of his charts draws a side
  view. Neither does the reference body map used in pain research (CHOIR:
  74 regions, front and back, no side view).
- **One side view is needed: the head, cut down the middle.** 32 addresses
  sit inside the skull. A front view throws away depth, so 19 of them on the
  midline stack in a single column. In the front view the median distance
  between neighbours is 6.1 mm. In the cut it is 18 mm. On the front 9 pairs
  sit under 10 mm apart, and in the cut none do. This is the triangulation he
  is describing. It is needed in the head and nowhere else.
- **The resolution needed is 5 cm on the body, drawn to 2 cm. It is not
  photographic.** Three independent numbers land on the same size:
  - His own ruling of 26 September: "roughly in the right spot."
  - His two charts disagree with each other by a median of 5.8 cm.
  - A fingertip covers 5.5 cm of body once the torso is opened on a phone.
  
  A more detailed image cannot make the map more accurate than the two
  sources it is checked against. The head is the exception. It needs
  millimetres, and those come from the brain atlas the team already used, not
  from a picture.
- **A sharper image is not the bottleneck.** The build already sits a median
  2.1 cm from his charts on the 48 addresses they can speak for. What limits
  the map is four things no image fixes:
  1. There is only one figure.
  2. The head was stored without front to back depth.
  3. The spine ruler is built from where the seats are drawn, not from
     vertebrae.
  4. There is no rule yet for what an address is on the body: a point or a
     patch, one side or both, near surface or far.
  
  Section 9 asks him about 4.
- **What he supplies, if anything,** is now for placement only, because the
  display figure is decided. It would be a clean schematic, front and back,
  with named bony landmarks and the spine's levels on the back view, plus a
  side view of the head. The full checklist is in section 6. The team's own
  rendition of what it needs is `proto/body-map-spec/plate.png`.

## 1A. His ruling on the nervous system figure, folded in

**What he locked, as identified.** `proto/fw/pages/nervous.html`, option A,
"Front and back", from round FW (commit `b5bc701`). It is the only front and
back nervous system image in the repository:

- white: the brain and the spinal cord;
- blue: the autonomic system (the vagus nerves, the two sympathetic chains,
  the plexuses);
- gold: the somatic nerves to the muscles and skin;
- the seven seats as dashed rings on the front, with the flow line up the
  spine.

It uses the product's own `BODYPATH` outline in the same figure units, 0 to
100. Measured: 216 SVG elements per view, and 37 to 40 KB of markup. If he
meant option B (one figure, both nerve sets in layers) or some other image,
he should say so. Everything below would still hold.

**What his ruling changes here.**

- **The display figure is no longer an open question.** Section 6 now
  describes a placement reference only.
- **"Merge this with the hundred and eight chakras."** Read against the
  record, the classical marma count is 107 (`marma-validation.md`,
  verified). The one more that modern charts add is the mind, not a place on
  the body. No classical system of chakras at that count was found. The
  product's own addresses inside the body (all 112 but the 4 outside it) are
  almost certainly what he means: the fetters. Proposed: the overlay merges
  the nerves, the seven seats and those addresses, and the marma points stay
  a calibration layer the team uses, off by default. This is question J.

**His asks, one at a time, against what the team found:**

1. **One base figure, front and back, merging the nerves, the chakras and the
   addresses.** Drawn in `merge.png`. The layers, bottom to top: the grid;
   the man, solid; the painted cells and the area of effect; the nerves as
   approved; the tension lines; the seven seats; the addresses; the labels.
2. **Zoom into an area at the press of a button, with the resolution
   retained.** Yes, because the figure is vector: once a region has opened,
   it redraws at full sharpness at any zoom. A raster figure cannot do this.
   At the head's four times zoom, each source pixel becomes sixteen. Two
   changes are needed:
   - Nerve lines must keep their width as the view zooms. The approved
     figure sets `vector-effect: non-scaling-stroke` on its outline only, so
     at four times its nerves draw four times thicker.
   - Finer branches (the intercostal nerves, the nerves of the fingers, the
     facial branches) should appear only once a region is opened, so the
     whole body stays readable.
   
   The zoom method and its cost are in section 8.
3. **A grid in the background, used as a map.** This is the 5 cm cell from
   section 5, now doing more than one job. Measured: 214 cells cover each
   view (614 at 3 cm, 1,208 at 2 cm). A region is a set of cells, a paint
   marks cells, heat colours cells, and every address stands in a cell. It
   is one map, so a press, a paint and an address land on the same
   coordinates. That is what makes the heat map "more accurate" in his
   sense. The grid is drawn faint, and strongest when a region is open.
4. **Selectable regions: head, neck, shoulders, torso, palms, hips, legs,
   knees, shins, ankle, feet.** A first taxonomy is drawn in `merge.png`:
   24 regions on the front and 24 on the back, each side its own press. It
   adds what his list has no name for:
   - the upper arm and forearm, between shoulder and palm;
   - chest and abdomen, as a split of the torso;
   - the back: upper back, mid back, low back, sacrum, trap, buttock, back
     of the thigh and knee, calf and heel, because his own examples were
     "my back" and "my trap".
   
   48 in all, against 9 today and 74 on CHOIR. This is question M.
5. **Pressing a region brings up symptoms, the person's stories, a tension
   reading and solutions.** Mocked for his own example, the left trap, in
   `merge.png`. Where each part would come from:

   | Part | Source today | Gap |
   |---|---|---|
   | Symptoms | `PAINREG.common` exists, for 9 regions | 48 regions need their own. Content |
   | Stories | The addresses standing in the region, and the journal stories that charged them | New, and made possible by the place records in section 7.1 |
   | Tension, "40%" | `pmHeat` normalises to the person's busiest seat, so the hottest region always reads full | Needs a definition first. Question K |
   | Solutions | `PRACTICE` exists, but no practice is tied to a region | Tie existing practices to regions, or write new ones. Content |

   **The stories part is where placement pays off, measured:**
   - Pressing the trap today pulls every address in the shoulder band's
     seats (Throat and Heart), 27 of them. By place, 2 stand there:
     Comparison and Manic Expression, on the accessory nerve.
   - The low back today pulls 32 (Sacral and Root). By place, it holds 7,
     and 4 of those 7 are Solar addresses over the kidneys (Entitlement,
     Rebellion, Resentment, Anxiety) that today's seat banding never reaches
     at all.
   - The chest goes from 31 to 13.
   
   So seat banding both pulls in too much and misses what is there.
6. **"A transparency issue with the glow behind the man."** Measured, and it
   is two glows, not one. `proto/body-map-spec/glow.png` shows them side by
   side.
   - **The haze behind him.** `.pm-aura` is a radial gradient under a 40 px
     CSS blur, set 18 percent outside the picture. At 1600 that is a
     1251 by 1130 px layer. The man is filled at 8.5 percent opacity
     (`rgba(150,152,160,.085)` in `ui/map.js`), so the haze reads through
     him as well as around him.
   - **The field on him.** The seats' heat is drawn over the man with
     `mix-blend-mode: screen` and an SVG blur, then clipped to his outline.
     The screen blend makes it read as light shining through him, not colour
     on him.
   
   The approved nervous figure also fills the man at 7 percent, so the new
   man would inherit the haze problem unless he is made solid. `merge.png`
   draws him solid. The cost of each glow is in section 8. Which one he
   meant is question L. This is a real defect on the shipped page and not
   only a design note.
7. **The tension lines and the area of effect, more visible.** Today the Pain
   layer draws its traced nerve branches at 22 percent opacity, and a region
   is a box. Proposed, and drawn in `merge.png`:
   - **A tension line** is the nerve path from a painted region to the spine
     at that nerve's level, drawn over the nerves in the heat colour. Its
     width and brightness follow the tension. On hover it traces and hums,
     which is his own ruling from round CU: "if I hover over one of the
     lines, that's the animation it does, it traces the entire thing, then
     holds and hums, and the amount it hums is based on the tension of those
     lines."
   - **The area of effect** is one soft radial gradient per painted region,
     sized to the painted cells, under the nerves, with its opacity set by
     intensity. It uses no blur filter.

## 1B. A personal observation on the neck, for the body map and the pain map

His words, verbatim, round JD: "The neck is for navigation. When the neck is
impaired, navigation, like steering wheel power, becomes more difficult. I'm
not making a note of this from theory, I'm making a note of this from
observation after releasing the stress response from my spine. The more that
gets released, the easier it is to use willpower to push through any
barriers. Focus becomes refined."

Labeled, not tested, the same rule this file already holds for his other
observations: it is information, and information needs a label, not a test.
No gate checks it, no address is renamed off it, and no claim is shown to a
person from it.

Where it sits against the built map. The neck is already a selectable region
(section 1A, section 5). The addresses already carried there are Throat seat
ones, and the vagus nerve is already named twice on the addresses at the
neck (`engine/data/figure.js`, Manya: "the vagus in the neck and the
larynx's own nerves"; the vagus also appears among the shared nerve names in
section 2). The vagus is broadly associated with self-regulation in the
literature (polyvagal theory), which is not the same claim as his, and is
named here only to say his account points at a real, already mapped nerve
rather than an invented one. That is a structural note, not a confirmation
of his mechanism, and not a citation for it.

Nothing to build from this yet. If the body map ever prints a sentence per
region on hover or on release, this is the kind of line that region would
carry, sourced to him and dated, the same way the tension line hums on his
own ruling above. Question for him: does "navigation" mean literal
steering, decision making under pressure, or both, since the pain map's own
copy would need to pick one reading rather than his broader one.

## 2. What is there today (measured)

**The data.** `engine/data/nodes.js` defines 112 addresses. 4 of them are the
field anchors outside the body. Every other address carries a seat (`b`) and
a named nerve or plexus (`n`). None of them carries a body position. There
are 104 distinct nerve names, and five of them are shared by two addresses:
the inferior hypogastric plexus, the pelvic nerve, the obturator nerve, the
celiac plexus and the vagus nerve. Positions live apart from the addresses,
in `engine/data/figure.js`:

| Source of position | Addresses | Where it came from |
|---|---|---|
| Brain atlas, MNI millimetres, side to side and height only | 32 | round BQ, Harvard-Oxford, Juelich, Neuromorphometrics |
| Spine level through `ANATSPINE` | 6 | rounds BI3a and BI3c |
| A point on one of his two charts | 41 | round CS, `proto/anatomy-ref/match.js` |
| The Crown marker, no structure (Endless Seeking) | 1 | round BQ, confirmed by him in CJ |
| **In the engine** | **80** | |
| Proposed from standard anatomy, not in the engine | 28 | round FW, `proto/fw/pages/fetters.html` |
| With no position anywhere | 0 | |

All 80 are on a single front figure. 40 of the places come in a left and
right pair. 18 places hold more than one address, and Basti holds 8. In all
there are 110 drawn points.

**The screen.** Measured by probe on the heaviest roster profile:

| | px per figure unit | 44 px fingertip covers |
|---|---|---|
| 1600 wide, whole body | 8.31 | 9.9 cm of body |
| 390 wide, whole body | 3.74 | 22.0 cm of body |
| 1600, head opened | 32.79 | 2.5 cm |
| 390, head opened | 15.58 | 5.3 cm |

One figure unit is 1.87 cm on a 175 cm person, from the figure's own stature
of 93.67 units. The Body page's SVG holds 411 elements. The whole document
holds 3,455, which is already over the 3,000 surface budget before anything
in this spec is added.

**The pain map.** `PAINREG` in `engine/data/practice.js` has 9 regions, all
drawn on the front view.

## 3. What actually limits accuracy

### 3.1 The references disagree with each other more than the build disagrees with them

`proto/anatomy-ref/out/after.json`, measured in round CS:

- On the 11 places both charts draw, his two charts sit a median **5.8 cm**
  apart. The closest pair is the navel at 1.4 cm. The furthest is
  Katikataruna at 21.3 cm, where one chart puts it beside the sacrum and the
  other mid buttock. The heart point differs by 9.8 cm.
- On the 48 addresses a chart speaks for, the build sits a median **1.18
  percent of height, about 2.1 cm**, from the chart's place. 46 of the 48
  are within about 5 cm.
- The fair test uses the 7 addresses placed from the brain atlas and the
  spine research, which never saw either chart. They land a median 1.04
  percent from the charts, about 1.8 cm.

So the build already agrees with his charts better than the charts agree
with each other. A more detailed third chart gives a third opinion, but it
does not by itself make the other two agree. Only a ruling on which source
wins can do that (question G).

### 3.2 The addresses are nerves, and most nerves are deep

The marma points are places on the skin. The addresses are nerves and
plexuses, and most of those lie inside the body: the celiac, renal, splenic
and hepatic plexuses, the spinal roots, and 32 structures in the brain. A
picture of a surface, however detailed, cannot show where a thalamus is. It
can only show where the thalamus is projected onto the surface. So three
decisions come before any picture: which surface a deep structure is drawn
on, whether a paired structure shows once or twice, and how big an address
is. They are questions A, B and C.

### 3.3 The head was measured in three coordinates and stored in two

`ANAT` stores head positions as MNI `[x, z]`: side to side and height. The
front to back coordinate was measured in round BQ and then dropped. As a
result every midline structure lands in one column. The optic chiasm and the
midbrain are 2.9 mm apart on the front view and about 28 mm apart in a
midline cut. The build's push-apart step (`PMGAP`, `PMROAM` in `ui/map.js`)
then moves them by up to 2.2 figure units, about 42 mm on the head scale, so
that they can be found at all. **This is the single biggest accuracy gap on
the page, and a reference image does not close it. Rerunning the atlas pass
and keeping the third coordinate does.** The front to back values drawn on
the plate are approximate, typed from published atlas centroids to about 10
mm, and marked as approximate there. They show the shape of the answer. They
are not the measurement.

### 3.4 The spine ruler is built from the seats, not from the spine

`ANATSPINE` turns a vertebral level into a height on the figure. It is
anchored on four seats whose own text names a level, and at each of them it
uses the height the seat is drawn at. The Heart seat is drawn at the nipple
line, 30.51, and its text says "T4 to T5", so the ruler puts T4 to T5 at
30.51. The 112 chart labels its T4 to T5 point at 25.28 on our figure, 9.8 cm
higher. Standard surface anatomy puts the T4 to T5 disc level with the
sternal angle, about 5 cm below the notch at the base of the neck. That is
about 21.7 on this figure, which is closer to the 112 chart than to our
ruler. This is my reading of standard teaching and was not re-sourced this
session.

The ribs slope, so a vertebral level and a front landmark with the same name
are not at the same height. A back view with the spinous processes marked
lets vertebral levels be placed on the back directly, with no ruler borrowed
from the front. This change and 3.3 are the two that would most improve
accuracy, and neither needs a new picture.

### 3.5 The screen sets a hard floor

On a phone showing the whole body, one fingertip covers 22 cm, a third of the
torso. At that scale the torso's 43 front points are all closer to a
neighbour than one fingertip. Even with the torso opened to fill a phone, 40
of the 43 still are. Inside the opened head on a phone the fingertip is 54
mm across, and the brain is about 140 mm tall. **Per address tapping in a
spatially true layout is physically impossible on a phone, whatever
reference is supplied.** The system therefore has to select a place first
and then list the addresses standing on it (section 7.4). Round CK's zoomed
head already works this way for one region.

## 4. Front, back, left, right: the decision

**Proposed: front and back for the whole body, plus one midline cut of the
head. No whole body side views.**

| View | Needed | Why |
|---|---|---|
| Front | Yes | 56 addresses, the chakra column, and the front half of pain |
| Back | Yes | 17 addresses, 14 of them measured and drawn on the wrong side today. Posterior pain: low back, neck, shoulder blades, sacrum, back of the legs |
| Head, midline cut | Yes | 19 midline brain addresses stack on the front view (3.3). The cut separates them |
| Head, front | Yes, and it exists | the 9 paired brain structures, holding 12 addresses (hippocampus, thalamus, temporal lobe and others), separate side to side here and overlap in the cut |
| Left side, whole body | No | a mirror of the right, by his own ruling on symmetry |
| Right side, whole body | No | carries nothing the front and back do not, except the flank, which reads at the outline's edge. Apalapa and Parshvasandhi were placed from the charts' front and back views, with no side view |

When would a body side view earn its place? If question D moves addresses
onto the limbs, a side view of the hip or the shoulder would help place them.
Otherwise it would cost a third figure, about another 400 SVG elements, and
a third control, and it would buy nothing measurable.

## 5. The resolution, and how many places

**Proposed: a 5 cm cell on the body, positions drawn to 2 cm, and the head in
millimetres from the atlas.**

The 5 cm figure comes from three independent sources that agree:

1. His ruling of 26 September: "It's a 2D image, it's not accurate, so do the
   best that you can. We're looking for precision but feel, you can't be
   wrong, it just needs to be roughly in the right spot."
2. The two charts' own disagreement, a median of 5.8 cm (3.1).
3. The fingertip on a phone with the torso opened, 5.5 cm (2).

The classical system agrees in its own way. By search result, Sushruta sizes
the 107 marmas as follows: 56 at half a finger breadth (about 1 cm), 12 at
one (about 2 cm), 6 at two, 4 at three, and 29 at the size of one's own palm
(about 8 cm). The reference system he trusts gives a quarter of its points a
size bigger than the cell proposed here.

**How many places the model needs to tell apart**, counted as occupied grid
cells over the 110 drawn points:

| Region and view | Points | at 5 cm | at 3 cm | at 2 cm |
|---|---|---|---|---|
| Head and neck, front surface | 6 | 5 | 6 | 6 |
| Inside the head | 31 | 7 | 10 | 15 |
| Torso, front | 43 | 36 | 37 | 42 |
| Torso, back | 9 | 8 | 8 | 9 |
| Pelvis, front | 13 | 9 | 13 | 13 |
| Pelvis, back | 8 | 8 | 8 | 8 |
| **All** | **110** | **73** | **82** | **93** |

On the body, a cell finer than 3 cm separates almost nothing new. Only the
inside of the head keeps gaining. The body needs about 80 distinguishable
places, and so does any reference used to place them. A drawing that
resolves 2 cm clearly is enough. Anything finer is detail no source can
check and no fingertip can reach.

**Where the addresses are, against where the marma points are:**

| | Marma points (classical) | Addresses |
|---|---|---|
| Above the collarbones | 37 | 36 |
| Chest and abdomen | 12 | 53 |
| Back | 14 | 17 |
| Limbs | 44 | 2 (the obturator nerve, inner thigh) |

Round GE asked to "group it into parts, head, torso, left arm, right arm,
pelvic, left leg, right leg". For the fetters those seven parts are really
three: head, torso and pelvis. The arms carry no addresses. The legs carry
two, and they sit at the top of the thigh. The seven part split is right for
the pain map, where hands, knees and feet matter. The marma chart is a good
reference for the trunk and the head's surface, but its 44 limb points have
no address to hold unless question D changes that.

## 6. What to supply: the reference checklist

This is what "a detailed version" should be, so that it gets used rather than
admired. After his ruling (1A) the man on screen is the approved nervous
system figure, so anything he supplies is for placement, not for display. The
approved figure draws none of the landmarks below, no spine levels and no
face. Items 3 to 5 could equally be added to it as a hidden layer, which
would make a separate reference unnecessary.

**Must have:**

1. **Front and back of one figure, same person, same scale.** Standing,
   palms forward, feet together. The top of the skull and the soles of the
   feet sit on the same pixel rows in both views. Straight on, with no camera
   perspective. Any real 3D or photo source is rendered orthographic.
2. **At least 1,000 px from skull top to sole, and 2,000 is better.** At
   1,000 px, a 5 cm cell is 29 px and 2 cm is 11 px. The extra only helps
   when cropping the head.
3. **Named bony landmarks, clearly drawn.** These are what the placement tool
   pins to. Today it has six (the top of the skull, the ear, the neck at its
   narrowest, the base of the neck, the crotch, the sole), and that is why
   its registration is coarse.
   - Front: brow, tip of the nose, chin, notch at the base of the neck,
     collarbones, sternal angle, nipples, bottom of the breastbone, lower rib
     margin, navel, front hip points, pubic bone, kneecaps, ankle bones.
   - Back: bump at the back of the skull, C7 (the bone that sticks out at the
     base of the neck), the spine of each shoulder blade, the lower tip of
     each shoulder blade, top of the hip bones, the two sacral dimples,
     tailbone, buttock fold, back of the knee, heel.
4. **The spine on the back view, with the levels marked:** C7, then T1
   through T12, L1 through L5, and the sacrum. This is the most valuable
   single addition (3.4).
5. **A face with eyes, nose, mouth and ears.** Round CS checked both charts
   and found neither draws a face, so there is nothing to register the head
   against.
6. **No text, no dots, no leader lines on the figure.** Seven leader lines on
   the marma chart end without a readable dot, and four labels on the 112
   chart sit on the wrong limb. If points are marked, they go on a separate
   layer or file.
7. **A side view of the head,** profile facing right, the ear, eye, nose and
   jaw drawn, at the same scale as the body or larger. A midline brain cut
   drawn inside it is welcome but not needed, because the atlas provides it.

**Not needed, and why:**

- **Photographic or shaded realism.** It helps a person recognise a body and
  helps the tool place nothing. It also costs file size (section 8), and it
  sits against the house look: a muted palette, ring icons, line art. Round
  GE asked whether the "marble" form helps the C to B. It helps the feel, so
  it is worth considering as display art, which is the art director's call.
  It does not help placement.
- **Muscle detail beyond outlines.** Useful only where a muscle is itself the
  landmark: the sternocleidomastoid for Manya and Matrika, the trapezius for
  Amsa, the psoas for the lumbar plexus. Those four can be drawn as outlines.
- **Whole body left and right views** (section 4).
- **Brain art.** The atlas coordinates are the source. A picture of a brain
  would be a fourth opinion on something already measured.

**Separating reference from display** is the design choice that makes this
last. The reference exists to place things. The display art exists to look
right. If both declare the same landmarks, display art can be swapped
without moving a single address (7.2).

## 7. The system the team needs (proposed)

### 7.1 A place record for every address

Each address in the body gets one record, stored in `engine/` beside `ANAT`
and host free like the rest:

| Field | Meaning | Example |
|---|---|---|
| `view` | front, back or head, meaning the surface it is drawn on | Kukundara roots: back |
| `anchor` | a named landmark plus an offset in cm | "sacral dimples, 0 across, 0 down" |
| `pair` | one mark, or mirrored on both sides (question B) | true |
| `size` | radius in cm. Classical size where a marma stands for it, otherwise the structure's own extent (question A) | Basti: palm, 4 cm |
| `depth` | surface or deep. Deep ones follow the rule question C sets | celiac plexus: deep |
| `src` | atlas, spine, chart, anatomy or none, with the citation | as `ANAT`'s comments carry today |
| `conf` | measured, proposed or filed, meaning it stands where it is filed with no structure | Endless Seeking: filed |

Head records keep all three MNI coordinates. The front view and the cut are
both projections of one stored point, so they cannot drift apart.

### 7.2 Landmarks as the coordinate system

Every figure, whether a reference chart, his new reference or the display
art, declares where its landmarks sit. Positions are stored relative to
landmarks and mapped piecewise between them. `proto/anatomy-ref/measure.js`
does this already with six landmarks. The proposal is to raise that to the
set in section 6 and move the mapping into the product. This is what makes
the map "successful" in his sense: a place is defined once, against the
body, and survives any redraw.

### 7.3 Views and regions

- The whole body shows front or back, switched in place. On a wide screen it
  can show both side by side.
- **Fetters open by region:** head, torso and pelvis, on either view (5).
  The head opens to the front and the cut together (question F).
- **Pain uses his regions** (1A, item 4): 24 per view, each a set of grid
  cells. A press selects a region, and a paint marks cells inside it.
  Questions H and M set the final list.
- **Layers, all on the one grid:** the grid, the man, heat and area of
  effect, nerves, tension lines, seats, addresses. The seats and the nerves
  come from the approved figure. The addresses and the heat come from the
  person's reading.
- **Static art is built once.** The grid, the man and the nerves do not
  change with a reading, so they sit outside `renderMap`'s rebuild. Only the
  heat, the lines and the marks rebuild.

### 7.4 Selection: place first, then the list

At every width, a tap picks the nearest place, not the nearest address. The
hit area is the zone of the screen closest to that place, never smaller than
44 px. The shelf then lists every address standing there. Nothing hides
under anything else, and the fingertip floor holds at any density. This is
the only arrangement section 3.5 allows on a phone.

### 7.5 A gate, so it stays right

`measure.js` becomes a test that fails when:

- an address has no `view`;
- a measured address drifts more than 3 percent of height from its source;
- a record claims a chart point and does not sit on it;
- a back structure is drawn on the front;
- a place's hit area falls under 44 px at 390.

A number typed into a document is the defect this repository keeps
recording. The same applies to positions.

## 8. What it costs (measured where marked, estimated otherwise)

**Measured on the committed build, headless Chromium, heaviest roster
profile.** Headless Chromium rasterizes in software with no GPU. The
absolute times are therefore pessimistic, and the ratios between them are
what to trust.

| | 1600, CPU 1x | 1600, CPU 4x | 390, 1x | 390, 4x |
|---|---|---|---|---|
| `renderMap` alone, median | 16.6 ms | 29.8 ms | 8.0 ms | 31.8 ms |
| Zoom by animating the SVG viewBox, median frame | 83 ms | 133 ms | 33 ms | 33 ms |
| Zoom by CSS transform on the SVG, median frame | 16.7 ms | 33 ms | 16.7 ms | 33 ms |

The CPU 4x rows stand in for a four year old laptop. The frame budget is
16.7 ms at 60 frames a second, and half of that should be left for the rest
of the page.

What follows from it:

- **Flipping between front and back must not rebuild.** One `renderMap` is
  already the whole frame. Proposed: build both views once per reading, keep
  both in the document, and flip with `opacity` and `transform` only. That
  runs on the compositor, at about 0 ms of main thread per frame. **Yes, with
  that change.**
- **Opening a region must not animate the viewBox.** That repaints every
  vector each frame and runs at 12 frames a second on a fast machine.
  Proposed: animate a CSS `transform` scale on the SVG, which is compositor
  only, then set the viewBox once at the end. That costs one repaint, about
  one `renderMap`'s worth. The picture is slightly soft for the 200 ms of the
  move and sharp when it lands. **Yes, with that change.**
- **Elements, estimated.** A back view in place of the front adds nothing.
  Both side by side add about 150 SVG elements (a second outline, its
  landmarks and the back marks), from 411 to about 560, well under the
  1,500 budget. The page's 3,455 total elements are already over the 3,000
  surface budget, and that is true before this spec. It is logged, not
  caused here.
- **Bytes.** The packed delivery is 1,004,269 bytes today. Display art as
  vector line work is estimated at 20 to 40 KB of path data for front, back
  and head profile. Today's outline is 8,149 characters. Path data gzips
  about 3 to 4 times, so the delivery grows about 10 KB. A shaded or
  photographic figure is estimated at 150 to 400 KB per view as WebP or PNG,
  plus a third for base64, and gzip gains nearly nothing on an image. Two
  views would add roughly 0.4 to 1 MB and about double the file that "kept
  arriving cut". Proposed: the reference he supplies stays outside the build
  as a placement source, and the display art ships as vector. **Raster
  display art: no. Vector alternative: yes.**
- **The merged figure, estimated from measured parts.** Per view: 216
  elements of approved nerves and seats; about 150 address marks and labels;
  1 path for the whole grid; no more than 5 paths of heat, since painted
  cells merge into one path per intensity step instead of up to 214
  rectangles; 24 invisible region hit shapes. That comes to about 420 to 450
  per view, and about 850 to 900 with both views live for the compositor
  flip. It is under the 1,500 budget, with less headroom than today.
  **Yes, provided the static layers are built once** (7.3). Rebuilding 216
  nerve elements inside every `renderMap` would add to a function that
  already uses the whole frame.
- **The glow (1A, item 6), measured**, render to paint on Gordon at 1600, in
  two runs on a machine loaded by other seats:

  | State | Render to paint |
  |---|---|
  | As shipped | 63 ms and 112 ms |
  | Haze behind him fixed: blur off, man solid | 41 ms and 42 ms |
  | Field on him also flattened | 40 ms and 60 ms |

  The 40 px CSS blur on the haze is between a third and two thirds of the
  page's paint time, and it buys a softness that the radial gradient under
  it already has. The field's own blur and screen blend cost nothing
  measurable here, but screen blending on a large layer is the kind of cost
  that shows up first on an old phone. **Haze: remove the filter and make
  the man solid. Yes. Field: replace the flat blooms with one soft gradient
  each, in normal blending.** Panel 3 of `glow.png` shows why: with the blur
  simply removed, the blooms read as discs.
- **A tension line humming on hover:** one path animated, by transform for
  the hum and by dash offset for the trace. The trace repaints one path per
  frame, estimated under 1 ms. **Yes.**
- **What breaks first on old hardware:** the region open, if it is built on
  the viewBox. At CPU 4x a viewBox zoom holds 7 to 8 frames a second at
  1600. The transform version holds 30. **Floor:** with reduced motion or on
  a slow device, the region opens with no animation, as the head does today.
  Nothing is lost except the motion.

## 9. Questions for him about intent

Each question is his call, and none is answered here by default. Where a
question involves geometry, the answers are drawn side by side in
`proto/body-map-spec/questions.png` under the same letter.

**A. Is an address a point, or a patch of the body with a size?** (drawn)

- A1. A point, which is today. It looks precise, but it claims a precision
  nobody measured.
- A2. A patch at its classical size: palm size for Hridaya, Nabhi and Basti,
  which is how Sushruta sizes 29 of 107.
- A3. A point inside a faint patch. Honest about both where and how far, at
  the cost of one more layer on the figure.

Cost: A2 and A3 need a size for every address. Marma sizes cover the ones a
chart stands for. The rest need a sourcing pass.
Team's lean: A3.

**B. A structure with a left and a right copy: one mark, or two?** (drawn)
This question was already open in rounds CG and CS. From CS: "Still open from
CG: for a structure that comes in a left and right copy, should a single mark
show on both sides." His later words in CS: "remember, it's going to be
symmetrical on both sides."

- B1. One mark on a side picked to spread the marks, which is today.
- B2. Both sides, one address. Tapping either picks the same address. 40
  places draw twice.
- B3. Each side its own address with its own charge. That is more addresses
  than 112, a model change that reaches the schema.

Team's lean: B2, which is how his CS words read.

**C. A deep structure: which surface shows it?** (drawn)

- C1. Always the front, which is today. The kidneys, sacrum and spinal roots
  then read as if they were on the belly.
- C2. The nearer surface. 17 addresses move to the back view.
- C3. Both views, solid on the nearer surface and faint on the far one. The
  most honest option and the busiest.

Team's lean: C2.

**D. Should any address live on the arms or legs?** Round GE: "Group it into
parts, head, torso, left arm, right arm, pelvic, left leg, right leg." Today
the arms hold none and the legs hold two.

- D1. No. The fetter map is head, torso and pelvis, and the limbs are for
  pain only. It costs nothing.
- D2. Nerves that already run into a limb are drawn along it as a line: the
  sciatic nerve (Escapism) down the leg, the obturator nerve (Lethargy,
  Jealousy) into the inner thigh, the brachial plexus (Spiritual Language To
  Manipulate) down the arm. This is a drawing change only.
- D3. Some addresses are moved onto marma limb points. That changes what
  those addresses mean, and it is content work rather than a drawing
  change.

**E. One figure, or a female and a male one?** CHOIR, the research standard,
draws both. Two addresses name structures that exist in one body only: the
uterovaginal plexus (Manipulation Through Emotion) and the spermatic cord
under Vitapa (Lust).

- E1. One neutral figure, with those two named as they are today.
- E2. One neutral figure, with those two renamed to the structure both
  bodies share. The inferior hypogastric plexus carries both.
- E3. The person picks the figure. That doubles the display art and the
  landmark sets.

**F. The opened head: front, cut, or both?** Round CK opened the head to the
front view only.

- F1. The front and the cut side by side on a wide screen, with a switch
  between them on a phone.
- F2. The cut only, because it separates more.
- F3. The front only, which is today, with selection by list.

Carried from round DJ and still his: "The body map's Crown height rule,
waiting on his muscle reference image." Is that muscle reference still
coming, and should it now follow the checklist in section 6?

**G. When his two charts disagree, which one rules?** This is round CS Q2,
still open: "Confirmed for Katikataruna: is the classical marma chart the
rule whenever the two disagree, or was that one address's own call?"
`marma-validation.md` found the classical chart is the one the sources back,
and found invented points in the 112 document.

- G1. Classical marma always.
- G2. Case by case.
- G3. The new reference he supplies overrides both.

Team's lean: G1.

**H. How finely should a person paint?** His list now sets the regions
(question M). This question asks what a paint marks inside a region.

- H1. The whole region. It is simple, but "my trap" and "the top of my trap"
  read the same.
- H2. 5 cm grid cells inside the region, 214 per view. Proposed.
- H3. Match CHOIR's 74 regions exactly. They are validated, and his people's
  data could then be compared with published pain research. The terms of use
  need checking first, and that check has not been done.

Team's lean: H2.

**I. The four anchors outside the body** (Sol Star, Stellar Gateway, Earth
Star, Gaia Gateway): above and below both views, or only the front? This is
small, and it only needs saying once.

**J. "Merge this with the hundred and eight chakras": which set is
meant?** His words from today, quoted in section 0. The classical marma count
is 107. No classical system of chakras at his count was found.

- J1. The product's own addresses inside the body, the fetters. The team
  reads it this way.
- J2. The marma points, shown to people as their own layer. That would be
  new content on screen, and `marma-validation.md` found real errors in one
  of the two charts it would come from.
- J3. Something else he has in mind. If so, what?

**K. "The tension here is at 40%": 40 percent of what?** Today's heat
(`pmHeat`) is relative: the person's heaviest seat is always full, so the
hottest region on every profile would read 100. The house copy rule CO-05
also stands: "A count against a total. A reading is not a score."

- K1. Relative to the person's own heaviest region, which is today's
  behaviour. Someone carrying almost nothing still sees a region at 100.
- K2. Absolute: the charge on the addresses standing in the region, on the
  engine's own 0 to 10 scale, shown as a percent. A 40 means the same thing
  on every profile.
- K3. The pain the person paints, their own 0 to 10, shown beside the
  engine's reading as a separate number, so the two are never merged.

Team's lean: K2, with K3 beside it, each labelled as what it is.

**L. Which glow did he mean?** Asked with the picture:
`proto/body-map-spec/glow.png`.

- L1. The haze behind and through the man (panel 2 removes it). The fix is
  a solid man and no blur filter, and it also makes the page cheaper to draw.
- L2. The colour on the man reading as light shining through him. The fix
  is a soft gradient per bloom in normal blending. Panel 3 is only a
  diagnostic of this, not the fix.
- L3. Both.
- L4. A glow in some other picture. If so, which one?

**M. The regions.** His list: "head, neck, shoulders, torso, palms, hips,
legs, knees, shins, ankle, feet ... All right, whatever".

- M1. The first taxonomy in `merge.png`: 24 regions a view, 48 in all, with
  the arms, the chest and abdomen split, and the back added.
- M2. His eleven names exactly, on both views, split left and right where
  the body is.
- M3. CHOIR's 74, which also answers H.

**N. The words behind each region: symptoms and solutions, for up to 48
regions.** Round CI recorded his ruling on content: "we'll do the cards
later, that'll be part of our content pass, anything that's remaining for
content we'll do then."

- N1. Wait for the content pass. Until then, the 9 existing `PAINREG`
  lines stand in, mapped onto the new regions.
- N2. Write them now, ahead of the pass, for his review.

**O. Is option A the figure he meant?** It is identified, not confirmed
(1A). If he saw option B or another image, which one?

## 10. Status table

| Item | Status |
|---|---|
| Front and back both needed | Measured need (14 posterior addresses on the wrong side), proposed |
| No whole body side views | Proposed, reasons in section 4 |
| Head midline cut | Measured need (19 midline addresses, 9 pairs under 10 mm), proposed. The drawn front to back values are approximate |
| 5 cm cell, 2 cm drawing | Proposed, from his ruling, a measured chart floor and a measured touch floor |
| About 80 distinguishable places on the body | Measured on current plus FW positions |
| Head keeps its front to back coordinate | Proposed. Needs the BQ atlas pass rerun |
| Spine ruler from vertebrae, not from seats | Proposed. The 9.8 cm gap is measured, the anatomy is my reading |
| Place record, landmark registration, place first selection, gate | Proposed, not built |
| Compositor flip and zoom | Measured cost, proposed method |
| Vector display art, raster reference kept out of the build | Estimated sizes, proposed |
| The man: FW nervous figure, option A | Ruled by him. The identification is the team's (question O) |
| Merged layers on one 5 cm grid, 214 cells a view | Measured cell count, proposed layering, drawn in `merge.png` |
| 48 selectable regions | Proposed from his list (question M) |
| Region press: symptoms, stories, tension, solutions | Stories by place are measured (27 to 2, 32 to 7, 31 to 13). Tension needs a definition (K). Symptoms and solutions are content (N) |
| Glow: two glows, the haze costing a third to two thirds of paint | Measured defect on the shipped page. Which one he meant is L |
| Tension lines and area of effect | Proposed, drawn in `merge.png` |
| A through O | Open, his |

## 11. Files

- `proto/body-map-spec/gen.js`: reads the engine data and FW's proposals and
  writes `metrics.json`, `plate.svg` and `questions.svg`. Run it from the
  repo root with `node proto/body-map-spec/gen.js`.
- `proto/body-map-spec/render.js`: renders both sheets to PNG. It needs
  `NODE_PATH` set to a playwright install.
- `proto/body-map-spec/plate.png`: the team's rendition of what it needs:
  front, back, head front and head cut, the 5 cm cells, the landmarks and the
  fingertip rings.
- `proto/body-map-spec/questions.png`: questions A, B and C, each drawn
  with its answers.
- `proto/body-map-spec/metrics.json`: every count above.
- `proto/body-map-spec/merge.png`: the merged new man, front and back, on
  the approved figure, with the grid, the 48 regions, the addresses, and the
  left trap pressed with its tension line, area of effect and panel.
  Written by `merge.js` from `nervous-figures.json`, which
  `extract-nervous.js` pulls out of `proto/fw/out/nervous.html`.
- `proto/body-map-spec/glow.png`: the glow, three states, on the shipped
  page. Written by `glow.js`, which also times each state. The after states
  are style overrides applied in the page for the picture. Nothing in
  `atuned_src` moved.
- Read, not changed: `atuned_src/engine/data/nodes.js`, `figure.js`,
  `practice.js`, `atuned_src/ui/map.js`, `proto/anatomy-ref/`,
  `proto/anatomy-check/research.js`, `proto/fw/pages/fetters.html`,
  `docs/research/marma-validation.md`.

## Sources

- [Sushruta marma sizes by measurement (pramana), Charak Samhita Online and journal summaries](https://www.carakasamhitaonline.com/index.php/Marma), [Easy Ayurveda, Hridaya marma](https://www.easyayurveda.com/2017/06/13/hridaya-marma/), [IJAPC review](https://oaji.net/articles/2022/1791-1669901327.pdf)
- [Development and validation of the CHOIR body map, PubMed](https://pubmed.ncbi.nlm.nih.gov/33490848/), [CHOIRBM, PLOS Computational Biology](https://journals.plos.org/ploscompbiol/article?id=10.1371%2Fjournal.pcbi.1010496), [Stanford Pain News, CHOIR body map](https://painnews.stanford.edu/news/creating-new-tool-pain-choir-body-map-puts-pain-map)
- [Michigan Body Map, University of Michigan](https://medresearch.umich.edu/labs-departments/labs/mpr/michigan-body-map-mbm), [Michigan Body Map and NIH HEAL, PubMed Central](https://pmc.ncbi.nlm.nih.gov/articles/PMC10321764/)
- Everything on marma anatomy, the two charts and the invented points:
  `docs/research/marma-validation.md` and its own source list.
