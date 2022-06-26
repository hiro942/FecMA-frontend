<template>
  <div class="reset-password-title">重置密码 {{ APP_NAME }}</div>

  <el-form
    class="reset-password-form"
    label-position="left"
    label-width="100px"
    :model="resetPasswordFormState"
    style="max-width: 460px"
  >
    <!--      hide-required-asterisk-->

    <el-form-item label="邮箱">
      <el-input v-model="resetPasswordFormState.email" />
    </el-form-item>

    <el-form-item class="form-item-captcha" label="验证码">
      <el-input
        v-model="resetPasswordFormState.captcha"
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

    <el-form-item label="新密码">
      <el-input
        v-model="resetPasswordFormState.newPassword"
        type="password"
        show-password
      />
    </el-form-item>

    <el-form-item label="确认密码">
      <el-input
        v-model="resetPasswordFormState.newCheckPassword"
        type="password"
        show-password
      />
    </el-form-item>

    <el-button
      class="reset-password-btn"
      size="large"
      :disabled="resetPasswordBtnDisabled"
      @click="handleSubmit"
    >
      重置
    </el-button>
  </el-form>

  <div class="reset-password-callout">
    <span>不想重置了? </span>
    <router-link to="/user/login" tabindex="-1"> 直接登录 </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElNotification } from 'element-plus'
import { APP_NAME } from '@/constants'
import { getResetPasswordCaptcha, resetPassword } from '@/api/user'
import router from '@/router'
import { resetPasswordFormValidator } from '@/utils/validators'

const resetPasswordFormState = reactive<UserAPI.ResetPasswordParams>({
  email: '',
  captcha: '',
  newPassword: '',
  newCheckPassword: '',
})

// 按钮禁用
const captchaBtnDisabled = ref(false)
const resetPasswordBtnDisabled = computed<boolean>(
  () =>
    !(
      resetPasswordFormState.email &&
      resetPasswordFormState.captcha &&
      resetPasswordFormState.newPassword &&
      resetPasswordFormState.newCheckPassword
    ),
)

// 重置密码
const handleSubmit = async (): Promise<void> => {
  try {
    await resetPasswordFormValidator(resetPasswordFormState)
  } catch (err) {
    ElNotification.error((err as Error).message)
    return
  }

  try {
    await resetPassword(resetPasswordFormState)
    ElNotification.success('重置密码成功')
    router.replace('/user/login') // 跳转至登录页
  } catch (err) {
    ElNotification.error('重置密码失败')
  }
}

// 获取邮箱验证码
const getEmailCaptcha = async (): Promise<void> => {
  try {
    const getEmailCaptchaParam: UserAPI.GetEmailCaptchaParams = {
      email: resetPasswordFormState.email,
    }
    await getResetPasswordCaptcha(getEmailCaptchaParam)
    captchaBtnDisabled.value = true
    ElNotification.success(
      `已发送验证邮件至邮箱: ${resetPasswordFormState.email}`,
    )
  } catch (err) {
    console.log((err as Error).message)
    ElNotification.error('获取验证码失败')
  }
}

// 组件挂载后获取表单初始状态
onMounted(() => {
  const loginFormState = localStorage.getItem('login-form-state')
  if (loginFormState) {
    resetPasswordFormState.email = JSON.parse(loginFormState).email
  }
})
</script>

<style scoped lang="scss">
.reset-password-title {
  font-size: 24px;
  margin-bottom: 40px;
}

.reset-password-form {
  padding: 20px 20px 10px 20px;
  border: 1px black solid;
  border-radius: 5px;

  .reset-password-btn {
    background-color: #238636;
    color: white;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
  }
}

.reset-password-callout {
  margin-top: 20px;
  padding: 10px 0;
  border: 1px black solid;
  border-radius: 5px;
}
</style>
