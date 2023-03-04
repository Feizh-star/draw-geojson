<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { drawGeo } from './data/test'
import type { IBounds } from './data/test'
import worldMerge from './data/worldMerge.json'
const world: any = worldMerge
// const lb: [number, number] = [62.916971, 0]
// const rt: [number, number] = [142.721659,57.325263]
const lb: [number, number] = [90, -45]
const rt: [number, number] = [180, 45]
const bounds: IBounds = {
  lb,
  rt
}
// refs
const mapContainer = ref<HTMLElement>()

onMounted(() => {
  // 获取 Canvas 元素和 2D 绘图上下文
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  drawGeo(canvas, world, bounds)
})
</script>

<template>
  <div class="draw-map">
    <section class="btns">
      <el-button type="primary">按钮</el-button>
    </section>
    <section class="canvas-section">
      <div class="canvas-container">
        <canvas id="canvas"></canvas>
      </div>
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
  }
  .canvas-section {
    flex: 1;
    min-height: 0;
    padding: $small-space;
    overflow: auto;
    .canvas-container {
      width: 100%;
      height: 100%;
      #canvas {
        // width: 100%;
        // height: 100%;
        width: 800px;
        height: 800px;
      }
    }
  }
}
</style>