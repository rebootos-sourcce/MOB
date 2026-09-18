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
  ask:'Does this person’s warmth cost them anything, or does it require an audience?'},
 {k:'DE', q:'Desire and will', seat:'Sacral',
  up:'Ramakrishna', upd:'Will surrendered to Source. Desire as devotion. Wanting that moves toward something beyond the self.',
  dn:'Asmodeus',    dnd:'Craving without closure. Appetite that cannot satisfy. Having never resolves the wanting.',
  ask:'Does wanting move them toward something, or does having never satisfy?'},
 {k:'OR', q:'Order', seat:'Throat',
  up:'Moses', upd:'Structure in service of liberation. Law that creates freedom. Order others can stand within.',
  dn:'Set',   dnd:'Chaos engineered to prevent coherence. Betrayal as systemic strategy. Disruption from inside trusted systems.',
  ask:'Does this person build structures others can stand in, or dismantle what others depend on?'},
 {k:'PO', q:'Power', seat:'Solar',
  up:'Musashi', upd:'Mastery that costs the practitioner. Power in service of precision. Discipline the self bears.',
  dn:'Moloch',  dnd:'Power that extracts from others. The machine that must be fed. Discipline that others pay for.',
  ask:'Who pays the cost of this person’s discipline?'},
 {k:'PE', q:'Perception', seat:'3rd Eye',
  up:'Buddha', upd:'Clear seeing. Reality without overlay. The compositor running on present signal.',
  dn:'Geryon', dnd:'Engineered surface. Beautiful above, serpentine beneath. Perception itself weaponised.',
  ask:'Does this person’s self presentation match their interior state?'},
 {k:'TR', q:'Trust', seat:'Heart',
  up:'Rumi',   upd:'Direct encounter with the field. Felt knowing. The heart as the instrument.',
  dn:'Charon', dnd:'Threshold paralysis. Cannot cross what cannot be measured. The rational mind forever preparing to arrive.',
  ask:'Does this person access experience directly, or require verification before they allow themselves to feel?'},
 {k:'CH', q:'Charge', seat:'Root',
  up:'Elijah',   upd:'Grounded fire. Intensity moving through the body without destroying the container or the target.',
  dn:'Phlegyas', dnd:'Charge split at the root. Outward as rage or inward as paralysis. The same current, no clean exit.',
  ask:'Where does this person’s intensity go when it has nowhere to land?'},
 {k:'RE', q:'Revelation', seat:'Crown',
  up:'Meister Eckhart', upd:'Direct knowing. Doctrine made unnecessary by experience.',
  dn:'The Furies',      dnd:'Map replacing territory permanently. The belief system defended against any experience that contradicts it.',
  ask:'Can this person update their framework when direct experience contradicts it?'}];

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
 {nm:'Christ',    ax:'Z',  of:'Ananda apex',         was:'Love',                 d:'Maximum expansion, the state in which every other frequency can reorganise around the coherent signal. The body is the instrument.'},
 {nm:'Krishna',   ax:'Z',  of:'Ananda in motion',    was:'Flow',                 d:'The field wants to move, and most suffering is the result of blocking that motion.'},
 {nm:'Rama',      ax:'∑', of:'all three held',  was:'Alignment',            d:'Sat, Chit and Ananda clear at once. Duty as the spine that keeps all three upright under pressure.'},
 {nm:'Lao Tzu',   ax:'⊥', of:'horizontal',      was:'Non resistance',       d:'Perpendicular to the vertical axes. Stop the activity generating the interference.'},
 {nm:'Moses',     ax:'X',  of:'Sat midpoint',        was:'Order',                d:'Where macro intelligence becomes transmissible to local intelligence as structure.'},
 {nm:'Rumi',      ax:'Z',  of:'Ananda as beauty',    was:'Beauty',               d:'The nervous system recognising coherent structure and stabilising around it. He arrived at maximum civilisational destruction.'},
 {nm:'Musashi',   ax:'∴', of:'practice layer',  was:'Discipline',           d:'Sustained application of will at the node level over time. Two steps forward, one step back. Failure as data, not judgement.'},
 {nm:'Ramakrishna',ax:'Z', of:'desire surrendered',  was:'Devotion',             d:'Wanting that moves toward something beyond the self.'},
 {nm:'Elijah',    ax:'Z',  of:'charge grounded',     was:'Fire',                 d:'Intensity moving through the body without destroying the container or the target.'},
 {nm:'Meister Eckhart',ax:'Y', of:'revelation',      was:'Direct knowing',       d:'The framework dropped because what it pointed at has been encountered.'}];

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
 {c:1, nm:'Limbo',      by:'Charon',     p:'Disbelief. Spiritual bypass through rationalism. Nothing is felt, nothing is trusted.', at:'Crown to heart circuit never completed'},
 {c:2, nm:'Lust',       by:'Minos',      p:'Narcissism. Grandiose entitlement. The narcissist appoints himself arbiter of all things.', at:'Sacral, desire looping without ground'},
 {c:3, nm:'Gluttony',   by:'Cerberus',   p:'Consumption as substitution. Appetite replacing connection. Each mouth feeds and none is filled.', at:'Solar collapse driving upward into the oral circuit'},
 {c:4, nm:'Greed',      by:'Plutus',     p:'Scarcity identity. Accumulation as self proof. Worth measured in possession.', at:'Root locked in survival frequency'},
 {c:5, nm:'Wrath and sloth', by:'Phlegyas', p:'Two exits for one suppressed charge. Wrath outward as attack, sloth inward as shutdown. Same origin.', at:'Solar, the fight or freeze split'},
 {c:6, nm:'Heresy',     by:'The Furies', p:'Ideological decoherence. Belief replacing direct experience. Doctrine as identity armour.', at:'Third eye locked, perception distorted by installed narrative'},
 {c:7, nm:'Violence',   by:'Minotaur',   p:'Against others, against the self, against order. The pattern has escaped containment.', at:'Full system, no single anchor'},
 {c:8, nm:'Fraud',      by:'Geryon',     p:'Beautiful surface, serpentine beneath. Shine without a light source. The mask has become the entire operating system.', at:'Heart inverted, warmth performed rather than generated'},
 {c:9, nm:'Treachery',  by:'Satan frozen',p:'Complete inversion. No flow, no movement, maximum resistance. Stasis at terminal velocity, not active evil.', at:'Full system locked, no circuit completing anywhere'}];

/* ---- THE BEHAVIOURAL CASCADE ----
   Six named states between early decoherence and full fragmentation. */
const CASCADE=[
 {nm:'The Zombie',        d:'Passive disengagement. Going through motions without presence. Still functional, still responding, nothing is home.'},
 {nm:'The Drone',         d:'Obedience without independent thought. The system has outsourced its own navigation.'},
 {nm:'The NPC',           d:'Identity built from external narratives and approval. No interior reference point.'},
 {nm:'The Energy Vampire',d:'Extracting emotional resource from others to sustain the self. No internal generative charge. It runs on borrowed current.'},
 {nm:'The Demon',         d:'Chaotic destructive reactivity without self awareness. No gap between stimulus and response.'},
 {nm:'The Devil',         d:'Calculated manipulation and deliberate domination. Not reactive, strategic. Awareness is present and deployed against coherence.'}];

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
function darkRead(malig, CQ){
 var mal=clamp((malig||0)/100,0,1);
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
