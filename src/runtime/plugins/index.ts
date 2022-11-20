import { defineNuxtPlugin } from '#app'
import event from '../addons/events'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      event
    }
  }
})
