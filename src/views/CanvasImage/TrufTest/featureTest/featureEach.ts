import * as turf from '@turf/turf'
import type { Ref } from 'vue'
import { ref, unref } from 'vue'
import { ElMessage } from 'element-plus'
import { simplify, truncate, judgeArea } from '@/views/CanvasImage/ImageByGeoJson/convert/turf'

export function useFeatureEach(geoDataRef: Ref<any>) {
  const callFeatureEach = function () {
    if (!geoDataRef.value) {
      ElMessage({ message: '请选择文件', type: 'error', })
      return
    }
    const geoData = unref(geoDataRef)
    myFeatureEach(geoData)
  }
  return {
    callFeatureEach
  }
}

/**
 * 
 * @param geoData geojson数据
 */
function myFeatureEach(geoData: any) {
  turf.featureEach(geoData, function (currentFeature, featureIndex) {
    turf.flattenEach(currentFeature, function (currentFlatten, flattenIndex, multiFlattenIndex) {
      const geometry = currentFlatten.geometry as any
      if (geometry.type === 'Polygon' && judgeArea(geometry.coordinates, { limit: 50000000, type: 'lt' })) return
      const simplified = simplify(currentFlatten as turf.AllGeoJSON, {tolerance: 0.3, highQuality: false})
      const truncated = truncate(simplified, {precision: 3, coordinates: 2})
      console.log(currentFlatten, simplified, truncated)
    })
  })
}