/* ============================================================
   THE ARCHETYPE PICKER, ON THE AVATAR PAGE. Round GV in TASKS.md.
   A PROTOTYPE. Shared by the merge page and the four variations.

   Three rulings from the owner, 27 September, carried here once so that all
   five pages say them the same way:

   1. The commit word is warmer than "This is me". The default is "Rings
      true". The prototype bar switches it, so the word is judged on the page
      and not in a report.
   2. Every archetype is described in two parts, never one. First what the
      pattern does, said neutrally. Then, underneath and separately, Impact:
      the primary saboteur, named plainly, with one line of what taking that
      role on costs. A person reads what they do before what it is called.
   3. One press saves. The same press takes it off. There is no Save button.

   Data. ARCH (twelve, with icon, verb and seat) is read out of
   proto/fw/data.json, which proto/fw/extract.js read off the committed build.
   ARCH18 (eighteen, each with its primary saboteur and that saboteur's seat)
   is read out of atuned_src/engine/data/canon.js. AFF is each reference
   person's archetype affinity, computed by the committed engine.js at build
   time. None of it is typed in here. The six drafts' icons and verbs are
   carried over from proto/intake/lib.js and stay marked as drafts.
   ============================================================ */
var AR=(function(){
'use strict';

/* ---------------- the seven seats and the avatar's seven areas ----------------
   The areas and their angles are proto/avatar/redesign-GG.html's own, so a
   satellite sits where it sits on that page. */
var SEATS=['crown','eye','throat','heart','solar','sacral','root'];
var B2S={'Crown':'crown','3rd Eye':'eye','Throat':'throat','Heart':'heart','Solar':'solar','Sacral':'sacral','Root':'root'};
var THE={root:'the root',sacral:'the sacral',solar:'the solar plexus',heart:'the heart',throat:'the throat',eye:'the third eye',crown:'the crown'};
var AREAS=[
 {k:'meaning', seat:'crown',  nm:'Meaning',  about:'purpose, faith, what it is for', a:-90},
 {k:'clarity', seat:'eye',    nm:'Clarity',  about:'seeing straight, deciding',      a:-38.57},
 {k:'voice',   seat:'throat', nm:'Voice',    about:'saying it, being heard',         a:-141.43},
 {k:'love',    seat:'heart',  nm:'Love',     about:'partner, family, closeness',     a:12.86},
 {k:'drive',   seat:'solar',  nm:'Drive',    about:'work, will, pressure',           a:167.14},
 {k:'pleasure',seat:'sacral', nm:'Pleasure', about:'desire, play, making things',    a:64.29},
 {k:'ground',  seat:'root',   nm:'Ground',   about:'body, money, home, rest',        a:115.71}];
var AK={}, SA={}; AREAS.forEach(function(x){AK[x.k]=x; SA[x.seat]=x;});

var IC={
 ground:'<path d="M4 11.5L12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/><path d="M10.5 19v-4.5h3V19"/>',
 pleasure:'<path d="M3 9.5c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/><path d="M3 15c2-2.6 4-2.6 6 0s4 2.6 6 0 4-2.6 6 0"/>',
 drive:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
 love:'<path d="M12 19.5s-7.5-4.4-7.5-9.7A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.2c0 5.3-7.5 9.7-7.5 9.7z"/>',
 voice:'<path d="M4.5 5.5h15v10h-9l-4.5 3.5v-3.5h-1.5z"/><path d="M8.5 10.5h7"/>',
 clarity:'<path d="M2.5 12s3.6-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.6 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 meaning:'<path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z"/>',
 person:'<circle cx="12" cy="7" r="3.4"/><path d="M4.5 21c0-4.6 3.4-7.8 7.5-7.8s7.5 3.2 7.5 7.8"/>',
 mark:'<circle cx="12" cy="12" r="8.5"/><path d="M12 5.5v13M5.5 12h13"/>',
 ring:'<circle cx="12" cy="12" r="8.5"/><path class="ck" d="M8 12.3l2.7 2.7L16.2 9.5"/>'};
function svg(k,cls){return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+IC[k]+'</svg>';}

/* ---------------- the roster of eighteen ----------------
   The same join proto/intake/lib.js makes: the twelve keep ARCH's seat, the
   six take ARCH18's third column. ARCH18 calls the Rebel the Outlaw; one row,
   two names, and the owner has not ruled which. */
var DRAFT6={
 Orphan:{v:'counts on nobody',ic:'M9 7m-3 0a3 3 0 106 0 3 3 0 10-6 0M3 21c0-4 3-6 6-6s6 2 6 6M18 10m-2 0a2 2 0 104 0 2 2 0 10-4 0'},
 Hero:{v:'steps in front',ic:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM12 8v7'},
 Mentor:{v:'hands on the method',ic:'M8 6m-3 0a3 3 0 106 0 3 3 0 10-6 0M2 21c0-4 3-7 6-7s6 3 6 7M17 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M14 21c0-3 1.5-5 3-5s3 2 3 5'},
 Shadow:{v:'acts out what gets hidden',ic:'M12 4a8 8 0 100 16 6 6 0 010-16zM12 4a8 8 0 010 16'},
 Shapeshifter:{v:'becomes what the room wants',ic:'M3 4h7v7H3zM17 17m-4 0a4 4 0 108 0 4 4 0 10-8 0M10 7.5h3.5a3.5 3.5 0 013.5 3.5v2'},
 Healer:{v:'mends what is broken',ic:'M4 20L20 4M7 10l3 3M11 6l3 3M10 14l3 3M14 10l3 3'}};
var VFIX={Ruler:'keeps things in order'};

/* WHAT IT DOES. The Definition bucket: the same for everybody, said
   neutrally, two sentences. The first reuses the archetype's own verb from
   ARCH. The second is what the pattern does for the person, which is why it
   is worth having. Warrior, Sage, Ruler and Everyman reuse COPY.md's mask
   table where it already says this, because reuse beats invention. */
var DEF={
 Warrior:'The Warrior moves on the threat and counts the damage after. It gets the thing done on a day when feeling it would stop you.',
 Sage:'The Sage reads the situation before it moves. It gives you ground to stand on when the moment is unclear.',
 Rebel:'The Rebel refuses the frame it is handed. It marks where you end and other people begin.',
 Caregiver:'The Caregiver attends to the other person first. It sees who needs something before they ask.',
 Creator:'The Creator makes the thing. It turns what is in your head into something other people can hold.',
 Magician:'The Magician changes the conditions around a problem. It finds the one lever that moves the rest.',
 Ruler:'The Ruler keeps things in order. It keeps you trusted with people, money and decisions.',
 Explorer:'The Explorer goes to the edge of what it knows. It brings back what nobody at home has seen yet.',
 Lover:'The Lover closes the distance to the people it wants near. It stays close when things get hard.',
 Jester:'The Jester breaks the tension. It gets a tight room laughing, and breathing, again.',
 Everyman:'The Everyman stays with the room, so it reads the room first. It keeps you in the group.',
 Innocent:'The Innocent takes things at face value. It lets you trust people and start again after a bad day.',
 Orphan:'The Orphan counts on nobody. It gets you through on the days nobody else turns up.',
 Hero:'The Hero steps in front when something has to be done. It takes the hit so the people behind it are spared.',
 Mentor:'The Mentor hands on the method. It makes other people able to do what you can do.',
 Shadow:'The Shadow acts out what gets hidden. It holds what you learned to keep out of sight, and brings it out under pressure.',
 Shapeshifter:'The Shapeshifter becomes what the room wants. It lets you fit in anywhere, fast.',
 Healer:'The Healer mends what is broken. It sees where other people hurt and knows where to put a hand.'};

/* IMPACT. What taking the role on costs, one line, written as a thing that
   happens in a day. It names the saboteur and never calls the person by it.
   Drawn from SABDEF's own "what it is" and "when it fires" at
   engine/data/kb.js, said in plain words. Eleven, because ARCH18 names eleven
   saboteurs across its eighteen rows. */
var IMPACT={
 'Controller':'Handing a thing over feels like dropping it, so the grip stays on.',
 'Pleaser':'Yes comes out before your own answer has been checked.',
 'Stickler':'Time goes into holding everything to the one right way.',
 'Hyper-Rational':'What cannot be explained gets set aside, feelings first.',
 'Avoider':'What needs dealing with waits, for as long as waiting costs nothing today.',
 'Hyper-Vigilant':'Part of your attention stays on the door, even in a safe room.',
 'Victim':'What happened to you takes up the room the next step needs.',
 'Restless':'Once a thing turns familiar, the next one starts to pull.',
 'Judge':'Every shortfall gets a verdict, your own included.',
 'Hyper-Achiever':'Rest feels like falling behind, so the output keeps running.',
 'Worrywart':'The worst case runs on a loop, and it feels like planning.'};

var ROSTER=(function(){
 var by={};
 ARCH.forEach(function(a,i){by[a.nm]={nm:a.nm,v:VFIX[a.nm]||a.v,seat:B2S[a.b],ic:a.ic,read:i,draft:false};});
 ARCH18.forEach(function(r){var nm=r[0]==='Outlaw'?'Rebel':r[0];
  if(by[nm]){by[nm].sab=r[1];by[nm].sabSeat=B2S[r[2]];return;}
  var d=DRAFT6[nm]||{v:'',ic:'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0'};
  by[nm]={nm:nm,v:d.v,seat:B2S[r[2]],ic:d.ic,read:-1,draft:true,sab:r[1],sabSeat:B2S[r[2]]};});
 var out=[]; SEATS.forEach(function(s){Object.keys(by).forEach(function(k){if(by[k].seat===s)out.push(by[k]);});});
 return out;})();
function A(nm){for(var i=0;i<ROSTER.length;i++)if(ROSTER[i].nm===nm)return ROSTER[i];return null;}
function inSeat(s){return ROSTER.filter(function(a){return a.seat===s;});}

/* ---------------- the reference people ----------------
   The avatar pairs are redesign-GG.html's, reduced to what the ring needs:
   the load when the pair was written, the load now, and whether the resolver
   reads the sentence at all. Angela's Ground and Derek's Drive land nowhere,
   because "tired" and "shoulders" are not read (round FB). */
var PEOPLE={
 James:{label:'James, 57, level 3',ideal:'voice',areas:{voice:[6,4.1,1],ground:[5.5,5.5,1],drive:[4.2,1.8,1],love:[3.9,3.4,1],clarity:[3.2,3.2,1]}},
 Angela:{label:'Angela, 36, level 5',ideal:'ground',areas:{ground:[0,0,0],love:[4.6,3.6,1],clarity:[3.8,3.8,1],meaning:[5.1,3,1]}},
 Derek:{label:'Derek, 39, level 7',ideal:'drive',areas:{drive:[0,0,0],love:[5.8,4.9,1],ground:[4.4,2.4,1],pleasure:[5,5,1]}},
 blank:{label:'Nobody yet, first run',ideal:null,areas:{}}};

/* ---------------- state ---------------- */
var WORDS=['Rings true','Resonates','Resonate','Feels like me','This is me'];
var KEY='atuned-proto-GV-archetype';
var ST={who:'James',word:WORDS[0],picks:{},sel:null,hooks:[]};
function readStore(){try{var o=JSON.parse(localStorage.getItem(KEY)||'{}');return o&&typeof o==='object'?o:{};}catch(e){return {};}}
(function(){var o=readStore(); if(o.picks&&typeof o.picks==='object')ST.picks=o.picks;
 if(WORDS.indexOf(o.word)>=0)ST.word=o.word;})();
function writeStore(){try{localStorage.setItem(KEY,JSON.stringify({picks:ST.picks,word:ST.word}));return true;}catch(e){return false;}}

function stranger(){return ST.who==='blank';}
function aff(a){if(stranger()||!a||a.read<0)return null;var v=(AFF[ST.who]||[])[a.read];return typeof v==='number'?v:null;}
function readOrder(){if(stranger())return [];
 return ROSTER.filter(function(a){return aff(a)!=null;}).sort(function(x,y){return aff(y)-aff(x);});}
function pick(){var p=ST.picks[ST.who];return p&&A(p)?p:null;}

/* ONE PRESS. The press is the save. Pressing the picked one again takes it
   off. Pressing a different one moves the pick and says what it replaced,
   because a press that silently undoes another choice is a press that lies.
   A status is only written after the write has succeeded. */
function toggle(nm){
 var was=pick(), msg, warn=false;
 if(was===nm){delete ST.picks[ST.who]; msg='Taken off. No archetype is picked.';}
 else{ST.picks[ST.who]=nm; msg=was?'Saved. '+nm+' replaces '+was+'.':'Saved.';}
 if(!writeStore()){warn=true; msg='Not saved. This browser refused the write, so the pick lasts until the page closes.';}
 fire(); say(msg,warn,nm);}
var sayT=null;
/* the status goes under the button that was pressed, and nowhere else */
function say(msg,warn,nm){requestAnimationFrame(function(){
 var b=nm&&document.querySelector('[data-rt="'+nm+'"]'), own=b&&b.closest('.ar-det')&&b.closest('.ar-det').querySelector('.ar-st');
 [].forEach.call(document.querySelectorAll('.ar-st'),function(s){s.textContent='';});
 [].forEach.call(own?[own]:document.querySelectorAll('.ar-st'),function(s){s.textContent=msg;s.classList.toggle('warn',!!warn);});
 clearTimeout(sayT); if(!warn)sayT=setTimeout(function(){[].forEach.call(document.querySelectorAll('.ar-st'),function(s){s.textContent='';});},2400);});}
function on(fn){ST.hooks.push(fn);}
function fire(){ST.hooks.forEach(function(f){f();});}

/* ---------------- helpers ---------------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function col(seat){return 'var(--'+seat+')';}
function pos(a,r){var t=a*Math.PI/180;return [50+r*Math.cos(t),50+r*Math.sin(t)];}
function aicon(a,cls){return '<svg viewBox="0 0 24 24" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'><path d="'+a.ic+'"'+(a.draft?' stroke-dasharray="3 2"':'')+'/></svg>';}
function areaOf(a){return SA[a.seat];}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* ---------------- what a pick says, the same on all five pages ---------------- */
function head(a,sz){var ar=areaOf(a);
 return '<div class="ar-dh"><span class="ar-dic"'+(sz?' style="width:'+sz+'px;height:'+sz+'px"':'')+'>'+aicon(a)+'</span><div>'
  +'<p class="ar-eyb"><b>'+esc(ar.nm)+'</b>, '+esc(THE[a.seat])+'</p><h3>'+esc(a.nm)+'</h3></div></div>';}
function body(a){
 return '<p class="ar-def">'+esc(DEF[a.nm]||'')+'</p>'
  +(a.sab?'<div class="ar-imp" style="--s:'+col(a.sabSeat)+'"><p class="ar-lbl">Impact</p>'
   +'<p class="ar-impv"><b>'+esc(a.sab)+'</b><span>primary saboteur, at '+esc(THE[a.sabSeat])+'</span></p>'
   +'<p class="ar-impc">'+esc(IMPACT[a.sab]||'')+'</p></div>':'')
  +(a.draft?'<p class="ar-dr">Draft. '+esc(a.nm)+' is in the table of eighteen and not yet in the instrument, so its mark and its lines are proposals and nothing reads it.</p>':'');}
function button(a){var p=pick()===a.nm;
 return '<button type="button" class="ar-rt'+(p?' ar-on':'')+'" data-rt="'+esc(a.nm)+'" aria-pressed="'+p+'" style="--c:'+col(a.seat)+'">'
  +svg('ring')+'<span>'+esc(ST.word)+'</span></button>';}
/* the page's question follows the button word, so the two always agree */
function question(){return {'Rings true':'Which of these rings true?','Resonates':'Which of these resonates?',
 'Resonate':'Which of these resonates?','Feels like me':'Which of these feels like you?','This is me':'Which of these is most like you?'}[ST.word];}
function hint(){return '<p class="ar-hint">One press saves it. Press again to take it off.</p>';}
function status(){return '<p class="ar-st" role="status" aria-live="polite"></p>';}
function compare(){
 var p=pick(); if(!p)return '';
 var first=A(p);
 if(stranger())return '<p class="ar-cmp">Nothing is on record yet. What you write from here will show whether your field agrees.</p>';
 var ro=readOrder(), top=ro[0];
 if(first.draft)return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first. The instrument does not read '+esc(first.nm)+' yet, so the two cannot be compared.</p>';
 if(top.nm===first.nm)return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first too. What you say and what it reads agree.</p>';
 var at=ro.indexOf(first);
 return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first and '+esc(first.nm)+' '
  +(at===1?'second':at===2?'third':'further down')+'. Both are kept. The gap between what you say and what it reads is part of the reading.</p>';}
function detail(a,o){o=o||{};
 return '<div class="ar-det" style="--c:'+col(a.seat)+'">'+(o.nohead?'':head(a))+body(a)
  +'<div class="ar-act">'+button(a)+'</div>'+hint()+status()+(o.nocmp||pick()!==a.nm?'':compare())+'</div>';}

/* ---------------- the ring, shared by the variations ----------------
   The avatar figure from redesign-GG.html, drawn the same way: a core, seven
   satellites at the same angles, percent complete on each. The core carries
   the picked archetype. */
function pct(k){var a=PEOPLE[ST.who].areas[k]; if(!a||!a[2]||!(a[0]>0))return null;
 return Math.round(100*Math.max(0,Math.min(1,1-a[1]/a[0])));}
function overall(){var v=AREAS.map(function(x){return pct(x.k);}).filter(function(x){return x!=null;});
 return v.length?Math.round(v.reduce(function(s,x){return s+x;},0)/v.length):null;}
function arcP(cx,cy,r,f){if(f<=0)return ''; if(f>=1)f=0.9999;
 var a0=-Math.PI/2,a1=a0+f*Math.PI*2;
 return 'M'+(cx+r*Math.cos(a0)).toFixed(2)+' '+(cy+r*Math.sin(a0)).toFixed(2)+' A'+r+' '+r+' 0 '+(f>0.5?1:0)+' 1 '+(cx+r*Math.cos(a1)).toFixed(2)+' '+(cy+r*Math.sin(a1)).toFixed(2);}
/* o: {orb, sr, satBtn, sel (area key), glow (seat to 0..1), extra (svg), over (html), core (html)} */
function ring(o){o=o||{};
 var ORB=o.orb||37.5, SR=o.sr||6.5, P=PEOPLE[ST.who], p=pick(), pa=p?A(p):null;
 var s='<svg class="draw" viewBox="0 0 100 100" aria-hidden="true">';
 for(var i=0;i<72;i++){var a=i*5,p0=pos(a,19.2),p1=pos(a,i%6===0?21.4:20.4);
  s+='<line x1="'+p0[0].toFixed(2)+'" y1="'+p0[1].toFixed(2)+'" x2="'+p1[0].toFixed(2)+'" y2="'+p1[1].toFixed(2)+'" stroke="#3A3E4A" stroke-width=".25"/>';}
 s+='<circle cx="50" cy="50" r="17.6" fill="none" stroke="#2A2E3A" stroke-width=".5"/>';
 var ov=overall(); if(ov!=null)s+='<path d="'+arcP(50,50,17.6,ov/100)+'" fill="none" stroke="var(--ink)" stroke-width=".9" stroke-linecap="round" opacity=".8"/>';
 AREAS.forEach(function(x){
  var c=pos(x.a,ORB), p0=pos(x.a,22.2), p1=pos(x.a,ORB-SR-0.6), has=!!P.areas[x.k], hot=pa&&pa.seat===x.seat, g=o.glow&&o.glow[x.seat];
  if(g)s+='<circle cx="'+c[0].toFixed(2)+'" cy="'+c[1].toFixed(2)+'" r="'+(SR+0.8+g*3).toFixed(2)+'" fill="'+col(x.seat)+'" fill-opacity=".14"/>';
  s+='<line x1="'+p0[0].toFixed(2)+'" y1="'+p0[1].toFixed(2)+'" x2="'+p1[0].toFixed(2)+'" y2="'+p1[1].toFixed(2)+'" stroke="'+(has||hot?col(x.seat):'#2A2E3A')+'" stroke-opacity="'+(hot?.95:has?.35:.6)+'" stroke-width="'+(hot?.8:.3)+'"'+(has||hot?'':' stroke-dasharray="1 1.2"')+'/>';
  s+='<circle cx="'+c[0].toFixed(2)+'" cy="'+c[1].toFixed(2)+'" r="'+SR+'" fill="none" stroke="'+(has||hot?col(x.seat):'#3A3E4A')+'" stroke-opacity="'+(hot?.9:has?.3:1)+'" stroke-width="'+(hot?.8:.55)+'"/>';
  var pc=pct(x.k); if(pc!=null&&pc>0)s+='<path d="'+arcP(c[0],c[1],SR,pc/100)+'" fill="none" stroke="'+col(x.seat)+'" stroke-width="1" stroke-linecap="round"/>';});
 s+=(o.extra||'')+'</svg>';
 var core=o.core!=null?o.core:coreHTML(pa,ov);
 var sats=AREAS.map(function(x){var c=pos(x.a,ORB), pc=pct(x.k), tag=o.satBtn?'button type="button"':'span';
  return '<'+tag+' class="sat" data-sat="'+x.k+'" style="left:'+c[0].toFixed(2)+'%;top:'+c[1].toFixed(2)+'%;--c:'+col(x.seat)+'"'
   +(o.satBtn?' aria-pressed="'+(o.sel===x.k)+'" aria-label="'+x.nm+'"':'')+'>'
   +svg(x.k)+'<span class="pc'+(pc==null?' none':'')+'">'+(pc==null?'–':pc+'%')+'</span></'+(o.satBtn?'button':'span')+'>';}).join('');
 var labs=o.nolabs?'':AREAS.map(function(x){var l=pos(x.a,ORB-SR-4.6);
  return '<span class="slab'+(o.sel===x.k?' on':'')+'" style="left:'+l[0].toFixed(2)+'%;top:'+l[1].toFixed(2)+'%">'+x.nm+'</span>';}).join('');
 return s+labs+core+sats+(o.over||'');}
function coreHTML(pa,ov){
 return '<div class="core'+(pa?' has':'')+'"'+(pa?' style="--c:'+col(pa.seat)+'"':'')+'>'
  +(pa?aicon(pa,'cic'):svg('person','cic'))
  +'<span class="big">'+(ov==null?'–':ov+'%')+'</span><span class="lb">Complete</span>'
  +(pa?'<span class="anm">'+esc(pa.nm)+'</span>':'')+'</div>';}

/* ---------------- the prototype's own chrome ---------------- */
var PAGES=[['avatar-merge','Merge'],['v1-orbit','Orbit'],['v2-ladder','Ladder'],['v3-three','Three'],['v4-spine','Spine']];
function bar(name,say){
 var h='<div class="pbar" data-proto role="region" aria-label="Prototype controls"><span class="tag">Prototype</span>'
  +'<span class="say"><b>Not the app.</b> '+say+'</span>'
  +'<label>Person <select id="arWho">'+Object.keys(PEOPLE).map(function(k){return '<option value="'+k+'"'+(k===ST.who?' selected':'')+'>'+PEOPLE[k].label+'</option>';}).join('')+'</select></label>'
  +'<label>Button word <select id="arWord">'+WORDS.map(function(w){return '<option'+(w===ST.word?' selected':'')+'>'+w+'</option>';}).join('')+'</select></label>'
  +'<button type="button" class="pbtn" id="arClear">Clear picks</button>'
  +'<nav class="pnav" aria-label="Prototype pages">'+PAGES.map(function(p){return p[0]===name?'<b>'+p[1]+'</b>':'<a href="'+p[0]+'-packed.html">'+p[1]+'</a>';}).join('')+'</nav></div>'
  +'<div class="ptag" data-proto aria-hidden="true">Prototype, not the app</div>';
 document.body.insertAdjacentHTML('afterbegin',h);
 wireBar();}
function wireBar(){
 var w=document.getElementById('arWho'), d=document.getElementById('arWord'), c=document.getElementById('arClear');
 if(w)w.addEventListener('change',function(){setWho(w.value);});
 if(d)d.addEventListener('change',function(){ST.word=d.value; writeStore(); fire();});
 if(c)c.addEventListener('click',function(){ST.picks={}; writeStore(); fire(); say('Picks cleared for every person.');});}
/* #who=Derek&sel=Sage, so a screenshot or a link can open on a state */
function fromHash(){var h=location.hash, w=(h.match(/who=(\w+)/)||[])[1], s=(h.match(/sel=(\w+)/)||[])[1];
 if(w&&PEOPLE[w])ST.who=w; if(s&&A(s))ST.sel=s;
 var sw=document.getElementById('arWho'); if(sw)sw.value=ST.who;}
function setWho(w){if(!PEOPLE[w])return; ST.who=w; ST.sel=null; var s=document.getElementById('arWho'); if(s)s.value=w; fire();}

/* a press on any "Rings true" button anywhere on the page */
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-rt]'); if(!t)return;
 t.classList.remove('ar-hit'); void t.offsetWidth; toggle(t.dataset.rt);
 var n=document.querySelector('[data-rt="'+t.dataset.rt+'"]'); if(n){n.classList.add('ar-hit'); n.focus({preventScroll:true});}});

