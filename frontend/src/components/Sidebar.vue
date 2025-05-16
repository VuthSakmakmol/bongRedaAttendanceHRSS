<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    width="250"
    temporary
  >
    <!-- Logo / App Title -->
    <!-- <v-list-item class="d-flex justify-space-between align-center">
      <v-list-item-title class="text-h6 font-weight-bold">Attendance</v-list-item-title>
    </v-list-item> -->

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
import { useRouter } from 'vue-router'

const drawer = ref(false) // Start closed
const router = useRouter()

const navItems = [
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Employee', to: '/employee', icon: 'mdi-account-group' }
]

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

<style scoped>
.v-navigation-drawer {
  transition: all 0.3s ease;
}
</style>
