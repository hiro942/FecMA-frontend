<template>
  <n-form ref="denseFormRef" :label-width="80" :model="dense">
    <n-form-item label="神经元" path="units">
      <n-input-number
        v-model:value="dense.units"
        placeholder="请输入"
        min="1"
      />
    </n-form-item>
    <n-form-item label="激活函数" path="activation">
      <n-select
        v-model:value="dense.activation"
        :options="activationOptions"
        placeholder="请选择"
      />
    </n-form-item>
    <n-form-item label="权重初始化" path="kernel_initializer">
      <n-select
        v-model:value="dense.kernel_initializer"
        :options="kernelInitOptions"
        placeholder="请选择"
      />
    </n-form-item>
    <n-form-item label="添加偏置单元" path="use_bias">
      <n-select
        v-model:value="dense.use_bias"
        :options="switchOptions"
        placeholder="请选择"
      />
    </n-form-item>
    <n-form-item
      v-if="dense.use_bias"
      label="偏置初始化"
      path="bias_initializer"
    >
      <n-select
        v-model:value="dense.bias_initializer"
        :options="biasInitOptions"
        placeholder="请选择"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { switchOptions } from '@/configs/selectOptions'
import useLayerStore from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/layer'

defineProps<{ dense: any }>()

const { activationOptions, biasInitOptions, kernelInitOptions } =
  useLayerStore()
</script>