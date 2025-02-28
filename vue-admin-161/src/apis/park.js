import request from '@/utils/request'

/**
 * 获取企业列表
 * @param { page, pageSize} params
 * @returns
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}

/**
 * 获取行业列表
 * @returns
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 上传合同
 * @returns
 */
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}

/**
 * 获取空置中楼宇列表（未租赁）
 * @param {*}
 * @returns
 */
export function getRentBuildListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 给当前企业添加/续租合同
 * @param {*} data
 * @returns
 */
export function createRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取企业下合同列表
 * @param {*} id
 * @returns
 */
export function getRentListAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

/**
 * 退租
 * @param {合同id} rentId
 * @returns
 */

export function outRentAPI(rentId) {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: 'PUT'
  })
}

/**
 * 合同删除
 * @param {*} rentId
 * @returns
 */
export function deleteRentAPI(rentId) {
  return request({
    url: `/park/enterprise/rent/${rentId}`,
    method: 'DELETE'
  })
}

/**
 * 获取企业详情
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 下载合同文件
 * id: 文件上传接口返回得文件id
 */
export function downloadContract(id) {
  return request({
    url: `/download/${id}`,
    responseType: 'blob'
  })
}
