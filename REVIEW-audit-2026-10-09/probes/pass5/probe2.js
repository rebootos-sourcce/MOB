const E=require('./engine.js');
const DAY=86400000, now=Date.now();
const key=(E.PRACTICE[0]||{}).k||(E.PRACTICE[0]||{}).key||Object.keys(E.PRACTICE)[0];
console.log('practice sample entry',JSON.stringify(E.PRACTICE[0]).slice(0,120),'key=',key);
function mk(rows){const p=E.blankProfile('Probe'); p.rituals=rows; return p;}
function row(i,done){return {t:new Date(now+i*DAY).toISOString(),track:'Body',band:'Root',steps:[key],min:5,when:'',where:'',done:done};}
let fut=[];for(let i=1;i<=90;i++)fut.push(row(i,true));
const pf=mk(fut);
const v=E.validateProfile(JSON.parse(JSON.stringify(E.saveProfile(pf))));
console.log('boundary accepts 90 future-dated done days:',v.ok, v.ok?'':v.errs.slice(0,3));
if(v.ok){const L=E.ladderRead(v.profile,now);console.log('earned after boundary:',L.earned.map(m=>m.k).join(','),'streak',JSON.stringify(L.streak));}
// set-never-done 30 days
let s30=[];for(let i=0;i<30;i++)s30.push(row(-i,false));
const ps=mk(s30);const L2=E.ladderRead(ps,now);console.log('30 days set never done earned:',L2.earned.map(m=>m.k).join(',')||'(none)','streak',JSON.stringify(L2.streak));
// X9: marks lost when day deleted; X10: first clearing lost when axis falls back
let d30=[];for(let i=0;i<30;i++)d30.push(row(-i,true));
const pd=mk(d30);console.log('30 days done earned:',E.ladderRead(pd,now).earned.map(m=>m.k).join(','));
pd.rituals.splice(15,1);console.log('after deleting one day (gap) earned:',E.ladderRead(pd,now).earned.map(m=>m.k).join(','), JSON.stringify(E.ladderRead(pd,now).streak));
// is there a grant store?
const bp=E.blankProfile('x');console.log('blank top-level keys:',Object.keys(bp).join(','));
