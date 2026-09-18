
/* ============================================================
   THE PATTERN CATALOG. Ported from the owner's own production
   artefacts, not written here. Three sources, and where they
   disagree the divergence is recorded rather than resolved:

   1. TULA 3C GENERATOR, the full system spec. A generator, not
      a list, which is why the app never needed 3,800 hardcoded
      sentences. One card is one pattern at one address and it
      runs to two hundred statements: fifty masculine limiting,
      fifty feminine limiting, fifty masculine truths, fifty
      feminine truths. The book's two hundred per card is
      correct and this is its construction.

   2. SOULCRAFT RELEASE PROTOCOL cards No.01 to No.03, the
      printed production cards. Anxiety, Grief, Anger, with
      every line paired to its embodied truth.

   3. THE LETTING GO CARDS, nine axes, the release protocol at
      the address level. Track statement, release, install.

   Every sentence here is the owner's wording. Nothing is
   generated and nothing is paraphrased.
   ============================================================ */

/* ---- the strict syntax. the spec calls it non negotiable ----
   nine gates, one statement. it fires the cognitive, emotional,
   behavioural, identity and somatic layers at once, which is the
   whole reason the line is this long. */
const C3_VERB=['believing','perceiving','thinking','behaving','acting','feeling',
 'speaking','saying','doing'];
const C3_STEM='I am letting go of '+C3_VERB.join(', ').replace(/, ([^,]*)$/,', and $1')
 +' that I am ';
const C3_TRUTH='I now embody the truth that I am ';

/* A second nine gate roster exists, on the nine axes cards, and it is not
   this one: believing, perceiving, thinking, feeling, speaking, acting from,
   relating through, creating from, being, each mapped to a chakra region
   crown to root. The 3C spec calls its own roster non negotiable and the
   axes card calls its own simultaneous. Both are the owner's. The engine
   speaks the 3C roster because that is the one the statements are built on,
   and the other is recorded here so the disagreement is visible. */
const C3_GATE9=['believing','perceiving','thinking','feeling','speaking',
 'acting from','relating through','creating from','being'];

/* ---- the escalation curve ----
   fifty statements per channel, five bands of ten. the band is not
   decoration: it is nervous system pacing, and the purpose column is why
   a card cannot open at the bottom. */
const C3_BAND=[
 {lo:1, hi:10, nm:'Subtle activation',        why:'gain nervous system permission',
  w:['slightly','mildly','subtly','lightly']},
 {lo:11,hi:20, nm:'Tension accumulation',     why:'emotional recognition',
  w:['uneasy','pressured','frustrated','burdened']},
 {lo:21,hi:30, nm:'Emotional flooding',       why:'somatic activation',
  w:['overwhelmed','angry','exhausted','trapped']},
 {lo:31,hi:40, nm:'Identity destabilization', why:'access the core wound',
  w:['unsupported','invisible','unsafe','powerless']},
 {lo:41,hi:50, nm:'Existential exposure',     why:'deep nervous system discharge',
  w:['completely alone','beyond support','trapped forever','emotionally destroyed']}];

/* the adjective progression, in the owner's order. no repetition is a stated
   failure mode, so the ladder is the fix: each rung is a depth, not a synonym.
   note what is not on it. the book gives sadness an action threshold word of
   suicidal and this ladder does not, and the ladder is the newer artefact. */
const C3_LADDER=['uneasy','tense','nervous','bothered','irritated','frustrated',
 'stressed','overwhelmed','anxious','afraid','fearful','worried','threatened',
 'ashamed','guilty','troubled','distressed','panicked','angry','furious',
 'enraged','collapsing'];

/* ---- the polarity, and it is the balance axis under another name ----
   masculine is structure and direction, feminine is energy and receptivity,
   and the printed cards label the same split right channel sympathetic and
   left channel parasympathetic. So masculine, right and sympathetic are one
   thing and feminine, left and parasympathetic are another. The spec is
   explicit that feminine is not women and masculine is not men. */
