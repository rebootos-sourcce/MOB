# What I recommend for the journal

Tomas Egilsson, 1 October 2026. Rounds OU to PA in `TASKS.md`. The owner asked:
"the journal needs to be more robust. What do you recommend?"

The short answer: ship the deterministic reader now, because it is the only
kind this product can show its reasons for, and put a model behind it later
only where the reader is known to fail. The reasons follow, then what ships,
then what a server could add, then five questions for him.

## What question each number answers

- **Charge at a seat.** Which words in the entry sit at which part of the body,
  and how hot. Unchanged arithmetic.
- **Day quality (new).** Was the entry about a bad day or a good one, and how
  heavy. A reading of the entry, with no seat, and it moves no charge.
- **Subject (new).** Who or what each word the sniffer read is about, from the
  person's own clause, or marked as taken from the entry, or inferred.
- **Frame slots (new).** Which of what happened, what was done, how it felt,
  where, and what was under it the entry has not said.
- **Distress (new).** Whether the entry says the person wants to die or cannot
  go on, at concern or urgent, with the phrase that said it.

## What ships now, and why it beats the simpler thing

Every piece is a table, a precedence rule and a negation floor, in
`atuned_src/engine/`. The simpler thing is a model, and on this domain it does
not win: the domain is small, there is no labelled set, and the product shows a
person why. A phrase table can be read line by line by the owner, a clinician
and a lawyer. A model's weights cannot.

| Piece | File | What it does |
|---|---|---|
| Irritation, anger acts, depression, mad and the wheel | `lexicon.js`, `wheel.js` | Every word on the owner's feelings wheel is on a table, grouped to its family, and read at the charge and seat the family maps to. Anchored amounts, no typed numbers. |
| Masked profanity | `lexicon.js` (`swearRestore`), `sniff.js` (`normMap`) | Restores `f***ing` and the seven star run to the word, in dictation only. The sniffer reads a masked token as the word it fits, so older entries read too. |
| Intensifier rule | `sniff.js` | A swear before a word is a degree word at the factor of "really", and the stronger of it and the word before it wins. |
| A lacked feeling is the other person's | `sniff.js` | "He showed no remorse" is kept as a note about him and not charged to the writer. |
| Day quality, frame, chain | `frame.js` | Rough, bad, horrible and the rest as a state of the entry. Five slots, asked in a fixed order, one at a time, in the person's own words. |
| Subject of every imprint | `frame.js`, `sniff.js`, `schema.js` | Additive fields on the imprint, stored with the entry, validated at the boundary. `subjectLine` joins name and subject for a release line. |
| Subject check | `frame.js` | What the Mirror's "Not quite" asks: is the subject clear. |
| Question frameworks | `qframe.js` | Eight named frameworks, one question at a time, picked from what the story touched. |
| Distress | `distress.js` | A graded reader. At concern or urgent the page withdraws the release and shows the support lines drafted in `reviews/LEGAL-floor.md`. |

### How the day quality feeds the engine

It does not move the field. A hit needs a seat and the product has no address
for a day, so a hit would be an invention. The frame carries `day.load`, on the
same zero to ten scale as a seat's reading and from the same arithmetic: a tier
amount anchored to a word the lexicon already weighs (16, the Anger family
floor, for a mild word; 22, miserable, for a strong one), scaled by the degree
word, divided by three, capped at ten. What it moves is the question and what
the page says it heard. If he wants it to move the field, that is a ruling, and
it is question 3 below.

### How the six channels are read

The release's six channels, `C3_VERB`, are believing, perceiving, thinking,
behaving, acting and feeling. An imprint carries no channel. The release sweeps
all six on every line. So the frame reports which channels the person's words
sit in, as a fact about the words: an act of aggression is acting and behaving,
a feeling word is feeling. Nothing reads it yet.

## The failure modes, named

- **Attribution.** Every word lands on the writer unless it is a lacked feeling
  said of somebody else. "He was furious" still charges the writer. This is the
  subject model `DESIGN-sniffer.md` names as missing, and the subject field is
  the first step toward it, not the whole of it.
- **Negation of the writer's own words** is still read by Source AI and not by
  the sniffer. The apostrophe bug in `srcNegated` is fixed: "wasn't afraid" was
  heard as afraid.
- **Pronouns.** `him` resolves to a role only when the entry names exactly one
  role before it. Otherwise it stays `him` and the subject check says so.
- **The wheel mapping is mine.** See question 2.
- **A swear that fits two words.** `d***` fits damn and dick, and a run of seven
  stars fits fucking, asshole and bastard. The most common is taken and the
  swap says it was ambiguous. A token that fits nothing is left as it was.
