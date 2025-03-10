// 当前查看的某个建筑信息
export default {
  namespaced: true,
  state() {
    return {
      buildInfo: {} // 建筑信息
    }
  },
  mutations: {
    setBuildInfo(state, buildInfo) {
      state.buildInfo = buildInfo;
    }
  }
}