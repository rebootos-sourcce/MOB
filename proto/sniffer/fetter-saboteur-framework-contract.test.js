'use strict';

// Structural template-parity gate. Reads source copy only; it does not
// execute or regenerate engine products.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const bands = require('./bands');

const sourcePath = path.join(__dirname, '../../atuned_src/engine/data/sabcard.js');
const source = fs.readFileSync(sourcePath, 'utf8');
const keys = [...source.matchAll(/^\s*"([^"]+)":\{\s*$/gm)];
const rows = keys.map((keyMatch, index) => {
  const start = keyMatch.index + keyMatch[0].length;
  const end = index + 1 < keys.length ? keys[index + 1].index : source.indexOf('\n};', start);
  return { key: keyMatch[1], body: source.slice(start, end) };
});

assert.equal(rows.length, 33, 'user-facing story table must contain exactly 33 Saboteur records');
assert.equal(bands.length, 33, 'canonical band table must contain exactly 33 Saboteurs');
assert.equal(new Set(rows.map(row => row.key)).size, 33, 'story keys must be unique');

const normalize = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const storyKeys = new Set(rows.map(row => normalize(row.key)));
const aliases = { Micromanager: 'controller' };
const missingCanonicalStories = bands
  .map(([name]) => ({ name, key: aliases[name] || name }))
  .filter(({ key }) => !storyKeys.has(normalize(key)))
  .map(({ name }) => name);
assert.deepEqual(missingCanonicalStories, [], 'every canonical band must have a story record or explicit alias');

const missing = [];
for (const row of rows) {
  for (const [field, pattern] of [
    ['h', /h:\s*"([\s\S]*?)",\s*\n/],
    ['a', /a:\s*"([\s\S]*?)",\s*\n/],
    ['n', /n:\s*"([\s\S]*?)"\s*\}/]
  ]) {
    const match = row.body.match(pattern);
    if (!match || !match[1].trim()) missing.push(row.key + '.' + field);
  }
  if (!/Reflection:/.test(row.body)) missing.push(row.key + '.reflection_prompt');
}
assert.deepEqual(missing, [], 'every Saboteur needs story (h), coherent availability (a), next move (n), and reflection prompt');

console.log('fetter-saboteur-framework-contract: 33/33 story records contain h/a/n and reflection fields');
