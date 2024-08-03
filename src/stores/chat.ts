import { defineStore } from "pinia";
export const useChatStore = defineStore("chat", {
  state() {
    return {
      /** 未读消息数 */
      unread: 0,
      /** 当前聊天的用户ID */
      chatId: undefined as number | undefined,
      isChatting: false,
      chatType: "friend" as "friend" | "group",
    };
  },
});
