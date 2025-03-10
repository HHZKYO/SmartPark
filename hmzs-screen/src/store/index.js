import { createStore } from 'vuex'
import build from './modules/build'

const store = createStore({
  // 组合模块的配置项
  modules: {
    build
  },
  getters: {
    // 建筑信息
    buildInfo (state) {
      return state.build.buildInfo
    }
  }
})

export default store