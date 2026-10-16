# Emmy lens file: interactive web art directors (Davis, Nakamura, Koblin, Harris, Simon) and motion graphic designers and animators (Bass, Whitney, Fischinger, McLaren, Cooper)
Researched 2026-10-15 for Emmy's reference library.
Lenses, not authorities: Emmy reviews through them, she never speaks for them.

**How this was checked.** Page fetching was blocked from the research environment (Art of the Title would not resolve), so every fact below comes from search-engine excerpts of the pages listed under each entry, and was kept where two independent results agreed or the source is the person's own institution. The 55-call budget was used in full. A quote appears only where an excerpt showed the exact words with a source URL; everything else is paraphrased and says so. What could not be confirmed is marked UNVERIFIED or listed under "Uncertain". Recheck any quote against its page before it is published.

**About the Atüned notes.** They are written against the rulings and specs, not a walk of the build. The living ring: the hero and the first thing seen, CQ at the centre, a gold band and hairline outside the arcs, "something is always moving, pulling you in", "motion is the pull, never the point", and the stack holds still while a person reads (`atuned/docs/bibles/ART_DIRECTION_BIBLE.md`). The release animation: a 400 ms hold after the final gate, an odometer roll on the final digits (600 ms, ease-out), one 200 ms gold pulse with no loop, a delta line (address name, charge before, charge after), then Home with the new number already in place, silent by default (`atuned/docs/RELEASE_COUNTER_SPEC.md`). Rule 6 (every number shown is real) governs every note.

---

# A. Interactive web art directors

## A1. Joshua Davis

**Who and why.** American designer and generative artist, the Flash-era figure who made code a drawing hand. The lens for "write the rules, then direct what the rules make."

**Background.** An image maker since 1995 (FITC bio). His site praystation.com won the 2001 Prix Ars Electronica Golden Nica (Net Vision / Net Excellence); the Ars Electronica archive calls it a showcase for experimental interface design, and the Whitney Museum notes he gave away the source of its compositions and animations, an early open-source gesture. Other sites: once-upon-a-forest.com (1999), Dreamless, Cyphen. Book: *Flash to the Core* (2002). Later he built the HYPE framework for Processing, worked on the visualisation of IBM's Watson for *Jeopardy!*, and has made generative stills that he then paints over by hand (nft now, 2022). His FITC talk is titled "28 Years of Random".

**How he thinks.** He writes the rules and the tools; the software makes the compositions, and he leaves room for as many anomalies as possible so each output is unique (his own framing as reproduced on Rhizome, paraphrased). Rhizome reproduces a Wired line: "Pollock showed that there was beauty in randomness" (Wired original not checked). The randomness is bounded: his course calls it "rule based randomization" (Skillshare). He iterates until the energy is right, about nine iterations for one print (Sakroots Q&A).

**How he innovates.** He removed the fixed final image and kept the hand: drawn shape libraries go in, code recombines them, he selects. He inverted authorship, from making a picture to directing a system. He gave away his source when studios guarded theirs. Emmy's read, not his: Flash's small vector files rewarded modular shapes rebuilt at runtime, and that constraint became the look.

**How interaction carries meaning.** On praystation the interface was the exhibit. You learned each piece by poking it.

**Quality bar.**
1. Watch it for a minute: no visible loop.
2. Every output the system can make is one you would sign.
3. The randomness has bounds you can state.
4. The hand is still visible in the parts.

**Lens questions.**
- What are the rules, in one paragraph?
- Which values are random, and between which bounds?
- How many outputs did we look at before choosing these defaults?
- Which parts are drawn and which are generated?
- Does anything random touch a number?

**Applied to Atüned.**
- Living ring: if the idle motion is a fixed loop, a person who watches for twenty seconds will find the seam. Drive the glints from bounded, seeded noise so the ring never repeats, and leave the arcs themselves untouched.
- Release animation: no randomness here. The roll and the pulse state a fact. Davis's randomness belongs to the ambient layer, never to the counter (Rule 6).
- Screens: render fifty seeds of the ring's ambient layer side by side, and cut the parameter ranges that ever produce a bad one.

**Sources.** https://whitney.org/artists/8519 · https://webarchive.ars.electronica.art/en/festival2003/updates/article.asp%3FiNewsID=295&iTypeID=10.html · https://en.wikipedia.org/wiki/Joshua_Davis_(designer) · https://old.rhizome.org/editorial/2007/aug/01/dynamic-abstraction · https://old.rhizome.org/community/7893/ · https://www.skillshare.com/classes/design/Programming-Graphics-I-Introduction-to-Generative-Art/782118657 · https://thesak.com/blogs/beyond-the-craft/artist-q-a-joshua-davis · https://fitc.ca/presentation/28-years-of-random/ · https://fitc.ca/speaker/joshuadavis · https://nftnow.com/videos/behind-the-drop-joshua-davis-the-vo1d/

**Uncertain.** The Wired wording. The Flash-constraint reading is Emmy's, not his. The category name of the Golden Nica varies by source.

---

## A2. Yugo Nakamura

**Who and why.** Japanese web, interface and motion designer, founder of tha ltd., who gave the static web physical behaviour. The lens for "an interface should behave as if it has mass."

