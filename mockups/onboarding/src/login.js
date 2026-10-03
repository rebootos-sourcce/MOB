/* login.js. Three login directions on one form. Username first. */
(function(){
var DIR=document.body.className.trim();
var H=setHash()||'signin';
var S={mode:H==='create'?'create':'login',u:'',p:0,err:H==='error',dev:H==='dev',ok:H==='confirm',show:false};
if(H==='filled'||H==='error'||H==='confirm'){S.u='mika.salas';S.p=14;}
if(H==='create'){S.u='mika.salas';S.p=16;}
var HEAD={A:'There is more running you than you can see.',B:'This is a mirror.',C:'This is your field. Let’s see what’s running.'};
var SUB={login:'Log in and your field opens where you left it.',create:'Pick a username. It is the only name this needs.'};
var W=innerWidth,Ht=innerHeight,M=W<=700;

function formHTML(){
 return '<div class="seg" role="group" aria-label="Log in or create an account">'
  +'<button type="button" data-m="login">Log in</button><button type="button" data-m="create">Create account</button></div>'
  +'<div class="lg-fields">'
  +'<label class="fld u"><span class="fl"><i class="dot" style="--c:var(--throat)"></i>Username</span>'
  +'<input id="u" autocomplete="username" autocapitalize="none" spellcheck="false" value="'+S.u+'"><span class="av">'+ico('check',20)+'Free</span></label>'
  +'<label class="fld p"><span class="fl"><i class="dot" style="--c:var(--root)"></i>Passphrase</span>'
  +'<input id="p" type="password" autocomplete="current-password" value="'+Array(S.p+1).join('x')+'"><button type="button" class="show" aria-label="Show passphrase">Show</button>'
  +'<span class="hint" id="hint"></span></label>'
  +'</div>'
  +'<p class="msg" id="msg" role="status"></p>'
  +'<div class="lg-acts"><button type="button" class="btn pri" id="go">Log in</button></div>'
  +'<div class="lg-guest"><button type="button" class="btn ghost" id="guest">'+ico('guest',20)+'Guest</button>'
  +'<span class="small">Try it on this device. Nothing is saved to an account.</span></div>';}
function devHTML(){
 return '<div class="dev'+(S.dev?' open':'')+'" id="dev"><div class="dev-p"><span class="eyebrow">Developer options</span>'
  +'<label>Onboarding<span class="sw on"></span></label><label>Tutorial<span class="sw"></span></label></div>'
  +'<button type="button" class="dev-b" id="devb" aria-expanded="'+S.dev+'">'+ico('gear',16)+'Developer options</button></div>';}

var root=document.createElement('div');root.className='stage';document.body.appendChild(root);
var fieldHost=document.createElement('div');fieldHost.className='fieldbg';root.appendChild(fieldHost);

if(DIR==='A'){
 root.insertAdjacentHTML('beforeend','<div class="lg"><div class="lg-top">'+mark()+'</div><h1 class="lg-h">'+HEAD.A+'</h1>'+formHTML()+'</div>');
}else if(DIR==='B'){
 root.insertAdjacentHTML('beforeend','<div class="bigline">'+mark()+'</div><div class="bigtext"><h1>'+HEAD.B+'</h1><p id="sub"></p></div><div class="lg"><h1 class="lg-h">.</h1>'+formHTML()+'</div>');
}else{
 root.insertAdjacentHTML('beforeend','<div class="top">'+mark()+'<h1>'+HEAD.C+'</h1><div class="lg">'+formHTML()+'</div></div>');
}
root.insertAdjacentHTML('beforeend',devHTML());

/* ---------- the field, per direction ---------- */
var F={};
function buildA(){
 var cx=W/2,cy=Ht/2,r=M?98:Math.min(W,Ht)*.335; if(M){cy=140;}
 var rc=r-16, L=Math.PI*rc;
 F.cx=cx;F.cy=cy;F.r=r;F.rc=rc;F.L=L;
 var svg='<svg viewBox="0 0 '+W+' '+Ht+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
  +'<g id="ring" class="breathe">'+fieldRing({cx:cx,cy:cy,r:r,tl:M?8:11})+'</g>'
  +'<circle id="rc" cx="'+cx+'" cy="'+cy+'" r="'+rc+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1"/>'
  +'<path id="cl" d="'+arcPath(cx,cy,rc,270,90)+'" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="'+L+'" stroke-dashoffset="'+L+'"/>'
  +'<path id="cr" d="'+arcPath(cx,cy,rc,270,450).replace(/ 0 [01] 1 /,' 0 0 0 ')+'" fill="none" stroke="'+ACC+'" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="'+L+'" stroke-dashoffset="'+L+'"/>'
  +'<g id="err" opacity="0"></g>'
  +'<g id="nu" opacity="0"><circle cx="'+cx+'" cy="'+(cy-rc)+'" r="8" fill="#0C0D12" stroke="'+ACC+'" stroke-width="2"/><circle cx="'+cx+'" cy="'+(cy-rc)+'" r="2.6" fill="'+ACC+'"/></g>'
  +'<g id="nb" opacity="0.5"><circle cx="'+cx+'" cy="'+(cy+rc)+'" r="5" fill="#0C0D12" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/></g>'
  +'</svg>';
 fieldHost.innerHTML=svg;
 var cr=$('#cr');
 var top=polar(cx,cy,rc,270),bot=polar(cx,cy,rc,90);
 cr.setAttribute('d','M'+f(top[0])+' '+f(top[1])+' A'+rc+' '+rc+' 0 0 1 '+f(bot[0])+' '+f(bot[1]));
 var cl=$('#cl');cl.setAttribute('d','M'+f(top[0])+' '+f(top[1])+' A'+rc+' '+rc+' 0 0 0 '+f(bot[0])+' '+f(bot[1]));
}
function reactA(){
 var L=F.L,p=Math.min(S.p,20)/20,tr='stroke-dashoffset .9s ease-out';
 $('#nu').setAttribute('opacity',S.u?1:0);
 var show=S.ok?1:(S.err?.6:p);
 $('#cl').style.transition=$('#cr').style.transition=tr;
 $('#cl').style.strokeDashoffset=$('#cr').style.strokeDashoffset=L*(1-show);
 var e=$('#err');
 if(S.err){
  var a=polar(F.cx,F.cy,F.rc,270-180*.6*1)  // where the path stops
  ,pt=polar(F.cx,F.cy,F.rc,162);
  var left=polar(F.cx,F.cy,F.rc,270-108); // 108 degrees round from the top on the left side
  var x=left[0],y=left[1],R=F.rc;
  var b1=[x-62,y-48],b2=[x-70,y+44];
  e.innerHTML='<path d="M'+f(x)+' '+f(y)+' L'+f(b1[0])+' '+f(b1[1])+'" stroke="'+MID+'" stroke-width="1.5" stroke-dasharray="3 5" fill="none" stroke-linecap="round"/>'
   +'<path d="M'+f(x)+' '+f(y)+' L'+f(b2[0])+' '+f(b2[1])+'" stroke="'+MID+'" stroke-width="1.5" stroke-dasharray="3 5" fill="none" stroke-linecap="round"/>'
   +'<path d="M'+f(x-9)+' '+f(y-9)+' L'+f(x+9)+' '+f(y+9)+'" stroke="'+ALARM+'" stroke-width="2.6" stroke-linecap="round"/>'
   +'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="11" fill="none" stroke="'+ALARM+'" stroke-width="1.6"/>';
  e.setAttribute('opacity',1);
 }else e.setAttribute('opacity',0);
 // confirm: every tick reads full, the ring closes
 var ring=$('#ring');
 ring.classList.toggle('breathe',!S.ok);
 if(S.ok){ring.innerHTML=fieldRing({cx:F.cx,cy:F.cy,r:F.r,lit:[0,1,2,3,4,5,6],tl:M?8:11});ring.style.opacity=1;}
 else ring.innerHTML=fieldRing({cx:F.cx,cy:F.cy,r:F.r,tl:M?8:11});
 $('#nb').setAttribute('opacity',S.p?0:.6);
}

function buildB(){
 var x1=M?W:W*.56;
 fieldHost.innerHTML='<svg viewBox="0 0 '+W+' '+Ht+'" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="'+x1+'" y2="0"><stop offset="0" stop-color="#000"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="wm" maskUnits="userSpaceOnUse" x="0" y="0" width="'+W+'" height="'+Ht+'"><rect x="0" y="0" width="'+x1+'" height="'+Ht+'" fill="url(#fade)"/></mask></defs><g id="wv" mask="url(#wm)"></g><g id="wl"></g></svg>';
}
var BT=0;
function drawB(){
 var x0=0,x1=M?W:W*.56,y0=M?200:120,y1=M?350:Ht-340;
 var out='',lab='',n=7,step=(y1-y0)/(n-1);
 for(var k=6;k>=0;k--){ // crown at the top, root at the bottom
  var row=6-k,y=y0+row*step;
  var act=(k===4&&S.u)||(k===0&&S.p>0);
  var amp=S.ok?0:(act?(M?10:26):(M?3:7));
  if(S.err&&k===0)amp=M?12:30;
  var Lw=(M?160:340)+k*34, ph=BT*(.2+k*.02)+k*1.3;
  var d='';
  for(var x=x0;x<=x1;x+=6){
   var edge=Math.min(1,(x-x0)/120,(x1-x)/160);
   var yy=y+Math.sin(x/Lw*6.283+ph)*amp*Math.max(.25,edge);
   d+=(x===x0?'M':'L')+f(x)+' '+f(yy);}
  var op=S.ok?.9:(act?.95:.62);
  out+='<path d="'+d+'" fill="none" stroke="'+SEATS[k].c+'" stroke-width="'+(act?2.6:1.8)+'" opacity="'+op+'" stroke-linecap="round"/>';
  if(act&&!S.ok){
   var nm=k===4?'Throat':'Root';
   lab+='<text x="'+f(x1+14)+'" y="'+f(y+4)+'" fill="'+SEATS[k].c+'" font-size="13" font-weight="600" font-family="Inter,sans-serif">'+nm+'</text>';
  }
  if(S.err&&k===0)lab+='<circle cx="'+f(x1-30)+'" cy="'+f(y)+'" r="8" fill="none" stroke="'+ALARM+'" stroke-width="1.8"/><path d="M'+f(x1-36)+' '+f(y-6)+' L'+f(x1-24)+' '+f(y+6)+'" stroke="'+ALARM+'" stroke-width="2.4" stroke-linecap="round"/>';
 }
 $('#wv').innerHTML=out;$('#wl').innerHTML=lab;
}
function reactB(){drawB();}

function buildC(){
 var cols=16,rows=7,x0=M?24:140,x1=W-(M?24:140),yTop=M?Ht-250:Ht*.56,yBot=M?Ht-64:Ht-92;
 var dx=(x1-x0)/(cols-1),dy=(yBot-yTop)/(rows-1);F.C={cols:cols,rows:rows,x0:x0,dx:dx,yBot:yBot,dy:dy};
 var out='<svg viewBox="0 0 '+W+' '+Ht+'" preserveAspectRatio="none" aria-hidden="true"><g id="lat"></g></svg>';
 fieldHost.innerHTML=out;
}
function reactC(){
 var c=F.C,out='',r,i;
 for(r=0;r<c.rows;r++){
  var y=c.yBot-r*c.dy,seat=SEATS[r];
  var litN=(r===4)?Math.min(S.u.length,16):(r===0?Math.min(S.p,16):0);
  if(S.ok)litN=16;
  if(!M||true){out+='<text x="'+(c.x0-(M?0:28))+'" y="'+f(y-(M?10:-4))+'" text-anchor="'+(M?'start':'end')+'" font-size="'+(M?10:11)+'" fill="'+(litN?seat.c:DIM)+'" opacity="'+(litN?1:.7)+'" font-family="Inter,sans-serif" font-weight="600">'+(M?'':seat.n)+'</text>';}
  for(i=0;i<c.cols;i++){
   var x=c.x0+i*c.dx,on=i<litN;
   var alarm=S.err&&r===0&&i===litN-1;
   out+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+(on?(M?5:7):(M?3.2:4.2))+'" fill="'+(on?'#0C0D12':'none')+'" stroke="'+(alarm?ALARM:seat.c)+'" stroke-width="'+(on?2.2:1.3)+'" opacity="'+(on?1:.38)+'"/>';
   if(on)out+='<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+(M?1.6:2.2)+'" fill="'+(alarm?ALARM:seat.c)+'"/>';
  }
  if(r===4||r===0){ // the path that joins a lit row
   if(litN>1)out+='<path d="M'+f(c.x0)+' '+f(y)+' L'+f(c.x0+(litN-1)*c.dx)+' '+f(y)+'" stroke="'+seat.c+'" stroke-width="1.4" opacity=".75"/>';
  }
 }
 $('#lat').innerHTML=out;
}

if(DIR==='A')buildA();else if(DIR==='B')buildB();else buildC();

/* ---------- state to screen ---------- */
function paint(){
 var cr=S.mode==='create';
 $$('.seg button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-m')===S.mode);});
 $('#go').textContent=cr?'Create account':'Log in';
 $('#hint').textContent=cr?'Four words or more. Easy to say, hard to guess.':'';
 $('.fld.u').classList.toggle('has-av',cr&&S.u.length>2);
 var m=$('#msg');
 if(S.err){m.className='msg bad';m.innerHTML=ico('stop',20,'','style="color:#FF6A5C"')+'That username and passphrase do not match.';
  $('.fld.p').classList.add('bad');}
 else{m.className='msg';m.textContent=S.ok?'Opening your field.':'';$('.fld.p').classList.remove('bad');}
 var sub=$('#sub');if(sub)sub.textContent=SUB[S.mode];
 if(DIR==='A')reactA();else if(DIR==='B')reactB();else reactC();
}
root.addEventListener('click',function(e){
 var t=e.target.closest('button');if(!t)return;
 if(t.getAttribute('data-m')){S.mode=t.getAttribute('data-m');S.err=false;paint();}
 if(t.id==='devb'){S.dev=!S.dev;$('#dev').classList.toggle('open',S.dev);t.setAttribute('aria-expanded',S.dev);}
 if(t.classList.contains('show')){S.show=!S.show;$('#p').type=S.show?'text':'password';t.textContent=S.show?'Hide':'Show';}
 if(t.id==='go'){if(S.u&&S.p){S.err=(S.mode==='login'&&S.u!=='mika.salas');S.ok=!S.err;}paint();}
 if(t.id==='guest'){S.ok=true;paint();}
});
root.addEventListener('input',function(e){
 if(e.target.id==='u'){S.u=e.target.value;S.err=false;S.ok=false;}
 if(e.target.id==='p'){S.p=e.target.value.length;S.err=false;S.ok=false;}
 paint();});
if(DIR==='B'){
 (function loop(){
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){BT+=.012;drawB();requestAnimationFrame(loop);}
 })();}
paint();
addEventListener('resize',function(){location.reload();});
})();
