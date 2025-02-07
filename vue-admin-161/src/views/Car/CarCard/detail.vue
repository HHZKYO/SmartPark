<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="月卡详情" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="table-container">
          <el-descriptions :column="2">
            <el-descriptions-item label="车主姓名">{{ msg.personName }}</el-descriptions-item>
            <el-descriptions-item label="联系方式">{{ msg.phoneNumber }}</el-descriptions-item>
            <el-descriptions-item label="车牌号码">{{ msg.carNumber }}</el-descriptions-item>
            <el-descriptions-item label="车辆品牌">{{ msg.carBrand }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <!-- <div class="form-container">
        <div class="title">月卡缴费记录</div>
        <div class="table-container">
          <div class="table-container">
            <el-table
              :data="rentList"
              style="width: 100%"
              border
            >
              <el-table-column
                type="index"
                label="序号"
                width="80"
              />
              <el-table-column
                prop="name"
                label="有效时间"
              />
              <el-table-column
                label="支付金额"
                width="120"
              />
              <el-table-column
                label="支付方式"
                width="120"
              />
              <el-table-column
                prop="createTime"
                label="办理时间"
              />
              <el-table-column
                prop="address"
                label="办理人"
                width="150"
              />
            </el-table>
          </div>
        </div>
      </div> -->
    </main>
  </div>
</template>

<script>
import { getCardDetailAPI } from '@/apis/car'

export default {
  data() {
    return {
      msg: {}
    }
  },
  created() {
    this.getCardDetail()
  },
  methods: {
    // 获取月卡详情
    async getCardDetail() {
      const res = await getCardDetailAPI(this.$route.query.id)
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
