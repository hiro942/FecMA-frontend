import { FormItemRule, FormRules } from 'naive-ui'
import { EmailRegExp, NameRegExp } from '@/configs/regexes'
import useModelSettingsStore from '@/store/modelSettings'

const modelSettingsStore = useModelSettingsStore()

export const loginFormRules = {
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入邮箱')
        }
        if (!EmailRegExp.test(value)) {
          return new Error('请输入正确的邮箱')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
  ],
}

export const registerFormRules = (password: string): FormRules => ({
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入邮箱')
        }
        if (!EmailRegExp.test(value)) {
          return new Error('请输入正确的邮箱')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: ['input', 'blur'] },
  ],
  nickname: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入昵称')
        }
        if (!NameRegExp.test(value)) {
          return new Error('昵称只允许包含字母、数字及下划线')
        }
        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur'],
    },
  ],
  checkPassword: [
    {
      validator: (rule: FormItemRule, value: string): boolean => {
        return value === password
      },
      message: '两次密码输入不一致',
      trigger: ['input', 'blur'],
    },
  ],
})

export const resetPasswordFormRules = (password: string): FormRules => ({
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输入邮箱')
        }
        if (!EmailRegExp.test(value)) {
          return new Error('请输入正确的邮箱')
        }
        return true
      },
      trigger: 'input',
    },
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'input' }],
  password: [{ required: true, message: '请输入密码', trigger: 'input' }],
  checkPassword: [
    {
      validator: (rule: FormItemRule, value: string): boolean => {
        return value === password
      },
      message: '两次密码输入不一致',
      trigger: 'input',
    },
  ],
})

const commonSettingFormRules = {
  taskName: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  modelName: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  timeLimit: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  description: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

const secureBoostSettingFormRules = {
  evalType: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  numTrees: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  maxDepth: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

const logisticSettingFormRules = {
  evalType: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  maxIter: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  batchSize: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  optimizer: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  learningRate: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  penalty: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  alpha: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  earlyStop: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  decay: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  aggregateIters: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  useProximal: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  mu: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

const neuralNetworkSettingFormRules = {
  evalType: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  maxIter: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  batchSize: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  loss: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  optimizer: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  learningRate: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  earlyStop: {
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  encodeLabel: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  aggregateEveryNEpoch: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

const featureEngineeringSettingFormRules = {
  HomoFeatureBinning: {
    method: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
    binNames: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
      validator(rule: FormItemRule, value: string[]): boolean {
        console.log(value)
        return !!value.length
      },
    },
  },
  FeatureScale: {
    method: {
      required: true,
      message: '请输入',
      trigger: ['input', 'blur'],
    },
  },
}

const labelNameFormItemRule = {
  required: true,
  message: '请输入',
  trigger: ['input', 'blur'],
  validator() {
    if (modelSettingsStore.csvDatasetSettings.labelName.trim() === '') {
      return false
    }
  },
}

export const taskAssignFormRules = {
  commonSettingFormRules,
  secureBoostSettingFormRules,
  logisticSettingFormRules,
  neuralNetworkSettingFormRules,
  featureEngineeringSettingFormRules,
  labelNameFormItemRule,
}
