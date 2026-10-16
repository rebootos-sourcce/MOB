# Emmy lens files C and D: mathematicians (Euler, Gauss, Fourier, Noether, Shannon) and animation, look development and feel (Frank Thomas and Ollie Johnston, Miyazaki, Miyamoto, Moebius)
Researched 2026-10-15 for Emmy's reference library.
Lenses, not authorities: Emmy reviews through them, she never speaks for them.

**How this was checked.** Direct page fetching was blocked from the research environment (MacTutor, Wikipedia, Nintendo, Studio Ghibli and archive.org were all refused by the network policy). Every fact below was checked through search-engine excerpts of the pages listed under each entry, not by opening those pages. A quote appears only where an excerpt showed the exact words with a source URL; recheck the wording against the page before anything is published. The search budget ran out before a final pass, so gaps are marked UNVERIFIED or listed under "Uncertain".

**About the applied notes.** They refer to Atüned (stress mapped to 108 body addresses, 54 a side, plus four field nodes, 112 in all, as quoted from the book proposal in `voice_profile.md`; plus a coherence number) and to the book's hand-drawn plates. Emmy has not checked how the coherence number is computed, so notes that depend on it say so. Rule 6 (every number shown is real) is the standing house rule these lenses sit under.

---

# C. Mathematicians

## C1. Leonhard Euler (1707-1783)

**Who and why.** Swiss, the most prolific mathematician on record. His notation and worked examples made hard mathematics usable by everyone after him. The lens for "compute it, name it well, show the working."

**Background and history.** He worked at the St Petersburg Academy, whose journal printed his 1736 paper on the seven bridges of Königsberg. He drew the four land masses as points and the seven bridges as lines, and proved the walk impossible. That paper is now treated as the start of graph theory. In 1735 he solved the Basel problem (the sum of 1/n²), showing it equals π²/6. His *Introductio in analysin infinitorum* (1748) built analysis around the idea of a function. Asked to tutor princesses of Brandenburg-Schwedt, he turned the lessons into the *Letters to a German Princess*. He lost the sight of his right eye in the 1730s (sources give 1735 or 1738). A cataract was found in his left eye in 1766, and within weeks he was almost totally blind. His output did not drop: he worked from memory and mental calculation and dictated to his sons and a secretary. One source counts over 800 papers.

**How he thinks.**
- *Calculate first, then believe.* Before he solved the Basel problem, he used his summation formula to compute the sum to 20 decimal places. Adding up the series directly would have taken more than 10^20 terms. The number convinced him the answer was π²/6, and the solution came the same year.
- *Reason by analogy, then go back for rigour.* His 1735 argument carried a rule for ordinary polynomials over to an infinite product built from the roots of sin(x)/x. It was controversial at the time, and a proof he was satisfied with took about seven more years. He published the insight and kept working on the foundation.
- *Notation as a thinking tool.* A St Andrews summary credits him with f(x) for a function (1734), e (1727), i (1777) and Σ for sums (1755), and with making π standard. Good notation lets the page do part of the calculation.
- *Strip the problem down to its structure.* In the Königsberg paper, the streets, distances and shape of the city were thrown away. Only which land connects to which land was kept.
- *A method that survives loss.* Blindness changed how he worked (memory, dictation). It did not change how much he produced.
- *Teach plainly.* He explained science to a princess in letters.

**Quality bar.**
1. The result has been checked against many computed cases, not one.
2. The naming or notation makes the next step easier, not just shorter.
3. The irrelevant detail is gone. Only the structure that decides the answer is left.
4. A non-specialist can follow one worked example from input to output.
5. Insight is labelled as insight until it is proved.

**Lens questions.**
- Have we computed enough real cases to know what this number does?
- Does our naming let someone work things out without a lookup table?
- What is the "dots and lines" version of this problem?
- Where is the worked example a person can follow?
- What here is plausible but not yet proved, and is it labelled that way?

**Applied to Lance's work.**
- Atüned, address names: if each of the 112 address codes carries side, region and order inside it (the way f(x) or Σ carries its meaning), users and developers can reason about addresses without the chart. If the codes are arbitrary labels, the notation is doing no work.
- Atüned, coherence number: before it ships, run the formula on a large set of real sessions and look at the spread. Euler trusted π²/6 after computing 20 places. The app should know its own distribution before it tells anyone their number is "high."
- Book: one plate showing a single worked case (this stressor, this address, this response) teaches the system faster than a plate showing all 112 at once.

**Sources.**
- https://mathshistory.st-andrews.ac.uk/SH/euler_sh.pdf
- https://arxiv.org/pdf/1912.03527
- https://arxiv.org/pdf/2202.02202
- https://www.maa.org/book/export/html/116599
- https://historyofinformation.com/detail.php?id=3406
- https://arxiv.org/pdf/1406.7397
- https://www.simplycharly.com/people/leonhard-euler
- https://www.cambridge.org/core/books/how-euler-did-even-more/euler-as-a-teacher-part-2-february-2010/A7FF8BB01DE284FA252F473AA543DFEB
- https://en.wikiquote.org/wiki/Laplace

**Uncertain or contested.**
- "Read Euler, read Euler, he is the master of us all" is usually credited to Laplace. Guglielmo Libri reported it around 1846, and Sandifer calls the attribution dubious. Do not quote it as Laplace's.
- The date he lost his right eye differs by source (1735 or 1738).
- π was used for the circle constant before Euler, usually credited to William Jones in 1706. Euler made it standard. (Jones not rechecked this pass.)
- His Berlin years, and the idea that Pólya held Euler up as the model of showing how a discovery was made, come from general knowledge. UNVERIFIED this pass.
- The popular claim that "half his work came after he went blind" was not found in any source checked.

