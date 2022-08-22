<template>
  <el-form-item label="最大迭代次数" prop="maxIter">
    <el-input v-model="settings.maxIter" />
  </el-form-item>

  <el-form-item label="批量大小" prop="batchSize">
    <el-input
      v-model="settings.batchSize"
      placeholder="Full-Batch 请设置为 -1"
    />
  </el-form-item>

  <el-form-item label="损失函数" prop="loss">
    <el-select v-model="settings.algorithm.loss" placeholder="请选择">
      <el-option
        v-for="item in lossOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </el-form-item>

  <el-form-item label="优化算法" prop="optimizer">
    <el-select
      v-model="settings.algorithm.optimizer.optimizer"
      placeholder="请选择"
    >
      <el-option
        v-for="item in optimizerOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </el-form-item>

  <el-form-item label="学习率" prop="learningRate">
    <el-input v-model="settings.algorithm.optimizer.learningRate" />
  </el-form-item>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modules/modelSettings'
import { lossOptions, optimizerOptions } from '@/constants/model'

const settings = useModelSettings().neuralNetworkSettings
</script>

<script lang="ts">
export default {
  name: 'NeuralNetworkSetting',
}
</script>

<style scoped></style>
