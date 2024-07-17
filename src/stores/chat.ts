import { defineStore } from "pinia";
export const useChatStore = defineStore("chat", {
  state() {
    return {
      /** 未读消息数 */
      unread: 0,
    };
  },
});
