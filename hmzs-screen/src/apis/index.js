// 获取园区信息

import request from '@/utils/request'

/**
 * 获取园区信息
 * @returns
 */
export function getParkInfoAPI () {
  return request({
    url: '/park/statistics/info'
  })
}

/**
 * 获取建筑详情信息
 * @param {*} id 建筑模型 id
 * @returns
 */
export function getBuildInfoAPI (id) {
  return request({
    url: '/park/statistics/building',
    params: {
      id
    }
  })
}