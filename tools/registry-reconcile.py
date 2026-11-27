#!/usr/bin/env python3
"""REGISTRY RECONCILE. The deep psychological registry, held against this
repository's engine tables, the vendored canon.json and the owner's book, in
five passes. 24 October.

The registry is the research catalogue kept on MOB main and on
atuned/deep-psyche-kpi-closure-2026-10-24 at
docs/data/ATUNED_DEEP_PSYCHOLOGICAL_RECORD_REGISTRY_v1.json. The book is The
Mechanics of Being, MOB_Complete_vNNN.html, kept in reboot-os on its
manuscript branch. CANON-MERGE-PLAN.md quotes what this prints; run it again
rather than trusting a figure there.

  python3 -I tools/registry-reconcile.py --book v341.html [--book v342.html] REGISTRY.json [REGISTRY.json ...]
  python3 -I tools/registry-reconcile.py --selftest --book v341.html REGISTRY.json

  --engine FILE   the built engine, default engine.js. Read through
                  tools/registry-dump.js, so build first.
  --canon FILE    default vendor/reboot-os/canon.json
  --schema FILE   default the registry's own SCHEMA file beside it
  --book FILE     the book, .html or extracted .txt. The first is the one the
                  registry is compared with; any further one is compared with
                  the first, section by section.
  --selftest      plants one defect for each comparison in the last registry
                  given and fails unless every comparison names its own plant.
                  Run it first: a probe that cannot see a planted defect has
                  not seen anything.

The passes:
  1  does the registry hold together on its own: ids, counts, the fields its
     schema requires, parent and child links both ways, relationships
  2  where each layer says it comes from
  3  how finished each layer says it is
  4  record by record, against the engine, canon.json and the book
  5  is the reading, in CANON-MERGE-PLAN.md, which this tool does not write

Run with -I. The registry and the book are files from elsewhere, and -I keeps
Python from importing anything that sits beside them.
"""
import argparse, collections, copy, difflib, html.parser, json, os, re, subprocess, sys

EM, EN, ARROW, DOT = chr(0x2014), chr(0x2013), chr(0x2192), chr(0xb7)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

key = lambda s: re.sub(r'[^a-z0-9]+', ' ', str(s or '').lower()).strip()
SEAT = {'third eye': '3rd Eye', 'eye': '3rd Eye', '3rd eye': '3rd Eye', 'solar plexus': 'Solar', 'solar': 'Solar',
        'sacral': 'Sacral', 'heart': 'Heart', 'crown': 'Crown', 'throat': 'Throat', 'root': 'Root'}
seat = lambda s: SEAT.get(key(s), s)
# the newest registry gives its 22 new records layer names its own header does not use
LAYER_AS = {'V341 Domain Roster': 'source_v341.domain_roster', 'Related Consciousness Concepts': 'related_consciousness_candidates'}
lay = lambda x: LAYER_AS.get(x.get('layer'), x.get('layer'))


def words(s):
    return re.findall(r"[a-z0-9']+", str(s or '').lower().replace(chr(0x2019), "'"))


def ratio(a, b):
    """word sequence likeness, 1 is identical"""
    return difflib.SequenceMatcher(None, words(a), words(b)).ratio()


# ------------------------------------------------------------------ the book
class _Text(html.parser.HTMLParser):
    BLOCK = {'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'br', 'section', 'article', 'table', 'ul', 'ol',
             'blockquote', 'td', 'th', 'dt', 'dd', 'header', 'footer'}

    def __init__(s):
        super().__init__(convert_charrefs=True); s.o = []; s.skip = 0

    def handle_starttag(s, t, a):
        if t in ('script', 'style'): s.skip += 1
        if t in s.BLOCK: s.o.append('\n')
        if t in ('td', 'th'): s.o.append(' | ')

    def handle_endtag(s, t):
        if t in ('script', 'style'): s.skip = max(0, s.skip - 1)
        if t in s.BLOCK: s.o.append('\n')

    def handle_data(s, d):
        if not s.skip: s.o.append(d)


def book_text(path):
    raw = open(path, encoding='utf-8', errors='replace').read()
    if not path.lower().endswith(('.html', '.htm')): return raw
    p = _Text(); p.feed(raw)
    t = re.sub(r'[ \t\r\f\v]+', ' ', ''.join(p.o))
    return re.sub(r'\n\s*\n+', '\n', t)


