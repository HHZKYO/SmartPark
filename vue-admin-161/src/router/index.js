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
  }
]

// 动态路由表：需要权限控制访问的路由页面对象
export const asyncRoutes = [
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
    permission: 'property',
    children: [{
      // 注意：这里路径字符串为空，代表一级菜单无二级菜单
      path: '',
      name: 'cost',
      permission: 'property:propertyFee',
      // 二级路由点，要挂载的组件
      component: () => import('@/views/Property/index'),
      // 左侧路由上标题和图标（图标使用 element-ui 组件库里图标类名（因为左侧导航组件是基于 element-ui 组件库）
      meta: { title: '物业费管理', icon: 'el-icon-wallet' }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  // mode: 'history',
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
      const userRoutes = []
      // 1.获取原始权限列表
      // dispatch 原地是一个Promise 对象，而值来自于调用的 actions 函数内 return 的结果
      const res = await store.dispatch('user/getProfile')
      console.log(res)
      // 现在：后台给我返回的权限点标记是一个英文字符串数组 ['parking:rule:list', 'parking:rule:add_edit']

      // 2.目标：得到 ['parking']
      const resultList = []
      res.data.permissions.forEach(item => {
        resultList.push(item.split(':')[0])
      })
      // console.log(resultList)
      // 数组去重
      const firstPerList = Array.from(new Set(resultList))
      console.log(firstPerList)

      // 3.目标：提取“二级路由标识” 集合
      let secondPerList = res.data.permissions.map(item => {
        const lastInd = item.lastIndexOf(':')
        const targetStr = item.substring(0, lastInd)
        return targetStr
      })
      secondPerList = Array.from(new Set(secondPerList))

      if (firstPerList[0] === '*') {
        // 管理员
        userRoutes.push(...routes)
        userRoutes.push(...asyncRoutes)
        store.commit('user/setUserRoutes', userRoutes)
        const arr = [...asyncRoutes]
        arr.push({
          path: '*',
          component: () => import('@/views/404'),
          hidden: true
        })
        arr.forEach(routeObj => {
          router.addRoute(routeObj)
        })
      } else {
        // 4.动态路由数组和权限点标记进行匹配筛选
        const routeArr = asyncRoutes.filter(obj => {
          return firstPerList.includes(obj.permission)
        })
        console.log(routeArr) // 筛选后该有权限对应的路由对象集合

        // 5.再次筛选二级匹配路由对象
        const routesList = routeArr.map(obj => {
          const resultArr = obj.children.filter(item => {
            return secondPerList.includes(item.permission)
          })
          // 新组织一个路由对象
          const newObj = { ...obj }
          newObj.children = resultArr
          return newObj
        })
        console.log(routesList)

        // 6.路由数组交给 vuex 影响左侧菜单使用循环生成
        userRoutes.push(...routes)
        userRoutes.push(...routesList) // 把筛选后的动态路由对象合并到 routes 路由规则数组中
        store.commit('user/setUserRoutes', userRoutes) // 把筛选后的动态路由对象集存储到 vuex 中

        const arr = [...routesList]
        arr.push({
          path: '*',
          component: () => import('@/views/404'),
          hidden: true
        })
        // 问题：点击筛选后的路由对象，跳转不了
        // 原因：new Router 时，routes 里只有静态的路由规则对象，匹配的只有这些静态的
        // 动态：网络请求回来给 routes 数组本身添加，影响不了 router 路由对象里使用的路由规则
        // 解决：5.router 给我们一个 addRoute 方法可以动态追加可以“匹配”用的路由对象
        arr.forEach(routeObj => {
          router.addRoute(routeObj)
        })
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

// 问题：第一次登录没问题，第二次登录时（切换账号），左侧菜单没有更新
// 原因：第一次登录时，vuex 里的 profile 没有值，所以路由守卫里 profile.id 判断进去获取第一次登录账号的用户信息
// 保存到 vuex 的 profile 上，退出登录后，第二次切换账号登录时（浏览器不会刷新，单页面应用考路由跳转切换展示 DOM 标签）
// 所以，vuex 中 profile 的值还在，路由守卫里的 profile.id 判断进不去，所以不会获取第二次登录账号的最新权限信息，
// 所以影响不了左侧菜单的渲染。
// 尝试解决办法：第二次登录后，手动刷新页面就可以了，因为刷新后 vuex 里的 profile 值回归初始化 {} 了，
// 所以路由守卫里 profile.id 是空的，进入获取了第二个用户的权限信息，并生成左侧菜单，就对应上了。
// 根本解决：在退出登录时，把 profile 信息清空，让下一次登录跳转路由时，路由守卫 profile.id 进入，
// 获取当前这次登录用户的最新路由信息并筛选生成左侧菜单

export default router
