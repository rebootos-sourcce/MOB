/* ============================================================
   THE COMPASS. Two cones, eight axes, and a descent.

   Every line of naming and description in this file is quoted from
   the codex. Nothing here was invented, because the owner has been
   writing it for four thousand years of source material and the
   product's job is to carry it, not to improve it.

   The CQ cone points up. Twelve masters anchor it, and the codex is
   explicit that they are NOT the top of the spiral: "The Ascended
   Masters are not at the top of the upward spiral. They are
   coordinates on the CQ cone."

   The DQ cone points down. Its terminus is the Decoherent
   Blueprint, and below the blueprint sit the nine circles, which
   the codex reads as a taxonomy rather than a poem: "Read as a
   diagnostic tool, not allegory, each circle is a behavioral
   configuration at a specific depth of compression."

   Both are behaviours. Never entities. A person meets Lucifer as a
   posture they are running, not as somebody in a book.
   ============================================================ */

/* ---- THE EIGHT MIRROR PAIRS ----
   "Each ascended master is the maximum coherent expression of a
   human quality. Their counterpart at the compression pole is the
   same quality at maximum inversion. Same energy. Opposite
   direction. The client is somewhere between them on that axis."

   seat is where this product already measures the quality, so the
   position between the poles is read rather than asked. */
