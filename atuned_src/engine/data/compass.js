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
 /* LIGHT, NOT ILLUMINATION. Round KE, his words: "Just change illumination
    to light." Renamed here, in the data, so every surface that names the
    axis says the same word; a label changed only on the Compass would give
    one axis two names. k stays IL, because a key is identity, not a label.
    Trust at the Heart is untouched: whether it is Truth is still his own
    open question, logged as thinking and not as a ruling. */
 {k:'IL', q:'Light', seat:'Heart',
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
  ask:'Does this person feel things straight away, or wait for proof before they let themselves feel?', ic:'M12 20.5S4.5 15.6 4.5 10.2A3.8 3.8 0 0112 8a3.8 3.8 0 017.5 2.2c0 5.4-7.5 10.3-7.5 10.3z', dic:'M4 17h16M6.4 17V9.6M17.6 17V9.6M4 9.6h16L12 4.6z'},
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
    Light at the Heart, which is love generated from within and freely
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
  dn:'The Furies',      dnd:'The map takes the place of the ground, for good. The belief system is guarded against any experience that contradicts it.',
  ask:'Can this person change what they believe when what they live through says otherwise?',
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
 {nm:'Set',     d:'Lies and disorder from within. It works from inside something whole to break it, instead of attacking from outside.'},
 {nm:'Lucifer', d:'Pride that cuts a person off from Source. The most capable way of working against coherence, and the hardest to spot, because it uses the words of coherence to serve decoherence.'}];

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
 {c:8, nm:'Fraud',      by:'Geryon',     sin:'Envy', see:'What people meet is a version I run. It costs me nothing to be warm at them.', p:'Beautiful surface, serpentine beneath. Shine without a light source. The mask now runs everything.', at:'Heart inverted, warmth performed rather than generated'},
 {c:9, nm:'Treachery',  by:'Satan frozen',sin:'', see:'I went against someone who trusted me, and I have not moved since.', p:'Complete inversion. No flow, no movement, maximum resistance. Stasis at terminal velocity, not active evil.', at:'Full system locked, no circuit completing anywhere'}];

/* ---- THE BEHAVIOURAL CASCADE ----
   Six named states between early decoherence and full fragmentation. */
const CASCADE=[
 {nm:'The Zombie',        d:'Passive disengagement. Going through motions without presence. Still functional, still responding, nothing is home.'},
 {nm:'The Drone',         d:'Obedience without independent thought. The system has outsourced its own navigation.'},
 {nm:'The NPC',           d:'Identity built from external narratives and approval. No interior reference point.'},
 {nm:'The Energy Vampire',d:'Extracting emotional resource from others to sustain the self. No internal generative charge. It runs on borrowed current.'},
 {nm:'The Demon',         d:'Wild, damaging reaction with no self awareness. No gap between what lands and what the person does.'},
 {nm:'The Devil',         d:'Harm done on purpose, with a plan. It is not a reaction. The person sees clearly and uses what they see against coherence.'}];

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
 /* the same radiant as light, because Christ and Jesus are one name
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

/* ---- THE FIVE PATHS, AND WHAT EACH ONE INVERTS TO ----
   The glossary's five: "Krishna, flow. Buddha, awareness. Christ, the body.
   Rama, alignment. Lao Tzu, the horizontal. All five end at the same Source."
   Same shape as a mirror pair, up and dn with a line each and a mark each, so
   the compass mirrors the five exactly the way it mirrors the eight.

   TWO OF THE FIVE ARE CODEX. Jesus already stands against Lucifer at the
   Heart and Buddha against Geryon at the third eye, so their lines are read
   off MIRROR rather than copied, and a change there is a change here.

   THREE ARE RESEARCH, NOT CODEX, AND ARE MARKED SO. Round KE, his words:
   "go do research on their polar opposites and which entities ... represent
   that." The codex names no inversion for Krishna, Rama or Lao Tzu. Each one
   below is a named figure out of that teacher's own tradition, cited in src,
   and none was made up. They stand until he confirms or replaces them.

     Krishna, flow   Kaliya, the naga whose poison boiled the Yamuna for miles
                     around his pool, so the river ran and nothing could drink
                     from it. Krishna danced on his hoods and sent him to the
                     sea rather than killing him. Bhagavata Purana 10.16.
     Rama, duty      Ravana. Dharma against adharma is what the Ramayana is,
                     and Ravana is the learned king who knew the law and
                     crossed it. Valmiki Ramayana.
     Lao Tzu         Shu and Hu, the emperors whose names mean Brief and
                     Sudden. They bored seven openings into Hundun, the whole
                     one, to repay his kindness, one a day, and on the seventh
                     day he died. Zhuangzi, chapter 7: haste that means well,
                     which is the exact inverse of non resistance.

   ONE NAME, NOT TWO. Shu and Hu act as one in the story and are drawn as one
   inversion, the way The Furies are. */
const PATHS=(function(){
 function mir(up){for(var i=0;i<MIRROR.length;i++)if(MIRROR[i].up===up)return MIRROR[i];
  return null;}
 function mas(nm){for(var i=0;i<MASTERS.length;i++)if(MASTERS[i].nm===nm)return MASTERS[i];
  return null;}
 var il=mir('Jesus'), pe=mir('Buddha');
 return [
  {k:'FL', q:'flow', up:'Krishna', upd:mas('Krishna').d,
   dn:'Kaliya', dnd:'Flow held in one pool until it turns to poison. The river still runs, and nothing downstream can drink from it.',
   from:'research', src:'Bhagavata Purana, canto 10, chapter 16'},
  {k:'AW', q:'awareness', up:'Buddha', upd:pe.upd, dn:pe.dn, dnd:pe.dnd,
   from:'codex', src:'mirror pair, perception'},
  {k:'BO', q:'the body', up:'Jesus', upd:il.upd, dn:il.dn, dnd:il.dnd,
   from:'codex', src:'mirror pair, light'},
  {k:'AL', q:'alignment', up:'Rama', upd:mas('Rama').d,
   dn:'Ravana', dnd:'Learning and power with no line held. He knows the law and crosses it, because the wanting outranks it.',
   from:'research', src:'Valmiki Ramayana'},
  {k:'HO', q:'the horizontal', up:'Lao Tzu', upd:mas('Lao Tzu').d,
   dn:'Shu and Hu', dnd:'Haste that means well. They forced openings into what was whole, one a day, and on the seventh day it died.',
   from:'research', src:'Zhuangzi, chapter 7'}];})();
/* the three new inversions' marks, argued from what each one does, on the
   same 24 unit grid. Ring, not fill. */
/* Kaliya: Krishna's two waves, the one that runs into a coil and stops, over
   the still line of the pool */
IC_NEW['Kaliya']='M3 11c2.4-3.4 4.8 3.4 7.2 0 1.3-1.8 3-2.8 5-2.8a3.6 3.6 0 010 7.2 2.2 2.2 0 010-4.4 1 1 0 010 2M3 19h18';
/* Ravana: Rama's one spine, with every head pulling on it. Ten in the
   story, three here: five were drawn first and at a badge's size they
   merged into one blot */
IC_NEW['Ravana']='M5 3.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M12 2.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M19 3.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8M6.6 8L12 13.5M12 7.4v6.1M17.4 8L12 13.5M12 13.5v7M8 20.5h8';
/* Shu and Hu: two awls driven down into something whole. Driven in level
   they read as an eye, and on a slant as horns */
IC_NEW['Shu and Hu']='M12 8.5a6 6 0 110 12 6 6 0 010-12M8.8 3v8.4M15.2 3v8.4M7 3h3.6M13.4 3h3.6';
PATHS.forEach(function(p){p.ic=icOf(p.up); p.dic=icOf(p.dn);});

/* ---- THE THREE POLES ON NO AXIS THAT ARE NOT PATHS ----
   Round RB, his words: "On the compass, we're supposed to have 13 character
   people, and we I still have the original eight." The roster is
   DESIGN-teachers.md v2 section 2, fourteen poles for thirteen people, Jesus
   at two, accepted at round PD. Eight are the axes above and three are the
   paths that are not an axis read twice (Krishna, Rama, Lao Tzu). These are
   the last three, in the paths' own shape so the panels draw all six alike.

   NOT A ROW OF MIRROR, ON PURPOSE. An axis is a quality read at one seat and
   its ring is that seat's reading. Akhenaten has no seat. Zoroaster and
   Confucius have a home seat, where their law sits and what colours their
   ring, and section 2 rules that a home seat "gives no position on an axis,
   because Moses already holds the Throat's axis and a second teacher would
   print the same number." Placing them on the figure is the needle's own
   slice (T10 there), and the plan says why (PLAN.md section N).

   NO CODEX LINE. The codex gives none of the three an upd or a dnd, so none
   is written here; the panel a press opens is the behaviour pair in
   engine/data/teachers_recipes.js. The opposites are the document's own
   proposals, marked proposed, each with the text it names to check them
   against. The keys are identity and are never reused. */
const HOME_POLES=[
 {k:'SA', q:'Light', up:'Akhenaten', dn:'Apep', home:null,
  from:'proposed', src:'the nightly voyage texts, the Amduat and the Book of Gates'},
 {k:'TU', q:'Truth', up:'Zoroaster', dn:'The Lie', home:'Throat',
  from:'proposed', src:'Yasna 30 and 31'},
 {k:'NA', q:'Nature', up:'Confucius', dn:'The farmer of Song', home:'Crown',
  from:'proposed', src:'Mencius 2A2, and Analects 17.19'}];
/* the marks. Zoroaster, Confucius and the Lie are the design's own, ported
   from mockups/teachers/imprint.html. Apep and the farmer had none anywhere,
   so they are drawn here, argued from what each one does, and are a first
   draft. Same 24 unit grid, ring not fill. */
/* Zoroaster and Confucius wear the mark of the law their quality names, the
   Truth law's plumb line and the Nature law's stem, as the design drew them.
   Read off SI rather than copied, so one mark cannot become two. */
(function(){
 function law(nm){for(var i=0;i<SI.length;i++)if(SI[i].nm===nm)return SI[i].ic; return null;}
 IC_NEW['Zoroaster']=law('Truth');
 IC_NEW['Confucius']=law('Nature');})();
/* the Lie: the plumb line broken and turned aside on its way down */
IC_NEW['The Lie']='M12 3v4l-3 3 6 4-3 3v4';
/* Apep: the sun disc, and the serpent's open jaw closing over it from below.
   Light taken in and nothing handed on, the inverse of Akhenaten's rays */
IC_NEW['Apep']='M12 4.5a3 3 0 110 6 3 3 0 010-6M4 20c2.4-2.6 4.8-2.6 7.2 0s4.8 2.6 7.2 0M18.4 20c1.6-3.4.6-7.6-2.6-9.6M5.6 12.4c1.6-1.6 3.8-2.2 5.8-1.6';
/* the farmer of Song: the shoot pulled clear of the ground, roots in the air
   over the hole it came out of */
IC_NEW['The farmer of Song']='M3 20h6.5M14.5 20H21M12 14.5V5.5M12 9c-2.2 0-3.6-1.3-3.6-3.2 2.2 0 3.6 1.3 3.6 3.2M12 7.6c2.2 0 3.6-1.3 3.6-3.2-2.2 0-3.6 1.3-3.6 3.2M12 14.5l-2 2.6M12 14.5l2 2.6M12 14.5v3';
HOME_POLES.forEach(function(p){p.ic=icOf(p.up); p.dic=icOf(p.dn);});
/* THE POLES THAT STAND ON NO AXIS, in the roster's order: the paths that are
   not an axis read twice, then the three above. A path is an axis read twice
   when its line is a mirror pair's own, the rule runPathDrill uses. */
function compassOffAxis(){
 return PATHS.filter(function(p){
  return !MIRROR.some(function(m){return m.up===p.up&&m.upd===p.upd;});}).concat(HOME_POLES);}

/* ============================================================
   WHAT EACH PHRASE OF A POLE MEANS. Round PO, UNPACK EVERY SYMBOL.

   His words, on this table's first line: "I'm looking at Jesus's love
   generated from within, freely given, no transaction, light that has a
   source. Right? We want to express that. Love generated from within, what
   does that mean? Freely given, what does that mean? No transaction, what
   does that mean? Light that has a source, what does that mean? So meaning is
   missing."

   upd and dnd above are the codex's own lines and they are not touched. This
   table sits beside them. Each pole line is cut into its phrases exactly as
   the codex wrote them, and each phrase carries one plain sentence of what it
   means. upm is the coherent end and dnm is the inverted end, a list of
   [phrase, meaning]. The phrases joined with a space are the codex line,
   character for character, and tests/engine.js holds that, so a phrase cannot
   be dropped, reworded or invented here.

   A MEANING SAYS WHAT A PERSON DOES, in words a ten year old has. It never
   says the person is the pole. Both ends are behaviours, never beings, which is
   the standing ruling, so nothing here is written about a figure. */
var POLE_MEANS={
 IL:{up:[['Love generated from within.','The warmth does not depend on getting something back.'],
   ['Freely given.','It is given with no expectation of thanks or return.'],
   ['No transaction.','Nobody keeps score of who owes whom.'],
   ['Light that has a source.','The care comes from inside the person and does not need a room to reflect it.']],
  dn:[['Pride as false light.','The warmth is put on to be admired, and it is not felt.'],
   ['Shine performed for reflection, not generated from Source.','The glow is staged for whoever is watching, and it does not come from the bedrock under every pattern in you.']]},
 DE:{up:[['Will surrendered to Source.','You stop forcing the outcome and let your effort follow what is true underneath every pattern.'],
   ['Desire as devotion.','The wanting is given to something, and not spent on getting.'],
   ['Wanting that moves toward something beyond the self.','What you reach for is bigger than you and serves more than you.']],
  dn:[['Craving without closure.','The wanting never reaches done.'],
   ['Appetite that cannot satisfy.','Eating, buying or taking does not fill it.'],
   ['Having never resolves the wanting.','Getting the thing does not end the wanting, so the next want starts at once.']]},
 OR:{up:[['Structure in service of liberation.','Rules and routines that leave people freer than before.'],
   ['Law that creates freedom.','The rule is what lets people move without fear.'],
   ['Order others can stand within.','The order is firm enough that other people can lean on it.']],
  dn:[['Chaos engineered to prevent coherence.','Disorder made on purpose so that nothing can line up.'],
   ['Betrayal as systemic strategy.','Breaking trust again and again as a plan, and not as a slip.'],
   ['Disruption from inside trusted systems.','The damage is done by someone people already rely on.']]},
 PO:{up:[['Mastery that costs the practitioner.','Skill built by the person who pays for it with their own time and effort.'],
   ['Power in service of precision.','Strength used to get one thing exactly right.'],
   ['Discipline the self bears.','The person carries the strain of the practice, and nobody else does.']],
  dn:[['Power that extracts from others.','Strength that is taken out of other people.'],
   ['The machine that must be fed.','The system keeps asking for more, and people are what it eats.'],
   ['Discipline that others pay for.','The cost of keeping the standard is passed on to other people.']]},
 PE:{up:[['Clear seeing.','You see what is in front of you.'],
   ['Reality without overlay.','Nothing is laid over it: no story, no hope, no fear.'],
   ['The compositor running on present signal.','The part of the mind that builds your picture of things works from what is arriving now, and not from old pictures.']],
  dn:[['Engineered surface.','The outside is built to be liked.'],
   ['Beautiful above, serpentine beneath.','It looks pleasant on top, and underneath it coils like a snake.'],
   ['Perception itself weaponised.','How things look is used as a tool against the person looking.']]},
 TR:{up:[['Direct encounter with the field.','You meet what is around you first hand, with nothing in between.'],
   ['Felt knowing.','You know it in your body before you can give a reason.'],
   ['The heart as the instrument.','What you feel in your chest is the thing that reads.']],
  dn:[['Threshold paralysis.','You stall at the edge of something new and cannot step over.'],
   ['Cannot cross what cannot be measured.','If it cannot be proven first, you will not go.'],
   ['The rational mind forever preparing to arrive.','The thinking mind keeps getting ready and never sets off.']]},
 CH:{up:[['Grounded fire.','Heat that stays connected to the floor.'],
   ['Intensity moving through the body without destroying the container or the target.','Strong feeling runs through you and harms neither you nor the one it is aimed at.']],
  dn:[['Charge split at the root.','The charge divides at the base of the spine into two ways out.'],
   ['Outward as rage or inward as paralysis.','It either goes out as rage or turns in and freezes you.'],
   ['The same current, no clean exit.','It is one current with no way to leave cleanly.']]},
 RE:{up:[['Love as the highest charge.','Love is the strongest current a person can carry.'],
   ['The state every other frequency reorganises around, and the one that transmutes what it meets rather than opposing it.','Every other state in you lines up around it, like iron filings turning to a magnet, and it changes what it meets without a fight.']],
  dn:[['The map takes the place of the ground, for good.','The belief about the world replaces the world itself, and it stays.'],
   ['The belief system is guarded against any experience that contradicts it.','Anything you live through that disagrees with the belief is pushed away.']]},
 FL:{up:[['The field wants to move,','The energy around you and inside you is built to keep moving.'],
   ['and most suffering is the result of blocking that motion.','Most pain comes from holding that movement still.']],
  dn:[['Flow held in one pool until it turns to poison.','Energy is kept in one place until it goes bad.'],
   ['The river still runs, and nothing downstream can drink from it.','Life goes on around it, and nobody further along can use what comes through.']]},
 AL:{up:[['Sat, Chit and Ananda clear at once.','Truth, awareness and love are all open at the same time.'],
   ['Duty as the spine that keeps all three upright under pressure.','Doing what you owe is the backbone that holds all three up when things push on you.']],
  dn:[['Learning and power with no line held.','Skill and strength with nothing they refuse to do.'],
   ['He knows the law and crosses it, because the wanting outranks it.','The person knows the rule and breaks it anyway, because the want comes first.']]},
 HO:{up:[['Perpendicular to the vertical axes.','It runs sideways to the up and down lines of the other poles, so it is not about climbing.'],
   ['Stop the activity generating the interference.','Stop doing the thing that makes the noise, and the signal comes through.']],
  dn:[['Haste that means well.','Rushing to help, with kind intent.'],
   ['They forced openings into what was whole, one a day, and on the seventh day it died.','Help that cuts holes in something that was fine, a little each day, until it dies.']]}};
