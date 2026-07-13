import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

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

  modules: ["@nuxtjs/seo", "@nuxt/fonts", "@nuxt/image", "@vee-validate/nuxt"],

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
