# Website colors

The palette in `app/assets/css/main.css` is the website source of truth.
Use semantic Tailwind roles (`page`, `surface`, `content`, `muted`, `accent`,
`on-accent`, `action`, `on-action`, `control`, `line`, `inverse`) or the corresponding `--site-*`
variables. Do not add palette literals or color-name utilities to components.
Photography, app screenshots, and logo artwork retain their original colors.

Ivory and white carry the content. Primary actions use charcoal with white
labels through `--site-action` and `--site-on-action`; their hover and pressed
states have separate roles. Champagne provides decorative accents, and strong
gold provides visible focus/selection details. Headings stay charcoal. Success
and error roles are reserved for actual status. Keep links underlined and
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

For palette logic, run the affected unit files:

```bash
npm test -- app/utils/colorTheme.test.ts app/utils/rsvpDesign.test.ts
```

For marketing palette/action changes, `npm run test:palette` runs focused
desktop/mobile homepage checks in English, Slovenian and Italian. For shared
public-page roles or custom RSVP themes, select the affected tests from
`e2e/theme.spec.ts` and `e2e/rsvp-colors.spec.ts` rather than every browser test.
The broader theme checks include axe, custom palettes, legacy defaults,
selection/focus, confirmation, wishlist failures and navigation cleanup.
Review affected screenshots before updating visual baselines. Unit tests verify
contrast across gray luminances and mixed custom surfaces, and prohibit palette
literals in component CSS. Build and full-suite guidance is in the
[repository README](../README.md).

The [22 September verification report](COLOR_QA.md) records earlier results;
its champagne-action description and test counts are historical.