---

## C2. Carl Friedrich Gauss (1777-1855)

**Who and why.** German. The standard for finished work: few results, each complete, many of them tested against the physical world. The lens for "is it ripe?"

**Background and history.** In 1796, as a Göttingen student, he proved that a regular 17-sided polygon can be built with ruler and compass. It was the first entry in a private mathematical diary he kept until 1813. *Disquisitiones Arithmeticae* (summer 1801) introduced the ≡ sign for congruence and gave the first two proofs of quadratic reciprocity. Also in 1801, the newly found Ceres was lost behind the Sun. Gauss's predicted position differed sharply from other people's. When Ceres was found again on 7 December 1801, it was almost exactly where he had said. He had used least squares and did not reveal it then. Legendre published the method in 1805, Gauss said he had used it since 1794 or 1795, and a priority dispute followed. *Theoria motus* (1809) set out his orbit method. In 1818 he was asked to survey the Kingdom of Hanover. Out of that work came *Disquisitiones generales circa superficies curvas* (1827, some sources say 1828) and the Theorema Egregium: you can find the curvature of a surface from measurements made on the surface itself. In 1833 he and Wilhelm Weber ran an early electric telegraph across Göttingen.

**How he thinks.**
- *Pauca sed matura, "few but ripe."* His seal showed a fruit tree with this motto. He published only when a result was complete and its presentation satisfied him, so much of his work stayed unpublished until after his death.
- *Take down the scaffolding.* One source reports that he defended his terse proofs by saying a good architect removes the scaffolding once the building is finished, and that Abel complained he covered his tracks like a fox. (Paraphrase. The wording is UNVERIFIED.)
- *Heavy private calculation.* From about 1792 he counted primes by hand in blocks of a thousand. From those tables he guessed that the number of primes up to n is close to the integral of 1/log n. He never published it. It survives in an 1849 letter to the astronomer Encke, with a table running to 3,000,000.
- *Theory answers to observation.* Ceres, the Hanover survey and the magnetic work all tested mathematics against the sky and the ground.
- *Measure from inside.* The Theorema Egregium shows that a creature living on a surface can know its shape without stepping off it.

**Quality bar.**
1. Nothing ships half-finished. What ships has no loose ends.
2. A prediction is judged by where reality turns up, not by how well the argument reads.
3. The final form is clean, and the working is kept (diary, tables) even when it is not shown.
4. The measure works from inside the thing measured.
5. Holding back is a choice with a cost. Name who pays for it.

**Lens questions.**
- Is this ripe, or is it one of many unripe things?
- What observation would prove this wrong, and have we made it?
- If the scaffolding came down, would the structure still stand?
- Can the person read their state from their own measurements?
- What are we holding back, and who pays for the delay?

**Applied to Lance's work.**
- Atüned: fewer screens, each finished. A screen that shows a number the app cannot yet compute fails this lens and fails rule 6, for the same reason.
- Coherence number: what real event would show it is wrong? Gauss's orbit was judged on 7 December 1801. Name the Atüned equivalent (for example, the number before and after a known stressor) and check it.
- Theorema Egregium as a design note: if coherence is measured against the person's own baseline, it is intrinsic in Gauss's sense. If it is measured against a population average, it is not. Either can be right, but the screen should say which.

**Sources.**
- https://en.wikisource.org/wiki/Popular_Science_Monthly/Volume_33/September_1888/Sketch_of_Carl_Friedrich_Gauss
- https://www.numericana.com/arms/gauss.htm
- https://users.wfu.edu/kuz/Stamps/Gauss/Gauss.html
- https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/ (seen through search excerpts only)
- https://mathforcollege.com/nm/anecdotes/gauss.html
- https://cims.nyu.edu/~tschinke/princeton/papers/yuri/gauss/gauss.pdf
- https://www.ams.org/bull/2006-43-01/S0273-0979-05-01096-7/S0273-0979-05-01096-7.pdf
- https://www.kroneckerwallis.com/gausss-theorema-egregium-geometry-of-surfaces/
- https://nationalmaglab.org/magnet-academy/history-of-electricity-magnetism/museum/gauss-weber-telegraph-1833/

**Uncertain or contested.**
- The scaffolding remark and Abel's "fox" jab each come from one source. Paraphrase only.
- The curved-surfaces paper is dated 1827 in most sources and 1828 by MacTutor.
- The telegraph line's length: 3000 metres (MacTutor) against about 8000 feet (Gauss to Olbers, 1833).
- The 30 March 1796 date for the 17-gon diary entry was not confirmed.
- The story of the schoolboy Gauss summing 1 to 100 is widely told but was not checked. Do not use it.
- Bolyai: Gauss told Farkas Bolyai he had already had similar ideas on non-Euclidean geometry. One source says the son, János, then gave up mathematics. Accounts of the effect on János vary. UNVERIFIED.

---

## C3. Joseph Fourier (1768-1830)

**Who and why.** French. He showed that complicated change can be split into simple waves, and that method now runs under every signal on every screen. The lens for "break it into parts that add back up."

