/* ============================================================
   THE ONLY COPY. Open item M9, WP2a-6.

   For a person who is not signed in, the browser's own storage is the only
   copy of their record. Safari clears a site's storage after about seven days
   of use without a visit, and any browser may clear it when the disk is full.
   A failed save was already reported (pPersist, SAVE_OK, statusSaved). A
   cleared store was not: the person opened the app on an empty instrument,
   with no word about why and no way back.

   Three things, and nothing in the engine changes for any of them.

   ASK THE BROWSER TO KEEP IT. After the person's first save of the session,
   and never at boot, navigator.storage.persist() is called once. It is called
   inside the save, which is inside the press that caused it, so a browser that
   wants a gesture has one. It is never waited on: the answer lands in KEEP in
   memory and only decides whether the line below is said.

   SAY WHERE THE RECORD LIVES, ONCE. When the browser says no, or has no way to
   be asked, and a story is saved, one line says the record is kept only in
   this browser and that the browser may clear it, with a control that saves it
   as a file. It is said once in this browser (the device setting keepSaid), at
   the save that raised the story count, and the account area carries the same
   sentence beside its import for as long as it is true. The file is pExport,
   the text the Copy button copies and the importer reads. There is no second
   serialiser. The control says it was sent only after the file was made.

   TELL A CLEARED STORE FROM A FIRST VISIT. A marker under KEEP_KEY says a
   record was saved here: the time of the last write and two counts, stories
   and records. Never a name, never a word of a story. It is rewritten on every
   successful write of the person's records, from the bound store's own set,
   so it always says what the disk last took. At boot, a marker over a store
   that holds no profile is a loss, and the boot says so, offers the import,
   and keeps the blank it opens on in memory so nothing is written over the
   marker until the person writes something. No marker behaves exactly as it
   did before: a first visit.

   WHAT THE MARKER CANNOT SEE, said rather than left to be found. It lives in
   the same storage as the record. A browser that clears the whole site, which
   is what Safari's seven day rule and a full disk do, takes the marker with
   it, and that visit is a first visit as far as anything here can tell. The
   marker catches the record going while the rest of the site's storage stays.
   The first two parts are the defence against the whole site going.

   All of it is for the person who is not signed in. A signed in person's
   server copy is Block 3.
   ============================================================ */
var KEEP_KEY=PKEY+'.saved';
/* armed once the boot has finished, so the boot's own blank write is never
   read as the person's save. persist is unknown, asking, yes, no or none. */
var KEEP={armed:false, asked:false, persist:'unknown', n:0, rose:false, lost:false, line:null};
/* the words, written once and used in every place they are shown */
var KEEP_SAY_SAVE='Your record is kept only in this browser, and the browser may clear it.';
var KEEP_SAY_LOST='This browser has cleared the copy of your record it was keeping. '
 +'A saved file puts it back.';
function keepSignedIn(){
 try{ return typeof authSession==='function'&&!!authSession(); }catch(e){ return false; }}
/* the person's own records only. A worked example is never in PROFILES. */
function keepStories(){
 var n=0;
 for(var i=0;i<PROFILES.length;i++){
  var s=PROFILES[i]&&PROFILES[i].story;
  n+=(s&&Array.isArray(s.entries))?s.entries.length:0;}
 return n;}
function keepMark(){
 try{ var o=JSON.parse(localStorage.getItem(KEEP_KEY)||'null');
  return (o&&typeof o==='object'&&typeof o.t==='number')?o:null; }catch(e){ return null; }}
function keepSaid(){ try{ return !!devGet('keepSaid'); }catch(e){ return false; }}

/* AT BOOT, a store that holds no profile with a marker over it. A store that
   could not be read, or that holds records this version refused, is not
   empty: the engine has its own words for both (storeUnread, storeRefused),
   and they are said by the boot step in ui/ui.js. */
function keepLost(){
 try{
  if(PROFILES.length||keepSignedIn())return false;
  if(typeof storeUnread==='function'&&storeUnread())return false;
  if(typeof storeRefused==='function'&&storeRefused().length)return false;
  return !!keepMark();
 }catch(e){ return false; }}
