import { fileURLToPath } from 'node:url'
const srcDir = fileURLToPath(new URL('../', import.meta.url))
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    srcDir + '/**/*.{js,ts,vue}'
  ],
  theme: {

  },
  variants: {
    extend: {}
  }
}
