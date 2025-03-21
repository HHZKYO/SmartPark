<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        v-model="query.carNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        v-model="query.personName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="query.cardStatus">
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
      <el-button
        v-auth-dir="`parking:card:add_edit`"
        type="primary"
        @click="$router.push('/add-card')"
      >添加月卡</el-button>
      <auth-btn btn-perm="parking:card:remove">
        <el-button @click="dels">批量删除</el-button>
      </auth-btn>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column label="状态" prop="cardStatus" :formatter="formatterFn" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button
              v-auth-dir="`parking:card:recharge`"
              size="mini"
              type="text"
              @click="$router.push(`/card-renew?id=${scope.row.id}`)"
            >续费</el-button>
            <el-button
              v-auth-dir="`parking:card:query`"
              size="mini"
              type="text"
              @click="$router.push(`/card-detail?id=${scope.row.id}`)"
            >查看</el-button>
            <el-button
              v-auth-dir="`parking:card:add_edit`"
              size="mini"
              type="text"
              @click="edit(scope.row.id)"
            >编辑</el-button>
            <auth-btn btn-perm="parking:card:remove">
              <el-button
                size="mini"
                type="text"
                @click="del(scope.row.id)"
              >删除</el-button>
            </auth-btn>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
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
import { delCardAPI, getCardListAPI } from '@/apis/car'

export default {
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10,
        cardStatus: '',
        carNumber: '',
        personName: ''
      },
      tableData: [],
      total: 0,
      statusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '可用'
        },
        {
          value: '1',
          label: '已过期'
        }
      ],
      selectedCarList: []
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
      this.total = res.data.total
    },
    // 格式化状态列内容
    formatterFn(row) {
      const keyObj = {
        0: '可用',
        1: '已过期'
      }
      return keyObj[row.cardStatus]
    },
    // 页码切换
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getList()
    },
    // 条数切换
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getList()
    },
    // 查询按钮点击
    searchFn() {
      this.query.page = 1
      this.getList()
    },
    // 编辑月卡信息
    edit(id) {
      this.$router.push(`/add-card?id=${id}`)
    },
    // 删除
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delCardAPI(id)
        this.getList()
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
    // 表格选择的选项发生变化时
    handleSelectionChange(val) {
      // val：是选中的这些行的数据对象的数组集合
      this.selectedCarList = val
    },
    // 批量删除
    dels() {
      const ids = this.selectedCarList.map(obj => obj.id)
      this.$confirm('此操作将永久删除所选中的文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delCardAPI(ids.join(','))
        this.getList()
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
