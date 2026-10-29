#!/usr/bin/env node
'use strict';
// Regenerate MOB's read-only browser snapshot/adapter from a local authorized
// checkout of the private Reboot-OS feature branch. No network, no personal data.
// Example: node tools/regen-celestial-browser-bridge.cjs ../Reboot-OS --check
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),target=process.argv[2],check=process.argv.includes('--check');
if(!target){console.error('Usage: node tools/regen-celestial-browser-bridge.cjs <local-Reboot-OS-repo> [--check]');process.exit(2)}
const source=path.resolve(target),dataDir=path.join(source,'atuned/data/celestial');
const rel=x=>path.join('atuned/data/celestial',x),read=(p)=>fs.readFileSync(path.join(source,rel(p)),'utf8');
const sha=p=>cp.execFileSync('git',['-C',source,'hash-object',path.join(source,rel(p))],{encoding:'utf8'}).trim();
const nums=[1,2,3,4,5,6,7,8,9,11,22,33];
const paths=['western_astrology/records.json','eastern_astrology/animals.json',
 'composite/tri_system_readonly_crosswalk_v1.json',
 ...nums.map(n=>'numerology/records/number_'+n+'.json')];
const [west,east,cross,...numberRecords]=paths.map(p=>JSON.parse(read(p)));
const compact=x=>({
 id:x.id,canonical_name:x.canonical_name||x.label||x.id,
 essence:x.essence||null,gifts:x.gifts||[],shadows:x.shadows||[],
 behavioral_arc:x.behavioral_arc||null,behavior_energy_v1:x.behavior_energy_v1||null,
 interpretation:x.interpretation||null,score_permission:false,may_affect_coherence:false
});
const records=[...west.filter(x=>x.id.startsWith('western:sign:')).map(compact),
 ...east.filter(x=>x.id.startsWith('eastern:animal:')).map(compact),...numberRecords.map(compact)];
const crosswalk={crosswalks:cross.crosswalks.map(g=>({
 id:g.id,participants:g.participants,shared_theme:g.shared_theme,
 operational_definition:g.operational_definition,behavioral_hinge:g.behavioral_hinge,
 counterexamples:g.counterexamples||[],other_causes:g.other_causes||[],
 uncertainty:g.uncertainty,score_permission:false,may_affect_coherence:false,
 computational_effect:'none'
}))};
if(records.length!==36||crosswalk.crosswalks.length!==15)throw Error('Canon count changed: inspect source before accepting a different scope');
const ref='celestial/records-semantic-crosswalk-2026-10-28';
const manifest={schema:'atuned.celestial.mob_browser_snapshot.v1',
 origin_repo:'rebootos-sourcce/Reboot-OS',origin_ref:ref,
 source_sha:paths.map(p=>({path:rel(p).replaceAll(path.sep,'/'),sha:sha(p)})),
 record_count:36,group_count:15};
let snapshot='/* Generated read-only Source OS record projection. Direct source SHA inventory under .origin.source_sha. */\n';
snapshot+='var AT_CELESTIAL_SNAPSHOT='+JSON.stringify({origin:manifest,records,crosswalk})+';\n';
snapshot=snapshot.replace(/—/g,'\\u2014');
const modules=['source-ai-record-resolver.cjs','source-ai-behavioral-synthesis.cjs',
 'source-ai-reading-pipeline.cjs','human-design-peer-seam.cjs',
 'celestial-avatar-cascade.cjs','celestial-avatar-cascade-view.cjs'];
const code=modules.map(m=>({name:m,text:read('integration/'+m),sha:sha('integration/'+m)}));
let portal='/* GENERATED READ-ONLY CELESTIAL BROWSER BRIDGE, sourced from Reboot-OS feature branch.\n';
portal+=' * Source SHA provenance '+code.map(m=>m.name+':'+m.sha).join(' ')+' */\n';
portal+="var AT_CELESTIAL=(function(){'use strict';\n";
portal+="var mods={}; function unit(k,fn){var m={exports:{}};fn(m,function(dep){if(dep==='./celestial-parent-projection.cjs')return {buildCelestialParentProjection:function(){throw Error('Parent projection not loaded in this browser')}};if(!mods[dep])throw Error('Missing dependency '+dep);return mods[dep]});mods[k]=m.exports;}\n";
for(const m of code)portal+='unit('+JSON.stringify('./'+m.name)+',function(module,require){\n'+m.text+'\n});\n';
portal+="function src(){if(typeof AT_CELESTIAL_SNAPSHOT==='undefined')throw Error('Celestial snapshot missing');return AT_CELESTIAL_SNAPSHOT;}\n";
portal+="return {snapshot:src,build:function(args){var d=src();return mods['./celestial-avatar-cascade.cjs'].buildCelestialAvatarCascade(Object.assign({records:d.records,crosswalk:d.crosswalk},args||{}));},render:mods['./celestial-avatar-cascade-view.cjs'].renderCelestialAvatarCascade,mount:function(container,args){var d=src();return mods['./celestial-avatar-cascade-view.cjs'].mountCelestialAvatarCascade(container,Object.assign({records:d.records,crosswalk:d.crosswalk},args||{}));}};\n})();\n";
portal=portal.replace(/^function\s+/gm,'  function ').replace(/—/g,'-');
const outputs=[['atuned_src/engine/data/celestial_snapshot.js',snapshot],
 ['atuned_src/engine/celestial_portal.js',portal]];
let drift=false;
for(const [p,content] of outputs){
 const full=path.join(root,p),old=fs.existsSync(full)?fs.readFileSync(full,'utf8'):'';
 if(old!==content){
  drift=true;
  if(check)console.error('DRIFT '+p+'; regenerate and review source SHAs');
  else {fs.writeFileSync(full,content);console.log('REGENERATED '+p)}
 }else console.log('MATCH '+p);
}
if(drift&&check)process.exit(1);
console.log('READ-ONLY BRIDGE '+(drift?'updated':'up to date')+
 ' / 36 records / 15 groups / 6 modules / Reboot-OS source verified locally');