const MIRROR=[
 {k:'IL', q:'Illumination', seat:'Heart',
  up:'Jesus',   upd:'Love generated from within. Freely given. No transaction. Light that has a source.',
  dn:'Lucifer', dnd:'Pride as false light. Shine performed for reflection, not generated from Source.',
  ask:'Does this person’s warmth cost them anything, or does it require an audience?', ic:'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8a4 4 0 110 8 4 4 0 010-8', dic:'M12 4l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 16.4 6.99 19.2l1.2-5.6L4 9.8l5.6-.6z'},
 {k:'DE', q:'Desire and will', seat:'Sacral',
  up:'Ramakrishna', upd:'Will surrendered to Source. Desire as devotion. Wanting that moves toward something beyond the self.',
  dn:'Asmodeus',    dnd:'Craving without closure. Appetite that cannot satisfy. Having never resolves the wanting.',
  ask:'Does wanting move them toward something, or does having never satisfy?', ic:'M12 20s-7-4.4-7-9.4A4 4 0 0112 8a4 4 0 017 2.6c0 5-7 9.4-7 9.4z', dic:'M4 9h16l-2.2 10.4a1 1 0 01-1 .6H7.2a1 1 0 01-1-.6zM9 9V6a3 3 0 016 0v3'},
 {k:'OR', q:'Order', seat:'Throat',
  up:'Moses', upd:'Structure in service of liberation. Law that creates freedom. Order others can stand within.',
  dn:'Set',   dnd:'Chaos engineered to prevent coherence. Betrayal as systemic strategy. Disruption from inside trusted systems.',
  ask:'Does this person build structures others can stand in, or dismantle what others depend on?', ic:'M4 6h16M4 12h16M4 18h11M19 16.5v3.6M17.4 18.3h3.2', dic:'M4.6 5.4l14.8 13.2M19.4 5.4L4.6 18.6M12 4v16'},
 {k:'PO', q:'Power', seat:'Solar',
  up:'Musashi', upd:'Mastery that costs the practitioner. Power in service of precision. Discipline the self bears.',
  dn:'Moloch',  dnd:'Power that extracts from others. The machine that must be fed. Discipline that others pay for.',
  ask:'Who pays the cost of this person’s discipline?', ic:'M6.5 17.5L17 7M15 5l4 4M6 18l-1.6 1.6M4.5 15.5l4 4', dic:'M5 20V9l7-5 7 5v11M9 20v-5h6v5M9.5 11.5h5'},
 {k:'PE', q:'Perception', seat:'3rd Eye',
  up:'Buddha', upd:'Clear seeing. Reality without overlay. The compositor running on present signal.',
  dn:'Geryon', dnd:'Engineered surface. Beautiful above, serpentine beneath. Perception itself weaponised.',
  ask:'Does this person’s self presentation match their interior state?', ic:'M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6zM12 9.4a2.6 2.6 0 110 5.2 2.6 2.6 0 010-5.2', dic:'M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6zM5 5l14 14'},
 {k:'TR', q:'Trust', seat:'Heart',
  up:'Rumi',   upd:'Direct encounter with the field. Felt knowing. The heart as the instrument.',
  dn:'Charon', dnd:'Threshold paralysis. Cannot cross what cannot be measured. The rational mind forever preparing to arrive.',
  ask:'Does this person access experience directly, or require verification before they allow themselves to feel?', ic:'M12 20.5S4.5 15.6 4.5 10.2A3.8 3.8 0 0112 8a3.8 3.8 0 017.5 2.2c0 5.4-7.5 10.3-7.5 10.3z', dic:'M4 17h16M6.4 17V9.6M17.6 17V9.6M4 9.6h16L12 4.6z'},
 {k:'CH', q:'Charge', seat:'Root',
  up:'Elijah',   upd:'Grounded fire. Intensity moving through the body without destroying the container or the target.',
  dn:'Phlegyas', dnd:'Charge split at the root. Outward as rage or inward as paralysis. The same current, no clean exit.',
  ask:'Where does this person’s intensity go when it has nowhere to land?', ic:'M13 2.5L5.5 13.5H11L10 21.5l7.5-11H12z', dic:'M12 3v8M12 15v6M6 9l-2.6-2.6M18 9l2.6-2.6M4 13.5h3.4M16.6 13.5H20'},
 /* ECKHART IS OUT AND JESUS TAKES THE CROWN. Both ruled. Eckhart was the one
    name on the eight that was not classical. Lao Tzu held the axis for one
    commit as a stated assumption, flagged as needing confirmation, and the
    confirmation came back as somebody else: "that would be Jesus at the very
    top. That's love. Love transmutes all. That's the highest charge."

    SO JESUS STANDS AT TWO POLES ON THIS FIGURE, and that is the owner's
    canon rather than a mistake to route around. He is the coherent pole of
    Illumination at the Heart, which is love generated from within and freely
    given, and of Revelation at the Crown, which is love as the thing every
    other frequency reorganises around. The codex already carries both: the
    master list has him at the Ananda apex under the name Christ, and the
    mirror pairs have him at the Heart under the name Jesus.

    ONE FIGURE, ONE NAME. Christ and Jesus were one person under two names
    across two lists in this file, which is the rule about one word per
    concept broken in the canon itself. Jesus is the name the figure carries,
    because it is the one the eight mirror pairs already used, and the master
    list now uses it too.

    OPEN, AND HIS: whether the Crown axis is still called Revelation now that
    love rather than direct knowing stands at the top of it. */
 {k:'RE', q:'Revelation', seat:'Crown',
  up:'Jesus', upd:'Love as the highest charge. The state every other frequency reorganises around, and the one that transmutes what it meets rather than opposing it.',
  dn:'The Furies',      dnd:'Map replacing territory permanently. The belief system defended against any experience that contradicts it.',
  ask:'Can this person update their framework when direct experience contradicts it?',
  /* the same radiant he carries at the Heart, because it is the same figure
     and a second drawing would be a second concept. */
  ic:'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8a4 4 0 110 8 4 4 0 010-8',
  dic:'M4 5h16v12H4zM8 9h8M8 13h5'}];

/* ---- THE TWELVE, ON THE COORDINATE SYSTEM ----
   "Every ascended master held a specific position on the Sat, Chit
   and Ananda coordinate system. Each demonstrated the interface
   operating cleanly on their particular axis."

   Nine are placed on the axes by the codex. The other three come
   from the mirror pairs, which is how the count reaches twelve: the
   two lists overlap on five names and their union is exactly the
   twelve the book says anchor the cone. That arithmetic is stated
   in BOOK-ERRATA rather than assumed here. */
