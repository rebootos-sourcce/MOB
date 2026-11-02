'use strict';
/* Read-only TULA charge-cycle contract: run after canonical engine build. */
const A=require('node:assert/strict'),E=require(require('node:path').resolve(process.env.ENGINE||'engine.js'));
A.equal(typeof E.srcVoiceChargeCycle,'function');
A.equal(Object.values(E.SRC_TULA_LADDERS).reduce((n,a)=>n+a.length,0),63);
const cases=[
 ['I got pissed off',{family:'Anger',tulaRank:null,phase:'UNKNOWN',chargeDirection:'UNKNOWN'}],
 ['I was really pissed off',{family:'Anger',tulaRank:null}],
 ['That pissed me off',{family:'Anger',subject:'self'}],
 ['I pissed off my sister',{family:null}],
 ['I was not pissed off',{family:null}],
 ['Imagine I got pissed off',{family:null,subject:'hypothetical'}],
 ['She got pissed off',{family:'Anger',subject:'third_party'}],
 ['My father got pissed off',{family:'Anger',subject:'father'}],
 ['I felt annoyed',{family:'Anger',tulaRank:1}],
 ['I felt furious',{family:'Anger',tulaRank:6}],
 ['I felt livid',{family:'Anger',tulaRank:7}],
 ['I was outraged',{family:'Anger',tulaRank:8}],
 ['I felt embarrassed',{family:'Shame',tulaRank:1}],
 ['I felt humiliated',{family:'Shame',tulaRank:7}],
 ['I felt upset',{family:null,tulaRank:null}],
 ['I was horrified',{family:null,tulaRank:null}],
 ['At first I was annoyed. Later I became furious',{family:'Anger',phase:'BUILDING',chargeDirection:'INCREASING'}],
 ['I was furious. Then I settled down',{family:'Anger',phase:'PAST_REFLECTION',chargeDirection:'DECREASING'}],
 ['I got angry and stayed angry for hours',{phase:'STABLE',chargeDirection:'STABLE'}],
 ['After I shouted, I was still furious',{phase:'PAST_REFLECTION',chargeDirection:'CONTINUING',tulaRank:null}],
 ['After yelling I felt guilty, and then I got angrier',{phase:'PAST_REFLECTION',chargeDirection:'INCREASING',family:'Anger'}],
 ['Tomorrow I might get furious',{family:null,subject:'hypothetical',phase:'FUTURE_PROJECTION'}],
 ['I was furious, and I decided not to yell',{phase:'PEAK_OR_CHOICE',tulaRank:6}],
 ['I wanted to lash out but I didn’t',{phase:'PEAK_OR_CHOICE',family:null}],
 ['I got pissed off. Later I felt embarrassed',{phase:'PAST_REFLECTION',chargeDirection:'UNKNOWN'}]
];
let n=0;
for(const [t,exp] of cases){
 const out=E.srcVoiceChargeCycle([t]);
 for(const [k,v] of Object.entries(exp))A.deepEqual(out[k],v,JSON.stringify({text:t,field:k}));
 A.equal(out.coherence,'NOT_MEASURED');
 A.equal(out.curvePosition,'NOT_MEASURED');
 A.equal(out.graph,'NOT_QUERIED_BY_THIS_READER');
 A.equal(out.canWriteProfile,false);
 A.equal(out.automaticQuestions,false);
 n++;
}
let series=E.srcVoiceChargeCycle(['I got pissed off','Then I felt ashamed','After an hour I calmed down']);
A.equal(series.family,'Anger');A.equal(series.phase,'PAST_REFLECTION');A.equal(series.chargeDirection,'DECREASING');
series=E.srcVoiceChargeCycle(['I got pissed off','No, I wasn’t angry; I was scared']);
A.equal(series.family,null);A.equal(series.phase,'CORRECTED');
series=E.srcVoiceChargeCycle(['My father was angry. My grandfather was angry.']);
A.equal(series.subject,'family');
A.equal(E.srcVoiceChargeCycle([{text:'I got pissed off',role:'assistant'}]).status,'UNREAD');
A.equal(E.srcVoiceChargeCycle([{text:'I got pissed off',final:false}]).status,'UNREAD');
const privateRecord={name:'PRIVATE_NAME',id:'PRIVATE_ID'};
const withheld=E.srcVoiceChargeCycle(['I got pissed off'],{record:privateRecord,allowProfile:false});
A.equal(JSON.stringify(withheld).includes('PRIVATE'),false);
A.equal(JSON.stringify(privateRecord),JSON.stringify({name:'PRIVATE_NAME',id:'PRIVATE_ID'}));
A.deepEqual(E.srcVoiceChargeCycle(['I got pissed off']),E.srcVoiceChargeCycle(['I got pissed off']));
console.log('Source TULA charge cycle: '+n+' canonical-engine cases + 7 structural/privacy gates PASS');
