<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="告警详情" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">告警详情</div>
        <div class="table-container">
          <el-descriptions :column="2">
            <el-descriptions-item label="告警时间">{{ msg.warningTime }}</el-descriptions-item>
            <el-descriptions-item label="一体杆名称">{{ msg.poleName }}</el-descriptions-item>
            <el-descriptions-item label="告警区域">{{ msg.areaName }}</el-descriptions-item>
            <el-descriptions-item label="一体杆编号">{{ msg.poleNumber }}</el-descriptions-item>
            <el-descriptions-item label="故障类型">{{ msg.errorType }}</el-descriptions-item>
            <el-descriptions-item label="处置状态">{{ msg.handleStatus }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <div class="form-container">
        <div class="title">告警处理</div>
        <div class="table-container">
          <el-descriptions :column="2">
            <el-descriptions-item label="处理人">{{ msg.handleUser }}</el-descriptions-item>
            <el-descriptions-item label="联系方式">{{ msg.phonenumber }}</el-descriptions-item>
            <el-descriptions-item label="处理结果">{{ msg.handleResult }}</el-descriptions-item>
            <el-descriptions-item label="完成时间">{{ msg.handleTime }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getPoleWarningDetailAPI } from '@/apis/rod'


export default {
  data() {
    return {
      msg: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 告警详情
    async getList() {
      const res = await getPoleWarningDetailAPI(this.$route.query.id)
      console.log(res)
      this.msg = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.detail-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      margin-bottom: 20px;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .table-container{
      padding:20px;
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
