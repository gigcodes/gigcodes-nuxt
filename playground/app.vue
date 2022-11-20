<template>
  <div>
    <progress-bar />
    <btn type="primary" @click="log">
      Hello
    </btn>
    <dossier-table collection="sample" :get-api="getApi" />
    <text-field v-model="content" v-model:slug="slug" name="hello" slugify @blur="log" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from 'nuxt/app'
import axios from 'axios'

const content = ref('')
const slug = ref('')

const log = data => console.log(data)

const {
  $event,
  $progress
} = useNuxtApp()

$event.$on('hello', () => {
  // eslint-disable-next-line no-console
  console.log('hello')
})

const getApi = params => axios.get('http://localhost:8000/api/account-list', { params })

</script>
