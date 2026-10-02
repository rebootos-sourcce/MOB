/* frames.js. The registry of every frame in round PA's revision. shots.js reads
   it to photograph, make-index.js reads it to write the contact sheet.
   old: the matching PNG name in mockups/onboarding/png/ (null when new).
   scroll: a selector that scrolls inside itself at 390, photographed twice. */
var L=function(n,hash,extra){return Object.assign({png:'la-'+n,page:'login-a.html',hash:hash},extra||{});};
var O=function(png,hash,extra){return Object.assign({png:png,page:'onboarding.html',hash:hash},extra||{});};
var T=function(png,hash,extra){return Object.assign({png:png,page:'tutorial.html',hash:hash},extra||{});};
exports.list=[
 L('01-signin','signin'),L('02-typing','filled'),L('03-create','create'),L('04-create-ready','create-ready'),
 L('05-underage','underage'),L('06-error','error'),L('07-confirm','confirm'),L('08-dev','dev'),
 L('09-forgot','forgot'),L('10-forgot-sent','forgot-sent'),
 O('onb-01-start','start'),O('onb-01b-twelve-or-six','start-compare'),O('onb-02-start-picked','start-picked'),
 O('onb-03-feeling','feeling'),O('onb-04-story','story'),O('onb-05-story-voice','story-voice'),O('onb-06-forming','forming'),
 O('onb-07-mirror','mirror',{scroll:'.mr'}),O('onb-07b-mirror-wheel','mirror-wheel'),
 O('onb-08-notquite','mirror-notquite'),O('onb-08b-subject','mirror-subject'),O('onb-08c-second-reading','mirror-second',{scroll:'.mr'}),
 O('onb-09-mirror-adjust','mirror-adjust'),O('onb-10-mirror-empty','mirror-empty'),
 O('onb-11-somatic','somatic'),
 O('onb-12a-release-open','release-open'),O('onb-12b-release-run','release-run'),O('onb-12c-release-cool','release-cool'),
 O('onb-13-observe','observe'),O('onb-14-handoff','handoff'),O('onb-15-keep','keep'),
 T('tut-01-loop','t0'),T('tut-02-play','t1'),T('tut-03-flow','t2'),T('tut-04-embody','t3'),T('tut-05-landing','t4'),
 T('tut-q0-intro','q0'),T('tut-q1-integrity','q1'),T('tut-q1b-laws','laws',{scroll:'#ll'}),T('tut-q2-dilemma','q2'),T('tut-q3-archetype','q3'),
 {png:'strip-login',page:'strips.html',hash:'login',wait:500},
 {png:'strip-release-open',page:'strips.html',hash:'open',wait:500},
 {png:'strip-release-run',page:'strips.html',hash:'run',wait:500},
 {png:'strip-release-cool',page:'strips.html',hash:'cool',wait:500}
];
