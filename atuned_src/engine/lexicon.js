/* ============================================================
   THE LEXICON. word -> [seat, intensity].
   The original declared several keys twice across two blocks, so the
   later generic entries silently cancelled the newer specific ones , 
   the opposite of the stated intent. Merged here, one entry per key.
   ============================================================ */
var LEX={
 /* the burnout set. the resolver had no entry for any of these and read
    four segments out of thirty-three. */
 inadequacy:['throat',24],inadequate:['throat',22],misery:['heart',24],
 miserable:['heart',22],remorse:['heart',20],remorseful:['heart',18],
 burnout:['solar',28],'burnt out':['solar',28],'burned out':['solar',28],
 depleted:['solar',24],drained:['solar',22],evaporated:['solar',20],
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
