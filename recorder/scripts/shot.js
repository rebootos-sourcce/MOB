'use strict';
// Captures PNGs of the app's windows for layout review (see src/main/shot.js).
const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron');
const env = Object.assign({}, process.env, { MOB_SHOT: '1', ELECTRON_DISABLE_SECURITY_WARNINGS: '1' });
const args = [path.join(__dirname, '..')];
if (process.platform === 'linux') args.push('--no-sandbox', '--disable-gpu');
args.push('--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream');
const child = spawn(electron, args, { stdio: 'inherit', env });
child.on('close', (code) => process.exit(code));
