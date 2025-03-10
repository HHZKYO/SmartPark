import { createStore } from 'vuex'
import build from './modules/build'
import car from './modules/car'

const store = createStore({
  // 组合模块的配置项
  modules: {
    build,
    car
  },
  getters: {
    // 建筑信息
    buildInfo (state) {
      return state.build.buildInfo
    },
    // 车辆信息
    carInfo (state) {
      return state.car.carInfo
    }
  }
})

export default store