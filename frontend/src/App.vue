<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
      <v-toolbar-title>Attendance System</v-toolbar-title>
    </v-app-bar>

    <!-- ✅ Attach Sidebar here -->
    <Sidebar v-model="drawer" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from '@/layouts/AppSidebar.vue'

const drawer = ref(false) // ✅ ADD THIS

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('user')
})
</script>
