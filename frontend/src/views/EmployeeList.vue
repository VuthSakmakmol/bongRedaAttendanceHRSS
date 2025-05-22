<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Employee Management</h2>

    <!-- Top Bar -->
    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn color="primary" @click="$router.push('/employee/register')">Add Employee</v-btn>
      <div class="d-flex gap-2">
        <v-btn color="error" :disabled="!selected.length" @click="deleteSelected">Delete</v-btn>
        <v-btn color="success" :disabled="!selected.length" @click="exportToExcel">Export Excel</v-btn>
      </div>
    </div>

    <!-- Search -->
    <v-text-field
      v-model="search"
      label="Search employees"
      prepend-inner-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    />

    <!-- Table -->
    <v-card>
      <div class="table-scroll-wrapper">
        <table class="scrollable-table">
          <thead>
            <!-- Group Headers -->
            <tr>
              <th colspan="11" class="text-center">Core Identity</th>
              <th colspan="5" class="text-center">Detail Identity</th>
              <th colspan="4" class="text-center">Place of Birth</th>
              <th colspan="4" class="text-center">Place of Living</th>
              <th colspan="9" class="text-center">Responsibility</th>
              <th colspan="9" class="text-center">Document</th>
              <th colspan="7" class="text-center">Skills</th>
              <th class="text-center">Actions</th>
            </tr>
            <!-- Column Labels -->
            <tr>
              <th><v-checkbox v-model="selectAll" @change="toggleSelectAll" hide-details /></th>
              <th v-for="field in headerFields" :key="field.value">{{ field.label }}</th>
              <th>Action</th>
            </tr>
            <!-- Filters -->
            <tr>
              <th></th>
              <th v-for="field in headerFields" :key="field.value">
                <v-autocomplete
                  v-model="filters[field.value]"
                  :items="getUniqueValues(field.value)"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                  class="filter-field"
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in paginatedEmployees" :key="emp._id">
              <td><v-checkbox v-model="selected" :value="emp._id" hide-details /></td>
              <td v-for="field in headerFields" :key="field.value">
                <template v-if="field.value === 'status'">
                  <v-chip
                    :color="statusColor(getNestedValue(emp, field.value))"
                    class="text-white font-weight-medium"
                    size="small"
                  >
                    {{ getNestedValue(emp, field.value) }}
                  </v-chip>
                </template>
                <template v-else-if="field.value === 'remark'">
                  <v-tooltip location="top">
                    <template #activator="{ props }">
                      <v-btn v-bind="props" variant="text" density="compact" size="small">
                        <v-icon :color="getNestedValue(emp, field.value) ? 'orange' : ''">mdi-note-text</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ getNestedValue(emp, field.value) || 'No remark' }}</span>
                  </v-tooltip>
                </template>
                <template v-else-if="isDateField(field.value)">
                  {{ formatDate(getNestedValue(emp, field.value)) }}
                </template>
                <template v-else>
                  {{ getNestedValue(emp, field.value) }}
                </template>
              </td>
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
        </table>
      </div>

      <!-- Pagination -->
      <v-row class="pagination-wrapper d-flex justify-end align-center mt-4 px-4">
        <v-col cols="auto">
          <v-pagination
            v-model="page"
            :length="Math.ceil(filteredEmployees.length / itemsPerPage)"
            total-visible="5"
            density="comfortable"
            rounded
          />
        </v-col>
        <v-col cols="auto">
          <v-select
            v-model="itemsPerPage"
            :items="[10, 20, 50, { title: 'All', value: -1 }]"
            label="Per page"
            hide-details
            density="compact"
            style="min-width: 120px"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/utils/axios' // or 'axios'

const showForm = ref(false)
const search = ref('')
const selected = ref([])
const selectAll = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)
const employees = ref([])

