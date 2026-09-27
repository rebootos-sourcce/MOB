/* ============================================================
   THE ENERGETIC SUMMARY, Root Energetics read across. Named Root
   Energetics until GO in TASKS.md, when the second section of that
   name on the other rail was the thing that confused him; the
   left rail keeps the name. The summary at the head of the
   right rail. FV in TASKS.md, his words: "When I open root
   energetics, I want a summary of that on the right hand side, also
   at the very top closed. But what I want source to do is to take a
   look at all the behavioral energetics where they overlap, because
   that's the truth. And then use that as the summary. Where they
   don't align is the kind of fuzziness of it, the other ways it can
   be expressed."

   The left rail's Root Energetics lists what each system says. This
   says what they say together, off rootOverlap in engine/overlap.js,
   which is where the method and its honesty live: the only bridges
   are the ones the traditions supply, and a meeting is weighed
   against chance before it is called agreement. This file draws it.

   THE MEETINGS LEAD, THE RANGE FOLLOWS, and both are the reading.
   A meeting is a theme two or more systems reach on their own, said
   to the person in one line, with the systems that reached it lit in
   a band of four and the readings it is built from underneath. The
   range is everything else each system says, in its own words, under
   his own framing: other ways this shows up.

   HOW STRONG, IN WORDS, NEVER IN FIGURES. q is a probability and a
   probability printed at a person is a lab readout, which is his own
   objection on file. So the strength is said: they agree strongly,
   they agree, or a light overlap that many people have. The light
   case is most people, and the rail says so rather than dressing a
   common overlap up as the truth.

   BUILT ONCE PER READING. The section is rewritten only when what it
   reads changes, the person, their birth or their name, so the band's
   entrance runs when there is something new to show and not on every
   render. It sits closed on arrival, and the band fills as it opens,
   because a CSS animation runs from the moment its element is first
   drawn and a closed section's contents are not drawn.
   ============================================================ */
var RSUM_SIG=null;
function rsIc(g,cls){return '<svg class="'+(cls||'rs-ic')+'" viewBox="0 0 24 24" aria-hidden="true">'+g+'</svg>';}
/* the mark a theme is drawn with: its planet, or its element as the Summary's
   own spiritual layer draws the five */
function rsThemeIc(a){return a.voc==='pl'?PLANETGLYPH[a.t]:((typeof CELEM_IC!=='undefined'&&CELEM_IC[a.t])||'');}
/* a reading, named the way a person says it */
function rsName(x){
 if(x.sys==='W')return x.v+' '+x.k;
 if(x.sys==='E')return x.k==='year'?x.v+' year':'Year of the '+x.v;
 if(x.sys==='N')return ((typeof NUM_LABEL!=='undefined'&&NUM_LABEL[x.k])||x.k)+' '+x.v;
 if(x.k==='profile')return 'Profile '+x.v;
 return 'Design gate '+x.v;}
/* the chips under a meeting. The design gate's two trigrams are one reading,
   so a meeting both of them reach names the gate once with both pictures */
function rsChips(a){
 var out=[], gates={};
 a.hits.forEach(function(x){
  if(x.sys!=='D'){out.push({sys:x.sys,t:rsName(x)});return;}
  (gates[x.v]=gates[x.v]||[]).push(x);});
 Object.keys(gates).forEach(function(g){var h=gates[g], up=h.filter(function(x){return x.part==='upper';})[0],
  lo=h.filter(function(x){return x.part==='lower';})[0];
  out.push({sys:'D',t:'Design gate '+g+', '+(up&&lo?up.img+' over '+lo.img
   :(up||lo).img+((up||lo).part==='upper'?' above':' below'))});});
 return out.map(function(c){
  return '<span class="rs-chip" data-tip-t="'+esc(SYSNAME[c.sys])+'" data-tip="'+esc(c.t)+'">'
   +rsIc(SYSGLYPH[c.sys])+'<span>'+esc(c.t)+'</span></span>';}).join('');}
/* what a reading says, in the table that reading already has */
function rsSays(x){
 if(x.sys==='W')return SIGN_RUNS[x.v]||'';
 if(x.sys==='E')return x.k==='year'?(CE_RUNS[x.v]||''):(CH_RUNS[x.v]||'');
 if(x.sys==='N')return x.k==='lifePath'?(LP_RUNS[x.v]||''):(numSays(x.k,x.v)||'');
 if(x.k==='profile')return HD_LINE_RUNS[x.line]||'';
 var hx=ROOT_HEX[x.v];
 return hx?ROOT_TRIGRAM[hx[1]].img+' over '+ROOT_TRIGRAM[hx[0]].img:'';}
const RS_STRENGTH={strong:'They agree strongly.',clear:'They agree.',light:'A light overlap.'};
/* how the bridge a meeting stands on works, for the tooltip, said once per
   vocabulary so nobody has to take a meeting on trust */
