<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div
        v-for="item, index in roleList"
        :key="item.roleId"
        class="role-item"
        :class="{active: activeIndex === index}"
        @click="roleClickFn(index, item.roleId)"
      >
        <div class="role-info">
          <svg-icon icon-class="user" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <svg-icon icon-class="more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/add-role')">添加角色</el-button>
    </div>
    <!-- 右侧权限和成员 -->
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="myTree"
                :data="item.children"
                :props="{label: 'title', children: 'children', disabled: 'flag'}"
                show-checkbox
                default-expand-all
                check-strictly
                check-on-click-node
                :expand-on-click-node="false"
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员${roleUserTotal}`" name="member">
          <div class="user-wrapper">
            <el-table
              :data="roleUserList"
            >
              <el-table-column
                type="index"
                width="250"
                label="序号"
              />
              <el-table-column
                prop="name"
                label="员工姓名"
              />
              <el-table-column
                prop="userName"
                label="登录账号"
              />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleDetailAPI, getRoleListAPI, getRoleUserAPI, getTreeListAPI } from '@/apis/system'

export default {
  name: 'Role',
  data() {
    return {
      roleList: [], // 现有角色列表
      activeIndex: 0, // 记录哪项该高亮的下标
      treeList: [], // 所有权限点列表
      roleDetailList: [], // 权限点Id集合（二维数组）
      activeName: 'tree', // 标签页选中的name名字
      roleUserList: [], // 当前角色下的成员列表
      roleUserTotal: 0 // 当前角色下的成员总数
    }
  },
  async created() {
    await this.getRoleList()
    await this.getTreeList()
    this.getRoleDetailListFn(this.roleList[0].roleId) // 获取第一个角色下属的权限详情列表
    this.getMemberListFn(this.roleList[0].roleId) // 获取第一个角色下属的成员列表
  },
  methods: {
    // 获取所有功能权限列表
    async getTreeList() {
      const res = await getTreeListAPI()
      // 给所有对象都添加一个flag标记默认值false
      res.data.forEach(obj => {
        this.setFlagFn(obj)
      })
      this.treeList = res.data
    },
    // 准备一个函数用来实现递归
    setFlagFn(obj) {
      obj.flag = true
      if (obj.children) {
        obj.children.forEach(samllObj => {
          this.setFlagFn(samllObj)
        })
      }
    },
    // 点击某行角色
    roleClickFn(index, roleId) {
      this.activeIndex = index
      this.getRoleDetailListFn(roleId)
      this.getMemberListFn(roleId)
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    },
    // 请求指定角色下属的成员列表集合
    async getMemberListFn(roleId) {
      const res = await getRoleUserAPI(roleId)
      console.log(res)
      this.roleUserList = res.data.rows
      this.roleUserTotal = res.data.total
    },
    // 请求指定角色下属的功能权限列表集合
    async getRoleDetailListFn(roleId) {
      const roleRes = await getRoleDetailAPI(roleId)
      this.roleDetailList = roleRes.data.perms
      this.$refs.myTree.forEach((treeComponent, index) => {
        treeComponent.setCheckedKeys(this.roleDetailList[index])
      })
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
