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

/**
 * 获取tree权限列表
 * @returns
 */
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}
