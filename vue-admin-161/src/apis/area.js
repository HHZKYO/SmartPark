import request from '@/utils/request'

/**
 * 获取区域列表
 * @param {*} params
 * @returns
 */
export function getAreaListAPI(params) {
  return request({
    url: '/parking/area/list',
    params
  })
}
