# Wedlune Web — Improvement Plan

**Last Updated**: March 25, 2026

---

## Current State

Marketing landing site + RSVP tool built with Nuxt 4, Vue 3, Tailwind CSS v4.

**Existing pages:** Homepage (hero, features, how-it-works, testimonials), Privacy, Terms, RSVP (token-based guest response form).

**Existing SEO:** Basic `useHead` + `useSeoMeta` + one `defineSoftwareApp` schema on homepage. No blog, no sitemap config, no structured FAQ, no breadcrumbs, no internal linking depth.

---

## Phase W1 — SEO Foundation

### W1.1 Sitemap & Robots

- Configure `@nuxtjs/seo` sitemap module — auto-generate `sitemap.xml` from file-based routes.
- Replace `_robots.txt` with proper `nuxt.config.ts` robots config (`allow: /`, `disallow: /rsvp`).
- Add `sitemap: https://wedlune.com/sitemap.xml` to robots.txt output.

### W1.2 Structured Data on Every Page

- **Homepage:** Keep `defineSoftwareApp`; add `defineOrganization` with logo, social profiles, contact.
- **Privacy / Terms:** Add `defineWebPage({ "@type": "WebPage" })` with `lastReviewed` date.
- **Future blog posts:** `defineArticle` with author, datePublished, dateModified, image.
- **FAQ section (W2.2):** `defineFAQPage` with question/answer pairs.

### W1.3 Meta & Open Graph Completeness

- Add `og:image` for every page (branded 1200×630 card per page, stored in `public/og/`).
- Add `og:locale`, `og:site_name` to global defaults in `nuxt.config.ts`.
- Add canonical URLs via `useHead({ link: [{ rel: 'canonical', href: '…' }] })`.
- Ensure `twitter:image` matches `og:image` on every page.

### W1.4 Performance & Core Web Vitals

- Audit with Lighthouse — target 95+ on all four metrics.
- Preload hero fonts (Playfair Display, Great Vibes) via `@nuxt/fonts` priority config.
- Add explicit `width` + `height` to all `<NuxtImg>` to prevent CLS.
- Convert all images to WebP via `<NuxtPicture>`.
- Set `loading="eager"` only on above-the-fold hero image; everything else `lazy`.
- Inline critical CSS; defer below-the-fold component CSS.

### W1.5 Semantic HTML Audit

- Ensure one `<h1>` per page (currently correct on homepage; verify all pages).
- Verify heading hierarchy: `h1 → h2 → h3` with no skipped levels.
- Use `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` consistently.
- Add `aria-label` to nav landmarks for accessibility + SEO.
- Replace any generic "Click here" link text with descriptive text.

---

## Phase W2 — Content & Pages

### W2.1 Blog / Wedding Planning Guides

High-value content pages targeting long-tail wedding keywords. Each post gets full SEO treatment (`useHead`, `useSeoMeta`, `defineArticle`, `og:image`).

**Keyword-targeted articles (priority order):**

1. **"How to Plan a Wedding Step by Step"** — Maps to app's questionnaire → timeline flow.
2. **"Wedding Budget Breakdown: Where Does the Money Go?"** — Maps to budget tracker + hidden costs feature.
3. **"How to Create a Wedding Guest List"** — Maps to guest management + logistics flags.
4. **"Wedding Day Timeline Template"** — Maps to day-of timeline mode.
5. **"How to Choose a Wedding Venue"** — Maps to multi-venue + AI recommendations.
6. **"Wedding Vendor Checklist: Who Do You Need?"** — Maps to vendor hub + scoring.
7. **"Wedding RSVP Wording and Etiquette"** — Maps to RSVP feature + message templates.
8. **"Wedding Seating Chart Tips"** — Maps to seating chart feature.
9. **"Wedding Photography Shot List"** — Maps to shot-list builder.
10. **"How to Plan a Wedding on a Budget"** — Maps to budget tracker + contingency buffer.

**Implementation:**

- Create `app/pages/blog/index.vue` (listing) + `app/pages/blog/[slug].vue` (detail).
- Content can be Markdown in `content/blog/` using `@nuxt/content` or hardcoded Vue pages initially.
- Each article ends with CTA: "Plan your wedding with Wedlune — Download free."
- Internal links from articles back to homepage feature sections.
- Add blog link to `SiteHeader` navigation.

### W2.2 FAQ Page

- Create `app/pages/faq.vue` with `defineFAQPage` schema.
- Target "wedlune" branded queries + common wedding planning questions.
- Questions grouped by category: General, AI Features, Privacy & Data, Pricing, Getting Started.
- Collapsible accordion UI.
- Add FAQ link to footer.

**Sample FAQ items:**

- "Is Wedlune free?" → Free tier + premium features.
- "How does AI wedding planning work?" → Questionnaire → recommendations flow.
- "Is my wedding data private?" → RLS, encryption, no training on user data.
- "Can both partners use Wedlune together?" → Couple collaboration feature.
- "Does Wedlune work for destination weddings?" → Multi-venue, out-of-town guest flags.
- "How do I share my RSVP link?" → Guest message templates, RSVP web page.

### W2.3 Features Detail Page

