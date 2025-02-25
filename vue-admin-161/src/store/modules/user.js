import { loginAPI, getProfileAPI } from '@/apis/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state() {
    return {
      token: getToken() || '',
      profile: {}, // 当前登录用户的相关信息数据
      userRoutes: [] // 静态+筛选后的所有路由对象数组
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
    },
    setProfile(state, data) {
      state.profile = data
    },
    delProfile(state) {
      state.profile = {}
    },
    setUserRoutes(state, data) {
      state.userRoutes = data
    }
  },
  actions: {
    // 登录
    async loginActions(store, dataObj) {
      const res = await loginAPI(dataObj)
      store.commit('setTokens', res.data.token)
    },
    // 获取用户信息
    async getProfile(store) {
      const permission = await getProfileAPI()
      store.commit('setProfile', permission.data)
      // return 到 dispatch 的位置
      return permission
    }
  }
}
