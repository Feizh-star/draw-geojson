import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'
import { useMenu } from '@/stores/menu'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          meta: {
            title: '首页'
          },
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'about',
          name: 'about',
          meta: {
            title: '关于'
          },
          component: () => import('../views/AboutView.vue')
        },
      ]
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

// 执行到这里的时候，pinia还没有安装
setTimeout(() => {
  const menuStore = useMenu()
  // eslint-disable-next-line
  router.afterEach((to, from) => {
    console.log(to)
    const name = (to?.meta?.title || '') as string
    menuStore.setCurrentMenu({
      index: to.fullPath,
      name: name,
      // 目前没有在store中建立全局路由表，菜单也比较简单，所以第一层暂时写死
      menuPath: [
        {
          index: '/menuone',
          name: '目录一',
        },
        {
          index: to.fullPath,
          name: name,
        }
      ]
    })
  })
})

export default router
