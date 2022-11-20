import { fileURLToPath } from 'node:url'

import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  installModule, addPlugin
} from '@nuxt/kit'

export * from './types'

export interface ModuleOptions {
  css: any;
  toasterOptions: any
}

const runtimeDir = fileURLToPath(
  new URL('../src/runtime', import.meta.url)
)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'gigcodes-nuxt',
    configKey: 'gigcodesNuxt'
  },
  defaults: {
    css: true,
    toasterOptions: {
      hello: 'asd'
    }
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await addComponentsDir({ path: resolve('./runtime/components/button') })
    await addComponentsDir({ path: resolve('./runtime/components/dossier') })

    nuxt.options.runtimeConfig.app.__TOASTER_OPTIONS__ = options.toasterOptions!
    addPlugin({ src: resolve('./runtime/plugins') })

    await installModule('@nuxtjs/tailwindcss', {
      /**
       * Here, you specify where your config is.
       * By default, the module have a configPath relative
       * to the current path, ie the playground !
       * (or the app using your module)
       */
      configPath: resolve(runtimeDir, 'tailwind.config')
    })

    nuxt.options.build.transpile.push(runtimeDir)

    if (options.css) {
      nuxt.options.css.push(resolve(runtimeDir, 'sass/tailwind.scss'))
    }
  }
})
