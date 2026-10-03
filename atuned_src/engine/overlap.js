/* ============================================================
   WHERE THE FOUR SYSTEMS MEET. FV in TASKS.md, his words: "take a
   look at all the behavioral energetics where they overlap, because
   that's the truth. And then use that as the summary. Where they
   don't align is the kind of fuzziness of it, the other ways it can
   be expressed."

   THE FOUR DO NOT SHARE A LANGUAGE, and that is the first thing this
   module has to be honest about. Western reads signs, Eastern reads
   an animal and one of five elements, numerology reads digits and
   Human Design reads gates and lines. Nothing in any of them is
   written in the vocabulary of another, so an overlap is only real
   where a tradition itself supplies the bridge. Three are used, each
   one step long, and nothing else:

     ELEMENT. Western and Eastern both name fire, earth and water, so
     a sign's element and a Chinese element with the same name are
     the same word in two systems. Air has no Chinese counterpart and
     wood and metal have no Western one, so those never cross.

     THE DESIGN GATE'S TRIGRAMS. A Human Design gate is an I Ching
     hexagram by number, a hexagram is two trigrams, and every trigram
     carries one of the five Chinese elements in the Later Heaven
     order. That is how Design reaches the element vocabulary.

     PLANET. Numerology gives each digit a planet, the table printed
     since Cheiro, and astrology gives each sign a ruling planet. That
     is the only place a number and a sign can land on the same thing.

   Everything else is range and never agreement: the numbers' own
   meanings, the year animal's behaviour, the profile lines. A reading
   with no counterpart elsewhere is not a disagreement, it is another
   way the same person can show up, which is how he framed it.

   ONLY THE DESIGN GATE, NOT THE PERSONALITY GATE. The personality gate
   is the sun at birth, which Western already reads as the sun sign, so
   counting both would be one measurement voting twice. Measured over
   the whole circle in 0.05 degree steps against engine/astro.js's own
   gate wheel: the personality gate's trigrams carry the sun sign's
   element 13.6 percent of the time where an unrelated gate would 22.7,
   so the two are tied together. The design gate, the sun 88 degrees
   earlier, carries it 24.5 percent of the time, near enough the
   unrelated figure to be read as a separate voice.

   OVERLAP IS COMMON, SO IT IS WEIGHED, NOT COUNTED. With fourteen
   themes and up to eleven placements, two systems share something for
   almost everybody: on the sweep tests/engine.js runs, 700 births
   spread over seventy years, 689 had at least one theme two systems
   reach, measured 27 September. A summary that called every one of
   those the truth would be saying the same thing to everybody. So
   each meeting point carries q, the chance that the systems reaching
   it would each reach it at least as often if every placement were
   drawn at random from its own table, and the rail says how strong a
   meeting it is off q. The tables are the product's own mapping
   tables counted at load, never typed in. Numbers are taken as even
   across the nine digits, which is an approximation this module
   states rather than hides.

   Pure. A spiritualOf reading and a numerology reading in, the
   meeting points and the range out, and nothing read from or written
   to shared state.
   ============================================================ */

/* the year animal's own fixed element, the earthly branch it sits on. A year
   carries two elements, the stem's, which is the one named with the animal,
   and this one, which the animal always has. */
const ROOT_BRANCH_EL={Rat:'Water',Ox:'Earth',Tiger:'Wood',Rabbit:'Wood',Dragon:'Earth',
 Snake:'Fire',Horse:'Fire',Goat:'Earth',Monkey:'Metal',Rooster:'Metal',Dog:'Earth',Pig:'Water'};
/* the eight trigrams in the order the table below indexes them, each with the
   picture it is named for and its element in the Later Heaven order */
const ROOT_TRIGRAM=[
 {nm:'Qian',img:'heaven',el:'Metal'},{nm:'Zhen',img:'thunder',el:'Wood'},
 {nm:'Kan',img:'water',el:'Water'},{nm:'Gen',img:'mountain',el:'Earth'},
 {nm:'Kun',img:'earth',el:'Earth'},{nm:'Xun',img:'wind',el:'Wood'},
 {nm:'Li',img:'fire',el:'Fire'},{nm:'Dui',img:'lake',el:'Metal'}];
/* THE KING WEN NUMBER OF EVERY PAIR, lower trigram by row and upper by
   column, in ROOT_TRIGRAM's order. This is the standard lookup table and it
   is checked by tests/engine.js both ways: sixty four cells holding one to
   sixty four once each, and named hexagrams landing where the book puts them,
   1 heaven over heaven, 2 earth over earth, 11 earth over heaven, 63 water
   over fire. A hexagram table typed by hand is exactly the kind of thing a
   gate has to hold. */
