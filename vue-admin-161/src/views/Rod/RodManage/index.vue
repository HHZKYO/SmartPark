<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input
        v-model="query.poleName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">一体杆编号：</span>
      <el-input
        v-model="query.poleNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">运行状态：</span>
      <el-select v-model="query.poleStatus">
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
        @click="searchFn"
      >查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary">添加一体杆</el-button>
      <!-- <el-button @click="dels">批量删除</el-button> -->
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="formList">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" width="135px" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType" :formatter="formatterType" />
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formatterStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
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
import { getRodListAPI } from '@/apis/rod'

export default {
  data() {
    return {
      // 查询参数
      query: {
        page: 1,
        pageSize: 8,
        poleName: '',
        poleNumber: '',
        poleStatus: '' // 运行状态，0：正常，1：异常
      },
      total: null, // 一体杆总数
      // 表单参数
      formList: [],
      // 一体杆状态表
      statusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '异常'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取一体杆列表
    async getList() {
      const res = await getRodListAPI(this.query)
      this.total = res.data.total
      this.formList = res.data.rows
    },
    // 切换页码
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getList()
    },
    // 切换条数
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getList()
    },
    // 一体杆类型格式化内容
    formatterType(row) {
      const keyObj = {
        'entrance': '入口',
        'export': '出口'
      }
      return keyObj[row.poleType]
    },
    // 一体杆状态格式化内容
    formatterStatus(row) {
      const keyObj = {
        0: '正常',
        1: '异常'
      }
      return keyObj[row.poleStatus]
    },
    // 查询按钮
    searchFn() {
      this.query.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
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
    width: 220px;
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

.form-container {
  padding: 0px 80px;
}
</style>
