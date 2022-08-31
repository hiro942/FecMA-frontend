<template>
  <el-form label-position="top" inline>
    <el-form-item :label="AliasCN['taskName']">
      <el-input v-model="settings.taskName" />
    </el-form-item>

    <el-form-item :label="AliasCN['numberOfPeers']">
      <el-input-number
        v-model="settings.numberOfPeers"
        :precision="0"
        :min="1"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['modelName']">
      <el-select v-model="settings.modelName" placeholder="请选择模型">
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="AliasCN['description']" style="width: 725px">
      <el-input
        v-model="settings.description"
        type="textarea"
        placeholder="所需数据、参与限制等"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AliasCN } from '@/constants/alias'
import { modelOptions, modelNames } from '@/constants/model'
import useModelSettings from '@/store/modules/modelSettings'

const settings = useModelSettings().commonSettings
</script>

<style scoped></style>
