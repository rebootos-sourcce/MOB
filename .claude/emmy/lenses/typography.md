# Typography for Emmy: five lenses, plus what is known about type, brand and emotion, applied to Atüned
Researched 2026-10-15.
Lenses, not authorities: Emmy reviews through them, she never speaks for them.

---

**How to read this.** Every fact was checked against at least one search result from the source
named beside it. This environment blocked direct page fetches, so the checks rest on source text as
search returned it. Full pages were not read. Quotes appear only where the exact words came back
with a URL. Everything else is paraphrase. **UNVERIFIED** marks anything that could not be
confirmed. Facts about Atüned come from `atuned/src/10_style.css.html` and
`atuned/src/20_markup.html` as they stood on 2026-10-15.

Lance's brief: "Font translates brand and emotion. I want her to understand the psychology behind
that."

---

# PART 1: THE LENSES

## 1. Paul Renner (1878 to 1956)

**Who and why.** Renner was the German typographer who made Futura. He is the lens for geometry
corrected by the eye, and for type that states its era on purpose. Atüned's wordmark face is a
rounded geometric sans, which puts it in Futura's family tree.

**Background.** Born in Wernigerode in 1878, he wrote *Typographie als Kunst* (1922) and began
Futura in 1924. The Bauer foundry in Frankfurt issued it in 1927 (some sources say 1928). He
helped found and led the Meisterschule für Deutschlands Buchdrucker in Munich (1927). He published
*Mechanisierte Grafik* (1930) and *Kulturbolschewismus?* (1932), a booklet against Nazi cultural
policy. He was suspended on 1 April 1933, briefly arrested, and dismissed in February 1934. *Die
Kunst der Typographie* followed in 1939. Christopher Burke's 1998 biography is the standard study.

**How he thinks.**
- Radical first, then disciplined. Futura's trial drawings built letters from circles and
  triangles. Most of those alternates were cut before release.
- Classical bones under a modern skin. The capitals follow Roman inscriptional proportions.
- The eye overrules the compass. Strokes are not constant: optical centres, ascenders and
  descenders were adjusted, and the O rises slightly above cap height.
- Burke's summary: he took up current tendencies, then developed them slowly with fine judgement.

**Quality bar.**
1. The geometry looks even. Measuring even is not enough.
2. Any experimental form that costs reading is removed.
3. Proportion carries the face more than ornament does.
4. The face belongs to its time on purpose and can say why.

**Lens questions.**
- Where has pure geometry been trusted over the eye?
- Which clever letterform costs legibility, and would Renner have cut it?
- What era does this type claim, and does the product deserve the claim?
- Do the capitals hold classical proportion, or are they just stretched lowercase logic?

**Example review notes on Atüned.**
- The ATÜNED wordmark is set in Comfortaa, which is described as having uniform strokes and fully
  rounded terminals. Through this lens: look at the round letters next to the straight ones at
  17 px with 0.22 em tracking. If the O and U look lighter or smaller than the N and E, the
  geometry is uncorrected.
- In the app, the umlaut is two drawn dots (`<i>` elements inside `.um`), not the font's Ü.
  Through this lens, the dots must take their weight and roundness from the letters, or they will
  read as stickers.
- The ring is a circle and the wordmark is geometric. Is that echo deliberate? And does
  Instrument Sans, a neo-grotesque, sit at peace beside a geometric mark?

**Sources.** https://www.deutsche-biographie.de/sfz68886.html ·
https://centaur.reading.ac.uk/45799/ · https://hyphenpress.co.uk/?p=1550 ·
https://klim.co.nz/blog/the-future-design-information/ ·
https://www.thefoundrytypes.com/fonts/architype-renner/ · https://bauertypes.com/?p=34462 ·
https://impactum-journals.uc.pt/matlit/article/download/2182-8830_7-1_24/5832?inline=1 ·
https://www.palomar.edu/users/gkelley/PaulRenner.html

**Uncertain.** Futura's release year (1927 or 1928). The claims that Jan Tschichold taught at his
school and that he chose Georg Trump as successor come from one source each: **UNVERIFIED**. His
place of death: **UNVERIFIED**. Sources disagree on how far the O was corrected away from a true
circle.

---

## 2. Adrian Frutiger (1928 to 2015)

**Who and why.** Frutiger was the Swiss designer of Univers, Frutiger and Avenir. He is the lens
for type as a planned system, and for legibility under real conditions: speed, distance, blur.

