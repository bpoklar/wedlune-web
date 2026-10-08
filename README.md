# Wedlune Web

Nuxt 4 / Vue 3 website for Wedlune marketing pages, public legal pages, account
deletion instructions, feedback, token-gated guest RSVP/wishlists, shared
galleries, and private mobile-auth callbacks. English, Slovenian and Italian
use unprefixed, `/sl`, and `/it` routes respectively.

The RSVP route accepts the guest token from the shared URL. Free weddings with
up to 50 invited people use the default presentation; Premium may load the
published design and wishlist and lets that RSVP party reserve, change, and
cancel gift quantities. Design and wishlist payloads remain additive. The
backend also returns optional published `weddingInformation` on eligible Free and
Premium RSVP links. The website renders bounded plain text, wedding-local dates
and times, validated travel links and FAQ before RSVP and after confirmation.
Older responses without this field remain supported. Information publication is
independent of Premium design publication. The complete contract is in
[RSVP access and presentation](../wedlune/docs/RSVP_DESIGN.md). App and
backend source lives in the sibling `../wedlune` repository; website-only work
uses the checks below and does not require Flutter/Android setup.

See the [documentation index](docs/README.md) for palette contracts, asset
provenance, the remaining backlog and dated QA/privacy evidence. Historical
reports describe their recorded revision, not current production verification.

## Setup

Use the committed npm lockfile when dependencies need installation:

```bash
npm ci
```

Start development on `http://localhost:3000`:

```bash
npm run dev
```

## Change-specific checks

Always run the relevant unit tests for website code changes. Use affected
Vitest files while iterating; use `npm test` for broad shared/config/dependency
changes, release verification or an explicitly requested full-suite review.
Do not repeat passed checks without new edits, failures or unresolved concerns.
Documentation-only changes need source/link and diff checks, not builds or
test/device setup.

```bash
# Example: feedback schema change
npm test -- app/utils/feedback.test.ts
# Example: store-link behavior
npm test -- app/utils/storeLinks.test.ts
```

Select browser coverage for changed rendering, interactions or browser-only
behavior. Multiple affected spec files can share one Playwright invocation:

```bash
npm run test:e2e -- e2e/feedback.spec.ts
npm run test:e2e -- e2e/rsvp-access.spec.ts e2e/rsvp-colors.spec.ts
```

The default Playwright configuration runs Chromium desktop and Pixel 7
viewports with one worker against port 3200, and can reuse an existing local
server. Inspect affected screenshots and failures under `test-results/`.
Keep production secrets and real guest data out of browser fixtures.

For a palette or homepage styling change, run `npm run test:palette` for focused
desktop/mobile checks in English, Slovenian, and Italian. These checks cover
text contrast, button states, phone preview separation, and the preview icon,
and save review screenshots under `test-results/`. Reserve the full E2E suite
for broader changes; update only the affected visual baselines after review.

Website colors are centralized in `app/assets/css/main.css`. Decorative
champagne roles are separate from action roles. Custom guest RSVP palettes
remain scoped; historical default palettes resolve to the current brand. See
[Website colors](docs/COLOR_SCHEME.md) for unit/browser selection.

Run `npm run build` when route/configuration, SSR/prerendering, deployment or
bundling behavior needs verification, and for release checks. Before a broad
release, run `npm test`, `npm run build`, and `npm run test:e2e` once against
the final patch. Review only affected visual baselines before updating them.

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

### Cloudflare Workers environment

`wrangler.toml` preserves dashboard-managed variables during deployments.
Configure the following values for the `wedlune-web` Worker in both its build
environment and runtime Variables and Secrets, then redeploy:

- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_ANON_KEY`
- `NUXT_PUBLIC_APP_STORE_URL`
- `NUXT_PUBLIC_GOOGLE_PLAY_URL`
- `APPLE_TEAM_ID` (10-character Apple Developer Team ID for Universal Links)
- `ANDROID_APP_LINK_SHA256` (optional comma-separated Google Play signing
  SHA-256 fingerprints; debug and upload fingerprints are bundled)

`APPLE_TEAM_ID` is mandatory before building or archiving an iOS release.
After setting it, redeploy this Worker and verify
`/.well-known/apple-app-site-association` returns HTTP 200 with
`<TEAM_ID>.com.wedlune.app`. Do not use the bundle ID or the numeric App Store
Connect app ID in place of the 10-character Developer Team ID.

Google Play badges default to the published
[Wedlune Android app](https://play.google.com/store/apps/details?id=com.wedlune.app).
`NUXT_PUBLIC_GOOGLE_PLAY_URL` can override that link. The App Store URL is
optional. Only complete HTTPS links on `apps.apple.com` and `play.google.com`
are rendered as interactive badges; a missing or invalid platform URL displays
localized, non-interactive “Coming soon” content.

Auth callbacks use `/auth/callback/signup`, `/auth/callback/invite`, and
`/auth/callback/recovery`. These routes are private, non-cacheable handoff
pages for the mobile app. Never add analytics, logging, third-party scripts, or
server-side token exchange to these routes.

Do not rely on the local `.env` file for Cloudflare builds; it is intentionally
excluded from source control.

Use `npm run build` as the Cloudflare build command and `npx wrangler deploy`
as the deploy command. The Nuxt Cloudflare Worker preset generates the
redirected Worker configuration, entrypoint, and static-assets binding under
`.output/server`. Do not add `pages_build_output_dir` to `wrangler.toml`; that
turns the deployment into a Pages configuration, where the generated `ASSETS`
binding conflicts with Pages' reserved binding.

### AdMob app verification

`public/app-ads.txt` declares the authorized AdMob publisher and is served at
`https://wedlune.com/app-ads.txt`. Keep its publisher ID aligned with the
personalized app-ads.txt snippet in AdMob (not an app ID or ad-unit ID).

