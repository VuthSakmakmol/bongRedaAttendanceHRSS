<template>
  <v-container>
    <h2 class="text-h6 font-weight-bold mb-4">Employee Management</h2>

    <div class="d-flex align-center justify-space-between mb-4">
      <v-btn color="primary" @click="toggleForm">{{ showForm ? 'Hide Form' : 'Add Employee' }}</v-btn>
      <div class="d-flex gap-2">
        <v-btn color="error" :disabled="!selected.length" @click="deleteSelected">Delete</v-btn>
        <v-btn color="success" :disabled="!selected.length" @click="exportToExcel">Export Excel</v-btn>
      </div>
    </div>


    <v-expand-transition>
      <v-form v-show="showForm" @submit.prevent="submitForm">
        <v-row dense>
          <!-- Basic Info -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.employeeId" label="Employee ID" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.name" label="English Name" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.khmerName" label="Khmer Name" variant="outlined" dense hide-details required />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-select v-model="form.gender" :items="['Male', 'Female', 'Other']" label="Gender" variant="outlined" dense hide-details />
          </v-col>

          <!-- Contact and Job Info -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.email" label="Email / Phone Number" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-autocomplete v-model="form.department" :items="departmentList" label="Department" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-autocomplete v-model="form.position" :items="filteredJobTitles" label="Position" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-select v-model="form.shift" :items="shiftOptions" label="Shift" variant="outlined" dense hide-details />
          </v-col>

          <!-- Dates -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.dob" label="Date of Birth" type="date" variant="outlined" dense hide-details required />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.joinDate" label="Join Date" type="date" variant="outlined" dense hide-details required />
          </v-col>

          <!-- Government IDs -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field
              v-model="form.nssf"
              label="NSSF (15 digits)"
              variant="outlined" dense hide-details
              maxlength="15"
              counter="15"
              required
              :rules="[
                v => !!v || 'NSSF is required',
                v => /^\d{15}$/.test(v) || 'Must be exactly 15 digits'
              ]"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.idCard" label="ID Card" variant="outlined" dense hide-details required />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.idCardExpireDate" label="Id Card Expiry Date" type="date" variant="outlined" dense hide-details />
          </v-col>

          <!-- Passport/Visa -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.passport" label="Passport" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.passportExpireDate" label="Passport Expiry Date" type="date" variant="outlined" dense hide-details />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.visaExpireDate" label="Visa Expiry Date" type="date" variant="outlined" dense hide-details />
          </v-col>

          <!-- Other -->
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.healthCheck" label="Health Check" variant="outlined" dense hide-details required />
          </v-col>
          <v-col cols="12" sm="6" md="4" lg="2">
            <v-text-field v-model="form.workingBook" label="Working Book" variant="outlined" dense hide-details />
          </v-col>

          <v-row dense>
          <!-- Address Cards -->
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4 h-100">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-2 font-weight-bold">Place of Birth</span>
              </div>
              <v-row dense>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfBirth.province" :items="provinceOptions" item-title="name" item-value="name" label="Province" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfBirth.district" :items="birthDistrictOptions" item-title="name" item-value="name" label="District" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfBirth.commune" :items="birthCommuneOptions" item-title="name" item-value="name" label="Commune" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="form.placeOfBirth.village" label="Village" variant="outlined" dense hide-details clearable />
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4 h-100">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="text-subtitle-2 font-weight-bold">Place of Living</span>
                <v-switch v-model="form.sameAddress" label="Same as Birth" color="primary" inset hide-details />
              </div>
              <v-row dense>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfLiving.province" :items="provinceOptions" item-title="name" item-value="name" label="Province" :disabled="form.sameAddress" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfLiving.district" :items="livingDistrictOptions" item-title="name" item-value="name" label="District" :disabled="form.sameAddress" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-autocomplete v-model="form.placeOfLiving.commune" :items="livingCommuneOptions" item-title="name" item-value="name" label="Commune" :disabled="form.sameAddress" variant="outlined" dense hide-details clearable />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="form.placeOfLiving.village" label="Village" :disabled="form.sameAddress" variant="outlined" dense hide-details clearable />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-row>

        <v-btn type="submit" color="success" class="mt-4" block>
          {{ editMode ? 'Update' : 'Submit' }} Employee
        </v-btn>
      </v-form>
    </v-expand-transition>

    <v-text-field
      v-model="search"
      label="Search employees"
      prepend-inner-icon="mdi-magnify"
      outlined dense class="mb-4 mt-4"
    />

    <v-card>
      <div class="table-scroll-wrapper">
        <table class="scrollable-table">
          <thead class="sticky-header">
            <tr>
              <th colspan="21" class="text-center">Employee Information</th>
              <th colspan="4" class="text-center">Place of Birth</th>
              <th colspan="4" class="text-center">Place of Living</th>
              <th colspan="1" class="text-center">Actions</th>
            </tr>
            <tr>
              <th><v-checkbox v-model="selectAll" @change="toggleSelectAll" hide-details /></th>
              <th>Employee ID</th>
              <th>English Name</th>
              <th>Khmer Name</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Email / Phone Number</th>
              <th>Department</th>
              <th>Position</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Remark</th>
              <th>Join Date</th>
              <th>NSSF</th>
              <th>ID-Card</th>
              <th>ID-Card Expire Date</th>
              <th>Passport</th>
              <th>Passport Expire Date</th>
              <th>Visa Expire Date</th>
              <th>Health Check</th>
              <th>Working Book</th>
              <th>Province</th>
              <th>District</th>
              <th>Commune</th>
              <th>Village</th>
              <th>Province</th>
              <th>District</th>
              <th>Commune</th>
              <th>Village</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="emp in paginatedEmployees" :key="emp._id">
              <td><v-checkbox v-model="selected" :value="emp._id" hide-details /></td>
              <td>{{ emp.employeeId }}</td>
              <td>{{ emp.name }}</td>
              <td>{{ emp.khmerName }}</td>
              <td>{{ emp.gender }}</td>
              <td>{{ formatDate(emp.dob) }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.department }}</td>
              <td>{{ emp.position }}</td>
              <td>{{ emp.shift }}</td>

              <td>
                <v-chip
                  :color="statusColor(emp.status)"
                  class="text-white font-weight-medium"
                  size="small"
                  @click="openStatusDialog(emp)"
                  style="cursor: pointer"
                >
                  {{ emp.status }}
                </v-chip>
              </td>

              <td>
                <v-tooltip location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      density="compact"
                      size="small"
                      @click="openRemarkDialog(emp)"
                    >
                      <v-icon :color="emp.remark ? 'orange' : ''">mdi-note-text</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ emp.remark || 'No remark' }}</span>
                </v-tooltip>
              </td>
              <td>{{ formatDate(emp.joinDate) }}</td>
              <td>{{ emp.nssf }}</td>
              <td>{{ emp.idCard }}</td>
              <td>{{ formatDate(emp.idCardExpireDate) }}</td>
              <td>{{ emp.passport }}</td>
              <td>{{ formatDate(emp.passportExpireDate) }}</td>
              <td>{{ formatDate(emp.visaExpireDate) }}</td>
              <td>{{ emp.healthCheck }}</td>
              <td>{{ emp.workingBook }}</td>

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

              <!-- Action -->
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
            :items="itemsPerPageOptions"
            label="Per page"
            hide-details
            density="compact"
            style="min-width: 120px;"
            item-title="title"
            item-value="value"
          />
        </v-col>
      </v-row>


      <!-- Status -->
      <v-dialog v-model="statusDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Update Status</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Select Status"
              outlined
              hide-details
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="statusDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveStatus">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <!-- Remark Dialog -->
      <v-dialog v-model="remarkDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h6">Edit Remark</v-card-title>
          <v-card-text>
            <v-textarea v-model="currentRemark" label="Remark" rows="4" outlined />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="remarkDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveRemark">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/utils/axios'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'