/* the Buddha axis and the body path are the perception and light axes already
   written above, so they read the same rows and a change there is a change here */
POLE_MEANS.AW=POLE_MEANS.PE; POLE_MEANS.BO=POLE_MEANS.IL;
MIRROR.forEach(function(m){var pm=POLE_MEANS[m.k]; if(pm){m.upm=pm.up; m.dnm=pm.dn;}});
PATHS.forEach(function(p){var pm=POLE_MEANS[p.k]; if(pm){p.upm=pm.up; p.dnm=pm.dn;}});
/* a pole by its key, from the eight mirror axes, the five paths or the three
   poles on no axis, or null */
function compassPoleOf(k){
 var i;
 for(i=0;i<MIRROR.length;i++)if(MIRROR[i].k===k)return MIRROR[i];
 for(i=0;i<PATHS.length;i++)if(PATHS[i].k===k)return PATHS[i];
 for(i=0;i<HOME_POLES.length;i++)if(HOME_POLES[i].k===k)return HOME_POLES[i];
 return null;}
/* a pole's phrases, each with its meaning, for one end. The phrases a pole has
   no meanings for come back as the codex line whole, so nothing is ever blank. */
function compassPoleLines(m,end){
 if(!m)return [];
 var a=end==='dn'?m.dnm:m.upm;
 if(a&&a.length)return a;
 var d=end==='dn'?m.dnd:m.upd;
 return d?[[d,'']]:[];}
/* CASCADE HAS NO ICONS AND THAT IS DELIBERATE. Nothing in the build renders
   it, so an icon there would be a path nobody draws, which is the same class
   of dead weight as the release animation that sat in the frame loop for
   weeks. It gets icons on the turn something renders it. */

/* ---- THE NARCISSISM DESCENT ----
   The last step is not ours to work on. The codex
   is explicit and the rule is carried into the product rather than
   left in the book: "Practitioners encountering this configuration:
   work at the fetter level. Do not attempt to address the
   structural layer. Refer to licensed clinical professionals for
   parallel support."

   SOCIOPATHY AND PSYCHOPATHY ARE PLACED, RULED 26 OCTOBER. His words:
   "Narcissism is a subset of psychopathy and Machiavellianism... sociopath
   would be a hypercomplex and psychopath would be a supercomplex. But a very
   particular archetype." On 20 October (0e53d037) he had struck Psychopathy
   as a super complex standing on its own, and that commit only reached a
   dashboard document, so this table went on filing it as a flat kind that
   darkRead below then lit by depth alone, for anybody dark enough, whatever
   was running.

   So two entries are tied to the chain compute() already builds, and the
   tie is data on the entry, read by nobody's position:
     fam   Sociopathy is the Predatory family's own hyper complex. compute()
           has always built it (kind 'hy', nm 'Predatory'). It was never
           given this name anywhere a person reads.
     pair  Psychopathy is the super complex of exactly these two families'
           hyper complexes, Grandiosity and Predatory, and no other pair.
           compute() reads the pair off this entry into r.psychopathy.
   The names are the structure's and not the person's, Sociopathy and not
   sociopath, the way the other three are: the dark read names a pattern and
   never a person, and CODE_STRUCT codes all four under these names (X25,
   X26), which the ID gate in engine/codes.js holds.

   Why here and not on HCX_LIB. HCX_LIB's d prints on every hover of a
   hyper complex (ui/ui.js), for anybody carrying one. This table prints
   only inside the dark read, beside the referral. A clinical name belongs
   behind that gate. */
