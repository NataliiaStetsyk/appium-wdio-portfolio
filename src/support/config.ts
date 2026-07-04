import dotenv from 'dotenv';

dotenv.config();

export const env = {
  APP_PATH: process.env.APP_PATH || './apps/android/SwagLabs.apk',
  PLATFORM_NAME: process.env.PLATFORM_NAME || 'Android',
  DEVICE_NAME: process.env.DEVICE_NAME || 'Android Emulator',
  PLATFORM_VERSION: process.env.PLATFORM_VERSION || '13.0',
  AUTOMATION_NAME: process.env.AUTOMATION_NAME || 'UiAutomator2',
  APP_PACKAGE: process.env.APP_PACKAGE || 'com.swaglabsmobileapp',
  APP_ACTIVITY: process.env.APP_ACTIVITY || '.MainActivity',
  APPIUM_HOST: process.env.APPIUM_HOST || '0.0.0.0',
  APPIUM_PORT: process.env.APPIUM_PORT || '4723'
};
