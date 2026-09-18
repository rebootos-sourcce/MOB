
/* ============================================================
   UNDO. The largest gap in the product, named as such in the
   brief since the rebuild.

   Applying a story bakes charge into the nine axes. A release
   empties addresses and installs their opposites. A drag writes
   a value and saves it. None of it could be taken back, so the
   instrument asked a person to commit and then gave them no way
   to be wrong.

   snapshot() was not the answer. It records a derived READING,
   cq and dq and sq, which is what the record compares. You
   cannot restore a field from it because the inputs are gone.
   Undo has to capture the inputs: the nine charges, the nine
   installed opposites, the twenty one laws and the soul.

   UNLIMITED, on the owner's ruling. It was capped at twenty on
   a memory argument and the argument does not survive the
   arithmetic: one entry is nine charges, nine opposites, twenty
   one laws and a short soul, which is under a kilobyte. Ten
   thousand of them is under ten megabytes and nobody performs
   ten thousand irreversible acts in a session. A person who
   cannot get back to where they started has no undo, they have
   a grace period.
   ============================================================ */
const UNDO_MAX=0;                 /* 0 means no ceiling */
var UNDO=[];

/* the inputs, and nothing derived. everything else recomputes from these. */
function undoState(){
 var c={},o={},l={};
 CHARGES.forEach(function(k){c[k]=S.charge[k];o[k]=S.replace[k]||0;});
 SINAMES.forEach(function(k){l[k]=S.law[k];});
 return {charge:c, replace:o, law:l,
  doms:S.doms.slice(), arcs:S.arcs.slice(), roots:S.roots.slice(),
  dom:S.dom, a1:S.a1, a2:S.a2};}

/* call BEFORE the mutation, with what the person is about to do, in their
   words, because an undo control that says "undo" and nothing else makes a
   person guess what they are about to get back. */
function undoPush(label){
 UNDO.push({s:undoState(), nm:label||'the last change', t:new Date().toISOString()});
 if(UNDO_MAX>0){while(UNDO.length>UNDO_MAX)UNDO.shift();}
 return UNDO.length;}

function undoDepth(){return UNDO.length;}
function undoPeek(){return UNDO.length?UNDO[UNDO.length-1].nm:null;}
function undoClear(){UNDO=[];}

/* restore, and return what was undone so the host can say so. A failed undo
   returns null rather than half applying: the state is replaced wholesale or
   not at all. */
function undoPop(){
 if(!UNDO.length)return null;
 var e=UNDO.pop(), s=e.s;
 CHARGES.forEach(function(k){
  S.charge[k]=(s.charge[k]!==undefined)?s.charge[k]:0;
  S.replace[k]=(s.replace[k]!==undefined)?s.replace[k]:0;});
 SINAMES.forEach(function(k){if(s.law[k]!==undefined)S.law[k]=s.law[k];});
 S.doms=s.doms.slice(); S.arcs=s.arcs.slice(); S.roots=s.roots.slice();
 S.dom=s.dom; S.a1=s.a1; S.a2=s.a2;
 buildSoul();
 /* susceptibility is a function of the soul and is written by a pass, not by
    compute, so restoring the soul without rerunning it leaves the field
    attributing stories against the wrong profile. */
 suscAll();
 return {nm:e.nm, t:e.t};}
