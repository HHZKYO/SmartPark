import request from '@/utils/request'

/**
 * 获取角色列表(查询所有角色)
 * @returns
 */
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}
