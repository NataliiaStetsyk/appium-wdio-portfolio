const { spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const result = spawnSync('npx', ['cucumber-js', '--dry-run', 'features/**/*.feature', '--require', 'src/steps/**/*.ts', '--require', 'src/support/hooks.ts', '--require-module', 'ts-node/register/transpile-only'], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: false
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
