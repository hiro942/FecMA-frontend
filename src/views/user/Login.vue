<template>
  <div class="login-title">登录 {{ APP_NAME }}</div>

  <el-form
    class="login-form"
    label-position="top"
    label-width="100px"
    :model="loginFormState"
    style="max-width: 460px"
  >
    <el-form-item label="邮箱">
      <el-input v-model="loginFormState.email" />
    </el-form-item>

    <el-form-item>
      <template #label>
        <span>密码</span>
        <router-link
          to="/user/reset-password"
          tabindex="-1"
          style="float: right"
        >
          忘记密码?
        </router-link>
      </template>
      <el-input
        v-model="loginFormState.password"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button
        class="login-btn"
        size="large"
        :disabled="loginBtnDisabled"
        @click="handleSubmit"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>

  <div class="login-callout">
    <span>还没有账号? </span>
    <router-link to="/user/register" tabindex="-1"> 去注册 </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { APP_NAME } from '@/constants'
import { useLocal } from '@/utils/useLocalStorage'
import { loginFormValidator } from '@/utils/validators'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const loginFormState = reactive<UserAPI.LoginParams>({
  email: '',
  password: '',
})

// 按钮禁用
const loginBtnDisabled = computed(
  () => !(loginFormState.email && loginFormState.password),
)

// 登录
const handleSubmit = async () => {
  try {
    await loginFormValidator(loginFormState)
  } catch (err) {
    ElMessage.error((err as Error).message)
    return
  }

  try {
    await userStore.doLogin(loginFormState)
    ElNotification.success('登录成功')
    window.location.reload()
  } catch (err) {
    console.log((err as Error).message)
    ElNotification.error('登录失败')
  }
}

// 组件挂载后获取表单初始状态
onMounted(async () => {
  try {
    const localFormState = await useLocal('login-form-state')
    Object.assign(loginFormState, localFormState)
  } catch (err) {
    console.log('error occurred', err)
  }
})
</script>

<script lang="ts">
export default {
  name: 'Login',
}
</script>

<style scoped lang="scss">
.login-title {
  font-size: 24px;
  margin-bottom: 30px;
}

.login-form {
  padding: 20px 20px 10px 20px;
  border: 1px black solid;
  border-radius: 5px;

  .login-btn {
    background-color: #238636;
    color: white;
    width: 100%;
    margin-top: 10px;
  }
}

.login-callout {
  margin-top: 40px;
  padding: 10px 0;
  border: 1px black solid;
  border-radius: 5px;
}
</style>
