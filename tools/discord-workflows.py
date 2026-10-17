#!/usr/bin/env python3
"""The Discord steps, run rather than read. 16 October.

Three workflows hold Discord webhook addresses as GitHub secrets:

  deploy.yml          carries DISCORD_FEEDBACK_WEBHOOK to the Pages project
                      and posts one card to #latest after a live deploy
  discord-post.yml    one card to #milestones or #investors, by hand
  feedback-probe.yml  asks atuned.world/feedback once, and holds no secret

A webhook address is a bearer credential: whoever reads it can post into the
channel as the team. GitHub masks a secret in its logs, but a mask is a
substitution on output, and a value cut, encoded or split across two lines
gets past it, so the rule held here is that no script prints the value at all.
tools/workflow-lint.py walks the deploy job's steps in order and runs the
three that decide what is published, and it counts every other step as a
success without running it. So these scripts were run by nothing, and this
file runs them, under GitHub's own bash -e -o pipefail, against a stand in
curl and a stand in npx that record what they were handed, with a fake
address whose token is searched for in everything printed.

  D1  where a secret may appear: only as a whole env value, ${{ secrets.X }},
      and never inside a run script, so no expression is pasted into a shell
  D2  the two deploy steps run on main only, only on a publish, and #latest
      only after the production check passed
  D3  the feedback carry: unset, malformed, written, refused by Cloudflare
  D4  #latest: unset, malformed, posted, refused, unreachable, rolled back,
      and it ends 0 on every path, because the site is already live
  D5  the hand post: main only, its own channel's secret only, the length,
      an injected command that runs nothing, no mention that can ping
  D6  triggers: the probe and the hand post are hand start only, and the
      probe names no secret

    python3 tools/discord-workflows.py              one FAIL line per broken check
    python3 tools/discord-workflows.py --self-test  break each rule in memory and
                                                    prove the check fails on it
"""
import copy
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WF = os.path.join(ROOT, '.github', 'workflows')

# The lint's own evaluator of GitHub's expression language, so an if: here is
# decided by the same code that decides the deploy job's.
_spec = importlib.util.spec_from_file_location('workflow_lint', os.path.join(ROOT, 'tools', 'workflow-lint.py'))
WL = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(WL)

TOKEN = 'gateTOKENnotARealOne_x9'
FAKE = 'https://discord.com/api/webhooks/123456789012345678/' + TOKEN
WRONG = 'https://discord.gg/' + TOKEN   # an invite pasted into the wrong box
SECRET_ENV = re.compile(r'^\$\{\{\s*secrets\.([A-Z0-9_]+)\s*\}\}$')

CURL = r'''#!/bin/bash
# the stand in for curl: record the address and the body, answer as told
data=""; url=""; prev=""
for a in "$@"; do
  if [ "$prev" = "--data" ]; then data="$a"; fi
  prev="$a"; url="$a"
done
n=$(ls "$STUB/curl."* 2>/dev/null | wc -l)
printf '%s' "$url" > "$STUB/curl.$n.url"
case "$data" in @*) cp "${data#@}" "$STUB/curl.$n.body" ;; *) printf '%s' "$data" > "$STUB/curl.$n.body" ;; esac
if [ -n "$STUB_CURL_EXIT" ]; then echo "curl: (7) Failed to connect" >&2; exit "$STUB_CURL_EXIT"; fi
printf '%s' "${STUB_CODE:-204}"
'''
NPX = r'''#!/bin/bash
# the stand in for npx: record the arguments and what came on stdin. Told to
# fail, it prints the value back, as a careless tool might, so the step has
# to keep it out of the log itself.
printf '%s\n' "$*" > "$STUB/npx.args"
cat > "$STUB/npx.stdin"
if [ -n "$STUB_NPX_FAIL" ]; then echo "X [ERROR] A request to the Cloudflare API failed. value was $(cat "$STUB/npx.stdin")" >&2; exit 1; fi
echo "Success! Uploaded secret"
'''


def load(name):
    import yaml
    with open(os.path.join(WF, name)) as f:
        return yaml.safe_load(f)


