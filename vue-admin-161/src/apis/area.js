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

/**
 * 编辑区域
 * @param {*} data
 * @returns
 */
export function editAreaAPI(data) {
  return request({
    url: '/parking/area',
    method: 'PUT',
    data
  })
}

/**
 * 删除区域
 * @param {*} id
 * @returns
 */
export function deleteAreaAPI(id) {
  return request({
    url: `/parking/area/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取关联区域下拉列表
 * @returns
 */
export function getRelevanceAreaListAPI() {
  return request({
    url: '/parking/area/dropList'
  })
}
