import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import en from '../i18n/locales/en.json' with { type: 'json' };
import sl from '../i18n/locales/sl.json' with { type: 'json' };

async function hydrated(page: Page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as HTMLElement & { __vue_app__?: { config?: { globalProperties?: { $nuxt?: { isHydrating?: boolean } } } } };
    return root.__vue_app__?.config?.globalProperties?.$nuxt?.isHydrating === false;
  });
}

for (const [locale, catalog] of [['en', en], ['sl', sl]] as const) {
  const route = locale === 'en' ? '/feedback' : '/sl/feedback';
  const copy = catalog.feedback;
  test(`${locale}: feedback navigation, validation, accessible controls and successful submission`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const submissions: unknown[] = [];
    let release: () => void = () => {};
    const pending = new Promise<void>((resolve) => { release = resolve; });
    await page.route('**/functions/v1/submit-feedback', async (request) => {
      submissions.push(request.request().postDataJSON());
      await pending;
      await request.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    await page.goto(locale === 'en' ? '/privacy' : '/sl/privacy');
    await hydrated(page);
    await page.locator('[data-footer-support]').getByRole('link', { name: catalog.footer.feedback }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page).toHaveTitle(copy.seoTitle);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://wedlune.com${route}`);
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.locator('#feedback-message-error')).toHaveText(copy.validation.messageRequired);
    await expect(page.locator('#feedback-message')).toBeFocused();
    expect(submissions).toEqual([]);
    await page.locator('#feedback-message').fill('too short');
    await page.locator('#feedback-email').fill('not-an-email');
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.locator('#feedback-message-error')).toHaveText(copy.validation.messageShort);
    await expect(page.locator('#feedback-email-error')).toHaveText(copy.validation.email);
    await page.getByRole('radio', { name: copy.categories.bug, exact: true }).check();
    await page.locator('#feedback-message').fill('  This is feedback from the website.  ');
    await page.locator('#feedback-email').fill(' reply@example.com ');
    const fourthStar = page.getByRole('button', { name: copy.ratingStar.replace('{count}', '4') });
    await fourthStar.focus();
    await page.keyboard.press('Enter');
    await expect(fourthStar).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(fourthStar).toHaveAttribute('aria-pressed', 'false');
    await fourthStar.click();
    await page.getByRole('button', { name: copy.clearRating }).click();
    await expect(fourthStar).toHaveAttribute('aria-pressed', 'false');
    await fourthStar.click();
    await expect(page.locator('#feedback-message')).toHaveAttribute('maxlength', '2000');
    await expect(page.locator('#feedback-website')).toHaveAttribute('tabindex', '-1');
    const audit = await new AxeBuilder({ page }).exclude('nuxt-error-overlay').analyze();
    expect(audit.violations).toEqual([]);
    await page.locator('#feedback-message').focus();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: testInfo.outputPath(`feedback-${locale}-form.png`), fullPage: true });
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.getByRole('button', { name: copy.submitting, exact: true })).toBeDisabled();
    await page.locator('form').dispatchEvent('submit');
    await expect.poll(() => submissions.length).toBe(1);
    release();
    await expect(page.getByRole('heading', { name: copy.successTitle })).toBeFocused();
    expect(submissions).toEqual([{ category: 'bug', message: 'This is feedback from the website.', rating: 4, email: 'reply@example.com', website: '' }]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: testInfo.outputPath(`feedback-${locale}-success.png`), fullPage: true });
    await page.getByRole('button', { name: copy.sendAnother }).click();
    await expect(page.locator('#feedback-message')).toHaveValue('');
    await expect(page.locator('#feedback-email')).toHaveValue('');
    await expect(page.getByRole('radio', { name: copy.categories.general, exact: true })).toBeChecked();
  });

  test(`${locale}: offline and server failures retain input for manual retry`, async ({ page, context }) => {
    let calls = 0;
    await page.route('**/functions/v1/submit-feedback', async (request) => {
      calls++;
      const status = calls === 1 ? 429 : calls === 2 ? 503 : 201;
      await request.fulfill({ status, contentType: 'application/json', body: JSON.stringify(status === 201 ? { success: true } : { code: status === 429 ? 'rate_limited' : 'feedback_unavailable' }) });
    });
    await page.goto(route);
    await hydrated(page);
    await page.locator('#feedback-message').fill('Please keep my feedback when offline.');
    await context.setOffline(true);
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(copy.errors.offline);
    expect(calls).toBe(0);
    await context.setOffline(false);
    await expect(page.locator('#feedback-message')).toHaveValue('Please keep my feedback when offline.');
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(copy.errors.rateLimited);
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(copy.errors.unavailable);
    await expect(page.locator('#feedback-message')).toHaveValue('Please keep my feedback when offline.');
    await page.getByRole('button', { name: copy.submit, exact: true }).click();
    await expect(page.getByRole('heading', { name: copy.successTitle })).toBeVisible();
    expect(calls).toBe(3);
  });
}
