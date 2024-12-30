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

/**
 * 添加楼宇
 * @param {*} data
 * @returns
 */
export function addBuildingAPI(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

/**
 * 删除楼宇
 * @param {*} id
 * @returns
 */
export function delBuildingAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}

/**
 * 编辑楼宇
 * @param {*} data
 * @returns
 */
export function editBuildingAPI(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}

/**
 * 获取楼宇详情
 * @param {*} id
 * @returns
 */
export function getBuildingDetailAPI(id) {
  return request({
    url: `/park/building/${id}`
  })
}
