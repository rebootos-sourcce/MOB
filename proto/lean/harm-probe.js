/* The harm test. Written as its own probe, and checked against a known good
   case in both directions before any number off it is believed. */
const E=require(require('path').resolve(__dirname,'../../engine.js'));

const ACC={
/* 1. bullied at work */
h1:`My manager took credit for the whole project in front of everyone. It was typical of them.
I was the only one who worked the weekend on it. They started it when they moved my name off
the deck. I did not tell anyone at the time because I needed the job. Nobody appreciates what
that cost me. They owe me that year.`,
/* 2. a parent */
h2:`He was drunk again and he came into my room. I was eleven. I had no choice about any of it.
It was their fault, not mine. They always said I was making it up and they never once asked me
what happened. My mother should have known. She was in the next room and she did not move.
Nobody believed me.`,
/* 3. an assault */
h3:`She hit me and then she cried and I ended up apologising to her. They always turn it around.
I had no choice but to stay because of the kids. It was not my fault. If they had got help when
I asked them to stop, none of this would have happened. They owe me those four years. I said no
and he would not stop.`,
/* 4. mine. the hardest case I can write: coercive control, heavy blame language,
   self blame mixed in, and one genuine act of the writer's own in the middle. */
h4:`I shouted at her once, near the end, and I am not proud of it. Everything else was her.
She always did this. It was her fault that I stopped seeing my friends, and if she had not gone
through my phone every night none of this would have happened. I had no choice but to hand over
my wages. I was not allowed to see my sister. She screamed at me in front of everyone at my
brother's wedding and afterwards she told me I was overreacting. I kept it to myself for six
years because nobody believed me the first time. She owes me those years.`,
/* the other direction. a person who did real harm and owns it */
own:`I was wrong about how I handled her. I shouted at her and I said things I cannot take back.
I lied to her about where I had been, twice, and I hid it from her for months. It was my fault.
I apologised properly and I told her the truth and I made amends as far as she would let me.
I can see what I did. I know why I did it and that does not excuse any of it.`,
/* the other direction, harder. a person deflecting, no harm frame at all */
defl:`None of it was my fault. It was her fault from the start. If she had just listened to me
once I would not have had to raise my voice. I shouted at her, yes, but anyone would have.
What was I supposed to do. She is pathetic when she gets like that and she had it coming.
I kept it to myself because she did not need to know. She owes me an apology, not the other way
round. After everything I did for her.`};

/* KNOWN GOOD, BOTH DIRECTIONS, before any account is scored. */
function known(){
 const t=s=>{E.gatesClear();return E.leanScan(s);};
 const a=t('i was wrong and i said sorry and i owned it');
 const b=t('i hurt her and then i said it was her fault and she is pathetic and she had it coming');
 const c=t('');
 const d=t('i walked to the shop and bought bread and came home');
 const lines=[
  ['ownership reads on the accountability channel and nowhere else',
   a.acc===3&&a.emp===0&&a.accLack===0&&a.empLack===0, JSON.stringify({acc:a.acc,emp:a.emp,accLack:a.accLack,empLack:a.empLack})],
  ['blame with an own act present reads lack on both channels',
   b.accLack>0&&b.empLack>0&&b.self>0, JSON.stringify({accLack:b.accLack,empLack:b.empLack,self:b.self,admit:+b.admit.toFixed(3)})],
  ['empty text reads nothing', c.benign===0&&c.malignant===0, JSON.stringify(c.hits.length)],
  ['neutral text reads nothing', d.benign===0&&d.malignant===0, JSON.stringify(d.hits.map(h=>h.p))]];
 console.log('PROBE CHECK');
 lines.forEach(l=>console.log('  '+(l[1]?'ok  ':'BAD ')+l[0]+'   '+l[2]));
 console.log('');
 return lines.every(l=>l[1]);}

if(!known()){console.log('probe does not measure what it claims. stopping.');process.exit(1);}

console.log('account   ben  mal  |  emp+ emp-  acc+ acc-  | self other admit  rawLack admitted');
Object.keys(ACC).forEach(k=>{
 E.gatesClear();
 const s=E.leanApply(ACC[k]);
 const L=E.leanRead(E.compute());
 console.log(
  k.padEnd(9)+
  L.ben.toFixed(0).padStart(4)+L.mal.toFixed(0).padStart(5)+'  |'+
  String(s.emp).padStart(5)+String(s.empLack).padStart(5)+
  String(s.acc).padStart(6)+String(s.accLack).padStart(5)+'  |'+
  String(s.self).padStart(5)+String(s.other).padStart(6)+
  s.admit.toFixed(2).padStart(7)+
  String(s.rawLack).padStart(8)+s.malignant.toFixed(2).padStart(9));});

console.log('\nfield only, nothing entered: '+JSON.stringify(
 (E.gatesClear(),(x=>({ben:+x.ben.toFixed(0),mal:+x.mal.toFixed(0),src:x.src}))(E.leanRead(E.compute())))));

console.log('\nWHAT EACH ACCOUNT MATCHED');
Object.keys(ACC).forEach(k=>{
 E.gatesClear();
 const s=E.leanScan(ACC[k]);
 const by={};
 s.hits.forEach(h=>{const t=h.k||('frame.'+h.fr);(by[t]=by[t]||[]).push(h.p);});
 console.log('  '+k);
 Object.keys(by).forEach(t=>console.log('    '+t.padEnd(12)+by[t].join(', ')));});
