/* ============================================================
   FILL, PROTOTYPE ONLY. The six reference ICPs, as if each typed their own
   details in. Every value is read off the product's own roster at run time
   (engine/data/people.js: FULLNAME, BIRTH, and each person's own archetypes
   and child emotion charge), except two, which are marked:

     zone   BIRTH carries a city, not a zone, so the zone is the IANA zone
            that city sits in.
     type   no ICP on file has a Myers-Briggs type. The one here is the
            panel's assumption, stated as each would state it, and James
            leaves it blank, which is what his record suggests he would do.

   A child emotion answer is the nearest point on the quiz's five step scale
   to the person's own held charge on that axis.
   ============================================================ */
var EN_ZONE={'Asheville, NC':'America/New_York','Chicago, IL':'America/Chicago','Portland, OR':'America/Los_Angeles',
 'Santa Fe, NM':'America/Denver','Boulder, CO':'America/Denver','Boston, MA':'America/New_York'};
var EN_TYPE_ASSUMED={Sofia:'INFJ',Diane:'ENTJ',Marcus:'INTP',Angela:'ENFP',Derek:'ESTJ',James:''};
var EN_FILL=(function(){
 var o={};
 ['Sofia','Diane','Marcus','Angela','Derek','James'].forEach(function(nm){
  var p=PEOPLE.filter(function(x){return x.nm===nm;})[0], b=BIRTH[nm]||{};
  var ans={}; CHARGES.forEach(function(c){var v=(p.c&&p.c[c])||0; ans[c]=Math.max(0,Math.min(4,Math.round(v/2.5)));});
  o[nm.toLowerCase()]={label:nm+', '+p.age, name:FULLNAME[nm], d:b.d, t:b.t, p:b.p, z:EN_ZONE[b.p]||'',
   type:EN_TYPE_ASSUMED[nm], arcs:[p.a1,p.a2], ans:ans};});
 o.owner={label:'His own three names',name:'Lance O’Neill Powell'};
 return o;})();
