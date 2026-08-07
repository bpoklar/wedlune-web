# Wedlune Web

Nuxt 4 website for Wedlune marketing pages, public legal pages, account
deletion instructions, token-gated guest RSVP, and wedding wishlists.

The RSVP route accepts the guest token from the shared URL, loads guest and
published wishlist data through Supabase Edge Functions, and lets that RSVP
party reserve, change, or cancel gift quantities. Wishlist data is additive so
the page remains compatible with backend deployments that omit `wishlist`.

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

## RSVP and wishlist safety

- Never log, persist, or include the RSVP bearer token in outbound retailer URLs.
- Retailer links open in a new tab with `noopener` and `noreferrer`; RSVP pages
  are `noindex` and use the site's no-referrer policy.
- A draft or empty list is not rendered. Fully reserved items stay visible, and
  only the party that reserved a quantity can reduce or cancel it.
- Guest-facing image URLs are short-lived signed URLs from private storage.
- Reservation responses contain counts only and never reveal another giver's identity.

Before release, run `npm run build` and manually verify mobile/desktop RSVP,
accepted and declined states, reservation cancellation, external-link safety,
keyboard use, accessible status announcements, and expired-image behavior.
