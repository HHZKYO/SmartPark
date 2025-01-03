<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchFn">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/add-ep')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="enterpriseList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="showAddRentDialog(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="enterpriseTotal"
        :page-size="params.pageSize"
        @current-change="currentChangeFn"
      />
    </div>

    <!-- 新增合同的对话框 -->
    <el-dialog title="添加合同" :visible.sync="rentDialogVisible" width="580px">
      <!-- 表单模版 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in rentBuildList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              action="#"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { deleteEnterpriseAPI } from '@/apis/enterprise'
import { getEnterpriseListAPI, getRentBuildListAPI } from '@/apis/park'

export default {
  data() {
    return {
      params: { // 查询参数
        page: 1, // 这是指第几页
        pageSize: 2, // 这是每一页的条数
        name: '' // 要查询的企业名字
      },
      enterpriseList: [], // 企业列表
      enterpriseTotal: 0, // 企业总数
      rentDialogVisible: false, // 对话框显示/隐藏
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentBuildList: [], // 可租赁的楼宇列表
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getRentBuildList()
  },
  methods: {
    // 获取可租赁的楼宇列表
    async getRentBuildList() {
      const res = await getRentBuildListAPI()
      console.log(res)
      this.rentBuildList = res.data
    },
    // 获取列表
    async getList() {
      const res = await getEnterpriseListAPI(this.params)
      this.enterpriseList = res.data.rows
      this.enterpriseTotal = res.data.total
    },
    // 页码切换
    currentChangeFn(page) {
      this.params.page = page
      this.getList()
    },
    // 企业查询
    searchFn() {
      this.params.page = 1
      this.getList()
    },
    // 编辑企业信息
    edit(id) {
      this.$router.push(`/add-ep?id=${id}`)
    },
    // 删除企业
    del(id) {
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteEnterpriseAPI(id)
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
    // 添加合同
    showAddRentDialog(id) {
      console.log(id)
      this.rentDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
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
