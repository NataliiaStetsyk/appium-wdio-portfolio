import { World as CucumberWorld } from '@cucumber/cucumber';
import loginPage from '../pages/login.page';
import productsPage from '../pages/products.page';

export class CustomWorld extends CucumberWorld {
  public readonly pages = {
    login: loginPage,
    products: productsPage
  };

  async captureFailureArtifacts() {
    const screenshot = await browser.takeScreenshot();
    await this.attach(screenshot, 'image/png');
  }
}
