/* ============================================================
   THE FUNNEL/QUIZ SELF-REPORT STATEMENTS. The pre-account quiz asks one
   first-person statement per law, per archetype and per self-reported
   saboteur, 0 to 10, "how true is this of you right now." This is that
   copy, built once here so the funnel reads it rather than carrying its
   own second copy that can drift from this one.

   NOTHING HERE DUPLICATES A REAL TABLE. SI_SELFQ and ARCH_SELFQ are
   keyed by name onto canon.js's own SI and ARCH (the law/archetype
   name, body seat and icon stay canon's, never repeated here) because
   neither carries per-question survey copy to read -- this is that
   copy, the only new thing either needed. VERP already does carry it
   (engine/verp.js's own .d field is the exact first-person line this
   quiz shows for a Law of Action), so there is no VERP_SELFQ: a caller
   reads VERP[i].d directly. The twenty saboteur statements are not
   copied here either -- sabSelfStatement() below reads them live out of
   SABDEF's own q field (engine/data/kb.js), the real line the rest of
   the app already shows on a drill card, the one open question
   Negotiator's three clauses answered by punctuation only, per the 11
   November build note: no words added, none changed.
   ============================================================ */

/* 21 laws, keyed by SI's own name (canon.js:481-523). rev:true marks a
   statement written toward the saboteur pole, same convention VERP uses
   for side:'lower' -- a quiz UI reads it to invert the raw 0-10 before
   it ever reaches S.law, the same inversion intakeui.js's own reverse-
   scored items already apply. */
const SI_SELFQ={
 Truth:{st:"When I describe what happened, the words match what my body actually registered, even when a softer version would land easier."},
 Transparency:{st:"People close to me can see my real reasons for doing things. I'm not running a version of events for an audience."},
 Justice:{st:"When I'm the one holding power in a situation, I still weigh the other person's side as carefully as my own."},
 Unity:{st:"In the middle of a conflict, I can still feel that the other person and I are part of one field, not two opposing teams."},
 Awareness:{st:"I notice a sensation starting in my body before the story about it has fully taken over."},
 Nature:{st:"I can let a season of my life end on its own schedule, instead of forcing it to last past its time."},
 Presence:{st:"I can stay with what's actually happening right now, instead of drafting the next thing in my head."},
 Humility:{st:"When I turn out to be right, I bring it up again later so the room remembers it.", rev:true},
 Equanimity:{st:"A piece of bad news can land in me without my whole system jumping straight to the worst version of it."},
 Compassion:{st:"I can hold real regard for someone even while I'm still genuinely frustrated with them."},
 Forgiveness:{st:"When I think of someone who hurt me, the charge has actually gone down over time, not just gone underground."},
 Generosity:{st:"I give things away, including attention, without running the math on what I'll get back for it."},
 'Aesthetic Beauty':{st:"I notice and make room for what's beautiful, even on an ordinary day with no one to perform it for."},
 Courage:{st:"I say the true thing out loud in the room even while I can feel the fear of how it will land."},
 Duty:{st:"If I said I'd do it, it gets done, even once the mood that made it easy to promise has worn off."},
 Responsibility:{st:"When something I'm part of goes wrong, I look at my own part in it before I look anywhere else."},
 Accountability:{st:"When I get something wrong, I say so plainly, out loud, to the person it affected, without waiting to be caught."},
 Temperance:{st:"Once I've had enough of something, I keep going anyway, because stopping feels like losing.", rev:true},
 Detachment:{st:"After an outcome is already decided, I keep replaying it in my head until I've made it make sense.", rev:true},
 'Non-Harm':{st:"If it would get me heard faster, I'll say the thing I know will hurt.", rev:true},
 Patience:{st:"I can let a slow process stay slow, without forcing a result it isn't ready to give yet."}};
(function(){
 var names=SINAMES.slice();
 var keys=Object.keys(SI_SELFQ);
 var missing=names.filter(function(n){return keys.indexOf(n)<0;});
 var extra=keys.filter(function(k){return names.indexOf(k)<0;});
 if(missing.length||extra.length)throw new Error('SI_SELFQ must cover every law and no other, missing '
  +JSON.stringify(missing)+' extra '+JSON.stringify(extra));
})();

/* 12 archetypes, keyed by ARCH's own name (canon.js:435-455), written
   from canon's own v/d fields -- canon carries no per-question survey
   copy of its own to read here either. */
