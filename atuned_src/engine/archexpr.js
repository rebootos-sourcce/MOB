/* ============================================================
   HOW FULLY AN ARCHETYPE IS EXPRESSED. Ruled 16 October, his words: "the
   archetypes themselves should be 100%. The limiting beliefs are going to drag
   it down. So the archetype is just the archetype. The percent should show
   where they are based off their story. So you may start off at 100%. And over
   time, watch it diminish. And as you go through your recipes, watch it rise."

   So the figure an archetype carries is not how strongly the blueprint leans
   toward it. That is affinity() in engine/core.js, which is read off the soul
   map, never moves with a story or a release, and keeps its one job: naming
   the first and second archetype. Printed as a percent it told a person their
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

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{archExpr:archExpr, archExprAll:archExprAll});}
