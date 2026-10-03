#!/usr/bin/env node
/* ============================================================
   node proto/avatar/iam-questions/build.js  ->  questions.html

   The questions round on the avatar page, 26 September. Not a design and
   not a build of the comp: the comp as it renders today, with a numbered
   ring pinned to the region each question is about, and the question
   beside it carrying his own words. One file, nothing fetched.

   sheet.jpg and phone.jpg are screenshots of proto/avatar/iam/iam.html,
   Marcus at arrival, dark lighting, at 1600 and 390, taken off commit
   b5ded15. Retake them if the comp moves, or the pins point at nothing.
   ============================================================ */
'use strict';
var fs = require('fs'), path = require('path');
var HERE = __dirname;
function b64(f) { return 'data:image/jpeg;base64,' + fs.readFileSync(path.join(HERE, f)).toString('base64'); }

/* pins: question number, x and y in the screenshot's own pixels */
var SW = 1600, SH = 1118, PW = 390, PH = 1560;
var PINS = [[1, 800, 690], [2, 872, 232], [3, 606, 149], [3, 1006, 149], [4, 604, 372], [4, 1208, 470],
  [5, 186, 60], [6, 836, 121], [6, 836, 870], [7, 440, 1030], [8, 1472, 122], [9, 848, 1004],
  [10, 282, 122], [11, 312, 172], [11, 1246, 116]];
var PPINS = [[5, 360, 96], [5, 360, 700]];

