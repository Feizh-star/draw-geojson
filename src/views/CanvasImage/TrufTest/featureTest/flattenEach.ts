import * as turf from '@turf/turf'
import type { Ref } from 'vue'
import { ref, unref } from 'vue'
import { ElMessage } from 'element-plus'

export function useFlatten(geoDataRef: Ref<any>) {
  const callFlatten = function () {
    if (!geoDataRef.value) {
      ElMessage({ message: '请选择文件', type: 'error', })
      return
    }
    const geoData = unref(geoDataRef)
    myFlatten(geoData)
  }
  return {
    callFlatten
  }
}

/**
 * flattenEach可以把geojson中的基本几何图形遍历一遍，例如遍历多面
currentFeature: {
  type: 'Feature',
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [102.0, 2.0], 
        [103.0, 2.0], 
        [103.0, 3.0], 
        [102.0, 3.0], 
        [102.0, 2.0]
      ],
      // 有孔的话，就还有第二个数组
    ]
  }
}
 * @param geoData geojson数据
 */
function myFlatten(geoData: any) {
  turf.flattenEach(geoData, function (currentFeature, featureIndex, multiFeatureIndex) {
    console.log('useFlatten', currentFeature, featureIndex, multiFeatureIndex)
  });
}