import router from './dataset/router.json'
import type { Router } from '@/types/router/router'

export function getRoutes(): Promise<Router.MyRawRoute[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(router)
    }, 300)
  })
}