const MASTERS=[
 {nm:'Akhenaten', ax:'X',  of:'Sat apex',            was:'Truth and light',      d:'Maximum Sat. Energy conducting without distortion. The output is literal light.'},
 {nm:'Buddha',    ax:'Y',  of:'Chit apex',           was:'Wisdom and awareness', d:'Be with the emotions, do not become them. The awareness layer kept clean without identification locking the wave into a node.'},
 /* CHRIST WAS JESUS UNDER A SECOND NAME. One figure, one name, and the mirror
    pairs already used this one. */
 {nm:'Jesus',     ax:'Z',  of:'Ananda apex',         was:'Love',                 d:'Maximum expansion, the state in which every other frequency can reorganise around the coherent signal. The body is the instrument.'},
 {nm:'Krishna',   ax:'Z',  of:'Ananda in motion',    was:'Flow',                 d:'The field wants to move, and most suffering is the result of blocking that motion.'},
 {nm:'Rama',      ax:'∑', of:'all three held',  was:'Alignment',            d:'Sat, Chit and Ananda clear at once. Duty as the spine that keeps all three upright under pressure.'},
 {nm:'Lao Tzu',   ax:'⊥', of:'horizontal',      was:'Non resistance',       d:'Perpendicular to the vertical axes. Stop the activity generating the interference.'},
 {nm:'Moses',     ax:'X',  of:'Sat midpoint',        was:'Order',                d:'Where macro intelligence becomes transmissible to local intelligence as structure.'},
 {nm:'Rumi',      ax:'Z',  of:'Ananda as beauty',    was:'Beauty',               d:'The nervous system recognising coherent structure and stabilising around it. He arrived at maximum civilisational destruction.'},
 {nm:'Musashi',   ax:'∴', of:'practice layer',  was:'Discipline',           d:'Sustained application of will at the node level over time. Two steps forward, one step back. Failure as data, not judgement.'},
 {nm:'Ramakrishna',ax:'Z', of:'desire surrendered',  was:'Devotion',             d:'Wanting that moves toward something beyond the self.'},
 {nm:'Elijah',    ax:'Z',  of:'charge grounded',     was:'Fire',                 d:'Intensity moving through the body without destroying the container or the target.'},
 /* ELEVEN, AND IT IS ELEVEN ON PURPOSE NOW RATHER THAN BY ACCIDENT.

    Eckhart's row went with the ruling that took him off the mirror axis.
    Jesus carries Revelation now and he is already on this list at the Ananda
    apex, so the union did not gain a member: the codex's twelve is eleven
    distinct people until the owner names another, and the honest thing is to
    say so rather than to pad it.

    Christ and Jesus were the same figure under two names across these two
    lists, which is the one word per concept rule broken inside the canon. It
    is one name now, and unifying it did not change the count because they
    were never two people.

    BOOK-ERRATA carries the arithmetic. */];

/* ---- THE DECOHERENT BLUEPRINT, THE DQ TERMINUS ----
   "These are not mythological figures. They are behavioural modes,
   the specific ways the adversarial program expresses when it has
   replaced Source direction." */
const BLUEPRINT=[
 {nm:'Malak',   d:'Cold, structured adversarial behaviour. Organised extraction. Order in service of control, not governance. The King inverted.'},
 {nm:'Baal',    d:'Hot, chaotic, consuming. Appetite without direction. Destruction as the byproduct of appetite, not the goal. The Creator inverted.'},
 {nm:'Set',     d:'Deception and disorder from within. Operates from inside a coherent system to disrupt it rather than attacking from outside.'},
 {nm:'Lucifer', d:'Pride as separation from Source. The highest functioning adversarial expression, hardest to detect, because it uses the vocabulary of coherence in service of decoherence.'}];

/* ---- THE NINE CIRCLES, THE DESCENT ----
   Depth, governor, the pattern and where it sits in the body. The
   governors are "canonical names for patterns that existed before
   Dante and persist now. They are still recognisable because the
   patterns are still running." */
