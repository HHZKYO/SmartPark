import { loginAPI } from '@/apis/user'

export default {
  namespaced: true,
  state() {
    return {
      token: ''
    }
  },
  mutations: {
    setToken(state, str) {
      state.token = str
    }
  },
  actions: {
    async loginActions(store, dataObj) {
      const res = await loginAPI(dataObj)
      store.commit('setToken', res.data.token)
    }
  }
}
