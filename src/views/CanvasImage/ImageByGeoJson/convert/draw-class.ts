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

class ConvertGeoJson {
  canvas: UniCanvas;
  geoData: any;
  bounds: IBounds;
  simpleInfo: IAnyObject;
  resolutionRatio: IResolutionRatio;
  colorInfo: IAnyObject;
  shadowInfo: IAnyObject;
}