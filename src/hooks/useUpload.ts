import { ref } from 'vue'
import {
  UploadFile,
} from 'element-plus'

export default function useUpload() {
  const uploadTrainFile = ref()
  const uploadEvaluateFile = ref()

  const handleTrainFileChange = (uploadFile: UploadFile) => {
    if (uploadFile.raw) {
      uploadTrainFile.value = uploadFile.raw
    }
  }

  const handleEvaluateFileChange = (uploadFile: UploadFile) => {
    if (uploadFile.raw) {
      uploadEvaluateFile.value = uploadFile.raw
    }
  }

  return {
    uploadTrainFile,
    uploadEvaluateFile,
    handleTrainFileChange,
    handleEvaluateFileChange,
  }
}
