# GitHub Copilot Instructions — Wedlune Web

**Stack:** Nuxt 4 · Vue 3 · Tailwind CSS v4 · @nuxtjs/seo · @nuxt/image · @vee-validate/nuxt · Bun

**Package manager:** always `bun` — never `npm` or `yarn`. (`bun install`, `bun add <pkg>`, `bun run dev`)

**Structure:** all source under `app/` (Nuxt 4 srcDir). File-based routing in `app/pages/`, components auto-imported from `app/components/`.

---

## SEO — highest priority

Every page **must** have all three:

```ts
// 1. Page meta
useHead({
  title: "Page Title — Wedlune", // em dash, unique per page
  meta: [{ name: "description", content: "120–160 char keyword-rich description." }],
});

// 2. Open Graph + Twitter
useSeoMeta({
  ogTitle: "Page Title — Wedlune",
  ogDescription: "...",
  ogType: "website",
  ogUrl: "https://wedlune.com/page",
  twitterCard: "summary_large_image",
  twitterTitle: "Page Title — Wedlune",
  twitterDescription: "...",
});

// 3. Schema.org structured data (pick appropriate type)
useSchemaOrg([defineSoftwareApp({ ... })]); // home
useSchemaOrg([defineArticle({ ... })]);      // blog
useSchemaOrg([defineFAQPage({ ... })]);      // FAQ sections
```

**Semantic HTML rules:** one `<h1>` per page; never skip heading levels; use `<section>`, `<article>`, `<main>`, `<nav>`, `<footer>`; no "click here" link text.

**Site config** (`nuxt.config.ts`) — do not change: `url: "https://wedlune.com"`, `name: "Wedlune"`, `defaultLocale: "en"`.

---

## Images — `@nuxt/image`

Always `<NuxtImg>` / `<NuxtPicture>`, never `<img>`.

```vue
<NuxtImg
  src="/images/hero.jpg"
  alt="Descriptive text"
  width="1200"
  height="800"
  format="webp"
  quality="85"
  loading="lazy"
/>
```

- Set `width` + `height` to prevent CLS. Use `loading="eager"` only for above-the-fold hero.

---

## Forms — `@vee-validate/nuxt` + Zod v4

```vue
<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(z.object({ email: z.string().email() })),
});
const { value: email } = useField<string>("email");
const onSubmit = handleSubmit(async (values) => {
  /* ... */
});
</script>
<template>
  <form @submit.prevent="onSubmit" novalidate>
    <input v-model="email" type="email" />
    <p v-if="errors.email" class="text-dusty-crimson text-sm">
      {{ errors.email }}
    </p>
    <button type="submit">Submit</button>
  </form>
</template>
```

---

## Design system (Tailwind v4)

Tokens defined in `app/assets/css/main.css`. **Never use raw hex — always use token classes.**

| Color token           | Use             | Font token     | Use              |
| --------------------- | --------------- | -------------- | ---------------- |
| `bg-ivory-cream`      | Page background | `font-display` | Playfair, titles |
| `bg-soft-champagne`   | Cards           | `font-body`    | Nunito, body     |
| `text-champagne-gold` | Primary CTAs    | `font-accent`  | Great Vibes      |
| `text-deep-gold`      | Hover states    |                |                  |
| `text-blush-rose`     | Accents         |                |                  |
| `text-charcoal`       | Primary text    |                |                  |
| `text-warm-gray`      | Subtitles       |                |                  |
| `border-linen`        | Dividers        |                |                  |
| `text-sage-green`     | Success         |                |                  |
| `text-dusty-crimson`  | Errors          |                |                  |

Use Tailwind spacing scale (`p-4`, `gap-8`, etc.) — no magic numbers.

---

## Conventions

- Components: `PascalCase.vue` · Pages: `kebab-case.vue` · Variables: `camelCase`
- Component order: `<template>` → `<script setup lang="ts">` → `<style scoped>` (only if Tailwind is insufficient)
- Internal links: `<NuxtLink>`. External env values via `useRuntimeConfig()` — never hardcode URLs or keys.
- Edge Functions called via plain `fetch` — do not import `@supabase/supabase-js`.
