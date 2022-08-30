<template>
  <div style="display: flex; column-gap: 30px; flex-wrap: wrap">
    <el-form-item label="最大迭代次数" prop="maxIter">
      <el-input-number
        v-model="settings.maxIter"
        :precision="0"
        :step="500"
        :min="1"
      />
    </el-form-item>

    <el-form-item label="batch size" prop="batchSize">
      <el-input-number v-model="settings.batchSize" :precision="0" :min="-1" />
    </el-form-item>

    <el-form-item label="损失函数" prop="loss">
      <el-select v-model="settings.loss" placeholder="请选择">
        <el-option
          v-for="item in lossOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="优化算法" prop="optimizer">
      <el-select v-model="settings.optimizer" placeholder="请选择">
        <el-option
          v-for="item in optimizerOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="学习率" prop="learningRate">
      <el-input-number
        v-model="settings.learningRate"
        :min="1e-9"
        :step="0.001"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modules/modelSettings'
import { lossOptions, optimizerOptions } from '@/constants/model'

const settings = useModelSettings().neuralNetworkSettings
</script>

<style scoped></style>
