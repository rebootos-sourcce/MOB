#!/usr/bin/env node
/* ============================================================
   PATTERNS FOLLOW THE MONEY, 17 October. The pay cycle run in Stripe test
   mode (Reboot-OS workflow "e2e paycycle", run 39054584771, 26 steps) fed
   the server's own /v1/me answers into this app's engine/plan.js and found
   three steps red in it. Each is modelled here on the run's own person A,
   whose one life walks every step, with the run's own numbers. A pattern is
   one unit of the allowance: one line at one address down one channel,
   counted the first time it is opened.

     node tests/money.js
     ENGINE=file   against another engine.js

   HEADLESS, on engine.js, like tests/engine.js:
     1  e1, a refused card opens no new patterns. Stripe moves the billing
        month forward on a refused renewal; the app opened a fresh allowance
        on it. What is open stays open, and new ground waits for the money
     2  f2, a tier change adds only the share the money covers: the
        difference between the two grants times the share of the month left
        at the change. An upgrade on day 75 with 200 left reads 419, not 800,
        and the next renewal is the full 800. A downgrade never refunds what
        was opened and never leaves more than the lower tier's grant, and down
        then up on one day prints nothing
     3  h, an ended plan reads free with free's allowance, from the day it
        ended, read from the server or not read at all: the end date is
        checked, not only the status, so a record that is signed out or
        offline stops being paid when its plan does
     4  the five new billing fields are read at the boundary: a wrong type or
        a value out of range is refused by name and never clamped, and a
        server that sends none of them is read exactly as before

   CHECKED AGAINST MAIN FIRST, the standing rule (ENGINE pointing at main's
   9a162d14 engine.js): it fails on 1, 2, 3 and 4.

   No count is typed into this file. Read the counts off the run.
   ============================================================ */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const E = require(path.resolve(process.env.ENGINE || path.join(ROOT, 'engine.js')));

let PASS = 0, FAIL = 0;
const ok = (c, m) => { if (c) { PASS++; console.log('  ok    ' + m); } else { FAIL++; console.log('  FAIL  ' + m); } };
const J = JSON.stringify;
/* the run's test clock, as days from day 0. Every read here names its own day,
   so nothing in this file depends on the day it is run. */
const DAY = 864e5, T0 = Date.parse('2026-11-02T00:00:00.000Z');
const iso = d => new Date(T0 + d * DAY).toISOString();
const many = n => Array.from({ length: n }, (_, i) => 'x' + i + ':Rlimit:0');
const G = k => E.PLAN_BY[k].grant;
/* the server's billing, in the shape /v1/me sends it on Reboot-OS PR 67
   (atuned/server/README.md there): the five fields from the run are always
   present, null when the server does not know */
const bill = (tier, status, s, u, more) => Object.assign({ tier, status, since: iso(s), until: iso(u), store: 'stripe', ends: null,
  paid: E.PLAN_PRICE[tier] * 100, currency: 'usd', renewal: 'paid', changed: null, prorated: null }, more || {});
/* one person, the way the harness keeps one (paycycle.mjs appRead): the record
   planFromServer writes, then what planAllowance shows on the same day */
const person = () => ({ rec: null, n: E.GIFT_N, giftAt: iso(0) });
const read = (p, b, day) => {
  const r = E.planFromServer(p.rec, b, many(p.n), iso(day));
  if (!r.refused) p.rec = r.plan;
  p.r = r; p.al = E.planAllowance(p.rec, p.n, p.giftAt, iso(day));
  return p.al;
};
const look = (p, day) => E.planAllowance(p.rec, p.n, p.giftAt, iso(day));
const use = (p, k) => { p.n += k; };
const valid = pl => E.validateProfile({ v: E.SCHEMA_V, plan: pl });

/* A, the run's whole life, carried through all three groups */
const A = person();

