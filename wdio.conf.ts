import { defineConfig } from 'webdriverio';
import { mobileCapabilities } from './src/support/capabilities.factory.js';
import { env } from './src/support/config.js';

export default defineConfig({
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: mobileCapabilities,
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    ['appium', {
      args: {
        address: env.APPIUM_HOST,
        port: Number(env.APPIUM_PORT),
        relaxedSecurity: true,
        allowInsecure: 'chromedriver_autodownload'
      }
    }]
  ],
  framework: 'cucumber',
  reporters: ['spec'],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json'
    }
  },
  cucumberOpts: {
    require: ['./src/steps/**/*.ts', './src/support/hooks.ts'],
    backtrace: false,
    requireModule: ['ts-node/register'],
    dryRun: false,
    failFast: false,
    format: ['pretty'],
    colors: true,
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: '',
    timeout: 600000,
    ignoreUndefinedDefinitions: false
  }
});
