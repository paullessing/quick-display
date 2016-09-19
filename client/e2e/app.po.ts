import { browser, element, by } from 'protractor/globals';

export class QuickDisplayPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('quick-display h1')).getText();
  }
}
