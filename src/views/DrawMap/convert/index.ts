export interface IResolutionRatio {
  x: number,
  y: number
}
export interface IBounds {
  lb: [number, number]
  rt: [number, number]
}
export interface IBoundsRes extends IBounds {
  lngBound: number
  latBound: number
  lngBoundHalf: number
  latBoundHalf: number
  lngBoundCenter: number
  latBoundCenter: number
}

export function drawGeoInWorker({
  geoData, 
  bounds, 
  resolutionRatio,
  backgroundColor,
  lineColor,
}: {
  geoData: any, 
  bounds: IBounds, 
  resolutionRatio: IResolutionRatio,
  backgroundColor?: string,
  lineColor?: string
}): Promise<HTMLCanvasElement> {
  // worker
  const worker = new Worker('/worker/ImageByGeoJson/convert.js')
  worker.postMessage({ 
    beyond: 'main',
    geoData, 
    backgroundColor,
    lineColor,
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
      
      const bitmapContext = canvas.getContext("bitmaprenderer");
      bitmapContext.transferFromImageBitmap(imageBitmap);

      resolve(canvas)
    }
  })
}

export function drawGeo({
  geoData, 
  bounds, 
  resolutionRatio,
  backgroundColor,
  lineColor,
}: {
  geoData: any, 
  bounds: IBounds, 
  resolutionRatio: IResolutionRatio,
  backgroundColor?: string,
  lineColor?: string
}): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const computedBoundInfo: IBoundsRes = computedBounds(bounds)
  const ctx = canvas.getContext("2d") as any;
  const coordinates = geoData.features[0].geometry.coordinates

  // // eslint-disable-next-line
  // debugger

  // 设置 Canvas 大小
  canvas.style.width = resolutionRatio.x + 'px'
  canvas.style.height = resolutionRatio.y + 'px'
  canvas.width = resolutionRatio.x
  canvas.height = resolutionRatio.y
  console.log(computedBoundInfo, resolutionRatio)

  ctx.fillStyle = backgroundColor || '#FFFFFF'
  ctx.strokeStyle = lineColor || '#000000'
  ctx.lineWidth = 1
  ctx.fillRect(0, 0, resolutionRatio.x, resolutionRatio.y)
  
  const time_start = new Date().getTime()
  for (let i = 0; i < coordinates.length; i++) {
    // console.log(coordinates[i][0])
    drawEdge(canvas, computedBoundInfo, coordinates[i][0])
  }
  const time_end = new Date().getTime()
  console.log('sync', time_end - time_start)
  return canvas
}

// 计算边界和坐标转换参数
function computedBounds(bounds: IBounds): IBoundsRes {
  const { lb, rt } = bounds
  const lngBound = rt[0] - lb[0]
  const latBound = rt[1] - lb[1]
  const lngBoundHalf = lngBound / 2
  const latBoundHalf = latBound / 2
  const lngBoundCenter = (rt[0] + lb[0]) / 2
  const latBoundCenter = (rt[1] + lb[1]) / 2
  return {
    lb, 
    rt,
    lngBound,
    latBound,
    lngBoundHalf,
    latBoundHalf,
    lngBoundCenter,
    latBoundCenter
  }
}

// 定义一个函数，将 GeoJSON 对象转换为 Canvas 上的坐标
function geoJSONToCanvasCoord(geoJSONCoord: number[], computedBoundInfo: IBoundsRes, canvasWidth: number, canvasHeight: number): [number, number] {
  const [lng, lat] = geoJSONCoord;
  const {
    lngBound,
    latBound,
    lngBoundHalf,
    latBoundHalf,
    lngBoundCenter,
    latBoundCenter
  } = computedBoundInfo
  // const x = (lng + 180) * (canvasWidth / 360);
  // const y = (90 - lat) * (canvasHeight / 180);
  const x = (lng - lngBoundCenter + lngBoundHalf) * (canvasWidth / lngBound);
  const y = ((-(lat - latBoundCenter)) + latBoundHalf) * (canvasHeight / latBound);
  return [x, y];
}
// 绘制一个线条
function drawEdge(
  canvas: HTMLCanvasElement,
  computedBoundInfo: IBoundsRes, 
  edgeCoords: Array<Array<number>>
):void {
  const ctx = canvas.getContext("2d") as any;
  const [startX, startY] = geoJSONToCanvasCoord(edgeCoords[0], computedBoundInfo, canvas.width, canvas.height);
  // let ctxClose = false
  // ctx.clearRect(0, 0,800,800);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  for (let i = 1; i < edgeCoords.length; i++) {
    const [x, y] = geoJSONToCanvasCoord(edgeCoords[i], computedBoundInfo, canvas.width, canvas.height);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}