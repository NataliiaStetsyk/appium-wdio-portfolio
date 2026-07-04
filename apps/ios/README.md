# iOS app binary

This folder is where the iOS Simulator build of the sample app goes. It isn't
committed to git (see [.gitignore](../../.gitignore)) because `.app` bundles
are large and platform-specific — download one to match the Android APKs
already in [apps/android](../android).

1. Go to the [sample-app-mobile releases page](https://github.com/saucelabs/sample-app-mobile/releases).
2. Download the asset named `iOS.Simulator.SauceLabs.Mobile.Sample.app.<version>.zip`
   (not the `RealDevice` one, unless you're targeting a physical device).
3. Unzip it and place the resulting `.app` bundle here as:
   ```
   apps/ios/SwagLabs.app
   ```
4. That path matches the default `APP_PATH` used when `PLATFORM_NAME=iOS`
   (see [.env.example](../../.env.example)).

Targeting a real device instead of the simulator requires the `RealDevice`
`.ipa` build, a signing team/provisioning profile, and the device's `UDID`.