const provinceOptions = ref([])
const birthDistrictOptions = ref([])
const birthCommuneOptions = ref([])
const livingDistrictOptions = ref([])
const livingCommuneOptions = ref([])



const formatDate = (val) => {
  return val ? dayjs(val).format('DD-MMM-YYYY') : ''
}


// Form
const form = ref({
  employeeId: '',
  name: '',
  khmerName: '',
  gender: '',
  dob: '',
  email: '',
  department: '',
  position: '',
  shift: 'Day Shift',
  status: 'Working',
  remark: '',
  joinDate: '',
  nssf: '',
  idCard: '',
  idCardExpireDate: '',
  passport: '',
  passportExpireDate: '',
  visaExpireDate: '',
  healthCheck: '',
  workingBook: '',
  sameAddress: true,
  placeOfBirth: { province: '', district: '', commune: '', village: '' },
  placeOfLiving: { province: '', district: '', commune: '', village: '' },
  
})


const statusOptions = [
  'Working',
  'Resign',
  'Terminate',
  'Abandon',
  'Pass Away',
  'Retirement'
];
const statusColor = (status) => {
  switch (status) {
    case 'Working': return 'green'
    case 'Resign': return 'orange'
    case 'Terminate': return 'red'
    case 'Abandon': return 'deep-orange'
    case 'Pass Away': return 'grey'
    case 'Retirement': return 'indigo'
    default: return 'blue-grey'
  }
}


