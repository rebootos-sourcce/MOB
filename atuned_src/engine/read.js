
/* ============================================================
   THE FRONT DOOR. Input, throughput, output, and nothing else.

     input(profile, opts)   one profile in. it is the only input.
     throughput(profile)    the chain, in the one order it runs in.
     output(profile)        the field back out as schema, plus the reading.
     read(profile, opts)    all three in one call. what callers want.

   Why this module exists. The chain underneath runs on shared field
   state: S, DOMAIN, VERPMIX, LEANMIX. compute() takes no arguments and
   reads all four. That was the ported design and it stays, because the
   ruling was port and not rebuild. So this is the only place permitted
   to touch that state. It touches it in one fixed order, and it zeroes
   what accumulates. Call read() twice on one profile and the numbers
   come back identical. That was not true of the chain on its own.
   ============================================================ */

/* ---------- INPUT ----------
   The profile is the only input. A story that has not been applied yet
   is the one thing not in it, so it comes separately and is applied once.
   p.story.entries is a log of stories already baked into p.axes by a
   previous save. Replaying it here would double count, so it is not read. */
function input(prof,opts){
 var p=prof||blankProfile('unnamed'), o=opts||{};
 loadProfile(p);            /* soul, nine axes, laws, gate evidence. builds the soul */
 if(p.intake&&p.intake.answers)iqApply(p);    /* a measured law beats the default 6 */
 if(o.story){                                 /* new text, not yet in the axes */
  applyStory(o.story); applyStoryAddr(o.story); verpApply(o.story); leanApply(o.story);}
 return p;}

/* ---------- THROUGHPUT ----------
   The profile is passed only so accuracy can report against it. Every
   number here comes off the field that input() placed. */
function throughput(prof){
 var r=compute();
 r.accuracy  = accuracy(r,prof);
 r.gates     = verpRead();
 r.lean      = leanRead(r);
 r.expression= exprRead();
 r.sab33     = sab33Detect();
 return r;}

/* ---------- OUTPUT ----------
   Two things come out. The profile, written back in schema shape so it
   can be stored or handed to SOURCE. And a snapshot, which is derived
   only and is what Analytics plots. */
function output(prof){
 return saveProfile(prof);}

/* ---------- the whole door ----------
   opts.story   text to apply once before computing
   opts.write   true to write the field back into the profile as well

   THE READING SAYS WHICH RECORD IT IS A READING OF. rec is the record's
   id, the key loadProfile gives S.rec, and it is what lets
   traceFromRecord(p, intents, reading) take the chain off a reading and
   know it is p's (engine/trace.js, THE READING HANDED IN). compute() reads
   whatever is loaded and cannot say, so the stamp is put on here, at the
   one door that loads a record before it reads. A story applied and not
   written is a field the record does not hold yet, so that reading is of
   no record and rec is null. Written, the record holds that field, and
   the reading is the record's. Only a key, nothing about the person, and
   on the reading, never on the record. */
function read(prof,opts){
 var o=opts||{}, p=input(prof,o), r=throughput(p);
 if(o.write)output(p);
 r.rec=(o.story&&!o.write)?null:(typeof p.id==='string'&&p.id?p.id:null);
 return {profile:p, reading:r, snapshot:snapshot(p)};}

/* ---------- the reading of what is already loaded ----------
   THE PRODUCT'S GRAPHS ARE BUILT WHILE A RECORD IS LOADED, AND read() WOULD
   UNLOAD IT. The nerve to celestial audit of 31 October asked that the three
   graph builds a screen is drawn from be handed read(p).reading. read() starts
   with loadProfile, which rewrites S from the record on disk: anything in the
   working state that is ahead of the record is gone, and on the practitioner
   page, where the record is not the one loaded at all, a stranger's field is
   left in S for the next pSave to write onto the person's own record. So the
   screens are not handed read().

   They are handed this. compute() of the field already loaded, which is the
   reading every screen is already drawn from, stamped with the record only
   when S.rec says the field was loaded from that record. S.rec is the same
   binding profHold (engine/profiles.js) asks before it writes S onto a record,
   so a field trusted to be written as this record's is the field read as this
   record's, and nothing else is. Any other record, or one with no id, is null,
   which traceFromRecord reads as no reading. Nothing is loaded or written. */
function readHeld(p){
 if(!p||typeof p!=='object'||typeof p.id!=='string'||!p.id||S.rec!==p.id)return null;
 var r=compute(); r.rec=p.id;
 return r;}