**Background.** Born in Nara in 1970, studied engineering at the University of Tokyo, began interactive design in 1998 and opened tha ltd. in 2004 (Japan Media Arts profile). His MONO\*crafts (1998) and yugop.com were the early proof: MoMA's interviewer remembers dark balls bouncing across a white page. Curator Paola Antonelli chose tha ltd. for MoMA's *Design and the Elastic Mind* site (2008) on seeing yugop.com (MoMA, 2010). tha ltd. launched FFFFOUND! (2007, closed 2017). Client work includes Uniqlo web direction, KDDI iida, and direction of NHK's educational programme *design A*. Awards include a Cannes Lions Grand Prix, the TDC Grand Prix and the Mainichi Design Award. In 2023 he led the game *Humanity* with Tetsuya Mizuguchi's Enhance; it began as his tech demo asking how many people he could put on screen at once, and he names boids flocking as a source (PlayStation Blog).

**Uniqlock: a credit to check.** Uniqlock (2007), a blog-widget clock of dancers, Fantastic Plastic Machine time signals and Uniqlo clothes, won the 2008 Cannes Cyber Grand Prix and Titanium Grand Prix. Every verified credit names Projector, Tokyo, with creative director Koichiro Tanaka. No source found in this pass credits Nakamura or tha ltd. on Uniqlock: UNVERIFIED. His documented Uniqlo work is web direction in general; one source credits him with an earlier *Industrial Clock* (2000).

**How he thinks.** Engineering first: motion is computed, not keyframed. He told MoMA the Elastic Mind site had two jobs, to be creative expression on the exhibition's theme and to work as an information site, and he designed them as two layers running in parallel (paraphrased).

**How he innovates.** He combined an engineer's simulation with a graphic designer's restraint: few elements, white ground, real dynamics. He removed decoration and let behaviour carry the look. *Humanity* inverts the viewpoint: you watch a crowd the way a person watches a bird migration.

**How interaction carries meaning.** How a thing answers your pointer (its weight, spring and settling) tells you what kind of thing it is before any label does.

**Quality bar.**
1. Motion comes from a model (mass, spring, damping), not a timeline.
2. It settles: nothing jitters at rest.
3. The expressive layer and the information layer each read alone.
4. Few elements on a plain ground, and it still feels alive.

**Lens questions.**
- What physical model is this motion, and what are its constants?
- Does it come to rest, and how long does that take?
- With the living layer switched off, is the information complete?
- What does the pointer do to it?

**Applied to Atüned.**
- Living ring: give the ring's answer to pointer and press a named model (one spring value, one damping value) and tune it until it settles in one beat without overshooting the gold band. A ring that eases on a curve reads as animation; a ring that settles reads as an object.
- Screens: the ruling that the stack holds still while a person reads (715) is Nakamura's two layers. Test it by switching the living layer off: the reading layer should lose nothing.
- Release: Uniqlock, whoever made it, made time itself the content. The odometer roll is the one moment the number is the motion; keep everything else still around it.

**Sources.** https://j-mediaarts.jp/en/award/profile/nakamura-yugo/ · https://fitc.ca/speaker/yugonakamura · https://www.moma.org/explore/inside_out/2010/02/19/a-few-words-with-yugo-nakamura/ · https://en.wikipedia.org/wiki/Yugo_Nakamura · https://mplus.org.hk/en/exhibitions/m-donor-wall/ · https://blog.playstation.com/?p=379666 · https://www.gamedeveloper.com/design/the-struggles-and-shifting-perspectives-that-helped-build-i-humanity-i- · https://www.campaignasia.com/article/uniqlo-japan-wins-cyber-grand-prix-at-cannes/25xzsmcyivgvln1jty1x58cpx8 · https://hypebeast.com/2007/6/uniqlock-uniqlo · https://postkiwi.com/?p=3448

**Uncertain.** His role on Uniqlock (UNVERIFIED, above). Which Cannes Grand Prix his profile refers to. *Industrial Clock* rests on one source. His title on *Humanity* varies (director, visual director, creative director).

---

## A3. Aaron Koblin

**Who and why.** American data artist who ran Google's Data Arts Team and co-led The Wilderness Downtown and The Johnny Cash Project with Chris Milk. The lens for "the crowd is the material, and every unit is a real person."

**Background.** *Flight Patterns* (2005) animated a day of North American air traffic from FAA data; it took a National Science Foundation first place for science visualisation in 2007 (Daily Bruin). *The Sheep Market* (2006) paid Mechanical Turk workers to draw a sheep facing left, about 10,000 drawings, which he has described as a critical take on the Turk itself. *Bicycle Built for 2,000* (2009): 2,088 recorded voices from 71 countries, each paid six cents to imitate a short clip. *The Johnny Cash Project* (2010, with Milk): fans drew the frames of "Ain't No Grave"; Grammy nomination, Best Short Form Music Video. *The Wilderness Downtown* (2010, with Milk, Google Creative Lab, B-Reel and @radical.media): an HTML5 Chrome video for Arcade Fire's "We Used to Wait" that asks for the address you grew up at and brings your street in through Street View, as browser windows open and close and birds fly between them; Cannes Cyber Grand Prix 2011. TED 2011: "Artfully visualizing our humanity". He co-founded the VR company Within with Milk; Meta bought it (announced 2021, closed February 2023), and UploadVR reports Milk and Koblin rebuilding Supernatural as an independent company.

**How he thinks.** Take a vast dataset or a vast number of people, and keep each one visible. A Brain Pickings write-up of his TED talk reports him reworking McLuhan as "the interface is the message" (write-up wording, transcript not checked).