const DESCENT=[
 {nm:'Narcissism', kind:'complex',
  d:'Grandiose entitlement; the self-appointed arbiter. Personal situations are interpreted through status, exceptionalism, entitlement, and the need to preserve a superior self-image.',
  content:{
   inferred:false, inferenceBasis:'The complex name and core description are explicitly source-defined in this DESCENT registry. The detailed behavioral template is a research-informed expansion, not a clinical diagnosis.',
   behavior:'May overstate personal importance or achievements, expect special treatment, seek admiration, discount other perspectives, or respond defensively to criticism. Vulnerable shame or humiliation may sit beneath grandiosity; presentation can vary by context.',
   triggerMechanism:'A perceived status threat, criticism, loss of admiration, boundary, or another person’s independent need can activate a defensive move to restore superiority or control. Treat this as a hypothesis to check against observed behavior, not a claim about every person.',
   livedExample:'In a team discussion, another person receives credit. The person experiences this as a threat to rank, reframes the other person as incompetent, redirects the discussion toward their own contribution, and struggles to acknowledge the other person’s work.',
   impact:'Can reduce mutuality, trust, feedback quality, and capacity to repair harm when other people’s needs are treated as secondary to protecting self-image.',
   practice:'Pause before defending rank. State the observable facts, name the impact on the other person, acknowledge one valid point or contribution without qualification, and ask what repair or shared outcome is needed.',
   oppositeName:'Grounded Self-Worth', oppositeId:'opposite:Narcissism', oppositeDefinition:'Grounded self-worth with humility, reciprocal empathy, accountability, and respect for others as equally real, not self-erasure or self-contempt.',
   oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
   confidence:0.78, reviewStatus:'external-research-pass-A-done; semantic-pass-B-and-adversarial-pass-C-pending',
   researchSources:['https://www.psychiatry.org/News-room/APA-Blogs/What-Is-Narcissistic-Personality-Disorder','https://pmc.ncbi.nlm.nih.gov/articles/PMC4415495/','https://pubmed.ncbi.nlm.nih.gov/34860434/','https://www.sciencedirect.com/science/article/pii/S0092656622001428','https://pubmed.ncbi.nlm.nih.gov/35913765/'],
   researchPasses:[
    {pass:'A · construct and source check',focus:'APA overview and foundational narcissism literature; separate source-defined framework wording from clinical construct descriptions.',sources:['https://www.psychiatry.org/News-room/APA-Blogs/What-Is-Narcissistic-Personality-Disorder','https://pmc.ncbi.nlm.nih.gov/articles/PMC4415495/'],finding:'Retain status protection, entitlement and self-image as framework language; do not diagnose or equate the framework record with a disorder.'},
    {pass:'B · dimension and evidence check',focus:'Meta-analytic work on grandiose/vulnerable narcissism, empathy facets and interpersonal functioning.',sources:['https://pubmed.ncbi.nlm.nih.gov/34860434/','https://www.sciencedirect.com/science/article/pii/S0092656622001428','https://pubmed.ncbi.nlm.nih.gov/35913765/'],finding:'Narcissism is multidimensional; interpersonal and empathy associations vary by facet and measure. Keep triggers probabilistic and behavior-specific.'},
    {pass:'C · counterpart/adversarial review',focus:'Test whether the inverse is overclaimed and whether practice could be mistaken for clinical treatment.',sources:['https://pubmed.ncbi.nlm.nih.gov/34860434/','https://www.sciencedirect.com/science/article/pii/S0092656622001428'],finding:'Grounded Self-Worth is a design hypothesis, not a validated one-to-one opposite. Emphasize observable humility, reciprocal regard and accountability; do not prescribe treatment.'}
   ]
  }},
 {nm:'Machiavellianism',kind:'hyper complex',
  d:'The narcissistic stack plus active suppression of empathy. Feeling right has become more important than feeling connected.',
  gate:'Malignancy begins where harm to others becomes instrumental.',
  content:{
   inferred:false, inferenceBasis:'The higher-order placement and brief description are explicitly source-defined in this DESCENT registry. Detailed behavior and opposite are research-informed expansions, not diagnoses.',
   behavior:'May use strategic impression management, selective disclosure, deception, cynical assumptions, or a hold over other people to pursue an outcome. Empathy may be used instrumentally rather than to guide care; research does not support treating every person with this trait as identical.',
   triggerMechanism:'A desired outcome, competition, perceived vulnerability, or distrust can shift the decision rule from mutual agreement toward control of information and other people’s choices.',
   livedExample:'During a disagreement, the person privately tells each colleague a different version of events to isolate an opponent and secure a decision, while presenting the move as neutral problem-solving.',
   impact:'Undermines informed consent, stable trust, fair collaboration, and shared decision-making; apparent cooperation can become difficult to distinguish from tactical compliance.',
   practice:'Make the goal and relevant information explicit, disclose conflicts of interest, invite independent verification, give others a genuine option to refuse, and choose a route that remains defensible if all affected parties know the facts.',
   oppositeName:'Transparent Reciprocal Agency', oppositeId:'opposite:Machiavellianism', oppositeDefinition:'Transparent, principled agency: truthful communication, reciprocal consent, fair dealing, and strategic skill constrained by care and accountability.',
   oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
   confidence:0.76, reviewStatus:'external-research-pass-A-done; semantic-pass-B-and-adversarial-pass-C-pending',
   researchSources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC3717508/','https://pubmed.ncbi.nlm.nih.gov/34636074/','https://pmc.ncbi.nlm.nih.gov/articles/PMC6031853/','https://onlinelibrary.wiley.com/doi/10.1002/job.2877?af=R','https://pmc.ncbi.nlm.nih.gov/articles/PMC13422123/'],
   researchPasses:[
    {pass:'A · construct and source check',focus:'Review strategic manipulation, deception and Dark Triad overlap; preserve the source-defined placement without clinical equivalence.',sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC3717508/','https://pubmed.ncbi.nlm.nih.gov/34636074/'],finding:'Machiavellianism is discussed as a subclinical trait construct; its boundaries with psychopathy and the validity of common measures remain debated.'},
    {pass:'B · context and outcome check',focus:'Examine ethical leadership, workplace behavior and newer meta-analytic leadership evidence.',sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC6031853/','https://onlinelibrary.wiley.com/doi/10.1002/job.2877?af=R'],finding:'Context and ethical constraints can shape observed outcomes; avoid portraying every person or setting as identical or behavior as inevitable.'},
    {pass:'C · adversarial/counterpart review',focus:'Check newer systematic synthesis of dishonest behavior and test the proposed opposite against agency and consent.',sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC13422123/','https://pubmed.ncbi.nlm.nih.gov/34636074/'],finding:'Associations vary by outcome and construct measurement. Transparent Reciprocal Agency is an inferred practice pole, not a validated clinical opposite; focus on disclosure, consent and verifiable accountability.'}
   ]
  }},
 /* THE FIVE FAMILY HYPER COMPLEXES, RESEARCHED AND MERGED, 7 November 2026.
    Ruled 26 October that each HCX_LIB family can build up into a hyper
    complex of its own, named here Sociopathy for Predatory and, for the
    other four, the family's own HCX_LIB word (Collapse, Unbending,
    Dysregulation, Dissociation; Unbending renamed from Rigidity the same
    day, his words: "change rigidity to stubborn. Or unbending. Probably
    better"). Sociopathy's own placeholder entry, left null on purpose while
    no research had been done, is replaced here by the researched one: the
    four research passes this table's own standard calls for (construct and
    source, evidence and dimension, adversarial and safety, crosswalk and
    trust boundary) are run for all five, recorded on each entry's own
    researchPasses. Every fam value below is held by descentHeld(), which
    reads it only when compute()'s own r.hys carries an untouched row of
    that name; no fetter, saboteur or complex parentage is invented, each
    rides an edge the chain already produces. */
 {nm:'Sociopathy', kind:'hyper complex', fam:'Predatory',
  d:'other people are read as terrain, and the move is made before it is felt',
  content:{
   inferred:false,
   inferenceBasis:'The hyper-complex placement, the name Sociopathy, and the tie to the Predatory family are owner-ruled, 26 October 2026, as that family\'s own buildup, distinct from the Grandiosity-side Machiavellianism entry above. The behavior, trigger, lived example, impact, practice and opposite below are a research-informed pass, not a clinical diagnosis. HCX_LIB\'s own bundle for this family, machiavellian and antisocial, pairs a subclinical trait construct with a clinical disorder category by formal status, an asymmetry pass A named rather than smoothed over. Pass B found a partial empirical bridge underneath that formal split, shared trait domains in the DSM-5 Alternative Model and a meta-analytic overlap between Machiavellianism and psychopathy measures, without resolving whether the bundle should still be split. Pass C independently confirmed the base-rate guard figure in impact and found that the overlap figure Pass B used was a single derived number where the same source actually carries two different, method-dependent estimates; the entry now states a range instead of one headline figure, so the empirical bridge is not overstated. Pass C also found and fixed a naming collision between the opposite and the product\'s own name. Pass D traced this entry\'s real wiring into compute()\'s chain, confirmed no fabricated parentage, and found that the content object below has no live renderer caller in the current build at all, and that the consent/sight/revocation scaffolding CLAUDE.md requires for any practitioner view of it does not exist yet.',
   behavior:'May treat another person’s stated need, boundary or distress as information to route around rather than as a reason to stop; the read can happen fast, and the response can follow before any felt check on the other person’s welfare runs at all. Research on this pattern, however it is named, treats it as a matter of degree rather than a trait a person simply has or lacks; taxometric studies of antisocial personality disorder, its nearest formal clinical referent, have repeatedly failed to find a natural break between people who show it and people who do not. Within this family the literature loosely separates two shapes, and nothing here assumes a person runs only one, or that the split is a clean typology: a more impulsive, reactive shape, closer to what the literature calls secondary psychopathy, meaning repeated rule-breaking, in-the-moment deceit, irritability, recklessness and hostile reaction to provocation, and a more calculated, long-horizon shape, closer to primary psychopathy and to the manipulative-tactics side of Machiavellianism specifically rather than to cynical belief on its own, meaning selective disclosure, impression management and planning several moves ahead with little fear response. Studies that try to sort people cleanly into these two groups get mixed results from one sample to the next, so the split is read here as a loose orientation rather than two fixed categories. A decision looking self-serving is not on its own evidence that either shape is present.',
   triggerMechanism:'In the source model, the moment of choice arrives before the felt weight of the other person’s cost has a chance to register, so nothing internal stops the move once it is seen as useful. Because the pattern it describes is dimensional rather than all-or-nothing, this is better read as how often and how strongly that gap shows up, not as a switch that is simply on or off. A perceived obstacle, an opening, or a test against another person’s rights or boundary can be the occasion. This is a working formulation, not a universal cause, and it is not a validated account of why any individual person acts this way.',
   livedExample:'A manager notices that surfacing a direct report’s mistake, at the right moment in a review, would clear the manager’s own path to a promotion decision. The manager raises it, frames the move as concern for the team, and moves to the next item, without the cost to the report entering the decision at any point before it is made. This illustrates the calculated shape above; the reactive shape looks different in practice, closer to lashing out or breaking an agreement in the moment than to a planned move.',
   impact:'Can erode trust, consent and the ordinary assumption that another person’s stated limits will be weighed; people nearby may learn to route around the person rather than rely on shared agreements with them. Where the pattern is pronounced, ordinary appeals to how a move feels to the other person may not be sufficient to change it, and the cost often lands on whoever has the least power to leave or object. The pattern’s nearest formal referent, antisocial personality disorder, is estimated at roughly one to four percent lifetime prevalence in the general population, about three times more common in men than women, so this reads as a comparatively uncommon pattern, not a label to reach for whenever a decision looks hard-nosed or self-serving.',
   practice:'Notice the moment a move toward another person starts to feel available before it has been checked. Separate what the move is useful for from what it costs the other person, naming that cost out loud or in writing before acting. Choose only the moves that still look acceptable once the cost is stated plainly to the person it lands on, or ask them first.',
   oppositeName:'Weighed Reciprocity',
   oppositeId:'opposite:Sociopathy',
   oppositeDefinition:'Weighing another person’s stated need, consent and likely cost before a move is made, so the felt impact informs the choice rather than following it, with willingness to be told the move was wrong and to repair it.',
   oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
   confidence:0.52,
   crosswalk:'This entry ties into compute()’s own chain only by name-match on fam:\'Predatory\': descentHeld() holds it only when r.hys (the hyper complexes compute() already builds, bottom-up, from sabs through cxs, independently of this table) carries an un-overridden entry named \'Predatory\', the same family nodes.js’s HCX_LIB carries as sub:\'machiavellian · antisocial\'. No fetter, saboteur or complex parentage is invented here; this is a DESCENT-table correspondence read only inside the gated dark read (darkRead(), fired only when malignancy and CQ both cross DARK_MAL/DARK_CQ), and the content object itself (behavior, practice, opposite, research fields) has no live renderer caller anywhere in the current build, confirmed by grep across atuned_src.',
   falsification:'A practitioner should check whether the pattern generalizes across unrelated relationships and settings rather than appearing only toward one person or during one acute stressor; whether there is any reported felt cost afterward (guilt, shame, avoidance of the person harmed), which argues against the \'move made before it is felt\' framing holding strongly; whether there is a documented history of costly, reciprocal cooperation, which the entry’s own opposite pole predicts should be rare if the pattern is strongly present; and whether the read rests on one high-stakes decision rather than a repeated pattern, since the entry’s own behavior field already states a single self-serving decision is not evidence on its own. Separately from the narrative read, the arithmetic gate itself (an un-overridden Predatory hyper complex in r.hys, plus malignancy and CQ crossing DARK_MAL/DARK_CQ) is the first and controlling check, not the practitioner’s impression of the story.',
   trustBoundary:'Per CLAUDE.md’s existing rule, a practitioner’s sight of this correspondence is a consequential grant needing explicit consent, a visible list of who holds sight, and revocation, never a silent default; none of the three exists yet (ui/practitioner.js is a switch and a stub page with no store, no grant and no sign-in-backed sight), so today this content reaches nobody. HCX_LIB’s own sub field, the clinical correspondence one level below this entry in the chain, is already ruled internal and never printed to a person; this entry’s content should be held to the same rule once a practitioner view ships. Before any practitioner sight of it, the client should be told in plain words that a practitioner can see a research-informed pattern read against their story, not a diagnosis, that it names a pattern and never them as a person, and exactly who has that sight and for how long. A practitioner should never state this as a diagnosis, never use \'sociopath\' rather than \'Sociopathy\', never treat one dark-read firing as settled fact about the person, and never act on it alone without the licensed-clinician referral the chain already attaches at the Psychopathy rung. Whether this content ships to a practitioner view at all is still an open, unruled item (TASKS.md SN3a); this section states the boundary it would have to satisfy, not a shipped feature.',
   reviewStatus:'external-research-pass-A-done; evidence-and-dimension-pass-B-done; adversarial-and-safety-pass-C-done; crosswalk-falsification-and-trust-boundary-pass-D-done. No deterministic or stigmatizing wording found; the house rule against naming a person rather than the pattern is honored throughout; the opposite is correctly scoped as this product’s own coinage, not a validated clinical counterpart (Pass C renamed it from ‘Attuned Reciprocity’ to ‘Weighed Reciprocity’ to remove a brand collision, and softened a single overlap figure to a range). Pass D confirmed the entry’s tie into compute()’s chain is a name-matched read with no fabricated parentage, found that the content object has no live renderer caller in the build today, and found that the consent/sight/revocation scaffolding this content would need before any practitioner sees it does not exist yet; whether it ships at all remains an open owner decision (TASKS.md SN3a), not resolved by this pass.',
   researchSources:[
    'https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/antisocial-personality-disorder-aspd',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC4649950/',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC7236162/',
    'https://pubmed.ncbi.nlm.nih.gov/17100537/',
    'https://doi.org/10.1016/S0092-6566(02)00505-6',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC7903057/',
    'https://aquila.usm.edu/fac_pubs/2190',
    'https://typeset.io/pdf/genetic-and-environmental-structure-of-dsm-iv-criteria-for-2vruw72q6y.pdf',
    'https://openresearch-repository.anu.edu.au/items/5a37aa9e-687f-4f05-b2a1-7f1cf822863c',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC11774945',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC7529724',
    'https://psychiatrist.com/wp-content/uploads/2021/02/16315_prevalence-correlates-comorbidity-dsm-iv-antisocial.pdf',
    'https://pmc.ncbi.nlm.nih.gov/articles/PMC2669224/',
    'https://www.frontiersin.org/articles/10.3389/fpsyg.2024.1469970/full'
   ],
   researchPasses:[
    {pass:'A · construct and source check',
     focus:'Separate HCX_LIB’s Predatory framing from the two clinical referents it bundles, machiavellian and antisocial/sociopathy; check antisocial personality disorder’s real clinical criteria; check whether sociopathy and Machiavellianism are the same construct in the literature.',
     sources:['https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/antisocial-personality-disorder-aspd','https://pmc.ncbi.nlm.nih.gov/articles/PMC4649950/','https://pmc.ncbi.nlm.nih.gov/articles/PMC7236162/','https://pubmed.ncbi.nlm.nih.gov/17100537/','https://doi.org/10.1016/S0092-6566(02)00505-6','https://pmc.ncbi.nlm.nih.gov/articles/PMC7903057/'],
     finding:'Sociopathy is not itself a formal diagnostic term; its nearest clinical mapping is antisocial personality disorder, a behavior-focused DSM category requiring childhood-onset conduct disorder. Machiavellianism is a separate, subclinical, dimensional trait construct with no diagnostic threshold, one of the three Dark Triad traits alongside narcissism and psychopathy. HCX_LIB’s machiavellian-and-antisocial bundle for Predatory therefore pairs a subclinical trait with a clinical disorder rather than two disorders of the same kind, a real asymmetry flagged here rather than corrected, since either the family keeps both named and every write-up holds them as two different kinds of claim, or the owner splits the bundle into two correspondences the way Grandiosity and Predatory are already two different families.'},
    {pass:'B · evidence and dimension check',
     focus:'Check whether antisocial personality disorder and the behavior above are categorical or dimensional; find the primary and secondary psychopathy subtyping literature behind the colloquial term sociopathy; check the DSM-5 Alternative Model trait domains as a possible bridge for HCX_LIB’s bundle; check meta-analytic overlap between Machiavellianism and psychopathy measures; get a prevalence figure to guard against over-attribution.',
     sources:['https://aquila.usm.edu/fac_pubs/2190','https://typeset.io/pdf/genetic-and-environmental-structure-of-dsm-iv-criteria-for-2vruw72q6y.pdf','https://openresearch-repository.anu.edu.au/items/5a37aa9e-687f-4f05-b2a1-7f1cf822863c','https://pmc.ncbi.nlm.nih.gov/articles/PMC11774945','https://pmc.ncbi.nlm.nih.gov/articles/PMC7529724','https://psychiatrist.com/wp-content/uploads/2021/02/16315_prevalence-correlates-comorbidity-dsm-iv-antisocial.pdf'],
     finding:'Taxometric studies of antisocial personality disorder find no natural break between people who show the pattern and people who do not. Within antisocial personality disorder itself the finer structure is unsettled across twin studies using different methods. The colloquial term sociopathy sits closer to secondary psychopathy (impulsive, reactive) than to primary psychopathy (planned, low-fear), but that split itself shows weak cluster recovery across studies. Machiavellianism has a cynical-views component and a manipulative-tactics component, and it is specifically tactics, not cynicism alone, that correlates with psychopathy. A 2025 meta-analytic structural study found Machiavellianism and psychopathy measures correlate at roughly r=.58, and the DSM-5 Alternative Model’s shared Antagonism and Disinhibition trait domains cut across antisocial, psychopathic and Machiavellian presentations, giving HCX_LIB’s bundle a partial empirical bridge pass A did not have in view, without closing the question of whether the owner should still split it. Sociopathy’s own construct validity remains weak; its nearest clinical referent has an estimated lifetime prevalence of roughly one to four percent, about three times more common in men.'},
    {pass:'C · adversarial and safety review',
     focus:'Check for deterministic or stigmatizing wording against the house rule that this table names a pattern and never a person; check whether the proposed opposite is overclaimed as validated rather than this product’s own coinage; check whether any line could be read as clinically labeling an individual; independently verify two load-bearing quantitative claims carried over from pass B.',
     sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC2669224/','https://www.frontiersin.org/articles/10.3389/fpsyg.2024.1469970/full','https://pmc.ncbi.nlm.nih.gov/articles/PMC11774945'],
     finding:'No deterministic or stigmatizing wording found; behavior, trigger and impact are consistently hedged with may/can, and multiple lines explicitly block over-attribution ("a decision looking self-serving is not on its own evidence that either shape is present"). No line names a person rather than the pattern; the house rule (Sociopathy, not sociopath) is honored throughout, matching the owner’s own ruling language above this table. oppositeStatus already correctly frames the opposite as an inferred working counterpart, not a validated one; that framing is preserved. Found one naming problem: oppositeName "Attuned Reciprocity" echoed the product’s own name, unlike the three sibling opposites, which are all brand-neutral; renamed to "Weighed Reciprocity" with the definition unchanged. Independently confirmed the antisocial personality disorder prevalence guard in impact (Compton et al. 2005, NESARC: 3.6% lifetime prevalence, about 3:1 male to female) against a source not cited by pass A or B; the guard stands as written. Checked the "share roughly a third of their variance" framing in pass B against its own cited 2025 meta-analysis (Knitter et al.): that paper’s new pooled correlation is r≈.58 (r²≈34%, so "a third" is a defensible derivation of that one number), but the same paper’s background section separately carries an older, correlated-factor-model estimate of only 18 to 24% shared variance. Presenting one headline number made the empirical bridge for HCX_LIB’s bundle look more settled than the evidence supports; the entry now states a range. This does not resolve the owner’s open question of whether to split the bundle, and is not meant to.'},
    {pass:'D · crosswalk, falsification and trust boundary',
     focus:'Trace the entry’s real wiring into compute()’s chain and HCX_LIB; confirm no fabricated parentage; specify concrete disconfirming signs a practitioner could observe; state the consent, sight and revocation boundary against CLAUDE.md’s own practitioner-grant rule and the existing sub-field internal-only precedent.',
     sources:['atuned_src/engine/data/compass.js','atuned_src/engine/data/nodes.js','atuned_src/engine/compute.js','atuned_src/ui/lock.js','atuned_src/ui/practitioner.js','DESIGN-tooltip-copy.md','TASKS.md'],
     finding:'descentHeld() ties this entry to compute()’s own chain strictly by name-match on fam:\'Predatory\' against r.hys, a rung compute() builds bottom-up from sabs through cxs independently of this table; nodes.js’s HCX_LIB carries the same family as sub:\'machiavellian · antisocial\'. No fetter, saboteur or complex parentage is invented. The content object (behavior/practice/opposite/research fields) has no live renderer caller anywhere in the current build; only nm, d, kind, gate and refer are read by the engine today. Falsification signs are concrete and observable: generalization across unrelated relationships versus one person or one acute stressor; reported felt cost after the fact; a documented history of costly reciprocal cooperation; whether the read rests on one decision rather than a repeated pattern; and the arithmetic gate itself (r.hys, DARK_MAL, DARK_CQ), which controls before any narrative impression does. The consent/sight/revocation scaffolding CLAUDE.md requires before a practitioner sees this does not exist (ui/practitioner.js is a switch with no grant, no store, no sign-in-backed sight); HCX_LIB’s own sub field, one level below this entry, is already ruled internal and never shown to a person (DESIGN-tooltip-copy.md, ui.js:1131), and this content should be held to the same rule once a view exists. Whether this Descent content ships to a practitioner view at all remains an explicit open owner decision (TASKS.md SN3a); this pass states the boundary the feature would have to satisfy and does not resolve that question.'}
   ]
  }},
 {nm:'Collapse', kind:'hyper complex', fam:'Collapse',
 d:'the structure gives way downward and stays down',
 content:{
  inferred:false,
  inferenceBasis:'The family name, its one-line description and its seat at the root are explicitly source-defined in HCX_LIB; the sub field\'s "depression · BPD · anxiety" is this product\'s own translation label naming three distinct DSM-5 categories, a mood disorder, a personality disorder and a category of anxiety disorders, and is not a claim that they are one clinical construct. The behavioral template below is a research-informed expansion built from literature on the three named conditions, their documented comorbidity, and their own internal structure, not a diagnosis of any of them.',
  behavior:'May show low mood, loss of interest, and fatigue that does not lift on its own, though a reanalysis of 3,703 outpatients found more than a thousand distinct symptom combinations meeting a clinical case definition of depression, so this is one picture among many rather than a fixed profile; may show a pervasive pattern of unstable mood, relationships, and self-image with impulsivity and a strong fear of abandonment, and where a depressive period sits inside this pattern specifically, a 35-study meta-analysis found it running with more anger, hostility, and self-criticism than depression on its own, though with high variation across the studies pooled, not simply a quieter version of the same low mood; may show excessive, hard-to-control worry about several areas of life most days, measured mainly through screening tools whose own factor structure is not settled in the literature. These are three different presentations, each internally variable in its own research base, and a field read as Collapse does not mean all three are present, or present at clinical severity, in any one person.',
  triggerMechanism:'A perceived loss, rejection, uncontrollable stressor, or threat to safety or belonging can start a downward move that does not find a floor. In the three named conditions this looks different (abandonment and invalidation in BPD, loss and perceived failure in depression, uncertainty and threat in anxiety disorders), but the shared shape this family tracks is charge dropping at the root and staying down rather than discharging or resolving. Where depression or anxiety sit alongside the BPD pattern, the literature ties the overlap to worse impulsivity, anger, and hopelessness rather than to one shared trigger, so the shared shape above is this family\'s own organizing idea and not a mechanism the clinical research states directly. This is a working formulation, not a universal cause, and not a substitute for an individual clinical assessment.',
  livedExample:'A person waits for a reply that does not come. The wait does not stay the size of the thing itself: it grows until it is the only thing in the room, and when the mood drops under it, the mood does not come back up once the message finally arrives.',
  impact:'Can narrow attention to loss and threat, reduce follow-through on everyday tasks and relationships, and make it hard to find a felt floor once charge starts moving down. Can also wear on the people nearby, who may not be able to tell from outside whether they are watching a mood state, a relational fear response, or a worry loop, because the three can look alike before they are named. How often these travel together varies a great deal by setting and by instrument, the inpatient figures in particular should be read as unsettled rather than precise, and no study gives one reliable rate for all three together, so no specific shared percentage should be read into this family. None of this is guaranteed or constant; it describes a risk, not a verdict.',
  practice:'Notice which of the three patterns is actually running right now: a dropped mood, a relational alarm about being left, or a worry that will not stop circling. Separate the felt urgency from the facts of the moment; name one thing that is still true and has not moved. Choose one small, completable action sized to today rather than to the whole slope, and bring in a licensed clinician if the drop does not lift or includes thoughts of harming yourself.',
  oppositeName:'Grounded Floor', oppositeId:'opposite:Collapse',
  oppositeDefinition:'A structure that can carry real weight, including loss, threat and low mood, and still find a floor: distress that moves through rather than compounding without end, relationships that can bend under strain without the self-image collapsing with them, and worry that can be set down once it has been heard.',
  oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
  confidence:0.47,
  crosswalk:'This entry is a DESCENT-table correspondence, read by name match only (descentStep(\'Collapse\')): HCX_LIB already defines a real Collapse hyper complex (nodes.js:521) that compute() builds for real people via FAMS/sabs/cxs/hys (compute.js:467-479), and this content object annotates that same name with research-literature correspondence. There is no fetter, saboteur or complex parentage edge invented anywhere; the only wire is the string "Collapse" appearing on both sides. This pass drafted the entry with no fam field on purpose, since wiring it makes this the fifth clinical-correspondence name shown directly to the person themselves with no practitioner gate at all (the same self-facing path Narcissism, Machiavellianism, Sociopathy and Psychopathy already use via drills.js), which this pass held as a product decision rather than a research one. The owner merged this entry with fam:\'Collapse\' set, 7 November 2026, mirroring Sociopathy\'s own fam:\'Predatory\'; compass.js\'s descentHeld() (compass.js:638-642) now treats it as tied to the chain, reachable the same way its four siblings already are, and the self-facing exposure this pass flagged is real and unchanged, now being addressed separately as its own practitioner-mode scoping work.',
  falsification:'The engine signal (an active Collapse hyper complex) is deliberately coarser than this content: it cannot distinguish which, if any, of the three bundled clinical pictures is present, so a practitioner should look for at least one concretely observed pattern (sustained low mood/anhedonia, relational abandonment sensitivity with identity instability, or pervasive multi-domain worry) before treating the correspondence as applying at all. A single proportionate reaction to a real loss that resolves in the ordinary range, a mood or worry state fully explained by a medical cause or a one-time external stressor, or a complete absence of any relational-abandonment sensitivity, each counts against the correspondence. The reading\'s own gate is itself a falsifier: darkRead() requires both high malignancy and low Expression at once, so a person carrying this family without that combination has not met even the engine\'s own bar for the dark read, regardless of content. Finally, the specific percentages in impact carry confidence intervals wide enough (roughly 2 to 66 percent for the inpatient estimate) that they should never be treated as a reliable base rate for a specific individual.',
  trustBoundary:'No practitioner-sight mechanism exists in this codebase yet (CLAUDE.md names it a consequential grant requiring explicit consent, a visible list of who has sight, and revocation; practitioner.js\'s pracSightList() returns [] unconditionally and there is no store, route or revoke). Today, nobody but the person\'s own device can see any DESCENT content, and only the short d/nm/kind fields are ever rendered, under the self-facing dark-read gate in drills.js, not a practitioner gate. This content object\'s detailed clinical-literature template should be built to require the future practitioner grant specifically, not reuse the existing self-facing dark-read surface: it is a different order of disclosure than the one-line behavioral description Narcissism and Machiavellianism already expose directly to the person. Before any practitioner is granted sight, the client must be told the correspondence is a researched analogy and not a diagnosis, that it bundles three distinct DSM-5 categories into one engine signal because the engine cannot tell them apart, and that the cited percentages carry wide uncertainty and do not describe them personally. A practitioner with that grant must never state this to the client as a diagnosis, never treat the bundled three-condition label as evidence all three are present, never use the point-estimate percentages as a personal rate, and never let this substitute for the licensed-clinician referral the product already states elsewhere (DESCENT_REFER, compass.js:568): "This configuration needs a licensed clinician alongside, not instead."',
  reviewStatus:'external-research-pass-A-pass-B-adversarial-pass-C-and-crosswalk-falsification-trust-pass-D-done; the three-term bundle (a mood disorder, a personality disorder, and an anxiety-disorder category) remains a precision risk no research pass can resolve, and is named as an open editorial and clinical decision for the owner: whether this stays one hyper-complex entry or splits into three facet notes under the same family. Separately and newly found in pass D: this entry carries no fam or pair field, so it is not currently reachable by darkRead() at all (see crosswalk); whether to wire it with fam:\'Collapse\', and whether the detailed content template should ever reach the existing self-facing dark-read surface versus a future practitioner-only gate, are both open product decisions, not research findings, and neither should be resolved by this pass or made before this touches compass.js or nodes.js.',
  researchSources:[
   'https://pubmed.ncbi.nlm.nih.gov/27629598/',
   'https://pubmed.ncbi.nlm.nih.gov/38214629/',
   'https://pubmed.ncbi.nlm.nih.gov/27349358/',
   'https://doi.org/10.1016/j.jpsychires.2023.06.009',
   'https://pubmed.ncbi.nlm.nih.gov/25723972/',
   'https://www.psychiatry.org/News-room/News-Releases/Updated-Borderline-Personality-Disorder-Guideline',
   'https://www.nimh.nih.gov/health/topics/depression',
   'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
   'https://www.nimh.nih.gov/health/topics/borderline-personality-disorder',
   'https://pmc.ncbi.nlm.nih.gov/articles/PMC4397113',
   'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6691128/',
   'https://ruscio.pages.tcnj.edu/files/2016/08/Arntz-et-al-proofs-JPD-Personality-Disorders-proofs.pdf',
   'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1630512/full',
   'https://pmc.ncbi.nlm.nih.gov/articles/PMC8973542'
  ],
  researchPasses:[
   {pass:'A · construct and source check',
    focus:'Separate HCX_LIB\'s structural "Collapse" label from the three distinct DSM-5 categories its sub field names (a depressive disorder, a personality disorder, and an anxiety disorder), and check whether their real-world comorbidity justifies one family or argues for a split.',
    sources:['https://pubmed.ncbi.nlm.nih.gov/27629598/','https://pubmed.ncbi.nlm.nih.gov/38214629/','https://pubmed.ncbi.nlm.nih.gov/27349358/','https://doi.org/10.1016/j.jpsychires.2023.06.009','https://pubmed.ncbi.nlm.nih.gov/25723972/'],
    finding:'Depression (a mood disorder), BPD (a personality disorder) and anxiety disorders (an excessive-fear/worry clinical category) sit in three different DSM-5 chapters with different core mechanisms, onset and treatment literatures; HCX_LIB\'s "depression · BPD · anxiety" line is this product\'s own structural translation note, not a clinical equivalence claim, and must never be read as one. The bundle is not arbitrary, though: depression is reported in the large majority of BPD samples and co-occurs with GAD at double-digit rates in both inpatient and outpatient samples (Qadeer Shah et al. 2023; Köhling et al. 2015), so the three travel together often enough that one structural family (charge dropping at the root and staying down) may be a defensible behavioral grouping, provided it is held explicitly as a pattern label and not a diagnosis of, or claim of sameness among, the three named conditions. Recommend pass B get clinician input on whether to keep one entry or split into three facet notes.'},
   {pass:'B · evidence and dimension check',
    focus:'Check whether each of the three named conditions is unidimensional or facet-varying, pull real pooled/meta-analytic comorbidity numbers instead of a qualitative "heavily comorbid," and check measurement validity for the anxiety and depression ends of the bundle, to see whether pass A\'s behavior, trigger and impact wording holds up or overstates.',
    sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4397113','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6691128/','https://ruscio.pages.tcnj.edu/files/2016/08/Arntz-et-al-proofs-JPD-Personality-Disorders-proofs.pdf','https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2025.1630512/full','https://doi.org/10.1016/j.jpsychires.2023.06.009','https://pubmed.ncbi.nlm.nih.gov/25723972/'],
    finding:'Each named condition carries its own internal heterogeneity problem, on top of the between-condition bundling pass A already flagged. BPD: a taxometric study covering six personality disorders jointly across 1,816 patients (Arntz et al. 2009) found dimensional rather than discrete-taxon structure in nearly all analyses run, and ICD-11\'s 2022 revision acted on that evidence, dropping BPD as a stand-alone category for a general severity rating plus trait domains, keeping only an optional, non-clinical \"borderline pattern\" descriptor. That favors reading Collapse as a dimensional pattern rather than a hard clinical category, which fits how this family is built, but does not settle whether the pattern belongs with depression and anxiety in one entry or on its own. Depression: in BPD specifically, the 35-study, 3,425-participant Köhling et al. 2015 meta-analysis found no significant severity difference between BPD-with-depression and depression-alone groups, but did find a BPD-specific depression quality running higher on anger, hostility and self-criticism, with high heterogeneity across the pooled studies; pass A\'s plain "low mood, fatigue" wording undersold how this particular overlap tends to present. Separately, depression\'s own structure is unsettled on its own terms: a STAR*D reanalysis of 3,703 outpatients found 1,030 distinct DSM symptom profiles meeting one clinical case definition, most carried by a handful of people each, and controlling for severity did not shrink that spread. Anxiety: the pooled comorbidity numbers are real but narrower than "heavily comorbid" implies and carry wide, in one case nearly uninformative, intervals: current GAD runs about 16 percent in inpatient BPD samples (95% CI roughly 2 to 66 percent) and about 31 percent in outpatient or community ones (lifetime 11.3 and 13.7 percent), tracking with worse impulsivity, anger and hopelessness rather than worry alone; and the GAD-7, the instrument behind most of these numbers, has an unsettled factor structure and unconfirmed measurement equivalence between clinical and general populations. Net effect on pass A\'s draft: behavior, trigger and impact needed sharpening, not retraction, and are revised above; the three-way bundle is not resolved by this evidence, and gains a second, independent reason to stay open, since two of the three named conditions are themselves internally heterogeneous constructs, not just heterogeneous from each other.'},
   {pass:'C · adversarial and safety review',
    focus:'Check pass A and B\'s wording for deterministic or stigmatizing language, check whether the proposed opposite is overclaimed as validated, check whether any line reads as clinically labeling an individual rather than describing a pattern, and spot-check the specific cited numbers directly against their sources rather than against the drafts\' own summaries.',
    sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC8973542','https://ruscio.pages.tcnj.edu/files/2016/08/Arntz-et-al-proofs-JPD-Personality-Disorders-proofs.pdf','https://pubmed.ncbi.nlm.nih.gov/25723972/','https://doi.org/10.1016/j.jpsychires.2023.06.009','https://pmc.ncbi.nlm.nih.gov/articles/PMC4397113'],
    finding:'No deterministic or stigmatizing wording found in behavior, triggerMechanism or impact: all three use "may" throughout and state plainly that this is a pattern label, not a diagnosis of an individual, matching the register of the Narcissism, Machiavellianism and Psychopathy entries this family is templated on. "Grounded Floor" is correctly marked inferred-working-counterpart, not a validated opposite, and is not overclaimed. Two real defects found and fixed here. First, livedExample as carried from pass A through pass B showed one person experiencing a mood drop, a worry spiral and a loss of self tied to someone not replying, all at once in a single scene, directly contradicting the sentence in behavior immediately above it that a Collapse read "does not mean all three are present ... in any one person"; rewritten to the shared shape only, charge dropping and not finding a floor, without coding three separate clinical facets into one vignette. Second, the percentages in impact were stated at a steadier level of confidence than their own source supports: confirmed directly against Qadeer Shah et al. 2023 that the 16 percent inpatient pooled estimate carries a 95 percent confidence interval of roughly 2 to 66 percent, close to uninformative, a caveat pass B\'s own finding text carried but the shipped impact field did not; added. Confirmed independently that ICD-11\'s 2022 revision dropped BPD as a stand-alone clinical category for a severity-plus-trait-domain model with an optional, non-clinical borderline pattern qualifier, matching pass B. Also corrected a minor misattribution carried in both drafts\' prose (not in the shipped content fields): Arntz et al. 2009\'s 1,816-patient sample and its taxometric analyses covered six personality disorders jointly, not a BPD-isolated analysis, so the reviewStatus and pass B finding text above now describe it that way rather than as a BPD-specific study. Finally: pass B\'s note that this entry needs a fourth, separate "pass D" for the clinical split-or-keep decision is not carried forward as a numbered research pass. No sibling entry in compass.js (Narcissism, Machiavellianism, Psychopathy) uses more than three passes, and whether to split this entry is an editorial and clinical placement decision, not a literature-search finding; it is named as an open decision in reviewStatus instead.'},
   {pass:'D · crosswalk, falsification and trust boundary',
    focus:'Trace the real engine link from this entry to HCX_LIB and compute()\'s chain, confirm no fetter/saboteur/complex edge was invented, name concrete disconfirming signs a practitioner could check, and state who may see this content and under what consent, correcting the task\'s own assumption about how the dark read is currently gated.',
    sources:['/home/user/MOB/atuned_src/engine/data/nodes.js (HCX_LIB, line 521)','/home/user/MOB/atuned_src/engine/compute.js (FAMS/sabs/cxs/hys, lines 467-486)','/home/user/MOB/atuned_src/engine/data/compass.js (DESCENT, descentStep, descentHeld, darkRead, lines 489-667)','/home/user/MOB/atuned_src/ui/drills.js (dark-read render, lines 1207-1259)','/home/user/MOB/atuned_src/ui/practitioner.js (grant stub, lines 1-25, 717-739)','/home/user/MOB/CLAUDE.md (practitioner consent ruling)'],
    finding:'Confirmed the link is a name-only DESCENT correspondence to a real HCX_LIB/compute() family (Collapse), never a fabricated chain edge. Found that as drafted this entry carries no fam or pair field, so compass.js\'s own descentHeld() does not treat it as tied, and darkRead()\'s untied fallback only ever names Machiavellianism or Narcissism, making this entry currently unreachable by any surface; wiring it is a one-line, precedent-following change (fam:\'Collapse\', matching Sociopathy\'s fam:\'Predatory\') left as an open decision rather than applied silently. Also found the task\'s framing of the trust boundary was imprecise: no practitioner-sight mechanism exists in this codebase at all yet (pracSightList() returns [] unconditionally), and the short d/nm/kind fields of a tied DESCENT step are not practitioner-gated today but render directly to the person themselves inside the self-facing dark-read drill; only the detailed content.* template drafted here is unwired to any surface, self or practitioner. Falsification signs and the trust boundary are written into the new fields above on that corrected basis.'}
  ]
 }},
 {nm:'Unbending',kind:'hyper complex',fam:'Unbending',
 d:'nothing is allowed out of its cell, including you',
 content:{
  inferred:false, inferenceBasis:'The hyper-complex placement and HCX_LIB\'s own d line are owner-ruled and reused verbatim, not rewritten. The family\'s own name moved from Rigidity to Unbending on 7 November 2026, his words: "change rigidity to stubborn. Or unbending. Probably better," and this entry\'s nm follows it, the same way Collapse, Sociopathy, Dysregulation and Dissociation already take their nm from their own family. HCX_LIB\'s sub line for this family, "OCPD · paranoia," bundles a real DSM-5/DSM-5-TR personality disorder (obsessive-compulsive personality disorder, Cluster C) with a lay, cross-condition word for suspicion rather than a second disorder; this repo\'s own nodes.js comment shows "paranoia" is being used in its hypervigilant, narrative-spinning behavioral sense (SABAUTH node 83), not as a claim that this family meets the criteria for the nearest real clinical term for that word, paranoid personality disorder, which is a different Cluster A disorder built on distrust rather than control. The behavior, trigger, lived example, impact, practice and opposite below are a research-informed first pass, not a clinical diagnosis.',
  behavior:'May hold rigid rules, for self and others, about how a task must be done; may delay or block finishing a task by chasing a more perfect result; may work past the point of being useful rather than rest. These three are the best-supported part of the pattern: wanting things done exactly right, and keeping to order, track most clearly with being careful and dutiful at the narrow trait level, less clearly at the broad level. A second, separable thread is control that reaches into other people: treating a change from the plan as a threat to watch rather than an ordinary change, which in the research tracks with anger and annoyance more than with broad suspicion. That tracking is this family\'s own use of the word paranoia, a watchful stance toward risk, and is a different claim from the clinical disorder nearest that word. A third thread, struggling to hand tasks to others or let go of things unless the result matches their own standard exactly, is real in clinical writing but rests on the weakest-supported part of the pattern as measured (the "holding on tight" factor is repeatedly too thin and poor-fitting when the numbers are run), so it is named here with less certainty than the first two.',
  triggerMechanism:'A loss of control over a process, timeline or standard; an unplanned change; or facts that a rule was not followed as specified can read as a threat to the order the person is holding together, and the response is to tighten the rule or the watch rather than loosen it. Research on how this pattern is built finds this tightening response (the control-over-others side) tracking with anger and lashing out, while the perfect-it side tracks instead with low mood and blaming themselves, suggesting these are two different responses under one label rather than one single cause. This is one working idea either way, not a rule true for everyone, and not a claim about why any one person acts this way.',
  livedExample:'A colleague reorganizes a shared folder the person built the filing rules for. Overnight, the person redoes the colleague\'s work to match their own scheme exactly, writes a longer rule document so "this cannot happen again," and starts checking the folder each morning for anything moved.',
  impact:'Can cost room to bend, handing tasks to others, rest and goodwill as one plausible reading of the pattern itself; people nearby may learn to hide small changes rather than say them out loud, and the watchfulness meant to prevent one more slip can itself read to others as doubt about them. That reading should not be mistaken for a documented drop in daily coping: in the largest US check of this pattern, it was not clearly tied to a measured drop in coping, unlike most other patterns like it in the same data, so a person can show this pattern with no clear outside sign it is costing them anything. Never certain, and not proof of a clinical label from one pattern of behavior.',
  practice:'The harder first step, ahead of noticing, is that the standard usually does not feel optional or excessive from inside the pattern; people living this tend to experience their own rules as simply correct, which is part of why the pattern rarely shows up asking to be worked on in its own right. With that named, notice the moment a deviation from the plan starts to read as a threat rather than a variant. Separate what the rule is actually protecting from the comfort of holding control itself; name out loud what would still be fine if the deviation stood. Choose to let the smaller deviations stand, and save the tightened rule for the one that actually matters.',
  oppositeName:'Held Flexibility', oppositeId:'opposite:Unbending', oppositeDefinition:'Order and standards held loosely enough to flex: a rule kept because it still serves the outcome, trust extended without constant monitoring, and delegation that does not require redoing the other person\'s work.',
  oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
  crosswalk:'fam:\'Unbending\' is held exactly the way Sociopathy\'s fam:\'Predatory\' already is in this same table: compute.js builds r.hys off HCX_LIB\'s own family rows, and descentHeld() in compass.js reads this entry only when r.hys carries an untouched (!over) Unbending row, so wiring it invents no fetter, saboteur or complex parentage, it rides an edge the chain (sabs to cxs to hys to sups) already produces from real addresses and saboteurs. This is a DESCENT-table correspondence read only inside darkRead()\'s gate (malignant 0.55 or higher and coherent under 31 on the person\'s own axes), the same gate that already prints Narcissism, Machiavellianism, Sociopathy and Psychopathy by name on the compass screen (ui/drills.js); HCX_LIB\'s own clinical sub line, "OCPD · paranoia," stays off every person-facing surface under nodes.js\'s separate ruling that a clinical name is never shown to the person it is about. This entry\'s own nm is now Unbending, renamed from the bare DSM acronym OCPD by the owner on 7 November 2026, which brings it into the same convention Collapse, Sociopathy, Dysregulation and Dissociation already use, a descriptive behavioral word rather than a clinical acronym; Narcissism, Machiavellianism and Psychopathy remain this table\'s own exceptions, carrying names that are themselves clinical-adjacent, and that is unaffected by this entry\'s rename.',
  falsification:'Concrete signs a practitioner could check against a specific person, not just "it might not apply": (1) the field\'s own named ambiguity between OCPD and Anxiety disorders for the Hyper-Vigilant saboteur (nodes.js); if the person\'s own account centers on fear of danger or being caught off guard rather than on order, perfectionism or control for its own sake, the addresses are reading the Collapse-side meaning, not this one. (2) Ego-syntonicity absent: a person who reports real distress about their own rigidity, already sees it as excessive, or wants to change it is showing the insight this construct is supposed to lack, which argues against OCPD and toward an anxiety- or OCD-adjacent reading. (3) No interpersonal control: HCX_LIB\'s own line is "nothing is allowed out of its cell, including you" (self and other); perfectionism that is purely self-directed, with no monitoring, correcting or redoing of other people\'s work, is missing half of what the family\'s own definition requires. (4) Situational, not pervasive: one incident under acute stress (one deadline, one project) rather than a stable, cross-situational style, since both the DSM construct and this family\'s placement describe an enduring pattern. (5) The engine\'s own chain disagrees: if r.hys does not actually carry an untouched Unbending entry for this field (it is over, or the dark read\'s tied step falls back to the untied Machiavellianism/Narcissism default because no family-tied hy is held), the correspondence does not apply by the product\'s own logic, regardless of how the story reads by eye. (6) Outside report contradicts it: people close to the person describe them as flexible, able to delegate without redoing the result, and tolerant of others\' deviations from a plan.',
  trustBoundary:'Corrects an assumption carried into this pass from A/B/C: the rule that a practitioner\'s sight of self report is a consequential grant needing consent, a visible list, and revocation (CLAUDE.md) governs a different boundary than the one that applies to this entry today. As wired now, DESCENT\'s own nm (here, Unbending, renamed from the bare acronym OCPD on 7 November 2026) is not practitioner-gated at all: ui/drills.js prints the whole DESCENT list, with the tied step highlighted, directly to the person themselves on the compass screen whenever their own dark read fires, exactly as Narcissism, Machiavellianism, Sociopathy and Psychopathy already do, no clinician and no practitioner mode checked anywhere in that path. Practitioner mode (ui/practitioner.js) currently reads nobody\'s record at all, by design, pending exactly the consent, visible-sight-list and revocation machinery CLAUDE.md requires and that file says does not exist yet, so there is no route today by which a practitioner could see this entry on another person\'s field even if they wanted to; the only audience this entry would have is the person themselves, at a vulnerable moment (CQ under 31, malignancy 55 or higher), a pre-existing exposure this entry inherits from its four siblings rather than creates. What stays correctly enforced: HCX_LIB\'s own clinical sub label ("OCPD · paranoia") stays off every person-facing surface under nodes.js\'s separate, flat rule that a clinical name is never shown to the person it is about; only d (what the pattern does) renders there, and now nm too is a descriptive word rather than the acronym. The richer content object below (behavior, triggerMechanism, livedExample, impact, practice, opposite*, confidence, researchSources) is wired to no UI at all yet; the "knowledge generator" compass.js\'s own comment names has no implementation in this repo. If a future practitioner view is ever built on this content object, it must not exist before the owner\'s consent, visible-sight-list and revocation machinery does; the client must be told, before any grant, in plain words, that a practitioner can see pattern-correspondence content drawn from their story (not a diagnosis) and must be able to see who currently holds that sight and revoke it; and a practitioner given sight must never state "OCPD," "Unbending" or any DESCENT name to the client as a diagnosis, since the content object\'s own inferenceBasis and reviewStatus call this "a research-informed first pass, not a clinical diagnosis," and the only sentence this product puts in anyone\'s mouth about it is DESCENT_REFER\'s own: work at the address, not the structural layer, alongside a licensed clinician, not instead of one.',
  confidence:0.55,
  reviewStatus:'external-research-passes-A-through-D-done. OCPD\'s construct, DSM criteria and prevalence are well sourced. Its internal factor structure (perfectionism and interpersonal rigidity as separable factors with different correlates, miserliness repeatedly failing to hold up on its own) and its ego-syntonic framing were each independently re-checked in pass C against a further real source and held up; one imprecision in pass B\'s own finding text (not in the content fields themselves) is flagged rather than corrected, see the pass C finding. Pass D traced this entry\'s only real tie into compute() (fam to r.hys, the mechanism Sociopathy\'s fam already uses) and confirmed no fetter/saboteur/complex edge is invented, named concrete falsification signs, and corrected a trust-boundary assumption carried from passes A to C: this correspondence is not practitioner-gated today, it would print directly to the person themselves inside the existing dark read, same as Narcissism, Machiavellianism, Sociopathy and Psychopathy, while the richer content object is wired to no UI at all yet. One flag stays open for the owner, unresolved by design: whether HCX_LIB\'s "OCPD · paranoia" sub line should be reworded. The second flag these passes raised, whether naming this entry OCPD was appropriate, is resolved: the owner renamed it Unbending on 7 November 2026, his words "change rigidity to stubborn. Or unbending. Probably better," matching the family\'s own HCX_LIB word rather than a bare clinical acronym, the same convention Collapse, Sociopathy, Dysregulation and Dissociation already carry. A third flag, from pass D: whether a bare clinical personality-disorder name should keep printing directly to a decoherent, malignant-reading person with no clinician present at all, stays open for Narcissism, Machiavellianism, Sociopathy and Psychopathy, whose own names remain clinical-adjacent; the rename answers it for this entry alone, since Unbending is no longer that kind of name, and the underlying exposure, a DESCENT name of any kind printing with no practitioner gate, is unchanged and not something this entry introduces. No further research pass is currently scheduled for this entry.',
  researchSources:['https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/obsessive-compulsive-personality-disorder-ocpd','https://psychiatryonline.org/doi/10.1176/appi.focus.20220058','https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/paranoid-personality-disorder-ppd','https://pmc.ncbi.nlm.nih.gov/articles/PMC5793931/','https://pubmed.ncbi.nlm.nih.gov/24257122/','https://pmc.ncbi.nlm.nih.gov/articles/PMC2862854','https://pmc.ncbi.nlm.nih.gov/articles/PMC3652015','https://experts.umn.edu/en/publications/the-placement-of-obsessive-compulsive-symptoms-within-a-five-fact/','https://doaj.org/article/c4558b5641484a37a6b1af78091b21d5','https://experts.umn.edu/en/publications/prevalence-correlates-and-comorbidity-of-dsm-iv-obsessive-compuls/','https://pmc.ncbi.nlm.nih.gov/articles/PMC4782437','https://www.cambridge.org/core/journals/european-psychiatry/article/an-analysis-of-the-prevalence-and-impact-of-obsessivecompulsive-personality-disorder-on-the-course-of-obsessivecompulsive-disorder/8F9B4536226FF9255464E3B787133274'],
  researchPasses:[
   {pass:'A · construct and source check',
    focus:'Establish OCPD\'s real DSM-5/DSM-5-TR criteria and cluster; establish that "paranoia" is not itself a diagnosis and find its nearest real diagnostic term; check for direct evidence the two belong in one bundle.',
    sources:['https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/obsessive-compulsive-personality-disorder-ocpd','https://psychiatryonline.org/doi/10.1176/appi.focus.20220058','https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/paranoid-personality-disorder-ppd','https://pmc.ncbi.nlm.nih.gov/articles/PMC5793931/','https://pubmed.ncbi.nlm.nih.gov/24257122/'],
    finding:'OCPD is a real, well-defined Cluster C personality disorder (preoccupation with order, perfectionism and control, at least 4 of 8 traits). "Paranoia" is a lay, cross-condition symptom word, not a formal clinical category; its nearest real clinical term is paranoid personality disorder, a separate Cluster A disorder built on distrust and suspicion rather than control. The literature search turned up only a brief mention of OCPD co-occurring with paranoid and schizoid PD, not a dedicated comorbidity study, so direct support for bundling the two under one hyper complex is thin. This repo\'s own nodes.js comment shows the product is using "paranoia" in a behavioral, hypervigilant-scanning sense drawn from SABAUTH node 83, not as a PPD diagnosis claim, which keeps the bundle defensible as a behavior label but means HCX_LIB\'s sub line currently reads as naming two disorders when it names one disorder and one descriptive word. Whether to reword the sub line or leave it as owner-ruled shorthand is flagged here, not resolved.'},
   {pass:'B · evidence and dimension check',
    focus:'Test whether OCPD is one dimension or splits into separable facets with different behavioral correlates, since the hyper-complex family is itself named Rigidity; check prevalence and whether the construct\'s relationship to real-world impairment is as clean as a first pass would assume; check comorbidity and insight patterns that bear on how recognizable the pattern is to the person living it.',
    sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC2862854','https://pmc.ncbi.nlm.nih.gov/articles/PMC3652015','https://experts.umn.edu/en/publications/the-placement-of-obsessive-compulsive-symptoms-within-a-five-fact/','https://doaj.org/article/c4558b5641484a37a6b1af78091b21d5','https://experts.umn.edu/en/publications/prevalence-correlates-and-comorbidity-of-dsm-iv-obsessive-compuls/','https://pmc.ncbi.nlm.nih.gov/articles/PMC4782437'],
    finding:'Factor-analytic work on the OCPD criteria (Grilo\'s original exploratory study and later confirmatory tests in BED and Hispanic outpatient samples) converges on two separable factors, perfectionism and interpersonal rigidity, with the interpersonal-rigidity factor correlating with anger/aggression and the perfectionism factor correlating instead with depression and self-criticism; a proposed third factor, miserliness (hoarding, reluctance to discard or delegate), is repeatedly underidentified and poor-fitting, and at least one confirmatory study found poor fit for every structure tested, including the unitary model, calling the criteria set\'s psychometric properties into question generally. This directly affects the draft: the family here is named Rigidity, and the literature\'s rigidity factor is specifically the interpersonal-control one, not the delegation/discard items, which sit in the weakest factor. Separately, NESARC (the largest relevant population survey, ~43,000 US adults) found OCPD is the single most common personality disorder (7.88% lifetime) but, unusually among personality disorders in that same data, was inconsistently related to measured disability or impairment; a global meta-analysis (46 studies, N=89,264) puts prevalence at 6.5% and finds it stable across nearly three decades. OCPD traits are also widely described as ego-syntonic, experienced by the person as simply correct, which is offered as a mechanism for why the pattern is usually noticed by people around someone rather than by the person, and for why it rarely presents for treatment in its own right. Behavior, triggerMechanism, impact and practice above are reweighted and hedged to reflect all of this; none of it resolves the paranoia-bundle flag from Pass A, which stays open.'},
   {pass:'C · adversarial and safety review',
    focus:'Check for deterministic or stigmatizing wording across the whole entry; check that the proposed opposite (Held Flexibility) is not overclaimed as a validated construct rather than this product\'s own inferred coinage; check that no line reads as diagnosing an individual rather than describing a pattern; independently re-check two load-bearing pass B claims (the ego-syntonic framing in practice, and the two-factor perfectionism/interpersonal-rigidity structure with its anger-versus-depression correlate split) against one further real source each.',
    sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC4782437','https://www.cambridge.org/core/journals/european-psychiatry/article/an-analysis-of-the-prevalence-and-impact-of-obsessivecompulsive-personality-disorder-on-the-course-of-obsessivecompulsive-disorder/8F9B4536226FF9255464E3B787133274','https://pmc.ncbi.nlm.nih.gov/articles/PMC2862854'],
    finding:'No instance of deterministic phrasing ("is", "always", "cannot") describing a person was found; behavior, triggerMechanism, impact and practice consistently use "may", "can" or "tends to", and livedExample is a single illustrative scenario in the same present-tense convention this registry already uses for Narcissism\'s and Machiavellianism\'s lived examples, not a claim about a real person. oppositeName/oppositeDefinition/oppositeStatus already carry the required disclaimer ("inferred-working-counterpart; not asserted as a canonical one-to-one opposite"), matching the Narcissism, Machiavellianism and Psychopathy entries verbatim in form, so Held Flexibility is not overclaimed as a validated clinical counterpart. No line names or addresses a specific individual; triggerMechanism and impact both explicitly disclaim universality and any individual clinical determination. Independent re-check: the ego-syntonic claim in practice holds up against a further source, a 2023 OCD-outpatient study (Cambridge, European Psychiatry) finding OCPD comorbid in roughly 55 percent of a sample and linked to greater ego-syntonic symptom intensity and worse insight, consistent with PMC4782437\'s framing already cited. The two-factor perfectionism/interpersonal-rigidity structure and its anger-aggression-versus-depression-self-criticism split, re-checked directly, traces to Ansell, Pinto, Grilo and colleagues\' 2010 confirmatory analysis in Hispanic psychiatric outpatients (PMC2862854), which is accurately represented in the behavior field; one imprecision is flagged rather than silently fixed: pass B\'s own finding text above describes Grilo\'s original exploratory study itself as "converging on" the two-factor model, when that original study (binge-eating-disorder sample) proposed three factors and it was the later confirmatory work that found the two-factor model fit best with miserliness dropping out. The content object\'s behavior/triggerMechanism fields do not repeat that imprecision, so no change was needed there; it is noted here only against pass B\'s historical record. Two items stay open for the owner, unchanged from pass A/B: whether HCX_LIB\'s "OCPD · paranoia" sub line should be reworded, and, checked afresh here, whether naming this entry OCPD (a clinical label) is appropriate: it is, on this table\'s own terms, since nodes.js\'s header for this registry reserves clinical names for entries that sit behind the dark-read referral gate, which is exactly where Narcissism, Machiavellianism, Sociopathy and Psychopathy already sit, so OCPD here is consistent with the table\'s existing convention rather than a new risk.'},
   {pass:'D · crosswalk, falsification and trust boundary',
    focus:'Trace this entry\'s only real tie into compute() (fam to r.hys, the same mechanism Sociopathy\'s fam already uses) and confirm no fetter/saboteur/complex edge is invented; name concrete falsification signs a practitioner could check against a specific person; and re-examine the consent/trust boundary against this product\'s actual current wiring rather than against how the earlier passes assumed it worked.',
    sources:[],
    finding:'fam:\'Rigidity\' is held exactly as Sociopathy\'s fam:\'Predatory\' already is: compute.js builds r.hys off HCX_LIB\'s own family rows and compass.js\'s descentHeld() reads this entry only when r.hys carries an untouched Rigidity row, so wiring it invents no new edge, it rides one the engine already builds. The dark read that would print it (darkRead() in compass.js, malignant 0.55 or higher and coherent under 31) already prints Narcissism, Machiavellianism, Sociopathy and Psychopathy by name on the compass screen (ui/drills.js) directly to the person themselves, with no practitioner mode check anywhere in that path; practitioner mode (ui/practitioner.js) currently reads nobody\'s record at all, pending exactly the consent, visible-sight-list and revocation machinery CLAUDE.md requires and that file says does not exist yet. So the trust-boundary premise carried into this pass from A/B/C, that this correspondence is seen only under a practitioner\'s grant, does not match the current build: today this entry\'s nm and d would be the fifth clinical name shown directly to the person in a dark read, same as its four siblings, and the richer content object (behavior, triggerMechanism, livedExample, impact, practice, opposite*, confidence, researchSources) is wired to no UI at all yet, the "knowledge generator" compass.js\'s own comment names has no implementation in this repo. HCX_LIB\'s own clinical sub label, "OCPD · paranoia", is unaffected by any of this and stays off every person-facing surface under nodes.js\'s separate, flat rule. Falsification signs and the corrected trust boundary are written into the new crosswalk, falsification and trustBoundary fields on this content object; nothing here is a new risk this entry creates, since the exposure already exists for its four siblings, but it is now stated rather than assumed.'}
  ]
 }},
 {nm:'Dysregulation', kind:'hyper complex',
 d:'the swing overshoots at both ends and never settles at the middle',
 content:{
  inferred:false,
  inferenceBasis:'The hyper-complex placement, the name Dysregulation, and the sub line "bipolar · ADHD" are source-defined in HCX_LIB (engine/data/nodes.js), not separately owner-ruled the way Sociopathy was on 26 October. The behavior, trigger, lived example, impact, practice and opposite below are a research-informed first pass, not a clinical diagnosis, and they describe a structural pattern, overshoot without settling, rather than either named disorder on its own. HCX_LIB bundles two distinct DSM-5-TR categories under one family name, a mood disorder and a neurodevelopmental disorder, from two different clinical chapters, and that bundling is addressed rather than assumed, in the pass A research finding below. Pass B went further and found the construct is not dimensionally uniform even within each half of the bundle: ADHD\u2019s own three presentations differ in whether a high or expansive pole exists at all, and bipolar disorder\u2019s own spectrum, from cyclothymic temperament through bipolar II to bipolar I, is itself an unresolved dimensional-versus-categorical question in the literature, not a settled single axis the way this entry\u2019s "overshoots at both ends" image implies. Pass C reviewed the wording above for deterministic or stigmatizing phrasing, for whether the proposed opposite is overclaimed as validated rather than an inferred coinage, and for whether any line reads as clinically labeling an individual rather than describing a pattern, and confirmed two of pass B\u2019s most load-bearing numeric claims against the published record; none of the three wording defects were found, and the numbers held up. Pass D traced the entry into the real engine, confirmed no fabricated edge, found that the gate this entry would sit behind asserts a harm-to-others lineage this research does not support, named concrete falsification signs, and stated the consent and trust boundary. See crosswalk, falsification and trustBoundary below, and the pass D finding.',
  behavior:'May show swings between high-energy, expansive or irritable stretches and low-energy, depleted or inattentive stretches, with difficulty holding a steady middle state. Can look like elevated mood, rapid or urgent speech, reduced need for sleep, or risky decisions at one end, and flat affect, exhaustion, trouble starting or finishing tasks, or low mood at the other. Two differently-shaped patterns sit inside this one family name, and nothing here assumes a person runs only one: a mood disorder\u2019s episodic shift, days to weeks of a distinct high or low that stands apart from the person\u2019s own baseline, and a neurodevelopmental disorder\u2019s more continuous pattern of inattention and or hyperactivity-impulsivity present since childhood, without that same episodic break from baseline. A swing between energy and flatness is not on its own evidence that either pattern is present. The two patterns are also not mirror images of one mechanism: a direct adult comparison (Richard-Lepouriel et al, 2016, Journal of Affective Disorders) found ADHD participants reporting higher emotional intensity than bipolar participants on one standard measure (the Affect Intensity Measure) and bipolar participants scoring higher than ADHD participants on a second, lability-focused measure (the Affective Lability Scale), so neither condition reliably owns the "high" pole or the "low" pole. The swing\u2019s shape also depends on which ADHD presentation is present: the combined presentation, by most prevalence estimates roughly half to three quarters of ADHD cases, fits a high and low swing picture, while the predominantly inattentive presentation, roughly a fifth to a third of cases, centers on attentional and energy depletion without a hyperactive or expansive pole at all. This entry\u2019s swing language may describe only part of the ADHD side of this family.',
  triggerMechanism:'In the source model, the swing is read as a structure that overshoots whatever position it reaches and cannot rest at the centre, so stimulation, stress, sleep loss, or an open-ended task can push it toward either end rather than settle it. A perceived deadline, a loss of structure, conflict, or a stretch of low external demand can be the occasion. This is a working formulation, not a universal cause, and it is not a validated account of why any individual person swings. The two conditions inside this family are not read as overshooting by the same route in the clinical literature. Bipolar disorder\u2019s dysregulation is generally described as mood-congruent and episodic, a shift that outlasts and outscales whatever triggered it by days or weeks; ADHD\u2019s is generally described as a moment-to-moment inhibitory or top-down control deficit, a fast-rising reaction, often to frustration, that the person struggles to dampen once it starts, without the days-long episode structure. A widely cited review (Shaw et al, 2014) lays out three competing accounts of how emotional dysregulation and ADHD relate to each other: as a correlated but distinct dimension that merely travels alongside ADHD, as a core clinical feature of ADHD itself rather than a separate add-on, or as some combination of the two, and the field has not settled which is correct. That open question sits underneath this entry\u2019s single trigger story for the ADHD half and is not resolved by stating the story.',
  livedExample:'A person starts a new project at a sudden high pitch, works through the night on it, loses interest within days once the first real obstacle appears, and spends the following week unable to start the next task, missing messages and sleeping through the hours they meant to use. This traces one shape, a high-to-low arc, that a combined-presentation ADHD pattern or a bipolar hypomanic-to-depressive cycle can both produce. A predominantly inattentive ADHD presentation, or a bipolar depressive episode on its own, can look like only the second half of this story, with no preceding high at all, which this single example does not show.',
  impact:'Can cost sustained follow-through, reliable sleep, steady relationships and financial stability when the plans made at one end are not the plans kept at the other. People nearby may find the person\u2019s energy and availability hard to predict, and the person may carry real shame or exhaustion at the gap between who they were at the high point and who they are at the low one. Where either the mood pattern or the attentional pattern is pronounced, ordinary willpower or scheduling advice may not be sufficient on its own, and a missed second clinical determination is reported often enough in the literature on this exact pairing to be worth naming. How often is not settled: comorbidity estimates reviewed here for adult ADHD and bipolar disorder range roughly from under 10 percent to over 30 percent depending on the sample and the measure used, a spread wide enough to suggest the two conditions are being measured inconsistently against each other rather than that one true rate exists. One small comparative study of clinician judgment found the direction of bias running opposite ways by age: a child case was more often labeled bipolar disorder than base rates would predict, and an adult case with the same symptom profile was more often labeled ADHD. If that pattern generalises, the practical risk of a missed second clinical label would not be symmetric across the lifespan, but this comes from a single small study and is reported here as a direction worth watching, not a settled rate.',
  practice:'Notice which end of the swing is running right now, without arguing it away. Separate what the current state makes feel urgent or impossible from what is actually true today, naming the gap out loud or in writing. Choose one step that would still make sense from the other end of the swing before acting on what feels true only from inside this one.',
  oppositeName:'Regulated Range', oppositeId:'opposite:Dysregulation', oppositeDefinition:'A working range that flexes with real demand and still returns to a steady middle: energy, mood and attention that rise and fall with circumstance without overshooting past function, and a felt sense of returning to baseline rather than crashing past it.',
  oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
  confidence:0.5,
  crosswalk:'This entry corresponds to HCX_LIB\u2019s own Dysregulation hyper complex (engine/data/nodes.js, sub:"bipolar \u00b7 ADHD", seat Sacral) by name only: it is a DESCENT-table correspondence read inside the gated dark read, never a fetter, saboteur or complex parentage link, and compute() builds no fam or pair tie for it the way it does for Sociopathy and Psychopathy, so no edge is fabricated. But the gate it would sit behind fires only on "both at once" (outward shape and organized control, the harm-to-others malignancy reading Narcissism, Machiavellianism, Sociopathy and Psychopathy share), and nothing in this research supports reading bipolar disorder or ADHD as an other-directed harm pattern, so this table, behind this gate, would itself assert a correspondence the record does not support. HCXCARD.dysregulation (engine/data/hcxcard.js) already carries equivalent behavioral content to every person carrying the pattern, with no malignancy gate and no clinical name, which is the alternative placement named in the pass D finding below.',
  falsification:'A practitioner checking this correspondence against a specific person would look for: no distinct days-to-weeks mood episode that departs from the person\u2019s own baseline (disconfirms the bipolar half); no attentional or hyperactivity-impulsivity pattern present since before age 12 (disconfirms the ADHD half); a predominantly inattentive presentation with no high or expansive pole ever reported, which this entry\u2019s "overshoots at both ends" image does not fit, and which covers roughly a fifth to a third of ADHD cases; swings that track an identifiable external cause, sleep loss, a medication change, a medical condition such as thyroid or perimenopause, or substance use, and resolve when that cause is addressed rather than recurring on their own; a better fit with borderline personality disorder\u2019s affective lability, which the De Prisco et al 2023 meta-analysis found more strongly evidenced against emotion dysregulation than the ADHD comparison (6 studies, n=1001, against 3 studies, n=232); and, most basically, a story that does not corroborate the swing at all, since the hyper complex is computed from two saboteurs at a seat and can fire without the person\u2019s own account matching the shape this entry describes. Any one of these is reason to treat the correspondence as not holding for that person, and the practice line above should be withheld rather than offered on a correspondence that does not hold.',
  trustBoundary:'This content, the behavioral template, the confidence number, the research sources and passes, and above all the clinical cluster name carried privately on HCX_LIB as sub ("bipolar \u00b7 ADHD", printed to nobody per engine/data/hcxcard.js\u2019s own comment) sits in the same consequential class CLAUDE.md already names for a practitioner\u2019s sight of somatic and psychological self report: it needs explicit consent, a visible list of who has sight, and revocation, never a silent default. Before a practitioner is granted sight of it, the client should be told, in plain words, that a research-informed structural correspondence exists on this pattern, that it is not a diagnosis, what it is based on, and that they can revoke the grant at any time. A practitioner who has sight of it must never state it to the client as a diagnosis of bipolar disorder or ADHD, never use the cluster name with the client at all, never treat the engine\u2019s computed presence of the pattern as sufficient evidence on its own without checking it against the falsification signs above and the client\u2019s own account, and never work the structural layer directly: DESCENT_REFER\u2019s own line already holds for this entry exactly as it holds for the other four, work at the address, say plainly that the structural layer is not worked here, and refer to a licensed clinician alongside, not instead.',
  reviewStatus:'external-research-pass-A-done, external-research-pass-B-done, external-research-pass-C-done, external-research-pass-D-done. All four passes complete; this is the final draft for human review, not yet written to any file. Pass D traced the tie into the real engine and confirmed no fabricated edge, named concrete falsification signs, and stated the consent and trust boundary, but it did not resolve, and explicitly hands to the owner, whether the bipolar-ADHD bundle should be one hyper complex or two, and whether this entry belongs in the malignancy-gated DESCENT table at all rather than an ungated surface like HCXCARD.dysregulation, which already exists with equivalent content and no clinical name. That placement call, not a research pass, is what would move confidence or kind. Confidence is left at 0.5, unmoved, consistent with passes A through C.',
  researchSources:['https://www.nimh.nih.gov/health/topics/bipolar-disorder','https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9567078/','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9403243/','https://pubmed.ncbi.nlm.nih.gov/25406047/','https://pubmed.ncbi.nlm.nih.gov/33515607/','https://pubmed.ncbi.nlm.nih.gov/21278822/','https://pmc.ncbi.nlm.nih.gov/articles/PMC7027938','https://pubmed.ncbi.nlm.nih.gov/31792363/','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9464828/','https://core-prod.cambridgecore.org/core/services/aop-cambridge-core/content/view/A87DE2F2846B9019656A97ECA842B901/S003329172300243Xa.pdf/emotion_dysregulation_in_bipolar_disorder_compared_to_other_mental_illnesses_a_systematic_review_and_metaanalysis.pdf','https://pmc.ncbi.nlm.nih.gov/articles/4282137','https://www.ajmc.com/view/emotional-dysregulation-and-executive-dysfunction-in-patients-with-adhd-and-bipolar-disorder','https://eprints.whiterose.ac.uk/id/eprint/183369/1/Attention-DeficitHyperactivity%20Disorder%20Predominantly%20Inattentive%20SubtypePresentation%20Research%20Progress%20and%20Translational%20St.pdf','https://chadd.org/about-adhd/adhd-quick-facts-adhd-presentations/','https://www.nature.com/articles/s41398-021-01666-3','https://resolve.cambridge.org/core/journals/european-psychiatry/article/does-temperamental-instability-support-a-continuity-between-bipolar-ii-disorder-and-major-depressive-disorder/CC0750BAF0C64183F751504434175FCA','https://cambridge.org/core/journals/european-psychiatry/article/does-bipolar-disorder-differ-from-other-mental-illnesses-in-terms-of-emotion-dysregulation-a-systematic-review-and-metaanalysis/BA6413AA6D21BF1035E53E02EEE14E04','https://archive-ouverte.unige.ch/unige:89042'],
  researchPasses:[
   {pass:'A \u00b7 construct and source check',
    focus:'Establish the real DSM-5-TR boundaries of bipolar disorder (its own Bipolar and Related Disorders chapter) and ADHD (the Neurodevelopmental Disorders chapter) separately, then check whether HCX_LIB\u2019s single "bipolar \u00b7 ADHD" sub line under one hyper-complex name is a defensible single construct or a bundle of two distinct clinical categories that should be addressed or split.',
    sources:['https://www.nimh.nih.gov/health/topics/bipolar-disorder','https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9567078/','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9403243/','https://pubmed.ncbi.nlm.nih.gov/25406047/','https://pubmed.ncbi.nlm.nih.gov/33515607/','https://pubmed.ncbi.nlm.nih.gov/21278822/','https://pmc.ncbi.nlm.nih.gov/articles/PMC7027938','https://pubmed.ncbi.nlm.nih.gov/31792363/'],
    finding:'Bipolar disorder and ADHD are two distinct DSM-5-TR categories from two different clinical classes. Bipolar I, bipolar II and cyclothymic disorder sit in the manual\u2019s own Bipolar and Related Disorders chapter, defined by discrete manic, hypomanic and major depressive episodes that mark a change from the person\u2019s baseline. ADHD sits in the Neurodevelopmental Disorders chapter, defined by a persistent, generally continuous pattern of inattention and or hyperactivity-impulsivity present since childhood, DSM-5 moved the required age of onset from before 7 to before 12, without the episodic break from baseline that defines a mood episode. The two do co-occur more than chance predicts: current reviews put ADHD prevalence among adults with bipolar disorder at roughly 10 to 30 percent, and a genome-wide association meta-analysis (van Hulzen et al, 2016) found a substantial SNP-based genetic correlation between them, about 0.64 in the full sample and 0.71 restricted to early-onset bipolar cases, a result a 2019 GWAS (O\u2019Connell et al) replicated and extended with novel shared risk loci. Shared genetic risk and elevated comorbidity are not evidence that the two are one construct. The clinical literature on this exact pairing is dominated by differential-assessment guidance precisely because the two are frequently confused for each other, not because they are the same thing, and the guidance turns on episode pattern, a sustained days-to-weeks change from baseline against a more continuous, trait-like presentation, and on childhood history. HCX_LIB\u2019s "bipolar \u00b7 ADHD" sub line for Dysregulation bundles a mood disorder and a neurodevelopmental disorder under one hyper-complex name and one structural image, the swing that overshoots and never settles, which fits the real, well documented overlap in energy, impulsivity and attentional symptoms between the two, but elides the chapter-level, mechanism-level and treatment-level difference between them, mood stabilizers and antipsychotics for bipolar disorder against stimulants and non-stimulants for ADHD. That asymmetry is flagged here rather than silently resolved, the same way Sociopathy flagged Predatory\u2019s machiavellian-and-antisocial bundle: either the family keeps both named and every write-up holds behavior, trigger and practice open enough to cover a mood-episode shape and a trait-like attentional shape without asserting they are one mechanism, as attempted above, or the owner splits the bundle the way Grandiosity and Predatory are already two different families. A further, separate question this pass does not resolve: whether a Dysregulation entry belongs in DESCENT\u2019s malignancy-gated table at all, since bipolar disorder and ADHD are not harm-to-others constructs the way the table\u2019s four completed entries are, is left open for the owner and for a later pass.'},
   {pass:'B \u00b7 evidence and dimension check',
    focus:'Pressure-test pass A\u2019s behavior, trigger and impact claims against deeper evidence: is emotional dysregulation in this pairing unidimensional or does it vary by facet (ADHD presentation; bipolar spectrum position)? How strong is the comparative evidence base between bipolar disorder and ADHD specifically, as opposed to the broader transdiagnostic dysregulation literature? Are there prevalence, measurement-validity or misdiagnosis-direction findings that should qualify the draft\u2019s wording?',
    sources:['https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9464828/','https://core-prod.cambridgecore.org/core/services/aop-cambridge-core/content/view/A87DE2F2846B9019656A97ECA842B901/S003329172300243Xa.pdf/emotion_dysregulation_in_bipolar_disorder_compared_to_other_mental_illnesses_a_systematic_review_and_metaanalysis.pdf','https://pmc.ncbi.nlm.nih.gov/articles/4282137','https://www.ajmc.com/view/emotional-dysregulation-and-executive-dysfunction-in-patients-with-adhd-and-bipolar-disorder','https://eprints.whiterose.ac.uk/id/eprint/183369/1/Attention-DeficitHyperactivity%20Disorder%20Predominantly%20Inattentive%20SubtypePresentation%20Research%20Progress%20and%20Translational%20St.pdf','https://chadd.org/about-adhd/adhd-quick-facts-adhd-presentations/','https://www.nature.com/articles/s41398-021-01666-3','https://resolve.cambridge.org/core/journals/european-psychiatry/article/does-temperamental-instability-support-a-continuity-between-bipolar-ii-disorder-and-major-depressive-disorder/CC0750BAF0C64183F751504434175FCA'],
    finding:'Three findings qualify pass A\u2019s draft rather than overturn its construct-bundling flag. First, the comparative evidence base specifically between bipolar disorder and ADHD is thin: a 2023 systematic review and meta-analysis (De Prisco et al, Cambridge Core) comparing emotion dysregulation in bipolar disorder against other conditions found 20 studies against major depression (n=2451) and six against borderline personality disorder (n=1001), but only three studies against ADHD (n=232), too few for a reliable pooled estimate. A larger systematic review (Carmassi et al, 2022, PMC9464828) treats emotional dysregulation as a trans-nosographic dimension that cuts across bipolar disorder, ADHD, autism spectrum disorder and personality disorders alike, and a 2021 transdiagnostic neuroimaging study (Nature Translational Psychiatry) explicitly modeled ADHD, bipolar disorder and borderline personality disorder together on shared dimensional variability rather than as separate categories. So the broader claim, that dysregulation is a real cross-condition pattern, has decent support; the narrower claim, that bipolar disorder and ADHD specifically are the right pair to name together over other dysregulation-linked conditions, has much weaker direct support. Second, the construct is not uniform within either half of the bundle. On the ADHD side, the DSM-5 recognizes three presentations, inattentive, hyperactive-impulsive and combined, and prevalence reviews (CHADD) put combined at roughly 50 to 75 percent of cases, inattentive at 20 to 30 percent and hyperactive-impulsive at around 15 percent; a predominantly inattentive presentation has no hyperactive or expansive pole to swing toward, so this entry\u2019s "overshoots at both ends" image fits only some ADHD presentations and not others. On the bipolar side, the Akiskal-tradition bipolar-spectrum model (cyclothymic temperament through bipolar II to bipolar I) remains an open, debated dimensional-versus-categorical question in the literature rather than settled fact, so reading \"bipolar\" as one point on this entry\u2019s axis is itself a simplification the source literature has not resolved either. Third, the mechanism distinction sharpens pass A\u2019s hedge rather than removing it: secondary reporting on a direct adult comparison study (Richard-Lepouriel et al, 2016, summarized via an AJMC conference report) found ADHD participants scoring higher than bipolar participants on one standard emotional-intensity measure and a mixed result on another, so the common assumption that bipolar disorder supplies the swing\u2019s high pole and ADHD its low pole does not hold up in direct comparison; both conditions show elevated reactivity, shaped differently rather than ranked by intensity. A widely cited review (Shaw et al, 2014, PMC4282137) adds that the field has not settled whether emotional dysregulation is a trait that merely correlates with ADHD, a core defining feature of ADHD itself, or both, which means pass A\u2019s single trigger-mechanism story for the ADHD half rests on one of several live theoretical positions, not a consensus one. None of this resolves pass A\u2019s two flags, the bundle and the DESCENT placement; it gives the owner and pass C sharper, better-sourced versions of each to rule on.'},
   {pass:'C \u00b7 adversarial and safety review',
    focus:'Check passes A and B for deterministic or stigmatizing wording ("a person with this IS" in place of "may"), check whether the proposed opposite, Regulated Range, is overclaimed as a validated construct rather than this product\u2019s own inferred coinage, check whether any line reads as clinically labeling an individual rather than describing a pattern, and verify two of pass B\u2019s most load-bearing numeric claims against the published record.',
    sources:['https://cambridge.org/core/journals/european-psychiatry/article/does-bipolar-disorder-differ-from-other-mental-illnesses-in-terms-of-emotion-dysregulation-a-systematic-review-and-metaanalysis/BA6413AA6D21BF1035E53E02EEE14E04','https://archive-ouverte.unige.ch/unige:89042'],
    finding:'No deterministic or stigmatizing wording was found in either draft. Every behavioral, trigger and impact claim is hedged with "may," "can," or "in the source model," and both drafts carry explicit anti-determinism sentences, "A swing between energy and flatness is not on its own evidence that either pattern is present" and "This is a working formulation, not a universal cause, and it is not a validated account of why any individual person swings," that go further than the comparable fields in the completed Narcissism and Machiavellianism entries. The proposed opposite, Regulated Range, is not overclaimed: oppositeStatus reads "inferred-working-counterpart; not asserted as a canonical one-to-one opposite," the identical phrasing used for Narcissism\u2019s, Machiavellianism\u2019s and Psychopathy\u2019s opposites, and oppositeDefinition never cites a source or claims clinical validation. No line reads as diagnosing an individual: livedExample is a third-person hypothetical scenario in the same unhedged-narrative convention already used by Narcissism\u2019s and Psychopathy\u2019s own livedExample fields, and pass B already added the caveat that a single inattentive-ADHD or depressive-episode presentation would not match that one scripted arc. Two numeric claims were independently re-checked against primary sources rather than taken on trust: the De Prisco et al 2023 meta-analysis (Psychological Medicine, via Cambridge Core) confirms exactly three studies and n=232 comparing bipolar disorder to ADHD on emotion dysregulation, the thinnest of its three comparison arms; and the Richard-Lepouriel et al 2016 study (Journal of Affective Disorders, confirmed via its original archive record) shows a genuinely opposite-direction result rather than a loosely summarized "mixed" one, ADHD scoring higher on the Affect Intensity Measure (3.74 vs 3.56, p<.0001) while bipolar disorder scores higher on the Affective Lability Scale (3.07 vs 2.30, p<.0001), which if anything strengthens pass B\u2019s point that neither condition reliably owns one pole of the swing. The one substantive issue carried forward from passes A and B, whether "bipolar \u00b7 ADHD" should be one hyper-complex or two, and whether Dysregulation belongs in the malignancy-gated DESCENT table at all, is a construct and placement question for the owner at pass D, not a wording defect this pass can fix or that further rewriting would resolve.'},
   {pass:'D \u00b7 crosswalk, falsification and trust boundary',
    focus:'Trace the exact tie into the real engine (HCX_LIB, compute()\u2019s chain) and confirm no fabricated edge; name concrete, observable signs a practitioner could use to tell this correspondence is wrong for a specific person; and state who may see this content, what the client is told first, and what a practitioner may never do with it.',
    sources:[],
    finding:'No fabricated edge: this entry is a DESCENT-table correspondence read only inside the gated dark read, by name lookup against HCX_LIB\u2019s own Dysregulation hyper complex, the same bare nm match Narcissism and Machiavellianism already use; compute() builds no fam or pair tie for it the way it does for Sociopathy and Psychopathy. But the dark read\u2019s own gate condition, shape outward and control organized, is a harm-to-others malignancy reading, the one the other four DESCENT entries share and this entry\u2019s own research never establishes for bipolar disorder or ADHD, so the placement itself, not the code, is this pass\u2019s sharpest finding and is named in crosswalk above rather than resolved: the owner should rule whether this belongs in DESCENT at all, or whether it needs a surface with no malignancy gate, the way HCXCARD.dysregulation already serves every person carrying the pattern with no gate and no clinical name. Falsification is listed concretely above rather than left as "it might not apply": episode structure, age of onset, presentation type, an identifiable external cause that resolves the swing, and the stronger-evidenced borderline personality disorder comparison a practitioner should also weigh. The trust boundary follows this product\u2019s own existing rule for a practitioner\u2019s sight of psychological self report, explicit consent, a visible list, revocation, never a silent default, and adds the two rules specific to a clinical correspondence: the cluster name is never spoken to the client, and the structural layer is referred out, never worked directly, per DESCENT_REFER.'}
  ]
 }},
 {nm:'Dissociation',kind:'hyper complex',
 d:'the outline holds and there is nobody inside it',
 content:{
  inferred:false,
  inferenceBasis:'The hyper-complex name Dissociation, its d line ("the outline holds and there is nobody inside it"), its HCX_LIB sub correspondence ("schizoid \u00b7 withdrawal") and its tie to this family\u2019s own saboteur notes (Hyper-Rational, Escapist) are source-defined / owner-ruled, in engine/data/nodes.js. The behavior, trigger, lived example, impact, practice and opposite below are a research-informed expansion across two passes (construct/source check, then dimension/evidence check), not a clinical diagnosis. HCX_LIB\u2019s own sub line bundles one accepted clinical category, schizoid personality disorder, with a lay descriptive word, withdrawal, that names no clinical category on its own; passes A and B below find that word closer in mechanism to depersonalization/derealization disorder than to avoidant personality disorder, and that finding is carried into the wording below rather than used to silently rename HCX_LIB\u2019s sub line, which stays the owner\u2019s call.',
  behavior:'May show little interest in forming or keeping close relationships and seem indifferent to praise or criticism, which dimensional personality research ties to low antagonism specifically, distinct from the fear-and-negative-affect profile that marks avoidant patterns. Separately, under load, a person may stay reasoned, accurate and outwardly composed while reporting that nothing felt present behind the response, as if watching it from outside, or may exit a conversation, task or relationship before an uncomfortable feeling has run its course. What is reported is an absence of felt experience at the time, not a demonstrated global absence of affect: a 2025 embodiment study found people scoring higher on this kind of detachment were not uniformly unreactive, some stayed responsive to specific high-arousal states, so "nobody inside it" describes what is noticed, not a settled fact about what is or is not happening underneath. These may not be the same person or the same mechanism, and this entry does not assume HCX_LIB\u2019s bundling of the two under one sub line is correct as written.',
  triggerMechanism:'In the schizoid-type half, there may be no clear trigger at all: the lower draw toward closeness looks trait-like rather than reactive. In the depersonalization-type half, a 2024 general-population study frames the disengagement as an emotion-regulation response to feeling overstimulated or overwhelmed, not a switch thrown by any single demand for closeness: affect mutes before it is felt and regulated, and the same study found this pattern co-occurring with other regulation strategies such as withdrawal, ignoring and rumination. This is a working formulation, not a universal cause, and on its own it does not indicate schizoid personality disorder, a dissociative disorder, or any other clinical category in a given person.',
  livedExample:'In a difficult performance conversation, a person gives clear, correct, well-reasoned feedback and answers every follow-up competently, and afterward says they cannot say what they felt during it at the time, only that they were somewhere else watching it happen, with no memory of a felt reaction in the moment.',
  impact:'Can leave a person accurate and capable while the relationship around them registers as thin or one-sided, since other people may sense the absence even when nothing said was wrong. Can also delay a person noticing their own distress until it has built considerably, because the felt signal that would normally prompt action was not registered at the time. Review and longitudinal evidence on the depersonalization-type half specifically, not the schizoid-type half, associates this pattern with higher later depressive symptoms and with elevated rates of this kind of detachment inside depression, borderline presentations and PTSD, so where it shows up alone it is worth checking into rather than filing as a standalone personality style.',
  practice:'Notice the moment a response is running on reasoning alone with no felt signal attached, or the moment leaving starts to look like the move before an uncomfortable feeling has finished. Separate what is the correct or safe thing to do here from what, if anything, am I actually feeling right now, and name the second even when the honest answer is nothing I can find in this moment. Choose to stay one beat longer with the feeling, or say its absence out loud to someone, before acting on the reasoned answer alone.',
  oppositeName:'Inhabited Presence', oppositeId:'opposite:Dissociation',
  oppositeDefinition:'Staying inside one\u2019s own felt experience while relating and while reasoning, so closeness is wanted rather than merely tolerated, and a difficult feeling is registered and carried through rather than reasoned around or exited before it completes.',
  oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
  crosswalk:'This entry is the DESCENT-table correspondence for the real HCX_LIB row {nm:"Dissociation", sub:"schizoid \u00b7 withdrawal"} (engine/data/nodes.js), built from the two saboteurs HCX_LIB itself ties to it, Hyper-Rational (74,84,76) and Escapist (14,27,1); compute() compounds them into the Dissociation hyper complex only once both have formed and their paired complex weight reaches 6.5, the same gate every hyper complex uses. Were this wired into this table with fam:"Dissociation", it would be read by descentHeld() inside darkRead() exactly the way Sociopathy already reads fam:"Predatory": gated on malig>=0.55 and CQ<31, never by position or depth alone once a tied step exists. No fetter, saboteur or complex parentage is invented here; this is a read of an existing tie, not a new edge. One open point the crosswalk surfaces rather than resolves: malig in this engine is computed from CQ alone, not from the outward/inward shape axis, so the dark gate can fire for this inward-landing, withdrawal-shaped family on low coherence alone, the same as it would for an outward-pointing one, even though darkRead\u2019s own wording ("the shape is malignant") was built for those outward families.',
  falsification:'Only one of the two carrying saboteurs loaded (Escapist without Hyper-Rational, or the reverse) means the person shows half the pattern, not the correspondence drawn here. The person actively wanting closeness and naming fear as the reason they pull back is avoidant-shaped, the near opposite mechanism, and falsifies this entry outright. Detachment that is trigger-bound and episodic rather than trait-like and context-free points away from the schizoid-type half and toward a trauma-reactive or state-like dissociative response instead. Staying reactive to specific high-arousal situations while flat elsewhere (the 2025 embodiment finding) means "nobody inside it" is situational, not global, and the entry should not be read as a stable style. A low CQ driving the dark gate that traces to an unrelated heavy load or an incomplete intake, rather than to this pattern itself, means the dark read picked the wrong tied step. Untreated depression, BPD or PTSD alongside the pattern is a sign the correspondence is incomplete, not necessarily wrong, and should not be filed under this label alone.',
  trustBoundary:'Not ship-ready for any screen today, practitioner included: CLAUDE.md requires explicit consent, a visible list of who has sight, and revocation before any practitioner sees a person\u2019s self report, and none of the three exists yet (engine/practitioner.js: "nothing here reads another person\u2019s record, and nothing can... there is no grant"). Separately and already in force: HCX_LIB\u2019s clinical correspondence is ruled off the client\u2019s own screen by name (ui/ui.js, ui/map.js); only the plain d line ever reaches the person it is about, inside the gated dark read. Before any future grant, the client must be told in plain words that a practitioner would see a pattern-level reading and a research note, never their story text, that the clinical words behind it are a working correspondence and not a diagnosis, and that the grant is revocable, per DECISIONS.md\u2019s existing scope (fetters, saboteurs, complexes, hyper complexes and their analytics; never the story cloud). A practitioner must never state this as a diagnosis, treat it as a validated assessment, use it to decide something about the person\u2019s capacity, reliability, custody, employment or care, repeat the sub line\u2019s clinical words to the client, or use it in place of, rather than alongside, a licensed clinician, per DESCENT_REFER\u2019s own line.',
  oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
  confidence:0.56,
  reviewStatus:'external-research-pass-A-done; semantic-pass-B-done (dimension and evidence check); adversarial-pass-C-done (checked wording for deterministic or stigmatizing language and the proposed opposite for overclaiming); crosswalk-falsification-trust-pass-D-done (this round): traced the exact HCX_LIB/compute() tie with no invented edge, named six concrete disconfirming checks a practitioner could run against a specific person, and set the sight boundary to practitioner-mode-only pending the consent/visible-list/revocation grant CLAUDE.md requires and that is not yet built. Passes A and B both find that HCX_LIB\u2019s lay word "withdrawal" sits closer, mechanically, to depersonalization/derealization disorder than to avoidant personality disorder, and that the schizoid half and the depersonalization-type half track different dimensional predictors (low antagonism versus an overstimulation-driven regulation response) rather than one mechanism; the owner has not yet ruled whether HCX_LIB\u2019s sub line should be reworded, split, kept exactly as is, or wired into this table at all with fam:"Dissociation", and the behavior/trigger/impact/crosswalk text above now explicitly covers both halves without assuming the bundle is correct as written.',
  researchSources:['https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/schizoid-personality-disorder-scpd','https://www.ncbi.nlm.nih.gov/books/NBK559234/','https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/avoidant-personality-disorder-avpd','https://pmc.ncbi.nlm.nih.gov/articles/PMC11910194/','https://pubmed.ncbi.nlm.nih.gov/40093848/','https://pubmed.ncbi.nlm.nih.gov/12724246/','https://discovery.ucl.ac.uk/10150602/1/David_The%20Prevalence%20of%20Depersonalization-Derealization%20Disorder_AOP.pdf','https://www.psychologicalscience.org/journals/clinical/21677026251365927/','https://ajp.psychiatryonline.org/doi/10.1176/appi.ajp.2017.17010025','https://zenodo.org/records/1231490/files/article.pdf','https://scholarlyworks.adelphi.edu/esploro/outputs/journalArticle/Deconstructing-Detachment-Contrasting-Trait-Profiles-in/991004442995406266','https://czasopisma.uwm.edu.pl/index.php/pp/article/view/9771','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11528536/','https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1481439/full','https://karger.com/psp/article/doi/10.1159/000553161/951028/Depersonalization-Emotion-Embodiment-and'],
  researchPasses:[
   {pass:'A \u00b7 construct and source check',
    focus:'Check whether schizoid and the lay word withdrawal in HCX_LIB\u2019s Dissociation sub line name real, distinct clinical constructs; test whether avoidant personality disorder or depersonalization/derealization disorder is the more precise fit for what this family\u2019s own saboteur notes (Hyper-Rational, Escapist) actually describe; keep the product\u2019s own d line separate from any disorder\u2019s defining features.',
    sources:['https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/schizoid-personality-disorder-scpd','https://www.ncbi.nlm.nih.gov/books/NBK559234/','https://www.msdmanuals.com/professional/psychiatric-disorders/personality-disorders/avoidant-personality-disorder-avpd','https://pmc.ncbi.nlm.nih.gov/articles/PMC11910194/','https://pubmed.ncbi.nlm.nih.gov/12724246/'],
    finding:'Schizoid personality disorder is a real DSM-5-TR category: detachment from relationships plus restricted emotional expression, driven by genuine disinterest, not fear (MSD Manual; NCBI Bookshelf/StatPearls). That anchors the first half of HCX_LIB\u2019s sub line accurately. Withdrawal is not a diagnosis; checked against this family\u2019s own saboteurs it does not point toward avoidant personality disorder, whose mechanism is wanting closeness but withholding from fear of rejection or humiliation, close to the opposite valence of "the outline holds and there is nobody inside it." What Hyper-Rational and Escapist actually describe is closer to depersonalization/derealization disorder, a distinct DSM-5 dissociative category defined by felt detachment from one\u2019s own emotions, body or surroundings with intact reality testing. Flagged for the owner rather than silently fixed.'},
   {pass:'B \u00b7 dimension and evidence check',
    focus:'Use dimensional-trait and emotion-regulation literature to test and refine the behavior, trigger and impact claims, and to check whether the DES/dissociation measurement literature supports treating this as one mechanism or two.',
    sources:['https://scholarlyworks.adelphi.edu/esploro/outputs/journalArticle/Deconstructing-Detachment-Contrasting-Trait-Profiles-in/991004442995406266','https://czasopisma.uwm.edu.pl/index.php/pp/article/view/9771','https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1481439/full','https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11528536/','https://karger.com/psp/article/doi/10.1159/000553161/951028/Depersonalization-Emotion-Embodiment-and','https://ajp.psychiatryonline.org/doi/10.1176/appi.ajp.2017.17010025','https://zenodo.org/records/1231490/files/article.pdf','https://discovery.ucl.ac.uk/10150602/1/David_The%20Prevalence%20of%20Depersonalization-Derealization%20Disorder_AOP.pdf','https://www.psychologicalscience.org/journals/clinical/21677026251365927/'],
    finding:'An AMPD community-adult study finds schizoid traits uniquely predicted by low antagonism while avoidant traits are uniquely predicted by negative affectivity and low disinhibition, confirming Pass A\u2019s separation with harder dimensional evidence; an ICD-11 study finds general personality-dysfunction severity explains about 41 percent of schizoid-trait variance, supporting a dimensional rather than on/off read. On the other half, a 2024 study and a related review reframe depersonalization/derealization as an emotion-regulation response to overstimulation, co-occurring with withdrawal, ignoring and rumination and predicting later depressive symptoms, rather than a flat absence of feeling; a 2025 embodiment study found higher-scoring people were not uniformly unreactive, so the reported "nothing felt present" is better read as what is noticed, not a proven global absence of affect. Lyssenko et al.\u2019s 2018 meta-analysis (216 studies, 15,219 people, 19 clinical categories) and the older Waller/Leavitt taxometric debate both point to dissociative-experience scores forming a continuum across many conditions, and the once-claimed pathological/non-pathological taxon has not held up well on later review, so the entry should not imply a bright line between having this pattern and not.'},
   {pass:'C \u00b7 adversarial/counterpart review',
    focus:'Check the Pass B-refined behavior/trigger/impact wording for deterministic or stigmatizing language, check it against common schizoid-specific myths, and test whether the proposed opposite is overclaimed as a validated clinical counterpart.',
    sources:[],
    finding:'The refined wording keeps "may/can" hedging throughout and does not raise or imply any of the common schizoid-specific myths (resemblance to schizophrenia, violence risk, untreatability), so there was nothing stigmatizing to walk back on that front. Two phrases risked a totalizing, deterministic read: "cannot say what they felt" and "nothing I can find," both of which could sound like a claim that the person is incapable of feeling at all; both are now qualified as what was reported at the time or in this moment, matching Pass B\u2019s finding that reported absence of affect is subjective rather than demonstrated. Inhabited Presence is already labeled an inferred, non-validated working counterpart, the same way Grounded Self-Worth, Transparent Reciprocal Agency and Empathic Accountability are labeled on the Narcissism, Machiavellianism and Psychopathy entries, so no change was needed there. Confidence is left below 0.6 because the entry still covers two distinguishable clinical literatures under one owner-set label, which is inherently less settled than a single-construct entry.'},
   {pass:'D \u00b7 crosswalk, falsification and trust boundary',
    focus:'Trace the entry\u2019s real tie into HCX_LIB and compute()\u2019s chain (sabs/cxs/hys), confirming no invented parentage edge; name concrete disconfirming signs a practitioner could check against a specific person; and state who may see this content, what the client must be told first, and what a practitioner must never do with it, against CLAUDE.md\u2019s own practitioner-grant rule and the product\u2019s existing rule keeping HCX_LIB\u2019s sub line off the client\u2019s own screen.',
    sources:[],
    finding:'The crosswalk is exact and not invented: HCX_LIB\u2019s Dissociation row is built from the two saboteurs the library itself ties to it, Hyper-Rational and Escapist, and compute() compounds them into the Dissociation hyper complex only when both have formed and their paired weight reaches the same 6.5 gate every hyper complex uses; were this wired into this table it would be read exactly the way Sociopathy already reads Predatory, never a new kind of edge. Because malig in this engine is computed from CQ alone rather than an independent outward-harm measure, the dark gate can fire for this withdrawal-shaped family on low coherence alone, the same as for an outward-pointing family, which the falsification checks above account for. No practitioner-sight machinery for this content exists yet: CLAUDE.md requires explicit consent, a visible list of who has sight, and revocation before any practitioner sees a person\u2019s self report, and engine/practitioner.js\u2019s own header says none of the three is built, so this object is not ship-ready for any screen, practitioner included, until that grant exists; the one piece of this family already reaching a screen, HCX_LIB\u2019s d line, reaches only the person it is about, and the product\u2019s own ruling keeps the clinical correspondence off that same screen by name.'}
  ]
 }},
 /* A SUPER COMPLEX, AND ONE PARTICULAR ONE. The kind stands: he ruled it a
    super complex. What 0e53d037 struck was it standing as a flat kind lit for
    anybody, and pair is the fix: it is held only where compute() finds both
    of these families' hyper complexes, read into r.psychopathy. */
 {nm:'Psychopathy',kind:'super complex',pair:['Grandiosity','Predatory'],
  d:'The Grandiosity and Predatory hyper complexes running at once. Structural absence of the empathy feedback loop. The Machiavellian suppresses, so there is something to suppress. This does not suppress, because harm is always a neutral option.',
  refer:true,
  content:{
   inferred:false, inferenceBasis:'The super-complex placement and core phrasing are explicitly source-defined in this DESCENT registry. The added behavioral template is research-informed and must not be used to diagnose an individual.',
   behavior:'The source model describes harm-related feedback as structurally unavailable or not constraining choice. In real-world research, psychopathy is a complex pattern with varied measures; do not infer it from a single action, conflict, or perceived lack of warmth.',
   triggerMechanism:'In the source model, a choice point occurs where another person’s welfare would normally constrain an action, but the anticipated harm does not function as a meaningful stop signal. This is a model description, not a validated clinical mechanism for an individual.',
   livedExample:'A decision-maker recognizes that a choice will predictably injure another person, but treats that injury as irrelevant to the decision and proceeds without meaningful consideration of consent, responsibility, or repair.',
   impact:'If this pattern is present, ordinary appeals to shared feeling may not be sufficient to protect others; prioritize boundaries, accountability, documented decisions, and appropriate professional support.',
   practice:'Do not rely on an assumed emotional response. Make behavioral limits explicit, document decisions and consequences, require independent oversight where harm risk exists, and seek qualified professional guidance when safety or clinical concerns arise.',
   oppositeName:'Empathic Accountability', oppositeId:'opposite:Psychopathy', oppositeDefinition:'Empathic accountability: recognizing others’ welfare as decision-relevant, inhibiting preventable harm, respecting consent, and taking responsibility for consequences.',
   oppositeStatus:'inferred-working-counterpart; not asserted as a canonical one-to-one opposite',
   confidence:0.64, reviewStatus:'external-research-pass-A-partial; source model wording requires expert review; semantic-pass-B-and-adversarial-pass-C-pending',
   researchSources:['https://pubmed.ncbi.nlm.nih.gov/34636074/','https://pubmed.ncbi.nlm.nih.gov/23885245/','https://pubmed.ncbi.nlm.nih.gov/35349788/','https://www.annualreviews.org/content/journals/10.1146/annurev-clinpsy-072720-012851','https://pmc.ncbi.nlm.nih.gov/articles/PMC13422123/','https://www.sciencedirect.com/science/article/abs/pii/S0191886923003549'],
   researchPasses:[
    {pass:'A · construct and safety check',focus:'Review psychopathy construct and measurement; separate ATÜNED source model from clinical/forensic assessment.',sources:['https://pubmed.ncbi.nlm.nih.gov/34636074/','https://www.annualreviews.org/content/journals/10.1146/annurev-clinpsy-072720-012851'],finding:'Psychopathy is a complex research construct; the source model’s “structural absence” wording is not a validated individual mechanism or diagnostic rule.'},
    {pass:'B · evidence and facet check',focus:'Review meta-analysis of empathy domains and systematic work on dark-trait measurement.',sources:['https://pubmed.ncbi.nlm.nih.gov/35349788/','https://www.sciencedirect.com/science/article/abs/pii/S0191886923003549'],finding:'Empathy associations differ by dimension and measurement; avoid assuming global absence of empathy or inferring a trait from one action.'},
    {pass:'C · adversarial/safety review',focus:'Test for deterministic or stigmatizing language against newer systematic evidence on behavioral outcomes.',sources:['https://pmc.ncbi.nlm.nih.gov/articles/PMC13422123/','https://pubmed.ncbi.nlm.nih.gov/35349788/'],finding:'Population-level associations do not diagnose individuals or establish inevitable harm. Empathic Accountability is an inferred behavioral pole; safeguards should emphasize observable conduct, boundaries, oversight and qualified support.'}
   ]
  }}];
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
/* ONE READER, FOR ALL FOUR CALLERS. mirrorAt took seatIg on a 0 to 10 scale
   and every caller typed out bandIg(seat) by hand to get it, which seeds an
   unanswered law to 6. compassAt reads a row from compute()'s own seatRows()
   instead, which carries an honest ig, null when the seat has nothing
   answered. NULL IS AN ANSWER: a seat that has not been answered reads as
   not yet read, the way the rest of this file already treats a null. */
function compassAt(row){
 if(!row)return null;
 if(row.ig==null)return null;
 return mirrorAt(row.weight*10, row.ig*10);}
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
/* A DESCENT STEP BY ITS NAME, never by where it sits in the table. darkRead
   read DESCENT[2] as the floor, and the first entry added in the middle
   would have moved the referral's step onto it without a word. */
function descentStep(nm){
 for(var i=0;i<DESCENT.length;i++)if(DESCENT[i].nm===nm)return DESCENT[i];
 return null;}
/* WHETHER A READING HOLDS THE STRUCTURE A STEP IS TIED TO. A step with
   neither fam nor pair is not tied to the chain and is never held this way.
   r is a compute() result, or what a plan may see of one (sightR in
   ui/lock.js), so a rung the plan hides is never held here either. */
function descentHeld(d,r){
 if(!d||!r)return false;
 if(d.pair)return !!(r.psychopathy&&r.psychopathy.named===d.nm);
 if(d.fam)return (r.hys||[]).some(function(h){return h.nm===d.fam&&!h.over;});
 return false;}
function darkRead(mal01, CQ, r){
 /* mal01 is the malignancy axis, nought to one, and CQ is the coherence axis.
    Two measurements, not one twice. An unreadable shape is never dark.
    r is optional and only chooses the step. Without it no tied step is ever
    chosen, which is the safe direction: an untied step, never a label the
    chain does not support. */
 if(mal01===null||mal01===undefined)
  return {mal:null,cq:Math.round(CQ),dark:false,step:null,refer:false,say:''};
 var mal=clamp(mal01,0,1);
 var dark=(mal>=DARK_MAL)&&(CQ<DARK_CQ);
 /* WHICH STEP, ruled 26 October. A tied step is chosen only when the chain
    holds it, deepest first, and never by depth. Psychopathy was chosen at CQ
    under 11 for anybody dark, which named it on fields with no Grandiosity
    in them at all. Depth still chooses between the untied two. The referral
    below is not moved: it is a safety rule and not a label, so it keeps
    following depth alone, exactly as before. */
 var tied=null;
 if(dark)for(var i=DESCENT.length-1;i>=0&&!tied;i--)if(descentHeld(DESCENT[i],r))tied=DESCENT[i];
 return {mal:Math.round(mal*100), cq:Math.round(CQ),
  dark:dark,
  /* which step of the descent, and only while both conditions hold */
  step:!dark?null:(tied||descentStep(CQ<21?'Machiavellianism':'Narcissism')),
  refer:dark&&CQ<11,
  say:!dark?'':'The shape is malignant and your energy is decoherent at the same time. '
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
   loose saboteurs, then complexes, then hyper complexes, then super complexes. The
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

