/* NERVE CHARGE, THREE WAYS. The address deck (kbPoleRow in ui/knowledge.js)
   drawn three ways from the same rows, read off a scratch build of HEAD
   f0efe988 through the real kbRows('addr'), for the six ICPs, Tomas, and a
   profile with nothing entered. Nothing here is computed that the engine does
   not compute, except column B's needle, which is the point of column B.

   Row tuple: [seat group, name, colour, glyph key, held %, installed % or
   null, opposite, left after (0 to 10), opposite ahead (0 to 10), nerve]. */
var D=__DATA__;
var LINE={'Crown':'what you belong to','3rd Eye':'what you see','Throat':'what you say',
 'Heart':'what you give','Solar':'what you carry','Sacral':'what you want','Root':'what you stand on'};
var HEART=D.seatC.Heart;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function svg(inner,cls,style){return '<svg class="'+cls+'" viewBox="0 0 24 24" aria-hidden="true"'+(style?' style="'+style+'"':'')+'>'+inner+'</svg>';}
function badge(r){return '<span class="bd" style="--c:'+r[2]+'">'+svg(D.glyph[r[3]]||'','')+'</span>';}
function R(r){return {seat:r[0],t:r[1],c:r[2],ic:r[3],lp:r[4]||0,rp:r[5]||0,solo:r[5]===null,opp:r[6],sq:r[7],pole:r[8],nerve:r[9]};}
function unread(p){return p.rows.every(function(r){return !r[4]&&!r[5];});}

/* A. AS BUILT. poleDualBar, copied: the same markup, the same widths, the
   same poleTip and poleDimPct, and the same end icons with no stroke set,
   which is how they ship. */
function tipOf(lp,rp){return 50-lp/2+rp/2;}
function dimOf(tip,side){var d=Math.abs(tip-50)/50, win=(side==='l')===(tip<=50);return (tip===50||win)?0:Math.round(d*85);}
function rowA(r){
 var x=R(r), tip=tipOf(x.lp,x.rp), dl=dimOf(tip,'l'), dr=dimOf(tip,'r');
 var st=function(c,d){return 'color:'+(d?'color-mix(in srgb,'+c+' '+(100-d)+'%,var(--dim))':c);};
 return '<div class="row" style="--c:'+x.c+';--oc:'+HEART+'"><span class="kbp2"><span class="kbp2-nm"><span class="kbp2-lwrap">'+badge(r)
  +'<span class="kbp2-l">'+esc(x.t)+'</span></span><span class="kbp2-r">'+esc(x.opp)+'</span></span>'
  +'<span class="kbp2-row"><svg class="kbp2-ic" viewBox="0 0 24 24" fill="none" stroke-width="2" style="'+st('var(--c)',dl)+'">'+D.strike.cl+'</svg>'
  +'<span class="kbp2-bar">'+(x.lp?'<i class="kbp2-fl" style="width:'+(x.lp/2)+'%"><b>'+Math.round(x.lp)+'%</b></i>':'')
  +(x.rp?'<i class="kbp2-fr" style="width:'+(x.rp/2)+'%"><b>'+Math.round(x.rp)+'%</b></i>':'')+'<i class="kbp2-ctr"></i></span>'
  +'<svg class="kbp2-ic" viewBox="0 0 24 24" fill="none" stroke-width="2" style="'+st('var(--oc)',dr)+'">'+D.strike.op+'</svg></span></span></div>';}

/* B. R1'S PAIR GRAMMAR, PORTED. A pair is one reading split two ways, so it
   needs one figure on a track at 50. The engine has none for an address, so
   this column uses the build's own poleTip, the least invented figure on
   offer, and prints what r1 prints: how far toward the lit side. A row with
   no opposite is an amount in r1, so it fills from the left end. */
