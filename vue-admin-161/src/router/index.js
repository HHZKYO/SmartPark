import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import store from '@/store'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true // 控制当前路由对象是否在侧边栏中显示（SidebarItem还有判断，有children的才能显示）
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Workbench/index'),
      // meta：路由元信息（给路由对象设置更多参数和值，在这个项目中影响的是左侧菜单的标题）
      meta: { title: '工作台', icon: 'el-icon-data-board' }
    }]
  },
  {
    path: '/park',
    component: Layout,
    permission: 'park',
    meta: { title: '园区管理', icon: 'el-icon-office-building' },
    children: [{
      path: 'building',
      permission: 'park:building',
      meta: { title: '楼宇管理' },
      component: () => import('@/views/Park/Building/index')
    },
    {
      path: 'enterprise',
      permission: 'park:enterprise',
      meta: { title: '企业管理' },
      component: () => import('@/views/Park/Enterprise/index')
    }]
  },

  {
    path: '/parking',
    component: Layout,
    permission: 'parking',
    meta: { title: '行车管理', icon: 'el-icon-guide' },
    children: [{
      path: 'area',
      permission: 'parking:area',
      component: () => import('@/views/Car/CarArea'),
      meta: { title: '区域管理' }
    }, {
      path: 'card',
      permission: 'parking:card',
      component: () => import('@/views/Car/CarCard'),
      meta: { title: '月卡管理' }
    }, {
      path: 'pay',
      permission: 'parking:payment',
      component: () => import('@/views/Car/CarPay'),
      meta: { title: '停车缴费管理' }
    },
    {
      path: 'rule',
      permission: 'parking:rule',
      component: () => import('@/views/Car/CarRule'),
      meta: { title: '计费规则管理' }
    }]
  },
  {
    path: '/pole',
    component: Layout,
    permission: 'pole',
    meta: { title: '一体杆管理', icon: 'el-icon-refrigerator' },
    children: [{
      path: 'info',
      permission: 'pole:info',
      component: () => import('@/views/Rod/RodManage'),
      meta: { title: '一体杆管理' }
    }, {
      path: 'waring',
      permission: 'pole:warning',
      component: () => import('@/views/Rod/RodWarn'),
      meta: { title: '告警记录' }
    }]
  },
  {
    path: '/sys',
    component: Layout,
    permission: 'sys',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [{
      path: 'role',
      permission: 'sys:role',
      component: () => import('@/views/System/Role/index'),
      meta: { title: '角色管理' }
    }, {
      path: 'user',
      permission: 'sys:user',
      component: () => import('@/views/System/Employee/index'),
      meta: { title: '员工管理' }
    }]
  },
  {
    path: '/property',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/Property/index.vue'),
        meta: { title: '物业费管理', icon: 'el-icon-wallet' }
      }
    ]
  },
  {
    // 行车管理-月卡管理-新增月卡
    path: '/add-card',
    component: () => import('@/views/Car/CarCard/addCard.vue')
  },
  {
    // 园区管理-企业管理-新增企业
    path: '/add-ep',
    component: () => import('@/views/Park/Enterprise/add-ep.vue')
  },
  {
    // 园区管理-楼宇管理-新增楼宇
    path: '/add-building',
    component: () => import('@/views/Park/Building/building.vue')
  },
  {
    // 园区管理-企业管理-查看企业详情
    path: '/ep-detail',
    component: () => import('@/views/Park/Enterprise/detail.vue')
  },
  {
    // 行车管理-月卡管理-查看月卡详情
    path: '/card-detail',
    component: () => import('@/views/Car/CarCard/detail.vue')
  },
  {
    // 行车管理-月卡管理-月卡续费
    path: '/card-renew',
    component: () => import('@/views/Car/CarCard/renewCharge.vue')
  },
  {
    // 系统管理-角色管理-新增角色
    path: '/add-role',
    component: () => import('@/views/System/Role/add-role.vue')
  },
  {
    // 一体杆管理-告警记录-查看详情
    path: '/warn-detail',
    component: () => import('@/views/Rod/RodWarn/detail.vue')
  },
  {
    path: '*',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

// 页面权限拦截
router.beforeEach(async(to, from, next) => {
  const token = store.state.user.token
  const whiteList = ['/login']
  if (token) {
    next()
    // 获取用户信息
    // 没有 id 的情况
    // 情况1：刚用网站修改了自己的相关信息，然后信息清空，在下一次切换页面的时候获取
    // 情况2：登录跳转到内容页面（第一次登此网站），进入获取一次当前用户的信息
    // 情况3：refresh_token，不重新登录也能获取最新的 token，代码删除用户的信息，
    // 下一次跳转页面时，id 无值，就会带着最新的 token 再去获取最新的用户信息
    if (!store.state.user.profile.id) {
      // 获取原始权限列表
      // dispatch 原地是一个Promise 对象，而值来自于调用的 actions 函数内 return 的结果
      const res = await store.dispatch('user/getProfile')
      console.log(res)
      // 现在：后台给我返回的权限点标记是一个英文字符串数组 ['parking:rule:list', 'parking:rule:add_edit']
      // 目标：得到 ['parking']
      const resultList = []
      res.data.permissions.forEach(item => {
        resultList.push(item.split(':')[0])
      })
      console.log(resultList)
      // 数组去重
      const permissionList = Array.from(new Set(resultList))
      console.log(permissionList)
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
