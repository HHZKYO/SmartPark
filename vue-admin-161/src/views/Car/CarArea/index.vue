<template>
  <div class="area-container">
    <AuthBtn btn-perm="parking:area:add_edit">
      <el-button type="primary" @click="showAddAreaDialog">添加区域</el-button>
    </AuthBtn>
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
          <template #default="scope">
            <AuthBtn btn-perm="parking:area:add_edit">
              <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            </AuthBtn>
            <AuthBtn btn-perm="parking:area:remove">
              <el-button size="mini" type="text" @click="deleteArea(scope.row.id)">删除</el-button>
            </AuthBtn>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部分页显示区域 -->
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
    <!-- 新增区域对话框 -->
    <el-dialog :visible.sync="areaDialogVisible" width="580px" @close="closeDialog">
      <div class="title">{{ formTitle }}</div>
      <div class="form-container">
        <el-form ref="areaForm" label-position="top" :model="areaForm" :rules="areaFormRules">
          <el-form-item label="区域名称" prop="areaName">
            <el-input v-model="areaForm.areaName" placeholder="请输入区域名称" />
          </el-form-item>
          <el-form-item label="车位数（个）" prop="spaceNumber">
            <el-input v-model="areaForm.spaceNumber" placeholder="请输入车位个数" />
          </el-form-item>
          <el-form-item label="面积（㎡）" prop="areaProportion">
            <el-input v-model="areaForm.areaProportion" placeholder="请输入面积" />
          </el-form-item>
          <el-form-item label="关联计费规则" prop="ruleId">
            <el-select v-model="areaForm.ruleId" placeholder="请选择">
              <el-option
                v-for="item in ruleIdList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="areaForm.remark" type="textarea" />
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
import { addAreaAPI, deleteAreaAPI, editAreaAPI, getAreaListAPI } from '@/apis/area'
import { validAreaOfRegion } from '@/utils/validate'

export default {
  data() {
    return {
      params: { // 查询参数
        page: 1, // 这是第几页
        pageSize: 6 // 这是每一页的条数
      },
      areaList: [], // 区域列表
      areaAmount: 0, // 区域数量
      areaDialogVisible: false, // 新增区域对话框显示/隐藏
      // 添加区域信息表单
      areaForm: {
        areaName: '', // 区域名称
        spaceNumber: null, // 车位个数
        areaProportion: null, // 面积
        ruleId: null, // 计费规则
        remark: '' // 备注
      },
      id: null, // 区域id
      formTitle: '', // 编辑/添加区域的名称
      // 表单信息校验对象
      areaFormRules: {
        areaName: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ],
        spaceNumber: [
          { required: true, message: '请输入车位个数', trigger: 'blur' },
          { validator: this.validatorAreaOfRegion, trigger: 'blur' }
        ],
        areaProportion: [
          { required: true, message: '请输入面积', trigger: 'blur' },
          { validator: this.validatorAreaOfRegion, trigger: 'blur' }
        ],
        ruleId: [
          { required: true, message: '请选择计费规则', trigger: 'change' }
        ]
      },
      // 管理计费规则列表
      ruleIdList: [
        { id: 1, name: '按分钟计费' },
        { id: 2, name: '按小时计费' },
        { id: 3, name: '按次收费' },
        { id: 4, name: '分段计费' }
      ]
    }
  },
  created() {
    this.getAreaList()
  },
  methods: {
    // 获取区域列表
    async getAreaList() {
      const res = await getAreaListAPI(this.params)
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
    },
    // 添加区域
    showAddAreaDialog() {
      this.areaDialogVisible = true
      this.formTitle = '添加区域'
    },
    // 删除区域
    deleteArea(id) {
      this.$confirm('此操作将永久删除该区域，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteAreaAPI(id)
        this.getAreaList()
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
    // 区域面积校验
    validatorAreaOfRegion(rule, value, callback) {
      if ((validAreaOfRegion(value))) callback()
      else callback(new Error('仅支持正整数'))
    },
    // 确认提交新增区域表单
    async confirmAdd() {
      await this.$refs.areaForm.validate()
      const data = {
        id: this.id,
        ...this.areaForm
      }
      if (this.id) {
        await editAreaAPI(data)
      } else {
        await addAreaAPI(this.areaForm)
      }
      this.$refs.areaForm.resetFields()
      this.areaDialogVisible = false
      this.getAreaList()
    },
    // 取消新增区域
    cancel() {
      this.$refs.areaForm.resetFields()
      this.areaDialogVisible = false
    },
    // 编辑区域
    edit(row) {
      this.areaDialogVisible = true
      this.formTitle = '编辑区域'
      this.id = row.id
      for (const key in this.areaForm) {
        this.areaForm[key] = row[key]
      }
    },
    // 弹框关闭时的执行函数
    closeDialog() {
      this.areaDialogVisible = false
      this.$refs.areaForm.resetFields()
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

.form-container{
  padding: 0px 80px;
}

.title{
  position: absolute;
  top: 0;
  left: 0;
  padding: 20px;
  font-size: 16px;
}
</style>