**How he innovates.** He inverted the viewer into the contributor: every frame, sheep or voice is a person. He combined the viewer's own data with an authored film. He used the platform's plumbing as the medium: pop-up windows, Street View, the Turk's piece rate.

**How interaction carries meaning.** Your input is not a control, it is the content. The film is about your home because you typed it.

**Quality bar.**
1. Every unit in the aggregate is real and traceable.
2. The whole and the single unit are each one move away.
3. The person's own data appears, recognisably theirs.
4. The platform's features are used as material, not hidden.

**Lens questions.**
- What is the unit here, and can I see one?
- Is any of this filled in rather than collected?
- Where does the person see themselves?
- What does the interface say before the content does?

**Applied to Atüned.**
- Release counter: the lifetime number is a Sheep Market, a total of real acts. Let a person open it and see the units (each release, its address, its date). If the number cannot be broken back into its releases, Rule 6 is at risk.
- Living ring: The Wilderness Downtown landed because it was your street. Draw the ring from the person's own addresses and history, so two people's rings differ for a real reason, and say what that reason is.
- Screens: no sample data on a first run. An empty total says it is empty.

**Sources.** https://www.ted.com/speakers/aaron_koblin · https://www.peterme.com/2006/07/31/remember-this-name-aaron-koblin/ · https://dailybruin.com/2011/02/10/working_with_a_new_kind_of_canvas · https://staging2.phaidon.com/agenda/art/articles/2014/july/02/google-s-aaron-koblin-on-digital-revolution · https://www.brainpickings.org/2011/05/24/aaron-koblin-ted/ · https://www.brainpickings.org/2009/04/08/aaron-koblin-bicycle-built-for-2000/ · https://docubase.mit.edu/project/the-wilderness-downtown/ · https://www.adweek.com/?p=132807 · https://en.wikipedia.org/wiki/Within_(company) · https://www.meta.com/blog/within-to-join-meta/ · https://uploadvr.com/supernatural-to-return-under-new-independent-company-as-coaches-rejoin-platform/

**Uncertain.** His title at Within (CTO or president; sources differ). Direction credit on The Wilderness Downtown: trade press names Milk as director and Koblin as co-creator. The date of the UploadVR report.

---

## A4. Jonathan Harris

**Who and why.** American artist and computer scientist whose work turns the web's data back into single human voices, and who later questioned the ethics of software. The lens for "behind every point is one person; does this help them?"

**Background.** *We Feel Fine* (with Sep Kamvar; begun August 2005, launched May 2006) searched blogs every ten minutes for "I feel" and "I am feeling", saved each sentence with the writer's age, gender and place where it could, and gathered 15,000 to 20,000 feelings a day, about 12 million over four years; a book followed in 2009. It shows them in six "movements": Madness, Murmurs, Montage, Mobs, Metrics, Mounds. Each particle is one feeling, its colour the tone and its size the sentence length; click it and the sentence opens. TED2007: "The Web's secret stories". *The Whale Hunt* (2007): he lived with an Iñupiat family in Barrow (now Utqiagvik) during the spring hunt and took 3,214 photographs on a timer whose rate followed his heartbeat, up to 37 a minute at the peak; the interface uses the heartbeat as navigation. Later: *Cowbird*, a storytelling library, and "Modern Medicine", vignettes arguing that software, like medicine, can heal or harm, published in The Farmer & Farmer Review, which he started with Kamvar.

**How he thinks.** Data are people, so the whole must open into the individual. Ethics belong to the builder: Modern Medicine asks software makers to adopt shared ethical principles, with addictive technology as its target (Print, paraphrased).

**How he innovates.** He removed the analyst's chart and put the raw sentence back on screen. He tied the rate of capture to his own body. He inverted the visualisation from "what does everyone feel" to "what did this one person write."

**How interaction carries meaning.** Zoom is the moral. One gesture moves you from the crowd to a person and back.

**Quality bar.**
1. Every mark opens to the human record behind it.
2. The tempo comes from something real (a pulse, a clock), and says what.
3. The crowd view and the person view are both honest.
4. It passes his medicine test: it heals more than it hooks.

**Lens questions.**
- What does one particle contain?
- What sets the tempo, and is that tempo true?
- Who benefits if this loop works perfectly?
- Would the person be glad they came back, or only compelled to?

**Applied to Atüned.**
- Release animation: the spec calls the gold pulse "the whole Pavlovian hook". Through Harris: keep the pulse, and make the delta line (address, charge before, charge after) land as the evidence. A hook that rewards a real change is medicine; a hook that rewards the tap is the other thing.
- Living ring: The Whale Hunt's camera followed a heartbeat. If the ring breathes, say what drives the rate. A fixed pacer is fine and should be called a pacer; a rate that implies the person's state must be measured (Rule 6).
- Screens: every mark on the ring should open into the real release it came from, as a We Feel Fine particle opens into its sentence.

**Sources.** https://en.wikipedia.org/wiki/We_Feel_Fine · https://www.idfa.nl/en/film/89a1ef17-3321-4aca-ad5b-d1c2fe0dd748/we-feel-fine · https://paw.princeton.edu/article/tracking-emotions-web · https://elmcip.net/node/4684 · https://www.ted.com/talks/jonathan_harris_the_web_s_secret_stories · https://thewhalehunt.org/statement.html · https://www.polaine.com/2007/12/the-whale-hunt-by-jonathan-harris/ · https://www.metafilter.com/67343/The-Whale-Hunt · https://jjh.org/the-whale-hunt · https://www.printmag.com/daily-heller/to-heal-and-hurt/ · https://creativemornings.com/talks/jonathan-harris/9