**Background.** Born on 24 May 1928 in Unterseen (one obituary says Bern). At Deberny & Peignot
in Paris he built Univers (1953 to 1957) as 21 planned variations named by number, not by word:
Bold Condensed became 67. OCR-B (1968) followed the ECMA computer-industry standard and became a
world standard in 1973. For Charles de Gaulle Airport he drew a signage face (commissioned
1970/71, finished 1972). Linotype released its text version as Frutiger in 1976 (some sources say
1975). Avenir followed in 1988, and *Signs and Symbols* (German 1978 to 1981, English 1989). He
died on 12 September 2015.

**How he thinks.**
- The family comes before the font. Univers is a grid of weights and widths, and the number says
  where each one sits.
- Legibility is studied, not assumed. For Roissy he studied width, weight and letter shape. Open
  curve ends help a word read as one unit at a glance. One secondary source says he tested letters
  out of focus.
- Lessons from failure. He judged his Orly airport signs a failure: too little control, and
  everything in capitals.
- The spoon. In a widely repeated remark, a good spoon is one you do not remember after the meal,
  and type is the same kind of tool. Wordings vary, so it is paraphrased here.

**Quality bar.**
1. Every weight and width sits in one plan and can be named by its position.
2. Words still separate when blurred, small or seen at speed.
3. Apertures stay open; c, e and a do not close up.
4. A reader takes in the information without noticing the type.
5. Anything read at a glance is mixed case unless capitals have a reason.

**Lens questions.**
- Can I draw the type system as a grid with no gaps and no extra cells?
- Does it pass the blur test at the size and distance it is really read?
- Is anything set in capitals that someone has to read in a hurry?
- Would anyone remember this typeface after using the screen? Should they?

**Example review notes on Atüned.**
- 33 rules ask for weight 300, including the coherence number (`.cqn2`) and the wordmark. No
  embedded face carries 300 (declared: Instrument Sans 400 to 600, Geist Mono 400 to 500,
  Comfortaa 400 to 700), so by CSS font matching they render at 400. Draw the true grid. (Confirm
  in a browser.)
- Labels such as COHERENCE are set in tracked capitals in Geist Mono at 12 px. Run the blur test on
  the hero: does the label still separate from the number at arm's length?
- If body addresses are read under emotion, apply the Roissy test: can two similar addresses be
  told apart at a glance?

**Sources.** https://www.dezeen.com/2015/09/14/adrian-frutiger-obituary-life-work-font-designer-typography-univers-london-street-signs/ ·
https://www.designweek.co.uk/type-designer-adrian-frutiger-dies-aged-87/ ·
https://anrt-nancy.fr/en/papers/from-univers-to-multivers ·
https://www.rit.edu/amgweb/vi-deberny-et-peignot-post-war · https://eguide.ch/en/objekt/1879/?pdf=1879 ·
https://openlab.citytech.cuny.edu/type/?p=75 · https://monoskop.org/log/?p=13988 ·
https://journals.uc.edu/index.php/vl/article/view/4992 · https://www.dwrl.utexas.edu/2015/10/06/two-types-of-type-part-i/ ·
https://spiekermann.com/en/mr-univers

**Uncertain.** His birthplace (Unterseen or Bern). The Frutiger release year (1975 or 1976). The
exact spoon wording and its 1990 ATypI keynote source: **UNVERIFIED**. The blur testing rests on
one secondary source. The publisher of the English edition differs between catalogues.

---

## 3. Matthew Carter (born 1937)

**Who and why.** Carter is a British-born type designer working in the US, best known for Verdana
and Georgia. He is the lens for designing to the real constraint of the medium, and for spacing as
the hidden half of legibility.

**Background.** Born in London in 1937, he trained as a punchcutter at Enschedé in the
Netherlands from nineteen. His faces include Snell Roundhand, Bell Centennial (for phone books),
ITC Galliard, Charter, Mantinia, Big Caslon and Miller. He co-founded Bitstream (1981), described
as the first digital foundry, and Carter & Cone with Cherie Cone (1991; Eye says 1992). He drew
Verdana (1996) and Georgia for Microsoft, with hinting by Tom Rickner. MacArthur Fellow, 2010.

**How he thinks.**
- Start from the constraint. For Verdana he drew bitmaps first at the key screen sizes, then
  outlines hinted to reproduce them. Microsoft's Bill Hill called this working back to front.
- Spacing matters as much as shapes. In his account, even fitting on a coarse pixel grid meant
  looser spacing.
- Design for the worst case. Pixels were on or off, so the bold had to be much heavier than a
  print bold. Verdana got a large x-height and open counters.
- The whole over the parts. He is closely associated with the saying that a typeface is a
  beautiful collection of letters, not a collection of beautiful letters. Its origin is disputed.

**Quality bar.**
1. The type was drawn for the real medium at the real size, and was checked there.
2. At the smallest size used, the spacing is even: no touching letters, no lost word gaps.
3. It holds at the worst case: smallest size, lowest-density display, both themes.
4. Confusable characters stay distinct at that size.
5. Letters are judged in words and lines, not alone.

