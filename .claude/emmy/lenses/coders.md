# Coder lenses: five JavaScript and Python builders Emmy reviews code through
Researched 2026-10-15 for Atüned (single-file HTML and JavaScript, Python build and test gate, small server).
Lenses, not authorities: Emmy reviews through them, she never speaks for them.

**How this was checked.** Several primary sites (brendaneich.com, peps.python.org, bost.ocks.org, observablehq.com, threejs.org) were blocked from the research environment. Primary text was read instead from the projects' own repositories (python/peps, python/cpython, mrdoob/three.js, d3/d3) and the npm registry's release records. Everything else comes from cited search results. Words in quotation marks were read exactly at the cited source; everything else is paraphrase. Anything not confirmed is marked UNVERIFIED.

---

## 1. Brendan Eich: what ships becomes permanent

**Who and why.** Created JavaScript, the language every line of the app runs in. His lens is about how a decision made against a deadline outlives the deadline.

**Background.** Joined Netscape in April 1995, recruited to put Scheme in the browser; management then required syntax that looked like Java. In his foreword to O'Reilly's *Node: Up and Running* he says he prototyped "Mocha" in ten days in May 1995. It was renamed LiveScript, then JavaScript. He co-founded the Mozilla project in 1998, became Mozilla CTO in 2005 and was named CEO in March 2014. He stepped down on April 3, 2014, after controversy over his 2008 donation supporting California's Proposition 8; Mozilla's FAQ says he resigned on his own and declined another role the board offered. He then co-founded Brave Software, where he is CEO. With Allen Wirfs-Brock he wrote "JavaScript: The First 20 Years" (HOPL IV, 2020), the fullest history of the language.

**How he thinks.** JavaScript is a set of trade-offs made under a ship date: first-class functions and closures from Scheme, prototype objects from Self, surface syntax from Java. Eich has put some of the language's quirks down to finishing the prototype fast, after which it changed little before release. The HOPL paper's framing: a quick sidekick language became a de facto web standard before anyone could redesign it. Emmy's takeaway: once people depend on shipped code, its mistakes are permanent, so deadline shortcuts must be the cheap-to-live-with kind.

**Quality bar.**
1. No loose equality or implicit coercion anywhere a number reaches a person (`==`, string plus number, `parseInt` without a radix).
2. Every top-level name in the single file is deliberate: one file is one global scope.
3. Anything that outlives a session (stored keys, export formats, URL hashes such as `#dev`) carries a version and a migration path.
4. Every deadline shortcut is written down where the next editor will see it.

**Lens questions.**
- If this ships today, which part can never change again?
- What does this do with `undefined`, `null`, `NaN` or an empty string?
- Does it work only because a coercion happens to go the right way?
- What was cut to make the date, and where is that recorded?

**Example review notes (illustrative).**
- "The saved-session object has no version field. The first time its shape changes, old saves will read wrong without any error. Add `v: 1` now while it costs nothing."
- "`if (score == 0)` is also true for an empty string. Use `===` and handle the empty case on purpose."
- "This adds a top-level `function render`. In one script, a later declaration with the same name silently replaces the earlier one. Grep for the name before adding it."

**Sources.**
- Wirfs-Brock and Eich, "JavaScript: The First 20 Years" (2020): https://doi.org/10.1145/3386327 (preprint: https://zenodo.org/record/3707008)
- Eich, foreword to *Node: Up and Running*: https://www.oreilly.com/library/view/node-up-and/9781449332235/pr03.html
- Mozilla, "FAQ on CEO Resignation" (April 5, 2014): https://blog.mozilla.org/en/mozilla/faq-on-ceo-resignation/
- InfoWorld interview (2018): https://www.infoworld.com/article/3294999/interview-brendan-eich-on-javascripts-blessing-and-curse.html
- The New Stack (2018): https://thenewstack.io/brendan-eich-on-creating-javascript-in-10-days-and-what-hed-do-differently-today/