def book_parse(t):
    """Every section of the book the registry or the engine overlaps."""
    L = t.split('\n')
    B = {}
    m = re.search(r'Architect \(Order\): (.+?)\. Engine \(Dynamics\): (.+?)\. Weaver \(Connection\): (.+?)\. '
                  r'Witness \(Awareness\): (.+?)\.', t)
    B['roster'] = {r: [x.strip() for x in m.group(i + 1).split(',')] for i, r in enumerate(['Architect', 'Engine', 'Weaver', 'Witness'])} if m else {}
    m = re.search(r'The names that stand are these: (.+?)\.', t)
    B['stand'] = [x.strip() for x in m.group(1).split(',')] if m else []
    B['defs'] = collections.OrderedDict()
    i = next((k for k, l in enumerate(L) if l.strip().startswith('Blueprint Domain Descriptions')), None)
    if i is not None:
        for k in range(i, min(i + 80, len(L) - 1)):
            h = re.match(r'^\s*([IVX]+) ' + DOT + r' (\w+)\s*$', L[k])
            if not h: continue
            d = re.match(r'^\s*Clear: (.*?) Distorted: (.*?)(?: Templates: (.*))?$', L[k + 1].strip())
            if d: B['defs'][h.group(2)] = {'n': h.group(1), 'c': d.group(1), 'x': d.group(2), 't': (d.group(3) or '').rstrip('.')}
    B['jung'] = collections.OrderedDict()
    i = next((k for k, l in enumerate(L) if l.strip().startswith('Jungian Archetype Library')), None)
    if i is not None:
        for k in range(i, min(i + 60, len(L))):
            s = L[k].strip()
            if not s.startswith('Saboteurs:'): continue
            nm = re.sub(r'^The\s+', '', L[k - 1].strip())
            m = re.match(r'^Saboteurs: (.+?) ' + DOT + r' (.+?)(?: ' + DOT + r' coherent marker: (\w+))?\. Distorted beliefs: (.*?) Clear: (.*)$', s)
            if m:
                B['jung'][nm] = {'sab': [x.strip() for x in m.group(1).split('/')], 'seat': [seat(x.strip()) for x in m.group(2).split('/')],
                                 'marker': m.group(3), 'distorted': m.group(4), 'clear': m.group(5)}
    B['thirteen'] = collections.OrderedDict()
    i = next((k for k, l in enumerate(L) if l.strip().startswith('The Thirteen Archetypes')), None)
    if i is not None:
        cells = []
        for k in range(i + 1, min(i + 60, len(L))):
            s = L[k].strip()
            if s.startswith('|'): cells.append(s.lstrip('|').strip())
            elif len(cells) > 3: break
        cells = cells[3:]
        for j in range(0, len(cells) - 2, 3):
            B['thirteen'][cells[j]] = {'seat': seat(cells[j + 1]), 'sab': cells[j + 2]}
    # the two seat table: where each archetype acts from, and where its saboteur distorts it
    B['twoseat'] = collections.OrderedDict()
    i = next((k for k, l in enumerate(L) if l.strip().startswith('The Geometric Archetypes')), None)
    if i is not None:
        j = next((k for k in range(i, min(i + 40, len(L))) if L[k].strip() == '| Archetype'), None)
        cells = []
        for k in range(j or len(L), min((j or 0) + 90, len(L))):
            s = L[k].strip()
            if not s.startswith('|'): break
            cells.append(s.lstrip('|').strip())
        cells = cells[5:]
        for q in range(0, len(cells) - 4, 5):
            nm, acts, dist, lean, how = cells[q:q + 5]
            sab = dist.split(',', 1)
            B['twoseat'][nm] = {'acts': None if acts == 'not placed' else seat(acts), 'seat': seat(sab[0].strip()),
                                'sab': sab[1].strip() if len(sab) > 1 else None, 'how': how}
    B['conscious'] = collections.OrderedDict()
    B['related'] = collections.OrderedDict()
    i = next((k for k, l in enumerate(L) if 'The eighth, Empyrean Consciousness' in l), None)
    if i is not None:
        for k in range(i, min(i + 40, len(L) - 2)):
            if re.match(r'^\s*\w+ Consciousness\s*$', L[k]) and L[k + 1].strip() == ARROW:
                B['conscious'][L[k].strip()] = {'n': L[k - 1].strip(), 'd': L[k + 2].strip()}
        for k in range(i, min(i + 40, len(L))):
            m = re.match(r'^\s*(Pattern|Story|Imperium) Consciousness, (.*?) Affirmation: (.*)$', L[k])
            if m: B['related'][m.group(1) + ' Consciousness'] = {'d': m.group(2), 'aff': m.group(3).strip()}
    B['aff'] = collections.OrderedDict()
    m = re.search(r'P21 ' + DOT + r' The Seven Affirmations[^\n]*\n((?:[^\n]+\n){7})', t)
    if m:
        for l in m.group(1).strip().split('\n'):
            z, a = l.split(':', 1)
            B['aff'][seat(z.strip())] = a.strip()
    B['masters'] = []
    i = next((k for k, l in enumerate(L) if l.strip().startswith('The Ascended Masters on the Three-Axis')), None)
    if i is not None:
        for k in range(i, min(i + 30, len(L))):
            m = re.match(r'^\s*([A-Z][A-Za-z ]+?)(?: / Wu Wei)?, ', L[k])
            if m and L[k - 1].strip() and len(L[k - 1].strip()) <= 3: B['masters'].append(m.group(1))
    return B


def book_checks(B):
    """The parse is trusted only when it found every row the book says it has."""
    want = {'defs': 19, 'jung': 12, 'thirteen': 13, 'twoseat': 13, 'conscious': 8, 'related': 3, 'aff': 7, 'stand': 7}
    bad = ['%s found %d of %d' % (k, len(B[k]), n) for k, n in want.items() if len(B[k]) != n]
    if sum(len(v) for v in B['roster'].values()) != 19: bad.append('roster is not nineteen')
    return bad


# ------------------------------------------------------------- the passes
def sab_code(mob):
    """a saboteur's name to its code, through SABDEF and every saboteur alias the codes carry"""
    m = {key(k): v for k, v in mob['SABDEF_CODES'].items()}
    for r in mob.get('CODE_ALIAS') or []:
        if r[1] == 'saboteur': m[key(r[2])] = r[3]
    return lambda n: m.get(key(n))