**Background and history.** In 1798 he went with Napoleon's expedition to Egypt as a scientific adviser and secretary of the Institut d'Égypte, returning in 1801. Afterwards he served Napoleon as an administrator in Grenoble (as prefect of Isère; the title and dates are UNVERIFIED this pass). In 1807 he read a memoir on how heat spreads through solids to the Paris Institute. The reception was mixed and critical. Lagrange and Laplace objected to writing functions as trigonometric series, Biot and others objected to how he derived the equations, and the work was judged not rigorous enough. He published the full theory as *Théorie analytique de la chaleur* in 1822 (English translation by Freeman, 1878). His 1824 paper on the temperatures of the globe started from a calculation: a body the Earth's size at the Earth's distance from the Sun should be much colder than the Earth is. He proposed that the atmosphere acts as an insulator, drawing on de Saussure's glass-covered box. This is widely treated as the first statement of what is now called the greenhouse effect, though he also wrongly gave heat from interstellar space a significant role.

**How he thinks.**
- *Start from the phenomenon.* Heat in a real solid led him to an equation, and the equation led him to the method. His 1822 preliminary discourse states a conviction that the study of nature is the richest source of mathematical discovery. (Paraphrase. The exact English wording is UNVERIFIED.)
- *Decompose.* Any temperature distribution, however irregular, is treated as a sum of simple sine waves, each of which behaves simply over time. Solve each simple piece, then add them back together.
- *Useful before rigorous.* He kept using series the best mathematicians of the day would not accept, because they gave right answers to physical problems. Other people supplied the rigour later.
- *Estimate first.* The 1824 argument began with a number. The gap between that estimate and reality is where the discovery was.

**Quality bar.**
1. The model starts from what the thing actually does.
2. A complicated whole is shown as simple parts, and the parts add back to the whole.
3. Each part has a plain meaning (a frequency, an address, a cause).
4. The expected result is written down first, so a surprise shows up as a surprise.
5. Being right about the world outranks being elegant. Anything useful but unproven is labelled.

**Lens questions.**
- What is the phenomenon, stated before any formula?
- What are the simple components, and do they add back up to what we show?
- Can a person see which component is driving the whole?
- What did we expect, and where does the measurement disagree?
- Which parts work but are not yet justified, and are they labelled?

**Applied to Lance's work.**
- Coherence number: one number hides its parts. Show which addresses, or which parts of the signal, contributed, the way a spectrum shows which frequencies make up a wave. If the number comes from a signal over time (breath or heart rhythm, for example), Fourier analysis is probably already inside it. The lens asks that the screen show the parts, not only the sum. (Emmy has not checked the computation.)
- Book: a plate that draws stress as a few simple waves adding into one tangled line would teach decomposition in one image. That fits Lance's own rule that one image shows the concept.
- Before tuning, write down the coherence you expect for a calm, rested user and for a stressed one. If real readings land somewhere else, that gap is the work.

**Sources.**
- https://cambridgeblog.org/2014/12/joseph-fourier-breaking-new-ground/
- https://blackwells.co.uk/bookshop/product/Joseph-Fourier-1768-1830-by-Ivor-Grattan-Guiness-Jerome-R-Ravetz/9780262571784
- https://www.ebsco.com/research-starters/history/joseph-fourier/
- https://physics.it.com/physicists/joseph-fourier
- https://mathshistory.st-andrews.ac.uk/SH/fourier_sh.pdf
- https://www.lindahall.org/about/news/scientist-of-the-day/joseph-fourier/
- https://www.aps.org/apsnews/2010/03/this-month-in-physics-history
- https://brewminate.com/joseph-fourier-and-the-discovery-of-the-greenhouse-effect-in-the-nineteenth-century/
- https://www.cambridge.org/core/books/abs/analytical-theory-of-heat/preliminary-discourse/33A7A3C045080D952127DE45F88DDA46
- https://www3.nd.edu/~powers/ame.20231/fourier1878.pdf

**Uncertain or contested.**
- Who opposed the 1807 memoir, and how strongly, varies by account. One synopsis says Laplace and Monge supported it and only Lagrange was firmly against.
- "Profound study of nature is the most fertile source of mathematical discoveries" is widely given as a line from the preliminary discourse in Freeman's translation. The exact wording was not confirmed. Paraphrase it.
- Prefect of Isère: title and dates not confirmed.
- The later rigorous conditions for when Fourier series converge (usually credited to Dirichlet, 1829) were not checked.
- Calling Fourier "the discoverer of the greenhouse effect" oversimplifies. Part of his physics was wrong.

---

## C4. Emmy Noether (1882-1935)

**Who and why.** German. She saw that symmetry and conservation are two sides of one fact, and she rebuilt algebra around structure instead of calculation. The lens for "find what stays the same."

**Background and history.** In 1915 Hilbert and Klein brought her to Göttingen to work on the mathematics of Einstein's general relativity. As a woman she could not yet lecture under her own name, so her courses were listed under Hilbert's. She was allowed to habilitate (gain the right to teach) only in 1919. In 1918 she proved the result now called Noether's theorem: every continuous symmetry of a physical system goes with a conserved quantity. For example, laws that do not change over time conserve energy. Her 1921 paper *Idealtheorie in Ringbereichen* recast ring theory around a chain condition. Van der Waerden's textbook *Moderne Algebra*, which taught the next generations, was partly based on her lectures and Emil Artin's. In 1933 the new Nazi civil service law removed her from Göttingen. She moved to Bryn Mawr College in the United States, paid at first by the Emergency Committee and the Rockefeller Foundation, and from February 1934 also lectured weekly at the Institute for Advanced Study in Princeton. She died suddenly in 1935.

