import request from '@/utils/request'

/**
 * 获取物业费列表
 * @param {*} params
 * @returns
 */
export function getPropertyListAPI(params) {
  return request({
    url: '/park/propertyfee',
    params
  })
}

/**
 * 查询所有企业
 * @returns
 */
export function getAllEnterpriseAPI() {
  return request({
    url: '/park/all/enterprise'
  })
}

/**
 * 查询所有楼宇
 * @returns
 */
export function getAllBuildingAPI() {
  return request({
    url: '/park/all/building'
  })
}

/**
 * 预算金额
 * @param {*} data
 * @returns
 */
export function calculateAmountAPI(data) {
  return request({
    url: '/park/propertyfee/pre/payment',
    method: 'POST',
    data
  })
}

/**
 * 添加账单
 * @param {*} data
 * @returns
 */
export function addBillAPI(data) {
  return request({
    url: '/park/propertyfee',
    method: 'POST',
    data
  })
}

/**
 * 查看账单详情
 * @param {*} id
 * @returns
 */
export function getBillDetailAPI(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    id
  })
}
