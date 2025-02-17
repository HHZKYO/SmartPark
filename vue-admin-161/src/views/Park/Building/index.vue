<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchFn">查询</el-button>
    </div>
    <!-- 添加楼宇弹框 -->
    <el-button type="primary" @click="$router.push('/add-building')">添加楼宇</el-button>
    <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
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
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delBuilding(scope.row.id)">删除</el-button>
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
import { delBuildingAPI, getBuildingListAPI } from '@/apis/building'
import { utils, writeFileXLSX } from 'xlsx'

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
      buildingTotal: 0,
      statusObj: {
        '0': '闲置中',
        '1': '租赁中'
      }
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    // 导出计费规则
    // 处理数据
    exportToExcel() {
      const keys = ['id', 'name', 'floors', 'area', 'propertyFeePrice', 'status']
      const newDataList = this.buildingList.map((obj, index) => {
        const newObj = {}
        keys.forEach(keyStr => {
          if (keyStr === 'status') {
            newObj[keyStr] = this.statusObj[obj[keyStr]]
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
      utils.book_append_sheet(workbook, worksheet, '楼宇列表')
      // 改写表头
      // const keys = Object.keys(this.ruleList[0])
      // 准备字典
      const keyObj = {
        'id': '序号',
        'name': '楼宇名称',
        'floors': '层数',
        'area': '在管面积(㎡)',
        'propertyFeePrice': '物业费(元/㎡)',
        'status': '状态'
      }
      // 对象字段属性数组->中文字符串数组
      const headerList = keys.map(item => keyObj[item])
      utils.sheet_add_aoa(worksheet, [headerList], { origin: 'A1' })
      // 4. 导出方法进行导出
      writeFileXLSX(workbook, '园区管理-楼宇管理.xlsx')
    },
    // 获取楼宇列表
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
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
      this.params.page = 1
      this.getBuildingList()
    },
    // 删除楼宇
    delBuilding(id) {
      this.$confirm('此操作将永久删除该楼宇, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delBuildingAPI(id)
        this.getBuildingList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑楼宇
    edit(id) {
      this.$router.push(`/add-building?id=${id}`)
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