var CH={l:'<path d="M15 6l-6 6 6 6"/>',r:'<path d="M9 6l6 6-6 6"/>'};
function rowB(r,off){
 var x=R(r);
 if(x.solo){var v=x.lp;
  return '<div class="row amt'+(off?' off':'')+'" style="--c:'+x.c+'"><div class="ln"><span class="pole lit">'+badge(r)+'<span class="nmL">'+esc(x.t)+'</span></span>'
   +'<b class="fg">'+(off?'not read':Math.round(v)+'%')+'</b></div><div class="tk"><i class="fill" style="width:'+v+'%"></i></div></div>';}
 var tip=tipOf(x.lp,x.rp), dir=off?0:(tip<50?-1:tip>50?1:0), f=Math.round(tip<50?100-tip:tip);
 var sc=dir<0?x.c:dir>0?HEART:'var(--ink)';
 return '<div class="row pair'+(off?' off':'')+'" style="--c:'+x.c+';--lc:'+x.c+';--rc:'+HEART+';--sc:'+sc+'"><div class="ln">'
  +'<span class="pole'+(dir<0?' lit':'')+'">'+badge(r)+'<span class="nmL">'+esc(x.t)+'</span></span>'
  +'<span class="lw">'+(dir<0?svg(CH.l,''):'')+'<b class="fg">'+(off?'':f+'%')+'</b>'+(dir>0?svg(CH.r,''):'')+'</span>'
  +'<span class="pole r'+(dir>0?' lit':'')+'">'+esc(x.opp)+'</span></div>'
  +'<div class="tk"><i class="h l"></i><i class="h r"></i>'
  +(off?'':(tip<50?'<i class="fl l" style="width:'+(50-tip)+'%"></i>':'<i class="fl r" style="width:'+(tip-50)+'%"></i>'))
  +'<i class="mid"></i>'+(off?'':'<i class="needle" style="left:'+tip+'%"></i>')+'</div></div>';}

/* C. TWO AMOUNTS FROM ONE ZERO. What is held fills left from the spine, what
   is installed fills right from it, each out of all of it, which is what the
   engine computes and nothing else. The figures sit outside the track at the
   end each fill heads toward. The end icons are drawn, and lit by the
   engine's own verdict: the pattern's icon while charge is left after the
   opposite (sq), the opposite's icon once the opposite is ahead (pole), and
   neither when neither is. A row with no opposite keeps the spine where every
   other row has it and has no right half at all. */
function lit(x){return x.sq>=0.05&&x.sq>=x.pole?'l':(x.pole>=0.05&&x.pole>x.sq?'r':'');}
function rowC(r,off,big){
 var x=R(r), L=off?'':lit(x);
 var fig=function(v,s){return '<span class="fg '+s+'">'+(v?Math.round(v)+'%':'')+'</span>';};
 var say=off?x.t+', not read yet.':x.t+', '+(x.lp?'held '+Math.round(x.lp)+' per cent':'nothing held')
  +(x.solo?'':(x.rp?', '+x.opp+' installed '+Math.round(x.rp)+' per cent':', nothing installed'))
  +(L==='l'?', charge left after the opposite.':L==='r'?', the opposite is ahead.':', nothing left either way.');
 return '<div class="row'+(off?' off':'')+(x.solo?' solo':'')+'" style="--c:'+x.c+'" role="img" aria-label="'+esc(say)+'">'
  +'<div class="nm"><span class="nl">'+badge(r)+'<b>'+esc(x.t)+'</b></span><span class="nr'+(L==='r'?' lit':'')+'">'+esc(x.opp)+'</span></div>'
  /* NOTHING READ, NOTHING DRAWN. A profile with nothing entered gets the
     codex, the names and their opposites, and no empty track under each one:
     112 empty tracks said "neutral" in A and are 8,000 pixels of nothing. */
  +(off?'</div>':'<div class="tl">'+svg(D.strike.cl,'si'+(L==='l'?' lit':''),'--sc:'+x.c)+fig(off?0:x.lp,'l')
  +'<span class="hf l"><i data-w="'+(off?0:x.lp)+'" style="width:'+(big?0:(off?0:x.lp))+'%"></i></span><span class="sp"></span>'
  +(x.solo?'<span></span><span></span><span></span>'
   :'<span class="hf r"><i data-w="'+(off?0:x.rp)+'" style="width:'+(big?0:(off?0:x.rp))+'%"></i></span>'+fig(off?0:x.rp,'r')+svg(D.strike.op,'si'+(L==='r'?' lit':''),'--sc:'+HEART))
  +'</div></div>');}

