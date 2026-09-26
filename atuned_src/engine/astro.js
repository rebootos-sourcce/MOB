
/* ============================================================
   ASTRO. The actual sky, computed here, offline, from the birth
   record alone. No network, no API, no key.

   This module exists because the three derivations it replaces
   were placeholders. geneKey was the day of the month times
   three. hdOf was the birth hour plus the life path, modulo
   five. moonSign had the right period and a phase anchored to
   nothing, and it never read the birth time at all. They
   produced a value every time, which is what made them hard to
   see: a wrong answer and a right answer look identical when
   nobody checks.

   The arithmetic is Meeus, low precision series. Solar longitude
   lands inside about 0.01 degrees and lunar inside about 0.3.
   A zodiac sign is 30 degrees wide and a gene key gate is 5.625,
   so both are far tighter than the thing they decide. Buying
   arcseconds from an ephemeris library would refine a quantity
   whose input, a birth time a person half remembers, carries
   degrees. The precision has to sit where the error is.
   ============================================================ */

const DEG=Math.PI/180;
function _sin(d){return Math.sin(d*DEG);}
function _cos(d){return Math.cos(d*DEG);}
function _norm(d){return ((d%360)+360)%360;}

/* Julian Day from a civil date and a fractional hour in UT.
   The 4716 form is Meeus chapter 7 and it is valid for any date
   this product will ever see, including before 1970, which is
   where the old code went negative and silently wrapped. */
function julianDay(y,m,d,hours){
 if(m<=2){y-=1;m+=12;}
 var A=Math.floor(y/100), B=2-A+Math.floor(A/4);
 return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))
  +d+B-1524.5+(hours||0)/24;}

/* days from J2000.0, the epoch every series below is written against */
function j2000(jd){return jd-2451545.0;}

/* Sun's apparent ecliptic longitude in degrees. */
function sunLon(jd){
 var n=j2000(jd);
 var L=_norm(280.460+0.9856474*n);          /* mean longitude */
 var g=_norm(357.528+0.9856003*n);          /* mean anomaly */
 return _norm(L+1.915*_sin(g)+0.020*_sin(2*g));}

/* Moon's ecliptic longitude in degrees. The six correction terms
   carry it from about 5 degrees of error to about 0.3, which is
   the difference between a sign that is often wrong and one that
   is right except within a few minutes of a cusp. */
function moonLon(jd){
 var n=j2000(jd);
 var Lp=_norm(218.316+13.176396*n);         /* moon mean longitude */
 var M =_norm(134.963+13.064993*n);         /* moon mean anomaly */
 var Ms=_norm(357.529+0.98560028*n);        /* sun mean anomaly */
 var D =_norm(297.850+12.190749*n);         /* mean elongation */
 var F =_norm(93.272+13.229350*n);          /* argument of latitude */
 var l=Lp
  +6.289*_sin(M)
  -1.274*_sin(M-2*D)
  +0.658*_sin(2*D)
  -0.186*_sin(Ms)
  -0.059*_sin(2*M-2*D)
  -0.057*_sin(M-2*D+Ms)
  +0.053*_sin(M+2*D)
  +0.046*_sin(2*D-Ms)
  +0.041*_sin(M-Ms)
  -0.035*_sin(D)
  -0.031*_sin(M+Ms)
  -0.015*_sin(2*F-2*D)
  +0.011*_sin(M-4*D);
 return _norm(l);}

/* Greenwich mean sidereal time in degrees. */
function gmst(jd){
 var n=j2000(jd), T=n/36525.0;
 return _norm(280.46061837+360.98564736629*n+0.000387933*T*T);}

/* The ascendant: the ecliptic degree rising on the eastern horizon.
   THIS is what a birthplace is for. The old rising sign moved one
   sign per two hours from a fixed six o'clock sunrise and never
   read a latitude, which is why the same birth time in Quito and
   Reykjavik came out identical. They are not. */
function ascendant(jd,lat,lon){
 var lst=_norm(gmst(jd)+lon);               /* local sidereal time, east positive */
 var e=23.4392911;                          /* obliquity, near enough for a sign */
 var y=-_cos(lst), x=_sin(lst)*_cos(e)+Math.tan(lat*DEG)*_sin(e);
 var a=Math.atan2(y,x)/DEG;
 return _norm(a+180);}

/* a longitude to a zodiac sign index, 0 is Aries */
function signOf(lon){return Math.floor(_norm(lon)/30)%12;}
/* and the degree within that sign, which is what a cusp argument needs */
function degInSign(lon){return _norm(lon)%30;}

