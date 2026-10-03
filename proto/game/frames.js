/* ============================================================
   THE FRAME LAYER. The second proposed change to engine/sniff.js, built here
   so it can be measured.

   MEASURED FIRST, THEN DESIGNED. The sniffer is a word list: LEX holds 192
   entries and PHRASES 22 rows, and both match words. One of fourteen of this
   repository's own persona lines produces a single imprint. Read the lines and
   the reason is not vocabulary:

     "I hold the room for everyone. I have not been held in four years and I
      would not know how to ask."
     "I work until the work is done and the work is never done."
     "I can see what is wrong with anything in four seconds. It has cost me
      two studios."

   There is no emotion word in any of them. People do not write "I feel
   lonely". They write a situation and a consequence, and the charge is in the
   FORM of the sentence rather than in any word of it. A negated receipt, a
   never clause, an inability to ask, a cost, an onset.

   So a frame is a form, not a topic. It carries a seat and an intensity
   exactly as a LEX word does, so it inherits the existing inferred rule
   without a new one: the seat is read, the address is not named.

   AND IT PAYS TWICE. A word gives the sniffer a point in the text. A frame
   gives it a SPAN, which is the run of the person's own words that matched.
   The thing that reads the charge and the thing that cuts the quotation are
   then the same match, which is what the content chain needs and what cutting
   a clause around an offset was approximating.

   HONESTY NOTE, and it bounds every number measured off this file. These
   eighteen frames were written having read all fourteen persona lines, so the
   coverage measured on those lines is IN SAMPLE and is an upper bound. The
   held out test is the first hundred real entries and it has not been run.
   ============================================================ */