/* pNew without its write. The blank is a record, so a save onto it lands and
   says so, and it reaches the disk with the person's first write and not
   before: until then the empty store and the marker are the evidence. */
function keepBlank(name){
 var p=blankProfile(name); PROFILES.push(p); CURP=p; KEEP.lost=true; return p;}

/* AFTER EVERY WRITE THAT LANDED. Called from the bound store's set in
   ui/ui.js once localStorage.setItem has returned for the record key, so a
   write that threw never gets here. It must never throw back into pPersist:
   a throw there would turn a save that landed into one reported as failed. */
function keepWrote(){
 try{
  if(!KEEP.armed||keepSignedIn())return;
  var n=keepStories();
  try{
   if(PROFILES.length)localStorage.setItem(KEEP_KEY,JSON.stringify({t:Date.now(), n:n, p:PROFILES.length}));
   else localStorage.removeItem(KEEP_KEY);
  }catch(e){}
  if(n>KEEP.n)KEEP.rose=true;
  KEEP.n=n;
  if(!KEEP.asked){ KEEP.asked=true; keepAsk(); }
  keepCheck();
 }catch(e){}}
/* once a session, never waited on. A browser with no persist is 'none'; a
   refusal, a rejection and a throw are all 'no', and none of them is an
   error the person needs to hear about. */
function keepAsk(){
 if(KEEP.persist==='yes')return;
 var sm=null; try{ sm=navigator.storage; }catch(e){}
 if(!sm||typeof sm.persist!=='function'){ KEEP.persist='none'; return; }
 KEEP.persist='asking';
 try{
  sm.persist().then(function(y){ KEEP.persist=y?'yes':'no'; keepCheck(); },
   function(){ KEEP.persist='no'; keepCheck(); });
 }catch(e){ KEEP.persist='no'; }}
/* the record is at risk and the person has written something that matters */
function keepAtRisk(){
 return (KEEP.persist==='no'||KEEP.persist==='none')&&KEEP.n>=1&&!keepSignedIn();}
/* the once line, at the save that raised the story count */
function keepCheck(){
 if(KEEP.line)return;
 if(!KEEP.rose||!keepAtRisk()||keepSaid())return;
 try{ devSet('keepSaid',Date.now()); }catch(e){}
 keepShow('save');}

/* THE LAST STEP OF THE BOOT, in ui/ui.js. From here on a write is the
   person's. What the browser already grants is read, never asked: persisted()
   shows no prompt. */
function keepBoot(){
 KEEP.n=keepStories(); KEEP.armed=true;
 try{
  var sm=navigator.storage;
  if(!sm||typeof sm.persist!=='function')KEEP.persist='none';
  else if(typeof sm.persisted==='function')
   sm.persisted().then(function(y){ if(KEEP.persist==='unknown')KEEP.persist=y?'yes':'no'; },function(){});
 }catch(e){ KEEP.persist='none'; }
 if(!KEEP.lost)return;
 /* SAID WHERE IT CAN BE SEEN, the way recordLinkSay says a linked record:
    after the boot sheet lifts, and on the door's own message line while the
    door stands, because the door covers everything behind it. The line with
    the import holds behind the door until the person comes through. */
 afterBoot(function(){
  keepShow('lost');
  if(typeof LOGIN!=='undefined'&&LOGIN.open&&typeof loginSay==='function')loginSay(KEEP_SAY_LOST,'',true);});}

/* A RESTORE LANDED, from any host of the import (recordImportWire). The loss
   is answered, so its line goes and the account area stops saying it. */
function keepLanded(){
 if(!KEEP.lost)return;
 KEEP.lost=false;
 if(KEEP.line==='lost')keepHide();}

/* THE FILE. pExport is the record as the importer reads it. A worked example
   is not the person's to save, and the refusal is the house's own line for
   that crossing. Sent is said only after the file exists and the browser has
   been handed it; anything that throws on the way says it was not made. */
