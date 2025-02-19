<template>
  <div class="rod-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">一体杆名称：</span>
      <el-input
        v-model="query.poleName"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">一体杆编号：</span>
      <el-input
        v-model="query.poleNumber"
        clearable
        placeholder="请输入内容"
        class="search-main"
      />
      <span class="search-label">运行状态：</span>
      <el-select v-model="query.poleStatus">
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
      <el-button type="primary" @click="addRod">添加一体杆</el-button>
      <!-- <el-button @click="dels">批量删除</el-button> -->
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="formList">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" width="135px" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType" :formatter="formatterType" />
        <el-table-column label="运行状态" prop="poleStatus" :formatter="formatterStatus" />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
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
    <!-- 添加一体杆对话框 -->
    <el-dialog :visible.sync="areaDialogVisible" width="500px">
      <div class="title">{{ title }}</div>
      <div class="form-container">
        <el-form ref="rodForm" label-position="top" :model="addForm" :rules="addFormRules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="addForm.poleName" placeholder="请输入一体杆名称" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="addForm.poleNumber" placeholder="请输入一体杆编号" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="addForm.poleIp" placeholder="请输入一体杆Ip" />
          </el-form-item>
          <el-form-item label="关联区域" prop="areaId">
            <el-select v-model="addForm.areaId" placeholder="请选择">
              <el-option
                v-for="item in relevanceAreaList"
                :key="item.areaId"
                :value="item.areaId"
                :label="item.areaName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select v-model="addForm.poleType" placeholder="请选择">
              <el-option
                v-for="item in poleTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="cancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd()">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRelevanceAreaListAPI } from '@/apis/area'
import { addRodAPI, editRodAPI, getRodListAPI } from '@/apis/rod'
import { validPoleIp } from '@/utils/validate'

export default {
  data() {
    return {
      // 查询参数
      query: {
        page: 1,
        pageSize: 8,
        poleName: '',
        poleNumber: '',
        poleStatus: '' // 运行状态，0：正常，1：异常
      },
      total: null, // 一体杆总数
      // 表单参数
      formList: [],
      // 一体杆状态表
      statusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '正常'
        },
        {
          value: '1',
          label: '异常'
        }
      ],
      areaDialogVisible: false, // 对话框显示/隐藏
      title: '添加一体杆',
      // 添加/编辑一体杆参数
      addForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: null,
        poleType: ''
      },
      id: null, // 一体杆Id
      // 关联区域列表
      relevanceAreaList: [],
      // 一体杆类型列表
      poleTypeList: [
        { id: 'entrance', name: '入口' },
        { id: 'export', name: '出口' }
      ],
      addFormRules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆Ip', trigger: 'blur' },
          { validator: this.validatorPoleIp, trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'change' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getRelevanceAreaList()
  },
  methods: {
    // 获取一体杆列表
    async getList() {
      const res = await getRodListAPI(this.query)
      this.total = res.data.total
      this.formList = res.data.rows
    },
    // 切换页码
    currentChangeFn(nowPage) {
      this.query.page = nowPage
      this.getList()
    },
    // 切换条数
    sizeChangeFn(pageSize) {
      this.query.pageSize = pageSize
      this.getList()
    },
    // 一体杆类型格式化内容
    formatterType(row) {
      const keyObj = {
        'entrance': '入口',
        'export': '出口'
      }
      return keyObj[row.poleType]
    },
    // 一体杆状态格式化内容
    formatterStatus(row) {
      const keyObj = {
        0: '正常',
        1: '异常'
      }
      return keyObj[row.poleStatus]
    },
    // 查询按钮
    searchFn() {
      this.query.page = 1
      this.getList()
    },
    // 获取关联区域列表
    async getRelevanceAreaList() {
      const res = await getRelevanceAreaListAPI()
      this.relevanceAreaList = res.data
    },
    // 添加一体杆
    addRod() {
      this.areaDialogVisible = true
    },
    // 一体杆Ip校验
    validatorPoleIp(rule, value, callback) {
      if ((validPoleIp(value))) callback()
      else callback(new Error('请输入正确Ip，格式为：172.16.39.xxx'))
    },
    // 提交确认
    async confirmAdd() {
      await this.$refs.rodForm.validate()
      if (this.id) {
        const data = {
          id: this.id,
          ...this.addForm
        }
        await editRodAPI(data)
      } else {
        await addRodAPI(this.addForm)
      }
      this.$refs.rodForm.resetFields()
      this.id = null
      this.areaDialogVisible = false
      this.getList()
    },
    // 取消按钮
    cancel() {
      this.$refs.rodForm.resetFields()
      this.id = null
      this.areaDialogVisible = false
    },
    // 编辑
    edit(data) {
      this.areaDialogVisible = true
      for (const key in this.addForm) {
        this.addForm[key] = data[key]
      }
      this.id = data.id
    }
  }
}
</script>

<style lang="scss" scoped>
.rod-container {
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
