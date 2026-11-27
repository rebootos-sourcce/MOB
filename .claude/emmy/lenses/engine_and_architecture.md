What this is: Emmy's reference lenses for engine, rendering and systems-architecture work. Ten people: how they documentably think, the tests they set, and the questions Emmy asks through them.
Date researched: 2026-10-15
Lenses, not authorities: Emmy reviews through them, she never speaks for them.

# Engine and Architecture Lenses

## How to read this file

- **Lens, not voice.** Each section describes how a person has worked and thought, based on their own papers, talks and award records. Emmy uses that to ask better questions. She never says "Carmack would approve" or puts words in anyone's mouth.
- **How the facts were checked.** Opening web pages directly was blocked in this environment, so every fact was checked against search-result extracts of the pages listed under Sources, not against a full read of each page. Before quoting any line in public, open the source and check the exact words.
- **Quotes.** Text in quotation marks appeared word for word in a source extract, and the source is listed. Everything else is paraphrase and is marked as such where it matters.
- **(gk)** means a well-established fact (usually a release year) that was not re-checked in this session. **UNVERIFIED** means it could not be confirmed and should not be repeated as fact.
- **Atüned notes** are example review notes on the desktop app that maps stress to addresses in the body and shows a coherence number. They are written as "if this is true, then..." because the review is about the method, not a claim about the current build.

---

# Category A: Engine development, systems and rendering

## A1. John Carmack

**In one line:** Lead programmer of the id Software engines (Wolfenstein 3D, Doom, Quake). He has the longest public record of an engine builder explaining, in his own words, how he handles speed, simplicity and bugs.

**Background and history.** He did contract work for Softdisk in Shreveport, Louisiana, then co-founded id Software. There he was lead programmer on Commander Keen, Wolfenstein 3D (1992, gk), Doom (1993, gk), Quake (1996, gk) and their sequels. Through the 1990s he published his working notes as public ".plan" files, and those are still archived year by year. id released each engine's source code once it was retired: Doom in December 1997 (moved to the GPL licence in October 1999), Quake in December 1999, and Doom 3 under GPLv3 in November 2011. The Doom 3 release had his shadow technique ("Carmack's Reverse") removed because of a Creative Labs patent. He founded Armadillo Aerospace, a rocketry company. In 2013 he became CTO of Oculus. In 2019 he cut back to consulting CTO so he could work on artificial general intelligence, and in December 2022 he left Meta for his own AGI start-up, Keen Technologies. On 22 March 2001 he became the fourth person inducted into the Academy of Interactive Arts & Sciences Hall of Fame.

**How he thinks.**
- **Bugs come from state nobody fully understood.** In "Functional Programming in C++" (AltDevBlogADay, 2012) he argues that many defects happen because programmers do not grasp every state their code can get into, and that multithreading makes this much worse. His fix is practical: write pure functions wherever you can, in the language you already use, instead of rewriting everything in Haskell or Lisp. (paraphrase)
- **Assume everyone makes mistakes, then build machines to catch them.** In "Static Code Analysis" (2011) he calls aggressive static analysis the most important thing he had done as a programmer in recent years. He says the change in how he thought about reliability was worth more than the bugs the tools found, and that every programmer, the best and the worst, makes simple mistakes. (paraphrase)
- **Code you can read top to bottom.** In a 13 March 2007 email on inlining code, he argues for keeping logic in one straight line instead of scattering it across many small functions. He offers this as something to seriously consider, not as a rule. (paraphrase)
- **Work in public.** The .plan files and the source releases show the same habit: explain the decision and let other people check it.

**Quality bar: what "great" means through this lens.**
1. Every state the code can be in is known, and nothing changes behind your back.
2. A recurring kind of mistake is caught by a tool, not by someone remembering to look.
3. Speed is measured, not guessed.
4. A new reader can follow the main loop from start to finish.

**Lens questions.**
- What does this function read or change that is not in its inputs?
- Which mistake has now happened twice, and what automatic check stops a third time?
- What does this cost per frame, measured on a slow machine?
- Can someone follow the main update without jumping through ten files?
- Is the reason it was built this way written down where others can find it?

**Applied to Atüned.**
- The coherence number should come from its inputs alone: same inputs, same number, every time. If it quietly reads a timer, the last session or a cached map, make those explicit inputs and test them.
- The smoke gate is this lens in small form. When a type of defect comes back (for example, a function defined with no caller), the fix is a mechanical check like `callers.py`, not another reminder in a document.
- Time the body-map redraw on the slowest laptop you have. If tapping an address takes longer than one frame (about 16 ms at 60 frames a second) to respond, treat it as a bug, not polish.

**Sources.**
- https://en.wikipedia.org/wiki/John_Carmack
- https://www.doomwiki.org/wiki/John_Carmack
- https://gamesfirst.com/articles/2001/john-carmack-to-be-inducted-into-the-academy-of-interactive-arts-and-sciences-ha/
- https://www.gamedeveloper.com/programming/in-depth-functional-programming-in-c-
- https://mcvuk.com/development-news/functional-programming-in-c/
- https://isocpp.org/blog/2014/11/functional-carmack
- https://www.gamedeveloper.com/programming/in-depth-static-code-analysis
- https://pvs-studio.com/en/blog/posts/n0090/
- https://cbarrete.com/carmack.html (2007 inlining email, via a mirror)
- https://fabiensanglard.net/fd_proxy/doom3/pdfs/johnc-plan_1998.pdf (.plan archive)
- https://en.wikipedia.org/wiki/Id_Tech
- https://www.omgubuntu.co.uk/2011/11/doom-3-is-open-sourced/amp

