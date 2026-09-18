
/* ============================================================
   SAB33 · the 33-saboteur library. Each row is
   [name, [[charge, lo, hi], ...]]. A range is a BAND, not a floor:
   below it the saboteur has not formed, above it the charge has
   escalated past this one into a heavier profile.
   ============================================================ */
var SAB33=[["Avoider",[["fear",3,5],["anxiety",5,8]]],["Controller",[["fear",7,10],["anger",5,8]]],["Victim",[["sadness",6,8],["anger",4,6]]],["Perfectionist",[["disgust",5,7],["anger",4,6]]],["Pleaser",[["fear",2,4],["shame",5,8]]],["Hyper-Achiever",[["fear",4,6],["shame",6,9]]],["Hyper-Rational",[["shock",2,4],["disgust",3,5]]],["Hyper-Vigilant",[["fear",7,9],["anger",5,7]]],["Restless",[["fear",3,5],["anxiety",5,8]]],["Stickler",[["disgust",4,6],["anger",4,6]]],["Judge",[["disgust",6,8],["anger",5,7]]],["Deflector",[["shame",4,6],["anger",4,6]]],["Dramatizer",[["shock",6,8],["sadness",4,6]]],["Worrywart",[["fear",6,8],["sadness",3,5]]],["Loner",[["sadness",6,8],["fear",5,7]]],["People-Pleaser",[["shame",3,5],["fear",5,8]]],["Skeptic",[["disgust",5,7],["shock",3,5]]],["Dreamer",[["sadness",2,4],["fear",3,6]]],["Procrastinator",[["fear",4,6],["sadness",3,5]]],["Imposter",[["shame",5,7],["fear",4,6]]],["Aggressor",[["anger",7,9],["shame",4,7]]],["Martyr",[["sadness",6,8],["anger",4,6]]],["Cynic",[["disgust",6,8],["sadness",4,6]]],["Manipulator",[["anger",6,8],["fear",5,8]]],["Overthinker",[["fear",5,7],["shame",4,6]]],["Escapist",[["fear",6,8],["sadness",5,8]]],["Nihilist",[["disgust",7,9],["sadness",5,7]]],["Innocent",[["fear",2,4],["shock",4,7]]],["Pessimist",[["sadness",5,7],["fear",4,6]]],["Catastrophizer",[["fear",8,10],["sadness",6,8]]],["Enabler",[["shame",4,6],["sadness",5,8]]],["Control Freak",[["fear",7,9],["anger",5,7]]],["Negotiator",[["fear",3,5],["shame",4,7]]]];

/* the authored clinical composition per saboteur. the original carried this
   and never read it; it is the sub-line on every named saboteur drill now. */
