import axios from 'axios'
import { getCookie } from './cookie'
// import { Message } from 'element-ui'
// import router from '@/router'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getCookie()
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // Message.error(error.response.data.msg)
    // if (error.response.status === 401) {
    //   // 1. 跳转到登录
    //   router.push(`/login?redirect=${router.currentRoute.fullPath}`)
    //   // 2. 清空用户数据
    //   store.commit('user/delTokens')
    // }
    return Promise.reject(error)
  }
)

export default service