# Attention and persuasion for Emmy: five lenses on drawing attention, lowering resistance honestly, and asking the question that cuts through
Researched 2026-10-15.
Lenses, not authorities: Emmy reviews through them, she never speaks for them. Persuasion here serves truth; it never works against the person.

---

**How to read this.** This environment blocked direct page fetches, so every fact rests on source
text as web search returned it, from the source named beside it. Full books were not read. Quotes
appear only where the exact words came back with a URL, and that URL is in the section's sources.
Everything else is paraphrase. **UNVERIFIED** marks anything that could not be confirmed. Example
notes use real Atüned strings from `atuned/src/` as they stood on 2026-10-15. They are suggestions
for Lance, never rulings. Atüned's `docs/VOICE.md` and the six rules in `CLAUDE.md` govern wherever a
lens disagrees with them.

**The frame that governs this file.** Lance's laws include Truth, Transparency and Non-Harm, and the
art direction says never Black Mirror, never an instrument used against people. So "bypass
resistance" here means one thing: remove the friction that stops a true message from landing. It
never means getting past a person's judgment. Every lens below ends with the point where its own
techniques cross into manipulation, and the line Emmy holds there. One test sits under all five:
**would the person still agree to it if they could see exactly how it was done?** If not, it does
not ship.

**How Emmy uses a lens.** Pick the lens that fits the job, run its tests, write the note as
"Through the Voss lens: ...". Never "Voss would say". Lance decides.

| Lens | Field | What it catches | Best on |
|---|---|---|---|
| Aristotle | classical rhetoric | claims with no reason, emotion out of proportion, wrong moment | any line that asks for belief |
| Cialdini | social psychology of influence | faked proof, faked scarcity, the moment before the message | onboarding, paywall, launch |
| Voss | crisis negotiation | tone, unspoken fears, questions that trap instead of open | voice lines, warnings, hard moments |
| Fogg | behavior design | asks too big to do, prompts at the wrong time, no felt reward | first session, habits, streaks |
| Harris | humane technology (the guardrail) | engagement that costs the person, attention taken not given | rewards, notifications, paywall |

---

## 1. Aristotle

**Who and why.** The Greek philosopher (384 to 322 BCE) whose *Rhetoric* named the three proofs:
ethos, pathos, logos. The lens for asking whether a line earns belief by character, feeling and
reason in the right proportion, and at the right moment.

**Background.** The *Rhetoric* is a 4th-century BCE work in three books. Book I defines rhetoric as
"the faculty of observing in any given case the available means of persuasion" (W. Rhys Roberts
translation). Book II treats the proofs and emotions; Book III, style and delivery. **Kairos is not
Aristotle's invention.** The word first appears in Homer in
a spatial sense, a vulnerable spot on the body. Hesiod's *Works and Days* (line 694) gives the
proverb, rendered by Laura Slatkin as observing due measure, with the right time and right amount
best in all things. The sophists, Protagoras and Gorgias especially, made it central to teaching
speech, and Isocrates, Gorgias's student, framed it as knowing when to speak, when to stay silent,
and what to say. Hippocratic medicine used it for the right moment to treat. Aristotle inherits it;
the four-part set "ethos, pathos, logos, kairos" is a later teaching grouping, not his.

**How he thinks.**
1. Find what is actually persuasive in this case, not what would be persuasive in general.
2. Ethos: the speaker shows good sense (phronesis), good character (arete) and goodwill toward the
   listener (eunoia). In his account this must be built by the speech itself, not borrowed from
   reputation (paraphrase of Book I, ch. 2).
3. Pathos: emotions change how people judge, and they come with pain or pleasure, so the speaker
   must know what each emotion is, who feels it, and why (paraphrase of Book II, ch. 1).
4. Logos: the proof, or what looks like proof, in the words themselves.

**Somatic side.** Book III treats delivery as management of the voice to express emotion, and names
three things to attend to: "volume of sound, modulation of pitch, and rhythm."

**Questions that cut to the chase.** What is actually true here? What does this listener need to
feel to judge it fairly, no more? Why should they trust this voice? Why now?

