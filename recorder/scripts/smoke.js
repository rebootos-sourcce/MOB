'use strict';
// Runs the app in headless self-test mode (see src/main/smoke.js).
// On Linux CI wrap with xvfb-run; on Windows/macOS it uses the real display.
const { spawn } = require('child_process');
const path = require('path');
const electron = require('electron'); // resolves to the binary path when required from node
const env = Object.assign({}, process.env, { MOB_SMOKE: '1', ELECTRON_DISABLE_SECURITY_WARNINGS: '1' });
const args = [path.join(__dirname, '..')];
if (process.platform === 'linux') args.push('--no-sandbox', '--disable-gpu');
// Synthetic camera + mic so the overlay and audio paths run on machines without devices.
args.push('--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream');
const child = spawn(electron, args, { stdio: 'inherit', env });
child.on('close', (code) => process.exit(code));