const headerFields = [
  { label: 'Employee ID', value: 'employeeId' },
  { label: 'Khmer Name', value: 'khmerName' },
  { label: 'Latin Name', value: 'latinName' },
  { label: 'Gender', value: 'gender' },
  { label: 'Date of Birth', value: 'dob' },
  { label: 'Age', value: 'age' },
  { label: 'Email', value:'email'},
  { label: 'Phone Number', value:'phoneNumber'},
  { label: 'Agent Phone Number', value:'agentPhoneNumber'},
  { label: 'Agent Person', value:'agentPerson'},


  { label: 'Married Status', value:'marriedStatus'},
  { label: 'Spouse Name', value:'spouseName'},
  { label: 'Spouse Contact Number', value:'spouseContactNumber'},
  { label: 'Education', value:'education'},
  { label: 'Religion', value:'religion'},
  { label: 'Province', value: 'placeOfBirth.provinceNameKh' },
  { label: 'District', value: 'placeOfBirth.districtNameKh' },
  { label: 'Commune', value: 'placeOfBirth.communeNameKh' },
  { label: 'Village', value: 'placeOfBirth.villageNameKh' },
  { label: 'Province', value: 'placeOfLiving.provinceNameKh' },
  { label: 'District', value: 'placeOfLiving.districtNameKh' },
  { label: 'Commune', value: 'placeOfLiving.communeNameKh' },
  { label: 'Village', value: 'placeOfLiving.villageNameKh' },


  { label: 'Join Date', value: 'joinDate' },
  { label: 'Department', value: 'department' },
  { label: 'Position', value: 'position' },
  { label: 'Line', value: 'line'},
  { label: 'Team', value: 'team'},
  { label: 'Section', value: 'section'},
  { label: 'Shift', value: 'shift' },
  { label: 'Status', value: 'status' },
  { label: 'Remark', value: 'remark' },


  { label: 'ID Card', value: 'idCard' },
  { label: 'ID Expiry', value: 'idCardExpireDate' },
  { label: 'NSSF', value: 'nssf' },
  { label: 'Passport', value: 'passport' },
  { label: 'Passport Expiry', value: 'passportExpireDate' },
  { label: 'Visa Expiry', value: 'visaExpireDate' },
  { label: 'Medical Check', value: 'medicalCheck' },
  { label: 'Medical Check Date', value: 'medicalCheckDate'},
  { label: 'Working Book', value: 'workingBook' },
  

  { label: 'Source of Hiring', value: 'sourceOfHiring'},
  { label: 'Intoducer ID', value: 'introducerId'},
  { label: 'Employee ID', value: 'employeeType'},
  { label: 'Single Needle', value: 'singleNeedle'},
  { label: 'Over Lock', value: 'overlock'},
  { label: 'Over Stitch', value: 'coverstitch'},
  { label: 'Total Machine', value: 'totalMachine'},
  
]


const filters = ref({})
headerFields.forEach(field => filters.value[field.value] = '')

const getUniqueValues = (key) => {
  const keys = key.split('.')
  return [...new Set(employees.value.map(e => keys.reduce((obj, k) => obj?.[k], e)).filter(Boolean))].sort()
}

const getNestedValue = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj)
const isDateField = (field) => field.toLowerCase().includes('date') || ['dob', 'joinDate'].includes(field)

const formatDate = val => val ? new Date(val).toLocaleDateString() : ''
const statusColor = status => ({
  Working: 'green',
  Resign: 'orange',
  Terminate: 'red',
  Abandon: 'deep-orange',
  'Pass Away': 'grey',
  Retirement: 'indigo'
}[status] || 'blue-grey')

const filteredEmployees = computed(() =>
  employees.value.filter(emp =>
    Object.entries(filters.value).every(([key, val]) => {
      const result = getNestedValue(emp, key)
      return !val || String(result ?? '').toLowerCase().includes(val.toLowerCase())
    }) &&
    (emp.name + emp.employeeId + emp.department + emp.position).toLowerCase().includes(search.value.toLowerCase())
  )
)

const paginatedEmployees = computed(() => {
  if (itemsPerPage.value === -1) return filteredEmployees.value
  const start = (page.value - 1) * itemsPerPage.value
  return filteredEmployees.value.slice(start, start + itemsPerPage.value)
})

const toggleForm = () => (showForm.value = !showForm.value)
const toggleSelectAll = () => {
  selected.value = selectAll.value ? employees.value.map(e => e._id) : []
}

const editEmployee = (emp) => {}
const deleteEmployee = async (id) => {}
const deleteSelected = async () => {}
const exportToExcel = () => {}

onMounted(async () => {
  try {
    const res = await axios.get('/api/employees')
    employees.value = res.data
  } catch (err) {
    console.error('Failed to load employees:', err)
  }
})
</script>

<style scoped>
.table-scroll-wrapper {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
}
.scrollable-table {
  min-width: max-content;
  white-space: nowrap;
  border-collapse: separate;
  border-spacing: 0;
}
.scrollable-table th,
.scrollable-table td {
  white-space: nowrap;
  padding: 8px 12px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background-color: white;
  z-index: 1;
}
.scrollable-table thead tr:first-child th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #d1e2f4;
  font-weight: 600;
  text-align: center;
}
.scrollable-table thead tr:nth-child(2) th {
  position: sticky;
  top: 42px;
  z-index: 2;
  background-color: #d1e2f4;
}
.scrollable-table thead tr:nth-child(3) th {
  position: sticky;
  top: 84px;
  z-index: 2;
  background-color: #f5f7fa;
}
.pagination-wrapper {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 10;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}
.filter-field {
  min-width: 120px;
  font-size: 12px;
}
</style>



