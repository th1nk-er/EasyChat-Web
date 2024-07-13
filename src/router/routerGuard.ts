import router from "./";

// 路由前置守卫
router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});
