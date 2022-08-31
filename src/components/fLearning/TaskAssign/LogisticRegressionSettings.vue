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

    <el-form-item :label="AliasCN['optimizer']">
      <el-select v-model="settings.optimizer">
        <el-option
          v-for="item in optimizerOptions.lr"
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

    <el-form-item :label="AliasCN['penalty']">
      <el-select v-model="settings.penalty">
        <el-option
          v-for="item in penaltyOptions.lr"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="正则化系数">
      <el-input-number
        v-model="settings.alpha"
        :min="0.1"
        :precision="1"
        :step="0.1"
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

    <el-form-item label="学习率衰减系数">
      <el-tooltip content="lr = lr0 / (1 + decay * t)，t 为迭代次数">
        <el-input-number v-model="settings.decay" :precision="1" :step="0.1" />
      </el-tooltip>
    </el-form-item>

    <el-form-item label="每多少次Iteration聚合一次模型">
      <el-input-number
        v-model="settings.aggregateIters"
        :precision="0"
        :step="1"
        :min="1"
      />
    </el-form-item>

    <el-form-item label="是否添加近端项(Proximal Term)">
      <el-select v-model="settings.useProximal">
        <el-option
          v-for="item in switchOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item v-if="settings.useProximal" label="近端项缩放系数">
      <el-input-number
        v-model="settings.mu"
        :precision="1"
        :step="0.1"
        :min="0.1"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { AliasCN } from '@/constants/alias'
import useModelSettings from '@/store/modules/modelSettings'
import {
  optimizerOptions,
  penaltyOptions,
  earlyStopOptions,
  switchOptions,
} from '@/constants/model'

const settings = useModelSettings().logisticRegressionSettings
</script>
