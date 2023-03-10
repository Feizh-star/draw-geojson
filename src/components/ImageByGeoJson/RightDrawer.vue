<script setup lang='ts'>
import type { IBounds, IResolutionRatio } from '@/views/CanvasImage/ImageByGeoJson/convert/draw'
import type { IAnyObject } from '@/types/global/common'
import { ref, computed, watch } from 'vue';
import { Connection, QuestionFilled } from '@element-plus/icons'
type colorType = 
  'backgroundColor' | 
  'lineColor' |
  'fillColor' |
  'shadowColor1' |
  'shadowColor2'

const props = defineProps<{
  defaultColor: IAnyObject
  drawer: boolean
  ranges: IBounds
  resolutionRatio: IResolutionRatio
  simpleInfo: IAnyObject
  useWorker: boolean
  colorInfo: IAnyObject
  shadowInfo: IAnyObject
}>()
const emits = defineEmits<{
  (e: 'update:drawer', value: boolean): void
  (e: 'update:ranges', value: IBounds): void
  (e: 'update:resolutionRatio', value: IResolutionRatio): void
  (e: 'update:simpleInfo', value: IAnyObject): void
  (e: 'update:useWorker', value: boolean): void
  (e: 'update:colorInfo', value: IAnyObject): void
  (e: 'update:shadowInfo', value: IAnyObject): void
}>()

// ******************** 开关 ********************
const innerDrawer = computed({
  get: () => props.drawer,
  set: newVal => emits('update:drawer', newVal)
})

// ******************** 范围 ********************
const innerRanges = computed({
  get: () => props.ranges,
  // 因为本组件表单修改的仅仅是ranges内部的属性，所以这个setter并不会触发
  // 但可以避免限制输入的时候手动设置ranges的属性时，eslint报错
  set: (newVal) => emits('update:ranges', newVal)
})
// 限制数字范围
function limitNumber(value: number, min: number, max: number): number {
  return value < min ? min : (value > max ? max : value)
}
// 限制经纬度输入范围
function limitLatLng(e: string, type: string, pointKey: string, index: number) {
  const inputVal = parseFloat(e)
  if (!inputVal) return
  let limitNum = 90
  switch (type) {
    case 'longitude':
      limitNum = 180
      break
    case 'latitude':
      limitNum = 90
      break
  }
  // @ts-ignore
  innerRanges.value[pointKey][index] = limitNumber(inputVal, -limitNum, limitNum)
}

// ******************** 分辨率 ********************
const connected = ref(true)
const innerResolutionRatio = computed({
  get: () => props.resolutionRatio,
  set: (newVal) => emits('update:resolutionRatio', newVal)
})
const rangeRate = computed(() => { // 根据范围计算出的宽高比例
  const rtd = innerRanges.value.rt[0] - innerRanges.value.lb[0]
  const lbd = innerRanges.value.rt[1] - innerRanges.value.lb[1]
  return rtd !== 0 ? Math.abs(lbd / rtd) : 1
})
// 更新Y
watch(rangeRate, () => computeY())
// 切换宽高关联状态
function connect() {
  connected.value = !connected.value
  computeY()
}
// 根据比例计算高度
function computeY() {
  if (!connected.value) return
  innerResolutionRatio.value.y = Math.round(innerResolutionRatio.value.x * rangeRate.value)
}

// ******************** 抽希参数 ********************
const innerSimpleInfo = computed({
  get: () => props.simpleInfo,
  set: (newVal) => emits('update:simpleInfo', newVal)
})

// ******************** 颜色信息，不包含阴影 ********************
const innerColorInfo = computed({
  get: () => props.colorInfo,
  set: (newVal) => emits('update:colorInfo', newVal)
})
// clear时恢复默认颜色
function colorPickerChange(e: string, who: IAnyObject, tp: colorType) {
  if (!e) who[tp] = props.defaultColor[tp]
}

// ******************** 阴影信息 ********************
const innerShadowInfo = computed({
  get: () => props.shadowInfo,
  set: (newVal) => emits('update:shadowInfo', newVal)
})

// ******************** 启用worker ********************
const innerUseWorker = computed({
  get: () => props.useWorker,
  set: (newVal) => emits('update:useWorker', newVal)
})
</script>

<template>
<el-drawer
  title="配置选项"
  class="right-drawer"
  v-model="innerDrawer"
  size="420px"
