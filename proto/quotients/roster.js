/* ============================================================
   proto/quotients/roster.js  ·  REAL PROFILES, BUILT BY THE ENGINE.

   A persona is turned into an actual profile record and pushed through
   loadProfile, so measured, unread and the gate state are the product's own
   rather than a harness approximation.

   THE FIRST CUT OF THIS FILE SET S DIRECTLY, the way proto/ladder/roster.js
   does, and every persona came back with nought laws measured. measured counts
   the non null laws on CURP, and nothing in that route ever writes CURP, so
   Rosa and Lance both came back unread: nothing carrying, nothing measured, and
   the whole page would have said their field had not been read. A reading taken
   on a state the product would never be in is a reading of the harness.

   CURP is a module variable inside the engine and cannot be assigned from
   outside it, which is correct. pNew is not in the export contract, so the one
   door a caller has is pImport, and that is the right door anyway: it is the
   validation boundary, it is atomic, and nothing lands unless the profile has
   validated, loaded and saved. Every persona on this page therefore goes
   through the same door a person's record will come through at sign in, and a
   persona that would be refused is refused here rather than drawn.

   THE BOUNDARY REFUSES WITHOUT A STORE. pImport calls pPersist, and pPersist
   returns false with no store bound, so an import into a headless process
   rolls back and reports NoStore. That is the rule working. A host binds one,
   so this binds an in memory store in node and localStorage in a browser.
   ============================================================ */
(function(root,factory){
 if(typeof module!=='undefined'&&module.exports)module.exports=factory();
 else root.QROSTER=factory();
})(typeof self!=='undefined'?self:this,function(){

function profileFor(E,per){
 var p=E.blankProfile(per.nm);
 p.soul={doms:[per.dom],arcs:[per.a1,per.a2],roots:[]};
 E.CHARGES.forEach(function(c){
  p.axes[c]={held:(per.c&&per.c[c]!==undefined)?per.c[c]:0,
             opp:(per.rep&&per.rep[c])||0};});
 /* LAWSET is the persona's own law scale and every persona in PEOPLE has an
    entry, so all twenty one read as measured for all of them. A persona with no
    entry keeps twenty one nulls, which is what somebody who has answered
    nothing looks like, and that is the honest fallback rather than a baseline
    nobody typed. */
 var LS=E.LAWSET[per.nm]||null;
 if(LS)E.SINAMES.forEach(function(l){
  p.laws[l]=(LS[l]!==undefined)?LS[l]:(LS._!==undefined?LS._:null);});
 return p;}

/* an in memory store, which is what a headless run wants. a browser passes its
   own get and set in instead. */
function bindMemory(E){
 var bag={};
 return E.bindStore(function(k){return bag[k]===undefined?null:bag[k];},
                    function(k,v){bag[k]=v;});}

/* THROUGH THE BOUNDARY, AND THE REFUSAL IS REPORTED RATHER THAN SWALLOWED.
   A persona that validateProfile will not take comes back null with the
   reasons, and the caller draws the reasons. Nothing is drawn off a profile
   the boundary refused. */
function run(E,per){
 var p=per?profileFor(E,per):E.blankProfile('Nobody');
 E.gatesClear();
 var got=E.pImport(JSON.stringify(p));
 if(!got)return {p:null, r:null, errs:E.importError()||['refused, with no reason given']};
 return {p:got, r:E.compute(), errs:null};}

return {profileFor:profileFor, bindMemory:bindMemory, run:run};
});
