/* ============================================================
   ROOT ICONS AND ICON COLOUR. Prototype overlay, round DR, 26 September.
   Laid over the committed build by build.js. Nothing under atuned_src/ is
   touched and nothing here is product code.

   Two asks from the owner, both in TASKS.md section DR:
     "I need icons for Architect, Engine, Weaver, Witness, I don't know why
      those don't have icons."
     "All our normal icons under Blueprint Domains, Primary, I think we want
      those punched up a little more, more saturated, they're just a little
      dull."

   STATE is in the hash so every picture can be reproduced by its address:
     g=none|rec|alt        the root glyphs: shipped (none), recommended, alternate
     c=ship|a|b|c          icon colour: shipped, A dim off, B plus 15, C plus 30
     s=0|1                 archetypes wear their seat (1) or the one accent (0)
     l=<lighting key>      dark, snow, punch, glass, glasswhite, flat, lumen
   ============================================================ */
(function(){
/* ---- colour arithmetic. sRGB <-> OKLCH, and a gamut clamp that gives up
   chroma, never hue or lightness, which is what CSS Color 4 asks of a
   browser and what Chromium does not yet do for relative colours. ---- */
function hex2rgb(h){h=h.replace('#','');return [0,2,4].map(function(i){return parseInt(h.substr(i,2),16)/255;});}
function lin(v){return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
function unlin(v){return v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055;}
function rgb2oklch(rgb){
 var r=lin(rgb[0]),g=lin(rgb[1]),b=lin(rgb[2]);
 var l=Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b);
 var m=Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b);
 var s=Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b);
 var L=0.2104542553*l+0.7936177850*m-0.0040720468*s;
 var A=1.9779984951*l-2.4285922050*m+0.4505937099*s;
 var B=0.0259040371*l+0.7827717662*m-0.8086757660*s;
 return [L,Math.sqrt(A*A+B*B),(Math.atan2(B,A)*180/Math.PI+360)%360];}
function oklch2rgbRaw(L,C,H){
 var a=C*Math.cos(H*Math.PI/180),b=C*Math.sin(H*Math.PI/180);
 var l=Math.pow(L+0.3963377774*a+0.2158037573*b,3);
 var m=Math.pow(L-0.1055613458*a-0.0638541728*b,3);
 var s=Math.pow(L-0.0894841775*a-1.2914855480*b,3);
 return [4.0767416621*l-3.3077115913*m+0.2309699292*s,
  -1.2684380046*l+2.6097574011*m-0.3413193965*s,
  -0.0041960863*l-0.7034186147*m+1.7076147010*s].map(unlin);}
function inGamut(c){return c.every(function(v){return v>=-1e-4&&v<=1+1e-4;});}
function oklch2hex(L,C,H){
 var c=oklch2rgbRaw(L,C,H);
 if(!inGamut(c)){var lo=0,hi=C;for(var i=0;i<24;i++){var mid=(lo+hi)/2;
  if(inGamut(oklch2rgbRaw(L,mid,H)))lo=mid;else hi=mid;} c=oklch2rgbRaw(L,lo,H);}
 return '#'+c.map(function(v){v=Math.round(Math.max(0,Math.min(1,v))*255);
  return (v<16?'0':'')+v.toString(16);}).join('').toUpperCase();}