**Quality bar.**
1. Every claim has a reason the listener can check, or says plainly that it is a ruling.
2. The emotion raised matches the size of the real situation.
3. The line shows goodwill: it serves the listener even where that costs the product.
4. It arrives when it is needed, not before it can be understood or after it can help.

**Lens questions.**
- Which of the three proofs is carrying this line, and is it the right one for this moment?
- What reason does this line give, and could a skeptic check it?
- Is this feeling proportionate, or is it doing the arguing?
- Does this line make the speaker look wise, good and on the listener's side, or only confident?
- Is this the kairos, or would the same words land better one screen later?

**Example notes.**
- `38_voice.js`, the rebound banner: "Before you start. It will read louder around [day]. That is the
  rebound, not a relapse. The felt reading climbs while the actual load keeps falling, and it peaks
  about five days out." Through the Aristotle lens: all three proofs in four sentences, and kairos
  right by design (the code says a warning after the fact is an excuse, not a preparation).
  Predicting a discomfort the product could have hidden is eunoia. Pass.
- `38_voice.js`, onboarding line six: "Feel what the body is doing as the energy is released." On
  first run the listener has felt nothing yet, so "the energy is released" asks for trust the speech
  has not built. Question for Lance: does the line earn more ethos if it invites before it asserts?
- `38_voice.js`, the handover: "To bring life back to our nerves." "Our" puts the speaker inside the
  practice. Goodwill without a claim. Pass.

**Where it crosses, and Emmy's line.** Aristotle draws it himself: stirring a judge to anger, envy or
pity off the facts is like choosing to "warp a carpenter's rule" before using it (Book I, ch. 1).
**Emmy's line:** emotion is allowed only when it matches what is true about the person's situation.
No fear raised to move a sale, no urgency the facts do not hold.

**Sources.**
- https://kairos.technorhetoric.net/stasis/2017/honeycutt/aristotle/rhet1-2.html (Rhys Roberts translation, Book I ch. 2, the definition)
- https://classics.mit.edu/Aristotle/rhetoric.1.i.html (Book I ch. 1, the carpenter's rule)
- https://classics.mit.edu/Aristotle/rhetoric.3.iii.html (Book III, delivery and voice)
- https://en.wikipedia.org/wiki/Rhetoric_(Aristotle) (structure of the three books)
- https://chs.harvard.edu/chapter/laura-slatkin-the-power-of-thetis-and-selected-essays-part-ii-chapter-6-measuring-authority-authoritative-measures-hesiods-works-and-days (Hesiod line 694)
- https://www.sunypress.edu/isbn/9780791452332 (Sipiora and Baumlin, eds., *Rhetoric and Kairos*, SUNY Press 2002: Homer, Gorgias, Isocrates, Hippocratic medicine)
- https://firstthings.com/rhetorical-timing/ (kairos from spatial to temporal sense; Isocrates on when to speak)

**Uncertain points.** The exact composition date of the *Rhetoric* is not settled. The ethos and
pathos passages above are paraphrased from memory of the Rhys Roberts text; search confirmed their
substance through secondary sources, not the exact wording. A Pythagorean role in early kairos is
sometimes claimed and was **UNVERIFIED** here. How often Aristotle himself uses the word kairos in
the *Rhetoric* was not checked.

---

## 2. Robert Cialdini

**Who and why.** The social psychologist who catalogued why people say yes. The lens for spotting
when a product leans on a shortcut of the mind, and whether the thing the shortcut points at is
real.

**Background.** Regents' Professor Emeritus of Psychology and Marketing at Arizona State University.
*Influence: The Psychology of Persuasion* (1984) named six principles: reciprocity, commitment and
consistency, social proof, liking, authority, scarcity. *Pre-Suasion: A Revolutionary Way to
Influence and Persuade* (2016) added a seventh, **unity**: shared identity, the sense of being one of
"us" (family, place, faith, cause). He had said in 2014 that the important principles fit in the
original six, so unity was a revision of his own view. The new and expanded *Influence* (2021) gives
unity a full chapter, 73 pages by ASU's count.

