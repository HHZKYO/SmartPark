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
