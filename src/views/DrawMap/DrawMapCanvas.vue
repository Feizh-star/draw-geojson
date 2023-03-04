<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import * as L from 'leaflet'
// import geoJsonData from './data/worldMerge.json'
import type { GeoJsonObject } from 'geojson'
// console.log([(geoJsonData as any).features[0].geometry.coordinates[0]])
// console.log(geoJsonData)
// refs
const mapContainer = ref<HTMLElement>()

let map: ReturnType<typeof L.map>
onMounted(() => {
  initMap()
})

function initMap() {
  map = L.map(mapContainer.value as HTMLElement, {
    center: [22.078, 125.64687346478834],
    zoom: 3,
    maxZoom: 20,
    minZoom: 2,
    preferCanvas: true,
    crs: L.CRS.EPSG4326,
    zoomControl: false,
    attributionControl: false,
  });
  // L.geoJSON(geoJsonData as GeoJsonObject, {
  //   style: function (feature) {
  //     return {color: feature?.properties.color};
  //   }
  // }).addTo(map);
}
</script>

<template>
  <div class="draw-map">
    <section class="btns">
      <el-button type="primary">按钮</el-button>
    </section>
    <section class="canvas-section">
      <div class="canvas-container">
        <!-- <canvas></canvas> -->
        <div ref="mapContainer" class="map-container"></div>
      </div>
    </section>
  </div>
</template>

<style lang='scss' scoped>
.draw-map {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .btns {
    padding: $small-space;
  }
  .canvas-section {
    flex: 1;
    min-height: 0;
    padding: $small-space;
    .canvas-container {
      width: 100%;
      height: 100%;
      .map-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>