**Uncertain or contested.**
- Emmy awards: several bios say he won two Technology & Engineering Emmys, in 2006 and 2007. A fan wiki says both were awarded in January 2007. Check the Television Academy's records before citing.
- His birth date appears as both 20 and 21 August 1970.
- The Quake III source release (usually given as 2005) was not confirmed in this session.

---

## A2. Tim Sweeney

**In one line:** Founder of Epic Games and original author of the Unreal Engine. He is the clearest case of an engine treated as a tool for other people to make things with, not just the machinery behind one game.

**Background and history.** In 1991, under the name Potomac Computer Systems, he released ZZT, an MS-DOS game that shipped with its own world editor and scripting language so players could build their own levels. It sold a few copies a day, about US$100 a day, and that convinced him to make games his career. The company became Epic MegaGames (sources say October 1991 or early 1992), moved to Cary, North Carolina, and took the name Epic Games around 1999. Unreal (1998) was the first product built on the Unreal Engine. After that the company put its effort into the editor and engine so that other people could make games more easily. In January 2006 he gave a talk called "The Next Mainstream Programming Language: A Game Developer's Perspective" at POPL, an academic programming-languages conference, using Gears of War as his example. In March 2014, Unreal Engine 4 launched at US$19 a month, with the full C++ source code on GitHub and a 5% royalty. On 2 March 2015 his post "If You Love Something, Set It Free" made the engine free, with all of its source code, and a 5% royalty only on revenue above US$3,000 per product per quarter.

**How he thinks.**
- **Tools first.** From ZZT onward, the editor ships with the game. The engine is a product for creators.
- **Fix the language, not just the code.** In the 2006 talk he argues that C++ is badly equipped for concurrency. He splits game code into two kinds: simulation code, which is imperative and object-oriented, and numeric code, which is essentially functional. He proposes side-effect-free code that can safely run in parallel, plus software transactional memory for shared state. He accepts up to four times the overhead if that lets code scale across many threads. (paraphrase from the slides and a contemporary summary)
- **Design for the hardware that is coming.** The 2006 argument starts from the Xbox 360's six hardware threads, not from single-core habits.
- **Make it cheap to start and charge when it succeeds.** The 2014 and 2015 licence changes moved from paying up front to paying a royalty after release.

**Quality bar.**
1. Someone who is not the original programmer can build with it.
2. Calculation code and code that changes shared state are kept apart.
3. It keeps working when the hardware gains more cores.
4. Trying it costs almost nothing.

**Lens questions.**
- Who besides us could build with this, and what would they need?
- Which parts are pure calculation, and which parts change shared state? Are they separate?
- How does this behave on next year's machine?
- What stops someone from trying this today, and can we remove it?

**Applied to Atüned.**
- Treat the body-address map as content, not code. If adding or renaming an address means editing JavaScript, an editor is missing. A data table that Lance can change without a programmer is the move this lens points to.
- Keep the coherence calculation (pure math) separate from the screen code that reacts to it. Then the math can be tested on its own, and the screens cannot quietly change it.

**Sources.**
- https://en.wikipedia.org/wiki/Tim_Sweeney
- https://en.wikipedia.org/wiki/ZZT
- https://matthewball.co/all/zztmetaverse
- https://ics.uci.edu/~wscacchi/GameIndustry/Tim-POPL-2006.pdf (POPL 2006 slides)
- https://devhawk.net/blog/2006/2/13/the-next-mainstream-programming-language
- https://www.cs.princeton.edu/~dpw/popl/06
- https://www.unrealengine.com/blog/ue4-is-free
- https://en.wikipedia.org/wiki/Unreal_Engine_4

**Uncertain or contested.**
- The date Epic MegaGames was renamed (October 1991 or early 1992) and the date of the move to Cary differ between sources.
- UNVERIFIED: that Sweeney personally wrote UnrealEd, and the design goals of Epic's Verse language. Neither was confirmed here.
- The "four times overhead" figure comes from a blog summary of the slides and should be checked against the PDF.

---

## A3. Jim Blinn

**In one line:** A computer-graphics pioneer whose shading and bump-mapping papers still run inside almost every renderer, and whose NASA animations made science visible to the public.

**Background and history.** He earned his PhD at the University of Utah (1977 or 1978; sources differ). His SIGGRAPH 77 paper "Models of Light Reflection for Computer Synthesized Pictures" gave the Blinn-Phong shading model. His 1978 paper "Simulation of Wrinkled Surfaces" introduced bump mapping. At NASA's Jet Propulsion Laboratory he made the pre-encounter flyby animations for Voyager at Jupiter and Saturn, which people watching the national news reportedly took for real footage. He also worked on Carl Sagan's *Cosmos* (1980) and on the teaching graphics for *The Mechanical Universe*. He stayed at JPL (part of Caltech) until 1995, then joined Microsoft Research. From 1987 to 2007 he wrote the column "Jim Blinn's Corner" in *IEEE Computer Graphics & Applications*, collected as *A Trip Down the Graphics Pipeline* (1996), *Dirty Pixels* (1998) and *Notation, Notation, Notation*. Honours: NASA Exceptional Service Medal (1983, Voyager animations), MacArthur Fellowship (1991, for educational animation), and the SIGGRAPH Steven A. Coons Award (1999).

