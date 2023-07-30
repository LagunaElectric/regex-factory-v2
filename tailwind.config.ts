import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

export default <Partial<Config>>{
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}", "./nuxt.config.{js,ts}", "content/**/**.md"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          dark: {
            500: "#403838",
            700: "#2c2525",
            800: "#211c1c",
            900: "#191515",
            border: "#72696A",
            icon: "#FFF0F3",
            active: "#5B5353",
          },
          light: {
            700: "#FDF6E3",
            900: "#F4EDDA",
            border: "#DDD3B7",
            icon: "#363430",
            active: "#D5C9B2",
          },
        },
      },
      screens: {
        xxs: "320px",
        xs: "475px",
        md: "856px",
      },
      fontFamily: {
        mono: ["Operator Mono", "Fira Code", ...defaultTheme.fontFamily.mono],
        brand: ["Fira Sans"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
