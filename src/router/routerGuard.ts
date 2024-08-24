import NProgress from "nprogress";
import router from "./";
import { useChatStore } from "@/stores/chat";
// 路由前置守卫
router.beforeEach((to, from) => {
  if (to.name) NProgress.start();
  if (to.meta.title) {
    document.title = (import.meta.env.VITE_APP_TITLE +
      " - " +
      to.meta.title) as string;
  }
  if (to.name != "Chat") {
    const chatStore = useChatStore();
    chatStore.isChatting = false;
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});
