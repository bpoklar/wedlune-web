# Privacy and terms draft — 28 September 2026

English, Slovenian and Italian privacy/terms, account-deletion retention text,
feedback wording and RSVP notices are aligned with the Flutter project.

At the original review, publication was blocked by draft operator details and
the separate operational/legal follow-ups in the app report. The source note
below supersedes the placeholder description; it does not establish that those
other follow-ups are complete.

The full implementation and publication checklist is in the sibling Flutter
repository at [docs/Release/PRIVACY_ALIGNMENT_2026_09_28.md](../../wedlune/docs/Release/PRIVACY_ALIGNMENT_2026_09_28.md). It tracks provider
agreements/transfers, backup and feedback/support retention, 16–17-year-old
safeguards and advertising/age signals, sensitive dietary-data basis and
third-party submissions, and worldwide merchant/distribution requirements.
These are not implemented or certified by policy wording or a privacy link.

AI consent remains `2026-08-26.1`; there are no API, database, or persisted-data
changes. RSVP legal links use plain locale paths without RSVP tokens and suppress
referrers. The existing feedback privacy link remains available.

Automated tests were not executed during the September 28 task at the user's
request; date expectations were updated for a future run. This records that
task's verification, not a current instruction to skip tests. Use the
[repository README](../README.md#change-specific-checks) for current testing
requirements. Builds/static checks are recorded in the Flutter report; they
do not establish browser/device acceptance.

## Source review — 2 October 2026

All three website locale catalogs now identify Blaz Poklar s.p., a sole
proprietor in Slovenia, and `support@wedlune.com` in both privacy and terms.
They no longer contain the address/telephone placeholders described by the
original report. `app/utils/legalDisclosures.test.ts` expects this final operator
wording and the 28 September legal dates. Legal-page structured data still uses
`2026-09-28`; no policy date was changed during this documentation review.

The current source still uses plain localized privacy paths for RSVP notices
and suppresses referrers. This review checked local source only: no suites,
builds, browser/device acceptance, hosted configuration or legal compliance
checks were executed. Operational/legal follow-ups remain tracked in the app
report; removing draft placeholders does not prove they are complete.
