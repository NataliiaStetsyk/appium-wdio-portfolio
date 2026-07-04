import { After, Before } from '@cucumber/cucumber';

Before(async () => {
  await browser.setTimeout({ implicit: 10000, pageLoad: 10000, script: 30000 });
});

After(async function () {
  if (this.result?.status === 'FAILED') {
    await browser.takeScreenshot();
  }
});