**Uncertain.** The Whale Hunt trip length (sources say seven, nine or ten days, or two weeks). Cowbird's launch year: UNVERIFIED. Metrics and Mounds were not described in any excerpt.

---

## A5. Bruno Simon

**Who and why.** Paris-based creative developer whose 2019 portfolio let you drive a toy car through his work. The lens for "make the page a place you can touch, with physics."

**Background.** Shared in October 2019 and built with Three.js for rendering, Cannon.js for physics and Blender for the models. Over 400,000 visits; Awwwards Site of the Month, and reported Site of the Year. He built it first for his students, since his old site was a poor example for them. He loves games and thinks physics is underused on the web; he chose a car because driving is easier to navigate than first person, names Micro Machines as a childhood favourite, and says he still does not fully know why it took off (Pastel interview, paraphrased). He then built the course Three.js Journey. Five years on he began a new version for the WebGPU era, written in TSL (Three.js's way of writing shaders in JavaScript), partly to learn TSL by building with it every day (Awwwards case study; Codrops). He spoke at the first Three.js conference (Codrops, July 2026).

**How he thinks.** Build the thing you teach. Learn a tool by shipping a real project in it. Borrow game feel.

**How he innovates.** He inverted the portfolio from a list of links into a place. He combined a toy with a CV. Emmy's read: a small, toy-scale world is how a browser carries real-time physics without dropping frames, and that limit became the charm.

**How interaction carries meaning.** You learn the world by bumping into it. Physics gives every touch a consequence, so play is the navigation.

**Quality bar.**
1. Understood in the first second, with no instructions.
2. Touch has weight and consequence.
3. It holds frame rate on an ordinary machine.
4. The fun leads to the content.

**Lens questions.**
- What can a person play with before reading anything?
- What does a touch change?
- What did the frame budget force, and did we make it the style?
- Does the play lead to the work, or away from it?

**Applied to Atüned.**
- Living ring: is there one thing on Home a person can push in the first second and get a physical answer from? A small, damped give under the pointer makes the ring an object without making it a toy.
- Release animation: this is the product's one moment of consequence. The 400 ms hold should start on the frame the final gate completes and read as the beat after the act, not as lag.
- Caution: game feel pulls toward motion as the point. Simon's lens checks play; the ruling (motion is the pull, never the point) sets the ceiling.

**Sources.** https://www.creativebloq.com/news/3d-car-portfolio · https://usepastel.com/blog/how-a-design-portfolio-got-the-attention-of-400-000-visitors · https://www.awwwards.com/sites/brunos-portfolio · https://www.awwwards.com/brunos-portfolio-case-study.html · https://tympanus.net/codrops/2026/07/16/meet-the-speakers-of-the-first-three-js-conference/ · https://threejs-journey.com/lessons

**Uncertain.** The Site of the Year year (one source says 2020). Baked lighting from Blender: UNVERIFIED. That the new version's code and Blender files are public under MIT rests on one news aggregator. The new version's launch date.

---

### Better candidates? (web)

Lance decides. Emmy's top five stand; these are the names the research turned up.

- **Koichiro Tanaka (Projector, Tokyo).** The verified creative director of Uniqlock: Projector won the 2008 Cannes Cyber Grand Prix and Titanium Grand Prix for it (Campaign Asia, Adweek).
  D&AD named him a President's Award winner (dandad.org, 2025). If Uniqlock is why Nakamura is on the list, Tanaka is its documented author.
- **Vincent Morisset (Montreal).** Made Arcade Fire's interactive *Neon Bible* (2007), often called the first interactive music video, then *Sprawl II* and *Just a Reflektor*.
  His NFB piece *BLA BLA* won the 2012 SXSW Interactive Award and a Webby; *Way to Go* (NFB, 2015) took FWA Site of the Month and a Japan Media Arts jury selection. The body's presence and pace on screen, close to Atüned's register.
- **Lusion (Bristol).** Real-time WebGL studio whose own site won Site of the Year from FWA, Awwwards and CSSDA, with honours from Cannes Lions, D&AD and the Webbys (Codrops, 2026).
  Clients include Porsche and Google. The living craft of "something is always moving" on today's web. (Active Theory, Venice, California, was also checked: Google I/O games, Awwwards Site of the Month January 2018. Left off as the same lane as Lusion.)

Sources: https://www.campaignasia.com/article/uniqlo-japan-wins-cyber-grand-prix-at-cannes/25xzsmcyivgvln1jty1x58cpx8 · https://www.dandad.org/work/annual/d-ad-in-2025/how-the-internet-and-guy-ritchie-influenced-dad-presidents-award-winner-koichiro-tanakas-career · https://www.cbc.ca/news/entertainment/sxsw-prize-for-interactive-art-goes-to-nfb-filmmaker-1.1172432 · https://mediaspace.nfb.ca/epk/way-to-go/ · https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/ · https://www.commarts.com/features/active-theory · https://www.awwwards.com/active-theory-v4-wins-january-2018-site-of-the-month.html

---

# B. Motion graphic designers and animators

## B1. Saul Bass

**Who and why.** American graphic designer and filmmaker (1920-1996) who turned film titles from a list of names into the film's first statement. The lens for "one symbol, one metaphor, mood before story."

**Background.** *The Man with the Golden Arm* (1955): he chose a jagged arm, not Frank Sinatra's face, as the symbol for both titles and poster; white bars appear, vanish and form patterns, then become the arm. Executives and exhibitors disliked it; Bass and Otto Preminger kept it (Art of the Title, after Pat Kirkham). *Vertigo* (1958), with John Whitney on the spirals (B2). *Anatomy of a Murder* (1959): paper cut-outs of body parts to Duke Ellington's trumpets and wah-wah. *Psycho* (1960): rushing bars. *Spartacus* (1960), co-directed and produced by Elaine Bass, his partner from 1955 and later his wife. *Why Man Creates* (1968), credited to Saul and Elaine Bass, won the Oscar for documentary short. Late titles with Elaine for Scorsese: *Goodfellas* (1990), *Cape Fear* (1991), *The Age of Innocence* (1993), *Casino* (1995, his last). Logos include AT&T's bell (1969) and globe (1983).

**How he thinks.** Reduce the film to one image that works as a metaphor, and use it everywhere. A widely circulated line has him saying a title should "set mood and the prime underlying core of the film's story, to express the story in some metaphorical way" (signalvnoise.com and others copy the same words; the original source was not found). "Design is thinking made visual" is attributed to him everywhere with no primary source: UNVERIFIED.

**How he innovates.** He removed the star and the illustration and kept a symbol. He combined poster, titles and campaign into one system. The constraint he turned into a style: a few flat elements (bars, a cut-out, a line) moving in time, cheap to animate and hard to forget.

**How timing and music carry feeling.** The elements move on the score's accents, so feeling arrives before plot: Ellington's horns drive the *Anatomy* cut-outs; the *Golden Arm* bars enter like phrases.

**Credit dispute: the Psycho shower scene.** Bass storyboarded it and said in a 1981 Variety interview that Hitchcock had him set up and call the shots. Janet Leigh said Bass was present but never directed her, and that Hitchcock decided what Bass drew; assistant director Hilton Green said Bass was never on the set. Comparisons of boards and film are read both ways. His screen credit was pictorial consultant. Unresolved: Emmy credits the scene to Hitchcock, from Bass's storyboards.

**Quality bar.**
1. The whole reduces to one shape you could draw from memory.
2. The shape is a metaphor for the core, not a picture of the subject.
3. Mood lands before information.
4. The same symbol holds across every surface.

**Lens questions.**
- What is the one shape?
- What is it a metaphor for?
- With only three elements, what stays?
- Does the motion land on an accent, or on nothing?

**Applied to Atüned.**
- Living ring: the ring is already a Bass symbol, and the icon ruling repeats it. Test: shown alone, without the number or a label, does it say "an instrument that reads you"? If it needs CQ to say that, the symbol is not finished.
- Release animation: an odometer is a scoreboard metaphor. Lance ruled it ("like a video game score"), so it stays; the Bass question is whether anything in the 400 ms hold shows a release as a letting-go before the score arrives.
- Screens: sketch each screen as three flat shapes. A screen that cannot be sketched that way has no hierarchy yet.

**Sources.** https://artofthetitle.com/designer/saul-bass · https://artofthetitle.com/title/the-man-with-the-golden-arm · https://www.britannica.com/biography/Saul-Bass · https://en.wikipedia.org/wiki/Elaine_Bass · https://www.bfi.org.uk/lists/celebrating-saul-basss-centenary-10-essential-title-sequences · https://signalvnoise.com/posts/917-title-sequences-from-saul-bass-the-master-of-film-title-design · https://www.openculture.com/2013/10/who-created-the-famous-shower-scene-in-psycho-alfred-hitchcock-or-the-legendary-designer-saul-bass.html · https://www.slate.com/blogs/browbeat/2014/02/20/psycho_shower_scene_directed_by_saul_bass_watch_storyboards_side_by_side.html · https://thefilmstage.com/who-directed-the-iconic-psycho-shower-scene · https://www.creativebloq.com/design/graphic-design/quote-of-the-day-by-saul-bass-design-is-thinking-made-visual

**Uncertain.** The origin of both quotes. The composers of the *Vertigo*, *Psycho* and *Golden Arm* scores were not re-checked in this pass. How the late title work divides between Saul and Elaine. One source dates *Anatomy of a Murder* 1958.

---

## B2. John Whitney

**Who and why.** American animator (John Whitney Sr.) who built motion from mathematics, first on war-surplus analogue computers, then on IBM's. The lens for "harmony in motion: tension and release from ratios of speed."

**Background.** He converted a Second World War anti-aircraft gun director (usually called the M5; some accounts call it a Kerrison Predictor) into an animation machine, later adding M7 parts to make a rig about twelve feet long. Bass wanted *Vertigo*'s Lissajous spirals exact, which hand drawing could not give, so Whitney was brought in (Print, after the New York Times); a pendulum on the rotating rig drew the curves. He founded Motion Graphics Inc. in 1960; *Catalog* (1961) was the demo reel of what the machine could do. IBM artist in residence 1966 to 1969: *Permutations* (1966-68, with IBM's Jack Citron). *Arabesque* (1975), programmed by Larry Cuba, to a santur score by Manoochehr Sadeghi. Book: *Digital Harmony* (1980, Byte Books / McGraw-Hill), with code. Late work: the Whitney-Reed RDTD program for composing image and sound together.

