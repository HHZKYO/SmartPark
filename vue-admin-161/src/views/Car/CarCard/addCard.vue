<template>
  <div class="add-card">
    <header class="add-header">
      <el-page-header :content="title" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carInfo" :model="carInfoForm" :rules="carInfoRules" label-width="100px">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" :model="feeForm" :rules="feeFormRules" label-width="100px">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod" clearable>
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
import { createCardAPI, getCardDetailAPI, updateCardAPI } from '@/apis/car'
import { validCarNum, validChineseName, validMobile } from '@/utils/validate'

export default {
  data() {
    return {
      // 车辆信息表单对象
      carInfoForm: {
        personName: '',
        phoneNumber: '',
        carNumber: '',
        carBrand: ''
      },
      // 车辆信息校验对象
      carInfoRules: {
        personName: [
          {
            required: true, message: '请输入车主姓名', trigger: 'blur'
          },
          {
            validator: this.validatorPersonName, trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            required: true, message: '请输入联系方式', trigger: 'blur'
          },
          { validator: this.validatorPersonMobile, trigger: 'blur' }
        ],
        carNumber: [
          {
            required: true, message: '请输入车辆号码', trigger: 'blur'
          },
          {
            validator: this.validatorCarNumber,
            trigger: 'blur'
          }
        ],
        carBrand: [
          {
            required: true, message: '请输入车辆品牌', trigger: 'blur'
          }
        ]
      },
      // 缴费信息表单
      feeForm: {
        payTime: [], // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: null // 支付方式
      },
      // 缴费规则
      feeFormRules: {
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
    },
    title() {
      if (this.id) {
        return '编辑月卡'
      } else {
        return '增加月卡'
      }
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  mounted() {
    // this.carInfoForm = {
    //   personName: '小明',
    //   phoneNumber: '13899999999',
    //   carNumber: '桂A123456',
    //   carBrand: '123'
    // }
    // this.feeForm = {
    //   payTime: ['2014-01-01', '2025-02-09'],
    //   paymentAmount: 123,
    //   paymentMethod: 'weChat'
    // }
  },
  methods: {
    validatorPersonName(rule, value, callback) {
      if (validChineseName(value)) callback()
      else callback(new Error('请输入正确的中文名2-10位'))
    },
    validatorPersonMobile(rule, value, callback) {
      if (validMobile(value)) callback()
      else callback(new Error('请输入正确的手机号'))
    },
    validatorCarNumber(rule, value, callback) {
      if (validCarNum(value)) callback()
      else callback(new Error('请输入正确的车牌号'))
    },
    async confirmAdd() {
      await this.$refs.carInfo.validate()
      await this.$refs.feeForm.validate()

      // 对数据进行处理后再交给后台
      const obj = {
        ...this.carInfoForm,
        ...this.feeForm
      }
      obj.cardStartDate = this.feeForm.payTime[0]
      obj.cardEndDate = this.feeForm.payTime[1]
      delete obj.payTime
      if (this.id) {
        await updateCardAPI(obj)
      } else {
        await createCardAPI(obj)
      }
      this.$router.back()
    },
    // 重置表单
    resetFn() {
      this.$refs.carInfo.resetFields()
      this.$refs.feeForm.resetFields()
    },
    // 获取月卡详情数据
    async getDetail() {
      const res = await getCardDetailAPI(this.id)
      for (const key in this.carInfoForm) {
        this.carInfoForm[key] = res.data[key]
      }
      for (const key in this.feeForm) {
        if (key === 'payTime') {
          const { cardStartDate, cardEndDate } = res.data
          this.feeForm.payTime = [cardStartDate, cardEndDate]
        } else {
          this.feeForm[key] = res.data[key]
        }
      }
      this.carInfoForm.carInfoId = res.data.carInfoId
      this.feeForm.rechargeId = res.data.rechargeId
    }
  }
}
</script>

<style scoped lang="scss">
.add-card {
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

      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
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
</style>
