const E=require('./engine.js');
const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=v;});
const p=E.profCreate('Strict');
const j=JSON.parse(E.pExport());
// 1 unknown top-level key
const a=JSON.parse(JSON.stringify(j)); a.progress={grants:['x']}; a.id='pxa'; a.name='A';
const v=E.validateProfile(a);
console.log('unknown top-level key progress: ok=',v.ok,'kept key?',v.ok&&('progress' in v.profile), v.ok?'':v.errs.slice(0,2));
// 2 unknown nested key in avatar
const b=JSON.parse(JSON.stringify(j)); b.avatar.mystery=1; b.id='pxb';
const v2=E.validateProfile(b);
console.log('unknown key in avatar: ok=',v2.ok, v2.ok?'(accepted)':v2.errs.slice(0,2));
// 3 future-dated ritual entry
const key=E.PRACTICE[0].k;
const c=JSON.parse(JSON.stringify(j)); c.id='pxc'; c.rituals=[{t:new Date(Date.now()+400*86400000).toISOString(),track:'Somatic',band:'Root',steps:[key],min:5,when:'',where:'',done:true}];
const v3=E.validateProfile(c); console.log('ritual dated +400 days: ok=',v3.ok, v3.ok?'(accepted)':v3.errs.slice(0,2));
// 4 purpose value over cap
const d=JSON.parse(JSON.stringify(j)); d.id='pxd'; d.purpose.soul=['x'.repeat(500),'',''];
const v4=E.validateProfile(d); console.log('purpose value 500 chars: ok=',v4.ok, v4.ok?'(accepted)':v4.errs.slice(0,2));
// 5 wrong type avatar.version
const e=JSON.parse(JSON.stringify(j)); e.id='pxe'; e.avatar.version='three';
const v5=E.validateProfile(e); console.log('avatar.version string: ok=',v5.ok, v5.ok?'(accepted)':v5.errs.slice(0,2));
// 6 sessions token in record
const f=JSON.parse(JSON.stringify(j)); f.id='pxf'; f.token='abc';
const v6=E.validateProfile(f); console.log('token key: ok=',v6.ok, v6.ok?'(accepted)':v6.errs.slice(0,2));
console.log('avatar.mystery kept after validate?', v2.ok && ('mystery' in v2.profile.avatar));
// plan self-grant via import (tier four)
const g=JSON.parse(JSON.stringify(j)); g.id='pxg'; g.plan={tier:4};
const v7=E.validateProfile(g); console.log('plan:{tier:4} in import: ok=',v7.ok, v7.ok?JSON.stringify(v7.profile.plan):v7.errs.slice(0,2));
