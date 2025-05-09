<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
      <v-card class="pa-5" elevation="5" max-width="400">
        <v-card-title class="text-h6 font-weight-bold">Admin Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field v-model="form.email" label="Email" type="email" required />
            <v-text-field v-model="form.password" label="Password" type="password" required />
  
            <v-btn block color="primary" :loading="loading" type="submit">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import Swal from 'sweetalert2'
  import api from '@/utils/axios'
  
  const router = useRouter()
  
  const form = ref({
    email: '',
    password: ''
  })
  
  const loading = ref(false)
  
  const login = async () => {
    loading.value = true
    try {
      const res = await api.post('/auth/login', form.value)
      localStorage.setItem('user', JSON.stringify(res.data.user))
  
      await Swal.fire('Success', 'Login successful', 'success')
      router.push('/dashboard')
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Login failed', 'error')
    } finally {
      loading.value = false
    }
  }
  </script>
  