def structure(reg, raw, schema, catalog, say):
    R = reg['records']
    ID = {x['id']: x for x in R}
    L = collections.Counter(x.get('layer') for x in R)
    F = {'layer_names_split': sorted(set(L) - set(reg.get('countsByLayer', {})))}
    F['count_header'] = reg.get('recordCount') == len(R) and dict(L) == reg.get('countsByLayer')
    F['missing_req'] = [(x['id'], f) for x in R for f in schema.get('required', []) if f not in x]
    F['passes_not_3'] = [x['id'] for x in R if len(x.get('researchPasses', [])) != 3]
    wp = [x for x in R if x.get('parentId')]
    wk = [x for x in R if x.get('childIds')]
    F['parent_missing'] = [x['id'] for x in wp if x['parentId'] not in ID]
    F['nonrecip'] = [x['id'] for x in wp if x['parentId'] in ID and x['id'] not in ID[x['parentId']].get('childIds', [])]
    F['kid_bad'] = [(x['id'], c) for x in wk for c in x['childIds'] if c not in ID or ID[c].get('parentId') != x['id']]
    rels = [r for x in R for r in x.get('relationships', [])]
    F['dangling'] = [r.get('toId') for r in rels if r.get('toId') not in ID or r.get('fromId') not in ID]
    miss_by = collections.Counter(f for _, f in F['missing_req'])
    say('  records', len(R), '| unique ids', len(ID), '| header count and layer counts agree:', F['count_header'],
        '| record layer names the header does not use:', [(n, LAYER_AS.get(n)) for n in F['layer_names_split']] or 'none')
    say('  records missing a field the schema requires:', len(set(i for i, _ in F['missing_req'])), dict(miss_by) or '',
        '| without exactly three research passes:', len(F['passes_not_3']))
    say('  with a parent:', len(wp), '| with children:', len(wk), '| parent layers:', sorted(set(lay(ID[x['parentId']]) for x in wp if x['parentId'] in ID)),
        '| child layers:', sorted(set(lay(x) for x in wp)))
    say('  a parent that is no record:', len(F['parent_missing']), '| a child its parent does not list:', len(F['nonrecip']),
        '| a listed child naming another parent:', len(F['kid_bad']))
    say('  typed relationships:', len(rels), sorted(set(r.get('type') for r in rels)), sorted(set(r.get('status') for r in rels)),
        '| an end that is no record:', len(F['dangling']))
    say('  records with a non-empty links array:', sum(1 for x in R if x.get('links')), 'of', len(R))
    # a template field the record lacks while its own check reports nothing missing
    tpl = {t.get('id'): t for t in (catalog or {}).get('templates', []) if isinstance(t, dict)}
    F['tpl_lies'] = [x['id'] for x in R if x.get('templateId') in tpl and [f for f in tpl[x['templateId']].get('fields', []) if f not in x]
                     and not (x.get('templateValidation') or {}).get('missingFields')]
    say('  records lacking a field their own template names while their own check lists nothing missing:', len(F['tpl_lies']),
        sorted(set(f for x in R if x['id'] in F['tpl_lies'] for f in tpl[x['templateId']].get('fields', []) if f not in x)) or '')
    say('  em dashes in the file:', raw.count(EM), '| en dashes:', raw.count(EN))
    return F


def provenance(reg, say):
    L = collections.OrderedDict()
    for x in reg['records']: L.setdefault(lay(x), []).append(x)
    for ln, xs in L.items():
        c = collections.Counter()
        for x in xs:
            s = ' '.join(x.get('sourceRefs', []) + x.get('sourceIds', []))
            if 'canon.json' in s: c['canon.json'] += 1
            if re.search(r'\b(ARCH12|ARCHDOM|ARCH18|CDOMAIN|SAB33|NODEREG)\.json', s): c['reboot-os app tables'] += 1
            if re.search(r'\d\d_[a-z-]+\.js', s): c['reboot-os app source'] += 1
            if 'v341' in s: c['book v341'] += 1
            if 'v336' in s: c['book v336, comparison only'] += 1
            if 'MOB-Manuscript/index.html' in s: c['mob-manuscript index.html'] += 1
            if re.search(r'https?://(?!github\.com/rebootos)', s): c['outside literature'] += 1
            if 'docs/ATUNED' in s: c["the registry's own documents"] += 1
            if re.search(r'[Oo]wner', s): c['owner conversation'] += 1
            if 'atuned_src' in s or 'source.html' in s or 'engine.js' in s: c['this repository'] += 1
        say('  %-44s %3d  %s' % (ln, len(xs), dict(c)))


def maturity(reg, say):
    L = collections.OrderedDict()
    for x in reg['records']: L.setdefault(lay(x), []).append(x)
    for ln, xs in L.items():
        conf = [x.get('confidence') for x in xs if isinstance(x.get('confidence'), (int, float))]
        tv = collections.Counter((x.get('templateValidation') or {}).get('runtimeIntegration') for x in xs)
        uq = sum(len(x.get('unresolvedQuestions', [])) for x in xs)
        say('  %-44s confidence %s to %s | open questions %3d | wired %s' % (ln, min(conf) if conf else '-', max(conf) if conf else '-', uq, dict(tv)))
    say('  header status:', reg.get('status'))


