<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="月卡续费" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="table-container">
          <el-descriptions :column="2">
            <el-descriptions-item label="车主姓名">{{ carInfo.personName }}</el-descriptions-item>
            <el-descriptions-item label="联系方式">{{ carInfo.phoneNumber }}</el-descriptions-item>
            <el-descriptions-item label="车牌号码">{{ carInfo.carNumber }}</el-descriptions-item>
            <el-descriptions-item label="车辆品牌">{{ carInfo.carBrand }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="title">月卡缴费信息</div>
        <div class="form">
          <el-form ref="cardChargeInfo" :model="cardChargeInfo" :rules="cardChargeInfoRules" label-width="100px">
            <el-form-item label="有效日期" prop="cardEndDate">
              <el-date-picker
                v-model="cardChargeInfo.cardStartDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="结束日期"
                :disabled-date="disabledStartDate"
                format="yyyy-MM-dd"
                readonly
              />
              <span>至</span>
              <el-date-picker
                v-model="cardChargeInfo.cardEndDate"
                type="date"
                placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="cardChargeInfo.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="cardChargeInfo.paymentMethod" clearable>
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetFn">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getCardDetailAPI, renewChargeAPI } from '@/apis/car'

export default {
  data() {
    return {
      // 车辆信息
      carInfo: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      // 月卡缴费信息
      cardChargeInfo: {
        cardStartDate: '', // 开始时间，默认由API返回设置，且不可更改
        cardEndDate: null, // 结束时间，由用户选择
        paymentAmount: null,
        paymentMethod: '',
        carInfoId: null
      },
      // 缴费规则
      cardChargeInfoRules: {
        payTime: [
          {
            required: true,
            message: '请选择支付时间'
          }
        ],
        paymentAmount: [
          {
            required: true,
            message: '请输入支付金额',
            trigger: 'blur'
          }
        ],
        paymentMethod: [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }
        ]
      },
      // 支付方式列表
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    this.getCardDetail()
  },
  methods: {
    // 获取月卡详情
    async getCardDetail() {
      const res = await getCardDetailAPI(this.id)
      // 设置车辆信息
      for (const key in this.carInfo) {
        this.carInfo[key] = res.data[key]
      }
      // 设置月卡缴费信息
      const endDate = new Date(res.data.cardEndDate)
      // 计算后一天
      endDate.setDate(endDate.getDate() + 1)
      // 设置开始时间为cardEndDate，且不可更改
      this.cardChargeInfo.cardStartDate = endDate.toISOString().split('T')[0]
      // 注意：这里不设置cardEndDate，因为它将由用户选择
      this.cardChargeInfo.carInfoId = res.data.carInfoId
    },
    // 禁用开始日期之前的日期（如果需要）
    disabledStartDate(time) {
      return time.getTime() < new Date(this.cardChargeInfo.cardStartDate).getTime()
    },
    // 重置表单
    resetFn() {
      this.$refs.cardChargeInfo.resetFields()
    },
    // 表单提交确认
    async confirmAdd() {
      await this.$refs.cardChargeInfo.validate()
      await renewChargeAPI(this.cardChargeInfo)
      this.$router.back()
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
        border-bottom: 1px solid #eee;
      }

      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;

        .el-form {
          display: flex;
          flex-wrap: wrap;

          .el-form-item {
            width: 50%;
          }
        }
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

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