**Uncertain points.**
- "Ten days" describes a working prototype, not the finished language, and the framing is disputed: https://thehistoryoftheweb.com/the-10-day-programming-language-is-a-myth/ and https://buttondown.com/hillelwayne/archive/did-brendan-eich-really-make-javascript-in-10-days/. A secondary source quotes the HOPL paper as saying the exact dates are not on record (Eich believes May 6 to 15); not read in the paper itself, UNVERIFIED.
- Brave's founding year (often given as 2015): UNVERIFIED. Sources confirm co-founder and CEO, and a first browser release in 2016.
- What he would do differently today: only secondary summaries found, UNVERIFIED.
- His 2008 blog post "Popularity" could not be opened; not used.

---

## 2. Guido van Rossum: code is read more often than it is written

**Who and why.** Created Python, the language of the build, the gate and the tooling. His lens is readability and explicitness.

**Background.** CPython's own license history says Python was created in the early 1990s at CWI in Amsterdam as a successor to a language called ABC. In his foreword to Mark Lutz's *Programming Python* (1996) he describes starting it as a hobby project in December 1989, over a Christmas week when his office was closed; the name comes from Monty Python's Flying Circus. Work moved to CNRI in 1995; the Python Software Foundation formed in 2001. He co-wrote PEP 8, the style guide (2001). As "Benevolent Dictator For Life" he led the language until July 2018, when he announced his retirement from that role; the community then chose an elected steering council (PEP 8000, PEP 13). He later worked at Google and Dropbox, retired from Dropbox in October 2019, and joined Microsoft in November 2020.

**How he thinks.** PEP 8 opens its first principle with: "One of Guido's key insights is that code is read much more often than it is written." The Zen of Python (PEP 20) is Tim Peters' text, not Guido's: it "succinctly channels the BDFL's guiding principles for Python's design into 20 aphorisms, only 19 of which have been written down." The lines Emmy leans on: "Readability counts." "Explicit is better than implicit." "Errors should never pass silently." "In the face of ambiguity, refuse the temptation to guess." "If the implementation is hard to explain, it's a bad idea." PEP 8 also warns against foolish consistency: a rule that hurts readability gets broken.

**Quality bar (for the Python tooling).**
1. A failing check says what failed, where, and what it expected. No bare `assert x`.
2. No bare `except:` or `except Exception: pass` in the gate. A swallowed error is a green light that lies.
3. One obvious way: one helper that splits the file at its section markers, not three regexes.
4. A newcomer can say what each check verifies in one sentence.

**Lens questions.**
- Will the next reader understand this in one pass?
- Where could an error be swallowed here?
- Is this guessing about input it does not understand (encoding, missing marker, empty file)?
- Is there already one obvious way to do this in the tooling?

**Example review notes (illustrative).**
- "`assert count == 1` with no message. When it goes red, nobody knows which replace failed. Put the pattern and the actual count in the message."
- "This `try/except: pass` around reading `src/MANIFEST` means a missing part would build a shorter file without complaint. Let it raise."
- "Three checks each re-read and re-split the build with their own pattern. Pull the split into one helper so they cannot disagree."

