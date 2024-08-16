import type { UserToken } from "@/api/login/types";
import type { UserVo } from "@/api/user/types";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userToken: {} as UserToken,
      /**
       * 登录表单，务必用 getter 和 setter 获取和设置
       */
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
      },
      userInfo: {} as UserVo,
    };
  },
  getters: {
    getLoginForm: (state) => {
      return {
        username: state.loginForm.username,
        password: decrypt(state.loginForm.password) as string,
        rememberMe: state.loginForm.rememberMe,
      };
    },
    getUserToken: (state) => {
      // 如果未定义或过期，返回undefined
      if (
        state.userToken.expireTime === undefined ||
        new Date(state.userToken.expireTime) < new Date()
      ) {
        state.userToken = {} as UserToken;
        return undefined;
      }
      return state.userToken;
    },
  },
  actions: {
    setLoginForm(username: string, password: string) {
      this.loginForm.username = username;
      this.loginForm.password = encrypt(password) as string;
      this.loginForm.rememberMe = true;
    },
    removeLoginForm() {
      this.loginForm.username = "";
      this.loginForm.password = "";
      this.loginForm.rememberMe = false;
    },
    removeToken() {
      this.userToken = {} as UserToken;
    },
  },
  persist: {
    paths: ["userToken", "loginForm", "userInfo"],
  },
});