const CIRCLES=[
 {c:1, nm:'Limbo',      by:'Charon',     sin:'', see:'I do not really believe any of this works, and I am here anyway.', p:'Disbelief. Spiritual bypass through rationalism. Nothing is felt, nothing is trusted.', at:'Crown to heart circuit never completed'},
 {c:2, nm:'Lust',       by:'Minos',      sin:'Lust', see:'I need to be wanted, and I arrange things so that I am.', p:'Narcissism. Grandiose entitlement. The narcissist appoints himself arbiter of all things.', at:'Sacral, desire looping without ground'},
 {c:3, nm:'Gluttony',   by:'Cerberus',   sin:'Gluttony', see:'I consume something every time I feel the gap, and the gap is still there.', p:'Consumption as substitution. Appetite replacing connection. Each mouth feeds and none is filled.', at:'Solar collapse driving upward into the oral circuit'},
 {c:4, nm:'Greed',      by:'Plutus',     sin:'Greed', see:'I measure how I am doing by what I have managed to keep.', p:'Scarcity identity. Accumulation as self proof. Worth measured in possession.', at:'Root locked in survival frequency'},
 {c:5, nm:'Wrath and sloth', by:'Phlegyas', sin:'Wrath and sloth', see:'I either go off, or I go flat. There is not much in between.', p:'Two exits for one suppressed charge. Wrath outward as attack, sloth inward as shutdown. Same origin.', at:'Solar, the fight or freeze split'},
 {c:6, nm:'Heresy',     by:'The Furies', sin:'Pride', see:'I already know how this works, and I stop listening once I have decided.', p:'Ideological decoherence. Belief replacing direct experience. Doctrine as identity armour.', at:'Third eye locked, perception distorted by installed narrative'},
 {c:7, nm:'Violence',   by:'Minotaur',   sin:'Wrath', see:'Something in me wants to break it, and sometimes that something is me.', p:'Against others, against the self, against order. The pattern has escaped containment.', at:'Full system, no single anchor'},
 {c:8, nm:'Fraud',      by:'Geryon',     sin:'Envy', see:'What people meet is a version I run. It costs me nothing to be warm at them.', p:'Beautiful surface, serpentine beneath. Shine without a light source. The mask has become the entire operating system.', at:'Heart inverted, warmth performed rather than generated'},
 {c:9, nm:'Treachery',  by:'Satan frozen',sin:'', see:'I went against someone who trusted me, and I have not moved since.', p:'Complete inversion. No flow, no movement, maximum resistance. Stasis at terminal velocity, not active evil.', at:'Full system locked, no circuit completing anywhere'}];

/* ---- THE BEHAVIOURAL CASCADE ----
   Six named states between early decoherence and full fragmentation. */
const CASCADE=[
 {nm:'The Zombie',        d:'Passive disengagement. Going through motions without presence. Still functional, still responding, nothing is home.'},
 {nm:'The Drone',         d:'Obedience without independent thought. The system has outsourced its own navigation.'},
 {nm:'The NPC',           d:'Identity built from external narratives and approval. No interior reference point.'},
 {nm:'The Energy Vampire',d:'Extracting emotional resource from others to sustain the self. No internal generative charge. It runs on borrowed current.'},
 {nm:'The Demon',         d:'Chaotic destructive reactivity without self awareness. No gap between stimulus and response.'},
 {nm:'The Devil',         d:'Calculated manipulation and deliberate domination. Not reactive, strategic. Awareness is present and deployed against coherence.'}];

/* ---- THE ICONS FOR EVERYTHING ELSE WITH A NAME ----
   Ruled: "every figure gets an icon. Rumi, Buddha, Geryon, Moloch, all of
   them. Today they are names with marks on some and nothing on others."

   The sixteen mirror poles already carried theirs. Everything below did not,
   and it is a standing rule of this product that if a thing has a name it has
   an icon, the icon has a family and the family has a colour.

   Where a name already appears on a mirror pair the icon is REUSED rather
   than redrawn. Buddha on the master list and Buddha on the perception axis
   are one person, and drawing him twice differently is how one concept ends
   up with two marks.

   All on the same 24 unit grid as every other icon here. Ring, not fill. */
