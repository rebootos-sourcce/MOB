
/* ================================================================ stage, state, layout */
var stage=$('#stage'), cv=$('#cv'), ctx=cv.getContext('2d');
var W=0,H=0,DPR=1,STILL=false;
var S={act:'login',t:0,mask:0,rate:1,speed:1,mul:1,last:0,cues:[],card:null,outDone:false,
 mode:'account',door:'login',pick:null,feel:null,place:-1,words:'',skipStory:false,lex:null,fixes:[],
 breathOn:false,ringT:0,tableQ:false,stop:false,stopv:'direct',live:false,bead:null,dw:null,figT:0,
 lastBack:-9,width:'fit',end:'',sealed:0,answered:'',sigQ:false,made:false,mark:null,hover:-1,mood:null,trace:[],bodyA:0,bodyD:0,asked:false};
/* POSE is the Field's stage: the figure's centre and height, and the ring's two radii. */
var POSE={cur:{cx:0,cy:0,h:0,rx:0,ry:0},from:null,to:null,t:0,dur:.42};
var DECK={};
function trace(ev,id){if(S.trace.length<4000)S.trace.push({ev:ev,id:id,t:performance.now()});}

/* The poses. Each is a pure function of the stage size, so a resize or a rotation re-solves them. h is the figure's
   height in px; rx and ry are the ring's radii. The ring is a circle in most poses and an ellipse round the body. */
function P(cx,cy,h,rx,ry){return {cx:cx,cy:cy,h:h,rx:rx,ry:ry==null?rx:ry};}
function lay(kind){
 var nar=W<=700, sho=H<=480&&W>H, h;
 if(kind==='arrive'||kind==='settle'){
  if(sho){h=Math.min(.7*H,300);return P(.27*W,.5*H,h,.56*h);}
  h=nar?clamp(.30*H,200,300):clamp(.34*H,220,340);return P(W/2,(nar?.36:.40)*H,h,Math.min(.56*h,W/2-36));}
 if(kind==='ask'){
  if(nar){h=clamp(.22*H,120,200);return P(W/2,.26*H,h,.56*h);}
  h=clamp(.2*H,160,220);return P(W/2,.56*H,h,.56*h);}
 if(kind==='body'){
  if(nar){h=Math.min(.62*H,520);return P(W/2,.5*H+24,h,Math.min(.4*W,150),Math.min(.28*H,240));}
  h=Math.min(.58*H,580);return P(W/2,.54*H,h,Math.min(.24*W,330),.34*H);}
 if(kind==='side'){
  if(nar){h=140;return P(W/2,56+.56*h+8,h,.56*h);}
  h=clamp(.42*H,300,440);return P(.27*W,.5*H,h,.56*h);}
 if(kind==='rel'){
  if(nar)return P(W/2,.5*H,200,W/2-16,.44*H);
  return P(W/2,.5*H,260,Math.min(.46*H,.4*W),.46*H);}
 if(kind==='reel'){
  if(sho){h=Math.min(.7*H,300);return P(.27*W,.5*H,h,.56*h);}
  h=clamp(.34*H,220,340);return P(W/2,.40*H,h,Math.min(.56*h,W/2-52));}
 if(kind==='top'){
  h=H<560?72:(nar?96:150);var cy=nar||H<560?24+h/2:Math.max(30+h/2,.16*H);return P(W/2,cy,h,.56*h);}
 return P(W/2,H/2,200,112);}
function tickLen(g){return Math.max(6,Math.min(g.rx,g.ry)*.075);}
function seatXY(p,i){var s=p.h/178;return {x:p.cx,y:p.cy+(160-20*i-89)*s};}

function setPose(to,dur,snap){
 if(snap||STILL||!POSE.cur.h){POSE.cur=to;POSE.to=null;return;}
 var c=POSE.cur;POSE.from={cx:c.cx,cy:c.cy,h:c.h,rx:c.rx,ry:c.ry};POSE.to=to;POSE.t=0;POSE.dur=dur||.42;}
function stepPose(dt){
 if(!POSE.to)return;
 POSE.t+=dt;var u=clamp(POSE.t/POSE.dur,0,1),e=EOUT(u),f=POSE.from,t=POSE.to;
 var dx=t.cx-f.cx,dy=t.cy-f.cy,d=Math.sqrt(dx*dx+dy*dy)||1,bend=.12*d*Math.sin(Math.PI*e);   /* travel is bent 12 percent: an arc, not a line */
 POSE.cur={cx:lerp(f.cx,t.cx,e)+(-dy/d)*bend,cy:lerp(f.cy,t.cy,e)+(dx/d)*bend,h:lerp(f.h,t.h,e),rx:lerp(f.rx,t.rx,e),ry:lerp(f.ry,t.ry,e)};
 if(u>=1){POSE.cur=t;POSE.to=null;}}

/* A tween read off the clock. Under reduced motion every move is its end state at the cue time. */
function tw(t,t0,d,e){if(STILL)return t>=t0?1:0;var u=clamp((t-t0)/d,0,1);return (e||EOUT)(u);}

/* ================================================================ decks and cues
   A card is one block of text. Its words are wrapped so they can rise on an arc, one after another (stagger 70 ms,
   capped so a long line is a flow and not a list being read out). In: opacity 320 ms out, translate (x) 420 ms arc curve,
   transform (y) 420 ms out. Out: all words together, 220 ms in, drifting up. Reveal roots (.rv) number their own words. */
function stag(card){
 var roots=[card].concat($$('.rv',card));
 roots.forEach(function(root){
  var tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[],x,i=0;
  while((x=tw.nextNode())){
   if(!x.nodeValue.trim())continue;
   var p=x.parentNode;if(p.closest('button,textarea,input,label,.nostag'))continue;
   var near=p.closest('.rv');if((near||card)!==root)continue;
   L.push(x);}
  L.forEach(function(t){var f=document.createDocumentFragment();
   t.nodeValue.split(/(\s+)/).forEach(function(s){if(!s)return;
    if(/^\s+$/.test(s))f.appendChild(document.createTextNode(s));
    else{var e=document.createElement('span');e.className='w';e.style.setProperty('--w',i++);e.textContent=s;f.appendChild(e);}});
   t.parentNode.replaceChild(f,t);});
  root.style.setProperty('--st',(i>1?Math.min(70,560/(i-1)):0).toFixed(1)+'ms');});}
function Deck(id){this.el=$('#'+id);this.cur=null;}
Deck.prototype.show=function(html,nt){
 var n=document.createElement('div');n.className='card'+(nt?' nt':'');n.innerHTML=html;stag(n);n.dataset.beat=S.act;this.el.appendChild(n);
 var old=this.cur;this.cur=n;if(old)this._out(old);
 trace('in',S.act);
 if(nt)n.classList.add('in');else{void n.offsetWidth;requestAnimationFrame(function(){n.classList.add('in');});}
 return n;};
Deck.prototype._out=function(n){trace('out',n.dataset.beat);n.classList.remove('in');n.classList.add('out');setTimeout(function(){if(n.parentNode)n.parentNode.removeChild(n);},260);};
Deck.prototype.hide=function(){if(this.cur){this._out(this.cur);this.cur=null;}};
Deck.prototype.clear=function(){this.el.innerHTML='';this.cur=null;};
function cue(t,f){S.cues.push({t:t,f:f,done:false});}
function runCues(){for(var i=0;i<S.cues.length;i++){var c=S.cues[i];if(!c.done&&S.t>=c.t){c.done=true;c.f();}}}
function say(t){$('#live').textContent=t;}
