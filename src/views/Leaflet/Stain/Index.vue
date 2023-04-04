<script setup lang='ts'>
import { ref, } from 'vue';
import { useBaseMap } from '@/views/Leaflet/Stain/hooks/baseMap'

const panesCfg = [
  { name: 'stationIcons', zIndex: 99991 },
  { name: 'stationIconsNum', zIndex: 99990 },
  { name: 'stationIconsPopup', zIndex: 99992 },
  { name: 'riverPane', zIndex: 210 },
  { name: 'shadowPane', zIndex: 203 },
  { name: 'streamPane', zIndex: 204 },
]
const layerGroupCfg = [
  { name: 'station', },
  { name: 'dam', },
  { name: 'valley', },
  { name: 'river_system', },
  { name: 'gird_point', },
  { name: 'colorImageLayer', },
]

const { mapIns, lgSet, mapRef } = useBaseMap({ panesCfg, layerGroupCfg })

</script>

<template>
  <div class="stain">
    <div class="top-btns">
      <el-button type="primary">按钮</el-button>
    </div>
    <div class="stain-map" ref="mapRef"></div>
  </div>
</template>

<style lang='scss' scoped>
.stain {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 8px;
  .top-btns {
    > button {
      margin-bottom: 8px;
    }
  }
  .stain-map {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
}
</style>