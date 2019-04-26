<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>

    <!--卡片区-->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <!-- 添加用户弹框 -->
          <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    //修改用户1
    xiugai() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,

            this.editUser
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          //如果成功
          this.$message.success(dt.meta.msg)

          this.editUserDialog = false

          this.getUserList()
        }
      })
    },
    async showEditDialog(id) {
      const { data: dt } = await this.$http.get('users/' + id)
      this.editUser = dt.data
      this.editUserDialog = true
    },

    //删除用户，id：被删除用户的id
    delUser(id) {
      this.$confirm('确定要删除此条记录嘛?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //实现删除逻辑
          const { data: dt } = await this.$http.delete('users/' + id)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          //成功数据
          this.$message.success(dt.meta.msg)
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.getUserList()
        })

        .catch(() => {})
    },
    //表单再次校验
    tianjia() {
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('users', this.addUser)
          console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          //如果成功
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },

    // 分页相关1
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getUserList()
    },
    // 分页相关2
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.userList = dt.data.users
    }
  },

  data() {
    //表单验证部分/手机号自定义验证
    //rule: /value:被验证的数据/callback:校验的回调函数
    var checkMobile = (rule, value, callback) => {
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        //校验失败
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      // 修改用户相关1
      editUserDialog: false,

      editUserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          //自定义规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //表单元素
      editUser: {
        username: '',
        email: '',
        mobile: ''
      },

      /*添加用户相关1 */
      //表单验证部分
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          //自定义规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //表单元素
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //弹框
      addUserDialog: false,

      //页数
      tot: 0,
      // 数据列表
      userList: [],
      // 查询数据条件
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示数据条数
      }
    }
  }
}
</script>

 <style lang="less" scoped>
</style>
