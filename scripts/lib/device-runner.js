const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');

require('dotenv').config();

const projectRoot = resolve(__dirname, '..', '..');

function isPortOpen(port) {
  return new Promise((resolvePortCheck) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    socket.once('connect', () => {
      socket.destroy();
      resolvePortCheck(true);
    });
    socket.once('error', () => resolvePortCheck(false));
    socket.setTimeout(1000, () => {
      socket.destroy();
      resolvePortCheck(false);
    });
  });
}

function run(command, args) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: false,
      env: process.env
    });

    child.once('exit', (code) => resolveRun(code ?? 1));
  });
}

function startAppium({ address, port, extraArgs }) {
  return new Promise((resolveStart, rejectStart) => {
    const child = spawn('npx', [
      'appium',
      '--base-path',
      '/',
      '--address',
      address,
      '--port',
      String(port),
      '--relaxed-security',
      ...extraArgs
    ], {
      cwd: projectRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      env: process.env
    });

    const timeout = setTimeout(() => {
      child.kill();
      rejectStart(new Error('Timed out waiting for Appium to start.'));
    }, 30000);

    const onData = (data) => {
      const text = data.toString();
      process.stdout.write(text);
      if (text.includes('Appium REST http interface listener started')) {
        clearTimeout(timeout);
        resolveStart(child);
      }
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.once('exit', (code) => {
      clearTimeout(timeout);
      rejectStart(new Error(`Appium exited before startup completed with code ${code ?? 1}.`));
    });
  });
}

/**
 * Runs a WebdriverIO/Cucumber suite against a real device/simulator when
 * prerequisites are met, otherwise falls back to dry-run validation.
 *
 * Translates the platform-namespaced `${envPrefix}_*` .env vars (e.g.
 * ANDROID_DEVICE_NAME, IOS_DEVICE_NAME) into the generic vars config.ts reads,
 * and forces PLATFORM_NAME, so this always targets `platformName` regardless
 * of what another script last left in process.env.
 */
async function runDeviceSession({
  platformName,
  envPrefix,
  appiumExtraArgs = [],
  hasPlatformSdk,
  missingSdkMessage
}) {
  process.env.PLATFORM_NAME = platformName;
  for (const key of ['APP_PATH', 'DEVICE_NAME', 'PLATFORM_VERSION', 'AUTOMATION_NAME']) {
    const namespacedValue = process.env[`${envPrefix}_${key}`];
    if (namespacedValue) {
      process.env[key] = namespacedValue;
    }
  }

  require('ts-node/register/transpile-only');
  const { env } = require('../../src/support/config');

  const appPath = resolve(projectRoot, env.APP_PATH);
  const hasAppBinary = existsSync(appPath);
  const hasSauceCredentials = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);
  // Deliberately not inferred from ANDROID_HOME/UDID: hosted CI runners can
  // preinstall SDK tooling without an actual emulator/simulator running, so
  // only an explicit opt-in should force a real-device attempt.
  const forceRealDevice = process.env.WDIO_FORCE_REAL_DEVICE === 'true';
  const canRunDeviceSession = hasSauceCredentials || forceRealDevice || (hasAppBinary && hasPlatformSdk);
  const appiumPort = Number(env.APPIUM_PORT);
  const appiumAddress = env.APPIUM_HOST;

  if (!canRunDeviceSession) {
    console.log('Device prerequisites were not found, so running framework validation instead.');
    if (!hasAppBinary) {
      console.log(`Missing app binary: ${appPath}`);
    }
    if (!hasPlatformSdk) {
      console.log(missingSdkMessage);
    }
    process.exit(await run('node', ['scripts/ci-validate.js']));
  }

  let appiumProcess;
  if (!hasSauceCredentials && !(await isPortOpen(appiumPort))) {
    console.log(`Starting Appium on ${appiumAddress}:${appiumPort}...`);
    appiumProcess = await startAppium({ address: appiumAddress, port: appiumPort, extraArgs: appiumExtraArgs });
  }

  const exitCode = await run('npx', ['wdio', 'run', 'wdio.conf.cjs', '--spec', './features/**/*.feature']);
  if (appiumProcess) {
    appiumProcess.kill();
  }
  process.exit(exitCode);
}

module.exports = { runDeviceSession };
