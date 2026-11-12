
/* ============================================================
   THE ARCHETYPE SELF REPORT. Ruled 11 November, his words, verbatim:
   "The 12 archetypes do feed the existing system. It helps identify
   where a person is leaning and the strength that they align to that.
   It's self-reporting of their archetypes, and then as they input their
   story over time, the reality of those numbers adjust." (DECISIONS.md,
   "The 12 archetypes, self-reported then adjusted by the story.")

   NOT A SECOND TABLE. affinity() (core.js:574) already turns a blueprint
   pick into a per-archetype strength; the only thing it ever read before
   this file existed was S.arcs, up to four hand-picked archetype indices,
   weighted by the order they were picked in (buildSoul(), core.js:566).
   A twelve-item self-report is the same shape at higher resolution: a
   strength per archetype instead of a short, ordered pick list. So this
   file does not touch affinity(), buildSoul() or compute() at all. It
   turns twelve self-reported strengths into the ranked S.arcs list those
   functions already read, the same list panels.js already writes by hand
   (panels.js:831-838) one click at a time, and lets the existing
   arithmetic run unchanged on it. Port, do not rebuild.

   WHAT MOVES AFTER THAT IS ALREADY BUILT, AND IS NOT THIS FILE. archExpr()
   (archexpr.js) is the figure the ruling describes moving: "you may start
   off at 100%. And over time, watch it diminish... as you go through your
   recipes, watch it rise." It reads seatField(), which moves only as a
   story lands charge at an archetype's own body seat. Once this file has
   seeded S.arcs, archExpr() for every one of the twelve runs exactly as it
   would for a hand-picked profile, and the story adjusts it the same way
   it already adjusts a hand pick's. There is no separate re-weighting
   formula to invent here; the ruling's "the reality of those numbers
   adjust" is archExpr() reading seatField(), already shipped 16 October.

   WRITES ONLY ONCE, THE SAME DISCIPLINE AS seedApply (engine/seed.js). A
   self-report answered honestly and then overwritten by a later screen's
   default would be the clamped-9999 failure CLAUDE.md names under "never
   lie about a failure": seeding twice from an untouched blueprint re-seeds
   (so retaking the quiz still works), but a seed never overwrites a
   blueprint the person has since picked by hand in panels.js. */

/* twelve self-reported strengths, 0 (not me at all) to 1 (this is
   exactly me), in ARCH's own order (canon.js:435) -- the same order the
   quiz presents them, so no second index table is needed to translate
   a questionnaire answer into this array. */
function archSelfValid(vals){
 return Array.isArray(vals)&&vals.length===ARCH.length
  &&vals.every(function(v){return typeof v==='number'&&isFinite(v)&&v>=0&&v<=1;});}

/* EMPTY MEANS THE BLUEPRINT'S ARCHETYPE PICK IS STILL UNTOUCHED: either
   still exactly the schema's own default ([0,1], schema.js:27), or still
   exactly what an earlier self-report seed itself wrote. The same
   "untouched since written" test seedEmpty (seed.js) uses for charge, read
   here on the ordered pick list instead -- so a second answer of the same
   quiz re-seeds instead of stacking, and a hand pick the person has since
   made in panels.js is never clobbered. */
function archSeedEmpty(p){
 if(!p||!p.soul)return false;
 var arcs=(p.soul.arcs||[]).slice();
 var isDefault=arcs.length===2&&arcs[0]===0&&arcs[1]===1;
 var seed=p.archSeed&&p.archSeed.order;
 var isSeed=!!seed&&seed.length===arcs.length&&seed.every(function(v,i){return v===arcs[i];});
 return isDefault||isSeed;}

/* Writes the self-report onto a profile's blueprint. Ranks the twelve
   strengths strongest first and keeps the top four, the same width
   panels.js already allows a hand pick to reach (S.arcs.splice at
   panels.js:833, capped nowhere below four by that screen's own shift-
   click rule) -- a self-report is not granted a wider pick than a person
   clicking tiles gets. Only the ORDER moves affinity()/pi/si; the raw
   twelve strengths are kept on archSeed so a results screen can still
   show "how strongly you leaned," which the ranked S.arcs alone cannot. */
function archSeedApply(p,vals){
 if(!p||!p.soul||!archSelfValid(vals))return null;
 /* show only on a worked example, engine/showonly.js */
 if(showRefuse('intake',p))return null;
 if(!archSeedEmpty(p))return null;
 var order=vals.map(function(v,i){return i;})
  .sort(function(a,b){return vals[b]-vals[a];})
  .slice(0,4);
 p.soul.arcs=order;
 p.archSeed={at:new Date().toISOString(), vals:vals.slice(), order:order.slice()};
 return p.archSeed;}

/* "not said" puts the pick back to the schema default, the same shape
   seedClear (seed.js) puts charge back to the blank -- and only while
   the pick is still exactly what the seed itself wrote, so a hand pick
   the person made since is the person's and stays. A worked example is
   show only and is not written. */
function archSeedClear(p){
 if(!p||(typeof showOnly==='function'&&showOnly(p)))return p;
 if(p.archSeed&&p.soul&&archSeedEmpty(p))p.soul.arcs=[0,1];
 if(p)p.archSeed=null;
 return p;}

/* HOW MUCH OF THE PRIMARY/SECONDARY PICK IS STILL THE SELF REPORT.
   Mirrors seedShare's own measured-not-countdown shape, but the thing
   being measured here is a short ordered list, not nine continuous
   charges, so there is no partial distance to travel: a hand pick in
   panels.js replaces the whole ordered list in one click (panels.js:
   834-835), never nudges one slot of it. 1 means the blueprint arcs are
   still exactly the seed's own order; 0 means the person has since
   picked by hand and the seed is now only a record of where they
   started. Written as a function and not a bare flag so a caller never
   has to know that the shape is all-or-nothing rather than a ramp. */
function archSeedShare(p){
 if(!p||!p.archSeed||!p.soul)return 0;
 var now=(p.soul.arcs||[]).slice(), seed=p.archSeed.order||[];
 if(now.length!==seed.length)return 0;
 for(var i=0;i<seed.length;i++)if(now[i]!==seed[i])return 0;
 return 1;}

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{archSelfValid:archSelfValid, archSeedEmpty:archSeedEmpty,
  archSeedApply:archSeedApply, archSeedClear:archSeedClear, archSeedShare:archSeedShare});}
