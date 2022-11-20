<template>
  <div class="loading">
    <span class="icon icon-circular-graph animation-spin" />
    {{ text }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text:string
}>()
</script>
