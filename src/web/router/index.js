import Vue from 'vue'
import Router from 'vue-router'

import home from '@/page/home'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: home
      }
    ]
  })
}
