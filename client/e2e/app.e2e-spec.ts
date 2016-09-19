import { QuickDisplayPage } from './app.po';

describe('quick-display App', function() {
  let page: QuickDisplayPage;

  beforeEach(() => {
    page = new QuickDisplayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
