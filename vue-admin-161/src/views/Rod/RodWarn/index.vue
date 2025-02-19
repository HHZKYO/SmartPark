<template>
  <div class="warn-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input
        placeholder="请输入一体杆内容"
        class="search-main"
      />
      <span class="search-label">一体杆编号：</span>
      <el-input
        placeholder="请输入一体杆编号"
        class="search-main"
      />
      <span class="search-label">处置状态：</span>
      <el-input class="search-main" />
      <el-button
        type="primary"
        class="search-btn"
      >查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="warningList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" width="135px" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="故障类型" prop="errorType" />
        <el-table-column label="处置状态" prop="handleStatus" :formatter="formatterStatus" />
        <el-table-column label="告警时间" prop="warningTime" />
        <el-table-column label="操作" fixed="right" width="200">
          <template>
            <el-button size="mini" type="text">派单</el-button>
            <el-button size="mini" type="text">详情</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPoleWaringListAPI } from '@/apis/rod'

export default {
  data() {
    return {
      // 获取告警记录列表查询参数
      query: {
        page: 1,
        pageSize: 8,
        poleName: '',
        poleNumber: '',
        handleStatus: '' // 处置状态0:未派单,1:已派单,2:已接单,3:已完成
      },
      warningList: [] // 表单数据
    }
  },
  created() {
    this.getPoleWarningList()
  },
  methods: {
    // 查询告警记录列表
    async getPoleWarningList() {
      const res = await getPoleWaringListAPI(this.query)
      this.warningList = res.data.rows
    },
    // 格式化处置状态内容
    formatterStatus(row) {
      const keyObj = {
        '0': '未派单',
        '1': '已派单',
        '2': '已接单',
        '3': '已完成'
      }
      return keyObj[row.handleStatus]
    }
  }
}
</script>

<style lang="scss" scoped>
.rod-container {
  padding: 20px;
  background-color: #fff;
}

.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  padding-bottom: 20px;
  font-size: 14px;

  .search-main {
    width: 220px;
    margin-right: 10px;
  }

  .search-btn {
    margin-left: 20px;
  }
}
</style>