function deck(p,fn){
 var off=unread(p), h='', cur='';
 p.rows.forEach(function(r){if(r[0]!==cur){cur=r[0];h+='<div class="seat" style="color:'+(D.seatC[cur]||'var(--ink)')+'">'+esc(cur)+'<span>'+esc(LINE[cur]||'')+'</span></div>';}
  h+=fn(r,off);});
 return h;}
var HOW={
 A:'The address deck as wired on this branch, copied from kbpCss and poleDualBar. The percent sits inside its own fill. The two end icons are set to colour but not to stroke, which is how they ship.',
 B:'r1\'s pair: a track with a line at 50, one mark, the figure over the line. An address has no one figure split two ways, so the mark sits at the build\'s own poleTip, and the figure is how far toward the lit side.',
 C:'Two amounts from one zero. Held fills left from the gap, installed fills right, each out of all of it. Figures sit outside the track. The lit icon is the engine\'s own verdict: charge left, or the opposite ahead.'};
var NAME={A:'A. As built on this branch',B:'B. r1\'s pair, ported',C:'C. Two amounts, one zero'};
function draw(){
 var q=/[?&]who=(\w+)/.exec(location.search), v=/[?&]v=([ABC])/.exec(location.search);
 var who=q?q[1]:'Derek', view=v?v[1]:'C';
 var p=D.people.filter(function(x){return x.nm.toLowerCase()===who.toLowerCase();})[0]||D.people[0];
 document.getElementById('who').innerHTML=D.people.map(function(x){
  return '<a class="chip'+(x===p?' on':'')+'" href="?who='+x.nm.toLowerCase()+'&v='+view+'">'+esc(x.nm==='You'?'Nothing entered':x.nm)+'</a>';}).join('');
 document.getElementById('vsw').innerHTML=['A','B','C'].map(function(k){
  return '<a class="chip'+(k===view?' on':'')+'" href="?who='+p.nm.toLowerCase()+'&v='+k+'">'+NAME[k]+'</a>';}).join('');
 document.getElementById('cols').innerHTML=['A','B','C'].map(function(k){
  return '<section class="col '+k+(k===view?' on':'')+'"><h2>'+NAME[k]+'</h2><p class="how">'+esc(HOW[k])+'</p>'
   +deck(p,k==='A'?rowA:k==='B'?rowB:rowC)+'</section>';}).join('');
 /* the drill head, for Derek's Possession, which is the row that tests a
    design hardest: held 46, installed 72, nothing left */
 var dk=D.people.filter(function(x){return x.nm==='Derek';})[0], pr=dk.rows.filter(function(r){return r[1]==='Possession';})[0], x=R(pr);
 document.getElementById('drill').innerHTML='<div class="eye">Root</div><div class="an">Possession</div><div class="sub">'+esc(x.nerve)+'</div>'
  +'<div class="C">'+rowC(pr,false,true)+'</div>'
  +'<p>Held here <b>'+Math.round(x.lp)+' per cent</b>. '+esc(x.opp)+' installed <b>'+Math.round(x.rp)+' per cent</b>. Left after that, <b>'+(x.sq<0.05?'none':Math.round(x.sq*10)+' per cent')+'</b>.</p>';
 requestAnimationFrame(function(){requestAnimationFrame(function(){
  document.querySelectorAll('#drill .hf>i').forEach(function(i){i.style.width=i.getAttribute('data-w')+'%';});});});}
draw();
