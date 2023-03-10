import type { UploadProps  } from 'element-plus'
import { ref } from 'vue';

export function useSelFile() {
  // 处理文件选择
  const upload = ref() // 上传组件
  const fileName = ref('') // 文件名
  const geoJsonData = ref<any>(null) // geojson数据
  /**
   * 选择文件
   * @param uploadFile 本次选择的文件
   * @param uploadFiles 所有已选择文件列表
   */
  const selectFile: UploadProps['onChange'] = function (uploadFile) {
    fileName.value = uploadFile.name
    const file = uploadFile.raw
    const fileReader = new FileReader()
    fileReader.onload = function () {
      const content = this.result
      let data = null
      try {
        data = JSON.parse(content as string)
      } catch (error) {
        console.log(error)
      }
      // console.log(data)
      geoJsonData.value = data
    }
    file && fileReader.readAsText(file)
  }
  // 点击选择时清除上次选择
  const uploadClick = function () {
    upload.value.clearFiles()
    geoJsonData.value = null
  }
  return {
    upload,
    fileName,
    geoJsonData,
    selectFile,
    uploadClick
  }
}
