# Website feedback verification — 10 September 2026

The public English and Slovenian feedback pages are deployed at `/feedback`
and `/sl/feedback`. They use the Flutter app's `public.feedback` table through
the public `submit-feedback` Edge Function, with Zod 4.4.3 validation on both
sides. Optional reply emails remain private and do not create accounts.

## Release

- Supabase migration: `20260910094737_website_feedback`.
- Edge Function: `submit-feedback`, version 1, active, public JWT verification disabled as designed.
- Cloudflare Worker version: `8a1c2d5e-5d02-4b75-8aba-7b6cc096369f`.
- A real browser submitted category, message, rating, and optional reply email
  through the published website. The endpoint returned 201 and the database
  row had `source = 'website'`, null ownership, and the expected field values.
- Both localized production pages loaded and became interactive. Direct
  anonymous reads of the feedback table returned HTTP 401.
- The API and browser smoke-test rows were verified and deleted by exact ID
  and unique test message. No user feedback was modified.

## Completed checks

- Website unit tests: 74 passed.
- Full Playwright suite: 40 passed, 2 existing platform-specific skips.
- Feedback browser coverage: English and Slovenian on desktop and mobile;
  validation, accessible controls, rating clearing, optional email, duplicate
  clicks, successful submission, offline recovery, throttling, and server errors.
- Desktop/mobile form and success screenshots inspected. Footer snapshots
  updated for the new link; a stale gallery snapshot was refreshed after
  confirming its older language buttons had already been replaced by the
  existing language dropdown.
- Production build and Cloudflare deployment dry run passed.
- Supabase database/RLS suite: 719 assertions passed, including 24 new feedback assertions.
- Edge Function type checks and full tests: 178 tests passed.
- Flutter feedback diagnostics: no issues. Full Flutter suite: 1,649 tests passed,
  including existing feedback/offline behavior.
- Generated feedback TypeScript definitions checked against the deployed schema.
- Supabase security advisors reported no findings for the feedback table.

## Existing diagnostic limitations

The optional repository-wide Vue type check reports three errors outside this
change: the locale parameter type in `LanguageDropdown.vue`, and incompatible
H3 event types in the two mobile association routes. No feedback source file
reports a type error. The checker was run with temporary `vue-tsc` and
TypeScript 5.9.3 because the latest transient TypeScript package could not
start the checker; website dependencies were not changed.

The in-app Browser connection was unavailable. The existing Playwright runner
provided actual Chromium verification and screenshots, including the live site.
The connected Supabase tools and CLI do not expose Edge invocation logs; live
HTTP results and database verification passed, and handler diagnostics log only
fixed error codes, never feedback contents or email addresses.

## Android device coverage

The required Maestro regression lane is running on the authorized connected
device with the isolated E2E APK and disposable local backend. The offline
lane will follow it; final results are pending.

Local logs and screenshots are under `node_modules/.cache/feedback-*.log`,
`test-results/`, and the Flutter repository's `build/feedback-*.log` and
`build/maestro/` directories. These runtime artifacts are excluded from Git.
