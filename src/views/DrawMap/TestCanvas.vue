<template>
  <div class="test-canvas">
    <canvas class="canvas-class" ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
type Line = Array<[number, number]>
const points: Line = [
  // [60, -30],
  [50, 30],
  [40, 80],
  [30, 120],
  [20, 150],
  [10, 170],
  // [0, 185],
  // [-10, 195],
  // [-20, 200],
]
const canvas = ref<HTMLCanvasElement>()
onMounted(() => {
  const canvasEl = canvas.value as HTMLCanvasElement
  canvasEl.width = 500
  canvasEl.height = 500
  drawLine(canvasEl as HTMLCanvasElement, points)
})

function drawLine(c: HTMLCanvasElement, line: Line) {
  const ctx = c.getContext('2d') as any
  const [startX, startY] = line[0]
  let ctxClose = false
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (let i = 1; i < line.length; i++) {
    // if (
    //   line[i][0] > 500 || 
    //   line[i][0] < 0 ||
    //   line[i][1] > 500 ||
    //   line[i][1] < 0
    // ) {
    //   if (!ctxClose) {
    //     ctx.closePath();
    //     ctx.stroke();
    //     ctxClose = !ctxClose
    //   }
    //   continue
    // }
    // if (ctxClose) {
    //   ctxClose = !ctxClose
    //   const [newStartX, newStartY] = line[i - 1]
    //   ctx.beginPath();
    //   ctx.moveTo(newStartX, newStartY);
    // }
    const [x, y] = line[i]
    ctx.lineTo(x, y);
  }
  // ctx.closePath();
  ctx.stroke();

}
</script>

<style lang="scss" scoped>
.test-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .canvas-class {
    width: 500px;
    height: 500px;
  }
}
</style>