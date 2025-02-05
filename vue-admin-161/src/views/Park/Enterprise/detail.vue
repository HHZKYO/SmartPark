<template>
  <div class="detail-enterprise">
    <header class="add-header">
      <el-page-header content="查看企业" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">租赁记录</div>
        <div class="table-container">
          <el-table
            :data="rentList"
            style="width: 100%"
            border
          >
            <el-table-column
              type="index"
              label="序号"
              width="50"
            />
            <el-table-column
              prop="name"
              label="租赁楼宇"
              width="180"
            />
            <el-table-column
              label="租赁起止时间"
              width="280"
            >
              <template #default="{row}">
                {{ row.startTime }} - {{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="租赁合同(点击预览)"
            >
              <template #default="{row}">
                <el-button type="text">
                  <a :href="row.contractUrl" target="_blank">
                    {{ row.contractName }}
                  </a>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="录入时间"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template v-slot="{ row }">
                <el-button type="text" @click="downLoadFn(row)">合同下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { downloadContract, getEnterpriseDetailAPI } from '@/apis/park'

export default {
  data() {
    return {
      rentList: [], // 合同列表
      previewURL: 'https://view.officeapps.live.com/op/view.aspx?src=' // 预览地址
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 合同下载点击事件
    async downLoadFn(obj) {
      const blob = await downloadContract(obj.contractId)
      const url = URL.createObjectURL(blob)
      const theA = document.createElement('a')
      theA.href = url
      theA.download = obj.contractName
      theA.click()
    },
    // 企业详情+合同列表
    async getList() {
      const res = await getEnterpriseDetailAPI(this.$route.query.id)
      // 预处理预览地址
      // PDF：直接浏览器打开
      // 在线预览工具只能浏览 doc 文件，需要拼接前缀预览地址
      res.data.rent.forEach(obj => {
        const url = obj.contractUrl
        const extName = url.slice(url.lastIndexOf('.'))
        if (extName === '.doc') {
          obj.contractUrl = this.previewURL + obj.contractUrl
        }
      })
      this.rentList = res.data.rent
    }
  }
}
</script>

<style scoped lang="scss">
.detail-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 64px;
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
      margin-bottom: 20px;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
    }
    .table-container{
      padding:20px;
    }
    .preview{
      img{
        width: 100px;
      }
    }
  }
}
</style>
