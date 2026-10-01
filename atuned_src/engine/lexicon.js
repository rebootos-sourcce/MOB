/* ============================================================
   THE LEXICON. word -> [seat, intensity].
   The original declared several keys twice across two blocks, so the
   later generic entries silently cancelled the newer specific ones , 
   the opposite of the stated intent. Merged here, one entry per key.
   ============================================================ */
var LEX={
 /* ============================================================
    WHAT AN ORDINARY SENTENCE BRINGS, and the reason this block exists.

    Measured against six plain sentences a person would actually type, four
    returned nothing at all: a father dying, being exhausted, feeling alone,
    and a panic attack. Those are not edge cases. They are the four most
    common things somebody opens an instrument like this to say, and the core
    loop of the product is that a story is read for charge.

    The gap was not conceptual. Almost every one of these concepts was already
    here in ONE inflection and missing in the others: lonely but not alone,
    grieving but not grief or died, drained and depleted but not exhausted,
    panicked but not panic. A person writes what happened in nouns and verbs,
    and this table was written in adjectives.

    So this is the same map widened, not a new theory: the event words and the
    noun forms of concepts already seated here, at the weights their existing
    neighbours carry. Seats follow the ones already in use: grief and
    loneliness at the heart, exhaustion and rage at the solar plexus, panic
    and survival at the root, shame and worth at the sacral, deceit and being
    unheard at the throat, meaninglessness at the crown, rumination at the
    third eye.
    ============================================================ */
 /* WHAT ANGER LOOKS LIKE WHEN SOMEBODY DESCRIBES IT. The table had furious
    and angry, which are the words a person uses about themselves afterwards,
    and none of the verbs they use about what happened. "He shouted at me and I
    slammed the door" read as nothing at all. */
 shouted:['solar',24],yelled:['solar',24],screamed:['solar',26],
 slammed:['solar',22],snapped:['solar',22],'lashed out':['solar',26],
 'blew up':['solar',26],'lost it':['solar',24],'saw red':['solar',26],
 /* and what being unheard looks like from the outside, at the throat */
 'talked over':['throat',22],interrupted:['throat',20],'shut me down':['throat',24],
 'would not listen':['throat',24],'wouldnt listen':['throat',24],
 'nobody listened':['throat',24],
 /* and being judged, at the sacral, where shame already sits */
 criticised:['sacral',22],criticized:['sacral',22],'told me off':['sacral',22],
 'made me feel small':['sacral',26],laughed:['sacral',20],
 /* grief and loss. heartbroken and grieving were here; the event was not. */
 died:['heart',28],death:['heart',26],dying:['heart',26],'passed away':['heart',28],
 grief:['heart',26],mourning:['heart',24],mourn:['heart',24],bereaved:['heart',26],
 loss:['heart',22],funeral:['heart',24],buried:['heart',22],widowed:['heart',26],
 miscarriage:['heart',28],stillborn:['heart',28],
 /* alone. lonely was here and alone was not, which is the commoner word. */
 alone:['heart',24],loneliness:['heart',24],isolated:['heart',22],
 unwanted:['heart',22],'nobody cares':['heart',26],'no one came':['heart',24],
 /* exhaustion. drained and depleted were here, the plain word was not. */
 exhausted:['solar',26,'Apathy'],exhaustion:['solar',26,'Apathy'],weary:['solar',22,'Apathy'],
 fatigue:['solar',22,'Apathy'],'wiped out':['solar',24,'Apathy'],'no energy':['solar',24,'Apathy'],
 'running on empty':['solar',26,'Apathy'],'cannot keep going':['solar',28,'Apathy'],
 'can not keep going':['solar',28,'Apathy'],'cant keep going':['solar',28,'Apathy'],
 /* panic. panicked was here, the noun and the event were not. */
 panic:['root',28],'panic attack':['root',28],panicking:['root',28],
 terror:['root',28],petrified:['root',26],
 /* being lied to. the throat carries deceit and had no verb for it. */
 lied:['throat',24],lying:['throat',22],lies:['throat',22],
 betrayed:['throat',28],betrayal:['throat',28],cheated:['throat',26],
 deceived:['throat',24],'went behind my back':['throat',26],
 /* overwhelm */
 overwhelmed:['solar',26],drowning:['solar',26],'too much':['solar',22],
 'cannot cope':['solar',26],'cant cope':['solar',26],
 /* rage. furious was here; the noun and the held forms were not. */
 rage:['solar',28],livid:['solar',26],seething:['solar',24],
 resentment:['solar',24],resentful:['solar',24],bitter:['solar',22],
 bitterness:['solar',22],
 /* shame and worth. humiliated was here, the rest of the family was not. */
 mortified:['sacral',26],disgraced:['sacral',26],exposed:['sacral',22],
 unlovable:['sacral',26],disgusting:['sacral',24],'not good enough':['sacral',24],
 /* meaninglessness. numb and empty were here, the statements were not. */
 meaningless:['crown',24],'nothing matters':['crown',26],
 'what is the point':['crown',24],'whats the point':['crown',24],
 disconnected:['crown',22],detached:['crown',20],hollow:['crown',22],
 /* rumination */
 overthinking:['eye',22],'cannot stop thinking':['eye',24],
 'cant stop thinking':['eye',24],'going over it':['eye',20],replaying:['eye',22],
 /* what the body reports, which is where a somatic instrument should be
    widest and was not. */
 'chest is tight':['heart',24],'chest tight':['heart',24],
 'cannot breathe':['root',26],'cant breathe':['root',26],'holding my breath':['root',22],
 'jaw is tight':['throat',22],'jaw clenched':['throat',22],
 'throat closed':['throat',24],'stomach knot':['sacral',22],
 nauseous:['sacral',22],'sick to my stomach':['sacral',24],
 trembling:['root',24],shaky:['root',20],'heavy in my chest':['heart',24],
 /* and the things that read as clear, which keep the scale honest at the
    other end. The coherent seat already carried calm, settled and grateful. */
 rested:['coherent',-12],easeful:['coherent',-12],unhurried:['coherent',-12],
 'slept well':['coherent',-14],'let it go':['coherent',-14],
 /* the burnout set. the resolver had no entry for any of these and read
    four segments out of thirty-three. */
 inadequacy:['throat',24],inadequate:['throat',22],misery:['heart',24],
 miserable:['heart',22],remorse:['heart',20],remorseful:['heart',18],
 burnout:['solar',28,'Apathy'],'burnt out':['solar',28,'Apathy'],'burned out':['solar',28,'Apathy'],
 depleted:['solar',24,'Apathy'],drained:['solar',22,'Apathy'],evaporated:['solar',20,'Apathy'],
 throbbing:['eye',18],throb:['eye',16],pounding:['eye',20],
 tense:['throat',16],tension:['throat',16],tight:['throat',16],clenched:['throat',20],
 crushed:['heart',26],humiliating:['throat',22],
 dread:['root',24],dreading:['root',22],bracing:['root',14],
 defeated:['heart',22],hopeless:['heart',26],pointless:['crown',22],
 resigned:['heart',18],flattened:['heart',20],
 grueling:['solar',18],relentless:['solar',18],
 /* root */
 nervous:['root',14],anxious:['root',16],scared:['root',18],afraid:['root',16],
 frightened:['root',18],terrified:['root',26],panicked:['root',24],froze:['root',18],
 frozen:['root',18],shaking:['root',20],unsafe:['root',20],
 /* PARALYZED WAS NOT A WORD THE SCANNER KNEW, and it is one of the owner's two
    anchors: "I'm a little tense is different than I'm paralyzed, it's orders
    of magnitude different." Measured before this: "I am paralyzed" read
    nothing at all (AZ6). Seated where frozen is, at the root, because it is
    the freeze taken to its end, and at the top of the authored curve, 28,
    where the desktop puts it at the top of its own (paralysis 30 of 30). */
 paralyzed:['root',28],paralysed:['root',28],paralysis:['root',28],
 /* sacral */
 restless:['sacral',12],craving:['sacral',14],numb:['sacral',16],empty:['sacral',18],
 hungry:['sacral',12],addicted:['sacral',22],distracted:['sacral',12],obsessed:['sacral',20],
 /* solar */
 /* THE SHAME FAMILY AT THE SOLAR PLEXUS STATES ITS FETTER, round GR. Measured
    on 27 September: "I feel ashamed that I am relieved" came back as four
    inferred Solar Anger imprints and the Story page printed "Anger +1.7" four
    times. ADJ2CHG already says every one of these six words is shame, but that
    only put Shame in wanted, and the solar plexus carries one Shame address of
    sixteen, under the quarter rule, so the seat fell back to its modal fetter,
    Anger. The third element is the same fact ADJ2CHG holds, written where the
    stated fetter branch honours it, exactly as the exhaustion family does.
    lexFamilyFloor already priced these six as Shame through ADJ2CHG, so the
    family floor does not move. The SEAT is unchanged and is the owner's open
    ruling (QUESTIONS.md 0l); only which fetter the seat resolves to moves.
    The other words where ADJ2CHG and the reading disagree were measured and
    left alone for a ruling: detached, disconnected and hollow at the crown,
    unheard, voiceless, choked, tense and tensed at the throat, nervous and
    anxious at the root. Key order is unchanged. */
 angry:['solar',18],furious:['solar',24],ashamed:['solar',20,'Shame'],humiliated:['solar',24,'Shame'],
 defensive:['solar',16],blamed:['solar',18],stupid:['solar',20,'Shame'],worthless:['solar',26,'Shame'],
 embarrassed:['solar',16,'Shame'],guilty:['solar',18,'Shame'],
 /* heart */
 sad:['heart',16],lonely:['heart',20],grieving:['heart',22],hurt:['heart',18],
 rejected:['heart',22],abandoned:['heart',26],unloved:['heart',24],heartbroken:['heart',26],
 /* throat */
 silent:['throat',14],unheard:['throat',18],voiceless:['throat',20],choked:['throat',18],
 dismissed:['throat',18],ignored:['throat',18],
 /* coherent. these subtract. */
 grateful:['coherent',-14],content:['coherent',-12],calm:['coherent',-12],
 steady:['coherent',-12],peaceful:['coherent',-14],settled:['coherent',-12],
 /* THE SNIFFER FINDS THE LIMITER, round SB, his own job description for the
    mechanic: "if a person is describing their lack of value or self worth
    or confidence or self respect, they're downgrading their solar plexus.
    So the sniffer should find that." SB14 named the measurement before the
    build: self worth, confidence, self respect and follow through, run
    through the real sniffer first. Measured, round NO: all four returned
    nothing. "I have no self worth. I feel like I have no confidence at
    all" scored zero axes. "I just do not have any self respect anymore"
    scored zero. Only the word worthless, already in this table, reached
    anything, and it reached Shame at solar by itself. This is the coverage
    hole SB13 named: "the lexicon already maps words to axes and seats, so
    this is a coverage question rather than a new mechanism." Not a new
    table, not a new scanner, an addition to this one, at the seat his own
    words name and the fetter the family already seated here carries:
    ashamed, humiliated, stupid, worthless, embarrassed and guilty are all
    Shame at solar, round GR's own ruling, and a person naming no worth, no
    confidence or no self respect is naming the same family in its own
    words rather than its adjectives. */
 'no self worth':['solar',24,'Shame'],'lost my self worth':['solar',24,'Shame'],
 'no sense of self worth':['solar',24,'Shame'],'have no self worth':['solar',24,'Shame'],
 'feel no self worth':['solar',24,'Shame'],'not worth anything':['solar',22,'Shame'],
 'do not know my own worth':['solar',20,'Shame'],'dont know my own worth':['solar',20,'Shame'],
 'do not have any self worth':['solar',22,'Shame'],'dont have any self worth':['solar',22,'Shame'],
 'do not have self worth':['solar',22,'Shame'],'dont have self worth':['solar',22,'Shame'],
 'no confidence':['solar',22,'Shame'],'zero confidence':['solar',24,'Shame'],
 'no confidence in myself':['solar',24,'Shame'],'not confident in myself':['solar',22,'Shame'],
 'no self confidence':['solar',22,'Shame'],'lack the confidence':['solar',20,'Shame'],
 'lack confidence':['solar',20,'Shame'],'do not have any confidence':['solar',22,'Shame'],
 'dont have any confidence':['solar',22,'Shame'],'do not have the confidence':['solar',22,'Shame'],
 'dont have the confidence':['solar',22,'Shame'],
 'no self respect':['solar',22,'Shame'],'lost my self respect':['solar',22,'Shame'],
 'do not respect myself':['solar',20,'Shame'],'dont respect myself':['solar',20,'Shame'],
 'cannot respect myself':['solar',20,'Shame'],'cant respect myself':['solar',20,'Shame'],
 'do not have any self respect':['solar',22,'Shame'],'dont have any self respect':['solar',22,'Shame'],
 'do not have self respect':['solar',22,'Shame'],'dont have self respect':['solar',22,'Shame'],
 /* FOLLOW THROUGH AND DISCIPLINE, the fourth term SB14 named, carries no
    stated fetter. The quote seats discipline and follow through at the
    solar plexus as POWER, the coherent direction: "if you're setting
    rituals for discipline to follow through on the things you say you're
    going to do, that's power, that's solar plexus." A person reporting the
    absence of that is evidence the seat is known and not evidence of which
    of the nine axes it is, so this is seated and left to the quarter rule
    rather than guessing a fetter nothing here authors, the same posture the
    exhaustion and overwhelm words above already take. */
 'no discipline':['solar',18],'no self discipline':['solar',18],
 'lack the discipline':['solar',18],'lack discipline':['solar',18],
 'never follow through':['solar',18],'do not follow through':['solar',18],
 'dont follow through':['solar',18],'cannot follow through':['solar',18],
 'cant follow through':['solar',18],'break my promises to myself':['solar',20],
 'let myself down again':['solar',18],'quit on myself':['solar',18],
 /* ROUND NU, HIS OWN REPORT: "I was recording a voice session and I said
    the word insecure and it didn't pick that up. It should have." Measured
    before this: "I was insecure" and "I felt insecure about it" both read
    nothing at all. The word was not missing a seat, it was missing
    entirely: not in this table under any spelling, and "Insecurity" exists
    only as one of Deflector's own three cue words in SAB33
    (engine/data/canon.js), which the canon pass never reads into this
    table, the same gap the ordinary-sentence block at the top of this file
    exists to close for other common words. Seated with the family round NO
    already built for exactly this register, low self worth and self doubt,
    solar plexus, Shame: ashamed, humiliated, stupid, worthless,
    embarrassed and guilty are already there. */
 insecure:['solar',22,'Shame'],insecurity:['solar',22,'Shame'],
 /* ============================================================
    ROUND OU, HIS OWN REPORT, dictated into the journal: "I had a
    confrontation with my boss" and "I was really irritated by him" both read
    nothing at all. Reproduced on the build in hand: zero hits, zero
    imprints, for both. The table had the loud verbs (shouted, yelled, snapped,
    lashed out) and the loud adjectives (furious, livid, seething) and none of
    the ordinary middle of anger, which is the part people actually dictate.

    THE IRRITATION FAMILY, solar plexus, Anger STATED. Stated, because every
    word here names the axis itself, the way furious does, so the imprint
    comes back named and not inferred. The amount is read off the Anger family
    the table already carries, in three steps, and the gate asserts the rule
    rather than the number:
      16  the floor of the Anger family, defensive. irritated and annoyed are
          the mildest thing a person says about anger, so they take the floor
          and never more.
      18  angry. frustrated, aggravated, fed up and pissed off are what
          people say when they mean angry and are being casual about it.
      24  furious. infuriated and enraged are its plain synonyms.
    livid, seething, resentful and rage were already here and are untouched. */
 irritated:['solar',16,'Anger'],irritating:['solar',16,'Anger'],irritation:['solar',16,'Anger'],
 irritates:['solar',16,'Anger'],irritable:['solar',16,'Anger'],irked:['solar',16,'Anger'],
 annoyed:['solar',16,'Anger'],annoying:['solar',16,'Anger'],annoyance:['solar',16,'Anger'],
 annoys:['solar',16,'Anger'],
 'got on my nerves':['solar',16,'Anger'],'gets on my nerves':['solar',16,'Anger'],
 'on my nerves':['solar',16,'Anger'],
 frustrated:['solar',18,'Anger'],frustrating:['solar',18,'Anger'],frustration:['solar',18,'Anger'],
 frustrates:['solar',18,'Anger'],aggravated:['solar',18,'Anger'],aggravating:['solar',18,'Anger'],
 'fed up':['solar',18,'Anger'],'pissed off':['solar',18,'Anger'],pissed:['solar',18,'Anger'],
 'ticked off':['solar',18,'Anger'],'mad at':['solar',18,'Anger'],
 'pissing me off':['solar',18,'Anger'],'pisses me off':['solar',18,'Anger'],
 infuriated:['solar',24,'Anger'],infuriating:['solar',24,'Anger'],enraged:['solar',24,'Anger'],
 outraged:['solar',24,'Anger'],fuming:['solar',24,'Anger'],
 /* AGGRESSION AND CONFRONTATION, ACTS AND NOT FEELINGS, solar plexus, no
    stated fetter. The seat is where the table already puts every aggression
    verb, and the fetter is left to the quarter rule, the way shouted and
    snapped are, because "I had an argument" says what happened and not which
    axis it was. 22 is snapped: a conflict named with no stated force.
    Precision over recall: fight, fought and confront are ordinary words for
    other things (fight for it, fought cancer, confront my fear), so the fight
    entries are the ones that name a person to be fought with, and nothing
    here fires on the bare verb fight. */
 confrontation:['solar',22],confrontations:['solar',22],confronted:['solar',22],
 argument:['solar',22],arguments:['solar',22],argued:['solar',22],arguing:['solar',22],
 clashed:['solar',22],'got into it with':['solar',22],'got into it':['solar',22],'a fight':['solar',22],
 'fight with':['solar',22],'fought with':['solar',22],'fighting with':['solar',22],
 'raised my voice':['solar',22],'swore at':['solar',22],'screaming match':['solar',26],
 'shouting match':['solar',26],'told him off':['solar',22],'told her off':['solar',22],
 'told them off':['solar',22],'stood up to':['solar',18],
 aggression:['solar',22],aggressive:['solar',20],hostile:['solar',20],hostility:['solar',20],
 /* ROUND OY, HIS SCREENSHOT OF THE BUILD BEFORE THIS ONE. The entry read
    "I had a really ******* rough day today. I had a confrontation with my
    boss. I was really irritated by him. ... It made me depressed. Umm, it made
    me irritable. It made me frustrated. And. It made me mad." and the panel
    said it kept one word. He named what was missing: depressed, mad,
    irritable, frustrated, irritated, and the confrontation. The anger ones are
    above. These are the rest of what he named.

    SAD, AT THE HEART, WHERE sad AND miserable ALREADY SIT, and named by
    ADJ2CHG as sadness, the way those two are, and Sad STATED as well, for the
    reason parseStory's seat rule gives: a stated fetter governs the seat it
    sits at, so the heart of an entry that is also angry elsewhere is not
    handed Anger addresses for the depression. depressed and depression weigh
    22, which is miserable: it is the same register, a state and not a moment,
    and sad at 16 would under read it while hopeless at 26 would read it as the
    end of the family. unhappy, sadness, sadder and saddened are sad, 16. The
    three ways people say down and low are phrases and not words, because
    down and low are ordinary words for places and prices, and a phrase that
    needs a feel in front of it is the only form that is about a person.
    mad is Anger, 18, which is angry: in the owner's own speech it is the
    plain word for it, and it is read as anger and not as the other mad
    because the table has no entry for the other. Where a person means mad
    about somebody, mad at and mad about are the ones that name a person to be
    angry with, and only mad at is here. */
 depressed:['heart',22,'Sad'],depression:['heart',22,'Sad'],
 unhappy:['heart',16,'Sad'],sadness:['heart',16,'Sad'],sadder:['heart',16,'Sad'],saddened:['heart',16,'Sad'],
 'feel down':['heart',16,'Sad'],'feeling down':['heart',16,'Sad'],'felt down':['heart',16,'Sad'],'feels down':['heart',16,'Sad'],
 'feel low':['heart',16,'Sad'],'feeling low':['heart',16,'Sad'],'felt low':['heart',16,'Sad'],
 mad:['solar',18,'Anger'],angrier:['solar',18,'Anger'],angriest:['solar',18,'Anger'],
 angered:['solar',18,'Anger'],fury:['solar',24,'Anger']};
