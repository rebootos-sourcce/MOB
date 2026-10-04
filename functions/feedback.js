/* ============================================================
   POST /feedback. THE RELAY FROM THE OUTBOX TO THE TEAM'S DISCORD.

   3 October, the owner: "Put Discord feedback in the profile. And when a
   person selects it, it takes them to the feedback page, that dumps the data
   into the customer service support on Discord."

   WHY THIS FILE EXISTS AND IS NOT IN THE APP. A Discord webhook address is a
   bearer credential: whoever holds it can post into that channel as this
   product. source.html is one file that every visitor downloads whole, so
   anything written into it is read by anybody who opens view source. The
   address therefore lives in one place only, the Cloudflare Pages
   environment variable DISCORD_FEEDBACK_WEBHOOK, and this Function is the
   only thing that reads it. It is never in this repository, never in a
   response, and never in a log line.

   WHY A PAGES FUNCTION AND NOT THE WORKER. ui/auth.js used to post to the
   reboot-os Worker's /v1/feedback, which needs a second deploy in a second
   repository and a cross origin request. This file ships with the site it
   serves: wrangler builds it from the functions/ directory in the directory
   the deploy step runs in, the repository root, and serves it at /feedback on the same
   host as atuned.html, so the app posts to a relative path and no CORS is
   involved.

   NOT A RATE LIMITER, AND IT SAYS SO. A Pages Function holds no state between
   requests, so it cannot count how often one address has posted. What is here
   is the cheap abuse resistance a stateless handler can do: a POST only, JSON
   only, a size ceiling, a closed key set, and no mention can ping anybody.
   Somebody with curl can still post well formed feedback as fast as Discord
   lets them. The real fix is a Cloudflare rate limiting rule on this path, or
   a KV or Durable Object counter, and it is named as open, not claimed.
   ============================================================ */

/* THE ENVELOPE, MIRRORED FROM engine/outbox.js. The engine is not bundled
   into this Function, so the two lists are copies, and a copy drifts.
   tests/discordfeedback.js loads both and fails if they differ, so a key
   added to OB_KEYS without being added here is a named failure, not a relay
   that refuses every entry the new client sends. */
export const FB_KEYS = ['kind', 'at', 'body', 'answers', 'band', 'build', 'platform', 'viewport'];
export const FB_KINDS = ['question', 'bug', 'rating', 'feedback', 'comment'];
/* the names the team reads, in the app's own words. "Something broken" and
   not "bug", because that is the row the person pressed. */
const FB_TITLE = { comment: 'Comment', question: 'Question', bug: 'Something broken',
  rating: 'Rating', feedback: 'Product feedback' };
const FB_BANDS = ['unread', 'filling', 'low', 'median', 'high'];
/* THE OUTER CEILINGS. The client refuses far lower, 600 characters for most
   kinds (OB_LIMIT), and these are not that rule restated: they are what this
   route takes from anybody at all, a client or a script. The body ceiling
   sits under Discord's own 4096 for an embed description, with room for the
   code fence it is wrapped in below. */
export const FB_BODY_MAX = 4000;
export const FB_BYTES_MAX = 16384;
const FB_WAIT_MS = 8000;
/* Discord's own webhook hosts, the stable one and its two test channels.
   A value in the variable that is not one of these is a setup mistake, an
   invite link pasted into the wrong box being the likely one, and posting to
   it would send the person's words somewhere nobody chose. */
const FB_HOOK = /^https:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;

/* Every answer is JSON and none of them may be cached by anything in between:
   a cached "sent" for a request that never reached Discord is the lie the
   outbox exists to prevent. */
function say(status, body, extra) {
  return new Response(JSON.stringify(body), { status,
    headers: Object.assign({ 'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store' }, extra || {}) });
}
/* Lower case, because ui/auth.js authSay sets the server's words in sentence
   case and shows them as the reason. */
const no = (status, error, extra) => say(status, { ok: false, error }, extra);

/* THE BOUNDARY, ON THIS SIDE OF THE WIRE. The client validates with
   obValidate, and that is a promise about honest clients only: this route is
   a public address and anything can post to it. So every field is checked
   again here by type and by range, and anything unknown is refused by name. */
export function fbValidate(e) {
  if (!e || typeof e !== 'object' || Array.isArray(e)) return 'the body is not an object';
  for (const k of Object.keys(e)) if (FB_KEYS.indexOf(k) < 0) return 'feedback may not carry ' + k;
  if (FB_KINDS.indexOf(e.kind) < 0) return 'kind must be one of ' + FB_KINDS.join(', ');
  if (e.body !== undefined && typeof e.body !== 'string') return 'body must be text';
  const body = String(e.body || '').trim();
  if (body.length > FB_BODY_MAX) return 'that is ' + body.length + ' characters and the limit is ' + FB_BODY_MAX;
  let n = 0;
  if (e.answers !== undefined) {
    if (!e.answers || typeof e.answers !== 'object' || Array.isArray(e.answers)) return 'answers must be an object';
    const ks = Object.keys(e.answers);
    if (ks.length > 40) return 'too many answers';
    for (const k of ks) {
      const v = e.answers[k];
      if (!/^[a-z0-9]{1,16}$/i.test(k) || !Number.isInteger(v) || v < 0 || v > 20) return 'answer ' + k.slice(0, 16) + ' is not an answer';
    }
    n = ks.length;
  }
  /* EMPTY IS REFUSED. The free text kinds carry a body and the rating and the
     questionnaire carry answers, so an envelope with neither carries nothing
     a person wrote, and posting it would be a blank card in the channel. */
  if (!body && !n) return 'there is nothing in it to send';
  if (e.at !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(e.at))) return 'at must be a day';
  if (e.band !== undefined && FB_BANDS.indexOf(e.band) < 0) return 'band must be one of ' + FB_BANDS.join(', ');
  if (e.build !== undefined && !(typeof e.build === 'string' && /^[\w .:+-]{0,64}$/.test(e.build))) return 'build is not a build stamp';
  if (e.platform !== undefined && ['phone', 'desktop'].indexOf(e.platform) < 0) return 'platform must be phone or desktop';
  if (e.viewport !== undefined && ['narrow', 'wide'].indexOf(e.viewport) < 0) return 'viewport must be narrow or wide';
  return '';
}

