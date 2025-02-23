import request from '@/utils/request'

/**
 * 获取物业费列表
 * @param {*} params
 * @returns
 */
export function getPropertyListAPI(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}
