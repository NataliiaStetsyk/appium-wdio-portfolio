import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { env, isIos } from './config';

const resolvedAppPath = resolve(env.APP_PATH);
const hasAppBinary = existsSync(resolvedAppPath);
const hasAndroidSdk = Boolean(process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT);

function hasIosSimulatorToolchain(): boolean {
  if (process.platform !== 'darwin') {
    return false;
  }
  try {
    execFileSync('xcrun', ['simctl', 'help'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasIosSdk = hasIosSimulatorToolchain();
const hasPlatformSdk = isIos ? hasIosSdk : hasAndroidSdk;
const forcedFallback = process.env.WDIO_FALLBACK_MODE === 'true' || process.env.CI === 'true';
const forcedRealDevice =
  process.env.WDIO_FORCE_REAL_DEVICE === 'true' ||
  (isIos ? Boolean(process.env.UDID) : Boolean(process.env.ANDROID_HOME));

export const isFallbackMode = !forcedRealDevice && (forcedFallback || !hasAppBinary || !hasPlatformSdk);

export async function runFallbackFlow() {
  if (!hasAppBinary) {
    console.log(`Fallback mode: app binary not found at ${resolvedAppPath}.`);
    return;
  }

  if (!hasPlatformSdk) {
    console.log(
      isIos
        ? 'Fallback mode: full Xcode (with the iOS Simulator and simctl) is not available on this machine. The Xcode Command Line Tools alone are not enough.'
        : 'Fallback mode: Android SDK tooling is not available on this machine.'
    );
    return;
  }

  console.log('Fallback mode: using validation mode because a real device session is unavailable.');
}
