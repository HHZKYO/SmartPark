<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchFn">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="buildingList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="楼宇名称" width="180" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" width="120" prop="area" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="状态" prop="status" :formatter="formatterFn" />
        <el-table-column label="操作">
          <template>
            <el-button
              size="mini"
              type="text"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :total="buildingTotal"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="params.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { getBuildingListAPI } from '@/apis/building'

export default {
  name: 'Building',
  data() {
    return {
      params: {
        name: '',
        page: 1,
        pageSize: 4
      },
      buildingList: [],
      buildingTotal: 0
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    // 获取楼宇列表
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
      console.log(res)
      this.buildingList = res.data.rows
      this.buildingTotal = res.data.total
    },
    // 页码切换
    currentChangeFn(nowPage) {
      this.params.page = nowPage
      this.getBuildingList()
    },
    // 条数切换
    sizeChangeFn(pageSize) {
      this.params.pageSize = pageSize
      this.getBuildingList()
    },
    // 格式化状态列内容
    formatterFn(row) {
      const keyObj = {
        0: '闲置中',
        1: '租赁中'
      }
      return keyObj[row.status]
    },
    // 楼宇查询
    searchFn() {
      this.getBuildingList()
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);;
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
