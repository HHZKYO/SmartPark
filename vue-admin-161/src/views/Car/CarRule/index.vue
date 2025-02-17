<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="openDialog()">增加停车计费规则</el-button>
      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ chargeTypeObj[scope.row.chargeType] }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="params.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>

    <!-- 新增弹框 -->
    <el-dialog :visible.sync="dialogVisible" width="680px" title="新增规则">
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="计费规则编号" prop="ruleNumber">
            <el-input v-model="addForm.ruleNumber" />
          </el-form-item>
          <el-form-item label="计费规则名称" prop="ruleName">
            <el-input v-model="addForm.ruleName" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="addForm.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-container rules" style="display:flex">
            <el-form-item label="免费时长">
              <el-input-number
                v-model="addForm.freeDuration"
                controls-position="right"
                :min="1"
              />
              分钟
            </el-form-item>
            <el-form-item label="收费上限">
              <el-input v-model="addForm.chargeCeiling" style="width:120px" />
              元
            </el-form-item>
          </div>
          <!-- == 根据计费方式切换计费规则表单项 == -->
          <el-form-item label="计费规则" class="rules" required>
            <!-- 按时长收费区域 -->
            <div v-if="addForm.chargeType==='duration'" class="duration" style="display:flex">
              每
              <el-form-item prop="durationTime">
                <el-input-number
                  v-model="addForm.durationTime"
                  controls-position="right"
                  :min="1"
                />
              </el-form-item>
              小时
              <el-form-item prop="durationPrice">
                <el-input v-model="addForm.durationPrice" class="input-box" />
              </el-form-item>
              元
            </div>
            <!-- 按次收费区域 -->
            <div v-if="addForm.chargeType==='turn'" class="turn" style="display:flex">
              每次
              <el-form-item prop="turnPrice">
                <el-input v-model="addForm.turnPrice" class="input-box" />
              </el-form-item>
              元
            </div>
            <!-- 按分段收费区域 -->
            <div v-if="addForm.chargeType==='partition'" class="partition">
              <div class="item" style="display:flex">
                <el-form-item prop="partitionFrameTime">
                  <el-input-number
                    v-model="addForm.partitionFrameTime"
                    controls-position="right"
                    :min="1"
                  />
                </el-form-item>
                小时内,每小时收费
                <el-form-item prop="partitionFramePrice">
                  <el-input v-model="addForm.partitionFramePrice" class="input-box" style="width:100px" />
                </el-form-item>
                元
              </div>
              <div class="item" style="display:flex;margin:30px auto 0">
                每增加
                <el-form-item prop="partitionIncreaseTime">
                  <el-input-number
                    v-model="addForm.partitionIncreaseTime"
                    controls-position="right"
                    :min="1"
                  />
                </el-form-item>
                小时,增加
                <el-form-item prop="partitionIncreasePrice">
                  <el-input v-model="addForm.partitionIncreasePrice" class="input-box" style="width:120px;" />
                </el-form-item>
                元
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="cancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="addConfirm()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addRuleAPI, getRuleListAPI } from '@/apis/car'
import { utils, writeFileXLSX } from 'xlsx'

export default {
  name: 'Building',
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      chargeTypeObj: {
        'duration': '时长收费',
        'turn': '按次收费',
        'partition': '分段收费'
      },
      // 计费规则表单对象
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      },
      // 计费规则校验规则对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 导出计费规则
    // 处理数据
    exportToExcel() {
      const keys = ['id', 'ruleNumber', 'ruleName', 'freeDuration', 'chargeCeiling', 'chargeType', 'ruleNameView']
      const newDataList = this.ruleList.map((obj, index) => {
        const newObj = {}
        keys.forEach(keyStr => {
          if (keyStr === 'chargeType') {
            newObj[keyStr] = this.chargeTypeObj[obj[keyStr]]
          } else if (keyStr === 'id') {
            newObj[keyStr] = index + 1
          } else {
            newObj[keyStr] = obj[keyStr]
          }
        })
        return newObj
      })
      // 1. 创建一个新的工作簿
      const workbook = utils.book_new()
      // 2. 创建一个工作表 要求一个对象数组格式（可以根据需要创建多个）
      const worksheet = utils.json_to_sheet(newDataList)
      // 3. 把工作表添加到工作簿  Data为工作表名称
      utils.book_append_sheet(workbook, worksheet, '停车计费规则')
      // 改写表头
      // const keys = Object.keys(this.ruleList[0])
      // 准备字典
      const keyObj = {
        'id': '序号',
        'ruleNumber': '计费规则编号',
        'ruleName': '计费规则名称',
        'freeDuration': '免费时长(分钟)',
        'chargeCeiling': '收费上线(元)',
        'chargeType': '计费方式',
        'ruleNameView': '计费规则'
      }
      // 对象字段属性数组->中文字符串数组
      const headerList = keys.map(item => keyObj[item])
      utils.sheet_add_aoa(worksheet, [headerList], { origin: 'A1' })
      // 4. 导出方法进行导出
      writeFileXLSX(workbook, '行车管理-计费规则管理.xlsx')
    },
    // 请求列表
    async getList() {
      const res = await getRuleListAPI(this.params)
      this.ruleList = res.data.rows
      this.total = res.data.total
      console.log(res)
    },
    // 页码切换
    currentChangeFn(nowPage) {
      this.params.page = nowPage
      this.getList()
    },
    // 条数切换
    sizeChangeFn(pageSize) {
      this.params.pageSize = pageSize
      this.getList()
    },
    // 添加/编辑计费规则显示框
    async openDialog() {
      this.dialogVisible = true
    },
    // 提交表单信息
    async addConfirm() {
      await this.$refs.addForm.validate()
      await addRuleAPI(this.addForm)
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
      this.getList()
    },
    // 取消表单
    cancel() {
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.rules .el-form-item {
  padding:0 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
