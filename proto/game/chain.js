/* ============================================================
   THE CONTENT CHAIN. Journal to imprint to story to practice to
   affirmation, and every word a person reads back is a word they wrote.

   Runs in node and in a browser. No document, no network, no dependency.
   The engine is passed in rather than required, so this file is host free
   and the prototype can hand it a baked snapshot instead of engine.js.

   THE ONE PROPERTY THIS FILE HAS TO HOLD, and the gate in tools/loopsim.js
   checks it on every run: every span this module returns is a verbatim
   substring of the text it was given. The product may find, cut and mark. It
   may not write, complete or correct. One word is the exception and it is
   named, dated and marked as the app's: the hedge that replaces an absolute,
   and the person can overwrite it before it enters anything.
   ============================================================ */
(function(root){

/* ------------------------------------------------------------
   1. THE SPAN. A verbatim clause of the person's own sentence,
   cut around the word the engine read the most charge out of.

   parseStory().path already reports kink, the highest charge word occurrence,
   and floor, the lowest. Both carry an offset into a NORMALISED string,
   lowercased and stripped of punctuation, so the offset does not address the
   text a person typed. ui/storyui.js already met this and solved it by
   matching the word back against the original, longest first. Same method
   here, for the same reason: one coordinate system in the engine.
   ------------------------------------------------------------ */
var BREAK=/[.!?;:,\u2014]|\s(?:and|but|because|so|when|then|while|which|that)\s/gi;
var CAPWORDS=12;

/* every break position in the text, as indices into it */
function breaks(txt){
 var out=[0], m, rx=new RegExp(BREAK.source,'gi');
 while((m=rx.exec(txt))!==null){
  out.push(m.index+m[0].length);
  if(rx.lastIndex===m.index)rx.lastIndex++;}
 out.push(txt.length);
 return out;}

/* the word, found in the original, on a word boundary, case insensitively */
function findWord(txt,w){
 if(!w)return -1;
 var rx;
 try{ rx=new RegExp('\\b'+String(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'); }
 catch(e){ return -1; }
 var m=rx.exec(txt);
 return m?m.index:-1;}

/* cut the clause containing an index, then cap it at CAPWORDS words around
   the word itself so a run on sentence does not become the whole entry. */
function spanAt(txt,at,word){
 if(at<0)return null;
 var b=breaks(txt), lo=0, hi=txt.length;
 for(var i=0;i<b.length-1;i++){ if(b[i]<=at&&at<b[i+1]){ lo=b[i]; hi=b[i+1]; break; } }
 var raw=txt.slice(lo,hi);
 /* trim the punctuation and the leading conjunction the break left behind,
    by moving the window rather than by editing the text, so what comes back
    is still a substring. */
 var head=raw.match(/^[\s,.;:!?\u2014]+/); if(head){lo+=head[0].length; raw=txt.slice(lo,hi);}
 var tail=raw.match(/[\s,.;:!?\u2014]+$/); if(tail){hi-=tail[0].length; raw=txt.slice(lo,hi);}
 /* AND THE CONJUNCTION THE BREAK LEFT BEHIND. The break pattern matches
    " and " with its spaces, so the clause after it starts clean while the
    clause BEFORE it keeps the word. "My father died last year and" is not a
    sentence anybody wrote and it looked like the product had cut badly. The
    window moves; the text is never edited. */
 var cj=raw.match(/\s+(?:and|but|because|so|when|then|while|which|that)$/i);
 if(cj){hi-=cj[0].length; raw=txt.slice(lo,hi);}
 var cj2=raw.match(/^(?:and|but|because|so|when|then|while|which|that)\s+/i);
 if(cj2){lo+=cj2[0].length; raw=txt.slice(lo,hi);}
 if(!raw.trim())return null;
 var words=raw.split(/\s+/);
 if(words.length>CAPWORDS){
  /* keep the window around the word, not the first twelve words of it */
  var rel=at-lo, before=raw.slice(0,rel).split(/\s+/).length-1;
  var take=Math.max(0,Math.min(words.length-CAPWORDS,before-Math.floor(CAPWORDS/2)));
  var pre=words.slice(0,take).join(' ');
  lo+=pre.length?pre.length+1:0;
  var kept=words.slice(take,take+CAPWORDS).join(' ');
  hi=lo+kept.length;
  raw=txt.slice(lo,hi);}
 return {text:raw, at:lo, end:hi, word:word||null};}

/* ------------------------------------------------------------
   2. THE ABSOLUTE, AND THE ONE WORD THE APP IS ALLOWED TO CHANGE.

   An absolute is a claim nothing can test: "I can never say what I mean" has
   no experiment attached to it. Hedging it makes it testable, and a testable
   sentence is the only kind this product can hand to the Somatic Truth Check.

   THREE RULES, AND EACH OF THEM CAME OUT OF THE FIRST CUT BEING WRONG.

   One. The swap must be GRAMMATICALLY INERT, so it is an adverb for an
   adverb and never a verb. The first cut mapped cannot to "have not yet" and
   produced "I have not yet talk about it", which is the product writing badly
   in a person's voice, which is worse than the product not writing at all.
   So the only positions that can be swapped are an auxiliary followed by
   never or always, and the bare cannot.

   Two. It must be a claim ABOUT THE SELF. The first cut hedged "every time I
   sit down there is this weight on my chest" into "this time there is this
   weight on my chest", which took a general statement and made it about right
   now. That is not a hedge, it is a sharpening, and on a product that reads
   distress it is the wrong direction. A first person pronoun has to sit within
   four words in front of the frame or nothing fires.

   Three. When nothing fires, NOTHING IS ASSERTED. The question form is used
   instead and it names the coherent opposite off the engine's own axis table.
   ------------------------------------------------------------ */
var FRAMES=[
 {rx:/\b(can|could|will|would|shall|should|may|might|am|is|are|was|were|have|has|had)\s+never\b/i,
  to:function(m){return m[1]+' not yet';}, was:'never'},
 {rx:/\b(can|could|will|would|am|is|are|was|were|have|has|had)\s+always\b/i,
  to:function(m){return m[1]+' not always';}, was:'always'},
 {rx:/\bcannot\b/i, to:function(){return 'cannot yet';}, was:'cannot'},
 {rx:/\bcan'?t\b/i, to:function(m){return m[0]+' yet';}, was:"can't"},
 {rx:/\bnever\s+(able|going|managed)\b/i,
  to:function(m){return 'not yet '+m[1];}, was:'never'}];
var MINE=/\b(i|we|my|me|us|our)\b/i;

/* the first frame in the text that has a first person subject in front of it */
function frameIn(txt){
 var best=null;
 for(var i=0;i<FRAMES.length;i++){
  /* EVERY OCCURRENCE, NOT THE FIRST. The first cut called rx.exec once, so a
     frame that appeared twice was only ever tested at its first position. On
     the entry "the work is never done ... I can never say what I actually
     mean" the first "is never" has no first person subject in front of it and
     was correctly rejected, and the second one, which is exactly the claim
     this branch exists for, was never looked at. The rule was right and the
     loop threw away the evidence for it. */
  var rx=new RegExp(FRAMES[i].rx.source,'gi'), m;
  while((m=rx.exec(txt))!==null){
   /* four words in front, and they have to contain a first person pronoun */
   var pre=txt.slice(0,m.index).split(/\s+/).slice(-4).join(' ');
   if(MINE.test(pre)&&(best===null||m.index<best.at))
    best={at:m.index, from:m[0], to:FRAMES[i].to(m), was:FRAMES[i].was};
   if(rx.lastIndex===m.index)rx.lastIndex++;}}
 return best;}
/* ------------------------------------------------------------
   3. THE CHAIN. One call, and it reports what it found and what it did not.

   parsed  is parseStory(text) from the engine, unchanged.
   table   is CHILD, the nine poled axes, for the coherent opposite.
   Returns spans, a practice graft and an affirmation PROPOSAL. Nothing here
   is applied. Nothing enters a ritual until the person says so.
   ------------------------------------------------------------ */
function chainOf(text,parsed,table,frames){
 var txt=String(text||'');
 var out={span:null, second:null, fetter:null, opp:null, seat:null,
          graft:null, affirm:null, why:[]};
 if(!txt.trim()){out.why.push('nothing was written');return out;}
 if(!parsed){out.why.push('the text was not parsed');return out;}

 /* THE FRAME LAYER IS TRIED FIRST, AND THE REASON IS NOT PRECEDENCE, IT IS
    THAT A FRAME ALREADY IS A SPAN. Cutting a clause around a word's offset is
    an approximation of the run of words that carried the charge. A frame match
    is that run, exactly, with no cutting and no guessing at a boundary.
    proto/game/frames.js. */
 var fr=(frames&&frames.length)?frames.slice().sort(function(a,b){
  return Math.abs(b.amt)-Math.abs(a.amt);}):[];
 if(fr.length&&fr[0].amt>0){
  out.span={text:fr[0].span, at:fr[0].at, end:fr[0].at+fr[0].span.length,
            word:null, frame:fr[0].nm};
  if(fr[1]&&fr[1].amt>0&&fr[1].span!==fr[0].span)
   out.second={text:fr[1].span, at:fr[1].at, end:fr[1].at+fr[1].span.length,
               word:null, frame:fr[1].nm};
  out.from='frame';}

 var path=parsed.path||{};
 var k=path.kink, f=path.floor;
 if(!out.span){
  out.span=k?spanAt(txt,findWord(txt,k.word),k.word):null;
  if(out.span)out.from='word';}
 if(!out.span)out.why.push('no charged word and no frame from the entry could be '
  +'found in the text it came from');
 if(!out.second&&f&&k&&f.word!==k.word){
  var s2=spanAt(txt,findWord(txt,f.word),f.word);
  if(s2&&(!out.span||s2.text!==out.span.text))out.second=s2;}

 /* the axis. The imprint that carries the most is the one the ritual is
    built on, and its fetter has exactly one coherent opposite, which the
    engine has held since the poles were ruled. */
 var im=(parsed.imprints||[]).slice().sort(function(a,b){return b.amt-a.amt;})[0];
 var SEATNM={root:'Root',sacral:'Sacral',solar:'Solar',heart:'Heart',
             throat:'Throat',eye:'3rd Eye',crown:'Crown'};
 if(fr.length&&fr[0].fet){
  /* a frame that states its fetter states it the same way a LEX word with a
     third element does, which the sniffer already honours. */
  out.fetter=fr[0].fet; out.seat=SEATNM[fr[0].seat]||null;}
 else if(im){ out.fetter=im.fetter||null; out.seat=im.band||null; }
 else out.why.push('the entry produced no imprint and no frame that names an '
  +'axis, so there is no axis to work on');
 /* THE AXIS CARRIES ITS OWN SEAT, AND IT IS NOT THE SEAT THE CHARGE LANDED
    ON. A frame says where in the body this sentence put the load, which is
    what the body map needs. CHILD says where the axis lives, which is where a
    person is told to go and look for the opposite. James's line lands at the
    heart and his axis is Apathy toward Vitality, which CHILD seats at the
    throat, and the first cut printed "Vitality, at the heart" and sent him to
    the wrong place. Two facts, two fields. */
 for(var i=0;table&&out.fetter&&i<table.length;i++)
  if(table[i].nm===out.fetter){ out.opp=table[i].opp; out.oppSeat=table[i].seat; }

 /* the graft. One line, and its whole content is the span. */
 if(out.span) out.graft={span:out.span.text, word:out.span.word,
  seat:out.seat, from:out.from||null, mine:false};

 /* the affirmation. A statement to TEST, never a statement to believe.
    Two forms, and which one you get is decided by the text and not by us.

    swap: the person's own sentence with one absolute replaced by a hedge off
    the closed list above. Seventeen words exist that the app may change and
    they are all on that list. The change is marked and it is editable.

    question: when the entry names no absolute there is nothing to swap, so
    nothing is asserted. The coherent opposite is named with its seat and
    handed over as a thing to look for in the body. A question cannot be a
    positive self statement, which is the whole reason this branch exists.

    Wood, Perunovic and Lee 2009: repeating a positive self statement made
    low self esteem participants feel WORSE, and the arm that did no harm was
    the one holding a statement as both true and not true. Eight hundred of
    the weighted thousand arrive at grid level four or below. So this product
    may not hand anybody a sentence to assert. */
 /* the affirmation is cut around the ABSOLUTE, not around the kink. Those
    are two different sentences doing two different jobs: the practice works
    on where the charge is heaviest, the affirmation works on the claim that
    cannot be tested. Making them share one clause made the affirmation worse
    and did not make the practice better. */
 /* NAMED clm AND NOT fr, WHICH IS THE BUG THIS COMMENT EXISTS FOR. The frame
    layer's matches are held in fr above, and the first cut of this block
    declared a second var fr for the claim. var hoists, so the two shared one
    binding and the claim overwrote the frame matches. The symptom was an
    affirmation falling to the question form on an entry that plainly said "I
    can never say what I actually mean", which read as the swap branch not
    working when in fact it had been handed a different object. */
 var clm=frameIn(txt);
 if(clm){
  var as=spanAt(txt,clm.at,clm.from);
  if(as){
   var rel=clm.at-as.at;
   if(rel>=0&&rel+clm.from.length<=as.text.length){
    out.affirm={form:'swap',
     text:as.text.slice(0,rel)+clm.to+as.text.slice(rel+clm.from.length),
     ours:as.text, from:clm.from, to:clm.to, was:clm.was, at:rel,
     mine:true};                   /* one position is the app's, and it says so */
    out.why.push('the entry claimed '+clm.was+' about itself, so the affirmation '
     +'is that sentence with one word hedged and the word is marked');}}}
 if(!out.affirm){
  out.affirm=out.opp
   ? {form:'question', text:out.opp+', at the '+String(out.oppSeat||out.seat||'').toLowerCase()
      +'. Hold the word and read what the body does.',
      mine:true, opp:out.opp, seat:out.oppSeat||out.seat}
   : null;
  if(out.affirm)out.why.push('the entry claimed no absolute about itself, so '
   +'nothing is asserted and the coherent opposite is handed over as a question');
  else out.why.push('no axis and no absolute, so no affirmation is proposed');}
 return out;}

/* ------------------------------------------------------------
   4. THE PROOF. Used by tools/loopsim.js as a gate and by the prototype as
   a caption. Every span has to be a verbatim substring of the source text.
   ------------------------------------------------------------ */
function verbatim(text,ch){
 var txt=String(text||''), bad=[];
 ['span','second'].forEach(function(k){
  if(ch[k]&&txt.indexOf(ch[k].text)<0)bad.push(k+': '+ch[k].text);});
 if(ch.graft&&txt.indexOf(ch.graft.span)<0)bad.push('graft: '+ch.graft.span);
 if(ch.affirm&&ch.affirm.form==='swap'){
  /* the swap is the span with one listed word changed, so the span it was
     built from must still be verbatim and the changed word must be on the
     list. Nothing else may differ. */
  if(txt.indexOf(ch.affirm.ours)<0)bad.push('affirm source: '+ch.affirm.ours);
  var ok=FRAMES.some(function(r){return r.was===ch.affirm.was;});
  if(!ok)bad.push('hedge not on the list: '+ch.affirm.was);
  if(ch.affirm.ours.indexOf(ch.affirm.from)<0)
   bad.push('the frame is not in the span it was cut from');
  var rebuilt=ch.affirm.ours.slice(0,ch.affirm.at)+ch.affirm.from
   +ch.affirm.ours.slice(ch.affirm.at+ch.affirm.from.length);
  if(rebuilt!==ch.affirm.ours)bad.push('the swap does not reverse');}
 return bad;}

var API={chainOf:chainOf, spanAt:spanAt, findWord:findWord,
         verbatim:verbatim, FRAMES:FRAMES, frameIn:frameIn, CAPWORDS:CAPWORDS};
if(typeof module!=='undefined'&&module.exports)module.exports=API;
else root.CHAIN=API;
})(typeof globalThis!=='undefined'?globalThis:this);