**How she thinks.**
- *Look for what does not change.* Her theorem pairs each symmetry with something conserved. The habit is to find the invariant first. What is conserved follows from it.
- *Structure over calculation.* She replaced long computations with conditions on structure. In his 1935 memorial address, Hermann Weyl said she made algebra the "Eldorado of axiomatics." He meant axioms as a working research tool, not as tidy bookkeeping.
- *The method is the product.* In a 1931 letter to Helmut Hasse she wrote, in the standard English translation: "My methods are really methods of working and thinking; this is why they have crept in everywhere anonymously."
- *Open and generous.* Mathematicians came from across Germany and abroad to consult her and sit in on her lectures, and her ideas reached print in other people's books, van der Waerden's among them.
- *Kept working through exclusion.* Unlisted, then dismissed, she kept producing.

**Quality bar.**
1. The invariant is named: what does not change when the inputs change?
2. One structure covers many cases. No special case exists where a rule would do.
3. The method travels: someone else can use it without the author in the room.
4. Abstraction earns its place by making a hard thing simple, not by sounding deep.

**Lens questions.**
- What stays the same here when the person, the day or the side of the body changes?
- What symmetry does this design have, and what does that symmetry protect?
- Is this a special case, or a rule that covers every case?
- Could someone use this method without us?
- Is the abstraction making it simpler, or only more abstract?

**Applied to Lance's work.**
- Atüned: 54 addresses a side is a mirror symmetry. The lens asks whether the app uses it. Draw left and right as mirrors, and treat the difference between a mirrored pair as a signal worth showing.
- Atüned code: if all 112 addresses share one data structure and one set of rules, a new feature works on all of them at once. Every address handled as a special case is a place for a defect, which matches the repository's own defect record.
- Book: the method Lance teaches (run the mechanics, watch your own body answer) should keep working after the reader closes the book and without the app. That is her "methods of working and thinking" test.

**Sources.**
- https://quotepark.com/pl/cytaty/1912516-emmy-noether-my-methods-are-really-methods-of-working-and-think/
- https://mathshistory.st-andrews.ac.uk/Biographies/Noether_Emmy/quotations/ (seen through search excerpts only)
- https://www.mathi.uni-heidelberg.de/~roquette/hasse_noether_web.pdf
- https://www.encyclopedia.com/people/science-and-technology/mathematics-biographies/emmy-noether
- https://jwa.org/encyclopedia/article/noether-emmy
- https://www.agnesscott.edu/LRiddle/women/EinsteinNYTLetter.pdf
- https://www.degruyterbrill.com/document/doi/10.1515/dmvm-2007-0076/pdf
- https://arxiv.org/html/2408.08552v1
- https://arxiv.org/pdf/hep-th/9411110
- https://www.aip.org/noether-at-bryn-mawr
- https://faculty.evansville.edu/ck6/bstud/waerden.html
- https://introductionsnecessary.com/?p=1090

**Uncertain or contested.**
- The New York Times letter of 4 May 1935, signed by Einstein, calls her the most significant creative mathematical genius since women's higher education began. Roquette has suggested Weyl actually wrote it. If it is used, say so.
- The Hasse quote is an English translation that comes through Auguste Dick's 1981 biography. The German original was not checked.
- Hilbert's "we are a university, not a bathhouse" defence of her habilitation is widely repeated but was not checked. Do not use it.
- The "Noether boys" and accounts of her lecturing style were not checked.
- The exact date of her 1933 dismissal notice was not confirmed.

---

## C5. Claude Shannon (1916-2001)

**Who and why.** American. He made information something you can measure, and he got there by cutting hard problems down to toy versions he could play with. The lens for "simplify, separate signal from noise, don't oversell."

**Background and history.** After working on Vannevar Bush's differential analyzer, he wrote his 1937 MIT master's thesis (published 1938). It showed that Boolean algebra can simplify relay circuits and that relay circuits can compute Boolean logic. That is the basis of digital circuit design, and one historian called it one of the most important master's theses ever written. His 1948 Bell Labs paper "A Mathematical Theory of Communication" founded information theory. In 1950 he built Theseus, a mechanical mouse that learned a maze through relay memory and then ran it without a mistake. A Bell Labs film shows it. He rode a unicycle through the halls while juggling, built juggling machines and worked out a juggling theorem. In 1956 he wrote "The Bandwagon," a one-page editorial warning that information theory "has certainly been sold, if not oversold."

**How he thinks.**
- *Cut to the essentials.* In "Creative Thinking," an internal Bell Labs talk given on 20 March 1952, he recommended trying "to eliminate everything from the problem except the essentials; that is, cut it down to size." His 1948 paper set meaning aside completely so that information could be measured.
- *Restate and transform.* The same talk is widely summarised as also recommending restating a problem in many forms, relating it to one already solved, generalising, and working backwards. (Not checked against the full transcript this pass.)
- *Constructive dissatisfaction.* He named it as a driver of good work: not gloom, but a sense that things could be better.
- *Play is research.* Theseus, the juggling machines and the unicycles were physical toys that made an abstract question concrete. MIT Technology Review's review of his biography sums up his career as brave playfulness and a refusal to specialise.
- *Deflate the hype.* He reined in his own field when others oversold it.

**Quality bar.**
1. The problem has been cut down to the smallest version that still holds the real difficulty.
2. Signal and noise are separated, and the noise has been measured.
3. A working toy exists before the full system.
4. No claim is bigger than the measurement behind it.

**Lens questions.**
- What is the smallest version of this that still has the hard part?
- How much of what we show is signal, and how much is noise?
- Have we built the toy version and played with it?
- What did we leave out on purpose, and why?
- Are we on a bandwagon?