const C3_POLE=[
 {k:'m', nm:'Masculine', ch:'Right channel', ans:'sympathetic', of:'structure and direction',
  is:['action','clarity','control','execution','external orientation'],
  th:['action','performance','outcomes','responsibility','control','execution',
      'pressure','dominance','frustration'],
  body:['jaw','shoulders','chest','hips','adrenaline'], en:'forward driving'},
 {k:'f', nm:'Feminine', ch:'Left channel', ans:'parasympathetic', of:'energy and receptivity',
  is:['feeling','receiving','safety','openness','internal experience'],
  th:['emotional safety','support','abandonment','grief','tenderness','worthiness','connection'],
  body:['chest','throat','gut','pelvis'], en:'receptive and internal'}];
/* both sides run at once, fifty left and fifty right, and both must clear */
const C3_BILATERAL='All releases run bilaterally, fifty left and fifty right at '
 +'the same time. The right side is the outward expression channel. The left '
 +'side is the inner world channel. Both must clear.';

/* ---- the chain the generator reverses ---- */
const C3_CHAIN=['Trigger','Somatic response','Emotional interpretation',
 'Behavioural adaptation','Identity formation','Existential belief'];
/* release escalates into the wound, the truth escalates out of it */
const C3_DIR={down:'surface, emotion, identity, existential collapse',
 up:'existential repair, identity repair, emotional regulation, grounded action'};

/* every sentence is built of four parts, and a line missing the body is the
   stated weakness: if there is no body connection the card weakens sharply. */
const C3_PART=['intensity modifier','nervous system state','contextual trigger',
 'identity implication'];
/* the required card header. the engine already carries region and nerves. */
const C3_HEAD=['region','primary nerves','fetters','somatic tone','energetic signature'];
/* two to four dominant themes per card, from these */
const C3_THEME=['scarcity','abandonment','control','suppression','overwhelm','shame',
 'instability','disconnection','hypervigilance','avoidance'];
/* the six kinds of pattern the generator takes */
const C3_KIND=[
 {nm:'Emotional',  ex:['grief','anxiety','shame','anger']},
 {nm:'Cognitive',  ex:['overthinking','fear loops','self doubt']},
 {nm:'Somatic',    ex:['tight throat','swollen ankles','jaw tension']},
 {nm:'Relational', ex:['abandonment','approval seeking','rejection fear']},
 {nm:'Financial',  ex:['scarcity','wealth rejection','instability']},
 {nm:'Identity',   ex:['I am broken','I am not enough','I am evil']}];
/* what a truth is and is not. the bad example is the owner's own. */
const C3_TRUTHRULE={is:'a nervous system corrective experience encoded in language',
 not:'positive thinking',
 must:['feel believable','reduce activation','restore agency','restore safety',
       'restore connection','restore groundedness'],
 bad:'I am infinite cosmic abundance.', good:'I am safe to slow down.',
 /* the last ten go short, because simplicity processes best after activation */
 last:['I am safe','I am supported','I am grounded','I am held','I am here']};
/* the ways a card fails. checked against, not decoration. */
const C3_FAIL=['repeating the same emotional word','mixing the polarities',
 'giving only one polarity','not scaling the intensity','turning into advice',
 'losing the exact syntax','weak endings'];

/* ============================================================
   THE PRINTED CARDS. No.01 to No.03, verbatim. Each line in rel
   is paired by position with the line in tru beside it: that
   pairing is the card's own, and it is what the engine has never
   had. Release empties the address, the paired truth fills it.
   ============================================================ */
