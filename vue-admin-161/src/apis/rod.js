import request from '@/utils/request'

/**
 * 查看一体杆列表
 * @param { page, pageSize, poleName, poleNumber, poleStatus（后面三个参数可选）} params
 * @returns
 */
export function getRodListAPI(params) {
  return request({
    url: '/pole/info/list',
    params
  })
}

/**
 * 添加一体杆
 * @param {poleName, poleNumber, poleIp, areaId, poleType} data
 * @returns
 */
export function addRodAPI(data) {
  return request({
    url: '/pole/info',
    method: 'POST',
    data
  })
}

/**
 * 编辑一体杆
 * @param {id, poleName, poleNumber, poleIp, areaId, poleType} data
 * @returns
 */
export function editRodAPI(data) {
  return request({
    url: '/pole/info',
    method: 'PUT',
    data
  })
}

/**
 * 删除一体杆
 * @param {批量删除时，id 用逗号隔开} id
 * @returns
 */
export function delRodAPI(id) {
  return request({
    url: `/pole/info/${id}`,
    method: 'DELETE'
  })
}

/**
 * 查看告警记录列表
 * @param {*，page, pageSize, poleName, poleNumber, handleStatus (参数均可选)}params
 * @returns
 */
export function getPoleWaringListAPI(params) {
  return request({
    url: '/pole/warning/list',
    params
  })
}
