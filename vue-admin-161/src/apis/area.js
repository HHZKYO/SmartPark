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

/**
 * 添加区域
 * @param {*} data
 * @returns
 */
export function addAreaAPI(data) {
  return request({
    url: '/parking/area',
    method: 'POST',
    data
  })
}
