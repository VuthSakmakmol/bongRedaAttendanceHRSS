// frontend/src/plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import 'vuetify/styles' // ✅ required
import '@mdi/font/css/materialdesignicons.css' // ✅ icon font
import 'vuetify/lib/styles/main.sass' // ✅ fallback for ripple etc.

export default createVuetify({
  components,
  directives,
})
