import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getLoginHeaderText() {
    return element(by.className('login-heading')).getText();
  }

  fillLoginField(value: string) {
    element(by.id('username')).sendKeys(value);
  }

  fillPasswordField(value: string) {
    element(by.id('password')).sendKeys(value);
  }

  pressLoginButton() {
    element(by.className('login-button')).click();
  }
}