var ADJ2CHG={
 nervous:'anxiety',anxious:'anxiety',tense:'anxiety',
 unheard:'silence',voiceless:'silence',choked:'silence',swallowed:'silence',
 doubtful:'doubt',uncertain:'doubt',suspicious:'doubt',distrustful:'doubt',
 numb:'apathy',flat:'apathy',blank:'apathy',indifferent:'apathy',hollow:'apathy',
 unmoved:'apathy',detached:'apathy',uncaring:'apathy',
 apart:'separation',disconnected:'separation',outside:'separation',adrift:'separation',
 scared:'fear',afraid:'fear',frightened:'fear',terrified:'fear',panicked:'fear',
 froze:'fear',frozen:'fear',paralyzed:'fear',paralysed:'fear',shaking:'fear',unsafe:'fear',dread:'fear',bracing:'fear',
 angry:'anger',furious:'anger',defensive:'anger',blamed:'anger',
 /* round OU, the irritation family names the Anger axis itself, the same fact
    LEX states in its third element. Both are written, as the shame family's
    are, because an imprint is named only when ADJ2CHG or a stated fetter says
    so, and a word that did only one of them came back half named. */
 irritated:'anger',irritating:'anger',irritation:'anger',irritates:'anger',irritable:'anger',
 irked:'anger',annoyed:'anger',annoying:'anger',annoyance:'anger',annoys:'anger',
 frustrated:'anger',frustrating:'anger',frustration:'anger',frustrates:'anger',mad:'anger',
 angrier:'anger',angriest:'anger',angered:'anger',fury:'anger',
 depressed:'sadness',depression:'sadness',unhappy:'sadness',sadness:'sadness',sadder:'sadness',
 saddened:'sadness',
 aggravated:'anger',aggravating:'anger',pissed:'anger',infuriated:'anger',
 infuriating:'anger',enraged:'anger',outraged:'anger',fuming:'anger',
 ashamed:'shame',humiliated:'shame',embarrassed:'shame',guilty:'shame',
 stupid:'shame',worthless:'shame',inadequate:'shame',
 sad:'sadness',lonely:'sadness',grieving:'sadness',hurt:'sadness',rejected:'sadness',
 abandoned:'sadness',unloved:'sadness',heartbroken:'sadness',miserable:'sadness',
 crushed:'sadness',hopeless:'sadness',defeated:'sadness',
 restless:'joy',craving:'joy',empty:'joy',hungry:'joy',
 addicted:'joy',distracted:'joy',obsessed:'joy',
 silent:'shame',dismissed:'shame'};

