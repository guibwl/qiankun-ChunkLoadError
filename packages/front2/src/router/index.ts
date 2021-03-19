import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/A',
    name: 'A',
    meta: {
      title: 'A',
    },
    component: () => import(/* webpackChunkName: "A" */ '@/views/A.vue'),
  },
  {
    path: '/B',
    name: 'B',
    meta: {
      title: 'B',
    },
    component: () => import(/* webpackChunkName: "B" */ '@/views/B.vue'),
  },
];

export default function createRouterHandler() {
  return createRouter({
    history: createWebHistory('/front2'),
    routes,
  });
}