function keepDay(){
 var d=new Date(), p=function(x){ return (x<10?'0':'')+x; };
 return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
function keepFile(){
 if(!CURP||PROFILES.indexOf(CURP)<0){ status('Nothing saved on a worked example.','fail'); return false; }
 var nm='atuned-record-'+keepDay()+'.json', url=null;
 try{
  var txt=pExport();
  if(!txt||txt==='null')throw new Error('empty');
  var blob=new Blob([txt],{type:'application/json'});
  if(!blob.size)throw new Error('empty');
  url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url; a.download=nm; a.style.display='none';
  document.body.appendChild(a); a.click(); a.remove();
 }catch(e){
  if(url){ try{ URL.revokeObjectURL(url); }catch(e2){} }
  status('Could not make the file. Nothing was saved.','fail');
  return false; }
 /* the address has to outlive the start of the download */
 setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} },60000);
 status('Sent to your downloads as '+nm+'.','ok');
 if(KEEP.line==='save')keepHide();
 return true;}

/* THE LINE. One at a time, fixed to the bottom on the message dock's layer
   (94), so it never covers the first run or the door. It holds until it is
   dismissed or answered. The words are a polite live region.

   AND IT STANDS IN ROOM OF ITS OWN. It first reserved nothing under itself,
   and a review measured controls at the foot of a page that could not scroll
   further sitting under it: a press there landed on the storage notice. So while it shows, the instrument stops short of it by its
   own height (--keep-h, measured, keepPlace) and nothing is ever under it.
   Which box stops short is read off the layout and never off a breakpoint:
   where .app is fixed (a wide screen) .app takes the room off its foot, and
   where .app is in the flow (a narrow one) body is the box that scrolls, so
   body takes it, and a page scrolled to its end ends above the line. The
   other things fixed to the foot, the dock, its log, the Field's tool sheet
   and the phone's tip sheet, stand on top of the room instead of under the
   line, so the line never moves and the room never jumps.

   AND IT STEPS ASIDE FOR THE CRISIS LINES WHEN THEY EXIST. They are parked
   until the MVP beta, so nothing carries the id #srcsafe today and the last
   rule below is inert. It is here so the belt is already in place the day
   they land: a z-index on their controls cannot lift them over this line,
   because .app is fixed at z-index 1 and nothing inside it climbs out. While
   #srcsafe is in the document the line is not drawn and its room goes with
   it. A storage notice is not what a person reading those lines needs to
   see. */
function keepCss(){
 if(document.getElementById('keep-css'))return;
 var st=document.createElement('style'); st.id='keep-css';
 st.textContent=[
  '.keepline{position:fixed;left:12px;right:12px;margin:0 auto;width:max-content;',
  ' max-width:min(620px,calc(100vw - 24px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:94;',
  ' display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:8px 4px 4px 16px;',
  ' border-radius:var(--r);background:var(--panel);color:var(--ink);border:1px solid var(--edge-2);',
  ' box-shadow:0 12px 32px rgba(0,0,0,.34)}',
  '.keepline[hidden]{display:none}',
  '.keep-t{flex:1 1 280px;min-width:0;margin:0;padding:4px 0;font-family:var(--sans);font-size:16px;',
  ' line-height:1.45;color:var(--ink)}',
  '.keep-a{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-left:auto}',
  '.keepline .sh-impmsg{flex:1 1 100%;margin:0 12px 6px 0}',
  '.sh-imp .keep-n{margin:0 0 10px;color:var(--ink)}',
  '.sh-imp .keep-n+.sh-act{margin:0 0 14px}',
  'html.keep-fix .app{bottom:var(--keep-h)}',
  'html.keep-flow body{height:calc(100% - var(--keep-h))}',
  'html.keep-on .msgdock,html.keep-on .msglog,html.keep-on #fbpanel.sheet,',
  'html.keep-on body.tip-sheet .tip{bottom:calc(var(--keep-h) + 4px)}',
  'html:has(#srcsafe) #keepline{display:none}'].join('\n');
 document.head.appendChild(st);}