console.log('\n=== 1. e1, a refused card opens no new patterns ===');
{
  read(A, null, 0);
  const c = read(A, bill('one', 'active', 0, 30), 0.1);
  ok(c.left === G('one') && c.of === G('one'), 'day 0, tier one paid: ' + c.left + ' of ' + c.of);
  use(A, 300);
  const d1 = read(A, bill('one', 'active', 30, 61), 30.25);
  ok(d1.left === G('one'), 'day 30, the first renewal, paid, opens a new month: ' + d1.left + ' of ' + d1.of);
  use(A, 300);
  const before = look(A, 61).left;
  const e = read(A, bill('one', 'past_due', 61, 91, { paid: 0, renewal: 'open' }), 61.25);
  ok(e.left === before, 'day 61, the renewal is refused and Stripe moves the month anyway: still ' + before + ' left, where a new month would be ' + G('one') + '. Shown ' + e.left + ' of ' + e.of);
  ok(E.planState(A.rec, iso(61.25)) === 'live' && E.planOf(A.rec, iso(61.25)).k === 'one',
    'and everything already open still runs: the plan is in force while Stripe retries, ' + E.planState(A.rec, iso(61.25)));
  ok(e.renews === null, 'and no day is named for new ones, because they arrive when the card does, not on a date: ' + e.renews);
  const again = read(A, bill('one', 'past_due', 61, 91, { paid: 0, renewal: 'open' }), 62);
  ok(again.left === before, 'read again while it is still refused, nothing opens: ' + again.left);
  const fixed = read(A, bill('one', 'active', 61, 91, { renewal: 'paid' }), 63);
  ok(fixed.left === G('one') && fixed.of === G('one'), 'day 63, the card is fixed and the invoice paid: the new month opens, ' + fixed.left + ' of ' + fixed.of);
  ok(valid(A.rec).ok, 'every record written here passes the boundary a pasted record goes through');
  use(A, 200);

  /* B, the run's other card: refused and never fixed, and Stripe gives up */
  const B = person();
  read(B, bill('one', 'active', 0, 30), 0.1); use(B, 100);
  read(B, bill('one', 'active', 30, 61), 30.25); use(B, 100);
  read(B, bill('one', 'past_due', 61, 91, { paid: 0, renewal: 'open' }), 61.25);
  const gone = read(B, bill('one', 'unpaid', 61, 91, { paid: 0, renewal: 'uncollectible' }), 80);
  ok(gone.source === 'free' && gone.left > 0, 'when Stripe gives up, the plan ends and free opens: ' + gone.source + ', ' + gone.left + ' left');

  /* a refused renewal and a tier change in one read: still held, on the old
     tier's grant, never the new tier's whole one on an unpaid month */
  const H = person();
  read(H, bill('one', 'active', 0, 30), 0.1); use(H, 350);
  const hh = read(H, bill('two', 'past_due', 30, 61, { paid: 0, renewal: 'open', changed: iso(30.5), prorated: 0.98 }), 31);
  ok(hh.left === 50, 'a refused renewal read together with a move to tier two still holds the 50 that were left: ' + hh.left + ' of ' + hh.of);

  /* a server from before the field: exactly what main did, a moved month opens */
  const O = person();
  read(O, { tier: 'one', status: 'active', since: iso(0), until: iso(30) }, 0.1); use(O, 300);
  const old = read(O, { tier: 'one', status: 'past_due', since: iso(30), until: iso(61) }, 30.25);
  ok(old.left === G('one'), 'a server that sends no renewal is read as before: a moved month opens, ' + old.left);
}