const ROOT_KINGWEN=[
 [1,34,5,26,11,9,14,43],[25,51,3,27,24,42,21,17],[6,40,29,4,7,59,64,47],
 [33,62,39,52,15,53,56,31],[12,16,8,23,2,20,35,45],[44,32,48,18,46,57,50,28],
 [13,55,63,22,36,37,30,49],[10,54,60,41,19,61,38,58]];
/* gate number to its two trigrams, lower first, built off the table above */
const ROOT_HEX=(function(){var o={};
 ROOT_KINGWEN.forEach(function(row,lo){row.forEach(function(n,up){o[n]=[lo,up];});});
 return o;})();
/* THE RULERS. Traditional, with the two modern rulers numerology also names:
   Uranus and Neptune are the planets of 4 and 7, and they rule Aquarius and
   Pisces beside Saturn and Jupiter. Pluto has no digit, so Scorpio is Mars
   alone here, because a ruler with no number cannot meet one. */
const ROOT_RULER={Aries:['Mars'],Taurus:['Venus'],Gemini:['Mercury'],Cancer:['Moon'],
 Leo:['Sun'],Virgo:['Mercury'],Libra:['Venus'],Scorpio:['Mars'],Sagittarius:['Jupiter'],
 Capricorn:['Saturn'],Aquarius:['Saturn','Uranus'],Pisces:['Jupiter','Neptune']};
/* each digit's planet. A master keeps the planet of the digit it reduces to,
   11 the moon's, 22 Uranus's and 33 Venus's, because a master is that digit
   carried at a higher charge and not a tenth planet. */
const ROOT_NUMPLANET={1:'Sun',2:'Moon',3:'Jupiter',4:'Uranus',5:'Mercury',6:'Venus',
 7:'Neptune',8:'Saturn',9:'Mars',11:'Moon',22:'Uranus',33:'Venus'};
/* HOW STRONG A MEETING IS, by q. At or under the first, the rail says the
   systems agree strongly; at or under the second, that they agree; above it
   the meeting is common and the rail says that, rather than calling it the
   truth. On the same sweep, measured 27 September, 66 of 700 births reached
   strong, 149 clear and 474 light, and 11 had no meeting at all. The shares
   are held by tests/engine.js as a contract on the words, strong rare and
   agreement a minority, so a table change that moves them fails there and
   not in front of somebody. */
const ROOT_Q_STRONG=0.005, ROOT_Q_CLEAR=0.02;
/* how many meeting points the rail leads with. The rest of what the systems
   say is range, which is the other half of his method and not a leftover. */
const ROOT_SHOW=3;

/* the chance a single placement lands on each theme, counted off the tables
   above and the product's own sign, stem and trigram tables, never typed in */
function rootOdds(list,f){var o={},n=list.length;
 list.forEach(function(x){[].concat(f(x)).forEach(function(t){if(t)o[t]=(o[t]||0)+1/n;});});
 return o;}
function rootCap(s){return s?s.charAt(0).toUpperCase()+s.slice(1):s;}
var ROOT_P=null;
function rootP(){
 if(ROOT_P)return ROOT_P;
 var signs=ZSIGN.map(function(z){return z[2];});
 ROOT_P={
  sEl:rootOdds(ZSIGN,function(z){return rootCap(z[3]);}),
  sPl:rootOdds(signs,function(s){return ROOT_RULER[s];}),
  stem:rootOdds(CELEM,function(e){return e;}),
  branch:rootOdds(Object.keys(ROOT_BRANCH_EL),function(a){return ROOT_BRANCH_EL[a];}),
  tri:rootOdds(ROOT_TRIGRAM,function(t){return t.el;}),
  num:rootOdds([1,2,3,4,5,6,7,8,9],function(d){return ROOT_NUMPLANET[d];})};
 return ROOT_P;}

/* THE PLACEMENTS. Every reading the four systems give that can take part,
   each with the themes it lands on in each vocabulary and the odds table it
   is weighed against. A reading the record could not settle, a moon on a day
   it changed sign or a gate with no time zone, is null upstream and is not a
   placement here: a meeting point is never built on a reading nobody took. */
