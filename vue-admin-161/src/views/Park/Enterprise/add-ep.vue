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
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px" :model="addForm" :rules="addRules">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :label="item.industryName"
                  :value="item.industryCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                class="avatar-uploader"
                action="https://api-hmzs.itheima.net/v1/upload"
                :headers="{Authorization: `Bearer ${$store.state.user.token}`}"
                :data="{type: 'businessLicense'}"
                :show-file-list="false"
                :on-success="handleLicenseSuccess"
                :before-upload="beforeLicenseUpload"
                :http-request="uploadFn"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetFn">重置</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { createEnterpriseAPI, getEnterpriseDetailAPI, updateEnterpriseAPI } from '@/apis/enterprise'
import { getIndustryListAPI, uploadAPI } from '@/apis/park'
import { validChineseName, validMobile } from '@/utils/validate'

export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      industryList: [], // 行业列表
      imageUrl: '', // 营业执照图片地址
      addRules: {
        name: [
          { required: true, message: '企业名称为必填', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '法人为必填', trigger: 'blur' },
          { validator: this.validatorPersonName, trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '注册地址为必填', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '所在行业为必填', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '企业联系人为必填', trigger: 'blur' },
          { validator: this.validatorPersonName, trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '企业联系人电话为必填', trigger: 'blur' },
          { validator: this.validatorPersonMobile, trigger: 'blur' }
        ],
        businessLicenseId: [
          { required: true, message: '请上传营业执照', trigger: 'change' }
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
        return '编辑企业'
      } else {
        return '添加企业'
      }
    }
  },
  created() {
    this.getIndustryList()
    if (this.id) {
      this.getEnterpriseDetail()
    }
  },
  mounted() {
    // this.addForm.name = '劳动法撒'
    // this.addForm.legalPerson = '地方'
    // this.addForm.registeredAddress = '反对'
    // this.addForm.contact = '等方式'
    // this.addForm.contactNumber = '13628794489'
  },
  methods: {
    validatorPersonName(rule, value, callback) {
      if (validChineseName(value)) callback()
      else callback(new Error('请输入正确的中文名2-10位'))
    },
    validatorPersonMobile(rule, value, callback) {
      if (validMobile(value)) callback()
      else callback(new Error('请输入正确的手机号'))
    },
    // 获取行业列表
    async getIndustryList() {
      const res = await getIndustryListAPI()
      this.industryList = res.data
    },
    // 营业执照上传成功的回调
    handleLicenseSuccess(res) {
      // this.imageUrl = res.data.url
    },
    // 营业执照上传前的回调
    beforeLicenseUpload(file) {
      const list = ['image/jpeg', 'image/png'] // MIME媒体类型（参考mdn）
      const isJPG = list.includes(file.type)
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!')
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 3MB!')
      }
      if (isJPG && isLt3M) {
        return true
      } else {
        return Promise.reject()
      }
    },
    // 自定义上传过程(要自定义的原因：
    // upload组件内有原生的AJAX请求传递所选择的文件到action指定的后台接口，而我不想用组件上传)
    async uploadFn(fileObj) {
      const theFile = fileObj.file
      // 以下是纯前端预览
      // URL.createObjectURL把文件数据流转成一个前端临时的URL地址做纯前端预览（文件->地址)
      // 现在需要把File文件->Blob数据流
      // this.imageUrl = URL.createObjectURL(theFile)

      // 现在希望调用接口给，让服务器端返回图片，再服务器地址浏览
      // 文件对象->FormData容器对象->发给后台
      const fd = new FormData()
      fd.append('file', theFile)
      fd.append('type', 'businessLicense')
      const res = await uploadAPI(fd)
      this.imageUrl = res.data.url // 图片回显
      // 自己的数据要手动关联到表单数据对象的属性中，才能让表单校验通过
      this.addForm.businessLicenseUrl = res.data.url
      this.addForm.businessLicenseId = res.data.id
      // 单独再对businessLicenseId校验字段做一次校验
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    // 新增企业确定事件
    async confirmAdd() {
      await this.$refs.ruleForm.validate()
      const obj = {
        ...this.addForm,
        id: this.id
      }
      if (this.id) {
        await updateEnterpriseAPI(obj)
      } else {
        await createEnterpriseAPI(this.addForm)
      }
      this.$router.back()
    },
    // 获取企业信息详情
    async getEnterpriseDetail() {
      const res = await getEnterpriseDetailAPI(this.id)
      for (const key in this.addForm) {
        this.addForm[key] = res.data[key]
      }
      this.imageUrl = res.data.businessLicenseUrl
    },
    // 重置企业信息表单
    resetFn() {
      this.$refs.ruleForm.resetFields()
      this.imageUrl = ''
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