const CARDSET=[
 {no:'01', nm:'Anxiety', ax:'Anticipation',
  dom:'World, life, future projection',
  seat:'Brainstem, chest, gut', nrv:'Vagus, reticular activating system, enteric',
  lad:['alert','tense','tight','compressed','activated'],
  m:{rel:['pure anxiety and cannot shut it off',
          'going to lose control completely',
          'not going to make it through what is ahead',
          'doomed by the direction of life',
          'completely overwhelmed and cannot handle the future'],
     tru:['not controlled by the future','not losing control','not spiraling',
          'not powerless','not threatened by the future']},
  f:{rel:['completely unsafe in the world',
          'completely unsupported in life',
          'completely alone facing the future',
          'abandoned in uncertainty',
          'alone and not safe in this world'],
     tru:['safe','held','supported','grounded','here']}},
 {no:'02', nm:'Grief', ax:'Sad',
  dom:'Loneliness, aloneness, life heaviness',
  seat:'Heart, chest, diaphragm', nrv:'Vagus, cardiac plexus, phrenic',
  lad:['soft heaviness','sinking weight','pressure','collapse'],
  m:{rel:['nothing beyond this loneliness',
          'disappearing into loneliness',
          'erased by being alone',
          'lost in the heaviness of life',
          'completely alone and life is too heavy'],
     tru:['not defined by loneliness','not reduced by the heaviness of life',
          'not erased by being alone','not lost in this heaviness',
          'not consumed by grief']},
  f:{rel:['completely alone and nothing is holding me',
          'isolated in existence',
          'disconnected from everyone',
          'not held in my grief',
          'abandoned in my experience'],
     tru:['not alone','held','safe','connected','here and held']}},
 {no:'03', nm:'Anger', ax:'Anger',
  dom:'Life, world, loss of control',
  seat:'Jaw, throat, chest, solar plexus',
  nrv:'Trigeminal, vagus, sympathetic chain, solar plexus',
  lad:['tight','hot','pressurized','explosive','volatile'],
  m:{rel:['pure anger and cannot shut it off',
          'going to lose control completely',
          'defined by my anger',
          'powerless over my reactions',
          'trapped in frustration'],
     tru:['not consumed by anger','not losing control','not driven by rage',
          'not explosive','not out of control']},
  f:{rel:['completely overwhelmed and cannot turn it off',
          'consumed internally by rage',
          'alone with my anger',
          'not safe to express power',
          'not safe to release pressure'],
     tru:['safe','held','supported','grounded','here']}}];
/* how to read a card, the owner's framing and closing copy */
const CARD_OPEN='Turn your senses inward before you read. Move slowly through '
 +'each line. Notice where reading feels contracted, where it pulls, tightens, '
 +'or resists. Notice where it feels expansive. What your body does as you read '
 +'is the data.';
const CARD_SHUT='If you felt resistance on any line, stay with it. Read it again. '
 +'The resistance is the charge. Keep reading until the line no longer produces '
 +'a contraction in your body.';

/* ============================================================
   THE NINE AXES CARDS. Track statement, release, install, one
   per axis. The track is what the pattern says in the person's
   own voice, and the engine has never had it.

   Seven of the nine land on an address the engine already
   carries. Two do not: the cards give Receiving blocked at the
   inferior anterior heart and Grief at the centre chest, where
   the engine carries Surprise and Anticipation. That is the
   owner's call and nothing here renames an axis. The two
   unmatched cards are kept under their own names, marked, so
   they are not lost and not silently merged.
   ============================================================ */
const AXCARD=[
 {ax:'Fear', num:'01', cop:'Safety', addr:'Lumbar Plexus (L1 to L4)',
  track:'I am stuck. I am trapped.',
  rel:'afraid. I am letting go of the belief that I am trapped. I am letting go of the survival program running at this address.',
  inst:'I am safe in this body. I am grounded in this moment. The ground holds me. The threat has passed. My nervous system is free to conduct without the alarm.'},
 {ax:'Anger', num:'02', cop:'Calm', addr:'Solar plexus, celiac plexus',
  track:'This is wrong. Move.',
  rel:'angry. I am letting go of the compressed will at this address. I am letting go of the belief that I must force the result.',
  inst:'I have power available without force. I can see the options in this situation clearly. I can move with discernment, not with pressure. My will is calm and direct.'},
 {ax:'Shame', num:'03', cop:'Worth', addr:'Pudendal nerve',
  track:'I am not worthy.',
  rel:'ashamed. I am letting go of the collapse at this address. I am letting go of the story that my presence requires justification.',
  inst:'I am worthy of taking up space. I am worthy of being seen. My worth is not earned through performance. It is present at this address right now.'},
 {ax:'Disgust', num:'04', cop:'Acceptance', addr:'Sacral and dermis, front to back',
  track:'Things are not as they should be.',
  rel:'in rejection. I am letting go of the recoil at this address. I am letting go of the standard that makes reality wrong.',
  inst:'What is here is what is here. I can be present with what is present without contracting. I can engage without rejection. The dermis is warm and open.'},
 {ax:'Apathy', num:'07', cop:'Joy', addr:'Shoulder girdle and throat',
  track:'What is the point.',
  rel:'in apathy. I am letting go of the collapsed will at this address. I am letting go of the question that assumes the answer is nothing.',
  inst:'My will is active and available. My shoulders are open and lifted. My throat is clear. The point is here. It has always been here. I can feel it moving through me right now.'},
 {ax:'Shock', num:'08', cop:'Anticipation', addr:'Dermis, the full skin surface',
  track:'This should not be happening.',
  rel:'in shock. I am letting go of the bracing at the surface. I am letting go of the record that says reality must always be a threat.',
  inst:'My skin is warm. The surface is open. What is happening can be met without recoil. I am ready for what comes. My nervous system can be curious rather than alarmed.'},
 {ax:'Sad', num:'09', cop:'Happy', addr:'Inferior anterior cardiac nerves',
  track:'I cannot have what I want.',
  rel:'in sadness. I am letting go of the weight at the inferior heart. I am letting go of the old flags that were never updated. I am letting go of the version of the future that was set in stone at an earlier age.',
  inst:'What I have is real. What is here now is enough to work with. The cardiac plexus at the top of my heart is open. Joy is available. I can feel what is good in what is present right now.'},
 /* unmatched: no axis in the engine sits at these two addresses under these
    names. kept, marked, and never merged into a neighbour. */
 {ax:null, un:'Receiving blocked', num:'05', cop:'Gratitude', addr:'Inferior anterior heart',
  track:'I am too small to be seen.',
  rel:'closed to receiving. I am letting go of the smallness at this address. I am letting go of the belief that what is present cannot be for me.',
  inst:'I am large enough to receive what is present. What is here is here for me. I can take in what is offered without diminishing it or deflecting it. The heart is open to receive.'},
 {ax:null, un:'Grief', num:'06', cop:'Renewal', addr:'Centre chest, bilateral, lung influence',
  track:'I cannot move forward.',
  rel:'in grief. I am letting go of the weight at this address. I am letting go of the hold on what was or what never came to be.',
  inst:'I can move forward from here. What was, was. What is, is. The loss is real and the life continues. My chest can expand fully. I can breathe the present moment.'}];