**Lens questions.**
- What is the worst screen this will be read on, and has anyone looked at it there?
- Is the spacing doing as much work as the letterforms?
- Which weight does the screen actually show, as opposed to the one the CSS asks for?
- Does the face hold up on Lumen dark and Snow light alike?

**Example review notes on Atüned.**
- `--f1` is 11 px and carries tracked mono capitals. Check it on a standard-density desktop
  monitor, not only on a high-density laptop, on both `#0E0E0D` and `#FCFCFB`.
- The 52 px coherence number asks for weight 300 in Instrument Sans, but the file carries only
  400 to 600. Through this lens, pick the hero weight from the rendered number on the real ring,
  never from the CSS value.
- The hero number has no tabular figures set, while the release roll (`.relroll b`) does. If the
  coherence number rolls, proportional digits can change its width as it counts. Check the roll
  frame by frame. Whether Instrument Sans offers tabular figures: **UNVERIFIED**.

**Sources.** https://eyemagazine.com/feature/article/reputations-matthew-carter ·
https://coopertype.org/people/matthew-carter · https://source.washu.edu/?p=51415 ·
https://neosmart.net/blog/wp-content/uploads/DWH-Georgia-and-Verdana-Interview.pdf ·
https://jyanet.com/cap/0131fe0.htm · https://lists.w3.org/Archives/Public/www-font/1998JanMar/0047.html ·
https://fnewsmagazine.com/2009/10/screen-fonts-on-paper/ · https://learn.microsoft.com/typography/font-list/verdana ·
https://typedrawers.com/discussion/comment/59867 · https://www.ted.com/speakers/matthew_carter

**Uncertain.** Carter & Cone's founding year (1991 or 1992). Ink traps in Bell Centennial:
**UNVERIFIED**. Dates for Snell Roundhand, Bell Centennial, Galliard and Georgia were not checked.
The origin of the "collection of letters" saying is disputed.

---

## 4. Erik Spiekermann (born 1947)

**Who and why.** Spiekermann is a German information designer and type designer: FF Meta,
MetaDesign, FontShop, and the Berlin transit signage. He is the lens for type as an organisation's
public voice, and for type that has to work in bad conditions.

**Background.** Born in 1947, he studied art history and English in Berlin. He founded
MetaDesign (1979) and, with Joan Spiekermann, FontShop (1988 or 1989). FF Meta began as a
commission for the Deutsche Bundespost (the federal post office), which never used it; FontFont
released it in 1991. MetaDesign did BVG's Berlin transit passenger information in 1990/91, and FF
Transit and FF Info came out of that signage work. He wrote *Stop Stealing Sheep* with E. M. Ginger
(1993). Later work: a Nokia family (2002) and a Deutsche Bahn type system (2005, German Design
Prize gold 2006). He later ran Edenspiekermann and runs the p98a letterpress workshop.

**How he thinks.**
- Brief from the worst case. The Bundespost wanted a neutral, space-saving face that stayed
  legible at small sizes and on vehicles and mailboxes.
- Distinct letters. Meta has fairly open apertures and keeps 1, I and l apart, which are easy to
  confuse in Helvetica.