**How he thinks.**
- **The time budget is human patience.** "Blinn's Law" says that as technology advances, rendering time stays the same, because people spend faster machines on richer pictures rather than on the same picture faster. The PBR book states it as "as technology advances, rendering time remains constant." In his Caltech oral history he describes the budget as how long people are willing to wait. (paraphrase of the interview)
- **The picture is there to teach.** His career runs through educational animation: Voyager for the public, *The Mechanical Universe* for students, a MacArthur award for teaching through animation. An image succeeds when the viewer understands something true.
- **Simulate when the eye can't tell the difference.** Bump mapping, as the 1978 title says, *simulates* wrinkles by changing how light hits a surface without adding geometry (mechanism: gk).
- **Notation is design.** Twenty years of columns, and a book titled *Notation, Notation, Notation*, point to a habit of working the math until it is clean enough to teach. (This is a reading of the titles, not a quote.)

**Quality bar.**
1. A viewer understands something they did not understand before.
2. The time budget goes to what the viewer needs to see.
3. The math is written clearly enough that someone else could check it.
4. Shortcuts are fine when they keep the meaning true.

**Lens questions.**
- What should a first-time viewer understand after five seconds?
- How long will the person wait, and what are we spending that time on?
- Is the underlying math written down in a form someone else could check?
- Where are we faking it, and does the fake stay honest about what it shows?

**Applied to Atüned.**
- The body map is educational animation. Test it on someone new: five seconds after an address lights up, can they say what that address means for them?
- If a glow, pulse or colour ramp makes the coherence number look more precise than it is, the picture is telling a lie the number is not. Under Lance's real-numbers rule, decoration must not imply a measurement.

**Sources.**
- https://en.wikipedia.org/wiki/Jim_Blinn
- https://heritageproject.caltech.edu/interviews/jim-blinn (Caltech oral history)
- https://history.siggraph.org/?p=34414 (1999 Coons Award)
- https://www.fxguide.com/?p=34700
- https://historyofcg.com/pages/james-jim-blinn
- https://pbr-book.org/4ed/Introduction/A_Brief_History_of_Physically_Based_Rendering
- https://shop.elsevier.com/books/jim-blinns-corner-a-trip-down-the-graphics-pipeline/blinn/978-0-08-050958-7

**Uncertain or contested.**
- His PhD year is given as 1977 or 1978.
- UNVERIFIED: the line "All it takes is for the rendered image to look right," often attributed to Blinn. No source was found. Do not use it.
- The publication year of *Notation, Notation, Notation* was not confirmed.

---

## A4. Rob Cook

**In one line:** Co-architect and main author of Pixar's RenderMan, and the person who brought random (Monte Carlo) sampling into computer graphics. That is what made motion blur and soft shadows practical in film.

**Background and history.** For his work at Cornell he received the SIGGRAPH Computer Graphics Achievement Award (1987). Pixar's paper index lists "A Reflectance Model for Computer Graphics" with Kenneth Torrance (1982). He joined the Lucasfilm computer group, which became Pixar, in 1981 and built an early programmable shader. His key papers: "Distributed Ray Tracing" (SIGGRAPH 1984, with Thomas Porter and Loren Carpenter), "Stochastic Sampling in Computer Graphics" (ACM Transactions on Graphics, 1986), and "The Reyes Image Rendering Architecture" (SIGGRAPH 1987, with Carpenter and Ed Catmull). With Catmull and Carpenter he received an Academy Award of Merit for RenderMan. ACM SIGGRAPH gave him the 2009 Steven A. Coons Award.

**How he thinks.**
- **Trade the error people hate for one they tolerate.** The 1986 paper argues that the jagged edges of point sampling come from where the samples are placed, not from sampling itself. Placing samples randomly turns jaggies into fine grain, which viewers find much less objectionable. (paraphrase)
- **One mechanism, many effects.** From the 1984 abstract: "By distributing the directions of the rays according to the analytic function they sample, ray tracing can incorporate fuzzy phenomena." The same idea gives motion blur, depth of field, soft shadows, translucency and blurry reflections.
- **Reduce everything to one kind of piece.** Reyes cuts every object into tiny "micropolygons" and does all shading and visibility on them. It applies texture in object space and keeps related data close together, so scenes with any number of objects still fit in memory.
- **Let artists control the look without touching the engine.** This is the point of a programmable shader.

**Quality bar.**
1. The error that is left is the kind people tolerate, and that was a deliberate choice.
2. One clean mechanism explains several features.
3. Complexity can grow without the system falling over.
4. The look can be changed without changing the core.

**Lens questions.**
- What error is left, and did we choose which kind the person sees?
- Are these three features really one mechanism?
- What is the one basic piece everything else is built from?
- Can the look change without anyone touching the engine?

**Applied to Atüned.**
- If the inputs are noisy, the coherence number will jitter. Make the choice deliberately: smooth it and say it is smoothed, or show a range. Cook's lesson is to choose which error the person sees. Lance's rule adds that the choice must be stated, never hidden.
- One basic piece: every body address should be the same kind of record (position, name, stress value, source) that every screen draws from. If "address" has three different shapes on three screens, that is the opposite of Reyes.

