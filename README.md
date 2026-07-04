# Appium WebdriverIO Portfolio

A cross-platform mobile automation framework built with Appium, WebdriverIO, Cucumber, and TypeScript. It drives the same Gherkin scenarios against a local Android emulator, a local iOS Simulator, or Sauce Labs' cloud devices, without touching test code.

## Architecture

- **Factory** — [src/support/capabilities.factory.ts](src/support/capabilities.factory.ts) builds the right WebDriver capabilities for the active platform (Android/iOS) and target (local device vs Sauce Labs), and exposes `isDryRun` as the single source of truth for "is there a real target to drive".
- **Centralized configuration** — [src/support/config.ts](src/support/config.ts) resolves all environment-driven settings and shared constants (`env`, `TIMEOUTS`, `SAUCE_BUILD_NAME`) in one place; every other module reads from it instead of re-deriving defaults.
- **Template method** — [src/pages/base.page.ts](src/pages/base.page.ts) gives every page object resilient, pre-waited `tap`/`typeText`/`waitForDisplayed` primitives.
- **Page Object Model** — screen-specific classes live in [src/pages](src/pages).
- **World/context pattern** — [src/support/world.ts](src/support/world.ts) provides scenario-level state (page object instances, failure-screenshot capture) to step definitions.
- **Data-driven steps** — [src/data/users.ts](src/data/users.ts) is the single source of test user data; scenarios reference a named user (`"standardUser"`) rather than embedding credentials as literals.
- **Shared device runner** — [scripts/lib/device-runner.js](scripts/lib/device-runner.js) contains the one implementation of "start Appium if needed, run the suite, fall back to validation if prerequisites are missing"; `scripts/run-android.js` and `scripts/run-ios.js` are thin platform config wrappers around it.

## Folder structure

- [features](features) — Gherkin feature files
- [src/pages](src/pages) — Page objects for app screens
- [src/steps](src/steps) — Cucumber step definitions
- [src/support](src/support) — framework config, capability factory, hooks, world
- [src/data](src/data) — test user data
- [scripts](scripts) — device runners and CI validation entry points
- [apps/android](apps/android), [apps/ios](apps/ios) — app binaries used by `ANDROID_APP_PATH` / `IOS_APP_PATH`
- [reports](reports) — execution output and artifacts

## Getting started

1. Copy [.env.example](.env.example) to `.env`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the fast validation suite (no device required — checks the feature file, step definitions, and TypeScript all wire up correctly):
   ```bash
   npm test
   ```

## Running on Android

Requires an Android emulator/device and `ANDROID_HOME`/`ANDROID_SDK_ROOT` set:

```bash
npm run test:android
```

If those prerequisites aren't available, it falls back to validation mode and tells you what's missing.

### Headed mode

Start an Android emulator from Android Studio's Device Manager so the window is visible, then:

```bash
npm run test:headed
```

It pauses at the start and end of the scenario so you can watch the app. To make the pauses longer:

```bash
WDIO_HEADED_PAUSE_MS=10000 npm run test:headed
```

## Running on iOS

1. Install full Xcode from the App Store (the Command Line Tools alone are
   not enough — they don't include the iOS Simulator or `simctl`), then run:
   ```bash
   sudo xcode-select -s /Applications/Xcode.app
   xcodebuild -runFirstLaunch
   ```
2. Install the XCUITest Appium driver:
   ```bash
   npx appium driver install xcuitest
   ```
3. Download the iOS Simulator build of the sample app and place it at
   `apps/ios/SwagLabs.app` — see [apps/ios/README.md](apps/ios/README.md) for
   the exact download link.
4. Check the `IOS_*` values in your `.env` (see [.env.example](.env.example)),
   at minimum `IOS_DEVICE_NAME` and `IOS_PLATFORM_VERSION` — they must match a
   simulator you actually have installed. Run
   `xcrun simctl list devices available` to see your options.
5. Run:
   ```bash
   npm run test:ios
   ```

## Running both platforms

`.env` keeps Android and iOS settings in separate `ANDROID_*`/`IOS_*` blocks,
so both can be configured at once — nothing needs to be edited between runs.
Run them one after another (Cucumber/WebdriverIO drives a single `browser`
session at a time, so this is sequential, not simultaneous):

```bash
npm run test:android
npm run test:ios
```

## Running on Sauce Labs

```bash
npm run test:sauce
```

Set `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` (and optionally `SAUCE_REGION`,
default `us-west-1`) in `.env` first. The Android capability expects the app
already uploaded to Sauce's App Storage as `SauceLabs.apk`:

```bash
curl -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" \
  -X POST "https://api.${SAUCE_REGION:-us-west-1}.saucelabs.com/v1/storage/upload" \
  -F "payload=@apps/android/SwagLabs.apk" \
  -F "name=SauceLabs.apk"
```

Without credentials configured, `test:sauce` automatically falls back to
validation mode instead of failing.

## Test reports

Every run (local device, Sauce Labs, or CI) writes
[Allure](https://allurereport.org/) results to `reports/allure-results` —
configured in [wdio.conf.cjs](wdio.conf.cjs) with `useCucumberStepReporter`,
so the report shows your Given/When/Then steps directly rather than raw
WebDriver commands, with a screenshot automatically attached to any failed
scenario (see `captureFailureArtifacts` in [world.ts](src/support/world.ts)).

Generating and viewing the HTML report requires a local Java runtime (used by
the bundled `allure-commandline`):

```bash
npm run report          # generate + open in one step
npm run report:generate  # just generate reports/allure-report
npm run report:open      # just open the last generated report
```

## Continuous Integration

[.github/workflows/ci.yml](.github/workflows/ci.yml) runs on every push to
`main` and every pull request:

1. `npm run test:ci` — fast feature/step/TypeScript validation, no device or credentials needed.
2. Uploads `apps/android/SwagLabs.apk` to Sauce Labs App Storage (only if Sauce secrets are configured).
3. `npm run test:sauce` — runs the real login flow against a Sauce Labs Android device, or falls back to validation if secrets aren't set (e.g. on a fork's pull request).
4. Generates the Allure report and uploads it as a workflow artifact (even if the run failed), viewable from the Actions run summary.

To enable the real Sauce Labs run, add these as repository secrets
(Settings → Secrets and variables → Actions):

| Secret             | Required | Notes                                       |
| ------------------ | -------- | ------------------------------------------- |
| `SAUCE_USERNAME`   | yes      | Sauce Labs account username                 |
| `SAUCE_ACCESS_KEY` | yes      | Sauce Labs account access key               |
| `SAUCE_REGION`     | no       | Data center region, defaults to `us-west-1` |

A free [Sauce Labs trial account](https://saucelabs.com/sign-up) provides
working demo credentials.

## Recommended setup

- Android emulator or real device running a compatible API level, or an iOS
  Simulator / real device running a compatible iOS version (see
  [Running on iOS](#running-on-ios)).
- Appium installed locally and reachable by the service configuration.
- A compatible app binary available via `ANDROID_APP_PATH` / `IOS_APP_PATH`.
