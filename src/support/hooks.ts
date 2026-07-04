import { After, Before, Status, setWorldConstructor } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { runFallbackFlow } from './fallback';
import { isDryRun } from './capabilities.factory';
import { TIMEOUTS } from './config';

setWorldConstructor(CustomWorld);

const headedMode = process.env.WDIO_HEADED === 'true';
const headedPauseMs = Number(process.env.WDIO_HEADED_PAUSE_MS ?? 5000);

Before(async function (this: CustomWorld) {
  if (isDryRun) {
    await runFallbackFlow();
    return;
  }
  await browser.setTimeout({ implicit: TIMEOUTS.displayedMs });
  if (headedMode) {
    console.log(
      `Headed mode: app is open on the connected Android device. Pausing ${headedPauseMs}ms so you can see it.`
    );
    await browser.pause(headedPauseMs);
  }
});

After(async function (this: CustomWorld, scenario) {
  if (isDryRun) {
    return;
  }
  if (scenario.result?.status === Status.FAILED) {
    await this.captureFailureArtifacts();
  }
  if (headedMode) {
    console.log(`Headed mode: leaving final app screen visible for ${headedPauseMs}ms.`);
    await browser.pause(headedPauseMs);
  }
});
