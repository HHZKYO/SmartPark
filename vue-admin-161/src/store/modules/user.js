import { loginAPI } from '@/apis/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || '',
      profile: [] // 当前登录用户的相关信息数据
    }
  },
  mutations: {
    setTokens(state, str) {
      state.token = str
      setToken(str)
    },
    delTokens(state) {
      state.token = ''
      removeToken()
    }
  },
  actions: {
    async loginActions(store, dataObj) {
      const res = await loginAPI(dataObj)
      store.commit('setTokens', res.data.token)
    }
  }
}
