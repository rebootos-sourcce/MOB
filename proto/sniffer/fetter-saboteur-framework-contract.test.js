'use strict';

// Structural template-parity gate. This reads the source copy table only; it
// does not execute or regenerate engine products.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const bands = require('./bands');

const sourcePath = path.join(__dirname, '../../atuned_src/engine/data/sabcard.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const rows = [...source.matchAll(/^\s*"([^"]+)":\{([\s\S]*?)^\s*\},?\s*$/gm)]
  .map(([, key, body]) => ({ key, body }));

assert.equal(rows.length, 33, 'the user-facing story table must contain exactly 33 Saboteur records');
assert.equal(bands.length, 33, 'canonical band table must contain exactly 33 Saboteurs');
assert.equal(new Set(rows.map(row => row.key)).size, 33, 'story keys must be unique');

const missing = [];
for (const row of rows) {
  for (const field of ['h', 'a', 'n']) {
    const match = row.body.match(new RegExp('(?:^|\\n)\\s*' + field + ':\\s*"([\\s\\S]*?)"\\s*,?\\s*(?=\\n|$)'));
    if (!match || !match[1].trim()) missing.push(row.key + '.' + field);
  }
  if (!/Reflection:/.test(row.body)) missing.push(row.key + '.reflection_prompt');
}
assert.deepEqual(missing, [], 'every Saboteur must have a story (h), coherent availability (a), next move (n), and reflection prompt');

console.log('fetter-saboteur-framework-contract: 33/33 story records contain h/a/n and reflection fields');