**Applied to Lance's work.**
- Coherence number: measure how much it moves between two readings when nothing has changed. If that noise is bigger than the changes the screen reports, the extra digits are noise, and under rule 6 they do not ship.
- Build the Theseus version first: one address, one tap, one honest number, end to end. If that loop does not convince, 112 addresses will not fix it.
- Copy and book: any line that claims more than the measurement supports fails the Bandwagon test. Lance's own line "This is a discovery. It is not a finished system." passes it.

**Sources.**
- https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits
- https://www.bentley.umich.edu/?p=6953
- https://fs.blog/great-talks/creative-thinking-claude-shannon/
- https://jamesclear.com/great-speeches/creative-thinking-by-claude-shannon
- https://fermatslibrary.com/s/the-bandwagon
- https://www.Gwern.net/doc/cs/algorithm/1956-shannon.pdf
- https://britannica.com/topic/A-Mathematical-Theory-of-Communication
- https://www.lindahall.org/about/news/scientist-of-the-day/claude-shannon/
- https://www.technologyreview.com/2017/10/24/148385/digital-joy/
- https://www.comsol.com/blogs/happy-birthday-claude-shannon
- https://news.mit.edu/2001/obitshannon-0228

**Uncertain or contested.**
- The number of balls he juggled on the unicycle varies by source (three or four).
- Details of the Theseus maze vary (one source says 25 squares).
- "Try to restate it in just as many different forms as you can" appears in quote collections but was not confirmed against the transcript. Paraphrase it.
- The 1987 Omni interview was not checked, and nothing from it is used here.

---

## Better candidates? (mathematicians)

Lance decides. Nobody is replaced. These two arguably deserve a look:

- **Henri Poincaré (1854-1912).** In "L'invention mathématique," a lecture to the Psychological Society of Paris printed in *Science et Méthode* (1908), he analysed how his own discoveries happened, including the Fuchsian-function insight that arrived as he stepped onto a bus at Coutances. Archival manuscripts from 1880 support his account. For a library about "thinking style," he is the mathematician who wrote down his own creative process most carefully. (Life dates from general knowledge.)
- **Benoit Mandelbrot.** *The Fractal Geometry of Nature* (1982) opens: "Clouds are not spheres, mountains are not cones, coastlines are not circles, and bark is not smooth, nor does lightning travel in a straight line." He is a mathematician of rough natural form who thought in pictures, which is the closest fit to an art director's eye.

Sources: https://arxiv.org/pdf/1207.0759 , https://legacy-www.math.harvard.edu/~ctm/home/text/class/harvard/275/05/html/poincare.html , https://www.cut-the-knot.org/books/mandelbrot/intro.shtml , https://www.historyofscience.com/pdf/The%20Scope%20of%20Benoit%20Mandelbrot's%20Work%20and%20its%20Influence.pdf

Neither is clearly better than the current five. Between them, the five already cover calculation, finish, decomposition, structure and simplification. Poincaré would add the documented creative process, and Mandelbrot would add visual form.

---

# D. Animation, look development and feel

## D1. Frank Thomas and Ollie Johnston (the pair)

**Who and why.** Two of Walt Disney's "Nine Old Men," the studio's core animators, who wrote down how Disney made drawings feel alive. The lens for "is it thinking, or only moving?"

**Background and history.** Frank Thomas animated the dwarfs grieving at Snow White's bier, Bambi and Thumper learning to skate on the ice, and the spaghetti scene in *Lady and the Tramp*. Ollie Johnston animated Thumper, plus Baloo and Mowgli in *The Jungle Book*, and was an animator or directing animator on more than 24 features. He was the last surviving member of the Nine Old Men. Both were named Disney Legends in 1989. Their book *Disney Animation: The Illusion of Life* (1981) set out the twelve principles of animation, drawn from the studio's work from the 1930s onwards: squash and stretch, anticipation, staging, straight ahead and pose to pose, follow through and overlapping action, slow in and slow out, arcs, secondary action, timing, exaggeration, solid drawing, and appeal. It topped an AWN poll of the best animation books and is often called the bible of animation. They also wrote *Walt Disney's Bambi: The Story and the Film*. Frank's son Theodore Thomas made the documentary *Frank and Ollie* (1995).

**How they think.**
- *Physics serves feeling.* The principles cover weight, timing and arcs, but also emotional timing and appeal. The goal is a character that seems to think, not motion for its own sake.
- *Personality before belief.* D23 quotes Thomas: "Until a character becomes a personality, it cannot be believed."
- *Study the real thing.* The studio they trained in brought in Don Graham to run art classes from November 1931, had the animal painter Rico Lebrun lecture on animal anatomy and movement before *Bambi*, and kept live fawns at the studio for the artists to watch.
- *Write the craft down.* They turned unwritten studio knowledge into a system others could learn, and the system outlived the studio's golden age.
- *A partnership.* Two careers side by side, one book voice.

**Quality bar.**
1. The audience believes the character is thinking, not just moving.
2. Every movement has the weight, anticipation and follow-through a real body would have.
3. Each shot stages one idea that reads at a glance.
4. It has appeal: you want to keep looking.
5. The know-how behind it is written down, so others can repeat it.

**Lens questions.**
- Is it alive, or only animated?
- What is this character thinking right now, and does the motion show it?
- What one idea does this frame stage, and does it read in a second?
- Was this drawn from observation, or from other drawings?
- Could another artist reproduce this from what we have written down?

**Applied to Lance's work.**
- Atüned, the body figure: when an address is tapped, does the figure respond like a body (a small anticipation, a settle, overlapping motion in the breath or shoulders), or does a dot just change colour? The lens wants the figure to look as if it felt something.
- Coherence change: a number that snaps from one value to another has no timing. Ease it in and out at a speed that matches what changed, and never animate a change the data does not contain (rule 6).
- Book plates: one idea per plate, staged to read at arm's length. Check that each figure carries weight: where the pelvis sits and where the weight falls.

