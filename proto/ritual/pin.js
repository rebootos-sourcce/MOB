/* ============================================================
   THE READING THE RITUAL PROTOTYPES ARE PINNED TO, IN ONE PLACE.

   build-data.js, caldata.js and ritdata.js each carried their own typed copy
   of this, transcribed from PANEL-ritual-1000.md section 3.1 and
   DESIGN-ritual.md section 1.2, and all three went red together. Two
   different things had moved, and only one of them was drift.

   1. THE ENGINE. dd0bf23, 25 September, refitted CQ to the 21 laws summed
      over 210 and rescaled DQ to 0 to 100. Every CQ and DQ in the typed
      tables was the 20 September arithmetic. That is drift, and a pin that
      fails on it is the pin working: it is how marketing/field.js caught the
      same refit (e5a9596).

   2. THE PORT. All three carried ritFor with the DQ load bands at 8 and 4.
      3824c63 moved the product (ui/ritual.js) to the ruled 70 and 40 and
      missed these copies, so on the rescaled DQ they dealt seven of the nine
      a tier the build does not deal: Diane, Derek, Marcus, James, Ana and
      Gordon tier 1, Angela tier 2.
      That is a defect in the prototypes, not drift, and it is 8 of the 25
      failures in caldata and ritdata and all 3 in build-data. A gate that
      read CQ and DQ live would still have caught it only through the
      practice column; the band check below catches it by name.

   WHY PINNED AND NOT READ LIVE, decided 27 September. The files already read
   every number they WRITE live off engine.js; the typed tables only ever sat
   in the gates. A gate that reads its expected CQ off the same compute() call
   it is checking compares the engine with itself and cannot fail, so it
   guards nothing, and the figures documents quote off these prototypes would
   go stale in silence again. So the values are pinned, with the commit and
   the date, the way marketing/field.js and proto/ritual/losssim.js pin their
   levels, and two checks that are NOT tautological are read live:

     checkBands   the port's DQ bands against the line in ui/ritual.js
     checkDoc     the practice column of DESIGN-ritual.md 1.2, parsed out of
                  the document itself, against what the port deals now

   IF checkPin FAILS, the engine moved. Re-run, re-date DESIGN-ritual.md 1.2
   and the note under PANEL-ritual-1000.md 3.1, then re-pin here. Nowhere
   else: this is the only copy.

   PANEL-ritual-1000.md 3.1 itself is left as the 20 September snapshot it
   was taken as, with its own dated note. It is not a gate any more; see
   P31_PRACTICE below for the one column of it that is still reconciled.
   ============================================================ */
const path=require('path'), fs=require('fs');

const AT='engine.js as built at 248e5d2: CQ fitted at dd0bf23 (25 September), '
 +'the ritual load bands at 3824c63 (70 and 40). Measured 27 September 2026.';

/* [CQ, DQ, seat, track dealt, tier, practice called for, minutes, releasable]
   Track dealt is the track of the practice actually called, so a substituted
   one reads as the track it was substituted to. Releasable counts addresses
   at sq >= 4, which the refit did not touch: that column is unchanged from
   20 September, row for row. */
const PIN={
 Diane :[59.0,19.69,'Solar' ,'Somatic',3,'The Somatic Truth Check', 2, 8],
 Derek :[48.5,26.22,'Solar' ,'Somatic',3,'The Somatic Truth Check', 2,20],
 Marcus:[62.1,10.68,'Throat','Mind'   ,3,'Active Listening'       ,10, 0],
 Angela:[64.4, 5.37,'Root'  ,'Body'   ,3,'Box Breathing'          , 5, 0],
 Sofia :[72.9, 3.16,'Throat','Mind'   ,3,'Active Listening'       ,10, 0],
 James :[42.3,26.85,'Sacral','Somatic',3,'The Somatic Truth Check', 2,18],
 Ana   :[41.1,36.4 ,'Solar' ,'Somatic',3,'The Somatic Truth Check', 2,41],
 Gordon:[17.5,54.28,'Throat','Mind'   ,2,'Active Listening'       ,10,97],
 Rosa  :[97.0, 0   ,'Root'  ,'Body'   ,3,'Box Breathing'          , 5, 0]};

/* The practice column of PANEL-ritual-1000.md 3.1, 20 September, kept only so
   the pick rule change it documents can still be shown. That column was taken
   with the first practice in the table rather than the lightest, which is
   the change ui/ritual.js records. It is reconciled, not gated: the engine it
   was taken on no longer exists, so a row the old rule stops reproducing is
   the engine having moved, and it is printed rather than failed. */
