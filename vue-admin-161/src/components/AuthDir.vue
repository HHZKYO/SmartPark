<script>
export default {
  props: {
    btnPerm: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShow() {
      const perms = this.$store.state.user.profile.permissions
      if (!perms) return false
      else return perms.includes(this.btnPerm) || perms.includes('*:*:*')
    }
  },
  // return 什么 auth-btn 位置就显示什么
  render() {
    console.log(this.$slots.default)
    // this.$slots.default拿到的就是要控制显示和隐藏的按钮组件
    return this.isShow && this.$slots.default
  }
}
</script>
