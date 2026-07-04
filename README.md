# Appium WebdriverIO Portfolio

A sample mobile automation repository built with Appium, WebdriverIO, Cucumber, and TypeScript.
This repository is intended as a portfolio example that demonstrates a maintainable mobile test framework with:

- Appium service launch and device capability factory
- Cucumber BDD-style feature files and step definitions
- Page Object Model with a shared `BasePage`
- Environment-driven configuration and hooks
- TypeScript support through `ts-node`

## Architecture highlights

- **GoF patterns** applied:
  - Factory: `src/support/capabilities.factory.ts` builds platform capabilities.
  - Singleton: `src/support/config.ts` centralizes environment configuration.
  - Template / Base class: `src/pages/base.page.ts` defines shared page actions.
  - Page Object Model: page-specific classes encapsulate selectors and flows.

## Getting started

1. Copy `.env.example` to `.env` and update mobile app path and device settings.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the example feature:
   ```bash
   npm test
   ```

## Recommended setup

- Android emulator running a compatible API level.
- Appium installed locally and accessible through the Appium service.
- A copy of the app under test available via `APP_PATH`.

## Folder structure

- `features/` - Gherkin feature definitions
- `src/pages/` - Page objects for app screens
- `src/steps/` - Cucumber step definitions
- `src/support/` - framework helpers, hooks, and capability factory
- `reports/` - test results and artifacts

## Example command

```bash
npm test
```
