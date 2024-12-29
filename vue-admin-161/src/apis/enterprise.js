import request from '@/utils/request'

/**
 * 创建公司
 * @param {*} data
 * @returns
 */
export function createEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 查看企业
 * @param {*} id
 * @returns
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`
  })
}

/**
 * 更新企业
 * @param {*} data
 * @returns
 */
export function updateEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}
