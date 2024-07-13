import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login/Login.vue"),
      meta: {
        title: "登录",
      },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/Register/Register.vue"),
      meta: {
        title: "注册",
      },
    },
  ],
});

export default router;
