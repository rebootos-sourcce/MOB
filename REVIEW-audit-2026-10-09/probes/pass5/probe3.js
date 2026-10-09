const E=require('./engine.js');
const mem={}; E.bindStore(k=>mem[k]===undefined?null:mem[k],(k,v)=>{mem[k]=v;});
const key=E.PRACTICE[0].k;
const p=E.profCreate('Round trip');
// avatar: ratings, weights, tags, identity, a pair with an id
const pair={be:'Someone who stays close.',notbe:'My chest aches when my partner goes quiet.',seat:'Heart'};
p.avatar=E.avatarBlank(); p.avatar.built=true; p.avatar.at=new Date().toISOString(); p.avatar.pairs=[pair];
E.avatarEnsureIds(p.avatar);
p.avatar.arch={Warrior:4}; p.avatar.load0[p.avatar.pairs[0].id]=3.5; p.avatar.tags={Heart:{add:['Betrayal'],off:[]}};
p.avatar.name='Quiet strength'; p.avatar.title='Steady'; p.avatar.description='Stays close.'; p.avatar.version=3; p.avatar.status='active';
p.purpose.soul=['freedom','knowledge','wisdom']; p.purpose.ego=['health','family','money']; p.purpose.sides.alone=['I rest on Sundays'];
p.rituals=[{t:new Date().toISOString(),track:'Somatic',band:'Root',steps:[key],min:20,when:'am',where:'home',done:true}];
const txt=E.pExport();
const j=JSON.parse(txt);
console.log('export top-level keys:',Object.keys(j).join(','));
console.log('export has avatar.arch/load0/tags/name/version/status/pairs[0].id:',JSON.stringify([j.avatar.arch,j.avatar.load0,j.avatar.tags,j.avatar.name,j.avatar.version,j.avatar.status,j.avatar.pairs[0].id]));
console.log('export has purpose:',JSON.stringify(j.purpose.soul),JSON.stringify(j.purpose.sides.alone));
console.log('export has rituals day log rows:',j.rituals.length);
console.log('export mentions plans/ritual-active/rule/atuned-:',/plans|ritual-active|atuned-avatar-side|"rule"/.test(txt));
// import into a clean store
const mem2={}; E.bindStore(k=>mem2[k]===undefined?null:mem2[k],(k,v)=>{mem2[k]=v;});
const r=E.pImport(txt);
console.log('pImport result:',JSON.stringify(r).slice(0,200));
const q=r&&r.avatar?r:(r&&r.ok&&r.profile)||r;
console.log('imported avatar:',JSON.stringify({arch:q.avatar.arch,load0:q.avatar.load0,tags:q.avatar.tags,name:q.avatar.name,ver:q.avatar.version,status:q.avatar.status}));
console.log('imported purpose.soul:',JSON.stringify(q.purpose.soul),'rituals:',q.rituals.length);
