
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
/* A HISTORY BELONGS TO THE RECORD IT WAS TAKEN FROM, AND ONLY THAT RECORD MAY
   TAKE IT BACK.

   One stack for the whole app was a field leak, and it is the second of this
   shape in the product. Reproduced in the full functional run: a story is
   committed with James loaded, which pushes his nine charges onto the stack,
   the commit handler then calls toYou() so the pointer moves to the person's
   own record, and the undo arrow restores James's field into S. S.who is 0 by
   then, and S.who===0 is the claim that S holds the person's own field, so
   settle() in ui/panels.js calls saveYou() and pSave() and writes it through.
   Measured at the release block of that same run, before the release had been
   touched: 53.0 of James's charge sitting in PEOPLE[0].c and in the person's
   own record, on a person who had entered nothing.

   ui/release.js already ruled how this crossing is answered: refuse it, do not
   repoint, because two attempts at repointing were each worse than the bug.
   So this does not repoint and undoApply still does not touch S.who. Switching
   record hides the arrows, because there is nothing to take back HERE, and
   switching back brings that record's history with it. That is why the stacks
   are keyed rather than cleared on a switch: clearing would spend a person's
   whole history on one glance at a worked example, and this module's own
   argument is that a person who cannot get back to where they started has a
   grace period and not an undo.

   Keyed by the record's id, not by S.who. S.who names a persona, and every one
   of the person's own records is S.who 0, so keying on it would leave two of
   their own profiles sharing one history and leaking into each other in exactly
   the same way. With no record bound at all, which is what a headless run has,
   there is one history under a key of its own. */
function undoRec(){ return (typeof CURP!=='undefined'&&CURP&&CURP.id)?CURP.id:'_'; }
var UNDO={};
function undoList(){ var k=undoRec(); return UNDO[k]||(UNDO[k]=[]); }
/* REDO. Undo without it is half a control.

   Taking a step back and then finding there is no way forward makes undo
   something a person is careful with rather than something they explore with,
   which is the opposite of what it is for. The redo stack takes whatever undo
   pops and holds it until the person either walks forward again or makes a
   new change, at which point the branch they walked away from is gone. That
   is the standard contract and it is the one people already have in their
   hands. */
var REDO={};
function redoList(){ var k=undoRec(); return REDO[k]||(REDO[k]=[]); }

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
 var U=undoList();
 U.push({s:undoState(), nm:label||'the last change', t:new Date().toISOString()});
 if(UNDO_MAX>0){while(U.length>UNDO_MAX)U.shift();}
 /* a new change abandons the branch that was walked away from */
 REDO[undoRec()]=[];
 return U.length;}

/* the depth of THIS record's history, which is how many steps back a person
   can actually take from where they are standing. The arrows read it and hide
   themselves on zero, so a control never offers a step it would refuse. */
function undoDepth(){return undoList().length;}
function undoPeek(){var U=undoList();return U.length?U[U.length-1].nm:null;}
function redoDepth(){return redoList().length;}
function redoPeek(){var R=redoList();return R.length?R[R.length-1].nm:null;}
/* every record's history, because this is the reset and not a switch */
function undoClear(){UNDO={};REDO={};}
/* the two ends share one restore, because a state is a state whichever
   direction it was reached from, and two copies of this would drift. */
function undoApply(s){
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
 suscAll();}
/* walk forward again. Symmetrical with undoPop: it captures where it is
   standing before it moves, so undo can bring it back. */
function redoPop(){
 var R=redoList(); if(!R.length)return null;
 var e=R.pop();
 undoList().push({s:undoState(), nm:e.nm, t:e.t});
 undoApply(e.s);
 return {nm:e.nm, t:e.t};}

/* restore, and return what was undone so the host can say so. A failed undo
   returns null rather than half applying: the state is replaced wholesale or
   not at all. */
function undoPop(){
 var U=undoList(); if(!U.length)return null;
 var e=U.pop();
 /* where it is standing goes onto the forward stack before it moves, under
    the name of the change being taken back, so the forward control can say
    what it will put back. */
 redoList().push({s:undoState(), nm:e.nm, t:e.t});
 undoApply(e.s);
 return {nm:e.nm, t:e.t};}
