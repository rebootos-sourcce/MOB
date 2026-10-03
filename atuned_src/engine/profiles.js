/* ============================================================
   THE PROFILES ON THIS DEVICE, BY NAME. Round JZ, his words: "build out the
   profile page. So if I enter my profile, it saves my data. Under Lance. And I
   can delete or retrieve it."

   NOTHING NEW IS STORED. Every profile already lives in PROFILES, carries a
   name, and is written whole to one key by pPersist (engine/schema.js). What
   was missing was the door: a name could be changed in Settings and nowhere
   could a person see the list, open another one or delete one that was not
   the one in front of them. So this module is four verbs over the list that
   exists, and it adds no field, no key and no version.

   A NAME IS A LABEL, NEVER A KEY. Round KG, his words: "you should be able
   to use your own name, and it does not overwrite. If my name is Philip
   Long, someone else overseas is called Philip Long, the database should be
   able to handle both." Two profiles on this device may carry the same
   name; open and delete both work by id (profFind), never by name, so
   nothing about choosing between them breaks. A name is never cut to fit: a
   name longer than the limit is refused and says the limit, because a
   quietly cut name is a name the person did not type.

   EVERY OPEN GOES THROUGH THE BOUNDARY. A profile is read back from the list
   through validateProfile before it is loaded, on a copy, so a record that
   something in the session has bent out of shape is refused by the field that
   failed and the profile on screen stays where it was.

   EVERY WRITE IS ATOMIC, the pImport posture. The list and CURP move only once
   the write has landed; a refused write puts both back and says why through
   profErr(). The host decides the words.

   The engine does not know what a persona is. Moving S.who onto the person's
   own field, and the mirror in PEOPLE[0], are the host's (ui/account.js).
   ============================================================ */
var PROF_NAME_MAX=60, PROF_ERR=null;
function profErr(){ return PROF_ERR?PROF_ERR.slice():null; }
function profFind(id){
 for(var i=0;i<PROFILES.length;i++)if(PROFILES[i]&&PROFILES[i].id===id)return PROFILES[i];
 return null;}
/* null when the name can be used, otherwise why not. self is unused now that
   a name is never checked against the rest of the list (round KG); kept in
   the signature so profRename's own call needs no change. */
function profNameWhy(name,self){
 if(typeof name!=='string')return 'a name has to be typed';
 var v=name.trim();
 if(!v)return 'a profile needs a name';
 if(v.length>PROF_NAME_MAX)return 'a name holds up to '+PROF_NAME_MAX+' letters, this one has '+v.length;
 return null;}
/* THE LIST, AS A READING. Derived on every call and stored nowhere, so it can
   never disagree with the records it describes. */
function profList(){
 return PROFILES.map(function(p){
  var a=(p.intake&&p.intake.answers)||{};
  return {id:p.id, name:p.name, cur:p===CURP,
   created:p.created||null, updated:p.updated||null,
   stories:((p.story&&p.story.entries)||[]).length,
   answered:Object.keys(a).filter(function(k){return a[k]!=null;}).length};});}
/* S belongs to CURP only when the last load said so. Written back before the
   list moves, so leaving a profile never drops the last thing done on it. */
function profHold(){
 if(CURP&&PROFILES.indexOf(CURP)>=0&&S.rec&&S.rec===CURP.id)saveProfile(CURP);}
/* THE SAVE UNDER A NAME. The profile in front of the person takes the name and
   is written, working state and all. */
function profRename(name){
 PROF_ERR=null;
 if(!CURP||PROFILES.indexOf(CURP)<0){PROF_ERR=['there is no profile of your own open'];return false;}
 var why=profNameWhy(name,CURP); if(why){PROF_ERR=[why];return false;}
 var was=CURP.name; CURP.name=name.trim();
 if(!pSave()){CURP.name=was; pPersist();
  PROF_ERR=['could not save: '+(SAVE_ERR||'error')]; return false;}
 return true;}
/* A NEW, BLANK PROFILE under a name, and it becomes the one in front of them. */
function profCreate(name){
 PROF_ERR=null;
 var why=profNameWhy(name,null); if(why){PROF_ERR=[why];return null;}
 profHold();
 var keepP=PROFILES.slice(), keepC=CURP, p=blankProfile(name.trim());
 var back=function(){PROFILES=keepP; CURP=keepC; if(keepC)loadProfile(keepC);};
 PROFILES.push(p); CURP=p;
 try{ loadProfile(p); }catch(e){ back(); PROF_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }
 if(!pPersist()){ back(); PROF_ERR=['could not save: '+(SAVE_ERR||'error')]; return null; }
 return p;}
/* THE RETRIEVE. Validated on a copy first, loaded second, and CURP moves last.
   The record itself is never rewritten here: opening a profile is reading it.
   The one write is a device-side pointer to which one is open (devSet, the
   same convenience store practitioner mode and sound already use), so the
   boot step can find it again rather than falling back to PROFILES[0] on
   every reload. Best effort: a failed write costs that fallback, never a
   record. */
function profOpen(id){
 PROF_ERR=null;
 var p=profFind(id);
 if(!p){PROF_ERR=['no profile with that id is on this device'];return null;}
 var v=validateProfile(JSON.parse(JSON.stringify(p)));
 if(!v.ok){PROF_ERR=(v.errs||['it did not validate']).slice(0,3);return null;}
 if(p===CURP&&S.rec===p.id)return p;
 profHold();
 var keepC=CURP;
 try{ loadProfile(p); }
 catch(e){ CURP=keepC; try{ if(keepC)loadProfile(keepC); }catch(e2){}
  PROF_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }
 CURP=p;
 try{ devSet('open',p.id); }catch(e){}
 return p;}
/* THE DELETE, of any profile on the list and not only the open one. Deleting
   the open one opens the first left, and deleting the last one leaves a blank
   called You, which is what a first visit gets. The answer says which name
   went and whether the open profile moved, so the host can say both. */
function profDelete(id){
 PROF_ERR=null;
 var p=profFind(id);
 if(!p){PROF_ERR=['no profile with that id is on this device'];return null;}
 profHold();
 var keepP=PROFILES.slice(), keepC=CURP, cur=(p===CURP);
 var back=function(){PROFILES=keepP; CURP=keepC; if(cur&&keepC){try{loadProfile(keepC);}catch(e){}}};
 PROFILES.splice(PROFILES.indexOf(p),1);
 if(cur){
  if(!PROFILES.length)PROFILES.push(blankProfile('You'));
  CURP=PROFILES[0];
  try{ loadProfile(CURP); }
  catch(e){ back(); PROF_ERR=['could not load: '+((e&&e.message)||'error')]; return null; }}
 if(!pPersist()){ back(); PROF_ERR=['could not save: '+(SAVE_ERR||'error')]; return null; }
 return {name:p.name, id:p.id, moved:cur};}
