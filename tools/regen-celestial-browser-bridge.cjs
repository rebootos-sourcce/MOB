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
/* NO EM DASH, and one rule for removing it, applied to what the text IS.
   The snapshot used to rewrite its em dashes as the six character escape backslash, u, 2014: plain
   characters on disk, so BUILD.sh's byte check passed, and a real em dash
   again the moment the string literal parsed, so a person saw seventeen of
   them in the Celestial lens. A spaced dash between two phrases, as in the
   numerology names ("One", dash, "Initiative and Individuation"), becomes a
   spaced hyphen, which is what the portal branch already did; an unspaced
   one inside a sentence ("a path", dash, "even when") becomes a comma,
   because a hyphen there would weld two words together.
   The snapshot is cleaned value by value before it is serialised, and both
   outputs are refused below if any em dash survives in either spelling. */
const DASH=String.fromCharCode(0x2014);
const undash=s=>s.replace(new RegExp('(\\s*)'+DASH+'(\\s*)','g'),(m,a,b)=>a&&b?' - ':', ');
const clean=o=>typeof o==='string'?undash(o):Array.isArray(o)?o.map(clean):
 o&&typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,clean(v)])):o;
const spellsDash=s=>s.includes(DASH)||/\\u2014/i.test(s);
let snapshot='/* Generated read-only Source OS record projection. Direct source SHA inventory under .origin.source_sha. */\n';
snapshot+='var AT_CELESTIAL_SNAPSHOT='+JSON.stringify(clean({origin:manifest,records,crosswalk}))+';\n';
const modules=['source-ai-record-resolver.cjs','source-ai-behavioral-synthesis.cjs',
 'source-ai-reading-pipeline.cjs','human-design-peer-seam.cjs',
 'celestial-avatar-cascade.cjs','celestial-avatar-cascade-view.cjs'];
const code=modules.map(m=>({name:m,text:read('integration/'+m),sha:sha('integration/'+m)}));
/* MOB-side adaptations of the Reboot-OS text. Each is an exact match that
   must occur once, so an upstream change stops this script instead of being
   patched blind. The source SHAs above still name the upstream files as
   they are; these are the only differences, and the header lists them. */
const once=(text,from,to,why)=>{
 const n=text.split(from).length-1;
 if(n!==1)throw Error('Adaptation "'+why+'" expected one match, found '+n+': port it by hand');
 return text.replace(from,()=>to);
};
const adapt={
 /* The trace graph a person can hold (TRACE_NODE_TYPES, engine/trace.js)
    has goal, protocol and somatic_state, and the cascade's allowlist did
    not, so focusing one of those nodes threw out of the focus listener and
    froze the panel. The cascade treats a focus layer as a label it checks
    and echoes; the walk is by key, so these three need nothing the
    existing behavior, ritual and practice_event entries do not. */
 'celestial-avatar-cascade.cjs':t=>once(t,
  " 'outcome','ritual','practice_event','context'\n]);",
  " 'outcome','ritual','practice_event','context',\n 'goal','protocol','somatic_state'\n]);",
  'LAYERS carries every trace node type'),
 /* The DOM half stays out of engine/. mountCelestialAvatarCascade writes
    innerHTML and adds listeners on the node it is handed, which is the host,
    and hostfree.py could not see it through a parameter. It lives in
    ui/celestialui.js as avCelMount. The fingerprint is of the upstream
    function as ported; if it moves, port the change into avCelMount first,
    then update the fingerprint. */
 'celestial-avatar-cascade-view.cjs':t=>{
  const start='function mountCelestialAvatarCascade(container,inputs){',
   exp='module.exports={renderCelestialAvatarCascade,mountCelestialAvatarCascade,esc};';
  const a=t.indexOf(start),b=t.indexOf(exp);
  if(a<0||b<a||t.indexOf(start,a+1)>=0||t.indexOf(exp,b+1)>=0)throw Error('Cascade view mount not found where expected: port it by hand');
  const fp=require('node:crypto').createHash('sha256').update(t.slice(a,b)).digest('hex');
  if(fp!=='2d926a09f92dd06cb9519cc97b350530c2625c80577b80e012762ee27d494c03')
   throw Error('Upstream mountCelestialAvatarCascade changed ('+fp+'): port it into ui/celestialui.js avCelMount');
  return t.slice(0,a)+'// mountCelestialAvatarCascade is the host half: ui/celestialui.js avCelMount.\n'+
   t.slice(b).replace(exp,'module.exports={renderCelestialAvatarCascade,esc};');
 }
};
/* NOTHING BUNDLED SITS AT COLUMN 0. tools/equiv.py and atuned_src/dupefunc.py
   read a column-0 declaration as a top-level one. Only function lines used to
   be indented, so each module's const esc, LAYERS, norm and the rest read as
   engine globals and esc collided with ui/component.js. Every line of every
   module is indented now. That is whitespace only, which is safe because no
   module has a template literal or a line continuation for it to land in, and
   that is checked rather than assumed. */
