export abstract class BasePage {
  protected async waitForDisplayed(element: WebdriverIO.Element) {
    await element.waitForDisplayed({ timeout: 10000 });
  }

  protected async tap(element: WebdriverIO.Element) {
    await this.waitForDisplayed(element);
    await element.click();
  }

  protected async typeText(element: WebdriverIO.Element, text: string) {
    await this.waitForDisplayed(element);
    await element.setValue(text);
  }
}