console.log('\n=== 2. f2, a tier change adds only the prorated share ===');
{
  const pre = look(A, 75);
  ok(pre.left === 200, 'day 75, before the upgrade, A has the run\'s 200 left: ' + pre.left);
  const frac = 0.5484;
  const up = read(A, bill('two', 'active', 61, 91, { changed: iso(75), prorated: frac, paid: 1200 + 935 }), 75.01);
  const want = pre.left + Math.round((G('two') - G('one')) * frac);
  ok(up.left === want, 'tier one to two with ' + frac + ' of the month left: ' + up.left + ' left, the ' + pre.left + ' that were left plus '
    + Math.round((G('two') - G('one')) * frac) + ' for the share of the month the money covers. A full new allowance would be ' + G('two'));
  ok(want === 419, 'which is the run\'s own figure, 419');
  ok(A.rec.base === A.r.plan.base && valid(A.rec).ok, 'and the record it writes passes the boundary: ' + J(A.rec));
  const twice = read(A, bill('two', 'active', 61, 91, { changed: iso(75), prorated: frac }), 76);
  ok(twice.left === up.left, 'read again, the share is added once, never twice: ' + twice.left);
  use(A, 300);
  const d3 = read(A, bill('two', 'active', 91, 122), 91.25);
  ok(d3.left === G('two') && d3.of === G('two'), 'day 91, the next renewal on tier two is its full grant: ' + d3.left + ' of ' + d3.of);
  use(A, 600);

  /* the sales seat's example, day 20 of 30, tier one to two: about 133 more */
  const S = person();
  read(S, bill('one', 'active', 0, 30), 0.1);
  const s = read(S, bill('two', 'active', 0, 30, { changed: iso(20), prorated: 0.3333 }), 20.01);
  ok(s.left - G('one') === Math.round((G('two') - G('one')) * 0.3333), 'day 20 of 30, nothing spent, one to two adds ' + (s.left - G('one')) + ', the sales seat\'s 133');

  /* down then up on one day: Stripe credits the first and charges the second,
     about nothing changes hands, and nothing may be printed for it */
  const D = person();
  read(D, bill('three', 'active', 0, 30), 0.1); use(D, G('three'));
  const dn = read(D, bill('one', 'active', 0, 30, { changed: iso(5), prorated: 0.8333 }), 5.01);
  ok(dn.left === 0, 'tier three spent, down to one: nothing is refunded and nothing opens, ' + dn.left + ' left');
  const bk = read(D, bill('three', 'active', 0, 30, { changed: iso(5.02), prorated: 0.8326 }), 5.03);
  ok(bk.left === 0, 'and back up the same day: still ' + bk.left + ', where main read ' + G('one') + ' and then ' + G('three'));

  /* a downgrade never leaves more than the lower tier's grant */
  const L = person();
  read(L, bill('three', 'active', 0, 30), 0.1); use(L, 300);
  const spentBefore = look(L, 15).spent;
  const low = read(L, bill('one', 'active', 0, 30, { changed: iso(15), prorated: 0.5 }), 15.01);
  ok(low.left <= G('one') && low.left > 0, 'tier three with 300 opened, down to one half way: ' + low.left + ' left, never above tier one\'s ' + G('one'));
  ok(low.spent === spentBefore, 'and what was opened stays opened, spent ' + low.spent);

  /* a change with no share named, from a server before the field: as before */
  const N = person();
  read(N, bill('one', 'active', 0, 30), 0.1); use(N, 100);
  const nul = read(N, bill('three', 'active', 0, 30), 10);
  ok(nul.left === G('three'), 'a tier change with prorated null is read as before, a full allowance of the new tier: ' + nul.left);
}