/* the idioms. an idiom outranks its own words, because a statement can carry
   no feeling word at all and still be a report. */
/* ============================================================
   HOW MUCH, SAID IN THE WORD BEFORE IT. AZ6: the scanner read "a little
   tense", "tense" and "extremely tense" as the same 16, because a degree word
   is not in LEX and scanStory skipped it. The owner's ruling is that these
   differ by orders of magnitude, and the fitted bell can only pull harder on
   weight the words actually put there.

   Ported from the desktop's MOD table (atuned/src/30_lexicon, line 244), the
   degree adverbs only, with its factors unchanged. Seven it carries from its
   burnout entry are left out, barely, persistent, dull, constant,
   catastrophic, total and crushing: they are words with a meaning of their
   own rather than a degree, and "barely" at 1.5 would scale "barely anxious"
   up. Entirely, from the same entry, is a degree and is kept.

   Applied only when the degree word stands immediately before the hit, which
   is narrower than the desktop's anywhere earlier in the segment: "so" is a
   degree in "so tense" and a conjunction in "so I froze", and adjacency is
   the one rule that tells them apart without a parser. A factor under 1 is
   still a hit; the word was written. */
var LEXMOD={slightly:0.6,'a little':0.6,'kind of':0.7,somewhat:0.7,fairly:0.9,
 quite:1.2,so:1.35,really:1.4,very:1.4,deeply:1.6,totally:1.7,absolutely:1.7,
 entirely:1.7,extremely:1.8,completely:1.8,utterly:1.8,
 /* ROUND OU. Two plain degree words the owner's own speech uses and the
    table did not carry, each taking the factor of the word it means: "a bit"
    is "a little", "pretty" is "fairly". And the profane intensifiers, which
    are degree adverbs and read as degree adverbs: "fucking furious" is
    "really furious" said louder, and a person dictating it is not reporting
    a different feeling. They take 1.4, the factor of really, the commonest
    spoken intensifier in the table, and no more. There is no labelled set to
    say a swear is worth more than really, so it is not priced as though it
    were. See SWEAR_INT, which names them for the code that has to step over
    them to find the degree word before them. */
 'a bit':0.6,pretty:0.9,
 fucking:1.4,fuckin:1.4,fricking:1.4,frickin:1.4,freaking:1.4,freakin:1.4,effing:1.4,
 friggin:1.4,bloody:1.4,goddamn:1.4,goddamned:1.4,damn:1.4,damned:1.4,
 motherfucking:1.4};
/* THE PROFANE INTENSIFIERS, and the one thing that makes them different from
   a degree word: they may stand between a real degree word and the word it
   scales, "really fucking furious". scanStory steps over them to find it. */
var SWEAR_INT=['fucking','fuckin','fricking','frickin','freaking','freakin','effing',
 'friggin','bloody','goddamn','goddamned','damn','damned','motherfucking'];
/* ============================================================
   MASKED PROFANITY, AND THE RESTORING MAP. Round OU and round OV.

   Chrome's speech recogniser returns a swear with its middle replaced by
   asterisks, f***ing, sh*t, b*tch, and the Web Speech interface has no switch
   to stop it. None of this product's code makes them: the transcript is read
   off the recogniser's result and appended as it comes (ui/storyui.js stMic),
   and nothing in the repository holds a table of words to star. The owner
   asked for the asterisks gone, so a masked token is mapped back to the word
   that was said.

   HOW. The recogniser keeps the letters it does not mask and puts one
   asterisk for each it does. So a token fits a word when it is the same length
   and every letter that is not an asterisk is the same letter in the same
   place. f**k fits fuck and nothing else in the list. d*** fits damn and dick,
   and that is the ambiguity, named and not hidden: SWEAR_WORDS is ordered most
   common first and the first fit is taken, so d*** restores to damn. A token
   that fits nothing is left exactly as the recogniser wrote it, because
   inventing a word is worse than leaving a star. swearRestore says which tokens
   had more than one fit, so a caller can show or log them.

   The same function is the sniffer's fallback for text that arrives with the
   masks already in it (typed, pasted, or an entry kept before this change):
   normMap reads a masked token as the word it restores to, so f***ing is the
   intensifier fucking whether or not anything restored it first. */
