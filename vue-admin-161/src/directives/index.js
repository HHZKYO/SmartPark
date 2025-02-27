// 放置全局指令
import Vue from 'vue'
import store from '@/store'
// 管理员权限特殊处理
const adminPerms = '*:*:*'
Vue.directive('auth-dir', {
  // 指令所在标签第一次插入到真实 DOM 触发回调
  inserted(el, binding) {
    // el：指令所在的标签
    // binding: 指令的参数
    // binding.value: 指令的值（v-auth-dir 后面传入的数据）
    // console.log(el, data.value)
    const perms = store.state.user.profile.permissions
    // 管理员账号单独处理
    console.log(store.state.user.profile)
    if (perms.includes(adminPerms)) {
      return
    }
    // 其他员工
    if (!perms.includes(binding.value)) {
      el.remove()
    }
  }
})
