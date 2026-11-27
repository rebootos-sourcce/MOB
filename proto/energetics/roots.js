/* ============================================================
   NAME ROOTS. ILLUSTRATIVE ONLY. Prototype, round DM, 26 September.

   Nine names, and no more, on purpose. There is no name etymology data
   anywhere in the product (engine/numerology.js says so in its own header,
   and says why: a root meaning cannot be looked up on a device that makes no
   outbound request, and inventing one is a claim this instrument does not
   make). A real table is an open question for the owner: which licensed
   reference, what it covers, and what the product says when a name is not in
   it.

   These nine are here to show the idea working and the empty state working.
   His own three names, and the six reference ICPs' first names, each checked
   this session against published references (Behind the Name, the Online
   Etymology Dictionary and the Wikipedia name articles, read through search
   results on 26 September, because the pages themselves were blocked to this
   sandbox). Every middle and last name of the six ICPs is deliberately NOT
   here, so the walk meets the empty state the way a real table would.

   Each entry keeps two things apart, because his own three examples showed
   they differ:
     root   what the reference gives as the origin
     said   the popular reading people repeat, where it differs, and where
            it came from
   and marks a root the references disagree on as disputed, rather than
   picking one.
   ============================================================ */
var EN_ROOTS={
 LANCE:{root:'land',from:'Germanic, from Lanzo, a short form of names built on the element land',
  said:'to pierce',saidFrom:'the later link to Old French lance, a spear',disputed:false},
 ONEILL:{root:'descendant of Niall',from:'Irish, Ó Néill',
  said:'champion',saidFrom:'one proposed meaning of Niall. Cloud and passionate are the others, and the original is not known',
  disputed:true},
 POWELL:{root:'son of Hywel',from:'Welsh, ap Hywel. Hywel is hy, good, and gwêl, seen: eminent, well seen',
  said:'exalted',saidFrom:'a loose reading of eminent',disputed:false},
 SOFIA:{root:'wisdom',from:'Greek, sophia',said:null,disputed:false},
 DIANE:{root:'divine',from:'Latin, Diana, most likely from the old root for sky and shining',said:null,disputed:false},
 MARCUS:{root:'of Mars',from:'Latin, most likely after Mars. An Etruscan origin of unknown meaning is also proposed',
  said:null,disputed:true},
 ANGELA:{root:'messenger',from:'Greek, angelos',said:null,disputed:false},
 DEREK:{root:'ruler of the people',from:'Gothic, through Theodoric: þiuda, people, and reiks, ruler',said:null,disputed:false},
 JAMES:{root:'held by the heel',from:'Hebrew, Ya’aqov, through Latin Iacomus. Supplanter is the other traditional reading',
  said:null,disputed:true}};
var EN_ROOTS_SRC='Illustrative set of nine, checked 26 September against Behind the Name, the Online '
 +'Etymology Dictionary and Wikipedia. Not a licensed table.';
/* the key a name is looked up by: letters only, so O'Neill and ONeill and
   O Neill all find the same entry */
function enRootKey(s){return String(s||'').toUpperCase().replace(/[^A-Z]/g,'');}
function enRoot(s){return EN_ROOTS[enRootKey(s)]||null;}
if(typeof module!=='undefined')module.exports={EN_ROOTS:EN_ROOTS,enRoot:enRoot,enRootKey:enRootKey};