/* ---- the I Ching wheel ----
   64 gates around 360 degrees, so a gate is 5.625 wide and a line is
   0.9375. The wheel does not run 1 to 64 in order: it runs in the
   sequence below, and the sequence starts at 0 degrees Aries.

   RULING NEEDED. This order is the one in general circulation and it
   decides every gene key and every Human Design gate the product
   prints. It is the one table here that is a claim about someone
   else's system rather than about the sky, so it is isolated in one
   place, named, and asserted in the gate test against a known chart.
   Correct it here and everything downstream moves with it. */
const GATE_WHEEL=[25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,
 15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,
 46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,
 10,58,38,54,61,60,41,19,13,49,30,55,37,63,22,36];
const GATE_ARC=360/64;                       /* 5.625 degrees */

/* a longitude to its gate and line. */
function gateOf(lon){
 var L=_norm(lon);
 var i=Math.floor(L/GATE_ARC);
 var within=L-i*GATE_ARC;
 return {gate:GATE_WHEEL[i%64], line:Math.floor(within/(GATE_ARC/6))+1,
  lon:L, arc:within};}

/* The design sun sits 88 degrees of SOLAR ARC before the birth sun,
   not 88 days. Those differ by a couple of days because the earth
   does not move at a constant rate, which is the whole reason the
   real system solves for the longitude rather than subtracting days.
   Newton on a near linear function converges in two passes. */
function designJD(jd){
 var target=_norm(sunLon(jd)-88);
 var t=jd-88.0;                             /* days is the starting guess */
 for(var i=0;i<6;i++){
  var diff=_norm(sunLon(t)-target+180)-180;  /* signed, shortest way round */
  if(Math.abs(diff)<1e-6)break;
  t-=diff/0.9856474;}                        /* degrees per day */
 return t;}

/* ---- where a birth happened ----
   A birth time is recorded in local clock time, so turning it into a
   position in the sky needs the place and the rules that were in force
   that year. This is the part everyone skips, and skipping it is not
   a small error: one hour of offset moves the ascendant about fifteen
   degrees, which is half a sign. Latitude matters for the same reason.
   A record with no place gets no ascendant rather than a guessed one. */
const PLACE={
 'Asheville, NC': {lat:35.595, lon:-82.552, tz:-5, dst:'us'},
 'Chicago, IL':   {lat:41.878, lon:-87.630, tz:-6, dst:'us'},
 'Portland, OR':  {lat:45.515, lon:-122.679,tz:-8, dst:'us'},
 'Santa Fe, NM':  {lat:35.687, lon:-105.938,tz:-7, dst:'us'},
 'Boulder, CO':   {lat:40.015, lon:-105.271,tz:-7, dst:'us'},
 'Boston, MA':    {lat:42.360, lon:-71.059, tz:-5, dst:'us'},
 'Oaxaca, MX':    {lat:17.073, lon:-96.727, tz:-6, dst:'none'},
 'Lisbon, PT':    {lat:38.722, lon:-9.139,  tz:0,  dst:'eu'},
 'Greenwich, CT': {lat:41.027, lon:-73.629, tz:-5, dst:'us'}};

/* US daylight saving. The start moved in 2007 from the first Sunday in
   April to the second in March, and the end from the last Sunday in
   October to the first in November. A birth in late March 1985 and one
   in late March 2010 are an hour apart on the same clock reading. */
function _nthSunday(y,m,n){            /* n is 1 based, m is 1 based */
 var d=new Date(Date.UTC(y,m-1,1));
 var shift=(7-d.getUTCDay())%7;
 return 1+shift+(n-1)*7;}
function _lastSunday(y,m){
 var d=new Date(Date.UTC(y,m,0));      /* day 0 of next month is last of this */
 var last=d.getUTCDate();
 return last-((d.getUTCDay()+7)%7);}
function usDST(y,m,d){
 if(y>=2007){
  var s=_nthSunday(y,3,2), e=_nthSunday(y,11,1);
  return (m>3&&m<11)||(m===3&&d>=s)||(m===11&&d<e);}
 var s2=_nthSunday(y,4,1), e2=_lastSunday(y,10);
 return (m>4&&m<10)||(m===4&&d>=s2)||(m===10&&d<e2);}
function euDST(y,m,d){                 /* last Sunday March to last Sunday October */
 var s=_lastSunday(y,3), e=_lastSunday(y,10);
 return (m>3&&m<10)||(m===3&&d>=s)||(m===10&&d<e);}

/* ---- a time zone the person names ----
   Ruled 26 September: a person gives the time zone they were born in, by
   its IANA name such as Pacific/Auckland, and the offset for that date is
   computed here. The two functions above are the rules for two regions
   written by hand, and they are already wrong before 2007 in places: the
   US branch applies the 1987 rule to every earlier year. Writing them out
   for every zone is a table nobody here can keep current.
   Intl already carries that table. It is ECMAScript and not the host: it
   is in every browser this file runs in and in node, it makes no request,
   and it holds the historical rules, Nepal moving from +5:30 to +5:45 in
   1986 and Britain on +1 all year from 1968 to 1971. One formatter per
   zone is cached, because building one is slow and a render asks for the
   same zone several times. An unknown name, or a runtime with no Intl,
   is null and never a guess. */
