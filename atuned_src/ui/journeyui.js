/* ============================================================
   THE HOST'S HALF OF THE JOURNEY RECORD. engine/journey.js decides
   and validates; this reads the one run that is on screen and hands
   it over. It is the only place the release card's RUN object is
   turned into a journey fact, so release.js carries three hook lines
   and none of the arithmetic.

   Kept out of ui/release.js on purpose: that card is being redesigned
   and a hook that is one call into this file survives the redesign,
   where a block of record keeping inside the card would not.
   ============================================================ */
/* WRITE THE RUN THAT JUST ENDED OR WAS CLOSED onto the person's own record.

   end is completed, ended or closed. relCoolDown writes the first two, once,
   after meterRun or meterRerun and before the save, so the run and the meter
   it moved reach the disk in one write. relClose writes closed, and only for a
   card shut before it finished: Done on a finished card also comes through
   relClose, and that run has already been written by relCoolDown, so a second
   record for it would count one release as two.

   lines is what the meter moved by, which is every line the commit took:
   meterRun and meterRerun record the whole plan, so a run ended early moved
   the meter by all of it, and a record that said fewer would disagree with the
   meter beside it. fresh is the new ground. added and repeated are the two
   halves of the commit's own answer, so their sum is the lines it took, which
   is what a rerun reports too.

   A worked example writes nothing, for the reason relCoolDown refuses to run
   on one: the journey is the person's, and CURP can still point at a case
   while one is loaded. Returns the engine's answer, or null when nothing was
   to be written. A refusal is said on the status line, because a record the
   person's release did not leave is a write that failed. */
function relJourney(end){
 if(typeof CURP==='undefined'||!CURP||typeof journeyRun!=='function')return null;
 if(typeof S!=='undefined'&&S.who!==0)return null;
 var closed=(end==='closed');
 if(closed&&!(RUN.open&&!RUN.done&&/^(welcome|opening|run)$/.test(RUN.phase)))return null;
 var m=RUN.meter||{};
 var r=journeyRun(CURP,end,closed?{lines:0,fresh:0,rerun:!!RUN.rerun}
  :{lines:(m.added||0)+(m.repeated||0), fresh:(m.fresh||[]).length, rerun:!!RUN.rerun});
 /* the engine's reason is a path into the record and means nothing to the
    person, so the line says what happened and the reason goes to the console
    for whoever has to find the writer that got a number wrong */
 if(!r.ok){
  try{console.warn('journeyRun refused: '+r.why);}catch(e){}
  if(typeof status==='function')status('This release finished, but it could not be written into your record.','fail');}
 return r.ok?r:null;}
