<template>
  <n-h1>登录 {{ APP_NAME }}</n-h1>
  <div class='rounded-xl border-black border-2 p-6'>
    <n-form
      ref='formRef'
      class='text-left w-[200px]'
      :model='loginFormState'
      :rules='registerFormRules(loginFormState.password)'
    >
      <n-form-item path='email' label='邮箱'>
        <n-auto-complete v-model:value='loginFormState.email' placeholder=''
                         :options='autocompleteEmailOptions(loginFormState.email)' />
      </n-form-item>

      <n-form-item path='password' label='密码'>
        <n-input
          v-model:value='loginFormState.password'
          type='password'
          placeholder=''
        />
      </n-form-item>

      <n-button class='w-full' type='primary' @click='handleLogin'>
        登录
      </n-button>
    </n-form>
  </div>

  <div class='rounded-xl border-black border-2 p-3 mt-6'>
    <span>还没有账号? </span>
    <router-link class='text-blue-500' :to="{ name: 'Register' }">
      去注册
    </router-link>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import { registerFormRules } from '@/configs/formRules'
import { APP_NAME } from '@/configs/app'
import useUserStore from '@/store/user'
import { autocompleteEmailOptions } from '@/configs/autocompleteOptions'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()


const formRef = ref<FormInst | null>(null)
const loginFormState = ref<UserModels.LoginParams>({
  email: '',
  password: ''
})

// 登录
const handleLogin = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value
    ?.validate(async (errors) => {
      if (!errors) {
        try {
          await userStore.doLogin(loginFormState.value)
          message.success('登录成功')
        } catch (err: any) {
          message.error(err.message)
        }
      }
    })
    .catch(() => {
    })
}
</script>