- A voice, not a default. He called Meta the "complete antithesis of Helvetica"
  (https://www.Wikipedia.org/wiki/FF_Meta). Herman Miller later replaced Helvetica with it.
- One system for one organisation. Deutsche Bahn got a whole family built to cover every job.

**Quality bar.**
1. It works in the worst place it will appear.
2. 1, I, l, 0 and O can be told apart at working size.
3. With the logo covered, you can still tell who is speaking.
4. It saves space without getting tight.
5. Every job has a named face and weight, and the system holds across all media.

**Lens questions.**
- Where will this be read badly, and was it designed for that place?
- Cover the logo. Whose voice is this?
- Is this face a choice or a default?
- Does the deck speak with the same type system as the app?

**Example review notes on Atüned.**
- Write down which face does which job. Today Instrument Sans reads, Geist Mono measures and
  labels, and Comfortaa sets the wordmark, plus 14 other rules in the app stylesheet. Then check
  that the deck and the app agree.
- If any body address mixes letters and digits, check 1, I, l, 0 and O in both Geist Mono and
  Instrument Sans at 11 to 13 px. (These character distinctions were not checked:
  **UNVERIFIED**.)
- Cover the wordmark on a deck slide. Instrument Sans is free on Google Fonts, so on its own it
  cannot be a distinctive voice. What else on the slide says Atüned?

**Sources.** https://europeandesign.org/erik-spiekermann-2/ · https://spiekermann.com/en/bio/ ·
https://eyemagazine.com/feature/article/metas-tectonic-man · https://www.moma.org/collection/works/139324 ·
https://hermanmiller.com/stories/why-magazine/thats-so-meta · https://www.myfonts.com/de/pages/fontshop-fontlists-orientation-navigation/ ·
https://www.jbe-platform.com/content/journals/10.1075/idj.7.1.03kin ·
https://www.forward-festival.com/article/i-learned-never-to-promise-more-than-i-can-keep-interview-with-erik-spiekermann ·
https://fonts.google.com/knowledge/stop_stealing_sheep.pdf · https://grolierclub.omeka.net/items/show/1447

**Uncertain.** His birthplace and the year of the Meta commission: **UNVERIFIED**. FontShop's
founding year (1988 or 1989). Co-designers of the Deutsche Bahn type: **UNVERIFIED**. The brief
for cheap, poorly inked print comes from a single informal source.

---

## 5. Robert Bringhurst (born 1946)

**Who and why.** Bringhurst is a Canadian poet, typographer and linguist, and the author of *The
Elements of Typographic Style*. He is the lens for rhythm, proportion, measure, and the text coming
first.

**Background.** Born on 16 October 1946 in Los Angeles, he studied physics, architecture and
linguistics at MIT among other places (BA Indiana 1973, MFA British Columbia 1975). *The Elements
of Typographic Style* appeared in 1992; the 4th edition is dated 2012 or 2013 depending on the
listing. He is also a poet, and his work on Haida oral literature, *A Story as Sharp as a Knife*
(1999), was award-nominated and contested.

**How he thinks.**
- Content first. "Typography exists to honor content." (quoted in
  https://typographica.org/typography-books/the-elements-of-typographic-style-4th-edition/)
- Attention is borrowed. "In a world rife with unsolicited messages, typography must often draw
  attention to itself before it will be read." The same passage goes on to say that it must then
  give the attention back. (Quoted from the 3rd edition, p. 17, in
  https://regex.info/blog/2007-12-03/650)
- Measure. 45 to 75 characters for a single column of text, with about 66 widely treated as ideal,
  and 40 to 50 for multi-column work.
- Scale as music. He compares the classic type-size series to the diatonic scale and ties page
  proportions to musical intervals. Some reviewers call the page-proportion chapter numerology.

**Quality bar.**
1. The type serves the meaning of the text in front of it.
2. Running text stays inside 45 to 75 characters a line.
3. Sizes come from one scale with deliberate intervals.
4. Vertical rhythm is steady: consistent leading and consistent space between blocks.
5. Type that grabs attention (wordmark, hero) hands it back to the content.

**Lens questions.**
- What is this text, and does its setting honour it?
- Can I name the scale these sizes come from?
- Where does the eye go after the hero, and is the spacing taking it there?
- Is any line too long to read comfortably on a wide desktop window?

**Example review notes on Atüned.**
- The size tokens are 11, 13, 17, 22 and 40 px. Each step is a different ratio: 1.18, 1.31,
  1.29, then 1.82. Literal sizes sit outside the set too: the hero at 52, the release roll at 56
  and `.big` at 34. Through this lens, choose the intervals on purpose. Art direction pass item 3
  (carrying the ring's type scale to every tool) is the place to do it.
- The hero is type that grabs attention. Under the 52 px number, the 12 px mono label COHERENCE
  should lead the eye on to the non-clinical line that explains the number. Check the spacing does
  that.
- Measure the longest line of reading text in STORY and IMPRINTS on a wide window. If it runs past
  75 characters, cap the column. (The current measure was not checked.)

**Sources.** https://thecanadianencyclopedia.ca/en/article/robert-bringhurst ·
https://poetryinvoice.ca/read/poets/robert-bringhurst ·
https://typographica.org/typography-books/the-elements-of-typographic-style-4th-edition/ ·
https://regex.info/blog/2007-12-03/650 · https://webtypography.net/2.1.2 ·
https://v5.chriskrycho.com/journal/typographical-and-musical-scales/ · https://tachyons.io/docs/typography/scale ·
https://www.goodreads.com/book/show/44735

**Uncertain.** The 4th edition date (2012 or 2013). Both quotes come through secondary sources
quoting the book. The musical page-proportion claims are disputed as craft lore.

---

## Better candidates?

Two candidates fit Lance's request ("the psychology behind that") more directly than any of the
five. Neither is a type designer.

- **Kevin Larson** (Microsoft reading research). He co-wrote *The Aesthetics of Reading* with
  Rosalind Picard: good typography measurably lifts mood. He also co-wrote a 2013 study on
  typefaces that fit their content improving on-screen communication. His Eye essay *The science
  of word recognition* (2004) argues that we read the letters in a word, not its outline shape.
  Sources: https://www.media.mit.edu/publications/the-aesthetics-of-reading-2 ·
  https://eyemagazine.com/opinion/article/the-science-of-word-recognition
- **Sarah Hyndman** (Type Tasting). She co-wrote *The taste of typeface* (i-Perception, 2015) with
  Charles Spence's group, which found that rounder typefaces are matched to sweet tastes and rated
  more likable. She also wrote *Why Fonts Matter* (2016). Her whole practice is type psychology.
  Sources: https://pmc.ncbi.nlm.nih.gov/articles/PMC4934647 ·
  https://www.creativeboom.com/inspiration/sarah-hyndman-on-type-psychology-and-why-fonts-are-more-than-just-visual/
- **Beatrice Warde**, as a counterweight. *The Crystal Goblet* (lecture 1930, printed 1932) is the
  founding case that type should be invisible, a clear glass rather than a gold cup. That is the
  opposite pole from type as brand emotion. Source:
  https://openlab.citytech.cuny.edu/langecomd3504fa2019/files/2018/10/Warde_CrystalGoblet.pdf

---

# PART 2: TYPE, BRAND AND EMOTION: WHAT IS KNOWN

## 1. The anatomy that matters when choosing type

- **x-height**: the height of lowercase letters without ascenders, such as x. At the same point
  size, a face with a larger x-height looks bigger and holds up better when small. Vision research
  measures reading in x-height. Legge and Bigelow (2011) put the fluent reading range at about
  0.2 to 2 degrees of visual angle, roughly 1.4 to 14 mm of x-height at 40 cm.
- **Contrast**: the difference between thick and thin strokes. Low contrast (Futura, Instrument
  Sans) reads as even and engineered. High contrast (Bodoni) reads as formal and fashion-like, and
  the thin strokes break up at small screen sizes.
- **Aperture**: how open the gaps are in c, e, a and s. Open apertures keep letters distinct when
  small or blurred. This is the Frutiger and Meta argument.
- **Counters**: the enclosed spaces in o, a and e. Larger counters were one of Verdana's
  small-size choices.
- **Terminals**: how strokes end. Flat, angled and rounded endings carry much of a face's
  temperature. Rounded terminals are the defining trait of Comfortaa.
- **Width and weight**: condensed faces save space and feel tense; wide faces feel calm and slow.
  Weight carries emphasis and, per Henderson and colleagues below, part of the impression.
- **Spacing**: Carter's point. Even, sufficient spacing is as important to legibility as the letter
  shapes.
- **Figures**: tabular figures are all the same width, so they suit columns and changing numbers.
  Proportional figures look better in running text. A number that animates needs tabular figures
  or it will shift sideways as it changes.

## 2. Classification that matters

Classification is a vocabulary, not a science. The long-standard Vox-ATypI system was dropped by
ATypI in April 2021, and a broader replacement is being worked on.

- **Serif families.** Old-style or humanist (Garamond): low contrast, angled stress, drawn from
  the pen. Transitional (Baskerville): sharper and more upright. Modern or Didone (Bodoni): extreme
  contrast and hairline serifs. Slab (Clarendon, Rockwell): heavy, square serifs.
- **Sans families.** Grotesque: 19th-century, a little irregular. Neo-grotesque (Helvetica,
  Univers): uniform and closed, a neutral voice. Instrument Sans's designers name neo-grotesques as
  their root. Geometric (Futura, Avenir): built on circles and straight lines, optically corrected.
  Comfortaa is a rounded geometric. Humanist (Gill Sans, Frutiger, Meta): proportions taken from
  handwriting, with open apertures.
- **Monospace**: every character the same width. It reads as code and terminal. Geist Mono was
  built for code editors, terminals and diagrams.

## 3. Research on typeface personality and emotion

- **People agree on type personalities, and match them to uses.** Brumberger (2003, two papers in
  *Technical Communication*) found strong evidence that readers assign personality traits to
  typefaces and to texts. Her starting point: designers' persona claims had rested on craft lore,
  not evidence. Shaikh, Chaparro and Fox (2006) had 20 fonts rated on 15 adjective pairs.
  Perceived personality followed the design family (serif, sans, modern, monospace, script), and
  the perceptions predicted which uses people thought suitable. A related study found monospace
  read as "plain", serifs as traditional and sans as casual.
- **The dimensions are old ones.** Doyle and Bottomley (2006) measured fonts on Osgood's three
  dimensions: evaluation (good or bad), potency (strong or weak) and activity (lively or calm). A
  font looked right for a product when the two matched on potency and activity. In their earlier
  2004 work, a brand set in a fitting font was chosen about twice as often in a forced choice, and
  chosen 75 percent of the time in a field test. (The figures come from the abstract and summaries;
  the full text was not read.)
- **Rounded and angular.** Velasco, Woods, Hyndman and Spence (2015) found rounder typefaces
  matched to "sweet" and angular ones to bitter, salty and sour. Rounder faces were also rated more
  likable and easier to read. The authors explain the link through ease of processing and liking.
  A 2018 follow-up held for "sweet" across countries, but the angular effect did not hold for
  Chinese characters. More broadly, Bar and Neta (2006) found people prefer curved objects to
  sharp-angled ones, and proposed that sharp contours signal threat. A later study found the
  preference held for positive and neutral objects but not negative ones. The follow-up claim that
  sharp shapes activate the amygdala more strongly: **UNVERIFIED** (not found at the primary
  source).
- **Good typography lifts mood.** Larson and Picard found that readers given well-set text did
  better on creative tasks and on a time-perception measure that tracks mood. Reading speed and
  comprehension barely moved. A later paper found two measures that reliably detect typographic
  quality: better creative-task performance, and less activity in the frowning muscle.

## 4. Processing fluency: why easy reads as good and true

Fluency is how easily the mind processes something. It quietly colours judgement.
- **Hard to read feels hard to do.** Song and Schwarz (2008) printed the same exercise
  instructions in Arial or Brush script. The script version made people expect more effort and
  feel less willing to try, while recall was equal. Reported figures are about 15 against 8
  minutes estimated, from secondary coverage. The first experiment had 20 participants.
- **Easy to read feels true.** Reber and Schwarz (1999) showed that statements in high-contrast,
  easy-to-read colours were judged true above chance, while low-contrast versions sat at chance.
- **The reverse claim did not survive.** "Hard-to-read fonts make people think harder"
  (Diemand-Yauman and colleagues, 2011) failed replication. Meyer and colleagues (2015) pooled the
  original with 16 replications and found no effect on problem-solving.

**What this means for a precision product.** Clean setting lends a number credibility whether or
not it has earned it. Rule 6 (every number shown is real) carries more weight because the type is
good.

## 5. Legibility on screens

- **Serif or sans hardly matters for legibility.** Arditi and Cho (2005) found no meaningful
  legibility difference from serifs, apart from a tiny gain at the acuity limit. The sample was
  very small. "Sans for screen" dates from coarse pixel grids and is mostly lore on today's
  displays.
- **Size and x-height matter more than style.** Published text sizes cluster inside the fluent
  range, and the limits are set mainly by the human visual system (Legge and Bigelow, 2011).
- **There is no single best font.** Wallace, Bylinskii and colleagues (ACM TOCHI, 2022) compared
  16 fonts. Each reader's fastest font was about 35 percent faster than their slowest, with no
  loss of comprehension, but the fastest font differed from person to person.
- **Design for the screen you have.** Verdana's large x-height, loose spacing and heavy bold were
  answers to pixels that were simply on or off. The method still applies even though screens have
  improved.

## 6. How brands use type to carry meaning

- **Impression is designable.** Henderson, Giese and Cote (*Journal of Marketing*, 2004) reduced
  typeface design to six dimensions: elaborate, harmony, natural, flourish, weight and compressed.
  They linked these to four impressions: pleasing, engaging, reassuring and prominent, with
  trade-offs between them. (Which dimension drives which impression is in the full paper, which
  was not read.)
- **Fit beats beauty.** Doyle and Bottomley's congruity work, and a 2013 Microsoft study on
  typefaces that fit their content, both point the same way. A face is judged against what it
  carries.
- **Owned type is a voice.** Deutsche Bahn commissioned a whole type system. Herman Miller swapped
  Helvetica for Meta. Vercel commissioned Geist, which is based on Swiss typographic principles.
  The design studio Instrument released Instrument Sans under its own name. A free, widely used
  face can carry a mood, but it cannot be a distinctive asset on its own.
- **Attention, then transparency.** Bringhurst's line covers brand type: it may grab attention
  first, then it must give it back. Warde's *Crystal Goblet* is the purist version of the second
  half.

## 7. Solid evidence versus designer lore

| Claim | Status |
|---|---|
| People agree on typeface personalities and match them to uses | Solid (Brumberger 2003; Shaikh et al. 2006; Doyle and Bottomley 2006) |
| A fitting font raises appropriateness and choice | Fairly solid (Doyle and Bottomley 2004, 2006; Henderson et al. 2004) |
| Rounder type reads sweeter, more likable, easier | Solid for taste words and liking (Velasco et al. 2015, replicated across countries for "sweet") |
| Easy-to-read type makes claims feel truer and tasks feel easier | Solid as an effect (Reber and Schwarz 1999; Song and Schwarz 2008). Effects are modest, and some samples are small |
| Good typography improves mood | Supported (Larson and Picard), with little effect on speed or comprehension |
| Hard-to-read fonts improve thinking or learning | Failed replication (Meyer et al. 2015) |
| Baskerville is "the most trustworthy font" | Lore built on one informal online test (Errol Morris, *New York Times*, 2012, about 45,000 readers). Tiny effect, six fonts, not peer reviewed |
| Serifs are more legible in print and sans on screen | Mostly lore. Serifs make little difference (Arditi and Cho 2005). Screen resolution drove the old advice |
| We read words by their outline shape | Contested. Larson's review argues we read the letters |
| There is one most readable font | False for individuals (Wallace et al. 2022) |
| Specific emotions such as calm, spiritual or trustworthy belong to specific faces | Mostly lore. Research supports broad dimensions (strong or weak, lively or calm, round or angular), not fine emotional labels |
| Musical ratios make pages beautiful | Craft tradition (Bringhurst). Not tested |

## 8. Applied to Atüned

**What is in the file.** These come from the source, not from memory.
- Tokens: `--ui` is Instrument Sans and `--mo` is Geist Mono. Sizes are 11, 13, 17, 22 and 40 px
  (DESIGN_BIBLE, TYPE).
- Three faces are embedded as base64 variable fonts, each declaring a weight range (`10_style.css.html`,
  the @font-face rules at the top). Since the fix of 2026-10-16: Instrument Sans 400 to 600, Geist Mono
  300 to 500, Comfortaa 300 to 700. The embedded files carry Instrument Sans 400 to 700, Geist Mono 100
  to 900 and Comfortaa 300 to 700.
- Comfortaa is set directly in its rules, not through a token. The wordmark `.wm` is one of them.
- Fixed 2026-10-16, ruled by Lance: 33 rules asked for weight 300 and rendered 400 (verified in a
  browser), 17 of them through an undefined `--lg`. Now the wordmark is Comfortaa Light, `--lg` is
  Geist Mono, and the big numbers render in Geist Mono Light. Light rules on words say 400, and 28
  mono rules that asked 600 or 700 say the 500 they render. The gate now fails any weight a face
  cannot draw.
- There are two `.wm` rules, and the later one wins: Comfortaa Light, 0.22 em tracking. The
  umlaut dots sit over the U's two stems.
- The investor deck uses Instrument Sans for text and Comfortaa for the ATÜNED wordmark (per
  Emmy's brief).

**What each choice communicates.**
- **Instrument Sans.** Its makers describe it as balancing a lot of precision with a little
  playfulness, rooted in neo-grotesques. Low contrast, even and contemporary, it fits "vector and
  glass, super clean". The risk is genericness: it is a free Google font with a 2023 look.
- **Geist Mono.** It reads as code and instrument, and research finds monospace "plain". It is
  right for measured values and labels. Spread too wide, it could tip the product from soul
  instrument into developer tool (Emmy's inference, not evidence).
- **Comfortaa.** A rounded geometric with uniform stroke. The evidence on roundness points to
  sweet, likable and easy. It brings warmth and approachability, and with its geometry it echoes
  the ring. It does not, on the evidence, signal precision.

**Qualities that suit calm, precision, the body and spirit.**
- **Calm**: fluent reading (open apertures, generous spacing, a sound x-height), low contrast,
  few faces, one scale, steady rhythm, and a still stack while reading. Fluency and liking are the
  measurable side of calm.
- **Precision**: tabular figures for every changing number, monospace or tabular digits for
  readouts, distinct 1, I, l, 0 and O, real rendered weights, and hinting checked at 11 px. Rule 6
  applies to the type too: the weight on screen should be the weight the system says.
- **The body**: humanist forms, drawn from the moving hand, are the conventional carrier of a
  bodily trace. That is designer lore with no direct test. Roundness carries softness, with
  evidence for liking and sweetness only.
- **Spirit**: inscriptional capitals and classical serifs carry ceremony and age by convention.
  This is lore; the only "trust" test is Morris's informal one. If the third display voice is
  meant to carry spirit, test candidates on Lance's panel rather than trusting reputation.

**Conflicts with rulings: flagged, not resolved.**
1. **A third voice, already present?** ART_DIRECTION_BIBLE: "A display face joins the sans and the
   mono; the pass chooses it." But Comfortaa is already embedded and used in 15 rules, beyond the
   wordmark. Is Comfortaa the third voice, a wordmark-only face, or a placeholder?
2. **Not in the tokens.** DESIGN_BIBLE lists two faces only, and it is generated from the tokens,
   so Comfortaa is invisible to it. ATUNED_PRODUCT_BIBLE_v1 lists Comfortaa as the wordmark face.
3. **"Precision, not comfort"** (ART_DIRECTION_BIBLE, What the Product Is) and CUSTOMER_BIBLE's
   "if the product feels like a wellness app they leave". Set against these, the evidence places
   Comfortaa's rounded register on the friendly, sweet side. This is a tension to test with the
   panel, not a verdict.
4. **Weight 300 on paper only.** The light weights the stylesheet asks for, the hero number
   included, are not in the file. The pass's hero propagation item (the ring's line weight and type
   scale) should start from the rendered weights.
5. **Literal sizes outside the scale** (52, 56, 34 px) sit beside a five-step token scale with
   uneven intervals.

---

# SOURCES FOR PART 2

- Brumberger 2003: https://www.ingentaconnect.com/contentone/stc/tc/2003/00000050/00000002/art00008 ·
  https://mirrors.mit.edu/CTAN/bibliography/bibtex/contrib/bestpapers/typography.bib
- Shaikh, Chaparro and Fox 2006: https://portfolio.erau.edu/en/publications/perception-of-fonts-perceived-personality-traits-and-uses/ ·
  https://portfolio.erau.edu/en/publications/personality-of-cleartype-fonts/
- Doyle and Bottomley 2006: https://orca.cardiff.ac.uk/id/eprint/2571/
- Henderson, Giese and Cote 2004: https://en.wikipedia.org/wiki/Pam_Henderson (bibliographic record; DOI 10.1509/jmkg.68.4.60.42736)
- Velasco, Woods, Hyndman and Spence 2015: https://pmc.ncbi.nlm.nih.gov/articles/PMC4934647 ·
  2018 follow-up https://biopen.bi.no/bi-xmlui/handle/11250/2499581
- Bar and Neta 2006: https://nmr.mgh.harvard.edu/publications/journal_articles/743
- Larson and Picard: https://www.media.mit.edu/publications/the-aesthetics-of-reading-2 ·
  https://www.microsoft.com/en-us/research/?p=754147
- Hazlett, Larson, Shaikh and Chaparro 2013: https://microsoft.com/en-us/research/uploads/prod/2021/06/Hazlett-Larson-Shaikh-Chaparo-2013-two-studies-on-how-a-typeface-congruent-with-content-can-enhance-onscreen-communication.pdf
- Song and Schwarz 2008: https://www.psychologicalscience.org/news/releases/if-its-hard-to-read-its-hard-to-do-study-shows-difficult-to-read-instructions-decrease-motivation.html ·
  https://news.umich.edu/if-its-hard-to-read-is-it-hard-to-do
- Reber and Schwarz 1999: https://api.isr.umich.edu/publications/effects-of-perceptual-fluency-on-judgments-of-truth/
- Meyer et al. 2015: https://digitalcommons.georgiasouthern.edu/psych-facpubs/85 ·
  https://www.learningscientists.org/blog/2016/10/25-1
- Arditi and Cho 2005: https://pmc.ncbi.nlm.nih.gov/articles/PMC4612630
- Legge and Bigelow 2011: https://pmc.ncbi.nlm.nih.gov/articles/PMC3428264
- Wallace et al. 2022: https://research.adobe.com/publication/towards-individuated-reading-experiences-different-fonts-increase-reading-speed-for-different-individuals ·
  https://jeffhuang.com/papers/Readability_TOCHI22.pdf
- Larson, word recognition 2004: https://eyemagazine.com/opinion/article/the-science-of-word-recognition
- Errol Morris 2012 (secondary): https://stephanieevergreen.com/the-font-of-truth/
- Vox-ATypI de-adoption: https://en.wikipedia.org/wiki/Vox-ATypI_classification
- Warde: https://openlab.citytech.cuny.edu/langecomd3504fa2019/files/2018/10/Warde_CrystalGoblet.pdf
- Instrument Sans: https://github.com/Instrument/instrument-sans · https://www.serbyte.net/fonts/instrument-sans
- Geist Mono: https://basement.studio/post/the-birth-of-geist-a-typeface-crafted-for-the-web ·
  https://fontsource.org/fonts/geist-mono/about
- Comfortaa: https://fontalternatives.com/fonts/comfortaa/ · https://rightfontapp.com/family/comfortaa ·
  https://ctan.net/fonts/comfortaa/doc/comfortaa.pdf
- FF Meta and DB: https://www.moma.org/collection/works/139324 · https://europeandesign.org/erik-spiekermann-2/

**Uncertain in Part 2.** The Song and Schwarz minute figures and the Doyle and Bottomley choice
figures come from summaries. Instrument Sans's designers (Rodrigo Fuenzalida and Jordan Egstad)
and its 2023 Google Fonts date come from third-party listings. Comfortaa's first release (2008 to
2011, sources differ). Geist's launch date (early or October 2023). Whether Instrument Sans and
Comfortaa include tabular figures: **UNVERIFIED**.