def strings(v, where=''):
    if isinstance(v, dict):
        for k, x in v.items():
            yield from strings(x, where + '.' + str(k))
    elif isinstance(v, list):
        for i, x in enumerate(v):
            yield from strings(x, where + '[%d]' % i)
    elif isinstance(v, str):
        yield where, v


def find_step(job, secret):
    """the one step whose env maps this secret, by identity and never by place"""
    hits = [s for s in (job.get('steps') or []) if any(
        SECRET_ENV.match(str(v or '').strip()) and SECRET_ENV.match(str(v).strip()).group(1) == secret
        for v in (s.get('env') or {}).values())]
    return hits[0] if len(hits) == 1 else None


class Ran:
    def __init__(self, code, out, calls, stub, made):
        self.code, self.out, self.calls, self.made = code, out, calls, made
        self.npx = None
        if os.path.exists(os.path.join(stub, 'npx.args')):
            self.npx = (open(os.path.join(stub, 'npx.args')).read().strip(),
                        open(os.path.join(stub, 'npx.stdin')).read())


def run(step, values, stub_env=None, ref='refs/heads/main', repo=None, files=None):
    """the step's script, under GitHub's bash, with its env filled in from values"""
    d = tempfile.mkdtemp(prefix='dw-')
    try:
        stub, bin_, work = os.path.join(d, 'stub'), os.path.join(d, 'bin'), repo or os.path.join(d, 'work')
        for p in (stub, bin_, work):
            os.makedirs(p, exist_ok=True)
        for name, body in (('curl', CURL), ('npx', NPX)):
            with open(os.path.join(bin_, name), 'w') as f:
                f.write(body)
            os.chmod(os.path.join(bin_, name), 0o755)
        for name, body in (files or {}).items():
            with open(os.path.join(work, name), 'w') as f:
                f.write(body)
        env = {'PATH': bin_ + ':' + os.environ.get('PATH', ''), 'HOME': d, 'STUB': stub,
               'RUNNER_TEMP': d, 'GITHUB_REF': ref, 'GITHUB_SERVER_URL': 'https://github.com',
               'GITHUB_REPOSITORY': 'o/r', 'GITHUB_RUN_ID': '42'}
        for k, v in (step.get('env') or {}).items():
            m = SECRET_ENV.match(str(v or '').strip())
            key = m.group(1) if m else k
            env[k] = values.get(key, values.get(k, ''))
        env.update(stub_env or {})
        mark = os.path.join(d, 'PWNED')
        env['PWNED'] = mark
        p = subprocess.run(['bash', '--noprofile', '--norc', '-eo', 'pipefail', '-c', step['run']],
                           env=env, cwd=work, capture_output=True, text=True, timeout=60)
        calls = []
        i = 0
        while os.path.exists(os.path.join(stub, 'curl.%d.url' % i)):
            body = open(os.path.join(stub, 'curl.%d.body' % i)).read()
            try:
                body = json.loads(body)
            except ValueError:
                pass
            calls.append({'url': open(os.path.join(stub, 'curl.%d.url' % i)).read(), 'body': body})
            i += 1
        return Ran(p.returncode, p.stdout + p.stderr, calls, stub, os.path.exists(mark))
    finally:
        shutil.rmtree(d, ignore_errors=True)


def git_repo(subject, body='', stamp='v9 abc1234 2026-10-16 09:00'):
    d = tempfile.mkdtemp(prefix='dw-repo-')
    g = lambda *a: subprocess.run(['git', '-C', d] + list(a), check=True, capture_output=True,
                                  env=dict(os.environ, GIT_AUTHOR_NAME='g', GIT_AUTHOR_EMAIL='g@x',
                                           GIT_COMMITTER_NAME='g', GIT_COMMITTER_EMAIL='g@x'))
    g('init', '-q')
    with open(os.path.join(d, 'source.html'), 'w') as f:
        f.write('<!doctype html>\n<html lang="en" data-build="%s"><head>' % stamp if stamp else '<html>')
    g('add', '.')
    g('commit', '-q', '-m', subject + ('\n\n' + body if body else ''))
    return d