// State
const employees = ref([])
const selected = ref([])
const selectAll = ref(false)
const showForm = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const search = ref('')
const departments = ref([])
const departmentList = ref([])

// Remark dialog
const remarkDialog = ref(false)
const currentRemark = ref('')
const currentEmployee = ref(null)

// Status dialog
const statusDialog = ref(false)
const selectedStatus = ref('')
const currentEmployeeForStatus = ref(null)

// Shift Option
const shiftOptions = ['Day Shift', 'Night Shift']

// Pagination
const page = ref(parseInt(localStorage.getItem('employeePage') || '1'))
const itemsPerPage = ref(parseInt(localStorage.getItem('employeeItemsPerPage') || '10'))

const itemsPerPageOptions = [10, 20, 30, 50, 100, { title: 'All', value: -1 }]

watch(page, val => {
  localStorage.setItem('employeePage', val)
})

watch(itemsPerPage, val => {
  localStorage.setItem('employeeItemsPerPage', val)
})


const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

form.value = {
  employeeId: '',
  name: '',
  khmerName: '',
  gender: '',
  dob: '',
  email: '',
  department: '',
  position: '',
  shift: 'Day Shift',
  status: 'Working',
  remark: '' ,
  joinDate: '',
  nssf: '',
  idCard: '',
  idCardExpireDate: '',
  passport: '',
  passportExpireDate: '',
  visaExpireDate: '',
  healthCheck: '',
  workingBook: '',
  sameAddress: true,
  placeOfBirth: { province: '', district: '', commune: '', village: '' },
  placeOfLiving: { province: '', district: '', commune: '', village: '' },

  
           
}


// FETCH ALL PROVINCES ON LOAD
const fetchProvinces = async () => {
  try {
    const res = await axios.get('/api/locations/provinces')
    provinceOptions.value = res.data
  } catch (err) {
    console.error('Error fetching provinces:', err)
  }
}
watch(() => form.value.placeOfBirth.province, async () => {
  form.value.placeOfBirth.district = ''
  form.value.placeOfBirth.commune = ''
  await fetchBirthDistricts()
}, { deep: true })

watch(() => form.value.placeOfBirth.district, async () => {
  form.value.placeOfBirth.commune = ''
  await fetchBirthCommunes()
}, { deep: true })

watch(() => form.value.placeOfLiving.province, async () => {
  if (!form.value.sameAddress) {
    form.value.placeOfLiving.district = ''
    form.value.placeOfLiving.commune = ''
    await fetchLivingDistricts()
  }
})

watch(() => form.value.placeOfLiving.district, async () => {
  if (!form.value.sameAddress) {
    form.value.placeOfLiving.commune = ''
    await fetchLivingCommunes()
  }
})



// Status
const openStatusDialog = (emp) => {
  currentEmployeeForStatus.value = emp
  selectedStatus.value = emp.status
  statusDialog.value = true
}

const saveStatus = async () => {
  try {
    await axios.put(`/employees/${currentEmployeeForStatus.value._id}`, {
      status: selectedStatus.value
    })
    currentEmployeeForStatus.value.status = selectedStatus.value
    statusDialog.value = false
    Swal.fire('Updated', 'Status updated', 'success')
  } catch (err) {
    Swal.fire('Error', 'Failed to update status', 'error')
  }
}

