<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ title }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">楼宇信息</div>
        <div class="form">
          <el-form :model="addForm" :rules="addFormRules" label-width="100px">
            <el-form-item label="楼宇名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="楼宇层数" prop="floors">
              <el-input v-model="addForm.floors" />
            </el-form-item>
            <el-form-item label="楼宇面积" prop="area">
              <el-input v-model="addForm.area" />
            </el-form-item>
            <el-form-item label="楼宇物业费" prop="propertyFeePrice">
              <el-input v-model="addForm.propertyFeePrice" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { addBuildingAPI, editBuildingAPI, getBuildingDetailAPI } from '@/apis/building'
import { validBuildingArea, validBuildingName, validFloor, validPropertyFeePrice } from '@/utils/validate'

export default {
  data() {
    return {
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' },
          { validator: this.validatorBuildingName, trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' },
          { validator: this.validatorFloor, trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入楼宇面积', trigger: 'blur' },
          { validator: this.validatorBuildingArea, trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' },
          { validator: this.validatorPropertyFeePrice, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    title() {
      if (this.id) {
        return '编辑楼宇'
      } else {
        return '添加楼宇'
      }
    }
  },
  created() {
    if (this.id) {
      this.getBuildingDetail(this.id)
    }
  },
  methods: {
    // 校验楼层
    validatorFloor(value, callback) {
      if (validFloor(value)) callback()
      else callback(new Error('请输入正确的楼层1-20'))
    },
    // 校验楼宇名称
    validatorBuildingName(value, callback) {
      if (validBuildingName(value)) callback()
      else callback(new Error('请输入正确的楼宇名称：办公楼n栋'))
    },
    // 校验楼宇面积
    validatorBuildingArea(value, callback) {
      if (validBuildingArea(value)) callback()
      else callback(new Error('请输入正确的楼宇面积'))
    },
    // 校验楼宇物业费
    validatorPropertyFeePrice(value, callback) {
      if (validPropertyFeePrice(value)) callback()
      else callback(new Error('请输入正确的物业费'))
    },
    // 确认提交
    async confirm() {
      const obj = {
        ...this.addForm,
        id: this.id
      }
      if (this.id) {
        await editBuildingAPI(obj)
      } else {
        await addBuildingAPI(this.addForm)
      }
      this.$router.back()
    },
    // 获取楼宇详情并回显
    async getBuildingDetail(id) {
      const res = await getBuildingDetailAPI(id)
      for (const key in this.addForm) {
        this.addForm[key] = res.data[key]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
::v-deep .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
