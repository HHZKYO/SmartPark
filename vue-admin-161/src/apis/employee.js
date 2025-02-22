import request from '@/utils/request'

/**
 * 获取员工列表
 * @param { page, pageSize, name} params
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}

/**
 * 添加员工
 * @returns
 */
export function createEmployeeAPI(data) {
  return request({
    url: `/park/sys/user`,
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @returns
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取员工详情
 * @param {*} id
 * @returns
 */
export function getEmployeeDetailAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    id
  })
}

/**
 * 编辑员工信息
 * @param {*} data
 * @returns
 */
export function editEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'PUT',
    data
  })
}