const IC_REUSE={};
MIRROR.forEach(function(m){IC_REUSE[m.up]=m.ic; IC_REUSE[m.dn]=m.dic;});
/* the ones nobody has drawn yet, each one argued from what the figure does
   rather than from what the figure looked like */
const IC_NEW={
 /* the Aten: a disc whose rays reach down and end in hands. the one image
    Akhenaten actually left, and it is light arriving rather than light held */
 'Akhenaten':'M12 3.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7M9 11.5l-2.6 5.4M12 12v6.2M15 11.5l2.6 5.4M5.4 18.4h2M11 19.6h2M16.6 18.4h2',
 /* the same radiant as illumination, because Christ and Jesus are one name
    on two lists and this product does not give one concept two marks */
 'Christ':null,
 /* flow: two waves out of phase, which is what the field does when nothing
    is blocking it */
 'Krishna':'M3 10c3-4 6 4 9 0s6-4 9 0M3 16c3-4 6 4 9 0s6-4 9 0',
 /* all three axes held at once, meeting on one spine */
 'Rama':'M12 21V9.5M12 9.5L5 4M12 9.5L19 4M12 9.5V3M6.5 14.5h11',
 /* the horizontal: a level line, and the water underneath it that goes round
    rather than through */
 'Lao Tzu':'M3 8.5h18M3 14.5c3-3.2 6 3.2 9 0s6-3.2 9 0M3 19h18'};
/* cold, structured extraction. the crown inverted, because that is what the
   codex calls it: order in service of control rather than governance */
IC_NEW['Malak']='M19 16.5l-3.6-4.2L12 18.5l-3.4-6.2L5 16.5v-9h14zM5 20h14';
/* appetite without direction. a flame with a mouth in it */
IC_NEW['Baal']='M12 21.5c-3.4 0-5.6-2.3-5.6-5.2 0-3.4 3.1-4.8 3.9-8 .4 1.8 1.5 2.8 2.5 3.5 1.5 1.3 2.3 2.5 2.3 4.5 0 2.9-1.8 5.2-3.1 5.2M9.7 16.5h4.6';
/* the judge. scales, and they are what the second circle is weighed on */
IC_NEW['Minos']='M12 4v16M6 8.5h12M6 8.5L3.5 14h5zM18 8.5L15.5 14h5zM8.5 20h7';
/* three mouths, one appetite, none of them filled */
IC_NEW['Cerberus']='M6 18.5a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2M12 18.5a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2M18 18.5a2.6 2.6 0 110-5.2 2.6 2.6 0 010 5.2M6 13.3V8M12 13.3V5.5M18 13.3V8';
/* worth measured in what has been kept. a purse, closed */
IC_NEW['Plutus']='M8 8.5h8l2.3 8.4a1.9 1.9 0 01-1.9 2.4H7.6a1.9 1.9 0 01-1.9-2.4zM9.6 8.5V7a2.4 2.4 0 014.8 0v1.5M12 12v4.2M10.6 13.2h2.8';
/* the pattern out of containment. horns, and the two legs still walking */
IC_NEW['Minotaur']='M4 5.5c0 5.2 3.6 8.4 8 8.4s8-3.2 8-8.4M4 5.5v3.2M20 5.5v3.2M8.8 13.2L7.2 19.5M15.2 13.2l1.6 6.3';
/* stasis at terminal velocity. not fire, ice: no flow, no movement, nothing
   completing anywhere */
IC_NEW['Satan frozen']='M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M12 6.2L9.6 4.4M12 6.2l2.4-1.8M12 17.8l-2.4 1.8M12 17.8l2.4 1.8';
function icOf(nm){
 if(IC_NEW[nm])return IC_NEW[nm];
 if(nm==='Christ')return IC_REUSE['Jesus']||null;
 return IC_REUSE[nm]||null;}
