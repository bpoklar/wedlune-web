import { expect, test, type Page } from '@playwright/test';
import it from '../i18n/locales/it.json' with { type: 'json' };

async function hydrated(page: Page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as any;
    return root?.__vue_app__?.config?.globalProperties?.$nuxt?.isHydrating === false;
  });
}

test('Italian homepage exposes localized metadata and shared English screenshots', async ({ page }, info) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('/it');
  await hydrated(page);
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://wedlune.com/it');
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'it_IT');
  expect(await page.locator('meta[property="og:locale:alternate"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('content')).sort())).toEqual(['en_US', 'sl_SI']);
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute('content', /\/og\/home-en-v2.png$/);
  await expect(page.locator('link[hreflang="it"]')).toHaveAttribute('href', 'https://wedlune.com/it');
  expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toEqual(expect.arrayContaining([expect.stringContaining('"inLanguage":"it"')]));
  const screen = page.locator('img[src^="/img/app-screens/real/"]').first();
  await expect(screen).toBeVisible();
  await expect.poll(() => screen.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const id of ['features', 'pricing', 'faq']) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveCSS('opacity', '1');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path: info.outputPath(`italian-${id}.png`)});
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({path: info.outputPath('italian-home.png'), fullPage: true});
});

test('all three languages use the same English homepage images', async ({ page }) => {
  let englishImages: string[] = [];
  for (const path of ['/', '/sl', '/it']) {
    await page.goto(path);
    await hydrated(page);
    const sources = await page.locator('img[src*="/img/app-screens/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')!).sort());
    expect(sources.length).toBeGreaterThan(0);
    if (path === '/') englishImages = sources;
    else expect(sources).toEqual(englishImages);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og\/home-en-v2.png$/);
  }
});

test('language switching preserves query and preview fragment', async ({ page }) => {
  await page.goto('/rsvp?token=private-italian-token&preview=1#rsvp-preview-example');
  await hydrated(page);
  await page.locator('[data-language-select]').first().selectOption('it');
  await expect(page).toHaveURL(/\/it\/rsvp\?token=private-italian-token&preview=1#rsvp-preview-example$/);
  await page.locator('[data-language-select]').first().selectOption('sl');
  await expect(page).toHaveURL(/\/sl\/rsvp\?token=private-italian-token&preview=1#rsvp-preview-example$/);
  expect(await page.locator('head').innerHTML()).not.toContain('private-italian-token');
});

test('Italian guest pages retain privacy headers and translated errors', async ({ page, request }) => {
  for (const [route, copy] of [['rsvp', it.rsvp.missingToken], ['shared-gallery', it.gallery.missingToken]] as const) {
    const response = await page.goto(`/it/${route}`);
    expect(response?.headers()['cache-control']).toContain('no-store');
    expect(response?.headers()['referrer-policy']).toBe('no-referrer');
    expect(response?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.getByText(copy, {exact: true})).toBeVisible();
  }
  const sitemap = await request.get('/sitemap.xml');
  const xml = await sitemap.text();
  expect(xml).not.toContain('/it/rsvp');
  expect(xml).not.toContain('/it/shared-gallery');
  let pages = xml;
  if (xml.includes('<sitemapindex')) {
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const child = await request.get(new URL(match[1]!).pathname);
      pages += await child.text();
    }
  }
  const indexedPaths = [...pages.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]!).pathname);
  for (const route of ['/it', '/it/privacy', '/it/terms', '/it/delete-account', '/it/feedback']) expect(indexedPaths).toContain(route);
  expect(pages).not.toContain('/it/rsvp');
  expect(pages).not.toContain('/it/shared-gallery');
});

test('Italian RSVP submits stable values and preserves guest-authored text', async ({ page }, info) => {
  let submitted: any;
  let reservation: any;
  await page.route('**/functions/v1/handle-wishlist-reservation', async route => {
    reservation = route.request().postDataJSON();
    await route.fulfill({json: {reservedQuantity: 1, remainingQuantity: 0, reservedByYou: 1}});
  });
  await page.route('**/functions/v1/handle-guest-rsvp', async route => {
    if (route.request().method() === 'POST') {
      submitted = route.request().postDataJSON();
      await route.fulfill({json: {}}); return;
    }
    await route.fulfill({json: {name: 'Alex Morgan', isCouple: false, rsvpStatus: 'pending', mealPreference: null, dietaryNotes: null, menuId: null, coupleName: 'Nina & Luka', menus: [], plusOnes: [], wishlist: { title: 'Our original wishlist', message: 'Your presence', items: [{id: 'gift-1', title: 'Original gift', description: '', url: null, priceAmount: 80, currency: 'EUR', category: 'Home', desiredQuantity: 1, reservedQuantity: 0, remainingQuantity: 1, isPriority: true, imageUrl: null, reservedByYou: 0}]}, rsvpDesign: null}});
  });
  await page.goto('/it/rsvp?token=private-italian-token');
  await expect(page.locator('#rsvp-submit')).toBeVisible();
  await expect(page.getByText(it.rsvp.invitationHeading, {exact: true})).toBeVisible();
  await expect(page.getByText('Our original wishlist', {exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: it.wishlist.reserve})).toBeVisible();
  await page.getByRole('button', {name: it.wishlist.reserve}).click();
  await expect(page.getByText(it.wishlist.success.replace('{title}', 'Original gift'), {exact: true})).toBeVisible();
  expect(reservation).toEqual({itemId: 'gift-1', quantity: 1});
  await page.locator('#rsvp-accept').focus();
  await page.keyboard.press('Space');
  await page.locator('#dietaryNotes').fill('Il mio testo originale');
  await page.locator('#rsvp-submit').click();
  await expect(page.locator('#rsvp-confirmation')).toBeVisible();
  expect(submitted).toMatchObject({rsvpStatus: 'accepted', dietaryNotes: 'Il mio testo originale'});
  await page.screenshot({path: info.outputPath('italian-rsvp-confirmation.png')});
});

test('Italian shot lists translate categories and retain the couple’s own titles', async ({ page }, info) => {
  await page.route('**/functions/v1/serve-gallery', route => route.fulfill({json: {
    coupleName: 'Nina & Luca', weddingDate: '2027-06-12',
    shotList: [{category: 'ceremony', items: [{title: 'Our original photo title', isMustHave: true, sortOrder: 1, src: null}]}],
  }}));
  await page.goto('/it/shared-gallery?token=italian-shot-token');
  await expect(page.locator('#shared-gallery-content')).toBeVisible();
  await expect(page.getByText(it.gallery.categories.ceremony, {exact: true})).toBeVisible();
  await expect(page.getByText('Our original photo title')).toBeVisible();
  expect(await page.locator('head').innerHTML()).not.toContain('italian-shot-token');
  await page.screenshot({path: info.outputPath('italian-shot-list.png'), fullPage: true});
});

test('unprefixed callbacks use the browser Italian language without leaking credentials', async ({ browser }) => {
  const context = await browser.newContext({locale: 'it-IT'});
  const page = await context.newPage();
  await page.goto('/auth/callback/recovery');
  await expect(page.getByRole('heading', {level: 1})).toHaveText(it.authCallback.title);
  await expect(page).toHaveTitle(it.authCallback.title);
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await expect(page).toHaveURL(/\/auth\/callback\/recovery$/);
  await context.close();
});
