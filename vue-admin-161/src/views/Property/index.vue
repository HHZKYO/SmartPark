<template>
  <div class="property-container">
    <!-- 查询 -->
    <div class="search-container">
      <span>企业名称：</span>
      <el-input
        clearable
        placeholder="请输入企业名称"
        class="search-main"
      />
      <span>缴费时间：</span>
      <el-input class="search-main" />
      <el-button
        type="primary"
        class="search-btn"
      >查询</el-button>
    </div>
    <!-- 添加账单区域 -->
    <div class="create-container">
      <el-button type="primary">添加账单</el-button>
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
          <template>
            <el-button size="mini" type="text">查看</el-button>
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
  </div>
</template>

<script>
import { getPropertyListAPI } from '@/apis/property'

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
      total: null // 列表信息总数
    }
  },
  created() {
    this.getPropertyList()
  },
  methods: {
    // 获取物业费列表信息
    async getPropertyList() {
      const res = await getPropertyListAPI(this.query)
      console.log(res)
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