const RS_BRIDGE={
 el:'Western and Eastern astrology both name fire, earth and water. The design gate is an I Ching '
  +'hexagram, and each of its two trigrams carries one of the five Chinese elements.',
 pl:'Numerology gives every digit a planet, and astrology gives every sign a ruling planet. '
  +'This is where a number and a sign land on the same one.'};
function renderRootSum(){
 var el=document.getElementById('rootsum'); if(!el)return;
 var p=PEOPLE[S.who]||PEOPLE[0], sp=spiritual(p.nm);
 if(!sp&&CURP&&CURP.who&&CURP.who.born&&CURP.who.born.date){var bn=CURP.who.born;
  sp=spiritualOf({d:bn.date, t:(bn.timeUnknown?'':(bn.time||'')), p:bn.place||'', z:bn.zone||''});}
 /* the name's numbers only off a name that is somebody's, for the reason
    spNumRows gives: a blank profile's roster name is the word You */
 var real=numFullName(CURP)||(typeof FULLNAME!=='undefined'&&FULLNAME[p.nm]);
 var N=real?numerologyOf(p.nm,CURP):null;
 var R=rootOverlap(sp,N);
 var sig=JSON.stringify([S.who,R.placements.map(function(x){return x.sys+x.k+x.v+(x.part||'');}),
  R.range.length]);
 if(sig===RSUM_SIG&&el.firstChild)return;
 RSUM_SIG=sig;
 var h='';
 if(!sp){
  /* the door the left rail's own empty state has, to the same field */
  h+='<p class="rs-lead">'+(N?'A name gives the numbers. A birth date, time and place add three more '
     +'systems to meet them.':'No birth data yet. Date, time and place let four systems read you, '
     +'and this is where they meet.')+'</p>'
   +'<button class="btn rs-go" type="button">Open Energetics</button>';}
 else h+='<p class="rs-lead">Four systems read the same birth. Where two or more land on the same '
  +'thing on their own, that is the reading. Where they part, that is the range.</p>';
 if(R.shown.length){
  /* WHERE THEY MEET, not where they agree, because most meetings are light
     and a heading that promised agreement over three light overlaps would be
     the overclaim the strength words exist to prevent. What a light meeting
     is gets said once, under the heading, and not on every row. */
  h+='<div class="pm-eye plain rs-eye">Where they meet</div>'
   +(R.shown.some(function(a){return a.strength==='light';})
     ?'<p class="rs-note">A light overlap is one many people share. A strong one is rare.</p>':'');
  h+=R.shown.map(function(a){
   var lit=['W','E','N','D'].map(function(s,i){var on=a.sys.indexOf(s)>=0;
    return '<span class="rs-seg'+(on?' on':'')+'" style="--i:'+i+'" data-tip-t="'+esc(SYSNAME[s])+'" data-tip="'
     +esc(on?SYSNAME[s]+' lands here.':SYSNAME[s]+' does not reach this one.')+'">'
     +rsIc(SYSGLYPH[s])+'</span>';}).join('');
   return '<div class="rs-a rs-'+a.strength+'">'
    +'<div class="rs-hd"><span class="rs-g" data-tip-t="'+esc(a.t)+'" data-tip="'+esc(RS_BRIDGE[a.voc])+'">'
    +rsIc(rsThemeIc(a))+'</span>'
    +'<span class="rs-t"><b>'+esc(a.t)+'</b><em>'+esc(RS_STRENGTH[a.strength])+'</em></span></div>'
    +'<div class="rs-band" role="img" aria-label="'+esc(a.sys.map(function(s){return SYSNAME[s];}).join(', ')
     +' land here')+'">'+lit+'</div>'
    +'<p class="rs-say">'+esc(ROOT_SAYS[a.t]||'')+'</p>'
    +'<div class="rs-chips">'+rsChips(a)+'</div></div>';}).join('');}
 else if(sp)h+='<p class="rs-none">These four do not land on the same thing. Read each one as its own view.</p>';
 if(R.range.length){
  h+='<div class="pm-eye plain rs-eye">Other ways this shows up</div><div class="rs-range">'
   +R.range.map(function(x){var say=rsSays(x);
    return '<div class="rs-r">'+rsIc(SYSGLYPH[x.sys])
     +'<span class="rs-rn">'+esc(rsName(x))+'</span>'
     +(say?'<span class="rs-rs">'+esc(say)+'</span>':'')+'</div>';}).join('')+'</div>';}
 el.innerHTML=h;
 var go=el.querySelector('.rs-go');
 if(go)go.onclick=function(){setTab(TAB.INTAKE);
  requestAnimationFrame(function(){var d=$('wdate'); if(d)d.focus();});};}
