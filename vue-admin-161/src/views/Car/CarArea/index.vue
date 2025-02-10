<template>
  <div class="area-container">
    <el-button type="primary">添加区域</el-button>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="areaList">
        <el-table-column type="index" label="序号" width="85" />
        <el-table-column label="区域名称" width="166" prop="areaName" />
        <el-table-column label="车位个数（个）" width="166" prop="spaceNumber" />
        <el-table-column label="面积（㎡）" width="166" prop="areaProportion" />
        <el-table-column label="计费规则" width="166" prop="ruleName" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作" width="166">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :total="areaAmount"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="params.pageSize"
        @current-change="currentChangeFn"
        @size-change="sizeChangeFn"
      />
    </div>
  </div>
</template>

<script>
import { getAreaListAPI } from '@/apis/area'

export default {
  data() {
    return {
      params: { // 查询参数
        page: 1, // 这是第几页
        pageSize: 6 // 这是每一页的条数
      },
      areaList: [], // 区域列表
      areaAmount: 0 // 区域数量
    }
  },
  created() {
    this.getAreaList()
  },
  methods: {
    // 获取区域列表
    async getAreaList() {
      const res = await getAreaListAPI(this.params)
      console.log(res)
      this.areaList = res.data.rows
      this.areaAmount = res.data.total
    },
    // 页码切换
    currentChangeFn(nowPage) {
      this.params.page = nowPage
      this.getAreaList()
    },
    // 条数切换
    sizeChangeFn(pageSize) {
      this.params.pageSize = pageSize
      this.getAreaList()
    }
  }
}
</script>

<style lang="scss" scoped>
.area-container{
  padding:10px;
}

.page-container{
    padding:4px 0px;
    text-align: right;
  }
</style>
