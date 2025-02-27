<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="searchFn">查询</el-button>
    </div>
    <div class="create-container">
      <auth-btn btn-perm="sys:user:add_edit">
        <el-button type="primary" @click="addEmployee">添加员工</el-button>
      </auth-btn>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="员工姓名" width="130" prop="name" />
        <el-table-column label="登录账号" width="120" prop="userName" />
        <el-table-column label="联系方式" width="140" prop="phonenumber" />
        <el-table-column label="角色" width="130" prop="roleName" />
        <el-table-column label="状态" width="90" prop="status" :formatter="formatterStatus" />
        <el-table-column label="添加时间" prop="createTime" width="210" />
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <auth-btn btn-perm="sys:user:add_edit">
              <el-button size="mini" type="text" @click="edit(scope.row.id)">编辑</el-button>
            </auth-btn>
            <auth-btn btn-perm="sys:user:remove">
              <el-button size="mini" type="text" @click="delEmployee(scope.row.id)">删除</el-button>
            </auth-btn>
            <auth-btn btn-perm="sys:user:resetPwd">
              <el-button size="mini" type="text">重置密码</el-button>
            </auth-btn>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="480px"
      @open="openDialog"
      @close="closeDialog"
    >
      <div class="title">{{ title }}</div>
      <!-- 表单接口 -->
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
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
import { createEmployeeAPI, delEmployeeAPI, editEmployeeAPI, getEmployeeDetailAPI, getEmployeeListAPI } from '@/apis/employee'
import { getRoleListAPI } from '@/apis/system'

export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [], // 员工列表数据
      // 获取员工列表请求参数
      params: {
        page: 1,
        pageSize: 10,
        name: '' // 员工姓名
      },
      total: null, // 员工总数
      dialogVisible: false, // 弹框显示/隐藏
      // 弹框数据
      addForm: {
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      title: '添加员工',
      id: null, // 员工id
      roleList: [], // 角色列表数据
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    // 切换页码
    pageChange(page) {
      this.params.page = page
      this.getEmployeeList()
    },
    // 格式化状态列内容
    formatterStatus(row) {
      const keyObj = {
        0: '禁用',
        1: '启用'
      }
      return keyObj[row.status]
    },
    // 弹框打开时的执行函数
    async openDialog() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    // 弹框关闭时的执行函数
    closeDialog() {
      this.dialogVisible = false
      this.$refs.addForm.resetFields()
    },
    // 打开弹框
    addEmployee() {
      this.dialogVisible = true
      this.title = '添加员工'
    },
    // 确认添加
    async confirmAdd() {
      await this.$refs.addForm.validate()
      if (this.id) {
        const obj = {
          id: this.id,
          ...this.addForm
        }
        await editEmployeeAPI(obj)
      } else {
        await createEmployeeAPI(this.addForm)
      }
      // 关闭弹框
      this.dialogVisible = false
      // 重新刷新列表
      this.getEmployeeList()
      // 清空表单记录
      this.$refs.addForm.resetFields()
    },
    // 取消添加
    cancel() {
      this.$refs.addForm.resetFields()
      this.dialogVisible = false
    },
    // 删除员工
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getEmployeeList()
      })
    },
    // 查询
    searchFn() {
      this.params.page = 1
      this.getEmployeeList()
    },
    // 编辑
    async edit(id) {
      const res = await getEmployeeDetailAPI(id)
      for (const key in this.addForm) {
        this.addForm[key] = res.data[key]
      }
      this.id = id
      this.title = '编辑员工信息'
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
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
  padding: 16px;
  font-size: 16px;
}
</style>