MASTERS.forEach(function(x){x.ic=icOf(x.nm);});
BLUEPRINT.forEach(function(x){x.ic=icOf(x.nm);});
CIRCLES.forEach(function(c){c.ic=icOf(c.by);});
/* CASCADE HAS NO ICONS AND THAT IS DELIBERATE. Nothing in the build renders
   it, so an icon there would be a path nobody draws, which is the same class
   of dead weight as the release animation that sat in the frame loop for
   weeks. It gets icons on the turn something renders it. */

/* ---- THE NARCISSISM DESCENT ----
   Three steps, and the third one is not ours to work on. The codex
   is explicit and the rule is carried into the product rather than
   left in the book: "Practitioners encountering this configuration:
   work at the fetter level. Do not attempt to address the
   structural layer. Refer to licensed clinical professionals for
   parallel support." */
const DESCENT=[
 {nm:'Narcissism',      kind:'complex',
  d:'Grandiose entitlement. The self appointed arbiter. Personal situations described in strategic terms.'},
 {nm:'Machiavellianism',kind:'hyper complex',
  d:'The narcissistic stack plus active suppression of empathy. Feeling right has become more important than feeling connected.',
  gate:'Malignancy begins where harm to others becomes instrumental.'},
 {nm:'Psychopathy',     kind:'super complex',
  d:'Structural absence of the empathy feedback loop. The Machiavellian suppresses, so there is something to suppress. This does not suppress, because harm is always a neutral option.',
  refer:true}];
const DESCENT_REFER='Work at the address. Do not work the structural layer, and say so plainly. '
 +'This configuration needs a licensed clinician alongside, not instead.';

/* ---- READING A PERSON AGAINST THE COMPASS ----
   Position on an axis is read, never asked. The coherent pole is a
   clear seat and the inverted pole is a fully loaded one, which is
   what "the client is somewhere between them on that axis" means
   arithmetically. Host free: it takes the seat load and the seat
   integrity and returns a number and the two names it sits between. */
function mirrorAt(seatLoad, seatIg){
 /* seatLoad 0 to 10 held, seatIg 0 to 10 integrity at that seat */
 var clear=1-clamp(seatLoad,0,10)/10;
 var honest=clamp(seatIg,0,10)/10;
 return Math.round(clamp(clear*0.62+honest*0.38,0,1)*100);}
/* THE DARK READ. The owner's rule: malignant plus decoherent on the
   same axis is the configuration to name. Neither alone is it. A
   high malignant share in a coherent field is a hard week; a
   decoherent field with a benign shape is somebody suffering. The
   two together is the thing the descent describes, and the product
   says so once, with the referral attached, and never as a label on
   a person. */
const DARK_MAL=0.55, DARK_CQ=31;
/* IT WAS BEING HANDED THE WRONG AXIS, AND SO IT NEVER FIRED FOR ANYBODY.

   The parameter was named outward and the only caller passed `r.outward`,
   which is the SHAPE axis: where what is running points, outward at other
   people or inward at the person. Malignancy is a different measurement and
   the engine already computes it, as `malig`, nought to a hundred.

   Everything downstream of this line reads as malignancy. The variable is
   called mal, the sentence says "the shape is malignant", and `refer` is the
   safety rule that puts a licensed clinician on the surface. So the function
   was right and the argument was wrong, which is the worst way round: it
   returned a confident false.

   Measured across the roster of fifteen before the change: nought people read
   dark. Gordon sits at CQ 1 with malignancy 98 and read false, because his
   harm points inward more than outward and outward is all this was given. The
   referral has never been shown to anybody. After the change six read dark,
   all of them under CQ 16 with malignancy 69 or higher, and every coherent
   field still reads false, Angela included, whose shape is the most outward
   in the roster at 0.87 and whose malignancy is 18.

   This file already carries the ruling that makes the old behaviour wrong:
   the material "named outward harm and gave it a face, inward harm never got
   one", and this product refuses that. Reading malignancy off the outward
   share is that same mistake wearing an argument.

   The body keeps its bodies and its signature shape. One name and one caller
   moved. */