/* the room: the line's own height, the 14 pixels it stands off the foot and
   6 more of air, plus the phone's safe area. Measured off the line as drawn,
   so a line the crisis belt has taken off the page keeps no room at all. */
function keepPlace(){
 var root=document.documentElement, l=document.getElementById('keepline'), h=0;
 if(l&&!l.hidden)h=l.getBoundingClientRect().height;
 if(!h){ root.classList.remove('keep-on','keep-fix','keep-flow'); root.style.removeProperty('--keep-h'); return; }
 var app=document.querySelector('.app'), fixed=!!app&&getComputedStyle(app).position==='fixed';
 root.style.setProperty('--keep-h','calc('+Math.ceil(h+20)+'px + env(safe-area-inset-bottom,0px))');
 root.classList.add('keep-on'); root.classList.toggle('keep-fix',fixed); root.classList.toggle('keep-flow',!fixed);}
function keepEl(){
 var el=document.getElementById('keepline'); if(el)return el;
 if(!document.body)return null;
 keepCss();
 el=document.createElement('div'); el.id='keepline'; el.className='keepline'; el.hidden=true;
 el.innerHTML='<p class="keep-t" id="keeplinet" role="status" aria-live="polite"></p>'
  +'<div class="keep-a" id="keeplinea"></div>';
 document.body.appendChild(el);
 /* the line changes height as its words wrap, as it is shown and hidden, and
    as the crisis belt takes it off the page and puts it back; the window
    changes which box takes the room */
 try{ if(typeof ResizeObserver==='function')new ResizeObserver(keepPlace).observe(el); }catch(e){}
 window.addEventListener('resize',keepPlace);
 return el;}
function keepShow(kind){
 var el=keepEl(); if(!el)return;
 var lost=(kind==='lost'), t=$('keeplinet'), a=$('keeplinea');
 KEEP.line=kind;
 /* the import's message slot rides under the words, so a refused file says
    why in the place the person just pressed */
 var old=$('kpimpmsg'); if(old)old.remove();
 a.innerHTML=(lost
   ?'<button type="button" class="btn" id="kpimpf">Choose a file</button>'
    +'<input type="file" id="kpimpfile" accept="application/json,.json" hidden>'
   :'<button type="button" class="btn" id="keepsave">Save as a file</button>')
  +'<button type="button" class="msg-b" id="keepx">Dismiss</button>';
 if(lost){ var m=document.createElement('p'); m.id='kpimpmsg'; m.className='sh-p sh-impmsg'; el.appendChild(m); }
 el.hidden=false;
 t.textContent=lost?KEEP_SAY_LOST:KEEP_SAY_SAVE;
 keepPlace();
 /* the one importer, under this line's own ids, so a restore here is the
    same boundary and the same failure words as the account area's */
 if(lost)recordImportWire('kp');
 else { var b=$('keepsave'); if(b)b.onclick=keepFile; }
 var x=$('keepx'); if(x)x.onclick=keepHide;}
function keepHide(){
 var el=document.getElementById('keepline'); if(!el)return;
 var had=el.contains(document.activeElement);
 el.hidden=true; KEEP.line=null;
 var t=$('keeplinet'), a=$('keeplinea'), m=$('kpimpmsg');
 if(t)t.textContent=''; if(a)a.innerHTML=''; if(m)m.remove();
 keepPlace();
 if(had&&document.body)document.body.focus();}

/* THE ACCOUNT AREA'S HALF, drawn inside recordImportHtml so it sits beside
   the import and just above Export and delete. p is the host's id prefix. */
function keepNoteHtml(p){
 if(KEEP.lost){ keepCss(); return '<p class="sh-p keep-n" id="'+p+'keeplost">'+esc(KEEP_SAY_LOST)+'</p>'; }
 if(!keepAtRisk())return '';
 keepCss();
 return '<p class="sh-p keep-n" id="'+p+'keepnote">'+esc(KEEP_SAY_SAVE)+'</p>'
  +'<div class="sh-act"><button class="btn" type="button" id="'+p+'keepsave">Save as a file</button></div>';}
