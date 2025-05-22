<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">📋 Attendance Import</h2>

    <AttendanceUpload @update:data="handleDataUpdate" />

    <v-btn color="success" class="mb-4" @click="submitToBackend">
      Submit to Server
    </v-btn>

    <!-- Filters -->
    <v-row dense class="mb-4">
      <v-col cols="12" sm="4" md="3">
        <v-text-field
          v-model="search"
          label="Search by ID"
          prepend-inner-icon="mdi-magnify"
          outlined dense
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="selectedStatus"
          :items="['All', 'On Time', 'Late', 'Absent']"
          label="Status"
          outlined dense clearable
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="selectedShift"
          :items="['All', 'Day Shift', 'Night Shift']"
          label="Shift"
          outlined dense clearable
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-text-field
          v-model="selectedDate"
          label="Filter by Date"
          type="date"
          outlined dense
        />
      </v-col>
    </v-row>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="filteredAttendance"
      :items-per-page="10"
      class="elevation-1"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" dark>{{ item.status }}</v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from '@/utils/axios'
import dayjs from 'dayjs'
import AttendanceUpload from '@/components/AttendanceUpload.vue'

const attendanceList = ref([])

const search = ref('')
const selectedStatus = ref('All')
const selectedShift = ref('All')
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

const headers = [
  { text: 'Employee ID', value: 'employeeId' },
  { text: 'Timestamp', value: 'timestamp' },
  { text: 'Status', value: 'status' },
  { text: 'Shift', value: 'shift' },
  { text: 'Day', value: 'date' }
]

const statusColor = (status) => {
  switch (status) {
    case 'On Time': return 'green'
    case 'Late': return 'orange'
    case 'Absent': return 'red'
    default: return 'grey'
  }
}

const handleDataUpdate = (data) => {
  attendanceList.value = data
}

const submitToBackend = async () => {
  if (!attendanceList.value.length) return

  try {
    await axios.post('/api/attendance/import', {
      records: attendanceList.value
    })
    alert('✅ Attendance imported successfully')
    await fetchAttendance()
  } catch (err) {
    alert('❌ Import failed')
    console.error(err)
  }
}

const fetchAttendance = async () => {
  try {
    const res = await axios.get('/api/attendance', {
      params: { date: selectedDate.value }
    })
    attendanceList.value = res.data
  } catch (err) {
    console.error('Fetch failed', err)
  }
}

const filteredAttendance = computed(() => {
  return attendanceList.value.filter(item => {
    const matchID = item.employeeId.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = selectedStatus.value === 'All' || item.status === selectedStatus.value
    const matchShift = selectedShift.value === 'All' || item.shift === selectedShift.value
    const matchDate = selectedDate.value === '' || item.date === selectedDate.value
    return matchID && matchStatus && matchShift && matchDate
  })
})

onMounted(() => {
  fetchAttendance()
})
</script>