- **Distress is a phrase table.** It reads English only, only what was typed,
  and no phrase it does not hold. See below.

## What it would take to evaluate this honestly

There is no labelled set and there is not going to be a safe one to build. What
can be measured without labels is measured in `tests/engine.js`: that a cue
fires where it should, does not fire on its negation, gives the same answer
twice, and that every amount is anchored to a word the table already carries.

For distress, the numbers are in `tests/distress-fixtures.json` and they are
not held-out numbers. I wrote the first set and tuned the table against it:
31 of 33 caught, 2 of 34 ordinary sentences flagged. I then wrote a second set
cold. The table caught 5 of 18. I widened the table with that set in view, and
it now catches 17 of 18, which means nothing, because the set is no longer
unseen. The honest figure for a phrase I did not anticipate is the cold one:
about one in four. An honest evaluation needs two raters, a corpus the author
of the table did not write, and agreement measured first. That corpus is the
most sensitive thing this product could hold, and the privacy ruling does not
let it be collected without his consent language.

## What the distress reader cannot know

- Whether the person means it.
- Tone, a quotation, a lyric, a character in something they are writing, or
  something they are telling a therapist about the past.
- Any phrase it has no entry for. The cold test says that is most of the
  language.
- Any language but English.
- That a card shown to a person who did not need it costs nothing.

It is a floor. It must not be described, to him, to a lawyer or to a user, as
a safety system. A person in crisis is still not safe because this exists. Two
things I did on purpose: it errs toward showing the card at concern, because a
miss is the expensive error, and it shows no cause, no method and no advice,
only the lines the legal file already drafted.

## What a server side model could add later

A model is good at exactly the places a phrase table is weakest: euphemism and
phrasing it has never seen, a clause's subject across sentences, and whether a
quotation is the person's own. If it is ever built:

1. **The app never holds the key.** The call goes through a server that holds
   it, behind sign in, and the browser never sees it. The app stays one file
   with no key in it.
2. **It sees the story and never the record.** The name never leaves the
   device, a key replaces it, and the story is never held joined to the record.
   That is the owner's ruling and it is a hard constraint on any learning.
3. **It never decides alone.** The table stays the floor. A model may raise a
   detection to concern and may never lower one the table made. Distress is
   the case where a model that is wrong in the quiet direction is the worst
   outcome.
4. **It must show its reason.** A model that cannot say which words it read
   cannot be shown to the person, and this product shows why.
5. **Consent and a controller.** Story text off the device means a controller
   exists, with access, deletion and breach obligations, and it needs a
   consent line of its own.

Tradeoffs: a model is better on unseen phrasing and worse on explaining,
slower, costs money per entry, fails when offline, and cannot be evaluated here
for lack of labels. The table is worse on unseen phrasing, instant, free,
offline, and can be read in an afternoon.

## Audio, and the asterisks

I could not run Chrome's cloud recogniser in this environment. What I can say
is evidence, not a reproduction: nothing in this repository masks a word (the
Story page appends the transcript as the recogniser returns it, and a test now
holds that), the masked shape is the recogniser's, and the Web Speech interface
has no switch for it. The owner asked for the asterisks gone, so a restoring
map writes the word the mask fits. It cannot know which of two words was said
when two fit.

What we cannot fix is the recogniser's masking. The options, each a ruling for
him and none built: record the audio and transcribe it on our own server (it
does not mask, and it breaks the promise that audio goes only to the browser's
speech service, and makes us a controller of the audio); run a small
recogniser in the browser (breaks one file and the size); or accept the
restoring map and its ambiguity.

## The question frameworks

Round OV. The turn arrow on Source AI now asks from named frameworks and no
longer walks a flat list. One question at a time, never the same framework
twice in a row while another has a layer left, the descent walked in order, and
a layer that sits at a seat the story touched comes first. The seven sins are
read off the Compass, the nine circles are the Compass's, the ages are his age
ladder. The five marked PROPOSED are mine and are not ruled. Each claims no
seat, because nothing in the product seats them. Every question asks for an
event in a life and the answer is the person's own: supports, not causes.


## The feelings wheel, mapped. PROPOSED, for him to confirm

Each family reads at the charge below, and the seat is `CHG2SEAT`'s, his own
ruling about where a charge is held, never typed in the wheel table. The weight
by ring is read off the family's own authored amounts: the lowest for the
family word, the median for a secondary, the upper quartile for a tertiary.
Authored words keep their own amounts and the wheel adds only words the
lexicon had no entry for. Words that are also ordinary words (busy, free,
tired, bad, exposed) are on the wheel and grouped, and are read as a feeling
only after felt, feel, feeling, feels, "made me".

