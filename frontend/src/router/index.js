import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'), // layout with sidebar
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'employee/list',
        name: 'EmployeeList',
        component: () => import('@/views/EmployeeList.vue')
      },
      {
        path: 'employee/register',
        name: 'EmployeeRegister',
        component: () => import('@/views/EmployeeRegister.vue')
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('@/views/Attendance.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
