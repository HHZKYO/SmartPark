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
      <el-table style="width: 100%" :data="enterpriseList" @expand-change="expendChangeFn">
        <!-- 新增：展开部分 -->
        <el-table-column type="expand">
          <template #default="scope">
            <el-table :data="scope.row.list">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <el-table-column label="合同状态" prop="status">
                <template #default="props">
                  <el-tag :type="formatterStatus(props.row.status)">
                    {{ TYPEMAP[props.row.status] }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="{row}">
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="row.status === 0 || row.status === 3"
                    @click="renewRent(row)"
                  >
                    续租
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="row.status === 3"
                    @click="backRentFn(row.id)"
                  >
                    退租
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    :disabled="row.status !== 3"
                    @click="deleteRent(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="showAddRentDialog(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text" @click="$router.push(`/ep-detail?id=${scope.row.id}`)">查看</el-button>
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
    <el-dialog :visible.sync="rentDialogVisible" width="580px">
      <div class="title">{{ title }}</div>
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
              :http-request="uploadHandle"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 续租合同的对话框 -->
    <el-dialog :visible.sync="rentDialogVisible" width="580px">
      <div class="title">{{ title }}</div>
      <!-- 表单模版 -->
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-input v-model="buildingName" :disabled="isDisabled" />
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
              :http-request="uploadHandle"
              :before-upload="beforeUpload"
              :limit="1"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { deleteEnterpriseAPI } from '@/apis/enterprise'
import { createRentAPI, deleteRentAPI, getEnterpriseListAPI, getRentBuildListAPI, getRentListAPI, outRentAPI, uploadAPI } from '@/apis/park'

export default {
  data() {
    return {
      TYPEMAP: {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      },
      params: { // 查询参数
        page: 1, // 这是指第几页
        pageSize: 2, // 这是每一页的条数
        name: '' // 要查询的企业名字
      },
      buildingName: '', // 楼宇名称
      title: '', // 续租合同/添加合同
      isDisabled: false, // 租赁楼宇的选择框是否禁用
      enterpriseList: [], // 企业列表
      enterpriseTotal: 0, // 企业总数
      rentDialogVisible: false, // 对话框显示/隐藏
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业id
        type: 0, // 合同类型(0代表添加合同，1代表续签合同)
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
    // 退租
    backRentFn(rentId) {
      this.$confirm('确认退租吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 1. 调用接口
        await outRentAPI(rentId)
        // 2. 重新拉取列表
        this.getList()
        this.$message({
          type: 'success',
          message: '退租成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退租'
        })
      })
    },
    // 续租
    renewRent(data) {
      this.rentForm.enterpriseId = data.id
      console.log(data)
      this.title = '续租合同'
      this.isDisabled = true
      this.rentDialogVisible = true
      this.rentForm.buildingId = data.buildingId
      this.buildingName = data.buildingName
    },
    // 格式化合同状态的样式
    formatterStatus(status) {
      const statusObj = {
        0: 'warning',
        1: 'success',
        2: 'info',
        3: 'danger'
      }
      return statusObj[status]
    },
    // 监听展开行的打开/关闭事件
    async expendChangeFn(row, rows) {
      // row是当前展开/关闭行的数据对象，rows是所有展开行的数据对象
      if (rows.includes(row)) {
        const res = await getRentListAPI(row.id)
        // eslint-disable-next-line
        row.list = res.data
      }
    },
    // 确认提交租赁合同表单
    async confirmAdd() {
      const obj = { ...this.rentForm }
      obj.startTime = this.rentForm.rentTime[0]
      obj.endTime = this.rentForm.rentTime[1]
      delete obj.rentTime
      await createRentAPI(obj)
      this.$refs.addForm.resetFields()
      this.rentDialogVisible = false
    },
    // 取消提交
    cancel() {
      this.$refs.addForm.resetFields()
      this.rentDialogVisible = false
    },
    // 上传租赁合同文件
    async uploadHandle(file) {
      const fd = new FormData()
      fd.append('file', file.file)
      fd.append('type', 'contract')
      const res = await uploadAPI(fd)
      this.rentForm.contractId = res.data.id
      this.rentForm.contractUrl = res.data.url
    },
    // 租赁文件合同的校验
    beforeUpload(file) {
      const list = ['application/pdf', 'application/msword'] // MIME媒体类型（参考mdn）
      const isFile = list.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isFile) {
        this.$message.error('上传头像图片只能是 .pdf/.doc 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      if (isFile && isLt5M) {
        return true
      } else {
        return Promise.reject()
      }
    },
    // 获取可租赁的楼宇列表
    async getRentBuildList() {
      const res = await getRentBuildListAPI()
      this.rentBuildList = res.data
    },
    // 获取列表
    async getList() {
      const res = await getEnterpriseListAPI(this.params)
      const list = res.data.rows.map(obj => {
        return {
          ...obj,
          list: []
        }
      })
      this.enterpriseList = list
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
      this.rentForm.enterpriseId = id
      this.title = '添加合同'
      this.rentDialogVisible = true
    },
    // 删除合同
    deleteRent(id) {
      this.$confirm('此操作将删除该合同，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteRentAPI(id)
        this.getList()
        this.$message({
          type: 'success',
          message: '删除成功'
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

.title{
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
  font-size: 16px;
}
</style>
