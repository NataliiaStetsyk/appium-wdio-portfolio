const { runDeviceSession } = require('./lib/device-runner');

const hasAndroidSdk = Boolean(process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT);

runDeviceSession({
  platformName: 'Android',
  envPrefix: 'ANDROID',
  appiumExtraArgs: ['--allow-insecure', 'chromedriver_autodownload'],
  hasPlatformSdk: hasAndroidSdk,
  missingSdkMessage: 'Missing Android SDK: set ANDROID_HOME or ANDROID_SDK_ROOT for a real Appium run.',
  forceRealDeviceEnvVar: 'ANDROID_HOME'
}).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
