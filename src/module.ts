import { fileURLToPath } from 'node:url'

import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  installModule, addPlugin
} from '@nuxt/kit'

export * from './types'

export interface ModuleOptions {
}

const runtimeDir = fileURLToPath(
  new URL('../src/runtime', import.meta.url)
)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gigcodes-nuxt',
    configKey: 'gigcodesNuxt'
  },
  async setup (_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await addComponentsDir({ path: resolve('./runtime/components/button') })
    await addComponentsDir({ path: resolve('./runtime/components/dossier') })
    await addComponentsDir({ path: resolve('./runtime/components/fieldtypes') })
    await addComponentsDir({ path: resolve('./runtime/components/others') })

    addPlugin({ src: resolve('./runtime/plugins') })

    await installModule('@nuxtjs/tailwindcss', {
      configPath: resolve(runtimeDir, 'tailwind.config')
    })

    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.css.push(resolve(runtimeDir, 'sass/tailwind.scss'))
  }
})
