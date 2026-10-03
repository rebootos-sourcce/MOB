/* ============================================================
   THE ROSTER OF EIGHTEEN, shared by the four archetype mockups.

   Two tables in the engine name archetypes and they do not agree:

     ARCH    engine/data/canon.js   twelve, with an icon, a line and a seat.
                                    The engine reads an affinity for each.
     ARCH18  engine/data/canon.js   eighteen, each with its primary saboteur.
                                    Only one drill reads it.

   ARCH18 holds eleven of ARCH's names, calls the Rebel the Outlaw, and adds
   six: Orphan, Hero, Mentor, Shadow, Shapeshifter and Healer. That is the
   "eighteen" the owner means. The six have no icon, no line and no seat in
   the product, so the ones below are DRAFTS, marked as drafts on the page,
   and the engine reads nothing for them.

   The six drafted seats are ARCH18's own third column, which is the seat of
   the primary saboteur. The twelve keep ARCH's seats, which are ruled.
   ============================================================ */
var SEATORD=['Crown','3rd Eye','Throat','Heart','Solar','Sacral','Root'];
/* the shipped seat lines, ui/intakeui.js IQ_SEATLINE, so a seat says the same
   thing here as it does on the questions. */
var SEATLINE={'Crown':'what you belong to','3rd Eye':'what you see','Throat':'what you say',
 'Heart':'what you give','Solar':'what you carry','Sacral':'what you want','Root':'what you stand on'};
var SEATSAY={'3rd Eye':'Third eye'};
function seatName(b){return SEATSAY[b]||b;}
var DRAFT6={
 Orphan:{v:'counts on nobody',ic:'M9 7m-3 0a3 3 0 106 0 3 3 0 10-6 0M3 21c0-4 3-6 6-6s6 2 6 6M18 10m-2 0a2 2 0 104 0 2 2 0 10-4 0'},
 Hero:{v:'steps in front',ic:'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6zM12 8v7'},
 Mentor:{v:'hands on the method',ic:'M8 6m-3 0a3 3 0 106 0 3 3 0 10-6 0M2 21c0-4 3-7 6-7s6 3 6 7M17 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M14 21c0-3 1.5-5 3-5s3 2 3 5'},
 Shadow:{v:'acts out what gets hidden',ic:'M12 4a8 8 0 100 16 6 6 0 010-16zM12 4a8 8 0 010 16'},
 Shapeshifter:{v:'becomes what the room wants',ic:'M3 4h7v7H3zM17 17m-4 0a4 4 0 108 0 4 4 0 10-8 0M10 7.5h3.5a3.5 3.5 0 013.5 3.5v2'},
 Healer:{v:'mends what is broken',ic:'M4 20L20 4M7 10l3 3M11 6l3 3M10 14l3 3M14 10l3 3'}};
/* ARCH's Ruler line reads "orders the field", and Field is a surface name.
   COPY.md already paraphrases it the same way. */
var VFIX={Ruler:'keeps things in order'};
var ROSTER=(function(){
 var by={};T.ARCH.forEach(function(a,i){by[a.nm]={nm:a.nm,v:VFIX[a.nm]||a.v,b:a.b,ic:a.ic,read:i,draft:false};});
 ARCH18.forEach(function(r){var nm=r[0]==='Outlaw'?'Rebel':r[0];
  if(by[nm]){by[nm].sab=r[1];return;}
  var d=DRAFT6[nm]||{v:'',ic:'M12 12m-8 0a8 8 0 1016 0 8 8 0 10-16 0'};
  by[nm]={nm:nm,v:d.v,b:r[2],ic:d.ic,read:-1,draft:true,sab:r[1]};});
 var out=[];SEATORD.forEach(function(b){Object.keys(by).forEach(function(k){if(by[k].b===b)out.push(by[k]);});});
 return out;})();
function A(nm){return ROSTER.filter(function(a){return a.nm===nm;})[0];}
function inSeat(b){return ROSTER.filter(function(a){return a.b===b;});}
/* the archetype's own mark. a draft is dashed, so "not in the product yet"
   is said by the drawing as well as by the words beside it. */
function aic(a,sz,c,sw){var s=ic(a.ic,sz,c||col(a.b),sw||1.5);
 return a.draft?s.replace('<path ','<path stroke-dasharray="3 2" '):s;}
function sabLine(a){var d=T.SABDEF[(a.sab||'').toLowerCase().replace(/-/g,' ')];return d&&d.q?d.q.split(' / ')[0]:'';}

/* A STRANGER IS THE DEFAULT, because this screen is the first thing a new
   person is asked. A profile chip loads a worked example instead. */
var STRANGER=true;
function readOrder(){if(STRANGER)return [];var aff=PP().aff||[];
 return ROSTER.filter(function(a){return a.read>=0;}).sort(function(x,y){return (aff[y.read]||0)-(aff[x.read]||0);});}