// Remark
const openRemarkDialog = (emp) => {
  currentEmployee.value = emp
  currentRemark.value = emp.remark || ''
  remarkDialog.value = true
}

const saveRemark = async () => {
  try {
    await axios.put(`/employees/${currentEmployee.value._id}`, {
      remark: currentRemark.value
    })
    currentEmployee.value.remark = currentRemark.value
    remarkDialog.value = false
    Swal.fire('Success', 'Remark saved', 'success')
  } catch (err) {
    Swal.fire('Error', 'Failed to save remark', 'error')
  }
}





const fetchEmployees = async () => {
  const res = await axios.get('/employees')
  employees.value = res.data.reverse()
}
const fetchDepartments = async () => {
  const res = await axios.get('/api/departments')
  departments.value = res.data
  departmentList.value = res.data.map(d => d.name)
}

// Computed
const filteredEmployees = computed(() =>
  employees.value.filter(e =>
    (e.name + e.department + e.position + e.employeeId).toLowerCase().includes(search.value.toLowerCase())
  )
)
const filteredJobTitles = computed(() => {
  const dept = departments.value.find(d => d.name === form.value.department)
  return dept ? dept.jobTitles : []
})
const paginatedEmployees = computed(() => {
  if (itemsPerPage.value === -1) {
    return filteredEmployees.value // show all
  }
  const start = (page.value - 1) * itemsPerPage.value
  return filteredEmployees.value.slice(start, start + itemsPerPage.value)
})

// Helpers
const mapKh = (a) => ({
  provinceNameKh: a.province || '',
  districtNameKh: a.district || '',
  communeNameKh: a.commune || '',
  villageNameKh: a.village || ''
})


const reverseMap = (a) => ({
  province: a?.provinceNameKh || '',
  district: a?.districtNameKh || '',
  commune: a?.communeNameKh || '',
  village: a?.villageNameKh || ''
})
const submitForm = async () => {
  // Sync address ONLY when submitting and sameAddress is true
  if (form.value.sameAddress) {
    form.value.placeOfLiving = { ...form.value.placeOfBirth }
  }

  const payload = {
    employeeId: form.value.employeeId,
    name: form.value.name,
    khmerName: form.value.khmerName,
    gender: form.value.gender,
    dob: form.value.dob,
    email: form.value.email,
    department: form.value.department,
    position: form.value.position,
    shift: form.value.shift,
    status: form.value.status,
    remark: form.value.remark,
    joinDate: form.value.joinDate,
    nssf: form.value.nssf,
    idCard: form.value.idCard,
    idCardExpireDate: form.value.idCardExpireDate,
    passport: form.value.passport,
    passportExpireDate: form.value.passportExpireDate,
    visaExpireDate: form.value.visaExpireDate || null,
    healthCheck: form.value.healthCheck,
    workingBook: form.value.workingBook,
    placeOfBirth: mapKh(form.value.placeOfBirth),
    placeOfLiving: mapKh(form.value.placeOfLiving),
  }

  try {
    if (editMode.value) {
      await axios.put(`/employees/${editingId.value}`, payload)
      Swal.fire('Updated!', 'Employee updated successfully', 'success')
    } else {
      await axios.post('/employees', payload)
      Swal.fire('Created!', 'New employee added', 'success')
    }

    await fetchEmployees()
    page.value = 1
    editMode.value = false
    editingId.value = null
    toggleForm()
  } catch (e) {
    console.error('Submission error:', e.response?.data || e.message)
    Swal.fire('Error', 'Failed to save', 'error')
  }
}



const resetForm = () => {
  form.value = {
    employeeId: '',
    name: '',
    khmerName: '',
    gender: '',
    dob: '',
    email: '',
    department: '',
    position: '',
    shift: 'Day Shift',
    status: 'Working',
    joinDate: '',
    nssf: '',
    idCard: '',
    idCardExpireDate: '',
    passport: '',
    passportExpireDate: '',
    visaExpireDate: '',
    healthCheck: '',
    workingBook: '',
    sameAddress: true,
    placeOfBirth: { province: '', district: '', commune: '', village: '' },
    placeOfLiving: { province: '', district: '', commune: '', village: '' },
    remark: ''
  }
}
import { nextTick } from 'vue'
const fetchBirthDistricts = async () => {
  const province = form.value.placeOfBirth.province
       console.log('▶️ Watcher triggered: placeOfBirth.province')
  if (province) {
    const res = await axios.get('/api/locations/districts', { params: { province } })
    birthDistrictOptions.value = res.data

  }
}

