<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id ? '编辑角色':'添加角色' }}</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="nowActive" finish-status="success">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="nowActive === 0" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="nowActive === 1" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                default-expand-all
                check-strictly
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="nowActive === 2" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in treeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="disabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  check-strictly
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title', disabled: () => true}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="last">上一步</el-button>
        <el-button type="primary" @click="next">
          {{ nowActive === 2 ? '完成' : '下一步' }}
        </el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { createRoleUserAPI, getRoleDetailAPI, getTreeListAPI, updateRoleAPI } from '@/apis/system'

export default {
  data() {
    return {
      nowActive: 0, // 当前步骤
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeList: [], // 权限树形列表
      perms: [] // 选择的所有权限点的二维数组
    }
  },
  computed: {
    id() {
      return this.$route.query.roleId
    }
  },
  created() {
    this.getTreeList()
    if (this.id) {
      this.getRoleDetailFn()
    }
  },
  methods: {
    // 获取某个角色下的详情（用于数据回显）
    async getRoleDetailFn() {
      const res = await getRoleDetailAPI(this.id)
      this.roleForm.roleName = res.data.roleName
      this.roleForm.remark = res.data.remark
      // 权限点回显
      this.$refs.tree.forEach((treeCom, index) => {
        treeCom.setCheckedKeys(res.data.perms[index])
      })
    },
    // 获取权限点列表
    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
    },
    // 点击进入下一步
    async next() {
      // if (this.nowActive === 2) return
      if (this.nowActive === 0) {
        // 输入角色信息
        await this.$refs.roleForm.validate()
        this.nowActive < 2 && this.nowActive++
      } else if (this.nowActive === 1) {
        this.perms = []
        // 分配权限点
        this.$refs.tree.forEach(treeCom => {
          const keys = treeCom.getCheckedKeys()
          this.perms.push(keys)
        })
        const resultArr = this.perms.flat()
        if (resultArr.length > 0) {
          this.nowActive < 2 && this.nowActive++
          this.$nextTick(() => {
            console.log(this.$refs.disabledTree)
            this.$refs.disabledTree.forEach((treeCom, index) => {
              treeCom.setCheckedKeys(this.perms[index])
            })
          })
        }
      } else {
        if (this.id) {
          // 编辑
          await updateRoleAPI({
            ...this.roleForm,
            perms: this.perms,
            roleId: this.id
          })
        } else {
          // 添加
          // 本次状态完成 => 提交数据
          await createRoleUserAPI({
            ...this.roleForm,
            perms: this.perms
          })
        }
        this.$router.back()
      }
    },
    // 点击进入上一步
    last() {
      this.nowActive > 0 && this.nowActive--
    }
  }
}
</script>

<style scoped lang="scss">
.add-role {
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

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
}
</style>
