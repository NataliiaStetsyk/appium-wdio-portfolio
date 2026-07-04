require('ts-node/register/transpile-only');

const { mobileCapabilities, isDryRun } = require('./src/support/capabilities.factory');
const { env, TIMEOUTS } = require('./src/support/config');

const useSauceLabs = Boolean(process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);
const sauceRegion = process.env.SAUCE_REGION || 'us-west-1';
// 0.0.0.0 is a bind-all address for the Appium server, not something a client can connect to.
const localAppiumHost = env.APPIUM_HOST === '0.0.0.0' ? '127.0.0.1' : env.APPIUM_HOST;

if (isDryRun) {
  console.log('No real target available: skipping device execution and running validation only.');
}

exports.config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: mobileCapabilities,
  hostname: useSauceLabs ? `ondemand.${sauceRegion}.saucelabs.com` : localAppiumHost,
  port: useSauceLabs ? 443 : Number(env.APPIUM_PORT),
  protocol: useSauceLabs ? 'https' : 'http',
  path: useSauceLabs ? '/wd/hub' : '/',
  user: useSauceLabs ? process.env.SAUCE_USERNAME : undefined,
  key: useSauceLabs ? process.env.SAUCE_ACCESS_KEY : undefined,
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: TIMEOUTS.displayedMs,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [],
  framework: 'cucumber',
  reporters: [
    ['spec', { addErrorTrace: true }],
    [
      'allure',
      {
        outputDir: './reports/allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true
      }
    ]
  ],
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
    requireModule: ['ts-node/register/transpile-only'],
    dryRun: isDryRun,
    failFast: false,
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: '',
    timeout: 600000,
    ignoreUndefinedDefinitions: false
  }
};
