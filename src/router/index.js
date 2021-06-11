import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () =>
  import('@/views/Recommend' /* webpackChunkName: "recommend" */)
const TopList = () =>
  import('@/views/TopList' /* webpackChunkName: "top-list" */)
const TopDetail = () =>
  import('@/views/TopDetail' /* webpackChunkName: "top-detail" */)
const Singer = () => import('@/views/Singer' /* webpackChunkName: "singer" */)
const SingerDetail = () =>
  import('@/views/SingerDetail' /* webpackChunkName: "singer-detail" */)
const Search = () => import('@/views/Search' /* webpackChunkName: "search" */)
const Album = () => import('@/views/Album' /* webpackChunkName: "Album" */)
const UserCenter = () =>
  import('@/views/UserCenter' /* webpackChunkName: "user-center" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [{ path: ':id', component: Album }]
  },
  {
    path: '/singer',
    component: Singer,
    children: [{ path: ':id', component: SingerDetail }]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [{ path: ':id', component: TopDetail }]
  },
  {
    path: '/search',
    component: Search,
    children: [{ path: ':id', component: SingerDetail }]
  },
  {
    path: '/user',
    // <router-view name="user">
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