(function(root){

/* seat, intensity, and the fetter when the form states one. Intensities sit
   inside the range LEX already uses, 14 to 26, so nothing here outweighs a
   word a person chose deliberately. */
var FRAME=[
 /* NEGATED RECEIPT. Something that should have arrived did not. */
 {rx:/\b(?:have|has|had|having)\s+not\s+been\s+[a-z]+(?:\s+(?:in|for)\s+[a-z0-9]+\s+[a-z]+)?/i,
  seat:'heart', amt:20, fet:'Sad', nm:'a negated receipt'},
 {rx:/\bno\s*(?:one|body)\s+(?:has\s+ever\s+)?(?:asks?|asked|knows?|knew|sees?|saw|checks?)\b[a-z ]*/i,
  seat:'throat', amt:22, fet:'Apathy', nm:'nobody asked'},
 /* THE NEVER CLAUSE. A standard with no end on it. */
 {rx:/\b(?:is|are|was|were)\s+never\s+[a-z]+/i, seat:'solar', amt:22, fet:'Anger', nm:'a standard with no end'},
 {rx:/\bnever\s+(?:enough|good\s+enough|finished|done)\b/i, seat:'solar', amt:24, fet:'Anger', nm:'never enough'},
 /* INABILITY TO ASK OR SAY. The throat, by construction. */
 {rx:/\bwould\s+not\s+know\s+how\s+to\s+[a-z]+/i, seat:'throat', amt:20, fet:'Apathy', nm:'no idea how to ask'},
 {rx:/\b(?:can\s*not|cannot|could\s+not|couldn'?t)\s+(?:say|tell|ask|speak|talk|get\s+the\s+words)\b[a-z ]*/i,
  seat:'throat', amt:22, fet:'Apathy', nm:'the words will not come'},
 /* COST AND CONSEQUENCE. The person naming the bill. */
 {rx:/\b(?:it|that|this|which)\s+(?:has\s+)?cost\s+(?:me|us)\b[a-z0-9 ]*/i,
  seat:'solar', amt:20, fet:'Anger', nm:'a cost named'},
 {rx:/\b(?:two|three|four|five|six|\d+)\s+(?:people|of\s+them)\s+(?:left|quit|walked|went)\b/i,
  seat:'heart', amt:18, fet:'Sad', nm:'people left'},
 /* ONSET. Something new the body started doing. */
 {rx:/\b(?:have\s+|has\s+|i\s+)?started\s+[a-z]+ing\b[a-z ]*/i,
  seat:'heart', amt:18, fet:'Sad', nm:'a new thing the body started'},
 {rx:/\b(?:used\s+to|would)\s+[a-z]+[a-z ]{0,24}?\s+now\s+i\s+(?:can\s*not|cannot|could\s+not|do\s+not)\b/i,
  seat:'root', amt:22, fet:'Fear', nm:'what used to work stopped'},
 /* OVERRIDE. The body reported and was outvoted. */
 {rx:/\b(?:raced|ran|worked|pushed|carried\s+on|kept\s+going)\s+(?:on|through|with)\s+(?:a|an|the|my|his|her|their)?\s*[a-z]+(?:\s+[a-z]+){0,2}/i,
  seat:'root', amt:20, fet:'Fear', nm:'the body was outvoted'},
 {rx:/\bi\s+would\s+do\s+it\s+again\b/i, seat:'solar', amt:18, fet:'Anger', nm:'and again, knowingly'},
 /* HOLDING FOR OTHERS. Load carried on somebody else's behalf. */
 {rx:/\bi\s+hold\s+(?:the\s+room|it\s+together|everyone|everything|them)\b/i,
  seat:'heart', amt:20, fet:'Sad', nm:'holding it for other people'},
 {rx:/\bi\s+(?:make|made)\s+the\s+call\b[a-z ]*/i, seat:'heart', amt:16, fet:'Apathy', nm:'the one who decides'},
 /* MORAL FRAMING OF AN ORDINARY NEED. Shame, in its own grammar. */
 {rx:/\b(?:rest|stopping|asking|needing|sleep)\s+(?:feels?|felt)\s+like\b[a-z ]*/i,
  seat:'sacral', amt:22, fet:'Shame', nm:'a need called a failure'},
 {rx:/\bmoral\s+failure\b/i, seat:'sacral', amt:24, fet:'Shame', nm:'a moral failure'},
 /* BYPASS. A frame that closes the subject rather than opening it. */
 {rx:/\beverything\s+happens\s+for\s+a\s+reason\b/i, seat:'crown', amt:18, fet:'Shock', nm:'a reason for everything'},
 {rx:/\bthere\s+is\s+nothing\s+wrong\s+with\s+me\b/i, seat:'eye', amt:20, fet:'Shock', nm:'nothing wrong at all'},
 /* AND THE COHERENT SIDE, because a frame layer that can only find load will
    read a settled person as empty. Rosa's line is the test case. */
 {rx:/\b(?:do|does)\s+not\s+sit\s+on\s+me\b[a-z ]*/i, seat:'coherent', amt:-14, fet:null, nm:'it does not sit on me'},
 {rx:/\bwent\s+quiet\s+(?:a\s+long\s+time\s+ago|years\s+ago)\b/i, seat:'coherent', amt:-12, fet:null, nm:'it went quiet'}];

/* every frame that matches, with the verbatim span it matched. The span is
   the frame's whole product: the charge and the quotation are one match. */
function framesIn(text){
 var txt=String(text||''), out=[];
 FRAME.forEach(function(f){
  var rx=new RegExp(f.rx.source,'gi'), m;
  while((m=rx.exec(txt))!==null){
   out.push({seat:f.seat, amt:f.amt, fet:f.fet, nm:f.nm,
             at:m.index, span:m[0].trim()});
   if(rx.lastIndex===m.index)rx.lastIndex++;}});
 out.sort(function(a,b){return a.at-b.at;});
 /* one span per position. A longer frame outranks a shorter one starting
    inside it, the same precedence PHRASES already has over LEX. */
 var keep=[];
 out.forEach(function(h){
  var covered=keep.some(function(k){return h.at>=k.at&&h.at<k.at+k.span.length;});
  if(!covered)keep.push(h);});
 return keep;}

var API={FRAME:FRAME, framesIn:framesIn};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
else root.FRAMES=API;
})(typeof globalThis!=='undefined'?globalThis:this);
