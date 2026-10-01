/* strips.js. The two animated scenes as still frame strips. */
(function(){
var H=setHash()||'mirror';
var el=document.createElement('div');el.className='sp';document.body.appendChild(el);
var frames='',title,sub;
if(H==='mirror'){
 title='Mirror forming';sub='Six stages, one grammar word each. The same drawing code runs the live animation.';
 for(var i=0;i<6;i++){
  frames+='<figure class="fr"><div class="art">'+formSVG(formParams(i),{big:true,pulse:.5})+'</div>'
   +'<figcaption><span class="no">'+(i+1)+'</span><b>'+FORM_NAMES[i]+'</b><span>'+FORM_GRAM[i]+'</span></figcaption></figure>';}
}else{
 title='Release states';sub='Held, contracted, releasing, opening, settling, observing. One cluster, one colour, six states.';
 for(var j=0;j<6;j++){
  frames+='<figure class="fr"><div class="art">'+relSVG(REL_P[j])+'</div>'
   +'<figcaption><span class="no">'+(j+1)+'</span><b>'+REL_STATES[j]+'</b><span>'+REL_GRAM[j]+'</span></figcaption></figure>';}
}
el.innerHTML='<header><span class="eyebrow">Frame strip</span><h1>'+title+'</h1><p>'+sub+'</p></header><div class="grid">'+frames+'</div>';
document.body.style.overflow='auto';
})();
