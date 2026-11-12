'use strict';
// Task #68: "no lint config anywhere" — this is a deliberately narrow config.
// The goal is catching real bugs (undefined vars, unreachable code, bad
// equality) in a ~15k-line codebase that was never linted, not retrofitting
// a style guide onto it. Rules that would flag hundreds of pre-existing,
// intentional patterns (empty catch blocks with an explanatory comment,
// unused function params kept for a documented signature) are tuned off
// rather than either silencing the whole file or rewriting working code to
// satisfy a rule it was never written against.

const js = require('@eslint/js');
const globals = require('globals');

const commonRules = {
  ...js.configs.recommended.rules,
  // caughtErrors: 'none' — this codebase's established convention for "I
  // know this failed and am deliberately not acting on it" is a named catch
  // binding (`_`, or sometimes a descriptive `err`/`copyErr`) that's never
  // read. That's the pattern, not an oversight, in dozens of places.
  'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-constant-condition': ['error', { checkLoops: false }],
};

// shapes.js/material.js/waveform.js are loaded via plain <script> tags in
// the renderer (attaching to `window.Shapes` etc.) but are also dual-mode
// UMD/CommonJS-guarded (`if (typeof module !== 'undefined') module.exports
// = ...`) so the same file works from `require()` in main.js and the test
// suite. ESLint parsing a single file has to pick one reality; these globals
// cover both without flagging the guard itself as undefined.
const rendererGlobals = {
  Shapes: 'readonly',
  Material: 'readonly',
  Pcm: 'readonly',
  module: 'readonly',
  require: 'readonly',
};

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },
  // Main process, scripts, tests, preload: CommonJS/Node.
  {
    files: ['src/main/**/*.js', 'src/preload/**/*.js', 'scripts/**/*.js', 'test/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022,
      globals: { ...globals.node },
    },
    rules: commonRules,
  },
  // Renderer: plain <script> tags (no bundler, no `require` at runtime),
  // browser globals, plus the dual-mode UMD globals above.
  {
    files: ['src/renderer/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...rendererGlobals },
    },
    rules: commonRules,
  },
  // control.js is the one file that consumes WaveformRenderer, which
  // waveform.js's own file in this same directory declares — scoped here
  // rather than added to rendererGlobals above to avoid a no-redeclare
  // collision in waveform.js itself.
  {
    files: ['src/renderer/control/control.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2022,
      globals: { WaveformRenderer: 'readonly' },
    },
  },
  // Shared UMD modules: dual CommonJS + browser (see shapes.js/material.js's
  // own UMD wrapper) — loaded via <script> in the renderer AND required()
  // from main.js and the test suite.
  {
    files: ['src/shared/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 2022,
      globals: { ...globals.node, ...globals.browser },
    },
    rules: commonRules,
  },
];