function darkRead(mal01, CQ){
 /* mal01 is the malignancy axis, nought to one, and CQ is the coherence axis.
    Two measurements, not one twice. An unreadable shape is never dark. */
 if(mal01===null||mal01===undefined)
  return {mal:null,cq:Math.round(CQ),dark:false,step:null,refer:false,say:''};
 var mal=clamp(mal01,0,1);
 var dark=(mal>=DARK_MAL)&&(CQ<DARK_CQ);
 return {mal:Math.round(mal*100), cq:Math.round(CQ),
  dark:dark,
  /* which step of the descent, and only while both conditions hold */
  step:!dark?null:(CQ<11?DESCENT[2]:(CQ<21?DESCENT[1]:DESCENT[0])),
  refer:dark&&CQ<11,
  say:!dark?'':'The shape is malignant and the field is decoherent at the same time. '
   +'That pair is what the descent describes. It is a reading of what is running, not of who is running it.'};}
/* Which circle a descent has reached. Depth follows coherence, so
   the ladder is read off the same number everything else is. */
function circleAt(CQ){
 var q=clamp(CQ,0,100);
 if(q>=41)return null;                 /* above the median band nothing is descending */
 var i=Math.min(8,Math.floor((41-q)/41*9));
 return CIRCLES[i];}

/* ============================================================
   ORGANISED OR CHAOTIC, BENIGN OR MALIGNANT.

   The owner's model, and it is two axes rather than a ladder.

     Demon   chaos. out of control. the pattern is running the
             person and there is no gap between stimulus and
             response.
     Devil   organised, and malignant. not reactive, strategic.
             awareness is present and deployed against coherence.
     Angel   organised, and benign. a universal expression taken
             to the maximum, which is exactly what the coherent
             pole of a mirror pair is.

   His point about the fourth corner is the one that matters most
   to build correctly. "If this were religious times back in the
   twelfth century, the homeless people on the street who would
   just seem crazy, they would be considered demons. Because they
   are out of control." That is the misread the product must not
   repeat. Chaos is not malice. A person whose system is
   discharging with nothing aimed at anybody is not a demon, and
   naming them one is the oldest mistake in this material.

   So the fourth corner has a name of its own and the product uses
   it: the storm.
   ============================================================ */
const GOVERN=[
 /* THE DEVIL IS ORDINARY, which is the owner's correction and the whole point
    of naming it. "The devil, if this were the twelfth century, would be
    described as exactly this. A person who does something adversarial to
    morality. It is a stress response in the person's survival mechanism that
    is dominating. It is the resistance itself that causes you to do
    adversarial behaviour. It starts small, gets conditioned, and becomes who
    we are. A frozen nervous system acting adversarially against our
    intentions."

    So this is not a rare strategic manipulator. It is the common case of a
    conditioned pattern that has compounded into structure and now runs
    against the person's own intentions. Nothing about it requires malice and
    nothing about it requires a monster. */
 {nm:'The Devil',    org:true,  mal:true,  stack:true,
  d:'Resistance dominating, aimed outward, and compounded into structure. It starts small, gets conditioned, and becomes who we are. A frozen nervous system acting adversarially against its own intentions. This is the common case, not a rare one.'},
 {nm:'The Demon',    org:false, mal:true,  stack:true,
  d:'The same harm before it has compounded. Loose, reactive, no gap between stimulus and response and no recognition available while it runs.'},
 /* NO FIGURE FOR THIS CORNER, and its absence is the finding. Every culture
    named outward harm and gave it a face. Inward harm never got one. So this
    corner is named for what it does, plainly, because the owner's answer to
    what to call it was "inward, it is just the behaviour". */
 {nm:'Turned inward',org:true,  mal:false, stack:true,
  d:'The same conditioning, pointed at the person carrying it. Structured, repeated, and aimed at nobody else. History named outward harm and gave it a face. It never named this one, which is why it has no figure and only a description.'},
 {nm:'The Storm',    org:false, mal:false, stack:true,
  d:'Loose charge with nothing aimed at anybody. A system discharging without direction. This corner is the one mistaken for a demon for a thousand years, and it is the one that needs help rather than a name.'},
 {nm:'Angel',        org:true,  mal:false, stack:false,
  d:'One quality carried to its maximum in service of something, with nothing decoherent running underneath it. This is the coherent pole of a mirror axis rather than a fifth kind of thing, which is why the twelve read as angels and nobody reaches it by having a tidy stack.'}];
