import { Given, Then, When } from '@cucumber/cucumber';
import { isDryRun } from '../support/capabilities.factory';
import { getUser, type TestUserKey } from '../data/users';
import type { CustomWorld } from '../support/world';

Given('the mobile app is open', async function (this: CustomWorld) {
  if (isDryRun) {
    return;
  }
  await this.pages.login.waitForLoaded();
});

When('the user logs in as {string}', async function (this: CustomWorld, userKey: TestUserKey) {
  if (isDryRun) {
    return;
  }
  const user = getUser(userKey);
  await this.pages.login.login(user.username, user.password);
});

Then('the product catalog is displayed', async function (this: CustomWorld) {
  if (isDryRun) {
    return;
  }
  await this.pages.products.waitForLoaded();
  await expect(this.pages.products.headerTitle).toBeDisplayed();
});
