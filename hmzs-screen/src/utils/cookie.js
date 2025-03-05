import Cookies from 'js-cookie'

//!注意：大屏项目获取 token 的键名和智慧园区后台管理系统存储token的键名保持一致
// 因为：两个项目之间，要共享 token=》智慧园区后台管理系统登录后的 token，大屏项目也可以用
const KEY = 'token_key'

export function getCookie () {
  return Cookies.get(KEY)
}

export function setCookie (value) {
  Cookies.set(KEY, value)
}

export function removeCookie () {
  Cookies.remove(KEY)
}