**How he thinks.**
1. People use shortcuts to decide quickly; each principle is one shortcut.
2. Ask which shortcut a situation already contains, honestly.
3. Pre-Suasion: what a person is attending to just before a message changes how the message lands.
   He calls these privileged moments. A phrase summaries attribute to the book: what is focal is
   treated as causal, so what you put in front of attention gets read as what matters.
4. Arrange the moment before, then deliver the message.

**Somatic side.** Cialdini works on attention and timing, not voice or body, and says little about
physiology. The somatic entry point is his moment before: the state a person is in when the message
arrives. For a body practice that state is the whole game.

**Questions that cut to the chase.** What is this person attending to one second before the ask?
Which principle is already true here? If the principle is not true, why is it on the screen?

**Quality bar.**
1. Every principle in use is naturally present: real numbers, real scarcity, real authority.
2. The moment before the ask prepares the person for the truth, not for compliance.
3. Unity is claimed only where the shared identity is real.
4. Nothing on screen would embarrass the product if the person learned how it worked.

**Lens questions.**
- Which of the seven principles is this screen using, and is it really present?
- What is the person looking at right before this ask?
- Is this social proof a real count, today?
- Is the commitment we ask for small, accurate and kept?
- Would this still work if we told the person which principle it uses?

**Example notes.**
- `38_voice.js`, onboarding: "Find a quiet space. Sit back and relax," before any release line.
  Through the Cialdini lens: honest pre-suasion. It sets the body state the practice needs. Pass.
- Same file: "We will be here for a few minutes." A commitment is only as good as its accuracy. If
  the session length is known, the real number is stronger and Rule 6 asks for it.
- `38_voice.js`, the ego rebound: two cases on record, named, and a comment that no formula predicts
  length. The opposite of manufactured social proof. Pass, and a model for launch copy: if a count
  appears ("people who have released ..."), it is the live count or it does not appear.

**Where it crosses, and Emmy's line.** Cialdini sorts communicators into bunglers, who miss the
principles that are present; smugglers, who counterfeit principles that are not; and sleuths, who
find what is genuinely there and use it openly. **Emmy's line:** sleuth only. No countdown timers,
no "only a few left" for software, no invented user counts, no borrowed authority, no "we" the
product has not earned. These are also Rule 6 violations.

**Sources.**
- https://news.wpcarey.asu.edu/20210510-godfather-influence-has-new-way-be-more-persuasive (ASU: 2021 edition, unity chapter)
- https://blogs.wpcarey.asu.edu/20250422-gentle-science-persuasion-part-seven-unity (ASU: unity as shared identity)
- https://sive.rs/book/PreSuasion (book notes: privileged moments)
- https://www.fi-magazine.com/articles/part-i-the-art-of-ethical-persuasion (bunglers, smugglers, sleuths)
- https://www.sellingpower.com/2010/02/02/3361/how-to-influence-with-integrity (same, with smugglers counterfeiting the principles)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4118982 (Bohner and Schlüter 2014, towel study replication)
- https://barbaraoakley.com/pre-suasion/ (review: Pre-Suasion and the priming literature)

**Uncertain points, and replication.** The 1984 date and his ASU title come from general knowledge,
consistent with ASU coverage. Two research notes, stated neutrally: a 2014 replication of the hotel
towel study he co-authored (Goldstein, Cialdini and Griskevicius 2008) found norm messages raised
towel reuse but the "most guests reuse" message did not beat a standard environmental message, while
another 2014 study did find a norm effect. Reviewers, Barbara Oakley among them, noted that
*Pre-Suasion* relies on social priming studies, a field where many findings have not replicated, and
that the book does not flag this. Treat Pre-Suasion's specific effect sizes as **UNVERIFIED**.

---

## 3. Chris Voss

**Who and why.** A former FBI hostage negotiator who teaches that people decide from emotion and
safety first. The lens for tone, for naming the fear before it is spoken, and for questions that
open rather than corner.

**Background.** Twenty-four years in the FBI, rising to the bureau's lead international kidnapping
negotiator. He founded The Black Swan Group, a negotiation training firm. *Never Split the
Difference: Negotiating As If Your Life Depended On It* (2016) was written with journalist Tahl Raz.

