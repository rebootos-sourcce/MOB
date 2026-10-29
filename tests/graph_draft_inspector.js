#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../atuned_src');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const profile={id:'primary-profile',who:{born:{date:'1990-03-01'}},
 avatar:{pairs:[]},CQ:53,DQ:37,SQ:21};
const before=JSON.stringify(profile);
const ctx={console,Promise,S:{who:0},CURP:profile,STORE_BOUND:false,
 sumBirth:()=>({sp:{sun:'Aries',chinese:'Rat'},N:{lifePath:11}})};
vm.createContext(ctx);
vm.runInContext(read('ui/auth.js'),ctx,{filename:'auth.js'});
assert.equal(ctx.GRAPH_DRAFT_INSPECTOR_ENABLED,false);
let network=0;
ctx.authCall=(method,url,body,token)=>{
 network++;
 assert.equal(method,'GET');assert.equal(url,'/v1/graph-drafts/primary');
 assert.equal(body,null);assert.equal(token,'example-test-session');
 return Promise.resolve({ok:true,status:200,body:{found:true,document:{
  schema:'atuned.graph.draft_sandbox.v1',owner_id:'account-1',graph_id:'primary',
  revision:3,versions:[{version:2,status:'published',graph:{
   v:1,nodes:[{type:'story',id:'x',src:'known'}],edges:[]}}]
 }}});
};
ctx.AUTH_S={token:'example-test-session',email:'synthetic@example.invalid',accountId:'account-1'};
async function go(){
 const disabled=await ctx.authGraphDraftRead('primary');
 assert.equal(disabled.status,503);
 assert.equal(network,0,'default disabled cannot call network');
 ctx.GRAPH_DRAFT_INSPECTOR_ENABLED=true;
 assert.equal((await ctx.authGraphDraftRead('primary')).ok,true);
 assert.equal(network,1);
 assert.equal((await ctx.authGraphDraftRead('../other')).status,400);
 ctx.S.who=1;
 assert.equal((await ctx.authGraphDraftRead('primary')).status,401);
 ctx.S.who=0;
 vm.runInContext(read('ui/celestialui.js'),ctx,{filename:'celestialui.js'});
 ctx.AT_CELESTIAL_SNAPSHOT={};
 ctx.AT_CELESTIAL={mount:()=>({destroy(){}})};
 const graphBtn={disabled:false,onclick:null},graphText={textContent:''};
 const graphRoot={innerHTML:'',querySelector(sel){
  if(sel==='[data-avcel-graph-read]')return graphBtn;
  if(sel==='[data-avcel-graph-status]')return graphText;
  return null;
 }};
 const toggle={onclick:null},body={innerHTML:'',textContent:''};
 const entry={innerHTML:'',querySelector(sel){
  if(sel==='[data-avcel-toggle]')return toggle;
  if(sel==='[data-avcel-body]')return body;
  if(sel==='[data-avcel-graph]'&&this.innerHTML.includes('data-avcel-graph'))return graphRoot;
  return null;
 }};
 const host={querySelector(sel){return sel==='[data-avcelestial]'?entry:null}};
 ctx.AVCE.open=true;
 ctx.avCelestialAttach(host);
 assert.match(entry.innerHTML,/data-avcel-graph/);
 assert.equal(typeof graphBtn.onclick,'function');
 graphBtn.onclick();
 await new Promise(resolve=>setImmediate(resolve));
 assert.match(graphText.textContent,/Account draft 2.*1 nodes.*0 links.*view only/);
 assert.equal(graphBtn.disabled,false);
 assert.equal(network,2);
 assert.equal(JSON.stringify(profile),before,'graph inspector cannot write profile or scores');
 ctx.S.who=1;
 ctx.avCelestialAttach(host);
 assert.ok(!entry.innerHTML.includes('data-avcel-graph'),'secondary local profile cannot see account draft control');
 ctx.S.who=0; ctx.GRAPH_DRAFT_INSPECTOR_ENABLED=false;
 ctx.avCelestialAttach(host);
 assert.ok(!entry.innerHTML.includes('data-avcel-graph'),'disabled build must not expose inspector control');
 assert.equal(JSON.stringify(profile),before);
 console.log(JSON.stringify({result:'PASS',worker_auth_seam:true,disabled_by_default:true,
  signed_in_primary_only:true,explicit_user_click:true,escaped_server_graph_content:true,
  account_draft_read:true,profile_mutations:0,CQ_DQ_SQ_unchanged:true,
  production_feature_enabled:false,native_editor_writes:false}));
}
go().catch(e=>{console.error(e);process.exitCode=1;});
