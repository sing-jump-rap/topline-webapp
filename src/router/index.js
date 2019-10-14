import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabber from '@/views/tabber'
import Home from '@/views/home'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Tabber,
      children: [
        {
          // 默认子路由
          name: 'home',
          path: '',
          component: Home
        }
      ]
    }
  ]
})

export default router
