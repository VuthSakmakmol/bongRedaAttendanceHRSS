<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-4">Employee Management</h2>

    <!-- Action Bar -->
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
        <v-text-field v-model="form.name" label="Name" outlined rounded dense hide-details />
        <v-text-field v-model="form.email" label="Email" outlined rounded dense hide-details />
        <v-select v-model="form.position" :items="['Manager','Technician','Operator']" label="Position" outlined rounded dense hide-details />
        <v-autocomplete v-model="form.department" :items="['HR','IT','Logistics','Production']" label="Department" outlined rounded dense hide-details />

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
                <v-switch
                v-model="form.sameAddress"
                label="Same"
                color="primary"
                inset
                />
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
    <v-text-field v-model="search" label="Search employees" prepend-inner-icon="mdi-magnify" outlined rounded dense class="mb-4" />

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

                <!-- Place of Birth -->
                <td>{{ emp.placeOfBirth?.provinceNameKh }}</td>
                <td>{{ emp.placeOfBirth?.districtNameKh }}</td>
                <td>{{ emp.placeOfBirth?.communeNameKh }}</td>
                <td>{{ emp.placeOfBirth?.villageNameKh }}</td>

                <!-- Place of Living -->
                <td>{{ emp.placeOfLiving?.provinceNameKh }}</td>
                <td>{{ emp.placeOfLiving?.districtNameKh }}</td>
                <td>{{ emp.placeOfLiving?.communeNameKh }}</td>
                <td>{{ emp.placeOfLiving?.villageNameKh }}</td>

                <!-- Actions -->
                <td>
                <v-btn size="x-small" icon @click="editEmployee(emp)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn size="x-small" icon color="error" @click="deleteEmployee(emp._id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                </td>
            </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/utils/axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import AddressGroup from '@/components/AddressGroup.vue'


// States
const showForm = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const search = ref('')
const employees = ref([])
const selected = ref([])
const selectAll = ref(false)

const form = ref({
  name: '', email: '', position: '', department: '', sameAddress: true,
  placeOfBirth: { province: '', district: '', commune: '', village: '' },
  placeOfLiving: { province: '', district: '', commune: '', village: '' }
})

// Computed
const filteredEmployees = computed(() =>
  employees.value.filter(emp =>
    (emp.name + emp.email + emp.position + emp.department)
      .toLowerCase().includes(search.value.toLowerCase())
  )
)

// Functions
const fetchEmployees = async () => {
  const res = await axios.get('/employees')
  employees.value = res.data
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  form.value = {
    name: '', email: '', position: '', department: '', sameAddress: true,
    placeOfBirth: { province: '', district: '', commune: '', village: '' },
    placeOfLiving: { province: '', district: '', commune: '', village: '' }
  }
  editMode.value = false
  editingId.value = null
}

const mapKh = addr => ({
  provinceNameKh: addr.province,
  districtNameKh: addr.district,
  communeNameKh: addr.commune,
  villageNameKh: addr.village
})

const reverseMap = addr => ({
  province: addr?.provinceNameKh || '',
  district: addr?.districtNameKh || '',
  commune: addr?.communeNameKh || '',
  village: addr?.villageNameKh || ''
})

const submitForm = async () => {
  const payload = {
    name: form.value.name,
    email: form.value.email,
    position: form.value.position,
    department: form.value.department,
    placeOfBirth: mapKh(form.value.placeOfBirth),
    placeOfLiving: mapKh(form.value.placeOfLiving)
  }
  try {
    if (editMode.value) {
      await axios.put(`/employees/${editingId.value}`, payload)
      Swal.fire('Updated', 'Employee updated!', 'success')
    } else {
      await axios.post('/employees', payload)
      Swal.fire('Created', 'Employee added!', 'success')
    }
    fetchEmployees()
    resetForm()
    showForm.value = false
  } catch (err) {
    Swal.fire('Error', 'Something went wrong', 'error')
  }
}

const editEmployee = emp => {
  form.value = {
    name: emp.name,
    email: emp.email,
    position: emp.position,
    department: emp.department,
    sameAddress: false,
    placeOfBirth: reverseMap(emp.placeOfBirth),
    placeOfLiving: reverseMap(emp.placeOfLiving)
  }
  editingId.value = emp._id
  editMode.value = true
  showForm.value = true
}

const deleteEmployee = async id => {
  if (await Swal.fire({ title: 'Confirm delete?', showCancelButton: true }).then(r => r.isConfirmed)) {
    await axios.delete(`/employees/${id}`)
    fetchEmployees()
    Swal.fire('Deleted!', '', 'success')
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

// Auto-fill living address when 'sameAddress' is true
watch(() => form.value.sameAddress, (val) => {
  if (val) {
    form.value.placeOfLiving = { ...form.value.placeOfBirth }
  }
})

watch(() => form.value.placeOfBirth, (newVal) => {
  if (form.value.sameAddress) {
    form.value.placeOfLiving = { ...newVal }
  }
}, { deep: true })

const toggleSelectAll = () => {
  selected.value = selectAll.value ? employees.value.map(e => e._id) : []
}

const exportToExcel = () => {
  const data = employees.value.filter(e => selected.value.includes(e._id))
  const headerRow1 = ['Place of Birth', '', '', '', 'Place of Living', '', '', '', 'Name', 'Email']
  const headerRow2 = ['ខេត្ត', 'ស្រុក', 'សង្កាត់', 'ភូមិ', 'ខេត្ត', 'ស្រុក', 'សង្កាត់', 'ភូមិ', '', '']

  const bodyRows = data.map(e => [
    e.placeOfBirth?.provinceNameKh || '',
    e.placeOfBirth?.districtNameKh || '',
    e.placeOfBirth?.communeNameKh || '',
    e.placeOfBirth?.villageNameKh || '',
    e.placeOfLiving?.provinceNameKh || '',
    e.placeOfLiving?.districtNameKh || '',
    e.placeOfLiving?.communeNameKh || '',
    e.placeOfLiving?.villageNameKh || '',
    e.name,
    e.email
  ])

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, ...bodyRows])
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
    { s: { r: 0, c: 8 }, e: { r: 1, c: 8 } },
    { s: { r: 0, c: 9 }, e: { r: 1, c: 9 } }
  ]
  worksheet['!cols'] = new Array(10).fill({ wch: 18 })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, worksheet, 'Employees')
  XLSX.writeFile(wb, 'employees_structured.xlsx')
}

onMounted(fetchEmployees)
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
.nested-address-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  text-align: center;
}
.nested-address-table th,
.nested-address-table td {
  border: 1px solid #ccc;
  padding: 4px;
}
.nested-address-table th {
  background: #f2f2f2;
  font-weight: 600;
}
.gap-2 > * {
  margin-left: 8px;
}
th, td {
  text-align: center;
  vertical-align: middle;
}
th {
  background-color: #d8e4f6; /* Soft light gray */
  font-weight: 600;
  color: #333;
  text-align: center;
  padding: 8px;
}

</style>
