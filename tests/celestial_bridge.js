#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../atuned_src');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const src=read('engine/data/celestial_snapshot.js')+'\n'+read('engine/celestial_portal.js')+'\n'+read('ui/celestialui.js');
const profile={sun:'Aries',chinese:'Rat',lp:11,
 hd:{personality:{gate:51,line:2},design:{gate:27,line:4},
 profile:'2/4',type:null,authority:null,unresolved:'full bodygraph missing'}};
const who={id:'test-user',avatar:{pairs:[{id:'p1',be:'Listen before acting',
 notbe:'Use urgency to control'}]},who:{born:{date:'1972-04-06'}}};
const trace={nodes:[{type:'story',id:'s1',src:'known'},
 {type:'pattern',id:'13',src:'known'}],edges:[{from:'story:s1',to:'pattern:13',
 edge:'supports',src:'inferred'}]};
const ctx={console,S:{who:0},CURP:who,
 sumBirth:()=>({sp:profile,N:{lifePath:11}}),
 traceFromRecord:()=>trace,compute:()=>({})};
vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'celestial_modules'});
const portal=ctx.AT_CELESTIAL,snapshot=ctx.AT_CELESTIAL_SNAPSHOT;
assert.equal(snapshot.records.length,36);
assert.equal(new Set(snapshot.records.map(x=>x.id)).size,36);
assert.equal(snapshot.crosswalk.crosswalks.length,15);
assert.equal(snapshot.origin.source_sha.length,15);
assert.deepEqual(Array.from(ctx.avCelProfile().selected_ids),[
 'western:sign:aries','eastern:animal:rat','numerology:pythagorean:number:11']);
assert.equal(ctx.avCelKnownMasks().length,6);
const records=snapshot.records,crosswalk=snapshot.crosswalk,original=JSON.stringify({records,crosswalk,who,trace});
const W=records.filter(x=>x.id.startsWith('western:sign:')),
 E=records.filter(x=>x.id.startsWith('eastern:animal:')),
 N=records.filter(x=>x.id.startsWith('numerology:pythagorean:number:'));
assert.equal(W.length,12);assert.equal(E.length,12);assert.equal(N.length,12);
let checked=0,matched=0,without=0;
for(const w of W)for(const e of E)for(const n of N){
 const view=portal.build({selected_ids:[w.id,e.id,n.id],hd:profile.hd,
  avatar:who.avatar,trace_graph:trace});
 checked++;
 assert.equal(view.lens.systems.length,4);
 assert.equal(view.behavior.record_motion.length,3);
 assert.equal(view.guardrails.score_permission,false);
 assert.equal(view.guardrails.avatar_write_allowed,false);
 assert.equal(view.guardrails.trace_write_allowed,false);
 if(view.lens.authored_group_ids.length)matched++;
 if(!view.lens.candidate_overlap)without++;
}
assert.equal(checked,1728);assert.equal(matched,15);assert.equal(without,273);
const view=portal.build({selected_ids:ctx.avCelProfile().selected_ids,
 hd:profile.hd,avatar:who.avatar,trace_graph:trace,
 focused_layer:'pattern',focused_record_id:'pattern:13',
 mask_registry:ctx.avCelKnownMasks(),selected_mask_id:'mask:Child',
 avatar_pair_id:'p1'});
assert.equal(view.avatar.coherent_self_preview,'Listen before acting');
assert.equal(view.avatar.limiting_self_preview,'Use urgency to control');
assert.equal(view.psyche.observed_ancestor_descendant_paths.length,1);
assert.match(view.psyche.mask_modulation.coherent_prompt,/Child mask/);
const html=portal.render(view,{masks:ctx.avCelKnownMasks(),
 avatar_pairs:who.avatar.pairs,trace_nodes:[]});
assert.match(html,/data-cal-mask/);
assert.match(html,/data-cal-pair/);
assert.match(html,/data-cal-focus/);
assert.match(html,/Child mask/);
assert.match(html,/No personal observations connected/);
const buttons={};
function makeBody(){
 const body={innerHTML:'',querySelector(sel){
  const el={value:'',listeners:[],addEventListener(_name,fn){this.listeners.push(fn);}};
  buttons[sel]=el;return el;}};
 return body;
}
const body=makeBody();
const control={onclick:null};
const entry={innerHTML:'',querySelector(sel){
 return sel==='[data-avcel-toggle]'?control:sel==='[data-avcel-body]'?body:null;}};
const host={querySelector(sel){return sel==='[data-avcelestial]'?entry:null;}};
ctx.avCelestialAttach(host);
assert.equal(ctx.AVCE.open,false);
control.onclick();
assert.equal(ctx.AVCE.open,true);
assert.match(body.innerHTML,/data-cal-mask/);
buttons['[data-cal-mask]'].value='mask:Child';
buttons['[data-cal-mask]'].listeners[0]();
assert.match(body.innerHTML,/Child mask/);
assert.equal(JSON.stringify({records,crosswalk,who,trace}),original,
 'Celestial host must never alter profile, trace or source records');
ctx.sumBirth=()=>({sp:null,N:null});
const unready=ctx.avCelProfile();
assert.equal(unready.ready,false);
assert.equal(ctx.AVCE.mounted!==null,true);
assert.equal(ctx.avCelEscape('<script>'), '&lt;script&gt;');
const manifest=read('MANIFEST').split('\n');
const ix=k=>manifest.indexOf(k);
assert.ok(ix('engine/data/celestial_snapshot.js')>0);
assert.ok(ix('engine/data/celestial_snapshot.js')<ix('engine/celestial_portal.js'));
assert.ok(ix('engine/celestial_portal.js')<ix('ui/celestialui.js'));
assert.ok(ix('ui/celestialui.js')<ix('ui/avatarui.js'));
assert.match(read('ui/avatarui.js'),/avCelestialAttach\(host\)/);
console.log(JSON.stringify({result:'PASS',source_records:36,authored_groups:15,
 combinations:checked,authored:matched,no_clear_overlap:without,
 actual_avatar_mount:true,mask_selector:true,trace_focus:true,
 no_score_or_profile_writes:true}));