function q(n, title, quote, now, ways, pic) {
  return { n: n, title: title, quote: quote, now: now, ways: ways, pic: pic };
}
var Q = [
 q(1, 'When your avatar improves, what should change on the body itself?',
  ['“What is Atuned? Your avatar.”', 'The rule on file from 20 September: a person watches their avatar improve.'],
  'Today every person gets the same grey figure. We measured it. Gordon, whose light has risen 6 per cent of the way from root to crown, and Marcus after six releases, at 56 per cent: about 1 pixel in 75 of the figure is different. Six releases change about 1 pixel in 180. The only thing that moves is a thin line of light up the spine. All fourteen reference people, from 6 per cent to 99, stand in the same body.',
  [['A', 'The masks carry it', 'Masks cover the figure, fill in as you write your story, and clear as you release, so light shows through. Your words: “the mask is blocking the light.” Costs six masks to draw and a rule for what fills and what clears.'],
   ['B', 'The body lights up', 'The whole figure goes from dark to lit as the light climbs. The cheapest. Says the least.'],
   ['C', 'The field around the body carries it', 'The torus in question 6. New geometry.'],
   ['D', 'All three, in layers', 'The most to build, and the most to read.']],
  'The same person at three moments, drawn four ways.'),
 q(2, 'The masks. What is their arc, and where do they sit?',
  ['25 September: “I want each mask to have a unique look... And as it fills in, you see the character clearly, and then eventually the character will disappear, and that’s what you want, you want to be clear, you want light to shine through. The mask is blocking the light.”',
   '20 September: “A side graphic in pixel mode, pixel art, made up of the chakra colours of our masks... Child mask, preteen mask, teen mask, adult mask, professional mask.”'],
  'The product holds six masks today: your five plus Ideological. None of them appears on this page. Our read of the arc: a mask starts faint, fills in as your stories name it, then fades as you release it. Is that right?',
  [['A', 'Worn on the face', 'One at a time, the heaviest one showing.'],
   ['B', 'A strip beside the body', 'All six, each filling and fading on its own.'],
   ['C', 'Over the seats they belong to', 'Each mask laid over its own circles.'],
   ['', 'And the style', 'Still pixel art, as you first said, or a drawn look that is different for each mask?']],
  'One mask empty, full and clearing, in both styles, placed all three ways.'),
 q(3, 'Whose left: yours as you read the page, or the body’s own?',
  ['25 September: “On the left side are the things that you currently are that you want to change, and the right side are the things that you want to become.”',
   'And on the release: “The right side is always a little bit softer, because it’s the interior world.”'],
  'The page is the wrong way round today. “Installed”, which is who you are becoming, sits on the left. “Held”, which is what you carry now, sits on the right. The page was drawn before your answer and was never flipped. That part is ours to fix. What is left is a real question. The avatar faces you, so its own left hand is on your right.',
  [['A', 'The reader’s left', 'Now on the left of the screen and becoming on the right, like a before and after page.'],
   ['B', 'The body’s own left', 'Now on the avatar’s left, which is the right of the screen, so the sides match the left and right channels you release.']],
  'Both, side by side, on the same person.'),
 q(4, 'What goes in each cell beside a circle?',
  ['25 September: “It’s almost like there’s an option for you to record your story... the software just automatically populates the tags within the field.”',
   'Then, of the boxes: “yeah you’re doing it, yeah you’re doing it”, and you caught yourself: “the percent complete going around the circle does the same thing.”'],
  'Today there are 216 small boxes on the sheet, 11 pixels each, one for every address at that seat. You also worried about a length limit on words that fill in on their own.',
  [['A', 'Your words', 'Short tags from your stories on the left, tags for who you are becoming on the right. Filled in by the software, with a length limit.'],
   ['B', 'A streak', 'One mark for each day you ran that seat’s ritual or affirmation.'],
   ['C', 'Addresses', 'As now.'],
   ['D', 'Words on the left, a streak on the right', 'What you are releasing, set against what you are practising.']],
  'One row, the throat, drawn four ways.'),
 q(5, '“Very visual to start.” What does someone see first?',
  ['26 September: “This iam page is going to need a lot of work... It needs to be very visual to start.”'],
  'The sheet opens today with 363 words and 216 boxes around the body. On a phone, the Who card comes first and the body is one screen below it (pins 5 on the phone picture).',
  [['A', 'The body alone', 'Numbers appear when you touch a seat.'],
   ['B', 'The body and one line', 'The line says what to do next.'],
   ['C', 'Everything at once', 'As now.'],
   ['', 'And on a phone', 'Body first, or name first?']],
  'The phone, drawn all three ways.'),
 q(6, 'The torus. What shape is it, and do the four outer points live on it?',
  ['25 September: “A torus field around the character... the flow of the channels determines the flow of your torus field.”',
   '26 September, where the message cut off: “what about that torus field around the body as an overlay? I think that does make a difference, and that determines whether we’re going to keep Gaia, Earth, Soul, Stellar”'],
  'On the 26th you ruled to hide the four outer points (Gaia Gateway, Earth Star, Sol Star, Stellar Gateway) from every view. This page still shows them as four small circles above and below the body.',
  [['', 'Its shape', 'Should the torus change with your seats: fuller where the light flows, pinched where a seat is blocked?'],
   ['', 'The four points', 'Bring them back as the top and bottom of the torus, where its axis leaves the body, or keep them hidden?'],
   ['', 'When it shows', 'Always on, or a layer you switch on?']],
  'Three torus shapes on one person.'),
 q(7, 'The loop on this page. Four weeks, or one lap per story?',
  ['20 September: “We’re showing a core game loop mechanic.” The rule on file: wherever discover, play, flow and embody appear together, they close into a circle.'],
  'The page draws the four as a row, labelled week 1 to week 4, under “This month”. The row breaks your rule. That part is ours to fix. The open question is what the loop counts on this page.',
  [['A', 'A calendar month', 'One stage for each week.'],
   ['B', 'One lap per story', 'A story is discovered, played, flowed and embodied. You can have several laps going at once.'],
   ['C', 'One lap per seat', 'Seven rings, one for each circle on the body.']],
  'One ring, set against several rings.'),
 q(8, 'Badges. What does someone earn, and for what?',
  ['25 September: “These are not badges. We need to design a whole badge system.”'],
  'The whole right hand column is still the badge pairs you turned down: Hero and Victim, Good guy and Bad guy, Forgive and Forget, Love and Hate, Parent and Teacher.',
  [['', 'What earns one', 'A full lap of the loop, a run of releases, a mask cleared, a seat passing a mark, a practice kept for a number of days. Or something else.'],
   ['', 'Can one be lost', 'Yes or no.'],
   ['', 'Who sees them', 'Only you, or your practitioner too, once there are accounts.'],
   ['', 'How many', 'A few rare ones in a lifetime, or dozens.'],
   ['', 'Until the system exists', 'Take the column off the page, or keep it as a marked empty space.']],
  ''),
 q(9, 'Purpose map and boundary. On the sheet, or opened from it? And whose six names?',
  ['25 September: “The up triangle is the self’s three primary values, the down triangle is the ego’s three primary values... the six sides, that whole shape makes the boundary... the first one is myself, what are the five things I must do for myself before anybody else all the time.”'],
  'Today it is a small star at the bottom of the page that says “Nothing written yet”.',
  [['A', 'Large, on the sheet', 'The purpose map drawn as big as the body.'],
   ['B', 'A small mark that opens its own page', 'The sheet stays about the body.'],
   ['C', 'Behind the body', 'The shape the avatar stands inside.'],
   ['', 'Still open from 25 September', 'Your six sides are myself, relationship, friends, family, work and community. The code has partner, family, friends, community, coworkers and alone. Which six?']],
  'Where it sits, drawn all three ways.'),
 q(10, 'Character sheet. Which parts of a real one do you want by name?',
  ['“Does a character sheet here that could act as our Avatar page”, and “It’s the avatar page, it’s the character sheet.”',
   'On discipline and speciality: “what that should pull is a person’s archetype and some of their psycho-spiritual behavior.”'],
  'A tabletop character sheet has a class, a level, ability scores, an alignment, gear, feats and a backstory. Here they could be: class is the archetype, ability scores are the seven seats, gear is your practices and affirmations, feats are badges, backstory is your stories. The Who column still shows “Design” and “Leadership” as examples.',
  [['', 'Named, or in the background', 'Which of those slots should the page name outright?'],
   ['', 'A level', 'Is there one? The points and badge ladder is in scope for the accounts product.'],
   ['', 'Behaviour', 'For discipline and speciality: the heaviest seat, the mask worn most, or the leading pattern?']],
  'A sheet with every slot labelled.'),
 q(11, 'Words. Two small ones.',
  ['26 September, on the channels: “believing, perceiving, thinking, behaving, acting, feeling. Those are the channels we’re using.”',
   '25 September, on the circles: “the percent at which that one’s open.”'],
  'The rows read: I believe, I see, I speak, I feel, I am, I connect, I survive. The percent beside each circle is labelled “Conducts”.',
  [['', 'The row verbs', 'Are the seven their own set, one for each seat, or should they match your six channels?'],
   ['', 'The percent', 'Label it “open”, your word, in place of “conducts”?']],
  '')
];

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function pin(p, W, H) {
  return '<a class="pin" href="#q' + p[0] + '" style="left:' + (100 * p[1] / W).toFixed(2) + '%;top:' + (100 * p[2] / H).toFixed(2) + '%" aria-label="Question ' + p[0] + '">' + p[0] + '</a>';
}
var qs = Q.map(function (x) {
  return '<article class="q" id="q' + x.n + '"><div class="qh"><span class="qn">' + x.n + '</span><h2>' + esc(x.title) + '</h2></div>'
    + x.quote.map(function (t) { return '<blockquote>' + esc(t) + '</blockquote>'; }).join('')
    + '<p class="now">' + esc(x.now) + '</p>'
    + '<div class="ways">' + x.ways.map(function (w) { return '<div class="way">' + (w[0] ? '<span class="l">' + w[0] + '</span>' : '<span class="l e"></span>') + '<div><b>' + esc(w[1]) + '</b> ' + esc(w[2]) + '</div></div>'; }).join('') + '</div>'
    + (x.pic ? '<p class="pic"><span class="ring"></span>Ask this with a picture: ' + esc(x.pic) + '</p>' : '')
    + '</article>';
}).join('');

