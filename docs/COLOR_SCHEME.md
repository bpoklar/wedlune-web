# Website colors

The palette in `app/assets/css/main.css` is the website source of truth.
Use semantic Tailwind roles (`page`, `surface`, `content`, `muted`, `accent`,
`on-accent`, `control`, `line`, `inverse`) or the corresponding `--site-*`
variables. Do not add palette literals or color-name utilities to components.
Photography, app screenshots, and logo artwork retain their original colors.

Ivory and white carry the content. Champagne marks primary actions with charcoal
labels (6.24:1 contrast); strong gold provides visible focus/selection details.
Headings stay charcoal. Blush is decorative. Success, error, warning, and
information roles are reserved for actual status. Keep links underlined and
provide labels, borders, or icons alongside color. Dark marketing sections use
charcoal with inverse text. Necessary control boundaries must contrast by 3:1;
normal text by 4.5:1. Check blended backgrounds, hover, and selected states too.

The intended feel is warm and celebratory. Color associations are contextual
and cultural, not universal psychological effects. See the
[color psychology review](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00368/full)
and WCAG guidance for [text](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [controls](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## RSVP themes

`resolveRsvpDesign` accepts optional version-1 `colorMode: "brand" | "custom"`.
Brand themes reference website tokens directly, regardless of template. Missing
mode with the exact legacy or current default tuple means brand; all other
tuples mean custom. Explicit custom mode always preserves the chosen colors.
`createRsvpTheme` derives readable foregrounds, mixed surfaces, boundaries,
hover/pressed states, and focus rings using `colorTheme.ts`.

Theme variables belong to the RSVP guest layout, never `:root` or persistent
global state. Use explicit `rsvp-*` component roles for the header, forms,
wishlist, and confirmation. Do not override descendant Tailwind classes.
Semantic status chips retain dedicated foreground/background pairs in custom
themes. “Not attending” uses neutral selection styling.

The Flutter editor and Edge Function normalize the same contract. Offline
drafts retain the mode and publishing copies it into the public snapshot.
Resetting colors preserves template, text, image, and framing settings.

## Checks

Run `npm test`, `npm run build`, and `npm run test:e2e`. The Playwright suite
checks English/Slovenian routes, mobile/desktop, axe, custom light/dark themes,
legacy defaults, explicit custom brown, selection/focus, wishlist errors,
confirmation, and navigation cleanup. Review screenshots before updating
visual baselines. Unit tests verify contrast over all gray luminances and
mixed custom surfaces, plus the ban on component CSS palette literals.