**Sources.**
- PEP 20 (text checked against https://github.com/python/peps/blob/main/peps/pep-0020.rst): https://peps.python.org/pep-0020/
- PEP 8: https://peps.python.org/pep-0008/
- CPython license and history: https://docs.python.org/3/license.html
- Foreword for *Programming Python*: https://www.python.org/doc/essays/foreword/
- PEP 8000 and his 2018 message: https://peps.python.org/pep-8000/ and https://mail.python.org/pipermail/python-committers/2018-July/005664.html
- His bio: https://www.python.org/~guido/bio.html

**Uncertain points.**
- The Monty Python line is well attested, but the python.org foreword text itself could not be opened here.
- Reported retirement from Microsoft in May 2026 (Wikipedia, Real Python): no primary announcement found, UNVERIFIED.
- Dropbox exit: his bio says October 2019; one source says November. Google years not checked.
- His 2009 essay "Python's Design Philosophy" (python-history.blogspot.com) could not be opened; its rules are not used.

---

## 3. Mike Bostock: declare the relationship, show the example

**Who and why.** Created D3.js and co-founded Observable. His lens is binding data to what is on screen, and teaching through small runnable examples.

**Background.** At Stanford's visualization group he built Protovis (2009) with Jeffrey Heer, then D3 with Vadim Ogievetsky and Heer: "D3: Data-Driven Documents," IEEE InfoVis 2011, which won a ten-year Test of Time award at IEEE VIS 2021. D3 marked its tenth anniversary in February 2021. He was a graphics editor at The New York Times and left in 2015. D3 7 (June 2021, per npm) is the current major version. He co-founded Observable with Melody Meckfessel; Observable released the open-source Plot library in May 2021 and Observable Framework in early 2024.

**How he thinks.** The D3 paper argues for exposing the browser's own document model rather than hiding it behind a toolkit's private scene graph: you bind data to page elements and apply transforms, and you can inspect the result in the browser's own tools. The D3 README: "Its low-level approach built on web standards offers unparalleled flexibility in authoring dynamic, data-driven graphics." "Thinking with Joins" (summarized via D3's documentation and course notes) asks you to stop writing loops that create elements and instead declare how data and elements correspond. The join splits into enter (data with no element yet), update, and exit (elements whose data is gone). His examples, first on bl.ocks.org and later as Observable notebooks, are small, runnable and forkable.

**Quality bar.**
1. What is on screen is a function of the data: render twice from the same state, get the same page.
2. Exit is handled: when data goes away, its element goes away.
3. Output is plain DOM, SVG or Canvas that can be inspected, not a private model only the code understands.
4. Every visual component has a minimal standalone example with real data.
5. The label and the mark read the same value; there is never a second path to the number.

**Lens questions.**
- What is the data, and what is the one function from data to pixels?
- What happens on enter, update and exit?
- Can I see this working alone, in a small example?
- If the data were wrong, would the picture show it or hide it?

**Example review notes (illustrative).**
- "The score ring is set by hand in three handlers. Write one `render(state)` that sets every element from current state, and call it after every change."
- "Deleting a session leaves its bar on screen until reload. That is a missing exit."
- "The label shows a value rounded in a separate function from the one that sizes the bar. Derive both from one number (rule 6)."

**Sources.**
- Bostock, Ogievetsky, Heer, "D3: Data-Driven Documents" (2011): https://idl.uw.edu/papers/d3
- "Thinking with Joins": https://bost.ocks.org/mike/join/ and https://d3js.org/d3-selection/joining
- D3 repository: https://github.com/d3/d3 ; release history: https://www.npmjs.com/package/d3?activeTab=versions
- Test of Time award: https://news.cs.washington.edu/2021/11/01/jeffrey-heer-earns-test-of-time-award-at-ieee-vis-for-helping-bring-data-visualization-into-the-mainstream/
- Observable Plot launch (2021): https://www.businesswire.com/news/home/20210504005326/en/New-Open-Source-Library-Makes-Data-Visualization-Attainable-for-Any-JavaScript-Developer
- Posit "The Test Set" interview (2026): https://posit.co/thetestset/episode/the-code-doesnt-lie-with-mike-bostock

**Uncertain points.**
- "Thinking with Joins" could not be opened; its date (often given as 2012) is UNVERIFIED and its argument is summarized from the D3 docs.
- Observable's founding year: 2016 per one source; others date the company from its 2020 funding launch.
- When he joined The New York Times: UNVERIFIED.
- Protovis author lists differ between sources. bl.ocks.org's current status: UNVERIFIED.

---

## 4. Ricardo Cabello (mrdoob): small examples, steady releases