var SABAUTH={
 'Hyper-Achiever':"Fear of being ordinary + Overwork + Worth tied to output",
 'Restless':"Intolerance of stillness + Novelty seeking + Avoidance",
 'Stickler':"Rigidity + Correction of others + Fear of disorder",
 'Judge':"Othering + Contempt + Certainty without evidence",
 'Worrywart':"Rehearsal of disaster + Fear + Illusion of preparedness",
 'Skeptic':"Pre-emptive doubt + Disgust + Refusal to be moved",
 'Dreamer':"Retreat into the possible + Sadness + Avoidance of the actual",
 'Aggressor':"Aggression + Cruelty + Self-importance",
 'Manipulator':"Covert control + Dishonesty + Fear of direct request",
 'Nihilist':"Refusal of meaning + Contempt + Despair worn as clarity",
 'Innocent':"Refusal to see + Shock + Deference",
 'Catastrophizer':"Terminal forecasting + Fear + Grief taken in advance",
 'Control Freak':"Anxiety + Micromanagement + Distrust of others' hands",
 'Imposter':"Shame + Anticipation of exposure + Discounting of evidence",
 'People-Pleaser':"Self-erasure + Fear of rejection + Approval as safety",
 'Avoider':"Fear of confrontation + Delusion + Laziness",
 'Bully':"Aggression + Cruelty + Self-importance",
 'Codependent':"Fear of abandonment + Lack of self-esteem + Dependency",
 'Controller':"Anxiety + Manipulation + Impatience",
 'Critic':"Self-hatred + Judgment of others + Perfectionism",
 'Cynic':"Doubt + Procrastination + Lack of effort",
 'Deflector':"Insecurity + Dishonesty + Pretending",
 'Dramatizer':"Craving for attention + Emotional instability + Exaggeration",
 'Enabler':"Need to be needed + Self-neglect + Overindulgence",
 'Escapist':"Overindulgence in fantasies + Apathy + Sensual desire",
 'Hero':"Pride + Overcommitment + Self-importance",
 'Hyper-Rational':"Dismissal of emotions + Arrogance + Skepticism",
 'Hyper-Vigilant':"Paranoia + Panic + Fear",
 'Intellectualizer':"Overanalysis + Detachment from feelings + Arrogance",
 'Loner':"Distrust + Fear of intimacy + Independence",
 'Martyr':"Self-pity + Resentment + Sacrificial over-giving",
 'Negotiator':"Doubt + Procrastination + Lack of effort",
 'Nonconformist':"Rebellion against norms + Pride + Isolation",
 'Overthinker':"Anxiety + Doubt + Procrastination",
 'Perfectionist':"Fear of failure + Excessive desire for wealth + Overindulgence",
 'Pessimist':"Nihilism + Hopelessness + Cynicism",
 'Pleaser':"Need for approval + Fear of rejection + Lack of moral dread",
 'Procrastinator':"Avoidance + Doubt + Fear of failure",
 'Rebel':"Resentment against authority + Pride + Hostility",
 'Savior':"Need to rescue + Self-importance + Neglect of own needs",
 'Victim':"Sadness + Self-loathing + Hopelessness"};

/* archetype rolls up from its primary saboteur. wired into the archetype drill. */
var ARCH18=[['Warrior','Controller','Solar'],['Caregiver','Pleaser','Heart'],
 ['Creator','Stickler','Throat'],['Sage','Hyper-Rational','3rd Eye'],
 ['Jester','Avoider','Sacral'],['Lover','Hyper-Vigilant','Heart'],
 ['Magician','Victim','Crown'],['Innocent','Restless','Root'],
 ['Outlaw','Judge','Solar'],['Ruler','Hyper-Achiever','Crown'],
 ['Explorer','Avoider','Sacral'],['Orphan','Worrywart','Root'],
 ['Hero','Hyper-Achiever','Solar'],['Everyman','Pleaser','Heart'],
 ['Mentor','Stickler','3rd Eye'],['Shadow','Judge','Solar'],
 ['Shapeshifter','Restless','Sacral'],['Healer','Hyper-Vigilant','Heart']];

const BANDS=['Root','Sacral','Solar','Heart','Throat','3rd Eye','Crown'];
/* Hue is the language and does not move. Chroma comes down 30 to 40 percent on
   the warm three, which carry the arousal, and slightly on the cool four, which
   are already doing the calming work. Full chroma is reserved for ALARM. */
const PAL={'Root':'#C4635E','Sacral':'#D19255','Solar':'#D4BC70','Heart':'#6FC5A3',
 'Throat':'#65B8D4','3rd Eye':'#8296DB','Crown':'#A98BCE'};
const PAL_LIGHT={'Root':'#9B4B47','Sacral':'#8E6231','Solar':'#7E6C29','Heart':'#2A7A5C',
 'Throat':'#2C6F88','3rd Eye':'#4C5F9E','Crown':'#6E5490'};
const GOLD='#DFCC7E', ALARM='#FF2E1F';

/* the seat glyphs. the direction's vocabulary: each seat has a mark, so the
   ring can name where it sits without a word. */
