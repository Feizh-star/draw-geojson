<template>
  <div class="layout-menu">
    <el-scrollbar>
      <el-menu 
        :default-active="activeIndex" 
        class="el-menu-demo" 
        :active-text-color="defaultStyle.textHcolor"
        @select="handleSelect"
      >
        <!-- 目前菜单比较简单，暂时不写递归，后续补充 -->
        <el-sub-menu 
          v-for="(levelone) in menuTree" 
          :key="levelone.index" 
          :index="levelone.index">
          <template #title>
            <span class="menu-subtitle">
              <span class="iconfont icon-yitihuajiankong"></span>
              <span>{{ levelone.name || '' }}</span>
            </span>
          </template>
          <el-menu-item 
            v-for="(leveltwo) in (levelone.children || [])" 
            :key="leveltwo.index" 
            :index="leveltwo.index">
            <span class="menuitem-text">
              <span class="iconfont icon-yuandianxiao-copy"></span>
              <span>{{ leveltwo.name || '' }}</span>
            </span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { 
  ref,
  onMounted,
  computed,
  getCurrentInstance
} from 'vue'
import type { ComponentCustomProperties } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { IMenu } from '@/stores/menu'
import { useMenu } from '@/stores/menu'

const props = defineProps<{
  menuTree: Array<IMenu>
}>()
const menuStore = useMenu()
const router = useRouter()
const route = useRoute()
const globalProperties = getCurrentInstance()?.appContext.config.globalProperties as ComponentCustomProperties
const defaultStyle = globalProperties.$defaultStyle

const menuTree = computed(() => {
  return props.menuTree || [
    {
      index: '/menuone',
      name: '目录一',
      children: [
        {
          index: '/home',
          name: '首页',
        },
        {
          index: '/about',
          name: '关于',
        },
      ]
    }
  ]
})
const currentMenu = menuStore.currentMenu
const activeIndex = ref('/hardmoni')

onMounted(() => {
  activeIndex.value = currentMenu.index
})

// eslint-disable-next-line
function handleSelect(index: string, indexPath: Array<string>): void {
  // console.log(index, indexPath)
  routePush(index)
}
function routePush(path: string) {
  if (path !== route.fullPath) {
    router.push(path)
  }
}
</script>

<style lang="scss" scoped>
$menu-padding: 17px; // 菜单边距
$menu-item-height: 40px; // 菜单高度
$icon-pr: 15px; // 图标右侧间距

$text-color: $text-hcolor;

.layout-menu {
  width: 100%;
  height: 100%;
  padding: $menu-padding 0;
  .menu-subtitle {
    color: $text-color;
    font-size: 18px;
    font-weight: bold;
  }
  .icon-yitihuajiankong {
    color: $text-color;
    font-size: 20px;
    padding-right: $icon-pr;
  }
  .icon-yuandianxiao-copy {
    font-size: 28px;
  }
  .menuitem-text {
    font-size: 16px;
  }
}
:deep(.el-scrollbar) {
  width: 100%;
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-sub-menu__title {
    height: $menu-item-height;
    line-height: $menu-item-height;
  }
  .el-sub-menu .el-menu-item {
    height: $menu-item-height;
    line-height: $menu-item-height;
  }
  
}
</style>