<template>
  <div ref="target" class="modal-container build-info">
    <img class="close-icon" src="@/assets/modal-close.png" alt="" />
    <div class="extra">
      <span v-if="buildInfo.status === 0"> 空置中 </span>
      <span v-if="buildInfo.status === 1"> 已租赁 </span>
    </div>
    <div class="title">
      {{ buildInfo.name }}
    </div>
    <div class="info">
      <div class="info-line">
        <span>楼层数：</span>
        <span> {{ buildInfo.floors }} </span>
      </div>
      <div class="info-line">
        <span>总面积(m²)：</span>
        <span> {{ buildInfo.area }}㎡ </span>
      </div>
      <div class="info-line">
        <span>承租单位：</span>
        <span> {{ buildInfo.rentEnterpriseName || '暂无' }} </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue' 
const store = useStore()
const buildInfo = computed(() => {
  return store.getters.buildInfo
})
</script>

<style scoped lang="scss">
.modal-container {
  position: absolute;
  background: url('@/assets/modal-bg.png') no-repeat 0 0 / cover;
  width: 240px;
  padding: 8px 10px 0;
}

.close-icon {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 6px;
  right: 6px;
  cursor: pointer;
}

.extra {
  position: absolute;
  right: 12px;
  top: 42px;
  background: rgba(10, 26, 52, 0.6);
  border: 1px solid rgba(54, 135, 255, 0.7);
  border-radius: 1px;
  box-shadow: 0px 0px 5px 0.5px rgba(3, 251, 255, 0.65) inset;
  padding: 4px 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 12px;
}

.info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.info-line {
  margin-bottom: 10px;
}

</style>
