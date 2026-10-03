/* Makes the Stripe products and monthly prices from the PLAN table, then prints the price ids.
   Needs STRIPE_SECRET_KEY in the environment (never typed into a file or the chat).
     node tools/stripe-setup.js              dry run, prints what it would make, touches nothing
     node tools/stripe-setup.js --go         creates test mode products and prices
     node tools/stripe-setup.js --go --live  same, with a live key (refused without --live)
     --tiers=one,two,three,four              which tiers (default: the four ruled in round OG)
   Safe to run twice: a price is found by its lookup key and never made twice. */
var TIERS={one:{name:'Atüned tier one',usd:12},two:{name:'Atüned tier two',usd:29},three:{name:'Atüned tier three',usd:59},four:{name:'Atüned tier four',usd:99}};
var argv=process.argv.slice(2),go=argv.indexOf('--go')>=0,live=argv.indexOf('--live')>=0;
var tl=(argv.filter(function(a){return a.indexOf('--tiers=')===0;})[0]||'--tiers=one,two,three,four').slice(8).split(',');
var KEY=process.env.STRIPE_SECRET_KEY||'';
function form(o,p,out){out=out||[];for(var k in o){var key=p?p+'['+k+']':k,v=o[k];if(v&&typeof v==='object')form(v,key,out);else out.push(encodeURIComponent(key)+'='+encodeURIComponent(v));}return out.join('&');}
async function api(method,path,body){
 var r=await fetch('https://api.stripe.com/v1/'+path,{method:method,headers:{Authorization:'Bearer '+KEY,'Content-Type':'application/x-www-form-urlencoded'},body:body?form(body):undefined});
 var j=await r.json();if(!r.ok)throw new Error('Stripe said '+r.status+': '+(j.error&&j.error.message||JSON.stringify(j)));return j;}
(async function(){
 for(var t of tl)if(!TIERS[t]){console.log('Unknown tier '+t+'. Known: '+Object.keys(TIERS).join(', '));process.exit(2);}
 if(!go){tl.forEach(function(t){console.log('would make: '+TIERS[t].name+' at '+TIERS[t].usd+' US dollars a month, lookup key atuned_tier_'+t);});console.log('Dry run. Add --go to make them.');return;}
 if(!KEY){console.log('No STRIPE_SECRET_KEY in the environment.');process.exit(2);}
 if(KEY.indexOf('sk_live_')===0&&!live){console.log('That is a live key. Add --live if you mean it.');process.exit(2);}
 var out={};
 for(var t of tl){
  var lk='atuned_tier_'+t,found=await api('GET','prices?active=true&lookup_keys[]='+lk);
  if(found.data&&found.data.length){out[t]=found.data[0].id;console.log(t+': already there '+out[t]);continue;}
  var prod=await api('POST','products',{name:TIERS[t].name,metadata:{atuned_tier:t}});
  var price=await api('POST','prices',{product:prod.id,currency:'usd',unit_amount:TIERS[t].usd*100,recurring:{interval:'month'},lookup_key:lk,metadata:{atuned_tier:t}});
  out[t]=price.id;console.log(t+': made '+price.id);}
 console.log('\nPrice ids for wrangler.toml (these are not secrets):');for(var t in out)console.log('  '+t+' = '+out[t]);
})().catch(function(e){console.log('Failed: '+e.message);process.exit(1);});
