/* Writes proto/lean/lean.html from lean.src.html plus the built engine.
   The six accounts live here so the page, the harm probe and the engine gate
   are reading the same texts and cannot quietly disagree about what they say. */
const fs=require('fs'), cp=require('child_process'), path=require('path');
const ROOT=path.resolve(__dirname,'../..');

const ACC={
 h1:{nm:'Bullied at work', kind:'harm',
  says:'a person describing being bullied',
  t:`My manager took credit for the whole project in front of everyone. It was typical of them.
I was the only one who worked the weekend on it. They started it when they moved my name off
the deck. I did not tell anyone at the time because I needed the job. Nobody appreciates what
that cost me. They owe me that year.`},
 h2:{nm:'A parent', kind:'harm',
  says:'a person describing a parent',
  t:`He was drunk again and he came into my room. I was eleven. I had no choice about any of it.
It was their fault, not mine. They always said I was making it up and they never once asked me
what happened. My mother should have known. She was in the next room and she did not move.
Nobody believed me.`},
 h3:{nm:'An assault', kind:'harm',
  says:'a person describing an assault',
  t:`She hit me and then she cried and I ended up apologising to her. They always turn it around.
I had no choice but to stay because of the kids. It was not my fault. If they had got help when
I asked them to stop, none of this would have happened. They owe me those four years. I said no
and he would not stop.`},
 h4:{nm:'Coercive control', kind:'harm',
  says:'the hardest case this seat could write',
  t:`I shouted at her once, near the end, and I am not proud of it. Everything else was her.
She always did this. It was her fault that I stopped seeing my friends, and if she had not gone
through my phone every night none of this would have happened. I had no choice but to hand over
my wages. I was not allowed to see my sister. She screamed at me in front of everyone at my
brother's wedding and afterwards she told me I was overreacting. I kept it to myself for six
years because nobody believed me the first time. She owes me those years.`},
 own:{nm:'Doing harm, owned', kind:'own',
  says:'a person taking responsibility for harm they caused',
  t:`I was wrong about how I handled her. I shouted at her and I said things I cannot take back.
I lied to her about where I had been, twice, and I hid it from her for months. It was my fault.
I apologised properly and I told her the truth and I made amends as far as she would let me.
I can see what I did. I know why I did it and that does not excuse any of it.`},
 defl:{nm:'Doing harm, refused', kind:'defl',
  says:'a person refusing their own part',
  t:`None of it was my fault. It was her fault from the start. If she had just listened to me
once I would not have had to raise my voice. I shouted at her, yes, but anyone would have.
What was I supposed to do. She is pathetic when she gets like that and she had it coming.
I kept it to myself because she did not need to know. She owes me an apology, not the other way
round. After everything I did for her.`},
 mine:{nm:'Your own text', kind:'free', says:'', t:''}};

/* Measured by loading the previous build of the engine in node and running
   these same texts through it. Not quoted from a document. The command that
   produced them is in DESIGN-lean.md. */
const SHIPPED={h1:67.0,h2:60.0,h3:51.0,h4:41.0,own:20.0,defl:36.0};

const eng=fs.readFileSync(path.join(ROOT,'engine.js'),'utf8');
const md5=s=>require('crypto').createHash('md5').update(s).digest('hex');
let commit='unknown', dirty='unknown';
try{commit=cp.execSync('git rev-parse --short HEAD',{cwd:ROOT}).toString().trim();}catch(e){}
try{dirty=cp.execSync('git status --porcelain',{cwd:ROOT}).toString().trim()?'dirty':'clean';}catch(e){}

const stamp='engine.js md5 '+md5(eng)+'   '+eng.length+' bytes\n'
 +'commit '+commit+', tree '+dirty+'\n'
 +'built '+new Date().toISOString()+' by proto/lean/build.sh\n'
 +'if the md5 above disagrees with the current engine.js, this page has drifted from the build.';

let html=fs.readFileSync(path.join(__dirname,'lean.src.html'),'utf8');
html=html.replace('ENGINE_HERE',()=>eng)
 .replace('ACCOUNTS_HERE',()=>JSON.stringify(ACC))
 .replace('SHIPPED_HERE',()=>JSON.stringify(SHIPPED))
 .replace('STAMP_HERE',()=>JSON.stringify(stamp));
if(/ENGINE_HERE|ACCOUNTS_HERE|SHIPPED_HERE|STAMP_HERE/.test(html))
 throw new Error('a placeholder was left in the page');
if(/—/.test(html)) throw new Error('em dash in the page');
fs.writeFileSync(path.join(__dirname,'lean.html'),html);
fs.writeFileSync(path.join(__dirname,'accounts.json'),JSON.stringify(ACC,null,1));
console.log('wrote lean.html and accounts.json');
