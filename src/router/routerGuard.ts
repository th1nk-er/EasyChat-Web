import NProgress from "nprogress";
import router from "./";

// 路由前置守卫
router.beforeEach((to, from) => {
  if (to.name) NProgress.start();
  if (to.meta.title) {
    document.title = (import.meta.env.VITE_APP_TITLE +
      " - " +
      to.meta.title) as string;
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});
