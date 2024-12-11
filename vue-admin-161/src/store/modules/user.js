import { loginAPI } from '@/apis/user'
import { getToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || ''
    }
  },
  mutations: {
    setTokens(state, str) {
      state.token = str
      setToken(str)
    }
  },
  actions: {
    async loginActions(store, dataObj) {
      const res = await loginAPI(dataObj)
      store.commit('setTokens', res.data.token)
    }
  }
}
