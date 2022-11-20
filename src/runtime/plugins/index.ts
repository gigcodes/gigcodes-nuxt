import { defineNuxtPlugin } from '#app'
import event from '../addons/events'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      event
    }
  }
})
