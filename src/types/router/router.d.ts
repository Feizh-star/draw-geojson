import { RouteMeta } from 'vue-router'

declare namespace Router {
  interface MyRawRoute {
    path: string
    name: string
    component: string
    hidden?: boolean
    meta?: RouteMeta
    children?: Array<MyRawRoute> | null
  }
}