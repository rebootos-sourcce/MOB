/* ============================================================
   WHAT ENERGETICS HOLDS, READ LIVE. Prototype, round DM, 26 September.

   One function, enRead(), reads everything the four layouts show, straight
   off the product's own engine at the moment it is called. Nothing here is a
   table of answers:

     name      engine/numerology.js numerology(), off the names as typed. The
               root meaning is the only piece that is not the engine's, and it
               comes from roots.js, which is illustrative and says so.
     born      the celestial read from proto/states (already built), which
               calls the engine's own spiritualOf and composes the stack.
     pattern   the four letter type the person states, through the engine's
               own seedAxes, read letter by letter off engine/seed.js's own
               definitions of each pole.
     channels  the engine's own balance(): the outward mean against the
               inward mean.
     drives    the archetype the person picks (ARCH, engine/data/canon.js) and
               nine child emotion questions lifted verbatim from the web quiz
               (funnel/questions.js), scored the way that quiz scores them.

   The Source AI panel is scripted. enVoice() assembles sentences from the
   readings above. No model is called and the panel says so on its face.
   ============================================================ */

/* ---- the name, with one fix the engine needs ----
   numClean turns every non letter into a space, so O'Neill reads as two
   names, O and Neill. The totals still agree (digit sums keep the value mod
   nine) but the per name rows are wrong and a master inside the name can be
   lost. Reported, not patched in the engine: here the apostrophe is dropped
   before the name is handed over. */
