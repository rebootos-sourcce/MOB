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

/* NO EM DASH REACHES A PERSON, measured on decoded values. The build gate
   reads raw bytes, and the snapshot once wrote its em dashes as the escape
   backslash u 2014, which is six plain characters on disk and a real em dash the moment
   the literal parses. So this walks what the strings ARE, not how they are
   spelled: every snapshot value, and every view and its markup across all
   1728 combinations. */
const DASH=String.fromCharCode(0x2014);
let dashes=[];
(function walk(o,p){
 if(typeof o==='string'){if(o.includes(DASH))dashes.push(p);}
 else if(o&&typeof o==='object')for(const k of Object.keys(o))walk(o[k],p+'.'+k);
})(snapshot,'snapshot');
assert.deepEqual(dashes,[],'decoded em dash in the Celestial snapshot');
for(const f of ['engine/data/celestial_snapshot.js','engine/celestial_portal.js'])
 assert.ok(!read(f).includes(DASH)&&!/\\u2014/i.test(read(f)),f+' spells an em dash, raw or escaped');
let viewsChecked=0;
for(const w of W)for(const e of E)for(const n of N){
 const v=portal.build({selected_ids:[w.id,e.id,n.id],hd:profile.hd,avatar:who.avatar,trace_graph:trace});
 const out=JSON.stringify(v)+portal.render(v,{masks:ctx.avCelKnownMasks(),avatar_pairs:who.avatar.pairs,trace_nodes:[]});
 assert.ok(!out.includes(DASH),'em dash reaches the lens for '+[w.id,e.id,n.id].join(' '));
 viewsChecked++;
}
assert.equal(viewsChecked,checked);

/* EVERY TRACE TYPE A PERSON CAN HOLD CAN BE FOCUSED. The focus selector
   lists every node in the real trace graph, so a node type the cascade does
   not know threw out of a change listener and froze the panel. Read the
   vocabulary off engine/trace.js itself, so a type added there later fails
   here rather than on somebody's screen. */
const traceSrc=read('engine/trace.js');
const vocab=new Function(traceSrc.match(/var TRACE_CHAIN=[^;]*;/)[0]+
 traceSrc.match(/var TRACE_NODE_TYPES=[\s\S]*?;/)[0]+'return TRACE_NODE_TYPES;')();
assert.ok(vocab.includes('goal')&&vocab.includes('protocol')&&vocab.includes('somatic_state'));
for(const t of vocab){
 const v=portal.build({selected_ids:['western:sign:aries','eastern:animal:rat',
  'numerology:pythagorean:number:11'],hd:profile.hd,
  trace_graph:{nodes:[{type:t,id:'n1',src:'known'}],edges:[]},
  focused_layer:t,focused_record_id:t+':n1'});
 assert.equal(v.psyche.focus.layer,t);
 assert.equal(v.psyche.focus.verified_in_trace,true,t+' focus must resolve');
}
/* And through the real panel: open it on a graph carrying the three types
   that used to throw, plus one no vocabulary knows, and pick each in turn
   through the focus selector's own change listener. */
const FAIL='Celestial lens is unavailable for these inputs; no data was changed.';
const wide={nodes:[{type:'story',id:'s1',src:'known'},{type:'goal',id:'g1',src:'known'},
 {type:'protocol',id:'p1',src:'known'},{type:'somatic_state',id:'b1',src:'known'},
 {type:'not_a_layer',id:'x1',src:'known'}],
 edges:[{from:'goal:g1',to:'story:s1',edge:'supports',src:'known'}]};
ctx.sumBirth=()=>({sp:profile,N:{lifePath:11}});
ctx.traceFromRecord=()=>wide;
ctx.AVCE.open=false;ctx.AVCE.who=null;
const body2=makeBody(),control2={onclick:null};
const entry2={innerHTML:'',querySelector(sel){
 return sel==='[data-avcel-toggle]'?control2:sel==='[data-avcel-body]'?body2:null;}};
const host2={querySelector(sel){return sel==='[data-avcelestial]'?entry2:null;}};
ctx.avCelestialAttach(host2);control2.onclick();
assert.match(body2.innerHTML,/data-cal-focus/);
for(const key of ['goal:g1','protocol:p1','somatic_state:b1']){
 const sel=buttons['[data-cal-focus]'];sel.value=key;
 assert.doesNotThrow(()=>sel.listeners[0](),key+' focus threw out of the listener');
 assert.match(body2.innerHTML,/Matched in supplied Trace Graph/,key+' did not render its focus');
 assert.equal(ctx.AVCE.mounted!==null,true);
}
/* A type nobody knows still cannot lock the panel: it says so and stops. */
const odd=buttons['[data-cal-focus]'];odd.value='not_a_layer:x1';
assert.doesNotThrow(()=>odd.listeners[0](),'unknown focus type threw out of the listener');
assert.equal(body2.textContent,FAIL);
assert.equal(ctx.AVCE.mounted,null);

/* THE ENGINE HALF DOES NOT TOUCH THE DOCUMENT, through a parameter or
   otherwise. hostfree.py looks for host globals by name, and the mount used
   to sit in engine/ reaching the page through an argument called container.
   Mounting is ui/celestialui.js's job. */
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'')
 .replace(/'(?:\\.|[^'\\\n])*'/g,'""').replace(/"(?:\\.|[^"\\\n])*"/g,'""');
assert.doesNotMatch(strip(read('engine/celestial_portal.js')),
 /\b(innerHTML|outerHTML|textContent|querySelector|querySelectorAll|getElementById|addEventListener|removeEventListener|insertAdjacentHTML|appendChild)\b/,
 'engine/celestial_portal.js touches the DOM');
assert.equal(typeof portal.mount,'undefined','the engine portal must not offer a mount');
assert.match(read('ui/celestialui.js'),/function avCelMount\(/);

/* NOTHING BUNDLED SITS AT COLUMN 0. tools/equiv.py and dupefunc.py read a
   column-0 declaration as a top-level one, so a module-private const esc
   read as the ui's own esc. The only top-level name is the portal. */
const col0=read('engine/celestial_portal.js').split('\n')
 .filter(l=>/^(?:function|var|const|let|class)\b/.test(l));
assert.deepEqual(col0.map(l=>l.slice(0,22)),['var AT_CELESTIAL=(func']);

console.log(JSON.stringify({result:'PASS',source_records:36,authored_groups:15,
 combinations:checked,authored:matched,no_clear_overlap:without,
 actual_avatar_mount:true,mask_selector:true,trace_focus:true,
 no_score_or_profile_writes:true,decoded_em_dashes:0,views_dash_checked:viewsChecked,
 focusable_trace_types:vocab.length,engine_dom_calls:0,bundled_col0_decls:0}));
