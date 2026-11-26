/* ============================================================
   HOW FULLY AN ARCHETYPE IS EXPRESSED. Ruled 16 October, his words: "the
   archetypes themselves should be 100%. The limiting beliefs are going to drag
   it down. So the archetype is just the archetype. The percent should show
   where they are based off their story. So you may start off at 100%. And over
   time, watch it diminish. And as you go through your recipes, watch it rise."

   So the figure an archetype carries is not how strongly the blueprint leans
   toward it. That is affinity() in engine/core.js, which is read off the soul
   map, never moves with a story or a release, and keeps its one job: naming
   the first and second archetype. One exception since 11 November: while a
   quiz self report answers affinity(), each strength is multiplied by this
   figure, because that ruling has the story adjust the reported numbers and
   this is the only per-archetype story signal there is. Printed as a percent it told a person their
   Innocent was 10% of them because the domains they picked sat elsewhere, and
   no release they ran could ever change it.

   WHERE AN ARCHETYPE ACTS IS ITS SEAT, ARCH[i].b in engine/data/canon.js,
   because that is the ruling ("the warrior's root, the sage is crown, the
   mage is third eye") and the Field rings already draw each archetype inside
   its seat (ui/rings.js). The chain through the domains was looked for and is
   not there: the canvas wheel lays the twelve out in list order over
   addresses laid out by seat, so the addresses under an archetype's sector
   disagree with its ruled seat for ten of the twelve (Sage, seated at the
   crown, sits over root and sacral addresses), and the domains are the soul
   map again. Nothing in the data ties an archetype to a mask.

   THE FORMULA IS THE SEAT'S OWN. seatField() in engine/charfield.js already
   gives each seat's mean weight over ten, sq after the opposite, so a release
   that empties an address or installs its opposite lifts it, and a story that
   lands charge there drags it. The expression is what is left:

     archExpr(i) = 1 - mean(sq at the archetype's seat) / 10

   One with nothing held. Each sq is clamped to 0 and 10 (engine/compute.js),
   so the mean stays inside them and the figure inside 0 and 1. It reads sq as
   the last compute() left it, like everything in charfield.js: a caller that
   has not computed reads a blank field, which is 1, the honest answer for a
   person whose story has not landed anywhere.

   TWO ARCHETYPES ON ONE SEAT READ ONE FIGURE. Five seats carry two each. That
   is the seat ruling's consequence, recorded in DECISIONS.md, and splitting
   them needs a ruling on what separates them rather than a weight invented
   here.

   THE ENGINE MAY NOT TOUCH THE HOST and this file does not. It sits after
   engine/export.js and adds its names to what export.js left, as
   engine/charfield.js does.
   ============================================================ */
function archExpr(i){
 var a=ARCH[i]; if(!a)return null;
 var s=seatField().filter(function(x){return x.seat===a.b;})[0];
 return s?clamp(1-s.mean,0,1):null;}
/* all twelve in ARCH order, so a renderer asks once per render */
function archExprAll(){return ARCH.map(function(a,i){return archExpr(i);});}

/* ============================================================
   AFFINITY, SHARED LIKE A COMPETITION, 21 November. The decision, his own
   words: "add an option for both ways, 100% meaning the whole and a percent
   based off of the individual item, and I'll figure out which one I like
   better." affinity() (engine/core.js) already answers one question, which
   archetype leads and by how much against it: the leader reads 1 and every
   other reads its own fraction of that one top value, which is right for
   naming a first and second place and cannot be added across the twelve,
   because the top archetype's own 1 already uses the whole of what a sum
   would have left for the rest.

   This divides the same twelve numbers by what they add up to instead of by
   their own top, so they sum to 1 and a share this prints can sit beside
   the other eleven shares the way a real competition's results do: Warrior
   at 30 percent of the field is also saying the other eleven hold the
   remaining 70, which affinity()'s own numbers never say. Nothing here is a
   second measurement; it is the one array affinity() already returns, read
   a second way.

   affinity() never actually returns twelve zeros on a real build: a
   blueprint always leaves something under it (engine/core.js, coreAt). The
   equal-twelfths fallback below only answers a call made before any
   blueprint exists at all, the same guard affinity() keeps for its own
   early call. */
function affinityShare(){
 var a=affinity(), sum=a.reduce(function(x,y){return x+y;},0);
 return sum>0?a.map(function(v){return v/sum;}):a.map(function(){return 1/a.length;});}

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{archExpr:archExpr, archExprAll:archExprAll, affinityShare:affinityShare});}