**Who and why.** Created three.js, the most widely used 3D library for the web. His lens is a light API, examples as proof, and small steady releases.

**Background.** Spanish. In a 2013 Real-Time Rendering interview he traced the project's roots to his demoscene work, and said he was freelancing, mainly for Google's Data Arts Team. three.js began in ActionScript (Flash), was ported to JavaScript, and first appeared on GitHub in April 2010. He keeps a low profile; in Mozilla's text-only 2011 interview he described three.js as a problem he was still trying to solve. Revisions are numbered (r1, r2, ...). The npm record shows r100 in December 2018, r150 in February 2023, r170 in October 2024 and r186 in September 2026: about ten a year.

**How he thinks.** The README states the aim: "The aim of the project is to create an easy-to-use, lightweight, cross-browser, general-purpose 3D library." Its usage section is one short program that draws a spinning cube. The contributing guide makes examples both the documentation and the test: "It's good to also add an example and screenshot for it, for showing how it's used and for end-to-end testing." "If you modify existing code, run relevant examples to check they didn't break and there wasn't a performance regression." "Don't include any build files in your commit." And on scope: "If you are unsure about adding a new feature, it might be better to ask first to see whether other people think it's a good idea." Breaking changes ship with a migration guide.

**Quality bar.**
1. Every visual feature has a small runnable example a reviewer can open (in the app: a `#dev` path or demo screen).
2. A change to existing code is checked against the screens it touches, for breakage and for frame rate.
3. Built output is never edited by hand; the source is the truth.
4. Renames and removals come with a migration note.

**Lens questions.**
- Where is the smallest example that shows this working?
- Did you open the screens this touches and watch them run?
- Is this still lightweight, or did it pull a dependency into a no-dependency file?
- Should this have been asked about before it was built?

**Example review notes (illustrative).**
- "This diff edits `build/atuned.html` directly. Move the change into its part under `src/` and rebuild."
- "The animation loop changed but no screen using it was opened. Open each one, watch it run, and record what you saw."
- "This loads a 3D library from a CDN into a file whose rule is no dependencies. Ask first; a short canvas sketch may do."

**Sources.**
- Repository and README: https://github.com/mrdoob/three.js
- Contributing guide: https://github.com/mrdoob/three.js/blob/dev/.github/CONTRIBUTING.md
- Migration guide: https://github.com/mrdoob/three.js/wiki/Migration-Guide
- Release history: https://www.npmjs.com/package/three?activeTab=versions
- Real-Time Rendering interview (2013): https://www.realtimerendering.com/blog/?p=3329
- Mozilla Hacks (2011): https://hacks.mozilla.org/2011/07/people-of-html5-mr-doob/
- Forum thread on cadence: https://discourse.threejs.org/t/what-is-threes-release-cadence-and-deprecation-timeline/53186

**Uncertain points.**
- Year of the ActionScript to JavaScript port (around 2009 per Wikipedia): UNVERIFIED.
- Current role and employer: UNVERIFIED.
- "Monthly releases" is the community's description; the record shows about ten a year. Users debate whether the numbering is a fair use of semver.
- Few long statements in his own words exist; this lens rests mostly on project documents, which other maintainers also edit.

---

## 5. Travis Oliphant: one array, shared by everyone

**Who and why.** Primary creator of NumPy and a founder of SciPy. His lens is unifying fragmented representations into one shared foundation with exact numeric types.

**Background.** Around 2001 he, Eric Jones and Pearu Peterson merged their modules into SciPy. Python's arrays were split between Numeric (Jim Hugunin, 1995) and numarray (Perry Greenfield, Todd Miller and Rick White at the Space Telescope Science Institute), which was faster on large arrays and slower on small ones. In 2005, as an assistant professor at Brigham Young University (2001 to 2007), he began merging them; NumPy 1.0 and his *Guide to NumPy* came out in 2006. He co-wrote PEP 3118 (2006), Python 3's revised buffer protocol. He was President of Enthought (2007 to 2011), co-founded Continuum Analytics (now Anaconda) and NumFOCUS in 2012, started Numba, and founded Quansight (2018) and OpenTeams (2019).

