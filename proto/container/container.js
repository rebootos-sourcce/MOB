/* ============================================================
   THE MECHANIC. Six properties, and every one of them is an object on the
   screen rather than a mood in the copy.

     the key      opens it, and carries the prompt
     the inside   one container, nothing else on the screen
     the seal     closes it and keeps it
     empty        closes it and keeps nothing
     the seam     what leaves. the reading leaves, the words stay, and one
                  line can be lifted out by hand
     sight        who can see in. per container, never per account

   Nothing here mutates a profile. applyStory is the engine's only mutator and
   this prototype does not call it: a container that has not been sealed has
   put nothing anywhere, which is the whole point of having a lid.
   ============================================================ */
var STATE='shelf', CUR=null, TEXT='', PARSED=null, MARKS=[], FR=[], LISTEN=false;
var NEXTN=4830;                    /* the container's own number. see share() */
var TODAY='21 Sep';
var RING=null, SHUTNEXT=false, HOVER=-1;

/* the people a container can be opened to. In the product this is the
   person's own practitioner and cohort list and it is empty by default. */
var SEERS=[{id:'p-118',nm:'Ilse Coetzee-Nakamura',role:'practitioner'},
           {id:'c-204',nm:'Tuesday cohort',role:'cohort'}];

/* the shelf, seeded so the outside of the container has something to be the
   outside of. A first ever open has none of these and says so. */
var SHELF=[
 {n:4827,key:'Plain',prompt:PROMPTS[1][2],when:'18 Sep',sealed:true,shut:false,
  text:'I stayed quiet when he took the credit in front of the room. I sat in '
   +'the car for twenty minutes and my chest was tight.',
  sight:[{id:'p-118',nm:'Ilse Coetzee-Nakamura',scope:'reading',days:11}],
  log:[['18 Sep','Sealed. Four lines acknowledged, one refused.'],
       ['18 Sep','Reading opened to Ilse Coetzee-Nakamura for 14 days.']]},
 {n:4828,key:'Descent, Treachery',prompt:PROMPTS[23][2],when:'19 Sep',sealed:true,
  shut:true,
  text:'I lied to her about where the money went. I am disgusted with myself '
   +'and my chest is tight every time she asks.',
  sight:[], log:[['19 Sep','Opened shut. This container cannot be shared.'],
                 ['19 Sep','Sealed. Three lines acknowledged.']]},
 {n:4829,key:'Year, twelve',prompt:PROMPTS[33][2],when:'20 Sep',sealed:true,
  shut:false,
  text:'Marvel against DC. I held my position for twenty years and I do not '
   +'care about either of them.',
  sight:[], log:[['20 Sep','Sealed. Two lines acknowledged.'],
                 ['20 Sep','Sight revoked from Tuesday cohort.']]}];

