import * as L from 'leaflet'
import type { MapOptions, Map, GeoJSONOptions } from 'leaflet'

export function initMap(el: HTMLElement | string, opt?: MapOptions): Map {
  const options = {
    center: opt?.center || [39.903331, 116.397428],
    zoom: opt?.zoom || 13,
    zoomControl: opt?.zoomControl || false,
    attributionControl: opt?.attributionControl || false,
    ...opt
  }
  const map = L.map(el, options)
  return map
}

export function addPanes(map: Map, pans: Array<{name: string, zIndex: number}>) {
  pans.forEach(pan => {
    map.createPane(pan.name).style.zIndex = pan.zIndex + ''
  })
}

export function addLayerGroup(map: Map, lgSet: { [propName: string]: any }, lgs: Array<{name: string, opt?: any}>) {
  lgs.forEach(lg => {
    lgSet[lg.name] = L.layerGroup().addTo(map)
  })
}

export function addGeoJson(json: any, opt: any, container: Map | L.LayerGroup<any>) {
  L.geoJSON(json, opt).addTo(container)
}