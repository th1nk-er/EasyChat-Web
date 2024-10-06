import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register/Register.vue'),
      meta: {
        title: '注册',
      },
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('@/views/Chat/Chat.vue'),
      meta: {
        title: '聊天',
      },
    },
    {
      path: '/friend',
      name: 'Friend',
      component: () => import('@/views/Friend/Friend.vue'),
      meta: {
        title: '好友',
      },
    },
    {
      path: '/group',
      name: 'Group',
      component: () => import('@/views/Group/Group.vue'),
      meta: {
        title: '群组',
      },
    },
    {
      path: '/setting/:settingType?',
      name: 'Setting',
      component: () => import('@/views/Setting/Setting.vue'),
      meta: {
        title: '设置',
      },
    },
  ],
});

export default router;
