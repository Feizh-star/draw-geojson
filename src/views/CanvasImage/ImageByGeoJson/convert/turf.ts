import * as turf from '@turf/turf'
import type { IAnyObject } from '@/types/global/common'

/**
 * 简化
 * @param data 
 * @param opt 
 * @returns 
 */
export function simplify(data: turf.AllGeoJSON, opt?: IAnyObject): turf.AllGeoJSON {
  const options = {
    tolerance: opt?.tolerance || 0, 
    highQuality: opt?.highQuality || false
  }
  const simplified = turf.simplify(data, options);
  return simplified
}

/**
 * 降低精度
 * @param data 
 * @param opt 
 * @returns 
 */
export function truncate(data: turf.AllGeoJSON, opt?: IAnyObject): turf.AllGeoJSON {
  const options = {
    precision: opt?.precision || 6, 
    coordinates: opt?.coordinates || 2
  }
  const truncated = turf.truncate(data, options);
  return truncated
}

/**
 * 判断面积小于或大于限制
 * @param polygon 
 * @param opt type: 'lt'小于；'gt'大于
 */
export function judgeArea(polygon: Array<Array<[number, number]>>, opt?: { limit?: number, type?: 'lt' | 'gt' }) {
  const options = {
    limit: opt?.limit || 0,
    type: opt?.type || 'lt'
  }
  let res = false
  const area = computeArea(polygon)
  if (options.type === 'lt') {
    res = area < options.limit
  }
  if (options.type === 'gt') {
    res = area > options.limit
  }
  return res
}

// 计算线条围成的区域的面积
export function computeArea(p: Array<Array<[number, number]>>): number {
  const polygon = turf.polygon(p);
  const area = turf.area(polygon);
  return area
}