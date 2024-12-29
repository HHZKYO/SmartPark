import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param {*} params
 * @returns
 */
export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    params
  })
}