const fetchBirthCommunes = async () => {
  const { province, district } = form.value.placeOfBirth
  if (province && district) {
    const res = await axios.get('/api/locations/communes', { params: { province, district } })
    birthCommuneOptions.value = res.data
  }
}

const fetchLivingDistricts = async () => {
  const province = form.value.placeOfLiving.province
   console.log('▶️ Watcher triggered: placeOfLiving.province')
  if (province) {
    const res = await axios.get('/api/locations/districts', { params: { province } })
    livingDistrictOptions.value = res.data
  }
}

const fetchLivingCommunes = async () => {
  const { province, district } = form.value.placeOfLiving
  if (province && district) {
    const res = await axios.get('/api/locations/communes', { params: { province, district } })
    livingCommuneOptions.value = res.data
  }
}


const editEmployee = async (e) => {
  // STEP 1: Force sameAddress false FIRST
  form.value.sameAddress = false

  // STEP 2: Assign values
  form.value = {
    employeeId: e.employeeId,
    name: e.name,
    khmerName: e.khmerName,
    gender: e.gender,
    dob: e.dob || '',
    email: e.email,
    department: e.department,
    position: e.position,
    shift: e.shift || 'Day Shift',
    status: e.status || 'Working',
    remark: e.remark || '',
    joinDate: e.joinDate || '',
    nssf: e.nssf || '',
    idCard: e.idCard || '',
    idCardExpireDate: e.idCardExpireDate || '',
    passport: e.passport || '',
    passportExpireDate: e.passportExpireDate || '',
    visaExpireDate: e.visaExpireDate || '',
    healthCheck: e.healthCheck || '',
    workingBook: e.workingBook || '',
    sameAddress: false, // TEMPORARILY false
    placeOfBirth: {
      province: e.placeOfBirth?.provinceNameKh || '',
      district: e.placeOfBirth?.districtNameKh || '',
      commune: e.placeOfBirth?.communeNameKh || '',
      village: e.placeOfBirth?.villageNameKh || ''
    },
    placeOfLiving: {
      province: e.placeOfLiving?.provinceNameKh || '',
      district: e.placeOfLiving?.districtNameKh || '',
      commune: e.placeOfLiving?.communeNameKh || '',
      village: e.placeOfLiving?.villageNameKh || ''
    }
  }

  // STEP 3: Wait for reactivity
  await nextTick()

  // STEP 4: Fetch birth
  await fetchBirthDistricts()
  await fetchBirthCommunes()

  // STEP 5: Fetch living
  await fetchLivingDistricts()
  await fetchLivingCommunes()

  // STEP 6: NOW enable sameAddress if values match
  const isSame =
    JSON.stringify(form.value.placeOfBirth) === JSON.stringify(form.value.placeOfLiving)

  if (isSame) {
    form.value.sameAddress = true
  }

  

  // STEP 7: Setup edit mode
  editingId.value = e._id
  showForm.value = true
  editMode.value = true

  await nextTick()
  const formEl = document.querySelector('.form-grid')
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' })
}


const deleteEmployee = async (id) => {
  if (await Swal.fire({ title: 'Confirm delete?', showCancelButton: true }).then(r => r.isConfirmed)) {
    await axios.delete(`/employees/${id}`)
    fetchEmployees()
  }
}
const deleteSelected = async () => {
  if (await Swal.fire({ title: 'Delete selected?', showCancelButton: true }).then(r => r.isConfirmed)) {
    await Promise.all(selected.value.map(id => axios.delete(`/employees/${id}`)))
    selected.value = []
    selectAll.value = false
    fetchEmployees()
  }
}

const updateStatus = async (emp) => {
  try {
    await axios.put(`/employees/${emp._id}`, { status: emp.status })
    Swal.fire('Updated', 'Status updated', 'success')
  } catch (err) {
    Swal.fire('Error', 'Failed to update status', 'error')
  }
}



