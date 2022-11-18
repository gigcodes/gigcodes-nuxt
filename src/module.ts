import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  installModule
} from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gigcodes-nuxt',
    configKey: 'gigcodesNuxt'
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addComponentsDir({ path: resolve('./runtime/components/button') })
    installModule('@nuxtjs/tailwindcss', {
      cssPath: resolve('./runtime/assets/css/tailwind.css'),
      viewer: false,
      config: {
        content: [resolve('./runtime/**/*.{vue,js,ts,jsx,tsx}')],
        theme: {
          extend: {
            boxShadow: {
              DEFAULT:
                '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
              md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
              lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
              xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)'
            }
          }
        }
      }
    })
  }
})