**Sources.**
- https://history.siggraph.org/person/robert-l-cook/
- https://history.siggraph.org/?p=34409 (2009 Coons Award)
- https://graphics.pixar.com/people/rob
- https://graphics.pixar.com/library/indexAuthorCook.html
- https://graphics.pixar.com/library/Reyes
- https://en.wikipedia.org/wiki/Pixar_RenderMan
- https://ethw.org/Milestones:The_Development_of_RenderMan®_for_Photorealistic_Graphics,_1981-1988
- https://cgweb.informatik.uni-freiburg.de/intern/seminar/raytracing%20-%20Cook%20-%201984%20-%20distributed.pdf
- https://xeroxparcarchive.computerhistory.org/pixel/imaging/computergraphics/87proceedings/.SystemsSession-Reyes.tioga!1.html (1987 review of the Reyes paper)

**Uncertain or contested.**
- The year of the Academy Award: one source gives the ceremony as 3 March 2001, another says the award was in 2000.
- Pixar's index lists the stochastic sampling paper with a 1996 date, which conflicts with 1986. The 1986 date (ACM TOG volume 5) is from general knowledge and needs checking in the ACM Digital Library.
- The content of the 1982 Cook-Torrance paper (a model of surfaces as tiny facets) was not checked in this session; only the title and year were.
- A SIGGRAPH '87 reviewer called the Reyes paper badly written as a systems paper but important enough to publish. Good systems can be poorly explained, which is a useful warning in its own right.

---

## A5. Brian Karis

**In one line:** Epic Games rendering engineer behind Unreal Engine 4's physically based shading, its widely copied temporal anti-aliasing, and Unreal Engine 5's Nanite virtualized geometry. He is the working, present-day lens on this list.

**Background and history.** In the SIGGRAPH 2013 course "Physically Based Shading in Theory and Practice", he presented "Real Shading in Unreal Engine 4", which adapted Disney's principled shading approach for real-time games. At SIGGRAPH 2014 (Advances in Real-Time Rendering) he presented "High Quality Temporal Supersampling". That technique is now cited simply as "Karis 2014" in research, and Blender's EEVEE-Next renderer names it as its source. At SIGGRAPH 2021 he gave "A Deep Dive into Nanite Virtualized Geometry", with 155 pages of slides. Secondary coverage reports he said the work took over a decade of personal research and more than three years of full-time work. He also co-presented the Unreal Engine 4 "Infiltrator" demo at SIGGRAPH.

**How he thinks.**
- **Write the goals before building the system.** Following Disney's example, the UE4 team wrote down goals for their shading model. The first was real-time speed with many lights on screen. The second was reduced complexity: "A large array of parameters either results in decision paralysis, trial and error, or interconnected properties that require many values to be changed for a single intended effect." Every setting also had to behave the same under every type of light.
- **Judge technology by how it changes the way people make things.** From the Nanite slides: "Many years ago I got to see the impact that a virtual texturing system could have on an art team. Ever since I've dreamt of the day where we could do the same for geometry." The slide states the goal as "No more budgets" for polygon count, draw calls and memory.
- **Stay with a hard problem.** More than ten years on one idea before it shipped (as reported).
- **Borrow from film, then adapt.** He took Disney's offline principles into real time, and reused previous frames for anti-aliasing.

**Quality bar.**
1. Every setting earns its place and means the same thing everywhere.
2. The person making things never has to manage a technical budget.
3. The picture is stable from one frame to the next.
4. Goals were written, in order, before the build, and the build is judged against them.

**Lens questions.**
- What were the written goals, in priority order, and does this meet the first one?
- How many settings must a person understand? Could any two become one?
- Does the same input mean the same thing on every screen?
- What budget is the person secretly managing that the system should manage for them?
- Does it flicker?

**Applied to Atüned.**
- If the coherence number flickers between 61 and 64 while the person is sitting still, it reads as broken. The Karis-style fix is to blend with recent history. Under Lance's rule, the screen then has to say "averaged over the last N seconds."
- Before the next body-map pass, write the rendering goals in order, for example: 1. the number is real, 2. a tap responds instantly, 3. it reads at a glance. Then judge the pass against that list.
- Count the settings on any calibration or setup screen. Each one should change exactly one thing the person can name.

**Sources.**
- https://cgvr.informatik.uni-bremen.de/teaching/cg_literatur/Brian%20Karis%20-%20Real%20Shading%20in%20Unreal%20Engine%204,%202013%20Siggraph%20Course.pdf
- https://blog.selfshadow.com/publications/s2013-shading-course/
- https://advances.realtimerendering.com/s2021/Karis_Nanite_SIGGRAPH_Advances_2021_final.pdf
- https://history.siggraph.org/person/brian-karis
- https://developer.blender.org/rB8ac5b1fdb39
- https://arxiv.org/html/2312.10890v1
- https://80.lv/articles/a-deep-dive-into-unreal-engine-s-5-nanite (secondary)
- https://news.itmo.ru/en/startups_and_business/innovations/news/9473/ (secondary)

**Uncertain or contested.**
- UNVERIFIED: his career before Epic, and the address of his blog (often given as "Graphic Rants"). Not confirmed here.
- The "over a decade" figure comes from secondary coverage, not his own slides.
- Only two of the UE4 shading goals were confirmed word for word. The rest (reported as including "Intuitive Interface", "Perceptually Linear", "Easy to Master" and "Robust") were not checked.
- He is far less documented than the other four. The lens rests on three talks.

---

## Category A: Better candidates?

Live search ran out before these could be checked, so the evidence below is general knowledge except where marked as verified.

