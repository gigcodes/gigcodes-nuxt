<template>
  <div>
    <div v-if="name" class="flex items-center justify-between">
      <label
        class="block text-sm font-medium"
        :for="id"
      >{{ name }} <span v-if="required" class="text-red-500">*</span></label>
    </div>

    <div v-if="suffix || prefix" class="relative">
      <input
        :id="id"
        class="form-input w-full"
        :type="type"
        :value="modelValue"
        :autofocus="autofocus"
        :required="required"
        :readonly="readonly"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="className"
        @input="updateInput"
        @keyup="$emit('keyup', $event)"
        @blur="$emit('blur', $event)"
        @change="$emit('change', $event)"
      >
      <div
        class="absolute inset-0 left-auto flex items-center pointer-events-none"
        :class="prefix ? 'right-auto' : 'left-auto'"
      >
        <span
          v-if="!hasIcon"
          class="text-sm text-gray-400 font-medium px-3"
        >{{ suffix }} {{ prefix }}</span>
        <div v-else :class="hasIcon">
          <slot name="icon" />
        </div>
      </div>
    </div>

    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :autofocus="autofocus"
      :required="required"
      :readonly="readonly"
      :placeholder="placeholder"
      :disabled="disabled"
      class="form-input w-full"
      :class="className"
      @input="updateInput"
      @keyup="$emit('keyup', $event)"
      @blur="$emit('blur', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    >
  </div>
  <div v-if="help" class="text-xs mt-1">
    {{ help }}
  </div>
  <div v-if="hasSuccess" class="text-xs mt-1 text-green-500">
    {{ hasSuccess }}
  </div>
  <div v-if="hasError" class="text-xs mt-1 text-red-500">
    {{ hasError }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import slugify from 'slugify'

interface EmitInterface {
  (eventName: 'update:modelValue', value: string | number): HTMLInputElement

  (eventName: 'update:slug', value: string): void

  (eventName: 'keyup'): void

  (eventName: 'blur'): void

  (eventName: 'change'): void

  (eventName: 'focus'): void
}

interface PropsInterface {
  disabled?: boolean
  hasError?: boolean
  hasSuccess?: boolean
  readonly?: boolean
  suffix?: string
  prefix?: string
  modelValue?: string | number
  placeholder?: string | number
  required?: boolean
  autofocus?: boolean
  type?: string
  id?: string | number
  help?: string
  hasIcon?: boolean
  inputClass?: string
  slugify?: boolean
  name?: string
  slug?: string
}

const emit = defineEmits<EmitInterface>()
const props = defineProps<PropsInterface>()

const updateInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
  (props.slugify) && emit('update:slug', slugify((event.target as HTMLInputElement).value))
}

const className = computed(() => {
  let classes = ''
  if (props.disabled) {
    classes =
      classes +
      'disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed '
  }
  if (props.hasError) {
    classes = classes + 'border-red-300 '
  }
  if (props.hasSuccess) {
    classes = classes + 'border-green-300 '
  }
  if (props.suffix) {
    classes = classes + 'pr-8 '
  }
  if (props.prefix) {
    classes = classes + ' '
  }

  return classes + props.inputClass
})
</script>
