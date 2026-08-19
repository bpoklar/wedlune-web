import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  features: {
    inlineStyles: true,
  },

  nitro: {
    preset: "cloudflare_module",
    compressPublicAssets: { gzip: true, brotli: true },
    cloudflare: {
      // Generate the Worker entrypoint/assets config that `wrangler deploy`
      // consumes. Dashboard variables are retained by keep_vars in
      // wrangler.toml.
      deployConfig: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@unhead/schema-org/vue",
        "@vue/devtools-core",
        "@vue/devtools-kit",
      ],
    },
  },

  modules: ["@nuxtjs/seo", "@nuxt/fonts", "@vee-validate/nuxt", "@nuxtjs/i18n"],

  fonts: {
    defaults: {
      weights: [400],
      styles: ["normal"],
      subsets: ["latin-ext", "latin"],
      formats: ["woff2"],
    },
    devtools: false,
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        { name: "theme-color", content: "#fffdf9" },
        { name: "color-scheme", content: "light" },
      ],
    },
  },

  routeRules: {
    "/": { prerender: true },
    "/sl": { prerender: true },
    "/privacy": { prerender: true },
    "/terms": { prerender: true },
    "/delete-account": { prerender: true },
    "/sl/privacy": { prerender: true },
    "/sl/terms": { prerender: true },
    "/sl/delete-account": { prerender: true },
    "/auth/callback/**": {
      ssr: false,
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    "/_nuxt/**": {
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
    "/img/**": {
      headers: { "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400" },
    },
    "/rsvp": {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    "/shared-gallery": {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    "/sl/rsvp": {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
    "/sl/shared-gallery": {
      headers: {
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  },

  i18n: {
    baseUrl: "https://wedlune.com",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    locales: [
      { code: "en", name: "English", language: "en", file: "en.json" },
      { code: "sl", name: "Slovenščina", language: "sl", file: "sl.json" },
    ],
  },

  site: {
    url: "https://wedlune.com",
    name: "Wedlune",
    description:
      "A calm wedding planner app for couples, with a shared checklist, budget, guests, RSVPs, vendors, and timeline.",
    defaultLocale: "en",
  },

  sitemap: {
    enabled: true,
    exclude: [
      "/rsvp",
      "/shared-gallery",
      "/sl/rsvp",
      "/sl/shared-gallery",
      "/auth/callback/**",
    ],
  },

  ogImage: {
    enabled: false,
  },

  robots: {},

  runtimeConfig: {
    appleTeamId: process.env.APPLE_TEAM_ID || "",
    androidAppLinkSha256: process.env.ANDROID_APP_LINK_SHA256 || "",
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
      appStoreUrl: process.env.NUXT_PUBLIC_APP_STORE_URL || "",
      googlePlayUrl: process.env.NUXT_PUBLIC_GOOGLE_PLAY_URL || "",
    },
  },
});
