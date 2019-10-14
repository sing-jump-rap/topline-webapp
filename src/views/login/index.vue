<template>
  <div class="login">
      <!-- 导航栏 -->
      <van-nav-bar title="标题"/>
          <!-- 登录表单 -->
          <ValidationObserver ref="loginForm">
            <van-cell-group>
              <!-- 表单验证插件                   （规则）-->
              <ValidationProvider name="手机号" rules="required|phone" v-slot="{ errors }">
                  <van-field
                  v-model="user.mobile"
                      required
                      clearable
                      label="手机号"
                      placeholder="请输入手机号"
                      :error-message="errors[0]"
                  />
              </ValidationProvider>

              <!-- 表单验证插件 -->
              <ValidationProvider name="验证码" rules="required|max:6" v-slot="{ errors }">
                  <van-field
                  v-model="user.code"
                      type="password"
                      label="验证码"
                      placeholder="请输入验证码"
                      required
                      :error-message="errors[0]"
                  />
              </ValidationProvider>
            </van-cell-group>
          </ValidationObserver>

          <!-- 登录按钮 -->
          <div class="btn-wrap">
              <van-button @click="onLogin" class="btn" type="info">登录</van-button>
          </div>
  </div>
</template>

<script>
// import request from '@/utils/request'
import { login } from '@/api/user'
import { setItem } from '@/utils/storage'
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
      // 表单验证（表单验证插件js验证）
      const isValid = await this.$refs.loginForm.validate()
      // 如果验证失败，阻止表单提交
      if (!isValid) {
        return
      }

      // 验证通过调用loading接口
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
        // 将服务器返回的token存储到vuex
        this.$store.commit('setUser', data.data)
        // 将token本地存储
        setItem('user', data.data)

        // 提示成功消息
        this.$toast.success({
          duration: 2000,
          message: '登录成功'
        })
      } catch (err) {
        toast.clear()
        //   登录失败进入(为更严谨加入if判断)
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