function strangerChip(onchange){
 var pb=document.querySelector('.pb .who');
 pb.insertAdjacentHTML('afterbegin','<button class="chip on" data-str="1">A stranger</button>');
 var chips=document.querySelectorAll('.pb [data-who]'), st=document.querySelector('[data-str]');
 chips.forEach(function(b){b.classList.remove('on');b.addEventListener('click',function(){STRANGER=false;st.classList.remove('on');onchange();});});
 st.onclick=function(){STRANGER=true;st.classList.add('on');chips.forEach(function(b){b.classList.remove('on');});onchange();};}

/* WHAT A PICK MEANS, said the same way on all four pages. The detail is the
   Definition, the same for everybody. The comparison is a Reading, and it is
   only said where there is something to compare. */
function detail(a){
 var s=sabLine(a);
 return '<div class="ar-det"><div class="ar-dh">'+aic(a,52)+'<div><div class="eyebrow" style="color:'+col(a.b)+'">'
  +esc(seatName(a.b))+', '+esc(SEATLINE[a.b])+'</div><h2>'+esc(a.nm)+'</h2><div class="muted">'+esc(a.v)+'</div></div></div>'
  +(a.sab?'<p class="ar-sab">Its primary saboteur is <b>'+esc(a.sab)+'</b>'+(s?', which says: <i>'+esc(s)+'</i>':'.')+'</p>':'')
  +(a.draft?'<p class="ar-dr">Draft. '+esc(a.nm)+' is in the table of eighteen and not yet in the instrument, so its mark and line are proposals and nothing reads it.</p>':'')
  +'</div>';}
function compare(first){
 if(!first)return '';
 if(STRANGER)return '<p class="ar-cmp">Nothing is on record yet. What you write from here will show whether your field agrees.</p>';
 var ro=readOrder(), top=ro[0];
 if(first.draft)return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first. The instrument does not read '
  +esc(first.nm)+' yet, so the two cannot be compared.</p>';
 if(top.nm===first.nm)return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first too. What you say and what it reads agree.</p>';
 var at=ro.indexOf(first);
 return '<p class="ar-cmp">Your field reads <b>'+esc(top.nm)+'</b> first and '+esc(first.nm)+' '
  +(at===1?'second':at===2?'third':'further down')+'. Both are kept. The gap between what you say and what it reads is part of the reading.</p>';}
function saveRow(ok){
 return '<div class="ar-save"><button class="btn-p" id="arsave"'+(ok?'':' disabled')+'>Save</button><span class="small dim" id="arsn">'
  +(ok?'':'Pick one first.')+'</span></div>';}
function wireSave(){var b=document.getElementById('arsave');if(b)b.onclick=function(){
 document.getElementById('arsn').textContent='This is a prototype, so nothing was saved.';};}
function foot(why){
 return '<details class="ar-foot"><summary>Why this layout, and what it replaced</summary>'+why
  +'<p class="small dim" style="margin-top:12px">What was there before: two symbols at a time, six rounds, and nothing on screen said there were more than two.</p>'
  +'<img src="{{img:energetics-pin-1600.jpg}}" alt="The earlier pair screen, Warrior against Sage" style="max-width:100%;border-radius:8px;border:1px solid var(--edge)"></details>';}
var AR_CSS='.ar-det h2{margin:0;font-size:24px;font-weight:600}.ar-dh{display:flex;gap:14px;align-items:center}'
 +'.ar-sab{margin:14px 0 0}.ar-sab i{color:var(--mid)}.ar-dr{font-size:13px;color:var(--dim);border-left:2px dashed var(--edge-2);padding-left:10px;margin:12px 0 0}'
 +'.ar-cmp{margin:12px 0 0;color:var(--mid)}'
 +'.ar-save{display:flex;gap:12px;align-items:center;margin-top:16px;flex-wrap:wrap}'
 +'.btn-p{min-height:44px;min-width:96px;padding:0 20px;border-radius:12px;border:0;background:var(--accent);color:var(--on-accent);font-weight:600;cursor:pointer}'
 +'.btn-p[disabled]{background:var(--panel-2);color:var(--dim);cursor:default}'
 +'.btn-g{min-height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--edge-2);background:transparent;cursor:pointer;color:var(--mid)}'
 +'.ar-foot{margin-top:28px;max-width:900px}.ar-foot summary{cursor:pointer;color:var(--mid);padding:11px 0}'
 +'.ar-foot p{color:var(--mid);max-width:72ch}'
 +'.ar-h1{font-size:30px;font-weight:600;margin:6px 0 6px;letter-spacing:-.01em}.ar-lede{color:var(--mid);max-width:64ch;margin:0 0 16px;font-size:16px}'
 +'.ar-key{font-size:13px;color:var(--dim);display:flex;gap:6px;align-items:center;margin-top:8px}'
 +'@media (max-width:620px){.ar-h1{font-size:23px}}';
document.head.insertAdjacentHTML('beforeend','<style>'+AR_CSS+'</style>');
