// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "@huntersofbook/naive-ui-nuxt",
    "@nuxt/devtools",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
  ],

  build: {
    transpile: [
      "trpc-nuxt",
    ],
  },

  typescript: {
    shim: false,
  },

  devtools: {
    enabled: true,
  },
  googleFonts: {
    families: {
      "Fira+Code": true,
      "Fira+Sans": true,
    },
  },
  colorMode: {
    classSuffix: "",
  },
  tailwindcss: {
    exposeConfig: true,
  },
})