>
  <el-scrollbar>
    <el-form label-width="90px" class="right-form">
      <el-divider content-position="left" style="margin-top: 12px;">
        <span>尺寸</span>
        <el-tooltip
          class="item"
          effect="dark"
          placement="left"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <template #content>
            <div class="tooltip-content">
              <div class="tc-line">
                经/纬度范围：设置输出图像的范围
              </div>
              <div class="tc-line">
                分辨率：设置输出图像的分辨率，选择关联
                <el-icon :color="'#409EFC'" style="margin: 0 3px;">
                  <Connection/>
                </el-icon>
                会根据“经/纬度范围”和“宽度”按比例计算图片的高度
              </div>
            </div>
          </template>
        </el-tooltip>
      </el-divider>
      <el-form-item label="经度范围:">
        <el-input 
          v-model.number="innerRanges.lb[0]" 
          type="number" 
          @input="(e: string) => limitLatLng(e, 'longitude', 'lb', 0)" 
          style="width: 130px;" 
          placeholder="起始经度"
        ></el-input>
        <span style="margin: 0 10px;">~</span>
        <el-input 
          v-model.number="innerRanges.rt[0]" 
          type="number" 
          @input="(e: string) => limitLatLng(e, 'longitude', 'rt', 0)" 
          style="width: 130px;" 
          placeholder="结束经度"
        ></el-input>
      </el-form-item>
      <el-form-item label="纬度范围:">
        <el-input 
          v-model.number="innerRanges.lb[1]" 
          type="number" 
          @input="(e: string) => limitLatLng(e, 'latitude', 'lb', 1)" 
          style="width: 130px;" 
          placeholder="起始纬度"
        ></el-input>
        <span style="margin: 0 10px;">~</span>
        <el-input 
          v-model.number="innerRanges.rt[1]" 
          type="number" 
          @input="(e: string) => limitLatLng(e, 'latitude', 'rt', 1)" 
          style="width: 130px;" 
          placeholder="结束纬度"
        ></el-input>
      </el-form-item>
      <el-form-item label="分辨率:">
        <el-input-number
          style="width: 130px;"
          v-model="innerResolutionRatio.x"
          controls-position="right"
          @change="computeY"
          step-strictly
          :min="10"
          :max="10000"
        ></el-input-number>
        <el-icon :color="connected ? '#409EFC' : '#4d4d4d'" style="margin: 0 7px; cursor: pointer;" @click="connect">
          <Connection/>
        </el-icon>
        <el-input-number
          style="width: 130px;"
          :disabled="connected"
          v-model="innerResolutionRatio.y"
          controls-position="right"
          step-strictly
          :min="10"
          :max="10000"
        ></el-input-number>
      </el-form-item>
      <el-divider content-position="left">
        <span>抽希</span>
        <el-tooltip
          class="item"
          effect="dark"
          placement="left"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <template #content>
            <div class="tooltip-content">
              <div class="tc-line">
                面积：过滤掉小于设置面积的区域
              </div>
              <div class="tc-line">
                公差：多边型的简化程度，值越大简化程度越高
              </div>
              <div class="tc-line">
                精度：实际绘制时取的小数位数，值越大精度越高
              </div>
            </div>
          </template>
        </el-tooltip>
      </el-divider>
      <el-form-item label="面积:" class="filter-input">
        <el-input placeholder="指定面积" v-model="innerSimpleInfo.minArea">
          <template #prepend>过滤小于</template>
          <template #append>Km² 区域</template>
        </el-input>
      </el-form-item>
      <el-form-item label="公差:" class="filter-input">
        <el-slider v-model="innerSimpleInfo.tolerance" :min="0" :max="2" :step="0.01"></el-slider>
      </el-form-item>
      <el-form-item label="精度:" class="filter-input">
        <el-slider v-model="innerSimpleInfo.precision" :min="0" :max="16" :step="1"></el-slider>
      </el-form-item>
      <el-divider content-position="left">
        <span>线条和填充</span>
        <el-tooltip
          class="item"
          effect="dark"
          placement="left"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <template #content>
            <div class="tooltip-content">
              <div class="tc-line">
                背景颜色：海洋的颜色
              </div>
              <div class="tc-line">
                线条颜色：边界线的颜色
              </div>
              <div class="tc-line">
                填充颜色：陆地的颜色
              </div>
            </div>
          </template>
        </el-tooltip>
      </el-divider>
      <el-form-item label="背景颜色:" class="half-line">
        <el-color-picker v-model="innerColorInfo.backgroundColor" show-alpha @change="(e: string) => colorPickerChange(e, innerColorInfo, 'backgroundColor')"></el-color-picker>
      </el-form-item>
      <el-form-item label="填充颜色:" class="half-line">
        <el-color-picker v-model="innerColorInfo.fillColor" show-alpha @change="(e: string) => colorPickerChange(e, innerColorInfo, 'fillColor')"></el-color-picker>
      </el-form-item>
      <el-form-item label="线条宽度:" class="half-line">
        <el-input-number
          style="width: 130px;"
          v-model="innerColorInfo.lineWidth"
          controls-position="right"
          :step="1"
          step-strictly
          :min="1"
          :max="99"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="线条颜色:" class="half-line">
        <el-color-picker v-model="innerColorInfo.lineColor" show-alpha @change="(e: string) => colorPickerChange(e, innerColorInfo, 'lineColor')"></el-color-picker>
      </el-form-item>
      <!-- innerShadowInfo -->
      <el-divider content-position="left">
        <span>阴影</span>
        <el-tooltip
          class="item"
          effect="dark"
          placement="left"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <template #content>
            <div class="tooltip-content">
              <div class="tc-line">
                阴影颜色1：第一层阴影的颜色
              </div>
              <div class="tc-line">
                阴影颜色2：第二层阴影的颜色
              </div>
              <div class="tc-line">
                阴影偏移：阴影在水平和垂直方向的偏移量，单位是“度”
              </div>
              <div class="tc-line">
                模糊级别：分别控制两层阴影边缘的模糊程度，单位是“像素”
              </div>
              <div class="tc-line">
                阴影延伸：控制第二层阴影的尺寸，设为“0”则没有第二层阴影
              </div>
            </div>
          </template>
        </el-tooltip>
      </el-divider>
      <el-form-item label="阴影颜色1:" class="half-line">
        <el-color-picker v-model="innerShadowInfo.shadowColor1" show-alpha @change="(e: string) => colorPickerChange(e, innerShadowInfo, 'shadowColor1')"></el-color-picker>
      </el-form-item>
      <el-form-item label="阴影颜色2:" class="half-line">
        <el-color-picker v-model="innerShadowInfo.shadowColor2" show-alpha @change="(e: string) => colorPickerChange(e, innerShadowInfo, 'shadowColor2')"></el-color-picker>
      </el-form-item>
      <el-form-item label="阴影偏移:">
        <el-input-number
          style="width: 130px;"
          v-model="innerShadowInfo.sOffsetX"
          controls-position="right"
          :step="0.1"
          step-strictly
          :min="0"
          :max="360"
        ></el-input-number>
        <span style="padding: 0 14px;"></span>
        <el-input-number
          style="width: 130px;"
          v-model="innerShadowInfo.sOffsetY"
          controls-position="right"
          :step="0.1"
          step-strictly
          :min="0"
          :max="180"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="模糊级别:">
        <el-input-number
          style="width: 130px;"
          v-model="innerShadowInfo.sBlur1"
          controls-position="right"
          :step="0.1"
          step-strictly
          :min="0"
          :max="9999"
        ></el-input-number>
        <span style="padding: 0 14px;"></span>
        <el-input-number
          style="width: 130px;"
          v-model="innerShadowInfo.sBlur2"
          controls-position="right"
          :step="0.1"
          step-strictly
          :min="0"
          :max="9999"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="阴影延伸:">
        <el-input-number
          style="width: 130px;"
          v-model="innerShadowInfo.outRate"
          controls-position="right"
          :step="0.1"
          step-strictly
          :min="0"
          :max="9999"
        ></el-input-number>
      </el-form-item>
      <el-divider content-position="left">
        <span>其他</span>
        <el-tooltip
          class="item"
          effect="dark"
          placement="left"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <template #content>
            <div class="tooltip-content">
              <div class="tc-line">
                worker：在worker线程中处理绘制过程，可以避免数据量较大时页面卡死
              </div>
            </div>
          </template>
        </el-tooltip>
      </el-divider>
      <el-form-item label="worker:" style="width: 100%;">
        <el-switch v-model="innerUseWorker" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
  </el-scrollbar>
</el-drawer>
</template>

<style lang='scss' scoped>
.right-form {
  display: flex;
  flex-wrap: wrap;
  .filter-input {
    :deep(.el-input__wrapper) {
      width: 126px;
    }
  }
  .half-line {
    width: 50% !important;
  }
}
.tooltip-content {
  width: 300px;
  padding: 5px;
  .tc-line {
    padding: 5px 0;
  }
}
</style>
<style lang="scss">
.right-drawer {
  .el-drawer__body {
    padding: 10px 0;
    .el-form-item {
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
    }
    .el-divider__text.is-left {
      left: 14px;
      padding: 0 7px;
      font-size: 18px;
      display: inline-flex;
      .el-tooltip__trigger {
        margin-left: 5px;
      }
    }
  }
}
</style>