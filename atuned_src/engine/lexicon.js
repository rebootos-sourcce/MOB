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
 /* sacral */
 restless:['sacral',12],craving:['sacral',14],numb:['sacral',16],empty:['sacral',18],
 hungry:['sacral',12],addicted:['sacral',22],distracted:['sacral',12],obsessed:['sacral',20],
 /* solar */
 angry:['solar',18],furious:['solar',24],ashamed:['solar',20],humiliated:['solar',24],
 defensive:['solar',16],blamed:['solar',18],stupid:['solar',20],worthless:['solar',26],
 embarrassed:['solar',16],guilty:['solar',18],
 /* heart */
 sad:['heart',16],lonely:['heart',20],grieving:['heart',22],hurt:['heart',18],
 rejected:['heart',22],abandoned:['heart',26],unloved:['heart',24],heartbroken:['heart',26],
 /* throat */
 silent:['throat',14],unheard:['throat',18],voiceless:['throat',20],choked:['throat',18],
 dismissed:['throat',18],ignored:['throat',18],
 /* coherent. these subtract. */
 grateful:['coherent',-14],content:['coherent',-12],calm:['coherent',-12],
 steady:['coherent',-12],peaceful:['coherent',-14],settled:['coherent',-12]};
var ADJ2CHG={
 nervous:'anxiety',anxious:'anxiety',tense:'anxiety',
 unheard:'silence',voiceless:'silence',choked:'silence',swallowed:'silence',
 doubtful:'doubt',uncertain:'doubt',suspicious:'doubt',distrustful:'doubt',
 numb:'apathy',flat:'apathy',blank:'apathy',indifferent:'apathy',hollow:'apathy',
 unmoved:'apathy',detached:'apathy',uncaring:'apathy',
 apart:'separation',disconnected:'separation',outside:'separation',adrift:'separation',
 scared:'fear',afraid:'fear',frightened:'fear',terrified:'fear',panicked:'fear',
 froze:'fear',frozen:'fear',shaking:'fear',unsafe:'fear',dread:'fear',bracing:'fear',
 angry:'anger',furious:'anger',defensive:'anger',blamed:'anger',
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