const exportToExcel = () => {
  const selectedData = employees.value.filter(e => selected.value.includes(e._id))

  const rows = selectedData.map(e => [
    e.employeeId,
    e.name,
    e.khmerName,
    e.gender,
    formatDate(e.dob),
    e.email,
    e.department,
    e.position,
    e.shift,
    e.status,
    e.remark,
    formatDate(e.joinDate),
    e.nssf,
    e.idCard,
    e.passport,
    formatDate(e.visaExpireDate),
    e.healthCheck,
    e.workingBook,
    e.placeOfBirth?.provinceNameKh,
    e.placeOfBirth?.districtNameKh,
    e.placeOfBirth?.communeNameKh,
    e.placeOfBirth?.villageNameKh,
    e.placeOfLiving?.provinceNameKh,
    e.placeOfLiving?.districtNameKh,
    e.placeOfLiving?.communeNameKh,
    e.placeOfLiving?.villageNameKh
  ])

  const headerRow1 = [
    'Employee Info', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'Place of Birth', '', '', '',
    'Place of Living', '', '', ''
  ]

  const headerRow2 = [
    'Employee ID', 'English Name', 'Khmer Name', 'Gender', 'Date of Birth', 'Email / Phone Number', 'Department', 'Position',
    'Shift', 'Status', 'Remark', 'Join Date', 'NSSF', 'ID Card', 'Passport', 'Visa Expiry Date',
    'Health Check', 'Working Book',
    'Province', 'District', 'Commune', 'Village',
    'Province', 'District', 'Commune', 'Village'
  ]

  const ws = XLSX.utils.aoa_to_sheet([headerRow1, headerRow2, ...rows])

  // Merge headers: Adjust column ranges to match actual layout
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },  // Employee Info = 18 cols
    { s: { r: 0, c: 18 }, e: { r: 0, c: 21 } }, // Place of Birth = 4 cols
    { s: { r: 0, c: 22 }, e: { r: 0, c: 25 } }  // Place of Living = 4 cols
  ]

  ws['!cols'] = new Array(26).fill({ wch: 18 }) // Adjust all 26 columns

  XLSX.writeFile({
    Sheets: { 'Employees': ws },
    SheetNames: ['Employees']
  }, 'employees_export.xlsx')
}



// Auto-sync
watch(() => form.value.sameAddress, val => {
  if (val) form.value.placeOfLiving = { ...form.value.placeOfBirth }
})
watch(() => form.value.placeOfBirth, val => {
  if (form.value.sameAddress) form.value.placeOfLiving = { ...val }
}, { deep: true })

const toggleSelectAll = () => {
  selected.value = selectAll.value ? employees.value.map(e => e._id) : []
}

onMounted(() => {
  fetchEmployees()
  fetchDepartments()
  fetchProvinces()
})
</script>


<style scoped>

body {
  font-family: 'Khmer OS Siemreap', sans-serif;
}

/* Grid layout for form */
.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.full-span {
  grid-column: span 4;
}

.v-container {
  max-width: 100% !important;
  padding-left: 24px;
  padding-right: 24px;
}

/* Ensure the outer wrapper scrolls */
.table-scroll-wrapper {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
}

/* Table layout settings */
.scrollable-table {
  min-width: max-content;
  white-space: nowrap;
  border-collapse: separate; /* Required for sticky headers in some browsers */
  border-spacing: 0;
}

/* All cells: basic borders and padding */
.scrollable-table th,
.scrollable-table td {
  white-space: nowrap;
  padding: 8px 12px;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background-color: white;
  z-index: 1;
}

/* Make first header row sticky */
.scrollable-table thead tr:first-child th {
  position: sticky;
  top: 0;
  z-index: 3;
  background-color: #d1e2f4;
  font-weight: 600;
  text-align: center;
}

/* Make second header row sticky below the first */
.scrollable-table thead tr:nth-child(2) th {
  position: sticky;
  top: 42px; /* Match the height of the first row */
  z-index: 2;
  background-color: #d1e2f4;
  font-weight: 600;
  text-align: center;
}

/* Optional: fix border issues on last column */
.scrollable-table th:last-child,
.scrollable-table td:last-child {
  border-right: none;
}

/* Sticky pagination at bottom */
.pagination-wrapper {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 10;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

@media (max-width: 600px) {
  .form-grid {
    font-size: 0.9rem;
  }
  .v-card {
    padding: 8px !important;
  }
}

</style>

