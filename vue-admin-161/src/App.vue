<template>
  <div id="app">
    <!-- 子应用挂载点 -->
    <div id="container" />
    <!-- 一级路由挂载点 -->
    <!-- <router-view /> -->
    <router-view v-if="$route.path !== '/big-screen'" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
