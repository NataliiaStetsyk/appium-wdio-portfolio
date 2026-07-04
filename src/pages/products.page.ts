import { BasePage } from './base.page.js';

class ProductsPage extends BasePage {
  get headerTitle() {
    return $('~test-PRODUCTS');
  }

  async waitForLoaded() {
    await this.waitForDisplayed(this.headerTitle);
  }
}

export default new ProductsPage();
