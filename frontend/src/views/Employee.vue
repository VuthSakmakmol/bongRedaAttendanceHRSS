<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-4">Employee Management</h2>

    <!-- Actions -->
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn color="primary" @click="toggleForm">{{ showForm ? 'Hide Form' : 'Add Employee' }}</v-btn>
      <div class="d-flex gap-2">
        <v-btn color="error" :disabled="!selected.length" @click="deleteSelected">Delete</v-btn>
        <v-btn color="success" :disabled="!selected.length" @click="exportToExcel">Export Excel</v-btn>
      </div>
    </div>

    <!-- Form -->
    <v-expand-transition>
      <v-form v-show="showForm" @submit.prevent="submitForm" class="form-grid">
        <v-text-field v-model="form.name" label="Name" outlined dense hide-details />
        <v-text-field v-model="form.email" label="Email" outlined dense hide-details />
        <v-autocomplete
          v-model="form.department"
          :items="departmentList"
          label="Department"
          outlined dense hide-details
        />
        <v-autocomplete
          v-model="form.position"
          :items="filteredJobTitles"
          label="Job Title"
          outlined dense hide-details
        />

        <!-- Address Groups -->
        <div class="full-span d-flex flex-wrap gap-4">
          <div class="flex-1">
            <div class="text-subtitle-2 font-weight-bold mb-1">Place of Birth</div>
            <AddressGroup
              :province="form.placeOfBirth.province"
              :district="form.placeOfBirth.district"
              :commune="form.placeOfBirth.commune"
              :village="form.placeOfBirth.village"
              @update:province="val => form.placeOfBirth.province = val"
              @update:district="val => form.placeOfBirth.district = val"
              @update:commune="val => form.placeOfBirth.commune = val"
              @update:village="val => form.placeOfBirth.village = val"
            />
          </div>

          <div class="d-flex align-center justify-center" style="width: 120px;">
            <v-switch v-model="form.sameAddress" label="Same" color="primary" inset />
          </div>

          <div class="flex-1">
            <div class="text-subtitle-2 font-weight-bold mb-1">Place of Living</div>
            <AddressGroup
              :province="form.placeOfLiving.province"
              :district="form.placeOfLiving.district"
              :commune="form.placeOfLiving.commune"
              :village="form.placeOfLiving.village"
              :disabled="form.sameAddress"
              @update:province="val => form.placeOfLiving.province = val"
              @update:district="val => form.placeOfLiving.district = val"
              @update:commune="val => form.placeOfLiving.commune = val"
              @update:village="val => form.placeOfLiving.village = val"
            />
          </div>
        </div>

        <v-btn type="submit" color="success" class="full-span mt-4" block>
          {{ editMode ? 'Update' : 'Submit' }} Employee
        </v-btn>
      </v-form>
    </v-expand-transition>

    <!-- Search -->
    <v-text-field
      v-model="search"
      label="Search employees"
      prepend-inner-icon="mdi-magnify"
      outlined dense class="mb-4"
    />

    <!-- Table -->
    <v-card>
      <v-table density="compact">
        <thead>
          <tr>
            <th rowspan="2"><v-checkbox v-model="selectAll" @change="toggleSelectAll" hide-details /></th>
            <th rowspan="2">Name</th>
            <th rowspan="2">Position</th>
            <th rowspan="2">Department</th>
            <th colspan="4">Place of Birth</th>
            <th colspan="4">Place of Living</th>
            <th rowspan="2">Actions</th>
          </tr>
          <tr>
            <th>ខេត្ត</th><th>ស្រុក</th><th>សង្កាត់</th><th>ភូមិ</th>
            <th>ខេត្ត</th><th>ស្រុក</th><th>សង្កាត់</th><th>ភូមិ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredEmployees" :key="emp._id">
            <td><v-checkbox v-model="selected" :value="emp._id" hide-details /></td>
            <td>{{ emp.name }}</td>
            <td>{{ emp.position }}</td>
            <td>{{ emp.department }}</td>
            <td>{{ emp.placeOfBirth?.provinceNameKh }}</td>
            <td>{{ emp.placeOfBirth?.districtNameKh }}</td>
            <td>{{ emp.placeOfBirth?.communeNameKh }}</td>
            <td>{{ emp.placeOfBirth?.villageNameKh }}</td>
            <td>{{ emp.placeOfLiving?.provinceNameKh }}</td>
            <td>{{ emp.placeOfLiving?.districtNameKh }}</td>
            <td>{{ emp.placeOfLiving?.communeNameKh }}</td>
            <td>{{ emp.placeOfLiving?.villageNameKh }}</td>
            <td>
              <v-btn size="x-small" icon @click="editEmployee(emp)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn size="x-small" icon color="error" @click="deleteEmployee(emp._id)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
      <v-row class="d-flex justify-end align-center mt-4" no-gutters>
  <v-col cols="auto">
    <v-pagination
      v-model="page"
      :length="Math.ceil(filteredEmployees.length / itemsPerPage)"
      total-visible="5"
      density="comfortable"
      rounded
    />
  </v-col>

  <v-col cols="auto" class="ml-2">
    <v-select
      v-model="itemsPerPage"
      :items="itemsPerPageOptions"
      label="Per page"
      hide-details
      density="compact"
      style="min-width: 120px; max-width: 160px;"
    />
  </v-col>
</v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from '@/utils/axios'
import Swal from 'sweetalert2'
import AddressGroup from '@/components/AddressGroup.vue'
import * as XLSX from 'xlsx'

