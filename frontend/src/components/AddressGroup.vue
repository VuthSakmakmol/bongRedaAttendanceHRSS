<!-- <template>
  <v-card class="pa-4 mb-4" elevation="1" style="background-color: #fafafa;">
    <div class="text-subtitle-1 font-weight-medium mb-2">Address Information</div>

    <v-row dense class="address-row">
      <v-col cols="12" md="6" lg="3" style="min-width: 220px;">
        <v-autocomplete
          class="w-100"
          :items="provinces"
          :model-value="province"
          @update:model-value="val => $emit('update:province', val)"
          label="Province"
          placeholder="Select or type province"
          item-title="provinceNameKh"
          item-value="provinceNameKh"
          clearable
          outlined
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="6" lg="3" style="min-width: 220px;">
        <v-autocomplete
          class="w-100"
          :items="districts"
          :model-value="district"
          @update:model-value="val => $emit('update:district', val)"
          label="District"
          placeholder="Select or type district"
          item-title="districtNameKh"
          item-value="districtNameKh"
          clearable
          outlined
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="6" lg="3" style="min-width: 220px;">
        <v-autocomplete
          class="w-100"
          :items="communes"
          :model-value="commune"
          @update:model-value="val => $emit('update:commune', val)"
          label="Commune"
          placeholder="Select or type commune"
          item-title="communeNameKh"
          item-value="communeNameKh"
          clearable
          outlined
          density="comfortable"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="6" lg="3" style="min-width: 220px;">
        <v-text-field
          class="w-100"
          :model-value="village"
          @update:model-value="val => $emit('update:village', val)"
          label="Village"
          placeholder="Enter village"
          outlined
          density="comfortable"
          hide-details
        />
      </v-col>
    </v-row>
  </v-card>
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

</style> -->
