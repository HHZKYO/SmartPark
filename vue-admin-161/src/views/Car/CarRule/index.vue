<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary">增加停车计费规则</el-button>
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
  </div>
</template>

<script>
import { getRuleListAPI } from '@/apis/car'
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
      console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
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