/* how the protocol is run, the owner's five steps plus the bilateral note */
const CARD_STEP=[
 'Find the axis that is active. Feel the address. Make contact with the charge before speaking.',
 'Run the full statement. Speak it or sub vocalise it. The body does not require volume, it requires direction.',
 'After the release, state the installation. Not as an affirmation, as a somatic claim. Hold it at the address until the body confirms it.',
 'Run the snowball: bring to mind every memory, every person, every situation that carries this charge. Release each in sequence. The chain builds momentum.',
 'The release is complete when the body settles. Breath deepens. Vision may clear. The wrapped sensation dissolves. That is the signal.'];

/* ---- lookups. by axis name, because the axis names are identity. ---- */
const CARD_BY={}; CARDSET.forEach(function(c){if(c.ax)CARD_BY[c.ax]=c;});
const AXC_BY={}; AXCARD.forEach(function(c){if(c.ax)AXC_BY[c.ax]=c;});
/* the two the engine has no axis for, kept reachable by their own name */
const AXC_UN=AXCARD.filter(function(c){return !c.ax;});

/* one release line at full strength, in the strict syntax, for any axis that
   has a card. returns null rather than inventing one. */
function cardLine(ax,pole,i){
 var c=CARD_BY[ax]; if(!c)return null;
 var side=c[pole==='f'?'f':'m']; if(!side||!side.rel[i])return null;
 return {rel:C3_STEM+side.rel[i]+'.', tru:C3_TRUTH+side.tru[i]+'.'};}
/* how many paired lines a card carries on a side */
function cardDepth(ax,pole){var c=CARD_BY[ax];
 return c?c[pole==='f'?'f':'m'].rel.length:0;}
/* the axis release, at the address. This one is written for the axes card's
   own gate roster, which ends in being, so it is built from that roster and
   not from the 3C stem. The two rosters are not interchangeable and splicing
   one into the other produces a line neither card says. */
const AX_STEM='I am letting go of '+C3_GATE9.join(', ').replace(/, ([^,]*)$/,', and $1')+' ';
function axLine(ax){var c=AXC_BY[ax]||AXC_UN.filter(function(x){return x.un===ax;})[0];
 return c?AX_STEM+c.rel:null;}
/* which band a position on the fifty falls in */
function c3Band(n){for(var i=0;i<C3_BAND.length;i++)
 if(n>=C3_BAND[i].lo&&n<=C3_BAND[i].hi)return C3_BAND[i];
 return C3_BAND[0];}
