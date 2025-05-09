<template>
  <v-app>
    <Sidebar v-if="isLoggedIn" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import { computed } from 'vue'

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('user')
})
</script>
