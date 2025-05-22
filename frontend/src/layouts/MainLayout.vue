<template>
  <v-app>
    <AppSidebar />
    <v-main class="main-wrapper">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import AppSidebar from '@/layouts/AppSidebar.vue'
</script>

<style scoped>
.main-wrapper {
  padding: 0 !important;
  background-color: #f5f5f5;
}
</style>