**How he thinks.** In his 2020 Columbia slides he describes NumPy as a unification project, for the array objects and for the community, and says he gave up university tenure to do it. Unify, do not add a third option. Share, do not copy: PEP 3118 says "This interface will allow any extension module to either create objects that share memory or create algorithms that use and manipulate raw memory from arbitrary objects that export the interface." It names NumPy and PIL as libraries with incompatible views of memory, and asks that shared memory declare its shape and "what data-format the memory contains." Then build institutions so the shared code is funded.

**Quality bar.**
1. One representation per concept: the app and the Python tooling share one definition of a session or score.
2. Every stored or computed number has a stated type, unit and precision; rounding happens only at display.
3. A calculation lives in one place, not re-implemented per screen.
4. Data crossing a boundary (app to gate, app to server) uses a documented format both sides check.

**Lens questions.**
- Is this a second way to represent something we already represent?
- What is the type, unit and precision of this number, and where is that written?
- Is the same calculation done elsewhere, slightly differently?
- Can others build on this without copying it?

**Example review notes (illustrative).**
- "The app stores durations in milliseconds; the Python check reads them as seconds. Put the unit in the name (`durationMs`) and assert it in the gate."
- "The average is computed in two screens with different rounding. Compute once at full precision, round at display. Under rule 6 this blocks shipping."
- "A new export duplicates the existing JSON with renamed keys. Extend the one format with a version bump instead."

**Sources.**
- PEP 3118 (text read from https://github.com/python/peps/blob/main/peps/pep-3118.rst): https://peps.python.org/pep-3118/
- History of SciPy: https://wiki.scipy.org/History_of_SciPy
- Oliphant, "Array computing and the evolution of SciPy, NumPy and PyData" (2020 slides): https://www.slideshare.net/slideshow/array-computing-and-the-evolution-of-scipy-numpy-and-pydata/227895538
- PyData Seattle 2023 bio: https://pydata.org/seattle2023/schedule/talk/DLYFHT/
- Real Python Podcast 262: https://realpython.com/podcasts/rpp/262/

**Uncertain points.**
- The tenure claim is his own account; no university record found.
- NumPy 1.0's month (often given as October 2006): UNVERIFIED; the year is confirmed.
- Founder credit for NumFOCUS is shared, and bios differ on "founded" versus "co-founded." Quansight and OpenTeams titles vary by source.

---

## Better candidates?

Lance decides. Each of these wrote JavaScript or Python that a large share of other code depends on.

1. **Tim Peters (Python).** Wrote Timsort, the sort behind Python's `list.sort`, documented in CPython as "an adaptive, stable, natural mergesort, modestly called timsort" (https://github.com/python/cpython/blob/main/Objects/listsort.txt). Also wrote `doctest` ("Released to the public domain 16-Jan-2001, by Tim Peters": https://github.com/python/cpython/blob/main/Lib/doctest.py) and the Zen of Python. Later adoption of Timsort by other languages is widely reported but UNVERIFIED here.
2. **Ryan Dahl (JavaScript).** Created Node.js, first shown at JSConf EU on November 8, 2009 (https://en.wikipedia.org/wiki/Node.js). Introduced Deno at JSConf EU 2018 in his talk "10 Things I Regret About Node.js" (https://dev.to/nickytonline/10-things-i-regret-about-nodejs-14m3), which makes him a lens on the server and on reversing your own mistakes.
3. **Wes McKinney (Python).** Started pandas in 2008 at AQR and open-sourced it in 2009 (https://wesmckinney.com/about). Co-created Apache Arrow and wrote *Python for Data Analysis* (2012) (https://wesmckinney.com/blog/apache-arrow-pandas-internals/).
