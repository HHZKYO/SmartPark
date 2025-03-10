// 当前查看的某个汽车信息
export default {
  namespaced: true,
  state() {
    return {
      carInfo: {} // 车辆信息
    }
  },
  mutations: {
    setCarInfo(state, carInfo) {
      state.carInfo = carInfo;
    }
  }
}