<template>
  <n-h1>注册 {{ APP_NAME }}</n-h1>
  <div class='rounded-xl border-black border-2 p-6'>
    <n-form
      ref='formRef'
      class='text-left'
      :model='registerFormState'
      :rules='registerFormRules(registerFormState.password)'
    >
      <n-form-item path='email' label='邮箱'>
        <n-auto-complete v-model:value='registerFormState.email' placeholder=''
                         :options='autocompleteEmailOptions(registerFormState.email)' />
      </n-form-item>
      <n-form-item path='captcha' label='验证码'>
        <n-input-group>
          <n-input v-model:value='registerFormState.captcha' placeholder='' />
          <n-button
            class='w-24'
            v-show='!countDownActive'
            @click='getEmailCaptcha'
          >
            获取验证码
          </n-button>
          <n-button class='w-24' disabled v-show='countDownActive'>
            <n-countdown
              ref='countdownRef'
              :duration='59 * 1000'
              :active='countDownActive'
              :render='renderCountdown'
              @finish='handleCountDownFinish'
            />
          </n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item path='nickname' label='昵称'>
        <n-input v-model:value='registerFormState.nickname' placeholder='' />
      </n-form-item>
      <n-form-item path='password' label='密码'>
        <n-input
          v-model:value='registerFormState.password'
          type='password'
          @input='handlePasswordInput'
          placeholder=''
        />
      </n-form-item>
      <n-form-item
        ref='checkPasswordFormItemRef'
        first
        path='checkPassword'
        label='确认密码'
      >
        <n-input
          v-model:value='registerFormState.checkPassword'
          :disabled='!registerFormState.password'
          type='password'
          placeholder=''
        />
      </n-form-item>
    </n-form>

    <n-button class='w-full' type='primary' @click='handleRegister'>
      注册
    </n-button>
  </div>

  <div class='rounded-xl border-black border-2 p-3 mt-6'>
    <span>已经有账号? </span>
    <router-link class='text-blue-500' :to="{ name: 'Login' }">
      去登录
    </router-link>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { CountdownInst, CountdownProps, FormInst, FormItemInst, useMessage } from 'naive-ui'
import { getRegisterEmailCaptcha, register } from '@/api/user'
import { useRouter } from 'vue-router'
import { registerFormRules } from '@/configs/formRules'
import { APP_NAME } from '@/configs/app'
import { autocompleteEmailOptions } from '@/configs/autocompleteOptions'

const router = useRouter()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const checkPasswordFormItemRef = ref<FormItemInst | null>(null)
const countdownRef = ref<CountdownInst | null>(null)
const registerFormState = ref<UserModels.RegisterParams>({
  email: '',
  captcha: '',
  nickname: '',
  password: '',
  checkPassword: ''
})

const handlePasswordInput = () => {
  if (registerFormState.value.checkPassword) {
    checkPasswordFormItemRef.value?.validate().catch(() => {
    })
  }
}

const countDownActive = ref(false)
const handleCountDownFinish = () => {
  countDownActive.value = false
  countdownRef.value?.reset()
}
const renderCountdown: CountdownProps['render'] = ({
                                                     hours,
                                                     minutes,
                                                     seconds
                                                   }) => {
  return `${String(seconds).padStart(2, '0')}秒后重试`
}

// 获取邮箱验证码
const getEmailCaptcha = async (): Promise<void> => {
  try {
    await getRegisterEmailCaptcha({ email: registerFormState.value.email })
    message.success(`已发送验证邮件至邮箱: ${registerFormState.value.email}`)
    countDownActive.value = true
  } catch (err: any) {
    message.error(err.message)
  }
}

// 注册
const handleRegister = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value
    ?.validate(async (errors) => {
      if (!errors) {
        try {
          await register(registerFormState.value)
          message.success('注册成功')
          await router.replace({ name: 'Login' })
        } catch (err: any) {
          message.error(err.message)
        }
      }
    })
    .catch(() => {
    })
}
</script>
