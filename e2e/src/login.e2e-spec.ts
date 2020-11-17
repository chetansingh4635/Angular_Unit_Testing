import {LoginPage} from './login.po';
import {browser, protractor} from 'protractor';

describe('workspace-project App', () => {
  let page: LoginPage;
  browser.waitForAngularEnabled(false);

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should display login header text', () => {
    page.navigateTo();
    expect(page.getLoginHeaderText()).toEqual('Login to the Jackson and Coker Time & Expense Tool');
  });

  it('should authorized', () => {
    page.navigateTo();
    page.fillLoginField('provider@test.com');
    page.fillPasswordField('qweQWE123*');
    page.pressLoginButton();
    browser.wait(protractor.ExpectedConditions.urlContains('provider'), 2000);
  });
});