- **Ed Catmull.** Verified here: co-author of the Reyes paper with Cook and Carpenter, and shared the RenderMan Academy Award. UNVERIFIED here: co-founder and former president of Pixar, co-recipient of the 2019 Turing Award for 3D computer graphics, and author of *Creativity, Inc.* (2014) on running honest creative reviews. He would give Emmy a lens on taste and critique culture, not only technique.
- **Michael Abrash.** UNVERIFIED here: author of the *Graphics Programming Black Book*, worked with Carmack on Quake's engine, and later chief scientist at Oculus and Meta's Reality Labs. He has the deepest written record of performance as a way of thinking, which is stronger teaching material than Karis's three talks.
- **Pat Hanrahan.** UNVERIFIED here: designed RenderMan's shading language, and shared the 2019 Turing Award with Catmull. He is a stronger canonical choice for "shading as a language" than anyone on the current list.

**Verdict:** none is clearly better than Carmack, Blinn or Cook. Catmull is the strongest addition, mainly for the creative-review side of Emmy's job. Karis is the one to swap only if Lance prefers established names over current working practice.

---

# Category B: Systems architecture and engineering breadth

## B1. Ken Thompson

**In one line:** Co-creator of Unix with Dennis Ritchie, and co-designer of UTF-8 and Go. The lens for building with a few simple ideas.

**Background and history.** Before Unix, his QED text editor brought regular expressions (search patterns) to text editing, and he invented the method, now called Thompson's construction, that turns a search pattern into a small machine that matches it quickly. He and Ritchie began Unix at Bell Labs in 1969. With Joe Condon he built Belle, a chess machine that won the World Computer Chess Championship in 1980. In 1983 he and Ritchie received the Turing Award "for their development of generic operating systems theory and specifically for the implementation of the UNIX operating system." The selection committee credited Unix's success to its "tasteful selection of a few key ideas and their elegant implementation." His Turing lecture, "Reflections on Trusting Trust" (*Communications of the ACM*, August 1984), showed that a compiler could plant a hidden back door that appears nowhere in any source code you can read. In it he says he felt honoured as much for timing and luck as for technical merit, and he thanks the others who built Unix. He co-designed UTF-8 with Rob Pike. At Google, on 21 September 2007, he, Robert Griesemer and Rob Pike started sketching the Go language on a whiteboard, and by January 2008 he had written a first compiler that produced C code so they could try out ideas.

**How he thinks.**
- **A few key ideas, done elegantly.** This is the committee's description, and it is the clearest one-line summary of his style.
- **Try the simple way first.** The Jargon File reports that he said "When in doubt, use brute force," and adds that he probably meant it as "ha ha only serious." Meaning: the plain, obvious approach comes before the clever one. (attribution reported, not primary)
- **Trust the whole chain, not just the code you can see.** "Reflections on Trusting Trust" argues that reading source code is not enough. You have to trust the people and tools that built it.
- **Prototype quickly to test ideas.** Go's first compiler produced C, which is the fastest route to running code.
- **Give credit away.** The Turing lecture opens by crediting others.

**Quality bar.**
1. The core can be explained in a handful of ideas.
2. The simple version was tried, and measured, before the clever one.
3. Every step between the source and what ships is visible and trusted.
4. Nothing is in the system that its builders cannot explain.

**Lens questions.**
- How many key ideas does this rest on? Could it be fewer?
- Was the brute-force version tried first? Why wasn't it good enough?
- What happens between our source and what the person runs, and do we trust every step?
- What can be deleted without anyone noticing?

**Applied to Atüned.**
- The build simply joins the `src/` parts, byte for byte, with nothing transformed on the way through. Keep it that way. Every clever build step is a place where a change can hide, which is "Trusting Trust" in miniature.
- Before building a smarter stress-to-address mapping, try the brute-force version (a plain lookup table) and measure whether it is good enough.
- Can a new user be told what Atüned does in three ideas (for example: where stress sits, what the number means, what to do next)? If it takes ten, cut.

**Sources.**
- https://awards.acm.org/award-recipients/ritchie_1506389 (1983 Turing citation)
- https://chennai.hosting.acm.org/chennai-acm/wp-content/uploads/2018/03/R-T-2018-March-08.pdf (committee statement)
- https://www.d.umn.edu/~pahp/readings/thompson-trusting-trust-1984.pdf
- https://www.catb.org/~esr/jargon/html/B/brute-force.html
- https://go.googlesource.com/website/+show/HEAD/_content/doc/faq.md
- https://www.britannica.com/print/article/593001
- https://www.i-programmer.info/history/people/547.html?start=2
- https://en.wikipedia.org/wiki/Ken_Thompson

**Uncertain or contested.**
- "When in doubt, use brute force" is reported by the Jargon File, not taken from Thompson's own writing.
- UNVERIFIED: "One of my most productive days was throwing away 1000 lines of code." It is widely attributed to him, but no primary source was found. Do not use it.
- UNVERIFIED: the story that UTF-8 was designed on a diner placemat in 1992. It comes from a single weak source.
- I-Programmer says Belle won three ACM championships (1980 to 1982). Britannica confirms only the 1980 world title.

---

## B2. Fred Brooks

**In one line:** Managed the hardware and software for IBM's System/360 and wrote *The Mythical Man-Month*. The lens for keeping a design unified and for the human cost of building systems.

