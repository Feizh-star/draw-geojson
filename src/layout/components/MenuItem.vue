<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { Ref, ComputedRef } from 'vue'
import { watchEffect } from 'vue'
import { ref, computed, watch } from 'vue'
import AppLink from './AppLink.vue'
import path from 'path-browserify'

const resolvePath = (m: RouteRecordRaw): string => path.resolve('/', props.parentPath, m?.path || '')
const getMenuTitle = (m: RouteRecordRaw): string => (m?.meta?.title || '') as string
const getShowingChildren = (ms: RouteRecordRaw[] | undefined): RouteRecordRaw[] => ms?.filter(c => !c.meta?.hidden) || []

// const path = require('path')
const props = defineProps<{
  menuItem: RouteRecordRaw;
  parentPath: string;
}>()

const showingItem = ref<RouteRecordRaw | null>()
const renderMenuItem: ComputedRef<boolean> = computed(() => !!showingItem.value)
const isHidden: ComputedRef<boolean> = computed(() => !!(props.menuItem.meta && props.menuItem.meta.hidden))
const currentPath: ComputedRef<string> = computed(() => resolvePath(showingItem.value as RouteRecordRaw))
watchEffect(() => hasNextLevelMenu(props.menuItem))

function hasNextLevelMenu(m: RouteRecordRaw): void {
  const children = m.children || []
  const showingChildren = children.filter(c => !c.meta?.hidden)
  if (showingChildren.length === 0) {
    showingItem.value = m
  } else if (showingChildren.length === 1 && !m.meta?.alwaysShow && getShowingChildren(showingChildren[0].children).length === 0) {
    const onlyChildPath = showingChildren[0]?.path || '/'
    const path = onlyChildPath.startsWith("/") ? onlyChildPath : `${m.path}/${onlyChildPath}`
    showingItem.value = { ...showingChildren[0], path } as RouteRecordRaw
  } else {
    showingItem.value = null
  }
}
</script>

<script lang="ts">
export default {
  name: 'MenuItem'
}
</script>

<template>
  <AppLink v-if="!isHidden && renderMenuItem" :to="currentPath">
    <el-menu-item :index="currentPath">
      {{ getMenuTitle(showingItem as RouteRecordRaw) }}
    </el-menu-item>
  </AppLink>
  <el-sub-menu v-if="!isHidden && !renderMenuItem" :index="currentPath">
    <template #title>{{ getMenuTitle(menuItem) }}</template>
    <MenuItem v-for="(item, index) in menuItem.children" :key="index" :menu-item="item"
      :parent-path="resolvePath(menuItem)" />
  </el-sub-menu>
</template>