<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">车主姓名：</span>
      <el-input clearable placeholder="请输入内容" class="search-main" />
      <span class="search-label">状态：</span>
      <el-select value="">
        <el-option v-for="item in []" :key="item.id" />
      </el-select>
      <el-button type="primary" class="search-btn">查询</el-button>
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary">添加月卡</el-button>
      <el-button>批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableData">
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatterFn" />
        <el-table-column label="操作" fixed="right" width="180">
          <template>
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination layout="total, prev, pager, next" :total="0" />
    </div>
  </div>
</template>

<script>
import { getCardListAPI } from '@/apis/car'

export default {
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取月卡列表
    async getList() {
      const res = await getCardListAPI(this.query)
      this.tableData = res.data.rows
    },
    // 格式化状态列内容
    formatterFn(row) {
      const keyObj = {
        0: '可用',
        1: '已过期'
      }
      return keyObj[row.cardStatus]
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
