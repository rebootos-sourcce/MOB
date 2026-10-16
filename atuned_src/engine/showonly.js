/* ============================================================
   A WORKED EXAMPLE IS SHOW ONLY. Ruled 16 October, his words: "something we
   need to do with those user profiles where the customer who selects any of
   the tiers cannot run a profile's inference. And for show only. Otherwise,
   that's cheating." And the same day: "it allows people to see the patterns.
   But not run them. If you're a tier one, it allows you to see what you're
   missing as a product."

   WHAT THE CHEAT WAS, measured on the build from before this file (origin/
   main 920d7ed2). Every worked example opens on tier four sight (loadP,
   ui/personas.js, ruled 2 October), and the refusals that stood were one per
   control and read S.who: the Story commit refused, and the release refused
   only at relCoolDown, after the whole protocol had begun (Begin pressed on
   Gordon went to phase welcome), so the voice was spoken and paid for on a
   run its end would refuse. The Intake did not refuse at all. On Gordon, with
   the own record free and the example on tier four, one press on an Intake
   answer moved S.law and took his CQ from 17.52 to 18.10, and the status line
   said nothing: every reading on the screen re-read the press at tier four.
   A refusal that arrives after the work is not a refusal of the work, and a
   control with no refusal is the cheat itself.

   SO THE RULE LIVES HERE, ONCE, AND THE WRITERS ASK IT. A control does not
   have to remember the rule: every engine writer that moves the field or a
   record (applyStory, verpApply, leanApply, relWrite, releaseWork, meterRun,
   meterFirst, lawAnswered, iqAnswer, ixSet, seedApply, pImport) asks
   showRefuse before it writes, so a control added later is refused by the
   writer it calls, by name, and says so. The saves already refuse a record
   that is not in PROFILES (pSave, NotARecord), and a worked example never is.

   WHICH RECORD IS AN EXAMPLE, BY IDENTITY. loadP marks the scratch record it
   makes for an example (showMark), and the mark is the object, held here and
   never written on the record: a flag on the record would travel through an
   export and could be pasted back, and an identity cannot. The person's own
   records are never marked, so their own tier and their own writes are
   exactly what they were.

   THE AUTHORED HISTORY IS NOT A PERSON RUNNING IT. An example's bank and
   vault are replayed through these same writers once, the first time it is
   opened (exdepthFill, engine/exdepth.js). That is the build's own data put
   in place, so the replay raises SHOW_REPLAY for its own body and puts it back
   in its finally, and nothing else raises it.

   THE ENGINE REPORTS AND THE HOST DECIDES THE WORDS, the split pPersist and
   devSet keep. showRefuse records what was refused and hands the key to the
   reporter the host bound (bindShowSay); with none bound, a headless run, it
   still refuses and the caller reads showLast. HOST FREE. It sits after
   engine/export.js and adds its names to what export.js left, as
   engine/archexpr.js does.
   ============================================================ */
var SHOW_RECS=[], SHOW_REPLAY=0, SHOW_SAY=null, SHOW_LAST=null, SHOW_N=0;
/* rec is an example's scratch record; marking twice is one mark */
function showMark(rec){
 if(rec&&typeof rec==='object'&&SHOW_RECS.indexOf(rec)<0)SHOW_RECS.push(rec);
 return rec;}
/* whether a record is shown only. With no argument it asks about the record
   that is open, which is the one every writer below is about to touch. */
function showOnly(rec){
 var r=arguments.length?rec:((typeof CURP!=='undefined')?CURP:null);
 return !!r&&SHOW_RECS.indexOf(r)>=0;}
/* THE ONE REFUSAL. what is the key of the thing refused (story, release,
   intake, import), which the host turns into a sentence. rec, when a writer
   is handed the record it writes, is asked instead of CURP, because that is
   the record that would move. Returns true when the caller must stop. */
function showRefuse(what,rec){
 if(SHOW_REPLAY>0)return false;
 var r=(rec!==undefined&&rec!==null)?rec:((typeof CURP!=='undefined')?CURP:null);
 if(!showOnly(r))return false;
 SHOW_N++;
 SHOW_LAST={what:String(what||'run'), name:(r&&r.name)||'', n:SHOW_N};
 if(typeof SHOW_SAY==='function'){ try{ SHOW_SAY(SHOW_LAST.what); }catch(e){} }
 return true;}
function showLast(){ return SHOW_LAST?Object.assign({},SHOW_LAST):null; }
function bindShowSay(fn){ SHOW_SAY=(typeof fn==='function')?fn:null; return SHOW_SAY; }

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{showMark:showMark, showOnly:showOnly, showRefuse:showRefuse,
  showLast:showLast, bindShowSay:bindShowSay});}
