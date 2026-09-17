const { spawn, execSync } = require('child_process');
const path = require('path'); const electron = require('electron');
const child = spawn('xvfb-run', ['-a','-s','-screen 0 1600x900x24', electron, path.join(__dirname),
  '--no-sandbox','--disable-gpu','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream'],
  { env: process.env, stdio: 'ignore', cwd: __dirname, detached: true });
setTimeout(() => {
  try {
    console.log('IDLE ' + execSync("ps -eo pcpu,rss,comm --no-headers | grep -i '[e]lectron' | awk '{c+=$1;m+=$2;n++} END {printf \"cpu=%.1f%% rss=%.0fMB procs=%d\", c, m/1024, n}'").toString().trim());
  } catch (e) { console.log('measure failed'); }
  try { process.kill(-child.pid, 'SIGKILL'); } catch (_) {}
  process.exit(0);
}, 14000);
