import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局控制css的样式
import './assets/css/global.css'

// 引入icon图标库样式文件
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入组件库
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// axios配置请求公共根地址
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 给axios配置成为Vue的成员
Vue.prototype.$http = axios

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: c => c(App)
  // components: { App },
  // template: '<App/>'
})
