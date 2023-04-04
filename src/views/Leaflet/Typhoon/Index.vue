<script setup lang='ts'>
import { ref, onMounted, watchEffect } from 'vue';
import L from 'leaflet'
import { getTyphoon } from '@/api/mapdata'
import { 
  initWorldMap,
  Typhoon
} from './map/map'

const mapObj: {[p: string]: any} = {}
const mapRef = ref<HTMLElement>()
onMounted(() => {
  mapObj.map = initWorldMap(mapRef.value as HTMLElement)
  getTyphoonData().then(() => {
    selectedTyphoon.value = typhoonList.value[0]?.num_nati
  })
})

const typhoonList = ref<Array<any>>([])
let typhoon: Typhoon
const selectedTyphoon = ref()
watchEffect(() => {
  renderTyphoon()
})

function renderTyphoon() {
  const typhoonId = selectedTyphoon.value
  const selObj = typhoonList.value.find(t => t.num_nati === typhoonId)
  if (!selObj) return
  if (typhoon instanceof Typhoon) {
    typhoon.update(selObj)
  } else {
    typhoon = new Typhoon(mapObj.map, selObj)
  }
}

function getTyphoonData() {
  return getTyphoon().then(data => {
    typhoonList.value = data
    console.log(data)
  })
}
</script>

<template>
  <div class="typhoon page-container">
    <div class="page-btns">
      <el-select v-model="selectedTyphoon" placeholder="请选择">
        <el-option
          v-for="item in typhoonList"
          :key="item.num_nati"
          :label="item.typh_skdata[0].typhName"
          :value="item.num_nati"
        >
        </el-option>
      </el-select>
      <el-button type="primary">按钮</el-button>
    </div>
    <div class="page-main">
      <div class="map-container" ref="mapRef"></div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.typhoon {
  .map-container {
    width: 100%;
    height: 100%;
  }
}
</style>