**Sources.**
- https://d23.com/walt-disney-legend/frank-thomas/
- https://d23.com/walt-disney-legend/ollie-johnston/
- https://d23.com/a-to-z/thomas-frank/
- https://d23.com/a-to-z/johnston-ollie/
- https://d23.com/get-to-know-nine-old-men/
- https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation
- https://www.waltdisney.org/blog/anatomy-motion-picture-realizing-bambi
- https://www.acmi.net.au/stories-and-ideas/disney-how-bambi-changed-disneys-animation/
- https://catalog.afi.com/Film/27130-BAMBI
- https://en.wikipedia.org/wiki/Frank_and_Ollie
- https://www.avclub.com/frank-and-ollie-1798195495

**Uncertain or contested.**
- *Frank and Ollie* is dated 1995 by Disney+ and Park Circus and 1999 by one listing.
- The principles existed as studio practice before the book. The book named and organised them. Who first worked out each principle is not documented here.
- "Sincerity" as a term from the book was not confirmed.
- Sources disagree on how many fawns were kept at the studio.
- Their birth and death dates were not rechecked and are left out.

---

## D2. Hayao Miyazaki (born 1941)

**Who and why.** Japanese director and animator, and the clearest documented case of stillness, observation and drawing as the way a story is found. The lens for "where is the breath?"

**Background and history.** He joined Toei Animation in 1963, where he met Isao Takahata. His first feature as director was *Lupin III: The Castle of Cagliostro* (1979). He co-founded Studio Ghibli in 1985 and went on to direct *Laputa*, *My Neighbor Totoro* and *Kiki's Delivery Service*. *Spirited Away* (2001) became Japan's highest-grossing film of its time and won the Academy Award for animated feature in 2003. He announced his retirement from features in 2013 but came back, and *The Boy and the Heron* (2023) won the same Oscar at the 96th Academy Awards. His essays and interviews from 1979 to 1996 are collected in *Starting Point*.

**How he thinks.**
- *Ma.* In a 2002 interview, Roger Ebert asked about the moments when characters simply sit or look at a stream. Miyazaki answered: "We have a word for that in Japanese. It's called ma. Emptiness. It's there intentionally." He clapped his hands: "The time in between my clapping is ma." Non-stop action with no breathing space, he said, is just busyness, and constant tension leaves the audience numb.
- *Story found in the storyboards.* He starts production before the story is finished, and the story takes shape as he draws the storyboards. *Spirited Away* had no script. He told Midnight Eye: "It's a dangerous way to make an animated film and I wish it could be different."
- *Watch real people.* In a 2014 interview with the Japanese site Golden Times, he said in substance that you cannot draw people if you never spend time watching real people. The version that circulates in English is a distortion. Paraphrase only.
- *The hand and life.* Shown an AI motion demo in 2016 (in the documentary *Never-Ending Man*), he called it "an insult to life itself," with a friend with a disability in mind. In the same film, unhappy with pure computer animation, he redrew much of it by hand.
- *Learns from other masters.* He has said he discovered Moebius through *Arzach*. The two shared an exhibition in Paris in 2004 and 2005.

**Quality bar.**
1. There is room to breathe, and the pauses are placed, not leftover.
2. Small true actions (sitting, sighing, looking at water) tell you who someone is.
3. Movement comes from watching people, not from copying other drawings.
4. The world is felt through the senses, not explained.
5. It is made by hand wherever the hand matters.

**Lens questions.**
- Where is the ma, and is it there on purpose?
- Is this busy, or is it alive?
- Who watched a real person do this?
- What would this character do here if nothing happened?
- Did the drawing lead the story, or did a script flatten the drawing?

**Applied to Lance's work.**
- Atüned: after the coherence number lands, is there a beat of stillness before the next prompt, card or animation? A run of prompts with no pause is the busyness he describes, and it works against an app meant to settle a nervous system.
- Book plates: the empty space around a figure is part of the plate. A page filled edge to edge with labels has no ma.
- Observation: were the stress poses (shoulders, jaw, breath) drawn from watching real people under stress, Lance included, or from reference diagrams? The lens prefers the first. Lance's rule that the canon is hand-drawn already agrees with this lens.

**Sources.**
- https://www.rogerebert.com/interviews/drawing-on-spirited-world
- https://www.finaldraft.com/blog/hayao-miyazaki-says-ma-is-an-essential-storytelling-tool
- https://www.creativebloq.com/art/animation/quote-of-the-day-by-hayao-miyazaki-its-a-dangerous-way-to-make-an-animated-film-and-i-wish-it-could-be-different-we-never-know-where-the-story-will-go-but-we-just-keep-working-on-the-film-as-it-develops
- https://slashfilm.com/865373/studio-ghiblis-scripting-process-is-practically-nonexistent
- https://www.scmp.com/lifestyle/entertainment/article/3254890/hayao-miyazaki-career-anime-legend-83-behind-studio-ghibli-who-won-his-second-oscar-his-final-film
- https://www.aol.com/news/behind-boy-heron-myths-magic-063000050.html
- https://soranews24.com/2014/01/30/ghiblis-hayao-miyazaki-says-the-anime-industrys-problem-is-that-its-full-of-anime-fans/amp/
- https://boingboing.net/2016/11/14/hayao-miyazaki-emerges-from-re.html
- https://otakuusamagazine.com/miyazaki-calls-ai-demo-an-insult-to-life-itself/
- https://en.wikipedia.org/wiki/Never-Ending_Man:_Hayao_Miyazaki
- https://www.slantmagazine.com/film/never-ending-man-hayao-miyazaki/
- https://www.openculture.com/2016/11/watch-moebius-and-miyazaki-two-of-the-most-imaginative-artists-in-conversation-2004.html
- https://www.animenewsnetwork.com/news/2004-09-30/miyazaki-art-exhibition-in-paris