| Family | Charge it reads at | Seat (CHG2SEAT) | Addresses at that seat | Secondary overrides |
|---|---|---|---|---|
| Happy | none, subtracts | coherent | - | - |
| Surprised | Surprise | Heart | 1 | Startled to Shock; Confused to Shock; Excited to Anticipation |
| Bad | Apathy | Throat | 0 | Busy to Anticipation; Stressed to Anticipation |
| Fearful | Fear | Root | 5 | Anxious to Anticipation; Insecure to Shame; Weak to Shame |
| Angry | Anger | Solar | 10 | Let down to Anger and Sad; Humiliated to Shame and Anger; Distant to Apathy; Critical to Disgust |
| Disgusted | Disgust | Sacral | 1 | - |
| Sad | Sad | Heart | 6 | Guilty to Shame |

Words under two families (overwhelmed, inferior, disappointed, embarrassed) are
grouped to both. The first three also read at a second charge. Embarrassed
stays Shame, by his round GR ruling, and that is the one place the wheel and an
earlier ruling disagree.

The Bad family reads at Apathy at the throat, and the product holds no address
whose fetter is Apathy at the throat, so Apathy words resolve through the
stated fetter fallback and not through an address list. That is a hole in the
address table the wheel exposes, not one it makes.

## The frameworks and their questions

### The seven deadly sins

Source: engine/data/compass.js, the sin of each circle. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| lust | What have you wanted more than was good for you? | a want that ran past its limit | Sacral | feeling |
| gluttony | What do you take more of than you need, when you are low? | what gets reached for to fill a gap | Solar | behaving |
| greed | When have you been greedy? | a time more was taken than was needed | Root | behaving |
| wrath | When did you last lose it with somebody? | a time anger went out as an act | Solar | acting |
| sloth | What have you put off the longest? | the thing that has waited the longest | Solar | behaving |
| pride | When did you last refuse help you needed? | a time help was offered and turned down | 3rd Eye | behaving |
| envy | Who has what you wanted, and what did you do when you saw it? | a time somebody else’s luck was hard to watch | Heart | feeling, behaving |

### The nine circles

Source: engine/data/compass.js, CIRCLES in descent order. Walked in order.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| Limbo | What are you going along with that you do not believe in? | going through the motions without belief | Heart, Crown | believing |
| Lust | What do you do so that people want you around? | arranging things to be wanted | Sacral | behaving |
| Gluttony | What do you reach for when you feel the gap? | consuming to cover an empty place | Solar | behaving |
| Greed | What do you count to know how you are doing? | worth measured by what is kept | Root | thinking |
| Wrath and sloth | What did you go off about this week, or go flat about? | anger out as an attack, or in as a shutdown | Solar | acting, feeling |
| Heresy | What have you decided you already know, and stopped listening on? | a belief that has closed the question | 3rd Eye | believing |
| Violence | When did you last want to break something? | the wish to break something, said out loud | none | acting |
| Fraud | When have you been warm at someone because it was easy, and not because you meant it? | warmth that costs nothing | Heart | behaving |
| Treachery | When have you backstabbed someone? | a time somebody who trusted you was gone against | none | acting |

### The ages of life

Source: engine/data/ages.js, the age ladder, three to eighteen. Walked in order.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| age 3 | What did you carry everywhere and would not be parted from? | the first thing | none | believing |
| age 4 | What did you make things out of, and what did you always make? | the first building | none | believing |
| age 5 | What was your favourite, and what was the one you were against? | the first favourite | none | believing |
| age 6 | What did you collect, and what made one of them better than another? | the first collection | none | believing |
| age 7 | Who did you pretend to be, and who did you refuse to be? | the first character | none | believing |
| age 8 | What did you take a side on, at school or at home, that other children took the other side of? | the first side | none | believing |
| age 9 | What were you the one who was good at it, and who was better? | the first mastery | none | believing |
| age 10 | What were you part of, and who were they against? | the first team | none | believing |
| age 11 | What did you decide was good, and what did you decide was for other people? | the first taste | none | believing |
| age 12 | What did you argue about with a friend, and which corner did you take? | the first argument | none | believing |
| age 13 | What did you learn to use, and what did you think of the ones who used the other thing? | the first machine | none | believing |
| age 14 | What position did you hold, and who were you holding it against? | the first position | none | believing |
| age 15 | What were you one of, and what did being one of them mean you were not? | the first belonging | none | believing |
| age 16 | What did you get good at, and what did that let you look down on? | the first work | none | believing |
| age 17 | What were you going to be, and who decided that? | the first plan | none | believing |
| age 18 | What did you take with you, and what did you make sure to leave? | the first leaving | none | believing |

### Jouissance (PROPOSED)