After deploying, check that this URL returns HTTP 200 and the declaration as
plain text. The Google Play listing's developer website must point to
`https://wedlune.com`. Then select **Check for updates** in AdMob; Google says
verification can take up to 24 hours. See the
[AdMob setup instructions](https://support.google.com/admob/answer/9363762).

## Website feedback

`/feedback`, `/sl/feedback`, and `/it/feedback` accept public feedback without an account. The
footer links to the localized page. Category, a trimmed 10–2,000-character
message, an optional 1–5 rating, and optional reply email are validated with
the Zod schema in `app/utils/feedback.ts` and sent to the `submit-feedback`
Supabase Edge Function using the
existing public runtime configuration.

The function lives in the Flutter repository and writes to the same
`public.feedback` table with `source = 'website'` and null user/wedding IDs.
Flutter inserts keep the `app` default. Anonymous clients cannot access the
table directly; the function enforces a honeypot, a 16 KiB body limit, and
database-backed network rate limits (5 attempts per 10 minutes, 25 per day).
Contact emails are optional, unverified, and private. The form retains values
after network errors for manual retry and does not persist an offline queue.

Keep `app/utils/feedback.ts` aligned with the function's `schema.ts`; the website
and Edge Function have separate dependency versions. For feedback changes,
run `npm test -- app/utils/feedback.test.ts` and select
`e2e/feedback.spec.ts` when browser behavior is affected. Its original browser
coverage is English/Slovenian on desktop/mobile; Italian catalog consistency
also has unit coverage. Form/success screenshots are saved for review. The
[10 September QA report](docs/FEEDBACK_QA.md) preserves original release evidence.
Release the `website_feedback` database migration and `submit-feedback`
function before deploying the website. Do not log messages or contact emails.

## Legal-page synchronization

The localized `/privacy`, `/terms`, and `/delete-account` pages mirror the
legal disclosures shipped inside the Flutter app. AI chat disclosures must
describe guest-safe planning summaries and the exact allowlist of saved
business details sent through OpenRouter. Verified venue lookup and section
recommendations use the separate OpenRouter/Exa source-bound discovery flow;
transport geocoding and route calculation use openrouteservice. Material
processing changes require matching English, Slovenian and Italian updates,
synchronized policy dates, review of whether the Flutter/Edge consent version
must change, and updates to `app/utils/legalDisclosures.test.ts`.

The current AI chat uses OpenRouter's global endpoint. Public copy must disclose
possible non-EEA processing under the reviewed DPA and Standard Contractual
Clauses, describe ZDR as a provider-retention control rather than
anonymization, and explain that Wedlune separately stores private chat history
until the user deletes it. Do not publish or enable AI chat until the provider,
transfer, store-declaration, and legal checks in the app repository release
checklist are complete. The [website privacy report](docs/PRIVACY_ALIGNMENT_2026_09_28.md)
records the 28 September wording change and later source-review limits; it
does not certify legal or operational readiness.

## RSVP and wishlist safety

- Never log, persist, or include the RSVP bearer token in outbound retailer URLs.
- Retailer links open in a new tab with `noopener` and `noreferrer`; RSVP pages
  are `noindex` and use the site's no-referrer policy.
- The token is validated before plan checks. Free loading and submission work
  through 50 invited people with the default design and no wishlist; above 50,
  the neutral `free_guest_limit_exceeded` state reveals no subscription details.
- Premium expiry preserves the published design and wishlist. Reducing the
  guest list resumes Free RSVP; renewal restores the preserved presentation.
- The optional versioned `rsvpDesign` payload supports Classic, Botanical, and
  Modern layouts. Missing or invalid payloads render the current default.
- Custom colors and copy apply to form, wishlist, and confirmation states.
- Hero images use short-lived signed URLs from private storage. The response
  never exposes the underlying object path; reload to refresh an expired URL.
- A draft or empty list is not rendered. Fully reserved items stay visible, and
  only the party that reserved a quantity can reduce or cancel it.
- Guest-facing wishlist image URLs are also short-lived signed URLs from private storage.
- Reservation responses contain counts only and never reveal another giver's identity.

Use relevant `rsvpDesign`, `rsvpMenu`, and `rsvpPreview` unit tests plus affected
RSVP browser specs during development. The broad release checks above are
followed by manual verification of all
three layouts on mobile/desktop, default and custom designs, Premium-unavailable,
accepted/declined/confirmation states, reservation cancellation, external-link
safety, keyboard use, accessible status announcements, and expired/missing
image behavior.