**Background and history.** He earned a physics degree at Duke (1953) and a PhD in applied mathematics at Harvard (1956). At IBM he managed the development of the System/360 hardware and software, and he is best known for managing OS/360, its operating system. He then went to the University of North Carolina at Chapel Hill as Kenan Professor of Computer Science. *The Mythical Man-Month* came out in 1975 (gk), with a 20th-anniversary edition in 1995. "No Silver Bullet: Essence and Accident in Software Engineering" was written in 1986 and published in *IEEE Computer* in April 1987. He received the 1999 Turing Award "For landmark contributions to computer architecture, operating systems, and software engineering." He died on 17 November 2022 in Chapel Hill.

**How he thinks.**
- **Conceptual integrity comes first.** He calls it the most important consideration in system design. A system should reflect one coherent vision, coming from one mind or a very small group of closely agreeing minds. That is why he argues for a chief architect. (paraphrase of the book as summarised)
- **People are not interchangeable months.** Brooks's law: "Adding manpower to a late software project makes it later." New people need time to learn the project, and the number of conversations grows faster than the team.
- **Revise your own advice in public.** He wrote "Plan to throw one away; you will, anyhow." In the 1995 edition he said that advice was flawed because it assumed a rigid plan-then-build process, and he moved to growing software step by step.
- **Separate what is hard about the problem from what we made hard.** "No Silver Bullet" splits complexity into *essential* (it comes from the problem) and *accidental* (we created it and can remove it). Removing all the accidental complexity still won't give a tenfold improvement, because the essential part remains.

**Quality bar.**
1. One concept runs through every screen and every part.
2. Every design decision traces back to one accountable architect.
3. The complexity that is left belongs to the problem, not to our tools.
4. The system grew through working versions, each one usable.

**Lens questions.**
- Whose vision is this, and does every part reflect it?
- Is this hard because the problem is hard, or because we made it hard?
- If we add more people or agents, will it get faster or just noisier?
- What was the last working version, and how big a step is this one from it?

**Applied to Atüned.**
- Lance is the chief architect. When several agents contribute, Emmy checks each change against a single written definition of what "coherence" means. A screen that uses the word in a different sense breaks conceptual integrity, even if it works.
- The 247 logged defects are mostly accidental complexity (half-checked edits), not essential complexity (the physics). Tooling such as the gate attacks the first kind. Only clearer thinking reduces the second.
- Brooks's law applies to agents too. Putting more of them on a late feature adds hand-offs. Prefer one owner per part.

**Sources.**
- https://awards.acm.org/award-recipients/brooks_1002187 (1999 Turing citation and profile)
- https://www.britannica.com/biography/Fred-Brooks
- https://www.infoq.com/news/2022/12/fred-brooks-obituary/
- https://museum.unc.edu/exhibits/show/faculty/frederick-p--brooks-jr---1931-
- https://en.wikipedia.org/wiki/The_Mythical_Man-Month
- https://en.wikipedia.org/wiki/No_Silver_Bullet
- https://techreports.cs.unc.edu/papers/86-020.pdf ("No Silver Bullet", UNC tech report)

**Uncertain or contested.**
- UNVERIFIED: that he founded UNC's computer science department in 1964 (widely stated; the year was not confirmed here), and the publication year of his later book *The Design of Design* (usually given as 2010).
- The book quotes were checked against secondary summaries, not the book itself.

---

## B3. Margaret Hamilton

**In one line:** Led the team that wrote the on-board flight software for the Apollo missions at MIT. The lens for software that must not fail when lives depend on it, and for designing around the human mistake.

**Background and history.** She joined MIT in 1959, writing weather-prediction software, then moved to Project Apollo. She became head of the Software Engineering Division at the MIT Instrumentation Laboratory and led development of the Apollo on-board flight software. Several secondary sources credit her with coining the term "software engineering," to give software the same standing as other engineering. During the Apollo 11 landing the computer raised "1202" overload alarms. It shed lower-priority jobs, kept steering the descent and kept the crew informed, and the landing went ahead. Afterwards she analysed every error found in the flight software and developed a theory, built on six axioms, for defining systems so that interface errors (errors where two parts meet) cannot get in. She co-founded Higher Order Software in 1976 and founded Hamilton Technologies in 1986, where she developed the Universal Systems Language and a method called "Development Before the Fact". On 22 November 2016 she received the Presidential Medal of Freedom. MIT cited her work on "asynchronous software, priority scheduling and priority displays, and human-in-the-loop decision-making." She wrote more than 130 technical papers. She died on 30 September 2026 in Cambridge, Massachusetts, aged 90, as reported by the Associated Press.

**How she thinks.**
- **Design for the mistake everyone says won't happen.** Her young daughter Lauren crashed an MIT simulator by starting the pre-launch program, P01, in the middle of a simulated flight. Hamilton wanted code to guard against it. NASA overruled her, and the answer she recalls was "That would never happen." Five days into Apollo 8, astronaut Jim Lovell selected P01 in flight, which wiped out navigation data, and her team was called in to help recover it.
- **Under overload, drop the right things and say so.** The Apollo 11 alarms worked as designed: less important tasks were dropped, the critical ones kept running, and the crew was told.
- **The human decides, the system informs.** Priority displays put the decision in front of the person instead of hiding it.
- **Treat every error as data, then close the whole category.** She went from an error log, to axioms, to a language in which interface errors cannot be written at all. "Development Before the Fact" means preventing errors by how a system is defined, rather than catching them afterwards.

**Quality bar.**
1. The "nobody would ever do that" input has been tried.
2. Under overload, the system gives things up in a known order and tells the person.
3. The person can see what the system is doing and make the call.
4. Every recorded defect is classified, and its category is closed, not just the single case.

