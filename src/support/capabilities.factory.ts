import { env } from './config.js';

const androidCapabilities = {
  platformName: 'Android',
  automationName: env.AUTOMATION_NAME,
  platformVersion: env.PLATFORM_VERSION,
  deviceName: env.DEVICE_NAME,
  app: env.APP_PATH,
  appPackage: env.APP_PACKAGE,
  appActivity: env.APP_ACTIVITY,
  noReset: true,
  newCommandTimeout: 240
};

const iOSCapabilities = {
  platformName: 'iOS',
  automationName: 'XCUITest',
  platformVersion: env.PLATFORM_VERSION,
  deviceName: env.DEVICE_NAME,
  app: env.APP_PATH,
  noReset: true,
  newCommandTimeout: 240
};

export const mobileCapabilities = env.PLATFORM_NAME.toLowerCase() === 'ios'
  ? [iOSCapabilities]
  : [androidCapabilities];
