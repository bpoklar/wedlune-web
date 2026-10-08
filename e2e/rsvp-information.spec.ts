import { expect,test } from '@playwright/test';
const information={version:1,weddingDate:'2027-03-28',ceremonyTime:'02:30',ceremonyAddress:'Bled',parking:'<script>alert("unsafe")</script>',travelLink:'https://example.com/travel',faq:[{question:'Children?',answer:'Welcome!'}]};
test('Free information is readable before and after RSVP without interpreting authored HTML',async ({page},testInfo) => {
  await page.route('**/functions/v1/**',async route => {
    expect(new URL(route.request().url()).pathname).toBe('/functions/v1/handle-guest-rsvp');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(route.request().method()==='POST'?{}:{name:'Alex',rsvpStatus:'pending',isCouple:false,coupleName:'Nina & Luka',menus:[],plusOnes:[],wishlist:null,rsvpDesign:null,weddingInformation:information})});
  });
  await page.goto('/rsvp?token=information-test');
  const panel=page.locator('#wedding-information');
  await expect(page.getByRole('region',{name:'Wedding information',exact:true})).toBeVisible();
  await expect(panel).toContainText('02:30');
  await expect(panel).toContainText(information.parking);
  await expect(panel.locator('script')).toHaveCount(0);
  expect(await panel.evaluate(element => !!(element.compareDocumentPosition(document.querySelector('#rsvp-submit')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBeTruthy();
  await expect(panel.getByRole('link')).toHaveAttribute('rel','noopener noreferrer');
  await panel.getByText('Children?',{exact:true}).click();
  await expect(panel.getByText('Welcome!',{exact:true})).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('information-before.png'),fullPage:true});
  await page.locator('label:has(#rsvp-accept)').click();
  await page.locator('#rsvp-submit').click();
  await expect(page.locator('#rsvp-confirmation')).toBeVisible();
  await expect(panel).toContainText('Bled');
  await page.screenshot({path:testInfo.outputPath('information-after.png'),fullPage:true});
});
for(const [locale,title] of [['sl','Informacije o poroki'],['it','Informazioni sul matrimonio']]) {
 test(`information labels are localized in ${locale}`,async ({page}) => {
   await page.route('**/functions/v1/**',route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({name:'Alex',rsvpStatus:'pending',isCouple:false,coupleName:'Nina & Luka',menus:[],plusOnes:[],weddingInformation:information})}));
   await page.goto(`/${locale}/rsvp?token=information-test`);
   await expect(page.getByRole('region',{name:title,exact:true})).toBeVisible();
   await expect(page.locator('#wedding-information').getByRole('heading',{name:title})).toBeVisible();
 });
}
