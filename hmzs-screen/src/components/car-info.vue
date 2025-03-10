<template>
  <div ref="target" class="modal-container car-info">
    <img class="close-icon" src="@/assets/modal-close.png" alt="" />
    <div class="extra">
      <span> 临时 </span>
      <!-- <span> 月卡 </span> -->
    </div>
    <div class="title">
      京A00001
    </div>
    <div class="info">
      <div class="info-line">
        <span>车型：</span>
        <span> 小型车 </span>
      </div>
      <div class="info-line">
        <span>车主姓名：</span>
        <span> 小花 </span>
      </div>
      <div class="info-line">
        <span>停车时间：</span>
        <span> 2023-04-05 </span>
      </div>
      <div>
        <span>已停车：</span>
        <span> 48 分钟</span>
      </div>
    </div>
  </div>
</template>

<script setup>

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
