import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
  get headerTitle() {
    return $('~test-PRODUCTS');
  }

  async waitForLoaded() {
    await this.waitForDisplayed(this.headerTitle);
  }
}

export default new ProductsPage();
