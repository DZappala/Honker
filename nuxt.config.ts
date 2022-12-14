export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
      },
    },
  },
  imports: {
    dirs: ["~/types"],
  },
  app: {
    head: {
      title: "Honker",
      meta: [
        {
          name: "description",
          content: "A Twitter clone built with Nuxt.js and Supabase",
        },
        {
          name: "author",
          content: "Dominic Zappala",
        },
        {
          name: "keywords",
          content: "nuxt, supabase, twitter, clone",
        },
      ],
      noscript: [
        {
          innerHTML: "This website requires JavaScript.",
        },
      ],
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