**How he thinks.**
1. Tactical empathy: understand the other person's feelings and view accurately. In his own
   definition, not agreement and not sympathy.
2. Mirroring: repeat the last few words someone said, so they keep talking.
3. Labeling: name the feeling you hear ("It seems like ..."), which tends to defuse it.
4. Accusation audit: say the worst things they might think about you before they do.
5. Aim for "that's right": the moment the other person feels fully understood.
6. Calibrated questions: open "how" and "what" questions, avoiding "why", which sounds accusing.
   The best known, from a ransom role-play he recounts: "How am I supposed to do that?"
7. No-oriented questions, which let people feel safe by saying no.

**Somatic side.** The most documented of the five. He describes three voices: assertive (which he
says to use rarely), playful and upbeat (the default), and "the late-night FM DJ voice": deep, slow,
calm, reassuring. The idea is that calm is contagious, and a calm listener thinks better. He also
cites the 7-38-55 split (words, tone, body), with the caveat that it applies to forming an attitude
about someone.

**Questions that cut to the chase.** What is this person afraid of right now? What would make them
say "that's right"? How would they want this to go?

**Quality bar.**
1. The hard feeling is named before the person has to carry it alone.
2. Labels describe what is true for them, not what we wish they felt.
3. Questions are open and answerable; none is a trap.
4. The tone of the line, read aloud, slows the body down.

**Lens questions.**
- What fear is under this moment, and does the copy name it?
- Read aloud: which of the three voices is this? Is it the right one?
- Is there a "why" that should be a "what" or "how"?
- Could this person say no here and feel safe doing it?
- Would they say "that's right" to this summary of their state?

**Example notes.**
- `38_voice.js`, onboarding, spoken at rate 0.82 with a 420 ms beat between lines. Through the Voss
  lens: slowed is not the same as calm. A browser speech voice sped down can sound sedated rather
  than reassuring. Worth checking on Lance's machine whether "Let us begin." lands low and settled.
- The rebound banner ("That is the rebound, not a relapse.") is an honest accusation audit: it says
  the person's worst thought ("it's getting worse, this isn't working") before they think it. Pass.