var html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
+ '<title>I am, questions</title><style>'
+ ':root{--bg:#0c0d12;--panel:#15171f;--ink:#e8e9ee;--mid:#a3a7b5;--dim:#6d7282;--line:#2a2d39;--acc:#7eb8d4}'
+ '*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}'
+ '.wrap{max-width:1280px;margin:0 auto;padding:32px 16px 80px}'
+ 'h1{font-size:32px;margin:0 0 6px;font-weight:650}.lede{color:var(--mid);max-width:760px;margin:0 0 24px}'
+ '.shot{position:relative;border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:0 0 12px}.shot img{display:block;width:100%;height:auto}'
+ '.pin{position:absolute;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;border:2px solid var(--acc);background:rgba(12,13,18,.82);color:var(--ink);font:600 13px/24px system-ui,sans-serif;text-align:center;text-decoration:none;box-shadow:0 0 0 3px rgba(12,13,18,.6)}'
+ '.pin:hover,.pin:focus{background:var(--acc);color:var(--bg);outline:none}'
+ '.cap{color:var(--dim);font-size:13px;margin:0 0 36px}'
+ '.two{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:32px;align-items:start}'
+ '.phone{position:sticky;top:16px}.phone .shot{max-width:300px}'
+ '.q{border-top:1px solid var(--line);padding:28px 0}.qh{display:flex;gap:14px;align-items:baseline}'
+ '.qn{flex:0 0 32px;height:32px;border:2px solid var(--acc);border-radius:50%;text-align:center;font:600 14px/28px system-ui,sans-serif}'
+ 'h2{font-size:21px;line-height:1.3;margin:0 0 12px;font-weight:620}'
+ 'blockquote{margin:0 0 10px 46px;padding:2px 0 2px 14px;border-left:2px solid var(--line);color:var(--ink);font-style:italic}'
+ '.now{margin:12px 0 14px 46px;color:var(--mid)}'
+ '.ways{margin-left:46px;display:grid;gap:8px}.way{display:flex;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 14px}'
+ '.way .l{flex:0 0 22px;height:22px;border:1.5px solid var(--mid);border-radius:50%;text-align:center;font:600 12px/19px system-ui,sans-serif;color:var(--mid);margin-top:2px}.way .l.e{border-style:dotted}'
+ '.pic{margin:14px 0 0 46px;color:var(--acc);font-size:14px;display:flex;gap:8px;align-items:center}.ring{width:12px;height:12px;border:2px solid var(--acc);border-radius:50%;flex:0 0 12px}'
+ '@media (max-width:900px){.two{grid-template-columns:1fr}.phone{position:static}blockquote,.now,.ways,.pic{margin-left:0}.pin{width:22px;height:22px;font-size:11px;line-height:18px}}'
+ '</style></head><body><div class="wrap">'
+ '<h1>I am, questions</h1>'
+ '<p class="lede">The avatar page as it renders today, Marcus at arrival. Each ring marks the part of the page a question is about. Press a ring to jump to its question. Nothing here is a new design. Your answers set the next one.</p>'
+ '<div class="shot"><img src="' + b64('sheet.jpg') + '" alt="The avatar page at desktop width, with numbered rings on each region a question is about">' + PINS.map(function (p) { return pin(p, SW, SH); }).join('') + '</div>'
+ '<p class="cap">Desktop, 1600 wide. Screenshot of proto/avatar/iam/iam.html, 26 September.</p>'
+ '<div class="two"><div>' + qs + '</div>'
+ '<aside class="phone"><div class="shot"><img src="' + b64('phone.jpg') + '" alt="The avatar page on a phone, the name card first and the body below it">' + PPINS.map(function (p) { return pin(p, PW, PH); }).join('') + '</div><p class="cap">Phone, 390 wide, first two screens.</p></aside></div>'
+ '</div></body></html>';
if (/—/.test(html)) { console.error('an em dash reached the page'); process.exit(1); }
fs.writeFileSync(path.join(HERE, 'questions.html'), html);
console.log('questions.html ' + Math.round(html.length / 1024) + ' KB, ' + Q.length + ' questions, ' + PINS.length + ' pins');