/* ---------- the writers the product already has ---------- */
function esc(s){return String(s==null?'':s)
 .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function seatCol(b){return PAL[b]||'var(--dim)';}
function cap(s){return String(s).charAt(0).toUpperCase()+String(s).slice(1);}
var SEATSAY={'3rd Eye':'third eye','Solar':'solar plexus'};
function seatSay(bn){return SEATSAY[bn]||String(bn).toLowerCase();}
var STT=null;
function status(msg,kind){
 var el=document.getElementById('st');
 el.textContent=msg; el.className='on'+(kind==='bad'?' bad':'');
 if(STT)clearTimeout(STT);
 /* a failure holds. a confirmation clears, because a confirmation nobody
    dismissed becomes furniture. ui/component.js has the same rule. */
 if(kind!=='bad')STT=setTimeout(function(){el.className='';},2400);}

/* ---------- the four keyrings ---------- */
function keysFor(ring){
 return PROMPTS.filter(function(p){return p[1]===ring;});}
function keyName(p){
 if(p[1]==='plain')return 'Plain';
 if(p[1]==='descent')return 'Descent, '+CIRCLES[+p[0].slice(1)-1].nm;
 if(p[1]==='sin')return 'Sin, '+String(p[3]).split('.')[0];
 return 'Year, '+p[0].slice(1);}
function keyBadge(p){
 if(p[1]==='descent')return 'C'+p[0].slice(1);
 if(p[1]==='sin')return String(p[3]).split('.')[0];
 if(p[1]==='year')return 'Age '+p[0].slice(1);
 return 'Open';}

/* ============================================================
   THE MARKS. marksOf and normMap are the engine's, ported out of
   proto/story4 and exported. One reading of the sentence, on the scanner's
   own offsets. The page draws, the engine reads.
   ============================================================ */
function reparse(){
 PARSED=TEXT.trim()?parseStory(TEXT):null;
 MARKS=PARSED?marksOf(TEXT,PARSED):[];}
function hlHtml(){
 if(!MARKS.length)return esc(TEXT)+'\n';
 var out='',at=0;
 MARKS.forEach(function(m){
  out+=esc(TEXT.slice(at,m.s));
  out+='<mark class="mk" data-mk="'+m.i+'">'+esc(TEXT.slice(m.s,m.e))+'</mark>';
  at=m.e;});
 return out+esc(TEXT.slice(at))+'\n';}

/* the reflection line, from proto/story4/mirror.html, unchanged. The inferred
   boundary is printed rather than papered over: measured across the thirty
   eight prompts in prompts.js, 167 imprints came back and 19 of them were
   named by the person's own words. A renderer that prints the other 148 as
   findings is naming an address the sentence never gave it. */
function reLine(m,said){
 if(m.coh){if(said._coh)return 'Takes charge off.';
  said._coh=1; return 'Takes charge off, and it comes off every seat at once.';}
 if(!m.bn)return '<b>'+cap(esc(m.charge||'charge'))+'.</b> The charge is named '
  +'and no place is given.';
 var nmd=m.label?cap(m.label):(m.fet||(m.charge?cap(m.charge):null));
 var head='<b>'+esc(nmd||m.bn)+'.</b>';
 var tail=nmd?(' It goes to the '+esc(seatSay(m.bn))+'.'):'';
 if(said[m.bn])return head+tail;
 said[m.bn]=1;
 var im=(PARSED?PARSED.imprints:[]).filter(function(x){return x.band===m.bn;});
 if(!im.length)return head+tail;
 if(im[0].inferred)return head+tail+' The seat is read. Nothing in the '
  +'sentence named a place in it.';
 return head+tail+' It lands on '+im.slice(0,2).map(function(x){
  return '<b>'+esc(x.name)+'</b>';}).join(' and ')+'.';}
function reHtml(m,said){
 var c=m.bn?seatCol(m.bn):'var(--dim)';
 return '<div class="re'+(m.coh?' coh':'')+'" data-mk="'+m.i+'" style="--c:'+c+'">'
  +(m.bn?'<span class="rg"><svg viewBox="0 0 24 24" aria-hidden="true">'
   +(SEATGLYPH[m.bn]||SEATGLYPH._)+'</svg></span>':'<span class="rg"></span>')
  +'<span class="rt">'+reLine(m,said)+'</span></div>';}

/* ============================================================
   THE SEAL GLYPH. Three states and they are three drawings, because a lid a
   person cannot read at a glance is a lid that has to be opened to be
   understood, which is the opposite of a lid.

     open      a ring with a gap in it
     sealed    a closed ring with a bar across
     shut      a closed ring with a bar and no gap anywhere
   ============================================================ */
function sealGlyph(c){
 if(!c.sealed)return '<path d="M12 3a9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9"/>';
 if(c.shut)return '<circle cx="12" cy="12" r="9"/><path d="M7 12h10M12 7v10"/>';
 return '<circle cx="12" cy="12" r="9"/><path d="M6 12h12"/>';}
function sealCol(c){
 if(!c.sealed)return 'var(--dim)';
 return c.shut?'var(--accent)':'var(--mid)';}

/* ============================================================
   THE LID. The same object outside and inside. Outside it is the row you
   press to open, inside it is the strip along the top, and either way it
   carries the key, the seal and the sight in one place.
   ============================================================ */
function lidHtml(c,strip){
 var sight=c.sight.length;
 var el=strip?'div':'button';
 var h='<'+el+' class="lid'+(strip?' strip':'')+'"'
  +(strip?'':' type="button" data-open="'+c.n+'"')+' style="--c:'+sealCol(c)+'">'
  +'<span class="lid-seal"><svg viewBox="0 0 24 24" aria-hidden="true">'
   +sealGlyph(c)+'</svg></span>'
  +'<span class="lid-nm"><span class="lid-k">'+esc(c.key)+'</span>'
  +'<span class="lid-sub">'+(c.sealed?'Sealed '+esc(c.when):'Open')
   +' <span class="num">no '+c.n+'</span></span></span>'
  +'<span class="lid-sp"></span>';
 if(c.shut)h+='<span class="tag shut">Shut</span>';
 h+=sight?'<span class="tag sight">Sight, '+sight+'</span>'
         :'<span class="tag">No sight</span>';
 return h+'</'+el+'>';}

/* ============================================================
   OUTSIDE. The shelf, and the keyring above it.

   A lid shows the key, the date, the seal and the sight. It does not show one
   word of the writing, and that is the outside of the container doing its
   job: the words are inside, and being outside means not seeing them.

   THE RING DEALS ONE KEY, IT DOES NOT LIST THEM. The first cut printed every
   prompt in the ring, which measured 23 simultaneous choices on the shelf at
   1600 against a working memory of about four and a standing target of twelve.
   Fifteen questions about your own failures laid out in a column is a screen
   somebody closes. One question, and a control to deal another, is ten
   choices and is how a question actually gets answered. The whole list is one
   press away and the press is labelled, because a control with no affordance
   is the same as no control.
   ============================================================ */
var DEALT={}, SEEALL=false;
function deal(ring,step){
 var keys=keysFor(ring);
 if(DEALT[ring]===undefined)DEALT[ring]=0;
 else DEALT[ring]=(DEALT[ring]+(step||0)+keys.length)%keys.length;
 return keys[DEALT[ring]];}
function paintShelf(){
 var h='<div class="col"><div class="eyeline"><span class="eye">Open a container</span></div>'
  +'<div class="keyring">'
  +[['plain','Plain'],['descent','Descent'],['sin','Sin'],['year','Year']]
    .map(function(r){return '<button type="button" class="kr'
     +(RING===r[0]?' on':'')+'" data-ring="'+r[0]+'">'+r[1]+'</button>';}).join('')
  +'</div>';
 if(!RING)h+='<p class="note" style="margin:0 0 22px">Four ways in. Three of '
  +'them are angles. Press one and it deals you a question.</p>';
 else{
  var p=deal(RING,0), keys=keysFor(RING);
  h+='<p class="note" style="margin:0 0 14px">'+ringNote(RING)+'</p>';
  if(SEEALL){
   h+='<div class="keys">'+keys.map(function(k){
    return '<button type="button" class="key" data-key="'+k[0]
     +'"><span class="kb">'+esc(keyBadge(k))+'</span><span>'+esc(k[2])
     +'</span></button>';}).join('')+'</div>'
    +'<div class="ak-btns" style="margin-bottom:22px">'
    +'<button class="btn" id="fewer" type="button">Back to one</button></div>';}
  else{
   h+='<div class="dealt"><span class="pk">'+esc(keyBadge(p))+'</span>'
    +'<p class="dq">'+esc(p[2])+'</p>'
    +'<div class="ak-btns">'
    +'<button class="btn pri" type="button" data-key="'+p[0]+'">Open it</button>'
    +'<button class="btn" id="another" type="button">Another one</button>'
    +'<button class="btn" id="seeall" type="button">See all '+keys.length
    +'</button></div></div>';}
  h+='<div class="shut-set"><button type="button" id="shutnext" class="tgl'
   +(SHUTNEXT?' on':'')+'" aria-pressed="'+(SHUTNEXT?'true':'false')+'">'
   +'<span class="tgl-b"></span>Open it shut</button>'
   +'<span class="note" style="margin:0">A container opened shut carries no '
   +'share control, ever. It is set here, before the writing.</span></div>';}
 h+='<div class="eyeline"><span class="eye">Shelf</span>'
  +'<span class="num">'+SHELF.length+' sealed</span></div>';
 if(!SHELF.length)h+='<div class="empty">Nothing is on the shelf. A container '
  +'lands here once you seal it.</div>';
 else h+='<div class="shelf">'+SHELF.slice().reverse().map(function(c){
  return lidHtml(c,false);}).join('')+'</div>';
 document.getElementById('wrap').innerHTML=h+'</div>';
 wireShelf();}
function ringNote(r){
 if(r==='descent')return 'Nine circles, off the table the engine already '
  +'carries. The Compass shows you which one it reads. This asks you the same '
  +'question in the first person.';
 if(r==='sin')return 'Seven, asked as acts. A circle asks what you are in. A '
  +'sin asks what you did.';
 if(r==='year')return 'One year at a time. Three to eighteen are his own '
  +'questions. Past eighteen the years come in fives, off your own age.';
 return 'No angle. For a day you already know the shape of.';}
function wireShelf(){
 document.querySelectorAll('[data-ring]').forEach(function(el){
  el.onclick=function(){
   RING=(RING===el.dataset.ring)?null:el.dataset.ring;
   SEEALL=false; paintShelf();};});
 document.querySelectorAll('[data-key]').forEach(function(el){
  el.onclick=function(){openWith(el.dataset.key);};});
 document.querySelectorAll('[data-open]').forEach(function(el){
  el.onclick=function(){readSealed(+el.dataset.open);};});
 var a=document.getElementById('another');
 if(a)a.onclick=function(){deal(RING,1);paintShelf();};
 var sa=document.getElementById('seeall');
 if(sa)sa.onclick=function(){SEEALL=true;paintShelf();};
 var fw=document.getElementById('fewer');
 if(fw)fw.onclick=function(){SEEALL=false;paintShelf();};
 var s=document.getElementById('shutnext');
 if(s)s.onclick=function(){SHUTNEXT=!SHUTNEXT;
  status(SHUTNEXT?'The next container opens shut. It will carry no share '
   +'control.':'The next container opens shareable.');
  paintShelf();};}

/* ============================================================
   THE OPEN. A key mints a container and nothing else. No text, no reading, no
   charge, and no row anywhere else in the product: a container that has not
   been sealed has put nothing anywhere.
   ============================================================ */
function openWith(id){
 var p=null,i;
 for(i=0;i<PROMPTS.length;i++)if(PROMPTS[i][0]===id)p=PROMPTS[i];
 if(!p){status('That key is not on the ring.','bad');return;}
 CUR={n:NEXTN++,key:keyName(p),prompt:p[2],when:TODAY,sealed:false,
  shut:SHUTNEXT,text:'',sight:[],
  log:[[TODAY,SHUTNEXT?'Opened shut. This container cannot be shared.'
       :'Opened.']],ack:{},lifted:{}};
 TEXT=''; reparse(); STATE='open'; paint();
 status(SHUTNEXT?'Open, and shut. Nothing leaves this one but the reading.'
                :'Open.');}

/* ============================================================
   INSIDE. One container. The prompt above the field, the writing at full
   weight, the sniffer in the margin.

   His, and it is the best short account of the instrument anyone has written
   for it: "you may not see yourself within the story, especially when you
   start out, but this thing is sniffing all the patterns that are driving
   your psyche." It goes on the empty margin, where it is true, and nowhere
   else.
   ============================================================ */
function paintOpen(){
 var c=CUR;
 var h=lidHtml(c,true)
  +'<div class="ins" id="ins"><div>'
  +'<p class="prompt">'+esc(c.prompt)+'</p>'
  +'<div class="jr'+(LISTEN?' live':'')+'" id="jr">'
  +'<div class="jr-live"><span class="jr-lamp"></span>Listening</div>'
  +'<div class="jr-ed"><div class="jr-hl" id="hl" aria-hidden="true"></div>'
  +'<textarea id="ta" class="jr-ta" spellcheck="false" aria-label="Your story"'
  +' placeholder="What happened. In your own words."></textarea></div>'
  +'<button class="jr-rec" id="rec" type="button" aria-pressed="'+(LISTEN?'true':'false')+'"'
  +' title="Record what happened out loud."><svg viewBox="0 0 24 24" aria-hidden="true">'
  +'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'
  +'</svg></button></div>'
  +'<div class="foot">'
  /* AND NEITHER CLOSE IS OFFERED ON AN EMPTY CONTAINER. There is nothing to
     empty and nothing to seal, and a loud red control that cannot do anything
     is the first thing the eye lands on when the box is blank. */
  +'<button class="btn warn" id="empty" type="button"'+(TEXT.trim()?'':' disabled')
  +'>Empty it</button>'
  +'<span class="sp"></span>'
  +'<button class="btn" id="back" type="button">Leave it open</button>'
  +'<button class="btn pri" id="seal" type="button"'+(TEXT.trim()?'':' disabled')
  +'>Seal it</button></div>'
  +'<p class="note" style="margin-top:11px">Nothing has landed yet. Sealing is '
  +'what lands it, and sealing goes through what the sniffer read.</p>'
  +'</div><div><div class="align" id="align"></div></div>'
  +'<svg id="lead" aria-hidden="true"></svg></div>';
 document.getElementById('wrap').innerHTML=h;
 var ta=document.getElementById('ta');
 ta.value=TEXT;
 ta.oninput=function(){TEXT=ta.value;reparse();paintInk();};
 ta.onscroll=function(){document.getElementById('hl').scrollTop=ta.scrollTop;};
 document.getElementById('rec').onclick=function(){
  LISTEN=!LISTEN;
  document.getElementById('jr').classList.toggle('live',LISTEN);
  this.setAttribute('aria-pressed',LISTEN?'true':'false');
  status(LISTEN?'Listening. Audio goes to the speech service in your browser.'
               :'Stopped.');};
 document.getElementById('back').onclick=function(){
  STATE='shelf';status('Left open. It is not on the shelf until it is sealed.');
  paint();};
 document.getElementById('seal').onclick=function(){
  if(!MARKS.length){status('The sniffer read nothing in this yet, so there is '
   +'nothing to acknowledge.','bad');return;}
  STATE='ack';paint();};
 document.getElementById('empty').onclick=emptyIt;
 paintInk();}

var EMPTY_ARMED=false;
/* EMPTYING IS THE OTHER CLOSE AND IT IS TWO STEPS. Undo cannot reach it,
   because the words being gone is the point rather than a side effect, so the
   error is prevented at the control instead of apologised for afterwards. */
function emptyIt(){
 var b=document.getElementById('empty');
 if(!EMPTY_ARMED){EMPTY_ARMED=true;
  b.textContent='Empty it. The words go.';
  status('Press again to empty it. Nothing is kept and nothing lands.');
  return;}
 EMPTY_ARMED=false; CUR=null; TEXT=''; reparse(); STATE='shelf';
 status('Emptied. Nothing was kept and nothing landed.'); paint();}

function paintInk(){
 var t0=performance.now();
 document.getElementById('hl').innerHTML=hlHtml();
 var s=document.getElementById('seal'); if(s)s.disabled=!TEXT.trim();
 var e=document.getElementById('empty');
 if(e&&!EMPTY_ARMED)e.disabled=!TEXT.trim();
 paintRefl(); FR.push(performance.now()-t0); if(FR.length>400)FR.shift();}

function paintRefl(){
 var align=document.getElementById('align'); if(!align)return;
 var narrow=window.matchMedia('(max-width:980px)').matches;
 if(!MARKS.length){
  align.innerHTML='<div class="re-empty"><b>The sniffer.</b> You may not see '
   +'yourself in the story. This reads the patterns driving it, and writes '
   +'what it reads here, beside the line it came from.</div>';
  align.style.height=''; drawLeads(null); return;}
 var said={},h='';
 MARKS.forEach(function(m){h+=reHtml(m,said);});
 align.innerHTML=h;
 var els=[].slice.call(align.querySelectorAll('.re'));
 if(narrow){els.forEach(function(e){e.classList.add('flowed');});
  align.style.height=''; drawLeads(null); return;}
 var hl=document.getElementById('hl'), ar=align.getBoundingClientRect(), mk={};
 Array.prototype.forEach.call(hl.querySelectorAll('mark[data-mk]'),
  function(el){mk[el.dataset.mk]=el;});
 var bottom=0;
 els.forEach(function(e){
  var el=mk[e.dataset.mk], r=el?el.getBoundingClientRect():null;
  var want=r?(r.top-ar.top+r.height/2-e.offsetHeight/2):(bottom+8);
  if(want<bottom+8)want=bottom+8;
  if(want<0)want=0;
  e.style.top=want.toFixed(1)+'px';
  bottom=want+e.offsetHeight;});
 align.style.height=(bottom+18)+'px';
 drawLeads(mk);}

function drawLeads(mk){
 var svg=document.getElementById('lead'), ins=document.getElementById('ins');
 if(!svg||!ins)return;
 var mr=ins.getBoundingClientRect();
 svg.setAttribute('width',mr.width); svg.setAttribute('height',mr.height);
 svg.setAttribute('viewBox','0 0 '+mr.width+' '+mr.height);
 if(!mk){svg.innerHTML='';return;}
 var align=document.getElementById('align');
 var jr=document.getElementById('jr').getBoundingClientRect();
 var gx=jr.right-mr.left+24, g='';
 Array.prototype.forEach.call(align.querySelectorAll('.re'),function(e){
  var i=+e.dataset.mk, el=mk[i], m=MARKS[i];
  if(!el||!m)return;
  var r=el.getBoundingClientRect(), er=e.getBoundingClientRect();
  if(r.width<=0||r.height<=0)return;
  var x1=Math.min(r.right-mr.left+2,jr.right-mr.left-10);
  var y1=r.top-mr.top+r.height/2;
  var x2=er.left-mr.left-2, y2=er.top-mr.top+Math.min(er.height/2,17);
  var c=m.bn?seatCol(m.bn):'var(--dim)';
  g+='<path d="M'+x1.toFixed(1)+' '+y1.toFixed(1)+' L'+gx.toFixed(1)+' '+y1.toFixed(1)
   +' L'+(gx+18).toFixed(1)+' '+y2.toFixed(1)+' L'+x2.toFixed(1)+' '+y2.toFixed(1)
   +'" fill="none" stroke="'+c+'" stroke-width="1" opacity=".48"/>'
   +'<circle cx="'+x1.toFixed(1)+'" cy="'+y1.toFixed(1)+'" r="2" fill="'+c+'"/>';});
 svg.innerHTML=g;}

/* ============================================================
   THE ACKNOWLEDGEMENT. CN5, and it is the step he named that nothing in the
   product has: "and even then I had to acknowledge the answers."

   One card a line. Two doors. A line nobody claims does not land, and the
   refusal is kept on the container, because the count of what a person
   refuses is the sniffer's own accuracy on that person and it belongs to
   them.

   WHAT A CARD IS ALLOWED TO SAY. Measured against the thirty eight prompts in
   prompts.js: 167 imprints, 19 named by the person's own words and 148
   chosen by the fallback. So a card names the word, the seat and the fetter,
   which the sentence gave, and names an address only when parseStory says the
   sentence named it. Asking somebody to acknowledge Martyrdom on a
   bereavement is how the worst readings in this instrument were produced.
   ============================================================ */
/* A CARD NAMES AN ADDRESS ONLY WHEN THIS LINE IS WHAT NAMED IT, AND THAT IS
   NARROWER THAN THE ENGINE'S OWN FLAG.

   parseStory marks an imprint inferred per band, not per word. So one word
   naming a fetter makes the whole band named, and the next word at that seat
   inherits it. Measured on the worked story here: "angry" names Anger at the
   solar plexus, and "ashamed" then came back as Shame landing on Pride,
   because Pride is what Anger resolved to. That is the instrument putting a
   word in somebody's mouth on the one screen whose entire job is asking
   whether the word is theirs.

   So a card asks the narrower question. The address is printed only when this
   line carries the fetter the imprint was filed under. Otherwise the card
   says what it actually knows, which is a seat and a weight, and asks about
   that. The band keeps whatever parseStory ruled: this changes what is said,
   not what is computed. */
function ackRows(){
 return MARKS.map(function(m){
  var im=(PARSED?PARSED.imprints:[]).filter(function(x){return x.band===m.bn;});
  var mine=m.fet||(m.charge?CHG2FET[m.charge]:null);
  var hit=null,i;
  if(mine)for(i=0;i<im.length;i++)if(im[i].fetter===mine&&!im[i].inferred)hit=im[i];
  return {i:m.i, word:TEXT.slice(m.s,m.e), bn:m.bn, coh:m.coh,
   read:m.label?cap(m.label):(m.fet||(m.charge?cap(m.charge):null)),
   named:!!hit, addr:hit?hit.name:null,
   amt:(m.amt==null?null:Math.abs(m.amt))};});}
function paintAck(){
 var rows=ackRows(), c=CUR;
 var h=lidHtml(c,true)+'<div class="ack">'
  +'<div class="eyeline"><span class="eye">Acknowledge</span>'
  +'<span class="num">'+rows.length+' lines</span></div>'
  +'<p class="note" style="margin:0 0 18px">The sniffer read these out of what '
  +'you wrote. What you claim lands on the body. What you refuse does not, and '
  +'the refusal stays on this container.</p>';
 rows.forEach(function(r){
  var st=c.ack[r.i];
  var col=r.bn?seatCol(r.bn):'var(--dim)';
  h+='<div class="ak'+(st==='mine'?' mine':'')+(st==='no'?' no':'')
   +'" style="--c:'+col+'">'
   +'<p class="ak-q">You wrote <i>'+esc(r.word)+'</i>.</p>'
   +'<p class="ak-r">'+ackRead(r)+'</p>'
   +'<div class="ak-btns">'
   +'<button class="btn'+(st==='mine'?' pri':'')+'" type="button" data-ack="'+r.i
    +'" data-v="mine">Mine</button>'
   +'<button class="btn'+(st==='no'?' pri':'')+'" type="button" data-ack="'+r.i
    +'" data-v="no">Not mine</button>'
   +(st==='mine'?'<button class="btn" type="button" data-lift="'+r.i+'">'
     +(c.lifted[r.i]?'Lifted into the ritual':'Lift into the ritual')+'</button>':'')
   +'</div></div>';});
 var mine=rows.filter(function(r){return c.ack[r.i]==='mine';}).length;
 var no=rows.filter(function(r){return c.ack[r.i]==='no';}).length;
 var left=rows.length-mine-no;
 h+='<div class="ak-sum"><span class="num">'+mine+' mine, '+no+' not mine'
  +(left?', '+left+' unanswered':'')+'</span><span class="lid-sp"></span>'
  +'<button class="btn" id="backopen" type="button">Back to the writing</button>'
  +'<button class="btn pri" id="doseal" type="button"'+(left?' disabled':'')
  +'>Seal it</button></div></div>';
 document.getElementById('wrap').innerHTML=h;
 document.querySelectorAll('[data-ack]').forEach(function(el){
  el.onclick=function(){CUR.ack[+el.dataset.ack]=el.dataset.v;paint();};});
 document.querySelectorAll('[data-lift]').forEach(function(el){
  el.onclick=function(){var i=+el.dataset.lift;
   CUR.lifted[i]=!CUR.lifted[i];
   status(CUR.lifted[i]?'Lifted. That line is in the ritual and it is the only '
    +'one of your words that left this container.':'Put back.');paint();};});
 document.getElementById('backopen').onclick=function(){STATE='open';paint();};
 var d=document.getElementById('doseal');
 if(d)d.onclick=sealIt;}
function ackRead(r){
 if(r.coh)return 'It takes charge off, and it comes off every seat at once.';
 if(!r.bn)return 'It names <b>'+esc(r.read||'a charge')+'</b> and gives no place.';
 /* AND IT DOES NOT SAY THE SEAT TWICE. Where the scanner placed a word and
    named nothing, read falls back to the band, and the first cut printed "It
    reads as Throat and goes to the throat." */
 var s=(r.read&&r.read!==r.bn)
  ?('It reads as <b>'+esc(r.read)+'</b> and goes to the '+esc(seatSay(r.bn))+'.')
  :('It goes to the '+esc(seatSay(r.bn))+'.');
 /* NO WEIGHT ON THIS CARD. The scanner's amount runs to twenty eight and the
    charge a person reads anywhere else in this product runs to ten, so a card
    printing 16.0 is printing a number against a denominator nobody has. The
    weight is summed and normalised on the sealed reading, on parseStory's own
    rule, where it is one number with a scale behind it. */
 /* AND IT DOES NOT SAY THE NAME TWICE EITHER. Eleven of the 112 addresses
    carry the name of the fetter they sit under, so "It reads as Anger and goes
    to the solar plexus. It lands on Anger." is one fact stuttered. */
 if(r.named&&r.addr!==r.read)s+=' It lands on <b>'+esc(r.addr)+'</b>.';
 /* and where the sentence has already said the seat and nothing else, the
    second sentence about the seat is the first one again. */
 else if(!r.named)s+=(r.read&&r.read!==r.bn)
  ?' The seat is read. Nothing in this line named a place in it.'
  :' Nothing in this line named a place in it.';
 return s;}

/* ============================================================
   THE SEAL. The close that keeps. Charge lands for the lines claimed and for
   no others, the container goes on the shelf, and the words stop being live
   text and become the inside of a closed thing.
   ============================================================ */
function sealIt(){
 var rows=ackRows();
 var mine=rows.filter(function(r){return CUR.ack[r.i]==='mine';});
 var no=rows.length-mine.length;
 CUR.sealed=true; CUR.text=TEXT; CUR.marks=rows; CUR.mine=mine.length;
 CUR.refused=no;
 CUR.log.push([TODAY,'Sealed. '+mine.length+' lines acknowledged'
  +(no?', '+no+' refused':'')+'.']);
 SHELF.push(CUR);
 STATE='sealed';
 status('Sealed. The reading landed. The words stayed in.');
 paint();}
function readSealed(n){
 var c=null,i; for(i=0;i<SHELF.length;i++)if(SHELF[i].n===n)c=SHELF[i];
 if(!c){status('That container is not on the shelf.','bad');return;}
 CUR=c; TEXT=c.text; reparse(); STATE='sealed'; paint();}

/* ============================================================
   THE SEAM. What leaves a sealed container and what does not.

     the reading leaves   seats, fetters, weights and the route. it lands on
                          the body, the field and the summary.
     the words stay       no surface outside this container prints a sentence
                          a person wrote. the standing ruling that the record
                          and the story are never held joined, made into a
                          mechanic instead of a promise.
     one line can be      lifted by hand, one at a time, in the
     lifted               acknowledgement. that is the only route a person's
                          own words take out, and it is a deliberate act per
                          line rather than a setting.
   ============================================================ */
function paintSealed(){
 var c=CUR;
 var rows=c.marks||ackRows();
 var kept=rows.filter(function(r){return c.ack?c.ack[r.i]==='mine':true;});
 var h=lidHtml(c,true)
  +'<div class="eyeline"><span class="eye">Sealed</span>'
  +'<button class="btn" id="toshelf" type="button">Back to the shelf</button></div>'
  +'<div class="seam"><div class="sm"><h4>The reading</h4>'
  +'<div class="sub">This left. It is on the body, the field and the summary.</div>';
 if(!kept.length)h+='<p>Nothing was acknowledged, so nothing landed.</p>';
 else{
  /* PARSESTORY'S OWN RULE, NOT A SECOND ONE. It normalises a band total with
     Math.min(10, total/3), which is what puts a charge on the nought to ten
     scale every other surface in this product reads. Summing the scanner's raw
     amounts here would have printed a second, larger number for the same
     reading. */
  var byBand={};
  kept.forEach(function(r){if(!r.bn||r.coh)return;
   byBand[r.bn]=(byBand[r.bn]||0)+(r.amt||0);});
  Object.keys(byBand).forEach(function(b){
   byBand[b]=Math.round(Math.min(10,byBand[b]/3)*10)/10;});
  var ks=Object.keys(byBand);
  if(!ks.length)h+='<p>Every line you kept takes charge off. Nothing landed '
   +'on a seat.</p>';
  ks.forEach(function(b){
   h+='<div class="rd" style="--c:'+seatCol(b)+'"><span class="dot"></span>'
    +esc(b)+'<span class="sp"></span><span class="v">'
    +byBand[b].toFixed(1)+'</span></div>';});
  if(PARSED&&PARSED.path&&PARSED.path.dwell)
   h+='<p style="margin-top:12px">The route runs '
    +esc(seatSay(K2BAND[PARSED.path.start]))+' to '
    +esc(seatSay(K2BAND[PARSED.path.end]))+', and it dwells at the '
    +esc(seatSay(K2BAND[PARSED.path.dwell]))+'.</p>';
  if(c.refused)h+='<p>'+c.refused+' line'+(c.refused>1?'s':'')
   +' you refused. Nothing from '+(c.refused>1?'them':'it')+' landed.</p>';}
 h+='</div><div class="sm locked"><h4>The words</h4>'
  +'<div class="sub">These stayed. Nowhere else in the product prints them.</div>'
  +'<div class="quoted">'+esc(c.text)+'</div>'
  +'<p style="margin-top:12px">One line can be lifted out by hand, in the '
  +'acknowledgement, and it goes into the ritual. That is the only route your '
  +'own words take out of here.</p></div></div>';
 h+=sightHtml(c);
 document.getElementById('wrap').innerHTML=h;
 document.getElementById('toshelf').onclick=function(){
  STATE='shelf';CUR=null;paint();};
 wireSight(c);}

/* ============================================================
   SIGHT. CN3, his words: "That container can be shared with a practitioner.
   So there is a connection between the container, the cohort, and the
   practitioner. Your unique number gets paired up with the friends."

   So the unit is the container and never the account, and that settles a
   question the practitioner work had open. Six properties, and four of them
   are how it refuses.

     scope       two rungs and they are two grants. the reading, which is
                 seats and weights and the route, and the words, which is a
                 second press with its own consent line.
     the clock   every grant expires. fourteen days by default, and the lid
                 counts it down.
     the number  a container travels as a number. the name never leaves the
                 device, so what a practitioner is handed is no 4831 and a
                 scope, which is exactly what he said.
     shut        set at open, before the writing, when nobody is asking. a
                 container opened shut has no share control at all. absent,
                 not disabled, with the state on the lid so it still has an
                 affordance.
     one at a    there is no share all and no share my journal. a person being
     time        pressured has to be pressured once for every container.
     the ledger  every grant, expiry and revoke is a dated line on the lid.
                 nothing about sight happens quietly.
   ============================================================ */
var GRANTING=false, G_WORDS=false;
function sightHtml(c){
 var h='<div class="sbox"><div class="eyeline"><span class="eye">Sight</span>'
  +'<span class="num">no '+c.n+'</span></div>';
 if(c.shut){
  h+='<p class="note" style="margin:0">This container was opened shut. It '
   +'cannot be shared, and that was decided before the writing.</p>';
  return h+ledgerHtml(c)+'</div>';}
 if(!c.sight.length)h+='<div class="empty">Nobody can see in.</div>';
 else c.sight.forEach(function(s){
  h+='<div class="sg-row"><span class="sg-nm">'+esc(s.nm)
   +'<em>'+(s.scope==='words'?'The reading and the words':'The reading')
   +'. '+s.days+' days left.</em></span>'
   +'<button class="btn" type="button" data-rev="'+esc(s.id)+'">Close it</button>'
   +'</div>';});
 if(GRANTING){
  h+='<div class="grant"><div class="row">'
   +'<label class="eye" for="gwho">Open to</label>'
   +'<select id="gwho">'+SEERS.filter(function(p){
     return !c.sight.some(function(s){return s.id===p.id;});})
    .map(function(p){return '<option value="'+esc(p.id)+'">'+esc(p.nm)
     +', '+esc(p.role)+'</option>';}).join('')+'</select>'
   +'<label class="eye" for="gdays">For</label>'
   +'<input id="gdays" type="number" min="1" max="90" value="14" '
   +'inputmode="numeric" aria-label="Days"> <span class="eye">days</span></div>'
   +'<div class="consent"><button type="button" id="gwords" class="tgl'
   +(G_WORDS?' on':'')+'" aria-pressed="'+(G_WORDS?'true':'false')+'">'
   +'<span class="tgl-b"></span>Words too</button>'
   +'<span>The reading is seats, weights and the route. The words are the '
   +'sentences you wrote. Two grants, and this is the second one.</span></div>'
   +'<p class="note" style="margin:0 0 14px">They are handed container no '
   +c.n+' and nothing else. Your name stays on this device.</p>'
   +'<div class="ak-btns"><button class="btn" id="gcancel" type="button">Cancel'
   +'</button><button class="btn pri" id="gdo" type="button">Open it</button>'
   +'</div></div>';}
 else h+='<div style="margin-top:12px"><button class="btn" id="gopen" '
  +'type="button">Open this one to somebody</button></div>';
 return h+ledgerHtml(c)+'</div>';}
function ledgerHtml(c){
 return '<div class="ledger"><div class="eye" style="margin-bottom:8px">Ledger'
  +'</div>'+c.log.map(function(r){
   return '<div class="lg"><span class="d">'+esc(r[0])+'</span><span>'
    +esc(r[1])+'</span></div>';}).join('')+'</div>';}
function wireSight(c){
 var o=document.getElementById('gopen');
 if(o)o.onclick=function(){GRANTING=true;G_WORDS=false;paint();};
 var x=document.getElementById('gcancel');
 if(x)x.onclick=function(){GRANTING=false;paint();};
 var w=document.getElementById('gwords');
 if(w)w.onclick=function(){G_WORDS=!G_WORDS;paint();};
 var d=document.getElementById('gdo');
 if(d)d.onclick=function(){
  var id=document.getElementById('gwho').value;
  var days=+document.getElementById('gdays').value||14;
  var who=null,i; for(i=0;i<SEERS.length;i++)if(SEERS[i].id===id)who=SEERS[i];
  if(!who){status('Nobody is selected, so nothing was opened.','bad');return;}
  var scope=G_WORDS?'words':'reading';
  c.sight.push({id:who.id,nm:who.nm,scope:scope,days:days});
  c.log.push([TODAY,(scope==='words'?'Reading and words':'Reading')
   +' opened to '+who.nm+' for '+days+' days.']);
  GRANTING=false;
  status('Open to '+who.nm+' for '+days+' days. They have container no '+c.n
   +'. Your name did not go with it.');
  paint();};
 document.querySelectorAll('[data-rev]').forEach(function(el){
  el.onclick=function(){
   var id=el.dataset.rev, who=null;
   c.sight=c.sight.filter(function(s){
    if(s.id===id){who=s.nm;return false;} return true;});
   c.log.push([TODAY,'Sight closed for '+who+'.']);
   status('Closed. '+who+' cannot see this container any more.');
   paint();};});}

/* ---------- the prototype's own chrome, and the paint loop ---------- */
function loadWho(nm){
 var p=null,i;
 for(i=0;i<PEOPLE.length;i++)if(PEOPLE[i].nm===nm)p=PEOPLE[i];
 if(!p)return;
 S.dom=p.dom; S.a1=p.a1; S.a2=p.a2; S.doms=[p.dom]; S.arcs=[p.a1,p.a2]; S.roots=[];
 buildSoul();
 CHARGES.forEach(function(c){
  S.charge[c]=(p.c&&p.c[c]!==undefined)?p.c[c]:0;
  S.replace[c]=(p.rep&&p.rep[c])||0;});
 paint();}
function paint(){
 if(STATE==='open')paintOpen();
 else if(STATE==='ack')paintAck();
 else if(STATE==='sealed')paintSealed();
 else paintShelf();
 var n=document.getElementById('pnote');
 if(n)n.textContent=SHELF.length+' sealed. '
  +SHELF.filter(function(c){return c.sight.length;}).length+' with sight open. '
  +SHELF.filter(function(c){return c.shut;}).length+' shut.';}

(function boot(){
 var sel=document.getElementById('who');
 sel.innerHTML=PEOPLE.slice(0,6).map(function(p){
  return '<option>'+p.nm+'</option>';}).join('');
 sel.value='Derek';
 sel.onchange=function(){loadWho(sel.value);};
 document.getElementById('fill').onclick=function(){
  if(STATE!=='open'){status('Open a container first. There is nowhere to put '
   +'a story until one is open.','bad');return;}
  TEXT='I said yes to the board again and my jaw was tight the whole call. I '
   +'stayed quiet when he took the credit. Afterwards I sat in the car for '
   +'twenty minutes before I could drive. I am angry at myself for not saying '
   +'what I actually thought, and ashamed that I care this much what they '
   +'think of me. I slept well though.';
  reparse(); paint();};
 loadWho('Derek');
 window.addEventListener('resize',function(){if(STATE==='open')paintRefl();});
})();