**How he thinks.** Do not match colours to notes; match motion to harmony. Points move at different speeds; when the speeds stand in whole-number ratios the points line up into figures (consonance), and between those moments the pattern pulls apart (dissonance). Composer Bill Alves, his late assistant, writes that ratios of movement take the eye through tension and release, that the speeds follow the harmonic series of just intonation, and that Whitney rooted the work in Pythagorean harmonic law (paraphrased). An Iota Center statement on *Permutations* calls the result roughly equivalent to musical harmony (paraphrased).

**How he innovates.** He turned a weapon's computer into an instrument. He made the equation the image, so the motion is exact and endless. He inverted visual music from correspondence (a colour for a note) to structure (a ratio for a consonance).

**How timing and music carry feeling.** Feeling lives in convergence. The eye waits for the pattern to resolve, and the resolution pays off like a cadence.

**Quality bar.**
1. Every moving part has a stated rate, and the rates have a stated ratio.
2. The pattern visibly resolves and visibly departs.
3. Resolution comes at a felt, regular interval.
4. Nothing is hand-eased that the maths could do.

**Lens questions.**
- What are the speeds, and what ratio do they make?
- When does it resolve, and how often?
- Is the tension meant, or is it noise?
- Could the same rule drive sound later?

**Applied to Atüned.**
- Living ring: the strongest single lens for "something is always moving, pulling you in." Give the ring's moving parts speeds in simple ratios (1:2:3, say) so they drift apart and come back into alignment every few seconds. The pull is the eye waiting for the alignment.
- Release animation: the release could be the one moment the ring's parts come fully into phase, then drift again, a cadence. Check it against the spec's order (hold, roll, pulse) before proposing it.
- Rule 6: if alignment ever reads as "coherence", it must be driven by the real coherence number or not look like one. A decorative resolution must not pass for a measurement.

