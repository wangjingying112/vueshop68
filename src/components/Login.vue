<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form :rules="loginFormRules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password>
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login()">登录</el-button>
            <el-button type="info" @click="reset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    //表单域重置
    reset() {
      this.$refs.loginFormRef.resetFields()
    },
    // 管理员登录系统
    login() {
      // 导航到后台首页
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          const { data: dt } = await this.$http.post('/login', this.loginForm)
          //用户名，密码错误提示
          if (dt.meta.status !== 200) {
            //提示错误信息
            return this.$message.error(dt.meta.msg)
          }
          window.sessionStorage.setItem('token', dt.data.token)
          this.$router.push('/home')
        }
      })
    }
  },
  data() {
    return {
      //给 各个表单域 定义校验规则
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '用户名必填', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      //用户登录表单数据对象(用户名、密码)
      loginForm: {
        username: '',
        password: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 50px;
      box-sizing: border-box;
    }
    #logo-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
