<template>
  <span :class="{ 'has-status-icon': index === 0 }">
    <span
      v-if="index === 0"
      class="status"
      :class="item.published ? 'status-live' : 'status-hidden'"
      :title="item.published ? 'Published' : 'Draft'"
    />
    <a
      v-if="
        column.link &&
          !column.custom_link &&
          (item.can_edit === undefined || item.can_edit === true)
      "
      href="javascript:void(0)"
      class="has-status-icon"
      @click.prevent="$emit('goTo',(item.edit_url))"
    >
      {{ value }}
    </a>
    <a
      v-else-if="column.link && column.custom_link"
      href="javascript:void(0)"
      class="has-status-icon"
      @click.prevent="$emit('goTo',(item[column.custom_link]))"
    >
      {{ value }}
    </a>
    <template v-else>
      {{ value }}
    </template>
  </span>
</template>

<script setup lang="ts">
import { columnType, rowType } from '../../../types'

interface CellEmits {
  (eventName: 'goTo'): void
}

interface CellProps {
  index: number,
  item: rowType,
  value: string,
  column: columnType
}

defineEmits<CellEmits>()
defineProps<CellProps>()
</script>
