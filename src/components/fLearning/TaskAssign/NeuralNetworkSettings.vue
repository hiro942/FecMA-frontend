<template>
  <el-form label-position="top" inline>
    <el-form-item :label="AliasCN['maxIter']">
      <el-input-number
        v-model="settings.maxIter"
        :precision="0"
        :step="500"
        :min="1"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['batchSize']">
      <el-tooltip content="设置为-1代表Full-Batch">
        <el-input-number
          v-model="settings.batchSize"
          :precision="0"
          :min="-1"
        />
      </el-tooltip>
    </el-form-item>

    <el-form-item :label="AliasCN['loss']">
      <el-select v-model="settings.loss" placeholder="请选择">
        <el-option
          v-for="item in lossOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="AliasCN['optimizer']">
      <el-select v-model="settings.optimizer" placeholder="请选择">
        <el-option
          v-for="item in optimizerOptions.nn"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="AliasCN['learningRate']">
      <el-input-number
        v-model="settings.learningRate"
        :min="1e-9"
        :step="0.001"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['earlyStop']">
      <el-select v-model="settings.earlyStop">
        <el-option
          v-for="item in earlyStopOptions.lr"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="是否对Label进行Ont-Hot编码">
      <el-select v-model="settings.encodeLabel">
        <el-option
          v-for="item in switchOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="每多少个Epoch聚合一次模型">
      <el-input-number
        v-model="settings.aggregateEveryNEpoch"
        :precision="0"
        :step="1"
        :min="1"
      />
    </el-form-item>
  </el-form>

  <code-editor />
</template>

<script setup lang="ts">
import { AliasCN } from '@/constants/alias'
import useModelSettings from '@/store/modules/modelSettings'
import CodeEditor from '@/components/fLearning/TaskAssign/CodeEditor.vue'
import {
  lossOptions,
  optimizerOptions,
  earlyStopOptions,
  switchOptions,
} from '@/constants/model'

const settings = useModelSettings().neuralNetworkSettings
</script>

<style scoped></style>
