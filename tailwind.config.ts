import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionDelay: {
        '50': '50ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '350': '350ms',
        '400': '400ms',
        '450': '450ms',
        '500': '500ms',
        '550': '550ms',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
    },
  },
  plugins: [],
};

export default config;