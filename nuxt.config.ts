import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  nitro: {
    preset: "cloudflare_module",
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

  modules: ["@nuxtjs/seo", "@nuxt/fonts", "@vee-validate/nuxt"],

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  routeRules: {
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
      },
    },
  },

  site: {
    url: "https://wedlune.com",
    name: "Wedlune",
    description:
      "Budgets, RSVPs, smart timelines, and AI recommendations. Your entire wedding, beautifully organized in one app.",
    defaultLocale: "en",
  },

  sitemap: {
    enabled: true,
  },

  ogImage: {
    enabled: false,
  },

  robots: {
    sitemap: "https://wedlune.com/sitemap.xml",
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
    },
  },
});