def compare(reg, mob, canon, book, say):
    """Pass 4. Returns its findings by name, so the selftest can read them."""
    F = {}
    R = reg['records']
    ID = {x['id']: x for x in R}
    L = collections.OrderedDict()
    for x in R: L.setdefault(lay(x), []).append(x)
    sc = sab_code(mob)
    # roots
    roots = L.get('deep_psychological.roots', [])
    F['roots_differ'] = sorted(set(x['canonicalName'] for x in roots) ^ set(mob['ROOTD']))
    F['root_seats_differ'] = [(x['canonicalName'], seat(x['seat']), mob['ROOTSEAT'].get(x['canonicalName']))
                              for x in roots if seat(x['seat']) != mob['ROOTSEAT'].get(x['canonicalName'])]
    say('  roots: the same four as ROOTD:', not F['roots_differ'], '| seats as ROOTSEAT:', F['root_seats_differ'] or 'all four')
    # the canon domain layer
    cd = L.get('source_os_canon.registers.domains', [])
    cj = sorted((k.split(' ')[0], n) for k, v in canon['registers']['domains'].items() for n in v)
    rg = sorted((ID[x['parentId']]['canonicalName'], x['canonicalName']) for x in cd if x.get('parentId') in ID)
    mp = sorted((d['r'], d['nm']) for d in mob['DOMAINS'])
    F['canon_layer_vs_canon'] = sorted(set(cj) ^ set(rg))
    say('  canon domain layer: equal to the vendored canon.json, root and name:', not F['canon_layer_vs_canon'], len(rg), 'rows', F['canon_layer_vs_canon'] or '')
    say('    DOMAINS holds each with the same root:', set(rg) <= set(mp), '| DOMAINS has besides:', sorted(set(mp) - set(rg)))
    # the book's nineteen against DOMAINS, position by position, since a record stores the position
    ren = {key(k): v for k, v in mob['KB_RENAME'].items()}
    broster = [(r, n) for r in ['Architect', 'Engine', 'Weaver', 'Witness'] for n in book['roster'].get(r, [])]
    F['domains_pos'] = []
    for i, d in enumerate(mob['DOMAINS']):
        b = broster[i] if i < len(broster) else ('', '')
        if (d['r'], d['nm']) != b:
            F['domains_pos'].append((i, d['r'] + ' ' + d['nm'], b[0] + ' ' + b[1], 'KB_RENAME pairs them' if ren.get(key(d['nm'])) == b[1] else 'not paired'))
    say("  DOMAINS against the book's nineteen, position by position:", len(mob['DOMAINS']) - len(F['domains_pos']), 'of', len(mob['DOMAINS']), 'the same')
    for r in F['domains_pos']: say('      position %2d  here %-22s book %-22s %s' % r)
    F['stand_missing_here'] = [n for n in book['stand'] if key(n) not in {key(d['nm']) for d in mob['DOMAINS']}]
    say("    of the book's seven standing names, missing from DOMAINS:", F['stand_missing_here'])
    # DOMDEF against the book's descriptions
    dd = mob['DOMDEF']
    F['domdef_order'] = [(k, n) for k, n in zip(dd, book['defs']) if key(k) != key(n) or dd[k]['n'] != book['defs'][n]['n']]
    rs = []
    for k in dd:
        b = next((v for n, v in book['defs'].items() if key(n) == key(k)), None)
        rs.append((k, round(ratio(dd[k]['c'], b['c']), 3), round(ratio(dd[k]['x'], b['x']), 3)) if b else (k, None, None))
    F['domdef_far'] = [r for r in rs if r[1] is None or r[1] < 0.9 or r[2] < 0.9]
    say("  DOMDEF against the book's descriptions of all nineteen: same keys, same numbers, same order:", not F['domdef_order'],
        '| text likeness, 1 is identical: lowest clear', min(r[1] for r in rs if r[1] is not None),
        'lowest distorted', min(r[2] for r in rs if r[2] is not None), '| below 0.9:', F['domdef_far'] or 'none')
    # the behavioral domain layer
    bd = L.get('deep_psychological.behavioral_domains', [])
    dk = list(dd)
    F['behav'] = []
    for i, x in enumerate(bd):
        k = dk[i]
        b = next((v for n, v in book['defs'].items() if key(n) == key(k)), {})
        F['behav'].append((x['canonicalName'], k, round(ratio(x.get('definition'), b.get('c', '')), 2), round(ratio(x.get('definition'), dd[k]['c']), 2),
                           any(key(k) == key(w) for w in re.split(r' and | ', x['canonicalName']))))
    say('  behavioral domains:', len(bd), "| row k beside DOMDEF entry k: label, DOMDEF key, definition likeness to the book's text and to DOMDEF, key word in the label")
    for r in F['behav']: say('      %-38s %-13s book %.2f  DOMDEF %.2f  %s' % r)
    F['behav_superseded'] = [r[0] for r in F['behav'] if not r[4]]
    say("    labels the book's standing names replace:", F['behav_superseded'])
    # the v341 roster layer
    vr = L.get('source_v341.domain_roster', [])
    if vr:
        got = sorted((x.get('sourceCluster'), x['canonicalName']) for x in vr)
        F['v341_vs_book'] = sorted(set(got) ^ set(broster))
        nodef = [x['canonicalName'] for x in vr if 'NOT_EXTRACTED' in str(x.get('standaloneDefinitionStatus')) or 'does not provide a standalone definition' in str(x.get('definition'))]
        F['v341_def_open_but_in_book'] = [n for n in nodef if any(key(n) == key(b) for b in book['defs'])]
        say('  v341 roster:', len(vr), 'records | equal to the book roster, cluster and name:', not F['v341_vs_book'], F['v341_vs_book'] or '')
        say('    records saying the v341 definition is not available:', len(nodef), '| of those, defined in the book itself:', len(F['v341_def_open_but_in_book']),
            '| and in DOMDEF here:', len([n for n in F['v341_def_open_but_in_book'] if key(n) in {key(k) for k in dd}]))
        say('    with a parentId:', sum(1 for x in vr if x.get('parentId')), '| with only a candidate root named:', sum(1 for x in vr if x.get('candidateClusterRootId') and not x.get('parentId')))
    # archetypes
    an = [x['canonicalName'] for x in L.get('archetype_taxonomy.candidates', [])]
    a18 = [r[0] for r in mob['ARCH18']]
    arch = [a['nm'] for a in mob['ARCH']]
    F['cand_vs_arch18'] = sorted(set(an) ^ set(a18))
    alias = {'Rebel': 'Outlaw', 'Everyman': 'Orphan', 'Caregiver': 'Caretaker'}
    bj = list(book['jung'])
    F['arch_vs_book12'] = [a for a in arch if alias.get(a, a) not in bj]
    say('  archetype candidates:', len(an), '| the same names as ARCH18:', not F['cand_vs_arch18'], F['cand_vs_arch18'] or '',
        '| of ARCH, also candidates:', len([a for a in arch if a in an]), '| ARCH only:', [a for a in arch if a not in an])
    say("    the book's twelve, chapter 12:", bj)
    say("    ARCH's twelve are the book's twelve with Rebel as Outlaw, Everyman as Orphan, Caregiver as Caretaker:", not F['arch_vs_book12'], F['arch_vs_book12'] or '')
    # ARCH18, three ways
    tup = {}
    for x in L.get('archetype_fetter_seat_mapping_table', []):
        m = re.match(r'(.+?) ' + ARROW + r' (.+?) @ (.+)$', x['nm'])
        tup[m.group(1)] = (m.group(2), seat(m.group(3)))
    here = {r[0]: (r[1], r[2]) for r in mob['ARCH18']}
    th = book['thirteen']
    bsab = lambda s: 'Avoider' if s.startswith('Avoidance') else s
    rows = []
    for a in here:
        r_, b_ = tup.get(a), th.get(a)
        rows.append((a, '%s@%s' % here[a], '%s@%s' % r_ if r_ else '-', '%s@%s' % (bsab(b_['sab']), b_['seat']) if b_ else '-',
                     bool(r_) and sc(r_[0]) == sc(here[a][0]) and r_[1] == here[a][1],
                     bool(b_) and sc(bsab(b_['sab'])) == sc(here[a][0]) and b_['seat'] == here[a][1],
                     bool(b_) and bool(r_) and sc(bsab(b_['sab'])) == sc(r_[0]) and b_['seat'] == r_[1]))
    F['a18_reg_differs'] = [r[0] for r in rows if r[2] != '-' and not r[4]]
    F['a18_here_vs_book'] = [r[0] for r in rows if r[3] != '-' and not r[5]]
    F['a18_reg_vs_book'] = [r[0] for r in rows if r[3] != '-' and r[2] != '-' and not r[6]]
    say("  ARCH18: here, the registry, the book's thirteen. A saboteur is matched by its code, so Controller and Micromanager are both S02:")
    for r in rows: say('      %-12s here %-24s registry %-24s book %-26s reg=here %-5s here=book %-5s reg=book %s' % r)
    say('    registry differs from here:', F['a18_reg_differs'], '| here differs from the book:', F['a18_here_vs_book'], '| registry differs from the book:', F['a18_reg_vs_book'])
    two = []
    for a, v in book['jung'].items():
        t1 = th.get(a) or th.get({'Caretaker': 'Caregiver'}.get(a, a))
        if not t1: two.append((a, 'not in the thirteen')); continue
        if not (sc(bsab(t1['sab'])) in [sc(s) for s in v['sab']] and t1['seat'] in v['seat']):
            two.append((a, 'chapter 12 %s @ %s, the thirteen %s @ %s' % ('/'.join(v['sab']), '/'.join(v['seat']), t1['sab'], t1['seat'])))
    F['book_tables_disagree'] = two
    say("    the book's chapter 12 against its own thirteen, rows where the thirteen's saboteur or seat is not one of chapter 12's two:", len(two))
    for r in two: say('      %-10s %s' % r)
    ts = book['twoseat']
    tname = lambda n: re.sub(r' \(.*\)$', '', n)
    F['twoseat_vs_arch18'] = [n for n, v in ts.items() if tname(n) in here and not (sc(bsab(v['sab'] or '')) == sc(here[tname(n)][0]) and v['seat'] == here[tname(n)][1])]
    archb = {a['nm']: a.get('b') for a in mob['ARCH']}
    tarch = lambda n: {'Outlaw (Rebel)': 'Rebel'}.get(n, n)
    F['twoseat_native_vs_arch'] = [(n, v['acts'], archb.get(tarch(n))) for n, v in ts.items() if tarch(n) in archb and v['acts'] != archb.get(tarch(n))]
    say("    the book's two seat table: its distortion seat and saboteur against ARCH18, rows that differ by code or seat:", F['twoseat_vs_arch18'] or 'none',
        "| its native seat against ARCH's b, rows that differ:", F['twoseat_native_vs_arch'] or 'none',
        '| left open in the book:', [n for n, v in ts.items() if v['acts'] is None])
    ca = {r[0]: r for r in canon['registers'].get('archetypes') or []}
    diff, same = [], []
    for a, v in book['jung'].items():
        c = ca.get(a) or ca.get({'Caretaker': 'Caregiver'}.get(a, a))
        if not c: diff.append((a, 'not in canon.json')); continue
        if sorted(str(sc(s)) for s in v['sab']) == sorted(str(sc(s)) for s in c[1:3]) and sorted(v['seat']) == sorted(seat(s) for s in c[3:5]): same.append(a)
        else: diff.append((a, 'chapter 12 %s @ %s, canon.json %s @ %s' % ('/'.join(v['sab']), '/'.join(v['seat']), '/'.join(c[1:3]), '/'.join(seat(s) for s in c[3:5]))))
    F['book12_vs_canon'] = diff
    say("    chapter 12 against canon.json's archetypes register, two saboteurs and two seats each: the same in", len(same), 'of', len(book['jung']), same)
    for r in diff: say('      %-10s %s' % r)
    # archetype to domain
    tgt = [re.match(r'.+ ' + ARROW + r' (.+)$', x['nm']).group(1) for x in L.get('archetype_domain_mapping_table', [])]
    dn = {key(d['nm']) for d in mob['DOMAINS']} | {key(v) for v in mob['KB_RENAME'].values()} | {key(n) for n in book['defs']}
    rn = {key(r) for r in mob['ROOTD']}
    F['archdom_not_domain'] = [t for t in tgt if key(t) not in dn]
    say('  archetype to domain rows:', len(tgt), '| targets that are no domain in the book or here:', F['archdom_not_domain'], '| of those, a root:', [t for t in F['archdom_not_domain'] if key(t) in rn])
    # cultural figures
    cf = L.get('separate_cultural_figure_domain_table', [])
    fn = [x['canonicalName'] for x in cf]
    ft = [(re.search(r'to (\w+);', x.get('definition', '')) or re.search(r'(\w+)$', x['nm'])).group(1) for x in cf]
    mast = [x['nm'] for x in mob.get('MASTERS') or []]
    bm = book['masters']
    nrm = lambda n: {'Jesus': 'Christ'}.get(n, n)
    F['figure_not_domain'] = [t for t in ft if key(t) not in dn]
    say('  cultural figures:', len(fn), '| in MASTERS here:', len([f for f in fn if f in mast]), "| on the book's coordinate list:", len([f for f in fn if nrm(f) in bm]),
        '| on neither:', [f for f in fn if f not in mast and nrm(f) not in bm], '| targets that are no domain:', F['figure_not_domain'])
    # conscious domains and the affirmations
    cdm = L.get('conscious_domains', [])
    bc = book['conscious']
    F['conscious_vs_book'] = sorted(set(x['canonicalName'] for x in cdm) ^ set(bc))
    lk = [ratio(x.get('definition'), bc.get(x['canonicalName'], {}).get('d', '')) for x in cdm]
    say('  Conscious Domains:', len(cdm), '| the same eight names as the book:', not F['conscious_vs_book'], F['conscious_vs_book'] or '',
        '| definition likeness to the book, lowest:', round(min(lk), 2) if lk else '-')
    order7 = list(book['aff'])
    zone_of = {}
    for nm, v in bc.items():
        if not v['n'].isdigit(): continue
        zs = [seat(z) for z in re.findall(r'(Crown|Third Eye|Throat|Heart|Solar plexus|Solar Plexus|Sacral|Root)', v['d'])]
        zone_of[nm] = (v['n'], order7[7 - int(v['n'])] if 0 < int(v['n']) <= 7 else None, zs)
    F['conscious_number_vs_text'] = [(nm, n, zp, zs) for nm, (n, zp, zs) in zone_of.items() if zs and zp not in zs]
    say("    the book numbers them 7 down to 1, Crown to Root; rows whose own text names another zone than the number gives:", F['conscious_number_vs_text'])
    aff = {x['canonicalName']: x.get('affirmation') for x in cdm}
    by_text = {nm: (book['aff'].get(zs[0]) if zs else None) for nm, (n, zp, zs) in zone_of.items()}
    by_num = {nm: book['aff'].get(zp) for nm, (n, zp, zs) in zone_of.items()}
    F['aff_reg_vs_text'] = [nm for nm in by_text if by_text[nm] and aff.get(nm) != by_text[nm]]
    unnamed = [nm for nm in by_text if not by_text[nm]]
    say("    of the", len(by_text) - len(unnamed), "whose text names a zone, the registry gives that zone's affirmation in", len(by_text) - len(unnamed) - len(F['aff_reg_vs_text']),
        '| the', len(unnamed), 'naming none', unnamed, 'take the affirmation at their number:', all(by_num[nm] == aff.get(nm) for nm in unnamed))
    rel = L.get('related_consciousness_candidates', [])
    if rel:
        F['related_aff'] = [(x['canonicalName'], x.get('affirmation') == book['related'].get(x['canonicalName'], {}).get('aff')) for x in rel]
        say('  related consciousness:', len(rel), '| affirmation word for word as the book:', F['related_aff'])
    bs = L.get('psyche_map.blueprint_domain_visual_slots', [])
    say('  blueprint slots:', len(bs), '| named:', sum(1 for x in bs if not str(x.get('nm', '')).startswith('UNRESOLVED')))
    return F


