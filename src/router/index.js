import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
// 设置路由守卫
// 在守卫中对token进行检测
router.beforeEach((to, from, next) => {
  // 当前用户没有登录系统，并且还在访问非登录路由，就强制执行登录路由
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next() // 请继续你的旅行
})

export default router