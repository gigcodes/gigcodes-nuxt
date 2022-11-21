import { defineNuxtPlugin } from '#app'
import event from '../addons/events'
import hasError from './hasError'
import { ProgressBar, progress } from './progress'

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component('ProgressBar', ProgressBar)
  return {
    provide: {
      event,
      progress,
      errorHandler: hasError
    }
  }
})