const GOV_ORG=0.5, GOV_MAL=0.5, GOV_ANGEL=71;
/* outward is the share of the firing stack that runs at other people, and
   organised is whether the will is directing or the drag is. Both nought to
   one, both read from the field, neither asked. */
function quadrant(outward,organized,CQ){
 /* NULL IS AN ANSWER, and Angel is not a corner of the stack.

    The first build had four corners over the firing stack, with organised
    and inward reading as Angel. That named a field at CQ 39 an angel, which
    is wrong twice: a stack pointed at the person carrying it is not benign,
    it is aimed at them, and an angel is a quality carried to its maximum
    rather than an absence of harm.

    So the stack has four corners and none of them is Angel. Angel is what is
    left when nothing decoherent is running at all and coherence is high,
    which is the coherent pole of a mirror axis and is reached by clearing,
    never by having a tidy stack. */
 if(outward===null||outward===undefined)
  return (CQ!==undefined&&CQ!==null&&CQ>=GOV_ANGEL)?GOVERN[4]:null;
 var mal=outward>=GOV_MAL, org=(organized||0)>=GOV_ORG;
 for(var i=0;i<GOVERN.length;i++)
  if(GOVERN[i].stack&&GOVERN[i].org===org&&GOVERN[i].mal===mal)return GOVERN[i];
 return GOVERN[3];}
/* HOW ORGANISED THE PATTERN IS.

   Not whether the will is beating the drag, which is what the first build
   measured and which made the devil unreachable: at low coherence the will
   loses, so everything adversarial came out chaotic and nobody was ever the
   devil. That contradicted the owner's own reading, where the devil is the
   ordinary case.

   Organised means the pattern has compounded. "It starts small, gets
   conditioned, and becomes who we are." The engine already walks that chain:
   loose saboteurs, then complexes, then hyper complexes, then character. The
   share of what is running that has climbed that chain is how conditioned it
   is, which is the thing the word organised was reaching for. */
const ORG_W={sab:0.2, cx:0.5, hy:0.8, sup:1};
function organisedShare(stack){
 /* HOW FAR IT HAS CLIMBED, not how the mass is split. A weighted mean was the
    first attempt and it read everybody as loose, because a field carries many
    saboteurs and one hyper complex, so the many dragged the mean to the floor
    and nothing ever reached the organised half. That is backwards: a hyper
    complex existing at all IS the conditioning, whatever else is also firing.
    So this is the deepest rung reached. A named saboteur already counts,
    because a pattern with a name is a pattern that repeats. */
 var best=null;
 (stack||[]).forEach(function(x){
  if((x.w||0)<=0)return;
  var k=ORG_W[x.kind]; if(k===undefined)return;
  if(best===null||k>best)best=k;});
 return best;}
/* Which families run at other people. Predatory and Grandiosity extract, and
   Mania is Collapse turned outward. Everything else lands on the person
   carrying it. Rigidity and Dysregulation are neither, so they are counted in
   the denominator and not in the numerator: a field made only of those is not
   malignant and must not read as half malignant. */
const FAM_OUT={Predatory:1,Grandiosity:1,Mania:1};
const FAM_IN={Collapse:1,Dissociation:1,'Self-erasure':1,Enabling:1,Numbness:1};
function outwardShare(stack){
 var out=0,tot=0;
 (stack||[]).forEach(function(x){
  var w=x.w||0; if(w<=0)return;
  if(FAM_OUT[x.hcx]){out+=w;tot+=w;}
  else if(FAM_IN[x.hcx]){tot+=w;}});
 /* null rather than nought: a field with nothing pointed either way has an
    unreadable shape, not a benign one. */
 return tot<=0?null:out/tot;}