const ARCH_SELFQ={
 Warrior:"When something threatens what I'm protecting, I move on it first and sort out the cost afterward.",
 Sage:"Before I act, I stop long enough to work out what's actually true.",
 Rebel:"When a rule was never mine to begin with, I push back on it openly.",
 Caregiver:"I'll put my own plans down to help someone else carry theirs.",
 Creator:"When something's missing, I build it out of whatever's actually on hand.",
 Magician:"I'd rather change the conditions around a problem than fight the problem directly.",
 Ruler:"When there's no order yet, I'm the one who sets it so people can move together.",
 Explorer:"I keep going past the point where the path everyone else used ran out.",
 Lover:"I move toward the person and say what I actually feel, instead of circling it.",
 Jester:"In a heavy room, I'm usually the one who lets the pressure out.",
 Everyman:"I stay with the group and work to keep it in one piece, even when it's easier to peel off.",
 Innocent:"I take what someone tells me at face value, exactly as they said it."};
(function(){
 var names=ARCH.map(function(a){return a.nm;});
 var keys=Object.keys(ARCH_SELFQ);
 var missing=names.filter(function(n){return keys.indexOf(n)<0;});
 var extra=keys.filter(function(k){return names.indexOf(k)<0;});
 if(missing.length||extra.length)throw new Error('ARCH_SELFQ must cover every archetype and no other, missing '
  +JSON.stringify(missing)+' extra '+JSON.stringify(extra));
})();

/* THE REAL LINE, NOT A COPY OF IT. SABDEF[key].q (kb.js) joins several
   first-person clauses with " / " for a drill card that shows them as a
   short list; a quiz statement wants one sentence, so this joins them
   with a space the same punctuation-only way the 11 November build note
   describes for Negotiator, generically, for all twenty, rather than
   writing the same fix by hand twenty times. */
function sabSelfStatement(nm){
 var row=SABDEF[KB_KEY(nm)]; if(!row||!row.q)return null;
 return row.q.split('/').map(function(s){return s.trim();}).join(' ');}
(function(){
 var missing=SAB_SELFNAMES.filter(function(nm){return !sabSelfStatement(nm);});
 if(missing.length)throw new Error('sabSelfStatement has no SABDEF.q for '+JSON.stringify(missing));
})();

/* THE 59-QUESTION CANONICAL ORDER. Fixed and load-bearing, same reason
   V19's own BLOCK_DEFS gives: a person's answers are stored indexed to
   this order regardless of what order a screen shuffles them into.
   21 (SI) + 6 (VERP) + 12 (ARCH) + 20 (SAB_SELFNAMES) = 59, asserted
   rather than hand counted, the same discipline SI.length!==21 and
   VERP.length!==6 already assert elsewhere. */
const FUNNELQ_BLOCKS=[
 {key:'si',   label:'Laws',       items:SI.map(function(l){return {sec:'law', nm:l.nm, b:l.b, ic:l.ic,
   st:SI_SELFQ[l.nm].st, rev:!!SI_SELFQ[l.nm].rev};})},
 {key:'verp', label:'Action',     items:VERP.map(function(g){return {sec:'gate', nm:g.nm, side:g.side,
   st:g.d, rev:g.side==='lower'};})},
 {key:'arch', label:'Archetypes', items:ARCH.map(function(a,i){return {sec:'arch', nm:a.nm, i:i, b:a.b, ic:a.ic,
   st:ARCH_SELFQ[a.nm]};})},
 {key:'sab',  label:'Saboteurs',  items:SAB_SELFNAMES.map(function(nm){return {sec:'sab', nm:nm,
   st:sabSelfStatement(nm)};})}];
(function(){
 var off=0;
 FUNNELQ_BLOCKS.forEach(function(b){b.start=off; off+=b.items.length;});
 var total=off;
 if(total!==59)throw new Error('FUNNELQ_BLOCKS must total 59 questions, got '+total);
})();
const FUNNELQ=FUNNELQ_BLOCKS.reduce(function(acc,b){return acc.concat(b.items);},[]);
if(FUNNELQ.length!==59)throw new Error('FUNNELQ must total 59, got '+FUNNELQ.length);

if(typeof module!=='undefined'&&module.exports){
 Object.assign(module.exports,{SI_SELFQ:SI_SELFQ, ARCH_SELFQ:ARCH_SELFQ, sabSelfStatement:sabSelfStatement,
  FUNNELQ_BLOCKS:FUNNELQ_BLOCKS, FUNNELQ:FUNNELQ});}
