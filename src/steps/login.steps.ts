import { Given, When, Then } from '@cucumber/cucumber';
import loginPage from '../pages/login.page.js';
import productsPage from '../pages/products.page.js';

Given('the mobile app is open', async () => {
  await loginPage.waitForLoaded();
});

When('the user logs in with username {string} and password {string}', async (username: string, password: string) => {
  await loginPage.login(username, password);
});

Then('the product catalog is displayed', async () => {
  await productsPage.waitForLoaded();
  await expect(productsPage.headerTitle).toBeDisplayed();
});
