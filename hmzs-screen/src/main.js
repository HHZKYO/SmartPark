import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/common.scss'
import store from './store'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

// 使用乾坤渲染子应用
renderWithQiankun({
  // 挂载时
  mount (props) {
    console.log('mount')
    render(props)
  },
  bootstrap () {
    console.log('bootstrap')
  },
  unmount (props) {
    console.log('unmount', props)
  },
})

// 如果不是乾坤加载的此项目，则正常走以前的渲染过程
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}

function render (props = {}) {
  // 如果是乾坤来加载，会有主项目的容器标签，如果子项目自己启动 container 值为 undefined
  const { container } = props
  const app = createApp(App)
  app.use(router)
  app.use(store)
  app.mount(container ? container.querySelector("#app") : "#app")
}