**Lens questions.**
- What is the input we are assuming nobody will give? What happens when they do?
- When the system is overwhelmed, what does it give up first, and does the person know?
- Where does the person decide, and what do they see at that moment?
- Which category does this defect belong to, and what stops the whole category?

**Applied to Atüned.**
- What happens when the stress input is missing, contradictory or extreme? Under rule 6, the screen should say "cannot compute yet," not show a believable-looking number.
- `FAILURE_ANALYSIS.md` is already her method: an error log turned into a rule. Her next step would be to sort the 247 defects by *where two parts meet* (rename vs readout, function vs caller) and make each of those seams impossible to break silently.
- Try the "Lauren test": tap addresses rapidly at random, close the window halfway through a calculation, change inputs during a redraw. Whatever a curious child could do, someone will.

**Sources.**
- https://news.mit.edu/2016/apollo-code-developer-margaret-hamilton-receives-presidential-medal-of-freedom-1117
- https://www.space.com/34851-margaret-hamilton-biography.html
- https://wehackthemoon.com/people/margaret-hamilton-her-daughters-simulation
- https://onefoottsunami.com/2015/10/16/that-would-never-happen/
- https://computerhistory.org/profile/margaret-hamilton/
- https://i-programmer.info/history/people/10030.html?start=2
- https://abc13.com/story/margaret-hamilton-led-software-team-nasas-apollo-program-dies-90/19924584/ (AP obituary)
- https://www.ktvu.com/news/margaret-hamilton-pioneering-apollo-program-software-engineer-dies-90

