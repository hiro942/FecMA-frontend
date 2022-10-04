<template>
  <div class="login-title">登录 {{ APP_NAME }}</div>

  <el-form
    class="login-form"
    label-position="top"
    label-width="100px"
    :model="loginFormState"
    style="max-width: 460px"
    :rules="formValidationRules"
  >
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="loginFormState.email" />
    </el-form-item>

    <el-form-item prop="password">
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
import { APP_NAME } from '@/constants/global'
import { LocalStorage, setLocal, useLocal } from '@/utils/localStorage'
import { loginFormValidator } from '@/utils/validators'
import useUserStore from '@/store/modules/user'
import { useMessage } from 'naive-ui'

const message = useMessage()
const userStore = useUserStore()

const loginFormState = reactive<UserModels.LoginParams>({
  email: '',
  password: '',
})

onMounted(async () => {
  // 组件挂载后获取表单初始状态
  try {
    const localFormState = await useLocal(LocalStorage.LoginForm)
    Object.assign(loginFormState, localFormState)
  } catch (err) {
    console.warn((err as Error).message)
  }
})

const formValidationRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 按钮禁用
const loginBtnDisabled = computed(
  () => !(loginFormState.email && loginFormState.password)
)

// 登录
const handleSubmit = async () => {
  try {
    await loginFormValidator(loginFormState)
  } catch (err: any) {
    message.error(err.message)
    return
  }

  try {
    await userStore.doLogin(loginFormState)
    setLocal(LocalStorage.LoginForm, loginFormState)
    window.location.reload()
  } catch (err: any) {
    message.error(err.message)
  }
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
