<script setup lang="ts">
import type { UploadProps  } from 'element-plus'
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus'

type Line = Array<[number, number]>
const points: Line = [
  [50, 50],
  [450, 50],
  [450, 450],
  [50, 450],
  [50, 50],
]
const points1: Line = [
  [300, 300],
  [300, 400],
  [400, 400],
  [400, 300],
  [300, 300],
]
const points2: Line = [
  [100, 100],
  [100, 200],
  [200, 200],
  [200, 100],
  [100, 100],
]
const canvas = ref<HTMLCanvasElement>()
onMounted(() => {
  const canvasEl = canvas.value as HTMLCanvasElement
  canvasEl.width = 500
  canvasEl.height = 500
  drawLine(canvasEl, [points, points1, points2])
})

function drawLine(c: HTMLCanvasElement, lines: Line[]) {
  const ctx = c.getContext('2d') as any
  ctx.fillStyle = 'rgba(244, 247, 255, 1)'
  ctx.beginPath();
  for (const line of lines) {
    const [startX, startY] = line[0]
    ctx.moveTo(startX, startY);
    for (let i = 1; i < line.length; i++) {
      const [x, y] = line[i]
      ctx.lineTo(x, y);
    }
  }
    // ctx.closePath();
  ctx.stroke();
  // ctx.fill()
  // ctx.fillStyle = 'rgba(244, 247, 255, 1)'
  // ctx.fill()
  // ctx.clip()
  // ctx.fillStyle = 'rgba(244, 247, 255, 1)'
  ctx.shadowBlur = 0
  ctx.shadowColor= 'red'
  ctx.shadowOffsetX = 20
  ctx.shadowOffsetY = 20
  ctx.fill()

}


// 处理文件选择
const fileName = ref('') // 文件名
let geoJsonData: any = null // geojson数据
const upload = ref() // 上传组件
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
/**
 * 点击“操作按钮”事件
 */
function todo() {
  // if (!geoJsonData) {
  //   ElMessage({ message: '请选择文件', type: 'error', })
  //   return
  // }
  const canvasEl = canvas.value as HTMLCanvasElement
  const ctx = canvasEl.getContext("2d") as any
  ctx.shadowBlur=20
  ctx.shadowColor="black"
  ctx.shadowOffsetX = 10
  ctx.shadowOffsetY = 10
  ctx.fillStyle="red"
  ctx.fillRect(20,20,100,80)
}
</script>

<template>
  <div class="test-canvas">
    <section class="btns">
      <div class="select-file">
        <el-form :inline="true">
          <el-form-item label="" style="margin-right: 10px;">
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
          <el-form-item>
            <el-button type="primary" @click="todo">操作</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
    <section class="huabu">
      <canvas class="canvas-class" ref="canvas"></canvas>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.test-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

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
  .huabu {
    flex: 1;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .canvas-class {
      width: 500px;
      height: 500px;
      box-sizing: content-box;
      border: 1px solid #cccccc;
    }
  }
}
</style>