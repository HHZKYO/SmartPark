<template>
  <div>
    <!-- 3.告诉适配组件我是按照多少宽高设计图实现的 -->
    <VScaleScreen width="1920" height="1080">
      <!-- <img src="@/assets/img.png" alt=""> -->
      <div class="all-charts" ></div>
      <div class="model-container">
        <div class="canvas-3d"></div>
      </div>
    </VScaleScreen>
  </div>
</template>

<script setup>
  // 目标：缩放适配
  // 1.下载v-scale-screen
  // 2.引入插件暴露的组件使用
  import VScaleScreen from 'v-scale-screen'
</script>

<style lang='scss' scoped>

</style>