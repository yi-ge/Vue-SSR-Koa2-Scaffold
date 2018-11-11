import AuthGuard from '@/router/authGuard'

import adminLayout from '@/layout/admin'

import AdminHome from '@/page/admin/home'
import Login from '@/page/admin/login'

export default {
  path: '/admin',
  component: adminLayout,
  beforeEnter: AuthGuard,
  children: [
    {
      path: '',
      redirect: '/admin/home'
    },
    {
      path: 'home',
      name: 'AdminHome',
      component: AdminHome
    },
    {
      path: 'login',
      name: 'Login',
      component: Login
    }
  ]
}
