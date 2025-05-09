<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    expand-on-hover
    width="250"
  >
    <!-- Logo / App Title -->
    <v-list-item>
      <v-list-item-title class="text-h6 font-weight-bold">Attendance</v-list-item-title>
    </v-list-item>

    <v-divider />

    <!-- Menu Items -->
    <v-list dense nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        link
        exact
        :active-class="'text-primary'"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-spacer />

    <!-- Auth Action -->
    <v-list nav dense class="mt-auto">
      <v-list-item @click="handleAuth">
        <v-list-item-icon>
          <v-icon>{{ isLoggedIn ? 'mdi-logout' : 'mdi-login' }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ isLoggedIn ? 'Log Out' : 'Log In' }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const drawer = ref(true)
const router = useRouter()
const route = useRoute()

const navItems = [
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Employee', to: '/employee', icon: 'mdi-account-group' }
]

// Check login status (can use localStorage or token)
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('user')
})

const handleAuth = () => {
  if (isLoggedIn.value) {
    localStorage.removeItem('user')
    router.push('/login')
  } else {
    router.push('/login')
  }
}
</script>
