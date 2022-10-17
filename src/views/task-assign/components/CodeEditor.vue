<template>
  <div style="padding-bottom: 20px;: ">网络结构配置</div>
  <div id="editor" style="width: 100%; height: 300px"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { onBeforeUnmount, onMounted } from 'vue'
import useModelSettings from '@/store/modules/modelSettings'

const modelSettings = useModelSettings()

// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorker(workerId: string, label: string): Promise<Worker> | Worker {
    if (label === 'jsonc') {
      return new JsonWorker()
    }
    return new EditorWorker()
  },
}
let editor: monaco.editor.IStandaloneCodeEditor

// 初始化编辑器
onMounted(() => {
  editor = monaco.editor.create(
    document.getElementById('editor') as HTMLElement,
    {
      value: modelSettings.neuralNetworkSettings.layers, // 编辑器内容
      language: 'jsonc', // 语言
      formatOnType: true,
    }
  )
})

// 销毁编辑器实例
onBeforeUnmount(() => editor.dispose())
</script>