**Sources.** https://www.historyofinformation.com/detail.php?id=3556 · https://old.rhizome.org/editorial/2013/may/09/did-vertigo-introduce-computer-graphics-cinema · https://www.printmag.com/history/when-saul-bass-met-hitchcock/ · https://en.wikipedia.org/wiki/John_Whitney_(animator) · https://visualmusicarchive.org/works/w/permutations.html · https://www.dataisnature.com/?p=435 · https://microfest.org/visual-microtonality · https://alternativeprojections.com/films/permutations · https://archive.org/stream/DigitalHarmony_201611/Digital%20Harmony_djvu.txt · https://www.awn.com/animationworld/digital-harmony-life-john-whitney-computer-animation-pioneer

**Uncertain.** M5 versus Kerrison Predictor. Whether he has an on-screen credit on *Vertigo*: UNVERIFIED (the sequence is Bass's; Whitney's part is the spirals). Who brought him in, Bass or Hitchcock: sources differ. "Differential dynamics" as his own term: UNVERIFIED. His dates were not checked.

---

## B3. Oskar Fischinger

**Who and why.** German abstract animator (1900-1967) who made visual music frame by frame, and left Disney's *Fantasia* uncredited. The lens for "picture and sound are one object."

**Background.** In 1920s Germany he built a wax-slicing machine that filmed successive cross-sections of moulded wax. In Berlin he made the *Studies*, short abstract films to popular and classical music, and drew patterns onto the optical soundtrack to unite sound and image in one design. *Komposition in Blau* (1935). Hollywood from 1936. *An Optical Poem* (MGM, 1937 or 1938) set hundreds of paper cut-outs on near-invisible wires to Liszt's Second Hungarian Rhapsody, the only Fischinger film commissioned and released by a major studio (Canyon Cinema). On *Fantasia* he worked about nine months on "Toccata and Fugue", then left uncredited after his designs were made more representational; none of his original art is in the film. *Motion Painting No. 1* (1947): one oil painting on acrylic glass, filmed stroke by stroke over nine months, to Bach's Brandenburg Concerto No. 3; it is on the US National Film Registry. He patented the Lumigraph, an instrument for playing silent compositions of coloured light.

**How he thinks.** Motion and music are one composition, locked to the frame. John Cage, who worked for him briefly around 1937, later recalled him saying that everything has a spirit released by setting it into vibration, and credited the idea with starting him on percussion (paraphrased; Cage retold it in many wordings, and one scholar notes the contact may have lasted only days).

**How he innovates.** He removed the subject: pure form is the protagonist. He built the tools when none existed (wax slicer, drawn sound, Lumigraph). He turned the soundtrack strip, a technical margin, into a canvas.

**How timing and music carry feeling.** Forms anticipate, strike and decay with the music. *Motion Painting No. 1* makes the act of painting itself the rhythm.

**Credit dispute: Fantasia.** Disney's artists simplified his designs toward pictures; he left without credit. Disney's side was not found in this pass.

**Quality bar.**
1. Every motion has an attack and a decay.
2. Image and sound, or the rhythm that stands for sound, come from one score.
3. Abstraction is held, not drifted into illustration.
4. The tool fits the work, even if it has to be built.

**Lens questions.**
- What is the musical phrase of this motion?
- When sound arrives, will it come from the same source as the image?
- Is the abstraction being pushed toward literal pictures, and is that a loss?
- Where does each movement land?