- `38_voice.js`, stacking warning: "Too fast. You are stacking rebounds." This is the assertive
  voice. For a safety warning that may be right. Question for Lance: does a label first ("It seems
  the last release is still moving") make the same stop easier to accept?

**Where it crosses, and Emmy's line.** His frame is a negotiation with a counterpart; Atüned's user is
not a counterpart. The technique crosses when labels, mirrors and "that's right" are used to extract
a yes the person would not give with full awareness, or when an accusation audit is used to smother
a fair objection. Critics have noted the word "tactical" is what makes empathy sound like a tool;
Voss answers that it means accurate understanding. **Emmy's line:** label only what is true, use the
calm voice to settle, never to sell, and no no-oriented trick questions on a paywall or consent
screen.

**Sources.**
- https://www2.publishersweekly.com/9780062407801 (2016 review; "the late-night FM DJ voice")
- https://www.bookbrowse.com/bb_briefs/detail/index.cfm/ezine_preview_number/26972/never-split-the-difference (co-author Tahl Raz)
- https://fable.co/book/never-split-the-difference-by-chris-voss-9780062407818 (24 years FBI, Black Swan Group)
- https://3minbooks.substack.com/p/never-split-the-difference (accusation audit, "that's right")
- https://bigthink.com/personal-growth/forced-empathy ("How am I supposed to do that?")
- https://weforum.org/agenda/2022/01/tactical-empathy-key-workplace-negotiations-voss (his definition of tactical empathy)
- https://www.jasoncollins.blog/posts/chris-vosss-never-split-the-difference-negotiating-as-if-your-life-depended-on-it (a behavioral economist's critical review)
- https://bigthink.com/the-learning-curve/the-7-38-55-rule-debunking-the-golden-ratio-of-conversation (7-38-55 critique)

**Uncertain points.** Technique descriptions come from book summaries, not the book. The 7-38-55
split traces to Albert Mehrabian's late-1960s lab studies of single words and attitude, which critics
say are widely overextended; Voss's use of it is a rule of thumb, not a finding. Claims about the
neurochemistry of tone were not checked and are **UNVERIFIED**. No peer-reviewed critique of tactical
empathy was found.

---

## 4. BJ Fogg

**Who and why.** The Stanford researcher who built a model of when behavior happens. The lens for
asking whether an ask is small enough, prompted at the right moment, and followed by a felt reward.
Paired here with Harris, who came out of his lab and became its sharpest critic.

**Background.** Founder of what is now the Stanford Behavior Design Lab, formerly the Persuasive
Technology Lab. He named "captology," the study of computers as persuaders, and wrote *Persuasive
Technology: Using Computers to Change What We Think and Do* (Morgan Kaufmann; sources give 2002 and
2003). He published the Fogg Behavior Model in 2009 and began the Tiny Habits method in 2011. The
book *Tiny Habits: The Small Changes That Change Everything* appeared at the turn of 2019 into 2020
(sources give both years).

**How he thinks.**
1. **B=MAP:** behavior happens when motivation, ability and a prompt "converge at the same time"
   (Publishers Weekly's summary). Prompts were earlier called triggers.
2. Motivation is unreliable, so make the behavior easier rather than pushing harder.
3. Anchor the new behavior to something already done, make it tiny, then celebrate.
4. His maxims, as study guides give them: help people do what they already want to do; help people
   feel successful.

**Somatic side.** Fogg puts emotion at the center of habit. In his TED essay, designing for habit is
designing for emotion, and celebration, done immediately and genuinely, is how the feeling wires the
habit in. He calls the feeling "Shine": a felt sense of success. Celebrations are physical and small:
a fist pump, a silent yes.

**Questions that cut to the chase.** What is the tiniest version of this? What does it come right
after? What will the person feel the moment it is done?

**Quality bar.**
1. The first ask is small enough to do on a bad day.
2. Every prompt arrives when the person can act on it.
3. The session ends with a felt moment of success, not a blank screen.
4. Every behavior the product prompts is one the person said they wanted.

**Lens questions.**
- Is this failing on motivation, ability or prompt? Fix the cheapest one.
- What is the smallest version of this ask?
- Where is the celebration, and does it come immediately?
- Is this a behavior the person chose, or one the product needs?
- Does missing a day make them feel like a failure?

**Example notes.**
- `33_soul-bux.js`, the streak rule: nothing resets to zero, one grace day, a miss halves the streak.
  Through the Fogg lens: "help people feel successful" in code. Pass.
- `38_voice.js`: onboarding plays once, then never again unless asked. Removing a repeated cost raises
  ability. Pass. Caution: the comment's figures (a simulated user going from 0 to 53 percent) are
  simulation output. Under Rule 6 they must never be shown to anyone as a measured result.
- The same comment says the simulated user ran out of attention at the close and never saw a summary.
  Through this lens the summary is the celebration; it is where Shine happens. Protect it.

**Where it crosses, and Emmy's line.** B=MAP works for any behavior, wanted or not. A 2007 Stanford
class he taught had students build Facebook apps, and later reporting tied his lab to Instagram
co-founder Mike Krieger, to *Hooked* author Nir Eyal, and to the engagement-maximizing design that
followed. Wired described the class as developing techniques to make apps addictive; Fogg told CNN he
did not teach people to build addictive technology. **Emmy's line:** his first maxim is the line.
Every prompt, reward and streak serves a behavior the person named. No variable rewards, no prompt
written to lift a usage number.

**Sources.**
- https://en.wikipedia.org/wiki/B._J._Fogg (lab, captology, 2009 model, Tiny Habits dates)
- https://www.media.mit.edu/events/advancing-wellbeing-seminar-series-bj-fogg (bio; 2002 book date)
- https://publishersweekly.com/9780358003328 (Tiny Habits review; the B=MAP wording)
- https://ideas.ted.com/how-you-can-use-the-power-of-celebration-to-make-new-habits-stick/ (Fogg on emotion and celebration)
- https://cacmb4.acm.org/news/108144-the-class-that-built-apps-and-fortunes/fulltext (the 2007 class)
- https://cnnespanol.cnn.com/2018/10/15/facebook-google-empresas-tecnologicas-adiccion-pantalla (Wired's claim; Fogg's denial to CNN)
- https://www.wbez.org/stories/a-history-of-persuasion-part-3/40575ef1-d5e6-41d0-a287-f5bf31f73945 (On the Media: Ian Leslie, Fogg and Harris)
- https://www.kqed.org/quest/29138/think-tiny-the-science-of-new-years-resolutions (informal Twitter test of the method)

**Uncertain points, and evidence.** The maxims' exact wording comes from study guides, not the book.
The book's evidence rests largely on Fogg's coaching of tens of thousands of people and informal
volunteer tests; no randomized trial of the Tiny Habits method turned up in these searches. That is a
gap in this research, not proof none exists. Ian Leslie's 2016 article in *1843* ("The Scientists Who
Make Apps Addictive") was found only by reference; its text was not read.

---

## 5. Tristan Harris (the guardrail lens)

**Who and why.** A former Google design ethicist who argued that tech competes for attention by
exploiting the nervous system. The lens Emmy runs last, on every rewarding, notifying or monetizing
screen: is this time the person would endorse afterwards?

**Background.** Studied at Stanford, where he joined Fogg's Persuasive Technology Lab. Co-founded
Apture, which Google acquired in 2011, then became Google's design ethicist. An internal 2013 slide
deck asked Google to minimize distraction and respect users' attention. He left Google in December
2015 and led the Time Well Spent movement. His 2016 essay "How Technology Hijacks People's Minds,
from a Magician and Google's Design Ethicist" draws on a childhood in stage magic. His TED2017 talk, "How a handful of tech companies control billions of
minds every day," named notifications, Snapstreaks and autoplay. He co-founded the Center for Humane
Technology in 2018 with Aza Raskin, and testified to a Senate Commerce subcommittee on June 25, 2019,
at a hearing titled "Optimizing for Engagement: Understanding the Use of Persuasive Technology on
Internet Platforms."

**How he thinks.**
1. Attention is finite and companies are competing for it.
2. When a business is measured on time spent, design drifts toward whatever hooks the fastest,
   oldest parts of the mind, a drift he calls a race to the bottom of the brain stem.
3. So the measure must change: time well spent, judged by the person, afterwards.
4. Design for stopping points and respectful interruptions, not bottomless feeds.

**Somatic side.** His case is about the body being played. On *60 Minutes* (2017): "Every time I
check my phone, I'm playing the slot machine to see, 'What did I get?'" Later, to CBS: "While we're
upgrading the machines, we're downgrading humans." For Atüned the test is physical: does the screen
leave the body more settled or more activated than it found it?

**Questions that cut to the chase.** Would the person thank us for this time a week later? Who does
this prompt serve? Where is the stopping point? What does this screen do to the body?

**Quality bar.**
1. Every session has a natural end, and the product says when to stop.
2. No variable reward, no infinite feed, no autoplay into more.
3. Every notification is one the person asked for and can turn off in one step.
4. What is gated, and why, is said plainly.
5. The person could see the design rationale and still agree to it.

**Lens questions.**
- Is this metric a person's good or a product's number?
- What does this screen do to the nervous system: settle or activate?
- Where does the person stop, and does the product help them?
- Does this reward pace, or depth?
- If this were shown on stage as a trick, would we be proud of it?

**Example notes.**
- `38_voice.js`, stacking warning: "Too fast ... Wait 72 hours." A product telling a person to use it
  less, with the reason. Through the Harris lens: the clearest pass in the build.
- `PAYWALL_AND_DASHBOARD_SPEC.md` sets tier one at 400 patterns a month; `38_voice.js` says "Four
  hundred a month is where it starts" for the ego rebound. If the cap sits there for safety, the
  paywall should say so. If it is commercial, a cap equal to a harm threshold will read as a push to
  pay past it. Lance decides which; transparency asks that the screen say it.
- `33_soul-bux.js`: Soul Bux are earned on what gets cleared. Check that the currency never rewards
  release pace past the ruled ceiling of 1,600 a month. Push support exists in `42b_cloud.js`; no
  notification copy was found in `src/` on 2026-10-15. When it is written, run it through this lens.

**Where it crosses, and Emmy's line.** This lens is the line, but it has its own risk: alarm. Critics
argue the "mind control" framing overclaims and that media has always competed for attention. Emmy
uses Harris for the test, not the rhetoric. **Emmy's line:** Atüned never uses a technique it would
not demonstrate to the user, and it measures its success by the person's life, not their minutes.

**Sources.**
- https://www.ted.com/talks/tristan_harris_how_a_handful_of_tech_companies_control_billions_of_minds_every_day (TED2017)
- https://en.wikipedia.org/wiki/Tristan_Harris and https://en.wikipedia.org/wiki/Center_for_Humane_Technology (Apture, Google, 2018 founding)
- https://www.insidehook.com/culture/former-google-product-philosopher-thinks-technology-is-purposely-addictive/amp (Fogg's lab)
- https://www.getabstract.com/en/summary/how-technology-hijacks-peoples-minds-from-a-magician-and-googles-design-ethicist/28438 (the 2016 essay)
- https://www.govinfo.gov/content/pkg/CHRG-116shrg52609/html/CHRG-116shrg52609.htm (Senate hearing record, 2019)
- https://cbsnews.com/news/why-cant-we-put-down-our-smartphones-60-minutes (slot machine quote)
- https://www.cbsnews.com/news/former-silicon-valley-insider-on-how-technology-is-downgrading-humans/ (downgrading quote)
- https://www.techdirt.com/articles/20180715/22144840240/everything-thats-wrong-with-social-media-companies-big-tech-platforms-part-3.shtml (critique)
- https://ideas.repec.org/a/nat/nathum/v3y2019i2d10.1038_s41562-018-0506-1.html (Orben and Przybylski 2019)

**Uncertain points, and evidence.** One source names Randima Fernando as a third CHT co-founder; one
gives a conflicting founding year. "Race to the bottom of the brain stem" is attributed to the Time
Well Spent period; its first use was not pinned down. The 2016 essay's list of about ten
attention techniques was not verified item by item. On harm, stated neutrally: Orben and Przybylski (2019, *Nature Human
Behaviour*, about 355,000 adolescents) found digital technology use explained at most 0.4 percent of
the variation in well-being. Other researchers argue for larger effects. The size of the harm is
contested; the design principles do not depend on settling it.

---

## Better candidates?

Lance decides. Two names, possibly stronger for "lower resistance honestly":

- **William R. Miller and Stephen Rollnick (motivational interviewing).** A counseling method built to
  evoke change without pushing: it treats pushback as partly made by the helper's urge to fix (the
  "righting reflex") and separates a person's reasons not to change from strain in the relationship.
  A meta-analysis of 36 studies linked MI-consistent counselor skills to more "change talk" from
  clients; fits the body-and-spirit context better than Voss's adversarial frame.
  (https://pmc.ncbi.nlm.nih.gov/articles/PMC5958907, https://open-exam-prep.com/study-guides/icrc/treatment-counseling-referral/motivational-interviewing)
- **Marshall Ganz (public narrative).** Civil rights organizer in Mississippi, then with Cesar
  Chavez and the United Farm Workers, now teaching at Harvard Kennedy School. His story of self, story
  of us, story of now is ethos, pathos and kairos as one teachable form, ending in a specific, doable
  ask; a natural lens for launch copy and the book.
  (https://commonslibrary.org/the-power-of-story-the-story-of-self-us-and-now/, https://scholar.harvard.edu/sites/scholar.harvard.edu/files/marshallganz/files/harvard_exec_ed_public_narrative_2020_final_.pdf)

Considered and not proposed: Daniel Kahneman. His work explains how people judge, not how to speak to
them, and Cialdini and Fogg already cover that ground for this purpose.

**Uncertain on the candidates.** Which of the two MI process meta-analyses found in search holds the
36-study figure was not confirmed (the other is https://pmc.ncbi.nlm.nih.gov/articles/PMC6250061).
MI's origin dates (Miller's 1983 paper, the 1991 book with Rollnick) are from memory and
**UNVERIFIED** here.
