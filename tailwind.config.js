import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: { fontFamily: {
    
      body: "Quicksand",

      primary: "Quicksand",
      "sf-pro-text": "'SF Pro Text'",
    },
    backgroundColor:'#F6F6F6',
    fontSize: {
      "3xl": "22px",
      "sm-5": "13.5px",
      xs: "12px",
      mid: "17px",
      base: "16px",
      mini: "15px",
      "6xl": "25px",
      xl: "20px",
      inherit: "inherit",
    },},
  },
  darkMode: "class",
  plugins: [nextui()],
}