/* THE COUNT, live. Every visible control that is not the prototype's own. */
function measure(el,root){
 root=root||document.querySelector('main')||document.body;
 var els=[].slice.call(root.querySelectorAll('button,input,textarea,select,a[href],summary'));
 var vis=els.filter(function(e){return e.offsetParent!==null&&!e.closest('[data-proto]')&&!e.disabled;});
 var first=vis.filter(function(e){var r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;});
 if(el)el.textContent='Choices in view now: '+first.length+'. On the whole page: '+vis.length+'. Target: under 12.';
 return {view:first.length,all:vis.length};}

return {SEATS:SEATS,THE:THE,AREAS:AREAS,AK:AK,SA:SA,ROSTER:ROSTER,A:A,inSeat:inSeat,DEF:DEF,IMPACT:IMPACT,PEOPLE:PEOPLE,ST:ST,
 svg:svg,aicon:aicon,areaOf:areaOf,esc:esc,col:col,pos:pos,cap:cap,aff:aff,readOrder:readOrder,pick:pick,toggle:toggle,say:say,
 on:on,fire:fire,stranger:stranger,question:question,head:head,body:body,button:button,hint:hint,status:status,compare:compare,detail:detail,
 ring:ring,coreHTML:coreHTML,pct:pct,overall:overall,bar:bar,wireBar:wireBar,setWho:setWho,fromHash:fromHash,measure:measure,WORDS:WORDS,STAMP:STAMP};
})();
