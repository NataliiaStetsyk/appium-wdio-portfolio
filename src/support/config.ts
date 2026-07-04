import dotenv from 'dotenv';

dotenv.config();

const platformName = process.env.PLATFORM_NAME ?? 'Android';
export const isIos = platformName.toLowerCase() === 'ios';

export const env = {
  PLATFORM_NAME: platformName,
  APP_PATH: process.env.APP_PATH ?? (isIos ? './apps/ios/SwagLabs.app' : './apps/android/SwagLabs.apk'),
  DEVICE_NAME: process.env.DEVICE_NAME ?? (isIos ? 'iPhone 15' : 'emulator-5554'),
  PLATFORM_VERSION: process.env.PLATFORM_VERSION ?? (isIos ? '17.5' : '15'),
  AUTOMATION_NAME: process.env.AUTOMATION_NAME ?? (isIos ? 'XCUITest' : 'UiAutomator2'),
  APP_PACKAGE: process.env.APP_PACKAGE ?? 'com.swaglabsmobileapp',
  APP_ACTIVITY: process.env.APP_ACTIVITY ?? '.MainActivity',
  BUNDLE_ID: process.env.BUNDLE_ID ?? '',
  UDID: process.env.UDID ?? '',
  APPIUM_HOST: process.env.APPIUM_HOST ?? '0.0.0.0',
  APPIUM_PORT: process.env.APPIUM_PORT ?? '4723'
} as const;

export const TIMEOUTS = {
  // Generous enough for a cold app launch on a freshly-provisioned Sauce Labs
  // cloud device (slower JS-bundle load than a warm local emulator); this is
  // a polling wait, so it doesn't slow down runs where the element appears sooner.
  displayedMs: 25000
} as const;

export const SAUCE_BUILD_NAME = 'appium-wdio-portfolio';