**Applied to Atüned.**
- Release animation: silent, it still has a phrase. The spec's 400 ms hold, 600 ms roll and 200 ms pulse stand in a 2:3:1 ratio, already a coherent rhythm; keep the ratio if anyone retimes one part.
- Sound later: when the opt-in sound comes, derive it from the same data that drives the image (charge before and after), not from a stock chime.
- Screens: the open question in the art bible (a human figure, or abstract everywhere) is Fischinger's *Fantasia* problem. Abstraction pushed halfway to illustration loses its force; choose one.

**Sources.** https://canyoncinema.com/catalog/film/?i=5214 · https://www.tcm.com/articles/246892/an-optical-poem · https://cdm.link/music-visualization-1938-all-in-paper-oskar-fischingers-masterpiece-optical-poem/ · https://www.rem.routledge.com/articles/fischinger-oskar-1900-1967 · https://visualmusicarchive.org/works/w/motion-painting-no-1.html · https://m.imdb.com/es/name/nm0279202/trivia · https://www.cambridge.org/core/journals/journal-of-the-society-for-american-music/article/spirit-inside-each-object-john-cage-oskar-fischinger-and-the-future-of-music/01EA53AEF93BBE6D4C727E85E17EBB53 · https://www.moma.org/calendar/events/571 · https://www.lacma.org/node/43759

**Uncertain.** *An Optical Poem*'s year. The Lumigraph patent year (1955 in one source; a *Lumigraph* film is dated 1950). How many *Studies* there are (one source says twelve). That the wax slicer was meant for *Prince Achmed* and failed under hot lights: one source. The Center for Visual Music's archive was not reached in this pass. John Cage as an assistant on *An Optical Poem* appears only in a fan-compiled credit list: UNVERIFIED.

---

## B4. Norman McLaren

**Who and why.** Scottish-born Canadian animator (1914-1987) who founded the National Film Board of Canada's animation studio and drew picture and sound straight onto film. The lens for "movement is the material: what happens between the frames."

**Background.** Len Lye's camera-less *A Colour Box* (1935, GPO Film Unit) inspired him. John Grierson hired him to the NFB in 1941, where he founded the animation studio. *Begone Dull Care* (1949, co-directed with Evelyn Lambart): painted, drawn and scratched straight onto the film to the Oscar Peterson Trio, with Peterson's phrases used as shots and the music worked out together with Peterson; six international prizes, 1949 to 1954. *Neighbours* (1952): pixilation, live actors moved frame by frame; it won the Oscar in the documentary short category, oddly for a stylised drama; its soundtrack was scratched and drawn by hand; distributors forced its violent ending out, and it was restored during the Vietnam War from a lower-quality print. *Synchromy* (1971): cards of stripes photographed onto the soundtrack, where they make the notes, and onto the picture in colour, so you see exactly what you hear; it built on graphical sound by Rudolf Pfenninger and Nikolai Voinov and on his 1950s stripe experiments with Lambart.

**How he thinks.** Senses of Cinema prints his best-known definition, whose second sentence reads: "What happens between each frame is more important than what happens on each frame." The first sentence (animation is the art of movements that are drawn, not of drawings that move) circulates in several wordings; its original publication was not found.

**How he innovates.** He removed the camera (direct film), the instrument (drawn sound) and the drawing (pixilation animates people). He made the strip's physical margins the work. He worked small, with one partner, inside a public institution.

**How timing and music carry feeling.** Cut on the musical phrase. In *Synchromy* there is no gap at all between what is heard and what is seen.

**Quality bar.**
1. Step it frame by frame: the in-betweens are designed, not defaulted.
2. Picture and sound share a source or a phrase.
3. The method is visible and honest.
4. Small means suffice.

**Lens questions.**
- What happens between these two keyframes?
- What is the easing curve, and who chose it?
- Could the person see what they hear?
- What did we remove to get here?

**Applied to Atüned.**
- Living ring: capture the ring at 60 frames a second and step through one breath. If the in-betweens are a library's default ease, the ring's character belongs to the library.
- Release animation: the 600 ms roll is all in-between. Decide what a digit does between values (roll, blur, settle), and whether the digits it passes through are real values. If the roll flashes numbers that never existed, decide whether that sits within Rule 6.
- Sound later: *Synchromy* is the strongest case for making any release sound from the same numbers the delta line shows.

**Sources.** https://www.sensesofcinema.com/2005/cteq/norman_mclaren/ · https://animationobsessive.substack.com/p/two-views-of-movement · https://nfb.ca/distribution/film/neighbours_voisins · https://en.wikipedia.org/wiki/Neighbours_(1952_film) · https://animafest.hr/en/2016/film/read/neighbours · https://www.onf.ca/film/synchromy/ · https://collection.nfb.ca/film/synchromy · https://ubu.punctumbooks.com/film/mclaren_synchromy.html · https://en.wikipedia.org/wiki/Begone_Dull_Care · https://www.sensesofcinema.com/2005/cteq/begone_dull_care/ · https://blog.nfb.ca/blog/2017/07/06/jazz-and-cinema/ · https://expcinema.org/site/en/wiki/artist/len-lye

**Uncertain.** The trio's personnel on *Begone Dull Care* (sources differ). *Dots* and *Loops* (1940, drawn sound) were not checked in this pass. The exact wording and origin of his definition.

---

## B5. Kyle Cooper

**Who and why.** American title designer whose *Se7en* (1995) opening revived the title sequence as a film's first scene. The lens for "the title is the prologue, and texture is character."

