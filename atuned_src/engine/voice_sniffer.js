/* Source voice -> canonical Sniffer adapter. Host-free and read-only.
 * This file belongs after engine/sniff.js and engine/sourceai.js in MANIFEST.
 * It never calls applyStory, changes profile state, or declares CQ.
 */
function srcVoiceSniff(text, prior, active){
 var s=String(text||'');
 if(!s.trim())return {
  status:'UNREAD', engine:'MOB/sniffStory+srcHear', reason:'no spoken user text',
  hits:[],denied:[],others:[],seats:[],axes:[],laws:[],saboteurs:[],
  flow:null,gates:null,depth:null,inquiry:{move:'listen'},gaps:null};
 var report=sniffStory(s), parsed=report.parsed||{};
 var heard=srcHear(s,prior||{},active||{});
 var hit=function(h){return {word:h.t||null, kind:h.kind||null,
  band:h.band||null, sourceOffset:typeof h.at==='number'?h.at:null,
  label:h.label||null, charge:h.charge||null};};
 var axes=(report.axes||[]).filter(function(a){return a.shadow>0||a.coherent>0;})
  .map(function(a){return {axis:a.axis,shadow:a.shadow,coherent:a.coherent,
   address:a.address||null,because:a.because||[],status:'candidate'};});
 var laws=(report.laws||[]).map(function(x){return {law:x.law,direction:x.direction||null,
  because:x.because||[],status:'candidate, not measured integrity'};});
 var saboteurs=(report.saboteurs||[]).map(function(x){return {id:x.id,name:x.name,
  confidence:x.confidence,because:x.because||[],status:'hypothesis only'};});
 return {
  status:(parsed.hits||[]).length?'READ':'UNREAD',
  engine:'MOB/sniffStory+srcHear',source:'canonical read-only engine; user speech',
  hits:(parsed.hits||[]).map(hit),
  denied:(parsed.denied||[]).map(hit),
  others:(parsed.others||[]).map(hit),
  seats:(heard.seats||[]).map(function(x){return {seat:x.seat,band:x.band,
   mentions:x.mentions,earlier:x.earlier,rung:x.rung,words:x.words||[]};}),
  axes:axes,laws:laws,saboteurs:saboteurs,
  flow:report.flow||null,gates:report.gates||null,depth:report.depth||null,
  inquiry:srcTurn(heard,{typed:true,passed:true}), /* the user leads; never auto-prompt */
  gaps:report.gaps||null,
  measurement:'UNVERIFIED: lexical analysis is not a CQ score or diagnosis',
  ancestry:'NOT ASSESSED by the existing Sniffer; needs independent lineage evidence seam',
  note:'The application may suggest; only the person can confirm. No data mutated.'};
}