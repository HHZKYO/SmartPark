// 行车管理
import request from '@/utils/request'

/**
 * 获取月卡列表
 * @param { page, pageSize, carNumber, personName } params
 * @returns
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    params
  })
}

/**
 * 添加月卡
 * @param {*} data
 * @returns
 */
export function createCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}

/**
 * 月卡续费提交
 * @param {*} data
 * @returns
 */
export function renewChargeAPI(data) {
  return request({
    url: '/parking/card/recharge',
    method: 'POST',
    data
  })
}

/**
 * 获取编辑页月卡详情
 * @data
 * @returns
 */
export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

/**
 * 查看月卡详情
 * @param {*} id
 * @returns
 */
export function getCardChargeDetailAPI(id) {
  return request({
    url: `/parking/card/${id}`
  })
}

/**
 * 编辑月卡
 * @param {*} data
 * @returns
 */
export function updateCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}

/**
 * 删除月卡
 * @param {*} id
 * @returns
 */
export function delCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取规则列表
 * @param { page, pageSize} params
 * @returns
 */
export function getRuleListAPI(params) {
  return request({
    url: 'parking/rule/list',
    params
  })
}

/**
 *
 * 添加计费规则
 * @export
 * @param {*} data
 * @return {*}
 */
export function addRuleAPI(data) {
  return request({
    url: '/parking/rule',
    method: 'post',
    data
  })
}

/**
 * 获取计费规则详情
 *
 * @export
 * @param {*} id
 * @return {*}
 */
export function getRuleDetailAPI(id) {
  return request({
    url: `/parking/rule/${id}`
  })
}

/**
 *
 * 编辑计费规则
 * @export
 * @param {*} data
 * @return {*}
 */
export function editRuleAPI(data) {
  return request({
    url: `/parking/rule`,
    method: 'put',
    data
  })
}

/**
 * 删除规则
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteRuleAPI(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}

/**
 * 查看停车缴费列表
 * @param { page, pageSize, carNumber(可选), paymentStatus(可选) } params
 * @returns
 */
export function getParkingFeeListAPI(params) {
  return request({
    url: '/parking/payment/list',
    params
  })
}
