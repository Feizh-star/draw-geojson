<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import MenuItem from '@/layout/components/MenuItem.vue'
const props = defineProps<{
  menuList: RouteRecordRaw[]
}>()
const handleOpen = (key: string, keyPath: string[]) => console.log(key, keyPath)
const handleClose = (key: string, keyPath: string[]) => console.log(key, keyPath)
const handleSelect = (index: string, indexPath: string[]) => console.log(index, indexPath)
</script>
<template>
  <div class="sidebar-menu">
    <el-scrollbar>
      <el-menu default-active="" @open="handleOpen" @close="handleClose" @select="handleSelect">
        <MenuItem v-for="(item, index) in menuList" :key="index" :menu-item="item" parent-path="" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<style lang="scss" scoped>
.sidebar-menu {
  width: 100%;
  height: 100%;
}
</style>