**Uncertain or contested.**
- That she coined the term "software engineering" rests on secondary sources. MIT's release does not mention it.
- The NASA Exceptional Space Act Award (2003) appeared in only one source.
- Some retellings add details to the Lauren and P01 story (for example, that she asked to test the astronauts' reactions) that her own accounts don't clearly support. Use the core story only.

---

## B4. Leslie Lamport

**In one line:** 2013 Turing Award winner, inventor of logical clocks and the Paxos algorithm, creator of the TLA+ specification language, and author of LaTeX. The lens for thinking precisely, in writing, before coding.

**Background and history.** His 1978 paper "Time, Clocks, and the Ordering of Events in a Distributed System" is among the most-cited papers in computer science. He co-wrote the Byzantine Generals work on systems with faulty or lying parts (with Shostak and Pease, 1982, gk) and created LaTeX (early 1980s, gk). He submitted "The Part-Time Parliament", the Paxos paper, in 1990. It was written as an allegory about legislators on a Greek island, and at first it wasn't taken seriously. Butler Lampson saw its significance and championed it, and it was finally published in *ACM Transactions on Computer Systems* in May 1998. He received the 2013 Turing Award "for fundamental contributions to the theory and practice of distributed and concurrent systems, notably the invention of concepts such as causality and logical clocks, safety and liveness, replicated state machines, and sequential consistency." In a 2022 Quanta interview he argued that programmers need more math, and in 2025 he gave a talk titled "Coding isn't programming."

**How he thinks.**
- **Write in order to think.** "If you're thinking without writing, you only think you're thinking." (Quanta, 2022.) In talks he uses the cartoonist Dick Guindon's line "Writing is nature's way of letting you know how sloppy your thinking is."
- **Think above the code.** For anything but simple programs, he argues, abstract thinking at a level above the code avoids errors and leads to better code that is easier to write. (paraphrase of a 2025 talk report)
- **Specify with math, then check it with a machine.** TLA+ exists so that a design can be written precisely and checked automatically before any code is written.
- **Name what must never happen and what must eventually happen.** His terms are *safety* and *liveness*: nothing bad ever happens, and something good eventually does. (plain-language definitions: gk)
- **Order matters more than clock time.** Logical clocks put events in order by what caused what, not by when a clock says they happened.

**Quality bar.**
1. There is a written description of what the system must do, separate from the code.
2. What must never happen and what must eventually happen are both written down.
3. That description has been checked, not just read.
4. When two things happen at once, the outcome is defined.

**Lens questions.**
- Where is the written description of what this must do, apart from the code?
- What must never happen? What must eventually happen?
- If two events arrive together, which one wins, and is that written down?
- Have we checked the design, or only the code?

**Applied to Atüned.**
- Write one page on the coherence number before the next change: its inputs, its range, what must never happen (for example, showing a number while an input is missing), and what must eventually happen (for example, the number updates within N seconds of new input).
- Define the order of events. If a new stress entry arrives while the map is redrawing, which value does the person see, and when?
- The same rule applies to *The Mechanics of Being*: if a concept can't be written down precisely, it isn't understood yet.

**Sources.**
- https://awards.acm.org/award-recipients/lamport_1205376 (2013 Turing citation)
- https://www.acm.org/articles/bulletins/2014/march/03182014-turing-award
- https://blogs.microsoft.com/blog/2014/03/18/microsofts-leslie-lamport-wins-the-turing-award-the-nobel-prize-in-computing/
- https://www.quantamagazine.org/computing-expert-says-programmers-need-more-math-20220517/
- https://thenewstack.io/tla-creator-leslie-lamport-programmers-need-abstractions/
- https://www.microsoft.com/en-us/research/publication/part-time-parliament/
- https://en.wikipedia.org/wiki/Leslie_Lamport

**Uncertain or contested.**
- The New Stack quotes the line as "If you think without writing, you only think you're thinking." The Quanta wording is used above.
- UNVERIFIED: a talk titled "Thinking Above the Code". The idea is confirmed, but that title was not found.
- The years for the Byzantine Generals paper and LaTeX are general knowledge, not re-checked.

---

## B5. Jeff Dean

**In one line:** The Google engineer behind much of its core infrastructure (MapReduce, Bigtable, Spanner) and an early leader of Google Brain and TensorFlow. The lens for scale, measurement and quick estimates before building.

**Background and history.** He joined Google in 1999. With Sanjay Ghemawat he created MapReduce, which made it simple to run reliable computations across thousands of machines (paper published 2004, gk). With colleagues he went on to Bigtable and Spanner. He was an early member of Google Brain, whose internal system DistBelief was rebuilt as TensorFlow. He and Ghemawat received the 2012 ACM Prize in Computing "for their leadership in the science and engineering of Internet-scale distributed systems." With Luiz André Barroso he wrote "The Tail at Scale" (*Communications of the ACM*, 2013). He gave the keynote at the LADIS 2009 workshop, "Designs, Lessons and Advice from Building Large Distributed Systems", and a Stanford talk with lessons drawn from ads, search, MapReduce and Bigtable. He led Google AI from 2018 to 2023 and was Google's chief scientist from 2023. On 5 August 2026 he left Google after 27 years to co-found Discovery Loop, a company aiming to automate research, with Ghemawat, Oriol Vinyals and Quoc Le.

**How he thinks.**
- **Estimate before you build.** His talks include a table of how long basic operations take (a cache read, a memory read, a disk seek, a network round trip), circulated as "Numbers Everyone Should Know." It is meant for back-of-the-envelope design: work out whether an idea can be fast enough before writing it. (the slide wording was not re-checked)
- **Hide the hard part behind a simple interface.** MapReduce let ordinary programmers run work across thousands of machines without handling failures or parallelism themselves.
- **Design for the slowest case, not the average.** "The Tail at Scale" introduced the term "tail-tolerant" for systems that stay predictably responsive even when some of their parts are not, often by reusing redundancy already built in for fault tolerance.
- **Learn from systems that are actually running.** His talks are explicitly collections of lessons from production systems, not theory.
- **Long partnerships.** Most of his landmark work was done with Ghemawat.

**Quality bar.**
1. A quick written estimate showed the design could work before it was built.
2. The slowest 1% of cases is measured, not just the average.
3. The hard part is hidden behind something simple that others can use.
4. Failure of a part is expected, and handled.

**Lens questions.**
- What was the back-of-the-envelope estimate, and does the measurement match it?
- What does the slowest 1% look like?
- Which hard part could be hidden behind a simple call?
- What happens when one part is slow or missing?

**Applied to Atüned.**
- Measure the slowest 1% of coherence recalculations, not the average. A number that usually updates in 5 ms but sometimes takes 400 ms will feel broken.
- Write the estimate next to the code: number of addresses × updates per second × cost of each. Then check it against a real timing. If they disagree, one of them is wrong, and both are worth knowing.
- If the number depends on several inputs, the slowest input sets the experience. Show which input is late instead of freezing the whole readout.

**Sources.**
- https://awards.acm.org/award-recipients/dean_2879385 (2012 ACM Prize)
- https://www.acm.org/articles/people-of-acm/2013/jeff-dean
- https://en.wikipedia.org/wiki/Jeff_Dean
- https://research.google/pubs/pub40801/ ("The Tail at Scale")
- https://sigops.org/s/conferences/sosp/2009/ladis.html
- https://queue.acm.org/blogposting.cfm?id=18208 (notes on the LADIS keynote)
- https://research.google.com/people/jeff/stanford-295-talk.pdf
- https://www.cs.princeton.edu/courses/archive/spr17/cos518/papers/jeff-dean-numbers.pdf
- https://siliconangle.com/2026/08/05/google-reveals-big-shake-ai-teams-jeff-dean-leaves-demis-hassabis-moves-upstairs/

**Uncertain or contested.**
- UNVERIFIED: the advice "design for about 10x growth, but plan to rewrite before 100x," widely attributed to his slides. It was not found in this session.
- His title at Discovery Loop is reported differently (CEO in some reports; the company site lists co-founders without titles).
- That he personally authored the latency table, as opposed to presenting it, is commonly assumed but was not confirmed.

---

## Category B: Better candidates?

Live search ran out before these could be checked, so the evidence below is general knowledge except where marked as verified.

- **Butler Lampson.** Verified here: he was the one who first recognised the importance of Lamport's Paxos algorithm and championed it. UNVERIFIED here: 1992 Turing Award, and author of "Hints for Computer System Design" (1983), which is in effect a written quality bar for systems. He is the strongest single addition for a reviewing agent.
- **Barbara Liskov.** UNVERIFIED here: 2008 Turing Award for work on data abstraction, fault tolerance and distributed computing, and the source of the "Liskov substitution principle" about what makes parts safely replaceable. She would add a lens on clean module boundaries, which is where most of Atüned's logged defects happened.
- **Dennis Ritchie.** Verified here: shared the 1983 Turing Award with Thompson for Unix. UNVERIFIED here: creator of the C language. He is better added as a companion to Thompson than as a replacement for anyone.

**Verdict:** none is clearly better than the five already chosen. Each covers a different side of the work. Lampson is the strongest addition, because his "Hints" paper is already written as a review checklist.