class Check:
    def __init__(self, docs):
        self.docs, self.fails, self.passed = docs, [], 0

    def ok(self, cond, msg):
        if cond:
            self.passed += 1
        else:
            self.fails.append(msg)
        return cond

    def quiet(self, r, where):
        self.ok(TOKEN not in r.out, '%s printed the webhook address (or its token): %s' % (where, r.out.strip()[:200].replace(TOKEN, '<TOKEN>')))

    # D1 ------------------------------------------------------------------
    def d1(self):
        for name, doc in self.docs.items():
            for where, s in strings(doc):
                if 'secrets.DISCORD' not in s:
                    continue
                self.ok(re.search(r'\.env\.[A-Z0-9_]+$', where) and SECRET_ENV.match(s.strip()),
                        'D1 %s%s holds a Discord secret as %r. A Discord secret may only be a whole env value, ${{ secrets.NAME }}, never part of a script.' % (name, where, s.strip()[:80]))

    # D2 ------------------------------------------------------------------
    def d2(self, put, latest):
        def go(step, ref, publish=True, ok=True, rollback=''):
            ctx = {'github': {'event_name': 'workflow_dispatch' if rollback else 'push', 'ref': ref, 'repository': 'o/r'},
                   'inputs': {'rollback_ref': rollback}, 'env': {}, 'secrets': {}, 'vars': {}, 'needs': {},
                   'steps': {'order': {'outputs': {'publish': 'true' if publish else 'false'}}},
                   'matrix': {}, 'job': {}, 'strategy': {}, 'runner': {}}
            try:
                return WL.condition(step.get('if'), WL.Env(ctx, {'cancelled': False, 'needs_ok': ok, 'needs_failed': not ok}))
            except WL.ExprError as e:
                return 'error: %s' % e
        for label, step in (('the feedback carry', put), ('the #latest card', latest)):
            self.ok(go(step, WL.MAIN) is True, 'D2 %s does not run on a publish from main (%r).' % (label, go(step, WL.MAIN)))
            self.ok(go(step, WL.MAIN, rollback=WL.ROLLBACK) is True, 'D2 %s does not run on a rollback from main.' % label)
            self.ok(go(step, WL.BRANCH) is False, 'D2 %s runs on %s. It runs on main only.' % (label, WL.BRANCH))
            self.ok(go(step, WL.BRANCH, rollback=WL.ROLLBACK) is False, 'D2 %s runs on a rollback dispatched from a branch.' % label)
            self.ok(go(step, WL.MAIN, publish=False) is False, 'D2 %s runs when the order check said a newer commit will publish.' % label)
            self.ok(go(step, WL.MAIN, ok=False) is False, 'D2 %s runs after an earlier step failed.' % label)
        steps = self.docs['deploy.yml']['jobs']['deploy']['steps']
        ix = lambda s: next(i for i, x in enumerate(steps) if x is s)
        dep = [i for i, s in enumerate(steps) if 'wrangler pages deploy' in str(s.get('run', ''))]
        conf = [i for i, s in enumerate(steps) if 'pages/projects/atuned/deployments' in str(s.get('run', '')) and dep and i > dep[0]]
        self.ok(dep and ix(put) < dep[0], 'D2 the feedback carry runs after the upload, so the deployment it publishes never sees the new value.')
        self.ok(conf and ix(latest) > conf[0], 'D2 the #latest card is not after the production check, so it can say live before Cloudflare does.')
        for label, step in (('the feedback carry', put), ('the #latest card', latest)):
            coe = step.get('continue-on-error', False)
            self.ok(coe is False, 'D2 %s has continue-on-error, which tools/workflow-lint.py refuses; the script must end 0 itself.' % label)

    # D3 ------------------------------------------------------------------
    def d3(self, put):
        w = 'D3 the feedback carry'
        r = run(put, {})
        self.ok(r.code == 0 and r.npx is None and '::notice::' in r.out, '%s, with the GitHub secret unset, exits %d and %s; it must say so in a notice, write nothing and end 0.' % (w, r.code, 'calls wrangler' if r.npx else 'writes nothing'))
        r = run(put, {'DISCORD_FEEDBACK_WEBHOOK': WRONG})
        self.ok(r.code == 0 and r.npx is None and '::warning::' in r.out, '%s, with an invite link in the secret, exits %d%s; it must warn, write nothing and end 0.' % (w, r.code, ' and writes it' if r.npx else ''))
        self.quiet(r, w + ' with a malformed secret')
        r = run(put, {'DISCORD_FEEDBACK_WEBHOOK': FAKE, 'CLOUDFLARE_API_TOKEN': 't', 'CLOUDFLARE_ACCOUNT_ID': 'a'})
        self.ok(r.code == 0 and r.npx == ('wrangler pages secret put DISCORD_FEEDBACK_WEBHOOK --project-name=atuned', FAKE),
                '%s does not hand the value to wrangler pages secret put DISCORD_FEEDBACK_WEBHOOK --project-name=atuned on stdin, exactly: %r' % (w, r.npx and (r.npx[0], r.npx[1].replace(TOKEN, '<TOKEN>'))))
        self.quiet(r, w + ' on a write')
        r = run(put, {'DISCORD_FEEDBACK_WEBHOOK': FAKE}, {'STUB_NPX_FAIL': '1'})
        self.ok(r.code == 0 and '::warning::' in r.out, '%s, when Cloudflare refuses, exits %d; it must warn and end 0, because the site still publishes.' % (w, r.code))
        self.quiet(r, w + ' when wrangler fails and prints the value back')

    # D4 ------------------------------------------------------------------
    def d4(self, latest):
        w = 'D4 the #latest card'
        subject = 'Ship the release timer @everyone $(touch "$PWNED") `touch "$PWNED"`'
        repo = git_repo(subject, body='the pull request body, which never travels')
        try:
            r = run(latest, {}, repo=repo)
            self.ok(r.code == 0 and not r.calls and '::notice::' in r.out, '%s, unset, exits %d with %d posts; it must say so and end 0.' % (w, r.code, len(r.calls)))
            r = run(latest, {'DISCORD_WEBHOOK_LATEST': WRONG}, repo=repo)
            self.ok(r.code == 0 and not r.calls and '::warning::' in r.out, '%s, malformed, exits %d with %d posts; it must warn and end 0.' % (w, r.code, len(r.calls)))
            self.quiet(r, w + ' with a malformed secret')
            r = run(latest, {'DISCORD_WEBHOOK_LATEST': FAKE}, repo=repo)
            card = (r.calls[0]['body'] if r.calls and isinstance(r.calls[0]['body'], dict) else {})
            e = (card.get('embeds') or [{}])[0]
            sha = subprocess.run(['git', '-C', repo, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
            self.ok(r.code == 0 and len(r.calls) == 1 and r.calls[0]['url'] == FAKE, '%s does not post once to the secret\'s address (exit %d, %d posts).' % (w, r.code, len(r.calls)))
            self.ok(card.get('allowed_mentions') == {'parse': []}, '%s lets a mention ping: allowed_mentions is %r.' % (w, card.get('allowed_mentions')))
            self.ok(e.get('title') == 'Live on atuned.world' and e.get('description') == subject and not r.made,
                    '%s does not carry the commit line exactly as written, or ran what was in it: %r, ran %s.' % (w, e.get('description'), r.made))
            self.ok('pull request body' not in json.dumps(card), '%s carries the commit body; it carries the first line only.' % w)
            f = {x.get('name'): x.get('value') for x in e.get('fields') or []}
            self.ok(f.get('Commit') == sha[:7] and f.get('Build') == 'v9 abc1234 2026-10-16 09:00' and e.get('url') == 'https://github.com/o/r/actions/runs/42',
                    '%s does not carry the short sha, the build stamp and the run link: %r %r.' % (w, f, e.get('url')))
            self.quiet(r, w + ' on a post')
            r = run(latest, {'DISCORD_WEBHOOK_LATEST': FAKE, 'ROLLBACK': 'f' * 40}, repo=repo)
            e = ((r.calls[0]['body'].get('embeds') or [{}])[0] if r.calls and isinstance(r.calls[0]['body'], dict) else {})
            self.ok(e.get('title') == 'Rolled back on atuned.world', '%s on a rollback is titled %r; it must say rolled back.' % (w, e.get('title')))
            for label, stub in (('Discord refuses', {'STUB_CODE': '500'}), ('Discord cannot be reached', {'STUB_CURL_EXIT': '7'}),
                                ('Discord rate limits', {'STUB_CODE': '429'})):
                r = run(latest, {'DISCORD_WEBHOOK_LATEST': FAKE}, stub, repo=repo)
                self.ok(r.code == 0 and '::notice::' in r.out, '%s, when %s, exits %d; the site is already live, so it must say so in a notice and end 0.' % (w, label, r.code))
                self.quiet(r, '%s when %s' % (w, label))
        finally:
            shutil.rmtree(repo, ignore_errors=True)
        repo = git_repo('no stamp in this one', stamp='')
        try:
            r = run(latest, {'DISCORD_WEBHOOK_LATEST': FAKE}, repo=repo)
            self.ok(r.code == 0 and len(r.calls) == 1, '%s, with no build stamp in source.html, exits %d; a missing stamp must not stop the card or the job.' % (w, r.code))
        finally:
            shutil.rmtree(repo, ignore_errors=True)

    # D5 ------------------------------------------------------------------
    def d5(self, post):
        w = 'D5 the hand post'
        both = {'DISCORD_WEBHOOK_MILESTONES': FAKE, 'DISCORD_WEBHOOK_INVESTORS': FAKE.replace('123456789012345678', '987654321098765432')}
        msg = 'Ten people finished the tutorial @everyone <@&1> $(touch "$PWNED") `touch "$PWNED"` ${HOME}'
        r = run(post, dict(both, CHANNEL='milestones', MESSAGE=msg))
        card = (r.calls[0]['body'] if r.calls and isinstance(r.calls[0]['body'], dict) else {})
        e = (card.get('embeds') or [{}])[0]
        self.ok(r.code == 0 and len(r.calls) == 1 and r.calls[0]['url'] == FAKE, '%s to milestones does not post once to DISCORD_WEBHOOK_MILESTONES (exit %d, %d posts): %s' % (w, r.code, len(r.calls), r.out.strip()[-160:]))
        self.ok(e.get('description') == msg and not r.made, '%s does not carry the message exactly as written, or ran what was in it: %r, ran %s.' % (w, e.get('description'), r.made))
        self.ok(card.get('allowed_mentions') == {'parse': []}, '%s lets a mention ping: allowed_mentions is %r.' % (w, card.get('allowed_mentions')))
        self.ok(e.get('title') == 'Milestone' and (e.get('footer') or {}).get('text') == 'posted by hand from GitHub Actions',
                '%s card has title %r and footer %r.' % (w, e.get('title'), e.get('footer')))
        self.quiet(r, w + ' on a post')
        r = run(post, dict(both, CHANNEL='investors', MESSAGE='Q4 update'))
        self.ok(r.code == 0 and len(r.calls) == 1 and r.calls[0]['url'] == both['DISCORD_WEBHOOK_INVESTORS']
                and (r.calls[0]['body'].get('embeds') or [{}])[0].get('title') == 'Investor update',
                '%s to investors does not post once to DISCORD_WEBHOOK_INVESTORS as an investor update.' % w)
        r = run(post, {'DISCORD_WEBHOOK_MILESTONES': FAKE, 'CHANNEL': 'investors', 'MESSAGE': 'Q4 update'})
        self.ok(r.code != 0 and not r.calls, '%s to investors with only the milestones secret set %s; an unset channel must post nowhere and fail.' % (w, 'posts to %s' % r.calls[0]['url'].replace(TOKEN, '<TOKEN>') if r.calls else 'reads green'))
        r = run(post, dict(both, CHANNEL='milestones', MESSAGE='from a branch'), ref=WL.BRANCH)
        self.ok(r.code != 0 and not r.calls, '%s started on a branch %s; it runs from main only.' % (w, 'posts' if r.calls else 'reads green'))
        for label, m in (('an empty message', '   '), ('a message of 1801 characters', 'a' * 1801)):
            r = run(post, dict(both, CHANNEL='milestones', MESSAGE=m))
            self.ok(r.code != 0 and not r.calls, '%s with %s %s; it must refuse and post nothing.' % (w, label, 'posts' if r.calls else 'reads green'))
        r = run(post, dict(both, CHANNEL='milestones', MESSAGE='\u00fc' * 1800))
        self.ok(r.code == 0 and len(r.calls) == 1, '%s refuses 1800 characters, counted as characters and not bytes (exit %d).' % (w, r.code))
        r = run(post, {'DISCORD_WEBHOOK_MILESTONES': WRONG, 'CHANNEL': 'milestones', 'MESSAGE': 'x'})
        self.ok(r.code != 0 and not r.calls, '%s with an invite link in the secret %s; it must refuse and post nothing.' % (w, 'posts' if r.calls else 'reads green'))
        self.quiet(r, w + ' with a malformed secret')
        r = run(post, dict(both, CHANNEL='milestones', MESSAGE='x'), {'STUB_CODE': '500'})
        self.ok(r.code != 0, '%s reads green when Discord refuses; a hand post that did not land must fail.' % w)
        self.quiet(r, w + ' when Discord refuses')

    # D6 ------------------------------------------------------------------
    def d6(self):
        for name in ('discord-post.yml', 'feedback-probe.yml'):
            on = WL.triggers(self.docs[name])
            self.ok(list(on) == ['workflow_dispatch'], 'D6 %s is triggered by %s; it is hand start only.' % (name, sorted(on)))
        self.ok(not any('secrets.' in s for _, s in strings(self.docs['feedback-probe.yml'])), 'D6 feedback-probe.yml reads a secret; it asks the live site what any visitor could.')

    def run(self):
        d = self.docs['deploy.yml']['jobs']['deploy']
        put, latest = find_step(d, 'DISCORD_FEEDBACK_WEBHOOK'), find_step(d, 'DISCORD_WEBHOOK_LATEST')
        post = (self.docs['discord-post.yml'].get('jobs') or {}).get('post')
        post = find_step(post, 'DISCORD_WEBHOOK_MILESTONES') if post else None
        self.d1()
        if self.ok(put is not None and latest is not None, 'D2 the deploy job has no single step mapping DISCORD_FEEDBACK_WEBHOOK and no single step mapping DISCORD_WEBHOOK_LATEST.'):
            self.d2(put, latest)
            self.d3(put)
            self.d4(latest)
        if self.ok(post is not None, 'D5 discord-post.yml has no job post with one step mapping DISCORD_WEBHOOK_MILESTONES.'):
            self.d5(post)
        self.d6()
        return self


def all_docs():
    return {n: load(n) for n in ('deploy.yml', 'discord-post.yml', 'feedback-probe.yml')}


def report(c):
    for f in c.fails:
        print('FAIL ' + f)
    print('\n===== %d passed, %d failed =====' % (c.passed, len(c.fails)))
    return 1 if c.fails else 0


# --self-test: each break is a way these steps could be wrong. Clean must pass
# and every break must fail, or the check is not checking it.
def _step(docs, secret):
    if secret == 'post':
        return docs['discord-post.yml']['jobs']['post']['steps'][0]
    return find_step(docs['deploy.yml']['jobs']['deploy'], secret)


def _sub(secret, old, new, key='run'):
    def f(docs):
        s = _step(docs, secret)
        assert old in s[key], 'self test: %r is not in the %s step' % (old, secret)
        s[key] = s[key].replace(old, new, 1)
    return f


def _trig(docs):
    docs['discord-post.yml'][WL.on_key(docs['discord-post.yml'])]['push'] = {'branches': ['main']}


BREAKS = [
    ('#latest echoes the address', _sub('DISCORD_WEBHOOK_LATEST', 'sha="$(git rev-parse HEAD)"', 'echo "posting to $HOOK"\n          sha="$(git rev-parse HEAD)"')),
    ('#latest is not guarded to main', _sub('DISCORD_WEBHOOK_LATEST', "github.ref == 'refs/heads/main' && ", '', key='if')),
    ('the feedback carry is not guarded to main', _sub('DISCORD_FEEDBACK_WEBHOOK', "github.ref == 'refs/heads/main' && ", '', key='if')),
    ('#latest fails the deploy when Discord refuses', _sub('DISCORD_WEBHOOK_LATEST', 'The deploy itself is done and live." ;;', 'The deploy itself is done and live."; exit 1 ;;')),
    ('#latest lets a mention ping', _sub('DISCORD_WEBHOOK_LATEST', 'allowed_mentions: {parse: []},', '')),
    ('#latest carries the whole commit message', _sub('DISCORD_WEBHOOK_LATEST', '--format=%s', '--format=%B')),
    ('#latest pipes through a grep that fails on no match', _sub('DISCORD_WEBHOOK_LATEST', "stamp=\"$(sed -n '/data-build=\"/{s/.*data-build=\"\\([^\"]*\\)\".*/\\1/p;q;}' source.html 2>/dev/null)\" || stamp=\"\"",
                                                                 "stamp=\"$(grep -o -m1 'data-build=\"[^\"]*\"' source.html | cut -d'\"' -f2)\"")),
    ('the feedback carry prints wrangler\'s log whole', _sub('DISCORD_FEEDBACK_WEBHOOK', "awk -v h=\"$HOOK\" 'index($0, h) == 0' \"$RUNNER_TEMP/put.log\" | tail -n 5", 'cat "$RUNNER_TEMP/put.log"')),
    ('the feedback carry writes a malformed value', _sub('DISCORD_FEEDBACK_WEBHOOK', 'so it was not written to Cloudflare Pages."\n  exit 0', 'so it was not written to Cloudflare Pages."')),
    ('the hand post pastes the message into the shell', _sub('post', 'printf \'%s\' "$MESSAGE"', 'printf \'%s\' "${{ inputs.message }}"')),
    ('the hand post evaluates the message', _sub('post', '--arg d "$text"', '--arg d "$(eval "printf %s \\"$text\\"")"')),
    ('the hand post falls through to the milestones address', _sub('post', 'HOOK="$HOOK_INVESTORS";', 'HOOK="${HOOK_INVESTORS:-$HOOK_MILESTONES}";')),
    ('the hand post runs from a branch', _sub('post', 'if [ "$GITHUB_REF" != refs/heads/main ]; then', 'if false; then')),
    ('the hand post reads green when Discord refuses', _sub('post', 'nothing was posted to #$CHANNEL."; exit 1 ;;', 'nothing was posted to #$CHANNEL." ;;')),
    ('the hand post takes any length', _sub('post', 'if [ "$n" -gt 1800 ]; then', 'if [ "$n" -gt 99999 ]; then')),
    ('the hand post can be started by a push', _trig),
]


def self_test():
    base = all_docs()
    c = Check(copy.deepcopy(base)).run()
    bad = 0
    if c.fails:
        print('FAIL the unbroken workflows do not pass: %s' % c.fails[0])
        bad += 1
    for name, brk in BREAKS:
        docs = copy.deepcopy(base)
        try:
            brk(docs)
        except AssertionError as e:
            print('FAIL %s' % e)
            bad += 1
            continue
        r = Check(docs).run()
        if r.fails:
            print('  ok   breaks when %s: %s' % (name, r.fails[0][:110]))
        else:
            print('FAIL nothing fails when %s' % name)
            bad += 1
    print('\n===== %d passed, %d failed =====' % (len(BREAKS) + 1 - bad, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    for t in ('bash', 'git', 'jq'):
        if not shutil.which(t):
            print('FAIL %s is not on PATH, so the scripts cannot be run here.' % t)
            sys.exit(1)
    sys.exit(self_test() if '--self-test' in sys.argv[1:] else report(Check(all_docs()).run()))
