<script setup lang='ts'>
import type { IBounds, IResolutionRatio } from './convert/index'
import type { UploadProps  } from 'element-plus'
import { ref, reactive, computed, watch } from 'vue';
import { Connection } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
import { drawGeo, drawGeoInWorker } from './convert/index'
import { download } from '@/utils/tools'

// 默认颜色
const defaultBackgroundColor = 'rgba(0, 0, 0, 1)'
const defaultLineColor = 'rgba(255, 255, 255, 1)'

// refs: DOM元素或组件
const resultDiv = ref<HTMLDivElement>() // 预览div
const upload = ref() // 上传组件

// 输出图像相关的数据
const backgroundColor = ref(defaultBackgroundColor) // 图片背景色
const lineColor = ref(defaultLineColor) // 线条颜色
const useWorker = ref(true) // 是否使用worker加速渲染
const ranges = reactive<IBounds>({ // 范围
  lb: [90, -45],
  rt: [180, 45]
})
/**
 * 点击“输出图片按钮”事件
 */
function outputImage() {
  if (!geoJsonData) {
    ElMessage({ message: '请选择文件', type: 'error', })
    return
  }
  drawDataInCanvas(geoJsonData) // 画图
}
/**
 * 根据geojson数据画图
 * @param data geojson数据
 */
function drawDataInCanvas(data: any) {
  const originData = {
    geoData: data, 
    bounds: ranges, 
    resolutionRatio: resolutionRatio,
    backgroundColor: backgroundColor.value,
    lineColor: lineColor.value,
  }
  console.log(useWorker.value)
  if (useWorker.value) { // 在worker中渲染
    drawGeoInWorker(originData).then(resultCanvas => {
      convertCanvasToImage(resultCanvas)
    })
  } else { // 同步渲染
    const resultCanvas = drawGeo(originData)
    convertCanvasToImage(resultCanvas)
  }
}
/**
 * 把包含图像信息的canvas下载到本地
 * @param canvas 包含图像信息的canvas
 */
function convertCanvasToImage(canvas: HTMLCanvasElement) {
  const url = canvas.toDataURL("image/png")
  showPreview(url)
  download('test', url)
}
/**
 * 预览图像
 * @param url base64图像
 */
function showPreview(url: string) {
  const resultDivEl = resultDiv.value as HTMLDivElement
  resultDivEl.style.backgroundImage = `url("${url}")`
}

// 处理文件选择
const fileName = ref('') // 文件名
let geoJsonData: any = null // geojson数据
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
    geoJsonData = data
  }
  file && fileReader.readAsText(file)
}
// 点击选择时清除上次选择
function uploadClick() {
  upload.value.clearFiles()
  geoJsonData = null
}

// 处理分辨率
const connected = ref(true) // 宽高是否关联
const resolutionRatio = reactive<IResolutionRatio>({ // 宽高
  x: 800,
  y: 800
})
const rangeRate = computed(() => { // 根据范围计算出的宽高比例
  const rtd = ranges.rt[0] - ranges.lb[0]
  const lbd = ranges.rt[1] - ranges.lb[1]
  return rtd !== 0 ? Math.abs(lbd / rtd) : 1
})
watch(rangeRate, () => computeY())
/**
 * 切换宽高关联状态
 */
function connect() {
  connected.value = !connected.value
  computeY()
}
/**
 * 根据比例计算高度
 */
function computeY() {
  if (!connected.value) return
  resolutionRatio.y = Math.round(resolutionRatio.x * rangeRate.value)
}

/**
 * clear时恢复默认颜色
 * @param e 颜色，清空时是 null
 * @param tp 类型
 */
function colorPickerChange(e: string, tp: 'background' | 'line') {
  if (!e) {
    tp === 'background' && (backgroundColor.value = defaultBackgroundColor)
    tp === 'line' && (lineColor.value = defaultLineColor)
  }
}
</script>

<template>
  <div class="draw-map">
    <section class="btns">
      <div class="select-file">
        <el-form :inline="true">
          <el-form-item label="">
            <el-upload
              ref="upload"
              accept=".json, .geojson"
              :show-file-list="false"
              :multiple="false"
              :limit="1"
              :on-change="selectFile"
              :auto-upload="false"
            >
              <template #trigger>
                <el-button type="primary" @click="uploadClick">选择文件</el-button>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="">
            <div class="files-list">
              <div class="text-inner" :title="fileName">
                <span>已选择：{{ fileName  || '' }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="起始经度:">
            <el-input v-model.number="ranges.lb[0]" type="number" style="width: 130px;" placeholder="起始经度"></el-input>
          </el-form-item>
          <el-form-item label="结束经度:">
            <el-input v-model.number="ranges.rt[0]" type="number" style="width: 130px;" placeholder="结束经度"></el-input>
          </el-form-item>
          <el-form-item label="起始纬度:">
            <el-input v-model.number="ranges.lb[1]" type="number" style="width: 130px;" placeholder="起始纬度"></el-input>
          </el-form-item>
          <el-form-item label="结束纬度:">
            <el-input v-model.number="ranges.rt[1]" type="number" style="width: 130px;" placeholder="结束纬度"></el-input>
          </el-form-item>
          <el-form-item label="分辨率:">
            <el-input-number
              style="width: 130px;"
              v-model="resolutionRatio.x"
              controls-position="right"
              @change="computeY"
              step-strictly
              :min="10"
              :max="10000"
            ></el-input-number>
            <el-icon :color="connected ? '#409EFC' : '#4d4d4d'" style="margin: 0 10px; cursor: pointer;" @click="connect">
              <Connection/>
            </el-icon>
            <el-input-number
              style="width: 130px;"
              :disabled="connected"
              v-model="resolutionRatio.y"
              controls-position="right"
              step-strictly
              :min="10"
              :max="10000"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="背景颜色:">
            <el-color-picker v-model="backgroundColor" show-alpha @change="(e: string) => colorPickerChange(e, 'background')"></el-color-picker>
          </el-form-item>
          <el-form-item label="线条颜色:">
            <el-color-picker v-model="lineColor" show-alpha @change="(e: string) => colorPickerChange(e, 'line')"></el-color-picker>
          </el-form-item>
          <el-form-item label="worker:">
            <el-switch v-model="useWorker" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="outputImage">输出图片</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section class="canvas-section">
      <div class="result-img" ref="resultDiv"></div>
    </section>
  </div>
</template>

<style lang='scss' scoped>
.draw-map {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .btns {
    padding: $small-space;
    .select-file {
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      .files-list {
        padding: 0 5px;
        display: inline-flex;
        align-items: center;
        width: 150px;
        > .text-inner {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .canvas-section {
    flex: 1;
    min-height: 0;
    padding: $small-space;
    overflow: auto;
    .result-img {
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      border: 1px solid #999999;
    }
  }
}
</style>