const SEATGLYPH={
 'Root':'<path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z"/>',
 'Sacral':'<path d="M12 4c4 4 4 12 0 16-4-4-4-12 0-16z"/>',
 'Solar':'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
 'Heart':'<path d="M12 20s-7-4.5-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.5-7 9-7 9z"/>',
 'Throat':'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 3"/>',
 '3rd Eye':'<circle cx="12" cy="12" r="3"/><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/>',
 'Crown':'<path d="M12 3v18M3 12h18"/>',
 '_':'<circle cx="12" cy="12" r="7"/>'};

/* ============================================================
   THE NINE POLED AXES. Poles ruled 14 September 2026 for
   Anticipation, Surprise and Shock; the other six follow the same
   binary: a held state and its coherent opposite.
   ============================================================ */
const CHILD=[
 {nm:'Fear',        opp:'Trust',       addr:'Lumbar plexus',              loc:'lower back, gut',    seat:'Root',   ic:'M12 3l8 14H4z'},
 {nm:'Anger',       opp:'Equanimity',  addr:'Celiac plexus',              loc:'upper abdomen',      seat:'Solar',  ic:'M13 2L4 14h6l-1 8 9-12h-6z'},
 {nm:'Shame',       opp:'Worth',       addr:'Pudendal plexus',            loc:'pelvic floor',       seat:'Sacral', ic:'M5 20V9a7 7 0 0114 0v11M9 20v-6h6v6'},
 {nm:'Disgust',     opp:'Acceptance',  addr:'Sacral and dermis',          loc:'lower abdomen, skin',seat:'Sacral', ic:'M4 8c4 4 12 4 16 0M6 16c3-3 9-3 12 0'},
 {nm:'Apathy',      opp:'Vitality',    addr:'Shoulder girdle and throat', loc:'base of neck',       seat:'Throat', ic:'M4 12h16M4 7h16M4 17h16'},
 {nm:'Shock',       opp:'Groundedness',addr:'Prefrontal and dermis',      loc:'forehead, skin',     seat:'3rd Eye',ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-4.5 0a4.5 4.5 0 109 0 4.5 4.5 0 10-9 0'},
 {nm:'Sad',         opp:'Joy',         addr:'Cardiac plexus',             loc:'centre chest',       seat:'Heart',  ic:'M12 20s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z'},
 {nm:'Surprise',    opp:'Readiness',   addr:'Upper chest and back',       loc:'upper torso',        seat:'Heart',  ic:'M12 3v18M7 7c-3 2-3 9 0 11M17 7c3 2 3 9 0 11'},
 {nm:'Anticipation',opp:'Presence',    addr:'Below the heart',            loc:'lower sternum',      seat:'Solar',  ic:'M12 4v11M8 11l4 4 4-4M6 20h12'}];
const CHARGES=CHILD.map(c=>c.nm);
/* Ten of the 33 are Shirzad Chamine's Positive Intelligence saboteurs, the
   Judge and its nine accomplices. They are marked so the product gives the
   source its due. The other 23 are SOURCE's own extension of the library. */
/* the six gate glyphs, 24 unit box, stroked. the eye open and shut for
   awareness and ignorance, the dot outside the ring for detachment, the
   raised arrow for intention, the link for attachment, the path bending
   around the dot for aversion. */
const GATEGLYPH={
 aware:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
 detach:'M10 14m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
 intent:'M12 20V5M6 11l6-6 6 6',
 ignore:'M2 12s4 5 10 5 10-5 10-5M6 15l-2 3M12 17v3M18 15l2 3',
 attach:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
 averse:'M3 19C3 9 21 9 21 19M12 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0'};
const SAB_PI=['Judge','Avoider','Controller','Hyper-Achiever','Hyper-Rational',
 'Hyper-Vigilant','Pleaser','Restless','Stickler','Victim'];
/* Inferred saboteurs are clusters the library does not name: two or more
   addresses in one seat carrying the same child fetter. They take an agent
   noun for the fetter so they read alongside the named ones, and they carry
   the inferred flag everywhere they show. */
const INFER_NOUN={Fear:'Flincher',Anger:'Striker',Shame:'Hider',Disgust:'Recoiler',
 Apathy:'Drifter',Shock:'Freezer',Sad:'Mourner',Surprise:'Startler',Anticipation:'Bracer'};
/* routing from the node map's eight charge labels onto the nine child fetters */
const REROUTE={Fear:'Fear',Anger:'Anger',Shame:'Shame',Disgust:'Disgust',Sadness:'Sad',
 Shock:'Shock',Resentment:'Anger',Joy:'Apathy'};
const HEARTKEY=/LONGING|CLOSED HEART|REJECTION|RECEIV|UNWORTH|GRIEF|SORROW/i;
const SURPKEY=/SHOCK|BETRAYAL|OVERSENSITIV|STARTLE|PANIC/i;
const ANTKEY=/EXPECTATION|ANXIETY|WORRY|HYPERVIGIL|DREAD|ANTICIPAT|OBSESS|COMPULS/i;

const ROOTD=['Architect','Engine','Weaver','Witness'];
const ROOTCOL={Architect:'#8296DB',Engine:'#D19255',Weaver:'#6FC5A3',Witness:'#A98BCE'};
/* nineteen named blueprint domains under the four roots. the original header
   comment claimed eighteen with four unnamed; the data has always been
   nineteen named, and DARC divides by nineteen. */
const DOMAINS=[
 {nm:'Knowledge',  r:'Architect',d:'understanding as operating mode',      ic:'M4 6h7v13H4zM20 6h-7v13h7'},
 {nm:'Justice',    r:'Architect',d:'alignment with natural law',           ic:'M12 3v18M4 8h16M7 8l-3 6h6zM17 8l-3 6h6z'},
 {nm:'Imperium',   r:'Architect',d:'rulership through structure',          ic:'M3 19l3-12 6 6 6-6 3 12z'},
 {nm:'Duty',       r:'Architect',d:'obligation held without resentment',   ic:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z'},
 {nm:'Fate',       r:'Architect',d:'the order you did not choose',         ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 3v9l6 4'},
 {nm:'Power',      r:'Engine',   d:'directed force. the warrior, not the king',ic:'M13 2L4 14h6l-1 8 9-12h-6z'},
 {nm:'Creation',   r:'Engine',   d:'bringing form from potential',         ic:'M12 12m-1 0a1 1 0 108 0 8 8 0 10-14 5'},
 {nm:'Dissolution',r:'Engine',   d:'releasing form back to potential',     ic:'M4 4h7v7H4zM15 15h5v5h-5M14 6h2M18 6h2M6 14v2M6 18v2'},
 {nm:'Descent',    r:'Engine',   d:'voluntary entry into shadow material', ic:'M12 3v14M6 12l6 6 6-6M4 21h16'},
 {nm:'Death',      r:'Engine',   d:'the ending that makes room',           ic:'M12 21V8M6 8h12M9 8V5a3 3 0 016 0v3M4 21h16'},
 {nm:'Connection', r:'Weaver',   d:'bond without dependency',              ic:'M9 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M15 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0'},
 {nm:'Exchange',   r:'Weaver',   d:'reciprocal flow of value',             ic:'M3 9h15l-4-4M21 15H6l4 4'},
 {nm:'Restoration',r:'Weaver',   d:'return to coherent baseline',          ic:'M20 12a8 8 0 11-3-6M20 3v6h-6'},
 {nm:'Provision',  r:'Weaver',   d:'supplying what the other needs',       ic:'M4 9h16l-1.6 11H5.6zM8 9V6a4 4 0 018 0v3'},
 {nm:'Play',       r:'Weaver',   d:'unstructured creative exploration',    ic:'M2 15c3-7 5 7 8 0s5 7 8 0'},
 {nm:'Nature',     r:'Witness',  d:'observation without interference',     ic:'M12 21V9M12 9C9 9 5 7 5 3c4 0 7 2 7 6M12 11c3 0 7-2 7-6-4 0-7 2-7 6'},
 {nm:'Trickster',  r:'Witness',  d:'pattern disruption through paradox',   ic:'M4 18c4-10 12 10 16 0M4 8h.01M20 8h.01'},
 {nm:'Mystery',    r:'Witness',  d:'holding the unresolved without closing it',ic:'M9 9a3 3 0 115 2.2c-1 .8-2 1.4-2 2.8M12 18h.01'},
 {nm:'Guardian',   r:'Witness',  d:'watching over what cannot watch itself',ic:'M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6zM9 12l2 2 4-4'}];
/* THE DOMAIN MATRIX. root domain crossed against child fetter. 1.3x on the
   high-affinity pairs. this is what produces Distortion. */
const AFFIN={Architect:['Apathy','Shock'],Engine:['Anger','Shame','Disgust'],
 Weaver:['Sad','Surprise'],Witness:['Fear','Anticipation']};

const ARCH=[
 {nm:'Warrior',  v:'moves on the threat',   ic:'M12 2l3 7h7l-6 4 2 8-6-5-6 5 2-8-6-4h7z'},
 {nm:'Sage',     v:'reads the situation',   ic:'M4 6h7v13H4zM20 6h-7v13h7'},
 {nm:'Rebel',    v:'refuses the frame',     ic:'M3 12h18M7 7l-4 5 4 5M17 7l4 5-4 5'},
 {nm:'Caregiver',v:'attends to the other',  ic:'M12 21s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11z'},
 {nm:'Creator',  v:'makes the thing',       ic:'M3 20l9-16 9 16z'},
 {nm:'Magician', v:'changes the conditions',ic:'M4 20L18 6M15 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1z'},
 {nm:'Ruler',    v:'orders the field',      ic:'M3 19l3-12 6 6 6-6 3 12z'},
 {nm:'Explorer', v:'goes to the edge',      ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M15 9l-2 6-4 2 2-6z'},
 {nm:'Lover',    v:'closes the distance',   ic:'M12 21s-8-5-8-11a4 4 0 018-2 4 4 0 018 2c0 6-8 11-8 11zM12 8v13'},
 {nm:'Jester',   v:'breaks the tension',    ic:'M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M8 10h.01M16 10h.01M8 15c2 2 6 2 8 0'},
 {nm:'Everyman', v:'stays with the room',   ic:'M12 8m-4 0a4 4 0 108 0 4 4 0 10-8 0M4 21c0-5 4-7 8-7s8 2 8 7'},
 {nm:'Innocent', v:'takes it at face value',ic:'M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2'}];

/* the 21 Laws of Spiritual Integrity, each seated at the band it governs.
   integrity is not one aggregate: a closed law dims its own band. */
const SI=[
 {nm:'Truth',b:'Throat'},{nm:'Transparency',b:'Throat'},{nm:'Justice',b:'Throat'},
 {nm:'Unity',b:'Crown'},{nm:'Awareness',b:'Crown'},{nm:'Nature',b:'Crown'},
 {nm:'Presence',b:'3rd Eye'},{nm:'Humility',b:'3rd Eye'},{nm:'Equanimity',b:'3rd Eye'},
 {nm:'Compassion',b:'Heart'},{nm:'Forgiveness',b:'Heart'},{nm:'Generosity',b:'Heart'},{nm:'Aesthetic Beauty',b:'Heart'},
 {nm:'Courage',b:'Solar'},{nm:'Duty',b:'Solar'},{nm:'Responsibility',b:'Solar'},{nm:'Accountability',b:'Solar'},
 {nm:'Temperance',b:'Sacral'},{nm:'Detachment',b:'Sacral'},
 {nm:'Non-Harm',b:'Root'},{nm:'Patience',b:'Root'}];
const SINAMES=SI.map(l=>l.nm);
/* six masks. roster closed 14 September 2026. Young Adult out, Adult stands. */
const MASKS=[{nm:'Child',b:['Root','Sacral']},{nm:'Preteen',b:['Solar','Throat']},{nm:'Teen',b:['Throat']},
 {nm:'Adult',b:['Sacral','Solar']},{nm:'Professional',b:['Solar','Throat']},{nm:'Ideological',b:['3rd Eye']}];

/* ============================================================
   WHAT A LABEL OWES THE PERSON IT IS PUT ON.

   Ruled by the owner: when this product hands somebody a label,
   the label carries three things or it does not go on screen.
   A definition, so the word means something specific. The energy
   and behaviour, so a person can recognise it in their own week
   rather than take it on trust. And the direction, so a label is
   a position and never a verdict.

   The tiers go first because the engine hands five of the six
   reference ICPs a moral adjective and two of them the word
   Severe. A word like that with nothing attached is a judgement.
   The same word with a definition, a behaviour and a way out is
   a reading.

   THE COPY BELOW IS A DRAFT FOR THE OWNER TO RULE ON. The
   structure is settled. The wording is not, and the tier names
   themselves are his call: the panel found these four words are
   the single largest commercial item in the product.
   ============================================================ */
const TIERDEF=[
 {at:90, nm:'Mastery',
  def:'The field builds far more than it costs. Almost nothing is held.',
  energy:'Intention and action arrive together. There is no gap left to manage.',
  toward:'Hold it. The work here is maintenance, and what you can now carry for other people.'},
 {at:70, nm:'Embodied',
  def:'The field builds more than it costs, with real load still in it.',
  energy:'You recover fast. A charge lands and clears instead of staying.',
  toward:'Mastery. Close the laws still shut, and clear what is left holding after a week.'},
 {at:50, nm:'Practicing',
  def:'The field breaks even. What it builds and what it spends are close.',
  energy:'Good days and hard days, and the difference is mostly what is running that day.',
  toward:'Embodied. Consistency rather than intensity: the same address twice beats eight addresses once.'},
 {at:31, nm:'Incoherent',
  def:'The field costs more than it builds. Charge is held at more addresses than are clearing.',
  energy:'Effort goes in and less comes out. You are working, and the work is going into holding.',
  toward:'Practicing. Take the heaviest seat first. One address cleared where the load actually sits moves this further than ten cleared anywhere else.'},
 {at:21, nm:'Corrupt',
  def:'The held charge is shaping decisions now, not only mood.',
  energy:'The pattern chooses before you do. You can see it afterwards and not while it runs.',
  toward:'Incoherent, then Practicing. The move is interruption: name the address while it is running, ahead of the behaviour.'},
 {at:1, nm:'Severe',
  def:'Most of the field is carrying. Very little is clear.',
  energy:'Ordinary demands read as threats. Capacity is spent before the day starts.',
  toward:'Off the floor, and nothing more ambitious than that. One seat, one address, one line. Not a programme.'},
 {at:0, nm:'Collapsed',
  def:'The field is fully loaded. Nothing is clearing.',
  energy:'Flat. Not calm, out of charge.',
  toward:'Weight off, and not alone. A reading this low is not a thing to manage by yourself, and the instrument will not pretend otherwise.'}];
/* one lookup, so the tier table stops being copied into renderers */
const TIER_BY={}; TIERDEF.forEach(function(t){TIER_BY[t.nm]=t;});
function tierOf(cq){
 for(var i=0;i<TIERDEF.length;i++) if(cq>=TIERDEF[i].at)return TIERDEF[i];
 return TIERDEF[TIERDEF.length-1];}