**Uncertain or contested.**
- The Midnight Eye page itself was not opened. The quote comes through Creative Bloq.
- Reprints of the Ebert interview differ slightly in punctuation.
- Accounts differ on the setting of the 2016 AI remark.
- "Anime was a mistake" is a fabricated quote. Never use it.
- The dates of the *Nausicaä* manga were not checked. His birth year (1941) is from general knowledge and is consistent with SCMP calling him 83 in 2024.

---

## D3. Shigeru Miyamoto

**Who and why.** Nintendo's lead designer, who made "how does it feel in the hands?" the first question and will change a nearly finished thing if it does not feel right. The lens for feel.

**Background and history.** He grew up in Sonobe, a rural village northwest of Kyoto, without store-bought toys. He made his own, put on puppet shows, made flip-books, and explored the bamboo forest behind the shrine and the hills nearby (New Yorker profile, 2010). He created Donkey Kong (1981), Super Mario Bros. (1985) and The Legend of Zelda (1986), and later Star Fox and Pikmin, and helped lead the Wii. (Release years are standard reference facts, not rechecked this pass. His 1977 hire at Nintendo is UNVERIFIED.)

**How he thinks.**
- *Feel first, found by playing.* In Iwata Asks he recalls that jumping was not in the original plan. The game began as a maze escape controlled by the joystick alone, and the jump went onto the button after a prototype showed it worked. The core mechanic was discovered in play, not written into a spec.
- *Fix the problem without breaking the feel.* His colleague Konno recalls that when making Mario heavier solved a problem but felt wrong, Miyamoto proposed an invisible block above Mario's head that stopped the jump at a set height, so Mario's speed did not have to change.
- *Upending the tea table.* Iwata Asks records his habit of making deep changes late. On *Twilight Princess* he says he only "rearranged" things, while staff remember otherwise. A late suggestion from him widened the Wii Fit Balance Board to 42 cm.
- *Childhood discovery is the target.* He has tried to recreate his childhood sense of wonder in his games, like feeling for a fish under a rock in a river (New Yorker profile).
- *The house standard.* Hayashida (a Mario director, not Miyamoto) describes the essence of a Mario game as feeling good in the hands and responding sharply, like a new toy.

**Quality bar.**
1. The core action feels good with no content, story or art on it.
2. Problems are fixed without damaging what already feels right.
3. If it is not right, it changes, even late.
4. It produces discovery: the player finds something for themselves.
5. It responds sharply, with no lag or mush between input and response.

**Lens questions.**
- Does the core action feel good as a grey box?
- What would a child find here without being told?
- Can we fix this without touching what already works?
- Is it right, or only finished?
- Who has played it, and what did their hands tell us?

**Applied to Lance's work.**
- Atüned: build the tap on an address as a grey circle and a number. Tune the response (timing, sound, the settle) until it feels good, and only then put art on it.
- If testers find the coherence screen confusing, this lens says change it now, even if it is "done." A late upend costs less than shipping it.
- Discovery: let the user notice that the left and right of an address differ, instead of explaining it in a paragraph. Lance's own line "You press X, Mario jumps" is this lens in his words.

**Sources.**
- https://iwataasks.nintendo.com/interviews/wii/nsmb/0/0
- https://www.nintendo.co.uk/Iwata-Asks/Super-Mario-Bros-25th-Anniversary/Vol-3-The-Developers-1-/3-Giving-Super-Mario-the-Mario-Essence/3-Giving-Super-Mario-the-Mario-Essence-222146.html
- https://3e8.org/writings/iwata-asks/super-mario-galaxy-vol-2.html
- https://iwataasks.nintendo.com/interviews/wii/twilight_princess/0/4
- https://iwataasks.nintendo.com/interviews/wii/super_mario_galaxy/0/3
- https://iwataasks.nintendo.com/interviews/wii/wii_fit/0/2
- https://zeldadungeon.net/wiki/Upending_the_Tea_Table
- https://cacmb4.acm.org/news/103821-shigeru-miyamoto-master-of-play
- https://kottke.org/10/12/shigeru-miyamoto-profiled-in-the-new-yorker
- https://acriticalhit.com/solved-miyamoto-quote-late-game-bad-forever
- https://www.gonintendo.com/contents/29030-miyamoto-s-delayed-game-quote-appears-to-be-misappropriated

**Uncertain or contested.**
- "A delayed game is eventually good, but a rushed game is forever bad" is very probably not his. The earliest version found is called an "industry catch phrase" in GamePro (December 1997), and a 1996 GDC version is tied to Siobhan Beeman (A Critical Hit, 2022). Never attribute it to him.
- The excerpt does not make clear which early game the jump-origin story refers to.
- The game in which the invisible-block fix happened was not confirmed.
- The popular stories that a cave inspired Zelda and gardening inspired Pikmin were not confirmed this pass.
- No direct Miyamoto quote was verified. Everything here is paraphrase.

---

## D4. Moebius (Jean Giraud, 1938-2012)

**Who and why.** French comics artist and film designer whose clear, open line and invented worlds shaped science-fiction comics and film design. The lens for line and world.

