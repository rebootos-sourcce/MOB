
/* ============================================================
   SOURCE PROFILE SCHEMA v1 · the cross-compatibility contract.
   Every number in the app derives from this and nothing else.
   Versioned so a v2 can migrate rather than break.
   ============================================================ */
var SCHEMA_V=1;
function blankProfile(name){
 var p={v:SCHEMA_V, id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  name:name||'New profile', created:new Date().toISOString(), updated:null,
  soul:{doms:[0], arcs:[0,1], roots:[]},            /* the invariant */
  axes:{},                                          /* nine poled child fetters */
  laws:{}, intake:{answers:{}, done:[], startedAt:null, completedAt:null},
  story:{entries:[]}, rituals:[], history:[]};
 CHILD.forEach(function(c){p.axes[c.nm]={held:3,opp:0};});
 SI.forEach(function(l){p.laws[l.nm]=null;});        /* null = not yet measured */
 return p;}
function loadProfile(p){
 S.doms=(p.soul.doms||[0]).slice(); S.arcs=(p.soul.arcs||[0,1]).slice();
 S.roots=(p.soul.roots||[]).slice(); buildSoul();
 CHILD.forEach(function(c){var a=p.axes[c.nm]||{};
  S.charge[c.nm]=a.held!=null?a.held:3; S.replace[c.nm]=a.opp||0;});
 SI.forEach(function(l){S.law[l.nm]=(p.laws[l.nm]!=null)?p.laws[l.nm]:6;});
 return p;}
function saveProfile(p){
 p.soul={doms:S.doms.slice(),arcs:S.arcs.slice(),roots:S.roots.slice()};
 CHILD.forEach(function(c){p.axes[c.nm]={held:S.charge[c.nm],opp:S.replace[c.nm]||0};});
 SI.forEach(function(l){if(S.law[l.nm]!=null)p.laws[l.nm]=S.law[l.nm];});
 p.updated=new Date().toISOString(); p.v=SCHEMA_V;
 return p;}
/* a snapshot is what Analytics plots. derived only, never inputs. */
function snapshot(p){
 var r=compute();
 return {t:new Date().toISOString(), cq:Math.round(r.CQ*10)/10, dq:Math.round(r.DQ*100)/100,
  sq:Math.round(r.SQm*100)/100, pole:Math.round(r.poleMean*100)/100,
  jq:Math.round(r.JQ*100)/100, rad:Math.round(r.radiance*1000)/1000,
  loaded:r.loaded.length, sab:r.sabs.length, cx:r.cxs.length, hy:r.hys.length, ch:r.sups.length,
  dark:r.darkB, tier:r.tier, arch:ARCH[r.pi].nm};}
var PROFILES=[], CURP=null;
function pStore(){ try{ return JSON.parse(localStorage.getItem('source.profiles')||'[]'); }catch(e){ return []; } }
function pPersist(){ try{ localStorage.setItem('source.profiles',JSON.stringify(PROFILES)); }catch(e){} }
function pNew(name){ var p=blankProfile(name); PROFILES.push(p); CURP=p; pPersist(); return p; }
function pSave(){ if(!CURP)return null; saveProfile(CURP); pPersist(); return CURP; }
function pSnap(){ if(!CURP)return null; CURP.history.push(snapshot(CURP)); pPersist(); return CURP; }
function pExport(){ return JSON.stringify(CURP?saveProfile(CURP):null,null,1); }
function pImport(txt){ try{ var o=JSON.parse(txt); if(!o||!o.v)return null;
 PROFILES.push(o); CURP=o; loadProfile(o); pPersist(); return o; }catch(e){ return null; } }