function enJoin(s){return String(s||'').replace(/['’`]/g,'').trim();}
function enNames(w){
 var out=[];
 [['first','First'],['middle','Middle'],['last','Last']].forEach(function(r){
  var v=enJoin(w[r[0]]); if(!v)return;
  out.push({role:r[0],label:r[1],typed:String(w[r[0]]).trim(),clean:v});});
 return out;}

/* ---- the pattern, letter by letter ----
   Every line below is engine/seed.js's own comment on that pole, cut to one
   clause. The seed file is where the product already says what each letter
   does to the body, so the reading is that and not a type description. */
var EN_POLE={
 E:{ax:'Discharge',say:'Charge leaves through action and voice.'},
 I:{ax:'Discharge',say:'Charge is held and worked through before it shows.'},
 N:{ax:'Attention',say:'Attention runs forward, to the pattern.'},
 S:{ax:'Attention',say:'Attention stays in the present, on the concrete.'},
 T:{ax:'Decision',say:'A decision is made against a standard.'},
 F:{ax:'Decision',say:'A decision is made against worth.'},
 J:{ax:'Closure',say:'The loop gets closed and held.'},
 P:{ax:'Closure',say:'The loop stays open and running.'}};
var EN_POLE_NM={E:'outward',I:'inward',N:'forward',S:'present',T:'standard',F:'worth',J:'closed',P:'open'};

/* ---- the nine child emotion questions ----
   The first item in funnel/questions.js that loads each axis, copied by
   build.js at build time rather than retyped, and scored the quiz's own way:
   Never is 0, Always is 10, in steps of 2.5. */
var EN_SCALE=(typeof QSCALE!=='undefined')?QSCALE:['Never','Rarely','Sometimes','Often','Always'];

/* ---- state the prototype keeps beside the profile ---- */
var EN={v:'b', ans:{}, arcPicked:false, fresh:{}, last:{}, step:0, card:null, essence:false};
window.EN=EN;

function enBirth(){
 var bn=(CURP&&CURP.who&&CURP.who.born)||{};
 return bn;}

/* ---- the read ---- */
function enRead(){
 var w=(CURP&&CURP.who)||{}, bn=w.born||{};
 var names=enNames(w);
 var R={names:names, name:null, num:null, born:null, sky:null, pattern:null, channels:null,
  arch:null, child:null, missing:[]};
 /* name */
 if(names.length){
  var full=names.map(function(n){return n.clean;}).join(' ');
  var N=numerology(full, bn.date||null);
  R.num=N;
  names.forEach(function(n,i){
   n.root=enRoot(n.clean);
   var e=N&&N.each[i]; n.v=e?e.v:null; n.says=e?e.says:''; n.debt=e?e.debt:null;});}
 else R.missing.push('name');
 /* born: the life path needs only the date; the sky needs what spiritualOf needs */
 if(bn.date){
  R.born={date:bn.date, lp:lifePath(bn.date)};
  if(!names.length)R.num=null;
  try{ if(typeof renderSpirit==='function')renderSpirit(); }catch(x){}
  var ST=window.STATES||{};
  if(ST.R&&ST.e){R.sky={R:ST.R,e:ST.e};}}
 else R.missing.push('date of birth');
 if(bn.date&&!bn.time&&!bn.timeUnknown)R.missing.push('time of birth');
 /* pattern */
 var sd=CURP&&CURP.seed;
 if(sd&&sd.type){
  var ax=seedAxes(sd.type), up=CHARGES.filter(function(c){return ax[c]>3;})
   .sort(function(a,b){return ax[b]-ax[a];}).slice(0,2);
  R.pattern={type:sd.type, letters:sd.type.split('').map(function(l){return {l:l,ax:EN_POLE[l].ax,say:EN_POLE[l].say};}),
   up:up, share:seedShare(CURP)};}
 else R.missing.push('four letter type');
 /* channels */
 var b=balance();
 R.channels={read:b.read, out:b.outMean, in:b.inMean, lean:b.lean,
  dir:!b.read?'':b.lean===0?'even':b.lean>0?'outward':'inward'};
 /* archetype */
 if(EN.arcPicked){
  var a1=ARCH[EN.arcs[0]], a2=EN.arcs[1]!=null?ARCH[EN.arcs[1]]:null;
  R.arch={first:a1, second:a2,
   lpArch:(R.born&&typeof LP2ARCH!=='undefined')?LP2ARCH[R.born.lp]||null:null};}
 else R.missing.push('archetype');
 /* child emotions */
 var got=Object.keys(EN.ans);
 if(got.length){
  var heavy=got.map(function(c){return {c:c,v:EN.ans[c]*2.5,ch:CHILD.filter(function(x){return x.nm===c;})[0]};})
   .sort(function(a,b){return b.v-a.v;});
  R.child={answered:got.length, heavy:heavy, top:heavy[0]};}
 else R.missing.push('child emotions');
 return R;}

/* ---- the scripted Source AI ----
   Composed from the read, in the order the person filled things in, and
   never ahead of it: a sentence only exists once its field does. It admits
   what is not read yet once, at the end, and names the one field that
   would add the most. */
function enLow(s){return s?s.charAt(0).toLowerCase()+s.slice(1):s;}
function enVoice(R){
 var s=[];
 if(R.names.length){
  var f=R.names[0];
  if(f.root)s.push('The root of '+f.typed+' is '+f.root.root
   +(f.root.said?', and people hear '+f.root.said+' in it':'')+'.');
  var N=R.num;
  if(N){var ex=NUM_CORE[N.expression]||{};
   s.push((R.names.length>1?'Your full name':'Your name so far')+' reduces to '+N.expression+', which '+ex.ex+'.');
   if(R.names.length>1){var sl=NUM_CORE[N.soul]||{};
    s.push('The vowels reduce to '+N.soul+', the part of you that '+sl.so+'.');}}}
 if(R.born){var lp=NUM_CORE[R.born.lp]||{};
  s.push('The date walks life path '+R.born.lp+', '+enLow(lp.n)+'.');
  if(R.sky&&R.sky.R&&R.sky.R.head)s.push(R.sky.R.head);}
 if(R.pattern){var L=R.pattern.letters;
  s.push('You state '+R.pattern.type+'. '+L[0].say+' '+L[3].say);}
 if(R.channels.read){
  var c=R.channels, more=c.out>c.in?'outward':'inward';
  s.push(c.lean===0?'Both channels carry the same weight.'
   :'The '+more+' channel carries more than the '+(more==='outward'?'inward':'outward')+' one, so force '
    +(more==='outward'?'leaves you as action before it is felt.':'stays in the body before it is spent.'));}
 if(R.arch){
  s.push(R.arch.first.nm+' runs first: it '+R.arch.first.v+'.');
  if(R.arch.lpArch)s.push(R.arch.lpArch===R.arch.first.nm?'Your life path reads '+R.arch.lpArch+' too, so the two agree.'
   :'Your life path reads '+R.arch.lpArch+', so what you were given and what you run differ.');}
 if(R.child&&R.child.top&&R.child.top.v>=5){var t=R.child.top;
  s.push('The heaviest charge you named is '+t.c.toLowerCase()+', held at the '+t.ch.loc+'.');}
 var miss=R.missing.filter(function(m){return m!=='child emotions'||!R.child;});
 if(!s.length)return {lines:[], tail:'Nothing read yet. Your first name is enough to start.'};
 var next=miss[0];
 return {lines:s, tail:miss.length?('Not read yet: '+miss.join(', ')+'. '
  +(next?enCap(next)+' adds the most next.':'')):'Everything Energetics asks is in.'};}
function enCap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
if(typeof module!=='undefined')module.exports={enRead:enRead,enVoice:enVoice};
