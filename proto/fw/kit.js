/* ============================================================
   THE FW MOCKUP KIT, script half. build.js puts DATA (data.json, read out of
   the committed build by extract.js) in front of this, so every name, weight
   and place below is the engine's own.
   ============================================================ */
var T=DATA.tables, PAL=T.PAL;
var SEATK={'Crown':'crown','3rd Eye':'eye','Throat':'throat','Heart':'heart','Solar':'solar','Sacral':'sacral','Root':'root'};
var SEATNM={crown:'Crown',eye:'Third eye',throat:'Throat',heart:'Heart',solar:'Solar',sacral:'Sacral',root:'Root'};
var NODE={}; T.NODES.forEach(function(n){NODE[n.i]=n;});
var PMYP={}; T.PMBANDS.forEach(function(b){PMYP[b.k]=b.yp;});
function col(b){return PAL[b]||PAL[SEATNM[b]]||'#7EB8D4';}
function colK(k){return col(({crown:'Crown',eye:'3rd Eye',throat:'Throat',heart:'Heart',solar:'Solar',sacral:'Sacral',root:'Root'})[k]);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* a ring icon. icons are ring, not fill, ruled. */
function ic(d,sz,c,sw){return '<svg class="ic" viewBox="0 0 24 24" width="'+(sz||18)+'" height="'+(sz||18)
 +'" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(sw||1.6)+'" stroke-linecap="round" stroke-linejoin="round"><path d="'+d+'"/></svg>';}
function seatIc(b,sz,c){var g=T.SEATGLYPH[b]||'';return '<svg class="ic" viewBox="0 0 24 24" width="'+(sz||18)+'" height="'+(sz||18)
 +'" fill="none" stroke="'+(c||col(b))+'" stroke-width="1.6" stroke-linejoin="round">'+g+'</svg>';}
function bodyPath(attrs){return '<path '+(attrs||'')+' transform="translate('+T.PMTX+','+T.PMTY+') scale('+T.PMS+')" d="'+T.BODYPATH+'"/>';}

/* the person. four of the reference profiles, loaded in the real engine. */
var WHO=(function(){var h=(location.hash.match(/who=(\w+)/)||[])[1];return DATA.people[h]?h:'Gordon';})();
function PP(){return DATA.people[WHO];}
function sqMap(){var m={};PP().sq.forEach(function(r){m[r[0]]=r[1];});return m;}
function setWho(w){WHO=w;var h=location.hash.replace(/who=\w+&?/,'');location.hash='who='+w+(h&&h!=='#'?'&'+h.replace(/^#/,''):'');}

function banner(what,people){
 var who=people===false?'':'<span class="who"><span class="dim">Profile</span> '+Object.keys(DATA.people).map(function(n){
  return '<button class="chip'+(n===WHO?' on':'')+'" data-who="'+n+'">'+n+'</button>';}).join('')+'</span>';
 document.body.insertAdjacentHTML('afterbegin','<div class="pb"><b>Prototype, not the app.</b><span>'+esc(what)
  +'. Readings are the engine\'s own, computed on commit '+DATA.stamp.commit+'. Nothing here saves.</span><span class="sp"></span>'+who+'</div>');
 document.querySelectorAll('.pb [data-who]').forEach(function(b){b.onclick=function(){setWho(b.dataset.who);if(window.draw)draw();
  document.querySelectorAll('.pb [data-who]').forEach(function(x){x.classList.toggle('on',x.dataset.who===WHO);});};});}
function seg(host,opts,cur,on,cls){
 host.innerHTML='<div class="seg '+(cls||'')+'">'+opts.map(function(o){return '<button data-k="'+o[0]+'" class="'+(o[0]===cur?'on':'')+'">'+esc(o[1])+'</button>';}).join('')+'</div>';
 host.querySelectorAll('button').forEach(function(b){b.onclick=function(){host.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);});on(b.dataset.k);};});}

/* ============================================================
   EXACT PLACES. The engine's ANAT rows, turned into figure units the way
   ui/map.js pmAnat does it, WITHOUT the push apart: this is the place each
   row names, before anything moves a mark to keep it clickable. A pair row
   carries both sides, so a structure that comes in a left and a right copy
   shows on both, which is CS question 5 drawn rather than asked.
   ============================================================ */
function spineY(lv){var R=T.ANATSPINE,i=0;while(i<R.length-2&&lv>R[i+1][0])i++;var a=R[i],b=R[i+1];return a[1]+(lv-a[0])*(b[1]-a[1])/(b[0]-a[0]);}
var BACKROW=/^(Amsa|Brihati|Parshvasandhi|Kukundara|Katikataruna|Lumbar plexus|Coccygeal)/;
function anatRows(){
 var H=T.ANATHEAD, mm=(H.topZ-H.earZ)/(H.year-H.ytop), out=[];
 T.ANAT.forEach(function(row){
  var pts=row.h?row.h.map(function(p){return [50-p[0]/mm,H.ytop+(H.topZ-p[1])/mm];})
   :row.v?row.v.map(function(p){return [50+p[1],spineY(p[0])];})
   :row.f?row.f.map(function(p){return [p[0],p[1]];}):null;
  out.push({s:row.s,ids:row.ids,pts:pts,view:BACKROW.test(row.s)?'back':'front',
   src:row.h?'atlas':row.v?'spine':row.f?'chart':'none',c:row.c||null,at:row.at||null});});
 return out;}

/* ============================================================
   THE MASK. A saboteur is a voice, and a voice has a face. The face is
   built, not drawn by hand, from three things the engine already knows,
   which is the house rule in one object: if it has a name it has an icon,
   the icon has a family, the family has a colour, and the colour means
   something.

     the OUTLINE is its family, the architecture it belongs to
     the EXPRESSION is its child fetter, the charge it runs on
     the COLOUR is its seat

   Stroked, never filled. 24 unit box, like every icon in the product.
   ============================================================ */
var FAM_OUT={
 /* a square jaw and a flat brow. nothing is allowed out of its cell */
 Rigidity:'M5 4h14v10c0 4-3 7-7 7s-7-3-7-7z',
 /* the lower half has given way */
 Collapse:'M5 5c4-2 10-2 14 0v6c0 6-3 11-7 11s-7-5-7-11z M5 11c1 1 2 1.5 3 1.5 M19 11c-1 1-2 1.5-3 1.5',
 /* held bigger than the face, with a crest the face did not grow */
 Grandiosity:'M4 9c0-4 4-6 8-6s8 2 8 6c0 7-4 12-8 12s-8-5-8-12z M7 4.5l1.5-3 2 2 1.5-2.5 1.5 2.5 2-2 1.5 3',
 /* the chin comes to a point */
 Predatory:'M4 5l8-2 8 2-1 8-7 9-7-9z',
 /* one half calm, the other half overshooting */
 Dysregulation:'M12 3c-5 0-8 2.5-8 6.5 0 6 4 11.5 8 11.5 M12 3l3.5 1 .5 2.5 2.5 1-1 2.5 2 2-2.5 1.5.5 3-3 1.5-2.5 3',
 /* the outline holds and there is nobody inside it: drawn broken */
 Dissociation:'M4 9a8 6 0 0116 0c0 6-4 10-8 10S4 15 4 9z'};
var POLE_OF={}; Object.keys(T.FAM_POLE).forEach(function(k){POLE_OF[T.FAM_POLE[k]]=k;});
var FACE={
 fear:     'M7.5 7l2.5-1.2 M16.5 7L14 5.8 M9 10.5m-1.3 0a1.3 1.3 0 102.6 0 1.3 1.3 0 10-2.6 0 M15 10.5m-1.3 0a1.3 1.3 0 102.6 0 1.3 1.3 0 10-2.6 0 M11 16.3a1 1.2 0 102 0 1 1.2 0 10-2 0',
 anger:    'M7 7.2l3.2 1.6 M17 7.2l-3.2 1.6 M8 11h2.6 M13.4 11H16 M9.5 16.5h5',
 shame:    'M7.5 8.6h3 M13.5 8.6h3 M8 11q1.3 1.1 2.6 0 M13.4 11q1.3 1.1 2.6 0 M11.5 16.6h2.5',
 disgust:  'M7 8l3.2-.4 M14 6.3l3 1.1 M8 11h2.6 M13.4 10.7H16 M9 16.8q1.6-1.4 3 0t3-1',
 apathy:   'M8 10.6h2.6 M13.4 10.6H16 M8 9.6h2.6 M13.4 9.6H16 M9 16h6',
 shock:    'M7.5 6h3 M13.5 6h3 M9 10.5m-1.6 0a1.6 1.6 0 103.2 0 1.6 1.6 0 10-3.2 0 M15 10.5m-1.6 0a1.6 1.6 0 103.2 0 1.6 1.6 0 10-3.2 0 M12 16.5m-1.3 0a1.3 1.3 0 102.6 0 1.3 1.3 0 10-2.6 0',
 sadness:  'M7.2 8.4l3-1.4 M16.8 8.4l-3-1.4 M8 10.8q1.3-.9 2.6 0 M13.4 10.8q1.3-.9 2.6 0 M9 17.6q3-2.6 6 0',
 surprise: 'M7 7.6q1.6-2 3.2 0 M13.8 7.6q1.6-2 3.2 0 M9 10.6m-1.1 0a1.1 1.1 0 102.2 0 1.1 1.1 0 10-2.2 0 M15 10.6m-1.1 0a1.1 1.1 0 102.2 0 1.1 1.1 0 10-2.2 0 M12 16.4m-.8 0a.8 .8 0 101.6 0 .8 .8 0 10-1.6 0',
 anticipation:'M7.5 8h3 M13.5 8h3 M8 10.8h2.6 M13.4 10.8H16 M10.2 10.8v.01 M15.6 10.8v.01 M9.5 16.2h5 M10.5 15.4v1.6 M13.5 15.4v1.6'};
var NOUN_CH={}; Object.keys(T.INFER_NOUN).forEach(function(k){NOUN_CH[T.INFER_NOUN[k]]=k.toLowerCase()
 .replace(/^sad$/,'sadness');});
var FAM_CH={Rigidity:'disgust',Collapse:'sadness',Predatory:'anger',Dysregulation:'fear',Dissociation:'apathy',Grandiosity:'anger'};
var SAB33C={}; T.SAB33.forEach(function(s){SAB33C[s[0]]=s[1].map(function(c){return c[0];});});
function sabFam(s){var f=s.hcx||'';return FAM_OUT[f]?f:(POLE_OF[f]||'Dissociation');}
function sabCharge(s){
 var base=s.nm.replace(/ overshot$/,'');
 var c=(s.charges&&s.charges[0])||(SAB33C[base]&&SAB33C[base][0]);
 if(!c){var noun=base.split(' ').pop();c=NOUN_CH[noun];}
 c=(c||FAM_CH[sabFam(s)]||'apathy').toLowerCase();
 if(c==='sad')c='sadness'; if(c==='joy')c='apathy';
 return FACE[c]?c:'apathy';}
function sabSeat(s){var n=NODE[(s.parts||[])[0]];return n?n.b:'Heart';}
/* the whole mask as one svg. sw grows with weight so a heavy voice reads
   heavier without a number having to say so. */
function maskSvg(s,sz,opt){
 opt=opt||{};var fam=sabFam(s), ch=sabCharge(s), c=opt.c||col(sabSeat(s));
 var sw=(opt.sw||1.2+Math.min(10,s.w||0)*0.07).toFixed(2), over=/overshot/.test(s.nm)||POLE_OF[s.hcx];
 return '<svg class="ic mask" viewBox="0 0 24 24" width="'+sz+'" height="'+sz+'" fill="none" stroke="'+c
  +'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round">'
  +'<path d="'+FAM_OUT[fam]+'"'+(fam==='Dissociation'?' stroke-dasharray="2.2 1.8"':'')+'/>'
  +(over?'<path d="'+FAM_OUT[fam]+'" transform="translate(12 12) scale(1.14) translate(-12 -12)" stroke-opacity=".45" stroke-width=".8"/>':'')
  +'<path d="'+FACE[ch]+'" stroke-width="'+Math.max(1.1,sw*0.85).toFixed(2)+'"/></svg>';}
/* what the voice says. The library's own line where it has one; an inferred
   saboteur has no line in the codex, so it gets the plain statement of what
   it is, and says so by being in the quiet style. */
var CH_WORD={fear:'fear',anger:'anger',shame:'shame',disgust:'disgust',apathy:'apathy',shock:'shock',sadness:'sadness',surprise:'surprise',anticipation:'bracing'};
function sabVoice(s){
 var base=s.nm.replace(/ overshot$/,'').toLowerCase().replace(/-/g,' ');
 var d=T.SABDEF[base]; if(d&&d.q)return {q:d.q.split(' / ')[0],own:true};
 var n=(s.parts||[]).length, seat=s.nm.split(' ')[0];
 return {q:CH_WORD[sabCharge(s)]+' held '+(seat==='Diffuse'?'across several seats':'at the '+seat.toLowerCase())
  +', in '+n+' place'+(n===1?'':'s'),own:false};}
function weightWord(w){return w>=8?'heavy':w>=6?'strong':w>=4?'present':'light';}
function famIc(f){var h=T.HCX_LIB.filter(function(x){return x.nm===f;})[0];return h?h.ic:'';}
function famD(f){var h=T.HCX_LIB.filter(function(x){return x.nm===f;})[0];return h?h.d:'';}
function famSeat(f){var h=T.HCX_LIB.filter(function(x){return x.nm===f;})[0];return h?h.b:'Heart';}

/* ============================================================
   THE TWENTY ONE, DRAWN FOR THE FW ROUND. Each law gets a mark of its own, a
   physical thing a person can picture doing the law with, on the product's
   24 unit grid, stroked. The product's current law icons (canon.js SI ic)
   are small and several are borrowed from other families; these are the
   proposal, and every one is a first draft for the art seat to overrule.
   ============================================================ */
var LAWIC={
 Unity:'M5 12a5 5 0 1010 0 5 5 0 10-10 0 M9 12a5 5 0 1010 0 5 5 0 10-10 0',
 Awareness:'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z M12 12m-2.2 0a2.2 2.2 0 104.4 0 2.2 2.2 0 10-4.4 0 M12 2.5v1.5 M12 20v1.5',
 Nature:'M5 19c0-8 6-14 14-14 0 8-6 14-14 14z M5 19l9-9',
 Presence:'M12 12m-1.6 0a1.6 1.6 0 103.2 0 1.6 1.6 0 10-3.2 0 M12 12m-7 0a7 7 0 1014 0 7 7 0 10-14 0',
 Humility:'M4 11h16c0 5-3.6 8-8 8s-8-3-8-8z M12 4v4',
 Equanimity:'M3 12h18 M9 9h6a3 3 0 010 6H9a3 3 0 010-6z',
 Truth:'M12 2v12 M9 14h6l-3 7z',
 Transparency:'M5 4h14v16H5z M9 8l6 6 M9 13l3 3',
 Justice:'M12 4v16 M8 20h8 M5 7h14 M5 7l-2 5h4z M19 7l-2 5h4z',
 Compassion:'M12 15s-3.8-2.3-3.8-5a1.9 1.9 0 013.8-.8 1.9 1.9 0 013.8.8c0 2.7-3.8 5-3.8 5z M4 13c0 4.7 3.6 8 8 8s8-3.3 8-8',
 Forgiveness:'M3 12c4 0 4-6 9-6 M12 18c-5 0-5-6-9-6 M21 12h-5',
 Generosity:'M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0 M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18',
 'Aesthetic Beauty':'M12 12a1 1 0 011 1 2 2 0 01-2 2 3 3 0 01-3-3 5 5 0 015-5 8 8 0 018 8',
 Courage:'M5 3v18 M9 12h11 M16 8l4 4-4 4',
 Duty:'M4 9h16 M8 9v11 M16 9v11 M10 4h4v5h-4z',
 Responsibility:'M12 7m-3 0a3 3 0 106 0 3 3 0 10-6 0 M5 21v-3a4 4 0 014-4h6a4 4 0 014 4v3',
 Accountability:'M4 4h16v16H4z M8 12l3 3 5-6',
 Temperance:'M6 4h12l-2 16H8z M7 10h10',
 Detachment:'M3 12h7 M14 12h7 M10 8l4 8',
 'Non-Harm':'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12h6',
 Patience:'M7 3h10 M7 21h10 M8 3c0 5 8 5 8 9s-8 4-8 9 M16 3c0 5-8 5-8 9s8 4 8 9'};
