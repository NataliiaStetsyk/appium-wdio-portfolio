import { resolve } from 'node:path';
import { env, isIos, SAUCE_BUILD_NAME } from './config';
import { isFallbackMode } from './fallback';

const sauceOptions = {
  build: SAUCE_BUILD_NAME,
  name: 'login-flow',
  appiumVersion: '2.0.0',
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY
};

const sauceLabsAndroidCapabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:platformVersion': '13',
  'appium:deviceName': 'Android GoogleAPI Emulator',
  'appium:app': 'storage:filename=SauceLabs.apk',
  // Without an explicit target activity, Appium infers the launcher activity
  // (the splash screen) and polls to confirm it's focused - but this app
  // transitions to MainActivity almost immediately, so that poll never
  // succeeds and retries until Sauce's infra kills the stuck session.
  'appium:appPackage': env.APP_PACKAGE,
  'appium:appActivity': env.APP_ACTIVITY,
  'sauce:options': sauceOptions
};

const sauceLabsIosCapabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:platformVersion': '17',
  'appium:deviceName': 'iPhone 15 Simulator',
  // Simulator .app bundles are uploaded to Sauce Storage as a zip (Sauce
  // unzips and installs it); real-device .ipa builds would use a bare
  // "storage:filename=....ipa" reference instead.
  'appium:app': 'storage:filename=SauceLabs.app.zip',
  'sauce:options': sauceOptions
};

const localAndroidCapabilities = {
  platformName: env.PLATFORM_NAME,
  'appium:automationName': env.AUTOMATION_NAME,
  'appium:platformVersion': env.PLATFORM_VERSION,
  'appium:deviceName': env.DEVICE_NAME,
  'appium:app': resolve(env.APP_PATH),
  'appium:appPackage': env.APP_PACKAGE,
  'appium:appActivity': env.APP_ACTIVITY,
  'appium:noReset': false
};

const localIosCapabilities = {
  platformName: env.PLATFORM_NAME,
  'appium:automationName': env.AUTOMATION_NAME,
  'appium:platformVersion': env.PLATFORM_VERSION,
  'appium:deviceName': env.DEVICE_NAME,
  'appium:app': resolve(env.APP_PATH),
  'appium:noReset': false,
  ...(env.BUNDLE_ID ? { 'appium:bundleId': env.BUNDLE_ID } : {}),
  ...(env.UDID ? { 'appium:udid': env.UDID } : {})
};

const useSauceLabs = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);

export const mobileCapabilities = useSauceLabs
  ? [isIos ? sauceLabsIosCapabilities : sauceLabsAndroidCapabilities]
  : isFallbackMode
    ? []
    : [isIos ? localIosCapabilities : localAndroidCapabilities];

// The single source of truth for "is there a real target to drive": true
// whenever mobileCapabilities is empty, which only happens when Sauce Labs
// isn't configured AND no local device/simulator is available either.
export const isDryRun = mobileCapabilities.length === 0;