# ------------------------------------------------------------------ driver
def engine_tables(engine):
    out = subprocess.run(['node', os.path.join(HERE, 'registry-dump.js'), engine], capture_output=True, text=True)
    if out.returncode:
        sys.exit('registry-dump.js failed: ' + out.stderr.strip())
    return json.loads(out.stdout)


def selftest(reg, raw, mob, canon, book, schema, catalog):
    quiet = lambda *a: None
    base, sbase = compare(reg, mob, canon, book, quiet), structure(reg, raw, schema, catalog, quiet)
    fails = []

    def rec(k, i): return next(x for x in k['records'] if x['id'] == i)

    def first(k, layer, pre=''): return next(x for x in k['records'] if lay(x) == layer and x.get('nm', '').startswith(pre))

    def plant(name, finding, mutate, which='compare'):
        k2, m2, c2, b2 = copy.deepcopy(reg), copy.deepcopy(mob), copy.deepcopy(canon), copy.deepcopy(book)
        try:
            mutate(k2, m2, c2, b2)
        except (StopIteration, KeyError, IndexError):
            print('  %-60s %-26s %s' % (name, finding, 'NOT PLANTED, this registry has no such row')); fails.append(name); return
        got = compare(k2, m2, c2, b2, quiet) if which == 'compare' else structure(k2, raw, schema, catalog, quiet)
        moved = got.get(finding) != (base if which == 'compare' else sbase).get(finding)
        print('  %-60s %-26s %s' % (name, finding, 'caught' if moved else 'MISSED'))
        if not moved: fails.append(name)
    print('SELFTEST. One planted defect for each comparison. Each must be caught.')
    plant('a root seat moved in ROOTSEAT', 'root_seats_differ', lambda k, m, c, b: m['ROOTSEAT'].update(Architect='Root'))
    plant('a canon.json domain renamed', 'canon_layer_vs_canon', lambda k, m, c, b: c['registers']['domains']['Witness (Awareness)'].__setitem__(0, 'Natura'))
    plant('two DOMAINS rows swapped', 'domains_pos', lambda k, m, c, b: m['DOMAINS'].__setitem__(slice(0, 2), [m['DOMAINS'][1], m['DOMAINS'][0]]))
    plant('Dissolution renamed back to Destruction here', 'stand_missing_here', lambda k, m, c, b: [d.update(nm='Destruction') for d in m['DOMAINS'] if d['nm'] == 'Dissolution'])
    plant('a DOMDEF clear text rewritten', 'domdef_far', lambda k, m, c, b: m['DOMDEF']['justice'].update(c='nothing like the book at all'))
    plant('a behavioral domain relabelled', 'behav_superseded', lambda k, m, c, b: first(k, 'deep_psychological.behavioral_domains').update(canonicalName='Lore'))
    if any(lay(x) == 'source_v341.domain_roster' for x in reg['records']):
        plant('a v341 roster record moved to another cluster', 'v341_vs_book', lambda k, m, c, b: rec(k, 'v341-domain:engine:death').update(sourceCluster='Weaver'))
        plant('a v341 record given a definition', 'v341_def_open_but_in_book', lambda k, m, c, b: rec(k, 'v341-domain:engine:death').update(standaloneDefinitionStatus='EXTRACTED', definition='Completion.'))
    plant('an ARCH18 seat moved here', 'a18_here_vs_book', lambda k, m, c, b: m['ARCH18'].__setitem__(1, ['Caregiver', 'Pleaser', 'Throat']))
    plant('a registry ARCH18 saboteur changed', 'a18_reg_differs', lambda k, m, c, b: first(k, 'archetype_fetter_seat_mapping_table', 'Creator').update(nm='Creator ' + ARROW + ' Judge @ Throat'))
    plant('the alias Controller for S02 removed', 'a18_reg_differs', lambda k, m, c, b: m.__setitem__('CODE_ALIAS', [r for r in m['CODE_ALIAS'] if r[2] != 'Controller']))
    plant("a seat moved in the book's thirteen", 'book_tables_disagree', lambda k, m, c, b: b['thirteen']['Lover'].update(seat='Root'))
    plant("a distortion seat moved in the book's two seat table", 'twoseat_vs_arch18', lambda k, m, c, b: b['twoseat']['Sage'].update(seat='Crown'))
    plant("a native seat moved in the book's two seat table", 'twoseat_native_vs_arch', lambda k, m, c, b: b['twoseat']['Warrior'].update(acts='Heart'))
    plant("a saboteur moved in canon.json's archetypes", 'book12_vs_canon', lambda k, m, c, b: c['registers']['archetypes'].__setitem__(9, ['Ruler', 'Judge', 'Hyper-Achiever', 'Solar', 'Crown']))
    plant('an archetype candidate renamed', 'cand_vs_arch18', lambda k, m, c, b: rec(k, 'archetype:candidate:warrior').update(canonicalName='Fighter'))
    plant('an ARCH name the book lacks', 'arch_vs_book12', lambda k, m, c, b: m['ARCH'][0].update(nm='Fighter'))
    plant('an archetype to domain row aimed at nothing', 'archdom_not_domain', lambda k, m, c, b: first(k, 'archetype_domain_mapping_table').update(nm='Warrior ' + ARROW + ' Nowhere'))
    plant('a figure aimed at nothing', 'figure_not_domain', lambda k, m, c, b: first(k, 'separate_cultural_figure_domain_table').update(definition='CDOMAIN source row maps this figure to Nowhere; x'))
    plant('a conscious domain renamed', 'conscious_vs_book', lambda k, m, c, b: rec(k, 'conscious-domain:02').update(canonicalName='Crown Awareness'))
    plant('a conscious affirmation swapped', 'aff_reg_vs_text', lambda k, m, c, b: rec(k, 'conscious-domain:02').update(affirmation="I'm always present."))
    plant("the book's numbering made to agree with its text", 'conscious_number_vs_text',
          lambda k, m, c, b: (b['conscious']['Value Consciousness'].update(n='2'), b['conscious']['Royal Consciousness'].update(n='3')))
    plant('a parent link broken', 'nonrecip', lambda k, m, c, b: rec(k, 'root:engine')['childIds'].pop(0), which='structure')
    plant('a parent that is no record', 'parent_missing', lambda k, m, c, b: next(x for x in k['records'] if x.get('parentId')).update(parentId='root:nobody'), which='structure')
    plant('a required field removed', 'missing_req', lambda k, m, c, b: rec(k, 'root:engine').pop('sourceRefs'), which='structure')
    tf = {t.get('id'): t.get('fields', []) for t in (catalog or {}).get('templates', [])}
    whole = lambda x: x.get('templateId') in tf and all(f in x for f in tf[x['templateId']]) and not (x.get('templateValidation') or {}).get('missingFields')
    plant('a template field removed, its own check left saying none missing', 'tpl_lies',
          lambda k, m, c, b: (lambda x: x.pop(next(f for f in tf[x['templateId']] if f not in ('nm', 'id'))))(next(x for x in k['records'] if whole(x))), which='structure')
    print('selftest', 'PASSED, every plant caught' if not fails else 'FAILED: ' + ', '.join(fails))
    return 1 if fails else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('registries', nargs='+')
    ap.add_argument('--engine', default=os.path.join(ROOT, 'engine.js'))
    ap.add_argument('--canon', default=os.path.join(ROOT, 'vendor', 'reboot-os', 'canon.json'))
    ap.add_argument('--schema')
    ap.add_argument('--catalog')
    ap.add_argument('--book', action='append', required=True)
    ap.add_argument('--selftest', action='store_true')
    a = ap.parse_args()
    mob = engine_tables(a.engine)
    canon = json.load(open(a.canon, encoding='utf-8'))
    books = []
    for p in a.book:
        b = book_parse(book_text(p))
        bad = book_checks(b)
        if bad: sys.exit('the book parse is incomplete in %s: %s' % (p, '; '.join(bad)))
        books.append((os.path.basename(p), b))
    regs = []
    for p in a.registries:
        raw = open(p, encoding='utf-8').read()
        sp = a.schema or os.path.join(os.path.dirname(p), os.path.basename(p).replace('REGISTRY', 'SCHEMA'))
        cp = a.catalog or os.path.join(os.path.dirname(p), os.path.basename(p).replace('RECORD_REGISTRY', 'TEMPLATE_CATALOG').replace('REGISTRY', 'TEMPLATE_CATALOG'))
        load = lambda f: json.load(open(f, encoding='utf-8')) if os.path.exists(f) else {}
        regs.append((p, json.loads(raw), raw, load(sp), load(cp)))
    if a.selftest:
        p, reg, raw, schema, catalog = regs[-1]
        sys.exit(selftest(reg, raw, mob, canon, books[0][1], schema, catalog))
    say = lambda *x: print(' '.join(str(y) for y in x))
    say('engine', mob['engine'], '| canon.json', os.path.relpath(a.canon), '| book', books[0][0])
    for p, reg, raw, schema, catalog in regs:
        say('=' * 96)
        say('REGISTRY', p, '| recordCount', reg.get('recordCount'), '| generatedAt', reg.get('generatedAt'), '| lastUpdated', reg.get('lastUpdated'))
        say('PASS 1. DOES IT HOLD TOGETHER ON ITS OWN')
        structure(reg, raw, schema, catalog, say)
        say('PASS 2. WHERE EACH LAYER SAYS IT COMES FROM')
        provenance(reg, say)
        say('PASS 3. HOW FINISHED EACH LAYER SAYS IT IS')
        maturity(reg, say)
        say('PASS 4. RECORD BY RECORD, AGAINST THE ENGINE, canon.json AND', books[0][0])
        compare(reg, mob, canon, books[0][1], say)
    for nm, b in books[1:]:
        say('=' * 96)
        say('THE BOOK,', books[0][0], 'AGAINST', nm, 'IN EVERY SECTION PARSED')
        for k in books[0][1]:
            say('  %-10s %s' % (k, 'identical' if books[0][1][k] == b[k] else 'DIFFERS'))


if __name__ == '__main__':
    main()