function rootPlacements(sp,N){
 var P=rootP(), out=[];
 if(sp){
  [['sun',sp.sun,sp.sunEl],['moon',sp.moon,sp.moonEl],['rising',sp.rising,sp.risingEl]]
   .forEach(function(x){if(!x[1])return;
    out.push({sys:'W',k:x[0],v:x[1],el:[rootCap(x[2])],pl:ROOT_RULER[x[1]]||[],odds:{el:P.sEl,pl:P.sPl}});});
  if(sp.celem)out.push({sys:'E',k:'year',v:sp.celem,el:[sp.celem],pl:[],odds:{el:P.stem}});
  if(sp.chinese)out.push({sys:'E',k:'animal',v:sp.chinese,el:[ROOT_BRANCH_EL[sp.chinese]],pl:[],odds:{el:P.branch}});
  var dg=sp.hd&&sp.hd.design, hx=dg&&ROOT_HEX[dg.gate];
  if(hx)['lower','upper'].forEach(function(part,i){var T=ROOT_TRIGRAM[hx[i]];
   out.push({sys:'D',k:'design',v:dg.gate,part:part,tri:T.nm,img:T.img,el:[T.el],pl:[],odds:{el:P.tri}});});}
 if(N)['lifePath','expression','soul','personality'].forEach(function(k){
  var v=N[k]; if(v===null||v===undefined||!ROOT_NUMPLANET[v])return;
  out.push({sys:'N',k:k,v:v,el:[],pl:[ROOT_NUMPLANET[v]],odds:{pl:P.num}});});
 return out;}

/* the chance that at least k of these independent placements land, each with
   its own chance, the distribution counted out rather than approximated */
function rootTail(ps,k){
 var d=[1];
 ps.forEach(function(p){var n=new Array(d.length+1).fill(0);
  d.forEach(function(v,i){n[i]+=v*(1-p);n[i+1]+=v*p;});d=n;});
 var s=0; for(var i=k;i<d.length;i++)s+=d[i];
 return s;}

function rootStrength(q){return q<=ROOT_Q_STRONG?'strong':q<=ROOT_Q_CLEAR?'clear':'light';}

function rootOverlap(sp,N){
 var pl=rootPlacements(sp,N), themes={};
 pl.forEach(function(x,i){['el','pl'].forEach(function(voc){x[voc].forEach(function(t){
  var key=voc+':'+t, th=themes[key]||(themes[key]={voc:voc,t:t,hits:[],by:{}});
  th.hits.push(i); (th.by[x.sys]=th.by[x.sys]||[]).push(i);});});});
 var agree=[];
 Object.keys(themes).forEach(function(key){var th=themes[key], ss=Object.keys(th.by);
  /* a theme one system reaches alone is that system talking to itself */
  if(ss.length<2)return;
  var q=1;
  ss.forEach(function(s){
   var ps=pl.filter(function(x){return x.sys===s&&x.odds[th.voc];})
    .map(function(x){return x.odds[th.voc][th.t]||0;});
   q*=rootTail(ps,th.by[s].length);});
  agree.push({voc:th.voc,t:th.t,sys:['W','E','N','D'].filter(function(s){return th.by[s];}),
   hits:th.hits.map(function(i){return pl[i];}),q:q,strength:rootStrength(q)});});
 /* the least likely by chance leads, and among equals the one more systems
    reach, then the one reached more often */
 agree.sort(function(a,b){return a.q-b.q||b.sys.length-a.sys.length||b.hits.length-a.hits.length;});
 var shown=agree.slice(0,ROOT_SHOW), used={};
 shown.forEach(function(a){a.hits.forEach(function(x){used[pl.indexOf(x)]=1;});});
 /* THE RANGE is every reading that did not take part in a meeting the rail
    leads with. The design gate's two trigrams are one reading, so it is one
    row, and the profile is always range, since no other system speaks in
    lines. */
 var range=[], seenGate=false;
 pl.forEach(function(x,i){if(used[i])return;
  if(x.sys==='D'){if(seenGate||pl.some(function(y,j){return y.sys==='D'&&used[j];}))return; seenGate=true;}
  range.push(x);});
 if(sp&&sp.hd&&sp.hd.profile&&sp.hd.personality)
  range.push({sys:'D',k:'profile',v:sp.hd.profile,line:sp.hd.personality.line});
 return {placements:pl, agree:agree, shown:shown, range:range,
  systems:['W','E','N','D'].filter(function(s){
   return pl.some(function(x){return x.sys===s;})||(s==='D'&&sp&&sp.hd&&sp.hd.profile);})};}