console.log('\n=== 3. h, an ended plan reads free, from the day it ended ===');
{
  const g = read(A, bill('two', 'active', 91, 122, { ends: iso(122) }), 100);
  ok(E.planOf(A.rec, iso(100)).k === 'two' && A.rec.ends === iso(122), 'day 100, cancelled at the period end: tier two stays on until ' + A.rec.ends.slice(0, 10) + ', ' + g.left + ' left');
  const atStop = JSON.parse(J(A.rec));
  /* the run's exact shape: tier two, canceled, the period over */
  const h = read(A, bill('two', 'canceled', 91, 122, { ends: iso(122) }), 122.25);
  ok(h.source === 'free' && h.left === G('free'), 'day 122, the plan has ended: free, ' + h.left + ' of ' + h.of + ' to open');
  const year = look(A, 122.25 + 364);
  ok(year.left >= 50 * G('free'), 'and it banks from that day: a year on, ' + year.left + ' left, where the run read 0 for good');
  ok(valid(A.rec).ok, 'and the record passes the boundary');

  /* the same person, never read again: signed out, or offline */
  const off = { rec: atStop, n: A.n, giftAt: A.giftAt };
  ok(E.planState(off.rec, iso(123)) === 'ended', 'never read again, a plan past its end day is ended, not live: ' + E.planState(off.rec, iso(123)));
  ok(E.planOf(off.rec, iso(123)).k === 'free' && E.planSight(off.rec, false, iso(123)).tier === 'free', 'so it reads free, and sees what free sees');
  const fo = look(off, 123);
  ok(fo.source === 'free' && fo.left === G('free'), 'and free has its own ' + fo.left + ', not nought for what was opened while paying');
  ok(look(off, 123 + 21).left === 4 * G('free'), 'banking from the end day: three weeks on, ' + look(off, 123 + 21).left);
  ok(E.planState(off.rec, iso(121)) === 'live', 'and the day before the end it is still on');

  /* a plan that renews, on a device that has not read the renewal */
  const R = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 500, since: iso(0), until: iso(30), ends: null };
  const grace = E.PLAN_GRACE_MS;
  ok(typeof grace === 'number' && grace > 0, 'a renewal not yet read has a grace, named once: ' + grace / DAY + ' days');
  ok(E.planState(R, iso(30) ) === 'live' && E.planState(R, T0 + 30 * DAY + (grace || 0) - 1) === 'live',
    'inside it the plan stays on, because a renewal the device has not read is not an ending');
  ok(E.planState(R, T0 + 30 * DAY + (grace || 0) + 1) === 'ended', 'past it, an unread plan is ended: ' + E.planState(R, T0 + 30 * DAY + (grace || 0) + 1));
  ok(E.planState(Object.assign({}, R, { since: '2020-01-01T00:00:00Z', until: '2020-02-01T00:00:00Z' })) === 'ended',
    'and with no day given, the clock is today\'s: a plan that ran out in 2020 is ended');
  ok(E.planState(Object.assign({}, R, { until: null })) === 'live', 'a record with no end on it reads live as it always did');

  /* a month that moved tier and was then never read again: what it granted,
     the prorated share included, is what was paid for, and free is not
     charged for any of it */
  const P = person();
  read(P, bill('one', 'active', 0, 30), 0.1);
  read(P, bill('two', 'active', 0, 30, { changed: iso(15), prorated: 0.5 }), 15.01);
  use(P, P.rec.granted);
  const pf = look(P, 40);
  ok(P.rec.granted === G('one') + (G('two') - G('one')) / 2 && pf.source === 'free' && pf.left === 2 * G('free'),
    'a prorated month of ' + P.rec.granted + ', opened the day the gift ran out, all opened, then unread to day 40: free counts from the day 30 end, ' + pf.left + ' left, not from the gift');
  const pc = { rec: E.planFromServer(P.rec, bill('two', 'canceled', 0, 30), many(P.n), iso(31)).plan, n: P.n, giftAt: P.giftAt };
  ok(look(pc, 40).left === 2 * G('free'), 'and read back cancelled, the same: ' + look(pc, 40).left);
}

console.log('\n=== 4. the new fields are read at the boundary ===');
{
  const prev = { tier: 'one', status: 'active', granted: 0, carried: 0, base: 300, since: iso(0), until: iso(30), ends: null };
  const base = { tier: 'one', status: 'active', since: iso(0), until: iso(30) };
  const bad = [
    ['paid', '1200'], ['paid', -5], ['paid', 12.5],
    ['currency', 12], ['currency', 'US Dollars'],
    ['renewal', 'late'], ['renewal', 1],
    ['changed', 'soon'], ['changed', 5],
    ['prorated', 1.2], ['prorated', -0.1], ['prorated', '0.5']];
  bad.forEach(([k, v]) => {
    const r = E.planFromServer(prev, Object.assign({}, base, { [k]: v }), many(300), iso(5));
    ok(r.refused && r.same && r.plan === prev && new RegExp(k).test(String(r.why || '')),
      k + ' ' + J(v) + ' is refused by name and nothing moves: ' + J(r.why || r.refused || null));
  });
  const keys = ['paid', 'currency', 'renewal', 'changed', 'prorated'];
  const nulls = Object.assign({}, base); keys.forEach(k => { nulls[k] = null; });
  const a = E.planFromServer(prev, base, many(300), iso(5)), b = E.planFromServer(prev, nulls, many(300), iso(5));
  ok(!a.refused && !b.refused && J(a) === J(b), 'null in every new field is a server that does not know, read exactly as a server that sends none');
  const sent = E.planFromServer(prev, Object.assign({}, base, { paid: 1200, currency: 'usd', renewal: 'paid', changed: null, prorated: null }), many(300), iso(5));
  ok(!sent.refused && sent.same, 'and good values change nothing on a period that has not moved: ' + J(sent.plan));
  ok(J(Object.keys(sent.plan)) === J(Object.keys(E.blankProfile('k').plan)), 'the record keeps the blank\'s own keys, so the schema does not move: ' + J(Object.keys(sent.plan)));
}

console.log('\n' + PASS + ' passed, ' + FAIL + ' failed');
process.exit(FAIL ? 1 : 0);
