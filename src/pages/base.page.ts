import type { ChainablePromiseElement } from 'webdriverio';
import { TIMEOUTS } from '../support/config';

export abstract class BasePage {
  protected async waitForDisplayed(element: ChainablePromiseElement, timeout = TIMEOUTS.displayedMs) {
    await element.waitForDisplayed({ timeout });
    return element;
  }

  protected async tap(element: ChainablePromiseElement, timeout = TIMEOUTS.displayedMs) {
    const target = await this.waitForDisplayed(element, timeout);
    await target.click();
  }

  protected async typeText(element: ChainablePromiseElement, text: string, timeout = TIMEOUTS.displayedMs) {
    const target = await this.waitForDisplayed(element, timeout);
    await target.clearValue();
    await target.setValue(text);
  }
}
