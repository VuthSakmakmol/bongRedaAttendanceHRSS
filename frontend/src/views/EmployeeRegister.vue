<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">🧍 Employee Registration</h2>

    <!-- ✅ Progress Bar -->
    <v-progress-linear
      :model-value="completionPercentage"
      color="primary"
      height="8"
      class="mb-4"
      striped
      rounded
      :indeterminate="false"
    >
      <strong>{{ completionPercentage }}%</strong>
    </v-progress-linear>

    <!-- ✅ Dynamic Step Form -->
    <component :is="stepComponents[step - 1]" v-model:form="form" />

    <!-- ✅ Navigation Buttons -->
    <v-row justify="space-between" class="mt-4">
      <v-btn :disabled="step === 1" @click="step--" variant="outlined">Back</v-btn>

      <v-btn color="primary" @click="handleStepSubmit">
        {{ step === stepComponents.length ? 'Finish' : 'Next' }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'

import Step1 from '@/components/EmployeeSteps/Step1CoreIdentity.vue'
import Step2 from '@/components/EmployeeSteps/Step2DetailIdentity.vue'
import Step3 from '@/components/EmployeeSteps/Step3Responsibility.vue'
import Step4 from '@/components/EmployeeSteps/Step4Document.vue'
import Step5 from '@/components/EmployeeSteps/Step5Skills.vue'

const route = useRoute()
const router = useRouter()
const step = ref(1)
const employeeId = ref(route.query.id || null)

const stepComponents = [Step1, Step2, Step3, Step4, Step5]

const form = ref({
  employeeId: '',
  khmerName: '',
  latinName: '',
  gender: '',
  dob: '',
  age: null,
  idCard: '',
  idCardExpireDate: '',
  nssf: '',
  joinDate: '',
  department: '',
  position: '',
  agentPhoneNumber: '',
  marriedStatus: '',
  agentPerson: '',
  spouseName: '',
  spouseContactNumber: '',
  line: '', team: '', section: '',
  education: '', religion: '', nationality: '',
  status: '', shift: '',
  sourceOfHiring: '', introducerId: '', employeeType: '',
  singleNeedle: '', overlock: '', coverstitch: '', totalMachine: null,
  workingBook: '', medicalCheck: '', medicalCheckDate: '',
  passport: '', passportExpireDate: '', visaExpireDate: '',
  remark: '', email: '', phoneNumber: '',
  placeOfBirth: { provinceNameKh: '', districtNameKh: '', communeNameKh: '', villageNameKh: '' },
  placeOfLiving: { provinceNameKh: '', districtNameKh: '', communeNameKh: '', villageNameKh: '' }
})

// ✅ Required fields for progress tracking
const requiredFields = [
  'employeeId', 'khmerName', 'latinName', 'gender', 'dob',
  'idCard', 'nssf', 'joinDate', 'department', 'position',
  'shift', 'education', 'religion', 'nationality', 'sourceOfHiring',
  'employeeType', 'medicalCheck'
]

// ✅ Animated Progress %
const completionPercentage = ref(0)
const calculateProgress = () => {
  const filled = requiredFields.filter(field => !!form.value[field])
  const percentage = Math.round((filled.length / requiredFields.length) * 100)
  // Smooth animation
  if (percentage > completionPercentage.value) {
    const interval = setInterval(() => {
      if (completionPercentage.value < percentage) {
        completionPercentage.value++
      } else {
        clearInterval(interval)
      }
    }, 10)
  } else {
    completionPercentage.value = percentage
  }
}

watch(form, calculateProgress, { deep: true })
onMounted(calculateProgress)

// ✅ Handle Step Submission
const handleStepSubmit = async () => {
  try {
    if (!employeeId.value && step.value === 1) {
      const res = await axios.post('/api/employees', form.value)
      employeeId.value = res.data._id
      router.replace({ path: '/employee/register', query: { id: employeeId.value } })
    } else if (employeeId.value) {
      await axios.put(`/api/employees/${employeeId.value}`, form.value)
    }

    // Next or complete
    if (step.value < stepComponents.length) step.value++
    else alert('✅ All data saved.')
  } catch (err) {
    console.error(err)
    alert('❌ Failed to save.')
  }
}

// ✅ Load if resuming
onMounted(async () => {
  if (employeeId.value) {
    const res = await axios.get(`/api/employees/${employeeId.value}`)
    form.value = res.data
  }
})
</script>

<style scoped>
.v-btn {
  min-width: 120px;
}
</style>
