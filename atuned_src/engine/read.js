
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
  applyStory(o.story); verpApply(o.story); leanApply(o.story);}
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
   opts.write   true to write the field back into the profile as well */
function read(prof,opts){
 var o=opts||{}, p=input(prof,o), r=throughput(p);
 if(o.write)output(p);
 return {profile:p, reading:r, snapshot:snapshot(p)};}
