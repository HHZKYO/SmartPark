import Vue from 'vue'
import 'normalize.css/normalize.css' // 重置样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'

import store from './store'

import router from './router'

// 注册svg
import '@/icons'

// 注册全局指令
import '@/directives'

// 注册全局组件（权限控制）
import AuthDir from './components/AuthDir.vue'
Vue.component('AuthBtn', AuthDir)

Vue.use(ElementUI)

Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