var SWEAR_WORDS=['fuck','fucking','shit','fucked','shitty','bullshit','damn','damned',
 'goddamn','goddamned','ass','asshole','bitch','crap','crappy','pissed','piss','dick',
 'bastard','fucker','fuckin','shitting','dumbass','motherfucker','motherfucking',
 'cunt','dickhead','bitches','fucks','shits','pissing'];
function swearCands(tok){
 var t=String(tok||'').toLowerCase();
 if(t.indexOf('*')<0||!/^[a-z*]+$/.test(t))return [];
 /* A TOKEN OF STARS ALONE, round OY. The owner's own screenshot of the build
    that shipped before this change: "I had a really ******* rough day". Seven
    stars and no letter, because the recogniser masked the whole word and not
    its middle. The only thing left to fit is the length, so a star run of four
    or more is restored to the most common word in the list of that length,
    which for seven is fucking, and is reported as ambiguous whenever a second
    word has the same length. Under four, a run of stars is a rule or a
    footnote and is left alone. */
 if(/^\*+$/.test(t)){
  if(t.length<4)return [];
  return SWEAR_WORDS.filter(function(w){return w.length===t.length;});}
 if(t.length<2||!/^[a-z]/.test(t))return [];
 return SWEAR_WORDS.filter(function(w){
  if(w.length!==t.length)return false;
  for(var i=0;i<t.length;i++)if(t.charAt(i)!=='*'&&t.charAt(i)!==w.charAt(i))return false;
  return true;});}
/* where the masked tokens are in a text. A token is a run of letters and
   asterisks that starts on a letter, with a boundary before it, and holds at
   least one asterisk. "*angry*" and "angry**" are markdown and are not read as
   masks, because a mask never starts on its asterisk and, when it ends on
   one, has to fit a word of that length. */
