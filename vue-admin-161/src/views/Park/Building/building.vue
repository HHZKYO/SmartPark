<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加楼宇</span>
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
import { addBuildingAPI } from '@/apis/building'

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
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入楼宇面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 新增楼宇
    async confirm() {
      await addBuildingAPI(this.addForm)
      this.$router.back()
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
