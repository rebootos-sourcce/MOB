
/* ============================================================
   ENERGETICS. Pure functions of date, time and place. Nothing else
   is stored, so a sixth system costs nothing.
   ============================================================ */
function sunSign(d){
 var p=d.split('-'), m=+p[1], day=+p[2];
 for(var j=0;j<ZSIGN.length;j++){
  var a=ZSIGN[j], b=ZSIGN[(j+1)%12];
  if((m===a[0]&&day>=a[1])||(m===b[0]&&day<b[1]))
   return {nm:a[2], el:a[3], mode:a[4]};}
 return {nm:ZSIGN[11][2], el:ZSIGN[11][3], mode:ZSIGN[11][4]};}
function moonSign(bt){
 var d=new Date(bt.d+'T00:00:00Z');
 var days=Math.floor(d.getTime()/86400000);
 var i=(((days%27.32)+27.32)%27.32)/27.32;      /* pre-1970 births give negative days */
 var k=Math.floor(i*12); k=((k%12)+12)%12;
 return ZSIGN[k];}
function risingSign(bt){
 var sun=sunSign(bt.d), si=0;
 ZSIGN.forEach(function(z,k){if(z[2]===sun.nm)si=k;});
 var h=+bt.t.split(':')[0]+(+bt.t.split(':')[1])/60;
 var off=Math.floor(((h-6+24)%24)/2);
 return ZSIGN[(((si+off)%12)+12)%12];}
function lifePath(d){
 var v=d.replace(/-/g,'').split('').reduce(function(a,c){return a+ +c;},0);
 while(v>9&&v!==11&&v!==22&&v!==33)
  v=String(v).split('').reduce(function(a,c){return a+ +c;},0);
 return v;}
function masterNumber(bt){var lp=lifePath(bt.d);return (lp===11||lp===22||lp===33)?lp:null;}
function chineseElement(y){ return CELEM[y%10]; }
function hdOf(b){
 var h=+b.t.split(':')[0];
 return {type:HDTYPE[(h+lifePath(b.d))%5],
  authority:['emotional','sacral','splenic','ego','self-projected','lunar'][(h+3)%6]};}
function geneKey(b){var day=+b.d.split('-')[2];return {gate:((day*3)%64)+1, line:(day%6)+1};}
function spiritual(name){
 var bt=BIRTH[name]; if(!bt) return null;
 var sun=sunSign(bt.d), mn=moonSign(bt), rs=risingSign(bt), y=+bt.d.split('-')[0];
 return {sun:sun.nm, sunEl:sun.el, sunMode:sun.mode, moon:mn[2], moonEl:mn[3],
  rising:rs[2], risingEl:rs[3], chinese:CHINESE[y%12], celem:chineseElement(y),
  lp:lifePath(bt.d), master:masterNumber(bt), hd:hdOf(bt), gk:geneKey(bt), birth:bt,
  root:ELEM2ROOT[sun.el], mode:MODE2NOTE[sun.mode], lpMean:LPMEAN[lifePath(bt.d)]||''};}
/* CONVERGENCE. where independent systems agree, that is the signal.
   where they disagree the instrument says so rather than picking a winner. */
function converge(name,r){
 var e=spiritual(name); if(!e) return null;
 var agree=[],differ=[];
 var rootNow=(DOMAINS[S.doms[0]]||{}).r||'';
 if(e.root===rootNow) agree.push('birth element '+e.sunEl+' and your root domain both read '+e.root);
 else differ.push('birth element points '+e.root+', your domain runs '+rootNow);
 var archNow=(ARCH[r.pi]||{}).nm||'';
 if(LP2ARCH[e.lp]===archNow) agree.push('life path '+e.lp+' and your first archetype both read '+archNow);
 else differ.push('life path '+e.lp+' reads '+(LP2ARCH[e.lp]||'unmapped')+', you run '+archNow);
 var initiating=(e.sunMode==='cardinal');
 if(initiating===!!r.benign) agree.push('birth mode '+e.sunMode+' matches a field that is '
   +(r.benign?'expanding':'contracting'));
 else differ.push('birth mode '+e.sunMode+' against a field that is '+(r.benign?'expanding':'contracting'));
 var hdOpen=(e.hd.type==='Generator'||e.hd.type==='Manifesting Generator');
 if(hdOpen===(r.CQ>=50)) agree.push(e.hd.type+' and a field at CQ '+Math.round(r.CQ)+' point the same way');
 else differ.push(e.hd.type+' against a field at CQ '+Math.round(r.CQ));
 return {e:e, agree:agree, differ:differ,
  score:Math.round(agree.length/(agree.length+differ.length)*100)};}

