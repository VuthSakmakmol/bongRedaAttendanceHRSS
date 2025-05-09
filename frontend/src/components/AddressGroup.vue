<template>
  <div class="address-group d-flex flex-wrap gap-2">
    <!-- Province -->
    <v-select
      :items="provinces"
      :model-value="province"
      @update:model-value="val => $emit('update:province', val)"
      label="Province"
      item-title="provinceNameKh"
      item-value="provinceNameKh"
      density="compact"
      hide-details
      outlined
      class="w-25"
    />

    <!-- District -->
    <v-select
      :items="districts"
      :model-value="district"
      @update:model-value="val => $emit('update:district', val)"
      label="District"
      item-title="districtNameKh"
      item-value="districtNameKh"
      density="compact"
      hide-details
      outlined
      class="w-25"
    />

    <!-- Commune -->
    <v-select
      :items="communes"
      :model-value="commune"
      @update:model-value="val => $emit('update:commune', val)"
      label="Commune"
      item-title="communeNameKh"
      item-value="communeNameKh"
      density="compact"
      hide-details
      outlined
      class="w-25"
    />

    <!-- Village (manual input) -->
    <v-text-field
      :model-value="village"
      @update:model-value="val => $emit('update:village', val)"
      label="Village"
      density="compact"
      hide-details
      outlined
      class="w-25"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from '@/utils/axios'

// Props from parent
const props = defineProps({
  province: String,
  district: String,
  commune: String,
  village: String
})

const emit = defineEmits(['update:province', 'update:district', 'update:commune', 'update:village'])

const provinces = ref([])
const districts = ref([])
const communes = ref([])

// Load provinces on mount
axios.get('/locationkh/provinces').then(res => {
  provinces.value = res.data
})

// Watch and load districts
watch(() => props.province, (newVal) => {
  if (!newVal) return
  emit('update:district', '') // reset
  emit('update:commune', '')
  axios.get('/locationkh/districts', { params: { province: newVal } }).then(res => {
    districts.value = res.data
  })
})

// Watch and load communes
watch(() => props.district, (newVal) => {
  if (!newVal) return
  emit('update:commune', '')
  axios.get('/locationkh/communes', { params: { district: newVal } }).then(res => {
    communes.value = res.data
  })
})
</script>

<style scoped>
.address-group {
  flex-wrap: wrap;
}
.w-25 {
  width: 24%;
}
</style>
