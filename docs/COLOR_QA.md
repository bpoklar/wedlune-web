# Unified colors: verification and release

Date: September 22, 2026

## Implementation

- Website UI roles come from `app/assets/css/main.css`; custom RSVP contrast
  comes from `app/utils/colorTheme.ts`. Default RSVP uses the website roles.
- RSVP guest headers, language controls, forms, wishlist, and confirmation share
  a route-local theme. Client navigation removes the overrides.
- Flutter includes the brand/custom mode, localized palette reset, matching
  preview contrast, and safe rendering of invalid saved palette values.
- Exact implicit legacy defaults adopt champagne. Explicit custom choices,
  including the original brown palette, remain intact.

## Completed checks

- Website: 94 unit tests passed; configured Cloudflare production build passed.
- Browser: 91 production-preview checks passed; 7 viewport-specific checks were
  intentionally skipped. Desktop/mobile screenshots were visually inspected.
- Flutter: analysis reported no issues; the complete suite passed 2,161 tests.
  Localization and code generation completed.
- Backend: 14 RSVP pgTAP assertions and 5 Edge Function contract tests passed.
  The minimal deployed reader bundle also passed its compatibility test.
- Offline contract coverage uses the actual local cache and SQLite queue,
  closes/reopens storage, replays the queued custom design, and checks that
  publishing retains the explicit mode and palette.

Browser verification uses Chromium desktop and Pixel 7 viewports, English and
Slovenian pages, and axe. Fixtures include all three templates, implicit legacy
defaults, explicit custom brown, light/dark/low-contrast custom palettes,
selection, keyboard focus, saving, confirmation, and wishlist failures.
Production assertions wait for finite animations before measuring contrast.

The final browser run uses an isolated Node production preview under `.cache/`
to avoid shared development/build output. Nitro's Windows dependency trace
omitted package files, so the preview resolves the installed workspace packages.
The Cloudflare target was built separately with the normal project config.
Screenshots and logs are local QA artifacts, not production guest data.
The final suite log is `.cache/color-e2e-verified.log`; reviewed Windows visual
baselines live in `e2e/site.spec.ts-snapshots/`.

## Device blocker

Android Maestro regression was attempted three times with the disposable local
backend and E2E APK. `Wedlune_QA_API33` disappeared from ADB during the first
flow, including after a cold boot with software rendering. The subsequent
offline lane could not select `emulator-5554`. The available screenshots show
login/home setup, not a completed RSVP editor flow. No Android device pass is
claimed. Rerun regression and offline coverage on a stable emulator/device
before releasing the mobile editor.

## Release state

The optional-field validator migration `20260922072249_add_rsvp_color_mode.sql`
and compatible `handle-guest-rsvp` reader (version 54) are deployed. The deployed
file bundle was read back and matched the tested minimal patch; token-based
access, JWT setting, Premium rules, and existing image behavior were preserved.
No saved designs were bulk rewritten. Website and mobile changes are local;
no website deployment, mobile store release, or commit was made by this task.
