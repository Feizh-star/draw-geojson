import { drawImage } from './draw'
import type { UniCanvas, IDrawProps } from './draw'

export function drawGeoInWorker({geoData, bounds, simpleInfo, resolutionRatio, colorInfo, shadowInfo }: IDrawProps): Promise<HTMLCanvasElement> {
  // worker
  const worker = new Worker(new URL('./worker.js?worker', import.meta.url), {
    type: 'module',
  })
  worker.postMessage({ 
    beyond: 'main',
    simpleInfo,
    geoData, 
    colorInfo,
    shadowInfo,
    bounds: JSON.parse(JSON.stringify(bounds)), 
    resolutionRatio: JSON.parse(JSON.stringify(resolutionRatio)),
  })
  return new Promise(resolve => {
    worker.onmessage = function (e) {
      console.log('子线程消息：', e.data)
      const { imageBitmap } = e.data
      const canvas = document.createElement('canvas')
      // 设置 Canvas 大小
      canvas.style.width = resolutionRatio.x + 'px'
      canvas.style.height = resolutionRatio.y + 'px'
      canvas.width = resolutionRatio.x
      canvas.height = resolutionRatio.y
      
      const bitmapContext = canvas.getContext("bitmaprenderer")
      bitmapContext?.transferFromImageBitmap(imageBitmap)

      resolve(canvas)
    }
  })
}

export function drawGeo(drawProps: IDrawProps): UniCanvas {
  const { resolutionRatio } = drawProps
  const canvas = document.createElement('canvas')
  // 设置 Canvas 大小
  canvas.style.width = resolutionRatio.x + 'px'
  canvas.style.height = resolutionRatio.y + 'px'
  canvas.width = resolutionRatio.x
  canvas.height = resolutionRatio.y
  return drawImage({ ...drawProps, canvas})
}