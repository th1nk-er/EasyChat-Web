import NProgress from 'nprogress';
import router from './';
import { useChatStore } from '@/stores/chat';
import { useAppStore } from '@/stores/app';
// 路由前置守卫
router.beforeEach((to, from) => {
  if (to.name) NProgress.start();
  const appStore = useAppStore();
  appStore.loading = true;
  if (to.meta.title) {
    document.title = (import.meta.env.VITE_APP_TITLE +
      ' - ' +
      to.meta.title) as string;
  }
  if (to.name != 'Chat') {
    const chatStore = useChatStore();
    chatStore.chatId = -1;
    chatStore.isChatting = false;
  }
});

router.afterEach((to, from) => {
  NProgress.done();
  const appStore = useAppStore();
  appStore.loading = false;
});
