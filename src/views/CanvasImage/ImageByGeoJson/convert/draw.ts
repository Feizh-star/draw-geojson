import * as turf from '@turf/turf'
import type { IAnyObject } from '@/types/global/common'
import { simplify, truncate, judgeArea } from './turf'
// 两种canvas联合
export type UniCanvas = HTMLCanvasElement | OffscreenCanvas
// 分辨率
export interface IResolutionRatio {
  x: number,
  y: number
}
// 描述边界的左下角和右上角
export interface IBounds {
  lb: [number, number]
  rt: [number, number]
}
// 边界计算结果
export interface IBoundsRes extends IBounds {
  lngBound: number
  latBound: number
  lngBoundHalf: number
  latBoundHalf: number
  lngBoundCenter: number
  latBoundCenter: number
}
// 绘制地图所需要的参数类型
export interface IDrawProps {
  geoData: any
  bounds: IBounds
  simpleInfo: IAnyObject
  resolutionRatio: IResolutionRatio
  colorInfo: IAnyObject
  shadowInfo: IAnyObject
}
// drawImage所需要的参数类型，比IDrawProps多了一个canvas元素
export interface IDrawImageProps extends IDrawProps {
  canvas: UniCanvas
}

/**
 * 根据参数绘制地图
 * @param param 绘制地图的所有参数
 * @returns 传递进来的canvas
 */
export function drawImage({ 
  canvas, 
  geoData, 
  bounds, 
  simpleInfo,
  resolutionRatio, 
  colorInfo,
  shadowInfo
}: IDrawImageProps): UniCanvas {
  const { minArea, tolerance, precision, highQuality, includeZ } = simpleInfo
  const { backgroundColor, lineColor, fillColor, lineWidth } = colorInfo
  const bgc = backgroundColor || '#FFFFFF'
  const fc = fillColor || '#FFFFFF'
  const computedBoundInfo: IBoundsRes = computedBounds(bounds)
  const ctx = canvas.getContext("2d") as any;

  ctx.strokeStyle = lineColor || '#000000'
  ctx.lineWidth = parseInt(lineWidth) || 1
  ctx.fillStyle = bgc
  ctx.fillRect(0, 0, resolutionRatio.x, resolutionRatio.y)
  ctx.fillStyle = fc
  
  turf.featureEach(geoData, function (currentFeature, featureIndex) {
    turf.flattenEach(currentFeature, function (currentFlatten, flattenIndex, multiFlattenIndex) {
      const geometry = currentFlatten.geometry as any
      const ma = parseFloat(minArea) || 0
      // 抽希
      if (geometry.type === 'Polygon' && judgeArea(geometry.coordinates, { limit: ma * 1000000, type: 'lt' })) return
      const simplified = simplify(currentFlatten as turf.AllGeoJSON, {tolerance, highQuality})
      const truncated = truncate(simplified, {precision, coordinates: includeZ ? 3 : 2})
      // console.log(geoData, simplified, truncated)
      drawFeature(canvas, 
        computedBoundInfo, 
        truncated as turf.helpers.Feature<unknown, turf.helpers.Properties>, 
        { 
          ...shadowInfo,
          bgc,
          fc
        })
    })
  });
  return canvas
}

export function drawFeature(
  canvas: UniCanvas,
  computedBoundInfo: IBoundsRes, 
  edgeCoords: turf.helpers.Feature<unknown, turf.helpers.Properties>,
  shadow: IAnyObject
): void {
  const type = (edgeCoords.geometry as any).type
  switch (type) {
    case 'Polygon':
    case 'polygon':
      drawPolygon(canvas, computedBoundInfo, edgeCoords, shadow)
      break
    case 'LineString':
    case 'linestring':
    case 'Linestring':
    case 'lineString':
      drawLineString(canvas, computedBoundInfo, edgeCoords, shadow)
      break
  }
}

// 绘制一个线条
export function drawLineString(
  canvas: UniCanvas,
  computedBoundInfo: IBoundsRes, 
  edgeCoords: turf.helpers.Feature<unknown, turf.helpers.Properties>,
  shadow: IAnyObject
): void {
  const ctx = canvas.getContext("2d") as any
  const line = (edgeCoords.geometry as any).coordinates as Array<Array<any>>
  ctx.beginPath()
  const [startX, startY] = geoJSONToCanvasCoord(line[0], computedBoundInfo, canvas.width, canvas.height)
  ctx.moveTo(startX, startY)
  for (let i = 1; i < line.length; i++) {
    const [x, y] = geoJSONToCanvasCoord(line[i], computedBoundInfo, canvas.width, canvas.height)
    ctx.lineTo(x, y)
  }
  ctx.stroke();
}

// 绘制一个多边型
export function drawPolygon(
  canvas: UniCanvas,
  computedBoundInfo: IBoundsRes, 
  edgeCoords: turf.helpers.Feature<unknown, turf.helpers.Properties>,
  shadow: IAnyObject
): void {
  const ctx = canvas.getContext("2d") as any
  const polygon = (edgeCoords.geometry as any).coordinates as Array<Array<any>>
  ctx.beginPath()
  for (const [index, edge] of polygon.entries()) {
    const [startX, startY] = geoJSONToCanvasCoord(edge[0], computedBoundInfo, canvas.width, canvas.height)
    ctx.moveTo(startX, startY)
    for (let i = 1; i < edge.length; i++) {
      const [x, y] = geoJSONToCanvasCoord(edge[i], computedBoundInfo, canvas.width, canvas.height)
      ctx.lineTo(x, y)
    }
  }
  renderShadow(canvas, shadow)
  ctx.stroke();
}

// 绘制阴影
function renderShadow(canvas: UniCanvas, shadow: IAnyObject): void {
  const {
    sOffsetX, // 阴影水平距离-经度
    sOffsetY, // 阴影垂直距离-纬度
    outRate, // 第二层阴影延伸比例-相对于第一层
    sBlur1, // 第一层阴影模糊距离-像素
    sBlur2, // 第二层阴影模糊距离-像素
    shadowColor1, // 第一层阴影默认颜色
    shadowColor2, // 第二层阴影默认颜色
  } = shadow
  const ctx = canvas.getContext("2d") as any
  const [ox, oy] = [sOffsetX * canvas.width / 360, sOffsetY * canvas.height / 180]
  // 第二层
  if (outRate !== 0) {
    ctx.shadowBlur = sBlur2 || 0
    ctx.shadowColor = shadowColor2
    ctx.shadowOffsetX = ox * (1 + outRate)
    ctx.shadowOffsetY = oy * (1 + outRate)
    ctx.fill()
  }
  // 第一层
  ctx.shadowBlur = sBlur1 || 0
  ctx.shadowColor= shadowColor1
  ctx.shadowOffsetX = ox
  ctx.shadowOffsetY = oy
  ctx.fill()
  // 清除shadow样式
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
}

// 计算边界和坐标转换参数
export function computedBounds(bounds: IBounds): IBoundsRes {
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
export function geoJSONToCanvasCoord(
  geoJSONCoord: number[], 
  computedBoundInfo: IBoundsRes, 
  canvasWidth: number, 
  canvasHeight: number
): [number, number] {
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