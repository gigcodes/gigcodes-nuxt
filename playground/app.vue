<template>
  <div>
    <btn type="primary" @click="log">
      Hello
    </btn>
    <dossier-table collection="sample" :get-api="getApi" />
  </div>
</template>

<script setup>

import { useNuxtApp } from 'nuxt/app'
import axios from 'axios'

const log = () => $event.$emit('hello')

const { $event } = useNuxtApp()

$event.$on('hello', () => {
  // eslint-disable-next-line no-console
  console.log('hello')
})

const getApi = params => axios.get('http://localhost:8000/api/account-list', { params })

</script>
