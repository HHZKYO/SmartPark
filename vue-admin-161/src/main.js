// 目标：上线代码的console.log 全部失效，但开发环境有效
// 错误点1：.env 环境变量文件里变量名自定义的都要以 VUE_APP_ 开头
// 错误点2：环境变量和值之间的 = 两边必须有空格
// 错误点3：环境相关的东西发生改变，vuecli 脚手架需要重新运行/打包才能生效
if (process.env.NODE_ENV === 'production') {
  console.log = function() {}
  console.error = function() {}
  console.warn = function() {}
  console.info = function() {}
  console.debug = function() {}
  console.trace = function() {}
  console.dir = function() {}
  console.dirxml = function() {}
  console.group = function() {}
  console.groupEnd = function() {}
}

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

// 注册乾坤服务
import '@/registerMicroApp'

Vue.use(ElementUI)

Vue.config.productionTip = false

// vue实例化
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