**Background.** MFA from the Yale School of Art, where he studied with Paul Rand; creative director at R/Greenberg Associates in New York and Los Angeles, 1988 to 1996. *Se7en* (1995). In 1996 RGA's Los Angeles office became Imaginary Forces, co-founded by Cooper, Peter Frankfurt and Chip Houghton. He left in 2003, wanting to get back to creative work, and founded Prologue Films with Kimberley Cooper. Prologue's titles include *Mission: Impossible -- Ghost Protocol*, *Sherlock Holmes: A Game of Shadows*, *Rango*, *X-Men: First Class* and *American Horror Story*.

**Se7en.** Type scratched by hand into black scratchboard, then smeared and jittered in the film transfer; tabletop photography of the killer's notebooks; real objects (fish hooks, razor blades, needles, twine, hair from a shower drain). Cooper: "People think there's computer graphics in there, but we assembled the majority of the sequence by hand" (as quoted by The Fincher Analyst from a 2010 Blu-ray interview). Kyle and Kim Cooper cut out the end-credit names one by one and taped them into a single scroll. Music: an uncredited edit of "Closer (Precursor)", the Coil and Danny Hyde remix of Nine Inch Nails.

**Credit note.** Harris Savides shot the sequence and Angus Wall edited it, and one review gives them the main credit; Fincher's part is described as back-and-forth. Read it as Cooper's design, made by a team.

**How he thinks.** "A great title sequence should get an emotional response," and a successful one breaks the film down to its central concept (Design Week, 1997). Titles are the first scene, not information before the film, and his job is to match the director's point of view (Revert to Saved interview, paraphrased).

**How he innovates.** Just as digital polish arrived, he went back to the hand: scratch, jitter, flicker. He made type a character (the killer's hand). He turned the credits from a list into narrative.

**How timing and music carry feeling.** Stutter cuts and flicker against industrial sound; tension is built and deliberately not released, so the film inherits it.

**Quality bar.**
1. It works as the first scene: you learn something about the story.
2. You feel before you read.
3. The type has a voice that belongs to someone in the story.
4. You can tell a hand made it.

**Lens questions.**
- If this were the first scene, what would it tell us?
- Whose hand is the type?
- What should a person feel in the first two seconds?
- Is the texture serving the story or the reel?

**Applied to Atüned.**
- Release animation: the 400 ms hold is the prologue to the number. Does anything in it tell the story of what just happened (which address let go) before the score arrives? The delta line could arrive first, small, in the instrument's own voice.
- Screens: the type should sound like the instrument. The art bible's coming third voice (a display face) is the one Cooper would reserve for the moment of release.
- Caution: borrow the method, not the look. *Se7en*'s texture is dread; the art bible sets Star Trek, never Black Mirror.

**Sources.** https://en.wikipedia.org/wiki/Kyle_Cooper · https://artofthetitle.com/studio/prologue · https://artofvfx.com/?p=2112 · https://thefincheranalyst.com/2025/09/26/30-years-of-kyle-coopers-classic-title-sequence-for-se7en/ · https://www.designweek.co.uk/issues/8-may-1997/first-impression-2/ · https://reverttosaved.com/2009/03/26/from-the-archives-an-interview-with-kyle-cooper/ · https://georgetownvoice.com/2010/03/04/credit-where-credits-due/ · https://www.watchthetitles.com/?p=522 · https://www.nin.wiki/Closer · https://davesstrangeworld.com/tag/coil/

**Uncertain.** Which "Closer" version is in the film (the Precursor edit, or the version later issued on *Recoiled*). The Blu-ray quote is secondary. *The Walking Dead* titles are credited to Prologue only by a weak source.

---

### Better candidates? (motion)

Lance decides. Emmy's top five stand; these are the names the research turned up.

- **Len Lye.** Made *A Colour Box* (1935) for the GPO without a camera, the first direct film shown to a general audience; it inspired McLaren, and an Annecy 2005 panel put it in animation's top ten.
  Then built kinetic sculpture now held by the Whitney Museum and the Art Institute of Chicago: motion as a physical pull, the nearest thing in the record to the living ring.
- **Patrick Clair (Antibody, formerly Elastic).** Emmy for Outstanding Main Title Design in 2014 (*True Detective*) and 2016; creative director on *Daredevil* (2015) and *Westworld* (2016).
  Twelve to fifteen Emmy nominations depending on the source. The working title designer whose sequences carry feeling through slow, layered transformation.
- **Pablo Ferro.** Hand-lettered the *Dr. Strangelove* titles (1964; grease pencil on glass, per one interview); Art of the Title calls him a pioneer of split-screen and multi-screen imagery and a master of the quick cut.
  His *Thomas Crown Affair* (1968) split screens compress time. Maurice Binder was not researched in this pass.

Sources: https://en.wikipedia.org/wiki/Len_Lye · https://expcinema.org/site/en/wiki/artist/len-lye · https://en.wikipedia.org/wiki/Patrick_Clair · https://artofthetitle.com/designer/patrick-clair · https://lbbonline.com/news/director-patrick-clair-earns-three-emmy-nominations-for-outstanding-main-title-sequences · https://artofthetitle.com/designer/pablo-ferro · https://artofthetitle.com/feature/pablo-ferro-a-career-retrospective-part-1 · https://openculture.com/2018/12/the-revolutionary-title-sequences-trailers-created-by-pablo-ferro.html