/* chroma times k, hue and lightness held */
function lift(hex,k){if(!/^#[0-9a-f]{6}$/i.test(hex)||k===1)return hex;
 var o=rgb2oklch(hex2rgb(hex));return oklch2hex(o[0],o[1]*k,o[2]);}

/* THE OPTIONS, and why exposure is separated from saturation. The resting
   veil is most of the dullness: a stroke at opacity .78 is mixed 22 percent
   into the tile under it, which lowers chroma and contrast together, and no
   colour choice upstream survives that. Measured on Dark, effective OKLCH
   chroma of the nineteen domain icons is 0.103 as shipped against 0.125 in
   the tokens themselves. So A takes the veil off and changes no colour at
   all. B and C then multiply chroma in OKLCH, hue and lightness held,
   clamped into sRGB by giving up chroma. */
var OPT={ship:{k:1,op:null},a:{k:1,op:1},b:{k:1.15,op:1},c:{k:1.30,op:1}};

/* WHICH SEAT EACH ROOT WEARS, from DESIGN.md: "Architect wears 3rd Eye,
   Engine wears Sacral, Weaver wears Heart, Witness wears Crown." ROOTCOL is
   those four written out once, as the dark palette, so on the paper
   lightings the domain tiles are still drawn in colours meant for a black
   panel. seatCol already knows each lighting's palette; routing the root
   through it is the fix, and on Dark it changes nothing. */
var ROOTSEAT={Architect:'3rd Eye',Engine:'Sacral',Weaver:'Heart',Witness:'Crown'};
/* AND GLASS WHITE IS PAPER. seatCol maps snow to the light palette and
   lumen to the vivid one and hands every other lighting the dark palette,
   so on Glass white, a white ground, the rail is drawn in colours meant for
   a black panel: 1.59 to 1 on Connection, measured off the pixels. The
   prototype routes Glass white to the light palette; the move in the
   product is one more arm in seatCol. */
function seatColLit(b){return S.theme==='glasswhite'?(PAL_LIGHT[b]||seatCol(b)):seatCol(b);}
function rootCol(r,opt){return opt==='ship'?ROOTCOL[r]:seatColLit(ROOTSEAT[r]);}
function accentHex(){
 var v=getComputedStyle(document.body).getPropertyValue('--accent').trim();
 return /^#[0-9a-f]{6}$/i.test(v)?v:GOLD;}

var ST={g:'rec',c:'a',s:'0',l:'dark'};
function readHash(){(location.hash||'').replace(/^#/,'').split('&').forEach(function(kv){
 var p=kv.split('=');if(p.length===2&&p[0] in ST)ST[p[0]]=p[1];});}
function writeHash(){history.replaceState(null,'','#'+Object.keys(ST).map(function(k){return k+'='+ST[k];}).join('&'));}

function glyphs(){
 var set=ST.g==='none'?null:RI_GLYPH[ST.g];
 document.querySelectorAll('#roots .rootb').forEach(function(b){
  var r=b.dataset.r;
  if(!set){b.classList.remove('ri');b.textContent=r;return;}
  var d=set[r]||RI_GLYPH.rec[r];
  b.classList.add('ri');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+d+'"/></svg><span>'+r+'</span>';});}
function colours(){
 var o=OPT[ST.c]||OPT.ship;
 document.body.classList.toggle('ri-lift',o.op===1);
 document.querySelectorAll('#doms .ib').forEach(function(b,i){
  b.style.setProperty('--c',lift(rootCol(DOMAINS[i].r,ST.c),o.k));
  var dot=b.querySelector('.rt');if(dot)dot.style.background=lift(rootCol(DOMAINS[i].r,ST.c),o.k);});
 ['ar1','ar2'].forEach(function(id){
  document.querySelectorAll('#'+id+' .ib').forEach(function(b,i){
   var base=ST.s==='1'?(ST.c==='ship'?seatCol(ARCH[i].b):seatColLit(ARCH[i].b)):accentHex();
   /* ROOT IS HELD. The alarm is reserved for something being wrong, and a
      chroma multiplier walks the Root seat toward it: OKLab distance from
      #FF2E1F is 0.082 as shipped, 0.060 at plus 15 and 0.043 at plus 30.
      Root is already the most chromatic seat at 0.168, so it keeps its
      shipped value on every option. Warrior and Everyman are the two it
      touches in this rail. */
   b.style.setProperty('--c',lift(base,(ST.s==='1'&&ARCH[i].b==='Root')?1:o.k));});});
 document.querySelectorAll('#roots .rootb').forEach(function(b){
  b.style.setProperty('--rc',lift(rootCol(b.dataset.r,ST.c),o.k));});}
/* the domain caption under the grid is text in the root's colour, written
   from ROOTCOL, so it carries the same dark palette onto paper. */
function capHtml(){var o=OPT[ST.c]||OPT.ship;
 return S.doms.map(function(i){var D=DOMAINS[i];
  return '<b style="color:'+lift(rootCol(D.r,ST.c),o.k)+'">'+D.nm+'</b>';}).join(' + ')
  +(S.roots.length?'<br>plus all of '+S.roots.join(', '):'');}
var shipCap=window.capD;
window.capD=function(){if(ST.c==='ship')return shipCap();var e=document.getElementById('capD');if(e)e.innerHTML=capHtml();};
function apply(){
 if(S.theme!==ST.l&&typeof setLighting==='function')setLighting(ST.l);
 glyphs();colours();syncSoul();writeHash();paintPanel();}

/* ---- the compare panel. Bottom right, clear of the rail it is comparing. */
var ROWS=[['g','Root icons',[['none','None, shipped'],['rec','Recommended'],['alt','Alternate']]],
 ['c','Icon colour',[['ship','Shipped'],['a','A, dim off'],['b','B, plus 15'],['c','C, plus 30']]],
 ['s','Archetypes',[['0','One accent, shipped'],['1','Wear their seat']]],
 ['l','Lighting',LIGHTINGS.map(function(t){return [t[0],t[1]];})]];
function paintPanel(){
 var p=document.getElementById('ri-panel');if(!p)return;
 p.querySelectorAll('button[data-k]').forEach(function(b){
  b.setAttribute('aria-pressed',ST[b.dataset.k]===b.dataset.v);});}
function mount(){
 var p=document.createElement('div');p.id='ri-panel';
 p.innerHTML='<div class="ri-hd"><b>Compare</b><button type="button" class="ri-min" aria-label="Fold the panel">Fold</button></div>'
  +ROWS.map(function(r){return '<div class="ri-row"><div class="ri-lb">'+r[1]+'</div><div class="ri-seg">'
   +r[2].map(function(o){return '<button type="button" data-k="'+r[0]+'" data-v="'+o[0]+'">'+o[1]+'</button>';}).join('')
   +'</div></div>';}).join('')
  +'<p class="ri-note">Prototype over the committed build. A takes off the resting dim and changes no colour. B and C also lift chroma 15 and 30 percent, hue and lightness held.</p>';
 document.body.appendChild(p);
 /* on a phone it opens folded, because open it covers half the rail it is
    there to compare */
 if(innerWidth<600){p.classList.add('min');p.querySelector('.ri-min').textContent='Open';}
 p.addEventListener('click',function(e){
  var b=e.target.closest('button');if(!b)return;
  if(b.classList.contains('ri-min')){p.classList.toggle('min');b.textContent=p.classList.contains('min')?'Open':'Fold';return;}
  ST[b.dataset.k]=b.dataset.v;apply();});
 /* the product's own lighting menu moves ST.l too, so a picture always
    carries its own address */
 var seg=document.getElementById('themes');
 if(seg)seg.addEventListener('click',function(){setTimeout(function(){ST.l=S.theme;colours();glyphs();syncSoul();writeHash();paintPanel();},0);});}

window.RI={apply:apply,mount:mount,ST:ST,readHash:readHash,lift:lift,rgb2oklch:rgb2oklch,hex2rgb:hex2rgb,rootCol:rootCol,OPT:OPT};
})();
