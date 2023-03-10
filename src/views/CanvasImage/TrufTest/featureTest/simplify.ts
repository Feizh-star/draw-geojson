import * as turf from '@turf/turf'
import type { Ref } from 'vue'
import { ref, unref } from 'vue'
import { ElMessage } from 'element-plus'

export function useSimplify(geoDataRef: Ref<any>) {
  const callSimplify = function () {
    if (!geoDataRef.value) {
      ElMessage({ message: '请选择文件', type: 'error', })
      return
    }
    const geoData = unref(geoDataRef)
    mySimplify(geoData)
  }
  return {
    callSimplify
  }
}

/**
 * 
 * @param geoData geojson数据
 */
function mySimplify(geoData: any) {
  const options = {tolerance: 0.3, highQuality: false};
  const simplified = turf.simplify(geoData, options);
  console.log(geoData, simplified)
}