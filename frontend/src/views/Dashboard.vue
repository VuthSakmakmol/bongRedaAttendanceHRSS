<template>
    <v-container fluid class="pa-4">
      <h2 class="text-h5 font-weight-bold">Welcome, {{ user?.username || 'Admin' }}</h2>
      <p>Email: {{ user?.email }}</p>
      <v-btn color="error" @click="logout">Logout</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const user = JSON.parse(localStorage.getItem('user'))
  
  const logout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }
  </script>
  