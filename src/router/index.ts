import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/HomeView.vue'
import { h } from 'vue'
import Layout from '@/layout/Layout.vue'
import { useMenuTree } from '@/stores/menu'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/Home',
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'Home',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Home',
          hidden: true,
        }
      }
    ]
  },
  {
    path: '/404',
    component: {
      render() {
        return h('div', ['404'])
      }
    },
    meta: {
      hidden: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  sensitive: true,
})

router.beforeEach((to, from, next) => {
  // 获取路由
  const menu = useMenuTree()
  if (menu.menuList.length === 0) {
    menu.fetchMenuList().then(() => {
      next({ path: to.path, replace: true })
    })
  } else {
    next()
  }
})
router.afterEach((to, from) => {
})

export default router