import * as turf from '@turf/turf'
import type { Ref } from 'vue'
import { ref, unref } from 'vue'
import { ElMessage } from 'element-plus'

export function useCoord(geoDataRef: Ref<any>) {
  const callCoord = function () {
    if (!geoDataRef.value) {
      ElMessage({ message: '请选择文件', type: 'error', })
      return
    }
    const geoData = unref(geoDataRef)
    myFlatten(geoData)
  }
  return {
    callCoord
  }
}

/**
 * 
 * @param geoData geojson数据
 */
function myFlatten(geoData: any) {
  turf.flattenEach(geoData, function (currentFeature, featureIndex, multiFeatureIndex) {
    console.log('useFlatten', currentFeature, featureIndex, multiFeatureIndex)
    turf.coordEach(currentFeature, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
      console.log('useCoord', currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex)
    });
  });
}