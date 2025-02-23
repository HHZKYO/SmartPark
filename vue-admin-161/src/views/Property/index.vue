<template>
  <div class="property-container">
    <!-- 查询 -->
    <div class="search-container">
      <span>企业名称：</span>
      <el-input
        v-model="query.enterpriseName"
        clearable
        placeholder="请输入企业名称"
        class="search-main"
      />
      <span>缴费时间：</span>
      <el-date-picker
        v-model="payTime"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="→"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="search-main"
      />
      <el-button
        type="primary"
        class="search-btn"
        @click="searchFn"
      >查询</el-button>
    </div>
    <!-- 添加账单区域 -->
    <div class="create-container">
      <el-button type="primary" @click="add">添加账单</el-button>
    </div>
    <!-- 表单 -->
    <div class="table">
      <el-table style="width: 100%" :data="formList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="账单编号" prop="billNumber" width="150px" />
        <el-table-column label="企业名称" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" prop="buildingName" width="100px" />
        <el-table-column label="物业费（元/㎡）" prop="propertyFeePrice" width="130px" />
        <el-table-column label="账单金额（元）" prop="paymentAmount" width="120px" />
        <el-table-column label="缴费时间" prop="createTime" width="150px" />
        <el-table-column label="操作" fixed="right" width="90">
          <template #default="scope">
            <el-button size="mini" type="text" @click="viewBillDetail(scope.row.id)">查看</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="query.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>
    <!-- 添加账单对话框 -->
    <el-dialog :visible.sync="addDialogVisible" title="添加账单" width="500px" @close="closeDialog">
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="选择租户" prop="enterpriseId">
            <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
              <el-option
                v-for="item in allEnterpriseList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="addForm.buildingId" placeholder="请选择租赁楼宇">
              <el-option
                v-for="item in allBuildingList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="缴费周期" prop="time">
            <el-date-picker
              v-model="addForm.time"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="→"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="calculateAmount"
            />
          </el-form-item>
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input v-model="addForm.paymentAmount" :disabled="true" />
          </el-form-item>
          <el-form-item label="支付方式" prop="paymentMethod">
            <el-select v-model="addForm.paymentMethod" placeholder="请选择支付方式">
              <el-option
                v-for="item in paymentMethodList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="cancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd()">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 查看账单对话框 -->
    <el-dialog :visible.sync="viewBillVisible" title="查看账单" width="500px" @close="closeDetail">
      <div class="form-container">
        <el-form :model="billDetail">
          <el-form-item label="租户名称" prop="enterpriseId" />
          <div>{{ billDetail.enterpriseName }}</div>
          <el-form-item label="租赁楼宇" prop="buildingId" />
          <div>2</div>
          <el-form-item label="缴费周期" prop="time" />
          <el-form-item label="物业费（元/㎡）" prop="paymentAmount" />
          <el-form-item label="账单金额（元）" prop="paymentMethod" />
          <el-form-item label="支付方式" prop="paymentMethod" />
          <el-form-item label="缴费时间" prop="paymentMethod" />
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addBillAPI, calculateAmountAPI, getAllBuildingAPI, getAllEnterpriseAPI, getBillDetailAPI, getPropertyListAPI } from '@/apis/property'

export default {
  data() {
    return {
      // 表单信息查询参数
      query: {
        enterpriseName: '', // 可选
        start: '', // 可选
        end: '', // 可选
        page: 1, // 可选
        pageSize: 10 // 可选
      },
      formList: [], // 物业费账单列表
      total: null, // 列表信息总数
      payTime: [],
      addDialogVisible: false, // 添加账单对话框显示/隐藏
      viewBillVisible: false, // 查看账单对话框显示/隐藏
      // 添加账单信息表单
      addForm: {
        enterpriseId: null,
        buildingId: null,
        paymentAmount: null,
        paymentMethod: null,
        time: []
      },
      billDetail: {}, // 账单详情
      allEnterpriseList: [], // 所有企业列表
      allBuildingList: [], // 所有楼宇列表
      paymentMethodList: [
        {
          id: 2,
          name: '支付宝'
        },
        {
          id: 1,
          name: '微信'
        },
        {
          id: 3,
          name: '现金'
        }
      ],
      // 规则校验
      addFormRules: {
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入缴费周期', trigger: 'blur' }
        ],
        paymentMethod: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getPropertyList()
  },
  methods: {
    // 获取物业费列表信息
    async getPropertyList() {
      const res = await getPropertyListAPI(this.query)
      this.formList = res.data.rows
      this.total = res.data.total
    },
    // 切换页码
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getPropertyList()
    },
    // 切换条数
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getPropertyList()
    },
    // 查询账单
    searchFn() {
      this.query.start = this.payTime[0]
      this.query.end = this.payTime[1]
      this.getPropertyList()
    },
    // 添加账单
    async add() {
      this.addDialogVisible = true
      const res = await getAllEnterpriseAPI()
      this.allEnterpriseList = res.data
      const msg = await getAllBuildingAPI()
      this.allBuildingList = msg.data
    },
    // 计算支付金额
    async calculateAmount(value) {
      const obj = {
        buildingId: this.addForm.buildingId,
        startTime: value[0],
        endTime: value[1]
      }
      const res = await calculateAmountAPI(obj)
      this.addForm.paymentAmount = res.data
    },
    // 关闭添加账单对话框时的执行函数
    closeDialog() {
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    // 取消添加
    cancel() {
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    // 确认添加
    async confirmAdd() {
      await this.$refs.addForm.validate()
      const obj = { ...this.addForm }
      obj.startTime = this.addForm.time[0]
      obj.endTime = this.addForm.time[1]
      delete obj.time
      await addBillAPI(obj)
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
      this.getPropertyList()
    },
    // 查看账单详情
    async viewBillDetail(id) {
      this.viewBillVisible = true
      const res = await getBillDetailAPI(id)
      console.log(res)
      this.billDetail = res.data
    },
    closeDetail() {
      this.billDetail = {}
      this.viewBillVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.property-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  font-size: 14px;

  .search-main {
    width: 240px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container{
  padding: 10px 50px;
  font-size: 14px;
}

.title{
  position: absolute;
  top: 0;
  left: 0;
  padding: 16px;
  font-size: 16px;
}
</style>
