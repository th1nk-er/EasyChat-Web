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
    {
      path: "/chat",
      name: "Chat",
      component: () => import("@/views/Chat/Chat.vue"),
      meta: {
        title: "主页",
      },
      children: [
        {
          path: "",
          name: "ChatList",
          component: () =>
            import("@/views/Chat/Children/ChatList/ChatList.vue"),
          meta: {
            title: "聊天列表",
          },
        },
        {
          path: "friend",
          name: "Friend",
          component: () => import("@/views/Chat/Children/Friend/Friend.vue"),
          meta: {
            title: "好友",
          },
        },
      ],
    },
    {
      path: "/setting",
      name: "Setting",
      component: () => import("@/views/Setting/Setting.vue"),
      meta: {
        title: "设置",
      },
    },
  ],
});

export default router;
