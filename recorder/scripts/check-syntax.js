'use strict';
// Syntax-checks every .js file under src/, instead of the old npm run check
// which only covered 7 of 40 files (and would have missed a syntax error in
// any of the other 33, control.js included, since that script never updated
// as files were added).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function findJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

const files = findJsFiles(srcDir).sort();
let failed = 0;
for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failed++;
    console.error(`SYNTAX ERROR in ${path.relative(process.cwd(), file)}:`);
    console.error(err.stderr ? err.stderr.toString() : err.message);
  }
}

console.log(`Checked ${files.length} files.`);
if (failed) {
  console.error(`${failed} file(s) failed.`);
  process.exit(1);
}
console.log('All files OK.');
