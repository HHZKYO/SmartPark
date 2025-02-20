<template>
  <div class="warn-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input
        v-model="query.poleName"
        placeholder="请输入一体杆内容"
        class="search-main"
      />
      <span class="search-label">一体杆编号：</span>
      <el-input
        v-model="query.poleNumber"
        placeholder="请输入一体杆编号"
        class="search-main"
      />
      <span class="search-label">处置状态：</span>
      <el-select v-model="query.handleStatus">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        class="search-btn"
        @click="search"
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
          <template #default="{row}">
            <el-button size="mini" type="text" :disabled="row.handleStatus !== 0">派单</el-button>
            <el-button size="mini" type="text">详情</el-button>
            <el-button size="mini" type="text" :disabled="row.handleStatus === 1 || row.handleStatus === 2">删除</el-button>
          </template>
        </el-table-column>
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
      warningList: [], // 表单数据
      total: null, // 总条数
      // 处置状态列表
      statusList: [
        {
          value: '0',
          label: '未派单'
        },
        {
          value: '1',
          label: '已派单'
        },
        {
          value: '2',
          label: '已接单'
        },
        {
          value: '3',
          label: '已完成'
        }
      ]
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
      this.total = res.data.total
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
    },
    // 切换页码
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getPoleWarningList()
    },
    // 切换条数
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getPoleWarningList()
    },
    // 查询功能
    search() {
      this.query.page = 1
      this.getPoleWarningList()
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

.page-container {
  padding: 4px 0px;
  text-align: right;
}
</style>
