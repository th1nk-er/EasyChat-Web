import type { UserToken } from "@/api/login/types";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      rememberMe: false,
      userToken: {} as UserToken,
      /**
       * 登录表单，务必用 getter 和 setter 获取和设置
       */
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  getters: {
    getLoginForm: (state) => {
      return {
        username: state.loginForm.username,
        password: decrypt(state.loginForm.password) as string,
      };
    },
    getUserToken: (state) => {
      // 如果未定义或过期，返回undefined
      if (
        state.userToken.expireTime === undefined ||
        state.userToken.expireTime < Date.now()
      )
        return undefined;
      return state.userToken;
    },
  },
  actions: {
    setLoginForm(username: string, password: string) {
      this.loginForm.username = username;
      this.loginForm.password = encrypt(password) as string;
    },
  },
  persist: true,
});
