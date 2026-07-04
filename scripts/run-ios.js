const { execFileSync } = require('node:child_process');
const { runDeviceSession } = require('./lib/device-runner');

function hasIosSimulatorToolchain() {
  if (process.platform !== 'darwin') {
    return false;
  }
  try {
    execFileSync('xcrun', ['simctl', 'help'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasIosSdk = hasIosSimulatorToolchain();

runDeviceSession({
  platformName: 'iOS',
  envPrefix: 'IOS',
  hasPlatformSdk: hasIosSdk,
  missingSdkMessage: process.platform !== 'darwin'
    ? 'iOS Simulator automation requires macOS.'
    : 'Missing iOS Simulator toolchain: install full Xcode from the App Store (Command Line Tools alone are not enough) and run "xcodebuild -runFirstLaunch".',
  forceRealDeviceEnvVar: 'UDID'
}).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
