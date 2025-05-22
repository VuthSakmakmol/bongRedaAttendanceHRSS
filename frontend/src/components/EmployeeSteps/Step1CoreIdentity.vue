<template>
  <v-card flat class="pa-4 mb-4">
    <h3 class="text-subtitle-1 font-weight-bold mb-4">Step 1: Core Identity</h3>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.employeeId" label="Employee ID *" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.khmerName" label="Khmer Name *" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.latinName" label="Latin Name *" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select v-model="form.gender" :items="['Male', 'Female', 'Other']" label="Gender *" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.dob" label="Date of Birth *" type="date" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model.number="form.age" label="Age" type="number" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.email" label="Email" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.phoneNumber" label="Phone Number" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.agentPhoneNumber" label="Agent Phone Number" dense outlined />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.agentPerson" label="Agent Person" dense outlined />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
defineProps({ form: Object })
</script>