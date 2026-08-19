# Wedlune Web

Nuxt 4 website for Wedlune marketing pages, public legal pages, account
deletion instructions, token-gated guest RSVP, and wedding wishlists.

The Premium RSVP route accepts the guest token from the shared URL, loads the
published wedding design and wishlist through Supabase Edge Functions, and lets
that RSVP party respond or reserve, change, and cancel gift quantities. Design
and wishlist data are additive so the page remains compatible with older
backend deployments that omit either payload.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
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

Store URLs are optional. Only complete HTTPS links on `apps.apple.com` and
`play.google.com` are rendered as interactive badges; a missing or invalid
platform URL displays localized, non-interactive “Coming soon” content.

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

## Legal-page synchronization

The localized `/privacy`, `/terms`, and `/delete-account` pages mirror the
legal disclosures shipped inside the Flutter app. AI chat disclosures must
describe guest-safe planning summaries and the exact allowlist of saved
business details sent through OpenRouter, while distinguishing that flow from
the separate OpenAI venue lookup and Gemini recommendation flows. Material AI
disclosure changes require matching English and Slovenian updates, synchronized
policy dates, a Flutter/Edge consent-version bump, and updates to
`app/utils/legalDisclosures.test.ts`.

The current AI chat uses OpenRouter's global endpoint. Public copy must disclose
possible non-EEA processing under the reviewed DPA and Standard Contractual
Clauses, describe ZDR as a provider-retention control rather than
anonymization, and explain that Wedlune separately stores private chat history
until the user deletes it. Do not publish or enable AI chat until the provider,
transfer, store-declaration, and legal checks in the app repository release
checklist are complete.

## RSVP and wishlist safety

- Never log, persist, or include the RSVP bearer token in outbound retailer URLs.
- Retailer links open in a new tab with `noopener` and `noreferrer`; RSVP pages
  are `noindex` and use the site's no-referrer policy.
- Both RSVP loading and submission require an active wedding Premium
  entitlement after the token is validated. A valid paused link renders the
  neutral `premium_required` unavailable state without subscription details.
- The optional versioned `rsvpDesign` payload supports Classic, Botanical, and
  Modern layouts. Missing or invalid payloads render the current default.
- Custom colors and copy apply to form, wishlist, and confirmation states.
- Hero images use short-lived signed URLs from private storage. The response
  never exposes the underlying object path; reload to refresh an expired URL.
- A draft or empty list is not rendered. Fully reserved items stay visible, and
  only the party that reserved a quantity can reduce or cancel it.
- Guest-facing wishlist image URLs are also short-lived signed URLs from private storage.
- Reservation responses contain counts only and never reveal another giver's identity.

Before release, run `npm test`, `npm run build`, and `npm run test:e2e`, then manually verify all
three layouts on mobile/desktop, default and custom designs, Premium-unavailable,
accepted/declined/confirmation states, reservation cancellation, external-link
safety, keyboard use, accessible status announcements, and expired/missing
image behavior.
