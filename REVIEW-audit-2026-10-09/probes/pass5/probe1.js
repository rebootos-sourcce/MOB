const E=require('./engine.js');
const names=Object.keys(E);
const need=['blankProfile','streakRead','pracDays','ladderRead','saveProfile','validateProfile','marksRead','MARKS'];
console.log('exports present:',need.map(n=>n+':'+(names.includes(n))).join(' '));
const DAY=86400000, now=Date.now();
function prof(rits){const p=E.blankProfile('Probe'); p.rituals=rits; return p;}
// X2: thirty days set, none done
let set30=[];for(let i=0;i<30;i++)set30.push({t:new Date(now-i*DAY).toISOString(),track:'Body',band:'Root',steps:['breath'],min:5,when:'',where:'',done:false});
console.log('X2 thirty days set never done:',JSON.stringify(E.streakRead(prof(set30),now)));
// X7: ninety days in the future, done
let fut=[];for(let i=1;i<=90;i++)fut.push({t:new Date(now+i*DAY).toISOString(),track:'Body',band:'Root',steps:['breath'],min:5,when:'',where:'',done:true});
const pf=prof(fut);
console.log('X7 90 days future done, streakRead:',JSON.stringify(E.streakRead(pf,now)));
const v=E.validateProfile(JSON.parse(JSON.stringify(E.saveProfile?E.saveProfile(pf):pf)));
console.log('X7 boundary accepts future dated rituals?',v.ok, v.ok?'':v.errs.slice(0,3));
if(E.ladderRead){const L=E.ladderRead(pf,now); console.log('X7 ladderRead earned:',JSON.stringify((L.earned||L.marks||[]).map(m=>m.k||m.nm).slice(0,20)), Object.keys(L));}
