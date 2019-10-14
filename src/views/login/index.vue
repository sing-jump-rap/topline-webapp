<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="标题"/>
          <!-- 登录表单 -->
          <van-cell-group>
            <van-field
            v-model="user.mobile"
                required
                clearable
                label="手机号"
                placeholder="请输入手机号"
            />
            <van-field
            v-model="user.code"
                type="password"
                label="验证码"
                placeholder="请输入验证码"
                required
            />
          </van-cell-group>

          <!-- 登录按钮 -->
          <div class="btn-wrap">
              <van-button @click="onLogin" class="btn" type="info">登录</van-button>
          </div>
  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {

    async onLogin () {
      // 表单验证
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '登陆中'
      })
      try {
        // 提交
        const { data } = await login(this.user)
        console.log(data)

        // 结束login
        toast.clear()

        // 登录成功
        this.$toast.success({
          duration: 2000,
          message: '登录成功'
        })
      } catch (err) {
        toast.clear()
        //   失败进入(为更严谨加入if判断)
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  .btn-wrap {
    padding: 20px;
    .btn {
      width: 100%;
      background-color: #6db4fb;
      color: #fff;
    }
  }
}
</style>
