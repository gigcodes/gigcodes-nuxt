<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" class="relative z-10" @close="$emit('cancel')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                v-if="title"
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                {{ title }}
              </DialogTitle>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ body }}
                </p>
              </div>

              <div class="mt-4">
                <div class="flex flex-wrap justify-end space-x-2">
                  <Btn type="tertiary" @click.stop="$emit('cancel')">
                    {{ cancelText }}
                  </Btn>
                  <btn type="danger" :loading="loading" @click="$emit('confirm')">
                    {{ deleteText }}
                  </btn>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { withDefaults } from 'vue'
import Btn from '../button/btn.vue'

interface ModalEmits {
  (eventName: 'cancel'): void

  (eventName: 'confirm'): void
}

interface ModalProps {
  open: boolean,
  loading?: boolean,
  title?: string | null,
  body?: string | null
  deleteText?: string
  cancelText?: string
}

withDefaults(defineProps<ModalProps>(), {
  open: false,
  loading: false,
  title: null,
  body: null,
  deleteText: 'Delete',
  cancelText: 'Cancel'
})

defineEmits<ModalEmits>()

</script>
