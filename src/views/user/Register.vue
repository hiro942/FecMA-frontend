<template>
  <div class="register-title">注册 {{ APP_NAME }}</div>

  <el-form
    class="register-form"
    label-position="left"
    label-width="100px"
    :model="registerFormState"
    style="max-width: 460px"
    :rules="formValidationRules"
  >
    <!--      hide-required-asterisk-->

    <el-form-item label="邮箱" prop="email">
      <el-input v-model="registerFormState.email" />
    </el-form-item>

    <el-form-item class="form-item-captcha" label="验证码" prop="captcha">
      <el-input
        v-model="registerFormState.captcha"
        :style="{ width: `calc(100% - 102px)` }"
      />
      <el-button
        :disabled="captchaBtnDisabled"
        tabindex="-1"
        @click="getEmailCaptcha"
      >
        获取验证码
      </el-button>
    </el-form-item>

    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="registerFormState.nickname" />
    </el-form-item>

    <el-form-item label="密码" prop="password">
      <el-input
        v-model="registerFormState.password"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item label="确认密码" prop="checkPassword">
      <el-input
        v-model="registerFormState.checkPassword"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item label-width="0">
      <el-button
        class="register-btn"
        size="large"
        :disabled="registerBtnDisabled"
        @click="handleSubmit"
      >
        注册
      </el-button>
    </el-form-item>
  </el-form>

  <div class="register-callout">
    <span>已有账号? </span>
    <router-link to="/user/login" tabindex="-1"> 去登录 </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { APP_NAME } from '@/constants/global'
import { getRegisterEmailCaptcha, register } from '@/api/user'
import router from '@/router'
import { registerFormValidator } from '@/utils/validators'
import { useMessage } from 'naive-ui'

const message = useMessage()

const formValidationRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  checkPassword: [
    { required: true, message: '请再次确认密码', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
}

const registerFormState = reactive<UserModels.RegisterParams>({
  email: '',
  captcha: '',
  nickname: '',
  password: '',
  checkPassword: '',
})

// 按钮禁用
const captchaBtnDisabled = ref(false)
const registerBtnDisabled = computed<boolean>(
  () =>
    !(
      registerFormState.email &&
      registerFormState.captcha &&
      registerFormState.nickname &&
      registerFormState.password &&
      registerFormState.checkPassword
    )
)

// 获取邮箱验证码
const getEmailCaptcha = async (): Promise<void> => {
  try {
    const getEmailCaptchaParam: UserModels.GetEmailCaptchaParams = {
      email: registerFormState.email,
    }
    await getRegisterEmailCaptcha(getEmailCaptchaParam)
    captchaBtnDisabled.value = true
    ElNotification.success(`已发送验证邮件至邮箱: ${registerFormState.email}`)
  } catch (err: any) {
    message.error(err.message)
  }
}

// 注册
const handleSubmit = async (): Promise<void> => {
  try {
    await registerFormValidator(registerFormState)
  } catch (err: any) {
    message.error(err.message)
    return
  }

  try {
    await register(registerFormState)
    ElNotification.success('注册成功')
    await router.replace('/user/login') // 跳转至登录页
  } catch (err: any) {
    message.error(err.message)
  }
}
</script>

<style scoped lang="scss">
.register-title {
  font-size: 24px;
  margin-bottom: 40px;
}

.register-form {
  padding: 20px 20px 10px 20px;
  border: 1px black solid;
  border-radius: 5px;

  .register-btn {
    background-color: #238636;
    color: white;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
  }
}

.register-callout {
  margin-top: 20px;
  padding: 10px 0;
  border: 1px black solid;
  border-radius: 5px;
}
</style>