const showForm = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const search = ref('')
const employees = ref([])
const selected = ref([])
const selectAll = ref(false)
//pagination
const page = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = [10, 20, 30, 50, 100]
// Pagination slice
const paginatedEmployees = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  return filteredEmployees.value.slice(start, start + itemsPerPage.value)
})

//department
const departments = ref([])
const departmentList = ref([])
const form = ref({
  name: '', email: '', department: '', position: '', sameAddress: true,
  placeOfBirth: { province: '', district: '', commune: '', village: '' },
  placeOfLiving: { province: '', district: '', commune: '', village: '' }
})

const filteredEmployees = computed(() =>
  employees.value.filter(emp =>
    (emp.name + emp.position + emp.department).toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredJobTitles = computed(() => {
  const dep = departments.value.find(d => d.name === form.value.department)
  return dep ? dep.jobTitles : []
})

const fetchEmployees = async () => {
  const res = await axios.get('/employees')
  employees.value = res.data
}

const fetchDepartments = async () => {
  const res = await axios.get('api/departments')
  departments.value = res.data
  departmentList.value = res.data.map(d => d.name)
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  form.value = {
    name: '', email: '', department: '', position: '', sameAddress: true,
    placeOfBirth: { province: '', district: '', commune: '', village: '' },
    placeOfLiving: { province: '', district: '', commune: '', village: '' }
  }
  editMode.value = false
  editingId.value = null
}

const mapKh = (a) => ({
  provinceNameKh: a.province,
  districtNameKh: a.district,
  communeNameKh: a.commune,
  villageNameKh: a.village
})
const reverseMap = (a) => ({
  province: a?.provinceNameKh || '',
  district: a?.districtNameKh || '',
  commune: a?.communeNameKh || '',
  village: a?.villageNameKh || ''
})

const submitForm = async () => {
  const payload = {
    name: form.value.name,
    email: form.value.email,
    department: form.value.department,
    position: form.value.position,
    placeOfBirth: mapKh(form.value.placeOfBirth),
    placeOfLiving: mapKh(form.value.placeOfLiving)
  }
  try {
    if (editMode.value) {
      await axios.put(`/employees/${editingId.value}`, payload)
      Swal.fire('Updated', '', 'success')
    } else {
      await axios.post('/employees', payload)
      Swal.fire('Created', '', 'success')
    }
    fetchEmployees()
    resetForm()
    showForm.value = false
  } catch (err) {
    Swal.fire('Error', 'Failed to save', 'error')
  }
}

const editEmployee = emp => {
  form.value = {
    name: emp.name,
    email: emp.email,
    department: emp.department,
    position: emp.position,
    sameAddress: false,
    placeOfBirth: reverseMap(emp.placeOfBirth),
    placeOfLiving: reverseMap(emp.placeOfLiving)
  }
  editingId.value = emp._id
  editMode.value = true
  showForm.value = true
}

const deleteEmployee = async id => {
  if (await Swal.fire({ title: 'Delete?', showCancelButton: true }).then(r => r.isConfirmed)) {
    await axios.delete(`/employees/${id}`)
    fetchEmployees()
  }
}

const deleteSelected = async () => {
  if (!selected.value.length) return
  if (await Swal.fire({ title: 'Delete selected?', showCancelButton: true }).then(r => r.isConfirmed)) {
    await Promise.all(selected.value.map(id => axios.delete(`/employees/${id}`)))
    selected.value = []
    selectAll.value = false
    fetchEmployees()
  }
}

const toggleSelectAll = () => {
  selected.value = selectAll.value ? employees.value.map(e => e._id) : []
}

watch(() => form.value.sameAddress, val => {
  if (val) form.value.placeOfLiving = { ...form.value.placeOfBirth }
})
watch(() => form.value.placeOfBirth, val => {
  if (form.value.sameAddress) form.value.placeOfLiving = { ...val }
}, { deep: true })

const exportToExcel = () => {
  const selectedData = employees.value.filter(e => selected.value.includes(e._id))
  const rows = selectedData.map(e => [
    e.placeOfBirth?.provinceNameKh, e.placeOfBirth?.districtNameKh, e.placeOfBirth?.communeNameKh, e.placeOfBirth?.villageNameKh,
    e.placeOfLiving?.provinceNameKh, e.placeOfLiving?.districtNameKh, e.placeOfLiving?.communeNameKh, e.placeOfLiving?.villageNameKh,
    e.name, e.email
  ])
  const ws = XLSX.utils.aoa_to_sheet([
    ['Place of Birth', '', '', '', 'Place of Living', '', '', '', 'Name', 'Email'],
    ['ខេត្ត','ស្រុក','សង្កាត់','ភូមិ','ខេត្ត','ស្រុក','សង្កាត់','ភូមិ','',''],
    ...rows
  ])
  ws['!merges'] = [
    { s: { r:0,c:0 }, e:{ r:0,c:3 } },
    { s: { r:0,c:4 }, e:{ r:0,c:7 } },
    { s: { r:0,c:8 }, e:{ r:1,c:8 } },
    { s: { r:0,c:9 }, e:{ r:1,c:9 } }
  ]
  XLSX.writeFile({ Sheets: { Sheet1: ws }, SheetNames: ['Sheet1'] }, 'employees.xlsx')
}

onMounted(() => {
  fetchEmployees()
  fetchDepartments()
})
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.full-span {
  grid-column: span 4;
}
th {
  background-color: #f0f4f8;
  font-weight: 600;
  text-align: center;
}

.v-container {
  max-width: 100% !important;
  padding-left: 24px !important;
  padding-right: 24px !important;
}
.v-table {
  width: 100%;
  overflow-x: auto;
}

.per-page-select .v-field__input {
  padding-left: 8px;
}


</style>