**Background and history.** He worked under two names. As Gir he drew the Western *Blueberry* with the writer Jean-Michel Charlier. As Moebius he made science fiction and fantasy. In 1975 he co-founded the magazine *Métal hurlant* with Druillet, Dionnet and Farkas. *Arzach* is four wordless, painted dream stories. *The Airtight Garage* ran in Métal hurlant from 1976 to 1980. With Alejandro Jodorowsky he worked on the unmade film of *Dune* and on the comic *The Incal* (their partnership began with *Les Yeux du chat*, 1978). His film work includes *Alien* (1979), *Tron*, *The Abyss* and *The Fifth Element* (concept design, costumes and storyboards; sources differ on his exact role). He shared an exhibition with Miyazaki at the Monnaie de Paris (December 2004 to March 2005, about 300 works) and had *Moebius Transe-Forme* at the Fondation Cartier (October 2010 to March 2011). One source calls him the most influential French comics artist after Hergé.

**How he thinks.**
- *Two hands.* For decades he kept two styles, a heavily rendered Western and a clean, open science-fiction line, and picked the one the job needed.
- *Improvise in ink.* In an interview excerpt about his sketchbook *40 Days dans le Désert B*, he describes drawing in pen instead of pencil, as total improvisation, building the image from an accumulation of lines and details. (Paraphrase.)
- *Silence.* *Arzach* has no speech balloons. Critics note that the meditative mood of that wordless world proved as influential as its freedom of drawing.
- *Worlds, not pictures.* Desert, city, costume and machine all belong to one consistent invented place.
- *Drawing as performance.* The *Dancing Line* videos show him drawing live on a graphics tablet.

**Quality bar.**
1. Economy of line: every line is needed, and white space carries form.
2. A world: every element could only belong to this place.
3. It reads without words.
4. The line is committed, not searching.
5. The style fits the job.

**Lens questions.**
- Could this be drawn with fewer lines and still read?
- Does every element belong to the same world?
- Would this work with no words?
- Is the line committed, or hesitating?
- Is this the right style for this job, or just the habitual one?

**Applied to Lance's work.**
- Book plates: Lance draws in pen and marker with a confident contour. The lens asks whether each plate could lose its caption and still read, as *Arzach* does.
- Atüned: the body map, the address markers and the coherence display should belong to one world, with the same light-on-dark and the same simple geometry (circle, ring, dot, from Lance's own TULA rule). One element in a different visual language breaks the world.
- Two hands: the app and the book can have different styles if each is chosen for its job. Decide that on purpose instead of letting it drift.

**Sources.**
- https://cnlj.bnf.fr/sites/default/files/revues_document_joint/PUBLICATION_8522.pdf
- https://www.simonandschuster.ca/authors/Moebius/184735417
- https://www.livreshebdo.fr/article/moebius-transe-forme-la-fondation-cartier
- https://www.bedetheque.com/auteur-6231-BD-Giraud-Jean.html
- https://www.openculture.com/2015/12/watch-groundbreaking-comic-artist-moebius-draw-his-characters-in-real-time.html
- https://www.openculture.com/2016/11/watch-moebius-and-miyazaki-two-of-the-most-imaginative-artists-in-conversation-2004.html
- https://www.animenewsnetwork.com/news/2004-09-30/miyazaki-art-exhibition-in-paris
- https://www.giantrobot.com/products/moebius-40-days-dans-le-desert-b-new-edition
- https://www.theparisreview.org/blog/2015/10/21/moebius-and-the-key-of-dreams/
- https://anothermag.com/fashion-beauty/601/moebius-arzach
- https://www.inparkmagazine.com/artist-and-conceptual-designer-jean-moebius-giraud-passes-away-in-paris-at-73/

**Uncertain or contested.**
- The start year of *Blueberry* (often given as 1963) was not confirmed.
- His role on *Alien* is described differently by different sources (costume design, or collaboration on the art direction).
- The common claim that he improvised *The Airtight Garage* episode by episode without a plan was not confirmed this pass.
- No direct Moebius quote was verified. All his views here are paraphrased.
- Claims about his influence on specific films (*Blade Runner*, *Star Wars*) and on *Nausicaä* were not confirmed and are left out.

---

## Better candidates? (animation, look development and feel)

Lance decides. Nobody is replaced. These arguably deserve a place:

- **Mary Blair.** Credited with colour styling on *Cinderella* (1950), *Alice in Wonderland* (1951) and *Peter Pan* (1953). Walt Disney valued her colour sense and had her design *It's a Small World* for the 1964 New York World's Fair. She brings the lens the current set lacks: colour as the carrier of feeling, which is central to Lance's warm-against-cool rule.
- **Fumito Ueda (director of *Ico*).** His approach is widely described as "design by subtraction." In a 2002 developer interview (translated by shmuplations), he talks about cutting elements instead of fixing them. He is the closest match to Lance's "the edit is a cut" and to game feel built from removal. The label comes from commentators, not from Ueda, and a GDC talk on it was not confirmed.
- **Also worth checking (UNVERIFIED, search budget ran out):** Roger Deakins, the cinematographer, reported to have been a visual consultant on Pixar and DreamWorks animated features. He would be a lighting and look-development lens across film and animation. Verify before use.

Sources: https://en.wikipedia.org/wiki/Mary_Blair , https://illustrationhistory.org/artists/mary-blair , https://huffingtonpost.co.uk/entry/the-world-of-mary-blair_n_5003658 , https://blakecrosley.com/blog/design-philosophy-fumito-ueda

None is clearly better than the current four. Mary Blair (colour) and Ueda (subtraction in games) fill gaps the current set does not cover.
