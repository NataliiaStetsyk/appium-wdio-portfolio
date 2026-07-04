import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  get usernameInput() {
    return $('~test-Username');
  }

  get passwordInput() {
    return $('~test-Password');
  }

  get loginButton() {
    return $('~test-LOGIN');
  }

  async waitForLoaded() {
    await this.waitForDisplayed(this.usernameInput);
    await this.waitForDisplayed(this.passwordInput);
  }

  async login(username: string, password: string) {
    await this.typeText(this.usernameInput, username);
    await this.typeText(this.passwordInput, password);
    await this.tap(this.loginButton);
  }
}

export default new LoginPage();
