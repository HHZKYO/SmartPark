<template>
  <div class="pay-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input v-model="query.carNumber" placeholder="请输入内容" class="search-main" />
      <span class="search-label">缴费状态：</span>
      <el-select v-model="query.paymentStatus">
        <el-option
          v-for="item in paymentStatusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        class="search-btn"
        @click="searchFn"
      >查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="formList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="收费类型" prop="chargeType" :formatter="formatterChargeType" />
        <el-table-column label="停车总时长" prop="parkingTime" />
        <el-table-column label="缴纳费用（元）" prop="actualCharge" />
        <el-table-column label="缴纳状态" prop="paymentStatus" :formatter="formatterPaymentStatus" />
        <el-table-column label="缴纳方式" prop="paymentMethod" :formatter="formatterPaymentMethod" />
        <el-table-column label="缴纳时间" prop="paymentTime" width="150" />
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="query.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { getParkingFeeListAPI } from '@/apis/car'

export default {
  data() {
    return {
      // 查询参数
      query: {
        page: 1,
        pageSize: 6,
        carNumber: '', // 车牌号(可选)
        paymentStatus: '' // 缴费状态（可选），0：未缴纳，1：已缴纳
      },
      total: 0, // 总条数
      // 表单信息
      formList: [],
      // 缴纳状态列表
      paymentStatusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '未缴纳'
        },
        {
          value: '1',
          label: '已缴纳'
        }
      ]
    }
  },
  created() {
    this.getParkingFeeList()
  },
  methods: {
    // 获取表单列表
    async getParkingFeeList() {
      const res = await getParkingFeeListAPI(this.query)
      console.log(res)
      this.formList = res.data.rows
      this.total = res.data.total
    },
    // 车辆信息查询
    searchFn() {
      this.getParkingFeeList()
    },
    // 页码切换
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getParkingFeeList()
    },
    // 条数切换
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getParkingFeeList()
    },
    // 格式化收费类型内容
    formatterChargeType(row) {
      const key = {
        card: '月卡',
        temp: '临时停车'
      }
      return key[row.chargeType]
    },
    // 格式化缴纳状态内容
    formatterPaymentStatus(row) {
      const key = {
        1: '已缴纳',
        0: '未缴纳'
      }
      return key[row.paymentStatus]
    },
    // 格式化缴纳方式内容
    formatterPaymentMethod(row) {
      const key = {
        Alipay: '支付宝',
        WeChat: '微信',
        Cash: '现金',
        null: '--'
      }
      return key[row.paymentMethod]
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.table {
  line-height: 40px; /* 设置行内文字的行高，这也会影响行高 */
  /* 或者使用padding来增加行内的垂直空间 */
  /* padding-top: 10px; */
  /* padding-bottom: 10px; */
}
</style>