var _ZFMT={};
function _zfmt(z){
 if(!z||typeof z!=='string')return null;
 if(_ZFMT[z]!==undefined)return _ZFMT[z];
 var f=null;
 try{ f=new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn',{timeZone:z, hourCycle:'h23',
   year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', second:'numeric'});
 }catch(e){ f=null; }
 return (_ZFMT[z]=f);}
/* the zone's offset from Greenwich at one instant, in milliseconds */
function _zoff(f,t){
 var q={}; f.formatToParts(new Date(t)).forEach(function(x){q[x.type]=+x.value;});
 return Date.UTC(q.year,q.month-1,q.day,q.hour,q.minute,q.second)-Math.floor(t/1000)*1000;}
/* Every offset at which this local clock reading really happened in zone z,
   in hours, or null for a zone this runtime cannot read. Usually one. Two
   when the clocks went back and the reading happened twice, and none when
   they went forward and it never happened at all, which is where a person
   who remembers 2:30 on that one night in spring actually lands. In both of
   those the caller gets the offsets either side and treats the birth as a
   window between them, the same as an unlocated one, rather than choosing. */
function zoneOffsets(z,y,m,d,hrs){
 var f=_zfmt(z); if(!f)return null;
 var L=Date.UTC(y,m-1,d)+Math.round(hrs*3600000);
 var a=_zoff(f,L-86400000), b=_zoff(f,L+86400000);
 var cand=(a===b)?[a]:[a,b];
 var real=cand.filter(function(o){return _zoff(f,L-o)===o;});
 return (real.length?real:cand).map(function(o){return o/3600000;});}

/* a birth record to a Julian Day in UT, and the offset that was applied.
   returns null when the record cannot support it, rather than guessing.
   d is the date, t the local clock time, p the place, z the time zone. */
function birthJD(bt){
 if(!bt||!bt.d)return null;
 var p=bt.d.split('-'), y=+p[0], m=+p[1], d=+p[2];
 if(!y||!m||!d)return null;
 var pl=PLACE[bt.p]||null;
 var hrs=12, timed=false;               /* no time given, take local noon */
 if(bt.t&&/^\d{1,2}:\d{2}/.test(bt.t)){
  var q=bt.t.split(':'); hrs=+q[0]+(+q[1])/60; timed=true;}
 var off=pl?pl.tz:0, dst=false;
 if(pl&&pl.dst==='us')dst=usDST(y,m,d);
 if(pl&&pl.dst==='eu')dst=euDST(y,m,d);
 if(dst)off+=1;
 /* A zone the person named outranks the table: it is their own statement
    about their own birth, and it carries the real rules for that year where
    the table carries two hand written ones. The place still supplies the
    horizon, which a zone cannot, so rising keeps needing a place. dst is
    null on this path because Intl answers the offset and not the reason. */
 var zo=bt.z?zoneOffsets(bt.z,y,m,d,hrs):null;
 if(zo){
  off=zo[0]; dst=null;
  var zspan=zo.length>1?[julianDay(y,m,d,hrs-Math.max(zo[0],zo[1])),
                          julianDay(y,m,d,hrs-Math.min(zo[0],zo[1]))]:null;
  return {jd:julianDay(y,m,d,hrs-off), place:pl, timed:timed, offset:off, dst:dst,
   span:(timed?zspan:null), zone:bt.z};}
 /* A PLACE THIS TABLE DOES NOT NAME IS AN UNKNOWN OFFSET, NOT OFFSET ZERO.
    The line above reads a missing place as Greenwich, so a clock time typed
    in Auckland was treated as the same clock time in London, thirteen hours
    out. Rising refused it, and the moon, both gates and the gene key were
    printed off the guessed instant as settled. Measured over four years of
    Auckland births at 08:00: the moon sign wrong on 349 of 1460 days, the
    gene key on 830, the sun sign on 26.
    So a timed record with no located place and no zone it can read, which
    is what reaches this line, also carries the two instants it could be, fourteen hours east of Greenwich and twelve west, which
    are the widest clock offsets in use. A reading that comes out the same at
    both ends is true whatever the place was. One that differs is refused by
    the caller. jd keeps the old guess so nothing that does not check the
    span moves in this change. An untimed record is not given one: its noon
    is already a guess of its own, and that is a separate question. */
 var span=(timed&&!pl)?[julianDay(y,m,d,hrs-14), julianDay(y,m,d,hrs+12)]:null;
 return {jd:julianDay(y,m,d,hrs-off), place:pl, timed:timed, offset:off, dst:dst, span:span};}
