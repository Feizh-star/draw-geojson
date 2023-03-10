<script setup lang='ts'>
// import type { UploadProps  } from 'element-plus'
// import { ref } from 'vue'
import { Paperclip } from '@element-plus/icons'

import { useSelFile } from './featureTest/selFile'
import { useFlatten } from './featureTest/flattenEach'
import { useCoord } from './featureTest/coordEach'
import { useFeatureEach } from './featureTest/featureEach'
import { useSimplify } from './featureTest/simplify'

const {
  upload,
  fileName,
  geoJsonData,
  selectFile,
  uploadClick
} = useSelFile()

const {
  callFlatten
} = useFlatten(geoJsonData)

const {
  callCoord
} = useCoord(geoJsonData)

const {
  callFeatureEach
} = useFeatureEach(geoJsonData)

const {
  callSimplify
} = useSimplify(geoJsonData)

function commonClick () {}

</script>

<template>
  <div class="truf-test">
    <section class="btns">
      <el-upload
        ref="upload"
        class="my-upload"
        accept=".json, .geojson"
        :show-file-list="false"
        :multiple="false"
        :limit="1"
        :on-change="selectFile"
        :auto-upload="false"
      >
        <template #trigger>
          <div class="files-list" @click="uploadClick">
            <div class="text-inner" :title="fileName">
              <span>
                <span style="color: #666666;">GeoJson文件：</span>
                <el-icon color="#409EFC" style="cursor: pointer; vertical-align: bottom;">
                  <Paperclip/>
                </el-icon>
                {{ fileName  || '请选择文件' }}
              </span>
            </div>
          </div>
        </template>
      </el-upload>
      <el-button type="primary" @click="callFlatten">flattenEach</el-button>
      <el-button type="primary" @click="callCoord">coordEach</el-button>
      <el-button type="primary" @click="callFeatureEach">featureEach</el-button>
      <el-button type="primary" @click="callSimplify">simplify</el-button>
    </section>
  </div>
</template>

<style lang='scss' scoped>
.truf-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .btns {
    padding: $small-space $small-space 0;
    display: flex;
    align-items: center;
    .my-upload {
      display: inline-flex;
      align-items: center;
      padding-right: 12px;
      :deep(.el-upload) {
        color: #409eff;
      }
    }
    .files-list {
      padding: 0 5px;
      display: inline-flex;
      align-items: center;
      width: fit-content;
      max-width: 400px;
      > .text-inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
} 
</style>