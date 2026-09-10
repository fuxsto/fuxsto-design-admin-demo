import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: (): Promise<Component> => import('@/pages/Login.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/',
    component: (): Promise<Component> => import('@/layouts/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: (): Promise<Component> => import('@/pages/Dashboard.vue'),
        meta: { title: '工作台', icon: 'LayoutDashboard' },
      },
      {
        path: 'users',
        name: 'users',
        component: (): Promise<Component> => import('@/pages/Users.vue'),
        meta: { title: '用户管理', icon: 'Users' },
      },
      {
        path: 'roles',
        name: 'roles',
        component: (): Promise<Component> => import('@/pages/Roles.vue'),
        meta: { title: '角色与权限', icon: 'ShieldCheck' },
      },
      {
        path: 'orders',
        name: 'orders',
        component: (): Promise<Component> => import('@/pages/Orders.vue'),
        meta: { title: '订单管理', icon: 'Package' },
      },
      {
        path: 'form-demo',
        name: 'form-demo',
        component: (): Promise<Component> => import('@/pages/FormDemo.vue'),
        meta: { title: '表单全集', icon: 'FileText' },
      },
      {
        path: 'list-demo',
        name: 'list-demo',
        component: (): Promise<Component> => import('@/pages/ListDemo.vue'),
        meta: { title: '列表筛选', icon: 'ListFilter' },
      },
      {
        path: 'detail/:id',
        name: 'detail',
        component: (): Promise<Component> => import('@/pages/Detail.vue'),
        meta: { title: '详情', icon: 'Eye', hidden: true },
      },
      {
        path: 'feedback',
        name: 'feedback',
        component: (): Promise<Component> => import('@/pages/Feedback.vue'),
        meta: { title: '反馈组件', icon: 'MessageSquare' },
      },
      {
        path: 'data',
        name: 'data',
        component: (): Promise<Component> => import('@/pages/DataDisplay.vue'),
        meta: { title: '数据展示', icon: 'BarChart3' },
      },
      {
        path: 'ai',
        name: 'ai',
        component: (): Promise<Component> => import('@/pages/AIDemo.vue'),
        meta: { title: 'AI 流式', icon: 'Sparkles' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: (): Promise<Component> => import('@/pages/Settings.vue'),
        meta: { title: '系统设置', icon: 'Settings' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: (): Promise<Component> => import('@/pages/Profile.vue'),
        meta: { title: '个人中心', icon: 'UserCircle', hidden: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: (): Promise<Component> => import('@/pages/NotFound.vue'),
    meta: { public: true, title: '页面未找到' },
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Fuxsto Admin Pro'
  document.title = to.meta?.title ? `${to.meta.title} · ${base}` : base
})
