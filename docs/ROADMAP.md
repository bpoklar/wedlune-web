# Website backlog

Reviewed against the local implementation on 2 October 2026. This replaces the
March 2026 improvement plan, whose setup work is largely implemented. Items
below are proposals, not approved implementation tasks or release blockers.

## Already implemented

- `nuxt.config.ts` enables sitemap generation, prerenders public marketing/legal
  pages, excludes token pages and auth callbacks from the sitemap, and configures
  cache/privacy headers.
- `app/composables/useLocalizedSeo.ts` supplies canonical URLs, Open Graph and
  Twitter metadata. `app/app.vue` supplies locale links and Organization JSON-LD;
  the homepage adds WebSite and SoftwareApplication data.
- English, Slovenian and Italian routes/locales exist. Marketing, legal,
  account-deletion and feedback pages are localized.
- The homepage includes feature, pricing comparison and FAQ sections. Store
  badges use validated configured links and a localized unavailable state.
- `EditorialPicture.vue` renders sized AVIF/WebP/JPEG sources with loading hints.
  Hashed assets have long-lived caching; public images have a separate cache rule.
- RSVP supports Free weddings through 50 invited people and Premium published
  designs/wishlists. Shared galleries and private mobile-auth callbacks also
  exist. See the [repository overview](../README.md) for their contracts.

## Remaining opportunities

| Area | Proposed work | Current boundary |
| --- | --- | --- |
| Performance/accessibility | Measure current mobile performance, keyboard use, heading hierarchy and layout stability before choosing optimizations. | Source inspection is not a Lighthouse or browser pass; the old 95+ target was an aspiration. |
| Search metadata | Evaluate page-specific social images and FAQ structured data. | The homepage uses `home-en-v2.png`; other pages default to `default.png`. FAQ accordion exists, but no FAQPage JSON-LD is emitted. |
| Planning guides | Add a blog/guide listing and localized articles if an editorial owner and publishing plan are established. | No `/blog` route or content module exists. Add article metadata, related links and breadcrumbs alongside actual content. |
| Dedicated pages | Consider separate features, FAQ and pricing pages when content exceeds the existing homepage sections. | No `/features`, `/faq` or `/pricing` route exists; avoid duplicating current copy without a user need. |
| Search operations | Record Search Console ownership, sitemap submission and monitoring when reviewed. | Repository configuration does not establish live account verification or indexing results. |
| Conversion/social proof | Use verified reviews, ratings or press mentions when available; assess whether extra mobile CTAs help. | Do not treat the former testimonial/user-count ideas as existing evidence. |
| Analytics | Decide purposes and privacy requirements before adding page/conversion tracking. | The old plan's assertion that a provider removes all banner/consent needs was unverified. Preserve private token and callback routes. |
| Wedding website hub | Explore couple schedules, venues, FAQs and invitation/QR sharing as a separate product feature. | RSVP and gallery already exist; a couple slug/subdomain hub does not. Check app offline/sync, sharing and entitlement contracts before expanding it. |

The original guide topics remain useful editorial candidates: planning step by
step, budget breakdown, guest lists, day-of timelines, venue selection, vendor
checklists, RSVP wording, seating charts, photography shot lists, and planning
on a budget. Validate current product claims before publishing any guide.

Prioritize measured defects and missing content before adding routes, tracking,
dependencies or additional social-proof UI. Licensing gaps and legal publication
follow-ups are recorded separately in [asset licenses](ASSET_LICENSES.md) and
the [website privacy report](PRIVACY_ALIGNMENT_2026_09_28.md).