var SWEAR_TOK=/(^|[^A-Za-z*'])([A-Za-z][A-Za-z*]*\*[A-Za-z*]*|\*{4,})(?![A-Za-z*])/g;
function swearFind(text){
 var t=String(text||''), out=[], m;
 SWEAR_TOK.lastIndex=0;
 while((m=SWEAR_TOK.exec(t))){
  var s=m.index+m[1].length, tok=m[2], c=swearCands(tok);
  if(c.length)out.push({s:s,e:s+tok.length,tok:tok,to:c[0],alts:c.slice(1)});
  SWEAR_TOK.lastIndex=s+tok.length;}
 return out;}
/* THE RESTORING MAP. Pure, host free, and it returns what it changed: the
   text with each masked token written as the word it fits, and a row per
   swap carrying the token, the word, and the other words it could have been.
   The case of the first letter is kept, so a sentence that opened on F***ing
   opens on Fucking. */
function swearRestore(text){
 var t=String(text||''), swaps=swearFind(t), out='', at=0;
 swaps.forEach(function(x){
  var w=x.to;
  if(/[A-Z]/.test(x.tok.charAt(0)))w=w.charAt(0).toUpperCase()+w.slice(1);
  out+=t.slice(at,x.s)+w; at=x.e;
  x.at=x.s; x.word=w;});
 out+=t.slice(at);
 return {text:out, swaps:swaps.map(function(x){
  return {from:x.tok,to:x.word,at:x.at,ambiguous:x.alts.length>0,alts:x.alts};})};}
/* ============================================================
   THE FRAME TABLES, round OU. What a sentence is ABOUT, as against how hot
   its words are. Read by storyFrame in engine/frame.js; held here, with the
   vocabulary, so the lexicon version stamp covers them and an entry can say
   whether it was framed by the tables it is being read by now.

   WHY A FRAME AND NOT A HIT. "I had a really rough day" carries a state of the
   whole entry, bad and heavy, and no seat. The sniffer places charge at seats
   and the product has no address for "the day". Making a hit of it would mean
   inventing a seat, which is the defect parseStory was fixed for. So a day
   quality is an entry level reading, valence and load, which the frame
   reports and the question chain uses, and which moves no charge on its own.

   EVERY AMOUNT HERE IS ANCHORED TO A WORD THE TABLE ALREADY CARRIES, and the
   gate asserts the anchor and not the number:
     DAYQ_AMT 1  16, the Anger family floor, defensive. A mild day word weighs
                 what the mildest anger word weighs.
     DAYQ_AMT 2  22, miserable, which the table already seats as the one day
                 word it carries.
   ============================================================ */
var DAYQ_NOUN=['day','days','morning','afternoon','evening','night','week','weekend',
 'shift','month','year'];
/* word: [valence, tier]. valence -1 bad, +1 good, 0 neither. tier 1 mild, 2
   strong, and a tier is read only on a bad word: a good day has no load. long,
   hard and exhausting are here as LOAD and not as verdict: a long day is not
   a miserable one, and it still costs. */
var DAYQ_ADJ={rough:[-1,1],bad:[-1,1],hard:[-1,1],long:[-1,1],tough:[-1,1],
 stressful:[-1,1],lousy:[-1,1],crappy:[-1,1],off:[-1,1],heavy:[-1,1],
 horrible:[-1,2],awful:[-1,2],terrible:[-1,2],miserable:[-1,2],shitty:[-1,2],
 brutal:[-1,2],dreadful:[-1,2],worst:[-1,2],exhausting:[-1,2],draining:[-1,2],
 disastrous:[-1,2],
 good:[1,0],great:[1,0],lovely:[1,0],nice:[1,0],wonderful:[1,0],amazing:[1,0],
 easy:[1,0],peaceful:[1,0],productive:[1,0],fun:[1,0],calm:[1,0],beautiful:[1,0],
 okay:[0,0],ok:[0,0],fine:[0,0],alright:[0,0],normal:[0,0],quiet:[0,0]};
var DAYQ_AMT={1:16,2:22};
/* an adjective and a day noun that are a greeting, a farewell or a holiday and
   not a verdict on a day. Measured: "I lost the long weekend" read as a bad
   day and "Good morning" opening a dictation read as a good one. */
var DAYQ_IDIOM=['good morning','good night','good evening','good afternoon','long weekend',
 'happy days','nice day'];
/* a noun that says the day was bad when a day is called it: "today was a
   disaster". Each of these is the word for a thing going wrong, not a size. */
var DAYQ_NOUNQ={disaster:2,nightmare:2,mess:1,shitshow:2,hell:2};
/* the verbs a day takes. sucked is plain and mild; the phrases are what
   people say when a day went wrong and they will not say how. */
var DAYQ_VERB={sucked:1,sucks:1};
var DAYQ_PHRASE=[['one of those days',1],['not my day',1],['went wrong',1],['went badly',1],
 ['went to shit',2]];
/* the words a day is the subject of in "today was rough" */
var DAYQ_SUBJ=['today','yesterday','tonight','day','morning','afternoon','evening','night',
 'week','weekend','shift','work','school'];
var DAYQ_BE=['was','is','were','are','been','be','has','had','have','being','not',
 "wasn't","isn't","hasn't","hadn't","weren't","aren't"];
/* NEGATION, READ AS THE OWNER'S OWN WORDS DO. A negated bad word is unknown,
   not good, so "not a bad day" reads as nothing. A negated good word is the
   other way round: "not a good day" is a bad day, and says it. */
var FRAME_NEG=['not','no','never','nobody','none','cannot','cant',"can't",'didnt',"didn't",
 'dont',"don't",'doesnt',"doesn't",'wont',"won't",'wasnt',"wasn't",'werent',"weren't",
 'isnt',"isn't",'arent',"aren't",'havent',"haven't",'hasnt',"hasn't",'couldnt',"couldn't",
 'wouldnt',"wouldn't",'hardly','barely','without'];
/* THE OTHER PARTY. A role, and the relation it is in, which is what makes
   authority a recorded fact and not an inference. The relations are plain:
   above the person, a partner, level with them, below them or in their care,
   and a person who pays or is paid. */
var ROLES={boss:'authority',manager:'authority',supervisor:'authority',teacher:'authority',
 professor:'authority',principal:'authority',landlord:'authority',director:'authority',
 ceo:'authority',coach:'authority',lecturer:'authority',headmaster:'authority',
 mother:'authority',father:'authority',mom:'authority',dad:'authority',mum:'authority',
 parent:'authority',parents:'authority',
 partner:'partner',husband:'partner',wife:'partner',boyfriend:'partner',
 girlfriend:'partner',fiance:'partner',spouse:'partner',ex:'partner',
 friend:'peer',friends:'peer',coworker:'peer',colleague:'peer',colleagues:'peer',
 teammate:'peer',roommate:'peer',neighbour:'peer',neighbor:'peer',brother:'peer',
 sister:'peer',cousin:'peer',classmate:'peer',
 son:'dependent',daughter:'dependent',kid:'dependent',kids:'dependent',child:'dependent',
 children:'dependent',baby:'dependent',student:'dependent',students:'dependent',
 client:'client',customer:'client'};
/* the pronouns a person uses for somebody who is not them, and the form each
   takes as the subject of a question: him is asked about as he. */
var PRON_OTHER={him:'he',her:'she',them:'they',he:'he',she:'she',they:'they'};
/* AN ACT. A word or phrase that is something a person did to or with somebody,
   which belongs in the acting and behaving channels of the release and not in
   feeling. The channel names are C3_VERB's own, and the gate holds this list
   to them. Every key is also a LEX key, so an act is read twice, as charge by
   the sniffer and as an act by the frame, by one vocabulary. */
var ACTS=['confrontation','confrontations','confronted','argument','arguments','argued',
 'arguing','clashed','got into it with','got into it','a fight','fight with','fought with',
 'fighting with','raised my voice','swore at','screaming match','shouting match',
 'told him off','told her off','told them off','stood up to','yelled','shouted',
 'screamed','snapped','blew up','lashed out','slammed','lost it'];
var ACT_CHANNELS=['acting','behaving'];
/* the acts that name a kind of event and not a thing somebody did. "I had a
   confrontation" says there was one; it does not say what the person did, so
   it does not answer what did you do. */
var ACT_NOUN=['confrontation','confrontations','argument','arguments','a fight','fight with',
 'screaming match','shouting match'];
/* the irregular pasts people actually write. -ed ends a regular one. */
var PAST_IRR=['said','told','took','gave','made','went','came','saw','left','put','ran',
 'sent','brought','found','lost','kept','ate','drank','woke','broke','fell','wrote',
 'spoke','heard','stood','sat','threw','hit','cut','bought','paid','met','drove',
 'won','forgot','shut','called','began','quit','slept','pulled','pushed','grabbed'];
/* the verbs that carry no event: state, possession, feeling, wanting. A
   sentence made of these says how things were and not what happened. */
var PAST_LIGHT=['was','were','had','felt','seemed','wanted','needed','looked','became',
 'thought','believed','used','supposed','hoped','wished','figured','noticed',
 'realised','realized','decided','tried','started','got'];
/* the cues for the other four of the six release channels, as the words a
   person uses when what they report is a thought, a belief or a perception.
   Matched whole word on the normalised copy. */
var CHAN_CUE={thinking:['i thought','i kept thinking','i figured','i wondered',
  'i told myself','in my head','i was thinking'],
 perceiving:['i saw','i noticed','i heard','i could tell','it looked like','i watched',
  'i realised','i realized'],
 believing:['i believe','i believed','i must','i have to','i should','i always',
  'i never','nobody ever']};
var PHRASES=[
 [['wrap myself in a blanket','pretend the world hit pause','pretend the world would stop',
   'want to disappear','wish i could disappear','not be here','not exist',
   'pull the covers over','stay in bed all day','never come out','hide from everyone',
   'crawl into a hole','shut the door and not','be left alone forever'],
   'heart',26,'wanting to disappear'],
 [['the mountain just rolls right over','mountain rolled over me','i am tire tracks',
   'definitely tire tracks','rolled right over me','flattened me','ran me over',
   'what is the point of any of it','nothing i do matters','it never gets better',
   'i cannot keep doing this','i have nothing left','there is nothing left of me',
   'running on empty','i am done'],
   'heart',28,'despair'],
 [['i miss who i used to be','i do not recognise myself','i do not recognize myself',
   'lost myself somewhere','the person i was is gone','grieving something',
   'i will never get that back','it is too late for me'],
   'heart',26,'grief'],
 [['just want to get through','get through the day','one foot in front',
   'going through the motions','on autopilot','like an automaton',
   'nodded like','stared at his','stared at her','have the energy','no energy left'],
   'crown',22,'resignation'],
 [['could not stop','cant stop','can not stop','cannot stop','kept checking','keep checking'],
   'sacral',18,'compulsion'],
 [['stayed quiet','said nothing','kept my mouth','did not say','didnt say','bit my tongue'],'throat',20,'silenced'],
 [['could not say no','couldnt say no','said yes when','agreed anyway'],'throat',22,'over-giving'],
 [['do not trust','dont trust','cannot trust'],'eye',20,'distrust'],
 [['nobody says what','nobody means','everyone is lying','no one is honest'],'eye',18,'suspicion'],
 [['felt nothing','feel nothing','feeling nothing','numb to'],'crown',26,'frozen'],
 [['cannot remember the last','cant remember what i want','do not know what i want'],'crown',22,'forgotten'],
 [['held my position','would not back down','refused to admit','knew i was wrong'],'solar',20,'rigidity'],
 [['put it off','putting it off','keep postponing','waiting to feel ready'],'root',18,'avoidance'],
 [['is never finished','never finished','never good enough','still wrong','redid it',
   'ever finished'],'sacral',20,'perfectionism'],
 [['doing all of it alone','on my own','no one helps','carrying it alone'],'heart',22,'isolation'],
 [['carried it home','took it home','could not leave it','carried her','carried his',
   'home with me'],'heart',18,'over-merging'],
 [['gave more than i had','gave more than','and then resented','resented it'],'solar',22,'resentment'],
 [['have been dreading','been dreading','dreading it','dread it'],'root',22,'dread'],
 [['have not slept','havent slept','not sleeping','cannot sleep'],'root',20,'hypervigilance'],
 [['hated myself','disgusted with myself','ashamed of myself'],'throat',24,'self-attack'],
 [['do not show anyone','dont show anyone','not until it is perfect'],'sacral',18,'concealment'],
 [['find out i am','find out im','they will know','see through me'],'root',24,'exposure']];

/* ============================================================
   WHAT AN ENTRY IS, WHERE IT CAME FROM, AND WHAT IT MAY ASSERT.

   The three tables above were authored and nothing recorded their provenance,
   so the repository could not answer the owner's own question: does the
   sniffer have the logic supplied by the book. Measured, the answer was no in
   two directions at once. Nine of the nine axes the instrument scores, and
   seven of the seven cue words the thirty three saboteurs are defined by, were
   not words the scanner could find: one of nine and zero of seven resolved.
   And of the 192 authored words, 87 appear anywhere in the book and 105 do
   not, so more than half the vocabulary had no stated source at all.

   Neither of those is fixed by typing more words in. They are fixed by an
   entry knowing what it is. So an entry now has a schema, a source, and a
   validator that refuses rather than clamps, and every entry that is not hand
   authored is DERIVED by a named pass from a table that already has an owner.

   An entry is [seat, amount, fetter]. Positions are named below because a
   table read by index is a table nobody can search.

     seat     WHERE in the body the charge is held. One of LEX_SEATS. Always
              asserted, because the scanner genuinely knows it: the table says
              so and nothing was inferred to get there.
     amount   HOW MUCH, on the authored 12 to 28 curve. Signed: a coherent
              entry subtracts. parseStory divides by 3 and applyStory scales
              by 0.35, so this number is not a charge and must never be read
              as one.
     fetter   WHICH of the nine axes, and it is OPTIONAL BY DESIGN. Present
              means the word named the axis itself and the reading may say so.
              Absent means the seat is known and the axis is not, and
              parseStory will mark the imprint inferred. That flag is the
              whole difference between evidence and an accusation, and the
              product has already shipped the accusation once.

   WHAT AN ENTRY MAY NEVER ASSERT: a saboteur, an architecture, a diagnosis, a
   verdict, or a person. A word is evidence that a word was written. Every
   claim past that is made downstream, by a named stage, and says which it is.
   ============================================================ */
var LEX_SEAT=0, LEX_AMT=1, LEX_FET=2;
var LEX_SEATS=['root','sacral','solar','heart','throat','eye','crown','coherent'];
/* WHERE AN ENTRY CAME FROM. This list is the spec, not a summary of one.
   A source not on it is refused by name, including by whoever adds a helpful
   one later, because the gate asserts the set exactly.
     authored  hand written. the 192 above. no stated source and that is the
               open question, not a defect to be hidden.
     canon     derived from a canon table that already has an owner: the nine
               axes, and the seats and fetters CHG2SEAT and CHG2FET already
               assign them. No new number is invented by this pass.
     fold      an ordinary surface form of a key already present, generated by
               a stated rule and admitted only where a named corpus confirms
               the form is real writing. */
/* A FOURTH SOURCE, DECLARED. `composite` is a word whose reading is two
   fetters rather than one, seated by the pass at the bottom of sniff.js off the
   unanimous seat and family floor of the members already in the table. It is a
   separate source from `canon` because its derivation is different and a
   reviewer asking where an entry came from must get one answer rather than a
   family of them. The validator refused every composite entry until this line
   existed, which is the validator working: a new provenance is declared here or
   it does not reach the table. */
/* A FIFTH, round PA: `wheel`, a word added by lexWheel in engine/wheel.js off
   the owner's feelings wheel, its charge from the family and its seat from
   CHG2SEAT and its amount from the ring, each derived and none typed. It is
   its own source because its derivation is its own, and a reviewer asking where
   an entry came from gets one answer. */
var LEX_SRC=['authored','canon','fold','composite','wheel'];
var LEX_AMT_MAX=30;
/* key -> {src, from, rule, cite}. Covers LEX exactly, in both directions, and
   the gate asserts that, because a provenance table with holes in it is worse
   than none: it reads as though everything in it were sourced. */
var LEXMETA={};
Object.keys(LEX).forEach(function(k){
 LEXMETA[k]={src:'authored',from:null,rule:null,cite:null};});
var CHGMETA={};
Object.keys(ADJ2CHG).forEach(function(k){
 CHGMETA[k]={src:'authored',from:null,rule:null,cite:null};});

/* THE BOUNDARY, in validateProfile's and obValidate's posture: refuse by name,
   never clamp, never accept in silence. A clamped amount reads back as a
   reading the author never wrote. */
function lexKeyOk(k){
 /* exactly the surface forms scanStory's normalisation can produce: lowercase
    letters, apostrophes and single interior spaces. A key with a capital or a
    comma in it can never match anything and is a dead row that looks live. */
 return typeof k==='string' && /^[a-z']+( [a-z']+)*$/.test(k);}

function lexRefuse(k,seat,amt,fet){
 var errs=[];
 if(!lexKeyOk(k)) errs.push('the key '+JSON.stringify(k)+' is not a form the scanner can ever match');
 if(LEX_SEATS.indexOf(seat)<0) errs.push(k+' names the seat '+seat+', which is not one of the '+LEX_SEATS.length);
 if(typeof amt!=='number'||amt!==Math.round(amt)||amt===0||Math.abs(amt)>LEX_AMT_MAX)
  errs.push(k+' carries the amount '+amt+', and an amount is a non zero integer no further than '+LEX_AMT_MAX+' from zero');
 if((amt<0)!==(seat==='coherent'))
  errs.push(k+' is seated at '+seat+' with amount '+amt+', and only a coherent entry subtracts');
 if(fet!=null&&CHARGES.indexOf(fet)<0)
  errs.push(k+' states the child emotion '+fet+', which is not one of the nine axes');
 if(LEX[k]&&LEX[k][LEX_SEAT]!==seat)
  errs.push(k+' is already seated at '+LEX[k][LEX_SEAT]+' and this would move it to '+seat);
 return errs;}

/* ONE ENTRY. Already present with the same seat is a no op and says so, so a
   pass can be re-run without silently doubling the table. */
function lexAdd(k,seat,amt,fet,meta){
 var errs=lexRefuse(k,seat,amt,fet);
 if(errs.length) return {ok:false,why:errs[0],errs:errs};
 if(LEX_SRC.indexOf(meta&&meta.src)<0)
  return {ok:false,why:'the source '+(meta&&meta.src)+' is not one of '+LEX_SRC.join(', '),errs:[]};
 if(LEX[k]) return {ok:true,already:true};
 LEX[k]=fet!=null?[seat,amt,fet]:[seat,amt];
 LEXMETA[k]={src:meta.src,from:meta.from||null,rule:meta.rule||null,cite:meta.cite||null};
 return {ok:true,already:false};}

/* AND THE CHARGE NAME, which is the other half of the same entry.
   ADJ2CHG is the surface form to axis name table. Its name says adjective and
   its job is wider than that: it is what makes an imprint NAMED rather than
   inferred, and a person writes the noun as often as the adjective. Renaming
   it touches the export contract and two tools, so the rename is named and
   deferred rather than done in the same pass as the vocabulary. Nothing may be
   added to it except through here. */
function chgAdd(k,chg,meta){
 if(!lexKeyOk(k)) return {ok:false,why:'the key '+JSON.stringify(k)+' is not a matchable form'};
 if(typeof chg!=='string'||!chg) return {ok:false,why:k+' names no charge'};
 if(ADJ2CHG[k]&&ADJ2CHG[k]!==chg)
  return {ok:false,why:k+' already names '+ADJ2CHG[k]+' and this would move it to '+chg};
 if(LEX_SRC.indexOf(meta&&meta.src)<0)
  return {ok:false,why:'the source '+(meta&&meta.src)+' is not one of '+LEX_SRC.join(', ')};
 if(ADJ2CHG[k]) return {ok:true,already:true};
 ADJ2CHG[k]=chg;
 CHGMETA[k]={src:meta.src,from:meta.from||null,rule:meta.rule||null,cite:meta.cite||null};
 return {ok:true,already:false};}

/* ============================================================
   PASS ONE, THE FOLD. And the reason it is a list and not a stemmer.

   Measured. 29 of 63 ordinary inflections of words already in the table did
   not resolve, so the table was written in one form and people write in
   another. The obvious fix is a stemmer. It was prototyped and it is the wrong
   instrument here, and the numbers are the argument:

   The fourteen rules below, run over the 145 single word keys, generate 438
   forms. Of those 438, thirty one are confirmed by a corpus this repository
   actually holds. Seven percent. The other 407 are strings like ashams and
   anxiousing: harmless, because they never occur, and corrosive, because a
   lexicon nobody can read is a lexicon nobody can audit, and this product
   shows a person why.

   Worse, three of the thirty one confirmed forms are real English words with a
   different meaning, and two of those three fold off COHERENT keys, which
   subtract. A stemmer would have had the word contents lowering somebody's
   reading. A false positive in a somatic reading costs more than a miss, so
   the refusals are by name, in the table below, with the reason.

   So: the rules stay in the engine, because they are pure and tiny and the
   gate uses them to prove that every admitted form is reachable from a real
   key. The corpus stays out, because the engine may not read a file. What
   crosses the boundary is the confirmed list, and proto/sniffer/ holds the
   tool that produced it and re-runs it when a corpus grows.

   THE CORPUS, NAMED. index.html, the owner's own book, 117,716 words and
   7,667 distinct surface forms, plus the fourteen persona voices the product
   ships. A form neither confirms is not admitted, because admitting it is an
   unmeasured claim. When the record store exists there will be a third and
   much better corpus, and this list grows by re-running the tool rather than
   by anybody's judgement about what a person might write.

   A FOLD CHANGES THE SURFACE FORM AND NOTHING ELSE. Same seat, same amount,
   same stated fetter, same charge name. The gate asserts all four, so a fold
   can never be the back door through which a new reading arrives.
   ============================================================ */
var LEX_FOLD_RULES=[
 ['s',   function(k){return !/(s|x|z|ch|sh|y)$/.test(k);},                   function(k){return k+'s';}],
 ['es',  function(k){return /(s|x|z|ch|sh)$/.test(k);},                      function(k){return k+'es';}],
 ['ies', function(k){return /[^aeiou]y$/.test(k);},                          function(k){return k.slice(0,-1)+'ies';}],
 ['ed',  function(k){return /[^ey]$/.test(k)&&!/(ed|ing|ness)$/.test(k);},   function(k){return k+'ed';}],
 ['d',   function(k){return /e$/.test(k);},                                  function(k){return k+'d';}],
 ['ied', function(k){return /[^aeiou]y$/.test(k);},                          function(k){return k.slice(0,-1)+'ied';}],
 ['ing', function(k){return /[^ey]$/.test(k)&&!/(ed|ing)$/.test(k);},        function(k){return k+'ing';}],
 ['eing',function(k){return /e$/.test(k);},                                  function(k){return k.slice(0,-1)+'ing';}],
 ['ped', function(k){return /[^aeiou][aeiou][pgmnt]$/.test(k);},             function(k){return k+k.slice(-1)+'ed';}],
 ['ping',function(k){return /[^aeiou][aeiou][pgmnt]$/.test(k);},             function(k){return k+k.slice(-1)+'ing';}],
 /* backward, off a past participle the table already holds */
 ['V',   function(k){return /[a-z]{3}ed$/.test(k);},                         function(k){return k.slice(0,-2)+'ing';}],
 ['Vs',  function(k){return /[a-z]{3}ed$/.test(k);},                         function(k){return k.slice(0,-2)+'s';}],
 ['Vy',  function(k){return /[a-z]{2}ied$/.test(k);},                        function(k){return k.slice(0,-3)+'ying';}],
 ['ness',function(k){return /[a-z]{4}$/.test(k)&&!/(ness|ion|ity|ing|ed|s)$/.test(k);},function(k){return k+'ness';}]];

/* THE ALLOW LIST. Twenty seven forms. Every one is generated by a rule above
   from a key above, and confirmed by the named corpus. The gate asserts both,
   so a form hand typed in here with no reachable base is refused. */
var LEX_FOLD_OK=['abandoning','betrays','calmed','calming','clenching','dismissing',
 'draining','drains','flattens','funerals','hurts','interrupting','interrupts',
 'isolating','losses','numbness','overwhelming','rejecting','rejects','resting',
 'screaming','settling','snapping','tensed','terrifying','tightness','yelling'];

/* THE REFUSE LIST, and read this before adding to the one above. Each of these
   IS generated by a rule and IS confirmed by the corpus, and each is refused
   because the form is a different word in ordinary use. Two of the four fold
   off coherent keys, where a false positive lowers a reading rather than
   raising it, which is the more dangerous direction and the harder one to
   notice. */
var LEX_FOLD_NO={
 contents:'the contents of a box, not the state of being content, and content subtracts',
 laughing:'the person laughing, where laughed in this table means being laughed at',
 rests:'it rests on the table, not the person resting, and rested subtracts',
 tenses:'the tenses of a verb, not a body tensing'};

/* ============================================================
   THE DEAD ROWS, NAMED, because a row that matches nothing looks live.

   Found by the gate that asserts every entry can actually be found by the
   scanner, which is a check nothing had. Two of the 192 authored entries cannot
   be reached, and they predate this pass:

     cannot stop thinking   seated at the third eye, amount 24, rumination
     cant stop thinking     the same

   Both are eaten by the phrase cannot stop, which is seated at the sacral at
   amount 18 and labelled compulsion. scanStory adds phrases first and then
   suppresses any later match overlapping a hit already recorded, so the phrase
   wins at that offset whatever its length. Measured: i cannot stop thinking
   about it reads as {sacral:18}, compulsion, and the third eye rumination entry
   never lands. A person ruminating is told they are compulsive, at a lower
   amount, at the wrong seat.

   THE STATED RULE IS NOT THE IMPLEMENTED RULE, and that is the actual defect. A
   phrase outranks THE WORDS INSIDE IT, which is right and is why the rule
   exists. Here the lexicon entry CONTAINS the phrase and is strictly longer and
   strictly more specific, so the rule does not reach this case and the
   implementation decided it by loop order.

   NOT FIXED HERE, and that is deliberate. The fix is one clause in scanStory,
   and which way that clause goes is a ruling rather than a repair: does the
   longer specific entry beat the shorter idiom, or does an idiom always win.
   Both are defensible and they read differently. So the two rows are named
   here, with the reason, and the gate asserts the dead set is EXACTLY this
   table in both directions. A third dead row fails the gate. This one cannot
   quietly become three.
   ============================================================ */
var LEX_DEAD={
 'cannot stop thinking':'eaten by the phrase cannot stop, which is shorter, seated elsewhere and worth less',
 'cant stop thinking':'eaten by the phrase cant stop, the same way'};

/* run the fold. keys are snapshotted first: the pass writes into the table it
   reads from, and reading a table while growing it is how a generator quietly
   folds its own output. */
function lexFold(){
 var base=Object.keys(LEX).filter(function(k){return k.indexOf(' ')<0;});
 var made={}, out={added:0,already:0,refused:[],unreachable:[]};
 base.forEach(function(k){
  LEX_FOLD_RULES.forEach(function(r){
   if(!r[1](k)) return;
   var f=r[2](k);
   if(LEX[f]||made[f]) return;
   made[f]={from:k,rule:r[0]};});});
 LEX_FOLD_OK.forEach(function(f){
  if(LEX_FOLD_NO[f]){out.refused.push(f);return;}
  if(!made[f]){out.unreachable.push(f);return;}
  var k=made[f].from, e=LEX[k];
  var a=lexAdd(f,e[LEX_SEAT],e[LEX_AMT],e[LEX_FET]!=null?e[LEX_FET]:null,
   {src:'fold',from:k,rule:made[f].rule,cite:'corpus'});
  if(a.ok&&!a.already)out.added++; else if(a.already)out.already++;
  /* the charge name folds with the form. without this the folded word gets a
     seat and no axis, so the imprint comes back inferred, and inferred is the
     flag that decides what the product is allowed to say out loud. */
  if(ADJ2CHG[k])chgAdd(f,ADJ2CHG[k],{src:'fold',from:k,rule:made[f].rule,cite:'corpus'});});
 out.generated=Object.keys(made).length;
 return out;}
/* lexFold is NOT run here, and the reason is load order. lexRefuse checks a
   stated fetter against CHARGES, and CHARGES is declared in core.js, which
   MANIFEST loads after this file. Touching it from here throws at parse, which
   is the failure this repository's load order rule exists to prevent. So the
   vocabulary, its schema, its validator and its rules live with the vocabulary,
   and the passes are RUN at the top of sniff.js, which is the first module
   where the canon tables are in scope and still before anything can scan. */

/* ============================================================
   THE LAW VIOLATION CUES · SNIFFER_SPEC.md section 6.

   WHAT THIS IS FOR, in one sentence: the spec rules that CQ is the mean of the
   21 laws, so a law violation is not decorative, it is the input to the
   coherence number, and the sniffer is asked to detect where a law is being
   violated in journal text.

   THE PRIVACY RULING, CHECKED FIRST RATHER THAN LAST. Every cue below is
   matched against text that is already in the person's own browser by a pure
   function with no host access. No name, no record and nothing off a device is
   read, and nothing is sent anywhere. The ruling permits this. It does not
   permit the evaluation this table actually needs, which is written down under
   WHAT CANNOT BE EVALUATED at the bottom of this block.

   WHERE THE WORDS COME FROM, AND THE ADMISSION THAT MATTERS MOST. Section 13
   of the spec names `reviews/elements.json` as "your lexicon" and says to load
   it directly rather than retype it. IT IS NOT IN THIS REPOSITORY, along with
   ENGINE.json, reviews/canon.json and handoff/ATUNED_SPEC.json. So there was
   no lexicon to load and this table could not be built the way the spec says
   to build it.

   What was done instead, and its limit stated rather than hidden: every cue
   below is derived from a string the spec itself prints in the section 6
   violation column, plus that string's ordinary English inflections. Nothing
   is invented from a clinical vocabulary and nothing is imported from another
   instrument. The cost is recall: a violation column entry like "Opacity.
   Energy diverted to concealment" yields perhaps four reachable words, so this
   table is a floor on what the 21 laws can detect and not a serious attempt at
   them. lawCoverage() reports the size of the hole rather than letting an
   average hide it.

   THE FOUR BIDIRECTIONAL LAWS ARE KEYED IN BOTH DIRECTIONS, on the spec's own
   warning: "a sniffer that only looks for the obvious pole will miss half of
   them, self-abandonment reads as virtue in a journal." Compassion, Humility,
   Generosity and Ownership each carry two cue sets and the output names which
   direction fired. A law read in the wrong direction is worse than a law not
   read, because the product would praise the thing it is meant to surface.

   PRECISION OVER RECALL, the same ruling the rest of this file runs on. A false
   positive here tells a person their Truth is violated, which is an accusation.
   So the phrases are specific and the single common words that would catch
   everything are refused: `harm`, `pride`, `wrong` and `late` are not cues.
   ============================================================ */
var LAW_SELF='self', LAW_OTHER='other', LAW_ONE='single';
/* [law, direction, [cues]]. direction is LAW_ONE unless the law is one of the
   four the spec rules bidirectional. `e` is the spec's element number, carried
   so the output contract can emit it and so a renumbering is a visible diff. */
var LAWCUE=[
 [29,'Truth',           LAW_ONE,  ['lied','i lied','told them i','made it up','not the whole truth',
                                   'i said i had','pretended i','covered for','deceived','a white lie']],
 [30,'Transparency',    LAW_ONE,  ['did not tell','kept it from','they do not know','behind their back',
                                   'nobody knows i','hid it','i hid','concealed','kept quiet about']],
 [31,'Unity',           LAW_ONE,  ['us and them','those people','not one of us','they are all',
                                   'people like that','my side','cut them off','nothing to do with me']],
 [32,'Awareness',       LAW_ONE,  ['before i knew it','i just reacted','snapped at','lost it with',
                                   'came out of nowhere','without thinking','i was triggered']],
 [33,'Presence',        LAW_ONE,  ['going over it','kept replaying','rehearsing','could not be there',
                                   'somewhere else','i was not there','in my head the whole']],
 [34,'Equanimity',      LAW_ONE,  ['depends on whether','only if','ruined the whole','set me off',
                                   'threw me','could not settle','on edge all']],
 /* BIDIRECTIONAL. the spec: "Indifference OR self-abandonment, withheld in
    either direction." withheld outward is indifference, withheld inward is
    the one that reads as virtue. */
 [35,'Compassion',      LAW_OTHER,['not my problem','they brought it on','deserved it','do not care what happens',
                                   'their own fault','no sympathy for']],
 [35,'Compassion',      LAW_SELF, ['i should be able to','no right to feel','others have it worse',
                                   'i do not matter','put myself last','i will manage','no time for myself']],
 [36,'Forgiveness',     LAW_ONE,  ['will never forgive','still owe me','after what they did','i want them to',
                                   'holding it against','have not forgotten','they will pay']],
 [37,'Courage',         LAW_ONE,  ['put it off','did not bring it up','said nothing','walked away from',
                                   'changed the subject','could not face','kept avoiding','never said']],
 [38,'Temperance',      LAW_ONE,  ['one more','again last night','more than i meant','could not stop at',
                                   'takes more now','every night this week','went overboard']],
 [39,'Duty',            LAW_ONE,  ['said i would and','let them down','did not show up','broke my word',
                                   'promised and','backed out','went back on']],
 /* BIDIRECTIONAL. the spec: "Victimhood inward, justification outward. One
    move, two directions." */
 [40,'Ownership',       LAW_OTHER,['made me','not my fault','because they','if they had not',
                                   'had no choice','forced me','anyone would have']],
 [40,'Ownership',       LAW_SELF, ['all my fault','i ruined','i always do this','everything is my',
                                   'i am the problem','i deserve this','no good at anything']],
 [41,'Justice',         LAW_ONE,  ['they got away with','not fair that','wanted them punished',
                                   'looked the other way','turned a blind eye','let it slide because']],
 [42,'Non-Harm',        LAW_ONE,  ['i humiliated','made them cry','said it to hurt','wanted it to sting',
                                   'did not care who got','collateral','i lashed out at']],
 [43,'Wisdom',          LAW_ONE,  ['sounded right','told myself that','easier to believe','convinced myself',
                                   'justified it','knew better and','a good story about']],
 /* BIDIRECTIONAL. the spec: "Pride and grandiosity, OR the inverse
    self-abasement." */
 [44,'Humility',        LAW_OTHER,['nobody else could','above all this','they should be grateful',
                                   'i am the only one who','beneath me','better than them at']],
 [44,'Humility',        LAW_SELF, ['who am i to','not qualified to','i am nothing','worthless',
                                   'do not deserve to','make myself small']],
 /* BIDIRECTIONAL. the spec: "Circuit broken. Hoarding on giving, entitlement
    on receiving." */
 [45,'Generosity',      LAW_OTHER,['keeping it for','not sharing','what do i get','owe me',
                                   'entitled to','my share first']],
 [45,'Generosity',      LAW_SELF, ['could not accept','refused the help','did not let them',
                                   'i do not need anyone','turned down the offer']],
 [46,'Detachment',      LAW_ONE,  ['has to go my way','cannot let go of','kept checking',
                                   'needed it to be','could not let them','clinging to','fixated on']],
 [47,'Patience',        LAW_ONE,  ['right now','cannot wait','forced it','pushed it through',
                                   'should have happened by','sick of waiting','made it happen faster']],
 [48,'Aesthetic Beauty',LAW_ONE,  ['the mess','piles of','noise the whole','cluttered','could not think in',
                                   'chaos in here']],
 [49,'Nature',          LAW_ONE,  ['have not been outside','screens all','under strip lights',
                                   'no daylight','four walls','not seen the sky']]];

/* THE FIVE EXPRESSION SHADOWS the spec names as high value for journal text:
   Flow to Block, Curiosity to Apathy, Play to Rigidity, Purpose to
   Driftlessness, Will to Resignation. Only these five, because the other five
   of the ten and all 28 of nature and human nature need elements.json, which
   is not here. The engine's own EXPR table carries six of the spec's ten names
   and four it does not, and its shadow word differs on every one of these five,
   so this is a separate table rather than an edit to EXPR: EXPR has other
   callers and moving its strings would move surfaces this pass did not measure. */
var EXPRCUE=[
 [54,'Flow',     'Block',         ['could not get started','stuck on','staring at it','nothing came',
                                   'kept stopping','blocked','no traction']],
 [55,'Curiosity','Apathy',        ['do not care any more','what is the point','stopped wondering',
                                   'all the same to me','not interested in anything']],
 [56,'Play',     'Rigidity',      ['has to be done properly','no time for that','not funny',
                                   'we do it this way','cannot just','there are rules']],
 [57,'Purpose',  'Driftlessness', ['no idea what i am doing','going nowhere','drifting',
                                   'why am i even','no direction','same thing every day']],
 [58,'Will',     'Resignation',   ['gave up on','no use trying','it is what it is','nothing i can do',
                                   'stopped fighting','accepted that i will never']]];

/* DANTE, SECTION 9, AND ONLY WHERE IT IS ACTUALLY SNIFFABLE.

   The spec gives nine circles with a pattern and a somatic address each, and
   says of the eighth: "C8's test is the single most sniffable line in the whole
   system. Performed warmth versus generated warmth is detectable in text:
   praise that arrives with an audience, generosity narrated rather than done."
   That is a test, so it is implemented as one.

   The other eight are behavioural taxonomy without a phrase table, and no
   elements.json to derive one from. Four have enough of a stated pattern to
   reach with the spec's own words and are keyed thinly. Four are left empty and
   REPORTED empty, because a circle scored off two guessed phrases would be a
   depth reading of a person built on nothing, which is the worst thing in this
   document to get wrong. depth returns null rather than a low confidence
   guess: refusing to read is a legitimate answer and it is the right one here. */
var DANTECUE=[
 ['C1','Limbo',    'Disbelief, spiritual bypass through rationalism',
  ['none of it is real','just brain chemistry','all in the mind','nothing means anything really']],
 ['C2','Lust',     'Grandiose entitlement, self-appointed arbiter',[]],
 ['C3','Gluttony', 'Consumption as substitution',
  ['ate until','filled the gap with','instead of calling','something to take the edge']],
 ['C4','Greed',    'Scarcity identity, worth measured in possession',
  ['never enough','what i am worth','cannot afford to','they have more']],
 ['C5','Wrath and Sloth','The same suppressed charge, out as attack or in as shutdown',
  ['did not get out of bed','blew up at','could not move all','went off at']],
 ['C6','Heresy',   'Doctrine as identity armor',[]],
 ['C7','Violence', 'Against others, against self, against nature',[]],
 /* the test, and it is a test rather than a word list: warmth that requires an
    audience. a marker of display standing within range of a marker of giving. */
 ['C8','Fraud',    'Performed warmth. Does it cost them anything, or require an audience',[]],
 ['C9','Treachery','Complete inversion, stasis at terminal velocity',[]]];
var C8_GIVE=['helped','gave','looked after','paid for','stayed with','covered for','supported'];
var C8_AUDIENCE=['everyone saw','posted','in front of','made sure they knew','told everyone',
 'people noticed','on the group chat','announced'];
var C8_WINDOW=12;      /* words. one sentence of reach, the same span the lean's
                          negation rule uses for the same reason: wider and the
                          marker belongs to a different sentence. */

/* WHAT THIS TABLE CAN AND CANNOT REACH, reported rather than averaged. The
   whole birth module once sat at zero coverage while the average read 92
   percent, so this returns the unreached list and not only the number. */
function lawCoverage(){
 var laws={}, bidir={};
 LAWCUE.forEach(function(r){
  laws[r[1]]=(laws[r[1]]||0)+r[3].length;
  if(r[2]!==LAW_ONE)bidir[r[1]]=(bidir[r[1]]||0)+1;});
 var thin=Object.keys(laws).filter(function(l){return laws[l]<6;});
 return {laws:Object.keys(laws).length, cues:Object.keys(laws).reduce(function(a,l){return a+laws[l];},0),
  bidirectional:Object.keys(bidir).sort(), thin:thin.sort(),
  expression:EXPRCUE.length, expressionAbsent:5,
  circles:DANTECUE.length, circlesKeyed:DANTECUE.filter(function(c){return c[3].length;}).length,
  nature:0, human:0,
  missing:['reviews/elements.json','ENGINE.json','reviews/canon.json','handoff/ATUNED_SPEC.json']};}

/* WHAT CANNOT BE EVALUATED, AND IT IS NOT A SMALL LIST.

   There is no labelled set. Nobody has taken journal text and marked which of
   the 21 laws it violates, so nothing below is validated and none of it may be
   called accurate. What CAN be measured without labels, and is, in
   tests/engine.js and proto/sniffer: that a cue fires where it should, that it
   does not fire on the negation of itself, that the bidirectional four report a
   direction, that the same text read twice gives the same answer, and that
   nothing fires on empty input.

   What it would take to evaluate this honestly, in order of cost:
     1. a labelled set. 200 journal entries, two independent raters per entry
        marking law and direction, agreement measured before the matcher is
        scored against it. The raters may not be the author of this table.
     2. a negation and subject audit. This table inherits no negation handling,
        so "i did not lie to them" fires Truth. verp.js solved this for its own
        lists with a three word lookback and that mechanism should be shared
        rather than copied, which is a change to a file this seat does not own.
     3. the privacy ruling on the set itself. A labelled corpus of journal text
        is the most sensitive artefact this product could hold, and the ruling
        that the story without the record is what refines the models is exactly
        what makes it possible at all. It needs consent language and the owner's
        ruling that it is allowed before a single entry is collected. */