/* THE CARD THE TEAM READS. The person's words go inside a code block, which
   Discord renders as written: no masked link can dress a phishing address as
   a word, and nothing is read as a heading or a quote. A backtick in the text
   gets a zero width space after it so it cannot close the fence early, which
   leaves what was typed visibly identical. allowed_mentions empty means an
   @everyone or a role mention in the text is printed and never pings, in a
   channel the owner may open to the whole community. */
export function fbMessage(e) {
  const body = String(e.body || '').trim();
  const fields = [];
  const ans = e.answers && Object.keys(e.answers);
  /* the answers are positions in OB_RATE and OB_SURVEY, ui/account.js, and
     not the labels: printing labels here would mean a third copy of the
     questionnaire, and that one would drift too */
  if (ans && ans.length) fields.push({ name: 'Answers, by question key',
    value: ans.map(k => k + ' ' + e.answers[k]).join(', ').slice(0, 1024) });
  if (e.band) fields.push({ name: 'Coherence band', value: e.band, inline: true });
  if (e.platform || e.viewport) fields.push({ name: 'Screen',
    value: [e.platform, e.viewport].filter(Boolean).join(', '), inline: true });
  if (e.build) fields.push({ name: 'Build', value: e.build, inline: true });
  if (e.at) fields.push({ name: 'Day', value: e.at, inline: true });
  const card = { title: FB_TITLE[e.kind] || e.kind, fields };
  if (body) card.description = '```\n' + body.replace(/`/g, '`​') + '\n```';
  return { username: 'Atuned feedback', allowed_mentions: { parse: [] }, embeds: [card] };
}

/* ONE HANDLER FOR EVERY METHOD. Pages also accepts onRequestPost, but with
   only that exported a GET falls through to the static site and answers with
   whatever the asset router finds, which is not a sentence about this route. */
export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return no(405, 'this address only takes a post', { allow: 'POST' });
  /* JSON only. Besides refusing a form post, this is what makes a browser on
     another site send a preflight first, and this route answers no CORS
     headers, so a page elsewhere cannot make a visitor's browser post here. */
  const type = (request.headers.get('content-type') || '').toLowerCase();
  if (!/^application\/json\b/.test(type)) return no(415, 'feedback must be sent as json');
  const len = Number(request.headers.get('content-length') || 0);
  if (len > FB_BYTES_MAX) return no(413, 'that is too long to send');
  let text;
  try { text = await request.text(); } catch (x) { return no(400, 'the body could not be read'); }
  /* the header can be absent or wrong, so the bytes are measured as well */
  if (text.length > FB_BYTES_MAX) return no(413, 'that is too long to send');
  if (!text.trim()) return no(400, 'there is nothing in it to send');
  let e;
  try { e = JSON.parse(text); } catch (x) { return no(400, 'the body is not json'); }
  const bad = fbValidate(e);
  if (bad) return no(400, bad);

  /* NOT SET IS SAID, NEVER SWALLOWED. A preview deploy, or the production
     project before the owner has pasted the address in, has no variable. A
     503 is what ui/auth.js turns into a held entry and a sentence, so what
     the person wrote waits on their device instead of vanishing here. */
  const hook = String((env && env.DISCORD_FEEDBACK_WEBHOOK) || '').trim();
  if (!hook) return no(503, 'feedback is not switched on here yet');
  if (!FB_HOOK.test(hook)) {
    /* the log names the fault and never the value */
    console.error('DISCORD_FEEDBACK_WEBHOOK is set but is not a Discord webhook address');
    return no(503, 'feedback is set up wrong on the server');
  }

  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), FB_WAIT_MS);
  let res;
  try {
    res = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(fbMessage(e)), signal: ctl.signal });
  } catch (x) {
    return no(502, ctl.signal.aborted ? 'discord did not answer in time' : 'could not reach discord');
  } finally { clearTimeout(timer); }
  /* Discord answers 204 to a webhook post with no wait parameter, and any 2xx
     is a message in the channel. A 429 is Discord's own rate limit and is
     worth a retry later; anything else is a refusal, logged by status only. */
  if (res.ok) return say(200, { ok: true });
  console.error('discord refused the feedback post with status ' + res.status);
  if (res.status === 429) return no(503, 'discord is busy, try again in a minute');
  return no(502, 'discord refused it');
}