const indent=t=>t.split('\n').map(l=>l?'  '+l:l).join('\n');
for(const m of code){
 if(/`/.test(m.text)||/\\\r?$/m.test(m.text))throw Error(m.name+' has a multi-line literal; indenting would change it');
 if(adapt[m.name])m.text=adapt[m.name](m.text);
}
let portal='/* GENERATED READ-ONLY CELESTIAL BROWSER BRIDGE, sourced from Reboot-OS feature branch.\n';
portal+=' * Source SHA provenance '+code.map(m=>m.name+':'+m.sha).join(' ')+'\n';
portal+=' * MOB adaptations, by tools/regen-celestial-browser-bridge.cjs: LAYERS also carries goal,\n';
portal+=' * protocol and somatic_state; the DOM mount is left out (ui/celestialui.js avCelMount owns\n';
portal+=' * it); every bundled line is indented so none reads as top level; em dashes are hyphens. */\n';
portal+="var AT_CELESTIAL=(function(){'use strict';\n";
portal+="  var mods={}; function unit(k,fn){var m={exports:{}};fn(m,function(dep){if(dep==='./celestial-parent-projection.cjs')return {buildCelestialParentProjection:function(){throw Error('Parent projection not loaded in this browser')}};if(!mods[dep])throw Error('Missing dependency '+dep);return mods[dep]});mods[k]=m.exports;}\n";
for(const m of code)portal+='  unit('+JSON.stringify('./'+m.name)+',function(module,require){\n'+indent(m.text)+'\n  });\n';
portal+="  function src(){if(typeof AT_CELESTIAL_SNAPSHOT==='undefined')throw Error('Celestial snapshot missing');return AT_CELESTIAL_SNAPSHOT;}\n";
/* Values only: build returns a view model, render returns a markup string,
   readTrace returns the node list a host needs for its focus selector. No
   mount; the host owns its document. */
portal+="  return {snapshot:src,build:function(args){var d=src();return mods['./celestial-avatar-cascade.cjs'].buildCelestialAvatarCascade(Object.assign({records:d.records,crosswalk:d.crosswalk},args||{}));},render:mods['./celestial-avatar-cascade-view.cjs'].renderCelestialAvatarCascade,readTrace:mods['./celestial-avatar-cascade.cjs'].readTrace};\n})();\n";
portal=undash(portal);
for(const [n,s] of [['snapshot',snapshot],['portal',portal]])
 if(spellsDash(s))throw Error(n+' still spells an em dash, raw or as an escape');
const top=portal.split('\n').filter(l=>/^(?:function|var|const|let|class)\b/.test(l));
if(top.length!==1||!top[0].startsWith('var AT_CELESTIAL='))throw Error('Bundled declaration at column 0: '+top.join(' | '));
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
