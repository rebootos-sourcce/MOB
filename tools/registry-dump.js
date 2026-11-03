#!/usr/bin/env node
/* ============================================================
   REGISTRY DUMP. The engine tables the deep psychological registry
   overlaps, read out of a built engine.js as JSON. 24 October.

   tools/registry-reconcile.py runs this itself and reads its output, so the
   reconciliation always compares a registry against the engine as built, not
   against a copy of the tables someone pasted.

     node tools/registry-dump.js [engine.js]      JSON on stdout

   engine.js defaults to the one at the root. Build first
   (atuned_src/BUILD-engine.sh). Tables the engine exports are read from its
   exports; the four root tables it keeps to itself are read by evaluating the
   file a second time in a context with no host, which is safe because the
   engine is host free (hostfree.py holds it to that).
   ============================================================ */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const file = path.resolve(process.argv[2] || path.join(__dirname, '..', 'engine.js'));
const E = require(file);
const ctx = vm.createContext({ console: { log() {}, warn() {}, error() {} }, Date, Math, JSON });
vm.runInContext(fs.readFileSync(file, 'utf8'), ctx);
const inner = e => { try { return vm.runInContext(e, ctx); } catch (x) { return undefined; } };
const out = {
  engine: path.relative(process.cwd(), file),
  ROOTD: inner('ROOTD'), ROOTSEAT: inner('ROOTSEAT'),
  DOMAINS: E.DOMAINS, DOMDEF: E.DOMDEF, KB_RENAME: E.KB_RENAME,
  ARCH: E.ARCH, ARCH18: E.ARCH18, CODE_ARCH: E.CODE_ARCH,
  SABDEF_CODES: Object.fromEntries(Object.keys(E.SABDEF).map(k => [k, E.SABDEF[k].c])),
  CODE_ALIAS: E.CODE_ALIAS,
  MASTERS: E.MASTERS,
};
const missing = Object.keys(out).filter(k => out[k] === undefined);
if (missing.length) { console.error('registry-dump: the engine does not carry ' + missing.join(', ')); process.exit(1); }
process.stdout.write(JSON.stringify(out));
