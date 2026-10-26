/* node docs/data/compass/integration/v1/validate_cross_layer.cjs [--inferno /path/to/INFERNO_NORMALIZED_REGISTRY_V1.json] */
const fs=require("fs"),path=require("path"),crypto=require("crypto");
const root=path.resolve(__dirname,"../../../../.."),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const g=read("docs/data/compass/integration/v1/COMPASS_CROSS_LAYER_GRAPH_V1.json");
const T=read(g.sourceDigests.teachers.path),P=read(g.sourceDigests.paradiso.path);
const ids=new Set(g.nodes.map(x=>x.id)),errors=[];
if(ids.size!==g.nodes.length)errors.push("duplicate node id");
if(new Set(g.edges.map(x=>[x.from,x.to,x.type,x.status].join("|"))).size!==g.edges.length)errors.push("duplicate edge");
for(const x of g.edges)if(!ids.has(x.from)||!ids.has(x.to))errors.push("dangling: "+x.from+" -> "+x.to);
for(const x of T.records){if(x.researchPasses.length!==4)errors.push("research count "+x.id);for(const key of T.meta.requiredTemplateFields)if(!(key in x))errors.push("missing "+key+" on "+x.id);}
for(const x of T.records.filter(y=>y.kind==="compass_teacher"))for(const otherId of x.oppositeIds){const v=T.records.find(y=>y.id===otherId);if(!v||v.oppositeId!==x.id)errors.push("mirror reciprocity "+x.id);}
const tPairs=new Set(T.records.filter(x=>x.kind==="compass_teacher").flatMap(x=>x.candidateParadisoIds.map(id=>x.id+"|"+id)));
const pPairs=new Set(P.records.flatMap(x=>x.compassMasterResonances.map(y=>"compass-teacher:"+(y.name==="Lao Tzu"?"Lao-Tzu":y.name)+"|"+x.id)));
const oneSided=[...new Set([...tPairs,...pPairs])].filter(x=>tPairs.has(x)!==pPairs.has(x));
if(oneSided.length!==g.stats.teacherParadisoOneSided)errors.push("mapping drift");
if(g.nodes.length!==g.stats.nodes||g.edges.length!==g.stats.edges)errors.push("graph counts drift");
let archive="NOT_CHECKED";const idx=process.argv.indexOf("--inferno");if(idx!==-1){const file=process.argv[idx+1];if(!file||!fs.existsSync(file))errors.push("archive missing");else{const raw=fs.readFileSync(file),hash=crypto.createHash("sha256").update(raw).digest("hex");const d=JSON.parse(raw),actual=new Set(d.records.map(x=>x.id));if(hash!==g.infernoArchive.sha256)errors.push("Inferno SHA mismatch");if(actual.size!==38)errors.push("Inferno not 38");for(const n of g.nodes.filter(x=>x.kind==="inferno_archived_source"))if(!actual.has(n.id))errors.push("not in Inferno "+n.id);archive=hash===g.infernoArchive.sha256?"HASH_VERIFIED":"HASH_MISMATCH";}}
console.log(JSON.stringify({pass:errors.length===0,errors,nodes:g.nodes.length,edges:g.edges.length,oneSided,archive},null,2));if(errors.length)process.exit(1);
