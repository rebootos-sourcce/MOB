/* strips.js. The animated frames as still frame strips. Each cell is the real
   page in an iframe, held at one moment by a query, so the strip is the live
   code and not a drawing of it. Hash: login | open | run | cool */
(function(){
var H=setHash()||'login';
var M=innerWidth<=700,IW=M?390:1600,IH=M?844:1000;
var S={
 login:{title:'Login: the ring',sub:'The ring is state, not decoration. Waiting breathes and sweeps. A character in the username lights one tick in the Throat sector. A character in the passphrase lights one tick in the Root sector and a pair of nodes on the inner path. Confirm lights every tick. A mismatch stops the path and splits it.',
  src:function(q){return 'login-a.html#'+q;},
  f:[['s-u0-p0','Waiting','Nothing typed. The ticks breathe, one short arc turns once in 48 seconds. Motion means: nobody has said anything yet.'],
     ['s-u4-p0','Four characters','Four ticks light in the Throat sector, the name said aloud. The sweep has faded: a ring that keeps turning while you type is watching the wrong thing.'],
     ['s-u10-p0','A name placed','Ten ticks, and a node at the top of the inner path.'],
     ['s-u10-p6','Passphrase begins','Root ticks light, six pairs of nodes light, the path draws down both sides.'],
     ['s-u10-p14','Passphrase, most of the way','Fourteen pairs. Twenty closes the path.'],
     ['s-u10-p14-ok','Confirmed','Every tick reads full, the path is closed, one ring leaves outward.']]},
 open:{title:'Release: the opening on the voice',sub:'It opens on the recorded voice. The intro text is one screen and writes out as the words are said. At the prompt the line writes out, freezes and pulses. No number and no word sits under it. The ticks of the ring lengthen with the voice.',
  src:function(q){return 'onboarding.html?'+q+'#release-open';},
  f:[['c=8','The voice starts','The first line begins to write. The ring moves with the voice.'],
     ['c=70','Intro, two lines','Lines are written, then settle to a dimmer value so the line being said is the brightest.'],
     ['c=150','Intro done','All four intro lines are written. Nothing else has started.'],
     ['c=172','The prompt writes','“I am releasing” writes out, then the pattern in the person’s own words.'],
     ['c=999','Frozen','The line is whole. It stops writing and pulses a little, as a reminder.'],
     ['c=999&pulse=1','Pulse, peak','The halo at its widest, then back. The loop is three seconds.']]},
 run:{title:'Release: the run',sub:'Address by address. Four lines at each address: left release, right release, left install, right install. Left and right are the counter, so there is no timer. Release is a ring that empties. Install is a ring that fills. Twelve lines in all.',
  src:function(q){return 'onboarding.html?'+q+'#release-run';},
  f:[['i=0&p=.2','Line 1, left release','The first ring begins to empty. Fear is the address, at 62 percent.'],
     ['i=1&p=.6','Line 2, right release','Left release is done. Right release empties.'],
     ['i=2&p=.5','Line 3, left install','Both releases are done. Left install fills. The line changes from releasing to the truth.'],
     ['i=3&p=.9','Line 4, right install','The last of the four. Fear reads 24 percent.'],
     ['i=5&p=.55','Line 6, second address','Anger is now the address. Fear is done and dims.'],
     ['i=10&p=.4','Line 11, third address','The twelve line path is nearly full.']]},
 cool:{title:'Release: the cooldown',sub:'Stop the work. The charge moves up and out. Notice which place answers. Two minutes of awareness inside the body: the one clock left.',
  src:function(q){return 'onboarding.html?'+q+'#release-cool';},
  f:[['t=118','Start','The ring is full.'],['t=84','About a third gone','The third line is the brightest: notice which place answers.'],['t=30','Nearly done','A quarter of the ring is left.']]}
};
var D=S[H]||S.login,out='',i=0;
D.f.forEach(function(fr){i++;
 out+='<figure class="fr"><div class="art" data-w="'+IW+'" data-h="'+IH+'"><iframe title="'+fr[1]+'" src="'+D.src(fr[0])+'" width="'+IW+'" height="'+IH+'" scrolling="no" tabindex="-1"></iframe></div>'
  +'<figcaption><span class="no">'+i+'</span><b>'+fr[1]+'</b><span>'+fr[2]+'</span></figcaption></figure>';});
var el=document.createElement('div');el.className='sp';document.body.appendChild(el);
el.innerHTML='<header><span class="eyebrow">Frame strip</span><h1>'+D.title+'</h1><p>'+D.sub+'</p></header><div class="grid">'+out+'</div>';
document.body.style.overflow='auto';
function fit(){[].slice.call(document.querySelectorAll('.art')).forEach(function(a){
 var w=+a.getAttribute('data-w'),h=+a.getAttribute('data-h'),s=a.clientWidth/w;
 var fr=a.querySelector('iframe');fr.style.transform='scale('+s+')';a.style.height=Math.round(h*s)+'px';});}
fit();addEventListener('resize',fit);
})();
