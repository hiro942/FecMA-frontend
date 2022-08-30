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

    <el-form-item label="批量大小 (-1 代表全批量)" prop="batchSize">
      <el-input-number v-model="settings.batchSize" :precision="0" :min="-1" />
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

const settings = useModelSettings().logisticRegressionSettings
</script>
