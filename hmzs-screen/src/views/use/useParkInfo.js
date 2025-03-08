import { getParkInfoAPI } from '@/apis/index'
import { ref } from 'vue'
// Vue 组合函数一般用 use 开头
// return 状态出去
// 1.封装一个函数
export function useParkInfo () {
  // 2.书写要封装的代码逻辑
  // 状态（响应式对象），给状态赋值函数
  const parkInfo = ref({})
  const getParkInfo = async () => {
    const res = await getParkInfoAPI()
    parkInfo.value = res.data
  }
  // 3.把状态和方法 return 出去
  return {
    parkInfo,
    getParkInfo
  }
}