const P31_PRACTICE={
 Diane:['The Emotional Scan',20], Derek:['The Emotional Scan',20],
 Marcus:['Noting Meditation',15], Angela:['Box Breathing',5],
 Sofia:['Noting Meditation',15], James:['The Emotional Scan',20],
 Ana:['The Emotional Scan',20], Gordon:['The Emotional Scan',20],
 Rosa:['Box Breathing',5]};

const ROOT=path.resolve(__dirname,'../..');
const BANDRE=/r\.DQ>=(\d+)\?1:\(r\.DQ>=(\d+)\?2:3\)/;

/* the bands the product deals, read out of ui/ritual.js, against the bands
   the calling file's own ritFor carries, read out of that file. */
function checkBands(file,fail){
 const src=fs.readFileSync(path.join(ROOT,'atuned_src/ui/ritual.js'),'utf8');
 const want=/var tier=r\.DQ>=(\d+)\?1:\(r\.DQ>=(\d+)\?2:3\)/.exec(src);
 const have=BANDRE.exec(fs.readFileSync(file,'utf8'));
 const w=want?want[1]+' and '+want[2]:'not found', h=have?have[1]+' and '+have[2]:'not found';
 if(!want||!have||want[1]!==have[1]||want[2]!==have[2])
  fail('the ported ritFor deals DQ bands '+h+', ui/ritual.js deals '+w);
 return {want:w,have:h};}

/* one person's reading against the pin. got is
   {CQ, DQ, seat, track, tier, practice, min, releasable}. */
function checkPin(nm,got,fail){
 const e=PIN[nm];
 if(!e){fail(nm+' is not pinned');return;}
 const cols=[['CQ',+(+got.CQ).toFixed(1)],['DQ',+(+got.DQ).toFixed(2)],['seat',got.seat],
  ['track',got.track],['tier',got.tier],['practice',got.practice],['minutes',got.min],
  ['releasable',got.releasable]];
 cols.forEach(([k,v],i)=>{if(v!==e[i])fail(nm+' '+k+' '+v+' against the pin '+e[i]);});}

/* DESIGN-ritual.md section 1.2, parsed out of the document. Rows are
   | who | seat | track | tier | practice | minutes |, bold stripped, and a
   track cell may read "Somatic, substituted". Rows for anybody not on the
   panel (the blank profile row) are returned under their own name and the
   caller skips them. Throws if the section or its table is gone, because a
   gate that silently finds nothing to check has passed nothing. */
function design12(){
 const md=fs.readFileSync(path.join(ROOT,'DESIGN-ritual.md'),'utf8').split('\n');
 const at=md.findIndex(l=>/^###\s+1\.2\b/.test(l));
 if(at<0)throw new Error('DESIGN-ritual.md has no section 1.2 to check against');
 const rows={};
 for(let i=at+1;i<md.length&&!/^#{1,3}\s/.test(md[i]);i++){
  const l=md[i];
  if(!/^\|/.test(l)||/^\|\s*-/.test(l)||/^\|\s*who\s*\|/i.test(l))continue;
  const c=l.split('|').slice(1,-1).map(x=>x.replace(/\*\*/g,'').trim());
  if(c.length<6)continue;
  rows[c[0]]={seat:c[1],track:c[2].replace(/,\s*substituted$/,''),
   substituted:/substituted$/.test(c[2]),tier:+c[3],practice:c[4],min:+c[5]};}
 if(!Object.keys(rows).length)throw new Error('DESIGN-ritual.md 1.2 has no table rows');
 return rows;}

/* the document's practice column against what the port deals now. got is
   keyed by name, {seat, track, substituted, tier, practice, min}. */
function checkDoc(got,fail){
 const rows=design12(); let n=0;
 Object.entries(rows).forEach(([nm,d])=>{
  const o=got[nm]; if(!o)return; n++;
  const a=[d.seat,d.track,d.substituted,d.tier,d.practice,d.min].join('/');
  const b=[o.seat,o.track,!!o.substituted,o.tier,o.practice,o.min].join('/');
  if(a!==b)fail('DESIGN-ritual.md 1.2 says '+nm+' '+a+', the port deals '+b);});
 if(!n)fail('DESIGN-ritual.md 1.2 names nobody on the panel');
 return n;}

module.exports={AT,PIN,P31_PRACTICE,checkBands,checkPin,checkDoc,design12};
