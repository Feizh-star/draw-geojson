import type { Map, LatLng } from 'leaflet'
import type { Ref } from 'vue'
import { ref, onMounted, watchEffect } from 'vue';
import Pbf from 'pbf'
import geobuf from 'geobuf'
import * as turf from '@turf/turf'
import * as L from 'leaflet'
import canvasLayer from '@/libs/stain/L.canvasLayer.GlImg.js'
import { 
  initMap, 
  addPanes, 
  addLayerGroup,
  addGeoJson 
} from '@/views/Leaflet/script/map'

type ResponseHandler = 'json' | 'arrayBuffer' | 'blob'

const color = { //12,24小时降水
  "r": [165, 61, 99, 0, 243, 129],
  "g": [243, 185, 184, 0, 5, 0],
  "b": [141, 63, 249, 254, 238, 64],
  "v": [0.1, 10, 25, 50, 100, 250],
}
const scale = {
  "r": 50,
  "g": 25,
  "b": 10,
  "a": 1
}
const colorImageInfo = {
  latmax: 33.025,
  latmin: 26.975,
  lonmax: 103.025,
  lonmin: 96.975,
}

export function useBaseMap(opts: {[propName: string]: any}) {
  const mapIns = { map: {} as Map }
  const lgSet = {}
  const mapRef = ref<HTMLElement | null>(null)
  const geojsonData = ref()
  useInitMap({
    mapIns, 
    mapRef, 
    lgSet, 
    geojsonData,
    panesCfg: opts.panesCfg, 
    layerGroupCfg: opts.layerGroupCfg
  })
  initStainWhenGeojsonDataChange(geojsonData, lgSet, 'colorImageLayer')
  return {
    mapIns,
    lgSet,
    mapRef,
    geojsonData
  }
}

function useInitMap({
  mapIns, 
  mapRef, 
  lgSet,
  geojsonData,
  panesCfg,
  layerGroupCfg
}: {
  mapIns: any, 
  mapRef: Ref<HTMLElement | null>, 
  lgSet: any,
  geojsonData: Ref<any>,
  panesCfg: Array<{name: string, zIndex: number}>,
  layerGroupCfg: Array<{name: string, opt?: any}>
}) {
  onMounted(() => {
    mapIns.map = initMap(mapRef.value as HTMLElement, {
      center: [29.04124428811088, 100.65729060828413],
      zoom: 8
    })
    addPanes(mapIns.map, panesCfg)
    addLayerGroup(mapIns.map, lgSet, layerGroupCfg)
    initLayers(mapIns, lgSet, geojsonData)
  })
}

export function initStainWhenGeojsonDataChange(geojsonData: Ref<any>, lgSet: any, name: string) {
  watchEffect(() => {
    const geoData = geojsonData.value // 当geojsonData更新后执行一下操作
    if (geoData) {
      initStain(geoData, lgSet[name])
    }
  })
}

const testPng = 'http://221.122.67.142:3002/mlhfcspng/daily/20230119/2023012000_tp.png'
function initStain(geoDataBoundary: any, layerGroup: L.LayerGroup<any>) {
  fetchGeoData(testPng, 'blob', (data: any) => {
    const fr = new FileReader()
    fr.readAsDataURL(data)
    fr.onloadend = function (e) {
      const dataUrl = e.target?.result || ''
      canvasLayer(dataUrl, color, {
        scale: scale,
        linear: 0.2,
        opacity: 0.6,
        latmin: colorImageInfo.latmin,
        latmax: colorImageInfo.latmax,
        lonmin: colorImageInfo.lonmin,
        lonmax: colorImageInfo.lonmax,
        cut: true, //是否切割
        geojson: geoDataBoundary, //切割使用的geojson数据
      }).addTo(layerGroup)
    }
  })
}

function initLayers(mapIns: any, lgSet: any, geojsonData: Ref<any>) {
  fetchGeoData('/jsonData/area.png', 'arrayBuffer', (data: any) => {
    const geodata = geobuf.decode(new Pbf(data))
    geojsonData.value = geodata
    addMapBg(mapIns.map, geodata)
    addGeoJson(geodata, {
      style: {
        stroke: true,
        fillColor: '#ffffff',
        weight: 1,
        fillOpacity: 1,
      },
      pane: 'shadowPane'
    }, mapIns.map)
  })
  fetchGeoData('/jsonData/main.geojson', 'json', (data: any) => {
    addGeoJson(data, {
      style: {
        color: '#3b90c5',
        weight: 5
      },
      pane: 'riverPane'
    }, lgSet['river_system'])
  })
  fetchGeoData('/jsonData/mulihe_sub_stream.geojson', 'json', (data: any) => {
    addGeoJson(data, {
      style: {
        color: '#67aad3',
        weight: 2
      },
      pane: 'riverPane'
    }, lgSet['river_system'])
  })
  fetchGeoData('/jsonData/mulihe_watershed.geojson', 'json', (data: any) => {
    addGeoJson(data, {
      style: {
        fillColor: 'rgba(84, 147, 219, 1)',
        fillOpacity: .3,
        weight: 1
      },
      pane: 'streamPane'
    }, lgSet['valley'])
  })
}

function fetchGeoData(
  url: string, 
  responseHandler: ResponseHandler, 
  callback: (data: any) => void
) {
  fetch(url)
    .then((res: Response) => res[responseHandler]())
    .then(callback)
}

function addMapBg(map: Map, geoData: any) {
  map.createPane('background').style.zIndex = '1'
  const geoDataTemp = turf.clone(geoData)
  const bgPolygon = [
    [[90, -180],[90, 180],[-90, 180],[-90, -180],[90, -180]], // outer ring
  ]
  const outerRingDirection = turf.booleanClockwise(turf.lineString(bgPolygon[0])) // 外部轮廓方向
  turf.flattenEach(geoDataTemp, function (currentFeature) {
    const polygonArray = currentFeature.geometry.coordinates[0]
    const innerRingDirection = turf.booleanClockwise(turf.lineString(polygonArray))
    if (innerRingDirection === outerRingDirection) {
      polygonArray.reverse()
    }
    polygonArray.forEach((item: any) => item.reverse())
    bgPolygon.push(polygonArray)
  })
  L.polygon(bgPolygon as unknown as LatLng[][], {
    pane: 'background',
    color: 'transparent', 
    fillColor: '#f5f8fb',
    fillOpacity: .75, 
  }).addTo(map)
}