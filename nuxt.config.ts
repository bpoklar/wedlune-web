import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  modules: ["@nuxtjs/seo", "@nuxt/fonts", "@nuxt/image", "@vee-validate/nuxt"],

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  site: {
    url: "https://wedlune.com",
    name: "Wedlune",
    description:
      "AI-powered wedding planning assistant for couples. Smart timelines, vendor management, budget tracking, and personalized recommendations — all in one elegant app.",
    defaultLocale: "en",
  },

  ogImage: { enabled: false },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || "",
    },
  },
});
