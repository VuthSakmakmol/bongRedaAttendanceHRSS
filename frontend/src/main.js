import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')

//now i have employee list, ok let go to make attendance check up, example i have 10 employees, so i will import their daily information every morning to check ate the late, absent, or abondon (if abent count from 6days ).
//it's refered to time check in 700, if more than 700 = abent, if less than or equal 700 = on time. 
//make sure their list and new import is 


// const exportToExcel = () => {
//   const selectedData = employees.value.filter(e => selected.value.includes(e._id))
//   const rows = selectedData.map(e => [
//     e.employeeId,e.name, e.email, e.department, e.position
//     e.placeOfBirth?.provinceNameKh, e.placeOfBirth?.districtNameKh, e.placeOfBirth?.communeNameKh, e.placeOfBirth?.villageNameKh,
//     e.placeOfLiving?.provinceNameKh, e.placeOfLiving?.districtNameKh, e.placeOfLiving?.communeNameKh, e.placeOfLiving?.villageNameKh,

//   ])
//   const ws = XLSX.utils.aoa_to_sheet([
//     ['Place of Birth', '', '', '', 'Place of Living', '', '', '', 'Name', 'Email'],
//     ['ខេត្ត','ស្រុក','សង្កាត់','ភូមិ','ខេត្ត','ស្រុក','សង្កាត់','ភូមិ','',''],
//     ...rows
//   ])
//   ws['!merges'] = [
//     { s: { r:0,c:0 }, e:{ r:0,c:3 } },
//     { s: { r:0,c:4 }, e:{ r:0,c:7 } },
//     { s: { r:0,c:8 }, e:{ r:1,c:8 } },
//     { s: { r:0,c:9 }, e:{ r:1,c:9 } }
//   ]
//   XLSX.writeFile({ Sheets: { Sheet1: ws }, SheetNames: ['Sheet1'] }, 'employees.xlsx')
// }