- Create `app/pages/features.vue` — expanded version of homepage features grid.
- One section per major app feature with screenshot/mockup, description, benefit.
- Target mid-funnel keywords: "AI wedding planning app", "wedding budget tracker app", "wedding guest list app".
- Schema: `defineSoftwareApp` with expanded `featureList`.
- Internal links from blog posts to this page.

### W2.4 Pricing Page

- Create `app/pages/pricing.vue` when IAP is ready.
- Free vs Premium comparison table.
- Schema: `defineProduct` with pricing offers.
- FAQ section at bottom for pricing-specific questions.

---

## Phase W3 — Technical SEO

### W3.1 Internal Linking Strategy

- Homepage hero → Features page, Blog, FAQ.
- Blog articles → Related articles (2–3 links per post).
- Blog articles → Features page (contextual links to relevant features).
- Features page → Blog articles (e.g. "Learn more about budget planning →").
- Footer: Add links to Features, Blog, FAQ, Privacy, Terms.
- Breadcrumbs on blog posts and FAQ: `Home > Blog > Article Title`.

### W3.2 URL Structure

- `/` — Homepage
- `/features` — Feature detail page
- `/blog` — Blog listing
- `/blog/how-to-plan-a-wedding` — Blog post (kebab-case slugs)
- `/faq` — FAQ page
- `/pricing` — Pricing (when ready)
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/rsvp` — Guest RSVP (noindex)

### W3.3 Page Speed Optimizations

- Enable Nuxt `routeRules` for static pages: `prerenderRoutes` for homepage, blog, FAQ, features.
- Set `Cache-Control` headers for static assets (1 year for hashed files).
- Lazy-load below-the-fold sections (TestimonialsSection, HowItWorksSection) with `<LazyTestimonialsSection />`.
- Minimize JavaScript bundle — audit unused dependencies.

### W3.4 Multi-Language SEO (when ready)

- Add `hreflang` tags for English + Slovenian (`en`, `sl`).
- Prefix Slovenian routes: `/sl/`, `/sl/blog/`, `/sl/faq`.
- Separate translated OG meta per locale.
- Translate blog articles for Slovenian audience.

---

## Phase W4 — Conversion & Engagement

### W4.1 App Store Badges

- Replace text-only "Coming soon" with real App Store + Google Play badge images.
- Link directly to store listings when available.
- Track clicks with UTM parameters.

### W4.2 Download / Waitlist CTA

- Add email capture form for waitlist (pre-launch) or direct download links (post-launch).
- Sticky bottom bar on mobile: "Download Wedlune — Free" with store link.
- CTA on every page (hero, blog post footer, FAQ bottom, features bottom).

### W4.3 Social Proof

- Expand testimonials: 4–6 reviews, rotating carousel.
- Add "As seen in" press logos (when available).
- Add app store rating badge when ratings accumulate.
- User count badge: "Join X couples planning their wedding."

### W4.4 Wedding Website / QR Hub (Phase C1 from app roadmap)

- Couple-generated mini website from app data: schedule, venue info, FAQ, RSVP link.
- QR code generation for invitations and signage.
- Custom subdomain or path: `wedlune.com/w/{couple-slug}`.
- This is the biggest web feature — build after core SEO and content are in place.

---

## Phase W5 — Analytics & Monitoring

### W5.1 Analytics Setup

- Add privacy-friendly analytics (Plausible or Umami — no cookie banners needed).
- Track: page views, CTA clicks, blog engagement, RSVP completions, download clicks.
- Set up conversion funnels: Homepage → Features → Download.

### W5.2 Search Console

- Verify site in Google Search Console.
- Submit sitemap.
- Monitor: index coverage, Core Web Vitals, search performance.
- Set up alerts for crawl errors and index drops.

### W5.3 Structured Data Testing

- Validate all Schema.org markup with Google Rich Results Test after each new page.
- Monitor rich snippet eligibility in Search Console.

---

## Priority Order

| Priority | Item                      | Impact | Effort |
| -------- | ------------------------- | ------ | ------ |
| 1        | W1.1 Sitemap & Robots     | High   | Low    |
| 2        | W1.2 Structured data      | High   | Low    |
| 3        | W1.3 OG images & meta     | High   | Medium |
| 4        | W1.5 Semantic HTML audit  | Medium | Low    |
| 5        | W1.4 Core Web Vitals      | High   | Medium |
| 6        | W2.2 FAQ page             | High   | Low    |
| 7        | W2.1 Blog (first 3 posts) | High   | High   |
| 8        | W2.3 Features detail page | Medium | Medium |
| 9        | W3.1 Internal linking     | High   | Low    |
| 10       | W5.1 Analytics            | Medium | Low    |
| 11       | W5.2 Search Console       | High   | Low    |
| 12       | W4.1 App Store badges     | Medium | Low    |
| 13       | W2.1 Blog (posts 4–10)    | Medium | High   |
| 14       | W3.3 Page speed           | Medium | Medium |
| 15       | W4.3 Social proof         | Medium | Medium |
| 16       | W2.4 Pricing page         | Medium | Low    |
| 17       | W3.4 Multi-language       | Medium | High   |
| 18       | W4.4 Wedding website hub  | High   | High   |
