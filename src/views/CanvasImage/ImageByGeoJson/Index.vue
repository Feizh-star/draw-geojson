<script setup lang='ts'>
import type { IAnyObject } from '@/types/global/common'
import type { IBounds, IResolutionRatio, IDrawProps } from './convert/draw'
import type { UploadProps  } from 'element-plus'
import { ref, reactive, computed, watch, toRaw } from 'vue';
import { Paperclip } from '@element-plus/icons'
import { ElMessage } from 'element-plus'
import { drawGeo, drawGeoInWorker } from './convert/index'
import { download } from '@/utils/tools'
import RightDrawer from '@/components/ImageByGeoJson/RightDrawer.vue'

// 默认颜色：一下颜色的key与colorType一一对应
const defaultColor = {
  backgroundColor: 'rgba(178, 206, 254, 1)', // 默认背景色
  lineColor: 'rgba(86, 129, 226, 1)' ,// 默认线条颜色
  fillColor: 'rgba(244, 247, 255, 1)', // 默认填充颜色
  shadowColor1: 'rgba(188, 198, 219, 1)', // 第一层阴影默认颜色
  shadowColor2: 'rgba(161, 183, 229, 1)', // 第二层阴影默认颜色
}

// refs: DOM元素或组件
const resultDiv = ref<HTMLDivElement>() // 预览div
const upload = ref() // 上传组件

const loading = ref(false) // loading

// 输出图像相关的数据
const useWorker = ref(true) // 是否使用worker加速渲染
// 范围
let ranges = ref<IBounds>({ 
  lb: [90, -45],
  rt: [180, 45]
})
// 阴影
const shadowInfo = ref<IAnyObject>({
  sOffsetX: 1.5, // 阴影水平距离-经度
  sOffsetY: 0.8, // 阴影垂直距离-纬度
  outRate: 0.6, // 第二层阴影延伸比例-相对于第一层
  sBlur1: 0, // 第一层阴影模糊距离-像素
  sBlur2: 0, // 第二层阴影模糊距离-像素
  shadowColor1: defaultColor.shadowColor1, // 第一层阴影默认颜色
  shadowColor2: defaultColor.shadowColor2, // 第一层阴影默认颜色
})
// 基本颜色（不包括阴影颜色）：key应该与colorType包含的类型————对应
const colorInfo = ref<IAnyObject>({
  backgroundColor: defaultColor.backgroundColor, // 背景颜色
  lineColor: defaultColor.lineColor, // 线条颜色
  fillColor: defaultColor.fillColor, // 填充颜色
  lineWidth: 1,
})
// 分辨率
const resolutionRatio = ref<IResolutionRatio>({
  x: 800,
  y: 800
})
// 抽希参数
const simpleInfo = ref<IAnyObject>({
  minArea: '25',
  tolerance: 0.18, // 简化多边型的公差，越大简化的越厉害
  precision: 6, // 经纬度保留的精度
  highQuality: false, // 简化多边型是否保持高质量
  includeZ: false // 坐标是否包含z轴
})

// 抽屉开关
const drawer = ref(false)
function openDrawer() {
  drawer.value = true
}

const hasResult = ref(false)
/**
 * 点击“输出图片按钮”事件
 */
function outputImage() {
  if (!geoJsonData) {
    ElMessage({ message: '请选择文件', type: 'error', })
    return
  }
  hasResult.value = false
  drawDataInCanvas(geoJsonData) // 画图
}
/**
 * 根据geojson数据画图
 * @param data geojson数据
 */
function drawDataInCanvas(data: any) {
  const originData: IDrawProps = {
    geoData: data, 
    bounds: ranges.value, 
    simpleInfo: toRaw(simpleInfo.value),
    resolutionRatio: resolutionRatio.value,
    colorInfo: toRaw(colorInfo.value),
    shadowInfo: toRaw(shadowInfo.value)
  }
  if (useWorker.value) { // 在worker中渲染
    loading.value = true
    drawGeoInWorker(originData).then(resultCanvas => {
      convertCanvasToImage(resultCanvas)
      loading.value = false
    })
  } else { // 同步渲染
    loading.value = true
    const resultCanvas = drawGeo(originData) as HTMLCanvasElement
    loading.value = false
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
  hasResult.value = true
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

</script>

<template>
  <div class="draw-map">
    <section class="btns">
      <el-upload
        ref="upload"
        class="my-upload"
        accept=".json, .geojson"
        :show-file-list="false"
        :multiple="false"
        :limit="1"
        :on-change="selectFile"
        :auto-upload="false"
      >
        <template #trigger>
          <div class="files-list" @click="uploadClick">
            <div class="text-inner" :title="fileName">
              <span>
                <span style="color: #666666;">GeoJson文件：</span>
                <el-icon color="#409EFC" style="cursor: pointer; vertical-align: bottom;">
                  <Paperclip/>
                </el-icon>
                {{ fileName  || '请选择文件' }}
              </span>
            </div>
          </div>
        </template>
      </el-upload>
      <el-button type="primary" @click="openDrawer">配置</el-button>
      <el-button type="primary" @click="outputImage">生成图片</el-button>
    </section>
    <section class="canvas-section">
      <el-skeleton style="width: 100%; height: 100%;" v-show="!hasResult && !loading">
        <template #template>
          <el-skeleton-item variant="image" style="width: 100%; height: 100%;" />
        </template>
      </el-skeleton>
      <el-skeleton style="width: 100%; height: 100%;" loading animated v-show="!hasResult && loading">
        <template #template>
          <el-skeleton-item variant="image" style="width: 100%; height: 100%;" />
        </template>
      </el-skeleton>
      <div class="result-img" ref="resultDiv" v-show="hasResult"></div>
    </section>
  </div>
  <RightDrawer 
    :default-color="defaultColor"
    v-model:drawer="drawer"
    v-model:ranges="ranges"
    v-model:resolution-ratio="resolutionRatio"
    v-model:simple-info="simpleInfo"
    v-model:color-info="colorInfo"
    v-model:use-worker="useWorker"
    v-model:shadow-info="shadowInfo"
  />
</template>

<style lang='scss' scoped>
.draw-map {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .btns {
    padding: $small-space $small-space 0;
    display: flex;
    align-items: center;
    .my-upload {
      display: inline-flex;
      align-items: center;
      padding-right: 12px;
      :deep(.el-upload) {
        color: #409eff;
      }
    }
    .files-list {
      padding: 0 5px;
      display: inline-flex;
      align-items: center;
      width: fit-content;
      max-width: 400px;
      > .text-inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .range-start {
      margin-right: 12px;
    }
    .filter-input {
      :deep(.el-input__wrapper) {
        width: 120px;
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