<template>
  <v-container class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Add New Village</h2>

    <v-form @submit.prevent="createVillage">
      <v-select
        v-model="form.province"
        :items="provinces"
        label="Province (Khmer)"
        item-title="provinceNameKh"
        item-value="provinceNameKh"
        @update:modelValue="filterDistricts"
        required
      />

      <v-select
        v-model="form.district"
        :items="filteredDistricts"
        label="District (Khmer)"
        item-title="districtNameKh"
        item-value="districtNameKh"
        @update:modelValue="filterCommunes"
        required
      />

      <v-select
        v-model="form.commune"
        :items="filteredCommunes"
        label="Commune (Khmer)"
        item-title="communeNameKh"
        item-value="communeNameKh"
        required
      />

      <v-text-field
        v-model="form.village"
        label="New Village Name (Khmer)"
        required
      />

      <v-btn color="primary" type="submit" class="mt-4">Save Village</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import Swal from 'sweetalert2'

const form = ref({
  province: '',
  district: '',
  commune: '',
  village: ''
})

const allLocations = ref([])
const provinces = ref([])
const filteredDistricts = ref([])
const filteredCommunes = ref([])

const fetchLocations = async () => {
  const res = await axios.get('/api/locationkh') // or fetch all if no API, load from mock
  allLocations.value = res.data

  // Unique provinces
  provinces.value = Array.from(
    new Map(res.data.map(loc => [loc.provinceNameKh, loc])).values()
  )
}

const filterDistricts = () => {
  const province = form.value.province
  filteredDistricts.value = Array.from(
    new Map(
      allLocations.value
        .filter(loc => loc.provinceNameKh === province)
        .map(loc => [loc.districtNameKh, loc])
    ).values()
  )
  form.value.district = ''
  form.value.commune = ''
  filteredCommunes.value = []
}

const filterCommunes = () => {
  const district = form.value.district
  filteredCommunes.value = Array.from(
    new Map(
      allLocations.value
        .filter(loc =>
          loc.provinceNameKh === form.value.province &&
          loc.districtNameKh === district
        )
        .map(loc => [loc.communeNameKh, loc])
    ).values()
  )
  form.value.commune = ''
}

const createVillage = async () => {
  try {
    await axios.post('/villages', {
      provinceNameKh: form.value.province,
      districtNameKh: form.value.district,
      communeNameKh: form.value.commune,
      villageNameKh: form.value.village
    })
    Swal.fire('Success', 'Village saved!', 'success')
    form.value.village = ''
  } catch (err) {
    Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error')
  }
}

onMounted(fetchLocations)
</script>
