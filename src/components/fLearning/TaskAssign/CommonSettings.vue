<template>
  <el-form label-position="top" inline>
    <el-form-item :label="AliasCN['taskName']">
      <el-input
        v-model="settings.taskName"
        placeholder="例如：北京市海淀区房价预测"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['modelName']">
      <el-select v-model="settings.modelName" placeholder="选择训练模型">
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="AliasCN['timeLimit']">
      <el-config-provider :locale="locale">
        <el-date-picker
          v-model="selectedDate"
          type="datetime"
          placeholder="到期后不再接收新参与方"
          :default-time="defaultTime"
          @change="onDatePicked"
          @blur="onDatePicked"
        />
      </el-config-provider>
    </el-form-item>

    <el-form-item :label="AliasCN['numberOfPeers']">
      <el-input-number
        v-model="settings.numberOfPeers"
        :precision="0"
        :min="1"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['description']" style="width: 725px">
      <el-input
        v-model="settings.description"
        type="textarea"
        placeholder="描述该任务参加所需的限制条件。比如对数据格式与属性的要求（数据特征、数据量等）。"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AliasCN } from '@/constants/alias'
import { modelOptions } from '@/constants/model'
import useModelSettings from '@/store/modules/modelSettings'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = zhCn // 汉化 pagination 组件

const settings = useModelSettings().commonSettings

const selectedDate = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)

const onDatePicked = () => {
  settings.timeLimit = Math.round(
    (Date.parse(selectedDate.value) - Date.now()) / 1000
  )
}
</script>