Source: PROPOSED, not ruled. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| return | What do you go back to more than anything, even when it costs you? | what gets returned to against its cost | none | behaving |
| love | What do you love doing more than anything else? | the enjoyment the person organises the week around | none | feeling |
| hold | What would you not give up, even if somebody asked nicely? | what is held when it is asked for | none | behaving |

### Cognitive bias (PROPOSED)

Source: PROPOSED, not ruled. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| confirm | What have you read or heard lately that only agreed with you? | taking in only what agrees | none | perceiving |
| sunk | What are you still doing because of how much you have already put in? | staying for the cost already paid | none | thinking |
| credit | What went wrong lately that you put on somebody else? | blame placed outside, credit kept inside | none | believing |

### The shadow (PROPOSED)

Source: PROPOSED, not ruled. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| project | What annoys you most in other people? | a trait that gets a stronger reaction than it earns | none | perceiving |
| deny | What have you been told about yourself that you shrugged off? | a thing said and not taken in | none | believing |
| hide | What do you pretend you do not do? | a habit kept out of the account | none | behaving |

### Attachment (PROPOSED)

Source: PROPOSED, not ruled. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| pull | Who do you go quiet around when you need them? | pulling away at the point of need | none | behaving |
| check | Who do you check on more than you want to? | reaching for reassurance | none | behaving |
| safe | Who can you call at three in the morning? | who is actually reachable | none | perceiving |
| leave | What do you do when somebody pulls away? | the move made when a person withdraws | none | acting |

### The four temperaments (PROPOSED)

Source: PROPOSED, not ruled. Any layer.

| Layer | Question | What it looks for | Seats it can light | Channels |
|---|---|---|---|---|
| choleric | When did you last take charge of something nobody asked you to? | energy going out as command | none | acting |
| sanguine | What did you start this month and drop? | energy going out and not landing | none | behaving |
| melancholic | What have you gone over again and again this week? | energy going inward and round | none | thinking |
| phlegmatic | What have you let slide because it was easier? | energy not spent | none | behaving |

## Five questions for the owner

1. **The opener.** The code ships his round JS ruling: "Hello, Lance. What
   would you like to write about today?" The brief for this round says the
   opener is "What are we writing about today?", which was his first wording
   at round GO and which round JS replaced. I changed nothing. Which one is
   it now, and does the greeting stay?

2. **The wheel mapping.** FEELINGS-WHEEL.md says "The mapping to addresses is
   for the build to propose and the owner to confirm." The table above is the
   proposal. The three calls most likely to be wrong: Humiliated reads Shame
   first and Anger second because the wheel files it under Angry; Confused
   reads Shock because the product files doubt there; Tired and Bored read at
   Apathy at the throat, where no address is named Apathy. Is the mapping
   right, and which families should move?

3. **Should a bad day move anything, and should a channel steer the release?**
   Today "I had a really rough day" asks "What made it rough?" and moves no
   charge, because a day has no seat. And on his own words, "it sounds like
   acts of aggression, like acts, which is why we released the acting part",
   the frame now records acting and behaving for a confrontation, and the
   release still sweeps all six on every line. Three ways to go. Leave both as
   they are, which costs nothing and changes no reading. Let a bad day with no
   cause lift the day's resistance by a stated amount, which moves the CQ
   number on a day nobody located anything. Or let the channel a story sat in
   put that channel first in the release, which changes what a person hears
   first and needs his ear on it.

4. **Distress.** He said "The sniffer needs to be good enough to detect
   distress in a person's story." It is a phrase table and it caught about one
   in four phrasings I had not anticipated, before I widened it. I recommend
   three things: a clinician and counsel read `distress.js` line by line before
   this ships, the card stays at concern and not only urgent, and nobody calls
   it a safety system anywhere. The card quotes `reviews/LEGAL-floor.md` and
   leaves out "Put the instrument down and use it", because his instruction was
   to offer to keep writing and the two say opposite things. Is that the right
   call, and who reads the table?

5. **The frameworks.** Five of the eight are mine, marked PROPOSED, and one
   question in the nine circles, "When did you last want to break something?",
   is the soft form of violence against self. I kept self harm out of it on
   purpose, because a question that invites that disclosure with no person on
   the other end is the thing the legal file warns about. Also open: whether
   Source AI may read the text of earlier entries for the day's frame. It
   reads seat keys only, DESIGN-sniffer.md question 12. Which of the five do
   you want, which do you strike, and may it read earlier text?

Smaller findings that did not change his decision are in the commit message and
in the tests: the apostrophe negation bug, the stated fetter governing its own
seat, and the second pass on the heart imprints that stopped handing Anger
addresses to a depression.
